#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const YAML = require('yaml');
const { tables, readContract } = require('./process-contract');
const { roleViewErrors } = require('./agent-role-view');
const { markdownStructure, validateLinks } = require('./methodology-link-audit');
const { AuditResult, parseArgs, printResult, rejectGovernedOverrides } = require('./lib');

const ROLE_FILE = 'analysis/agent-roles.md';
const ROLE_IDS = ['pm', 'ba', 'ux', 'architect', 'developer', 'qa'];
const COLUMNS = {
  Roles: ['ID', 'Name', 'Skill', 'Responsibility'],
  'Stage Assignments': ['Stage', 'Lead', 'Mode', 'Support', 'Peer'],
};

function readRoleContract(root) {
  const source = fs.readFileSync(path.join(root, ROLE_FILE), 'utf8');
  const parsed = tables(source);
  // Markdown-it pads short rows and discards extra cells. Check source widths too.
  const lines = source.split(/\r?\n/);
  const tokens = new MarkdownIt().parse(source, {});
  let heading;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'heading_open' && token.tag === 'h2') heading = tokens[i + 1].content;
    if (token.type === 'tr_open' && Object.hasOwn(COLUMNS, heading)) {
      const cells = lines[token.map[0]].trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/);
      if (cells.length !== COLUMNS[heading].length) throw new Error(`Invalid role table row width: ${heading}, line ${token.map[0] + 1}`);
    }
  }
  function records(name) {
    const rows = parsed.get(name), columns = COLUMNS[name];
    if (!rows || JSON.stringify(rows[0]) !== JSON.stringify(columns)) throw new Error(`Invalid role contract table: ${name}`);
    const seen = new Set();
    return rows.slice(1).map(cells => {
      if (cells.length !== columns.length || cells.some(cell => !cell.trim())) throw new Error(`Empty or invalid row: ${name}`);
      if (seen.has(cells[0])) throw new Error(`Duplicate ${name} row: ${cells[0]}`);
      seen.add(cells[0]);
      return cells;
    });
  }
  const roles = records('Roles').map(([id, name, skill, responsibility]) => ({ id, name, skill, responsibility }));
  if (roles.length !== ROLE_IDS.length || ROLE_IDS.some(id => !roles.some(role => role.id === id))) {
    throw new Error(`Roles must contain exactly the six roles: ${ROLE_IDS.join(', ')}`);
  }
  for (const role of roles) {
    if (role.skill !== `.agents/skills/migration-${role.id}/SKILL.md`) throw new Error(`Invalid repository-local skill path for ${role.id}: ${role.skill}`);
  }
  const list = value => value === 'none' ? [] : value.split(';').map(item => item.trim());
  const assignments = records('Stage Assignments').map(([stage, lead, mode, support, peer]) => ({
    stage, lead, mode, support: list(support), peer: list(peer),
  }));
  if (assignments.length !== 20 || assignments.some((row, i) => row.stage !== `stage-${String(i).padStart(2, '0')}`)) {
    throw new Error('Role assignments must cover Bootstrap and Stages 1-19 in order');
  }
  const { flow } = readContract(root);
  for (const [i, row] of assignments.entries()) {
    if (![row.lead, ...row.support, ...row.peer].every(id => ROLE_IDS.includes(id))) throw new Error(`Unknown role in ${row.stage}`);
    for (const key of ['support', 'peer']) {
      if (new Set(row[key]).size !== row[key].length) throw new Error(`Duplicate ${key} role in ${row.stage}`);
    }
    const checkRole = flow[i].checkRole;
    const expectedMode = checkRole === 'independent' ? 'independent-review'
      : checkRole === 'primary' ? 'responsible-check' : i === 0 ? 'coordinate' : 'author';
    if (row.mode !== expectedMode) throw new Error(`${row.stage}: mode must be ${expectedMode} for process-contract checkRole=${checkRole}`);
    if (checkRole === 'peer' ? row.peer.length !== 1 || row.peer[0] !== row.lead : row.peer.length !== 0) {
      throw new Error(`${row.stage}: peer assignment disagrees with process-contract checkRole=${checkRole}`);
    }
    if (i === 0 && row.lead !== 'pm') throw new Error('stage-00: coordination lead must be pm');
    if (i > 0 && [row.lead, ...row.support, ...row.peer].includes('pm')) throw new Error(`${row.stage}: PM coordinates, not a specialist assignee`);
  }
  return { roles, assignments };
}

function requireLinks(root, file, targets, result) {
  const links = markdownStructure(path.join(root, file)).links;
  for (const target of targets) {
    const matches = links.filter(href => {
      if (/^[a-z][a-z\d+.-]*:|^[/\\]/i.test(href)) return false;
      try {
        const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
        if (path.win32.isAbsolute(pathname) || path.posix.isAbsolute(pathname)) return false;
        return path.resolve(root, path.dirname(file), pathname) === path.resolve(root, target);
      } catch { return false; }
    });
    if (!matches.length) result.fail(`${file}: missing explicit local link to ${target}`);
    if (!fs.existsSync(path.join(root, target)) || !fs.statSync(path.join(root, target)).isFile()) {
      result.fail(`${file}: required link target is missing or not a file: ${target}`);
      continue;
    }
    const structure = markdownStructure(path.join(root, target));
    const anchors = new Set([...structure.headings.map(heading => heading.anchor), ...structure.explicitAnchors]);
    for (const href of matches) {
      try {
        const anchor = decodeURIComponent(href.split('#')[1] || '');
        if (anchor && !anchors.has(anchor)) result.fail(`${file}: missing anchor #${anchor} in ${target}`);
      } catch { result.fail(`${file}: invalid local link ${href}`); }
    }
  }
}

function auditAgentRoles(input = {}) {
  const root = path.resolve(input.root || process.env.AUDIT_ROOT || path.join(__dirname, '../..'));
  const result = new AuditResult('AGENT ROLE CONTRACT AUDIT');
  let contract;
  try { contract = readRoleContract(root); }
  catch (error) { result.fail(`${ROLE_FILE}: ${error.message}`); return result; }
  try { result.merge(roleViewErrors(root, contract)); }
  catch (error) { result.fail(`Role presentation check: ${error.message}`); }

  for (const role of contract.roles) {
    try {
      const file = path.join(root, role.skill);
      const source = fs.readFileSync(file, 'utf8');
      const frontmatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
      if (!frontmatter) throw new Error('missing explicit YAML frontmatter');
      const metadata = YAML.parse(frontmatter[1]);
      if (metadata?.name !== `migration-${role.id}`) throw new Error(`frontmatter name must be migration-${role.id}`);
      if (typeof metadata.description !== 'string' || !metadata.description.trim()) throw new Error('frontmatter description must be a nonempty string');
      if (!source.slice(frontmatter[0].length).trim()) throw new Error('skill instructions are empty');
      requireLinks(root, role.skill, ['MIGRATION.md', ROLE_FILE], result);
      validateLinks(root, [file], result);
    } catch (error) { result.fail(`${role.skill}: ${error.message}`); }
  }
  const bridges = {
    'AGENTS.md': ['MIGRATION.md', ROLE_FILE],
    'MIGRATION.md': [ROLE_FILE],
    'CLAUDE.md': ['AGENTS.md', 'MIGRATION.md', ROLE_FILE],
  };
  for (const [file, targets] of Object.entries(bridges)) {
    try { requireLinks(root, file, targets, result); }
    catch (error) { result.fail(`${file}: ${error.message}`); }
  }
  try { validateLinks(root, [path.join(root, ROLE_FILE)], result); }
  catch (error) { result.fail(`${ROLE_FILE}: ${error.message}`); }
  result.summary = `${contract.roles.length} roles and ${contract.assignments.length} stage assignments checked; structural only, not proof of skill reading, ACK truth, runtime isolation or approval`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root'], ['AUDIT_ROOT']);
  process.exitCode = printResult(auditAgentRoles({ root: args.root }));
}

module.exports = { readRoleContract, auditAgentRoles };

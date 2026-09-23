'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { temporaryDirectory } = require('./helpers');
const { tables } = require('./process-contract');
const { AuditResult } = require('./lib');
const { readRoleContract, auditAgentRoles } = require('./agent-role-contract');
const { stageRoleView } = require('./agent-role-view');

const repository = path.resolve(__dirname, '../..');
const roleFile = 'analysis/agent-roles.md';
const skillFile = '.agents/skills/migration-developer/SKILL.md';
const roleIds = ['pm', 'ba', 'ux', 'architect', 'developer', 'qa'];

function write(root, file, content) {
  const absolute = path.join(root, file);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function replace(root, file, before, after) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(content.includes(before), `fixture must contain ${before}`);
  write(root, file, content.replace(before, after));
}

function writeViews(root) {
  const contract = readRoleContract(root);
  const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = [], html = [], cheat = [], drawio = [];
  for (const row of contract.assignments) {
    const view = stageRoleView(contract, row.stage);
    const number = row.stage === 'stage-00' ? 'B' : Number(row.stage.slice(-2));
    const block = content => `<!-- AGENT_ROLE_${number}_START -->\n${content}\n<!-- AGENT_ROLE_${number}_END -->`;
    md.push(block(view.assignment.en));
    html.push(block(escape(view.assignment.en)));
    cheat.push(view.assignment.en);
    drawio.push(escape('Lead: ' + view.actor.en + '; PM coordinates (agent-roles.md)'));
  }
  write(root, 'analysis/migration_methodology.md', md.join('\n'));
  write(root, 'analysis/migration_methodology.html', html.join('\n'));
  write(root, 'analysis/process-cheatsheet.md', cheat.join('\n'));
  write(root, 'analysis/migration_artifact_flow.drawio', drawio.join('\n'));
}

function fixture(t) {
  const root = temporaryDirectory(t, 'agent-role-contract-');
  const sourceTables = tables(fs.readFileSync(path.join(repository, roleFile), 'utf8'));
  const source = ['Roles', 'Stage Assignments'].map(name => {
    const [header, ...rows] = sourceTables.get(name);
    return [`## ${name}`, '', header, header.map(() => '---'), ...rows]
      .map(row => Array.isArray(row) ? `| ${row.join(' | ')} |` : row).join('\n');
  }).join('\n\n');
  write(root, roleFile, source + '\n');
  write(root, 'analysis/process-contract.md', fs.readFileSync(path.join(repository, 'analysis/process-contract.md')));
  write(root, 'AGENTS.md', '[Entry](MIGRATION.md)\n[Roles](analysis/agent-roles.md)\n');
  write(root, 'MIGRATION.md', '[Roles](analysis/agent-roles.md)\n');
  write(root, 'CLAUDE.md', '[Agents](AGENTS.md)\n[Entry](MIGRATION.md)\n[Roles](analysis/agent-roles.md)\n');
  for (const id of roleIds) {
    write(root, `.agents/skills/migration-${id}/SKILL.md`, [
      '---', `name: migration-${id}`, `description: Portable ${id} instructions.`, '---', '',
      `# ${id}`, '', '[Entry](../../../MIGRATION.md)', '[Roles](../../../analysis/agent-roles.md)', '',
    ].join('\n'));
  }
  writeViews(root);
  return root;
}

function failed(root, expected) {
  const result = auditAgentRoles({ root });
  assert.ok(result instanceof AuditResult);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), expected);
}

test('the Markdown API returns six roles and ordered assignments without projection-only fields', () => {
  const contract = readRoleContract(repository);
  assert.deepEqual(contract.roles.map(role => role.id), roleIds);
  assert.deepEqual(Object.keys(contract.roles[0]), ['id', 'name', 'skill', 'responsibility']);
  assert.equal(contract.roles[4].skill, skillFile);
  assert.deepEqual(contract.assignments.map(row => row.stage), Array.from({ length: 20 }, (_, i) => `stage-${String(i).padStart(2, '0')}`));
  assert.deepEqual(contract.assignments[17], { stage: 'stage-17', lead: 'developer', mode: 'author', support: ['ux', 'qa'], peer: ['developer'] });
  assert.deepEqual(contract.assignments[0], { stage: 'stage-00', lead: 'pm', mode: 'coordinate', support: [], peer: [] });
  assert.deepEqual(contract.assignments.filter(row => row.mode === 'independent-review').map(row => row.stage), ['stage-02', 'stage-07', 'stage-10', 'stage-14', 'stage-16', 'stage-19']);
});

test('valid standalone portable files pass without project status or runtime evidence', t => {
  const root = fixture(t);
  const result = auditAgentRoles({ root });
  assert.deepEqual(result.errors, []);
  assert.match(result.summary, /structural only/);
  assert.match(result.summary, /not proof of skill reading, ACK truth, runtime isolation or approval/);
});

test('table parsing accepts CRLF, code cells and escaped pipes in descriptive text', t => {
  const root = fixture(t);
  replace(root, roleFile, '| pm | PM / Coordinator |', '| `pm` | PM \\| Coordinator |');
  const file = path.join(root, roleFile);
  write(root, roleFile, fs.readFileSync(file, 'utf8').replace(/\n/g, '\r\n'));
  assert.equal(readRoleContract(root).roles[0].name, 'PM | Coordinator');
  writeViews(root);
  assert.equal(auditAgentRoles({ root }).ok, true);
});

for (const [label, mutate, expected] of [
  ['missing role', text => text.replace(/^\| qa \|.*\n/m, ''), /exactly the six roles/],
  ['duplicate role', text => text.replace(/^(\| qa \|.*)$/m, '$1\n$1'), /Duplicate Roles row/],
  ['unknown role', text => text.replace('| qa | QA |', '| tester | QA |'), /exactly the six roles/],
  ['empty responsibility', text => text.replace(/^(\| pm \|[^\n]*\|) [^|]+ \|$/m, '$1  |'), /Empty or invalid row/],
  ['wrong header', text => text.replace('| Responsibility |', '| Duties |'), /Invalid role contract table/],
  ['missing table', text => text.replace('## Roles', '## Other Roles'), /Invalid role contract table/],
  ['duplicate table', text => text + '\n## Roles\n\n| ID | Name | Skill | Responsibility |\n|---|---|---|---|\n', /Duplicate contract table/],
  ['surplus cells', text => text.replace('| pm | coordinate | none | none |', '| pm | coordinate | none | none | extra |'), /row width/],
  ['short row', text => text.replace('| pm | coordinate | none | none |', '| pm | coordinate | none |'), /row width/],
  ['missing stage', text => text.replace(/^\| stage-19 \|.*\n/m, ''), /Stages 1-19 in order/],
  ['duplicate stage', text => text.replace('| stage-19 |', '| stage-18 |'), /Duplicate Stage Assignments row/],
  ['out of order stages', text => text.replace('| stage-01 |', '| swap |').replace('| stage-02 |', '| stage-01 |').replace('| swap |', '| stage-02 |'), /Stages 1-19 in order/],
  ['unknown lead', text => text.replace('| stage-01 | ba |', '| stage-01 | owner |'), /Unknown role/],
  ['unknown support', text => text.replace('| ba; developer |', '| ba; owner |'), /Unknown role/],
  ['duplicate support', text => text.replace('| ba; developer |', '| ba; ba |'), /Duplicate support/],
  ['mixed none support', text => text.replace('| ba; developer |', '| ba; none |'), /Unknown role/],
  ['empty support item', text => text.replace('| ba; developer |', '| ba; |'), /Unknown role/],
  ['non-PM bootstrap lead', text => text.replace('| stage-00 | pm |', '| stage-00 | ba |'), /coordination lead must be pm/],
  ['PM replacing a specialist', text => text.replace('| stage-06 | ux |', '| stage-06 | pm |'), /PM coordinates, not a specialist assignee/],
  ['bad mode', text => text.replace('| stage-01 | ba | author |', '| stage-01 | ba | approve |'), /mode must be author/],
  ['independent downgraded to author', text => text.replace('| stage-02 | ba | independent-review |', '| stage-02 | ba | author |'), /checkRole=independent/],
  ['responsible promoted to independent', text => text.replace('| stage-12 | architect | responsible-check |', '| stage-12 | architect | independent-review |'), /checkRole=primary/],
  ['missing peer', text => text.replace('| ux; qa | developer |', '| ux; qa | none |'), /peer assignment disagrees/],
  ['wrong peer role', text => text.replace('| ux; qa | developer |', '| ux; qa | qa |'), /peer assignment disagrees/],
  ['duplicate peer', text => text.replace('| ux; qa | developer |', '| ux; qa | developer; developer |'), /Duplicate peer/],
  ['peer at non-peer stage', text => text.replace('| stage-19 | qa | independent-review | none | none |', '| stage-19 | qa | independent-review | none | developer |'), /peer assignment disagrees/],
  ['outside skill path', text => text.replace(skillFile, '../outside/SKILL.md'), /repository-local skill path/],
  ['absolute skill path', text => text.replace(skillFile, 'C:/skills/SKILL.md'), /repository-local skill path/],
  ['remote skill path', text => text.replace(skillFile, 'https://example.com/SKILL.md'), /repository-local skill path/],
  ['wrong skill mapping', text => text.replace(skillFile, '.agents/skills/migration-qa/SKILL.md'), /repository-local skill path/],
]) {
  test(`rejects ${label}`, t => {
    const root = fixture(t);
    const before = fs.readFileSync(path.join(root, roleFile), 'utf8');
    const after = mutate(before);
    assert.notEqual(after, before, 'negative fixture must change its input');
    write(root, roleFile, after);
    assert.throws(() => readRoleContract(root), expected);
    failed(root, expected);
  });
}

test('check mode is compared with process-contract, not a copied stage-number list', t => {
  const root = fixture(t);
  replace(root, 'analysis/process-contract.md', '| stage-01 | none | no |', '| stage-01 | independent | no |');
  failed(root, /stage-01: mode must be independent-review/);
});

for (const file of [roleFile, 'analysis/process-contract.md', skillFile, 'AGENTS.md', 'MIGRATION.md', 'CLAUDE.md']) {
  test(`missing ${file} fails closed`, t => {
    const root = fixture(t);
    fs.unlinkSync(path.join(root, file));
    failed(root, /ENOENT|missing/);
  });
}

for (const [label, before, after, expected] of [
  ['frontmatter absent', '---\nname:', 'name:', /explicit YAML frontmatter/],
  ['wrong name', 'name: migration-developer', 'name: migration-qa', /frontmatter name/],
  ['empty description', 'description: Portable developer instructions.', 'description:', /frontmatter description/],
  ['non-string description', 'description: Portable developer instructions.', 'description: [one, two]', /frontmatter description/],
  ['duplicate YAML keys', 'name: migration-developer', 'name: migration-developer\nname: migration-developer', /unique/],
  ['missing entry instruction link', '[Entry](../../../MIGRATION.md)', '`MIGRATION.md`', /missing explicit local link/],
  ['broken local instruction', '[Entry](../../../MIGRATION.md)', '[Entry](../../../MIGRATION.md)\n[Procedure](../../../missing.md)', /links to missing/],
  ['broken local anchor', '[Entry](../../../MIGRATION.md)', '[Entry](../../../MIGRATION.md#missing)', /missing anchor/],
  ['absolute local link', '[Entry](../../../MIGRATION.md)', '[Entry](../../../MIGRATION.md)\n[Absolute](C:/missing.md)', /non-portable absolute/],
  ['outside local link', '[Entry](../../../MIGRATION.md)', '[Entry](../../../MIGRATION.md)\n[Outside](../../../../missing.md)', /escapes/],
]) {
  test(`rejects skill ${label}`, t => {
    const root = fixture(t);
    replace(root, skillFile, before, after);
    failed(root, expected);
  });
}

test('a directory at a skill path is not a loaded skill', t => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, skillFile));
  fs.mkdirSync(path.join(root, skillFile));
  failed(root, /EISDIR|EACCES|EPERM/);
});

test('an empty skill body fails', t => {
  const root = fixture(t);
  write(root, skillFile, '---\nname: migration-developer\ndescription: Developer\n---\n');
  failed(root, /skill instructions are empty/);
});

for (const [file, href] of [['AGENTS.md', 'MIGRATION.md'], ['AGENTS.md', 'analysis/agent-roles.md'], ['MIGRATION.md', 'analysis/agent-roles.md'], ['CLAUDE.md', 'AGENTS.md'], ['CLAUDE.md', 'MIGRATION.md'], ['CLAUDE.md', 'analysis/agent-roles.md']]) {
  test(`${file} needs an explicit bridge to ${href}, not a plain mention`, t => {
    const root = fixture(t);
    replace(root, file, `](${href})`, `] ${href}`);
    failed(root, /missing explicit local link/);
  });
}

test('CLI reports success and nonzero failure using the standard audit result', t => {
  const root = fixture(t);
  const run = () => spawnSync(process.execPath, [path.join(__dirname, 'agent-role-contract.js'), `--root=${root}`], {
    encoding: 'utf8', env: { ...process.env, AUDIT_TEST_MODE: '1' },
  });
  const good = run();
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /AGENT ROLE CONTRACT AUDIT OK/);
  fs.unlinkSync(path.join(root, skillFile));
  const bad = run();
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /AGENT ROLE CONTRACT AUDIT FAILED/);
});

test('broken entry anchors and role-guide links fail closed', t => {
  const root = fixture(t);
  replace(root, 'AGENTS.md', '](MIGRATION.md)', '](MIGRATION.md#missing)');
  failed(root, /missing anchor #missing/);
  replace(root, 'AGENTS.md', '](MIGRATION.md#missing)', '](MIGRATION.md)');
  fs.appendFileSync(path.join(root, roleFile), '\n[Missing procedure](missing.md)\n');
  failed(root, /links to missing missing.md/);
});

test('role projection errors are merged and missing presentation files are caught', t => {
  const root = fixture(t);
  replace(root, 'analysis/migration_methodology.md', 'AGENT_ROLE_12_START', 'OLD_ROLE_12_START');
  failed(root, /stage-12: stale md role\/skill handoff/);
  fs.unlinkSync(path.join(root, 'analysis/migration_methodology.html'));
  failed(root, /Role presentation check:.*ENOENT/);
});

test('CLI does not allow governed root overrides outside test mode', t => {
  const root = fixture(t);
  const result = spawnSync(process.execPath, [path.join(__dirname, 'agent-role-contract.js'), `--root=${root}`], {
    encoding: 'utf8', env: { ...process.env, AUDIT_TEST_MODE: '0' },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Governed audit target overrides are disabled/);
});

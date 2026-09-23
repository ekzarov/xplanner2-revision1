'use strict';

const { execFileSync } = require('node:child_process');
const preventionPath = 'analysis/error-prevention-checklist.md';

const allowedRecordPaths = [
  /^analysis\/error-prevention-checklist\.md$/,
  /^analysis\/legacy_user_flows\.xlsx$/,
  /^analysis\/migration_status\.yaml$/,
  /^specs\/traceability\.md$/,
  /^analysis\/reviews\/stage-17-pass-[0-9]+\.md$/,
  /^analysis\/stages\/stage-18\/(?:current-delivery-record\.txt|[^/]+\.md|evidence\/[^/]+\.json)$/,
  /^specs\/[0-9]{3}-[a-z0-9][a-z0-9-]*\/tasks\.md$/,
];
const taskPath = /^specs\/[0-9]{3}-[a-z0-9][a-z0-9-]*\/tasks\.md$/;
const immutableRecordPath = /^(?:analysis\/reviews\/stage-17-pass-[0-9]+\.md|analysis\/stages\/stage-18\/(?:[^/]+\.md|evidence\/[^/]+\.json))$/;

function findDisallowedAttestationPaths(paths) {
  return [...new Set(paths
    .map((value) => value.trim().replaceAll('\\', '/'))
    .filter(Boolean)
    .filter((value) => !allowedRecordPaths.some((pattern) => pattern.test(value))))]
    .sort();
}

function readAttestationHistory(root, candidate, head = 'HEAD') {
  const output = execFileSync(
    'git',
    ['-C', root, 'log', '--full-history', '-m', '--format=', '--name-only', '--no-renames', `${candidate}..${head}`, '--'],
    { encoding: 'utf8' },
  );
  return output.split(/\r?\n/);
}

function readRevisionFile(root, revision, file) {
  try {
    return execFileSync('git', ['-C', root, 'show', `${revision}:${file}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function readFileHistory(root, candidate, head, file) {
  const output = execFileSync(
    'git',
    ['-C', root, 'log', '--full-history', '-m', '--format=%H', '--reverse', `${candidate}..${head}`, '--', file],
    { encoding: 'utf8' },
  ).trim();
  return output ? [...new Set(output.split(/\r?\n/).filter(line => /^[a-f0-9]{40}$/.test(line)))] : [];
}

function isCheckboxOnlyTaskTransition(before, after) {
  if (before === null || after === null) return false;
  const oldLines = before.replaceAll('\r\n', '\n').split('\n');
  const newLines = after.replaceAll('\r\n', '\n').split('\n');
  if (oldLines.length !== newLines.length) return false;
  return oldLines.every((line, index) =>
    line === newLines[index] ||
    (/^- \[ \] /.test(line) && newLines[index] === line.replace('- [ ] ', '- [x] ')));
}

function isEvidenceOnlyIndexTransition(before, after, readEvidence) {
  if (before === null || after === null) return false;
  const oldLines = before.replaceAll('\r\n', '\n').split('\n');
  const newLines = after.replaceAll('\r\n', '\n').split('\n');
  if (oldLines.length !== newLines.length) return false;
  if (oldLines.filter(line => line === '## Slice Verification Index').length !== 1) return false;
  let inIndex = false;
  return oldLines.every((line, index) => {
    if (/^## /.test(line)) inIndex = line === '## Slice Verification Index';
    if (line === newLines[index]) return true;
    if (!inIndex) return false;
    const cells = value => value.trim().split('|').slice(1, -1).map(cell => cell.trim());
    const oldRow = cells(line), newRow = cells(newLines[index]);
    if (oldRow.length !== 5 || newRow.length !== 5 || !/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(oldRow[0]) ||
        oldRow.slice(0, 3).some((cell, i) => cell !== newRow[i]) ||
        !['planned', 'missing', 'recorded'].includes(oldRow[4]) || newRow[4] !== 'recorded') return false;
    const links = value => [...value.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)].map(match => match[0]);
    const previous = oldRow[3] === '-' ? [] : links(oldRow[3]);
    const next = links(newRow[3]);
    if (previous.some(link => !next.includes(link)) || next.length <= previous.length || new Set(next).size !== next.length) return false;
    if (newRow[3].replace(/\[[^\]]+\]\([^\s)]+\)/g, '').replace(/[,;\s]/g, '')) return false;
    return next.filter(link => !previous.includes(link)).every(link => {
      const target = link.match(/\]\(([^)]+)\)$/)[1];
      if (!/^\.\.\/analysis\/stages\/stage-18\/[a-zA-Z0-9_-]+\.md(?:#[a-zA-Z0-9_-]+)?$/.test(target)) return false;
      const content = readEvidence(target.slice(3).split('#')[0]);
      return typeof content === 'string' && content.split(/\r?\n/).includes(`- Slice: ${oldRow[0]}`);
    });
  });
}

function isAdditivePreventionTransition(before, after) {
  const { validateChecklist } = require('./error-prevention-audit');
  if (before === null || after === null) return false;
  const previous = before.replaceAll('\r\n', '\n').trimEnd();
  const current = after.replaceAll('\r\n', '\n').trimEnd();
  const oldTable = validateChecklist(previous), newTable = validateChecklist(current);
  if (oldTable.errors.length || newTable.errors.length || newTable.count <= oldTable.count) return false;
  if (!current.startsWith(previous + '\n')) return false;
  return current.slice(previous.length + 1).split('\n').every(line => /^\s*\|/.test(line));
}

function validateAttestationHistory(root, candidate, head = 'HEAD') {
  execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', candidate, head], { stdio: 'pipe' });
  const paths = [...new Set(readAttestationHistory(root, candidate, head)
    .map((value) => value.trim().replaceAll('\\', '/'))
    .filter(Boolean))];
  const disallowed = new Set(findDisallowedAttestationPaths(paths));
  const parentCache = new Map();
  const parentsOf = revision => {
    if (!parentCache.has(revision)) {
      const line = execFileSync('git', ['-C', root, 'rev-list', '--parents', '-n', '1', revision], { encoding: 'utf8' }).trim();
      parentCache.set(revision, line.split(/\s+/).slice(1));
    }
    return parentCache.get(revision);
  };
  for (const file of paths) {
    const typed = taskPath.test(file) || file === 'specs/traceability.md' || file === preventionPath;
    if (!typed && !immutableRecordPath.test(file)) continue;
    const history = readFileHistory(root, candidate, head, file);
    if (!history.length && readRevisionFile(root, candidate, file) !== readRevisionFile(root, head, file)) disallowed.add(file);
    for (const revision of history) {
      const current = readRevisionFile(root, revision, file);
      // Validate every graph edge, including merged side branches, not a date-ordered chain.
      for (const parent of parentsOf(revision)) {
        const previous = readRevisionFile(root, parent, file);
        if (previous === current) continue;
        const valid = file === preventionPath ? isAdditivePreventionTransition(previous, current)
          : taskPath.test(file) ? isCheckboxOnlyTaskTransition(previous, current)
          : file === 'specs/traceability.md'
            ? isEvidenceOnlyIndexTransition(previous, current, evidence => readRevisionFile(root, revision, evidence))
            : previous === null && current !== null;
        if (!valid) disallowed.add(file);
      }
    }
  }
  return [...disallowed].sort();
}

if (require.main === module) {
  const [root, candidate, head = 'HEAD'] = process.argv.slice(2);
  if (!root || !candidate) {
    process.stderr.write('Usage: node verify-attestation-history.js <repo> <candidate> [head]\n');
    process.exit(2);
  }
  const disallowed = validateAttestationHistory(root, candidate, head);
  if (disallowed.length > 0) {
    process.stderr.write(`${disallowed.join('\n')}\n`);
    process.exit(1);
  }
}

module.exports = {
  findDisallowedAttestationPaths,
  isCheckboxOnlyTaskTransition,
  isAdditivePreventionTransition,
  isEvidenceOnlyIndexTransition,
  readAttestationHistory,
  readFileHistory,
  validateAttestationHistory,
};

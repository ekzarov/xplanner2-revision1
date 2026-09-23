'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');
const {
  findDisallowedAttestationPaths,
  isEvidenceOnlyIndexTransition,
  isAdditivePreventionTransition,
  validateAttestationHistory,
} = require('./verify-attestation-history');

test('records-only reconciliation permits exact governed record paths', () => {
  assert.deepEqual(findDisallowedAttestationPaths([
    'analysis/legacy_user_flows.xlsx',
    'analysis/migration_status.yaml',
    'analysis/error-prevention-checklist.md',
    'analysis/reviews/stage-17-pass-143.md',
    'analysis/stages/stage-18/delivery.md',
    'specs/031-ical-feed/tasks.md',
  ]), []);
});

test('records-only reconciliation rejects implementation and planning paths', () => {
  assert.deepEqual(findDisallowedAttestationPaths([
    'src/application.ts',
    'build/deploy.ps1',
    'specs/031-ical-feed/plan.md',
  ]), [
    'build/deploy.ps1',
    'specs/031-ical-feed/plan.md',
    'src/application.ts',
  ]);
});

test('history validation sees a forbidden intermediate change even when later restored', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'attestation-history-'));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim();
  try {
    git('init', '--quiet');
    git('config', 'user.email', 'audit@example.invalid');
    git('config', 'user.name', 'Audit Fixture');
    fs.mkdirSync(path.join(directory, 'src'), { recursive: true });
    fs.mkdirSync(path.join(directory, 'analysis', 'stages', 'stage-18'), { recursive: true });
    fs.writeFileSync(path.join(directory, 'src', 'runtime.txt'), 'original\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'candidate');
    const candidate = git('rev-parse', 'HEAD');

    fs.writeFileSync(path.join(directory, 'src', 'runtime.txt'), 'changed\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'forbidden intermediate change');
    fs.writeFileSync(path.join(directory, 'src', 'runtime.txt'), 'original\n');
    fs.writeFileSync(path.join(directory, 'analysis', 'stages', 'stage-18', 'record.md'), 'closed\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'restore and close');

    assert.deepEqual(validateAttestationHistory(directory, candidate), ['src/runtime.txt']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('stage-18 executable tooling is not a record path', () => {
  assert.deepEqual(findDisallowedAttestationPaths([
    'analysis/stages/stage-18/current-delivery-record.txt',
    'analysis/stages/stage-18/delivery.md',
    'analysis/stages/stage-18/evidence/journey-abc123-live.json',
    'analysis/stages/stage-18/close-slice-batch.js',
    'analysis/stages/stage-18/close-slice-batch.test.js',
  ]), [
    'analysis/stages/stage-18/close-slice-batch.js',
    'analysis/stages/stage-18/close-slice-batch.test.js',
  ]);
});

test('traceability attestation permits only additive, slice-bound delivery evidence cells', () => {
  const before = '# Traceability\n## Slice Verification Index\n| 001-first | spec | plan | - | planned |\n## Coverage\nStable requirements.\n';
  const after = before.replace('| - | planned |', '| [delivery](../analysis/stages/stage-18/delivery-001.md) | recorded |');
  const read = file => file === 'analysis/stages/stage-18/delivery-001.md' ? '- Slice: 001-first\n' : null;
  assert(isEvidenceOnlyIndexTransition(before, after, read));
  for (const invalid of [after.replace('Stable requirements.', 'Changed requirements.'), after.replace('| spec |', '| changed |'), after.replace('delivery-001.md', 'missing.md'), after.replace('recorded |', 'passed |')]) {
    assert.equal(isEvidenceOnlyIndexTransition(before, invalid, read), false);
  }
  assert.equal(isEvidenceOnlyIndexTransition(before, after, () => '- Slice: 002-other\n'), false);
  assert.equal(isEvidenceOnlyIndexTransition(after, before, read), false);
});

test('records-only history rejects intermediate edits to allowed files even when restored', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'attestation-index-'));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  try {
    git('init', '--quiet'); git('config', 'user.email', 'audit@example.invalid'); git('config', 'user.name', 'Audit Fixture');
    fs.mkdirSync(path.join(root, 'specs/001-first'), { recursive: true });
    const index = '# Traceability\n## Slice Verification Index\n| 001-first | spec | plan | - | planned |\n';
    fs.writeFileSync(path.join(root, 'specs/traceability.md'), index);
    fs.writeFileSync(path.join(root, 'specs/001-first/tasks.md'), '- [ ] T1 implement agreed behavior\n');
    git('add', '.'); git('commit', '--quiet', '-m', 'candidate');
    const candidate = git('rev-parse', 'HEAD');
    fs.mkdirSync(path.join(root, 'analysis/stages/stage-18'), { recursive: true });
    fs.writeFileSync(path.join(root, 'analysis/stages/stage-18/delivery-001.md'), '- Slice: 001-first\n');
    const recorded = index.replace('| - | planned |', '| [delivery](../analysis/stages/stage-18/delivery-001.md) | recorded |');
    fs.writeFileSync(path.join(root, 'specs/traceability.md'), recorded);
    git('add', '.'); git('commit', '--quiet', '-m', 'append slice evidence');
    assert.deepEqual(validateAttestationHistory(root, candidate), []);
    fs.writeFileSync(path.join(root, 'specs/traceability.md'), recorded.replace('| spec |', '| changed scope |'));
    fs.writeFileSync(path.join(root, 'specs/001-first/tasks.md'), '- [ ] T1 different behavior\n');
    git('add', '.'); git('commit', '--quiet', '-m', 'forbidden edits');
    fs.writeFileSync(path.join(root, 'specs/traceability.md'), recorded);
    fs.writeFileSync(path.join(root, 'specs/001-first/tasks.md'), '- [x] T1 implement agreed behavior\n');
    git('add', '.'); git('commit', '--quiet', '-m', 'restore and check task');
    assert.deepEqual(validateAttestationHistory(root, candidate), ['specs/001-first/tasks.md', 'specs/traceability.md']);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('merge history cannot hide side-branch removal and restoration of learned checks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'attestation-prevention-merge-'));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  const relative = 'analysis/error-prevention-checklist.md';
  const header = '| Check | When applicable | Basis | How to check |\n|---|---|---|---|\n';
  const row = '| CHK-001: Check navigation | UI scope | [Finding](finding.md) [Rule](rule.md) | Compare governed routes. |\n';
  try {
    git('init', '--quiet'); git('config', 'user.email', 'audit@example.invalid'); git('config', 'user.name', 'Audit Fixture');
    fs.mkdirSync(path.join(root, 'analysis'));
    fs.writeFileSync(path.join(root, relative), header + row);
    git('add', '.'); git('commit', '--quiet', '-m', 'candidate');
    const candidate = git('rev-parse', 'HEAD'), main = git('branch', '--show-current');
    git('switch', '-c', 'side');
    fs.writeFileSync(path.join(root, relative), header);
    git('add', '.'); git('commit', '--quiet', '-m', 'remove learned check');
    fs.writeFileSync(path.join(root, relative), header + row);
    git('add', '.'); git('commit', '--quiet', '-m', 'restore learned check');
    git('switch', main);
    git('commit', '--allow-empty', '--quiet', '-m', 'main records checkpoint');
    git('merge', '--no-ff', '-s', 'ours', 'side', '-m', 'merge restored branch');
    assert.deepEqual(validateAttestationHistory(root, candidate), [relative]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('tasks.md reconciliation accepts checkbox flips only', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'attestation-tasks-'));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim();
  try {
    git('init', '--quiet');
    git('config', 'user.email', 'audit@example.invalid');
    git('config', 'user.name', 'Audit Fixture');
    const tasksDirectory = path.join(directory, 'specs', '031-ical-feed');
    fs.mkdirSync(tasksDirectory, { recursive: true });
    const tasksFile = path.join(tasksDirectory, 'tasks.md');
    fs.writeFileSync(tasksFile, '# Tasks\n\n- [ ] T1 deploy\n- [ ] T2 reconcile\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'candidate');
    const candidate = git('rev-parse', 'HEAD');

    fs.writeFileSync(tasksFile, '# Tasks\n\n- [x] T1 deploy\n- [ ] T2 reconcile\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'checkbox flip');
    assert.deepEqual(validateAttestationHistory(directory, candidate), []);

    fs.writeFileSync(tasksFile, '# Tasks\n\n- [x] T1 deploy\n- [x] T2 reconcile, reworded scope\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'reworded task');
    assert.deepEqual(validateAttestationHistory(directory, candidate), [
      'specs/031-ical-feed/tasks.md',
    ]);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('records-only attestation makes a newly added record immutable', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'attestation-immutable-'));
  const git = (...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim();
  try {
    git('init', '--quiet');
    git('config', 'user.email', 'audit@example.invalid');
    git('config', 'user.name', 'Audit Fixture');
    fs.writeFileSync(path.join(directory, 'candidate.txt'), 'candidate\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'candidate');
    const candidate = git('rev-parse', 'HEAD');

    const recordDirectory = path.join(directory, 'analysis', 'stages', 'stage-18');
    fs.mkdirSync(recordDirectory, { recursive: true });
    const record = path.join(recordDirectory, 'new-delivery.md');
    fs.writeFileSync(record, 'immutable\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'add record');
    assert.deepEqual(validateAttestationHistory(directory, candidate), []);

    fs.writeFileSync(record, 'rewritten\n');
    git('add', '.');
    git('commit', '--quiet', '-m', 'rewrite record');
    assert.deepEqual(validateAttestationHistory(directory, candidate), [
      'analysis/stages/stage-18/new-delivery.md',
    ]);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('records-only prevention updates append checks without weakening prior rows', () => {
  const header = '| Check | When applicable | Basis | How to check |\n|---|---|---|---|\n';
  const row = '| CHK-001: Check navigation | UI scope | [Finding](finding.md) [Rule](rule.md) | Compare governed routes. |\n';
  const next = row.replace('CHK-001', 'CHK-002').replace('Check navigation', 'Check write rejection').replace('UI scope', 'Persistence scope');
  assert.equal(isAdditivePreventionTransition(header, header + row), true);
  assert.equal(isAdditivePreventionTransition(header + row, header + row + next), true);
  for (const after of [header, header + row.replace('UI scope', 'Never'), header + row + row, header + row + '\n' + next, header + row + '\nA weaker rule.\n', null]) {
    assert.equal(isAdditivePreventionTransition(header + row, after), false);
  }
  assert.equal(isAdditivePreventionTransition(null, header + row), false);
});

test('history detects an intermediate weakening of learned checks even when restored', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'attestation-prevention-'));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  const relative = 'analysis/error-prevention-checklist.md';
  const before = '| Check | When applicable | Basis | How to check |\n|---|---|---|---|\n';
  const row = '| CHK-001: Check navigation | UI scope | [Finding](finding.md) [Rule](rule.md) | Compare governed routes. |\n';
  try {
    git('init', '--quiet'); git('config', 'user.email', 'audit@example.invalid'); git('config', 'user.name', 'Audit Fixture');
    fs.mkdirSync(path.join(root, 'analysis'));
    fs.writeFileSync(path.join(root, relative), before);
    git('add', '.'); git('commit', '--quiet', '-m', 'candidate');
    const candidate = git('rev-parse', 'HEAD');
    fs.writeFileSync(path.join(root, relative), before + row);
    git('add', '.'); git('commit', '--quiet', '-m', 'learn confirmed check');
    assert.deepEqual(validateAttestationHistory(root, candidate), []);
    fs.writeFileSync(path.join(root, relative), before);
    git('add', '.'); git('commit', '--quiet', '-m', 'remove check');
    fs.writeFileSync(path.join(root, relative), before + row);
    git('add', '.'); git('commit', '--quiet', '-m', 'restore check');
    assert.deepEqual(validateAttestationHistory(root, candidate), [relative]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { temporaryDirectory } = require('./helpers');
const { indexErrors } = require('./traceability-index');

function fixture(t) {
  const root = path.join(temporaryDirectory(t, 'trace-index-'), 'specs');
  const feature = '001-example';
  fs.mkdirSync(path.join(root, feature), { recursive: true });
  for (const file of ['spec.md', 'plan.md', 'tasks.md', 'test-plan.md', 'verification.md']) {
    fs.writeFileSync(path.join(root, feature, file), '# Existing record\n');
  }
  const row = `| ${feature} | [spec](${feature}/spec.md), [plan](${feature}/plan.md), [tasks](${feature}/tasks.md) | [checks](${feature}/test-plan.md) | - | planned |`;
  const body = '## Slice Verification Index\n| Feature | SDD | Verification plan | Recorded evidence | Evidence state |\n|---|---|---|---|---|\n' + row;
  return { root, feature, row, body };
}

test('planned and missing results are honest design states but cannot close delivery', t => {
  const { root, feature, body } = fixture(t);
  for (const state of ['planned', 'missing']) {
    const text = body.replace('planned |', state + ' |');
    assert.deepEqual(indexErrors(text, root, [feature]), []);
    assert(indexErrors(text, root, [feature], true).some(x => x.includes('completion requires')));
  }
});

test('recorded links are structural evidence, not a parsed pass verdict', t => {
  const { root, feature, body } = fixture(t);
  fs.writeFileSync(path.join(root, feature, 'verification.md'), '# Run\nResult: fail\n');
  const text = body.replace('- | planned', `[run](${feature}/verification.md) | recorded`);
  assert.deepEqual(indexErrors(text, root, [feature], true), []);
});

test('rejects absent/duplicate features, malformed tables, invented states and wrong SDD links', t => {
  const { root, feature, body, row } = fixture(t);
  for (const text of ['', body + '\n' + row, body.replace('| SDD |', '| Design |'),
    body.replace('planned |', 'passed |'), body.replace(`${feature}/spec.md`, `${feature}/plan.md`),
    body.replace(feature, '002-unknown'), body.replace(row, '| broken |')]) {
    assert(indexErrors(text, root, [feature]).length, text);
  }
});

test('rejects absent files, external/escaping references and plans masquerading as results', t => {
  const { root, feature, body } = fixture(t);
  for (const target of [`${feature}/missing.md`, 'https://example.test/result.md', '../../escape.md',
    `${feature}/test-plan.md`, `${feature}/spec.md`]) {
    const text = body.replace('- | planned', `[run](${target}) | recorded`);
    assert(indexErrors(text, root, [feature]).length, target);
  }
  assert(indexErrors(body.replace('- | planned', '- | recorded'), root, [feature]).length);
});

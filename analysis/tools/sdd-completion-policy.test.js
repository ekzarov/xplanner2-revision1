'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  completionPolicyFromFile,
  requiresSddCompletion,
} = require('./sdd-completion-policy');
const { temporaryDirectory } = require('./helpers');

test('defers completion mode while a slice is not yet delivered', () => {
  for (const sliceStatus of ['not_started', 'planning', 'approved', 'in_progress', 'blocked']) {
    assert.equal(requiresSddCompletion({ delivery: { slice_status: sliceStatus } }), false);
  }
});

test('requires completion mode automatically for delivered states', () => {
  for (const sliceStatus of ['deployed', 'accepted']) {
    assert.equal(requiresSddCompletion({ delivery: { slice_status: sliceStatus } }), true);
  }
});

test('fails closed for a missing or unknown delivery status', () => {
  assert.throws(() => requiresSddCompletion({}), /delivery\.slice_status/);
  assert.throws(
    () => requiresSddCompletion({ delivery: { slice_status: 'done-ish' } }),
    /unsupported value/,
  );
});

test('reads the governed YAML status structurally', (t) => {
  const directory = temporaryDirectory(t, 'sdd-completion-policy-');
  const statusFile = path.join(directory, 'migration_status.yaml');
  fs.writeFileSync(statusFile, 'delivery:\n  slice_status: in_progress\n', 'utf8');
  assert.equal(completionPolicyFromFile(statusFile), false);

  fs.writeFileSync(statusFile, 'delivery:\n  slice_status: deployed\n', 'utf8');
  assert.equal(completionPolicyFromFile(statusFile), true);

  fs.writeFileSync(statusFile, 'delivery:\n  slice_status: deployed\n  slice_status: accepted\n', 'utf8');
  assert.throws(() => completionPolicyFromFile(statusFile), /Map keys must be unique/);
});

test('governed CI delegates completion mode to the status policy', () => {
  const workflow = fs.readFileSync(
    path.join(__dirname, '..', '..', '.github', 'workflows', 'starter-audit.yml'),
    'utf8',
  );
  assert.match(workflow, /sdd-completion-policy\.js/);
  assert.match(workflow, /if \(\$sddCompletionPolicy -eq 'required'\)/);
  assert.match(workflow, /Invoke-Audit 'audit:sdd:slice'/);
});

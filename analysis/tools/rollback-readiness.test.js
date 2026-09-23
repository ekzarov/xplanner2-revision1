'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { temporaryDirectory } = require('./helpers');
const { sha256File } = require('./lib');
const { rollbackReadinessErrors } = require('./rollback-readiness');

function fixture(t) {
  const root = temporaryDirectory(t, 'rollback-readiness-');
  const record = path.join(root, 'delivery.md');
  const body = [
    '# Delivery', '- Result: passed', '## Rollback Readiness',
    '- Recovery strategy: rollback',
    '- Governed command or procedure: build/rollback.ps1',
    '- Checked revision: abcdef123456',
    '- Environment ID: demo',
    '- Verified at: 2026-01-01T12:00:00Z',
    '- Performed by: release-agent',
    '- Recovery target: previous immutable release 123456abcdef',
    '- Preconditions and data compatibility: unchanged schema; previous package available',
    '- Validation mode: controlled-rehearsal',
    '- Validation performed for this revision: isolated failure and recovery rehearsal',
    '- Expected outcome: previous version returns ready',
    '- Observed outcome: prior version restored and readiness returned 200',
    '- Result: passed',
    '- Limitations: concurrent writes were not exercised',
    '- Evidence: inline',
    '```text', 'failed_release=abcdef123456', 'restored_release=123456abcdef', 'readiness=200', '```',
    '## Other Checks', '- Result: failed',
  ].join('\n');
  fs.writeFileSync(record, body);
  return { root, record, body, revision: 'abcdef123456', environmentId: 'demo' };
}

test('accepts scoped inline evidence without requiring another artifact', t => {
  assert.deepEqual(rollbackReadinessErrors(fixture(t)), []);
});

test('accepts readiness checks and forward recovery without pretending a rollback ran', t => {
  const f = fixture(t);
  f.body = f.body.replace('Recovery strategy: rollback', 'Recovery strategy: forward-recovery')
    .replace('Validation mode: controlled-rehearsal', 'Validation mode: readiness-check');
  assert.deepEqual(rollbackReadinessErrors(f), []);
});

for (const [label, from, to, error] of [
  ['missing section', '## Rollback Readiness', '## Deployment', 'exactly one'],
  ['wrong revision', 'Checked revision: abcdef123456', 'Checked revision: 1111111', 'Checked revision'],
  ['wrong environment', 'Environment ID: demo', 'Environment ID: production', 'Environment ID'],
  ['failed recovery despite passed delivery', '- Result: passed\n- Limitations:', '- Result: failed\n- Limitations:', 'only passed'],
  ['blocked recovery', '- Result: passed\n- Limitations:', '- Result: blocked\n- Limitations:', 'only passed'],
  ['not run', '- Result: passed\n- Limitations:', '- Result: not-run\n- Limitations:', 'only passed'],
  ['missing procedure', '- Governed command or procedure: build/rollback.ps1', '', 'Governed command'],
  ['placeholder scope', 'Recovery target: previous immutable release 123456abcdef', 'Recovery target: <target>', 'Recovery target'],
  ['duplicate result', '- Result: passed\n- Limitations:', '- Result: passed\n- Result: failed\n- Limitations:', 'duplicate field'],
  ['future date', '2026-01-01T12:00:00Z', '2999-01-01T12:00:00Z', 'Verified at'],
  ['invalid mode', 'Validation mode: controlled-rehearsal', 'Validation mode: skipped', 'Validation mode'],
  ['placeholder output', 'failed_release=abcdef123456\nrestored_release=123456abcdef\nreadiness=200', '<actual output>', 'inline evidence'],
  ['missing inline output', '```text\nfailed_release=abcdef123456\nrestored_release=123456abcdef\nreadiness=200\n```', '', 'inline evidence'],
  ['no evidence reference', '- Evidence: inline', '', 'Evidence'],
  ['self reference', '- Evidence: inline', '- Evidence: [report](delivery.md)', 'itself'],
  ['remote reference', '- Evidence: inline', '- Evidence: [remote](https://example.com/log.txt)', 'relative local'],
  ['missing attachment', '- Evidence: inline', '- Evidence: [output](missing.txt)', 'invalid evidence'],
]) {
  test('rejects ' + label, t => {
    const f = fixture(t);
    f.body = f.body.replace(from, to);
    assert.ok(rollbackReadinessErrors(f).some(value => value.includes(error)));
  });
}

test('does not read a fake section inside a code fence', t => {
  const f = fixture(t);
  f.body = '```markdown\n' + f.body.replaceAll('```', '~~~') + '\n```';
  assert.ok(rollbackReadinessErrors(f).some(value => value.includes('exactly one')));
});

test('rejects duplicate rollback sections', t => {
  const f = fixture(t);
  f.body += '\n## Rollback Readiness\n- Result: passed';
  assert.ok(rollbackReadinessErrors(f).some(value => value.includes('duplicated')));
});

test('checks attachment existence, digest and repository containment', t => {
  const f = fixture(t);
  const evidence = path.join(f.root, 'recovery.txt');
  fs.writeFileSync(evidence, 'revision=abcdef123456\nreadiness=200\n');
  f.body = f.body.replace('- Evidence: inline', '- Evidence: [output](recovery.txt)\n- Evidence SHA-256: ' + sha256File(evidence));
  assert.deepEqual(rollbackReadinessErrors(f), []);
  fs.appendFileSync(evidence, 'changed');
  assert.ok(rollbackReadinessErrors(f).some(value => value.includes('SHA-256')));
  const outside = temporaryDirectory(t, 'rollback-outside-');
  const external = path.join(outside, 'external.txt');
  fs.writeFileSync(external, 'outside');
  f.body = f.body.replace('](recovery.txt)', '](' + path.relative(f.root, external).replaceAll('\\', '/') + ')');
  assert.ok(rollbackReadinessErrors(f).some(value => value.includes('escapes')));
});

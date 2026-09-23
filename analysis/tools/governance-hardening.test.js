'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { rejectGovernedOverrides } = require('./lib');

test('governed audit target overrides fail outside explicit test mode', () => {
  assert.throws(
    () => rejectGovernedOverrides({ scope: 'decoy' }, ['scope']),
    /disabled outside AUDIT_TEST_MODE=1/
  );
});

test('isolated tests may opt into governed target overrides explicitly', () => {
  const previous = process.env.AUDIT_TEST_MODE;
  process.env.AUDIT_TEST_MODE = '1';
  try {
    assert.doesNotThrow(
      () => rejectGovernedOverrides({ scope: 'fixture' }, ['scope'])
    );
  } finally {
    if (previous === undefined) delete process.env.AUDIT_TEST_MODE;
    else process.env.AUDIT_TEST_MODE = previous;
  }
});

test('workbook CLI rejects its environment target override', () => {
  const environment = { ...process.env, WORKBOOK_FILE: path.join(__dirname, 'decoy.xlsx') };
  delete environment.AUDIT_TEST_MODE;
  const result = spawnSync(process.execPath, [path.join(__dirname, 'workbook-audit.js')], {
    cwd: __dirname,
    env: environment,
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /WORKBOOK_FILE/);
});

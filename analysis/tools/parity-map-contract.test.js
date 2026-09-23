'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { deliveredRowErrors, parseParityContracts, parseRows } = require('./parity-map-contract');

test('parses exact row lists and ranges', () => {
  assert.deepEqual(parseRows('7, 9-11, 10'), [7, 9, 10, 11]);
  assert.throws(() => parseRows('7-ish'), /invalid workbook row expression/);
});

test('requires one explicit target or legacy contract', () => {
  const body = [
    '## Parity Map Delivery Contracts',
    '| Feature | Scope | Deliver rows | Deferred rows | Owner decision |',
    '|---|---|---|---|---|',
    '| 001-foundation | target-only | - | - | decisions/foundation.md |',
    '| 002-work | legacy-backed | 7-8 | 9 | - |',
  ].join('\n');
  const parsed = parseParityContracts(body);
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.contracts.get('002-work').deliverRows, [7, 8]);
});

test('rejects target-only rows and unowned target changes', () => {
  const body = [
    '## Parity Map Delivery Contracts',
    '| Feature | Scope | Deliver rows | Deferred rows | Owner decision |',
    '|---|---|---|---|---|',
    '| 001-foundation | target-only | 7 | - | - |',
  ].join('\n');
  const parsed = parseParityContracts(body);
  assert(parsed.errors.some((error) => error.includes('cannot claim legacy')));
  assert(parsed.errors.some((error) => error.includes('owner decision')));
});

test('fails delivered rows whose workbook closure is incomplete', () => {
  const contract = { feature: '002-work', deliverRows: [7], deferredRows: [8] };
  const states = new Map([
    [7, { destinationImplemented: 'Yes', destinationNotes: '', destinationEvidence: 'test', coveredInSdd: 'Yes', deferredInSdd: '', sddEvidence: 'spec' }],
    [8, { deferredInSdd: '', sddEvidence: '' }],
  ]);
  const errors = deliveredRowErrors(contract, { states });
  assert.equal(errors.length, 2);
  assert(errors[0].includes('not closed'));
  assert(errors[1].includes('declared deferred'));
});

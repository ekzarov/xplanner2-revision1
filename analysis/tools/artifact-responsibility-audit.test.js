'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { validateResponsibilityEntries } = require('./artifact-responsibility-audit');
const records = require('../artifact-responsibilities.json').artifacts;

test('every artifact family names creator, maintainer and instructions in both languages', () => {
  assert.deepEqual(validateResponsibilityEntries(records), []);
});
test('missing authorship cannot silently fall back to the stage actor', () => {
  const changed = structuredClone(records);
  delete changed[0].responsibility.en.creator;
  delete changed[1].responsibility.ru.maintainer;
  delete changed[2].responsibility.en.instructions;
  const errors = validateResponsibilityEntries(changed);
  assert.equal(errors.length, 3);
  assert.ok(errors.some(error => error.includes('en.creator')));
  assert.ok(errors.some(error => error.includes('ru.maintainer')));
  assert.ok(errors.some(error => error.includes('en.instructions')));
});
test('duplicate ids do not hide an undocumented family', () => {
  const changed = structuredClone(records);
  changed[1].id = changed[0].id;
  assert.ok(validateResponsibilityEntries(changed).some(error => error.includes('duplicate')));
});

'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { readRoleContract } = require('./agent-role-contract');
const { stageRoleView, roleViewErrors } = require('./agent-role-view');
const root = path.resolve(__dirname, '../..');

test('role presentations preserve specialization, independent mode and optional support', () => {
  const roles = readRoleContract(root);
  const ux = stageRoleView(roles, 'stage-06');
  assert.match(ux.assignment.en, /migration-ux\/SKILL.md/);
  assert.match(ux.assignment.en, /Support on demand: Business Analyst, Developer/);
  assert.match(ux.assignment.ru, /UX-дизайнер/);
  assert.match(stageRoleView(roles, 'stage-07').actor.en, /QA \(fresh independent reviewer\)/);
  assert.match(stageRoleView(roles, 'stage-12').actor.en, /responsible-agent verification/);
  assert.match(stageRoleView(roles, 'stage-17').actor.en, /separate Developer peer/);
  assert.match(stageRoleView(roles, 'stage-19').assignment.en, /PM records the owner walkthrough\/decline/);
  assert.throws(() => stageRoleView(roles, 'stage-99'), /Missing role/);
});

test('English instructions and presentations and Russian 3D project every role assignment', () => {
  assert.deepEqual(roleViewErrors(root, readRoleContract(root)), []);
});

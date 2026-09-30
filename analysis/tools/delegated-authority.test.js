'use strict';

// Project rule (xplanner2-revision1 departure): honest attribution of delegated decisions.
const test = require('node:test');
const assert = require('node:assert/strict');
const { attributionError } = require('./delegated-authority');

function fixture({ decision = {}, authority = {}, transitions = [] } = {}) {
  const auth = {
    id: 'mandate', decision: 'approved', decided_by: 'owner', decided_at: '2026-09-30T19:16:33Z',
    delegation: { delegate: 'Codex', ends_at_stage: 'stage-04' }, ...authority,
  };
  const dec = {
    id: 'incident', decision: 'approved', decided_by: 'Codex', decided_at: '2026-09-30T19:20:00Z',
    delegated_authority: { authority_decision_id: 'mandate' }, ...decision,
  };
  return { dec, status: { project: { owner: 'owner' }, owner_decisions: [auth, dec], transition_history: transitions } };
}

test('the owner in person is attributable', () => {
  const { status } = fixture();
  assert.equal(attributionError({ id: 'x', decided_by: 'owner' }, status), null);
});

test('a delegate under a valid owner delegation is attributable', () => {
  const { dec, status } = fixture();
  assert.equal(attributionError(dec, status), null);
});

for (const [name, overrides, pattern] of [
  ['non-owner without delegation', { decision: { delegated_authority: undefined } }, /cite delegated_authority/],
  ['owner citing a delegation', { decision: { decided_by: 'owner' } }, /only for a delegate/],
  ['a waiver under delegation', { decision: { id: 'waiver:x:y' } }, /waiver cannot be decided/],
  ['missing authority decision', { decision: { delegated_authority: { authority_decision_id: 'none' } } }, /exactly one owner decision/],
  ['delegation not by the owner', { authority: { decided_by: 'Codex' } }, /decided by project.owner in person/],
  ['delegation without delegation field', { authority: { delegation: undefined } }, /approved decision with a delegation/],
  ['a different delegate', { decision: { decided_by: 'Someone' } }, /delegation delegate/],
  ['decision before the delegation', { decision: { decided_at: '2026-09-30T19:00:00Z' } }, /at or after the delegation/],
  ['decision after entry into the end stage', { transitions: [{ from: 'stage-03', to: 'stage-04', changed_at: '2026-09-30T19:18:00Z' }] }, /ended at entry into stage-04/],
]) {
  test(`rejects ${name}`, () => {
    const { dec, status } = fixture(overrides);
    assert.match(attributionError(dec, status) || '', pattern);
  });
}

test('an earlier transition below the end stage does not end the delegation', () => {
  const { dec, status } = fixture({ transitions: [{ from: 'stage-02', to: 'stage-03', changed_at: '2026-09-30T19:18:00Z' }] });
  assert.equal(attributionError(dec, status), null);
});

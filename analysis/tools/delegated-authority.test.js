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

// Extension 2026-10-02: one named waiver gate and the matching fallback transition approval.
const { approvalAttributionError } = require('./delegated-authority');

function fallbackFixture({ waivers = ['legacy_walkthrough_fallback'], approval = {}, transitions = [] } = {}) {
  const auth = {
    id: 'mandate4', decision: 'approved', decided_by: 'owner', decided_at: '2026-10-02T08:00:00Z',
    delegation: { delegate: 'Codex', ends_at_stage: 'stage-05', ...(waivers ? { waivers } : {}) },
  };
  const waiver = {
    id: 'waiver:legacy_walkthrough_fallback:p', decision: 'approved', decided_by: 'Codex', decided_at: '2026-10-02T08:05:00Z',
    delegated_authority: { authority_decision_id: 'mandate4' },
  };
  const appr = { approved_by: 'Codex', approved_at: '2026-10-02T08:06:00Z', delegated_authority: { authority_decision_id: 'mandate4' }, ...approval };
  return { auth, waiver, appr, status: { project: { owner: 'owner' }, owner_decisions: [auth, waiver], transition_history: transitions } };
}
const FALLBACK = { from: 'stage-03', to: 'stage-04' };

test('a delegated legacy_walkthrough_fallback waiver is attributable when the delegation names it', () => {
  const { waiver, status } = fallbackFixture();
  assert.equal(attributionError(waiver, status), null);
});

test('a delegated waiver is rejected when the delegation names no waiver gate', () => {
  const { waiver, status } = fallbackFixture({ waivers: null });
  assert.match(attributionError(waiver, status) || '', /unless the delegation names its gate/);
});

test('a delegated waiver of another gate is rejected', () => {
  const { waiver, status } = fallbackFixture();
  assert.match(attributionError({ ...waiver, id: 'waiver:application_form_style:p' }, status) || '', /unless the delegation names its gate/);
});

test('the owner in person still approves any transition', () => {
  const { status } = fallbackFixture();
  assert.equal(approvalAttributionError({ approved_by: 'owner', approved_at: '2026-10-02T08:06:00Z' }, { from: 'stage-04', to: 'stage-05' }, status), null);
});

test('the delegate may approve the Stage 3 -> Stage 4 fallback transition under the named gate', () => {
  const { appr, status } = fallbackFixture();
  assert.equal(approvalAttributionError(appr, FALLBACK, status), null);
});

for (const [name, setup, transition, pattern] of [
  ['a delegate approving another transition', {}, { from: 'stage-04', to: 'stage-05' }, /only the Stage 3 -> Stage 4 fallback/],
  ['a delegate without delegated_authority', { approval: { delegated_authority: undefined } }, FALLBACK, /cite delegated_authority/],
  ['a delegation that does not name the fallback gate', { waivers: null }, FALLBACK, /must name the legacy_walkthrough_fallback waiver gate/],
  ['an approval after the delegation ended', { transitions: [{ from: 'stage-04', to: 'stage-05', changed_at: '2026-10-02T08:05:30Z' }] }, FALLBACK, /ended at entry into stage-05/],
  ['an approval before the delegation', { approval: { approved_at: '2026-10-02T07:00:00Z' } }, FALLBACK, /at or after the delegation/],
]) {
  test(`rejects ${name}`, () => {
    const { appr, status } = fallbackFixture(setup);
    assert.match(approvalAttributionError(appr, transition, status) || '', pattern);
  });
}

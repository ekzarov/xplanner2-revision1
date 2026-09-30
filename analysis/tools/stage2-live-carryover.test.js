'use strict';

// Project rule (xplanner2-revision1 departure): Stage 2 live-check carryover.
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  liveCarryoverScope, validateLiveCarryover, liveCarryoverCloses, validateLiveCarryoverEvidence,
} = require('./stage2-live-carryover');

const RECORD = 'analysis/stages/stage-02/live-check-carryover-pass-009.md';

function fixture(overrides = {}) {
  const review = {
    stage: 'stage-02', pass: 9, result: 'findings', session_id: 's9',
    report: 'analysis/reviews/stage-02-pass-009.md', reviewed_at: '2026-09-28T14:01:01Z',
    findings_severity_max: 'low',
    live_carryover: { record: RECORD, report_sha256: 'a'.repeat(64), owner_decision_id: 'carry', blocking_class_check: 'confirmed' },
    ...overrides.review,
  };
  const decision = {
    id: 'carry', decision: 'approved', decided_by: 'owner', decided_at: '2026-09-30T08:00:00Z',
    scope: liveCarryoverScope(review), record: RECORD, residual_risk: 'accepted risks',
    ...overrides.decision,
  };
  return { review, status: { project: { owner: 'owner' }, owner_decisions: [decision], review_passes: [review] } };
}

test('a complete owner-approved low carryover closes stage-02', () => {
  const { review, status } = fixture();
  assert.deepEqual(validateLiveCarryover(status), []);
  assert.equal(liveCarryoverCloses(review, status), true);
});

test('a pass without carryover never closes through this rule', () => {
  const { review, status } = fixture();
  delete review.live_carryover;
  assert.equal(liveCarryoverCloses(review, status), false);
});

for (const [name, overrides, pattern] of [
  ['non-low severity', { review: { findings_severity_max: 'medium' } }, /findings_severity_max: low/],
  ['blocked result', { review: { result: 'blocked' } }, /result: findings/],
  ['clean result', { review: { result: 'clean' } }, /result: findings/],
  ['another stage', { review: { stage: 'stage-07' } }, /only defined for stage-02/],
  ['unchecked scope', { review: { unchecked_scopes: ['x'] } }, /unchecked_scopes/],
  ['unapproved decision', { decision: { decision: 'deferred' } }, /approved owner decision/],
  ['wrong decider', { decision: { decided_by: 'agent' } }, /project.owner/],
  ['wrong scope', { decision: { scope: 'stage-02-live-carryover:[]' } }, /liveCarryoverScope/],
  ['wrong record', { decision: { record: 'other.md' } }, /decision.record/],
  ['empty residual risk', { decision: { residual_risk: ' ' } }, /residual_risk/],
  ['decision before review', { decision: { decided_at: '2026-09-01T00:00:00Z' } }, /decided_at/],
]) {
  test(`rejects carryover with ${name}`, () => {
    const { review, status } = fixture(overrides);
    if (overrides.decision && !overrides.decision.scope) status.owner_decisions[0].scope = liveCarryoverScope(review);
    const errors = validateLiveCarryover(status);
    assert.ok(errors.some((e) => pattern.test(e)), errors.join('\n'));
    assert.equal(liveCarryoverCloses(review, status), false);
  });
}

test('rejects a missing blocking-class attestation and the report as record', () => {
  const { review, status } = fixture();
  review.live_carryover.blocking_class_check = 'no';
  assert.ok(validateLiveCarryover(status).some((e) => /blocking_class_check/.test(e)));
  review.live_carryover.blocking_class_check = 'confirmed';
  review.live_carryover.record = review.report;
  assert.ok(validateLiveCarryover(status).some((e) => /separate carryover record/.test(e)));
});

test('the carryover record must bind the session and exact report hash', () => {
  const { review, status } = fixture();
  const declarations = (content, label) => content.split('\n').filter((l) => new RegExp(`^[ \\t]*[-*]?[ \\t]*${label}:`).test(l));
  const A = 'a'.repeat(64);
  const hashes = new Map([[review.report, A]]);
  const good = new Map([[review.report, 'r'], [RECORD, `- Carryover session: s9\n- Carryover report SHA-256: ${A}\n`]]);
  assert.deepEqual(validateLiveCarryoverEvidence(status, good, hashes, declarations), []);
  const bad = new Map([[review.report, 'r'], [RECORD, '- Carryover session: s9\n- Carryover report SHA-256: def\n']]);
  assert.ok(validateLiveCarryoverEvidence(status, bad, hashes, declarations).some((e) => /report SHA-256/.test(e)));
});

test('status-validator uses the carryover rule only for the stage-02 forward exit', (t) => {
  const path = require('node:path');
  const fs = require('node:fs');
  const YAML = require('yaml');
  const { validateStatus } = require('./status-validator');
  const file = path.join(__dirname, '..', 'migration_status.yaml');
  const base = YAML.parse(fs.readFileSync(file, 'utf8'));
  const latest = base.review_passes.filter((r) => r.stage === 'stage-02').sort((a, b) => b.pass - a.pass)[0];
  const exitError = /latest stage-02 pass for exit to stage-03 must be clean/;
  const recordedExit = base.transition_history.some((x) => x.from === 'stage-02' && x.to === 'stage-03');
  if (recordedExit && latest && latest.result === 'findings' && latest.live_carryover) {
    // The exit is already recorded: it must pass with the carryover and fail without it.
    assert.ok(!validateStatus(base).some((e) => exitError.test(e)), 'recorded carryover exit must validate');
    const stripped = structuredClone(base);
    delete stripped.review_passes.find((r) => r.stage === 'stage-02' && r.pass === latest.pass).live_carryover;
    assert.ok(validateStatus(stripped).some((e) => exitError.test(e)), 'the exit must fail without the carryover');
    return;
  }
  if (base.control.current_stage !== 'stage-02' || !latest || latest.result !== 'findings') {
    t.skip('project status is not at a stage-02 findings pass');
    return;
  }
  const withExit = (status) => {
    const clone = structuredClone(status);
    const last = clone.transition_history[clone.transition_history.length - 1];
    clone.transition_history.push({
      from: 'stage-02', to: 'stage-03', reason: 'test exit', changed_by: 'test',
      changed_at: new Date(Math.max(Date.parse(last.changed_at), Date.parse(latest.reviewed_at)) + 60000).toISOString().replace(/\.\d+Z$/, 'Z'),
      gate_evidence: [latest.report], owner_approval: null,
    });
    clone.control.current_stage = 'stage-03';
    clone.control.previous_stage = 'stage-02';
    return clone;
  };
  const without = withExit(base);
  const p1 = without.review_passes.find((r) => r.stage === 'stage-02' && r.pass === latest.pass);
  delete p1.live_carryover;
  assert.ok(validateStatus(without).some((e) => exitError.test(e)), 'findings without carryover must not exit');
  const withCarry = withExit(base);
  const p2 = withCarry.review_passes.find((r) => r.stage === 'stage-02' && r.pass === latest.pass);
  p2.findings_severity_max = 'low';
  p2.live_carryover = { record: 'x/carry.md', report_sha256: 'a'.repeat(64), owner_decision_id: 'test-carry', blocking_class_check: 'confirmed' };
  withCarry.owner_decisions.push({
    id: 'test-carry', decision: 'approved', decided_by: withCarry.project.owner,
    decided_at: new Date(Date.parse(p2.reviewed_at) + 1000).toISOString().replace(/\.\d+Z$/, 'Z'),
    scope: liveCarryoverScope(p2), rationale: 'test', record: 'x/carry.md', residual_risk: 'test risk',
  });
  assert.ok(!validateStatus(withCarry).some((e) => exitError.test(e)), 'an approved low carryover may exit');
});

const lines = (content, label) => content.split('\n').filter((l) => new RegExp(`^[ \t]*[-*]?[ \t]*${label}:`).test(l));

test('replacing the report and the record together breaks the prior owner approval', () => {
  const { review, status } = fixture();
  assert.deepEqual(validateLiveCarryover(status), []);
  const B = 'b'.repeat(64);
  // New report bytes with a rewritten carryover field and record that match them:
  review.live_carryover.report_sha256 = B;
  const records = new Map([[review.report, 'new'], [RECORD, `- Carryover session: s9\n- Carryover report SHA-256: ${B}\n`]]);
  const hashes = new Map([[review.report, B]]);
  assert.deepEqual(validateLiveCarryoverEvidence(status, records, hashes, lines), []);
  // ...but the owner decision still binds the approved hash, so the carryover no longer closes.
  assert.ok(validateLiveCarryover(status).some((e) => /liveCarryoverScope/.test(e)));
  assert.equal(liveCarryoverCloses(review, status), false);
});

test('rejects a carryover whose recorded hash differs from the actual report bytes', () => {
  const { review, status } = fixture();
  const A = 'a'.repeat(64);
  const records = new Map([[review.report, 'changed'], [RECORD, `- Carryover session: s9\n- Carryover report SHA-256: ${A}\n`]]);
  const hashes = new Map([[review.report, 'c'.repeat(64)]]);
  assert.ok(validateLiveCarryoverEvidence(status, records, hashes, lines).some((e) => /exact existing report bytes/.test(e)));
  review.live_carryover.report_sha256 = 'NOTAHASH';
  assert.ok(validateLiveCarryover(status).some((e) => /lowercase report_sha256/.test(e)));
});

'use strict';

// Project rule (xplanner2-revision1 process departure, owner decision of
// 2026-09-30): a Stage 2 -> Stage 3 exit may rest on a usable low `findings`
// pass when every finding is carried into a Stage 3 live check or an
// explicitly owner-accepted residual risk. Findings stay findings; this rule
// never turns them into `clean` and never closes a finding without evidence.
// It is not part of the Starter; see analysis/maintenance/ for the departure record.

const { isNonEmptyString } = require('./lib');

function liveCarryoverScope(review) {
  return 'stage-02-live-carryover:' + JSON.stringify([
    review.stage,
    review.pass,
    review.session_id,
    review.report,
    review.live_carryover.record,
  ]);
}

// Structural rules for the optional `live_carryover` field.
function validateLiveCarryover(status) {
  const errors = [];
  for (const review of status.review_passes || []) {
    const carryover = review.live_carryover;
    if (carryover === undefined) continue;
    const label = `/review_passes ${review.stage} pass ${review.pass} live_carryover`;
    if (review.stage !== 'stage-02') errors.push(`${label} is only defined for stage-02`);
    if (review.result !== 'findings') errors.push(`${label} requires result: findings`);
    if (review.findings_severity_max !== 'low') errors.push(`${label} requires findings_severity_max: low`);
    if (Array.isArray(review.unchecked_scopes) && review.unchecked_scopes.length) {
      errors.push(`${label} cannot carry a pass with unchecked_scopes`);
    }
    if (carryover.blocking_class_check !== 'confirmed') {
      errors.push(`${label} requires blocking_class_check: confirmed`);
    }
    if (!isNonEmptyString(carryover.record) || carryover.record === review.report) {
      errors.push(`${label} record must be a separate carryover record`);
      continue;
    }
    const decisions = (status.owner_decisions || []).filter((d) => d.id === carryover.owner_decision_id);
    if (decisions.length !== 1) {
      errors.push(`${label} owner_decision_id must identify exactly one owner decision`);
      continue;
    }
    const [decision] = decisions;
    if (decision.decision !== 'approved') errors.push(`${label} requires an approved owner decision`);
    if (decision.decided_by !== status.project.owner) errors.push(`${label} decision.decided_by must equal project.owner`);
    if (decision.scope !== liveCarryoverScope(review)) {
      errors.push(`${label} decision.scope must equal liveCarryoverScope(review)`);
    }
    if (decision.record !== carryover.record) errors.push(`${label} decision.record must equal live_carryover.record`);
    if (!isNonEmptyString(decision.residual_risk)) errors.push(`${label} owner decision requires nonempty residual_risk`);
    if (!(Date.parse(decision.decided_at) >= Date.parse(review.reviewed_at))) {
      errors.push(`${label} decision.decided_at must be at or after reviewed_at`);
    }
  }
  return errors;
}

// Whether a stage-02 pass may support a forward exit under this rule. The
// structural checks above and the incident rules must also hold.
function liveCarryoverCloses(review, status) {
  if (!review || review.stage !== 'stage-02' || review.result !== 'findings') return false;
  if (!review.live_carryover) return false;
  const tagged = { review_passes: [review], owner_decisions: status.owner_decisions, project: status.project };
  return validateLiveCarryover(tagged).length === 0;
}

// The carryover record must bind this pass and report bytes.
function validateLiveCarryoverEvidence(status, records, hashes, visibleDeclarations) {
  const errors = [];
  for (const review of status.review_passes || []) {
    const carryover = review.live_carryover;
    if (!carryover || !isNonEmptyString(carryover.record)) continue;
    const label = `/review_passes ${review.stage} pass ${review.pass} live_carryover`;
    const record = records.get(carryover.record);
    if (!record) continue; // Missing or template-only records fail in recordedEvidence.
    const expected = {
      'Carryover session': review.session_id,
      'Carryover report SHA-256': hashes.get(review.report),
    };
    for (const [declaration, value] of Object.entries(expected)) {
      const lines = visibleDeclarations(record, declaration, { plain: true });
      const canonical = new RegExp(`^[ \\t]*[-*]?[ \\t]*${declaration}:[ \\t]*(.*?)[ \\t]*$`);
      const actual = lines.length === 1 ? canonical.exec(lines[0])?.[1] : null;
      if (typeof value !== 'string' || actual !== value) {
        errors.push(`${label} record must have exactly one visible plain ${declaration} declaration matching this pass`);
      }
    }
  }
  return errors;
}

module.exports = { liveCarryoverScope, validateLiveCarryover, liveCarryoverCloses, validateLiveCarryoverEvidence };

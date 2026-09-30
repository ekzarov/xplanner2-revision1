'use strict';

const { isNonEmptyString } = require('./lib');

const INCIDENT_GUARDS = Object.freeze({
  independence: 'Incident independence',
  source_scope: 'Incident source scope',
  evidence_integrity: 'Incident evidence integrity',
  permitted_support: 'Incident permitted support',
  disclosure: 'Incident disclosure',
});

// JSON tuple encoding preserves scope/session boundaries even when they contain colons.
function incidentDecisionScope(review) {
  return 'review-incident:' + JSON.stringify([
    review.stage,
    review.pass,
    review.session_id,
    review.report,
    review.incident_assessment.report_sha256.toLowerCase(),
    review.scope,
  ]);
}

function validateReviewIncidents(status) {
  const errors = [];
  for (const review of status.review_passes || []) {
    const assessment = review.incident_assessment;
    if (assessment === undefined) continue;
    const label = `/review_passes ${review.stage} pass ${review.pass} incident_assessment`;
    if (assessment.record === review.report) {
      errors.push(`${label} record must be a separate companion, not review.report`);
    }
    const substantive = ['clean', 'findings'].includes(review.result);
    if (substantive) {
      if (assessment.classification !== 'non-material') {
        errors.push(`${label} clean/findings requires non-material classification`);
      }
      for (const guard of Object.keys(INCIDENT_GUARDS)) {
        if (assessment.guards[guard] !== 'verified') {
          errors.push(`${label} clean/findings requires guards.${guard}: verified`);
        }
      }
      if (!assessment.owner_decision_id) {
        errors.push(`${label} clean/findings requires owner_decision_id`);
      }
    }
    if (!assessment.owner_decision_id) continue;
    const decisions = (status.owner_decisions || [])
      .filter((decision) => decision.id === assessment.owner_decision_id);
    if (decisions.length !== 1) {
      errors.push(`${label} owner_decision_id must identify exactly one owner decision`);
      continue;
    }
    const [decision] = decisions;
    if (substantive && decision.decision !== 'approved') {
      errors.push(`${label} clean/findings requires an approved owner decision`);
    }
    if (substantive && !isNonEmptyString(decision.residual_risk)) {
      errors.push(`${label} clean/findings owner decision requires nonempty residual_risk`);
    }
    if (decision.decided_by !== status.project.owner) {
      errors.push(`${label} decision.decided_by must equal project.owner`);
    }
    if (decision.scope !== incidentDecisionScope(review)) {
      errors.push(`${label} decision.scope must equal incidentDecisionScope(review), binding the exact stage/pass/session/report/hash/scope`);
    }
    if (!(Date.parse(decision.decided_at) >= Date.parse(review.reviewed_at))) {
      errors.push(`${label} decision.decided_at must be at or after reviewed_at`);
    }
    if (decision.record !== assessment.record) {
      errors.push(`${label} decision.record must equal assessment.record`);
    }
  }
  return errors;
}

// Records and byte hashes come only from status-validator's checked local evidence.
// These bindings validate declarations, never incident substance or reviewer eligibility.
function validateIncidentEvidence(status, records, hashes, visibleDeclarations) {
  const errors = [];
  for (const review of status.review_passes || []) {
    const assessment = review.incident_assessment;
    if (!assessment || typeof assessment !== 'object') continue;
    const label = `/review_passes ${review.stage} pass ${review.pass} incident_assessment`;
    const hash = typeof assessment.report_sha256 === 'string'
      ? assessment.report_sha256.toLowerCase() : null;
    if (records.has(review.report) && hashes.get(review.report) !== hash) {
      errors.push(`${label} report_sha256 must match the exact existing report bytes`);
    }
    const record = records.get(assessment.record);
    if (!record) continue; // Missing, unsafe or template-only records fail in recordedEvidence.
    const expected = {
      'Incident session': review.session_id,
      'Incident report SHA-256': hash,
      'Incident classification': assessment.classification,
      ...Object.fromEntries(Object.entries(INCIDENT_GUARDS)
        .map(([guard, declaration]) => [declaration, assessment.guards?.[guard]])),
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

module.exports = { INCIDENT_GUARDS, incidentDecisionScope, validateReviewIncidents, validateIncidentEvidence };

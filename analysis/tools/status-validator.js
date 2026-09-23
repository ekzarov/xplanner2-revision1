#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { constitutionVersion } = require('./constitution-version');
const {
  AuditResult,
  PLACEHOLDER,
  isNonEmptyString,
  parseArgs,
  parseYamlFile,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  resolveInside,
  sha256File,
  validateSchema,
} = require('./lib');

const DEFAULT_SCHEMA_FILE = path.join(__dirname, '..', 'migration_status.schema.json');
const TOTAL_STAGES = 19;
const WAIVER_PERMITTED_NEXT_STAGE = Object.freeze({
  legacy_walkthrough_fallback: 'stage-04',
  application_form_style: 'stage-06',
  prototyping_retroactive: 'stage-06',
  architecture_retroactive: 'stage-09',
  pre_sdd_knowledge: 'stage-15',
});
const ARTIFACT_BINDING_REQUIRED_FROM = Date.parse('2026-08-07T18:00:00Z');

function stageNumber(stage) {
  const match = typeof stage === 'string' && stage.match(/^stage-(\d{2})$/);
  return match ? Number(match[1]) : null;
}

function formalStageProgress(stage) {
  if (stage === 'bootstrap') {
    return { completed: 0, total: TOTAL_STAGES, percent: 0 };
  }
  if (stage === 'complete') {
    return { completed: TOTAL_STAGES, total: TOTAL_STAGES, percent: 100 };
  }
  const current = stageNumber(stage);
  if (current === null || current < 1 || current > TOTAL_STAGES) return null;
  const completed = current - 1;
  return {
    completed,
    total: TOTAL_STAGES,
    percent: Math.round((completed / TOTAL_STAGES) * 100),
  };
}

function expectedReport(stage, pass) {
  const number = typeof stage === 'number' ? stage : stageNumber(stage);
  if (!number) throw new Error(`cannot build a report path for stage ${stage}`);
  return `analysis/reviews/stage-${String(number).padStart(2, '0')}-pass-${String(pass).padStart(3, '0')}.md`;
}

// Whether a review pass closes its stage. Clean always does. A findings pass
// closes only under the owner rule of 2026-08-05: every finding is Low AND
// cosmetic, recorded and dispositioned in a polish backlog the entry names.
// The entry attests both facts in structured fields, because a validator
// cannot read severities out of prose:
//   findings_severity_max: "low"
//   dispositioned_in: <backlog path, which must exist>
//   never_cosmetic_check: "confirmed" - the author attests none of the
//     never-cosmetic classes (missing flow, invented behavior, incorrect
//     roles/security, missing required state/action/dialog, broken
//     navigation, unusable clipping, unapproved target-only behavior) is
//     among the findings.
// A pass carrying a non-empty unchecked_scopes never closes anything and must
// be result: blocked - an unchecked dimension is not a passed one.
function passClosesStage(entry) {
  if (!entry) return false;
  if (Array.isArray(entry.unchecked_scopes) && entry.unchecked_scopes.length) return false;
  if (entry.result === 'clean') return true;
  if (entry.result !== 'findings') return false;
  if (entry.findings_severity_max !== 'low') return false;
  // Two distinct attestations, because they answer different questions: that
  // no finding falls in a never-cosmetic class, and that every finding IS
  // cosmetic. A Low functional nit outside the never-list fails the second.
  if (entry.never_cosmetic_check !== 'confirmed') return false;
  if (entry.all_findings_cosmetic !== 'confirmed') return false;
  return typeof entry.dispositioned_in === 'string' && Boolean(entry.dispositioned_in.trim());
}
function latestPass(reviewPasses, stage) {
  return reviewPasses
    .filter((entry) => entry.stage === stage)
    .sort((left, right) => right.pass - left.pass)[0] || null;
}

function nextIndependentStage(permittedNextStage) {
  const number = stageNumber(permittedNextStage);
  if (number === null) return null;
  return [2, 7, 10, 14, 16, 19].find((candidate) => candidate >= number) || 19;
}

function stageExitWindows(history, stage) {
  const windows = [];
  for (let exitIndex = 0; exitIndex < history.length; exitIndex += 1) {
    const exit = history[exitIndex];
    if (exit.from !== stage) continue;
    let entry = null;
    for (let entryIndex = exitIndex - 1; entryIndex >= 0; entryIndex -= 1) {
      if (history[entryIndex].to === stage) {
        entry = history[entryIndex];
        break;
      }
    }
    windows.push({ entry, exit });
  }
  return windows;
}

function passesInWindow(reviewPasses, stage, window) {
  const enteredAt = window.entry ? Date.parse(window.entry.changed_at) : Number.NEGATIVE_INFINITY;
  const exitedAt = Date.parse(window.exit.changed_at);
  return reviewPasses
    .filter((entry) => {
      if (entry.stage !== stage) return false;
      const reviewedAt = Date.parse(entry.reviewed_at);
      return reviewedAt >= enteredAt && reviewedAt <= exitedAt;
    })
    .sort((left, right) => left.pass - right.pass);
}

function loadStatusSchema(file = DEFAULT_SCHEMA_FILE) {
  return readJsonFile(path.resolve(file));
}

function validateStatus(status, schema = loadStatusSchema()) {
  const errors = validateSchema(schema, status);
  if (errors.length) return errors;

  const reviewPasses = Array.isArray(status.review_passes) ? status.review_passes : [];
  const ownerDecisions = Array.isArray(status.owner_decisions) ? status.owner_decisions : [];
  const formalProgress = formalStageProgress(status.control.current_stage);
  if (formalProgress && status.progress.completed_percent !== formalProgress.percent) {
    errors.push(
      `/progress/completed_percent must equal derived formal progress ${formalProgress.percent} ` +
      `(${formalProgress.completed}/${formalProgress.total} stages closed at ${status.control.current_stage})`
    );
  }
  const seenPasses = new Set();
  const seenSessions = new Set();
  for (const entry of reviewPasses) {
    const key = `${entry.stage}:${entry.pass}`;
    if (seenPasses.has(key)) errors.push(`/review_passes duplicate ${entry.stage} pass ${entry.pass}`);
    if (entry.result !== 'findings' && (entry.findings_severity_max !== undefined || entry.dispositioned_in !== undefined || entry.never_cosmetic_check !== undefined || entry.all_findings_cosmetic !== undefined)) {
      errors.push(`/review_passes ${entry.stage} pass ${entry.pass} carries findings metadata but result is not findings`);
    }
    if (entry.stage === 'stage-07' && Array.isArray(entry.unchecked_scopes) && entry.unchecked_scopes.length && entry.result !== 'blocked') {
      errors.push(`/review_passes ${entry.stage} pass ${entry.pass} carries unchecked_scopes and must be result: blocked`);
    }
    seenPasses.add(key);
    if (seenSessions.has(entry.session_id)) {
      errors.push(`/review_passes session_id "${entry.session_id}" must be unique`);
    }
    seenSessions.add(entry.session_id);
    const expected = expectedReport(entry.stage, entry.pass);
    if (entry.report !== expected) {
      errors.push(`/review_passes ${entry.stage} pass ${entry.pass} report must be ${expected}`);
    }
    // The reviews contract allows independence_record to point at the report
    // itself when that report carries the complete Independence Declaration.
    // validateRecordedEvidence enforces the condition against the file.
    if (entry.reviewer_id === status.project.owner) {
      errors.push(`/review_passes ${entry.stage} pass ${entry.pass} reviewer_id must not be the project owner`);
    }
  }

  const decisionIds = new Set();
  for (const decision of ownerDecisions) {
    if (decisionIds.has(decision.id)) errors.push(`/owner_decisions duplicate id "${decision.id}"`);
    decisionIds.add(decision.id);
    if (decision.decided_by !== status.project.owner) {
      errors.push(`/owner_decisions "${decision.id}" decided_by must equal project.owner`);
    }
    if (decision.id.startsWith('waiver:')) {
      const [prefix, gate, ...scopeParts] = decision.id.split(':');
      const idScope = scopeParts.join(':');
      if (prefix !== 'waiver' ||
          !Object.hasOwn(WAIVER_PERMITTED_NEXT_STAGE, gate) ||
          idScope !== decision.scope) {
        errors.push(
          `/owner_decisions "${decision.id}" must use waiver:<registered-gate>:<exact-scope>`
        );
      } else if (decision.permitted_next_stage !== WAIVER_PERMITTED_NEXT_STAGE[gate]) {
        errors.push(
          `/owner_decisions "${decision.id}" permitted_next_stage must be ${WAIVER_PERMITTED_NEXT_STAGE[gate]}`
        );
      }
    }
  }

  if (status.constitution.ratified_by !== null &&
      status.constitution.ratified_by !== status.project.owner) {
    errors.push('/constitution/ratified_by must equal project.owner');
  }
  const verifyOwnerApproval = (approval, location) => {
    if (approval && approval.approved_by !== status.project.owner) {
      errors.push(`${location}/approved_by must equal project.owner`);
    }
  };
  for (let index = 0; index < status.transition_history.length; index += 1) {
    verifyOwnerApproval(
      status.transition_history[index].owner_approval,
      `/transition_history/${index}/owner_approval`
    );
  }
  if (status.transition_request) {
    verifyOwnerApproval(
      status.transition_request.owner_approval,
      '/transition_request/owner_approval'
    );
  }

  const history = status.transition_history;
  if (history.length === 0) {
    if (status.control.current_stage !== 'bootstrap' || status.control.previous_stage !== null) {
      errors.push('/control cannot leave bootstrap without transition history');
    }
  } else {
    if (history[0].from !== 'bootstrap') {
      errors.push('/transition_history first entry must start at bootstrap');
    }
    for (let index = 1; index < history.length; index += 1) {
      if (history[index].from !== history[index - 1].to) {
        errors.push(`/transition_history entry ${index} must continue from ${history[index - 1].to}`);
      }
      if (Date.parse(history[index].changed_at) <= Date.parse(history[index - 1].changed_at)) {
        errors.push(`/transition_history entry ${index} timestamp must be later than the previous entry`);
      }
    }
    const tail = history[history.length - 1];
    if (tail.to !== status.control.current_stage) {
      errors.push(`/control/current_stage must equal transition history tail ${tail.to}`);
    }
    if (tail.from !== status.control.previous_stage) {
      errors.push(`/control/previous_stage must equal transition history tail origin ${tail.from}`);
    }
  }

  const expectedState = status.control.current_stage === 'bootstrap'
    ? 'bootstrap'
    : status.control.current_stage === 'complete'
      ? 'complete'
      : 'active';
  if (status.control.state !== expectedState) {
    errors.push(`/control/state must be ${expectedState} at ${status.control.current_stage}`);
  }

  if (status.transition_request && status.transition_request.from !== status.control.current_stage) {
    errors.push('/transition_request/from must equal control.current_stage');
  }

  if (status.control.current_stage !== 'bootstrap') {
    if (status.constitution.status !== 'ratified') {
      errors.push('/constitution must be ratified before leaving bootstrap');
    }
    for (const [gate, value] of Object.entries(status.bootstrap_gates)) {
      const expected = gate === 'owner_stage_1_approval' ? 'approved' : 'passed';
      if (value !== expected) errors.push(`/bootstrap_gates/${gate} must be ${expected} before leaving bootstrap`);
    }
  }

  const currentNumber = stageNumber(status.control.current_stage);
  if ((currentNumber !== null && currentNumber >= 4) || status.control.current_stage === 'complete') {
    if (!status.legacy_walkthrough || status.legacy_walkthrough.outcome === 'pending') {
      errors.push('/legacy_walkthrough must record a non-pending Stage 3 outcome before Stage 4');
    }
  }
  if (status.legacy_walkthrough && ['partial-simulated', 'blocked-waived'].includes(status.legacy_walkthrough.outcome)) {
    const decision = ownerDecisions.find((entry) => entry.id === status.legacy_walkthrough.decision_id);
    if (!decision || decision.decision !== 'approved' || decision.scope !== status.legacy_walkthrough.scope) {
      errors.push('/legacy_walkthrough/decision_id must reference an approved exact-scope owner decision');
    } else if (decision.permitted_next_stage !== 'stage-04') {
      errors.push('/legacy_walkthrough fallback decision must permit progression only to stage-04');
    }
    const fallbackTransition = history.find(
      (entry) => entry.from === 'stage-03' && entry.to === 'stage-04'
    );
    if (fallbackTransition && !fallbackTransition.owner_approval) {
      errors.push('/transition_history Stage 3 fallback to Stage 4 requires owner_approval');
    }
  }
  if (status.legacy_walkthrough) {
    const blockedIds = new Set();
    for (const blockedScope of status.legacy_walkthrough.unresolved_blocked_scopes) {
      if (blockedIds.has(blockedScope.id)) {
        errors.push(`/legacy_walkthrough/unresolved_blocked_scopes duplicate id "${blockedScope.id}"`);
      }
      blockedIds.add(blockedScope.id);
      if (blockedScope.status === 'blocked') {
        const waiver = ownerDecisions.find((entry) => entry.id === blockedScope.waiver_id);
        if (!waiver || waiver.decision !== 'approved' || waiver.scope !== status.legacy_walkthrough.scope) {
          errors.push(`/legacy_walkthrough/unresolved_blocked_scopes "${blockedScope.id}" requires an approved exact-scope waiver`);
        }
      }
    }
  }

  for (const pass of reviewPasses) {
    if (pass.result !== 'invalid' && pass.authored_artifacts.length) {
      errors.push(`/review_passes ${pass.stage} pass ${pass.pass} must be invalid when authored_artifacts is non-empty`);
    }
    for (const waiverId of pass.waiver_ids) {
      const waiver = ownerDecisions.find((entry) => entry.id === waiverId);
      if (!waiver || waiver.decision !== 'approved') {
        errors.push(`/review_passes ${pass.stage} pass ${pass.pass} references unapproved waiver "${waiverId}"`);
      } else if (waiver.scope !== pass.scope) {
        errors.push(`/review_passes ${pass.stage} pass ${pass.pass} waiver "${waiverId}" must match review scope`);
      }
    }
    if (['stage-10', 'stage-14'].includes(pass.stage) && pass.result === 'clean' &&
        Date.parse(pass.reviewed_at) >= ARTIFACT_BINDING_REQUIRED_FROM &&
        (!pass.artifact_set_version || !pass.artifact_manifest_sha256)) {
      errors.push(`/review_passes ${pass.stage} pass ${pass.pass} must pin artifact_set_version and artifact_manifest_sha256`);
    }
  }

  for (const stage of ['stage-02', 'stage-07', 'stage-10', 'stage-14', 'stage-16', 'stage-19']) {
    for (const window of stageExitWindows(history, stage)) {
      const passes = passesInWindow(reviewPasses, stage, window);
      const latest = passes[passes.length - 1] || null;
      const fromNumber = stageNumber(stage);
      const toNumber = stageNumber(window.exit.to);
      const forward = window.exit.to === 'complete' ||
        (toNumber !== null && fromNumber !== null && toNumber > fromNumber);
      if (forward) {
        // The owner decision authorises the low-cosmetic closure for stage-07
        // only; every other forward exit keeps clean-only semantics.
        const closes = stage === 'stage-07' ? passClosesStage(latest) : Boolean(latest && latest.result === 'clean');
        if (!closes) {
          errors.push(`/review_passes latest ${stage} pass for exit to ${window.exit.to} must be clean, or low-cosmetic findings dispositioned in a recorded polish backlog`);
        }
      } else if (!latest || latest.result !== 'findings') {
        errors.push(`/review_passes latest ${stage} pass for exit to ${window.exit.to} must be findings`);
      }
    }
  }

  const completedSlices = new Set(status.delivery.completed_slices);
  const sliceEvidence = status.delivery.completed_slice_evidence;
  const evidenceSlices = new Set();
  for (const entry of sliceEvidence) {
    if (evidenceSlices.has(entry.slice)) {
      errors.push(`/delivery/completed_slice_evidence duplicate slice "${entry.slice}"`);
    }
    evidenceSlices.add(entry.slice);
  }
  for (const slice of completedSlices) {
    if (evidenceSlices.has(slice)) continue;
    errors.push(`/delivery/completed_slice_evidence must contain records for completed slice "${slice}"`);
  }
  for (const slice of evidenceSlices) {
    if (!completedSlices.has(slice)) {
      errors.push(`/delivery/completed_slice_evidence references non-completed slice "${slice}"`);
    }
  }

  for (const waiver of ownerDecisions.filter(
    (entry) => entry.id.startsWith('waiver:') && entry.decision === 'approved'
  )) {
    const dueNumber = nextIndependentStage(waiver.permitted_next_stage);
    const dueStage = dueNumber === null
      ? null
      : `stage-${String(dueNumber).padStart(2, '0')}`;
    if (dueStage) {
      const applicableWindows = stageExitWindows(history, dueStage)
        .filter((window) => Date.parse(window.exit.changed_at) >= Date.parse(waiver.decided_at));
      if (applicableWindows.length) {
        const firstWindow = applicableWindows[0];
        const confirmingPass = passesInWindow(reviewPasses, dueStage, firstWindow).find(
          (entry) =>
            entry.result === 'clean' &&
            entry.scope === waiver.scope &&
            entry.waiver_ids.includes(waiver.id)
        );
        if (!confirmingPass) {
          errors.push(`/owner_decisions waiver "${waiver.id}" must be verified by the clean ${dueStage} pass before leaving that stage`);
        }
      }
    }
  }

  const metrics = status.progress.agent_reviews;
  const expectedMetrics = {
    valid: reviewPasses.filter((entry) => ['clean', 'findings'].includes(entry.result)).length,
    blocked: reviewPasses.filter((entry) => entry.result === 'blocked').length,
    invalid: reviewPasses.filter((entry) => entry.result === 'invalid').length,
  };
  for (const key of ['valid', 'blocked', 'invalid']) {
    if (metrics[key] !== expectedMetrics[key]) {
      errors.push(`/progress/agent_reviews/${key} must equal recorded review passes (${expectedMetrics[key]})`);
    }
  }
  if (metrics.total !== metrics.valid + metrics.blocked + metrics.invalid + metrics.active) {
    errors.push('/progress/agent_reviews/total must equal valid + blocked + invalid + active');
  }

  if (status.delivery.slice_status === 'deployed' &&
      status.delivery.active_slice &&
      !(status.delivery.delivered_ui_slices || []).includes(status.delivery.active_slice)) {
    errors.push('/delivery/delivered_ui_slices must include the active deployed slice so later impact scopes can select it for recheck');
  }

  if (status.control.current_stage === 'complete') {
    for (const stage of ['stage-02', 'stage-07', 'stage-10', 'stage-14', 'stage-16', 'stage-19']) {
      const latest = latestPass(reviewPasses, stage);
      const closesForCompletion = stage === 'stage-07' ? passClosesStage(latest) : Boolean(latest && latest.result === 'clean');
      if (!closesForCompletion) {
        errors.push(`/review_passes latest ${stage} pass must be clean, or low-cosmetic findings dispositioned in a recorded polish backlog, before completion`);
      }
    }
    if (!status.delivery.completed_slices.length) {
      errors.push('/delivery/completed_slices must contain at least one accepted slice before completion');
    }
    if (!status.delivery.consolidated_backlog) {
      errors.push('/delivery/consolidated_backlog is required before completion');
    }
    if (status.delivery.active_slice !== null) {
      errors.push('/delivery/active_slice must be null at completion');
    }
    if ((status.delivery.ui_parity_corrections || []).length) {
      errors.push('/delivery/ui_parity_corrections must be empty at completion');
    }
    if (status.delivery.reopened_slices.some((entry) => entry.status === 'open')) {
      errors.push('/delivery/reopened_slices cannot contain open entries at completion');
    }
    if (status.blockers.some((entry) => entry.status === 'open')) {
      errors.push('/blockers cannot contain open entries at completion');
    }
    if (status.progress.completed_percent !== 100) {
      errors.push('/progress/completed_percent must be 100 at completion');
    }
    if (!status.delivery.owner_walkthrough_reports.length) {
      const decision = ownerDecisions.find(
        (entry) => entry.id === status.delivery.owner_walkthrough_decision_id
      );
      if (!decision ||
          !decision.id.startsWith('owner-walkthrough-declined:') ||
          decision.decision !== 'approved' ||
          decision.scope !== status.project.id) {
        errors.push('/delivery requires an owner walkthrough report or an approved exact-project owner decision declining it');
      }
    }
    for (const waiver of ownerDecisions.filter(
      (entry) => entry.id.startsWith('waiver:') && entry.decision === 'approved'
    )) {
      const confirmingPass = reviewPasses.find(
        (entry) =>
          entry.result === 'clean' &&
          entry.scope === waiver.scope &&
          entry.waiver_ids.includes(waiver.id)
      );
      if (!confirmingPass) {
        errors.push(`/owner_decisions waiver "${waiver.id}" requires an exact-scope clean independent review before completion`);
      }
    }
    const completion = history[history.length - 1];
    if (!completion || !completion.gate_evidence.some((entry) => /stage-19.*acceptance/i.test(entry))) {
      errors.push('/transition_history completion requires Stage 19 acceptance evidence');
    }
  }
  return errors;
}

function statusProjectRoot(file) {
  const directory = path.dirname(path.resolve(file));
  return path.basename(directory).toLowerCase() === 'analysis'
    ? path.dirname(directory)
    : directory;
}

function durableEvidencePaths(status) {
  const paths = new Set();
  const add = (value) => {
    if (isNonEmptyString(value)) paths.add(value.trim());
  };
  add(status.constitution && status.constitution.ratification_record);
  add(status.architecture_review?.owner_verdict);
  add(status.architecture_review?.closure_report);
  for (const transition of status.transition_history || []) {
    for (const evidence of transition.gate_evidence || []) add(evidence);
    add(transition.owner_approval && transition.owner_approval.record);
  }
  if (status.transition_request) {
    for (const evidence of status.transition_request.gate_evidence || []) add(evidence);
    add(status.transition_request.owner_approval && status.transition_request.owner_approval.record);
  }
  for (const pass of status.review_passes || []) {
    add(pass.report);
    add(pass.independence_record);
  }
  for (const decision of status.owner_decisions || []) add(decision.record);
  for (const blocker of status.blockers || []) {
    for (const evidence of blocker.evidence || []) add(evidence);
  }
  if (status.legacy_walkthrough) {
    add(status.legacy_walkthrough.record);
    for (const blockedScope of status.legacy_walkthrough.unresolved_blocked_scopes || []) {
      for (const evidence of blockedScope.evidence || []) add(evidence);
    }
  }
  if (status.delivery) {
    add(status.delivery.consolidated_backlog);
    for (const report of status.delivery.owner_walkthrough_reports || []) add(report);
    for (const reopened of status.delivery.reopened_slices || []) add(reopened.record);
    for (const entry of status.delivery.completed_slice_evidence || []) {
      add(entry.spec);
      add(entry.plan);
      add(entry.tasks);
      add(entry.delivery_record);
      add(entry.acceptance_record);
    }
  }
  return paths;
}

function containsSymlink(root, file) {
  const relative = path.relative(root, file);
  let current = root;
  for (const part of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) return true;
  }
  return false;
}

// Quoted markup is evidence, not an unfilled placeholder. A reconnaissance
// record or review report that cites `<action path="/view/x">` must not be
// rejected the way `<exact scope>` in an untouched template is. Template
// placeholders are prose and never appear inside code spans, so the placeholder
// probe runs against the prose only.
function withoutCodeSpans(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    // A code span may wrap across lines, so allow newlines inside it but stop
    // at a blank line: an unbalanced backtick must not swallow whole sections.
    .replace(/`(?:[^`\n]|\n(?!\s*\n))*`/g, ' ')
    .replace(/^(?: {4}|\t).*$/gm, ' ');
}

function templateOnlyEvidence(content) {
  const text = content.trim();
  if (!text) return true;
  if (PLACEHOLDER.test(withoutCodeSpans(text))) return true;
  const meaningful = text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/[`#>*_[\]()|:;.,!?/\\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return meaningful.length < 24 || meaningful.split(' ').filter(Boolean).length < 4;
}

function independenceDeclaration(report) {
  const match = report.match(/^##+\s*Independence Declaration\s*$([\s\S]*?)(?=^##\s|\Z)/im);
  return match ? match[1] : null;
}

function validateRecordedEvidence(status, root) {
  // A findings pass that closes its stage cites a polish backlog; the citation
  // is only evidence if the file exists.
  {
    const errors = [];
    for (const pass of (status && status.review_passes) || []) {
      if (pass.result === 'findings' && typeof pass.dispositioned_in === 'string' && pass.dispositioned_in.trim()) {
        // The citation is evidence only when it names a regular file INSIDE the
        // project: ".", a directory, or an escaping ../ path all "exist".
        const resolved = path.resolve(root, pass.dispositioned_in);
        const named = path.basename(resolved) === 'ui-polish-backlog.md';
        let canonicalInside = false;
        let regularNonEmpty = false;
        try {
          const realRoot = fs.realpathSync(path.resolve(root));
          const real = fs.realpathSync(resolved);
          canonicalInside = real !== realRoot && real.startsWith(realRoot + path.sep);
          const stat = fs.statSync(real);
          regularNonEmpty = stat.isFile() && stat.size > 0;
        } catch { /* missing or unreadable: refused below */ }
        if (!named || !canonicalInside || !regularNonEmpty) {
          errors.push(`/review_passes ${pass.stage} pass ${pass.pass} dispositioned_in "${pass.dispositioned_in}" must be the non-empty ui-polish-backlog.md, canonically inside the project`);
        } else {
          // Linkage, not just existence: the backlog must record THIS pass -
          // its section carries the pass's session_id, so a stale or
          // placeholder backlog cannot close a later pass it never recorded.
          // What the dispositions SAY remains reviewer judgement; what the
          // machine refuses is a backlog that never mentions the pass at all.
          const backlog = fs.readFileSync(resolved, 'utf8');
          if (!pass.session_id || !backlog.includes(pass.session_id)) {
            errors.push(`/review_passes ${pass.stage} pass ${pass.pass} dispositioned_in backlog does not record this pass (its session_id must appear in the file)`);
          }
        }
      }
    }
    if (errors.length) return errors.concat(validateRecordedEvidenceInner(status, root));
  }
  return validateRecordedEvidenceInner(status, root);
}

function validateRecordedEvidenceInner(status, root) {
  const errors = [];
  if (!status || typeof status !== 'object') return ['/status must be an object'];
  try { require('./architecture-review-records').validateReviewTransitions(root, status); }
  catch (error) { errors.push(error.message); }
  for (const relative of durableEvidencePaths(status)) {
    try {
      const file = resolveInside(root, relative, 'recorded evidence');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        errors.push(`/recorded evidence file does not exist: ${relative}`);
        continue;
      }
      if (containsSymlink(root, file)) {
        errors.push(`/recorded evidence must not use a symbolic link: ${relative}`);
        continue;
      }
      const content = fs.readFileSync(file, 'utf8');
      if (templateOnlyEvidence(content)) {
        errors.push(`/recorded evidence is empty or template-only: ${relative}`);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }

  for (const pass of status.review_passes || []) {
    if (pass.independence_record !== pass.report) continue;
    try {
      const file = resolveInside(root, pass.report, 'review report');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
      const declaration = independenceDeclaration(fs.readFileSync(file, 'utf8'));
      if (!declaration) {
        errors.push(
          `/review_passes ${pass.stage} pass ${pass.pass} independence_record points at the report, which has no Independence Declaration section`
        );
      } else if (/^\s*-\s*\[\s*\]/m.test(declaration)) {
        errors.push(
          `/review_passes ${pass.stage} pass ${pass.pass} independence_record points at the report, whose Independence Declaration has unchecked items`
        );
      } else if ((declaration.match(/^\s*-\s*\[[xX]\]/gm) || []).length < 4) {
        errors.push(
          `/review_passes ${pass.stage} pass ${pass.pass} independence_record points at the report, whose Independence Declaration is incomplete`
        );
      }
    } catch (error) {
      errors.push(error.message);
    }
  }

  for (const binding of [
    { stage: 'stage-10', after: 10, file: 'analysis/architecture/architecture-nfr-manifest.json', version: 'document_set_version' },
    { stage: 'stage-14', after: 14, file: 'analysis/knowledge/knowledge-manifest.json', version: 'knowledge_set_version' },
  ]) {
    const pass = [...(status.review_passes || [])]
      .filter((entry) => entry.stage === binding.stage && entry.result === 'clean' &&
        Date.parse(entry.reviewed_at) >= ARTIFACT_BINDING_REQUIRED_FROM)
      .sort((left, right) => Date.parse(left.reviewed_at) - Date.parse(right.reviewed_at))
      .at(-1);
    if (!pass) continue;
    const currentNumber = status.control?.current_stage === 'complete' ? 20 : Number(status.control?.current_stage?.slice(-2) || 0);
    const returnedAfterPass = (status.transition_history || []).some(t =>
      Number(t.from?.slice(-2)) >= binding.after && Number(t.to?.slice(-2)) < binding.after &&
      Date.parse(t.changed_at) > Date.parse(pass.reviewed_at));
    if (currentNumber <= binding.after && returnedAfterPass) continue;
    try {
      const manifestFile = resolveInside(root, binding.file, `${binding.stage} artifact manifest`);
      const manifest = readJsonFile(manifestFile);
      const actualHash = sha256File(manifestFile);
      if (pass.artifact_set_version !== manifest[binding.version]) {
        errors.push(`/review_passes ${binding.stage} pass ${pass.pass} artifact_set_version does not match ${binding.file}`);
      }
      if (!pass.artifact_manifest_sha256 || pass.artifact_manifest_sha256.toLowerCase() !== actualHash) {
        errors.push(`/review_passes ${binding.stage} pass ${pass.pass} artifact_manifest_sha256 does not match ${binding.file}`);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (status.delivery) {
    for (const entry of status.delivery.completed_slice_evidence || []) {
      const expectedPrefix = `specs/${entry.slice}/`;
      for (const key of ['spec', 'plan', 'tasks']) {
        if (!entry[key].replaceAll('\\', '/').startsWith(expectedPrefix)) {
          errors.push(`/delivery/completed_slice_evidence ${entry.slice} ${key} must be under ${expectedPrefix}`);
        }
      }
      try {
        const tasksFile = resolveInside(root, entry.tasks, 'completed slice tasks');
        if (fs.existsSync(tasksFile) && fs.statSync(tasksFile).isFile()) {
          const tasks = fs.readFileSync(tasksFile, 'utf8');
          if (!/^\s*-\s*\[[xX]\]/m.test(tasks)) {
            errors.push(`/delivery/completed_slice_evidence ${entry.slice} tasks must contain completed checkboxes`);
          }
          if (/^\s*-\s*\[\s\]/m.test(tasks)) {
            errors.push(`/delivery/completed_slice_evidence ${entry.slice} tasks contain unchecked work`);
          }
        }
      } catch (error) {
        errors.push(error.message);
      }
    }
  }
  return errors;
}

function loadAndValidateStatus(file, schemaFile = DEFAULT_SCHEMA_FILE) {
  const resolvedFile = path.resolve(file);
  const status = parseYamlFile(resolvedFile);
  const errors = [
    ...validateStatus(status, loadStatusSchema(schemaFile)),
    ...validateConstitutionVersion(status, statusProjectRoot(resolvedFile)),
    ...validateRecordedEvidence(status, statusProjectRoot(resolvedFile)),
  ];
  if (errors.length) {
    throw new Error(`migration status schema validation failed: ${errors.join('; ')}`);
  }
  return status;
}

function validateConstitutionVersion(status, root) {
  if (!status?.constitution || typeof status.constitution.version !== 'string') return [];
  try {
    const file = resolveInside(root, '.specify/memory/constitution.md', 'project constitution');
    if (containsSymlink(root, file)) throw new Error('Project constitution must not use a symbolic link');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error('Project constitution is missing: .specify/memory/constitution.md');
    const actual = constitutionVersion(fs.readFileSync(file, 'utf8'));
    if (status.constitution.version !== actual) {
      return [`/constitution/version ${status.constitution.version} does not match project constitution Version ${actual}; reconcile the records without inferring ratification`];
    }
    return [];
  } catch (error) {
    return [error.message];
  }
}

function auditedScope(status, explicitScope) {
  const scope = explicitScope || (status && status.project && status.project.id);
  return isNonEmptyString(scope) ? scope.trim() : null;
}

function scopeAwareWaiver(status, gateName, scope) {
  if (!Object.hasOwn(WAIVER_PERMITTED_NEXT_STAGE, gateName)) {
    return {
      allowed: false,
      reason: `waiver gate "${gateName}" is not registered`,
    };
  }
  const waiverId = `waiver:${gateName}:${scope}`;
  const matches = (
    status && Array.isArray(status.owner_decisions) ? status.owner_decisions : []
  ).filter((decision) => decision.id === waiverId);
  if (matches.length !== 1) {
    return {
      allowed: false,
      reason: `owner_decisions must contain exactly one "${waiverId}" decision`,
    };
  }
  const waiver = matches[0];
  if (waiver.decision !== 'approved') {
    return { allowed: false, reason: `${waiverId} is not approved` };
  }
  if (!scope) return { allowed: false, reason: 'the audited scope is not defined' };
  if (waiver.scope !== scope) {
    return {
      allowed: false,
      reason: `${waiverId} covers exact scope "${waiver.scope}", not "${scope}"`,
    };
  }
  const expectedNextStage = WAIVER_PERMITTED_NEXT_STAGE[gateName];
  if (waiver.permitted_next_stage !== expectedNextStage) {
    return {
      allowed: false,
      reason: `${waiverId} must permit ${expectedNextStage}, not ${waiver.permitted_next_stage}`,
    };
  }
  return { allowed: true, waiver };
}

function run(options = {}) {
  const result = new AuditResult('STATUS VALIDATION');
  const file = path.resolve(
    options.file ||
    process.env.MIGRATION_STATUS_FILE ||
    path.join(__dirname, '..', 'migration_status.yaml')
  );
  const schemaFile = path.resolve(
    options.schemaFile ||
    process.env.MIGRATION_STATUS_SCHEMA ||
    DEFAULT_SCHEMA_FILE
  );
  let status;
  try {
    status = parseYamlFile(file);
    result.merge(validateStatus(status, loadStatusSchema(schemaFile)));
    result.merge(validateConstitutionVersion(status, statusProjectRoot(file)));
    result.merge(validateRecordedEvidence(status, statusProjectRoot(file)));
    if (options.requireCompletion && status.control.current_stage !== 'complete') {
      result.fail('/control/current_stage must be complete for the acceptance audit');
    }
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  if (result.ok) {
    result.summary = `Validated ${path.basename(file)} at ${status.control.current_stage}`;
  }
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['file', 'schema'], [
    'MIGRATION_STATUS_FILE',
    'MIGRATION_STATUS_SCHEMA',
  ]);
  process.exitCode = printResult(run({
    file: args.file,
    schemaFile: args.schema,
    requireCompletion: args['require-completion'],
  }));
}

module.exports = {
  DEFAULT_SCHEMA_FILE,
  TOTAL_STAGES,
  passClosesStage,
  auditedScope,
  expectedReport,
  formalStageProgress,
  loadAndValidateStatus,
  loadStatusSchema,
  run,
  scopeAwareWaiver,
  WAIVER_PERMITTED_NEXT_STAGE,
  stageNumber,
  statusProjectRoot,
  validateStatus,
  validateConstitutionVersion,
  validateRecordedEvidence,
};

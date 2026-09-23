'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const YAML = require('yaml');
const { sha256File } = require('./lib');

function temporaryDirectory(t, prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function validStatus(overrides = {}) {
  const status = {
    schema_version: '1.5.0',
    project: {
      id: 'fixture-scope',
      name: 'Fixture modernization',
      owner: 'project owner',
    },
    control: {
      state: 'bootstrap',
      current_stage: 'bootstrap',
      stage_status: 'awaiting_owner',
      previous_stage: null,
      next_action: 'Owner reviews and explicitly ratifies the project constitution.',
      automatic_advancement: false,
    },
    constitution: {
      status: 'unratified',
      version: '0.1.0-draft',
      ratified_by: null,
      ratified_at: null,
      ratification_record: null,
    },
    bootstrap_gates: {
      initializer_self_test: 'pending',
      status_schema_validation: 'pending',
      command_contract_configured: 'pending',
      owner_stage_1_approval: 'pending',
    },
    transition_request: null,
    transition_history: [],
    review_passes: [],
    owner_decisions: [],
    blockers: [],
    legacy_walkthrough: {
      outcome: 'pending',
      scope: 'fixture-scope',
      record: null,
      decision_id: null,
      unresolved_blocked_scopes: [],
    },
    delivery: {
      active_slice: null,
      delivered_ui_slices: [],
      ui_parity_corrections: [],
      slice_status: 'not_started',
      completed_slices: [],
      completed_slice_evidence: [],
      reopened_slices: [],
      consolidated_backlog: null,
      owner_walkthrough_reports: [],
      owner_walkthrough_decision_id: null,
    },
    progress: {
      summary: 'Bootstrap fixture is awaiting owner action.',
      completed_percent: 0,
      updated_at: '2026-07-28T10:00:00Z',
      agent_reviews: {
        total: 0,
        valid: 0,
        blocked: 0,
        invalid: 0,
        active: 0,
      },
    },
  };
  const reviewPasses = overrides.review_passes || status.review_passes;
  const derivedReviewMetrics = {
    valid: reviewPasses.filter((entry) => ['clean', 'findings'].includes(entry.result)).length,
    blocked: reviewPasses.filter((entry) => entry.result === 'blocked').length,
    invalid: reviewPasses.filter((entry) => entry.result === 'invalid').length,
    active: 0,
  };
  derivedReviewMetrics.total =
    derivedReviewMetrics.valid +
    derivedReviewMetrics.blocked +
    derivedReviewMetrics.invalid +
    derivedReviewMetrics.active;
  const currentStage = (overrides.control && overrides.control.current_stage) || status.control.current_stage;
  const currentStageNumber = /^stage-(\d{2})$/.test(currentStage)
    ? Number(currentStage.slice(-2))
    : null;
  const derivedCompletedPercent = currentStage === 'complete'
    ? 100
    : currentStageNumber === null
      ? 0
      : Math.round(((currentStageNumber - 1) / 20) * 100);

  return {
    ...status,
    ...overrides,
    project: {
      ...status.project,
      ...(overrides.project || {}),
    },
    control: {
      ...status.control,
      ...(overrides.control || {}),
    },
    constitution: {
      ...status.constitution,
      ...(overrides.constitution || {}),
    },
    bootstrap_gates: {
      ...status.bootstrap_gates,
      ...(overrides.bootstrap_gates || {}),
    },
    legacy_walkthrough: {
      ...status.legacy_walkthrough,
      ...(overrides.legacy_walkthrough || {}),
    },
    delivery: {
      ...status.delivery,
      ...(overrides.delivery || {}),
    },
    progress: {
      ...status.progress,
      ...(overrides.progress || {}),
      completed_percent:
        overrides.progress && overrides.progress.completed_percent !== undefined
          ? overrides.progress.completed_percent
          : derivedCompletedPercent,
      agent_reviews: {
        ...derivedReviewMetrics,
        ...((overrides.progress && overrides.progress.agent_reviews) || {}),
      },
    },
  };
}

function validWaiver(
  gate = 'prototyping_retroactive',
  scope = 'fixture-scope',
  permittedNextStage = {
    legacy_walkthrough_fallback: 'stage-04',
    application_form_style: 'stage-06',
    prototyping_retroactive: 'stage-06',
    architecture_retroactive: 'stage-09',
    pre_sdd_knowledge: 'stage-15',
  }[gate] || 'stage-04',
) {
  return {
    id: `waiver:${gate}:${scope}`,
    decision: 'approved',
    decided_by: 'project owner',
    decided_at: '2026-07-28T10:00:00Z',
    scope,
    rationale: 'The owner accepted progression because the governed phase cannot run.',
    record: 'analysis/stages/waivers/fixture-waiver.md',
    residual_risk: 'The unavailable activity remains unverified and is tracked through acceptance.',
    permitted_next_stage: permittedNextStage,
  };
}

function writeStatus(directory, status) {
  const root = path.basename(directory).toLowerCase() === 'analysis' ? path.dirname(directory) : directory;
  const constitution = path.join(root, '.specify/memory/constitution.md');
  if (!fs.existsSync(constitution)) {
    fs.mkdirSync(path.dirname(constitution), { recursive: true });
    fs.writeFileSync(constitution, `# Fixture constitution\n\n**Version:** \`${status.constitution.version}\`\n`);
  }
  const file = path.join(directory, 'migration_status.yaml');
  fs.writeFileSync(file, YAML.stringify(status), 'utf8');
  return file;
}

function approvalDocument(fields) {
  return [
    '# Owner approval',
    ...Object.entries(fields).map(([label, value]) => `- ${label}: \`${value}\``),
    '',
  ].join('\n');
}

module.exports = {
  approvalDocument,
  sha256File,
  temporaryDirectory,
  validStatus,
  validWaiver,
  writeStatus,
};

#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  AuditResult,
  PLACEHOLDER,
  documentField,
  parseArgs,
  parseYamlFile,
  printResult,
  rejectGovernedOverrides,
} = require('./lib');
const { run: runRemoteCheck } = require('./remote-connect');
const { runVisualParity } = require('./ui-parity-audit');
const { rollbackReadinessErrors } = require('./rollback-readiness');
const { liveReconciliationErrors } = require('./live-reconciliation');
const { validateAttestationHistory } = require('./verify-attestation-history');
const {
  deliveredRowErrors,
  loadWorkbookState,
  parseParityContracts,
} = require('./parity-map-contract');

function section(body, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`^## ${escaped}\\s*$`, 'mi').exec(body);
  if (!match) return '';
  const tail = body.slice(match.index + match[0].length);
  const nextHeading = /^## /m.exec(tail);
  return nextHeading ? tail.slice(0, nextHeading.index) : tail;
}

function tableRows(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => /^\s*\|.*\|\s*$/.test(line))
    .map((line) => line.trim().slice(1, -1).split('|').map((cell) => cell.trim()))
    .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

function resolveRecord(root, requested) {
  if (requested) return requested;
  const pointer = path.join(root, 'analysis', 'stages', 'stage-18', 'current-delivery-record.txt');
  if (!fs.existsSync(pointer)) return null;
  return fs.readFileSync(pointer, 'utf8').trim();
}

function runConfiguredUserJourney({ root, record, environmentId, revision }) {
  const projectConfig = parseYamlFile(path.join(root, 'config', 'project.yaml'));
  const contract = projectConfig.commands && projectConfig.commands.user_journey;
  if (!contract || !contract.command) {
    return { ok: false, message: 'config/project.yaml does not define commands.user_journey.command.' };
  }
  const workingDirectory = path.resolve(root, contract.working_directory);
  if (!workingDirectory.startsWith(`${root}${path.sep}`) && workingDirectory !== root) {
    return { ok: false, message: 'commands.user_journey.working_directory escapes the repository.' };
  }
  const missing = (contract.required_environment || []).filter((name) => !process.env[name]);
  if (missing.length > 0) {
    return { ok: false, message: `User journey requires missing environment variables: ${missing.join(', ')}.` };
  }
  const execution = spawnSync(contract.command, {
    cwd: workingDirectory,
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      DELIVERY_ENVIRONMENT_ID: environmentId,
      DELIVERY_RECORD: record,
      DELIVERY_REVISION: revision,
      DELIVERY_EVIDENCE_MODE: 'verify-only',
    },
  });
  if (execution.error) return { ok: false, message: execution.error.message };
  if (execution.status !== 0) {
    return { ok: false, message: `configured user journey exited with code ${execution.status}.` };
  }
  return { ok: true };
}

async function auditDeliveryRecord(options = {}) {
  const root = path.resolve(options.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const result = new AuditResult('DELIVERY RECORD AUDIT');
  const requestedRecord = resolveRecord(root, options.record);
  if (!requestedRecord) {
    result.fail('Stage 18 requires --record=<path> or analysis/stages/stage-18/current-delivery-record.txt.');
    return result;
  }

  const record = path.resolve(root, requestedRecord);
  if (!record.startsWith(`${root}${path.sep}`) || !fs.existsSync(record)) {
    result.fail('The delivery record must be an existing file inside the repository.');
    return result;
  }

  const body = fs.readFileSync(record, 'utf8');
  if (PLACEHOLDER.test(body.replace(/<!--[\s\S]*?-->/g, ''))) {
    result.fail('The delivery record contains an unresolved placeholder.');
  }

  const environmentId = documentField(body, 'Environment ID');
  const slice = documentField(body, 'Slice');
  const revision = documentField(body, 'Deployed revision');
  const outcome = documentField(body, 'Result');
  const recordedWorkbookHash = String(documentField(body, 'Parity workbook SHA-256') || '').toLowerCase();
  const observedHostname = documentField(body, 'Observed hostname');
  const observedKernel = documentField(body, 'Observed kernel');
  for (const error of rollbackReadinessErrors({ root, record, body, revision, environmentId })) result.fail(error);
  for (const error of liveReconciliationErrors({ body, revision, environmentId })) result.fail(error);
  const config = parseYamlFile(path.join(root, 'config', 'environments.yaml'));
  const statusFile = path.join(root, 'analysis', 'migration_status.yaml');
  let status = null;
  try {
    status = parseYamlFile(statusFile);
  } catch (error) {
    result.fail(`Migration status cannot be loaded: ${error.message}`);
  }
  const environment = config.environments && config.environments[environmentId];

  if (!environment) result.fail(`Environment ID "${environmentId}" is not defined.`);
  if (!revision || revision.length < 7) result.fail('Deployed revision must be immutable and non-empty.');
  if (status && slice !== status.delivery.active_slice) {
    result.fail(`Delivery slice "${slice}" does not match active slice "${status.delivery.active_slice}".`);
  }
  if (revision && revision.length >= 7) {
    const ancestry = spawnSync(
      'git',
      ['-C', root, 'merge-base', '--is-ancestor', revision, 'HEAD'],
      { encoding: 'utf8' }
    );
    if (ancestry.status !== 0) {
      result.fail('Deployed revision is not a valid ancestor of the audited repository revision.');
    } else {
      try {
        for (const file of validateAttestationHistory(root, revision)) result.fail(`Non-records-only change after deployed candidate: ${file}`);
      } catch (error) { result.fail(`Attestation history cannot be verified: ${error.message}`); }
    }
  }
  if (outcome !== 'passed') result.fail('Stage 18 delivery Result must be passed.');
  const traceabilityFile = path.join(root, 'specs', 'traceability.md');
  const workbookFile = path.join(root, 'analysis', 'legacy_user_flows.xlsx');
  if (!fs.existsSync(traceabilityFile) || !fs.existsSync(workbookFile)) {
    result.fail('Stage 18 requires specs/traceability.md and analysis/legacy_user_flows.xlsx.');
  } else {
    const parity = parseParityContracts(fs.readFileSync(traceabilityFile, 'utf8'));
    for (const error of parity.errors) result.fail(error);
    const contract = parity.contracts.get(slice);
    if (!contract) result.fail(`No parity delivery contract exists for slice "${slice}".`);
    try {
      const workbookState = await loadWorkbookState(workbookFile);
      if (recordedWorkbookHash !== workbookState.sha256) {
        result.fail('Parity workbook SHA-256 does not match the workbook audited for this delivery.');
      }
      if (contract) {
        for (const error of deliveredRowErrors(contract, workbookState)) result.fail(error);
        const closureRows = tableRows(section(body, 'Parity Map Closure')).slice(1);
        if (contract.scope === 'target-only') {
          if (!closureRows.some((row) => row[0] === 'target-only' && row[1] === contract.ownerDecision)) {
            result.fail('Target-only delivery must record its exact owner decision in Parity Map Closure.');
          }
        } else {
          const recorded = new Set(closureRows.map((row) => Number(row[0])).filter(Number.isInteger));
          for (const rowNumber of [...contract.deliverRows, ...contract.deferredRows]) {
            if (!recorded.has(rowNumber)) result.fail(`Parity Map Closure does not record workbook row ${rowNumber}.`);
          }
        }
      }
    } catch (error) {
      result.fail(`Parity workbook cannot be verified: ${error.message}`);
    }
  }
  if (environment) {
    if (observedHostname !== environment.verification.expected_hostname) {
      result.fail('Observed hostname does not match the environment contract.');
    }
    if (observedKernel !== environment.verification.expected_kernel) {
      result.fail('Observed kernel does not match the environment contract.');
    }
  }
  const changedSurfaces = tableRows(section(body, 'Changed Surfaces')).slice(1);
  const validSurfaceRows = changedSurfaces.filter((row) =>
    row.length === 4 && row.every((cell) => cell && !/^none$/i.test(cell))
  );
  if (changedSurfaces.length === 0 || validSurfaceRows.length !== changedSurfaces.length) {
    result.fail('Every Changed Surfaces row must identify a concrete surface, role, action, and location.');
  }
  const surfaceIds = validSurfaceRows.map((row) => row[0]);
  if (new Set(surfaceIds).size !== surfaceIds.length) {
    result.fail('Changed Surfaces contains duplicate surface IDs.');
  }

  const smokeRows = tableRows(section(body, 'Smoke Results')).slice(1);
  const validSmokeRows = smokeRows.filter((row) =>
    row.length === 7 &&
    surfaceIds.includes(row[0]) &&
    row[1] &&
    row[2] &&
    row[3] &&
    row[4] &&
    /^pass$/i.test(row[5]) &&
    row[6] &&
    !/^none$/i.test(row[6])
  );
  if (smokeRows.length === 0 || validSmokeRows.length !== smokeRows.length) {
    result.fail('Every Smoke Results row must map to a changed surface and contain a passed useful action with expected, actual, and evidence.');
  }
  for (const surfaceId of surfaceIds) {
    if (!validSmokeRows.some((row) => row[0] === surfaceId)) {
      result.fail(`Changed surface "${surfaceId}" has no passed smoke result.`);
    }
  }
  if (!options.verifyConnection) {
    result.fail('Stage 18 requires --verify-connection; recorded observations alone are insufficient.');
  } else if (environment && result.ok) {
    const exitCode = runRemoteCheck({
      root,
      environment: environmentId,
      check: true,
    });
    if (exitCode !== 0) result.fail(`Live connection verification failed with exit code ${exitCode}.`);
  }
  if (!options.verifyUserJourney) {
    result.fail('Stage 18 requires --verify-user-journey; API and health smoke cannot replace a deployed user journey.');
  } else if (environment && result.ok) {
    const journey = runConfiguredUserJourney({ root, record, environmentId, revision });
    if (!journey.ok) result.fail(`Deployed user journey failed: ${journey.message}`);
  }
  if (!options.verifyVisualParity) {
    result.fail('Stage 18 requires --verify-visual-parity; a functional journey cannot prove the deployed UI matches the approved wireframes.');
  } else if (environment && result.ok) {
    const parity = runVisualParity({ root, deployed: true });
    if (!parity.ok) result.fail(`Deployed visual parity failed: ${parity.errors.join(' ')}`);
  }

  result.summary = result.ok
    ? `Validated delivery record and live environment ${environmentId}`
    : 'Stage 18 delivery evidence is invalid';
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root', 'record'], ['AUDIT_ROOT']);
  auditDeliveryRecord({
    root: args.root,
    record: args.record,
    verifyConnection: Boolean(args['verify-connection']),
    verifyUserJourney: Boolean(args['verify-user-journey']),
    verifyVisualParity: Boolean(args['verify-visual-parity']),
  }).then((result) => { process.exitCode = printResult(result); });
}

module.exports = { auditDeliveryRecord, runConfiguredUserJourney };

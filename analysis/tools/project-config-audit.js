#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  AuditResult,
  parseArgs,
  parseYamlFile,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  resolveInside,
  validateSchema,
} = require('./lib');
const { loadAndValidateStatus } = require('./status-validator');

const COMMAND_NAMES = ['build', 'test', 'visual_parity', 'deploy', 'smoke', 'user_journey', 'rollback'];
const EXPECTED_COMMAND_STAGES = {
  build: 'stage-17',
  test: 'stage-17',
  visual_parity: 'stage-17',
  deploy: 'stage-18',
  smoke: 'stage-18',
  user_journey: 'stage-18',
  rollback: 'stage-18',
};

function stageNumber(stage) {
  if (stage === 'bootstrap') return 0;
  if (stage === 'complete') return 20;
  const match = /^stage-(\d{2})$/.exec(stage);
  return match ? Number(match[1]) : -1;
}

function auditProjectConfig(options = {}) {
  const root = path.resolve(options.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const file = path.resolve(options.file || process.env.PROJECT_CONFIG_FILE || path.join(root, 'config', 'project.yaml'));
  const schemaFile = path.resolve(
    options.schemaFile || process.env.PROJECT_CONFIG_SCHEMA || path.join(root, 'config', 'project.schema.json')
  );
  const statusFile = path.resolve(
    options.statusFile || process.env.MIGRATION_STATUS_FILE || path.join(root, 'analysis', 'migration_status.yaml')
  );
  const result = new AuditResult('PROJECT CONFIG AUDIT');

  let config;
  let status;
  try {
    config = parseYamlFile(file);
    result.merge(validateSchema(readJsonFile(schemaFile), config));
    status = options.status || loadAndValidateStatus(statusFile);
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  if (!result.ok) return result;

  if (config.paths.environments !== 'config/environments.yaml') {
    result.fail('/paths/environments must identify config/environments.yaml');
  }

  for (const field of ['id', 'name', 'owner']) {
    if (config.project[field] !== status.project[field]) {
      result.fail(`/project/${field} must match migration_status.yaml`);
    }
  }

  const configured = status.bootstrap_gates.command_contract_configured === 'passed';
  const currentStageNumber = stageNumber(status.control.current_stage);
  if (currentStageNumber >= 11 && config.runtime.target_platforms.length === 0) {
    result.fail('/runtime/target_platforms must identify at least one target platform from stage-11');
  }
  if (configured) {
    if (config.paths.legacy_source === null) {
      result.fail('/paths/legacy_source cannot be null after command_contract_configured passes');
    } else {
      try {
        const legacySource = resolveInside(root, config.paths.legacy_source, 'paths.legacy_source');
        if (!fs.existsSync(legacySource)) result.fail('/paths/legacy_source does not exist');
      } catch (error) {
        result.fail(error.message);
      }
    }
  }
  for (const name of COMMAND_NAMES) {
    const command = config.commands[name];
    if (command.required_from_stage !== EXPECTED_COMMAND_STAGES[name]) {
      result.fail(`/commands/${name}/required_from_stage must be ${EXPECTED_COMMAND_STAGES[name]}`);
    }
    const requiredNow = currentStageNumber >= stageNumber(command.required_from_stage);
    if (requiredNow && command.command === null) {
      result.fail(
        `/commands/${name}/command cannot be null at ${status.control.current_stage}; ` +
        `it is required from ${command.required_from_stage}`
      );
    }
    try {
      const workingDirectory = resolveInside(root, command.working_directory, `commands.${name}.working_directory`);
      if ((configured || requiredNow) && (!fs.existsSync(workingDirectory) || !fs.statSync(workingDirectory).isDirectory())) {
        result.fail(`/commands/${name}/working_directory does not exist`);
      }
    } catch (error) {
      result.fail(error.message);
    }
  }

  result.summary = configured
    ? `Project identity and stage-aware command contract validated at ${status.control.current_stage}`
    : 'Project identity validated; bootstrap command contract remains fail-closed';
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root', 'file', 'schema', 'status'], [
    'AUDIT_ROOT',
    'MIGRATION_STATUS_FILE',
    'PROJECT_CONFIG_FILE',
    'PROJECT_CONFIG_SCHEMA',
  ]);
  process.exitCode = printResult(auditProjectConfig({
    root: args.root,
    file: args.file,
    schemaFile: args.schema,
    statusFile: args.status,
  }));
}

module.exports = { COMMAND_NAMES, EXPECTED_COMMAND_STAGES, auditProjectConfig, stageNumber };

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const YAML = require('yaml');
const { auditProjectConfig } = require('./project-config-audit');
const { temporaryDirectory, validStatus, writeStatus } = require('./helpers');

function writeFixture(t, configured, currentStage = 'bootstrap') {
  const root = temporaryDirectory(t, 'project-config-audit-');
  fs.mkdirSync(path.join(root, 'config'));
  fs.mkdirSync(path.join(root, 'analysis'));
  fs.copyFileSync(
    path.join(__dirname, '..', '..', 'config', 'project.schema.json'),
    path.join(root, 'config', 'project.schema.json')
  );
  fs.copyFileSync(
    path.join(__dirname, '..', 'migration_status.schema.json'),
    path.join(root, 'analysis', 'migration_status.schema.json')
  );
  const status = validStatus({
    bootstrap_gates: { command_contract_configured: configured ? 'passed' : 'pending' },
  });
  status.control.current_stage = currentStage;
  status.control.state = currentStage === 'bootstrap' ? 'bootstrap' : 'active';
  writeStatus(path.join(root, 'analysis'), status);

  const command = (name) => ({
    command: null,
    required_from_stage: ['build', 'test', 'visual_parity'].includes(name) ? 'stage-17' : 'stage-18',
    working_directory: '.',
    required_environment: [],
  });
  if (configured) fs.mkdirSync(path.join(root, 'legacy'));
  const config = {
    schema_version: '1.4.0',
    project: {
      ...status.project,
      initialized_at: '2026-07-28T10:00:00Z',
    },
    runtime: {
      audit_node_version: '22',
      initializer_shell: 'PowerShell 7+',
      target_platforms: currentStage === 'bootstrap' ? [] : ['linux-x64'],
    },
    paths: {
      legacy_source: configured ? 'legacy' : null,
      target_source: '.',
      environments: 'config/environments.yaml',
    },
    commands: Object.fromEntries(
      ['build', 'test', 'visual_parity', 'deploy', 'smoke', 'user_journey', 'rollback'].map((name) => [name, command(name)])
    ),
  };
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  return { root, config, status };
}

test('accepts null commands while the bootstrap command gate is pending', (t) => {
  const { root, status } = writeFixture(t, false);
  assert.equal(auditProjectConfig({ root, status }).ok, true);
});

test('requires every delivery command at stage 18', (t) => {
  const { root, config, status } = writeFixture(t, true, 'stage-18');
  for (const command of Object.values(config.commands)) command.command = 'tool run';
  config.commands.smoke.command = null;
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/commands/smoke/command')));
});

test('requires a deployed user journey independently from the HTTP smoke', (t) => {
  const { root, config, status } = writeFixture(t, true, 'stage-18');
  for (const command of Object.values(config.commands)) command.command = 'tool run';
  config.commands.user_journey.command = null;
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/commands/user_journey/command')));
});

test('requires project identity to match migration status', (t) => {
  const { root, config, status } = writeFixture(t, false);
  config.project.id = 'different-project';
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/project/id')));
});

test('rejects whitespace-only commands when a command is required', (t) => {
  const { root, config, status } = writeFixture(t, true, 'stage-17');
  config.commands.build.command = '   ';
  config.commands.test.command = 'tool test';
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/commands/build/command')));
});

test('rejects a missing legacy source at the configured gate', (t) => {
  const { root, config, status } = writeFixture(t, true);
  config.paths.legacy_source = null;
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/paths/legacy_source')));
});

test('does not require target commands before their relevant stages', (t) => {
  const { root, status } = writeFixture(t, true, 'stage-16');
  assert.equal(auditProjectConfig({ root, status }).ok, true);
});

test('requires build and test at stage 17 but not delivery commands', (t) => {
  const { root, config, status } = writeFixture(t, true, 'stage-17');
  config.commands.build.command = 'tool build';
  config.commands.test.command = 'tool test';
  config.commands.visual_parity.command = 'tool visual-parity';
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  assert.equal(auditProjectConfig({ root, status }).ok, true);

  config.commands.test.command = null;
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/commands/test/command')));
});

test('requires visual parity independently from functional tests at stage 17', (t) => {
  const { root, config, status } = writeFixture(t, true, 'stage-17');
  config.commands.build.command = 'tool build';
  config.commands.test.command = 'tool test';
  config.commands.visual_parity.command = null;
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert(result.errors.some((error) => error.includes('/commands/visual_parity/command')));
});

test('rejects command stage drift from the canonical contract', (t) => {
  const { root, config, status } = writeFixture(t, false);
  config.commands.deploy.required_from_stage = 'stage-17';
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/commands/deploy/required_from_stage')));
});

test('requires target platform metadata after architecture approval', (t) => {
  const { root, config, status } = writeFixture(t, true, 'stage-11');
  config.runtime.target_platforms = [];
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({ root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('/runtime/target_platforms')));
});

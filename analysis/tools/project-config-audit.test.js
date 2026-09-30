'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const YAML = require('yaml');
const { auditProjectConfig, sourceIntakeScope } = require('./project-config-audit');
const { sha256File } = require('./lib');
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
  if (configured) {
    fs.writeFileSync(path.join(root, 'legacy', 'main.js'), 'module.exports = 1;\n');
    fs.writeFileSync(path.join(root, 'analysis', 'source-assessment.md'), '# Source assessment\nComplete fixture source matches the supplied fixture; no missing components.\n');
    config.source_intake = {
      classification: 'complete', baseline_match: 'matched', source_roots: ['legacy'],
      inputs: [{ path: 'legacy/main.js', sha256: sha256File(path.join(root, 'legacy', 'main.js')) }],
      assessment_record: 'analysis/source-assessment.md',
      assessment_sha256: sha256File(path.join(root, 'analysis', 'source-assessment.md')),
      limitations: 'No missing fixture components; runtime behavior has not been observed.',
      fallback_decision_id: null,
    };
  }
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), YAML.stringify(config));
  return { root, config, status };
}

test('accepts null commands while the bootstrap command gate is pending', (t) => {
  const { root, status } = writeFixture(t, false);
  assert.equal(auditProjectConfig({ root, status }).ok, true);
  assert(auditProjectConfig({ root, status }).warnings.some(e => e.includes('source readiness is NOT established')));
  assert.equal(auditProjectConfig({ root, status, requireSourceReady: true }).ok, false);
});

test('Stage 1 cannot bypass intake by leaving command readiness pending', t => {
  const { root, status } = writeFixture(t, false, 'stage-01');
  assert(auditProjectConfig({ root, status }).errors.some(e => e.includes('/source_intake')));
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

test('a legacy folder and general owner approval do not replace source readiness', t => {
  const { root, config, status } = writeFixture(t, true);
  delete config.source_intake;
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert(auditProjectConfig({root, status}).errors.some(e => e.includes('/source_intake')));
});

test('partial source or unverified correspondence requires exact owner fallback approval', t => {
  const { root, config, status } = writeFixture(t, true, 'stage-01');
  const save = () => fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  config.source_intake.baseline_match = 'unverified';
  save();
  assert.equal(auditProjectConfig({root, status}).ok, false);
  fs.writeFileSync(path.join(root, 'analysis/owner-source-decision.md'), '# Owner decision\nThe owner explicitly accepts static fallback and its limitations for this assessment.\n');
  const d = {id:'source-fallback', decision:'approved', decided_by:status.project.owner,
    decided_at:'2026-09-30T10:00:00Z', scope:sourceIntakeScope(config.source_intake),
    rationale:'Use scoped static analysis; runtime claims remain unverified.', record:'analysis/owner-source-decision.md'};
  status.owner_decisions.push(d);
  config.source_intake.fallback_decision_id = d.id;
  save();
  assert.equal(auditProjectConfig({root, status}).ok, true);
  d.decided_by = 'agent';
  assert.equal(auditProjectConfig({root, status}).ok, false);
  d.decided_by = status.project.owner;
  d.decision = 'deferred';
  assert.equal(auditProjectConfig({root, status}).ok, false);
  d.decision = 'approved';
  config.source_intake.classification = 'partial';
  save();
  assert.equal(auditProjectConfig({root, status}).ok, false, 'Changed assessment needs a new scoped decision');
});

test('source assessment and input bytes are pinned and records cannot be placeholders', t => {
  const { root, config, status } = writeFixture(t, true);
  fs.appendFileSync(path.join(root, 'legacy/main.js'), '// changed');
  assert(auditProjectConfig({root, status}).errors.some(e=>e.includes('input hash')));
  config.source_intake.inputs[0].sha256 = sha256File(path.join(root, 'legacy/main.js'));
  fs.appendFileSync(path.join(root, 'analysis/source-assessment.md'), 'Later observation.');
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert(auditProjectConfig({root, status}).errors.some(e=>e.includes('assessment hash')));
  fs.writeFileSync(path.join(root, 'analysis/source-assessment.md'), 'TODO');
  config.source_intake.assessment_sha256 = sha256File(path.join(root, 'analysis/source-assessment.md'));
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert.equal(auditProjectConfig({root, status}).ok, false);
});

test('pre-policy later-stage project warns without rewriting its history', t => {
  const { root, config, status } = writeFixture(t, true, 'stage-03');
  delete config.source_intake;
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  const result = auditProjectConfig({root, status});
  assert.equal(result.ok, true);
  assert(result.warnings.some(e=>e.includes('before new/reopened source analysis')));
  config.source_intake = null;
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert.equal(auditProjectConfig({root, status}).ok, false, 'Adopted intake cannot be silently unset');
});

test('source readiness rejects escaping paths and empty source roots', t => {
  const { root, config, status } = writeFixture(t, true);
  config.source_intake.assessment_record = '../outside.md';
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert.equal(auditProjectConfig({root, status}).ok, false);
  config.source_intake.assessment_record = 'analysis/source-assessment.md';
  config.source_intake.source_roots = [];
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert.equal(auditProjectConfig({root, status}).ok, false);
});

test('binary-only intake can proceed only with its explicit bounded fallback', t => {
  const { root, config, status } = writeFixture(t, true);
  config.source_intake.classification = 'absent';
  config.source_intake.baseline_match = 'unverified';
  config.source_intake.source_roots = [];
  config.source_intake.fallback_decision_id = 'binary-fallback';
  fs.writeFileSync(path.join(root, 'analysis/decision.md'), '# Decision\nOwner accepts static package analysis only, with no runtime claims.\n');
  const d = {id:'binary-fallback', decision:'approved', decided_by:status.project.owner,
    decided_at:'2026-09-30T10:00:00Z', scope:sourceIntakeScope(config.source_intake),
    rationale:'Only package analysis is available.', record:'analysis/decision.md'};
  status.owner_decisions.push(d);
  fs.writeFileSync(path.join(root, 'config/project.yaml'), YAML.stringify(config));
  assert.equal(auditProjectConfig({root, status}).ok, true);
  fs.unlinkSync(path.join(root, 'analysis/decision.md'));
  assert.equal(auditProjectConfig({root, status}).ok, false);
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

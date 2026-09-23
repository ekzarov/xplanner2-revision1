'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const YAML = require('yaml');
const { auditEnvironmentConfig } = require('./environment-config-audit');
const { temporaryDirectory } = require('./helpers');
const { validateSchema } = require('./lib');

const schemaFile = path.resolve(__dirname, '../../config/environments.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
const emptyConfig = () => ({ schema_version: '1.0.0', default_environment: null, environments: {} });

function fixture(t, configured = true) {
  const root = temporaryDirectory(t, 'environment-config-audit-');
  fs.mkdirSync(path.join(root, 'config'), { recursive: true });
  fs.copyFileSync(schemaFile, path.join(root, 'config/environments.schema.json'));
  const config = emptyConfig();
  if (configured) {
    const keyPath = path.join(root, 'identity');
    const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', keyPath], { encoding: 'utf8' });
    assert.equal(generated.status, 0, 'Local ephemeral key generation must succeed');
    const publicKey = fs.readFileSync(`${keyPath}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
    const fingerprint = `SHA256:${crypto.createHash('sha256').update(Buffer.from(publicKey.split(' ')[1], 'base64')).digest('base64').replace(/=+$/, '')}`;
    config.default_environment = 'local-fixture';
    config.temporary_secret_policy = {
      plaintext_repository_credentials_allowed: true,
      repository_visibility_required: 'private',
      rotation_required: true,
      owner: 'Synthetic fixture owner',
      approved_at: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      expires_at: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      approval_evidence: 'Synthetic approval for ephemeral local test keys only.',
      applies_to: ['local-fixture'],
      reason: 'Locally generated keys never authorize a remote environment.',
      remediation: 'Remove ephemeral fixtures after each deterministic test.',
    };
    config.environments['local-fixture'] = {
      purpose: 'Synthetic local environment for deterministic tests only',
      connection: {
        protocol: 'ssh', host: 'fixture.invalid', port: 22, username: 'fixture',
        authentication: {
          mode: 'embedded_private_key',
          private_key_base64: fs.readFileSync(keyPath).toString('base64'),
          public_key_fingerprint: fingerprint,
        },
        known_hosts_file: 'config/fixture_known_hosts',
        host_key_fingerprints: [fingerprint],
      },
      deployment: {
        root_pattern: '/opt/{project}', existing_project_roots: {},
        container_runtime: 'docker-compose', reverse_proxy: 'nginx',
      },
      public_endpoints: { web: 'https://fixture.invalid' },
      verification: {
        connection_command: 'npm --prefix analysis/tools run remote:check',
        expected_hostname: 'fixture-host', expected_kernel: 'Linux',
      },
    };
    fs.writeFileSync(path.join(root, 'config/fixture_known_hosts'), `fixture.invalid ${publicKey}\n`);
    fs.rmSync(keyPath);
    fs.rmSync(`${keyPath}.pub`);
  }
  const file = path.join(root, 'config/environments.yaml');
  const save = () => fs.writeFileSync(file, YAML.stringify(config));
  save();
  return { root, file, config, save, environment: config.environments['local-fixture'] };
}

function externalAuthentication(t, sample) {
  const auth = sample.environment.connection.authentication;
  const name = 'AUDIT_SYNTHETIC_SSH_KEY';
  const original = process.env[name];
  t.after(() => {
    if (original === undefined) delete process.env[name];
    else process.env[name] = original;
  });
  process.env[name] = auth.private_key_base64;
  auth.mode = 'environment_variable';
  auth.private_key_environment_variable = name;
  delete auth.private_key_base64;
  delete sample.config.temporary_secret_policy;
  sample.save();
  return name;
}

function assertFailed(result, expected) {
  assert.equal(result.ok, false, result.summary);
  assert(result.errors.some((error) => expected.test(error)), result.errors.join('\n'));
}

test('unconfigured is structurally valid without policy or SSH credentials, but NOT remote-ready', (t) => {
  const { root } = fixture(t, false);
  const result = auditEnvironmentConfig({ root, requireVisibility: true, repositoryVisibility: 'public' });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.configured, false);
  assert.match(result.summary, /structurally valid; NOT remote-ready/);
  const cli = spawnSync(process.execPath, [path.join(__dirname, 'environment-config-audit.js'), `--root=${root}`, '--require-visibility'], {
    encoding: 'utf8', env: { ...process.env, AUDIT_TEST_MODE: '1', REPOSITORY_VISIBILITY: 'public', PATH: '' },
  });
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /NOT remote-ready/);
});

test('requireConfigured and --require-configured reject unconfigured', (t) => {
  const { root } = fixture(t, false);
  assertFailed(auditEnvironmentConfig({ root, requireConfigured: true }), /configured deployment environment is required/);
  const cli = spawnSync(process.execPath, [path.join(__dirname, 'environment-config-audit.js'), `--root=${root}`, '--require-configured'], {
    encoding: 'utf8', env: { ...process.env, AUDIT_TEST_MODE: '1' },
  });
  assert.equal(cli.status, 1);
  assert.match(`${cli.stdout}${cli.stderr}`, /NOT remote-ready/);
});

for (const [label, mutate] of [
  ['missing default', (config) => { delete config.default_environment; }],
  ['missing environments', (config) => { delete config.environments; }],
  ['named default without environments', (config) => { config.default_environment = 'missing'; }],
  ['empty string default', (config) => { config.default_environment = ''; }],
  ['null environments', (config) => { config.environments = null; }],
  ['unknown property', (config) => { config.unconfigured = true; }],
  ['incomplete environment', (config) => { config.environments.partial = {}; }],
]) {
  test(`schema rejects partial state: ${label}`, (t) => {
    const sample = fixture(t, false);
    mutate(sample.config);
    sample.save();
    assert.notEqual(validateSchema(schema, sample.config).length, 0);
    assert.equal(auditEnvironmentConfig({ root: sample.root }).ok, false);
  });
}

test('schema rejects a null default with configured environments, and audit rejects a missing named default', (t) => {
  const sample = fixture(t);
  sample.config.default_environment = null;
  assert.notEqual(validateSchema(schema, sample.config).length, 0);
  sample.config.default_environment = 'missing';
  sample.save();
  assertFailed(auditEnvironmentConfig({ root: sample.root }), /must name an entry/);
});

for (const [stage, sliceStatus, required] of [
  ['bootstrap', 'not_started', false], ['stage-17', 'in_progress', false],
  ['stage-18', 'in_progress', true], ['stage-19', 'accepted', true],
  ['complete', 'accepted', true], ['stage-15', 'deployed', true],
  ['stage-15', 'accepted', true],
]) {
  test(`unconfigured readiness at ${stage}/${sliceStatus} is ${required ? 'rejected' : 'structural only'}`, (t) => {
    const { root } = fixture(t, false);
    fs.mkdirSync(path.join(root, 'analysis'));
    fs.writeFileSync(path.join(root, 'analysis/migration_status.yaml'), YAML.stringify({
      control: { current_stage: stage }, delivery: { slice_status: sliceStatus, completed_slices: [] },
    }));
    const result = auditEnvironmentConfig({ root });
    assert.equal(result.ok, !required, result.errors.join('\n'));
    assert.match(result.summary, /NOT remote-ready/);
  });
}

test('unconfigured fails closed for unreadable or unknown readiness state', (t) => {
  const { root } = fixture(t, false);
  fs.mkdirSync(path.join(root, 'analysis'));
  const statusFile = path.join(root, 'analysis/migration_status.yaml');
  for (const content of ['control: [', '{}', 'control: {current_stage: stage-99}',
    'control: {current_stage: stage-00}\ndelivery: {slice_status: planning}',
    'control: {current_stage: stage-20}\ndelivery: {slice_status: planning}',
    'control: {current_stage: stage-17}\ndelivery: {slice_status: unknown}']) {
    fs.writeFileSync(statusFile, content);
    assertFailed(auditEnvironmentConfig({ root }), /Cannot determine environment readiness/);
  }
});

test('existing delivery pointer or completed slices cannot claim readiness while unconfigured', (t) => {
  const { root } = fixture(t, false);
  const stageDirectory = path.join(root, 'analysis/stages/stage-18');
  fs.mkdirSync(stageDirectory, { recursive: true });
  const pointer = path.join(stageDirectory, 'current-delivery-record.txt');
  fs.writeFileSync(pointer, 'delivery.md');
  assertFailed(auditEnvironmentConfig({ root }), /configured deployment environment is required/);
  fs.rmSync(pointer);
  fs.writeFileSync(path.join(root, 'analysis/migration_status.yaml'), YAML.stringify({
    control: { current_stage: 'stage-15' }, delivery: { slice_status: 'planning', completed_slices: ['001'] },
  }));
  assertFailed(auditEnvironmentConfig({ root }), /configured deployment environment is required/);
});

test('validates the configured legacy contract shape with ephemeral keys and temporary policy', (t) => {
  const { root } = fixture(t);
  const result = auditEnvironmentConfig({ root, requireConfigured: true, requireVisibility: true, repositoryVisibility: 'private' });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.configured, true);
});

test('unconfigured permits an optional valid policy without requiring private visibility', (t) => {
  const sample = fixture(t);
  sample.config.environments = {};
  sample.config.default_environment = null;
  sample.save();
  const result = auditEnvironmentConfig({ root: sample.root, requireVisibility: true, repositoryVisibility: 'public' });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('external key authentication needs no embedded-key policy or private visibility', (t) => {
  const sample = fixture(t);
  externalAuthentication(t, sample);
  assert.deepEqual(validateSchema(schema, sample.config), []);
  const result = auditEnvironmentConfig({ root: sample.root, requireVisibility: true, repositoryVisibility: 'public' });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('missing external key fails without printing its value', (t) => {
  const sample = fixture(t);
  const name = externalAuthentication(t, sample);
  delete process.env[name];
  assertFailed(auditEnvironmentConfig({ root: sample.root }), /does not resolve to an OpenSSH private key/);
});

test('embedded key visibility is private only; absent/unknown visibility fails closed in CI', (t) => {
  const { root } = fixture(t);
  for (const repositoryVisibility of ['public', 'internal', '', 'unknown']) {
    assertFailed(auditEnvironmentConfig({ root, requireVisibility: true, repositoryVisibility }), /verified private repository visibility/);
  }
  const cli = spawnSync(process.execPath, [path.join(__dirname, 'environment-config-audit.js'), `--root=${root}`, '--require-visibility'], {
    encoding: 'utf8', env: { ...process.env, AUDIT_TEST_MODE: '1', REPOSITORY_VISIBILITY: '' },
  });
  assert.equal(cli.status, 1);
  assert.match(`${cli.stdout}${cli.stderr}`, /verified private repository visibility/);
});

test('missing visibility is harmless without embedded keys', (t) => {
  const { root } = fixture(t, false);
  const result = auditEnvironmentConfig({ root, requireVisibility: true, repositoryVisibility: '' });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('optional policy is still validated in unconfigured and external-auth contracts', (t) => {
  for (const configured of [false, true]) {
    const sample = fixture(t, configured);
    if (configured) externalAuthentication(t, sample);
    sample.config.temporary_secret_policy = { owner: 'Incomplete policy' };
    sample.save();
    assertFailed(auditEnvironmentConfig({ root: sample.root }), /temporary_secret_policy/);
  }
});

test('external authentication retains fingerprint verification and allows an optional valid policy', (t) => {
  const sample = fixture(t);
  const policy = sample.config.temporary_secret_policy;
  externalAuthentication(t, sample);
  sample.config.temporary_secret_policy = policy;
  sample.save();
  const result = auditEnvironmentConfig({ root: sample.root, requireVisibility: true, repositoryVisibility: '' });
  assert.equal(result.ok, true, result.errors.join('\n'));
  sample.environment.connection.authentication.public_key_fingerprint = 'SHA256:wrong';
  sample.save();
  assertFailed(auditEnvironmentConfig({ root: sample.root }), /does not match the private key/);
});

test('an embedded secret cannot hide behind external authentication in public CI', (t) => {
  const sample = fixture(t);
  const key = sample.environment.connection.authentication.private_key_base64;
  externalAuthentication(t, sample);
  sample.environment.connection.authentication.private_key_base64 = key;
  sample.save();
  assertFailed(auditEnvironmentConfig({ root: sample.root, requireVisibility: true, repositoryVisibility: 'public' }), /additional properties/);
});

test('CI visibility applies to non-default embedded environments and full contract validation still runs', (t) => {
  const sample = fixture(t);
  const policy = sample.config.temporary_secret_policy;
  sample.config.environments.embedded = structuredClone(sample.environment);
  externalAuthentication(t, sample);
  sample.config.temporary_secret_policy = { ...policy, applies_to: ['embedded'] };
  sample.save();
  assertFailed(auditEnvironmentConfig({ root: sample.root, requireVisibility: true, repositoryVisibility: 'public' }), /verified private repository visibility/);
  sample.config.environments.embedded.connection.host_key_fingerprints = ['SHA256:wrong'];
  sample.save();
  assertFailed(auditEnvironmentConfig({ root: sample.root, requireVisibility: true, repositoryVisibility: 'private' }), /unpinned fingerprint/);
});

test('schema requires embedded-key policy even if only a non-default environment embeds a key', (t) => {
  const sample = fixture(t);
  sample.config.environments.embedded = structuredClone(sample.environment);
  externalAuthentication(t, sample);
  assert.notEqual(validateSchema(schema, sample.config).length, 0);
  assertFailed(auditEnvironmentConfig({ root: sample.root }), /temporary_secret_policy/);
});

for (const [label, mutate, expected] of [
  ['invalid embedded key', (s) => { s.environment.connection.authentication.private_key_base64 = Buffer.alloc(200, 'x').toString('base64'); }, /does not resolve to an OpenSSH private key/],
  ['bypassed helper', (s) => { s.environment.verification.connection_command = 'ssh fixture@fixture.invalid hostname'; }, /governed remote:check helper/],
  ['wrong identity fingerprint', (s) => { s.environment.connection.authentication.public_key_fingerprint = 'SHA256:not-the-key'; }, /does not match the private key/],
  ['wrong host fingerprint', (s) => { s.environment.connection.host_key_fingerprints = ['SHA256:not-the-host']; }, /unpinned fingerprint/],
  ['untrusted host', (s) => { s.environment.connection.host = 'other.invalid'; }, /does not pin/],
  ['wrong port pin', (s) => { s.environment.connection.port = 2222; }, /does not pin/],
  ['missing host file', (s) => { s.environment.connection.known_hosts_file = 'config/missing'; }, /does not exist/],
  ['unsafe host path', (s) => { s.environment.connection.known_hosts_file = '../outside'; }, /must match pattern/],
  ['insecure endpoint', (s) => { s.environment.public_endpoints.web = 'http://fixture.invalid'; }, /must match pattern/],
  ['unsafe deployment root', (s) => { s.environment.deployment.root_pattern = '/tmp/project'; }, /must match pattern/],
  ['expired policy', (s) => { s.config.temporary_secret_policy.approved_at = '2000-01-01'; s.config.temporary_secret_policy.expires_at = '2000-01-02'; }, /has expired/],
  ['reversed policy dates', (s) => { s.config.temporary_secret_policy.approved_at = s.config.temporary_secret_policy.expires_at; }, /must be after approved_at/],
  ['unauthorized environment', (s) => { s.config.temporary_secret_policy.applies_to = ['other']; }, /does not authorize embedded key/],
]) {
  test(`configured validation retains strict checks: ${label}`, (t) => {
    const sample = fixture(t);
    mutate(sample);
    sample.save();
    assertFailed(auditEnvironmentConfig({ root: sample.root }), expected);
  });
}

test('rejects environment identifiers that could escape a temporary directory', (t) => {
  const sample = fixture(t);
  sample.config.environments['../outside'] = sample.environment;
  sample.config.default_environment = '../outside';
  delete sample.config.environments['local-fixture'];
  sample.save();
  assertFailed(auditEnvironmentConfig({ root: sample.root }), /must match pattern/);
});

test('rejects undeclared host keys even when declared pins remain present', (t) => {
  const { root } = fixture(t);
  fs.appendFileSync(path.join(root, 'config/fixture_known_hosts'), '\nfixture.invalid ssh-ed25519 Zm9v\n');
  assertFailed(auditEnvironmentConfig({ root }), /undeclared host fingerprint/);
});

test('pins nonstandard SSH ports exactly', (t) => {
  const sample = fixture(t);
  sample.environment.connection.port = 2222;
  sample.save();
  const knownHosts = path.join(sample.root, 'config/fixture_known_hosts');
  fs.writeFileSync(knownHosts, fs.readFileSync(knownHosts, 'utf8').replace('fixture.invalid', '[fixture.invalid]:2222'));
  const result = auditEnvironmentConfig({ root: sample.root });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

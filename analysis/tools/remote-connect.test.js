'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const YAML = require('yaml');
const { spawnSync } = require('node:child_process');
const { temporaryDirectory } = require('./helpers');
const {
  buildSshArguments,
  cleanupStaleKeyDirectories,
  connectionDetails,
  run,
  verifyRemoteIdentity,
  withMaterializedPrivateKey,
} = require('./remote-connect');

function fixture(t, configured = true) {
  const root = temporaryDirectory(t, 'remote-connect-');
  fs.mkdirSync(path.join(root, 'config'));
  fs.copyFileSync(path.resolve(__dirname, '../../config/environments.schema.json'), path.join(root, 'config/environments.schema.json'));
  const config = { schema_version: '1.0.0', default_environment: null, environments: {} };
  if (configured) {
    const key = path.join(root, 'ephemeral');
    const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
    assert.equal(generated.status, 0, 'Local ephemeral key generation must succeed');
    const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
    const fingerprint = `SHA256:${crypto.createHash('sha256').update(Buffer.from(publicKey.split(' ')[1], 'base64')).digest('base64').replace(/=+$/, '')}`;
    config.default_environment = 'local-fixture';
    config.temporary_secret_policy = {
      plaintext_repository_credentials_allowed: true, repository_visibility_required: 'private',
      rotation_required: true, owner: 'Synthetic fixture owner',
      approved_at: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      expires_at: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      approval_evidence: 'Synthetic approval for ephemeral local test keys only.',
      applies_to: ['local-fixture'], reason: 'Locally generated keys cannot authorize any remote environment.',
      remediation: 'Remove the ephemeral fixture after the deterministic test.',
    };
    config.environments['local-fixture'] = {
      purpose: 'Local synthetic SSH test fixture',
      connection: {
        protocol: 'ssh', host: 'fixture.invalid', port: 22, username: 'fixture',
        authentication: {
          mode: 'embedded_private_key', private_key_base64: fs.readFileSync(key).toString('base64'),
          public_key_fingerprint: fingerprint,
        },
        known_hosts_file: 'config/fixture_known_hosts', host_key_fingerprints: [fingerprint],
      },
      deployment: { root_pattern: '/opt/{project}', existing_project_roots: {}, container_runtime: 'docker-compose', reverse_proxy: 'nginx' },
      public_endpoints: { web: 'https://fixture.invalid' },
      verification: {
        connection_command: 'npm --prefix analysis/tools run remote:check',
        expected_hostname: 'fixture-host', expected_kernel: 'Linux',
      },
    };
    fs.writeFileSync(path.join(root, 'config/fixture_known_hosts'), `fixture.invalid ${publicKey}\n`);
    fs.rmSync(key);
    fs.rmSync(`${key}.pub`);
  }
  const save = () => fs.writeFileSync(path.join(root, 'config/environments.yaml'), YAML.stringify(config));
  save();
  return { root, config, save };
}

function runLocalCli(sample, args = []) {
  const marker = path.join(sample.root, 'ssh-invoked');
  const preload = path.join(sample.root, 'stub-ssh.cjs');
  // Only the SSH process is stubbed. The audit still parses the contract,
  // materializes a real ephemeral key and verifies it with local ssh-keygen.
  fs.writeFileSync(preload, [
    "const cp = require('node:child_process');",
    'const spawnSync = cp.spawnSync;',
    'cp.spawnSync = (command, ...args) => {',
    "  if (command !== 'ssh') return spawnSync(command, ...args);",
    `  require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'invoked');`,
    "  return { status: 0, stdout: 'fixture-host\\nLinux\\n', stderr: '' };",
    '};',
  ].join('\n'));
  const result = spawnSync(process.execPath, [
    '--require', preload, path.join(__dirname, 'remote-connect.js'), `--root=${sample.root}`, '--check', ...args,
  ], { encoding: 'utf8', env: { ...process.env, REPOSITORY_VISIBILITY: 'private' } });
  return { ...result, output: `${result.stdout || ''}${result.stderr || ''}`, sshInvoked: fs.existsSync(marker) };
}

test('the real CLI resolves circular exports and completes an audited check with stubbed SSH', (t) => {
  const result = runLocalCli(fixture(t));
  assert.equal(result.status, 0, result.output);
  assert.equal(result.sshInvoked, true);
  assert.doesNotMatch(result.output, /is not a function|circular dependency/i);
  assert.match(result.output, /fixture-host\r?\nLinux/);
});

test('unconfigured is explicitly refused before any SSH invocation, including named overrides', (t) => {
  const sample = fixture(t, false);
  assert.throws(() => connectionDetails({ root: sample.root }), /unconfigured; NOT remote-ready/);
  assert.throws(() => run({ root: sample.root, check: true }), /SSH connection was refused/);
  for (const args of [[], ['--environment=missing']]) {
    const result = runLocalCli(sample, args);
    assert.equal(result.status, 1);
    assert.match(result.output, /unconfigured; NOT remote-ready/);
    assert.equal(result.sshInvoked, false);
  }
  assert.equal(fs.existsSync(path.join(sample.root, '.migration-tmp')), false);
});

test('configured CLI rejects unknown environments before SSH', (t) => {
  const result = runLocalCli(fixture(t), ['--environment=no-such-environment']);
  assert.equal(result.status, 1);
  assert.equal(result.sshInvoked, false);
  assert.match(result.output, /Unknown deployment environment "no-such-environment"/);
});

test('configured CLI rejects invalid fingerprints and partial state before SSH', (t) => {
  const sample = fixture(t);
  sample.config.environments['local-fixture'].connection.authentication.public_key_fingerprint = 'SHA256:wrong';
  sample.save();
  let result = runLocalCli(sample);
  assert.equal(result.status, 1);
  assert.equal(result.sshInvoked, false);
  assert.match(result.output, /does not match the private key/);
  sample.config.default_environment = null;
  sample.save();
  result = runLocalCli(sample, ['--environment=local-fixture']);
  assert.equal(result.status, 1);
  assert.equal(result.sshInvoked, false);
  assert.match(result.output, /Environment audit failed/);
});

test('loads only the synthetic governed default connection', (t) => {
  const details = connectionDetails({ root: fixture(t).root });
  assert.equal(details.environmentId, 'local-fixture');
  assert.equal(details.connection.host, 'fixture.invalid');
  assert.equal(details.connection.username, 'fixture');
  assert.equal(details.connection.port, 22);
});

test('builds strict interactive and non-interactive SSH arguments', (t) => {
  const details = connectionDetails({ root: fixture(t).root });
  for (const checkOnly of [true, false]) {
    const args = buildSshArguments(details, 'temporary-key', checkOnly);
    assert.equal(args.includes('BatchMode=yes'), checkOnly);
    assert(args.includes('IdentitiesOnly=yes'));
    assert(args.includes('StrictHostKeyChecking=yes'));
    assert(args.includes(`UserKnownHostsFile=${details.knownHosts}`));
    assert.equal(args[args.indexOf('-i') + 1], 'temporary-key');
    assert.equal(args.at(checkOnly ? -2 : -1), 'fixture@fixture.invalid');
    if (checkOnly) assert.equal(args.at(-1), 'hostname && uname -s');
  }
});

test('accepts only the configured remote identity', (t) => {
  const { environment } = connectionDetails({ root: fixture(t).root });
  assert.deepEqual(verifyRemoteIdentity('fixture-host\nLinux\n', environment.verification), ['fixture-host', 'Linux']);
  for (const actual of ['different-host\nLinux\n', 'fixture-host\nOther\n', 'fixture-host\nLinux\nextra']) {
    assert.throws(() => verifyRemoteIdentity(actual, environment.verification), /Remote identity mismatch/);
  }
});

test('materializes keys in unique restricted directories and removes them after success or failure', (t) => {
  const details = connectionDetails({ root: fixture(t).root });
  const paths = [];
  for (const fail of [false, true]) {
    const invoke = () => withMaterializedPrivateKey(details, (privateKey) => {
      paths.push(privateKey);
      assert.equal(fs.existsSync(privateKey), true);
      assert.match(path.basename(path.dirname(privateKey)), /^key-/);
      if (process.platform !== 'win32') {
        assert.equal(fs.statSync(privateKey).mode & 0o777, 0o600);
        assert.equal(fs.statSync(path.dirname(privateKey)).mode & 0o777, 0o700);
      }
      if (fail) throw new Error('Synthetic action failure');
    });
    if (fail) assert.throws(invoke, /Synthetic action failure/);
    else invoke();
    assert.equal(fs.existsSync(path.dirname(paths.at(-1))), false);
  }
  assert.notEqual(paths[0], paths[1]);
});

test('removes stale key directories but retains a live owner directory', (t) => {
  const parent = temporaryDirectory(t, 'remote-stale-');
  const stale = path.join(parent, 'key-stale');
  const live = path.join(parent, 'key-live');
  for (const [directory, pid] of [[stale, '999999999'], [live, String(process.pid)]]) {
    fs.mkdirSync(directory);
    fs.writeFileSync(path.join(directory, 'owner.pid'), pid);
    fs.writeFileSync(path.join(directory, 'identity'), 'synthetic');
  }
  cleanupStaleKeyDirectories(parent);
  assert.equal(fs.existsSync(stale), false);
  assert.equal(fs.existsSync(live), true);
});

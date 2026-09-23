#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseArgs, parseYamlFile, resolveInside } = require('./lib');

function restrictPrivateKey(file) {
  if (process.platform !== 'win32') {
    fs.chmodSync(file, 0o600);
    return;
  }

  const whoami = spawnSync('whoami', [], { encoding: 'utf8' });
  if (whoami.status !== 0 || !whoami.stdout.trim()) {
    throw new Error('Unable to determine the current Windows identity.');
  }
  const identity = whoami.stdout.trim();
  for (const args of [
    [file, '/grant:r', `${identity}:(F)`],
    [file, '/inheritance:r'],
  ]) {
    const result = spawnSync('icacls', args, { encoding: 'utf8' });
    if (result.status !== 0) {
      throw new Error(`Unable to restrict temporary SSH key ACL: ${result.stderr || result.stdout}`);
    }
  }
}

function restrictDirectory(directory) {
  if (process.platform !== 'win32') {
    fs.chmodSync(directory, 0o700);
    return;
  }

  const whoami = spawnSync('whoami', [], { encoding: 'utf8' });
  if (whoami.status !== 0 || !whoami.stdout.trim()) {
    throw new Error('Unable to determine the current Windows identity.');
  }
  const identity = whoami.stdout.trim();
  for (const args of [
    [directory, '/grant:r', `${identity}:(OI)(CI)(F)`],
    [directory, '/inheritance:r'],
  ]) {
    const result = spawnSync('icacls', args, { encoding: 'utf8' });
    if (result.status !== 0) {
      throw new Error(`Unable to restrict temporary SSH directory ACL: ${result.stderr || result.stdout}`);
    }
  }
}

function privateKeyBase64(authentication) {
  if (authentication.mode === 'embedded_private_key') {
    return authentication.private_key_base64;
  }
  if (authentication.mode === 'environment_variable') {
    const value = process.env[authentication.private_key_environment_variable];
    if (!value) {
      throw new Error(
        `Environment variable ${authentication.private_key_environment_variable} is required.`
      );
    }
    return value;
  }
  throw new Error(`Unsupported SSH authentication mode "${authentication.mode}".`);
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error && error.code === 'EPERM';
  }
}

function cleanupStaleKeyDirectories(parent) {
  if (!fs.existsSync(parent)) return;
  for (const entry of fs.readdirSync(parent, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('key-')) continue;
    const directory = path.join(parent, entry.name);
    const ownerFile = path.join(directory, 'owner.pid');
    let ownerPid = 0;
    try {
      ownerPid = Number(fs.readFileSync(ownerFile, 'utf8').trim());
    } catch {
      const ageMilliseconds = Date.now() - fs.statSync(directory).mtimeMs;
      if (ageMilliseconds < 5 * 60 * 1000) continue;
    }
    if (!processIsAlive(ownerPid)) {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
}

function withMaterializedPrivateKey(details, action) {
  const parent = path.join(details.root, '.migration-tmp', 'ssh');
  fs.mkdirSync(parent, { recursive: true });
  cleanupStaleKeyDirectories(parent);
  const temporaryDirectory = fs.mkdtempSync(path.join(parent, 'key-'));
  const temporaryKey = path.join(temporaryDirectory, 'identity');

  try {
    restrictDirectory(temporaryDirectory);
    fs.writeFileSync(path.join(temporaryDirectory, 'owner.pid'), String(process.pid), {
      flag: 'wx',
      mode: 0o600,
    });
    fs.writeFileSync(
      temporaryKey,
      Buffer.from(privateKeyBase64(details.connection.authentication), 'base64'),
      { flag: 'wx', mode: 0o600 }
    );
    restrictPrivateKey(temporaryKey);
    return action(temporaryKey);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function connectionDetails(options = {}) {
  const root = path.resolve(options.root || path.join(__dirname, '..', '..'));
  const config = parseYamlFile(
    path.resolve(options.file || path.join(root, 'config', 'environments.yaml'))
  );
  if (config.default_environment === null &&
      config.environments && Object.keys(config.environments).length === 0) {
    throw new Error('Deployment environments are unconfigured; NOT remote-ready. SSH connection was refused.');
  }
  const environmentId = options.environment || config.default_environment;
  const environment = config.environments && config.environments[environmentId];
  if (!environment) throw new Error(`Unknown deployment environment "${environmentId}".`);

  const connection = environment.connection;
  const knownHosts = resolveInside(root, connection.known_hosts_file, 'known_hosts_file');
  return { root, environmentId, environment, connection, knownHosts };
}

function buildSshArguments(details, materializedKey, checkOnly) {
  const args = [
    '-p', String(details.connection.port),
    '-o', 'IdentitiesOnly=yes',
    '-o', 'StrictHostKeyChecking=yes',
    '-o', `UserKnownHostsFile=${details.knownHosts}`,
    '-i', materializedKey,
    `${details.connection.username}@${details.connection.host}`,
  ];
  if (checkOnly) {
    args.splice(2, 0, '-o', 'BatchMode=yes');
    args.push('hostname && uname -s');
  }
  return args;
}

function verifyRemoteIdentity(output, verification) {
  const actual = output.trim().split(/\r?\n/);
  const expected = [verification.expected_hostname, verification.expected_kernel];
  if (actual.length !== 2 || actual[0] !== expected[0] || actual[1] !== expected[1]) {
    throw new Error(
      `Remote identity mismatch: expected ${expected.join('/')} but received ${actual.join('/')}.`
    );
  }
  return actual;
}

function run(options = {}) {
  const details = connectionDetails(options);
  const { auditEnvironmentConfig } = require('./environment-config-audit');
  const audit = auditEnvironmentConfig({
    root: details.root,
    file: options.file ? path.resolve(options.file) : undefined,
    requireConfigured: true,
  });
  if (!audit.ok) {
    for (const error of audit.errors) console.error(`FAIL: ${error}`);
    throw new Error('Environment audit failed; SSH connection was refused.');
  }
  return withMaterializedPrivateKey(details, (temporaryKey) => {
    const checkOnly = Boolean(options.check);
    const result = spawnSync(
      'ssh',
      buildSshArguments(details, temporaryKey, checkOnly),
      checkOnly ? { encoding: 'utf8' } : { stdio: 'inherit' }
    );
    if (result.error) throw result.error;
    if (result.status !== 0) {
      if (checkOnly && result.stderr) process.stderr.write(result.stderr);
      return result.status === null ? 1 : result.status;
    }
    if (!checkOnly) return 0;

    const actual = verifyRemoteIdentity(
      result.stdout,
      details.environment.verification
    );
    process.stdout.write(`${actual.join('\n')}\n`);
    return 0;
  });
}

// Exports are published before the CLI block runs. environment-config-audit
// depends on withMaterializedPrivateKey, and when this file is the entry point
// the CLI block would otherwise execute while module.exports is still empty,
// so that module would resolve the binding to undefined.
module.exports = {
  buildSshArguments,
  cleanupStaleKeyDirectories,
  connectionDetails,
  privateKeyBase64,
  run,
  verifyRemoteIdentity,
  withMaterializedPrivateKey,
};

if (require.main === module) {
  try {
    const args = parseArgs(process.argv.slice(2));
    process.exitCode = run({
      root: args.root,
      file: args.file,
      environment: args.environment,
      check: Boolean(args.check),
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

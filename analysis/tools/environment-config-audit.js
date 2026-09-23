#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
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
const { stageNumber } = require('./project-config-audit');
const { requiresSddCompletion } = require('./sdd-completion-policy');

// Resolved lazily: remote-connect requires this module back, and a top-level
// binding would capture undefined whenever remote-connect is the entry point.
function withMaterializedPrivateKey(...args) {
  return require('./remote-connect').withMaterializedPrivateKey(...args);
}

function sshFingerprint(keyBlob) {
  return `SHA256:${crypto.createHash('sha256').update(keyBlob).digest('base64').replace(/=+$/, '')}`;
}

function privateKeyFingerprint(root, environmentId, environment) {
  return withMaterializedPrivateKey(
    { root, environmentId, connection: environment.connection },
    (privateKey) => {
      const derived = spawnSync('ssh-keygen', ['-y', '-f', privateKey], { encoding: 'utf8' });
      if (derived.error) throw derived.error;
      if (derived.status !== 0) {
        throw new Error(derived.stderr || 'ssh-keygen could not read the private key');
      }
      const parts = derived.stdout.trim().split(/\s+/);
      if (parts.length < 2) throw new Error('ssh-keygen returned an invalid public key');
      return sshFingerprint(Buffer.from(parts[1], 'base64'));
    }
  );
}

function knownHostFingerprints(content, host, port) {
  const fingerprints = new Set();
  const expectedHost = port === 22 ? host : `[${host}]:${port}`;
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 3 || !parts[0].split(',').includes(expectedHost)) continue;
    fingerprints.add(sshFingerprint(Buffer.from(parts[2], 'base64')));
  }
  return fingerprints;
}

function configuredEnvironmentRequired(root) {
  const statusFile = path.join(root, 'analysis', 'migration_status.yaml');
  if (fs.existsSync(statusFile)) {
    const status = parseYamlFile(statusFile);
    const currentStage = status?.control?.current_stage;
    if (currentStage !== 'bootstrap' && currentStage !== 'complete' &&
        !/^stage-(0[1-9]|1[0-9])$/.test(currentStage)) {
      throw new Error('Migration status has an invalid current stage.');
    }
    const stage = stageNumber(currentStage);
    if (stage >= 18 || requiresSddCompletion(status) || status.delivery.completed_slices?.length) {
      return true;
    }
  }
  return fs.existsSync(path.join(root, 'analysis', 'stages', 'stage-18', 'current-delivery-record.txt'));
}

function auditEnvironmentConfig(options = {}) {
  const root = path.resolve(options.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const file = path.resolve(
    options.file || process.env.ENVIRONMENT_CONFIG_FILE || path.join(root, 'config', 'environments.yaml')
  );
  const schemaFile = path.resolve(
    options.schemaFile ||
    process.env.ENVIRONMENT_CONFIG_SCHEMA ||
    path.join(root, 'config', 'environments.schema.json')
  );
  const result = new AuditResult('ENVIRONMENT CONFIG AUDIT');

  let config;
  try {
    config = parseYamlFile(file);
    result.merge(validateSchema(readJsonFile(schemaFile), config));
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  if (!result.ok) return result;

  const policy = config.temporary_secret_policy;
  if (policy && policy.expires_at <= policy.approved_at) {
    result.fail(`/temporary_secret_policy/expires_at must be after approved_at`);
  }
  if (policy && new Date(`${policy.expires_at}T23:59:59Z`) < new Date()) {
    result.fail(`/temporary_secret_policy/expires_at has expired`);
  }

  result.configured = config.default_environment !== null;
  if (!result.configured) {
    try {
      if (options.requireConfigured || configuredEnvironmentRequired(root)) {
        result.fail('A configured deployment environment is required; the contract is unconfigured and NOT remote-ready.');
      }
    } catch (error) {
      result.fail(`Cannot determine environment readiness requirements: ${error.message}`);
    }
    result.summary = result.ok
      ? 'Unconfigured environment contract is structurally valid; NOT remote-ready'
      : 'Unconfigured environment contract failed validation; NOT remote-ready';
    return result;
  }

  const embedded = Object.values(config.environments).some(
    (environment) => environment.connection.authentication.mode === 'embedded_private_key'
  );
  const visibility = options.repositoryVisibility ?? process.env.REPOSITORY_VISIBILITY;
  if (embedded && (options.requireVisibility || visibility !== undefined) && visibility !== 'private') {
    result.fail('Embedded private keys require verified private repository visibility; public, unknown or missing visibility is refused.');
  }

  const selected = config.environments[config.default_environment];
  if (!selected) {
    result.fail(`/default_environment must name an entry in /environments`);
    return result;
  }

  for (const [id, environment] of Object.entries(config.environments)) {
    const { connection, verification } = environment;
    const knownHostsPath = connection.known_hosts_file;
    let knownHostsFile;
    try {
      knownHostsFile = resolveInside(root, knownHostsPath, `environments.${id}.known_hosts_file`);
    } catch (error) {
      result.fail(error.message);
      continue;
    }

    try {
      const key = Buffer.from(
        connection.authentication.mode === 'embedded_private_key'
          ? connection.authentication.private_key_base64
          : process.env[connection.authentication.private_key_environment_variable] || '',
        'base64'
      ).toString('utf8').trim();
      if (!key.startsWith('-----BEGIN OPENSSH PRIVATE KEY-----') ||
          !key.endsWith('-----END OPENSSH PRIVATE KEY-----')) {
        result.fail(`/environments/${id}/connection/authentication does not resolve to an OpenSSH private key`);
      } else {
        const actualFingerprint = privateKeyFingerprint(root, id, environment);
        if (actualFingerprint !== connection.authentication.public_key_fingerprint) {
          result.fail(`/environments/${id}/connection/authentication/public_key_fingerprint does not match the private key`);
        }
      }
    } catch (error) {
      result.fail(`/environments/${id}/connection/authentication cannot be verified: ${error.message}`);
    }

    if (connection.authentication.mode === 'embedded_private_key' &&
        !policy?.applies_to.includes(id)) {
      result.fail(`/temporary_secret_policy/applies_to does not authorize embedded key environment "${id}"`);
    }

    if (!fs.existsSync(knownHostsFile) || !fs.statSync(knownHostsFile).isFile()) {
      result.fail(`/environments/${id}/connection/known_hosts_file does not exist`);
    } else {
      const knownHosts = fs.readFileSync(knownHostsFile, 'utf8');
      const actualFingerprints = knownHostFingerprints(
        knownHosts,
        connection.host,
        connection.port
      );
      if (actualFingerprints.size === 0) {
        result.fail(`/environments/${id}/connection/known_hosts_file does not pin ${connection.host}`);
      } else {
        for (const expectedFingerprint of connection.host_key_fingerprints) {
          if (!actualFingerprints.has(expectedFingerprint)) {
            result.fail(`/environments/${id}/connection/host_key_fingerprints contains an unpinned fingerprint`);
          }
        }
        for (const actualFingerprint of actualFingerprints) {
          if (!connection.host_key_fingerprints.includes(actualFingerprint)) {
            result.fail(`/environments/${id}/connection/known_hosts_file contains an undeclared host fingerprint`);
          }
        }
      }
    }

    if (verification.connection_command !== 'npm --prefix analysis/tools run remote:check') {
      result.fail(
        `/environments/${id}/verification/connection_command must use the governed remote:check helper`
      );
    }
  }

  result.summary = result.ok
    ? `Validated ${Object.keys(config.environments).length} deployment environment(s); default is ${config.default_environment}`
    : 'Deployment environment contract is invalid';
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root', 'file', 'schema'], [
    'AUDIT_ROOT',
    'ENVIRONMENT_CONFIG_FILE',
    'ENVIRONMENT_CONFIG_SCHEMA',
  ]);
  process.exitCode = printResult(auditEnvironmentConfig({
    root: args.root,
    file: args.file,
    schemaFile: args.schema,
    requireConfigured: Boolean(args['require-configured']),
    requireVisibility: Boolean(args['require-visibility']),
  }));
}

module.exports = { auditEnvironmentConfig };

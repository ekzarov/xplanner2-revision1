'use strict';

const path = require('node:path');
const { parseYamlFile } = require('./lib');

const DESIGN_STATUSES = new Set([
  'not_started',
  'planning',
  'approved',
  'in_progress',
  'blocked',
]);
const COMPLETION_STATUSES = new Set(['deployed', 'accepted']);

function requiresSddCompletion(status) {
  const sliceStatus = status && status.delivery && status.delivery.slice_status;
  if (typeof sliceStatus !== 'string' || !sliceStatus.trim()) {
    throw new Error('delivery.slice_status must be a non-empty string');
  }
  if (COMPLETION_STATUSES.has(sliceStatus)) return true;
  if (DESIGN_STATUSES.has(sliceStatus)) return false;
  throw new Error(`delivery.slice_status has unsupported value "${sliceStatus}"`);
}

function completionPolicyFromFile(statusFile) {
  return requiresSddCompletion(parseYamlFile(statusFile));
}

if (require.main === module) {
  const statusFile = path.resolve(
    process.argv[2] || path.join(__dirname, '..', 'migration_status.yaml'),
  );
  try {
    process.stdout.write(completionPolicyFromFile(statusFile) ? 'required\n' : 'deferred\n');
  } catch (error) {
    console.error(`SDD completion policy failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  completionPolicyFromFile,
  requiresSddCompletion,
};

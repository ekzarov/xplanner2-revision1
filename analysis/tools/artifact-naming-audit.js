'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { AuditResult, walkFiles } = require('./lib');

function auditArtifactNaming({ root = path.resolve(__dirname, '../..') } = {}) {
  const result = new AuditResult('ARTIFACT NAMING AUDIT');
  const registry = path.join(root, 'analysis/artifact-naming.json');
  if (!fs.existsSync(registry)) {
    result.fail('Missing analysis/artifact-naming.json');
    return result;
  }
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(registry, 'utf8'));
    if (!Array.isArray(entries)) throw new Error('Expected an array');
  } catch (error) {
    result.fail(`Invalid artifact naming map: ${error.message}`);
    return result;
  }
  const seen = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry.template !== 'string' || typeof entry.output !== 'string') {
      result.fail('Every naming entry requires template and output paths');
      continue;
    }
    if (seen.has(entry.template)) result.fail(`Duplicate template: ${entry.template}`);
    seen.add(entry.template);
    const derived = path.posix.basename(entry.template).replace(/(?:[-._]template|\.example)(?=\.[^.]+$)/, '');
    if (derived !== path.posix.basename(entry.output)) {
      result.fail(`${entry.template}: output must preserve filename ${derived}, found ${entry.output}`);
    }
    const template = path.resolve(root, entry.template);
    if (!template.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(template)) {
      result.fail(`Missing or out-of-repository template: ${entry.template}`);
      continue;
    }
    if (/\.(md|yaml)$/.test(template)) {
      const text = fs.readFileSync(template, 'utf8');
      if (!text.includes('Template output:') || !text.includes(entry.output)) {
        result.fail(`${entry.template}: missing explicit template output ${entry.output}`);
      }
    }
  }
  for (const directory of ['analysis', 'config', 'specs', '.specify/templates']) {
    const absolute = path.join(root, directory);
    if (!fs.existsSync(absolute)) continue;
    for (const file of walkFiles(absolute)) {
      const relative = path.relative(root, file).replaceAll('\\', '/');
      if (relative.includes('/node_modules/')) continue;
      if (/(?:[-._]template|\.example)\.(?:md|yaml|xlsx|json)$/.test(relative) && !seen.has(relative)) {
        result.fail(`Template has no output mapping: ${relative}`);
      }
    }
  }
  return result;
}

module.exports = { auditArtifactNaming };

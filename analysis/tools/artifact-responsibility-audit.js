'use strict';

const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const { AuditResult } = require('./lib');

function validateResponsibilityEntries(artifacts) {
  const errors = [];
  if (!Array.isArray(artifacts) || !artifacts.length) return ['Artifact responsibilities must contain artifact families'];
  const ids = new Set();
  for (const artifact of artifacts) {
    if (!artifact.id || ids.has(artifact.id)) errors.push('Missing or duplicate artifact id: ' + artifact.id);
    ids.add(artifact.id);
    if (!artifact.label) errors.push(artifact.id + ' has no label');
    for (const locale of ['en', 'ru']) {
      for (const field of ['creator', 'maintainer', 'instructions']) {
        const value = artifact.responsibility?.[locale]?.[field];
        if (typeof value !== 'string' || !value.trim()) errors.push(artifact.id + ' is missing ' + locale + '.' + field);
      }
    }
  }
  return errors;
}

function auditArtifactResponsibilities(input = {}) {
  const root = path.resolve(input.root || path.join(__dirname, '..', '..'));
  const result = new AuditResult('ARTIFACT RESPONSIBILITY AUDIT');
  const registry = path.join(root, 'analysis/artifact-responsibilities.json');
  if (!fs.existsSync(registry)) {
    result.fail('Artifact responsibility registry is missing');
    return result;
  }
  let records;
  try { records = JSON.parse(fs.readFileSync(registry, 'utf8')); }
  catch (error) { result.fail(error.message); return result; }
  if (records.schema_version !== 1) result.fail('Unsupported responsibility registry version');
  for (const error of validateResponsibilityEntries(records.artifacts)) result.fail(error);
  if (!result.ok) return result;
  if (!Array.isArray(records.templates) || !records.templates.length) result.fail('Template responsibility coverage is missing');
  for (const template of records.templates || []) {
    const file = path.join(root, template.path);
    if (!fs.existsSync(file)) { result.fail('Missing responsibility template: ' + template.path); continue; }
    const text = fs.readFileSync(file, 'utf8');
    for (const field of ['creator', 'maintainer', 'instructions']) {
      if (!template.responsibility?.[field] || !text.includes(template.responsibility[field])) result.fail(template.path + ' omits ' + field);
    }
  }
  for (const relative of ['ARTIFACTS.md', 'analysis/artifact-responsibilities.md']) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) { result.fail(relative + ' is missing'); continue; }
    const body = fs.readFileSync(file, 'utf8');
    for (const artifact of records.artifacts) {
      const { creator, maintainer, instructions } = artifact.responsibility.en;
      const row = body.split(/\r?\n/).find(line => line.startsWith('| ') && line.includes(artifact.label) && line.includes(creator));
      if (!row || !row.includes(maintainer) || !row.includes(instructions)) result.fail(relative + ' omits responsibility for ' + artifact.id);
    }
  }
  const html = cheerio.load(fs.readFileSync(path.join(root, 'analysis/migration_methodology.html'), 'utf8'));
  const rows = html('#artifact-responsibilities tbody tr').toArray();
  if (rows.length !== records.artifacts.length) result.fail('HTML responsibility reference does not cover every artifact');
  const xml = cheerio.load(fs.readFileSync(path.join(root, 'analysis/migration_artifact_flow.drawio'), 'utf8'), {xmlMode: true});
  for (const artifact of records.artifacts) {
    const value = xml('diagram[id="artifact-responsibilities"] mxCell').filter((_, cell) => xml(cell).attr('id') === 'responsibility-' + artifact.id).attr('value');
    if (!value || !value.includes(artifact.responsibility.en.creator)) result.fail('2D responsibility reference omits ' + artifact.id);
  }
  const canvas = path.join(root, 'analysis/process-canvas/data.json');
  if (fs.existsSync(canvas)) {
    const data = JSON.parse(fs.readFileSync(canvas, 'utf8'));
    if (data.artifacts.length !== records.artifacts.length) result.fail('3D and responsibility registry artifact counts differ');
    for (const artifact of data.artifacts) {
      const entry = records.artifacts.find(candidate => candidate.id === artifact.id);
      if (!entry || JSON.stringify(entry.responsibility) !== JSON.stringify(artifact.responsibility)) result.fail('3D responsibility differs for ' + artifact.id);
    }
  }
  result.summary = records.artifacts.length + ' artifact families have EN/RU creators, maintainers and instructions in the registry and synchronized descriptions';
  return result;
}

if (require.main === module) {
  const result = auditArtifactResponsibilities();
  for (const error of result.errors) console.error('FAIL: ' + error);
  console.log(result.summary);
  process.exitCode = result.ok ? 0 : 1;
}
module.exports = { auditArtifactResponsibilities, validateResponsibilityEntries };

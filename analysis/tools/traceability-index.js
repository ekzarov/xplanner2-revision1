'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { section, tableRows } = require('./parity-map-contract');

const HEADING = 'Slice Verification Index';
const COLUMNS = ['feature', 'sdd', 'verification plan', 'recorded evidence', 'evidence state'];
const STATES = new Set(['planned', 'missing', 'recorded']);

function indexErrors(body, specsRoot, features, requireCompletion = false) {
  const errors = [];
  const content = section(body, HEADING);
  if (!content) return [`specs/traceability.md must contain ## ${HEADING}`];
  const rows = tableRows(content);
  if (!rows.length || rows[0].length !== COLUMNS.length ||
      COLUMNS.some((value, i) => rows[0][i].toLowerCase() !== value)) {
    return [`${HEADING} header must be: ${COLUMNS.join(' | ')}`];
  }
  const seen = new Set();
  const projectRoot = path.resolve(specsRoot, '..');
  function links(cell, feature, label) {
    const matches = [...cell.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)];
    if (!matches.length) errors.push(`${feature} ${label} requires a Markdown file link`);
    return matches.map(match => {
      const target = match[1].split('#')[0];
      const resolved = path.resolve(specsRoot, target);
      const relative = path.relative(projectRoot, resolved);
      if (!target || /^[a-z]+:/i.test(target) || path.isAbsolute(target) ||
          relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
        errors.push(`${feature} ${label} must link inside the project: ${target}`);
      } else if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
        errors.push(`${feature} ${label} file does not exist: ${target}`);
      }
      return resolved;
    });
  }
  for (const row of rows.slice(1)) {
    if (row.length !== COLUMNS.length) {
      errors.push(`${HEADING} row must contain ${COLUMNS.length} columns`);
      continue;
    }
    const [feature, sdd, plan, evidence, state] = row;
    if (!features.includes(feature)) errors.push(`${HEADING} has unknown feature ${feature}`);
    if (seen.has(feature)) errors.push(`${HEADING} duplicates ${feature}`);
    seen.add(feature);
    if (!STATES.has(state)) errors.push(`${feature} evidence state must be planned, missing or recorded (not a verdict)`);
    const designFiles = links(sdd, feature, 'SDD');
    for (const file of ['spec.md', 'plan.md', 'tasks.md']) {
      if (!designFiles.includes(path.resolve(specsRoot, feature, file))) {
        errors.push(`${feature} SDD must link its own ${file}`);
      }
    }
    const plans = links(plan, feature, 'verification plan');
    if (state === 'recorded') {
      for (const file of links(evidence, feature, 'recorded evidence')) {
        if (designFiles.includes(file) || plans.includes(file) || /^(?:test-plan|.*template)\.md$/i.test(path.basename(file))) {
          errors.push(`${feature} recorded evidence cannot be a design, plan or template`);
        }
      }
    } else if (evidence !== '-') {
      errors.push(`${feature} ${state} evidence must use -; link actual observations as recorded`);
    }
    const completesFeature = requireCompletion instanceof Set ? requireCompletion.has(feature) : requireCompletion;
    if (completesFeature && state !== 'recorded') {
      errors.push(`${feature} completion requires recorded execution evidence; ${state} is not completion`);
    }
  }
  for (const feature of features) {
    if (!seen.has(feature)) errors.push(`${HEADING} has no row for ${feature}`);
  }
  return errors;
}

module.exports = { indexErrors };

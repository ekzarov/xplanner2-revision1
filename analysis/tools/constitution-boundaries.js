'use strict';

const {tables} = require('./process-contract');

function boundaryErrors(text) {
  const errors = [];
  const constitution = text.constitution.replace(/\s+/g, ' ');
  const core = text.constitution.split('## Core Principles')[1]?.split('## Required Repository Contracts')[0] || '';
  const coreProse = core.replace(/<[^>]+>/g, '');
  const requireText = (value, phrase, message) => {
    if (!value.includes(phrase)) errors.push(message);
  };
  for (const key of ['constitution', 'entry', 'methodology']) {
    requireText(text[key], 'process-contract.md#document-ownership', key + ': missing document ownership link');
  }
  requireText(constitution, 'save independent observations before receiving prior conclusions', 'Constitution must preserve blind observation before prior conclusions');
  requireText(constitution, 'full records are released to the reviewer only after initial observations are saved', 'Constitution must preserve the delayed evidence boundary');
  requireText(constitution, 'coordinator validates full status first', 'Constitution must retain full coordinator status access');
  requireText(constitution, 'MIGRATION.md#mandatory-reading-order', 'Reading order must have one governing location');
  requireText(constitution, 'migration_methodology.md#bootstrap-execution', 'Bootstrap mechanics must link to their procedure');
  requireText(constitution, 'MUST NOT be silently rewritten or re-hashed by downstream agents', 'Constitution must prohibit downstream baseline mutation');
  requireText(constitution, 'independent review and owner re-approval', 'Architecture correction must retain independent control and owner re-approval');
  requireText(constitution, 'migration_methodology.md#living-architecture-loop', 'Constitution must link to the governed architecture return loop');
  requireText(constitution, 'migration_methodology.md#engineering-quality-profile', 'Constitution must link to executable quality details');
  requireText(constitution, 'process-contract.md#constitution-implementation-map', 'Constitution must separate principles from their process bindings');
  if (!core || /\bStages?\s+\d|\bPhase\s+[AB]\b|\b(?:OKF|SDD|GitHub|Draw\.io)\b|\b(?:spec|plan|tasks)\.md\b/.test(coreProse)) errors.push('Core principles must not depend on stage numbers, named packet phases, artifact filenames or vendors');
  requireText(text.contract, '## Constitution Implementation Map', 'Process must own the concrete implementation map');
  requireText(text.contract, 'Stages 2 and 19 save Phase A before Phase B', 'Process binding must preserve numbered blind-review rules');
  if (/Every agent MUST read, in order|`(?:Overview|Technology Stack|Team Capability)`|[\u0400-\u04ff]/u.test(text.constitution)) errors.push('Constitution must not duplicate reading lists or workbook schema');
  const principles = [...text.constitution.matchAll(/^### ([IVX]+)\./gm)].map(m => m[1]);
  if (principles.join(',') !== 'I,II,III,IV,V,VI,VII,VIII,IX,X,XI,XII,XIII,XIV') errors.push('Constitution must preserve all fourteen principle identities');
  if (/owner (?:must replace|completes all items)/i.test(text.constitution)) errors.push('Owner decides; agent records ratification');
  requireText(text.methodology, 'id="engineering-quality-profile"', 'Missing quality-profile destination anchor');
  requireText(text.methodology.replace(/\s+/g, ' '), 'owner and agent MUST collaborate in the live editable Draw.io workspace', 'Relocation must preserve mandatory live diagram collaboration');
  for (const phrase of ['cookie/header names', 'any raw production', 'single-use string']) {
    requireText(text.methodology.replace(/\s+/g, ' '), phrase, 'Relocated string-ownership detail missing: ' + phrase);
  }
  try {
    const rows = tables(text.contract).get('Document Ownership');
    if (!rows || rows.length !== 8 || rows[0].join('|') !== 'Document|Question it answers|Owns|Does not own') errors.push('Document ownership must distinguish seven instruction/state roles');
  } catch (error) { errors.push(error.message); }
  return errors;
}

module.exports = {boundaryErrors};

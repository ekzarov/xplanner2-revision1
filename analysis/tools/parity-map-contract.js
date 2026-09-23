'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const ExcelJS = require('@excel.js/exceljs').default;

const CONTRACT_HEADING = 'Parity Map Delivery Contracts';
const VALID_SCOPES = new Set(['legacy-backed', 'target-only']);

function section(body, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`^##\\s+${escaped}\\s*$`, 'mi').exec(body);
  if (!match) return '';
  const tail = body.slice(match.index + match[0].length);
  const next = /^##\s+/m.exec(tail);
  return next ? tail.slice(0, next.index) : tail;
}

function tableRows(markdown) {
  return markdown.split(/\r?\n/)
    .filter((line) => /^\s*\|.*\|\s*$/.test(line))
    .map((line) => line.trim().slice(1, -1).split('|').map((cell) => cell.trim().replace(/^`|`$/g, '')))
    .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

function parseRows(value) {
  const normalized = String(value || '').trim();
  if (!normalized || /^(?:-|none|n\/a|not applicable)$/i.test(normalized)) return [];
  const rows = new Set();
  for (const token of normalized.split(',').map((part) => part.trim()).filter(Boolean)) {
    const range = token.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!range) throw new Error(`invalid workbook row expression "${token}"`);
    const first = Number(range[1]);
    const last = Number(range[2] || range[1]);
    if (first < 1 || last < first || last - first > 2000) throw new Error(`invalid workbook row range "${token}"`);
    for (let row = first; row <= last; row += 1) rows.add(row);
  }
  return [...rows].sort((a, b) => a - b);
}

function parseParityContracts(traceability) {
  const content = section(traceability, CONTRACT_HEADING);
  if (!content) return { contracts: new Map(), errors: [`specs/traceability.md must contain ## ${CONTRACT_HEADING}`] };
  const rows = tableRows(content);
  if (rows.length < 2) return { contracts: new Map(), errors: [`${CONTRACT_HEADING} must contain a header and at least one contract`] };
  const header = rows[0].map((cell) => cell.toLowerCase());
  const expected = ['feature', 'scope', 'deliver rows', 'deferred rows', 'owner decision'];
  if (expected.some((name, index) => header[index] !== name)) {
    return { contracts: new Map(), errors: [`${CONTRACT_HEADING} header must be: ${expected.join(' | ')}`] };
  }
  const contracts = new Map();
  const errors = [];
  for (const cells of rows.slice(1)) {
    if (cells.length < expected.length || cells.every((cell) => /^[-:]+$/.test(cell))) continue;
    const feature = cells[0];
    const scope = cells[1].toLowerCase();
    if (!/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(feature)) {
      errors.push(`invalid parity contract feature "${feature}"`);
      continue;
    }
    if (contracts.has(feature)) errors.push(`duplicate parity contract for ${feature}`);
    if (!VALID_SCOPES.has(scope)) errors.push(`${feature} has invalid parity scope "${scope}"`);
    let deliverRows = [];
    let deferredRows = [];
    try { deliverRows = parseRows(cells[2]); } catch (error) { errors.push(`${feature}: ${error.message}`); }
    try { deferredRows = parseRows(cells[3]); } catch (error) { errors.push(`${feature}: ${error.message}`); }
    const overlap = deliverRows.filter((row) => deferredRows.includes(row));
    if (overlap.length) errors.push(`${feature} declares workbook row(s) ${overlap.join(', ')} as both delivered and deferred`);
    const ownerDecision = cells[4];
    if (scope === 'target-only') {
      if (deliverRows.length || deferredRows.length) errors.push(`${feature} is target-only and cannot claim legacy workbook rows`);
      if (!ownerDecision || /^(?:-|none|n\/a)$/i.test(ownerDecision)) errors.push(`${feature} target-only scope requires an owner decision`);
    } else if (!deliverRows.length && !deferredRows.length) {
      errors.push(`${feature} legacy-backed scope must declare at least one delivered or deferred workbook row`);
    }
    contracts.set(feature, { feature, scope, deliverRows, deferredRows, ownerDecision });
  }
  return { contracts, errors };
}

function cellText(cell) {
  const value = cell?.value;
  if (value == null) return '';
  if (typeof value === 'object' && value.text) return String(value.text).trim();
  return String(value).trim();
}

async function loadWorkbookState(workbookFile) {
  const bytes = fs.readFileSync(workbookFile);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes);
  const sheet = workbook.getWorksheet('User Flows');
  if (!sheet) throw new Error('legacy_user_flows.xlsx must contain the User Flows sheet');
  const states = new Map();
  for (let rowNumber = 7; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    if (!cellText(row.getCell(4))) continue;
    states.set(rowNumber, {
      destinationImplemented: cellText(row.getCell(9)),
      destinationNotes: cellText(row.getCell(10)),
      destinationEvidence: cellText(row.getCell(11)),
      coveredInSdd: cellText(row.getCell(12)),
      deferredInSdd: cellText(row.getCell(13)),
      sddEvidence: cellText(row.getCell(14)),
    });
  }
  return { sha256: crypto.createHash('sha256').update(bytes).digest('hex'), states };
}

function deliveredRowErrors(contract, workbookState) {
  const errors = [];
  for (const rowNumber of contract.deliverRows) {
    const state = workbookState.states.get(rowNumber);
    if (!state) {
      errors.push(`${contract.feature} references workbook row ${rowNumber}, which is not a scenario row`);
      continue;
    }
    if (state.destinationImplemented.toLowerCase() !== 'yes' ||
        state.coveredInSdd.toLowerCase() !== 'yes' ||
        state.deferredInSdd.toLowerCase() === 'yes' ||
        !state.destinationNotes || !state.destinationEvidence || !state.sddEvidence) {
      errors.push(`${contract.feature} workbook row ${rowNumber} is not closed with destination, SDD, and evidence fields`);
    }
  }
  for (const rowNumber of contract.deferredRows) {
    const state = workbookState.states.get(rowNumber);
    if (!state) errors.push(`${contract.feature} references workbook row ${rowNumber}, which is not a scenario row`);
    else if (state.deferredInSdd.toLowerCase() !== 'yes' || !state.sddEvidence) {
      errors.push(`${contract.feature} workbook row ${rowNumber} is declared deferred but the workbook has no deferred status and evidence`);
    }
  }
  return errors;
}

module.exports = {
  CONTRACT_HEADING,
  deliveredRowErrors,
  loadWorkbookState,
  parseParityContracts,
  parseRows,
  section,
  tableRows,
};

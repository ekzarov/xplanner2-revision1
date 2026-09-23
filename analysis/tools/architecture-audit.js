#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { statusAt, validateReviewRecords, isAdopted, validateRegistry } = require('./architecture-review-records');
const { architecturePath } = require('./architecture-paths');
const {
  AuditResult,
  PLACEHOLDER,
  SHA256_PATTERN,
  parseArgs,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  resolveInside,
  sha256File,
  validateSchema,
  walkFiles,
} = require('./lib');
const {
  auditedScope,
  loadAndValidateStatus,
  scopeAwareWaiver,
} = require('./status-validator');
const { findUnsupportedChartPartLocations, readEntries } = require('./xlsx-package');

const ARCHITECTURE_WAIVER_GATE = 'architecture_retroactive';
const CLOSED_FILL_COLORS = new Map([
  ['Yes', 'C6E0B4'],
  ['No', 'F4CCCC'],
]);

const nonEmpty = { type: 'string', minLength: 1, pattern: '\\S' };
const hash = { type: 'string', pattern: SHA256_PATTERN };
const REQUIRED_DIAGRAM_COVERAGE = [
  'executive-summary', 'current-architecture', 'target-architecture',
  'components-boundaries', 'integrations-data-flow', 'data-migration',
  'security-roles', 'deployment-topology', 'measurable-nfrs',
  'adr-trade-offs', 'risks-delivery',
];
const ALLOWED_DIAGRAM_COVERAGE = [
  ...REQUIRED_DIAGRAM_COVERAGE,
  'ui-runtime', 'localization-quality', 'web-delivery',
  'identity-access', 'data-persistence', 'schema-lifecycle',
];

const ARCHITECTURE_MANIFEST_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['schema_version', 'project', 'scope', 'document_set_version', 'published_at', 'files', 'diagram_pages', 'nfrs', 'adrs'],
  properties: {
    schema_version: { const: 1 },
    project: nonEmpty,
    scope: nonEmpty,
    document_set_version: nonEmpty,
    published_at: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    files: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['path', 'role', 'document_set_version', 'sha256'],
        properties: {
          path: nonEmpty,
          role: nonEmpty,
          document_set_version: nonEmpty,
          sha256: hash,
        },
        additionalProperties: false,
      },
    },
    diagram_pages: {
      type: 'array', minItems: 2,
      items: {
        type: 'object', required: ['id', 'name', 'covers'],
        properties: {
          id: nonEmpty,
          name: nonEmpty,
          covers: {
            type: 'array', minItems: 1, uniqueItems: true,
            items: { enum: ALLOWED_DIAGRAM_COVERAGE },
          },
        },
        additionalProperties: false,
      },
    },
    nfrs: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'category', 'statement', 'acceptance', 'adrs', 'evidence'],
        properties: {
          id: nonEmpty,
          category: nonEmpty,
          statement: nonEmpty,
          acceptance: nonEmpty,
          adrs: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
          evidence: { type: 'array', uniqueItems: true, items: nonEmpty },
        },
        additionalProperties: false,
      },
    },
    adrs: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'title', 'file', 'nfrs'],
        properties: {
          id: nonEmpty,
          title: nonEmpty,
          file: nonEmpty,
          nfrs: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};

function canonicalRelative(value) {
  return architecturePath(value);
}

function validGraphModel(value) {
  const body = value.trim();
  return /^<mxGraphModel\b[\s\S]*<\/mxGraphModel>$/i.test(body) &&
    /<root\b/i.test(body) && /<mxCell\b/i.test(body);
}

function validDrawioPageBody(value) {
  const body = value.trim();
  if (validGraphModel(body)) return true;
  if (/[<>\s]/.test(body) || !/^[A-Za-z0-9+/=]+$/.test(body)) return false;
  try {
    const inflated = zlib.inflateRawSync(Buffer.from(body, 'base64')).toString('utf8');
    return validGraphModel(decodeURIComponent(inflated));
  } catch {
    return false;
  }
}

function checkDocument(file, label, result) {
  if (!fs.existsSync(file)) {
    result.fail(`${label} is missing`);
    return null;
  }
  const body = fs.readFileSync(file, 'utf8');
  const placeholder = body.match(PLACEHOLDER);
  if (placeholder) result.fail(`${label} contains template placeholder "${placeholder[0]}"`);
  if (!body.trim()) result.fail(`${label} is empty`);
  return body;
}

function validateClosureReference(root, reference, label, result) {
  const hashIndex = reference.indexOf('#');
  if (hashIndex <= 0 || hashIndex === reference.length - 1) {
    result.fail(`${label} must use a repository-relative file#anchor reference: ${reference}`);
    return;
  }
  const relative = reference.slice(0, hashIndex);
  const anchor = decodeURIComponent(reference.slice(hashIndex + 1));
  let absolute;
  try {
    absolute = resolveInside(root, relative, label);
  } catch (error) {
    result.fail(error.message);
    return;
  }
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() ||
      fs.lstatSync(absolute).isSymbolicLink()) {
    result.fail(`${label} references a missing or unsafe file: ${relative}`);
    return;
  }
  const body = fs.readFileSync(absolute, 'utf8');
  const matching = body.split(/\r?\n/).find((line) => line.includes(anchor));
  if (!matching || matching.trim().length < 12 || PLACEHOLDER.test(matching)) {
    result.fail(`${label} does not resolve to meaningful closure evidence in ${relative}#${anchor}`);
  }
}

function verdictValue(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(new RegExp(`^\\s*[-*]?\\s*${escaped}:\\s*\\x60?([^\\x60\\r\\n]+)\\x60?\\s*$`, 'im'));
  return match ? match[1].trim() : null;
}

function rejectDeliveryReferences(file, relative, result) {
  if (!/\.(?:md|json|drawio)$/i.test(relative)) return;
  const body = fs.readFileSync(file, 'utf8');
  const forbidden = [
    { pattern: /(?:^|[^A-Za-z0-9])SDD(?:[^A-Za-z0-9]|$)/i, label: 'SDD' },
    { pattern: /(?:^|[\s`'(])specs\//i, label: 'specs/' },
    { pattern: /(?:^|[^A-Za-z0-9])Stages?\s*15(?:[^A-Za-z0-9]|$)/i, label: 'Stage 15' },
  ];
  for (const entry of forbidden) {
    if (entry.pattern.test(body)) {
      result.fail(`${relative} contains delivery-level reference "${entry.label}"; architecture must not depend on downstream delivery specifications or delivery records`);
    }
  }
}

function xmlDecode(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function workbookSheetNames(file) {
  const workbookPart = readEntries(fs.readFileSync(file))
    .find((entry) => entry.name === 'xl/workbook.xml');
  if (!workbookPart) throw new Error('xl/workbook.xml is missing');
  return [...workbookPart.content.toString('utf8').matchAll(/<(?:[A-Za-z0-9_]+:)?sheet\b[^>]*\bname="([^"]+)"/g)]
    .map((match) => xmlDecode(match[1]));
}

function workbookSearchableText(file) {
  return readEntries(fs.readFileSync(file))
    .filter((entry) => entry.name.startsWith('xl/') && entry.name.endsWith('.xml'))
    .map((entry) => xmlDecode(entry.content.toString('utf8')).replace(/<[^>]+>/g, ' '))
    .join('\n');
}

function attributeValue(attributes, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return attributes.match(new RegExp(`(?:^|\\s)${escaped}="([^"]*)"`))?.[1] || null;
}

function columnIndex(reference) {
  const letters = reference.match(/^[A-Z]+/i)?.[0]?.toUpperCase() || '';
  let value = 0;
  for (const letter of letters) value = value * 26 + letter.charCodeAt(0) - 64;
  return value - 1;
}

function workbookTables(file) {
  const entries = readEntries(fs.readFileSync(file));
  const byName = new Map(entries.map((entry) => [entry.name, entry.content.toString('utf8')]));
  const workbookXml = byName.get('xl/workbook.xml');
  const relationshipsXml = byName.get('xl/_rels/workbook.xml.rels');
  if (!workbookXml || !relationshipsXml) throw new Error('workbook relationships are missing');

  const relationships = new Map();
  for (const match of relationshipsXml.matchAll(/<(?:[A-Za-z0-9_]+:)?Relationship\b([^>]*)\/?\s*>/g)) {
    const id = attributeValue(match[1], 'Id');
    const target = attributeValue(match[1], 'Target');
    if (id && target) relationships.set(id, target);
  }

  const sharedStrings = [];
  const sharedXml = byName.get('xl/sharedStrings.xml') || '';
  for (const match of sharedXml.matchAll(/<(?:[A-Za-z0-9_]+:)?si\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?si>/g)) {
    sharedStrings.push([...match[1].matchAll(/<(?:[A-Za-z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?t>/g)]
      .map((part) => xmlDecode(part[1])).join(''));
  }

  const tables = new Map();
  for (const sheet of workbookXml.matchAll(/<(?:[A-Za-z0-9_]+:)?sheet\b([^>]*)\/?\s*>/g)) {
    const name = xmlDecode(attributeValue(sheet[1], 'name') || '');
    const relationId = attributeValue(sheet[1], 'r:id');
    const target = relationships.get(relationId);
    if (!name || !target) continue;
    const normalized = target.startsWith('/')
      ? target.slice(1)
      : path.posix.normalize(path.posix.join('xl', target));
    const worksheetXml = byName.get(normalized);
    if (!worksheetXml) continue;
    const rows = [];
    for (const rowMatch of worksheetXml.matchAll(/<(?:[A-Za-z0-9_]+:)?row\b([^>]*)>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?row>/g)) {
      const rowNumber = Number.parseInt(attributeValue(rowMatch[1], 'r'), 10);
      const row = [];
      for (const cell of rowMatch[2].matchAll(/<(?:[A-Za-z0-9_]+:)?c\b([^>]*?)(?:\s*\/\s*>|>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?c>)/g)) {
        const reference = attributeValue(cell[1], 'r') || '';
        const type = attributeValue(cell[1], 't');
        const body = cell[2] || '';
        const value = body.match(/<(?:[A-Za-z0-9_]+:)?v\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?v>/)?.[1] || '';
        const inline = [...body.matchAll(/<(?:[A-Za-z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?t>/g)]
          .map((part) => xmlDecode(part[1])).join('');
        const decoded = type === 's' ? (sharedStrings[Number.parseInt(value, 10)] || '')
          : (type === 'inlineStr' ? inline : xmlDecode(value));
        row[columnIndex(reference)] = decoded.trim();
      }
      if (Number.isInteger(rowNumber)) rows[rowNumber - 1] = row;
    }
    tables.set(name, rows);
  }
  return tables;
}

function columnReference(index) {
  let value = index + 1;
  let reference = '';
  while (value > 0) {
    value -= 1;
    reference = String.fromCharCode(65 + (value % 26)) + reference;
    value = Math.floor(value / 26);
  }
  return reference;
}

function workbookCellFillColors(file, sheetName) {
  const entries = readEntries(fs.readFileSync(file));
  const byName = new Map(entries.map((entry) => [entry.name, entry.content.toString('utf8')]));
  const workbookXml = byName.get('xl/workbook.xml');
  const relationshipsXml = byName.get('xl/_rels/workbook.xml.rels');
  const stylesXml = byName.get('xl/styles.xml');
  if (!workbookXml || !relationshipsXml || !stylesXml) {
    throw new Error('workbook styles or relationships are missing');
  }

  const relationships = new Map();
  for (const match of relationshipsXml.matchAll(/<(?:[A-Za-z0-9_]+:)?Relationship\b([^>]*)\/?\s*>/g)) {
    const id = attributeValue(match[1], 'Id');
    const target = attributeValue(match[1], 'Target');
    if (id && target) relationships.set(id, target);
  }
  const sheet = [...workbookXml.matchAll(/<(?:[A-Za-z0-9_]+:)?sheet\b([^>]*)\/?\s*>/g)]
    .find((match) => xmlDecode(attributeValue(match[1], 'name') || '') === sheetName);
  if (!sheet) throw new Error(`worksheet "${sheetName}" is missing`);
  const target = relationships.get(attributeValue(sheet[1], 'r:id'));
  if (!target) throw new Error(`worksheet "${sheetName}" relationship is missing`);
  const normalized = target.startsWith('/')
    ? target.slice(1)
    : path.posix.normalize(path.posix.join('xl', target));
  const worksheetXml = byName.get(normalized);
  if (!worksheetXml) throw new Error(`worksheet "${sheetName}" XML is missing`);

  const fillsBody = stylesXml.match(/<(?:[A-Za-z0-9_]+:)?fills\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?fills>/)?.[1] || '';
  const fills = [...fillsBody.matchAll(/<(?:[A-Za-z0-9_]+:)?fill\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?fill>/g)]
    .map((match) => match[1].match(/<(?:[A-Za-z0-9_]+:)?fgColor\b[^>]*\brgb="(?:FF)?([A-Fa-f0-9]{6})"/)?.[1]?.toUpperCase() || null);
  const xfsBody = stylesXml.match(/<(?:[A-Za-z0-9_]+:)?cellXfs\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?cellXfs>/)?.[1] || '';
  const styleFillIds = [...xfsBody.matchAll(/<(?:[A-Za-z0-9_]+:)?xf\b([^>]*?)(?:\/\s*>|>)/g)]
    .map((match) => Number.parseInt(attributeValue(match[1], 'fillId') || '0', 10));

  const colors = new Map();
  for (const cell of worksheetXml.matchAll(/<(?:[A-Za-z0-9_]+:)?c\b([^>]*?)(?:\s*\/\s*>|>[\s\S]*?<\/(?:[A-Za-z0-9_]+:)?c>)/g)) {
    const reference = attributeValue(cell[1], 'r');
    const styleIndex = Number.parseInt(attributeValue(cell[1], 's') || '0', 10);
    if (reference) colors.set(reference, fills[styleFillIds[styleIndex]] || null);
  }
  return colors;
}

function validateSemanticWorkbookColors(file, result) {
  const rows = workbookTables(file).get('NFR Register') || [];
  const headerIndex = rows.findIndex((row) => row?.includes('Closed'));
  if (headerIndex < 0) throw new Error('NFR Register header "Closed" is missing');
  const headers = rows[headerIndex];
  const idIndex = headers.indexOf('ID');
  const closedIndex = headers.indexOf('Closed');
  const colors = workbookCellFillColors(file, 'NFR Register');
  for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] || [];
    const id = String(row[idIndex] || '').trim();
    const closed = String(row[closedIndex] || '').trim();
    if (!id || !CLOSED_FILL_COLORS.has(closed)) continue;
    const reference = `${columnReference(closedIndex)}${rowIndex + 1}`;
    const actual = colors.get(reference);
    const expected = CLOSED_FILL_COLORS.get(closed);
    if (actual !== expected) {
      result.fail(`NFR Register ${reference} (${id}) has Closed = "${closed}" but fill #${actual || 'NONE'}; expected #${expected}`);
    }
  }
}

function tableRecords(rows, requiredHeader) {
  const headerIndex = rows.findIndex((row) => row?.includes(requiredHeader));
  if (headerIndex < 0) throw new Error(`worksheet header "${requiredHeader}" is missing`);
  const headers = rows[headerIndex];
  return rows.slice(headerIndex + 1)
    .filter((row) => row?.some((value) => String(value || '').trim()) && row?.[0] !== 'LD ID')
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])));
}

function questionnaireRecords(rows) {
  const headerIndex = rows.findIndex((row) => row?.[0] === 'Stable ID');
  if (headerIndex < 0) throw new Error('worksheet header "Stable ID" is missing');
  return rows.slice(headerIndex + 1)
    .filter((row) => row?.some((value) => String(value || '').trim()) && row?.[0] !== 'LD ID')
    .map((row) => ({
      id: row[0] || '', answer: row[6] || '', respondent: row[7] || '', date: row[8] || '',
      evidence: row[9] || '', impact: row[10] || '', status: row[11] || '',
    }));
}

function validateQuestionnaireWorkbook(file, result) {
  const tables = workbookTables(file);
  const discovery = tableRecords(tables.get('Legacy Discovery') || [], 'Stable ID')
    .filter((row) => /^LD-\d{3}$/.test(row['Stable ID']));
  const questionnaire = questionnaireRecords(tables.get('Client Questionnaire') || [])
    .filter((row) => String(row.id || '').trim());
  const discoveryIds = new Set(discovery.map((row) => row['Stable ID']));
  const requiredIds = new Set(discovery
    .filter((row) => row['Discovery Status'] === 'Blocked: client input required')
    .map((row) => row['Stable ID']));
  const seen = new Set();
  const counts = { total: 0, answered: 0, deferred: 0, open: 0 };
  const allowed = new Set(['Open', 'Answered', 'Owner-deferred', 'Not applicable']);
  for (const row of questionnaire) {
    const id = row.id;
    counts.total += 1;
    if (!/^LD-\d{3}$/.test(id)) result.fail(`Client Questionnaire has invalid stable ID "${id}"`);
    if (seen.has(id)) result.fail(`Client Questionnaire has duplicate row ${id}`);
    seen.add(id);
    if (!discoveryIds.has(id)) result.fail(`Client Questionnaire row ${id} has no Legacy Discovery row`);
    const status = row.status;
    if (!allowed.has(status)) {
      result.fail(`Client Questionnaire row ${id} has invalid status "${status}"`);
      continue;
    }
    if (status === 'Open') counts.open += 1;
    if (status === 'Owner-deferred') counts.deferred += 1;
    if (status === 'Answered' || status === 'Not applicable') counts.answered += 1;
    if (status !== 'Open') {
      for (const [field, value] of [
        ['Client answer', row.answer], ['Respondent / authority', row.respondent],
        ['Answer date', row.date], ['Evidence / link', row.evidence], ['Impact / disposition', row.impact],
      ]) {
        if (!String(value || '').trim()) {
          result.fail(`Client Questionnaire row ${id} with status "${status}" must fill "${field}"`);
        }
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date || '')) {
        result.fail(`Client Questionnaire row ${id} must record answer date as YYYY-MM-DD`);
      }
    }
  }
  for (const id of requiredIds) {
    if (!seen.has(id)) result.fail(`Legacy Discovery row ${id} requires exactly one Client Questionnaire row`);
  }
  return {
    discovery: {
      total: discovery.length,
      completed: discovery.filter((row) => row['Discovery Status'] === 'Completed').length,
      open: requiredIds.size,
    },
    questionnaire: counts,
  };
}

function validateGovernedWorkbook(file, result) {
  const tables = workbookTables(file);
  const sheetNames = [...tables.keys()];

  const overview = tables.get('Overview') || [];
  const navigatorHeader = overview.findIndex((row) => row?.includes('Worksheet'));
  if (navigatorHeader < 0) {
    result.fail('Overview must contain the worksheet navigator header "Worksheet"');
  } else {
    if (String(overview[navigatorHeader]?.[0] || '').trim() !== 'Priority') {
      result.fail('Overview worksheet navigator first column must be "Priority"');
    }
    const navigatorRows = overview.slice(navigatorHeader + 1)
      .filter((row) => /^\d+$/.test(String(row?.[0] || '').trim()));
    const priorities = navigatorRows.map((row) => Number(row[0]));
    const navigatorNames = navigatorRows
      .map((row) => String(row?.[1] || '').trim())
      .filter(Boolean);
    const expectedPriorities = navigatorRows.map((_, index) => index + 1);
    if (priorities.length !== expectedPriorities.length ||
        priorities.some((priority, index) => priority !== expectedPriorities[index])) {
      result.fail('Overview worksheet navigator priorities must be the uninterrupted sequence 1..N');
    }
    const duplicates = navigatorNames.filter((name, index) => navigatorNames.indexOf(name) !== index);
    if (duplicates.length) {
      result.fail(`Overview worksheet navigator contains duplicates: ${[...new Set(duplicates)].join(', ')}`);
    }
    const missing = sheetNames.filter((name) => !navigatorNames.includes(name));
    const invented = navigatorNames.filter((name) => !sheetNames.includes(name));
    if (missing.length || invented.length || navigatorNames.length !== sheetNames.length) {
      result.fail(`Overview worksheet navigator must list every real worksheet exactly once; missing=[${missing.join(', ')}], invented=[${invented.join(', ')}]`);
    }
    if (navigatorNames.length === sheetNames.length &&
        navigatorNames.some((name, index) => name !== sheetNames[index])) {
      result.fail('Overview worksheet navigator order must exactly match physical worksheet-tab order');
    }
  }

  const nfrRows = tableRecords(tables.get('NFR Register') || [], 'Grade')
    .filter((row) => String(row.ID || '').trim());
  const nfrById = new Map();
  for (const row of nfrRows) {
    const id = String(row.ID || '').trim();
    if (nfrById.has(id)) result.fail(`NFR Register contains duplicate ID ${id}`);
    nfrById.set(id, row);
    if (!String(row['Architecture Area'] || '').trim()) {
      result.fail(`NFR Register row ${id} has no architecture area`);
    }
    if (!String(row['First Dependent Slice'] || '').trim()) {
      result.fail(`NFR Register row ${id} has no first dependent slice`);
    }
    if (!String(row['Where to refine and verify again'] || '').trim()) {
      result.fail(`NFR Register row ${id} has no recheck point`);
    }
  }

  const contracts = tableRecords(tables.get('Integration Contracts') || [], 'Contract ID')
    .filter((row) => String(row['Contract ID'] || '').trim());
  const contractIds = new Set();
  const allowedContractStatus = new Set(['Client-confirmed', 'Pending client', 'Known internal', 'Not used']);
  for (const row of contracts) {
    const id = String(row['Contract ID'] || '').trim();
    if (contractIds.has(id)) result.fail(`Integration Contracts contains duplicate ID ${id}`);
    contractIds.add(id);
    for (const field of ['Channel', 'Direction', 'Contract / format', 'Confirmation status']) {
      if (!String(row[field] || '').trim()) result.fail(`Integration Contracts row ${id} must fill "${field}"`);
    }
    if (!allowedContractStatus.has(String(row['Confirmation status'] || '').trim())) {
      result.fail(`Integration Contracts row ${id} has invalid confirmation status "${row['Confirmation status'] || ''}"`);
    }
    const codeEvidence = row['Code/config evidence'] || row['WAR evidence'];
    const liveEvidence = row['Live result'] || row['Demo result'];
    if (!String(codeEvidence || '').trim() && !String(liveEvidence || '').trim() &&
        !String(row['Internal consumer evidence'] || '').trim() && !String(row['Client evidence'] || '').trim()) {
      result.fail(`Integration Contracts row ${id} has no code, live, or client evidence`);
    }
    if (row['Confirmation status'] !== 'Pending client' &&
        !String(row['Compatibility / migration constraint'] || '').trim()) {
      result.fail(`Integration Contracts row ${id} must fill "Compatibility / migration constraint" before confirmation closes`);
    }
  }
}

function tryWaiver(options, result) {
  let status;
  try {
    status = loadAndValidateStatus(options.statusFile);
  } catch (error) {
    result.fail(`architecture manifest is missing and waiver status is invalid: ${error.message}`);
    return false;
  }
  const scope = auditedScope(status, options.scope);
  const decision = scopeAwareWaiver(status, options.waiverGate, scope);
  if (!decision.allowed) {
    result.fail(`architecture manifest is missing and no valid scope-aware owner waiver applies: ${decision.reason}`);
    return false;
  }
  result.skipped = true;
  result.summary = `Exact owner waiver ${options.waiverGate} covers scope "${scope}"`;
  return true;
}

function markdownTableValue(document, label) {
  const prefix = `| ${label} |`;
  const row = document.split(/\r?\n/).find((line) => line.trimStart().startsWith(prefix));
  return row ? row.split('|')[2].trim() : '';
}

function commandEntrypointExists(command, projectRoot) {
  const npm = command.match(/^npm(?:\s+--prefix\s+([^\s]+))?\s+(?:run\s+)?([^\s]+)$/);
  if (npm) {
    const packageFile = path.join(projectRoot, npm[1] || '', 'package.json');
    if (!fs.existsSync(packageFile)) return false;
    const packageJson = readJsonFile(packageFile);
    return Boolean(packageJson.scripts && packageJson.scripts[npm[2]]);
  }

  const file = commandEntrypoint(command);
  if (!file) return false;
  try {
    const entrypoint = resolveInside(projectRoot, file, 'governed string CI entrypoint');
    return fs.existsSync(entrypoint) && fs.statSync(entrypoint).isFile();
  } catch {
    return false;
  }
}

function commandEntrypoint(command) {
  const patterns = [
    /(?:-File\s+|node\s+)([^\s]+\.(?:ps1|js|mjs|cjs))(?:\s|$)/i,
    /(?:bash|sh)\s+([^\s]+\.sh)(?:\s|$)/i,
    /(?:python|python3|py|pytest)\s+([^\s]+\.py)(?:\s|$)/i,
    /cmd(?:\.exe)?\s+\/c\s+([^\s]+\.(?:cmd|bat))(?:\s|$)/i,
    /^([^\s]+\.(?:cmd|bat))(?:\s|$)/i,
  ];
  return patterns.map((pattern) => command.match(pattern)?.[1]).find(Boolean) || '';
}

function commandCoversGate(command, gatePath, projectRoot) {
  const normalizedGate = gatePath.replace(/\\/g, '/');
  const candidates = [normalizedGate, path.posix.basename(normalizedGate)];
  if (/\.(?:cs|fs|vb)$/i.test(normalizedGate)) {
    candidates.push(path.posix.dirname(normalizedGate));
  }
  const executes = (source, sourcePath = '') => {
    const executable = executableSource(source, sourcePath).replace(/\\/g, '/');
    return executable.split(/\r?\n/).some((line) => candidates.some((candidate) => {
      if (candidate === '.') return false;
      const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const executionPatterns = [
        `(?:^|[;&|{}]\\s*)(?:&\\s*)?node\\s+(?:--test\\s+)?${escaped}(?=[\\s\"']|$)`,
        `(?:^|[;&|{}]\\s*)dotnet\\s+test[^\\r\\n]*${escaped}(?=[\\s\"']|$)`,
        `(?:^|[;&|{}]\\s*)(?:python3?|py|pytest)\\s+${escaped}(?=[\\s\"']|$)`,
        `(?:^|[;&|{}]\\s*)(?:pwsh|powershell)\\s+(?:-[Ff]ile\\s+)?${escaped}(?=[\\s\"']|$)`,
        `(?:^|[;&|{}]\\s*)(?:bash|sh)\\s+${escaped}(?=[\\s\"']|$)`,
        `(?:^|[;&|{}]\\s*)cmd(?:\\.exe)?\\s+\\/c\\s+${escaped}(?=[\\s\"']|$)`,
        `(?:^|[;&|{}]\\s*)\\.\\/${escaped}(?=[\\s\"']|$)`,
      ];
      return executionPatterns.some((pattern) => new RegExp(pattern, 'i').test(line));
    }));
  };
  const npm = command.match(/^npm(?:\s+--prefix\s+([^\s]+))?\s+(?:run\s+)?([^\s]+)$/);
  if (npm) {
    const packageFile = path.join(projectRoot, npm[1] || '', 'package.json');
    if (!fs.existsSync(packageFile)) return false;
    const script = readJsonFile(packageFile).scripts?.[npm[2]] || '';
    return executes(script, 'package-script.sh');
  }

  const entrypoint = commandEntrypoint(command);
  if (!entrypoint) return false;
  try {
    const entrypointFile = resolveInside(projectRoot, entrypoint, 'governed string CI entrypoint');
    return executes(command) || executes(fs.readFileSync(entrypointFile, 'utf8'), entrypointFile);
  } catch {
    return false;
  }
}

function stripLineComments(source, markers) {
  return source.split(/\r?\n/).map((line) => {
    let quote = '';
    let escaped = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (quote) {
        if (character === '\\') {
          escaped = true;
        } else if (character === quote) {
          quote = '';
        }
        continue;
      }
      if (character === '"' || character === "'" || character === '`') {
        quote = character;
        continue;
      }
      const marker = markers.find((candidate) => line.startsWith(candidate, index));
      if (marker) return line.slice(0, index);
    }
    return line;
  }).join('\n');
}

function executableSource(source, sourcePath = '') {
  const extension = path.extname(sourcePath).toLowerCase();
  let executable = source.replace(/\/\*[\s\S]*?\*\//g, '');
  if (['.cs', '.fs', '.vb', '.js', '.mjs', '.cjs', '.ts'].includes(extension) || !extension) {
    executable = stripLineComments(executable, ['//']);
  }
  if (['.ps1', '.sh', '.py'].includes(extension) || sourcePath === 'package-script.sh') {
    executable = stripLineComments(executable, ['#']);
  }
  if (['.cmd', '.bat'].includes(extension)) {
    executable = executable.replace(/^\s*(?:::|rem\b).*$/gim, '');
  }
  return executable;
}

function assertionUsesFixture(source, fixture) {
  const escaped = fixture.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    `\\b(?:Assert|assert)\\s*\\.[^;]{0,1200}[\"'\\\`]${escaped}[\"'\\\`][^;]*;`,
    `\\bassert(?:True|False|Equals?|NotNull|Null)?\\s*\\([^;]{0,1200}[\"'\\\`]${escaped}[\"'\\\`][^;]*[;)]`,
    `^\\s*assert\\b[^\\r\\n]*[\"'\\\`]${escaped}[\"'\\\`]`,
    `\\bShould\\b[^\\r\\n]*[\"']${escaped}[\"']`,
    `(?:\\[|test\\s|assert\\b)[^\\r\\n]*[\"']${escaped}[\"']`,
  ];
  return patterns.some((pattern) => {
    const match = source.match(new RegExp(pattern, 'sm'));
    return match && assertionIsBehavioral(match[0], fixture);
  });
}

function assertionIsBehavioral(fragment, fixture) {
  const withoutFixture = fragment
    .replaceAll(fixture, '')
    .replace(/[\"'`][^\"'`]*[\"'`]/g, '');
  const nestedCalls = [...withoutFixture.matchAll(/\b([A-Za-z_$][\w$]*)\s*\(/g)]
    .map((match) => match[1])
    .filter((name) => !/^(?:Assert|assert|assertTrue|assertFalse|assertEquals?|equal|strictEqual|deepEqual|Boolean|Number|String|Object|Array|test|it|Should)$/i.test(name));
  return nestedCalls.length > 0 ||
    /\$[A-Za-z_][\w]*|\b(?:actual|result|status|output|error|violation|violations)\b/i.test(withoutFixture);
}

function auditGovernedStringGate(foundationFile, projectRoot, result) {
  if (!fs.existsSync(foundationFile)) return;
  const foundation = fs.readFileSync(foundationFile, 'utf8');
  if (!foundation.includes('## Governed String Gate')) {
    result.fail('sections/00-foundation.md is missing ## Governed String Gate');
    return;
  }

  const labels = [
    'governed runtime categories',
    'analyzer or architecture test',
    'normal CI command',
    'failing fixture',
    'passing fixture',
  ];
  const values = new Map();
  for (const label of labels) {
    const value = markdownTableValue(foundation, label);
    values.set(label, value);
    if (!value || value.length < 8 || PLACEHOLDER.test(value)) {
      result.fail(`Governed String Gate must record non-placeholder ${label}`);
    }
  }

  const gateRecord = values.get('analyzer or architecture test') || '';
  const pathMatch = gateRecord.match(/`([^`]+)`/);
  const gateRelativePath = pathMatch?.[1] || '';
  let gateSource = '';
  if (!pathMatch) {
    result.fail('Governed String Gate analyzer/test must contain a backticked repository path');
  } else {
    try {
      const gatePath = resolveInside(projectRoot, pathMatch[1], 'governed string gate path');
      if (!fs.existsSync(gatePath) || !fs.statSync(gatePath).isFile()) {
        result.fail(`Governed String Gate analyzer/test does not exist: ${pathMatch[1]}`);
      } else {
        gateSource = fs.readFileSync(gatePath, 'utf8');
      }
    } catch (error) {
      result.fail(error.message);
    }
  }

  const ciCommand = (values.get('normal CI command') || '').match(/`([^`]+)`/)?.[1];
  if (!ciCommand || !commandEntrypointExists(ciCommand, projectRoot)) {
    result.fail('Governed String Gate normal CI command must name a committed executable entrypoint');
  } else if (gateRelativePath && !commandCoversGate(ciCommand, gateRelativePath, projectRoot)) {
    result.fail('Governed String Gate normal CI command does not execute the recorded analyzer/test');
  }

  const failingFixture = (values.get('failing fixture') || '').match(/`([^`]+)`/)?.[1];
  const passingFixture = (values.get('passing fixture') || '').match(/`([^`]+)`/)?.[1];
  if (!failingFixture || !passingFixture || failingFixture === passingFixture) {
    result.fail('Governed String Gate failing and passing fixtures must be distinct');
  } else if (gateSource) {
    const executable = executableSource(gateSource, gateRelativePath);
    if (!executable.includes(failingFixture) || !executable.includes(passingFixture)) {
      result.fail('Governed String Gate fixture identifiers must exist outside comments in the recorded analyzer/test');
    }
    if (!assertionUsesFixture(executable, failingFixture) ||
        !assertionUsesFixture(executable, passingFixture)) {
      result.fail('Governed String Gate fixtures must each participate in an executable assertion');
    }
  }
}

function auditArchitecture(input = {}) {
  const options = {
    architectureDir: path.resolve(input.architectureDir || process.env.ARCHITECTURE_DIR || path.join(__dirname, '..', 'architecture')),
    statusFile: path.resolve(input.statusFile || process.env.MIGRATION_STATUS_FILE || path.join(__dirname, '..', 'migration_status.yaml')),
    waiverGate: input.waiverGate || process.env.ARCHITECTURE_WAIVER_GATE || ARCHITECTURE_WAIVER_GATE,
    scope: input.scope || null,
    requireVerdict: Boolean(input.requireVerdict || input.requireClosure),
    requireClosure: Boolean(input.requireClosure),
    foundation: Boolean(input.foundation),
    projectRoot: input.projectRoot ? path.resolve(input.projectRoot) : null,
  };
  const result = new AuditResult('ARCHITECTURE AUDIT');
  if (options.waiverGate !== ARCHITECTURE_WAIVER_GATE) {
    result.fail(`architecture waiver gate must be "${ARCHITECTURE_WAIVER_GATE}", not "${options.waiverGate}"`);
    return result;
  }
  const manifestFile = path.join(options.architectureDir, 'architecture-nfr-manifest.json');
  const architectureFile = path.join(options.architectureDir, 'architecture.md');
  const foundationFile = path.join(options.architectureDir, 'sections', '00-foundation.md');
  const drawioFile = path.join(options.architectureDir, 'architecture.drawio');
  const adrDirectory = path.join(options.architectureDir, 'adr');
  const verdictFile = path.join(options.architectureDir, 'architecture-review-verdict.md');
  const projectRoot = options.projectRoot || path.resolve(options.architectureDir, '..', '..');

  if (!fs.existsSync(manifestFile)) {
    tryWaiver(options, result);
    return result;
  }

  checkDocument(architectureFile, 'architecture.md', result);
  let manifest;
  try {
    manifest = readJsonFile(manifestFile);
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  result.merge(validateSchema(ARCHITECTURE_MANIFEST_SCHEMA, manifest), 'architecture-nfr-manifest.json ');
  if (!result.ok) return result;
  if (PLACEHOLDER.test(manifest.project) || PLACEHOLDER.test(manifest.document_set_version)) {
    result.fail('architecture-nfr-manifest.json contains an unfilled project or document_set_version');
  }

  const pinnedFiles = new Map();
  for (const fileEntry of manifest.files) {
    if (fileEntry.document_set_version !== manifest.document_set_version) {
      result.fail(`${fileEntry.path} document_set_version must equal ${manifest.document_set_version}`);
    }
    let absolute;
    try {
      const referenced = resolveInside(options.architectureDir, fileEntry.path, 'architecture file path');
      absolute = resolveInside(options.architectureDir,
        canonicalRelative(path.relative(options.architectureDir, referenced)), 'canonical architecture file path');
    } catch (error) {
      result.fail(error.message);
      continue;
    }
    const relative = canonicalRelative(path.relative(options.architectureDir, absolute));
    if (pinnedFiles.has(relative)) result.fail(`architecture file ${relative} is pinned more than once`);
    pinnedFiles.set(relative, fileEntry.sha256.toLowerCase());
    if (!fs.existsSync(absolute)) {
      result.fail(`pinned architecture file does not exist: ${relative}`);
    } else if (fs.lstatSync(absolute).isSymbolicLink()) {
      result.fail(`pinned architecture file must not be a symbolic link: ${relative}`);
    } else if (sha256File(absolute) !== fileEntry.sha256.toLowerCase()) {
      result.fail(`sha256 mismatch for ${relative}`);
    }
    const isArchitectureContent = relative === 'architecture.md' ||
      relative === 'architecture.drawio' || relative === 'architecture-decision-backlog.md' ||
      relative.startsWith('sections/') || relative.startsWith('adr/');
    if (isArchitectureContent && fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      rejectDeliveryReferences(absolute, relative, result);
      if (relative.endsWith('.md')) {
        const content = fs.readFileSync(absolute, 'utf8');
        const declaredVersion = content.match(/Document set version:\s*`?([^`\s]+)`?/i)?.[1];
        if (declaredVersion && declaredVersion !== manifest.document_set_version) {
          result.fail(
            `${relative} declares document set version ${declaredVersion}, expected ${manifest.document_set_version}`
          );
        }
      }
    }
  }
  for (const required of [
    'architecture-nfr-decision-register.xlsx',
    'architecture-nfr-owner-review.md',
    'architecture.md',
    'architecture.drawio',
    'sections/00-foundation.md',
  ]) {
    if (!pinnedFiles.has(required)) result.fail(`files[] must pin ${required}`);
  }
  if (fs.existsSync(architectureFile)) {
    const architecture = fs.readFileSync(architectureFile, 'utf8');
    for (const heading of [
      '## Living Architecture Contract',
      '## Foundation Baseline',
      '## Architecture Decomposition',
      '## First Implementable Slices',
    ]) {
      if (!architecture.includes(heading)) {
        result.fail(`architecture.md is missing required decomposition heading: ${heading}`);
      }
    }
    if (!architecture.includes('sections/00-foundation.md')) {
      result.fail('architecture.md must link the Foundation architecture section');
    }
  }
  auditGovernedStringGate(foundationFile, projectRoot, result);
  const registerFile = path.join(options.architectureDir, 'architecture-nfr-decision-register.xlsx');
  const ownerReviewFile = path.join(options.architectureDir, 'architecture-nfr-owner-review.md');
  if (fs.existsSync(registerFile) && fs.existsSync(ownerReviewFile)) {
    const ownerReview = fs.readFileSync(ownerReviewFile, 'utf8');
    let workbookGovernance = null;
    try {
      const misplacedCharts = findUnsupportedChartPartLocations(registerFile);
      if (misplacedCharts.length) {
        result.fail(
          `architecture-nfr-decision-register.xlsx stores chart parts in a location Excel desktop rejects: ${misplacedCharts.join(', ')}`
        );
      }
      const sheetNames = workbookSheetNames(registerFile);
      if (!sheetNames.includes('Legacy Discovery')) {
        result.fail('architecture-nfr-decision-register.xlsx must contain the Legacy Discovery worksheet');
      }
      if (!sheetNames.includes('Technology Stack')) {
        result.fail('architecture-nfr-decision-register.xlsx must contain the Technology Stack worksheet');
      }
      if (!sheetNames.includes('Team Capability')) {
        result.fail('architecture-nfr-decision-register.xlsx must contain the Team Capability worksheet');
      }
      if (!sheetNames.includes('Client Questionnaire')) {
        result.fail('architecture-nfr-decision-register.xlsx must contain the Client Questionnaire worksheet');
      }
      if (!sheetNames.includes('System Diagram Gate')) {
        result.fail('architecture-nfr-decision-register.xlsx must contain the System Diagram Gate worksheet');
      }
      if (!sheetNames.includes('Integration Contracts')) {
        result.fail('architecture-nfr-decision-register.xlsx must contain the Integration Contracts worksheet');
      }
      const capabilityIndex = sheetNames.indexOf('Team Capability');
      const technologyIndex = sheetNames.indexOf('Technology Stack');
      const discoveryIndex = sheetNames.indexOf('Legacy Discovery');
      const nfrIndex = sheetNames.indexOf('NFR Register');
      if (discoveryIndex >= 0 && nfrIndex >= 0 && nfrIndex !== discoveryIndex + 1) {
        result.fail('Legacy Discovery worksheet must appear immediately before NFR Register');
      }
      if (capabilityIndex >= 0 && technologyIndex >= 0 &&
          technologyIndex !== capabilityIndex + 1) {
        result.fail('Team Capability worksheet must appear immediately before Technology Stack');
      }
      const registerText = workbookSearchableText(registerFile);
      for (const requiredLabel of [
        'Decision Basis',
        'Decision Owner',
        'Required Participants',
        'Proposed by',
        'Decision record / ADR',
        'Capability domain',
        'Team / Available People',
        'Current Level',
        'Gap Closure Plan',
        'Related Decision / TECH-ID',
        'Closed',
        'Session state and horizontal scaling',
        'Authorization',
        'Inventory jobs, workers and background operations',
        'Distribution and customer customization',
        'Legacy Architecture Discovery',
        'Code review',
        'Live walkthrough',
        'Client interview',
        'Current legacy behavior',
        'Verification status',
        'Evidence links',
        'Linked NFR',
        'Client Questionnaire',
        'Canonical client answer',
        'Respondent / authority',
        'NFR / ADR / scope impact',
        'System Architecture Gate',
        'Downstream delivery / feature detail backlog',
        'High-level file',
        'Workbook Navigator',
        'Architecture Area',
        'First Dependent Slice',
        'Where to refine and verify again',
        'Legacy Integration Contracts',
      ]) {
        if (!registerText.includes(requiredLabel)) {
          result.fail(`architecture-nfr-decision-register.xlsx is missing required governance field or architecture driver: ${requiredLabel}`);
        }
      }
      workbookGovernance = validateQuestionnaireWorkbook(registerFile, result);
      validateGovernedWorkbook(registerFile, result);
      validateSemanticWorkbookColors(registerFile, result);
    } catch (error) {
      result.fail(`architecture-nfr-decision-register.xlsx is not a readable OOXML workbook: ${error.message}`);
    }
    const expectedRegisterHash = sha256File(registerFile);
    const registerPin = verdictValue(ownerReview, 'Decision register SHA-256');
    if (!registerPin || registerPin.toLowerCase() !== expectedRegisterHash) {
      result.fail(`architecture-nfr-owner-review.md must pin exact decision-register SHA-256 ${expectedRegisterHash}`);
    }
    const discoveryTotal = Number.parseInt(verdictValue(ownerReview, 'Legacy discovery total'), 10);
    const discoveryCompleted = Number.parseInt(verdictValue(ownerReview, 'Legacy discovery completed'), 10);
    const discoveryOpen = Number.parseInt(verdictValue(ownerReview, 'Legacy discovery open'), 10);
    const discoveryLiveSkipped = Number.parseInt(verdictValue(ownerReview, 'Legacy discovery live skipped by owner'), 10);
    if (!Number.isInteger(discoveryTotal) || discoveryTotal < 1) {
      result.fail('architecture-nfr-owner-review.md must record a positive Legacy discovery total');
    }
    if (!Number.isInteger(discoveryCompleted) || discoveryCompleted !== discoveryTotal) {
      result.fail('architecture-nfr-owner-review.md must show every required Legacy Discovery row completed or owner-dispositioned');
    }
    if (discoveryOpen !== 0) {
      result.fail('architecture-nfr-owner-review.md must show zero open Legacy Discovery rows');
    }
    if (!Number.isInteger(discoveryLiveSkipped) || discoveryLiveSkipped < 0 || discoveryLiveSkipped > discoveryTotal) {
      result.fail('architecture-nfr-owner-review.md must record a valid Legacy discovery live skipped by owner count');
    }
    const questionnaireTotal = Number.parseInt(verdictValue(ownerReview, 'Client questionnaire total'), 10);
    const questionnaireAnswered = Number.parseInt(verdictValue(ownerReview, 'Client questionnaire answered'), 10);
    const questionnaireDeferred = Number.parseInt(verdictValue(ownerReview, 'Client questionnaire deferred'), 10);
    const questionnaireOpen = Number.parseInt(verdictValue(ownerReview, 'Client questionnaire open'), 10);
    if (![questionnaireTotal, questionnaireAnswered, questionnaireDeferred, questionnaireOpen]
        .every((value) => Number.isInteger(value) && value >= 0)) {
      result.fail('architecture-nfr-owner-review.md must record valid Client Questionnaire totals');
    } else if (questionnaireAnswered + questionnaireDeferred + questionnaireOpen !== questionnaireTotal) {
      result.fail('architecture-nfr-owner-review.md Client Questionnaire totals must reconcile');
    }
    if (questionnaireOpen !== 0) {
      result.fail('architecture-nfr-owner-review.md must show zero open Client Questionnaire rows');
    }
    if (workbookGovernance) {
      const actualDiscovery = workbookGovernance.discovery;
      const actualQuestionnaire = workbookGovernance.questionnaire;
      if (discoveryTotal !== actualDiscovery.total || discoveryCompleted !== actualDiscovery.completed ||
          discoveryOpen !== actualDiscovery.open) {
        result.fail(`architecture-nfr-owner-review.md Legacy Discovery totals do not match workbook rows (${actualDiscovery.total} total, ${actualDiscovery.completed} completed, ${actualDiscovery.open} open)`);
      }
      if (questionnaireTotal !== actualQuestionnaire.total || questionnaireAnswered !== actualQuestionnaire.answered ||
          questionnaireDeferred !== actualQuestionnaire.deferred || questionnaireOpen !== actualQuestionnaire.open) {
        result.fail(`architecture-nfr-owner-review.md Client Questionnaire totals do not match workbook rows (${actualQuestionnaire.total} total, ${actualQuestionnaire.answered} answered, ${actualQuestionnaire.deferred} deferred, ${actualQuestionnaire.open} open)`);
      }
    }
    const gradeATotal = Number.parseInt(verdictValue(ownerReview, 'Grade A total'), 10);
    const gradeAApproved = Number.parseInt(verdictValue(ownerReview, 'Grade A approved'), 10);
    const gradeAClosed = Number.parseInt(verdictValue(ownerReview, 'Grade A closed'), 10);
    if (!Number.isInteger(gradeATotal) || gradeATotal < 1) {
      result.fail('architecture-nfr-owner-review.md must record a positive Grade A total');
    }
    if (!Number.isInteger(gradeAApproved) || gradeAApproved < 0 || gradeAApproved > gradeATotal) {
      result.fail('architecture-nfr-owner-review.md must record a valid Grade A approved count');
    }
    if (!Number.isInteger(gradeAClosed) || gradeAClosed !== gradeATotal) {
      result.fail('architecture-nfr-owner-review.md must show every Grade A row closed by the workbook gate');
    }
    const technologyTotal = Number.parseInt(verdictValue(ownerReview, 'Technology decisions total'), 10);
    const technologyResolved = Number.parseInt(verdictValue(ownerReview, 'Technology decisions resolved'), 10);
    const technologyGradeAOpen = Number.parseInt(verdictValue(ownerReview, 'Technology Grade A open'), 10);
    if (!Number.isInteger(technologyTotal) || technologyTotal < 1) {
      result.fail('architecture-nfr-owner-review.md must record a positive Technology decisions total');
    }
    if (!Number.isInteger(technologyResolved) || technologyResolved !== technologyTotal) {
      result.fail('architecture-nfr-owner-review.md must show every technology decision resolved');
    }
    if (technologyGradeAOpen !== 0) {
      result.fail('architecture-nfr-owner-review.md must show zero open Technology Grade A decisions');
    }
    const capabilityTotal = Number.parseInt(verdictValue(ownerReview, 'Team capabilities total'), 10);
    const capabilityAssessed = Number.parseInt(verdictValue(ownerReview, 'Team capabilities assessed'), 10);
    const capabilityOpen = Number.parseInt(verdictValue(ownerReview, 'Team capabilities open'), 10);
    if (!Number.isInteger(capabilityTotal) || capabilityTotal < 1) {
      result.fail('architecture-nfr-owner-review.md must record a positive Team capabilities total');
    }
    if (!options.foundation && (!Number.isInteger(capabilityAssessed) || capabilityAssessed !== capabilityTotal)) {
      result.fail('architecture-nfr-owner-review.md must show every required team capability assessed');
    }
    if (!options.foundation && capabilityOpen !== 0) {
      result.fail('architecture-nfr-owner-review.md must show zero open team capability gaps without a plan');
    }
    if (!verdictValue(ownerReview, 'Reviewed by')) {
      result.fail('architecture-nfr-owner-review.md must identify the human reviewer');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(verdictValue(ownerReview, 'Date') || '')) {
      result.fail('architecture-nfr-owner-review.md must record the review date as YYYY-MM-DD');
    }
    if (options.foundation && !/^## Foundation Verdict\s*\r?\n+\s*`?approved-for-delivery`?\s*$/im.test(ownerReview)) {
      result.fail('architecture-nfr-owner-review.md must contain an approved-for-delivery Foundation Verdict section');
    }
    if (!options.foundation && !/^## Verdict\s*\r?\n+\s*`?approved`?\s*$/im.test(ownerReview)) {
      result.fail('architecture-nfr-owner-review.md must contain an approved Verdict section');
    }
  }
  if (fs.existsSync(drawioFile)) {
    const drawio = fs.readFileSync(drawioFile, 'utf8');
    const openPages = drawio.match(/<diagram\b/gi) || [];
    const closePages = drawio.match(/<\/diagram>/gi) || [];
    const pageBodies = [...drawio.matchAll(/<diagram\b([^>]*)>([\s\S]*?)<\/diagram>/gi)];
    const hasEnvelope = /^\s*(?:<\?xml[^?]*\?>\s*)?<mxfile\b[\s\S]*<\/mxfile>\s*$/i.test(drawio);
    const validPages = pageBodies.every((match) => {
      const attributes = match[1];
      const body = match[2].trim();
      if (!/\bid\s*=\s*["'][^"']+["']/i.test(attributes) ||
          !/\bname\s*=\s*["'][^"']+["']/i.test(attributes) || !body) return false;
      return validDrawioPageBody(body);
    });
    if (!hasEnvelope || openPages.length < 2 || openPages.length !== closePages.length ||
        pageBodies.length !== openPages.length || !validPages) {
      result.fail('architecture.drawio must contain a valid editable mxfile with at least two diagram pages');
    }
    const actualPages = new Map();
    for (const match of pageBodies) {
      const id = match[1].match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
      const name = match[1].match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1];
      if (actualPages.has(id)) result.fail(`architecture.drawio has duplicate diagram id ${id}`);
      actualPages.set(id, name);
    }
    const declaredIds = new Set();
    const covered = new Set();
    for (const page of manifest.diagram_pages) {
      if (declaredIds.has(page.id)) result.fail(`diagram_pages has duplicate id ${page.id}`);
      declaredIds.add(page.id);
      if (!actualPages.has(page.id)) {
        result.fail(`diagram_pages references missing Draw.io page ${page.id}`);
      } else if (actualPages.get(page.id) !== page.name) {
        result.fail(`Draw.io page ${page.id} name must equal manifest name "${page.name}"`);
      }
      for (const concern of page.covers) covered.add(concern);
    }
    for (const id of actualPages.keys()) {
      if (!declaredIds.has(id)) result.fail(`Draw.io page ${id} is not declared in diagram_pages`);
    }
    for (const concern of REQUIRED_DIAGRAM_COVERAGE) {
      if (!covered.has(concern)) result.fail(`diagram_pages does not cover required concern ${concern}`);
    }
  }

  const nfrIds = new Set();
  const adrIds = new Set();
  for (const nfr of manifest.nfrs) {
    if (nfrIds.has(nfr.id)) result.fail(`duplicate NFR id "${nfr.id}"`);
    nfrIds.add(nfr.id);
    if (PLACEHOLDER.test(nfr.statement) || PLACEHOLDER.test(nfr.acceptance)) {
      result.fail(`NFR ${nfr.id} contains an unfilled statement or acceptance criterion`);
    }
    for (const reference of nfr.evidence) {
      validateClosureReference(projectRoot, reference, `NFR ${nfr.id} evidence`, result);
    }
  }
  for (const adr of manifest.adrs) {
    if (adrIds.has(adr.id)) result.fail(`duplicate ADR id "${adr.id}"`);
    adrIds.add(adr.id);
    const file = canonicalRelative(adr.file);
    if (!file.startsWith('adr/') || !pinnedFiles.has(file)) {
      result.fail(`ADR ${adr.id} file is not pinned under adr/: ${adr.file}`);
    }
  }
  for (const nfr of manifest.nfrs) {
    for (const adrId of nfr.adrs) {
      const adr = manifest.adrs.find((candidate) => candidate.id === adrId);
      if (!adr) {
        result.fail(`NFR ${nfr.id} references unknown ADR "${adrId}"`);
      } else if (!adr.nfrs.includes(nfr.id)) {
        result.fail(`NFR ${nfr.id} -> ADR ${adrId} lacks the reverse ADR -> NFR link`);
      }
    }
  }
  for (const adr of manifest.adrs) {
    for (const nfrId of adr.nfrs) {
      const nfr = manifest.nfrs.find((candidate) => candidate.id === nfrId);
      if (!nfr) {
        result.fail(`ADR ${adr.id} references unknown NFR "${nfrId}"`);
      } else if (!nfr.adrs.includes(adr.id)) {
        result.fail(`ADR ${adr.id} -> NFR ${nfrId} lacks the reverse NFR -> ADR link`);
      }
    }
  }

  if (!fs.existsSync(adrDirectory)) {
    result.fail('adr/ directory is missing');
  } else {
    for (const absolute of walkFiles(adrDirectory)) {
      const relative = canonicalRelative(path.relative(options.architectureDir, absolute));
      if (fs.lstatSync(absolute).isSymbolicLink()) {
        result.fail(`ADR must not be a symbolic link: ${relative}`);
      } else if (!pinnedFiles.has(relative)) {
        result.fail(`unmanifested ADR: ${relative}`);
      }
    }
  }

  const reviewStatus = statusAt(options.statusFile);
  try { validateRegistry(projectRoot, reviewStatus); }
  catch (error) { result.fail(error.message); return result; }
  if (isAdopted(reviewStatus) || options.requireClosure) {
    if (options.requireVerdict) {
      try {
        validateReviewRecords({ root: projectRoot, status: loadAndValidateStatus(options.statusFile), manifest, manifestFile,
          drawioFile, requireClosure: options.requireClosure });
      } catch (error) { result.fail(error.message); }
    }
  } else if (options.requireVerdict && fs.existsSync(verdictFile)) {
    const verdict = checkDocument(verdictFile, 'architecture-review-verdict.md', result);
    if (verdict) {
      const expectedVersion = manifest.document_set_version;
      const expectedManifestHash = sha256File(manifestFile);
      const expectedDrawioHash = fs.existsSync(drawioFile) ? sha256File(drawioFile) : null;
      if (verdictValue(verdict, 'Document set version') !== expectedVersion) {
        result.fail(`architecture-review-verdict.md must pin exact document set version "${expectedVersion}"`);
      }
      const manifestPin = verdictValue(verdict, 'Manifest SHA-256');
      if (!manifestPin || manifestPin.toLowerCase() !== expectedManifestHash) {
        result.fail(`architecture-review-verdict.md must pin exact manifest SHA-256 ${expectedManifestHash}`);
      }
      const drawioVersion = verdictValue(verdict, 'Architecture Draw.io version');
      if (drawioVersion !== expectedVersion) {
        result.fail(`architecture-review-verdict.md must pin architecture.drawio version "${expectedVersion}"`);
      }
      const drawioPin = verdictValue(verdict, 'Architecture Draw.io SHA-256');
      if (!expectedDrawioHash || !drawioPin || drawioPin.toLowerCase() !== expectedDrawioHash) {
        result.fail('architecture-review-verdict.md must pin the exact architecture.drawio SHA-256');
      }
      if (!verdictValue(verdict, 'Approved by')) result.fail('architecture-review-verdict.md must name the approver');
      if (!verdictValue(verdict, 'Date')) result.fail('architecture-review-verdict.md must record the approval date');
      if (verdictValue(verdict, 'Scope') !== manifest.scope) {
        result.fail(`architecture-review-verdict.md must pin exact scope "${manifest.scope}"`);
      }
      if (!/^## Verdict\s*\r?\n+\s*approved\s*$/im.test(verdict)) {
        result.fail('architecture-review-verdict.md must contain an approved Verdict section');
      }
      const stage10Report = verdictValue(verdict, 'Stage 10 clean report');
      if (!stage10Report) {
        result.fail('architecture-review-verdict.md must reference the closing Stage 10 clean report');
      } else if (!/^analysis\/reviews\/stage-10-pass-\d{3}\.md$/.test(canonicalRelative(stage10Report))) {
        result.fail('architecture-review-verdict.md Stage 10 clean report must use analysis/reviews/stage-10-pass-NNN.md');
      } else {
        try {
          const reportFile = resolveInside(projectRoot, stage10Report, 'Stage 10 clean report');
          if (!fs.existsSync(reportFile) || !fs.statSync(reportFile).isFile() || fs.lstatSync(reportFile).isSymbolicLink()) {
            result.fail(`architecture-review-verdict.md Stage 10 clean report is missing or unsafe: ${stage10Report}`);
          } else {
            const report = fs.readFileSync(reportFile, 'utf8');
            if (!/^\s*-\s*Result:\s*`?clean`?\s*$/im.test(report)) {
              result.fail('architecture-review-verdict.md Stage 10 report must record Result: clean');
            }
            const reviewedSet = verdictValue(report, 'Artifact set version') ||
              verdictValue(report, 'Document set');
            if (reviewedSet !== expectedVersion) {
              result.fail(`architecture-review-verdict.md Stage 10 report must reference exact document set ${expectedVersion}`);
            }
          }
        } catch (error) {
          result.fail(error.message);
        }
      }
    }
  } else if (options.requireVerdict) {
    result.fail('architecture-review-verdict.md is missing: Stage 11 owner verdict is required');
  } else if (!options.foundation) {
    result.warn('architecture-review-verdict.md is not present; rerun with --require-verdict before Stage 11 closes');
  }

  result.summary = `${manifest.nfrs.length} NFRs; ${manifest.adrs.length} ADRs; ${pinnedFiles.size} pinned files including architecture.drawio`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['dir', 'status', 'scope', 'waiver-gate'], [
    'ARCHITECTURE_DIR',
    'MIGRATION_STATUS_FILE',
    'ARCHITECTURE_WAIVER_GATE',
  ]);
  const result = auditArchitecture({
    architectureDir: args.dir,
    statusFile: args.status,
    scope: args.scope,
    waiverGate: args['waiver-gate'],
    requireVerdict: args['require-verdict'],
    requireClosure: args['require-closure'],
    foundation: args.foundation,
  });
  process.exitCode = printResult(result);
}

module.exports = {
  ARCHITECTURE_MANIFEST_SCHEMA,
  REQUIRED_DIAGRAM_COVERAGE,
  auditArchitecture,
  workbookTables,
  validDrawioPageBody,
  validateClosureReference,
  verdictValue,
};

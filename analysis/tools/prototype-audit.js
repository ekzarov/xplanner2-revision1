#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const ExcelJS = require('@excel.js/exceljs').default;
const { UI_MANIFEST_SCHEMA, auditUiDesignSystem } = require('./ui-design-system');
const {
  AuditResult,
  PLACEHOLDER,
  SHA256_PATTERN,
  isNonEmptyString,
  parseArgs,
  printResult,
  readJsonFile,
  parseYamlFile,
  rejectGovernedOverrides,
  resolveInside,
  sha256File,
  validateSchema,
  walkFiles,
} = require('./lib');
const {
  auditedScope,
  loadAndValidateStatus,
  passClosesStage,
  scopeAwareWaiver,
} = require('./status-validator');

const PROTOTYPE_WAIVER_GATE = 'prototyping_retroactive';

const nonEmpty = { type: 'string', minLength: 1, pattern: '\\S' };
const hash = { type: 'string', pattern: SHA256_PATTERN };

// _schema_help documents the JSON shape for humans but is not Stage 6
// migration evidence. Existing projects already pin the evidence-only bytes,
// so adding or improving this help must not invalidate an owner approval.
function normalizationEvidenceHash(contents) {
  const record = JSON.parse(contents.toString('utf8'));
  if (!Object.hasOwn(record, '_schema_help')) {
    return crypto.createHash('sha256').update(contents).digest('hex');
  }
  const { _schema_help: ignored, ...evidence } = record;
  return crypto.createHash('sha256').update(`${JSON.stringify(evidence, null, 2)}\n`).digest('hex');
}

const PROTOTYPE_MANIFEST_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['schema_version', 'project', 'scope', 'tool', 'export_set_version', 'decision', 'normalization', 'normalization_sha256', 'workbook_rows_sha256', 'screens'],
  properties: {
    // 2 added the mandatory normalization record and per-screen surface_key.
    // 3 replaced covered_by's requirement and test references with a coverage
    // statement, because a Stage 6 record cannot cite artifacts Stage 9 and Stage
    // 14 have not written yet. Both older versions are reported with migration
    // instructions rather than a bare schema error.
    schema_version: { enum: [3, 4] },
    ui_design_system: UI_MANIFEST_SCHEMA,
    normalization: { const: 'analysis/prototyping/screen-normalization.json' },
    // The normalization record is Stage 6 evidence, but Stage 8 approval pins
    // only the manifest. Carrying its evidence hash here puts it inside the
    // approved hash, so a classification cannot be rewritten after approval.
    // The human-only _schema_help field is deliberately omitted from this hash.
    normalization_sha256: hash,
    // Row numbers are the foreign key across three artifacts, so what those rows
    // say has to be pinned too. Without this, row 8 can stop meaning "Login" and
    // start meaning "Delete account" while every cross-check still agrees on the
    // number 8 - and a Stage 8 approval that pins the manifest would still look
    // valid. The digest covers every governed row: the ones the catalogue
    // classifies and the ones it excludes.
    workbook_rows_sha256: hash,
    project: nonEmpty,
    scope: nonEmpty,
    tool: nonEmpty,
    export_set_version: nonEmpty,
    decision: { enum: ['analysis/prototyping/ui-ux-decision.md', 'analysis/prototyping/decision.md'] },
    // May be empty. A scope whose governed rows are all non-visual, or all
    // excluded at Stage 4, has nothing to draw, and requiring one screen would
    // force the invention of exactly the fabricated surface this rule exists to
    // prevent. The code below refuses an empty catalogue when any row is visual.
    screens: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'channel', 'surface_key', 'roles', 'states', 'workbook_rows', 'files'],
        properties: {
          id: nonEmpty,
          ui_variants: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
          title: nonEmpty,
          channel: nonEmpty,
          // channel + route family + primary user task + stable layout. Two
          // screens sharing it are the same surface and must be merged into one
          // screen carrying states and actions.
          surface_key: nonEmpty,
          roles: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
          states: { type: 'array', minItems: 1, uniqueItems: true, items: nonEmpty },
          actions: { type: 'array', uniqueItems: true, items: nonEmpty },
          overlays: { type: 'array', uniqueItems: true, items: nonEmpty },
          navigation: { type: 'array', uniqueItems: true, items: nonEmpty },
          workbook_rows: {
            type: 'array',
            uniqueItems: true,
            items: { type: 'integer', minimum: 1 },
          },
          target_only: { type: 'boolean' },
          target_requirement: nonEmpty,
          // "Owner-approved" has to point at the approval. Checked against the
          // owner decisions in migration_status.yaml, so a target-only screen
          // cannot be conjured by writing target_requirement: "x".
          target_decision: nonEmpty,
          // An improvement is not always a whole screen. A navigation component
          // added to an application that never had one, a confirmation the legacy
          // build skipped, a state it could not reach — each is one element of a
          // screen that is otherwise a faithful reproduction, and `target_only`
          // cannot say so: it is mutually exclusive with carrying workbook rows.
          //
          // With nowhere to record it, an approved improvement has two outcomes and
          // both are wrong. Deleted, because the record cannot hold it. Or kept
          // silently, indistinguishable from an invention nobody approved — which is
          // how a whole navigation sidebar can appear on thirty-seven screens with a
          // different item set each time and nothing saying it was ever decided.
          // `kind` is required because a label is not an identifier. "Cancel" can be
          // both an action and a navigation step, and an entry naming only "Cancel"
          // would approve both, or neither in particular.
          //
          // `target_requirement` is required for the reason the independent review of
          // this change gave: without it the record proves only that *some* approved
          // decision exists, and any decision could be cited for any element. It does
          // not make the binding mechanical - the text is prose, and no check can
          // confirm the owner meant this element - but it forces the record to state
          // what was approved, which is what a Stage 7 reviewer reads.
          target_only_elements: {
            type: 'array',
            items: {
              type: 'object',
              required: ['kind', 'element', 'target_requirement', 'target_decision'],
              properties: {
                kind: { enum: ['state', 'action', 'overlay', 'navigation'] },
                element: nonEmpty,
                target_requirement: nonEmpty,
                target_decision: nonEmpty,
              },
              additionalProperties: false,
            },
          },
          files: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['path', 'sha256'],
              properties: { path: nonEmpty, sha256: hash },
              additionalProperties: false,
            },
          },
        },
        oneOf: [
          {
            properties: {
              workbook_rows: { type: 'array', minItems: 1 },
              target_only: { const: false },
            },
          },
          {
            required: ['target_only', 'target_requirement', 'target_decision'],
            properties: {
              workbook_rows: { type: 'array', maxItems: 0 },
              target_only: { const: true },
            },
          },
        ],
        additionalProperties: false,
      },
    },
    non_visual_workbook_rows: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        // covered_by is required, not optional: "no wireframe" is only an
        // acceptable answer when the record says what will cover the behavior
        // instead.
        required: ['row', 'reason', 'covered_by'],
        properties: {
          row: { type: 'integer', minimum: 1 },
          reason: nonEmpty,
          // What Stage 6 can honestly hold, and nothing more.
          //
          // This asked for a requirement id and test names. Requirements are
          // written at Stage 15 and tests at Stage 17, so a project at Stage 6 had
          // to invent both - and an invented name is the placeholder this audit
          // refuses. Worse, filling them in later would change the manifest hash
          // that Stage 8 pinned, quietly invalidating the owner's approval with no
          // defined path back.
          //
          // So this record holds a statement of how the behavior will be covered,
          // which Stage 6 genuinely knows, plus the screen that sets it off where
          // there is one - the only part a script can check. Requirement ids and
          // test references belong to Stage 15 and Stage 17. This methodology does
          // not yet define where they live or an audit that reads them - a gap the
          // prototyping README states outright. What it does buy is that nothing
          // later has to reach into a manifest Stage 8 has already pinned.
          covered_by: {
            type: 'object',
            required: ['coverage'],
            properties: {
              coverage: nonEmpty,
              initiating_screen: { type: ['string', 'null'] },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    },
    _notes: { type: 'array', items: nonEmpty },
  },
  additionalProperties: false,
};

function canonicalRelative(value) {
  return value.replace(/\\/g, '/');
}

function checkDocument(file, label, result) {
  if (!fs.existsSync(file)) {
    result.fail(`${label} is missing`);
    return null;
  }
  const body = fs.readFileSync(file, 'utf8');
  const placeholder = body.replace(/<!--[\s\S]*?-->/g, '').match(PLACEHOLDER);
  if (placeholder) {
    result.fail(`${label} contains template placeholder "${placeholder[0]}"`);
  }
  if (!body.trim()) result.fail(`${label} is empty`);
  return body;
}

function approvalValue(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(new RegExp(`^\\s*[-*]?\\s*${escaped}:\\s*\\x60?([^\\x60\\r\\n]+)\\x60?\\s*$`, 'im'));
  return match ? match[1].trim() : null;
}

function scanSecrets(directory, result) {
  const secretPattern = /(figd_[A-Za-z0-9_-]{10,}|AIza[0-9A-Za-z_-]{20,}|bearer\s+[A-Za-z0-9._-]{16,})/i;
  const textExtensions = new Set(['.md', '.json', '.txt', '.html', '.htm', '.svg', '.csv', '.xml', '.yaml', '.yml']);
  for (const file of walkFiles(directory)) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const match = fs.readFileSync(file, 'utf8').match(secretPattern);
    if (match) {
      result.fail(`possible credential material in ${canonicalRelative(path.relative(directory, file))}`);
    }
  }
}

function tryWaiver(options, result) {
  const statusFile = path.resolve(options.statusFile);
  let status;
  try {
    status = loadAndValidateStatus(statusFile);
  } catch (error) {
    result.fail(`prototype manifest is missing and waiver status is invalid: ${error.message}`);
    return false;
  }
  const scope = auditedScope(status, options.scope);
  const decision = scopeAwareWaiver(status, options.waiverGate, scope);
  if (!decision.allowed) {
    result.fail(`prototype manifest is missing and no valid scope-aware owner waiver applies: ${decision.reason}`);
    return false;
  }
  result.skipped = true;
  result.summary = `Exact owner waiver ${options.waiverGate} covers scope "${scope}"`;
  return true;
}

const CLASSIFICATIONS = ['surface', 'state', 'action', 'overlay', 'navigation', 'non-visual'];

const NORMALIZATION_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['rows'],
  properties: {
    // May be empty: a scope of only owner-approved target-only screens, or one
    // whose every governed row was excluded at Stage 4, has nothing to
    // classify. Completeness is proved against the workbook, not against a
    // minimum length here.
    rows: {
      type: 'array',
      items: {
        type: 'object',
        required: ['row', 'classification'],
        properties: {
          row: { type: 'integer', minimum: 1 },
          classification: { enum: CLASSIFICATIONS },
          // The surface this row ended up on. Only non-visual rows may omit it,
          // together with surface_key.
          screen: nonEmpty,
          surface_key: nonEmpty,
          // Which state, action, overlay or navigation step. Required for those
          // four classifications, and checked against the screen's own arrays:
          // "this row is a state of the login screen" is only a claim until it
          // names the state and the screen lists it.
          element: nonEmpty,
          note: nonEmpty,
        },
        additionalProperties: false,
      },
    },
    // Rows the owner decided at Stage 4 not to port. Not a seventh
    // classification: they are outside the catalogue, and each says why on the
    // record rather than being quietly absent.
    excluded_rows: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'object',
        required: ['row', 'finding', 'reason'],
        properties: {
          row: { type: 'integer', minimum: 1 },
          finding: nonEmpty,
          reason: nonEmpty,
        },
        additionalProperties: false,
      },
    },
    _schema_help: { type: 'object' },
    _notes: { type: 'array', items: nonEmpty },
  },
  additionalProperties: false,
};

// Reads screen-normalization.json into a coverage table. Returns empty maps on
// any failure, having already recorded the failure: the caller must not treat
// "nothing to check" as "nothing wrong".
function readNormalization(options, manifest, result) {
  const empty = { rows: new Map(), excluded: new Map(), entries: new Map() };
  if (!manifest.normalization) return empty;
  // Resolved beside the manifest, exactly as ui-ux-decision.md is: the manifest
  // states the canonical repository-relative path for readers, and the audit
  // reads the file sitting in the prototype directory it was given. The schema
  // pins that path to a const so the two can never disagree.
  const normalizationFile = path.join(options.prototypeDir, path.basename(manifest.normalization));
  if (!fs.existsSync(normalizationFile)) {
    result.fail(`normalization record does not exist: ${manifest.normalization}`);
    return empty;
  }
  // Refused for the same reason wireframe exports are: a symlink can satisfy the
  // hash from a file that is not in the repository, so a clean checkout elsewhere
  // would not contain the evidence a Stage 8 approval pinned.
  //
  // Wrapped, because the file can go away between the existence check and this
  // one, and a race should produce an audit failure rather than a stack trace.
  try {
    if (fs.lstatSync(normalizationFile).isSymbolicLink()) {
      result.fail(`normalization record must not be a symbolic link: ${manifest.normalization}`);
      return empty;
    }
  } catch (error) {
    result.fail(`cannot inspect normalization record ${manifest.normalization}: ${error.message}`);
    return empty;
  }
  // Read once and hash the bytes we parsed. Hashing the path and then reading it
  // again would let the audit validate content it did not hash.
  let contents;
  try {
    contents = fs.readFileSync(normalizationFile);
  } catch (error) {
    // A directory of that name, or an unreadable file, must be a diagnostic like
    // the workbook's, not a stack trace.
    result.fail(`cannot read normalization record ${manifest.normalization}: ${error.message}`);
    return empty;
  }
  let actualHash;
  try {
    actualHash = normalizationEvidenceHash(contents);
  } catch (error) {
    result.fail(`normalization record is not valid JSON: ${error.message}`);
    return empty;
  }
  // The schema accepts either case, so the comparison must too.
  if (manifest.normalization_sha256 && manifest.normalization_sha256.toLowerCase() !== actualHash) {
    result.fail(`normalization record sha256 mismatch: manifest records ${manifest.normalization_sha256}, file is ${actualHash}`);
  }
  let record;
  try {
    record = JSON.parse(contents.toString('utf8'));
  } catch (error) {
    result.fail(`normalization record is not valid JSON: ${error.message}`);
    return empty;
  }
  const schemaErrors = validateSchema(NORMALIZATION_SCHEMA, record);
  if (schemaErrors.length) {
    result.merge(schemaErrors, 'screen-normalization.json ');
    return empty;
  }
  const rows = new Map();
  const entries = new Map();
  const excluded = new Map();
  for (const entry of record.rows) {
    for (const [field, value] of [['screen', entry.screen], ['element', entry.element]]) {
      if (value !== undefined && PLACEHOLDER.test(value)) {
        result.fail(`normalization row ${entry.row} leaves ${field} as an unfilled template placeholder`);
      }
    }
    if (rows.has(entry.row)) {
      result.fail(`normalization classifies workbook row ${entry.row} more than once`);
    }
    rows.set(entry.row, entry.classification);
    entries.set(entry.row, entry);
  }
  for (const entry of record.excluded_rows || []) {
    // A citation left as the template's own text cites nothing. Whether a real
    // finding says what the record claims is Stage 7's; whether the field was
    // filled in at all is mechanical.
    for (const [field, value] of [['finding', entry.finding], ['reason', entry.reason]]) {
      if (PLACEHOLDER.test(value)) {
        result.fail(`excluded workbook row ${entry.row} leaves ${field} as an unfilled template placeholder`);
      }
    }
    if (rows.has(entry.row)) {
      result.fail(`workbook row ${entry.row} is both classified and excluded as do-not-port`);
    }
    if (excluded.has(entry.row)) {
      result.fail(`workbook row ${entry.row} is excluded more than once`);
    }
    excluded.set(entry.row, entry);
  }
  return { rows, excluded, entries };
}

async function populatedWorkbookRows(workbookFile, result) {
  // Fail closed. Returning an empty set here used to make every coverage and
  // classification check vacuous, so a project with a mistyped workbook path
  // passed the completeness gate by having nothing to be complete about.
  if (!fs.existsSync(workbookFile)) {
    result.fail(`prototype coverage workbook does not exist: ${workbookFile}`);
    return { rows: new Set(), cells: new Map(), read: false };
  }
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile(workbookFile);
  } catch (error) {
    result.fail(`cannot read prototype coverage workbook ${workbookFile}: ${error.message}`);
    return { rows: new Set(), cells: new Map(), read: false };
  }
  const sheet = workbook.getWorksheet('User Flows');
  if (!sheet) {
    result.fail('prototype coverage workbook is missing canonical "User Flows" sheet');
    return { rows: new Set(), cells: new Map(), read: false };
  }
  const rows = new Set();
  // The text of each governed row and of the epic header that scopes it, so the
  // pin can cover the rows this record actually governs instead of the whole
  // shared sheet.
  const cells = new Map();
  let insideEpic = false;
  let epicRow = null;
  let epicValues = [];
  for (let rowNumber = 7; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const values = [];
    for (let column = 1; column <= 14; column += 1) {
      values.push(String(row.getCell(column).text || '').trim());
    }
    if (!values.some(Boolean)) continue;
    if (/^UF-\d+/.test(values[0])) {
      insideEpic = true;
      epicRow = rowNumber;
      epicValues = values;
    } else if (insideEpic) {
      rows.add(rowNumber);
      cells.set(rowNumber, { values, epicRow, epic: epicValues });
    } else {
      result.fail(`prototype coverage workbook row ${rowNumber} appears before the first epic`);
    }
  }
  return { rows, cells, read: true };
}

// A digest of the rows this record governs, from the same read that produced
// them. Hashing the whole file would be simpler and wrong: Stages 6-8 run
// feature by feature against one shared workbook, so a byte-level pin makes an
// edit to another feature's rows invalidate every feature's baseline and its
// Stage 8 approval. This covers exactly the rows whose meaning this manifest
// depends on.
//
// The serialization is JSON, not delimiter-joined text. Cells can contain tabs
// and newlines, so a delimiter-joined form is ambiguous: ["a\tb", "c"] and
// ["a", "b\tc"] would produce identical bytes and a row could be rewritten
// without disturbing the digest. JSON escapes them, and it is a contract an
// author can reproduce without reading this function.
//
// Each entry carries the epic header that scopes the row, because a scenario
// read under UF-001 does not mean the same thing read under UF-009 - and the
// header is not itself a governed row, so it would otherwise be invisible here.
function governedRowsDigest(cells, rowNumbers) {
  const entries = [...rowNumbers].sort((a, b) => a - b).map((row) => {
    const entry = cells.get(row) || {};
    return {
      row,
      epic_row: entry.epicRow === undefined ? null : entry.epicRow,
      // An epic contributes only immutable identity and name. Its status and
      // roll-up cells evolve as child rows are delivered.
      epic: (entry.epic || []).slice(0, 2),
      // Detail columns 1-8 are the immutable legacy/source contract.
      cells: (entry.values || []).slice(0, 8),
    };
  });
  return crypto.createHash('sha256').update(JSON.stringify(entries)).digest('hex');
}

async function auditPrototype(input = {}) {
  const options = {
    prototypeDir: path.resolve(input.prototypeDir || process.env.PROTOTYPE_DIR || path.join(__dirname, '..', 'prototyping')),
    statusFile: path.resolve(input.statusFile || process.env.MIGRATION_STATUS_FILE || path.join(__dirname, '..', 'migration_status.yaml')),
    waiverGate: input.waiverGate || process.env.PROTOTYPE_WAIVER_GATE || PROTOTYPE_WAIVER_GATE,
    scope: input.scope || null,
    requireApproval: Boolean(input.requireApproval),
    workbookFile: path.resolve(
      input.workbookFile ||
      process.env.WORKBOOK_FILE ||
      path.join(input.prototypeDir || process.env.PROTOTYPE_DIR || path.join(__dirname, '..', 'prototyping'), '..', 'legacy_user_flows.xlsx')
    ),
  };
  const result = new AuditResult('PROTOTYPE AUDIT');
  if (options.waiverGate !== PROTOTYPE_WAIVER_GATE) {
    result.fail(`prototype waiver gate must be "${PROTOTYPE_WAIVER_GATE}", not "${options.waiverGate}"`);
    return result;
  }
  const manifestFile = path.join(options.prototypeDir, 'screen-manifest.json');
  const decisionFile = path.join(options.prototypeDir, 'ui-ux-decision.md');
  const approvalFile = path.join(options.prototypeDir, 'ui-ux-approval.md');
  const wireframesDirectory = path.join(options.prototypeDir, 'wireframes');

  if (!fs.existsSync(manifestFile)) {
    tryWaiver(options, result);
    return result;
  }

  checkDocument(decisionFile, 'ui-ux-decision.md', result);
  let manifest;
  try {
    manifest = readJsonFile(manifestFile);
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  // Version 2 is valid Stage 6 evidence that predates the covered_by reshape. Told
  // what to change, rather than shown a bare additionalProperties error about a
  // field version 2 required.
  if (manifest.schema_version === 2) {
    result.fail([
      'screen-manifest.json is schema_version 2, whose non-visual rows carried a',
      '"requirement" and a "tests" list. A Stage 6 record cannot cite either:',
      'requirements are written at Stage 15 and tests at Stage 17, and filling them',
      'in later would change the hash a Stage 8 approval pinned.',
      'To migrate: set "schema_version": 4, add the shared UI design system',
      'under ui-design-system-guide.md, and in every',
      'non_visual_workbook_rows[].covered_by replace "requirement" and "tests" with',
      'a "coverage" statement saying how the behavior will be covered instead of by',
      'a wireframe; keep "initiating_screen". Requirement ids and test references',
      'are no longer recorded here. Before deleting them, copy them into',
      'specs/traceability.md under Imported Legacy References, preserving source',
      'revision/digest, export set, workbook revision, row and original values.',
      'Keep raw imports fenced and unverified until Stage 15 reconciles requirements',
      'and Stage 17 reconciles tests; do not count imports as coverage.',
      'An approved export set needs re-approval afterwards, because the manifest',
      'hash changes. See analysis/prototyping/README.md.',
    ].join(' '));
    return result;
  }
  // A version-1 manifest predates screen normalization. Reporting it as an
  // enum mismatch would send the reader hunting; say what changed and what to
  // do instead.
  if (manifest.schema_version === 1) {
    result.fail([
      'screen-manifest.json is schema_version 1, which predates screen normalization.',
      'To migrate: add "schema_version": 4 and the shared UI design system',
      'under ui-design-system-guide.md; add "normalization":',
      '"analysis/prototyping/screen-normalization.json" and write that record,',
      'classifying every governed row as surface, state, action, overlay,',
      'navigation or non-visual; add "normalization_sha256" with that record\'s',
      'SHA-256; give every screen a "surface_key" of channel + route family +',
      'primary user task + stable layout, merging any two screens that end up',
      'sharing one; add "workbook_rows_sha256", the digest of every governed row',
      'this record classifies or excludes - run this tool with',
      '--governed-rows-digest to read the value; give every non-visual row a',
      '"covered_by" record holding a "coverage" statement of how it will be',
      'covered instead - and remove any "requirement" or "tests" a version-1 record',
      'carried there, which version 3 rejects - copying real values first into',
      'specs/traceability.md under Imported Legacy References with their source',
      'revision and an unverified disposition; do not create a separate handoff; give',
      'every target-only screen a "target_decision" naming its owner decision.',
      'An improvement that is one element of an otherwise faithful screen goes in',
      '"target_only_elements" instead: an entry per element, each naming an element',
      'the screen already declares in its states, actions, overlays or navigation,',
      'and a "target_decision" that is approved and in scope. Use it when the owner',
      'has approved an addition the legacy build never had - a navigation component,',
      'a confirmation it skipped - on a screen that otherwise reproduces legacy',
      'behavior and therefore cannot be marked target_only.',
      'In the normalization record, every visual row names its "screen" and',
      'repeats that screen\'s "surface_key", and a state, action, overlay or',
      'navigation row also names the "element" - which the screen must list in',
      'its states, actions, overlays or navigation array.',
      'An approved export set needs re-approval afterwards, because the manifest',
      'hash changes.',
      'See analysis/prototyping/README.md.',
    ].join(' '));
    return result;
  }
  result.merge(validateSchema(PROTOTYPE_MANIFEST_SCHEMA, manifest), 'screen-manifest.json ');
  if (!result.ok) return result;
  if (manifest.screens.length && !fs.existsSync(wireframesDirectory)) result.fail('wireframes/ directory is missing');
  const uiDesign = auditUiDesignSystem(manifest, options.prototypeDir, result);
  if (!result.ok) return result;
  // Preserve already-approved manifest bytes across the filename migration.
  // A historical pointer is valid only while both decision records are identical.
  if (manifest.decision === 'analysis/prototyping/decision.md') {
    const historicalDecision = path.join(options.prototypeDir, 'decision.md');
    let identical = false;
    try {
      identical = fs.statSync(historicalDecision).isFile() && sha256File(historicalDecision) === sha256File(decisionFile);
    } catch { /* Missing or unreadable historical evidence fails closed. */ }
    if (!identical) {
      result.fail('Historical decision.md must match ui-ux-decision.md byte-for-byte; a changed UI/UX decision requires a new manifest and the governed review/approval cycle.');
      return result;
    }
  }
  if (PLACEHOLDER.test(manifest.project) || PLACEHOLDER.test(manifest.export_set_version)) {
    result.fail('screen-manifest.json contains an unfilled project or export_set_version');
  }
  // A scope-aware gate that ignores the scope it was asked about is not
  // scope-aware. Only checked when the caller named one; the default is to audit
  // whatever the manifest declares.
  if (options.scope && manifest.scope !== options.scope) {
    result.fail(`prototype audit was asked about scope "${options.scope}" but screen-manifest.json declares "${manifest.scope}"`);
  }
  // Every identifier the three records join on. A placeholder that appears in two
  // records agrees with itself and passes every equality check, so the fields are
  // checked where they are written rather than where they are compared.
  const unfilled = (label, value) => {
    if (PLACEHOLDER.test(value)) result.fail(`screen-manifest.json leaves ${label} as an unfilled template placeholder`);
  };
  unfilled('scope', manifest.scope);
  unfilled('tool', manifest.tool);
  for (const screen of manifest.screens) {
    for (const [field, value] of [['id', screen.id], ['title', screen.title], ['channel', screen.channel]]) {
      unfilled(`screen ${field} "${value}"`, value);
    }
    for (const field of ['roles', 'states', 'actions', 'overlays', 'navigation']) {
      for (const value of screen[field] || []) unfilled(`screen "${screen.id}" ${field} entry "${value}"`, value);
    }
  }

  // "Owner-approved target surface" is only a phrase until the approval is
  // named and found. Loaded once, and only when something needs it.
  // Loaded once and shared: both target-only screens and out-of-scope rows are
  // claims about what the owner decided, and neither is free.
  let ownerDecisions;
  const readOwnerDecisions = (why) => {
    if (ownerDecisions !== undefined) return ownerDecisions;
    try {
      const status = loadAndValidateStatus(path.resolve(options.statusFile));
      ownerDecisions = new Map((status.owner_decisions || []).map((decision) => [decision.id, decision]));
    } catch (error) {
      result.fail(`${why} require readable owner decisions in migration_status.yaml: ${error.message}`);
      ownerDecisions = null;
    }
    return ownerDecisions;
  };
  const checkOwnerDecision = (id, label) => {
    const decisions = readOwnerDecisions(label);
    if (!decisions) return;
    const decision = decisions.get(id);
    if (!decision) {
      result.fail(`${label} cites owner decision "${id}", which is not in migration_status.yaml`);
    } else if (decision.decision !== 'approved') {
      result.fail(`${label} cites owner decision "${id}", which is "${decision.decision}" rather than approved`);
    } else if (decision.scope !== manifest.scope) {
      result.fail(`${label} cites owner decision "${id}", which is scoped to "${decision.scope}" rather than this manifest's scope "${manifest.scope}"`);
    }
  };

  const targetOnlyScreens = manifest.screens.filter((screen) => screen.target_only);
  if (targetOnlyScreens.length) {
    for (const screen of targetOnlyScreens) {
      if (PLACEHOLDER.test(screen.target_requirement) || screen.target_requirement.trim().length < 12) {
        result.fail(`target-only screen "${screen.id}" requires a meaningful target_requirement`);
      }
      // An approval for another scope is somebody else's approval.
      checkOwnerDecision(screen.target_decision, `target-only screen "${screen.id}"`);
    }
  }

  const screenIds = new Set();
  const surfaceKeys = new Map();
  const rowClaims = new Map();
  const claimedFiles = new Set(uiDesign.resources);
  const visualRows = new Set();
  for (const screen of manifest.screens) {
    if (screenIds.has(screen.id)) result.fail(`duplicate screen id "${screen.id}"`);
    screenIds.add(screen.id);
    // Two screens sharing a canonical surface key are the same surface, split
    // by a state or an action. This is the mechanical half of the screen
    // normalization rule: one workbook row or one user flow does not imply one
    // wireframe screen.
    const surfaceKey = String(screen.surface_key || '').trim().toLowerCase();
    // The grouping decision is the whole point of the rule; the template's own
    // words are not a grouping decision.
    if (PLACEHOLDER.test(screen.surface_key)) {
      result.fail(`screen "${screen.id}" leaves surface_key as an unfilled template placeholder`);
    }
    if (surfaceKeys.has(surfaceKey)) {
      result.fail(`screens "${surfaceKeys.get(surfaceKey)}" and "${screen.id}" share the surface key "${screen.surface_key}"; merge them into one screen with states and actions`);
    }
    surfaceKeys.set(surfaceKey, screen.id);
    for (const row of screen.workbook_rows) {
      visualRows.add(row);
      rowClaims.set(row, [...(rowClaims.get(row) || []), screen.id]);
    }
    for (const fileEntry of screen.files) {
      let absolute;
      try {
        absolute = resolveInside(options.prototypeDir, fileEntry.path, `screen ${screen.id} file path`);
      } catch (error) {
        result.fail(error.message);
        continue;
      }
      const relative = canonicalRelative(path.relative(options.prototypeDir, absolute));
      if (!relative.startsWith('wireframes/')) {
        result.fail(`screen ${screen.id} file must be inside wireframes/: ${fileEntry.path}`);
        continue;
      }
      // Export paths are compared case-insensitively, which makes them a
      // portable-filename rule rather than a filesystem check: on Windows and
      // macOS wireframes/login.png and wireframes/Login.png are one file, so an
      // exact-string comparison would let one export stand in for two screens.
      // On a case-sensitive filesystem they could be two files, and this refuses
      // them - deliberately, because an export set that only works on one
      // platform is not a durable record.
      const claimKey = relative.toLowerCase();
      if (claimedFiles.has(claimKey)) result.fail(`export ${relative} is claimed more than once`);
      claimedFiles.add(claimKey);
      // Wrapped, and a regular file is required before hashing: a directory or a
      // file that disappears between these checks should be an audit failure,
      // not a stack trace out of a gate.
      try {
        if (!fs.existsSync(absolute)) {
          result.fail(`screen ${screen.id} file does not exist: ${relative}`);
        } else if (fs.lstatSync(absolute).isSymbolicLink()) {
          result.fail(`screen ${screen.id} file must not be a symbolic link: ${relative}`);
        } else if (!fs.statSync(absolute).isFile()) {
          result.fail(`screen ${screen.id} file is not a regular file: ${relative}`);
        } else {
          const actual = sha256File(absolute);
          if (actual.toLowerCase() !== fileEntry.sha256.toLowerCase()) {
            result.fail(`screen ${screen.id} sha256 mismatch for ${relative}`);
          }
        }
      } catch (error) {
        result.fail(`screen ${screen.id} file cannot be read: ${relative}: ${error.message}`);
      }
    }
  }

  // The normalization record is what makes the many-to-one grouping
  // reviewable: without it a manifest of one-screen-per-row looks identical to
  // a properly normalized one. It is read as a coverage table, not as a list of
  // labels — each classification is checked against where the row actually
  // landed in the manifest.
  const normalization = readNormalization(options, manifest, result);
  const { rows: normalizationRows, excluded: excludedRows } = normalization;

  const workbook = await populatedWorkbookRows(options.workbookFile, result);
  const governedRows = workbook.rows;
  // Pinning the rows is what makes a row number mean something. Otherwise the
  // three records agree on "8" while the sheet has quietly redefined it. Checked
  // after the normalization record is read, since it names the governed rows.
  const nonVisualRows = new Set();
  for (const entry of manifest.non_visual_workbook_rows || []) {
    if (PLACEHOLDER.test(entry.reason) || entry.reason.trim().length < 12) {
      result.fail(`non-visual workbook row ${entry.row} requires a meaningful reason`);
    }
    if (visualRows.has(entry.row)) {
      result.fail(`workbook row ${entry.row} cannot be both visual and non-visual`);
    }
    if (nonVisualRows.has(entry.row)) {
      result.fail(`workbook row ${entry.row} is declared non-visual more than once`);
    }
    // The coverage statement is held to the same standard as the reason: the
    // template's own words are not an answer, and neither is a token. It is prose,
    // so the audit can check that something was written and not that it is true -
    // which is why the README lists the latter as the reviewer's.
    if (entry.covered_by) {
      const { coverage } = entry.covered_by;
      if (PLACEHOLDER.test(coverage)) {
        result.fail(`non-visual workbook row ${entry.row} leaves covered_by.coverage as an unfilled template placeholder`);
      } else if (String(coverage).trim().split(/\s+/).filter((word) => (word.match(/\p{L}/gu) || []).length >= 3).length < 3) {
        // Three words of at least three letters each. A character threshold
        // rejected "Covered by unit tests." while passing a long meaningless
        // token; a plain word count passed "x x x x" and "---- ---- ---- ----".
        // This admits "Service contract tests." and refuses all of those.
        //
        // It is a shape check and nothing more. Whether the sentence is true, or
        // is the same boilerplate as the row above, only a reader can say - which
        // is why the message and the README both stop at "words".
        result.fail(`non-visual workbook row ${entry.row} needs a covered_by.coverage of at least three words, not "${coverage}"`);
      }
    }
    const initiating = entry.covered_by && entry.covered_by.initiating_screen;
    if (initiating !== undefined && initiating !== null) {
      if (!isNonEmptyString(initiating)) {
        result.fail(`non-visual workbook row ${entry.row} has an empty initiating_screen; use null when nothing triggers it`);
      } else if (!screenIds.has(initiating)) {
        result.fail(`non-visual workbook row ${entry.row} names initiating screen "${initiating}", which is not in the manifest`);
      }
    }
    nonVisualRows.add(entry.row);
  }

  // An empty catalogue is legitimate only when there is nothing to draw.
  if (!manifest.screens.length) {
    const drawable = [...governedRows].filter((row) => !nonVisualRows.has(row) && !excludedRows.has(row));
    if (drawable.length) {
      result.fail(`screen-manifest.json declares no screens while ${drawable.length} governed row(s) are neither non-visual nor excluded (first: ${drawable[0]})`);
    }
  }

  // The pin covers every governed row: what the catalogue classifies and what
  // it excludes.
  if (workbook.read) {
    const pinned = [...governedRows];
    const actual = governedRowsDigest(workbook.cells, pinned);
    if (manifest.workbook_rows_sha256.toLowerCase() !== actual) {
      result.fail(`governed workbook rows sha256 mismatch: manifest records ${manifest.workbook_rows_sha256}, the ${pinned.length} row(s) it governs hash to ${actual}; a row the catalogue classifies may no longer say what it said`);
    }
  }

  // Coverage is exactly-once, as the methodology states. A Set alone hides a
  // row claimed by two screens, which is how a split surface stays invisible.
  for (const [row, ids] of rowClaims) {
    if (ids.length > 1) {
      result.fail(`workbook row ${row} is claimed by more than one screen (${ids.join(', ')}); a row belongs to exactly one screen`);
    }
  }

  for (const row of governedRows) {
    const classification = normalizationRows.get(row);
    const excludedRecord = excludedRows.get(row);
    if (excludedRecord) {
      if (visualRows.has(row) || nonVisualRows.has(row)) {
        result.fail(`workbook row ${row} is excluded as do-not-port but is still claimed in the manifest`);
      }
      continue;
    }
    if (!classification) {
      result.fail(`populated workbook row ${row} is not classified in the normalization record and is not recorded as an excluded do-not-port row`);
      continue;
    }
    // Classification and placement must agree. Either check alone passes a
    // manifest that says one thing and does another.
    if (classification === 'non-visual') {
      if (!nonVisualRows.has(row)) {
        result.fail(`workbook row ${row} is classified non-visual but is not declared in non_visual_workbook_rows`);
      }
    } else if (!visualRows.has(row)) {
      result.fail(`workbook row ${row} is classified ${classification} but no screen claims it`);
    }
  }

  // Guarded on whether the workbook was read, not on whether it had rows. An
  // empty-but-valid workbook is a legitimate state — a scope of only
  // target-only screens — and it must still reject invented row numbers.
  if (workbook.read) {
    for (const row of [...visualRows, ...nonVisualRows]) {
      if (!governedRows.has(row)) {
        result.fail(`prototype manifest references non-scenario workbook row ${row}`);
      }
    }
    for (const row of [...normalizationRows.keys(), ...excludedRows.keys()]) {
      if (!governedRows.has(row)) {
        result.fail(`normalization record classifies workbook row ${row}, which is not a populated scenario row`);
      }
    }
  }

  // A classification is a claim about where the row landed. Checking only that
  // the named screen exists leaves the substance unchecked: a row can call
  // itself an action of a screen that lists no such action.
  const ELEMENT_FIELD = { state: 'states', action: 'actions', overlay: 'overlays', navigation: 'navigation' };
  const screensById = new Map(manifest.screens.map((screen) => [screen.id, screen]));
  // Which (kind, element) pairs a workbook row accounted for. Keyed by kind, so a
  // label appearing in two fields is not mistaken for one element. Used only to
  // refuse a target-only claim that a row directly contradicts.
  const claimedElements = new Map(manifest.screens.map((screen) => [screen.id, new Set()]));
  for (const [row, entry] of normalization.entries) {
    if (entry.classification === 'non-visual') {
      if (entry.screen || entry.surface_key || entry.element) {
        result.fail(`normalization row ${row} is non-visual and must not name a screen, surface key or element`);
      }
      continue;
    }
    if (!entry.screen) {
      result.fail(`normalization row ${row} is classified ${entry.classification} and must name the screen it belongs to`);
      continue;
    }
    const screen = screensById.get(entry.screen);
    if (!screen) {
      result.fail(`normalization row ${row} names screen "${entry.screen}", which is not in the manifest`);
      continue;
    }
    if (!(rowClaims.get(row) || []).includes(entry.screen)) {
      result.fail(`normalization row ${row} names screen "${entry.screen}", but that screen does not claim the row`);
    }
    // The surface key is the grouping decision. Recorded in two places, it must
    // say the same thing in both, or the record and the catalogue have drifted.
    if (!entry.surface_key) {
      result.fail(`normalization row ${row} must carry the surface key of screen "${entry.screen}"`);
    } else if (PLACEHOLDER.test(entry.surface_key)) {
      result.fail(`normalization row ${row} leaves surface_key as an unfilled template placeholder`);
    } else if (entry.surface_key.trim().toLowerCase() !== String(screen.surface_key).trim().toLowerCase()) {
      result.fail(`normalization row ${row} records surface key "${entry.surface_key}", but screen "${entry.screen}" carries "${screen.surface_key}"`);
    }
    const field = ELEMENT_FIELD[entry.classification];
    if (!field) {
      // A surface is not an element of anything. Carrying one says the row both
      // is and is not a standalone screen.
      if (entry.element) {
        result.fail(`normalization row ${row} is classified ${entry.classification} and must not name an element`);
      }
      continue;
    }
    if (!entry.element) {
      result.fail(`normalization row ${row} is classified ${entry.classification} and must name which one, in "element"`);
    } else if (!(screen[field] || []).includes(entry.element)) {
      result.fail(`normalization row ${row} names ${entry.classification} "${entry.element}", which screen "${entry.screen}" does not list in ${field}`);
    } else {
      claimedElements.get(entry.screen).add(`${entry.classification}:${entry.element}`);
    }
  }

  // A target-only element is a claim that an owner approved something the legacy
  // build never had. Both halves of that claim are checkable: the element has to be
  // one the screen actually declares, and the decision has to exist, be approved, and
  // be scoped to this manifest.
  //
  // What is deliberately *not* checked here is the reverse: that every element a
  // screen declares is either claimed by a row or declared target-only. That check was
  // written, run, and removed. As written it fails on truthful records — twenty of the
  // suite's own fixtures, starting with a login screen that declares an `error` state
  // no single row names because the whole row set implies it.
  //
  // What those twenty prove is that *equality between a row's element and a declared
  // label* is the wrong test, not that the class of defect is unreachable: with stable
  // element identifiers and explicit provenance per element, a version of this check
  // could work. It is not attempted here because element labels are currently prose
  // written for a human reviewer, so nothing mechanical separates an invented
  // navigation item from a real one — both are a sentence — and a gate that fires on
  // honest work teaches people to route around gates.
  //
  // Until then the undeclared invention is reviewed for at Stage 7, by an independent
  // agent, which is where this project's own invented sidebar was in fact found. A
  // review is a control, not a guarantee. What this record adds is that once an
  // improvement has been decided, the approval is named, checked, and re-checked on
  // every audit afterwards.
  for (const screen of manifest.screens) {
    const entries = screen.target_only_elements || [];
    if (entries.length && screen.target_only) {
      // The whole screen already has no legacy predecessor. Naming one of its
      // elements as the target-only part says the rest is not, which contradicts it.
      result.fail(`screen "${screen.id}" is target_only and must not also declare target_only_elements: the whole screen has no legacy predecessor`);
    }
    const seen = new Set();
    for (const entry of entries) {
      const key = `${entry.kind}:${entry.element}`;
      // uniqueItems compares whole objects, so two entries for one element with
      // different decisions both pass the schema and leave provenance ambiguous.
      if (seen.has(key)) {
        result.fail(`screen "${screen.id}" declares target-only ${entry.kind} "${entry.element}" more than once`);
      }
      seen.add(key);
      const field = ELEMENT_FIELD[entry.kind];
      if (!(screen[field] || []).includes(entry.element)) {
        result.fail(`screen "${screen.id}" declares target-only ${entry.kind} "${entry.element}", which it does not list in ${field}`);
      }
      // A row saying the legacy build had this element, and a record saying it has no
      // legacy predecessor, cannot both be true. Unlike the reverse-coverage check
      // this one has no false positives: it fires only on a direct contradiction.
      if ((claimedElements.get(screen.id) || new Set()).has(key)) {
        result.fail(`screen "${screen.id}" declares ${entry.kind} "${entry.element}" as target-only, but a workbook row already claims it as legacy behavior`);
      }
      if (PLACEHOLDER.test(entry.target_requirement)) {
        result.fail(`screen "${screen.id}" leaves the target_requirement of ${entry.kind} "${entry.element}" as an unfilled template placeholder`);
      }
      checkOwnerDecision(entry.target_decision, `target-only ${entry.kind} "${entry.element}" of screen "${screen.id}"`);
    }
  }

  if (!fs.existsSync(wireframesDirectory)) {
    // A scope with nothing to draw has no exports, and Git does not preserve an
    // empty directory — so demanding the directory would fail the same truthful
    // record after a clean checkout that passed before the commit. With screens
    // declared, a missing directory is still a missing catalogue.
    if (manifest.screens.length) {
      result.fail('wireframes/ directory is missing');
    }
  } else {
    for (const absolute of walkFiles(wireframesDirectory)) {
      const relative = canonicalRelative(path.relative(options.prototypeDir, absolute));
      if (fs.lstatSync(absolute).isSymbolicLink()) {
        result.fail(`wireframe export must not be a symbolic link: ${relative}`);
      } else if (!claimedFiles.has(relative.toLowerCase())) {
        result.fail(`unmanifested export: ${relative}`);
      }
    }
  }

  if (fs.existsSync(approvalFile)) {
    const approval = checkDocument(approvalFile, 'ui-ux-approval.md', result);
    if (approval) {
      const approvedVersion = approvalValue(approval, 'Approved export set version');
      const approvedManifestHash = approvalValue(approval, 'Screen manifest SHA-256');
      const expectedVersion = manifest.export_set_version;
      const expectedManifestHash = sha256File(manifestFile);
      if (approvedVersion !== expectedVersion) {
        result.fail(`ui-ux-approval.md must pin exact "${expectedVersion}"`);
      }
      if (!approvedManifestHash || approvedManifestHash.toLowerCase() !== expectedManifestHash) {
        result.fail(`ui-ux-approval.md must pin exact manifest SHA-256 ${expectedManifestHash}`);
      }
      if (!approvalValue(approval, 'Approved by')) result.fail('ui-ux-approval.md must name the approver');
      if (!approvalValue(approval, 'Date')) result.fail('ui-ux-approval.md must record the approval date');
      if (approvalValue(approval, 'Scope') !== manifest.scope) {
        result.fail(`ui-ux-approval.md must pin exact scope "${manifest.scope}"`);
      }
      // The signature alone is not the gate. Stage 8 closes on a PAIR: the owner
      // approved this exact export set, AND an independent review pass is
      // registered clean for the same set. Checking only ui-ux-approval.md let a
      // signed-but-never-cleanly-controlled set through, which the owner's own
      // independent check caught. The pass entry must itself name the export set
      // it cleared - export_set_version - so the coupling is exact rather than
      // temporal, and a later regeneration cannot inherit an old clean pass.
      if (options.requireApproval) {
        let approvalStatus = null;
        try {
          approvalStatus = parseYamlFile(path.resolve(options.statusFile));
        } catch (error) {
          result.fail(`approval cannot be verified against review passes: ${error.message}`);
        }
        if (approvalStatus) {
          // Closure semantics are the owner's Stage 7 exit criterion, shared
          // with the status validator: clean, or low-cosmetic findings
          // dispositioned in a recorded polish backlog. Blocked and unchecked
          // passes never close.
          const cleanForSet = (approvalStatus.review_passes || []).filter((pass) =>
            pass.stage === 'stage-07' && pass.export_set_version === expectedVersion
            && passClosesStage(pass));
          if (!cleanForSet.length) {
            result.fail(`Stage 8 closes on approval plus control: no closing stage-07 review pass (clean, or dispositioned low-cosmetic findings) carrying export_set_version "${expectedVersion}" is registered in migration_status.yaml`);
          }
        }
      }
    }
  } else if (options.requireApproval) {
    result.fail('ui-ux-approval.md is missing: Stage 8 owner approval is required');
  } else {
    result.warn('ui-ux-approval.md is not present; rerun with --require-approval before Stage 8 closes');
  }

  scanSecrets(options.prototypeDir, result);
  result.summary = `${manifest.screens.length} screens; ${claimedFiles.size} pinned exports`;
  return result;
}

// Prints the value workbook_rows_sha256 must carry. Run it, paste the value, then
// run the audit.
//
// Deliberately independent of the manifest and the normalization record: the
// helper has to be usable before either is correct. A project copying the
// template starts with a placeholder normalization hash, and refusing to print
// until that is right would make the advertised way of learning this value
// unusable exactly when it is needed.
async function printGovernedRowsDigest(args) {
  const prototypeDir = path.resolve(args.dir || process.env.PROTOTYPE_DIR || path.join(__dirname, '..', 'prototyping'));
  const workbookFile = path.resolve(args.workbook || process.env.WORKBOOK_FILE
    || path.join(prototypeDir, '..', 'legacy_user_flows.xlsx'));
  const result = new AuditResult('GOVERNED ROWS DIGEST');
  const workbook = await populatedWorkbookRows(workbookFile, result);
  if (!result.ok) {
    printResult(result);
    return 1;
  }
  const pinned = [...workbook.rows];
  console.log(governedRowsDigest(workbook.cells, pinned));
  console.error(`${pinned.length} governed row(s) of ${workbook.rows.size} in ${path.basename(workbookFile)}`);
  return 0;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['dir', 'status', 'scope', 'waiver-gate'], [
    'PROTOTYPE_DIR',
    'MIGRATION_STATUS_FILE',
    'PROTOTYPE_WAIVER_GATE',
    'WORKBOOK_FILE',
  ]);
  // Without this the contract is unusable: schema validation returns before the
  // workbook is read, so a project cannot learn the expected digest until it has
  // already guessed a well-formed one.
  if (args['governed-rows-digest']) {
    printGovernedRowsDigest(args).then((code) => {
      process.exitCode = code;
    }).catch((error) => {
      console.error(`FAIL: ${error.stack || error.message}`);
      process.exitCode = 1;
    });
    return;
  }
  auditPrototype({
    prototypeDir: args.dir,
    statusFile: args.status,
    scope: args.scope,
    waiverGate: args['waiver-gate'],
    requireApproval: args['require-approval'],
  }).then((result) => {
    process.exitCode = printResult(result);
  }).catch((error) => {
    console.error(`FAIL: ${error.stack || error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  PROTOTYPE_MANIFEST_SCHEMA,
  approvalValue,
  auditPrototype,
  governedRowsDigest,
  normalizationEvidenceHash,
  populatedWorkbookRows,
  scanSecrets,
};

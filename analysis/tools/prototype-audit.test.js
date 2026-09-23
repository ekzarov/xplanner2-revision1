'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');
const { writeUiFixture } = require('./ui-design-system-fixtures');
const ExcelJS = require('@excel.js/exceljs').default;
const { auditPrototype, governedRowsDigest, normalizationEvidenceHash } = require('./prototype-audit');
const {
  approvalDocument,
  sha256File,
  temporaryDirectory,
  validStatus,
  validWaiver,
  writeStatus,
} = require('./helpers');

// The default fixture is a minimal but complete normalized prototype: one
// governed workbook row, on one screen, classified once. Tests that exercise a
// rule move away from that baseline one step at a time, so a failure names the
// step rather than the fixture.
function writePrototype(directory, options = {}) {
  const wireframes = path.join(directory, 'wireframes');
  fs.mkdirSync(wireframes, { recursive: true });
  fs.writeFileSync(path.join(directory, 'ui-ux-decision.md'), [
    '# Application form and style',
    '- Approved by: project owner',
    '- Approved on: 2026-07-28',
    '- Channel: web',
    '- Style: work-focused',
    '- Palette: neutral with green and red status colors',
  ].join('\n'));

  const exportFile = path.join(wireframes, 'login.png');
  fs.writeFileSync(exportFile, Buffer.from('fixture-image'));
  const manifestFile = path.join(directory, 'screen-manifest.json');
  const normalizationFile = path.join(directory, 'screen-normalization.json');
  const workbookFile = path.join(directory, 'legacy_user_flows.xlsx');

  const writeManifest = (manifest) => {
    if (manifest.schema_version === 4) writeUiFixture(directory, manifest);
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    return manifest;
  };
  const readManifest = () => JSON.parse(fs.readFileSync(manifestFile, 'utf8'));

  // What the fixture last wrote into the sheet, so the governed-row pin can be
  // recomputed the way a project would. Tests that want a stale pin break it on
  // purpose.
  let sheetCells = new Map();
  const refreshPins = () => {
    if (!fs.existsSync(manifestFile)) return;
    const manifest = readManifest();
    if (fs.existsSync(normalizationFile)) manifest.normalization_sha256 = normalizationEvidenceHash(fs.readFileSync(normalizationFile));
    manifest.workbook_rows_sha256 = governedRowsDigest(sheetCells, [...sheetCells.keys()]);
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  };

  const writeNormalization = (rows, extra = {}) => {
    fs.writeFileSync(normalizationFile, JSON.stringify({ rows, ...extra }, null, 2));
    refreshPins();
  };

  // cells: [rowNumber, column1, column3]. A row whose first column matches
  // UF-\d+ opens an epic and is not itself a governed row.
  const writeWorkbook = async (cells) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('User Flows');
    sheetCells = new Map();
    let insideEpic = false;
    let epicRow = null;
    let epicValues = [];
    for (const [rowNumber, first, third] of cells) {
      if (first) sheet.getRow(rowNumber).getCell(1).value = first;
      if (third) sheet.getRow(rowNumber).getCell(3).value = third;
      const values = Array.from({ length: 14 }, (unused, index) => {
        if (index === 0) return String(first || '');
        if (index === 2) return String(third || '');
        return '';
      });
      if (/^UF-\d+/.test(values[0])) {
        insideEpic = true;
        epicRow = rowNumber;
        epicValues = values;
      } else if (insideEpic) {
        sheetCells.set(rowNumber, { values, epicRow, epic: epicValues });
      }
    }
    await workbook.xlsx.writeFile(workbookFile);
    refreshPins();
  };

  const addScreen = (screen) => {
    const file = path.join(wireframes, `${screen.id}.png`);
    fs.writeFileSync(file, Buffer.from(`fixture-image-${screen.id}`));
    const manifest = readManifest();
    manifest.screens.push({
      roles: ['operator'],
      states: ['default'],
      channel: 'web',
      ...screen,
      files: [{ path: `wireframes/${screen.id}.png`, sha256: sha256File(file) }],
    });
    writeManifest(manifest);
  };

  writeManifest({
    schema_version: 4,
    project: 'fixture',
    scope: 'fixture-scope',
    tool: 'figma',
    export_set_version: 'prototype-v1',
    decision: 'analysis/prototyping/ui-ux-decision.md',
    normalization: 'analysis/prototyping/screen-normalization.json',
    screens: [{
      id: 'login',
      title: 'Login',
      channel: 'web',
      surface_key: 'web + /login + sign in + centred card',
      roles: ['operator'],
      states: ['default', 'error'],
      workbook_rows: [8],
      files: [{ path: 'wireframes/login.png', sha256: sha256File(exportFile) }],
    }],
  });
  writeNormalization([{ row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' }]);

  // Written after the workbook, because the workbook pin lives in the manifest
  // and the approval pins the manifest.
  const writeApproval = () => fs.writeFileSync(path.join(directory, 'ui-ux-approval.md'), approvalDocument({
    'Approved by': 'project owner',
    Date: '2026-07-28',
    Scope: 'fixture-scope',
    'Approved export set version': 'prototype-v1',
    'Screen manifest SHA-256': sha256File(manifestFile),
  }));

  const audit = (extra = {}) => auditPrototype({ prototypeDir: directory, workbookFile, ...extra });

  return {
    exportFile,
    manifestFile,
    normalizationFile,
    workbookFile,
    addScreen,
    audit,
    readManifest,
    writeApproval,
    writeManifest,
    writeNormalization,
    writeWorkbook,
  };
}

// A clean stage-07 control pass, registered for the export set the fixture
// approves. The approved gate closes on the PAIR - approval plus this entry -
// so the complete approved fixture carries both.
const cleanControlPass = (exportSetVersion) => ({
  stage: 'stage-07',
  pass: 1,
  result: 'clean',
  report: 'analysis/reviews/stage-07-pass-001.md',
  reviewer: 'independent reviewer (fixture)',
  reviewer_id: 'independent-agent:fixture',
  session_id: 'fixture-stage07-pass001',
  authored_artifacts: [],
  independence_record: 'analysis/reviews/stage-07-pass-001.md',
  reviewed_at: '2026-07-28T12:00:00Z',
  scope: 'fixture-scope prototype control',
  waiver_ids: [],
  export_set_version: exportSetVersion,
});

async function completeFixture(t, options = {}) {
  const directory = temporaryDirectory(t, 'prototype-audit-');
  const fixture = writePrototype(directory, options);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  if (options.approval) {
    fixture.writeApproval();
    const statusFile = writeStatus(directory, validStatus({
      review_passes: [cleanControlPass('prototype-v1')],
    }));
    const baseAudit = fixture.audit;
    fixture.audit = (extra = {}) => baseAudit({ statusFile, ...extra });
    return { directory, fixture, statusFile };
  }
  return { directory, fixture };
}

test('passes a complete prototype record with exact approval pinning and a clean control pass', async (t) => {
  const { fixture } = await completeFixture(t, { approval: true });
  const result = await fixture.audit({ requireApproval: true });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('approval without a clean control pass for the same export set does not close Stage 8', async (t) => {
  const { directory, fixture } = await completeFixture(t, { approval: true });
  // No ledger at all: the pair cannot be verified.
  const missing = await fixture.audit({
    statusFile: path.join(directory, 'missing-status.yaml'),
    requireApproval: true,
  });
  assert.equal(missing.ok, false, 'an unverifiable approval must not pass');
  // A ledger whose clean pass names a DIFFERENT export set: the coupling is
  // exact, so an old clean pass cannot be inherited by a regenerated set.
  const staleFile = writeStatus(directory, validStatus({
    review_passes: [cleanControlPass('prototype-v0-older')],
  }));
  const stale = await fixture.audit({ statusFile: staleFile, requireApproval: true });
  assert(stale.errors.some((error) => error.includes('no closing stage-07 review pass')), stale.errors.join('\n'));
});

test('a dispositioned low-cosmetic findings pass closes the approved gate', async (t) => {
  const { directory, fixture } = await completeFixture(t, { approval: true });
  fs.writeFileSync(path.join(directory, 'ui-polish-backlog.md'), '# Polish backlog' + String.fromCharCode(10) + '## pass fixture-stage07-pass001' + String.fromCharCode(10) + '- one low cosmetic item, dispositioned.');
  const lowFile = writeStatus(directory, validStatus({
    review_passes: [{
      ...cleanControlPass('prototype-v1'),
      result: 'findings',
      findings_severity_max: 'low',
      never_cosmetic_check: 'confirmed',
      all_findings_cosmetic: 'confirmed',
      dispositioned_in: 'ui-polish-backlog.md',
    }],
  }));
  const result = await fixture.audit({ statusFile: lowFile, requireApproval: true });
  assert.equal(result.ok, true, result.errors.join(String.fromCharCode(92) + 'n'));

  // The same pass with an unchecked scope must not close anything.
  const blockedFile = writeStatus(directory, validStatus({
    review_passes: [{
      ...cleanControlPass('prototype-v1'),
      result: 'blocked',
      unchecked_scopes: ['visual render'],
    }],
  }));
  const blocked = await fixture.audit({ statusFile: blockedFile, requireApproval: true });
  assert(blocked.errors.some((error) => error.includes('no closing stage-07 review pass')), blocked.errors.join(String.fromCharCode(92) + 'n'));
});
test('the approved gate ignores the ledger when approval is not required', async (t) => {
  const { directory, fixture } = await completeFixture(t, { approval: true });
  const result = await fixture.audit({
    statusFile: path.join(directory, 'missing-status.yaml'),
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('the current approval gate rejects a historical approval.md fallback', async (t) => {
  const { directory, fixture } = await completeFixture(t, { approval: true });
  fs.renameSync(path.join(directory, 'ui-ux-approval.md'), path.join(directory, 'approval.md'));
  const result = await fixture.audit({ requireApproval: true });
  assert.equal(result.ok, false);
  assert(result.errors.some(error => error.includes('ui-ux-approval.md is missing')), result.errors.join('\n'));
});

test('a pinned legacy decision path requires an identical canonical UI/UX decision', async (t) => {
  const { directory, fixture } = await completeFixture(t, { approval: true });
  const current = path.join(directory, 'ui-ux-decision.md');
  const historical = path.join(directory, 'decision.md');
  fs.copyFileSync(current, historical);
  const manifest = fixture.readManifest();
  manifest.decision = 'analysis/prototyping/decision.md';
  fixture.writeManifest(manifest);
  fixture.writeApproval();
  const accepted = await fixture.audit({ requireApproval: true });
  assert.equal(accepted.ok, true, accepted.errors.join('\n'));
  fs.appendFileSync(current, '\nChanged current UI/UX baseline.\n');
  const divergent = await fixture.audit({ requireApproval: true });
  assert(divergent.errors.some(error => error.includes('must match ui-ux-decision.md byte-for-byte')), divergent.errors.join('\n'));
  fs.copyFileSync(historical, current);
  fs.unlinkSync(historical);
  const missing = await fixture.audit({ requireApproval: true });
  assert(missing.errors.some(error => error.includes('must match ui-ux-decision.md byte-for-byte')), missing.errors.join('\n'));
  fs.mkdirSync(historical);
  const directoryResult = await fixture.audit({ requireApproval: true });
  assert(directoryResult.errors.some(error => error.includes('must match ui-ux-decision.md byte-for-byte')), directoryResult.errors.join('\n'));
});

test('historical decision.md alone cannot replace the current UI/UX decision', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  fs.renameSync(path.join(directory, 'ui-ux-decision.md'), path.join(directory, 'decision.md'));
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  assert(result.errors.some(error => error.includes('ui-ux-decision.md')), result.errors.join('\n'));
});

test('fails when an export hash changes', async (t) => {
  const { fixture } = await completeFixture(t);
  fs.appendFileSync(fixture.exportFile, 'changed');
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('sha256 mismatch')), result.errors.join('\n'));
});

test('fails when approval does not pin the current manifest hash', async (t) => {
  const { fixture } = await completeFixture(t, { approval: true });
  const manifest = fixture.readManifest();
  manifest.export_set_version = 'prototype-v2';
  fixture.writeManifest(manifest);
  const result = await fixture.audit({ requireApproval: true });
  assert(result.errors.some((error) => error.includes('manifest SHA-256')), result.errors.join('\n'));
  assert(result.errors.some((error) => error.includes('"prototype-v2"')), result.errors.join('\n'));
});

test('skips only for a schema-valid exact scope waiver', async (t) => {
  const directory = temporaryDirectory(t, 'prototype-audit-');
  const waiverRecord = path.join(directory, 'analysis/stages/waivers/fixture-waiver.md');
  fs.mkdirSync(path.dirname(waiverRecord), { recursive: true });
  fs.writeFileSync(waiverRecord, '# Waiver\n\nExact scope and residual risk were recorded.\n');
  const statusFile = writeStatus(directory, validStatus({
    owner_decisions: [validWaiver('prototyping_retroactive', 'fixture-scope')],
  }));
  const accepted = await auditPrototype({
    prototypeDir: path.join(directory, 'absent'),
    statusFile,
    scope: 'fixture-scope',
  });
  assert.equal(accepted.ok, true, accepted.errors.join('\n'));
  assert.equal(accepted.skipped, true);

  const rejected = await auditPrototype({
    prototypeDir: path.join(directory, 'absent'),
    statusFile,
    scope: 'fixture',
  });
  assert.equal(rejected.ok, false);
});

test('rejects an incomplete waiver even when the scope text matches', async (t) => {
  const directory = temporaryDirectory(t, 'prototype-audit-');
  const status = validStatus({
    owner_decisions: [{
      id: 'waiver:prototyping_retroactive:fixture-scope',
      decision: 'approved',
      decided_by: 'project owner',
      scope: 'fixture-scope',
    }],
  });
  const result = await auditPrototype({
    prototypeDir: path.join(directory, 'absent'),
    statusFile: writeStatus(directory, status),
    scope: 'fixture-scope',
  });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('schema validation failed')));
});

test('rejects unmanifested exports and token-shaped secrets', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  fs.writeFileSync(path.join(directory, 'wireframes', 'orphan.svg'), '<svg>figd_0123456789abcdef</svg>');
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('unmanifested export')));
  assert(result.errors.some((error) => error.includes('credential material')));
});

test('populated workbook rows require screen or explicit non-visual coverage', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([
    [7, 'UF-001', null],
    [8, null, 'Login'],
    [9, null, 'Nightly settlement'],
  ]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);

  let result = await fixture.audit();
  // Specifically the coverage diagnostic: the classification-placement error
  // also mentions row 9, so a broad match would survive this check going away.
  assert(result.errors.some((error) => error.includes('workbook row 9 is classified non-visual but is not declared')),
    result.errors.join('\n'));

  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: {
      coverage: 'A nightly settlement job, proven by service tests rather than a screen.',
      initiating_screen: null,
    },
  }];
  fixture.writeManifest(manifest);
  result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('prototype manifest rejects unknown fields', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.screens[0].unreviewed = true;
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('additional properties')), result.errors.join('\n'));
});

test('rejects arbitrary prototype waiver gate overrides even with a complete prototype', async (t) => {
  const { fixture } = await completeFixture(t);
  const result = await fixture.audit({ waiverGate: 'invented_gate' });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('prototype waiver gate must be')));
});

// --- screen normalization ---------------------------------------------------

test('rejects two screens sharing a canonical surface key', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Login failed']]);
  // The classic normalization failure: an error state promoted to its own
  // screen. Same surface key, so the audit must refuse it.
  fixture.addScreen({
    id: 'login-error',
    title: 'Login (invalid credentials)',
    surface_key: 'web + /login + sign in + centred card',
    states: ['error'],
    workbook_rows: [9],
  });
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'state', screen: 'login-error', surface_key: 'web + /login + sign in + centred card', element: 'error' },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('share the surface key')), result.errors.join('\n'));
});

test('accepts two screens that are genuinely different surfaces', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Projects']]);
  fixture.addScreen({
    id: 'projects',
    title: 'Projects list',
    surface_key: 'web + /projects + browse projects + full-width table',
    states: ['default', 'empty'],
    workbook_rows: [9],
  });
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'surface', screen: 'projects', surface_key: 'web + /projects + browse projects + full-width table' },
  ]);
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('requires the normalization record to be declared and to exist', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  delete manifest.normalization;
  fixture.writeManifest(manifest);
  const undeclared = await fixture.audit();
  // Specifically the schema error. A broad match on "normalization" is also
  // satisfied by the downstream completeness message, so such a test would
  // survive the schema requirement being dropped.
  assert(undeclared.errors.some((error) => error.startsWith('screen-manifest.json ') && /normalization/.test(error)),
    undeclared.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  fs.rmSync(second.normalizationFile);
  const missing = await second.audit();
  assert(missing.errors.some((error) => error.includes('normalization record does not exist')), missing.errors.join('\n'));
});

test('rejects a classification outside the fixed vocabulary', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([{ row: 8, classification: 'page', screen: 'login', surface_key: 'web + /login + sign in + centred card' }]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('screen-normalization.json') && /classification/.test(error)),
    result.errors.join('\n'));
});

test('rejects a governed row that no classification covers', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Session expiry']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 9];
  fixture.writeManifest(manifest);
  // Row 9 is covered by the screen but never classified: the manifest looks
  // complete while the normalization step was skipped for it.
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('row 9 is not classified')), result.errors.join('\n'));
});

test('rejects the same row classified twice', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 8, classification: 'state', screen: 'login', surface_key: 'web + /login + sign in + centred card', element: 'error' },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('more than once')), result.errors.join('\n'));
});

test('rejects the same workbook row claimed by two screens', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.addScreen({
    id: 'projects',
    title: 'Projects list',
    surface_key: 'web + /projects + browse projects + full-width table',
    workbook_rows: [8],
  });
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('claimed by more than one screen')), result.errors.join('\n'));
});

test('rejects a classification that disagrees with where the row landed', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([{ row: 8, classification: 'non-visual' }]);
  const nonVisualButDrawn = await fixture.audit();
  assert(nonVisualButDrawn.errors.some((error) => error.includes('classified non-visual but is not declared')),
    nonVisualButDrawn.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  second.writeNormalization([{ row: 8, classification: 'surface', screen: 'nonexistent', surface_key: 'web + /login + sign in + centred card' }]);
  const unknownScreen = await second.audit();
  assert(unknownScreen.errors.some((error) => error.includes('which is not in the manifest')),
    unknownScreen.errors.join('\n'));

  const { fixture: third } = await completeFixture(t);
  await third.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Projects']]);
  third.addScreen({
    id: 'projects',
    title: 'Projects list',
    surface_key: 'web + /projects + browse projects + full-width table',
    workbook_rows: [9],
  });
  third.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'state', screen: 'login', surface_key: 'web + /login + sign in + centred card', element: 'error' },
  ]);
  const wrongScreen = await third.audit();
  assert(wrongScreen.errors.some((error) => error.includes('does not claim the row')), wrongScreen.errors.join('\n'));
});

test('a non-visual row must say what covers it instead of a wireframe', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('covered_by')), result.errors.join('\n'));
});

test('a do-not-port row is excluded on the record, not silently absent', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'WAP login']]);

  const unrecorded = await fixture.audit();
  assert(unrecorded.errors.some((error) => error.includes('row 9')), unrecorded.errors.join('\n'));

  fixture.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' }],
    { excluded_rows: [{ row: 9, finding: 'rf-011-wap-channel', reason: 'The WAP channel has never served a page.' }] },
  );
  const recorded = await fixture.audit();
  assert.equal(recorded.ok, true, recorded.errors.join('\n'));

  // Excluded and still drawn is a contradiction, not a harmless extra.
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 9];
  fixture.writeManifest(manifest);
  const contradicted = await fixture.audit();
  assert(contradicted.errors.some((error) => error.includes('excluded as do-not-port but is still claimed')),
    contradicted.errors.join('\n'));
});

test('a missing coverage workbook fails instead of vacuously passing', async (t) => {
  const { fixture } = await completeFixture(t);
  fs.rmSync(fixture.workbookFile);
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('coverage workbook does not exist')), result.errors.join('\n'));
});

test('a pre-normalization manifest is told how to migrate', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.schema_version = 1;
  delete manifest.normalization;
  delete manifest.screens[0].surface_key;
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  // Every required step must be named. A project that follows an incomplete
  // message literally just hits the next failure.
  for (const step of ['predates screen normalization', 'normalization_sha256', 'surface_key', 'covered_by', 'target_decision']) {
    assert(result.errors.some((error) => error.includes(step)), `${step}: ${result.errors.join('\n')}`);
  }
});

const KEY = 'web + /login + sign in + centred card';

test('a state classification must name a state the screen lists', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Login failed']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 9];
  fixture.writeManifest(manifest);

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'state', screen: 'login', surface_key: KEY },
  ]);
  const unnamed = await fixture.audit();
  assert(unnamed.errors.some((error) => error.includes('must name which one')), unnamed.errors.join('\n'));

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'state', screen: 'login', surface_key: KEY, element: 'stale' },
  ]);
  const unlisted = await fixture.audit();
  assert(unlisted.errors.some((error) => error.includes('does not list in states')), unlisted.errors.join('\n'));

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'state', screen: 'login', surface_key: KEY, element: 'error' },
  ]);
  const named = await fixture.audit();
  assert.equal(named.ok, true, named.errors.join('\n'));
});

test('a navigation row must name a navigation step the screen lists', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Logout']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 9];
  manifest.screens[0].navigation = ['sign out'];
  fixture.writeManifest(manifest);

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'navigation', screen: 'login', surface_key: KEY, element: 'sign out' },
  ]);
  const listed = await fixture.audit();
  assert.equal(listed.ok, true, listed.errors.join('\n'));

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'navigation', screen: 'login', surface_key: KEY, element: 'go home' },
  ]);
  const unlisted = await fixture.audit();
  assert(unlisted.errors.some((error) => error.includes('does not list in navigation')), unlisted.errors.join('\n'));
});

test('the surface key must say the same thing in the record and in the manifest', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([{ row: 8, classification: 'surface', screen: 'login' }]);
  const absent = await fixture.audit();
  assert(absent.errors.some((error) => error.includes('must carry the surface key')), absent.errors.join('\n'));

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /signin + sign in + centred card' },
  ]);
  const drifted = await fixture.audit();
  assert(drifted.errors.some((error) => error.includes('but screen "login" carries')), drifted.errors.join('\n'));
});

test('a non-visual row must not claim a screen', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'non-visual', screen: 'login' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: null },
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('must not name a screen')), result.errors.join('\n'));
});

test('an initiating screen must exist', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: 'nowhere' },
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('initiating screen "nowhere"')), result.errors.join('\n'));
});

test('rewriting the normalization record after approval invalidates it', async (t) => {
  const { fixture } = await completeFixture(t, { approval: true });
  const clean = await fixture.audit({ requireApproval: true });
  assert.equal(clean.ok, true, clean.errors.join('\n'));

  // Change a classification note and update the hash the way a project would.
  // The record is now internally consistent, so only the approval can catch it -
  // which is the chain this test exists to prove: record changed → manifest hash
  // changed → the pinned approval is stale.
  const record = JSON.parse(fs.readFileSync(fixture.normalizationFile, 'utf8'));
  record.rows[0].note = 'reworded after approval';
  fs.writeFileSync(fixture.normalizationFile, JSON.stringify(record, null, 2));
  const manifest = fixture.readManifest();
  manifest.normalization_sha256 = sha256File(fixture.normalizationFile);
  fixture.writeManifest(manifest);

  const tampered = await fixture.audit({ requireApproval: true });
  assert.equal(tampered.ok, false, 'the approval must not survive a rewritten classification');
  // The failure is the approval's, not the record's: the record and its hash
  // agree, so only the pinned manifest hash can notice. That is the chain.
  assert(tampered.errors.some((error) => error.includes('manifest SHA-256')), tampered.errors.join('\n'));
  assert(!tampered.errors.some((error) => error.includes('normalization record sha256 mismatch')),
    `the record itself is consistent; only the approval should object: ${tampered.errors.join('\n')}`);
});

test('a rewritten normalization record with a stale hash is caught even without approval', async (t) => {
  const { fixture } = await completeFixture(t);
  const record = JSON.parse(fs.readFileSync(fixture.normalizationFile, 'utf8'));
  record.rows[0].note = 'reworded without updating the hash';
  fs.writeFileSync(fixture.normalizationFile, JSON.stringify(record, null, 2));
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('normalization record sha256 mismatch')), result.errors.join('\n'));
});

test('an empty but readable workbook still rejects invented rows', async (t) => {
  const { fixture } = await completeFixture(t);
  // A valid sheet with no scenario rows: nothing is governed, so nothing may be
  // claimed either.
  await fixture.writeWorkbook([[7, 'UF-001', null]]);
  const invented = await fixture.audit();
  assert(invented.errors.some((error) => error.includes('non-scenario workbook row 8')), invented.errors.join('\n'));
});

// A target-only screen is "owner-approved", so the fixture supplies the
// approval it cites. Without it the screen is a claim about the owner that
// nothing backs.
function targetOnlyStatus(directory) {
  const record = path.join(directory, 'analysis/stages/waivers/fixture-waiver.md');
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.writeFileSync(record, '# Owner decision\n\nThe owner approved a first-run setup screen.\n');
  return writeStatus(directory, validStatus({
    owner_decisions: [{
      ...validWaiver('prototyping_retroactive', 'fixture-scope'),
      id: 'target:first-run-setup',
    }],
  }));
}

const TARGET_SCREEN = {
  target_only: true,
  target_requirement: 'Owner-approved: a first-run setup screen the legacy never had.',
  target_decision: 'target:first-run-setup',
};

test('a scope with only target-only screens needs no classified row', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null]]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [];
  Object.assign(manifest.screens[0], TARGET_SCREEN);
  fixture.writeManifest(manifest);
  fixture.writeNormalization([]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('a target-only screen must cite a decision that exists', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null]]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [];
  Object.assign(manifest.screens[0], TARGET_SCREEN, { target_decision: 'target:invented' });
  fixture.writeManifest(manifest);
  fixture.writeNormalization([]);
  const unknown = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(unknown.errors.some((error) => error.includes('which is not in migration_status.yaml')),
    unknown.errors.join('\n'));

  Object.assign(manifest.screens[0], TARGET_SCREEN);
  fixture.writeManifest(manifest);
  const absent = await fixture.audit({ statusFile: path.join(directory, 'no-status.yaml') });
  assert(absent.errors.some((error) => error.includes('require readable owner decisions')),
    absent.errors.join('\n'));
});

// An improvement is not always a whole screen. These cover the element-level record:
// that it works on a screen which also reproduces legacy behavior, that it names one
// element of one kind, that it cannot contradict a row, cannot be declared twice,
// cannot sit on a wholly target-only screen, and cannot invent its own approval.
const TARGET_ELEMENT = {
  kind: 'navigation',
  element: 'Projects',
  target_requirement: 'Owner-approved: a navigation rail the legacy build never had.',
  target_decision: 'target:first-run-setup',
};

const LOGIN_SURFACE_ROW = {
  row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card',
};

test('a legacy-backed screen may carry an owner-approved target-only element', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  manifest.screens[0].target_only_elements = [TARGET_ELEMENT];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([LOGIN_SURFACE_ROW]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('a target-only element must be listed in the array its kind names', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  // Present, but as an action rather than the navigation the entry claims. A check
  // that searched every field would accept this and approve a different element.
  manifest.screens[0].actions = ['Projects'];
  manifest.screens[0].target_only_elements = [TARGET_ELEMENT];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([LOGIN_SURFACE_ROW]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('declares target-only navigation "Projects", which it does not list in navigation')),
    result.errors.join('\n'));
});

test('a target-only element cannot contradict a workbook row that claims it', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Projects link']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  manifest.screens[0].workbook_rows = [8, 9];
  manifest.screens[0].target_only_elements = [TARGET_ELEMENT];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([
    LOGIN_SURFACE_ROW,
    { row: 9, classification: 'navigation', screen: 'login', surface_key: 'web + /login + sign in + centred card', element: 'Projects' },
  ]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('as target-only, but a workbook row already claims it as legacy behavior')),
    result.errors.join('\n'));
});

test('one element cannot be declared target-only twice', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  // Distinct objects, so the schema's uniqueItems does not see a duplicate.
  manifest.screens[0].target_only_elements = [
    TARGET_ELEMENT,
    { ...TARGET_ELEMENT, target_requirement: 'A second story about the same element.' },
  ];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([LOGIN_SURFACE_ROW]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('declares target-only navigation "Projects" more than once')),
    result.errors.join('\n'));
});

test('a wholly target-only screen must not also declare target-only elements', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null]]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [];
  manifest.screens[0].navigation = ['Projects'];
  Object.assign(manifest.screens[0], TARGET_SCREEN);
  manifest.screens[0].target_only_elements = [TARGET_ELEMENT];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('is target_only and must not also declare target_only_elements')),
    result.errors.join('\n'));
});

test('a target-only element cannot cite an approval that does not exist', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  manifest.screens[0].target_only_elements = [{ ...TARGET_ELEMENT, target_decision: 'target:never-decided' }];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([LOGIN_SURFACE_ROW]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('target-only navigation "Projects" of screen "login" cites owner decision "target:never-decided", which is not in migration_status.yaml')),
    result.errors.join('\n'));
});

test('a target-only element must say what was approved, not leave a placeholder', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  manifest.screens[0].target_only_elements = [{ ...TARGET_ELEMENT, target_requirement: '<describe the approved change>' }];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([LOGIN_SURFACE_ROW]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('leaves the target_requirement of navigation "Projects" as an unfilled template placeholder')),
    result.errors.join('\n'));
});

test('a target-only element record refuses fields outside the contract', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  manifest.screens[0].target_only_elements = [{ ...TARGET_ELEMENT, tests: ['nav.test'] }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.startsWith('screen-manifest.json ') && /target_only_elements/.test(error)),
    result.errors.join('\n'));
});

test('a target-only element record requires a kind the contract knows', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].navigation = ['Projects'];
  manifest.screens[0].target_only_elements = [{ ...TARGET_ELEMENT, kind: 'sidebar' }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.startsWith('screen-manifest.json ') && /kind/.test(error)),
    result.errors.join('\n'));
});

test('a wholly non-visual scope may declare no screens at all', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Nightly settlement']]);
  fixture.writeManifest({
    ...fixture.readManifest(),
    screens: [],
    non_visual_workbook_rows: [{
      row: 8,
      reason: 'Background batch processing has no interactive screen.',
      covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: null },
    }],
  });
  fs.rmSync(path.join(directory, 'wireframes', 'login.png'));
  fixture.writeNormalization([{ row: 8, classification: 'non-visual' }]);
  const result = await fixture.audit({ statusFile: path.join(directory, 'missing-status.yaml') });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('an empty catalogue is refused when a governed row is drawable', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  fixture.writeManifest({ ...fixture.readManifest(), screens: [] });
  fs.rmSync(path.join(directory, 'wireframes', 'login.png'));
  fixture.writeNormalization([]);
  const result = await fixture.audit({ statusFile: path.join(directory, 'missing-status.yaml') });
  assert(result.errors.some((error) => error.includes('declares no screens while 1 governed row')),
    result.errors.join('\n'));
});

test('a scope whose every row was excluded needs no classified row', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'WAP login']]);
  fixture.writeManifest({ ...fixture.readManifest(), screens: [] });
  fs.rmSync(path.join(directory, 'wireframes', 'login.png'));
  fixture.writeNormalization([], {
    excluded_rows: [{ row: 8, finding: 'rf-011-wap-channel', reason: 'The WAP channel has never served a page.' }],
  });
  const result = await fixture.audit({ statusFile: path.join(directory, 'missing-status.yaml') });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('action and overlay rows are checked against their own arrays', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Submit'], [10, null, 'Help dialog']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 9, 10];
  manifest.screens[0].actions = ['sign in'];
  manifest.screens[0].overlays = ['forgotten password'];
  fixture.writeManifest(manifest);
  const KEY = 'web + /login + sign in + centred card';

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'action', screen: 'login', surface_key: KEY, element: 'not an action' },
    { row: 10, classification: 'overlay', screen: 'login', surface_key: KEY, element: 'forgotten password' },
  ]);
  const badAction = await fixture.audit();
  assert(badAction.errors.some((error) => error.includes('does not list in actions')), badAction.errors.join('\n'));

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'action', screen: 'login', surface_key: KEY, element: 'sign in' },
    { row: 10, classification: 'overlay', screen: 'login', surface_key: KEY, element: 'not an overlay' },
  ]);
  const badOverlay = await fixture.audit();
  assert(badOverlay.errors.some((error) => error.includes('does not list in overlays')), badOverlay.errors.join('\n'));

  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'action', screen: 'login', surface_key: KEY, element: 'sign in' },
    { row: 10, classification: 'overlay', screen: 'login', surface_key: KEY, element: 'forgotten password' },
  ]);
  const good = await fixture.audit();
  assert.equal(good.ok, true, good.errors.join('\n'));
});

test('a non-visual row may not carry a surface key or an element either', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: null },
  }];
  fixture.writeManifest(manifest);
  const KEY = 'web + /login + sign in + centred card';

  for (const extra of [{ surface_key: KEY }, { element: 'error' }]) {
    fixture.writeNormalization([
      { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
      { row: 9, classification: 'non-visual', ...extra },
    ]);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.includes('must not name a screen, surface key or element')),
      `${Object.keys(extra)[0]}: ${result.errors.join('\n')}`);
  }
});

test('the same row cannot be both classified and excluded, or non-visual twice', async (t) => {
  const { fixture } = await completeFixture(t);
  const KEY = 'web + /login + sign in + centred card';
  fixture.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: KEY }],
    { excluded_rows: [{ row: 8, finding: 'rf-001', reason: 'Contradicts the classification above.' }] },
  );
  const both = await fixture.audit();
  assert(both.errors.some((error) => error.includes('both classified and excluded')), both.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  await second.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  second.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = second.readManifest();
  const entry = {
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: null },
  };
  manifest.non_visual_workbook_rows = [entry, { ...entry, reason: 'Declared a second time with other words.' }];
  second.writeManifest(manifest);
  const twice = await second.audit();
  assert(twice.errors.some((error) => error.includes('declared non-visual more than once')), twice.errors.join('\n'));
});

test('an empty initiating_screen is refused; null is how you say nothing triggers it', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: '' },
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('empty initiating_screen')), result.errors.join('\n'));
});

test('a missing normalization hash is refused', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  delete manifest.normalization_sha256;
  fixture.writeManifest(manifest);
  const absent = await fixture.audit();
  assert(absent.errors.some((error) => error.startsWith('screen-manifest.json ') && /normalization_sha256/.test(error)),
    absent.errors.join('\n'));
});

test('an unreadable workbook and a wrong sheet name both fail closed', async (t) => {
  const { fixture } = await completeFixture(t);
  fs.writeFileSync(fixture.workbookFile, 'not a spreadsheet');
  const unreadable = await fixture.audit();
  assert(unreadable.errors.some((error) => error.includes('cannot read prototype coverage workbook')),
    unreadable.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet('Sheet1').getRow(7).getCell(1).value = 'UF-001';
  await workbook.xlsx.writeFile(second.workbookFile);
  const wrongSheet = await second.audit();
  assert(wrongSheet.errors.some((error) => error.includes('missing canonical "User Flows" sheet')),
    wrongSheet.errors.join('\n'));
});

const KEY4 = 'web + /login + sign in + centred card';

test('a surface row must not also claim an element', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY4, element: 'error' },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('must not name an element')), result.errors.join('\n'));
});

test('a target decision must be approved and belong to this scope', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null]]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [];
  Object.assign(manifest.screens[0], TARGET_SCREEN);
  fixture.writeManifest(manifest);
  fixture.writeNormalization([]);

  const record = path.join(directory, 'analysis/stages/waivers/fixture-waiver.md');
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.writeFileSync(record, '# Owner decision\n\nThe owner considered a first-run setup screen.\n');

  const rejected = writeStatus(directory, validStatus({
    owner_decisions: [{
      ...validWaiver('prototyping_retroactive', 'fixture-scope'),
      id: 'target:first-run-setup',
      decision: 'rejected',
    }],
  }));
  const unapproved = await fixture.audit({ statusFile: rejected });
  assert(unapproved.errors.some((error) => error.includes('rather than approved')), unapproved.errors.join('\n'));

  // Approved, but for a different scope: somebody else's approval.
  const otherScope = writeStatus(directory, validStatus({
    owner_decisions: [{
      ...validWaiver('prototyping_retroactive', 'other-scope'),
      id: 'target:first-run-setup',
    }],
  }));
  const mismatched = await fixture.audit({ statusFile: otherScope, scope: 'fixture-scope' });
  assert(mismatched.errors.some((error) => error.includes('scoped to "other-scope"')), mismatched.errors.join('\n'));
});

test('a malformed normalization hash is refused, not only a missing one', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.normalization_sha256 = 'not-a-hash';
  fixture.writeManifest(manifest);
  const malformed = await fixture.audit();
  assert(malformed.errors.some((error) => error.startsWith('screen-manifest.json ') && /normalization_sha256/.test(error)),
    malformed.errors.join('\n'));

  // Well-formed but wrong: the shape passes the schema, the value does not
  // match the file.
  manifest.normalization_sha256 = 'a'.repeat(64);
  fixture.writeManifest(manifest);
  const wrong = await fixture.audit();
  assert(wrong.errors.some((error) => error.includes('normalization record sha256 mismatch')), wrong.errors.join('\n'));
});

test('a screen without a surface key is refused', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  delete manifest.screens[0].surface_key;
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.startsWith('screen-manifest.json ') && /surface_key/.test(error)),
    result.errors.join('\n'));
});

test('covered_by must carry a coverage statement of at least three words', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY4 },
    { row: 9, classification: 'non-visual' },
  ]);
  const base = {
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
  };
  const write = (covered) => {
    const manifest = fixture.readManifest();
    manifest.non_visual_workbook_rows = [{ ...base, covered_by: covered }];
    fixture.writeManifest(manifest);
  };

  // Missing or empty: a schema failure.
  for (const covered of [{ initiating_screen: null }, { coverage: '' }]) {
    write(covered);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.startsWith('screen-manifest.json ')),
      `${JSON.stringify(covered)}: ${result.errors.join('\n')}`);
  }

  // Present but saying nothing. "x" satisfied the old shape, which is what made
  // the mandatory field worthless.
  write({ coverage: 'x' });
  const token = await fixture.audit();
  assert(token.errors.some((error) => error.includes('at least three words')),
    token.errors.join('\n'));

  // Requirement ids and test names are not accepted here at all: they belong to
  // Stage 15 and Stage 17, in their own artifacts, so nothing later has to reach
  // into a manifest that Stage 8 has already pinned.
  write({ coverage: 'A nightly settlement job, proven by service tests.', requirement: 'REQ-batch' });
  const stray = await fixture.audit();
  assert(stray.errors.some((error) => error.includes('additional properties')), stray.errors.join('\n'));

  write({ coverage: 'A nightly settlement job, proven by service tests rather than a screen.' });
  const good = await fixture.audit();
  assert.equal(good.ok, true, good.errors.join('\n'));
});

test('a normalization record that is not valid JSON, or has no rows, is refused', async (t) => {
  const { fixture } = await completeFixture(t);
  fs.writeFileSync(fixture.normalizationFile, '{ not json');
  const manifest = fixture.readManifest();
  manifest.normalization_sha256 = sha256File(fixture.normalizationFile);
  fixture.writeManifest(manifest);
  const broken = await fixture.audit();
  assert(broken.errors.some((error) => error.includes('normalization record is not valid JSON')), broken.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  fs.writeFileSync(second.normalizationFile, JSON.stringify({ excluded_rows: [] }, null, 2));
  const withoutRows = second.readManifest();
  withoutRows.normalization_sha256 = sha256File(second.normalizationFile);
  second.writeManifest(withoutRows);
  const noRows = await second.audit();
  assert(noRows.errors.some((error) => error.startsWith('screen-normalization.json ')), noRows.errors.join('\n'));
});

test('a workbook row before the first epic is refused', async (t) => {
  const { fixture } = await completeFixture(t);
  // Row 7 carries a scenario but no epic has opened yet: the sheet is
  // malformed, and a malformed sheet must not be read as "no governed rows".
  await fixture.writeWorkbook([[7, null, 'Login'], [8, 'UF-001', null]]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('appears before the first epic')), result.errors.join('\n'));
});

const KEY5 = 'web + /login + sign in + centred card';

test('unfilled template placeholders are not evidence', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY5 },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: {
      coverage: '<how this behavior will be covered instead of by a screen>',
      initiating_screen: null,
    },
  }];
  fixture.writeManifest(manifest);
  const copied = await fixture.audit();
  assert(copied.errors.some((error) => error.includes('covered_by.coverage as an unfilled template placeholder')),
    copied.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  await second.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'WAP login']]);
  second.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: KEY5 }],
    { excluded_rows: [{ row: 9, finding: '<Stage 4 finding id that decided do-not-port>', reason: 'The WAP channel has never served a page.' }] },
  );
  const cited = await second.audit();
  assert(cited.errors.some((error) => error.includes('leaves finding as an unfilled template placeholder')),
    cited.errors.join('\n'));
});

test('a target_requirement that says nothing is refused', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null]]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [];
  Object.assign(manifest.screens[0], TARGET_SCREEN, { target_requirement: 'x' });
  fixture.writeManifest(manifest);
  fixture.writeNormalization([]);
  const result = await fixture.audit({ statusFile: targetOnlyStatus(directory) });
  assert(result.errors.some((error) => error.includes('requires a meaningful target_requirement')),
    result.errors.join('\n'));
});

test('the normalization record alone cannot reference a row the workbook lacks', async (t) => {
  const { fixture } = await completeFixture(t);
  // The manifest claims only real rows; the invented row exists solely in the
  // record, so only the normalization-side rule can catch it.
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login']]);
  fixture.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: KEY5 }],
    { excluded_rows: [{ row: 99, finding: 'rf-011-wap-channel', reason: 'A row number that is not in the sheet at all.' }] },
  );
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('classifies workbook row 99, which is not a populated scenario row')),
    result.errors.join('\n'));
});

test('a visual classification that names no screen is refused', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([{ row: 8, classification: 'surface', surface_key: KEY5 }]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('must name the screen it belongs to')), result.errors.join('\n'));
});

test('an unreadable normalization path is a diagnostic, not a crash', async (t) => {
  const { fixture } = await completeFixture(t);
  fs.rmSync(fixture.normalizationFile);
  // A directory where the record should be: sha256File cannot hash it.
  fs.mkdirSync(fixture.normalizationFile);
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('cannot read normalization record')), result.errors.join('\n'));
});

test('the normalization path is pinned to its canonical location', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.normalization = 'analysis/prototyping/somewhere-else.json';
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.startsWith('screen-manifest.json ') && /normalization/.test(error)),
    result.errors.join('\n'));
});

const KEY6 = 'web + /login + sign in + centred card';
const KEY_PLACEHOLDER = '<channel + route family + primary user task + stable layout>';

test('an unfilled surface_key placeholder is not a grouping decision', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.screens[0].surface_key = KEY_PLACEHOLDER;
  fixture.writeManifest(manifest);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY_PLACEHOLDER },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('screen "login" leaves surface_key as an unfilled template placeholder')),
    result.errors.join('\n'));
  assert(result.errors.some((error) => error.includes('normalization row 8 leaves surface_key as an unfilled template placeholder')),
    result.errors.join('\n'));
});

test('surface key comparison ignores case and outer whitespace, as documented', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: `  WEB + /Login + Sign In + Centred Card  ` },
  ]);
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('an uppercase normalization hash is accepted, matching the schema', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.normalization_sha256 = manifest.normalization_sha256.toUpperCase();
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('a placeholder exclusion reason is refused as well as a placeholder finding', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'WAP login']]);
  fixture.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: KEY6 }],
    { excluded_rows: [{ row: 9, finding: 'rf-011-wap-channel', reason: '<the decision in one sentence>' }] },
  );
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('leaves reason as an unfilled template placeholder')),
    result.errors.join('\n'));
});

test('two screens cannot share an id', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Projects']]);
  fixture.addScreen({
    id: 'login',
    title: 'Login again',
    surface_key: 'web + /projects + browse projects + full-width table',
    workbook_rows: [9],
  });
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('duplicate screen id "login"')), result.errors.join('\n'));
});

test('a row cannot be both drawn and declared non-visual', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 8,
    reason: 'Claimed as non-visual while a screen also draws it.',
    covered_by: { coverage: 'Sign-in enforcement, covered by security tests rather than a screen.', initiating_screen: null },
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('cannot be both visual and non-visual')), result.errors.join('\n'));
});

test('covered_by rejects empty strings, not only missing fields', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY6 },
    { row: 9, classification: 'non-visual' },
  ]);
  for (const covered of [
    { coverage: '' },
    { coverage: '   ' },
  ]) {
    const manifest = fixture.readManifest();
    manifest.non_visual_workbook_rows = [{
      row: 9,
      reason: 'Background batch processing has no interactive screen.',
      covered_by: covered,
    }];
    fixture.writeManifest(manifest);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.startsWith('screen-manifest.json ')),
      `${JSON.stringify(covered)}: ${result.errors.join('\n')}`);
  }
});

test('the shipped templates use row numbers a project can actually have', async (t) => {
  // Row 7 is where the scan starts and is the epic header, so an example that
  // classifies row 7 sends every project straight into "not a populated
  // scenario row".
  const templates = path.join(__dirname, '..', 'prototyping', 'templates');
  const manifest = JSON.parse(fs.readFileSync(path.join(templates, 'screen-manifest.example.json'), 'utf8'));
  const normalization = JSON.parse(fs.readFileSync(path.join(templates, 'screen-normalization.example.json'), 'utf8'));
  const claimed = [
    ...manifest.screens.flatMap((screen) => screen.workbook_rows),
    ...(manifest.non_visual_workbook_rows || []).map((entry) => entry.row),
    ...normalization.rows.map((entry) => entry.row),
    ...(normalization.excluded_rows || []).map((entry) => entry.row),
  ];
  for (const row of claimed) {
    assert(row >= 8, `template row ${row} can never be a governed scenario row`);
  }
  // And the two templates must agree with each other, or a project that copies
  // both starts from a contradiction.
  const visual = new Set(manifest.screens.flatMap((screen) => screen.workbook_rows));
  const nonVisual = new Set((manifest.non_visual_workbook_rows || []).map((entry) => entry.row));
  for (const entry of normalization.rows) {
    const where = entry.classification === 'non-visual' ? nonVisual : visual;
    assert(where.has(entry.row), `template normalization row ${entry.row} is not claimed in the manifest example`);
  }
});

const KEY7 = 'web + /login + sign in + centred card';

test('a zero-screen prototype survives a checkout that drops empty directories', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Nightly settlement']]);
  fixture.writeManifest({
    ...fixture.readManifest(),
    screens: [],
    non_visual_workbook_rows: [{
      row: 8,
      reason: 'Background batch processing has no interactive screen.',
      covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: null },
    }],
  });
  fixture.writeNormalization([{ row: 8, classification: 'non-visual' }]);
  // Git does not track an empty directory, so this is the state a clean
  // checkout of a truthful zero-screen record actually produces.
  fs.rmSync(path.join(directory, 'wireframes'), { recursive: true });
  const result = await fixture.audit({ statusFile: path.join(directory, 'missing-status.yaml') });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('a prototype with screens still needs its wireframes directory', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  fs.rmSync(path.join(directory, 'wireframes'), { recursive: true });
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('wireframes/ directory is missing')), result.errors.join('\n'));
});

test('two screens sharing a surface key in different letter case are still one surface', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Login failed']]);
  fixture.addScreen({
    id: 'login-error',
    title: 'Login (invalid credentials)',
    surface_key: '  WEB + /Login + Sign In + Centred Card  ',
    states: ['error'],
    workbook_rows: [9],
  });
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY7 },
    { row: 9, classification: 'state', screen: 'login-error', surface_key: KEY7, element: 'error' },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('share the surface key')), result.errors.join('\n'));
});

test('a screen cannot list the same workbook row twice, and covered_by takes no test list', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 8];
  fixture.writeManifest(manifest);
  const repeatedRow = await fixture.audit();
  assert(repeatedRow.errors.some((error) => error.startsWith('screen-manifest.json ')), repeatedRow.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  await second.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  second.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY7 },
    { row: 9, classification: 'non-visual' },
  ]);
  const withStrayField = second.readManifest();
  withStrayField.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: {
      coverage: 'A nightly settlement job, proven by service tests rather than a screen.',
      // Stage 17 data must not live in a manifest Stage 8 has pinned.
      tests: ['batch.test'],
      initiating_screen: null,
    },
  }];
  second.writeManifest(withStrayField);
  const stray = await second.audit();
  assert(stray.errors.some((error) => error.includes('additional properties')), stray.errors.join('\n'));
});

test('a non-visual row must not claim a screen, a key or an element - each of the three', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'A nightly settlement job, proven by service tests rather than a screen.', initiating_screen: null },
  }];
  fixture.writeManifest(manifest);

  for (const extra of [{ screen: 'login' }, { surface_key: KEY7 }, { element: 'error' }]) {
    fixture.writeNormalization([
      { row: 8, classification: 'surface', screen: 'login', surface_key: KEY7 },
      { row: 9, classification: 'non-visual', ...extra },
    ]);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.includes('must not name a screen, surface key or element')),
      `${Object.keys(extra)[0]}: ${result.errors.join('\n')}`);
  }
});

test('the migration message names the normalization entry requirements too', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.schema_version = 1;
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  for (const step of ['names its "screen"', 'surface_key', 'element', 'navigation']) {
    assert(result.errors.some((error) => error.includes(step)), `${step}: ${result.errors.join('\n')}`);
  }
});

const KEY8 = 'web + /login + sign in + centred card';

test('an audit asked about one scope refuses a manifest declaring another', async (t) => {
  const { fixture } = await completeFixture(t);
  const result = await fixture.audit({ scope: 'another-scope' });
  assert(result.errors.some((error) => error.includes('was asked about scope "another-scope"')), result.errors.join('\n'));

  const matching = await fixture.audit({ scope: 'fixture-scope' });
  assert.equal(matching.ok, true, matching.errors.join('\n'));
});

test('placeholders are refused in every identifier the three records join on', async (t) => {
  const cases = [
    ['scope', (manifest) => { manifest.scope = '<project or feature identifier>'; }, 'leaves scope'],
    ['tool', (manifest) => { manifest.tool = '<design tool>'; }, 'leaves tool'],
    ['screen title', (manifest) => { manifest.screens[0].title = '<screen title>'; }, 'screen title'],
    ['screen channel', (manifest) => { manifest.screens[0].channel = '<web, mobile, desktop, or terminal>'; }, 'screen channel'],
    ['roles', (manifest) => { manifest.screens[0].roles = ['<role>']; }, 'roles entry'],
    ['states', (manifest) => { manifest.screens[0].states = ['<state>']; }, 'states entry'],
  ];
  for (const [label, mutate, expected] of cases) {
    const { fixture } = await completeFixture(t);
    const manifest = fixture.readManifest();
    mutate(manifest);
    fixture.writeManifest(manifest);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.includes(expected)), `${label}: ${result.errors.join('\n')}`);
  }
});

test('an action placeholder matching itself in both records is still unfilled', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Submit']]);
  const manifest = fixture.readManifest();
  manifest.screens[0].workbook_rows = [8, 9];
  // The placeholder is identical in both places, so membership agrees; that is
  // exactly why equality alone is not enough.
  manifest.screens[0].actions = ['<action performed within this screen, e.g. save, delete>'];
  fixture.writeManifest(manifest);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY8 },
    { row: 9, classification: 'action', screen: 'login', surface_key: KEY8, element: '<action performed within this screen, e.g. save, delete>' },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('actions entry')), result.errors.join('\n'));
  assert(result.errors.some((error) => error.includes('normalization row 9 leaves element')), result.errors.join('\n'));
});

test('a placeholder screen reference is refused', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: '<screen id from screen-manifest.json>', surface_key: KEY8 },
  ]);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('normalization row 8 leaves screen')), result.errors.join('\n'));
});

test('a row cannot be excluded twice, nor excluded and declared non-visual', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'WAP login']]);
  fixture.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: KEY8 }],
    {
      excluded_rows: [
        { row: 9, finding: 'rf-011-wap-channel', reason: 'The WAP channel has never served a page.' },
        { row: 9, finding: 'rf-011-wap-channel', reason: 'Recorded a second time with other words.' },
      ],
    },
  );
  const twice = await fixture.audit();
  assert(twice.errors.some((error) => error.includes('excluded more than once')), twice.errors.join('\n'));

  const { fixture: second } = await completeFixture(t);
  await second.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'WAP login']]);
  second.writeNormalization(
    [{ row: 8, classification: 'surface', screen: 'login', surface_key: KEY8 }],
    { excluded_rows: [{ row: 9, finding: 'rf-011-wap-channel', reason: 'The WAP channel has never served a page.' }] },
  );
  const manifest = second.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Declared non-visual while also excluded as do-not-port.',
    covered_by: { coverage: 'The WAP channel behaviour, covered by service tests rather than a screen.', initiating_screen: null },
  }];
  second.writeManifest(manifest);
  const contradicted = await second.audit();
  assert(contradicted.errors.some((error) => error.includes('excluded as do-not-port but is still claimed')),
    contradicted.errors.join('\n'));
});

const KEY9 = 'web + /login + sign in + centred card';

test('the workbook is pinned, so a row cannot quietly change meaning', async (t) => {
  const { fixture } = await completeFixture(t, { approval: true });
  const clean = await fixture.audit({ requireApproval: true });
  assert.equal(clean.ok, true, clean.errors.join('\n'));

  // Row 8 stops being "Login" and becomes something else. Same row number, same
  // populated-row set, so every cross-check still agrees on 8 - and without the
  // pin the audit and the approval would both still pass.
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Flows');
  sheet.getRow(7).getCell(1).value = 'UF-001';
  sheet.getRow(8).getCell(3).value = 'Delete account';
  await workbook.xlsx.writeFile(fixture.workbookFile);

  const drifted = await fixture.audit({ requireApproval: true });
  assert.equal(drifted.ok, false);
  assert(drifted.errors.some((error) => error.includes('governed workbook rows sha256 mismatch')), drifted.errors.join('\n'));
});





test('placeholders are refused in screen ids, overlays and navigation too', async (t) => {
  const cases = [
    ['id', (manifest) => { manifest.screens[0].id = '<stable screen id>'; }, 'screen id'],
    ['overlays', (manifest) => { manifest.screens[0].overlays = ['<dialog, drawer or overlay opened from this screen>']; }, 'overlays entry'],
    ['navigation', (manifest) => { manifest.screens[0].navigation = ['<navigation step that starts from this screen>']; }, 'navigation entry'],
  ];
  for (const [label, mutate, expected] of cases) {
    const { fixture } = await completeFixture(t);
    const manifest = fixture.readManifest();
    mutate(manifest);
    fixture.writeManifest(manifest);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.includes(expected)), `${label}: ${result.errors.join('\n')}`);
  }
});

test('an ordinary screen cannot claim no rows at all', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  // Not target-only, so it must be justified by rows.
  manifest.screens[0].workbook_rows = [];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.startsWith('screen-manifest.json ')), result.errors.join('\n'));
});

test('two screens cannot claim the same export file', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Projects']]);
  const manifest = fixture.readManifest();
  manifest.screens.push({
    id: 'projects',
    title: 'Projects list',
    channel: 'web',
    surface_key: 'web + /projects + browse projects + full-width table',
    roles: ['operator'],
    states: ['default'],
    workbook_rows: [9],
    // The same file as the login screen: one export cannot be two screens.
    files: [{ path: 'wireframes/login.png', sha256: sha256File(path.join(directory, 'wireframes', 'login.png')) }],
  });
  fixture.writeManifest(manifest);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: KEY9 },
    { row: 9, classification: 'surface', screen: 'projects', surface_key: 'web + /projects + browse projects + full-width table' },
  ]);
  const result = await fixture.audit();
  assert.equal(result.ok, false, 'two screens claiming one export must not pass');
});

const KEY10 = 'web + /login + sign in + centred card';



test('the governed-row pin must be present and well formed', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  delete manifest.workbook_rows_sha256;
  fixture.writeManifest(manifest);
  const absent = await fixture.audit();
  assert(absent.errors.some((error) => error.startsWith('screen-manifest.json ') && /workbook_rows_sha256/.test(error)),
    absent.errors.join('\n'));

  const malformed = fixture.readManifest();
  malformed.workbook_rows_sha256 = 'not-a-hash';
  fixture.writeManifest(malformed);
  const rejected = await fixture.audit();
  assert(rejected.errors.some((error) => error.startsWith('screen-manifest.json ') && /workbook_rows_sha256/.test(error)),
    rejected.errors.join('\n'));
});


test('the migration message names the governed-row pin', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.schema_version = 1;
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('workbook_rows_sha256')), result.errors.join('\n'));
});

const crypto = require('node:crypto');

const KEY11 = 'web + /login + sign in + centred card';

// The digest recomputed from the documented contract rather than by calling the
// production helper. If the implementation drifts from the written spec, the
// fixtures would drift with it and every other test would stay green - this one
// would not.
function digestFromSpec(entries) {
  return crypto.createHash('sha256').update(JSON.stringify(entries)).digest('hex');
}

const fourteen = (first, third) => Array.from({ length: 14 }, (unused, index) => {
  if (index === 0) return String(first || '');
  if (index === 2) return String(third || '');
  return '';
});

test('the governed-row digest matches the documented serialization', async (t) => {
  const { fixture } = await completeFixture(t);
  const expected = digestFromSpec([
    {
      row: 8,
      epic_row: 7,
      epic: fourteen('UF-001', null).slice(0, 2),
      cells: fourteen(null, 'Login').slice(0, 8),
    },
  ]);
  assert.equal(fixture.readManifest().workbook_rows_sha256, expected);

  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('accepts embedded schema help without treating it as migration evidence', async (t) => {
  const { fixture } = await completeFixture(t);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
  ], { _schema_help: { purpose: 'Field documentation only.' } });
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('delivery and SDD lifecycle cells do not stale the approved prototype', async (t) => {
  const { fixture } = await completeFixture(t);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fixture.workbookFile);
  const sheet = workbook.getWorksheet('User Flows');
  sheet.getRow(8).getCell(9).value = 'Yes';
  sheet.getRow(8).getCell(10).value = 'Delivered by a later slice';
  sheet.getRow(8).getCell(14).value = 'specs/999-example/spec.md';
  await workbook.xlsx.writeFile(fixture.workbookFile);

  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('epic lifecycle status does not stale the approved prototype', async (t) => {
  const { fixture } = await completeFixture(t);
  const pinned = fixture.readManifest().workbook_rows_sha256;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fixture.workbookFile);
  const sheet = workbook.getWorksheet('User Flows');
  sheet.getRow(7).getCell(3).value = 'Passed';
  sheet.getRow(7).getCell(4).value = 'All governed rows delivered';
  await workbook.xlsx.writeFile(fixture.workbookFile);
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(fixture.readManifest().workbook_rows_sha256, pinned);
});

test('a cell containing a tab cannot be confused with two cells', async (t) => {
  const { fixture } = await completeFixture(t);
  // Under a delimiter-joined serialization these two sheets hash the same, so a
  // row could be rewritten without disturbing the pin.
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Flows');
  sheet.getRow(7).getCell(1).value = 'UF-001';
  sheet.getRow(8).getCell(1).value = 'Login\tsubmitted';
  sheet.getRow(8).getCell(3).value = 'ok';
  await workbook.xlsx.writeFile(fixture.workbookFile);
  const shifted = await fixture.audit();
  assert(shifted.errors.some((error) => error.includes('governed workbook rows sha256 mismatch')), shifted.errors.join('\n'));

  const other = new ExcelJS.Workbook();
  const otherSheet = other.addWorksheet('User Flows');
  otherSheet.getRow(7).getCell(1).value = 'UF-001';
  otherSheet.getRow(8).getCell(1).value = 'Login';
  otherSheet.getRow(8).getCell(3).value = 'submitted\tok';
  await other.xlsx.writeFile(fixture.workbookFile);
  const alsoShifted = await fixture.audit();
  assert(alsoShifted.errors.some((error) => error.includes('governed workbook rows sha256 mismatch')), alsoShifted.errors.join('\n'));

  // The two arrangements must differ under the *production* digest, not merely
  // under a hash this test computes: otherwise reverting to delimiter-joined
  // serialization would leave this test green.
  const epic = { epicRow: 7, epic: fourteen('UF-001', null) };
  const shiftedLeft = new Map([[8, { ...epic, values: fourteen('Login\tsubmitted', 'ok') }]]);
  const shiftedRight = new Map([[8, { ...epic, values: fourteen('Login', 'submitted\tok') }]]);
  assert.notEqual(governedRowsDigest(shiftedLeft, [8]), governedRowsDigest(shiftedRight, [8]));
  // Newlines are the other delimiter a joined form would collide on.
  const acrossRows = new Map([[8, { ...epic, values: fourteen('Login\n9\tsubmitted', '') }]]);
  assert.notEqual(governedRowsDigest(shiftedLeft, [8]), governedRowsDigest(acrossRows, [8]));
});

test('moving a row under a different epic invalidates the pin', async (t) => {
  const { fixture } = await completeFixture(t);
  // The row text is untouched; only its parent epic changes. A scenario read
  // under UF-001 does not mean what it means under UF-009.
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Flows');
  sheet.getRow(7).getCell(1).value = 'UF-009';
  sheet.getRow(8).getCell(3).value = 'Login';
  await workbook.xlsx.writeFile(fixture.workbookFile);
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('governed workbook rows sha256 mismatch')), result.errors.join('\n'));
});

test('placeholders are refused in project and export_set_version', async (t) => {
  for (const field of ['project', 'export_set_version']) {
    const { fixture } = await completeFixture(t);
    const manifest = fixture.readManifest();
    manifest[field] = '<project name>';
    fixture.writeManifest(manifest);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.includes('unfilled project or export_set_version')),
      `${field}: ${result.errors.join('\n')}`);
  }
});

const KEY12 = 'web + /login + sign in + centred card';




test('two screens cannot claim one export under different letter case', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Projects']]);
  const manifest = fixture.readManifest();
  // On Windows and macOS these two paths are one file, so an exact-string check
  // would let a single export stand in for two screens.
  manifest.screens.push({
    id: 'projects',
    title: 'Projects list',
    channel: 'web',
    surface_key: 'web + /projects + browse projects + full-width table',
    roles: ['operator'],
    states: ['default'],
    workbook_rows: [9],
    files: [{ path: 'wireframes/Login.png', sha256: sha256File(path.join(directory, 'wireframes', 'login.png')) }],
  });
  fixture.writeManifest(manifest);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'surface', screen: 'projects', surface_key: 'web + /projects + browse projects + full-width table' },
  ]);
  // Written too, so that on a case-sensitive filesystem the test still isolates
  // the duplicate-claim rule instead of passing on a missing file. On a
  // case-insensitive one this is the same write twice.
  fs.copyFileSync(path.join(directory, 'wireframes', 'login.png'), path.join(directory, 'wireframes', 'Login.png'));
  const result = await fixture.audit();
  assert(result.errors.some((error) => error.includes('is claimed more than once')), result.errors.join('\n'));
});

test('the normalization record must be a real file, not a symlink out of the repository', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  const outside = path.join(directory, '..', `outside-${path.basename(directory)}.json`);
  fs.copyFileSync(fixture.normalizationFile, outside);
  fs.rmSync(fixture.normalizationFile);
  try {
    fs.symlinkSync(outside, fixture.normalizationFile);
  } catch (error) {
    t.skip(`this platform does not allow creating symlinks here: ${error.code}`);
    return;
  }
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('must not be a symbolic link')), result.errors.join('\n'));
});

test('an uppercase governed-row digest is accepted, matching the schema', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.workbook_rows_sha256 = manifest.workbook_rows_sha256.toUpperCase();
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('an export that is a directory fails as an audit result, not a crash', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  fs.rmSync(fixture.exportFile);
  fs.mkdirSync(path.join(directory, 'wireframes', 'login.png'));
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('is not a regular file') || error.includes('cannot be read')),
    result.errors.join('\n'));
});

test('the documented digest CLI runs and prints a digest', async (t) => {
  const { directory, fixture } = await completeFixture(t);
  // The README tells projects to run this, so the documented command has to
  // survive rejectGovernedOverrides. Pointing it at a fixture needs the same
  // test-mode flag every other audit test relies on for --dir; the documented
  // command takes no arguments and uses the project's own paths.
  const tool = path.join(__dirname, 'prototype-audit.js');
  const output = execFileSync(process.execPath, [
    tool,
    '--governed-rows-digest',
    `--dir=${directory}`,
    `--workbook=${fixture.workbookFile}`,
  ], { encoding: 'utf8', env: { ...process.env, AUDIT_TEST_MODE: '1' } });
  assert.match(output.trim(), /^[a-f0-9]{64}$/);
  assert.equal(output.trim(), fixture.readManifest().workbook_rows_sha256);
});

test('a schema_version 2 manifest is told what changed about covered_by', async (t) => {
  const { fixture } = await completeFixture(t);
  const manifest = fixture.readManifest();
  manifest.schema_version = 2;
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert.equal(result.ok, false);
  for (const step of ['schema_version 2', '"coverage" statement', 'Stage 15', 'Stage 17', 're-approval']) {
    assert(result.errors.some((error) => error.includes(step)), `${step}: ${result.errors.join('\n')}`);
  }
});

test('the coverage statement has to be a sentence, not a token', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);
  const write = (coverage) => {
    const manifest = fixture.readManifest();
    manifest.non_visual_workbook_rows = [{
      row: 9,
      reason: 'Background batch processing has no interactive screen.',
      covered_by: { coverage, initiating_screen: null },
    }];
    fixture.writeManifest(manifest);
  };

  // Three words: a label, not a statement.
  write('Covered by tests');
  const short = await fixture.audit();
  assert(short.errors.some((error) => error.includes('at least three words')), short.errors.join('\n'));

  // A long single token: what a character threshold would have let through.
  write('Covered-by-tests-somewhere-eventually-perhaps');
  const token = await fixture.audit();
  assert(token.errors.some((error) => error.includes('at least three words')), token.errors.join('\n'));

  // Four words, and short - the case a character threshold wrongly rejected.
  write('Covered by unit tests.');
  const concise = await fixture.audit();
  assert.equal(concise.ok, true, concise.errors.join('\n'));
});

test('a real version-2 record can be migrated by following the diagnostic', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);

  // The shape a version-2 project actually had: a requirement id and a test name.
  const old = fixture.readManifest();
  old.schema_version = 2;
  old.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: {
      requirement: 'REQ-settlement-batch',
      tests: ['settlement-batch.integration.test'],
      initiating_screen: null,
    },
  }];
  fixture.writeManifest(old);

  const before = await fixture.audit();
  assert.equal(before.ok, false);
  assert(before.errors.some((error) => error.includes('schema_version 2')), before.errors.join('\n'));

  // Now do exactly what the diagnostic says: bump the version, and replace
  // requirement and tests with a coverage statement, keeping initiating_screen.
  const migrated = fixture.readManifest();
  migrated.schema_version = 4;
  migrated.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: {
      coverage: 'A scheduled-job test asserting the settlement run proves this without a screen.',
      initiating_screen: null,
    },
  }];
  fixture.writeManifest(migrated);

  const after = await fixture.audit();
  assert.equal(after.ok, true, `following the diagnostic must produce a valid record: ${after.errors.join('\n')}`);
});

test('the coverage rule refuses filler and admits a concise real statement', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);
  const write = (coverage) => {
    const manifest = fixture.readManifest();
    manifest.non_visual_workbook_rows = [{
      row: 9,
      reason: 'Background batch processing has no interactive screen.',
      covered_by: { coverage, initiating_screen: null },
    }];
    fixture.writeManifest(manifest);
  };

  // Filler that a plain word count would have accepted.
  for (const filler of ['x x x x', '---- ---- ---- ----', 'a b c d e']) {
    write(filler);
    const result = await fixture.audit();
    assert(result.errors.some((error) => error.includes('at least three words')),
      `${JSON.stringify(filler)}: ${result.errors.join('\n')}`);
  }

  // Concise statements a character threshold would have wrongly rejected.
  for (const concise of ['Service contract tests.', 'Verified through integration tests.']) {
    write(concise);
    const result = await fixture.audit();
    assert.equal(result.ok, true, `${JSON.stringify(concise)}: ${result.errors.join('\n')}`);
  }
});

test('both migration diagnostics name where the old identifiers go', async (t) => {
  for (const version of [1, 2]) {
    const { fixture } = await completeFixture(t);
    const manifest = fixture.readManifest();
    manifest.schema_version = version;
    fixture.writeManifest(manifest);
    const result = await fixture.audit();
    assert.equal(result.ok, false);
    // Telling a project to delete a field without saying where its contents go is
    // how the only row-to-requirement association a mature project has gets lost.
    assert(result.errors.some((error) => error.includes('specs/traceability.md under Imported Legacy References')),
      `version ${version}: ${result.errors.join('\n')}`);
  }
});

test('a real initiating screen is accepted, not merely a null one', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Cache invalidation']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Cache invalidation has no interactive screen of its own.',
    covered_by: {
      coverage: 'A permission-resolution test proves this without a screen.',
      initiating_screen: 'login',
    },
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('the coverage rule is a shape check: three unrelated words pass', async (t) => {
  const { fixture } = await completeFixture(t);
  await fixture.writeWorkbook([[7, 'UF-001', null], [8, null, 'Login'], [9, null, 'Nightly settlement']]);
  fixture.writeNormalization([
    { row: 8, classification: 'surface', screen: 'login', surface_key: 'web + /login + sign in + centred card' },
    { row: 9, classification: 'non-visual' },
  ]);
  const manifest = fixture.readManifest();
  manifest.non_visual_workbook_rows = [{
    row: 9,
    reason: 'Background batch processing has no interactive screen.',
    covered_by: { coverage: 'banana window carpet', initiating_screen: null },
  }];
  fixture.writeManifest(manifest);
  const result = await fixture.audit();
  // Recorded, not fixed. A script cannot tell a coverage statement from three
  // words that happen to be long enough, and pretending otherwise would be worse
  // than saying so: the README assigns this to the Stage 7 reviewer, and this test
  // exists so nobody later mistakes the shape check for a semantic one.
  assert.equal(result.ok, true, `the shape check passes this by design: ${result.errors.join('\n')}`);
});


test('reading-navigation comments are not unfilled approval placeholders', async (t) => {
  const { fixture } = await completeFixture(t);
  const file = path.join(path.dirname(fixture.manifestFile), 'ui-ux-decision.md');
  fs.appendFileSync(file, '\n<!-- ARTIFACT_READING_START -->\n<!-- ARTIFACT_READING_END -->\n');
  const result = await fixture.audit();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

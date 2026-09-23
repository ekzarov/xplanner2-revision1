'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const ExcelJS = require('@excel.js/exceljs').default;
const { COLORS, setFill } = require('./lib');
const { auditWorkbook } = require('./workbook-audit');
const { synchronizeFlowCompletionLabels } = require('./workbook-progress');
const { writeWorkbookFile } = require('./xlsx-package');
const { temporaryDirectory } = require('./helpers');

function fillRange(row, first, last, color) {
  for (let column = first; column <= last; column += 1) setFill(row.getCell(column), color);
}

async function writeWorkbook(file, options = {}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Flows');
  sheet.properties.outlineProperties = {
    summaryBelow: options.summaryBelow === true,
    summaryRight: false,
  };
  sheet.pageSetup.orientation = 'landscape';
  sheet.pageSetup.fitToPage = true;
  sheet.pageSetup.fitToWidth = 1;
  const epic = sheet.getRow(7);
  epic.getCell(1).value = 'UF-001';
  epic.getCell(2).value = 'Test flow (50%)';
  epic.getCell(3).value = 'Not Passed - Deferred';
  fillRange(epic, 1, 14, COLORS.ORANGE);
  if (options.hideBanner) epic.hidden = true;

  const complete = sheet.getRow(8);
  complete.hidden = true;
  complete.outlineLevel = options.dropOutline ? 0 : 1;
  complete.getCell(3).value = 'Complete flow';
  if (options.freeTextSourceImplemented) {
    complete.getCell(7).value = 'Inferred - listener behavior unverified.';
  } else if (options.sourceImplemented) {
    complete.getCell(7).value = options.sourceImplemented;
  }
  complete.getCell(9).value = 'Yes';
  complete.getCell(12).value = 'Yes';
  complete.getCell(13).value = 'No';
  fillRange(complete, 4, 14, options.badFill ? COLORS.RED : COLORS.GREEN);

  const deferred = sheet.getRow(9);
  deferred.hidden = true;
  deferred.outlineLevel = 1;
  deferred.getCell(3).value = 'Deferred flow';
  deferred.getCell(10).value = 'Owner-approved reason';
  deferred.getCell(12).value = 'No';
  deferred.getCell(13).value = 'Yes';
  fillRange(deferred, 4, 14, COLORS.ORANGE);

  const revision = workbook.addWorksheet('Rev 1');
  revision.getRow(1).values = ['ID', 'Finding', 'Rows', 'Type', 'Expected', 'Actual', 'Evidence', 'Implemented?', 'Notes'];
  const finding = revision.getRow(2);
  finding.getCell(1).value = 'F-001';
  finding.getCell(3).value = '9';
  finding.getCell(4).value = 'deferred';
  finding.getCell(8).value = 'No';
  fillRange(finding, 1, 9, COLORS.ORANGE);
  synchronizeFlowCompletionLabels(workbook);
  await writeWorkbookFile(workbook, file);
}

// Outline grouping plus fit-to-page is the layout the methodology mandates,
// and it is exactly the combination the pinned library serializes in the wrong
// element order.
async function writeOutlinedWorkbook(file, { repair }) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Flows');
  sheet.pageSetup.orientation = 'landscape';
  sheet.pageSetup.fitToPage = true;
  sheet.pageSetup.fitToWidth = 1;
  sheet.properties.outlineProperties = { summaryBelow: false, summaryRight: false };

  const epic = sheet.getRow(7);
  epic.getCell(1).value = 'UF-001';
  epic.getCell(2).value = 'Outlined flow (0%)';
  epic.getCell(3).value = 'Not Passed - Open';
  fillRange(epic, 1, 14, COLORS.RED);
  epic.outlineLevel = 0;

  const scenario = sheet.getRow(8);
  scenario.getCell(3).value = 'Happy path';
  fillRange(scenario, 4, 14, COLORS.RED);
  scenario.hidden = true;
  scenario.outlineLevel = 1;

  synchronizeFlowCompletionLabels(workbook);
  if (repair) await writeWorkbookFile(workbook, file);
  else await workbook.xlsx.writeFile(file);
}

test('passes deterministic workbook status, epic, revision, and coverage invariants', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const result = await auditWorkbook({ file });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert(result.summary.includes('Scenarios 2'));
});

test('fails when scenario color disagrees with implementation status', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file, { badFill: true });
  const result = await auditWorkbook({ file });
  assert(result.errors.some((error) => error.includes('scenario row 8')));
});

test('rejects a hidden epic banner row', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file, { hideBanner: true });
  const result = await auditWorkbook({ file });
  assert(
    result.errors.some((error) => error.includes('banner rows must stay visible')),
    result.errors.join('\n')
  );
});

test('rejects a stale flow completion percentage', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  workbook.getWorksheet('User Flows').getRow(7).getCell(2).value = 'Test flow (25%)';
  await writeWorkbookFile(workbook, file);

  const result = await auditWorkbook({ file });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('completion label')));
});

test('rejects a stale overall progress indicator', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  workbook.getWorksheet('User Flows').getCell('A3').value = 'OVERALL DELIVERY PROGRESS  10.0%';
  await writeWorkbookFile(workbook, file);

  const result = await auditWorkbook({ file });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('overall progress indicator')));
});

test('rejects scenario rows that lose the Excel outline hierarchy controls', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file, { dropOutline: true });
  const result = await auditWorkbook({ file });
  assert(
    result.errors.some((error) => error.includes('outline level 1')),
    result.errors.join('\n')
  );
});

test('rejects detail groups whose visible epic banner is placed below them', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file, { summaryBelow: true });
  const result = await auditWorkbook({ file });
  assert(
    result.errors.some((error) => error.includes('summaryBelow = false')),
    result.errors.join('\n')
  );
});

test('rejects a Source implemented? value outside the controlled vocabulary', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file, { freeTextSourceImplemented: true });
  const result = await auditWorkbook({ file });
  assert(
    result.errors.some((error) => error.includes('Source implemented?')),
    result.errors.join('\n')
  );
});

test('accepts every controlled Source implemented? value', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file, { sourceImplemented: 'Inferred' });
  const result = await auditWorkbook({ file });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('rejects a stored workbook whose sheetPr order Excel would refuse', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const raw = path.join(directory, 'raw.xlsx');
  await writeOutlinedWorkbook(raw, { repair: false });
  const broken = await auditWorkbook({ file: raw });
  assert(
    broken.errors.some((error) => error.includes('CT_SheetPr sequence')),
    `expected a sheetPr ordering failure, got: ${broken.errors.join('\n')}`
  );

  const repaired = path.join(directory, 'repaired.xlsx');
  await writeOutlinedWorkbook(repaired, { repair: true });
  const ok = await auditWorkbook({ file: repaired });
  assert.equal(ok.ok, true, ok.errors.join('\n'));
});

test('fails closed when the workbook is absent', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const result = await auditWorkbook({ file: path.join(directory, 'missing.xlsx') });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('cannot read workbook')));
});

test('requires every open row in the highest-numbered revision sheet', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const finalRevision = workbook.addWorksheet('Rev 2');
  finalRevision.getRow(1).values = ['ID', 'Finding', 'Rows', 'Type', 'Expected', 'Actual', 'Covered in SDD?', 'Implemented?', 'Evidence'];
  await workbook.xlsx.writeFile(file);

  const result = await auditWorkbook({ file });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('final revision sheet')));
});

test('requires SDD closure and evidence for green revision findings', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const finding = workbook.getWorksheet('Rev 1').getRow(2);
  finding.getCell(8).value = 'Yes';
  fillRange(finding, 1, 9, COLORS.GREEN);
  await workbook.xlsx.writeFile(file);

  const result = await auditWorkbook({ file });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Covered in SDD')));
  assert(result.errors.some((error) => error.includes('closure evidence')));
});

test('blank starter workbook is readable and has the expected sheet', async () => {
  const workbook = new ExcelJS.Workbook();
  const file = path.join(__dirname, '..', 'legacy_user_flows_template.xlsx');
  await workbook.xlsx.readFile(file);
  const sheet = workbook.getWorksheet('User Flows');
  assert(sheet);
  assert.equal(workbook.worksheets.length, 1);
  assert(sheet.getRow(4).height >= 54);
  assert.equal(sheet.pageSetup.orientation, 'landscape');
  assert.equal(sheet.pageSetup.fitToPage, true);
  assert.equal(sheet.pageSetup.fitToWidth, 1);
  assert.equal((await auditWorkbook({ file })).ok, true);
  for (let rowNumber = 7; rowNumber <= sheet.rowCount; rowNumber += 1) {
    assert.equal(rowHasVisibleContent(sheet.getRow(rowNumber)), false);
  }
  const visibleText = [];
  sheet.eachRow((row) => row.eachCell((cell) => visibleText.push(cell.text)));
  const joined = visibleText.join('\n');
  assert.doesNotMatch(joined, /Bank of Z|z-bank|IBM|COBOL|\.NET|Angular|Petstore|XPlanner/i);
  assert.doesNotMatch(joined, /UF-\d+/);
});

test('revision finding type must match its open-state fill', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const finding = workbook.getWorksheet('Rev 1').getRow(2);
  finding.getCell(4).value = 'gap';
  fillRange(finding, 1, 9, COLORS.ORANGE);
  await workbook.xlsx.writeFile(file);

  const result = await auditWorkbook({ file });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('gap finding fill')));
});

test('open revision findings cannot reference completed main-sheet rows', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  workbook.getWorksheet('Rev 1').getRow(2).getCell(3).value = '8';
  await workbook.xlsx.writeFile(file);

  const result = await auditWorkbook({ file });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('open finding references completed')));
});

test('working workbook must preserve landscape fit-to-width layout', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  workbook.getWorksheet('User Flows').pageSetup.orientation = 'portrait';
  await workbook.xlsx.writeFile(file);

  const result = await auditWorkbook({ file });
  assert(result.errors.some((error) => error.includes('landscape')));
});

test('carries unresolved gray decisions into the final revision sheet', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const rev1 = workbook.getWorksheet('Rev 1');
  const decision = rev1.getRow(3);
  decision.getCell(1).value = 'D-001';
  decision.getCell(3).value = '9';
  decision.getCell(4).value = 'decision';
  decision.getCell(8).value = 'No';
  fillRange(decision, 1, 9, COLORS.GRAY);
  const rev2 = workbook.addWorksheet('Rev 2');
  rev2.getRow(1).values = rev1.getRow(1).values;
  const deferred = rev2.getRow(2);
  deferred.getCell(1).value = 'F-001';
  deferred.getCell(3).value = '9';
  deferred.getCell(4).value = 'deferred';
  deferred.getCell(8).value = 'No';
  fillRange(deferred, 1, 9, COLORS.ORANGE);
  await workbook.xlsx.writeFile(file);

  const result = await auditWorkbook({ file });
  assert(result.errors.some((error) =>
    error.includes('unresolved finding "D-001"') && error.includes('Rev 2')));
});

test('rejects a contract override that redirects the audit to a decoy sheet', async (t) => {
  const directory = temporaryDirectory(t, 'workbook-audit-');
  const file = path.join(directory, 'legacy_user_flows.xlsx');
  await writeWorkbook(file);
  const result = await auditWorkbook({
    file,
    contract: {
      sheet: 'Decoy',
      columns: { implemented: 20 },
      unknown: true,
    },
  });
  assert(result.errors.some((error) => error.includes('workbook contract')));
});

function rowHasVisibleContent(row) {
  for (let column = 1; column <= 14; column += 1) {
    if (row.getCell(column).text.trim()) return true;
  }
  return false;
}

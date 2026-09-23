'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ExcelJS = require('@excel.js/exceljs').default;
const {
  copyWorksheetOutlineSettings,
  copyWorksheetPrintSettings,
  findDuplicateContentTypeOverrides,
  findSheetPrOrderViolations,
  findUnsupportedChartPartLocations,
  normalizeWorkbookFile,
  normalizeContentTypes,
  normalizeSpreadsheetNamespacePrefix,
  orderSheetPrChildren,
  readEntries,
  reconcileWorksheetOutlineHierarchy,
  writeEntries,
  writeWorkbookFile,
} = require('./xlsx-package');
const { temporaryDirectory } = require('./helpers');

const TEMPLATE = path.join(__dirname, '..', 'legacy_user_flows_template.xlsx');
const NFR_TEMPLATE = path.join(__dirname, '..', 'architecture', 'templates', 'architecture-nfr-decision-register-template.xlsx');

test('reorders sheetPr children into the schema sequence', () => {
  const wrong = '<worksheet><sheetPr><pageSetUpPr fitToPage="1"/><outlinePr summaryBelow="0"/></sheetPr></worksheet>';
  assert.equal(
    orderSheetPrChildren(wrong),
    '<worksheet><sheetPr><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr></worksheet>'
  );
});

test('leaves a correctly ordered sheetPr untouched', () => {
  const right = '<worksheet><sheetPr><tabColor rgb="FF0000"/><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr></worksheet>';
  assert.equal(orderSheetPrChildren(right), right);
});

test('preserves unknown sheetPr children in their original relative order', () => {
  const source = '<sheetPr><pageSetUpPr fitToPage="1"/><custom a="1"/><outlinePr summaryBelow="0"/><other b="2"/></sheetPr>';
  assert.equal(
    orderSheetPrChildren(source),
    '<sheetPr><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/><custom a="1"/><other b="2"/></sheetPr>'
  );
});

test('repairs artifact-tool content types so governed readers find the workbook part', () => {
  const broken = '\uFEFF<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /></Types>';
  const repaired = normalizeContentTypes(broken);
  assert.ok(!repaired.startsWith('\uFEFF'));
  assert.match(repaired, /Extension="xml" ContentType="application\/xml"/);
  assert.match(repaired, /PartName="\/xl\/workbook\.xml"/);
  assert.match(repaired, /spreadsheetml\.sheet\.main\+xml/);
});

test('removes the artifact-tool spreadsheet namespace prefix for governed readers', () => {
  const prefixed = '<x:workbook xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheets><x:sheet name="Flows"/></x:sheets></x:workbook>';
  assert.equal(
    normalizeSpreadsheetNamespacePrefix(prefixed),
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheets><sheet name="Flows"/></sheets></workbook>'
  );
});

test('zip round trip preserves every part byte-for-byte', (t) => {
  const directory = temporaryDirectory(t, 'xlsx-package-');
  const file = path.join(directory, 'copy.xlsx');
  fs.copyFileSync(TEMPLATE, file);
  const before = readEntries(fs.readFileSync(file));
  const rebuilt = path.join(directory, 'rebuilt.xlsx');
  fs.writeFileSync(rebuilt, writeEntries(before));
  const after = readEntries(fs.readFileSync(rebuilt));
  assert.deepEqual(after.map((entry) => entry.name), before.map((entry) => entry.name));
  for (let index = 0; index < before.length; index += 1) {
    assert.ok(after[index].content.equals(before[index].content), `part ${before[index].name} changed`);
  }
});

test('the shipped template stores a schema-valid sheetPr', () => {
  assert.deepEqual(findSheetPrOrderViolations(TEMPLATE), []);
});

test('the shipped NFR template stores chart parts where Excel desktop accepts them', () => {
  assert.deepEqual(findUnsupportedChartPartLocations(NFR_TEMPLATE), []);
});

test('a library write breaks sheetPr order and writeWorkbookFile repairs it', async (t) => {
  const directory = temporaryDirectory(t, 'xlsx-package-');
  const raw = path.join(directory, 'raw.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(TEMPLATE);
  await workbook.xlsx.writeFile(raw);
  assert.deepEqual(
    findSheetPrOrderViolations(raw),
    ['xl/worksheets/sheet1.xml'],
    'expected the pinned library to emit pageSetUpPr before outlinePr'
  );

  const repaired = path.join(directory, 'repaired.xlsx');
  const second = new ExcelJS.Workbook();
  await second.xlsx.readFile(TEMPLATE);
  assert.deepEqual(await writeWorkbookFile(second, repaired), ['xl/worksheets/sheet1.xml']);
  assert.deepEqual(findSheetPrOrderViolations(repaired), []);

  const reread = new ExcelJS.Workbook();
  await reread.xlsx.readFile(repaired);
  const sheet = reread.getWorksheet('User Flows');
  assert.equal(sheet.pageSetup.fitToPage, true);
  assert.equal(sheet.properties.outlineProperties.summaryBelow, false);
  assert.equal(sheet.getCell('A6').value, 'Use Case ID');
});

test('normalizeWorkbookFile is idempotent', (t) => {
  const directory = temporaryDirectory(t, 'xlsx-package-');
  const file = path.join(directory, 'copy.xlsx');
  fs.copyFileSync(TEMPLATE, file);
  assert.deepEqual(normalizeWorkbookFile(file), []);
  assert.deepEqual(normalizeWorkbookFile(file), []);
});

test('detects and removes duplicate content type overrides that make Excel request recovery', (t) => {
  const directory = temporaryDirectory(t, 'xlsx-content-types-');
  const file = path.join(directory, 'duplicate.xlsx');
  const entries = readEntries(fs.readFileSync(TEMPLATE));
  const contentTypes = entries.find((entry) => entry.name === '[Content_Types].xml');
  const xml = contentTypes.content.toString('utf8');
  const workbookOverride = (xml.match(/<Override\b[^>]*PartName="\/xl\/workbook\.xml"[^>]*\/>/) || [])[0];
  assert(workbookOverride);
  contentTypes.content = Buffer.from(xml.replace('</Types>', `${workbookOverride}</Types>`), 'utf8');
  fs.writeFileSync(file, writeEntries(entries));

  assert.deepEqual(findDuplicateContentTypeOverrides(file), ['/xl/workbook.xml']);
  assert(normalizeWorkbookFile(file).includes('[Content_Types].xml'));
  assert.deepEqual(findDuplicateContentTypeOverrides(file), []);
});

test('normalizeWorkbookFile relocates chart parts emitted beneath drawings', (t) => {
  const directory = temporaryDirectory(t, 'xlsx-chart-location-');
  const file = path.join(directory, 'misplaced-chart.xlsx');
  const entries = readEntries(fs.readFileSync(NFR_TEMPLATE));
  entries.push({
    name: 'xl/drawings/charts/chart1.xml',
    content: Buffer.from('<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"/>'),
  });
  fs.writeFileSync(file, writeEntries(entries));

  assert.deepEqual(findUnsupportedChartPartLocations(file), ['xl/drawings/charts/chart1.xml']);
  const repaired = normalizeWorkbookFile(file);
  assert(repaired.includes('xl/drawings/charts/chart1.xml'));
  assert.deepEqual(findUnsupportedChartPartLocations(file), []);
  assert(readEntries(fs.readFileSync(file)).some((entry) => entry.name === 'xl/charts/chart1.xml'));
});

test('restores governed print settings after a spreadsheet editor drops them', async (t) => {
  const directory = temporaryDirectory(t, 'xlsx-print-settings-');
  const destination = path.join(directory, 'destination.xlsx');
  const entries = readEntries(fs.readFileSync(TEMPLATE));
  const sheet = entries.find((entry) => entry.name === 'xl/worksheets/sheet1.xml');
  let xml = sheet.content.toString('utf8');
  xml = xml.replace(/<sheetPr\b[\s\S]*?<\/sheetPr>/, '');
  xml = xml.replace(/<pageMargins\b[^>]*\/>/, '');
  xml = xml.replace(/<pageSetup\b[^>]*\/>/, '');
  sheet.content = Buffer.from(xml, 'utf8');
  fs.writeFileSync(destination, writeEntries(entries));

  assert.equal(copyWorksheetPrintSettings(TEMPLATE, destination), 'xl/worksheets/sheet1.xml');
  normalizeWorkbookFile(destination);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(destination);
  const restored = workbook.getWorksheet('User Flows');
  assert.equal(restored.pageSetup.orientation, 'landscape');
  assert.equal(restored.pageSetup.fitToPage, true);
  assert.equal(restored.pageSetup.fitToWidth, 1);
});

test('restores governed row grouping after a spreadsheet editor drops it', async (t) => {
  const directory = temporaryDirectory(t, 'xlsx-outline-settings-');
  const destination = path.join(directory, 'destination.xlsx');
  const entries = readEntries(fs.readFileSync(TEMPLATE));
  const sheet = entries.find((entry) => entry.name === 'xl/worksheets/sheet1.xml');
  let xml = sheet.content.toString('utf8');
  xml = xml.replace(/\s(?:hidden|outlineLevel|collapsed)="[^"]*"/g, '');
  xml = xml.replace(/\s(?:outlineLevelRow|outlineLevelCol)="[^"]*"/g, '');
  xml = xml.replace(/<outlinePr\b[^>]*\/?\>/g, '');
  sheet.content = Buffer.from(xml, 'utf8');
  fs.writeFileSync(destination, writeEntries(entries));

  assert.equal(copyWorksheetOutlineSettings(TEMPLATE, destination), 'xl/worksheets/sheet1.xml');
  normalizeWorkbookFile(destination);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(destination);
  const restored = workbook.getWorksheet('User Flows');
  assert.equal(restored.properties.outlineLevelRow, 1);
  assert.equal(restored.properties.outlineProperties.summaryBelow, false);
  assert.equal(restored.getRow(8).outlineLevel, 1);
  assert.equal(restored.getRow(8).hidden, true);
  assert.equal(restored.getRow(8).collapsed, true);
  assert.equal(restored.getRow(7).hidden, false);
});

test('rebuilds grouping from populated epic content instead of blank-template row positions', async (t) => {
  const directory = temporaryDirectory(t, 'xlsx-outline-content-');
  const file = path.join(directory, 'populated.xlsx');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('User Flows');
  sheet.getRow(7).getCell(1).value = 'UF-001';
  sheet.getRow(7).getCell(4).value = 'Epic one';
  sheet.getRow(8).getCell(4).value = 'Scenario one';
  sheet.getRow(9).getCell(4).value = 'Scenario two';
  sheet.getRow(10).getCell(1).value = 'UF-002';
  sheet.getRow(10).getCell(4).value = 'Epic two';
  sheet.getRow(11).getCell(4).value = 'Scenario three';
  for (const rowNumber of [7, 8, 9, 10, 11]) {
    sheet.getRow(rowNumber).hidden = true;
    sheet.getRow(rowNumber).outlineLevel = 0;
  }

  assert.deepEqual(reconcileWorksheetOutlineHierarchy(workbook), { epicCount: 2, scenarioCount: 3 });
  await writeWorkbookFile(workbook, file);

  const reread = new ExcelJS.Workbook();
  await reread.xlsx.readFile(file);
  const restored = reread.getWorksheet('User Flows');
  assert.equal(restored.properties.outlineProperties.summaryBelow, false);
  assert.equal(restored.getRow(7).hidden, false);
  assert.equal(restored.getRow(7).outlineLevel, 0);
  assert.equal(restored.getRow(8).hidden, true);
  assert.equal(restored.getRow(8).outlineLevel, 1);
  assert.equal(restored.getRow(10).hidden, false);
  assert.equal(restored.getRow(11).hidden, true);
  assert.equal(restored.getRow(11).outlineLevel, 1);
});

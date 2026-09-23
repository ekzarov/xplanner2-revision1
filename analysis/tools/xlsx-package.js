#!/usr/bin/env node
'use strict';

// Minimal, dependency-free ZIP reader/writer used to repair and inspect the
// raw OOXML parts of a workbook after the spreadsheet library has written it.
//
// Why this exists: the pinned workbook library serializes the worksheet
// <sheetPr> children as <pageSetUpPr> before <outlinePr>. ECMA-376 defines
// CT_SheetPr as an ordered sequence (tabColor, outlinePr, pageSetUpPr), and
// Excel refuses to open a workbook that violates it. The methodology requires
// both outline grouping (summaryBelow) and fit-to-page, so every governed
// workbook write hits this ordering bug and would produce a file Excel cannot
// open — including a plain read-then-write round trip of the blank template.

const fs = require('node:fs');
const zlib = require('node:zlib');

const LOCAL_SIGNATURE = 0x04034b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const EOCD_SIGNATURE = 0x06054b50;
const EOCD_MIN_SIZE = 22;

function findEndOfCentralDirectory(buffer) {
  for (let offset = buffer.length - EOCD_MIN_SIZE; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) return offset;
  }
  throw new Error('not a ZIP archive: end of central directory not found');
}

function readEntries(buffer) {
  const eocd = findEndOfCentralDirectory(buffer);
  const total = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = [];
  for (let index = 0; index < total; index += 1) {
    if (buffer.readUInt32LE(offset) !== CENTRAL_SIGNATURE) {
      throw new Error(`corrupt central directory entry at ${offset}`);
    }
    const method = buffer.readUInt16LE(offset + 10);
    const time = buffer.readUInt16LE(offset + 12);
    const date = buffer.readUInt16LE(offset + 14);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);

    if (buffer.readUInt32LE(localOffset) !== LOCAL_SIGNATURE) {
      throw new Error(`corrupt local header for ${name}`);
    }
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);
    const content = method === 0 ? Buffer.from(raw) : zlib.inflateRawSync(raw);

    entries.push({ name, content, time, date });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function writeEntries(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const deflated = zlib.deflateRawSync(entry.content, { level: 9 });
    const crc = zlib.crc32(entry.content);

    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(LOCAL_SIGNATURE, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(entry.time, 10);
    local.writeUInt16LE(entry.date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(entry.content.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    name.copy(local, 30);
    locals.push(local, deflated);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(CENTRAL_SIGNATURE, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(entry.time, 12);
    central.writeUInt16LE(entry.date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(deflated.length, 20);
    central.writeUInt32LE(entry.content.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);
    centrals.push(central);

    offset += local.length + deflated.length;
  }

  const directory = Buffer.concat(centrals);
  const eocd = Buffer.alloc(EOCD_MIN_SIZE);
  eocd.writeUInt32LE(EOCD_SIGNATURE, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(directory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, eocd]);
}

// ECMA-376 CT_SheetPr sequence: tabColor, outlinePr, pageSetUpPr.
const SHEET_PR = /<sheetPr(\s[^>]*)?>([\s\S]*?)<\/sheetPr>/g;
const CHILD_ORDER = ['tabColor', 'outlinePr', 'pageSetUpPr'];

function orderSheetPrChildren(xml) {
  return xml.replace(SHEET_PR, (match, attributes, inner) => {
    const children = inner.match(/<[^>]+>/g);
    if (!children) return match;
    const ranked = children.map((child, index) => {
      const name = (child.match(/^<\/?([A-Za-z0-9:]+)/) || [])[1] || '';
      const rank = CHILD_ORDER.indexOf(name);
      return { child, index, rank: rank === -1 ? CHILD_ORDER.length : rank };
    });
    const sorted = [...ranked].sort((left, right) => left.rank - right.rank || left.index - right.index);
    if (sorted.every((entry, position) => entry.index === position)) return match;
    return `<sheetPr${attributes || ''}>${sorted.map((entry) => entry.child).join('')}</sheetPr>`;
  });
}

function isWorksheetPart(name) {
  return /^xl\/worksheets\/[^/]+\.xml$/.test(name);
}

function isSpreadsheetPart(name) {
  return name === 'xl/workbook.xml' || name === 'xl/sharedStrings.xml' ||
    name === 'xl/styles.xml' || isWorksheetPart(name);
}

function normalizeContentTypes(xml) {
  const withoutBom = xml.replace(/^\uFEFF/, '');
  const xmlDefault = /<Default\s+Extension="xml"\s+ContentType="[^"]+"\s*\/>/;
  let normalized = withoutBom.replace(
    xmlDefault,
    '<Default Extension="xml" ContentType="application/xml"/>'
  );
  const seenOverrides = new Set();
  normalized = normalized.replace(/<Override\b[^>]*\bPartName="([^"]+)"[^>]*\/>/g, (match, partName) => {
    if (seenOverrides.has(partName)) return '';
    seenOverrides.add(partName);
    return match;
  });
  if (!/<Override\s+PartName="\/xl\/workbook\.xml"(?:\s|\/|>)/.test(normalized)) {
    normalized = normalized.replace(
      /<\/Types>\s*$/,
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/></Types>'
    );
  }
  return normalized;
}

function findDuplicateContentTypeOverrides(file) {
  const entry = readEntries(fs.readFileSync(file))
    .find((candidate) => candidate.name === '[Content_Types].xml');
  if (!entry) return ['[Content_Types].xml is missing'];
  const seen = new Set();
  const duplicates = new Set();
  const xml = entry.content.toString('utf8');
  for (const match of xml.matchAll(/<Override\b[^>]*\bPartName="([^"]+)"[^>]*\/>/g)) {
    if (seen.has(match[1])) duplicates.add(match[1]);
    seen.add(match[1]);
  }
  return [...duplicates];
}

function normalizeSpreadsheetNamespacePrefix(xml) {
  if (!/<\/?x:/.test(xml)) return xml.replace(/^\uFEFF/, '');
  return xml.replace(/^\uFEFF/, '')
    .replace(/xmlns:x="http:\/\/schemas\.openxmlformats\.org\/spreadsheetml\/2006\/main"/, 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"')
    .replace(/<x:/g, '<')
    .replace(/<\/x:/g, '</');
}

function copyWorksheetPrintSettings(sourceFile, destinationFile, sheetPart = 'xl/worksheets/sheet1.xml') {
  const sourceEntries = readEntries(fs.readFileSync(sourceFile));
  const destinationEntries = readEntries(fs.readFileSync(destinationFile));
  const source = sourceEntries.find((entry) => entry.name === sheetPart);
  const destination = destinationEntries.find((entry) => entry.name === sheetPart);
  if (!source || !destination) throw new Error(`worksheet part ${sheetPart} is missing`);

  const sourceXml = normalizeSpreadsheetNamespacePrefix(source.content.toString('utf8'));
  let destinationXml = normalizeSpreadsheetNamespacePrefix(destination.content.toString('utf8'));
  const sheetPr = (sourceXml.match(/<sheetPr\b[\s\S]*?<\/sheetPr>/) || [])[0];
  const pageMargins = (sourceXml.match(/<pageMargins\b[^>]*\/>/) || [])[0];
  const pageSetup = (sourceXml.match(/<pageSetup\b[^>]*\/>/) || [])[0];
  if (!sheetPr || !pageMargins || !pageSetup) {
    throw new Error(`source worksheet part ${sheetPart} lacks governed print settings`);
  }

  destinationXml = destinationXml.replace(/<sheetPr\b[\s\S]*?<\/sheetPr>/, '');
  destinationXml = destinationXml.replace(/(<worksheet\b[^>]*>)/, `$1${sheetPr}`);
  destinationXml = destinationXml.replace(/<pageMargins\b[^>]*\/>/g, '');
  destinationXml = destinationXml.replace(/<pageSetup\b[^>]*\/>/g, '');
  destinationXml = destinationXml.replace(/<\/worksheet>\s*$/, `${pageMargins}${pageSetup}</worksheet>`);
  destination.content = Buffer.from(destinationXml, 'utf8');
  fs.writeFileSync(destinationFile, writeEntries(destinationEntries));
  return sheetPart;
}

function xmlAttribute(tag, name) {
  return (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
}

function replaceXmlAttribute(tag, name, value) {
  const without = tag.replace(new RegExp(`\\s${name}="[^"]*"`, 'g'), '');
  if (value === undefined) return without;
  return without.replace(/\s*\/?\>$/, (ending) => ` ${name}="${value}"${ending}`);
}

/**
 * Restores row grouping metadata after an external spreadsheet editor drops
 * hidden/outline attributes while preserving cell values and formatting.
 */
function copyWorksheetOutlineSettings(sourceFile, destinationFile, sheetPart = 'xl/worksheets/sheet1.xml') {
  const sourceEntries = readEntries(fs.readFileSync(sourceFile));
  const destinationEntries = readEntries(fs.readFileSync(destinationFile));
  const source = sourceEntries.find((entry) => entry.name === sheetPart);
  const destination = destinationEntries.find((entry) => entry.name === sheetPart);
  if (!source || !destination) throw new Error(`worksheet part ${sheetPart} is missing`);

  const sourceXml = normalizeSpreadsheetNamespacePrefix(source.content.toString('utf8'));
  let destinationXml = normalizeSpreadsheetNamespacePrefix(destination.content.toString('utf8'));
  const sourceOutlinePr = (sourceXml.match(/<outlinePr\b[^>]*\/?\>/) || [])[0];
  if (!sourceOutlinePr) {
    throw new Error(`source worksheet part ${sheetPart} lacks governed outline properties`);
  }
  const sourceRows = new Map();
  for (const match of sourceXml.matchAll(/<row\b[^>]*\br="(\d+)"[^>]*>/g)) {
    sourceRows.set(match[1], match[0]);
  }

  destinationXml = destinationXml.replace(/<row\b[^>]*\br="(\d+)"[^>]*>/g, (tag, rowNumber) => {
    const sourceTag = sourceRows.get(rowNumber);
    if (!sourceTag) return tag;
    let restored = tag;
    for (const name of ['hidden', 'outlineLevel', 'collapsed']) {
      restored = replaceXmlAttribute(restored, name, xmlAttribute(sourceTag, name));
    }
    return restored;
  });

  const sourceSheetFormat = (sourceXml.match(/<sheetFormatPr\b[^>]*\/?\>/) || [])[0];
  if (sourceSheetFormat) {
    destinationXml = destinationXml.replace(/<sheetFormatPr\b[^>]*\/?\>/, (tag) => {
      let restored = tag;
      for (const name of ['outlineLevelRow', 'outlineLevelCol']) {
        restored = replaceXmlAttribute(restored, name, xmlAttribute(sourceSheetFormat, name));
      }
      return restored;
    });
  }

  SHEET_PR.lastIndex = 0;
  if (SHEET_PR.test(destinationXml)) {
    SHEET_PR.lastIndex = 0;
    destinationXml = destinationXml.replace(SHEET_PR, (match, attributes, inner) => {
      const withoutOutline = inner.replace(/<outlinePr\b[^>]*\/?\>/g, '');
      return `<sheetPr${attributes || ''}>${sourceOutlinePr}${withoutOutline}</sheetPr>`;
    });
  } else {
    SHEET_PR.lastIndex = 0;
    destinationXml = destinationXml.replace(
      /(<worksheet\b[^>]*>)/,
      `$1<sheetPr>${sourceOutlinePr}</sheetPr>`
    );
  }
  destinationXml = orderSheetPrChildren(destinationXml);

  destination.content = Buffer.from(destinationXml, 'utf8');
  fs.writeFileSync(destinationFile, writeEntries(destinationEntries));
  return sheetPart;
}

function worksheetCellText(cell) {
  const value = cell?.value;
  if (value === null || value === undefined) return '';
  return typeof value === 'object' && value.text ? String(value.text).trim() : String(value).trim();
}

/**
 * Rebuilds the parity-map hierarchy from the populated worksheet itself.
 * Unlike copying row metadata from a blank template, this remains correct
 * when discovery has inserted a different number of scenario rows per epic.
 */
function reconcileWorksheetOutlineHierarchy(workbook, sheetName = 'User Flows', options = {}) {
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) throw new Error(`worksheet ${sheetName} is missing`);
  const startRow = options.startRow || 7;
  const epicColumn = options.epicColumn || 1;
  const scenarioColumn = options.scenarioColumn || 4;
  const epicPattern = options.epicPattern || /^UF-\d+$/;
  let insideEpic = false;
  let epicCount = 0;
  let scenarioCount = 0;

  sheet.properties.outlineProperties = {
    ...(sheet.properties.outlineProperties || {}),
    summaryBelow: false,
  };
  sheet.properties.outlineLevelRow = 1;

  for (let rowNumber = startRow; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const epicId = worksheetCellText(row.getCell(epicColumn));
    const scenario = worksheetCellText(row.getCell(scenarioColumn));
    if (epicPattern.test(epicId)) {
      insideEpic = true;
      row.hidden = false;
      row.outlineLevel = 0;
      epicCount += 1;
    } else if (insideEpic && scenario) {
      row.hidden = true;
      row.outlineLevel = 1;
      scenarioCount += 1;
    }
  }

  if (!epicCount || !scenarioCount) {
    throw new Error(`worksheet ${sheetName} does not contain a populated epic/scenario hierarchy`);
  }
  return { epicCount, scenarioCount };
}

/**
 * Rewrites a workbook file in place so every worksheet's <sheetPr> children
 * follow the schema sequence. Returns the names of the repaired parts.
 */
function normalizeWorkbookFile(file) {
  const entries = readEntries(fs.readFileSync(file));
  const repaired = [];
  const contentTypes = entries.find((entry) => entry.name === '[Content_Types].xml');
  if (contentTypes) {
    const xml = contentTypes.content.toString('utf8');
    const normalized = normalizeContentTypes(xml);
    if (normalized !== xml) {
      contentTypes.content = Buffer.from(normalized, 'utf8');
      repaired.push(contentTypes.name);
    }
  }
  for (const entry of entries) {
    if (!isSpreadsheetPart(entry.name)) continue;
    const xml = entry.content.toString('utf8');
    const normalized = normalizeSpreadsheetNamespacePrefix(xml);
    if (normalized !== xml) {
      entry.content = Buffer.from(normalized, 'utf8');
      repaired.push(entry.name);
    }
  }
  const misplacedPrefix = 'xl/drawings/charts/';
  for (const entry of entries) {
    if (entry.name.startsWith(misplacedPrefix)) {
      repaired.push(entry.name);
      entry.name = `xl/charts/${entry.name.slice(misplacedPrefix.length)}`;
    }
  }
  if (repaired.length) {
    for (const entry of entries) {
      if (!entry.name.endsWith('.xml') && !entry.name.endsWith('.rels')) continue;
      const xml = entry.content.toString('utf8');
      const relocated = xml.replaceAll('/xl/drawings/charts/', '/xl/charts/');
      if (relocated !== xml) entry.content = Buffer.from(relocated, 'utf8');
    }
  }
  for (const entry of entries) {
    if (!isWorksheetPart(entry.name)) continue;
    const xml = entry.content.toString('utf8');
    const ordered = orderSheetPrChildren(xml);
    if (ordered !== xml) {
      entry.content = Buffer.from(ordered, 'utf8');
      repaired.push(entry.name);
    }
  }
  if (repaired.length) fs.writeFileSync(file, writeEntries(entries));
  return repaired;
}

/**
 * Returns the worksheet parts whose <sheetPr> children violate the schema
 * sequence. An empty array means the stored file is well ordered.
 */
function findSheetPrOrderViolations(file) {
  const violations = [];
  for (const entry of readEntries(fs.readFileSync(file))) {
    if (!isWorksheetPart(entry.name)) continue;
    const xml = entry.content.toString('utf8');
    if (orderSheetPrChildren(xml) !== xml) violations.push(entry.name);
  }
  return violations;
}

/**
 * Returns chart parts emitted beneath xl/drawings/charts. Excel desktop
 * rejects this package layout even though permissive OOXML readers accept it.
 * Governed workbooks must store charts beneath xl/charts.
 */
function findUnsupportedChartPartLocations(file) {
  return readEntries(fs.readFileSync(file))
    .map((entry) => entry.name)
    .filter((name) => /^xl\/drawings\/charts\/[^/]+\.xml$/.test(name));
}

/**
 * Writes an in-memory workbook and repairs the serializer's element ordering.
 * Every governed workbook mutation must use this instead of writeFile.
 */
async function writeWorkbookFile(workbook, file) {
  await workbook.xlsx.writeFile(file);
  return normalizeWorkbookFile(file);
}

module.exports = {
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
};

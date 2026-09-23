#!/usr/bin/env node
'use strict';

const path = require('node:path');
const ExcelJS = require('@excel.js/exceljs').default;
const { cellText, parseArgs, setGradientFill } = require('./lib');
const { writeWorkbookFile } = require('./xlsx-package');

const DEFAULT_OPTIONS = Object.freeze({
  sheetName: 'User Flows',
  startRow: 7,
  epicIdColumn: 1,
  epicNameColumn: 2,
  implementedColumn: 9,
  coveredColumn: 12,
  deferredColumn: 13,
  epicIdPattern: /^UF-\d+$/,
});

const COMPLETION_SUFFIX = /\s+\(\d{1,3}%\)$/;
const OVERALL_PROGRESS_RANGE = 'A3:N3';
const OVERALL_PROGRESS_CELL = 'A3';

const PROGRESS_PALETTE = Object.freeze({
  low: { start: 'FFF0A8A8', end: 'FFF7C8C8', border: 'FFB42318' },
  medium: { start: 'FFF2C66D', end: 'FFFFE5A9', border: 'FFB86E00' },
  high: { start: 'FF75C6A3', end: 'FFB9E5D2', border: 'FF147A58' },
  remaining: 'FFE8EEF5',
  text: 'FF10233D',
});

function baseFlowName(value) {
  return String(value || '').trim().replace(COMPLETION_SUFFIX, '').trim();
}

function isCompletedScenario(row, options = DEFAULT_OPTIONS) {
  return cellText(row.getCell(options.implementedColumn)).trim() === 'Yes' &&
    cellText(row.getCell(options.coveredColumn)).trim() === 'Yes' &&
    cellText(row.getCell(options.deferredColumn)).trim() !== 'Yes';
}

function collectFlowRanges(sheet, options = DEFAULT_OPTIONS) {
  const ranges = [];
  let current = null;
  for (let rowNumber = options.startRow; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const epicId = cellText(row.getCell(options.epicIdColumn)).trim();
    if (options.epicIdPattern.test(epicId)) {
      current = { headerRow: rowNumber, childRows: [] };
      ranges.push(current);
    } else if (current && row.hasValues) {
      current.childRows.push(rowNumber);
    }
  }
  return ranges;
}

function expectedFlowCompletion(sheet, flow, options = DEFAULT_OPTIONS) {
  const childRows = flow.childRows || flow.children || [];
  const total = childRows.length;
  const completed = childRows
    .filter((rowNumber) => isCompletedScenario(sheet.getRow(rowNumber), options))
    .length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const nameCell = sheet.getRow(flow.headerRow).getCell(options.epicNameColumn);
  const name = baseFlowName(cellText(nameCell));
  return {
    completed,
    total,
    percent,
    name,
    label: `${name} (${percent}%)`,
  };
}

function expectedOverallProgress(sheet, flows = collectFlowRanges(sheet), options = DEFAULT_OPTIONS) {
  const totals = flows.reduce((result, flow) => {
    const summary = expectedFlowCompletion(sheet, flow, options);
    result.completed += summary.completed;
    result.total += summary.total;
    return result;
  }, { completed: 0, total: 0 });
  const percent = totals.total ? Number(((totals.completed / totals.total) * 100).toFixed(1)) : 0;
  return {
    ...totals,
    percent,
    label: `OVERALL DELIVERY PROGRESS  ${percent.toFixed(1)}%  (${totals.completed} / ${totals.total} scenarios)`,
  };
}

function progressPalette(percent) {
  if (percent < 35) return PROGRESS_PALETTE.low;
  if (percent < 75) return PROGRESS_PALETTE.medium;
  return PROGRESS_PALETTE.high;
}

function progressGradient(percent) {
  const palette = progressPalette(percent);
  const position = Math.max(0, Math.min(1, percent / 100));
  if (position === 0) {
    return {
      type: 'gradient', gradient: 'angle', degree: 0,
      stops: [
        { position: 0, color: { argb: PROGRESS_PALETTE.remaining } },
        { position: 1, color: { argb: PROGRESS_PALETTE.remaining } },
      ],
    };
  }
  if (position === 1) {
    return {
      type: 'gradient', gradient: 'angle', degree: 0,
      stops: [
        { position: 0, color: { argb: palette.start } },
        { position: 1, color: { argb: palette.end } },
      ],
    };
  }
  return {
    type: 'gradient', gradient: 'angle', degree: 0,
    stops: [
      { position: 0, color: { argb: palette.start } },
      { position, color: { argb: palette.end } },
      { position: Math.min(1, position + 0.002), color: { argb: PROGRESS_PALETTE.remaining } },
      { position: 1, color: { argb: PROGRESS_PALETTE.remaining } },
    ],
  };
}

function synchronizeOverallProgressIndicator(sheet, flows, options = DEFAULT_OPTIONS) {
  const progress = expectedOverallProgress(sheet, flows, options);
  const cell = sheet.getCell(OVERALL_PROGRESS_CELL);
  if (cell.master.address !== OVERALL_PROGRESS_CELL) {
    throw new Error(`${OVERALL_PROGRESS_CELL} must be the master cell for the overall progress indicator`);
  }
  if (!sheet.getCell('N3').isMerged) sheet.mergeCells(OVERALL_PROGRESS_RANGE);
  cell.value = progress.label;
  cell.font = {
    name: 'Aptos Display',
    size: 16,
    bold: true,
    color: { argb: PROGRESS_PALETTE.text },
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  const palette = progressPalette(progress.percent);
  cell.border = {
    top: { style: 'thin', color: { argb: palette.border } },
    bottom: { style: 'thin', color: { argb: palette.border } },
  };
  setGradientFill(cell, progressGradient(progress.percent));
  sheet.getRow(3).height = 31.5;
  return progress;
}

function synchronizeFlowCompletionLabels(workbook, overrides = {}) {
  const options = { ...DEFAULT_OPTIONS, ...overrides };
  const sheet = workbook.getWorksheet(options.sheetName);
  if (!sheet) throw new Error(`worksheet ${options.sheetName} is missing`);
  const flows = collectFlowRanges(sheet, options);
  const summaries = [];
  for (const flow of flows) {
    const summary = expectedFlowCompletion(sheet, flow, options);
    if (!summary.name) throw new Error(`flow banner row ${flow.headerRow} has no name`);
    sheet.getRow(flow.headerRow).getCell(options.epicNameColumn).value = summary.label;
    summaries.push({ headerRow: flow.headerRow, ...summary });
  }
  synchronizeOverallProgressIndicator(sheet, flows, options);
  return summaries;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = path.resolve(args.file || path.join(__dirname, '..', 'legacy_user_flows.xlsx'));
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  const sheet = workbook.getWorksheet(DEFAULT_OPTIONS.sheetName);
  if (!sheet) throw new Error(`worksheet ${DEFAULT_OPTIONS.sheetName} is missing`);
  const flows = collectFlowRanges(sheet);
  const stale = [];
  for (const flow of flows) {
    const expected = expectedFlowCompletion(sheet, flow);
    const actual = cellText(sheet.getRow(flow.headerRow).getCell(DEFAULT_OPTIONS.epicNameColumn)).trim();
    if (actual !== expected.label) stale.push({ row: flow.headerRow, actual, expected: expected.label });
  }
  const overall = expectedOverallProgress(sheet, flows);
  const actualOverall = cellText(sheet.getCell(OVERALL_PROGRESS_CELL)).trim();
  const mergedOverall = sheet.getCell('N3').isMerged && sheet.getCell('N3').master.address === OVERALL_PROGRESS_CELL;
  if (actualOverall !== overall.label) {
    stale.push({ row: 3, actual: actualOverall, expected: overall.label });
  }
  if (!mergedOverall) {
    stale.push({ row: 3, actual: 'not merged', expected: OVERALL_PROGRESS_RANGE });
  }
  if (!args.write) {
    if (stale.length) {
      for (const item of stale) console.error(`row ${item.row}: "${item.actual}"; expected "${item.expected}"`);
      process.exitCode = 1;
      return;
    }
    console.log(`FLOW COMPLETION OK: ${flows.length} flow banners`);
    return;
  }
  const summaries = synchronizeFlowCompletionLabels(workbook);
  await writeWorkbookFile(workbook, file);
  console.log(`FLOW COMPLETION UPDATED: ${summaries.length} flow banners`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`FAIL: ${error.stack || error.message}`);
    process.exit(1);
  });
}

module.exports = {
  COMPLETION_SUFFIX,
  DEFAULT_OPTIONS,
  OVERALL_PROGRESS_CELL,
  OVERALL_PROGRESS_RANGE,
  baseFlowName,
  collectFlowRanges,
  expectedFlowCompletion,
  expectedOverallProgress,
  isCompletedScenario,
  synchronizeOverallProgressIndicator,
  synchronizeFlowCompletionLabels,
};

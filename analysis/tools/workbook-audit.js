#!/usr/bin/env node
'use strict';

const path = require('node:path');
const ExcelJS = require('@excel.js/exceljs').default;
const {
  AuditResult,
  COLORS,
  cellText,
  fillArgb,
  parseArgs,
  parseRefs,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  validateSchema,
} = require('./lib');
const {
  findDuplicateContentTypeOverrides,
  findSheetPrOrderViolations,
} = require('./xlsx-package');
const {
  expectedFlowCompletion,
  expectedOverallProgress,
  OVERALL_PROGRESS_CELL,
} = require('./workbook-progress');

const SOURCE_IMPLEMENTED_VALUES = Object.freeze(['Yes', 'No', 'Partial', 'Inferred']);

const DEFAULT_CONTRACT = Object.freeze({
  sheet: 'User Flows',
  dataStartRow: 7,
  epicIdPattern: '^UF-\\d+',
  columns: {
    epicId: 1,
    epicName: 2,
    epicStatus: 3,
    sourceImplemented: 7,
    implemented: 9,
    notes: 10,
    covered: 12,
    deferred: 13,
  },
  scenarioFill: { first: 4, last: 14 },
  epicFill: { first: 1, last: 14 },
  revision: {
    sheetPattern: '^Rev \\d+$',
    dataStartRow: 2,
    referenceColumn: 3,
    typeColumn: 4,
    coveredColumn: 7,
    implementedColumn: 8,
    evidenceColumn: 9,
    fillColumn: 1,
    fillFirst: 1,
    fillLast: 9,
    allowedTypes: ['gap', 'decision', 'deferred'],
  },
});

const WORKBOOK_CONTRACT_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    sheet: { const: DEFAULT_CONTRACT.sheet },
    dataStartRow: { const: DEFAULT_CONTRACT.dataStartRow },
    epicIdPattern: { const: DEFAULT_CONTRACT.epicIdPattern },
    columns: {
      type: 'object',
      properties: Object.fromEntries(Object.entries(DEFAULT_CONTRACT.columns)
        .map(([key, value]) => [key, { const: value }])),
      additionalProperties: false,
    },
    scenarioFill: {
      type: 'object',
      properties: {
        first: { const: DEFAULT_CONTRACT.scenarioFill.first },
        last: { const: DEFAULT_CONTRACT.scenarioFill.last },
      },
      additionalProperties: false,
    },
    epicFill: {
      type: 'object',
      properties: {
        first: { const: DEFAULT_CONTRACT.epicFill.first },
        last: { const: DEFAULT_CONTRACT.epicFill.last },
      },
      additionalProperties: false,
    },
    revision: {
      type: 'object',
      properties: {
        sheetPattern: { const: DEFAULT_CONTRACT.revision.sheetPattern },
        dataStartRow: { const: DEFAULT_CONTRACT.revision.dataStartRow },
        referenceColumn: { const: DEFAULT_CONTRACT.revision.referenceColumn },
        typeColumn: { const: DEFAULT_CONTRACT.revision.typeColumn },
        coveredColumn: { const: DEFAULT_CONTRACT.revision.coveredColumn },
        implementedColumn: { const: DEFAULT_CONTRACT.revision.implementedColumn },
        evidenceColumn: { const: DEFAULT_CONTRACT.revision.evidenceColumn },
        fillColumn: { const: DEFAULT_CONTRACT.revision.fillColumn },
        fillFirst: { const: DEFAULT_CONTRACT.revision.fillFirst },
        fillLast: { const: DEFAULT_CONTRACT.revision.fillLast },
        allowedTypes: {
          type: 'array',
          const: DEFAULT_CONTRACT.revision.allowedTypes,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

function mergeContract(override = {}) {
  return {
    ...DEFAULT_CONTRACT,
    ...override,
    columns: { ...DEFAULT_CONTRACT.columns, ...(override.columns || {}) },
    scenarioFill: { ...DEFAULT_CONTRACT.scenarioFill, ...(override.scenarioFill || {}) },
    epicFill: { ...DEFAULT_CONTRACT.epicFill, ...(override.epicFill || {}) },
    revision: { ...DEFAULT_CONTRACT.revision, ...(override.revision || {}) },
  };
}

function validateContract(override, contract) {
  const errors = validateSchema(WORKBOOK_CONTRACT_SCHEMA, override || {});
  const mainColumns = Object.values(contract.columns);
  if (new Set(mainColumns).size !== mainColumns.length) {
    errors.push('columns must map each canonical field to a distinct column');
  }
  for (const [label, range] of [
    ['scenarioFill', contract.scenarioFill],
    ['epicFill', contract.epicFill],
  ]) {
    if (range.first > range.last) errors.push(`${label}.first must not exceed ${label}.last`);
  }
  if (contract.revision.fillFirst > contract.revision.fillLast) {
    errors.push('revision.fillFirst must not exceed revision.fillLast');
  }
  const revisionColumns = [
    contract.revision.referenceColumn,
    contract.revision.typeColumn,
    contract.revision.coveredColumn,
    contract.revision.implementedColumn,
    contract.revision.evidenceColumn,
  ];
  if (new Set(revisionColumns).size !== revisionColumns.length) {
    errors.push('revision semantic columns must be distinct');
  }
  return errors;
}

function rowHasContent(row, first, last) {
  for (let column = first; column <= last; column += 1) {
    if (cellText(row.getCell(column)).trim()) return true;
  }
  return false;
}

function collectEpics(sheet, contract, result) {
  const pattern = new RegExp(contract.epicIdPattern);
  const epics = [];
  let populatedRows = 0;
  for (let rowNumber = contract.dataStartRow; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    if (!rowHasContent(row, contract.epicFill.first, contract.epicFill.last)) continue;
    populatedRows += 1;
    if (pattern.test(cellText(row.getCell(contract.columns.epicId)).trim())) {
      epics.push({ headerRow: rowNumber, children: [] });
    } else if (epics.length) {
      epics[epics.length - 1].children.push(rowNumber);
    } else {
      result.fail(`row ${rowNumber} contains scenario data before the first epic`);
    }
  }
  if (populatedRows > 0 && !epics.length) {
    result.fail(`sheet "${contract.sheet}" has no epic rows matching ${contract.epicIdPattern}`);
  }
  for (const epic of epics) {
    if (!epic.children.length) result.fail(`epic at row ${epic.headerRow} has no scenario rows`);
  }
  return epics;
}

function expectedScenario(row, contract) {
  const implemented = cellText(row.getCell(contract.columns.implemented)).trim() === 'Yes';
  const covered = cellText(row.getCell(contract.columns.covered)).trim() === 'Yes';
  const deferred = cellText(row.getCell(contract.columns.deferred)).trim() === 'Yes';
  return {
    implemented,
    covered,
    deferred,
    done: implemented && covered && !deferred,
    fill: implemented && covered && !deferred
      ? COLORS.GREEN
      : deferred
        ? COLORS.ORANGE
        : COLORS.RED,
  };
}

async function auditWorkbook(options = {}) {
  const result = new AuditResult('WORKBOOK AUDIT');
  const file = path.resolve(
    options.file ||
    process.env.WORKBOOK_FILE ||
    path.join(__dirname, '..', 'legacy_user_flows.xlsx')
  );
  const contract = mergeContract(options.contract);
  result.merge(validateContract(options.contract, contract), 'workbook contract ');
  if (!result.ok) return result;
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile(file);
  } catch (error) {
    result.fail(`cannot read workbook ${file}: ${error.message}`);
    return result;
  }

  // The library normalizes element order on read, so a workbook that Excel
  // refuses to open still parses here. Inspect the stored parts instead.
  try {
    for (const partName of findDuplicateContentTypeOverrides(file)) {
      result.fail(
        `[Content_Types].xml contains a duplicate Override for ${partName}; Excel Desktop will require workbook recovery`
      );
    }
    for (const part of findSheetPrOrderViolations(file)) {
      result.fail(
        `${part}: sheetPr children violate the CT_SheetPr sequence and Excel will refuse the file; write it with writeWorkbookFile from xlsx-package.js`
      );
    }
  } catch (error) {
    result.fail(`cannot inspect stored workbook parts of ${file}: ${error.message}`);
    return result;
  }

  const sheet = workbook.getWorksheet(contract.sheet);
  if (!sheet) {
    result.fail(`sheet "${contract.sheet}" not found`);
    return result;
  }
  if (sheet.pageSetup.orientation !== 'landscape') {
    result.fail(`sheet "${contract.sheet}" must use landscape page orientation`);
  }
  if (sheet.pageSetup.fitToPage !== true || sheet.pageSetup.fitToWidth !== 1) {
    result.fail(`sheet "${contract.sheet}" must use fit-to-page with fitToWidth = 1`);
  }
  if (sheet.properties.outlineProperties?.summaryBelow !== false) {
    result.fail(
      `sheet "${contract.sheet}" must use summaryBelow = false so each visible epic banner stays above its expandable detail rows`
    );
  }

  const epics = collectEpics(sheet, contract, result);
  const expectedOverall = expectedOverallProgress(sheet, epics, {
    implementedColumn: contract.columns.implemented,
    coveredColumn: contract.columns.covered,
    deferredColumn: contract.columns.deferred,
    epicNameColumn: contract.columns.epicName,
  });
  const actualOverall = cellText(sheet.getCell(OVERALL_PROGRESS_CELL)).trim();
  if (actualOverall !== expectedOverall.label) {
    result.fail(
      `overall progress indicator "${actualOverall}", expected "${expectedOverall.label}"`
    );
  }
  if (!sheet.getCell('N3').isMerged || sheet.getCell('N3').master.address !== OVERALL_PROGRESS_CELL) {
    result.fail('overall progress indicator must occupy the single merged cell A3:N3');
  }
  const detailRows = new Set(epics.flatMap((epic) => epic.children));
  const openRows = [];

  // A hidden banner hides a whole epic from anyone who opens the workbook, so
  // the collapsed view silently under-reports scope.
  for (const epic of epics) {
    if (sheet.getRow(epic.headerRow).hidden) {
      result.fail(`epic row ${epic.headerRow}: banner rows must stay visible when detail groups are collapsed`);
    }
  }

  for (const epic of epics) {
    for (const rowNumber of epic.children) {
      const row = sheet.getRow(rowNumber);
      if (!row.hidden || row.outlineLevel !== 1) {
        result.fail(
          `scenario row ${rowNumber}: detail rows must be collapsed inside outline level 1 so Excel shows the +/- hierarchy controls`
        );
      }
      const state = expectedScenario(row, contract);
      const notes = cellText(row.getCell(contract.columns.notes)).trim();
      if (!state.implemented) openRows.push(rowNumber);
      const sourceImplemented = cellText(row.getCell(contract.columns.sourceImplemented)).trim();
      if (sourceImplemented && !SOURCE_IMPLEMENTED_VALUES.includes(sourceImplemented)) {
        result.fail(
          `scenario row ${rowNumber}: Source implemented? is "${sourceImplemented}", expected one of ${SOURCE_IMPLEMENTED_VALUES.join(', ')}; put the justification in the evidence column`
        );
      }
      if (state.deferred && state.implemented) {
        result.fail(`scenario row ${rowNumber}: Implemented and Deferred cannot both be Yes`);
      }
      if (state.implemented && !state.covered) {
        result.fail(`scenario row ${rowNumber}: implemented work must also be Covered in SDD = Yes`);
      }
      if (state.deferred && !notes) {
        result.fail(`scenario row ${rowNumber}: deferred work requires a reason in the notes column`);
      }
      for (let column = contract.scenarioFill.first; column <= contract.scenarioFill.last; column += 1) {
        const actual = fillArgb(row.getCell(column));
        if (actual !== state.fill) {
          result.fail(`scenario row ${rowNumber} column ${column}: fill ${actual || 'none'}, expected ${state.fill}`);
        }
      }
    }
  }

  for (const epic of epics) {
    const states = epic.children.map((rowNumber) => expectedScenario(sheet.getRow(rowNumber), contract));
    const allDone = states.length > 0 && states.every((state) => state.done);
    const anyOpen = states.some((state) => !state.done && !state.deferred);
    const expectedFill = allDone ? COLORS.GREEN : anyOpen ? COLORS.RED : COLORS.ORANGE;
    const expectedStatus = allDone
      ? 'Passed'
      : anyOpen
        ? 'Not Passed - Open'
        : 'Not Passed - Deferred';
    const row = sheet.getRow(epic.headerRow);
    const expectedProgress = expectedFlowCompletion(sheet, epic, {
      implementedColumn: contract.columns.implemented,
      coveredColumn: contract.columns.covered,
      deferredColumn: contract.columns.deferred,
      epicNameColumn: contract.columns.epicName,
    });
    const actualName = cellText(row.getCell(contract.columns.epicName)).trim();
    if (actualName !== expectedProgress.label) {
      result.fail(
        `epic row ${epic.headerRow}: completion label "${actualName}", expected "${expectedProgress.label}"`
      );
    }
    for (let column = contract.epicFill.first; column <= contract.epicFill.last; column += 1) {
      const actual = fillArgb(row.getCell(column));
      if (actual !== expectedFill) {
        result.fail(`epic row ${epic.headerRow} column ${column}: fill ${actual || 'none'}, expected ${expectedFill}`);
      }
    }
    const actualStatus = cellText(row.getCell(contract.columns.epicStatus)).trim();
    if (actualStatus !== expectedStatus) {
      result.fail(`epic row ${epic.headerRow}: status "${actualStatus}", expected "${expectedStatus}"`);
    }
  }

  const revisionPattern = new RegExp(contract.revision.sheetPattern);
  const revisionSheets = workbook.worksheets.filter((candidate) => revisionPattern.test(candidate.name));
  const finalRevisionSheet = revisionSheets
    .map((sheet) => ({
      sheet,
      number: Number((sheet.name.match(/(\d+)$/) || [])[1] || 0),
    }))
    .sort((left, right) => right.number - left.number)[0]?.sheet;
  const finalWorklistRows = new Set();
  const findingHistory = new Map();
  for (const revisionSheet of revisionSheets) {
    const sheetNumber = Number((revisionSheet.name.match(/(\d+)$/) || [])[1] || 0);
    const idsInSheet = new Set();
    for (let rowNumber = contract.revision.dataStartRow; rowNumber <= revisionSheet.rowCount; rowNumber += 1) {
      const row = revisionSheet.getRow(rowNumber);
      if (!rowHasContent(row, contract.revision.fillFirst, contract.revision.fillLast)) continue;
      const findingId = cellText(row.getCell(contract.revision.fillColumn)).trim();
      if (!findingId) {
        result.fail(`${revisionSheet.name} row ${rowNumber}: finding id is required`);
      } else if (idsInSheet.has(findingId)) {
        result.fail(`${revisionSheet.name} row ${rowNumber}: duplicate finding id "${findingId}"`);
      } else {
        idsInSheet.add(findingId);
      }
      const references = parseRefs(cellText(row.getCell(contract.revision.referenceColumn)));
      if (!references.length) {
        result.fail(`${revisionSheet.name} row ${rowNumber}: no valid workbook row references`);
      }
      for (const reference of references) {
        if (!detailRows.has(reference)) {
          result.fail(`${revisionSheet.name} row ${rowNumber}: reference ${reference} is not a scenario row`);
        }
        if (revisionSheet === finalRevisionSheet) finalWorklistRows.add(reference);
      }

      const type = cellText(row.getCell(contract.revision.typeColumn)).trim().toLowerCase();
      if (!contract.revision.allowedTypes.includes(type)) {
        result.fail(`${revisionSheet.name} row ${rowNumber}: unsupported finding type "${type}"`);
      }
      const rowFill = fillArgb(row.getCell(contract.revision.fillColumn));
      for (let column = contract.revision.fillFirst; column <= contract.revision.fillLast; column += 1) {
        const actual = fillArgb(row.getCell(column));
        if (actual !== rowFill) {
          result.fail(`${revisionSheet.name} row ${rowNumber} column ${column}: non-uniform revision fill`);
        }
      }
      const implemented = cellText(row.getCell(contract.revision.implementedColumn)).trim() === 'Yes';
      const openFillByType = {
        gap: COLORS.RED,
        decision: COLORS.GRAY,
        deferred: COLORS.ORANGE,
      };
      if (rowFill !== COLORS.GREEN && rowFill !== openFillByType[type]) {
        result.fail(
          `${revisionSheet.name} row ${rowNumber}: ${type} finding fill ${rowFill || 'none'}, expected ${openFillByType[type]}`
        );
      }
      if (rowFill === COLORS.GREEN && !implemented) {
        result.fail(`${revisionSheet.name} row ${rowNumber}: green finding requires Implemented = Yes`);
      }
      if (rowFill !== COLORS.GREEN && implemented) {
        result.fail(`${revisionSheet.name} row ${rowNumber}: open finding requires Implemented = No`);
      }
      if (findingId) {
        const history = findingHistory.get(findingId) || [];
        history.push({
          sheet: revisionSheet,
          sheetNumber,
          rowNumber,
          open: rowFill !== COLORS.GREEN,
        });
        findingHistory.set(findingId, history);
      }
      if (rowFill === COLORS.GREEN) {
        const covered = cellText(row.getCell(contract.revision.coveredColumn)).trim() === 'Yes';
        const evidence = cellText(row.getCell(contract.revision.evidenceColumn)).trim();
        if (!covered) {
          result.fail(`${revisionSheet.name} row ${rowNumber}: green finding requires Covered in SDD = Yes`);
        }
        if (!evidence) {
          result.fail(`${revisionSheet.name} row ${rowNumber}: green finding requires closure evidence`);
        }
        for (const reference of references) {
          if (!detailRows.has(reference)) continue;
          const mainState = expectedScenario(sheet.getRow(reference), contract);
          if (!mainState.done && !mainState.deferred) {
            result.fail(
              `${revisionSheet.name} row ${rowNumber}: green finding references open main-sheet row ${reference}`
            );
          }
        }
      } else {
        for (const reference of references) {
          if (!detailRows.has(reference)) continue;
          const mainState = expectedScenario(sheet.getRow(reference), contract);
          if (mainState.done) {
            result.fail(
              `${revisionSheet.name} row ${rowNumber}: open finding references completed main-sheet row ${reference}`
            );
          }
        }
      }
    }
  }

  if (finalRevisionSheet) {
    for (const [findingId, history] of findingHistory) {
      const latest = history.sort((left, right) =>
        right.sheetNumber - left.sheetNumber || right.rowNumber - left.rowNumber)[0];
      if (latest.open && latest.sheet !== finalRevisionSheet) {
        result.fail(
          `unresolved finding "${findingId}" from ${latest.sheet.name} is missing from final revision sheet ${finalRevisionSheet.name}`
        );
      }
    }
  }

  const lifecycleStarted = [...detailRows].some((rowNumber) => {
    const row = sheet.getRow(rowNumber);
    return cellText(row.getCell(contract.columns.implemented)).trim() ||
      cellText(row.getCell(contract.columns.notes)).trim() ||
      cellText(row.getCell(contract.columns.covered)).trim() ||
      cellText(row.getCell(contract.columns.deferred)).trim();
  });
  if (lifecycleStarted || revisionSheets.length) {
    for (const rowNumber of openRows) {
      if (!finalWorklistRows.has(rowNumber)) {
        result.fail(`scenario row ${rowNumber}: open row is not referenced by the final revision sheet`);
      }
    }
  }

  result.summary = `Scenarios ${detailRows.size}; open ${openRows.length}; epics ${epics.length}; revision sheets ${revisionSheets.length}`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['file', 'config'], ['WORKBOOK_FILE']);
  let contract;
  try {
    contract = args.config ? readJsonFile(path.resolve(args.config)) : undefined;
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exit(1);
  }
  auditWorkbook({ file: args.file, contract })
    .then((result) => {
      process.exitCode = printResult(result);
    })
    .catch((error) => {
      console.error(`FAIL: ${error.stack || error.message}`);
      process.exitCode = 1;
    });
}

module.exports = {
  DEFAULT_CONTRACT,
  WORKBOOK_CONTRACT_SCHEMA,
  auditWorkbook,
  collectEpics,
  mergeContract,
  validateContract,
};

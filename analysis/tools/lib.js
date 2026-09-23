'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const YAML = require('yaml');

const COLORS = Object.freeze({
  GREEN: 'FFE2F0D9',
  ORANGE: 'FFFCE4D6',
  RED: 'FFFFC7CE',
  GRAY: 'FFEDEDED',
});

const STAGE_NAMES = Object.freeze({
  0: 'Bootstrap',
  1: 'Reconnaissance',
  2: 'Control reconnaissance',
  3: 'Live legacy walkthrough',
  4: 'Requirements revision',
  5: 'Application form and style',
  6: 'Wireframes',
  7: 'Wireframe control',
  8: 'Wireframe approval',
  9: 'Architecture requirements',
  10: 'Architecture control',
  11: 'Owner architecture review',
  12: 'Remark verification',
  13: 'Target knowledge synthesis',
  14: 'Target knowledge control',
  15: 'Design: SDD',
  16: 'Design re-verification',
  17: 'Build',
  18: 'Delivery and live reconciliation',
  19: 'Slice and final acceptance',
});

const PLACEHOLDER = /(?:\{\{[A-Z][A-Z0-9_.-]*\}\}|\b(?:TODO|TBD|FIXME)\b|YYYY-MM-DD|<(?![=]|\s*\d)(?!\/?(?:a|article|aside|b|body|button|code|div|em|footer|form|h[1-6]|head|header|html|i|img|input|label|li|link|main|meta|nav|ol|option|p|pre|script|section|select|small|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|title|tr|ul)\b)(?:[^>\n]*\s[^>\n]*|project|scope|version|value|references?|rows?|ids?|criterion|check|role|state|action|overlay|navigation|screen|element|channel|tool|finding|reason|requirement|tests?)>)/i;
const SHA256_PATTERN = '^[a-fA-F0-9]{64}$';
const DATE_PATTERN = '^\\d{4}-\\d{2}-\\d{2}$';
const SCOPE_PATTERN = '^[A-Za-z0-9][A-Za-z0-9._/-]*$';

const ajv = new Ajv2020({
  allErrors: true,
  allowUnionTypes: true,
  strict: true,
  strictRequired: false,
});
addFormats(ajv);
const schemaValidators = new Map();

function cellText(cell) {
  const value = cell.value;
  if (value == null) return '';
  if (typeof value === 'object' && Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text).join('');
  }
  if (typeof value === 'object' && value.text != null) return String(value.text);
  return String(value);
}

function fillArgb(cell) {
  const value = cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb;
  return value ? value.toUpperCase() : null;
}

function setFill(cell, argb) {
  const style = JSON.parse(JSON.stringify(cell.style || {}));
  style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
  cell.style = style;
}

function setGradientFill(cell, fill) {
  const style = JSON.parse(JSON.stringify(cell.style || {}));
  style.fill = JSON.parse(JSON.stringify(fill));
  cell.style = style;
}

function parseRefs(value) {
  const result = [];
  const normalized = String(value || '')
    .replace(/\b(?:row|rows)\s*/gi, '')
    .replace(/\u2013|\u2014/g, '-')
    .trim();
  for (const part of normalized.split(',')) {
    const match = part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) continue;
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    if (end < start) continue;
    for (let current = start; current <= end; current += 1) result.push(current);
  }
  return result;
}

function snapshot(worksheet, maxColumn = 15) {
  const result = new Map();
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    for (let column = 1; column <= maxColumn; column += 1) {
      const cell = row.getCell(column);
      result.set(
        `${rowNumber}:${column}`,
        `${JSON.stringify(cell.value ?? null)}|${fillArgb(cell) || '-'}`
      );
    }
  });
  return result;
}

function diffAgainst(worksheet, before, maxColumn = 15) {
  const differences = [];
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    for (let column = 1; column <= maxColumn; column += 1) {
      const key = `${rowNumber}:${column}`;
      const cell = row.getCell(column);
      const current = `${JSON.stringify(cell.value ?? null)}|${fillArgb(cell) || '-'}`;
      if (current !== (before.get(key) ?? 'null|-')) differences.push(key);
    }
  });
  return differences;
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function sha256Buffer(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function parseYamlFile(file) {
  if (!fs.existsSync(file)) throw new Error(`YAML file does not exist: ${file}`);
  const document = YAML.parseDocument(fs.readFileSync(file, 'utf8'), {
    maxAliasCount: 50,
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length) {
    throw new Error(document.errors.map((error) => error.message).join('; '));
  }
  return document.toJS({ maxAliasCount: 50 });
}

function readJsonFile(file) {
  if (!fs.existsSync(file)) throw new Error(`JSON file does not exist: ${file}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`${file} is not valid JSON: ${error.message}`);
  }
}

function formatAjvErrors(errors) {
  return (errors || []).map((error) => {
    const location = error.instancePath || '/';
    return `${location} ${error.message}`;
  });
}

function validateSchema(schema, value) {
  const cacheKey = JSON.stringify(schema);
  let validate = schemaValidators.get(cacheKey);
  if (!validate) {
    validate = ajv.compile(schema);
    schemaValidators.set(cacheKey, validate);
  }
  return validate(value) ? [] : formatAjvErrors(validate.errors);
}

function resolveInside(base, relative, label = 'path') {
  if (!isNonEmptyString(relative)) throw new Error(`${label} must be a non-empty string`);
  if (path.isAbsolute(relative)) throw new Error(`${label} must be relative: ${relative}`);
  const root = path.resolve(base);
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`${label} escapes ${root}: ${relative}`);
  }
  return resolved;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  const visit = (current) => {
    const entries = fs.readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isSymbolicLink()) {
        files.push(absolute);
      } else if (entry.isDirectory()) {
        visit(absolute);
      } else if (entry.isFile()) {
        files.push(absolute);
      }
    }
  };
  visit(directory);
  return files;
}

function parseArgs(argv) {
  const result = { _: [] };
  for (const argument of argv) {
    if (!argument.startsWith('--')) {
      result._.push(argument);
      continue;
    }
    const equals = argument.indexOf('=');
    if (equals === -1) {
      result[argument.slice(2)] = true;
    } else {
      result[argument.slice(2, equals)] = argument.slice(equals + 1);
    }
  }
  return result;
}

function rejectGovernedOverrides(args, argumentNames = [], environmentNames = []) {
  if (process.env.AUDIT_TEST_MODE === '1') return;
  const suppliedArguments = argumentNames.filter((name) => args[name] !== undefined);
  const suppliedEnvironment = environmentNames.filter((name) => process.env[name] !== undefined);
  if (suppliedArguments.length || suppliedEnvironment.length) {
    const details = [
      ...suppliedArguments.map((name) => `--${name}`),
      ...suppliedEnvironment,
    ].join(', ');
    throw new Error(
      `Governed audit target overrides are disabled outside AUDIT_TEST_MODE=1: ${details}`
    );
  }
}

function documentField(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(new RegExp(`^\\s*[-*]?\\s*${escaped}:\\s*\\x60?([^\\x60\\r\\n]+)\\x60?\\s*$`, 'im'));
  return match ? match[1].trim() : null;
}

class AuditResult {
  constructor(name) {
    this.name = name;
    this.errors = [];
    this.warnings = [];
    this.summary = '';
    this.skipped = false;
  }

  fail(message) {
    this.errors.push(message);
  }

  warn(message) {
    this.warnings.push(message);
  }

  merge(messages, prefix = '') {
    for (const message of messages) this.fail(`${prefix}${message}`);
  }

  get ok() {
    return this.errors.length === 0;
  }
}

function printResult(result) {
  for (const warning of result.warnings) console.log(`WARN: ${warning}`);
  if (!result.ok) {
    for (const error of result.errors) console.error(`FAIL: ${error}`);
    console.error(`${result.name} FAILED: ${result.errors.length} error(s).`);
    return 1;
  }
  if (result.summary) console.log(result.summary);
  console.log(`${result.name} ${result.skipped ? 'SKIPPED' : 'OK'}`);
  return 0;
}

module.exports = {
  AuditResult,
  COLORS,
  DATE_PATTERN,
  PLACEHOLDER,
  SCOPE_PATTERN,
  SHA256_PATTERN,
  STAGE_NAMES,
  cellText,
  diffAgainst,
  documentField,
  fillArgb,
  isNonEmptyString,
  parseArgs,
  parseRefs,
  parseYamlFile,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  resolveInside,
  setFill,
  setGradientFill,
  sha256Buffer,
  sha256File,
  snapshot,
  validateSchema,
  walkFiles,
};

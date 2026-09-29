'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { hasEvidencePlaceholders } = require('./evidence-placeholders');
const { PLACEHOLDER } = require('./lib');

const narrative = 'row 69 states dates are displayed and entered as yyyy-MM-dd';

// Exercise the actual caller's guards with only the proposed expression changed,
// without writing fixtures, changing the validator, or copying its guard logic.
const validator = fs.readFileSync(path.join(__dirname, 'status-validator.js'), 'utf8');
const start = validator.indexOf('function withoutCodeSpans(text) {');
const end = validator.indexOf('function independenceDeclaration(report) {', start);
assert(start >= 0 && end > start, 'status-validator evidence guards must be present');
const guards = validator.slice(start, end);
const oldProbe = 'PLACEHOLDER.test(withoutCodeSpans(text))';
const newProbe = 'hasEvidencePlaceholders(withoutCodeSpans(text))';
const probe = guards.includes(oldProbe) ? oldProbe : newProbe;
assert.equal(guards.split(probe).length, 2, 'find exactly the original or integrated probe');
const { withoutCodeSpans, templateOnlyEvidence } = vm.runInNewContext(
  guards.replace(probe, newProbe) + '\n({ withoutCodeSpans, templateOnlyEvidence });',
  { hasEvidencePlaceholders }
);

test('the real row 69 narrative is a format description, not an unfilled date', () => {
  assert.equal(PLACEHOLDER.test(narrative), true, 'reproduce the shared regex false positive');
  assert.equal(hasEvidencePlaceholders(narrative), false);
  assert.equal(templateOnlyEvidence(narrative), false);
  assert.equal(PLACEHOLDER.test(narrative), true, 'the shared placeholder rule is unchanged');
});

test('recognizes local prose date-format mentions in ordinary Markdown', () => {
  for (const prose of [
    'The date format is yyyy-MM-dd.',
    'The expected date format is YYYY-MM-DD.',
    'The date pattern uses yyyy-mm-dd.',
    'The date format (yyyy-MM-dd) is implemented.',
    'Date format: yyyy-MM-dd',
    '**Date format:** **yyyy-MM-dd**',
    'Input format = "yyyy-MM-dd"',
    'The parser accepts the yyyy-MM-dd date format.',
    'The yyyy-MM-dd pattern is used for displayed dates.',
    'Dates are formatted as yyyy-MM-dd.',
    'Dates are displayed in the yyyy-MM-dd format.',
    'Dates are entered in date format yyyy-MM-dd.',
    'Dates are displayed and entered as\nyyyy-MM-dd.',
    '- ' + narrative,
    '> ' + narrative,
    '| Row | Observation |\n| --- | --- |\n| 69 | ' + narrative + ' |',
    narrative + '. The input format is yyyy-MM-dd.',
    'Date format: yyyy-MM-dd\n\nApproved at: 2026-09-29',
    'Date: 2026-09-29\nThe date format is yyyy-MM-dd.',
  ]) {
    assert.equal(hasEvidencePlaceholders(prose), false, prose);
  }
});

test('unfinished date, approval and ratification fields fail closed in every case', () => {
  for (const date of ['yyyy-MM-dd', 'YYYY-MM-DD', 'yyyy-mm-dd', 'YyYy-mM-dD']) {
    for (const field of [
      date,
      'Date: ' + date,
      'Approval: ' + date,
      'Approved at: ' + date,
      'Approved on ' + date,
      'Owner approval date = ' + date,
      'Ratified: ' + date,
      'Ratified at: ' + date,
      'Ratified on ' + date,
      'Constitution ratification date: ' + date,
      '- **Date:** **' + date + '**',
      '> **Approved at:** ' + date,
      '1. Ratification date: ' + date,
      'Date:\n' + date,
      'Approval date: "' + date + '" (date format)',
      'Approval date: use the ' + date + ' format',
      'Ratified at: dates are displayed as ' + date,
      'Approval date ' + date + ' format',
      'Approval date: e.g. ' + date + ' format',
      'Ratified at: expected; ' + date + ' format',
      'approved_at: e.g. ' + date + ' format',
      'Approval date (UTC): e.g. ' + date + ' format',
      'Constitution ratification timestamp: expected; ' + date + ' format',
      'Ratified by the owner on ' + date + ' format',
      'Date:\nThe expected format is ' + date,
      '| Field | Value |\n| --- | --- |\n| Ratified at | ' + date + ' |',
      '| Approval date | Result |\n| --- | --- |\n| ' + date + ' | approved |',
      '| Field | Value |\n| --- | --- |\n| **Ratified at (UTC)** | ' + date + ' format |',
      '| Approval date | Result |\n| --- | --- |\n| ' + date + ' format | approved |',
    ]) {
      assert.equal(hasEvidencePlaceholders(field), true, field);
      assert.equal(templateOnlyEvidence(narrative + '\n\n' + field), true, field);
    }
  }
});

test('format wording cannot mask neighboring unfinished fields or other occurrences', () => {
  for (const prose of [
    'Date format: yyyy-MM-dd\nApproval: yyyy-MM-dd',
    'Date format: yyyy-MM-dd; ratified at: yyyy-MM-dd',
    'The yyyy-MM-dd format is used. Approved at: yyyy-MM-dd',
    'The date format is yyyy-MM-dd, approved at yyyy-MM-dd.',
    'Date: yyyy-MM-dd; the date format is yyyy-MM-dd',
    'Date: yyyy-MM-dd\nThe expected format is yyyy-MM-dd.',
    '| Date format | Approval date |\n| --- | --- |\n| yyyy-MM-dd | yyyy-MM-dd |',
    '| yyyy-MM-dd | format |',
    'The date format is yyyy-MM-dd.\n\n[record]: yyyy-MM-dd',
    'The date format is yyyy-MM-dd.\n\n<time datetime="yyyy-MM-dd">Approved</time>',
    'The date format is yyyy-MM-dd.\n\nDate: yyyy-MM-dd\n\n' + narrative,
  ]) {
    assert.equal(hasEvidencePlaceholders(prose), true, prose);
    assert.equal(templateOnlyEvidence(prose), true, prose);
  }
});

test('preserves all other shared placeholder branches, even beside a valid format', () => {
  for (const slot of [
    'TODO', 'todo', 'TBD', 'tbd', 'FIXME',
    '{{PROJECT_NAME}}', '{{DECISION.DATE}}', '{{APPROVAL_DATE}}',
    '<exact scope>', '<approval date>', '<project>', '<value>',
    '<date format yyyy-MM-dd>', '{{yyyy-MM-dd}}',
  ]) {
    for (const prose of [slot, narrative + '\n\n' + slot, slot + '\n\n' + narrative]) {
      assert.equal(PLACEHOLDER.test(prose), true, prose);
      assert.equal(hasEvidencePlaceholders(prose), true, prose);
      assert.equal(templateOnlyEvidence(prose), true, prose);
    }
  }
});

test('does not globally whitelist date literals, identifiers, HTML or URLs', () => {
  for (const prose of [
    'The date is yyyy-MM-dd.',
    'The owner approved this on yyyy-MM-dd.',
    'The constitution was ratified on yyyy-MM-dd.',
    'Expected format: prefixyyyy-MM-dd',
    'Expected format: yyyy-MM-ddsuffix',
    'Expected format: <yyyy-MM-dd>',
    'The date format is [yyyy-MM-dd](yyyy-MM-dd).',
    '[date format]: yyyy-MM-dd',
    '<div>Date format: yyyy-MM-dd</div>',
    'Date: yyyy-MM-dd\n\nThe date format is yyyy&#45;MM-dd.',
  ]) assert.equal(hasEvidencePlaceholders(prose), true, prose);
});

test('table field guards do not leak into observations or subsequent tables', () => {
  const prose = [
    '| Field | Value | Observation |',
    '| --- | --- | --- |',
    '| Date | 2026-09-29 | The input format is yyyy-MM-dd. |',
    '',
    '| Row | Observation |',
    '| --- | --- |',
    '| 69 | ' + narrative + ' |',
    '',
    narrative,
  ].join('\n');
  assert.equal(hasEvidencePlaceholders(prose), false);
  assert.equal(templateOnlyEvidence(prose), false);
});

test('unfinished fields remain rejected when table IDs or notes shift the field column', () => {
  for (const prose of [
    '| ID | Field | Value |\n| --- | --- | --- |\n| 1 | Approval date | yyyy-MM-dd format |',
    '| ID | Field | Notes | Value |\n| --- | --- | --- | --- |\n| 1 | Ratified at | Pending | yyyy-MM-dd format |',
    '| ID | Property | Value |\n| --- | --- | --- |\n| 1 | Date | The expected format is yyyy-MM-dd |',
    '| ID | **Field** | Notes | Value |\n| --- | --- | --- | --- |\n| 1 | Approval date | Owner recorded | yyyy-MM-dd format |',
    '| ID | Field | Notes | **Value** |\n| --- | --- | --- | --- |\n| 1 | Approval date | Owner recorded | yyyy-MM-dd format |',
    '| ID | *Field* | Notes | _Value_ |\n| --- | --- | --- | --- |\n| 1 | Approval date | Owner recorded | yyyy-MM-dd format |',
  ]) {
    assert.equal(hasEvidencePlaceholders(prose), true, prose);
    assert.equal(templateOnlyEvidence(narrative + '\n\n' + prose), true, prose);
  }
  const format = '| ID | Field | Value |\n| --- | --- | --- |\n| 1 | Date format | The input format is yyyy-MM-dd |';
  assert.equal(hasEvidencePlaceholders(format), false);
});

test('keeps the existing code and comment handling at the integration boundary', () => {
  for (const quoted of [
    '`<action path="/view/x">`',
    '`TODO TBD FIXME {{PROJECT_NAME}} YYYY-MM-DD`',
    '`<action\n path="/view/x">`',
    '```text\nTODO <exact scope> YYYY-MM-DD\n```',
    '~~~text\nTODO <exact scope> YYYY-MM-DD\n~~~',
    '    TODO <exact scope> YYYY-MM-DD',
    '\tTODO <exact scope> YYYY-MM-DD',
    '<!-- TODO <exact scope> YYYY-MM-DD -->',
  ]) {
    const prose = 'The report records the observed source behavior and exact checked scope.\n\n' + quoted;
    assert.equal(PLACEHOLDER.test(withoutCodeSpans(prose)), false, prose);
    assert.equal(templateOnlyEvidence(prose), false, prose);
    assert.equal(templateOnlyEvidence(prose + '\n\nApproval date: yyyy-MM-dd'), true, prose);
    assert.equal(templateOnlyEvidence(prose + '\n\nScope: <exact scope>'), true, prose);
  }
  assert.equal(templateOnlyEvidence('An unclosed ` starts here.\n\nDate: yyyy-MM-dd'), true);
  assert.equal(templateOnlyEvidence('An unclosed ` starts here.\n\nScope: <exact scope>'), true);
});

test('leaves empty and template-only evidence rejection to the unchanged caller', () => {
  for (const content of [
    '', ' \n\t ', '# Result', '# ---\n\n| : |',
    '<!-- The author has not supplied any visible evidence in this record. -->',
    '# Decision\n\nTODO: <exact scope>',
    '# Date\n\nyyyy-MM-dd',
  ]) assert.equal(templateOnlyEvidence(content), true, content);
  assert.equal(templateOnlyEvidence('The owner approved the exact documented scope on 2026-09-29.'), false);
});

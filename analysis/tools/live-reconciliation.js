'use strict';

const MarkdownIt = require('markdown-it');
const { PLACEHOLDER } = require('./lib');
const markdown = new MarkdownIt();
const requiredFields = ['Reconciled revision', 'Reconciled environment', 'Reconciled scope',
  'Reconciled by', 'Reconciled at', 'Live discovery evidence', 'Reconciliation result'];

function liveReconciliationErrors({ body, revision, environmentId }) {
  const errors = [];
  const fail = message => errors.push('Live Reconciliation: ' + message);
  const tokens = markdown.parse(body, {});
  const headings = tokens.flatMap((token, index) => token.type === 'heading_open'
    && token.tag === 'h2' && tokens[index + 1]?.content === 'Live Reconciliation' ? [index] : []);
  if (headings.length !== 1) {
    fail('exactly one required section is missing or duplicated; use the combined Stage 18 delivery template.');
    return errors;
  }
  const start = headings[0] + 3;
  const end = tokens.findIndex((token, index) => index >= start && token.type === 'heading_open' && ['h1', 'h2'].includes(token.tag));
  const contents = tokens.slice(start, end < 0 ? undefined : end);
  const fields = new Map();
  for (const token of contents.filter(item => item.type === 'inline')) {
    const colon = token.content.indexOf(':');
    const name = token.content.slice(0, colon);
    if (!requiredFields.includes(name)) continue;
    if (fields.has(name)) fail('duplicate field ' + name);
    fields.set(name, token.content.slice(colon + 1).trim().replace(/^`([^`]+)`$/, '$1'));
  }
  const filled = value => Boolean(value && !PLACEHOLDER.test(value)
    && !/<[^>\n]+>/.test(value) && !/^(?:-|none|n\/a|tbd|todo|pending)$/i.test(value));
  for (const name of requiredFields) if (!filled(fields.get(name))) fail(name + ' requires an explicit value.');
  if (fields.get('Reconciled revision') !== revision) fail('revision must match the delivered revision.');
  if (fields.get('Reconciled environment') !== environmentId) fail('environment must match the delivered environment.');
  const at = fields.get('Reconciled at') || '';
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(at)
      || !Number.isFinite(Date.parse(at)) || Date.parse(at) > Date.now()) fail('Reconciled at requires a past ISO timestamp with timezone.');
  if (fields.get('Reconciliation result') !== 'clean') fail('findings, blocked or unchecked scope prevent delivery closure.');

  const tables = [];
  let table, row;
  for (const token of contents) {
    if (token.type === 'table_open') { table = []; tables.push(table); }
    if (token.type === 'tr_open') { row = []; table.push(row); }
    if (token.type === 'inline' && table && row) row.push(token.content);
    if (token.type === 'tr_close') row = null;
    if (token.type === 'table_close') table = null;
  }
  const coverage = tables.filter(rows => rows[0]?.[0] === 'Check ID');
  if (coverage.length !== 1 || coverage[0].length < 2) fail('one non-empty coverage table beginning with Check ID is required.');
  else {
    const expected = ['Check ID', 'Surface / role / action', 'Approved expectation and source',
      'Actual observation and evidence', 'Evidence origin', 'Applicability or repeat reason', 'Outcome', 'Finding or decision'];
    if (JSON.stringify(coverage[0][0]) !== JSON.stringify(expected)) fail('coverage table columns must follow the delivery template.');
    const ids = new Set();
    for (const cells of coverage[0].slice(1)) {
      if (cells.length !== expected.length || !cells.slice(0, 6).every(filled)) {
        fail('every coverage row needs a check, scope, expectation, observation, origin and applicability/repeat reason.');
        continue;
      }
      if (ids.has(cells[0])) fail('duplicate check ID ' + cells[0]);
      ids.add(cells[0]);
      if (!['delivery-check', 'additional-live-check', 'mixed'].includes(cells[4])) fail('unknown evidence origin for ' + cells[0]);
      if (!['match', 'authorized-exclusion'].includes(cells[6])) fail('unresolved coverage outcome for ' + cells[0]);
      if (cells[6] === 'authorized-exclusion' && !filled(cells[7])) fail('an exclusion needs its exact permitted authority and scope, not a passed-test claim.');
    }
  }
  return errors;
}

module.exports = { liveReconciliationErrors, requiredFields };

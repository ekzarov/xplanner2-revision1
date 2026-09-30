'use strict';

const MarkdownIt = require('markdown-it');
const { PLACEHOLDER } = require('./lib');

const markdown = new MarkdownIt({ html: true });
const DATE_LITERAL = /^yyyy-mm-dd$/i;
const FORMAT_LABEL = /^(?:(?:expected|required|date|time|date-time|input|output|display|storage)[ -])*(?:format|pattern)(?: string)?$/i;
const DATE_FIELD = /^(?:(?:owner|constitution|last|decision)[ _-])*(?:date|dated|timestamp|approved|approval|ratified|ratification|authorized|authorization|amended|signed|signature)(?:[ _-](?:date|time|timestamp|at|on|by))*$/i;
const DATE_ACTION = /\b(?:approved|ratified|authorized|signed|amended|dated)(?: by .+)? (?:on|at)\s*["']?$/i;
const FORMAT_BEFORE = /\b(?:(?:format|pattern)(?: string)?(?: (?:is|was|of|uses?|requires?))?|(?:formatted|displayed|entered|shown|rendered|stored|parsed)(?: and (?:formatted|displayed|entered|shown|rendered|stored|parsed))? (?:as|in)(?: (?:the|a))?(?: (?:date )?(?:format|pattern))?)\s*\(?["']?$/i;
const FORMAT_AFTER = /^["']?\s*(?:date[ -])?(?:format|pattern)\b/i;

function isDateFieldLabel(text) {
  const label = text.replace(/[*_]/g, ' ').replace(/\s+/g, ' ').trim();
  return !FORMAT_LABEL.test(label) &&
    /\b(?:date|dated|timestamp|approved|approval|ratified|ratification|authorized|authorization|amended|signed|signature)\b/i.test(label);
}

function isFormatMention(content, match) {
  const start = match.index;
  const end = start + match[0].length;
  if (/\w/.test(content[start - 1] || '') || /\w/.test(content[end] || '')) return false;

  // Keep the exception local to this clause. Formatting emphasis is harmless,
  // but a field assignment must not borrow a nearby description of its format.
  const lines = content.slice(0, start).replace(/[*_]/g, ' ').split(/\r?\n/);
  const current = lines.at(-1).replace(/\s+/g, ' ').trim();
  const previous = (lines.at(-2) || '').replace(/\s+/g, ' ').trim();
  const label = current.match(/^([^:=]+)[:=]/);
  const continuedLabel = previous.match(/^([^:=]+)[:=]\s*$/);
  if (label && isDateFieldLabel(label[1])) return false;
  if (continuedLabel && isDateFieldLabel(continuedLabel[1])) return false;
  const before = (current || previous).split(/[.;!?|]/).at(-1).trim();
  const after = content.slice(end).split(/[.;!?|\n]/)[0]
    .replace(/[*_]/g, '').trim();
  const field = before.match(/^(.+?)\s*[:=]\s*(.*)$/);
  if (field) return FORMAT_LABEL.test(field[1].trim()) && /^["']?$/.test(field[2]);
  if (DATE_FIELD.test(before) || DATE_ACTION.test(before)) return false;
  return FORMAT_BEFORE.test(before) || FORMAT_AFTER.test(after);
}

/**
 * Probe evidence prose AFTER the caller's existing withoutCodeSpans(text).
 * This replaces only the PLACEHOLDER probe, not the empty/meaningful-text gate.
 */
function hasEvidencePlaceholders(prose) {
  const matches = [...prose.matchAll(new RegExp(PLACEHOLDER.source, 'gi'))];
  if (matches.some(match => !DATE_LITERAL.test(match[0]))) return true;
  if (!matches.length) return false;

  // Only account for literal occurrences in Markdown inline content. Anything
  // unaccounted for (HTML, link definitions, bare dates, etc.) stays fail-closed.
  // Inspect raw inline content so entity decoding cannot invent exempt dates.
  let formatMentions = 0;
  let headers = [];
  let row = [];
  let inHeader = false;
  let inTable = false;
  for (const token of markdown.parse(prose, {})) {
    if (token.type === 'table_open') { inTable = true; headers = []; }
    if (token.type === 'table_close') inTable = false;
    if (token.type === 'thead_open') inHeader = true;
    if (token.type === 'thead_close') inHeader = false;
    if (token.type === 'tr_open') row = [];
    if (token.type !== 'inline') continue;
    if (inTable) {
      const column = row.length;
      row.push(token.content);
      if (inHeader) headers.push((token.children || [])
        .filter(child => ['text', 'code_inline'].includes(child.type))
        .map(child => child.content).join(''));
      const fieldColumn = headers.findIndex(header => /^(field|property|attribute|key|name)$/i.test(header.trim()));
      const valueColumn = /^(value|actual value|recorded value|result)$/i.test((headers[column] || '').trim());
      const fieldLabel = valueColumn && fieldColumn >= 0 && fieldColumn < column
        ? row[fieldColumn] : row[column - 1];
      if (!inHeader && (isDateFieldLabel(headers[column] || '') ||
          (column > 0 && isDateFieldLabel(fieldLabel || '')))) continue;
    }
    for (const match of token.content.matchAll(/yyyy-mm-dd/gi)) {
      if (isFormatMention(token.content, match)) formatMentions += 1;
    }
  }
  return formatMentions !== matches.length;
}

module.exports = { hasEvidencePlaceholders };

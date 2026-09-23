'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const { AuditResult } = require('./lib');
const { markdownStructure, htmlStructure } = require('./methodology-link-audit');
const parser = new MarkdownIt();
const columns = ['Check', 'When applicable', 'Basis', 'How to check'];

function checklistRows(source) {
  const tables = [];
  let table, row;
  const tokens = parser.parse(source, {});
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'table_open') { table = []; tables.push(table); }
    if (token.type === 'tr_open') {
      row = [];
      row.raw = lines[token.map[0]];
      row.line = token.map[0];
    }
    if (token.type === 'th_open' || token.type === 'td_open') row.push(tokens[i + 1]);
    if (token.type === 'tr_close') table.push(row);
  }
  return tables;
}

function cellText(cell) {
  return (cell.children || []).filter(t => ['text', 'code_inline'].includes(t.type))
    .map(t => t.content).join(' ').replace(/\s+/g, ' ').trim();
}

function markdownAnchors(file) {
  const structure = markdownStructure(file);
  const anchors = new Set(structure.explicitAnchors), used = new Set();
  for (const heading of structure.headings) {
    const text = cellText(parser.parseInline(heading.text, {})[0]);
    // GitHub anchors preserve repeated hyphens and underscores, unlike outline labels.
    const base = text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    let anchor = base, suffix = 0;
    while (used.has(anchor)) anchor = base + '-' + ++suffix;
    used.add(anchor);
    anchors.add(anchor);
  }
  return anchors;
}

function validateChecklist(source, { root, file, empty = false } = {}) {
  const errors = [], tables = checklistRows(source);
  if (tables.length !== 1) return { errors: ['Use exactly one four-column checklist table'], count: 0 };
  const [header, ...rows] = tables[0];
  const tableLines = new Set(tables[0].map(row => row.line));
  for (const [line, text] of source.split(/\r?\n/).entries()) {
    if (!tableLines.has(line) && /\bCHK-\d{3,}\b/.test(text)) errors.push('CHK entry outside the checklist table at line ' + (line + 1));
  }
  if (JSON.stringify(header.map(cellText)) !== JSON.stringify(columns)) errors.push('Columns must be exactly: ' + columns.join(' / '));
  if (empty && rows.length) errors.push('The starter template must contain no project findings or example rows');
  const ids = new Set(), checks = new Set();
  for (const cells of rows) {
    const values = cells.map(cellText);
    // Markdown-it pads short rows and discards surplus cells; validate the source width too.
    const sourceCells = cells.raw.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/);
    if (sourceCells.length !== 4) errors.push('Every source row must contain exactly four cells');
    if (cells.length !== 4 || values.some(value => !value)) { errors.push('Every row needs four nonempty cells'); continue; }
    const id = values[0].match(/^CHK-\d{3,}\b/)?.[0];
    if (!id || ids.has(id)) errors.push('Missing or duplicate CHK ID: ' + values[0]);
    ids.add(id);
    if (!values[0].replace(/^CHK-\d+\s*[.:-]?\s*/, '').trim()) errors.push(id + ': write the check, not just its ID');
    const normalized = values.slice(0, 2).join(' ').replace(/^CHK-\d+/, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    if (checks.has(normalized)) errors.push(id + ': duplicate check and applicability; reuse or refine the existing row');
    checks.add(normalized);
    for (const index of [0, 1, 3]) if (values[index].split(/\s+/).length > 60) errors.push(id + ': keep cells short; details belong in linked instructions');
    const links = (cells[2].children || []).filter(t => t.type === 'link_open').map(t => t.attrGet('href'));
    if (new Set(links).size < 2) errors.push(id + ': Basis must link the confirmed finding/correction and the governing rule');
    for (const href of links) {
      if (/^https?:\/\//i.test(href)) continue;
      if (/^[a-z][a-z\d+.-]*:/i.test(href)) { errors.push(id + ': unsupported basis link ' + href); continue; }
      if (!root || !file) continue;
      let relative, fragment;
      try {
        relative = decodeURIComponent(href.split(/[?#]/)[0]);
        fragment = decodeURIComponent(href.split('#')[1] || '');
      } catch { errors.push(id + ': invalid basis URL'); continue; }
      const target = path.resolve(path.dirname(file), relative || path.basename(file));
      const boundary = path.relative(root, target);
      if (boundary.startsWith('..' + path.sep) || boundary === '..' || path.isAbsolute(boundary) || !fs.existsSync(target)) {
        errors.push(id + ': missing or outside-project basis ' + href);
        continue;
      }
      if (!fs.statSync(target).isFile()) { errors.push(id + ': basis must identify a file ' + href); continue; }
      if (fragment) {
        let anchors;
        if (/\.md$/i.test(target)) {
          anchors = markdownAnchors(target);
        } else if (/\.html?$/i.test(target)) anchors = htmlStructure(target).ids;
        if (!anchors?.has(fragment)) errors.push(id + ': missing or unsupported local basis anchor ' + href);
      }
    }
  }
  return { errors, count: rows.length };
}

function auditErrorPrevention({ root = path.resolve(__dirname, '../..') } = {}) {
  const result = new AuditResult('ERROR PREVENTION AUDIT');
  const template = path.join(root, 'analysis/error-prevention-checklist.template.md');
  const checklist = path.join(root, 'analysis/error-prevention-checklist.md');
  const files = [{ file: template, empty: true }];
  if (!fs.existsSync(path.join(root, '.migration-starter-source')) || fs.existsSync(checklist)) files.push({ file: checklist, empty: false });
  let count = 0;
  for (const { file, empty } of files) {
    if (!fs.existsSync(file)) { result.fail('Missing ' + path.relative(root, file)); continue; }
    const checked = validateChecklist(fs.readFileSync(file, 'utf8'), { root, file, empty });
    for (const error of checked.errors) result.fail(path.relative(root, file) + ': ' + error);
    if (!empty) count = checked.count;
  }
  result.summary = `${count} project checks; structure only, not semantic review or executed self-check`;
  return result;
}

if (require.main === module) {
  const result = auditErrorPrevention();
  for (const error of result.errors) console.error('FAIL: ' + error);
  console.log(result.summary);
  process.exitCode = result.ok ? 0 : 1;
}
module.exports = { validateChecklist, auditErrorPrevention };

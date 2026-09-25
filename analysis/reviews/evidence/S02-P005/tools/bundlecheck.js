// Reviewer-authored CHK-004 check: for every row with a per-bundle note, compute actual key presence per bundle.
'use strict';
const fs = require('fs');
const dir = __dirname + '/war/WEB-INF/classes/';
const bundles = { default: 'ResourceBundle.properties', '--': 'ResourceBundle--.properties', da: 'ResourceBundle_da.properties', de: 'ResourceBundle_de.properties', es: 'ResourceBundle_es.properties', fr: 'ResourceBundle_fr.properties', it: 'ResourceBundle_it.properties', ja: 'ResourceBundle_ja.properties', pt_br: 'ResourceBundle_pt_br.properties', ru: 'ResourceBundle_ru.properties' };
const keys = {};
for (const [b, f] of Object.entries(bundles)) {
  keys[b] = new Set();
  for (const l of fs.readFileSync(dir + f, 'latin1').split(/\r?\n/)) { const m = /^\s*([^#!\s=:][^=:\s]*)\s*[=:]/.exec(l); if (m) keys[b].add(m[1]); }
}
const rows = require('./workbook-rows.json').rows.filter(r => r.type === 'scenario' && /Locale variants|Label per bundle|Per bundle/.test(r.evidence));
const out = [];
for (const r of rows) {
  const note = r.evidence.slice(r.evidence.search(/Locale variants|Label per bundle|Per bundle/));
  // candidate keys: dotted identifiers in the note that exist in at least one bundle
  const cands = [...new Set((note.match(/[a-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)+/g) || []))].filter(k => Object.values(keys).some(s => s.has(k)));
  // expand "authentication.module.message.userNotFound and passwordNotSet" style suffixes
  const presence = cands.map(k => k + ': ' + Object.keys(bundles).filter(b => keys[b].has(k)).join(','));
  out.push({ row: r.row, keys: presence, note: note.slice(0, 600) });
}
fs.writeFileSync(__dirname + '/bundlecheck.txt', out.map(o => 'R' + o.row + '\n  ACTUAL ' + o.keys.join(' | ') + '\n  NOTE ' + o.note).join('\n') + '\n');
console.log('rows with per-bundle notes:', out.length);

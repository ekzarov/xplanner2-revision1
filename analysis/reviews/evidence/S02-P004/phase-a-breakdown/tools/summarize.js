// Compact per-class summary from classdump (reviewer-owned, read-only over scratch).
// usage: node summarize.js <classPrefix> [--calls] [--all]
'use strict';
const fs = require('fs'); const path = require('path');
const dir = path.join(__dirname, 'classdump');
const prefix = process.argv[2] || '';
const withCalls = process.argv.includes('--calls');
const all = process.argv.includes('--all');
const skip = /^(java\/lang\/(Object|StringBuilder|StringBuffer|String|Integer|Long|Double|Boolean|Math)|java\/util\/(Iterator|List|ArrayList|Map|HashMap|Collection|Set|HashSet)|org\/apache\/log4j|org\/apache\/commons\/logging)/;
for (const f of fs.readdirSync(dir).sort()) {
  if (!f.startsWith(prefix)) continue;
  const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
  const outl = [];
  outl.push(lines[0].replace(/ access=.*$/, ''));
  let cur = null; let strs = new Set(); let calls = new Set(); let anns = [];
  const flush = () => {
    if (cur && (strs.size || (withCalls && calls.size) || anns.length || all)) {
      outl.push('  ' + cur + (anns.length ? ' ' + anns.join(' ') : ''));
      if (strs.size) outl.push('    S: ' + [...strs].map(s => JSON.stringify(s)).join(' | '));
      if (withCalls && calls.size) outl.push('    C: ' + [...calls].join(' ; '));
    }
    strs = new Set(); calls = new Set(); anns = [];
  };
  for (const l of lines.slice(1)) {
    if (l.startsWith('  METHOD ')) { flush(); cur = l.slice(9).replace(/ acc=.*$/, ''); continue; }
    if (l.startsWith('  FIELD ')) { if (/ = /.test(l)) outl.push('  F ' + l.slice(8).replace(/ acc=0x[0-9a-f]+/, '')); continue; }
    if (l.startsWith('  ANN ')) { outl.push('  ' + l.trim()); continue; }
    if (!cur) continue;
    const t = l.trim();
    if (t.startsWith('STR ')) { const v = JSON.parse(t.slice(4)); if (!v.startsWith('class:java/')) strs.add(v); }
    else if (t.startsWith('CALL ')) { const c = t.slice(5); if (!skip.test(c)) calls.add(c.replace(/\(.*$/, '')); }
    else if (t.startsWith('ANN ')) anns.push(t.slice(4).replace(/^@L/, '@').replace(/;(\{|$)/, '$1'));
  }
  flush();
  console.log(outl.join('\n'));
}

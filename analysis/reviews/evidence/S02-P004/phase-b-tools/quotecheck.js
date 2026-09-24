// Reviewer-owned check: quoted UI texts in workbook column F exist in the default bundle, EmailResourceBundle or JSP/class strings.
'use strict';
const fs = require('fs'); const path = require('path'); const S = __dirname; const war = path.join(S, 'war');
const unesc = s => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\(.)/g, '$1');
const corpus = [fs.readFileSync(path.join(war, 'WEB-INF/classes/ResourceBundle.properties'), 'latin1'), fs.readFileSync(path.join(war, 'WEB-INF/classes/EmailResourceBundle.properties'), 'latin1')].map(unesc).join('\n');
const cls = fs.readdirSync(path.join(S, 'classdump')).map(f => fs.readFileSync(path.join(S, 'classdump', f), 'utf8')).join('\n');
const rows = JSON.parse(fs.readFileSync(path.join(S, 'workbook-rows.json'), 'utf8'));
const norm = s => s.replace(/<[^>]+>/g, '').replace(/\{\d\}|<[^>]*>|\.\.\.|…/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const nc = norm(corpus), ncl = norm(cls);
let n = 0, ok = 0; const bad = [];
for (const r of rows) { if (r.r < 7 || r.outline !== 1) continue; const f = (r.cells.F || '') + ' ' + (r.cells.D || '');
  for (const m of f.matchAll(/"([^"]{6,})"/g)) { const q = m[1]; if (/^[a-z]+\.[a-z_.]+$/.test(q) || /\//.test(q) && !/ /.test(q)) continue; n++;
    const parts = norm(q).split(/\s*<[^>]*>\s*|\.\.\./).map(x => x.trim()).filter(x => x.length > 3);
    if (parts.every(p => nc.includes(p) || ncl.includes(p))) ok++; else bad.push('row ' + r.r + ': "' + q + '"'); } }
console.log('quoted texts', n, 'found', ok, 'not found', bad.length); for (const b of bad) console.log(b);

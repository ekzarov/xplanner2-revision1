// Reviewer-owned read-only xlsx reader (BA-002-04). Parses the unzipped workbook copy in reviewer-scratch/xlsx.
'use strict';
const fs = require('fs'); const path = require('path');
const d = path.join(__dirname, 'xlsx', 'xl');
const dec = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&amp;/g, '&');
const ss = []; const sx = fs.readFileSync(path.join(d, 'sharedStrings.xml'), 'utf8');
sx.replace(/<si>([\s\S]*?)<\/si>/g, (_, si) => { let t = ''; si.replace(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g, (__, x) => { t += x; return ''; }); ss.push(dec(t)); return ''; });
const sh = fs.readFileSync(path.join(d, 'worksheets', 'sheet1.xml'), 'utf8');
const rows = [];
sh.replace(/<row\s([^>]*)>([\s\S]*?)<\/row>|<row\s([^>]*)\/>/g, (_, ra, body, ra2) => {
  const a = ra || ra2; const r = +/r="(\d+)"/.exec(a)[1]; const ol = (/outlineLevel="(\d+)"/.exec(a) || [0, 0])[1];
  const cells = {};
  (body || '').replace(/<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g, (__, ca, cb) => {
    const ref = /r="([A-Z]+)\d+"/.exec(ca)[1]; const t = (/\st="(\w+)"/.exec(ca) || [])[1];
    let v = null; if (cb) { const vm = /<v>([\s\S]*?)<\/v>/.exec(cb); const im = /<is>([\s\S]*?)<\/is>/.exec(cb); if (t === 's' && vm) v = ss[+vm[1]]; else if (t === 'inlineStr' && im) { let x = ''; im[1].replace(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g, (___, y) => { x += y; return ''; }); v = dec(x); } else if (vm) v = dec(vm[1]); }
    if (v !== null && v !== '') cells[ref] = v; return '';
  });
  rows.push({ r, outline: +ol, cells }); return '';
});
fs.writeFileSync(path.join(__dirname, 'workbook-rows.json'), JSON.stringify(rows, null, 1));
const detail = rows.filter(x => x.r >= 7 && x.outline === 1);
const epics = rows.filter(x => x.r >= 7 && x.outline === 0 && x.cells.A);
console.log('rows', rows.length, 'detail', detail.length, 'epics', epics.length);
const cnt = {}; for (const x of detail) { const g = x.cells.G || '(blank)'; cnt[g] = (cnt[g] || 0) + 1; } console.log(JSON.stringify(cnt));
for (const x of rows.filter(x => x.r <= 6)) console.log(x.r, JSON.stringify(x.cells).slice(0, 400));

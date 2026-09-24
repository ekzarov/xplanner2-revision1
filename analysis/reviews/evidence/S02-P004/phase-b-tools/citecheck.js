// Reviewer-owned citation checker (BA-002-04 Phase B; CHK-001 and CHK-003-style existence checks).
// Inputs: workbook-rows.json (parsed copy of the pinned workbook) and the pinned reconnaissance text.
// For each citation "<file>:<lines>" resolvable to a WAR file: file exists, every cited line exists and is non-blank,
// and when the citation is followed by a parenthesis, at least one identifier token from it occurs in the cited range.
// For each "class <fqcn|Simple>#<method>" citation: class exists and each named method exists.
'use strict';
const fs = require('fs'); const path = require('path'); const S = __dirname; const war = path.join(S, 'war');
const files = []; (function w(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) w(p); else files.push(path.relative(war, p).split(path.sep).join('/')); } })(war);
const byBase = {}; for (const f of files) { const b = f.split('/').pop(); (byBase[b] = byBase[b] || []).push(f); }
const lines = f => fs.readFileSync(path.join(war, f), 'latin1').split(/\r?\n/);
const classes = JSON.parse(fs.readFileSync(path.join(S, 'classes.json'), 'utf8'));
const clsByFq = {}, clsBySimple = {}; for (const c of classes) { const fq = c.cls.replace(/\//g, '.'); clsByFq[fq] = c; const s = fq.split('.').pop(); (clsBySimple[s] = clsBySimple[s] || []).push(fq); }
const methodsOf = fq => { const t = fs.readFileSync(path.join(S, 'classdump', fq + '.txt'), 'utf8'); return new Set([...t.matchAll(/^  METHOD ([^(]+)\(/gm)].map(m => m[1])); };
const sources = [];
const rows = JSON.parse(fs.readFileSync(path.join(S, 'workbook-rows.json'), 'utf8'));
for (const r of rows) if (r.r >= 7 && r.outline === 1) sources.push({ where: 'row ' + r.r, text: [r.cells.D, r.cells.E, r.cells.F, r.cells.H].filter(Boolean).join(' || ') });
const recon = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/); recon.forEach((l, i) => sources.push({ where: 'recon:' + (i + 1), text: l }));
const res = { fileCites: 0, fileOk: 0, fileFail: [], ambiguous: [], classCites: 0, classOk: 0, classFail: [], unresolvedFiles: [] };
const fileRe = /(?:WAR:)?((?:[\w.\-]+\/)*[\w.\-]+\.(?:xml|jsp|properties|js|tld|wsdd|vm|tag|css|html|txt|MF))((?::\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)+)(\s*\(([^)]*)\))?/g;
for (const s of sources) {
  let m; fileRe.lastIndex = 0;
  while ((m = fileRe.exec(s.text))) {
    let f = m[1].replace(/^WAR:/, ''); const spec = m[2]; const paren = m[4] || '';
    if (/^(legacy|analysis|\.migration-tmp)\//.test(f) || /^(README\.md|docker-compose)/.test(f)) continue;
    let cands = files.includes(f) ? [f] : files.filter(x => x.endsWith('/' + f) || x === f);
    if (!cands.length) { res.unresolvedFiles.push(s.where + ' ' + f + spec); continue; }
    if (cands.length > 1) { res.ambiguous.push(s.where + ' ' + f + spec + ' -> ' + cands.join('|')); continue; }
    const L = lines(cands[0]);
    // spec may contain several ":a-b" groups (e.g. :32-38 and :194-196 separated by text are separate matches)
    const ranges = spec.split(':').filter(Boolean).join(',').split(',').filter(Boolean).map(x => x.split('-').map(Number));
    for (const [a, b0] of ranges) {
      const b = b0 || a; res.fileCites++;
      if (a < 1 || b > L.length || b < a) { res.fileFail.push(s.where + ' ' + cands[0] + ':' + a + (b0 ? '-' + b0 : '') + ' (file has ' + L.length + ' lines)'); continue; }
      const seg = L.slice(a - 1, b).join('\n');
      if (!seg.trim()) { res.fileFail.push(s.where + ' ' + cands[0] + ':' + a + ' blank'); continue; }
      if (paren && ranges.length === 1) {
        const toks = [...new Set((paren.match(/[A-Za-z_][\w.\-]{3,}/g) || []).filter(t => !/^(line|lines|and|the|with|from|only|also|shows|uses|link|value|default|forward|forwards|comment|commented|absent|ABSENT|redirect|string|strings|class|this|that|then|when|each|live)$/i.test(t)))];
        if (toks.length && !toks.some(t => seg.includes(t) || seg.toLowerCase().includes(t.toLowerCase()))) { res.fileFail.push(s.where + ' ' + cands[0] + ':' + a + (b0 ? '-' + b0 : '') + ' tokens not found: ' + toks.slice(0, 6).join(',')); continue; }
      }
      res.fileOk++;
    }
  }
  const cRe = /class(?:es)? ((?:com|net|org)\.[\w.$]+|[A-Z][\w$]+)((?:#[\w<>$]+(?:\/#?[\w<>$]+)*)?)/g;
  while ((m = cRe.exec(s.text))) {
    const name = m[1].replace(/\.$/, ''); const meth = m[2];
    let fq = clsByFq[name] ? name : null;
    if (!fq && !name.includes('.')) { const c = clsBySimple[name] || []; if (c.length === 1) fq = c[0]; else if (c.length > 1) { fq = c[0]; } }
    if (!fq) { if (/^(com|net)\.(technoetic|sf\.xplanner|sabre|tacitknowledge)/.test(name)) { res.classCites++; res.classFail.push(s.where + ' missing class ' + name); } continue; }
    res.classCites++;
    if (meth) { const ms = methodsOf(fq); const want = meth.split(/[#/]/).filter(Boolean); const miss = want.filter(w => !ms.has(w)); if (miss.length) { res.classFail.push(s.where + ' ' + fq + ' missing method(s) ' + miss.join(',')); continue; } }
    res.classOk++;
  }
}
fs.writeFileSync(path.join(S, 'citecheck.json'), JSON.stringify(res, null, 1));
console.log('file cites', res.fileCites, 'ok', res.fileOk, 'fail', res.fileFail.length, 'ambiguous', res.ambiguous.length, 'unresolved', res.unresolvedFiles.length);
console.log('class cites', res.classCites, 'ok', res.classOk, 'fail', res.classFail.length);
for (const x of res.fileFail) console.log('FILE ' + x); for (const x of res.classFail) console.log('CLASS ' + x);
for (const x of res.unresolvedFiles.slice(0, 40)) console.log('UNRES ' + x); for (const x of res.ambiguous.slice(0, 20)) console.log('AMB ' + x);

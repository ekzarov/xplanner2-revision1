// Reviewer-authored read-only citation checker (CHK-001 style) over the workbook rows and the reconnaissance.
'use strict';
const fs = require('fs'), path = require('path');
const W = __dirname + '/war';
const rows = require('./workbook-rows.json').rows.filter(r => r.type === 'scenario');
const recon = fs.readFileSync('C:/Work/Legacy/xplanner2-revision1/analysis/legacy_reconnaissance.md', 'utf8');
const dis = fs.readFileSync(__dirname + '/dis/all.txt', 'utf8');
// class -> method names
const classes = {};
{ let cur = null; for (const l of dis.split('\n')) { let m;
  if ((m = /^class (\S+)/.exec(l))) { cur = m[1]; classes[cur] = classes[cur] || new Set(); }
  else if (cur && (m = /^  method .*? ([\w$<>]+)\(/.exec(l))) classes[cur].add(m[1]); } }
const simple = {}; for (const c of Object.keys(classes)) { const s = c.split('.').pop(); (simple[s] = simple[s] || []).push(c); }
const fileCache = {};
const lines = f => { if (!(f in fileCache)) { const p = path.join(W, f); fileCache[f] = fs.existsSync(p) && fs.statSync(p).isFile() ? fs.readFileSync(p, 'latin1').split('\n') : null; } return fileCache[f]; };
const exts = 'xml|jsp|properties|js|tld|tag|wsdd|html|css|MF|txt|dtd|xls|jar|swf|log|vm|png|jspi';
const results = { lineCites: 0, lineFail: [], fileFail: [], contentUnmatched: [], classCites: 0, classFail: [], methodFail: [] };
function checkText(where, text) {
  // file:line citations, including continuation ":NN" after a file reference
  const re = new RegExp('(?:WAR:)?((?:WEB-INF|META-INF|js|css|calendar|images|ui|flash|files)/[A-Za-z0-9_\\-./]+?\\.(?:' + exts + ')|index\\.jsp|editTimeEntries\\.js|time\\.js|toggle\\.js|overlib\\.js)((?::[\\d][\\d,\\-]*)?)', 'g');
  let m, last = null, lastEnd = 0;
  const toks = [];
  while ((m = re.exec(text))) toks.push({ file: m[1], ranges: m[2] ? m[2].slice(1) : null, idx: m.index, end: re.lastIndex });
  // continuation citations like ", :194-196" or "and :54-58" referring to the previous file
  const cont = /(?:^|[\s,(;])and?\s*:(\d[\d,\-]*)|[,;(]\s*:(\d[\d,\-]*)/g;
  while ((m = cont.exec(text))) {
    const prev = toks.filter(t => t.end <= m.index).pop();
    if (prev) toks.push({ file: prev.file, ranges: m[1] || m[2], idx: m.index, end: cont.lastIndex, cont: true });
  }
  for (const t of toks) {
    const L = lines(t.file);
    if (L === null) { if (!/ABSENT|absent|missing|MISSING/.test(text.slice(Math.max(0, t.idx - 5), t.end + 30))) results.fileFail.push(where + ' ' + t.file); continue; }
    if (!t.ranges) continue;
    for (const part of t.ranges.split(',').filter(Boolean)) {
      const [a, b] = part.split('-').map(Number); results.lineCites++;
      const hi = b || a;
      if (!(a >= 1 && hi <= L.length && hi >= a)) { results.lineFail.push(where + ' ' + t.file + ':' + part + ' (file has ' + L.length + ' lines)'); continue; }
      // content heuristic: identifiers in the parenthesis right after the citation
      const after = text.slice(t.end, t.end + 260);
      const pm = /^\s*\(([^)]*)\)/.exec(after);
      if (pm) {
        const ids = (pm[1].match(/[A-Za-z_][A-Za-z0-9_.\-]{3,}/g) || []).filter(x => !/^(line|lines|with|from|only|also|then|when|this|that|each|none|both|the|and|for|not|are|has|have|shipped|value|values|comment|commented|blocks?|see|row|rows|file|ABSENT)$/i.test(x));
        if (ids.length) {
          const seg = L.slice(a - 1, hi).join('\n').toLowerCase();
          if (!ids.some(x => seg.includes(x.toLowerCase().replace(/[.\-]+$/, '')))) results.contentUnmatched.push(where + ' ' + t.file + ':' + part + ' ids=' + ids.slice(0, 5).join(','));
        }
      }
    }
  }
  // class#member citations
  const cre = /(?:class(?:es)? )?((?:com|net|org)\.[\w.$]+|\b[A-Z][\w$]+)#([\w$<>]+)((?:\/#?[\w$<>]+)*)/g;
  while ((m = cre.exec(text))) {
    const cn = m[1]; let full = classes[cn] ? cn : null;
    if (!full && !cn.includes('.') && simple[cn]) full = simple[cn].find(c => classes[c].has(m[2])) || simple[cn][0];
    if (!full) { if (/^(org\.|javax?\.)/.test(cn) || /^(ActionMapping|Session|HttpServletResponse|HttpServletRequest|Authorizer|Query|Criteria|FilterChain|ServletRequest|Properties)$/.test(cn)) continue; results.classFail.push(where + ' ' + cn); continue; }
    results.classCites++;
    const ms = [m[2]].concat((m[3] || '').split('/').filter(Boolean).map(x => x.replace(/^#/, '')));
    for (const mm of ms) if (!classes[full].has(mm) && !['init'].includes(mm)) results.methodFail.push(where + ' ' + full + '#' + mm);
  }
}
for (const r of rows) checkText('R' + r.row, [r.requirement, r.expected, r.evidence].join(' '));
recon.split('\n').forEach((l, i) => checkText('recon:' + (i + 1), l));
// JSP coverage: which of the 73 JSPs are named in row evidence
const jsps = require('./jsps.json').pages.map(p => p.file).filter(f => /\.jsp$/.test(f));
const ev = rows.map(r => r.evidence).join('\n');
const uncited = jsps.filter(f => !ev.includes(f) && !ev.includes(f.replace(/^WEB-INF\/jsp\//, '')) && !ev.includes(path.basename(f)));
const out = { lineCites: results.lineCites, lineFail: results.lineFail, fileFail: [...new Set(results.fileFail)], contentUnmatched: results.contentUnmatched, classCites: results.classCites, classFail: [...new Set(results.classFail)], methodFail: [...new Set(results.methodFail)], jspTotal: jsps.length, jspUncitedByName: uncited };
fs.writeFileSync(__dirname + '/citecheck.json', JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify({ lineCites: out.lineCites, lineFail: out.lineFail.length, fileFail: out.fileFail.length, contentUnmatched: out.contentUnmatched.length, classCites: out.classCites, classFail: out.classFail.length, methodFail: out.methodFail.length, jspTotal: out.jspTotal, jspUncited: uncited.length }));

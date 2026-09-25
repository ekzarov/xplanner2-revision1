// Enumerate JSP/JSPF/tag/HTML pages in the extracted WAR: includes, forms, action links, DB tags, scriptlets (reviewer-authored).
'use strict';
const fs = require('fs'), path = require('path');
const W = __dirname + '/war';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); const s = fs.statSync(p); if (s.isDirectory()) walk(p); else if (/\.(jsp|jspi|jspf|tag|html|htm)$/i.test(f)) files.push(p); } })(W);
const rel = p => path.relative(W, p).replace(/\\/g, '/');
const out = [];
for (const f of files.sort()) {
  const raw = fs.readFileSync(f, 'latin1');
  const s = raw.replace(/<%--[\s\S]*?--%>/g, m => m.replace(/[^\n]/g, ' ')).replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
  const lines = s.split('\n');
  const find = (re, g = 1) => { const r = []; lines.forEach((l, i) => { let m; const rr = new RegExp(re.source, 'g' + (re.ignoreCase ? 'i' : '')); while ((m = rr.exec(l))) r.push((i + 1) + ':' + (m[g] || m[0]).trim().slice(0, 160)); }); return r; };
  const uniq = a => [...new Set(a.map(x => x.replace(/^\d+:/, '')))];
  out.push({
    file: rel(f), lines: raw.split('\n').length,
    taglibs: uniq(find(/<%@\s*taglib[^%]*prefix\s*=\s*"([^"]+)"/)),
    includes: find(/(?:<%@\s*include\s+file\s*=\s*"([^"]+)"|<jsp:include\s+page\s*=\s*"([^"]+)"|<tiles:insert[^>]*?(?:page|definition|template)\s*=\s*"([^"]+)")/, 0).map(x => x.replace(/\s+/g, ' ')),
    forms: find(/<(?:html:form|form)\b[^>]*?action\s*=\s*"([^"]+)"/i),
    doLinks: uniq(find(/(?:page|action|href|forward)\s*=\s*"((?:\/do)?\/(?:view|edit|delete|export|move|start|close|continue|import|search|download|mobile|logout|login|changeLocale|admin|setting|soap|ical|rest)[^"?]*)/)),
    dbTags: find(/<db:(useBeans?)\b([^>]*)>/, 0).map(x => x.replace(/\s+/g, ' ')),
    scriptletLines: find(/<%(?![@-])([\s\S]{0,140})/).length,
    scriptletCalls: find(/((?:ThreadSession|HibernateHelper|getSession\(\)|\.save\(|\.delete\(|\.update\(|getParameter\(|getBean\(|Class\.forName|Runtime|System\.getProperty|getRealPath|new java\.io|FileInputStream|setAttribute\()[^;%]{0,80})/),
    unescapedEL: find(/(\$\{\s*(?:param|header|cookie)[^}]*\})/),
    filterFalse: find(/(filter\s*=\s*"false")/).length,
  });
}
fs.writeFileSync(__dirname + '/jsps.json', JSON.stringify({ count: out.length, pages: out }, null, 1) + '\n');
console.log('pages', out.length);

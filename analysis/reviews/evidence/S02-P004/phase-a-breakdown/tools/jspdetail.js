// Reviewer-owned JSP detail extractor (BA-002-04 / S02-P004). Read-only over scratch WAR copy.
// Prints, per JSP (JSP comments removed), form input names, message keys, authorization tags with
// the /do link they guard, logic conditions and db:useBean(s) queries. Line numbers refer to the shipped JSP.
'use strict';
const fs = require('fs'); const path = require('path');
const war = path.join(__dirname, 'war');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(jsp|tag)$/.test(f)) files.push(p); } })(war);
for (const p of files.sort()) {
  const rel = path.relative(war, p).split(path.sep).join('/');
  let raw = fs.readFileSync(p, 'latin1');
  // blank out JSP comments but keep line structure
  raw = raw.replace(/<%--[\s\S]*?--%>/g, m => m.replace(/[^\n]/g, ' '));
  raw = raw.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
  const lines = raw.split('\n');
  const out = [];
  const inputs = new Set(), keys = new Set();
  lines.forEach((l, i) => {
    let m;
    const re1 = /<(?:html:(?:text|password|textarea|select|checkbox|hidden|file|radio|submit|multibox)|input|select|textarea)\b[^>]*?\b(?:property|name)="([^"<]+)"/g;
    while ((m = re1.exec(l))) inputs.add(m[1]);
    const re2 = /key="([^"<]+)"/g; while ((m = re2.exec(l))) keys.add(m[1]);
    if (/isUserAuthorized|isUserInRole|isUserAuthorizedForAny|logic:(equal|notEqual|present|notPresent|greaterThan|empty|notEmpty)|db:useBeans?\b|<%\s*if|propertyEqual/.test(l)) out.push('  L' + (i + 1) + ': ' + l.trim().slice(0, 220));
  });
  console.log('== ' + rel);
  if (inputs.size) console.log('  inputs: ' + [...inputs].join(', '));
  if (keys.size) console.log('  keys: ' + [...keys].join(', '));
  for (const o of out) console.log(o);
}

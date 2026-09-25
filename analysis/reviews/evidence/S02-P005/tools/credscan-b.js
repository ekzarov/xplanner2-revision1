// Credential-leak scan (reviewer-authored). Extracts credential VALUES from source locations at runtime,
// never prints them, and reports only counts of occurrences in the reviewer's new evidence files.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = 'C:/Work/Legacy/xplanner2-revision1';
const WAR = ROOT + '/.migration-tmp/stage-02-p005/reviewer-scratch/war';
const LEG = ROOT + '/.migration-tmp/stage-02-p005/phase-a/legacy';
const vals = new Set();
const add = v => { if (v && v.trim().length >= 3) vals.add(v.trim()); };
// properties files: any key containing "password" or "pwd"
// message bundles hold UI labels about passwords, not credentials, so they are excluded
for (const f of fs.readdirSync(WAR + '/WEB-INF/classes').filter(f => /\.properties$/.test(f) && !/ResourceBundle/.test(f))) {
  for (const line of fs.readFileSync(WAR + '/WEB-INF/classes/' + f, 'latin1').split(/\r?\n/)) {
    const m = /^\s*([^#!=:\s][^=:]*?)\s*[=:]\s*(.*)$/.exec(line);
    if (m && /(password|pwd|secret)/i.test(m[1])) add(m[2]);
  }
}
// Axis admin password
{ const s = fs.readFileSync(WAR + '/WEB-INF/server-config.wsdd', 'utf8'); const m = /name="adminPassword"\s+value="([^"]*)"/.exec(s); if (m) add(m[1]); }
// Liquibase seeded password column
{ const s = fs.readFileSync(WAR + '/WEB-INF/classes/db-changelog.xml', 'utf8'); let m; const re = /name="password"\s+value="([^"]*)"/g; while ((m = re.exec(s))) add(m[1]); }
// docker-compose env and healthcheck
{ const s = fs.readFileSync(LEG + '/docker-compose.yml', 'utf8'); let m; const re = /PASSWORD\s*=\s*(\S+)/g; while ((m = re.exec(s))) add(m[1]); const h = /"-p([^"]+)"/.exec(s); if (h) add(h[1]); }
// README default login pair (password part after the slash inside bold markup)
{ const s = fs.readFileSync(LEG + '/README.md', 'utf8').split(/\r?\n/)[37] || ''; const m = /\*\*\s*([^*\/\s:]+)\s*\/\s*([^*\s]+)\s*\*\*/.exec(s); if (m) { add(m[2]); vals.add(m[1] + ' / ' + m[2]); vals.add(m[1] + '/' + m[2]); vals.add(m[1] + ':' + m[2]); } }
const targets = process.argv.slice(2);
const files = [];
for (const t of targets) { (function walk(p) { const st = fs.statSync(p); if (st.isDirectory()) fs.readdirSync(p).forEach(f => walk(path.join(p, f))); else files.push(p); })(t); }
// raw = any substring occurrence (common-word values such as a DB user name also occur as ordinary words);
// credential-context = value within 40 chars after a password-like marker, or a login-pair form.
const esc = v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ctxRe = [...vals].map(v => new RegExp('(pass(word|wd)?|pwd|-p|adminPassword|secret)[^\\n]{0,40}' + esc(v), 'gi'));
let total = 0, ctx = 0; const per = [];
for (const f of files) {
  const s = fs.readFileSync(f, 'latin1'); let n = 0, c = 0;
  for (const v of vals) { let i = -1; while ((i = s.indexOf(v, i + 1)) !== -1) n++; }
  for (const r of ctxRe) { c += (s.match(r) || []).length; }
  total += n; ctx += c; if (n || c) per.push(path.basename(f) + ': raw=' + n + ' credential-context=' + c);
}
console.log(JSON.stringify({ credential_values_extracted: vals.size, files_scanned: files.length, raw_substring_hits: total, credential_context_hits: ctx, files_with_hits: per }));

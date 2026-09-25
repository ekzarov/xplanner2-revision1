// Summarize disassembly: per method, list invoked members, field refs, strings, catches (dedup, order kept).
// Usage: node summ.js <classPathFragment> [...]   (reads dis/all.txt)
'use strict';
const fs = require('fs');
const all = fs.readFileSync(__dirname + '/dis/all.txt', 'utf8').split('\n');
const want = process.argv.slice(2);
const SKIP = /^(java\.lang\.(StringBuffer|StringBuilder|Object\.<init>|String\.valueOf|Integer\.valueOf|Integer\.intValue|Boolean\.valueOf|Boolean\.booleanValue|Double\.valueOf|Double\.doubleValue)|org\.apache\.log4j\.Logger\.(isDebugEnabled|debug|getLogger))/;
let cur = null, on = false, out = [];
function flush(m) { if (!m) return; out.push('  ' + m.sig + (m.items.length ? '\n    ' + m.items.join('\n    ') : '')); }
let m = null;
for (const line of all) {
  if (line.startsWith('=== ')) {
    flush(m); m = null;
    on = want.some(w => line.endsWith('/' + w + '.class'));
    if (on) out.push(line.replace('=== war/WEB-INF/classes/', '### '));
    continue;
  }
  if (!on) continue;
  if (line.startsWith('class ')) { out.push(line); continue; }
  if (line.startsWith('  field ')) { out.push(line); continue; }
  if (line.startsWith('  method ')) { flush(m); m = { sig: line.trim().replace(/^method /, 'M '), items: [], seen: new Set() }; continue; }
  if (!m) { if (/@annotations/.test(line)) out.push(line); continue; }
  const t = line.trim();
  let item = null;
  let r;
  if ((r = /^\d+: invoke\w+ (.*)$/.exec(t))) { if (!SKIP.test(r[1])) item = 'call ' + r[1].replace(/:\(.*$/, '()'); }
  else if ((r = /^\d+: (get|put)(field|static) (.*)$/.exec(t))) item = r[1] + ' ' + r[3].replace(/:.*$/, '');
  else if ((r = /^\d+: ldc\w* (".*")$/.exec(t))) item = 'str ' + r[1];
  else if ((r = /^\d+: new (.*)$/.exec(t))) { if (!/StringBuffer|StringBuilder/.test(r[1])) item = 'new ' + r[1]; }
  else if ((r = /^\d+: (instanceof|checkcast) (.*)$/.exec(t))) item = r[1] + ' ' + r[2];
  else if (t.startsWith('catch ')) item = t.replace(/ \[.*$/, '');
  else if (t.startsWith('// @annotations')) item = t;
  else if (t.startsWith('// throws')) item = t;
  if (item && !m.seen.has(item)) { m.seen.add(item); m.items.push(item); }
}
flush(m);
process.stdout.write(out.join('\n') + '\n');

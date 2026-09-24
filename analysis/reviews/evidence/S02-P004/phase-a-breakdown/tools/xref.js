// Reviewer-owned cross-reference checker (BA-002-04 / S02-P004). Read-only over scratch copies.
// 1) class names referenced by active (comment-stripped) XML config -> exist in WEB-INF/classes or a bundled jar?
// 2) JSP/resource paths referenced by struts/tiles/web.xml forwards -> exist in WAR?
'use strict';
const fs = require('fs'); const path = require('path');
const war = path.join(__dirname, 'war');
const classes = new Set();
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.class')) classes.add(path.relative(path.join(war, 'WEB-INF', 'classes'), p).split(path.sep).join('/').replace(/\.class$/, '')); } })(path.join(war, 'WEB-INF', 'classes'));
const jarIdx = new Map();
for (const l of fs.readFileSync(path.join(__dirname, 'jar-index.txt'), 'utf8').split(/\r?\n/)) { if (!l) continue; const [j, e] = l.split('\t'); jarIdx.set(e.replace(/\.class$/, ''), j); }
const warFiles = new Set();
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else warFiles.add('/' + path.relative(war, p).split(path.sep).join('/')); } })(war);
const cfgs = ['WEB-INF/web.xml', 'WEB-INF/struts-config.xml', 'WEB-INF/mobile-struts-config.xml', 'WEB-INF/test-struts-config.xml', 'WEB-INF/action-servlet.xml', 'WEB-INF/test-action-servlet.xml', 'WEB-INF/classes/spring-beans.xml', 'WEB-INF/classes/spring-dao.xml', 'WEB-INF/classes/spring-security.xml', 'WEB-INF/classes/spring-caching.xml', 'WEB-INF/classes/spring-web.xml', 'WEB-INF/server-config.wsdd', 'WEB-INF/sun-jaxws.xml', 'WEB-INF/xplanner.tld', 'WEB-INF/xplanner-db.tld', 'WEB-INF/xplannerplus-functions.tld', 'WEB-INF/tiles-definitions.xml', 'WEB-INF/tiles-pages.xml', 'WEB-INF/classes/log4j-war.xml', 'WEB-INF/classes/ehcache.xml', 'WEB-INF/sun-web.xml', 'WEB-INF/geronimo-web.xml', 'META-INF/context.xml'];
const out = { classRefs: [], pathRefs: [] };
const clsRe = /\b((?:com|net|org|de|javax|java|liquibase)\.[A-Za-z0-9_]+(?:\.[A-Za-z0-9_$]+)+)\b/g;
const pathRe = /(?:path|page|location|input|value|definitions-config)="(\/[^"]+?\.(?:jsp|jspi|png|gif|html|xml))"/g;
for (const c of cfgs) {
  const f = path.join(war, c); if (!fs.existsSync(f)) { out.classRefs.push({ cfg: c, missingConfig: true }); continue; }
  const raw = fs.readFileSync(f, 'utf8');
  const txt = raw.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
  const lines = txt.split('\n');
  lines.forEach((ln, i) => {
    let m; clsRe.lastIndex = 0;
    while ((m = clsRe.exec(ln))) {
      let n = m[1].replace(/\.(xml|xsd|dtd|properties|jsp)$/, '');
      if (/^(org\.springframework\.schema|java\.sun\.com|org\.apache\.struts\.action\.(GLOBAL|ERROR|MESSAGE))/.test(n)) continue;
      if (/\.(com|org|net)$/.test(n)) continue;
      const slash = n.replace(/\./g, '/');
      let where = classes.has(slash) ? 'WEB-INF/classes' : (jarIdx.get(slash) || null);
      if (!where && /^java\//.test(slash)) where = 'JRE';
      if (!where && /^javax\/(servlet|security|xml|persistence|sql)/.test(slash)) where = 'container/JRE (not bundled)';
      out.classRefs.push({ cfg: c, line: i + 1, name: n, found: where || 'NOT FOUND' });
    }
    pathRe.lastIndex = 0;
    while ((m = pathRe.exec(ln))) { out.pathRefs.push({ cfg: c, line: i + 1, path: m[1], exists: warFiles.has(m[1]) }); }
  });
}
// dedupe
const seen = new Set(); out.classRefs = out.classRefs.filter(r => { const k = r.cfg + '|' + r.name + '|' + r.line; if (seen.has(k)) return false; seen.add(k); return true; });
fs.writeFileSync(path.join(__dirname, 'xref.json'), JSON.stringify(out, null, 1));
const miss = out.classRefs.filter(r => r.found === 'NOT FOUND');
console.log('classRefs', out.classRefs.length, 'notFound', miss.length);
for (const r of miss) console.log('  MISSING CLASS', r.cfg + ':' + r.line, r.name);
const pm = out.pathRefs.filter(r => !r.exists);
console.log('pathRefs', out.pathRefs.length, 'missing', pm.length);
for (const r of pm) console.log('  MISSING PATH', r.cfg + ':' + r.line, r.path);
// positive control
console.log('positive-control class com/technoetic/xplanner/actions/EditObjectAction:', classes.has('com/technoetic/xplanner/actions/EditObjectAction'), '; jar org/apache/struts/action/Action:', jarIdx.get('org/apache/struts/action/Action'), '; path /WEB-INF/jsp/view/projects.jsp:', warFiles.has('/WEB-INF/jsp/view/projects.jsp'));

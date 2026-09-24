// Reviewer-owned figure regeneration (BA-002-04 Phase B, CHK-007). Read-only over scratch copies.
'use strict';
const fs = require('fs'); const path = require('path'); const S = __dirname; const war = path.join(S, 'war');
const files = []; (function w(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) w(p); else files.push(path.relative(war, p).split(path.sep).join('/')); } })(war);
const ext = {}; for (const f of files) { const e = (f.match(/\.([^./]+)$/) || [0, '(none)'])[1].toLowerCase(); ext[e] = (ext[e] || 0) + 1; }
console.log('files', files.length, JSON.stringify(ext));
const strip = t => t.replace(/<!--[\s\S]*?-->/g, '');
const rd = p => strip(fs.readFileSync(path.join(war, p), 'utf8'));
const sc = rd('WEB-INF/struts-config.xml');
console.log('form-beans', (sc.match(/<form-bean\s/g) || []).length, 'global forwards', (/<global-forwards[\s\S]*?<\/global-forwards>/.exec(sc)[0].match(/<forward\s/g) || []).length, 'global exceptions', (/<global-exceptions[\s\S]*?<\/global-exceptions>/.exec(sc)[0].match(/<exception\s/g) || []).length);
const topBeans = f => { const t = rd(f).replace(/<bean[\s\S]*?<\/bean>|<bean[^>]*\/>/g, m => m); let depth = 0, n = 0; const re = /<(\/?)(bean)\b[^>]*?(\/?)>/g; let m; while ((m = re.exec(t))) { if (m[1]) depth--; else { if (depth === 0) n++; if (!m[3]) depth++; } } return n; };
for (const f of ['WEB-INF/classes/spring-beans.xml', 'WEB-INF/classes/spring-caching.xml', 'WEB-INF/classes/spring-dao.xml', 'WEB-INF/classes/spring-security.xml', 'WEB-INF/classes/spring-web.xml', 'WEB-INF/action-servlet.xml', 'WEB-INF/test-action-servlet.xml']) console.log('top-level beans', f, topBeans(f));
const tiles = ['WEB-INF/tiles-definitions.xml', 'WEB-INF/tiles-pages.xml'].map(f => (rd(f).match(/<definition\s/g) || []).length); console.log('tiles definitions', tiles);
const cl = rd('WEB-INF/classes/db-changelog.xml'); for (const k of ['changeSet', 'createTable', 'addPrimaryKey', 'createIndex', 'addForeignKeyConstraint', 'insert', 'addColumn', 'renameTable', 'preConditions']) console.log(k, (cl.match(new RegExp('<' + k + '\\b', 'g')) || []).length);
console.log('mapping xml', files.filter(f => /^WEB-INF\/classes\/mappings\/.+\.xml$/.test(f)).length);
console.log('ResourceBundle files', files.filter(f => /ResourceBundle.*\.properties$/.test(f)).length, 'jsp', files.filter(f => /\.jsp$/.test(f)).length);
const cj = JSON.parse(fs.readFileSync(path.join(S, 'classes.json'), 'utf8'));
console.log('entities @Entity', cj.filter(c => c.ann && c.ann.includes('Ljavax/persistence/Entity;')).length);
const pk = {}; for (const c of cj) { const m = /^(com\/technoetic\/xplanner|net\/sf\/xplanner)\/([^/]+)/.exec(c.file); if (m) { const k = m[1].split('/').pop() + ':' + (c.file.split('/').length > (m[1].split('/').length + 2) ? m[2] : '(root)'); pk[k] = (pk[k] || 0) + 1; } } console.log(JSON.stringify(pk));
// charts in iterationStatistics.jsp etc
let charts = 0; for (const f of files.filter(f => /\.jsp$/.test(f))) { const t = fs.readFileSync(path.join(war, f), 'latin1').replace(/<%--[\s\S]*?--%>/g, '').replace(/<!--[\s\S]*?-->/g, ''); const n = (t.match(/<cewolf:chart\b/g) || []).length; if (n) console.log('charts', f, n); charts += n; } console.log('live charts', charts);

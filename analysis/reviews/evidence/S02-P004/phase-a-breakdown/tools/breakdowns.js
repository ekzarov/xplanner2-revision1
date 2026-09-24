// Reviewer-owned breakdown generator (BA-002-04 / S02-P004). Reads only the scratch WAR copy and
// reviewer scratch indexes; writes exhaustive breakdown JSON files to the evidence folder given as argv[2].
'use strict';
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const S = __dirname; const war = path.join(S, 'war'); const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
const rd = p => fs.readFileSync(path.join(war, p), 'utf8');
const strip = t => t.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
const lineOf = (t, idx) => t.slice(0, idx).split('\n').length;
const attrs = s => { const o = {}; s.replace(/([\w:-]+)\s*=\s*"([^"]*)"/g, (_, k, v) => { o[k] = v; }); return o; };
const warFiles = new Set();
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else warFiles.add('/' + path.relative(war, p).split(path.sep).join('/')); } })(war);
const write = (name, obj) => { const f = path.join(outDir, name); fs.writeFileSync(f, JSON.stringify(obj, null, 1)); return f; };

// ---- 1. Struts action mappings (3 modules loaded by XPlannerServlet config) joined with Spring beans
const beans = {};
for (const bf of ['WEB-INF/action-servlet.xml', 'WEB-INF/test-action-servlet.xml']) {
  const t = strip(rd(bf)); const re = /<bean\s+([^>]*?)(\/?)>([\s\S]*?)(?=<bean\s|<\/beans>)/g; let m;
  while ((m = re.exec(t))) {
    const a = attrs(m[1]); if (!a.name || !a.name.startsWith('/')) continue;
    const body = m[3]; const props = {};
    body.replace(/<property\s+name="(\w+)"(?:\s+value="([^"]*)")?(?:\s+ref="([^"]*)")?\s*\/?>([\s\S]*?)(?:<\/property>|(?=<property|$))/g, (_, n, v, r, inner) => {
      let val = v || (r ? 'ref:' + r : null);
      if (!val && inner) { const vv = /<value>([^<]*)<\/value>/.exec(inner); const rr = /<ref\s+(?:bean|local)="([^"]+)"/.exec(inner); val = vv ? vv[1].trim() : (rr ? 'ref:' + rr[1] : null); }
      props[n] = val; return '';
    });
    beans[a.name] = { file: bf, line: lineOf(t, m.index), class: a.class, props };
  }
}
const actions = [];
// web.xml XPlannerServlet init-param "config" lists the three files comma-separated: Struts merges them into ONE default module,
// so form-beans declared in any of them are visible to all mappings.
const forms = {};
for (const cf of ['WEB-INF/struts-config.xml', 'WEB-INF/mobile-struts-config.xml', 'WEB-INF/test-struts-config.xml']) strip(rd(cf)).replace(/<form-bean\s+([^>]*?)\/?>/g, (_, s) => { const a = attrs(s); forms[a.name] = a.type; return ''; });
for (const [mod, cf] of [['main', 'WEB-INF/struts-config.xml'], ['mobile', 'WEB-INF/mobile-struts-config.xml'], ['test', 'WEB-INF/test-struts-config.xml']]) {
  const t = strip(rd(cf));
  const am = /<action-mappings[\s\S]*?<\/action-mappings>/.exec(t); const base = am.index; const block = am[0];
  const re = /<action\s+([^>]*?)(\/>|>([\s\S]*?)<\/action>)/g; let m;
  while ((m = re.exec(block))) {
    const a = attrs(m[1]); const inner = m[3] || '';
    const fwds = []; inner.replace(/<forward\s+([^>]*?)\/?>/g, (_, s) => { const f = attrs(s); f.exists = f.path.startsWith('/do/') ? 'action-path' : warFiles.has(f.path); fwds.push(f); return ''; });
    const exc = []; inner.replace(/<exception\s+([^>]*?)\/?>/g, (_, s) => { exc.push(attrs(s)); return ''; });
    const bean = beans[a.path] || null;
    actions.push({ module: mod, config: cf, line: lineOf(t, base + m.index), path: a.path, urlPath: '/do' + a.path, form: a.name || null, formClass: a.name ? (forms[a.name] || 'UNDEFINED form-bean') : null, input: a.input || null, inputExists: a.input ? (a.input.startsWith('/do/') ? 'action-path' : warFiles.has(a.input)) : null, scope: a.scope || null, parameter: a.parameter || null, strutsType: a.type || null, springBean: bean ? { file: bean.file, line: bean.line, class: bean.class, props: bean.props } : null, forwards: fwds, exceptions: exc });
  }
}
// security classification
const bypass = ['/do/login', '/do/notAuthorized', '/do/invalidateHibernateCache'];
for (const a of actions) a.webSecurityFilter = bypass.includes(a.urlPath) ? 'bypass (security.xml security-bypass)' : 'authentication required (FormSecurityFilter /do/*)';
for (const a of actions) if (a.urlPath.startsWith('/do/mobile/')) a.mobileSecurityFilter = ['/do/mobile/login', '/do/mobile/notAuthorized'].includes(a.urlPath) ? 'bypass (mobile-security.xml)' : 'authentication required (FormSecurityFilter /do/mobile/*)';
const gfwd = []; { const t = strip(rd('WEB-INF/struts-config.xml')); const g = /<global-forwards[\s\S]*?<\/global-forwards>/.exec(t); g[0].replace(/<forward\s+([^>]*?)\/?>/g, (_, s) => { const f = attrs(s); f.exists = f.path.startsWith('/do/') ? 'action-path' : warFiles.has(f.path); gfwd.push(f); return ''; }); }
const gexc = []; { const t = strip(rd('WEB-INF/struts-config.xml')); const g = /<global-exceptions[\s\S]*?<\/global-exceptions>/.exec(t); g[0].replace(/<exception\s+([^>]*?)\/?>/g, (_, s) => { gexc.push(attrs(s)); return ''; }); }
write('struts-actions.json', { generatedBy: 'breakdowns.js', count: actions.length, byModule: actions.reduce((o, a) => (o[a.module] = (o[a.module] || 0) + 1, o), {}), globalForwards: gfwd, globalExceptions: gexc, actions });

// ---- 2. WAR manifest with SHA-256 per entry
const man = []; for (const f of [...warFiles].sort()) { const b = fs.readFileSync(path.join(war, f)); man.push({ path: f.slice(1), bytes: b.length, sha256: crypto.createHash('sha256').update(b).digest('hex') }); }
write('war-manifest.json', { war: 'legacy/xplanner-plus.war', warSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(S, '..', 'phase-a', 'legacy', 'xplanner-plus.war'))).digest('hex'), files: man.length, entries: man });

// ---- 3. Hibernate annotated entities: table, columns with relationship annotations and cascade
const classesJson = JSON.parse(fs.readFileSync(path.join(S, 'classes.json'), 'utf8'));
const ents = [];
for (const c of classesJson) {
  if (!c.ann || !c.ann.some(x => /persistence\/(Entity|MappedSuperclass|Embeddable)/.test(x))) continue;
  const dump = fs.readFileSync(path.join(S, 'classdump', c.file.replace(/\//g, '.').replace(/\.class$/, '.txt')), 'utf8').split('\n');
  const tbl = (dump.find(l => /^  ANN @Ljavax\/persistence\/Table;/.test(l)) || '').replace(/^  ANN @Ljavax\/persistence\/Table;/, '');
  const rels = []; let cur = null;
  for (const l of dump) { if (l.startsWith('  METHOD ')) cur = l.slice(9).replace(/ acc=.*/, ''); else if (cur && /^    ANN @Ljavax\/persistence\/(OneToMany|ManyToOne|OneToOne|ManyToMany|ElementCollection|JoinColumn|JoinTable|OrderBy|EmbeddedId|Id|Lob)/.test(l)) rels.push(cur.replace(/\(.*$/, '') + ' ' + l.trim().replace(/^ANN @Ljavax\/persistence\//, '@')); }
  ents.push({ class: c.cls, kind: c.ann.filter(x => /persistence/.test(x)).map(x => x.replace(/^Ljavax\/persistence\//, '').replace(/;$/, '')), table: tbl || null, relationshipsAndKeys: rels });
}
write('entities.json', { source: 'RuntimeVisibleAnnotations parsed by classparse.js; sessionFactory packagesToScan=net.sf.xplanner.domain (spring-beans.xml:79) + mappingLocations classpath:/mappings/Metrics.xml (spring-beans.xml:80)', count: ents.length, entities: ents });

// ---- 4. SOAP operations of com.technoetic.xplanner.soap.XPlanner (Axis allowedMethods="*")
const soap = fs.readFileSync(path.join(S, 'classdump', 'com.technoetic.xplanner.soap.XPlanner.txt'), 'utf8').split('\n').filter(l => /^  METHOD /.test(l)).map(l => ({ sig: l.slice(9).replace(/ acc=.*/, ''), acc: l.replace(/.*acc=/, '') })).filter(m => (parseInt(m.acc, 16) & 1) === 1 && !/^<init>|^<clinit>/.test(m.sig));
write('soap-operations.json', { service: 'XPlanner (server-config.wsdd:25-28, provider java:RPC, allowedMethods=*)', publicMethodCount: soap.length, methods: soap });

// ---- 5. Seeded permissions/roles/users from Liquibase changelog
const cl = rd('WEB-INF/classes/db-changelog.xml'); const inserts = [];
cl.replace(/<insert tableName="(\w+)">([\s\S]*?)<\/insert>/g, (m, t, body, idx) => { const cols = {}; body.replace(/<column name="(\w+)"\s+(?:value|valueNumeric|valueBoolean|valueDate)="([^"]*)"/g, (_, n, v) => { cols[n] = v; return ''; }); inserts.push({ table: t, line: lineOf(cl, idx), cols }); return m; });
const csets = []; cl.replace(/<changeSet author="(\w+)" id="([\w-]+)">/g, (m, a, id, idx) => { csets.push({ id, author: a, line: lineOf(cl, idx) }); return m; });
write('liquibase-changelog.json', { file: 'WEB-INF/classes/db-changelog.xml', changeSets: csets, inserts });

// ---- 6. Named HQL queries in the loaded mapping file
const mx = strip(rd('WEB-INF/classes/mappings/Metrics.xml')); const nq = []; mx.replace(/<query name="([^"]+)">/g, (m, n, idx) => { nq.push({ name: n, line: lineOf(mx, idx) }); return m; });
write('named-queries.json', { file: 'WEB-INF/classes/mappings/Metrics.xml (active, comment-stripped)', count: nq.length, queries: nq });

// ---- 7. Jars
const jars = fs.readFileSync(path.join(S, 'jars.txt'), 'utf8').split(/\r?\n/).filter(Boolean).map(l => { const [n, b] = l.split('\t'); return { jar: 'WEB-INF/lib/' + n, bytes: +b }; });
write('jars.json', { count: jars.length, jars });

// ---- 8. Resource bundles
const rbs = [...warFiles].filter(f => /ResourceBundle.*\.properties$/.test(f)).sort().map(f => { const t = fs.readFileSync(path.join(war, f), 'latin1'); const keys = t.split(/\r?\n/).filter(l => /^[^#!\s][^=:]*[=:]/.test(l)).length; return { file: f.slice(1), keyLines: keys }; });
write('resource-bundles.json', { count: rbs.length, bundles: rbs });
console.log('actions', actions.length, 'manifest', man.length, 'entities', ents.length, 'soap', soap.length, 'inserts', inserts.length, 'namedQueries', nq.length, 'jars', jars.length, 'bundles', rbs.length);

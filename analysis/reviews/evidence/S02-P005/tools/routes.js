// Cross-reference Struts action mappings, Spring action beans, forwards and JSP existence (reviewer-authored).
'use strict';
const fs = require('fs'), path = require('path');
const W = __dirname + '/war';
const read = f => fs.readFileSync(path.join(W, f), 'utf8');
const stripComments = s => s.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));
const lineOf = (s, idx) => s.slice(0, idx).split('\n').length;
function attrs(tag) { const o = {}; tag.replace(/([\w:-]+)\s*=\s*"([^"]*)"/g, (_, k, v) => { o[k] = v; }); return o; }

const out = { actions: [], beans: {}, globalForwards: {}, formBeans: {} };
for (const cfg of ['WEB-INF/struts-config.xml', 'WEB-INF/mobile-struts-config.xml', 'WEB-INF/test-struts-config.xml']) {
  const raw = read(cfg), s = stripComments(raw);
  let m;
  const reFb = /<form-bean\s([^>]*?)\/?>/g;
  while ((m = reFb.exec(s))) { const a = attrs(m[1]); out.formBeans[a.name] = { type: a.type, cfg, line: lineOf(s, m.index) }; }
  const gf = /<global-forwards[\s\S]*?<\/global-forwards>/.exec(s);
  if (gf) { const re = /<forward\s([^>]*?)\/?>/g; while ((m = re.exec(gf[0]))) { const a = attrs(m[1]); out.globalForwards[a.name] = { path: a.path, cfg, line: lineOf(s, gf.index + m.index) }; } }
  const am = /<action-mappings[\s\S]*?<\/action-mappings>/.exec(s);
  const re = /<action\s([^>]*?)(\/>|>([\s\S]*?)<\/action>)/g;
  while ((m = re.exec(am[0]))) {
    const a = attrs(m[1]); const body = m[3] || ''; const fw = {}; let k; const rf = /<forward\s([^>]*?)\/?>/g;
    while ((k = rf.exec(body))) { const b = attrs(k[1]); fw[b.name] = b.path + (b.redirect === 'true' ? ' (redirect)' : ''); }
    const ex = []; const re2 = /<exception\s([^>]*?)\/?>/g; while ((k = re2.exec(body))) ex.push(attrs(k[1]));
    out.actions.push({ path: a.path, cfg, line: lineOf(s, am.index + m.index), type: a.type || null, name: a.name || null, input: a.input || null, parameter: a.parameter || null, scope: a.scope || null, forwards: fw, exceptions: ex });
  }
}
for (const cfg of ['WEB-INF/action-servlet.xml', 'WEB-INF/test-action-servlet.xml']) {
  const s = stripComments(read(cfg)); let m; const re = /<bean\s([^>]*?)(\/>|>([\s\S]*?)<\/bean>)/g;
  while ((m = re.exec(s))) {
    const a = attrs(m[1]); if (!a.name || !a.name.startsWith('/')) continue;
    const body = m[3] || ''; const props = {}; let k; const rp = /<property\s+name="([^"]+)"(?:\s+value="([^"]*)"|\s+ref="([^"]*)")?\s*\/?>([\s\S]*?)(?:<\/property>|(?=<property)|$)/g;
    while ((k = rp.exec(body))) { const inner = k[4] || ''; const v = k[2] || k[3] || (/<value>\s*([^<]*?)\s*<\/value>/.exec(inner) || [])[1] || (/<ref\s+(?:bean|local)="([^"]+)"/.exec(inner) || [])[1]; props[k[1]] = v; }
    out.beans[a.name] = { class: a.class, cfg, line: lineOf(s, m.index), props };
  }
}
const exists = p => { if (!p) return null; const q = p.replace(/\?.*$/, '').replace(/ \(redirect\)$/, ''); if (q.startsWith('/do/')) return 'route'; return fs.existsSync(path.join(W, q)) ? 'yes' : 'MISSING'; };
const classExists = c => c ? fs.existsSync(path.join(W, 'WEB-INF/classes', c.replace(/\./g, '/') + '.class')) || /^org\.apache\.struts\./.test(c) : null;
const rows = [];
for (const a of out.actions) {
  const bean = out.beans[a.path];
  const cls = bean ? bean.class : a.type;
  const fwd = Object.entries(a.forwards).map(([k, v]) => k + '=' + v + '[' + exists(v) + ']');
  const typeProp = bean && bean.props.type;
  rows.push({
    route: '/do' + a.path, cfg: a.cfg + ':' + a.line, bean: bean ? bean.cfg + ':' + bean.line : 'none', class: cls || 'NONE',
    classPresent: classExists(cls), form: a.name, formDefined: a.name ? !!out.formBeans[a.name] : null,
    input: a.input ? a.input + '[' + exists(a.input) + ']' : null, parameter: a.parameter,
    parameterForward: a.parameter ? (a.forwards[a.parameter] || (out.globalForwards[a.parameter] ? out.globalForwards[a.parameter].path + '[' + exists(out.globalForwards[a.parameter].path) + ']' : 'NOT FOUND')) : null,
    typeProp: typeProp || null, typePropPresent: typeProp ? classExists(typeProp) : null, beanProps: bean ? bean.props : {}, forwards: fwd, exceptions: a.exceptions.map(e => e.type + '->' + e.path + '[' + exists(e.path) + ']'), scope: a.scope
  });
}
const orphanBeans = Object.keys(out.beans).filter(b => !out.actions.some(a => a.path === b));
const gfw = Object.entries(out.globalForwards).map(([k, v]) => ({ name: k, path: v.path, at: v.cfg + ':' + v.line, exists: exists(v.path) }));
const fbs = Object.entries(out.formBeans).map(([k, v]) => ({ name: k, type: v.type, at: v.cfg + ':' + v.line, present: classExists(v.type) }));
fs.writeFileSync(__dirname + '/routes.json', JSON.stringify({ counts: { actions: out.actions.length, actionBeans: Object.keys(out.beans).length, globalForwards: gfw.length, formBeans: fbs.length }, rows, orphanBeans, globalForwards: gfw, formBeans: fbs }, null, 1).replace(/\r/g, '') + '\n');
console.log(JSON.stringify({ actions: out.actions.length, beans: Object.keys(out.beans).length, gf: gfw.length, fb: fbs.length, orphanBeans }));

// Reviewer-owned JSP scanner (BA-002-04 / S02-P004). Read-only over the scratch WAR copy.
// For each JSP: server-side comments stripped (<%-- --%>) and HTML comments flagged; lists form actions,
// links to /do/* or action paths, includes, custom-tag usage and permission attributes.
'use strict';
const fs = require('fs'); const path = require('path');
const war = path.join(__dirname, 'war');
const jsps = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(jsp|jspi|tag)$/.test(f)) jsps.push(p); } })(war);
const res = [];
for (const p of jsps.sort()) {
  const rel = path.relative(war, p).split(path.sep).join('/');
  const raw = fs.readFileSync(p, 'latin1');
  const noJspComments = raw.replace(/<%--[\s\S]*?--%>/g, ' ');
  const htmlComments = (noJspComments.match(/<!--[\s\S]*?-->/g) || []).length;
  const t = noJspComments.replace(/<!--[\s\S]*?-->/g, ' ');
  const uniq = a => [...new Set(a)].sort();
  const forms = uniq([...t.matchAll(/<(?:html:form|form)\b[^>]*\baction="([^"]+)"/g)].map(m => m[1]));
  const doLinks = uniq([...t.matchAll(/\/do\/([A-Za-z0-9_\/\-]+)/g)].map(m => '/do/' + m[1]));
  const actionAttrs = uniq([...t.matchAll(/\b(?:action|page|forward|href)="(\/[A-Za-z0-9_\/\-]+)"/g)].map(m => m[1]));
  const includes = uniq([...t.matchAll(/<(?:jsp:include|tiles:insert|%@\s*include|c:import)\b[^>]*(?:page|file|url|definition|attribute)="([^"]+)"/g)].map(m => m[1]));
  const tags = uniq([...t.matchAll(/<(xplanner|db|xp|xplannerplus|fn|xpfn|c|html|bean|logic|tiles|display|cewolf|nested|os|dt|decorator)[:]([A-Za-z]+)/g)].map(m => m[1] + ':' + m[2]));
  const perms = uniq([...t.matchAll(/permission(?:s)?="([^"]+)"/g)].map(m => m[1]));
  const roles = uniq([...t.matchAll(/role="([^"]+)"/g)].map(m => m[1]));
  const params = uniq([...t.matchAll(/request\.getParameter\("([^"]+)"\)|param\.([A-Za-z_]+)/g)].map(m => m[1] || m[2]));
  const scriptlets = (t.match(/<%[^@=-]/g) || []).length;
  res.push({ jsp: rel, bytes: raw.length, htmlComments, scriptlets, forms, doLinks, actionAttrs, includes, tags, perms, roles, params });
}
fs.writeFileSync(path.join(__dirname, 'jsp-index.json'), JSON.stringify(res, null, 1));
for (const r of res) {
  console.log('== ' + r.jsp + ' (' + r.bytes + 'b, htmlComments=' + r.htmlComments + ', scriptlets=' + r.scriptlets + ')');
  if (r.forms.length) console.log('  forms: ' + r.forms.join(' '));
  if (r.doLinks.length) console.log('  /do: ' + r.doLinks.join(' '));
  const aa = r.actionAttrs.filter(a => !r.doLinks.includes(a)); if (aa.length) console.log('  paths: ' + aa.join(' '));
  if (r.includes.length) console.log('  inc: ' + r.includes.join(' '));
  if (r.perms.length) console.log('  perm: ' + r.perms.join(' '));
  if (r.roles.length) console.log('  role: ' + r.roles.join(' '));
  if (r.params.length) console.log('  params: ' + r.params.join(' '));
  console.log('  tags: ' + r.tags.filter(x => !/^(c|html|bean|logic|fn):/.test(x)).join(' '));
}

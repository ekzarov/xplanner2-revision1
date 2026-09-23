'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { temporaryDirectory } = require('./helpers');
const { sha256File } = require('./lib');
const { auditDependencies, completionClosure, nodeDigest, bindingErrors, reviewedErrors } = require('./feature-dependencies');
const { completionScope } = require('./sdd-completion-scope');
const { auditSdd } = require('./sdd-audit');

function fixture(t) {
  const root = temporaryDirectory(t, 'dependencies-');
  fs.mkdirSync(path.join(root, 'analysis'), { recursive: true });
  fs.mkdirSync(path.join(root, 'specs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'analysis/reviews'), { recursive: true });
  const sources = {};
  for (const name of ['decision', 'review']) {
    fs.writeFileSync(path.join(root, name + '.md'), name + ': agreed data contract\n');
    sources[name] = { path: name + '.md', sha256: sha256File(path.join(root, name + '.md')) };
    if (name === 'review') { const file='analysis/reviews/stage-16-pass-001.md';fs.copyFileSync(path.join(root,name+'.md'),path.join(root,file));sources[name]={path:file,sha256:sha256File(path.join(root,file))}; }
  }
  const nodes = {};
  for (const id of ['001-data', '002-report', '003-other']) nodes[id] = {
    label: id, metadata: { group: 'Reports', scope: 'target-only', rows: [], sdd: null, basis: ['decision'], unresolved: [], review: null },
  };
  const document = { graph: { id: 'test', type: 'feature-dependencies', directed: true,
    metadata: { schema_version: 1, mode: 'governed', recorded_by: 'test agent', recorded_at: '2026-09-16', scope: 'fixture only', sources },
    nodes, edges: [] } };
  const save = () => fs.writeFileSync(path.join(root, 'analysis/feature-dependencies.json'), JSON.stringify(document));
  const edge = (source='001-data', target='002-report', relation='completion', assessment='confirmed') => {
    document.graph.edges.push({source, target, relation, metadata: {id: 'DEP-'+String(document.graph.edges.length+1).padStart(3,'0'), condition: 'Agreed data access', assessment, basis: ['decision']}});
  };
  save(); return { root, document, save, edge };
}

test('empty incoming edges remain unassessed; pinned reviews bind exact scope', async t => {
  const f=fixture(t); let a=await auditDependencies({root:f.root});
  assert(a.ok, a.errors.join('\n'));
  assert(reviewedErrors(a,'002-report').some(s=>s.includes('unassessed')));
  f.document.graph.nodes['002-report'].metadata.review={source:'review',scope_sha256:a.scopes['002-report']};
  const reviewFile=path.join(f.root,'analysis/reviews/stage-16-pass-001.md');
  fs.writeFileSync(reviewFile,'## Dependency Review\n| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |\n|---|---|---|---|---|\n| 002-report | '+a.scopes['002-report']+' | decision.md | pass | No known prerequisites in this bounded fixture. |\n');
  f.document.graph.metadata.sources.review.sha256=sha256File(reviewFile);
  f.save(); a=await auditDependencies({root:f.root,scope:'002-report',requireReviewed:true}); assert(a.ok,a.errors.join('\n'));
  f.edge(); f.save(); a=await auditDependencies({root:f.root}); assert(a.errors.some(s=>s.includes('stale')));
});
test('only confirmed completion edges expand closure; contract cycles warn, completion cycles fail', async t=>{
  const f=fixture(t); f.edge('001-data','002-report','contract'); f.edge('002-report','001-data','contract'); f.edge('003-other','002-report','completion','candidate'); f.save();
  let a=await auditDependencies({root:f.root}); assert(a.ok,a.errors.join('\n')); assert(a.warnings.some(s=>s.includes('Joint')));
  assert.deepEqual(completionClosure(f.document,'002-report'),['002-report']);
  f.edge(); f.save(); a=await auditDependencies({root:f.root}); assert(a.ok,a.errors.join('\n'));
  assert.deepEqual(completionClosure(f.document,'002-report'),['001-data','002-report']);
  f.edge('002-report','001-data'); f.save(); a=await auditDependencies({root:f.root}); assert(a.errors.some(s=>s.includes('completion cycle')));
});
test('source hash, quote, traversal, unknown source/node, duplicate and self edges fail', async t=>{
  for(const mutation of [
    f=>{f.document.graph.metadata.sources.decision.sha256='0'.repeat(64);},
    f=>{f.document.graph.metadata.sources.decision.quote='not in the decision';},
    f=>{f.document.graph.metadata.sources.decision.path='../outside.md';},
    f=>{f.document.graph.nodes['001-data'].metadata.basis=['missing'];},
    f=>f.edge('999-missing'),
    f=>{f.edge();f.edge();},
    f=>f.edge('001-data','001-data'),
  ]) {const f=fixture(t);mutation(f);f.save();assert(!(await auditDependencies({root:f.root})).ok);}
});
test('historical reconstruction cannot claim readiness or review; candidates and unknowns block review', async t=>{
  const f=fixture(t);f.document.graph.metadata.mode='historical-reconstruction';f.save();
  assert((await auditDependencies({root:f.root})).ok);
  assert(!(await auditDependencies({root:f.root,requireReviewed:true,scope:'001-data'})).ok);
  f.document.graph.nodes['001-data'].metadata.review={source:'review',scope_sha256:nodeDigest(f.document,'001-data')};f.save();
  assert(!(await auditDependencies({root:f.root})).ok);
  f.document.graph.metadata.mode='governed';f.document.graph.nodes['001-data'].metadata.unresolved=['Which access policy?'];f.save();
  assert(!(await auditDependencies({root:f.root})).ok);
});
test('scope hash changes for affected providers, not unrelated nodes; review pointer excluded', async t=>{
  const f=fixture(t);f.edge();const before=nodeDigest(f.document,'002-report');
  f.document.graph.nodes['003-other'].label='Unrelated change';assert.equal(nodeDigest(f.document,'002-report'),before);
  f.document.graph.nodes['001-data'].metadata.review={source:'review',scope_sha256:'0'.repeat(64)};assert.equal(nodeDigest(f.document,'002-report'),before);
  f.document.graph.nodes['001-data'].label='Changed provider';assert.notEqual(nodeDigest(f.document,'002-report'),before);
});
test('graph bindings do not fall back to a manual list or accept a missing SDD path', async t=>{
  const f=fixture(t);const a=await auditDependencies({root:f.root});
  const body='## Change Impact and Verification Scope\n- Completion dependencies: graph\n- Dependency scope SHA-256: '+a.scopes['002-report']+'\n';
  assert(bindingErrors(a,'002-report',body).some(s=>s.includes('exact SDD path')));
  f.document.graph.nodes['002-report'].metadata.sdd='specs/002-report/spec.md';
  a.document = f.document;
  a.scopes['002-report']=nodeDigest(f.document,'002-report');
  const bound=body.replace(/SHA-256: .+/, 'SHA-256: '+a.scopes['002-report']);
  assert.equal(bindingErrors(a,'002-report',bound).length,0);
  assert(bindingErrors(a,'002-report',bound.replace('dependencies: graph','dependencies: none')).some(s=>s.includes('parallel')));
  fs.mkdirSync(path.join(f.root,'specs/002-report'));
  fs.writeFileSync(path.join(f.root,'specs/002-report/spec.md'),bound);
  assert(completionScope(path.join(f.root,'specs'),['002-report'],'002-report',a,()=>true).errors.some(s=>s.includes('unassessed')));
});
test('new SDD policy rejects missing graph in integrated audit',async t=>{
  const f=fixture(t);
  fs.writeFileSync(path.join(f.root,'specs/README.md'),'Feature dependency checks required from feature sequence: 001\n');
  fs.mkdirSync(path.join(f.root,'specs/001-data'));
  fs.writeFileSync(path.join(f.root,'specs/001-data/spec.md'),'# Data\n## Requirements\nFR-001: data\n');
  const a=await auditSdd({root:path.join(f.root,'specs')});
  assert(a.errors.some(s=>s.includes('Completion dependencies: graph')),a.errors.join('\n'));
});

test('workbook scenario facts bind scope, progress cells do not; traceability rows must agree',async t=>{
 const ExcelJS=require('@excel.js/exceljs').default;
 const f=fixture(t),book=new ExcelJS.Workbook(),sheet=book.addWorksheet('User Flows');
 sheet.getCell('A6').value='Reports';sheet.getCell('D7').value='Inspect data';sheet.getCell('B7').value='Analyst';
 const workbook=path.join(f.root,'analysis/legacy_user_flows.xlsx');
 await book.xlsx.writeFile(workbook);
 f.document.graph.metadata.sources.workbook={path:'analysis/legacy_user_flows.xlsx',sha256:sha256File(workbook)};
 const node=f.document.graph.nodes['001-data'];node.metadata.scope='legacy-backed';node.metadata.rows=[7];node.metadata.basis.push('workbook');
 f.save();let a=await auditDependencies({root:f.root});assert(a.ok,a.errors.join('\n'));const original=a.scopes['001-data'];
 sheet.getCell('I7').value='progress only';await book.xlsx.writeFile(workbook);
 assert(!(await auditDependencies({root:f.root})).ok,'Changed bytes must first be checked, not ignored');
 f.document.graph.metadata.sources.workbook.sha256=sha256File(workbook);f.save();a=await auditDependencies({root:f.root});
 assert(a.ok,a.errors.join('\n'));assert.equal(a.scopes['001-data'],original);
 sheet.getCell('D7').value='Changed behavior';await book.xlsx.writeFile(workbook);f.document.graph.metadata.sources.workbook.sha256=sha256File(workbook);f.save();
 a=await auditDependencies({root:f.root});assert.notEqual(a.scopes['001-data'],original);
 node.metadata.rows=[8];f.save();assert((await auditDependencies({root:f.root})).errors.some(s=>s.includes('non-scenario')));
 node.metadata.rows=[7];node.metadata.sdd='specs/001-data/spec.md';
 fs.mkdirSync(path.join(f.root,'specs/001-data'));fs.writeFileSync(path.join(f.root,'specs/001-data/spec.md'),'# Original historical source');
 fs.writeFileSync(path.join(f.root,'specs/traceability.md'),'## Parity Map Delivery Contracts\n| Feature | Scope | Deliver rows | Deferred rows | Owner decision |\n|---|---|---|---|---|\n| 001-data | legacy-backed | 8 | - | - |\n');
 f.document.graph.metadata.sources.traceability={path:'specs/traceability.md',sha256:sha256File(path.join(f.root,'specs/traceability.md'))};f.save();
 assert((await auditDependencies({root:f.root})).errors.some(s=>s.includes('parity delivery contract')));
});
test('graph-based completion expands reviewed prerequisites without including contract-only consumers',async t=>{
 const f=fixture(t);f.edge();f.edge('003-other','002-report','contract');
 for(const id of ['001-data','002-report']){
  const n=f.document.graph.nodes[id];n.metadata.sdd='specs/'+id+'/spec.md';
  fs.mkdirSync(path.join(f.root,'specs',id));
 }
 const a={ok:true,document:f.document,scopes:{}};
 for(const id of ['001-data','002-report']){
  a.scopes[id]=nodeDigest(f.document,id);
  f.document.graph.nodes[id].metadata.review={source:'review',scope_sha256:a.scopes[id]};
  fs.writeFileSync(path.join(f.root,'specs',id,'spec.md'),'## Change Impact and Verification Scope\n- Completion dependencies: graph\n- Dependency scope SHA-256: '+a.scopes[id]+'\n');
 }
 const scope=completionScope(path.join(f.root,'specs'),['001-data','002-report','003-other'],'002-report',a,()=>true);
 assert.deepEqual(scope.errors,[]);assert.deepEqual([...scope.selected].sort(),['001-data','002-report']);
});

test('an unrelated report or non-passed review row cannot satisfy the binding',async t=>{
 const f=fixture(t),id='002-report',hash=nodeDigest(f.document,id);
 f.document.graph.nodes[id].metadata.review={source:'review',scope_sha256:hash};
 for(const result of ['findings','unverified','pass']){
  const file=path.join(f.root,'analysis/reviews/stage-16-pass-001.md');
  fs.writeFileSync(file,'## Dependency Review\n| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |\n|---|---|---|---|---|\n| '+(result==='pass'?'003-other':id)+' | '+hash+' | decision.md | '+result+' | Recorded outcome. |\n');
  f.document.graph.metadata.sources.review.sha256=sha256File(file);f.save();
  assert((await auditDependencies({root:f.root})).errors.some(s=>s.includes('passed exact-scope')));
 }
});

test('documented CLI accepts both scope syntaxes and rejects missing/unknown arguments',()=>{
 const {parseCli}=require('./feature-dependencies');
 assert.equal(parseCli(['--scope','029-report','--require-reviewed']).scope,'029-report');
 assert.equal(parseCli(['--scope=029-report']).scope,'029-report');
 assert.equal(parseCli(['--require-reviewed'])['require-reviewed'],true);
 assert.throws(()=>parseCli(['--scope']));
 assert.throws(()=>parseCli(['--root','other']));
});

test('feature descriptions are bounded plain text, with compatibility for older nodes', async t => {
  const f = fixture(t);
  let audit = await auditDependencies({root:f.root});
  assert(audit.ok);
  assert(audit.warnings.some(message => message.includes('no feature description')));
  f.document.graph.nodes['001-data'].metadata.description = 'Supplies recorded work time to reports; does not edit report layouts.';
  f.save();
  audit = await auditDependencies({root:f.root});
  assert(audit.ok, audit.errors.join('\n'));
  assert(!audit.warnings.some(message => message.startsWith('001-data has no feature description')));
  for (const invalid of ['', '   ', 'x'.repeat(801), 42]) {
    f.document.graph.nodes['001-data'].metadata.description = invalid;
    f.save();
    assert(!(await auditDependencies({root:f.root})).ok);
  }
});

test('description changes invalidate affected node and consumer scope, not unrelated nodes', t => {
  const f = fixture(t); f.edge();
  const hashes = Object.fromEntries(Object.keys(f.document.graph.nodes).map(id => [id, nodeDigest(f.document,id)]));
  f.document.graph.nodes['001-data'].metadata.description = 'Provides the recorded work-time data used by the report.';
  assert.notEqual(nodeDigest(f.document,'001-data'), hashes['001-data']);
  assert.notEqual(nodeDigest(f.document,'002-report'), hashes['002-report']);
  assert.equal(nodeDigest(f.document,'003-other'), hashes['003-other']);
});

test('committed viewer preserves every source description without inventing missing text', () => {
  const root = path.resolve(__dirname,'../..');
  const data = JSON.parse(fs.readFileSync(path.join(root,'analysis/feature-canvas/data.json'),'utf8'));
  const doc = JSON.parse(fs.readFileSync(path.join(root,data.source),'utf8'));
  for (const node of data.nodes) {
    assert.equal(node.metadata.description, doc.graph.nodes[node.id].metadata.description);
    if (node.metadata.description) {
      assert(node.metadata.description.length <= 800);
      assert.doesNotMatch(node.metadata.description, /[\u0400-\u04ff]/u);
    }
  }
});

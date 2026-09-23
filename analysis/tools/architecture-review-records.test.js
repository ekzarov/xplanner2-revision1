'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const YAML = require('yaml');
const { sha256File } = require('./lib');
const { readRecord, validateReviewRecords, validateReviewTransitions, validateRegistry } = require('./architecture-review-records');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'architecture-review-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, value) => { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); return file; };
  const manifest = { scope: 'Foundation', document_set_version: 'v1' };
  const manifestFile = write('analysis/architecture/architecture-nfr-manifest.json', JSON.stringify(manifest));
  const drawioFile = write('analysis/architecture/architecture.drawio', 'approved drawing');
  const stage10 = 'analysis/reviews/stage-10-pass-001.md';
  const report = write(stage10, '- Result: clean\n- Artifact set version: v1\n');
  const ownerPath = 'analysis/stages/stage-11/architecture-owner-verdict-001.md';
  const closurePath = 'analysis/stages/stage-12/architecture-closure-001.md';
  const status = { architecture_review: { adopted_at: '2026-09-10T08:00:00Z', records: [], owner_verdict: ownerPath, closure_report: closurePath }, transition_history: [
    { to: 'stage-11', changed_at: '2026-09-10T10:00:00Z' },
    { to: 'stage-12', changed_at: '2026-09-10T11:00:00Z' },
  ] };
  const owner = { record_id: 'AOV-001', record_status: 'complete', recorded_at: '2026-09-10T10:30:00Z', stage_entry: status.transition_history[0].changed_at,
    scope: manifest.scope, document_set_version: 'v1', manifest_sha256: sha256File(manifestFile), drawio_sha256: sha256File(drawioFile),
    stage10_report: stage10, stage10_sha256: sha256File(report), decided_by: 'Human owner', decision_evidence: 'Recorded owner confirmation, message 123', decision: 'approved', previous_owner_verdict: 'none', previous_closure: 'none' };
  const ownerRows = [['AOV-001-R001', 'Owner message 123', 'Retry policy is explicit', 'Integration ADR']];
  const closureRows = [['AOV-001-R001', 'Retry policy is explicit', 'ADR specifies three attempts', 'ADR section Retry, checked by agent', 'verified-closed']];
  const render = (b, heading, rows, headers) => `# Record\n\n## ${heading}\n\n| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(r => '| '+r.join(' | ')+' |').join('\n')}\n\n## Record Binding\n\n\`\`\`yaml\n${YAML.stringify(b)}\`\`\`\n`;
  const saveOwner = () => { const file = write(ownerPath, render(owner, 'Items For Closure', ownerRows, ['ID','Origin','Criterion','Affected scope'])); register(); return file; };
  function register() { status.architecture_review.records = [ownerPath, closurePath].filter(p => fs.existsSync(path.join(root,p))).map(p => ({path:p,sha256:sha256File(path.join(root,p))})); }
  saveOwner();
  const closure = { record_id: 'AC-001', record_status: 'complete', recorded_at: '2026-09-10T12:00:00Z', stage_entry: status.transition_history[1].changed_at,
    scope: owner.scope, document_set_version: 'v1', manifest_sha256: owner.manifest_sha256, owner_verdict: ownerPath, owner_verdict_sha256: sha256File(path.join(root, ownerPath)), previous_closure: 'none', checked_by: 'Responsible agent', unchanged_approved_set: true, unchanged_set_evidence: 'Compared exact approved set and NFR/ADR links', result: 'passed', return_stage: 'none', counts: { 'verified-closed': 1, 'owner-dispositioned': 0, open: 0, failed: 0, blocked: 0 } };
  const saveClosure = () => { const file = write(closurePath, render(closure, 'Item Checks', closureRows, ['ID','Criterion','Observation','Evidence','State'])); register(); return file; };
  const save = () => { saveOwner(); closure.owner_verdict_sha256 = sha256File(path.join(root, ownerPath)); saveClosure(); };
  saveClosure();
  status.transition_history.push({to: 'stage-10', changed_at: '2026-09-10T09:00:00Z'});
  status.review_passes = [{stage: 'stage-10', report: stage10, result: 'clean', scope: owner.scope,
    artifact_set_version: 'v1', artifact_manifest_sha256: owner.manifest_sha256, authored_artifacts: [], pass: 1, reviewer: 'Fresh reviewer', waiver_ids: [],
    reviewer_id: 'reviewer-1', session_id: 'session-1', independence_record: stage10, reviewed_at: '2026-09-10T09:30:00Z'}];
  status.transition_history[1].owner_approval = {record: ownerPath};
  register();
  const options = { root, status, manifest, manifestFile, drawioFile, requireClosure: true };
  return { root, options, owner, ownerRows, closure, closureRows, status, save, saveOwner, saveClosure, write, render, ownerPath, closurePath };
}

test('separate current owner and closure records pass with exact coverage', t => {
  const f = fixture(t); assert.equal(validateReviewRecords(f.options).closure.binding.record_id, 'AC-001');
});
test('Stage 11 approval does not require a future Stage 12 report', t => {
  const f = fixture(t); f.status.architecture_review.closure_report = null;
  assert.ok(validateReviewRecords({ ...f.options, requireClosure: false }).owner);
  assert.throws(() => validateReviewRecords(f.options), /closure_report/);
});
test('zero-item closure still requires an unchanged-set check', t => {
  const f = fixture(t); f.ownerRows.length = 0; f.closureRows.length = 0; f.closure.counts['verified-closed'] = 0; f.save();
  assert.ok(validateReviewRecords(f.options));
  f.closure.unchanged_approved_set = false; f.saveClosure();
  assert.throws(() => validateReviewRecords(f.options), /unchanged-set/);
});
for (const [name, mutate, pattern] of [
  ['reconstruction is not approval', f => { f.owner.record_status = 'historical-reconstruction'; }, /reconstruction/],
  ['reconstruction is not closure', f => { f.closure.record_status = 'historical-reconstruction'; }, /reconstruction/],
  ['remarks are not approval', f => { f.owner.decision = 'remarks'; }, /not approved/],
  ['missing human evidence', f => { f.owner.decision_evidence = null; }, /human decision/],
  ['different current scope', f => { f.closure.scope = 'Other'; }, /scope/],
  ['old stage entry', f => { f.closure.stage_entry = '2026-09-09T11:00:00Z'; }, /latest actual/],
  ['report before entry', f => { f.closure.recorded_at = '2026-09-09T12:00:00Z'; }, /predates/],
  ['wrong record ID', f => { f.closure.record_id = 'AC-002'; }, /filename/],
  ['missing owner item', f => { f.closureRows.length = 0; f.closure.counts['verified-closed'] = 0; }, /omits/],
  ['changed criterion', f => { f.closureRows[0][1] = 'Only a timeout is needed'; }, /criterion/],
  ['empty evidence', f => { f.closureRows[0][3] = ''; }, /incomplete/],
  ['duplicate item', f => { f.closureRows.push([...f.closureRows[0]]); }, /duplicate/],
  ['wrong totals', f => { f.closure.counts['verified-closed'] = 2; }, /count/],
  ['unresolved item cannot be passed', f => { f.closureRows[0][4] = 'open'; f.closure.counts = {'verified-closed':0,'owner-dispositioned':0,open:1,failed:0,blocked:0}; }, /unresolved/],
  ['negative result cannot pass', f => { f.closure.result = 'findings'; f.closure.return_stage = 'stage-09'; }, /not passed/],
  ['unattributed finding', f => { f.closureRows.push(['AC-002-F001','Criterion','Observation','Evidence','verified-closed']); }, /unattributed/],
  ['missing predecessor', f => { delete f.owner.previous_owner_verdict; }, /required|preceding/],
]) test(name, t => { const f = fixture(t); mutate(f); f.save(); assert.throws(() => validateReviewRecords(f.options), pattern); });

test('editing owner bytes invalidates the closure hash', t => {
  const f = fixture(t); f.owner.decision_evidence += ' changed'; f.saveOwner();
  assert.throws(() => validateReviewRecords(f.options), /pin the selected/);
});
test('changed architecture invalidates owner approval', t => {
  const f = fixture(t); f.write('analysis/architecture/architecture.drawio', 'changed');
  assert.throws(() => validateReviewRecords(f.options), /Draw.io hash/);
});
test('record parser rejects ambiguous bindings', t => {
  const f = fixture(t); fs.appendFileSync(path.join(f.root, f.ownerPath), '\n```yaml\nrecord_id: AOV-001\n```\n');
  assert.throws(() => readRecord(f.root, f.ownerPath, 'owner'), /exactly one/);
});

test('clearing current pointers cannot disable adoption', t => {
  const f = fixture(t); f.status.architecture_review.owner_verdict = null; f.status.architecture_review.closure_report = null;
  assert.throws(() => validateReviewRecords(f.options), /owner_verdict/);
});
test('an unregistered or wrong-window Stage 10 report cannot authorize the owner handoff', t => {
  const f = fixture(t); f.status.review_passes.length = 0;
  assert.throws(() => validateReviewRecords(f.options), /registered eligible/);
});
test('the successful fixture uses the real review-pass schema', t => {
  const f=fixture(t),schema=require('../migration_status.schema.json');
  const {validateSchema}=require('./lib');
  assert.deepEqual(validateSchema({$schema:schema.$schema,$defs:schema.$defs,$ref:'#/$defs/reviewPass'},f.status.review_passes[0]),[]);
});
test('an earlier clean pass is not the latest Stage 10 attempt', t => {
  const f=fixture(t);
  f.status.review_passes.push({...f.status.review_passes[0],pass:2,report:'analysis/reviews/stage-10-pass-002.md',reviewed_at:'2026-09-10T09:45:00Z'});
  assert.throws(()=>validateReviewRecords(f.options),/latest registered/);
});
test('completed files cannot be omitted from the attempt register', t => {
  const f=fixture(t),file='analysis/stages/stage-12/architecture-closure-002.md';
  f.write(file,f.render({...f.closure,record_id:'AC-002'},'Item Checks',f.closureRows,['ID','Criterion','Observation','Evidence','State']));
  assert.throws(()=>validateRegistry(f.root,f.status),/missing from the register/);
});
test('a new agent finding cannot borrow a disposition absent from the owner item table', t => {
  const f=fixture(t);
  f.owner.dispositions=[{id:'AC-001-F001',decision:'withdrawn',evidence:'Owner message'}];
  f.closureRows.push(['AC-001-F001','An invented criterion','Observation','Evidence','owner-dispositioned']);
  f.closure.counts['owner-dispositioned']=1;f.save();
  assert.throws(()=>validateReviewRecords(f.options),/Disposition needs/);
});
test('an owner transition cannot precede its actual decision', t => {
  const f=fixture(t);f.status.transition_history.push({from:'stage-11',to:'stage-12',changed_at:'2026-09-10T10:15:00Z',owner_approval:{record:f.ownerPath}});
  assert.throws(()=>validateReviewTransitions(f.root,f.status),/predates its owner/);
});
test('governed Stage 12 exits cannot omit the report', t => {
  const f = fixture(t); f.status.transition_request = {from:'stage-12',to:'stage-13',gate_evidence:[]};
  assert.throws(() => validateReviewTransitions(f.root,f.status), /exactly one/);
});
test('historical transition uses its own exact owner scope and Stage 12 entry', t => {
  const f = fixture(t); f.status.transition_request = {from:'stage-12',to:'stage-13',gate_evidence:[f.closurePath]};
  assert.doesNotThrow(() => validateReviewTransitions(f.root,f.status));
  f.closure.scope='Other'; f.save();
  assert.throws(() => validateReviewTransitions(f.root,f.status), /scope/);
  f.closure.scope=f.owner.scope; f.save();
  f.status.transition_history[1].owner_approval.record='analysis/stages/stage-11/architecture-owner-verdict-999.md';
  assert.throws(() => validateReviewTransitions(f.root,f.status), /opened this Stage 12/);
});
test('explicit owner withdrawal is counted separately, never as verified closure', t => {
  const f=fixture(t); f.owner.dispositions=[{id:'AOV-001-R001',decision:'withdrawn',evidence:'Owner message 456 explicitly withdraws this requirement'}];
  f.closureRows[0][4]='owner-dispositioned'; f.closure.counts['verified-closed']=0; f.closure.counts['owner-dispositioned']=1; f.save();
  assert.ok(validateReviewRecords(f.options));
  f.owner.dispositions=[]; f.save();
  assert.throws(() => validateReviewRecords(f.options), /Disposition needs/);
});
test('a closure retry cannot reset its predecessor or drop an earlier finding', t => {
  const f=fixture(t), next='analysis/stages/stage-12/architecture-closure-002.md';
  const b={...f.closure,record_id:'AC-002',recorded_at:'2026-09-10T13:00:00Z'};
  f.write(next,f.render(b,'Item Checks',f.closureRows,['ID','Criterion','Observation','Evidence','State']));
  f.status.architecture_review.records.push({path:next,sha256:sha256File(path.join(f.root,next))});
  f.status.architecture_review.closure_report=next;
  assert.throws(() => validateRegistry(f.root,f.status), /preceding registered closure/);
});
test('a failed cycle returns through fresh control and owner review to a new passed closure', t => {
  const f=fixture(t);
  f.closure.result='findings'; f.closure.return_stage='stage-09'; f.closureRows[0][4]='failed';
  f.closure.counts['verified-closed']=0; f.closure.counts.failed=1; f.save();
  const ownerPath='analysis/stages/stage-11/architecture-owner-verdict-002.md';
  const closurePath='analysis/stages/stage-12/architecture-closure-002.md';
  const report='analysis/reviews/stage-10-pass-002.md';
  f.write(report,'- Result: clean\n- Artifact set version: v1\n');
  f.status.transition_history.push(
    {from:'stage-12',to:'stage-09',changed_at:'2026-09-10T12:30:00Z',gate_evidence:[f.closurePath]},
    {to:'stage-10',changed_at:'2026-09-11T09:00:00Z'},
    {to:'stage-11',changed_at:'2026-09-11T10:00:00Z'},
    {to:'stage-12',changed_at:'2026-09-11T11:00:00Z',owner_approval:{record:ownerPath}});
  const owner={...f.owner,record_id:'AOV-002',recorded_at:'2026-09-11T10:30:00Z',stage_entry:'2026-09-11T10:00:00Z',stage10_report:report,
    stage10_sha256:sha256File(path.join(f.root,report)),previous_owner_verdict:f.ownerPath,previous_closure:f.closurePath};
  f.write(ownerPath,f.render(owner,'Items For Closure',f.ownerRows,['ID','Origin','Criterion','Affected scope']));
  const closure={...f.closure,record_id:'AC-002',recorded_at:'2026-09-11T12:00:00Z',stage_entry:'2026-09-11T11:00:00Z',owner_verdict:ownerPath,
    owner_verdict_sha256:sha256File(path.join(f.root,ownerPath)),previous_closure:f.closurePath,result:'passed',return_stage:'none',counts:{'verified-closed':1,'owner-dispositioned':0,open:0,failed:0,blocked:0}};
  f.closureRows[0][4]='verified-closed';
  f.write(closurePath,f.render(closure,'Item Checks',f.closureRows,['ID','Criterion','Observation','Evidence','State']));
  f.status.review_passes.push({...f.status.review_passes[0],report,reviewed_at:'2026-09-11T09:30:00Z'});
  f.status.architecture_review.records.push(...[ownerPath,closurePath].map(p=>({path:p,sha256:sha256File(path.join(f.root,p))})));
  Object.assign(f.status.architecture_review,{owner_verdict:ownerPath,closure_report:closurePath});
  assert.ok(validateReviewRecords(f.options));
  assert.doesNotThrow(() => validateReviewTransitions(f.root,f.status));
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {readContract,tables}=require('./process-contract');
const {collectPairs,auditPairs,digest}=require('./translation-audit');
const {files,consistencyErrors}=require('./process-consistency-audit');
const root=path.resolve(__dirname,'../..');
test('English MD defines the stage graph, blind inputs and immutable candidate boundary',()=>{
  const c=readContract(root),stage=n=>c.flow[n];
  assert.equal(c.authors.length,55);
  assert.deepEqual(stage(2).delayedInputs,['recon-record','parity-map','status']);
  assert(stage(19).delayedInputs.includes('delivery-record'));
  assert.deepEqual(stage(12).outputs,['architecture-closure','status']);
  assert(!stage(18).outputs.includes('polish-backlog'));
  assert(!stage(18).outputs.includes('target-inventory'));
  assert(stage(18).outputs.includes('traceability'));
  assert(c.gates[18].checks.includes('audit:sdd:slice'));
  assert.deepEqual(c.gates[20].checks,['audit:all']);
});
test('contract parser rejects duplicate tables instead of choosing a convenient rule',()=>{
  assert.throws(()=>tables('## Stage Flow\n\n| A | B |\n|---|---|\n|x|y|\n\n| A | B |\n|---|---|\n|x|y|'),/Duplicate/);
});
test('changed English or Russian wording requires renewed review',()=>{
  const pair={en:'Review and obtain owner approval',ru:'Проверить и получить согласование владельца'};
  const reviewed={x:digest(pair)};
  assert.deepEqual(auditPairs({x:pair},reviewed),[]);
  assert.equal(auditPairs({x:{...pair,en:'Only review'}},reviewed).length,1);
  assert.equal(auditPairs({x:{...pair,ru:'Только проверить'}},reviewed).length,1);
  assert.equal(auditPairs({},reviewed).length,1);
});
test('nested historical notes and prose labels may not silently fall back to English',()=>{
  const d={phases:[],stages:[],gates:[],artifacts:[{id:'implementation',label:'source code',xplannerExample:{note:'Historical only; not acceptance'}}]};
  assert.equal(collectPairs(d,{artifacts:{implementation:{}}},{}).errors.length,2);
  assert.deepEqual(collectPairs(d,{artifacts:{implementation:{label:'Исходный код',xplannerExample:{note:'Исторический пример, не приемка'}}}},{}).errors,[]);
});
test('known semantic contradictions fail the view check even when appended tables are correct',()=>{
  const input=Object.fromEntries(Object.entries(files).map(([key,file])=>[key,fs.readFileSync(path.join(root,file),'utf8')]));
  assert.deepEqual(consistencyErrors(input),[]);
  assert(consistencyErrors({...input,entry:input.entry.replace('Stage 7 Low-cosmetic','Stage 7 cosmetic')}).length);
  assert(consistencyErrors({...input,verdict:input.verdict.replace('does not edit','may edit')}).length);
  assert(consistencyErrors({...input,drawio:input.drawio.replace('18 environment · delivery · sdd:slice','18 environment · delivery · sdd:complete')}).length);
  assert(consistencyErrors({...input,orchestration:input.orchestration.replace('### Blind Review Packets','### Packets')}).length);
  assert(consistencyErrors({...input,orchestration:input.orchestration.replace('### Expectation-Only Extracts','### Full Records')}).length);
  assert(consistencyErrors({...input,entry:input.entry.replace('Blind-review reading order','Normal reading order')}).length);
  assert(consistencyErrors({...input,constitution:input.constitution.replace('save independent observations before receiving prior','read prior')}).length);
  assert(consistencyErrors({...input,profiles:input.profiles+' closure evidence before final approval'}).length);
  assert(consistencyErrors({...input,statuses:input.statuses+'\u041f\u043e\u044f\u0441\u043d\u0435\u043d\u0438\u0435'}).length);
});

test('shared UI artifacts are produced, updated and consumed with the correct blind boundary', () => {
  const c = readContract(root), stage = n => c.flow[n];
  for (const id of ['ui-design-system', 'ui-design-tokens']) {
    assert(stage(5).outputs.includes(id));
    assert(stage(6).inputs.includes(id) && stage(6).outputs.includes(id));
    for (const n of [7, 8, 9, 13, 14, 15, 16, 17, 18, 19]) {
      assert(stage(n).inputs.includes(id), 'Missing UI input at ' + n);
      assert(!stage(n).outputs.includes(id), 'Approved UI must stay read-only at ' + n);
    }
    assert(stage(19).delayedInputs.includes(id));
  }
});

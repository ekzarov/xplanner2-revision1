'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
const {checkHistory}=require('./architecture-review-history');

function repository(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'review-history-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init'); git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
  const write=(file,body)=>{const p=path.join(root,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,body);};
  const commit=()=>{git('add','.');git('commit','-m','Fixture');return git('rev-parse','HEAD');};
  write('README.md','Fixture');const base=commit();
  const file='analysis/stages/stage-12/architecture-closure-001.md';
  return {root,git,write,commit,base,file};
}
const complete='# Closure\n\n```yaml\nrecord_status: complete\n```\nResult: blocked\n';
test('new completed records are allowed',t=>{const f=repository(t);f.write(f.file,complete);f.commit();assert.deepEqual(checkHistory(f.root,f.base),[]);});
test('completed record created then edited within one push is protected',t=>{const f=repository(t);f.write(f.file,complete);f.commit();f.write(f.file,complete.replace('blocked','passed'));f.commit();assert.match(checkHistory(f.root,f.base).join('\n'),/immutable/);});
test('completed record created then deleted within one push is protected',t=>{const f=repository(t);f.write(f.file,complete);f.commit();fs.unlinkSync(path.join(f.root,f.file));f.commit();assert.match(checkHistory(f.root,f.base).join('\n'),/immutable/);});
test('adoption cannot be removed after it is committed',t=>{const f=repository(t);const file='analysis/migration_status.yaml';f.write(file,'architecture_review:\n  adopted_at: 2026-09-10T08:00:00Z\n  records: []\n');f.commit();f.write(file,'control: {}\n');f.commit();assert.match(checkHistory(f.root,f.base).join('\n'),/adoption cannot/);});
test('sibling history is not mistaken for deletion before a valid merge',t=>{
  const f=repository(t),main=f.git('branch','--show-current');
  f.git('branch','side',f.base);f.write(f.file,complete);f.commit();
  f.git('checkout','side');f.write('side.md','Unrelated sibling work');f.commit();
  f.git('checkout',main);f.git('merge','--no-ff','side','-m','Merge sibling');
  assert.deepEqual(checkHistory(f.root,f.base),[]);
});

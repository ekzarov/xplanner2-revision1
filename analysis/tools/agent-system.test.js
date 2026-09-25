'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cheerio = require('cheerio');
const {model,generatedFiles,synchronize} = require('../agent-system/build-view');
const {exampleModel} = require('../agent-system/example-view');
const {STAGE_NAMES} = require('./lib');
const root = path.resolve(__dirname,'../..');

function fixture(t){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'agent-system-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  fs.mkdirSync(path.join(dir,'analysis/agent-system'),{recursive:true});
  for(const name of ['agent-system-overview.md','process-contract.md','agent-roles.md'])fs.copyFileSync(path.join(root,'analysis',name),path.join(dir,'analysis',name));
  return dir;
}

test('agent roles and stage controls agree with the English process contract',()=>{
  const data=model(root);
  assert.deepEqual(data.stages.independent,[2,7,10,14,16,19]);
  assert.deepEqual(data.stages.peer,[17]);
  assert.deepEqual(data.stages.primary,[3,12,18]);
  assert.deepEqual(data.stages.owner,[0,4,5,8,9,11,16,17,19]);
  assert.equal(Object.keys(data.roles).length,6);
  assert.deepEqual(Object.keys(data.roles),['pm','ba','ux','architect','developer','qa']);
  assert.match(data.context.tools.count,/not agents/);
  assert.match(data.context.owner.count,/not an agent/);
  assert.deepEqual(data.assignments.map(s=>s.lead),['pm','ba','ba','ba','ba','ux','ux','qa','ux','architect','architect','architect','architect','architect','architect','architect','architect','developer','developer','qa']);
  for(const [id,role] of Object.entries(data.roles)){
    assert.equal(role.skill,`.agents/skills/migration-${id}/SKILL.md`);
    assert.ok(fs.existsSync(path.join(root,role.skill)),'skill must exist');
  }
});

test('generated page has accessible diagram, complete roles and valid local anchors',()=>{
  const files=generatedFiles(root), $=cheerio.load(files.get('roles.html'));
  assert.equal($('html').attr('lang'),'en');
  assert.equal($('svg [data-role]').length,6);
  assert.equal($('svg [data-context]').length,3);
  assert.ok($('svg title').text());
  assert.ok($('svg desc').text());
  $('a[href^="#"]').each((_,a)=>assert.equal($($(a).attr('href')).length,1));
  assert.match($('article').text(),/Blind access at Stage 2 full-blind and Stage 19/);
  assert.match($('article').text(),/outside the reviewed worktree/);
  assert.match($('article').text(),/agents of other vendors/);
  assert.ok($('a[href="../../MIGRATION.md"]').length);
  assert.ok($('a[href="../migration_methodology.md#actors"]').length);
  assert.equal($('a[href^="../../.agents/skills/"]').length,6);
  assert.ok($('a[href="../agent-roles.md"]').length);
  for(const term of ['PM does not do specialist work','ACK','RESULT','native client profiles'])assert.ok($.text().includes(term));
  assert.match($.text(), /At Stage 19 PM records the owner walkthrough\/decline/);
  assert.match(files.get('index.html'), /at Stage 19 PM records the owner walkthrough\/decline/);
  assert.doesNotMatch(files.get('roles.html'),/[\u0400-\u04ff]/);
  synchronize(root,true);
});

test('stale diagrams are detected when English role text changes',t=>{
  const dir=fixture(t);
  synchronize(dir);
  synchronize(dir,true);
  const file=path.join(dir,'analysis/agent-system-overview.md');
  fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('Human owner |','Accountable owner |'));
  assert.throws(()=>synchronize(dir,true),/Stale agent-system view/);
});

test('assignments, acknowledgements and results have separate directed arrows',()=>{
  const files=generatedFiles(root);
  for(const file of ['index.html','en.html','example.svg','example.ru.svg']){
    const $=cheerio.load(files.get(file),{xmlMode:file.endsWith('.svg')});
    $('[data-actor="author"],[data-actor="reviewer"]').each((_,event)=>{
      const messages=$(event).find('[data-message]');
      assert.deepEqual(messages.map((_,m)=>$(m).attr('data-message')).get(),['ASSIGN','ACK','RESULT']);
      assert.deepEqual(messages.map((_,m)=>$(m).attr('data-from')).get(),['pm','specialist','specialist']);
      assert.deepEqual(messages.map((_,m)=>$(m).attr('data-to')).get(),['specialist','pm','pm']);
      const points=messages.map((_,m)=>{
        const match=$(m).find('path').attr('d').match(/^M(\d+) (\d+) H(\d+)$/);
        assert.ok(match);
        return {from:Number(match[1]),y:Number(match[2]),to:Number(match[3])};
      }).get();
      assert.ok(points[0].from<points[0].to,'assignment points to specialist');
      assert.ok(points[1].from>points[1].to,'ACK points back to PM');
      assert.ok(points[2].from>points[2].to,'RESULT points back to PM');
      assert.ok(points[0].y<points[1].y&&points[1].y<points[2].y,'ACK precedes result');
      assert.match(messages.eq(1).text(),/ACK: task understood/);
      assert.match(messages.eq(2).text(),$(event).attr('data-actor')==='reviewer'?/Report \+ evidence/:/Files \+ checks \+ gaps/);
    });
    assert.doesNotMatch(files.get(file),/task \+ skill \/ ACK|packet \+ skill \/ ACK/);
  }
});

test('every example event displays the shared stage name, including mobile and SVG downloads',()=>{
  const data=model(root),example=exampleModel(data),files=generatedFiles(root);
  const canvasFile=path.join(root,'analysis/process-canvas/data.json');
  const canvas=fs.existsSync(canvasFile)?JSON.parse(fs.readFileSync(canvasFile,'utf8')):null;
  for(const step of example.sequence){
    assert.equal(step.stageName,STAGE_NAMES[step.stage]);
    if(canvas)assert.equal(step.stageName,canvas.stages.find(s=>s.id===`stage-${String(step.stage).padStart(2,'0')}`).title);
  }
  for(const file of ['index.html','en.html','example.svg','example.ru.svg']){
    const $=cheerio.load(files.get(file),{xmlMode:file.endsWith('.svg')});
    assert.equal($('.stage-name').length,example.sequence.length);
    assert.equal($('.number').length,0);
    for(const step of example.sequence){
      const label=$(`[data-event="${step.id}"] .stage-name`);
      assert.equal(label.attr('aria-label'),step.stageName);
      assert.equal(label.find('tspan').map((_,span)=>$(span).text()).get().join(' '),step.stageName);
      assert.ok(label.find('tspan').length<=4,'stage name fits the event height');
      if(file.endsWith('.html'))assert.equal($(`[data-mobile-event="${step.id}"] .mobile-stage`).text(),step.stageName);
    }
  }
});

test('compact role list precedes the example; detail preserves methodology and limits',()=>{
  const files=generatedFiles(root),roles=Object.values(model(root).roles).map(r=>r.title);
  for(const file of ['index.html','en.html','roles.html']){
    const $=cheerio.load(files.get(file));
    assert.deepEqual($('.agent-roster li').map((_,li)=>$(li).text()).get(),roles);
    assert.equal($('.agent-roster a[href^="../../.agents/skills/"]').length,6);
    if(file==='roles.html')continue;
    assert.equal($('.count').closest('details:not([open])').length,1);
    assert.equal($('.message-guide[open]').length,0);
    assert.match($('.message-guide').text(),/Before work/);
    assert.match($('.message-guide').text(),/Not completion or approval/);
    assert.match($('.message-guide').text(),/not a deployed orchestrator/);
    assert.equal($('.message-guide a[href="../migration_methodology.md#actors"]').length,1);
    assert.match($('.message-guide').text(),/Skills support the stage procedure; they do not replace it/);
  }
});

test('hybrid examples derive 12 sessions with mandatory PM delegation and fresh same-specialization reviews',()=>{
  const files=generatedFiles(root);
  const data=model(root),example=exampleModel(data);
  assert.deepEqual(example.counts,{pm:1,authors:4,reviewers:7,total:12});
  assert.match(data.source,/12 illustrative agent sessions: 1 PM \+ 4 specialist authors \+\s*7 fresh reviewers/);
  assert.equal(example.sessions.filter(s=>s.role==='qa'&&s.mode==='author').length,0);
  const sessions=['PM','BA author','BA review 2','UX author','QA review 7','Architect author','Architect review 10','Architect review 14','Architect review 16','Developer author','Developer peer 17','QA review 19'];
  assert.deepEqual(example.sessions.map(s=>s.session),sessions);
  for(const file of ['index.html','en.html']){
    const $=cheerio.load(files.get(file));
    assert.equal($('html').attr('lang'),'en');
    assert.equal($('svg [data-event]').length,33);
    assert.equal($('.mobile-sequence li').length,33);
    assert.equal($('#project-phase svg [data-event]').length,22);
    assert.equal($('#feature-phase svg [data-event]').length,11);
    assert.deepEqual($('[data-spawn]').map((_,e)=>$(e).attr('data-session')).get(),sessions);
    for(const name of sessions)assert.ok($('[data-spawn] .tag').toArray().some(e=>$(e).text()===`NEW: ${name}`));
    assert.equal(Number($('.count').attr('data-session-count')),$('[data-spawn]').length);
    assert.match($('.count').text(),/1 PM \+ 4 specialist authors \+ 7 fresh reviewers = 12/);
    assert.deepEqual($('[data-actor="reviewer"]').map((_,e)=>Number($(e).attr('data-stage'))).get(),[2,7,10,14,16,17,19]);
    assert.deepEqual([...new Set($('[data-event]').map((_,e)=>Number($(e).attr('data-stage'))).get())],Array.from({length:20},(_,i)=>i));
    assert.deepEqual($('[data-actor="reviewer"]').map((_,e)=>$(e).attr('data-role')).get(),['ba','qa','architect','architect','architect','developer','qa']);
    assert.deepEqual($('[data-role="pm"]').map((_,e)=>$(e).attr('data-event')).get(),['bootstrap','legacy-deployment','release-deployment'],'PM coordinates and runs approved deployment tools, never authors specialist verification');
    assert.deepEqual($('[data-actor="owner"]').map((_,e)=>$(e).attr('data-event')).get(),['bootstrap-decision','requirements','ui-foundation','ui-approval','nfr-decision','architecture-approval','assumptions','implement-decision','merge','accept']);
    for(const [stage,role] of [[3,'ba'],[12,'architect'],[18,'developer']]){
      const step=$(`[data-stage="${stage}"][data-mode="responsible-check"]`);
      assert.equal(step.attr('data-role'),role);
      assert.equal(step.attr('data-mode'),'responsible-check');
      assert.equal(step.attr('data-spawn'),undefined);
    }
    for(const step of example.sequence){
      const desktop=$(`[data-event="${step.id}"]`),mobile=$(`[data-mobile-event="${step.id}"]`);
      assert.equal(desktop.attr('data-mode'),step.mode);
      assert.equal(desktop.attr('data-skill'),step.skill);
      assert.equal(desktop.find('.action').text(),mobile.find('strong').text());
      assert.ok(mobile.text().includes(step.session==='human'?'Owner':step.session));
    }
    const ids=$('[id]').map((_,e)=>$(e).attr('id')).get();
    assert.equal(new Set(ids).size,ids.length,'inline SVGs must not duplicate accessible or marker IDs');
    $('a[href^="#"]').each((_,a)=>assert.equal($($(a).attr('href')).length,1));
    assert.equal($('[data-event="deliver"]').attr('data-session'),'Developer author');
    assert.ok($('a[href="../agent-system-overview.md#small-feature-example"]').length);
    assert.equal($('details[open]').length,0);
    assert.equal($('.language').length,0);
    for(const term of ['skill commit/hash','ACK','RESULT','QUESTION/BLOCKED','owner-launched separate session','read-only ACK probe','Phase A','Phase B','agents of other vendors','final owner sign-off','exact recorded decline','zero required fixes','conditional owner fallback','remote CI','not XPlanner session or approval history'])assert.ok($.text().includes(term),term);
    assert.ok($('a[href*="de7f84ed6a539f314cbb0ae75509ae1146c886e6/specs/004-project-workspace/spec.md"]').length);
    assert.doesNotMatch($.text(),/\b(?:K|R[1-7]|P[1-7])\b|[\u0400-\u04ff]/);
  }
  assert.doesNotMatch(files.get('en.html'),/[\u0400-\u04ff]/);
  for(const file of ['example.svg','example.ru.svg']){
    const $=cheerio.load(files.get(file),{xmlMode:true});
    assert.equal($('[data-event]').length,33);
    assert.equal($('[data-spawn]').length,12);
    assert.match($('text').last().text(),/Illustrative, not XPlanner agent execution history/);
    assert.doesNotMatch($.text(),/\b(?:K|R[1-7]|P[1-7])\b|[\u0400-\u04ff]/);
  }
  assert.equal(files.get('index.html'),files.get('en.html'));
  assert.equal(files.get('example.svg'),files.get('example.ru.svg'));
  for(const [file,content] of files)assert.doesNotMatch(content,/optional workers|workers are optional|delegation is optional|eight (?:illustrative agent )?sessions|Coordinator does the work|may do the work itself/i,file);
});

test('invalid role assignments, self-review and reused independent sessions fail closed',()=>{
  const data=model(root);
  const mutations=[
    ['| 3 | pm | coordinate | PM |','| 3 | pm | author | PM |',/assignment differs/],
    ['| 18 | pm | coordinate | PM |','| 18 | pm | responsible-check | PM |',/assignment differs/],
    ['| 1 | ba | author | BA author |','| 1 | pm | author | PM |',/assignment differs/],
    ['| 12 | architect | responsible-check |','| 12 | qa | responsible-check |',/assignment differs/],
    ['| 18 | developer | responsible-check |','| 18 | developer | independent-review |',/assignment differs/],
    ['| independent-review | BA review 2 |','| independent-review | BA author |',/session must be fresh/],
    ['| independent-review | Architect review 14 |','| independent-review | Architect review 10 |',/session must be fresh/],
    ['| peer-review | Developer peer 17 |','| peer-review | Developer author |',/session must be fresh/],
    ['| independent-review | QA review 19 |','| independent-review | QA review 7 |',/session must be fresh/],
    ['| 5 | ux | author | UX author |','| 5 | ux | author | BA author |',/session cannot change role/]
  ];
  for(const [from,to,error] of mutations){
    assert.ok(data.source.includes(from),from);
    assert.throws(()=>exampleModel({...data,source:data.source.replace(from,to)}),error);
  }
  for(const id of ['code-review','live-walkthrough','accept','assumptions','merge','bootstrap-decision','legacy-deployment','release-deployment']){
    const source=data.source.split('\n').filter(line=>!line.startsWith(`| ${id} |`)).join('\n');
    assert.throws(()=>exampleModel({...data,source}),/Missing/);
  }
});

test('changed responsible-check assignments cannot silently drift',()=>{
  const data=model(root);
  const changed={...data,assignments:data.assignments.map(s=>s.id==='stage-12'?{...s,lead:'qa'}:s)};
  assert.throws(()=>exampleModel(changed),/assignment differs/);
});

test('agent views distinguish initial blind control from the optional correction loop', () => {
  const files = generatedFiles(root);
  for (const file of ['roles.html', 'index.html', 'en.html']) {
    const $ = cheerio.load(files.get(file));
    assert.match($.text(), /full-blind/);
    assert.match($.text(), /correction-validation/);
    assert.doesNotMatch($.text(), /Stage 2 remains full and blind|Blind 2\/19:/);
  }
  const $ = cheerio.load(files.get('index.html'));
  const text = $.text();
  for (const term of ['Initial BA review 2 uses full-blind', 'complete valid full-blind baseline',
    'fresh independent read-only BA', 'never an author or previous reviewer',
    'No new Phase A', 'including Low', 'without double counting',
    'Stage 19 and other controls are unchanged', '#stage-2-correction-validation']) {
    assert.ok(text.includes(term), term);
  }
  assert.equal($('svg [data-event]').length, 33, 'correction explanation must not bloat the happy-path sequence');
  assert.equal($('[data-spawn]').length, 12, 'optional corrections are not fictional happy-path sessions');
});

test('PM deployment must precede the corresponding live verification',()=>{
  const data=model(root);
  for(const [deployment,verification] of [['legacy-deployment','live-walkthrough'],['release-deployment','deliver']]){
    const lines=data.source.split('\n');
    const a=lines.findIndex(line=>line.startsWith(`| ${deployment} |`));
    const b=lines.findIndex(line=>line.startsWith(`| ${verification} |`));
    assert.ok(a>=0&&b>a);
    [lines[a],lines[b]]=[lines[b],lines[a]];
    assert.throws(()=>exampleModel({...data,source:lines.join('\n')}),/deployment must precede specialist verification/);
  }
});

test('generator rejects normative skill, title and control-mode drift',t=>{
  const dir=fixture(t),file=path.join(dir,'analysis/agent-roles.md'),source=fs.readFileSync(file,'utf8');
  for(const [from,to,error] of [
    ['.agents/skills/migration-ba/SKILL.md','.agents/skills/migration-pm/SKILL.md',/Invalid repository-local skill path/],
    ['| ba | Business Analyst |','| ba | Invented Role |',/Role title differs/],
    ['| stage-12 | architect | responsible-check |','| stage-12 | architect | independent-review |',/mode must be responsible-check/]
  ]){
    assert.ok(source.includes(from));
    fs.writeFileSync(file,source.replace(from,to));
    assert.throws(()=>generatedFiles(dir),error);
  }
});

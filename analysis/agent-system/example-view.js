'use strict';

const {tables}=require('../tools/process-contract');
const {STAGE_NAMES}=require('../tools/lib');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isReview=mode=>['independent-review','peer-review'].includes(mode);
const deploymentStages={'legacy-deployment':3,'release-deployment':18};

const en={
  title:'XPlanner: from startup to a working feature',
  subtitle:'Illustrative happy path: prepare the project, then deliver "Rename a project". PM delegates every specialist task.',
  projectTitle:'0-14. Prepare the XPlanner project',
  projectNote:'Requirements, UI, architecture and knowledge. Renaming is one example within this work, not the whole project.',
  featureTitle:'15-19. Deliver "Rename a project"',
  featureNote:'Architect designs; Developer implements and verifies. PM deploys with owner approval; fresh specialists review.',
  projectEnd:'Baseline checked for the selected slice. PM continues coordination below.',
  featureStart:'CONTINUATION: same PM, approved baseline, explicit specialist assignments',
  owner:'Owner',ownerNote:'Human decisions',pm:'PM / Coordinator',pmNote:'Delegates; verifies handoffs',
  specialist:'Delegated specialists',specialistNote:'Authors continue; reviewers start fresh',step:'Stage',newAgent:'NEW',
  launch:'Task + instructions',reviewLaunch:'Review task + instructions',
  acknowledge:'ACK: task understood',return:'Files + checks + gaps',reviewReturn:'Report + evidence',
  request:'request decision',decision:'recorded decision',
  done:'Owner accepts the slice. PM records the outcome and authorized next action.',
  diagramTitle:'XPlanner: PM delegation from Bootstrap through Stage 19',
  diagramDescription:'PM coordinates and runs owner-authorized deployment tools without doing specialist verification. BA investigates; UX designs screens; Architect produces architecture, knowledge and SDD; Developer implements and verifies delivery. Fresh BA, QA, Architect and Developer sessions review the exact assigned scope. Checks 3, 12 and 18 belong to the responsible BA, Architect and Developer. The owner makes every required human decision. Session starts and totals are derived from the sequence, not a fixed permanent team.',
  start:'START: the owner launches PM',stageMap:'Process mapping',
  mapText:'The PM line routes work and decisions. Blue boxes are assigned author/responsible checks; green boxes are fresh review sessions; yellow boxes are human decisions. NEW marks a session start, not a new specialization.',
  notesTitle:'Assignments, skills and results',
  notes:[
    'Before legacy deployment and each new release, PM obtains or rechecks owner-approved server access, application role accounts and operation/data scope. PM runs the approved procedure and hands sanitized execution evidence to BA or Developer. Their live checks and reports remain separate; missing access blocks. A legacy grant never authorizes a new release by inference.',
    'PM names the role/mode, exact scope and revision, permitted/withheld inputs, write boundary, skill path, checks and return destination. The receiver explicitly opens SKILL.md and the procedure, then returns ACK with session identity and skill commit/hash. PM checks ACK. Native skill discovery or client profiles do not replace reading.',
    'RESULT returns task/session, role/mode, loaded skills, exact result snapshot, files, checks/outcomes, applicable CHK self-checks, gaps and next action. PM verifies the handoff before integration. QUESTION/BLOCKED names the uncertainty and exact sources; PM routes the decision to all affected specialists. Specialists do not launch workers by default.',
    'The same assignment + skill + ACK + RESULT protocol works through an available delegation tool, approved CLI or owner-launched separate session. A changed provider/client first needs a read-only ACK probe and verified isolation/tool access. Missing capabilities block the task, not permission for PM to do specialist work.',
    'BA review 2 saves its own source-derived Phase A inventory before receiving the filled map, reconnaissance and conclusions for Phase B. QA review 19 first saves independent live observations from neutral expectations, then opens earlier reports and reconciles. Withhold full status, learned checks, author handoffs and filled examples until Phase B; automatic memory or startup imports can invalidate blindness.',
    'The illustration chooses an eligible other-vendor QA review 19. Final consolidated acceptance still requires independent agents of other vendors, final owner sign-off and an owner walkthrough or its exact recorded decline; this slice is not final migration approval. Fresh sessions of the same specialization and skill perform reviews, never their authoring sessions. Reviewers write reports outside the reviewed worktree, not candidate edits.',
    'All checks pass first time here. BA performs responsible check 3, Architect check 12 and Developer check 18. Check 12 records the unchanged approved set and zero required fixes when there are no owner remarks; it never edits architecture or the owner verdict. Stage 3 assumes a live walkthrough; its conditional owner fallback is not exercised. QA support at 18 would not be Stage 19 acceptance.',
    'The owner dispositions every implementation assumption before review 16, authorizes implementation after clean review, and decides merge and permitted delivery after checks and exact-revision remote CI. Authoring specialists record assigned decisions; at Stage 19 PM records the owner walkthrough/decline and sign-off, while QA returns independent evidence only. PM alone integrates permitted status/shared-record updates. Tools, tests, gates and CI are not agents.',
    'This sequence uses four continuing specialist author sessions; QA needs no separate author session here. Support and parallel work are on demand, not a permanent team. It assumes no restarts, findings, repeated controls or additional support. Findings return to the responsible author, followed by the required fresh review.',
    'This is source-grounded illustration, not XPlanner session or approval history. Project preparation covers Bootstrap through 14, then the rename example follows 15-19. Approved baselines are reused; changed UI or architecture repeats applicable controls. Real replacements restore context from durable records.'
  ],
  process:'Process 3D',roles:'All roles',source:'Instructions and example',download:'Download diagram',
  illustration:'Illustrative, not XPlanner agent execution history or evidence that all stages or the entire migration are complete.'
};

function exampleModel(data) {
  const rows=tables(data.source).get('Example Sequence');
  if(JSON.stringify(rows?.[0])!==JSON.stringify(['ID','Stage','Role','Mode','Session','Action','Handoff']))throw Error('Invalid example sequence table');
  const sessions=new Map(), ids=new Set();
  let previous=-1;
  const sequence=rows.slice(1).map(([id,stageText,role,mode,session,action,handoff])=>{
    const stage=Number(stageText), assigned=data.assignments[stage], flow=data.flow[stage];
    if(!assigned || stage<previous || ids.has(id))throw Error('Invalid example stage/order/id');
    previous=stage; ids.add(id);
    const actor=role==='owner'?'owner':role==='pm'?'pm':isReview(mode)?'reviewer':'author';
    let spawned=false;
    if(role==='owner'){
      if(mode!=='decision'||session!=='human'||!(flow.ownerGate||stage===15))throw Error('Invalid owner decision');
    }else{
      const peer=mode==='peer-review';
      const deployment = role==='pm' && mode==='coordinate' &&
        deploymentStages[id]===stage;
      if(!data.roles[role] || (!deployment && (peer ? assigned.peer!==role : assigned.lead!==role||assigned.mode!==mode)))throw Error('Example assignment differs from role contract: '+id);
      const prior=sessions.get(session);
      if(prior && (prior.role!==role || isReview(mode) || isReview(prior.mode)))throw Error('Review session must be fresh; session cannot change role: '+session);
      if(session==='human'||!session)throw Error('Invalid agent session');
      if(!prior){sessions.set(session,{session,role,mode,stage});spawned=true;}
    }
    if(!STAGE_NAMES[stage])throw Error('Missing process stage name: '+stage);
    return {id,stage,stageName:STAGE_NAMES[stage],role,mode,session,action,handoff,actor,spawned,skill:data.roles[role]?.skill};
  });
  for(const assigned of data.assignments){
    const stage=Number(assigned.id.slice(6));
    if(!sequence.some(s=>s.stage===stage&&s.role===assigned.lead&&s.mode===assigned.mode))throw Error('Missing illustrated lead: '+assigned.id);
    if(assigned.peer!=='none'&&!sequence.some(s=>s.stage===stage&&s.role===assigned.peer&&s.mode==='peer-review'))throw Error('Missing peer review: '+assigned.id);
  }
  for(const [id,stage] of Object.entries(deploymentStages)){
    const deployment=sequence.findIndex(s=>s.id===id&&s.stage===stage&&s.role==='pm'&&s.mode==='coordinate');
    if(deployment<0)throw Error('Missing PM deployment handoff: '+id);
    const verification=sequence.findIndex(s=>s.stage===stage&&s.mode==='responsible-check');
    if(deployment>=verification)throw Error('PM deployment must precede specialist verification: '+id);
  }
  for(const stage of data.flow.filter(s=>s.ownerGate)){
    if(!sequence.some(s=>s.stage===Number(stage.id.slice(6))&&s.role==='owner'))throw Error('Missing owner decision: '+stage.id);
  }
  if(!sequence.some(s=>s.id==='assumptions'&&s.stage===15&&s.role==='owner'))throw Error('Missing owner assumption dispositions before Stage 16');
  const starts=[...sessions.values()];
  return {sequence,sessions:starts,counts:{pm:starts.filter(s=>s.role==='pm').length,
    authors:starts.filter(s=>s.role!=='pm'&&!isReview(s.mode)).length,
    reviewers:starts.filter(s=>isReview(s.mode)).length,total:starts.length}};
}

function sessionLabel(step,t){
  if(step.actor==='owner')return t.owner;
  return `${step.spawned?t.newAgent+': ':''}${step.session}${step.mode==='responsible-check'?' / check':''}`;
}

function stageLabel(step,y,height){
  const lines=[''];
  for(const word of step.stageName.split(/\s+/)){
    const last=lines.length-1;
    if(lines[last] && lines[last].length+word.length+1>20)lines.push(word);
    else lines[last]+=(lines[last]?' ':'')+word;
  }
  const baseline=y+height/2-(lines.length-1)*9+5;
  return `<text x="22" y="${baseline}" class="stage-name" aria-label="${escape(step.stageName)}">${lines.map((line,i)=>`<tspan x="22" dy="${i?18:0}">${escape(line)}</tspan>`).join('')}</text>`;
}

function diagram(sequence,t,part='full'){
  const prefix=`sequence-en-${part}`;
  let nextY=126;
  const positions=sequence.map((step,i)=>{
    const boundary=part==='full'&&step.stage===15&&sequence[i-1]?.stage===14;
    if(boundary)nextY+=78;
    const y=nextY;
    nextY+=step.stage<15?96:108;
    return {y,boundary};
  });
  const h=nextY+(part==='full'?96:64);
  const txt=(x,y,value,cls='body')=>`<text x="${x}" y="${y}" class="${cls}">${escape(value)}</text>`;
  const arrow=(x1,x2,y,label,color,message='')=>`<g${message?` data-message="${message}" data-from="${x1===610?'pm':'specialist'}" data-to="${x2===610?'pm':'specialist'}"`:''}><path d="M${x1} ${y} H${x2}" class="arrow ${color}" marker-end="url(#${prefix}-${color})"/>${txt((x1+x2)/2,y-7,label,'edge center')}</g>`;
  const events=sequence.map((step,i)=>{
    const {y,boundary}=positions[i];
    const compact=step.stage<15,boxHeight=compact?82:90,returnY=compact?68:74;
    const x=step.actor==='owner'?100:step.actor==='pm'?444:846, width=step.actor==='pm'?320:330;
    let connectors='';
    if(['author','reviewer'].includes(step.actor)){
      const color=step.actor==='reviewer'?'green':'blue';
      connectors=arrow(610,841,y+16,step.actor==='reviewer'?t.reviewLaunch:t.launch,color,'ASSIGN')
        +arrow(841,610,y+44,t.acknowledge,color,'ACK')
        +arrow(841,610,y+76,step.actor==='reviewer'?t.reviewReturn:t.return,color,'RESULT');
    }
    if(step.actor==='owner')connectors=arrow(602,433,y+23,t.request,'gold')+arrow(433,602,y+returnY,t.decision,'gold');
    const divider=boundary?`<rect x="0" y="${y-73}" width="1300" height="66" fill="#f7f9fa"/>${txt(22,y-46,t.featureTitle,'lane')}${txt(22,y-21,t.featureStart,'small')}`:'';
    return `${divider}<g data-event="${escape(step.id)}" data-actor="${step.actor}" data-role="${step.role}" data-mode="${step.mode}" data-stage="${step.stage}" data-session="${escape(step.session)}"${step.skill?` data-skill="${escape(step.skill)}"`:''}${step.spawned?' data-spawn="true"':''}>
${stageLabel(step,y,boxHeight)}
<g transform="translate(100 0)">${connectors}<g class="event-box" transform="translate(${x} ${y})"><rect width="${width}" height="${boxHeight}" rx="5" class="box ${step.actor}"/>
${txt(16,23,sessionLabel(step,t),'tag')}${txt(16,compact?45:49,step.action,'action')}${txt(16,compact?67:73,step.handoff,'small')}</g></g></g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 ${h}" role="img" aria-labelledby="${prefix}-title ${prefix}-desc">
<title id="${prefix}-title">${escape(part==='full'?t.diagramTitle:t[part+'Title'])}</title><desc id="${prefix}-desc">${escape(t.diagramDescription)}</desc>
<style>svg{background:#f7f9fa}text{font-family:Arial,Helvetica,sans-serif;fill:#203340;letter-spacing:0}.body{font-size:16px}.lane{font-size:20px;font-weight:700}.small,.edge{font-size:14px;fill:#49606d}.center{text-anchor:middle}.tag{font-size:13px;font-weight:700}.action{font-size:17px;font-weight:700}.stage-name{font-size:15px;font-weight:700;fill:#49606d}.box{stroke-width:1.5}.pm,.author{fill:#e7f1fd;stroke:#477eb0}.owner{fill:#fff5db;stroke:#ac8438}.reviewer{fill:#e3f4ea;stroke:#398166}.lifeline{stroke:#5187b7;stroke-width:3}.guide{stroke:#e0e6ea;stroke-width:1}.arrow{fill:none;stroke-width:1.6}.arrow.green{stroke:#398166}.arrow.gold{stroke:#9c782f}.arrow.blue{stroke:#477eb0}.edge{paint-order:stroke;stroke:#f7f9fa;stroke-width:5;stroke-linejoin:round}</style>
<defs>${[['green','#398166'],['gold','#9c782f'],['blue','#477eb0']].map(([name,color])=>`<marker id="${prefix}-${name}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="${color}"/></marker>`).join('')}</defs>
${txt(22,29,t.step,'lane')}<g transform="translate(100 0)">
${txt(100,29,t.owner,'lane')}${txt(100,53,t.ownerNote,'small')}
${txt(444,29,t.pm,'lane')}${txt(444,53,t.pmNote,'small')}
${txt(846,29,t.specialist,'lane')}${txt(846,53,t.specialistNote,'small')}
<path class="guide" d="M88 67 V${nextY+16} M822 67 V${nextY+16}"/>
${txt(610,98,part==='feature'?t.featureStart:t.start,'small center')}
<path class="lifeline" d="M604 109 V${nextY+13}"/></g>
${events}
${txt(704,h-(part==='full'?48:18),part==='project'?t.projectEnd:t.done,'body center')}
${part==='full'?txt(704,h-18,t.illustration,'small center'):''}
</svg>\n`;
}

function page({sequence,counts},t,roles){
  const roster=Object.values(roles).map(r=>`<li><a href="../../${escape(r.skill)}">${escape(r.title)}</a></li>`).join('');
  const sections=['project','feature'].map(part=>{
    const rows=sequence.filter(s=>part==='project'?s.stage<15:s.stage>=15);
    const cards=rows.map(s=>`<li class="${s.actor}" data-mobile-event="${s.id}"><span class="mobile-meta"><span class="mobile-stage">${escape(s.stageName)}</span>${escape(sessionLabel(s,t))}</span><strong>${escape(s.action)}</strong><span>${escape(s.handoff)}</span></li>`).join('');
    return `<section id="${part}-phase" aria-labelledby="${part}-title"><h2 id="${part}-title">${escape(t[part+'Title'])}</h2><p class="muted">${escape(t[part+'Note'])}</p><figure class="diagram">${diagram(rows,t,part)}</figure><ol class="mobile-sequence" aria-label="${escape(t[part+'Title'])}">${cards}</ol></section>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(t.title)}</title>
<style>*{box-sizing:border-box}body{margin:0;color:#203340;background:#f7f9fa;font:16px/1.5 Arial,Helvetica,sans-serif;letter-spacing:0}header,main,footer{max-width:1248px;margin:auto;padding:18px 24px}header{border-bottom:1px solid #cbd6dc;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;align-items:center}nav{display:flex;gap:12px 22px;flex-wrap:wrap;font-size:14px}a{color:#235f91;text-underline-offset:3px}a:focus-visible,summary:focus-visible{outline:3px solid #d29726;outline-offset:4px}h1{font-size:26px;line-height:1.25;margin:0 0 8px}p{margin:8px 0}.count{font-weight:700;margin-top:16px}.muted{font-size:14px;color:#49606d}.diagram{margin:24px 0 8px}.diagram svg{display:block;width:100%;height:auto}.mobile-sequence{display:none}details{margin:20px 0;border-top:1px solid #cbd6dc;padding-top:16px;max-width:920px}summary{cursor:pointer;font-weight:700}details li{margin:10px 0}footer{border-top:1px solid #cbd6dc;font-size:14px;color:#49606d}.mobile-sequence li{list-style:none;border-left:4px solid #5187b7;padding:10px 14px;margin:0 0 18px;background:#e7f1fd;position:relative;overflow-wrap:anywhere}.mobile-sequence li:after{content:'↓';position:absolute;bottom:-23px;left:12px;color:#607783}.mobile-sequence li:last-child:after{display:none}.mobile-sequence .owner{border-color:#ac8438;background:#fff5db}.mobile-sequence .reviewer{border-color:#398166;background:#e3f4ea}.mobile-sequence span,.mobile-sequence strong{display:block}.mobile-meta{font-size:13px;margin-bottom:5px}.mobile-sequence strong{font-size:16px}.mobile-sequence span:last-child{font-size:14px;margin-top:3px}@media(max-width:760px){header,main,footer{padding:16px}.diagram{display:none}.mobile-sequence{display:block;padding:0;margin:22px 0}h1{font-size:24px}}@media print{header,details,footer,.mobile-sequence{display:none}.diagram{display:block}main{padding:0;max-width:none}h1{font-size:20px}.muted{font-size:12px}}
section{margin-top:32px;border-top:1px solid #cbd6dc;padding-top:20px;scroll-margin-top:16px}h2{font-size:21px;line-height:1.3;margin:0 0 8px}.phases{margin-top:20px}.diagram{margin-left:0;margin-right:0}section .diagram{margin-top:22px}.agent-roster{display:flex;flex-wrap:wrap;gap:8px 28px;padding-left:20px;margin:14px 0}.agent-roster li{margin:0}.message-guide ol{padding-left:24px}.context-links{display:flex;flex-wrap:wrap;gap:8px 22px}.mobile-stage{font-weight:700}
</style></head><body><header><nav aria-label="${escape(t.process)}"><a href="https://legacy-transformation-demo.olsys.dev/starter-process/?lang=en">${escape(t.process)}</a><a href="roles.html">${escape(t.roles)}</a><a href="../agent-system-overview.md#small-feature-example">${escape(t.source)}</a><a href="../agent-roles.md">Role contract and skills</a><a href="example.svg" download>${escape(t.download)}</a></nav></header>
<main><h1>${escape(t.title)}</h1><ul class="agent-roster" aria-label="Agent roles">${roster}</ul><p class="muted">Six roles, not six permanent agents. Owner decisions remain human. Illustrative happy path.</p>
<details class="message-guide"><summary>Tasks, acknowledgements and results</summary><ol>
<li><strong>PM to specialist: task + instructions.</strong> Scope, exact inputs, permitted files, the stage procedure and role skill. A review task includes only the materials allowed for that review phase.</li>
<li><strong>Specialist to PM: ACK (acknowledgement).</strong> Before work: instructions read, task and boundaries understood; actual session and skill version identified. Not completion or approval.</li>
<li><strong>Specialist to PM: RESULT.</strong> After work: exact files, checks and remaining gaps. A reviewer returns a report and supporting evidence. PM checks the handoff; independent review and owner decisions remain separate.</li>
</ol><p>Blue: author or responsible check. Green: fresh independent or peer review. NEW marks a new session; another assignment does not necessarily start another agent.</p>
<p class="context-links"><a href="../../MIGRATION.md">MIGRATION.md: session entry and routing</a><a href="../migration_methodology.md#actors">Methodology: how each stage is performed</a><a href="../agent-roles.md">Role contract: assignment and communication</a></p>
<p>Skills support the stage procedure; they do not replace it. These are process instructions, not a deployed orchestrator or proof that delegation occurred.</p></details>
<details class="example-context"><summary>Example scope and session count</summary><p>${escape(t.subtitle)}</p><p class="count" data-session-count="${counts.total}">${counts.pm} PM + ${counts.authors} specialist authors + ${counts.reviewers} fresh reviewers = ${counts.total} illustrative sessions</p><p>Sequential assignments, no restarts or repeated reviews; not simultaneous agents or a permanent team. QA appears in reviews, without a separate QA author session.</p><p>Grounded in XPlanner <a href="https://github.com/olsys-ltd/xplanner2/blob/de7f84ed6a539f314cbb0ae75509ae1146c886e6/specs/004-project-workspace/spec.md">Project Workspace, User Story 4 and FR-304/306/308</a>; an illustration, not actual approval or session history.</p></details>
<nav class="phases" aria-label="${escape(t.stageMap)}"><a href="#project-phase">${escape(t.projectTitle)}</a><a href="#feature-phase">${escape(t.featureTitle)}</a></nav>${sections}
<details><summary>${escape(t.notesTitle)}</summary><ul>${t.notes.map(n=>`<li>${escape(n)}</li>`).join('')}</ul><p><strong>${escape(t.stageMap)}:</strong> ${escape(t.mapText)}</p></details></main><footer>${escape(t.illustration)}</footer></body></html>\n`;
}

function exampleFiles(data){
  const example=exampleModel(data),picture=diagram(example.sequence,en),html=page(example,en,data.roles);
  // Preserve existing public bookmarks; all example URLs serve English.
  return [['example.svg',picture],['example.ru.svg',picture],['en.html',html],['index.html',html]];
}
module.exports={exampleModel,exampleFiles};

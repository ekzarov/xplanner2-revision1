'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { tables, readContract } = require('../tools/process-contract');
const { readRoleContract } = require('../tools/agent-role-contract');
const MarkdownIt = require('../tools/node_modules/markdown-it');
const { exampleFiles } = require('./example-view');

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const canonical = value => value.replace(/\r\n/g, '\n');
const number = stage => Number(stage.id.slice(6));

function model(root) {
  const source = fs.readFileSync(path.join(root, 'analysis/agent-system-overview.md'), 'utf8');
  const parsed = tables(source);
  function participants(name) {
    const rows = parsed.get(name);
    if (JSON.stringify(rows?.[0]) !== JSON.stringify(['ID','Title','Count','Responsibility','Output'])) throw new Error('Invalid '+name+' table');
    if (new Set(rows.slice(1).map(row=>row[0])).size !== rows.length-1) throw new Error('Duplicate '+name);
    return Object.fromEntries(rows.slice(1).map(row => [row[0], {title:row[1],count:row[2],responsibility:row[3],output:row[4]}]));
  }
  const roles = participants('Roles'), context = participants('People, Tools And Records');
  if (Object.keys(roles).sort().join(',') !== 'architect,ba,developer,pm,qa,ux') throw new Error('Expected six portable roles');
  if (Object.keys(context).sort().join(',') !== 'owner,records,tools') throw new Error('Invalid non-agent participants');
  const contract = readRoleContract(root);
  for (const {id,name,skill} of contract.roles) {
    if (roles[id]?.title !== name) throw new Error('Role title differs from contract: '+id);
    roles[id].skill = skill;
  }
  const assignments = contract.assignments.map(row=>({...row,id:row.stage,peer:row.peer[0]||'none'}));
  const { flow } = readContract(root);
  return {source,roles,context,assignments,flow,stages:{
    independent:flow.filter(s=>s.checkRole==='independent').map(number),
    peer:flow.filter(s=>s.checkRole==='peer').map(number),
    primary:flow.filter(s=>s.checkRole==='primary').map(number),
    owner:flow.filter(s=>s.ownerGate).map(number)
  }};
}

function lines(text, limit) {
  const result = [''];
  for (const word of text.split(/\s+/)) {
    const last = result.length - 1;
    if (result[last] && result[last].length + word.length + 1 > limit) result.push(word);
    else result[last] += (result[last] ? ' ' : '') + word;
  }
  return result;
}

function svg({roles,context}) {
  function text(x,y,value,cls='body',limit=50) {
    return `<text x="${x}" y="${y}" class="${cls}">${lines(value,limit).map((line,i)=>`<tspan x="${x}" dy="${i?23:0}">${escape(line)}</tspan>`).join('')}</text>`;
  }
  function node(id,x,y,w,h,limit=42) {
    const r=roles[id] || context[id];
    return `<g ${roles[id]?'data-role':'data-context'}="${id}" transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="6" class="node ${id}"/>${text(16,31,r.title,'title',limit)}${text(16,58,r.count,'count',limit)}${text(16,91,r.responsibility,'body',limit)}</g>`;
  }
  function arrow(d,label,x,y,both=false) {
    return `<path d="${d}" class="arrow" marker-end="url(#head)"${both?' marker-start="url(#tail)"':''}/><text x="${x}" y="${y}" class="edge">${escape(label)}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 950" role="img" aria-labelledby="title desc">
<title id="title">Six portable roles: PM delegates specialist work</title>
<desc id="desc">The human owner decides. PM coordinates and delegates to BA, UX, Architect, Developer and QA; PM does not do specialist work. Assignments name scope, revisions and a skill. Specialists explicitly read it and return ACK, then RESULT. Fresh eligible sessions of the same specializations review work. Tools are not agents. Durable records preserve context independently of native client profiles.</desc>
<style>
svg{background:#f7f9fa}text{font-family:Arial,Helvetica,sans-serif;fill:#192b36;letter-spacing:0}.title{font-size:21px;font-weight:700}.body{font-size:17px}.count{font-size:16px;font-weight:700;fill:#49606d}.edge{font-size:16px;paint-order:stroke;stroke:#f7f9fa;stroke-width:7px;stroke-linejoin:round}.note{font-size:16px;fill:#49606d}.node{fill:#fff;stroke:#9aadb8;stroke-width:1.5}.pm{fill:#e5f0fc;stroke:#3975ac;stroke-width:2}.owner{fill:#fff4d9;stroke:#ab812e}.reviewer{fill:#e8f5ef;stroke:#45816a}.tools,.records{fill:#edf1f3}.arrow{fill:none;stroke:#526b7b;stroke-width:2}marker path{fill:#526b7b}.return{fill:#963b3b;font-size:17px;font-weight:700}
</style>
<defs><marker id="head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z"/></marker><marker id="tail" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z"/></marker></defs>
${node('owner',30,20,350,155,36)}
${node('pm',600,20,650,155,65)}
${arrow('M382 65 H598','Ask / decide',406,53,true)}
${text(406,113,'Human authority','note',20)}
${text(30,214,'PM does not do specialist work. Six roles are not six permanent sessions.','title',100)}
${arrow('M925 178 V270 H150 V316','Assignment: scope + revision + skill; explicit reading + ACK before work',30,250,true)}
<path d="M925 270 H1130" class="arrow"/>
${['ux','architect','developer','qa'].map((id,i)=>arrow(`M${395+i*245} 270 V316`,'',0,0)).join('')}
${['ba','ux','architect','developer','qa'].map((id,i)=>node(id,30+i*245,320,240,208,25)).join('')}
${text(30,568,'RESULT to PM: session + skill version + files/snapshot + checks + gaps + next action.','body',120)}
<path d="M30 595 H1250" stroke="#cbd6dc"/>
${text(30,631,'Author / responsible-check sessions','title',60)}
${text(30,667,'Authors continue bounded work. Responsible checks:','body',60)}
${text(30,695,'3 BA; 12 Architect; 18 Developer. Not independent.','body',60)}
${text(680,631,'Fresh instances of the same specializations','title',60)}
${text(680,667,'2 BA; 7 QA; 10/14/16 Architect; 17 Developer; 19 QA.','body',65)}
${text(680,695,'Blind 2/19: save Phase A, then release Phase B.','body',65)}
${text(680,723,'Final acceptance: independent agents of other vendors.','note',65)}
${text(30,759,'Findings return to the responsible author; PM routes, the next required reviewer is fresh.','return',120)}
${node('tools',30,792,455,140,48)}
${node('records',510,792,740,140,79)}
</svg>\n`;
}

function page(data, picture) {
  const parser = new MarkdownIt({html:true});
  parser.renderer.rules.heading_open = (tokens,idx) => {
    const heading=tokens[idx+1].content;
    return `<${tokens[idx].tag} id="${heading.toLowerCase().replace(/[^a-z0-9 -]/g,'').replace(/ /g,'-')}">`;
  };
  // The page adds its own compact navigation and diagram before the source sections.
  const detailSource = data.source.slice(data.source.indexOf('<a id="read-how-many-agents">'));
  const details = parser.render(detailSource).replace(/href="(?!https?:|#)([^"]+)"/g, (_,href)=> {
    return `href="${escape(path.posix.normalize('../' + href))}"`;
  });
  const list = values => values.map(n=>n===0?'Bootstrap':n).join(', ');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent system | Legacy modernization</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f7f9fa;color:#192b36;font:16px/1.6 Arial,Helvetica,sans-serif;letter-spacing:0}a{color:#235f91;text-underline-offset:3px}a:focus-visible{outline:3px solid #d29726;outline-offset:4px}header,main,footer{max-width:1328px;margin:auto;padding:20px 24px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #cbd6dc}h1{margin:0;font-size:26px;line-height:1.25}h2{font-size:22px;margin:30px 0 12px}nav{display:flex;flex-wrap:wrap;gap:12px 24px;font-size:14px}p{margin:12px 0}.summary{margin:0 0 14px;font-size:17px}.diagram{overflow-x:auto;margin:0}.diagram svg{display:block;width:100%;min-width:960px;height:auto}.stages{border-top:1px solid #cbd6dc;border-bottom:1px solid #cbd6dc;padding:14px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px 30px;font-size:14px}.stages p{margin:0}.reading{max-width:940px}li{margin:9px 0}code{font-size:14px;overflow-wrap:anywhere}footer{border-top:1px solid #cbd6dc;font-size:14px;color:#49606d}#reading-and-maintenance~p:last-child{overflow-wrap:anywhere}@media(max-width:650px){header{display:block;padding:16px}nav{margin-top:12px;gap:12px 18px}h1{font-size:24px}main{padding:16px}.stages{grid-template-columns:1fr}.summary{font-size:16px}footer{padding:16px}}@media print{header nav,.reading,footer{display:none}.diagram{overflow:visible}.diagram svg{min-width:0;width:100%}header,main{padding:0}.summary{font-size:13px}.stages{font-size:11px}}
.agent-roster{display:flex;flex-wrap:wrap;gap:8px 28px;padding-left:20px;margin:0 0 14px}.agent-roster li{margin:0}
</style></head><body>
<header><h1>Agent system</h1><nav aria-label="Related process views"><a href="https://legacy-transformation-demo.olsys.dev/starter-process/">Process 3D</a><a href="../migration_methodology.html">Methodology</a><a href="#how-many-agents">How many agents?</a><a href="diagram.svg" download>Download diagram</a></nav></header>
<main><ul class="agent-roster" aria-label="Agent roles">${Object.values(data.roles).map(r=>`<li><a href="../../${escape(r.skill)}">${escape(r.title)}</a></li>`).join('')}</ul><p class="summary">Six roles, not six permanent agents. The owner is human.</p>
<figure class="diagram" aria-label="Agent roles and exchanges">${picture}</figure>
<p><a href="index.html">Step-by-step example</a> &middot; <a href="../agent-roles.md">Normative role contract</a>.</p>
<section class="stages" aria-label="Roles across process stages"><p><strong>Independent reviews:</strong> ${list(data.stages.independent)}. <strong>Code peer review:</strong> ${list(data.stages.peer)}.</p><p><strong>Responsible-agent verification:</strong> ${list(data.stages.primary)}; not fresh independent reviews.</p><p><strong>Owner decisions:</strong> ${list(data.stages.owner)}; Stage 3 conditional fallback.</p><p><strong>Operating model, not a deployed agent service.</strong> Gates are tools, not agents.</p></section>
<article class="reading">${details}</article></main>
<footer>English Markdown defines the process. This picture summarizes roles; exact permissions and return routes remain in the stage instructions.</footer>
</body></html>\n`;
}

function generatedFiles(root) {
  const data = model(root), picture = svg(data);
  return new Map([['diagram.svg',picture],['roles.html',page(data,picture)],...exampleFiles(data)]);
}

function synchronize(root, check=false) {
  for (const [name,expected] of generatedFiles(root)) {
    const file=path.join(root,'analysis/agent-system',name);
    if (check) {
      if (!fs.existsSync(file) || canonical(fs.readFileSync(file,'utf8')) !== expected) throw new Error('Stale agent-system view: '+name);
    } else fs.writeFileSync(file,expected);
  }
}

if (require.main === module) {
  try {synchronize(path.resolve(__dirname,'../..'),process.argv.includes('--check'));console.log('Agent-system overview and views agree');}
  catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={model,generatedFiles,synchronize};

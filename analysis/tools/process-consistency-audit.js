'use strict';
const fs=require('node:fs');
const path=require('node:path');
const cheerio=require('cheerio');
const files={entry:'MIGRATION.md',methodology:'analysis/migration_methodology.md',html:'analysis/migration_methodology.html',drawio:'analysis/migration_artifact_flow.drawio',verdict:'analysis/architecture/templates/architecture-closure-NNN-template.md',orchestration:'analysis/agent_orchestration.md',constitution:'.specify/memory/constitution.md',profiles:'analysis/artifact-reading-profiles.json',statuses:'analysis/artifact-status-meanings.md',contract:'analysis/process-contract.md'};
function consistencyErrors(text) {
  const errors=[];
  for(const key of ['entry','methodology']) {
    if(/Stages 15, 17 and 18 (?:read|retain)|Stage 18 reopens reproduced/.test(text[key]))errors.push(key+': Stage 18 must record and return cosmetic corrections, not update the backlog');
  }
  if(!text.entry.includes('process-contract.md') || !text.entry.includes('artifact-reading-contract.md'))errors.push('Entry point must route agents to process and reading contracts');
  const forward=text.entry.match(/A forward exit[\s\S]*?(?=\n\s*\n|$)/)?.[0]||'';
  if(!forward.includes('Stage 7 Low-cosmetic') || !forward.includes('not labelled clean'))errors.push('Forward exits must preserve the non-clean Stage 7 closing exception');
  if(/update this verdict, the corrected architecture/.test(text.verdict) || !/does not edit[\s\S]{0,10}architecture/.test(text.verdict))errors.push('Stage 12 template must prohibit architecture mutation');
  if(!text.orchestration.includes('### Blind Review Packets') || !text.orchestration.includes('before releasing'))errors.push('Orchestration must split blind review packets before invocation');
  if(!text.entry.includes('Blind-review reading order') || !text.orchestration.includes('### Expectation-Only Extracts') || !text.orchestration.includes('destination notes'))errors.push('Blind reviewers need neutral routing and extracts without prior outcomes');
  if(text.entry.includes('[canonical gate contract](analysis/stage-gates.json)'))errors.push('Gate editing authority must be English MD, not derived JSON');
  errors.push(...require('./constitution-boundaries').boundaryErrors(text));
  if(text.profiles.includes('closure evidence before final approval'))errors.push('Stage 12 reading summary must verify an already re-approved architecture');
  if(/[\u0400-\u04ff]/u.test(text.statuses))errors.push('Status instruction guide must be English; Russian is presentation-only');
  const $=cheerio.load(text.html);
  if(/re-hashed|reissued|snapshot refreshed/i.test($('#st12').text()))errors.push('Stage 12 overview must verify the approved unchanged snapshot');
  if(/audit:sdd:complete/.test($('#ph17').text()))errors.push('Stage 17/18 slice delivery must not demand global completion');
  const records=$('#ph18 .rulebox').toArray().map(e=>$(e).text()).find(s=>s.includes('Reconciliation is records-only'));
  if(!records?.includes('traceability'))errors.push('Records-only summary must include bounded traceability evidence updates');
  const xml=cheerio.load(text.drawio,{xmlMode:true});
  if(/18[^<]*sdd:complete/.test(xml('[id="c162"]').attr('value')||''))errors.push('Main Draw.io Stage 18 gate must use sdd:slice');
  const phase2=xml('[id="stage-flow-stage-02"]').attr('value')||'';
  if(!/Phase B:.*legacy_reconnaissance\.md.*legacy_user_flows\.xlsx/.test(phase2))errors.push('Stage 2 role projection must defer filled source records');
  return errors;
}
function run(root){const input=Object.fromEntries(Object.entries(files).map(([key,file])=>[key,fs.readFileSync(path.join(root,file),'utf8')]));const errors=consistencyErrors(input);if(errors.length)throw Error(errors.join('\n'));}
if(require.main===module){try{run(path.resolve(__dirname,'../..'));console.log('Process instruction boundaries agree');}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={files,consistencyErrors,run};

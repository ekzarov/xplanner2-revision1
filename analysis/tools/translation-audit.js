'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
function collectPairs(data, ru, ui) {
  const pairs = {}, errors = [];
  function pair(key,en,translated) {
    if (typeof en !== 'string' || !en.trim()) return;
    if (typeof translated !== 'string' || !translated.trim()) {errors.push('Missing Russian text: '+key);return;}
    pairs[key] = {en,ru:translated};
  }
  function fields(prefix,en,tr,keys) {for(const key of keys) if(en[key]) pair(prefix+'.'+key,en[key],tr?.[key]);}
  for (const [key,en] of Object.entries(ui)) pair('ui.'+key,en,ru.ui?.[key]);
  for (const kind of ['phases','stages','artifacts','gates']) for(const item of data[kind]) {
    const tr=ru[kind]?.[item.id], prefix=kind+'.'+item.id;
    fields(prefix,item,tr,['title','range','actor','summary','input','exit','returns','evidence','example','role','desc','usage']);
    if(item.label && (tr?.label || kind==='phases' || (kind==='gates' && !item.label.startsWith('audit:')) || ['implementation','tests','migrations','candidate-pr','journey-evidence'].includes(item.id))) pair(prefix+'.label',item.label,tr?.label);
    if(item.headline && kind!=='gates') pair(prefix+'.headline',item.headline,tr?.headline);
    for(const [i,action]of (item.actions||[]).entries()) pair(prefix+'.actions.'+i,action,tr?.actions?.[i]);
    if(item.actions && tr?.actions?.length!==item.actions.length)errors.push('Different action count: '+prefix);
    if(item.projectOutput) pair(prefix+'.projectOutput',item.projectOutput,ru.projectOutputs?.[item.id]);
    if(item.xplannerExample?.note) pair(prefix+'.exampleNote',item.xplannerExample.note,tr?.xplannerExample?.note);
    for(const [i,example] of (item.xplannerExamples||[]).entries()) pair(prefix+'.exampleLabel.'+i,example.label,tr?.xplannerExamples?.[i]?.label);
    if(item.relationship) fields(prefix+'.relationship',item.relationship,tr?.relationship,['title','text','linkLabel']);
    for(const field of ['responsibility','recordContract','prevention','assignment']) if(item[field]) bilingual(prefix+'.'+field,item[field]);
    if(item.reentry) {bilingual(prefix+'.reentry',item.reentry); for(const [i,source]of item.reentry.sources.entries())pair(prefix+'.reentry.sources.'+i,source.en,source.ru);}
    if(item.gateContract) bilingual(prefix+'.gateContract.requirements',item.gateContract.requirements);
    if(item.completionContract) bilingual(prefix+'.completionContract.requirements',item.completionContract.requirements);
    if(item.reviewContract) {
      bilingual(prefix+'.review.headline',item.reviewContract.headline);
      bilingual(prefix+'.review.boundary',item.reviewContract.boundary);
      for(const [i,input]of item.reviewContract.inputs.entries()) {
        bilingual(prefix+'.review.inputs.'+i,input.description);
        if(!input.artifact && /\s/.test(input.path))pair(prefix+'.reference.'+i,input.path,ru.referenceLabels?.[input.path]);
      }
    }
  }
  function bilingual(prefix,value) {
    function visit(key,en,tr) {
      if(typeof en==='string')pair(key,en,tr);
      else if(en && typeof en==='object')for(const [k,v]of Object.entries(en))visit(key+'.'+k,v,tr?.[k]);
    }
    visit(prefix,value.en,value.ru);
  }
  return {pairs,errors};
}
function auditPairs(pairs,reviewed) {
  const errors=[];
  for(const [key,pair]of Object.entries(pairs))if(reviewed[key]!==digest(pair))errors.push('EN/RU review required: '+key);
  for(const key of Object.keys(reviewed))if(!pairs[key])errors.push('Obsolete translation-review field: '+key);
  return errors;
}
function run(root,record=false) {
  const dir=path.join(root,'analysis/process-canvas');
  if(!fs.existsSync(dir))return;
  const data=JSON.parse(fs.readFileSync(path.join(dir,'data.json'),'utf8'));
  const ru=JSON.parse(fs.readFileSync(path.join(dir,'translations.ru.json'),'utf8'));
  const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');
  const match=app.match(/const englishUi = (\{[\s\S]*?\n\});/);
  if(!match)throw Error('English UI dictionary not found');
  const ui=vm.runInNewContext('('+match[1]+')',{}, {timeout:1000});
  const {pairs,errors}=collectPairs(data,ru,ui);
  if(errors.length)throw Error(errors.join('\n'));
  const file=path.join(dir,'translation-review.json');
  if(record)fs.writeFileSync(file,JSON.stringify({schemaVersion:1,meaning:'Reviewed EN/RU wording only; not migration evidence or owner approval',fields:Object.fromEntries(Object.entries(pairs).map(([k,v])=>[k,digest(v)]))},null,2)+'\n');
  else {
    const checked=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')).fields:{};
    const errors=auditPairs(pairs,checked);
    if(errors.length)throw Error(errors.join('\n'));
  }
  return Object.keys(pairs).length;
}
if(require.main===module){try{console.log('EN/RU fields checked: '+run(path.resolve(__dirname,'../..'),process.argv.includes('--record-reviewed')));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={collectPairs,auditPairs,digest,run};

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const node=(id,label,rows,extra={})=>({id,label,metadata:{rows,group:'Planning',unresolved:[],basis:[],...extra}});
const fixture={
 nodes:[node('014-project-roles','Project Roles',[90]),node('029-accuracy','Iteration Accuracy Report',[260,261]),node('060-other','Other Scope',[1260],{unresolved:['Unclear import behavior'],basis:['quote']})],
 parityRows:[{row:90,epic:'UF-004',text:'Viewer Editor Admin dropdown per person.'},{row:260,epic:'UF-010',text:'Current status shows postponed hours and original estimates.'}],
 edges:[{source:'014-project-roles',target:'029-accuracy',metadata:{condition:'Governed role permissions for report queries'}}],
 sources:{quote:{quote:'Quoted integration behavior'}},
};

test('numeric search distinguishes exact slice and parity row numbers',async()=>{
 const {createSearchIndex,searchFeatures}=await import('../feature-canvas/search.js');
 const index=createSearchIndex(fixture);
 assert.deepEqual(searchFeatures(index,'014').map(r=>r.node.id),['014-project-roles']);
 for(const query of ['260','#260','row: 260','строка 260']){
  const hits=searchFeatures(index,query);assert.equal(hits.length,1);assert.equal(hits[0].node.id,'029-accuracy');assert.equal(hits[0].match.row,260);
 }
 assert.equal(searchFeatures(index,'26').length,0);
 assert.equal(searchFeatures(index,'#14').length,0);
});

test('full-text search includes scenario text and graph explanations with ranked excerpts',async()=>{
 const {createSearchIndex,searchFeatures,searchExcerpt}=await import('../feature-canvas/search.js');
 const index=createSearchIndex(fixture);
 assert.equal(searchFeatures(index,'HOURS postponed')[0].match.row,260);
 assert.equal(searchFeatures(index,'UF-004')[0].node.id,'014-project-roles');
 assert.equal(searchFeatures(index,'queries')[0].match.kind,'dependency');
 assert.equal(searchFeatures(index,'unclear')[0].match.kind,'question');
 assert.equal(searchFeatures(index,'quoted integration')[0].match.kind,'basis');
 assert.equal(searchFeatures(index,'nonexistent').length,0);
 assert.equal(searchFeatures(index,'   ').length,3);
 assert.equal(searchFeatures(index,'accuracy')[0].node.id,'029-accuracy');
 assert(searchExcerpt('prefix '.repeat(40)+'postponed hours','postponed').includes('postponed'));
 assert(searchExcerpt('x'.repeat(500),'missing').length<=163);
});

test('search works without workbook text and never mutates source evidence',async()=>{
 const {createSearchIndex,searchFeatures}=await import('../feature-canvas/search.js');
 const data=structuredClone(fixture);delete data.parityRows;
 const before=structuredClone(data),index=createSearchIndex(data);
 assert.equal(searchFeatures(index,'#261')[0].node.id,'029-accuracy');
 assert.equal(searchFeatures(index,'postponed').length,0);
 assert.deepEqual(data,before);
});

test('plain-English feature descriptions are searchable with their own result label', async () => {
 const {createSearchIndex,searchFeatures}=await import('../feature-canvas/search.js');
 const data=structuredClone(fixture);
 data.nodes[0].metadata.description='Lets administrators manage membership without sharing passwords.';
 const before=structuredClone(data);
 const hits=searchFeatures(createSearchIndex(data),'sharing passwords');
 assert.equal(hits.length,1);
 assert.equal(hits[0].node.id,'014-project-roles');
 assert.equal(hits[0].match.kind,'description');
 assert.deepEqual(data,before);
});

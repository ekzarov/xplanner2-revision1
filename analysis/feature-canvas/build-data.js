'use strict';
const fs = require('node:fs'), path = require('node:path');
const { alg } = require('../tools/node_modules/@dagrejs/graphlib');
const { auditDependencies, graphFor, completionClosure, GRAPH_FILE } = require('../tools/feature-dependencies');
const { sha256File } = require('../tools/lib');
const { overviewLayout } = require('./overview-layout');
const { workOrders } = require('./work-order');
async function build(root = path.resolve(__dirname, '../..')) {
  const file = path.join(root, GRAPH_FILE), exists = fs.existsSync(file);
  const audit = exists ? await auditDependencies({ root, required: true }) : null;
  if (audit && !audit.ok) throw Error(audit.errors.join('\n'));
  const source = exists ? GRAPH_FILE : 'analysis/feature-dependencies.example.json';
  const doc = audit?.document || JSON.parse(fs.readFileSync(path.join(root, source), 'utf8'));
  const graph = graphFor(doc, 'completion'), levels = {};
  for (const id of alg.topsort(graph)) levels[id] = Math.max(0, ...graph.predecessors(id).map(p => levels[p] + 1));
  return {
    schemaVersion: 2, language: 'en',
    workOrderMeaning: {
      iteration: 'One-based dependency group, not a scheduled sprint or an application iteration ID. Null means order unknown.',
      contract: 'Agree required provider contracts before dependent design; provider implementation may be unfinished.',
      completion: 'Satisfy required provider obligations before completing the consumer; implementation may overlap.',
      limitations: 'Read draft, reason, prerequisites and hiddenPrerequisites. Iteration numbers are not readiness, delivery evidence or authorization.',
    },
    source, sourceSha256: sha256File(path.join(root, source)), mode: exists ? doc.graph.metadata.mode : 'illustrative',
    title: doc.graph.id.startsWith('xplanner') ? 'XPlanner' : 'Starter',
    recordedAt: doc.graph.metadata.recorded_at, scope: doc.graph.metadata.scope,
    sources: doc.graph.metadata.sources,
    parityRows: [...new Set(Object.values(doc.graph.nodes).flatMap(node => node.metadata.rows))].sort((a,b) => a-b)
      .map(number => audit?.context.rowFacts.get(number)).filter(Boolean)
      .map(row => ({ row: row.row, epic: row.epic, text: row.facts.slice(0,5).filter(Boolean).join(' ') })),
    nodes: Object.entries(doc.graph.nodes).map(([id,n]) => ({ id, ...n, level: levels[id], completionScope: completionClosure(doc,id), scopeDigest: audit?.scopes[id] || null })),
    overview: await overviewLayout(Object.entries(doc.graph.nodes).map(([id,n]) => ({ id, ...n })), doc.graph.edges),
    workOrder: workOrders(Object.entries(doc.graph.nodes).map(([id,n]) => ({ id, ...n })), doc.graph.edges, exists ? doc.graph.metadata.mode : 'illustrative'),
    edges: doc.graph.edges, sourceBase: '../../',
    processUrl: fs.existsSync(path.join(root, 'analysis/process-canvas/index.html')) ? '../process-canvas/' : '../migration_methodology.html',
  };
}
async function run() {
  const data = JSON.stringify(await build(),null,2)+'\n', file=path.join(__dirname,'data.json');
  if(process.argv.includes('--check')){
    if(!fs.existsSync(file)||fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')!==data)throw Error('Feature dependency view is stale; run build-data.js');
  } else fs.writeFileSync(file,data);
  console.log('Dependency view '+(process.argv.includes('--check')?'verified':'generated'));
}
if(require.main===module)run().catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={build};

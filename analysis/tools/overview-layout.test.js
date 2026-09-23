'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { overviewLayout, validateLayout } = require('../feature-canvas/overview-layout');

const nodes = (...ids) => ids.map(id => ({ id, metadata: { group: 'Planning' } }));
const edge = (id, source, target, relation = 'contract') => ({
  source, target, relation, metadata: { id, assessment: 'candidate' },
});

test('overview keeps every node and routes crossing and parallel links around boxes', async () => {
  const n = nodes('a', 'b', 'c', 'd', 'e', 'unlinked');
  const e = [
    edge('ab', 'a', 'b'), edge('ac', 'a', 'c'), edge('bd', 'b', 'd'),
    edge('ce', 'c', 'e'), edge('ae', 'a', 'e'), edge('cd', 'c', 'd'),
    edge('ab-completion', 'a', 'b', 'completion'),
  ];
  const original = structuredClone({ n, e });
  const layout = await overviewLayout(n, e);
  validateLayout(layout, n, e);
  assert.equal(layout.nodes.length, 6);
  assert.equal(layout.edges.length, 7);
  assert(layout.edges.some(route => route.points.length > 2));
  assert.notDeepEqual(layout.edges.find(r => r.id === 'ab').points, layout.edges.find(r => r.id === 'ab-completion').points);
  assert(layout.bands.length > 1);
  assert.deepEqual({ n, e }, original, 'Layout must not mutate graph evidence');
  assert.deepEqual(await overviewLayout(n, e), layout, 'Generated coordinates must be reproducible');
});

test('contract cycles and disconnected components retain their directed endpoints', async () => {
  const n = nodes('a', 'b', 'c', 'd', 'e');
  const e = [edge('ab', 'a', 'b'), edge('ba', 'b', 'a'), edge('cd', 'c', 'd')];
  const layout = await overviewLayout(n, e);
  validateLayout(layout, n, e);
  assert.equal(layout.edges.length, 3);
});

test('high fan-in keeps both relation types on separate ports and clear routes', async () => {
  const n = nodes(...Array.from({ length: 12 }, (_, i) => 'provider-' + i), 'report');
  const e = n.slice(0, -1).flatMap((node, i) => [
    edge('contract-' + i, node.id, 'report'), edge('completion-' + i, node.id, 'report', 'completion'),
  ]);
  const layout = await overviewLayout(n, e);
  const ends = layout.edges.map(route => route.points.at(-1).y);
  assert.equal(new Set(ends).size, e.length);
  validateLayout(layout, n, e);
});

test('empty and entirely unlinked graphs still have valid visible layouts', async () => {
  assert.deepEqual(await overviewLayout([], []), { engine: 'elkjs@0.12.0', bands: [], nodes: [], edges: [] });
  const n = nodes(...Array.from({ length: 60 }, (_, i) => 'node-' + i));
  const layout = await overviewLayout(n, []);
  assert.equal(layout.nodes.length, n.length);
  assert(layout.bands.length > 1);
  validateLayout(layout, n, []);
});

test('layout validation rejects missing, overlapping and cut-through geometry', async () => {
  const n = nodes('a', 'b', 'block'), e = [edge('ab', 'a', 'b')];
  const layout = await overviewLayout(n, e);
  const missing = structuredClone(layout);missing.edges = [];
  assert.throws(() => validateLayout(missing, n, e), /lost/);
  const overlap = structuredClone(layout);Object.assign(overlap.nodes[2], { x: overlap.nodes[0].x, y: overlap.nodes[0].y });
  assert.throws(() => validateLayout(overlap, n, e), /Overlapping/);
  const route = {
    nodes: [{id:'a',x:0,y:0,width:20,height:20},{id:'b',x:100,y:0,width:20,height:20},{id:'block',x:50,y:0,width:20,height:20}],
    edges: [{id:'ab',points:[{x:20,y:10},{x:100,y:10}]}],
  };
  assert.throws(() => validateLayout(route, n, e), /crosses node/);
  route.edges[0].points[1].x = 95;
  assert.throws(() => validateLayout(route, n, e), /misses its port/);
});

test('depth steps flatten without moving ports or removing obstacle-avoidance bends', async () => {
  const { DEPTH_STEP, depthAt, overviewPosition, overviewRoute } = await import('../feature-canvas/overview-geometry.js');
  const bands = [{left:0,right:100},{left:200,right:300},{left:400,right:500}];
  assert.equal(depthAt(50,bands),0);
  assert.equal(depthAt(250,bands),-DEPTH_STEP);
  assert.equal(depthAt(450,bands),-2*DEPTH_STEP);
  assert.equal(depthAt(150,bands),-DEPTH_STEP/2);
  const node = {x:200,y:20,width:100,height:60};
  assert.deepEqual(overviewPosition(node,bands,false),{x:250,y:-50,z:-DEPTH_STEP});
  assert.deepEqual(overviewPosition(node,bands,true),{x:250,y:-50,z:0});
  const route={points:[{x:100,y:50},{x:350,y:50},{x:350,y:120},{x:400,y:120}]};
  const spatial=overviewRoute(route,bands,false),flat=overviewRoute(route,bands,true);
  assert.deepEqual(flat,route.points.map(p=>({x:p.x,y:-p.y,z:0})));
  assert(spatial.length>flat.length);
  assert.deepEqual(spatial[0],{x:100,y:-50,z:0});
  assert.deepEqual(spatial.at(-1),{x:400,y:-120,z:-2*DEPTH_STEP});
  const reverse=overviewRoute({points:[...route.points].reverse()},bands,false);
  assert.deepEqual(reverse,[...spatial].reverse());
});

test('committed example projection has complete routes with no node intersections', () => {
  const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../feature-canvas/data.json'),'utf8'));
  validateLayout(data.overview,data.nodes,data.edges);
  assert.equal(data.overview.nodes.length,data.nodes.length);
  assert.equal(data.overview.edges.length,data.edges.length);
});

test('adjustable level spacing preserves every endpoint and plan coordinate', async () => {
  const { depthAt, overviewPosition, overviewRoute } = await import('../feature-canvas/overview-geometry.js');
  const bands=[{left:0,right:220},{left:330,right:550},{left:660,right:880}];
  const source={x:330,y:20,width:220,height:82};
  const route={points:[{x:220,y:61},{x:330,y:61}]};
  for(const step of [220,440,880,1320]){
    assert.equal(depthAt(440,bands,step),-step);
    assert.equal(overviewPosition(source,bands,false,step).z,-step);
    assert.deepEqual(overviewRoute(route,bands,false,step).at(-1),{x:330,y:-61,z:-step});
    assert.deepEqual(overviewRoute(route,bands,true,step),[{x:220,y:-61,z:0},{x:330,y:-61,z:0}]);
  }
});

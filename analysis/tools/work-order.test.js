'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { workOrder, workOrders } = require('../feature-canvas/work-order');
const node = (id, reviewed = false, unresolved = []) => ({ id, metadata: { review: reviewed ? { source: 'review' } : null, unresolved } });
const edge = (source, target, relation = 'completion', assessment = 'confirmed') => ({ source, target, relation, metadata: { assessment } });
const row = (result, id) => result.rows.find(n => n.id === id);

test('iterations are longest prerequisite paths, not numeric IDs; parallel nodes share an iteration', () => {
  const nodes = ['900', '002', '700', '001'].map(id => node(id, true));
  const edges = [edge('900', '002'), edge('900', '700'), edge('002', '001'), edge('700', '001')];
  const result = workOrder(nodes, edges, 'completion', true);
  assert.deepEqual(result.rows.map(n => [n.id, n.iteration]), [['001', 3], ['002', 2], ['700', 2], ['900', 1]]);
  assert(result.rows.every(n => !n.draft));
});
test('unassessed isolates are unknown; a reviewed bounded isolate can be first', () => {
  const result = workOrder([node('a'), node('b', true), node('c', true, ['unknown'])], [], 'completion', true);
  assert.equal(row(result, 'a').reason, 'coverage-unknown');
  assert.equal(row(result, 'b').iteration, 1);
  assert.equal(row(result, 'c').iteration, null);
});
test('partial links remain draft and propagate uncertainty through reviewed consumers', () => {
  const result = workOrder([node('a'), node('b', true), node('c', true)], [edge('a', 'b'), edge('b', 'c')], 'completion', true);
  assert.equal(row(result, 'a').iteration, 1);
  assert.equal(row(result, 'c').iteration, 3);
  assert(result.rows.every(n => n.draft));
});
test('design contracts do not serialize completion and completion links do not serialize design', () => {
  const nodes = ['a', 'b', 'c'].map(id => node(id, true));
  const result = workOrders(nodes, [edge('a', 'b', 'contract'), edge('b', 'c')], 'governed');
  assert.equal(row(result.contract.proposed, 'b').iteration, 2);
  assert.equal(row(result.contract.proposed, 'c').iteration, 1);
  assert.equal(row(result.completion.proposed, 'b').iteration, 1);
  assert.equal(row(result.completion.proposed, 'c').iteration, 2);
});
test('candidate exclusion does not promote consumers or descendants into a first iteration', () => {
  const nodes = ['a', 'b', 'c'].map(id => node(id, true));
  const edges = [edge('a', 'b', 'completion', 'candidate'), edge('b', 'c')];
  const included = workOrder(nodes, edges, 'completion', true);
  assert.equal(row(included, 'c').iteration, 3); assert.equal(row(included, 'c').draft, true);
  const hidden = workOrder(nodes, edges, 'completion', false);
  assert.equal(row(hidden, 'b').reason, 'hidden-candidates');
  assert.deepEqual(row(hidden, 'b').hiddenPrerequisites, ['a']);
  assert.equal(row(hidden, 'c').reason, 'unresolved-prerequisite');
  assert.equal(row(hidden, 'c').iteration, null);
});
test('cycles and downstream nodes remain unordered without hiding independent branches', () => {
  for (const relation of ['contract', 'completion']) {
    const result = workOrder(['a', 'b', 'c', 'd', 'e'].map(id => node(id, true)),
      [edge('a', 'b', relation), edge('b', 'a', relation), edge('b', 'c', relation), edge('d', 'e', relation)], relation, true);
    assert.equal(row(result, 'a').reason, 'cycle');
    assert.equal(row(result, 'b').reason, 'cycle');
    assert.equal(row(result, 'c').reason, 'unresolved-prerequisite');
    assert.equal(row(result, 'd').iteration, 1);
    assert.equal(row(result, 'e').iteration, 2);
  }
});
test('duplicate pair conditions cannot create extran iterations or repeat prerequisites', () => {
  const result = workOrder([node('a', true), node('b', true)], [edge('a', 'b'), edge('a', 'b')], 'completion', true);
  assert.deepEqual(row(result, 'b').prerequisites, ['a']);
  assert.equal(row(result, 'b').iteration, 2);
});
test('historical and illustrative projections stay draft without mutating evidence', () => {
  const nodes = [node('a', true), node('b', true)], edges = [edge('a', 'b')];
  const before = JSON.stringify({ nodes, edges });
  for (const mode of ['historical-reconstruction', 'illustrative']) {
    assert(workOrder(nodes, edges, 'completion', true, mode).rows.every(n => n.draft));
  }
  assert.equal(JSON.stringify({ nodes, edges }), before);
});
test('empty graphs and candidate-only cycles are safe and deterministic', () => {
  assert.equal(workOrder([], [], 'completion', true).iterationCount, 0);
  const nodes = [node('a'), node('b')], edges = [edge('a', 'b', 'contract', 'candidate'), edge('b', 'a', 'contract', 'candidate')];
  assert(workOrder(nodes, edges, 'contract', true).rows.every(n => n.reason === 'cycle'));
  assert.deepEqual(workOrders(nodes, edges), workOrders([...nodes].reverse(), [...edges].reverse()));
});
test('committed projection includes every node exactly once on each axis and filter', () => {
  const data = require('../feature-canvas/data.json');
  assert.deepEqual(data.workOrder, workOrders(data.nodes, data.edges, data.mode));
  for (const axis of Object.values(data.workOrder)) for (const result of Object.values(axis)) {
    assert.equal(result.rows.length, data.nodes.length);
    assert.equal(new Set(result.rows.map(n => n.id)).size, data.nodes.length);
    for (const e of data.edges.filter(e => e.relation === result.relation && (result.candidates || e.metadata.assessment === 'confirmed'))) {
      const provider = row(result, e.source), consumer = row(result, e.target);
      if (consumer.iteration) assert(provider.iteration && provider.iteration < consumer.iteration);
    }
  }
});

test('agent JSON uses English iteration fields without legacy wave aliases', () => {
  const data = require('../feature-canvas/data.json');
  assert.equal(data.schemaVersion, 2);
  assert.equal(data.language, 'en');
  assert.match(data.workOrderMeaning.iteration, /not a scheduled sprint/);
  assert.match(data.workOrderMeaning.limitations, /not readiness/);
  assert.doesNotMatch(JSON.stringify(data), /[\u0400-\u04ff]/u);
  for (const axis of Object.values(data.workOrder)) for (const result of Object.values(axis)) {
    assert.equal(result.iterationCount, Math.max(0, ...result.rows.map(row => row.iteration || 0)));
    assert.equal(Object.hasOwn(result, 'waveCount'), false);
    for (const row of result.rows) {
      assert(Object.hasOwn(row, 'iteration'));
      assert.equal(Object.hasOwn(row, 'wave'), false);
      assert(row.iteration === null || Number.isInteger(row.iteration) && row.iteration > 0);
    }
  }
});

test('dependency viewer stays English even for legacy localized links', () => {
  const app = fs.readFileSync(path.join(__dirname, '../feature-canvas/app.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, '../feature-canvas/index.html'), 'utf8');
  assert.doesNotMatch(app + html, /[\u0400-\u04ff]/u);
  assert.doesNotMatch(html, /id="language"/);
  assert.match(app, /pageUrl\.searchParams\.set\('lang',\s*'en'\)/);
  assert.match(html, /id="order-source-link" href="\.\/data\.json"/);
});

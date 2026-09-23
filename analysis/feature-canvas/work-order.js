'use strict';
const { Graph, alg } = require('../tools/node_modules/@dagrejs/graphlib');

function workOrder(nodes, edges, relation, candidates, mode = 'governed') {
  const graph = new Graph({ directed: true }), byId = new Map(nodes.map(n => [n.id, n]));
  const selected = edges.filter(e => e.relation === relation &&
    (candidates || e.metadata.assessment === 'confirmed'));
  for (const node of nodes) graph.setNode(node.id);
  for (const edge of selected) {
    if (!byId.has(edge.source) || !byId.has(edge.target)) throw Error('Unknown dependency endpoint');
    graph.setEdge(edge.source, edge.target);
  }
  const reasons = new Map();
  for (const cycle of alg.findCycles(graph)) for (const id of cycle) reasons.set(id, 'cycle');
  if (!candidates) for (const edge of edges) {
    if (edge.relation === relation && edge.metadata.assessment === 'candidate' && !reasons.has(edge.target)) {
      reasons.set(edge.target, 'hidden-candidates');
    }
  }
  for (const node of nodes) {
    if (!graph.nodeEdges(node.id).length && (!node.metadata.review || node.metadata.unresolved.length) &&
        !reasons.has(node.id)) reasons.set(node.id, 'coverage-unknown');
  }
  // Unknown prerequisites remain blockers when filters hide them or a cycle has no order.
  const pending = [...reasons.keys()];
  for (let i = 0; i < pending.length; i++) for (const id of graph.successors(pending[i])) {
    if (!reasons.has(id)) { reasons.set(id, 'unresolved-prerequisite'); pending.push(id); }
  }
  const ordered = graph.filterNodes(id => !reasons.has(id)), levels = new Map(), drafts = new Map();
  for (const id of alg.topsort(ordered)) {
    const providers = ordered.predecessors(id), node = byId.get(id);
    levels.set(id, Math.max(0, ...providers.map(p => levels.get(p) + 1)));
    drafts.set(id, mode !== 'governed' || !node.metadata.review || node.metadata.unresolved.length > 0 ||
      selected.some(e => e.target === id && e.metadata.assessment === 'candidate') ||
      providers.some(p => drafts.get(p)));
  }
  const rows = nodes.map(node => ({
    id: node.id, iteration: levels.has(node.id) ? levels.get(node.id) + 1 : null,
    reason: reasons.get(node.id) || null, draft: drafts.get(node.id) ?? true,
    prerequisites: [...new Set(selected.filter(e => e.target === node.id).map(e => e.source))].sort(),
    dependents: [...new Set(selected.filter(e => e.source === node.id).map(e => e.target))].sort(),
    hiddenPrerequisites: candidates ? [] : [...new Set(edges.filter(e => e.relation === relation &&
      e.target === node.id && e.metadata.assessment === 'candidate').map(e => e.source))].sort(),
  })).sort((a, b) => a.id.localeCompare(b.id, 'en'));
  return { relation, candidates, rows, iterationCount: Math.max(0, ...rows.map(r => r.iteration || 0)) };
}

function workOrders(nodes, edges, mode) {
  return Object.fromEntries(['contract', 'completion'].map(relation => [relation, {
    proposed: workOrder(nodes, edges, relation, true, mode),
    explicit: workOrder(nodes, edges, relation, false, mode),
  }]));
}
module.exports = { workOrder, workOrders };

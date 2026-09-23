'use strict';
const ELK = require('../tools/node_modules/elkjs');

const NODE_WIDTH = 220, NODE_HEIGHT = 82;
const round = value => Math.round(value * 1e6) / 1e6;

async function overviewLayout(nodes, edges) {
  const linked = new Set(edges.flatMap(edge => [edge.source, edge.target]));
  const connected = nodes.filter(node => linked.has(node.id));
  const graph = connected.length ? await new ELK().layout({
    id: 'overview',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.randomSeed': '1',
      'elk.spacing.nodeNode': '36',
      'elk.spacing.componentComponent': '80',
      'elk.spacing.edgeNode': '16',
      'elk.layered.spacing.nodeNodeBetweenLayers': '110',
      'elk.layered.spacing.edgeNodeBetweenLayers': '18',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '6',
      'elk.layered.mergeEdges': 'false',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    },
    children: connected.map(node => ({
      id: node.id, width: NODE_WIDTH, height: NODE_HEIGHT,
      layoutOptions: { 'elk.portConstraints': 'FIXED_SIDE' },
      ports: edges.filter(edge => edge.source === node.id || edge.target === node.id).map(edge => {
        const outgoing = edge.source === node.id;
        return {
          id: edge.metadata.id + (outgoing ? '-out' : '-in'), width: 0, height: 0,
          layoutOptions: { 'elk.port.side': outgoing ? 'EAST' : 'WEST' },
        };
      }),
    })),
    edges: edges.map(edge => ({
      id: edge.metadata.id, sources: [edge.metadata.id + '-out'], targets: [edge.metadata.id + '-in'],
    })),
  }) : { children: [], edges: [], width: 0, height: 0 };

  const positions = graph.children.map(node => ({
    id: node.id, x: round(node.x), y: round(node.y), width: NODE_WIDTH, height: NODE_HEIGHT,
  }));
  // Unlinked slices remain visible but cannot distort the routed connected component.
  const unlinked = nodes.filter(node => !linked.has(node.id)).sort((a, b) =>
    (a.metadata.group + a.id).localeCompare(b.metadata.group + b.id, 'en'));
  const columns = Math.max(1, Math.ceil(Math.sqrt(unlinked.length * NODE_HEIGHT / NODE_WIDTH)));
  const offsetX = graph.width ? graph.width + 140 : 0;
  unlinked.forEach((node, i) => positions.push({
    id: node.id, x: round(offsetX + (i % columns) * (NODE_WIDTH + 40)),
    y: Math.floor(i / columns) * (NODE_HEIGHT + 32), width: NODE_WIDTH, height: NODE_HEIGHT,
  }));

  // Visual depth bands are layout coordinates, never dependency readiness or release order.
  const bands = [];
  for (const node of [...positions].sort((a, b) => a.x - b.x)) {
    const last = bands.at(-1);
    if (last && node.x <= last.right) last.right = Math.max(last.right, node.x + node.width);
    else bands.push({ left: node.x, right: node.x + node.width });
  }
  const layout = {
    engine: 'elkjs@0.12.0', bands,
    nodes: positions,
    edges: graph.edges.map(edge => {
      if (edge.sections?.length !== 1) throw Error('Expected one routed section: ' + edge.id);
      const section = edge.sections[0];
      return {
        id: edge.id,
        points: [section.startPoint, ...(section.bendPoints || []), section.endPoint]
          .map(point => ({ x: round(point.x), y: round(point.y) })),
      };
    }),
  };
  validateLayout(layout, nodes, edges);
  return layout;
}

function validateLayout(layout, nodes, edges) {
  if (layout.nodes.length !== nodes.length || layout.edges.length !== edges.length)
    throw Error('Overview layout lost nodes or edges');
  const boxes = new Map(layout.nodes.map(node => [node.id, node]));
  if (boxes.size !== nodes.length || nodes.some(node => !boxes.has(node.id)))
    throw Error('Overview layout node IDs differ');
  const routes = new Map(layout.edges.map(edge => [edge.id, edge]));
  if (routes.size !== edges.length || edges.some(edge => !routes.has(edge.metadata.id)))
    throw Error('Overview layout edge IDs differ');
  for (const node of layout.nodes) {
    if (![node.x, node.y, node.width, node.height].every(Number.isFinite))
      throw Error('Non-finite node position: ' + node.id);
    for (const other of layout.nodes) {
      if (other.id > node.id && node.x < other.x + other.width && node.x + node.width > other.x &&
          node.y < other.y + other.height && node.y + node.height > other.y)
        throw Error('Overlapping nodes: ' + node.id + ', ' + other.id);
    }
  }
  const epsilon = 1e-4;
  for (const edge of edges) {
    const points = routes.get(edge.metadata.id).points;
    if (points.length < 2 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y)))
      throw Error('Invalid route: ' + edge.metadata.id);
    const source = boxes.get(edge.source), target = boxes.get(edge.target);
    for (const [point, node, side] of [[points[0], source, source.x + source.width], [points.at(-1), target, target.x]]) {
      if (Math.abs(point.x - side) > epsilon || point.y < node.y - epsilon || point.y > node.y + node.height + epsilon)
        throw Error('Route misses its port: ' + edge.metadata.id);
    }
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      if (Math.abs(a.x - b.x) > epsilon && Math.abs(a.y - b.y) > epsilon)
        throw Error('Non-orthogonal route: ' + edge.metadata.id);
      for (const node of layout.nodes) {
        const left = node.x + epsilon, right = node.x + node.width - epsilon;
        const top = node.y + epsilon, bottom = node.y + node.height - epsilon;
        const throughVertical = Math.abs(a.x - b.x) < epsilon && a.x > left && a.x < right &&
          Math.max(a.y, b.y) > top && Math.min(a.y, b.y) < bottom;
        const throughHorizontal = Math.abs(a.y - b.y) < epsilon && a.y > top && a.y < bottom &&
          Math.max(a.x, b.x) > left && Math.min(a.x, b.x) < right;
        if (throughVertical || throughHorizontal) throw Error('Route crosses node: ' + edge.metadata.id + ', ' + node.id);
      }
    }
  }
}
module.exports = { overviewLayout, validateLayout };

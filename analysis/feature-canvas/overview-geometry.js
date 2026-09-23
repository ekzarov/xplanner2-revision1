export const DEPTH_STEP = 440;

export function depthAt(x, bands, step = DEPTH_STEP) {
  if (!bands.length || x <= bands[0].right) return 0;
  for (let i = 1; i < bands.length; i++) {
    const previous = bands[i - 1], current = bands[i];
    if (x < current.left) return -step * (i - 1 + (x - previous.right) / (current.left - previous.right));
    if (x <= current.right) return -step * i;
  }
  return -step * (bands.length - 1);
}

export function overviewPosition(node, bands, flat, step = DEPTH_STEP) {
  return { x: node.x + node.width / 2, y: -node.y - node.height / 2, z: flat ? 0 : depthAt(node.x, bands, step) };
}

export function overviewRoute(route, bands, flat, step = DEPTH_STEP) {
  const points = [];
  const boundaries = bands.flatMap(band => [band.left, band.right]);
  for (let i = 0; i < route.points.length; i++) {
    const a = route.points[i], b = route.points[i + 1];
    points.push({ x: a.x, y: -a.y, z: flat ? 0 : depthAt(a.x, bands, step) });
    if (!b || flat || Math.abs(a.y - b.y) > 1e-4) continue;
    // Change depth in free corridors, never slope an edge through a node's plane.
    const between = boundaries.filter(x => x > Math.min(a.x, b.x) && x < Math.max(a.x, b.x));
    between.sort((x, y) => a.x < b.x ? x - y : y - x);
    for (const x of between) points.push({ x, y: -a.y, z: depthAt(x, bands, step) });
  }
  return points;
}

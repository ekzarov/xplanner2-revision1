const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();

export function createSearchIndex(data) {
  const rows = new Map((data.parityRows || []).map(row => [row.row, row]));
  return data.nodes.map(node => {
    const sections = [
      { kind: 'title', text: node.id + ' ' + node.label },
      { kind: 'description', text: node.metadata.description || '' },
      { kind: 'group', text: node.metadata.group },
      ...node.metadata.rows.map(number => ({ kind: 'row', row: number, text: rows.has(number) ? rows.get(number).epic + ' ' + rows.get(number).text : '' })),
      ...node.metadata.unresolved.map(text => ({ kind: 'question', text })),
      ...data.edges.filter(edge => edge.source === node.id || edge.target === node.id).map(edge => ({ kind: 'dependency', text: edge.metadata.condition })),
      ...node.metadata.basis.map(ref => data.sources[ref]?.quote).filter(Boolean).map(text => ({ kind: 'basis', text })),
    ].map(section => ({ ...section, normalized: normalize(section.text) }));
    return { node, sections, text: sections.map(section => section.normalized).join(' ') };
  });
}

export function searchFeatures(index, query) {
  const value = normalize(query);
  if (!value) return index.map(({ node }) => ({ node, match: null, score: 0 }));
  const rowQuery = value.match(/^(?:#|row\s*:?\s*|строка\s*:?\s*)(\d+)$/u);
  const numeric = /^\d+$/.test(value) ? Number(value) : null;
  const tokens = value.split(' ');
  const weights = { title: 50, description: 35, group: 20, row: 30, dependency: 12, question: 5, basis: 8 };
  const results = [];
  for (const entry of index) {
    const rowNumber = rowQuery ? Number(rowQuery[1]) : numeric;
    const row = entry.sections.find(section => section.kind === 'row' && section.row === rowNumber);
    const exactId = !rowQuery && numeric !== null && Number(entry.node.id.split('-')[0]) === numeric;
    if (rowQuery || numeric !== null) {
      if (!row && !exactId) continue;
      results.push({ node: entry.node, match: exactId ? entry.sections[0] : row, score: exactId ? 200 : 180 });
      continue;
    }
    if (!tokens.every(token => entry.text.includes(token))) continue;
    const ranked = entry.sections.map(section => ({
      section,
      score: tokens.filter(token => section.normalized.includes(token)).length * 10 +
        (section.normalized.includes(value) ? 40 : 0) + weights[section.kind],
    })).filter(item => tokens.some(token => item.section.normalized.includes(token))).sort((a, b) => b.score - a.score);
    results.push({ node: entry.node, match: ranked[0].section, score: ranked[0].score });
  }
  return results.sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id, 'en'));
}

export function searchExcerpt(text, query, limit = 160) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  const tokens = normalize(query).split(' ').filter(Boolean);
  const hits = tokens.map(token => normalize(clean).indexOf(token)).filter(index => index >= 0);
  const start = hits.length ? Math.max(0, Math.min(...hits) - 35) : 0;
  return (start ? '...' : '') + clean.slice(start, start + limit) + (start + limit < clean.length ? '...' : '');
}

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { parseArgs } = require('node:util');
const { Graph, alg } = require('@dagrejs/graphlib');
const ExcelJS = require('@excel.js/exceljs').default;
const { AuditResult, validateSchema, sha256File, parseYamlFile, resolveInside, cellText, printResult, rejectGovernedOverrides } = require('./lib');
const { parseParityContracts, section } = require('./parity-map-contract');
const { tables } = require('./process-contract');

const GRAPH_FILE = 'analysis/feature-dependencies.json';
const POLICY = /^Feature dependency checks required from feature sequence:\s*(\d{3})\.?\s*$/m;
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
const digest = value => crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
function safeFile(root, relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.split('/').some(p => p === '..' || p === '.' || !p)) throw new Error('Invalid dependency source path: ' + relative);
  const file = resolveInside(root, relative, 'Dependency source');
  let current = file;
  while (current !== path.resolve(root)) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Dependency source uses a symlink: ' + relative);
    current = path.dirname(current);
  }
  if (!fs.statSync(file).isFile()) throw new Error('Dependency source is not a file: ' + relative);
  return file;
}
function graphFor(doc, relation, candidates = false) {
  const g = new Graph({ directed: true });
  for (const id of Object.keys(doc.graph.nodes)) g.setNode(id);
  for (const edge of doc.graph.edges) {
    if (edge.relation === relation && (candidates || edge.metadata.assessment === 'confirmed')) g.setEdge(edge.source, edge.target);
  }
  return g;
}
function completionProviders(doc, id) {
  return [...new Set(doc.graph.edges.filter(e => e.target === id && e.relation === 'completion' && e.metadata.assessment === 'confirmed').map(e => e.source))].sort();
}
function completionClosure(doc, id) {
  if (!Object.hasOwn(doc.graph.nodes, id)) throw new Error('Unknown dependency node: ' + id);
  return alg.preorder(reverse(graphFor(doc, 'completion')), id).sort();
}
function reverse(g) {
  const reversed = new Graph({ directed: true });
  g.nodes().forEach(id => reversed.setNode(id));
  g.edges().forEach(e => reversed.setEdge(e.w, e.v));
  return reversed;
}
function nodeDigest(doc, id, context = {}) {
  const incoming = doc.graph.edges.filter(e => e.target === id).sort((a,b) => a.metadata.id.localeCompare(b.metadata.id));
  const relevant = [...new Set([id, ...incoming.map(e => e.source)])].sort();
  const basis = new Set(incoming.flatMap(e => e.metadata.basis));
  const nodes = Object.fromEntries(relevant.map(key => {
    const { review, ...metadata } = doc.graph.nodes[key].metadata;
    metadata.basis.forEach(ref => basis.add(ref));
    return [key, {
      label: doc.graph.nodes[key].label, metadata,
      row_facts: metadata.rows.map(row => context.rowFacts?.get(row) || null),
      parity_contract: context.contracts?.get(key) || null,
    }];
  }));
  // Workbook progress and unrelated traceability edits do not invalidate every slice.
  const sources = Object.fromEntries([...basis].sort().map(ref => {
    const pin = doc.graph.metadata.sources[ref];
    return [ref, ['workbook', 'traceability'].includes(ref) ? { path: pin?.path } : pin];
  }));
  return digest({ nodes, incoming, sources });
}
function reviewedErrors(audit, id, includeCompletion = true) {
  const errors = [];
  if (!audit.ok || !audit.document) return ['The dependency graph must pass its structural audit first'];
  const doc = audit.document;
  if (doc.graph.metadata.mode !== 'governed') errors.push('Historical reconstruction cannot establish reviewed dependency readiness');
  let selected;
  try { selected = includeCompletion ? completionClosure(doc, id) : [id]; }
  catch (error) { return [error.message]; }
  for (const key of selected) {
    const node = doc.graph.nodes[key];
    if (!node) { errors.push('Unknown dependency node: ' + key); continue; }
    if (!node.metadata.review) errors.push(key + ' dependency scope is unassessed');
    if (node.metadata.unresolved.length) errors.push(key + ' has unresolved dependency questions');
    if (doc.graph.edges.some(e => e.target === key && e.metadata.assessment === 'candidate')) errors.push(key + ' has candidate dependencies');
  }
  return errors;
}
async function auditDependencies(options = {}) {
  const root = path.resolve(options.root || path.join(__dirname, '../..'));
  const result = new AuditResult('FEATURE DEPENDENCY AUDIT');
  const file = path.join(root, GRAPH_FILE);
  if (!fs.existsSync(file)) {
    let stage = 0;
    const status = path.join(root, 'analysis/migration_status.yaml');
    try {
      if (fs.existsSync(status)) {
        const current = parseYamlFile(status).control?.current_stage;
        stage = current === 'complete' ? 19 : Number(/^stage-(\d+)$/.exec(current || '')?.[1] || 0);
      }
    } catch (error) { result.fail(error.message); }
    if (options.required || stage >= 9) result.fail(GRAPH_FILE + ' is required for the governed dependency scope');
    else result.warn('Dependency graph not created yet; it is required at Stage 9, not evidence of no dependencies');
    return result;
  }
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../feature-dependencies.schema.json'), 'utf8'));
    result.merge(validateSchema(schema, doc), 'Dependency graph ');
  } catch (error) { result.fail(error.message); return result; }
  if (!result.ok) return result;
  result.document = doc;
  const { nodes, edges, metadata } = doc.graph;
  const sourceFiles = new Map(), rowFacts = new Map();
  let contracts = new Map();
  for (const [ref, source] of Object.entries(metadata.sources)) {
    try {
      const sourceFile = safeFile(root, source.path);
      sourceFiles.set(ref, sourceFile);
      if (sha256File(sourceFile) !== source.sha256) result.fail('Dependency source hash changed: ' + ref + ' (' + source.path + ')');
      if (source.quote && !fs.readFileSync(sourceFile, 'utf8').replace(/\r\n/g, '\n').includes(source.quote)) result.fail('Dependency basis quote not found: ' + ref);
    } catch (error) { result.fail(error.message); }
  }
  if (metadata.sources.workbook) {
    if (metadata.sources.workbook.path !== 'analysis/legacy_user_flows.xlsx') result.fail('workbook source must be the canonical parity map');
    if (sourceFiles.has('workbook')) try {
      const book = new ExcelJS.Workbook();
      await book.xlsx.readFile(sourceFiles.get('workbook'));
      const sheet = book.getWorksheet('User Flows');
      if (!sheet) throw new Error('Dependency workbook needs User Flows');
      let epic = '';
      sheet.eachRow((row, number) => {
        if (cellText(row.getCell(1))) epic = cellText(row.getCell(1));
        if (number >= 7 && !cellText(row.getCell(1)) && cellText(row.getCell(4))) rowFacts.set(number, { row: number, epic, facts: [2,3,4,5,6,7,8].map(column => cellText(row.getCell(column))) });
      });
    } catch (error) { result.fail(error.message); }
  }
  if (metadata.sources.traceability) {
    if (metadata.sources.traceability.path !== 'specs/traceability.md') result.fail('traceability source must be specs/traceability.md');
    if (sourceFiles.has('traceability')) {
      const parsed = parseParityContracts(fs.readFileSync(sourceFiles.get('traceability'), 'utf8'));
      contracts = parsed.contracts;
      parsed.errors.forEach(error => result.fail(error));
    }
  }
  const checkBasis = (refs, label) => {
    for (const ref of refs) if (!Object.hasOwn(metadata.sources, ref)) result.fail(label + ' refers to unknown basis ' + ref);
  };
  for (const [id, node] of Object.entries(nodes)) {
    const m = node.metadata;
    if (!m.description) result.warn(id + ' has no feature description; add a source-backed summary when reopening the node');
    checkBasis(m.basis, id);
    if (JSON.stringify(m.rows) !== JSON.stringify([...m.rows].sort((a,b) => a-b))) result.fail(id + ' rows must be sorted');
    if (m.scope === 'legacy-backed') {
      if (!m.rows.length || !sourceFiles.has('workbook')) result.fail(id + ' legacy-backed scope needs pinned workbook rows');
      for (const row of m.rows) if (!rowFacts.has(row)) result.fail(id + ' references a non-scenario workbook row ' + row);
    } else if (m.rows.length) result.fail(id + ' target-only scope cannot claim legacy rows');
    if (m.sdd) {
      if (m.sdd !== 'specs/' + id + '/spec.md') result.fail(id + ' SDD path must match its node ID');
      try { safeFile(root, m.sdd); } catch (error) { result.fail(error.message); }
      const contract = contracts.get(id);
      const rows = contract && [...new Set([...contract.deliverRows, ...contract.deferredRows])].sort((a,b) => a-b);
      if (!contract || contract.scope !== m.scope || JSON.stringify(rows) !== JSON.stringify(m.rows)) result.fail(id + ' scope disagrees with the pinned parity delivery contract');
    }
    if (metadata.mode === 'historical-reconstruction' && m.review) result.fail(id + ' historical reconstruction cannot claim a new review');
    if (metadata.mode === 'governed' && m.sdd && fs.existsSync(path.join(root, m.sdd)) && /Completion dependencies:\s*graph/.test(fs.readFileSync(path.join(root, m.sdd), 'utf8'))) {
      const relevantBasis = [...m.basis, ...edges.filter(e => e.target === id).flatMap(e => e.metadata.basis)];
      if (relevantBasis.some(ref => metadata.sources[ref]?.path === m.sdd)) result.fail(id + ' SDD cannot be its own dependency-hash basis');
    }
    if (m.review) {
      checkBasis([m.review.source], id + ' review');
      const reviewFile = sourceFiles.get(m.review.source);
      const reviewPath = metadata.sources[m.review.source]?.path || '';
      if (!/^analysis\/reviews\/stage-(10|16)-pass-\d{3,}\.md$/.test(reviewPath)) result.fail(id + ' dependency review must cite a numbered Stage 10/16 report');
      if (reviewFile) {
        try {
          const body = section(fs.readFileSync(reviewFile, 'utf8'), 'Dependency Review');
          const rows = tables('## Dependency Review\n' + body).get('Dependency Review');
          const header = ['Node', 'Scope SHA-256', 'Compared sources', 'Result', 'Findings or unchecked scope'];
          const matches = rows?.slice(1).filter(row => row[0] === id) || [];
          if (!rows || JSON.stringify(rows[0]) !== JSON.stringify(header) || matches.length !== 1 ||
              matches[0][1] !== m.review.scope_sha256 || matches[0][3] !== 'pass' || !matches[0][2] || !matches[0][4]) {
            result.fail(id + ' review report must contain one passed exact-scope Dependency Review row');
          }
        } catch (error) { result.fail(id + ' dependency review table: ' + error.message); }
      }
      if ([...m.basis, ...edges.filter(e => e.target === id).flatMap(e => e.metadata.basis)].includes(m.review.source)) result.fail(id + ' review must not be its own dependency basis');
      if (m.unresolved.length || edges.some(e => e.target === id && e.metadata.assessment === 'candidate')) result.fail(id + ' reviewed scope still contains questions or candidate edges');
    }
  }
  const edgeIds = new Set(), tuples = new Set();
  for (const e of edges) {
    if (!Object.hasOwn(nodes, e.source) || !Object.hasOwn(nodes, e.target)) result.fail(e.metadata.id + ' references unknown nodes');
    if (e.source === e.target) result.fail(e.metadata.id + ' is a self-dependency');
    const tuple = JSON.stringify([e.source, e.target, e.relation, e.metadata.condition.trim().toLowerCase()]);
    if (edgeIds.has(e.metadata.id) || tuples.has(tuple)) result.fail('Duplicate dependency edge: ' + e.metadata.id);
    edgeIds.add(e.metadata.id); tuples.add(tuple);
    checkBasis(e.metadata.basis, e.metadata.id);
  }
  if (!result.ok) return result;
  for (const cycle of alg.findCycles(graphFor(doc, 'completion'))) result.fail('Confirmed completion cycle: ' + cycle.join(' -> '));
  for (const cycle of alg.findCycles(graphFor(doc, 'contract'))) result.warn('Joint contract design needs review: ' + cycle.join(' <-> '));
  result.context = { rowFacts, contracts };
  result.scopes = {};
  for (const id of Object.keys(nodes)) {
    const current = nodeDigest(doc, id, result.context);
    result.scopes[id] = current;
    if (nodes[id].metadata.review && nodes[id].metadata.review.scope_sha256 !== current) result.fail(id + ' dependency review is stale for the current node scope');
  }
  if (metadata.mode === 'historical-reconstruction') result.warn('Historical reconstruction only: source-backed/candidate relations, not current independent approval or release readiness');
  if (options.requireReviewed) {
    if (!options.scope) result.fail('Reviewed dependency checks require an explicit slice scope');
    else reviewedErrors(result, options.scope).forEach(error => result.fail(error));
  }
  result.summary = Object.keys(nodes).length + ' slices; ' + edges.length + ' relations; ' + edges.filter(e => e.metadata.assessment === 'candidate').length + ' candidates; ' + Object.values(nodes).filter(n => !n.metadata.review).length + ' unassessed nodes';
  return result;
}
function dependencyPolicy(specRoot) {
  const file = path.join(specRoot, 'README.md');
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const match = text.match(POLICY);
  if (!match) throw new Error('specs/README.md must declare Feature dependency checks required from feature sequence');
  return Number(match[1]);
}
function bindingErrors(audit, feature, spec, requireReviewed = false) {
  const errors = [];
  if (!audit?.ok || !audit.document) return ['The dependency graph must pass its structural audit for ' + feature];
  const block = section(spec, 'Change Impact and Verification Scope');
  const mode = [...block.matchAll(/^- Completion dependencies:\s*([^\r\n]+)$/gm)];
  const pins = [...block.matchAll(/^- Dependency scope SHA-256:\s*([a-f0-9]{64})\s*$/gm)];
  if (mode.length !== 1 || mode[0][1].trim() !== 'graph') errors.push(feature + ' must use Completion dependencies: graph, not a parallel dependency list');
  if (!Object.hasOwn(audit.document.graph.nodes, feature)) errors.push('Dependency graph omits ' + feature);
  if (audit.document.graph.nodes[feature]?.metadata.sdd !== 'specs/' + feature + '/spec.md') errors.push(feature + ' must bind its exact SDD path in the graph');
  if (pins.length !== 1 || pins[0][1] !== audit.scopes?.[feature]) errors.push(feature + ' Dependency scope SHA-256 is missing or stale');
  if (audit.document.graph.metadata.mode !== 'governed') errors.push(feature + ' cannot bind new SDD to a historical reconstruction');
  if (requireReviewed) errors.push(...reviewedErrors(audit, feature));
  return errors;
}
function parseCli(args) {
  return parseArgs({ args, options: { scope: { type: 'string' }, required: { type: 'boolean' }, 'require-reviewed': { type: 'boolean' } }, allowPositionals: false }).values;
}
async function run() {
  const args = parseCli(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root'], ['AUDIT_ROOT']);
  const root = path.resolve(__dirname, '../..');
  const result = await auditDependencies({ root, required: Boolean(args.required || args.scope), scope: args.scope, requireReviewed: Boolean(args['require-reviewed']) });
  if (args.scope && result.ok) {
    if (!result.document?.graph.nodes[args.scope]) result.fail('Unknown dependency node: ' + args.scope);
    else console.log(JSON.stringify({
      slice: args.scope, scope_sha256: result.scopes[args.scope],
      completion_dependencies: completionProviders(result.document, args.scope),
      completion_scope: completionClosure(result.document, args.scope),
      incoming: result.document.graph.edges.filter(e => e.target === args.scope),
      unresolved: result.document.graph.nodes[args.scope].metadata.unresolved,
      reviewed_readiness_errors: reviewedErrors(result, args.scope),
    }, null, 2));
  }
  process.exitCode = printResult(result);
}
if (require.main === module) run().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { parseCli, GRAPH_FILE, auditDependencies, bindingErrors, completionClosure, completionProviders, dependencyPolicy, digest, graphFor, nodeDigest, reviewedErrors, safeFile };

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const YAML = require('yaml');
const { resolveInside, sha256File } = require('./lib');
const md = new MarkdownIt();
const patterns = {
  owner: /^analysis\/stages\/stage-11\/architecture-owner-verdict-(\d{3})\.md$/,
  closure: /^analysis\/stages\/stage-12\/architecture-closure-(\d{3})\.md$/,
};
const states = ['verified-closed', 'owner-dispositioned', 'open', 'failed', 'blocked'];

function readRecord(root, relative, kind) {
  const match = typeof relative === 'string' && relative.match(patterns[kind]);
  if (!match) throw Error(`Invalid ${kind} record path: ${relative}`);
  const file = resolveInside(root, relative, `${kind} record`);
  if (!fs.statSync(file).isFile() || fs.realpathSync(file) !== path.resolve(file)) throw Error(`Unsafe record: ${relative}`);
  const body = fs.readFileSync(file, 'utf8');
  const tokens = md.parse(body, {});
  const bindings = tokens.filter(t => t.type === 'fence' && t.info.trim() === 'yaml');
  if (bindings.length !== 1) throw Error(`${relative}: exactly one YAML record binding is required`);
  const binding = YAML.parse(bindings[0].content, { uniqueKeys: true });
  if (!binding || typeof binding !== 'object') throw Error(`${relative}: missing record binding`);
  if (binding.record_id !== `${kind === 'owner' ? 'AOV' : 'AC'}-${match[1]}`) throw Error(`${relative}: record ID does not match filename`);
  const heading = kind === 'owner' ? 'Items For Closure' : 'Item Checks';
  let section = '', row = null;
  const rows = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'heading_open') section = tokens[i + 1].content;
    if (section !== heading) continue;
    if (t.type === 'tr_open') row = [];
    if (t.type === 'td_open') row.push(tokens[i + 1].content);
    if (t.type === 'tr_close' && row?.length) rows.push(row);
  }
  if (!tokens.some((t,i) => t.type === 'heading_open' && tokens[i+1].content === heading)) throw Error(`${relative}: missing ${heading}`);
  const ids = new Set();
  for (const row of rows) {
    if (row.length !== (kind === 'owner' ? 4 : 5) || row.some(cell => !cell.trim())) throw Error(`${relative}: incomplete item row`);
    if (!/^(AOV-\d{3}-R\d{3}|AC-\d{3}-F\d{3})$/.test(row[0]) || ids.has(row[0])) throw Error(`${relative}: invalid or duplicate item ID ${row[0]}`);
    ids.add(row[0]);
  }
  return { binding, rows, ids, file, relative };
}

function statusAt(file) {
  return fs.existsSync(file) ? YAML.parse(fs.readFileSync(file, 'utf8')) : null;
}

function assert(condition, message) { if (!condition) throw Error(message); }
function performed(record) {
  const b = record.binding;
  assert(b.record_status === 'complete', `${record.relative}: draft or historical reconstruction is not gate evidence`);
  for (const field of ['recorded_at', 'stage_entry']) assert(typeof b[field] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(b[field]) && Number.isFinite(Date.parse(b[field])), `${record.relative}: invalid ${field}`);
  assert(Date.parse(b.recorded_at) >= Date.parse(b.stage_entry), `${record.relative}: record predates stage entry`);
  assert(Date.parse(b.recorded_at) <= Date.now(), `${record.relative}: record time is in the future`);
}

function entryBinding(record, status, stage) {
  const entries = (status?.transition_history || []).filter(t => t.to === stage);
  const latest = entries.at(-1);
  assert(latest && record.binding.stage_entry === latest.changed_at, `${record.relative}: must bind the latest actual ${stage} entry`);
}

function historyItems(root, record, seen = new Set()) {
  assert(!seen.has(record.relative), `${record.relative}: predecessor cycle`);
  seen.add(record.relative);
  const b = record.binding;
  const inherited = new Map();
  for (const [field, kind] of [['previous_owner_verdict', 'owner'], ['previous_closure', 'closure']]) {
    if (!(field in b) && record.relative.match(patterns.closure) && field === 'previous_owner_verdict') continue;
    assert(typeof b[field] === 'string', `${record.relative}: ${field} is required`);
    if (b[field] === 'none') continue;
    const previous = readRecord(root, b[field], kind);
    performed(previous);
    assert(Date.parse(previous.binding.recorded_at) < Date.parse(b.recorded_at), `${record.relative}: predecessor must be older`);
    for (const [id, criterion] of historyItems(root, previous, new Set(seen))) inherited.set(id, criterion);
    for (const row of previous.rows) inherited.set(row[0], row[kind === 'owner' ? 2 : 1]);
  }
  for (const [id, criterion] of inherited) {
    const row = record.rows.find(r => r[0] === id);
    assert(row, `${record.relative}: dropped earlier item ${id}`);
    assert(row[record.relative.match(patterns.owner) ? 2 : 1] === criterion, `${record.relative}: changed earlier criterion ${id}`);
  }
  return inherited;
}

function isAdopted(status) {
  const r = status?.architecture_review;
  return Boolean(r?.adopted_at || r?.owner_verdict || r?.closure_report || r?.records?.length ||
    status?.transition_history?.some(t => (t.gate_evidence || []).some(p => patterns.closure.test(p)) || patterns.owner.test(t.owner_approval?.record || '')));
}

function validateRegistry(root, status) {
  const completed = [];
  for (const [kind, stage] of [['owner','11'],['closure','12']]) {
    const directory = path.join(root, 'analysis/stages/stage-' + stage);
    if (!fs.existsSync(directory)) continue;
    for (const name of fs.readdirSync(directory)) {
      const relative = 'analysis/stages/stage-' + stage + '/' + name;
      if (patterns[kind].test(relative) && readRecord(root, relative, kind).binding.record_status === 'complete') completed.push(relative);
    }
  }
  if (!isAdopted(status) && !completed.length) return [];
  const r = status.architecture_review;
  assert(r && typeof r.adopted_at === 'string' && Number.isFinite(Date.parse(r.adopted_at)), 'A persistent architecture_review.adopted_at boundary is required');
  assert(Array.isArray(r.records), 'architecture_review.records must register every completed attempt');
  const records = [], seen = new Set(), latest = {owner: null, closure: null};
  for (const entry of r.records) {
    const kind = patterns.owner.test(entry.path || '') ? 'owner' : 'closure';
    const record = readRecord(root, entry.path, kind);
    assert(!seen.has(entry.path), 'Duplicate registered architecture review record');
    seen.add(entry.path);
    performed(record);
    assert(entry.sha256 === sha256File(record.file), 'Registered architecture record hash changed: ' + entry.path);
    const b = record.binding;
    assert(Date.parse(b.recorded_at) >= Date.parse(r.adopted_at), 'Registered attempt predates adoption');
    assert(!records.length || Date.parse(b.recorded_at) > Date.parse(records.at(-1).binding.recorded_at), 'Attempt registry must be chronological');
    assert(b.previous_closure === (latest.closure?.relative || 'none'), 'Attempt must cite the preceding registered closure');
    if (kind === 'owner') assert(b.previous_owner_verdict === (latest.owner?.relative || 'none'), 'Owner decision must cite the preceding registered owner verdict');
    else assert(b.owner_verdict === latest.owner?.relative, 'Closure must reference the latest registered owner verdict');
    historyItems(root, record);
    records.push(record); latest[kind] = record;
  }
  for (const relative of completed) assert(seen.has(relative), 'Completed attempt is missing from the register: ' + relative);
  if (r.owner_verdict) assert(r.owner_verdict === latest.owner?.relative, 'Status must select the latest registered owner verdict');
  if (r.closure_report) {
    assert(r.closure_report === latest.closure?.relative, 'Status must select the latest registered closure');
    assert(latest.closure.binding.owner_verdict === r.owner_verdict, 'Current closure belongs to an older owner cycle');
  }
  return records;
}

function recordPair(owner, closure) {
  const b = owner.binding, c = closure.binding;
  assert(c.owner_verdict === owner.relative && c.owner_verdict_sha256 === sha256File(owner.file), 'Closure must pin the selected exact owner verdict');
  assert(c.scope === b.scope && c.document_set_version === b.document_set_version && c.manifest_sha256 === b.manifest_sha256, 'Closure scope/version/hash differs from its owner verdict');
  assert(Date.parse(c.stage_entry) >= Date.parse(b.recorded_at), 'Closure entry predates its owner decision');
  for (const row of owner.rows) {
    const checked = closure.rows.find(r => r[0] === row[0]);
    assert(checked && checked[1] === row[2], 'Closure omits or changes owner criterion ' + row[0]);
  }
  for (const row of closure.rows.filter(r => r[4] === 'owner-dispositioned')) {
    const disposition = b.dispositions?.find(d => d.id === row[0]);
    assert(owner.ids.has(row[0]) && disposition && ['withdrawn', 'out-of-scope'].includes(disposition.decision) &&
      typeof disposition.evidence === 'string' && disposition.evidence.trim(), 'Disposition needs explicit human decision evidence for ' + row[0]);
  }
}

function validateReviewRecords({ root, status, manifest, manifestFile, drawioFile, requireClosure = false }) {
  validateRegistry(root, status);
  const selected = status?.architecture_review;
  assert(selected?.owner_verdict, 'architecture_review.owner_verdict must select an exact Stage 11 record');
  const owner = readRecord(root, selected.owner_verdict, 'owner');
  performed(owner);
  entryBinding(owner, status, 'stage-11');
  historyItems(root, owner);
  const priorReturn = (status.transition_history || []).filter(t => t.from === 'stage-12' && Date.parse(t.changed_at) < Date.parse(owner.binding.stage_entry)).at(-1);
  const triggering = priorReturn?.to !== 'stage-13' ? priorReturn?.gate_evidence?.find(p => patterns.closure.test(p)) : null;
  if (triggering) assert(owner.binding.previous_closure === triggering, 'Owner re-entry must cite the exact triggering negative closure');
  const b = owner.binding;
  assert(b.scope === manifest.scope && b.document_set_version === manifest.document_set_version, 'Owner verdict scope/version differs from the current architecture');
  assert(b.manifest_sha256 === sha256File(manifestFile), 'Owner verdict manifest hash is stale');
  assert(b.drawio_sha256 === sha256File(drawioFile), 'Owner verdict Draw.io hash is stale');
  assert(b.decision === 'approved', 'Owner verdict is not approved');
  assert(typeof b.decided_by === 'string' && b.decided_by.trim() && typeof b.decision_evidence === 'string' && b.decision_evidence.trim(), 'Actual human decision attribution and evidence are required');
  assert(/^analysis\/reviews\/stage-10-pass-\d{3}\.md$/.test(b.stage10_report), 'Owner verdict must pin a Stage 10 report');
  const report = resolveInside(root, b.stage10_report, 'Stage 10 report');
  assert(b.stage10_sha256 === sha256File(report), 'Owner verdict Stage 10 report hash is stale');
  const stage10Entry = (status.transition_history || []).filter(t => t.to === 'stage-10' && Date.parse(t.changed_at) <= Date.parse(b.stage_entry)).at(-1);
  const registeredPass = (status.review_passes || []).filter(p => p.stage === 'stage-10' &&
    Date.parse(p.reviewed_at) >= Date.parse(stage10Entry?.changed_at) && Date.parse(p.reviewed_at) <= Date.parse(b.stage_entry))
    .sort((a,b) => Date.parse(a.reviewed_at)-Date.parse(b.reviewed_at) || a.pass-b.pass).at(-1);
  assert(registeredPass && registeredPass.report === b.stage10_report && registeredPass.result === 'clean' &&
    registeredPass.scope === b.scope && registeredPass.artifact_set_version === b.document_set_version &&
    registeredPass.artifact_manifest_sha256 === b.manifest_sha256 && Array.isArray(registeredPass.authored_artifacts) &&
    registeredPass.authored_artifacts.length === 0 && registeredPass.reviewer_id && registeredPass.session_id &&
    registeredPass.independence_record, 'Owner verdict must cite the latest registered eligible clean Stage 10 pass from this review window');
  const reportBody = fs.readFileSync(report, 'utf8');
  assert(/^\s*-\s*Result:\s*`?clean`?\s*$/im.test(reportBody), 'Stage 10 report is not clean');
  const version = reportBody.match(/^\s*-\s*(?:Artifact set version|Document set):\s*`?([^`\r\n]+)`?\s*$/im)?.[1]?.trim();
  assert(version === manifest.document_set_version, 'Stage 10 report covers a different architecture set');
  if (!requireClosure) return { owner };
  assert(selected.closure_report, 'architecture_review.closure_report must select an exact Stage 12 report');
  const closure = readRecord(root, selected.closure_report, 'closure');
  performed(closure);
  entryBinding(closure, status, 'stage-12');
  const earlierItems = historyItems(root, closure);
  const c = closure.binding;
  recordPair(owner, closure);
  assert(c.owner_verdict === selected.owner_verdict && c.owner_verdict_sha256 === sha256File(owner.file), 'Closure must pin the selected exact owner verdict');
  if (b.previous_closure !== 'none') assert(c.previous_closure !== 'none', 'Closure must retain the preceding closure chain');
  assert(Date.parse(c.recorded_at) >= Date.parse(b.recorded_at), 'Closure predates its owner verdict');
  assert(c.scope === b.scope && c.document_set_version === b.document_set_version && c.manifest_sha256 === b.manifest_sha256, 'Closure scope/version/hash differs from the approved architecture');
  assert(c.checked_by && c.unchanged_approved_set === true && c.unchanged_set_evidence, 'Closure requires the responsible agent and actual unchanged-set check evidence');
  for (const row of owner.rows) {
    const checked = closure.rows.find(r => r[0] === row[0]);
    assert(checked && checked[1] === row[2], `Closure omits or changes owner criterion ${row[0]}`);
  }
  for (const row of closure.rows) {
    assert(owner.ids.has(row[0]) || earlierItems.has(row[0]) || row[0].startsWith(`${c.record_id}-F`), `Closure contains an unattributed item ${row[0]}`);
    assert(states.includes(row[4]), `Invalid item state ${row[4]}`);
  }
  for (const state of states) assert(Number.isInteger(c.counts?.[state]) && c.counts[state] === closure.rows.filter(r => r[4] === state).length, `Closure count differs from rows: ${state}`);
  assert(c.result === 'passed' && c.return_stage === 'none', 'Closure is not passed; follow its classified return');
  assert(closure.rows.every(r => ['verified-closed', 'owner-dispositioned'].includes(r[4])), 'Closure has unresolved items');
  return { owner, closure };
}

function validateReviewTransitions(root, status) {
  const registered = validateRegistry(root, status);
  const transitions = [...(status.transition_history || []), ...(status.transition_request ? [status.transition_request] : [])];
  for (const transition of transitions) {
    if (!['stage-11', 'stage-12'].includes(transition.from)) continue;
    const isRequest = transition === status.transition_request;
    const selected = status.architecture_review;
    const governed = isAdopted(status) && (isRequest || Date.parse(transition.changed_at) >= Date.parse(selected.adopted_at));
    const closurePaths = (transition.gate_evidence || []).filter(p => patterns.closure.test(p));
    const ownerPath = transition.owner_approval?.record;
    if (transition.from === 'stage-11' && transition.to === 'stage-12' &&
        (patterns.owner.test(ownerPath || '') || governed)) {
      assert(patterns.owner.test(ownerPath || ''), 'Stage 11 approval must cite its exact numbered owner verdict');
      const owner = readRecord(root, ownerPath, 'owner');
      performed(owner);
      assert(registered.some(r => r.relative === ownerPath), 'Owner transition record must be registered');
      const entry = (status.transition_history || []).filter(t => t.to === 'stage-11' && (!transition.changed_at || Date.parse(t.changed_at) < Date.parse(transition.changed_at))).at(-1);
      assert(owner.binding.stage_entry === entry?.changed_at, 'Owner transition uses an earlier stage entry');
      if (transition.changed_at) assert(Date.parse(owner.binding.recorded_at) <= Date.parse(transition.changed_at), 'Transition predates its owner decision');
      assert(owner.binding.decision === 'approved', 'Stage 11 transition requires actual owner approval');
      if (isRequest) assert(ownerPath === selected.owner_verdict, 'Stage 11 request must use the selected owner verdict');
    }
    if (transition.from !== 'stage-12') continue;
    if (!closurePaths.length && !governed) continue;
    assert(closurePaths.length === 1, 'Stage 12 transition must cite exactly one closure report');
    if (isRequest) assert(closurePaths[0] === selected.closure_report, 'Stage 12 request must cite the selected closure');
    const record = readRecord(root, closurePaths[0], 'closure');
    performed(record);
    assert(registered.some(r => r.relative === record.relative), 'Closure transition record must be registered');
    historyItems(root, record);
    const c = record.binding;
    const entries = (status.transition_history || []).filter(t => t.to === 'stage-12' &&
      (!transition.changed_at || Date.parse(t.changed_at) < Date.parse(transition.changed_at)));
    assert(c.stage_entry === entries.at(-1)?.changed_at, 'Stage 12 transition uses an earlier entry report');
    if (transition.changed_at) assert(Date.parse(c.recorded_at) <= Date.parse(transition.changed_at), 'Transition predates its closure report');
    for (const state of states) assert(c.counts?.[state] === record.rows.filter(r => r[4] === state).length, 'Transition closure counts do not reconcile');
    assert(record.rows.every(r => states.includes(r[4])), 'Transition closure has an invalid item state');
    const owner = readRecord(root, c.owner_verdict, 'owner');
    performed(owner);
    recordPair(owner, record);
    assert(entries.at(-1)?.owner_approval?.record === owner.relative, 'Closure must use the owner approval that opened this Stage 12 entry');
    assert(owner.binding.decision === 'approved' && c.owner_verdict_sha256 === sha256File(owner.file), 'Transition closure must bind an approved immutable owner verdict');
    for (const row of owner.rows) assert(record.rows.some(r => r[0] === row[0] && r[1] === row[2]), 'Transition closure omits an owner criterion');
    if (transition.to === 'stage-13') {
      assert(c.result === 'passed' && c.return_stage === 'none' && c.unchanged_approved_set === true &&
        c.unchanged_set_evidence && record.rows.every(r => ['verified-closed', 'owner-dispositioned'].includes(r[4])), 'Stage 13 requires passed closure without unresolved items');
    } else {
      assert(['findings', 'blocked'].includes(c.result) && c.return_stage === transition.to, 'Negative closure must identify the actual classified return');
    }
  }
}
module.exports = { patterns, readRecord, statusAt, validateReviewRecords, validateReviewTransitions, validateRegistry, isAdopted };

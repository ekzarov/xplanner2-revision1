#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');
const { statusAt, validateReviewRecords, isAdopted, validateRegistry } = require('./architecture-review-records');
const { architectureSourcePath } = require('./architecture-paths');
const {
  loadAndValidateStatus,
  scopeAwareWaiver,
} = require('./status-validator');
const {
  AuditResult,
  PLACEHOLDER,
  SHA256_PATTERN,
  parseArgs,
  printResult,
  readJsonFile,
  rejectGovernedOverrides,
  resolveInside,
  sha256File,
  validateSchema,
  walkFiles,
} = require('./lib');

const nonEmpty = { type: 'string', minLength: 1, pattern: '\\S' };
const hash = { type: 'string', pattern: SHA256_PATTERN };
const KNOWLEDGE_WAIVER_GATE = 'pre_sdd_knowledge';
const KNOWLEDGE_MANIFEST_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['schema_version', 'okf_version', 'project', 'scope', 'knowledge_set_version',
    'architecture_document_set_version', 'generated_at', 'source_artifacts', 'files'],
  properties: {
    schema_version: { const: 1 },
    okf_version: { const: '0.2' },
    project: nonEmpty,
    scope: nonEmpty,
    knowledge_set_version: nonEmpty,
    architecture_document_set_version: nonEmpty,
    generated_at: { type: 'string', format: 'date-time' },
    source_artifacts: {
      type: 'array', minItems: 3,
      items: {
        type: 'object', required: ['path', 'role', 'sha256'],
        properties: { path: nonEmpty, role: nonEmpty, sha256: hash },
        additionalProperties: false,
      },
    },
    files: {
      type: 'array', minItems: 2,
      items: {
        type: 'object', required: ['path', 'role', 'sha256'],
        properties: {
          path: nonEmpty,
          role: { enum: ['bundle-index', 'directory-index', 'log', 'concept'] },
          concept_id: nonEmpty,
          sha256: hash,
        },
        additionalProperties: false,
        allOf: [{
          if: { properties: { role: { const: 'concept' } }, required: ['role'] },
          then: { required: ['concept_id'] },
          else: { not: { required: ['concept_id'] } },
        }],
      },
    },
  },
  additionalProperties: false,
};

function canonical(value) {
  return architectureSourcePath(value);
}

function parseFrontmatter(body, label, result) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    result.fail(`${label} has no YAML frontmatter`);
    return null;
  }
  try {
    const value = YAML.parse(match[1]);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      result.fail(`${label} frontmatter must be a mapping`);
      return null;
    }
    return { value, body: body.slice(match[0].length) };
  } catch (error) {
    result.fail(`${label} frontmatter is invalid YAML: ${error.message}`);
    return null;
  }
}

function resolveSource(projectRoot, resource, sourcePins, label, result) {
  if (/^https?:\/\//i.test(resource)) {
    result.fail(`${label} must resolve to a hash-pinned repository source, not an unpinned URL`);
    return;
  }
  const filePart = resource.split('#', 1)[0];
  const relative = canonical(filePart);
  if (!sourcePins.has(relative)) {
    result.fail(`${label} references ${relative}, which is not pinned in source_artifacts`);
    return;
  }
  try {
    const absolute = resolveInside(projectRoot, relative, label);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || fs.lstatSync(absolute).isSymbolicLink()) {
      result.fail(`${label} references missing or unsafe source ${filePart}`);
    }
  } catch (error) {
    result.fail(error.message);
  }
}

function tryBoundedKnowledgeWaiver(options, result) {
  let status;
  try {
    status = options.status || loadAndValidateStatus(options.statusFile);
  } catch (error) {
    result.fail(`knowledge manifest is missing and waiver status is invalid: ${error.message}`);
    return false;
  }
  const scope = options.scope || status?.delivery?.active_slice;
  if (!scope) {
    result.fail('knowledge manifest is missing and delivery.active_slice does not identify an exact bounded scope');
    return false;
  }
  const decision = scopeAwareWaiver(status, KNOWLEDGE_WAIVER_GATE, scope);
  if (!decision.allowed) {
    result.fail(`knowledge manifest is missing and no valid exact-scope pre-SDD waiver applies: ${decision.reason}`);
    return false;
  }
  result.skipped = true;
  result.summary = `Exact owner waiver ${decision.waiver.id} permits bounded SDD work for "${scope}"; the global knowledge chain remains incomplete`;
  return true;
}

function auditKnowledge(input = {}) {
  const knowledgeDir = path.resolve(input.knowledgeDir || process.env.KNOWLEDGE_DIR || path.join(__dirname, '..', 'knowledge'));
  const projectRoot = path.resolve(input.projectRoot || process.env.PROJECT_ROOT || path.join(knowledgeDir, '..', '..'));
  const statusFile = path.resolve(input.statusFile || process.env.MIGRATION_STATUS_FILE || path.join(projectRoot, 'analysis', 'migration_status.yaml'));
  const bundleDir = path.join(knowledgeDir, 'bundle');
  const manifestFile = path.join(knowledgeDir, 'knowledge-manifest.json');
  const result = new AuditResult('KNOWLEDGE AUDIT');

  if (!fs.existsSync(manifestFile)) {
    tryBoundedKnowledgeWaiver({ statusFile, status: input.status, scope: input.scope }, result);
    return result;
  }
  let manifest;
  try {
    manifest = readJsonFile(manifestFile);
  } catch (error) {
    result.fail(error.message);
    return result;
  }
  result.merge(validateSchema(KNOWLEDGE_MANIFEST_SCHEMA, manifest), 'knowledge-manifest.json ');
  if (!result.ok) return result;

  const sourcePins = new Map();
  for (const source of manifest.source_artifacts) {
    const relative = canonical(source.path);
    let absolute;
    try {
      absolute = resolveInside(projectRoot, relative, 'knowledge source artifact');
    } catch (error) {
      result.fail(error.message);
      continue;
    }
    if (sourcePins.has(relative)) result.fail(`source artifact is pinned more than once: ${relative}`);
    sourcePins.set(relative, source.sha256.toLowerCase());
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || fs.lstatSync(absolute).isSymbolicLink()) {
      result.fail(`pinned source artifact is missing or unsafe: ${relative}`);
    } else if (sha256File(absolute) !== source.sha256.toLowerCase()) {
      result.fail(`source artifact SHA-256 mismatch: ${relative}`);
    }
  }
  if (!sourcePins.has('analysis/legacy_user_flows.xlsx')) {
    result.fail('source_artifacts must pin the parity workbook');
  }
  if (!sourcePins.has('analysis/architecture/architecture-nfr-manifest.json')) {
    result.fail('source_artifacts must pin the approved architecture manifest');
  }
  const reviewStatus = input.status || statusAt(statusFile);
  const selectedReviews = reviewStatus?.architecture_review;
  try { validateRegistry(projectRoot, reviewStatus); }
  catch (error) { result.fail(error.message); return result; }
  if (!isAdopted(reviewStatus) && !sourcePins.has('analysis/architecture/architecture-review-verdict.md')) {
    result.fail('source_artifacts must pin the Stage 11 owner architecture verdict');
  }
  const architectureManifestFile = path.join(projectRoot, 'analysis', 'architecture', 'architecture-nfr-manifest.json');
  const architectureVerdictFile = path.join(projectRoot, 'analysis', 'architecture', 'architecture-review-verdict.md');
  if (fs.existsSync(architectureManifestFile)) {
    try {
      const architectureManifest = readJsonFile(architectureManifestFile);
      if (manifest.architecture_document_set_version !== architectureManifest.document_set_version) {
        result.fail(`architecture_document_set_version must equal approved architecture version ${architectureManifest.document_set_version}`);
      }
    } catch (error) {
      result.fail(`approved architecture manifest is invalid: ${error.message}`);
    }
  }
  if (isAdopted(reviewStatus)) {
    for (const record of [selectedReviews.owner_verdict, selectedReviews.closure_report]) {
      if (!record || !sourcePins.has(record)) result.fail('Knowledge sources must pin both selected owner verdict and closure report');
    }
    try {
      validateReviewRecords({ root: projectRoot, status: loadAndValidateStatus(statusFile),
        manifest: readJsonFile(architectureManifestFile), manifestFile: architectureManifestFile,
        drawioFile: path.join(projectRoot, 'analysis/architecture/architecture.drawio'), requireClosure: true });
    } catch (error) { result.fail(error.message); }
  } else if (fs.existsSync(architectureVerdictFile)) {
    const verdict = fs.readFileSync(architectureVerdictFile, 'utf8');
    const version = verdict.match(/^\s*[-*]?\s*Document set version:\s*\x60?([^\x60\r\n]+)\x60?\s*$/im)?.[1]?.trim();
    const manifestHash = verdict.match(/^\s*[-*]?\s*Manifest SHA-256:\s*\x60?([a-f0-9]{64})\x60?\s*$/im)?.[1]?.toLowerCase();
    if (version !== manifest.architecture_document_set_version) {
      result.fail('Stage 11 owner verdict does not approve the architecture_document_set_version');
    }
    if (manifestHash !== sourcePins.get('analysis/architecture/architecture-nfr-manifest.json')) {
      result.fail('Stage 11 owner verdict does not pin the exact approved architecture manifest hash');
    }
    if (!/^## Verdict\s*\r?\n+\s*approved\s*$/im.test(verdict)) {
      result.fail('Stage 11 owner architecture verdict is not approved');
    }
  }

  const filePins = new Map();
  const conceptIds = new Set();
  for (const entry of manifest.files) {
    const relative = canonical(entry.path);
    let absolute;
    try {
      absolute = resolveInside(bundleDir, relative, 'OKF bundle file');
    } catch (error) {
      result.fail(error.message);
      continue;
    }
    if (filePins.has(relative)) result.fail(`bundle file is pinned more than once: ${relative}`);
    filePins.set(relative, entry);
    if (entry.concept_id && conceptIds.has(entry.concept_id)) result.fail(`duplicate concept id ${entry.concept_id}`);
    if (entry.concept_id) conceptIds.add(entry.concept_id);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || fs.lstatSync(absolute).isSymbolicLink()) {
      result.fail(`pinned bundle file is missing or unsafe: ${relative}`);
    } else if (sha256File(absolute) !== entry.sha256.toLowerCase()) {
      result.fail(`bundle file SHA-256 mismatch: ${relative}`);
    }
  }
  const rootIndex = filePins.get('index.md');
  if (!rootIndex || rootIndex.role !== 'bundle-index') result.fail('files[] must pin index.md as bundle-index');

  if (fs.existsSync(bundleDir)) {
    for (const absolute of walkFiles(bundleDir).filter((file) => file.toLowerCase().endsWith('.md'))) {
      const relative = canonical(path.relative(bundleDir, absolute));
      if (!filePins.has(relative)) result.fail(`unmanifested OKF Markdown file: ${relative}`);
    }
  } else {
    result.fail('bundle/ directory is missing');
  }

  const sourceIds = new Set();
  for (const [relative, entry] of filePins.entries()) {
    const absolute = path.join(bundleDir, relative);
    if (!fs.existsSync(absolute)) continue;
    const body = fs.readFileSync(absolute, 'utf8');
    if (PLACEHOLDER.test(body.replace(/<!--[\s\S]*?-->/g, ''))) result.fail(`${relative} contains an unfilled placeholder`);
    const reserved = path.basename(relative).toLowerCase();
    const parsed = parseFrontmatter(body, relative, result);
    if (!parsed) continue;
    if (reserved === 'index.md') {
      if (relative === 'index.md' && parsed.value.okf_version !== '0.2') {
        result.fail('root index.md must declare okf_version: "0.2"');
      }
      continue;
    }
    if (reserved === 'log.md') continue;
    if (entry.role !== 'concept') result.fail(`${relative} must be manifested as role: concept`);
    const front = parsed.value;
    for (const field of ['type', 'id', 'title', 'description', 'status', 'generated', 'sources']) {
      if (front[field] == null || front[field] === '') result.fail(`${relative} requires frontmatter field ${field}`);
    }
    if (front.id !== entry.concept_id) result.fail(`${relative} id must equal manifest concept_id ${entry.concept_id}`);
    if (!['draft', 'stable', 'deprecated'].includes(front.status)) result.fail(`${relative} status must be draft, stable, or deprecated`);
    if (!front.generated || typeof front.generated !== 'object' || !front.generated.by || !front.generated.at) {
      result.fail(`${relative} generated must contain by and at`);
    } else if (Number.isNaN(Date.parse(front.generated.at))) {
      result.fail(`${relative} generated.at must be an ISO-8601 datetime`);
    }
    if (!Array.isArray(front.sources) || !front.sources.length) {
      result.fail(`${relative} must have at least one source`);
    } else {
      for (const source of front.sources) {
        if (!source || !source.id || !source.resource) {
          result.fail(`${relative} source requires id and resource`);
          continue;
        }
        const scopedId = `${front.id}:${source.id}`;
        if (sourceIds.has(scopedId)) result.fail(`${relative} has duplicate source id ${source.id}`);
        sourceIds.add(scopedId);
        resolveSource(projectRoot, source.resource, sourcePins, `${relative} source ${source.id}`, result);
      }
    }
    if (!parsed.body.trim()) result.fail(`${relative} concept body is empty`);
  }

  result.summary = `${conceptIds.size} concepts; ${filePins.size} pinned OKF files; ${sourcePins.size} pinned source artifacts`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['dir', 'project-root', 'status', 'scope'], [
    'KNOWLEDGE_DIR',
    'PROJECT_ROOT',
    'MIGRATION_STATUS_FILE',
  ]);
  process.exitCode = printResult(auditKnowledge({
    knowledgeDir: args.dir,
    projectRoot: args['project-root'],
    statusFile: args.status,
    scope: args.scope,
  }));
}

module.exports = {
  KNOWLEDGE_MANIFEST_SCHEMA,
  KNOWLEDGE_WAIVER_GATE,
  auditKnowledge,
  parseFrontmatter,
  tryBoundedKnowledgeWaiver,
};

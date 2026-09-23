'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { auditKnowledge } = require('./knowledge-audit');
const { sha256File, temporaryDirectory } = require('./helpers');

test('resolves historical architecture source pins and provenance without repinning', (t) => {
  const value = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  for (const name of ['nfr-manifest.json', 'review-verdict.md']) {
    const canonicalName = 'analysis/architecture/architecture-' + name;
    fs.copyFileSync(path.join(value.root, canonicalName),
      path.join(value.root, 'analysis/architecture', name));
    manifest.source_artifacts.find((entry) => entry.path === canonicalName).path =
      'analysis/architecture/' + name;
  }
  fs.writeFileSync(value.concept, fs.readFileSync(value.concept, 'utf8')
    .replace('resource: analysis/legacy_user_flows.xlsx',
      'resource: analysis/architecture/review-verdict.md'));
  manifest.files[1].sha256 = sha256File(value.concept);
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest));
  const audit = () => auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert.equal(audit().ok, true, audit().errors.join('\n'));
  const verdict = path.join(value.root, 'analysis/architecture/architecture-review-verdict.md');
  fs.appendFileSync(verdict, '\nUnapproved change\n');
  assert(audit().errors.some((error) => error.includes('SHA-256 mismatch')));
  fs.unlinkSync(verdict);
  assert.equal(audit().ok, false, 'a historical copy cannot replace a missing canonical source');
});

test('rejects duplicate historical and canonical architecture sources', (t) => {
  const value = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  manifest.source_artifacts.push({ ...manifest.source_artifacts[2],
    path: 'analysis/architecture/review-verdict.md' });
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest));
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => /pinned more than once/i.test(error)), result.errors.join('\n'));
});



function fixture(t) {
  const root = temporaryDirectory(t, 'knowledge-audit-');
  const knowledge = path.join(root, 'analysis', 'knowledge');
  const bundle = path.join(knowledge, 'bundle');
  const architecture = path.join(root, 'analysis', 'architecture');
  fs.mkdirSync(path.join(bundle, 'capabilities'), { recursive: true });
  fs.mkdirSync(architecture, { recursive: true });
  const workbook = path.join(root, 'analysis', 'legacy_user_flows.xlsx');
  const architectureManifest = path.join(architecture, 'architecture-nfr-manifest.json');
  const architectureVerdict = path.join(architecture, 'architecture-review-verdict.md');
  fs.writeFileSync(workbook, 'parity fixture');
  fs.writeFileSync(architectureManifest, '{"document_set_version":"architecture-v1"}');
  fs.writeFileSync(architectureVerdict, `# Stage 11 Verdict\n\n- Document set version: architecture-v1\n- Manifest SHA-256: ${sha256File(architectureManifest)}\n\n## Verdict\n\napproved\n`);
  const index = path.join(bundle, 'index.md');
  const concept = path.join(bundle, 'capabilities', 'projects.md');
  fs.writeFileSync(index, '---\nokf_version: "0.2"\n---\n\n# Knowledge\n');
  fs.writeFileSync(concept, `---
type: Capability
id: capability.projects
title: Projects
description: Project planning capability.
status: stable
generated: { by: test/process, at: 2026-08-07T12:00:00Z }
sources:
  - id: parity
    resource: analysis/legacy_user_flows.xlsx
    title: Parity map
---

# Definition

The system manages projects.
`);
  const manifest = {
    schema_version: 1,
    okf_version: '0.2',
    project: 'fixture',
    scope: 'fixture-scope',
    knowledge_set_version: 'knowledge-v1',
    architecture_document_set_version: 'architecture-v1',
    generated_at: '2026-08-07T12:00:00Z',
    source_artifacts: [
      { path: 'analysis/legacy_user_flows.xlsx', role: 'parity-map', sha256: sha256File(workbook) },
      { path: 'analysis/architecture/architecture-nfr-manifest.json', role: 'approved-architecture-manifest', sha256: sha256File(architectureManifest) },
      { path: 'analysis/architecture/architecture-review-verdict.md', role: 'owner-architecture-verdict', sha256: sha256File(architectureVerdict) },
    ],
    files: [
      { path: 'index.md', role: 'bundle-index', sha256: sha256File(index) },
      { path: 'capabilities/projects.md', role: 'concept', concept_id: 'capability.projects', sha256: sha256File(concept) },
    ],
  };
  const manifestFile = path.join(knowledge, 'knowledge-manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  return { root, knowledge, bundle, concept, manifestFile };
}

test('accepts a pinned OKF v0.2 migration bundle', (t) => {
  const value = fixture(t);
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.match(result.summary, /1 concepts/);
});

test('fails closed without a manifest', (t) => {
  const value = fixture(t);
  fs.rmSync(value.manifestFile);
  const result = auditKnowledge({
    knowledgeDir: value.knowledge,
    projectRoot: value.root,
    status: { delivery: { active_slice: '016-person-deletion' }, owner_decisions: [] },
  });
  assert.equal(result.ok, false);
  assert(result.errors.some((entry) => entry.includes('no valid exact-scope pre-SDD waiver')));
});

function waiverStatus(scope = '016-person-deletion') {
  return {
    delivery: { active_slice: scope },
    owner_decisions: [{
      id: `waiver:pre_sdd_knowledge:${scope}`,
      decision: 'approved',
      scope,
      permitted_next_stage: 'stage-15',
    }],
  };
}

test('permits only the exact active slice when the knowledge manifest is absent', (t) => {
  const value = fixture(t);
  fs.rmSync(value.manifestFile);
  const result = auditKnowledge({
    knowledgeDir: value.knowledge,
    projectRoot: value.root,
    status: waiverStatus(),
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.skipped, true);
  assert.match(result.summary, /global knowledge chain remains incomplete/);
});

test('rejects a pre-SDD knowledge waiver for another active slice', (t) => {
  const value = fixture(t);
  fs.rmSync(value.manifestFile);
  const status = waiverStatus('016-person-deletion');
  status.delivery.active_slice = '017-another-slice';
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((entry) => entry.includes('017-another-slice')));
});

test('rejects the waiver when no active slice can be determined', (t) => {
  const value = fixture(t);
  fs.rmSync(value.manifestFile);
  const status = waiverStatus();
  status.delivery.active_slice = null;
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((entry) => entry.includes('delivery.active_slice')));
});

test('rejects the waiver when its permitted stage is not Stage 15', (t) => {
  const value = fixture(t);
  fs.rmSync(value.manifestFile);
  const status = waiverStatus();
  status.owner_decisions[0].permitted_next_stage = 'stage-16';
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root, status });
  assert.equal(result.ok, false);
  assert(result.errors.some((entry) => entry.includes('must permit stage-15')));
});

test('detects changed concept content', (t) => {
  const value = fixture(t);
  fs.appendFileSync(value.concept, '\nChanged without repinning.\n');
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert(result.errors.some((entry) => entry.includes('SHA-256 mismatch')));
});

test('rejects an unmanifested concept', (t) => {
  const value = fixture(t);
  fs.copyFileSync(value.concept, path.join(value.bundle, 'capabilities', 'orphan.md'));
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert(result.errors.some((entry) => entry.includes('unmanifested OKF Markdown')));
});

test('requires stable ids and source provenance', (t) => {
  const value = fixture(t);
  const body = fs.readFileSync(value.concept, 'utf8')
    .replace('id: capability.projects', 'id: capability.changed')
    .replace(/sources:[\s\S]*?---\n\n# Definition/, 'sources: []\n---\n\n# Definition');
  fs.writeFileSync(value.concept, body);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  manifest.files[1].sha256 = sha256File(value.concept);
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert(result.errors.some((entry) => entry.includes('id must equal manifest concept_id')));
  assert(result.errors.some((entry) => entry.includes('at least one source')));
});

test('rejects concept provenance that is not pinned by source_artifacts', (t) => {
  const value = fixture(t);
  const unpinned = path.join(value.root, 'analysis', 'untracked-source.md');
  fs.writeFileSync(unpinned, '# Untracked source\n');
  const body = fs.readFileSync(value.concept, 'utf8')
    .replace('resource: analysis/legacy_user_flows.xlsx', 'resource: analysis/untracked-source.md');
  fs.writeFileSync(value.concept, body);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  manifest.files[1].sha256 = sha256File(value.concept);
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert(result.errors.some((entry) => entry.includes('not pinned in source_artifacts')));
});

test('rejects decoy source paths for the governed workbook and architecture manifest', (t) => {
  const value = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  manifest.source_artifacts[0].path = 'analysis/decoy/legacy_user_flows.xlsx';
  manifest.source_artifacts[1].path = 'analysis/decoy/architecture/architecture-nfr-manifest.json';
  fs.mkdirSync(path.join(value.root, 'analysis', 'decoy', 'architecture'), { recursive: true });
  fs.writeFileSync(path.join(value.root, manifest.source_artifacts[0].path), 'parity fixture');
  fs.writeFileSync(path.join(value.root, manifest.source_artifacts[1].path), '{"document_set_version":"architecture-v1"}');
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert(result.errors.some((entry) => entry.includes('must pin the parity workbook')));
  assert(result.errors.some((entry) => entry.includes('must pin the approved architecture manifest')));
});

test('requires the OKF bundle to name the exact owner-approved architecture version', (t) => {
  const value = fixture(t);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  manifest.architecture_document_set_version = 'architecture-v999';
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditKnowledge({ knowledgeDir: value.knowledge, projectRoot: value.root });
  assert(result.errors.some((entry) => entry.includes('must equal approved architecture version')));
  assert(result.errors.some((entry) => entry.includes('does not approve the architecture_document_set_version')));
});

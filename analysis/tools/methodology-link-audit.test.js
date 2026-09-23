'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { STAGE_NAMES } = require('./lib');
const { auditMethodology } = require('./methodology-link-audit');
const { temporaryDirectory } = require('./helpers');

function writeMethodologyFixture(directory, options = {}) {
  const analysis = path.join(directory, 'analysis');
  fs.mkdirSync(analysis, { recursive: true });
  const stages = [];
  for (let stage = 1; stage <= 19; stage += 1) {
    const name = options.staleStage13 && stage === 13 ? 'Old design stage' : STAGE_NAMES[stage];
    const details = stage === 9
      ? 'Stage 9 details: Grade A, Integration Contracts, Current Slice, Living Architecture Loop.'
      : stage === 13
        ? 'Stage 13 details: Open Knowledge Format (OKF) v0.2 is a vendor-neutral format published by Google Cloud.'
        : `Stage ${stage} details.`;
    stages.push(`### Stage ${stage} \u2014 ${name}`, '', details, '');
  }
  const link = options.brokenLink ? '[Entry](missing.md)' : '[Entry](../MIGRATION.md#entry)';
  const mapLink = options.unmappedMethodology ? '' : '\n\n[Artifact map](../ARTIFACTS.md)';
  const methodologyFile = path.join(analysis, 'migration_methodology.md');
  fs.writeFileSync(methodologyFile, `# Methodology\n\n${link}${mapLink}\n\n${stages.join('\n')}`);
  const htmlFile = path.join(analysis, 'migration_methodology.html');
  const nodes = Array.from({ length: 19 }, (_, index) => {
    const stage = index + 1;
    const label = stage === 9
      ? `Stage 9${options.staleArchitectureSync ? '' : ' Grade A Integration Contracts Current Slice Living Architecture Loop'}`
      : stage === 13 ? 'Stage 13 target knowledge synthesis Open Knowledge Format (OKF) v0.2 vendor-neutral Google Cloud'
        : stage === 15 ? 'Stage 15 SDD' : `Stage ${stage}`;
    return `<div id="st${String(stage).padStart(2, '0')}">${label}</div>`;
  });
  const htmlMapLink = options.unmappedHtml ? '' : '<a href="../ARTIFACTS.md">Artifact map</a>';
  fs.writeFileSync(htmlFile, `<!doctype html><html><body>${nodes.join('')}${htmlMapLink}</body></html>`);
  const entryFile = path.join(directory, 'MIGRATION.md');
  fs.writeFileSync(entryFile, '# Entry\n\n[Methodology](analysis/migration_methodology.md)\n');
  const artifactMapFile = path.join(directory, 'ARTIFACTS.md');
  if (!options.missingArtifactMap) {
    fs.writeFileSync(artifactMapFile, '# Repository Artifact Map\n\n[Entry](MIGRATION.md)\n');
  }
  return { methodologyFile, htmlFile, entryFile, artifactMapFile };
}

test('passes current governed methodology and reciprocal local links', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory);
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile, fixture.artifactMapFile],
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('rejects a missing repository artifact map', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory, { missingArtifactMap: true });
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.entryFile],
  });
  assert(result.errors.some((error) => error.includes('repository artifact map is missing')));
});

test('rejects methodology documents that do not reference the artifact map', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory, { unmappedMethodology: true, unmappedHtml: true });
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile, fixture.artifactMapFile],
  });
  assert(result.errors.some((error) => error.includes('canonical methodology must link to the repository artifact map')));
  assert(result.errors.some((error) => error.includes('methodology presentation must link to the repository artifact map')));
});

test('rejects stale Stage 13 naming', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory, { staleStage13: true });
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile],
  });
  assert(result.errors.some((error) => error.includes('Stage 13 must be named "Target knowledge synthesis"')));
});

test('exempts starter-source-only targets missing from an initialized project', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory);
  fs.writeFileSync(
    fixture.artifactMapFile,
    [
      '# Repository Artifact Map',
      '',
      '[Entry](MIGRATION.md)',
      '[Marker](.migration-starter-source)',
      '[Self test](tests/init-migration.Tests.ps1)',
      '[Hardening review](analysis/reviews/starter-governance-hardening-review.md)',
      '',
    ].join('\n')
  );
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile, fixture.artifactMapFile],
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('rejects broken local links and missing anchors', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory, { brokenLink: true });
  fs.writeFileSync(fixture.entryFile, '# Entry\n\n[Bad anchor](analysis/migration_methodology.md#not-there)\n');
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile],
  });
  assert(result.errors.some((error) => error.includes('links to missing missing.md')));
  assert(result.errors.some((error) => error.includes('missing anchor #not-there')));
});

test('rejects architecture content missing from the HTML Stage 9 presentation', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory, { staleArchitectureSync: true });
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile, fixture.artifactMapFile],
  });
  assert(result.errors.some((error) => error.includes('HTML must identify Stage 9 concept "Grade A"')));
});

test('rejects non-portable absolute local links', (t) => {
  const directory = temporaryDirectory(t, 'methodology-audit-');
  const fixture = writeMethodologyFixture(directory);
  fs.writeFileSync(
    fixture.entryFile,
    '# Entry\n\n[Windows path](C:/Work/Legacy/project/analysis/report.md)\n[POSIX path](/tmp/report.md)\n'
  );
  const result = auditMethodology({
    root: directory,
    methodologyFile: fixture.methodologyFile,
    htmlFile: fixture.htmlFile,
    files: [fixture.methodologyFile, fixture.htmlFile, fixture.entryFile, fixture.artifactMapFile],
  });
  assert.equal(
    result.errors.filter((error) => error.includes('non-portable absolute local link')).length,
    2
  );
});

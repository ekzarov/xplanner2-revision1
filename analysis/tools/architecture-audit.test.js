'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const zlib = require('node:zlib');
const { auditArchitecture, workbookTables } = require('./architecture-audit');
const { readEntries, writeEntries } = require('./xlsx-package');
const {
  approvalDocument,
  sha256File,
  temporaryDirectory,
  validStatus,
  validWaiver,
  writeStatus,
} = require('./helpers');

test('resolves historical architecture pins only to identical canonical files', (t) => {
  const directory = temporaryDirectory(t, 'architecture-rename-');
  const value = writeArchitecture(directory);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  for (const name of ['nfr-owner-review.md', 'nfr-decision-register.xlsx']) {
    const canonicalFile = path.join(directory, 'architecture-' + name);
    fs.copyFileSync(canonicalFile, path.join(directory, name));
    manifest.files.find((entry) => entry.path === 'architecture-' + name).path = name;
  }
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest));
  const audit = () => auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(audit().ok, true, audit().errors.join('\n'));
  const review = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.appendFileSync(review, '\nUnapproved change\n');
  assert(audit().errors.some((error) => /sha256 mismatch/i.test(error)), audit().errors.join('\n'));
  fs.unlinkSync(review);
  assert.equal(audit().ok, false, 'a historical copy cannot replace a missing canonical file');
});

test('rejects duplicate historical and canonical architecture pins', (t) => {
  const directory = temporaryDirectory(t, 'architecture-duplicate-alias-');
  const value = writeArchitecture(directory);
  const manifest = JSON.parse(fs.readFileSync(value.manifestFile, 'utf8'));
  const pin = manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md');
  manifest.files.push({ ...pin, path: 'nfr-owner-review.md' });
  fs.writeFileSync(value.manifestFile, JSON.stringify(manifest));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => /pinned more than once/i.test(error)), result.errors.join('\n'));
});



function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function columnName(index) {
  let value = index + 1;
  let name = '';
  while (value > 0) {
    value -= 1;
    name = String.fromCharCode(65 + (value % 26)) + name;
    value = Math.floor(value / 26);
  }
  return name;
}

function setWorksheetRow(file, sheetName, rowNumber, values) {
  const entries = readEntries(fs.readFileSync(file));
  const workbook = entries.find((entry) => entry.name === 'xl/workbook.xml');
  const relationships = entries.find((entry) => entry.name === 'xl/_rels/workbook.xml.rels');
  const sheetMatch = workbook.content.toString('utf8').match(
    new RegExp(`<(?:[A-Za-z0-9_]+:)?sheet\\b[^>]*name="${sheetName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}"[^>]*r:id="([^"]+)"`)
  );
  assert(sheetMatch, `missing worksheet ${sheetName}`);
  const relationshipTag = [...relationships.content.toString('utf8').matchAll(/<(?:[A-Za-z0-9_]+:)?Relationship\b([^>]*)\/?\s*>/g)]
    .map((match) => match[1]).find((attributes) => attributes.includes(`Id="${sheetMatch[1]}"`));
  assert(relationshipTag, `missing relationship for ${sheetName}`);
  const relationshipTarget = relationshipTag.match(/\bTarget="([^"]+)"/)?.[1];
  assert(relationshipTarget, `missing relationship target for ${sheetName}`);
  const target = relationshipTarget.startsWith('/')
    ? relationshipTarget.slice(1)
    : path.posix.normalize(path.posix.join('xl', relationshipTarget));
  const worksheet = entries.find((entry) => entry.name === target);
  assert(worksheet, `missing worksheet part ${target}`);
  const cells = values.map((value, index) => {
    if (value === '') return '';
    const reference = `${columnName(index)}${rowNumber}`;
    return `<c r="${reference}" t="inlineStr"><is><t>${xmlEscape(value)}</t></is></c>`;
  }).join('');
  const replacement = `<row r="${rowNumber}">${cells}</row>`;
  let xml = worksheet.content.toString('utf8');
  const rowPattern = new RegExp(`<(?:[A-Za-z0-9_]+:)?row\\b[^>]*\\br="${rowNumber}"[^>]*>[\\s\\S]*?<\\/(?:[A-Za-z0-9_]+:)?row>`);
  xml = rowPattern.test(xml) ? xml.replace(rowPattern, replacement) : xml.replace('</sheetData>', `${replacement}</sheetData>`);
  worksheet.content = Buffer.from(xml, 'utf8');
  fs.writeFileSync(file, writeEntries(entries));
}

function setWorksheetCellValue(file, sheetName, reference, value) {
  const entries = readEntries(fs.readFileSync(file));
  const workbook = entries.find((entry) => entry.name === 'xl/workbook.xml');
  const relationships = entries.find((entry) => entry.name === 'xl/_rels/workbook.xml.rels');
  const sheetMatch = workbook.content.toString('utf8').match(
    new RegExp(`<(?:[A-Za-z0-9_]+:)?sheet\\b[^>]*name="${sheetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*r:id="([^"]+)"`)
  );
  assert(sheetMatch, `missing worksheet ${sheetName}`);
  const relationshipTag = [...relationships.content.toString('utf8').matchAll(/<(?:[A-Za-z0-9_]+:)?Relationship\b([^>]*)\/?\s*>/g)]
    .map((match) => match[1]).find((attributes) => attributes.includes(`Id="${sheetMatch[1]}"`));
  const relationshipTarget = relationshipTag?.match(/\bTarget="([^"]+)"/)?.[1];
  assert(relationshipTarget, `missing relationship target for ${sheetName}`);
  const target = relationshipTarget.startsWith('/')
    ? relationshipTarget.slice(1)
    : path.posix.normalize(path.posix.join('xl', relationshipTarget));
  const worksheet = entries.find((entry) => entry.name === target);
  assert(worksheet, `missing worksheet part ${target}`);
  const cellPattern = new RegExp(`<(?:[A-Za-z0-9_]+:)?c\\b([^>]*\\br="${reference}"[^>]*)>[\\s\\S]*?<\\/(?:[A-Za-z0-9_]+:)?c>`);
  const xml = worksheet.content.toString('utf8');
  const cell = xml.match(cellPattern);
  assert(cell, `missing cell ${sheetName}!${reference}`);
  const attributes = cell[1].replace(/\s+t="[^"]*"/, '');
  worksheet.content = Buffer.from(
    xml.replace(cellPattern, `<c${attributes} t="inlineStr"><is><t>${xmlEscape(value)}</t></is></c>`),
    'utf8'
  );
  fs.writeFileSync(file, writeEntries(entries));
}

function repinRegister(directory, fixture) {
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(ownerReviewFile, fs.readFileSync(ownerReviewFile, 'utf8').replace(
    /Decision register SHA-256: [a-f0-9]+/,
    `Decision register SHA-256: ${sha256File(registerFile)}`
  ));
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
}

function repinFoundation(directory, fixture) {
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'sections/00-foundation.md').sha256 =
    sha256File(foundationFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
}

function writeArchitecture(directory, options = {}) {
  const adrDirectory = path.join(directory, 'adr');
  const sectionsDirectory = path.join(directory, 'sections');
  fs.mkdirSync(adrDirectory, { recursive: true });
  fs.mkdirSync(sectionsDirectory, { recursive: true });
  const architectureFile = path.join(directory, 'architecture.md');
  const drawioFile = path.join(directory, 'architecture.drawio');
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  const adrFile = path.join(adrDirectory, '001-session-security.md');
  const foundationFile = path.join(sectionsDirectory, '00-foundation.md');
  const specsDirectory = path.join(directory, 'specs', '001-security');
  const evidenceDirectory = path.join(directory, 'tests');
  fs.mkdirSync(specsDirectory, { recursive: true });
  fs.mkdirSync(evidenceDirectory, { recursive: true });
  fs.writeFileSync(architectureFile, [
    '# Architecture',
    '## Living Architecture Contract',
    'Recheck affected areas after every delivered slice.',
    '## Foundation Baseline',
    '[Foundation](sections/00-foundation.md)',
    '## Architecture Decomposition',
    'The main ADR links focused architecture areas.',
    '## First Implementable Slices',
    'Start with the solution skeleton and deployment baseline.',
  ].join('\n\n'));
  const runtimeGateFile = path.join(evidenceDirectory, 'runtime-contract.test.js');
  fs.writeFileSync(
    runtimeGateFile,
    `const assert = require('node:assert/strict');
const test = require('node:test');
const isRawContract = (source) => /GetConnectionString\\s*\\(\\s*["']/.test(source);
test('single-use-contract-rejected', () => {
  assert.equal(isRawContract('GetConnectionString("OneUseDatabase")'), true, 'single-use-contract-rejected');
});
test('local-text-permitted', () => {
  assert.equal(isRawContract('LogInformation("Started one worker.")'), false, 'local-text-permitted');
});
`
  );
  fs.writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify({ scripts: { test: 'node tests/runtime-contract.test.js' } }, null, 2)
  );
  fs.writeFileSync(foundationFile, `# Foundation

Stable code-start boundaries.

## Governed String Gate

| Evidence | Recorded value |
|---|---|
| governed runtime categories | cookies, headers, policies and configuration keys |
| analyzer or architecture test | \`tests/runtime-contract.test.js\` |
| normal CI command | \`npm test\` through the committed CI entrypoint |
| failing fixture | \`single-use-contract-rejected\` proves a raw cookie name is rejected |
| passing fixture | \`local-text-permitted\` proves local diagnostic text remains inline |
`);
  fs.writeFileSync(drawioFile, '<mxfile><diagram id="overview" name="Overview"><mxGraphModel><root><mxCell id="0"/></root></mxGraphModel></diagram><diagram id="deployment" name="Deployment"><mxGraphModel><root><mxCell id="0"/></root></mxGraphModel></diagram></mxfile>');
  fs.copyFileSync(
    path.join(__dirname, '..', 'architecture', 'templates', 'architecture-nfr-decision-register-template.xlsx'),
    registerFile
  );
  for (let index = 0; index < 19; index += 1) {
    setWorksheetRow(registerFile, 'Legacy Discovery', 8 + index, [
      `LD-${String(index + 1).padStart(3, '0')}`, 'Transactions', 'Trace boundaries', 'Architecture impact',
      'Required', 'Required', 'Optional', 'Optional', 'Code evidence', 'Live evidence', 'Owner evidence',
      'Consolidated behavior', 'No open risk', 'Completed', 'tests/security.test.txt', 'NFR-001',
      'Codex', 'Independent agent', 'Fixture',
    ]);
  }
  setWorksheetRow(registerFile, 'Client Questionnaire', 9, [
    'LD-001', 'Transactions', 'Code and live evidence', 'Confirm production exceptions',
    'Closes target boundary', 'Use conservative transaction boundary', 'No production exception exists',
    'Project owner', '2026-07-28', 'tests/security.test.txt', 'NFR-001 and ADR-001 confirmed', 'Answered',
  ]);
  fs.writeFileSync(ownerReviewFile, `# Stage 9 NFR Owner Review

- Reviewed by: project owner
- Date: 2026-07-28
- Decision register SHA-256: ${sha256File(registerFile)}
- Legacy discovery total: 19
- Legacy discovery completed: 19
- Legacy discovery open: 0
- Legacy discovery live skipped by owner: 0
- Client questionnaire total: 1
- Client questionnaire answered: 1
- Client questionnaire deferred: 0
- Client questionnaire open: 0
- Grade A total: 1
- Grade A approved: 1
- Grade A closed: 1
- Technology decisions total: 1
- Technology decisions resolved: 1
- Technology Grade A open: 0
- Team capabilities total: 1
- Team capabilities assessed: 1
- Team capabilities open: 0

## Verdict

approved
`);
  fs.writeFileSync(adrFile, '# ADR 001: Session security\n\nStatus: accepted\n');
  fs.writeFileSync(
    path.join(specsDirectory, 'spec.md'),
    '# Security\n\n- **NFR-001**: Session cookies resist script access.\n'
  );
  fs.writeFileSync(
    path.join(evidenceDirectory, 'security.test.txt'),
    'NFR-001 HttpOnly cookie verification passes in the integration suite.\n'
  );
  const manifest = {
    schema_version: 1,
    project: 'fixture',
    scope: 'fixture-scope',
    document_set_version: 'architecture-v1',
    published_at: '2026-07-28',
    files: [
      {
        path: 'architecture-nfr-decision-register.xlsx',
        role: 'owner-reviewed-nfr-decisions',
        document_set_version: 'architecture-v1',
        sha256: sha256File(registerFile),
      },
      {
        path: 'architecture-nfr-owner-review.md',
        role: 'stage-09-owner-gate',
        document_set_version: 'architecture-v1',
        sha256: sha256File(ownerReviewFile),
      },
      {
        path: 'architecture.md',
        role: 'normative-source',
        document_set_version: 'architecture-v1',
        sha256: sha256File(architectureFile),
      },
      {
        path: 'sections/00-foundation.md',
        role: 'foundation-baseline',
        document_set_version: 'architecture-v1',
        sha256: sha256File(foundationFile),
      },
      ...(options.omitDrawioPin ? [] : [{
        path: 'architecture.drawio',
        role: 'collaborative-architecture-source',
        document_set_version: 'architecture-v1',
        sha256: sha256File(drawioFile),
      }]),
      {
        path: 'adr/001-session-security.md',
        role: 'normative-decision',
        document_set_version: 'architecture-v1',
        sha256: sha256File(adrFile),
      },
    ],
    diagram_pages: [
      {
        id: 'overview',
        name: 'Overview',
        covers: ['executive-summary', 'current-architecture', 'target-architecture',
          'components-boundaries', 'integrations-data-flow', 'data-migration'],
      },
      {
        id: 'deployment',
        name: 'Deployment',
        covers: ['security-roles', 'deployment-topology', 'measurable-nfrs',
          'adr-trade-offs', 'risks-delivery'],
      },
    ],
    nfrs: [{
      id: 'NFR-001',
      category: 'security',
      statement: 'Session cookies resist script access.',
      acceptance: 'An automated test proves the cookie is HttpOnly.',
      adrs: ['ADR-001'],
      evidence: options.emptyClosure ? [] : ['tests/security.test.txt#NFR-001 HttpOnly'],
    }],
    adrs: [{
      id: 'ADR-001',
      title: 'Session security',
      file: 'adr/001-session-security.md',
      nfrs: ['NFR-001'],
    }],
  };
  const manifestFile = path.join(directory, 'architecture-nfr-manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  if (options.verdict) {
    const reportFile = path.join(directory, 'analysis', 'reviews', 'stage-10-pass-001.md');
    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
    fs.writeFileSync(reportFile, '# Stage 10 Review\n\n- Result: `clean`\n- Document set: `architecture-v1`\n');
    fs.writeFileSync(path.join(directory, 'architecture-review-verdict.md'), `${approvalDocument({
      'Approved by': 'project owner',
      Date: '2026-07-28',
      Scope: 'fixture-scope',
      'Document set version': 'architecture-v1',
      'Manifest SHA-256': sha256File(manifestFile),
      'Architecture Draw.io version': 'architecture-v1',
      'Architecture Draw.io SHA-256': sha256File(drawioFile),
      'Stage 10 clean report': 'analysis/reviews/stage-10-pass-001.md',
    })}\n## Verdict\n\napproved\n`);
  }
  return { architectureFile, drawioFile, manifestFile };
}

test('passes a complete architecture set with Draw.io and verdict pins', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory, { verdict: true });
  const result = auditArchitecture({
    architectureDir: directory,
    projectRoot: directory,
    requireVerdict: true,
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert(result.summary.includes('including architecture.drawio'));
});

test('fails when the Foundation omits the governed string gate record', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-gate-');
  const fixture = writeArchitecture(directory);
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  fs.writeFileSync(
    foundationFile,
    fs.readFileSync(foundationFile, 'utf8').replace('## Governed String Gate', '## String Notes')
  );
  repinFoundation(directory, fixture);

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('missing ## Governed String Gate')));
});

test('fails when the governed string gate names a nonexistent test', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-gate-');
  const fixture = writeArchitecture(directory);
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  fs.writeFileSync(
    foundationFile,
    fs.readFileSync(foundationFile, 'utf8')
      .replace('`tests/runtime-contract.test.js`', '`tests/missing-runtime-contract.test.js`')
  );
  repinFoundation(directory, fixture);

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not exist')));
});

test('fails when a pinned architecture document declares a stale set version', (t) => {
  const directory = temporaryDirectory(t, 'architecture-version-drift-');
  const fixture = writeArchitecture(directory);
  const adrFile = path.join(directory, 'adr', '001-session-security.md');
  fs.appendFileSync(adrFile, '\n- Document set version: architecture-old\n');
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'adr/001-session-security.md').sha256 =
    sha256File(adrFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('declares document set version')));
});

test('fails when the governed string gate names a fictional CI command', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-ci-');
  const fixture = writeArchitecture(directory);
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  fs.writeFileSync(
    foundationFile,
    fs.readFileSync(foundationFile, 'utf8').replace('`npm test`', '`pwsh -File build/missing.ps1`')
  );
  repinFoundation(directory, fixture);

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('committed executable entrypoint')));
});

test('fails when the normal CI command does not execute the recorded gate', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-ci-');
  const fixture = writeArchitecture(directory);
  fs.writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify({ scripts: { test: 'node tests/unrelated.test.js' } }, null, 2)
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not execute the recorded analyzer/test')));
});

test('fails when CI only prints the recorded gate path', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-ci-print-');
  const fixture = writeArchitecture(directory);
  fs.mkdirSync(path.join(directory, 'build'), { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'build', 'ci.ps1'),
    'Write-Output "tests/runtime-contract.test.js"\n'
  );
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  fs.writeFileSync(
    foundationFile,
    fs.readFileSync(foundationFile, 'utf8').replace('`npm test`', '`pwsh -File build/ci.ps1`')
  );
  repinFoundation(directory, fixture);

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not execute the recorded analyzer/test')));
});

test('fails when an inline interpreter only prints the recorded gate path', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-ci-inline-print-');
  const fixture = writeArchitecture(directory);
  fs.writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify({ scripts: { test: `node -e "console.log('tests/runtime-contract.test.js')"` } }, null, 2)
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not execute the recorded analyzer/test')));
});

test('fails when a helper receives the gate path as an unused argument', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-ci-helper-print-');
  writeArchitecture(directory);
  fs.mkdirSync(path.join(directory, 'tools'), { recursive: true });
  fs.writeFileSync(path.join(directory, 'tools', 'print.js'), 'console.log(process.argv[2]);\n');
  fs.writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify({ scripts: { test: 'node tools/print.js tests/runtime-contract.test.js' } }, null, 2)
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not execute the recorded analyzer/test')));
});

test('fails when the recorded gate appears only in a commented CI line', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-ci-comment-');
  const fixture = writeArchitecture(directory);
  fs.mkdirSync(path.join(directory, 'build'), { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'build', 'ci.ps1'),
    'Write-Output "unrelated" # dotnet test tests/runtime-contract.test.js\n'
  );
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  fs.writeFileSync(
    foundationFile,
    fs.readFileSync(foundationFile, 'utf8').replace('`npm test`', '`pwsh -File build/ci.ps1`')
  );
  repinFoundation(directory, fixture);

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('does not execute the recorded analyzer/test')));
});

test('fails when fixture identifiers are absent from the recorded test', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-fixture-');
  const fixture = writeArchitecture(directory);
  const foundationFile = path.join(directory, 'sections', '00-foundation.md');
  fs.writeFileSync(
    foundationFile,
    fs.readFileSync(foundationFile, 'utf8')
      .replace('`single-use-contract-rejected`', '`invented-rejected-fixture`')
  );
  repinFoundation(directory, fixture);

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('must exist outside comments')));
});

test('fails when fixture identifiers and assertions exist only in comments', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-fixture-');
  const fixture = writeArchitecture(directory);
  fs.writeFileSync(
    path.join(directory, 'tests', 'runtime-contract.test.js'),
    '// single-use-contract-rejected local-text-permitted assert.equal(true, true)\n'
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('outside comments')));
  assert(result.errors.some((error) => error.includes('executable assertion')));
});

test('fails when fixture identifiers do not participate in behavioral assertions', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-fixture-binding-');
  writeArchitecture(directory);
  fs.writeFileSync(
    path.join(directory, 'tests', 'runtime-contract.test.js'),
    `const assert = require('node:assert/strict');
const failingFixture = 'single-use-contract-rejected';
const passingFixture = 'local-text-permitted';
assert.equal(true, true);
void failingFixture;
void passingFixture;
`
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('participate in an executable assertion')));
});

test('fails when fixture identifiers appear only as test names around tautological assertions', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-fixture-tautology-');
  writeArchitecture(directory);
  fs.writeFileSync(
    path.join(directory, 'tests', 'runtime-contract.test.js'),
    `const assert = require('node:assert/strict');
const test = require('node:test');
test('single-use-contract-rejected', () => assert.equal(true, true));
test('local-text-permitted', () => assert.equal(true, true));
`
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('participate in an executable assertion')));
});

test('fails when fixture identifiers decorate dressed-up tautological assertions', (t) => {
  const directory = temporaryDirectory(t, 'architecture-string-fixture-dressed-tautology-');
  writeArchitecture(directory);
  fs.writeFileSync(
    path.join(directory, 'tests', 'runtime-contract.test.js'),
    `const assert = require('node:assert/strict');
assert.equal(Boolean(true), true, 'single-use-contract-rejected');
assert.equal(Boolean(true), true, 'local-text-permitted');
`
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('participate in an executable assertion')));
});

test('fails when the Stage 9 owner review does not close all Grade A rows', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8').replace('Grade A closed: 1', 'Grade A closed: 0')
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('every Grade A row closed')));
});

test('fails when the Stage 9 owner review leaves technology decisions unresolved', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace('Technology decisions resolved: 1', 'Technology decisions resolved: 0')
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('every technology decision resolved')));
});

test('fails when the decision register lacks the Technology Stack worksheet', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8').replace('name="Technology Stack"', 'name="Legacy Inputs"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Technology Stack worksheet')));
});

test('fails when the decision register lacks the Legacy Discovery worksheet', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8').replace('name="Legacy Discovery"', 'name="Legacy Notes"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Legacy Discovery worksheet')));
});

test('fails when the decision register lacks the Client Questionnaire worksheet', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8').replace('name="Client Questionnaire"', 'name="Client Notes"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Client Questionnaire worksheet')));
});

test('fails when the decision register lacks the System Diagram Gate worksheet', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8').replace('name="System Diagram Gate"', 'name="Diagram Notes"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  let ownerReview = fs.readFileSync(ownerReviewFile, 'utf8');
  ownerReview = ownerReview.replace(/Decision register SHA-256: [a-f0-9]{64}/, `Decision register SHA-256: ${sha256File(registerFile)}`);
  fs.writeFileSync(ownerReviewFile, ownerReview);
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('System Diagram Gate worksheet')));
});

test('fails when the decision register lacks the Integration Contracts worksheet', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8').replace('name="Integration Contracts"', 'name="Integration Notes"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Integration Contracts worksheet')));
});

test('fails when the Overview navigator is stale', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const row = [...workbookTables(registerFile).get('Overview')[18]];
  row[1] = 'Old Overview Name';
  setWorksheetRow(registerFile, 'Overview', 19, row);
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('navigator must list every real worksheet exactly once')));
});

test('fails when Overview priorities are not the uninterrupted sequence 1..N', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const row = [...workbookTables(registerFile).get('Overview')[19]];
  row[0] = '1';
  setWorksheetRow(registerFile, 'Overview', 20, row);
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('uninterrupted sequence 1..N')));
});

test('fails when Overview order differs from physical worksheet-tab order', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  const workbookXml = workbookPart.content.toString('utf8');
  workbookPart.content = Buffer.from(workbookXml
    .replace('name="Team Capability"', 'name="Temporary Capability"')
    .replace('name="Technology Stack"', 'name="Team Capability"')
    .replace('name="Temporary Capability"', 'name="Technology Stack"'), 'utf8');
  fs.writeFileSync(registerFile, writeEntries(entries));
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('exactly match physical worksheet-tab order')));
});

test('fails when an NFR has no architecture area', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const row = [...workbookTables(registerFile).get('NFR Register')[5]];
  row[23] = '';
  setWorksheetRow(registerFile, 'NFR Register', 6, row);
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('A01 has no architecture area')));
});

test('fails when an NFR has no first dependent slice', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const row = [...workbookTables(registerFile).get('NFR Register')[5]];
  row[24] = '';
  setWorksheetRow(registerFile, 'NFR Register', 6, row);
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('A01 has no first dependent slice')));
});

test('fails when Legacy Discovery is not immediately before NFR Register', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8')
      .replace('name="Legacy Discovery"', 'name="Temporary Discovery"')
      .replace('name="NFR Register"', 'name="Legacy Discovery"')
      .replace('name="Temporary Discovery"', 'name="NFR Register"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('immediately before NFR Register')));
});

test('fails when required Legacy Discovery rows remain open', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace('Legacy discovery completed: 1', 'Legacy discovery completed: 0')
      .replace('Legacy discovery open: 0', 'Legacy discovery open: 1')
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('every required Legacy Discovery row')));
  assert(result.errors.some((error) => error.includes('zero open Legacy Discovery rows')));
});

test('fails when required client questionnaire rows remain open', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace('Client questionnaire answered: 1', 'Client questionnaire answered: 0')
      .replace('Client questionnaire open: 0', 'Client questionnaire open: 1')
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('zero open Client Questionnaire rows')));
});

test('fails when the workbook questionnaire is open despite closed Markdown totals', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  setWorksheetRow(registerFile, 'Client Questionnaire', 9, [
    'LD-001', 'Transactions', 'Evidence', 'Question', 'Impact', 'Fallback', '', '', '', '', '', 'Open',
  ]);
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('totals do not match workbook rows')));
});

test('fails when a closed NFR value contradicts its semantic fill color', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  setWorksheetCellValue(registerFile, 'NFR Register', 'W6', 'Yes');
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Closed = "Yes" but fill #F4CCCC')));
});

test('fails when an answered questionnaire row lacks authority and durable evidence', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  setWorksheetRow(registerFile, 'Client Questionnaire', 9, [
    'LD-001', 'Transactions', 'Evidence', 'Question', 'Impact', 'Fallback', 'Confirmed', '',
    '2026-07-28', '', 'NFR-001 confirmed', 'Answered',
  ]);
  repinRegister(directory, fixture);
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Respondent / authority')));
  assert(result.errors.some((error) => error.includes('Evidence / link')));
});

test('fails when the decision register lacks the Team Capability worksheet', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8').replace('name="Team Capability"', 'name="Legacy Capability"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Team Capability worksheet')));
});

test('fails when Team Capability is not immediately before Technology Stack', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  const workbookPart = entries.find((entry) => entry.name === 'xl/workbook.xml');
  workbookPart.content = Buffer.from(
    workbookPart.content.toString('utf8')
      .replace('name="Team Capability"', 'name="Temporary Capability"')
      .replace('name="Technology Stack"', 'name="Team Capability"')
      .replace('name="Temporary Capability"', 'name="Technology Stack"'),
    'utf8'
  );
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace(/Decision register SHA-256: [a-f0-9]+/, `Decision register SHA-256: ${sha256File(registerFile)}`)
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-decision-register.xlsx').sha256 = sha256File(registerFile);
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('immediately before Technology Stack')));
});

test('fails when required team capabilities remain unassessed', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8')
      .replace('Team capabilities assessed: 1', 'Team capabilities assessed: 0')
      .replace('Team capabilities open: 0', 'Team capabilities open: 1')
  );
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture-nfr-owner-review.md').sha256 = sha256File(ownerReviewFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('every required team capability assessed')));
  assert(result.errors.some((error) => error.includes('zero open team capability gaps')));
});

test('fails when the decision register drops a mandatory governance field', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory);
  const registerFile = path.join(directory, 'architecture-nfr-decision-register.xlsx');
  const entries = readEntries(fs.readFileSync(registerFile));
  for (const entry of entries) {
    if (!entry.name.startsWith('xl/') || !entry.name.endsWith('.xml')) continue;
    entry.content = Buffer.from(
      entry.content.toString('utf8').replaceAll('Decision Owner', 'Removed field'),
      'utf8'
    );
  }
  fs.writeFileSync(registerFile, writeEntries(entries));
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(
    ownerReviewFile,
    fs.readFileSync(ownerReviewFile, 'utf8').replace(
      /Decision register SHA-256: .+/,
      `Decision register SHA-256: ${sha256File(registerFile)}`
    )
  );

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('Decision Owner')));
});

test('fails closed when architecture.drawio is not pinned by the manifest', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory, { omitDrawioPin: true });
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('files[] must pin architecture.drawio')));
});

test('invalidates the verdict when architecture.drawio changes', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory, { verdict: true });
  fs.appendFileSync(fixture.drawioFile, '<!-- changed -->');
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory, requireVerdict: true });
  assert(result.errors.some((error) => error.includes('sha256 mismatch for architecture.drawio')));
  assert(result.errors.some((error) => error.includes('exact architecture.drawio SHA-256')));
});

test('invalidates the verdict when the manifest changes', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory, { verdict: true });
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.document_set_version = 'architecture-v2';
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory, requireVerdict: true });
  assert(result.errors.some((error) => error.includes('manifest SHA-256')));
  assert(result.errors.some((error) => error.includes('"architecture-v2"')));
});

test('requires symmetric NFR and ADR links', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.adrs[0].nfrs = ['NFR-OTHER'];
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('lacks the reverse')));
  assert(result.errors.some((error) => error.includes('unknown NFR')));
});

test('skips only for a schema-valid exact architecture waiver', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const waiverRecord = path.join(directory, 'analysis/stages/waivers/fixture-waiver.md');
  fs.mkdirSync(path.dirname(waiverRecord), { recursive: true });
  fs.writeFileSync(waiverRecord, '# Waiver\n\nExact scope and residual risk were recorded.\n');
  const statusFile = writeStatus(directory, validStatus({
    owner_decisions: [validWaiver('architecture_retroactive', 'fixture-scope')],
  }));
  const accepted = auditArchitecture({
    architectureDir: path.join(directory, 'absent'),
    statusFile,
    scope: 'fixture-scope',
  });
  assert.equal(accepted.ok, true, accepted.errors.join('\n'));
  assert.equal(accepted.skipped, true);

  const rejected = auditArchitecture({
    architectureDir: path.join(directory, 'absent'),
    statusFile,
    scope: 'fixture-scope-child',
  });
  assert.equal(rejected.ok, false);
});

test('accepted architecture permits evidence closure to be added by later stages', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory, { verdict: true, emptyClosure: true });
  const result = auditArchitecture({
    architectureDir: directory,
    projectRoot: directory,
    requireVerdict: true,
  });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('rejects delivery-level references from governed architecture files', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory, { emptyClosure: true });
  fs.appendFileSync(fixture.architectureFile, '\nImplemented by SDD 007 under specs/007-feature.\n');
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.files.find((entry) => entry.path === 'architecture.md').sha256 = sha256File(fixture.architectureFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));

  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('delivery-level reference')),
    result.errors.join('\n'));
});

test('foundation mode permits code-start delivery while team capability remains open', (t) => {
  const directory = temporaryDirectory(t, 'architecture-foundation-');
  const fixture = writeArchitecture(directory);
  const ownerReviewFile = path.join(directory, 'architecture-nfr-owner-review.md');
  fs.writeFileSync(ownerReviewFile, fs.readFileSync(ownerReviewFile, 'utf8')
    .replace('Team capabilities assessed: 1', 'Team capabilities assessed: 0')
    .replace('Team capabilities open: 0', 'Team capabilities open: 1')
    .replace('## Verdict\n\napproved', '## Foundation Verdict\n\napproved-for-delivery'));
  repinRegister(directory, fixture);

  const foundation = auditArchitecture({ architectureDir: directory, projectRoot: directory, foundation: true });
  assert.equal(foundation.ok, true, foundation.errors.join('\n'));
  const complete = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(complete.ok, false);
  assert(complete.errors.some((error) => error.includes('team capability')));
});

test('requires an explicit approved verdict and closing Stage 10 report', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory, { verdict: true });
  const verdict = path.join(directory, 'architecture-review-verdict.md');
  fs.writeFileSync(verdict, fs.readFileSync(verdict, 'utf8')
    .replace('- Stage 10 clean report: `analysis/reviews/stage-10-pass-001.md`\n', '')
    .replace('approved', 'remarks'));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory, requireVerdict: true });
  assert(result.errors.some((error) => error.includes('approved Verdict section')));
  assert(result.errors.some((error) => error.includes('Stage 10 clean report')));
});

test('requires the referenced Stage 10 report to exist, be clean, and match the set', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory, { verdict: true });
  const report = path.join(directory, 'analysis', 'reviews', 'stage-10-pass-001.md');
  fs.writeFileSync(report, '# Stage 10 Review\n\n- Result: `findings`\n- Document set: `architecture-v10`\n');
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory, requireVerdict: true });
  assert(result.errors.some((error) => error.includes('Result: clean')));
  assert(result.errors.some((error) => error.includes('exact document set')));
});

test('requires Draw.io pages to cover every architecture review concern', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.diagram_pages[1].covers = ['security-roles'];
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('required concern deployment-topology')));
});

test('requires a collaborative multi-page Draw.io architecture', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  fs.writeFileSync(fixture.drawioFile, '<mxfile><diagram id="overview" name="Overview"/></mxfile>');
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  const pin = manifest.files.find((entry) => entry.path === 'architecture.drawio');
  pin.sha256 = sha256File(fixture.drawioFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('at least two diagram pages')));
});

test('rejects malformed Draw.io tag fragments that are not editable documents', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  fs.writeFileSync(fixture.drawioFile, '<mxfile><diagram/><diagram/>');
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  const pin = manifest.files.find((entry) => entry.path === 'architecture.drawio');
  pin.sha256 = sha256File(fixture.drawioFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('valid editable mxfile')));
});

test('accepts native compressed Draw.io page bodies', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const graph = '<mxGraphModel><root><mxCell id="0"/></root></mxGraphModel>';
  const compressed = zlib.deflateRawSync(Buffer.from(encodeURIComponent(graph), 'utf8')).toString('base64');
  fs.writeFileSync(fixture.drawioFile, `<mxfile><diagram id="overview" name="Overview">${compressed}</diagram><diagram id="deployment" name="Deployment">${compressed}</diagram></mxfile>`);
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  const pin = manifest.files.find((entry) => entry.path === 'architecture.drawio');
  pin.sha256 = sha256File(fixture.drawioFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('rejects corrupt compressed Draw.io page bodies', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  fs.writeFileSync(fixture.drawioFile, '<mxfile><diagram id="overview" name="Overview">7V1bc5s4FP41ntmZL91JdGVnZ2Z3Z7Z9</diagram><diagram id="deployment" name="Deployment">dZLNboMwEIRfJtdI4gT0lJ56qSpVqj1U</diagram></mxfile>');
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  const pin = manifest.files.find((entry) => entry.path === 'architecture.drawio');
  pin.sha256 = sha256File(fixture.drawioFile);
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({ architectureDir: directory, projectRoot: directory });
  assert(result.errors.some((error) => error.includes('valid editable mxfile')));
});

test('architecture manifest rejects unknown fields', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  const fixture = writeArchitecture(directory);
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestFile, 'utf8'));
  manifest.nfrs[0].unreviewed = true;
  fs.writeFileSync(fixture.manifestFile, JSON.stringify(manifest, null, 2));
  const result = auditArchitecture({
    architectureDir: directory,
    projectRoot: directory,
  });
  assert(result.errors.some((error) => error.includes('additional properties')));
});

test('rejects arbitrary architecture waiver gate overrides even with complete architecture', (t) => {
  const directory = temporaryDirectory(t, 'architecture-audit-');
  writeArchitecture(directory);
  const result = auditArchitecture({
    architectureDir: directory,
    projectRoot: directory,
    waiverGate: 'invented_gate',
  });
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('architecture waiver gate must be')));
});

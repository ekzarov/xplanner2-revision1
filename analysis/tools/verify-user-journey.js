#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function passedTestTitles(report) {
  const passedTitles = [];
  function visitSuite(suite) {
    for (const spec of suite.specs || []) {
      if ((spec.tests || []).some((entry) =>
        (entry.results || []).some((result) => result.status === 'passed'))) {
        passedTitles.push(spec.title);
      }
    }
    for (const child of suite.suites || []) visitSuite(child);
  }
  for (const suite of report.suites || []) visitSuite(suite);
  return passedTitles;
}

function passedAnnotations(report, type) {
  const annotations = new Set();
  function visitSuite(suite) {
    for (const spec of suite.specs || []) {
      for (const entry of spec.tests || []) {
        const passed = (entry.results || []).some((result) => result.status === 'passed');
        if (!passed) continue;
        for (const annotation of entry.annotations || []) {
          if (annotation.type === type && annotation.description) {
            annotations.add(annotation.description);
          }
        }
      }
    }
    for (const child of suite.suites || []) visitSuite(child);
  }
  for (const suite of report.suites || []) visitSuite(suite);
  return annotations;
}

function verifyUserJourney(report, record, requiredSurfaces = [], parityChain = null) {
  const changedSection = record.split(/^## Changed (?:And Directly Affected )?Surfaces\s*$/m)[1]
    ?.split(/^## /m)[0] || '';
  const surfaceIds = changedSection
    .split(/\r?\n/)
    .filter((line) => /^\s*\|.*\|\s*$/.test(line))
    .slice(2)
    .map((line) => line.trim().slice(1, -1).split('|')[0].trim().replace(/^`|`$/g, ''))
    .filter(Boolean);

  const passedTitles = passedTestTitles(report);
  if (!passedTitles.some((title) => title.includes('@invariant:web-auth-entry'))) {
    throw new Error('No passed deployed browser test covers @invariant:web-auth-entry.');
  }
  for (const surfaceId of [...new Set([...surfaceIds, ...requiredSurfaces])]) {
    if (!passedTitles.some((title) => title.includes(`@surface:${surfaceId}`))) {
      throw new Error(`Changed surface "${surfaceId}" has no passed deployed browser journey.`);
    }
  }
  if (parityChain) {
    const attestations = passedAnnotations(report, 'parity-chain');
    if (!attestations.has(`local-revision:${parityChain.revision}`)) {
      throw new Error('Durable evidence lacks exact-revision local parity proof.');
    }
    if (!attestations.has(`asset-manifest:${parityChain.assetManifest}`)) {
      throw new Error('Durable evidence lacks deployed asset-identity proof.');
    }
  }
  return surfaceIds;
}

function recordRevision(record) {
  return record.match(/^- Deployed revision:\s*`?([^`\r\n]+)`?\s*$/im)?.[1]?.trim();
}

function persistEvidence({
  report,
  reportBytes,
  record,
  recordFile,
  evidenceDirectory,
  surfaceIds,
  paritySurfaces,
}) {
  const revision = process.env.DELIVERY_REVISION;
  const recordedRevision = recordRevision(record);
  if (!revision || recordedRevision !== revision) {
    throw new Error(
      `Delivery evidence revision mismatch: record=${recordedRevision || 'missing'}, runtime=${revision || 'missing'}.`,
    );
  }
  const reportHash = crypto.createHash('sha256').update(reportBytes).digest('hex');
  const base = path.basename(recordFile, path.extname(recordFile));
  const reportEvidenceFile = path.resolve(
    evidenceDirectory,
    `${base}-${revision}-${reportHash.slice(0, 12)}-playwright.json`,
  );
  const evidence = {
    schema_version: '1.1.0',
    delivery_revision: revision,
    report_sha256: reportHash,
    playwright_report: path.basename(reportEvidenceFile),
    projects: (report.config?.projects || []).map((project) => project.name),
    passed_tests: passedTestTitles(report),
    changed_surfaces: surfaceIds,
    parity_surfaces: paritySurfaces,
    local_parity_revision: process.env.DELIVERY_LOCAL_PARITY_REVISION,
    deployed_asset_manifest_sha256: process.env.DELIVERY_ASSET_MANIFEST_SHA256,
  };
  const evidenceFile = path.resolve(
    evidenceDirectory,
    `${base}-${revision}-${reportHash.slice(0, 12)}-live.json`,
  );
  if (fs.existsSync(reportEvidenceFile) || fs.existsSync(evidenceFile)) {
    throw new Error('Immutable delivery evidence already exists for this report.');
  }
  fs.writeFileSync(reportEvidenceFile, reportBytes, { flag: 'wx' });
  fs.writeFileSync(evidenceFile, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' });
  return evidenceFile;
}

if (require.main === module) {
  const [reportFile, recordFile, evidenceDirectory] = process.argv.slice(2);
  if (!reportFile || !recordFile) {
    throw new Error('Playwright report and delivery record are required.');
  }
  const reportBytes = fs.readFileSync(path.resolve(reportFile));
  const report = JSON.parse(reportBytes);
  const record = fs.readFileSync(path.resolve(recordFile), 'utf8');
  const paritySurfaces = (process.env.UI_PARITY_SURFACES || '').split(',').filter(Boolean);
  const parityChain = evidenceDirectory ? {
    revision: process.env.DELIVERY_LOCAL_PARITY_REVISION,
    assetManifest: process.env.DELIVERY_ASSET_MANIFEST_SHA256,
  } : null;
  if (parityChain && (!parityChain.revision
    || !/^[a-f0-9]{64}$/.test(parityChain.assetManifest || ''))) {
    throw new Error(
      'Durable evidence requires a verified local-parity revision and deployed asset manifest.',
    );
  }
  const surfaceIds = verifyUserJourney(report, record, paritySurfaces, parityChain);
  if (evidenceDirectory) {
    const evidenceFile = persistEvidence({
      report,
      reportBytes,
      record,
      recordFile: path.resolve(recordFile),
      evidenceDirectory: path.resolve(evidenceDirectory),
      surfaceIds,
      paritySurfaces,
    });
    process.stdout.write(`IMMUTABLE EVIDENCE: ${evidenceFile}\n`);
  }
  process.stdout.write(`USER JOURNEY EVIDENCE OK: ${surfaceIds.length} changed surfaces\n`);
}

module.exports = {
  passedAnnotations,
  passedTestTitles,
  persistEvidence,
  recordRevision,
  verifyUserJourney,
};

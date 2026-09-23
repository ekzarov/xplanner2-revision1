'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { persistEvidence, verifyUserJourney } = require('./verify-user-journey');

const record = [
  '- Deployed revision: `abcdef123456`',
  '## Changed And Directly Affected Surfaces',
  '| Surface ID | Roles | Useful action or contract | Deployment location |',
  '|---|---|---|---|',
  '| sign-in | user | authenticate | /sign-in |',
  '| report | manager | generate | /report |',
  '## Smoke Results',
].join('\n');

function report(title, annotations = []) {
  return {
    config: { projects: [{ name: 'desktop' }, { name: 'mobile' }] },
    suites: [{
      specs: [{
        title,
        tests: [{
          annotations: annotations.map((description) => ({
            type: 'parity-chain',
            description,
          })),
          results: [{ status: 'passed' }],
        }],
      }],
    }],
  };
}

test('verifies every changed surface and exact parity-chain annotation', () => {
  const assetManifest = 'a'.repeat(64);
  assert.deepEqual(verifyUserJourney(
    report('live @invariant:web-auth-entry @surface:sign-in @surface:report', [
      'local-revision:abcdef123456',
      `asset-manifest:${assetManifest}`,
    ]),
    record,
    [],
    { revision: 'abcdef123456', assetManifest },
  ), ['sign-in', 'report']);
});

test('rejects missing browser entry and changed-surface proof', () => {
  assert.throws(() => verifyUserJourney(report('@surface:sign-in'), record), /web-auth-entry/);
  assert.throws(
    () => verifyUserJourney(report('@invariant:web-auth-entry @surface:sign-in'), record),
    /report.*no passed deployed browser journey/,
  );
});

test('persists content-addressed raw Playwright JSON beside its summary', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'journey-evidence-'));
  const reportValue = report('@invariant:web-auth-entry @surface:sign-in @surface:report');
  const reportBytes = Buffer.from(JSON.stringify(reportValue));
  const input = {
    report: reportValue,
    reportBytes,
    record,
    recordFile: path.join(directory, 'delivery.md'),
    evidenceDirectory: directory,
    surfaceIds: ['sign-in', 'report'],
    paritySurfaces: [],
  };
  try {
    process.env.DELIVERY_REVISION = 'abcdef123456';
    process.env.DELIVERY_LOCAL_PARITY_REVISION = 'abcdef123456';
    process.env.DELIVERY_ASSET_MANIFEST_SHA256 = 'a'.repeat(64);
    const summaryFile = persistEvidence(input);
    const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
    const rawFile = path.join(directory, summary.playwright_report);
    assert.match(path.basename(summaryFile), /^delivery-abcdef123456-[a-f0-9]{12}-live\.json$/);
    assert.match(path.basename(rawFile), /^delivery-abcdef123456-[a-f0-9]{12}-playwright\.json$/);
    assert.deepEqual(fs.readFileSync(rawFile), reportBytes);
    assert.equal(
      crypto.createHash('sha256').update(fs.readFileSync(rawFile)).digest('hex'),
      summary.report_sha256,
    );
    assert.equal(summary.schema_version, '1.1.0');
    assert.throws(() => persistEvidence(input), /already exists/);
  } finally {
    delete process.env.DELIVERY_REVISION;
    delete process.env.DELIVERY_LOCAL_PARITY_REVISION;
    delete process.env.DELIVERY_ASSET_MANIFEST_SHA256;
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('rejects evidence whose delivery record does not pin the runtime revision', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'journey-evidence-'));
  try {
    process.env.DELIVERY_REVISION = 'different123';
    assert.throws(() => persistEvidence({
      report: report('live'),
      reportBytes: Buffer.from('{}'),
      record,
      recordFile: path.join(directory, 'delivery.md'),
      evidenceDirectory: directory,
      surfaceIds: [],
      paritySurfaces: [],
    }), /revision mismatch/);
  } finally {
    delete process.env.DELIVERY_REVISION;
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

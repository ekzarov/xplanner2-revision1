'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { rewrite, scan } = require('./artifact-reference-links');
const { temporaryDirectory } = require('./helpers');

test('preserves canonical and historical Markdown when old architecture paths are pinned', (t) => {
  const root = temporaryDirectory(t, 'artifact-links-alias-');
  const architecture = path.join(root, 'analysis', 'architecture');
  fs.mkdirSync(architecture, { recursive: true });
  fs.writeFileSync(path.join(root, 'analysis', 'target.md'), '# Target\n');
  const content = '# Owner Review\n\nRead `analysis/target.md`.\n';
  for (const name of ['nfr-owner-review.md', 'architecture-nfr-owner-review.md']) {
    fs.writeFileSync(path.join(architecture, name), content);
  }
  fs.writeFileSync(path.join(architecture, 'architecture-nfr-manifest.json'), JSON.stringify({
    files: [{ path: 'nfr-owner-review.md', sha256: '0'.repeat(64) }],
  }));
  assert.equal(scan(root).length, 0);
  assert.deepEqual(rewrite(root), { changedFiles: 0, changedReferences: 0 });
  for (const name of ['nfr-owner-review.md', 'architecture-nfr-owner-review.md']) {
    assert.equal(fs.readFileSync(path.join(architecture, name), 'utf8'), content);
  }
});


test('links existing repository paths but leaves code fences and existing links alone', (t) => {
  const root = temporaryDirectory(t, 'artifact-links-');
  fs.mkdirSync(path.join(root, 'analysis', 'reports'), { recursive: true });
  fs.writeFileSync(path.join(root, 'analysis', 'target.md'), '# Target\n');
  fs.writeFileSync(path.join(root, 'analysis', 'reports', 'report.md'), [
    '# Report',
    '',
    'Read `analysis/target.md`.',
    'Already [`analysis/target.md`](../target.md).',
    '```text',
    '`analysis/target.md`',
    '```',
    '',
  ].join('\n'));

  assert.equal(scan(root).length, 1);
  assert.deepEqual(rewrite(root), { changedFiles: 1, changedReferences: 1 });
  assert.equal(scan(root).length, 0);
  const result = fs.readFileSync(path.join(root, 'analysis', 'reports', 'report.md'), 'utf8');
  assert(result.includes('[`analysis/target.md`](../target.md)'));
  assert(result.includes('```text\n`analysis/target.md`\n```'));
});

test('does not rewrite architecture files pinned by the NFR manifest', (t) => {
  const root = temporaryDirectory(t, 'artifact-links-');
  const architecture = path.join(root, 'analysis', 'architecture');
  fs.mkdirSync(architecture, { recursive: true });
  fs.writeFileSync(path.join(root, 'analysis', 'target.md'), '# Target\n');
  fs.writeFileSync(path.join(architecture, 'architecture.md'), '# Architecture\n\n`analysis/target.md`\n');
  fs.writeFileSync(path.join(architecture, 'architecture-nfr-manifest.json'), JSON.stringify({
    files: [{ path: 'architecture.md', sha256: '0'.repeat(64) }],
  }));

  assert.equal(scan(root).length, 0);
  assert(!fs.readFileSync(path.join(architecture, 'architecture.md'), 'utf8').includes(']('));
});

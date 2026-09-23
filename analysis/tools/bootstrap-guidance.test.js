'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createdFiles } = require('./bootstrap-guidance');
const { linkedDocument, rewrite, scan } = require('./artifact-reference-links');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bootstrap-guidance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'config'));
  fs.writeFileSync(path.join(root, 'config/project.yaml'), 'project_id: example\n');
  const manifest = path.join(root, 'created.json');
  return { root, manifest };
}

test('created manifest contains only existing relative file paths', t => {
  const { root, manifest } = fixture(t);
  fs.writeFileSync(path.join(root, 'README.md'), '# Guide\n');
  fs.writeFileSync(manifest, JSON.stringify(['config/project.yaml', 'README.md']));
  assert.deepEqual([...createdFiles(root, manifest)], ['README.md']);
  for (const entries of [null, {}, [], ['../outside.md'], ['/outside.md'],
    ['C:/outside.md'], ['config\\project.yaml'], ['config//project.yaml'],
    ['config/project.yaml:stream'], ['config'], ['missing.md']]) {
    fs.writeFileSync(manifest, JSON.stringify(entries));
    assert.throws(() => createdFiles(root, manifest));
  }
});

test('initialization links newly created Markdown without rewriting preserved files', t => {
  const { root } = fixture(t);
  const content = '# Guide\n\nRead `config/project.yaml`.\n';
  fs.writeFileSync(path.join(root, 'README.md'), content);
  fs.writeFileSync(path.join(root, 'PREPARATION.md'), content);
  const result = rewrite(root, new Set(['README.md']));
  assert.equal(result.changedFiles, 1);
  assert.match(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), /\]\(\.\/config\/project.yaml\)/);
  assert.equal(fs.readFileSync(path.join(root, 'PREPARATION.md'), 'utf8'), content);
});

test('generated links are idempotent and preserve line endings and code fences', t => {
  const { root } = fixture(t);
  for (const eol of ['\n', '\r\n']) {
    for (const suffix of ['', eol, eol + eol]) {
      const source = ['# Guide', '`config/project.yaml`', '```text', '`config/project.yaml`', '```'].join(eol) + suffix;
      const file = path.join(root, 'README.md');
      const linked = linkedDocument(root, file, source);
      assert.equal(linkedDocument(root, file, linked), linked);
      assert.ok(linked.includes(['```text', '`config/project.yaml`', '```'].join(eol)));
      assert.equal(linked.endsWith('```' + suffix), true);
      if (eol === '\r\n') assert.equal(/(?<!\r)\n/.test(linked), false);
    }
  }
});

test('preserved preparation findings remain visible and only the authorized file is corrected', t => {
  const { root } = fixture(t);
  const content = '# Existing preparation\n\nRead `config/project.yaml`.\n';
  fs.writeFileSync(path.join(root, 'PREPARATION.md'), content);
  fs.mkdirSync(path.join(root, 'legacy'));
  const baseline = path.join(root, 'legacy/README.md');
  fs.writeFileSync(baseline, content);
  rewrite(root, new Set());
  assert.equal(scan(root).length, 2, 'preservation is not audit success or blanket exclusion');
  // Simulate an explicit owner grant for this one editable preparation document.
  rewrite(root, new Set(['PREPARATION.md']));
  assert.deepEqual(scan(root).map(reference => path.relative(root, reference.file).replaceAll('\\', '/')), ['legacy/README.md']);
  assert.equal(fs.readFileSync(baseline, 'utf8'), content, 'immutable input is not rewritten to make a gate green');
});

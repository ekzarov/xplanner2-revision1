'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { auditArtifactNaming } = require('./artifact-naming-audit');

function fixture(t, output) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'artifact-naming-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'analysis/templates'), { recursive: true });
  fs.writeFileSync(path.join(root, 'analysis/templates/walkthrough-NNN-template.md'),
    '# Walkthrough\n\nTemplate output: ' + output);
  fs.writeFileSync(path.join(root, 'analysis/artifact-naming.json'), JSON.stringify([
    { template: 'analysis/templates/walkthrough-NNN-template.md', output },
  ]));
  return root;
}

test('numbered outputs retain the template stem', (t) => {
  const root = fixture(t, 'analysis/stages/stage-03/walkthrough-NNN.md');
  const result = auditArtifactNaming({ root });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('rejects outcome as a new name for a walkthrough template', (t) => {
  const root = fixture(t, 'analysis/stages/stage-03/stage-03-outcome.md');
  assert(auditArtifactNaming({ root }).errors.some((e) => e.includes('preserve filename')));
});

test('requires a mapping for every added template', (t) => {
  const root = fixture(t, 'analysis/stages/stage-03/walkthrough-NNN.md');
  fs.writeFileSync(path.join(root, 'analysis/templates/ui-ux-decision-template.md'), '# Decision');
  assert(auditArtifactNaming({ root }).errors.some((e) => e.includes('no output mapping')));
});

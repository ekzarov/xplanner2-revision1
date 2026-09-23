'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { auditProcessBoundaries, CONTRACT_FILES } = require('./process-boundary-audit');

const root = path.resolve(__dirname, '..', '..');

test('current process preserves architecture and delivery boundaries', () => {
  const result = auditProcessBoundaries({ root });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'process-boundaries-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const file of CONTRACT_FILES) {
    fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
    fs.copyFileSync(path.join(root, file), path.join(directory, file));
  }
  return directory;
}

for (const [name, file, mutate, expected] of [
  ['NFR downstream mutation', 'analysis/migration_methodology.md',
    text => text + '\nStage 15 fills the sdd links in architecture-nfr-manifest.json.\n', /SDD must not add links/],
  ['UI required before implementation', 'analysis/migration_methodology.md',
    text => text + '\nCompare design tokens to the running UI.\n', /Stage 16 checks SDD/],
  ['forbidden delivery task deferral', 'analysis/legacy_user_flows_template_instructions.md',
    text => text + '\nDo not keep a post-deployment reconciliation task open.\n', /permits named delivery tasks/],
  ['premature delivered rows', 'analysis/migration_artifact_flow.drawio',
    text => text.replace('implementation tasks closed;', 'every slice task is closed, the map rows have turned green;'), /falsely claims delivered completion/],
  ['premature final aggregate', 'analysis/migration_artifact_flow.drawio',
    text => text.replace('only after owner-approved final complete', 'before the acceptance signature'), /Final aggregate|Stage 19 diagram/],
  ['missing prototype return', 'analysis/migration_status.schema.json',
    text => {
      const schema = JSON.parse(text);
      function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (node.properties?.from?.const === 'stage-09') node.properties.to.enum = node.properties.to.enum.filter(id => id !== 'stage-06');
        for (const child of Object.values(node)) visit(child);
      }
      visit(schema);
      return JSON.stringify(schema);
    }, /return to stage-06/],
]) {
  test('detects regression: ' + name, t => {
    const directory = fixture(t);
    const absolute = path.join(directory, file);
    const original = fs.readFileSync(absolute, 'utf8');
    const changed = mutate(original);
    assert.notEqual(changed, original, 'mutation must change the fixture');
    fs.writeFileSync(absolute, changed);
    const result = auditProcessBoundaries({ root: directory });
    assert.equal(result.ok, false);
    assert.match(result.errors.join('\n'), expected);
  });
}

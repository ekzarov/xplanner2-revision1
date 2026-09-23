'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { auditStageGates, renderedFiles } = require('./sync-stage-gates');
const { auditPresentationContract } = require('./sync-presentation-structure');
const root = path.resolve(__dirname, '..', '..');
const files = ['MIGRATION.md', 'analysis/migration_methodology.md', 'analysis/migration_methodology.html',
  'analysis/migration_artifact_flow.drawio', 'analysis/artifact-relationship-graph.md',
  'analysis/stage-gates.json', 'analysis/process-contract.md', 'analysis/artifact-responsibilities.json', 'analysis/record-contracts.json', 'analysis/tools/package.json',
  '.github/workflows/starter-audit.yml'];
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'process-gates-'));
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.copyFileSync(path.join(root, file), path.join(dir, file));
  }
  t.after(() => {
    assert.ok(path.resolve(dir).startsWith(path.join(path.resolve(os.tmpdir()), 'process-gates-')));
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return dir;
}
function change(dir, file, transform) {
  const full = path.join(dir, file);
  const old = fs.readFileSync(full, 'utf8');
  const next = transform(old);
  assert.notEqual(next, old, 'Mutation must change ' + file);
  fs.writeFileSync(full, next);
}
test('gate matrices and presentation contracts match the canonical records', () => {
  for (const audit of [auditStageGates, auditPresentationContract]) {
    const result = audit({ root });
    assert.equal(result.ok, true, result.errors.join('\n'));
  }
});
test('matrix rendering is idempotent and preserves surrounding documents', t => {
  const dir = fixture(t);
  for (const [file, text] of renderedFiles(dir)) fs.writeFileSync(path.join(dir, file), text);
  const once = new Map(renderedFiles(dir));
  for (const [file, text] of renderedFiles(dir)) assert.equal(text, once.get(file));
  assert.equal(auditStageGates({ root: dir }).ok, true);
});
for (const file of ['MIGRATION.md', 'analysis/migration_methodology.md', 'analysis/migration_methodology.html', 'analysis/migration_artifact_flow.drawio']) {
  test('rejects a missing gate condition in ' + file, t => {
    const dir = fixture(t);
    change(dir, file, text => text.replaceAll('runtime.target_platforms', 'runtime.unchecked'));
    assert.equal(auditStageGates({ root: dir }).ok, false);
  });
}
test('slice acceptance cannot quietly become a global-completion check', t => {
  const dir = fixture(t);
  change(dir, 'analysis/tools/package.json', text => {
    const data = JSON.parse(text);
    data.scripts['audit:stage19'] += ' && npm run audit:acceptance';
    return JSON.stringify(data);
  });
  assert.ok(auditPresentationContract({ root: dir }).errors.some(error => error.includes('must not require global')));
});
test('final completion cannot lose the strict acceptance audit', t => {
  const dir = fixture(t);
  change(dir, 'analysis/tools/package.json', text => {
    const data = JSON.parse(text);
    data.scripts['audit:all'] = 'npm run audit:stage19';
    return JSON.stringify(data);
  });
  assert.ok(auditPresentationContract({ root: dir }).errors.some(error => error.includes('Final aggregate')));
});
test('CI must run the Stage 19 aggregate before global complete', t => {
  const dir = fixture(t);
  change(dir, '.github/workflows/starter-audit.yml', text => text.replace("elseif ($stageNumber -eq 19) { Invoke-Audit 'audit:stage19' }", ''));
  assert.ok(auditPresentationContract({ root: dir }).errors.some(error => error.includes('CI must separate')));
});
test('green checks do not conceal a missing expected/observed contract', t => {
  const dir = fixture(t);
  change(dir, 'analysis/migration_methodology.html', text => text.replaceAll('Actual observation and evidence for each check', 'Conclusion only'));
  assert.ok(auditPresentationContract({ root: dir }).errors.some(error => error.includes('missing record contract review')));
});
test('rejects stale record names inside Mermaid text', t => {
  const dir = fixture(t);
  change(dir, 'analysis/artifact-relationship-graph.md', text => text.replace('stage-18/delivery-NNN.md', 'stage-18/&lt;slice&gt;-delivery.md'));
  assert.equal(auditPresentationContract({ root: dir }).ok, false);
});
test('rejects wrong language and divergent overview stage names', t => {
  const dir = fixture(t);
  change(dir, 'analysis/migration_methodology.html', text => text.replace('<html lang="en">', '<html lang="ru">').replace('>Design: SDD</span>', '>Design</span>'));
  assert.equal(auditPresentationContract({ root: dir }).ok, false);
});

test('rejects an arbitrary filename typo in the Mermaid delivery node', t => {
  const dir = fixture(t);
  change(dir, 'analysis/artifact-relationship-graph.md', text => text.replaceAll('delivery-NNN.md', 'delivery-record-NNN.md'));
  assert.ok(auditPresentationContract({ root: dir }).errors.some(error => error.includes('Mermaid delivery node')));
});

test('CI cannot silently drop direct link checking', t => {
  const dir = fixture(t);
  change(dir, '.github/workflows/starter-audit.yml', text => text.replace('npm --prefix analysis/tools run audit:artifact-links', ''));
  assert.ok(auditPresentationContract({ root: dir }).errors.some(error => error.includes('artifact links directly')));
});

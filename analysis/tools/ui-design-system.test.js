'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { AuditResult, sha256File } = require('./lib');
const { temporaryDirectory } = require('./helpers');
const { writeUiFixture } = require('./ui-design-system-fixtures');
const { auditUiDesignSystem, auditUiControlBindings, validateTokens, foundationHash } = require('./ui-design-system');

function fixture(t) {
  const root = temporaryDirectory(t, 'ui-system-');
  const directory = path.join(root, 'analysis', 'prototyping');
  fs.mkdirSync(directory, { recursive: true });
  const manifest = writeUiFixture(directory, { screens: [{ id: 'edit', files: [] }] });
  const run = () => { const result = new AuditResult('UI'); const ui = auditUiDesignSystem(manifest, directory, result); return { result, ui }; };
  return { root, directory, manifest, run };
}

test('UI kit resolves pinned tokens, catalogue, resources and screen variants', t => {
  const f = fixture(t), { result, ui } = f.run();
  assert.deepEqual(result.errors, []);
  assert(ui.variants.has('button.primary'));
  assert(ui.resources.has('wireframes/components.html'));
});

for (const file of ['ui-design-system.md', 'ui-design-tokens.json', 'wireframes/components.html']) {
  test(`UI kit rejects changed source bytes: ${file}`, t => {
    const f = fixture(t);
    fs.appendFileSync(path.join(f.directory, file), '\n');
    assert(f.run().result.errors.some(error => error.includes('hash mismatch')));
  });
}

test('UI kit cannot change the Stage 5 foundation by merely refreshing its manifest hash', t => {
  const f = fixture(t), file = path.join(f.directory, 'ui-design-tokens.json');
  const tokens = JSON.parse(fs.readFileSync(file));
  tokens.foundation.tokens['color.action'].value = '#FF0000';
  fs.writeFileSync(file, JSON.stringify(tokens));
  f.manifest.ui_design_system.tokens.sha256 = sha256File(file);
  assert(f.run().result.errors.some(error => error.includes('UI foundation SHA-256')));
});

test('foundation digest is stable across object ordering', () => {
  assert.equal(foundationHash({ b: 2, a: { d: 4, c: 3 } }), foundationHash({ a: { c: 3, d: 4 }, b: 2 }));
});

for (const [name, change, expected] of [
  ['missing alias', r => { r.extensions['button.background'].value = '{missing.token}'; }, 'unknown UI token'],
  ['alias cycle', r => { r.extensions['button.background'].value = '{button.background}'; }, 'alias cycle'],
  ['alias type', r => { r.extensions['button.background'].value = '{font.body}'; }, 'type mismatch'],
  ['foundation override', r => { r.extensions['color.action'] = { type: 'color', value: '#FF0000' }; }, 'overrides'],
  ['foundation depends on extension', r => { r.foundation.tokens['color.action'].value = '{button.background}'; }, 'depends on an extension'],
  ['invalid value', r => { r.foundation.tokens['color.action'].value = 'red-ish'; }, 'invalid color'],
]) {
  test(`UI tokens reject ${name}`, t => {
    const f = fixture(t), r = JSON.parse(fs.readFileSync(path.join(f.directory, 'ui-design-tokens.json')));
    change(r);
    const result = new AuditResult('tokens');
    validateTokens(r, result);
    assert(result.errors.some(error => error.includes(expected)), result.errors.join('\n'));
  });
}

for (const [name, change, expected] of [
  ['missing kit', m => { delete m.ui_design_system; }, 'requires ui_design_system'],
  ['null visual kit', m => { m.ui_design_system = null; }, 'Visual screens require'],
  ['missing variants', m => { delete m.screens[0].ui_variants; }, 'requires unique'],
  ['unknown variant', m => { m.screens[0].ui_variants = ['input.unknown']; }, 'unknown UI variant'],
  ['duplicate resource', m => { m.ui_design_system.resources.push(m.ui_design_system.resources[0]); }, 'Duplicate UI resource'],
  ['traversal', m => { m.ui_design_system.resources[0].path = 'wireframes/../ui-design-system.md'; }, 'Non-canonical'],
  ['resource as screen', m => { m.screens[0].files = [m.ui_design_system.resources[0]]; }, 'business screen'],
]) {
  test(`UI manifest rejects ${name}`, t => {
    const f = fixture(t); change(f.manifest);
    assert(f.run().result.errors.some(error => error.includes(expected)), f.run().result.errors.join('\n'));
  });
}

test('entirely non-visual scope does not require a fake UI kit', t => {
  const f = fixture(t);
  f.manifest.screens = []; f.manifest.ui_design_system = null;
  assert.deepEqual(f.run().result.errors, []);
});

test('SDD controls must use variants declared by their approved screen', t => {
  const f = fixture(t), { result, ui } = f.run();
  auditUiControlBindings([['edit', 'Save', 'input.unknown']], f.manifest, ui, result, 'slice');
  assert(result.errors.some(error => error.includes('approved UI variant')));
});

test('version downgrade cannot bypass the kit without an exact historical pin', t => {
  const f = fixture(t);
  f.manifest.schema_version = 3; delete f.manifest.ui_design_system; delete f.manifest.screens[0].ui_variants;
  assert.equal(f.run().result.ok, false);
  fs.writeFileSync(path.join(f.directory, 'screen-manifest.json'), JSON.stringify(f.manifest));
  fs.writeFileSync(path.join(f.directory, 'ui-ux-approval.md'), '# Previously approved\n');
  fs.mkdirSync(path.join(f.root, 'config'));
  const pin = { source_revision: 'a'.repeat(40), recorded_by: 'process maintainer', reason: 'Keep exact previously approved bytes' };
  for (const [key, file] of [['manifest_sha256', 'screen-manifest.json'], ['approval_sha256', 'ui-ux-approval.md'], ['decision_sha256', 'ui-ux-decision.md']]) pin[key] = sha256File(path.join(f.directory, file));
  fs.writeFileSync(path.join(f.root, 'config/project.yaml'), JSON.stringify({ prototype_compatibility: pin }));
  assert.equal(f.run().result.ok, true);
  fs.appendFileSync(path.join(f.directory, 'ui-ux-approval.md'), 'changed');
  assert.equal(f.run().result.ok, false);
});

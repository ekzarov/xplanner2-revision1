'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { temporaryDirectory } = require('./helpers');
const { runVisualParity } = require('./ui-parity-audit');
const { writeUiFixture } = require('./ui-design-system-fixtures');

function fixture(t, command, minimumSimilarity = 95) {
  const root = temporaryDirectory(t, 'ui-parity-');
  fs.mkdirSync(path.join(root, 'config'), { recursive: true });
  fs.mkdirSync(path.join(root, 'analysis', 'prototyping'), { recursive: true });
  fs.mkdirSync(path.join(root, 'specs', '001-test-slice'), { recursive: true });
  const manifestFile = path.join(root, 'analysis', 'prototyping', 'screen-manifest.json');
  const wireframes = path.join(root, 'analysis', 'prototyping', 'wireframes');
  fs.mkdirSync(wireframes, { recursive: true });
  const wireframeFile = path.join(wireframes, 'test-screen.html');
  fs.writeFileSync(wireframeFile, '<a class="hover:underline">approved screen</a><span>—</span>');
  const screenHash = crypto.createHash('sha256').update(fs.readFileSync(wireframeFile)).digest('hex');
  fs.writeFileSync(manifestFile, JSON.stringify(writeUiFixture(path.dirname(manifestFile), { export_set_version: 'prototype-001', screens: [{ id: 'test-screen', files: [{ path: 'wireframes/test-screen.html', sha256: screenHash }] }] })));
  const hash = crypto.createHash('sha256').update(fs.readFileSync(manifestFile)).digest('hex');
  fs.writeFileSync(path.join(root, 'analysis', 'prototyping', 'ui-ux-approval.md'), [
    '- Approved export set version: prototype-001',
    `- Screen manifest SHA-256: ${hash}`,
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), [
    'commands:',
    '  visual_parity:',
    `    command: ${command === null ? 'null' : JSON.stringify(command)}`,
    "    working_directory: '.'",
    ...(minimumSimilarity === null ? [] : [`    minimum_similarity_percent: ${minimumSimilarity}`]),
    '    required_environment: []',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'analysis', 'migration_status.yaml'), [
    'delivery:',
    '  active_slice: 001-test-slice',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'specs', 'README.md'), [
    'Feature dependency checks required from feature sequence: 999',
    '- **Impact-scoped verification required from feature sequence**: 001',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'specs', '001-test-slice', 'spec.md'), [
    '## Change Impact and Verification Scope',
    '',
    '- Verification mode: delta',
    '- Baseline: prototype-001',
    '- Trigger assessment: none',
    '- Selected checks: active slice surfaces',
    '- Excluded checks: unrelated delivered slices, evidenced by unchanged contracts',
    '- Re-entry triggers: shared shell or unknown blast radius expands scope',
    '',
    '## Approved Prototype Contract',
    '',
    '- UI impact: yes',
    '- Minimum visual similarity: 95%',
    '',
    '| Screen | Export SHA-256 | Responsibility |',
    '|---|---|---|',
    `| test-screen | ${screenHash} | fixture |`,
    '',
    '## Binding Visual Style Checks',
    '',
    '| Screen | Category | Element/state | Approved value | Automated assertion |',
    '|---|---|---|---|---|',
    '| test-screen | typography | primary label | weight 500 | computed font-weight |',
    '| test-screen | component geometry | primary control | height 36px | computed height |',
    '| test-screen | palette | primary control | approved blue | computed background-color |',
    '| test-screen | spacing | content row | 16px vertical | computed padding |',
    '| test-screen | states | selected item, pre-interaction baseline and link hover | approved pre-interaction and hover states | pre-interaction computed-style and automated hover assertion |',
    '| test-screen | iconography | primary icon | approved icon id | DOM icon assertion |',
    '| test-screen | content fidelity | populated and missing values | exact source copy and placeholder — | browser asserts representative values and — |',
    '',
    '## Requirements',
  ].join('\n'));
  return { root, manifestFile };
}

test('runs the configured fail-closed parity command with approved source provenance', (t) => {
  const command = 'node -e "const c=JSON.parse(process.env.UI_APPROVED_SURFACE_CONTRACTS); const s=JSON.parse(process.env.UI_APPROVED_STYLE_CONTRACTS); process.exit(process.env.UI_PARITY_MIN_SIMILARITY_PERCENT === \'95\' && c[0].path.endsWith(\'test-screen.html\') && s.length === 7 ? 0 : 9)"';
  const { root } = fixture(t, command);
  const result = runVisualParity({ root, capture: true });
  assert.equal(result.ok, true, result.errors.join(' '));
});

test('rejects an approved wireframe whose bytes no longer match the manifest', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  fs.appendFileSync(path.join(root, 'analysis', 'prototyping', 'wireframes', 'test-screen.html'), ' drift');
  assert(runVisualParity({ root, capture: true }).errors.some((error) => error.includes('file hash drifted')));
});

test('rejects a missing or weakened visual similarity floor', (t) => {
  for (const value of [null, 94, 101]) {
    const result = runVisualParity({ root: fixture(t, 'node -e "process.exit(0)"', value).root, capture: true });
    assert(result.errors.some((error) => error.includes('minimum_similarity_percent')));
  }
});

test('rejects an SDD visual floor that differs from the project contract', (t) => {
  const result = runVisualParity({ root: fixture(t, 'node -e "process.exit(0)"', 96).root, capture: true });
  assert(result.errors.some((error) => error.includes('Minimum visual similarity: 96%')));
});

test('rejects a UI slice without a complete binding style contract', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  const spec = path.join(root, 'specs', '001-test-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace('| test-screen | typography | primary label | weight 500 | computed font-weight |\n', ''));
  const result = runVisualParity({ root, capture: true });
  assert(result.errors.some((error) => error.includes('must bind typography')));
});

test('rejects a generic states row when the approved source declares hover', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  const spec = path.join(root, 'specs', '001-test-slice', 'spec.md');
  fs.writeFileSync(
    spec,
    fs.readFileSync(spec, 'utf8').replace(
      '| test-screen | states | selected item, pre-interaction baseline and link hover | approved pre-interaction and hover states | pre-interaction computed-style and automated hover assertion |',
      '| test-screen | states | selected item | approved selected state | browser state assertion |',
    ),
  );
  const result = runVisualParity({ root, capture: true });
  assert(result.errors.some((error) => error.includes('source-declared hover')));
  assert(result.errors.some((error) => error.includes('automated hover assertion')));
});

test('rejects hover coverage that omits the pre-interaction computed state', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  const spec = path.join(root, 'specs', '001-test-slice', 'spec.md');
  fs.writeFileSync(
    spec,
    fs.readFileSync(spec, 'utf8').replace(
      '| test-screen | states | selected item, pre-interaction baseline and link hover | approved pre-interaction and hover states | pre-interaction computed-style and automated hover assertion |',
      '| test-screen | states | selected item and link hover | approved hover state | automated hover assertion |',
    ),
  );
  const result = runVisualParity({ root, capture: true });
  assert(result.errors.some((error) => error.includes('pre-interaction baseline')));
  assert(result.errors.some((error) => error.includes('computed style before hover')));
});

test('rejects a content row that omits a source-declared standalone placeholder', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  const spec = path.join(root, 'specs', '001-test-slice', 'spec.md');
  fs.writeFileSync(
    spec,
    fs.readFileSync(spec, 'utf8').replace(
      '| test-screen | content fidelity | populated and missing values | exact source copy and placeholder — | browser asserts representative values and — |',
      '| test-screen | content fidelity | populated values | exact source copy | browser asserts representative values |',
    ),
  );
  const result = runVisualParity({ root, capture: true });
  assert(result.errors.some((error) => error.includes('source-declared placeholder —')));
});

test('governs every exact UI-correction surface, not only the active slice', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  fs.mkdirSync(path.join(root, 'specs', '002-corrected-slice'), { recursive: true });
  const activeSpec = fs.readFileSync(path.join(root, 'specs', '001-test-slice', 'spec.md'), 'utf8');
  fs.writeFileSync(
    path.join(root, 'specs', '002-corrected-slice', 'spec.md'),
    activeSpec.replace('| test-screen | typography | primary label | weight 500 | computed font-weight |\n', ''),
  );
  fs.appendFileSync(
    path.join(root, 'analysis', 'migration_status.yaml'),
    "\n  ui_parity_corrections:\n    - 002-corrected-slice#test-screen\n",
  );
  const result = runVisualParity({ root, capture: true });
  assert(result.errors.some((error) => error.includes('002-corrected-slice/spec.md must bind typography')));
});

test('does not recheck an unrelated delivered UI slice in delta mode', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  fs.mkdirSync(path.join(root, 'specs', '002-delivered-slice'), { recursive: true });
  const activeSpec = fs.readFileSync(path.join(root, 'specs', '001-test-slice', 'spec.md'), 'utf8');
  fs.writeFileSync(
    path.join(root, 'specs', '002-delivered-slice', 'spec.md'),
    activeSpec.replace('| test-screen | typography | primary label | weight 500 | computed font-weight |\n', ''),
  );
  fs.appendFileSync(
    path.join(root, 'analysis', 'migration_status.yaml'),
    "\n  delivered_ui_slices:\n    - 002-delivered-slice\n",
  );
  const result = runVisualParity({ root, capture: true });
  assert.equal(result.ok, true, result.errors.join(' '));
});

test('rechecks every delivered UI slice when the SDD declares full mode', (t) => {
  const { root } = fixture(t, 'node -e "process.exit(0)"');
  fs.mkdirSync(path.join(root, 'specs', '002-delivered-slice'), { recursive: true });
  const activeSpecFile = path.join(root, 'specs', '001-test-slice', 'spec.md');
  const activeSpec = fs.readFileSync(activeSpecFile, 'utf8');
  fs.writeFileSync(activeSpecFile, activeSpec.replace('- Verification mode: delta', '- Verification mode: full').replace('- Trigger assessment: none', '- Trigger assessment: scheduled full checkpoint'));
  fs.writeFileSync(
    path.join(root, 'specs', '002-delivered-slice', 'spec.md'),
    activeSpec.replace('| test-screen | typography | primary label | weight 500 | computed font-weight |\n', ''),
  );
  fs.appendFileSync(
    path.join(root, 'analysis', 'migration_status.yaml'),
    "\n  delivered_ui_slices:\n    - 002-delivered-slice\n",
  );
  const result = runVisualParity({ root, capture: true });
  assert(result.errors.some((error) => error.includes('002-delivered-slice/spec.md must bind typography')));
});

test('rejects an absent command and a failing command', (t) => {
  assert.equal(runVisualParity({ root: fixture(t, null).root, capture: true }).ok, false);
  const failed = runVisualParity({ root: fixture(t, 'node -e "process.exit(7)"').root, capture: true });
  assert(failed.errors.some((error) => error.includes('code 7')));
});

test('rejects drift from the owner-approved manifest', (t) => {
  const { root, manifestFile } = fixture(t, 'node -e "process.exit(0)"');
  fs.appendFileSync(manifestFile, '\n');
  assert(runVisualParity({ root, capture: true }).errors.some((error) => error.includes('manifest hash')));
});


test('passes the pinned shared UI sources to the configured runner and rejects drift', (t) => {
  const { root } = fixture(t, 'node -e "const k=JSON.parse(process.env.UI_APPROVED_DESIGN_SYSTEM);process.exit(k.tokens.path === \'ui-design-tokens.json\' && process.env.UI_DESIGN_SYSTEM_ROOT ? 0 : 9)"');
  assert.equal(runVisualParity({ root, capture: true }).ok, true);
  fs.appendFileSync(path.join(root, 'analysis/prototyping/ui-design-tokens.json'), '\n');
  assert(runVisualParity({ root, capture: true }).errors.some(error => error.includes('hash mismatch')));
});

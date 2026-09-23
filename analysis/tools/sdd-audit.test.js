'use strict';
const { writeUiFixture } = require('./ui-design-system-fixtures');

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const test = require('node:test');
const { auditSdd, traceabilityRequirements } = require('./sdd-audit');
const { temporaryDirectory } = require('./helpers');

function writeFeature(root, slug = '001-first-slice', tasks = '- [x] T001 Deliver the slice.\n') {
  const directory = path.join(root, slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'spec.md'), [
    '# Specification',
    '## User Scenarios and Testing',
    '### User Story 1 - Complete useful work',
    'Given an authorized user, When work is submitted, Then the result is recorded.',
    '## Approved Prototype Contract',
    '- UI impact: no',
    '- Reason: This fixture exercises a non-visual service contract.',
    '## Owner-Reviewed Implementation Assumptions',
    '- Review status: Approved',
    '- Reviewed by: fixture-owner',
    '- Review date: 2026-08-26',
    '- Assumption outcome: assumptions-recorded',
    '| Assumption ID | Agent proposal | Basis and uncertainty | Implementation impact | Owner disposition | Final decision |',
    '|---|---|---|---|---|---|',
    '| ASM-001 | Use the stable application boundary. | Existing architecture; low uncertainty. | Shapes the service entry point. | approved-as-proposed | Use the stable application boundary. |',
    '## Change Impact and Verification Scope',
    '- Completion dependencies: none',
    '- Verification mode: delta',
    '- Baseline: accepted slice 000 and current governed artifacts',
    '- Trigger assessment: none; no shared contract changes',
    '- Selected checks: feature unit, contract, and changed-surface checks',
    '- Excluded checks: unrelated flows; no dependency path from this change',
    '- Re-entry triggers: expand when a shared boundary or unknown dependency is found',
    '| Dimension | Direct change | Dependents / regression scope | Evidence |',
    '|---|---|---|---|',
    '| Parity map and decisions | Row 7 | No other rows; bounded behavior | traceability.md |',
    '| Architecture and knowledge | Existing boundary only | No ADR changes | plan.md |',
    '| Backend and contracts | Stable service entry | Direct API consumer | contract test |',
    '| Data and background work | One owned record | No jobs or shared data | integration test |',
    '| Security and permissions | Existing authorization | Authorized actor path | security test |',
    '| UI and shared design system | No UI change | No shared UI dependency | spec declaration |',
    '| Deployment and operations | Existing deployment unit | Changed endpoint smoke | smoke plan |',
    '## Requirements',
    '- **FR-001**: The system MUST record the submitted work.',
  ].join('\n'));
  fs.writeFileSync(path.join(directory, 'plan.md'), [
    '# Plan',
    '## Technical Context',
    'FR-001 is delivered through a stable application boundary.',
    '## Owner-Reviewed Assumption Binding',
    '| Assumption ID | Plan consequence |',
    '|---|---|',
    '| ASM-001 | The service enters through the stable application boundary. |',
    '## Impact-Scoped Verification Plan',
    '- Verification mode: delta',
    '- Selected checks: feature unit, contract, integration, and changed-surface checks',
    '- Excluded checks: unrelated flows with no dependency path in the spec impact table',
    '- Expansion conditions: shared contract, schema, security, UI system, deployment, or unknown blast radius',
    '## Design',
    'The service owns validation and persistence.',
  ].join('\n'));
  fs.writeFileSync(path.join(directory, 'tasks.md'), `# Tasks\n\n${tasks}`);
  fs.writeFileSync(path.join(root, 'traceability.md'), [
    '# Traceability',
    '## Slice Verification Index',
    '| Feature | SDD | Verification plan | Recorded evidence | Evidence state |',
    '|---|---|---|---|---|',
    `| ${slug} | [spec](${slug}/spec.md), [plan](${slug}/plan.md), [tasks](${slug}/tasks.md) | [checks](${slug}/plan.md) | - | planned |`,
    '## Parity Map Delivery Contracts',
    '| Feature | Scope | Deliver rows | Deferred rows | Owner decision |',
    '|---|---|---|---|---|',
    `| ${slug} | legacy-backed | 7 | - | - |`,
    '## Legacy and Approved-Change Coverage',
    '| Parity-map rows | Source evidence | Feature/spec requirements |',
    '|---|---|---|',
    `| 7 | legacy/source.cbl:1 | ${slug}/spec.md FR-001 |`,
    '## Target-Only Requirements',
    '| Target requirement | Owner decision | Feature/spec requirements |',
    '|---|---|---|',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'README.md'), [
    '- **Owner-reviewed assumptions required from feature sequence**: 001',
    'Feature dependency checks required from feature sequence: 999',
    '- **Impact-scoped verification required from feature sequence**: 001',
    '',
  ].join('\n'));
}

test('rejects a missing, incomplete, or under-declared impact scope', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root);
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8')
    .replace('- Verification mode: delta', '- Verification mode: expanded')
    .replace('| Backend and contracts | Stable service entry | Direct API consumer | contract test |', ''));
  const result = await auditSdd({ root });
  assert(result.errors.some((error) => error.includes('must name the trigger')));
  assert(result.errors.some((error) => error.includes('missing dimension backend and contracts')));
});

test('rejects a plan whose impact mode disagrees with the specification', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root);
  const plan = path.join(root, '001-first-slice', 'plan.md');
  fs.writeFileSync(plan, fs.readFileSync(plan, 'utf8').replace(
    '## Impact-Scoped Verification Plan\n- Verification mode: delta',
    '## Impact-Scoped Verification Plan\n- Verification mode: full'));
  const result = await auditSdd({ root });
  assert(result.errors.some((error) => error.includes('Verification mode must match spec.md')));
});

test('imported old manifest identifiers do not count as requirement coverage', () => {
  const traceability = [
    '## Imported Legacy References',
    '```json',
    JSON.stringify({original_rows: [{row: 21, requirement: 'FR-021', tests: ['rejects_empty_duration']}]}),
    '```',
    '**Disposition:** unverified; Stage 15 must reconcile FR-021.',
    '## Legacy and Approved-Change Coverage',
    '| Parity-map rows | Source evidence | Feature/spec requirements |',
    '|---|---|---|',
    '| 7 | legacy/source.cbl:1 | 001-first-slice/spec.md FR-001 |',
  ].join('\n');
  assert.deepEqual([...traceabilityRequirements(traceability)], ['FR-001']);
});

test('accepts a closed feature set with traceability', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  assert.equal((await auditSdd({ root })).ok, true);
});

test('accepts open tasks while auditing a design-ready SDD', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [ ] T001 [FR-001] Deliver the slice.\n');
  assert.equal((await auditSdd({ root })).ok, true);
});

test('slice completion isolates unrelated plans but includes declared dependencies; final completion remains global', async (t) => {
  const workspace = temporaryDirectory(t, 'sdd-slice-completion-');
  const root = path.join(workspace, 'specs');
  fs.mkdirSync(root);
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver first slice.\n');
  const first = fs.readFileSync(path.join(root, 'traceability.md'), 'utf8');
  writeFeature(root, '002-next-slice', '- [ ] T001 [FR-001] Deliver future slice.\n');
  const second = fs.readFileSync(path.join(root, 'traceability.md'), 'utf8');
  const rows = second.split('\n').filter(line => line.startsWith('| 002-next-slice') || line.startsWith('| 7 | legacy/'));
  let joined = first.replace(/^(\| 001-first-slice .*\| planned \|)$/m, '$1\n' + rows[0]);
  joined = joined.replace('| 001-first-slice | legacy-backed | 7 | - | - |', '| 001-first-slice | legacy-backed | 7 | - | - |\n' + rows[1]);
  joined = joined.replace('## Target-Only Requirements', rows[2] + '\n## Target-Only Requirements');
  joined = joined.replace('| - | planned |', '| [execution](001-first-slice/execution.md) | recorded |');
  fs.writeFileSync(path.join(root, 'traceability.md'), joined);
  fs.writeFileSync(path.join(root, '001-first-slice/execution.md'), '# Results\nExact observed execution results.');
  fs.mkdirSync(path.join(workspace, 'analysis'));
  fs.writeFileSync(path.join(workspace, 'analysis/migration_status.yaml'), 'delivery:\n  active_slice: 001-first-slice\n');
  const ExcelJS = require('@excel.js/exceljs').default;
  const workbook = new ExcelJS.Workbook();
  const row = workbook.addWorksheet('User Flows').getRow(7);
  for (const [column, value] of [[4, 'Submit work'], [9, 'Yes'], [10, 'Observed'], [11, 'execution.md'], [12, 'Yes'], [13, 'No'], [14, 'spec.md']]) row.getCell(column).value = value;
  await workbook.xlsx.writeFile(path.join(workspace, 'analysis/legacy_user_flows.xlsx'));
  const scoped = await auditSdd({ root, requireSliceCompletion: true });
  assert.equal(scoped.ok, true, scoped.errors.join('\n'));
  const final = await auditSdd({ root, requireCompletion: true });
  assert(final.errors.some(error => error.includes('002-next-slice/tasks.md contains')));
  assert(final.errors.some(error => error.includes('002-next-slice completion requires')));
  const specFile = path.join(root, '001-first-slice/spec.md');
  const spec = fs.readFileSync(specFile, 'utf8');
  fs.writeFileSync(specFile, spec.replace('Completion dependencies: none', 'Completion dependencies: 002-next-slice'));
  const dependent = await auditSdd({ root, requireSliceCompletion: true });
  assert(dependent.errors.some(error => error.includes('002-next-slice/tasks.md contains')));
  fs.writeFileSync(specFile, spec.replace('Completion dependencies: none', 'Completion dependencies: 999-unknown'));
  assert((await auditSdd({ root, requireSliceCompletion: true })).errors.some(error => error.includes('unknown slice')));
  fs.writeFileSync(specFile, spec.replace('- Completion dependencies: none\n', ''));
  assert((await auditSdd({ root, requireSliceCompletion: true })).errors.some(error => error.includes('exactly one Completion')));
  fs.writeFileSync(path.join(workspace, 'analysis/migration_status.yaml'), 'delivery: {}\n');
  assert((await auditSdd({ root, requireSliceCompletion: true })).errors.some(error => error.includes('missing active_slice')));
});

test('reading markers do not block SDD but real placeholders still do', async (t) => {
  const root = temporaryDirectory(t, 'sdd-reading-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const file = path.join(root, 'traceability.md');
  fs.appendFileSync(file, '\n<!-- ARTIFACT_READING_START: <scope> -->\n');
  assert.equal((await auditSdd({ root })).ok, true);
  fs.appendFileSync(file, '\nScope: <exact scope>\n');
  assert((await auditSdd({ root })).errors.some(error => error.includes('placeholder')));
});

test('accepts an explicitly owner-confirmed no-assumptions outcome', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(
    '- Assumption outcome: assumptions-recorded\n| Assumption ID | Agent proposal | Basis and uncertainty | Implementation impact | Owner disposition | Final decision |\n|---|---|---|---|---|---|\n| ASM-001 | Use the stable application boundary. | Existing architecture; low uncertainty. | Shapes the service entry point. | approved-as-proposed | Use the stable application boundary. |',
    '- Assumption outcome: no-assumptions'));
  const plan = path.join(root, '001-first-slice', 'plan.md');
  fs.writeFileSync(plan, fs.readFileSync(plan, 'utf8').replace(
    '| Assumption ID | Plan consequence |\n|---|---|\n| ASM-001 | The service enters through the stable application boundary. |',
    '- No implementation assumptions apply.'));
  assert.equal((await auditSdd({ root })).ok, true);
});

test('rejects a plan that drops or invents owner-reviewed assumptions', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const plan = path.join(root, '001-first-slice', 'plan.md');
  fs.writeFileSync(plan, fs.readFileSync(plan, 'utf8').replace('ASM-001', 'ASM-999'));
  const result = await auditSdd({ root });
  assert(result.errors.some((error) => error.includes('does not bind owner-reviewed assumption ASM-001')));
  assert(result.errors.some((error) => error.includes('ASM-999 absent from the owner-reviewed spec table')));
});

test('rejects pending, incomplete, or unreviewed implementation assumptions', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root);
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8')
    .replace('- Review status: Approved', '- Review status: Pending')
    .replace('approved-as-proposed | Use the stable application boundary.', 'pending |'));
  const result = await auditSdd({ root });
  assert(result.errors.some((error) => error.includes('Review status must be Approved')));
  assert(result.errors.some((error) => error.includes('owner disposition')));
  assert(result.errors.some((error) => error.includes('incomplete decision record')));
});

test('grandfathers earlier feature sequences but governs reopened slices', async (t) => {
  const workspace = temporaryDirectory(t, 'sdd-audit-');
  const root = path.join(workspace, 'specs');
  fs.mkdirSync(root);
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  fs.writeFileSync(path.join(root, 'README.md'), [
    '- **Owner-reviewed assumptions required from feature sequence**: 002',
    'Feature dependency checks required from feature sequence: 999',
    '- **Impact-scoped verification required from feature sequence**: 002',
    '',
  ].join('\n'));
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(/## Owner-Reviewed Implementation Assumptions[\s\S]*?(?=## Requirements)/, ''));
  assert.equal((await auditSdd({ root })).ok, true);
  fs.mkdirSync(path.join(workspace, 'analysis'), { recursive: true });
  fs.writeFileSync(path.join(workspace, 'analysis', 'migration_status.yaml'), [
    'delivery:',
    '  reopened_slices:',
    '    - slice: 001-first-slice',
    '      status: open',
  ].join('\n'));
  assert((await auditSdd({ root })).errors.some((error) => error.includes('Owner-Reviewed Implementation Assumptions')));
});

test('fails open tasks when implementation completion is required', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [ ] T001 [FR-001] Deliver the slice.\n');
  const result = (await auditSdd({ root, requireCompletion: true }));
  assert(result.errors.some((error) => error.includes('incomplete task')));
});

test('rejects Stage 18 deployment evidence embedded in SDD tasks', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Record a deployed public desktop/mobile journey.\n');
  const result = await auditSdd({ root });
  assert(result.errors.some((error) => error.includes('candidate boundary')));
});

test('fails when traceability or a required artifact is absent', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root);
  fs.rmSync(path.join(root, 'traceability.md'));
  fs.rmSync(path.join(root, '001-first-slice', 'plan.md'));
  const result = (await auditSdd({ root }));
  assert(result.errors.some((error) => error.includes('traceability.md')));
  assert(result.errors.some((error) => error.includes('plan.md')));
});

test('fails when no numbered feature exists', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  fs.writeFileSync(path.join(root, 'traceability.md'), '# Traceability\n');
  assert((await auditSdd({ root })).errors.some((error) => error.includes('numbered feature')));
});

test('rejects shallow artifacts and traceability that only mentions a feature slug', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  fs.writeFileSync(path.join(root, '001-first-slice', 'spec.md'), '# Spec\n\nFR-001\n');
  fs.writeFileSync(path.join(root, 'traceability.md'), [
    '# Traceability',
    '## Legacy and Approved-Change Coverage',
    '- 001-first-slice',
    '## Target-Only Requirements',
  ].join('\n'));
  const result = (await auditSdd({ root }));
  assert(result.errors.some((error) => error.includes('too shallow')));
  assert(result.errors.some((error) => error.includes('does not map')));
});

test('detects TODO, TBD, and token placeholders without rejecting HTML tags', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const plan = path.join(root, '001-first-slice', 'plan.md');
  fs.appendFileSync(plan, '\n<div class="architecture">Rendered architecture</div>\n');
  assert.equal((await auditSdd({ root })).ok, true);
  fs.appendFileSync(plan, '\nTBD: {{OWNER}}\n');
  assert((await auditSdd({ root })).errors.some((error) => error.includes('placeholder')));
});

test('does not mistake comparison operators for template placeholders', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.appendFileSync(spec, '\nVisual controls use font-weight <= 600 and response time < 1 second.\n');
  assert.equal((await auditSdd({ root })).ok, true);
});

test('rejects a missing UI impact declaration', async (t) => {
  const root = temporaryDirectory(t, 'sdd-audit-');
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(
    '## Approved Prototype Contract\n- UI impact: no\n- Reason: This fixture exercises a non-visual service contract.\n',
    ''));
  assert((await auditSdd({ root })).errors.some((error) => error.includes('declare UI impact')));
});

test('verifies an approved screen and export hash against the manifest', async (t) => {
  const workspace = temporaryDirectory(t, 'sdd-audit-');
  const root = path.join(workspace, 'specs');
  fs.mkdirSync(root);
  writeFeature(root, '001-first-slice', '- [x] T001 [FR-001] Deliver the slice.\n');
  const prototype = path.join(workspace, 'analysis', 'prototyping');
  fs.mkdirSync(prototype, { recursive: true });
  const hash = 'a'.repeat(64);
  const manifestFile = path.join(prototype, 'screen-manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify(writeUiFixture(prototype, {
    screens: [{ id: 'work-editor', files: [{ path: 'wireframes/work-editor.html', sha256: hash }] }],
  }, 'primary-action')));
  const manifestHash = crypto.createHash('sha256').update(fs.readFileSync(manifestFile)).digest('hex');
  fs.writeFileSync(path.join(prototype, 'ui-ux-approval.md'), [
    '- Approved export set version: prototype-001',
    `- Screen manifest SHA-256: ${manifestHash}`,
  ].join('\n'));
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(
    '- UI impact: no\n- Reason: This fixture exercises a non-visual service contract.',
    [
      '- UI impact: yes',
      '- Approved export set: `prototype-001`',
      '- Visual divergence: none',
      '| Screen | Export SHA-256 | Slice responsibility |',
      '|---|---|---|',
      `| \`work-editor\` | \`${hash}\` | useful work |`,
      '## Used UI Control Inventory',
      '| Screen | Control | Governed variant | Approved source element | Exact visual and icon contract | Applicable states | Automated evidence |',
      '|---|---|---|---|---|---|---|',
      '| work-editor | Save work | primary-action | approved Save work CTA | Inter 14px/500 and add icon | default, hover, focus | work-editor browser assertion |',
    ].join('\n')));
  assert.equal((await auditSdd({ root })).ok, true);
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(hash, 'b'.repeat(64)));
  assert((await auditSdd({ root })).errors.some((error) => error.includes('does not match the manifest')));
});

test('rejects a UI slice without a used control inventory', async (t) => {
  const workspace = temporaryDirectory(t, 'sdd-audit-');
  const root = path.join(workspace, 'specs');
  fs.mkdirSync(root);
  writeFeature(root);
  const prototype = path.join(workspace, 'analysis', 'prototyping');
  fs.mkdirSync(prototype, { recursive: true });
  const hash = 'a'.repeat(64);
  const manifestFile = path.join(prototype, 'screen-manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify({
    screens: [{ id: 'work-editor', files: [{ sha256: hash }] }],
  }));
  const manifestHash = crypto.createHash('sha256').update(fs.readFileSync(manifestFile)).digest('hex');
  fs.writeFileSync(path.join(prototype, 'ui-ux-approval.md'), [
    '- Approved export set version: prototype-001',
    `- Screen manifest SHA-256: ${manifestHash}`,
  ].join('\n'));
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(
    '- UI impact: no\n- Reason: This fixture exercises a non-visual service contract.',
    [
      '- UI impact: yes',
      '- Approved export set: prototype-001',
      '- Visual divergence: none',
      '| Screen | Export SHA-256 | Slice responsibility |',
      '|---|---|---|',
      `| work-editor | ${hash} | useful work |`,
    ].join('\n')));

  const result = await auditSdd({ root });
  assert(result.errors.some((error) => error.includes('Used UI Control Inventory')));
});

test('rejects an unapproved manifest and a not-applicable UI bypass', async (t) => {
  const workspace = temporaryDirectory(t, 'sdd-audit-');
  const root = path.join(workspace, 'specs');
  fs.mkdirSync(root);
  writeFeature(root);
  const spec = path.join(root, '001-first-slice', 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(
    '- UI impact: no\n- Reason: This fixture exercises a non-visual service contract.',
    '- UI impact: yes\n- Approved export set: not applicable\n- Reason: bypass\n- Visual divergence: none'));
  assert((await auditSdd({ root })).errors.some((error) => error.includes('must pin an approved prototype')));

  const prototype = path.join(workspace, 'analysis', 'prototyping');
  fs.mkdirSync(prototype, { recursive: true });
  const hash = 'a'.repeat(64);
  fs.writeFileSync(path.join(prototype, 'screen-manifest.json'), JSON.stringify({
    screens: [{ id: 'work-editor', files: [{ sha256: hash }] }],
  }));
  fs.writeFileSync(path.join(prototype, 'ui-ux-approval.md'), [
    '- Approved export set version: prototype-001',
    `- Screen manifest SHA-256: ${'b'.repeat(64)}`,
  ].join('\n'));
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(
    '- Approved export set: not applicable\n- Reason: bypass',
    `- Approved export set: prototype-001\n| Screen | Export SHA-256 | Slice responsibility |\n|---|---|---|\n| work-editor | ${hash} | work |`));
  assert((await auditSdd({ root })).errors.some((error) => error.includes('approved manifest SHA-256')));
});

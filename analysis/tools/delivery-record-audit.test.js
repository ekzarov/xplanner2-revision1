'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { auditDeliveryRecord, runConfiguredUserJourney } = require('./delivery-record-audit');

const starterRoot = path.resolve(__dirname, '..', '..');

test('fails closed without a delivery record', async () => {
  const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'delivery-no-record-'));
  try {
    const result = (await auditDeliveryRecord({ root }));
    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes('--record=')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('does not accept recorded observations without a live check', async (t) => {
  const relative = path.join('.migration-tmp', `delivery-${Date.now()}.md`);
  const absolute = path.join(starterRoot, relative);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  t.after(() => fs.rmSync(absolute, { force: true }));
  fs.writeFileSync(absolute, [
    '# Delivery',
    '- Date: 2026-07-29',
    '- Slice: bootstrap',
    '- Deployed revision: abcdef123456',
    '- Environment ID: shared-demo',
    '- Observed hostname: legacy-transformation-demo',
    '- Observed kernel: Linux',
    '- Result: passed',
    '## Changed Surfaces',
    '| Surface ID | Roles | Useful action or contract | Deployment location |',
    '|---|---|---|---|',
    '| sign-in | user | authenticate | /sign-in |',
    '## Smoke Results',
    '| Surface ID | Check | Action performed | Expected | Actual | Result | Evidence |',
    '|---|---|---|---|---|---|---|',
    '| sign-in | Login smoke | signed in | dashboard | dashboard | pass | screenshot.png |',
  ].join('\n'));
  const result = (await auditDeliveryRecord({ root: starterRoot, record: relative }));
  assert.equal(result.ok, false);
  assert(result.errors.some((error) => error.includes('--verify-connection')));
  assert(result.errors.some((error) => error.includes('--verify-user-journey')));
  assert(result.errors.some((error) => error.includes('--verify-visual-parity')));
  assert(result.errors.some((error) => error.includes('Rollback Readiness:')));
  assert(result.errors.some((error) => error.includes('Live Reconciliation:')));
});

test('runs the configured user journey and propagates its failure', async (t) => {
  const root = path.join(starterRoot, '.migration-tmp', `user-journey-${Date.now()}`);
  fs.mkdirSync(path.join(root, 'config'), { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), [
    'commands:',
    '  user_journey:',
    '    command: node -e "process.exit(7)"',
    "    working_directory: '.'",
    '    required_environment: []',
  ].join('\n'));
  const result = runConfiguredUserJourney({
    root,
    record: 'record.md',
    environmentId: 'demo',
    revision: 'abcdef1',
  });
  assert.equal(result.ok, false);
  assert(result.message.includes('code 7'));
});

test('runs delivery rechecks in verify-only evidence mode', async (t) => {
  const root = path.join(starterRoot, '.migration-tmp', `user-journey-mode-${Date.now()}`);
  fs.mkdirSync(path.join(root, 'config'), { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'config', 'project.yaml'), [
    'commands:',
    '  user_journey:',
    '    command: node -e "require(\'fs\').writeFileSync(\'mode.txt\',process.env.DELIVERY_EVIDENCE_MODE)"',
    "    working_directory: '.'",
    '    required_environment: []',
  ].join('\n'));
  const result = runConfiguredUserJourney({
    root,
    record: 'record.md',
    environmentId: 'demo',
    revision: 'abcdef1',
  });
  assert.equal(result.ok, true);
  assert.equal(fs.readFileSync(path.join(root, 'mode.txt'), 'utf8'), 'verify-only');
});

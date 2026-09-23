'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { liveReconciliationErrors } = require('./live-reconciliation');
const revision = 'abcdef123456';
const environmentId = 'demo';
const body = `## Live Reconciliation
- Reconciled revision: ${revision}
- Reconciled environment: ${environmentId}
- Reconciled scope: time entry and direct reporting dependency, member role
- Reconciled by: delivery-agent-session-123
- Reconciled at: 2026-08-01T10:00:00Z
- Live discovery evidence: recorded navigation enumeration in observations.md
- Reconciliation result: clean

| Check ID | Surface / role / action | Approved expectation and source | Actual observation and evidence | Evidence origin | Applicability or repeat reason | Outcome | Finding or decision |
|---|---|---|---|---|---|---|---|
| C-001 | entry / member / save | saves hours per FR-1 | saved, journey raw case-1 | delivery-check | same revision/environment, member, fixture-1, FR-1 | match | none |
`;
test('accepts a scoped reconciliation without pretending reused checks are new runs', () => {
  assert.deepEqual(liveReconciliationErrors({ body, revision, environmentId }), []);
});
for (const [name, input] of [
  ['missing section', ''], ['duplicate section', body + body],
  ['wrong revision', body.replace(revision, '123456abcdef')],
  ['wrong environment', body.replace('environment: demo', 'environment: other')],
  ['open finding', body.replace('| match |', '| finding |')],
  ['unchecked scope', body.replace('| match |', '| not-checked |')],
  ['unsupported exclusion', body.replace('| match |', '| authorized-exclusion |')],
  ['no observations', body.replace('saved, journey raw case-1', 'pending')],
  ['no applicability', body.replace('same revision/environment, member, fixture-1, FR-1', 'none')],
  ['unknown origin', body.replace('| delivery-check |', '| assumed |')],
  ['future date', body.replace('2026-08-01', '2099-08-01')],
  ['blocked summary', body.replace('result: clean', 'result: blocked')],
  ['duplicate check', body + body.split('\n').find(line => line.startsWith('| C-001')) + '\n'],
]) test('rejects ' + name, () => assert.ok(liveReconciliationErrors({ body: input, revision, environmentId }).length));

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const MarkdownIt = require('markdown-it');
const root = path.resolve(__dirname, '..', '..');

function readVariant(files) {
  const file = files.map(file => path.join(root, file)).find(file => fs.existsSync(file));
  assert.ok(file, 'Missing governed template: ' + files.join(' or '));
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

const families = [
  ['bootstrap', ['analysis/stages/templates/bootstrap-gate-report-template.md'],
    ['## Required Gate Evidence', '## Deviations And Remediation', '## Verification Boundary', '## Final Assessment'],
    ['pending/not run', 'not legacy behavior', 'separate from the human']],
  ['walkthrough', ['analysis/stages/templates/walkthrough-NNN-template.md', 'analysis/stages/templates/stage-03-walkthrough-template.md'],
    ['## Executed Walkthrough', '## Findings', '## Residual Unverified Scope', '## Walkthrough Outcome Summary', '## Gate Result'],
    ['Expected behavior and source', 'live/simulated/not-run', 'A simulated match is not live verification']],
  ['requirements revision', ['analysis/stages/templates/stage-04-requirements-revision-template.md'],
    ['## Decisions', '## Map Corrections', '## Decision Reconciliation', '## Owner Confirmation', '## Gate Result'],
    ['Explicit owner decision', 'pending/keep/change/defer/do-not-port', 'approved but\nunapplied changes']],
  ['form and style', ['analysis/prototyping/templates/ui-ux-decision-template.md'],
    ['## Options Considered', '## Decision Boundary', '## Open Decisions And Changes', '## Decision'],
    ['Agent proposal / alternatives', 'Explicit owner choice', 'All mandatory choices must be explicitly approved']],
  ['prototype approval', ['analysis/prototyping/templates/ui-ux-approval-template.md'],
    ['## Reviewed Set', '## Remarks and Resolution', '## Approval Boundary', '## Owner Statement'],
    ['pending/approved/remarks/rejected', 'Not reviewed:', 'open/verified-closed/deferred']],
  ['NFR decisions', ['analysis/architecture/templates/architecture-nfr-owner-review-template.md'],
    ['## Decision Summary', '## Permitted Next Work', '## Recorded Owner Decisions',
      '## Open And Deferred Items', '## Required Owner Actions', '## Walkthrough',
      '## Verdict', '## Reviewed Workbook And Counts', '## Owner Amendments', '## Editorial Changes'],
    ['Previous value or agent proposal', 'approved/returned/deferred/pending',
      'A skipped live lane is not verified live', 'actual repeated owner reviews',
      'Overall outcome: pending owner review', 'does not silently repin']],
  ['owner architecture remarks', ['analysis/architecture/templates/architecture-review-verdict-template.md'],
    ['## Owner Remarks', '## Stage 12 Remark Closure', '## Closure Summary And Remaining Work', '## Approval Statement'],
    ['expected closure criterion', 'open/failed/blocked/verified-closed', 'Unrelated decisions checked', 'Verified closure does not itself supply']],
  ['knowledge synthesis', ['analysis/stages/templates/knowledge-record-template.md', 'analysis/stages/templates/stage-13-knowledge-record-template.md'],
    ['## Knowledge Bundle', '## Source-To-Output Reconciliation', '## Remaining Work', '## Verification', '## Gate Result'],
    ['represented/missing/contradictory/excluded', 'not thereby independently verified', 'Required unchecked source or approval']],
  ['SDD authoring', ['analysis/stages/templates/sdd-record-template.md', 'analysis/stages/templates/stage-15-sdd-record-template.md'],
    ['## Traceability Coverage', '## Design Gaps And Handoff Boundary', '## NFR Ownership', '## Verification', '## Gate Result'],
    ['covered/missing/contradictory/deferred', 'not implemented\nor tested', '16 independent review']],
  ['delivery', ['analysis/stages/templates/delivery-NNN-template.md', 'analysis/stages/templates/stage-18-delivery-record-template.md'],
    ['## Environment Health', '## Findings and Corrections', '## Delivery Verification Boundary', '## Gate Result'],
    ['pass/fail/blocked/not-checked', 'new immutable delivery record', 'Required checks without execution evidence remain not-checked']],
  ['live reconciliation inside delivery', ['analysis/stages/templates/delivery-NNN-template.md', 'analysis/stages/templates/stage-18-delivery-record-template.md'],
    ['## Live Reconciliation', '## Environment Health', '## Gate Result'],
    ['Approved expectation and source', 'Evidence origin', 'An unavailable legacy comparison remains explicit']],
  ['owner walkthrough', ['analysis/stages/templates/owner-walkthrough-NNN-template.md', 'analysis/stages/templates/stage-19-owner-walkthrough-template.md'],
    ['## Observations', '## Findings', '## Walkthrough Boundary', '## Owner Statement'],
    ['Expected behavior and approved source', 'not presented as newly walked', 'Final acceptance decision:', 'not proof of the\nwhole system']],
  ['waiver', ['analysis/stages/templates/GATE-SCOPE-template.md', 'analysis/stages/templates/waiver-template.md'],
    ['## Decision and Authority', '## Scope', '## Blocked Activity', '## Rationale', '## Residual Risk', '## Permitted Next Stage', '## Exception Boundary And Follow-up', '## Independent Review'],
    ['Expiry or re-entry condition', 'pending decision authorizes no transition', 'never turns the skipped check into a match']],
];

for (const [name, files, headings, phrases] of families) {
  test(name + ' exposes its own result boundary without implicit approval', () => {
    const text = readVariant(files);
    const actualHeadings = text.split('\n').filter(line => line.startsWith('## '));
    let previous = -1;
    for (const heading of headings) {
      const index = actualHeadings.indexOf(heading);
      assert.ok(index > previous, 'Missing or unordered ' + heading);
      assert.equal(actualHeadings.lastIndexOf(heading), index, 'Duplicate ' + heading);
      previous = index;
    }
    for (const phrase of phrases) assert.ok(text.includes(phrase), 'Missing ' + phrase);
    // A missing table delimiter silently turns structured evidence into prose.
    const tokens = new MarkdownIt().parse(text, {});
    assert.ok(tokens.some(token => token.type === 'table_open'), 'Evidence tables must render');
    const tableBlocks = text.split('\n\n').filter(block => block.startsWith('|'));
    for (const block of tableBlocks) {
      const lines = block.split('\n').filter(line => line.startsWith('|'));
      const columns = lines[0].split('|').length;
      for (const line of lines) assert.equal(line.split('|').length, columns, 'Uneven table: ' + line);
    }
  });
}

test('result boundary contract covers the template inventory and is routed from instructions', () => {
  const contract = readVariant(['analysis/artifact-result-boundaries.md']);
  for (const phrase of ['## Observation And Execution Records', '## Decisions And Remark Closure',
    '## Authoring And Planning Records', 'Historical immutable reports retain their bytes',
    'Structured workbooks, JSON manifests/inventories', 'Illustrative only']) {
    assert.ok(contract.includes(phrase), phrase);
  }
  const table = contract.split('## Template Coverage')[1];
  assert.equal(table.split('\n').filter(line => line.startsWith('| ')).length - 1, 28);
  for (const file of ['MIGRATION.md', 'analysis/migration_methodology.md',
    ...['stages', 'prototyping', 'architecture', 'knowledge', 'reviews'].map(dir => 'analysis/' + dir + '/README.md')]) {
    assert.ok(readVariant([file]).includes('artifact-result-boundaries.md'), file);
  }
});

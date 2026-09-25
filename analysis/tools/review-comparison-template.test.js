'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..', '..');

function readVariant(paths) {
  const file = paths.map(file => path.join(root, file)).find(file => fs.existsSync(file));
  assert.ok(file, 'A governed review template must exist');
  return fs.readFileSync(file, 'utf8');
}

test('returns require source-checked dispositions and a fresh independent handoff', () => {
  const readme = fs.readFileSync(path.join(root, 'analysis/reviews/README.md'), 'utf8');
  for (const text of ['## Return and Correction Protocol', '### Stage 1 Re-entry',
    'largest pass number', 'non-adjacent returns', 'accepted / narrowed / rejected / blocked',
    'Correction status and independent verification status stay separate',
    'withholds previous findings and dispositions from', 'not a new independent verification claim']) {
    assert.ok(readme.includes(text), text);
  }
  const entry = fs.readFileSync(path.join(root, 'MIGRATION.md'), 'utf8');
  assert.ok(entry.includes('#return-and-correction-protocol'));
  const review = readVariant(['analysis/reviews/stage-NN-pass-NNN-template.md', 'analysis/reviews/review_template.md']);
  assert.ok(review.includes('#return-and-correction-protocol'));
  const recon = fs.readFileSync(path.join(root, 'analysis/legacy_reconnaissance.template.md'), 'utf8');
  assert.ok(recon.includes('#stage-1-re-entry'));
  assert.ok(recon.includes('Independent verification'));
  for (const name of ['stage-02-pass-NNN.md', 'stage-03/walkthrough-NNN.md', 'stage-04-requirements-revision.md']) {
    assert.ok(readme.includes(name), 'Named conditional return input: ' + name);
  }
  assert.ok(readme.includes('From any later stage'));
  assert.ok(readme.includes('stays at Stage 4'));
  const walkthrough = readVariant(['analysis/stages/templates/walkthrough-NNN-template.md', 'analysis/stages/templates/stage-03-walkthrough-template.md']);
  assert.ok(walkthrough.includes('#stage-1-re-entry'));
  assert.ok(walkthrough.includes('exact revision/environment/role'));
  const revision = fs.readFileSync(path.join(root, 'analysis/stages/templates/stage-04-requirements-revision-template.md'), 'utf8');
  assert.ok(revision.includes('#stage-1-re-entry'));
  assert.ok(revision.includes('ordinary keep/change/do-not-port decision'));
  for (const format of ['md', 'html']) {
    const presentation = fs.readFileSync(path.join(root, 'analysis/migration_methodology.' + format), 'utf8');
    assert.equal(presentation.split('<!-- STAGE_REENTRY_1_START -->').length, 2);
    assert.ok(presentation.includes('stage-02-pass-001-dispositions.md'));
    const reentry = presentation.split('<!-- STAGE_REENTRY_1_START -->')[1].split('<!-- STAGE_REENTRY_1_END -->')[0];
    for (const name of ['stage-02-pass-NNN.md', 'stage-03/walkthrough-NNN.md', 'stage-04-requirements-revision.md']) {
      assert.ok(reentry.includes(name), 'Return panel source: ' + name);
    }
  }
  const dataPath = path.join(root, 'analysis/process-canvas/data.json');
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const stage = data.stages.find(stage => stage.id === 'stage-01');
    assert.ok(!stage.inputs.includes('stage-02-review'), 'Future review is not a first-entry prerequisite');
    assert.deepEqual(stage.reentry.sources.map(source => source.artifactId), ['stage-02-review', 'stage-03-walkthrough', 'stage-04-revision']);
    for (const source of stage.reentry.sources) {
      assert.ok(!stage.inputs.includes(source.artifactId));
      assert.ok(source.en && source.ru);
      assert.ok(data.artifacts.some(artifact => artifact.id === source.artifactId && artifact.sourcePath));
    }
    for (const locale of ['en', 'ru']) assert.equal(stage.reentry[locale].steps.length, 5);
    assert.ok(stage.reentry.instructionPath.endsWith('#stage-1-re-entry'));
    const app = fs.readFileSync(path.join(root, 'analysis/process-canvas/app.js'), 'utf8');
    assert.ok(app.includes('reentryDetails(item)'));
    assert.ok(app.includes('<details class="fact reentry-details">'));
  }
});

for (const [name, paths] of [
  ['independent control', ['analysis/reviews/stage-NN-pass-NNN-template.md', 'analysis/reviews/review_template.md']],
  ['final acceptance', ['analysis/stages/templates/stage-19-pass-NNN-template.md', 'analysis/stages/templates/stage-19-acceptance-template.md']],
]) {
  test(name + ' separates coverage, comparison outcomes, findings and verdict', () => {
    const source = readVariant(paths);
    const headings = ['## Comparison Scope', '## Comparison Results', '## Coverage Summary',
      '## Blocked Scope', '## Conclusion and Next Gate'];
    let previous = -1;
    for (const heading of headings) {
      const index = source.indexOf(heading);
      assert.ok(index > previous, heading + ' must appear once in logical order');
      assert.equal(source.indexOf(heading, index + 1), -1, 'Duplicate ' + heading);
      previous = index;
    }
    assert.ok(source.includes('Expected and authoritative source'));
    assert.ok(source.includes('Observed in this pass'));
    assert.ok(source.includes('matched / mismatch / not-checked / not-applicable'));
    assert.ok(source.includes('F-NNN / B-NNN / E-NNN / none'));
    assert.ok(source.includes('Total check items | Matched | Mismatch | Not checked | Not applicable'));
    assert.ok(source.includes('The total equals the four result counts'));
    assert.ok(source.includes('they are not\ncounted as newly matched'));
    assert.ok(source.includes('Unknown or inaccessible is not not-applicable'));
    assert.ok(source.includes('Comparison check IDs: <C-NNN IDs>'));
  });
}

test('review instructions require comparison evidence without rewriting history', () => {
  const readme = fs.readFileSync(path.join(root, 'analysis/reviews/README.md'), 'utf8');
  assert.ok(readme.includes('## Comparison Record Contract'));
  assert.ok(readme.includes('Historical immutable reports retain their bytes'));
  assert.ok(readme.includes('Low-cosmetic exception permits'));
  assert.ok(readme.includes('not a clean report'));
  for (const file of ['MIGRATION.md', 'analysis/migration_methodology.md']) {
    assert.ok(fs.readFileSync(path.join(root, file), 'utf8').includes('#comparison-record-contract'), file);
  }
});

test('Stage 2 template preserves blind evidence before two-way reconciliation', () => {
  const source = readVariant(['analysis/reviews/stage-NN-pass-NNN-template.md', 'analysis/reviews/review_template.md']);
  const headings = ['## Stage 2 Phase A - Blind Inventory', '### Phase A Saved Checkpoint',
    '## Stage 2 Phase B - Two-Way Reconciliation', '## Comparison Scope'];
  let previous = -1;
  for (const heading of headings) {
    const at = source.indexOf(heading);
    assert.ok(at > previous, heading + ' must be explicit and ordered');
    assert.equal(source.indexOf(heading, at + 1), -1);
    previous = at;
  }
  for (const requirement of ['Snapshot saved at:', 'Snapshot revision or SHA-256:',
    'First Phase B access at:', 'inventory-to-records / records-to-source',
    'not backfilled into Phase A', 'do not count the same check twice',
    'not only internal reasoning or temporary scratch work', 'invalidate a contaminated pass']) {
    assert.ok(source.includes(requirement), requirement);
  }
});

test('Stage 2 instructions and presentation require durable independent discovery', () => {
  const readme = fs.readFileSync(path.join(root, 'analysis/reviews/README.md'), 'utf8');
  for (const text of ['#### Phase A - blind source inventory', '#### Phase B - two-way reconciliation',
    'second Excel workbook and a second reconnaissance document are not required',
    'The immutable legacy revision is the authority', 'Freeze the Phase A snapshot',
    'contents, summaries, row counts, prior findings']) assert.ok(readme.includes(text), text);
  const profiles = JSON.parse(fs.readFileSync(path.join(root, 'analysis/record-contracts.json'), 'utf8'));
  assert.deepEqual(profiles.reconnaissance.stages, [2]);
  assert.deepEqual(profiles.reconnaissance.artifacts, ['stage-02-review']);
  assert.ok(!profiles.review.artifacts.includes('stage-02-review'));
  for (const locale of ['en', 'ru']) assert.equal(profiles.reconnaissance[locale].fields.length, 5);
});

for (const [name, paths] of [
  ['independent control', ['analysis/reviews/stage-NN-pass-NNN-template.md', 'analysis/reviews/review_template.md']],
  ['acceptance', ['analysis/stages/templates/stage-19-pass-NNN-template.md', 'analysis/stages/templates/stage-19-acceptance-template.md']],
]) {
  test(name + ' explicitly links checklist findings to author claims and repeat checks', () => {
    const source = readVariant(paths);
    const finding = source.split('### F-NNN -')[1].split('## Blocked Scope')[0];
    for (const field of ['**Checklist link:**', '**Checklist discrepancy:**', '**Required recheck:**']) {
      assert.ok(finding.includes(field), name + ': ' + field);
    }
    for (const text of ['### Checklist Review', 'Author self-check / source',
      'Independent result / evidence', 'Finding / required recheck',
      'Checklist revision or SHA-256:', '**Checklist issues:**',
      'first-screen result block', 'without double-counting',
      'not proof that the author did not read the checklist',
      'Historical records are not retroactively assigned',
      '### Reviewer Self-Check And Learning']) {
      assert.ok(source.includes(text), name + ': ' + text);
    }
    assert.match(source, /Phase B\s+only/);
  });
}

test('review packets and correction instructions preserve checklist finding identity', () => {
  const instruction = fs.readFileSync(path.join(root, 'analysis/error-prevention.md'), 'utf8');
  const reviews = fs.readFileSync(path.join(root, 'analysis/reviews/README.md'), 'utf8');
  const packet = fs.readFileSync(path.join(root, 'analysis/agent_orchestration.md'), 'utf8');
  assert.ok(instruction.includes('## Reviewer Findings And Correction Handoff'));
  assert.ok(instruction.includes('not an automatic severity or verdict'));
  assert.ok(instruction.includes('old records are\nnot retroactively defective'));
  assert.ok(instruction.includes('retains both F-NNN and CHK-NNN'));
  assert.ok(reviews.includes('For checklist-related findings, retain both F-NNN and CHK-NNN'));
  assert.ok(packet.includes('Stage 17 peer reports using a slice-specific format'));
  for (const source of [reviews, packet]) {
    assert.ok(source.includes('#reviewer-findings-and-correction-handoff'));
    for (const field of ['**Checklist link**', '**Checklist discrepancy**', '**Required recheck**']) {
      assert.ok(source.includes(field), field);
    }
  }
});

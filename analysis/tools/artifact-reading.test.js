'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { formatArtifact, recordedResult, readabilityErrors, templateEntries } = require('./artifact-reading');

const profile = { question: 'What was checked?', remaining: 'No check has been recorded.',
  next: 'The reviewer records the comparison.', resultSection: 'Results', nextSection: 'Next Action' };

test('template formatting is idempotent and preserves frontmatter and machine verdicts', () => {
  const source = '---\nstatus: draft\n---\n\n# Review\n\n## Results\n\nRecorded evidence.\n\n## Foundation Verdict\n\n\x60approved-for-delivery\x60\n\n## Next Action\n\nPending.\n';
  const options = { file: 'analysis/reviews/example.md', profile, template: true };
  const formatted = formatArtifact(source, options);
  assert.equal(formatArtifact(formatted, options), formatted);
  assert.ok(formatted.startsWith('---\nstatus: draft\n---\n'));
  assert.match(formatted, /^## Foundation Verdict\s*\n+\s*\x60?approved-for-delivery\x60?\s*$/m);
  assert.match(formatted, /> \[!WARNING\]/);
  assert.match(formatted, /> \*\*Template: not yet assessed\*\*/);
  assert.deepEqual(readabilityErrors(formatted, options.file), []);
});

test('contents links target explicit unique anchors and ignore fenced headings', () => {
  const source = '# Review\n\n## Findings\n\nOne.\n\n## Findings\n\nTwo.\n\n\x60\x60\x60md\n## Not A Section\n\x60\x60\x60\n';
  const formatted = formatArtifact(source, { file: 'analysis/reviews/test.md', profile, template: true });
  assert.ok(formatted.includes('id="read-findings"'));
  assert.ok(formatted.includes('id="read-findings-1"'));
  assert.ok(!formatted.includes('id="read-not-a-section"'));
  assert.deepEqual(readabilityErrors(formatted, 'test.md'), []);
});

test('readability checks exclude YAML metadata but still require real headings', () => {
  const source = '---\nokf_version: "0.2"\n---\n\n# Index\n\n## Sources\n\nPending.\n';
  const formatted = formatArtifact(source, { file: 'index.md', profile, template: true });
  assert.deepEqual(readabilityErrors(formatted, 'index.md'), []);
  assert.ok(readabilityErrors(formatted + '\n## Missing Section\n', 'index.md')
    .some(error => error.includes('Missing Section')));
});

test('historical negative and partial verdicts never become green', () => {
  assert.equal(recordedResult('# Review\n\n- Result: findings\n', 'analysis/reviews/test.md').color, 'CAUTION');
  assert.equal(recordedResult('# Review\n\n## Current Verdict\n\n\x60architecture-current-roadmap-pending\x60\n\n## Foundation Verdict\n\n\x60approved-for-delivery\x60\n',
    'analysis/architecture/architecture-nfr-owner-review.md').color, 'WARNING');
  assert.equal(recordedResult('# Review\n\n- Result: clean\n', 'analysis/reviews/test.md').color, 'TIP');
  assert.equal(recordedResult('# Execution\n\n- Result: passed\n', 'analysis/stages/delivery.md').color, 'NOTE');
});

test('broken reading anchors are rejected without pretending to verify the outcome', () => {
  const source = formatArtifact('# Record\n\n## Results\n\nUnknown.\n', { file: 'record.md', profile, template: true });
  assert.ok(readabilityErrors(source.replace('id="read-results"', 'id="removed"'), 'record.md').length);
  assert.ok(readabilityErrors('# No summary\n', 'record.md').length);
});

test('all template families have structured first screens and all checkpoints are covered', () => {
  const root = path.resolve(__dirname, '../..');
  const entries = templateEntries(root);
  assert.equal(entries.length, 31);
  const stages = new Set(entries.flatMap(entry => entry.profile.stages));
  for (let stage = 0; stage <= 19; stage++) assert.ok(stages.has(stage), 'stage ' + stage);
  for (const { file } of entries) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.deepEqual(readabilityErrors(source, file), [], file);
    assert.match(source, /Template: not yet assessed/, file);
  }
  const constitution = '.specify/memory/constitution.md';
  assert.deepEqual(readabilityErrors(fs.readFileSync(path.join(root, constitution), 'utf8'), constitution), []);
});

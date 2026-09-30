'use strict';

// Project fix test (xplanner2-revision1): source_intake records are probed as prose.
const test = require('node:test');
const assert = require('node:assert/strict');
const { proseOnly } = require('./project-config-audit');
const { hasEvidencePlaceholders } = require('./evidence-placeholders');

test('reading-block comment markers and code spans are not placeholders', () => {
  const record = '# A\n\n<!-- ARTIFACT_READING_START -->\n> **Done**\n<!-- ARTIFACT_READING_END -->\n\nUses `<exact scope>` as a quoted example.\n';
  assert.equal(hasEvidencePlaceholders(record), true, 'the raw text trips the probe');
  assert.equal(hasEvidencePlaceholders(proseOnly(record)), false);
});

test('a real prose placeholder still fails', () => {
  assert.equal(hasEvidencePlaceholders(proseOnly('# A\n\nScope: <exact scope>\n')), true);
  assert.equal(hasEvidencePlaceholders(proseOnly('# A\n\nOwner: TODO\n')), true);
});

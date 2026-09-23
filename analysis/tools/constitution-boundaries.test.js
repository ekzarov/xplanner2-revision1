'use strict';
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const cheerio = require('cheerio');
const {files} = require('./process-consistency-audit');
const {boundaryErrors} = require('./constitution-boundaries');
const {tables} = require('./process-contract');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const input = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));

test('constitutional obligations retain their procedural destinations', () => {
  assert.deepEqual(boundaryErrors(input), []);
  const ids = [...input.constitution.matchAll(/<a id="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Reading anchors must be unique');
  for (const alias of ['read-i-constitution-first-stage-controlled-approval-gated','read-v-prototyping-and-architecture-before-sdd','read-vi-sdd-and-the-parity-map-stay-in-lockstep']) assert(ids.includes(alias), 'Preserve historical anchor: '+alias);
  for (const [key, before, after] of [
    ['constitution', 'MUST NOT be silently rewritten or re-hashed', 'may be synchronized'],
    ['constitution', 'independent review and owner', 'owner'],
    ['constitution', 'MIGRATION.md#mandatory-reading-order', 'MIGRATION.md'],
    ['constitution', 'save independent observations before receiving prior', 'read prior'],
    ['constitution', '### XIV.', '### XV.'],
    ['methodology', 'cookie/header names', 'miscellaneous strings'],
    ['methodology', 'owner and agent MUST collaborate', 'owner and agent may collaborate'],
    ['methodology', 'id="engineering-quality-profile"', 'id="quality"'],
    ['contract', '## Document Ownership', '## Documents'],
    ['contract', 'Stages 2 and 19 save Phase A before Phase B', 'Read all records immediately'],
  ]) {
    assert(input[key].includes(before), before);
    assert(boundaryErrors({...input, [key]: input[key].replace(before, after)}).length, before);
  }
  for (const stale of ['Every agent MUST read, in order:', '`Overview`', '`Technology Stack`', 'The owner completes all items']) {
    assert(boundaryErrors({...input, constitution: input.constitution + '\n' + stale}).length, stale);
  }
  for (const detail of ['Stage 18', 'Stages 2 and 19', 'Phase A', 'spec.md', 'OKF', 'GitHub Actions']) {
    const constitution = input.constitution.replace('## Core Principles', '## Core Principles\n\n' + detail);
    assert(boundaryErrors({...input, constitution}).length, detail);
  }
});

test('presentation ownership is projected from the Markdown contract', () => {
  const rows = tables(input.contract).get('Document Ownership').slice(1);
  const $ = cheerio.load(input.html);
  const cards = $('.docroles .docrole');
  assert.equal(cards.length, 4);
  for (const [i, row] of rows.slice(0, 4).entries()) {
    assert(cards.eq(i).text().includes(row[1]));
    assert(cards.eq(i).text().includes(row[2]));
    assert(cards.eq(i).text().includes(row[3]));
  }
  const xml = cheerio.load(input.drawio, {xmlMode:true});
  assert.equal(xml('diagram[id="document-ownership"] mxCell[vertex="1"]').length, rows.length + 1);
  for (const [i, row] of rows.entries()) assert(xml(`#document-owner-${i}`).attr('value').includes(row[1]));
  assert($('.docnote').text().includes('Reading order is not authority order'));
  assert(read('analysis/process-cheatsheet.md').includes('not a second stage manual'));
  const dataFile = path.join(root, 'analysis/process-canvas/data.json');
  if (fs.existsSync(dataFile)) {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const en = data.artifacts.find(artifact => artifact.id === 'constitution');
    const ru = JSON.parse(read('analysis/process-canvas/translations.ru.json')).artifacts.constitution;
    for (const value of [en.desc, en.example, ru.desc, ru.example]) {
      assert(!/\bStages?\s+\d|\bPhase\s+[AB]\b|шаг[а-я]*\s+\d/iu.test(value), 'Constitution explanation must not depend on numbered stages');
    }
    assert(en.example.includes('human consent'));
    assert(ru.example.includes('решением человека'));
  }
});

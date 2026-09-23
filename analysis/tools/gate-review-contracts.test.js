'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const contracts = require('../gate-review-contracts');
const { synchronize, modes } = require('./sync-gate-review-guide');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('every diagram gate has a bilingual question, scope boundary and typed inputs', () => {
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const ids = new Set(data.artifacts.map(item => item.id));
  assert.equal(data.gates.length, 22);
  assert.deepEqual(data.gates.map(item => item.id).sort(), Object.keys(contracts).sort());
  for (const gate of data.gates) {
    assert.deepEqual(gate.reviewContract, contracts[gate.id]);
    assert.equal(gate.headline, contracts[gate.id].headline.en);
    for (const lang of ['en', 'ru']) {
      assert.ok(gate.reviewContract.headline[lang].endsWith('?'), gate.id);
      assert.ok(gate.reviewContract.boundary[lang].length > 30, gate.id);
    }
    assert.ok(gate.reviewContract.inputs.length > 0, gate.id);
    for (const input of gate.reviewContract.inputs) {
      assert.ok(modes[input.mode], `${gate.id}: ${input.mode}`);
      assert.ok(input.description.en && input.description.ru, gate.id);
      if (input.artifact) assert.ok(ids.has(input.artifact), input.artifact);
      else assert.ok(fs.existsSync(path.join(root, input.reference)), input.reference);
    }
  }
});

test('SDD report belongs to independent review, not the current audit parser', () => {
  for (const id of ['sdd-audit', 'sdd-complete-audit']) {
    const inputs = contracts[id].inputs;
    assert.equal(inputs.find(input => input.artifact === 'stage-15-record').mode, 'review');
    assert.equal(inputs.find(input => input.artifact === 'nfr-manifest').mode, 'review');
    assert.equal(inputs.find(input => input.artifact === 'target-inventory').mode, 'related');
  }
  assert.match(contracts['sdd-audit'].boundary.en, /all numbered feature directories/);
  assert.doesNotMatch(read('analysis/tools/sdd-audit.js'), /sdd-record\.md/);
});

test('approval modes list the automatically checked base artifacts', () => {
  for (const [approved, base] of [['prototype-approved-audit', 'prototype-audit'], ['architecture-approved-audit', 'architecture-audit']]) {
    for (const input of contracts[base].inputs) {
      assert.ok(contracts[approved].inputs.some(candidate => candidate.mode === input.mode && candidate.artifact === input.artifact && candidate.path === input.path));
    }
  }
});

test('all gate explanations remain synchronized in Markdown, presentation and 2D', () => {
  assert.equal(synchronize(root, true), 0);
  const guide = read('analysis/gate-review-guide.md');
  const presentation = read('analysis/migration_methodology.html');
  const diagram = read('analysis/migration_artifact_flow.drawio');
  for (const [id, contract] of Object.entries(contracts)) {
    assert.ok(guide.includes(`**${contract.headline.en}**`), id);
    assert.ok(presentation.includes(contract.headline.en), id);
    assert.ok(diagram.includes(`gate-review-${id}`), id);
  }
  const app = read('analysis/process-canvas/app.js');
  assert.ok(app.includes('selectItem(button.dataset.type, button.dataset.select)'));
  assert.ok(app.includes('headline: item.reviewContract?.headline.ru'));
});

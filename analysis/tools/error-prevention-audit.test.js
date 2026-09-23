'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateChecklist, auditErrorPrevention } = require('./error-prevention-audit');
const header = '| Check | When applicable | Basis | How to check |\n|---|---|---|---|\n';
const row = '| **CHK-001. Does navigation cover the agreed journeys?** | Stages 6-7; changed UI navigation | [Finding](finding.md) and [Rule](rule.md) | Compare roles, destinations and transitions against the approved scope. |\n';

test('empty template and four-column project checks are valid', () => {
  assert.deepEqual(validateChecklist(header, { empty: true }).errors, []);
  assert.deepEqual(validateChecklist(header + row).errors, []);
});

test('project lessons never become starter template rows', () => {
  assert.match(validateChecklist(header + row, { empty: true }).errors.join(), /no project findings/);
});

test('rejects missing cells, state columns, duplicate IDs and duplicate checks', () => {
  for (const text of [header + row.replace('Stages 6-7; changed UI navigation', ''), header.replace('How to check', 'State'), header + row + row, header + row + row.replace('CHK-001', 'CHK-002')]) {
    assert.ok(validateChecklist(text).errors.length);
  }
  assert.ok(validateChecklist(header + row.replace('Does navigation cover the agreed journeys?', '')).errors.length);
});

test('requires finding and rule links and concise rows', () => {
  assert.ok(validateChecklist(header + row.replace('[Rule](rule.md)', 'Rule')).errors.length);
  assert.ok(validateChecklist(header + row.replace('Compare roles,', 'word '.repeat(61))).errors.length);
});

test('rejects missing and escaped local basis references', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prevention-'));
  try {
    const file = path.join(root, 'checklist.md');
    fs.writeFileSync(path.join(root, 'finding.md'), '# Finding\n');
    fs.writeFileSync(path.join(root, 'rule.md'), '# Rule\n');
    assert.deepEqual(validateChecklist(header + row, { root, file }).errors, []);
    assert.ok(validateChecklist(header + row.replace('rule.md', '../rule.md'), { root, file }).errors.length);
    assert.ok(validateChecklist(header + row.replace('rule.md', 'absent.md'), { root, file }).errors.length);
    assert.ok(validateChecklist(header + row.replace('rule.md', 'file:///outside.md'), { root, file }).errors.length);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('local heading links preserve GitHub punctuation and duplicate-heading suffixes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prevention-slug-'));
  try {
    const file = path.join(root, 'checklist.md');
    fs.writeFileSync(path.join(root, 'finding.md'), '# M2 - Accepted\n\n## M2 - Accepted\n');
    fs.writeFileSync(path.join(root, 'rule.md'), '# Rule\n');
    for (const fragment of ['m2---accepted', 'm2---accepted-1']) {
      assert.deepEqual(validateChecklist(header + row.replace('finding.md', 'finding.md#' + fragment), { root, file }).errors, []);
    }
    assert.ok(validateChecklist(header + row.replace('finding.md', 'finding.md#m2-accepted'), { root, file }).errors.length);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('a missing project checklist fails while source mode uses the empty template', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prevention-'));
  try {
    fs.mkdirSync(path.join(root, 'analysis'));
    fs.writeFileSync(path.join(root, 'analysis/error-prevention-checklist.template.md'), header);
    assert.equal(auditErrorPrevention({ root }).ok, false);
    fs.writeFileSync(path.join(root, '.migration-starter-source'), '{}');
    assert.equal(auditErrorPrevention({ root }).ok, true);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('the repository prevention checklist has the governed shape', () => {
  const result = auditErrorPrevention();
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('presentation and methodology open the same pinned checklist example as 3D', () => {
  const root = path.resolve(__dirname, '../..');
  const methodology = fs.readFileSync(path.join(root, 'analysis/migration_methodology.md'), 'utf8');
  const url = methodology.match(/https:\/\/github\.com\/olsys-ltd\/xplanner2\/blob\/[a-f0-9]{40}\/analysis\/error-prevention-checklist\.md/)?.[0];
  assert.ok(url, 'missing immutable XPlanner checklist example');
  for (const extension of ['md', 'html']) {
    const content = fs.readFileSync(path.join(root, 'analysis/migration_methodology.' + extension), 'utf8');
    assert.ok(content.includes(url), extension + ': missing pinned filled checklist example');
    assert.match(content, /not an exhaustive history audit/);
  }
  const dataFile = path.join(root, 'analysis/process-canvas/data.json');
  if (fs.existsSync(dataFile)) {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const example = data.artifacts.find(item => item.id === 'error-prevention').xplannerExample;
    const revision = data.exampleRevisions[example.path];
    assert.equal(url, `${data.exampleRepository}/blob/${revision}/${example.path}`);
    assert.match(example.note, /historical import/);
    assert.match(example.note, /new or reopened work/);
  }
});

test('does not silently discard extra cells from a project row', () => {
  assert.ok(validateChecklist(header + row.trimEnd().slice(0, -1) + '| unexpected |\n').errors.length);
  assert.deepEqual(validateChecklist(header + row.replace('destinations', 'destinations\\|roles')).errors, []);
});

test('stage projections contain shared duties without new per-stage checklist arrows', () => {
  const root = path.resolve(__dirname, '../..');
  const dataFile = path.join(root, 'analysis/process-canvas/data.json');
  if (!fs.existsSync(dataFile)) return;
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  assert.equal(data.stages.filter(s => s.outputs.includes('error-prevention')).length, 1);
  for (const stage of data.stages) {
    assert.ok(stage.prevention.en && stage.prevention.ru, stage.id);
    for (const extension of ['md', 'html']) {
      const content = fs.readFileSync(path.join(root, 'analysis/migration_methodology.' + extension), 'utf8');
      assert.ok(content.includes('ERROR_PREVENTION_' + stage.number + '_START'), stage.id);
    }
    if (['stage-02', 'stage-19'].includes(stage.id)) {
      assert.match(stage.prevention.en, /Phase A: do not open/);
      assert.match(stage.prevention.en, /Phase B:/);
    }
  }
});

test('rejects learned rows separated from the table or hidden in examples', () => {
  for (const source of [header + '\n' + row, header + row + '\n' + row.replace('CHK-001', 'CHK-002'), header + '\n```md\n' + row + '```']) {
    assert.ok(validateChecklist(source).errors.some(e => /outside the checklist table/.test(e)));
    assert.ok(validateChecklist(source, { empty: true }).errors.length);
  }
});

test('basis references must identify files and real local anchors', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prevention-anchor-'));
  try {
    const file = path.join(root, 'checklist.md');
    fs.writeFileSync(path.join(root, 'finding.md'), '# Finding\n\n<a id="F-001"></a>\n');
    fs.writeFileSync(path.join(root, 'rule.md'), '# Rule\n');
    fs.mkdirSync(path.join(root, 'directory'));
    assert.deepEqual(validateChecklist(header + row.replace('finding.md', 'finding.md#F-001').replace('rule.md', 'rule.md#rule'), { root, file }).errors, []);
    for (const link of ['rule.md#absent', 'directory', 'rule.md#%ZZ']) {
      assert.ok(validateChecklist(header + row.replace('rule.md', link), { root, file }).errors.length);
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

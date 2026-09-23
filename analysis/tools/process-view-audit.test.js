'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const fs = require('node:fs');
const { auditProcessViews } = require('./process-view-audit');

test('every checkpoint has a check marker consistent with its process responsibility', () => {
  const root = path.resolve(__dirname, '../..');
  const data = JSON.parse(fs.readFileSync(path.join(root, 'analysis/process-canvas/data.json'), 'utf8'));
  const byRole = role => data.stages.filter(stage => stage.checkRole === role).map(stage => stage.number);
  assert.deepEqual(byRole('independent'), [2, 7, 10, 14, 16, 19]);
  assert.deepEqual(byRole('peer'), [17]);
  assert.deepEqual(byRole('primary'), [3, 12, 18]);
  assert.deepEqual(byRole('none'), ['B', 1, 4, 5, 6, 8, 9, 11, 13, 15]);
  for (const stage of data.stages) {
    assert.equal(stage.checkRole === 'independent', Boolean(stage.independent));
  }
  const methodology = fs.readFileSync(path.join(root, 'analysis/migration_methodology.md'), 'utf8');
  assert.match(methodology, /Working iterations in Stages 3, 4, 12, 13, and 18/);
  const orchestration = fs.readFileSync(path.join(root, 'analysis/agent_orchestration.md'), 'utf8');
  assert.match(orchestration, /Stage 17 delivery slice/);
  assert.match(orchestration, /independent reviewer/);
});

test('rollback readiness is part of delivery rather than a separate artifact', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  assert.ok(!data.artifacts.some(item => item.id === 'rollback-evidence'));
  assert.ok(!data.stages.some(item => item.outputs.includes('rollback-evidence') || item.inputs.includes('rollback-evidence')));
  const delivery = data.artifacts.find(item => item.id === 'delivery-record');
  assert.ok(delivery.relationship.path.endsWith('foundation-delivery.md#operational-rehearsal'));
  assert.ok(delivery.relationship.text.includes('not readiness of later releases'));
  const gate = data.gates.find(item => item.id === 'delivery-audit');
  assert.ok(gate.reviewContract.inputs.some(item => item.path === 'delivery-NNN.md / Rollback Readiness'));
  assert.ok(!gate.reviewContract.inputs.some(item => item.artifact === 'rollback-evidence'));
  for (const file of ['analysis/migration_methodology.md', 'analysis/migration_methodology.html']) {
    assert.ok(read(file).includes('ROLLBACK_READINESS_START'));
  }
  const { requiredFields } = require('./rollback-readiness');
  for (const field of requiredFields) assert.ok(read('analysis/stages/templates/delivery-NNN-template.md').includes('- ' + field + ':'));
});

test('delivery contains live reconciliation and acceptance is the next independent stage', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  assert.deepEqual(data.stages.map(stage => stage.number), ['B', ...Array.from({length:19}, (_,n)=>n+1)]);
  assert.match(read('analysis/process-canvas/index.html'), /<b>20<\/b> <span id="summaryCheckpoints">/);
  assert.ok(!data.artifacts.some(item => item.id === 'live-revision-record'));
  const stage = data.stages.find(item => item.number === 18);
  for (const id of ['parity-map','sdd-spec','target-inventory','screen-manifest']) assert.ok(stage.inputs.includes(id), id);
  for (const id of ['workbook-audit','target-audit','delivery-audit']) assert.ok(stage.gates.includes(id), id);
  assert.ok(stage.inputs.includes('polish-backlog'));
  for (const file of ['polish-backlog', 'sdd-spec', 'target-inventory']) assert.ok(!stage.outputs.includes(file));
  assert.ok(stage.outputs.includes('traceability'));
  const acceptance = data.stages.find(item => item.number === 19);
  assert.ok(acceptance.independent && acceptance.ownerGate);
  assert.ok(acceptance.inputs.includes('delivery-record'));
  const artifact = data.artifacts.find(item => item.id === 'delivery-record');
  assert.ok(read('analysis/stages/templates/delivery-NNN-template.md').includes('## Live Reconciliation'));
  for (const f of ['analysis/migration_methodology.md','analysis/migration_methodology.html']) assert.ok(read(f).includes(artifact.headline));
  assert.ok(JSON.parse(read('analysis/process-canvas/translations.ru.json')).artifacts['delivery-record'].headline.endsWith('?'));
  const ru = JSON.parse(read('analysis/process-canvas/translations.ru.json'));
  assert.ok(ru.gates['target-audit'].desc.includes('18 и 19'));
  assert.ok(ru.artifacts['polish-backlog'].usage.includes('обновляется на шагах 15 и 17'));
  assert.ok(data.artifacts.find(item => item.id === 'stage-19-review').recordContract.ru.note.includes('2 и 19'));
  assert.ok(data.artifacts.find(item => item.id === 'polish-backlog').responsibility.ru.instructions.includes('15/17'));
  assert.ok(!data.artifacts.find(item => item.id === 'polish-backlog').responsibility.ru.instructions.includes('15/17/18'));
});

test('old manifest references use the existing index rather than a separate artifact', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  assert.ok(!data.artifacts.some(item => item.id === 'carried-forward-trace'));
  for (const stage of data.stages) {
    assert.ok(!stage.inputs.includes('carried-forward-trace'));
    assert.ok(!stage.outputs.includes('carried-forward-trace'));
  }
  assert.match(read('specs/traceability.template.md'), /## Imported Legacy References/);
  assert.match(read('analysis/prototyping/README.md'), /not a separate handoff file/);
  assert.ok(!read('init-migration.ps1').includes('carried-forward-trace'));
});

test('traceability has a slice-first reading route and retains its Stage 17 input/output role', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root,file),'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const artifact = data.artifacts.find(item => item.id === 'traceability');
  assert.ok(artifact.headline.endsWith('?'));
  assert.equal(artifact.relationship.title,'Read one slice, not the whole index');
  const stage = data.stages.find(item => item.number === 17);
  assert.ok(stage.inputs.includes('traceability') && stage.outputs.includes('traceability'));
  const russian = JSON.parse(read('analysis/process-canvas/translations.ru.json'));
  assert.ok(russian.artifacts.traceability.headline.endsWith('?'));
  for (const file of ['ARTIFACTS.md','specs/README.md','specs/traceability.template.md','analysis/migration_methodology.md']) {
    assert.ok(read(file).includes('**' + artifact.headline + '**'), file);
  }
  assert.ok(read('analysis/migration_methodology.html').includes('<b>' + artifact.headline + '</b>'));
  assert.match(read('specs/traceability.template.md'), /## Start With One Slice/);
  assert.match(read('specs/traceability.template.md'), /preserve the machine-read section names and table columns/);
  assert.match(read('specs/traceability.template.md'), /## Slice Verification Index/);
  assert.ok(artifact.usage.includes('recorded means observations exist, not passed'));
  assert.ok(russian.artifacts.traceability.usage.includes('recorded'));
  for (const stageNumber of [15, 16, 17, 18, 19]) {
    for (const format of ['md', 'html']) {
      assert.ok(read('analysis/migration_methodology.' + format).includes('TRACEABILITY_DUTY_' + stageNumber + '_START'));
    }
  }
  for (const payload of ['specs/traceability-guide.md', 'specs/verification-record.template.md', 'analysis/tools/traceability-index.js']) {
    assert.ok(read('init-migration.ps1').includes("'" + payload + "'"), payload);
  }
});

test('target inventory has a question and a schema-safe reading guide, not invented evidence', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const inventory = data.artifacts.find(item => item.id === 'target-inventory');
  assert.ok(inventory.headline.endsWith('?'));
  assert.equal(inventory.relationship.path, 'analysis/inventories/README.md');
  const ru = JSON.parse(read('analysis/process-canvas/translations.ru.json')).artifacts['target-inventory'];
  assert.ok(ru.headline.endsWith('?'));
  assert.ok(ru.relationship.linkLabel);
  for (const file of ['ARTIFACTS.md','analysis/inventories/README.md','analysis/migration_methodology.md']) {
    assert.ok(read(file).includes('**' + inventory.headline + '**'), file);
  }
  assert.ok(read('analysis/migration_methodology.html').includes('<b>' + inventory.headline + '</b>'));
  const guide = read(inventory.relationship.path);
  for (const text of ['## Contents','## Where It Participates','## How To Read The JSON','## Worked XPlanner Example',
    '## From Design To Implementation','adapter_required','not a live browser crawl','does not read this inventory directly']) {
    assert.ok(guide.includes(text), text);
  }
  const example = JSON.parse(read('analysis/inventories/target-surface-inventory.example.json'));
  assert.equal(example.surfaces[0].status,'gap');
  assert.equal(example.surfaces[0].visibility,'hidden');
  assert.deepEqual(example.surfaces[0].actions,[]);
  assert.equal(require('./target-surface-audit').TARGET_INVENTORY_SCHEMA.additionalProperties,false);
});

test('the waiver purpose question stays bold and synchronized across descriptions', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const question = data.artifacts.find(item => item.id === 'owner-waiver').headline;
  assert.equal(question, 'Did the owner authorize this specific exception, for what scope and under which conditions?');
  const russian = JSON.parse(read('analysis/process-canvas/translations.ru.json'));
  assert.equal(russian.artifacts['owner-waiver'].headline,
    'Разрешил ли владелец конкретное исключение, для какого объёма и на каких условиях?');
  for (const file of ['ARTIFACTS.md', 'analysis/migration_methodology.md',
    'analysis/stages/templates/GATE-SCOPE-template.md']) {
    assert.ok(read(file).includes('**' + question + '**'), file);
  }
  assert.ok(read('analysis/migration_methodology.html').includes('<b>' + question + '</b>'));
});

test('keeps the governed process views synchronized', () => {
  const root = path.resolve(__dirname, '..', '..');
  const result = auditProcessViews({ root });
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('the readable NFR review uses its own immutable example revision', () => {
  const analysis = path.resolve(__dirname, '..');
  const data = JSON.parse(fs.readFileSync(path.join(analysis, 'process-canvas/data.json'), 'utf8'));
  const examplePath = 'analysis/architecture/architecture-nfr-owner-review.md';
  assert.ok(Object.hasOwn(data.exampleRevisions, examplePath));
  assert.match(data.exampleRevisions[examplePath], /^[a-f0-9]{40}$/);
  const expected = data.exampleRepository + '/blob/' + data.exampleRevisions[examplePath] + '/' + examplePath;
  const catalogue = fs.readFileSync(path.resolve(analysis, '../ARTIFACTS.md'), 'utf8');
  assert.ok(catalogue.includes(expected), 'catalogue must link to the same readable revision');
  const app = fs.readFileSync(path.join(analysis, 'process-canvas/app.js'), 'utf8');
  assert.ok(app.includes('data.exampleRevisions?.[file] || data.exampleRevision'));
  assert.ok(app.includes('exampleFileUrl(item.xplannerPath)'));
});

test('Stage 15 links a real handoff record rather than an implementation self-review', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const artifact = data.artifacts.find(item => item.id === 'stage-15-record');
  assert.match(artifact.xplannerExample.path, /^analysis\/stages\/stage-15\/.+\/sdd-record\.md$/);
  assert.match(artifact.xplannerExample.note, /Reconstructed/);
  assert.match(data.exampleRevisions[artifact.xplannerExample.path], /^[a-f0-9]{40}$/);
  assert.match(artifact.desc, /not an implementation self-review/);
  for (const file of ['ARTIFACTS.md', 'analysis/stages/README.md',
    'analysis/stages/templates/sdd-record-template.md', 'analysis/migration_methodology.md']) {
    assert.ok(read(file).includes('**' + artifact.headline + '**'), file);
  }
  assert.ok(read('analysis/migration_methodology.html').includes('<b>' + artifact.headline + '</b>'));
  assert.ok(read('analysis/migration_artifact_flow.drawio').includes(artifact.headline));
  assert.match(JSON.parse(read('analysis/process-canvas/translations.ru.json'))
    .artifacts['stage-15-record'].headline, /^Вот что я спроектировал/);
  assert.match(read('analysis/stages/templates/sdd-record-template.md'), /never backdates/);
});

test('numbered architecture examples and return links use their own published revision', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  for (const id of ['architecture-verdict', 'architecture-closure']) {
    const examplePath = data.artifacts.find(item => item.id === id).xplannerExample.path;
    const revision = data.exampleRevisions[examplePath];
    assert.match(revision, /^[a-f0-9]{40}$/);
    assert.notEqual(revision, data.exampleRevision);
    const url = `${data.exampleRepository}/blob/${revision}/${examplePath}`;
    assert.ok(read('ARTIFACTS.md').includes(url), id);
    if (id !== 'architecture-closure') continue;
    for (const file of ['analysis/migration_methodology.md', 'analysis/migration_methodology.html']) {
      const content = read(file);
      for (const number of [9, 10, 11]) {
        const block = content.split(`<!-- STAGE_REENTRY_${number}_START -->`)[1]
          .split(`<!-- STAGE_REENTRY_${number}_END -->`)[0];
        assert.ok(block.includes(url), `${file}: Stage ${number} return example`);
      }
      assert.ok(!content.includes(`${data.exampleRepository}/blob/${data.exampleRevision}/${examplePath}`));
    }
  }
});

test('the shared error-prevention example has its own published revision and remains accessible at every stage', () => {
  const root = path.resolve(__dirname, '../..');
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const artifact = data.artifacts.find(item => item.id === 'error-prevention');
  const file = 'analysis/error-prevention-checklist.md';
  assert.equal(artifact.xplannerExample.path, file);
  assert.match(data.exampleRevisions[file], /^[a-f0-9]{40}$/);
  assert.notEqual(data.exampleRevisions[file], data.exampleRevision);
  assert.ok(read('ARTIFACTS.md').includes(`${data.exampleRepository}/blob/${data.exampleRevisions[file]}/${file}`));
  assert.doesNotMatch(artifact.xplannerExample.note, /not published|prepared locally/);
  for (const stage of data.stages) {
    assert.ok(stage.prevention.en, stage.id + ' EN');
    assert.ok(stage.prevention.ru, stage.id + ' RU');
  }
  for (const view of ['analysis/migration_methodology.md', 'analysis/migration_methodology.html']) {
    assert.doesNotMatch(read(view), /How to stop an agent repeating the same mistakes/);
  }
});

test('all governed stage questions are localized and present in both methodology views', () => {
  const analysis = path.resolve(__dirname, '..');
  const data = JSON.parse(fs.readFileSync(path.join(analysis, 'process-canvas/data.json'), 'utf8'));
  const russian = JSON.parse(fs.readFileSync(path.join(analysis, 'process-canvas/translations.ru.json'), 'utf8'));
  const markdown = fs.readFileSync(path.join(analysis, 'migration_methodology.md'), 'utf8');
  const html = fs.readFileSync(path.join(analysis, 'migration_methodology.html'), 'utf8');
  for (const stage of data.stages.filter(item => item.id !== 'stage-00')) {
    assert.ok(stage.headline?.endsWith('?'), stage.id);
    assert.ok(russian.stages[stage.id].headline?.endsWith('?'), stage.id + ' RU');
    assert.ok(markdown.replace(/\s+/g, ' ').includes('**' + stage.headline + '**'), stage.id + ' Markdown');
    assert.ok(html.includes('<b>' + stage.headline + '</b>'), stage.id + ' HTML');
  }
});

test('cosmetic backlog is a conditional input through planning, release and acceptance', () => {
  const analysis = path.resolve(__dirname, '..');
  const data = JSON.parse(fs.readFileSync(path.join(analysis, 'process-canvas/data.json'), 'utf8'));
  const russian = JSON.parse(fs.readFileSync(path.join(analysis, 'process-canvas/translations.ru.json'), 'utf8'));
  const html = fs.readFileSync(path.join(analysis, 'migration_methodology.html'), 'utf8');
  const markdown = fs.readFileSync(path.join(analysis, 'migration_methodology.md'), 'utf8');
  const diagram = fs.readFileSync(path.join(analysis, 'migration_artifact_flow.drawio'), 'utf8');
  for (const number of [15, 16, 17, 18, 19]) {
    const stage = data.stages.find(item => item.number === number);
    assert.ok(stage.inputs.includes('polish-backlog'), stage.id + ' input');
    assert.equal(stage.outputs.includes('polish-backlog'), [15, 17].includes(number), stage.id + ' update role');
    assert.ok(stage.evidence && russian.stages[stage.id].evidence, stage.id + ' EN/RU instructions');
    assert.ok(html.includes(stage.evidence), stage.id + ' HTML');
    assert.ok(markdown.includes(stage.evidence), stage.id + ' Markdown');
    assert.ok(diagram.includes('id="cosmetic-' + stage.id + '"'), stage.id + ' diagram');
  }
  assert.match(data.stages.find(item => item.number === 18).evidence, /assigned to a later slice still blocks/);
  assert.match(data.stages.find(item => item.number === 19).evidence, /after the blind acceptance pass/);
  const backlog = fs.readFileSync(path.join(analysis, 'prototyping/templates/ui-polish-backlog-template.md'), 'utf8');
  assert.match(backlog, /Affected screens \/ shared components \/ functions \/ roles \/ rows/);
  assert.match(backlog, /Unknown scope blocks/);
  assert.match(backlog, /Implementation alone never means verified closed/);
});

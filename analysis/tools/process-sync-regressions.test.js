'use strict';
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const cheerio = require('cheerio');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('bootstrap guidance distinguishes a public-safe workspace from remote readiness', () => {
  for (const file of ['MIGRATION.md', 'analysis/migration_methodology.md',
    'analysis/process-contract.md', 'analysis/process-cheatsheet.md', 'config/REMOTE_SERVER.md']) {
    const text = read(file);
    assert(text.includes('--require-configured'), file);
    assert(/unconfigured/i.test(text), file);
  }
  assert(read('AGENTS.md').includes('audit:environment -- --require-configured'));
  if (fs.existsSync(path.join(root, 'analysis/artifact-naming.json'))) {
    const mapping = JSON.parse(read('analysis/artifact-naming.json'));
    assert(mapping.some(item => item.template === 'config/environments.template.yaml'
      && item.output === 'config/environments.yaml'));
  }
  if (fs.existsSync(path.join(root, 'analysis/process-canvas/data.json'))) {
    const data = JSON.parse(read('analysis/process-canvas/data.json'));
    const environment = data.artifacts.find(item => item.id === 'environment-contract');
    assert.equal(environment.lifecycle, 'generated');
    assert(environment.usage.includes('--require-configured'));
    assert(environment.desc.includes('not remote readiness'));
  }
  const html = cheerio.load(read('analysis/migration_methodology.html')).text();
  assert(html.includes('config/environments.template.yaml'));
  assert(html.includes('audit:environment -- --require-configured'));
  assert(read('analysis/stages/templates/bootstrap-gate-report-template.md').includes('Remote environment state'));
  assert(!read('README.md').includes('90-day expiry'));
});

test('PM deployment access handoff is explicit without replacing specialist verification', () => {
  const link = 'REMOTE_SERVER.md#configure-before-remote-work';
  for (const file of ['MIGRATION.md', 'analysis/migration_methodology.md',
    'analysis/agent-roles.md', 'analysis/process-contract.md', 'analysis/process-cheatsheet.md',
    '.agents/skills/migration-pm/SKILL.md', '.agents/skills/migration-ba/SKILL.md',
    '.agents/skills/migration-developer/SKILL.md']) assert(read(file).includes(link), file);
  const procedure = read('config/REMOTE_SERVER.md');
  for (const value of ['PM owns access preparation', 'application test accounts',
    'Legacy deployment', 'permission does not authorize new-application releases',
    'Missing', 'commands.deploy', 'Stage 17', 'actual executor']) {
    assert(procedure.toLowerCase().includes(value.toLowerCase()), value);
  }
  const template = names => read(names.find(file => fs.existsSync(path.join(root, file))));
  const walkthrough = template(['analysis/stages/templates/walkthrough-NNN-template.md',
    'analysis/stages/templates/stage-03-walkthrough-template.md']);
  const delivery = template(['analysis/stages/templates/delivery-NNN-template.md',
    'analysis/stages/templates/stage-18-delivery-record-template.md']);
  assert(walkthrough.includes('Access and operation authorization:'));
  assert(walkthrough.includes('Application URLs and role accounts:'));
  assert(delivery.includes('Release authorization:'));
  assert(delivery.includes('Access recheck:'));
  for (const text of [walkthrough, delivery]) assert(text.includes('PM / deployment operator:'));
});

test('Bootstrap records failures before correction approval and upgrades without reinitialization', () => {
  const entry = read('MIGRATION.md');
  assert(entry.includes('### Bootstrap Evidence And Blockers'));
  assert(entry.includes('## Bootstrap Maintenance'));
  for (const text of ['blockers[].evidence', 'before asking for or waiting on remediation approval',
    'required rows = pass + fail + blocked + pending', 'Do not rerun the initializer to upgrade']) {
    assert(entry.replace(/\s+/g, ' ').includes(text), text);
  }
  for (const file of ['README.md', 'analysis/migration_methodology.md', 'analysis/process-contract.md',
    'analysis/process-cheatsheet.md', 'analysis/stages/templates/bootstrap-gate-report-template.md',
    'analysis/migration_methodology.html']) assert(read(file).includes('#bootstrap-maintenance'), file);
  assert(read('analysis/stages/templates/bootstrap-gate-report-template.md').includes('exactly match the top summary'));
  assert(!read('analysis/migration_methodology.html').includes('5 audits'));
});

test('cheat sheet covers every stage and artifact without changing the shared flow', () => {
  const {readContract} = require('./process-contract');
  const MarkdownIt = require('markdown-it');
  const source = read('analysis/process-cheatsheet.md');
  const $ = cheerio.load(new MarkdownIt({html:true}).render(source));
  const registry = JSON.parse(read('analysis/artifact-responsibilities.json')).artifacts;
  const stages = readContract(root).flow;
  assert.equal($('h3').length, stages.length);
  for (const stage of stages) {
    const heading = $(`h3 a[href="migration_methodology.md#${stage.id}"]`).parent();
    assert.equal(heading.length, 1, stage.id);
    const body = heading.nextUntil('h3, h2').text();
    for (const id of new Set([...stage.inputs, ...stage.outputs])) {
      if (id === 'status') continue;
      assert(body.includes(registry.find(a => a.id === id).label), `${stage.id}: ${id}`);
    }
    if (stage.delayedInputs.some(id => id !== 'status')) assert(body.includes('Phase B only:'));
  }
  assert(source.includes('Bootstrap creates `migration_status.yaml`'));
  assert(source.indexOf('## How Does The Agent Know What To Do?') < source.indexOf('## Shared Rules'));
  assert(source.includes('[MIGRATION.md](../MIGRATION.md)'));
  assert(source.includes('identify the current step from'));
  assert(source.includes('`analysis/migration_status.yaml`'));
  assert(source.includes('[analysis/migration_methodology.md](migration_methodology.md)'));
  assert(source.includes('AGENTS.md directs the agent there'));
  assert(source.includes('not clean'));
  assert(source.includes('Create a new immutable closure report'));
  const stage12 = source.split('### [12 -')[1].split('### [13 -')[0];
  assert(!stage12.includes('**Writes result:** None.'));
  assert(stage12.includes('architecture-closure-NNN.md'));
  assert(stage12.includes('never update the owner verdict'));
  assert(stage12.includes('negative report is mandatory'));
  assert(source.includes('mandatory transitive dependencies'));
  assert(!/[\u0400-\u04ff]/u.test(source));
  const html = cheerio.load(read('analysis/migration_methodology.html'));
  assert.equal(html('a[href$="/analysis/process-cheatsheet.md"]').length, 1);
});

test('current stage duties, instruction anchors and frame meanings agree', () => {
  const md = read('analysis/migration_methodology.md');
  assert(md.replace(/\s+/g, ' ').includes('A formal Stage 2, 7, 10, 14, 16, or 19 conclusion'));
  for (let n = 0; n <= 19; n++) assert(md.includes(`id="stage-${String(n).padStart(2, '0')}"`));
  assert(!/^\| 20 \|/m.test(read('specs/traceability-guide.md')));
  assert.match(read('analysis/artifact-reading-contract.md'), /Coverage Of All 20 Checkpoints/);
  const $ = cheerio.load(read('analysis/migration_methodology.html'));
  for (const n of [2, 7, 10, 14, 16, 17, 19]) assert($('#ph' + n + ' .node').hasClass('frame-review'), 'independent ' + n);
  for (const n of [3, 12, 18]) assert($('#ph' + n + ' .node').hasClass('frame-check'), 'responsible ' + n);
  assert($('.legend').text().includes('Frames show responsibility, not a passed result'));
  assert(read('analysis/migration_artifact_flow.drawio').includes('stage-flow-stage-12'));
});

test('artifact role table preserves candidate boundaries and two-phase acceptance', () => {
  const graph = read('analysis/artifact-relationship-graph.md');
  const row = n => graph.split(/\r?\n/).find(line => line.startsWith('| ' + n + ':')).split('|').slice(1, -1).map(s => s.trim());
  assert.deepEqual(row(12)[2].split('; ').sort(), ['migration_status.yaml']);
  assert(row(13)[1].includes('legacy_user_flows.xlsx'));
  assert(row(15)[2].includes('legacy_user_flows.xlsx'));
  assert(row(17)[2].includes('target-surface-inventory.json'));
  assert(row(18)[2].includes('specs/traceability.md'));
  for (const name of ['target-surface-inventory.json', 'ui-polish-backlog.md']) assert(!row(18)[2].includes(name));
  assert(row(19)[4].includes('raw journey'));
  const scripts = JSON.parse(read('analysis/tools/package.json')).scripts;
  assert(scripts['audit:stage19'].includes('audit:sdd:slice'));
  assert(!scripts['audit:stage19'].includes('audit:sdd:complete'));
  assert(scripts['audit:all'].includes('audit:sdd:complete'));
});

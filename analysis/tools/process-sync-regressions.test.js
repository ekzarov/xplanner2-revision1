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

test('control-record PRs stay separate from corrections without permitting unreviewed code merge', () => {
  const anchor = '#review-and-correction-prs';
  for (const file of ['MIGRATION.md', 'analysis/process-contract.md',
    'analysis/agent-roles.md', 'analysis/agent_orchestration.md',
    'analysis/reviews/README.md', 'analysis/reviews/stage-NN-pass-NNN-template.md',
    'analysis/process-cheatsheet.md', 'analysis/migration_methodology.html']) {
    assert(read(file).includes(anchor), file);
  }
  const procedure = read('analysis/migration_methodology.md')
    .split('## Review And Correction PRs')[1].split('## Stage Control')[0]
    .replace(/\s+/g, ' ');
  for (const rule of ['one records PR', 'corrections are a separate PR',
    'owner merges the control-record PR', 'Do not reset, discard, overwrite',
    'Phase A still withholds prior findings', 'Saving Phase A does not require its own PR',
    'negative verdict is not a failed CI run', 'keep the PR blocked',
    '**before owner merge**', 'Stage 18', 'Stage 19', 'sealed review']) {
    assert(procedure.includes(rule), rule);
  }
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  assert(data.stages.find(stage => stage.id === 'stage-01').actions.some(action => action.includes('owner merge')));
  assert(data.stages.find(stage => stage.id === 'stage-02').actions.some(action => action.includes('Merge is not a clean verdict')));
  const html = cheerio.load(read('analysis/migration_methodology.html'));
  assert.equal(html('#review-pr-boundary').length, 1);
  assert(html('#review-pr-boundary').text().includes('before merge'));
});

test('corrective returns carry a bounded assignment and preserve unaffected work', () => {
  const MarkdownIt = require('markdown-it');
  const procedure = read('analysis/reviews/README.md')
    .split('### Correction Scope And Handoff')[1].split('### Stage 1 Re-entry')[0];
  const $ = cheerio.load(new MarkdownIt().render(procedure));
  assert.deepEqual($('table tbody tr').map((_, row) => $(row).find('td').first().text()).get(),
    ['Trigger and baseline', 'Correction scope', 'Retained work', 'Checks and outcome', 'Next control']);
  const text = $.text().replace(/\s+/g, ' ');
  for (const rule of ['Every corrective return is impact-scoped authoring, not a restart',
    'every legal return, including non-adjacent returns',
    'before authoring starts', 'no new artifact is required',
    'not limited to the exact reported lines', 'mandatory, not an optional acceleration',
    'unchanged file alone does not prove no impact', 'not newly executed checks',
    'before the expanded work', 'owner\'s decision',
    'neither a return arrow nor a new agent is justification',
    'Before accepting RESULT', 'Do not reset unrelated completed work or approvals',
    'Mandatory repository-wide gates still run']) assert(text.includes(rule), rule);
});

test('all author roles and entry instructions route corrective returns to the shared rule', () => {
  const anchor = '#correction-scope-and-handoff';
  const files = ['MIGRATION.md', 'analysis/migration_methodology.md',
    'analysis/process-contract.md', 'analysis/agent-roles.md',
    'analysis/agent_orchestration.md', 'analysis/agent-system-overview.md',
    'analysis/error-prevention.md', 'analysis/reviews/stage-NN-pass-NNN-template.md',
    'analysis/stages/templates/stage-19-pass-NNN-template.md',
    ...['pm', 'ba', 'ux', 'architect', 'developer'].map(role => `.agents/skills/migration-${role}/SKILL.md`)];
  const initializer = read('init-migration.ps1');
  for (const file of files) {
    assert(read(file).includes(anchor), file);
    assert(initializer.includes(`'${file}'`), 'initializer must carry ' + file);
  }
  const contract = read('analysis/process-contract.md').split('## Stage Boundaries')[1].split('## Stage Flow')[0];
  assert(contract.includes('Every corrective return'));
  for (const file of ['analysis/reviews/stage-NN-pass-NNN-template.md',
    'analysis/stages/templates/stage-19-pass-NNN-template.md']) {
    assert(read(file).includes('- Correction impact:'), file);
  }
});

test('bounded authoring does not replace fresh full blind Stage 2 or mandatory controls', () => {
  const reviews = read('analysis/reviews/README.md').replace(/\s+/g, ' ');
  for (const rule of ['Correction scope and review scope are different',
    'does not grant a delta review where the stage requires a full pass',
    'fresh full in-scope blind Phase A and two-way Phase B',
    'Do not pass findings or correction plans to a blind reviewer before Phase B',
    'a fresh eligible agent performs a new full in-scope blind Phase A']) {
    assert(reviews.includes(rule), rule);
  }
  const methodology = read('analysis/migration_methodology.md').replace(/\s+/g, ' ');
  assert(methodology.includes('another complete Stage 2 pass'));
  assert(methodology.includes('Depth does not mean restarting a stage on return'));
  assert(!methodology.includes('in practice 2\u20133 iterations'));
});

test('return explanations stay visible in process views without changing control scope', () => {
  const anchor = '#correction-scope-and-handoff';
  const html = cheerio.load(read('analysis/migration_methodology.html'));
  assert.equal(html('#correction-scope').length, 1);
  assert(html('#correction-scope a').attr('href').endsWith(anchor));
  assert(html('#correction-scope').text().includes('Correction scope is not control scope'));
  assert(read('analysis/process-cheatsheet.md').includes(anchor));
  const app = read('analysis/process-canvas/app.js');
  const match = app.match(/const englishUi = (\{[\s\S]*?\n\});/);
  const ui = require('node:vm').runInNewContext('(' + match[1] + ')', {}, { timeout: 1000 });
  const ru = JSON.parse(read('analysis/process-canvas/translations.ru.json')).ui;
  for (const key of ['returnMeaning', 'correctionScope', 'correctionScopeText',
    'correctionExpansionText', 'correctionHandoffText', 'correctionControlText', 'openCorrectionScope']) {
    assert(ui[key]?.trim(), key + ' EN');
    assert(ru[key]?.trim(), key + ' RU');
  }
  assert(app.includes("returnMeaning.textContent = tr('returnMeaning')"));
  assert(app.includes('correctionHelp(contextStage)'));
  const stage = JSON.parse(read('analysis/process-canvas/data.json')).stages.find(s => s.id === 'stage-01');
  assert(stage.reentry.en.steps.some(s => s.includes('not a restart')));
  assert(stage.reentry.en.steps.some(s => s.includes('full in-scope blind Phase A')));
});

test('correction guidance links resolve from both review templates and their output locations', () => {
  const md = new (require('markdown-it'))({ html: true });
  const mapping = JSON.parse(read('analysis/artifact-naming.json'));
  for (const template of ['analysis/reviews/stage-NN-pass-NNN-template.md',
    'analysis/stages/templates/stage-19-pass-NNN-template.md']) {
    const output = mapping.find(item => item.template === template).output;
    const $ = cheerio.load(md.render(read(template)));
    const links = $('a[href$="#correction-scope-and-handoff"]');
    assert.equal(links.length, 1, template);
    const href = links.attr('href');
    for (const location of [template, output]) {
      if (href.startsWith('https://')) {
        const url = new URL(href);
        assert.equal(url.origin, 'https://github.com');
        assert.equal(url.pathname, '/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/README.md');
      } else {
        assert.equal(path.resolve(root, path.dirname(location), href.split('#')[0]),
          path.join(root, 'analysis/reviews/README.md'), location);
      }
    }
  }
  assert(read('analysis/reviews/README.md').includes('### Correction Scope And Handoff'));
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

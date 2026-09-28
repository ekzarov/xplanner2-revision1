'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const cheerio = require('cheerio');
const MarkdownIt = require('markdown-it');
const { collectPairs } = require('./translation-audit');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const markdown = new MarkdownIt({ html: true });
const recoveryAnchor = '#stage-2-attempt-recovery';

test('recovery guidance routes to one governing subsection from all author entry points', () => {
  const target = path.join(root, 'analysis/reviews/README.md');
  assert.match(read('analysis/reviews/README.md'), /^#### Stage 2 Attempt Recovery$/m);
  for (const file of ['MIGRATION.md', 'analysis/process-contract.md',
    'analysis/agent-roles.md', 'analysis/agent_orchestration.md', 'analysis/agent-system-overview.md',
    'analysis/migration_methodology.md', 'analysis/process-cheatsheet.md',
    'analysis/error-prevention.md', 'analysis/tools/README.md',
    'analysis/reviews/stage-NN-pass-NNN-template.md',
    '.agents/skills/migration-ba/SKILL.md', '.agents/skills/migration-pm/SKILL.md']) {
    const $ = cheerio.load(markdown.render(read(file)));
    const links = $(`a[href$="${recoveryAnchor}"]`).toArray();
    assert.ok(links.length, file);
    for (const link of links) {
      const href = $(link).attr('href');
      assert.equal(path.resolve(root, path.dirname(file), href.split('#')[0]), target, file);
    }
  }
});

test('report recovery declarations are unique visible fields, not hidden examples', () => {
  const template = read('analysis/reviews/stage-NN-pass-NNN-template.md');
  const section = template.split('### Attempt Recovery')[1].split('## Comparison Scope')[0];
  const $ = cheerio.load(markdown.render(section));
  $('pre, code').remove();
  for (const name of ['session', 'coverage base', 'excluded passes', 'basis']) {
    const declarations = $('li').toArray().filter(li => $(li).text().startsWith(`Recovery ${name}: `));
    assert.equal(declarations.length, 1, name);
  }
  assert.equal($('li').filter((_, li) => $(li).text().startsWith('Recovery basis:')).text(), 'Recovery basis: verified');
  assert.match(section, /otherwise remove[\s\S]*declarations/);
  assert.match(section, /nonempty,[\s\S]*non-template repository-local/);
  assert.match(section, /same scope and explicit baseline_pass/);
  const $guide = cheerio.load(markdown.render(read('analysis/tools/README.md')));
  for (const name of ['session', 'coverage base', 'excluded passes', 'basis']) {
    assert.ok($guide('pre').text().includes(`- Recovery ${name}:`), name);
  }
  assert.doesNotMatch(read('analysis/stages/templates/stage-19-pass-NNN-template.md'), /- Recovery (session|coverage base|excluded passes|basis):/);
});

test('record projections preserve recovery and qualify baseline independence without changing Stage 19', () => {
  const profiles = JSON.parse(read('analysis/record-contracts.json'));
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const stage2 = data.stages.find(stage => stage.id === 'stage-02');
  const report = data.artifacts.find(artifact => artifact.id === 'stage-02-review');
  assert.deepEqual(report.recordContract.en, profiles.reconnaissance.en);
  assert.match(stage2.returns, /no verified coverage/);
  assert.match(stage2.returns, /same scope and explicit root/);
  const mdBlock = read('analysis/migration_methodology.md').split('<!-- RECORD_BOUNDARY_2_START -->')[1]
    .split('<!-- RECORD_BOUNDARY_2_END -->')[0];
  const htmlBlock = read('analysis/migration_methodology.html').split('<!-- RECORD_BOUNDARY_2_START -->')[1]
    .split('<!-- RECORD_BOUNDARY_2_END -->')[0];
  const xml = cheerio.load(read('analysis/migration_artifact_flow.drawio'), { xmlMode: true });
  const diagramText = xml('[id="record-contract-reconnaissance"]').attr('value');
  for (const [label, content] of [['Markdown', markdown.render(mdBlock)], ['HTML', htmlBlock], ['Draw.io', diagramText]]) {
    const text = cheerio.load(content).text();
    for (const field of profiles.reconnaissance.en.fields) assert.ok(text.includes(field), label + ': ' + field);
    assert.doesNotMatch(text, /scope, contamination,/);
  }
  const stage19 = data.stages.find(stage => stage.id === 'stage-19');
  assert.equal(stage19.reviewAccess, undefined);
  assert.ok(stage19.delayedInputs.includes('status'));
  const acceptance = data.artifacts.find(artifact => artifact.id === 'stage-19-review');
  assert.doesNotMatch(JSON.stringify(acceptance.recordContract), /stage-2-attempt-recovery|Recovery session/);
  const page = cheerio.load(read('analysis/migration_methodology.html')).text();
  assert.doesNotMatch(page, /scope, contamination,|unreliable\/missing\/incomplete baseline/);
  assert.match(page, /Missing evidence or uncertain failure containment blocks pending proof/);
});

test('3D recovery link renders in both languages and translated fields stay complete', () => {
  const source = read('analysis/process-canvas/app.js');
  const ui = vm.runInNewContext('(' + source.match(/const englishUi = (\{[\s\S]*?\n\});/)[1] + ')');
  const data = JSON.parse(read('analysis/process-canvas/data.json'));
  const ru = JSON.parse(read('analysis/process-canvas/translations.ru.json'));
  assert.deepEqual(collectPairs(data, ru, ui).errors, []);
  const body = source.slice(source.indexOf('function correctionHelp('), source.indexOf('function gateCheckDetails('));
  for (const labels of [ui, ru.ui]) {
    const context = { data, tr: key => labels[key], escapeHtml: text => text };
    vm.createContext(context);
    vm.runInContext(body, context);
    const $ = cheerio.load(context.correctionHelp({ number: 2 }));
    const link = $(`a[href$="${recoveryAnchor}"]`);
    assert.equal(link.length, 1);
    assert.equal(link.text(), labels.openStage2Recovery);
  }
});

test('generic packet safety reaches both roles without granting user-profile or spill access', () => {
  const anchor = '#packet-transport-safety';
  for (const file of ['MIGRATION.md', 'analysis/agent-roles.md', 'analysis/process-contract.md',
    'analysis/error-prevention.md', 'analysis/tools/README.md',
    '.agents/skills/migration-ba/SKILL.md', '.agents/skills/migration-pm/SKILL.md']) {
    assert.ok(read(file).includes(anchor), file);
  }
  const safety = read('analysis/agent_orchestration.md').split('## Packet Transport Safety')[1]
    .split('## Review Modes')[0].replace(/\s+/g, ' ');
  for (const rule of ['all packets', 'explicitly agree project-local scratch',
    'Never open client-persisted output files outside allowed folders',
    'Regenerate the permitted output', 'blanket user-profile allowlist is not a remedy',
    'Disclose actual access violations', 'does not relax phase restrictions or change Stage 19']) {
    assert.ok(safety.includes(rule), rule);
  }
});

test('agent-system notes distinguish missing proof from a compromised baseline', () => {
  for (const file of ['analysis/agent-system/index.html', 'analysis/agent-system/en.html',
    'analysis/agent-system/roles.html']) {
    const text = cheerio.load(read(file)).text().replace(/\s+/g, ' ');
    assert.match(text, /Missing evidence or uncertain (failure )?containment blocks pending proof/);
    assert.match(text, /explicit owner authorization/);
    assert.match(text, /no verified coverage/);
    assert.doesNotMatch(text, /scope, contamination,/);
  }
});

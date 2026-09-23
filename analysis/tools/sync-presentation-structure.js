'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const { STAGE_NAMES } = require('./lib');

function reconcile(root) {
  const changed = new Map();
  const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
  let html = read('analysis/migration_methodology.html').replace('<html lang="ru">', '<html lang="en">');
  for (let n = 1; n <= 19; n++) {
    const re = new RegExp('(<div class="gvstep" id="st' + String(n).padStart(2, '0') + '">[\\s\\S]*?<span class="glbl">)[^<]*(</span>)');
    html = html.replace(re, (_, before, after) => before + STAGE_NAMES[n].replace(/&/g, '&amp;') + after);
  }
  html = html.replace(/<\/div>\s*<div class="ggroup glast" id="grp-qa">\s*<div class="gtitle">QA<\/div>/, '<div class="varr"></div>');
  html = html.replace('<div class="ggroup" id="grp-dep">', '<div class="ggroup glast" id="grp-delivery">');
  html = html.replaceAll("'grp-dep'", "'grp-delivery'").replaceAll("'grp-qa'", "'grp-delivery'");
  html = html.replace(/<\/section>\s*<div class="down"><\/div>\s*<section class="dgroup" id="dg-qa">\s*<div class="dgtitle">QA<\/div>/, '<div class="down"></div>');
  html = html.replace('id="dg-dep"', 'id="dg-delivery"').replaceAll('>Deployment QA<', '>Deployment &amp; QA<');
  html = html.replaceAll('>Architecture and knowledge<', '>Architecture &amp; knowledge<');
  changed.set('analysis/migration_methodology.html', html);
  const md = read('analysis/migration_methodology.md');
  changed.set('analysis/migration_methodology.md', md);
  let graph = read('analysis/artifact-relationship-graph.md')
    .replaceAll('stage-18/<slice>-delivery.md', 'stage-18/delivery-NNN.md')
    .replaceAll('stage-19/<slice>-acceptance.md', 'analysis/reviews/stage-19-pass-NNN.md')
    .replaceAll('stage-18/&lt;slice&gt;-delivery.md', 'stage-18/delivery-NNN.md')
    .replaceAll('stage-19/&lt;slice&gt;-acceptance.md', 'analysis/reviews/stage-19-pass-NNN.md');
  changed.set('analysis/artifact-relationship-graph.md', graph);
  let xml = read('analysis/migration_artifact_flow.drawio');
  const $ = cheerio.load(xml, { xmlMode: true });
  $('mxCell[value]').each((_, node) => {
    const cell = $(node);
    const value = cell.attr('value');
    const next = value.replaceAll('stage-18/&lt;slice&gt;-delivery.md', 'stage-18/delivery-NNN.md')
      .replaceAll('stage-19/&lt;slice&gt;-acceptance.md', 'analysis/reviews/stage-19-pass-NNN.md')
      .replace('stage evidence first; aggregate before owner acceptance', 'slice evidence before owner acceptance; audit:all validates final complete');
    if (next !== value) {
      const id = cell.attr('id');
      if (!/^[\w-]+$/.test(id)) throw new Error('Unexpected Draw.io identifier');
      const escaped = next.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const tag = new RegExp('(<mxCell\\b[^>]*\\bid="' + id + '"[^>]*\\bvalue=")[^"]*(")');
      if (!tag.test(xml)) throw new Error('Cannot locate Draw.io cell ' + id);
      xml = xml.replace(tag, (_, before, after) => before + escaped + after);
    }
  });
  changed.set('analysis/migration_artifact_flow.drawio', xml);
  return changed;
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..', '..');
  const check = !process.argv.includes('--write');
  for (const [file, expected] of reconcile(root)) {
    const current = fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
    if (current === expected) continue;
    if (check) { console.error(file + ' contains stale presentation structure'); process.exitCode = 1; }
    else fs.writeFileSync(path.join(root, file), expected);
  }
}
function auditPresentationContract({ root = path.resolve(__dirname, '..', '..') } = {}) {
  const { AuditResult } = require('./lib');
  const result = new AuditResult('PRESENTATION CONTRACT AUDIT');
  try {
    for (const [file, expected] of reconcile(root)) {
      if (fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n') !== expected) result.fail(file + ' has stale phase, label or record-path structure');
    }
    const html = fs.readFileSync(path.join(root, 'analysis/migration_methodology.html'), 'utf8');
    const md = fs.readFileSync(path.join(root, 'analysis/migration_methodology.md'), 'utf8');
    const graph = fs.readFileSync(path.join(root, 'analysis/artifact-relationship-graph.md'), 'utf8');
    const deliveryNode = graph.match(/DELIVERY\["([^"]+)"\]/)?.[1] || '';
    const recordPaths = ['analysis/stages/stage-18/delivery-NNN.md',
      'analysis/reviews/stage-19-pass-NNN.md'];
    const namingPath = path.join(root, 'analysis/artifact-naming.json');
    const naming = fs.existsSync(namingPath) ? JSON.parse(fs.readFileSync(namingPath, 'utf8')) : null;
    for (const file of recordPaths) {
      if (!deliveryNode.includes(file.replace(/^analysis\//, ''))) result.fail('Mermaid delivery node omits canonical record ' + file);
      if (naming && !naming.some(entry => entry.output === file)) result.fail('Delivery record differs from artifact-naming.json: ' + file);
    }
    const $ = cheerio.load(html);
    if ($('html').attr('lang') !== 'en') result.fail('English methodology must declare lang=en');
    for (const n of [18, 19]) {
      if ($('#st' + n).closest('.ggroup').attr('id') !== 'grp-delivery' ||
          $('#ph' + n).closest('.dgroup').attr('id') !== 'dg-delivery') result.fail('Stage ' + n + ' must share Deployment & QA');
    }
    const profiles = JSON.parse(fs.readFileSync(path.join(root, 'analysis/record-contracts.json'), 'utf8'));
    for (const [id, profile] of Object.entries(profiles)) {
      for (const locale of ['en', 'ru']) {
        if (!profile[locale]?.title || !profile[locale]?.note || profile[locale]?.fields?.length !== profile.en.fields.length) result.fail(id + ' lacks a complete ' + locale + ' record contract');
      }
      for (const n of profile.stages) {
        const section = $('#ph' + n).text().replace(/\s+/g, ' ');
        for (const value of [profile.en.title, ...profile.en.fields, profile.en.note]) {
          if (!section.includes(value)) result.fail('HTML Stage ' + n + ' missing record contract ' + id + ': ' + value);
        }
        const marker = 'RECORD_BOUNDARY_' + n;
        const body = md.split('<!-- ' + marker + '_START -->')[1]?.split('<!-- ' + marker + '_END -->')[0] || '';
        if (!body.includes(profile.en.title)) result.fail('MD Stage ' + n + ' missing record contract ' + id);
      }
    }
    const scripts = JSON.parse(fs.readFileSync(path.join(root, 'analysis/tools/package.json'), 'utf8')).scripts;
    const acceptanceChecks = scripts['audit:stage19'].split(' && ').map(command => command.replace(/^npm run /, ''));
    for (const command of ['audit:status', 'audit:project', 'audit:environment', 'audit:workbook',
      'audit:prototype:approved', 'audit:architecture:approved', 'audit:knowledge', 'audit:sdd:slice',
      'audit:ui-parity', 'audit:target', 'audit:delivery', 'audit:artifact-links', 'audit:methodology', 'audit:views']) {
      if (!acceptanceChecks.includes(command)) result.fail('Stage 19 aggregate omits ' + command);
    }
    if (acceptanceChecks.includes('audit:acceptance') || acceptanceChecks.includes('audit:all')) result.fail('Slice gate must not require global completion');
    if (scripts['audit:all'] !== 'npm run audit:stage19 && npm run audit:sdd:complete && npm run audit:acceptance') result.fail('Final aggregate must validate both acceptance readiness and recorded completion');
    const ci = fs.readFileSync(path.join(root, '.github/workflows/starter-audit.yml'), 'utf8');
    if (!ci.includes('npm --prefix analysis/tools run audit:artifact-links')) result.fail('CI must check artifact links directly');
    if (!ci.includes("if ($stage -eq 'complete') { Invoke-Audit 'audit:all' }") ||
        !ci.includes("elseif ($stageNumber -eq 19) { Invoke-Audit 'audit:stage19' }")) result.fail('CI must separate slice acceptance and final completion');
    const canvas = path.join(root, 'analysis/process-canvas/data.json');
    if (fs.existsSync(canvas)) {
      const data = JSON.parse(fs.readFileSync(canvas, 'utf8'));
      const contract = JSON.parse(fs.readFileSync(path.join(root, 'analysis/stage-gates.json'), 'utf8'));
      for (const stage of data.stages) {
        if (JSON.stringify(stage.gateContract) !== JSON.stringify(contract.stages.find(row => row.id === stage.id))) result.fail(stage.id + ' canvas gate contract differs');
      }
      if (JSON.stringify(data.stages.find(stage => stage.id === 'stage-19').completionContract) !== JSON.stringify(contract.stages.find(row => row.id === 'complete'))) result.fail('Canvas final completion contract differs');
      for (const profile of Object.values(profiles)) {
        for (const id of profile.artifacts) {
          const artifact = data.artifacts.find(item => item.id === id);
          if (!artifact || JSON.stringify(artifact.recordContract) !== JSON.stringify(profile)) result.fail(id + ' canvas record contract differs');
        }
      }
      for (const id of ['owner-waiver', 'owner-walkthrough-decline']) {
        if (!data.artifacts.some(item => item.id === id)) result.fail('Missing conditional artifact ' + id);
      }
    }
    result.summary = 'Record boundaries, naming, phases and acceptance/completion semantics are synchronized';
  } catch (error) { result.fail(error.message); }
  return result;
}
module.exports = { reconcile, auditPresentationContract };

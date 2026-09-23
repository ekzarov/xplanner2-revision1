'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { AuditResult, parseArgs, printResult, rejectGovernedOverrides } = require('./lib');
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

function loadContract(root) {
  require('./process-contract').synchronize(root, true);
  const contract = JSON.parse(read(path.join(root, 'analysis/stage-gates.json')));
  const scripts = JSON.parse(read(path.join(root, 'analysis/tools/package.json'))).scripts;
  const expected = [...Array.from({ length: 20 }, (_, n) => 'stage-' + String(n).padStart(2, '0')), 'complete'];
  if (JSON.stringify(contract.stages.map(row => row.id)) !== JSON.stringify(expected)) throw new Error('Gate contract must cover Bootstrap, every stage and final completion in order');
  for (const row of contract.stages) {
    if (!row.label || !row.requirements?.en || !row.requirements?.ru || !Array.isArray(row.checks)) throw new Error('Incomplete gate row ' + row.id);
    if (new Set(row.checks).size !== row.checks.length) throw new Error('Duplicate check in ' + row.id);
    for (const check of row.checks) if (!scripts[check]) throw new Error('Unknown command ' + check);
  }
  if (JSON.stringify(contract.stages[19].checks) !== '["audit:stage19"]' ||
      JSON.stringify(contract.stages[20].checks) !== '["audit:all"]') throw new Error('Slice acceptance and final completion must remain separate');
  return contract;
}

function replaceBlock(source, marker, fallbackStart, fallbackEnd, generated) {
  const startMarker = '<!-- ' + marker + '_START -->';
  const endMarker = '<!-- ' + marker + '_END -->';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if ((start >= 0) !== (end >= 0) || (start >= 0 && end < start)) throw new Error('Broken markers: ' + marker);
  const wrapped = startMarker + '\n' + generated + '\n' + endMarker;
  if (start >= 0) return source.slice(0, start) + wrapped + source.slice(end + endMarker.length);
  if (fallbackStart < 0 || fallbackEnd < fallbackStart) throw new Error('Missing insertion point: ' + marker);
  return source.slice(0, fallbackStart) + wrapped + source.slice(fallbackEnd);
}

function renderedFiles(root) {
  const { stages } = loadContract(root);
  const outputs = new Map();
  const markdown = '| Close before leaving | Required automated evidence |\n|---|---|\n' +
    stages.map(row => '| ' + row.label + ' | ' + [...row.checks.map(check => '`' + check + '`'), row.requirements.en].join('; ').replace(/\|/g, '\\|') + ' |').join('\n');
  for (const [file, heading] of [['MIGRATION.md', '## Stage Gate Matrix'], ['analysis/migration_methodology.md', '## Automated gate matrix']]) {
    const text = read(path.join(root, file));
    const headingAt = text.indexOf(heading);
    if (headingAt < 0) throw new Error(file + ' has no gate matrix');
    const start = text.indexOf('| Close before leaving', headingAt);
    const end = text.indexOf('\n\n', start);
    outputs.set(file, replaceBlock(text, 'STAGE_GATE_MATRIX', start, end, markdown));
  }
  const htmlFile = 'analysis/migration_methodology.html';
  const html = read(path.join(root, htmlFile));
  const headingAt = html.indexOf('Automated gate matrix</h2>');
  if (headingAt < 0) throw new Error('HTML has no gate matrix');
  const start = html.indexOf('<table>', headingAt);
  const end = html.indexOf('</table>', start) + '</table>'.length;
  const table = '<table data-contract="stage-gates">\n<tr><th>Close before leaving</th><th>Mandatory automated evidence</th></tr>\n' +
    stages.map(row => '<tr data-stage="' + row.id + '"><td>' + esc(row.label) + '</td><td>' +
      row.checks.map(check => '<code>' + esc(check) + '</code>').join('; ') +
      (row.checks.length ? '; ' : '') + esc(row.requirements.en) + '</td></tr>').join('\n') + '\n</table>';
  outputs.set(htmlFile, replaceBlock(html, 'STAGE_GATE_MATRIX', start, end, table));

  const drawioFile = 'analysis/migration_artifact_flow.drawio';
  const drawio = read(path.join(root, drawioFile));
  const cells = stages.map((row, index) => '<mxCell id="gate-contract-' + row.id + '" parent="1" vertex="1" value="' +
    esc('<b>' + esc(row.label) + '</b><br/>' + row.checks.map(esc).join('; ') + '<br/>' + esc(row.requirements.en)) +
    '" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=12;fontSize=15;fillColor=#f5f7fa;strokeColor=#cbd5df;"><mxGeometry x="40" y="' +
    (70 + index * 180) + '" width="1120" height="160" as="geometry"/></mxCell>').join('\n');
  const diagram = '<diagram id="stage-gate-contract" name="Canonical stage gates"><mxGraphModel grid="1" page="1" pageWidth="1200" pageHeight="4100"><root><mxCell id="0"/><mxCell id="1" parent="0"/>' +
    '<mxCell id="gate-contract-heading" parent="1" vertex="1" value="Stage gates: slice acceptance is not global completion" style="text;html=1;fontSize=22;fontStyle=1;align=left;"><mxGeometry x="40" y="20" width="1120" height="40" as="geometry"/></mxCell>\n' +
    cells + '\n</root></mxGraphModel></diagram>';
  const insert = drawio.indexOf('</mxfile>');
  let renderedDrawio = replaceBlock(drawio, 'STAGE_GATE_MATRIX', insert, insert, diagram + '\n');
  const delivery = stages.find(row => row.id === 'stage-18');
  const acceptance = stages.find(row => row.id === 'stage-19');
  const overview = '<font face="Courier New"><b>18 ' + delivery.checks.map(check => check.replace(/^audit:/, '')).join(' · ') +
    '<br>19 ' + acceptance.checks.join(' · ') + ' · clean independent pass</b></font><br>' +
    '<font color="#5D6C7B" style="font-size:9px">audit:stage19 before owner acceptance; audit:all only after owner-approved final complete</font>';
  renderedDrawio = renderedDrawio.replace(/(<mxCell id="c162"[^>]* value=")[^"]*(")/, (_, before, after) => before + esc(overview) + after);
  outputs.set(drawioFile, renderedDrawio);
  return outputs;
}

function auditStageGates({ root = path.resolve(__dirname, '..', '..') } = {}) {
  const result = new AuditResult('STAGE GATE SYNC AUDIT');
  try {
    for (const [file, expected] of renderedFiles(root)) {
      if (read(path.join(root, file)) !== expected) result.fail(file + ' stage gate matrix differs from analysis/stage-gates.json');
    }
    result.summary = 'Bootstrap, 19 stages and final completion match across MD, HTML and Draw.io';
  } catch (error) { result.fail(error.message); }
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root'], ['AUDIT_ROOT']);
  const root = path.resolve(args.root || path.join(__dirname, '..', '..'));
  if (args.write) {
    require('./process-contract').synchronize(root, false);
    for (const [file, text] of renderedFiles(root)) fs.writeFileSync(path.join(root, file), text);
    console.log('Stage gate views synchronized');
  } else process.exitCode = printResult(auditStageGates({ root }));
}

module.exports = { loadContract, renderedFiles, auditStageGates };

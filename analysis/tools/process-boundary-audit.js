'use strict';

const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const { AuditResult } = require('./lib');

const CONTRACT_FILES = [
  'analysis/migration_methodology.md',
  'analysis/migration_methodology.html',
  'analysis/migration_artifact_flow.drawio',
  'analysis/migration_status.schema.json',
  'analysis/legacy_user_flows_template_instructions.md',
  'analysis/architecture/README.md',
  '.specify/templates/tasks-template.md',
];

function auditProcessBoundaries({ root }) {
  const result = new AuditResult('PROCESS BOUNDARY AUDIT');
  const files = {};
  for (const file of CONTRACT_FILES) {
    const absolute = path.join(root, file);
    if (!fs.existsSync(absolute)) result.fail('Missing process boundary input: ' + file);
    else files[file] = fs.readFileSync(absolute, 'utf8');
  }
  if (!result.ok) return result;

  const html = cheerio.load(files['analysis/migration_methodology.html']);
  const diagram = cheerio.load(files['analysis/migration_artifact_flow.drawio'], { xmlMode: true });
  const diagramText = diagram('mxCell[value]').map((_, cell) => diagram(cell).attr('value')).get().join(' ');
  const visible = {
    ...files,
    'analysis/migration_methodology.html': html('body').text(),
    'analysis/migration_artifact_flow.drawio': cheerio.load(diagramText).text(),
  };
  // These are known semantic regressions, not a claim to validate arbitrary prose.
  const forbidden = [
    [/fills (?:only affected NFR )?sdd links|fills the sdd links|adds sdd links/i, 'SDD must not add links to the approved manifest'],
    [/sdd links of the affected NFRs|NFRs receive sdd links/i, 'NFR ownership belongs in downstream traceability'],
    [/evidence links of the affected NFRs in .*?architecture-nfr-manifest\.json.*?updated/i, 'Execution evidence must not mutate approved architecture'],
    [/tokens to the running UI/i, 'Stage 16 checks SDD before UI implementation'],
    [/never as open SDD tasks|Do not keep a post-deployment (?:reconciliation task|checkbox) open/i, 'Stage 17 permits named delivery tasks pending Stage 18 evidence'],
    [/before the acceptance signature/i, 'Final aggregate must not precede owner acceptance'],
  ];
  for (const [file, content] of Object.entries(visible)) {
    const normalized = content.replace(/[`*]/g, '').replace(/\s+/g, ' ');
    for (const [pattern, message] of forbidden) if (pattern.test(normalized)) result.fail(file + ': ' + message);
  }

  const schema = JSON.parse(files['analysis/migration_status.schema.json']);
  const targets = new Set();
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.properties?.from?.const === 'stage-09') {
      for (const target of node.properties.to?.enum || []) targets.add(target);
    }
    for (const child of Object.values(node)) visit(child);
  }
  visit(schema);
  for (const target of ['stage-05', 'stage-06']) {
    if (!targets.has(target)) result.fail('Stage 9 must allow the governed return to ' + target);
  }
  const stage9 = html('#ph9').text();
  for (const stage of ['Stage 6', 'Stage 5', 'Stages 7-8']) {
    if (!stage9.includes(stage)) result.fail('Stage 9 presentation omits ' + stage + ' return/control path');
  }
  const stage16 = html('#ph16').text();
  if (!/planned visual tests|planned visual checks/i.test(stage16) || !stage16.includes('Stage 17') || !stage16.includes('Stage 18')) {
    result.fail('Stage 16 presentation must distinguish planned, implemented and deployed UI checks');
  }
  const candidate = diagram('mxCell[id="c141"]').attr('value') || '';
  if (candidate.includes('audit:sdd:complete') || /every slice task is closed|rows have turned green/.test(candidate)) {
    result.fail('Stage 17 diagram falsely claims delivered completion');
  }
  if (!candidate.includes('Stage 18') || !candidate.includes('audit:sdd')) {
    result.fail('Stage 17 diagram must distinguish candidate checks from Stage 18 delivery');
  }
  const acceptance = diagram('mxCell[id="c162"]').attr('value') || '';
  if (!acceptance.includes('audit:stage19') || !acceptance.includes('only after owner-approved final complete')) {
    result.fail('Stage 19 diagram must put audit:stage19 before acceptance and audit:all after final complete');
  }
  result.summary = 'NFR ownership, prototype returns, UI timing and delivery/acceptance boundaries checked';
  return result;
}

module.exports = { auditProcessBoundaries, CONTRACT_FILES };

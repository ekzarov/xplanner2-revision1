'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const MarkdownIt = require('markdown-it');
const YAML = require('yaml');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const guide = read('analysis/artifact-status-meanings.md');

function templates() {
  return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
    .trim().split(/\r?\n/)
    .filter(file => fs.existsSync(path.join(root, file)) && file.endsWith('.md') && (
      (file.startsWith('analysis/') && file.includes('/templates/')) ||
      /^\.specify\/templates\/(spec|plan|tasks)-template\.md$/.test(file) ||
      /^analysis\/reviews\/(stage-NN-pass-NNN-template|review_template)\.md$/.test(file) ||
      file === 'analysis/legacy_reconnaissance.template.md' ||
      file === 'specs/traceability.template.md'
    ));
}

test('all governed Markdown templates explain their status or evidence boundary', () => {
  const files = templates();
  assert.equal(files.length, 30);
  const md = new MarkdownIt({ html: true });
  for (const file of files) {
    const text = read(file);
    assert.equal((text.match(/\*\*Reading statuses:\*\*/g) || []).length, 1, file);
    assert.match(text, /\[Status meanings\]\(https:\/\/github\.com\/olsys-ltd\/legacy-modernization-starter\/blob\/main\/analysis\/artifact-status-meanings\.md\)/, file);
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatter) assert.doesNotThrow(() => YAML.parse(frontmatter[1]), file);
    const rendered = md.render(text.replace(/^---\r?\n[\s\S]*?\r?\n---/, ''));
    assert.match(rendered, /<strong>Reading statuses:<\/strong>/, file);
    assert.ok(!rendered.includes('[//]'), file + ' must not expose guidance markers');
  }
});

test('every canonical stage, slice and review status has a parenthetical definition', () => {
  const schema = JSON.parse(read('analysis/migration_status.schema.json'));
  const values = new Set();
  function visit(node, location = '') {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node.enum) && /status|result|outcome|gateResult/.test(location)) {
      node.enum.filter(value => typeof value === 'string').forEach(value => values.add(value));
    }
    for (const [key, child] of Object.entries(node)) visit(child, location + '.' + key);
  }
  visit(schema);
  assert.ok(values.size >= 20);
  for (const value of values) {
    assert.ok(guide.split(/\r?\n/).some(line =>
      line.includes('`' + value + '`') && line.includes('| (')), value);
  }
});

test('all companion guides and process entry points explain technical statuses', () => {
  const files = [
    'MIGRATION.md', 'ARTIFACTS.md', 'analysis/artifact-result-boundaries.md',
    'analysis/migration_methodology.md', 'analysis/architecture/README.md',
    'analysis/architecture/architecture-nfr-decision-register-instructions.md',
    'analysis/prototyping/README.md', 'analysis/knowledge/README.md',
    'analysis/inventories/README.md', 'analysis/reviews/README.md',
    'analysis/stages/README.md', 'analysis/legacy_user_flows_template_instructions.md',
    'specs/README.md'
  ];
  for (const file of files) {
    assert.match(read(file), /\*\*Reading technical statuses\.\*\*/, file);
    const match = read(file).match(/\[Status meanings\]\(([^)]+)\)/);
    assert.ok(match, file);
    assert.equal(path.resolve(root, path.dirname(file), match[1]),
      path.join(root, 'analysis/artifact-status-meanings.md'), file);
  }
  assert.match(read('analysis/migration_methodology.html'), /Reading technical statuses/);
  assert.match(guide, /Keep parser-consumed fields, standalone verdict lines/);
  assert.match(guide, /without rewriting its bytes/);
  assert.match(guide, /must not invent a decision/);
});

test('owner-review explanations preserve standalone parser-consumed verdicts', () => {
  assert.match(read('analysis/architecture/templates/architecture-nfr-owner-review-template.md'),
    /^## Verdict\s*\r?\n+\x60pending\x60\s*\r?\n+\(The owner/m);
  const example = path.join(root, 'analysis/architecture/architecture-nfr-owner-review.md');
  if (!fs.existsSync(example)) return;
  const body = fs.readFileSync(example, 'utf8');
  assert.match(body, /^## Foundation Verdict\s*\r?\n+\s*\x60?approved-for-delivery\x60?\s*$/im);
  assert.match(body, /^\x60architecture-current-roadmap-pending\x60\s*\r?\n+\(Partial approval:/m);
  assert.match(body, /\(Limited permission: only/);
});

test('3D artifact cards expose localized status guidance without changing enum values', () => {
  const app = path.join(root, 'analysis/process-canvas/app.js');
  if (!fs.existsSync(app)) return;
  const source = fs.readFileSync(app, 'utf8');
  const russian = JSON.parse(read('analysis/process-canvas/translations.ru.json'));
  for (const key of ['statusMeanings', 'statusMeaningsText', 'openStatusMeanings']) {
    assert.ok(russian.ui[key], key);
    assert.ok(source.includes("tr('" + key + "')"), key);
  }
  assert.match(source, /artifact-status-meanings\.md/);
});

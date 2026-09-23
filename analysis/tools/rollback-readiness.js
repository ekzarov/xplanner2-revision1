'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const { PLACEHOLDER, sha256File } = require('./lib');
const markdown = new MarkdownIt();

const requiredFields = [
  'Recovery strategy', 'Governed command or procedure', 'Checked revision',
  'Environment ID', 'Verified at', 'Performed by', 'Recovery target',
  'Preconditions and data compatibility', 'Validation mode',
  'Validation performed for this revision', 'Expected outcome', 'Observed outcome',
  'Result', 'Limitations', 'Evidence',
];

function rollbackReadinessErrors({ root, record, body, revision, environmentId }) {
  const errors = [];
  const fail = message => errors.push('Rollback Readiness: ' + message);
  const tokens = markdown.parse(body, {});
  const headings = tokens.flatMap((token, index) => token.type === 'heading_open'
    && token.tag === 'h2' && tokens[index + 1]?.content === 'Rollback Readiness' ? [index] : []);
  if (headings.length !== 1) {
    fail('exactly one required section is missing or duplicated. Use the Stage 18 delivery template; historical reports are not silently upgraded.');
    return errors;
  }
  const start = headings[0] + 3;
  const end = tokens.findIndex((token, index) => index >= start && token.type === 'heading_open' && ['h1', 'h2'].includes(token.tag));
  const contents = tokens.slice(start, end < 0 ? undefined : end);
  const fields = new Map();
  for (const token of contents.filter(item => item.type === 'inline')) {
    const colon = token.content.indexOf(':');
    const name = token.content.slice(0, colon);
    if (![...requiredFields, 'Evidence SHA-256'].includes(name)) continue;
    if (fields.has(name)) fail('duplicate field ' + name);
    fields.set(name, token.content.slice(colon + 1).trim().replace(/^`([^`]+)`$/, '$1'));
  }
  for (const name of requiredFields) {
    const value = fields.get(name);
    if (!value || PLACEHOLDER.test(value) || /<[^>\n]+>/.test(value) || /^(?:-|n\/a|tbd|todo|pending)$/i.test(value)) fail(name + ' must contain an explicit value.');
  }
  if (!['rollback', 'forward-recovery'].includes(fields.get('Recovery strategy'))) fail('Recovery strategy must be rollback or forward-recovery.');
  if (!['controlled-rehearsal', 'readiness-check'].includes(fields.get('Validation mode'))) fail('Validation mode must distinguish controlled-rehearsal from readiness-check.');
  if (!/^[a-f0-9]{7,40}$/i.test(fields.get('Checked revision') || '') || fields.get('Checked revision') !== revision) fail('Checked revision must exactly match Deployed revision.');
  if (fields.get('Environment ID') !== environmentId) fail('Environment ID must match the delivery environment.');
  const verifiedAt = fields.get('Verified at') || '';
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(verifiedAt)
    || !Number.isFinite(Date.parse(verifiedAt)) || Date.parse(verifiedAt) > Date.now()) fail('Verified at must be a past ISO timestamp with timezone.');
  if (fields.get('Result') !== 'passed') fail('only passed permits delivery closure; failed, blocked and not-run remain open.');

  const evidence = fields.get('Evidence');
  if (evidence === 'inline') {
    const raw = contents.filter(token => token.type === 'fence');
    if (!raw.some(token => token.content.trim() && !PLACEHOLDER.test(token.content))) fail('inline evidence requires non-placeholder recorded output in a fenced block in this section.');
    if (fields.has('Evidence SHA-256')) fail('inline evidence must not hash the enclosing record itself.');
  } else if (evidence) {
    const inline = markdown.parseInline(evidence, {})[0]?.children || [];
    const links = inline.filter(token => token.type === 'link_open');
    if (links.length !== 1) fail('Evidence must be inline or one local Markdown link to a durable evidence file.');
    else {
      try {
        const href = decodeURIComponent(links[0].attrGet('href'));
        if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || /^[\\/]/.test(href) || /[?#]/.test(href)) throw Error('use a relative local file link without query or fragment');
        const file = fs.realpathSync(path.resolve(path.dirname(record), href));
        const relative = path.relative(fs.realpathSync(root), file);
        if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw Error('evidence escapes the repository');
        if (file === fs.realpathSync(record)) throw Error('the report cannot reference itself as external evidence');
        if (!fs.statSync(file).isFile() || fs.statSync(file).size === 0) throw Error('evidence must be a non-empty file');
        const digest = fields.get('Evidence SHA-256') || '';
        if (!/^[a-f0-9]{64}$/i.test(digest) || sha256File(file).toLowerCase() !== digest.toLowerCase()) throw Error('Evidence SHA-256 is missing or does not match the referenced file');
      } catch (error) { fail('invalid evidence: ' + error.message); }
    }
  }
  return errors;
}

module.exports = { rollbackReadinessErrors, requiredFields };

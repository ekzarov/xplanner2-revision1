'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const { githubSlug } = require('./methodology-link-audit');
const markdown = new MarkdownIt({ html: true });
const START = '<!-- ARTIFACT_READING_START -->';
const END = '<!-- ARTIFACT_READING_END -->';
const NOTES_START = '<!-- ARTIFACT_AUTHORING_NOTES_START -->';
const NOTES_END = '<!-- ARTIFACT_AUTHORING_NOTES_END -->';
const guidePattern = /(?:<!-- ARTIFACT_USE_START -->|\[\/\/\]: # \(ARTIFACT_USE_START\))[\s\S]*?(?:<!-- ARTIFACT_USE_END -->|\[\/\/\]: # \(ARTIFACT_USE_END\))/;
const readingPattern = /<!-- ARTIFACT_READING_START -->[\s\S]*?<!-- ARTIFACT_READING_END -->\s*/;
const notesPattern = /<!-- ARTIFACT_AUTHORING_NOTES_START -->[\s\S]*?<!-- ARTIFACT_AUTHORING_NOTES_END -->\s*/;
const generatedAnchor = /^<a id="read-[^"]+"><\/a>\s*\n/gm;

function plain(value) {
  const inline = markdown.parseInline(value, {})[0];
  return (inline?.children || []).map(token =>
    ['text', 'code_inline'].includes(token.type) ? token.content :
      ['softbreak', 'hardbreak'].includes(token.type) ? ' ' : '').join('').trim();
}

function compact(value, limit = 300) {
  const text = plain(value).replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  const sentences = Array.from(new Intl.Segmenter('en', { granularity: 'sentence' }).segment(text),
    entry => entry.segment);
  let result = '';
  for (const sentence of sentences) {
    if ((result + sentence).length > limit) break;
    result += sentence;
  }
  return result.trim() || text.slice(0, limit).replace(/\s+\S*$/, '') + '...';
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n[\s\S]*?\n---(?:\n|$)/);
  return match ? { prefix: match[0].trimEnd() + '\n\n', body: source.slice(match[0].length) }
    : { prefix: '', body: source };
}

function tidySpacing(body) {
  const protectedLines = new Set();
  for (const token of markdown.parse(body, {})) {
    if (!['fence', 'code_block'].includes(token.type) || !token.map) continue;
    for (let line = token.map[0]; line < token.map[1]; line++) protectedLines.add(line);
  }
  const lines = body.split('\n');
  return lines.filter((line, index) => protectedLines.has(index) ||
    line.trim() || index === 0 || lines[index - 1].trim() || protectedLines.has(index - 1)).join('\n');
}

function headings(body) {
  const tokens = markdown.parse(body, {});
  const seen = new Map();
  const result = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== 'heading_open' || !token.map) continue;
    const title = plain(tokens[index + 1]?.content || '');
    const stem = 'read-' + (githubSlug(title) || 'section');
    const count = seen.get(stem) || 0;
    seen.set(stem, count + 1);
    result.push({ title, level: Number(token.tag.slice(1)), line: token.map[0],
      anchor: count ? stem + '-' + count : stem });
  }
  return result;
}

function navigation(body) {
  const sections = headings(body).filter(item => item.level >= 2 && item.level <= 3);
  const lines = body.split('\n');
  for (const section of [...sections].reverse()) {
    lines.splice(section.line, 0, '<a id="' + section.anchor + '"></a>', '');
  }
  const links = sections.map(section => (section.level === 3 ? '  ' : '') +
    '- [' + section.title.replace(/([\[\]])/g, '\\$1') + '](#' + section.anchor + ')');
  return { body: lines.join('\n'), sections,
    contents: '<details>\n<summary><strong>Contents</strong></summary>\n\n' +
      (links.join('\n') || 'This is a short record without subsections.') + '\n\n</details>' };
}

function sectionText(body, titles) {
  const tokens = markdown.parse(body, {});
  let selected = false;
  const results = [];
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type === 'heading_open') {
      selected = titles.some(title => plain(tokens[index + 1]?.content || '').toLowerCase() === title);
      index += 2;
    } else if (selected && tokens[index].type === 'inline' && tokens[index - 1]?.type === 'paragraph_open' && tokens[index].content) {
      results.push(compact(tokens[index].content));
    }
  }
  return results.filter(Boolean).slice(0, 3);
}

function recordedResult(body, file, reference = false) {
  if (reference) return { color: 'NOTE', title: 'Reference, not an execution verdict',
    statement: 'This document describes rules or supporting context. It does not record a completed check or grant approval.' };
  const dedicated = sectionText(body, ['current verdict', 'verdict', 'final verdict', 'overall verdict']);
  const metadata = [];
  for (const line of body.split('\n')) {
    const match = line.replace(/\*\*/g, '').match(/^(?:>\s*)?(?:[-*]\s+)?(?:(?:Overall|Gate|Final) )?(Result|Verdict|Outcome|Status)\s*:\s*(.+)$/i);
    if (match) metadata.push(compact(match[2]));
  }
  const candidates = dedicated.length ? dedicated : metadata;
  const recognized = candidates.filter(value =>
    /^(?:clean|findings|not clean|blocked|invalid|pending|approved|accepted|draft|proposed|architecture-current-roadmap-pending|passed|failed|authored|delivered|deployed|live-verified|partial-simulated|blocked-waived|ready|changes required|no findings)\b/i.test(value));
  const literal = recognized[0];
  if (!dedicated.length && new Set(recognized.map(value => value.toLowerCase())).size > 1) {
    return { color: 'WARNING', title: 'Several scoped results: read the boundary',
      statement: recognized.slice(0, 3).join('; ') + '. These results belong to separate checks or scopes, not one overall approval.' };
  }
  const isReview = /\/reviews\/|review-verdict|nfr-owner-review|\/(?:ui-ux-)?approval\.md$/.test(file);
  if (literal) {
    if (/^(?:findings|not clean|blocked(?!-waived)|invalid|failed|changes required)\b/i.test(literal)) {
      return { color: 'CAUTION', title: 'Recorded result: action required', statement: literal };
    }
    if (/^(?:pending|draft|proposed|architecture-current-roadmap-pending|partial-simulated|blocked-waived|ready)/i.test(literal)) {
      return { color: 'WARNING', title: 'Recorded result: incomplete or conditional', statement: literal };
    }
    if (isReview && /^(?:clean|approved|accepted|no findings)\b/i.test(literal)) {
      return { color: 'TIP', title: 'Positive result recorded for the stated scope', statement: literal };
    }
    return { color: 'NOTE', title: 'Recorded state, not a whole-project verdict', statement: literal };
  }
  const conclusion = sectionText(body, ['conclusion and next gate', 'conclusion', 'final assessment',
    'gate result', 'decision summary', 'executive summary', 'summary', 'decision']);
  return { color: 'NOTE', title: 'Read this record within its stated scope',
    statement: conclusion[0] || 'This document does not establish one unambiguous overall verdict. Its detailed observations and decisions remain authoritative.' };
}

function panel({ body, profile, file, template, sections, editorialRecord, summary }) {
  const result = summary || (template
    ? { color: 'WARNING', title: 'Template: not yet assessed', statement: profile.remaining }
    : recordedResult(body, file, profile?.kind === 'reference'));
  const relevant = [profile?.resultSection, profile?.nextSection,
    'Coverage Summary', 'Findings', 'Known Gaps And Blockers', 'Conclusion and Next Gate',
    'Gate Result', 'Current Verdict', 'Verdict', 'Open And Deferred Items',
    'Source state and findings', 'Coverage still required', 'Summary'];
  const selected = [];
  for (const name of relevant.filter(Boolean)) {
    const item = sections.find(section => section.title.toLowerCase() === name.toLowerCase());
    if (item && !selected.includes(item)) selected.push(item);
    if (selected.length === 3) break;
  }
  if (!selected.length) selected.push(...sections.slice(0, 2));
  const links = selected.map(item => '[' + item.title.replace(/([\[\]])/g, '\\$1') +
    '](#' + item.anchor + ')').join(' / ');
  const statistics = sectionText(body, ['coverage summary', 'verification boundary',
    'walkthrough outcome summary', 'reconciliation summary and unverified scope'])
    .find(value => /\b\d+\b/.test(value) && !/<|not.checked|pending|template/i.test(value));
  return [
    '> [!' + result.color + ']',
    '> **' + result.title + '**',
    '>',
    '> ' + result.statement.replace(/[\r\n]+/g, ' '),
    ...(template ? ['>', '> **Next:** ' + profile.next] : []),
    ...(!template && statistics ? ['>', '> **Numbers recorded:** ' + compact(statistics, 180)] : []),
    ...(links ? ['>', '> **Details:** ' + links + '.'] : []),
    ...(!template ? ['>', '> **Scope:** this record only. Formatting is not a new review or approval.' +
      (editorialRecord ? ' [Editorial authorization](' + editorialRecord + ').' : '')] : [])
  ].join('\n');
}

function formatArtifact(source, options) {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  let text = source.replace(/\r\n/g, '\n');
  const frontmatter = splitFrontmatter(text);
  text = frontmatter.body;
  let previousNotes = '';
  text = text.replace(notesPattern, block => {
    previousNotes = block.replace(NOTES_START, '').replace(NOTES_END, '')
      .replace(/<\/?details>/g, '').replace(/<summary>[\s\S]*?<\/summary>/, '').trim();
    return '';
  }).replace(readingPattern, '').replace(generatedAnchor, '');
  let guide = '';
  text = text.replace(guidePattern, block => { guide = block.trim(); return ''; });
  const firstHeading = markdown.parse(text, {}).find(token => token.type === 'heading_open' && token.tag === 'h1');
  let title;
  if (firstHeading) {
    const lines = text.split('\n');
    title = lines.splice(firstHeading.map[0], firstHeading.map[1] - firstHeading.map[0]).join('\n');
    text = lines.join('\n');
  } else title = '# ' + path.basename(options.file, '.md').replace(/[-_]/g, ' ');
  const notes = previousNotes ? [previousNotes] : [];
  if (options.template) {
    text = text.replace(/^> \*\*(?:Reading statuses:|Template output:)\*\*[^\n]*(?:\n>[^\n]*)*/gm,
      block => { notes.push(block); return ''; });
  }
  let question = options.profile?.question;
  const existingQuestion = text.match(/^\s*\*\*([^*\n]+\?)\*\*\s*/);
  if (existingQuestion) {
    question = existingQuestion[1];
    text = text.slice(existingQuestion[0].length);
  }
  if (question) {
    text = text.replace(/^\*\*([^*\n]+)\*\*\s*$/gm, (line, value) =>
      value.trim() === question ? '' : line);
  }
  text = tidySpacing(text).trim();
  const nav = navigation(text);
  const summary = panel({ ...options, body: frontmatter.prefix + text, sections: nav.sections });
  const parts = [
    title.trim(),
    ...(question ? ['**' + question + '**'] : []),
    ...(guide ? [guide] : []),
    ...(notes.length ? [NOTES_START + '\n<details>\n<summary><strong>Template and status notes</strong></summary>\n\n' +
      notes.join('\n\n') + '\n\n</details>\n' + NOTES_END] : []),
    START + '\n' + summary + '\n\n' + nav.contents + '\n' + END,
    nav.body.trim()
  ];
  return (frontmatter.prefix + parts.join('\n\n') + '\n').replace(/\n/g, eol);
}

function templateEntries(root) {
  const profiles = JSON.parse(fs.readFileSync(path.join(root, 'analysis/artifact-reading-profiles.json'), 'utf8'));
  return profiles.templates.map(profile => {
    const file = profile.paths.find(candidate => fs.existsSync(path.join(root, candidate)));
    if (!file) throw new Error('Missing template for ' + profile.id);
    return { file, profile };
  });
}

function synchronizeTemplates(root, write = false, allowedFiles = null) {
  let changed = 0;
  for (const { file, profile } of templateEntries(root)) {
    if (allowedFiles && !allowedFiles.has(file)) continue;
    const absolute = path.join(root, file);
    const current = fs.readFileSync(absolute, 'utf8');
    const next = formatArtifact(current, { file, profile, template: true });
    if (current !== next) {
      changed++;
      if (write) fs.writeFileSync(absolute, next);
    }
  }
  return { count: templateEntries(root).length, changed };
}

function readabilityErrors(source, file) {
  const errors = [];
  const normalized = source.replace(/\r\n/g, '\n');
  const block = normalized.match(readingPattern)?.[0];
  if (!block) return [file + ': missing first-screen summary and Contents'];
  if (!/^> \[!(?:CAUTION|WARNING|TIP|NOTE)\]$/m.test(block)) errors.push(file + ': missing supported summary alert');
  if (!block.includes('<strong>Contents</strong>')) errors.push(file + ': missing Contents');
  for (const section of headings(splitFrontmatter(normalized).body).filter(item => item.level === 2 || item.level === 3)) {
    const label = '[' + section.title.replace(/([\[\]])/g, '\\$1') + '](#read-';
    if (!block.includes(label)) errors.push(file + ': section missing from Contents: ' + section.title);
  }
  const anchors = new Set(Array.from(normalized.matchAll(/<a id="(read-[^"]+)"><\/a>/g), match => match[1]));
  for (const match of block.matchAll(/\]\(#(read-[^)]+)\)/g)) {
    if (!anchors.has(match[1])) errors.push(file + ': missing reading anchor ' + match[1]);
  }
  if ((normalized.match(/<!-- ARTIFACT_READING_START -->/g) || []).length !== 1) errors.push(file + ': duplicate reading summary');
  return errors;
}

function auditArtifactReading({ root }) {
  const errors = [];
  try {
    for (const { file, profile } of templateEntries(root)) {
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      errors.push(...readabilityErrors(source, file));
      if (source !== formatArtifact(source, { file, profile, template: true })) {
        errors.push(file + ': template reading structure is stale');
      }
    }
    const constitution = '.specify/memory/constitution.md';
    if (fs.existsSync(path.join(root, constitution))) {
      errors.push(...readabilityErrors(fs.readFileSync(path.join(root, constitution), 'utf8'), constitution));
    }
  } catch (error) { errors.push(error.message); }
  return { ok: errors.length === 0, errors };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '../..');
  const write = process.argv.includes('--write-templates');
  const fileIndex = process.argv.indexOf('--file');
  if (fileIndex !== -1) {
    const file = process.argv[fileIndex + 1];
    if (!file) throw new Error('--file requires a repository-relative Markdown path');
    const absolute = path.resolve(root, file);
    if (!absolute.startsWith(root + path.sep) || !file.endsWith('.md')) throw new Error('Invalid artifact path');
    const errors = readabilityErrors(fs.readFileSync(absolute, 'utf8'), file);
    console.log(JSON.stringify({ file, errors }));
    if (errors.length) process.exitCode = 1;
  } else if (write) {
    console.log(JSON.stringify({ ...synchronizeTemplates(root, true), mode: 'format' }));
  } else {
    const result = auditArtifactReading({ root });
    console.log(JSON.stringify(result));
    if (!result.ok) process.exitCode = 1;
  }
}

module.exports = { auditArtifactReading, readabilityErrors, formatArtifact, headings, navigation, panel, recordedResult,
  sectionText, splitFrontmatter, synchronizeTemplates, templateEntries };

#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { architecturePath } = require('./architecture-paths');
const { parseArgs, rejectGovernedOverrides, walkFiles } = require('./lib');

const ROOT_PATH = /^(?:\.\.?\/)*(?:analysis|specs|config|build|src|legacy|tests|docs|\.specify)\//;
const PLACEHOLDER = /[*{}<> ]/;
const SKIPPED_DIRECTORIES = [
  '.git/',
  '.migration-tmp/',
  'node_modules/',
  'analysis/architecture/archive/',
];

function canonical(root, file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function pinnedMarkdownFiles(root) {
  const result = new Set();
  const manifestPath = path.join(root, 'analysis', 'architecture', 'architecture-nfr-manifest.json');
  if (!fs.existsSync(manifestPath)) return result;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const entry of manifest.files || []) {
    if (path.extname(entry.path).toLowerCase() !== '.md') continue;
    result.add(path.resolve(path.dirname(manifestPath), entry.path));
    result.add(path.resolve(path.dirname(manifestPath), architecturePath(entry.path)));
  }
  return result;
}

function documentFiles(root) {
  const pinned = pinnedMarkdownFiles(root);
  return walkFiles(root).filter((file) => {
    if (path.extname(file).toLowerCase() !== '.md') return false;
    const relative = canonical(root, file);
    if (SKIPPED_DIRECTORIES.some((prefix) => relative.startsWith(prefix))) return false;
    return !pinned.has(path.resolve(file));
  });
}

function splitReference(value) {
  const hash = value.indexOf('#');
  return hash === -1
    ? { pathname: value, fragment: '' }
    : { pathname: value.slice(0, hash), fragment: value.slice(hash) };
}

function resolveReference(root, sourceFile, value) {
  const trimmed = value.trim();
  if (!ROOT_PATH.test(trimmed) || PLACEHOLDER.test(trimmed)) return null;
  const { pathname, fragment } = splitReference(trimmed);
  const target = /^(?:analysis|specs|config|build|src|legacy|tests|docs|\.specify)\//.test(pathname)
    ? path.resolve(root, pathname)
    : path.resolve(path.dirname(sourceFile), pathname);
  const relativeTarget = path.relative(root, target);
  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget) || !fs.existsSync(target)) return null;
  let href = path.relative(path.dirname(sourceFile), target).replaceAll(path.sep, '/');
  if (!href.startsWith('.')) href = `./${href}`;
  return { value: trimmed, target, href: `${href}${fragment}` };
}

function insideMarkdownLink(line, start, end) {
  const before = line.slice(0, start);
  const open = before.lastIndexOf('[');
  const close = before.lastIndexOf(']');
  return open > close && line.indexOf('](', end) !== -1;
}

function lineReferences(root, sourceFile, line, lineNumber) {
  const references = [];
  for (const match of line.matchAll(/`([^`\r\n]+)`/g)) {
    const start = match.index;
    const end = start + match[0].length;
    if (insideMarkdownLink(line, start, end)) continue;
    const resolved = resolveReference(root, sourceFile, match[1]);
    if (!resolved) continue;
    references.push({
      ...resolved,
      file: sourceFile,
      line: lineNumber,
      start,
      end,
      original: match[0],
      replacement: `[\`${resolved.value}\`](${resolved.href})`,
    });
  }
  return references;
}

function inspectDocument(root, file, source = fs.readFileSync(file, 'utf8')) {
  const lines = source.split(/\r?\n/);
  const references = [];
  let fenced = false;
  lines.forEach((line, index) => {
    if (/^\s*(?:```|~~~)/.test(line)) {
      fenced = !fenced;
      return;
    }
    if (!fenced) references.push(...lineReferences(root, file, line, index + 1));
  });
  return { source, lines, references };
}

function scan(root) {
  const references = [];
  for (const file of documentFiles(root)) references.push(...inspectDocument(root, file).references);
  return references;
}

function linkedDocument(root, file, source) {
  const inspected = inspectDocument(root, file, source);
  const byLine = new Map();
  for (const reference of inspected.references) {
    if (!byLine.has(reference.line)) byLine.set(reference.line, []);
    byLine.get(reference.line).push(reference);
  }
  for (const [lineNumber, references] of byLine) {
    let line = inspected.lines[lineNumber - 1];
    for (const reference of references.sort((a, b) => b.start - a.start)) {
      line = `${line.slice(0, reference.start)}${reference.replacement}${line.slice(reference.end)}`;
    }
    inspected.lines[lineNumber - 1] = line;
  }
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  return inspected.lines.join(newline);
}

function rewrite(root, allowedFiles = null) {
  let changedFiles = 0;
  let changedReferences = 0;
  for (const file of documentFiles(root)) {
    if (allowedFiles && !allowedFiles.has(canonical(root, file))) continue;
    const inspected = inspectDocument(root, file);
    if (!inspected.references.length) continue;
    changedReferences += inspected.references.length;
    fs.writeFileSync(file, linkedDocument(root, file, inspected.source));
    changedFiles += 1;
  }
  return { changedFiles, changedReferences };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root'], ['AUDIT_ROOT']);
  const root = path.resolve(args.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  if (args.write) {
    const changed = rewrite(root);
    console.log(`Linked ${changed.changedReferences} repository reference(s) in ${changed.changedFiles} Markdown file(s).`);
  }
  const remaining = scan(root);
  if (!remaining.length) {
    console.log(`ARTIFACT REFERENCE LINK AUDIT OK: ${documentFiles(root).length} Markdown document(s) checked.`);
    return;
  }
  for (const reference of remaining.slice(0, 100)) {
    console.error(`FAIL: ${canonical(root, reference.file)}:${reference.line} repository path is not clickable: ${reference.value}`);
  }
  if (remaining.length > 100) console.error(`FAIL: ${remaining.length - 100} additional unlinked repository path(s).`);
  process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  documentFiles,
  inspectDocument,
  linkedDocument,
  lineReferences,
  pinnedMarkdownFiles,
  resolveReference,
  rewrite,
  scan,
};

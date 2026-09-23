#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const MarkdownIt = require('markdown-it');
const {
  AuditResult,
  STAGE_NAMES,
  parseArgs,
  printResult,
  rejectGovernedOverrides,
  resolveInside,
  walkFiles,
} = require('./lib');

const markdown = new MarkdownIt({ html: true, linkify: false, typographer: false });
const STARTER_GENERATED_DOCUMENTS = new Set([
  'analysis/legacy_user_flows.xlsx',
  'analysis/migration_status.yaml',
]);
// Mirror exemption: these exist only in the starter source repository and are
// never copied by the initializer, so an initialized project legitimately
// lacks them while ARTIFACTS.md still catalogs them. When present (starter
// source mode) they are validated like any other link target.
const STARTER_SOURCE_ONLY_DOCUMENTS = new Set([
  '.migration-starter-source',
  'tests/init-migration.Tests.ps1',
  'analysis/reviews/starter-governance-hardening-review.md',
]);

function githubSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function markdownStructure(file) {
  const source = fs.readFileSync(file, 'utf8');
  const tokens = markdown.parse(source, {});
  const headings = [];
  const links = [];
  const explicitAnchors = new Set();
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const html = token.type === 'html_block' ? [token.content]
      : (token.children || []).filter(child => child.type === 'html_inline').map(child => child.content);
    for (const fragment of html) {
      const $ = cheerio.load(fragment, {}, false);
      $('a[id], a[name]').each((_, element) => explicitAnchors.add($(element).attr('id') || $(element).attr('name')));
    }
    if (token.type === 'heading_open') {
      const inline = tokens[index + 1];
      if (inline && inline.type === 'inline') {
        headings.push({
          level: Number(token.tag.slice(1)),
          text: inline.content.trim(),
          anchor: githubSlug(inline.content),
        });
      }
    }
    if (token.type === 'inline' && token.children) {
      for (const child of token.children) {
        if (child.type === 'link_open') links.push(child.attrGet('href'));
      }
    }
  }
  return { source, headings, links, explicitAnchors };
}

function htmlStructure(file) {
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const ids = new Set();
  $('[id]').each((_, element) => ids.add($(element).attr('id')));
  const links = [];
  $('a[href]').each((_, element) => links.push($(element).attr('href')));
  return { $, ids, links };
}

function localTarget(sourceFile, href, root, result) {
  if (!href || /^(?:https?:|mailto:|tel:)/i.test(href)) return null;
  if (/^(?:javascript:|data:)/i.test(href)) {
    result.fail(`${path.relative(root, sourceFile)} contains unsafe link ${href}`);
    return null;
  }
  const hashIndex = href.indexOf('#');
  const pathname = decodeURIComponent(hashIndex === -1 ? href : href.slice(0, hashIndex));
  const anchor = hashIndex === -1 ? null : decodeURIComponent(href.slice(hashIndex + 1));
  if (pathname && (path.win32.isAbsolute(pathname) || path.posix.isAbsolute(pathname))) {
    result.fail(`${path.relative(root, sourceFile)} contains non-portable absolute local link ${href}`);
    return null;
  }
  const base = path.dirname(sourceFile);
  try {
    const absolute = pathname
      ? resolveInside(root, path.relative(root, path.resolve(base, pathname)), 'document link')
      : sourceFile;
    return { absolute, anchor };
  } catch (error) {
    result.fail(`${path.relative(root, sourceFile)}: ${error.message}`);
    return null;
  }
}

function validateLinks(root, files, result) {
  const structureCache = new Map();
  const getStructure = (file) => {
    if (!structureCache.has(file)) {
      structureCache.set(
        file,
        path.extname(file).toLowerCase() === '.md' ? markdownStructure(file) : htmlStructure(file)
      );
    }
    return structureCache.get(file);
  };

  for (const file of files) {
    let structure;
    try {
      structure = getStructure(file);
    } catch (error) {
      result.fail(`cannot parse ${path.relative(root, file)}: ${error.message}`);
      continue;
    }
    for (const href of structure.links) {
      const target = localTarget(file, href, root, result);
      if (!target) continue;
      if (!fs.existsSync(target.absolute)) {
        const relativeTarget = path.relative(root, target.absolute).replaceAll(path.sep, '/');
        if (STARTER_GENERATED_DOCUMENTS.has(relativeTarget)) continue;
        if (STARTER_SOURCE_ONLY_DOCUMENTS.has(relativeTarget)) continue;
        result.fail(`${path.relative(root, file)} links to missing ${href}`);
        continue;
      }
      if (!target.anchor || fs.statSync(target.absolute).isDirectory()) continue;
      const extension = path.extname(target.absolute).toLowerCase();
      if (!['.md', '.html', '.htm'].includes(extension)) continue;
      const targetStructure = getStructure(target.absolute);
      const anchors = extension === '.md'
        ? new Set([...targetStructure.headings.map((heading) => heading.anchor), ...targetStructure.explicitAnchors])
        : targetStructure.ids;
      if (!anchors.has(target.anchor)) {
        result.fail(`${path.relative(root, file)} links to missing anchor #${target.anchor} in ${path.relative(root, target.absolute)}`);
      }
    }
  }
}

function validateMethodology(methodologyFile, htmlFile, result) {
  if (!fs.existsSync(methodologyFile)) {
    result.fail(`canonical methodology is missing: ${methodologyFile}`);
    return;
  }
  if (!fs.existsSync(htmlFile)) {
    result.fail(`methodology presentation is missing: ${htmlFile}`);
    return;
  }

  const md = markdownStructure(methodologyFile);
  const stageHeadings = md.headings.filter((heading) => heading.level === 3 && /^Stage \d+\s/.test(heading.text));
  if (stageHeadings.length !== 19) {
    result.fail(`canonical methodology must contain exactly 19 Stage headings, found ${stageHeadings.length}`);
  }
  const seen = new Set();
  for (const heading of stageHeadings) {
    const match = heading.text.match(/^Stage (\d+) \u2014 (.+)$/);
    if (!match) {
      result.fail(`malformed stage heading "${heading.text}"; expected "Stage N — Name"`);
      continue;
    }
    const stage = Number(match[1]);
    if (seen.has(stage)) result.fail(`duplicate Stage ${stage} heading`);
    seen.add(stage);
    const expectedName = STAGE_NAMES[stage];
    if (match[2] !== expectedName && !match[2].startsWith(`${expectedName} (`)) {
      result.fail(`Stage ${stage} must be named "${STAGE_NAMES[stage]}", found "${match[2]}"`);
    }
  }
  for (let stage = 1; stage <= 19; stage += 1) {
    if (!seen.has(stage)) result.fail(`canonical methodology is missing Stage ${stage}`);
  }

  const html = htmlStructure(htmlFile);
  for (let stage = 1; stage <= 19; stage += 1) {
    const id = `st${String(stage).padStart(2, '0')}`;
    if (!html.ids.has(id)) result.fail(`methodology HTML is missing #${id}`);
  }
  const stage13Text = html.$('#st13').text();
  const stage15Text = html.$('#st15').text();
  if (!/\b(?:OKF|knowledge|знан)/i.test(stage13Text)) {
    result.fail('methodology HTML #st13 must identify target knowledge synthesis');
  }
  if (!/\bSDD\b/.test(stage15Text)) {
    result.fail('methodology HTML #st15 must identify the current SDD stage');
  }
  const okfTerms = ['Open Knowledge Format (OKF) v0.2', 'vendor-neutral', 'Google Cloud'];
  const markdownMethodologyText = md.source.replace(/\s+/g, ' ');
  const htmlMethodologyText = html.$('body').text().replace(/\s+/g, ' ');
  for (const term of okfTerms) {
    if (!markdownMethodologyText.includes(term)) result.fail(`canonical methodology Stage 13 must identify "${term}"`);
    if (!htmlMethodologyText.includes(term)) result.fail(`methodology HTML Stage 13 must identify "${term}"`);
  }
  const architectureTerms = ['Grade A', 'Integration Contracts', 'Current Slice', 'Living Architecture Loop'];
  for (const term of architectureTerms) {
    if (!md.source.includes(term)) {
      result.fail(`canonical methodology Stage 9 must identify "${term}"`);
    }
    if (!htmlMethodologyText.includes(term)) {
      result.fail(`methodology HTML must identify Stage 9 concept "${term}"`);
    }
  }
  if (/stage[-_]?5[-_]?sdd|stage[-_]?6[-_]?(?:sdd|design)/i.test(md.source)) {
    result.fail('methodology contains historical Stage 5/6 SDD naming');
  }
}

function referencesTarget(sourceFile, links, targetFile) {
  const base = path.dirname(sourceFile);
  return links.some((href) => {
    if (!href || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) return false;
    const pathname = href.split('#')[0];
    if (!pathname) return false;
    try {
      return path.resolve(base, decodeURIComponent(pathname)) === targetFile;
    } catch {
      return false;
    }
  });
}

function validateArtifactMap(root, methodologyFile, htmlFile, result) {
  const artifactMap = path.resolve(root, 'ARTIFACTS.md');
  if (!fs.existsSync(artifactMap)) {
    result.fail(`repository artifact map is missing: ${artifactMap}`);
    return;
  }
  if (fs.existsSync(methodologyFile)) {
    const md = markdownStructure(methodologyFile);
    if (!referencesTarget(methodologyFile, md.links, artifactMap)) {
      result.fail('canonical methodology must link to the repository artifact map ARTIFACTS.md');
    }
  }
  if (fs.existsSync(htmlFile)) {
    const html = htmlStructure(htmlFile);
    if (!referencesTarget(htmlFile, html.links, artifactMap)) {
      result.fail('methodology presentation must link to the repository artifact map ARTIFACTS.md');
    }
  }
}

function defaultDocumentFiles(root) {
  return walkFiles(root).filter((file) => {
    const relative = path.relative(root, file);
    if (relative.startsWith(`.git${path.sep}`) ||
        relative.startsWith(`.migration-tmp${path.sep}`) ||
        relative.includes(`${path.sep}node_modules${path.sep}`)) return false;
    return ['.md', '.html', '.htm'].includes(path.extname(file).toLowerCase());
  });
}

function auditMethodology(input = {}) {
  const root = path.resolve(input.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const methodologyFile = path.resolve(
    input.methodologyFile ||
    process.env.METHODOLOGY_FILE ||
    path.join(root, 'analysis', 'migration_methodology.md')
  );
  const htmlFile = path.resolve(
    input.htmlFile ||
    process.env.METHODOLOGY_HTML_FILE ||
    path.join(root, 'analysis', 'migration_methodology.html')
  );
  const files = input.files || defaultDocumentFiles(root);
  const result = new AuditResult('METHODOLOGY/LINK AUDIT');
  validateMethodology(methodologyFile, htmlFile, result);
  validateArtifactMap(root, methodologyFile, htmlFile, result);
  validateLinks(root, files, result);
  result.summary = `${files.length} documents checked; 19 current stages required`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root', 'methodology', 'html'], [
    'AUDIT_ROOT',
    'METHODOLOGY_FILE',
    'METHODOLOGY_HTML_FILE',
  ]);
  process.exitCode = printResult(auditMethodology({
    root: args.root,
    methodologyFile: args.methodology,
    htmlFile: args.html,
  }));
}

module.exports = {
  auditMethodology,
  defaultDocumentFiles,
  githubSlug,
  htmlStructure,
  markdownStructure,
  validateArtifactMap,
  validateLinks,
  validateMethodology,
};

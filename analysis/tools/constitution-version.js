'use strict';

const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt({ html: true });

function constitutionVersion(source) {
  const tokens = markdown.parse(source, {});
  const versions = [];
  for (let i = 0; i < tokens.length; i += 1) {
    // Only document metadata counts, never quoted examples or fenced evidence.
    if (tokens[i].type !== 'paragraph_open' || tokens[i].level !== 0) continue;
    const inline = tokens[i + 1];
    if (inline?.type !== 'inline') continue;
    for (const line of inline.content.split('\n')) {
      if (!/^\*\*Version:\*\*/.test(line)) continue;
      const text = markdown.parseInline(line, {})[0].children
        .filter(token => ['text', 'code_inline'].includes(token.type))
        .map(token => token.content).join('');
      const match = text.match(/^Version:\s*(\S+)\s*$/);
      versions.push(match ? match[1] : '');
    }
  }
  if (versions.length !== 1 || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(versions[0])) {
    throw new Error('Constitution must declare exactly one document-level Version metadata value (semantic version)');
  }
  return versions[0];
}

module.exports = { constitutionVersion };

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { sha256File } = require('./lib');
const { foundationHash } = require('./ui-design-system');

function writeUiFixture(directory, manifest, variant = 'button.primary') {
  manifest.schema_version = 4;
  const preview = path.join(directory, 'wireframes', 'components.html');
  if (!manifest.screens.length) {
    manifest.ui_design_system = null;
    if (fs.existsSync(preview)) fs.unlinkSync(preview);
    return manifest;
  }
  fs.mkdirSync(path.dirname(preview), { recursive: true });
  const record = {
    schema_version: 1,
    foundation: { component_library: 'Shared fixture controls', icon_set: 'Shared fixture icons', tokens: {
      'color.action': { type: 'color', value: '#176D8A' },
      'font.body': { type: 'fontFamily', value: 'Arial, sans-serif' },
    } },
    extensions: { 'button.background': { type: 'color', value: '{color.action}' } },
  };
  fs.writeFileSync(path.join(directory, 'ui-design-tokens.json'), JSON.stringify(record, null, 2));
  fs.writeFileSync(preview, '<button id="primary">Save</button>');
  fs.writeFileSync(path.join(directory, 'ui-design-system.md'), [
    '# Shared UI', '## Components',
    '| Variant | Purpose | States | Tokens | Preview | Usage and accessibility |',
    '|---|---|---|---|---|---|',
    `| ${variant} | Primary action | default; focus | background=button.background; font=font.body | wireframes/components.html#primary | Keyboard focus and accessible label |`,
  ].join('\n'));
  const decision = path.join(directory, 'ui-ux-decision.md');
  const old = fs.existsSync(decision) ? fs.readFileSync(decision, 'utf8') : '# Foundation\n- Approved by: fixture owner\n';
  fs.writeFileSync(decision, old.replace(/^\s*- UI foundation SHA-256:.*$/gm, '').trimEnd() + `\n- UI foundation SHA-256: ${foundationHash(record.foundation)}\n`);
  const pin = relative => ({ path: relative, sha256: sha256File(path.join(directory, relative)) });
  manifest.ui_design_system = { catalogue: pin('ui-design-system.md'), tokens: pin('ui-design-tokens.json'), resources: [pin('wireframes/components.html')] };
  for (const screen of manifest.screens) screen.ui_variants ??= [variant];
  return manifest;
}

module.exports = { writeUiFixture };

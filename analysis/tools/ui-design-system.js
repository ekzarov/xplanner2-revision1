'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { tables } = require('./process-contract');
const { parseYamlFile, readJsonFile, resolveInside, sha256File, validateSchema, PLACEHOLDER } = require('./lib');

const identifier = '^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$';
const nonEmpty = { type: 'string', minLength: 1, pattern: '\\S' };
const pin = {
  type: 'object', additionalProperties: false, required: ['path', 'sha256'],
  properties: { path: nonEmpty, sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' } },
};
const UI_MANIFEST_SCHEMA = {
  oneOf: [{ type: 'null' }, {
    type: 'object', additionalProperties: false, required: ['catalogue', 'tokens', 'resources'],
    properties: {
      catalogue: pin, tokens: pin,
      resources: { type: 'array', minItems: 1, items: pin },
    },
  }],
};
const tokenDictionary = {
  type: 'object', propertyNames: { pattern: identifier },
  additionalProperties: {
    type: 'object', additionalProperties: false, required: ['type', 'value'],
    properties: {
      type: { enum: ['color', 'dimension', 'fontFamily', 'fontWeight', 'number'] },
      value: { type: ['string', 'number'] },
    },
  },
};
const TOKEN_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['schema_version', 'foundation', 'extensions'],
  properties: {
    schema_version: { const: 1 }, _schema_help: { type: 'object' },
    foundation: {
      type: 'object', additionalProperties: false,
      required: ['component_library', 'icon_set', 'tokens'],
      properties: {
        component_library: nonEmpty, icon_set: nonEmpty,
        tokens: { ...tokenDictionary, minProperties: 1 },
      },
    },
    extensions: tokenDictionary,
  },
};
const COMPATIBILITY_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['manifest_sha256', 'approval_sha256', 'decision_sha256', 'source_revision', 'recorded_by', 'reason'],
  properties: {
    manifest_sha256: pin.properties.sha256, approval_sha256: pin.properties.sha256,
    decision_sha256: pin.properties.sha256,
    source_revision: { type: 'string', pattern: '^[a-f0-9]{40}$' },
    recorded_by: nonEmpty, reason: nonEmpty,
  },
};

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}

function foundationHash(foundation) {
  return crypto.createHash('sha256').update(JSON.stringify(canonical(foundation))).digest('hex');
}

function safeFile(root, relative) {
  if (relative.includes('\\') || relative.split('/').includes('..')) throw new Error(`Non-canonical UI resource path: ${relative}`);
  const file = resolveInside(root, relative, 'UI resource');
  let current = file;
  while (current !== path.resolve(root)) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`UI resource must not use symbolic links: ${relative}`);
    current = path.dirname(current);
  }
  if (!fs.statSync(file).isFile()) throw new Error(`UI resource is not a file: ${relative}`);
  return file;
}

function checkLegacyCompatibility(manifest, directory, result) {
  try {
    const config = parseYamlFile(path.resolve(directory, '../../config/project.yaml'));
    const binding = config.prototype_compatibility;
    if (!binding || validateSchema(COMPATIBILITY_SCHEMA, binding).length > 0) throw new Error('missing or invalid exact compatibility record');
    if (manifest.schema_version !== 3 || Object.hasOwn(manifest, 'ui_design_system') || manifest.screens?.some(screen => Object.hasOwn(screen, 'ui_variants'))) {
      throw new Error('only an unchanged historical version-3 set may use compatibility');
    }
    for (const [field, file] of [
      ['manifest_sha256', 'screen-manifest.json'], ['approval_sha256', 'ui-ux-approval.md'], ['decision_sha256', 'ui-ux-decision.md'],
    ]) {
      if (sha256File(safeFile(directory, file)) !== binding[field]) throw new Error(`${file} changed since the compatibility pin`);
    }
    result.warn('Historical prototype preserved by exact compatibility pins; this is not evidence of a shared UI kit. Any changed export set requires version 4 and fresh affected review/approval.');
    return true;
  } catch (error) {
    result.fail(`UI design system: ${error.message}. New or changed prototypes require manifest version 4; see ui-design-system-guide.md.`);
    return false;
  }
}

function validateTokens(record, result) {
  const errorsBefore = result.errors.length;
  result.merge(validateSchema(TOKEN_SCHEMA, record), 'ui-design-tokens.json ');
  if (result.errors.length !== errorsBefore) return null;
  const foundation = record.foundation.tokens;
  for (const key of Object.keys(record.extensions)) {
    if (Object.hasOwn(foundation, key)) result.fail(`UI token ${key} overrides the approved foundation`);
  }
  const all = { ...foundation, ...record.extensions };
  const resolved = new Map();
  function resolve(name, trail = []) {
    if (!Object.hasOwn(all, name)) throw new Error(`unknown UI token ${name}`);
    if (trail.includes(name)) throw new Error(`UI token alias cycle: ${[...trail, name].join(' -> ')}`);
    if (resolved.has(name)) return resolved.get(name);
    const token = all[name];
    const alias = typeof token.value === 'string' && /^\{([^{}]+)\}$/.exec(token.value);
    let value = token.value;
    if (alias) {
      if (Object.hasOwn(foundation, name) && !Object.hasOwn(foundation, alias[1])) throw new Error(`foundation token ${name} depends on an extension`);
      if (all[alias[1]] && all[alias[1]].type !== token.type) throw new Error(`UI token alias type mismatch: ${name}`);
      value = resolve(alias[1], [...trail, name]);
    } else {
      const valid = {
        color: () => /^#[a-f0-9]{6}(?:[a-f0-9]{2})?$/i.test(value),
        dimension: () => /^(?:0|\d+(?:\.\d+)?)(?:px|rem|em)$/.test(value),
        fontFamily: () => typeof value === 'string' && value.trim() && !PLACEHOLDER.test(value),
        fontWeight: () => Number.isInteger(value) && value >= 100 && value <= 900,
        number: () => typeof value === 'number' && Number.isFinite(value) && value >= 0,
      }[token.type]();
      if (!valid) throw new Error(`invalid ${token.type} value for UI token ${name}`);
    }
    resolved.set(name, value);
    return value;
  }
  for (const name of Object.keys(all)) {
    try { resolve(name); } catch (error) { result.fail(error.message); }
  }
  for (const key of ['component_library', 'icon_set']) {
    if (PLACEHOLDER.test(record.foundation[key])) result.fail(`UI foundation ${key} is still a placeholder`);
  }
  return all;
}

function auditUiDesignSystem(manifest, directory, result) {
  const variants = new Map(), resources = new Set();
  if (manifest.schema_version !== 4) {
    checkLegacyCompatibility(manifest, directory, result);
    return { variants, resources, legacy: true };
  }
  const before = result.errors.length;
  if (!Object.hasOwn(manifest, 'ui_design_system')) {
    result.fail('Manifest version 4 requires ui_design_system (null only for an entirely non-visual scope)');
    return { variants, resources };
  }
  const ui = manifest.ui_design_system;
  result.merge(validateSchema(UI_MANIFEST_SCHEMA, ui), 'ui_design_system ');
  if (before !== result.errors.length) return { variants, resources };
  if (ui === null) {
    if (manifest.screens?.length) result.fail('Visual screens require a pinned UI design system');
    return { variants, resources };
  }
  if (!manifest.screens?.length) result.fail('An entirely non-visual scope uses ui_design_system: null, not a fabricated UI kit');
  const pinnedPaths = new Set();
  function pinned(entry, requiredPath) {
    if (requiredPath && entry.path !== requiredPath) throw new Error(`UI source must be ${requiredPath}`);
    const lower = entry.path.toLowerCase();
    if (pinnedPaths.has(lower)) throw new Error(`Duplicate UI resource: ${entry.path}`);
    pinnedPaths.add(lower);
    const file = safeFile(directory, entry.path);
    if (sha256File(file) !== entry.sha256) throw new Error(`UI source hash mismatch: ${entry.path}`);
    return file;
  }
  try {
    const catalogue = fs.readFileSync(pinned(ui.catalogue, 'ui-design-system.md'), 'utf8');
    const tokenFile = pinned(ui.tokens, 'ui-design-tokens.json');
    for (const resource of ui.resources) {
      if (!resource.path.startsWith('wireframes/')) throw new Error('UI previews must be exported under wireframes/');
      pinned(resource);
      resources.add(resource.path.toLowerCase());
    }
    const record = readJsonFile(tokenFile);
    const tokens = validateTokens(record, result);
    if (!tokens) return { variants, resources };
    const decision = fs.readFileSync(safeFile(directory, 'ui-ux-decision.md'), 'utf8');
    const pins = [...decision.matchAll(/^\s*-\s*UI foundation SHA-256:\s*`?([a-f0-9]{64})`?\s*$/gm)];
    if (pins.length !== 1 || pins[0][1] !== foundationHash(record.foundation)) result.fail('ui-ux-decision.md must pin exactly one current UI foundation SHA-256; a changed foundation returns to Stage 5');
    const rows = tables(catalogue).get('Components');
    const columns = ['Variant', 'Purpose', 'States', 'Tokens', 'Preview', 'Usage and accessibility'];
    if (!rows || JSON.stringify(rows[0]) !== JSON.stringify(columns) || rows.length < 2) throw new Error('UI catalogue requires a non-empty Components table with the documented columns');
    for (const row of rows.slice(1)) {
      const [id, , states, bindings, preview] = row;
      if (row.length !== 6 || row.some(cell => !cell.trim() || PLACEHOLDER.test(cell))) throw new Error(`Incomplete UI component row: ${id}`);
      if (!new RegExp(identifier).test(id) || variants.has(id)) throw new Error(`Invalid or duplicate UI variant: ${id}`);
      const stateList = states.split(';').map(s => s.trim());
      if (stateList.some(s => !s) || new Set(stateList).size !== stateList.length || !stateList.includes('default')) throw new Error(`UI variant ${id} must name default and unique applicable states`);
      const properties = new Set();
      for (const item of bindings.split(';')) {
        const match = /^([a-z][a-z0-9.-]*)=([a-z][a-z0-9.-]*)$/.exec(item.trim());
        if (!match || !Object.hasOwn(tokens, match[2]) || properties.has(match[1])) throw new Error(`Invalid property/token binding for UI variant ${id}: ${item}`);
        properties.add(match[1]);
      }
      if (!resources.has(preview.split('#')[0].toLowerCase())) throw new Error(`UI variant ${id} preview is not a pinned component resource`);
      variants.set(id, { states: stateList, bindings, preview });
    }
    const used = new Set();
    for (const screen of manifest.screens) {
      if (!Array.isArray(screen.ui_variants) || !screen.ui_variants.length || new Set(screen.ui_variants).size !== screen.ui_variants.length) {
        result.fail(`Screen ${screen.id} requires unique used ui_variants`);
        continue;
      }
      for (const variant of screen.ui_variants) {
        if (!variants.has(variant)) result.fail(`Screen ${screen.id} uses unknown UI variant ${variant}`);
        used.add(variant);
      }
    }
    for (const id of variants.keys()) if (!used.has(id)) result.fail(`UI variant ${id} is not used by any declared screen`);
    for (const screen of manifest.screens) for (const file of screen.files || []) {
      if (resources.has(file.path?.toLowerCase())) result.fail(`Component resource ${file.path} cannot also be a business screen export`);
    }
  } catch (error) {
    result.fail(`UI design system: ${error.message}`);
  }
  return { variants, resources };
}

function auditUiControlBindings(controls, manifest, ui, result, label) {
  if (ui.legacy) return;
  const screens = new Map((manifest.screens || []).map(screen => [screen.id, screen]));
  for (const cells of controls) {
    const screen = screens.get(cells[0]), variant = cells[2];
    if (!screen?.ui_variants?.includes(variant) || !ui.variants.has(variant)) {
      result.fail(`${label} control ${cells[1]} must use a declared screen and approved UI variant, not ${variant}`);
    }
  }
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) throw new Error('Usage: node ui-design-system.js <ui-design-tokens.json> (prints the foundation digest; does not approve it)');
  console.log(foundationHash(readJsonFile(file).foundation));
}

module.exports = { UI_MANIFEST_SCHEMA, TOKEN_SCHEMA, COMPATIBILITY_SCHEMA, foundationHash, validateTokens, auditUiDesignSystem, auditUiControlBindings };

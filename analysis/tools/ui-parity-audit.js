#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { auditUiDesignSystem } = require('./ui-design-system');
const {
  AuditResult,
  parseArgs,
  parseYamlFile,
  printResult,
  rejectGovernedOverrides,
} = require('./lib');

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function approvedSurfaceContracts(root, result, manifest, surfaceIds) {
  const screens = new Map((manifest.screens || []).map((screen) => [screen.id, screen]));
  const contracts = [];
  for (const id of surfaceIds) {
    const screen = screens.get(id);
    for (const file of screen?.files || []) {
      const relativePath = path.normalize(path.join('analysis', 'prototyping', file.path));
      const absolutePath = path.resolve(root, relativePath);
      const prototypeRoot = path.resolve(root, 'analysis', 'prototyping');
      if (!absolutePath.startsWith(`${prototypeRoot}${path.sep}`)) {
        result.fail(`Approved wireframe path escapes analysis/prototyping for ${id}: ${file.path}.`);
      } else if (!fs.existsSync(absolutePath)) {
        result.fail(`Approved wireframe file is missing for ${id}: ${file.path}.`);
      } else if (sha256(absolutePath) !== file.sha256) {
        result.fail(`Approved wireframe file hash drifted for ${id}: ${file.path}.`);
      }
      contracts.push({ id, path: relativePath.replaceAll(path.sep, '/'), sha256: file.sha256 });
    }
  }
  return contracts;
}

const REQUIRED_STYLE_CATEGORIES = [
  'typography',
  'component geometry',
  'palette',
  'spacing',
  'states',
  'iconography',
  'content fidelity',
];

function approvedInteractionStates(root, manifest, surface) {
  const screen = (manifest.screens || []).find((candidate) => candidate.id === surface);
  const source = (screen?.files || [])
    .filter((file) => /\.html?$/i.test(file.path))
    .map((file) => fs.readFileSync(path.join(root, 'analysis', 'prototyping', file.path), 'utf8'))
    .join('\n');
  const states = [];
  if (/(?:\bhover:|:hover\b)/i.test(source)) states.push('hover');
  return states;
}

function approvedStandalonePlaceholders(root, manifest, surface) {
  const screen = (manifest.screens || []).find((candidate) => candidate.id === surface);
  const source = (screen?.files || [])
    .filter((file) => /\.html?$/i.test(file.path))
    .map((file) => fs.readFileSync(path.join(root, 'analysis', 'prototyping', file.path), 'utf8'))
    .join('\n');
  const placeholders = [];
  for (const marker of ['—', '–', 'N/A', 'Not set', 'None']) {
    const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`>\\s*${escaped}\\s*<`, 'i').test(source)) placeholders.push(marker);
  }
  return placeholders;
}

function approvedStyleContracts(root, result, manifest, spec, surfaceIds, activeSlice) {
  const section = spec.match(
    /^##\s+Binding Visual Style Checks\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/im,
  )?.[1];
  if (!section) {
    result.fail(`${activeSlice}/spec.md must contain Binding Visual Style Checks.`);
    return [];
  }

  const rows = [];
  for (const line of section.split(/\r?\n/)) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    if (cells.length < 5 || /^screen$/i.test(cells[0]) || /^[-:]+$/.test(cells[0])) continue;
    const [screen, category, element, approvedValue, automatedAssertion] = cells;
    rows.push({ screen, category: category.toLowerCase(), element, approvedValue, automatedAssertion });
  }

  for (const surface of surfaceIds) {
    const surfaceRows = rows.filter((row) => row.screen === surface);
    for (const category of REQUIRED_STYLE_CATEGORIES) {
      const row = surfaceRows.find((candidate) => candidate.category === category);
      if (!row) result.fail(`${activeSlice}/spec.md must bind ${category} for approved screen ${surface}.`);
      else if (!row.element || !row.approvedValue || !row.automatedAssertion) {
        result.fail(`${activeSlice}/spec.md has an incomplete ${category} style check for ${surface}.`);
      }
    }
    const stateRow = surfaceRows.find((candidate) => candidate.category === 'states');
    for (const state of approvedInteractionStates(root, manifest, surface)) {
      const contractText = `${stateRow?.element || ''} ${stateRow?.approvedValue || ''}`;
      const assertionText = stateRow?.automatedAssertion || '';
      if (!new RegExp(`\\b${state}\\b`, 'i').test(contractText)) {
        result.fail(`${activeSlice}/spec.md must explicitly bind source-declared ${state} for approved screen ${surface}.`);
      }
      if (!new RegExp(`\\b${state}\\b`, 'i').test(assertionText)) {
        result.fail(`${activeSlice}/spec.md must require an automated ${state} assertion for approved screen ${surface}.`);
      }
      if (state === 'hover') {
        const baseline = /\b(?:pre-interaction|resting|normal|default)\b/i;
        if (!baseline.test(contractText)) {
          result.fail(`${activeSlice}/spec.md must bind the pre-interaction baseline before source-declared hover for approved screen ${surface}.`);
        }
        if (!baseline.test(assertionText)) {
          result.fail(`${activeSlice}/spec.md must assert computed style before hover as well as after hover for approved screen ${surface}.`);
        }
      }
    }
    const contentRow = surfaceRows.find((candidate) => candidate.category === 'content fidelity');
    for (const marker of approvedStandalonePlaceholders(root, manifest, surface)) {
      if (!(contentRow?.approvedValue || '').includes(marker)) {
        result.fail(`${activeSlice}/spec.md must preserve source-declared placeholder ${marker} for approved screen ${surface}.`);
      }
      if (!(contentRow?.automatedAssertion || '').includes(marker)) {
        result.fail(`${activeSlice}/spec.md must assert source-declared placeholder ${marker} for approved screen ${surface}.`);
      }
    }
  }
  return rows.filter((row) => surfaceIds.includes(row.screen));
}

function activeUiSurfaces(root, result, manifest, minimumSimilarity) {
  const statusFile = path.join(root, 'analysis', 'migration_status.yaml');
  if (!fs.existsSync(statusFile)) {
    result.fail('analysis/migration_status.yaml is required to identify the active delivery slice.');
    return { surfaces: [], styleContracts: [] };
  }
  const status = parseYamlFile(statusFile);
  const activeSlice = status.delivery && status.delivery.active_slice;
  if (!activeSlice || !/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(activeSlice)) {
    result.fail('delivery.active_slice must name the feature whose UI parity is being verified.');
    return { surfaces: [], styleContracts: [] };
  }
  const screens = new Map((manifest.screens || []).map((screen) => [screen.id, screen]));
  const specificationGuide = path.join(root, 'specs', 'README.md');
  const guide = fs.existsSync(specificationGuide) ? fs.readFileSync(specificationGuide, 'utf8') : '';
  const policySequence = Number(guide.match(
    /^\s*-\s*\*\*Impact-scoped verification required from feature sequence\*\*:\s*(\d{3})\s*$/im,
  )?.[1]);
  const activeSequence = Number(activeSlice.slice(0, 3));
  const activeSpecFile = path.join(root, 'specs', activeSlice, 'spec.md');
  const activeSpec = fs.existsSync(activeSpecFile) ? fs.readFileSync(activeSpecFile, 'utf8') : '';
  const impactSection = activeSpec.match(
    /^##\s+Change Impact and Verification Scope\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/im,
  )?.[1] || '';
  const impactMode = impactSection.match(/^\s*-\s*Verification mode:\s*(delta|expanded|full)\s*$/im)?.[1]?.toLowerCase();
  const impactGoverned = Number.isFinite(policySequence) && activeSequence >= policySequence;
  if (impactGoverned && !impactMode) {
    result.fail(`${activeSlice}/spec.md must declare Verification mode under Change Impact and Verification Scope.`);
  }
  const surfaces = [];
  const styleContracts = [];
  const governedSlices = [];
  const governedKeys = new Set();
  const addGovernedSlice = (slice, surface, source) => {
    const key = `${slice}#${surface || '*'}`;
    if (governedKeys.has(key)) return;
    governedKeys.add(key);
    governedSlices.push({ slice, surface, source });
  };

  addGovernedSlice(activeSlice, null, 'active slice');
  for (const deliveredSlice of status.delivery?.delivered_ui_slices || []) {
    if (!/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(deliveredSlice)) {
      result.fail(`delivery.delivered_ui_slices contains invalid slice ${deliveredSlice}.`);
      continue;
    }
    if (!impactGoverned || impactMode === 'full') {
      addGovernedSlice(deliveredSlice, null, 'full delivered UI baseline');
    }
  }
  for (const correction of status.delivery?.ui_parity_corrections || []) {
    const match = /^(\d{3}-[a-z0-9][a-z0-9-]*)#([a-z0-9][a-z0-9-]*)$/.exec(correction);
    if (!match) {
      result.fail(`delivery.ui_parity_corrections contains invalid entry ${correction}; expected slice#surface.`);
      continue;
    }
    addGovernedSlice(match[1], match[2], 'cross-slice correction');
  }
  for (const { slice, surface: correctedSurface, source } of governedSlices) {
    if (!/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(slice)) {
      result.fail(`delivery UI parity contains invalid slice ${slice}.`);
      continue;
    }
    const specFile = path.join(root, 'specs', slice, 'spec.md');
    if (!fs.existsSync(specFile)) {
      result.fail(`Governed UI slice ${slice} has no specs/${slice}/spec.md.`);
      continue;
    }
    const spec = fs.readFileSync(specFile, 'utf8');
    const contract = spec.match(/^##\s+Approved Prototype Contract\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/im)?.[1] || '';
    const uiImpact = contract.match(/^\s*-\s*UI impact:\s*(yes|no)\s*$/im)?.[1]?.toLowerCase();
    if (!uiImpact) {
      result.fail(`${slice}/spec.md must declare UI impact under Approved Prototype Contract.`);
      continue;
    }
    if (uiImpact === 'no') continue;
    const declaredSimilarity = Number(contract.match(/^\s*-\s*Minimum visual similarity:\s*`?(\d+(?:\.\d+)?)%?`?\s*$/im)?.[1]);
    if (declaredSimilarity !== minimumSimilarity) {
      result.fail(`${slice}/spec.md must declare Minimum visual similarity: ${minimumSimilarity}% under Approved Prototype Contract.`);
    }
    const sliceSurfaces = [];
    for (const line of contract.split(/\r?\n/)) {
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
      if (cells.length < 3 || /^screen$/i.test(cells[0]) || /^[-:]+$/.test(cells[0])) continue;
      const [id, expectedHash] = cells;
      const screen = screens.get(id);
      if (!screen) result.fail(`${slice}/spec.md references unknown approved screen ${id}.`);
      else if (!screen.files?.some((file) => file.sha256 === expectedHash)) {
        result.fail(`${slice}/spec.md hash for ${id} does not match the approved manifest.`);
      }
      sliceSurfaces.push(id);
    }
    if (!sliceSurfaces.length) result.fail(`UI slice ${slice} must map at least one approved screen.`);
    if (correctedSurface) {
      if (!sliceSurfaces.includes(correctedSurface)) {
        result.fail(`${slice}/spec.md does not govern corrected surface ${correctedSurface}.`);
      }
      sliceSurfaces.splice(0, sliceSurfaces.length, correctedSurface);
    } else if (source === 'active slice') {
      if (sliceSurfaces.length && screens.has('sign-in')) sliceSurfaces.push('sign-in');
      if (sliceSurfaces.length && screens.has('app-shell')) sliceSurfaces.push('app-shell');
    }
    const uniqueSliceSurfaces = [...new Set(sliceSurfaces)];
    surfaces.push(...uniqueSliceSurfaces);
    styleContracts.push(...approvedStyleContracts(root, result, manifest, spec, uniqueSliceSurfaces, slice));
  }
  const uniqueSurfaces = [...new Set(surfaces)];
  return {
    surfaces: uniqueSurfaces,
    styleContracts,
  };
}

function runVisualParity(options = {}) {
  const root = path.resolve(options.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const result = new AuditResult('UI PARITY AUDIT');
  const configFile = path.join(root, 'config', 'project.yaml');
  const approvalFile = path.join(root, 'analysis', 'prototyping', 'ui-ux-approval.md');
  const manifestFile = path.join(root, 'analysis', 'prototyping', 'screen-manifest.json');

  if (!fs.existsSync(configFile)) result.fail('config/project.yaml is required.');
  if (!fs.existsSync(approvalFile)) result.fail('Approved UI requires analysis/prototyping/ui-ux-approval.md.');
  if (!fs.existsSync(manifestFile)) result.fail('Approved UI requires analysis/prototyping/screen-manifest.json.');
  if (!result.ok) return result;

  const config = parseYamlFile(configFile);
  const contract = config.commands && config.commands.visual_parity;
  if (!contract || !contract.command) {
    result.fail('config/project.yaml must define commands.visual_parity.command from Stage 17.');
    return result;
  }
  const minimumSimilarity = Number(contract.minimum_similarity_percent);
  if (!Number.isFinite(minimumSimilarity) || minimumSimilarity < 95 || minimumSimilarity > 100) {
    result.fail('commands.visual_parity.minimum_similarity_percent must be a number from 95 through 100.');
    return result;
  }

  const approval = fs.readFileSync(approvalFile, 'utf8');
  const approvedSet = approval.match(/Approved export set version:\s*([^\r\n]+)/i)?.[1]?.trim().replace(/`/g, '');
  const approvedHash = approval.match(/Screen manifest SHA-256:\s*([a-f0-9]{64})/i)?.[1]?.toLowerCase();
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  auditUiDesignSystem(manifest, path.dirname(manifestFile), result);
  const actualHash = sha256(manifestFile);
  if (!approvedSet || manifest.export_set_version !== approvedSet) {
    result.fail('The visual-parity run is not pinned to the approved export-set version.');
  }
  if (!approvedHash || actualHash !== approvedHash) {
    result.fail('The visual-parity run is not pinned to the approved screen-manifest hash.');
  }
  const { surfaces, styleContracts } = activeUiSurfaces(root, result, manifest, minimumSimilarity);
  const surfaceContracts = approvedSurfaceContracts(root, result, manifest, surfaces);

  const workingDirectory = path.resolve(root, contract.working_directory);
  if (!workingDirectory.startsWith(`${root}${path.sep}`) && workingDirectory !== root) {
    result.fail('commands.visual_parity.working_directory escapes the repository.');
    return result;
  }
  const missing = (contract.required_environment || []).filter((name) => !process.env[name]);
  if (missing.length) {
    result.fail(`Visual parity requires missing environment variables: ${missing.join(', ')}.`);
    return result;
  }
  if (!result.ok) return result;

  const execution = spawnSync(contract.command, {
    cwd: workingDirectory,
    shell: true,
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    env: {
      ...process.env,
      UI_PARITY_MODE: options.deployed ? 'deployed' : 'local',
      UI_APPROVED_EXPORT_SET: approvedSet,
      UI_APPROVED_MANIFEST_SHA256: approvedHash,
      UI_PARITY_SURFACES: surfaces.join(','),
      UI_APPROVED_SURFACE_CONTRACTS: JSON.stringify(surfaceContracts),
      UI_APPROVED_STYLE_CONTRACTS: JSON.stringify(styleContracts),
      UI_APPROVED_DESIGN_SYSTEM: JSON.stringify(manifest.ui_design_system || null),
      UI_DESIGN_SYSTEM_ROOT: path.dirname(manifestFile),
      UI_PARITY_MIN_SIMILARITY_PERCENT: String(minimumSimilarity),
    },
  });
  if (execution.error) result.fail(execution.error.message);
  else if (execution.status !== 0) result.fail(`configured visual parity command exited with code ${execution.status}.`);

  result.summary = result.ok
    ? `Approved UI ${approvedSet} (${surfaces.join(', ') || 'no UI impact'}) verified at >=${minimumSimilarity}% in ${options.deployed ? 'deployed' : 'local'} mode`
    : 'Visual parity is not proven; Stage 17/18 is blocked';
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root'], ['AUDIT_ROOT']);
  process.exitCode = printResult(runVisualParity({ root: args.root, deployed: Boolean(args.deployed) }));
}

module.exports = { runVisualParity };

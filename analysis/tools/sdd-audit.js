'use strict';

const { auditUiDesignSystem, auditUiControlBindings } = require('./ui-design-system');

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  AuditResult,
  PLACEHOLDER,
  parseArgs,
  parseYamlFile,
  printResult,
  rejectGovernedOverrides,
} = require('./lib');
const {
  deliveredRowErrors,
  loadWorkbookState,
  parseParityContracts,
} = require('./parity-map-contract');

const FEATURE_PATTERN = /^\d{3}-[a-z0-9][a-z0-9-]*$/;
const { indexErrors } = require('./traceability-index');
const { completionScope } = require('./sdd-completion-scope');
const { auditDependencies, bindingErrors, dependencyPolicy } = require('./feature-dependencies');
const REQUIRED_FILES = ['spec.md', 'plan.md', 'tasks.md'];
const REQUIREMENT_PATTERN = /\bFR-\d{3,}\b/g;
const STORY_PATTERN = /^###\s+User Story\b/im;
const SHA256_PATTERN = /^[a-f0-9]{64}$/i;
const STAGE_18_TASK_PATTERN = /\brecord(?:s|ed|ing)?\s+(?:a\s+)?deployed\s+public\b|\brequire(?:s|d|ing)?\s+Stage\s*18\b/i;
const ASSUMPTION_POLICY_PATTERN = /^\s*-\s*\*\*Owner-reviewed assumptions required from feature sequence\*\*:\s*(\d{3})\s*$/im;
const IMPACT_POLICY_PATTERN = /^\s*-\s*\*\*Impact-scoped verification required from feature sequence\*\*:\s*(\d{3})\s*$/im;
const ASSUMPTION_ID_PATTERN = /^ASM-\d{3}$/;
const ASSUMPTION_DISPOSITIONS = new Set(['approved-as-proposed', 'corrected-by-owner']);
const IMPACT_MODES = new Set(['delta', 'expanded', 'full']);
const IMPACT_DIMENSIONS = new Set([
  'parity map and decisions',
  'architecture and knowledge',
  'backend and contracts',
  'data and background work',
  'security and permissions',
  'ui and shared design system',
  'deployment and operations',
]);

function section(body, heading) {
  const match = body.match(new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, 'im'));
  return match ? match[1] : '';
}

function prototypeRows(body) {
  const rows = [];
  for (const line of body.split(/\r?\n/)) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    if (cells.length < 3 || /^screen$/i.test(cells[0]) || /^[-:]+$/.test(cells[0])) continue;
    rows.push({ screen: cells[0], hash: cells[1] });
  }
  return rows;
}

function controlInventoryRows(body) {
  const rows = [];
  for (const line of body.split(/\r?\n/)) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    if (cells.length < 7 || /^screen$/i.test(cells[0]) || cells.every((cell) => /^[-:]+$/.test(cell))) continue;
    rows.push(cells);
  }
  return rows;
}

function meaningfulLines(body) {
  return body.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !/^[-|:\s]+$/.test(line));
}

function traceabilityRequirements(body) {
  const requirements = new Set();
  for (const row of body.split(/\r?\n/)) {
    if (!row.trim().startsWith('|')) continue;
    if (/parity-map rows|target requirement/i.test(row) || /^\s*\|[\s:|-]+\|\s*$/.test(row)) continue;
    for (const id of row.match(REQUIREMENT_PATTERN) || []) requirements.add(id);
  }
  return requirements;
}

async function auditSdd(options = {}) {
  const result = new AuditResult('SDD AUDIT');
  const root = path.resolve(options.root || path.join(__dirname, '..', '..', 'specs'));
  const traceabilityFile = path.join(root, 'traceability.md');
  const specificationGuide = path.join(root, 'README.md');
  const projectRoot = path.dirname(root);
  const prototypeDirectory = path.join(projectRoot, 'analysis', 'prototyping');

  if (!fs.existsSync(root)) {
    result.fail(`specification directory does not exist: ${root}`);
    return result;
  }
  if (!fs.existsSync(traceabilityFile)) {
    result.fail('specs/traceability.md is required before delivery or completion');
  }
  let assumptionReviewFrom = null;
  let impactScopeFrom = null;
  if (!fs.existsSync(specificationGuide)) {
    result.fail('specs/README.md is required and must declare the owner-reviewed assumption policy');
  } else {
    const policy = fs.readFileSync(specificationGuide, 'utf8').match(ASSUMPTION_POLICY_PATTERN);
    if (!policy) result.fail('specs/README.md must declare Owner-reviewed assumptions required from feature sequence');
    else assumptionReviewFrom = Number(policy[1]);
    const impactPolicy = fs.readFileSync(specificationGuide, 'utf8').match(IMPACT_POLICY_PATTERN);
    if (!impactPolicy) result.fail('specs/README.md must declare Impact-scoped verification required from feature sequence');
    else impactScopeFrom = Number(impactPolicy[1]);
  }
  const openReopenedSlices = new Set();
  let activeSlice = null;
  let activeStage = null;
  let implementing = false;
  const statusFile = path.join(projectRoot, 'analysis', 'migration_status.yaml');
  if (fs.existsSync(statusFile)) {
    try {
      const status = parseYamlFile(statusFile);
      activeSlice = status.delivery?.active_slice;
      activeStage = status.control?.current_stage;
      implementing = ['in_progress', 'deployed', 'accepted'].includes(status.delivery?.slice_status);
      for (const entry of status.delivery?.reopened_slices || []) {
        if (entry.status === 'open') openReopenedSlices.add(entry.slice);
      }
    } catch (error) {
      result.fail(`analysis/migration_status.yaml cannot be read for reopened-slice assumption policy: ${error.message}`);
    }
  }

  const features = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && FEATURE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (!features.length) {
    result.fail('at least one numbered feature directory is required in specs/');
    return result;
  }

  let dependencyFrom = null;
  try { dependencyFrom = dependencyPolicy(root); } catch (error) { result.fail(error.message); }
  const governedDependencies = feature => (dependencyFrom !== null && featureSequence(feature) >= dependencyFrom) || openReopenedSlices.has(feature) ||
    /Completion dependencies:\s*graph/.test(fs.readFileSync(path.join(root, feature, 'spec.md'), 'utf8'));
  const needsDependencies = features.some(feature => fs.existsSync(path.join(root, feature, 'spec.md')) && governedDependencies(feature));
  const dependencyAudit = needsDependencies ? await auditDependencies({ root: projectRoot, required: true }) : null;
  if (dependencyAudit) { result.merge(dependencyAudit.errors); dependencyAudit.warnings.forEach(warning => result.warn(warning)); }
  let completion = Boolean(options.requireCompletion);
  if (options.requireSliceCompletion) {
    const scope = completionScope(root, features, activeSlice, dependencyAudit, governedDependencies);
    scope.errors.forEach(error => result.fail(error));
    completion = scope.selected;
    if (options.requireCompletion) result.fail('Select slice completion or full completion, not both');
  }
  const completes = feature => completion instanceof Set ? completion.has(feature) : completion;

  const traceability = fs.existsSync(traceabilityFile)
    ? fs.readFileSync(traceabilityFile, 'utf8')
    : '';
  if (traceability) {
    if (PLACEHOLDER.test(traceability.replace(/<!--[\s\S]*?-->/g, ''))) {
      result.fail('specs/traceability.md contains an unresolved placeholder');
    }
    if (!/^##\s+Legacy and Approved-Change Coverage/im.test(traceability) ||
        !/^##\s+Target-Only Requirements/im.test(traceability)) {
      result.fail('specs/traceability.md must contain legacy and target-only coverage sections');
    }
  }
  const tracedRequirements = traceabilityRequirements(traceability);
  for (const error of indexErrors(traceability, root, features, completion)) result.fail(error);
  const parity = parseParityContracts(traceability);
  for (const error of parity.errors) result.fail(error);
  let workbookState = null;
  if (options.requireCompletion || options.requireSliceCompletion) {
    const workbookFile = path.join(projectRoot, 'analysis', 'legacy_user_flows.xlsx');
    if (!fs.existsSync(workbookFile)) result.fail('analysis/legacy_user_flows.xlsx is required for completed SDD parity closure');
    else {
      try { workbookState = await loadWorkbookState(workbookFile); }
      catch (error) { result.fail(`Parity workbook cannot be loaded: ${error.message}`); }
    }
  }

  for (const feature of features) {
    const directory = path.join(root, feature);
    const parityContract = parity.contracts.get(feature);
    if (!parityContract) result.fail(`specs/traceability.md has no parity delivery contract for ${feature}`);
    const bodies = {};
    for (const required of REQUIRED_FILES) {
      const file = path.join(directory, required);
      if (!fs.existsSync(file)) {
        result.fail(`${feature}/${required} is required`);
        continue;
      }
      const body = fs.readFileSync(file, 'utf8');
      bodies[required] = body;
      if (!body.trim()) result.fail(`${feature}/${required} cannot be empty`);
      if (PLACEHOLDER.test(body.replace(/<!--[\s\S]*?-->/g, ''))) result.fail(`${feature}/${required} contains an unresolved placeholder`);
      const minimumLines = required === 'tasks.md' ? 1 : 2;
      if (meaningfulLines(body).length < minimumLines) {
        result.fail(`${feature}/${required} is too shallow to be an auditable design artifact`);
      }
    }

    const spec = bodies['spec.md'] || '';
    if (fs.existsSync(path.join(directory, 'spec.md')) && governedDependencies(feature)) bindingErrors(dependencyAudit, feature, spec, completes(feature) || ((activeStage === 'stage-17' || implementing) && activeSlice === feature)).forEach(error => result.fail(error));
    const governedAssumptions =
      (assumptionReviewFrom !== null && featureSequence(feature) >= assumptionReviewFrom) ||
      openReopenedSlices.has(feature);
    const governedImpactScope =
      (impactScopeFrom !== null && featureSequence(feature) >= impactScopeFrom) ||
      openReopenedSlices.has(feature);
    const assumptionReview = governedAssumptions
      ? validateAssumptionReview(feature, spec, result)
      : null;
    const impactScope = governedImpactScope
      ? validateImpactScope(feature, spec, result)
      : null;
    const requirementIds = new Set(spec.match(REQUIREMENT_PATTERN) || []);
    if (!/^##\s+Requirements/im.test(spec) || !requirementIds.size) {
      result.fail(`${feature}/spec.md must define at least one FR-* requirement under Requirements`);
    }
    if (!STORY_PATTERN.test(spec) || !/\bGiven\b[\s\S]*\bWhen\b[\s\S]*\bThen\b/i.test(spec)) {
      result.fail(`${feature}/spec.md must contain a user story with a Given/When/Then acceptance scenario`);
    }
    let uiBinding = null;
    const prototypeContract = section(spec, 'Approved Prototype Contract');
    const uiImpact = prototypeContract.match(/^\s*-\s*UI impact:\s*(yes|no)\s*$/im)?.[1]?.toLowerCase();
    if (!prototypeContract || !uiImpact) {
      result.fail(`${feature}/spec.md must declare UI impact under Approved Prototype Contract`);
    } else if (uiImpact === 'no') {
      if (!/^\s*-\s*Reason:\s*\S.+$/im.test(prototypeContract)) {
        result.fail(`${feature}/spec.md must explain why the approved prototype is not applicable`);
      }
    } else {
      const approvedSet = prototypeContract.match(/^\s*-\s*Approved export set:\s*([^\r\n]+)$/im)?.[1]?.trim().replace(/`/g, '');
      if (!approvedSet) {
        result.fail(`${feature}/spec.md must pin the approved prototype export set`);
      } else if (/^not applicable$/i.test(approvedSet)) {
        result.fail(`${feature}/spec.md declares UI impact and must pin an approved prototype export set`);
      } else {
        const approvalFile = path.join(prototypeDirectory, 'ui-ux-approval.md');
        const manifestFile = path.join(prototypeDirectory, 'screen-manifest.json');
        if (!fs.existsSync(approvalFile) || !fs.existsSync(manifestFile)) {
          result.fail(`${feature}/spec.md cites a prototype but ui-ux-approval.md or screen-manifest.json is absent`);
        } else {
          const approval = fs.readFileSync(approvalFile, 'utf8');
          const expectedSet = approval.match(/Approved export set version:\s*([^\r\n]+)/i)?.[1]?.trim().replace(/`/g, '');
          const expectedManifestHash = approval.match(/Screen manifest SHA-256:\s*([a-f0-9]{64})/i)?.[1]?.toLowerCase();
          if (approvedSet !== expectedSet) {
            result.fail(`${feature}/spec.md prototype set ${approvedSet} does not match approved ${expectedSet}`);
          }
          const manifestBytes = fs.readFileSync(manifestFile);
          const actualManifestHash = crypto.createHash('sha256').update(manifestBytes).digest('hex');
          if (!expectedManifestHash || actualManifestHash !== expectedManifestHash) {
            result.fail('analysis/prototyping/screen-manifest.json does not match the approved manifest SHA-256');
          }
          let manifest;
          try { manifest = JSON.parse(manifestBytes.toString('utf8')); }
          catch { result.fail('analysis/prototyping/screen-manifest.json is not valid JSON'); }
          if (manifest) uiBinding = { manifest, ui: auditUiDesignSystem(manifest, prototypeDirectory, result) };
          const screens = new Map((manifest?.screens || []).map((screen) => [screen.id, screen]));
          const rows = prototypeRows(prototypeContract);
          if (!rows.length) result.fail(`${feature}/spec.md must map at least one approved prototype screen`);
          for (const row of rows) {
            const screen = screens.get(row.screen);
            if (!screen) {
              result.fail(`${feature}/spec.md references unknown prototype screen ${row.screen}`);
              continue;
            }
            if (!SHA256_PATTERN.test(row.hash) || !screen.files?.some((file) => file.sha256 === row.hash)) {
              result.fail(`${feature}/spec.md hash for prototype screen ${row.screen} does not match the manifest`);
            }
          }
        }
      }
      if (!/^\s*-\s*Visual divergence:\s*\S.+$/im.test(prototypeContract)) {
        result.fail(`${feature}/spec.md must disposition visual divergence explicitly`);
      }
      const controlInventory = section(spec, 'Used UI Control Inventory');
      const controls = controlInventoryRows(controlInventory);
      if (uiBinding) auditUiControlBindings(controls, uiBinding.manifest, uiBinding.ui, result, `${feature}/spec.md`);
      if (!controlInventory || !controls.length) {
        result.fail(`${feature}/spec.md declares UI impact and must contain a non-empty Used UI Control Inventory`);
      } else {
        for (const cells of controls) {
          if (cells.some((cell) => !cell) || /^not applicable$/i.test(cells[1])) {
            result.fail(`${feature}/spec.md Used UI Control Inventory contains an incomplete control row`);
          }
        }
      }
    }
    const plan = bodies['plan.md'] || '';
    if (!/^##\s+(?:Design|Technical Context)/im.test(plan) ||
        !/\b(?:FR|NFR|ADR)-\d{3,}\b/.test(plan)) {
      result.fail(`${feature}/plan.md must contain concrete design context linked to governed requirement ids`);
    }
    if (assumptionReview) validateAssumptionPlanBinding(feature, plan, assumptionReview, result);
    if (impactScope) validateImpactPlanBinding(feature, plan, impactScope, result);

    const tasksFile = path.join(directory, 'tasks.md');
    if (fs.existsSync(tasksFile)) {
      const tasks = fs.readFileSync(tasksFile, 'utf8');
      const checkboxes = tasks.match(/^\s*[-*]\s+\[[ xX]\]\s+.+$/gm) || [];
      const open = tasks.match(/^\s*[-*]\s+\[\s\]\s+.+$/gm) || [];
      if (!checkboxes.length) result.fail(`${feature}/tasks.md must contain actionable checkboxes`);
      if (checkboxes.some((task) => STAGE_18_TASK_PATTERN.test(task))) {
        result.fail(`${feature}/tasks.md must stop at the Stage 17 candidate boundary; deployment and public journey evidence belong only to Stage 18`);
      }
      if (completes(feature) && open.length) {
        result.fail(`${feature}/tasks.md contains ${open.length} incomplete task(s)`);
      }
      for (const requirementId of requirementIds) {
        if (!tasks.includes(requirementId)) {
          result.fail(`${feature}/tasks.md does not assign work for ${requirementId}`);
        }
      }
    }

    if (traceability && !new RegExp(`\\b${feature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(traceability)) {
      result.fail(`specs/traceability.md does not reference ${feature}`);
    }
    for (const requirementId of requirementIds) {
      if (!tracedRequirements.has(requirementId)) {
        result.fail(`specs/traceability.md does not map ${feature} requirement ${requirementId}`);
      }
    }
    if (completes(feature) && parityContract && workbookState) {
      for (const error of deliveredRowErrors(parityContract, workbookState)) result.fail(error);
    }
  }

  result.summary = `Features ${features.length}; required artifacts ${features.length * REQUIRED_FILES.length}; completion scope: ${completion instanceof Set ? [...completion].join(', ') : completion ? 'all slices' : 'design only'}.`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root']);
  auditSdd({
    root: args.root,
    requireCompletion: Boolean(args['require-completion']),
    requireSliceCompletion: Boolean(args['require-slice-completion']),
  }).then((result) => { process.exitCode = printResult(result); });
}

function featureSequence(feature) {
  return Number(feature.slice(0, 3));
}

function assumptionRows(body) {
  const rows = [];
  for (const line of body.split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    if (cells.length < 6 || /^assumption id$/i.test(cells[0]) || cells.every((cell) => /^[-:]+$/.test(cell))) continue;
    rows.push(cells);
  }
  return rows;
}

function validateAssumptionReview(feature, spec, result) {
  const review = section(spec, 'Owner-Reviewed Implementation Assumptions');
  if (!review) {
    result.fail(`${feature}/spec.md must contain Owner-Reviewed Implementation Assumptions before implementation`);
    return { outcome: null, ids: new Set() };
  }
  const status = review.match(/^\s*-\s*Review status:\s*([^\r\n]+)$/im)?.[1]?.trim().toLowerCase();
  const reviewer = review.match(/^\s*-\s*Reviewed by:\s*([^\r\n]+)$/im)?.[1]?.trim();
  const reviewedAt = review.match(/^\s*-\s*Review date:\s*(\d{4}-\d{2}-\d{2})\s*$/im)?.[1];
  const outcome = review.match(/^\s*-\s*Assumption outcome:\s*([^\r\n]+)$/im)?.[1]?.trim().toLowerCase();
  if (status !== 'approved') result.fail(`${feature}/spec.md assumption Review status must be Approved`);
  if (!reviewer) result.fail(`${feature}/spec.md assumption review must name Reviewed by`);
  if (!reviewedAt || Number.isNaN(Date.parse(`${reviewedAt}T00:00:00Z`))) {
    result.fail(`${feature}/spec.md assumption review must contain a valid Review date`);
  }
  if (!['assumptions-recorded', 'no-assumptions'].includes(outcome)) {
    result.fail(`${feature}/spec.md Assumption outcome must be assumptions-recorded or no-assumptions`);
  }
  const rows = assumptionRows(review);
  if (outcome === 'no-assumptions' && rows.length) result.fail(`${feature}/spec.md declares no-assumptions but contains assumption rows`);
  if (outcome === 'assumptions-recorded' && !rows.length) result.fail(`${feature}/spec.md declares assumptions-recorded but contains no assumption rows`);
  const ids = new Set();
  for (const cells of rows) {
    const [id, proposal, basis, impact, disposition, finalDecision] = cells;
    if (!ASSUMPTION_ID_PATTERN.test(id)) result.fail(`${feature}/spec.md assumption id ${id || '<empty>'} must match ASM-NNN`);
    if (ids.has(id)) result.fail(`${feature}/spec.md contains duplicate assumption id ${id}`);
    ids.add(id);
    if (![proposal, basis, impact, finalDecision].every((value) => value && !/^not applicable$/i.test(value))) {
      result.fail(`${feature}/spec.md assumption ${id || '<empty>'} contains an incomplete decision record`);
    }
    if (!ASSUMPTION_DISPOSITIONS.has((disposition || '').toLowerCase())) {
      result.fail(`${feature}/spec.md assumption ${id || '<empty>'} owner disposition must be approved-as-proposed or corrected-by-owner`);
    }
  }
  return { outcome, ids };
}

function validateAssumptionPlanBinding(feature, plan, review, result) {
  const binding = section(plan, 'Owner-Reviewed Assumption Binding');
  if (!binding) {
    result.fail(`${feature}/plan.md must contain Owner-Reviewed Assumption Binding`);
    return;
  }
  if (review.outcome === 'no-assumptions') {
    if (!/^\s*-\s*No implementation assumptions apply\.\s*$/im.test(binding)) {
      result.fail(`${feature}/plan.md must explicitly state No implementation assumptions apply`);
    }
    return;
  }
  const planIds = new Set(binding.match(/\bASM-\d{3}\b/g) || []);
  for (const id of review.ids) {
    if (!planIds.has(id)) result.fail(`${feature}/plan.md does not bind owner-reviewed assumption ${id}`);
  }
  for (const id of planIds) {
    if (!review.ids.has(id)) result.fail(`${feature}/plan.md references assumption ${id} absent from the owner-reviewed spec table`);
  }
}

function impactRows(body) {
  const rows = [];
  for (const line of body.split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/^`|`$/g, ''));
    if (cells.length < 4 || /^dimension$/i.test(cells[0]) || cells.every((cell) => /^[-:]+$/.test(cell))) continue;
    rows.push(cells);
  }
  return rows;
}

function validateImpactScope(feature, spec, result) {
  const impact = section(spec, 'Change Impact and Verification Scope');
  if (!impact) {
    result.fail(`${feature}/spec.md must contain Change Impact and Verification Scope before implementation`);
    return { mode: null };
  }
  const mode = impact.match(/^\s*-\s*Verification mode:\s*(delta|expanded|full)\s*$/im)?.[1]?.toLowerCase();
  const baseline = impact.match(/^\s*-\s*Baseline:\s*([^\r\n]+)$/im)?.[1]?.trim();
  const trigger = impact.match(/^\s*-\s*Trigger assessment:\s*([^\r\n]+)$/im)?.[1]?.trim();
  const selected = impact.match(/^\s*-\s*Selected checks:\s*([^\r\n]+)$/im)?.[1]?.trim();
  const excluded = impact.match(/^\s*-\s*Excluded checks:\s*([^\r\n]+)$/im)?.[1]?.trim();
  const reentry = impact.match(/^\s*-\s*Re-entry triggers:\s*([^\r\n]+)$/im)?.[1]?.trim();
  if (!IMPACT_MODES.has(mode)) result.fail(`${feature}/spec.md Verification mode must be delta, expanded, or full`);
  for (const [label, value] of [['Baseline', baseline], ['Trigger assessment', trigger], ['Selected checks', selected], ['Excluded checks', excluded], ['Re-entry triggers', reentry]]) {
    if (!value || /^(?:n\/a|not applicable|unknown)$/i.test(value)) {
      result.fail(`${feature}/spec.md impact scope must contain a concrete ${label}`);
    }
  }
  if (mode === 'delta' && trigger && !/^none\b/i.test(trigger)) {
    result.fail(`${feature}/spec.md delta verification requires Trigger assessment: none`);
  }
  if (['expanded', 'full'].includes(mode) && trigger && /^none\b/i.test(trigger)) {
    result.fail(`${feature}/spec.md ${mode} verification must name the trigger that expanded scope`);
  }
  const seen = new Set();
  for (const cells of impactRows(impact)) {
    const dimension = cells[0].toLowerCase();
    if (!IMPACT_DIMENSIONS.has(dimension)) continue;
    if (seen.has(dimension)) result.fail(`${feature}/spec.md contains duplicate impact dimension ${cells[0]}`);
    seen.add(dimension);
    if (cells.slice(1, 4).some((value) => !value || /^(?:tbd|unknown)$/i.test(value))) {
      result.fail(`${feature}/spec.md impact dimension ${cells[0]} is incomplete`);
    }
  }
  for (const dimension of IMPACT_DIMENSIONS) {
    if (!seen.has(dimension)) result.fail(`${feature}/spec.md impact scope is missing dimension ${dimension}`);
  }
  return { mode };
}

function validateImpactPlanBinding(feature, plan, impact, result) {
  const binding = section(plan, 'Impact-Scoped Verification Plan');
  if (!binding) {
    result.fail(`${feature}/plan.md must contain Impact-Scoped Verification Plan`);
    return;
  }
  const mode = binding.match(/^\s*-\s*Verification mode:\s*(delta|expanded|full)\s*$/im)?.[1]?.toLowerCase();
  if (mode !== impact.mode) {
    result.fail(`${feature}/plan.md Verification mode must match spec.md (${impact.mode || 'missing'})`);
  }
  for (const label of ['Selected checks', 'Excluded checks', 'Expansion conditions']) {
    const value = binding.match(new RegExp(`^\\s*-\\s*${label}:\\s*([^\\r\\n]+)$`, 'im'))?.[1]?.trim();
    if (!value || /^(?:n\/a|not applicable|unknown)$/i.test(value)) {
      result.fail(`${feature}/plan.md impact verification must contain concrete ${label}`);
    }
  }
}

module.exports = { auditSdd, meaningfulLines, traceabilityRequirements };

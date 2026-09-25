#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const { auditArtifactNaming } = require('./artifact-naming-audit');
const { auditAgentRoles } = require('./agent-role-contract');
const {
  AuditResult,
  STAGE_NAMES,
  parseArgs,
  printResult,
  rejectGovernedOverrides,
} = require('./lib');

const PHASES = [
  ['bootstrap', 'Bootstrap'],
  ['requirements', 'Requirements'],
  ['prototyping', 'Prototyping'],
  ['architecture', 'Architecture & knowledge'],
  ['design', 'Design'],
  ['coding', 'Coding'],
  ['delivery', 'Deployment & QA'],
];

function collectAllowedTransitions(schema) {
  const transitions = new Map();
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    const from = value.properties?.from?.const;
    const targets = value.properties?.to?.enum;
    if (from && Array.isArray(targets)) {
      if (!transitions.has(from)) transitions.set(from, new Set());
      for (const target of targets) transitions.get(from).add(target);
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(schema);
  return transitions;
}

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }
  return [...duplicates];
}

function stageNumber(stageId) {
  const match = /^stage-(\d{2})$/.exec(stageId);
  return match ? Number.parseInt(match[1], 10) : null;
}

function validateCanvas(root, result) {
  const canvasDirectory = path.join(root, 'analysis', 'process-canvas');
  if (!fs.existsSync(canvasDirectory)) return false;

  const generator = path.join(canvasDirectory, 'build-data.js');
  const dataFile = path.join(canvasDirectory, 'data.json');
  const russianFile = path.join(canvasDirectory, 'translations.ru.json');
  const appFile = path.join(canvasDirectory, 'app.js');
  const schemaFile = path.join(root, 'analysis', 'migration_status.schema.json');
  for (const file of [generator, dataFile, russianFile, appFile, schemaFile]) {
    if (!fs.existsSync(file)) result.fail(`process view dependency is missing: ${path.relative(root, file)}`);
  }
  if (!result.ok) return true;

  const generated = spawnSync(process.execPath, [generator, '--check'], {
    cwd: root,
    encoding: 'utf8',
  });
  if (generated.status !== 0) {
    result.fail((generated.stderr || generated.stdout || 'process canvas data check failed').trim());
  }

  const practicalGuidance = spawnSync(
    process.execPath,
    [path.join(canvasDirectory, 'sync-practical-guidance.js'), '--check'],
    { cwd: root, encoding: 'utf8' }
  );
  if (practicalGuidance.status !== 0) {
    result.fail((practicalGuidance.stderr || practicalGuidance.stdout || 'practical guidance check failed').trim());
  }

  try {
    require('./sync-gate-review-guide').synchronize(root, true);
  } catch (error) {
    result.fail(error.message);
  }

  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const russian = JSON.parse(fs.readFileSync(russianFile, 'utf8'));
  const appSource = fs.readFileSync(appFile, 'utf8');
  const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
  if (data.stages.length !== 20) result.fail(`process canvas must contain Bootstrap plus 19 stages, found ${data.stages.length}`);
  if (data.phases.length !== PHASES.length) result.fail(`process canvas must contain ${PHASES.length} phases, found ${data.phases.length}`);

  const requiredUiKeys = [
    'introSubtitle', 'checkpoints', 'phases', 'independentControls', 'ownerGates', 'conditional',
    'phaseColors', 'objectShapes', 'stage', 'artifact', 'gate', 'selectedReturn', 'deliveryCycle',
    'selectedArtifactRole', 'input', 'output', 'updated', 'whoActs', 'agentWork',
    'independentAgentCheck', 'humanReview', 'artifacts', 'startingPoint', 'whatHappens',
    'exit', 'returnPath', 'returnPathsFromSelectedStage', 'whenAndHowUsed', 'exampleUse', 'inputArtifacts', 'updatedArtifacts',
    'outputArtifacts', 'none', 'footerHelp', 'newProjectOutput', 'initialCreator',
    'governingInstructions', 'creationStageRules', 'openStageInstructions',
  ];
  for (const key of requiredUiKeys) {
    if (!russian.ui?.[key]) result.fail(`Russian process canvas UI is missing ${key}`);
  }
  if (!appSource.includes('item.projectOutput')) {
    result.fail('process canvas must render artifact-specific project-output guidance');
  }
  const returnPathRenderers = [
    "fact(tr('returnPathsFromSelectedStage'), `<p>${escapeHtml(contextStage.returns)}</p>`)",
    "fact(tr('returnPathsFromSelectedStage'), `<p>${escapeHtml(contextStage.returns)}</p>` + correctionHelp(contextStage))",
  ];
  if (!returnPathRenderers.some(renderer => appSource.includes(renderer))) {
    result.fail('nested artifact cards must render the selected stage canonical return paths');
  }
  if (/\b(?:filenameConvention|fixedFilenameConvention|initializerFilenameConvention|placeholderFilenameConvention)\s*:/.test(appSource)) {
    result.fail('process canvas must not apply a generic filename convention to project outputs');
  }

  const requireTranslatedItems = (kind, items, translations, fields) => {
    for (const item of items) {
      const translated = translations?.[item.id];
      if (!translated) {
        result.fail(`Russian process canvas is missing ${kind} ${item.id}`);
        continue;
      }
      for (const field of fields) {
        if (!translated[field]) result.fail(`Russian process canvas ${kind} ${item.id} is missing ${field}`);
      }
    }
  };
  requireTranslatedItems('phase', data.phases, russian.phases, ['label', 'range']);
  requireTranslatedItems('stage', data.stages, russian.stages, ['title', 'actor', 'summary', 'actions', 'input', 'exit', 'returns']);
  requireTranslatedItems('artifact', data.artifacts, russian.artifacts, ['role', 'desc', 'usage', 'example']);
  requireTranslatedItems('gate', data.gates, russian.gates, ['role', 'desc', 'usage', 'example']);
  const outputArtifacts = data.artifacts.filter((item) => item.outputPath);
  const englishOutputGuidance = new Map();
  const russianOutputGuidance = new Map();
  for (const artifact of outputArtifacts) {
    if (!artifact.projectOutput) result.fail(`process canvas artifact ${artifact.id} is missing project-output guidance`);
    if (!artifact.creationStageId || !data.stages.some((stage) => stage.id === artifact.creationStageId)) {
      result.fail(`process canvas artifact ${artifact.id} is missing a valid creation stage`);
    }
    if (!russian.projectOutputs?.[artifact.id]) result.fail(`Russian process canvas artifact ${artifact.id} is missing project-output guidance`);
    if (/(?:^|[.!?;]\s+)(?:replace|remove|preserve|keep|fill|create|add|place|do not)\b/i.test(artifact.projectOutput || '')) {
      result.fail(`process canvas artifact ${artifact.id} addresses the reader instead of naming the responsible agent in project-output guidance`);
    }
    if (/(?:^|[.!?;]\s+)(?:Замените|Уберите|Сохраните|Заполните|Создайте|Добавьте|Поместите)\b/u.test(russian.projectOutputs?.[artifact.id] || '')) {
      result.fail(`Russian process canvas artifact ${artifact.id} addresses the reader instead of naming the responsible agent in project-output guidance`);
    }
    if (artifact.projectOutput) {
      const duplicate = englishOutputGuidance.get(artifact.projectOutput);
      if (duplicate) result.fail(`process canvas artifacts ${duplicate} and ${artifact.id} repeat the same project-output guidance`);
      englishOutputGuidance.set(artifact.projectOutput, artifact.id);
    }
    const russianGuidance = russian.projectOutputs?.[artifact.id];
    if (russianGuidance) {
      const duplicate = russianOutputGuidance.get(russianGuidance);
      if (duplicate) result.fail(`Russian process canvas artifacts ${duplicate} and ${artifact.id} repeat the same project-output guidance`);
      russianOutputGuidance.set(russianGuidance, artifact.id);
    }
  }
  for (const artifact of data.artifacts.filter((item) => item.headline)) {
    if (!russian.artifacts?.[artifact.id]?.headline) result.fail(`Russian process canvas artifact ${artifact.id} is missing headline`);
  }
  const architectureQuestions = {
    'architecture-record': 'What does the target system look like as a whole right now?',
    'architecture-sections': 'How does a specific part of the architecture work in detail?',
    adrs: 'Why was this decision made, which alternatives were rejected, and what follows from it?',
  };
  for (const [artifactId, question] of Object.entries(architectureQuestions)) {
    const artifact = data.artifacts.find((item) => item.id === artifactId);
    if (artifact?.headline !== question) result.fail(`process canvas ${artifactId} must lead with its distinguishing question`);
    if (!russian.artifacts?.[artifactId]?.headline) result.fail(`Russian process canvas ${artifactId} must lead with its distinguishing question`);
  }
  for (const artifact of data.artifacts.filter((item) => item.relationship)) {
    const relationship = russian.artifacts?.[artifact.id]?.relationship;
    if (!relationship?.title || !relationship?.text) result.fail(`Russian process canvas artifact ${artifact.id} is missing relationship text`);
  }

  for (const [id, label] of PHASES) {
    const phase = data.phases.find((item) => item.id === id);
    if (!phase) result.fail(`process canvas is missing phase ${id}`);
    else if (phase.label !== label) result.fail(`process canvas phase ${id} must be named "${label}", found "${phase.label}"`);
  }

  for (let stageNumber = 0; stageNumber <= 19; stageNumber += 1) {
    const stage = data.stages.find((item) => item.id === `stage-${String(stageNumber).padStart(2, '0')}`);
    if (!stage) {
      result.fail(`process canvas is missing Stage ${stageNumber}`);
      continue;
    }
    if (stage.title !== STAGE_NAMES[stageNumber]) {
      result.fail(`process canvas Stage ${stageNumber} must be named "${STAGE_NAMES[stageNumber]}", found "${stage.title}"`);
    }
  }

  const stage13 = data.stages.find((item) => item.id === 'stage-13');
  const stage13Contract = [stage13?.summary, stage13?.input, stage13?.exit, ...(stage13?.actions || [])].join(' ');
  if (!/Open Knowledge Format \(OKF\) v0\.2/i.test(stage13Contract) || !/vendor-neutral/i.test(stage13Contract)) {
    result.fail('process canvas Stage 13 must identify vendor-neutral Open Knowledge Format (OKF) v0.2');
  }
  const stage12 = data.stages.find((item) => item.id === 'stage-12');
  const stage12Question = 'Are all owner remarks from Stage 11 provably closed in the exact architecture files, without silently changing other decisions?';
  if (stage12?.headline !== stage12Question) {
    result.fail('process canvas Stage 12 must lead with its closure-integrity question');
  }
  if (!russian.stages?.['stage-12']?.headline) {
    result.fail('Russian process canvas Stage 12 must lead with its closure-integrity question');
  }
  if (!/separate immutable/i.test(stage12?.evidence || '') || !/architecture-closure-NNN\.md/i.test(stage12?.evidence || '')) {
    result.fail('process canvas Stage 12 must explain that closure is a separate immutable numbered report');
  }
  if (!Array.isArray(stage12?.xplannerExamples) || stage12.xplannerExamples.length < 3) {
    result.fail('process canvas Stage 12 must expose a real multi-file XPlanner evidence trail');
  }
  const ownerReview = data.artifacts.find((item) => item.id === 'nfr-owner-review');
  const ownerReviewText = [ownerReview?.desc, ownerReview?.usage, ownerReview?.example].join(' ');
  for (const token of ['stale', 'proposals', 'Owner amendment', 'Git', 'architecture-nfr-manifest.json']) {
    if (!ownerReviewText.includes(token)) result.fail(`process canvas nfr-owner-review must explain ${token}`);
  }
  const russianOwnerReview = russian.artifacts?.['nfr-owner-review'];
  const russianOwnerReviewText = [russianOwnerReview?.desc, russianOwnerReview?.usage, russianOwnerReview?.example].join(' ');
  for (const token of ['устарев', 'предложен', 'Owner amendment', 'Git', 'architecture-nfr-manifest.json']) {
    if (!russianOwnerReviewText.includes(token)) result.fail(`Russian process canvas nfr-owner-review must explain ${token}`);
  }

  const independentReviewArtifacts = [
    'stage-02-review',
    'stage-07-review',
    'stage-10-review',
    'stage-14-review',
    'stage-16-review',
    'stage-19-review',
  ];
  for (const artifactId of independentReviewArtifacts) {
    const artifact = data.artifacts.find((item) => item.id === artifactId);
    if (!/fresh independent .*agent/i.test(artifact?.usage || '')) {
      result.fail(`process canvas ${artifactId} must name the fresh independent agent that writes the report`);
    }
    if (!/нов(?:ый|ого) независим(?:ый|ого).*агент/i.test(russian.artifacts?.[artifactId]?.usage || '')) {
      result.fail(`Russian process canvas ${artifactId} must name the fresh independent agent that writes the report`);
    }
  }
  if (/fresh architect|new architect/i.test(JSON.stringify(data))) {
    result.fail('process canvas must describe architecture control as work by a fresh independent agent, not a new architect');
  }
  if (/новый архитектор/i.test(JSON.stringify(russian))) {
    result.fail('Russian process canvas must describe architecture control as work by a fresh independent agent, not a new architect');
  }

  for (const [kind, items] of [['stage', data.stages], ['artifact', data.artifacts], ['gate', data.gates]]) {
    for (const id of duplicateIds(items)) result.fail(`process canvas contains duplicate ${kind} id ${id}`);
  }

  const artifactIds = new Set(data.artifacts.map((item) => item.id));
  const gateIds = new Set(data.gates.map((item) => item.id));
  const stageIds = new Set(data.stages.map((item) => item.id));
  const allowedTransitions = collectAllowedTransitions(schema);
  for (const stage of data.stages) {
    for (const id of [...stage.inputs, ...stage.outputs]) {
      if (!artifactIds.has(id)) result.fail(`${stage.id} references unknown artifact ${id}`);
    }
    for (const id of stage.gates) {
      if (!gateIds.has(id)) result.fail(`${stage.id} references unknown gate ${id}`);
    }
    for (const target of stage.returnTo || []) {
      if (!stageIds.has(target)) result.fail(`${stage.id} returns to unknown stage ${target}`);
      if (!allowedTransitions.get(stage.id)?.has(target)) {
        result.fail(`${stage.id} displays return to ${target}, but migration_status.schema.json rejects it`);
      }
    }
    const number = stageNumber(stage.id);
    if (number === 0) {
      if (stage.inputs.includes('status') || !stage.outputs.includes('status')) {
        result.fail('Bootstrap must create migration_status.yaml without consuming it as an input');
      }
    } else if (!stage.inputs.includes('status') || !stage.outputs.includes('status')) {
      result.fail(`${stage.id} must show migration_status.yaml as a standing input and updated output`);
    }
    if (number > 0) {
      const expectedReturns = [...(allowedTransitions.get(stage.id) || [])]
        .filter((target) => {
          const targetNumber = stageNumber(target);
          return targetNumber !== null && targetNumber < number;
        });
      const displayedReturns = stage.returnTo || [];
      const missing = expectedReturns.filter((target) => !displayedReturns.includes(target));
      const extra = displayedReturns.filter((target) => !expectedReturns.includes(target));
      if (missing.length || extra.length) {
        result.fail(`${stage.id} return arrows do not match the legal backward transitions; missing=[${missing.join(', ')}], extra=[${extra.join(', ')}]`);
      }
      for (const target of displayedReturns) {
        const targetNumber = stageNumber(target);
        if (!stage.returns.includes(`Stage ${targetNumber}`)) {
          result.fail(`${stage.id} displays a return arrow to ${target}, but its card text does not mention Stage ${targetNumber}`);
        }
      }
    }
  }

  for (const artifact of data.artifacts) {
    if (!artifact.usage || !artifact.usage.trim()) result.fail(`${artifact.id} is missing practical usage guidance`);
    if (!artifact.example || !artifact.example.trim()) result.fail(`${artifact.id} is missing a practical usage example`);
    const exists = fs.existsSync(path.join(root, artifact.sourcePath));
    if (artifact.sourceExists !== exists) {
      result.fail(`${artifact.id} has stale sourceExists=${artifact.sourceExists}; ${artifact.sourcePath} existence is ${exists}`);
    }
  }
  for (const gate of data.gates) {
    if (!gate.usage || !gate.usage.trim()) result.fail(`${gate.id} is missing practical usage guidance`);
    if (!gate.example || !gate.example.trim()) result.fail(`${gate.id} is missing a practical usage example`);
    if (!gate.sourcePath || !gate.sourcePath.trim()) result.fail(`${gate.id} is missing an implementation or evidence reference`);
    const exists = gate.sourcePath && fs.existsSync(path.join(root, gate.sourcePath));
    if (gate.sourceExists !== exists) {
      result.fail(`${gate.id} has stale sourceExists=${gate.sourceExists}; ${gate.sourcePath} existence is ${exists}`);
    }
  }
  return true;
}

function validateHtml(root, result) {
  const file = path.join(root, 'analysis', 'migration_methodology.html');
  const schemaFile = path.join(root, 'analysis', 'migration_status.schema.json');
  if (!fs.existsSync(file)) {
    result.fail('methodology HTML presentation is missing');
    return;
  }
  if (!fs.existsSync(schemaFile)) {
    result.fail('migration status schema is missing');
    return;
  }
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
  const allowedTransitions = collectAllowedTransitions(schema);
  const stage13Text = $('#ph13').text().replace(/\s+/g, ' ');
  if (!/Open Knowledge Format \(OKF\) v0\.2/i.test(stage13Text) || !/vendor-neutral/i.test(stage13Text)) {
    result.fail('methodology HTML Stage 13 must identify vendor-neutral Open Knowledge Format (OKF) v0.2');
  }
  const stage12Text = $('#ph12').text().replace(/\s+/g, ' ');
  if (!/Are all owner remarks from Stage 11 provably closed/i.test(stage12Text) || !/separate immutable/i.test(stage12Text) || !/architecture-closure-NNN\.md/i.test(stage12Text) || !/Real XPlanner example/i.test(stage12Text)) {
    result.fail('methodology HTML Stage 12 must locate closure evidence and show a real XPlanner example');
  }
  const stage9Text = $('body').text().replace(/\s+/g, ' ');
  if (!stage9Text.includes('standing input and updated output of every Stage 1-19')) {
    result.fail('methodology HTML must explain the global migration_status.yaml lifecycle');
  }
  for (const token of ['stale', 'proposal', 'Owner amendment', 'Git', 'architecture-nfr-manifest.json']) {
    if (!stage9Text.includes(token)) result.fail(`methodology HTML Stage 9 owner-review lifecycle must explain ${token}`);
  }
  for (const token of ['Who writes an artifact', 'stage agent writes the file']) {
    if (!stage9Text.includes(token)) result.fail(`methodology HTML artifact authorship must explain ${token}`);
  }
  for (let stageNumber = 0; stageNumber <= 19; stageNumber += 1) {
    const selector = stageNumber === 0 ? '#ph-bootstrap h3' : `#ph${stageNumber} h3`;
    const heading = $(selector).first().clone();
    heading.children().remove();
    const title = heading.text().replace(/\s+/g, ' ').trim();
    const expected = `${stageNumber} · ${STAGE_NAMES[stageNumber]}`;
    if (title !== expected) result.fail(`methodology HTML must use heading "${expected}", found "${title || 'missing'}"`);

    if (stageNumber > 0) {
      const stageId = `stage-${String(stageNumber).padStart(2, '0')}`;
      const sectionText = $(`#ph${stageNumber}`).text().replace(/\s+/g, ' ');
      const backwardTargets = [...(allowedTransitions.get(stageId) || [])]
        .map((target) => [target, /^stage-(\d{2})$/.exec(target)])
        .filter(([, match]) => match && Number.parseInt(match[1], 10) < stageNumber);
      for (const [target, match] of backwardTargets) {
        const targetNumber = Number.parseInt(match[1], 10);
        if (!new RegExp(`\\bstage\\s+${targetNumber}\\b`, 'i').test(sectionText)) {
          result.fail(`methodology HTML ${stageId} does not explain its legal return to ${target}`);
        }
      }
    }
  }
}

function validateMethodologyReturns(root, result) {
  const file = path.join(root, 'analysis', 'migration_methodology.md');
  if (!fs.existsSync(file)) {
    result.fail('migration methodology Markdown is missing');
    return;
  }
  const source = fs.readFileSync(file, 'utf8');
  const normalizedSource = source.replace(/\s+/g, ' ');
  if (!normalizedSource.includes('Are all owner remarks from Stage 11 provably closed in the exact architecture files, without silently changing other decisions?')) {
    result.fail('methodology Markdown Stage 12 must lead with its closure-integrity question');
  }
  if (!normalizedSource.includes('standing input and updated output of every Stage 1-19')) {
    result.fail('methodology Markdown must explain the global migration_status.yaml lifecycle');
  }
  const requiredRows = [
    '| Stages 6–8 | Stage 6 / Stage 5 / Stage 1 |',
    '| Stages 10–12 | Stage 9 / Stage 6 / Stage 5 / Stage 1 |',
    '| Stage 14 | Stage 13 / Stage 9 / Stage 6 / Stage 5 / Stage 1 |',
    '| Stage 16 | Stage 15 / Stage 13 / Stage 9 / Stage 6 / Stage 5 / Stage 1 |',
    '| Stage 17 | Stage 15 / Stage 9 / Stage 1 |',
    '| Stage 18 | Stage 17 / Stage 15 / Stage 9 / Stage 1 |',
    '| Stages 18-19 | Stage 17 / Stage 15 / Stage 9 / Stage 1 |',
  ];
  for (const row of requiredRows) {
    if (!source.includes(row)) result.fail(`methodology return table is missing "${row}"`);
  }
  for (const token of ['review stale', 'are proposals', 'Owner amendment', 'Git preserves', 'repins `architecture-nfr-manifest.json`']) {
    if (!source.includes(token)) result.fail(`methodology Markdown owner-review lifecycle is missing "${token}"`);
  }
  for (const token of ['Artifact authorship is assigned by the active stage', 'the agent writes the repository file']) {
    if (!source.includes(token)) result.fail(`methodology Markdown artifact authorship is missing "${token}"`);
  }
}

function validateDrawio(root, result) {
  const file = path.join(root, 'analysis', 'migration_artifact_flow.drawio');
  if (!fs.existsSync(file)) {
    result.fail('migration artifact-flow Draw.io presentation is missing');
    return;
  }
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('<mxfile') || !source.includes('</mxfile>')) result.fail('migration artifact-flow Draw.io is not a complete mxfile document');
  const required = [
    'AGENTS.md',
    'MIGRATION.md',
    'analysis/migration_methodology.md',
    'config/project.template.yaml',
    'analysis/migration_status.template.yaml',
    'architecture-nfr-manifest.json',
    'Coding',
    'stages 18-19',
    'prototype → 6 · baseline → 5 · map → 1',
    'knowledge → 13 · architecture → 9 · prototype → 6/5 · map → 1',
    'SDD → 15 · knowledge → 13 · architecture → 9 · prototype → 6/5 · map → 1',
    'implementation → 17 · SDD → 15 · architecture → 9 · map → 1',
    'later edits stay proposals until a dated owner amendment',
    'Who writes: the actor named for the active stage',
    'global U artifact: created once in Bootstrap, read by every Stage 1-19 and updated at durable checkpoints',
  ];
  for (const token of required) {
    if (!source.includes(token)) result.fail(`migration artifact-flow Draw.io is missing "${token}"`);
  }
}

function auditProcessViews(input = {}) {
  const root = path.resolve(input.root || process.env.AUDIT_ROOT || path.join(__dirname, '..', '..'));
  const result = new AuditResult('PROCESS VIEW SYNC AUDIT');
  const roles = auditAgentRoles({ root });
  for (const error of roles.errors) result.fail(error);
  try {
    require('./process-consistency-audit').run(root);
    require('./translation-audit').run(root);
    require('../agent-system/build-view').synchronize(root, true);
  } catch (error) { result.fail(error.message); }
  const reading = require('./artifact-reading').auditArtifactReading({ root });
  for (const error of reading.errors) result.fail(error);
  const boundaries = require('./process-boundary-audit').auditProcessBoundaries({ root });
  for (const error of boundaries.errors) result.fail(error);
  const gateContract = require('./sync-stage-gates').auditStageGates({ root });
  for (const error of gateContract.errors) result.fail(error);
  const presentationContract = require('./sync-presentation-structure').auditPresentationContract({ root });
  for (const error of presentationContract.errors) result.fail(error);
  const responsibility = require('./artifact-responsibility-audit').auditArtifactResponsibilities({ root });
  for (const error of responsibility.errors) result.fail(error);
  const naming = auditArtifactNaming({ root });
  for (const error of naming.errors) result.fail(error);
  const canvasPresent = validateCanvas(root, result);
  validateMethodologyReturns(root, result);
  validateHtml(root, result);
  validateDrawio(root, result);
  result.summary = `HTML and Draw.io checked; Process Canvas ${canvasPresent ? 'checked' : 'not installed in this initialized project'}`;
  return result;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  rejectGovernedOverrides(args, ['root'], ['AUDIT_ROOT']);
  process.exitCode = printResult(auditProcessViews({ root: args.root }));
}

module.exports = {
  auditProcessViews,
  collectAllowedTransitions,
  validateCanvas,
  validateDrawio,
  validateHtml,
  validateMethodologyReturns,
};

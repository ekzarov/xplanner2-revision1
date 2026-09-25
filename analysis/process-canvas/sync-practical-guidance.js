#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const START_ARTIFACTS = '<!-- PRACTICAL_ARTIFACT_GUIDE_START -->';
const END_ARTIFACTS = '<!-- PRACTICAL_ARTIFACT_GUIDE_END -->';
const START_GATES = '<!-- PRACTICAL_GATE_GUIDE_START -->';
const END_GATES = '<!-- PRACTICAL_GATE_GUIDE_END -->';
const START_DOMAIN = '<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->';
const END_DOMAIN = '<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->';
const START_FILE_GUIDE = '[//]: # (ARTIFACT_USE_START)';
const END_FILE_GUIDE = '[//]: # (ARTIFACT_USE_END)';
const starterRoot = path.resolve(__dirname, '..', '..');
const targetArg = process.argv.find((arg) => arg.startsWith('--target-root='));
const targetRoot = targetArg ? path.resolve(targetArg.slice('--target-root='.length)) : starterRoot;
const check = process.argv.includes('--check');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const isStarter = fs.existsSync(path.join(targetRoot, '.migration-starter-source'));
const createdArg = process.argv.find(arg => arg.startsWith('--bootstrap-created='));
const allowedFiles = createdArg
  ? require('../tools/bootstrap-guidance').createdFiles(targetRoot, createdArg.slice('--bootstrap-created='.length)) : null;
const allowed = relativePath => !allowedFiles || allowedFiles.has(relativePath);
const normalize = (relativePath, text) => relativePath.endsWith('.md')
  ? require('../tools/artifact-reference-links').linkedDocument(targetRoot, path.join(targetRoot, relativePath), text) : text;

function cell(value) {
  return String(value || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function recordBoundary(artifact) {
  const profile = artifact.recordContract?.en;
  return profile ? ` **${cell(profile.title)}:** ${cell(profile.fields.join('; '))}. ${cell(profile.note)}` : '';
}

function pinnedXPlannerLink(relativePath, fragment) {
  if (!relativePath) return 'n/a';
  const encoded = relativePath.split('/').map(encodeURIComponent).join('/');
  const revision = data.exampleRevisions?.[relativePath] || data.exampleRevision;
  return `[${cell(relativePath)}](${data.exampleRepository}/blob/${revision}/${encoded}${fragment ? '#' + encodeURIComponent(fragment) : ''})`;
}

function starterReference(relativePath, localPrefix = '') {
  const label = cell(relativePath);
  if (fs.existsSync(path.join(targetRoot, relativePath))) {
    return `[${label}](${localPrefix}${label})`;
  }
  const encoded = relativePath.split('/').map(encodeURIComponent).join('/');
  return `[${label}](${data.repository}/blob/main/${encoded})`;
}

function artifactGuide() {
  const rows = data.artifacts.map((artifact) => {
    const reference = starterReference(artifact.sourcePath);
    const artifactName = artifact.outputPath && fs.existsSync(path.join(targetRoot, artifact.outputPath))
      ? `[\`${cell(artifact.label)}\`](${cell(artifact.outputPath)})`
      : `\`${cell(artifact.label)}\``;
    const example = artifact.xplannerExample?.path
      ? pinnedXPlannerLink(artifact.xplannerExample.path, artifact.xplannerExample.fragment)
      : artifact.xplannerExample?.url
        ? `[XPlanner pull request](${artifact.xplannerExample.url})`
        : 'n/a';
    const headline = artifact.headline ? `**${cell(artifact.headline)}** ` : '';
    const responsibility = artifact.responsibility.en;
    return `| ${artifactName} | ${headline}**Created by:** ${cell(responsibility.creator)} **Maintained / decided by:** ${cell(responsibility.maintainer)} **Instructions:** ${cell(responsibility.instructions)} ${cell(artifact.usage)}${recordBoundary(artifact)} | ${cell(artifact.example)} | ${reference}; ${example} |`;
  });
  return [
    START_ARTIFACTS,
    '| Artifact | When and how it is used | Concrete example | Template / real reference |',
    '|---|---|---|---|',
    ...rows,
    END_ARTIFACTS,
  ].join('\n');
}

function gateGuide() {
  const rows = data.gates.map((gate) => {
    const implementationReference = starterReference(gate.sourcePath, '../../');
    return `| \`${cell(gate.label)}\` | **${cell(gate.headline)}** ${cell(gate.desc)} [Files, actors and limits](../gate-review-guide.md#${gate.id}). | ${cell(gate.usage)} | ${cell(gate.example)} | ${implementationReference}; ${pinnedXPlannerLink(gate.xplannerPath)} |`;
  });
  return [
    START_GATES,
    '| Gate | Why it exists | When and how it is used | Concrete example | Implementation / evidence |',
    '|---|---|---|---|---|',
    ...rows,
    END_GATES,
  ].join('\n');
}

function domainGuide(ids, relativePath) {
  const selected = ids.map((id) => {
    const artifact = data.artifacts.find((candidate) => candidate.id === id);
    if (!artifact) throw new Error(`Unknown practical artifact id ${id}`);
    return artifact;
  });
  const rows = selected.map((artifact) => {
    const outputLink = artifact.outputPath && fs.existsSync(path.join(targetRoot, artifact.outputPath))
      ? path.relative(path.dirname(relativePath), artifact.outputPath).split(path.sep).join('/') : null;
    const artifactLabel = outputLink ? `[\`${cell(artifact.label)}\`](${outputLink})` : `\`${cell(artifact.label)}\``;
    const headline = artifact.headline ? `**${cell(artifact.headline)}** ` : '';
    const responsibility = artifact.responsibility.en;
    return `<details>\n<summary>${cell(artifact.label)}</summary>\n\n${headline.trim()}\n\n${cell(artifact.desc)}${recordBoundary(artifact)}\n\n- **Created by:** ${cell(responsibility.creator)}\n- **Maintained / decided by:** ${cell(responsibility.maintainer)}\n- **Instructions:** ${cell(responsibility.instructions)}\n\n**When used:** ${cell(artifact.usage)}\n\n**Example:** ${cell(artifact.example)}\n\n${outputLink ? `**Project file:** ${artifactLabel}\n\n` : ''}</details>`;
  });
  return [
    START_DOMAIN,
    '<a id="read-artifact-use-in-practice"></a>',
    '## Artifact Use In Practice',
    '',
    'Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.',
    '',
    ...rows,
    END_DOMAIN,
  ].join('\n');
}

function practicalArtifact(id) {
  const artifact = data.artifacts.find((candidate) => candidate.id === id);
  if (!artifact) throw new Error(`Unknown practical artifact id ${id}`);
  return {
    question: artifact.headline,
    recordContract: artifact.recordContract?.en,
    responsibility: artifact.responsibility.en,
    when: artifact.usage,
    how: artifact.desc,
    example: artifact.example,
  };
}

function customPracticalArtifact(when, how, example) {
  return { when, how, example };
}

function fileGuide(value, placement) {
  if (!value.responsibility) throw new Error('Artifact guidance must name its creator, maintainer and governing instructions');
  const guidance = [
    '<details>',
    '<summary><strong>Artifact guidance (not project evidence)</strong></summary>',
    '',
    '> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.',
    '',
    ...(value.question ? [`- **Question answered:** **${value.question}**`] : []),
    `- **Created by:** ${value.responsibility.creator}`,
    `- **Maintained / decided by:** ${value.responsibility.maintainer}`,
    `- **Governing instructions:** ${value.responsibility.instructions}`,
    `- **When used:** ${value.when}`,
    `- **How used:** ${value.how}`,
    `- **Example:** ${value.example}`,
    ...(value.traceabilityFollowUp ? ['', '**Verification links:** ' + value.traceabilityFollowUp] : []),
    ...(value.recordContract ? ['', `**${value.recordContract.title}:**`, '', ...value.recordContract.fields.map(field => `- ${field}`), '', value.recordContract.note] : []),
    ...(value.cosmeticFollowUp?.length ? ['', '**Conditional cosmetic backlog check:**', '', ...value.cosmeticFollowUp.map(text => `- ${text}`)] : []),
    '',
    '</details>',
  ];
  return [
    START_FILE_GUIDE,
    ...(placement === 'append' ? ['---', '', ...guidance] : [...guidance, '', '---']),
    END_FILE_GUIDE,
  ].join('\n');
}

function synchronize(relativePath, startMarker, endMarker, generated) {
  if (!allowed(relativePath)) return;
  const file = path.join(targetRoot, relativePath);
  const current = fs.readFileSync(file, 'utf8');
  const start = current.indexOf(startMarker);
  const end = current.indexOf(endMarker);
  if (start < 0 || end < start) throw new Error(`${relativePath} is missing practical-guidance markers`);
  const next = normalize(relativePath, `${current.slice(0, start)}${generated}${current.slice(end + endMarker.length)}`);
  if (check) {
    if (current !== next) throw new Error(`${relativePath} practical guidance is stale`);
    return;
  }
  fs.writeFileSync(file, next);
}

function synchronizeDomain(relativePath, ids) {
  if (!allowed(relativePath)) return;
  const file = path.join(targetRoot, relativePath);
  const current = fs.readFileSync(file, 'utf8');
  const generated = domainGuide(ids, relativePath);
  const start = current.indexOf(START_DOMAIN);
  const end = current.indexOf(END_DOMAIN);
  let next;
  if (start >= 0 && end >= start) {
    next = `${current.slice(0, start)}${generated}${current.slice(end + END_DOMAIN.length)}`;
  } else {
    const heading = current.match(/^# .+$/m);
    if (!heading || heading.index === undefined) throw new Error(`${relativePath} has no H1`);
    const offset = heading.index + heading[0].length;
    next = `${current.slice(0, offset)}\n\n${generated}${current.slice(offset)}`;
  }
  next = normalize(relativePath, next);
  if (check) {
    if (current !== next) throw new Error(`${relativePath} domain artifact guidance is stale`);
    return;
  }
  fs.writeFileSync(file, next);
}

function synchronizeFileGuide(relativePath, value, placement = 'after-heading') {
  if (!allowed(relativePath)) return;
  const file = path.join(targetRoot, relativePath);
  if (!fs.existsSync(file)) throw new Error(`${relativePath} is missing`);
  const current = fs.readFileSync(file, 'utf8');
  const cosmeticStages = /tasks-template\.md$/.test(relativePath) ? [15, 17]
    : /(?:sdd-record|spec-template|plan-template).*\.md$/.test(relativePath) ? [15]
    : /(?:stage-NN-pass-NNN-template|review_template)\.md$/.test(relativePath) ? [16]
    : /(?:delivery-NNN|stage-18-delivery-record)-template\.md$/.test(relativePath) ? [18]
    : /(?:stage-19-pass-NNN|stage-19-acceptance)-template\.md$/.test(relativePath) ? [19] : [];
  const cosmeticFollowUp = cosmeticStages.map(number => `Stage ${number}${number === 16 ? ' only (other review stages keep their own inputs)' : ''}: ${data.stages.find(stage => stage.number === number).evidence}`);
  if (cosmeticStages.length) cosmeticFollowUp.push('Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.');
  const traceabilityFollowUp = /(?:spec|plan|tasks)-template\.md$/.test(relativePath)
    ? 'The Stage 15 agent maps each requirement and applicable NFR to planned checks and links this SDD in Slice Verification Index. Stage 16 checks coverage; Stage 17 records concrete tests/procedures, expected and observed results, exact version and evidence separately from the plan. Follow [the verification-link contract](../../specs/traceability-guide.md); missing results are explicit, never passed by inference.' : null;
  const generated = fileGuide({ ...value, cosmeticFollowUp, traceabilityFollowUp }, placement);
  const marker = /(?:<!-- ARTIFACT_USE_START -->|\[\/\/\]: # \(ARTIFACT_USE_START\))[\s\S]*?(?:<!-- ARTIFACT_USE_END -->|\[\/\/\]: # \(ARTIFACT_USE_END\))/;
  let next;
  if (placement === 'append') {
    const withoutExisting = current.replace(marker, '').trimEnd();
    next = `${withoutExisting}\n\n${generated}\n`;
  } else if (marker.test(current)) {
    next = current.replace(marker, generated);
  } else {
    const heading = current.match(/^# .+$/m);
    if (!heading || heading.index === undefined) throw new Error(`${relativePath} has no H1`);
    const offset = heading.index + heading[0].length;
    next = `${current.slice(0, offset)}\n\n${generated}${current.slice(offset)}`;
  }
  next = normalize(relativePath, next);
  if (check) {
    if (current !== next) throw new Error(`${relativePath} in-file artifact guidance is stale`);
    return;
  }
  fs.writeFileSync(file, next);
}

if (process.argv.includes('--gates-only')) {
  synchronize('analysis/tools/README.md', START_GATES, END_GATES, gateGuide());
  require('../tools/sync-gate-review-guide').synchronize(targetRoot, check, allowedFiles);
  console.log(`Gate guidance ${check ? 'checked' : 'synchronized'} in ${targetRoot}`);
  process.exit(0);
}

if (isStarter) {
  synchronize('ARTIFACTS.md', START_ARTIFACTS, END_ARTIFACTS, artifactGuide());
  synchronize('analysis/tools/README.md', START_GATES, END_GATES, gateGuide());
  synchronizeDomain('analysis/legacy_user_flows_template_instructions.md', [
    'parity-map',
  ]);
  synchronizeDomain('analysis/prototyping/README.md', [
    'prototype-decision',
    'ui-design-system',
    'ui-design-tokens',
    'screen-normalization',
    'wireframes',
    'screen-manifest',
    'stage-07-review',
    'polish-backlog',
    'prototype-approval',
  ]);
  synchronizeDomain('analysis/architecture/README.md', [
    'feature-dependencies',
    'nfr-workbook',
    'nfr-owner-review',
    'architecture-record',
    'architecture-sections',
    'architecture-drawio',
    'adrs',
    'nfr-manifest',
    'stage-10-review',
    'architecture-verdict',
    'architecture-closure',
  ]);
  synchronizeDomain('analysis/architecture/architecture-nfr-decision-register-instructions.md', [
    'nfr-workbook',
  ]);
  synchronizeDomain('analysis/knowledge/README.md', [
    'knowledge-bundle',
    'knowledge-manifest',
    'stage-13-record',
    'stage-14-review',
  ]);
  synchronizeDomain('analysis/inventories/README.md', [
    'target-inventory',
  ]);
  synchronizeDomain('analysis/reviews/README.md', [
    'stage-02-review',
    'stage-07-review',
    'stage-10-review',
    'stage-14-review',
    'stage-16-review',
    'stage-19-review',
  ]);
  synchronizeDomain('analysis/stages/README.md', [
    'bootstrap-gate-report',
    'stage-03-walkthrough',
    'stage-04-revision',
    'stage-13-record',
    'stage-15-record',
    'delivery-record',
    'journey-evidence',
    'stage-19-review',
    'owner-walkthrough',
  ]);
  synchronizeDomain('specs/README.md', [
    'feature-dependencies',
    'sdd-spec',
    'sdd-plan',
    'sdd-tasks',
    'traceability',
  ]);
} else {
  synchronize('ARTIFACTS.md', START_ARTIFACTS, END_ARTIFACTS, artifactGuide());
  synchronize('analysis/tools/README.md', START_GATES, END_GATES, gateGuide());
  synchronizeDomain('analysis/legacy_user_flows_template_instructions.md', [
    'parity-map',
  ]);
  synchronizeDomain('analysis/prototyping/README.md', [
    'prototype-decision',
    'ui-design-system',
    'ui-design-tokens',
    'screen-normalization',
    'wireframes',
    'screen-manifest',
    'stage-07-review',
    'polish-backlog',
    'prototype-approval',
  ]);
  synchronizeDomain('analysis/architecture/README.md', [
    'feature-dependencies',
    'nfr-workbook',
    'nfr-owner-review',
    'architecture-record',
    'architecture-sections',
    'architecture-drawio',
    'adrs',
    'nfr-manifest',
    'stage-10-review',
    'architecture-verdict',
    'architecture-closure',
  ]);
  synchronizeDomain('analysis/architecture/architecture-nfr-decision-register-instructions.md', [
    'nfr-workbook',
  ]);
  synchronizeDomain('analysis/knowledge/README.md', [
    'knowledge-bundle',
    'knowledge-manifest',
    'stage-13-record',
    'stage-14-review',
  ]);
  synchronizeDomain('analysis/inventories/README.md', [
    'target-inventory',
  ]);
  synchronizeDomain('analysis/reviews/README.md', [
    'stage-02-review',
    'stage-07-review',
    'stage-10-review',
    'stage-14-review',
    'stage-16-review',
    'stage-19-review',
  ]);
  synchronizeDomain('analysis/stages/README.md', [
    'bootstrap-gate-report',
    'stage-03-walkthrough',
    'stage-04-revision',
    'stage-13-record',
    'stage-15-record',
    'delivery-record',
    'journey-evidence',
    'stage-19-review',
    'owner-walkthrough',
  ]);
}

if (!isStarter && fs.existsSync(path.join(targetRoot, 'specs/README.md'))) {
  synchronizeDomain('specs/README.md', [
    'feature-dependencies','sdd-spec', 'sdd-plan', 'sdd-tasks', 'traceability']);
}

const reviewGuide = customPracticalArtifact(
  'A fresh independent agent creates one report for every Stage 2, 7, 10, 14 or 16 control attempt; Stage 19 uses its dedicated acceptance template.',
  'The report proves reviewer independence, pins the reviewed scope and revision, records checks and findings, and gives the exact verdict used by migration_status.yaml. Once referenced as evidence it is immutable; corrections require a new pass file.',
  'A Stage 7 reviewer finds an edit action on a read-only wireframe, records findings in stage-07-pass-018.md and returns the scope to Stage 6.'
);
const deliveryGuide = customPracticalArtifact(
  'The Stage 18 agent records the exact merged candidate during delivery and completes Live Reconciliation before handing it to independent Stage 19 acceptance.',
  'It binds deployment, smoke, browser journey, recovery and live coverage reconciliation to one revision and environment. The delivery audit validates required structure and bindings; the agent and independent reviewer assess coverage and evidence meaning.',
  'The agent deploys revision abc123, records required checks, reuses an applicable save-hours journey observation and investigates an uncovered read-only action in the same delivery report.'
);
const knowledgeConceptGuide = customPracticalArtifact(
  'Created at Stage 13 when approved architecture must be translated into stable target-system knowledge for SDD authors and later agents.',
  'Each concept explains one boundary or behavior and cites the exact architecture and parity sources from which it was derived; the knowledge manifest pins its hash.',
  'An Identity and Session concept explains cookie, CSRF and SSO boundaries and cites the accepted security NFR and ADR.'
);
const knowledgeIndexGuide = customPracticalArtifact(
  'Created at Stage 13 as the human navigation page for the verified knowledge bundle.',
  'It lists the bundle version, source architecture set and available concepts so an SDD author can find the right verified explanation without searching the repository blindly.',
  'A Stage 15 author follows the index to the Identity and Session concept before specifying a login slice.'
);
const waiverGuide = customPracticalArtifact(
  'Created only when a named process rule explicitly permits an exceptional path and ordinary completion is impossible or deliberately deferred.',
  'Use separate Decision and Authority, Scope, Blocked Activity, Rationale, Residual Risk, Permitted Next Stage, Exception Boundary And Follow-up, and Independent Review sections. The agent fills each from evidence or explicitly records what is unknown. Preserve the original decision and timestamp; a waiver never silently weakens unrelated gates or supplies independent approval.',
  'A pre-SDD knowledge waiver permits one exact slice to proceed while the full knowledge bundle is unavailable, then expires when that slice closes.'
);

reviewGuide.responsibility = {
  creator: 'A fresh independent agent assigned to the reviewed stage writes the report.',
  maintainer: 'The reviewer creates a new immutable report for each attempt; the reviewed author does not self-approve.',
  instructions: 'Independent control at Stages 2, 7, 10, 14 and 16, plus reviewer eligibility rules.',
};
deliveryGuide.responsibility = practicalArtifact('delivery-record').responsibility;
knowledgeConceptGuide.responsibility = practicalArtifact('knowledge-bundle').responsibility;
knowledgeIndexGuide.responsibility = practicalArtifact('knowledge-bundle').responsibility;
waiverGuide.question = practicalArtifact('owner-waiver').question;
waiverGuide.responsibility = {
  creator: 'The active-stage agent prepares the waiver record; the named human authority explicitly grants or refuses the exception.',
  maintainer: 'The agent records scope, evidence and expiry; only the authorized decision maker may extend or replace the decision.',
  instructions: 'The exact waiver provision in MIGRATION.md and the applicable stage procedure; no blanket waiver is inferred.',
};

const starterFileGuides = [
  ['analysis/prototyping/templates/ui-design-system-template.md', practicalArtifact('ui-design-system')],
  ['analysis/stages/templates/bootstrap-gate-report-template.md', practicalArtifact('bootstrap-gate-report')],
  ['analysis/legacy_reconnaissance.template.md', practicalArtifact('recon-record')],
  ['analysis/reviews/stage-NN-pass-NNN-template.md', reviewGuide],
  ['analysis/stages/templates/walkthrough-NNN-template.md', practicalArtifact('stage-03-walkthrough')],
  ['analysis/stages/templates/stage-04-requirements-revision-template.md', practicalArtifact('stage-04-revision')],
  ['analysis/prototyping/templates/ui-ux-decision-template.md', practicalArtifact('prototype-decision')],
  ['analysis/prototyping/templates/ui-polish-backlog-template.md', practicalArtifact('polish-backlog')],
  ['analysis/prototyping/templates/ui-ux-approval-template.md', practicalArtifact('prototype-approval')],
  ['analysis/architecture/templates/architecture-nfr-owner-review-template.md', practicalArtifact('nfr-owner-review')],
  ['analysis/architecture/templates/architecture-template.md', practicalArtifact('architecture-record')],
  ['analysis/architecture/templates/sections/00-foundation-template.md', practicalArtifact('architecture-sections')],
  ['analysis/architecture/templates/sections/NN-SLUG-template.md', practicalArtifact('architecture-sections')],
  ['analysis/architecture/templates/NNN-SLUG-template.md', practicalArtifact('adrs')],
  ['analysis/architecture/templates/architecture-owner-verdict-NNN-template.md', practicalArtifact('architecture-verdict')],
  ['analysis/architecture/templates/architecture-closure-NNN-template.md', practicalArtifact('architecture-closure')],
  ['analysis/knowledge/templates/SLUG-template.md', knowledgeConceptGuide],
  ['analysis/knowledge/templates/index-template.md', knowledgeIndexGuide],
  ['analysis/stages/templates/knowledge-record-template.md', practicalArtifact('stage-13-record')],
  ['analysis/stages/templates/sdd-record-template.md', practicalArtifact('stage-15-record')],
  ['analysis/stages/templates/delivery-NNN-template.md', deliveryGuide],
  ['analysis/stages/templates/stage-19-pass-NNN-template.md', practicalArtifact('stage-19-review')],
  ['analysis/stages/templates/owner-walkthrough-NNN-template.md', practicalArtifact('owner-walkthrough')],
  ['analysis/stages/templates/owner-walkthrough-decline-template.md', practicalArtifact('owner-walkthrough-decline')],
  ['analysis/stages/templates/GATE-SCOPE-template.md', waiverGuide],
  ['.specify/templates/spec-template.md', practicalArtifact('sdd-spec')],
  ['.specify/templates/plan-template.md', practicalArtifact('sdd-plan')],
  ['.specify/templates/tasks-template.md', practicalArtifact('sdd-tasks')],
  ['specs/traceability.template.md', practicalArtifact('traceability')],
  ['specs/verification-record.template.md', {
    question: 'What was actually checked, on which version, and what remains unverified?',
    when: 'The Stage 17 agent records actual runs; Stage 18-19 agents add separate delivery/acceptance records. Earlier evidence remains immutable.',
    how: 'Links each in-scope requirement and applicable NFR to a concrete test or procedure, expected and observed outcome, checked revision, environment and evidence. Independent reviewers inspect the meaning; recorded is not a pass.',
    example: 'A no-stories requirement links to a named empty-state test and its run log; missing revision information remains an explicit gap.',
    responsibility: {
      creator: 'The Stage 17 implementation agent records actual requirement-level checks from executed tests or procedures.',
      maintainer: 'Stage 18-19 agents add separate delivery and acceptance evidence; independent agents review without rewriting historical runs.',
      instructions: 'Stage 15-19 traceability and verification-link contract in specs/traceability-guide.md',
    },
  }],
];
const historicalTemplateNames = {
  'analysis/stages/templates/walkthrough-NNN-template.md': 'analysis/stages/templates/stage-03-walkthrough-template.md',
  'analysis/architecture/templates/sections/00-foundation-template.md': 'analysis/architecture/templates/sections/foundation-template.md',
  'analysis/architecture/templates/sections/NN-SLUG-template.md': 'analysis/architecture/templates/sections/area-template.md',
  'analysis/architecture/templates/NNN-SLUG-template.md': 'analysis/architecture/templates/adr-template.md',
  'analysis/knowledge/templates/SLUG-template.md': 'analysis/knowledge/templates/concept-template.md',
  'analysis/stages/templates/knowledge-record-template.md': 'analysis/stages/templates/stage-13-knowledge-record-template.md',
  'analysis/stages/templates/sdd-record-template.md': 'analysis/stages/templates/stage-15-sdd-record-template.md',
  'analysis/stages/templates/delivery-NNN-template.md': 'analysis/stages/templates/stage-18-delivery-record-template.md',
  'analysis/stages/templates/stage-19-pass-NNN-template.md': 'analysis/stages/templates/stage-19-acceptance-template.md',
  'analysis/stages/templates/owner-walkthrough-NNN-template.md': 'analysis/stages/templates/stage-19-owner-walkthrough-template.md',
  'analysis/stages/templates/owner-walkthrough-decline-template.md': 'analysis/stages/templates/stage-19-owner-walkthrough-decline-template.md',
  'analysis/stages/templates/GATE-SCOPE-template.md': 'analysis/stages/templates/waiver-template.md',
  'analysis/reviews/stage-NN-pass-NNN-template.md': 'analysis/reviews/review_template.md',
};

if (isStarter) {
  for (const [file, value] of starterFileGuides) synchronizeFileGuide(file, value);
} else {
  // Existing signed reports and hash-pinned project decisions keep their bytes.
  // The complete domain/catalog descriptions cover them; new files inherit the templates below.
  for (const [file, value] of starterFileGuides) {
    const historical = historicalTemplateNames[file];
    const projectFile = historical && fs.existsSync(path.join(targetRoot, historical)) ? historical : file;
    if (fs.existsSync(path.join(targetRoot, projectFile))) synchronizeFileGuide(projectFile, value);
  }
}

function writeGenerated(relativePath, text) {
  if (!allowed(relativePath)) return;
  text = normalize(relativePath, text);
  const file = path.join(targetRoot, relativePath);
  if (check) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) throw new Error(`${relativePath} responsibilities are stale`);
  } else fs.writeFileSync(file, text);
}

for (const [relativePath, id] of [
  ['config/project.template.yaml', 'project-contract'],
  ['config/project.yaml', 'project-contract'],
  ['config/environments.template.yaml', 'environment-contract'],
  ['config/environments.yaml', 'environment-contract'],
  ['analysis/migration_status.template.yaml', 'status'],
  ['analysis/migration_status.yaml', 'status'],
]) {
  const file = path.join(targetRoot, relativePath);
  if (!fs.existsSync(file)) continue;
  const value = data.artifacts.find(artifact => artifact.id === id).responsibility.en;
  const block = ['# ARTIFACT RESPONSIBILITY START (guidance, not project state)',
    '# Created by: ' + value.creator,
    '# Maintained / decided by: ' + value.maintainer,
    '# Governing instructions: ' + value.instructions,
    '# ARTIFACT RESPONSIBILITY END',
  ].join('\n');
  const current = fs.readFileSync(file, 'utf8');
  const marker = /# ARTIFACT RESPONSIBILITY START[^\r\n]*[\s\S]*?# ARTIFACT RESPONSIBILITY END/;
  writeGenerated(relativePath, marker.test(current) ? current.replace(marker, block) : block + '\n' + current);
}

const responsibilityRows = data.artifacts.map((artifact) => {
  const value = artifact.responsibility.en;
  const label = artifact.outputPath && fs.existsSync(path.join(targetRoot, artifact.outputPath))
    ? `[\`${cell(artifact.label)}\`](../${artifact.outputPath})` : `\`${cell(artifact.label)}\``;
  return `| ${label} | ${cell(value.creator)} | ${cell(value.maintainer)} | ${cell(value.instructions)} |`;
});
writeGenerated('analysis/artifact-responsibilities.json', JSON.stringify({
  schema_version: 1,
  artifacts: data.artifacts.map(({ id, label, responsibility }) => ({ id, label, responsibility })),
  templates: starterFileGuides.map(([file, value]) => {
    const historical = historicalTemplateNames[file];
    const template = !isStarter && historical && fs.existsSync(path.join(targetRoot, historical)) ? historical : file;
    return { path: template, responsibility: value.responsibility };
  }).filter(item => fs.existsSync(path.join(targetRoot, item.path))),
}, null, 2) + '\n');
writeGenerated('analysis/artifact-responsibilities.md', [
  '# Artifact Creation and Maintenance',
  '',
  'For new/reopened work, [the portable role contract](agent-roles.md) resolves the stage agent to BA, UX, Architect, Developer or QA. PM coordinates assignments and shared-record integration; leads author their stage outputs. Historical producer metadata is not relabeled.',
  '',
  '**Who writes each artifact, who maintains it, and who makes the decisions recorded in it?**',
  '',
  'This reference describes process roles, not retrospective claims about the identity of an actual historical author. The author/producer metadata and evidence in each record establish who actually performed the work.',
  '',
  'The agent normally writes the record. A human owner makes the decisions explicitly assigned to the owner. A configured tool or initializer produces generated files and raw evidence; the responsible agent checks and records their outcomes. A tool run never supplies human approval.',
  '',
  'Every new artifact description must name its creator, maintainer or decision maker, and governing instruction. Templates supply these fields. JSON, Excel, Draw.io and other strict formats use the companion domain guide rather than invalid comments. Immutable reports and hash-pinned evidence keep their original bytes; these family descriptions also apply to them.',
  '',
  'Execution authority remains in [MIGRATION.md](../MIGRATION.md) and the [stage methodology](migration_methodology.md). The [artifact map](../ARTIFACTS.md) supplies purpose, examples and file locations.',
  '',
  '| Artifact family | Created by | Maintained / decided by | Governing instructions |',
  '|---|---|---|---|',
  ...responsibilityRows,
  '',
  '## Additional Records',
  '',
  '| Record family | Created by | Maintained / decided by | Governing instructions |',
  '|---|---|---|---|',
  '| Scoped waiver | Active-stage agent records the named human authority decision. | The authority grants, refuses or extends scope; the agent records evidence and expiry. | Exact waiver provision in MIGRATION.md and the active stage. |',
  '| Owner decision or clarification | Active-stage agent records the human owner explicit answer and its exact scope. | The owner makes a new decision; the agent appends or supersedes it according to the record contract. | Owner gate in the applicable stage. |',
  '| Raw audit, screenshot, browser trace or measurement | Configured tool emits raw output; the executing agent supplies the summary and provenance. | A rerun emits new evidence; the agent retains the original exact-run result. | Verification procedure of the stage that consumes the evidence. |',
  '| Source inventory, discovery ledger, contract or runtime finding | Reconnaissance or architecture agent records inspected code/configuration and observed facts. | The responsible source-stage agent reconciles new evidence; a human confirms claims that require external authority. | Stages 1, 3, 4 or 9 and the affected domain instructions. |',
  '| Self-review or execution record | Agent performing the work records its checks and limitations. | The producing agent updates the current work record; it does not become independent approval. | Active-stage procedure and independent reviewer rules. |',
  '| Cost or AI usage report | Usage collection process emits metrics; the reporting agent assembles the report. | Reporting agent or designated operator refreshes measurements with dated provenance. | The reporting domain README; no stage acceptance is implied. |',
  '| Template, schema, instructions or presentation | Process maintainer (human or authorized agent) authors the reusable definition; generators emit derived views. | Authorized process maintainer changes it and synchronizes consumers. | Process maintenance through MIGRATION.md and this responsibility contract. |',
  '',
].join('\n'));

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const ownershipRows = require('../tools/process-contract').tables(
  fs.readFileSync(path.join(targetRoot, 'analysis/process-contract.md'), 'utf8')
).get('Document Ownership');
if (!ownershipRows || ownershipRows.length !== 8) throw new Error('Document ownership must cover all seven instruction/state roles');
const ownership = ownershipRows.slice(1).map(([document, question, owns, excludes]) => ({
  document: document.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'), question, owns, excludes,
}));
const ownershipStart = '<!-- DOCUMENT_OWNERSHIP_START -->';
const ownershipEnd = '<!-- DOCUMENT_OWNERSHIP_END -->';
const ownershipNote = 'Reading order is not authority order: MIGRATION.md is read first; the ratified constitution has the highest project authority. Domain guides own exact artifact formats. migration_status.yaml records state, not instructions or inferred approval. Stop affected work when documents conflict.';
const ownershipHtml = `${ownershipStart}\n<div class="docroles" aria-label="Document ownership">\n${ownership.slice(0, 4).map(row => `<div class="docrole"><b>${escapeHtml(row.document)}</b><strong>${escapeHtml(row.question)}</strong><p>${escapeHtml(row.owns)}</p><p>Not: ${escapeHtml(row.excludes)}</p></div>`).join('\n')}\n<div class="docnote">${escapeHtml(ownershipNote)} <a href="${data.repository}/blob/main/analysis/process-contract.md#document-ownership">Document ownership and conflict rules</a>.</div>\n</div>\n${ownershipEnd}`;
const ownershipHtmlFile = 'analysis/migration_methodology.html';
let ownershipHtmlSource = fs.readFileSync(path.join(targetRoot, ownershipHtmlFile), 'utf8');
const ownershipMarker = /<!-- DOCUMENT_OWNERSHIP_START -->[\s\S]*?<!-- DOCUMENT_OWNERSHIP_END -->/;
const previousRoles = /<div class="docroles" aria-label="Difference between the migration entry point and methodology">[\s\S]*?\n  <\/div>/;
if (!ownershipMarker.test(ownershipHtmlSource) && !previousRoles.test(ownershipHtmlSource)) throw new Error('Missing document ownership presentation slot');
ownershipHtmlSource = ownershipHtmlSource.replace(ownershipMarker.test(ownershipHtmlSource) ? ownershipMarker : previousRoles, ownershipHtml);
writeGenerated(ownershipHtmlFile, ownershipHtmlSource);

const ownershipDiagramFile = 'analysis/migration_artifact_flow.drawio';
const ownershipDiagram = `${ownershipStart}\n<diagram id="document-ownership" name="Document ownership"><mxGraphModel page="1" pageWidth="1260" pageHeight="1500"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${ownership.map((row, i) => `<mxCell id="document-owner-${i}" parent="1" vertex="1" value="${escapeHtml(`<b>${row.document}: ${row.question}</b><br>${row.owns}<br>Not: ${row.excludes}`)}" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=16;fontSize=16;"><mxGeometry x="40" y="${40 + i * 180}" width="1180" height="150" as="geometry"/></mxCell>`).join('')}<mxCell id="document-ownership-note" parent="1" vertex="1" value="${escapeHtml(ownershipNote)}" style="text;whiteSpace=wrap;html=1;align=left;fontSize=16;"><mxGeometry x="40" y="1140" width="1180" height="180" as="geometry"/></mxCell></root></mxGraphModel></diagram>\n${ownershipEnd}`;
let ownershipXml = fs.readFileSync(path.join(targetRoot, ownershipDiagramFile), 'utf8');
ownershipXml = ownershipMarker.test(ownershipXml) ? ownershipXml.replace(ownershipMarker, ownershipDiagram) : ownershipXml.replace('</mxfile>', ownershipDiagram + '\n</mxfile>');
writeGenerated(ownershipDiagramFile, ownershipXml);
const htmlRows = data.artifacts.map((artifact) => {
  const value = artifact.responsibility.en;
  return `<tr><td>${escapeHtml(artifact.label)}</td><td>${escapeHtml(value.creator)}</td><td>${escapeHtml(value.maintainer)}</td><td>${escapeHtml(value.instructions)}</td></tr>`;
}).join('\n');
const htmlStart = '<!-- ARTIFACT_RESPONSIBILITIES_START -->';
const htmlEnd = '<!-- ARTIFACT_RESPONSIBILITIES_END -->';
const htmlStyles = '<style>#artifact-responsibilities{margin:32px auto;padding:0 22px;max-width:1500px;box-sizing:border-box;overflow-wrap:anywhere}#artifact-responsibilities summary{cursor:pointer;padding:12px 0;font-weight:600}#artifact-responsibilities table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:960px;font-size:13px;line-height:1.55}#artifact-responsibilities th,#artifact-responsibilities td{text-align:left;vertical-align:top;border:1px solid var(--line);padding:12px}#artifact-responsibilities th{background:var(--panel)}#artifact-responsibilities th:first-child{width:19%}#artifact-responsibilities th:last-child{width:19%}#artifact-responsibilities td:first-child{font-weight:600}</style>';
const htmlSection = `${htmlStart}\n${htmlStyles}\n<section id="artifact-responsibilities"><h2>Who creates each artifact?</h2><p>The agent writes records, the human owner makes assigned decisions, and configured tools emit generated files and raw evidence. Actual author metadata remains in the project record.</p><details><summary>Creation, maintenance and governing instructions for all ${data.artifacts.length} artifact families</summary><div style="overflow-x:auto"><table><thead><tr><th>Artifact</th><th>Created by</th><th>Maintained / decided by</th><th>Instructions</th></tr></thead><tbody>\n${htmlRows}\n</tbody></table></div></details></section>\n${htmlEnd}`;
const htmlFile = path.join(targetRoot, 'analysis/migration_methodology.html');
const htmlCurrent = fs.readFileSync(htmlFile, 'utf8');
const htmlMarker = /<!-- ARTIFACT_RESPONSIBILITIES_START -->[\s\S]*?<!-- ARTIFACT_RESPONSIBILITIES_END -->/;
const htmlNext = htmlMarker.test(htmlCurrent) ? htmlCurrent.replace(htmlMarker, htmlSection) : htmlCurrent.replace('</body>', `${htmlSection}\n</body>`);
writeGenerated('analysis/migration_methodology.html', htmlNext);
const diagramStart = '<!-- ARTIFACT_RESPONSIBILITIES_START -->';
const diagramEnd = '<!-- ARTIFACT_RESPONSIBILITIES_END -->';
const diagramCells = data.artifacts.map((artifact, index) => {
  const value = artifact.responsibility.en;
  const handoffPurpose = artifact.id === 'stage-15-record' ? `<b>${escapeHtml(artifact.headline)}</b><br>` : '<br>';
  const label = `<b>${escapeHtml(artifact.label)}</b><br>${handoffPurpose}<b>Created by:</b> ${escapeHtml(value.creator)}<br><b>Maintained / decided by:</b> ${escapeHtml(value.maintainer)}<br><b>Instructions:</b> ${escapeHtml(value.instructions)}`;
  return `<mxCell id="responsibility-${artifact.id}" parent="1" vertex="1" value="${escapeHtml(label)}" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=12;fontSize=14;fillColor=#f5f7fa;strokeColor=#cbd5df;"><mxGeometry x="40" y="${80 + index * 170}" width="1180" height="150" as="geometry"/></mxCell>`;
}).join('\n');
const diagramSection = `${diagramStart}\n<diagram id="artifact-responsibilities" name="Artifact responsibilities"><mxGraphModel grid="1" page="1" pageWidth="1260" pageHeight="${100 + data.artifacts.length * 170}"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="responsibility-heading" parent="1" vertex="1" value="Who creates and maintains each artifact?" style="text;html=1;fontSize=24;fontStyle=1;align=left;"><mxGeometry x="40" y="20" width="1180" height="40" as="geometry"/></mxCell>\n${diagramCells}\n</root></mxGraphModel></diagram>\n${diagramEnd}`;
const diagramFile = path.join(targetRoot, 'analysis/migration_artifact_flow.drawio');
const diagramCurrent = fs.readFileSync(diagramFile, 'utf8');
const diagramMarker = /<!-- ARTIFACT_RESPONSIBILITIES_START -->[\s\S]*?<!-- ARTIFACT_RESPONSIBILITIES_END -->/;
const diagramNext = diagramMarker.test(diagramCurrent) ? diagramCurrent.replace(diagramMarker, diagramSection) : diagramCurrent.replace('</mxfile>', `${diagramSection}\n</mxfile>`);
writeGenerated('analysis/migration_artifact_flow.drawio', diagramNext);
// Stage 12 already has its original, independently audited closure question.
// Keep the other stage questions identical to the 3D cards on every regeneration.
for (const format of ['md', 'html']) {
  const relativePath = `analysis/migration_methodology.${format}`;
  let content = fs.readFileSync(path.join(targetRoot, relativePath), 'utf8');
  for (const stage of data.stages.filter(item => item.headline && item.id !== 'stage-12')) {
    const marker = `STAGE_QUESTION_${stage.number}`;
    const block = format === 'md'
      ? `<!-- ${marker}_START -->\n**${stage.headline}**\n<!-- ${marker}_END -->`
      : `<!-- ${marker}_START -->\n        <p class="d"><b>${escapeHtml(stage.headline)}</b></p>\n        <!-- ${marker}_END -->`;
    const existing = new RegExp(`<!-- ${marker}_START -->[\\s\\S]*?<!-- ${marker}_END -->`);
    if (existing.test(content)) content = content.replace(existing, () => block);
    else {
      const heading = format === 'md'
        ? new RegExp(`^### Stage ${stage.number}[^\\r\\n]*`, 'm')
        : new RegExp(`<section[^>]*id="ph${stage.number}"[\\s\\S]*?<h3[^>]*>[\\s\\S]*?</h3>`);
      if (!heading.test(content)) throw new Error(`Missing ${stage.id} heading in ${relativePath}`);
      content = content.replace(heading, match => `${match}\n\n${block}`);
    }
  }
  writeGenerated(relativePath, content);
}

for (const format of ['md', 'html']) {
  const relativePath = 'analysis/migration_methodology.' + format;
  let content = fs.readFileSync(path.join(targetRoot, relativePath), 'utf8');
  const instruction = format === 'md' ? 'agent-roles.md'
    : data.repository + '/blob/main/analysis/agent-roles.md';
  for (const stage of data.stages) {
    const marker = 'AGENT_ROLE_' + stage.number;
    const body = format === 'md'
      ? '**Role and skill.** ' + stage.assignment.en + ' [Delegation contract](' + instruction + ').'
      : '<details class="stage-reentry"><summary><b>Role and skill: ' + escapeHtml(stage.actor) + '</b></summary><p class="d">' + escapeHtml(stage.assignment.en) + ' <a href="' + instruction + '">Delegation contract</a>.</p></details>';
    const block = '<!-- ' + marker + '_START -->\n' + body + '\n<!-- ' + marker + '_END -->';
    const pattern = new RegExp('<!-- ' + marker + '_START -->[\\s\\S]*?<!-- ' + marker + '_END -->');
    const heading = format === 'md'
      ? new RegExp(stage.id === 'stage-00' ? '^### Bootstrap Gate Report[^\\r\\n]*' : '^### Stage ' + stage.number + '[^\\r\\n]*', 'm')
      : new RegExp('<section[^>]*id="' + (stage.id === 'stage-00' ? 'ph-bootstrap' : 'ph' + stage.number) + '"[\\s\\S]*?<h3[^>]*>[\\s\\S]*?</h3>');
    if (pattern.test(content)) content = content.replace(pattern, () => block);
    else if (heading.test(content)) content = content.replace(heading, match => match + '\n\n' + block);
    else if (format === 'html' && stage.id === 'stage-00' && /<p[^>]*><b>Bootstrap gate report[\s\S]*?<\/p>/.test(content)) {
      content = content.replace(/<p[^>]*><b>Bootstrap gate report[\s\S]*?<\/p>/, match => match + '\n' + block);
    }
    else throw new Error('Missing role heading: ' + stage.id + ' in ' + relativePath);
  }
  writeGenerated(relativePath, content);
}

for (const format of ['md', 'html']) {
  const relativePath = 'analysis/migration_methodology.' + format;
  let content = fs.readFileSync(path.join(targetRoot, relativePath), 'utf8');
  const instruction = format === 'md' ? 'error-prevention.md'
    : data.repository + '/blob/main/analysis/error-prevention.md';
  for (const stage of data.stages) {
    const marker = 'ERROR_PREVENTION_' + stage.number;
    const body = format === 'md'
      ? '**Error prevention.** ' + stage.prevention.en + ' [Required procedure](' + instruction + ').'
      : '<details class="stage-reentry"><summary><b>Error prevention</b></summary><p class="d">' + escapeHtml(stage.prevention.en) + ' <a href="' + instruction + '">Required procedure</a>.</p></details>';
    const next = '<!-- ' + marker + '_START -->\n' + body + '\n<!-- ' + marker + '_END -->';
    const pattern = new RegExp('<!-- ' + marker + '_START -->[\\s\\S]*?<!-- ' + marker + '_END -->');
    const heading = format === 'md'
      ? new RegExp(stage.id === 'stage-00' ? '^### Bootstrap Gate Report[^\\r\\n]*' : '^### Stage ' + stage.number + '[^\\r\\n]*', 'm')
      : new RegExp('<section[^>]*id="' + (stage.id === 'stage-00' ? 'ph-bootstrap' : 'ph' + stage.number) + '"[\\s\\S]*?<h3[^>]*>[\\s\\S]*?</h3>');
    if (pattern.test(content)) content = content.replace(pattern, () => next);
    else if (heading.test(content)) content = content.replace(heading, match => match + '\n\n' + next);
    else if (format === 'html' && stage.id === 'stage-00' && /<p[^>]*><b>Bootstrap gate report[\s\S]*?<\/p>/.test(content)) {
      content = content.replace(/<p[^>]*><b>Bootstrap gate report[\s\S]*?<\/p>/, match => match + '\n' + next);
    }
    else throw new Error('Missing prevention heading: ' + stage.id + ' in ' + relativePath);
  }
  writeGenerated(relativePath, content);
}

const cosmeticStages = data.stages.filter(stage => Number(stage.number) >= 15 && stage.inputs.includes('polish-backlog'));
// Conditional return evidence is shown in details, never as a first-entry graph input.
for (const format of ['md', 'html']) {
  const relativePath = `analysis/migration_methodology.${format}`;
  let content = fs.readFileSync(path.join(targetRoot, relativePath), 'utf8');
  for (const stage of data.stages.filter(item => item.reentry)) {
    const entry = stage.reentry.en;
    const marker = `STAGE_REENTRY_${stage.number}`;
    const instruction = format === 'md'
      ? stage.reentry.instructionPath.replace(/^analysis\//, '')
      : `${data.repository}/blob/main/${stage.reentry.instructionPath}`;
    const exampleRevision = data.exampleRevisions?.[stage.reentry.examplePath] || data.exampleRevision;
    const exampleUrl = `${data.exampleRepository}/blob/${exampleRevision}/${stage.reentry.examplePath}`;
    const sources = stage.reentry.sources.map(source => {
      const artifact = data.artifacts.find(item => item.id === source.artifactId);
      const url = `${data.repository}/blob/main/${artifact.sourcePath}`;
      const label = artifact.outputPath.replace(/^analysis\//, '');
      return format === 'md'
        ? `- [${label}](${url}): ${source.en}`
        : `<li><a href="${url}">${escapeHtml(label)}</a>: ${escapeHtml(source.en)}</li>`;
    }).join(format === 'md' ? '\n' : '');
    const body = format === 'md'
      ? `**${entry.title}.** ${entry.input}\n\n${sources}\n\n${entry.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n[Return instructions](${instruction}) · [Real XPlanner correction record](${exampleUrl})`
      : `<details class="stage-reentry"><summary><b>${escapeHtml(entry.title)}</b></summary><p class="d">${escapeHtml(entry.input)}</p><ul class="d reentry-sources">${sources}</ul><ol class="d">${entry.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol><p class="d"><a href="${instruction}">Return instructions</a> · <a href="${exampleUrl}">Real XPlanner correction record</a></p></details>`;
    const block = `<!-- ${marker}_START -->\n${body}\n<!-- ${marker}_END -->`;
    const existing = new RegExp(`<!-- ${marker}_START -->[\\s\\S]*?<!-- ${marker}_END -->`);
    const anchor = `<!-- STAGE_QUESTION_${stage.number}_END -->`;
    if (existing.test(content)) content = content.replace(existing, () => block);
    else if (content.includes(anchor)) content = content.replace(anchor, () => `${anchor}\n\n${block}`);
    else throw new Error(`Missing re-entry anchor in ${relativePath}: ${stage.id}`);
  }
  writeGenerated(relativePath, content);
}
for (const format of ['md', 'html']) {
  const relativePath = `analysis/migration_methodology.${format}`;
  let content = fs.readFileSync(path.join(targetRoot, relativePath), 'utf8');
  for (const stage of cosmeticStages) {
    const role = stage.outputs.includes('polish-backlog') ? 'Updated artifact (U)' : 'Input artifact (I)';
    const marker = `COSMETIC_FLOW_${stage.number}`;
    const label = `Conditional ${role}: ui-polish-backlog.md`;
    const block = format === 'md'
      ? `<!-- ${marker}_START -->\n**${label}.** ${stage.evidence}\n<!-- ${marker}_END -->`
      : `<!-- ${marker}_START -->\n        <p class="d"><b>${escapeHtml(label)}.</b> ${escapeHtml(stage.evidence)}</p>\n        <!-- ${marker}_END -->`;
    const existing = new RegExp(`<!-- ${marker}_START -->[\\s\\S]*?<!-- ${marker}_END -->`);
    const anchor = `<!-- STAGE_QUESTION_${stage.number}_END -->`;
    if (existing.test(content)) content = content.replace(existing, () => block);
    else if (content.includes(anchor)) content = content.replace(anchor, () => `${anchor}\n\n${block}`);
    else throw new Error(`Missing cosmetic flow anchor in ${relativePath}: ${stage.id}`);
  }
  writeGenerated(relativePath, content);
}
const cosmeticDiagramStages = data.stages.filter(stage => ['stage-07', 'stage-08', ...cosmeticStages.map(item => item.id)].includes(stage.id));
const cosmeticCells = cosmeticDiagramStages.map((stage, index) => {
  const role = stage.outputs.includes('polish-backlog') ? (stage.inputs.includes('polish-backlog') ? 'U' : 'O') : 'I';
  const label = `<b>Stage ${stage.number}: ${escapeHtml(stage.title)} | ${role} (conditional)</b><br><br>${escapeHtml(stage.evidence || stage.summary)}`;
  const box = `<mxCell id="cosmetic-${stage.id}" parent="1" vertex="1" value="${escapeHtml(label)}" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=16;fontSize=16;fillColor=#f5f7fa;strokeColor=#cbd5df;"><mxGeometry x="40" y="${100 + index * 240}" width="1000" height="200" as="geometry"/></mxCell>`;
  const edge = index ? `<mxCell id="cosmetic-edge-${index}" parent="1" edge="1" source="cosmetic-${cosmeticDiagramStages[index - 1].id}" target="cosmetic-${stage.id}" style="edgeStyle=orthogonalEdgeStyle;endArrow=block;strokeColor=#64748b;"><mxGeometry relative="1" as="geometry"/></mxCell>` : '';
  return box + edge;
}).join('\n');
const cosmeticDiagram = `<!-- COSMETIC_FLOW_START -->\n<diagram id="cosmetic-backlog-flow" name="Cosmetic backlog lifecycle"><mxGraphModel grid="1" page="1" pageWidth="1080" pageHeight="2060"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="cosmetic-heading" parent="1" vertex="1" value="ui-polish-backlog.md: one conditional file, tracked through release" style="text;html=1;fontSize=22;fontStyle=1;align=left;"><mxGeometry x="40" y="20" width="1000" height="60" as="geometry"/></mxCell>\n${cosmeticCells}\n</root></mxGraphModel></diagram>\n<!-- COSMETIC_FLOW_END -->`;
const currentDiagram = fs.readFileSync(diagramFile, 'utf8');
const cosmeticMarker = /<!-- COSMETIC_FLOW_START -->[\s\S]*?<!-- COSMETIC_FLOW_END -->/;
writeGenerated('analysis/migration_artifact_flow.drawio', cosmeticMarker.test(currentDiagram)
  ? currentDiagram.replace(cosmeticMarker, () => cosmeticDiagram)
  : currentDiagram.replace('</mxfile>', () => `${cosmeticDiagram}\n</mxfile>`));
const recordProfiles = JSON.parse(fs.readFileSync(path.join(starterRoot, 'analysis/record-contracts.json'), 'utf8'));
for (const format of ['md', 'html']) {
  const relativePath = 'analysis/migration_methodology.' + format;
  let content = fs.readFileSync(path.join(targetRoot, relativePath), 'utf8');
  for (const stage of data.stages.filter(item => item.id !== 'stage-00')) {
    const profiles = Object.values(recordProfiles).filter(profile => profile.stages.includes(stage.number));
    const primaryProfiles = stage.independent
      ? profiles.filter(profile => profile.artifacts.some(id => stage.outputs.includes(id)))
      : profiles;
    const outputIds = { 4: 'stage-04-revision', 13: 'stage-13-record', 15: 'stage-15-record', 18: 'delivery-record' };
    const artifact = data.artifacts.find(item => item.id === outputIds[stage.number]);
    if (!primaryProfiles.length && !artifact && stage.number !== 17) continue;
    const marker = 'RECORD_BOUNDARY_' + stage.number;
    const body = primaryProfiles.map(profile => format === 'md'
      ? '**' + profile.en.title + '**\n\n' + profile.en.fields.map(field => '- ' + field).join('\n') + '\n\n' + profile.en.note
      : '<div class="record-boundary"><p class="d"><b>' + escapeHtml(profile.en.title) + '</b></p><ul class="stage-list">' + profile.en.fields.map(field => '<li>' + escapeHtml(field) + '</li>').join('') + '</ul><p class="d">' + escapeHtml(profile.en.note) + '</p></div>').join('\n\n');
    const outputLocation = artifact && fs.existsSync(path.join(targetRoot, artifact.outputPath))
      ? '[\x60' + artifact.outputPath + '\x60](../' + artifact.outputPath + ')' : '\x60' + artifact?.outputPath + '\x60';
    const output = artifact ? (format === 'md'
      ? '\n\n**Execution record:** ' + outputLocation + '. ' + starterReference(artifact.sourcePath, '../') + '. The active-stage agent records actual work; this is not independent approval.'
      : '<p class="d"><b>Execution record:</b> <code>' + escapeHtml(artifact.outputPath) + '</code>. The active-stage agent records actual work; this is not independent approval.</p>') : '';
    const handoff = stage.number === 15 ? (format === 'md'
      ? '\n\n**' + artifact.headline + '**\n\n' + artifact.desc + '\n\nThe Stage 15 agent uses the named template even for an incomplete package. An implementation self-review is not a substitute. A retrospective record names its reconstruction date, source revision and missing evidence; it never backdates approval.'
      : '<p class="d"><b>' + escapeHtml(artifact.headline) + '</b></p><p class="d">' + escapeHtml(artifact.desc) + '</p><p class="d">The Stage 15 agent uses the named template even for an incomplete package. An implementation self-review is not a substitute. A retrospective record names its reconstruction date, source revision and missing evidence; it never backdates approval.</p>') : '';
    const inventory = data.artifacts.find(item => item.id === 'target-inventory');
    const inventoryGuide = stage.number === 15 ? '\n<!-- TARGET_INVENTORY_READING_START -->\n' + (format === 'md'
      ? '\n**' + inventory.headline + '**\n\n' + inventory.desc + '\n\n' + inventory.usage + '\n\nStart with `surfaces`, then read each destination, role and useful action before the technical adapter configuration. [Field guide and worked example](inventories/README.md).\n'
      : '<p class="d"><b>' + escapeHtml(inventory.headline) + '</b></p><p class="d">' + escapeHtml(inventory.desc) + '</p><p class="d">' + escapeHtml(inventory.usage) + '</p><p class="d">Start with <code>surfaces</code>, then read each destination, role and useful action before the technical adapter configuration. <a href="' + data.repository + '/blob/main/analysis/inventories/README.md">Field guide and worked example</a>.</p>') + '\n<!-- TARGET_INVENTORY_READING_END -->' : '';
    const traceability = data.artifacts.find(item => item.id === 'traceability');
    const traceDuty = {
      15: 'The design agent adds one Slice Verification Index row with SDD links and planned checks; no execution is claimed. Requirement-to-check details stay in the slice.',
      16: 'The independent reviewer checks index links and behavior-to-requirement-to-planned-check coverage in both directions. Missing coverage returns to Stage 15; testability is not a passed test.',
      17: 'The implementation agent links actual tests and execution records with checked revision, environment, expected/observed outcomes and gaps. The independent reviewer checks their meaning; a plan cannot be execution evidence.',
      18: 'The delivery agent links exact deployed-revision, smoke and public-journey records. Missing required evidence blocks closure; local candidate results do not prove deployed behavior.',
      19: 'After the blind inspection, the independent acceptance reviewer reconciles index, behavior and actual results. Required unverified scope prevents clean acceptance; an owner waiver is not a passed test.',
    }[stage.number];
    const traceGuide = stage.number === 15 ? '\n<!-- TRACEABILITY_READING_START -->\n' + (format === 'md'
      ? '\n**' + traceability.headline + '**\n\n' + traceability.desc + '\n\nRead one feature in Parity Map Delivery Contracts, then its prototype and requirement mappings, then follow the actual evidence. Intended delivery rows are not proof of completion. [Reading route and template](../specs/traceability.template.md).\n'
      : '<p class="d"><b>' + escapeHtml(traceability.headline) + '</b></p><p class="d">' + escapeHtml(traceability.desc) + '</p><p class="d">Read one feature in Parity Map Delivery Contracts, then its prototype and requirement mappings, then follow the actual evidence. Intended delivery rows are not proof of completion. <a href="' + data.repository + '/blob/main/specs/traceability.template.md">Reading route and template</a>.</p>') + '\n<!-- TRACEABILITY_READING_END -->' : '';
    const traceContract = traceDuty ? '\n<!-- TRACEABILITY_DUTY_' + stage.number + '_START -->\n' + (format === 'md'
      ? '\n**Traceability and verification:** ' + traceDuty + ' The index separates planned, missing and recorded evidence; recorded does not mean passed. [Required contract](../specs/traceability-guide.md).\n'
      : '<p class="d"><b>Traceability and verification:</b> ' + escapeHtml(traceDuty) + ' The index separates planned, missing and recorded evidence; recorded does not mean passed. <a href="' + data.repository + '/blob/main/specs/traceability-guide.md">Required contract</a>.</p>') + '\n<!-- TRACEABILITY_DUTY_' + stage.number + '_END -->' : '';
    const liveRevisionQuestion = stage.number === 18 ? '\n<!-- LIVE_RECONCILIATION_START -->\n' + (format === 'md'
      ? '\n**' + artifact.headline + '**\n\n' + artifact.desc + '\n\n' + artifact.usage + '\n\n**Example:** ' + artifact.example + '\n'
      : '<p class="d"><b>' + escapeHtml(artifact.headline) + '</b></p><p class="d">' + escapeHtml(artifact.desc) + '</p><p class="d">' + escapeHtml(artifact.usage) + '</p><p class="d"><b>Example:</b> ' + escapeHtml(artifact.example) + '</p>') + '\n<!-- LIVE_RECONCILIATION_END -->' : '';
    const recoveryText = 'Rollback Readiness is a required section of the delivery record, not a separate artifact. The Stage 18 agent records the exact release/environment, recovery strategy and target, prerequisites and data compatibility, actual check, producer/time, expected and observed outcome, result, limitations and evidence. Inline recorded output needs no extra file; an optional local attachment has a SHA-256 digest. The audit validates fields, bindings, passed result and evidence presence/digest; an agent verifies evidence meaning and scope. It never executes rollback. Distinguish a controlled recovery rehearsal from a readiness-only check and never claim one proves the other. Missing, failed, blocked or not-run checks prevent new closure; preserve old reports and create new evidence instead of backdating verification.';
    const recoveryGuide = stage.number === 18 ? '\n<!-- ROLLBACK_READINESS_START -->\n' + (format === 'md'
      ? '\n**Can this exact release be recovered safely, what was checked, and what remains unproven?**\n\n' + recoveryText + '\n\n[Required section and field meanings](stages/templates/' + (fs.existsSync(path.join(targetRoot, 'analysis/stages/templates/delivery-NNN-template.md')) ? 'delivery-NNN-template.md' : 'stage-18-delivery-record-template.md') + '). [Historical Foundation rehearsal](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-18/foundation-delivery.md#operational-rehearsal) proves only that older release.\n'
      : '<p class="d"><b>Can this exact release be recovered safely, what was checked, and what remains unproven?</b></p><p class="d">' + recoveryText + '</p><p class="d"><a href="' + data.repository + '/blob/main/analysis/stages/templates/delivery-NNN-template.md">Required section and field meanings</a>. <a href="https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-18/foundation-delivery.md#operational-rehearsal">Historical Foundation rehearsal</a> proves only that older release.</p>') + '\n<!-- ROLLBACK_READINESS_END -->' : '';
    const block = '<!-- ' + marker + '_START -->\n' + body + output + liveRevisionQuestion + handoff + inventoryGuide + traceGuide + traceContract + recoveryGuide + '\n<!-- ' + marker + '_END -->';
    const existing = new RegExp('<!-- ' + marker + '_START -->[\\s\\S]*?<!-- ' + marker + '_END -->');
    const question = stage.number === 12
      ? (format === 'md'
        ? /\*\*Are all owner remarks from Stage 11[\s\S]*?\?\*\*/
        : /<p class="d"><b>Are all owner remarks from Stage 11[\s\S]*?<\/b><\/p>/)
      : new RegExp('<!-- STAGE_QUESTION_' + stage.number + '_END -->');
    if (!question.test(content)) throw new Error('Missing record-boundary question: ' + stage.id);
    if (existing.test(content) && content.search(existing) > content.search(question)) {
      content = content.replace(existing, () => block);
    } else {
      content = content.replace(new RegExp('\\s*' + existing.source + '\\s*'), '\n\n');
      content = content.replace(question, match => match + '\n\n' + block);
    }
  }
  writeGenerated(relativePath, content);
}
let recordY = 80;
const recordCells = Object.entries(recordProfiles).map(([id, profile]) => {
  const label = '<b>' + escapeHtml(profile.en.title) + '</b><br><br>' + profile.en.fields.map(escapeHtml).join('<br>') + '<br><br>' + escapeHtml(profile.en.note);
  const height = id === 'reconnaissance' ? 540 : 270;
  const y = recordY;
  recordY += height + 30;
  return '<mxCell id="record-contract-' + id + '" parent="1" vertex="1" value="' + escapeHtml(label) + '" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=16;fontSize=16;fillColor=#f5f7fa;strokeColor=#cbd5df;"><mxGeometry x="40" y="' + y + '" width="1120" height="' + height + '" as="geometry"/></mxCell>';
}).join('\n');
const recordPageHeight = Math.max(2000, recordY + 40);
const recordDiagram = '<!-- RECORD_CONTRACTS_START -->\n<diagram id="record-contracts" name="Record results and boundaries"><mxGraphModel grid="1" page="1" pageWidth="1200" pageHeight="' + recordPageHeight + '"><root><mxCell id="0"/><mxCell id="1" parent="0"/>' + recordCells + '</root></mxGraphModel></diagram>\n<!-- RECORD_CONTRACTS_END -->';
const recordDiagramSource = fs.readFileSync(diagramFile, 'utf8');
const recordDiagramMarker = /<!-- RECORD_CONTRACTS_START -->[\s\S]*?<!-- RECORD_CONTRACTS_END -->/;
writeGenerated('analysis/migration_artifact_flow.drawio', recordDiagramMarker.test(recordDiagramSource)
  ? recordDiagramSource.replace(recordDiagramMarker, () => recordDiagram)
  : recordDiagramSource.replace('</mxfile>', () => recordDiagram + '\n</mxfile>'));
const flowRows = data.stages.map(stage => {
  const names = ids => ids.map(id => data.artifacts.find(a => a.id === id).label).join('; ') || 'None';
  const later = new Set(stage.delayedInputs || []);
  if (stage.reviewAccess) return { stage,
    input: 'full-blind: neutral source/scope first. correction-validation: ' + names(stage.inputs.filter(id => id !== 'status')) + '; full status, prior reports/checklist/dispositions immediately (reviewer read-only)',
    updated: 'migration_status.yaml: PM only, never the reviewer',
    output: names(stage.outputs.filter(id => !stage.inputs.includes(id))),
    delayed: 'full-blind only: ' + names([...later]) + '; prior reports/checklist/dispositions after saved complete Phase A. correction-validation: no delayed inputs or new Phase A' };
  return { stage, input: names(stage.inputs.filter(id => !stage.outputs.includes(id) && !later.has(id))),
    updated: names(stage.inputs.filter(id => stage.outputs.includes(id) && !later.has(id))),
    output: names(stage.outputs.filter(id => !stage.inputs.includes(id))),
    delayed: [...later].map(id => names([id]) + (stage.outputs.includes(id) ? ' (U)' : ' (I)')).join('; ') || 'None' };
});
const flowIntro = 'I = read; U = read and update; O = create. PM alone updates shared status. Conditional inputs require their stage trigger. Stage 2 full-blind and Stage 19 withhold full records, prior reports, learned checks and self-check notes until saved Phase A; eligible Stage 2 correction-validation reads them immediately, with no new Phase A. Stage 19 uses expectation-only extracts first. Apply learned checks before work and handoff at the permitted time; CHK is not a scope ceiling. The coordinator maintains the checklist. Manifests do not replace their linked sources. Frames mean responsibility, not success: solid = independent/peer review; dashed = responsible verification.';
const cheatNames = ids => ids.filter(id => id !== 'status').map(id => {
  const artifact = data.artifacts.find(a => a.id === id);
  const conditional = ['owner-waiver', 'polish-backlog', 'owner-walkthrough', 'owner-walkthrough-decline'].includes(id);
  const label = '`' + artifact.label + '`';
  const target = artifact.outputPath && fs.existsSync(path.join(targetRoot, artifact.outputPath))
    ? path.relative('analysis', artifact.outputPath).split(path.sep).join('/') : null;
  return (target ? `[${label}](${target})` : label) + (conditional ? ' (conditional)' : '');
}).join('; ') || 'None.';
const cheatNotes = {
  'stage-00': 'The initializer creates empty files; the Bootstrap agent fills verified setup data. The owner ratifies the constitution and separately authorizes Stage 1.\n\n`environments.yaml` starts unconfigured, from the safe template: no copied keys\nor demo server. This can pass Bootstrap, but remote work requires owner-approved\nsettings and `audit:environment -- --require-configured`. Initialization leaves\nthe source starter read-only and never renews credential approval.\n\nThe status version must match the project constitution even before ratification.\nRecord failed checks and report links in `blockers[].evidence` immediately.\nSummary counts come from actual evidence rows. Existing files need scoped\ncorrection authority; upgrading a project is not reinitialization. Follow\n[Bootstrap maintenance](../MIGRATION.md#bootstrap-maintenance).',
  'stage-01': 'Read the immutable legacy source named by project.yaml. On first entry, populate the Bootstrap blanks. On return, preserve valid evidence and correct findings, affected dependencies and related mechanisms within the recorded impact boundary. PM proposes the next Stage 2 mode before reviewer access; the reviewer confirms the boundary and verifies baseline eligibility from permitted records: full-blind by default; correction-validation only after a complete valid full-blind baseline and bounded corrections. [Stage 2 modes](reviews/README.md#stage-2-correction-validation).',
  'stage-02': 'Default/new scope: full-blind, with complete neutral Phase A saved before two-way Phase B. Eligible bounded correction-validation is not blind: a fresh independent read-only BA (not author or reused reviewer) reads prior reports/checklist/dispositions immediately, with no new Phase A. A complete valid full-blind baseline may contain findings. Pin root full report, snapshot/source hashes, predecessor, latest candidate and all intervening reports/changes. Verify the entire diff, all open findings, related mechanisms/dependencies and affected old matched claims; retain exact C IDs only with applicability rationale, without double counting. Clean requires the whole coverage union and no unchecked scope or open findings, including Low. Bounded impact checks may expand; CHK is not a ceiling. Changed source/channels/scope, contamination, unreliable/missing/incomplete baseline or systemic/unbounded impact stop closure as blocked/invalid and require a full new blind session before prior information. Use the existing report and coverage table, not a new canonical artifact. [Required mode rules](reviews/README.md#stage-2-correction-validation).',
  'stage-03': 'PM requests owner-approved environment access, role accounts and permitted data/actions, then deploys or verifies the exact legacy baseline. BA records the actual operator handoff and compares live behavior with the map. Missing access blocks; fallback requires the owner. Follow [the deployment handoff](../config/REMOTE_SERVER.md#configure-before-remote-work).',
  'stage-07': 'Only owner-authorized Low-cosmetic debt may remain in a closing findings pass. This exception is not clean; fixes must be verified before affected production release or acceptance.',
  'stage-12': 'Create a new immutable closure report; never update the owner verdict. Corrections belong to the classified return stage. The negative report is mandatory on re-entry at 9-11. With no remarks, record the unchanged set and zero required fixes.',
  'stage-15': 'Read the approved sources linked by manifests. Bind the canonical dependency graph, inspect providers/consumers and declare its exact node digest and map applicable cosmetic findings to tasks; architecture/NFR manifest stays read-only.',
  'stage-17': 'Update task execution checkboxes and evidence as work is performed. A design change returns upstream; an owner-approved merge is not deployed proof.',
  'stage-18': 'PM rechecks current access and exact release/data authorization, then runs the reviewed configured deploy command. Developer owns verification/reconciliation and records the actual operator evidence. Legacy permission is not permission for new releases. Follow [the deployment handoff](../config/REMOTE_SERVER.md#configure-before-remote-work). Read-only candidate and target inventory. Include Rollback Readiness and Live Reconciliation in the delivery report. Update only governed records/checklist and bounded traceability evidence; fixes require an upstream return and a newly reviewed candidate.',
  'stage-19': 'Phase A: deployed URL/revision, neutral routing and expectation-only extracts of map, inventory and prototype. Save observations before Phase B opens originals and checks extract completeness. Accept the slice plus all mandatory transitive dependencies; final completion separately covers the whole agreed scope.',
};
const cheatBody = data.phases.map(phase => {
  const stages = data.stages.filter(stage => stage.phase === phase.id);
  return `<a id="cheat-${phase.id}"></a>\n\n## ${phase.label}\n\n` + stages.map(stage => {
    const delayed = stage.delayedInputs || [];
    const reads = stage.inputs.filter(id => !delayed.includes(id));
    const updates = stage.inputs.filter(id => stage.outputs.includes(id));
    const writes = stage.outputs.filter(id => !stage.inputs.includes(id));
    return [
      `### [${stage.number} - ${stage.title}](migration_methodology.md#${stage.id})`,
      `\n**${stage.headline || stage.summary}** *${stage.actor}.*\n`,
      `- **Role and skill:** ${stage.assignment.en} [Delegation contract](agent-roles.md).`,
      ...(stage.reviewAccess ? [
        `- **full-blind: Phase B only:** ${cheatNames(delayed)} Full status, earlier reports, checklist and dispositions follow saved complete neutral Phase A.`,
        `- **correction-validation: reads immediately:** ${cheatNames(stage.inputs)} Full status and the pinned prior evidence chain; no new Phase A.`,
      ] : [`- **Reads:** ${cheatNames(reads)}`,
        ...(delayed.some(id => id !== 'status') ? [`- **Phase B only:** ${cheatNames(delayed)}`] : [])]),
      `- **Writes result:** ${cheatNames(writes)}`,
      `- **Updates shared:** ${cheatNames(updates)}`,
      `- **Error prevention:** ${stage.prevention.en} [Checklist procedure](error-prevention.md).`,
      ...(cheatNotes[stage.id] ? [`\n${cheatNotes[stage.id]}`] : []),
    ].join('\n');
  }).join('\n\n');
}).join('\n\n');
const cheatStatusLink = fs.existsSync(path.join(targetRoot, 'analysis/migration_status.yaml'))
  ? '[`analysis/migration_status.yaml`](migration_status.yaml)' : '`analysis/migration_status.yaml`';
const cheatSheet = [
  '# Process Cheat Sheet',
  '## How Does The Agent Know What To Do?',
  `**Short answer: start with [MIGRATION.md](../MIGRATION.md), identify the current step from ${cheatStatusLink}, then follow [analysis/migration_methodology.md](migration_methodology.md) to execute that step.**`,
  '- **MIGRATION.md is the main process entry point:** mandatory reading, permitted actions and routing to the active-stage procedure. AGENTS.md directs the agent there.\n- **analysis/migration_status.yaml is the checkpoint:** current stage, recorded outcomes, blockers and decisions; it is state, not an instruction.\n- **analysis/migration_methodology.md is the execution manual:** inputs, actions, result templates, checks and conditions for transition or return.',
  '- **The constitution answers which rules cannot be bypassed and who may decide:** project invariants, authority, ratification and amendments. Principles do not depend on stage numbers or filenames. References and historical decision fields are process bindings, not a second stage manual.\n- **The process contract defines shared roles and boundaries:** artifact access, returns and minimum closing evidence. Its [implementation map](process-contract.md#constitution-implementation-map) binds principles to the actual stages; domain guides explain exact artifact formats. [Document ownership](process-contract.md#document-ownership).',
  'Reading first is not higher authority: the ratified constitution governs the entry point too. The agent does not choose or authorize the next stage on its own. For blind independent review, the coordinator first supplies only the permitted Phase A packet.',
  '**What happens at each step, what does the agent read, and which artifacts change?**',
  'A quick reading aid, not a new gate or project verdict. The process-maintenance agent regenerates it from the same flow used by the 3D view. [Full procedure](migration_methodology.md) | [File paths and descriptions](../ARTIFACTS.md) | [Governing contract](process-contract.md).',
  '## Shared Rules',
  '- **Portable team:** PM delegates each specialist task with the exact skill path. The receiver reads it, returns ACK, routes questions through PM and returns RESULT with evidence. BA, UX, Architect, Developer and QA are specializations, not permanent sessions. Fresh review is separate from authorship. [Required handoff protocol](agent-roles.md).',
  '- **Reads** = inputs, not permission to change them. **Writes result** = create or populate the stage-owned result; on return, revise mutable results but create a new numbered immutable review/delivery report. **Updates shared** = read and update an existing shared artifact, only within the stage\'s authority.',
  '- **Shared status:** Bootstrap creates `migration_status.yaml`; PM reads it and records durable outcomes, blockers and authorized transitions. It is omitted from the lists below. Stage 2 full-blind and Stage 19 reviewers receive neutral routing first, full status only in Phase B. Eligible Stage 2 correction-validation reads it immediately; reviewers never edit status.',
  '- **Always:** follow MIGRATION.md and the constitution; use configured project commands and approved environment settings. Short artifact names below match 3D labels; the artifact catalog gives exact paths. Linked approved sources are part of the input, not optional background.',
  '- **Conditional** means required when its trigger applies, not freely optional. The agent records human decisions; it never supplies owner approval. Walkthrough and explicit decline are alternatives, not two mandatory outputs.',
  '- **On return:** correct findings, affected dependencies and all occurrences of the same mechanism; preserve valid work, not restart the stage. Widen only with recorded evidence and authority. [Correction scope](reviews/README.md#correction-scope-and-handoff).',
  '- **Correction handoff:** record the boundary, retained work, actual checks/results and separate next control in the existing record. PM validates before accepting RESULT or requesting control. [Required handoff](reviews/README.md#correction-scope-and-handoff).',
  '- **Control scope stays separate:** Stage 2 defaults to full-blind; bounded correction-validation requires a complete valid full-blind baseline and a fresh eligible BA. It is not blind and must prove whole-scope coverage. Stage 19 remains blind; other controls, repository-wide gates and owner decisions are unchanged. [Stage 2 mode boundary](reviews/README.md#stage-2-correction-validation).',
  '- **PR boundaries:** publish each completed control attempt separately from its later corrections. Required CI and owner merge precede the correction PR and the next planning control; a merged negative report is not acceptance. Preserve in-flight work. Stage 17 code peer review remains before merge. [Review And Correction PRs](migration_methodology.md#review-and-correction-prs).',
  '- **Readable PRs:** PM keeps one current description: purpose, changes, verification, open items, owner action/next and evidence. Update after pushes and read back before handoff; separate current-head CI from local and independent checks. Comments record meaningful events, commits preserve why/what and evidence paths. [Communication contract](migration_methodology.md#pr-descriptions-comments-and-commits).',
  '- **Learned checks:** one ' + cheatNames(['error-prevention']) + ', not another findings backlog or a scope ceiling. Read applicable rows before work; self-check before handoff and after fixes. Generalize confirmed repeatable mistakes, deduplicate by meaning, and record results in the existing record or `control.prevention_self_check`. Reviewers propose; the coordinator maintains; the owner may prune. Stage 2 full-blind and Stage 19 open learned checks in Phase B; eligible Stage 2 correction-validation reads them immediately. [Admission and timing](error-prevention.md).',
  '## Contents',
  data.phases.map(phase => `- [${phase.label}](#cheat-${phase.id})`).join('\n'),
  cheatBody,
  '## Before Moving On',
  'Check the stage\'s [closing conditions](process-contract.md#closing-evidence): exact evidence, no required unchecked scope, the required independent review and explicit owner decision where applicable. Slice acceptance is not whole-project completion.',
].join('\n\n') + '\n';
writeGenerated('analysis/process-cheatsheet.md', cheatSheet);
const flowMarkdown = '\n## Stage Artifact Roles\n\n' + flowIntro + '\n\n| Stage | I | U | O | Phase B only |\n|---|---|---|---|---|\n' + flowRows.map(r => `| ${r.stage.number}: ${r.stage.title} | ${cell(r.input)} | ${cell(r.updated)} | ${cell(r.output)} | ${cell(r.delayed)} |`).join('\n');
function flowBlock(file, content, insert) {
  const text = fs.readFileSync(path.join(targetRoot, file), 'utf8');
  const pattern = /<!-- STAGE_ARTIFACT_ROLES_START -->[\s\S]*?<!-- STAGE_ARTIFACT_ROLES_END -->/;
  const block = '<!-- STAGE_ARTIFACT_ROLES_START -->\n' + content + '\n<!-- STAGE_ARTIFACT_ROLES_END -->';
  writeGenerated(file, pattern.test(text) ? text.replace(pattern, () => block) : insert(text, block));
}
flowBlock('analysis/artifact-relationship-graph.md', flowMarkdown, (s, b) => s.trimEnd() + '\n\n' + b + '\n');
const flowHtml = '<section class="ause"><details><summary><b>Stage artifact roles and review frames</b></summary><p>' + escapeHtml(flowIntro) + '</p><table><tr><th>Stage</th><th>I</th><th>U</th><th>O</th><th>Phase B only</th></tr>' + flowRows.map(r => '<tr><td>' + escapeHtml(r.stage.number + ': ' + r.stage.title) + '</td>' + [r.input,r.updated,r.output,r.delayed].map(v => '<td>' + escapeHtml(v) + '</td>').join('') + '</tr>').join('') + '</table></details></section>';
flowBlock('analysis/migration_methodology.html', flowHtml, (s, b) => s.replace('</body>', b + '\n</body>'));
let framedHtml = fs.readFileSync(path.join(targetRoot, 'analysis/migration_methodology.html'), 'utf8');
for (const { stage } of flowRows) {
  const role = stage.checkRole === 'primary' ? 'frame-check' : ['independent', 'peer'].includes(stage.checkRole) ? 'frame-review' : '';
  if (!role || stage.number === 'B') continue;
  const pattern = new RegExp('(<section class="phase" id="ph' + stage.number + '">[\\s\\S]*?<div class=")node(?: frame-(?:check|review))?("[^>]*>)');
  framedHtml = framedHtml.replace(pattern, '$1node ' + role + '$2');
}
writeGenerated('analysis/migration_methodology.html', framedHtml);
const flowCells = flowRows.map((r,i) => {
  const style = r.stage.checkRole === 'primary' ? 'strokeColor=#2199b5;dashed=1;' : ['independent','peer'].includes(r.stage.checkRole) ? 'strokeColor=#2199b5;dashed=0;' : 'strokeColor=#cbd5df;';
  const value = '<b>' + r.stage.number + ': ' + r.stage.title + '</b><br>Lead: ' + r.stage.actor + '; PM coordinates (agent-roles.md)<br>Responsibility: ' + r.stage.checkRole + '<br>I: ' + r.input + '<br>U: ' + r.updated + '<br>O: ' + r.output + '<br>Phase B: ' + r.delayed;
  return '<mxCell id="stage-flow-' + r.stage.id + '" parent="1" vertex="1" value="' + escapeHtml(value) + '" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=14;fontSize=15;fillColor=#f5f7fa;' + style + '"><mxGeometry x="40" y="' + (140+i*260) + '" width="1120" height="240" as="geometry"/></mxCell>';
}).join('\n');
const publicationNote = '<mxCell id="stage-flow-publication" parent="1" vertex="1" value="' + escapeHtml('<b>Separate control and correction PRs</b><br>Planning candidate PR - owner merge - control-record PR (even findings) - owner merge - correction PR - owner merge - fresh control. Every PR needs required CI. A merged report is not acceptance. Preserve in-flight work and immutable evidence. Stage 17 code peer review remains before merge. Procedure: analysis/migration_methodology.md#review-and-correction-prs') + '" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=14;fontSize=15;fillColor=#f5f7fa;strokeColor=#cbd5df;"><mxGeometry x="40" y="5340" width="1120" height="170" as="geometry"/></mxCell>';
flowBlock('analysis/migration_artifact_flow.drawio', '<diagram id="stage-artifact-roles" name="Stage inputs, updates and review roles"><mxGraphModel page="1" pageWidth="1200" pageHeight="5540"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="stage-flow-legend" parent="1" vertex="1" value="' + escapeHtml(flowIntro) + '" style="text;whiteSpace=wrap;html=1;align=left;fontSize=15;"><mxGeometry x="40" y="20" width="1120" height="110" as="geometry"/></mxCell>' + flowCells + publicationNote + '</root></mxGraphModel></diagram>', (s,b) => s.replace('</mxfile>', b + '\n</mxfile>'));
require('../tools/sync-gate-review-guide').synchronize(targetRoot, check, allowedFiles);
if (!check) require('../tools/artifact-reading').synchronizeTemplates(targetRoot, true, allowedFiles);
console.log(`Practical artifact and gate guidance ${check ? 'checked' : 'synchronized'} in ${targetRoot}`);

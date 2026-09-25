#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const gateContract = require('../stage-gates.json');
const recordContracts = require('../record-contracts.json');
const gateReviewContracts = require('../gate-review-contracts');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const processContract = require('../tools/process-contract');
processContract.synchronize(ROOT, true);
const flowContract = processContract.readContract(ROOT);
const roleContract = require('../tools/agent-role-contract').readRoleContract(ROOT);
const { stageRoleView } = require('../tools/agent-role-view');
const OUTPUT = path.join(__dirname, 'data.json');
const artifactResponsibilities = JSON.parse(fs.readFileSync(path.join(__dirname, 'artifact-responsibilities.json'), 'utf8'));
const templateOutputs = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, 'analysis/artifact-naming.json'), 'utf8'))
  .map(({ template, output }) => [template, output]));
const XPLANNER_REPOSITORY = 'https://github.com/olsys-ltd/xplanner2';
const XPLANNER_REVISION = '62a21930d8d7c19017ac9ed9e4a474a614e30842';

const phases = [
  { id: 'bootstrap', label: 'Bootstrap', range: 'before Stage 1', color: '#8b9bad' },
  { id: 'requirements', label: 'Requirements', range: 'Stages 1-4', color: '#e2687c' },
  { id: 'prototyping', label: 'Prototyping', range: 'Stages 5-8', color: '#35a9c5' },
  { id: 'architecture', label: 'Architecture & knowledge', range: 'Stages 9-14', color: '#7d69d6' },
  { id: 'design', label: 'Design', range: 'Stages 15-16', color: '#d99a32' },
  { id: 'coding', label: 'Coding', range: 'Stage 17', color: '#d46f4f' },
  { id: 'delivery', label: 'Deployment & QA', range: 'Stages 18-19', color: '#43a86b' },
];

const stageHeadlines = {
  'stage-01': "What does the legacy system actually do, and what evidence supports it?",
  'stage-02': "Did we miss or misinterpret any legacy behavior?",
  'stage-03': "Does the running legacy system behave as our analysis predicts?",
  'stage-04': "Which legacy behavior do we keep, change or deliberately leave behind?",
  'stage-05': "In what form and visual style should the new application work?",
  'stage-06': "Which screens, states and transitions will represent the agreed behavior?",
  'stage-07': "Does the prototype cover the agreed behavior without omissions or unsupported additions?",
  'stage-08': "Does the owner approve this exact prototype as the visual baseline?",
  'stage-09': "How should the target system be structured to meet its requirements and constraints?",
  'stage-10': "Is the architecture consistent, justified and able to meet the requirements?",
  'stage-11': "Does the owner accept the architecture and its trade-offs, or require changes?",
  'stage-13': "What knowledge from the approved architecture must we pass to the next agent?",
  'stage-14': "Does the knowledge package preserve the approved architecture without omissions or distortion?",
  'stage-15': "What exactly will we implement in the next slice, how, and how will we verify it?",
  'stage-16': "Is the implementation plan sound, and has the owner approved its assumptions and scope?",
  'stage-17': "Is the agreed slice implemented and verified in code and tests?",
  'stage-18': "Does the delivered version work, have we missed any behavior, and do its records agree?",
  'stage-19': "Has independent acceptance confirmed the result, and has the owner accepted it?",
};

const stages = [
  {
    id: 'stage-00', number: 'B', phase: 'bootstrap', title: 'Bootstrap', kind: 'owner', actor: 'Owner + initializer',
    summary: 'Install the reusable process, identify the project, and authorize the first reconnaissance.',
    actions: ['Confirm starter revision, project identity and integration branch before initialization', 'Review the constitution with the owner; its version must match status even before ratification', 'Record exact source paths and environment contract', 'Run every Bootstrap check; record results and blockers in the report and status before waiting for corrections'],
    input: 'Starter repository + project identity + owner',
    exit: 'Ratified constitution, completed Bootstrap gate report and explicit owner authorization to enter Stage 1',
    returns: 'Bootstrap remains blocked until every required contract and audit is valid and the gate report is complete.',

  },
  {
    id: 'stage-01', number: 1, phase: 'requirements', title: 'Reconnaissance', kind: 'work', actor: 'Primary agent',
    summary: 'Inspect the immutable legacy source and turn observable behavior into an evidence-backed parity map.',
    actions: ['Inventory channels, roles, routes, jobs and integrations', 'Trace behavior to source/configuration evidence', 'Record unknowns and deployment constraints', 'Create one atomic scenario per parity-map row', 'PM publishes the draft or corrections in their own PR; required CI and owner merge precede fresh Stage 2 control'],
    input: 'Immutable legacy revision + project contract',
    exit: 'Initial reconnaissance and parity map pass the workbook audit',
    returns: 'Any later parity-map defect returns here.',
    reentry: {
      instructionPath: 'analysis/reviews/README.md#stage-1-re-entry',
      examplePath: 'analysis/stages/stage-01/stage-02-pass-001-dispositions.md',
      sources: [
        {
          artifactId: 'stage-02-review',
          en: 'Stage 2: independent review findings about missed or misinterpreted legacy behavior.',
          ru: 'Шаг 2: замечания независимого ревью о пропущенном или неверно понятом поведении легаси.',
        },
        {
          artifactId: 'stage-03-walkthrough',
          en: 'Stage 3: walkthrough findings, observed behavior and runtime evidence that contradict or extend the map.',
          ru: 'Шаг 3: замечания walkthrough, наблюдаемое поведение и доказательства из работающей системы, которые расходятся с картой или дополняют её.',
        },
        {
          artifactId: 'stage-04-revision',
          en: 'Stage 4: mapping errors found during requirements revision. An owner decision to change correctly recorded legacy behavior stays at Stage 4.',
          ru: 'Шаг 4: ошибки карты, обнаруженные при ревизии требований. Решение владельца изменить правильно описанное легаси остаётся работой шага 4.',
        },
      ],
      en: {
        title: 'On return to Stage 1',
        input: 'Conditional input on any return: the exact record cited by migration_status.yaml, its finding IDs and linked evidence. The examples below cover Stages 2-4; a later stage supplies its own triggering record. These records are not required on the first entry. File links open the starter templates.',
        steps: [
          'After the owner merges the triggering record PR, PM assigns a separate correction branch with the exact trigger, baseline and impact boundary. Preserve in-flight work. The primary agent verifies the findings and relevant unresolved items against source, configuration and runtime evidence.',
          'Correct affected map rows and reconnaissance sections, dependent claims and all occurrences of the same failure mechanism across affected roles and channels, not just reported lines. Preserve valid artifacts, decisions and evidence at their existing identities; explain why their inputs and dependencies remain valid. This is not a restart of Stage 1.',
          'Widen authoring only with recorded evidence of an unreliable baseline, changed inputs, systemic omissions or impact that cannot be bounded. Investigate uncertainty first; record why retained evidence is insufficient. PM revises the boundary within existing authority; changed approved scope or reserved decisions require the owner.',
          'Record finding IDs, dispositions, changed rows/files, related-occurrence coverage, retained work, actual checks/results, unknowns and the separate next control. PM validates the bounded diff and handoff before accepting RESULT or requesting control, and updates shared status. Publish the correction PR; mandatory gates, including repository-wide gates, CI and owner merge remain required. Original reviews stay immutable; retained checks are not new runs.',
          'After the correction PR is merged, a fresh eligible Stage 2 agent performs a new full in-scope blind Phase A on the integrated revision, saves it, then performs two-way Phase B reconciliation. Previous findings, correction plans and outcomes remain withheld until Phase B. Impact-scoped author corrections do not narrow control scope or replace independent acceptance.',
        ],
      },
      ru: {
        title: 'При возврате на шаг 1',
        input: 'Условный вход при любом возврате: точная запись из migration_status.yaml, ID замечаний и связанные доказательства. Ниже примеры для шагов 2–4; более поздний шаг передаёт собственную запись, вызвавшую возврат. При первом входе эти файлы не требуются. Ссылки на файлы открывают шаблоны стартера.',
        steps: [
          'После merge владельцем PR с записью, вызвавшей возврат, PM выделяет отдельную ветку исправлений с точным основанием, исходной версией и границами влияния. Незавершённая работа сохраняется. Основной агент проверяет замечания и относящиеся к ним незакрытые вопросы по исходникам, конфигурации и доказательствам из работающей системы.',
          'Исправляет затронутые строки карты и разделы разведки, зависимые утверждения и все проявления того же механизма ошибки в затронутых ролях и каналах, а не только указанные строки. Сохраняет действующие артефакты, решения и доказательства с прежними идентификаторами и версиями; объясняет, почему их входы и зависимости остаются действительными. Это не перезапуск шага 1.',
          'Расширяет авторскую работу только при записанных доказательствах ненадёжной исходной базы, изменённых входов, системных пропусков или влияния, границы которого невозможно установить. Сначала исследует неопределённость; записывает, почему сохранённых доказательств недостаточно. PM меняет границы в рамках имеющихся полномочий; изменение утверждённого объёма или решений, закреплённых за владельцем, требует решения владельца.',
          'Записывает ID замечаний, решения по ним, изменённые строки/файлы, охват связанных проявлений, сохранённую работу, фактические проверки и результаты, неизвестное и отдельный следующий контроль. PM проверяет ограниченный diff и передачу результата до принятия RESULT или запроса контроля и обновляет общий статус. Публикуется PR исправлений; обязательные гейты, включая проверки всего репозитория, CI и merge владельца сохраняются. Прежние ревью неизменны; сохранённые проверки не выдаются за новые прогоны.',
          'После merge PR исправлений новый допустимый независимый агент шага 2 проводит новую полную слепую фазу A в границах проверки по интегрированной ревизии, сохраняет её, затем выполняет двустороннюю сверку в фазе B. Прежние замечания, планы и результаты исправлений недоступны до фазы B. Исправление затронутых участков не сужает объём контроля и не заменяет независимую приёмку.',
        ],
      },
    },
    },
  {
    id: 'stage-02', number: 2, phase: 'requirements', title: 'Control reconnaissance', kind: 'independent', actor: 'Fresh independent agent',
    summary: 'Independently discover legacy behavior, save that first inventory, then reconcile it with Stage 1. The legacy source resolves disagreements; neither inventory is an automatic oracle.',
    actions: ['Declare independence and the allowed Phase A inputs', 'Phase A: inspect source without the filled map, reconnaissance or prior conclusions', 'Save the independent inventory and its checkpoint before opening Phase B inputs', 'Phase B: check discovered behavior against records and every recorded claim back to source', 'Preserve Phase A; record matches, gaps, reviewer corrections and blocked scope in the final report', 'PM publishes the unchanged result in a separate records PR, even with findings; required CI and owner merge precede a separate correction PR. Merge is not a clean verdict'],
    input: 'Exact immutable legacy revision; Stage 1 records are withheld until Phase B',
    exit: 'A current immutable clean review, no blocked scope, and a green workbook audit',
    returns: 'Findings return to Stage 1; every re-entry requires a new fresh session.',

  },
  {
    id: 'stage-03', number: 3, phase: 'requirements', title: 'Live legacy walkthrough', kind: 'work', actor: 'Primary agent; owner only for fallback',
    summary: 'Deploy the old system and walk every applicable channel as a real user; static code remains only a hypothesis.',
    actions: ['PM requests owner-approved access, role accounts and permitted data/actions', 'PM validates the environment, deploys or verifies the legacy baseline and hands execution evidence to BA', 'BA runs pages, forms, terminal screens, API routes and jobs', 'Compare every observation with the parity map', 'Keep unobservable behavior explicitly unverified', 'Ask the owner to choose simulate or waive when live access is impossible'],
    input: 'Stage 2 clean map + runnable legacy environment',
    exit: 'live-verified, partial-simulated, or blocked-waived walkthrough record',
    returns: 'Missing or misrepresented observed behavior returns to Stage 1 with the exact stage-03/walkthrough-NNN.md, finding IDs and runtime evidence cited in status.',
    conditionalOwner: true,
  },
  {
    id: 'stage-04', number: 4, phase: 'requirements', title: 'Requirements revision', kind: 'owner', actor: 'Agent records; business and engineering advise; owner decides',
    summary: 'Decide whether confirmed legacy behavior should be kept, changed, or deliberately not ported.',
    actions: ['Hunt for contradictions across channels', 'Flag obsolete or unreasonable behavior', 'Review every flag with business and engineering', 'Record the owner\'s keep, change, or do-not-port decisions'],
    input: 'Verified parity map + Stage 3 walkthrough evidence',
    exit: 'Every flagged row has an explicit durable owner decision',
    returns: 'A mapping error returns to Stage 1 with stage-04-requirements-revision.md, finding IDs and evidence cited in status. An owner-approved change to correctly recorded legacy behavior stays at Stage 4.',

  },
  {
    id: 'stage-05', number: 5, phase: 'prototyping', title: 'Application form and style', kind: 'owner', actor: 'Agent prepares; owner decides',
    summary: 'Choose the product form, primary channel, visual direction, palette, themes, and accessibility baseline.',
    actions: ['Reconcile map scenarios and channels with Stage 4 decisions and conditions', 'Prepare form/style alternatives and 2-3 palettes', 'Explain benefits, costs and accessibility implications', 'Stop until the owner selects the baseline, then record the exact decision', "Draft ui-design-system.md and ui-design-tokens.json; the owner selects the foundation and pins its canonical hash in ui-ux-decision.md. This does not approve future component variants."],
    input: 'The parity map identifies scenarios, roles and channels. stage-04-requirements-revision.md supplies the owner decisions, rationale and conditions that constrain the application form. The agent reconciles both; a disagreement must be resolved, not silently interpreted.',
    example: 'Illustrative: Stage 4 rejects a separate mobile product but retains phone access. The agent checks that the map preserves this condition, then proposes responsive web as an option, not removal of phone support. The owner-approved form and style are recorded in ui-ux-decision.md, the Stage 5 output.',
    exit: 'Durable owner-approved design baseline or exact waiver',
    returns: 'A parity-map defect returns to Stage 1; ordinary choice revisions remain inside Stage 5.',

  },
  {
    id: 'stage-06', number: 6, phase: 'prototyping', title: 'Wireframes', kind: 'work', actor: 'Primary agent + design tool',
    summary: 'Normalize map rows into real surfaces, then produce the complete reviewable wireframe catalogue.',
    actions: ['Classify every row as surface, state, action, overlay, navigation, or non-visual', 'Generate only justified screens and meaningful state variants', 'Export files from the design tool into the repository', 'Record screen-to-row, role, state, action and hash links', "Develop representative screens and the shared component catalogue together, then reuse them. Pin catalogue, tokens and component previews in manifest version 4; each screen declares used ui_variants. Foundation changes return to 5."],
    input: 'Parity map + Stage 5 design baseline',
    exit: 'Normalization, manifest and exported wireframes pass audit:prototype',
    returns: 'A baseline problem returns to Stage 5; a parity-map defect returns to Stage 1.',
    },
  {
    id: 'stage-07', number: 7, phase: 'prototyping', title: 'Wireframe control', kind: 'independent', actor: 'Fresh independent agent',
    summary: 'Verify that the prototype is complete, correctly normalized, and contains no unsupported invention.',
    actions: ['Check reviewer eligibility', 'Run the structural prototype audit', 'Inspect roles, states, validation and navigation semantically', 'Compare every export against the map and owner decisions', "Independently compare screens with the shared catalogue, token values and previews, including required states, navigation, responsive behavior and accessibility. Record mismatches and unchecked scope; hashes alone do not prove visual consistency."],
    input: 'Map + normalization + manifest + exported wireframes',
    exit: 'Immutable clean pass, or governed Low-cosmetic closing pass with no unchecked scope',
    returns: 'Prototype findings return to Stage 6; a deliberate baseline change returns to Stage 5; a parity-map defect returns to Stage 1.',

  },
  {
    id: 'stage-08', number: 8, phase: 'prototyping', title: 'Wireframe approval', kind: 'owner', actor: 'Agent presents and records; owner approves',
    summary: 'Approve the exact independently checked visual baseline that later design and acceptance must follow.',
    actions: ['Walk the verified screen set and transitions', 'Review any governed Low-cosmetic debt', 'Request corrections or approve the exact export version', 'Pin the manifest and exported files by hash', "The owner reviews screens and component sheets together and approves the exact manifest-pinned catalogue, tokens and exports. Pending required variants or states block approval."],
    input: 'Stage 7 closing pass for the same export_set_version',
    exit: 'Recorded ui-ux-approval.md and audit:prototype:approved',
    returns: 'Prototype remarks return to Stage 6; a deliberate baseline change returns to Stage 5; a parity-map defect returns to Stage 1.',

  },
  {
    id: 'stage-09', number: 9, phase: 'architecture', title: 'Architecture requirements', kind: 'owner', actor: 'Architecture agent writes; client/owner and technical participants answer; owner decides',
    summary: 'Turn legacy facts and residual client answers into measurable NFRs, target choices and the minimum architecture baseline. Name the current layer and enabled slices: foundation approval is not approval of the entire future system; all applicable Grade A decisions in the declared scope must close.',
    actions: ['Complete Legacy Discovery: code/config, relevant live check, then narrow client question', 'Grade NFRs A/B/C and assign authority', 'Close system-diagram-shaping decisions', 'Create architecture record, sections, ADRs and machine manifest', "Read the approved UI catalogue/tokens through the prototype manifest and verify component-library/platform compatibility. Necessary visual source changes repeat the affected Stage 5-8 controls."],
    input: 'Approved prototype + parity map + legacy evidence + client answers',
    exit: 'Grade A decisions needed now are closed; workbook and architecture audit pass',
    returns: 'Missing architecture evidence keeps Stage 9 open; changed prototype structure returns to Stage 6, a deliberate channel/design-system baseline change to Stage 5, and a parity-map defect to Stage 1. Record the exact decision and repeat Stages 7-8 before resuming Stage 9.',

  },
  {
    id: 'stage-10', number: 10, phase: 'architecture', title: 'Architecture control', kind: 'independent', actor: 'Fresh independent agent',
    summary: 'Challenge the NFR-to-architecture chain and verify that every decision is evidenced, consistent and implementable.',
    actions: ['Check reviewer independence', 'Recalculate hashes and workbook/manifest links', 'Challenge boundaries, contracts, NFR coverage and ADR reasoning', 'Record an immutable verdict'],
    input: 'Exact Stage 9 architecture set',
    exit: 'Clean independent Stage 10 pass plus audit:architecture',
    returns: 'Architecture findings return to Stage 9; UI structure returns to Stage 6; a deliberate channel/design-system change returns to Stage 5; a parity-map defect returns to Stage 1.',

  },
  {
    id: 'stage-11', number: 11, phase: 'architecture', title: 'Owner architecture review', kind: 'owner', actor: 'Agent presents and records; owner reviews and decides',
    summary: 'Walk the understandable architecture with the owner and record an exact verdict against the reviewed hashes.',
    actions: ['Present system boundaries and deployment view', 'Explain important NFR and ADR choices', 'Read the triggering closure report and correction dispositions on re-entry', 'Record the human decision in a new immutable architecture-owner-verdict-NNN.md', 'Pin the exact reviewed architecture set'],
    input: 'Stage 10 clean architecture set',
    exit: 'Durable owner verdict for the exact hashes',
    returns: 'Architecture remarks return to Stage 9; UI structure returns to Stage 6; a deliberate channel/design-system change returns to Stage 5; a parity-map defect returns to Stage 1.',

  },
  {
    id: 'stage-12', number: 12, phase: 'architecture', title: 'Remark verification', kind: 'work', actor: 'Agent verifies closure',
    headline: 'Are all owner remarks from Stage 11 provably closed in the exact architecture files, without silently changing other decisions?',
    summary: 'Prove that every owner remark is resolved, traceable to corrected architecture evidence and re-approved without silently changing unrelated decisions.',
    actions: ['Read the exact owner verdict selected in status and all applicable earlier item IDs', 'Compare every criterion with actual evidence in the unchanged approved set', 'Write a new immutable architecture-closure-NNN.md with checks, counts and classified return', 'With no remarks, record the unchanged-set check and zero required fixes'],
    input: 'Owner verdict and remark list',
    exit: 'All applicable items closed and audit:architecture:closure passes',
    evidence: 'Result: a separate immutable architecture-closure-NNN.md, selected by exact path in status. It records criteria, observations, evidence and closed/open/failed/blocked totals. A negative report follows the classified return and must be read by the agents at Stages 9-11. The owner verdict, architecture files and approved hashes remain read-only.',
    example: 'XPlanner remark 003 led to ADR-007, fresh independent control and Foundation owner acceptance. The separate closure example reconstructs that historical trail, marks unperformed checks as blocked and does not invent a new approval.',
    xplannerExamples: [
      { label: 'Owner remark', path: 'analysis/stages/stage-11/owner-remarks-003.md' },
      { label: 'Closure example (historical reconstruction)', path: 'analysis/stages/stage-12/architecture-closure-001.md' },
      { label: 'Resulting ADR', path: 'analysis/architecture/adr/007-engineering-quality.md' },
      { label: 'Closing independent control', path: 'analysis/reviews/stage-10-pass-009.md' },
      { label: 'Final owner acceptance', path: 'analysis/stages/stage-11/owner-foundation-architecture-acceptance.md' },
    ],
    returns: 'Architecture closure failures return to Stage 9; UI structure returns to Stage 6; a deliberate channel/design-system change returns to Stage 5; a parity-map defect returns to Stage 1.',
    },
  {
    id: 'stage-13', number: 13, phase: 'architecture', title: 'Target knowledge synthesis', kind: 'work', actor: 'Primary agent',
    summary: 'Convert the approved architecture into Open Knowledge Format (OKF) v0.2: Google Cloud-published, vendor-neutral Markdown concepts with YAML frontmatter, stable ids and source provenance.',
    actions: ['Structure concepts as OKF v0.2 Markdown with YAML frontmatter', 'Assign stable ids and explain boundaries, contracts and operating rules', 'Link every concept to its exact approved source', 'Pin the source set and concept set in knowledge-manifest.json', "Link relevant approved UI catalogue/token sources into knowledge without creating another dictionary of visual values."],
    input: 'Approved architecture + parity map + approved prototype + owner decisions; knowledge-manifest pins exact sources' ,
    exit: 'OKF v0.2 bundle and knowledge-manifest.json pass audit:knowledge',
    returns: 'An architecture contradiction returns to Stage 9; a prototype contradiction returns to Stage 6; a parity-map defect returns to Stage 1.',
    },
  {
    id: 'stage-14', number: 14, phase: 'architecture', title: 'Target knowledge control', kind: 'independent', actor: 'Fresh independent agent',
    summary: 'Check that the knowledge bundle faithfully represents the approved architecture and invents nothing.',
    actions: ['Check reviewer eligibility', 'Verify every concept and source hash', 'Detect omissions, duplicates, placeholders and invented rules', 'Record an immutable pass', "Check knowledge references to the approved UI catalogue/tokens for omissions or competing visual rules; source corrections return through the existing prototype path."],
    input: 'Exact architecture set + OKF bundle + manifest',
    exit: 'Clean independent Stage 14 pass and audit:knowledge',
    returns: 'Knowledge defects return to Stage 13; architecture defects to Stage 9; prototype contradictions to Stage 6 or Stage 5 for a deliberate baseline change; parity-map defects to Stage 1.',

  },
  {
    id: 'stage-15', number: 15, phase: 'design', title: 'Design: SDD', kind: 'work', actor: 'Primary agent',
    summary: 'Define one bounded delivery slice in requirement language, with implementation plan, tasks and end-to-end traceability.',
    actions: ['Select exact parity-map rows or a target-only owner decision', 'Write numbered functional and non-functional requirements', 'Link NFR criteria to requirements/tasks/tests in specs/traceability.md; keep the approved manifest read-only', 'Declare target surfaces, roles, tests, UI impact, Completion dependencies and return triggers', "For UI work, read the pinned catalogue and tokens. Bind each Used UI Control Inventory row to its screen and stable governed variant; plan shared styles/components before consumers. Missing approved variants return to 6, foundation changes to 5."],
    input: 'Map + approved prototype + architecture + OKF bundle; read exact sources pinned by the manifests',
    exit: 'Complete spec.md, plan.md, tasks.md, traceability and target inventory',
    returns: 'Missing knowledge returns to Stage 13; architecture changes to Stage 9; UI structure to Stage 6 or Stage 5 for a deliberate baseline change; parity-map defects to Stage 1.',
    },
  {
    id: 'stage-16', number: 16, phase: 'design', title: 'Design re-verification', kind: 'independent', actor: 'Fresh independent agent + owner gate',
    summary: 'Challenge the complete evidence chain before implementation and disclose every assumption that still requires an owner decision.',
    actions: ['Compare approved exports with SDD and planned visual tests; new UI is not required until Stage 17', 'Run audit:sdd and validate the target-surface declaration', 'Challenge requirements, plan, tasks and testability', 'Present all assumptions and scope decisions to the owner', "Verify the SDD control-to-variant/token bindings and planned visual checks against the approved shared UI baseline, without claiming that unbuilt UI has been tested."],
    input: 'Complete Stage 15 SDD packet',
    exit: 'Clean independent pass plus explicit owner approval of assumptions and implementation scope',
    returns: 'SDD findings return to Stage 15; knowledge to Stage 13; architecture to Stage 9; UI structure to Stage 6 or Stage 5 for a deliberate baseline change; parity-map defects to Stage 1.',

  },
  {
    id: 'stage-17', number: 17, phase: 'coding', title: 'Build', kind: 'owner', actor: 'Primary agent; independent reviewer; owner merges',
    summary: 'Implement one approved slice with code, tests, migrations and synchronized evidence in one reviewable candidate.',
    actions: ['Implement only approved tasks', 'Run formatting, analysis, build, unit/integration/E2E and parity checks', 'Record executed NFR tests in downstream traceability; keep architecture hashes unchanged', 'Obtain clean independent review and owner merge', "Implement shared token-derived styles and reusable components; verify actual computed values, icons and states. Do not invent private screen styles. Missing design returns through Stage 15 to 6 or 5, then affected review/approval."],
    input: 'Owner-approved SDD scope',
    exit: 'Exact candidate passes all required gates and is merged by the owner',
    returns: 'Implementation findings stay in Stage 17; SDD defects return to Stage 15; architecture defects to Stage 9; parity-map defects to Stage 1.',

  },
  {
    id: 'stage-18', number: 18, phase: 'delivery', title: 'Delivery and live reconciliation', kind: 'work', actor: 'Deployment agent',
    summary: 'Deploy the exact merged revision, verify useful behavior and recovery readiness, then reconcile live scope with the approved records. Reuse applicable observations from this delivery; investigate uncovered behavior instead of repeating the same suite. One delivery record captures results, coverage and unresolved findings before independent acceptance.',
    actions: ['PM rechecks owner-authorized access, release/data scope, environment contract and immutable revision', 'PM runs the reviewed configured deploy command and hands exact execution evidence to Developer', 'Developer runs smoke and useful role-based browser journeys', 'Repeat deployed visual parity and verify rollback readiness', 'Discover in-scope live surfaces and reconcile the parity map, SDD, prototype and inventory', 'Reuse applicable delivery evidence, investigate coverage gaps and record every discrepancy or unverified action', "Compare applicable deployed UI with the same pinned shared catalogue/tokens and screen exports. Reuse valid exact-revision evidence, but do not equate local checks with deployment verification."],
    input: 'Owner-merged Stage 17 revision',
    exit: 'Immutable delivery record, green deployed gates and records-only reconciliation',
    returns: 'Implementation or deployment failures return to Stage 17; SDD defects to Stage 15; architecture defects to Stage 9; parity-map defects to Stage 1.',
    },
  {
    id: 'stage-19', number: 19, phase: 'delivery', title: 'Slice and final acceptance', kind: 'independent-owner', actor: 'Fresh independent third-party agent reviews; owner decides',
    summary: 'Have someone else exercise the delivered scope, then obtain the owner’s explicit acceptance signature.',
    actions: ['Phase A: receive neutral routing and expectation-only extracts of approved behavior, inventory and prototype, with source and extract digests; no prior results or findings', 'Exercise useful actions for every role-visible destination and save independent observations before Phase B', 'Phase B: open full originals, verify extract completeness, and reconcile the consolidated backlog and evidence chain', 'QA returns its independent report; PM records the actual owner walkthrough or decline and explicit acceptance', "Phase A receives relevant shared UI expectations without prior outcomes. Phase B verifies the extract against the full pinned catalogue/tokens and reconciles actual deployed findings."],
    input: 'Phase A: stand URL + exact revision + acceptance instructions + expectation-only extracts; Phase B: full originals and prior evidence',
    exit: 'Clean immutable acceptance pass, audit:stage19 and owner slice signature; audit:all validates final complete only',
    returns: 'Findings return to Stage 17, Stage 15, Stage 9 or Stage 1 according to their cause.',

  },
];

const polishBacklogFlow = {
  'stage-15': { updated: true, evidence: "If a cosmetic backlog exists, the design agent compares every open finding with the slice screens, components and functions, not only its assigned slice. Matching finding IDs become linked tasks in tasks.md; the agent updates the same backlog with scope matches and reasons for exclusions. Missing referenced backlog or unmapped scope blocks planning." },
  'stage-16': { updated: false, evidence: "The independent agent reads the conditional cosmetic backlog and checks scope matching and task coverage in the Stage 15 plan. An applicable finding without a task blocks the pass and returns to Stage 15. The reviewer records the result in the immutable Stage 16 report, not by silently changing the backlog." },
  'stage-17': { updated: true, evidence: "The implementation agent reads the conditional cosmetic backlog and rechecks the actual changed screens, components and functions. The agent fixes applicable findings, links tasks, commits and rendered evidence, and marks them ready for independent verification. Only recorded independent verification makes a finding verified closed. Scope changes return through the affected planning controls." },
  'stage-18': { updated: false, evidence: "Before production release, the delivery agent matches the conditional backlog against all screens, components and functions in the release, including shared components. An applicable finding assigned to a later slice still blocks release until verified closed. The delivery record cites the backlog revision and checked finding IDs. Demo/test deployment may precede closure to obtain evidence. During live reconciliation the delivery agent records reproduced cosmetic findings in the immutable delivery report and blocks closure. Stage 17 reopens the same backlog, preserves history and produces a newly reviewed candidate." },
  'stage-19': { updated: false, evidence: "The independent acceptance agent consumes the conditional backlog after the blind acceptance pass, during evidence reconciliation, so prior findings do not bias the first inspection. The agent checks applicable finding IDs and verified closure against the running system; final acceptance checks the whole backlog. Open applicable findings block acceptance and return to Stage 17; the immutable acceptance report records the outcome." },
};
for (const stage of stages) {
  Object.assign(stage, flowContract.flow.find(row => row.id === stage.id));
  const roleView = stageRoleView(roleContract, stage.id);
  stage.actor = roleView.actor.en;
  stage.assignment = roleView.assignment;
  stage.independent = stage.checkRole === 'independent';
  const flow = polishBacklogFlow[stage.id];
  if (!flow) continue;
  stage.evidence = flow.evidence;
}

// Bootstrap creates the single status ledger. Every governed stage then reads
// and updates that same file at durable checkpoints; no stage creates a copy.
for (const stage of stages) {
  if (stage.id === 'stage-00') continue;
  if (stageHeadlines[stage.id]) stage.headline = stageHeadlines[stage.id];
}


const preventionDuties = {
  bootstrap: {
    en: 'The initializer creates one empty error-prevention-checklist.md. The Bootstrap agent validates it; confirmed setup errors may supply reusable checks after admission and deduplication.',
    ru: 'Инициализатор создаёт один пустой error-prevention-checklist.md. Агент подготовки проверяет его; подтверждённые ошибки настройки могут стать повторно используемыми проверками после отбора и поиска дубликатов.',
  },
  work: {
    en: 'Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates.',
    ru: 'До работы прочитать проверки, применимые к шагу и затронутому объёму. Перед передачей и после исправлений проверить фактический результат и записать итоги в рабочий отчёт либо control.prevention_self_check. Подтверждённые ошибки обобщает агент; координатор отбирает дополнения и исключает дубликаты.',
  },
  review: {
    en: 'Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table.',
    ru: 'Прочитать применимые проверки и независимо проверить весь обязательный объём, включая самопроверку автора. В Checklist Review сопоставить заявление автора с наблюдениями. Каждая проблема связывает F-NNN/B-NNN с CHK-NNN, объясняет расхождение и нужную повторную проверку. Координатор проверяет новые предложения и исключает дубликаты. Ревьюер не редактирует общую таблицу.',
  },
  blind: {
    en: 'Phase A: do not open the learned checklist, its extracts or prior self-check/learning notes. Save independent observations first. Phase B: read the pinned checklist, check applicable rows and reconcile with those observations. In Checklist Review, link each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals.',
    ru: 'Фаза А: не открывать накопленный чеклист, выдержки из него и прежние записи самопроверки или новых уроков. Сначала сохранить независимые наблюдения. Фаза Б: прочитать зафиксированную версию чеклиста, проверить применимые пункты и сопоставить с наблюдениями. В Checklist Review связать каждую проблему F-NNN/B-NNN с CHK-NNN: заявление автора, наблюдаемое расхождение и повторная проверка. Координатор проверяет новые предложения и исключает дубликаты.',
  },
  peer: {
    en: 'The implementation agent reads applicable checks before work and self-checks the candidate before handoff and after fixes. A separate peer independently checks it; Checklist Review links each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The reviewer also proposes reusable lessons. The coordinator validates and deduplicates updates; a self-check is not peer approval.',
    ru: 'Агент реализации читает применимые проверки до работы и проверяет кандидата перед передачей и после исправлений. Отдельный ревьюер проверяет результат; в Checklist Review связывает проблемы F-NNN/B-NNN с CHK-NNN, заявлением автора, наблюдаемым расхождением и повторной проверкой. Также предлагает обобщённые проверки. Координатор проверяет основания и исключает дубликаты; самопроверка не заменяет ревью.',
  },
};
for (const stage of stages) {
  stage.prevention = preventionDuties[stage.id === 'stage-00' ? 'bootstrap'
    : ['stage-02', 'stage-19'].includes(stage.id) ? 'blind'
    : stage.id === 'stage-17' ? 'peer'
    : stage.independent ? 'review' : 'work'];
}

const deliveryPrevention = stages.find(stage => stage.id === 'stage-18');
deliveryPrevention.prevention = {
  en: deliveryPrevention.prevention.en + ' Records-only attestation may append new admitted rows, but cannot alter or remove existing checks. Refinement proposals stay in the report until an authorized later revision; required checks cannot be deferred.',
  ru: deliveryPrevention.prevention.ru + ' После деплоя при изменении только записей можно дописать новые отобранные пункты, но нельзя менять или удалять прежние. Предложения уточнений остаются в отчёте до разрешённой новой ревизии; обязательные проверки откладывать нельзя.',
};
const xplannerExamples = {
  'feature-dependencies': { path: 'analysis/feature-dependencies.json', note: 'The XPlanner example reconstructs dependencies across 66 existing SDD slices. Source statements and candidate mappings remain distinct; no retrospective independent approval or release readiness is claimed.' },
  'ui-design-system': { note: "XPlanner retains an explicitly pinned historical prototype without this artifact. The supplied template illustrates the new format; its next changed UI baseline must adopt it through Stages 5-8. No retrospective approval is claimed." },
  'ui-design-tokens': { note: "XPlanner retains an explicitly pinned historical prototype without this artifact. The supplied template illustrates the new format; its next changed UI baseline must adopt it through Stages 5-8. No retrospective approval is claimed." },
  'error-prevention': { path: 'analysis/error-prevention-checklist.md', note: 'Ten reusable checks with source links, expanded from confirmed XPlanner corrections on 2026-09-22. This bounded historical import applies to new or reopened work; it is not an exhaustive history audit or a claim of historical self-checks.' },
  'owner-waiver': { path: 'analysis/stages/waivers/pre-sdd-knowledge-029-iteration-accuracy-report.md' },
  'owner-walkthrough-decline': { note: 'XPlanner has no exact final owner-walkthrough decline under this process.' },
  'agent-instructions': { path: 'AGENTS.md' },
  'migration-entry': { path: 'MIGRATION.md' },
  methodology: { path: 'analysis/migration_methodology.md' },
  constitution: { path: '.specify/memory/constitution.md' },
  status: { path: 'analysis/migration_status.yaml' },
  'project-contract': { path: 'config/project.yaml' },
  'environment-contract': { path: 'config/environments.yaml' },
  'bootstrap-gate-report': { path: 'analysis/stages/bootstrap/bootstrap-gate-report.md' },
  'recon-record': { path: 'analysis/legacy_reconnaissance.md' },
  'parity-map': { path: 'analysis/legacy_user_flows.xlsx' },
  'stage-02-review': { path: 'analysis/reviews/stage-02-pass-030.md' },
  'stage-03-walkthrough': { path: 'analysis/stages/stage-03/stage-03-outcome.md' },
  'stage-04-revision': { path: 'analysis/stages/stage-04/stage-04-requirements-revision.md' },
  'prototype-decision': { path: 'analysis/prototyping/ui-ux-decision.md' },
  'screen-normalization': { path: 'analysis/prototyping/screen-normalization.json' },
  wireframes: { path: 'analysis/prototyping/catalogue.html', note: 'The catalogue opens the complete XPlanner wireframe set.' },
  'screen-manifest': { path: 'analysis/prototyping/screen-manifest.json' },
  'stage-07-review': { path: 'analysis/reviews/stage-07-pass-017.md' },
  'polish-backlog': { path: 'analysis/stages/stage-06/accepted-findings.json', note: 'XPlanner used this earlier equivalent to record accepted prototype findings.' },
  'prototype-approval': { path: 'analysis/prototyping/ui-ux-approval.md' },
  'nfr-workbook': { path: 'analysis/architecture/architecture-nfr-decision-register.xlsx' },
  'nfr-owner-review': { path: 'analysis/architecture/architecture-nfr-owner-review.md' },
  'architecture-record': { path: 'analysis/architecture/architecture.md' },
  'architecture-sections': { path: 'analysis/architecture/sections/00-foundation.md', note: 'Foundation is one completed example from the architecture chapter set.' },
  'architecture-drawio': { path: 'analysis/architecture/architecture.drawio' },
  adrs: { path: 'analysis/architecture/adr/001-modular-monolith.md', note: 'One real ADR from the seven-record XPlanner decision set.' },
  'nfr-manifest': { path: 'analysis/architecture/architecture-nfr-manifest.json' },
  'stage-10-review': { path: 'analysis/reviews/stage-10-pass-011.md' },
  'architecture-verdict': { path: 'analysis/stages/stage-11/architecture-owner-verdict-001.md', note: 'Source-bound historical reconstruction of Foundation owner acceptance, not a new human decision or current transition evidence.' },
  'architecture-closure': { path: 'analysis/stages/stage-12/architecture-closure-001.md', note: 'Historical reconstruction: links actual XPlanner sources, but missing contemporary closure checks remain blocked. Not a passed Stage 12 report.' },
  'knowledge-bundle': { path: 'analysis/knowledge/bundle/index.md', note: 'XPlanner synthesis 001 contains eight source-linked draft concepts. It is populated project knowledge, with incomplete global approval and coverage stated explicitly.' },
  'knowledge-manifest': { path: 'analysis/knowledge/knowledge-manifest.json', note: 'The real manifest pins nine bundle files and sixteen source files. The current Stage 11 owner verdict is missing, so it does not establish a passed knowledge gate.' },
  'stage-13-record': { path: 'analysis/stages/stage-13/knowledge-record.md', note: 'The real synthesis record lists eight concepts, source discrepancies, integrity checks and the blocked global knowledge gate. No Stage 14 approval is claimed.' },
  'stage-14-review': { path: 'analysis/stages/waivers/pre-sdd-knowledge-029-iteration-accuracy-report.md', note: 'XPlanner did not create an exact Stage 14 report for this waived slice; the linked decision is the honest project evidence.' },
  'sdd-spec': { path: 'specs/029-iteration-accuracy-report/spec.md' },
  'sdd-plan': { path: 'specs/029-iteration-accuracy-report/plan.md' },
  'sdd-tasks': { path: 'specs/029-iteration-accuracy-report/tasks.md' },
  traceability: { path: 'specs/traceability.md' },
  'target-inventory': { path: 'analysis/inventories/target-surface-inventory.json' },
  'stage-15-record': { path: 'analysis/stages/stage-15/029-iteration-accuracy-report/sdd-record.md', note: 'Reconstructed from slice 029 source records on 2026-09-10. It records design coverage and unresolved handoff gaps, not a historical Stage 16 pass or a new implementation authorization.' },
  'stage-16-review': { path: 'analysis/reviews/stage-16-pass-074.md' },
  implementation: { path: 'src/XPlanner2.Application/Reporting/IterationStatisticsService.cs' },
  tests: { path: 'tests/XPlanner2.UnitTests/IterationStatisticsServiceTests.cs' },
  migrations: { path: 'src/XPlanner2.Infrastructure/Persistence/Migrations/20260818220709_IterationBackbone.cs' },
  'candidate-pr': { label: 'XPlanner pull request #24', url: 'https://github.com/olsys-ltd/xplanner2/pull/24' },
  'delivery-record': { path: 'analysis/stages/stage-18/iteration-statistics-delivery.md' },
  'journey-evidence': { path: 'analysis/stages/stage-18/evidence/iteration-statistics-delivery-63b0787c7f32664189d61234807a48637a0cacdf-831eeb9e288c-playwright.json' },
  'stage-19-review': { note: 'XPlanner has not yet produced an exact Stage 19 acceptance report under the current canonical process.' },
  'owner-walkthrough': { note: 'XPlanner has not yet produced an owner walkthrough record under the current canonical process.' },
};

const artifactPractice = {
  'feature-dependencies': {
    usage: 'Created at Stage 9 and refined at Stage 15; independently checked at Stages 10/16. Stages 11-14 and 17-19 read it. Stage 19 full graph is Phase B only. SDD binds its node digest; completion follows confirmed completion edges transitively.',
    example: 'Illustrative: an effort report needs an agreed time-entry read contract for design, then working time-entry delivery for completion. These are distinct links. Missing review or candidate links do not mean ready.',
  },
  'ui-design-system': {"usage":"Stage 5 drafts the foundation; Stage 6 updates the catalogue while drawing and declares used variants per screen. Stage 7 checks actual exports against it, Stage 8 approves the combined manifest. Stages 9 and 13-19 consume relevant pinned UI sources read-only; Stage 19 full sources are Phase B only. Required only for visual scope.","example":"Illustrative: task editing and story editing both use input.date with the same focus/error behavior. Stage 15 names that variant; Stage 17 implements one shared date control rather than two guessed versions."},
  'ui-design-tokens': {"usage":"The Stage 5 agent prepares values and records the owner-approved foundation hash in ui-ux-decision.md. Stage 6 may add within-foundation extensions. The manifest pins the entire file for Stages 7-8 and downstream UI work. audit:prototype checks types, aliases and pins; rendered checks verify actual use.","example":"Illustrative: button.primary-background aliases color.action. A changed global color cannot be hidden by refreshing the file hash: the Stage 5 foundation pin changes and requires a new owner decision."},
  'error-prevention': {
    usage: 'Shared at every stage: read applicable checks before work, self-check before handoff and after fixes, and evaluate confirmed lessons after each control pass. Stages 2 and 19 read learned checks only in Phase B. Review findings explicitly link F-NNN/B-NNN to CHK-NNN, the observed discrepancy and required recheck; the author retains these IDs in the correction record. The coordinator maintains the table; the owner may prune it.',
    example: 'A confirmed missing navigation path becomes a reusable check of navigation coverage across applicable screens, roles and journeys, not a task to repair one menu. Search for an equivalent row before adding it.',
  },
  "owner-waiver": {"usage":"The active agent prepares it only for a permitted fallback at Stages 3, 5, 6, 9 or 13/15. The human owner decides; later agents consume the exact exception and its residual obligations.","example":"An owner authorizes one pre-SDD slice despite incomplete knowledge; the exact scope and required later control remain explicit."},
  "owner-walkthrough-decline": {"usage":"At final Stage 19 PM creates this alternative only if the owner declines the optional hands-on walkthrough. It records exact project scope, identity, date, rationale and the status decision ID. QA remains read-only.","example":"The owner relies on the linked independent acceptance evidence and explicitly declines another personal run; final acceptance is still recorded separately."},
  'agent-instructions': {
    usage: 'The agent harness reads this file at the start of every session. It routes the agent into MIGRATION.md before any project action is taken.',
    example: 'A coding request arrives at Stage 15, so AGENTS.md makes the agent read the active checkpoint and stop instead of writing code early.',
  },
  'migration-entry': {
    usage: 'Every agent reads it first in every session. It loads the authority order and current status, states what work is permitted now, enforces stop and transition rules, and routes the agent to the applicable methodology section.',
    example: 'A fresh agent sees Stage 7 in migration_status.yaml and stops before coding. MIGRATION.md routes it to the Stage 7 review contract; the methodology then explains how that review is performed.',
  },
  methodology: {
    usage: 'After status selects the current stage, the agent reads that stage here before planning or changing status. It defines the stage inputs, work, actors, outputs, exit gate and return path; it does not choose which stage is active.',
    example: 'After a Stage 10 finding, the methodology says which evidence returns to Stage 9 and what must be corrected before control repeats. MIGRATION.md only routed the session to this procedure.',
  },
  constitution: {
    usage: 'The Bootstrap agent prepares the draft and records the human owner ratification; later amendments also require explicit owner decisions. Every agent obeys these invariants. MIGRATION.md owns reading and routing, process-contract.md owns shared boundaries, and the methodology and domain guides own execution details.',
    example: 'All tests pass, but the proposed change still requires the owner decision. The agent may present the evidence and request approval; it cannot treat technical success as human consent. The rule remains the same if the workflow is renumbered.',
  },
  status: {
    usage: 'Standing input and updated output of every Stage 1-19. PM maintains the same file from specialist evidence after a durable transition, return, gate result, blocker or owner decision, never for polling or each internal action. Blind reviewers receive neutral routing in Phase A and full status in Phase B.',
    example: 'QA returns the immutable Stage 7 report. PM validates its scope and records the report path and permitted transition to Stage 8; QA does not edit status. The next assigned UX session reads the checkpoint before work.',
  },
  'project-contract': {
    usage: 'Bootstrap records project paths here. Build and test commands must exist before Stage 17, while deploy, smoke, journey and rollback commands must exist before Stage 18.',
    example: 'Stage 17 runs the exact dotnet test command and working directory declared here instead of guessing from the repository layout.',
  },
  'environment-contract': {
    usage: 'Generated from the public-safe template during Bootstrap, with no configured remote environment. Before every remote operation, record owner-approved settings and pass audit:environment -- --require-configured. Deployment tooling reads the host, identity, root and endpoint only here.',
    example: 'A new public project passes Bootstrap with an empty environment map, but remote:check refuses to connect. After approved setup, a host-key mismatch still blocks delivery.',
  },
  'bootstrap-gate-report': {
    usage: 'The active Bootstrap agent fills this fixed report with exact commands, runtime versions, outcomes and corrections. Summary counts must match the evidence rows. Record failures immediately in status with the report in blockers[].evidence; do not wait for correction approval. A real authorized transition later cites it as gate_evidence.',
    example: 'XPlanner recorded the Node and PowerShell versions, every Bootstrap command and result, and the failed methodology-link check plus its correction before the owner-authorized transition to Stage 1.',
  },
  'recon-record': {
    usage: 'The primary agent fills it at Stage 1 while inspecting the legacy source and runtime boundary. Stages 2 and 3 use it to detect missed territory.',
    example: 'The record lists the login module, LDAP dependency, nightly job and the environment needed to run each one.',
  },
  'parity-map': {
    usage: 'Created empty at Bootstrap, populated at Stage 1 and updated through acceptance. Each observable behavior keeps its decision and evidence chain in one row.',
    example: 'A failed-login row links legacy evidence to its keep decision, wireframe state, SDD requirement, automated test and live result.',
  },
  'stage-02-review': {
    usage: 'The fresh independent agent assigned to Stage 2 first saves the Phase A inventory in the report or a durable linked attachment, with its snapshot identity and input-access sequence. Only then does Phase B open the filled map and reconnaissance and compare both directions against the source. The completed report is immutable; no duplicate canonical Stage 1 files are created.',
    example: 'Illustrative: A-007 independently identifies a read-only restriction. Phase B links it to a map row that omits the restriction; C-012 records the mismatch and F-001 returns the correction to Stage 1. A mistaken reviewer interpretation is corrected separately in Phase B.',
  },
  'stage-03-walkthrough': {
    usage: 'Created while exercising the running legacy system with real roles. It records what was observed live and what remained inaccessible.',
    example: 'The agent signs in as a project member, performs task editing and records that the observed permission state matches two parity rows.',
  },
  'stage-04-revision': {
    usage: 'Used when discovery exposes contradictory, obsolete or unwanted behavior. The agent records the business owner\'s explicit keep, change or defer decisions before prototyping.',
    example: 'The owner defers the legacy wiki workflow because that logic should not move into the replacement.',
  },
  'prototype-decision': {
    usage: 'At Stage 5 the agent presents options, waits for the owner\'s choice, then records the approved channels, application form and visual direction.',
    example: 'The owner selects a responsive web application with the approved palette, so Stage 6 may design desktop and mobile screens.',
  },
  'screen-normalization': {
    usage: 'Stage 6 fills screen-normalization.json from the reusable .example.json structure before drawing. For each parity row, row links to the workbook; classification says what it became; screen and surface_key identify its visual home; element names the exact state, action, overlay or navigation item; note explains why. audit:prototype consumes this record and screen-manifest.json pins its evidence hash; the explanatory _schema_help is excluded from that hash.',
    example: 'Row 42 can be classified as overlay on task-details with element "confirm deletion"; a nightly job is non-visual and therefore has no screen, surface_key or element. The opening _schema_help explains each field.',
  },
  wireframes: {
    usage: 'Produced at Stage 6 and inspected at Stages 7, 8, 15, 17 and 18. Includes separate component-sheet resources, which must not be misrepresented as business screens. They define the approved visible behavior for each role and meaningful state.',
    example: 'The task time-entry wireframe shows the duration field, description input, validation state and responsive layout used during implementation review.',
  },
  'screen-manifest': {
    usage: 'Created after drawing from the normalization plan and updated with every export. Version 4 also pins the shared UI catalogue, tokens and component-sheet resources; screen ui_variants name the used catalogue entries. Its normalization path and normalization_sha256 bind it back to screen-normalization.json; its screen entries prove which planned rows, roles, states, actions and files actually exist.',
    example: 'Normalization assigns row 42 to the task-details confirmation overlay. The manifest then lists row 42 under task-details, names the overlay and roles, hashes the exported HTML, and pins the normalization evidence hash.',
  },
  'stage-07-review': {
    usage: 'At Stage 7, a fresh independent agent acting as the prototype reviewer creates it after checking coverage, navigation and unsupported invention against the map. A prototype defect returns to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.',
    example: 'The reviewer reports that the read-only role still sees an edit action, so Stage 6 must correct the wireframe.',
  },
  'polish-backlog': {
    usage: 'Conditional input at Stages 8 and 15-19; updated at Stages 15 and 17. The Stage 15 agent matches open finding IDs to the slice screens, shared components and functions and links applicable tasks in tasks.md. Stage 16 checks completeness. Stage 17 records corrections and independent closure evidence. Stage 18 checks the whole release scope before production; Stage 18 records regressions in the delivery report and returns them to Stage 17 for backlog correction in a new candidate; Stage 19 reconciles the backlog after blind acceptance. An applicable finding cannot be postponed by assigning it to a later slice. Verified closure is required before production release and acceptance. A missing referenced backlog blocks; no file is required when no cosmetic findings exist.',
    example: 'A small spacing inconsistency is assigned to the task-editing slice: its Stage 17 agent corrects it, and the reviewer checks the rendered result before production release. A missing permission state is not cosmetic and still blocks Stage 8.',
  },
  'prototype-approval': {
    usage: 'At Stage 8 the agent records the owner\'s explicit approval of the exact manifest, export hashes and closing review. Later UI work must use this pinned version.',
    example: 'The owner approves export set v12, allowing Stage 15 to cite those screens and Stage 17 to compare the built UI against them.',
  },
  'nfr-workbook': {
    usage: 'Stage 9 uses the workbook to turn legacy facts and client answers into measurable NFRs, integration contracts and technology decisions.',
    example: 'The client confirms 50 concurrent users, which becomes a measurable capacity requirement and informs the deployment decision.',
  },
  'nfr-owner-review': {
    usage: 'After the Stage 9 walkthrough, the architecture agent records the owner\'s explicit decisions in this review and refreshes it after every material workbook change. Agents and audits use it to distinguish content merely present in Excel from content confirmed by the owner; a hash mismatch blocks downstream reliance.',
    example: 'The owner approves local login plus SSO readiness. A later security discussion changes the SSO row, so the new Excel hash fails the audit until a dated Owner amendment records the owner\'s decision, updates the review hash and verdict, and repins architecture-nfr-manifest.json. Git retains the previous reviewed snapshot.',
  },
  'architecture-record': {
    usage: 'Written at Stage 9 as the main target-system record and navigation point. SDD authors use it after owner approval to constrain implementation.',
    example: 'The record explains the modular monolith boundary and links readers to identity, data and deployment chapters plus their ADRs.',
  },
  'architecture-sections': {
    usage: 'Created when a concern needs more detail than architecture.md can carry. Each chapter stays linked to the applicable NFRs and decisions.',
    example: 'The identity chapter describes session boundaries, CSRF protection and the external SSO integration point used by later specifications.',
  },
  'architecture-drawio': {
    usage: 'Used during Stage 9 collaboration and the Stage 11 owner walkthrough to inspect boundaries, dependencies and deployment visually.',
    example: 'The architecture agent traces a browser request through the web application, database and integration adapter, then presents that boundary to the owner for a decision.',
  },
  adrs: {
    usage: 'At Stage 9, the architecture agent writes a new ADR whenever a consequential choice has alternatives or lasting trade-offs; the owner confirms the decision. Plans cite the applicable accepted ADRs.',
    example: 'ADR-001 records why the team chose a modular monolith, which alternatives were rejected and which NFRs the choice satisfies.',
  },
  'nfr-manifest': {
    usage: 'The architecture agent creates it at Stage 9; changes require governed architecture review and approval. Stages 15-17 consume it read-only, recording NFR-to-SDD/test links and executed evidence in specs/traceability.md and slice records.',
    example: 'The availability NFR points to its architecture section and ADR; Stage 15 links the implementing requirement and planned test in specs/traceability.md, leaving the approved manifest unchanged.',
  },
  'stage-10-review': {
    usage: 'At Stage 10, a fresh independent agent acting as the architecture reviewer writes it after challenging the exact Stage 9 package. An architecture defect returns to Stage 9, a UI-structure defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.',
    example: 'The reviewer detects an integration with no timeout or failure policy and returns that concern to Stage 9.',
  },
  'architecture-verdict': {
    headline: 'What did the owner decide, and which exact architecture and items does that decision cover?',
    usage: 'Stage 11 records the human decision in a new numbered immutable file. Stage 12 reads the exact record selected in status. Re-entry requires the previous negative closure and correction evidence; the owner decides again.',
    example: 'The owner approves the corrected Foundation set; its verdict retains the earlier engineering-quality item ID and links the fresh Stage 10 report.',
  },
  'architecture-closure': {
    headline: 'Which remarks are demonstrably closed, what remains unverified, and where must work return?',
    usage: 'The responsible Stage 12 agent creates a numbered report for every attempt. The closure gate checks current bindings, item coverage, counts and passed result. A negative report follows the classified return; Stages 9-11 read it before the next owner decision.',
    example: 'A required retry policy is still absent: mark the item failed, cite the exact section, return to 9, then repeat fresh 10, owner review 11 and closure 12. The next report keeps the same item ID.',
  },
  'knowledge-bundle': {
    usage: 'Stage 13 converts approved architecture into Google Cloud-published, vendor-neutral OKF v0.2: small Markdown concepts with YAML frontmatter that design agents can retrieve without rereading the entire package.',
    example: 'A session-management concept states the approved rule, cites the identity chapter and lists the acceptance condition used by an SDD.',
  },
  'knowledge-manifest': {
    usage: 'Created with the bundle and updated whenever a concept or source changes. The knowledge audit verifies completeness, provenance and hashes.',
    example: 'The manifest binds the session concept to the exact architecture revision, so a later source edit makes the concept visibly stale.',
  },
  'stage-13-record': {
    usage: 'Written after synthesis to record the source set, generated concepts, exclusions and the result of the knowledge audit.',
    example: 'XPlanner synthesis 001 records eight draft concepts, sixteen pinned sources, passing integrity checks and a blocked global gate because the current Stage 11 owner verdict is missing.',
  },
  'stage-14-review': {
    usage: 'At Stage 14, a fresh independent agent acting as the knowledge reviewer compares the bundle with the approved architecture and writes an immutable verdict before SDD begins. A knowledge defect returns to Stage 13, an architecture defect to Stage 9, a prototype defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.',
    example: 'The reviewer finds a concept that claims an unsupported retry limit and returns the bundle to Stage 13.',
  },
  'sdd-spec': {
    usage: 'Stage 15 writes one spec for a bounded slice. It defines behavior, acceptance criteria, edge cases and approved assumptions without prescribing code.',
    example: 'The task-time spec requires decimal durations, a description and role-based access, each linked to its parity rows and NFRs.',
  },
  'sdd-plan': {
    usage: 'Created after the spec to explain how the slice fits the approved architecture, data model, interfaces, tests and rollout constraints.',
    example: 'The plan assigns time-entry validation to the application layer and cites the accepted identity and persistence ADRs.',
  },
  'sdd-tasks': {
    usage: 'Generated from the approved spec and plan as the ordered implementation checklist. Stage 17 closes tasks only with verifiable evidence.',
    example: 'Separate tasks add decimal parsing, persistence, browser coverage and documentation, with dependencies stated in execution order.',
  },
  traceability: {
    usage: 'Stage 15 links each slice to spec, plan, tasks and planned checks in Slice Verification Index; Stage 16 independently checks requirement-to-check coverage. Stages 17-19 link actual execution and deployed/acceptance records with checked versions, observations and gaps. audit:sdd validates the index file links and planned/missing/recorded states; completion mode requires recorded evidence links. recorded means observations exist, not passed. Independent reviewers inspect test outcomes and coverage; existing delivery gates still apply.',
    example: 'For XPlanner 029, the delivery contract assigns rows 260-263; prototype coverage names iteration-accuracy and inherited screens; legacy coverage maps the rows to FR-2901 through FR-2915. Follow those references to the actual spec and evidence; the index alone does not certify the report.',
  },
  'target-inventory': {
    usage: 'The Stage 15 agent declares planned destinations and roles; the independent Stage 16 agent checks their coverage against SDD. Stage 17 adds real code and test references. Stages 18-19 reconcile delivery and live behavior, with Stage 18 recording discrepancies in its delivery report; inventory corrections return to Stage 15/17 and a new candidate. audit:target reads this JSON; audit:sdd does not. Declared implemented status is not independent acceptance.',
    example: 'XPlanner person-view declares /people/:id for AuthenticatedUser. Its useful action shows the selected person dashboard; actions.sdd names the requirements, actions.code points to the implementation and actions.tests identifies the exact browser test. Merely opening a page titled Person would not satisfy the action.',
  },
  'stage-15-record': {
    usage: 'The Stage 15 design agent prepares this handoff from the named template as the SDD is assembled, including blocked or incomplete packages. The Stage 16 reviewer checks its source bindings, coverage, assumptions and gaps against the actual spec, plan and tasks. audit:sdd checks the package, not this report; only independent review and the required owner decision can authorize implementation.',
    example: 'The reconstructed XPlanner 029 record links rows 260-263 to requirements and tasks, cites the owner decision and bounded waivers, and exposes conflicting prototype versions and delta/expanded wording before a fresh review. Historical delivery is not re-approved.',
  },
  'stage-16-review': {
    usage: 'At Stage 16, a fresh independent agent acting as the SDD reviewer writes it after checking completeness, scope, testability and upstream alignment. The owner then decides on disclosed assumptions. An SDD defect returns to Stage 15, a knowledge defect to Stage 13, an architecture defect to Stage 9, a prototype defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.',
    example: 'The reviewer finds no test for a permission boundary, so the slice returns to Stage 15 before any code is written.',
  },
  implementation: {
    usage: 'Stage 17 changes target code only for approved tasks. Reviewers inspect it together with tests, migrations and updated traceability.',
    example: 'IterationStatisticsService implements the approved report calculation and contains no unrelated project-management changes.',
  },
  tests: {
    usage: 'Written with the implementation and run through the project contract. They prove functional behavior and applicable measurable NFRs before merge.',
    example: 'A unit test covers decimal duration totals while a browser test proves that a member can record 2.5 hours with a description.',
  },
  migrations: {
    usage: 'Added at Stage 17 when schema or stored data must change. The candidate includes order, compatibility and recovery considerations.',
    example: 'A versioned migration creates the iteration backbone tables, and the delivery record identifies how to reverse or restore the change.',
  },
  'candidate-pr': {
    usage: 'The owner reviews and merges this exact Stage 17 package after required checks and independent review pass. Stage 18 deploys its immutable revision.',
    example: 'PR 24 combines the report service, its tests and synchronized evidence, then supplies the commit SHA used by deployment.',
  },
  'delivery-record': {
    usage: 'The Stage 18 delivery agent records deployment, recovery readiness, smoke, raw journey and visual results, then completes Live Reconciliation in this same report. The agent discovers actual scope, compares it with the parity map, SDD, approved prototype and inventory, reuses applicable observations and investigates uncovered behavior. Missing required coverage blocks closure. audit:delivery validates the required reconciliation structure and bindings; the agent and independent acceptance reviewer check the meaning of evidence. No separate live-revision report is created.',
    example: 'Illustrative: the browser journey proves an editor can save hours. During reconciliation the delivery agent cites that case without rerunning it, investigates an uncovered read-only action and records the discovered Edit-button defect. Delivery remains open until the defect and affected records are corrected. Historical XPlanner reports below retain their original scope and do not claim the new combined checks.',
  },
  'journey-evidence': {
    usage: 'The configured browser journey produces raw output and a hash-linked summary during Stage 18. Audits verify the raw report itself.',
    example: 'The journey signs in as Daniel, records 2.5 hours on a task, checks the daily total and signs out.',
  },
  'stage-19-review': {
    usage: 'At Stage 19, a fresh independent third-party agent exercises the scope using expectation-only extracts without implementation status, destination notes, prior test results or findings. The agent saves observations before Phase B opens full originals, verifies extract completeness and reconciles evidence. A clean report is required before owner acceptance. An implementation defect returns to Stage 17, an SDD defect to Stage 15, an architecture defect to Stage 9, and a parity-map defect to Stage 1.',
    example: 'The reviewer repeats the task-time journey for member and read-only roles and records a clean verdict against the deployed SHA.',
  },
  'owner-walkthrough': {
    usage: 'When the owner performs a hands-on final walkthrough, PM records the observed journeys and findings. If the owner declines, PM creates the explicit decline record and links that actual decision from status. QA supplies its independent report without editing shared status or recording human approval.',
    example: 'The owner verifies task editing and reporting on the demo stand, then signs the walkthrough and final slice acceptance.',
  },
};

const artifactRelationships = {
  'delivery-record': {
    title: 'Rollback readiness belongs inside this report',
    text: 'The Stage 18 agent records the recovery strategy, exact release and environment, prerequisites, performed check, expected and observed outcome, evidence and limitations in Rollback Readiness. No separate rollback artifact is required. audit:delivery checks the record structure, bindings and evidence presence/hash, not the truth of the observations, and never runs rollback. A readiness check is not an exercised recovery. The linked Foundation example documents an older rehearsal for 23e0c3abf9fb, not readiness of later releases.',
    path: 'https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-18/foundation-delivery.md#operational-rehearsal',
    linkLabel: 'Historical Foundation recovery rehearsal',
  },
  traceability: {
    title: 'Read one slice, not the whole index',
    text: 'Start with Parity Map Delivery Contracts for behavior rows, slice and owner authority. Open Slice Verification Index for direct SDD, verification-plan and execution-record links. The detailed requirement -> concrete test/procedure -> observed result -> checked revision mapping lives in the slice record, not duplicated here. planned means no run claimed; missing means results are not linked; recorded means observations exist, not passed. Prototype and NFR sections explain approved design and criteria, not proof of completion. Only when upgrading old analysis/prototyping/screen-manifest.json versions 1/2, Imported Legacy References preserves original requirement/test identifiers and their sources in this same file; agents reconcile them at Stages 15/17 before treating them as coverage.',
  },
  'target-inventory': {
    title: 'How to read this JSON',
    text: 'Start with surfaces: destination and roles say where and for whom; actions describe the useful result; sdd, code and tests point to its basis and evidence. status and visibility distinguish planned gaps from declared implementation. adapters supplies comparison observations, while marker_scans searches selected source folders for unfinished content. Neither a reference nor an implemented label proves that a test passed.',
    path: 'analysis/inventories/README.md',
    linkLabel: 'Field-by-field guide and worked example',
  },
  'bootstrap-gate-report': {
    title: 'Relationship with migration_status.yaml',
    text: 'This report records actual checks and remaining failures. Update compact gate states and blockers immediately; a blocker links the report through blockers[].evidence. Only a real authorized transition uses gate_evidence. Never invent a transition merely to attach this report or infer approval from passing checks.',
  },
  'screen-normalization': {
    title: 'Relationship with screen-manifest.json',
    text: 'This file is the plan written before drawing: every parity row is assigned to a visual surface, an exact element, or a non-visual disposition. screen-manifest.json is produced after drawing, references this file through its normalization field, and pins its evidence hash in normalization_sha256.',
  },
  'screen-manifest': {
    title: 'Relationship with screen-normalization.json',
    text: 'screen-normalization.json is the row-by-row plan written first. This manifest is the evidence of what was actually drawn: it uses the same screen ids and surface keys, proves row and role coverage, records export hashes, and pins the normalization evidence hash so the plan cannot change unnoticed.',
  },
};

const artifactProjectOutputs = {
  'feature-dependencies': 'The coordinator instantiates the example using Stage 9 proposals and actual source pins. Stage 15 refines affected dependencies. Existing numbered independent reports record scope digests; the coordinator links them after review. Historical reconstruction remains explicitly unreviewed.',
  'ui-design-system': "The Stage 5 agent creates this fixed file from the template; Stage 6 refines scope-needed components within the chosen foundation. The completed kit and previews are pinned by screen-manifest.json and approved at Stage 8. Later changes repeat affected controls.",
  'ui-design-tokens': "Stage 5 instantiates the example and replaces illustrative choices with project decisions. Stage 6 extends it without shadowing foundation names. All downstream agents read the exact approved file; generated code is not a second source of design values.",
  'error-prevention': 'Bootstrap creates one empty table. The coordinator adds or refines confirmed generalized checks throughout the process after semantic deduplication; the owner may prune obsolete rows. Existing project checklists are preserved. Review reports and self-check outcomes stay in their own records.',
  "owner-waiver": "For a permitted fallback, the active-stage agent uses the named gate and exact scope for GATE-SCOPE; the human authority decides whether the recorded exception applies.",
  "owner-walkthrough-decline": "At final Stage 19 PM records the owner explicit decline in this fixed file only when that decision exists; it does not create an empty walkthrough or infer acceptance.",
  status: 'Bootstrap creates this checkpoint once. PM maintains it across Stages 1-19 from specialist evidence and actual authority. Reviewers return reports, not shared-state edits; stages do not create numbered copies.',
  'bootstrap-gate-report': 'The initializer creates this one fixed project report from the starter template with a pending assessment. The active Bootstrap agent fills it in place with real command evidence before Stage 1 and keeps it unnumbered, unduplicated and non-green while any required check is missing or unresolved.',
  'project-contract': 'Bootstrap creates this file from the starter template. The agent records the project identity, owner-confirmed source locations and real build, test and delivery commands before the stages that require them.',
  'recon-record': 'Bootstrap creates the empty record and Stage 1 fills it while inspecting the legacy system. Later discovery corrections update this same file rather than creating a new reconnaissance document.',
  'parity-map': 'Bootstrap creates the empty workbook. Stage 1 populates it, and later requirements, prototype, implementation and live-verification stages keep the same workbook rows synchronized through acceptance.',
  'stage-02-review': 'For every Stage 2 attempt, the fresh independent reconnaissance reviewer creates a new immutable report, assigns NNN the next three-digit review number and leaves every earlier pass or findings report unchanged.',
  'stage-03-walkthrough': 'For each live legacy walkthrough, the Stage 3 agent creates a separate evidence record and assigns NNN the next three-digit number so repeated sessions and different environments remain distinguishable.',
  'stage-04-revision': 'At Stage 4, the agent creates this single requirements-decision log and records each explicit owner ruling. Further decisions are appended to the same project record.',
  'prototype-decision': 'At Stage 5, the agent creates this fixed design-baseline file after the owner chooses application form and style. Later changes update it only through another recorded owner decision.',
  'screen-normalization': 'Stage 6 copies the example structure into this fixed JSON file before drawing. The agent fills and refines the row-to-screen plan in place until prototype approval.',
  'screen-manifest': 'Stage 6 creates this fixed JSON file after wireframes exist. Each export refresh updates the same manifest with current screen coverage, filenames and hashes.',
  'stage-07-review': 'For every Stage 7 attempt, the fresh independent prototype reviewer creates a new immutable report, assigns NNN the next review number and leaves prior findings and passes unchanged.',
  'polish-backlog': 'The Stage 7 independent agent creates this file only for owner-accepted minor visual follow-up after an otherwise clean review. The agent records the responsible agent, target slice, linked task, release deadline and closure evidence for each finding. The deadline is before the affected slice first reaches production, not an unspecified later date. If no eligible findings remain, no file is created.',
  'prototype-approval': 'At Stage 8, the agent creates this fixed record from the owner\'s explicit decision and pins the exact accepted prototype hashes. A changed prototype requires another owner decision and an update to this same governed record.',
  'nfr-workbook': 'Stage 9 copies the workbook template to this fixed path and fills it with legacy facts, client answers, NFRs and technology decisions. Later approved changes update the same workbook.',
  'nfr-owner-review': 'At Stage 9, the architecture agent creates one current owner-review file from the owner\'s explicit workbook decisions. Repeated walkthroughs add dated amendments while Git preserves earlier versions.',
  'architecture-record': 'Stage 9 creates this exact main architecture file from the template and fills it with the target design. Later approved corrections update the same file; it is never numbered or renamed.',
  'architecture-sections': 'Stage 9 creates the fixed 00-foundation chapter first. When another concern needs its own chapter, the architecture agent creates it from the NN-SLUG template with a two-digit order and stable topic name.',
  adrs: 'At Stage 9 the architecture agent creates one ADR when the NFR workbook or target-design work exposes a consequential choice. Following the ADR template fields, the agent assigns NNN the next decision number and SLUG a stable lowercase topic; the owner confirms the decision.',
  'nfr-manifest': 'Stage 9 creates this fixed manifest after the architecture files exist. Any governed architecture change updates the same manifest with the new document versions and hashes.',
  'stage-10-review': 'For every Stage 10 attempt, the fresh independent architecture reviewer creates a new immutable report, assigns NNN the next review number and leaves every earlier verdict unchanged.',
  'architecture-verdict': 'The Stage 11 agent creates a new numbered immutable record for each actual human decision. Status selects its exact path; later checks do not overwrite it.',
  'architecture-closure': 'The responsible Stage 12 agent creates a separate numbered immutable report for every passed, failed or blocked attempt. Status selects it explicitly. Its number is independent of the owner-verdict number.',
  'knowledge-manifest': 'Stage 13 creates this fixed manifest after synthesizing the OKF bundle. Regenerating approved knowledge updates the same index and its source hashes.',
  'stage-13-record': 'Stage 13 creates this fixed execution record for the current knowledge synthesis. It is updated in place until the knowledge gate closes.',
  'stage-14-review': 'For every Stage 14 attempt, the fresh independent knowledge reviewer creates a new immutable report, assigns NNN the next review number and retains all previous outcomes.',
  'sdd-spec': 'Stage 15 creates one slice folder by replacing NNN with the slice number and SLUG with its stable name, then writes spec.md inside it. The basename spec.md stays fixed within that slice.',
  'sdd-plan': 'Stage 15 writes plan.md in the same NNN-SLUG slice folder as spec.md. Only the folder tokens change; the plan filename itself is fixed.',
  'sdd-tasks': 'Stage 15 writes tasks.md in the same NNN-SLUG slice folder. The checklist is updated through implementation and delivery while its filename remains fixed.',
  traceability: 'The Stage 15 agent creates this project-wide index from the template, or completes it if a schema-migration agent already preserved old screen-manifest references here. Existing imports and mappings are retained. Every later slice, build and delivery update the same index rather than creating per-slice copies.',
  'target-inventory': 'Stage 15 creates this fixed project-wide inventory from the JSON example. Design and implementation agents update the catalogue before candidate review. Stage 18 checks it read-only and records discrepancies for the owning return stage.',
  'stage-15-record': 'Stage 15 creates an sdd-record.md for the active slice. When several slices coexist, the Stage 15 agent places the fixed basename in that slice scope directory instead of inventing a numbered filename.',
  'stage-16-review': 'For every Stage 16 attempt, the fresh independent SDD reviewer creates a new immutable report and assigns NNN the next review number. A returned slice receives a later report after correction.',
  'delivery-record': 'For each Stage 18 deployment, the deployment agent creates a separate immutable record and assigns NNN the next delivery number so every deployed revision keeps its own proof.',
  'stage-19-review': 'For every Stage 19 attempt, the fresh independent acceptance reviewer creates a new immutable report and assigns NNN the next review number so findings and the eventual clean pass remain visible.',
  'owner-walkthrough': 'At Stage 19, PM creates a numbered record for each hands-on owner walkthrough and assigns NNN the next walkthrough number. When the owner declines, PM records the governed decline instead of creating this file. The independent QA session does not edit owner decisions.',
};

const artifactHeadlines = {
  'feature-dependencies': 'What must be agreed or delivered before this slice, and what depends on it?',
  'ui-design-system': "Which shared element and variant should each screen use, and where can I see its states?",
  'ui-design-tokens': "Which exact colors, fonts, spacing and other visual values must every component reuse?",
  'error-prevention': 'Which recurring mistakes must we check for before handing over this work?',
  'migration-entry': 'What may I do in this session, and what must I read next?',
  methodology: 'How do I execute the selected stage and prove that it is complete?',
  constitution: 'Which rules must every agent and stage obey, and which decisions belong only to the owner?',
  'delivery-record': 'Did this release deploy safely, cover the required live behavior and agree with its governed records?',
  traceability: 'Which requirements are covered by design, implementation and tests, and where are the gaps?',
  'target-inventory': 'Which target screens, APIs and jobs must exist, for which roles, and what useful actions must they support?',
  'stage-15-record': 'Here is what I designed, which approved sources I used, which requirements I covered, where gaps remain, and what I am handing over for your review.',
  'owner-waiver': 'Did the owner authorize this specific exception, for what scope and under which conditions?',
  'polish-backlog': 'Which minor visual corrections may wait, who will fix them, and before which release?',
  'bootstrap-gate-report': 'What exactly was executed, and why is Bootstrap green?',
  'screen-normalization': 'Behavior → screen: What needs to be represented?',
  'screen-manifest': 'Finished screen → behavior: What was drawn, and which parity-map rows does it cover?',
  'nfr-workbook': 'What did we learn and decide?',
  'nfr-owner-review': 'Did the owner review and approve, defer or return this exact workbook version?',
  'architecture-record': 'What does the target system look like as a whole right now?',
  'architecture-sections': 'How does a specific part of the architecture work in detail?',
  adrs: 'Why was this decision made, which alternatives were rejected, and what follows from it?',
  'knowledge-bundle': 'What must the next agent know about the target system, and which sources support it?',
  'knowledge-manifest': 'Which exact versions of the knowledge files and their sources belong to this package?',
  'stage-13-record': 'What knowledge did the agent produce, from which exact sources, and what remains before independent control?',
};

const artifacts = [
  ['feature-dependencies', 'feature-dependencies.json', 'Feature prerequisite graph', 'One source-backed graph of bounded delivery slices, linked to parity rows and SDD. Arrows point from provider to consumer. Contract links constrain design; completion links expand delivery scope. It records conditions, evidence and unknowns, not a second requirements list or editable completion status.', 'analysis/feature-dependencies.example.json', 'migration'],
  ["ui-design-system","ui-design-system.md","Shared UI component catalogue","The readable UI kit: stable variant IDs, purposes, applicable states, property-to-token bindings, visual examples and usage/accessibility rules. It is developed alongside representative screens, not guessed afterwards from screenshots. The owner-approved foundation and exact completed baseline remain separate decisions.","analysis/prototyping/templates/ui-design-system-template.md","migration"],
  ["ui-design-tokens","ui-design-tokens.json","Exact shared visual values","The single dictionary of typed visual values and aliases. Its foundation records owner-selected choices; extensions serve new components without overriding that foundation. The catalogue refers to token names, and generated themes/styles derive from the approved values. It does not prove visual correctness by itself.","analysis/prototyping/templates/ui-design-tokens.example.json","migration"],
  ['error-prevention', 'error-prevention-checklist.md', 'Shared learned checks', 'One concise project table: Check, When applicable, Basis and How to check. It generalizes confirmed mistakes in requirements, UI, architecture, code or process. It is not a findings backlog, a new requirements source or proof that the stage passed.', 'analysis/error-prevention-checklist.template.md', 'generated'],
  ["owner-waiver","waivers/GATE-SCOPE.md","Conditional owner exception","An explicit, narrowly scoped exception allowed by a named process rule. It records the blocked activity, human authority, remaining risk, expiry and required later verification; it never marks skipped work as passed.","analysis/stages/templates/GATE-SCOPE-template.md","migration"],
  ["owner-walkthrough-decline","owner-walkthrough-decline.md","Optional walkthrough decline","The human owner explicitly declines the additional personal walkthrough. This decision is neither a completed walkthrough nor final acceptance; mandatory independent Stage 19 review and final sign-off remain required.","analysis/stages/templates/owner-walkthrough-decline-template.md","migration"],
  ['agent-instructions', 'AGENTS.md', 'Agent routing instructions', 'Repository-level instructions automatically read by the coding agent. They direct the agent to the migration playbook and prevent ordinary coding work from bypassing the governed process or its stop conditions.', 'AGENTS.md', 'starter'],
  ['migration-entry', 'MIGRATION.md', 'Session router and stop rules', 'Read first in every session. It answers what the agent may do now and what it must read next: authority order, current-stage routing, Bootstrap restrictions, legal transitions, command rules and mandatory stops. It does not contain the full execution procedure for every stage.', 'MIGRATION.md', 'starter'],
  ['methodology', 'migration_methodology.md', 'Stage-by-stage process specification', 'Read after migration_status.yaml identifies the active stage. It answers how to perform that stage and prove completion: required inputs, activities, actors, output artifacts, exit gate and return path. It does not select the current stage and is not the first-session router.', 'analysis/migration_methodology.md', 'starter'],
  ['constitution', 'constitution.md', 'Project invariants and owner authority', 'The project governance contract: honest evidence, independent review, human decision authority, security, controlled baseline changes and completion rules. It becomes the highest project authority only after explicit owner ratification. Principles do not depend on stage numbers, artifact filenames or vendors. References and historical decision fields bind them to the current process; they are not a second execution manual.', '.specify/memory/constitution.md', 'generated'],
  ['status', 'migration_status.yaml', 'Authoritative checkpoint', 'The single state ledger created during Bootstrap. It is a standing input and updated output of every Stage 1-19, recording the current stage, transitions, owner decisions, independent reviews, blockers and delivery status so a new agent can resume without guessing.', 'analysis/migration_status.template.yaml', 'generated'],
  ['project-contract', 'project.yaml', 'Project command contract', 'The project-specific operating contract created from the starter template. It identifies the project, pins the legacy and target locations, describes the technology/runtime context, and declares the build, test and audit commands that later stages must execute.', 'config/project.template.yaml', 'generated'],
  ['environment-contract', 'environments.yaml', 'Remote environment contract', 'Starts unconfigured and contains no copied credentials or demo endpoints. Before remote work it records owner-approved hosts, endpoints, unique deployment roots, host-key pins and credential rules. Bootstrap structural validity is not remote readiness or permission to deploy.', 'config/environments.yaml', 'generated'],
  ['bootstrap-gate-report', 'bootstrap-gate-report.md', 'Bootstrap execution evidence', 'The detailed project-specific evidence record for the Bootstrap readiness gate. It records the exact audit commands, runtime versions, results, failures and corrections that justify the gate outcome. migration_status.yaml remains the state authority and references this report rather than duplicating its command-level proof.', 'analysis/stages/templates/bootstrap-gate-report-template.md', 'generated'],
  ['recon-record', 'legacy_reconnaissance.md', 'Territory inventory', 'A structured inventory of the legacy territory: components, channels, technologies, entry points, data stores, integrations, runtime clues and inspection gaps. It explains what was examined and where evidence came from; detailed user behavior belongs in the parity map instead.', 'analysis/legacy_reconnaissance.template.md', 'generated'],
  ['parity-map', 'legacy_user_flows.xlsx', 'Migration behavior checklist', 'The central behavior checklist for the migration, with one observable legacy scenario per row. Each row links its source evidence to the keep/change/defer decision, prototype and SDD coverage, implementation proof and final acceptance status.', 'analysis/legacy_user_flows_template.xlsx', 'generated'],
  ['stage-02-review', 'stage-02-pass-NNN.md', 'Independent control record', 'A timestamped independent review of the initial reconnaissance. It records the reviewer\'s eligibility, blind inventory, later comparison with Stage 1, discovered omissions or conflicts, blocked scope and the exact clean or findings verdict.', 'analysis/reviews/stage-NN-pass-NNN-template.md', 'migration'],
  ['stage-03-walkthrough', 'stage-03/walkthrough-NNN.md', 'Live legacy evidence', 'Evidence from running and walking through the legacy application as a real user. It identifies the environment and roles used, actions performed, observed results, map corrections and any behavior that could not be verified live.', 'analysis/stages/templates/walkthrough-NNN-template.md', 'migration'],
  ['stage-04-revision', 'stage-04-requirements-revision.md', 'Business revision decisions', 'The durable decision log for challenged legacy behavior. For every contradiction, obsolete rule or questionable workflow it records whether to keep, change or not port it, together with rationale, participants and owner confirmation.', 'analysis/stages/templates/stage-04-requirements-revision-template.md', 'migration'],
  ['prototype-decision', 'prototyping/ui-ux-decision.md', 'Design baseline', 'The approved product and visual baseline used before wireframes are drawn. It captures the chosen channels, application form, design direction, palette, theme and accessibility expectations, including alternatives or waivers the owner rejected.', 'analysis/prototyping/templates/ui-ux-decision-template.md', 'migration'],
  ['screen-normalization', 'screen-normalization.json', 'Row-centric screen plan', 'The plan written before wireframes are drawn. It maps every applicable parity row to a surface, state, action, overlay, navigation item or non-visual behavior. The later screen-manifest.json references this record and pins its evidence hash.', 'analysis/prototyping/templates/screen-normalization.example.json', 'migration'],
  ['wireframes', 'wireframes/*', 'Exported visual catalogue', 'The complete repository-owned set of visual prototypes. It shows the approved screens, role variations, meaningful states, forms, dialogs and transitions that reviewers inspect before implementation begins.', 'analysis/prototyping/README.md', 'migration'],
  ['screen-manifest', 'screen-manifest.json', 'Screen-centric manifest', 'The evidence written after wireframes are drawn. Version 4 pins the common UI kit, token values and component previews as well as screen exports. It records what screens actually exist, which normalization rows and roles they cover, their states, actions, navigation and export hashes, and the evidence hash of screen-normalization.json.', 'analysis/prototyping/templates/screen-manifest.example.json', 'migration'],
  ['stage-07-review', 'stage-07-pass-NNN.md', 'Independent prototype verdict', 'An independent verdict on the prototype set. It checks that normalization is truthful, required roles and states are represented, navigation is coherent, map coverage is sufficient and the design has not invented unsupported behavior.', 'analysis/reviews/stage-NN-pass-NNN-template.md', 'migration'],
  ['polish-backlog', 'ui-polish-backlog.md', 'Scheduled minor visual corrections', 'A list of deferred minor visual corrections, such as small spacing or alignment inconsistencies that do not impair use. Each has an owner-approved scope and a concrete implementation slice; corrections must be verified before that slice reaches production. Missing behavior, security defects, broken navigation and unusable clipping never belong here.', 'analysis/prototyping/templates/ui-polish-backlog-template.md', 'migration'],
  ['prototype-approval', 'prototyping/ui-ux-approval.md', 'Pinned owner approval', 'The owner\'s signature under the exact prototype version reviewed at Stage 7. It pins the manifest, exported wireframes and closing review so later design and acceptance cannot silently switch to a different visual baseline.', 'analysis/prototyping/templates/ui-ux-approval-template.md', 'migration'],
  ['nfr-workbook', 'architecture-nfr-decision-register.xlsx', 'Architecture decision workbook', 'The working workbook that turns legacy facts and client answers into architecture requirements. Its sheets connect discovery evidence, unanswered questions, measurable NFRs, integrations, team capability, technology choices and the decisions required before the system diagram is accepted.', 'analysis/architecture/templates/architecture-nfr-decision-register-template.xlsx', 'migration'],
  ['nfr-owner-review', 'architecture-nfr-owner-review.md', 'Owner workbook walkthrough', 'The durable receipt for the owner\'s walkthrough of one exact NFR workbook version. It turns only the reviewed workbook hash into decisions that architecture may rely on. Any later Excel edit creates a new hash and makes this review stale, so changed rows remain proposals until the owner walks them again. The project keeps one current review file: dated Owner amendment entries provide readable change history, while Git preserves every prior version. After reapproval, update the workbook hash and verdict, then repin architecture-nfr-manifest.json without erasing earlier decisions.', 'analysis/architecture/templates/architecture-nfr-owner-review-template.md', 'migration'],
  ['architecture-record', 'architecture.md', 'Main target architecture record', 'The main normative description of the target architecture and its navigation hub. It summarizes system boundaries, components, data and integration direction, deployment shape and important constraints, while linking to detailed sections and ADRs.', 'analysis/architecture/templates/architecture-template.md', 'migration'],
  ['architecture-sections', 'architecture/sections/*.md', 'Focused architecture chapters', 'Focused chapters that explain individual architecture concerns in enough detail to design and build against them. Typical sections cover identity, data, integrations, operations, deployment and UI, and stay synchronized with the main architecture record.', 'analysis/architecture/templates/sections/00-foundation-template.md', 'migration'],
  ['architecture-drawio', 'architecture.drawio', 'Editable architecture view', 'The editable system diagram used to review the target architecture visually. It presents boundaries, components, dependencies, data movement and deployment context, while the Markdown records remain the normative source of detail.', 'analysis/architecture/README.md', 'migration'],
  ['adrs', 'architecture/adr/NNN-*.md', 'Architecture decisions', 'A separate Architecture Decision Record for each consequential choice. It preserves the problem context, selected option, rejected alternatives, trade-offs and affected NFRs so future changes do not have to rediscover why the decision was made.', 'analysis/architecture/templates/NNN-SLUG-template.md', 'migration'],
  ['nfr-manifest', 'architecture-nfr-manifest.json', 'Architecture hash manifest', 'The machine-checkable index of the approved architecture set. It links each NFR to its requirement or ADR and pins the exact workbook, records and diagram by SHA-256 so unnoticed document drift fails the audit.', 'analysis/architecture/templates/architecture-nfr-manifest.example.json', 'migration'],
  ['stage-10-review', 'stage-10-pass-NNN.md', 'Independent architecture verdict', 'An immutable independent verdict on the architecture package. It challenges NFR coverage, evidence, system boundaries, contracts and decision reasoning, and verifies that all reviewed files and hashes describe the same version.', 'analysis/reviews/stage-NN-pass-NNN-template.md', 'migration'],
  ['architecture-verdict', 'architecture-owner-verdict-NNN.md', 'Human architecture decision', 'The recorded human decision on an exact architecture set, with scope, evidence, predecessors and stable items for closure. It is produced at 11 and read at 12 and 13; closure is a separate report.', 'analysis/architecture/templates/architecture-owner-verdict-NNN-template.md', 'migration'],
  ['architecture-closure', 'architecture-closure-NNN.md', 'Responsible-agent closure report', 'A separate immutable result of Stage 12: criteria versus observed evidence, unchanged-set check, reconciled item counts and classified return. It never changes the human verdict or approved architecture. Stage 13 reads it with the owner verdict.', 'analysis/architecture/templates/architecture-closure-NNN-template.md', 'migration'],
  ['knowledge-bundle', 'knowledge/bundle/**', 'OKF v0.2 knowledge bundle', 'A compact, agent-friendly Open Knowledge Format (OKF) v0.2 explanation of how the approved target system is arranged and operates. OKF is an open, vendor-neutral format published by Google Cloud: Markdown concepts with YAML frontmatter. Each concept keeps a stable id and links back to an authoritative source instead of inventing new design.', 'analysis/knowledge/README.md', 'migration'],
  ['knowledge-manifest', 'knowledge-manifest.json', 'OKF provenance manifest', 'The provenance index for the OKF v0.2 bundle. It lists every synthesized concept, its source document and SHA-256 hash, allowing audits to detect missing, duplicated, stale or unsupported knowledge before SDD work uses it.', 'analysis/knowledge/templates/knowledge-manifest.example.json', 'migration'],
  ['stage-13-record', 'stage-13/knowledge-record.md', 'OKF synthesis record', 'The execution record for the Google Cloud-published, vendor-neutral OKF v0.2 synthesis. It identifies the exact architecture source set, lists the concepts produced, documents limitations or exclusions and records whether the Stage 13 knowledge gate passed.', 'analysis/stages/templates/knowledge-record-template.md', 'migration'],
  ['stage-14-review', 'stage-14-pass-NNN.md', 'Independent OKF verdict', 'An independent comparison of the OKF v0.2 bundle with the approved architecture. It verifies concept coverage and source hashes, and reports omissions, duplicates, stale links or rules that were introduced without authority.', 'analysis/reviews/stage-NN-pass-NNN-template.md', 'migration'],
  ['sdd-spec', 'specs/NNN-*/spec.md', 'Slice requirements', 'The requirements contract for one bounded implementation slice. It states user scenarios, functional requirements, acceptance criteria, edge cases and governed source links without prescribing code-level implementation.', '.specify/templates/spec-template.md', 'migration'],
  ['sdd-plan', 'specs/NNN-*/plan.md', 'Implementation design', 'The technical implementation plan for the approved slice. It translates requirements and architecture constraints into component, data, interface, testing and rollout decisions while keeping work inside the agreed scope.', '.specify/templates/plan-template.md', 'migration'],
  ['sdd-tasks', 'specs/NNN-*/tasks.md', 'Executable checklist', 'The dependency-ordered checklist used to implement the slice. Each task is concrete and verifiable, links back to the plan or requirement it closes, and makes unfinished or blocked work visible before coding is declared complete.', '.specify/templates/tasks-template.md', 'migration'],
  ['traceability', 'specs/traceability.md', 'Project-wide coverage and evidence index', 'One shared index for the entire migration: which slice covers each behavior or approved target requirement, which design and prototype apply, and where implementation and verification evidence can be found. It grows with the number of slices; read the relevant slice instead of the whole file. It is not another specification or a standalone verdict that everything works.', 'specs/traceability.template.md', 'migration'],
  ['target-inventory', 'target-surface-inventory.json', 'Target destinations and useful actions', 'A shared catalogue of entry points into the new system: screens, routes, API operations and jobs, their roles and useful actions. It connects each implemented action to SDD requirements, code and tests, so a reachable but empty page cannot stand in for migrated functionality. It complements the behavior-oriented parity map; it does not replace requirements or live acceptance.', 'analysis/inventories/target-surface-inventory.example.json', 'migration'],
  ['stage-15-record', 'stage-15/sdd-record.md', 'SDD preparation and handoff record', 'The Stage 15 design agent records the actual source approvals or bounded exceptions, links the specification, plan and tasks, and declares coverage, gaps and readiness for Stage 16. This is not an implementation self-review, an independent verdict or delivery evidence. The Stage 16 agent must verify this handoff against its sources; audit:sdd checks the SDD package but does not read this report.', 'analysis/stages/templates/sdd-record-template.md', 'migration'],
  ['stage-16-review', 'stage-16-pass-NNN.md', 'Independent SDD verdict', 'An independent verdict on the complete SDD package before implementation. It checks scope, consistency, testability, traceability, disclosed assumptions and alignment with approved requirements, prototype and architecture.', 'analysis/reviews/stage-NN-pass-NNN-template.md', 'migration'],
  ['implementation', 'source code', 'Target implementation', 'The target-system code produced for the approved slice. It should implement only the scoped tasks, respect architecture and NFR contracts, and remain reviewable together with its tests, migrations and updated evidence.', 'MIGRATION.md', 'project'],
  ['tests', 'tests and measurements', 'Executable evidence', 'Executable proof that the new behavior works as specified. Depending on the slice it includes unit, integration, contract and UI/E2E tests plus measurable NFR checks, all delivered with the code they validate.', 'MIGRATION.md', 'project'],
  ['migrations', 'data migrations', 'Schema and data evolution', 'Versioned database or data-conversion changes required by the slice. They are reviewed with the implementation, include a clear application order and account for rollback or recovery rather than being applied manually without evidence.', 'MIGRATION.md', 'project'],
  ['candidate-pr', 'PR + pinned revision', 'Delivery candidate', 'The complete delivery candidate containing code, tests, migrations and synchronized process evidence. Its immutable revision is independently reviewed, merged by the owner and then deployed unchanged at Stage 18.', 'MIGRATION.md', 'project'],
  ['delivery-record', 'stage-18/delivery-NNN.md', 'Delivery and live reconciliation', 'One immutable report for the exact deployed revision: deployment, recovery readiness and useful live checks, followed by coverage reconciliation against the map, SDD, prototype and inventory. The report records discrepancies and required return-stage corrections; it does not silently rewrite approved files. Prepared tests are not assumed to cover every behavior. Required unverified scope prevents clean delivery; independent acceptance remains separate.', 'analysis/stages/templates/delivery-NNN-template.md', 'migration'],
  ['journey-evidence', 'raw journey + summary', 'Content-addressed browser evidence', 'The raw browser-run output plus a human-readable summary of the tested journey. The summary pins the raw report hash and deployed revision, and identifies the role, actions and surfaces exercised so evidence cannot be silently rewritten.', 'analysis/stages/templates/delivery-NNN-template.md', 'migration'],
  ['stage-19-review', 'stage-19-pass-NNN.md', 'Independent acceptance verdict', 'The independent acceptance report for the deployed slice or final system. A reviewer from outside the implementation team verifies useful role-based journeys, required evidence and remaining findings before the owner signs acceptance.', 'analysis/stages/templates/stage-19-pass-NNN-template.md', 'migration'],
  ['owner-walkthrough', 'owner-walkthrough-NNN.md', 'Optional hands-on owner record', 'An optional record of the owner\'s own hands-on walkthrough of the delivered system. It captures roles, journeys, observations and findings; if the owner declines the walkthrough, that choice is recorded separately rather than silently assumed.', 'analysis/stages/templates/owner-walkthrough-NNN-template.md', 'migration'],
].map(([id, label, role, desc, sourcePath, lifecycle]) => ({
  id, label, role, desc, sourcePath, lifecycle,
  headline: artifactHeadlines[id] || artifactPractice[id]?.headline,
  relationship: artifactRelationships[id],
  projectOutput: artifactProjectOutputs[id],
  initialCreator: artifactResponsibilities[id]?.en.creator,
  responsibility: artifactResponsibilities[id],
  creationStageId: stages.find((stage) => stage.outputs.includes(id))?.id,
  outputPath: id === 'journey-evidence' ? undefined
    : templateOutputs.get(sourcePath)?.replace('stage-NN-', `stage-${id.match(/^stage-(\d+)/)?.[1] || 'NN'}-`),
  usage: artifactPractice[id]?.usage,
  example: artifactPractice[id]?.example,
  sourceExists: fs.existsSync(path.join(ROOT, sourcePath)),
  xplannerExample: xplannerExamples[id],
}));

for (const artifact of artifacts) {
  artifact.recordContract = Object.values(recordContracts).find(profile => profile.artifacts.includes(artifact.id));
  for (const locale of ['en', 'ru']) {
    for (const field of ['creator', 'maintainer', 'instructions']) {
      if (!artifact.responsibility?.[locale]?.[field]) throw new Error(`Artifact ${artifact.id} must explicitly name ${locale}.${field}`);
    }
  }
}

const gatePractice = {
  'dependency-audit': { usage: 'Run at Stages 9-19. Structural validity permits drafting; implementation handoff and completion require the selected reviewed scope. Stage 19 full evidence is Phase B only.', example: 'A cycle in mandatory completion prerequisites fails. A candidate link remains visible and prevents reviewed readiness; a historical import cannot be approved by changing a color.', sourcePath: 'analysis/tools/feature-dependencies.js' },
  'bootstrap-audits': {
    usage: 'Run after initialization and after approved Bootstrap maintenance. Record failed checks in the report and status immediately. Pre-existing documents are preserved: correcting an editable owner file needs scoped permission, not blanket normalization. All required checks must pass before the separately owner-authorized transition to Stage 1.',
    example: 'XPlanner ran the audit-toolkit tests, initializer self-test and status, project, environment, methodology and process-view audits; it recorded a failed methodology-link check and its correction before the final green result.',
    sourcePath: 'analysis/stages/templates/bootstrap-gate-report-template.md',
    xplannerPath: 'analysis/stages/bootstrap/bootstrap-gate-report.md',
  },
  'project-audit': {
    usage: 'Run during Bootstrap and whenever project paths, target platforms or command entries change. At Stages 17 and 18 it also enforces that the commands required by that stage are no longer null.',
    example: 'If commands.visual_parity is missing when a UI slice reaches Stage 17, audit:project fails before the agent can claim the candidate is build-ready.',
    sourcePath: 'analysis/tools/project-config-audit.js',
    xplannerPath: 'config/project.yaml',
  },
  'workbook-audit': {
    usage: 'Run after every parity-map change from Stage 1 through acceptance. It validates workbook structure, evidence links, decisions, row states, formulas and delivery/SDD coverage.',
    example: 'A row marked delivered without a target destination and SDD reference fails, even when the implementation itself exists.',
    sourcePath: 'analysis/tools/workbook-audit.js',
    xplannerPath: 'analysis/legacy_user_flows.xlsx',
  },
  'walkthrough-outcome': {
    usage: 'Close Stage 3 only after the runnable legacy system has been exercised by applicable roles and channels. Blocked scope needs an explicit owner-approved simulation or waiver decision.',
    example: 'XPlanner recorded desktop and operator observations; inaccessible production-only behavior remained named in stage-03-outcome.md instead of being silently treated as verified.',
    sourcePath: 'analysis/stages/templates/walkthrough-NNN-template.md',
    xplannerPath: 'analysis/stages/stage-03/stage-03-outcome.md',
  },
  'stage-05-owner-gate': {
    usage: 'The agent stops at Stage 5, presents application-form and visual-direction options, and waits for the owner to record the choice. No wireframe generation starts from an inferred preference.',
    example: 'The owner selects a responsive web application and the approved visual baseline in ui-ux-decision.md; that recorded choice becomes the input to Stage 6.',
    sourcePath: 'analysis/prototyping/templates/ui-ux-decision-template.md',
    xplannerPath: 'analysis/prototyping/ui-ux-decision.md',
  },
  'prototype-audit': {
    usage: 'Run while Stage 6 builds the prototype and again during Stage 7 control. It reconciles parity rows, normalization, manifest entries, exported wireframes and their hashes.',
    example: 'A background job classified as non-visual passes only with a coverage reason; a UI row with no screen, state or action mapping fails.',
    sourcePath: 'analysis/tools/prototype-audit.js',
    xplannerPath: 'analysis/prototyping/screen-normalization.json',
  },
  'prototype-approved-audit': {
    usage: 'Run after the Stage 8 owner decision and whenever approved prototype inputs are consumed later. It requires the approval to pin the exact closing review, manifest hash and export-set version.',
    example: 'Editing screen-manifest.json after approval changes its hash and immediately invalidates the gate until the corrected prototype is reviewed and approved again.',
    sourcePath: 'analysis/tools/prototype-audit.js',
    xplannerPath: 'analysis/prototyping/ui-ux-approval.md',
  },
  'architecture-audit': {
    usage: 'Run throughout Stages 9 and 10 while facts, client answers, NFRs, decisions, diagrams and ADRs are assembled. Passing means the evidence chain is complete enough for independent challenge.',
    example: 'A measurable availability NFR with no linked architecture section or ADR causes the audit to fail before owner review.',
    sourcePath: 'analysis/tools/architecture-audit.js',
    xplannerPath: 'analysis/architecture/architecture-nfr-manifest.json',
  },
  'architecture-approved-audit': {
    usage: 'Run after the owner reviews the architecture and again whenever downstream work depends on it. The owner record and every pinned architecture hash must describe the same approved set.',
    example: 'A changed ADR after owner sign-off makes the manifest or owner-review hash stale, so SDD work cannot rely on the modified decision silently.',
    sourcePath: 'analysis/tools/architecture-audit.js',
    xplannerPath: 'analysis/architecture/architecture-nfr-owner-review.md',
  },
  'architecture-closure-audit': {
    usage: 'Run to close Stage 12 and before the Stage 13 handoff. It includes the approved architecture gate and checks the current separate closure record.',
    example: 'A missing owner item, stale owner-record hash, mismatched scope, old stage entry or unresolved finding prevents closure.',
    sourcePath: 'analysis/tools/architecture-review-records.js',
    xplannerPath: 'analysis/stages/stage-12/architecture-closure-001.md',
  },
  'knowledge-audit': {
    usage: 'Run after Stage 13 synthesis and before SDD/review work consumes the OKF bundle. It checks declared concept metadata, links and unchanged source hashes; Stage 14 checks semantic fidelity and completeness.',
    example: 'A session-management concept that cites an old architecture hash fails instead of teaching the design agent a stale rule.',
    sourcePath: 'analysis/tools/knowledge-audit.js',
    xplannerPath: 'analysis/knowledge/README.md',
  },
  'sdd-audit': {
    usage: 'Run at Stages 15 to 17. The current command scans all numbered feature directories, validating spec, plan, tasks, traceability, assumptions, impact scope and applicable prototype bindings.',
    example: 'A decimal-duration requirement with no implementation task or test path blocks the slice before coding.',
    sourcePath: 'analysis/tools/sdd-audit.js',
    xplannerPath: 'specs/067-project-context-navigation-refinement/spec.md',
  },
  'stage-16-owner-gate': {
    usage: 'After an independent Stage 16 review, the agent shows the exact slice scope, exclusions and every disclosed assumption to the owner and waits for approval or correction.',
    example: 'If the SDD assumes that an administrator may bypass a restriction, the owner must explicitly approve or replace that rule before Stage 17.',
    sourcePath: '.specify/templates/spec-template.md',
    xplannerPath: 'analysis/migration_status.yaml',
  },
  'ci-gate': {
    usage: 'Run on the exact Stage 17 delivery candidate. The configured project command executes the stack-specific formatter, analyzers, build, tests, migration checks, coverage and architecture rules.',
    example: 'XPlanner build/ci.ps1 restores locked dependencies, formats, builds .NET and Angular, runs architecture, unit, integration and browser tests, and enforces changed-line coverage.',
    sourcePath: 'config/project.template.yaml',
    xplannerPath: 'build/ci.ps1',
  },
  'target-audit': {
    usage: 'Run from Stage 17 through acceptance against the declared target-surface inventory and deterministic observations. Every route, screen, role, API or job must expose a useful evidenced action.',
    example: 'An HTTP 200 page containing only a placeholder does not satisfy the declared task-time action and fails audit:target.',
    sourcePath: 'analysis/tools/target-surface-audit.js',
    xplannerPath: 'analysis/inventories/target-surface-inventory.json',
  },
  'ui-parity-audit': {
    usage: 'Run locally for every UI-impacting Stage 17 slice and repeat against the public Stage 18 revision. It uses the owner-approved wireframes and manifest as the expected source, never implementation screenshots.',
    example: 'XPlanner fails when a button has the right label but wrong typography, when a declared hover state is not exercised, or when a changed screen is absent from the parity test scope.',
    sourcePath: 'analysis/tools/ui-parity-audit.js',
    xplannerPath: 'build/ui-parity.ps1',
  },
  'environment-audit': {
    usage: 'Run structurally during Bootstrap. Before every remote operation use --require-configured; delivery and completion also reject an empty configuration. Configured environments validate identity, host pins, roots, endpoints and applicable credential policy without connecting.',
    example: 'An empty environment map passes Bootstrap but fails remote readiness. An expired embedded-key exception blocks access; initialization never extends it.',
    sourcePath: 'analysis/tools/environment-config-audit.js',
    xplannerPath: 'config/environments.yaml',
  },
  'delivery-audit': {
    usage: 'Run before Stage 18 closure against the immutable delivery record and exact deployed revision. It checks the governed connection, smoke evidence, real browser journey, deployed visual parity, rollback readiness and the required Live Reconciliation section.',
    example: 'A green health endpoint is insufficient when the XPlanner login form journey cannot reach and exercise the changed task-time screen.',
    sourcePath: 'analysis/tools/delivery-record-audit.js',
    xplannerPath: 'analysis/stages/stage-18/current-delivery-record.txt',
  },
  'sdd-complete-audit': {
    usage: 'Run after delivery for delivery.active_slice and transitive completion dependencies from the SDD-bound graph (or unchanged pre-policy declarations). Missing scope blocks. Unrelated future slices may remain planned; audit:sdd:complete checks all slices for final completion. Recorded links are not passed tests.',
    example: 'A delivered feature whose tasks.md still has an unchecked implementation task cannot be reconciled as complete.',
    sourcePath: 'analysis/tools/sdd-audit.js',
    xplannerPath: 'specs/067-project-context-navigation-refinement/tasks.md',
  },
  'all-audits': {
    usage: 'PM coordinates audit:stage19 for the exact delivered scope and receives the independent QA report. After full-system acceptance and explicit final owner authorization, PM records complete and runs audit:all to validate that completion. QA never edits shared status. Unrelated open slices do not imply a complete migration.',
    example: 'A slice can pass audit:stage19 while later slices remain open. audit:all stays unavailable until final completion is recorded and validates that full evidence chain.',
    sourcePath: 'analysis/tools/package.json',
    xplannerPath: 'analysis/tools/package.json',
  },
  'stage-19-owner-gate': {
    usage: 'After a clean independent Stage 19 report, the owner reviews delivered behavior, evidence, residual scope and findings, then explicitly accepts the slice, starts the next slice or returns work.',
    example: 'The reviewer can recommend acceptance, but only the owner decision recorded in migration_status.yaml can mark the XPlanner slice accepted.',
    sourcePath: 'analysis/stages/templates/stage-19-pass-NNN-template.md',
    xplannerPath: 'analysis/migration_status.yaml',
  },
};

const gates = [
  ['dependency-audit', 'audit:dependencies', 'Node.js script', 'Validates graph structure, pinned sources, parity scope, completion cycles and exact review digests. New/reopened SDD binds the node digest. The reviewer still checks meaning, completeness and conditions; graph validity is not permission to implement or release.'],
  ['bootstrap-audits', 'Bootstrap audits', 'Automated gate', 'The combined readiness check run before Stage 1. It exercises the starter tools and validates the status, project and environment contracts plus methodology and process-view consistency. The active Bootstrap agent records exact commands and outcomes in bootstrap-gate-report.md, and migration_status.yaml cites that report; green means the governed workspace is usable, not that legacy behavior has been discovered or approved.'],
  ['project-audit', 'audit:project', 'Node.js script', 'Validates that project.yaml is complete and internally consistent: project identity, legacy and target paths, working directories, runtime declarations and stage-specific command slots. It prevents an agent from running checks in the wrong repository or claiming readiness before required project commands are configured.'],
  ['workbook-audit', 'audit:workbook', 'Node.js script', 'Validates the structure and internal consistency of the parity workbook: required columns, identifiers, allowed states, evidence references, decisions and formulas. Passing proves that the map is mechanically usable and complete in shape; independent review and live walkthrough still determine whether its business meaning is true.'],
  ['walkthrough-outcome', 'Stage 3 outcome gate', 'Recorded evidence gate', 'Controls the exit from live legacy verification. It requires a walkthrough record with environment, roles, actions, observations and explicit residual unverified scope; when the legacy system cannot be exercised, only a recorded owner decision to simulate or waive the blocked part permits progression.'],
  ['stage-05-owner-gate', 'Stage 5 owner gate', 'Human decision', 'A mandatory human stop before wireframes are produced. The owner must select and record the application form, channels, visual direction and accessibility baseline, or explicitly waive a decision; the agent may prepare options but cannot choose the product experience on the owner\'s behalf.'],
  ['prototype-audit', 'audit:prototype', 'Node.js script', 'Reconciles the parity map with screen normalization, the screen manifest, owner decisions and the exported wireframe files and hashes. It detects missing mappings, unjustified screens, stale exports and structural drift, while Stage 7 remains responsible for judging semantic quality and usability.'],
  ['prototype-approved-audit', 'audit:prototype:approved', 'Node.js script + owner record', 'The final prototype gate after independent control and owner review. It reruns the structural prototype checks and requires ui-ux-approval.md to reference the exact closing review, manifest and export-set version, preventing coding from using wireframes different from those actually approved.'],
  ['architecture-audit', 'audit:architecture', 'Node.js script', 'Validates the architecture package as a connected evidence chain. It checks workbook completeness, measurable NFRs, NFR-to-ADR links, required records and diagrams, source provenance and synchronized hashes; passing confirms consistency, while Stage 10 independently challenges whether the decisions are sound.'],
  ['architecture-approved-audit', 'audit:architecture:approved', 'Node.js script + owner verdict', 'The owner-approved architecture checkpoint. It requires a green architecture audit and a valid review verdict pinned to the same workbook, Markdown records, ADRs, diagram and manifest, so later stages cannot rely on an unreviewed or silently modified architecture set.'],
  ['architecture-closure-audit', 'audit:architecture:closure', 'Node.js script', 'Checks that the exact current owner-approved architecture has a separate passed Stage 12 closure report, complete item coverage and no unresolved findings. It validates recorded integrity, not the truth of a claimed fix.'],
  ['knowledge-audit', 'audit:knowledge', 'Node.js script', 'Validates the knowledge manifest, bundle structure, concept metadata, links and exact source hashes. Detects stale or missing bindings; the independent Stage 14 reviewer checks whether the synthesis preserves the meaning and coverage of the approved sources.'],
  ['sdd-audit', 'audit:sdd', 'Node.js script', 'Checks required SDD files and sections, requirement/task references, traceability, assumption and impact policies, and applicable approved UI bindings. The Stage 16 reviewer separately checks the author handoff, requirement meaning and alignment with architecture, NFRs and target surfaces.'],
  ['stage-16-owner-gate', 'Stage 16 owner gate', 'Human decision', 'A mandatory human stop after the independent SDD review. The owner sees the exact slice scope, assumptions, exclusions and review findings and must approve or request correction; this prevents the agent from turning an interpretation or unresolved assumption into code without authority.'],
  ['ci-gate', 'Project CI', 'Executable build gate', 'The project\'s executable engineering quality gate for the delivery candidate. It runs the configured formatter, analyzers, build, tests, migrations, coverage and stack-specific architecture rules; passing proves the revision meets declared technical checks, not that live behavior or owner acceptance has occurred.'],
  ['target-audit', 'audit:target', 'Node.js script', 'Validates the target inventory, configured adapter observations, source/test references and placeholder markers. Declared useful actions must have traceable evidence; live Stages 18 and 19 establish that the role-specific behavior actually works.'],
  ['ui-parity-audit', 'audit:ui-parity', 'Node.js + browser checks', 'Compares implemented UI surfaces with the exact owner-approved wireframes and manifest. Browser checks verify required labels, geometry, styles, role variations, states and representative content, while recorded tolerances distinguish acceptable rendering differences from real visual or behavioral regressions.'],
  ['environment-audit', 'audit:environment', 'Node.js script', 'Separates structural Bootstrap validity from remote readiness. A new empty contract is valid only before remote use; --require-configured and delivery/completion require configured environments. Checks identity, host pins, roots, endpoints and applicable secret policy. Never grants access or renews approval.'],
  ['delivery-audit', 'audit:delivery', 'Node.js + live commands', 'Validates that the exact candidate revision is live and supported by delivery evidence. It checks public reachability, smoke evidence, real role-based journey, deployed visual parity, recovery readiness and the required live-reconciliation structure and bindings. A missing section or recorded unresolved coverage blocks Stage 18 closure; agents must still judge evidence meaning and completeness before independent acceptance.'],
  ['sdd-complete-audit', 'audit:sdd:slice', 'Node.js script', 'Closes the SDD and parity obligations after delivery. Every row included in the slice must link to implemented target evidence and a final disposition, while deferred or excluded rows require an explicit governed reason; this prevents partial work from appearing complete through missing traceability.'],
  ['all-audits', 'audit:stage19 / audit:all', 'Scoped acceptance / final completion', 'audit:stage19 checks the exact delivered acceptance scope before owner sign-off without demanding global complete. audit:all includes the strict completion audit and validates the final complete record after explicit owner authorization; neither command supplies independent review or human approval.'],
  ['stage-19-owner-gate', 'Final owner acceptance', 'Human decision', 'The final human decision for a delivered slice or the completed migration. A clean independent acceptance report is necessary evidence but does not authorize acceptance by itself; the owner must review the outcome, residual scope and findings, then explicitly sign acceptance or send work back.'],
].map(([id, label, role, desc]) => ({
  id,
  label,
  role,
  desc,
  usage: gatePractice[id]?.usage,
  example: gatePractice[id]?.example,
  sourcePath: gatePractice[id]?.sourcePath,
  sourceExists: fs.existsSync(path.join(ROOT, gatePractice[id]?.sourcePath || '')),
  xplannerPath: gatePractice[id]?.xplannerPath,
  headline: gateReviewContracts[id]?.headline.en,
  reviewContract: gateReviewContracts[id],
}));

for (const id of ['stage-09', 'stage-10', 'stage-11']) {
  const stage = stages.find(s => s.id === id);
  stage.reentry = {
    instructionPath: 'analysis/architecture/review-cycles.md#repeated-work',
    examplePath: 'analysis/stages/stage-12/architecture-closure-001.md',
    sources: [{artifactId: 'architecture-closure',
      en: 'Exact negative Stage 12 report selected by the return, not the largest filename.',
      ru: 'Точный отрицательный отчёт шага 12, указанный при возврате, а не файл с наибольшим номером.'}],
    en: {title: 'After a failed closure check', input: 'Conditional input: the exact triggering closure report, linked owner verdict and correction dispositions. Not required on first entry.',
      steps: ['Keep original finding IDs and verify the evidence; record each correction or unresolved item.', 'Repeat affected independent controls. Stage 11 presents what failed and changed before a new human decision.', 'Create new immutable decision/check records; never erase earlier failed attempts.']},
    ru: {title: 'После неуспешной проверки закрытия', input: 'Условный вход: точный отчёт возврата, связанный вердикт владельца и результаты исправлений. При первом входе не требуется.',
      steps: ['Сохранить ID замечаний, проверить доказательства и записать исправление либо оставшуюся проблему.', 'Повторить затронутые независимые проверки. На шаге 11 показать, что не прошло и что изменилось, до нового решения человека.', 'Создать новые неизменяемые записи решений и проверок; прежние неуспешные попытки не удалять.']}
  };
}

for (const stage of stages) {
  stage.artifacts = [...new Set([...stage.inputs, ...stage.outputs])];
  stage.checkRole = stage.independent ? 'independent' : stage.checkRole || 'none';
  stage.gateContract = gateContract.stages.find(row => row.id === stage.id);
  if (stage.id === 'stage-19') stage.completionContract = gateContract.stages.find(row => row.id === 'complete');
}

const artifactIds = new Set(artifacts.map((item) => item.id));
const artifactLifecycleById = new Map(artifacts.map((item) => [item.id, item.lifecycle]));
const gateIds = new Set(gates.map((item) => item.id));
const stageIds = new Set(stages.map((item) => item.id));
const errors = [];

if (stages.length !== 20) errors.push(`expected Bootstrap + 19 stages, received ${stages.length}`);
for (let number = 1; number <= 19; number += 1) {
  if (!stages.some((stage) => stage.number === number)) errors.push(`missing Stage ${number}`);
}
for (const [stageIndex, stage] of stages.entries()) {
  if (!phases.some((phase) => phase.id === stage.phase)) errors.push(`${stage.id}: unknown phase ${stage.phase}`);
  if (new Set(stage.inputs).size !== stage.inputs.length) errors.push(`${stage.id}: duplicate input artifact`);
  if (new Set(stage.outputs).size !== stage.outputs.length) errors.push(`${stage.id}: duplicate output artifact`);
  for (const id of stage.inputs) if (!artifactIds.has(id)) errors.push(`${stage.id}: unknown input artifact ${id}`);
  for (const id of stage.outputs) if (!artifactIds.has(id)) errors.push(`${stage.id}: unknown output artifact ${id}`);
  for (const id of stage.inputs) {
    const hasEarlierProducer = stages.slice(0, stageIndex).some((candidate) => candidate.outputs.includes(id));
    if (!hasEarlierProducer && artifactLifecycleById.get(id) !== 'starter') {
      errors.push(`${stage.id}: input artifact ${id} has no earlier producer`);
    }
  }
  for (const id of stage.gates) if (!gateIds.has(id)) errors.push(`${stage.id}: unknown gate ${id}`);
}
for (const artifact of artifacts) {
  if (!artifact.usage) errors.push(`${artifact.id}: missing practical usage`);
  if (!artifact.example) errors.push(`${artifact.id}: missing usage example`);
}
for (const gate of gates) {
  if (!gate.headline || !gate.reviewContract?.headline.ru || !gate.reviewContract?.boundary.en || !gate.reviewContract?.boundary.ru) errors.push(`${gate.id}: missing bilingual review contract`);
  if (!gate.reviewContract?.inputs.length) errors.push(`${gate.id}: missing checked inputs`);
  for (const input of gate.reviewContract?.inputs || []) {
    if (input.artifact && !artifactIds.has(input.artifact)) errors.push(`${gate.id}: unknown checked artifact ${input.artifact}`);
    if (input.reference && !fs.existsSync(path.join(ROOT, input.reference))) errors.push(`${gate.id}: missing check reference ${input.reference}`);
    if (!['automatic', 'review', 'decision', 'record', 'delegated', 'related'].includes(input.mode)) errors.push(`${gate.id}: unknown checking role ${input.mode}`);
  }
  if (!gate.usage) errors.push(`${gate.id}: missing practical usage`);
  if (!gate.example) errors.push(`${gate.id}: missing usage example`);
  if (!gate.sourcePath) errors.push(`${gate.id}: missing implementation or evidence reference`);
  if (!gate.sourceExists) errors.push(`${gate.id}: missing reference file ${gate.sourcePath}`);
}
if (stageIds.size !== stages.length || artifactIds.size !== artifacts.length || gateIds.size !== gates.length) {
  errors.push('duplicate ids are not allowed');
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const output = {
  schemaVersion: 2,
  title: 'Legacy Modernization Starter',
  subtitle: 'Bootstrap and 19 governed stages from legacy evidence to owner acceptance',
  repository: 'https://github.com/olsys-ltd/legacy-modernization-starter',
  exampleRepository: XPLANNER_REPOSITORY,
  exampleRevision: XPLANNER_REVISION,
  exampleRevisions: {
    'analysis/feature-dependencies.json': '88cd122b40ade64c9c794d732b0e6bd0ecf76041',
    'config/project.yaml': '221b5dfc45a18e32149928b0bcc0a8863b699e2a',
    'analysis/knowledge/README.md': '221b5dfc45a18e32149928b0bcc0a8863b699e2a',
    'analysis/error-prevention-checklist.md': '2c76d4e081d2fa852bb48e29d74d943b22902c94',
    '.specify/memory/constitution.md': '8b15050d282d47aa352a10146fb2064f4f72eb97',
    'MIGRATION.md': '221b5dfc45a18e32149928b0bcc0a8863b699e2a',
    'analysis/migration_methodology.md': '221b5dfc45a18e32149928b0bcc0a8863b699e2a',
    'analysis/migration_status.yaml': '8b15050d282d47aa352a10146fb2064f4f72eb97',
    'analysis/prototyping/ui-ux-decision.md': '846e07a8ed92384136932af56231081c908e259d',
    'analysis/prototyping/ui-ux-approval.md': '2a57dc5b600b2baf428af692fee25977ed64a787',
    'specs/traceability.md': '7a5ae2ec3275ed733e6d771610373b7508f408e2',
    'analysis/stages/waivers/pre-sdd-knowledge-029-iteration-accuracy-report.md': 'd079db2835a93e864ca1cf366b92dfa7680d040d',
    'analysis/stages/stage-15/029-iteration-accuracy-report/sdd-record.md': 'e297a6e25a7b0d464351d961824a86153aaf41d6',
    'analysis/architecture/architecture-nfr-owner-review.md': '4a9591a3a15db69e577ef510b7d57a20824d4e3d',
    'analysis/architecture/architecture-nfr-manifest.json': '4a9591a3a15db69e577ef510b7d57a20824d4e3d',
    'analysis/architecture/architecture-nfr-decision-register.xlsx': '4a9591a3a15db69e577ef510b7d57a20824d4e3d',
    'analysis/stages/stage-11/architecture-owner-verdict-001.md': '1ef0436c6753b08dbf7fc82b07650361b27706eb',
    'analysis/stages/stage-12/architecture-closure-001.md': '1ef0436c6753b08dbf7fc82b07650361b27706eb',
  },
  phases,
  stages,
  artifacts,
  gates,
};

const serialized = `${JSON.stringify(output, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, 'utf8') !== serialized) {
    console.error('data.json is stale; run node analysis/process-canvas/build-data.js');
    process.exitCode = 1;
  } else {
    console.log(`data.json is synchronized: ${stages.length} stages, ${artifacts.length} artifacts, ${gates.length} gates`);
  }
} else {
  fs.writeFileSync(OUTPUT, serialized);
  console.log(`data.json: ${stages.length} stages, ${artifacts.length} artifacts, ${gates.length} gates`);
}

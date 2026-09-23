# Gate Inputs And Review Boundaries

**Which problem does each gate catch, which files does it inspect, and who makes the decision?**

Generated from the same gate contracts as the 3D canvas. Automatic checks, independent review and owner decisions are different obligations. A result record is not necessarily read by a script. Conditional inputs apply only to their declared scope; linked starter files are templates or implementations, not project evidence.

## Contents

- [audit:dependencies](#dependency-audit)
- [Bootstrap audits](#bootstrap-audits)
- [audit:project](#project-audit)
- [audit:workbook](#workbook-audit)
- [Stage 3 outcome gate](#walkthrough-outcome)
- [Stage 5 owner gate](#stage-05-owner-gate)
- [audit:prototype](#prototype-audit)
- [audit:prototype:approved](#prototype-approved-audit)
- [audit:architecture](#architecture-audit)
- [audit:architecture:approved](#architecture-approved-audit)
- [audit:architecture:closure](#architecture-closure-audit)
- [audit:knowledge](#knowledge-audit)
- [audit:sdd](#sdd-audit)
- [Stage 16 owner gate](#stage-16-owner-gate)
- [Project CI](#ci-gate)
- [audit:target](#target-audit)
- [audit:ui-parity](#ui-parity-audit)
- [audit:environment](#environment-audit)
- [audit:delivery](#delivery-audit)
- [audit:sdd:slice](#sdd-complete-audit)
- [audit:stage19 / audit:all](#all-audits)
- [Final owner acceptance](#stage-19-owner-gate)

<a id="dependency-audit"></a>
## audit:dependencies

**Are dependency links consistent, source-bound and reviewed for the selected scope?**

Validates graph structure, pinned sources, parity scope, completion cycles and exact review digests. New/reopened SDD binds the node digest. The reviewer still checks meaning, completeness and conditions; graph validity is not permission to implement or release.

**When:** Run at Stages 9-19. Structural validity permits drafting; implementation handoff and completion require the selected reviewed scope. Stage 19 full evidence is Phase B only.

**Example:** A cycle in mandatory completion prerequisites fails. A candidate link remains visible and prevents reviewed readiness; a historical import cannot be approved by changing a color.

**Boundary:** Checks schema, exact sources, parity rows, duplicate links, completion cycles and review digests. Cannot discover omitted dependencies or authorize work. Historical reconstruction never establishes readiness.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/feature-dependencies.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/feature-dependencies.example.json) | Automatic check | Structural audit; --require-reviewed --scope checks the named node and its completion providers. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Exact workbook and valid scenario rows for legacy-backed slices. |
| [specs/traceability.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/traceability.template.md) | Automatic check | Existing SDD nodes must match their parity delivery contracts. |
| [analysis/reviews/stage-10-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Agent review | Reviewer challenges initial dependencies and records exact scope digests. |
| [analysis/reviews/stage-16-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Agent review | Reviewer challenges refined SDD dependencies and exclusions. |

**Implementation / procedure:** [analysis/tools/feature-dependencies.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/feature-dependencies.js).

<a id="bootstrap-audits"></a>
## Bootstrap audits

**Is the workspace ready to begin governed discovery?**

The combined readiness check run before Stage 1. It exercises the starter tools and validates the status, project and environment contracts plus methodology and process-view consistency. The active Bootstrap agent records exact commands and outcomes in bootstrap-gate-report.md, and migration_status.yaml cites that report; green means the governed workspace is usable, not that legacy behavior has been discovered or approved.

**When:** Run after initialization and after approved Bootstrap maintenance. Record failed checks in the report and status immediately. Pre-existing documents are preserved: correcting an editable owner file needs scoped permission, not blanket normalization. All required checks must pass before the separately owner-authorized transition to Stage 1.

**Example:** XPlanner ran the audit-toolkit tests, initializer self-test and status, project, environment, methodology and process-view audits; it recorded a failed methodology-link check and its correction before the final green result.

**Boundary:** A collection of checks, not one report parser. The agent fills the report after commands; audit:status checks its reference. No legacy findings or Stage 1 permission are inferred.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | audit:status validates stage state, Bootstrap gates, evidence references and equality of constitution.version with the actual project constitution Version, including before ratification. |
| [constitution.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/memory/constitution.md) | Automatic check | The document-level Version is checked against status. Missing, ambiguous or mismatched metadata fails; matching versions do not prove owner ratification. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | audit:project checks project identity, paths and commands. |
| [environments.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/environments.yaml) | Automatic check | audit:environment validates structure; an unconfigured Bootstrap contract is not remote readiness. Remote operations require --require-configured. |
| [migration_methodology.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_methodology.md) | Automatic check | Methodology/view checks compare instructions, HTML, 2D and 3D; toolkit tests and initializer self-test run separately. |
| [analysis/error-prevention-checklist.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/error-prevention-checklist.template.md) | Automatic check | audit:prevention validates the empty starter template and project table structure, IDs and local basis links; it cannot judge semantic quality or performed self-checks. |
| [analysis/stages/bootstrap/bootstrap-gate-report.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/bootstrap-gate-report-template.md) | Result record | The Bootstrap agent records exact commands, failures, fixes and outcomes here. |
| [constitution.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/memory/constitution.md) | Owner decision | Owner ratification and separate Stage 1 authorization remain required. |

**Implementation / procedure:** [analysis/stages/templates/bootstrap-gate-report-template.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/bootstrap-gate-report-template.md).

<a id="project-audit"></a>
## audit:project

**Are the project paths and required commands configured for this stage?**

Validates that project.yaml is complete and internally consistent: project identity, legacy and target paths, working directories, runtime declarations and stage-specific command slots. It prevents an agent from running checks in the wrong repository or claiming readiness before required project commands are configured.

**When:** Run during Bootstrap and whenever project paths, target platforms or command entries change. At Stages 17 and 18 it also enforces that the commands required by that stage are no longer null.

**Example:** If commands.visual_parity is missing when a UI slice reaches Stage 17, audit:project fails before the agent can claim the candidate is build-ready.

**Boundary:** Checks configuration and path existence, not whether every configured command will succeed.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Identity, paths, runtime declarations and stage-dependent command slots. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Project identity, current stage and command-contract readiness. |
| [config/project.schema.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.schema.json) | Automatic check | Allowed configuration structure. |
| [analysis/migration_status.schema.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.schema.json) | Automatic check | Status validation through the shared status loader. |

**Implementation / procedure:** [analysis/tools/project-config-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/project-config-audit.js).

<a id="workbook-audit"></a>
## audit:workbook

**Can the parity map be used without missing or inconsistent records?**

Validates the structure and internal consistency of the parity workbook: required columns, identifiers, allowed states, evidence references, decisions and formulas. Passing proves that the map is mechanically usable and complete in shape; independent review and live walkthrough still determine whether its business meaning is true.

**When:** Run after every parity-map change from Stage 1 through acceptance. It validates workbook structure, evidence links, decisions, row states, formulas and delivery/SDD coverage.

**Example:** A row marked delivered without a target destination and SDD reference fails, even when the implementation itself exists.

**Boundary:** Workbook shape and recorded consistency are checked. Legacy behavior is established by independent source review and walkthrough, not by spreadsheet validation.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Workbook sheets, required columns, values, row states, evidence fields and formulas. |
| [analysis/legacy_reconnaissance.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_reconnaissance.template.md) | Agent review | The independent reviewer reconciles discovery scope; not a direct workbook-audit input. |

**Implementation / procedure:** [analysis/tools/workbook-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/workbook-audit.js).

<a id="walkthrough-outcome"></a>
## Stage 3 outcome gate

**What legacy behavior was actually observed, and what remains unverified?**

Controls the exit from live legacy verification. It requires a walkthrough record with environment, roles, actions, observations and explicit residual unverified scope; when the legacy system cannot be exercised, only a recorded owner decision to simulate or waive the blocked part permits progression.

**When:** Close Stage 3 only after the runnable legacy system has been exercised by applicable roles and channels. Blocked scope needs an explicit owner-approved simulation or waiver decision.

**Example:** XPlanner recorded desktop and operator observations; inaccessible production-only behavior remained named in stage-03-outcome.md instead of being silently treated as verified.

**Boundary:** An evidence/decision gate: the agent and owner judge the recorded observations. A filled walkthrough is not an automatic pass.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/stages/stage-03/walkthrough-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/walkthrough-NNN-template.md) | Agent review | Roles, environment, performed actions, expected/observed results and remaining scope. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Agent review | Rows compared with the observed behavior. |
| [analysis/stages/waivers/GATE-SCOPE.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/GATE-SCOPE-template.md) | Owner decision | Only when an allowed simulation or exception is explicitly authorized. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Result record | The agent records the outcome, evidence and authorized next action. |

**Implementation / procedure:** [analysis/stages/templates/walkthrough-NNN-template.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/walkthrough-NNN-template.md).

<a id="stage-05-owner-gate"></a>
## Stage 5 owner gate

**Has the owner chosen the application form and visual direction?**

A mandatory human stop before wireframes are produced. The owner must select and record the application form, channels, visual direction and accessibility baseline, or explicitly waive a decision; the agent may prepare options but cannot choose the product experience on the owner's behalf.

**When:** The agent stops at Stage 5, presents application-form and visual-direction options, and waits for the owner to record the choice. No wireframe generation starts from an inferred preference.

**Example:** The owner selects a responsive web application and the approved visual baseline in ui-ux-decision.md; that recorded choice becomes the input to Stage 6.

**Boundary:** The owner decides. The agent prepares and records; an audit cannot choose a product experience.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Owner decision | Scenarios, roles and channels constrain the choice. |
| [analysis/stages/stage-04/stage-04-requirements-revision.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/stage-04-requirements-revision-template.md) | Owner decision | Owner conditions and rationale must not be lost in the choice. |
| [analysis/prototyping/ui-ux-decision.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-decision-template.md) | Result record | Records the selected form, style and source of owner authority. |
| [analysis/prototyping/ui-design-system.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-system-template.md) | Owner decision | Proposed shared rules and component source; finished variants are not yet approved. |
| [analysis/prototyping/ui-design-tokens.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-tokens.example.json) | Owner decision | The owner selects the foundation values and their canonical hash is recorded in the decision. |
| [analysis/stages/waivers/GATE-SCOPE.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/GATE-SCOPE-template.md) | Owner decision | A permitted exception has its own exact scope, not implied consent. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Result record | Records approval or the blocked next action. |

**Implementation / procedure:** [analysis/prototyping/templates/ui-ux-decision-template.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-decision-template.md).

<a id="prototype-audit"></a>
## audit:prototype

**Does the prototype account for the governed behavior and exact exports?**

Reconciles the parity map with screen normalization, the screen manifest, owner decisions and the exported wireframe files and hashes. It detects missing mappings, unjustified screens, stale exports and structural drift, while Stage 7 remains responsible for judging semantic quality and usability.

**When:** Run while Stage 6 builds the prototype and again during Stage 7 control. It reconciles parity rows, normalization, manifest entries, exported wireframes and their hashes.

**Example:** A background job classified as non-visual passes only with a coverage reason; a UI row with no screen, state or action mapping fails.

**Boundary:** Structural coverage and hashes are checked; Stage 7 judges meaning, missing states and usability.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/prototyping/ui-design-system.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-system-template.md) | Automatic check | For version-4 visual scope: catalogue hash, component rows and screen/SDD variant references. Meaning remains an independent review. |
| [analysis/prototyping/ui-design-tokens.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-tokens.example.json) | Automatic check | Typed values, aliases, full-file hash and the Stage 5 foundation pin. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Only for an unchanged historical version-3 prototype: exact compatibility pins, not approval of a new UI kit. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Rows and declared coverage scope. |
| [analysis/prototyping/ui-ux-decision.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-decision-template.md) | Automatic check | Required decision content and governed prototype basis. |
| [analysis/prototyping/screen-normalization.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-normalization.example.json) | Automatic check | Behavior classification and row-to-element mapping. |
| [analysis/prototyping/screen-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-manifest.example.json) | Automatic check | Screens, rows, roles, states, export versions and file pins. |
| [wireframes/*](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/README.md) | Automatic check | Declared export files, hashes and supported structural checks. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Stage and registered scoped exceptions when applicable. |

**Implementation / procedure:** [analysis/tools/prototype-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/prototype-audit.js).

<a id="prototype-approved-audit"></a>
## audit:prototype:approved

**Are these the exact wireframes that passed control and owner approval?**

The final prototype gate after independent control and owner review. It reruns the structural prototype checks and requires ui-ux-approval.md to reference the exact closing review, manifest and export-set version, preventing coding from using wireframes different from those actually approved.

**When:** Run after the Stage 8 owner decision and whenever approved prototype inputs are consumed later. It requires the approval to pin the exact closing review, manifest hash and export-set version.

**Example:** Editing screen-manifest.json after approval changes its hash and immediately invalidates the gate until the corrected prototype is reviewed and approved again.

**Boundary:** Repeats audit:prototype and checks recorded approval bindings. It neither performs Stage 7 semantic review nor supplies owner approval.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/prototyping/ui-ux-approval.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-approval-template.md) | Automatic check | Approval text, export-set version, manifest hash and closing review reference. |
| [analysis/prototyping/screen-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-manifest.example.json) | Automatic check | Same manifest/exports as audit:prototype, including normalization, decision and workbook. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Registered Stage 7 closing pass for the approved version. |
| [analysis/reviews/stage-07-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Agent review | Independent findings and dispositions remain the reviewer evidence; the audit checks the approval/status binding. |
| [analysis/prototyping/ui-polish-backlog.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-polish-backlog-template.md) | Agent review | Accepted cosmetic debt must retain an owner-approved deadline and later task coverage. |
| [analysis/prototyping/ui-design-system.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-system-template.md) | Automatic check | For version-4 visual scope: catalogue hash, component rows and screen/SDD variant references. Meaning remains an independent review. |
| [analysis/prototyping/ui-design-tokens.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-tokens.example.json) | Automatic check | Typed values, aliases, full-file hash and the Stage 5 foundation pin. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Only for an unchanged historical version-3 prototype: exact compatibility pins, not approval of a new UI kit. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Rows and declared coverage scope. |
| [analysis/prototyping/ui-ux-decision.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-decision-template.md) | Automatic check | Required decision content and governed prototype basis. |
| [analysis/prototyping/screen-normalization.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-normalization.example.json) | Automatic check | Behavior classification and row-to-element mapping. |
| [wireframes/*](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/README.md) | Automatic check | Declared export files, hashes and supported structural checks. |

**Implementation / procedure:** [analysis/tools/prototype-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/prototype-audit.js).

<a id="architecture-audit"></a>
## audit:architecture

**Is the architecture package complete and internally traceable?**

Validates the architecture package as a connected evidence chain. It checks workbook completeness, measurable NFRs, NFR-to-ADR links, required records and diagrams, source provenance and synchronized hashes; passing confirms consistency, while Stage 10 independently challenges whether the decisions are sound.

**When:** Run throughout Stages 9 and 10 while facts, client answers, NFRs, decisions, diagrams and ADRs are assembled. Passing means the evidence chain is complete enough for independent challenge.

**Example:** A measurable availability NFR with no linked architecture section or ADR causes the audit to fail before owner review.

**Boundary:** Checks documented criteria, structure, references and hashes. Soundness of architecture remains an independent Stage 10 judgment.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-manifest.example.json) | Automatic check | Exact document set, source pins, NFR ownership and ADR links. |
| [analysis/architecture/architecture-nfr-decision-register.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-decision-register-template.xlsx) | Automatic check | NFR register structure, values, decisions and criteria. |
| [analysis/architecture/architecture-nfr-owner-review.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-owner-review-template.md) | Automatic check | Recorded foundation/owner boundary and exact workbook binding. |
| [analysis/architecture/architecture.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-template.md) | Automatic check | Required overview content and section references. |
| [analysis/architecture/sections/00-foundation.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/sections/00-foundation-template.md) | Automatic check | Foundation and other manifest-listed source documents. |
| [analysis/architecture/adr/NNN-SLUG.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/NNN-SLUG-template.md) | Automatic check | Required records and NFR-to-decision references. |
| [architecture.drawio](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/README.md) | Automatic check | Document structure, referenced objects and file hash. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Stage-dependent requirements and registered exceptions. |
| [Foundation-referenced CI entrypoints, package scripts and fixtures](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/architecture-audit.js) | Automatic check | Foundation-rule checks inspect the committed analyzer, command entrypoints and recorded fixtures. |

**Implementation / procedure:** [analysis/tools/architecture-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/architecture-audit.js).

<a id="architecture-approved-audit"></a>
## audit:architecture:approved

**Did the owner approve this exact architecture set?**

The owner-approved architecture checkpoint. It requires a green architecture audit and a valid review verdict pinned to the same workbook, Markdown records, ADRs, diagram and manifest, so later stages cannot rely on an unreviewed or silently modified architecture set.

**When:** Run after the owner reviews the architecture and again whenever downstream work depends on it. The owner record and every pinned architecture hash must describe the same approved set.

**Example:** A changed ADR after owner sign-off makes the manifest or owner-review hash stale, so SDD work cannot rely on the modified decision silently.

**Boundary:** Includes audit:architecture. Verifies recorded authority and immutable bindings, not a new human decision or independent architectural judgment.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-manifest.example.json) | Automatic check | Full architecture-audit package: NFR register/review, overview, sections, ADRs and diagram. |
| [analysis/stages/stage-11/architecture-owner-verdict-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-owner-verdict-NNN-template.md) | Automatic check | Owner verdict, pinned versions and exact Stage 10 reference. Does not require the future Stage 12 report. |
| [analysis/reviews/stage-10-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Automatic check | The exact report referenced by the verdict is read and checked. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Review registration and applicable stage/exception context. |
| [analysis/architecture/architecture-nfr-decision-register.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-decision-register-template.xlsx) | Automatic check | NFR register structure, values, decisions and criteria. |
| [analysis/architecture/architecture-nfr-owner-review.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-owner-review-template.md) | Automatic check | Recorded foundation/owner boundary and exact workbook binding. |
| [analysis/architecture/architecture.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-template.md) | Automatic check | Required overview content and section references. |
| [analysis/architecture/sections/00-foundation.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/sections/00-foundation-template.md) | Automatic check | Foundation and other manifest-listed source documents. |
| [analysis/architecture/adr/NNN-SLUG.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/NNN-SLUG-template.md) | Automatic check | Required records and NFR-to-decision references. |
| [architecture.drawio](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/README.md) | Automatic check | Document structure, referenced objects and file hash. |
| [Foundation-referenced CI entrypoints, package scripts and fixtures](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/architecture-audit.js) | Automatic check | Foundation-rule checks inspect the committed analyzer, command entrypoints and recorded fixtures. |

**Implementation / procedure:** [analysis/tools/architecture-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/architecture-audit.js).

<a id="architecture-closure-audit"></a>
## audit:architecture:closure

**Are all applicable items verified against the currently approved architecture?**

Checks that the exact current owner-approved architecture has a separate passed Stage 12 closure report, complete item coverage and no unresolved findings. It validates recorded integrity, not the truth of a claimed fix.

**When:** Run to close Stage 12 and before the Stage 13 handoff. It includes the approved architecture gate and checks the current separate closure record.

**Example:** A missing owner item, stale owner-record hash, mismatched scope, old stage entry or unresolved finding prevents closure.

**Boundary:** Includes approved architecture checks. Validates record selection, hashes, item coverage, counts and passed result; the agent checks evidence meaning. A report is not a human decision.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/stages/stage-11/architecture-owner-verdict-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-owner-verdict-NNN-template.md) | Automatic check | Exact immutable human decision selected in status. |
| [analysis/stages/stage-12/architecture-closure-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-closure-NNN-template.md) | Automatic check | Current separate closure report, owner binding, items, counts and result. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Exact current record paths and latest stage entries. |
| [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-manifest.example.json) | Automatic check | Full architecture-audit package: NFR register/review, overview, sections, ADRs and diagram. |
| [analysis/reviews/stage-10-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Automatic check | The exact report referenced by the verdict is read and checked. |
| [analysis/architecture/architecture-nfr-decision-register.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-decision-register-template.xlsx) | Automatic check | NFR register structure, values, decisions and criteria. |
| [analysis/architecture/architecture-nfr-owner-review.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-owner-review-template.md) | Automatic check | Recorded foundation/owner boundary and exact workbook binding. |
| [analysis/architecture/architecture.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-template.md) | Automatic check | Required overview content and section references. |
| [analysis/architecture/sections/00-foundation.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/sections/00-foundation-template.md) | Automatic check | Foundation and other manifest-listed source documents. |
| [analysis/architecture/adr/NNN-SLUG.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/NNN-SLUG-template.md) | Automatic check | Required records and NFR-to-decision references. |
| [architecture.drawio](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/README.md) | Automatic check | Document structure, referenced objects and file hash. |
| [Foundation-referenced CI entrypoints, package scripts and fixtures](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/architecture-audit.js) | Automatic check | Foundation-rule checks inspect the committed analyzer, command entrypoints and recorded fixtures. |

**Implementation / procedure:** [analysis/tools/architecture-review-records.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/architecture-review-records.js).

<a id="knowledge-audit"></a>
## audit:knowledge

**Is this knowledge package structurally valid and tied to unchanged sources?**

Validates the knowledge manifest, bundle structure, concept metadata, links and exact source hashes. Detects stale or missing bindings; the independent Stage 14 reviewer checks whether the synthesis preserves the meaning and coverage of the approved sources.

**When:** Run after Stage 13 synthesis and before SDD/review work consumes the OKF bundle. It checks declared concept metadata, links and unchanged source hashes; Stage 14 checks semantic fidelity and completeness.

**Example:** A session-management concept that cites an old architecture hash fails instead of teaching the design agent a stale rule.

**Boundary:** Hashes and metadata cannot prove faithful meaning or completeness. Stage 14 compares every concept with its sources; the audit does not replace that review.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/knowledge/knowledge-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/knowledge/templates/knowledge-manifest.example.json) | Automatic check | Package schema, source/file pins and declared coverage. |
| [knowledge/bundle/**](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/knowledge/README.md) | Automatic check | Root index, concept metadata, IDs, links and exact file hashes. |
| [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-manifest.example.json) | Automatic check | Exact architecture source pin and version. |
| [analysis/stages/stage-11/architecture-owner-verdict-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-owner-verdict-NNN-template.md) | Automatic check | Recorded approved source-set boundary. |
| [analysis/stages/stage-12/architecture-closure-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-closure-NNN-template.md) | Automatic check | Passed closure pinned as a source after review-cycle adoption. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Mandatory source pin; other manifest-listed source files are also hashed. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Registered knowledge exception when applicable. |
| [analysis/stages/stage-13/knowledge-record.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/knowledge-record-template.md) | Agent review | Stage 14 uses the production record and its missing coverage; not the audit parser. |
| [analysis/reviews/stage-14-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Result record | A separate independent result, not emitted by audit:knowledge. |

**Implementation / procedure:** [analysis/tools/knowledge-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/knowledge-audit.js).

<a id="sdd-audit"></a>
## audit:sdd

**Is the written SDD internally consistent enough to submit to independent control?**

Checks required SDD files and sections, requirement/task references, traceability, assumption and impact policies, and applicable approved UI bindings. The Stage 16 reviewer separately checks the author handoff, requirement meaning and alignment with architecture, NFRs and target surfaces.

**When:** Run at Stages 15 to 17. The current command scans all numbered feature directories, validating spec, plan, tasks, traceability, assumptions, impact scope and applicable prototype bindings.

**Example:** A decimal-duration requirement with no implementation task or test path blocks the slice before coding.

**Boundary:** The current CLI scans all numbered feature directories, not only the selected diagram slice. It does not read sdd-record.md, the NFR manifest or target inventory directly, and does not prove requirement semantics. Stage 16 checks those links and sources; audit:target is separate.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/feature-dependencies.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/feature-dependencies.example.json) | Automatic check | New/reopened SDD: exact node scope digest and transitive completion dependencies. Review meaning remains a separate obligation. |
| [analysis/prototyping/ui-design-system.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-system-template.md) | Automatic check | For version-4 visual scope: catalogue hash, component rows and screen/SDD variant references. Meaning remains an independent review. |
| [analysis/prototyping/ui-design-tokens.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-tokens.example.json) | Automatic check | Typed values, aliases, full-file hash and the Stage 5 foundation pin. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Only for an unchanged historical version-3 prototype: exact compatibility pins, not approval of a new UI kit. |
| [specs/NNN-SLUG/spec.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/spec-template.md) | Automatic check | Required sections, FR identifiers, owner-assumption fields, impact scope and UI contract. |
| [specs/NNN-SLUG/plan.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/plan-template.md) | Automatic check | Required content and binding to assumptions and declared verification scope. |
| [specs/NNN-SLUG/tasks.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/tasks-template.md) | Automatic check | Task structure and requirement references; incomplete tasks fail completion mode. |
| [specs/traceability.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/traceability.template.md) | Automatic check | Feature/requirement mappings, parity contracts and Slice Verification Index: SDD/plan/evidence file links and explicit planned, missing or recorded states. Completion requires recorded links, not just a plan. The script does not read test outcomes or prove semantic coverage. |
| [specs/README.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/README.md) | Automatic check | Policy thresholds for assumption and impact checks. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Open reopened slices affect which assumption policy applies. |
| [analysis/prototyping/ui-ux-approval.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-approval-template.md) | Automatic check | For a UI contract: approved export version and manifest digest. |
| [analysis/prototyping/screen-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-manifest.example.json) | Automatic check | For a UI contract: manifest digest and named screen hashes. |
| [analysis/stages/stage-15/sdd-record.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/sdd-record-template.md) | Agent review | Stage 16 reads the handoff, gaps and source bindings. audit:sdd does not parse this report. |
| [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-manifest.example.json) | Agent review | Stage 16 reconciles actual criteria and approved architecture; not a direct audit:sdd input. |
| [analysis/inventories/target-surface-inventory.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/inventories/target-surface-inventory.example.json) | Separate check | Checked separately by audit:target and the Stage 16 reviewer. |
| [analysis/prototyping/ui-polish-backlog.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-polish-backlog-template.md) | Agent review | When present or referenced, Stage 16 verifies applicability and task coverage. |

**Implementation / procedure:** [analysis/tools/sdd-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/sdd-audit.js).

<a id="stage-16-owner-gate"></a>
## Stage 16 owner gate

**Has independent review passed, and did the owner authorize this exact implementation?**

A mandatory human stop after the independent SDD review. The owner sees the exact slice scope, assumptions, exclusions and review findings and must approve or request correction; this prevents the agent from turning an interpretation or unresolved assumption into code without authority.

**When:** After an independent Stage 16 review, the agent shows the exact slice scope, exclusions and every disclosed assumption to the owner and waits for approval or correction.

**Example:** If the SDD assumes that an administrator may bypass a restriction, the owner must explicitly approve or replace that rule before Stage 17.

**Boundary:** This is a human decision gate after independent control, not a script that parses the handoff. A green audit or author self-review cannot authorize Stage 17.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/stages/stage-15/sdd-record.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/sdd-record-template.md) | Agent review | The independent reviewer checks source versions, coverage, gaps and handoff readiness against the actual SDD. |
| [specs/NNN-SLUG/spec.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/spec-template.md) | Owner decision | Owner reviews exact requirements, assumptions, final dispositions and exclusions. |
| [specs/NNN-SLUG/plan.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/plan-template.md) | Agent review | Reviewer reconciles architecture, NFR criteria and verification scope with upstream sources. |
| [specs/NNN-SLUG/tasks.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/tasks-template.md) | Agent review | Reviewer verifies executable coverage and planned tests. |
| [specs/traceability.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/traceability.template.md) | Agent review | Requirements and source chain, including applicable prototype, architecture and OKF. |
| [analysis/inventories/target-surface-inventory.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/inventories/target-surface-inventory.example.json) | Agent review | Useful role-specific surfaces and planned acceptance. |
| [analysis/prototyping/ui-polish-backlog.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-polish-backlog-template.md) | Agent review | Conditional open findings must map to tasks or an evidenced exclusion. |
| [analysis/reviews/stage-16-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md) | Owner decision | Owner sees the exact independent clean result and remaining scope before deciding. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Result record | Agent records the explicit decision, exact evidence and permitted next action. |

**Implementation / procedure:** [.specify/templates/spec-template.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/spec-template.md).

<a id="ci-gate"></a>
## Project CI

**Does this exact code revision pass the configured engineering checks?**

The project's executable engineering quality gate for the delivery candidate. It runs the configured formatter, analyzers, build, tests, migrations, coverage and stack-specific architecture rules; passing proves the revision meets declared technical checks, not that live behavior or owner acceptance has occurred.

**When:** Run on the exact Stage 17 delivery candidate. The configured project command executes the stack-specific formatter, analyzers, build, tests, migration checks, coverage and architecture rules.

**Example:** XPlanner build/ci.ps1 restores locked dependencies, formats, builds .NET and Angular, runs architecture, unit, integration and browser tests, and enforces changed-line coverage.

**Boundary:** The command is project-specific. Passing only proves the checks actually configured and executed, not live parity or owner acceptance.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Configured command | Selects configured build/test/CI commands and working directories. |
| [source code](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Configured command | The project command builds/analyzes the exact candidate source and dependency locks. |
| [tests and measurements](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Configured command | Configured unit, integration, browser and coverage checks. |
| [data migrations](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Configured command | Migration checks if configured for the changed scope. |
| [PR + pinned revision](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Result record | CI results must identify the candidate commit; merge authority remains separate. |

**Implementation / procedure:** [config/project.template.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml).

<a id="target-audit"></a>
## audit:target

**Do the declared target surfaces have concrete actions and traceable evidence?**

Validates the target inventory, configured adapter observations, source/test references and placeholder markers. Declared useful actions must have traceable evidence; live Stages 18 and 19 establish that the role-specific behavior actually works.

**When:** Run from Stage 17 through acceptance against the declared target-surface inventory and deterministic observations. Every route, screen, role, API or job must expose a useful evidenced action.

**Example:** An HTTP 200 page containing only a placeholder does not satisfy the declared task-time action and fails audit:target.

**Boundary:** Runs the configured inventory adapters, checks references and markers. It does not itself click every route; Stages 18/19 must exercise actual behavior.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/inventories/target-surface-inventory.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/inventories/target-surface-inventory.example.json) | Automatic check | Surface schema, adapters, roles, useful actions, references and marker-scan configuration. |
| [specs/NNN-SLUG/spec.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/spec-template.md) | Automatic check | Reads the SDD references named by the inventory. |
| [tests and measurements](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Automatic check | Checks referenced test files, titles and surface/role bindings. |
| [source code](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Configured command | Configured adapters and marker scans inspect declared source paths or observations. |

**Implementation / procedure:** [analysis/tools/target-surface-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/target-surface-audit.js).

<a id="ui-parity-audit"></a>
## audit:ui-parity

**Does the implemented interface match the exact approved prototype?**

Compares implemented UI surfaces with the exact owner-approved wireframes and manifest. Browser checks verify required labels, geometry, styles, role variations, states and representative content, while recorded tolerances distinguish acceptable rendering differences from real visual or behavioral regressions.

**When:** Run locally for every UI-impacting Stage 17 slice and repeat against the public Stage 18 revision. It uses the owner-approved wireframes and manifest as the expected source, never implementation screenshots.

**Example:** XPlanner fails when a button has the right label but wrong typography, when a declared hover state is not exercised, or when a changed screen is absent from the parity test scope.

**Boundary:** The wrapper validates source/SDD bindings and delegates live browser comparisons to commands.visual_parity. Code labels or screenshots of the implementation cannot become the expected source.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/prototyping/ui-design-system.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-system-template.md) | Automatic check | For version-4 visual scope: catalogue hash, component rows and screen/SDD variant references. Meaning remains an independent review. |
| [analysis/prototyping/ui-design-tokens.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-tokens.example.json) | Automatic check | Typed values, aliases, full-file hash and the Stage 5 foundation pin. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Visual-parity command, tolerances and runtime contract. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Active/reopened slice and governed visual scope. |
| [specs/README.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/README.md) | Automatic check | Visual contract policy thresholds. |
| [specs/NNN-SLUG/spec.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/spec-template.md) | Automatic check | Affected screens, used controls and planned style/state assertions. |
| [analysis/prototyping/ui-ux-approval.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-approval-template.md) | Automatic check | Owner-approved manifest/version binding. |
| [analysis/prototyping/screen-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-manifest.example.json) | Automatic check | Screen IDs, export files and hashes. |
| [wireframes/*](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/README.md) | Automatic check | Exact source exports for expected content, styles and states. |
| [tests and measurements](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/MIGRATION.md) | Configured command | Configured browser command compares the running candidate or deployed UI. |

**Implementation / procedure:** [analysis/tools/ui-parity-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/ui-parity-audit.js).

<a id="environment-audit"></a>
## audit:environment

**Are we configured for the intended server and approved connection?**

Separates structural Bootstrap validity from remote readiness. A new empty contract is valid only before remote use; --require-configured and delivery/completion require configured environments. Checks identity, host pins, roots, endpoints and applicable secret policy. Never grants access or renews approval.

**When:** Run structurally during Bootstrap. Before every remote operation use --require-configured; delivery and completion also reject an empty configuration. Configured environments validate identity, host pins, roots, endpoints and applicable credential policy without connecting.

**Example:** An empty environment map passes Bootstrap but fails remote readiness. An expired embedded-key exception blocks access; initialization never extends it.

**Boundary:** Validates configuration without connecting. Actual host identity is checked separately during the governed remote connection.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [environments.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/environments.yaml) | Automatic check | Selected environment, endpoints, deployment roots and credential policy. |
| [config/environments.schema.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/environments.schema.json) | Automatic check | Allowed contract structure. |
| [known_hosts and configured key reference](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/REMOTE_SERVER.md) | Automatic check | Compares host-key pins and derives the public-key fingerprint; never publishes secret material. |

**Implementation / procedure:** [analysis/tools/environment-config-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/environment-config-audit.js).

<a id="delivery-audit"></a>
## audit:delivery

**Is this exact revision deployed with useful live proof and rollback readiness?**

Validates that the exact candidate revision is live and supported by delivery evidence. It checks public reachability, smoke evidence, real role-based journey, deployed visual parity, recovery readiness and the required live-reconciliation structure and bindings. A missing section or recorded unresolved coverage blocks Stage 18 closure; agents must still judge evidence meaning and completeness before independent acceptance.

**When:** Run before Stage 18 closure against the immutable delivery record and exact deployed revision. It checks the governed connection, smoke evidence, real browser journey, deployed visual parity, rollback readiness and the required Live Reconciliation section.

**Example:** A green health endpoint is insufficient when the XPlanner login form journey cannot reach and exercise the changed task-time screen.

**Boundary:** Checks the Rollback Readiness section structure, release/environment binding, passed result and inline output or attachment digest. An agent verifies evidence meaning and scope; the audit neither executes recovery nor proves the recorded observations. Live connection/journey/visual checks remain separate.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/stages/stage-18/current-delivery-record.txt](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/README.md) | Automatic check | Resolves the current immutable delivery record. |
| [analysis/stages/stage-18/delivery-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/delivery-NNN-template.md) | Automatic check | Revision, environment, changed surfaces, smoke, parity closure and evidence. |
| [delivery-NNN.md / Live Reconciliation](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/delivery-NNN-template.md) | Automatic check | Required reconciliation section: exact revision/environment, agent/time, live discovery evidence and coverage rows with expected/actual observations, evidence origin, repeat reason and outcome. Missing or unresolved scope blocks closure. The agent and independent acceptance reviewer verify evidence meaning; the parser cannot establish semantic completeness. |
| [environments.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/environments.yaml) | Automatic check | Expected host/kernel and governed connection. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Configured user-journey and visual commands. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Stage and delivery state bindings. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Current workbook digest and delivered/deferred row evidence. |
| [specs/traceability.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/traceability.template.md) | Automatic check | Slice delivery contract and owner references. |
| [raw journey + summary](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/delivery-NNN-template.md) | Configured command | Live configured browser journey plus linked raw output and summary. |
| [delivery-NNN.md / Rollback Readiness](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/delivery-NNN-template.md) | Automatic check | Required section inside the delivery record: strategy, exact release/environment, method, outcome, limitations and recorded evidence. Missing or non-passed checks block closure. |

**Implementation / procedure:** [analysis/tools/delivery-record-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/delivery-record-audit.js).

<a id="sdd-complete-audit"></a>
## audit:sdd:slice

**Are all included tasks and parity obligations actually closed?**

Closes the SDD and parity obligations after delivery. Every row included in the slice must link to implemented target evidence and a final disposition, while deferred or excluded rows require an explicit governed reason; this prevents partial work from appearing complete through missing traceability.

**When:** Run after delivery for delivery.active_slice and transitive completion dependencies from the SDD-bound graph (or unchanged pre-policy declarations). Missing scope blocks. Unrelated future slices may remain planned; audit:sdd:complete checks all slices for final completion. Recorded links are not passed tests.

**Example:** A delivered feature whose tasks.md still has an unchecked implementation task cannot be reconciled as complete.

**Boundary:** audit:sdd:slice completes delivery.active_slice and its reviewed transitive Completion dependencies. audit:sdd:complete completes all numbered features for final acceptance. Both retain global structural checks; recorded evidence is not a passed result or a fresh test execution.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/feature-dependencies.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/feature-dependencies.example.json) | Automatic check | New/reopened SDD: exact node scope digest and transitive completion dependencies. Review meaning remains a separate obligation. |
| [analysis/prototyping/ui-design-system.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-system-template.md) | Automatic check | For version-4 visual scope: catalogue hash, component rows and screen/SDD variant references. Meaning remains an independent review. |
| [analysis/prototyping/ui-design-tokens.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-design-tokens.example.json) | Automatic check | Typed values, aliases, full-file hash and the Stage 5 foundation pin. |
| [config/project.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/config/project.template.yaml) | Automatic check | Only for an unchanged historical version-3 prototype: exact compatibility pins, not approval of a new UI kit. |
| [specs/NNN-SLUG/spec.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/spec-template.md) | Automatic check | Required sections, FR identifiers, owner-assumption fields, impact scope and UI contract. |
| [specs/NNN-SLUG/plan.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/plan-template.md) | Automatic check | Required content and binding to assumptions and declared verification scope. |
| [specs/NNN-SLUG/tasks.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/.specify/templates/tasks-template.md) | Automatic check | Task structure and requirement references; incomplete tasks fail completion mode. |
| [specs/traceability.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/traceability.template.md) | Automatic check | Feature/requirement mappings, parity contracts and Slice Verification Index: SDD/plan/evidence file links and explicit planned, missing or recorded states. Completion requires recorded links, not just a plan. The script does not read test outcomes or prove semantic coverage. |
| [specs/README.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/specs/README.md) | Automatic check | Policy thresholds for assumption and impact checks. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Open reopened slices affect which assumption policy applies. |
| [analysis/prototyping/ui-ux-approval.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-ux-approval-template.md) | Automatic check | For a UI contract: approved export version and manifest digest. |
| [analysis/prototyping/screen-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/screen-manifest.example.json) | Automatic check | For a UI contract: manifest digest and named screen hashes. |
| [analysis/stages/stage-15/sdd-record.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/sdd-record-template.md) | Agent review | Stage 16 reads the handoff, gaps and source bindings. audit:sdd does not parse this report. |
| [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-nfr-manifest.example.json) | Agent review | Stage 16 reconciles actual criteria and approved architecture; not a direct audit:sdd input. |
| [analysis/inventories/target-surface-inventory.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/inventories/target-surface-inventory.example.json) | Separate check | Checked separately by audit:target and the Stage 16 reviewer. |
| [analysis/prototyping/ui-polish-backlog.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/templates/ui-polish-backlog-template.md) | Agent review | When present or referenced, Stage 16 verifies applicability and task coverage. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Automatic check | Completion mode reads workbook row dispositions and target/test/delivery evidence. |

**Implementation / procedure:** [analysis/tools/sdd-audit.js](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/sdd-audit.js).

<a id="all-audits"></a>
## audit:stage19 / audit:all

**Is the delivered scope ready for acceptance, or is the entire migration complete?**

audit:stage19 checks the exact delivered acceptance scope before owner sign-off without demanding global complete. audit:all includes the strict completion audit and validates the final complete record after explicit owner authorization; neither command supplies independent review or human approval.

**When:** PM coordinates audit:stage19 for the exact delivered scope and receives the independent QA report. After full-system acceptance and explicit final owner authorization, PM records complete and runs audit:all to validate that completion. QA never edits shared status. Unrelated open slices do not imply a complete migration.

**Example:** A slice can pass audit:stage19 while later slices remain open. audit:all stays unavailable until final completion is recorded and validates that full evidence chain.

**Boundary:** audit:stage19 composes the configured acceptance audits; audit:all adds strict completion. Neither creates an independent review or owner decision. Each child gate retains its own input and verification boundary.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/tools/package.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/package.json) | Automatic check | Defines child commands: status, project, environment, workbook, approved prototype/architecture, knowledge, completed SDD, UI, target, delivery, links, methodology and views. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Automatic check | Acceptance audit checks the scoped checkpoint; final completion additionally requires complete. |
| [analysis/reviews/stage-19-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/stage-19-pass-NNN-template.md) | Agent review | Independent acceptance must still cover the exact delivered scope. |
| [analysis/stages/stage-19/owner-walkthrough-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/owner-walkthrough-NNN-template.md) | Owner decision | Owner walkthrough when performed, or its explicit recorded decline. |

**Implementation / procedure:** [analysis/tools/package.json](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/tools/package.json).

<a id="stage-19-owner-gate"></a>
## Final owner acceptance

**Does the owner accept the delivered result and its remaining scope?**

The final human decision for a delivered slice or the completed migration. A clean independent acceptance report is necessary evidence but does not authorize acceptance by itself; the owner must review the outcome, residual scope and findings, then explicitly sign acceptance or send work back.

**When:** After a clean independent Stage 19 report, the owner reviews delivered behavior, evidence, residual scope and findings, then explicitly accepts the slice, starts the next slice or returns work.

**Example:** The reviewer can recommend acceptance, but only the owner decision recorded in migration_status.yaml can mark the XPlanner slice accepted.

**Boundary:** Human acceptance is separate from automated green checks and independent recommendations. Final completion is not inferred from accepting one slice.

| Artifact or source | Who checks / role | What is checked or recorded |
|---|---|---|
| [analysis/reviews/stage-19-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/stage-19-pass-NNN-template.md) | Owner decision | Exact independent verdict, findings, tested and unverified scope. |
| [analysis/stages/stage-18/delivery-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/delivery-NNN-template.md) | Owner decision | Which version and useful behavior were actually delivered. |
| [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/legacy_user_flows_template.xlsx) | Owner decision | Delivered, deferred and excluded behavior. |
| [analysis/stages/stage-19/owner-walkthrough-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/owner-walkthrough-NNN-template.md) | Owner decision | Owner observations when the walkthrough is performed. |
| [analysis/stages/stage-19/owner-walkthrough-decline.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/owner-walkthrough-decline-template.md) | Owner decision | Explicit decline if the owner does not perform the optional walkthrough. |
| [analysis/migration_status.yaml](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/migration_status.template.yaml) | Result record | Agent records acceptance, return or next slice only from the owner decision. |

**Implementation / procedure:** [analysis/stages/templates/stage-19-pass-NNN-template.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/stage-19-pass-NNN-template.md).

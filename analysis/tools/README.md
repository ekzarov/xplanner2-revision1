# Deterministic Audit Tools

## Error Prevention Checklist

**Does the shared learned-checks file keep its required readable structure?**

Run `npm --prefix analysis/tools run audit:prevention` after table changes and
before handoff. Bootstrap validates the empty template; initialized projects
must have their own checklist. The audit checks the four columns, nonempty
cells, unique IDs, local basis links and exact duplicate checks. It does not
establish semantic uniqueness, confirmed findings, applicability or performed
self-checks. Those are agent/reviewer duties in
[the procedure](../error-prevention.md). No historical project result is backfilled.


## Human-Readable Artifact Structure

The [reading contract](../artifact-reading-contract.md) governs the first screen
of every authored Markdown artifact: purpose and author, scoped color summary,
anchored contents, then detailed evidence and remaining work.

- `format:artifact-templates` mechanically refreshes the 31 template families.
- `audit:readability` checks their summary and navigation structure; `audit:views`
  includes it. Structural success is not a review verdict or owner approval.
- For a filled record, `node analysis/tools/artifact-reading.js --file PATH.md`
  checks summary/navigation presence. The author must still reconcile the summary
  with actual evidence; the command cannot decide whether the claims are true.

## Portable Role Contract

Run `npm --prefix analysis/tools run audit:roles` after changing the
[role guide](../agent-roles.md), role skills or entry bridges. It also runs
inside `audit:views`. The authorized process maintainer maintains the guide,
skills and audit under [process maintenance](../process-contract.md#authority-and-maintenance);
the initializer installs them without overwriting existing project files.

[`agent-role-contract.js`](agent-role-contract.js) exports `readRoleContract(root)`:
`{ roles: [{ id, name, skill, responsibility }], assignments: [{ stage, lead, mode, support, peer }] }`.
Both lists come from the exact Roles and Stage Assignments Markdown tables;
`support` and `peer` are arrays, with `none` represented by `[]`. Invalid table
structure, role references or check modes throw an error.
`auditAgentRoles({ root })` returns the standard `AuditResult`, including skill
frontmatter, local links and AGENTS/MIGRATION/CLAUDE entry-route checks. It also
calls `roleViewErrors(root, contract)` from
[`agent-role-view.js`](agent-role-view.js) to compare Markdown, HTML, cheat-sheet,
Draw.io and optional English/Russian 3D assignments with those same tables.

For example, a missing role, duplicate stage, absent skill or Stage 12 marked
as independent review fails. Six roles with ordered Stages 0-19, valid skill
instructions and the required entry links pass the structural check. Passing
does not prove a skill was read, an ACK is truthful, a session is isolated or
a task is approved. PM and independent reviewers still verify actual evidence.

## Artifact Responsibility Check

**SDD evidence-link checks:** `audit:sdd` validates one `Slice Verification Index`
row per numbered feature, local spec/plan/tasks and verification-plan links,
recorded-evidence links and explicit planned/missing/recorded states.
`audit:sdd:slice` requires recorded links in addition to existing closure
checks. A linked record may contain failures; the script does not execute tests
or certify their outcomes. Independent review checks semantic coverage and
actual results under the [traceability contract](../../specs/traceability-guide.md).

`npm --prefix analysis/tools run audit:responsibilities` verifies that every artifact family names its creator, maintainer/decision maker and governing instructions in English and Russian. It compares the registry with the artifact catalogue, HTML and 2D reference, and the 3D data when present. The view audit runs this check as well. For example, a new manifest with no responsible producing agent fails this check even if its file path exists. See the [responsibility reference](../artifact-responsibilities.md).

Install and run the regression suite:

```text
npm --prefix analysis/tools ci --ignore-scripts
npm --prefix analysis/tools test
```

The command gates are:

```text
npm --prefix analysis/tools run audit:status
npm --prefix analysis/tools run audit:acceptance
npm --prefix analysis/tools run audit:project
npm --prefix analysis/tools run audit:environment
npm --prefix analysis/tools run audit:delivery
npm --prefix analysis/tools run audit:workbook
npm --prefix analysis/tools run audit:prototype
npm --prefix analysis/tools run audit:prototype:approved
npm --prefix analysis/tools run audit:architecture
npm --prefix analysis/tools run audit:architecture:foundation
npm --prefix analysis/tools run audit:architecture:approved
npm --prefix analysis/tools run audit:knowledge
npm --prefix analysis/tools run audit:sdd
npm --prefix analysis/tools run audit:sdd:complete
npm --prefix analysis/tools run audit:ui-parity
npm --prefix analysis/tools run audit:target
npm --prefix analysis/tools run audit:methodology
npm --prefix analysis/tools run audit:views
npm --prefix analysis/tools run audit:roles
npm --prefix analysis/tools run audit:all
```

## Practical Gate Reference

A gate is not just a command name. Read each entry as: why the gate exists,
when and how it is applied, what a concrete pass or failure looks like, and
where its implementation or durable evidence can be inspected. Automated
success never substitutes for an independent review or owner decision.

<!-- PRACTICAL_GATE_GUIDE_START -->
| Gate | Why it exists | When and how it is used | Concrete example | Implementation / evidence |
|---|---|---|---|---|
| `audit:dependencies` | **Are dependency links consistent, source-bound and reviewed for the selected scope?** Validates graph structure, pinned sources, parity scope, completion cycles and exact review digests. New/reopened SDD binds the node digest. The reviewer still checks meaning, completeness and conditions; graph validity is not permission to implement or release. [Files, actors and limits](../gate-review-guide.md#dependency-audit). | Run at Stages 9-19. Structural validity permits drafting; implementation handoff and completion require the selected reviewed scope. Stage 19 full evidence is Phase B only. | A cycle in mandatory completion prerequisites fails. A candidate link remains visible and prevents reviewed readiness; a historical import cannot be approved by changing a color. | [analysis/tools/feature-dependencies.js](../../analysis/tools/feature-dependencies.js); n/a |
| `Bootstrap audits` | **Is the workspace ready to begin governed discovery?** The combined readiness check run before Stage 1. It exercises the starter tools and validates the status, project and environment contracts plus methodology and process-view consistency. The active Bootstrap agent records exact commands and outcomes in bootstrap-gate-report.md, and migration_status.yaml cites that report; green means the governed workspace is usable, not that legacy behavior has been discovered or approved. [Files, actors and limits](../gate-review-guide.md#bootstrap-audits). | Run after initialization and after approved Bootstrap maintenance. Record failed checks in the report and status immediately. Pre-existing documents are preserved: correcting an editable owner file needs scoped permission, not blanket normalization. All required checks must pass before the separately owner-authorized transition to Stage 1. | XPlanner ran the audit-toolkit tests, initializer self-test and status, project, environment, methodology and process-view audits; it recorded a failed methodology-link check and its correction before the final green result. | [analysis/stages/templates/bootstrap-gate-report-template.md](../../analysis/stages/templates/bootstrap-gate-report-template.md); [analysis/stages/bootstrap/bootstrap-gate-report.md](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/bootstrap/bootstrap-gate-report.md) |
| `audit:project` | **Are the project paths and required commands configured for this stage?** Validates that project.yaml is complete and internally consistent: project identity, legacy and target paths, working directories, runtime declarations and stage-specific command slots. It prevents an agent from running checks in the wrong repository or claiming readiness before required project commands are configured. [Files, actors and limits](../gate-review-guide.md#project-audit). | Run during Bootstrap and whenever project paths, target platforms or command entries change. At Stages 17 and 18 it also enforces that the commands required by that stage are no longer null. | If commands.visual_parity is missing when a UI slice reaches Stage 17, audit:project fails before the agent can claim the candidate is build-ready. | [analysis/tools/project-config-audit.js](../../analysis/tools/project-config-audit.js); [config/project.yaml](https://github.com/olsys-ltd/xplanner2/blob/221b5dfc45a18e32149928b0bcc0a8863b699e2a/config/project.yaml) |
| `audit:workbook` | **Can the parity map be used without missing or inconsistent records?** Validates the structure and internal consistency of the parity workbook: required columns, identifiers, allowed states, evidence references, decisions and formulas. Passing proves that the map is mechanically usable and complete in shape; independent review and live walkthrough still determine whether its business meaning is true. [Files, actors and limits](../gate-review-guide.md#workbook-audit). | Run after every parity-map change from Stage 1 through acceptance. It validates workbook structure, evidence links, decisions, row states, formulas and delivery/SDD coverage. | A row marked delivered without a target destination and SDD reference fails, even when the implementation itself exists. | [analysis/tools/workbook-audit.js](../../analysis/tools/workbook-audit.js); [analysis/legacy_user_flows.xlsx](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/legacy_user_flows.xlsx) |
| `Stage 3 outcome gate` | **What legacy behavior was actually observed, and what remains unverified?** Controls the exit from live legacy verification. It requires a walkthrough record with environment, roles, actions, observations and explicit residual unverified scope; when the legacy system cannot be exercised, only a recorded owner decision to simulate or waive the blocked part permits progression. [Files, actors and limits](../gate-review-guide.md#walkthrough-outcome). | Close Stage 3 only after the runnable legacy system has been exercised by applicable roles and channels. Blocked scope needs an explicit owner-approved simulation or waiver decision. | XPlanner recorded desktop and operator observations; inaccessible production-only behavior remained named in stage-03-outcome.md instead of being silently treated as verified. | [analysis/stages/templates/walkthrough-NNN-template.md](../../analysis/stages/templates/walkthrough-NNN-template.md); [analysis/stages/stage-03/stage-03-outcome.md](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-03/stage-03-outcome.md) |
| `Stage 5 owner gate` | **Has the owner chosen the application form and visual direction?** A mandatory human stop before wireframes are produced. The owner must select and record the application form, channels, visual direction and accessibility baseline, or explicitly waive a decision; the agent may prepare options but cannot choose the product experience on the owner's behalf. [Files, actors and limits](../gate-review-guide.md#stage-05-owner-gate). | The agent stops at Stage 5, presents application-form and visual-direction options, and waits for the owner to record the choice. No wireframe generation starts from an inferred preference. | The owner selects a responsive web application and the approved visual baseline in ui-ux-decision.md; that recorded choice becomes the input to Stage 6. | [analysis/prototyping/templates/ui-ux-decision-template.md](../../analysis/prototyping/templates/ui-ux-decision-template.md); [analysis/prototyping/ui-ux-decision.md](https://github.com/olsys-ltd/xplanner2/blob/846e07a8ed92384136932af56231081c908e259d/analysis/prototyping/ui-ux-decision.md) |
| `audit:prototype` | **Does the prototype account for the governed behavior and exact exports?** Reconciles the parity map with screen normalization, the screen manifest, owner decisions and the exported wireframe files and hashes. It detects missing mappings, unjustified screens, stale exports and structural drift, while Stage 7 remains responsible for judging semantic quality and usability. [Files, actors and limits](../gate-review-guide.md#prototype-audit). | Run while Stage 6 builds the prototype and again during Stage 7 control. It reconciles parity rows, normalization, manifest entries, exported wireframes and their hashes. | A background job classified as non-visual passes only with a coverage reason; a UI row with no screen, state or action mapping fails. | [analysis/tools/prototype-audit.js](../../analysis/tools/prototype-audit.js); [analysis/prototyping/screen-normalization.json](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/prototyping/screen-normalization.json) |
| `audit:prototype:approved` | **Are these the exact wireframes that passed control and owner approval?** The final prototype gate after independent control and owner review. It reruns the structural prototype checks and requires ui-ux-approval.md to reference the exact closing review, manifest and export-set version, preventing coding from using wireframes different from those actually approved. [Files, actors and limits](../gate-review-guide.md#prototype-approved-audit). | Run after the Stage 8 owner decision and whenever approved prototype inputs are consumed later. It requires the approval to pin the exact closing review, manifest hash and export-set version. | Editing screen-manifest.json after approval changes its hash and immediately invalidates the gate until the corrected prototype is reviewed and approved again. | [analysis/tools/prototype-audit.js](../../analysis/tools/prototype-audit.js); [analysis/prototyping/ui-ux-approval.md](https://github.com/olsys-ltd/xplanner2/blob/2a57dc5b600b2baf428af692fee25977ed64a787/analysis/prototyping/ui-ux-approval.md) |
| `audit:architecture` | **Is the architecture package complete and internally traceable?** Validates the architecture package as a connected evidence chain. It checks workbook completeness, measurable NFRs, NFR-to-ADR links, required records and diagrams, source provenance and synchronized hashes; passing confirms consistency, while Stage 10 independently challenges whether the decisions are sound. [Files, actors and limits](../gate-review-guide.md#architecture-audit). | Run throughout Stages 9 and 10 while facts, client answers, NFRs, decisions, diagrams and ADRs are assembled. Passing means the evidence chain is complete enough for independent challenge. | A measurable availability NFR with no linked architecture section or ADR causes the audit to fail before owner review. | [analysis/tools/architecture-audit.js](../../analysis/tools/architecture-audit.js); [analysis/architecture/architecture-nfr-manifest.json](https://github.com/olsys-ltd/xplanner2/blob/4a9591a3a15db69e577ef510b7d57a20824d4e3d/analysis/architecture/architecture-nfr-manifest.json) |
| `audit:architecture:approved` | **Did the owner approve this exact architecture set?** The owner-approved architecture checkpoint. It requires a green architecture audit and a valid review verdict pinned to the same workbook, Markdown records, ADRs, diagram and manifest, so later stages cannot rely on an unreviewed or silently modified architecture set. [Files, actors and limits](../gate-review-guide.md#architecture-approved-audit). | Run after the owner reviews the architecture and again whenever downstream work depends on it. The owner record and every pinned architecture hash must describe the same approved set. | A changed ADR after owner sign-off makes the manifest or owner-review hash stale, so SDD work cannot rely on the modified decision silently. | [analysis/tools/architecture-audit.js](../../analysis/tools/architecture-audit.js); [analysis/architecture/architecture-nfr-owner-review.md](https://github.com/olsys-ltd/xplanner2/blob/4a9591a3a15db69e577ef510b7d57a20824d4e3d/analysis/architecture/architecture-nfr-owner-review.md) |
| `audit:architecture:closure` | **Are all applicable items verified against the currently approved architecture?** Checks that the exact current owner-approved architecture has a separate passed Stage 12 closure report, complete item coverage and no unresolved findings. It validates recorded integrity, not the truth of a claimed fix. [Files, actors and limits](../gate-review-guide.md#architecture-closure-audit). | Run to close Stage 12 and before the Stage 13 handoff. It includes the approved architecture gate and checks the current separate closure record. | A missing owner item, stale owner-record hash, mismatched scope, old stage entry or unresolved finding prevents closure. | [analysis/tools/architecture-review-records.js](../../analysis/tools/architecture-review-records.js); [analysis/stages/stage-12/architecture-closure-001.md](https://github.com/olsys-ltd/xplanner2/blob/1ef0436c6753b08dbf7fc82b07650361b27706eb/analysis/stages/stage-12/architecture-closure-001.md) |
| `audit:knowledge` | **Is this knowledge package structurally valid and tied to unchanged sources?** Validates the knowledge manifest, bundle structure, concept metadata, links and exact source hashes. Detects stale or missing bindings; the independent Stage 14 reviewer checks whether the synthesis preserves the meaning and coverage of the approved sources. [Files, actors and limits](../gate-review-guide.md#knowledge-audit). | Run after Stage 13 synthesis and before SDD/review work consumes the OKF bundle. It checks declared concept metadata, links and unchanged source hashes; Stage 14 checks semantic fidelity and completeness. | A session-management concept that cites an old architecture hash fails instead of teaching the design agent a stale rule. | [analysis/tools/knowledge-audit.js](../../analysis/tools/knowledge-audit.js); [analysis/knowledge/README.md](https://github.com/olsys-ltd/xplanner2/blob/221b5dfc45a18e32149928b0bcc0a8863b699e2a/analysis/knowledge/README.md) |
| `audit:sdd` | **Is the written SDD internally consistent enough to submit to independent control?** Checks required SDD files and sections, requirement/task references, traceability, assumption and impact policies, and applicable approved UI bindings. The Stage 16 reviewer separately checks the author handoff, requirement meaning and alignment with architecture, NFRs and target surfaces. [Files, actors and limits](../gate-review-guide.md#sdd-audit). | Run at Stages 15 to 17. The current command scans all numbered feature directories, validating spec, plan, tasks, traceability, assumptions, impact scope and applicable prototype bindings. | A decimal-duration requirement with no implementation task or test path blocks the slice before coding. | [analysis/tools/sdd-audit.js](../../analysis/tools/sdd-audit.js); [specs/067-project-context-navigation-refinement/spec.md](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/specs/067-project-context-navigation-refinement/spec.md) |
| `Stage 16 owner gate` | **Has independent review passed, and did the owner authorize this exact implementation?** A mandatory human stop after the independent SDD review. The owner sees the exact slice scope, assumptions, exclusions and review findings and must approve or request correction; this prevents the agent from turning an interpretation or unresolved assumption into code without authority. [Files, actors and limits](../gate-review-guide.md#stage-16-owner-gate). | After an independent Stage 16 review, the agent shows the exact slice scope, exclusions and every disclosed assumption to the owner and waits for approval or correction. | If the SDD assumes that an administrator may bypass a restriction, the owner must explicitly approve or replace that rule before Stage 17. | [.specify/templates/spec-template.md](../../.specify/templates/spec-template.md); [analysis/migration_status.yaml](https://github.com/olsys-ltd/xplanner2/blob/8b15050d282d47aa352a10146fb2064f4f72eb97/analysis/migration_status.yaml) |
| `Project CI` | **Does this exact code revision pass the configured engineering checks?** The project's executable engineering quality gate for the delivery candidate. It runs the configured formatter, analyzers, build, tests, migrations, coverage and stack-specific architecture rules; passing proves the revision meets declared technical checks, not that live behavior or owner acceptance has occurred. [Files, actors and limits](../gate-review-guide.md#ci-gate). | Run on the exact Stage 17 delivery candidate. The configured project command executes the stack-specific formatter, analyzers, build, tests, migration checks, coverage and architecture rules. | XPlanner build/ci.ps1 restores locked dependencies, formats, builds .NET and Angular, runs architecture, unit, integration and browser tests, and enforces changed-line coverage. | [config/project.template.yaml](../../config/project.template.yaml); [build/ci.ps1](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/build/ci.ps1) |
| `audit:target` | **Do the declared target surfaces have concrete actions and traceable evidence?** Validates the target inventory, configured adapter observations, source/test references and placeholder markers. Declared useful actions must have traceable evidence; live Stages 18 and 19 establish that the role-specific behavior actually works. [Files, actors and limits](../gate-review-guide.md#target-audit). | Run from Stage 17 through acceptance against the declared target-surface inventory and deterministic observations. Every route, screen, role, API or job must expose a useful evidenced action. | An HTTP 200 page containing only a placeholder does not satisfy the declared task-time action and fails audit:target. | [analysis/tools/target-surface-audit.js](../../analysis/tools/target-surface-audit.js); [analysis/inventories/target-surface-inventory.json](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/inventories/target-surface-inventory.json) |
| `audit:ui-parity` | **Does the implemented interface match the exact approved prototype?** Compares implemented UI surfaces with the exact owner-approved wireframes and manifest. Browser checks verify required labels, geometry, styles, role variations, states and representative content, while recorded tolerances distinguish acceptable rendering differences from real visual or behavioral regressions. [Files, actors and limits](../gate-review-guide.md#ui-parity-audit). | Run locally for every UI-impacting Stage 17 slice and repeat against the public Stage 18 revision. It uses the owner-approved wireframes and manifest as the expected source, never implementation screenshots. | XPlanner fails when a button has the right label but wrong typography, when a declared hover state is not exercised, or when a changed screen is absent from the parity test scope. | [analysis/tools/ui-parity-audit.js](../../analysis/tools/ui-parity-audit.js); [build/ui-parity.ps1](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/build/ui-parity.ps1) |
| `audit:environment` | **Are we configured for the intended server and approved connection?** Separates structural Bootstrap validity from remote readiness. A new empty contract is valid only before remote use; --require-configured and delivery/completion require configured environments. Checks identity, host pins, roots, endpoints and applicable secret policy. Never grants access or renews approval. [Files, actors and limits](../gate-review-guide.md#environment-audit). | Run structurally during Bootstrap. Before every remote operation use --require-configured; delivery and completion also reject an empty configuration. Configured environments validate identity, host pins, roots, endpoints and applicable credential policy without connecting. | An empty environment map passes Bootstrap but fails remote readiness. An expired embedded-key exception blocks access; initialization never extends it. | [analysis/tools/environment-config-audit.js](../../analysis/tools/environment-config-audit.js); [config/environments.yaml](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/config/environments.yaml) |
| `audit:delivery` | **Is this exact revision deployed with useful live proof and rollback readiness?** Validates that the exact candidate revision is live and supported by delivery evidence. It checks public reachability, smoke evidence, real role-based journey, deployed visual parity, recovery readiness and the required live-reconciliation structure and bindings. A missing section or recorded unresolved coverage blocks Stage 18 closure; agents must still judge evidence meaning and completeness before independent acceptance. [Files, actors and limits](../gate-review-guide.md#delivery-audit). | Run before Stage 18 closure against the immutable delivery record and exact deployed revision. It checks the governed connection, smoke evidence, real browser journey, deployed visual parity, rollback readiness and the required Live Reconciliation section. | A green health endpoint is insufficient when the XPlanner login form journey cannot reach and exercise the changed task-time screen. | [analysis/tools/delivery-record-audit.js](../../analysis/tools/delivery-record-audit.js); [analysis/stages/stage-18/current-delivery-record.txt](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-18/current-delivery-record.txt) |
| `audit:sdd:slice` | **Are all included tasks and parity obligations actually closed?** Closes the SDD and parity obligations after delivery. Every row included in the slice must link to implemented target evidence and a final disposition, while deferred or excluded rows require an explicit governed reason; this prevents partial work from appearing complete through missing traceability. [Files, actors and limits](../gate-review-guide.md#sdd-complete-audit). | Run after delivery for delivery.active_slice and transitive completion dependencies from the SDD-bound graph (or unchanged pre-policy declarations). Missing scope blocks. Unrelated future slices may remain planned; audit:sdd:complete checks all slices for final completion. Recorded links are not passed tests. | A delivered feature whose tasks.md still has an unchecked implementation task cannot be reconciled as complete. | [analysis/tools/sdd-audit.js](../../analysis/tools/sdd-audit.js); [specs/067-project-context-navigation-refinement/tasks.md](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/specs/067-project-context-navigation-refinement/tasks.md) |
| `audit:stage19 / audit:all` | **Is the delivered scope ready for acceptance, or is the entire migration complete?** audit:stage19 checks the exact delivered acceptance scope before owner sign-off without demanding global complete. audit:all includes the strict completion audit and validates the final complete record after explicit owner authorization; neither command supplies independent review or human approval. [Files, actors and limits](../gate-review-guide.md#all-audits). | PM coordinates audit:stage19 for the exact delivered scope and receives the independent QA report. After full-system acceptance and explicit final owner authorization, PM records complete and runs audit:all to validate that completion. QA never edits shared status. Unrelated open slices do not imply a complete migration. | A slice can pass audit:stage19 while later slices remain open. audit:all stays unavailable until final completion is recorded and validates that full evidence chain. | [analysis/tools/package.json](../../analysis/tools/package.json); [analysis/tools/package.json](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/tools/package.json) |
| `Final owner acceptance` | **Does the owner accept the delivered result and its remaining scope?** The final human decision for a delivered slice or the completed migration. A clean independent acceptance report is necessary evidence but does not authorize acceptance by itself; the owner must review the outcome, residual scope and findings, then explicitly sign acceptance or send work back. [Files, actors and limits](../gate-review-guide.md#stage-19-owner-gate). | After a clean independent Stage 19 report, the owner reviews delivered behavior, evidence, residual scope and findings, then explicitly accepts the slice, starts the next slice or returns work. | The reviewer can recommend acceptance, but only the owner decision recorded in migration_status.yaml can mark the XPlanner slice accepted. | [analysis/stages/templates/stage-19-pass-NNN-template.md](../../analysis/stages/templates/stage-19-pass-NNN-template.md); [analysis/migration_status.yaml](https://github.com/olsys-ltd/xplanner2/blob/8b15050d282d47aa352a10146fb2064f4f72eb97/analysis/migration_status.yaml) |
<!-- PRACTICAL_GATE_GUIDE_END -->

## Saving the workbook

Every script that edits [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) must persist it with
`writeWorkbookFile(workbook, file)` from `xlsx-package.js`, never with
`workbook.xlsx.writeFile`. The pinned library serializes the worksheet
`<sheetPr>` children as `pageSetUpPr` before `outlinePr`, which violates the
ECMA-376 `CT_SheetPr` sequence and makes Excel refuse the file — while the
library still reads it back without complaint. The governed workbook requires
both outline grouping and fit-to-page, so a plain write always triggers this,
including a read-then-write round trip of the blank template.
`audit:workbook` inspects the stored parts and fails closed on the wrong order.
It also rejects duplicate `[Content_Types].xml` overrides, including the exact
package defect that makes Excel Desktop request recovery while tolerant readers
still accept the workbook.

After changing Destination or SDD status cells, run
`npm --prefix analysis/tools run sync:workbook-progress`. It rewrites each
visible epic label as `Name (N%)`, where N is the rounded share of fully closed
child rows. `audit:workbook` recalculates the same value and fails when the
label is absent or stale, so the collapsed workbook always reports real flow
progress. The same command refreshes the single-cell overall progress bar in
`User Flows!A3:N3`; its percentage is fully closed scenario rows divided by all
scenario rows, so deferred scope remains visible in the denominator.
Exports produced by an external spreadsheet editor must additionally restore
worksheet print settings and governed row grouping from the pre-edit workbook
with `copyWorksheetPrintSettings(...)` and
`copyWorksheetOutlineSettings(...)`, then call
`normalizeWorkbookFile(...)` before the audit. All helpers are exported by
`xlsx-package.js`. Outline metadata may be copied only between workbooks with
the same populated row layout. Never copy row positions from the blank template
into a populated parity map; use
`reconcileWorksheetOutlineHierarchy(workbook)` followed by
`writeWorkbookFile(...)` when the populated row positions are authoritative.
After the structural audit and render, run `npm run audit:workbook:excel` on a
Windows machine with Excel installed. A clean desktop open is mandatory evidence;
a recovery prompt blocks delivery.

The structural workbook audit also requires the governed epic hierarchy:
scenario rows remain collapsed at outline level 1 while epic banners stay
visible and worksheet outline summaries stay above their detail rows
(`summaryBelow = false`). This preserves Excel's `+ / -` expansion controls
without hiding the epic/root that is being expanded; rows hidden without
outline metadata or with the wrong summary direction are rejected.

## Pinned workbook dependency

Workbook audits use the exact `@excel.js/exceljs@0.9.0` package. This is an
intentional security pin: during the 2026-07-29 starter hardening,
`npm audit --audit-level=high` reported zero vulnerabilities for this package
set, while replacing it with `exceljs@4.4.0` introduced nine high-severity
transitive findings. Change the package only through a reviewed dependency
update that preserves workbook behavior and returns the high-severity audit to
zero.

Every missing, malformed, unpinned, or contradictory input fails. The only
skip is an exact scope-aware owner waiver. It must first pass the canonical
[`analysis/migration_status.schema.json`](../migration_status.schema.json) and be recorded as one owner decision:

```yaml
owner_decisions:
  - id: waiver:prototyping_retroactive:exact-scope-id
    decision: approved
    decided_by: project owner
    decided_at: '2026-07-28T10:00:00Z'
    scope: exact-scope-id
    rationale: Durable explanation of the exceptional decision.
    record: analysis/stages/waivers/exact-scope-id.md
    residual_risk: The unavailable behavior remains unverified and must stay visible through acceptance.
    permitted_next_stage: stage-06
```

The complete gate registry is:

| Gate | Permitted next stage |
|---|---|
| `legacy_walkthrough_fallback` | `stage-04` |
| `application_form_style` | `stage-06` |
| `prototyping_retroactive` | `stage-06` |
| `architecture_retroactive` | `stage-09` |
| `pre_sdd_knowledge` | `stage-15` |

Every ID is `waiver:<gate>:<exact-scope>` so one gate can have independently
auditable decisions for multiple scopes. These identifiers and target stages
are fixed governance vocabulary, not project configuration.
The permitted stage must match the exact fallback defined by the methodology.
A waiver never marks a stage complete. A clean independent review must verify
the waiver, its scope, evidence, and residual-risk treatment before the
transition can close.

When `knowledge-manifest.json` is absent, `audit:knowledge` accepts only the
registered `pre_sdd_knowledge` waiver whose exact scope equals
`delivery.active_slice`. Success is reported as a bounded skip: it permits
that slice to enter Stage 15 but never claims that the global architecture or
OKF knowledge chain is complete. Missing, ambiguous or mismatched scope fails
closed.

`audit:environment` accepts an exact unconfigured template during Bootstrap,
explicitly reporting that no remote access is ready. Before every remote action
run `npm --prefix analysis/tools run audit:environment -- --require-configured`.
Delivery, deployed/accepted slice status and completion also require a configured
environment. Configured contracts validate identity, host pins, connection command,
roots and endpoint syntax. Embedded keys additionally require an unexpired
temporary-secret approval and private repository; empty contracts and external
key references do not require that exception. Initialization never copies or
renews it. The audit never attempts a network connection; `remote:check` performs
the governed live verification only after configuration validation succeeds.

`audit:delivery` is the Stage 18
fail-closed gate. It validates the durable delivery record and then performs
the governed live connection check, including exact hostname and kernel
matching. It resolves the immutable record through
`analysis/stages/stage-18/current-delivery-record.txt`; recorded observations
without that live check cannot close delivery. It also executes the governed
`commands.user_journey` command. For web systems that command must submit the
real deployed form in a browser and reach an authenticated destination; API,
HTTP status, mocked routes, and health checks cannot substitute for it. The
command receives `DELIVERY_EVIDENCE_MODE=verify-only` during a delivery audit
and must rerun without creating or overwriting immutable evidence. Evidence is
created only by an explicit exact-revision `persist` pass. Role fixtures and
browser steps must share one stable entity identity, or use the exact same
production filter and ordering under a regression test. The
record's slice must equal `delivery.active_slice`, its deployed revision must
belong to the current Git lineage, and every changed surface must have a
passed, evidenced smoke action.

`--scope=<id>` and audit environment overrides exist only for isolated
regression fixtures. CI and governed project runs must derive scope and paths
from committed canonical files.

## Target Adapters

The target audit has no framework parser. An inventory declares one or more
adapters. A JSON adapter maps fields from a deterministic generated catalog:

```json
{
  "id": "route-catalog",
  "type": "json",
  "file": "build/audit/routes.json",
  "collection": "routes",
  "mapping": {
    "surface_id": "inventoryId",
    "kind": "kind",
    "destination": "path",
    "roles": "roles",
    "visible": "visible"
  }
}
```

Executable module adapters are forbidden in the governed inventory because
they could read or mutate the repository, access the network, or manufacture
self-confirming observations. Framework-specific discovery runs through the
configured build or test command and writes a deterministic JSON catalog; the
target audit only reads that committed or CI-generated JSON.

Each implemented surface must declare useful actions with SDD, code, and test
references. Test references include an exact name after `#`; the referenced
line carries `@surface:<id>` and every applicable `@role:<role>` binding.

## Approval Pins

Stage 8 approval pins `Approved export set version` and
`Screen manifest SHA-256`. Stage 11 verdict pins `Document set version`,
`Manifest SHA-256`, `Architecture Draw.io version`, and
`Architecture Draw.io SHA-256`. Any changed byte invalidates the approval.

`workbook-audit.js --config=<json>` can override sheet names, columns, row
ranges, and revision patterns while preserving the same fail-closed
color/status and revision-coverage invariants.

`audit:sdd` is the design-ready gate: every numbered feature must contain
non-placeholder `spec.md`, `plan.md`, and actionable `tasks.md`, with the
feature referenced from `specs/traceability.md`. Open tasks are expected before
implementation. `audit:sdd:slice` is the delivery gate and additionally
requires all tasks in the active slice and its transitive Completion dependencies to be checked. `audit:sdd:complete` retains global closure and is required by `audit:all`. Unrelated planned slices do not block slice completion; structural checks still cover all features.

`specs/traceability.md` must also contain `Parity Map Delivery Contracts`.
`audit:sdd:slice` resolves its exact row numbers against
[`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx); delivered rows must be green with destination
and SDD evidence, while deferred rows must be explicitly recorded.
At Stage 17, `audit:sdd` verifies the exact committed code, tests, SDD and
review candidate without pretending that the candidate is already deployed.
The status-driven `sdd-completion-policy.js` requires
`audit:sdd:slice` only after `delivery.slice_status` becomes `deployed` or
`accepted`. Until then, only exact deployment and records reconciliation tasks
may remain open; implementation tasks may not. After Stage 18 proves the exact
revision, a records-only descendant may update the workbook, status, immutable
delivery evidence, review record and checkbox-only task completion. Admitted new
error-prevention rows may be appended to the existing checklist; no previous
row or prose may change. Refinement/pruning proposals wait for an authorized
maintenance or newly reviewed candidate revision, without deferring required checks. Existing `specs/traceability.md` rows may append immutable slice-bound Stage 18 report links in evidence cells only; other fields cannot change. Run
`verify-attestation-history.js` against the deployed candidate to reject any
runtime, build, deployment, configuration, requirement or plan change hidden
inside that reconciliation history. `audit:delivery` additionally verifies the
delivery record's workbook SHA-256 and exact parity-closure table. Code, SDD
and the workbook therefore cannot pass independently while disagreeing.

For browser delivery evidence, `verify-user-journey.js` validates the changed
surfaces and exact revision/parity annotations in the raw Playwright JSON.
Persist mode writes two immutable content-addressed files beside each other:
the untouched `*-playwright.json` report and a `*-live.json` summary that names
the raw file and pins its SHA-256. A summary without its matching raw report is
not sufficient evidence.

`audit:acceptance` requires `migration_status.yaml` to be at `complete`,
verifies every recorded durable evidence path, and reconciles each completed
slice with its specification, plan, checked tasks, delivery record, live
reconciliation section, and acceptance report.

`audit:stage19` checks the delivered acceptance scope and its governed evidence
before owner sign-off. It does not require unrelated slices to be finished and
does not replace the independent review or owner decision.

`audit:all` adds the strict completion check. Run it only after full-system
acceptance, explicit final owner authorization, and recording `complete`.
It validates that completion record; it never supplies authorization itself.
During earlier stages, run the individual audits named by the active stage.

The shared [stage gate contract](../stage-gates.json) supplies the matrices in
MIGRATION, Markdown, HTML and Draw.io, and the gate requirements in 3D.
After changing that contract, run `sync:stage-gates`; `audit:stage-gates` and
`audit:views` reject stale copies. The [record profiles](../record-contracts.json)
define the evidence sections shown in presentation views. Starter maintainers
regenerate those views with the Process Canvas guidance generator; project
agents fill the linked templates, not the presentation profiles.

`audit:views` checks that the human explanations of the process still agree
with the executable contract. It verifies the Stage 0-19 names in the HTML and
3D views, the principal Bootstrap/process markers in Draw.io, every artifact
and gate reference in the Process Canvas, the HTML stage text and Markdown
return table against `migration_status.schema.json`, the phase-level Draw.io
return labels, and that `data.json` was regenerated from
`build-data.js`. New initializations copy the Process Canvas and check its
target-aware guidance alongside HTML and Draw.io. Older initialized projects
without a canvas still check their copied HTML and Draw.io views; adding a 3D
runtime is not a prerequisite for continuing their existing migration.
It also checks [`analysis/artifact-naming.json`](../artifact-naming.json): every template has an output
mapping with the same filename stem, and Markdown/YAML templates declare that
output. For example, `walkthrough-NNN-template.md` cannot map to `outcome.md`.
This validates the starter's naming contract, not historical project filenames.
`audit:ui-parity` is the Stage 17 visual gate. It pins execution to the exact
owner-approved export set and screen-manifest hash, then runs the project's
configured `commands.visual_parity`. The command must fail on missing changed
screens, states, icons, desktop/mobile coverage, or screenshot drift. It must
never regenerate expected snapshots from the implementation during a normal
gate. `commands.visual_parity.minimum_similarity_percent` is mandatory and
cannot be lower than 95. This is only the visual-similarity floor: approved
screens, states, roles, actions, content, and icons require 100% coverage.
Deterministic exact-snapshot checks may set the threshold to 100 and are
stronger. A numeric scorer must fail below the configured value; a command
without a numeric scorer must prove an equivalent or stricter deterministic
comparison. The audit passes the value as
`UI_PARITY_MIN_SIMILARITY_PERCENT`. `audit:ui-parity:deployed` repeats the same contract against the public
Stage 18 revision; `audit:delivery` invokes that deployed mode automatically.
The audit also scans each pinned HTML wireframe for source-declared interaction
markers. A declared hover must appear explicitly in both the SDD states
contract and its automated assertion; generic states wording fails before the
project test command runs. The browser test must then perform the hover and
check both the source-derived pre-interaction computed style and the computed
result after hover. Checking only the hovered result can hide an incorrect
permanent hover style, so that contract fails before the project command runs.
Every screen also requires a `content fidelity` contract. The audit detects
standalone placeholder values such as `—`, `N/A`, `Not set` and `None` in the
approved HTML and requires that exact marker in both the SDD value and browser
assertion. The broader content preflight is defined in
[`analysis/prototyping/ui-visual-parity-checklist.md`](../prototyping/ui-visual-parity-checklist.md).
The auditor reads `Change Impact and Verification Scope` from the active SDD.
In `delta` mode it checks the active approved surfaces plus exact affected
`delivery.ui_parity_corrections`; `expanded` requires the active SDD to list all
affected shared surfaces; `full` also adds every slice in the permanent
`delivery.delivered_ui_slices` inventory. The inventory remains durable, but
unrelated delivered screens are not rerun on every feature. The audit rejects
a governed SDD without an explicit mode.

`audit:sdd` also enforces the seven-dimension impact table and requires the
plan to preserve the spec's mode, baseline, trigger assessment, selected and
excluded checks, and re-entry triggers. The independent Stage 16 reviewer may
expand an under-declared scope; implementation may not proceed with an
unresolved blast radius.

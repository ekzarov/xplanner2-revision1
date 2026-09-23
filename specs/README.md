# Feature Specifications

**Shared UI sources.** For visual scope, follow [the shared UI procedure](../analysis/prototyping/ui-design-system-guide.md). Stage 15 maps controls to approved screen/variant IDs and token names, then plans shared theme/components before dependent screens. Stage 16 verifies the bindings; Stage 17 verifies rendered reuse. Do not create a competing palette or silently invent variants.

**Reading technical statuses.** `Draft` (proposal), `assumptions-recorded` (assumptions documented for review), and `authored` (the document was prepared) are not permission to implement. `implemented` (code exists with cited evidence), `deployed` (released to the named environment), and `accepted` (the named scope has acceptance evidence) require separate records. [Status meanings](../analysis/artifact-status-meanings.md).

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>feature-dependencies.json</summary>

**What must be agreed or delivered before this slice, and what depends on it?**

One source-backed graph of bounded delivery slices, linked to parity rows and SDD. Arrows point from provider to consumer. Contract links constrain design; completion links expand delivery scope. It records conditions, evidence and unknowns, not a second requirements list or editable completion status.

- **Created by:** The Stage 9 agent proposes source-backed bounded slices; the coordinator creates the graph.
- **Maintained / decided by:** The coordinator records Stage 9/15 changes and exact independent review bindings. Reviewers challenge scope; the human owner decides priorities and scope changes.
- **Instructions:** Stages 9-19; analysis/feature-dependencies-guide.md. Stage 19 full graph is Phase B only.

**When used:** Created at Stage 9 and refined at Stage 15; independently checked at Stages 10/16. Stages 11-14 and 17-19 read it. Stage 19 full graph is Phase B only. SDD binds its node digest; completion follows confirmed completion edges transitively.

**Example:** Illustrative: an effort report needs an agreed time-entry read contract for design, then working time-entry delivery for completion. These are distinct links. Missing review or candidate links do not mean ready.

</details>
<details>
<summary>specs/NNN-*/spec.md</summary>



The requirements contract for one bounded implementation slice. It states user scenarios, functional requirements, acceptance criteria, edge cases and governed source links without prescribing code-level implementation.

- **Created by:** The Stage 15 design agent authors the feature specification from parity, prototype, architecture and verified knowledge.
- **Maintained / decided by:** The design agent revises requirements after findings; the human owner decides disclosed assumptions and scope at Stage 16.
- **Instructions:** Stage 15 and Stage 16 owner assumption review

**When used:** Stage 15 writes one spec for a bounded slice. It defines behavior, acceptance criteria, edge cases and approved assumptions without prescribing code.

**Example:** The task-time spec requires decimal durations, a description and role-based access, each linked to its parity rows and NFRs.

</details>
<details>
<summary>specs/NNN-*/plan.md</summary>



The technical implementation plan for the approved slice. It translates requirements and architecture constraints into component, data, interface, testing and rollout decisions while keeping work inside the agreed scope.

- **Created by:** The Stage 15 design agent writes the implementation plan from the feature specification and approved architecture.
- **Maintained / decided by:** The design agent updates the plan after review or an authorized source change.
- **Instructions:** Stage 15

**When used:** Created after the spec to explain how the slice fits the approved architecture, data model, interfaces, tests and rollout constraints.

**Example:** The plan assigns time-entry validation to the application layer and cites the accepted identity and persistence ADRs.

</details>
<details>
<summary>specs/NNN-*/tasks.md</summary>



The dependency-ordered checklist used to implement the slice. Each task is concrete and verifiable, links back to the plan or requirement it closes, and makes unfinished or blocked work visible before coding is declared complete.

- **Created by:** The Stage 15 design agent decomposes the specification and plan into ordered implementation tasks.
- **Maintained / decided by:** The Stage 17 implementation agent records execution and evidence; design changes return to the responsible design stage.
- **Instructions:** Stage 15 task generation and Stage 17 execution

**When used:** Generated from the approved spec and plan as the ordered implementation checklist. Stage 17 closes tasks only with verifiable evidence.

**Example:** Separate tasks add decimal parsing, persistence, browser coverage and documentation, with dependencies stated in execution order.

</details>
<details>
<summary>specs/traceability.md</summary>

**Which requirements are covered by design, implementation and tests, and where are the gaps?**

One shared index for the entire migration: which slice covers each behavior or approved target requirement, which design and prototype apply, and where implementation and verification evidence can be found. It grows with the number of slices; read the relevant slice instead of the whole file. It is not another specification or a standalone verdict that everything works.

- **Created by:** The Stage 15 design agent creates links from behavior and approved sources to specifications and tests.
- **Maintained / decided by:** Agents in design, implementation and acceptance maintain their evidence links without changing source decisions implicitly.
- **Instructions:** Stage 15-19 traceability contract

**When used:** Stage 15 links each slice to spec, plan, tasks and planned checks in Slice Verification Index; Stage 16 independently checks requirement-to-check coverage. Stages 17-19 link actual execution and deployed/acceptance records with checked versions, observations and gaps. audit:sdd validates the index file links and planned/missing/recorded states; completion mode requires recorded evidence links. recorded means observations exist, not passed. Independent reviewers inspect test outcomes and coverage; existing delivery gates still apply.

**Example:** For XPlanner 029, the delivery contract assigns rows 260-263; prototype coverage names iteration-accuracy and inherited screens; legacy coverage maps the rows to FR-2901 through FR-2915. Follow those references to the actual spec and evidence; the index alone does not certify the report.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

- **Owner-reviewed assumptions required from feature sequence**: 001
- **Impact-scoped verification required from feature sequence**: 001

Before implementation, every governed feature `spec.md` contains an
`Owner-Reviewed Implementation Assumptions` section. The agent exposes each
implementation-shaping inference, its basis and impact. The owner then chooses
`approved-as-proposed` (including the instruction "implement as proposed") or
`corrected-by-owner`; the original proposal and final decision both remain in
the SDD. A genuine zero-assumption slice records `no-assumptions` and still
requires explicit owner review. Pending, hidden, incomplete, or unreviewed
assumptions fail `audit:sdd`.

For new/reopened slice completion, Stage 15 binds the canonical dependency graph and Stage 16 checks its conditions and scope. `audit:sdd:slice` follows confirmed completion edges transitively from `delivery.active_slice`. Below the explicit compatibility threshold, old declarations retain their meaning; missing historical declarations require a reviewed update before a new completion claim. `audit:sdd:complete` retains whole-system scope.

Every governed feature also records a `Change Impact and Verification Scope`
before implementation. `delta` covers the slice and its evidenced direct
dependents; `expanded` covers a shared subsystem; `full` is reserved for a new
baseline, unknown blast radius, broad map/architecture change, a scheduled
checkpoint, or final acceptance. The SDD names selected checks, justified
exclusions, and re-entry triggers. A reviewer may expand an under-declared
scope, but neither author nor reviewer may shrink it without evidence.

An initialized project that adopts this rule after completed delivery may set
the sequence above to its next new feature. Earlier features remain historical,
but any older feature reopened after adoption must use the new section.

The starter contains only
[`traceability.template.md`](traceability.template.md). When Stage 15 begins,
the Stage 15 agent creates `specs/traceability.md` and keeps it synchronized with each
feature-specific `spec.md`, `plan.md`, and `tasks.md`.

**Required evidence-link contract:** follow [traceability-guide.md](traceability-guide.md).
Every numbered slice has a `Slice Verification Index` row linking SDD, planned
checks and separately recorded results. Missing execution evidence is explicit;
`recorded` means observations exist, not that they passed. The agent uses
[verification-record.template.md](verification-record.template.md) when no
suitable execution record exists. Stages 15-19 have distinct authoring and
independent-check obligations; neither a plan nor owner approval proves a test.

Design consumes both the approved architecture set and the verified knowledge
bundle. `spec.md` names the applicable stable OKF concept ids; `plan.md` names
the ADRs and NFR criteria that constrain the implementation; `tasks.md` carries
those bindings into executable work and evidence. OKF does not replace the
architecture, and a plan cannot establish a new architecture decision. A
missing concept returns to Stage 13; a missing or changed architecture decision
returns to Stage 9.

The `Parity Map Delivery Contracts` section is mandatory and machine-readable.
It is consumed by `audit:sdd:complete` and `audit:delivery`; free-form
traceability text does not replace exact workbook row numbers or a target-only
owner decision.

For Stage 17, a complete feature has checked implementation tasks and workbook
target evidence pointing to its exact committed code, tests, and review
candidate, while its rows remain in an honest pre-deployment state. Only exact
post-merge deployment/reconciliation tasks may remain open in `tasks.md`.
Stage 18 separately pins the deployed revision, live journey, and workbook
SHA-256 in its delivery record; live-proof and acceptance reports are not SDD
tasks. The delivered rows may then turn green and `audit:sdd:complete` may pass.

Every `spec.md` also owns an **Approved Prototype Contract**. UI slices pin the
approved export-set version plus exact screen ids and SHA-256 values and record
implemented/deferred elements. Non-UI slices explain why no prototype applies.
The SDD audit fails when these records are absent or do not match the approved
manifest.

Project agents create those feature artifacts only after the governed
reconnaissance, requirements, prototyping, architecture, and knowledge gates
permit SDD.

## Feature Dependency Policy

Feature dependency checks required from feature sequence: 001

Follow [the dependency graph contract](../analysis/feature-dependencies-guide.md). New and reopened slices use `Completion dependencies: graph` plus `Dependency scope SHA-256` in their Change Impact and Verification Scope. The graph is the only maintained dependency list; the SDD digest pins its reviewed node scope. Historical untouched slices retain their original evidence; reopening adopts the new rule. A historical reconstruction is never an approval.

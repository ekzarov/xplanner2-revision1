# Migration Review Records

**Shared UI comparisons.** Follow [the shared UI procedure](../prototyping/ui-design-system-guide.md): Stage 7 compares exported screens/components with catalogue states and token values; Stage 16 checks SDD bindings and planned evidence; Stage 17 peer review checks actual reuse and rendered states. Stage 19 receives neutral expectations first and the full source records only in Phase B. Record expected/actual mismatches and unverified scope in the existing numbered report.

**Reading technical statuses.** `clean` (the declared scope meets clean-pass rules), `findings` (discrepancies require disposition), `blocked` (required checks could not finish), and `invalid` (the attempt is unusable) keep their canonical spelling. Historic `ready-with-minor-fixes` (corrections still named) is not an extra clean-pass value. Immutable reports retain their bytes. [Status meanings](../artifact-status-meanings.md).

New records follow [artifact result boundaries](../artifact-result-boundaries.md):
established results, open differences or decisions, unverified scope and next
action stay distinct. The record family determines what counts as evidence;
planned work, owner approval and independent verification are not interchangeable.

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>stage-02-pass-NNN.md</summary>



A timestamped independent review of the initial reconnaissance. It records the reviewer's eligibility, blind inventory, later comparison with Stage 1, discovered omissions or conflicts, blocked scope and the exact clean or findings verdict. **Phase A: independent discovery. Phase B: reconciliation:** Phase A: inspect the immutable legacy source without reading the filled map, reconnaissance or prior conclusions; Save an A-NNN inventory with source evidence, a durable snapshot reference and access sequence before Phase B; no duplicate Excel or reconnaissance is required; Phase B: open the pinned Stage 1 records and check both directions: discovered behavior to recorded coverage, and recorded claims back to source; Resolve disagreements from the legacy source. Preserve Phase A; record reviewer corrections separately instead of rewriting the first inventory; Report matched, mismatch, not-checked and not-applicable checks with evidence, linked findings/blockers and reconciled totals. The fresh independent reviewer writes one final immutable report. Temporary notes alone are insufficient. Early exposure invalidates the blind pass; findings return to Stage 1. Live verification belongs to Stage 3.

- **Created by:** A fresh independent agent assigned to Stage 2 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 2 independent control and reviewer eligibility

**When used:** The fresh independent agent assigned to Stage 2 first saves the Phase A inventory in the report or a durable linked attachment, with its snapshot identity and input-access sequence. Only then does Phase B open the filled map and reconnaissance and compare both directions against the source. The completed report is immutable; no duplicate canonical Stage 1 files are created.

**Example:** Illustrative: A-007 independently identifies a read-only restriction. Phase B links it to a map row that omits the restriction; C-012 records the mismatch and F-001 returns the correction to Stage 1. A mistaken reviewer interpretation is corrected separately in Phase B.

</details>
<details>
<summary>stage-07-pass-NNN.md</summary>



An independent verdict on the prototype set. It checks that normalization is truthful, required roles and states are represented, navigation is coherent, map coverage is sufficient and the design has not invented unsupported behavior. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 7 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 7 independent control and reviewer eligibility

**When used:** At Stage 7, a fresh independent agent acting as the prototype reviewer creates it after checking coverage, navigation and unsupported invention against the map. A prototype defect returns to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer reports that the read-only role still sees an edit action, so Stage 6 must correct the wireframe.

</details>
<details>
<summary>stage-10-pass-NNN.md</summary>



An immutable independent verdict on the architecture package. It challenges NFR coverage, evidence, system boundaries, contracts and decision reasoning, and verifies that all reviewed files and hashes describe the same version. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 10 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 10 independent control and reviewer eligibility

**When used:** At Stage 10, a fresh independent agent acting as the architecture reviewer writes it after challenging the exact Stage 9 package. An architecture defect returns to Stage 9, a UI-structure defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer detects an integration with no timeout or failure policy and returns that concern to Stage 9.

</details>
<details>
<summary>stage-14-pass-NNN.md</summary>



An independent comparison of the OKF v0.2 bundle with the approved architecture. It verifies concept coverage and source hashes, and reports omissions, duplicates, stale links or rules that were introduced without authority. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 14 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 14 independent control and reviewer eligibility

**When used:** At Stage 14, a fresh independent agent acting as the knowledge reviewer compares the bundle with the approved architecture and writes an immutable verdict before SDD begins. A knowledge defect returns to Stage 13, an architecture defect to Stage 9, a prototype defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer finds a concept that claims an unsupported retry limit and returns the bundle to Stage 13.

</details>
<details>
<summary>stage-16-pass-NNN.md</summary>



An independent verdict on the complete SDD package before implementation. It checks scope, consistency, testability, traceability, disclosed assumptions and alignment with approved requirements, prototype and architecture. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 16 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 16 independent control and reviewer eligibility

**When used:** At Stage 16, a fresh independent agent acting as the SDD reviewer writes it after checking completeness, scope, testability and upstream alignment. The owner then decides on disclosed assumptions. An SDD defect returns to Stage 15, a knowledge defect to Stage 13, an architecture defect to Stage 9, a prototype defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer finds no test for a permission boundary, so the slice returns to Stage 15 before any code is written.

</details>
<details>
<summary>stage-19-pass-NNN.md</summary>



The independent acceptance report for the deployed slice or final system. A reviewer from outside the implementation team verifies useful role-based journeys, required evidence and remaining findings before the owner signs acceptance. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 19 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 19 independent control and reviewer eligibility

**When used:** At Stage 19, a fresh independent third-party agent exercises the scope using expectation-only extracts without implementation status, destination notes, prior test results or findings. The agent saves observations before Phase B opens full originals, verifies extract completeness and reconciles evidence. A clean report is required before owner acceptance. An implementation defect returns to Stage 17, an SDD defect to Stage 15, an architecture defect to Stage 9, and a parity-map defect to Stage 1.

**Example:** The reviewer repeats the task-time journey for member and read-only roles and records a clean verdict against the deployed SHA.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

This directory contains immutable reports for the independent control passes
at Stages 2, 7, 10, 14, 16, and 19. Every attempt leaves a report, including a
clean, findings, blocked, or invalid attempt. Chat text is not a review record.

Start from [`../../MIGRATION.md`](../../MIGRATION.md), then copy
[`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md) to the next report path declared by
the governed project checkpoint.

## Naming

PM publishes every completed attempt through a separate records PR under
[Review And Correction PRs](../migration_methodology.md#review-and-correction-prs),
including negative verdicts. Fixes belong to a later author PR, not this report's
PR. Required CI and owner merge remain mandatory; publication is not acceptance.
The reviewer never commits, pushes or merges on PM's behalf. Once archived, the
report is not changed to append later CI/merge details or author dispositions.

Use `stage-NN-pass-NNN.md`:

- `stage-02-pass-001.md` - control reconnaissance;
- `stage-07-pass-001.md` - wireframe control;
- `stage-10-pass-001.md` - architecture control;
- `stage-14-pass-001.md` - target knowledge control;
- `stage-16-pass-001.md` - design re-verification;
- `stage-19-pass-001.md` - slice or final acceptance.

Pass numbers start at `001` and increase independently within each stage.
Never overwrite or rename an existing report, and never reuse its number.

## Comparison Record Contract

**What matched, what differed, what was not checked, and what was not applicable?**

The fresh independent reviewer records four separate parts in every new
Stage 2, 7, 10, 14, 16 and 19 report:
1. **Comparison Scope:** exact candidate and authoritative sources, full/expanded/delta
   boundary, changed items, dependencies and prior report/check IDs relied on.
2. **Comparison Results:** every check has an ID, expected result and source,
   actual observation, one of matched/mismatch/not-checked/not-applicable,
   evidence and the linked finding/blocker/exclusion ID.
3. **Findings and Blocked Scope:** F-NNN details explain actual differences and
   required corrections; B-NNN explains unavailable checks; E-NNN justifies
   non-applicability with scope evidence and authority where required.
4. **Coverage Summary and Conclusion:** total equals the four result counts;
   finding counts are separate. The verdict follows those results and the
   active stage's exit rule, never the other way round.

A matched item was actually inspected and has evidence. Absence of findings,
a green automated audit, or a previous clean report does not establish a new
semantic match. Unknown or inaccessible scope is not not-applicable.
Any required not-checked item prevents clean closure; preserve already found
mismatches even when the overall result is blocked. Invalid independence or
protocol remains invalid. Stage 7's governed Low-cosmetic exception permits
a findings-based closing pass, not a clean report.

Counts describe the explicit check items. Each independently required
obligation must be represented; groups need an exhaustive linked breakdown.
Do not inflate counts by treating one whole package as a single checked item
or by counting the same obligation repeatedly.

A delta review checks its entire declared delta and direct dependencies.
It links the prior immutable baseline and identifies unchanged prior results
relied on, without counting them as freshly matched. Missing baseline evidence
or an expansion trigger requires expanded/full review under the active-stage
rules. Stage 2 first completes its blind inventory; Stage 19 first completes
its blind live inspection before reconciling previous findings and backlog.

Templates govern new reports. Historical immutable reports retain their bytes
and original verdicts; any explanatory companion is labelled as a reading aid,
not new verification or a replacement acceptance record. Known-at-review
dispositions may be included; future corrections belong in new linked records.

## Results

Each report has exactly one result:

- `clean` - the complete declared scope was checked and no new finding exists;
- `findings` - one or more actionable findings were recorded;
- `blocked` - the complete check could not be performed.
- `invalid` - reviewer eligibility, isolation, revision, scope, or protocol
  rules were violated, so the attempt cannot support a conclusion.

A clean report advances nothing by itself. All stage-specific automated gates,
blocked-scope closure, and owner decisions must also be complete.

Stage 10 and Stage 14 ledger entries created after the artifact-binding
protocol cutoff also record `artifact_set_version` and
`artifact_manifest_sha256`. The former is the exact architecture or OKF set
version; the latter is the SHA-256 of `analysis/architecture/architecture-nfr-manifest.json`
or `analysis/knowledge/knowledge-manifest.json`. A clean pass cannot open the
next stage after either artifact changes.

## Independence

Every pass uses a fresh independent agent. Before reading artifacts in scope,
the reviewer completes the template's eligibility declaration. A reviewer
whose current context includes creating or editing an artifact in scope is
ineligible and records an invalid attempt without performing the review.

The reviewer is read-only and independently inventories the full scope.
Sampling is not sufficient.

Each status entry records a stable reviewer id, a unique fresh session id, the
reviewer's authored-artifact list, a durable independence record, and every
waiver examined. An empty authored-artifact list is required for a valid pass.
These fields make independence auditable; they do not replace the owner's
responsibility to reject a reviewer with shared authoring context.
`independence_record` may point to the immutable review report itself when its
Independence Declaration contains the complete eligibility evidence.
For a formal pass delegated through the
[external orchestration workflow](../agent_orchestration.md#formal-independent-pass),
the stricter packet rule applies: the reviewer supplies a separate durable
independence record. The validator's general self-reference support does not
waive that workflow requirement.

Every `session_id` is unique across the review ledger. When a finding returns
the process and a control stage is entered again, a pass from the earlier
entry is stale: the new pass timestamp must fall after the latest entry into
that stage and before its next transition.

## Error Prevention Learning

Every new control report and Stage 17 peer report follows the
[explicit checklist review and finding format](../error-prevention.md#reviewer-findings-and-correction-handoff).
In **Checklist Review**, compare the author claim with independent observations.
Each related finding names **Checklist link**, **Checklist discrepancy** and
**Required recheck**. Link F-NNN/B-NNN to CHK-NNN in the first-screen summary
and conclusion; do not leave this connection implicit in free-form prose.
Missing evidence is not proof that the agent never read the checklist.

After every pass, follow [error prevention](../error-prevention.md): name missed
existing CHK IDs and propose confirmed reusable checks, or record why no new
check qualifies. Generalize the missing verification, not the one-off repair.
The reviewer does not edit the project table. The coordinator verifies the
finding, searches semantic duplicates and records added/refined/reused IDs or
rejection reasons in the work/correction record. A repeated mistake reuses its
CHK ID and triggers analysis of why its check failed. Stage 2/19 Phase A remains
blind to the checklist and these notes; reconcile them only in Phase B.

## Return and Correction Protocol

**A return is an evidence-led correction cycle, not a silent restart or permission
to fix only the reported symptom.** This rule applies whenever a later stage
returns work to an earlier owning stage, including non-adjacent returns.

1. The active-stage agent reads the return entry in
   [migration_status.yaml](../migration_status.yaml), the exact immutable review,
   walkthrough or owner-decision record cited there, and earlier unresolved
   findings for the affected scope. Do not select a report merely because it has
   the largest pass number. Missing or ambiguous return evidence blocks work
   until the responsible actor clarifies the record.
2. For each finding, the agent verifies the claim against the authoritative
   inputs of the destination stage. A reviewer can be mistaken: acceptance,
   narrowing or rejection requires linked counterevidence, not preference.
   An unresolved dispute remains open for independent review or the explicit
   owner decision required by the process.
3. The agent corrects the current artifacts, checks related roles, channels,
   dependencies and occurrences of the same mechanism, and records the impact
   boundary. Start with affected scope, but expand discovery if a systemic
   omission, unreliable baseline or changed source invalidates that boundary.
   Do not automatically recreate all artifacts or treat the findings as an
   exhaustive discovery checklist.
4. The agent records a durable per-finding disposition in the destination-stage
   work record or a linked correction record: source report and finding ID,
   accepted / narrowed / rejected / blocked, source evidence, changed files
   and rows, checks actually performed, remaining work and responsible actor.
   Correction status and independent verification status stay separate.
   For checklist-related findings, retain both F-NNN and CHK-NNN, read the
   pinned check and reviewer discrepancy, and record the required recheck with
   actual results. Do not erase that link when correcting the artifact.
   The original review remains immutable; later corrections retain history.
5. The agent updates status with links to the return and correction evidence,
   refreshes affected manifests/hashes and runs the destination-stage gates.
   Follow the legal forward transitions and required approvals again; do not
   jump straight back to a later failed stage or reuse a stale approval.
   An author's correction record never supplies an independent clean verdict.

### Stage 1 Re-entry

Before assigning corrections, PM applies the
[publication boundary](../migration_methodology.md#review-and-correction-prs):
publish and obtain owner merge of the triggering record separately, then use a
correction branch/PR. Preserve already-started work under the in-flight rule.
The next Stage 2 waits for the correction PR's required CI and owner merge.

On first entry, the primary agent builds the reconnaissance and parity map from
legacy source. On any return, it reads the exact triggering record cited by
status, its finding IDs and linked evidence:

- **From Stage 2:** the applicable `stage-02-pass-NNN.md`, following the
  [independent review template](stage-NN-pass-NNN-template.md).
- **From Stage 3:** the applicable `stage-03/walkthrough-NNN.md), following the
  [walkthrough template](../stages/templates/walkthrough-NNN-template.md), with
  observed behavior, environment, role, expected map claim and runtime evidence.
- **From Stage 4:** the applicable `stage-04-requirements-revision.md`, following
  the [revision template](../stages/templates/stage-04-requirements-revision-template.md),
  with the mapping-error finding, affected rows and supporting evidence.
- **From any later stage:** that stage's exact review, walkthrough or decision
  record which caused the parity-map return; do not substitute a Stage 2 report.

The primary agent checks legacy code, configuration and the linked runtime
evidence before updating the existing reconnaissance and map. Source/runtime
disagreements require investigation of the exact revision and environment,
not silently discarding the observation. The triggering record is a
**conditional re-entry input**, not a first-entry prerequisite.

A Stage 4 owner decision to change correctly recorded legacy behavior is
requirements revision, not a discovery defect. It stays at Stage 4, preserves
the legacy fact and records the approved target deviation separately.

The primary agent records dispositions with stable finding IDs, source links,
changed reconnaissance sections/map rows and remaining unknowns. A correction
record may live under [`analysis/stages/stage-01/`](../stages/stage-01/); it is not another independent
review or another canonical map. Existing evidence that remains valid is retained.

On the next Stage 2 entry, a fresh eligible agent performs a new full in-scope
blind Phase A, then Phase B reconciles the revised Stage 1 records and correction
evidence. The orchestrator withholds previous findings and dispositions from
Phase A. Fixing every listed finding alone does not prove discovery is complete.

**Real example:** XPlanner's
[Stage 2 pass 001 dispositions](https://github.com/olsys-ltd/xplanner2/blob/cf2a024afc292fc33e2ab1504fd002d977e0f8fd/analysis/stages/stage-01/stage-02-pass-001-dispositions.md)
link each finding to source checks and corrections, including a finding rejected
as stated and narrowed with counterevidence. This is historical correction
evidence, not a new independent verification claim.

## Stage-Specific Scope

### Stage 2: Control reconnaissance

**First discover independently, save that result, then compare.** The filled
parity map and reconnaissance are inputs to the whole stage, but are available
to the reviewer only in Phase B. The orchestrator must not include their
contents, summaries, row counts, prior findings or author conclusions in the
Phase A packet. Knowing their paths is not permission to read them early.

#### Phase A - blind source inventory

The fresh eligible reviewer reads the exact immutable legacy source/artifact
revision, neutral scope boundaries and process instructions. Without opening
the filled Stage 1 records, it independently enumerates system surfaces and
behavior: channels, entry points, modules, roles, scenarios, permission/error
branches, background work, integrations and dependencies. Every item has an
A-NNN ID and source evidence; grouped items link an exhaustive breakdown.

The reviewer saves this inventory **before opening any Phase B input**. A
second Excel workbook and a second reconnaissance document are not required.
Use the report's Phase A section or a durable linked evidence attachment.
Record its path/anchor, saved-at time and a revision or SHA-256 identifying the
saved snapshot. Temporary scratch files may assist the work but cannot be the
only retained evidence. A timestamp/hash is traceability, not by itself proof
that the session remained blind. Preserve the actual input-access sequence.

For an inline Phase A section, cite a retrievable checkpoint revision containing
that saved section. For a separate attachment, pin its exact bytes with SHA-256.
Do not use the hash of the evolving final report as the frozen Phase A identity:
adding Phase B would change that hash. No automatic commit is required; the
attachment option provides a stable snapshot without a separate Phase A commit.

Freeze the Phase A snapshot once comparison starts. Later corrections to the
reviewer's own interpretation belong in Phase B, with reasons and source
links; never silently rewrite the independent first result. If prior results
entered the review context before this checkpoint, record an invalid attempt
and restart with a fresh eligible session. Do not claim a blind pass.

#### Phase B - two-way reconciliation

Record when the filled Stage 1 inputs were first opened and pin their exact
versions. Then check both directions:

- **Independent inventory -> Stage 1:** for every A-NNN, locate the matching
  parity rows and reconnaissance sections, or record the missing coverage.
- **Stage 1 -> source:** check every in-scope row and reconnaissance claim for
  actual source support, correct interpretation, status and evidence links.
  A claim not found in Phase A is not automatically wrong: inspect its source.

The immutable legacy revision is the authority, not either researcher's
inventory. Distinguish a Stage 1 defect, a reviewer interpretation corrected
during reconciliation, a wording/grouping difference, and unresolved scope.
A keyword hit alone is not a semantic match. Link the detailed comparison to
C-NNN results, F-NNN findings, B-NNN blockers and E-NNN justified exclusions.
Keep Phase A inventory counts separate from reconciled comparison counts.

The reviewer does not edit the Stage 1 artifacts. Findings return their
correction to Stage 1; blocked or invalid scope cannot yield a clean pass.
Stage 2 provides source-based control, not live verification (Stage 3).
Historical immutable reports retain their bytes; this structure applies to
new passes.

**Illustrative example:** A-007 records a source-backed read-only permission
restriction. In Phase B, the corresponding parity row describes editing but
omits the restriction: C-012 is a mismatch linked to F-001. Conversely, a
background job claimed by reconnaissance but disabled in the shipped
configuration needs a source-based correction even if Phase A did not list it.

### Stage 7 - Wireframe control

Review the exported prototype catalog, `screen-manifest.json`, Stage 5 decision,
and parity map. Verify every applicable row, role, channel, screen, state,
validation state, dialog, wizard step, and target-only decision. Confirm every
export path and SHA-256. Findings return to Stage 6, Stage 5 for a deliberate
channel/design-system change, or Stage 1 for a map error.

### Stage 10 - Architecture control

Review `architecture.md`, `architecture-nfr-manifest.json`, all ADRs, `architecture.drawio`,
the parity map, and Stage 5 decision. Verify:

- every NFR is measurable and closed by a justified ADR;
- every decision traces to a requirement or constraint;
- document-set version and SHA-256 entries cover the Markdown source, every
  ADR, and `architecture.drawio`;
- the editable diagrams are semantically consistent with the normative sources;
- every diagram page is readable, complete, and visually intact;
- nothing contradicts the parity map or approved application form.

Findings return to Stage 9. A map error returns to Stage 1. A decision that
changes channels, screens, or states returns to Stage 6, with the Stage 5
decision repeated when the application form or design system changes.

### Stage 14 - Target knowledge control

Review `analysis/knowledge/knowledge-manifest.json`, the indexed OKF concepts,
the approved architecture set, and parity decisions. Verify stable IDs, source
provenance, architecture coverage, internal links, hashes, and absence of
unsupported claims. Findings return to Stage 13, Stage 9 for an architecture
defect, Stage 6 for a prototype contradiction, Stage 5 for a deliberate
channel/design-system change, or Stage 1 for a parity-map defect.

### Stage 16 - Impact-scoped design re-verification

Follow the [traceability and verification-link contract](../../specs/traceability-guide.md).
Check the slice's index links and bidirectional requirement-to-planned-check
coverage. At implementation/delivery/acceptance review, reconcile actual
observations, exact versions, failures and untested scope. A `recorded` index
state is not a clean verdict; planned checks are not executed evidence.

The independent agent compares pinned prototype exports with SDD requirements,
control inventory and planned visual tests. New UI is not required before
Stage 17; candidate and deployed visual parity are checked at Stages 17 and 18.
The reviewer checks NFR criteria and requirement/task/test ownership in
[specs/traceability.md](../../specs/traceability.template.md), referencing the approved
architecture version/hash. The architecture manifest itself stays read-only.


First challenge the SDD's declared `delta`, `expanded`, or `full` blast radius.
Then cross-check every item in that exact scope from source evidence and
parity-map rows through owner decisions, approved prototype, approved
architecture, feature specification, plan, tasks, traceability matrix, and
target-surface inventory. Follow direct dependencies; do not sample within the
declared scope. Expand an under-declared scope, but do not reread unrelated
project rows merely because they exist. Verify every affected NFR has SDD
ownership. Findings return to Stage 15, Stage 13 for
stale knowledge, Stage 9 for an
architecture change, Stage 6 for prototype divergence, Stage 5 for a deliberate
channel/design-system change, or Stage 1 for a map error.

### Stage 19 - Slice and final acceptance

Phase A receives the acceptance instruction, stand URL and exact deployed
revision, neutral routing metadata, and expectation-only extracts of the parity
workbook, target-surface inventory and approved prototype. The coordinator removes
prior results and pins source and extract digests as required by the
[blind packet protocol](../agent_orchestration.md#expectation-only-extracts).
Save independent observations before Phase B opens the originals and checks
extract completeness, previous results and closure claims. Independently
enumerate and exercise the deployed impact scope across every applicable
channel and role; do not inherit the author's conclusions. Compare useful
actions and observable contracts with that packet. Route existence, status
codes, headings, and access probes alone are not acceptance evidence. The
aggregate automated gate separately validates SDD and NFR evidence closure.
Classify findings before return: Stage 17 for implementation, Stage 15 for SDD,
Stage 9 for architecture, or Stage 1 for a map error.

## Orchestrated Review

An external reviewer may be invoked through
[`../agent_orchestration.md`](../agent_orchestration.md). The external session
remains the reviewer and owns the conclusion. Retain the deterministic packet,
batch checkpoints, raw responses, discussion rounds, and digests under
`evidence/<packet-id>/`.

For a formal pass, review a committed immutable ref in a clean isolated
worktree. The reviewer regenerates the scope from declared revisions. Any
timeout, lost acknowledgement, context overflow, mutation, or incomplete batch
produces `blocked`. The pass cannot close until exact uncovered scope is
reviewed by later eligible sessions and a fresh consolidator confirms that no
blocked scope remains.

## Cleanup

Before closing an orchestrated review:

1. retain the minimum durable packet under `evidence/<packet-id>/`;
2. reference its digests from the immutable report;
3. confirm the review worktree is clean;
4. remove disposable worktrees and prune their metadata;
5. remove temporary renders, dependency directories, caches, and duplicate
   checkouts.

Only governed review evidence belongs here.

## Numbered Architecture Review Cycles

New and reopened cycles follow [Architecture Review Cycles](../architecture/review-cycles.md). Stage 11 records the human decision in `analysis/stages/stage-11/architecture-owner-verdict-NNN.md`; Stage 12 creates a separate immutable `analysis/stages/stage-12/architecture-closure-NNN.md`. Status selects exact paths. A negative closure accompanies the classified return and is mandatory reading on re-entry at Stages 9-11. Stage 13 reads and pins both records. Preserve old decisions, hashes and stage history; adopting this format is not a new approval.

## Feature Dependency Contract

At Stages 10 and 16, independently check feature-dependencies.json against actual source/contract evidence. Include a Dependency Review table in the immutable pass: Node / Scope SHA-256 / Compared sources / Result / Findings or unchecked scope. Challenge missing dependencies and direction. A clean bounded result permits the coordinator to link this exact report; file existence is not approval. Stages 2 and 19 retain their blind packet rules.

See [the normative dependency procedure](../feature-dependencies-guide.md).

# Stage NN Review - Pass NNN

**What matched, what did not, and what must be corrected before this scope can proceed?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** A fresh independent agent assigned to the reviewed stage writes the report.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the reviewed author does not self-approve.
- **Governing instructions:** Independent control at Stages 2, 7, 10, 14 and 16, plus reviewer eligibility rules.
- **When used:** A fresh independent agent creates one report for every Stage 2, 7, 10, 14 or 16 control attempt; Stage 19 uses its dedicated acceptance template.
- **How used:** The report proves reviewer independence, pins the reviewed scope and revision, records checks and findings, and gives the exact verdict used by migration_status.yaml. Once referenced as evidence it is immutable; corrections require a new pass file.
- **Example:** A Stage 7 reviewer finds an edit action on a read-only wireframe, records findings in stage-07-pass-018.md and returns the scope to Stage 6.

**Conditional cosmetic backlog check:**

- Stage 16 only (other review stages keep their own inputs): The independent agent reads the conditional cosmetic backlog and checks scope matching and task coverage in the Stage 15 plan. An applicable finding without a task blocks the pass and returns to Stage 15. The reviewer records the result in the immutable Stage 16 report, not by silently changing the backlog.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `clean` (this exact scope meets the clean-pass rules); `findings` (discrepancies require disposition); `blocked` (required verification could not finish); `invalid` (the review attempt is unusable). None of these supplies a separate human approval. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/reviews/stage-NN-pass-NNN.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No independent comparison or valid final verdict has been recorded.
>
> **Next:** The fresh independent reviewer checks the exact scope and records the verdict and correction route.
>
> **Details:** [Comparison Results](#read-comparison-results) / [Conclusion and Next Gate](#read-conclusion-and-next-gate) / [Coverage Summary](#read-coverage-summary).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Independence Declaration](#read-independence-declaration)
- [Scope and Inputs](#read-scope-and-inputs)
- [Method and Coverage](#read-method-and-coverage)
- [Stage 2 Phase A - Blind Inventory](#read-stage-2-phase-a-blind-inventory)
  - [Phase A Saved Checkpoint](#read-phase-a-saved-checkpoint)
- [Stage 2 Phase B - Two-Way Reconciliation](#read-stage-2-phase-b-two-way-reconciliation)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
- [Findings](#read-findings)
  - [F-NNN -](#read-f-nnn-)
- [Automated and Manual Gates](#read-automated-and-manual-gates)
- [Blocked Scope](#read-blocked-scope)
- [Interaction Log](#read-interaction-log)
- [Conclusion and Next Gate](#read-conclusion-and-next-gate)
- [Error Prevention](#read-error-prevention)
  - [Checklist Review](#read-checklist-review)
  - [Reviewer Self-Check And Learning](#read-reviewer-self-check-and-learning)
- [Dependency Review](#read-dependency-review)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Date: YYYY-MM-DD
- Stage: NN
- Pass: NNN
- Scope: <project | slice identifier and exact boundary>
- Reviewed revision: <immutable revision>
- Base revision: <revision or not applicable>
- Reviewer product: <product/model family; no credentials>
- Reviewer ID: <stable product or agent identifier>
- Session ID: <fresh task/session identifier>
- Authored artifacts in reviewed scope: <none, or stop as invalid>
- Independence record: <this report path, or another durable repository-relative eligibility record>
- Waiver IDs reviewed: <none or exact waiver:id values>
- Orchestration packet: <packet identifier and digest, or direct>
- Result: clean | findings | blocked | invalid
- Artifact set version: <required for Stage 10 and Stage 14>
- Artifact manifest SHA-256: <required for Stage 10 and Stage 14>
- Verification mode: delta | expanded | full | not applicable
- Verification baseline: <pinned revision/artifact set>
- Expansion trigger: <none or exact trigger>

<a id="read-independence-declaration"></a>

## Independence Declaration

- [ ] I did not create or edit any artifact in this review scope.
- [ ] My current context does not include the authoring session.
- [ ] I am working read-only from the declared immutable revision.
- [ ] I independently enumerated the complete scope.
- [ ] For Stage 2, I inventoried source behavior before reading prior
      conclusions, the filled parity map or reconnaissance, and saved Phase A
      before first Phase B access.

If any applicable item cannot be checked, stop and set the result to
`invalid`.

The matching `migration_status.yaml` review entry records `reviewer_id`,
`session_id`, `authored_artifacts`, `independence_record`, and `waiver_ids`
as structured fields. Free-form prose alone is not reviewer identity or
independence evidence.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

List every revision, artifact, source area, parity-map range, specification,
prototype version, architecture document-set version, deployed environment,
channel, role, inventory, and owner decision used. List explicit exclusions
and justify why they are outside this pass.

For Stage 2, distinguish allowed Phase A inputs from withheld Phase B inputs.
Listing a path here is not permission to open its contents before the handoff.

<a id="read-method-and-coverage"></a>

## Method and Coverage

Describe how completeness, traceability, contradictions, and evidence were
checked. For Stage 16, independently validate the declared blast radius and
name every direct dependency followed. Record deterministic batches, exact
completed scope, evidenced exclusions, and re-entry triggers. Do not sample
within the declared scope or write only "reviewed" or "looks good".

For orchestrated review, record every checkpoint, context reset, raw-response
digest, final scope acknowledgement, and `git status --short` result before
and after review.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Required for Stage 2 only. For other control stages, mark this section and the
Phase B handoff below not applicable. The reviewer follows the
[Stage 2 procedure](README.md#stage-2-control-reconnaissance).

The reviewer completes and saves this section before opening the filled
parity map, reconnaissance or prior conclusions. Do not create duplicate
canonical Stage 1 files. The saved inventory is durable review evidence,
not only internal reasoning or temporary scratch work.

- Allowed Phase A inputs and exact legacy revision: <paths, versions, neutral scope>
- Filled Stage 1 records and prior results withheld: <paths/categories, not contents>
- Input-access sequence: <what was read before this checkpoint; exposure means invalid>
- Phase A snapshot: <report section or durable attachment path/anchor>
- Snapshot saved at: <timestamp before first Phase B access>
- Snapshot revision or SHA-256: <identifier for the saved evidence>
- Inventory coverage, exclusions and unresolved source access: <exact scope and IDs>

Pin Phase A, not the evolving final report. For an inline inventory, cite a
retrievable checkpoint revision; for a durable attachment, hash its exact bytes.
The attachment option does not require a separate Phase A commit.

| Inventory ID | Independently discovered surface / behavior / claim | Role, conditions and outcome | Legacy source evidence | Uncertainty / coverage limit |
|---|---|---|---|---|
| A-NNN | <discovered without reading Stage 1> | <actor, preconditions, normal/error behavior> | <exact source link and revision> | <none or explicit limitation> |

Include system structure as well as scenarios. Enumerate all items in scope;
grouped items require a durable exhaustive breakdown. Phase A has no Stage 1
row matches or verdicts yet. Its inventory count is not the comparison total.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [ ] The inventory was saved before any filled Stage 1 input was opened.
- [ ] The snapshot is retrievable from this report or its durable linked evidence.
- [ ] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

Freeze the snapshot at this handoff. Once issued, the completed report is
immutable. A self-declaration or hash alone does not establish independence;
record actual access order and invalidate a contaminated pass.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- First Phase B access at: <timestamp after the Phase A checkpoint>
- Filled parity-map revision/hash: <exact input>
- Filled reconnaissance revision/hash: <exact input>
- Other Phase B inputs and access order: <exact inputs, or none>

Read the filled records only now. Reconcile both the independent inventory
against Stage 1 and all in-scope Stage 1 claims back to the source. Neither
inventory is an automatic oracle; resolve disagreements using the immutable
legacy revision. Record corrections to the reviewer's own interpretation here.

| Comparison ID | Direction | Phase A inventory IDs | Stage 1 row / reconnaissance section | Source-based resolution | Result / finding / blocker |
|---|---|---|---|---|---|
| C-NNN | inventory-to-records / records-to-source | <A-NNN or newly investigated claim> | <exact linked row/section or missing> | <agreement, Stage 1 defect, reviewer correction, wording difference or unresolved; evidence> | <result and F-NNN/B-NNN/E-NNN or none> |

This table indexes the detailed Comparison Results below: reuse C-NNN IDs and
do not count the same check twice. No unchecked mandatory item may disappear
from the Coverage Summary. A wording match or keyword search is not enough.
Only Stage 1 authors correct the reviewed artifacts; the reviewer reports
findings and the required return.

<a id="read-comparison-scope"></a>

## Comparison Scope

The independent reviewer defines the check items before assigning results.
Each item identifies a requirement, behavior, screen/role/state, NFR/ADR,
knowledge concept, dependency or acceptance action and its exact source.
Stage 2 preserves its blind inventory before comparison; Stage 19 preserves
the blind live pass before reconciling prior findings and backlog evidence.

- Review mode and exact checked boundary: `<full | expanded | delta; scope>`
- Previous report and pinned baseline: `<links and hashes, or none>`
- Changed items and direct dependencies rechecked: `<IDs and links>`
- Prior results relied on but not rerun: `<prior report/check IDs and reason>`
- Expansion triggers examined: `<triggers and decisions>`

A delta pass checks every item in its declared delta and direct dependencies.
Previously checked, unchanged items are disclosed separately; they are not
counted as newly matched or silently described as a fresh full review.

<a id="read-comparison-results"></a>

## Comparison Results

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-NNN / `<exact item>` | `<expected behavior and source link>` | `<actual observation, or explicitly not observed>` | matched / mismatch / not-checked / not-applicable | `<file/row/command/rendered evidence link>` | `<F-NNN / B-NNN / E-NNN / none>` |

The reviewer uses exactly one result per item:
- **matched**: inspected against the expected result, with supporting evidence.
- **mismatch**: inspected and different; linked to a detailed F-NNN below.
- **not-checked**: no sufficient check could be completed; linked to B-NNN.
- **not-applicable**: outside the justified applicability of this check;
  linked to E-NNN with scope evidence and decision authority where required.

The absence of findings is not proof of a match. A green tool run is evidence for the
specific property it tests, not proof of semantic correctness of the whole item.
Unknown or inaccessible is not not-applicable. Each independently required
obligation is accounted for; grouped items need a linked exhaustive breakdown.
Rows are partitioned rather than counted twice. Stage-specific evidence below
may extend this table or link detailed ledgers using the same check IDs.

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| `<total>` | `<count>` | `<count>` | `<count>` | `<count>` |

The total equals the four result counts. Counts refer to the comparison items,
not automatically to workbook rows, screens or entire requirements.
Prior results relied on without rerunning are listed separately in Comparison
Scope and are not included in these counts. Record finding totals separately:
one finding may affect multiple checks.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

Include the evidence table required by the stage:

- Stage 2: independently discovered behavior to parity-map verdict;
- Stage 7: screen to rows, roles, states, files, hashes, and verdict;
- Stage 10: NFR to ADR and acceptance criterion, plus semantic and visual
  checks of the committed Draw.io pages, document-set version and pinned hashes;
- Stage 14: architecture source to stable OKF concept and provenance;
- Stage 16 compares the pinned prototype with SDD and planned visual checks,
  not an unimplemented UI. Built UI is checked at Stage 17 and deployed UI at
  Stage 18. NFR coverage lives in downstream traceability; the approved
  architecture manifest is read-only.
- Stage 16: impact dimension and dependency to row/knowledge/surface/NFR, SDD
  requirement, task, planned evidence, and exclusion rationale;
- Stage 19: deployed surface and role to useful action, observed result, and
  traceability verdict.

For a `findings` result, record the required return stage explicitly. Use Stage
5 when a channel/design-system finding invalidates the design baseline and
Stage 17 when acceptance exposes an implementation-only defect while the SDD
remains correct. Map defects still return to Stage 1.

<a id="read-findings"></a>

## Findings

Use one subsection per finding.

<a id="read-f-nnn-"></a>

### F-NNN - <short title>

- Severity: critical | high | medium | low
- Comparison check IDs: <C-NNN IDs>
- **Checklist link:** <CHK-NNN IDs and pinned checklist/row; or none: new finding>
- **Checklist discrepancy:** <author claim/source versus observed issue/evidence;
  failed result, unjustified exclusion, missing required self-check record,
  unsupported claimed pass; or not applicable>
- **Required recheck:** <CHK IDs, affected scope, correction and expected result;
  or not applicable>
- Expected and source: <required result and authoritative link>
- Observed difference: <actual result and exact difference>
- Evidence: <exact file, row, requirement, surface, command, or observation>
- Requirement impact: <affected obligation>
- Required action: <correction or check>
- Return stage: <1 | 5 | 6 | 9 | 13 | 15 | 17 | blocked prerequisite; per active-stage rule>

Write `None` only after the complete declared scope has been checked.

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| <gate> | <command or procedure> | pass/fail/blocked | <output or artifact> |

Record absent tooling or unavailable environments as `blocked`, not passing.

<a id="read-blocked-scope"></a>

## Blocked Scope

Every not-checked item has a B-NNN entry and remains visible in the summary.
Every not-applicable item has an E-NNN entry with a reason and scope evidence.

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| B-NNN / E-NNN | <C-NNN> | <why not checked or not applicable> | <unblocking action or exact scope basis> | <link> |

- Blocker: <reason or none>
- Exact unchecked scope: <files, rows, requirements, surfaces, roles, batches>
- Required prerequisite: <what must change>
- Reassignment/closure reference: <later packet/report or pending>

<a id="read-interaction-log"></a>

## Interaction Log

Record only dispositions and repeat-check results known at this pass.
Later corrections belong to a new disposition record or review linked to this
immutable report; never fill future results into an already pinned report.

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| <id or none> | <reference> | accepted/rejected/pending | <reference> | <result> |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** <F-NNN/B-NNN linked to CHK-NNN and required rechecks;
  or no checklist-related issues, without implying the whole review passed>

Include this concise checklist issue summary in the first-screen result block
as well. The receiving author retains finding and CHK IDs in its correction
record; a later independent pass verifies closure without editing this report.

For a return, name the owning destination stage and the exact finding IDs that
trigger it. The receiving agent follows the
[return and correction protocol](README.md#return-and-correction-protocol),
records dispositions and evidence outside this immutable report, and links
them from the status return/handoff. Fixes are not an independent clean pass.

State why the result is `clean`, `findings`, `blocked`, or `invalid`, where the
process returns, whether unresolved blocked scope is zero, and the exact next
independent or owner gate.

Reconcile the verdict with Coverage Summary. Any not-checked item in the
declared required scope prevents clean closure; record blocked and preserve
any findings already discovered. Invalid reviewer/protocol conditions remain
invalid. Mismatches remain findings even under the explicit Stage 7
Low-cosmetic closing exception: that exception is not a clean report.
Justified not-applicable items are not counted as passed checks.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: <exact version; at 2/19 first opened in Phase B>
- Author self-check record/version: <linked report or status note; or not recorded>

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| <CHK-NNN; scope and applicability reason> | <claimed result and exact source, or not recorded> | <passed / failed / blocked / not applicable; actual evidence and C-NNN> | <F-NNN or B-NNN; correction and repeated check, or none> |

Account for applicable checks and exclusions; if none exist, write "no learned
checks yet", not passed. Link existing comparison evidence without double-counting.
A missing required record is not proof that the author did not read the checklist.
Historical records are not retroactively assigned this reporting duty.

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

The self-check below concerns this reviewer's work; the author's claims and
the independent comparison belong in Checklist Review above.

- **Self-check:** <stage/scope; result version; checklist revision or SHA-256;
  applicable CHK IDs and passed/failed/blocked outcomes; exclusions with reasons;
  or no learned checks yet>
- **Learning update:** <confirmed generalized proposals and basis; covered by
  existing CHK IDs; or no qualifying new check and why>

Independent reviewers propose changes here without editing the shared table.
The coordinator records actual admission/deduplication in the current correction
or work record. The owner need not write this section. This note does not replace
the required independent review, human decision or stage evidence.

<a id="read-dependency-review"></a>

## Dependency Review

Required for Stage 10/16 when checking the graph. Other stages mark this section not applicable with a reason. Compare actual prerequisites and exclusions, not just schema validity. The coordinator links only a clean exact scope after this report is immutable; the independent reviewer does not edit graph dependencies.

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| <slice ID> | <digest actually reviewed> | <exact sources and conditions> | <pass / findings / unverified / not applicable> | <item IDs or bounded clean conclusion> |

Use [feature-dependencies-guide.md](../feature-dependencies-guide.md). Candidate relations and unresolved questions cannot be called reviewed-ready. A clean node scope is not owner permission or proof that a provider is live.

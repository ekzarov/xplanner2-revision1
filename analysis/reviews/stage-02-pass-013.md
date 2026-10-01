# Stage 02 Review - Pass 013

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

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Result: `findings` - Stage 2 pass 013 (correction-validation of BA-001-13, the Stage 3 W001 map corrections; root pass 006, previous pass and coverage base 012, no recovery)**
>
> **The control is admissible.** The legacy source and the governed scope are unchanged, no row was added, and pass 012 is a usable `findings` base (its incident assessment and carryover are delegated decisions under the recorded mandate).
>
> - **Checked:** the whole change set BASE..CAND (354 cells in 210 rows, 32 reconnaissance hunks, the new dispositions record), each of the 88 items against its W001 checks, the 37 status changes and the status of every other named row, and the pass-012 findings F-001..F-003.
> - **Confirmed:** 84 of 88 items are applied as observed; all 37 status changes follow a stated rule; the 210 runtime labels, the counts (146/10/53/1) and the record tables reproduce.
> - **New low findings:**
>   - **F-001:** the status rule is not applied alike: G162, G18, G149, G152 and G138 stay as they were although rows with the same evidence (40, 38/48, 52, 202) changed.
>   - **F-002:** some live-labelled texts say more than the checks saw: "the attribute operations run anonymously" (only an anonymous setAttribute succeeded) and the start/end/delete triggers of row 151.
>   - **F-003:** nine rows keep "(runtime unverified)" for a claim their own W001 checks now observe, two of them with a new `Yes`.
>   - **F-004:** the rest of pass-012 F-003 is open: the Q3 fact still says the task editor shows dates with the static converters; E69 and H89 are unchanged.
>   - **F-005, F-006:** pass-012 F-001 and F-002 (count figures) are uncorrected; the delegated carryover accepted them as risks, which does not close them.
>   - **F-007:** the record does not disclose the PM's later edits; its attestation of the PM section no longer matches the bytes.
>
> 174 new checks: 157 matched, 15 mismatch, 0 not-checked, 2 not-applicable. Coverage: 748 = 429 newly rechecked + 319 retained + 0 uncovered.
>
> **Checklist issues:** F-002 fails CHK-011. F-003, F-005 and F-006 fail CHK-007. F-004 fails CHK-004 a fourth time in the editor-date mechanism. F-001 and F-007 have no existing check.
>
> **Next:** a bounded Stage 1 correction of F-001..F-007, then another fresh correction-validation (root 006, previous and coverage base 013), or a delegated decision on a low-only carryover under the project rule.
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
- [Stage 2 Correction Validation](#read-stage-2-correction-validation)
  - [Eligibility Decision](#read-eligibility-decision)
  - [Attempt Recovery](#read-attempt-recovery)
  - [Open-Item Closure](#read-open-item-closure)
  - [Retained Coverage](#read-retained-coverage)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
- [Findings](#read-findings)
  - [F-001 - The column-G status rule is not applied alike to rows with the same evidence](#read-f-001)
  - [F-002 - Some live-labelled statements say more than the cited checks observed](#read-f-002)
  - [F-003 - Stale runtime-unverified qualifiers contradict the new runtime label](#read-f-003)
  - [F-004 - The static part of pass-012 F-003 is still open](#read-f-004)
  - [F-005 - Pass-012 F-001 is still open](#read-f-005)
  - [F-006 - Pass-012 F-002 is still open](#read-f-006)
  - [F-007 - The record does not disclose the PM edits made after the author](#read-f-007)
  - [Packet Observations For PM](#read-packet-observations-for-pm)
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

- Date: 2026-10-01
- Stage: 02
- Pass: 013
- Scope: project; the BA-001-13 corrections in [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md), [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (210 rows) and the new record [`stage-03-walkthrough-001-dispositions.md`](../stages/stage-01/stage-03-walkthrough-001-dispositions.md), against the saved Stage 3 evidence [`walkthrough-001.md`](../stages/stage-03/walkthrough-001.md) and its W001 evidence (the WAR only where a disposition cites it); the complete change set BASE..CAND, the 88 items, the 37 status changes, the pass-012 findings and their dependencies
- Reviewed revision: `6138f37be52504cf6a14f041ef828d46f1bd8944`
- Base revision: `2c176d4fa6a610b4b18acaaca3cb7e7ece4d1941` (previous pass and coverage base 012); root `15cb6b26946f73596177eba8cead333383d9f728` (pass 006)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p013`
- Session ID: a7738da7d84992f93 (subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P013/independence-record.md`](evidence/S02-P013/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P013`, [`packet.json`](evidence/S02-P013/packet.json) SHA-256 `3e30435ab1ab6c82e5a9f5b8791f8de4fd199ee84151f52fa235f6140d765fde`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: delta (the complete BASE..CAND change set, its dependencies and the open pass-012 findings)
- Control mode: correction-validation
- Verification baseline: root pass 006 (`15cb6b2`); previous pass and coverage base 012 (`2c176d4`; reconnaissance `b8e9981f...5b44`, workbook `4f26e8e7...097a`)
- Expansion trigger: none for a full-blind pass; no expansion beyond the change set and its named dependencies

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] I followed the access boundary of my declared control mode: for Stage 2
      full-blind, I saved the complete source inventory before opening prior
      conclusions or filled records; for correction-validation, I used the
      permitted prior evidence without claiming a new blind Phase A. Other
      stages follow their own access rules.

I am not an author: BA-001-13 was written by another subagent of the PM session, BA-001-01..12 by subagent `a5bb18013a4f4d2f8`, and the W001 parts by other subagents. I am not a reviewer of passes 001-012. The [independence record](evidence/S02-P013/independence-record.md) lists the client-injected context. The [access log](evidence/S02-P013/access-log.md) records the access sequence and eight disclosed deviations; none affects independence.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy), identical at ROOT, BASE and CAND ([`README.md`](../../legacy/README.md) `78b1a6b4...5460`, [`docker-compose.yml`](../../legacy/docker-compose.yml) `e15cd9db...e9ff`, [`xplanner-plus.war`](../../legacy/xplanner-plus.war) `46ff9dc0...4edc`, [`demo-seed.sql`](../../legacy/demo-seed.sql) `41b2f6a3...66e1` by its committed LF bytes; the CRLF checkout hashes to `2d32f7d5...387e`, the value the reconnaissance records).
- **Upstream source (A4):** not read; no disposition cites it. Its provenance files under [`sources/provenance/`](../../sources/provenance/source-manifest.json) are unchanged BASE..CAND and their pins match.
- **Root:** [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, checkpoint [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md) `c8d4f780...74d9` and [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json) `8f734d0d...4cbe`, ledger [`comparison-results.json`](evidence/S02-P006/comparison-results.json) `a205b9b5...702c`.
- **Previous pass and coverage base:** [`stage-02-pass-012.md`](stage-02-pass-012.md) `389f18db...53fe`, its [ledger](evidence/S02-P012/comparison-results.json) `24630987...d50e`, [coverage record](evidence/S02-P012/coverage-reconciliation.json) `5a4f7799...4159` and [incident assessment](evidence/S02-P012/incident-assessment.md) `543b0e0e...03e7`.
- **Earlier eligible reports read for retention:** the ledgers of passes [007](evidence/S02-P007/comparison-results.json), [009](evidence/S02-P009/comparison-results.json) and [010](evidence/S02-P010/comparison-results.json), and the pass-006 ledger. Nothing from the invalid passes 008 and 011.
- **Intervening records (all pins match):** [`live-check-carryover-pass-012.md`](../stages/stage-02/live-check-carryover-pass-012.md) `7f045198...07e3`; [`walkthrough-001.md`](../stages/stage-03/walkthrough-001.md) `b061cd97...239e`; [`map-corrections.md`](../stages/stage-03/evidence/W001/consolidated/map-corrections.md) `33563f14...04ee`; [`rows.json`](../stages/stage-03/evidence/W001/consolidated/rows.json) `2f938abc...f2a3`; [`stage-03-walkthrough-001-dispositions.md`](../stages/stage-01/stage-03-walkthrough-001-dispositions.md) `361f7e33...1772`; [`process-departure-2026-09-30-operational-mandate.md`](../maintenance/process-departure-2026-09-30-operational-mandate.md) `64aeefd6...24ec`. W001 part evidence read: the `checks.json` and `observations.md` of the parts (for example [`setup/checks.json`](../stages/stage-03/evidence/W001/setup/checks.json)) and the PM facts (for example [`redirect-facts-3.txt`](../stages/stage-03/evidence/W001/pm-facts/redirect-facts-3.txt), [`job-facts.txt`](../stages/stage-03/evidence/W001/pm-facts/job-facts.txt), counts only).
- **Candidate:** reconnaissance `a38989aa...5206`; workbook `33f3349d...0156`; checklist [`error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c...2a90b`.
- **Status and decisions:** [`migration_status.yaml`](../migration_status.yaml) at CAND: transitions, review ledger and `owner_decisions`, including the delegated decisions `stage-02-pass-012-incident-approval` and `stage-02-live-carryover-pass-012`.
- **Instructions:** [Stage 2 Correction Validation](README.md#stage-2-correction-validation), [Results](README.md#results) and [Independence](README.md#independence); [Correction-Validation Packets](../agent_orchestration.md#correction-validation-packets), [Packet Transport Safety](../agent_orchestration.md#packet-transport-safety) and [Operational Incident Assessment](../agent_orchestration.md#operational-incident-assessment); constitution [A1](../../.specify/memory/constitution.md#read-a1-war-only-legacy-evidence) and [A4](../../.specify/memory/constitution.md#read-a4-attributed-upstream-source-as-supplementary-evidence); [`SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), blob `560391d617ed24f5269b9d594c65056348e9f021`; [`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md).
- **Owner direction (relayed, binding):** keep the business capabilities; do not demand reproduction of legacy defects; SOAP and WAP facts stay as observed, with no extension.
- **Explicit exclusions:** author tool-execution facts (E-001); the release-WAR equality (E-002); author and earlier reviewer scratch; earlier-migration material (A2); new reconnaissance, live requests and SOAP/WAP study; git outside the three pinned revisions; the user profile and `.migration-tmp/stage-03/secrets`.

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Runner:** every git command and most node runs and long reads went through the pinned runner (self-test passed), except the eight deviations of the [access log](evidence/S02-P013/access-log.md).
- **Pins:** my scratch script `pins.js` compared 30 packet pins in the candidate checkout and the main tree; all match (C-001).
- **Change set:** `git diff --name-status` BASE..CAND (248 paths); a `-U0` diff of the reconnaissance (32 hunks); my own XLSX reader over both workbook checkouts (cells, styles, row attributes, package parts) ([`change-set.json`](evidence/S02-P013/change-set.json)).
- **Correction check:** a per-item sheet joined each of the 88 items with its cited checks (mode, verdict, observed text) and the actual changed cells; I read all 940 lines and followed every doubtful sentence to the check's action field, the part observations or the PM fact file. One WAR entry was read in memory because MC-B-07 cites it.
- **Status rule:** each of the 37 changes was classified against the author's rule (R-G1..R-G3) and the PM rule; then every other row an item names was tested for the same kind of evidence.
- **Mechanical checks:** the 210 runtime labels against `rows.json` and the walkthrough residual table; the record's tables against the diff; every check, finding, item and residual ID of the new text against the W001 index.
- **Coverage reconciliation:** the 602 obligations of the pass-012 union and 146 new obligations each map to new checks or to one exact retained ID ([`coverage-reconciliation.json`](evidence/S02-P013/coverage-reconciliation.json)); the generator refuses duplicates and any ID from passes 008 or 011.
- **Batches:** one batch, no context reset, no sampling within the declared scope.
- **Worktree state:** the three checkouts had an empty `git status --short` at start and at end.
- **Credential safety:** values stay in memory; hits are classified with masked context. The self-scan is in the Reviewer Self-Check.
- **Transport safety:** large outputs went to the scratch and were read in bounded parts. One direct listing was persisted by the client under the user profile; I did not open it (D-001).

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: correction-validation. No blind inventory was created, claimed or recreated. The frozen Phase A of root pass 006 serves as provenance only.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

Not applicable (correction-validation). The pass-006 checkpoint is assessed in C-002.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: correction-validation has no delayed Phase B; prior evidence was permitted at launch.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

- **Root full baseline:** pass 006, `ee71a38f...cff67`, with its blind checkpoint and 539-item ledger (C-002).
- **Latest preceding control:** pass 012, `389f18db...53fe`, `findings`; it is also the coverage base. No attempt followed it (C-003, C-004).
- **Source identity:** [`legacy/`](../../legacy) identical at ROOT, BASE and CAND; nothing under [`sources/`](../../sources/provenance/source-manifest.json), in the constitution or in [`config/`](../../config) changed BASE..CAND (C-005).
- **Baseline and candidate:** reconnaissance `b8e9981f...5b44` (BASE) and `a38989aa...5206` (CAND); workbook `4f26e8e7...097a` and `33f3349d...0156`.
- **Eligibility decision:** admissible; see [Eligibility Decision](#read-eligibility-decision).
- **Complete change set (C-006, C-011):**
  - **Workbook:** 354 cells in 210 rows: D 31, F 76, G 37, H 210. Columns A-C, E and I-N are unchanged. Every H cell keeps its before text as a full prefix. No row was added, removed or renumbered (3276 cell references in both). Of 16 package parts only `sheet1.xml` and `sharedStrings.xml` differ; no style or row attribute changed. 93 rows carry item edits; 117 rows only the runtime label.
  - **Statuses:** 168/20/21/1 -> 146/10/53/1 (`Yes`/`Inferred`/`Partial`/`No`): 27 `Yes` -> `Partial`, 5 `Inferred` -> `Partial`, 5 `Inferred` -> `Yes`.
  - **Reconnaissance:** 32 hunks, 61 lines added and 41 removed: the reading block, Scope And Provenance, the evidence legend, Runnable Surfaces, the outbound-HTTP row, Build, Run, And Test Evidence, GAP-002, GAP-003, GAP-004, GAP-007, GAP-008, GAP-012, GAP-014, the Q2 and Q3 facts, the Parity-Map Boundary, Return Correction Evidence, the exit checklist and Error Prevention.
  - **New record:** [`stage-03-walkthrough-001-dispositions.md`](../stages/stage-01/stage-03-walkthrough-001-dispositions.md), including PM edits after the author (C-008).
  - **Other files:** the W001 record and evidence (222 added), the pass-012 carryover record, the 10 sealed pass-012 files (added only), the status file and schema, two new and three changed tools, and five process documents (C-007).
- **Open-finding reconciliation:** see [Open-Item Closure](#read-open-item-closure).
- **Expansion decision: none needed.** Every finding sits in a named row set or section; nothing needed new study.

| Required coverage item | Prior report / check IDs | Source and current claim identity | Handling in this pass | New check IDs or retention evidence |
|---|---|---|---|---|
| Packet, runner, pins, root, base, chain, source and scope, change set, process files | pass-012 C-001..C-008; pass-010 C-002, C-003, C-005, C-006, C-020, C-045; pass-009 C-002, C-004; pass-007 C-065; new obligations | status ledger, sealed evidence, legacy blobs, provenance | rechecked | C-001..C-010 |
| The 88 W001 items and their cells and sections | new obligations | 354 cells; 32 hunks; the new record | rechecked | C-011..C-100 |
| The 37 status changes and the status of every other named row | new obligations | 37 G cells; G of the 64 other rows that an item names or edits | rechecked | C-101..C-139 |
| Prior obligations on the 93 edited rows | pass-006 row checks, pass-009/010/012 checks naming them | changed cells against W001; unchanged static text byte-identical | rechecked | the item and status checks of each row (listed per obligation) |
| Changed reconnaissance sections and the figures | pass-006 C-493, C-494, C-499..C-502, line checks; pass-012 C-020..C-027; pass-007 C-059 | 32 hunks | rechecked | C-140..C-152 |
| The dispositions record and the W001 findings | new obligations | the new record | rechecked | C-153..C-156, C-160 |
| Pass-012 F-001..F-003 | pass-012 C-010, C-011, C-014, C-018, C-020..C-022, C-026, C-027, C-029, C-033, C-034 | CAND text; W001 checks | rechecked | C-157..C-159 |
| CHK-001..CHK-012 and exclusions | pass-012 C-031..C-041 and the obligations they covered | the whole change set | rechecked | C-161..C-174 |
| All other obligations (319) | exact pass-006 (216), pass-010 (75), pass-009 (16) and pass-012 (12) IDs | rows with only the runtime label, or reconnaissance lines outside every BASE..CAND hunk and byte-identical at CAND; source and WAR identical | retained | groups in [`coverage-reconciliation.json`](evidence/S02-P013/coverage-reconciliation.json) |

| Reconciled required coverage items | Newly rechecked items | Valid retained items | Uncovered items |
|---|---|---|---|
| 748 | 429 | 319 | 0 |

- **The 748:** the 602 obligations of the pass-012 union and 146 new obligations of this pass.
- **The 429:** 283 prior obligations whose target this change set touches, or whose pass-012 check was a mismatch, and the 146 new ones.
- **Counts:** the 174 comparison checks below count only newly executed checks. Retained items are not counted as newly matched.

<a id="read-eligibility-decision"></a>

### Eligibility Decision

**An ordinary correction-validation (no recovery; previous pass and coverage base 012) is admissible.** The reasons follow.

1. **Root 006 keeps independence, completeness and provenance (C-002).** Its report, ledger and checkpoint hashes match; its Phase A was saved at `2026-09-25T13:23:33Z`, before the Phase B release at `13:25:05Z`; its 539 checks are complete.
2. **Pass 012 is a usable `findings` base and the latest attempt (C-003, C-004).**
   - It is a correction-validation under root 006 with complete coverage (602 = 76 + 526 + 0, no duplicates, no ID from 008 or 011).
   - Its incident companion is pinned, and I read it: the ten deviations gave no forbidden context and no finding or retained item rests on them. I agree that they are non-material.
   - The approval is a delegated decision by Codex under `operational-mandate-expansion-until-stage-04` (decided by `ekzarov`, delegate Codex, ends at Stage 4). It was taken at the delegation time, before any Stage 4 transition, is not a waiver and is recorded as not a personal owner approval. Independent verdicts are not delegated, and this pass does not rely on any.
   - No Stage 2 attempt follows pass 012. This pass starts after the latest Stage 2 entry (`2026-10-01T01:26:03Z`).
3. **The source and the governed scope are unchanged (C-005).** [`legacy/`](../../legacy) is identical since ROOT; A4 was in force at BASE; the workbook keeps its 210 rows; every channel W001 exercised (web UI, SOAP, REST, iCal, WAP, the jobs, mail) is already mapped.
4. **The change is a Stage 1 correction from live evidence, not a new source or scope.** It is bounded to the 93 named rows, the runtime label and the named sections. The process changes BASE..CAND do not alter the review rules this pass applies (C-007).

A changed WAR or [`legacy/`](../../legacy) file, a new row, channel or subsystem, an unreliable root or base, or a systemic omission would be a full-blind trigger. None is present.

<a id="read-attempt-recovery"></a>

### Attempt Recovery

Not applicable: the chain has no failed attempt after the coverage base. Pass 012 is both the previous pass and the coverage base, and no pass is excluded. The packet's mode string mentions attempt recovery, but its chain and the assignment do not (PO-1).

<a id="read-open-item-closure"></a>

### Open-Item Closure

| Item (chain) | Disposition | Independent result in this pass | Status |
|---|---|---|---|
| pass-012 F-001 (low): counting rules M and S | carryover: accepted documentation risk (delegated); not corrected by BA-001-13 | the figures stay at CAND lines 92-93, 321 and 323 (C-157) | open as **F-005** |
| pass-012 F-002 (low): script-context rule | as above | the tool row and Return Correction rows keep 78 outputs (C-158) | open as **F-006** |
| pass-012 F-003 (low): time-editor display | carried into a W001 live check; answered by C-C-003 and E-C-033; applied by MC-A-16 | display, hint, Insert Time and saving now named as session-locale consumers with the observed es effects (closed part); the Q3 task-editor clause, E69 and H89 unchanged (C-159) | display part closed; static remainder open as **F-004** |
| The 54 W001 findings (4 high, 20 medium, 30 low) | 88 items: 81 applied, 7 in part, 0 rejected | each finding reaches the map; 84 items as observed; MC-A-30, MC-A-42, MC-A-43 and MC-C-03 go beyond their checks (C-013..C-100, C-160) | open in part as **F-002**; status consistency **F-001** |
| passes 001-011: findings, E-items, leads | resolved in earlier passes | no earlier item reopened; retained items keep their exact IDs | unchanged |

<a id="read-retained-coverage"></a>

### Retained Coverage

Every retained item is listed with its exact prior ID and reason in [`coverage-reconciliation.json`](evidence/S02-P013/coverage-reconciliation.json). Nothing is retained from pass 008 or pass 011.

| Group | Items | Applicability rationale against the complete change set BASE..CAND |
|---|---|---|
| Row obligations on the 117 label-only rows | 156 | D, F and G are byte-identical; H keeps its before text as a full prefix and only gains the runtime label, which C-012 verified for all 210 rows; W001 found no difference on these rows (97 live-verified, 20 partially verified); source and WAR identical. |
| Reconnaissance line obligations | 129 | ROOT line mapped through ROOT..BASE (or the BASE position pass 012 recorded, or a unique label for 3 lines changed before BASE); the BASE line lies outside every BASE..CAND hunk and is byte-identical at CAND. |
| Section and process obligations outside the change | 34 | Their target is no changed section, row or chain fact (for example Source Inventory rows, GAP-001/005/006/009-011/013, the pass-011 failure facts, the historical correction records). |

The retained IDs come from pass 006 (216), pass 010 (75), pass 009 (16) and pass 012 (12).

<a id="read-comparison-scope"></a>

## Comparison Scope

- **Review mode and exact checked boundary:** `delta correction-validation: the complete BASE..CAND change set of the two Stage 1 records and the new dispositions record, against the W001 evidence (the WAR only where a disposition cites it), the 88 items, the 37 status changes and the status of every other named row, the open pass-012 findings, CHK-001..CHK-012 where applicable`
- **Previous report and pinned baseline:** root [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...`; previous pass and coverage base [`stage-02-pass-012.md`](stage-02-pass-012.md) `389f18db...`.
- **Changed items and direct dependencies rechecked:** see the correction-validation table. The ledger [`comparison-results.json`](evidence/S02-P013/comparison-results.json) lists each check with the obligations it covers.
- **Prior results relied on but not rerun:** 319 obligations, retained by exact pass-006, pass-009, pass-010 or pass-012 ID ([Retained Coverage](#read-retained-coverage)). They are not counted as newly matched.
- **Expansion triggers examined:** source-set change, scope change, new channel or subsystem, unreliable root or base, systemic or unbounded impact. None requires full-blind control.

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger is [`comparison-results.json`](evidence/S02-P013/comparison-results.json). Grouped matched items are listed by range; every non-matched item is listed individually.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001..C-007 / packet, pins, root 006, base 012, chain, source and scope, change set, process files | [Stage 2 Correction Validation](README.md#stage-2-correction-validation); constitution A1, A4 | established (see [Eligibility Decision](#read-eligibility-decision)) | matched | pins; ledgers; status; git diff | none |
| C-008 / PM edits to the dispositions record | formatting only and disclosed | one PM fix isolated: reverting the [`legacy/README.md`](../../legacy/README.md) link on line 69 reproduces the attested section hash `29f41f0d...a955`; the second fix is not isolable; the record discloses neither, and its attestation no longer matches (4428 characters, `4b2f9f55...6aaa`) | mismatch | scratch scripts `pmfix.js`, `pmfix2.js` | F-007 |
| C-009, C-010 / Stage 3 inputs; the pass-012 carryover | pins; 436 checks; 54 findings; carryover terms | all reproduce | matched | W001 index | none |
| C-011, C-012 / cell diff and structure; the 210 runtime labels | only D/F/G/H change; labels equal `rows.json` and the residual table | as expected | matched | XLSX reader; label check | none |
| C-013..C-057 except C-042, C-054, C-055 / MC-A-01..MC-A-45 | applied as observed, nothing beyond the checks | each applied sentence restates its cited checks; the 5 partial applications name what was not applied | matched | per-item sheet | none |
| C-042 / MC-A-30, row 151 | live statements restate exercised checks | F151 says (W001) the recalculation runs on start, end, duration or delete; E-C-034 typed durations only, and the other triggers come from a script reading (E-F-02) | mismatch | E-C-034, E-F-02 | F-002 |
| C-054 / MC-A-42, rows 216, 218 | as above; SOAP stays as observed | F216 "the attribute operations run anonymously" and D218 "so any caller can use them, including unauthenticated calls"; D-C-036 shows only an anonymous setAttribute succeeding | mismatch | D-C-036, D-C-044 | F-002 |
| C-055 / MC-A-43, rows 218, 220 | as above | F218 "attribute calls run for any caller, including unauthenticated calls" (W001); the F220 text is supported | mismatch | D-C-036, D-C-044, D-C-049 | F-002 |
| C-058..C-066 / MC-B-01..MC-B-09 | as above | supported; MC-B-02 and MC-B-09 applied in part with reasons | matched | per-item sheet | none |
| C-067..C-100 except C-069 / MC-C-01..MC-C-34 | live answers as given, with their checks | supported; H60 rests on the PM redirect facts (L-C-004) | matched | per-item sheet; PM facts | none |
| C-069 / MC-C-03, GAP-007 and Q3 marks | as above | the remember-me, REST, cache and returnto marks are supported; the SOAP mark says "the attribute operations run anonymously" | mismatch | D-C-036 | F-002 |
| C-101..C-137 / the 37 status changes | claim fails live -> `Partial`; `Inferred` -> `Yes` only when the whole claim was observed | 32 to `Partial` on a failing or unreachable kept claim; 5 to `Yes` on a whole-claim observation; none upgrades partial or unexecuted evidence | matched | H notes; cited checks | none |
| C-138 / status of the other named rows | the same rule for the same kind of evidence | G162, G18, G149, G152 and G138 are inconsistent with G40, G38/G48, G40/G52 and G202 | mismatch | row views | F-001 |
| C-139 / runtime qualifiers in the same rows | no stale "(runtime unverified)" for a claim now observed | 9 rows keep it for a claim their own checks observe; 3 need a check | mismatch | qualifier scan | F-003 |
| C-140 / status counts | reproduce everywhere | 146/10/53/1 in the workbook, the reading block, the Boundary and the record | matched | workbook count | none |
| C-141..C-152 except C-148, C-150 / reconnaissance sections | changed lines restate W001; the rest byte-identical | supported | matched | reconnaissance diff | none |
| C-148 / GAP-007, GAP-008 | as above | GAP-008 supported; the GAP-007 SOAP mark goes beyond D-C-036 | mismatch | D-C-036 | F-002 |
| C-150 / Q2 and Q3 facts | as above | supported except the SOAP-mapping mark and the task-editor clause of the cache fact | mismatch | D-C-036; B-C-085 | F-002, F-004 |
| C-153..C-156 / the dispositions record | statements and tables equal the diff and the evidence | all tables and figures reproduce; tool runs are author facts | matched | table checks | none |
| C-157 / pass-012 F-001 | corrected or open | unchanged figures | mismatch | CAND lines 92-93, 321, 323 | F-005 |
| C-158 / pass-012 F-002 | corrected or open | unchanged figure | mismatch | CAND line 597 | F-006 |
| C-159 / pass-012 F-003 | every required action done | display part done; Q3 task-editor clause, E69, H89 unchanged | mismatch | CAND line 460; E69; H89 | F-004 |
| C-160 / the 54 W001 findings | each reaches the map | 54 of 54 | matched | item list | none |
| C-161..C-172 except C-164, C-167, C-171 / CHK-001..CHK-012 | the checklist row holds | see [Checklist Review](#read-checklist-review) | matched | linked checks | none |
| C-164 / CHK-004 | locale mechanisms complete | editor-display remainder | mismatch | C-159 | F-004 |
| C-167 / CHK-007 | no stale figure or qualifier | pass-012 figures; stale qualifiers | mismatch | C-139, C-157, C-158 | F-003, F-005, F-006 |
| C-171 / CHK-011 | unauthenticated exposure recorded as observed | SOAP anonymous statement overstated | mismatch | C-054, C-069 | F-002 |
| C-173 / author tool-execution facts | not re-executable under this packet | verifiable outputs checked in C-156 | not-applicable | packet | E-001 |
| C-174 / release-WAR equality | owner-approved intake fact outside the inputs | no conclusion depends on it | not-applicable | intake decision | E-002 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| `174` | `157` | `15` | `0` | `2` |

Findings: 7, all low. One finding can affect several checks. The 319 retained obligations are not in these counts.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Corrections and independent closure.** The 88 items as applied, by kind:

| Kind | Items | As observed | Beyond the checks | Applied in part (author) | Checks |
|---|---|---|---|---|---|
| a (correction) | 45 | 42 | 3 (MC-A-30, MC-A-42, MC-A-43) | 5 | C-013..C-057 |
| b (missing behavior) | 9 | 9 | 0 | 2 | C-058..C-066 |
| c (note) | 34 | 33 | 1 (MC-C-03) | 0 | C-067..C-100 |
| **Total** | **88** | **84** | **4** | **7** | |

**Status changes.** All 37 follow a stated case. Grouped by case:

| Case | Rows | Evidence |
|---|---|---|
| Kept claim fails live -> `Partial` (R-G2) | 38, 40, 45, 48, 52, 57, 102, 115-118, 121, 125, 130, 134, 144-147, 169, 170, 172, 174, 197, 198, 200, 201, 220, 221 | the H note of each row and its cited checks |
| Kept claim cannot occur, because its precondition fails live -> `Partial` | 119, 171, 175 | B-C-064; C-C-030, C-C-034 (C-C-033 and C-C-037 not executed and stated so) |
| Whole claim observed -> `Yes` (R-G3) | 124, 135, 202, 216, 234 | B-C-069..B-C-071; B-C-083; D-C-013, D-C-014; D-C-036; D-C-072, D-C-073 |

15 changes were proposed by an item; the 22 others (57, 102, 116-119, 121, 125, 130, 134, 144-147, 169-171, 174, 175, 198, 216, 220) apply the same cases to rows an item names. Where the author departed from an item (MC-A-18, MC-A-21, MC-B-02), the departure keeps evidence-bound statuses. The inconsistencies among rows that kept their status are F-001.

**Retained-check applicability and whole-scope coverage:** see [Retained Coverage](#read-retained-coverage) and the reconciliation table above.

**Return stage:** Stage 1 for F-001..F-006; F-007 concerns the PM-written part and the PM's edits of the same Stage 1 record.

<a id="read-findings"></a>

## Findings

<a id="read-f-001"></a>

### F-001 - The column-G status rule is not applied alike to rows with the same evidence

- Severity: low
- Comparison check IDs: C-138
- **Checklist link:** none: new finding (the author's own learning update proposes such a check, not yet admitted)
- **Checklist discrepancy:** the record says the rule "was applied to every row that an item names" and that a locale defect "is recorded as a locale exception"; five rows that kept their status contradict a rule applied elsewhere.
- **Required recheck:** a stated rule for conditional and environment-dependent live failures, applied to every row that an item names.
- Expected and source: PM rule (claim fails live -> `Partial`; `Inferred` -> `Yes` only when the whole claim was observed) and the record's R-G1..R-G3.
- Observed difference:
  - **G162** stays `Yes`. Its kept claim ("From a person page a user can view a timesheet") fails under the condition that made **G40** `Partial`: the person page answers HTTP 500 (setup-C-058, W001-F-10, high). Row 41 depends on the same page (its W001 verdict is live-verified; decide it with the same rule).
  - **G18** stays `Yes`. Its kept claim ("with exactly one visible project ... it redirects to that iteration") is contradicted live (A-C-018: one readable project, five in the system, no redirect), and the rule was not re-read. That is the situation that made **G38** and **G48** `Partial`.
  - **G149** and **G152** stay `Yes`. Their kept claims fail live in es sessions (C-C-003: a hint-shaped entry passes validation and ends in HTTP 500, nothing saved; an Insert-Time-shaped entry loses its minutes). The record uses a locale exception that the PM rule does not contain, while an HTTP 500 in place of a message made **G52** `Partial` and a data-conditional HTTP 500 made **G40** `Partial`.
  - **G138** stays `Inferred`, while **G202** became `Yes` on the same kind of evidence (original condition: no mail, the stylesheet fetch fails; adapted environment: the mails as mapped; B-C-086 and B-C-087 against D-C-013 and D-C-014).
- Evidence: workbook cells D/F/G/H of rows 18, 40, 41, 52, 138, 149, 152, 162, 202 at CAND; the cited checks.
- Requirement impact: the meaning of column G for live-failed rows.
- Required action: state the deciding rule for conditional failures (data state, session locale, deployment condition) and apply it to rows 18, 41, 138, 149, 152 and 162, or record why each differs from rows 38/48, 40, 52 and 202.
- Correction impact: these G cells and their H notes, the status counts (reading block, Boundary, record) and the record's status-rule section.
- Return stage: 1

<a id="read-f-002"></a>

### F-002 - Some live-labelled statements say more than the cited checks observed

- Severity: low
- Comparison check IDs: C-042, C-054, C-055, C-069, C-148, C-150, C-171
- **Checklist link:** CHK-011 (each unauthenticated surface recorded with its actual exposure) in [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks)
- **Checklist discrepancy:** the author's CHK-011 self-check says the unauthenticated surfaces "cite the anonymous observation"; the observation covers one operation.
- **Required recheck:** CHK-011 on rows 216 and 218, GAP-007 and the Q3 SOAP-mapping fact; the assignment rule "nothing claimed beyond the live evidence" on row 151.
- Expected and source: the relayed owner direction (SOAP and WAP facts stay as observed, no extension) and the cited checks.
- Observed difference:
  - **SOAP:** F216 ("the attribute operations run anonymously"), D218 ("so any caller can use them, including unauthenticated calls through /servlet/AxisServlet"), F218 ("attribute calls run for any caller, including unauthenticated calls", marked W001), GAP-007 and the Q3 SOAP-mapping fact ("the attribute operations run anonymously", marked live-observed). D-C-036 sent getProjects, getProject, getAttribute and setAttribute without credentials: only setAttribute succeeded; getAttribute faults for every caller (D-C-044); getAttributes was read as the editor; deleteAttribute, getAttributes and getAttributesWithPrefix were not called anonymously. The Q3 attribute-operation row states it correctly ("an anonymous one ... is persisted").
  - **Row 151:** F151 says (W001) that the remaining hours are recalculated "when the start, end or duration of an entry changes or an entry is deleted". E-C-034 typed durations only; the other triggers come from part E reading `editTimeEntries.js` (E-F-02), which is static.
  - The W001 list itself carries the broader wording (MC-A-42, MC-C-03, MC-A-30); the assignment required stopping at the observation.
- Evidence: D-C-036, D-C-044, D-C-049, E-C-034, E-F-02; the CAND cells and reconnaissance lines named above.
- Requirement impact: the recorded exposure of the unauthenticated SOAP path (security-relevant, Q3 deferred) and one expected result.
- Required action: limit the live statements to the anonymous setAttribute (keep "no permission check" as the static source claim of all five operations); mark the start, end and delete triggers of row 151 as from the served script, not observed.
- Correction impact: F216, D218, F218, F151; GAP-007; the Q3 SOAP-mapping fact.
- Return stage: 1

<a id="read-f-003"></a>

### F-003 - Stale runtime-unverified qualifiers contradict the new runtime label

- Severity: low
- Comparison check IDs: C-139, C-167
- **Checklist link:** CHK-007 (no superseded value remains after a correction) in [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks)
- **Checklist discrepancy:** the record's Retained Work says the D, F and G claims of the label-only rows "therefore hold"; their "(runtime unverified)" qualifiers no longer do.
- **Required recheck:** CHK-007 over every D, E and F qualifier of the 210 rows after the label.
- Expected and source: MC-C-01 adds `Runtime: live-observed` with the W001 row verdict; a row should not also call the same claim runtime-unverified.
- Observed difference: 22 cells in 21 rows keep "(runtime unverified)". In 9 rows the row's own cited live checks observe exactly the qualified claim: 11 (A-C-007), 29 (A-C-030..A-C-032), 30 (A-C-033 and others), 135 (B-C-083; G now `Yes`), 164 (C-C-024), 176 (C-C-038), 225 (D-C-061), 228 (D-C-064), 234 (D-C-072; G now `Yes`). Rows 132, 142 and 184 need the author's check. Rows 31, 34, 60, 65, 68, 73, 82, 91, 126 and 172 qualify parts W001 did not observe, which is correct.
- Evidence: CAND cells F11, F29, F30, F132, F135, F142, F164, F176, F184, F225, F228, F234 and their labels.
- Requirement impact: the runtime status that a reader takes from a row.
- Required action: replace or narrow the qualifier in the 9 rows to what remains unobserved; check rows 132, 142 and 184.
- Correction impact: those F cells; no status change is implied.
- Return stage: 1

<a id="read-f-004"></a>

### F-004 - The static part of pass-012 F-003 is still open

- Severity: low
- Comparison check IDs: C-159, C-150, C-164
- **Checklist link:** CHK-004 and CHK-003, as in pass-012 F-003; fourth miss in the editor-date mechanism (pass-009 F-002, pass-010 F-003, pass-012 F-003)
- **Checklist discrepancy:** the author's CHK-004 self-check covers the observed locales but not the open static parts of the carried finding.
- **Required recheck:** CHK-004 per editor round trip (display, input aid, validation, save), with each pattern source.
- Expected and source: pass-012 F-003 required actions; B-C-085 (the task editor has no created-date field); D137 at CAND.
- Observed difference:
  - The Q3 cache fact (CAND line 460) still says "The iteration and task editors validate and show dates with them". The task editor shows no date (B-C-085; pass-012 evidence: `TaskEditorForm#setCreatedDate` is rendered by no JSP), as D137 now states itself.
  - E69 still reads "Date formats follow the UI locale bundle." without the exceptions stated in D69.
  - H89 still says "The accepted date and date-time patterns follow format.date and format.datetime of the active bundle"; the iteration editor accepts only `format.date`, from the server default locale's bundle (D69, row 89).
  - Closed: the time editor display, hint, Insert Time and saving are named as session-locale consumers in D69, F69, D70, F70 and the Q3 fact, with the observed es effects.
- Evidence: CAND reconnaissance line 460; workbook E69, H89, D137; B-C-085.
- Requirement impact: locale parity of the editors and the accuracy of the Q3 registry fact.
- Required action: restrict the Q3 clause to the iteration editor (and the time editor's validation); qualify E69; reduce H89 to the date pattern and its source.
- Correction impact: the Q3 cache fact, E69, H89 (by an appended note), the next correction record.
- Return stage: 1

<a id="read-f-005"></a>

### F-005 - Pass-012 F-001 is still open

- Severity: low
- Comparison check IDs: C-157, C-167
- **Checklist link:** CHK-007; open pass-012 F-001
- **Checklist discrepancy:** not applicable: BA-001-13 did not address it.
- **Required recheck:** CHK-007 with an independent implementation of rules M and S as written.
- Expected and source: pass-012 F-001 (rule M leaves 4607 methods, 4605 found; rule S has 3482 String loads, 3364 without empty strings).
- Observed difference: Scope And Provenance (CAND lines 92-93), the method-corr and BA-001-12 tool rows (CAND 321, 323) and the related Return Correction and self-check lines still state 4597/4595 and 3386. The text, the WAR and the source are unchanged since pass 012, so its evidence still applies. The delegated carryover accepted the inaccuracy as a residual risk; that does not close a finding.
- Evidence: CAND reconnaissance lines 92, 93, 321, 323; [`live-check-carryover-pass-012.md`](../stages/stage-02/live-check-carryover-pass-012.md).
- Requirement impact: the A4 correspondence record; no row changes.
- Required action: as in pass-012 F-001.
- Correction impact: as in pass-012 F-001, without the removed reading-block bullet.
- Return stage: 1

<a id="read-f-006"></a>

### F-006 - Pass-012 F-002 is still open

- Severity: low
- Comparison check IDs: C-158, C-167
- **Checklist link:** CHK-007; open pass-012 F-002 (and pass-009 F-003)
- **Checklist discrepancy:** not applicable: BA-001-13 did not address it.
- **Required recheck:** CHK-007 on the script-context rule, with the `exportLinks.jsp` handler as positive control.
- Expected and source: pass-012 F-002 (the rule as written gives 81 outputs).
- Observed difference: the script-sinks-09 tool row (CAND line 597) and the related Return Correction rows still state 103 contexts and 78 outputs; only the reading-block repetition disappeared with the whole bullet.
- Evidence: CAND reconnaissance line 597; the carryover record.
- Requirement impact: figure reproducibility only.
- Required action: as in pass-012 F-002.
- Correction impact: as in pass-012 F-002.
- Return stage: 1

<a id="read-f-007"></a>

### F-007 - The record does not disclose the PM edits made after the author

- Severity: low
- Comparison check IDs: C-008
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable.
- **Required recheck:** compare every attested hash in a correction record with the bytes at the candidate.
- Expected and source: PM changes after the author are disclosed and formatting-only; a record's attestation matches its bytes or is annotated.
- Observed difference: Scope Validation attests that the PM section is unchanged at 4398 characters with SHA-256 `29f41f0d...a955`. At CAND the section has 4428 characters and hashes `4b2f9f55...6aaa`. Reverting exactly one change (the code span of [`legacy/README.md`](../../legacy/README.md) on line 69 turned into a link) reproduces the attested hash, so that edit is formatting-only. The packet names a second PM formatting fix, which cannot be isolated from the permitted revisions. Neither edit is disclosed in the record.
- Evidence: my scratch scripts `pmfix.js` and `pmfix2.js` (a brute-force over the code-span links and section bounds: one match).
- Requirement impact: the integrity statement of the correction record; no map content.
- Required action: record both PM edits (what, where, why, after which attestation) in the next correction record or a PM note, without rewriting history.
- Correction impact: the next correction record; no workbook or reconnaissance change.
- Return stage: 1 (PM-written part of the Stage 1 correction record)

<a id="read-packet-observations-for-pm"></a>

### Packet Observations For PM

- **PO-1:** the packet's `review_mode` and `governing_procedure` mention attempt recovery, but its chain (`excluded_passes: []`, previous = coverage base 12) and the assignment say no recovery. I applied an ordinary correction-validation and made no recovery declaration.
- **PO-2:** `change_set_from_coverage_base.changed_paths` lists 3 paths; the actual change set has 248 (C-006). The packet calls the list a convenience.
- **PO-3:** the usability of pass 012 rests on two delegated decisions by Codex under the recorded mandate expansion. They meet the bounds of [the attribution rule](../maintenance/process-departure-2026-09-30-operational-mandate.md#read-attribution); they are not personal owner approvals, and the project does not claim Starter conformance for them.

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Runner self-test | `node .migration-tmp/stage-02-p013/tools/safe-run.js --self-test` | pass | 30 cases |
| Pin verification | scratch `pins.js` through the runner | pass | 30 of 30 |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <scratch report>` through the runner | pass | `errors: []` |
| Report and evidence links | my link check from [`analysis/reviews/`](README.md) and the evidence folder | pass | 0 broken links |
| Credential self-scan | scratch `credscan.js` over this report and the evidence folder | pass | 0 credential values |
| Worktree state | `git status --short` in the three checkouts, start and end | pass | empty |
| `audit:workbook`, `audit:artifact-links`, `audit:project` | not run: outside the packet's permitted operations | blocked | not part of this pass; PM runs them before publication |

<a id="read-blocked-scope"></a>

## Blocked Scope

No required item is not-checked. Two items are not applicable.

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-173 | The author's tool runs (audits, Excel open, scanners) cannot be re-executed under this packet. Their verifiable outputs (cell counts, package parts, hashes) are checked in C-153..C-156. | packet `permitted_operations` | [`packet.json`](evidence/S02-P013/packet.json) |
| E-002 | C-174 | The equality of the 594 classes with the release WAR is an owner-approved intake fact outside the permitted inputs; no conclusion here depends on it. | owner decision `source-intake-fallback-001` ([`source-intake-decision-001.md`](../source-intake-decision-001.md)) | [`war-comparison.json`](../../sources/provenance/war-comparison.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-007 | this report; [`comparison-results.json`](evidence/S02-P013/comparison-results.json) | pending | pending | pending |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-002 fails CHK-011; F-003, F-005 and F-006 fail CHK-007; F-004 fails CHK-004 (with CHK-003) for the fourth time in the editor-date mechanism; F-001 and F-007 have no existing check (proposals P-1 and P-5).

The result is `findings`: seven low findings remain, two of them carried open from pass 012. The control was admissible, the coverage union is complete (748 = 429 + 319 + 0) and no required item is unchecked or blocked, so it is not `blocked` or `invalid`; it cannot be `clean` while findings are open, including low ones. The process returns to Stage 1 for a bounded correction of F-001..F-007 (F-007 by PM). The next independent gate is another fresh correction-validation with root 006 and previous pass and coverage base 013. Alternatively the project rule `stage-02-live-carryover` allows a delegated decision on a low-only carryover; findings would stay findings. A Stage 3 re-entry needs one of these.

<a id="read-error-prevention"></a>

## Error Prevention

Follows [the shared procedure](../error-prevention.md). The checklist was read at once (correction-validation).

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b` (unchanged BASE..CAND)
- Author self-check record/version: [`stage-03-walkthrough-001-dispositions.md`](../stages/stage-01/stage-03-walkthrough-001-dispositions.md) (Checks Performed) and the reconnaissance Error Prevention entry of BA-001-13

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; new identifiers and one WAR citation | passed (all IDs and `history.jsp:52-63,97-111` resolve) | passed: every check, finding, item and residual reference of the new text resolves; the WAR lines hold the 9 `messages.getMessage` calls (C-161) | none |
| CHK-002; changed permission statements | displayed links and server-side facts kept apart | passed (C-162) | none |
| CHK-003; effects recorded as absent | each cites its observed failure | passed for the changed effects (C-163); the open editor mechanism is under CHK-004 | none |
| CHK-004; locale statements | locales named as observed (R-26 open) | failed: the pass-012 F-003 remainder (C-164) | F-004 |
| CHK-005; changed validation rows | keys kept, observed outcome added | passed (C-165) | none |
| CHK-006; changed delete rows | page-level effect, database residual | passed (C-166) | none |
| CHK-007; figures and labels | counts recomputed (146/10/53/1) | counts pass; failed for the stale qualifiers and the uncorrected pass-012 figures (C-167) | F-003, F-005, F-006 |
| CHK-008; query outcomes | recorded as observed faults | passed (C-168) | none |
| CHK-009; credential values | 0 hits | passed: 0 credential values in the changed records and in this evidence (C-169) | none |
| CHK-010; redirect statements | observed Location values | passed (C-170) | none |
| CHK-011; unauthenticated surfaces | cite the anonymous observation | failed: the SOAP statement goes beyond D-C-036 (C-171) | F-002 |
| CHK-012; request-derived sinks | observed results cited | passed (C-172) | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 013, correction-validation; checklist `8a15e08c...2a90b`.
  - CHK-001: every repository path in this report and the evidence is a relative link that resolves; every cited check ID exists in the W001 index. Passed.
  - CHK-007: every figure here is produced by my scratch generator from the cited files (174 = 157 + 15 + 0 + 2; 748 = 429 + 319 + 0; 602 + 146). Passed.
  - CHK-009: the scan of this report and the five evidence files finds 0 credential values (factory pair from [`legacy/README.md`](../../legacy/README.md) line 38 parsed in memory, 6 patterns with positive controls); raw role-name collisions are classified by masked context. Passed.
  - CHK-002..CHK-006, CHK-008, CHK-010..CHK-012: applied to my own statements about the corrections; no claim here goes beyond the cited checks. Passed.
  - Own deviations: eight (D-001..D-008), disclosed in the [access log](evidence/S02-P013/access-log.md).
- **Learning update (proposals for PM; not admitted here):**
  - **P-1 (new):** when live results change statuses, record the case of every named row and decide rows with the same kind of evidence (data condition, session locale, deployment condition) the same way. Basis: F-001.
  - **P-2 (refine CHK-011, or new):** a statement labelled live must cite a check whose action exercised exactly that statement; readings of served scripts or source stay static. Basis: F-002.
  - **P-3 (refine CHK-007):** after adding a runtime or status label, search the same row for superseded qualifiers ("runtime unverified", "expected") and reconcile them. Basis: F-003.
  - **P-4 (CHK-004 failure analysis):** a correction driven by a live list must also close the open static parts of a carried finding in the same mechanism. Basis: F-004, the fourth miss.
  - **P-5 (new, PM):** a record attestation (section hash) must be annotated when a later editor changes the attested bytes. Basis: F-007.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph.

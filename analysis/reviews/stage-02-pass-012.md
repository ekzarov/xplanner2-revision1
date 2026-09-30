# Stage 02 Review - Pass 012

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
> **Result: `findings` - Stage 2 pass 012 (correction-validation of BA-001-12 with attempt recovery; root pass 006, coverage base pass 010, excluded pass 011)**
>
> **Recovery is admissible.** Pass 011 failed on one git command outside its list, confined to its own session; it supplied no coverage. Pass 010 is a valid `findings` base: its incident assessment is owner-approved. The legacy source set and the governed scope are unchanged.
>
> - **Checked:** the whole change set BASE..CAND (22 cells in 10 rows, 24 reconnaissance hunks, the new dispositions record), the six open items against the WAR bytecode and the A4 source, their linked statements, and the pass-011 leads.
> - **Closed:** pass-010 F-002, F-004 and F-005.
> - **Not closed, recorded as new low findings:**
>   - **F-001:** the counting rules M and S for the correspondence figures do not reproduce as written. Rule M's exclusions overlap, so they leave 4607 methods, not 4597. Rule S counts Class loads as String loads, and the String loads number 3482, not 3504. This is the open part of pass-010 F-001.
>   - **F-002:** the restated script-context rule gives 81 outputs, not 78. The recorded figure needs quotes inside custom tags to end a value, which the text excludes. This keeps pass-009 F-003 open.
>   - **F-003:** the time editor shows and inserts dates in the session locale. Only its validation uses the static converters. The new Q3 statement and the reading block say the time and task editors "show" dates with the converters, and the consumer lists omit this display. This is the display-side remainder of pass-010 F-003.
>
> 41 new checks: 27 matched, 12 mismatch, 0 not-checked, 2 not-applicable. Coverage: 602 = 76 newly rechecked + 526 retained + 0 uncovered.
>
> **Checklist issues:** F-001 and F-002 fail CHK-007 again. F-003 fails CHK-003 and CHK-004 for the third time in this mechanism.
>
> **Next:** a bounded Stage 1 correction of F-001..F-003, then another fresh correction-validation (root 006, previous 012, coverage base 012), or an owner decision on a carryover of these low findings.
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
  - [F-001 - Counting rules M and S do not reproduce the correspondence figures](#read-f-001-counting-rules-m-and-s-do-not-reproduce-the-correspondence-figures)
  - [F-002 - The restated script-context rule gives 81 outputs, not 78](#read-f-002-the-restated-script-context-rule-gives-81-outputs-not-78)
  - [F-003 - The time editor shows and inserts dates in the session locale](#read-f-003-the-time-editor-shows-and-inserts-dates-in-the-session-locale)
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

- Date: 2026-09-30
- Stage: 02
- Pass: 012
- Scope: project; the BA-001-12 corrections in [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md), [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (210 rows) and the new record [`stage-02-pass-010-dispositions.md`](../stages/stage-01/stage-02-pass-010-dispositions.md), against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war) (authoritative) and the A4 source `sources/xplanner-plus-r426`; the complete change set BASE..CAND, the six open items, their linked statements and the leads of excluded pass 011
- Reviewed revision: `2c176d4fa6a610b4b18acaaca3cb7e7ece4d1941`
- Base revision: `9667b69d774bad704766a6bd7d439ca8fe4cac78` (coverage base, reviewed by pass 010); root `15cb6b26946f73596177eba8cead333383d9f728` (pass 006); excluded attempt pass 011 at `8d137ed39a6f576dc7f5d402711cb885960807bf`
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p012`
- Session ID: a1d8c39bcc8758c6c (subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P012/independence-record.md`](evidence/S02-P012/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P012`, [`packet.json`](evidence/S02-P012/packet.json) SHA-256 `7073b2b707028c32afaee1f66172f955cb1603824c822e4fe39491cfbc54759d`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: delta (the complete BASE..CAND change set, its linked statements and the six open items; bounded expansion to the time-editor display path under F-003)
- Control mode: correction-validation
- Verification baseline: root pass 006 (`15cb6b2`); coverage base pass 010 (`9667b69`; reconnaissance `7c57c864...ad56`, workbook `8eb58ab3...da3c`); previous pass 011 (invalid, excluded)
- Expansion trigger: none for a full-blind pass; bounded expansion to `UpdateTimeAction#populateForm` and the time-editor JSP (F-003)

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

I am not an author: BA-001-01..12 were written by subagent `a5bb18013a4f4d2f8`. I am not a reviewer of passes 001-011. The [independence record](evidence/S02-P012/independence-record.md) lists the client-injected context. The [access log](evidence/S02-P012/access-log.md) records the access sequence and eight disclosed deviations; none affects independence.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy).
  - Committed blobs are identical at ROOT, BASE and CAND: `README.md` `78b1a6b4...5460`, `docker-compose.yml` `e15cd9db...e9ff`, `xplanner-plus.war` `46ff9dc0...4edc`, `demo-seed.sql` `41b2f6a3...66e1`. The seed checkout differs only by CRLF; its committed bytes hash to the pin.
  - I extracted the WAR with `unzip` into my scratch: 964 files, 594 classes, 102 JARs.
- **Upstream source (A4, supplementary):** `sources/xplanner-plus-r426/`, read-only, never executed or built. All 1117 files match [`source-manifest.json`](../../sources/provenance/source-manifest.json) (803 Java). The 39 files withheld under [`xplanner-plus-r426-allowlist.json`](../../sources/provenance/xplanner-plus-r426-allowlist.json) were read only by my scripts in memory; they are cited by path only.
- **Root:** [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, its blind checkpoint [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md) `c8d4f780...74d9` and [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json) `8f734d0d...4cbe`, and its ledger [`comparison-results.json`](evidence/S02-P006/comparison-results.json) `a205b9b5...702c`.
- **Coverage base:** [`stage-02-pass-010.md`](stage-02-pass-010.md) `f567227d...8f78`, its [ledger](evidence/S02-P010/comparison-results.json) `bc7b4267...a6aa`, [coverage record](evidence/S02-P010/coverage-reconciliation.json) `b7b29dae...63c6a2`, [change set](evidence/S02-P010/change-set.json), [incident assessment](evidence/S02-P010/incident-assessment.md) `fa700605...c0d7` and [PM verification](evidence/S02-P010/pm-incident-verification.json).
- **Excluded attempt:** [`stage-02-pass-011.md`](stage-02-pass-011.md) `4add59cb...b210` with its [access log](evidence/S02-P011/access-log.md) and [coverage record](evidence/S02-P011/coverage-reconciliation.json). Leads only.
- **Earlier eligible reports read for retention:** [`stage-02-pass-007.md`](stage-02-pass-007.md) (ledger only, to identify obligations) and [`stage-02-pass-009.md`](stage-02-pass-009.md) with its [ledger](evidence/S02-P009/comparison-results.json) and [incident companion](evidence/S02-P009/incident-assessment.md) `da20a8b7...7e68d`.
- **Intervening records (all pins match):** [`live-check-carryover-pass-009.md`](../stages/stage-02/live-check-carryover-pass-009.md) `14dc9dc3...f04f`; [`source-assessment-001.md`](../source-assessment-001.md) `cd68565d...b1a95fa`; [`source-intake-decision-001.md`](../source-intake-decision-001.md) `d2b5773b...686cbad`; [`source-reconciliation-001.md`](../stages/stage-01/source-reconciliation-001.md) `b3d65a92...965fa`; [`stage-02-pass-010-dispositions.md`](../stages/stage-01/stage-02-pass-010-dispositions.md) `8835272f...828c`; [`stage-03/deploy/README.md`](../stages/stage-03/deploy/README.md) `35c12c5d...1073`; the constitution [`constitution.md`](../../.specify/memory/constitution.md) 1.1.0 `bbf55c46...e36`; the five provenance files under [`sources/provenance/`](../../sources/provenance/source-links.json).
- **Candidate:** reconnaissance `b8e9981f...5b44`; workbook `4f26e8e7...097a`; checklist [`error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c...2a90b`.
- **Status and owner decisions:** [`migration_status.yaml`](../migration_status.yaml) at CAND: review ledger, transitions and `owner_decisions`.
- **Instructions:**
  - [Stage 2 Correction Validation](README.md#stage-2-correction-validation), [Stage 2 Attempt Recovery](README.md#stage-2-attempt-recovery), [Results](README.md#results) and [Independence](README.md#independence);
  - [Correction-Validation Packets](../agent_orchestration.md#correction-validation-packets), [Packet Transport Safety](../agent_orchestration.md#packet-transport-safety) and [Operational Incident Assessment](../agent_orchestration.md#operational-incident-assessment);
  - constitution [A1](../../.specify/memory/constitution.md#read-a1-war-only-legacy-evidence) and [A4](../../.specify/memory/constitution.md#read-a4-attributed-upstream-source-as-supplementary-evidence); [Source Readiness](../../MIGRATION.md#source-readiness);
  - [`SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), blob `560391d617ed24f5269b9d594c65056348e9f021`;
  - [`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md).
- **Explicit exclusions:** author tool-execution facts (E-001); the release-WAR equality (E-002); author scratch and earlier reviewer scratch; earlier-migration material (A2); any runtime, network, installs or project audits; git outside the four pinned revisions; the user profile.

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Runner:** every git command, node run and long read went through the pinned runner (self-test passed), except the eight disclosed deviations in the [access log](evidence/S02-P012/access-log.md).
- **Pins:** my `verify-pins.js` compared 43 pins in the candidate checkout and the main tree; all match (C-001).
- **Chain:** the review ledger, transitions and owner decisions at CAND; the pass-011 and pass-010 reports, access logs, incident companion and PM verification; the pass-006 checkpoint and release record; `chain-check.js` over the ledgers and coverage records of passes 006, 007, 009, 010 and 011 (C-003..C-006).
- **Change set:** `git diff --name-status` BASE..CAND, BASE..PREV and PREV..CAND; a `-U0` diff of the reconnaissance; my XML cell dumper over both workbook checkouts ([`change-set.json`](evidence/S02-P012/change-set.json), C-008).
- **Bytecode:** my class-file parser and disassembler `cls.js` read all 594 classes. A decoder check found 4586 code bodies, no unknown opcode and no branch or switch target off an instruction boundary. Struts `MessageResources` was read from the WAR's `struts-1.2.9.jar`.
- **Source:** bounded reads of the cited, non-withheld A4 files; withheld files only in memory inside the counting and credential scripts.
- **Own scripts (in the reviewer scratch):** `callers.js` (call sites and field accesses over all classes), `static-fmt.js`, `corr.js` and `corr-check.js` (rules M and S), `scriptctx.js` (script-context rule, with variants), `provcheck.js`, `citecheck.js`, `gen-coverage.js` with `verify-krec.js`, `verify-six.js` and `cov-review.js`, and `credscan.js`.
- **Coverage reconciliation:** each of the 588 obligations of the pass-010 union and 14 new obligations maps to exactly one new check or one retained exact ID ([`coverage-reconciliation.json`](evidence/S02-P012/coverage-reconciliation.json)). The generator refuses duplicates and any ID from pass 008 or 011. Every retained reconnaissance line was confirmed byte-identical at CAND.
- **Batches:** one batch, no context reset, no sampling within the declared scope.
- **Worktree state:** the three checkouts had an empty `git status --short` at start and at end.
- **Credential safety:** values stay in memory only. The self-scan is in the Reviewer Self-Check.
- **Transport safety:** large outputs went to the scratch and were read in bounded excerpts. I opened no file outside the allowed folders and no client-persisted output.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: correction-validation. No blind inventory was created, claimed or recreated. The frozen Phase A of root pass 006 serves as provenance only.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

Not applicable (correction-validation). The pass-006 checkpoint is assessed in C-003.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: correction-validation has no delayed Phase B; prior evidence was permitted at launch.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

- **Root full baseline:** pass 006, `ee71a38f...cff67`, with its blind checkpoint and 539-item ledger (C-003).
- **Latest preceding control:** pass 011, `4add59cb...b210`, `invalid` (excluded). The last valid control and coverage base is pass 010, `f567227d...8f78`, `findings` (C-004..C-006).
- **Source identity:** the four legacy blobs are identical at ROOT, BASE and CAND; nothing under [`sources/provenance/`](../../sources/provenance/source-manifest.json), in the constitution, the checklist or the skill changed BASE..CAND (C-007).
- **Baseline and candidate:** reconnaissance `7c57c864...ad56` (BASE) and `b8e9981f...5b44` (CAND); workbook `8eb58ab3...da3c` and `4f26e8e7...097a`.
- **Eligibility decision:** admissible; see [Eligibility Decision](#read-eligibility-decision).
- **Complete change set (C-008):**
  - **Workbook:** 22 cells in rows 69, 70, 71, 89, 178, 180, 182, 184, 186 and 216 (D 5, F 6, G 1, H 10). The before text stays as prefix in 9 H cells; in H178 the note sits before the unchanged provenance sentence. Statuses go from 169/19/21/1 to 168/20/21/1.
  - **Reconnaissance:** 24 hunks, 57 lines added and 34 removed, in the reading block, Scope And Provenance, Build, Run, And Test Evidence, the two Q3 facts, the Parity-Map Boundary, Return Correction Evidence, the Stage 1 Exit Checklist and Error Prevention.
  - **New record:** [`stage-02-pass-010-dispositions.md`](../stages/stage-01/stage-02-pass-010-dispositions.md).
  - **Other files:** [`migration_status.yaml`](../migration_status.yaml) and 18 sealed review files of passes 010 and 011, added only.
  - **Around pass 011:** BASE..PREV holds all Stage 1 changes; PREV..CAND changes no Stage 1 record.
- **Open-finding reconciliation:** see [Open-Item Closure](#read-open-item-closure).
- **Expansion decision: bounded expansion, no full-blind trigger.** The F-003 check of display consumers led to `UpdateTimeAction#populateForm` and the time-editor JSP; that mechanism is bounded by the call-site scan over all 594 classes.

| Required coverage item | Prior report / check IDs | Source and current claim identity | Handling in this pass | New check IDs or retention evidence |
|---|---|---|---|---|
| Packet, runner, pins, root 006, base 010, excluded 011, chain, source and scope | pass-010 C-001..C-007, C-020, C-045; pass-009 C-002, C-004; new recovery obligations N-01..N-03 | status ledger, sealed evidence, legacy blobs, provenance | rechecked | C-001..C-008, C-019 |
| The six open items | pass-010 C-009, C-011, C-012, C-015..C-017, C-024, C-025, C-031, C-032, C-035, C-037; pass-009 C-020, C-021 | changed cells and hunks; WAR bytecode; A4 source | rechecked | C-009..C-018 |
| Rows 69, 70, 71, 89, 178, 180, 182, 184, 186, 216 and the obligations that name them | pass-006 row checks and inventory items; pass-010 C-010, C-013, C-023, C-025 | 22 changed cells; unchanged cells of these rows | rechecked | C-012..C-017, C-029, C-030 |
| Changed reconnaissance sections | pass-006 C-493, C-494, C-500..C-503, C-126, C-486, C-492, C-534, C-538; pass-010 C-022, C-026, C-027, C-030..C-034 | 24 hunks | rechecked | C-020..C-027 |
| The dispositions record and the new claims | new obligations N-04..N-14 | new record and new lines | rechecked | C-009..C-011, C-013..C-015, C-018, C-022, C-026..C-028 |
| CHK-001..CHK-012 and exclusions | pass-010 C-039..C-042, C-044, C-046, C-021 | the whole change set | rechecked | C-031..C-041 |
| All other obligations (526) | exact pass-006 (327), pass-009 (35) and pass-010 (164) IDs | cells byte-identical BASE..CAND; lines outside every BASE..CAND hunk and identical at CAND; source and WAR identical; mechanism not an input of the six items | retained | groups in [`coverage-reconciliation.json`](evidence/S02-P012/coverage-reconciliation.json) |

| Reconciled required coverage items | Newly rechecked items | Valid retained items | Uncovered items |
|---|---|---|---|
| 602 | 76 | 526 | 0 |

- **The 602:** the 588 obligations of the pass-010 union (568 items and 20 new pass-010 obligations) and 14 new obligations of this pass (N-01..N-14).
- **The 76:** 62 prior obligations whose target changed or whose pass-010 check was a mismatch, and the 14 new ones.
- **Counts:** the 41 comparison checks below count only newly executed checks. Retained items are not counted as newly matched.

<a id="read-eligibility-decision"></a>

### Eligibility Decision

**Correction-validation with attempt recovery is admissible.** The reasons follow.

1. **Root 006 keeps independence, completeness, provenance and source identity (C-003).**
   - Its report, ledger and checkpoint hashes match.
   - Its 138-item Phase A was saved at `13:23:33Z`, before the Phase B release at `13:25:05Z` on `2026-09-25`.
   - Its 539 checks are complete: 519 matched, 17 mismatch, 0 not-checked, 3 not-applicable.
   - ROOT..CAND only adds sealed review files; the two modified review files are the README and the template.
2. **Pass 010 is the valid coverage base (C-004).**
   - It is a `findings` correction-validation under root 006; its predecessor 009 was valid, so it needed no recovery.
   - Its ledger (46 checks: 28/16/0/2) and its coverage record (588 = 224 + 364 + 0) are complete, and the base checkout reproduces its reviewed record hashes.
   - Its disclosed incidents have a companion (`fa700605...c0d7`, pin matches), PM verification and the owner decision `stage-02-pass-010-incident-approval:xplanner2-revision1`. That decision is approved by `ekzarov` at `2026-09-30T17:58:36Z`, bound to session `a81d0356af46a1dd1` and report `f567227d...8f78`. The pass-10 status entry records `incident_assessment` with five verified guards.
   - I read the companion myself. Its four deviations exposed file names, repository text and a PATH value, but no authoring context and no credential. No finding or retained item rests on them. I agree with the non-material classification.
   - Pass 010 is not clean; its F-001..F-005 were open at the start of this pass.
3. **Pass 011 failed only locally, and its failure is contained (C-005).** See [Attempt Recovery](#read-attempt-recovery).
4. **Recovery does not jump over anything (C-006).**
   - The chain is 006, 007, 008 (invalid, recovered by 009), 009, 010 and 011 (invalid).
   - Nothing after 010 is valid. No full-blind attempt followed 006.
   - Pass 011 records `baseline_pass: 6` and the same scope string.
5. **The source and the governed scope are unchanged (C-007).**
   - [`legacy/`](../../legacy) is identical at ROOT, BASE and CAND. A1 defines it as the baseline.
   - A4 was already in force at BASE. Its tree matches the manifest, and no provenance file changed.
   - The workbook keeps 210 rows; none was added, removed or renumbered. No channel or subsystem was added.
6. **The impact is bounded.** 10 rows and 24 hunks changed. Each finding sits in a named mechanism: two counting rules, one JSP counting rule, and the editor date path.

A changed WAR or [`legacy/`](../../legacy) file, a new row, channel or subsystem, an unreliable root or base, or a systemic omission would be a full-blind trigger. None is present.

<a id="read-attempt-recovery"></a>

### Attempt Recovery

- Recovery session: a1d8c39bcc8758c6c
- Recovery coverage base: 10
- Recovery excluded passes: 11
- Recovery basis: verified

- **Valid coverage base:** pass 010, correction-validation under root 006, `findings`, report `f567227d...8f78`, ledger `bc7b4267...a6aa`, coverage record `b7b29dae...63c6a2`; same scope; no unchecked work (588 = 224 + 364 + 0).
- **Preserved evidence:** root and base report, checkpoint, ledger and coverage hashes match; all sealed review files are add-only through CAND; the legacy set is unchanged since ROOT.
- **Whole change set:** all changes from BASE through CAND, including those before and after pass 011 (C-008).

| Excluded failed attempt / report / hash | Cause and isolation | Mandatory unchecked, new or failed-attempt-only work | Source-backed observations and independent resolution |
|---|---|---|---|
| Pass 011, [`stage-02-pass-011.md`](stage-02-pass-011.md), `4add59cb...b210`; `invalid`, correction-validation, `baseline_pass: 6`, same scope | **Cause:** reviewer `aeef20966517c8dbc` ran one `git log -1 --format=%cI` on the pinned candidate, outside the packet list. The command read one commit object of a pinned revision and printed one timestamp.<br>**Isolation:** PREV..CAND adds only the S02-P010 incident files, the S02-P011 files, the pass-011 report and status. No Stage 1 record changed after PREV. Its coverage record states 595 uncovered and no retention. Nothing from it is used here. | All 595 obligations it left uncovered, which are the pass-010 union and the BA-001-12 change set. They are rechecked or retained here from eligible reports (602 = 76 + 526 + 0). | **B-001** (pass 010 unassessed): resolved by the owner decision (C-004).<br>**Identity figures:** 22 cells, 24 hunks and 168/20/21/1 reproduce. Its "-27 lines" is -34 when list-item lines are counted (C-008).<br>**PO-1..PO-4:** packet-text observations; no Stage 1 claim.<br>No other lead (C-019). |

Pass 011 stays `invalid` and keeps its bytes; it contributes no coverage, closure or retained item.

<a id="read-open-item-closure"></a>

### Open-Item Closure

| Item (chain) | Author disposition (BA-001-12) | Independent result in this pass | Status |
|---|---|---|---|
| pass-010 F-001 (low): correspondence claims | confirmed; rules M and S stated; `LinkTag` and `AbstractFormat` recorded | divergences true and recorded (C-009); rule M leaves 4607, rule S contradicts itself and does not give 3386 (C-010, C-011) | divergence part closed; figures open as **F-001** |
| pass-010 F-002 (low): note id resolves to the parent | confirmed; rows 178-184 and the Q3 read-check fact corrected | true in the WAR and the source; all four rows and the fact state it (C-012, C-024) | **closed** |
| pass-010 F-003 (low): static editor converters | confirmed; rows 69-71, 89, 186 and the Q3 registry fact corrected | converter mechanism, callers, locales, the 8 static fields and rows 70, 71, 186 true (C-013, C-015); the time-editor display and Insert Time use the session locale, but the records say the editors "show" dates with the converters and omit this display (C-014, C-029) | mechanism closed; display side open as **F-003** |
| pass-010 F-004 (low): row 216 | returned to `Inferred` | G216 `Inferred`; descriptor facts true; linked counts say 57 (C-016) | **closed** |
| pass-010 F-005 (low): record accuracy | corrected in the dispositions record | the 31 inserted notes, the prefix statement and the omitted row are corrected and true (C-017) | **closed** |
| pass-009 F-003 (low): script-context counting rule | rule restated; 103 contexts, 78 outputs | 103 contexts reproduce; the rule as written gives 81 outputs (C-018) | open as **F-002** |
| passes 001-009: findings, E-items, leads | resolved in earlier passes | no earlier item reopened; retained items keep their exact IDs | unchanged |

<a id="read-retained-coverage"></a>

### Retained Coverage

Every retained item is listed with its exact prior ID and reason in [`coverage-reconciliation.json`](evidence/S02-P012/coverage-reconciliation.json). Nothing is retained from pass 008 or pass 011.

| Group | Items | Applicability rationale against the complete change set BASE..CAND |
|---|---|---|
| pass-006 row checks and inventory items | 327 | Their rows are not among the 10 changed rows, so all cells are byte-identical BASE..CAND. Their reconnaissance lines (ROOT numbering) map outside every BASE..CAND hunk and are byte-identical at CAND (132 lines checked). The source and WAR are identical, and the mechanisms are not inputs of the six items. Pass 010 retained the same IDs. |
| pass-010 checks (matched) | 164 | C-008, C-010, C-013, C-018, C-019, C-028, C-029, C-036, C-038 and C-043, where the target rows are unchanged. The 6 lines changed before BASE and rechecked by pass-010 C-029/C-038 lie outside every BASE..CAND hunk and are equal at CAND (`verify-six.js`). |
| pass-009 checks (matched) | 35 | pass-009 C-001, C-003, C-005, C-007..C-013, C-015, C-016, C-022..C-024, C-031..C-033, C-035..C-038, C-044, C-045: their rows (8, 12, 13, 56, 60, 101, 185) and sections (navigation, reflected-output, breadcrumb and stored-value Q3 facts; GAP-007; the Spring, Tiles and unauthenticated-list rows) are outside the change set. For pass-009 C-015, the breadcrumb for a note id shows the parent hierarchy, which does not change the recorded exposure (C-037). |

<a id="read-comparison-scope"></a>

## Comparison Scope

- **Review mode and exact checked boundary:** `delta correction-validation with attempt recovery: the complete BASE..CAND change set of the two Stage 1 records and the dispositions record, the six open items against the WAR and the A4 source, their linked statements, the leads of excluded pass 011, CHK-001..CHK-012 where applicable, and the bounded time-editor display path`
- **Previous report and pinned baseline:** root [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...`; coverage base [`stage-02-pass-010.md`](stage-02-pass-010.md) `f567227d...`; excluded [`stage-02-pass-011.md`](stage-02-pass-011.md) `4add59cb...`.
- **Changed items and direct dependencies rechecked:** see the correction-validation table. The ledger [`comparison-results.json`](evidence/S02-P012/comparison-results.json) lists each check with the obligations it covers.
- **Prior results relied on but not rerun:** 526 obligations, retained by exact pass-006, pass-009 or pass-010 ID ([Retained Coverage](#read-retained-coverage)). They are not counted as newly matched.
- **Expansion triggers examined:** source-set change, scope change, new channel or subsystem, unreliable root or base, systemic or unbounded impact, and the recovery rules (failure containment, no jump over a newer valid pass). None requires full-blind control.

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger is [`comparison-results.json`](evidence/S02-P012/comparison-results.json). Every non-matched item is listed individually.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001..C-008 / packet, runner, pins, root 006, base 010, excluded 011, chain, source and scope, change set | [Stage 2 Correction Validation](README.md#stage-2-correction-validation); [Stage 2 Attempt Recovery](README.md#stage-2-attempt-recovery); constitution A1, A4 | established (see [Eligibility Decision](#read-eligibility-decision) and [Attempt Recovery](#read-attempt-recovery)) | matched | pins; ledgers; status; git diff; cell dumps | none |
| C-009 / pass-010 F-001: divergent classes | every source/WAR body difference recorded (A4) | `LinkTag#addNavigationParameters` and `AbstractFormat#getFormat` differ as recorded; only row 114 cites `LinkTag`, for the shared branch | matched | listings; source | none |
| C-010 / rule M | 4597 methods and 4595 found under the rule as written (CHK-007) | the 23 named members include 10 synthetic `access$N` members that are also among the 35 synthetic or bridge members; the rule leaves 4607 (4605 found) | mismatch | `corr.js`, `corr-check.js` | F-001 |
| C-011 / rule S | 3892 - 388 - 118 = 3386, 155 not found | 3482 String loads plus 388 Class loads; the "class constants" are not String loads; 3482 - 118 = 3364 | mismatch | `corr.js`, `corr-check.js` | F-001 |
| C-012 / pass-010 F-002: rows 178, 180, 182, 184 | the object actually listed or opened (CHK-012) | note id yields its parent in the list and in the redirect; cells state it | matched | listings; source | none |
| C-013 / pass-010 F-003: converter mechanism; rows 70, 71, 186 | pattern and locale source of every converter (CHK-004) | as recorded: server default locale for the date converters, first request's locale for the decimal parser, 3 callers, `reset` clears, lenient | matched | listings; `callers.js` | none |
| C-014 / pass-010 F-003: display side and consumer lists | every display and parse consumer (CHK-003/CHK-004) | the time editor shows and inserts dates in the session locale; the records say the time and task editors "show" dates with the static converters | mismatch | `UpdateTimeAction#populateForm`; `editTimeEntries.jsp:31,37` | F-003 |
| C-015 / static formatter enumeration | 8 fields; 3 class-initialized with patterns and consumers | reproduced exactly | matched | `static-fmt.js` | none |
| C-016 / pass-010 F-004: row 216 | `Inferred` unless a method-level basis is cited | `Inferred`; descriptor facts true | matched | `WAR:WEB-INF/web.xml:168-176,299-300` | none |
| C-017 / pass-010 F-005: record corrections | the three corrections stated and true | true (31 inserted, 210 notes, `audit:artifact-links` row) | matched | `provcheck.js` | none |
| C-018 / pass-009 F-003: restated rule | 103 contexts, 78 outputs (32/27/18/1) as written | 103 contexts; 81 outputs (32/30/18/1) | mismatch | `scriptctx.js` | F-002 |
| C-019 / leads of excluded pass 011 | independent resolution | B-001 resolved; identity figures reproduce except "-27" (is -34); PO-1..PO-4 no Stage 1 claim | matched | C-004, C-008 | none |
| C-020 / reading block (CAND 37-48) | summary true | correspondence bullet repeats the irreproducible figures; F-003 bullet says the editors "show" dates with the converters | mismatch | recon diff | F-001, F-003 |
| C-021 / Scope And Provenance edits | rules reproducible; bullets true | rules M and S do not reproduce; divergence bullet, snapshot, analyst and skill lines true | mismatch | recon diff | F-001 |
| C-022 / Build rows changed | reproducible figures | 78 (script-sinks row) and 4597/3386 (method-corr and BA-001-12 rows) do not reproduce; hashes true | mismatch | recon diff | F-001, F-002 |
| C-023 / Q3 registry fact apart from the display sentence | true | prior text intact; new converter and formatter facts true | matched | recon diff; C-013, C-015 | none |
| C-024 / Q3 read-check fact | substitution stated | stated | matched | recon diff | none |
| C-025 / Boundary and Exit Checklist | counts true | 168/20/21/1, 57, 210 | matched | cell dump | none |
| C-026 / Return Correction Evidence rows and paragraph | dispositions true | the pass-009 F-003 row ("restated as the tool applies it") and the pass-010 F-001 row ("stated counting rules") are not supported | mismatch | recon diff | F-001, F-002 |
| C-027 / Error Prevention BA-001-12 | self-check supported | CHK-007 line unsupported; CHK-003/CHK-004 line misses the display side | mismatch | recon diff | F-001, F-002, F-003 |
| C-028 / dispositions record against the change set | rows, cells, sections, totals | consistent | matched | cell diff; recon diff | none |
| C-029 / unchanged cells of the 10 rows | no remaining copy of a corrected claim | E69 still reads "Date formats follow the UI locale bundle" without the editor exception | mismatch | cell dump | F-003 |
| C-030 / before-text preservation in the changed H cells | kept | kept (9 prefix, H178 inserted before the provenance sentence) | matched | cell diff | none |
| C-031..C-032, C-035..C-039 / CHK-001, CHK-002, CHK-009, CHK-011, CHK-012, CHK-005/006/008/010, checklist identity | as in the ledger | pass | matched | own scripts | none |
| C-033 / CHK-003, CHK-004 | every consumer with locale source | display side missed | mismatch | C-014 | F-003 |
| C-034 / CHK-007 | every figure reproducible | 4597/4595, 3386/155, 78 do not reproduce; the other figures do | mismatch | C-010, C-011, C-018 | F-001, F-002 |
| C-040 / author tool-execution facts | not a legacy claim | outside permitted evidence | not-applicable | packet boundary | E-001 |
| C-041 / release-WAR equality | owner-approved intake fact | outside permitted inputs; not load-bearing | not-applicable | [`war-comparison.json`](../../sources/provenance/war-comparison.json) | E-002 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 41 | 27 | 12 | 0 | 2 |

- **Findings:** 3 new (F-001..F-003, all low). They carry the open parts of pass-010 F-001 and F-003 and of pass-009 F-003. Pass-010 F-002, F-004 and F-005 are closed.
- **Blockers:** 0. **Justified exclusions:** 2 (E-001, E-002).
- These counts cover only the newly executed checks. The 526 retained obligations are reported separately (602 = 76 + 526 + 0).

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Actual corrections and independent closure (BA-001-12):**

| Correction or claim | Independent source and WAR check | Verdict |
|---|---|---|
| Rows 178, 180, 182, 184: a note id yields the parent | `IdSearchHelper#search` (`instanceof Note`, `getParent`); `Note#getParent` → `DomainContext#getNoteTarget` → `OLDIdSearchHelper#search`; `ContentSearchAction#doExecute` adds at index 0 when `Nameable`; `IdSearchAction#doExecute` builds `/do/view/<type>?oid=<id>` from the returned object; source identical | closed |
| Row 216 back to `Inferred` | only `/soap/*` and `/ical/*` carry the Basic filter; the `/*` filters are not security filters | closed |
| Rows 69, 70, 89: session-locale patterns vs editor converters | converters take `format.date`/`format.datetime` of the server default locale; the session-locale consumer lists omit the time editor's display and Insert Time | F-003 |
| Row 71: pickers and parse | the iteration editor calendar inserts the session pattern and `validate` parses with the static converter; lenient `SimpleDateFormat` | closed |
| Row 186: first request that renders a history date | `history.jsp:61,106` are the only pattern-less uses; `FormatDateTag` caches the default pattern with that request's locale | closed |
| Q3 registry fact: decimal and integer parsers, 3 fixed formatters | `DecimalFormat.getInstance(request.getLocale())`; `NumberFormat.getIntegerInstance()` used by `IdSearchAction`; `yyyy.MM.dd`, `EEE d-MMM-yy` (`timesheet.jsp:85`), `ddMMMyy` | closed, except the display sentence (F-003) |
| Correspondence: divergences, rules M and S | divergences true; rules do not reproduce | F-001 |
| Script-context rule restated | 103 contexts; 81 outputs as written | F-002 |
| BA-001-11 record corrections (F-005) | 31 inserted notes; `audit:artifact-links` row | closed |

Return stage for all findings: **1** (map defects).

No status change rests on a name-level match, and the source was never preferred over the WAR. The genuinely runtime-only rows (69-71, 184, 186, 216) are labelled as such and are not counted as defects.

<a id="read-findings"></a>

## Findings

<a id="read-f-001-counting-rules-m-and-s-do-not-reproduce-the-correspondence-figures"></a>

### F-001 - Counting rules M and S do not reproduce the correspondence figures

- Severity: low
- Comparison check IDs: C-010, C-011, C-020, C-021, C-022, C-026, C-027, C-034
- **Checklist link:** CHK-007 (every count reproducible from its stated rule) in [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks); open part of pass-010 F-001
- **Checklist discrepancy:** the BA-001-12 self-check says the correspondence figures "were regenerated under stated rules with breakdowns". Applied as written, neither rule gives its figure.
- **Required recheck:** CHK-007 with an independent implementation of each rule as written: the sets excluded must be disjoint or the text must say in which order they are removed; every defined term ("String constant", "pieces") must match what the tool counts.
- Expected and source: the Scope And Provenance rules M and S and the tool rows, which state `4739 - 84 - 23 - 35 = 4597` (4595 found; 347 of 620 constructors) and `3892 - 388 - 118 = 3386` (155 not found: 50/17/88).
- Observed difference:
  - **Rule M:** the 594 class files hold 4739 methods: 84 static initializers; 23 members named `access$N`, `values`, `valueOf` (10 `access$N`, 5 `values`, 8 `valueOf`); 35 synthetic or bridge members (10 `access$N`, 23 other, 2 constructors). The 10 `access$N` members are in both the second and the third set. Removing the three sets leaves 4607, of which 4605 are found. The 2 names not found are in `ViewPersonAction`, as recorded. There are 622 non-synthetic constructors, 349 of them without a declared source constructor. "4597" arises only by subtracting the overlap twice.
  - **Rule S:** `ldc` and `ldc_w` load 3482 String constants and 388 Class constants. The rule defines an entry as a load of a String constant, but then excludes "388 class constants" from 3892 entries, which are not String loads. Neither 3482 (String only) nor 3870 (String and Class) is 3892. After the 118 empty strings, 3364 remain, not 3386. The "pieces longer than 3 characters" test is not defined enough to reproduce 155; my reading leaves 158.
  - The reading block ("4595 of 4597", "3231 of 3386"), the method-corr row, the new BA-001-12 tool row, the pass-010 F-001 row of Return Correction Evidence and the BA-001-12 CHK-007 self-check repeat these figures.
  - The substance is unaffected: only `ViewPersonAction` lacks two method names, and the divergence statement for `LinkTag` and `AbstractFormat` is correct.
- Evidence: `corr.js` (rules M and S as written) and `corr-check.js` (decoder validation: 4586 code bodies, 0 unknown opcodes, 0 off-boundary branch or switch targets; 2969 String pool entries, matching the pass-010 per-class figure).
- Requirement impact: the A4 correspondence record; no row changes.
- Required action: state each rule so that it reproduces its figure, or regenerate the figures from the rule as written, and correct every repetition. For rule M, remove the overlap (4607 and 4605) or define the order. For rule S, define an entry and "pieces" exactly.
- Correction impact: the reading block, Scope And Provenance lines 93-94, the method-corr and BA-001-12 tool rows, the pass-010 F-001 row of Return Correction Evidence, the BA-001-12 CHK-007 self-check line, and the F-001 section of the dispositions record (by a new record, not by rewriting it).
- Return stage: 1

<a id="read-f-002-the-restated-script-context-rule-gives-81-outputs-not-78"></a>

### F-002 - The restated script-context rule gives 81 outputs, not 78

- Severity: low
- Comparison check IDs: C-018, C-022, C-026, C-027, C-034
- **Checklist link:** CHK-007; open part of pass-009 F-003
- **Checklist discrepancy:** BA-001-12 says the rule is now "restated as the tool applies it" and that the figure "reproduces under its stated rule (78 outputs)". It does not.
- **Required recheck:** CHK-007: implement the rule exactly as written, with the `exportLinks.jsp` handler as positive control.
- Expected and source: the script-sinks-09 tool row says that quotes inside scriptlets and inside JSP custom tags do not end an attribute value, and that each context runs to its matching closing quote. The row states 74 files, 103 contexts and 78 outputs (32 opening tags, 27 handlers, 18 bodies, 1 `javascript:` URL).
- Observed difference:
  - My implementation of the rule as written gives 74 files, 103 contexts and **81 outputs**: 32, **30**, 18 and 1. It gives 82 if a `<%= %>` nested in an output tag's attribute counts separately.
  - The 3 extra outputs are in the `onclick` handler of `WEB-INF/jsp/view/exportLinks.jsp:34-39`, whose value spans an `xplanner:link` custom tag. The tag's `"` quotes do not end the value under the rule. The tag is used with `removeQuotes="true"`, and `LinkTag#doEndTag` then strips `"` from the rendered link, so the browser's `onclick` value spans the same text.
  - 103/78 reproduces only if quotes inside custom tags *do* end the value, which is the opposite of the text.
  - The rule also blanks HTML comments inside `<script>` elements, where browsers still execute the code. This hides 7 outputs (for example the Insert Time script of `editTimeEntries.jsp:31,37`). The limitation is stated by the rule, and none of the 7 writes a request value.
  - The substance is unaffected: the 3 extra outputs write an export path built from the action mapping and a configured format, and two bundle texts, so "2 request values" stays true.
- Evidence: `scriptctx.js` (default; `--nest-once`; `--scriptlet-only`, which gives 103/78; `--no-blank-html`, which gives 109/89).
- Requirement impact: figure reproducibility (CHK-007) only.
- Required action: make the rule and the figure agree: either count the 3 handler outputs (81, or 82 with nested outputs) or restate the custom-tag clause for what the tool does. Correct the tool row, the pass-009 F-003 and pass-008 lead rows of Return Correction Evidence and the BA-001-10/12 CHK-007 lines.
- Correction impact: the script-sinks-09 tool row, two Return Correction Evidence rows, the reading-block F-005 bullet ("78 outputs"), two self-check lines, and the pass-009 F-003 section of the dispositions record (by a new record).
- Return stage: 1

<a id="read-f-003-the-time-editor-shows-and-inserts-dates-in-the-session-locale"></a>

### F-003 - The time editor shows and inserts dates in the session locale

- Severity: low
- Comparison check IDs: C-014, C-020, C-027, C-029, C-033
- **Checklist link:** CHK-004 (pattern and locale source of every formatting call) and CHK-003, as refined by pass-010 P-3 ("every display and parse consumer"); display-side remainder of pass-010 F-003
- **Checklist discrepancy:** BA-001-12 enumerated the static formatter fields and recorded their consumers, but took the editors' display from the converters. The time editor's display goes through the action, not the form. This is the third miss in this mechanism (pass-009 F-002, pass-010 F-003), so the check's failure needs analysis.
- **Required recheck:** CHK-004 per editor round trip: how each editor shows a stored value, how it offers input aids, how it validates and how it saves, each with its pattern and locale source.
- Expected and source:
  - `UpdateTimeAction#populateForm` fills the time editor's start, end and report dates with `#getDateTimeFormat` and `#getDateFormat`, whose patterns come from the session locale (`org.apache.struts.action.LOCALE`, else the JVM default). It fills the durations with `DecimalFormat.format(request, ...)` per request.
  - `editTimeEntries.jsp:100-125` renders these strings. Its Insert Time script fills `format.datetime` of the session bundle (`editTimeEntries.jsp:31,37`).
  - Only `TimeEditorForm#valideRow` uses the static server-default converters and the first-request decimal parser. Saving (`#doUpdateTimeAction`) uses the session locale again.
  - `TaskEditorForm#setCreatedDate` fills a string that no JSP renders; the task page shows the created date with `formatKey` (`task.jsp:65`).
  - `IterationEditorForm` parses only with `dateConverter`; it has no date-time field.
- Observed difference:
  - The new Q3 registry sentence (reconnaissance line 460) says: "The iteration, time and task editors validate and show dates and durations with them". It is true for the iteration editor, and wrong for the display of the time and task editors.
  - The reading-block F-003 bullet says the editor forms "validate and show dates with static converters".
  - The session-locale consumer lists omit the time editor's displayed values and Insert Time. D69 lists "the formatKey date displays, the calendar buttons and the saving of time entries". The H69, H71 and H89 notes list `UpdateTimeAction#getDateFormat, #getDateTimeFormat (saving time entries)`.
  - Consequence (static, runtime `Inferred`): the time editor shows and inserts in the session pattern and validates in the server pattern. This is the same mismatch that row 71 records for the iteration editor, but no record states it for the time editor. The lenient parse reads a date in the other order as a different date, so the time-entry checks (rows 153-158) can run on misread dates, while the save uses the session pattern.
  - Row 69 E still reads "Date formats follow the UI locale bundle" without the exception now stated in D69 and F69.
  - The H89 note keeps "the accepted date and date-time patterns", but the iteration editor accepts only `format.date`.
- Evidence: listings of `UpdateTimeAction#populateForm`, `#getDateFormat`, `#getDateTimeFormat`, `TimeEditorForm#valideRow` call sites, `TaskEditorForm#setCreatedDate` and `IterationEditorForm#validate`/`#requirePositiveInterval`; `callers.js`; `WAR:WEB-INF/jsp/edit/editTimeEntries.jsp:31,37,100-125`; source `UpdateTimeAction.java:116-117,273-274,337-348`.
- Requirement impact: locale parity of time entry (rows 149-160 through rows 69-70), and the accuracy of the Q3 registry fact.
- Required action:
  - Correct the Q3 sentence and the reading-block bullet: only the iteration editor shows dates with the static converter.
  - Record the time editor's round trip (display, Insert Time and save in the session locale; validation in the server default locale) in rows 69-70, with a live question like row 71's.
  - Complete the session-consumer lists; qualify E69.
  - Reduce H89 to the date pattern.
- Correction impact: rows 69, 70, 71 (note), 89 (note); the Q3 registry fact; the reading block; the BA-001-12 CHK-003/CHK-004 self-check line; the F-003 consumer list of the dispositions record (by a new record). Same mechanism: the call-site scan over all 594 classes finds no other editor display path through the converters.
- Return stage: 1

<a id="read-packet-observations-for-pm"></a>

### Packet Observations For PM

These are defects in the packet text, not Stage 1 findings. The packet identity (id, hash and revisions) is intact.

- **PO-1:** `decisions_in_force` lists the operator choice "do not use passes 010 and 011 as evidentiary base". That choice predates the owner approval of the pass-010 incident assessment (`2026-09-30T17:58:36Z`), which is not in that list but only under `incident_dispositions`. I followed the owner decision and the recovery rule; the operator choice no longer applies to pass 010.
- **PO-2:** `open_items` calls pass-010 F-001..F-005 items "from an excluded attempt". Pass 010 is the valid coverage base; only pass 011 is excluded.

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | SHA-256 of `packet.json` | pass: `7073b2b7...759d` | access log |
| Runner | `safe-run.js --self-test`; SHA-256 of runner and config | pass: 30 cases; `06b6170a...`, `209b1134...` | access log |
| Pinned hashes | own `verify-pins.js` | pass: 43 of 43 (seed by committed bytes) | reviewer scratch |
| Worktree revision and state | `git rev-parse HEAD`, `git status --short` in the three checkouts at start and end | pass: `15cb6b2`, `9667b69`, `2c176d4`; empty | access log |
| Source manifest | own `src-manifest.js` | pass: 1117 of 1117 | reviewer scratch |
| Citations (CHK-001) | own `citecheck.js` | pass: 23 SRC paths, 19 methods, 23 WAR and 6 JSP citations | reviewer scratch |
| Credential scan (CHK-009) | own `credscan.js` (values in memory; counts only) | pass: 0 credential values; hit count in RESULT | Reviewer Self-Check |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <scratch copy of this report>` | see RESULT | reviewer scratch |
| Link check of the report and evidence | own link check from their final folders, plus the audit's unlinked-path rule | see RESULT | reviewer scratch |
| Project audits (`audit:workbook`, `audit:project`, `audit:artifact-links`) | not run: not in the packet's permitted operations | not applicable (PM gate) | packet |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-040 | Author tool-execution facts (exit codes, branches, audit counts in the new tool rows) are process records outside the permitted evidence. Every legacy fact they support is checked in its own item. | PM packet `S02-P012` boundary | [`packet.json`](evidence/S02-P012/packet.json) |
| E-002 | C-041 | The equality of the 594 classes with the official release WAR is an owner-approved source-intake fact outside the permitted inputs. No conclusion here depends on it; every relied-on source reading was compared with the baseline WAR bytecode. | owner decision `source-intake-fallback-001` ([`source-intake-decision-001.md`](../source-intake-decision-001.md)) | [`war-comparison.json`](../../sources/provenance/war-comparison.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-003 (this pass) | this report; [`comparison-results.json`](evidence/S02-P012/comparison-results.json) | pending | pending (Stage 1 correction or owner carryover decision) | pending (next correction-validation) |
| pass-010 F-002, F-004, F-005 | C-012, C-016, C-017 | corrected by BA-001-12 | [`stage-02-pass-010-dispositions.md`](../stages/stage-01/stage-02-pass-010-dispositions.md) | closed |
| pass-010 F-001, F-003; pass-009 F-003 | C-009..C-011, C-013..C-015, C-018 | corrected by BA-001-12 (author claim) | same record | partly closed; remainders are F-001..F-003 |

**Disclosures:** eight deviations, all in the [access log](evidence/S02-P012/access-log.md):
- D-1, D-3..D-6 and D-8: inline node calls without the temp variables. They printed a timestamp, a hash or a count, or nothing.
- D-2: the packet read once with the client's file-read tool.
- D-7: one small here-document without TMPDIR.

None supplied evidence for a check, changed a reviewed file or emitted a credential value.

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:**
  - F-001 and F-002 fail CHK-007.
  - F-003 fails CHK-003 and CHK-004 for the third time in the date mechanism.
  - CHK-001, CHK-002, CHK-009, CHK-011 and CHK-012 passed where applicable; CHK-005, CHK-006, CHK-008 and CHK-010 had no changed input.

The recovery is **verified**, and the result is **`findings`**:
- The complete coverage union is accounted for: 602 = 76 + 526 + 0, with no not-checked item and no blocker.
- 12 checks are mismatches, linked to three new low findings.
- Pass-010 F-002, F-004 and F-005 are closed.
- `clean` is excluded because findings remain open. None of them is a runtime limitation moved to Stage 3.

**Next gate: an owner decision.**
- **Proposed:** a bounded Stage 1 correction of F-001..F-003 under the [return and correction protocol](README.md#return-and-correction-protocol), with its PR and CI.
- **Then:** a new correction-validation by another fresh eligible BA, with root 006, previous pass 012 and this pass as coverage base once it is recorded.
- **Alternative:** the owner may decide a carryover of these low findings under the project departure. That decision is the owner's.

This pass does not close Stage 2 and does not by itself permit Stage 3.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). In correction-validation the checklist and prior notes are read immediately. CHK rows do not bound the coverage.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b` (CHK-001..CHK-012; unchanged BASE..CAND)
- Author self-check record/version: [`stage-02-pass-010-dispositions.md`](../stages/stage-01/stage-02-pass-010-dispositions.md#read-error-prevention) (BA-001-12) and the reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; new SRC, WAR and line citations | `chk001-ba-001-12.js` over the new text | passed: every citation resolves (C-031) | none |
| CHK-002; negative claims (formatDate uses, Axis filter, `initConverters` callers) | negative checks with positive controls | passed (C-032) | none |
| CHK-003, CHK-004; formatter fields, locale sources and consumers (refined by P-3) | 8 fields enumerated with locale source and consumers | failed for the display side: the time editor shows and inserts in the session locale (C-014, C-033) | F-003 |
| CHK-005, CHK-006, CHK-008, CHK-010 | inputs unchanged; retained | not applicable to the change set: no validation key, delete, query path or link parameter changed (C-038) | none |
| CHK-007; figures and counting rules | 4597/4595, 3386/155, 103/78, 8 fields; 168/20/21/1 | failed for 4597/4595, 3386/155 and 78; passed for 103, 8 fields and the status counts (C-034) | F-001, F-002 |
| CHK-009; credentials | scanned; hit count in RESULT BA-001-12 | passed for the change set: 0 values (C-035) | none |
| CHK-011; unauthenticated surfaces | row 216 lowered; others on signed-in pages | passed (C-036) | none |
| CHK-012; request values to sinks (refined by P-4) | id lookups followed to the object listed or redirected to | passed (C-012, C-037) | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 012, correction-validation with attempt recovery. The result version is this report and the evidence hashed in RESULT; checklist `8a15e08c...2a90b`.
  - **CHK-001:** every WAR, JSP and source location cited here was read from the numbered file in my extraction or checkout.
  - **CHK-007:** each figure comes from a named script or command: 43 pins, 22 files, 22 cells, 24 hunks (+57/-34), 168/20/21/1, 539, 588, 4739/84/23/35/4607/4605, 3482/388/118/3364, 103/81, 8 fields, 602 = 76 + 526 + 0.
  - **CHK-009:** `credscan.js` collected candidate values in memory from the legacy README credential line, the compose file, the seed, the WAR configuration and the 39 withheld files. It searched this report and the five new evidence files. The result is in RESULT: counts only, with each hit classified without showing the value.
  - **Transport safety:** large outputs went to the scratch. No client spill file was opened.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-007, from F-001 and F-002):** a counting rule counts as reproducible only when an independent implementation of its text, not the author's tool, gives the figure. The excluded sets must be stated as disjoint or ordered, and each clause that changes the count (such as a quote-masking clause) needs a positive control that the clause changes. Expected: the rule text and an independent recount agree; a figure that needs an unstated or contrary clause fails.
  - **P-2 (refine CHK-004, from F-003):** for an editor, trace the whole round trip of each date or number field: the value shown (from the action that fills the form), the input aid, the validation and the save, each with its pattern and locale source. Enumerating formatter fields alone misses display paths that go through the action. Expected: one line per editor field and step; a record that claims the same locale for display and validation needs both paths cited.
  - **P-3 (review practice, from my own D-1..D-8):** run every node call, including one-line timestamps and hashes, through the runner; write small helper scripts instead of inline `node -e`. No new CHK: the packet rule already covers it.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| not applicable | not applicable | not applicable | not applicable | Stage 2 |

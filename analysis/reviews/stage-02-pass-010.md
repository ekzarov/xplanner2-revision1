# Stage 02 Review - Pass 010

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
> **Result: `findings` - Stage 2 pass 010 (correction validation of the source reconciliation BA-001-11 under amendment A4; root pass 006, previous pass 009)**
>
> **Eligible.** Roots 006 and 009 are valid and the chain is intact. The legacy source set is unchanged. A4 adds upstream source as supplementary evidence while the WAR stays authoritative, so it is an admissible extension of evidence, not a full-blind trigger.
>
> - **Checked:** the 58 `Inferred` → `Yes` changes (at method level, with my own reading of the WAR bytecode), the 23 corrected cells, all 210 new notes, the 26 reconnaissance hunks and the correspondence claims.
> - **Closed:** pass-009 F-001 and F-002. **Still open:** pass-009 F-003 (carried; the records are unchanged).
> - **New, all low:**
>   - **F-001:** two further classes differ between source and WAR (`LinkTag`, `AbstractFormat`), although the records name only `ViewPersonAction` and say no constant shows divergent code. The 4597 and 3386/155 figures have no reproducible rule.
>   - **F-002:** a numeric id of a note resolves to the note's parent. Rows 180, 182 and 184, the row 178 note and the Q3 read-check fact say otherwise.
>   - **F-003:** the editor date and number converters are static. They are fixed by the JVM default locale (dates) or by the first request (numbers). Rows 69-71, 89 and 186 and the Q3 registry fact do not record this.
>   - **F-004:** row 216 moved to `Yes` without the required method-level basis.
>   - **F-005:** the correction record misdescribes its own change: the notes were inserted, not appended, in 31 rows, and one changed tool row is not listed.
>
> 46 new checks: 28 matched, 16 mismatch, 0 not-checked, 2 not-applicable. Coverage: 588 obligations = 224 newly checked + 364 retained + 0 uncovered.
>
> **Checklist issues:** F-001 fails CHK-007. F-002 fails CHK-012. F-003 fails CHK-003 and CHK-004 again (the pass-009 F-002 class). F-005 fails CHK-007. F-004 is a new finding without a CHK.
>
> **Next:** the owner decides. Proposed: a bounded Stage 1 correction of F-001..F-005 and pass-009 F-003, then a new correction-validation by a fresh BA. Carrying new findings is not delegated by the operational mandate.
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
  - [Evidence Depth Of The Status Changes](#read-evidence-depth-of-the-status-changes)
- [Findings](#read-findings)
  - [F-001 - Source correspondence omits two divergent classes and states figures without a reproducible rule](#read-f-001-source-correspondence-omits-two-divergent-classes-and-states-figures-without-a-reproducible-rule)
  - [F-002 - A numeric id of a note resolves to the note's parent](#read-f-002-a-numeric-id-of-a-note-resolves-to-the-notes-parent)
  - [F-003 - Editor date and number converters are static and locale-fixed](#read-f-003-editor-date-and-number-converters-are-static-and-locale-fixed)
  - [F-004 - Row 216 changed to Yes without a method-level basis](#read-f-004-row-216-changed-to-yes-without-a-method-level-basis)
  - [F-005 - The correction record misdescribes its own change](#read-f-005-the-correction-record-misdescribes-its-own-change)
  - [Carried Open Item - Pass-009 F-003](#read-carried-open-item-pass-009-f-003)
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
- Pass: 010
- Scope: project; the Stage 1 records after BA-001-11 ([`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md), [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx), 210 rows) and the correction record [`source-reconciliation-001.md`](../stages/stage-01/source-reconciliation-001.md), against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war) and the A4 source `sources/xplanner-plus-r426`; the complete change set PREV..CAND, the open items of the chain, the related mechanisms and the pass-009 coverage union
- Reviewed revision: `9667b69d774bad704766a6bd7d439ca8fe4cac78`
- Base revision: `026fd972915bb58c449b0c6187620589a70b62d8` (reviewed by pass 009); root `15cb6b26946f73596177eba8cead333383d9f728` (pass 006)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p010`
- Session ID: a81d0356af46a1dd1 (subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P010/independence-record.md`](evidence/S02-P010/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P010`, [`packet.json`](evidence/S02-P010/packet.json) SHA-256 `d92c1bbbd46d6a0cb7b0a3b6f27f6e84e13099ea8f0a9f3208a7da29df3f0cb3`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: expanded (the complete change set PREV..CAND, its dependencies, the re-executed pass-007-backed obligations and the refined CHK-003/CHK-004 over the date and number mechanisms)
- Control mode: correction-validation
- Verification baseline: root pass 006 (`15cb6b2`); coverage base and previous pass 009 (`026fd97`; reconnaissance `c6a269ab...584b`, workbook `fafa8fcd...3bf5`)
- Expansion trigger: none for a full-blind pass; bounded expansion to the editor converters (F-003) and to all 4704 methods for the source-to-bytecode comparison (F-001)

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

I am not an author (BA-001-01..11 were written by subagent `a5bb18013a4f4d2f8`) and not a reviewer of passes 001-009. The [independence record](evidence/S02-P010/independence-record.md) lists the client-injected context. The [access log](evidence/S02-P010/access-log.md) records the access sequence and four disclosed deviations.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy).
  - Committed blobs are identical at ROOT, PREV and CAND: `README.md` `78b1a6b4...5460`, `docker-compose.yml` `e15cd9db...e9ff`, `xplanner-plus.war` `46ff9dc0...4edc`, `demo-seed.sql` `41b2f6a3...66e1`.
  - The `demo-seed.sql` checkout reads `2d32f7d5...` only because of CRLF conversion; the CR-stripped hash equals the blob.
  - I extracted the WAR with `unzip` into my scratch: 964 files, 594 classes, 102 JARs.
- **Upstream source (A4, supplementary):** `sources/xplanner-plus-r426/`, read-only, never executed or built. All 1117 files match [`source-manifest.json`](../../sources/provenance/source-manifest.json). The 39 withheld files were read only through my masking viewer and are cited by path.
- **Root:** [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, with its blind checkpoint [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md) `c8d4f780...74d9` and [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json) `8f734d0d...4cbe`, and its ledger [`comparison-results.json`](evidence/S02-P006/comparison-results.json) `a205b9b5...702c`.
- **Previous pass and coverage base:** [`stage-02-pass-009.md`](stage-02-pass-009.md) `8847eda3...cb08`, with its [ledger](evidence/S02-P009/comparison-results.json) `34fcc500...f2c`, [coverage record](evidence/S02-P009/coverage-reconciliation.json) `3180bb82...f77` and [incident companion](evidence/S02-P009/incident-assessment.md) `da20a8b7...7e68d`. The pass-007 [ledger](evidence/S02-P007/comparison-results.json) was read only to identify the obligations that pass 009 had retained through pass-007 IDs.
- **Intervening records:**
  - [`live-check-carryover-pass-009.md`](../stages/stage-02/live-check-carryover-pass-009.md) `14dc9dc3...f04f`;
  - [`stage-03/deploy/README.md`](../stages/stage-03/deploy/README.md) `35c12c5d...1073`;
  - [`source-assessment-001.md`](../source-assessment-001.md) `cd68565d...b1a95fa`;
  - [`source-intake-decision-001.md`](../source-intake-decision-001.md) `d2b5773b...686cbad`;
  - [`source-reconciliation-001.md`](../stages/stage-01/source-reconciliation-001.md) `b3d65a92...965fa`;
  - the constitution [`constitution.md`](../../.specify/memory/constitution.md) 1.1.0 `bbf55c46...e36`;
  - the departure records in [`analysis/maintenance/`](../maintenance/).
- **Candidate:** reconnaissance `7c57c864...cad56`; workbook `8eb58ab3...da3c`; checklist [`error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c...2a90b`. All 26 packet pins match in the candidate checkout and in the main tree (the seed by committed bytes).
- **Status and owner decisions:** [`migration_status.yaml`](../migration_status.yaml) at CAND. It includes `constitution-amendment-a4`, `source-intake-fallback-001`, `operational-mandate-until-stage-04`, `stage-02-live-carryover` and `stage-02-pass-009-incident-approval`.
- **Instructions:**
  - [Stage 2 Correction Validation](README.md#stage-2-correction-validation), [Results](README.md#results) and [Independence](README.md#independence);
  - [Correction-Validation Packets](../agent_orchestration.md#correction-validation-packets), [Packet Transport Safety](../agent_orchestration.md#packet-transport-safety) and [Operational Incident Assessment](../agent_orchestration.md#operational-incident-assessment);
  - [Source Readiness](../../MIGRATION.md#source-readiness);
  - [`SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), blob `560391d617ed24f5269b9d594c65056348e9f021`;
  - [`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md).
- **Explicit exclusions:**
  - Author tool-execution facts (E-001).
  - The release-WAR equality (E-002).
  - Author scratch and earlier reviewer scratch; earlier-migration links (A2); any runtime, network, installs or project audits; git outside the three pinned revisions; the user profile.

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Change set, regenerated:** my own `git diff --name-status` and `-U0` PREV..CAND, classified in [`change-set.json`](evidence/S02-P010/change-set.json).
  - 83 files.
  - Reconnaissance: 26 hunks (54 added, 32 removed lines).
  - Workbook: my own XML cell dumper compared every cell; only `xl/sharedStrings.xml` and `xl/worksheets/sheet1.xml` differ. 291 cells changed: H 210, G 58, D 14, F 9.
- **Bytecode:** my own class-file reader and disassembler parsed all 594 classes (4739 methods, no parse error). It also parsed the Struts 1.2.9 and Spring 3.0.5 classes that a claim relied on. Constants of withheld classes were compared by SHA-256 only.
- **Source:** a masking viewer extracted the cited methods. Withheld-file literals were masked, and lines that look like credentials were replaced.
- **Per-row bundles:** for each row, the cells, the note, the cited source methods and their WAR bytecode. I read the bundles of all 58 status changes and all corrected rows, and re-executed the 39 obligations that pass 009 had retained through pass-007 IDs.
- **Call-level body comparison:** every method invoked by the WAR bytecode must be named in the source method. I ran it over the 199 distinct cited methods, then over all 4704 non-synthetic methods (positive control `ViewPersonAction`).
- **Reachability:** a conservative call graph. Virtual calls go to every override. An instantiated application class counts as called back by library code. Positive controls: `DispatchForward#execute` and `EditPersonAction#beforeObjectCommit` reach the authorizer.
- **Other own scripts:** the static-registry scan (positive controls `FormatDateTag.dateFormatters` and `TableProperties.prototypes`), the correspondence regenerations, the CHK-001 citation checker, the figure re-execution and the credential scanner.
- **Coverage reconciliation:** a generator maps each of the 568 pass-009 obligations to exactly one new check or one retained exact pass-006/pass-009 ID ([`coverage-reconciliation.json`](evidence/S02-P010/coverage-reconciliation.json)). It refuses a retained mismatch, any pass-007 or pass-008 evidence, a double mapping and a gap.
- **Batches:** one batch, no context reset, no sampling within the declared scope.
- **Worktree state:** the three checkouts had an empty `git status --short` at start and at end. The main tree showed only this pass's untracked evidence folder.
- **Credential safety:** values stay in memory only. The self-scan is in the Reviewer Self-Check.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: correction-validation. No blind inventory was created, claimed or recreated. The frozen Phase A of root pass 006 serves as provenance only.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

Not applicable (correction-validation). The pass-006 checkpoint is assessed in C-001.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: correction-validation has no delayed Phase B; prior evidence was permitted at launch.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

- **Root full baseline:** pass 006, `ee71a38f...cff67`, with its blind checkpoint and 539-item ledger (C-001).
- **Latest preceding control:** pass 009, `8847eda3...cb08`, `findings`, correction-validation under root 006 with recovery from base 7 (8 excluded). Its incidents were approved as non-material. It is both the chronological predecessor and the coverage base (C-002, C-003).
- **Source identity:** the four legacy blobs are identical at ROOT, PREV and CAND (C-004).
- **Baseline and candidate:** reconnaissance `c6a269ab...` (PREV) and `7c57c864...` (CAND); workbook `fafa8fcd...` and `8eb58ab3...`.
- **Eligibility decision:** eligible; see [Eligibility Decision](#read-eligibility-decision).
- **Complete change set:**
  - **Reconnaissance:** 26 hunks in 12 sections: reading block, Scope And Provenance, evidence legend, Source Inventory (absent resources, Export row), Runnable Surfaces (mobile row), Build rows, GAP-003, Q3 facts (cache fact, read-check fact), Parity-Map Boundary, Return Correction Evidence, Exit Checklist, Error Prevention.
  - **Workbook:** 58 status cells; 14 requirement and 9 expected cells; 210 evidence cells. Each evidence cell keeps its prior text and gains a note: appended in 179 rows, inserted before the unchanged provenance sentence in 31 rows.
  - **New records:** the correction record, the source-intake records and the provenance files.
  - **Other files:** 9 sealed pass-009 files, the carryover record, 4 Stage 3 deployment files, the constitution, 5 maintenance records, process text, tools and configuration. They are process only and impose no obligation on the Stage 1 content (C-045).
- **Open-finding reconciliation:** see [Open-Item Closure](#read-open-item-closure).
- **Expansion decision: bounded expansion, no full-blind trigger.**
  - The source-to-bytecode comparison was widened from the 199 cited methods to all 4704. It found two further divergent classes (F-001); no record relies on their divergent branches.
  - The registry scan was widened to static formatter fields. It found the editor converters (F-003) in two form classes, which bounds the mechanism.

| Required coverage item | Prior report / check IDs | Source and current claim identity | Handling in this pass | New check IDs or retention evidence |
|---|---|---|---|---|
| Chain, root, previous pass, source identity, A4 admissibility, scope | pass-009 C-002, C-004 (and new obligations) | ledger, sealed evidence, legacy blobs, constitution A4 | rechecked | C-001..C-006 |
| Change set and workbook diff | pass-009 C-006 | PREV..CAND, all files | rechecked | C-007..C-009 |
| 58 status changes, 23 corrected cells, 210 notes | pass-006 row checks of the 65 changed rows; new obligations | cells D-G and H | rechecked | C-010..C-014 |
| Correspondence claims (A4) | new obligations | reconnaissance, correction record | rechecked | C-015..C-021 |
| Pass-009 F-001..F-003 and their checks | pass-009 C-017..C-021, C-025, C-026, C-028, C-030 | changed claims | rechecked | C-022..C-025, C-031, C-034 |
| Changed reconnaissance sections | pass-009 C-014, C-026, C-027, C-029, C-030; pass-006 line checks of 4 changed lines | hunks in the change-set file | rechecked | C-026..C-035 |
| Obligations retained by pass 009 through pass-007 IDs (56) | pass-007 check IDs (not retainable here) | rows and lines as in the pass-007 ledger | re-executed | C-036..C-038 (17 of them through their changed rows, C-010..C-013 and C-025) |
| CHK-001, CHK-002, CHK-009, CHK-011, CHK-012; checklist; intervening records; author tool facts | pass-009 C-039..C-043, C-046; new obligations | whole change set | rechecked | C-039..C-046 |
| All other obligations (364) | exact pass-006 and pass-009 IDs | byte-identical cells D-G or lines outside every hunk; source identical; mechanism unaffected | retained | groups in [`coverage-reconciliation.json`](evidence/S02-P010/coverage-reconciliation.json) |

| Reconciled required coverage items | Newly rechecked items | Valid retained items | Uncovered items |
|---|---|---|---|
| 588 | 224 | 364 | 0 |

- **The 588:** the 568 obligations of the pass-009 coverage union and 20 new obligations of this pass.
- **The 224:** 204 prior obligations and the 20 new ones.
- **Mapping:** each obligation appears once, with the new check that covered it or one retained exact ID.
- **Counts:** the 46 comparison checks below count only newly executed checks.

<a id="read-eligibility-decision"></a>

### Eligibility Decision

**Correction-validation is admissible.** The reasons follow.

1. **Root 006 is valid (C-001).**
   - A fresh subagent (`a700bf31602b78dd0`) saved its 138-item Phase A at `13:23:33Z`. Phase B was released at `13:25:05Z` and first accessed at `13:25:49Z`.
   - Its 539 checks are complete: 519 matched, 17 mismatch, 0 not-checked, 3 not-applicable. Every pinned hash matches.
   - The S02-P006 evidence was only added, never modified, through CAND.
2. **Pass 009 is valid, and the chain is intact (C-002, C-003).**
   - Pass 009 is a `findings` pass with its recovery verified, and its incidents are owner-approved as non-material.
   - No Stage 2 attempt followed it, so it is both the predecessor and the coverage base. The chain 006, 007, 008 (invalid, excluded), 009, 010 omits no attempt.
   - Attempt recovery is not needed.
3. **The legacy source set is unchanged (C-004).** A1 defines the baseline as the WAR distribution in [`legacy/`](../../legacy). Its four files are identical at the three revisions.
4. **A4 is an admissible extension of evidence (C-005).**
   - A4 admits the r426 tree only where it corresponds to the WAR. The WAR stays authoritative, [`legacy/`](../../legacy) stays unchanged, and differences are limitations, never business facts.
   - The control authority therefore remains the same immutable baseline. The source is a second view of the same release's code: it can deepen or refute a claim, but it neither replaces the WAR nor adds a surface.
   - The governed scope is unchanged (C-006): 210 rows, 18 epics, no row added, removed or renumbered. The additions list, the scope expansion and the reconnaissance edits add no channel, subsystem or mechanism inventory. The four templates found only in SVN are recorded as not packaged.
   - Retained WAR-based checks stay valid, because the WAR is unchanged and authoritative. Where a source reading contradicts a retained claim, that surfaces in this pass's rechecks (F-003 is such a case).
5. **The impact is bounded.**
   - 65 rows have changed cells, and all of them are rechecked.
   - The 210 appended notes are checked as new claims.
   - Both findings that go beyond the change set sit in named mechanisms: two classes and two form classes.

A full-blind trigger would be a changed WAR or [`legacy/`](../../legacy) file, a new row, channel or subsystem, an unreliable root, or a systemic omission. None is present.

<a id="read-attempt-recovery"></a>

### Attempt Recovery

Not applicable. The chronological predecessor, pass 009, is a valid `findings` pass, so this ordinary correction-validation chain records no recovery.

<a id="read-open-item-closure"></a>

### Open-Item Closure

| Item (chain) | Author disposition (BA-001-11) | Independent result in this pass | Status |
|---|---|---|---|
| pass-009 F-001 (low): cache writers, displaytag and FormatDateTag registries, view-cache key, counts | resolved statically | C-022: every required action is done and true in the WAR bytecode and the WAR `spring-beans.xml:46-48`; the Stage 3 part is covered by the owner-approved carryover | closed |
| pass-009 F-002 (low): history dates | resolved statically | C-023: rows 69, 70 and 186 record the exception; `history.jsp:61,106` and `FormatDateTag#doStartTag` confirm it | closed (the wording of row 186 is part of new F-003) |
| pass-009 F-003 (low): script-context counting rule | not resolved; rule text proposed | C-024: the tool row, the lead row and the self-check line are unchanged | open, carried |
| pass-009 CHK-003/CHK-012 failure (F-001) | registry writers recorded | the named registries are closed; the refined scan finds the static editor converters | new F-003 |
| pass-009 CHK-004/CHK-003 failure (F-002) | history exception recorded | closed for formatting tags; parse-side converters not covered | new F-003 |
| pass-009 CHK-007 failure (F-003) | not settled | unchanged | open with pass-009 F-003 |
| passes 001-008: findings, E-items, leads | resolved in earlier passes | no earlier item reopened. The pass-001 F-003 date-format resolution (per-bundle patterns for bundle-keyed consumers) still holds; its entry-side extent is new F-003 | no earlier item reopened |

<a id="read-retained-coverage"></a>

### Retained Coverage

Every retained item is listed with its exact prior ID in [`coverage-reconciliation.json`](evidence/S02-P010/coverage-reconciliation.json). Nothing is retained from pass 007 or pass 008.

| Group | Items | Applicability rationale against the complete change set PREV..CAND |
|---|---|---|
| K-ROW (pass-006 row checks) | 114 | Cells D-G are byte-identical. The prior evidence text is preserved verbatim (C-008, C-009), and the new note is checked separately (C-014). The source is identical, and the mechanism is neither changed nor touched by F-001..F-005. Rows 71 and 89 are excluded here and rechecked (C-025, C-037). |
| K-REC (pass-006 reconnaissance lines) | 136 | The line lies outside every PREV..CAND hunk and is byte-identical. The 4 lines inside hunks are rechecked (C-029, C-032). |
| K-INV, K-INV-P (pass-006 inventory items) | 47 + 9 | The mapped rows are unchanged in D-G, and the lines they rely on lie outside every hunk. This includes Scope And Provenance lines 82-100: the A4 bullet is an insertion between lines 90 and 91. |
| K-EARLY (earlier-finding resolutions) | 20 | Rows unchanged in D-G. |
| K-EXCL | 2 | Pass-006 E-001 infrastructure items; unchanged. |
| P9-RE, P9-NEW (pass-009 checks, matched only) | 26 + 10 | Their targets are unchanged or outside every hunk: pass-009 C-001, C-003, C-005, C-007..C-013, C-015, C-016, C-022..C-024, C-031..C-033, C-035, C-036, C-037 (row 12 only), C-038, C-044, C-045. |

<a id="read-comparison-scope"></a>

## Comparison Scope

- **Review mode and exact checked boundary:** `expanded correction-validation: the complete PREV..CAND change set of the two Stage 1 records and the correction record, their source and WAR dependencies, the open items of passes 001-009, the pass-007-backed obligations, CHK-001..CHK-012 where applicable, the refined CHK-003/CHK-004 over the date and number mechanisms`
- **Previous report and pinned baseline:** root [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...`; previous and coverage base [`stage-02-pass-009.md`](stage-02-pass-009.md) `8847eda3...`.
- **Changed items and direct dependencies rechecked:** see the correction-validation table. The ledger [`comparison-results.json`](evidence/S02-P010/comparison-results.json) lists each check with `covers_prior`.
- **Prior results relied on but not rerun:** 364 obligations, retained by exact pass-006 or pass-009 ID ([Retained Coverage](#read-retained-coverage)). They are not counted as newly matched.
- **Expansion triggers examined:** source-set change, scope change, new channel or subsystem, unreliable root or previous pass, systemic or unbounded impact, and the A4 admission. None requires full-blind control.

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger is [`comparison-results.json`](evidence/S02-P010/comparison-results.json). Every non-matched item is listed individually; matched items are grouped with exhaustive IDs.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001..C-008 / root 006, previous 009, chain, source identity, A4 admissibility, scope, change set, workbook diff | [Stage 2 Correction Validation](README.md#stage-2-correction-validation); constitution A1, A4 | established (see [Eligibility Decision](#read-eligibility-decision)); 291 cells exactly as recorded, 23/23 before/after texts exact | matched | hashes; git diff; cell dumps | none |
| C-009 / "before text kept as a prefix (asserted for 210 rows)" | the actual change | 31 rows: the note is inserted before the unchanged provenance sentence | mismatch | cell dump, insertion test | F-005 |
| C-010 / 54 `Inferred` → `Yes` rows | method-level source reading, not contradicted by the WAR bytecode and configuration | supported (row list in the ledger) | matched | bundles; bytecode; reachability | none |
| C-011 / rows 180, 182, 184 and the row 178 note | the object with the searched id is listed or opened | a note id resolves to its parent (`IdSearchHelper#search`) | mismatch | listings | F-002 |
| C-012 / row 216 → `Yes` | a method-level basis (assignment rule; record summary) | a descriptor fact with no new evidence | mismatch | `WAR:WEB-INF/web.xml:168-176,299-305` | F-004 |
| C-013, C-014 / 17 corrected cells of 14 rows; the 210 notes | supported by source and WAR | supported; exceptions linked to C-009, C-011, C-012, C-025 | matched | bundles; citation checks | none |
| C-015 / 4595 of 4597 method names | reproducible figure with a rule (CHK-007) | substance reproduced (only `ViewPersonAction`), total not reproducible | mismatch | `methodcorr.js` | F-001 |
| C-016 / 3386 constants, 155 unmatched, "None shows divergent code" | reproducible; true | not reproducible (2969; 3159 with numbers); statement false (`LinkTag`) | mismatch | `strcorr.js` | F-001 |
| C-017 / divergence inventory | every source/WAR body difference recorded (A4) | `LinkTag#addNavigationParameters` and `AbstractFormat#getFormat` also diverge | mismatch | `bodyall.js`; listings | F-001 |
| C-018..C-020 / non-class entries 268/253/12/3; jrpdf templates; source tree 1117/803 and manifest | reproducible | reproduced exactly | matched | `warsrc.js`; rehash | none |
| C-021 / release-WAR equality | owner-approved intake fact | outside the permitted inputs; not load-bearing here | not-applicable | `war-comparison.json` | E-002 |
| C-022, C-023 / pass-009 F-001 and F-002 closure | the required actions | done and true | matched | listings | none |
| C-024 / pass-009 F-003 | closed or open | unchanged, open | mismatch | recon diff | pass-009 F-003 (carried) |
| C-025 / date and number parse sources (rows 69, 70, 71, 186) | pattern and locale source of every format and parse call (CHK-003, CHK-004) | static converters fixed by the JVM default locale (dates) and the first request (numbers) | mismatch | `regscan.js`; listings | F-003 |
| C-026, C-027 / reading block; Scope And Provenance | summary and provenance true | correspondence sentences (F-001); numeric-search sentence (F-002) | mismatch | `legacy_reconnaissance.md:37-47,91-96` | F-001, F-002 |
| C-028, C-029 / legend; Source Inventory, mobile row, GAP-003 | true in the WAR | true | matched | descriptors; listings | none |
| C-030 / Build rows | reproducible figures | 266/315, 151/59 and outcome counts reproduced; the method-corr row repeats the irreproducible figures | mismatch | `legacy_reconnaissance.md:317` | F-001 |
| C-031 / Q3 cache fact completeness | every request-filled registry | static decimal parser and date converters missing | mismatch | `regscan.js` | F-003 |
| C-032 / Q3 read-check fact | true in the WAR | note id yields its parent | mismatch | `IdSearchHelper#search` | F-002 |
| C-033 / Boundary counts, Return Correction Evidence, Exit Checklist | true | true | matched | status counts | none |
| C-034 / Error Prevention BA-001-11 | claims supported | CHK-004 and CHK-007 lines unsupported | mismatch | `legacy_reconnaissance.md:617-626` | F-001, F-003 |
| C-035 / correction record consistency | matches the change | omits the `audit:artifact-links` row; "prefix" and "method-level for each" statements false | mismatch | `changedrows.js`; diff | F-005, F-004 |
| C-036 / re-executed pass-007-backed rows and lines | supported by the WAR | supported | matched | bundles; reachability | none |
| C-037 / row 89 accepted patterns | follow the active bundle | the static JVM-default converter | mismatch | listings | F-003 |
| C-038..C-045 / re-executed figures and sweeps; CHK-001; CHK-002; CHK-009; CHK-011; CHK-012; checklist; intervening records | as stated in the ledger | pass | matched | own scripts | none |
| C-046 / author tool-execution facts | not a legacy claim | outside permitted evidence | not-applicable | packet boundary | E-001 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 46 | 28 | 16 | 0 | 2 |

- **Findings:** 5 new (F-001..F-005, all low) and 1 carried open (pass-009 F-003, low).
- **Blockers:** 0. **Justified exclusions:** 2 (E-001, E-002).
- These counts cover only the newly executed checks. The 364 retained obligations are reported separately in the reconciliation (588 = 224 + 364 + 0).

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Actual corrections and independent closure (BA-001-11):**

| Correction or claim | Independent source and WAR check | Verdict |
|---|---|---|
| Row 10: saved URL with `?null` | `SecurityHelper#saveUrl` appends `"?"` and the query string in both source and bytecode; GET only; redirect on login | closed |
| Row 11: case option read by no live code | no caller of `isAuthenticationCaseSensitive` in bytecode, JSP or descriptor; HQL equality; kept `Inferred` with a live question | closed |
| Row 61: cache actions return no page | both actions return null; Struts `RequestProcessor` and `TilesRequestProcessor#processForwardConfig` return on null; the map is the permission-method cache (`spring-caching.xml:7`) | closed |
| Row 80: attributes only when different from the default | `saveOrUpdateAttribute` branches in bytecode | closed (the cell omits the empty-value branch that the note states) |
| Rows 98, 100: start page in two cases | `StartIterationAction#doExecute` calls `Iteration#close` (inactive); the hook `beforeObjectCommit` then calls `Iteration#start`, takes samples and writes history | closed |
| Rows 118, 136, 138, 153, 155, 158, 170, 181, 233 | importer `"C"` with `equalsIgnoreCase`; disposition rule; old assignee from the new acceptor (code and WAR template); `valideRow` branches #1-#9; note body rule; Accept-Language error text with the Spring fallback off; mobile login interception | closed |
| Rows 180, 182 (and 184, 178 note, Q3 fact): numeric id | the id lookup returns a note's parent | F-002 |
| Rows 69, 70, 186: history exception | recorded and true | closed; entry side and wording under F-003 |
| Correspondence statements | two more divergent classes; figures without rule | F-001 |

Return stage for all findings: **1** (map defects).

<a id="read-evidence-depth-of-the-status-changes"></a>

### Evidence Depth Of The Status Changes

| Rows | Depth of this pass's check | Result |
|---|---|---|
| 10, 13, 14, 16, 31, 47, 61, 62, 66, 67, 100, 118, 119, 122, 136, 151-160, 181, 183, 197, 205, 226, 229, 230, 233 | method-level source reading plus my own bytecode listing of every control-flow method, and masked constants compared by hash | matched |
| 23, 24, 25 | as above plus the WAR named queries `security.role.permissions` and seed hierarchy | matched |
| 29, 32, 164, 167, 184, 187, 218, 225 | as above plus reachability over the WAR call graph with positive controls (row 184 matched for the missing check; its note-id outcome is F-002) | matched (184: F-002) |
| 34, 80, 112, 130, 132, 145, 147, 192, 204, 206, 224 | method-level source reading, bytecode and WAR descriptors (scheduler commented out, component scans, TLD and JSP use) | matched |
| 180, 182 | as above | F-002 |
| 216 | descriptor only; no new evidence | F-004 |

No status change rests on a name-level match. Every cited method was compared with its WAR bytecode at call level, and the source was never preferred over the WAR.

<a id="read-findings"></a>

## Findings

<a id="read-f-001-source-correspondence-omits-two-divergent-classes-and-states-figures-without-a-reproducible-rule"></a>

### F-001 - Source correspondence omits two divergent classes and states figures without a reproducible rule

- Severity: low
- Comparison check IDs: C-015, C-016, C-017, C-026, C-027, C-030, C-034
- **Checklist link:** CHK-007 (every count reproducible from its stated rule and cited output) in [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks); constitution A4 (differences are recorded as limitations)
- **Checklist discrepancy:**
  - The BA-001-11 self-check says the correspondence counts are "as stated" and regenerated from the tool outputs.
  - Those outputs sit in the author scratch, no counting rule is stated, and two figures do not reproduce.
  - The divergence statement is contradicted by the bytecode.
- **Required recheck:**
  - Under CHK-007, state the counting rule for each correspondence figure, regenerate it, and keep the output as retained evidence.
  - Compare the source and bytecode bodies of all methods, not names and constants only, and record every divergence.
- Expected and source:
  - **`LinkTag#addNavigationParameters`:**
    - In the WAR, when the request has no Struts mapping, it sets `returnto` to the request URI of the Spring request attributes (`RequestContextListener.REQUEST_ATTRIBUTES`).
    - The r426 source throws `JspTagException` with the text "can't find ActionMapping in request", which does not occur in the WAR class.
  - **`AbstractFormat#getFormat`:** in the WAR it falls back to the servlet-context message resources when the request attribute is missing; the source has no fallback.
  - **Method-name figure:** a natural counting of the WAR gives 4739 methods. Excluding synthetic members gives 4704, also excluding static initializers gives 4620, and also excluding anonymous constructors gives 4579. None gives 4597.
  - **String constants:** 2969 per class, or 3159 with numeric constants; none gives 3386.
- Observed difference:
  - The reading block and Scope And Provenance present `ViewPersonAction` as the divergence and say that none of the 155 unmatched constants "shows divergent code". The correction record's Source Correspondence table and the method-corr tool row repeat 4597 and 3386/155 (50/17/88).
- Evidence: `bodyall.js` over 4704 methods (positive control `ViewPersonAction`; 8 further reports are masking artifacts of credential-bearing code); `methodcorr.js`; `strcorr.js`; the two listings named above.
- Requirement impact: the A4 limitation record. No row relies on the divergent branches; I searched the records for `LinkTag`, `addNavigationParameters`, `AbstractFormat` and the exception text.
- Required action:
  - Record `LinkTag` and `AbstractFormat` as source/WAR differences, with the WAR governing.
  - Correct "None shows divergent code" and the reading-block sentence.
  - State the counting rules for 4597 and 3386/155 or regenerate the figures under a stated rule.
  - Correct the tool row and the BA-001-11 CHK-007 self-check line.
- Correction impact: the reconnaissance reading block, Scope And Provenance lines 91-96, the tool row at line 317 and Error Prevention; the correction record's Source Correspondence section. No row changes.
- Return stage: 1

<a id="read-f-002-a-numeric-id-of-a-note-resolves-to-the-notes-parent"></a>

### F-002 - A numeric id of a note resolves to the note's parent

- Severity: low
- Comparison check IDs: C-011, C-026, C-032
- **Checklist link:** CHK-012 (request-derived values traced to every sink, including the object actually loaded and shown)
- **Checklist discrepancy:** the BA-001-11 self-check says CHK-012 was applied to the content-search id match (row 180). The sink is recorded as "the object with that id", but the code loads and shows another object when the id is a note's.
- **Required recheck:** CHK-012 for every id-based lookup: follow the request id to the object that is loaded, listed or redirected to. Expected: the note-to-parent substitution is recorded wherever the id lookup is described.
- Expected and source:
  - `IdSearchHelper#search` tries Project, Iteration, UserStory, Task, Person and Note. When the object is a `Note`, it returns `Note#getParent` (WAR bytecode: `instanceof Note`, `getParent`).
  - `ContentSearchAction#doExecute` puts that returned object first in the results.
  - `IdSearchAction#doExecute` redirects to `/do/view/<type of the returned object>?oid=<id of the returned object>`.
- Observed difference:
  - Row 180 D says the search "puts the object with that id at the top". Row 182 D and F say a numeric id lists "the matching ... person or note first", and that the jump redirects to `/do/view/<type>?oid=<id>`.
  - Row 184 F says "Any existing object ID opens its page". The row 178 note and the Q3 read-check fact (reconnaissance line 458) say the same.
  - For a note id, the parent object is listed or opened under the parent's id.
- Evidence: the three listings above.
- Requirement impact: rows 178, 180, 182 and 184 and the Q3 read-check fact; the Stage 3 live question for row 182.
- Required action: state that a note id yields the note's parent object, in the results and in the redirect (type and id of the parent). Keep the missing read check as recorded.
- Correction impact: rows 178 (note), 180, 182 and 184 and reconnaissance line 458. `IdSearchHelper` is used by `ContentSearchAction`, `IdSearchAction` and the breadcrumb lookup of `NavigationBarTag` (pass-009 C-015). The breadcrumb record states a lookup of the object named by `oid`; for a note id it shows the parent's hierarchy, which does not change the recorded exposure.
- Return stage: 1

<a id="read-f-003-editor-date-and-number-converters-are-static-and-locale-fixed"></a>

### F-003 - Editor date and number converters are static and locale-fixed

- Severity: low
- Comparison check IDs: C-025, C-031, C-034, C-037
- **Checklist link:** CHK-004 (per-variant formats; the pattern and locale source of each formatting call) and CHK-003 (writers of shared registries)
- **Checklist discrepancy:**
  - BA-001-11 states that the source confirms CHK-004 for "the pattern and locale source of each formatting tag" and records the history exception only.
  - The parse side of the editors, and their displayed values, come from static converters that are fixed per JVM.
  - This repeats the failure class of pass-009 F-002, so the check's failure needs analysis (why output tags were covered and form converters were not).
- **Required recheck:** CHK-004 and CHK-003 over every date and number format or parse call, including static form fields: pattern source, locale source (session, request header, JVM default, first request) and consumers. Expected: rows 69-71, 89 and 186 and the Q3 registry fact state them.
- Expected and source:
  - `AbstractEditorForm#initConverters` fills the static `dateTimeConverter` and `dateConverter` from `MessageResources#getMessage(String)`.
    - The Struts bytecode passes a null locale, which becomes `defaultLocale = Locale.getDefault()`, so the JVM default locale's bundle pattern applies to every user, set once.
    - It fills the static `decimalConverter` with `new DecimalFormat(request)`, whose parser uses `request.getLocale()` of the first request.
  - `TaskEditorForm` keeps a static `dateConverter` built the same way.
  - Consumers:
    - `IterationEditorForm` formats its date fields (`toString`) and parses them (`convertToDate`) with the static converter.
    - `TimeEditorForm#valideRow` validates dates and durations with the static converters.
    - `TaskEditorForm#validate` parses the created date with its static converter.
  - `UpdateTimeAction` saves with the session-locale pattern, and the calendar button of `editIteration.jsp:52-57` inserts the session bundle's `format.date`.
- Observed difference:
  - Rows 69 and 70 say dates are "displayed and entered" in each bundle's pattern.
  - Row 71 D says the iteration editor's "date parsing use[s] the locale pattern", and its new note confirms that "the locale pattern [is] as recorded".
  - Row 89 says the accepted patterns "follow format.date and format.datetime of the active bundle".
  - Row 186 says the history formatter takes the locale of "the first request after start-up". It is created by the first request that renders a history date.
  - The Q3 registry fact omits the static decimal parser fixed by the first request's `Accept-Language` locale.
- Evidence:
  - `regscan.js` (static formatter and collection fields written outside class initialization; positive controls hit);
  - listings of `AbstractEditorForm#initConverters`, `convertToDate` and `convertToDateTime`, `TaskEditorForm#validate`, `IterationEditorForm#validate`, `MessageResources#getMessage` and `MessageResources.<init>`;
  - `editIteration.jsp:52-57`.
- Requirement impact:
  - Locale parity of date and duration entry in the iteration, task and time editors.
  - Row 71's live question can be answered in the opposite way. On a server whose default locale bundle uses `yyyy-MM-dd`, a date inserted by the jQuery picker parses. A `dd-MM-yyyy` date from the calendar button is read leniently with the server pattern (`Inferred`).
- Required action:
  - Record the static converters with their pattern and locale sources and their consumers.
  - Narrow rows 69-70 to the session-locale consumers.
  - Correct row 71 D, its note and its live question, and correct row 89.
  - Change row 186 to "the first request that renders a history date".
  - Add the decimal parser, and the date converters as locale-fixed shared formatters, to the Q3 registry fact.
- Correction impact:
  - Rows 69, 70, 71, 89 and 186, the Q3 cache fact (line 454) and the Error Prevention learning line.
  - Same mechanism: the scan found no other static formatter field. `PersonTimesheetForm` holds an instance-level converter in the request locale (row 163, correct).
- Return stage: 1

<a id="read-f-004-row-216-changed-to-yes-without-a-method-level-basis"></a>

### F-004 - Row 216 changed to Yes without a method-level basis

- Severity: low
- Comparison check IDs: C-012, C-035
- **Checklist link:** none: new finding (no CHK covers the evidence basis of a status change)
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable; see the learning proposal P-2.
- Expected and source: the PM assignment rule says a status may change only on a method-level source reading that the bytecode and WAR configuration do not contradict. The correction record says each of the 58 changes "rests on a method-level reading of the cited source".
- Observed difference:
  - Row 216 moved from `Inferred` to `Yes` as "confirmed (descriptor)", with "none: descriptor fact, no Java involved".
  - Its only evidence is the `web.xml` mapping at `/servlet/AxisServlet` without a filter, which the row already cited while `Inferred`. The SVN copy of `web.xml` is identical and adds nothing.
  - The descriptor fact is true (C-012). The status change has no new basis, and the summary statement is false for this row.
- Evidence: `WAR:WEB-INF/web.xml:168-176,299-305`; the row 216 entry of the per-row table.
- Requirement impact: the meaning of `Yes` for row 216, and the accuracy of "58 rows ... on a method-level reading" in the reading block, the Parity-Map Boundary note and the correction record.
- Required action: either restore `Inferred` for row 216, or state its actual basis and change the summary statements to "57 on method-level readings and 1 on the descriptor". Record which rule permits a descriptor-only change.
- Correction impact: row 216 status and note; the reading block; the reconnaissance Boundary line 486; the correction record summary.
- Return stage: 1

<a id="read-f-005-the-correction-record-misdescribes-its-own-change"></a>

### F-005 - The correction record misdescribes its own change

- Severity: low
- Comparison check IDs: C-009, C-035
- **Checklist link:** CHK-007 (figures and descriptions match the current artifact after a correction)
- **Checklist discrepancy:** the record says the before text is "kept unchanged as a prefix (asserted for 210 rows)" and that for confirmed rows "only the source note was appended".
- **Required recheck:** CHK-007 against the regenerated change set: assert exactly what the tool does, and list every changed line.
- Expected and source: the regenerated change set ([`change-set.json`](evidence/S02-P010/change-set.json)).
- Observed difference:
  - In the 31 rows with provenance notes, the note is inserted before the unchanged provenance sentence; the before text is intact but is not a prefix.
  - The changed-sections list of Changed Rows omits the `audit:artifact-links` row (PREV line 318, CAND 327), which gained "in BA-001-11: 244".
- Evidence: my cell dump (179 appended, 31 inserted, 210 intact); `recon-u0.diff`.
- Requirement impact: traceability of the correction; no behavior claim.
- Required action: correct the two statements and the changed-sections list.
- Correction impact: [`source-reconciliation-001.md`](../stages/stage-01/source-reconciliation-001.md) Changed Rows and Retained Work.
- Return stage: 1

<a id="read-carried-open-item-pass-009-f-003"></a>

### Carried Open Item - Pass-009 F-003

- Severity: low (unchanged)
- Comparison check IDs: C-024
- **Status:** open.
  - The script-sinks-09 tool row, the pass-008 lead row of Return Correction Evidence and the BA-001-10 self-check line are unchanged, except that the self-check is now labelled historical.
  - The rule text proposed in the correction record is neither applied nor verified.
  - The owner-accepted residual risk of the carryover record still applies, but the finding is not closed.
- **Required action:** as in [pass 009](stage-02-pass-009.md#read-f-003-the-stated-script-context-counting-rule-does-not-reproduce-103-and-77).

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | `sha256sum` of `packet.json` | pass: `d92c1bbb...0cb3` | access log |
| Pinned hashes | `sha256sum` of the 26 packet pins in the main tree and the candidate checkout | pass (seed by committed bytes; checkout CRLF) | access log |
| Worktree revision and state | `git rev-parse HEAD`, `git status --short` in the three checkouts at start and end | pass: `15cb6b2`, `026fd97`, `9667b69`; empty | access log |
| Source manifest | rehash of the 1117 files against `source-manifest.json` | pass: 1117 match | reviewer scratch |
| Citations (CHK-001) | reviewer `warcite.js`, `citecheck.js` | pass: 499 WAR citations (1 intentionally elided path), 266 SRC and 315 method citations | reviewer scratch |
| Credential scan (CHK-009) | reviewer `credscan.js` and `credclass.js` | pass: 0 values in the change set | Reviewer Self-Check |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <scratch copy of this report>` | see RESULT | reviewer scratch |
| Project audits (`audit:workbook`, `audit:project`, `audit:artifact-links`) | not run: not in the packet's permitted operations | not applicable (PM gate) | packet |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-046 | Author tool-execution facts (exit codes, outputs in the author scratch) are process records outside the permitted evidence. Every legacy fact they support is checked in its own item. | PM packet `S02-P010` boundary | [`packet.json`](evidence/S02-P010/packet.json) |
| E-002 | C-021 | The equality of the 594 classes with the official release WAR is an owner-approved source-intake fact. The release WAR is outside the permitted inputs. No conclusion here depends on it: every relied-on source reading was compared directly with the baseline WAR bytecode. | owner decision `source-intake-fallback-001` ([`source-intake-decision-001.md`](../source-intake-decision-001.md)) | [`war-comparison.json`](../../sources/provenance/war-comparison.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-005 | this report; [`comparison-results.json`](evidence/S02-P010/comparison-results.json) | pending | pending (owner decision; Stage 1 re-entry proposed) | pending (next correction-validation pass) |
| pass-009 F-003 (carried) | C-024 | not resolved by BA-001-11; owner-accepted risk under the carryover | pending | pending |

**Disclosures:**
- One listing of `.migration-tmp/` displayed scratch names of other sessions; I opened none of them.
- The client persisted one of my bounded outputs (a scratch diff excerpt) under the user profile; I did not open it.
- TEMP, TMP and TMPDIR were redirected for only part of the node runs.

These incidents supplied no evidence and changed no reviewed file. The [access log](evidence/S02-P010/access-log.md) records each one with its safeguards, for PM verification under [Operational Incident Assessment](../agent_orchestration.md#operational-incident-assessment).

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:**
  - F-001 fails CHK-007.
  - F-002 fails CHK-012.
  - F-003 fails CHK-003 and CHK-004; this repeats the pass-009 F-002 class, so the check's failure needs analysis.
  - F-004 is a new finding without a CHK.
  - F-005 fails CHK-007.
  - Pass-009 F-003 still fails CHK-007.
  - CHK-001, CHK-002, CHK-009, CHK-011 and the other applicable checks passed where applicable.

The pass is **eligible**, and the result is **`findings`**:
- The complete coverage union is accounted for: 588 = 224 + 364 + 0, with no not-checked item and no blocker.
- 16 checks are mismatches, linked to five new low findings and the carried pass-009 F-003.
- Pass-009 F-001 and F-002 are closed.
- The two not-applicable items are justified (E-001, E-002).
- `clean` is excluded because findings remain open. None of them is a runtime limitation moved to Stage 3; the genuinely runtime-only rows are labelled as such and are not counted as defects.

**Next gate: an owner decision.** The operational mandate delegates neither independent verdicts nor the Stage 2 carryover of new findings.
- **Proposed:** a bounded Stage 1 correction of F-001..F-005 and pass-009 F-003 under the [return and correction protocol](README.md#return-and-correction-protocol), with its PR and CI.
- **Then:** a new Stage 2 correction-validation by another fresh eligible BA, with root 006, previous pass 010, and this pass as coverage base once it is recorded as valid.
- **Alternative:** the owner may decide a carryover of these low findings under the project departure. That decision is the owner's, not PM's under the mandate.

This pass does not close Stage 2 and does not by itself permit Stage 3.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). In correction-validation the checklist and prior notes are read immediately. CHK rows do not bound the coverage.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b` (CHK-001..CHK-012; unchanged PREV..CAND)
- Author self-check record/version: reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention) (BA-001-11); [`source-reconciliation-001.md`](../stages/stage-01/source-reconciliation-001.md#read-error-prevention)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; new SRC and WAR citations | `chk001-ba-001-11.js` over notes, lines and the record | passed: 266 SRC and 315 method citations resolve in source and bytecode; the new WAR line citation matches (C-039) | none |
| CHK-002; the negative claims | negative checks with positive controls | passed: reachability with positive controls (C-040) | none |
| CHK-003; writers of shared registries (refined) | registry writers recorded from the source | failed: the static editor converters are not recorded (C-025, C-031) | F-003 |
| CHK-004; pattern and locale source per variant | "the pattern and locale source of each formatting tag" | failed for the parse side and editor displays (C-025, C-037); passed for the history exception (C-023) | F-003 |
| CHK-005, CHK-006, CHK-008, CHK-010 | inputs unchanged; retained | the rows they concern are rechecked where changed (C-010, C-013); nothing else changed | none |
| CHK-007; figures and counting rules | figures regenerated from the tool outputs | failed: correspondence figures lack a reproducible rule (C-015, C-016); the change description is inaccurate (C-009, C-035); status and outcome counts pass | F-001, F-005 |
| CHK-009; credentials | scanned; hit count in RESULT BA-001-11 | passed: 0 values in the change set (C-041) | none |
| CHK-011; unauthenticated surfaces | "the new facts touch no public page" | passed on substance (C-042). The claim is imprecise: rows 61, 216, 225 and 233 concern unauthenticated endpoints; they are recorded correctly | none |
| CHK-012; request values to sinks | the content-search id match recorded with its missing read check | failed for the note-id substitution (C-011, C-032); other sinks passed (C-043) | F-002 |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 010, correction-validation. The result version is this report and the evidence hashed in RESULT; checklist `8a15e08c...2a90b`.
  - **CHK-001:** every line cited here comes from a per-file numbered read of the extracted WAR or the checkouts, or from a listing cited by symbol.
  - **CHK-007:** each figure here comes from a named script with its rule. The generator reconciles 588 = 224 + 364 + 0.
  - **CHK-009:** the self-scan of this report and the new evidence folder found 0 credential values. The hit count is in RESULT; word collisions were classified with the values masked.
  - **Transport safety:** large outputs went to the scratch. One client spill occurred; I did not open it and disclosed it.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-007, from F-001):** a source-to-binary correspondence claim states its counting rule, keeps its output as retained evidence, and compares method bodies (at least call sequences) in both directions. Name and constant matches alone do not establish identity.
  - **P-2 (new, from F-004):** every status change cites the evidence that is new since the previous status. A change with no new evidence keeps its status or states the rule that permits it.
  - **P-3 (refine CHK-003/CHK-004, from F-003, repeated class):** enumerate static formatter and converter fields (date, number, message) as shared registries. Record the locale that fills each one (JVM default, first request, session) and every display and parse consumer, not only output tags.
  - **P-4 (refine CHK-012, from F-002):** when a request id selects an object, record the object actually loaded, listed or redirected to, including type substitutions.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| not applicable | not applicable | not applicable | not applicable | Stage 2 |

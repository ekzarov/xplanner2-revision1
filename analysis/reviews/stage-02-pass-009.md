# Stage 02 Review - Pass 009

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
> **Result: `findings` - Stage 2 pass 009 (correction validation of BA-001-09 and BA-001-10, with attempt recovery: root pass 006, coverage base pass 007, excluded pass 008)**
>
> **Recovery is established.** The pass-008 breach was confined to that session. I regenerated its only out-of-bounds file inside my scratch, and the bytes match the hash that reviewer recorded. Roots 006 and 007 are unchanged and valid, and the legacy source and scope are identical. Nothing from pass 008 is inherited.
>
> - **Closed:** pass-007 F-001 (Spring prefixes and the Tiles case), F-002 (button script), F-003 (45 public-page keys); the pass-008 leads F-001 (5 Tiles names) and F-002 (public breadcrumb lookup); the findForward part of lead F-003.
> - **New, all low:**
>   - **F-001:** the new shared-cache fact names `PropertyMessageResources` as the message-resource cache, but the application uses its own Spring-backed resources. It also misses two registries that store the request locale (displaytag table properties, the date-format tag).
>   - **F-002:** history dates use a built-in pattern with the first requester's locale, not the bundle formats that rows 69-70 state.
>   - **F-003:** the stated script-context counting rule gives 109/85, not 103/77 (the unfinished part of lead F-003).
>
> 46 new checks: 36 matched, 9 mismatch, 0 not-checked, 1 not-applicable. Coverage: 568 obligations = 68 newly checked + 500 retained + 0 uncovered.
>
> **Stored-value output:** the recorded Q3 and GAP-007 facts suffice for this control's mandatory scope; see [Stored-Value Output Sufficiency](#read-stored-value-output-sufficiency).
>
> **Checklist issues:** F-001 fails the refined CHK-003 (with CHK-012). F-002 fails CHK-004 and the refined CHK-003. F-003 fails the refined CHK-007. The pass-007 CHK-012 and CHK-007/CHK-004 failures and the lead-level CHK-011 failure are closed.
>
> **Disclosure for the owner:** I ran three read-only git commands outside the packet's list, plus a working-tree diff; see [Interaction Log](#read-interaction-log).
>
> **Next:** return to **Stage 1** for F-001..F-003 (bounded correction). This pass does not close Stage 2 and does not permit Stage 3.
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
  - [Attempt Recovery](#read-attempt-recovery)
  - [Open-Item Closure](#read-open-item-closure)
  - [Retained Coverage](#read-retained-coverage)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
  - [Stored-Value Output Sufficiency](#read-stored-value-output-sufficiency)
- [Findings](#read-findings)
  - [F-001 - Shared-cache fact misattributes one writer and omits two request-locale registries](#read-f-001-shared-cache-fact-misattributes-one-writer-and-omits-two-request-locale-registries)
  - [F-002 - History dates do not follow the recorded bundle date formats](#read-f-002-history-dates-do-not-follow-the-recorded-bundle-date-formats)
  - [F-003 - The stated script-context counting rule does not reproduce 103 and 77](#read-f-003-the-stated-script-context-counting-rule-does-not-reproduce-103-and-77)
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

- Date: 2026-09-28
- Stage: 02
- Pass: 009
- Scope: project; the Stage 1 records after BA-001-09 and BA-001-10 ([`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx), 210 rows) against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war); complete change set from the coverage base, open items of the chain, related mechanisms, and the refined CHK-003, CHK-007, CHK-011 and CHK-012 across the governed scope
- Reviewed revision: `026fd972915bb58c449b0c6187620589a70b62d8`
- Base revision: `4c1ada255ef8b662b7d51f45eaaed17b8547e3e6` (coverage base, reviewed by pass 007); root `15cb6b26946f73596177eba8cead333383d9f728` (pass 006); failed attempt `605f94df9a52004945f4ad991d0018c57d1bb49b` (pass 008)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p009`
- Session ID: the client-assigned subagent ID of this session (not exposed inside the session; PM records it), subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P009/independence-record.md`](evidence/S02-P009/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P009`, [`packet.json`](evidence/S02-P009/packet.json) SHA-256 `9ea7818871b18e7d294a1e12e17ca7ba16f3e87cbee34ba5b5ada0c39d0a8979`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: expanded (the complete change set since the coverage base, its dependencies, and the refined checks over the whole governed scope)
- Control mode: correction-validation
- Verification baseline: root pass 006 (`15cb6b2`); coverage base pass 007 (`4c1ada2`; reconnaissance `c672ad6f...43a1`, workbook `2949146c...2305`)
- Expansion trigger: none for a full-blind pass; bounded expansion to the refined CHK-003 registries and CHK-011/CHK-012 surfaces across the governed scope

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

The complete scope here is the regenerated change set COV..CAND, the open items of the chain, the related mechanisms and the coverage union. I am not an author, not a reviewer of passes 001-007 and not the failed pass-008 reviewer. The [independence record](evidence/S02-P009/independence-record.md) and the [access log](evidence/S02-P009/access-log.md) disclose the client-injected launch context, two author tools read to understand counting rules, and a git-command deviation. That deviation is discussed in the [Interaction Log](#read-interaction-log).

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy).
  - Git blobs are identical at ROOT, COV, FAILED and CAND.
  - SHA-256 values: `README.md` `78b1a6b4...5460`, `docker-compose.yml` `e15cd9db...e9ff`, `xplanner-plus.war` `46ff9dc0...4edc`, `demo-seed.sql` committed bytes `41b2f6a3...66e1`.
  - The `demo-seed.sql` working copy reads `2d32f7d5...` only because of CRLF conversion; its LF-normalized hash equals the committed one.
  - The WAR was extracted with Windows `tar.exe` (bsdtar) into reviewer scratch: 964 files, 594 classes.
- **Root:** [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, with:
  - blind checkpoint [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md) `c8d4f780...74d9` and [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json) `8f734d0d...4cbe`;
  - ledger [`comparison-results.json`](evidence/S02-P006/comparison-results.json) `a205b9b5...702c`;
  - the other S02-P006 evidence.
- **Coverage base:** [`stage-02-pass-007.md`](stage-02-pass-007.md) `e2fd2da2...53b`, with its [ledger](evidence/S02-P007/comparison-results.json) `7dda3cf4...2c41`, [coverage record](evidence/S02-P007/coverage-reconciliation.json) `dbbc987c...a2f7d`, [change set](evidence/S02-P007/change-set.json) and the other S02-P007 evidence.
- **Failed attempt (leads only):** [`stage-02-pass-008.md`](stage-02-pass-008.md) `0bfc7d9b...8e3b`, with its [access log](evidence/S02-P008/access-log.md), [independence record](evidence/S02-P008/independence-record.md) and [PM transcription](evidence/S02-P008/pm-report-transcription.json). Its checks, retained table, closure claims and coverage are not used.
- **Intervening records:**
  - [`stage-02-pass-006-dispositions.md`](../stages/stage-01/stage-02-pass-006-dispositions.md) (BA-001-08);
  - [`stage-02-pass-007-dispositions.md`](../stages/stage-01/stage-02-pass-007-dispositions.md) `d6328521...1638` (BA-001-09);
  - [`stage-02-pass-008-dispositions.md`](../stages/stage-01/stage-02-pass-008-dispositions.md) `906d1c0c...8dda5` (BA-001-10);
  - [`starter-sync-2026-09-25-c7d0188.md`](../maintenance/starter-sync-2026-09-25-c7d0188.md) (PR #18) and [`starter-sync-2026-09-28-b3fc045.md`](../maintenance/starter-sync-2026-09-28-b3fc045.md) (PR #23);
  - passes 001-005 and their dispositions.
- **Candidate:** reconnaissance `c6a269ab...584b`; workbook `fafa8fcd...3bf5`; checklist [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c...2a90b`. The main working tree carries the same record bytes. Every packet pin matched (66 hash checks).
- **Status and owner decisions:** [`analysis/migration_status.yaml`](../migration_status.yaml), read only at CAND and in the main working tree. The PM entry pending there holds the owner decision `stage-01-stored-value-output-inventory:xplanner2-revision1`.
- **Instructions:**
  - [Stage 2 Correction Validation](README.md#stage-2-correction-validation) and [Stage 2 Attempt Recovery](README.md#stage-2-attempt-recovery);
  - [Correction-Validation Packets](../agent_orchestration.md#correction-validation-packets) and [Packet Transport Safety](../agent_orchestration.md#packet-transport-safety);
  - [`SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), blob `fe88c4f8ed6385eba5e15dad3781dd2eff791de7`;
  - [`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md) and [`error-prevention.md`](../error-prevention.md).
- **Explicit exclusions:**
  - Author tool-execution facts (E-001). Two author tools were read only to understand counting rules.
  - Earlier reviewer scratch, earlier-migration links (A2), any runtime, the network, git history outside the four pinned revisions, and the user profile.

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Change set, regenerated:** my own `git diff` for COV..FAILED, FAILED..CAND and COV..CAND; classification in [`change-set.json`](evidence/S02-P009/change-set.json).
  - 56 files.
  - Reconnaissance: 23 net hunks (23 in BA-001-09, 19 in BA-001-10).
  - Workbook: dumped cell by cell with exceljs (value, note, fill, font, hyperlink, outline), and its package parts hashed. 7 cells in 6 rows differ; only `xl/sharedStrings.xml` differs, so statuses, styles and outline are unchanged.
- **Source analysis:** a dependency-free class-file reader and disassembler (reviewer scratch) parsed:
  - all 594 application classes;
  - 1399 framework classes from `struts-1.2.9`, `spring-struts`, `spring-webmvc`, `spring-web` and `spring-context` 3.0.5.
- **Other own scripts:**
  - page and tag scans of the 74 JSP and tag files;
  - a `.properties` parser for the 10 bundles (keys only);
  - public-page render-chain enumeration and a script-context counter;
  - an expression counter and a registry scanner;
  - a citation checker and a credential scanner.
  Each negative claim is paired with a positive control.
- **Coverage reconciliation:** a generator maps each of the 550 obligations of the coverage base, and the new obligations, to exactly one new check or one retained prior check ID. It refuses a retained mismatch, a double mapping and any pass-008 evidence.
- **Batches:** one batch, no context reset, no sampling within the declared scope.
- **Worktree state:** all four checkouts had an empty `git status` at start and end. The main tree showed only the PM status edit and this pass's evidence folder, before and after the gates.
- **Credential safety:** values are held in memory only. The self-scan is in the Reviewer Self-Check.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: correction-validation. No blind inventory was created, claimed or recreated. The frozen Phase A of root pass 006 serves as provenance only.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

Not applicable (correction-validation). The pass-006 checkpoint is assessed under [Attempt Recovery](#read-attempt-recovery).

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: correction-validation has no delayed Phase B; prior evidence was permitted at launch.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

- **Root full baseline:** pass 006, [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, with its blind checkpoint and 539-item ledger (Scope and Inputs). It is a historical full-blind pass without mode metadata. Its eligibility was verified here again (C-002).
- **Latest preceding control (chronological):** pass 008, [`stage-02-pass-008.md`](stage-02-pass-008.md), `invalid`. The last valid control, and the coverage base, is pass 007.
- **Intervening records:** BA-001-08, BA-001-09 and BA-001-10 disposition records; PR #18 and PR #23 maintenance records.
- **Source identity:** the legacy blobs are identical at the four revisions (C-004).
- **Baseline and candidate:**
  - reconnaissance `c672ad6f...` (COV), `649870c1...` (FAILED), `c6a269ab...` (CAND);
  - workbook `2949146c...`, `df7437be...`, `fafa8fcd...`.
- **Eligibility decision: eligible with recovery**, as established under [Attempt Recovery](#read-attempt-recovery).
- **Complete change set:**
  - **Reconnaissance** (the hunks with sections are in the change-set file):
    - the reading block (a rolling summary of the latest round);
    - Scope And Provenance;
    - the Source Inventory Spring MVC row;
    - the Runnable Surfaces settings row, the public-page texts bullet and a new lookup bullet;
    - Build, Run, And Test Evidence: 7 rows edited and 6 tool rows added;
    - GAP-007 (insertions only);
    - Q3 facts: the reflected-output and navigation rows changed, and 3 new rows (breadcrumb lookup, caches, stored-value output);
    - Return Correction Evidence: 8 rows added and the paragraph;
    - the Stage 1 Exit Checklist line;
    - Error Prevention: the BA-001-10 notes, and BA-001-09 marked historical.
  - **Workbook:** H8 and H56 (both rounds), F60, H60, H98, H101 (BA-001-09) and H185 (BA-001-10).
  - **Removed text:** only superseded figures (4 Tiles names; 46/30/45 findForward; 41 keys) and the previous rounds' summary bullets. Every removed fact is still present in the body, or labelled historical (C-041).
  - **Other files:**
    - the checklist (CHK-007 and CHK-012 in PR #21; CHK-003, CHK-007 and CHK-011 in PR #24);
    - the two correction records;
    - the PM status ledger;
    - 16 sealed control files added for passes 007 and 008;
    - 33 process files of PR #23 (Starter `b3fc045`: attempt recovery and transport safety). These are process only and impose no obligation on Stage 1 content. The records at FAILED equal the BA-001-10 baseline hashes, so PR #23 did not touch them.
- **Open-finding reconciliation:** see [Open-Item Closure](#read-open-item-closure).
- **Expansion decision: bounded expansion, no full-blind trigger.** The refined CHK-003 was applied to every shared registry of the application and of its bundled frameworks. The refined CHK-011 was applied to every public page and its layout chain, and the refined CHK-012 to every request-derived sink (C-018, C-039, C-040). This found F-001 and F-002 in named claims.

| Required coverage item | Prior report / check IDs | Source and current claim identity | Handling in this pass | New check IDs or retention evidence |
|---|---|---|---|---|
| Recovery, chain, eligibility, source identity | new obligations | ledger, sealed evidence, legacy blobs | rechecked | C-001..C-005 |
| Change-set completeness | pass-007 C-065 | COV..CAND, all files | rechecked | C-006 |
| Pass-007 F-001..F-003, their checks, and the pass-008 leads | pass-007 C-002, C-003, C-007, C-009, C-040, C-042, C-043, C-047, C-048; pass-006 C-478; leads (not coverage) | changed claims; source identical | rechecked | C-007..C-013, C-015, C-020, C-021, C-025 |
| Author checks (h)-(m), the EL assessment and the new Q3 rows | new obligations (and pass-007 C-007, C-009) | correction records and CAND text | rechecked | C-009, C-010, C-012, C-015..C-017, C-020..C-022 |
| Changed reconnaissance sections | pass-007 C-037, C-038, C-045, C-049, C-051..C-055 | hunks in the change-set file | rechecked | C-014, C-024, C-026..C-030 |
| 6 changed rows and their inventory items | pass-007 C-015, C-021, C-036, C-063, C-064; pass-006 C-017, C-039, C-101, C-306 | cells changed | rechecked | C-031..C-036 |
| Related unchanged claims | pass-006 C-102, C-143, C-144, C-197, C-198, C-307, C-506, C-088 | bytes unchanged; mechanism touched | rechecked | C-019, C-037, C-038 |
| Refined checks across the scope; CHK-001/CHK-009; the checklist; correction records; tool facts | pass-007 C-056, C-057, C-059, C-061, C-062; new obligations | whole records | rechecked | C-018, C-023, C-039..C-046 |
| All other obligations of the coverage base (500) | exact pass-006 and pass-007 IDs | byte-identical cells or text outside every hunk; source identical; mechanism unaffected | retained | groups K-ROW, K-REC, K-INV, K-INV-P, K-EARLY, K-EXCL, K-P7 in [`coverage-reconciliation.json`](evidence/S02-P009/coverage-reconciliation.json) |

| Reconciled required coverage items | Newly rechecked items | Valid retained items | Uncovered items |
|---|---|---|---|
| 568 | 68 | 500 | 0 |

The 568 items are the 550 obligations of the coverage base and 18 new obligations:
- The 550 are the 539 pass-006 items and the 11 new obligations of pass 007.
- The 68 newly rechecked items are 50 prior obligations and the 18 new ones.
- Each obligation appears once, with the new check that rechecked it or with one retained exact ID.
- The 46 comparison checks below count only newly executed checks.

<a id="read-attempt-recovery"></a>

### Attempt Recovery

- Recovery session: a81963deb7fe2b1fd
- Recovery coverage base: 7
- Recovery excluded passes: 8
- Recovery basis: verified

PM replaces only the literal session token above with the client-assigned id of this session.

- **Valid coverage base:** pass 007, [`stage-02-pass-007.md`](stage-02-pass-007.md) `e2fd2da2...53b`, `findings`, correction-validation under root 006.
  - Same scope. No unchecked work: 550 = 93 + 457 + 0, 65 checks.
  - Its report hash matches its PM transcription, and its evidence is unchanged since it was added (C-003).
  - The reviewer was a fresh subagent (`a6795def1ddcf5e91`).
  - Its two disclosures do not reduce validity. First, it did not open its client spill files. Second, it read one author output inside the project to identify a page set, not as evidence; the figure concerned was a mismatch and is rechecked here.
- **Preserved evidence:** root pass 006 keeps independence, completeness, provenance and source identity (C-002).
  - It was a fresh subagent (`a700bf31602b78dd0`), not the author (`a5bb18013a4f4d2f8`).
  - Phase A (138 items) was saved at 13:23:33Z, and Phase B was released at 13:25:05Z and opened at 13:25:49Z.
  - The snapshot pins match the PM release. 539 contiguous checks, none not-checked.
  - Its launch exposure was accepted by PM before Phase A. It did not open its one client spill file.
  - The S02-P006 and S02-P007 files were each added once and never modified afterwards (`git diff --name-status` over the chain shows only additions).
- **Whole change set:** COV..CAND, both correction rounds and everything around the failed attempt ([`change-set.json`](evidence/S02-P009/change-set.json)).

| Excluded failed attempt / report / hash | Cause and isolation | Mandatory unchecked, new or failed-attempt-only work | Source-backed observations and independent resolution |
|---|---|---|---|
| Pass 008, [`stage-02-pass-008.md`](stage-02-pass-008.md), `0bfc7d9b6404aad91eab3797b9a641a6dce73bcb6891fd7ebd02a3c2bf4d8e3b`; ledger: invalid, correction-validation, baseline_pass 6, previous_pass 7, same scope | **Cause:** reviewer subagent `a51cdd4e08e3744c6` opened, once, the client-persisted output of its own `git diff -U0 --word-diff=plain` (reconnaissance COV..FAILED) under the user profile.<br>**Isolation:** I reran that command into my scratch. The output is byte-identical to the regeneration hash the failed reviewer recorded (32,261 bytes, `8bc1e01f...4cba9`), so the file held repository content that the mode permits. The attempt wrote only its own evidence folder. Root and base evidence is add-only in git. The owner approved the bounded Stage 1 return on the transition (record: the BA-001-10 disposition record) and adopted Starter `b3fc045`. No user-profile access was needed or sought. | All 27 of its checks and its 556-item coverage are unverified and unused. BA-001-09 was reviewed only by that attempt; it is rechecked in full here, together with BA-001-10 and the related mechanisms (C-006..C-046). | **Lead F-001 (5 Tiles names; ViewObjectAction):** confirmed from bytecode; the record is correct (C-008, C-009).<br>**Lead F-002 (public breadcrumb lookup):** confirmed; the records are correct (C-013, C-015, C-031, C-032, C-036).<br>**Lead F-003:** the findForward part is confirmed and corrected (C-020); the 77-output part is not resolved by the stated rule (F-003).<br>**Its scope question (stored values):** answered in [Stored-Value Output Sufficiency](#read-stored-value-output-sufficiency).<br>**Its sealed `chain_consequence` statement:** superseded by the adopted `b3fc045` rule, as the maintenance record states. |

**Full-blind triggers considered, none present:**
- **Source:** the legacy set is identical.
- **Scope:** the same two records, 210 rows and the same channels.
- **Baseline reliability:** roots 006 and 007 are verified.
- **Systemic or unbounded impact:** the three findings sit in named claims (one Q3 fact, one reading-block line, three rows, one tool row and its two echoes) and in bounded mechanisms (two static registries, one tag).
- **Stored-value output:** recorded as an explicit uninventoried scope under the owner's deferral. No retained or new check depends on it.

<a id="read-open-item-closure"></a>

### Open-Item Closure

| Item (chain) | Author disposition | Independent result in this pass | Status |
|---|---|---|---|
| pass-007 F-001 (low): Spring view-name prefixes | accepted (BA-001-09) | C-007, C-033: bytecode of `UrlBasedViewResolver#createView` and `RedirectView#renderMergedOutputModel`; row 60, Source Inventory and settings rows correct | closed |
| pass-007 F-001: Tiles case of `returnto` | accepted; name set corrected in BA-001-10 | C-008: 5 names; loader chain and start-up order; `Inferred` stated | closed |
| pass-007 F-002 (low): `returnto` in the button script | accepted, extended to row 101 | C-011, C-034, C-035 | closed |
| pass-007 F-003 (low): public-page keys | accepted, extended to 45 | C-012, C-013, C-031, C-032: 45 keys and per-bundle presence reproduced | closed |
| pass-006 F-002 remainder (view names) | via pass-007 F-001 | C-007 | closed |
| pass-008 lead F-001 (not a finding) | confirmed, extended | C-008, C-009 | closed in the records; the related check (k) is incomplete: new F-001 |
| pass-008 lead F-002 | confirmed | C-013, C-015, C-031, C-032, C-036 | closed |
| pass-008 lead F-003 | confirmed for findForward; narrowed for 77 | C-020 (findForward matched), C-021 (rule mismatch) | findForward part closed; the rest open as new F-003 |
| pass-007 CHK-012 failures (F-001, F-002) | rechecked (h), (i) | C-009, C-010, C-040 | closed |
| pass-007 CHK-007/CHK-004 failure (F-003) | rechecked (j) | C-012, C-041 | closed |
| lead-level CHK-003/CHK-012 (F-001), CHK-011/CHK-012 (F-002), CHK-007 (F-003) | checks (k)-(m) | CHK-011: closed (C-016, C-039). CHK-003: new failure (C-017, C-018). CHK-007: still failing for the script-context rule (C-021) | F-001, F-003 |
| passes 001-006: 37 findings, E-items, no B-items | all accepted; none open | Retained (K-EARLY, K-ROW) where rows are unchanged. The rows of pass-001 F-003 (69-71): its resolved part (per-bundle patterns) still holds; the history-date exception is a new defect (F-002) | no earlier item reopened |

<a id="read-retained-coverage"></a>

### Retained Coverage

Every retained item is listed with its exact prior ID and group in [`coverage-reconciliation.json`](evidence/S02-P009/coverage-reconciliation.json). Nothing is retained from pass 008.

| Group | Items | Applicability rationale against the complete change set COV..CAND |
|---|---|---|
| K-ROW | 175 | Pass-006 row checks. The rows are not among the 6 changed rows or the 5 related rows rechecked here, and their cells are byte-identical (sheet XML identical, unchanged shared strings). The source is identical. The 9 `returnto` redirect-note rows state no Tiles count and point to the Q3 fact rechecked in C-008. |
| K-REC | 140 | Pass-006 reconnaissance claim checks. Each line was mapped ROOT to COV to CAND through the hunk headers and is byte-identical at CAND. The 4 section-level items (enforcement sweep, CHK-002 lists, Q4 facts, Parity-Map Boundary) lie in sections without any hunk. |
| K-P7 | 56 | Obligations whose evidence is an exact matched pass-007 check that I retain: C-001, C-004, C-005, C-006, C-008, C-010..C-014, C-016..C-020, C-022..C-035, C-039, C-041, C-044, C-058 and C-060. Their rows and lines are unchanged. None of their inputs is a mechanism changed since COV: Tiles name set, breadcrumb lookup, caches, script-context or key figures, stored-value fact. |
| K-INV | 83 | Pass-006 inventory items. Their mapped rows and sections are unchanged and not rechecked here, and their mechanism is none of the changed ones. |
| K-INV-P | 15 | Inventory items in a section with a hunk: GAP-007, Q3 table, unauthenticated list, Build rows. The sentences they rely on are byte-identical: the GAP-007 hunks are pure insertions, and the Q3 rows they use are not CAND lines 436 or 443-446. |
| K-EARLY | 29 | Earlier-finding resolutions whose rows are unchanged. The row 114 and row 192 mechanisms were re-confirmed in C-010 and C-016. |
| K-EXCL | 2 | Pass-006 E-001 infrastructure items; unchanged. |

<a id="read-comparison-scope"></a>

## Comparison Scope

- **Review mode and exact checked boundary:** expanded correction-validation with attempt recovery. It covers:
  - the complete COV..CAND change set of the two Stage 1 records and their source dependencies;
  - both correction records;
  - the open items of passes 001-008;
  - the author checks (h)-(m) and the EL assessment;
  - the refined CHK-003, CHK-007, CHK-011 and CHK-012 over the governed scope;
  - CHK-001 and CHK-009 over the change set and the whole records.
- **Previous report and pinned baseline:** root [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...`; coverage base [`stage-02-pass-007.md`](stage-02-pass-007.md) `e2fd2da2...`; excluded [`stage-02-pass-008.md`](stage-02-pass-008.md) `0bfc7d9b...`.
- **Changed items and direct dependencies rechecked:** see the correction-validation table. The item list is in [`comparison-results.json`](evidence/S02-P009/comparison-results.json) (`covers_pass006`, `covers_pass007`).
- **Prior results relied on but not rerun:** 500 obligations, retained by exact pass-006 or pass-007 ID ([Retained Coverage](#read-retained-coverage)). They are not counted as newly matched.
- **Expansion triggers examined:** source change, scope change, new channel or subsystem, unreliable root or coverage base, systemic or unbounded impact, and the stored-value output. None requires full-blind control.

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger is [`comparison-results.json`](evidence/S02-P009/comparison-results.json). Every non-matched item is listed individually; matched items are grouped with exhaustive IDs.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001..C-006 / recovery, root, coverage base, source identity, chain authority, change set | recovery conditions of [Attempt Recovery](README.md#stage-2-attempt-recovery) | established (see [Attempt Recovery](#read-attempt-recovery)) | matched | ledger entries; sealed-evidence diffs; regenerated diff hash | none |
| C-007..C-016 / pass-007 F-001..F-003 closures, Q3 navigation and reflected-output facts, checks (h), (i), (j), (l), unauthenticated list, Build rows, breadcrumb lookup | records match the WAR | match (details in the ledger) | matched | bytecode listings; `WAR:WEB-INF/tags/breadcrumb.tag:10,15,18`; `WAR:WEB-INF/jsp/edit/editIterationStatus.jsp:32,70`; own scans | none |
| C-017 / check (k) and the Q3 cache fact (recon 445) | every writer of a shared registry fed by request values, with the correct class | message-resource cache attributed to `PropertyMessageResources`, not on the path; displaytag and FormatDateTag request-locale registries omitted | mismatch | `WAR:WEB-INF/classes/spring-beans.xml:39-48`; `XPlannerActionServlet#initModuleMessageResources`, `#service`; `TableProperties#getInstance` | F-001 |
| C-018 / refined CHK-003 across the scope | every shared registry and its writers recorded where relied on | two request-locale registries unrecorded | mismatch | registry scan of 594 classes | F-001, F-002 |
| C-019 / rows 69, 70, 186 and the history view | every date display follows the recorded rule or states its exception | history dates use FormatDateTag's built-in pattern with the first requester's locale | mismatch | `WAR:WEB-INF/jsp/view/history.jsp:61,106`; `FormatDateTag#doStartTag` | F-002 |
| C-020 / check (m) recount | each figure reproducible from its stated rule | all reproduce except the script-context figures | mismatch | own scripts | F-003 |
| C-021 / script-sinks-09 tool row (recon 305) | 103 contexts, 77 outputs from the stated rule | 109/85 under the rule as written; 103/78 with HTML comments blanked | mismatch | `scriptctx.js` variants; `WAR:WEB-INF/jsp/view/iteration.jsp:39` | F-003 |
| C-022, C-023 / stored-value fact, GAP-007 clause, sufficiency | facts reproduce; no mandatory check depends on unrecorded stored-value behavior | reproduce; sufficient | matched | expression counts; public-chain listing | none |
| C-024 / GAP-007 row | COV text preserved; insertions supported | supported | matched | segment diffs | none |
| C-025 / Q3 facts completeness (refined CHK-012) | every request-derived registry sink recorded | Accept-Language registry sinks missing | mismatch | as C-017 | F-001 |
| C-026 / reading block line 40 | summary matches the records | "three shared framework caches" | mismatch | `legacy_reconnaissance.md:40` | F-001 |
| C-027, C-029 / Scope And Provenance, Exit Checklist | correct | correct | matched | skill blob; workbook | none |
| C-028 / Return Correction Evidence, pass-008 F-003 lead row | truthful disposition | claims the 77 "reproduce under the now stated rule" | mismatch | `legacy_reconnaissance.md:568-577` | F-003 |
| C-030 / Error Prevention BA-001-10 self-check | claims supported | "every BA-001-09 figure was recounted with its rule" is unsupported for the script-context figure | mismatch | `legacy_reconnaissance.md:603-610` | F-003 |
| C-031..C-038 / rows 8, 56, 60, 98, 101, 185, 12-13; Tiles row | cells supported | supported | matched | cell segments; bundle presence | none |
| C-039..C-045 / refined CHK-011, CHK-012, CHK-007; CHK-001; CHK-009; checklist refinements; correction-record consistency | as stated in the ledger | pass | matched | own scans | none |
| C-046 / author tool-execution facts in the new tool rows | not a legacy claim | out of permitted evidence | not-applicable | packet boundary | E-001 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 46 | 36 | 9 | 0 | 1 |

Findings: 3 (F-001, F-002, F-003, all low). Blockers: 0. Justified exclusions: 1 (E-001). These counts cover only the newly executed checks. The 500 retained obligations are reported separately in the reconciliation (568 = 68 + 500 + 0).

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Actual corrections and independent closure (BA-001-09, BA-001-10):**

| Correction | Independent source check | Verdict |
|---|---|---|
| Row 60 and the Spring MVC and settings statements: `redirect:` / `forward:` | `UrlBasedViewResolver#createView` tests both prefixes before prefix and suffix are applied; `CommonObjectHandler#list` and `#edit` return the path value; `/setting/*` goes to the Spring servlet and `WebSecurityFilter` | closed |
| Q3 navigation fact: 5 Tiles names, loaders, start-up order, `ViewObjectAction` | `TilesConfigurer#afterPropertiesSet` → `TilesUtilImpl#makeDefinitionsFactoryAccessible` (unconditional context attribute). `TilesPlugin#initTilesUtil` installs `TilesUtilStrutsImpl` (Spring left the "already set" flag false). `#initDefinitionsFactory` finds the factory ("No new creation"). `TilesRequestProcessor#initDefinitionsMapping` reads the same attribute; the processor is created on the first request. 14 methods read `returnto` and redirect: the 13 listed plus `CloseIterationAction` | closed |
| Rows 98, 101 and the Q3 reflected-output fact | `editIterationStatus.jsp:32,70`; `struts-config.xml:119-120,245,251` | closed |
| 45 public-page keys, scope and per-bundle notes (rows 8, 56) | 39 static + `login.title` + 2 scriptlet + 2 footer + `navigation.top`; 4 signed-in-only; 1 in a comment; 10 failed-login keys; every per-bundle statement reproduced with a properties parser | closed |
| Breadcrumb lookup on the public pages (rows 8, 56, 185; unauthenticated list; GAP-007; Q3) | `NavigationBarTag#doEndTag` → `#setObject(int)` → `IdSearchHelper#search`, which has no permission call; the root-context bean (`spring-dao.xml:61`); `OpenSessionInViewFilter` on `/*` including ERROR dispatch; raw names in `Link`, printed with unescaped EL | closed |
| findForward figure | 44 calls in 31 methods, 43 constant; 11 + 20 forward constructors classified | closed |
| Shared-cache fact (check (k)) | wrong message-resource writer; two request-locale registries missing | F-001 |
| Script-context counting rule (check (m)) | the stated rule does not reproduce 103/77 | F-003 |

Return stage for all findings: **1** (map defects).

<a id="read-stored-value-output-sufficiency"></a>

### Stored-Value Output Sufficiency

**Answer: yes. The recorded Q3 stored-value fact and GAP-007 clause suffice for the mandatory scope of this control.** The owner's deferral does not reduce that scope. Four points support the answer.

1. **The facts are true (C-022).** Each fact reproduces:
   - the Servlet 2.4 descriptor, with EL not ignored;
   - 790 `<%= %>` expressions;
   - 65 of 74 files;
   - 85 `bean:write` tags, none with `filter="false"`;
   - template-text EL: 113 by my parser against the stated estimate of 114, which is within its stated nature;
   - the verified breadcrumb instance;
   - the JavaScript escaping in `notes.jsp:58`.
   The fact states that the records do not inventory stored-value output.
2. **No mandatory check depends on it (C-023).** No record claims that stored values are escaped. The escaping statements concern request values and the HTML-encoded error-page listing. No retained or new check relies on stored-value escaping.
3. **The public surface is complete (CHK-011, C-023, C-039).** I listed every expression output of the 5 public pages and their layout chain. The only database-stored values printed without sign-in are the breadcrumb names, which are recorded. The rest are bundle and configuration values, request data recorded in rows 55-56, or header values shown only to a signed-in user.
4. **The remaining unknown is explicit.** The stored-value output of signed-in pages stays an explicit, uninventoried Q3 and GAP-007 scope. It is not counted as matched coverage. This pass creates no obligation beyond it.

For Stage 3/9, the owner decision keeps one obligation open: classify the roughly 900 expressions by source (stored, request, constant, id) and by escaping. The gap is the stored-value output of signed-in pages. The required check is a per-expression classification with positive controls. It is not part of this control.

<a id="read-findings"></a>

## Findings

<a id="read-f-001-shared-cache-fact-misattributes-one-writer-and-omits-two-request-locale-registries"></a>

### F-001 - Shared-cache fact misattributes one writer and omits two request-locale registries

- Severity: low
- Comparison check IDs: C-017, C-018, C-025, C-026
- **Checklist link:** CHK-003 (refined by BA-001-10: every writer of a shared registry, with start-up order) and CHK-012 (request-derived values traced to every sink), in [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks)
- **Checklist discrepancy:**
  - The BA-001-10 check (k) claims to cover every registry that a request value feeds, and finds 3 caches.
  - One cited writer is not on the call path. Two further registries that store a request-derived locale are missing.
  - This is a failed result of the refined CHK-003, which calls for confirming that each writer is on the call path.
- **Required recheck:** CHK-003 and CHK-012. List every shared registry, static or context-scoped, that stores a value derived from a request or a header, together with its actual writer class. Include the application's own copies of framework code. Expected: each registry is recorded with its key, its growth and its reach.
- Expected and source:
  - **Message resources:** the application does not use `PropertyMessageResources` for its texts.
    - `XPlannerActionServlet#initModuleMessageResources` does not call the parent method, and `#service` installs the Spring bean `strutsMessageSource` (`WAR:WEB-INF/classes/spring-beans.xml:46-48`, class `XPlannerMessageResources`).
    - That bean delegates to `ReloadableResourceBundleMessageSource` (`spring-beans.xml:39-45`).
    - No struts-config declares `message-resources`. The only `PropertyMessageResources` is the framework-internal bundle of `ActionServlet#initInternal`, read with the default locale.
    - The actual per-locale writers are `MessageResources#getMessage(Locale, String, Object[])` (the `formats` map, keyed by locale and key, inherited by `XPlannerMessageResources`) and `ReloadableResourceBundleMessageSource#getMergedProperties` and `#calculateAllFilenames` (`cachedMergedProperties`, `cachedFilenames`; `cacheMillis` defaults to -1). Growth per distinct session locale therefore still holds (`Inferred`); only the cited mechanism is wrong.
  - **displaytag:** `org.displaytag.properties.TableProperties#getInstance` (application-bundled copy) keeps one `TableProperties` per resolved locale in the static `prototypes` map.
    - The default resolver (`TableProperties$1#resolveLocale`) returns `request.getLocale()`, the `Accept-Language` locale; `locale.resolver` is unset (`WAR:WEB-INF/classes/org/displaytag/properties/TableTag.properties:28-29`).
    - Entries are never evicted. The cache is written on the 10 `dt:table` uses in 8 signed-in view pages.
  - **Date formats:** `FormatDateTag#doStartTag` writes a `SimpleDateFormat` built with `request.getLocale()` into the static `dateFormatters` map; see F-002 for the page effect.
  - **Spring view cache:** the key is the view name plus the request locale (`AbstractCachingViewResolver#getCacheKey`), not the view name alone.
- Observed difference:
  - The Q3 cache fact (recon 445) cites `PropertyMessageResources#getMessage` and `#loadLocale` and lists 3 caches.
  - The reading block (line 40), the navsites-10 tool row ("3 caches") and check (k) repeat the count.
  - Q3 does not record the displaytag or FormatDateTag registries.
- Evidence: the class listings named above (reviewer disassembler); the registry scan of 594 classes; the descriptor lines above.
- Requirement impact: Q3 facts (Principle XI, unbounded memory growth keyed by client input); Stage 3 memory and locale checks.
- Required action:
  - Correct the message-resource writer and its evidence in the Q3 cache fact.
  - Add the displaytag `prototypes` registry (and the FormatDateTag registry) with key, growth and reach (`Inferred`).
  - State the Spring view-cache key.
  - Correct the cache count in the reading block and the tool row.
  - Add both to the Stage 3 checks.
- Correction impact:
  - Same mechanism: every static or context registry keyed or filled by a request or header value.
  - The registry scan found no further one: `UseBeansTag.queryTranslations` holds configuration, `GenericWikiAdapter.existingTopics` holds stored wiki topics and is already recorded as a render side effect, and the context attributes are set at start-up.
- Return stage: 1

<a id="read-f-002-history-dates-do-not-follow-the-recorded-bundle-date-formats"></a>

### F-002 - History dates do not follow the recorded bundle date formats

- Severity: low
- Comparison check IDs: C-018, C-019
- **Checklist link:** CHK-004 (locale-dependent behavior per variant) and CHK-003 (writers of shared registries)
- **Checklist discrepancy:**
  - Rows 69-70 generalize the bundle patterns to all date display.
  - The per-variant comparison of pass-001 F-003 covered the `format.date` and `format.datetime` consumers only. It missed the tag default, and the shared formatter cache that fixes its locale.
  - This is a failed result of CHK-004 for one page and of the refined CHK-003.
- **Required recheck:** CHK-004 and CHK-003. For every date and number output tag, find the pattern source (attribute, bundle key or built-in default) and the source of the locale, including any shared formatter cache. Expected: each display is recorded per variant, or its exception is recorded.
- Expected and source:
  - `WAR:WEB-INF/jsp/view/history.jsp:61,106` use `xplanner:formatDate` (`WAR:WEB-INF/xplanner.tld:622-624`, `com.technoetic.xplanner.tags.FormatDateTag`) with neither `format` nor `formatKey`.
  - `FormatDateTag#doStartTag` then uses its built-in pattern `EEE MMM dd k:mm:ss z` in every bundle.
  - It caches one `SimpleDateFormat` per pattern in the static, unsynchronized `dateFormatters` map. The formatter is created with `request.getLocale()` of the first request that renders the pattern: the `Accept-Language` locale, not the session locale.
  - Consequences: the history "when" column shows textual day and month names in the locale of the first requester after start-up, for all later users, whatever their bundle. A formatter shared across concurrent requests can produce corrupted text (`Inferred`; runtime unverified).
  - The other 16 `formatDate` uses name a bundle key, whose patterns are numeric in all 10 bundles, so the cached locale does not change their text.
- Observed difference: row 69 D states that dates "are displayed and entered as `yyyy-MM-dd`", and row 70 D gives `dd-MM-yyyy` for the other bundles. Row 186 (history view) states no date format.
- Evidence: the `FormatDateTag#doStartTag` listing; the JSP and TLD lines above; the `format.date` and `format.datetime` values of all 10 bundles.
- Requirement impact: locale parity of the history view (rows 69, 70, 186); Stage 3 locale check of the history page.
- Required action:
  - Record the history-date exception (built-in pattern, first-request locale, shared formatter) in rows 69-70 or 186, with evidence.
  - Add the registry to the Q3 or GAP facts as observed behavior (Q3 deferred).
- Correction impact: rows 69, 70 and 186. The resolved part of pass-001 F-003 (per-bundle patterns) stays valid.
- Return stage: 1

<a id="read-f-003-the-stated-script-context-counting-rule-does-not-reproduce-103-and-77"></a>

### F-003 - The stated script-context counting rule does not reproduce 103 and 77

- Severity: low
- Comparison check IDs: C-020, C-021, C-028, C-030
- **Checklist link:** CHK-007 (refined by BA-001-10: state the counting rule so that each count is reproducible)
- **Checklist discrepancy:**
  - BA-001-10 narrowed the pass-008 lead: the 77 "reproduce under the now stated rule".
  - The self-check says every BA-001-09 figure was recounted with its rule. The stated rule does not produce the figure.
  - This is a failed result of the refined CHK-007 and the unresolved part of lead F-003.
- **Required recheck:** CHK-007. Regenerate the script-context and output figures from the WAR under the rule exactly as written, or correct the written rule to the one the tool applies. Include a positive control for an output that starts inside a `javascript:` URL.
- Expected and source: the script-sinks-09 tool row (recon 305) gives the rule. HTML comments are not blanked, and an output counts when it starts inside a `<script>` element, an `on*` value or a `javascript:` URL. The row states 103 contexts and 77 outputs (32 opening tags, 27 handlers, 18 bodies).
- Observed difference:
  - My implementation of the rule as written finds 109 contexts and 85 outputs: 34 in opening tags, 27 in handlers, 23 in bodies, and 1 in a `javascript:` URL.
  - With HTML comments blanked it finds 103 contexts and 78 outputs: 32/27/18 plus `WAR:WEB-INF/jsp/view/iteration.jsp:39`, an `html:rewrite` inside a `javascript:` URL.
  - The stated 103 and 77 need two unstated rules: blanking HTML comments (the author tool does this at `script-sinks-10.js:14`, read only to understand the rule) and ending a `javascript:` URL at its first quote.
  - The substantive result is unaffected: 2 request values in script contexts under either reading.
- Evidence: reviewer `scriptctx.js`, with and without HTML-comment blanking; the JSP line above.
- Requirement impact: figure reproducibility (CHK-007) only.
- Required action:
  - Correct the rule text, or regenerate the figure under the stated rule (78 with comments blanked).
  - Correct the Return Correction Evidence row for the lead and the BA-001-10 CHK-007 self-check line.
- Correction impact: the script-sinks-09 tool row, one Return Correction Evidence row and one self-check line. All other BA-001-09 figures reproduce (C-020).
- Return stage: 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | `sha256sum` of `packet.json` | pass: `9ea78188...a8979` | access log |
| Pinned hashes | reviewer `verify-packet.js` over every packet pin in the main tree and the four checkouts | pass: all pins match (demo-seed.sql by committed bytes; working copy CRLF) | access log |
| Worktree revision and state | `git rev-parse HEAD`, `git status` in the four checkouts at start and end | pass: `15cb6b2`, `4c1ada2`, `605f94d`, `026fd97`; empty | access log |
| Workbook audit | `npm --prefix analysis/tools run audit:workbook` (main tree, records equal CAND; temp and cache redirected) | pass (exit 0): `WORKBOOK AUDIT OK`, 210 scenarios, 18 epics | reviewer scratch |
| Project audit | `npm --prefix analysis/tools run audit:project` | pass (exit 0) | reviewer scratch |
| Link audit | `npm --prefix analysis/tools run audit:artifact-links` | pass (exit 0): 231 documents | reviewer scratch |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <scratch copy of this report>` | see RESULT | reviewer scratch |
| Citations (CHK-001) | reviewer `citecheck.js` | pass: 67/67 change set; 506/507 whole (1 historical note) | reviewer scratch |
| Credential scan (CHK-009) | reviewer `credscan.js` | pass: 0 credential values in the change set, the correction records and this pass's evidence | Reviewer Self-Check |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-046 | Author tool-execution facts (exit codes, outputs under the author scratch) are process records. The packet forbids the author scratch as evidence. Every legacy fact they support is checked in its own item (C-014, C-020, C-021). | PM packet `S02-P009` boundary | [`packet.json`](evidence/S02-P009/packet.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-003 | this report; [`comparison-results.json`](evidence/S02-P009/comparison-results.json) | pending | pending (Stage 1 re-entry) | pending (next correction-validation pass) |
| pass-008 lead F-003 (77 outputs) | C-021 | narrowed by BA-001-10 | incomplete | carried as F-003 |

**Git-command deviation, disclosed for the owner.** The packet's git bullet lists rev-parse, status, diff and show between the pinned revisions. Early in the pass I also ran, once each and read-only:
- `git ls-tree -r` at the candidate revision, on the legacy folder;
- `git config --get core.autocrlf`;
- `git check-attr -a` on the seed file;
- `git diff` of the main-tree status file against the candidate.

These commands read no revision outside the four pinned ones, change no state and cross no folder boundary. Each fact they gave is also established by permitted means: `git rev-parse <rev>:<path>`, the LF-normalized hash, the `.gitattributes` file and a direct read of the status file. I therefore do not treat them as an access-boundary breach, and I have not self-invalidated. If the owner reads the git list as exhaustive under the invalidation clause, PM must record this attempt as `invalid` instead of using this result. No other boundary deviation occurred. One masking error printed the public factory default login pair of [`legacy/README.md`](../../legacy/README.md) into my own tool output; it was written to no file. That pair is covered by owner decision `legacy-default-credential-classification`.

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:**
  - F-001 fails the refined CHK-003 (with CHK-012).
  - F-002 fails CHK-004 and the refined CHK-003.
  - F-003 fails the refined CHK-007; it is the unresolved part of the lead-level CHK-007 failure.
  - Closed: the pass-007 CHK-012 and CHK-007/CHK-004 failures, and the lead-level CHK-011 failure.
  - CHK-001, CHK-002, CHK-005, CHK-006 and CHK-008..CHK-012 passed where applicable.

**Recovery is established** from coverage base 7, with pass 8 excluded. The result is **`findings`**:
- The complete coverage union is accounted for: 568 = 68 + 500 + 0, with no not-checked item and no blocker.
- 9 checks are mismatches, linked to three new low findings.
- All prior findings (passes 001-007) and the pass-008 leads are resolved, except the part of lead F-003 carried as F-003.
- The one not-applicable item is justified (E-001).
- `clean` is excluded because new findings exist. None of them is a runtime limitation moved to Stage 3.

The process returns to **Stage 1** for F-001..F-003 under the [return and correction protocol](README.md#return-and-correction-protocol), as a bounded correction. Unresolved blocked scope is zero.

The next gate is the owner-approved Stage 1 correction and its PR, CI and owner merge. Then comes a new Stage 2 `correction-validation` by another fresh eligible BA:
- root: pass 006;
- coverage base: this pass, if its result is recorded as valid;
- the retained coverage of this pass remains available if its inputs stay unaffected.

This pass cannot close Stage 2 and does not permit Stage 3. Per the owner instruction of 2026-09-28, PM publishes these records and stops.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). In correction-validation the checklist and prior notes are read immediately. CHK rows do not bound the coverage.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b` (CHK-001..CHK-012; CHK-007 and CHK-012 refined after pass 007; CHK-003, CHK-007 and CHK-011 refined after pass 008)
- Author self-check record/version: reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention) (BA-001-10, checklist `599fbd66...` at the time); [`stage-02-pass-008-dispositions.md`](../stages/stage-01/stage-02-pass-008-dispositions.md#read-error-prevention); [`stage-02-pass-007-dispositions.md`](../stages/stage-01/stage-02-pass-007-dispositions.md#read-error-prevention)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; new and changed citations | `chk001-ba-001-09.js`, `chk001-ba-001-10.js` | passed: 67/67 change set, 506/507 whole (C-042) | none |
| CHK-002; the new "no permission check" statements | negative check on `IdSearchHelper` | passed: no permission or security call in `IdSearchHelper#search` (C-015) | none |
| CHK-003; loaders and writers of shared registries (refined) | Tiles loaders and consumers traced (k) | Tiles: passed (C-008). Registries: failed (message-resource writer off the path; displaytag and FormatDateTag registries missing) (C-017, C-018) | F-001, F-002 |
| CHK-004; per-variant text and formats | 45 keys and 10 failed-login keys compared | keys passed (C-012, C-037); date display failed for the history view (C-019) | F-002 |
| CHK-005, CHK-006, CHK-008, CHK-010 | inputs unchanged; retained | not applicable to the change set; retained evidence (K groups) | none |
| CHK-007; figures and counting rules (refined) | every BA-001-09 figure recounted with its rule (m) | passed for every figure except the script-context rule (C-020, C-021, C-041) | F-003 |
| CHK-009; credentials | scan result in RESULT BA-001-10 | passed: 0 values in the change set and correction records (C-043) | none |
| CHK-011; public surfaces, tag handlers (refined) | tag handlers of the 5 public pages traced (l) | passed: 8 tag classes; public-chain outputs enumerated (C-016, C-039) | none |
| CHK-012; request values to sinks | caches keyed by request values (k) | page output and navigation passed (C-040); header-derived locale registry sinks missing (C-025) | F-001 |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 009, correction-validation with attempt recovery. The result version is this report and the evidence hashed in RESULT; checklist `8a15e08c...2a90b`.
  - **CHK-001:** every line cited here comes from a per-file numbered read of the extracted WAR or the checkouts, or from a disassembler listing cited by symbol.
  - **CHK-009:** passed, 0 credential values in this report and the new evidence. The scan searched source-derived values (README default-login tokens, compose environment values, seed password literals, WAR password/secret assignments, login help text) and the login-pair form, with positive controls on the source files. Word-collision hits were classified with the values masked. My one masking error in tool output is disclosed in the Interaction Log.
  - **CHK-003, CHK-007, CHK-011 and CHK-012:** applied to my own claims. Each figure here comes from a named reviewer script with its rule. Each registry claim cites its writer method.
  - **Transport safety:** large outputs went to the reviewer scratch; no client spill file was created or opened. The git-command deviation is disclosed.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-003, from F-001 and F-002):** when enumerating shared registries, include static collection fields of application classes and of framework copies bundled in `WEB-INF/classes`. Also include registries whose value, not only whose key, embeds a request-derived value (a locale or formatter). Confirm the actual writer class by following the bean or servlet override, not the framework default. Expected: each registry is recorded with key, value source, growth and reach.
  - **P-2 (refine CHK-004, from F-002):** for locale-dependent formats, list every formatting tag or call with its pattern source (attribute, bundle key, built-in default) and its locale source (session, request header, cached first request). Do not generalize from the bundle-keyed uses alone.
  - **P-3 (refine CHK-007, from F-003):** a stated counting rule is verified only when an independent implementation of the rule as written reproduces the figure, including the comment-handling choice and a positive control for each counted context type.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| not applicable | not applicable | not applicable | not applicable | Stage 2 |

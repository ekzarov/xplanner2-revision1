# Stage 02 Review - Pass 007

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
> **Result: `findings` - Stage 2 pass 007 (correction validation of BA-001-08 against the pass-006 baseline)**
>
> Pass 006 is eligible as the root baseline. The change set 15cb6b2..4c1ada2 was regenerated independently: 22 reconnaissance hunks, 29 workbook cells in 26 rows, no status or row-count change, legacy source identical.
>
> - **Closed:** pass-006 F-001 (request binding), F-003 (export people content), F-004 (configuration-key figures); the returnto part of F-002.
> - **Still open:** the view-name part of pass-006 F-002, carried as new F-001.
> - **New, all low:**
>   - **F-001:** the bundled view resolvers turn a request-chosen view name into a redirect or forward (`redirect:`/`forward:` on the Spring MVC handlers; Tiles definition names for `returnto`). The records say only "no existing page".
>   - **F-002:** row 98 omits the `returnto` value that the iteration status page writes into its Cancel-button script (`editIterationStatus.jsp:70`).
>   - **F-003:** the public-page key figure (41) omits the login page title and the layout footer keys. The regenerated figure is 44. Rows 8 and 56 miss the per-bundle presence of the title keys.
>
> 65 new checks: 48 matched, 16 mismatch, 0 not-checked, 1 not-applicable. Coverage reconciliation: 550 obligations = 93 newly checked + 457 retained + 0 uncovered.
>
> **Checklist issues:** F-001 and F-002 fail the refined CHK-012 (navigation and output sinks). F-003 fails the refined CHK-007, with CHK-004. The pass-006 CHK-012 failure is closed for binding and redirects only; the pass-006 CHK-007 failure is closed.
>
> **Next:** return to **Stage 1** for F-001..F-003 (impact-scoped correction). Then a new Stage 2 `correction-validation` by another fresh BA, with pass 006 as root and this pass as the latest preceding control. This pass does not close Stage 2.
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
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
  - [Open-Item Closure](#read-open-item-closure)
  - [Retained Coverage](#read-retained-coverage)
- [Findings](#read-findings)
  - [F-001 - View resolution turns request-chosen names into redirects and forwards](#read-f-001-view-resolution-turns-request-chosen-names-into-redirects-and-forwards)
  - [F-002 - Row 98 omits the returnto script sink of the iteration status page](#read-f-002-row-98-omits-the-returnto-script-sink-of-the-iteration-status-page)
  - [F-003 - Public-page key figure omits title and layout footer keys](#read-f-003-public-page-key-figure-omits-title-and-layout-footer-keys)
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

- Date: 2026-09-27
- Stage: 02
- Pass: 007
- Scope: project; the Stage 1 records after BA-001-08 ([`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx), 210 rows) against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war); complete change set from the pass-006 baseline plus related mechanisms
- Reviewed revision: `4c1ada255ef8b662b7d51f45eaaed17b8547e3e6`
- Base revision: `15cb6b26946f73596177eba8cead333383d9f728` (the revision pass 006 reviewed)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p007`
- Session ID: the client-assigned subagent ID of this session (not exposed inside the session; PM records it), subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P007/independence-record.md`](evidence/S02-P007/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P007`, [`packet.json`](evidence/S02-P007/packet.json) SHA-256 `0e70fd7ef2c4050bd2c60cf0c2a53bba5c703a50b9c8644809a8c108e5eb403a`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: expanded (the complete change set, its dependencies and the refined checks over the whole governed scope)
- Control mode: correction-validation
- Verification baseline: pass 006, revision `15cb6b2`; reconnaissance `0536f243...d332`; workbook `a87c8383...6f99`
- Expansion trigger: none for a full-blind pass; bounded expansion to the refined CHK-012 and CHK-007 sinks and figures across the governed scope

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

The complete scope here is the independently regenerated change set BASE..CAND, the open items of the chain, the related mechanisms and the coverage union. Client-injected launch context and one read of an author scratch output are disclosed in the [independence record](evidence/S02-P007/independence-record.md) and the [access log](evidence/S02-P007/access-log.md). Neither affects eligibility in this non-blind mode.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy). Git blobs are identical at BASE and CAND (`git ls-tree`). SHA-256 values: `README.md` `78b1a6b4...5460`, `docker-compose.yml` `e15cd9db...e9ff`, `xplanner-plus.war` `46ff9dc0...4edc`, `demo-seed.sql` committed bytes `41b2f6a3...66e1`. The working copy of `demo-seed.sql` reads `2d32f7d5...387e` because of CRLF conversion (`core.autocrlf`); pass 006 recorded the working-copy value. The WAR was extracted into reviewer scratch with Windows `tar.exe` (964 files, 1090 entries).
- **Root baseline (proposed and accepted):** [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, blind checkpoint [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md) `c8d4f780...74d9` and [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json) `8f734d0d...4cbe`, ledger [`comparison-results.json`](evidence/S02-P006/comparison-results.json) `a205b9b5...702c`, and the other S02-P006 evidence. All hashes match the packet.
- **Intervening records:** [`stage-02-pass-006-dispositions.md`](../stages/stage-01/stage-02-pass-006-dispositions.md) `5f11d1f6...504e` (BA-001-08); [`starter-sync-2026-09-25-c7d0188.md`](../maintenance/starter-sync-2026-09-25-c7d0188.md) `3e125dc7...f83d` (PR #18); passes 001-005 and their dispositions, for open-item reconciliation.
- **Candidate:** [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) `c672ad6f...43a1`; [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) `2949146c...2305`; checklist [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `6e01c409...ff32`. The main working tree carries the same record bytes.
- **Instructions:** [Stage 2 Correction Validation](README.md#stage-2-correction-validation) and the Stage 2, Comparison Record Contract, Results and Independence sections of [`README.md`](README.md); [Correction-Validation Packets](../agent_orchestration.md#correction-validation-packets); [`SKILL.md`](../../.agents/skills/migration-ba/SKILL.md) blob `d09ba8ced6616dc34fb30a9f2ecde6ab9c3a5398`; [`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md); [`error-prevention.md`](../error-prevention.md).
- **Explicit exclusions:**
  - Author tool-execution facts (E-001). The one author output read is disclosed.
  - Earlier reviewer scratch, earlier-migration links (A2), any runtime, network and git history outside BASE..CAND.

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Change set, regenerated:** `git diff` BASE..CAND lists 78 files, 6 commits and the classification in [`change-set.json`](evidence/S02-P007/change-set.json).
  - The reconnaissance diff has 22 hunks.
  - The workbook was dumped cell by cell with exceljs (value, note, fill, font, hyperlink, outline) and its package parts were hashed. Only `xl/sharedStrings.xml` differs, so styles, outline and the status column are unchanged. 29 cells in 26 rows differ (columns H, F60, D124, F124).
- **Source analysis:** a dependency-free class-file reader and disassembler parsed all 594 classes, plus the `struts-1.2.9` and `spring-webmvc-3.0.5` JARs where framework behavior matters.
  - Sink call sites were enumerated across all classes: binding, navigation, forward names and response writers.
  - Descriptors and JSPs were read at the cited ranges or in full.
  - `.properties` files were counted with a `java.util.Properties`-compatible parser. XML figures were counted after stripping comments, each with a positive control.
- **Line citations (CHK-001):** every `file:line` citation was resolved mechanically: 15 of 15 in the change set, 436 of 436 in the whole records.
- **Batches:** one batch, no context reset, no sampling within the declared scope.
- **Worktree state:** WT-B and WT-C had an empty `git status --short` at start and end. The main tree showed only the PM status edit and this pass's evidence folder.
- **Credential safety:** values are held in memory only. The self-scan is in the Reviewer Self-Check.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: control mode correction-validation. No blind inventory was created, claimed or recreated. The root baseline's frozen Phase A (pass 006) is used as provenance only.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

Not applicable (correction-validation). The eligibility of the pass-006 checkpoint is assessed in the correction-validation section below.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: control mode correction-validation has no delayed Phase B. Prior evidence was permitted at launch.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

- **Root full baseline:** pass 006, [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, with the pinned blind checkpoint and ledger listed in Scope and Inputs.
  - It is a historical full-blind pass without control-mode metadata. This pass verified its eligibility and records it here.
- **Latest preceding control:** pass 006 (same). The intervening records are the BA-001-08 correction record and the PR #18 process-maintenance record.
- **Chain:** the review ledger in [`migration_status.yaml`](../migration_status.yaml) holds Stage 2 passes 1-6, all `findings`, each followed by a Stage 1 return.
  - There is no skipped, invalid or superseded attempt.
  - The last Stage 2 entry was recorded at 2026-09-27T19:28:09Z, before this pass started (19:31Z).
- **Source identity:** the legacy blobs are identical at BASE and CAND, and the WAR SHA-256 is unchanged. The governed scope is the same: the two Stage 1 records against [`legacy/`](../../legacy), 210 rows, the same channels.
- **Baseline and candidate:** reconnaissance `0536f243...` to `c672ad6f...`; workbook `a87c8383...` to `2949146c...`.
- **Eligibility decision: eligible.**
  - *Independence:* the pass-006 reviewer was a fresh subagent `a700bf31602b78dd0`, not the author (`a5bb18013a4f4d2f8`). Its launch exposure (commit subjects, a generic README note) was disclosed and accepted by PM before Phase A. I agree it is non-substantive.
  - *Blind checkpoint:* the inventory (138 items, A-001..A-138) and the snapshot pin match the hashes in [`pm-phase-b-release.json`](evidence/S02-P006/pm-phase-b-release.json). Phase B access followed the release, per the access log.
  - *Completeness:* the ledger has 539 contiguous items: 519 matched, 17 mismatch, 3 not-applicable, 0 not-checked. The exclusions are justified (E-001 infrastructure; E-002 author tool records by packet authority). No blocker exists.
  - *Evidence:* all files are retrievable at CAND.
  - *No full-blind trigger:* no source or scope change and no new channel or subsystem. The new defects below lie on channels that pass 006 inventoried (A-110 Spring MVC, A-127 returnto, A-126 unescaped output, A-135 public surfaces) and are bounded.
- **Complete change set:**
  - *Reconnaissance, 22 hunks:* reading block; Scope And Provenance (date, analyst, skill blob); Source Inventory Configuration and Spring MVC rows; Runnable Surfaces settings row and public-page bullet; Data And Integrations export row; Build, Run, And Test Evidence (legacy-hash, unauth-06, config-consumers-06, build-workbook and audit rows, 3 new tool rows); GAP-007; 2 new Q3 fact rows; Return Correction Evidence (5 rows and the paragraph); Stage 1 Exit Checklist; Error Prevention.
  - *Workbook:* rows 35, 43, 46, 58, 59, 60, 62, 78, 81, 88, 90, 101, 121, 124, 125, 129, 134, 137, 139, 140, 141, 149, 169, 173, 209 and 210. Column H in every row; F60 and D/F124 also changed.
  - *Removed text:* only row 60 F/H (the "views not determinable" phrases), D124 (rephrased) and the figure or view-name fragments listed in [`change-set.json`](evidence/S02-P007/change-set.json).
  - *No other governed file changed:* in the Stage 1 folder only the new disposition record appears.
  - *PR #18 (Starter `c7d0188`):* 62 process files and the maintenance record. Classification: process only. It introduces the mode this pass uses and imposes no new obligation on the Stage 1 record content.
  - *PR #19 checklist refinements (CHK-007, CHK-012):* newly applicable checks, applied below over the whole scope.
- **Open-finding reconciliation:** see [Open-Item Closure](#read-open-item-closure).
- **Expansion decision:** bounded expansion within the governed scope; no full-blind trigger.
  - The refined CHK-012 (binding and navigation) and CHK-007 (format-aware counts) were applied to every sink and figure of the records, not only to changed rows.
  - That expansion found F-002 in unchanged row 98 and the CHK-004 gaps of unchanged rows 8 and 56 (F-003).

| Required coverage item | Prior report / check IDs | Source and current claim identity | Handling in this pass | New check IDs or retention evidence |
|---|---|---|---|---|
| Pass-006 findings F-001..F-004 and their checks | pass-006 C-034, C-059, C-110, C-127, C-129, C-134 and the mismatched row and section items | claims changed by BA-001-08; source identical | rechecked | C-001..C-005 |
| Author related-occurrence checks (d)-(g) | new obligations | disposition record inventories | rechecked independently in the source | C-006..C-009 |
| 26 changed workbook rows and related inventory items | pass-006 C-165..C-328 (26 row items), C-036, C-053, C-056, C-061, C-063, C-070, C-071, C-073, C-077, C-078, C-081, C-091, C-093, C-096, C-120, C-124, C-131, C-136, C-524 | cells changed | rechecked | C-010..C-035 |
| Changed reconnaissance claims | pass-006 C-375, C-378, C-381, C-390, C-421, C-429, C-492..C-494, C-496, C-500..C-503 and related C-010, C-011, C-013, C-015, C-084, C-097, C-126, C-135, C-526, C-530, C-534, C-538 | hunks in change-set.json | rechecked | C-037..C-055 |
| Unchanged rows touched by the refined checks | pass-006 C-139 (row 8), C-184 (row 56), C-224 and C-062 (row 98) | bytes unchanged; new check applicable | rechecked | C-036, C-063, C-064 |
| Refined checks across the governed scope; CHK-001/CHK-009 over the change set; change-set completeness | new obligations; pass-006 C-521 | whole records | rechecked | C-056..C-062, C-065 |
| All other pass-006 items (457) | pass-006 IDs listed in the reconciliation file | byte-identical cells or text outside every hunk; source identical; mechanism unaffected | retained | groups R-INV, R-INV-P, R-ROW, R-REC, R-EARLY, R-EARLY-P, R-EXCL in [`coverage-reconciliation.json`](evidence/S02-P007/coverage-reconciliation.json) |

| Reconciled required coverage items | Newly rechecked items | Valid retained items | Uncovered items |
|---|---|---|---|
| 550 | 93 | 457 | 0 |

The 550 items are the 539 pass-006 items plus 11 new obligations. The 93 newly rechecked items are 82 pass-006 items plus the 11 new obligations. Each pass-006 item appears exactly once, either with the new check that rechecked it or with its retention group; the generator refuses double mappings, a retained mismatch or a retained changed row. The 65 comparison checks below count only newly executed checks.

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `expanded correction-validation`, covering:
  - the complete BASE..CAND change set of the two Stage 1 records and their source dependencies;
  - the open items of passes 001-006;
  - checks (d)-(g);
  - the refined CHK-012 and CHK-007 over the whole governed scope;
  - CHK-001 and CHK-009 over the change set.
- Previous report and pinned baseline: [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...`, ledger `a205b9b5...`.
- Changed items and direct dependencies rechecked: see the correction-validation table; the item-by-item list is in [`comparison-results.json`](evidence/S02-P007/comparison-results.json) (`covers_pass006`).
- Prior results relied on but not rerun: 457 pass-006 items, grouped with their rationale in [`coverage-reconciliation.json`](evidence/S02-P007/coverage-reconciliation.json). They are not counted as newly matched.
- Expansion triggers examined, none present:
  - source change (legacy blobs identical);
  - scope change (same records and channels);
  - new channel or subsystem (none);
  - unreliable baseline (eligible);
  - systemic or unbounded impact (the three findings are local).

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger is [`comparison-results.json`](evidence/S02-P007/comparison-results.json). Every non-matched item is listed individually; matched items are listed by exhaustive ID range.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001, C-002, C-004, C-005 / pass-006 F-001, F-002 returnto part, F-003, F-004 | corrections present and correct in the source | binding: one `RequestUtils.populate` site, 10 entry points; returnto: 13 methods in 12 classes; exports: every person; key figures 114/106/42 | matched | bytecode listings; own parser | none |
| C-003 / Spring MVC view-name part of pass-006 F-002 | every navigation effect of the `{objectType}` view name recorded | the bundled `UrlBasedViewResolver#createView` maps `redirect:` and `forward:` prefixes to a redirect or a forward; the records say "no existing page" | mismatch | `spring-web.xml:26-30`; `spring-webmvc-3.0.5` listing | F-001 |
| C-006, C-008 / checks (d), (f) | complete inventories | complete (form-nested getters reach only transient or null objects) | matched | sink scan | none |
| C-007 / check (e) | every request-derived navigation classified | Spring prefixes, Tiles-definition `returnto` values and the `editIterationStatus.jsp:70` script navigation missed | mismatch | sink scan; `tiles-definitions.xml` | F-001, F-002 |
| C-009 / check (g) | properties-derived figures regenerated with a parser and a positive control | public-page keys 41 not reproducible; regenerated 44 | mismatch | `public-keys.js` | F-003 |
| C-010..C-035 except C-015 / 25 changed rows | changed cells supported, status unchanged | supported | matched | row notes in the ledger | none |
| C-015 / row 60 | view-name behavior complete | prefixes omitted | mismatch | as C-003 | F-001 |
| C-036 / row 98 | every output and navigation sink of the page recorded | `returnto` at `editIterationStatus.jsp:70` missing | mismatch | `reflect-scan.json` | F-002 |
| C-037 / reading block | summary matches the records | repeats the incomplete view-name claim | mismatch | reconnaissance lines 37-47 | F-001 |
| C-038, C-039, C-041, C-044..C-046, C-049, C-052..C-054 / changed claims | claims supported | supported | matched | ledger | none |
| C-040, C-042, C-047 / Spring MVC row, settings row, Q3 navigation fact | view-name outcome complete | prefixes and Tiles case omitted | mismatch | as C-003 | F-001 |
| C-043, C-051 / public-page bullet; unauth-06 and props-parse-08 rows | figure reproducible | 41 (39 + 2) stated; 44 regenerated | mismatch | as C-009 | F-003 |
| C-048 / Q3 facts completeness | every sink kind listed | Spring view-name redirect and the line-70 script sink missing | mismatch | as C-003, C-036 | F-001, F-002 |
| C-050 / author tool-execution facts | not a legacy claim | out of permitted evidence | not-applicable | packet boundary | E-001 |
| C-055 / Error Prevention section | self-check claims supported | 41 keys and complete view-name tracing claimed | mismatch | as C-003, C-009 | F-001, F-003 |
| C-056, C-058..C-062, C-065 / figures, citations, credentials, change-set completeness | reproducible and clean | reproducible; 0 credential values | matched | `figures.json`, `cite-check.json` | none |
| C-057 / page-output and navigation regression over 74 JSP/tag files | every raw request value in output recorded or justified | one line uncited (`editIterationStatus.jsp:70`) | mismatch | `reflect-scan.json` | F-002 |
| C-063, C-064 / rows 8 and 56 per-bundle notes | every text key of the public page compared in all 10 bundles | title keys and layout footer keys not stated | mismatch | `public-keys.json` | F-003 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 65 | 48 | 16 | 0 | 1 |

Findings: 3 (F-001, F-002, F-003, all low). Blockers: 0. Justified exclusions: 1 (E-001). These counts cover only the newly executed checks. Retained pass-006 evidence (457 items) is reported separately in the reconciliation.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Actual corrections and independent closure (BA-001-08):**

| Correction | Independent source check | Verdict |
|---|---|---|
| Binding notes in 19 rows, GAP-007 and a Q3 fact (F-001) | `EditObjectAction#populateObject` compares `merge` with `"true"`, calls `RequestUtils.populate` and skips `#copyProperties` and `#populateManyToOneRelationships`. Callers: `#updateObject`, `#createObject`, `EditProjectAction#saveForm`, `MoveContinueStoryAction#saveForm`, and parent calls from `EditTaskAction` and `EditNoteAction`. `EditRoleAction` inherits the path. Four JSPs post `merge`; only `task.jsp` and `moveContinueStory.jsp` reach the binding. | closed |
| Redirect notes in 11 rows, GAP-007 and a Q3 fact (F-002, returnto) | 13 methods read `returnto` and build `new ActionForward(value, true)`. No validation exists; a null or empty value selects a mapping forward, except in `UpdateTimeAction`, which has no fallback. The bundled `RequestProcessor#processForwardConfig` adds the context path only to values that start with `/`. | closed |
| Row 60 and the Spring MVC and settings statements (F-002, view names) | The handler behavior is verified, but the prefix behavior of the resolver is omitted. | open, new F-001 |
| Export content, rows 209-210 and the export row (F-003) | Verified in `XmlExporter`, `MpxExporter` and `MspdiExporter`; `PdfExporter` writes names only; no `.jrxml` template ships. | closed |
| Configuration-key figures (F-004) | 114/106 with bracketed and continuation controls; 42 without a consumer after the key-building prefix consumers. | closed |
| Public-page key derivation (check (g)) | Not reproducible (44). | new F-003 |

**Retained check applicability** and **reconciled whole-scope coverage:** see [Retained Coverage](#read-retained-coverage) and the tables above. For all findings the return stage is **1** (map defects).

<a id="read-open-item-closure"></a>

### Open-Item Closure

| Item (chain) | Author disposition | Independent result in this pass | Status |
|---|---|---|---|
| pass-006 F-001 (medium), request binding | accepted, extended | C-001, C-006, rows C-010..C-035: source and records agree; the extensions (row 141, `/do/edit/roles`) are correct | closed |
| pass-006 F-002 (low), redirects and view names | accepted, extended | returnto part closed (C-002). View-name part incomplete (C-003); the Tiles-definition nuance was also missing from the pass-006 analysis | partially closed; the rest is F-001 of this pass |
| pass-006 F-003 (low), export people | accepted | C-004, C-008, C-034, C-035 | closed |
| pass-006 F-004 (low), key figures | accepted | C-005, C-039 | closed |
| pass-006 CHK-012 failure (F-001, F-002) | rechecked by the author ((d), (e)) | binding closed. Navigation still fails for view names (F-001), and the refined check finds one script sink (F-002) | open, as F-001 and F-002 |
| pass-006 CHK-007 failure (F-004) | rechecked ((g)) | configuration figures closed; a new CHK-007 failure on the public-page figure (F-003) | closed; new F-003 |
| passes 001-005: 33 findings, E-items, no B-items | all accepted; none rejected or blocked | Pass 006 re-verified all 33 in the source (C-504..C-539). The corrections touch pass-003 F-003 (row 124, C-023: validator branches re-read), pass-004 F-001 and F-005 (GAP-007 text byte-identical, C-045), pass-005 F-003 and mechanism (b) (C-048, C-057) and pass-002 F-010 (C-056). The rest is retained | no open item found |

<a id="read-retained-coverage"></a>

### Retained Coverage

Every retained pass-006 item appears in [`coverage-reconciliation.json`](evidence/S02-P007/coverage-reconciliation.json) with one group:

| Group | Items | Applicability rationale against the complete change set |
|---|---|---|
| R-ROW | 181 | Workbook rows outside the 26 changed rows and rows 8, 56 and 98. Their cells are byte-identical (the sheet XML is identical, and only the shared strings of the changed rows differ) and the source is identical. The unchanged rows in the Q3 redirect list keep their effect statements; the navigation fact is checked in C-047/C-048. |
| R-REC | 141 | Reconnaissance claim rows at base lines outside every hunk, so the text is byte-identical. None is a source dependency of the corrected mechanisms. |
| R-INV | 87 | Inventory items that map to unchanged rows and sections and to mechanisms other than binding, `returnto` navigation, view names, export content and properties figures. |
| R-INV-P | 16 | Inventory items in sections with a hunk: Configuration row, GAP-007, Q3 table, Build rows, Data And Integrations, unauthenticated list. The sentences they rely on are byte-identical, as verified by the prefix and suffix comparison of the changed lines. |
| R-EARLY / R-EARLY-P | 29 / 1 | Earlier-finding resolutions whose rows are unchanged. GAP-007 was only appended to, and the Q3 rows were only inserted. |
| R-EXCL | 2 | Pass-006 E-001 infrastructure items; unchanged. |

<a id="read-findings"></a>

## Findings

<a id="read-f-001-view-resolution-turns-request-chosen-names-into-redirects-and-forwards"></a>

### F-001 - View resolution turns request-chosen names into redirects and forwards

- Severity: low
- Comparison check IDs: C-003, C-007, C-015, C-037, C-040, C-042, C-047, C-048, C-055
- **Checklist link:** CHK-012 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), refined row: navigation such as redirect targets and view names)
- **Checklist discrepancy:**
  - The BA-001-08 self-check claims that request values were traced into view names (check (e)).
  - The check (e) inventory reports "Spring RedirectView or redirect: view names: 0". That count covers only constants in code, not request-derived view names that the bundled resolver interprets.
  - This is a failed result of the refined check. Pass-006 F-002 did not name the prefix behavior either.
- **Required recheck:** CHK-012, for every view name or forward path chosen by a request value. Resolve how the bundled framework handles it: view-resolver prefixes, Tiles definition lookup. Expected: each outcome is recorded with its reach.
- Expected and source:
  - `CommonObjectHandler#list` and `#edit` return the `{objectType}` path value as the view name (bytecode listing).
  - `InternalResourceViewResolver` (`WAR:WEB-INF/classes/spring-web.xml:26-30`) extends `UrlBasedViewResolver`. Its `#createView` in `WAR:WEB-INF/lib/spring-webmvc-3.0.5.RELEASE.jar` makes:
    - a `RedirectView` from a value that starts with `redirect:` (the context path is added only to targets that start with `/`, then `sendRedirect`);
    - an `InternalResourceView` forward from a value that starts with `forward:`.
  - So a signed-in user who follows `/setting/redirect:<target>/list` is redirected to `<target>`. `/setting/*` is behind `WebSecurityFilter`, and after login the saved URL returns the user to it.
  - One path segment cannot carry `/`. A scheme-qualified value whose scheme differs from the page's scheme is still resolved by browsers as another host. Both points are `Inferred`: the container's encoded-slash handling and the browser behavior are unverified at runtime.
  - Struts side: `DelegatingTilesRequestProcessor` extends `TilesRequestProcessor`, whose `#processForwardConfig` first calls `#processTilesDefinition`. A `returnto` value that equals one of the 4 definition names in `WAR:WEB-INF/tiles-definitions.xml` is therefore rendered as that layout, not redirected (restricted set).
- Observed difference:
  - Row 60 (F, H), the Source Inventory Spring MVC row, the Runnable Surfaces settings row, the reading block and the Q3 navigation fact state only `/WEB-INF/jsp/<value>.jsp`, "no existing page".
  - The 13-method `returnto` fact says "redirect ... unchanged" without the Tiles exception.
- Evidence: the class symbols above; `WAR:WEB-INF/web.xml` servlet and filter mappings for `/setting/*`.
- Requirement impact: Q3 security facts (Principle XI, open redirect via the Spring MVC channel); Stage 3 reachability checks; UF-004 settings scenario.
- Required action: correct row 60, the three reconnaissance statements, the reading block and the Q3 navigation fact to state the `redirect:`/`forward:` outcomes and their reach (`Inferred`). Add the Tiles-definition case to the `returnto` fact. Add both to the Stage 3 checks.
- Correction impact:
  - The same mechanism covers every framework view or forward resolution fed by a request value: Spring `{objectType}`, Struts `returnto` via Tiles.
  - The checks found no other request-selected view name: 43 of 44 `findForward` names are constants, and the one exception comes from the mapping parameter.
  - GAP-007 may name the Spring redirect beside the `returnto` redirects.
- Return stage: 1

<a id="read-f-002-row-98-omits-the-returnto-script-sink-of-the-iteration-status-page"></a>

### F-002 - Row 98 omits the returnto script sink of the iteration status page

- Severity: low
- Comparison check IDs: C-007, C-036, C-048, C-057
- **Checklist link:** CHK-012 (refined row: HTML or script output and navigation)
- **Checklist discrepancy:** the BA-001-07 reflected-value inventory, retained by BA-001-08 and matched by pass 006, lists `fkey` (34) and `returnto` (35) for this page. It does not list the second write of `returnto` into the Cancel-button script. The refined CHK-012 also covers this client-side navigation.
- **Required recheck:** CHK-012 over script contexts: event handlers, `document.location` and inline scripts that embed request values, on every page. Expected: every unescaped script write is listed with its line. My own scan of all 74 JSP and tag files finds no other uncited line.
- Expected and source: `WAR:WEB-INF/jsp/edit/editIterationStatus.jsp:32` binds `returnto` from the request (`bean:parameter`). Line 70 writes it unescaped into a JavaScript string of the Cancel button's `onclick` handler, after the context path. A crafted value can break out of the string and inject script, and it chooses where the Cancel button goes (on the same host, since the context path comes first). The page is the input and forward of `/do/start/iteration` and `/do/close/iteration` (`WAR:WEB-INF/struts-config.xml:119-120,245,251`).
- Observed difference: row 98 H cites lines 34 and 35 only ("mostly as hidden input values").
- Evidence: the ledger entry C-057 in [`comparison-results.json`](evidence/S02-P007/comparison-results.json) (reviewer script `reflect-scan.js`); the JSP lines above.
- Requirement impact: Q3 reflected-output fact; Stage 3 check of the start and close confirmation page.
- Required action: add line 70 (script context, client navigation) to row 98's reflected-value note, and let the Q3 reflected-output fact cover script contexts (`Inferred`).
- Correction impact: row 98, and the Q3 fact whose row list already includes 98. No other page is affected (C-057).
- Return stage: 1

<a id="read-f-003-public-page-key-figure-omits-title-and-layout-footer-keys"></a>

### F-003 - Public-page key figure omits title and layout footer keys

- Severity: low
- Comparison check IDs: C-009, C-043, C-051, C-055, C-063, C-064
- **Checklist link:** CHK-007 (refined row: format-aware counts with a positive control), with CHK-004 (per-variant comparison)
- **Checklist discrepancy:**
  - Check (g) re-derived the public-page figure as 41: 39 static keys plus 2 scriptlet keys. The per-bundle presence was confirmed only for the 39 static keys.
  - The static extraction misses keys given in the `titleKey` attribute, which is the same attribute that selects the 2 scriptlet keys.
  - It also misses the layout that `xplanner:content` inserts (`ContentTag` uses `tiles:default`, whose footer is `footer.jsp`).
- **Required recheck:** CHK-007 and CHK-004. Count the texts of a page over every attribute form that takes a key and over its layout and include chain, with a positive control for an attribute-form key. Compare each key in all 10 bundles.
- Expected and source:
  - `login.title` (`WAR:WEB-INF/jsp/security/login.jsp:14`).
  - `app.label.version` and `footer.message` (`WAR:WEB-INF/jsp/common/footer.jsp:25,38`), rendered on the login page and on the error page (`WAR:WEB-INF/jsp/layout/defaultLayout.jsp:47`).
  - Result: 42 static keys plus the 2 scriptlet keys, 44 in total (own script, positive control `login.instructions` found).
  - Per bundle: `login.title` is absent in fr; `app.label.version` is present in all 10; `footer.message` only in default, "--" and de; `error.title` is absent in de and es; `system.info.title` only in default and "--". None of them carries a credential (contextual scan).
- Observed difference:
  - The Runnable Surfaces public-page bullet, the unauth-06 and props-parse-08 rows and the BA-001-08 self-check state 41 (39 + 2).
  - The row 8 and row 56 per-bundle notes do not state the title and footer keys.
- Evidence: `public-keys.js` and `public-keys.json` (reviewer scratch; hashes in the access log).
- Requirement impact: figure accuracy (CHK-007); locale-variant completeness of the public pages (CHK-004, rows 8 and 56). No credential text is added.
- Required action: correct the figure to 44 (42 + 2) with its derivation, and add the title and footer keys to the per-bundle notes of rows 8 and 56.
- Correction impact: the three reconnaissance statements and rows 8 and 56. The other properties-derived figures were regenerated and match (C-005, C-060).
- Return stage: 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | `sha256sum` of `packet.json` | pass: `0e70fd7e...403a` | access log |
| Pinned hashes | `sha256sum` of baseline report, S02-P006 evidence, records, checklist, dispositions, maintenance record; `git ls-tree` of [`legacy/`](../../legacy) at BASE and CAND | pass: all packet pins match; legacy blobs identical (`demo-seed.sql` working copy CRLF, committed bytes match) | access log |
| Worktree revision and state | `git rev-parse HEAD`, `git status --short` in WT-B and WT-C at start and end | pass: `15cb6b2...`, `4c1ada2...`; empty | access log |
| Workbook audit | `npm --prefix analysis/tools run audit:workbook` (main tree, workbook equals CAND; temp redirected) | pass (exit 0): `WORKBOOK AUDIT OK`, 210 scenarios, 18 epics | access log |
| Link audit | `npm --prefix analysis/tools run audit:artifact-links` before Markdown evidence was added | pass (exit 0): 222 documents | access log |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <scratch copy of this report>` | see RESULT | scratch output |
| Citations (CHK-001) | reviewer `cite-check.js` | pass: 15/15 change set, 436/436 whole scope | `cite-check.json` |
| Credential scan (CHK-009) | reviewer `cred-pair.js` and `cred-mask.js` | pass: 0 credential values in records, evidence and this report | Reviewer Self-Check |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-050 | Author tool-execution facts (exit codes, outputs under the author scratch) are process records. The packet forbids using the author scratch as evidence. Every legacy fact they support is checked in its own item (C-049, C-052). | PM packet `S02-P007` boundary | [`packet.json`](evidence/S02-P007/packet.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-003 | this report; [`comparison-results.json`](evidence/S02-P007/comparison-results.json) | pending | pending (Stage 1 re-entry) | pending (next correction-validation pass) |
| pass-006 F-002 (view-name part) | C-003 | accepted by BA-001-08 | incomplete | carried as F-001 |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:**
  - F-001 and F-002 fail the refined CHK-012 (navigation, and script output). F-003 fails the refined CHK-007, with CHK-004.
  - The pass-006 CHK-012 failure is closed for binding and `returnto` redirects and open for view names. The pass-006 CHK-007 failure is closed.
  - CHK-001, CHK-002, CHK-003, CHK-005, CHK-006 and CHK-008..CHK-011 passed where applicable.

The result is **`findings`**:
- The complete coverage union was accounted for: 550 = 93 + 457 + 0, with no not-checked item and no blocker.
- 16 checks are mismatches, linked to three new low findings. The view-name part of pass-006 F-002 is not closed.
- The one not-applicable item is justified (E-001).
- A `clean` result is excluded because a prior finding is only partly closed and new findings exist. None of them is a runtime limitation moved to Stage 3.

The process returns to **Stage 1** for F-001..F-003, with the residual pass-006 F-002 view-name part inside F-001, under the return and correction protocol. Unresolved blocked scope is zero.

The next gate is an impact-scoped Stage 1 correction, then a new Stage 2 `correction-validation` by another fresh eligible BA:
- root baseline: pass 006;
- latest preceding control: this pass;
- pass 007's retained coverage remains available if its inputs stay unaffected.

This pass cannot close Stage 2 and does not permit Stage 3.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). In correction-validation the checklist and prior notes are read immediately. CHK rows do not bound the coverage.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `6e01c409fc6b6a595f1ff618a7a0e474dcde9b084e368171f1e37489fe74ff32` (CHK-001..CHK-012; CHK-007 and CHK-012 refined in PR #19)
- Author self-check record/version: reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention) (BA-001-08, checklist `0115d8ca...` at the time) and [`stage-02-pass-006-dispositions.md`](../stages/stage-01/stage-02-pass-006-dispositions.md#read-error-prevention)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; new and changed citations | `chk001-ba-001-08.js` | passed: 15/15 change set, 436/436 whole scope (C-061) | none |
| CHK-002; permission statements in new notes | notes cite rows 29-30 | passed: the SOAP operations call `hasPermission`; the web editors have no server-side check (C-006) | none |
| CHK-003; effects, hooks and consumers | consumer rerun; sinks inventoried | passed: the `beforeObjectCommit` hooks are reached through `AbstractAction`, and the prefix consumers exist (C-005) | none |
| CHK-004; per-variant text | per-bundle presence re-derived (39 keys) | failed for the title and footer keys (rows 8, 56) | F-003 |
| CHK-005; validation keys | retained | passed for the changed rows 124 and 137 (validator bytecode, C-023, C-027) | none |
| CHK-006; deletes | not changed | not applicable to the change set; retained | none |
| CHK-007; figures, format-aware | regenerated with the parser | passed: configuration, XML, workbook and locale figures (C-005, C-058..C-060). Failed: public-page figure (C-009) | F-003 |
| CHK-008; query paths | retained | not applicable to the change set (no new query claim) | none |
| CHK-009; credentials | scan in RESULT BA-001-08 | passed: 0 values in the changed and full records (C-062) | none |
| CHK-010; link parameters | not changed | passed for the new link statements (`html:link page` prefixes the context path) | none |
| CHK-011; unauthenticated surfaces | not changed | passed for the entry points; the public-page text figure fails under CHK-007 | F-003 |
| CHK-012; request values to sinks (binding, navigation) | checks (d), (e) | binding passed (C-006). Navigation failed: Spring view-name prefixes, the Tiles case (C-003, C-007), and the script sink at `editIterationStatus.jsp:70` (C-057) | F-001, F-002 |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 007, correction-validation; the result version is this report and the evidence hashed in RESULT; checklist `6e01c409...ff32`.
  - **CHK-001:** every line cited in this report comes from a per-file numbered read of the extracted WAR or the worktrees.
  - **CHK-009:** passed, 0 credential values in the new evidence and this report. The scan checks the distinctive values, the configured-value assignment form and the factory login pair form, with positive controls on the source files (21 distinctive, 2 pair and 40 assignment hits). Contextual matches in the records were reviewed with the values masked; they are role names.
  - **CHK-007 and CHK-012:** applied to my own figures and sink claims through the positive controls named in the ledger.
  - **CHK-002..CHK-006, CHK-008, CHK-010, CHK-011:** applied as listed in the Checklist Review.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-012, from F-001 and F-002):** for navigation sinks, resolve how the bundled framework interprets a request-derived view name or forward path: view-resolver prefixes such as `redirect:` and `forward:`, and definition-name lookups (for example Tiles). Also include script-context navigation such as `location` assignments and event handlers. Expected: each outcome is recorded with its reach. This refines CHK-012; it is not a new ID.
  - **P-2 (refine CHK-007, with CHK-004, from F-003):** when counting page texts or keys, include every attribute form that takes a key (for example `key`, `titleKey`) and the page's layout and include chain. Pair the count with a positive control for an attribute-form key and a layout-inserted key, and compare the result in every bundle variant.
  - Not proposed: no separate check for F-002 beyond P-1, because the omission is the script-context case of the existing CHK-012 output sink.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| not applicable | not applicable | not applicable | not applicable | Stage 2 |

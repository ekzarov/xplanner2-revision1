# Stage 02 Review - Pass 002

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

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!CAUTION]
> **Result `findings`: 10 findings return the Stage 1 records to Stage 1**
>
> `findings` means this pass recorded actionable discrepancies that need Stage 1 dispositions; it is not an approval. All 488 checks ran: 447 matched, 28 mismatch, 13 not-applicable and 0 not-checked, so no scope is blocked. Two findings are medium: F-001 (time-entry and iteration validation rules missing) and F-007 (the system-administrator grant/revoke rule and three rows still imply server-side refusal). Eight are low (F-002..F-006, F-008..F-010). Pass 001 findings: F-002..F-008 are resolved; F-001 is partially resolved (residual defect carried as F-007). The Stage 1 sweep defects AF-01 and AF-02 are confirmed.
>
> **Checklist issues:** CHK-002 failed for rows 24, 31, 34 and 88 (F-007). CHK-003 failed for rows 73 and 113 and the GAP-003 impact statement (F-006, F-008). CHK-004 failed for row 128 (F-009). CHK-001 passed on independent recheck.
>
> **Next:** The Stage 1 author checks F-001..F-010 against the legacy source, corrects the records and records a disposition for each finding. Then a new eligible fresh Stage 2 session runs a new full blind pass.
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
  - [F-001 - Time-entry and iteration validation rules are missing](#read-f-001-time-entry-and-iteration-validation-rules-are-missing)
  - [F-002 - Delete cascades are not recorded](#read-f-002-delete-cascades-are-not-recorded)
  - [F-003 - The Facebook like widget is commented out](#read-f-003-the-facebook-like-widget-is-commented-out)
  - [F-004 - The note attachment count is not a download counter](#read-f-004-the-note-attachment-count-is-not-a-download-counter)
  - [F-005 - Login and start-iteration branches are misattributed](#read-f-005-login-and-start-iteration-branches-are-misattributed)
  - [F-006 - Hidden-project styling rests on an unused decorator](#read-f-006-hidden-project-styling-rests-on-an-unused-decorator)
  - [F-007 - System-administrator grant rule and residual refusal claims](#read-f-007-system-administrator-grant-rule-and-residual-refusal-claims)
  - [F-008 - Story import error handling and remembered settings](#read-f-008-story-import-error-handling-and-remembered-settings)
  - [F-009 - Task type labels are generalized from two bundles](#read-f-009-task-type-labels-are-generalized-from-two-bundles)
  - [F-010 - Reconnaissance keeps superseded figures](#read-f-010-reconnaissance-keeps-superseded-figures)
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

- Date: 2026-09-24
- Stage: 02
- Pass: 002
- Scope: project `xplanner2-revision1`. The full Stage 1 records are [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (18 epics, 193 scenario rows), plus the correction record [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](../stages/stage-01/stage-02-pass-001-dispositions.md), reviewed against the immutable [`legacy/`](../../legacy) package.
- Reviewed revision: `ab29a84819f2c7f0753f006a168cfff96d36b7d5`
- Base revision: not applicable (full pass; the Stage 2 entry of 2026-09-24T09:21:53Z)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p002`
- Session ID: `aed5642d8baeb3e36` (subagent of session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P002/independence-record.md`](evidence/S02-P002/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P002`
  - [`packet.json`](evidence/S02-P002/packet.json): `99cc0826de2d598d188d8a9b1dfd5fd90919ed67d4c303f2ddf54ef622cdeb45`
  - [`routing-extract.json`](evidence/S02-P002/routing-extract.json): `fe70c4f3cf99eb9629581ba7c25a76e9e3d0f7c2b9d00b4cc22f24bdc775f3d5`
- Result: findings
- Artifact set version / manifest SHA-256: not applicable (Stage 2)
- Verification mode: full
- Verification baseline: revision above, with the Phase B inputs pinned below
- Expansion trigger: none

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] For Stage 2, I inventoried source behavior before reading prior conclusions, the filled parity map or reconnaissance, and saved Phase A before first Phase B access.

Disclosed exposure, accepted by PM as non-substantive (PM ANSWER BA-002-02: "not requested; no finding content; PM accepted"): at launch the client injected a gitStatus snapshot of the main tree whose commit subjects named "F-001..F-008 from Stage 2 pass 001", and later the neutral `CLAUDE.md` bridge. No record content was exposed. Disclosed protocol deviation in Phase B: I ran `git status --short` once in the main tree instead of only the worktree (output identical to the injected snapshot; no history read). The access sequence is in [`analysis/reviews/evidence/S02-P002/access-log.md`](evidence/S02-P002/access-log.md).

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

| Input | Phase | SHA-256 | Use |
|---|---|---|---|
| [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war) | A, B | `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc` | authoritative source, extracted read-only to reviewer scratch |
| [`legacy/README.md`](../../legacy/README.md), [`legacy/docker-compose.yml`](../../legacy/docker-compose.yml) | A, B | `78b1a6b4…5460`, `e15cd9db…69e9ff` | packaging and run context only |
| [`legacy/demo-seed.sql`](../../legacy/demo-seed.sql) | A | `2d32f7d5…387e` | excluded fixture; read only to classify it |
| [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) | B | `faecd7ab62fd99f458e89a110dd2f8b485d1a9cfb47323ae0f8cc0269a68fbff` | reviewed record |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | B | `1d8863d09cc928ba3fa9007402615a017aea265b56c52ee72386add4cacccf17` | reviewed record (193 rows) |
| [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](../stages/stage-01/stage-02-pass-001-dispositions.md) | B | `5d823882f173f61e58747e17666f4c6d63a07bd1376628f545b82a782b4fb29a` | reviewed correction record |
| [`analysis/reviews/stage-02-pass-001.md`](stage-02-pass-001.md) and [`evidence/S02-P001/`](evidence/S02-P001/comparison-results.json) | B | `73e8fb00…ad85`; ledger `4e7e2b6e…e1e1`; Phase A `ee62d7fb…f7ac` | prior findings to verify |
| [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) | B | `c4d1f2a73e246393546cbdf02c05ec9f9fe4ae045e97b31923a1ebaff9f6ed11` | Checklist Review (CHK-001..CHK-004) |
| [`analysis/migration_status.yaml`](../migration_status.yaml) | B | `e641a84ff6be01e7ef1fc7b5fea618d4d805388cb024272c72fd7bfce3e1d022` (working tree) | owner decisions and transitions, read only |
| [`analysis/stages/bootstrap/bootstrap-gate-report.md`](../stages/bootstrap/bootstrap-gate-report.md) | B | `1432e4a4242d3c82401edb7b58750dbbd61e0eac6e162cb93037e698e362ff66` | context only |

Phase A inputs were only the packet, the routing extract and the sparse worktree `.migration-tmp/stage-02-p002/phase-a`. Everything in the table marked B was withheld until PM released Phase B at 2026-09-24T09:46:16Z.

Exclusions: the legacy runtime (Stage 3) and any network access; earlier-migration examples (amendment A2); the Stage 1 author scratch area and the pass 001 reviewer scratch; PM scripts; Git history.

<a id="read-method-and-coverage"></a>

## Method and Coverage

**Tools.** All my own, read-only, in `.migration-tmp/stage-02-p002/reviewer-scratch/`: a class-file parser covering all 594 classes, a bytecode disassembler for selected methods, a Struts/JSP enumerator, a ZIP central-directory reader, a read-only workbook dump (exceljs from the project tools; workbook hash unchanged before and after), and citation and symbol resolvers. No JDK or decompiler, so branch order inside methods stays inferred.

**Batches.** One Phase A batch and one Phase B batch; 0 context resets.

**Direction 1, inventory to records.** Each of the 129 Phase A items was located in the Stage 1 records (C-001..C-129); one behavior found only in Phase B is C-130.

**Direction 2, records to source.** All 193 rows (C-131..C-323), 155 reconnaissance claims (C-324..C-478), and the 8 pass 001 findings plus AF-01 and AF-02 (C-479..C-488).
- *Citation resolution (CHK-001 method):* 335 `file:line` citations in the rows, the reconnaissance and the disposition record resolved; 4 whose parenthesis is only descriptive and 2 with ambiguous base names were checked by hand and are correct. 185 class/method citations resolve (5 regex artifacts for `iCalServlet`). 397 `WAR:` paths exist (1 abbreviation `pom.xml` with `...`).
- *Meaning and status:* each row was compared with the Phase A items and, where Phase A had no detail or disagreed, with a targeted Phase B source read (logged).
- *Mechanical claims:* ZIP rewrite signs, class versions, package counts, SOAP operations, Spring bean counts, JSP counts, action and JSP citation coverage were regenerated independently.

**Negative claims.** Each negative search was paired with a positive control (for example the `beforeObjectCommit` caller search found the other actions' hooks).

**Worktree.** `git status --short` in the worktree was empty at 09:23:25Z, 09:45:21Z, 09:47:08Z and at the end of the pass.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

- **Allowed Phase A inputs and exact legacy revision:** the packet, the routing extract and the sparse worktree at `ab29a84819f2c7f0753f006a168cfff96d36b7d5`, including [`legacy/`](../../legacy).
- **Filled Stage 1 records and prior results withheld:** the reconnaissance, the workbook, the checklist, the full status, the Stage 1 folder, the pass 001 report and evidence, the maintenance records, all earlier scratch, PM scripts, Git history.
- **Input-access sequence:** [`analysis/reviews/evidence/S02-P002/access-log.md`](evidence/S02-P002/access-log.md) entries 1-54.
- **Phase A snapshot:** [`analysis/reviews/evidence/S02-P002/phase-a-inventory.json`](evidence/S02-P002/phase-a-inventory.json)
- **Snapshot saved at:** 2026-09-24T09:45:21Z (Phase B released 09:46:16Z; first Phase B content access 09:47:20Z)
- **Snapshot SHA-256:** `5a39cd59b414f375f4d929d853794ff37246518440aa26f9e960eb180156ff7f`, unchanged since.
- **Inventory coverage, exclusions and unresolved source access:** 129 items A-001..A-129 (67 confirmed-static, 61 inferred, 1 excluded), with mechanical breakdowns of 87 Struts actions, 47 global forwards, 24 form beans, 74 JSP/tag/html files, the web.xml elements, 21 entities, 102 jars and 27 form validators. Excluded: [`legacy/demo-seed.sql`](../../legacy/demo-seed.sql). Unresolved: none beyond the missing decompiler.

The inventory table itself is in the snapshot file; it is not repeated here.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [x] The inventory was saved before any filled Stage 1 input was opened.
- [x] The snapshot is retrievable from this report or its durable linked evidence.
- [x] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- **First Phase B access at:** 2026-09-24T09:47:20Z (the reconnaissance), then the workbook, the checklist, the dispositions, the pass 001 report, the status and the Bootstrap report, in the order and at the times in the access log.
- **Filled parity-map revision/hash:** `1d8863d0…cf17` (unchanged at the end).
- **Filled reconnaissance revision/hash:** `faecd7ab…fbff` (unchanged at the end).
- **Other Phase B inputs and access order:** checklist `c4d1f2a7…`, dispositions `5d823882…`, pass 001 report `73e8fb00…`, status `e641a84f…`, Bootstrap report `1432e4a4…`.

**Reviewer corrections to Phase A.** The Phase A file stays frozen; these corrections are recorded only here.

| ID | Item | Correction from source | Evidence |
|---|---|---|---|
| RC-001 | A-016, A-047, A-067 | Seeded permissions 7, 8, 9 and 19 are negative (`positive=false`): editors may not create projects or people or delete iterations, admins may not create projects. My Phase A read them as grants. Stage 1 rows 24 and 88 are right on the role model. | `WAR:WEB-INF/classes/db-changelog.xml:119` (column `positive`), `:275-361`; `mappings/Metrics.xml` query `security.role.permissions` |
| RC-002 | A-038 | `login.instructions.url` is set in the override file; my Phase A said "empty". Stage 1 row 9 is right. | `WAR:WEB-INF/classes/xplanner-custom.properties:49` |
| RC-003 | A-054 | `notes.jsp` concatenates the `oid` that `viewLayout.jsp` passes as a `jsp:param` (the object id), so it is not a raw-request injection point. The `task.jsp` concatenation is real, but `ViewObjectAction#doExecute` parses `oid` as an integer before the page renders, so reachability of an injection is doubtful. Stage 1 states only the construction, which is correct. | `WAR:WEB-INF/jsp/layout/viewLayout.jsp:114-116`; `ViewObjectAction#doExecute` |
| RC-004 | A-059 | The "no iterations" message tests `iterationCount`, which the page never defines. Stage 1 row 81 (`Partial`) is right. | `WAR:WEB-INF/jsp/view/project.jsp:73` (only occurrence) |
| RC-005 | A-072 | The metrics repository is null, so the metrics tables are expected to be empty. Stage 1 AF-01 and rows 104-105 are right. | `ViewIterationMetricsAction#getRepository` (`aconst_null`) |
| RC-006 | A-116 | The missing `images/calendar.png` global forward has no user. Immaterial. | reference search with positive control |

**Stage 1 content that was absent from my Phase A,** confirmed from source in Phase B (my omissions, not Stage 1 defects): rows 9, 19 (cookie removal), 23-25 (nested-set direction and project-0 wildcard), 66-68 (locale dates), 81, 104-105, 128 (localized type values), 148, 151, 156, 164, 168, 171, 175, 185, 201, AF-02, and the ZIP rewrite signs (GAP-005).

| Comparison IDs | Direction | Resolution | Result |
|---|---|---|---|
| C-001..C-129 | inventory-to-records | 123 agree or differ only in wording or grouping; 3 missing or misstated coverage; 3 justified exclusions | 123 matched; C-020 F-002, C-078 F-008, C-118 F-001; C-013, C-121 E-001, C-117 E-002 |
| C-130 | records-to-source (new) | behavior found only in Phase B | mismatch F-008 |
| C-131..C-323 | records-to-source (rows 8..217) | 177 supported; 16 Stage 1 defects | see Comparison Results |
| C-324..C-478 | records-to-source (reconnaissance) | 138 supported; 7 defects; 10 author-process claims | 7 mismatch (F-003, F-004, F-008, F-010); 10 not-applicable E-003 |
| C-479..C-488 | pass 001 resolution | 9 verified; 1 partially resolved | C-479 F-007 |

<a id="read-comparison-scope"></a>

## Comparison Scope

- **Mode and boundary:** `full`. All 193 rows, all factual reconnaissance claims, the 129 A-items, and the pass 001 findings and dispositions.
- **Previous report and pinned baseline:** [`analysis/reviews/stage-02-pass-001.md`](stage-02-pass-001.md) (`73e8fb00…`), result `findings`. Its results were not relied on; each disposition was re-verified from source (C-479..C-488).
- **Changed items and direct dependencies rechecked:** the 14 added and 10 changed rows are inside the full scope.
- **Prior results relied on but not rerun:** none. Author commands I was not permitted to run are E-003 (not-applicable), not matched.
- **Expansion triggers examined:** none needed (full pass).

<a id="read-comparison-results"></a>

## Comparison Results

This table covers the ledger except the matched items. All 488 checks, each with its expected result, observation, evidence and link, are in [`analysis/reviews/evidence/S02-P002/comparison-results.json`](evidence/S02-P002/comparison-results.json), under the same C-IDs.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-013 / A-013 transactions | not applicable | Infrastructure wiring with no user-visible behavior | not-applicable | `spring-beans.xml:85-93` | E-001 |
| C-020 / A-020 delete cascades | Records state what a delete removes | No row states the cascade | mismatch | entity annotations | F-002 |
| C-078 / A-078 story import errors | Row 113 status matches source | Worksheet-not-found is handled by the action | mismatch | `ImportStoriesAction#execute` | F-008 |
| C-117 / A-117 undeclared form beans | not applicable | No observable behavior | not-applicable | `struts-config.xml:257,263,285` | E-002 |
| C-118 / A-118 form validation | Every validator rule recorded | Time-entry rules and the iteration interval rule missing | mismatch | `TimeEditorForm#valideRow`, `IterationEditorForm#validate` | F-001 |
| C-121 / A-121 scheduler pools | not applicable | Infrastructure, no behavior | not-applicable | `spring-beans.xml:362-363` | E-001 |
| C-130 / import settings cookies | Behavior recorded | Not recorded | mismatch | `ImportStoriesAction#setCookies/#populateForm` | F-008 |
| C-137 / row 14 | Empty login input handling | Check is on the submit field `action`; empty credentials reach the login module | mismatch | `AuthenticationAction#execute` | F-005 |
| C-146 / row 24 | Restriction described as enforced where it is | "hidden or refused": nothing refuses | mismatch | rows 29-30; handlers | F-007 |
| C-153 / row 31 | Server-side rule stated correctly | Sysadmin grant/revoke rule omitted | mismatch | `EditPersonHelper#modifyRoles` | F-007 |
| C-156 / row 34 | Sysadmin grant rule | Server gate is `admin.edit.role` on project 0; save without checkbox revokes | mismatch | `EditPersonHelper#modifyRoles`, `#isCurrentUserAdminOfProject` | F-007 |
| C-192 / row 73 | Hidden projects styled | Decorator declared, never used | mismatch | `projects.jsp:65-74,82` | F-006 |
| C-198 / row 79 | Project delete effect | Cascade to iterations, stories, tasks, time entries unrecorded | mismatch | `Project#getIterations` cascade ALL | F-002 |
| C-204 / row 86 | Iteration validation | Positive-interval rule missing | mismatch | `IterationEditorForm#requirePositiveInterval` | F-001 |
| C-206 / row 88 | Iteration delete | "not editors" without "no server-side check"; cascade unrecorded | mismatch | `DeleteObjectAction#doExecute`; `Iteration#getUserStories` | F-002, F-007 |
| C-213 / row 95 | Start confirmation text | Baselining text only on the time-entry path | mismatch | `ResourceBundle.properties:272,275`; `editIterationStatus.jsp:43-59` | F-005 |
| C-231 / row 113 | Import errors | Worksheet-not-found error works | mismatch | `ImportStoriesAction#execute` catch table | F-008 |
| C-237 / row 120 | Story delete effect | Cascade to tasks and time entries unrecorded | mismatch | `UserStory#getTasks` | F-002 |
| C-244 / row 128 | Localized type labels per bundle | Only German named | mismatch | 10 bundles, `task.type.*` | F-009 |
| C-251 / row 135 | Task delete effect | Cascade to time entries unrecorded | mismatch | `Task#getTimeEntries` | F-002 |
| C-259 / row 144 | Time-entry validation | 9 further rules unrecorded | mismatch | `TimeEditorForm#valideRow` | F-001 |
| C-269 / row 155 | Attachment count meaning | Counts notes referencing the file, not downloads | mismatch | `Note#getAttachmentCount` | F-004 |
| C-289 / row 176 | Like widget live | Inside an HTML comment | mismatch | `viewLayout.jsp:92-95` | F-003 |
| C-390 / Data And Integrations, Twitter and Facebook | Browser-side calls | The `connect.facebook.net` script is commented out | mismatch | `viewLayout.jsp:92-95` | F-003 |
| C-399, C-401, C-406, C-407, C-411, C-414, C-415, C-425, C-476, C-478 | author tool metrics, commands I may not run, process statements, self-assessment | not legacy claims | not-applicable | reconnaissance Build/Run, Boundary, Exit Checklist | E-003 |
| C-408, C-409, C-410 / Build/Run rows | Current figures | Still 179 scenarios and 0 / 179 | mismatch | `legacy_reconnaissance.md:258-260` | F-010 |
| C-416 / GAP-001 | Current figures | "48 parity rows are Inferred"; the workbook has 60 | mismatch | `legacy_reconnaissance.md:279` | F-010 |
| C-418 / GAP-003 impact | Affected flows | Worksheet-not-found error listed as broken | mismatch | `ImportStoriesAction#execute` | F-008 |
| C-477 / Parity-Map Boundary | Second-pass additions | "the attachment download counter" | mismatch | `Note#getAttachmentCount` | F-004 |
| C-479 / pass 001 F-001 | Disposition verified | Core resolved; residual refusal claims and sysadmin rule | mismatch | rows 24, 31, 34, 88 | F-007 |

All other C-items are matched, each with its citation-check result and the agreeing A-items or Phase B source read, as listed in the ledger.

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 488 | 447 | 28 | 0 | 13 |

Breakdown by direction:
- inventory-to-records (C-001..C-129): 123 matched, 3 mismatch, 3 not-applicable;
- records-to-source (C-130..C-478): 315 matched, 24 mismatch, 10 not-applicable;
- pass 001 resolution (C-479..C-488): 9 matched, 1 mismatch.

There are 10 findings (2 medium, 8 low), 0 blockers and 3 justified exclusions; one finding may affect several checks. The Phase A count of 129 A-items is separate from these totals.

**Pass 001 resolution:**

| Pass 001 finding | Resolution | Evidence (C-ID) |
|---|---|---|
| F-001 server-side enforcement | partially resolved: rows 26, 28-32, 148, 168, 201, 208, 216-217 and the enforcement table are supported; rows 24, 31, 34, 88 still misstate it (F-007) | C-479 |
| F-002 history | resolved | C-480 |
| F-003 locale dates | resolved (rows 66-68, all 10 bundles) | C-481 |
| F-004 mobile role constraints | resolved | C-482 |
| F-005 dormant code | resolved | C-483 |
| F-006 e-mail stylesheet fetch | resolved | C-484 |
| F-007 search and aggregate filters | resolved | C-485 |
| F-008 attachment storage | resolved | C-486 |
| AF-01, AF-02 (author sweep) | confirmed | C-487, C-488 |

Fixing the listed pass 001 findings did not complete discovery: F-001, F-002, F-004, F-006, F-008 and F-009 of this pass concern scope that pass 001 did not report.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

The ledger maps each independently discovered behavior to its parity-map verdict (C-001..C-130) and each row back to source (C-131..C-323). Workbook facts confirmed:
- 18 epics and 193 rows, `Source implemented?` Yes 112, Inferred 60, Partial 20, No 1;
- all rows red, columns I:N blank, 31 provenance notes;
- all 87 action paths cited; 67 of 73 JSPs cited, and the 6 uncited are the ones the reconnaissance names.

Return stage for all findings: **Stage 1** (parity-map and reconnaissance defects).

<a id="read-findings"></a>

## Findings

<a id="read-f-001-time-entry-and-iteration-validation-rules-are-missing"></a>

### F-001 - Time-entry and iteration validation rules are missing

- Severity: medium
- Comparison check IDs: C-118, C-204, C-259
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Every validation branch of a form is an alternative path in the map ([`analysis/legacy_user_flows_template_instructions.md`](../legacy_user_flows_template_instructions.md), `Alternative path` covers input validation).
- **Observed difference:**
  - Row 144 records only "unparsable date/time input". `TimeEditorForm#valideRow` also rejects: unparsable numbers; missing start or end time; no person; the same person as both pair members; negative or zero-length intervals; overlapping intervals; both an interval and a duration; missing report date; a description that is too long (keys `edittime.error.*`, messages in `ResourceBundle.properties:675-684`). Row 144 also cites `UpdateTimeAction` instead of the form validator.
  - Row 86 lists missing name and bad dates only. `IterationEditorForm#validate` also calls `#requirePositiveInterval` ("Iteration must be a positive time interval.", `ResourceBundle.properties:265`).
- **Evidence:** bytecode listings of `TimeEditorForm#valideRow` and `IterationEditorForm#validate`.
- **Requirement impact:** UF-009 time tracking and UF-006 iterations; these rules define what time data the target must reject.
- **Required action:** Add or extend the alternative-path rows for each rule, citing the form validators.
- **Return stage:** 1

<a id="read-f-002-delete-cascades-are-not-recorded"></a>

### F-002 - Delete cascades are not recorded

- Severity: low
- Comparison check IDs: C-020, C-198, C-206, C-237, C-251
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Delete rows state the observable effect, including dependent data removed by the persistence mapping.
- **Observed difference:** Rows 79, 88, 120 and 135 say only that the object is removed. The mappings cascade: `Project#getIterations` (`CascadeType.ALL`) and `Project#getBacklog` (REMOVE), `Iteration#getUserStories` (REMOVE), `UserStory#getTasks` (REMOVE), `Task#getTimeEntries` (REMOVE). Deleting a project therefore removes its iterations, stories, tasks and time entries. Notes attach by `attachedToId` without a mapping and are not cascaded.
- **Evidence:** JPA annotations on the named getters in `net.sf.xplanner.domain.*`; `DeleteObjectAction#doExecute` (`CommonDao.delete`).
- **Requirement impact:** UF-005..UF-008 delete scenarios; data-loss expectations and target referential rules.
- **Required action:** State the cascade (and the uncascaded notes) in the delete rows, marked `Inferred` where only mappings are the evidence.
- **Return stage:** 1

<a id="read-f-003-the-facebook-like-widget-is-commented-out"></a>

### F-003 - The Facebook like widget is commented out

- Severity: low
- Comparison check IDs: C-289, C-390
- **Checklist link:** none: new finding (the workbook rule "read the enclosing context" applies)
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Only live markup is recorded as behavior.
- **Observed difference:** Row 176 and the Data And Integrations Twitter and Facebook row say view pages load a Facebook "like" widget from `connect.facebook.net`. The script and `fb:like` element sit inside an HTML comment that opens at `viewLayout.jsp:92` and closes at `:95` (with a LinkedIn link). Only the Twitter status link and the Facebook feed-dialog share link (`viewLayout.jsp:73-88`) are live.
- **Evidence:** `WAR:WEB-INF/jsp/layout/viewLayout.jsp:73-95`.
- **Requirement impact:** UF-011 social links; the external-call inventory.
- **Required action:** Correct row 176 and the Data And Integrations row.
- **Return stage:** 1

<a id="read-f-004-the-note-attachment-count-is-not-a-download-counter"></a>

### F-004 - The note attachment count is not a download counter

- Severity: low
- Comparison check IDs: C-269, C-477
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Displayed values are interpreted from the code that computes them.
- **Observed difference:** Row 155 and the Parity-Map Boundary ("the attachment download counter") describe a download counter. `Note#getAttachmentCount` runs `select note from Note note where note.file.id=<id>` and returns the number of notes that reference the same file; the label is "References:" (`ResourceBundle.properties:545`). `DownloadAttachmentAction` counts nothing.
- **Evidence:** bytecode listing of `Note#getAttachmentCount`; `WAR:WEB-INF/jsp/view/notes.jsp:80-91`.
- **Requirement impact:** UF-010 notes.
- **Required action:** Correct row 155 and the boundary text.
- **Return stage:** 1

<a id="read-f-005-login-and-start-iteration-branches-are-misattributed"></a>

### F-005 - Login and start-iteration branches are misattributed

- Severity: low
- Comparison check IDs: C-137, C-213
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Branch conditions and messages cited from the code path that produces them.
- **Observed difference:**
  - Row 14 cites `StringUtils.isEmpty` on `userId`/`password`. `AuthenticationAction#execute` applies it only to the submit field `action`: an empty `action` (for example a plain GET of `/do/login`) shows the login form; empty credentials are passed to the login module and fail with `login.failed` plus a module message.
  - Row 95 says the start page "explains that starting baselines current task estimates". That text is `iteration.status.editor.message_1`, shown only when arriving from time entry; a normal start shows `message_4` "Do you want to start the iteration?".
- **Evidence:** `AuthenticationAction#execute` listing; `WAR:WEB-INF/classes/ResourceBundle.properties:272,275`; `WAR:WEB-INF/jsp/edit/editIterationStatus.jsp:43-59`.
- **Requirement impact:** UF-001 login; UF-006 start iteration.
- **Required action:** Correct rows 14 and 95; add the "no action shows the form" branch.
- **Return stage:** 1

<a id="read-f-006-hidden-project-styling-rests-on-an-unused-decorator"></a>

### F-006 - Hidden-project styling rests on an unused decorator

- Severity: low
- Comparison check IDs: C-192
- **Checklist link:** CHK-003 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-003)
- **Checklist discrepancy:** the author records no CHK-003 self-check (the check was admitted after BA-001-03's self-check); the claimed effect is attributed to `HiddenRowDecorator` although the decorator is not on any call path.
- **Required recheck:** CHK-003 on row 73 and on other rows that cite a declared helper, decorator or hook; expected: each cited helper is passed to its consumer.
- **Expected and source:** Presentation behavior rests on a helper that is actually wired.
- **Observed difference:** Row 73 says hidden projects are "styled differently", citing `projects.jsp:65-74`. The class is declared there but never passed: `projects.jsp:82` opens the `writableTable` without a `rowDecorator`, and the name occurs only at line 66.
- **Evidence:** `WAR:WEB-INF/jsp/view/projects.jsp:65-84`.
- **Requirement impact:** UF-005 project list.
- **Required action:** Correct row 73.
- **Return stage:** 1

<a id="read-f-007-system-administrator-grant-rule-and-residual-refusal-claims"></a>

### F-007 - System-administrator grant rule and residual refusal claims

- Severity: medium
- Comparison check IDs: C-146, C-153, C-156, C-206, C-479
- **Checklist link:** CHK-002 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-002)
- **Checklist discrepancy:** no author CHK-002 self-check is recorded (the check was admitted after BA-001-03's self-check). Rows 24, 31, 34 and 88 state permission conditions without the server-side enforcement status the check requires, and row 34 states the wrong rule.
- **Required recheck:** CHK-002 over every row that states a permission or role condition; expected: each cites the server-side check or says "no server-side check".
- **Expected and source:** Permission rows distinguish display gating from server enforcement (pass 001 F-001).
- **Observed difference:**
  - Row 34 says only `sysadmin.promote` holders can grant or revoke system administrator status. On the server, `EditPersonHelper#modifyRoles` calls `#isCurrentUserAdminOfProject(0, user)`, which checks `admin.edit.role` on `system.project` for project 0. If it passes, the `sysadmin` association is deleted, then re-added only when the form's `systemAdmin` flag is set. The checkbox is rendered only for `sysadmin.promote` holders, so a project-0 administrator who saves any person editor removes that person's sysadmin role, and one who posts `systemAdmin=true` grants it.
  - Row 31 presents the person editor as the one server-checked edit path but omits this rule.
  - Row 24 says the links are "hidden or refused"; nothing refuses (rows 29-30).
  - Row 88 states "not editors" as a restriction without noting that no handler checks it.
- **Evidence:** bytecode listings of `EditPersonHelper#modifyRoles`, `#setSysadmin`, `#isCurrentUserAdminOfProject` and `EditPersonAction#beforeObjectCommit`; `WAR:WEB-INF/jsp/edit/editPerson.jsp:144-151`.
- **Requirement impact:** UF-002 authorization; the Q3 disposition (Principle XI). Recording this is not permission to carry it into the target.
- **Required action:** Correct rows 24, 31, 34 and 88; add the sysadmin grant/revoke behavior to GAP-007 and the Q3 facts.
- **Return stage:** 1

<a id="read-f-008-story-import-error-handling-and-remembered-settings"></a>

### F-008 - Story import error handling and remembered settings

- Severity: low
- Comparison check IDs: C-078, C-130, C-231, C-418
- **Checklist link:** CHK-003 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-003)
- **Checklist discrepancy:** no author CHK-003 self-check recorded; the "cannot match" conclusion was drawn from the descriptor mapping without tracing the action's own handler.
- **Required recheck:** CHK-003 on rows 111-114 and the GAP-003 impact list; expected: each error or effect cites the path that produces it.
- **Expected and source:** Error outcomes and side effects traced on the actual entry path.
- **Observed difference:**
  - `ImportStoriesAction#execute` catches `importer.spreadsheet.MissingWorksheetException` (together with the three other importer exceptions) and saves `import.status.worksheet_not_found` with the worksheet name. The broken Struts exception mapping is redundant, so row 113 (`Partial`) and GAP-003's "worksheet-not-found import error" are not supported.
  - Unrecorded: after an import the action writes cookies named `import.spreadsheet.*` (worksheet, column headers, only-incomplete, completed status) and `#populateForm` pre-fills the next import from those cookies before the properties defaults (`#getValueFromCookieOrProperties`).
- **Evidence:** bytecode listings of `ImportStoriesAction#execute`, `#setCookies`, `#populateForm`.
- **Requirement impact:** UF-006 story import.
- **Required action:** Correct row 113 and GAP-003; add a row for the remembered settings.
- **Return stage:** 1

<a id="read-f-009-task-type-labels-are-generalized-from-two-bundles"></a>

### F-009 - Task type labels are generalized from two bundles

- Severity: low
- Comparison check IDs: C-244
- **Checklist link:** CHK-004 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-004)
- **Checklist discrepancy:** no author CHK-004 self-check recorded; row 128 names only the German variant.
- **Required recheck:** CHK-004 on row 128 and on the iCal overhead filter (row 211); expected: the value per bundle.
- **Expected and source:** Locale-dependent values stated per shipped variant.
- **Observed difference:** Row 128 says "the German bundle uses different labels for some types". The da, de, es, fr, it, ja and ru bundles all differ from the default for at least one type, and da, es, fr and pt_br define no `task.type.overhead` key (fallback to the default label). Because the stored type is the label, the iCal filter on the overhead label depends on the locale used when saving.
- **Evidence:** `task.type.*` keys in the 10 `WAR:WEB-INF/classes/ResourceBundle*.properties` files.
- **Requirement impact:** UF-008 task types; UF-017 iCal.
- **Required action:** State the per-bundle labels or the fact that they differ in most bundles.
- **Return stage:** 1

<a id="read-f-010-reconnaissance-keeps-superseded-figures"></a>

### F-010 - Reconnaissance keeps superseded figures

- Severity: low
- Comparison check IDs: C-408, C-409, C-410, C-416
- **Checklist link:** none: new finding (related to the workbook rule "enumerate the category; never count from recollection")
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Figures in the record agree with the current workbook.
- **Observed difference:** The Build, Run, And Test Evidence rows for `build-workbook.js`, `sync:workbook-progress` and `audit:workbook` (lines 258-260) still report 179 scenarios and 0 / 179, and GAP-001 (line 279) says 48 rows are `Inferred`. The workbook, the summary and my `audit:workbook` run show 193 scenarios and 60 `Inferred`.
- **Evidence:** [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) lines 258-260 and 279; workbook dump; `audit:workbook` output.
- **Requirement impact:** record consistency for Stage 3 planning.
- **Required action:** Update the figures, or label the rows as historical and add the BA-001-03 results.
- **Return stage:** 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| workbook audit | `npm --prefix analysis/tools run audit:workbook` | pass (exit 0, `WORKBOOK AUDIT OK`, 193 scenarios, 18 epics) | workbook hash unchanged |
| link audit (repository, before the report) | `npm --prefix analysis/tools run audit:artifact-links` | pass (exit 0, 198 documents) | tool output |
| reading structure of the Stage 1 records | `node analysis/tools/artifact-reading.js --file analysis/legacy_reconnaissance.md`; same for the dispositions | pass (exit 0, no errors) | tool output |
| link and readability audit of this report | `audit:artifact-links`; `artifact-reading.js --file analysis/reviews/stage-02-pass-002.md` | blocked for the reviewer: the client refuses subagent writes of this file; PM saves it and runs both checks | access log |
| citation resolution and cited-line content (CHK-001 method) | reviewer scripts `check-citations.js`, `check-symbols.js` | pass: 335 line citations, 185 symbols, 397 paths; 0 real failures | scratch outputs; ledger |
| legacy and input integrity | `sha256sum` before and after | pass: unchanged | access log |
| worktree state | `git status --short` in `.migration-tmp/stage-02-p002/phase-a` | pass: empty before and after | access log |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-013, C-121 | Transaction wiring and scheduler thread pools are infrastructure with no user-visible behavior | Reviewer applicability judgment; Parity-Map Boundary excludes library internals | `spring-beans.xml:85-93,362-363` |
| E-002 | C-117 | Undeclared form-bean names have no observable behavior (the actions read request parameters) | Reviewer applicability judgment, as in pass 001 E-001 | `struts-config.xml:257,263,285` |
| E-003 | C-399, C-401, C-406, C-407, C-411, C-414, C-415, C-425, C-476, C-478 | Author tool metrics, author process statements, commands outside my permitted list (`audit:project`, `audit:workbook:excel`), the blocked render, and the author's self-assessment. None is a legacy-behavior claim. | Packet permitted-operations list | reconnaissance Build/Run section, GAP-010, Exit Checklist |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-010 | this report and the ledger | pending | pending | pending |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** CHK-002 failed (F-007, rows 24, 31, 34, 88); CHK-003 failed (F-006 row 73; F-008 row 113 and GAP-003); CHK-004 failed (F-009 row 128). CHK-001 passed on independent recheck. Each failed check has its required recheck in the finding.

The result is `findings`. Ten actionable discrepancies were recorded against a complete scope, with 0 not-checked items and 0 blocked scope. The process returns to **Stage 1** for F-001..F-010 (and the residual part of pass 001 F-001). There the author follows the [return and correction protocol](README.md#return-and-correction-protocol), records dispositions outside this report and re-runs `audit:workbook`. The next gate is a new, fully blind Stage 2 pass by a new eligible fresh session.

<a id="read-error-prevention"></a>

## Error Prevention

This section is Phase B only. I opened the checklist at 09:48:54Z, after the Phase A save.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist SHA-256: `c4d1f2a73e246393546cbdf02c05ec9f9fe4ae045e97b31923a1ebaff9f6ed11` (CHK-001..CHK-004)
- Author self-check record: [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md#read-error-prevention) (BA-001-03), against checklist `92ccefd8…` which then held only CHK-001. CHK-002..CHK-004 were admitted later, so this is a current re-evaluation, not a claim of past noncompliance.

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; applies because the records cite `file:line` evidence | passed for new and changed citations (BA-001-03) | passed: 335 line citations resolve and their parenthesized elements are on the cited lines (4 descriptive and 2 ambiguous-basename cases hand-checked); 185 symbols resolve. Covers C-131..C-478. | none |
| CHK-002; applies to every row with a permission or role condition | not recorded (check admitted after the self-check) | failed: rows 24, 31, 34, 88; passed for rows 26-30, 32, 148, 151, 164, 168, 201, 208, 213, 216-217 | F-007; recheck all permission rows |
| CHK-003; applies to rows that attribute effects or hooks | not recorded | failed: row 73 (unwired decorator), row 113 and GAP-003 (handler not traced); passed for rows 35, 104-105, 131, 171, 185, 189 | F-006, F-008 |
| CHK-004; applies to locale-dependent rows | not recorded | failed: row 128; passed for rows 66-68 | F-009 |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** stage-02 pass 002, checklist `c4d1f2a7…`.
  - CHK-001 applied to my Phase A citations: every cited shipped line was taken from a per-file numbered read (`cat -n`, `sed -n` or `awk NR` of one file); passed.
  - CHK-002: my Phase A item A-049 already separated UI gating from server enforcement; my A-047 misread negative permissions (RC-001), a source-reading error, not a CHK-002 failure.
  - CHK-003: my Phase A metrics item A-072 claimed page content without tracing the null repository (RC-005): a CHK-003 miss in my own inventory, corrected here.
  - CHK-004: my A-113 did not compare bundle formats; the later comparison is in F-009 and rows 66-68.
- **Learning update (proposals for the coordinator):**
  - **P-1, from F-001:** "For every editor form, list the message keys its validate method raises (bytecode constants or bundle keys) and account for each in an alternative-path row; a row set that covers fewer keys than the form raises fails."
  - **P-2, from F-002:** "For every delete scenario, state the persistence cascade read from the entity mappings, including children that are not cascaded."
  - **P-3, from F-010:** "After a correction changes row counts or statuses, regenerate every figure in the record from the current artifact and search the record for the superseded numbers; stale figures fail."
  - F-003 and F-006 are covered by the workbook rule "read the enclosing context" and CHK-003; F-007 by CHK-002; F-008 by CHK-003; F-009 by CHK-004. No new row is proposed for them.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable. Stage 2 does not review the feature dependency graph.

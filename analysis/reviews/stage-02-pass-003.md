# Stage 02 Review - Pass 003

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

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `clean` (this exact scope meets the clean-pass rules); `findings` (discrepancies require disposition); `blocked` (required verification could not finish); `invalid` (the review attempt is unusable). None of these supplies a separate human approval. [Status meanings](../artifact-status-meanings.md).

> **Publication:** PM archives this unchanged report and evidence in a separate
> records PR, even for a negative verdict. Author corrections use a later PR.
> Required CI and owner merge apply; merge is not acceptance. Keep later PR/CI
> facts outside the sealed report. Follow
> [Review And Correction PRs](../migration_methodology.md#review-and-correction-prs).

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Result: `findings`. Stage 1 must correct 4 findings (1 medium, 3 low). Nothing is blocked.**
>
> I compared the fixed baseline WAR with the Stage 1 records in both directions: 474 checks, of which 456 matched, 14 are mismatches, 0 were not checked and 4 are not applicable. The records are accurate on almost everything, and all 10 pass 002 findings and all 8 pass 001 findings are resolved. The remaining defects are these:
> - **F-001 (medium):** the iCal feed and SOAP `getCurrentIteration` query properties that the entities do not map, so row 220 overstates them as working.
> - **F-002 (low):** a second Spring context loaded by the Struts plug-in is not recorded.
> - **F-003 (low):** three form validation keys are not covered by any row.
> - **F-004 (low):** the iteration progress chart is missing from the records.
>
> **Checklist issues:** CHK-005 failed (F-003: rows 51, 119, 126). CHK-001, CHK-002, CHK-003 (with F-002 as a related case), CHK-004, CHK-006 and CHK-007 passed on independent recheck.
>
> **Next:** return to Stage 1 for F-001..F-004. After correction, a new fully blind Stage 2 pass by a fresh eligible session is required.
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
  - [F-001 - iCal and SOAP current-iteration queries use unmapped property paths](#read-f-001-ical-and-soap-current-iteration-queries-use-unmapped-property-paths)
  - [F-002 - Second Spring context from the Struts plug-in is not recorded](#read-f-002-second-spring-context-from-the-struts-plug-in-is-not-recorded)
  - [F-003 - Three validation keys are not covered](#read-f-003-three-validation-keys-are-not-covered)
  - [F-004 - The iteration progress chart is not recorded](#read-f-004-the-iteration-progress-chart-is-not-recorded)
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
- Pass: 003
- Scope: project; full Stage 2 control reconnaissance of [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (202 rows) against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war), plus the pass 001 and pass 002 dispositions.
- Reviewed revision: `0b31638e3c86a29cc293a0f4adda27bf26f1554d` (legacy Git tree `3bd350fa5559ce56d2ea6f5136a62197754d4dca`)
- Base revision: not applicable (full pass)
- Reviewer product: Claude Code subagent, model claude-opus-5-5
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p003`
- Session ID: `a518a65e940024688`
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P003/independence-record.md`](evidence/S02-P003/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: S02-P003, [`packet.json`](evidence/S02-P003/packet.json) SHA-256 `54f2fb969934a296bfe056fe068add2f6b1519f74d86401d9fd9c9da95d1b423`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: full
- Verification baseline: the immutable revision above; the WAR SHA-256 is `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`
- Expansion trigger: none

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] For Stage 2, I inventoried source behavior before reading prior
      conclusions, the filled parity map or reconnaissance, and saved Phase A
      before first Phase B access.

**Disclosed exposure.** The client's launch context showed commit subject lines, which reveal that pass 002 returned `findings` F-001..F-010. They carry no finding content. PM accepted this as non-substantive (recorded verbatim in the independence record). The full details are in [`independence-record.md`](evidence/S02-P003/independence-record.md) and [`access-log.md`](evidence/S02-P003/access-log.md).

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

**Phase A inputs:**
- the sparse worktree `.migration-tmp/stage-02-p003/phase-a` at the immutable revision;
- the routing extract and packet;
- the process instructions named in the routing extract;
- the WAR, extracted to reviewer scratch;
- [`legacy/README.md`](../../legacy/README.md) and [`legacy/docker-compose.yml`](../../legacy/docker-compose.yml), used as run context only.

[`legacy/demo-seed.sql`](../../legacy/demo-seed.sql) is a fixture. I only hashed it and never opened it.

**Phase B inputs** were opened after RELEASE PHASE B at 12:01:19Z. Each SHA-256 was verified against the PM pin before use:

| Input | SHA-256 |
|---|---|
| [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) | `e4efcd99d3bbbc978c0de697d6a87228a0066ac715e7d5fb68df088ecb8d76de` |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (202 rows) | `73a8e05b2d32cc06521c4556f62e7cd1df15b8d57a8aae8fd4b0922433450e11` |
| [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) (CHK-001..CHK-007) | `ea8f330956ff82b5bf05a2f62439225c337cb8a7c43d81b2486074bac8e14138` |
| [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](../stages/stage-01/stage-02-pass-001-dispositions.md) | `5d823882f173f61e58747e17666f4c6d63a07bd1376628f545b82a782b4fb29a` |
| [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](../stages/stage-01/stage-02-pass-002-dispositions.md) | `549a5cf208e496206737f52c5fd0f8990c8c65fe9e5a38c10e209e21d4a37a61` |
| [`analysis/reviews/stage-02-pass-001.md`](stage-02-pass-001.md) | `73e8fb002fc374f6b82a3c1dda1e51e14f7f91badf0f75bd6a73a2385ccfad85` |
| [`analysis/reviews/stage-02-pass-002.md`](stage-02-pass-002.md) | `545ad428ab41a516e5bf936592b6815617aaa661d47b0d33b09ee6f07fe81b52` |
| [`analysis/migration_status.yaml`](../migration_status.yaml) (read-only) | `183a3d7b2b20aaa06e9adf52587bca357e75d2fe6afeeb3aca5846b0c1cc1ba3` |
| [`analysis/stages/bootstrap/bootstrap-gate-report.md`](../stages/bootstrap/bootstrap-gate-report.md) | `1432e4a4242d3c82401edb7b58750dbbd61e0eac6e162cb93037e698e362ff66` (hash only; not needed) |

**Exclusions:**
- the contents of the 102 third-party JARs (only their names were used);
- runtime behavior, which belongs to Stage 3;
- author scratch under `.migration-tmp/stage-01/`, which is withheld (E-002);
- earlier-migration material (constitution amendment A2).

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Phase A:** I extracted the WAR and wrote my own read-only Node class-file parser, which read 594 classes with 0 errors. All descriptors were read in full. The 74 JSP and tag files were scanned with comments stripped. The category lists were generated mechanically, and every negative search was run against a known positive first. Result: 127 A-items.
- **Phase B:**
  - The workbook was dumped read-only with the project exceljs.
  - `check-citations.js` checked every `file:line` citation and every `Class#member` citation in workbook column H and in the reconnaissance: 274 + 75 file citations and 168 + 52 symbols, with 0 failures. A positive control caught a planted bad line and a planted bad member.
  - For CHK-001 content, I printed the cited lines of a deterministic sample of 40 workbook citations; all 40 contain the cited element.
  - `verify-recon.js` regenerated the reconnaissance figures: file-type counts, JSP distribution, class versions, package counts, entities, SOAP operations, Spring bean counts and ZIP version-needed values.
  - I wrote a bytecode lister (`disasm.js`) and used it on the contested methods: `DispatchForward`, `EditPersonHelper#modifyRoles` and `ViewIterationMetricsAction#getRepository`.
  - Rows making claims beyond my Phase A were checked directly in the source (rows 9, 27, 39, 42, 80, 81, 87, 91, 100, 103, 118, 122, 144, 164, 184, 218).
- Worktree `git status --short` was empty before Phase A (11:42:46Z), at the Phase B start (12:02:11Z) and at the end (see Automated and Manual Gates).
- There was one batch and 0 context resets.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

- Allowed Phase A inputs and exact legacy revision: `0b31638e3c86a29cc293a0f4adda27bf26f1554d`; the WAR `46ff9dc0…4edc`; the instructions in the routing extract; README and compose as run context.
- Filled Stage 1 records and prior results withheld: the reconnaissance, the workbook, the checklist, full status, Stage 1 dispositions, the pass 001 and pass 002 reports and evidence, maintenance records, earlier scratch, and git history.
- Input-access sequence: [`access-log.md`](evidence/S02-P003/access-log.md) entries 1-37.
- Phase A snapshot: [`phase-a-inventory.json`](evidence/S02-P003/phase-a-inventory.json) (A-001..A-127 plus mechanical enumerations).
- Snapshot saved at: 2026-09-24T11:59:51Z
- Snapshot revision or SHA-256: `5d1c2c1d7fae9db70559b4a738ed8e54e544d980f7d68795711e3a2735faf8bb`
- Inventory coverage, exclusions and unresolved source access:
  - The inventory covers channels, entry points (87 Struts actions, servlets, REST, SOAP, iCal and Spring MVC), filters and listeners, startup data effects, authentication, roles and permissions, scenarios with their validation and error branches, deletes and cascades, background work, integrations, dependencies, the UI shell and broken references.
  - Limits: no decompiler was available, and the JAR contents were not opened.

The inventory itself is the durable attachment above. By category it holds 49 scenario, 11 channel, 10 auth, 9 data, 8 integration, 7 structure, 6 permission, 5 background, 5 UI, 4 startup, 4 defect, 3 role, 3 error and 3 export items.

| Inventory ID | Independently discovered surface / behavior / claim | Role, conditions and outcome | Legacy source evidence | Uncertainty / coverage limit |
|---|---|---|---|---|
| A-001..A-127 | See [`phase-a-inventory.json`](evidence/S02-P003/phase-a-inventory.json) `items` | per item | per item (WAR path with line, or class#method) | per item status: `confirmed-static`, `inferred-static` or `unverified-runtime` |

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [x] The inventory was saved before any filled Stage 1 input was opened. The checkpoint [`checkpoint-phase-a.md`](evidence/S02-P003/checkpoint-phase-a.md) has SHA-256 `cc85d9495953b5f11d2360277144def01e83dbbd177c524ddf9b2e61d6bf44ec`, and PM verified it before the release.
- [x] The snapshot is retrievable from this report or its durable linked evidence.
- [x] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- First Phase B access at: 2026-09-24T12:02:41Z (reconnaissance)
- Filled parity-map revision/hash: `73a8e05b2d32cc06521c4556f62e7cd1df15b8d57a8aae8fd4b0922433450e11`, first opened 12:03:29Z
- Filled reconnaissance revision/hash: `e4efcd99d3bbbc978c0de697d6a87228a0066ac715e7d5fb68df088ecb8d76de`
- Other Phase B inputs and access order: the checklist, the pass 002 report, the pass 002 dispositions, the pass 001 report, the pass 001 dispositions and the status file (access-log #43-#49).

**Corrections to my own Phase A interpretation.** These are recorded here, and Phase A is left unchanged. In each case the immutable source confirmed the Stage 1 record:
- **RC-001 (A-045):** the role editor hook `EditRoleAction#beforeObjectCommit(Object, Session, …)` matches no `AbstractAction` hook and has no caller, so roles are not saved (Stage 1 row 35).
- **RC-002 (A-068):** `ViewIterationMetricsAction#getRepository` returns `null` (rows 104-105).
- **RC-003 (A-103, A-104):** the integration queue uses the unmapped `com.technoetic.xplanner.domain.Integration` (rows 188-190, GAP-004).
- **RC-004 (A-119):** the live navigation tag is `net.sf.xplanner.tags.NavigationBarTag` (`xplanner.tld:146-147`), so there is no integrations link.
- **RC-005 (A-044):** sysadmin removal and re-adding are gated by `admin.edit.role` on project 0 (rows 31, 34).
- **RC-006 (A-043):** `DispatchForward` requires authorization by default (the constructor sets `true`) (row 28).
- **RC-007 (A-010):** the WAP views need a `projectId` that the links do not pass (row 226).
- **RC-008 (A-054):** the projects list is filtered by read permission in `projects.jsp:32-48` (row 27).
- **RC-009 (A-011, A-015):** Phase A did not detect the query defects reported in F-001.

| Comparison ID | Direction | Phase A inventory IDs | Stage 1 row / reconnaissance section | Source-based resolution | Result / finding / blocker |
|---|---|---|---|---|---|
| C-001..C-127 | inventory-to-records | A-001..A-127 | rows and sections per the ledger `map` | 124 agreement (9 of them after reviewer correction RC-001..RC-009) | 124 matched; C-025 and C-069 mismatch (F-002, F-004); C-125 not-applicable (E-001) |
| C-128..C-329 | records-to-source | the Phase A items for each row | workbook rows 8-226 (202 detail rows) | citations resolve; content agrees | 196 matched; 6 mismatch (F-001, F-003, F-004) |
| C-330..C-425 | records-to-source | related A-items | reconnaissance sections, claim by claim | figures regenerated | 90 matched; 3 mismatch (F-002, F-004); 3 not-applicable (E-002) |
| C-426..C-442 | records-to-source (CHK-005) | A-061, A-073, A-074, A-085, A-093 | alternative-path rows for 17 validators | per key | 14 matched; 3 mismatch (F-003) |
| C-443..C-454 | records-to-source (CHK-006) | A-049, A-092, A-097, A-099 | delete rows across all channels | cascades and foreign-key outcomes stated | 12 matched |
| C-455..C-474 | prior findings | none | pass 002 F-001..F-010; pass 001 F-001..F-008 and AF-01/AF-02 | each correction re-checked in the current records | 20 matched (all resolved or confirmed) |

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `full; the whole WAR (964 files) and both Stage 1 records, all 202 rows and every reconnaissance section, plus the pass 001 and pass 002 dispositions`
- Previous report and pinned baseline: [`stage-02-pass-002.md`](stage-02-pass-002.md) (`545ad428…1b52`) and [`stage-02-pass-001.md`](stage-02-pass-001.md) (`73e8fb00…fad85`)
- Changed items and direct dependencies rechecked: `all; the pass 002 re-entry changed 59 rows and added 9, and a full pass re-checks everything`
- Prior results relied on but not rerun: `none; earlier reports were used only to list the findings whose resolution I re-verified`
- Expansion triggers examined: `none (full pass)`

<a id="read-comparison-results"></a>

## Comparison Results

The full ledger, with ID, expected result, observation, result, evidence and link for each of the 474 checks, is [`comparison-results.json`](evidence/S02-P003/comparison-results.json). The table below lists every non-matched check and one representative of each matched group.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-025 / A-025 second Spring context | The records say that `spring-beans.xml` is loaded twice (`WAR:WEB-INF/web.xml:32-38`, `WAR:WEB-INF/struts-config.xml:438-441`) | Not recorded | mismatch | ledger C-025 | F-002 |
| C-069 / A-069 statistics charts | Every chart on the statistics page is recorded | Progress chart missing | mismatch | `WAR:WEB-INF/jsp/view/iterationStatistics.jsp:155-191` | F-004 |
| C-125 / A-125 undefined form-bean names | not applicable | no observable behavior | not-applicable | `WAR:WEB-INF/struts-config.xml:11-75` | E-001 |
| C-169 / row 51 | Every people-import validation key is covered | `import.status.no_import_file` (inherited `ImportForm#validate`) is missing | mismatch | classes.json form strings | F-003 |
| C-221 / row 106 | The statistics page content is complete | Progress chart omitted | mismatch | `iterationStatistics.jsp:155-191`, `xplanner.properties:67` | F-004 |
| C-233 / row 119 | All `UserStoryEditorForm#validate` keys are covered | `story.editor.same_iteration` (the `merge` path) is missing | mismatch | `disasm.js` listing | F-003 |
| C-240 / row 126 | All `MoveContinueStoryForm#validate` keys are covered | `story.editor.missing_name` is missing | mismatch | classes.json | F-003 |
| C-318 / row 212 | The SOAP reads work, including the current iteration | `getCurrentIteration` uses `object.projectId`, but `Iteration` has no such property | mismatch | `XPlanner#getCurrentIteration` constant; `Iteration` getters | F-001 |
| C-324 / row 220 | The iCal feed works (`Yes`) | Both HQL queries use `task.story`, but `Task` maps `userStory` | mismatch | `iCalServlet` constant pool; `Task` getters | F-001 |
| C-340 / reconnaissance Spring row | Complete context inventory | Double loading omitted (bean counts confirmed) | mismatch | `verify-recon.json` | F-002 |
| C-353 / reconnaissance Charts row | All charts listed | Progress chart omitted | mismatch | `iterationStatistics.jsp:155-191` | F-004 |
| C-367 / Runnable Surfaces, daily job | Registration count recorded | Recorded as one task; the plug-in context registers it again | mismatch | `struts-config.xml:438-441`, `spring-beans.xml:362-367` | F-002 |
| C-401, C-411, C-423 / author tool outputs, render, self-assessment | not applicable | process statements, withheld scratch, commands outside the permitted list | not-applicable | packet permitted operations | E-002 |
| C-430, C-433, C-442 / CHK-005 validators | All keys covered | 3 keys uncovered | mismatch | classes.json | F-003 |
| C-001 / A-001 package identity (representative of C-001..C-127) | covered by the reconnaissance | covered | matched | ledger | none |
| C-128 / row 8 login (representative of C-128..C-329) | claim supported | supported; citations resolve | matched | row 8 column H | none |
| C-336 / Struts row: 87 actions, 24 forms, 47 forwards, 3 exceptions | figures correct | reproduced mechanically | matched | `enum.json` | none |
| C-455..C-464 / pass 002 F-001..F-010 | correction present | all resolved | matched | ledger | resolution recorded |
| C-465..C-474 / pass 001 F-001..F-008, AF-01, AF-02 | resolution still holds | resolved or confirmed | matched | ledger | resolution recorded |

**Pass 002 resolution:**

| Pass 002 finding | Resolution | Evidence (C-ID) |
|---|---|---|
| F-001 time-entry and iteration validation | resolved: rows 86 and 145-153 cover all 10 `TimeEditorForm#valideRow` keys and `nonpositive_interval` | C-455 |
| F-002 delete cascades | resolved: rows 49, 79, 88, 121, 136, 167, 169 and 213 | C-456 |
| F-003 Facebook widget | resolved: row 185 | C-457 |
| F-004 attachment reference count | resolved: row 164 (`notes.jsp:90`) | C-458 |
| F-005 login and start-iteration branches | resolved: rows 14 and 95 | C-459 |
| F-006 hidden-project styling | resolved: row 73 | C-460 |
| F-007 sysadmin grant rule | resolved: rows 24, 31, 34 and 88; the `modifyRoles` bytecode agrees | C-461 |
| F-008 story import handling | resolved: rows 113 and 115 | C-462 |
| F-009 task type labels | resolved: rows 129 and 220 | C-463 |
| F-010 superseded figures | resolved: no stale figure remains | C-464 |

**Pass 001 resolution (re-verified):**

| Pass 001 finding | Resolution | Evidence (C-ID) |
|---|---|---|
| F-001 server-side enforcement | resolved; the residual gap was closed by the pass 002 F-007 correction | C-465 |
| F-002 history | resolved: rows 179-180 | C-466 |
| F-003 locale dates | resolved: rows 66-68; the `es` value `dd-MM-yyyy HH:MM` was confirmed | C-467 |
| F-004 mobile role constraints | resolved: rows 32 and 225 | C-468 |
| F-005 dormant code | resolved | C-469 |
| F-006 e-mail stylesheet fetch | resolved: row 194 | C-470 |
| F-007 search and aggregate filters | resolved: rows 160 and 173 | C-471 |
| F-008 attachment storage | resolved: row 165 | C-472 |
| AF-01, AF-02 (author sweep) | confirmed by my bytecode listings (RC-001, RC-002) | C-473, C-474 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 474 | 456 | 14 | 0 | 4 |

By direction:
- inventory-to-records: 127 checks (124 matched, 2 mismatch, 1 not-applicable);
- records-to-source: 327 checks (312 matched, 12 mismatch, 3 not-applicable);
- prior findings: 20 checks (20 matched).

There are 4 findings (1 medium, 3 low), 0 blockers and 2 justified exclusions covering 4 checks. One finding can affect several checks. The Phase A count of 127 A-items is separate from these totals.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

Independently discovered behavior against the parity-map verdict:
- **Workbook facts, confirmed:**
  - 18 epics and 202 rows; `Source implemented?` is Yes 111, Inferred 71, Partial 19 and No 1;
  - every detail row is red and columns I:N are blank;
  - all 87 actions are cited;
  - 68 of the 73 JSPs are cited, and the 5 uncited ones are exactly those the reconnaissance names.
- **Reconnaissance figures:**
  - 964 files, and 594 classes all at version 50.0;
  - 3 ZIP entries with version-needed 2.0;
  - 21 `@Entity` classes, 43 SOAP operations and Spring bean counts of 58/5/13/14/3.
  - All were regenerated and match.
- **CHK-002 enforcement statements:** re-checked with bytecode for `DispatchForward`, `EditPersonHelper` and `projects.jsp`.

Return stage for all findings: **Stage 1** (parity-map and reconnaissance defects).

<a id="read-findings"></a>

## Findings

<a id="read-f-001-ical-and-soap-current-iteration-queries-use-unmapped-property-paths"></a>

### F-001 - iCal and SOAP current-iteration queries use unmapped property paths

- Severity: medium
- Comparison check IDs: C-318, C-324
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** A row marked `Yes` or presented as working needs its query to resolve against the mapped entities. The workbook rule says to confirm that the consumer receives the value.
- **Observed difference:**
  - `com.technoetic.xplanner.ical.iCalServlet#generateTaskData` and `#generateTimeEntryData` build HQL that joins with `task.story = story.id`. The mapped entity `net.sf.xplanner.domain.Task` has the property `userStory` (`@ManyToOne @JoinColumn(name="story_id")`) and no `story` property. `mappings/Task.xml` is not loaded, because only `Metrics.xml` is. Both queries are therefore expected to fail with a query exception, so the feed returns no calendar. Row 220 says the feed "returns a calendar with the person's open non-overhead tasks … and their time entries" and marks it `Yes`.
  - `com.technoetic.xplanner.soap.XPlanner#getCurrentIteration` passes the condition `object.startDate <= ? and object.endDate >= ? and object.projectId = ?` to `#getObjects`. `net.sf.xplanner.domain.Iteration` has `project` but no `projectId` property. Row 212 lists "iterations (including current iteration)" among the working SOAP reads.
  - Related but uncertain: `XPlanner#getNotesForObject` filters on `attachedTo_Id`. That is the column name, not the property name (`attachedToId`), and how Hibernate treats it is a Stage 3 question.
- **Evidence:**
  - the constant-pool strings of `iCalServlet` and `XPlanner#getCurrentIteration`;
  - the getters of `Task` and `Iteration` in the parsed classes;
  - `WAR:WEB-INF/classes/spring-beans.xml:77-81`.
- **Requirement impact:** UF-017 iCal feed and UF-015 SOAP reads. The rows describe working behavior where the package shows a defect. That changes parity expectations and the scope of the Stage 3 walkthrough.
- **Required action:**
  - Correct row 220 to `Partial` or `Inferred`, noting that the queries reference the unmapped path `task.story`.
  - Qualify the current-iteration operation in row 212.
  - Add both facts to GAP-003 or GAP-014, or to the Q2 facts.
  - Sweep the other HQL strings in the class dump for property paths that the entities do not have.
- **Return stage:** 1

<a id="read-f-002-second-spring-context-from-the-struts-plug-in-is-not-recorded"></a>

### F-002 - Second Spring context from the Struts plug-in is not recorded

- Severity: low
- Comparison check IDs: C-025, C-340, C-367
- **Checklist link:** CHK-003 (related: effects must be traced through the actual wiring). This is otherwise a new finding.
- **Checklist discrepancy:** the author's CHK-003 self-check covers hooks and effects per entry point, but not configuration that is loaded more than once. No failed CHK-003 claim is involved.
- **Required recheck:** CHK-003 on rows 63, 192 and 193 and on the reconnaissance Spring and Runnable Surfaces rows. Expected: each states which context registers the job and the Liquibase bean, and marks the duplicate effect `Inferred`.
- **Expected and source:** The reconnaissance inventories how each configuration file is loaded. `spring-beans.xml` is loaded by the root `ContextLoaderListener` (`WAR:WEB-INF/web.xml:32-38`) and a second time by the Struts `ContextLoaderPlugIn` together with `action-servlet.xml` and `test-action-servlet.xml` (`WAR:WEB-INF/struts-config.xml:438-441`).
- **Observed difference:** The Spring row and the Runnable Surfaces job row describe a single context with one scheduled task. The second context instantiates every singleton in `spring-beans.xml` again: the `task:scheduled-tasks` registration of `missingTimeEntryNotifier` (cron `0 5 0 * * *`), the Liquibase bean, the session factory and the other beans. The expected effects are that the daily reminder job runs twice (duplicate e-mails) and that Liquibase runs a second time at startup. The action beans are resolved in the plug-in context. The records mention `struts-config.xml:440` only to say that the test configuration is loaded.
- **Evidence:**
  - `WAR:WEB-INF/web.xml:32-38`, `WAR:WEB-INF/struts-config.xml:438-441`;
  - `WAR:WEB-INF/classes/spring-beans.xml:71-81,362-367`;
  - a search of the reconnaissance and workbook for `ContextLoaderPlugIn` or double loading returned no hit, while the positive control `struts-config.xml:440` was found.
- **Requirement impact:** UF-013 notifications (count of reminder e-mails) and UF-004 startup; Stage 3 walkthrough planning.
- **Required action:** Record the double loading in the Spring row and the job rows as an `Inferred`, runtime-unverified effect (duplicate daily run, second Liquibase run), and add it to GAP-014 for Stage 3 confirmation.
- **Return stage:** 1

<a id="read-f-003-three-validation-keys-are-not-covered"></a>

### F-003 - Three validation keys are not covered

- Severity: low
- Comparison check IDs: C-169, C-233, C-240, C-430, C-433, C-442
- **Checklist link:** CHK-005 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-005)
- **Checklist discrepancy:** the author's BA-001-04 self-check names CHK-001..CHK-004. CHK-005 was admitted afterwards, so this is a current re-evaluation, not a claim of past noncompliance. Three validators raise keys that no alternative-path row covers.
- **Required recheck:** CHK-005 over all 17 validators. Expected: every key raised in a `validate`/`valideRow` method is covered by an alternative-path row that cites the validator.
- **Expected and source:** Each validation key raised is an alternative path.
- **Observed difference:**
  - The people import form `ImportPeopleForm` inherits `ImportForm#validate`, which raises `import.status.no_import_file`. Rows 50-51 cover only per-line statuses. Row 112 covers that key for the story import only.
  - `UserStoryEditorForm#validate` raises `story.editor.same_iteration` on the `merge=true` path. That path also skips the name, estimate and priority checks (bytecode listing, offsets 16-19 and 65-84). Row 119 lists three keys, and row 126 cites only `MoveContinueStoryForm`.
  - `MoveContinueStoryForm#validate` raises `story.editor.missing_name`, and no row covers it.
  - `MoveContinueTaskForm#validate`'s `task.editor.missing_name` is cited in the evidence of row 140 but not stated in its requirement. This is a wording point only.
- **Evidence:** the form string constants per method (reviewer class parser); the `UserStoryEditorForm#validate` listing.
- **Requirement impact:** UF-003 people import, UF-007 stories. These rules define what the target must reject.
- **Required action:** Add or extend alternative-path rows for the three keys and cite the validators.
- **Return stage:** 1

<a id="read-f-004-the-iteration-progress-chart-is-not-recorded"></a>

### F-004 - The iteration progress chart is not recorded

- Severity: low
- Comparison check IDs: C-069, C-221, C-353
- **Checklist link:** none: new finding (related to the workbook rule "enumerate the category; never count from recollection")
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** Every live chart on the statistics page is a recorded behavior. `WAR:WEB-INF/jsp/view/iterationStatistics.jsp:155-191` renders a "progress" line chart inside `xplanner:propertyEqual key="xplanner.effort.chart.progress" value="displayed"`. The chart uses `DataSampleData` with the aspects `estimatedHours,actualHours`. The effective value is `displayed` (`WAR:WEB-INF/classes/xplanner.properties:67`).
- **Observed difference:**
  - Row 106 lists the pie charts and a burn-down chart.
  - Row 108 ties the stored data samples to the burn-down only.
  - The reconnaissance Charts row lists "6 pie charts, velocity and burn-down line charts".
  - The progress chart, which is shown by default, and its display flag are recorded nowhere.
- **Evidence:** `iterationStatistics.jsp:123,155,191,193,228` (the live `propertyEqual` blocks; comments at `:37-43` and `:224` only); `xplanner.properties:66-68`.
- **Requirement impact:** UF-006 iteration statistics.
- **Required action:** Add the progress chart and its flag to row 106 or a new row, extend row 108 to the progress chart, and correct the Charts row.
- **Return stage:** 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| workbook audit | `npm --prefix analysis/tools run audit:workbook` | pass (exit 0, `WORKBOOK AUDIT OK`, 202 scenarios, 18 epics) | workbook hash unchanged |
| link audit (repository) | `npm --prefix analysis/tools run audit:artifact-links` | first run failed on my own evidence file (`independence-record.md:15`, a path that was not clickable); I fixed it and re-ran (see the RESULT) | access log #50-#51 |
| reading structure of Stage 1 records | `node analysis/tools/artifact-reading.js --file analysis/legacy_reconnaissance.md`; same for the pass 002 dispositions | pass (exit 0, no errors) | tool output |
| link and readability of this report | `artifact-reading.js --file` on the scratch copy | see the RESULT; PM runs both on the saved copy | RESULT |
| citation resolution (CHK-001 method) | `check-citations.js` with a positive control; a 40-citation content sample | pass: 349 file citations and 220 symbols, 0 failures; 40 of 40 contents match | reviewer scratch |
| figure regeneration (CHK-007) | `verify-recon.js` | pass except the findings above | `verify-recon.json` |
| legacy integrity | SHA-256 of the four [`legacy/`](../../legacy) files before and after | pass: unchanged | access log |
| worktree state | `git status --short` in `.migration-tmp/stage-02-p003/phase-a` | pass: empty before, during and after | access log |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-125 | Undeclared form-bean names (`struts-config.xml:257,263,285,301-302`, `test-struts-config.xml:19`) have no observable behavior | reviewer applicability judgment, on the same basis as the earlier passes | `WAR:WEB-INF/struts-config.xml:11-75` |
| E-002 | C-401, C-411, C-423 | Author tool outputs in withheld scratch, commands outside the permitted list (`audit:project`, `audit:workbook:excel`), the blocked render (GAP-010), and the author's process statements and self-assessment. None is a legacy-behavior claim; the legacy facts they support were checked from source. | the PM Phase B release (permitted operations) | the reconnaissance Build/Run section, GAP-010, the Exit Checklist |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-004 | this report and [`comparison-results.json`](evidence/S02-P003/comparison-results.json) | pending | pending | pending |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** CHK-005 failed (F-003: rows 51, 119, 126; recheck all 17 validators). F-002 is related to CHK-003. CHK-001, CHK-002, CHK-004, CHK-006 and CHK-007 passed on independent recheck. Having no other checklist issues does not by itself mean that the rest of the review passed.

The result is `findings`: four actionable discrepancies (F-001 medium; F-002, F-003 and F-004 low) against a complete declared scope, with 0 not-checked items and 0 blocked scope. The two exclusions cover process statements and undeclared form names only.

The process returns to **Stage 1** for F-001..F-004. There the author follows the [return and correction protocol](README.md#return-and-correction-protocol), records dispositions outside this report and re-runs `audit:workbook`. The next gate is a new, fully blind Stage 2 pass by a new eligible fresh session.

<a id="read-error-prevention"></a>

## Error Prevention

This section is Phase B only. I opened the checklist after the Phase A save and the PM release (access-log #43).

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `ea8f330956ff82b5bf05a2f62439225c337cb8a7c43d81b2486074bac8e14138` (CHK-001..CHK-007)
- Author self-check record/version: [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md#read-error-prevention) (BA-001-04), against checklist `c4d1f2a7…` (CHK-001..CHK-004). CHK-005..CHK-007 were admitted afterwards, so their results here are current re-evaluations.

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; the records cite `file:line` | passed (BA-001-04, `chk001-ba-001-04.js`) | passed: 349 file citations exist, 220 symbols resolve, and all 40 sampled citations contain the cited element (C-128..C-329, C-330..C-425) | none |
| CHK-002; permission rows | applied to every permission row | passed: bytecode confirms rows 28, 31 and 34; rows 27 and 38 correctly say "filtered while rendering"; the sampled display-only rows cite no server check (C-143, C-146, C-147, C-150, C-153, C-156; enforcement table C-372..C-380, sweep C-383) | none |
| CHK-003; claimed effects and hooks | applied (rows 14, 73, 113; cascades) | passed for AF-01, AF-02, rows 35, 104-105, 164, 188 (C-154, C-219, C-220, C-275, C-297, C-381, C-382). Related gap: the effects of loading the same configuration twice are not traced | F-002 (related) |
| CHK-004; locale-dependent rows | applied (rows 129, 164, 14, 86, 95, 145-153, 156, 159, 220) | passed: rows 66-67 (`es` `HH:MM` confirmed), 129, 220 | none |
| CHK-005; form validation | not recorded (admitted after the self-check) | failed: 3 of 17 validators have uncovered keys (C-426..C-442) | F-003; recheck all validators |
| CHK-006; delete scenarios | applied through the F-002 sweep | passed: 12 delete paths across web, file manager, time, integration and SOAP (C-443..C-454) | none |
| CHK-007; figures after correction | applied (F-010) | passed: every reconnaissance figure regenerated; no stale value (C-334, C-336, C-420, C-421) | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** stage-02 pass 003, checklist `ea8f3309…`.
  - CHK-001 was applied to my Phase A citations. Line numbers came from per-file numbered reads, and `check-inventory.js` found 0 path or symbol problems.
  - CHK-002: my Phase A under-stated two server-side checks (RC-006 `DispatchForward` default, RC-008 projects-list filter). I corrected both from bytecode and JSP, which confirms the value of this check for my own inventory.
  - CHK-003: my Phase A missed an unreachable hook (RC-001) and a null dependency (RC-002). These are CHK-003 misses in my inventory, corrected here.
  - CHK-004 to CHK-007 applied as in the Checklist Review.
  - One self-detected error: an evidence file of mine failed `audit:artifact-links` (a path that was not clickable). I fixed it before handoff.
- **Learning update (proposals for the coordinator):**
  - **P-1, from F-001:** "For every HQL or criteria string that a row relies on, check each property path against the getters and annotations of the mapped entity (not the column names); a path the entity does not map fails." This is not covered by CHK-003, which concerns hooks and dependencies, not query validity.
  - **P-2, from F-002:** "For every configuration file cited as wiring, list every loader of that file (listeners, plug-ins, imports) and record the effects of duplicate instantiation, especially for scheduled jobs and startup migrations." Adding this to CHK-003's applicability is an alternative.
  - F-003 is covered by CHK-005, and F-004 by the workbook rule "enumerate the category". No new row is proposed for them.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable. Stage 2 does not review the feature dependency graph.

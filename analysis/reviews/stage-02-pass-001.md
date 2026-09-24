# Stage 02 Review - Pass 001

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
> **Result `findings`: 8 findings return the Stage 1 records to Stage 1**
>
> `findings` means the pass recorded actionable discrepancies that need Stage 1 dispositions; it is not an approval. All 421 checks ran: 404 matched, 10 mismatch, 7 not-applicable and 0 not-checked, so no scope is blocked. The main finding, F-001 (high), is that generic view, edit and delete actions have no server-side permission check, while the Stage 1 records describe only UI gating and claim a not-authorized error. F-002 and F-007 (medium) and F-003 to F-006 and F-008 (low) are listed under Findings.
>
> **Checklist issues:** none. The reviewer re-checked CHK-001 independently and it passed; no F or B item is linked to it.
>
> **Next:** The Stage 1 author checks F-001 to F-008 against the legacy source, corrects the records and records a disposition for each finding. Then a new eligible fresh Stage 2 session runs a new full blind pass.
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
  - [F-001 - Server-side permission enforcement is missing and unrecorded](#read-f-001-server-side-permission-enforcement-is-missing-and-unrecorded)
  - [F-002 - History recording is overstated](#read-f-002-history-recording-is-overstated)
  - [F-003 - Date formats differ by locale](#read-f-003-date-formats-differ-by-locale)
  - [F-004 - Mobile role constraints are misdescribed](#read-f-004-mobile-role-constraints-are-misdescribed)
  - [F-005 - Dormant code inventory is incomplete](#read-f-005-dormant-code-inventory-is-incomplete)
  - [F-006 - E-mail stylesheet HTTP fetch is unrecorded](#read-f-006-e-mail-stylesheet-http-fetch-is-unrecorded)
  - [F-007 - Permission filtering of search and aggregate timesheet is unrecorded](#read-f-007-permission-filtering-of-search-and-aggregate-timesheet-is-unrecorded)
  - [F-008 - Attachment storage left undetermined](#read-f-008-attachment-storage-left-undetermined)
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
- Pass: 001
- Scope: project `xplanner2-revision1`. The full Stage 1 records are [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (18 epics, 179 scenario rows), reviewed against the immutable [`legacy/`](../../legacy) package.
- Reviewed revision: `714618408ba56aab6e2c2d447cc773d3d628ccc2`
- Base revision: not applicable (full pass; first Stage 2 entry)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer`
- Session ID: `a648f7528e565ff59` (subagent of session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P001/independence-record.md`](evidence/S02-P001/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P001`
  - [`packet.json`](evidence/S02-P001/packet.json): `c68cb155ab1e70e386db865cb63c3b2bc9bbda39951120587062968a1f683056`
  - [`routing-extract.json`](evidence/S02-P001/routing-extract.json): `61f8ce4266d96394d41b55423c32d9f84219292c29b825d55e7084cf9e2ad7f9`
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

Disclosed exposure, which PM accepted as non-substantive (PM ANSWER BA-002-01): at launch the client injected, without my request, a gitStatus snapshot of the main tree and the neutral `CLAUDE.md` bridge. The snapshot contained file status letters and five commit subject lines, with no record content. Owner decision `stage-02-reviewer-launch:xplanner2-revision1` accepted the residual risk of this launch mode. PM writes the structured status entry.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

| Input | Phase | SHA-256 | Use |
|---|---|---|---|
| [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war) | A, B | `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc` | authoritative source, extracted read-only to reviewer scratch |
| [`legacy/README.md`](../../legacy/README.md), [`legacy/docker-compose.yml`](../../legacy/docker-compose.yml) | A, B | `78b1a6b4…5460`, `e15cd9db…69e9ff` | run hints only |
| [`legacy/demo-seed.sql`](../../legacy/demo-seed.sql) | A | `2d32f7d5…387e` | excluded fixture; I read only its first 1,500 bytes |
| [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) | B | `6e831b2f4f61f40d22763d4d4c37091191c57abc91062e996a3a22e6885faa4b` | reviewed record |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | B | `cb762eae1c66084e2df3d30a70f1364521cd9532e1ba481bc356da43d259492f` | reviewed record |
| [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) | B | `92ccefd8b635ad0563da76acb5363fce46609c5a9a9ace7b0a7d856e69ae591a` | Checklist Review |
| [`analysis/migration_status.yaml`](../migration_status.yaml) | B | `969ce373b2d7d28e441c04b376c11abf4ccfb64b7246178d3a94fd770565884e` | owner decisions (read only) |
| [`analysis/stages/bootstrap/bootstrap-gate-report.md`](../stages/bootstrap/bootstrap-gate-report.md) | B | `1432e4a4242d3c82401edb7b58750dbbd61e0eac6e162cb93037e698e362ff66` | context only |

Exclusions:
- the legacy runtime (Stage 3) and any network access;
- earlier-migration examples (amendment A2);
- the Stage 1 author's scratch area, PM scripts and Git history.

<a id="read-method-and-coverage"></a>

## Method and Coverage

**Tools.** Everything was read with my own read-only tools in `.migration-tmp/stage-02/reviewer-scratch/`:
- a class-file parser that covers all 594 classes (constant pool, members, annotations, invoke/field/ldc operands);
- a comment-aware XML parser;
- a JSP scanner that strips comments;
- a ZIP central-directory reader.

There was no decompiler and no JDK, so branch order inside methods stays inferred.

**Batches.** There was one Phase A batch and one Phase B batch, with 0 context resets. The Phase B checkpoint is `reviewer-scratch/checkpoint-phase-b.json` (`7c44112320c9d74b79e51bb9b99955d5444532435de9e0af82834ab65fd4efa9`).

**Direction 1, inventory to records.** I located each of the 118 Phase A items in the Stage 1 records (C-001..C-118).

**Direction 2, records to source.** This covers the 179 scenario rows (C-119..C-297) and 124 reconnaissance claims (C-298..C-421).
- *Citation resolution:* I resolved every cited file, line range, class and method mechanically. Of 519 citations, 11 did not resolve, and all 11 are deliberate "ABSENT" citations or abbreviations.
- *Line content:* for every cited line range that names an element, I checked that the element is there. 116 were found; 1 token was a description, which I checked by hand. I also reviewed by hand the 126 citations that name no element.
- *Meaning and status:* I compared each row's meaning and status with the Phase A items. Where Phase A had no detail, I compared it with a targeted Phase B source read.

**Negative claims.** Each negative claim used here was run with a positive control on the same pattern.

**Worktree.** `git status --short` was empty at every check, before and after the pass.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

- **Allowed inputs:** the packet, the routing extract, and the sparse worktree `.migration-tmp/stage-02/phase-a` at the reviewed revision.
- **Withheld inputs, none opened before the checkpoint:** the reconnaissance, the workbook, the checklist, the full status, the Stage 1 scratch area, PM scripts, Git history and PR descriptions.
- **Access sequence:** [`analysis/reviews/evidence/S02-P001/access-log.md`](evidence/S02-P001/access-log.md)
- **Snapshot:** [`analysis/reviews/evidence/S02-P001/phase-a-inventory.json`](evidence/S02-P001/phase-a-inventory.json)
  - saved at 2026-09-24T08:18:07Z;
  - SHA-256 `ee62d7fb775edff9b34ab19b201d2ead6ac121e50dd6ab98a0b3f7b6238cf7ac`, unchanged since;
  - PM released Phase B at 08:19:15Z, and my first Phase B access was at 08:20:10Z.
- **Coverage:** 118 items (98 confirmed-static, 20 inferred), plus exhaustive mechanical appendices:
  - 87 Struts actions;
  - 76 JSP, tag and HTML files;
  - 43 SOAP operations;
  - 7 annotated endpoints;
  - 21 entities;
  - 29 named queries;
  - 102 jars;
  - hashes of all 964 WAR files.
- **Exclusions:** `demo-seed.sql`.
- **Unresolved access:** none.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [x] The inventory was saved before any filled Stage 1 input was opened.
- [x] The snapshot is retrievable from this report or its durable linked evidence.
- [x] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- **First access:** 2026-09-24T08:20:10Z (the reconnaissance), then the workbook, the checklist, the status and the Bootstrap report. The exact order and times are in the access log.
- **Pinned inputs:** the workbook `cb762eae…` and the reconnaissance `6e831b2f…`. Both hashes are unchanged at the end.

**Reviewer corrections to Phase A.** The Phase A file stays frozen; these corrections are recorded only here.

| ID | Item | Correction from source | Evidence |
|---|---|---|---|
| RC-01 | A-055 | The worksheet-not-found mapping names `com.technoetic.xplanner.importer.MissingWorksheetException`, which does not exist; the real class is in `importer.spreadsheet`. Stage 1 row 107 (Partial) is right. | `WAR:WEB-INF/struts-config.xml:343-345` |
| RC-02 | A-018 | `ExceptionHandler` is not wired: no `handler` attribute uses it. | `WAR:WEB-INF/struts-config.xml:81-90` |
| RC-03 | A-082 | Web edits do not go through `RepositoryHistoryAdapter` (see F-002). | call graph of `HistorySupport.saveEvent` |
| RC-04 | A-095 | The link to `wap/auth.jsp` is inside a JSP comment. Stage 1's "unreferenced" is right. | `WAR:WEB-INF/jsp/wap/login.jsp:22` |
| RC-05 | appendix | There are 47 global-forward elements with 46 distinct names, because `view/integrations` appears twice. Stage 1's 47 is right. | `WAR:WEB-INF/struts-config.xml:113,145` |

**Stage 1 content that was absent from my Phase A.** I confirmed all of it from source in Phase B. These are my omissions, not Stage 1 defects: rows 9, 35, 38, 74, 75, 98-99, 103, 110, 121-122, 147, 150, 159, 163, 164 and 165, and the `task.jsp` HQL concatenation in GAP-007.

| Comparison IDs | Direction | Resolution | Result |
|---|---|---|---|
| C-001..C-118 | inventory-to-records | 112 agree, or differ only in wording or grouping; 5 are missing coverage; 1 is a justified exclusion | 112 matched; C-015 F-005, C-037 F-001, C-070 F-007, C-080 F-007, C-106 F-006; C-116 E-001 |
| C-119..C-297 | records-to-source (rows 8..203) | 176 supported; 3 Stage 1 defects | C-138 (row 28) F-001, C-170 (row 62) F-003, C-261 (row 160) F-002 |
| C-298..C-421 | records-to-source (reconnaissance) | 116 supported; 2 defects; 6 author-process claims | C-315 F-004, C-344 F-008; 6 not-applicable E-002 |

<a id="read-comparison-scope"></a>

## Comparison Scope

- **Mode and boundary:** `full`. The pass covers all 179 rows, all factual claims in the reconnaissance and all 118 A-items.
- **Previous report:** none.
- **Changed items / direct dependencies:** not applicable.
- **Prior results relied on:** none. I did not re-run the author commands that I was not permitted to run; those checks are E-002 (not-applicable), not matched.
- **Expansion triggers:** none.

<a id="read-comparison-results"></a>

## Comparison Results

This table covers the ledger except the matched items. All 421 checks, each with its observation and evidence, are in [`analysis/reviews/evidence/S02-P001/comparison-results.json`](evidence/S02-P001/comparison-results.json) (SHA-256 `4e7e2b6e21404aa9e63f037032fe47ea8bf329f17343bef92e0d7c4ca4bae1e1`), under the same C-IDs.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-015 / A-015 dormant channels | Reconnaissance lists every unwired or disabled surface | JAX-WS is recorded. The commented `NullSecurityFilter` (auto-login as `sysadmin`), `net.sf.xplanner.dwr.Project`, the `JettyServer` launcher and `MissingTimeEntryEmailJob` are not. | mismatch | `WAR:WEB-INF/web.xml:76-83`; class symbols | F-005 |
| C-037 / A-037 server-side authorization | Records state whether actions enforce permissions on the server | Not recorded (details in F-001) | mismatch | `ViewObjectAction#doExecute`, `EditObjectAction#updateObject`, `DeleteObjectAction#doExecute` | F-001 |
| C-070 / A-070 aggregate timesheet | Permission branch recorded | Row 142 omits the project read filter in `AggregateTimesheetQuery#getTimesheet` (`system.project`, `read`) | mismatch | class symbol | F-007 |
| C-080 / A-080 content search | Permission branch recorded | Rows 154-158 omit the read filter on search results (`SearchResultAuthorizationPredicate`) | mismatch | `ContentSearchHelper#getAuthorizationPredicate` | F-007 |
| C-106 / A-106 mail dependency | Every outbound dependency recorded | The HTTP fetch of `xplanner.application.url` + `/css/email.css` is not recorded | mismatch | `EmailFormatterImpl#formatEmailEntry` | F-006 |
| C-116 / A-116 undefined form beans | not applicable | The affected actions read only request parameters, so there is no observable behavior | not-applicable | `DeleteObjectAction#doExecute` | E-001 |
| C-138 / row 28 | Row 28 claims an unauthorized action shows the not-authorized error | Not supported for web CRUD. `AuthorizationException` is raised only by `RepositorySecurityAdapter`, which no web action uses. `DispatchForward` checks only when an `@secure` forward exists, and none is configured. | mismatch | call graph; all descriptors | F-001 |
| C-170 / row 62 | Row 62 claims `yyyy-MM-dd` for the shipped bundles | es, fr, it and pt_br use `dd-MM-yyyy`; es date-time is `dd-MM-yyyy HH:MM`; the datepicker stays `yy-mm-dd` | mismatch | `WAR:WEB-INF/classes/ResourceBundle_es.properties:7-8`, `_fr:5-6`, `_it:11-12`, `_pt_br:8-9`; `WAR:js/global.js` | F-003 |
| C-261 / row 160 | Row 160 says history records created/updated | Web create/update/delete write no history | mismatch | `HistorySupport#saveEvent` callers; `#getContainerEvents` | F-002 |
| C-315 / reconnaissance, security configuration | The reconnaissance says "Role constraints are all `*`" | mobile-security.xml lists viewer, editor and admin, and these roles are never evaluated | mismatch | `WAR:WEB-INF/mobile-security.xml:12-14`; `SecurityConfiguration#isAuthorized` has no caller | F-004 |
| C-344 / reconnaissance, file storage | The reconnaissance says storage location was "not determined" | Stored in the database as a Blob | mismatch | `FileSystemImpl#createFile` (`Hibernate.createBlob`, `File.setData`); `File` `@Column(data)` | F-008 |
| C-360, C-361, C-365, C-367, C-368, C-421 | author tool metrics, commands and self-assessment | not legacy claims, or commands I was not permitted to run | not-applicable | reconnaissance Build/Run section, Exit Checklist | E-002 |

All other C-items are matched. Each has the citation-check result and the agreeing A-items or Phase B source read, listed in the ledger.

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 421 | 404 | 10 | 0 | 7 |

Breakdown by direction:
- inventory-to-records: 112 matched, 5 mismatch, 1 not-applicable;
- records-to-source: 292 matched, 5 mismatch, 6 not-applicable.

There are 8 findings, and one finding may affect several checks. The Phase A count of 118 A-items is separate from these totals.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

The ledger maps each independently discovered behavior to its parity-map verdict (C-001..C-118), and each row back to source (C-119..C-297). Workbook facts I confirmed:
- 18 epics and 179 rows, with source status Yes 112, Inferred 48, Partial 18 and No 1;
- all rows red, with columns I:N blank;
- 31 provenance notes;
- all 87 action paths cited.

Return stage for all findings: **Stage 1** (parity-map and reconnaissance defects).

<a id="read-findings"></a>

## Findings

<a id="read-f-001-server-side-permission-enforcement-is-missing-and-unrecorded"></a>

### F-001 - Server-side permission enforcement is missing and unrecorded

- Severity: high
- Comparison check IDs: C-037, C-138
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- **Expected and source:** The records should say which actions enforce permissions on the server.
- **Observed difference:** The generic view, create/edit and delete actions do no server-side permission check, but the records present the permission model as if it were enforced.
  - `ViewObjectAction`, `EditObjectAction` and its subclasses, and `DeleteObjectAction` read, save and delete through `CommonDao` and never call `Authorizer`. The only exceptions are the role parts in `EditRoleAction` and `EditPersonHelper`.
  - The secure repositories (`RepositorySecurityAdapter` behind `metaRepository`) are consumed only by `IntegrationEmailNotifier`.
  - No `@secure` forward exists, so `DispatchForward` never checks.
  - URL role constraints are never evaluated.
  - Effect: any authenticated user can invoke, for example, `/do/delete/project?oid=` or `/do/edit/person` directly. Row 26 describes only UI gating, row 28 claims a not-authorized error, and GAP-007 and the Q3 facts omit this behavior.
- **Evidence:** class symbols above; `WAR:WEB-INF/action-servlet.xml:72-82,196-212,256-260,300-304,352-374`; `WAR:WEB-INF/classes/spring-beans.xml:105-164`. This is inferred from the bytecode call graph and still needs Stage 3 confirmation.
- **Requirement impact:** the authorization epic UF-002; every row that states a permission condition for edit or delete; the Q3 disposition at Stages 4 and 9 (Principle XI).
- **Required action:** Record the server-side enforcement status for each action type; correct row 28; add the behavior to GAP-007 and the Q3 facts.
- **Return stage:** 1

<a id="read-f-002-history-recording-is-overstated"></a>

### F-002 - History recording is overstated

- Severity: medium
- Comparison check IDs: C-261
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** History rows should list only events that are actually written.
- **Observed difference:** Only a few callers write history through `HistorySupport.saveEvent`:
  - the start and close iteration actions;
  - `Continuer`, `MoveContinueStory` and `MoveContinueTaskAction`;
  - `UpdateTimeAction` (the "reestimated" event);
  - SOAP `XPlanner.saveHistory`.

  Web edits and deletes (`EditObjectAction`, `DeleteObjectAction`) write none. The project container view (`getContainerEvents`) shows only created and deleted events, which only SOAP writes.
- **Evidence:** the call graph of `HistorySupport#saveEvent`, and the strings in `HistorySupport#getContainerEvents`.
- **Requirement impact:** UF-011 history; target audit expectations.
- **Required action:** Correct row 160, stating which events each channel writes and marking the claim `Inferred`.
- **Return stage:** 1

<a id="read-f-003-date-formats-differ-by-locale"></a>

### F-003 - Date formats differ by locale

- Severity: low
- Comparison check IDs: C-170
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** Row 62 describes the formats of all shipped bundles.
- **Observed difference:**
  - The es, fr, it and pt_br bundles use `format.date=dd-MM-yyyy`.
  - The es bundle has `format.datetime=dd-MM-yyyy HH:MM`, which uses the month letters for minutes.
  - The client-side datepicker is fixed at `yy-mm-dd` whatever the locale.
- **Evidence:** the bundle lines cited in C-170; `WAR:js/global.js`.
- **Requirement impact:** date entry and display for non-English locales.
- **Required action:** Split or correct row 62 and record the locale dependence and the datepicker conflict.
- **Return stage:** 1

<a id="read-f-004-mobile-role-constraints-are-misdescribed"></a>

### F-004 - Mobile role constraints are misdescribed

- Severity: low
- Comparison check IDs: C-315
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** The security configuration row describes what the descriptors say and whether it is enforced.
- **Observed difference:**
  - The row says "Role constraints are all `*`", but `WAR:WEB-INF/mobile-security.xml:12-14` lists `viewer`, `editor` and `admin`.
  - The row also does not state that constraint roles are never evaluated: `SecurityConfiguration#isAuthorized` has no caller.
- **Evidence:** as stated.
- **Requirement impact:** UF-018 mobile access; the authorization reading.
- **Required action:** Correct the row.
- **Return stage:** 1

<a id="read-f-005-dormant-code-inventory-is-incomplete"></a>

### F-005 - Dormant code inventory is incomplete

- Severity: low
- Comparison check IDs: C-015
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** The reconnaissance records inspected but inactive territory.
- **Observed difference:** Four dormant items are missing:
  - the commented `NullSecurityFilter`, which logs in automatically as default user `sysadmin` (`WAR:WEB-INF/web.xml:76-83`);
  - `net.sf.xplanner.dwr.Project`, which no DWR servlet uses;
  - `com.technoetic.xplanner.webservers.JettyServer#main`;
  - `com.technoetic.xplanner.mail.MissingTimeEntryEmailJob`, which has no trigger.
- **Evidence:** as stated.
- **Requirement impact:** territory completeness; the security note for the commented auto-login.
- **Required action:** Add these to the inventory or exclusion list.
- **Return stage:** 1

<a id="read-f-006-e-mail-stylesheet-http-fetch-is-unrecorded"></a>

### F-006 - E-mail stylesheet HTTP fetch is unrecorded

- Severity: low
- Comparison check IDs: C-106
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** Data And Integrations lists every outbound dependency.
- **Observed difference:** `EmailFormatterImpl#formatEmailEntry` fetches `xplanner.application.url` + `/css/email.css` through `util.HttpClient#getPage`. This is an outbound HTTP dependency, and it relies on the URL mismatch recorded as GAP-008.
- **Evidence:** class symbols.
- **Requirement impact:** UF-013 e-mail appearance and reliability.
- **Required action:** Add the dependency to Data And Integrations and to GAP-008.
- **Return stage:** 1

<a id="read-f-007-permission-filtering-of-search-and-aggregate-timesheet-is-unrecorded"></a>

### F-007 - Permission filtering of search and aggregate timesheet is unrecorded

- Severity: medium
- Comparison check IDs: C-070, C-080
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** Permission branches are recorded as alternative paths.
- **Observed difference:** Two permission branches are missing:
  - Content-search results are filtered by the `read` permission (`ContentSearchHelper#getAuthorizationPredicate` -> `SearchResultAuthorizationPredicate#isResultReadableByUser`).
  - The aggregate timesheet includes only projects the viewer may read (`AggregateTimesheetQuery#getTimesheet`, `system.project` / `read`).

  Rows 142 and 154-158 omit both.
- **Evidence:** class symbols.
- **Requirement impact:** UF-009 and UF-011 visibility rules.
- **Required action:** Add Alternative-path rows.
- **Return stage:** 1

<a id="read-f-008-attachment-storage-left-undetermined"></a>

### F-008 - Attachment storage left undetermined

- Severity: low
- Comparison check IDs: C-344
- **Checklist link:** none: new finding
- **Checklist discrepancy / Required recheck:** not applicable
- **Expected and source:** Unknowns that the source can settle are resolved.
- **Observed difference:** The reconnaissance says it was "not determined" whether attachment bytes are stored in the database or on disk. `FileSystemImpl#createFile` calls `Hibernate.createBlob` and `File.setData`, and `File` maps `@Column(data)` on table `xfile`, so the bytes are stored in the database.
- **Evidence:** class symbols.
- **Requirement impact:** UF-010 data migration planning.
- **Required action:** Update the file-storage row.
- **Return stage:** 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| workbook audit | `npm --prefix analysis/tools run audit:workbook` | pass (exit 0, `WORKBOOK AUDIT OK`, 179 scenarios, 18 epics) | workbook hash unchanged |
| link audit (repository, before the report) | `npm --prefix analysis/tools run audit:artifact-links` | pass (exit 0, 193 documents) | tool output |
| link and readability audit of this report | `audit:artifact-links`; `node analysis/tools/artifact-reading.js --file analysis/reviews/stage-02-pass-001.md` | blocked for the reviewer: the client refused to let the subagent write this file; PM saves it and runs both checks | access log |
| citation resolution and cited-line content (CHK-001 method) | reviewer scripts `check-citations.js`, `check-line-content.js` | pass: 519 citations; 0 real failures | ledger |
| legacy and input integrity | `sha256sum` before and after | pass: unchanged | access log |
| worktree state | `git status --short` in `.migration-tmp/stage-02/phase-a` | pass: empty before and after | access log |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-116 | Undefined form-bean names have no observable behavior: the affected actions read only request parameters | Reviewer applicability judgment, backed by the source | `DeleteObjectAction#doExecute` |
| E-002 | C-360, C-361, C-365, C-367, C-368, C-421 | Author tool metrics, process statements, commands the reviewer was not permitted to run, and the author's self-assessment. None is a legacy-behavior claim. | Packet permitted-operations list | reconnaissance Build/Run section, Exit Checklist |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-008 | this report and the ledger | pending | pending | pending |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** none. CHK-001 was applicable and passed on independent re-check; no F or B item is linked to it.

The result is `findings`. Eight actionable discrepancies were recorded against a complete scope, with 0 not-checked items and 0 blocked scope. The process returns to **Stage 1** for F-001..F-008. There the author follows the [return and correction protocol](README.md#return-and-correction-protocol), records dispositions outside this report and re-runs `audit:workbook`. The next gate is a new, fully blind Stage 2 pass by a new eligible fresh session.

<a id="read-error-prevention"></a>

## Error Prevention

This section is Phase B only. The reviewer opened the checklist at 08:21Z, after the Phase A save.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist SHA-256: `92ccefd8b635ad0563da76acb5363fce46609c5a9a9ace7b0a7d856e69ae591a`
- Author self-check record: [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md#read-error-prevention) (BA-001-02)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; applies because both records cite file:line evidence | passed for new/changed citations (35 citations, 0 failures); older citations checked only for existence | passed: all 519 citations in the rows and the reconnaissance resolve; 243 line citations content-checked with 0 real mismatches; the 126 unnamed citations hand-reviewed against their first line. Covers C-119..C-421. | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** stage-02 pass 001, with the checklist at `92ccefd8…`. CHK-001 was applied to this reviewer's own Phase A citations and passed: 178 ranges resolve and contain the element.
  - Method deviation, disclosed: two Phase A ranges (`login.jsp`, `baseHeader.jsp`) were converted from a multi-file `cat -n` listing. They resolve correctly.
  - The same reviewer made a comment-blind read in Phase A (RC-04). The workbook rule "read the enclosing context" already covers it.
- **Learning update (proposals for the coordinator):**
  - **P-1, from F-001:** "For every permission-gated UI action, trace the handler class from the mapping to its permission call; record UI-only gating separately from server-side enforcement."
  - **P-2, from F-002 and RC-03:** "Before recording a side effect (history, e-mail, audit), confirm that its writer is on the call path of that exact entry point for each channel."
  - **P-3, from F-003:** "For bundle- or locale-dependent behavior, compare all shipped variants, not only the default."
  - No new row is proposed for RC-04, because an existing instruction covers it.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable. Stage 2 does not review the feature dependency graph.

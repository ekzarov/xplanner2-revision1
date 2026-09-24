# Stage 2 Pass 003 Dispositions

**How was each Stage 2 pass 003 finding checked against the legacy source, and what changed in the Stage 1 records?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) creates this correction record on re-entry after a Stage 2 `findings` result.
- **Maintained / decided by:** The Stage 1 author writes it once per triggering pass. The independent Stage 2 reviewer verifies it in a new pass and never edits it. The owner decides only owner-reserved questions (here Q2-Q4, which remain deferred). PM integrates status.
- **Governing instructions:** Stage 1 re-entry ([`analysis/reviews/README.md`](../../reviews/README.md#stage-1-re-entry)) and the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol); Stage 1 in [`analysis/migration_methodology.md`](../../migration_methodology.md#stage-01).
- **When used:** Written after the triggering review and before the next fresh Stage 2 pass. The next reviewer reads it only in Phase B.
- **How used:** One disposition per finding, with source evidence, changed records and rows, checks actually performed, remaining work and responsible actor. The correction status is kept separate from independent verification.
- **Example:** A finding about a query on an unmapped property is accepted, every query string is then checked against the entity mappings, and each defective query is recorded in its row.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Corrections recorded for all 4 findings; not yet independently verified**
>
> The triggering record is [`analysis/reviews/stage-02-pass-003.md`](../../reviews/stage-02-pass-003.md) (result `findings`). All 4 findings were confirmed against the legacy source and accepted, and the sweeps extended F-001, F-002 and F-003:
> - **Query sweep (F-001):** 105 query sources were checked. Besides the iCal feed and SOAP `getCurrentIteration`, SOAP `deleteAttribute` and two jrpdf data sources also query property paths that the entities do not map.
> - **Loader sweep (F-002):** all 55 configuration files were checked. It confirmed that `spring-beans.xml` is loaded twice, and found a third loader that has no caller.
> - **Validator sweep (F-003):** all 17 validators were checked. Two merge branches were added besides the 3 missing keys.
>
> All broken behavior is recorded as observed behavior, not as a parity decision (Q2 deferred).
>
> The parity map moved from 202 to 208 rows: 6 added, 16 changed in content and 8 changed only by renumbered row references. Everything here is the author's correction, and a new fresh blind Stage 2 pass must verify it.
>
> **Next:** PM verifies RESULT BA-001-05 and launches a new fresh Stage 2 pass. Details: [Disposition Summary](#read-disposition-summary) / [Remaining Work And Next Gate](#read-remaining-work-and-next-gate).

<details>
<summary><strong>Contents</strong></summary>

- [Scope And Inputs](#read-scope-and-inputs)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Unmapped query property paths](#read-f-001-unmapped-query-property-paths)
  - [F-002 Second Spring context](#read-f-002-second-spring-context)
  - [F-003 Uncovered validation keys](#read-f-003-uncovered-validation-keys)
  - [F-004 Iteration progress chart](#read-f-004-iteration-progress-chart)
- [Sweeps](#read-sweeps)
- [Changed Rows](#read-changed-rows)
- [Checks Performed](#read-checks-performed)
- [Reviewer Checklist Proposals](#read-reviewer-checklist-proposals)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-scope-and-inputs"></a>

## Scope And Inputs

- **Task:** BA-001-05 (Stage 1 re-entry), role `ba`, mode `author`. It was performed by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, model `claude-opus-5-5`, who also wrote BA-001-01..04. PM assigned it on branch `stage-01/pass-003-corrections`, created from `main` `9a9f432`.
- **Triggering record:** [`analysis/reviews/stage-02-pass-003.md`](../../reviews/stage-02-pass-003.md), SHA-256 `0246765a595775d62e7d10067cc265356c08b8cc2317ae30c5a868ece2bfcc02`, result `findings`. The ledger is [`analysis/reviews/evidence/S02-P003/comparison-results.json`](../../reviews/evidence/S02-P003/comparison-results.json), SHA-256 `4f6b7e35d803ebc781ea1339bee655eedc42a811c273789de90b3195dbd02d9f`. Both were read and not modified.
- **Reviewed versions:** reconnaissance `e4efcd99…` and workbook `73a8e05b…` (202 rows), which is the BA-001-04 result.
- **Earlier correction records:** [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stage-02-pass-001-dispositions.md) and [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](./stage-02-pass-002-dispositions.md). Both are historical, were not edited, and keep their own row numbering.
- **Authority for resolution:** the immutable [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) (SHA-256 `46ff9dc0…4edc`). It is the project's fixed baseline with a known MySQL patch (owner decision `legacy-baseline-provenance:xplanner2-revision1`; P-01..P-07 in the [reconnaissance](../../legacy_reconnaissance.md#read-gap-005-per-conclusion-impact)). `spring-beans.xml`, the file at the centre of F-002, is one of the three rewritten entries (P-05). `web.xml` and `struts-config.xml`, which declare its two loaders, show no rewrite sign (P-06).
- **Not read:** the reviewer scratch areas `.migration-tmp/stage-02*/`, and earlier-migration examples (amendment A2). Every finding was resolved from the legacy source.
- **Method limits:**
  - There was no JDK, decompiler or runtime.
  - The author's own read-only Node tools under `.migration-tmp/stage-01/tools/` were used: the class dump, `disasm.js` (bytecode listings with exception tables), four new sweep scripts, and per-file numbered reads.
  - Whether a Hibernate query fails, or passes a name into SQL, is framework behavior (GAP-011). The affected conclusions are therefore `Inferred` or `Partial` until Stage 3.
- **Checklist:** [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md), SHA-256 `ea8f330956ff82b5bf05a2f62439225c337cb8a7c43d81b2486074bac8e14138` (CHK-001..CHK-007).
- **Owner constraints applied:**
  - Q2, Q3 and Q4 stay deferred.
  - The defective iCal and SOAP queries and the duplicate Spring context are recorded as observed broken behavior and risk. They are not permission to carry that behavior into the new application.
- **Workbook row numbers:** below they use the corrected workbook (BA-001-05 numbering) unless a row is marked "old". One row was inserted after each of the old rows 51, 63, 106, 119, 126 and 140. Old rows 52-63 therefore moved down by 1, old rows 64-106 by 2, old rows 107-119 by 3, old rows 120-126 by 4, old rows 127-140 by 5 and old rows 141-226 by 6.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows (new numbering) | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | medium | accepted, extended | `iCalServlet#generateTimeEntryData`, `#generateTaskData`, `#doGet` (listings); `Task` getters; `XPlanner#getCurrentIteration`, `#getObjects`; `AttributeRepositoryImpl#delete`; `PdfReportExporter$UserStoryDataSource`, `$PersonDataSource` | row 226 (`Yes` to `Partial`); rows 218, 219, 209, 211, 194, 11; reconnaissance persistence row, Runnable Surfaces, GAP-011, GAP-014, Q2 facts | BA (Stage 3); owner via PM (Q2) | not yet |
| F-002 | low | accepted, extended | `WAR:WEB-INF/web.xml:32-38,194-196,227-249`; `WAR:WEB-INF/struts-config.xml:438-441`; `WAR:WEB-INF/classes/spring-beans.xml:60,71-81,362-367`; `MainBeanFactory#createDefaultFactory` | row 65 added (`Inferred`); rows 64, 198, 199; reconnaissance Spring row, job and bootstrap rows, SMTP row, GAP-014, Q2 facts | BA (Stage 3) | not yet |
| F-003 | low | accepted, extended | `ImportForm#validate`; `UserStoryEditorForm#validate`, `MoveContinueStoryForm#validate`, `MoveContinueTaskForm#validate`, `TaskEditorForm#validate` (listings) | rows 52, 123, 131, 146 added; rows 130, 136, 145 | BA (Stage 3, input checks) | not yet |
| F-004 | low | accepted | `WAR:WEB-INF/jsp/view/iterationStatistics.jsp:155-191`; `WAR:WEB-INF/classes/xplanner.properties:66-68` | row 109 added; rows 108, 110, 111; reconnaissance Charts row | none | not yet |

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-unmapped-query-property-paths"></a>

### F-001 Unmapped query property paths

- **Reviewer claim (C-318, C-324):**
  - both iCal queries join on `task.story`, but `Task` maps only `userStory`;
  - SOAP `getCurrentIteration` filters on `object.projectId`, but `Iteration` has no `projectId`;
  - `getNotesForObject` (`attachedTo_Id`) is uncertain.
- **Source check:**
  - **`Task` mappings:** the class dump of `net.sf.xplanner.domain.Task` shows `#getUserStory` (`@ManyToOne`, `@JoinColumn(name="story_id")`) and no getter named `getStory`. The session factory loads only `mappings/Metrics.xml` (`WAR:WEB-INF/classes/spring-beans.xml:77-81`).
  - **iCal call order:** in `iCalServlet#doGet`, `#generateTimeEntryData` runs first, then `#generateTaskData`. Both pass their HQL to `Session.find`. The exception table of `#doGet` routes any `Exception` to a handler that logs "ical error" and calls `HttpServletResponse.sendError` with the exception message. An error response is therefore expected instead of a calendar.
  - **SOAP `getCurrentIteration`:** it passes `object.startDate <= ? and object.endDate >= ? and object.projectId = ?` to `#getObjects`. That method builds `from ` + the domain class name + ` where ` + the condition, and declares no alias (`IterationData` maps to `net.sf.xplanner.domain.Iteration`). `Iteration` maps `project` but no `projectId`. `#getObjects` logs "error loading objects" and rethrows the error. This extends the reviewer's point: the alias `object` is also undeclared.
  - **SOAP `getNotesForObject`:** it uses `attachedTo_Id = <id>`. That is an unqualified column name; `Note` maps `attachedToId` with column `attachedTo_id`. Whether Hibernate passes the name to SQL is recorded under GAP-011.
- **Sweep of all queries (proposal P-1):** `.migration-tmp/stage-01/tools/hql-sweep-05.js` checked 105 query sources:
  - query methods in classes (their string constants joined in order);
  - 17 JSP `useBeans` tags;
  - the named queries in `Metrics.xml`.
  - In total, 387 dotted property paths were checked against an entity model of 21 `@Entity` classes.
  - Beyond the reviewer's two findings, it found:
    - **SOAP `deleteAttribute`:** `AttributeRepositoryImpl#delete` uses `a.targetId` and `a.name`. `Attribute` keeps both in its embedded id: `#getAttributeId` is `@EmbeddedId`, and `#getName` and `#getId` are `@Transient`. The call is therefore expected to fail (row 219).
    - **jrpdf reports:** `PdfReportExporter$UserStoryDataSource` and `$PersonDataSource` use `task.story`. They are on the jrpdf path, which already fails for missing templates (rows 209, 211).
  - The queries on the unmapped `com.technoetic.xplanner.domain.Integration` and on `Feature` were already recorded (GAP-004; the note is added to row 194).
  - Three flagged items are false positives, checked by hand:
    - the string literal `'system.person'` in `Metrics.xml:164-170`;
    - the unqualified `id.sampleTime`, which resolves against the implied entity;
    - scriptlet code inside a `useBeans` attribute of `task.jsp`.
  - The only native SQL is `PersonTimesheetQuery`, run through JDBC. Its 56 table.column references all exist in the Liquibase schema.
  - Unqualified column names are the same kind of case as `getNotesForObject`. The names are `userid` in the login query, `is_hidden`, `attachedTo_id`, `project_id`, `iteration_id`, `story_id`, `targetId` and `name`. Each one matches a mapped column. They are recorded under GAP-011, and row 11 carries a note.
- **Changes:**
  - row 226 is rewritten and moves from `Yes` to `Partial`; rows 227 and 228 (the checks before the queries) stay unchanged;
  - row 218 qualifies `getCurrentIteration` and `getNotesForObject`;
  - row 219 records the `deleteAttribute` defect;
  - rows 209, 211, 194 and 11 carry sweep notes;
  - reconnaissance: the persistence row, the Calendar and SOAP rows under Runnable Surfaces, GAP-011, GAP-014, and 3 new Q2 fact rows.
- **Remaining work:** Stage 3 requests of the iCal feed and of both SOAP calls. Responsible: BA.

<a id="read-f-002-second-spring-context"></a>

### F-002 Second Spring context

- **Reviewer claim (C-025, C-340, C-367):** `spring-beans.xml` is loaded by the root context and again by the Struts `ContextLoaderPlugIn`. The daily job and Liquibase are therefore expected to run twice.
- **Source check:**
  - `WAR:WEB-INF/web.xml:32-38` sets `contextConfigLocation` to `classpath:spring-beans.xml`, and `:194-196` declares `org.springframework.web.context.ContextLoaderListener`.
  - `WAR:WEB-INF/struts-config.xml:438-441` declares `org.springframework.web.struts.ContextLoaderPlugIn` with `/WEB-INF/action-servlet.xml,/WEB-INF/classes/spring-beans.xml,/WEB-INF/test-action-servlet.xml`. The plug-in starts with the Struts servlet (`web.xml:227-249`, `load-on-startup` 2).
  - `spring-beans.xml` imports `spring-caching.xml`, `spring-dao.xml` and `spring-security.xml`. It defines these beans with startup effects:
    - `dataSource` (`:60`);
    - `liquibase` (`:71-75`);
    - `sessionFactory` (`:77-81`);
    - the `task:scheduler` and `task:scheduled` registration of `missingTimeEntryNotifier` (`:362-367`);
    - `authorizerInitializer` in `spring-security.xml:49-50`, which has `init-method` and is not lazy.
  - The Quartz scheduler stays commented out in both contexts.
- **Sweep of all loaders (proposal P-2):** `.migration-tmp/stage-01/tools/loaders-05.js` looked up every one of the 55 configuration files under `WEB-INF` by name, in comment-blanked descriptors and in class strings. Output: `out/loaders-05.txt`.
  - `spring-beans.xml` has a third loader, `com.technoetic.xplanner.util.MainBeanFactory#createDefaultFactory` (an `XmlBeanFactory` of `/spring-beans.xml`). No class references `MainBeanFactory`, which is also in `out/orphans.txt`, so it is dormant.
  - `tiles-definitions.xml` is read by the Struts `TilesPlugin` (`struts-config.xml:430`) and by `spring-web.xml:20`. Each builds its own container, and no duplicate side effect follows.
  - Every other configuration file has one loader, or is found at a framework default location (`server-config.wsdd`, `ehcache.xml`), or is unused. The unused ones are the 16 mapping XMLs other than `Metrics.xml` and the `xplanner-custom-*` variants.
- **Expected effects, `Inferred` and runtime-unverified (row 65):**
  - Liquibase runs twice at startup, and the second run is expected to find every change set applied (row 64).
  - Two schedulers run the reminder job, so reminders and lead reports are expected twice a day (rows 198-199).
  - Two connection pools and two session factories are created, and the Struts action beans are wired from the plug-in context.
  - How a child context behaves when it redefines its parent's beans is framework behavior (GAP-011).
- **Changes:**
  - new row 65;
  - notes on rows 64, 198 and 199;
  - reconnaissance: the Spring row, the Runnable Surfaces job and bootstrap rows, the SMTP row, GAP-014, P-05 (row 65) and a Q2 fact row.
- **Remaining work:** at Stage 3, count the Liquibase runs per startup and the reminder e-mails per day. Responsible: BA.

<a id="read-f-003-uncovered-validation-keys"></a>

### F-003 Uncovered validation keys

- **Reviewer claim (C-169, C-233, C-240, C-430, C-433, C-442):**
  - `import.status.no_import_file` (the people import inherits `ImportForm#validate`) is not covered;
  - `story.editor.same_iteration` on the `merge` path of `UserStoryEditorForm#validate` is not covered;
  - `story.editor.missing_name` in `MoveContinueStoryForm#validate` is not covered;
  - row 140 (old) has a wording point.
- **Source check:**
  - **People import:** `ImportPeopleForm` extends `ImportForm` and has no `validate` of its own. `ImportForm#validate` holds `import.status.no_import_file`. The form bean `import/people` (`WAR:WEB-INF/struts-config.xml:48-49`) is used by `/import/people` (`:329-330`), and the message is at `ResourceBundle.properties:39`.
  - **Story editor:** the bytecode listing of `UserStoryEditorForm#validate` shows two branches:
    - without `merge`: name, estimate and priority are checked;
    - with `merge`: only `story.editor.same_iteration` is checked.
    - The hidden `merge` field occurs only in `moveContinueStory.jsp`, `moveContinueTask.jsp`, `continueUnfinishedStories.jsp` and `task.jsp`, and none of them posts to `/do/edit/userstory`.
  - **Move/continue story:** `MoveContinueStoryForm#validate` checks `story.editor.missing_name` only without `merge`. The move/continue page always posts `merge=true` (`moveContinueStory.jsp:20,24`).
- **Extended:**
  - `MoveContinueTaskForm#validate` has the same two branches (`moveContinueTask.jsp:21,24`).
  - `TaskEditorForm#validate` skips the name and estimate checks when `merge=true`. The task page's complete and reopen buttons post that (`task.jsp:76-79,87-90`).
- **CHK-005 over every validator:** `.migration-tmp/stage-01/tools/chk005-validators-05.js` checked 17 validators (own or inherited `validate`, `valideRow`, `requirePositiveInterval`) and 47 keys. Each key must be covered by an alternative-path row that cites the validator. After the correction, 0 keys are uncovered.
  - Positive control: on the pre-correction rows, the script reports exactly the reviewer's 3 keys.
  - Output: `out/chk005-05.txt`.
- **Changes:**
  - rows 52 (`Yes`), 123, 131 and 146 (`Inferred`) are added;
  - row 130 names its branch;
  - row 145 is reworded and cites its branch;
  - row 136 notes the merge path of the task editor.

<a id="read-f-004-iteration-progress-chart"></a>

### F-004 Iteration progress chart

- **Reviewer claim (C-069, C-221, C-353):** the default-on progress chart and its flag are not recorded.
- **Source check:**
  - `WAR:WEB-INF/jsp/view/iterationStatistics.jsp:155-191` renders `velocityChart2` inside `propertyEqual key="xplanner.effort.chart.progress" value="displayed"`. It uses `DataSampleData` with the aspects `estimatedHours,actualHours` (`:163-165`).
  - The flag is `displayed` (`WAR:WEB-INF/classes/xplanner.properties:67`, a P-03 value).
  - The burn-down chart has its own flag (`:193-228`, `xplanner.effort.chart.burndown=displayed`).
  - The velocity block is `:123-153`. Row 110 cited `:122-196`, which also spanned the other two blocks, so the range was narrowed.
- **Chart and include sweep:** `.migration-tmp/stage-01/tools/jsp-charts-includes-05.js` checked 15 live charts across all JSPs: 9 on the statistics page and 3 on each timesheet page. Each is now named in a row, by id or by description. Of the 42 static include targets, only 2 are uncited: `common/formattingHelpJS.jsp` and `common/header.jsp`. Both are layout fragments that the reconnaissance already lists. Output: `out/jsp-charts-includes-05.txt`.
- **Changes:**
  - row 109 is added (`Yes`);
  - row 108 now names all charts and the flags;
  - row 110's citation range is narrowed;
  - row 111 extends the data-sample dependency to the progress chart;
  - reconnaissance: the Charts row.

<a id="read-sweeps"></a>

## Sweeps

The assignment required these sweeps beyond the cited rows. The row lists use the new numbering.

| Sweep | Scope | Outcome | Rows |
|---|---|---|---|
| Query paths against entity mappings (P-1) | 105 sources, 387 dotted paths, 21 entities; native SQL 56 references | New defects: `deleteAttribute`, 2 jrpdf data sources. Already recorded: `Integration`, `Feature`. False positives: 3. Unqualified column names go to GAP-011 | 11, 194, 209, 211, 218, 219, 226 |
| Loaders of cited wiring files (P-2) | 55 configuration files | `spring-beans.xml` has 2 live loaders and 1 dormant loader; `tiles-definitions.xml` has 2 containers with no duplicate effect | 64, 65, 198, 199 |
| CHK-005 validators | 17 validators, 47 keys | 0 uncovered after the correction; positive control reproduces the 3 reviewer keys | 52, 123, 130, 131, 136, 145, 146 |
| JSP charts and includes | 15 charts, 42 static include targets | Progress chart added; 2 uncited includes are the known layout fragments | 108-111 |

**Checklist re-application to all changed rows:**
- **CHK-001:** see Checks Performed.
- **CHK-002:** no changed row introduces a permission condition. Row 219 keeps its server-side statement, and the new rows 52, 123, 131 and 146 concern validation only.
- **CHK-003:** each new effect cites its path: the `sendError` handler for row 226, the rethrow in `#getObjects` for row 218, the two context loaders for row 65. The dormant loader is recorded as having no caller.
- **CHK-004:** unchanged. The notes that pointed to the date rows were renumbered to rows 68-70.
- **CHK-005:** see the table above.
- **CHK-006:** no delete row changed. `deleteAttribute` removes an attribute value only and is recorded as a failing query.
- **CHK-007:** the reconnaissance figures were regenerated. They are 208 rows, 112 `Yes`, 75 `Inferred`, 20 `Partial` and 1 `No`, 75 `Inferred` in GAP-001, 0 / 208 progress, 68 of 73 JSPs and all 87 action paths. The record was then searched for `202`, `0 / 202`, `71 ` and `111 `. The only remaining hits are row references and line numbers.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff was generated by comparing `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-05.js` with the final row data.

| Change | Rows (new numbering) | Source |
|---|---|---|
| Added (6) | 52 (people import without file), 65 (double Spring context), 109 (progress chart), 123 (story editor merge branch), 131 (move/continue story without merge), 146 (move/continue task without merge) | F-003, F-002, F-004, F-003, F-003, F-003 |
| Status changed | 226 (`Yes` to `Partial`) | F-001 |
| Content changed | 11, 64, 108, 110, 111, 130, 136, 145, 194, 198, 199, 209, 211, 218, 219, 226 | F-001..F-004 and sweeps |
| Renumbered references only | 23, 25, 88, 97, 118, 151, 162, 165 | row insertions |

- The workbook now has 208 rows: 112 `Yes`, 75 `Inferred`, 20 `Partial` and 1 `No`.
- The 31 provenance notes are unchanged. One note is keyed by requirement prefix, so its key was updated to the reworded row 111.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are reported in RESULT BA-001-05. This record lists which checks were run:

- source checks per finding, as described above, using the class dump, `disasm.js` and per-file numbered reads;
- the four sweeps `hql-sweep-05.js`, `loaders-05.js`, `chk005-validators-05.js` (with a positive control) and `jsp-charts-includes-05.js`;
- the row edit `.migration-tmp/stage-01/tools/edit-ba-001-05-rows.js`, which remapped row references before inserting rows and asserts a unique requirement prefix for each edit;
- the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`;
- the reconnaissance remap `remap-rows-05.js` and the text edits `edit-ba-001-05-recon.js` and `-recon-b.js`;
- `npm --prefix analysis/tools run sync:workbook-progress`, then `audit:workbook`, `audit:project` and `audit:artifact-links`;
- `node analysis/tools/artifact-reading.js --file` on the reconnaissance and on this record;
- CHK-001 on all new or changed line citations and row references (`.migration-tmp/stage-01/tools/chk001-ba-001-05.js`);
- a before/after SHA-256 check of [`legacy/`](../../../legacy);
- `audit:workbook:excel`, once after the final workbook write.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1 (from F-001): check every property path in an HQL or criteria string against the getters and annotations of the mapped entity | Yes. Row 226 was `Yes`, and row 218 listed `getCurrentIteration` as working, although both queries use paths the entities do not map. The sweep found two more defective query sites. | F-001 disposition; `out/hql-sweep-05.txt` |
| P-2 (from F-002): list every loader of a configuration file cited as wiring and record the effects of duplicate instantiation | Yes. The records described one context and one scheduled job, but two loaders instantiate `spring-beans.xml`. The sweep also found a dormant third loader. Folding P-2 into CHK-003's applicability, as the reviewer suggests, would cover the same error. | F-002 disposition; `out/loaders-05.txt` |

The reviewer covers F-003 by CHK-005 and F-004 by the workbook rule "enumerate the category". The author agrees and proposes no new check.

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-004 within the Stage 1 static boundary.
- **Independent verification:** **not yet performed.** A new fresh eligible Stage 2 session must run a full blind Phase A. This record and the pass-003 findings are withheld until Phase B. The author's corrections are not a clean verdict.
- **Open for Stage 3 (BA):**
  - an iCal request;
  - SOAP `getCurrentIteration`, `deleteAttribute` and `getNotesForObject`;
  - the unqualified login query (row 11);
  - the Liquibase runs and reminder e-mails per startup and per day;
  - the non-merge validation branches, which are reachable only by direct request;
  - the progress chart;
  - the items carried over from passes 001 and 002.
- **Owner (deferred):**
  - Q2 (Stage 4) now also covers the iCal feed, the two SOAP operations, the jrpdf data sources and the duplicate Spring context.
  - Q3 and Q4 are unchanged.
- **PM:** verify RESULT BA-001-05, integrate status, decide on the reviewer proposals P-1 and P-2, and launch the next Stage 2 pass.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 1 re-entry, BA-001-05.
  - Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `ea8f330956ff82b5bf05a2f62439225c337cb8a7c43d81b2486074bac8e14138`. Applicable checks: CHK-001..CHK-007.
  - **CHK-001** was run mechanically by `.migration-tmp/stage-01/tools/chk001-ba-001-05.js` on every new or changed line citation in the workbook rows, the reconnaissance and this record, and on the row references used in the BA-001-05 text. The count and result are in RESULT BA-001-05.
  - **CHK-002..CHK-007** were applied as described in [Sweeps](#read-sweeps).
  - Pass 003 linked F-003 to CHK-005 and F-002 to CHK-003. Both rechecks were run over all validators and all configuration files, not only over the cited rows.
- **Learning update:** the two reviewer proposals above. No project checklist edit is made by BA.

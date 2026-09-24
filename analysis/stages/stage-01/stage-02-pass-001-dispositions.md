# Stage 2 Pass 001 Dispositions

**How was each Stage 2 pass 001 finding checked against the legacy source, and what changed in the Stage 1 records?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) creates this correction record on re-entry after a Stage 2 `findings` result.
- **Maintained / decided by:** The same Stage 1 author appends dispositions for later corrections of the same scope. The independent Stage 2 reviewer verifies them in a new pass; the reviewer never edits this record. The owner decides only owner-reserved questions (here Q2-Q4, which remain deferred). PM integrates status.
- **Governing instructions:** Stage 1 re-entry ([`analysis/reviews/README.md`](../../reviews/README.md#stage-1-re-entry)) and the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol); Stage 1 in [`analysis/migration_methodology.md`](../../migration_methodology.md#stage-01).
- **When used:** Written after the triggering review and before the next fresh Stage 2 pass. The next reviewer reads it only in Phase B.
- **How used:** One disposition per finding, with source evidence, changed records and rows, checks actually performed, remaining work and responsible actor. The correction status is kept separate from independent verification.
- **Example:** A finding about an overstated side effect is accepted, the row is rewritten from the call graph, and the record points to the rewritten row and the check that supports it.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Corrections recorded for all 8 findings; not yet independently verified**
>
> The triggering record is [`analysis/reviews/stage-02-pass-001.md`](../../reviews/stage-02-pass-001.md) (result `findings`). Each finding was checked against the legacy source: 7 accepted, and F-001 accepted with a narrowed mechanism. The main correction is F-001: generic web view, edit and delete actions do no server-side permission check. This is recorded as observed behavior and risk, not as a requirement and not as permission to carry it into the new application.
>
> The parity map moved from 179 to 193 rows (14 added, 10 changed). The impact sweep found two further defects, AF-01 and AF-02. Everything here is the author's correction, and a new fresh blind Stage 2 pass must verify it.
>
> **Next:** PM verifies RESULT BA-001-03 and launches a new fresh Stage 2 pass. Details: [Disposition Summary](#read-disposition-summary) / [Remaining Work And Next Gate](#read-remaining-work-and-next-gate).

<details>
<summary><strong>Contents</strong></summary>

- [Scope And Inputs](#read-scope-and-inputs)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Server-side permission enforcement](#read-f-001-server-side-permission-enforcement)
  - [F-002 History recording](#read-f-002-history-recording)
  - [F-003 Locale date formats](#read-f-003-locale-date-formats)
  - [F-004 Mobile role constraints](#read-f-004-mobile-role-constraints)
  - [F-005 Dormant code inventory](#read-f-005-dormant-code-inventory)
  - [F-006 E-mail stylesheet HTTP fetch](#read-f-006-e-mail-stylesheet-http-fetch)
  - [F-007 Search and aggregate timesheet filtering](#read-f-007-search-and-aggregate-timesheet-filtering)
  - [F-008 Attachment storage](#read-f-008-attachment-storage)
- [Impact Sweep And Additional Findings](#read-impact-sweep-and-additional-findings)
- [Changed Rows](#read-changed-rows)
- [Checks Performed](#read-checks-performed)
- [Reviewer Checklist Proposals](#read-reviewer-checklist-proposals)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-scope-and-inputs"></a>

## Scope And Inputs

- **Task:** BA-001-03 (Stage 1 re-entry), role `ba`, mode `author`. Performed by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, model `claude-opus-5-5`, the author of BA-001-01 and BA-001-02. Assigned by PM.
- **Triggering record:** [`analysis/reviews/stage-02-pass-001.md`](../../reviews/stage-02-pass-001.md), SHA-256 `73e8fb002fc374f6b82a3c1dda1e51e14f7f91badf0f75bd6a73a2385ccfad85`, result `findings`. The ledger is [`analysis/reviews/evidence/S02-P001/comparison-results.json`](../../reviews/evidence/S02-P001/comparison-results.json), SHA-256 `4e7e2b6e21404aa9e63f037032fe47ea8bf329f17343bef92e0d7c4ca4bae1e1`. Both were read and not modified.
- **Reviewed versions:** reconnaissance `6e831b2f…` and workbook `cb762eae…` (the BA-001-02 result).
- **Authority for resolution:** the immutable [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) (SHA-256 `46ff9dc0…4edc`), the project's fixed baseline with a known MySQL patch (owner decision `legacy-baseline-provenance:xplanner2-revision1`; P-01..P-07 in the [reconnaissance](../../legacy_reconnaissance.md#read-gap-005-per-conclusion-impact)).
- **Not read:** the reviewer scratch area `.migration-tmp/stage-02/`, earlier-migration examples (amendment A2).
- **Method limits:**
  - no JDK or decompiler, and no runtime;
  - the author's own read-only Node tools under `.migration-tmp/stage-01/tools/` were used: the class dump; `authtrace.js`, a static call graph from 138 entry points to authorization, history and event calls; `disasm.js`, a bytecode listing of selected methods; orphan scans;
  - conclusions drawn from bytecode stay `Inferred` until Stage 3.
- **Owner constraints applied:**
  - Q2, Q3 and Q4 stay deferred; nothing is decided about carry-over, fixing or exclusion;
  - insecure legacy behavior, including F-001, is recorded as observed behavior and risk and is not permission to carry it into the new application.
- **Workbook row numbers:** below they refer to the corrected workbook, unless a row is marked "old".

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows (new numbering) | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | high | accepted, mechanism narrowed | `ViewObjectAction#doExecute`, `EditObjectAction#updateObject`, `DeleteObjectAction#doExecute`; `DispatchForward#<init>/#isSecure/#execute` | reconnaissance: Runnable Surfaces enforcement table, security configuration row, GAP-007, Q3 facts; rows 26, 28-32, 148, 168, 201, 208, 216-217 | BA (Stage 3 confirmation); owner (Q3 at Stages 4 and 9) | not yet; next fresh Stage 2 pass |
| F-002 | medium | accepted | callers of `HistorySupport#saveEvent`; `HistorySupport#getContainerEvents` | rows 170 (rewritten; old 160) and 171 (new) | BA (Stage 3) | not yet |
| F-003 | low | accepted | 10 `ResourceBundle*.properties` files; `js/global.js:39` | rows 66-68 (old 62 split) | BA (Stage 3, locale checks) | not yet |
| F-004 | low | accepted | `WAR:WEB-INF/mobile-security.xml:11-15`; `SecurityConfiguration#isAuthorized` has no caller | reconnaissance security configuration row; rows 32, 216 | none | not yet |
| F-005 | low | accepted, extended | `WAR:WEB-INF/web.xml:76-83`; the four named classes; the orphan scan | reconnaissance dormant-code row, Q3 facts, exclusions | none | not yet |
| F-006 | low | accepted | `EmailFormatterImpl#formatEmailEntry` | Data And Integrations; GAP-008; row 185 (new) | BA (Stage 3) | not yet |
| F-007 | medium | accepted | `SearchResultAuthorizationPredicate#isResultReadableByUser`; `AggregateTimesheetQuery#getTimesheet` | rows 151, 164 (new); related 148, 168 (new) | BA (Stage 3) | not yet |
| F-008 | low | accepted | `FileSystemImpl#createFile`; `File` field `data`; `db-changelog.xml:234` | Data And Integrations file storage; row 156 (`Inferred` to `Yes`) | none | not yet |

No finding was rejected and none is blocked.

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-server-side-permission-enforcement"></a>

### F-001 Server-side permission enforcement

- **Reviewer claim (C-037, C-138):**
  - the generic view, edit and delete actions do no server-side permission check;
  - row 28 wrongly claims a not-authorized error;
  - `DispatchForward` never checks, because no `@secure` forward exists;
  - URL role constraints are never evaluated.
- **Source check:**
  - `ViewObjectAction#doExecute` calls `#isSecure` and then only `CommonDao.getById` and `#setDomainContext`. The `authorizationRequired` flag only decides whether the object is loaded; no authorizer is called.
  - `EditObjectAction#updateObject` and `#createObject` call `CommonDao.getById`/`save` and `EventManager.publishUpdateEvent`/`publishCreateEvent`.
  - `DeleteObjectAction#doExecute` calls `CommonDao.getById`/`delete` and `EventManager.publishDeleteEvent`.
  - The static call graph over all 138 entry points (`out/authtrace.json`) reaches no authorization call from any of these, nor from export, import, move/continue, reorder, time, notes, attachments, file manager, integration queue, iteration start/close/continue, notification receivers, role editor, timesheet, ID search, the "me" page or the test/admin utilities, except incidentally inside e-mail recipient or metrics lookups.
  - The only real web gates are:
    - `EditPersonHelper#modifyRoles` / `#isCurrentUserAdminOfProject` (role changes);
    - `DispatchForward`;
    - the result filters of F-007.
  - SOAP checks per object, except the five attribute operations. REST has no check. iCal checks `admin.edit` for another person's calendar.
- **Narrowed with counterevidence:** the bytecode listing of `DispatchForward#isSecure` shows it uses a `@secure` forward when one exists and otherwise returns the field `isAuthorizationRequired`, which `#<init>` sets to `true`.
  - Therefore `DispatchForward` **does** check for every bean that does not switch the flag off. That covers `/do/view/integrations` (`WAR:WEB-INF/action-servlet.xml:390`) and the 7 WAP actions (`WAR:WEB-INF/mobile-struts-config.xml:27-49`, type attribute, no Spring bean).
  - The check requires a `projectId` parameter and `system.project` read permission, otherwise it forwards to `security/notAuthorized` (JSP absent).
  - The flag is switched off for projects, people, settings, dashboard, twiki format and not-authorized (`WAR:WEB-INF/action-servlet.xml:12-14,25-31,327-331,412-418`).
  - For WAP this rests on Spring falling back to the mapping type when no bean exists (framework behavior, GAP-011).
- **URL role constraints:** confirmed. `SecurityConfiguration#isAuthorized` has no caller in any class; the positive control is that `#isSecureRequest` is called from `AbstractSecurityFilter#isSecureRequest`.
- **Changes:**
  - row 26: states that the gating is JSP display only;
  - row 28: rewritten to the DispatchForward-only not-authorized path;
  - new flow "Server-side permission enforcement", rows 29-32;
  - rows 148 and 168 (no read check on personal timesheet and ID jump);
  - row 201 (SOAP per-object checks; attribute operations unchecked);
  - row 208 evidence (no check in the REST services);
  - row 216 evidence and new row 217 (WAP projectId requirement);
  - reconnaissance: an enforcement-by-entry-point table under Runnable Surfaces, the security configuration row, GAP-007 and the Q3 facts.
- **Owner boundary:** this is recorded as observed legacy behavior and risk. It is not a parity requirement and not permission to carry it into the new application. The disposition belongs to Q3 at Stages 4 and 9.
- **Remaining work:** Stage 3 confirmation by direct-URL requests with viewer, editor and admin accounts. Responsible: BA, with PM access handoff.

<a id="read-f-002-history-recording"></a>

### F-002 History recording

- **Reviewer claim (C-261):** row 160 (old numbering) overstates history. Web create, update and delete write none, and the container view shows only created and deleted events.
- **Source check:**
  - The `HistorySupport#saveEvent` callers reachable per entry point are: `StartIterationAction`, `CloseIterationAction`, `MoveContinueStoryAction`, `MoveStoriesAction` and `ContinueUnfinishedStoriesAction` (via `MoveContinueStory` and `Continuer`), `MoveContinueTaskAction`, `UpdateTimeAction#doUpdateEstimateAction` ("reestimated"), and SOAP `XPlanner#addObject`/`#updateObject`/`#removeObject` through `#saveHistory` ("created", "updated", "deleted").
  - There are none from `EditObjectAction` or `DeleteObjectAction`. Their published events have no registered listener: `EmailPerChangeListener` is the only `ApplicationListener` class and has no bean.
  - `HistorySupport#getContainerEvents` restricts the container view to "created" and "deleted".
  - Confirmed.
- **Changes:**
  - row 170 rewritten: the display, and a container view limited to "created" and "deleted", `Yes`;
  - new row 171 listing the writers per channel, `Inferred`.
- **Remaining work:** Stage 3 observation of history after web and SOAP edits. Responsible: BA.

<a id="read-f-003-locale-date-formats"></a>

### F-003 Locale date formats

- **Reviewer claim (C-170):** es, fr, it and pt_br use `dd-MM-yyyy`; the es date-time is `dd-MM-yyyy HH:MM`; the date picker is fixed at `yy-mm-dd`.
- **Source check:**
  - All 10 bundles were compared.
  - `yyyy-MM-dd` in default, `--`, da, de, ja and ru.
  - `dd-MM-yyyy` in `ResourceBundle_es.properties:7-8`, `ResourceBundle_fr.properties:5-6`, `ResourceBundle_it.properties:11-12` and `ResourceBundle_pt_br.properties:8-9`.
  - The Spanish date-time is `dd-MM-yyyy HH:MM`.
  - `WAR:js/global.js:39` fixes `.dateField` to `yy-mm-dd`, and `WAR:WEB-INF/jsp/edit/editIteration.jsp:54,57` combines that picker with the locale calendar.
  - The original row said "same pattern in the shipped bundles checked" after only two bundles had been compared. Confirmed.
- **Changes:** old row 62 is split into rows 66 (ISO locales, `Yes`), 67 (dd-MM-yyyy locales and the Spanish minute pattern, `Yes`) and 68 (picker conflict, `Inferred`).
- **Remaining work:** Stage 3 locale check. Responsible: BA.

<a id="read-f-004-mobile-role-constraints"></a>

### F-004 Mobile role constraints

- **Reviewer claim (C-315):** "Role constraints are all `*`" is wrong for mobile, and the roles are never evaluated.
- **Source check:** `WAR:WEB-INF/mobile-security.xml:11-15` lists `viewer`, `editor` and `admin`. `SecurityConfiguration#isAuthorized` has no caller (see F-001). Confirmed.
- **Changes:** the reconnaissance security configuration row is corrected; rows 32 and 216 are added or amended.
- **Remaining work:** none beyond F-001's Stage 3 check.

<a id="read-f-005-dormant-code-inventory"></a>

### F-005 Dormant code inventory

- **Reviewer claim (C-015):** the commented `NullSecurityFilter` (auto-login as `sysadmin`), `net.sf.xplanner.dwr.Project`, `JettyServer` and `MissingTimeEntryEmailJob` are missing from the inventory.
- **Source check:**
  - `WAR:WEB-INF/web.xml:76-83` is a commented filter block. Class `NullSecurityFilter` carries the strings `defaultUserId` and `sysadmin`.
  - The three classes are referenced only by themselves. There is no DWR servlet or JAR, `jetty-5.1.10.jar` is bundled, and no trigger exists for the e-mail job. Confirmed.
- **Extended:** a mechanical scan (`out/orphans.txt`) lists 70 of 521 top-level classes with no static reference. It is a candidate list, because classes found by component scan, entity scan, `DaoScanner` and JSP wildcard imports appear in it too.
- **Changes:** a new reconnaissance Source Inventory row "Dormant and unreferenced code"; a Q3 fact for the commented auto-login filter; the Parity-Map Boundary exclusion updated. No parity rows, because nothing is active.
- **Remaining work:** none.

<a id="read-f-006-e-mail-stylesheet-http-fetch"></a>

### F-006 E-mail stylesheet HTTP fetch

- **Reviewer claim (C-106):** the e-mail formatter fetches `xplanner.application.url` + `/css/email.css` over HTTP.
- **Source check:** both `EmailFormatterImpl#formatEmailEntry` overloads read `xplanner.application.url`, append `/css/email.css` and call `util.HttpClient#getPage`; the caller is `EmailNotificationSupport`. The effective URL value is `http://localhost:8080/xplanner` (P-04). Confirmed.
- **Changes:** a Data And Integrations row; GAP-008 amended; new row 185.
- **Remaining work:** Stage 3 observation of e-mail with the chosen context path. Responsible: BA.

<a id="read-f-007-search-and-aggregate-timesheet-filtering"></a>

### F-007 Search and aggregate timesheet filtering

- **Reviewer claim (C-070, C-080):** the permission filters of content search and the aggregate timesheet are unrecorded.
- **Source check:**
  - `ContentSearchHelper#search` calls `#excludeResultsBasedOnUserPermissions`, which filters with `SearchResultAuthorizationPredicate#isResultReadableByUser` ("read").
  - `AggregateTimesheetQuery#getTimesheet` calls `Authorizer.hasPermission` with "system.project" and "read".
  - Confirmed.
- **Related occurrences checked:** the personal timesheet (`ViewTimesheetAction`) and the ID jump (`IdSearchAction`) have no such filter.
- **Changes:** new rows 151 (aggregate filter), 164 (search filter), 148 (personal timesheet unfiltered) and 168 (ID jump unfiltered), all `Inferred`.
- **Remaining work:** Stage 3 check with a user lacking read on one project. Responsible: BA.

<a id="read-f-008-attachment-storage"></a>

### F-008 Attachment storage

- **Reviewer claim (C-344):** attachment storage was left undetermined, although the source settles it.
- **Source check:**
  - `EditNoteAction#populateObject` calls `FileSystem.createFile`.
  - `FileSystemImpl#createFile` calls `Hibernate.createBlob` and `File.setData`.
  - `net.sf.xplanner.domain.File` field `data` is `@Lob @Column(name="data")`.
  - `WAR:WEB-INF/classes/db-changelog.xml:234` declares `xfile.data` as `LONGBLOB`.
  - Confirmed: the bytes are stored in the database.
- **Changes:** the Data And Integrations file-storage row; row 156 rewritten and raised from `Inferred` to `Yes`, because annotations and calls are direct evidence.
- **Remaining work:** none.

<a id="read-impact-sweep-and-additional-findings"></a>

## Impact Sweep And Additional Findings

**Impact boundary.** The sweep covered every entry point of every channel: web, WAP, SOAP, REST, iCal and Spring MVC. For each it traced server-side permission checks and side-effect writers (history, events). Two further mechanisms were checked across all action classes:

- hook methods that override nothing and are never called (orphan-hook scan);
- injected dependencies on the traced paths, for the metrics page.

Discovery was expanded only where these mechanisms applied. Nothing else was recreated. The sweep found two defects the reviewer did not report:

| ID | Observation | Evidence | Rows | Status |
|---|---|---|---|---|
| AF-01 | The iteration metrics page is expected to show zero totals and empty developer tables. `ViewIterationMetricsAction#getRepository` returns a null constant, which `IterationMetrics#setIterationRepository` receives. `IterationMetrics#calculateDeveloperMetrics` first loads the iteration through that repository, and `#analyze` catches and logs the failure. | bytecode listings of `ViewIterationMetricsAction#getRepository` and `#doExecute`, and `IterationMetrics#analyze` and `#calculateDeveloperMetrics` | 104, 105 (`Yes` to `Partial`) | `Inferred` from bytecode; Stage 3 confirmation (GAP-014) |
| AF-02 | The project role editor is expected not to save roles. `EditRoleAction#beforeObjectCommit(Object, Session, ActionMapping, ActionForm, HttpServletRequest, HttpServletResponse)` overrides no superclass hook (`AbstractAction#beforeObjectCommit(Identifiable, ActionMapping, ActionForm, HttpServletRequest, HttpServletResponse)`) and has no caller, so its role update and its `admin.edit.role` check never run. | orphan-hook scan over all action classes (this is the only hit); `EditRoleAction` bytecode listing | 35 (still `Partial`; text and evidence changed) | `Inferred`; Stage 3 confirmation (GAP-014) |

Behavior outside these mechanisms was not re-examined, and the earlier first-pass evidence for it is retained. The baseline is not considered unreliable as a whole. The next fresh Stage 2 pass still has to perform a full blind inventory.

<a id="read-changed-rows"></a>

## Changed Rows

Workbook [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) went from 179 to 193 rows. `Source implemented?` values moved from Yes 112 / Inferred 48 / Partial 18 / No 1 to Yes 112 / Inferred 60 / Partial 20 / No 1. All rows stay red, and columns I-N stay blank. The provenance notes (31 rows) were kept; they are now keyed by requirement text, not row number.

| Change | Rows (new numbering) | Source |
|---|---|---|
| Changed in place | 26 (description, evidence), 35 (expected result, evidence), 104 and 105 (status `Yes` to `Partial`), 208 (evidence), 216 (evidence) | F-001, F-004, AF-01, AF-02 |
| Rewritten | 28 (old 28), 66 (old 62), 156 (old 148; `Inferred` to `Yes`), 170 (old 160) | F-001, F-003, F-008, F-002 |
| Added (14) | 29, 30, 31, 32 (server-side enforcement), 67, 68 (dates), 148 (personal timesheet), 151 (aggregate filter), 164 (search filter), 168 (ID jump), 171 (history writers), 185 (e-mail stylesheet), 201 (SOAP checks), 217 (WAP projectId) | F-001, F-003, F-007, F-002, F-006 |

The reconnaissance row references (the GAP-005 impact table and the Q2/Q3/Q4 facts) were remapped mechanically to the new numbering. The old-to-new offsets are in `.migration-tmp/stage-01/tools/remap-rows.js`.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are reported in RESULT BA-001-03. This record lists which checks were run:

- source checks per finding, as described above, using `.migration-tmp/stage-01/tools/authtrace.js`, `disasm.js`, the orphan scans and per-file reads;
- `npm --prefix analysis/tools run sync:workbook-progress`, then `audit:workbook`, `audit:project` and `audit:artifact-links`;
- `node analysis/tools/artifact-reading.js --file` on the reconnaissance and on this record;
- CHK-001 on all new or changed line citations (`.migration-tmp/stage-01/tools/chk001-ba-001-03.js`);
- a before/after SHA-256 check of [`legacy/`](../../../legacy);
- `audit:workbook:excel`, once after the final workbook write.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1 (from F-001): trace each permission-gated UI action's handler to its permission call; record UI-only gating separately | Yes. BA-001-01 recorded JSP gating and a not-authorized error without tracing the handlers. The trace shows no server-side check on generic web actions. | F-001 disposition; `out/authtrace.json` |
| P-2 (from F-002): confirm a side effect's writer is on the call path of that exact entry point per channel | Yes. BA-001-01 listed "created, updated" history for web pages, but no web edit path calls `HistorySupport#saveEvent`. | F-002 disposition |
| P-3 (from F-003): compare all shipped locale variants, not only the default | Yes. BA-001-01 compared two of ten bundles and generalized. | F-003 disposition |

A related author proposal, from AF-01 and AF-02, is also for PM: "Before recording a hook or injected dependency as effective, confirm that the hook overrides a called superclass method and that the injected value is non-null on the entry path." It may overlap P-1 and P-2 in method; PM decides whether to deduplicate.

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-008 within the Stage 1 static boundary.
- **Independent verification:** **not yet performed.** A new fresh eligible Stage 2 session must run a full blind Phase A. This record and the pass-001 findings are withheld until Phase B. The author's corrections are not a clean verdict.
- **Open for Stage 3 (BA):** runtime confirmation of F-001 (direct-URL actions per role), F-002 (history after web and SOAP edits), F-003 (locale dates), F-006 (e-mail styling), F-007 (filters), AF-01 and AF-02 (GAP-014).
- **Owner (deferred):**
  - Q3 (Stages 4 and 9) covers F-001, the SOAP attribute operations, REST and the dormant auto-login filter.
  - Q2 (Stage 4) covers the broken surfaces, now including AF-01 and AF-02.
  - Q4 is unchanged.
- **Link audit side effect (PM, outside BA write scope):** creating this record created the directory [`analysis/stages/stage-01/`](./). As a result, `audit:artifact-links` now flags the plain path reference at [`analysis/reviews/README.md`](../../reviews/README.md) line 315 as not clickable. That process file is read-only for BA. Its bounded link fix, or another PM decision, is needed before the audit can pass.
- **PM:** verify RESULT BA-001-03, integrate status, decide on checklist proposals P-1..P-3 and the related author proposal, and launch the next Stage 2 pass.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 1 re-entry, BA-001-03.
  - Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `92ccefd8b635ad0563da76acb5363fce46609c5a9a9ace7b0a7d856e69ae591a`.
  - CHK-001 is applicable because this record, the reconnaissance and the workbook cite `file:line` evidence. It was checked mechanically on every new or changed citation; the result is in RESULT BA-001-03.
  - No pass-001 finding is linked to a CHK ID. The reviewer's independent CHK-001 recheck passed.
- **Learning update:** the three reviewer proposals and one author proposal above. No project checklist edit is made by BA.

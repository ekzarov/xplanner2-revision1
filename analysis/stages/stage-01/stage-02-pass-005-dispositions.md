# Stage 2 Pass 005 Dispositions

**How was each Stage 2 pass 005 finding checked against the legacy source, which related occurrences were corrected, and what was deliberately retained?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** PM writes the Correction Assignment section before authoring starts, as [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) requires. The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) writes every other section.
- **Maintained / decided by:** The Stage 1 author records the actual result once per triggering pass. PM checks that result against the assignment. The independent Stage 2 reviewer verifies it in a new pass and never edits it. The owner decides only owner-reserved questions.
- **Governing instructions:** Stage 1 re-entry under the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol) and [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff).

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Impact-scoped correction recorded for pass 005 F-001..F-005 and the same-mechanism occurrences; not yet independently verified**
>
> The Stage 1 author validated PM's boundary and corrected all 5 findings. F-003 and F-005 were narrowed. Three mechanism checks were run:
> - **(a) wiring:** 121 handlers and 461 injected properties; 9 needed dependencies are never injected;
> - **(b) request-value flow:** 77 query methods, 71 JSP output hits, 3 cookie writers;
> - **(c) read-path side effects:** 125 read entry points; 1 reaches a write and is expected to fail before it.
>
> 31 rows changed (2 from `Yes` to `Partial`), and no rows were added. No scope expansion was needed. Retained areas are justified by the absence of impact. Nothing here is independently verified.
>
> **Next:** PM checks RESULT BA-001-07 against the assignment; the correction PR, CI and owner merge follow, then a fresh, full, blind Stage 2 pass 006.
>
> **Details:** [Correction Assignment (PM)](#read-correction-assignment-pm) / [Disposition Summary](#read-disposition-summary) / [Same-Mechanism Checks](#read-same-mechanism-checks) / [Retained Work](#read-retained-work).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 People import wiring](#read-f-001-people-import-wiring)
  - [F-002 Aggregate timesheet HQL](#read-f-002-aggregate-timesheet-hql)
  - [F-003 Reflected values, error echo and cookies](#read-f-003-reflected-values-error-echo-and-cookies)
  - [F-004 WAP actions without injection](#read-f-004-wap-actions-without-injection)
  - [F-005 Directory rows on first use](#read-f-005-directory-rows-on-first-use)
- [Same-Mechanism Checks](#read-same-mechanism-checks)
- [Retained Work](#read-retained-work)
- [Scope Expansion](#read-scope-expansion)
- [Credential Handling](#read-credential-handling)
- [Changed Rows](#read-changed-rows)
- [Checks Performed](#read-checks-performed)
- [Reviewer Checklist Proposals](#read-reviewer-checklist-proposals)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-correction-assignment-pm"></a>

## Correction Assignment (PM)

- **Written by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, before authoring started. The Stage 1 author does not rewrite this section; any disagreement goes in the author's own sections.
- **Task:** BA-001-07, `ba` / `author`, Stage 1 re-entry. The branch is `stage-01/pass-005-corrections`, created from `main` at `ca517e5f40aa38adec8c423f67a82855ee708bb7`.
- **Owner confirmation:** `ekzarov`, chat message on 2026-09-25.
  - The boundary is findings F-001..F-005 and occurrences of the same mechanisms.
  - The task corrects existing reconnaissance results; it is not a new reconnaissance of the whole application.
  - Unaffected sections are not reworked; [`legacy/`](../../../legacy) and sealed evidence are not changed; completed work is not repeated.
  - Any retained result is justified by the absence of impact, not by match counts.
  - Any substantial scope expansion is justified and recorded before the work.
  - The next Stage 2 remains a full independent blind pass. Merging a findings PR does not authorize Stage 3.

| Boundary | Assignment |
|---|---|
| Trigger and baseline | [`analysis/reviews/stage-02-pass-005.md`](../../reviews/stage-02-pass-005.md) (SHA-256 `682b996f88d1964018fcd3020a192494a21507a683e45e6abe457e979a10f37f`), with its ledger [`analysis/reviews/evidence/S02-P005/comparison-results.json`](../../reviews/evidence/S02-P005/comparison-results.json). Findings F-001..F-005. The reviewer found CHK-003 failing for F-001, F-004 and F-005. Baseline: [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `09183d11…` and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `fa0ea118…` (210 rows), unchanged at `ca517e5`. Relevant earlier items: none open. The pass 005 reviewer re-verified all 28 earlier findings as resolved. |
| Correction scope | **F-001:** people import `personDao` wiring. Rows 50-51, GAP-012, the Q2 facts and the dormant-code / DaoScanner wording.<br>**F-002:** aggregate timesheet HQL built from posted `selectedPeople`. Row 165, GAP-007 and the Q3 facts.<br>**F-003:** unescaped `fkey` in the task-board script, the parameter and attribute echo on the error/system page, and the lifetime and flags of the remember-me cookies. Rows 15, 55, 56, 114, GAP-007 and the Q3 facts.<br>**F-004:** WAP actions created without Spring injection. Rows 232, 234, the mobile channel row, the Runnable Surfaces row, the Q2 facts and GAP-014.<br>**F-005:** read requests that create directory rows. Rows 172 and 176.<br>**Mandatory same-mechanism checks:**<br>(a) Wiring: every Spring- or Struts-created handler, with each injected property matched to an existing bean of that name or type, including mappings that have no bean.<br>(b) Request-value flow: every HQL or SQL construction site, every JSP or script output of request-derived values, every error or diagnostic echo, and every cookie with its lifetime and flags.<br>(c) Read-path side effects: every view or GET handler that persists.<br>**Exclusions:** no re-reconnaissance of unaffected epics; no runtime; no edits to sealed reviews, evidence or earlier disposition records; no decisions on Q2-Q4; no credential values (A3, CHK-009). |
| Retained work | Rows, sections, identifiers, provenance notes P-01..P-07, owner decisions and the pass 001-004 dispositions outside the correction scope stay at their existing identities. Retention must be justified by **absence of impact**: the mechanism checks (a)-(c) show that the area's inputs and dependencies are not affected by the corrected mechanism. Record that reason for every retained area the checks touch. Match counts from earlier passes are not evidence of absence of impact. Any substantial expansion (a changed input, an unreliable baseline, a systemic omission, or impact that cannot be bounded) must have its trigger, scope and justification recorded here before the expanded work. Owner approval is needed if the expansion changes approved scope. |
| Checks and outcome | For each finding: accepted, narrowed or rejected with evidence, plus the changed items. For each mechanism (a)-(c): an inventory with counts and results. Also run: `audit:workbook`, `audit:project` and `audit:artifact-links`; `artifact-reading.js` on the reconnaissance and on this record; CHK-001..CHK-011, including CHK-007 figure regeneration; the CHK-009 credential scan result; the legacy SHA-256; `audit:workbook:excel` once. Unchanged earlier checks are cited as retained evidence, not as newly run. |
| Next control | A fresh, full, blind Stage 2 pass 006 with a Phase A inventory and a two-way Phase B. It is not a delta review. Before it: the correction PR, required CI and owner merge. The author self-check is not independent closure. PM checks the RESULT against this boundary before accepting it. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-07. The work was done by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`), who also wrote BA-001-01..06. The assignment section above was not edited; its SHA-256 from the `read-correction-assignment-pm` anchor to its last line is `2fc2b5313dfee1ad292b07e00f8c55a23bac8874999c58542a1f539b5a076c13`, both at hand-off and after these sections were appended.
- **Process read before starting:** [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) and [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence).
- **Trigger and baseline validated:**
  - The trigger is [`analysis/reviews/stage-02-pass-005.md`](../../reviews/stage-02-pass-005.md) `682b996f…` and its ledger `2b8f559d…`. Both hashes match.
  - The baseline is the reconnaissance `09183d11…` and the workbook `fa0ea118…` (210 rows). Both match the assignment, at `main` `ca517e5`.
  - The checklist is `7a5683a8…` (CHK-001..CHK-011).
  - The legacy SHA-256 values are unchanged.
  - Every row named in the correction scope has the stated content at these numbers: 15, 50-51, 55-56, 114, 165, 172, 176, 232 and 234.
- **Agreement with the boundary:** the boundary is accepted without change. The source checks below narrow F-005, which is within the finding.
- **No scope expansion was needed.** Mechanism (b) found one repeated pattern: raw request parameters written into 17 pages. Recording every JSP output of request-derived values is part of the assigned mechanism check, so this is not a new category of work. It was bounded to one note on the main row of each page and one Q3 fact. No other epic was re-researched.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | medium | accepted | `WAR:WEB-INF/action-servlet.xml:2,359`; `WAR:WEB-INF/classes/spring-dao.xml:17-57`; `ImportPeopleAction#execute` exception table; `DaoScanner#init` | rows 50-51 (`Yes` to `Partial`); dormant-code row; GAP-012; GAP-014; Q2 facts | BA (Stage 3); owner via PM (Q2) | not yet |
| F-002 | medium | accepted | `AggregateTimesheetQuery#getTimesheet` (listing); `AggregateTimesheetForm#setSelectedPeople` | row 165; GAP-007; Q3 facts | owner via PM (Q3) | not yet |
| F-003 | low | accepted; narrowed for the request listing | `WAR:WEB-INF/jsp/view/dashboard.jsp:132`; `WAR:WEB-INF/jsp/common/unexpectedError.jsp:66,100-121`; `BoxedListTag`; `CookieSupport#createCookie`; `CredentialCookie#set` | rows 15, 55, 56, 114, 119; GAP-007; Q3 facts | owner via PM (Q3) | not yet |
| F-004 | low | accepted | `WAR:WEB-INF/mobile-struts-config.xml:20-49`; `AuthenticationAction#execute`; `DispatchForward#execute` | rows 232, 234; Mobile channel row; Runnable Surfaces; Q2 facts; GAP-014 | BA (Stage 3); owner via PM (Q2) | not yet |
| F-005 | low | accepted, narrowed | `FileSystemImpl#getRootDirectory`, `#getDirectory`; `EditNoteAction#populateObject`; `FileManagerAction#doExecute`; `WAR:WEB-INF/action-servlet.xml:306-309,396` | rows 172, 176; Data And Integrations file storage row; Q2 facts | BA (Stage 3) | not yet |

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-people-import-wiring"></a>

### F-001 People import wiring

- **Source check:**
  - `WAR:WEB-INF/action-servlet.xml:2` sets `default-autowire="byName"`, and the bean `/import/people` (`:359`) has no properties.
  - `ImportPeopleAction#setPersonDao` has no annotation. No Spring file defines a bean named `personDao`: `WAR:WEB-INF/classes/spring-dao.xml:17-57` defines the other nine DAOs. `PersonDaoImpl` has no stereotype annotation, and the only component scans cover `net.sf.xplanner.rest` and `net.sf.xplanner.web`.
  - `DaoScanner#init` calls `ApplicationContext#getBeansOfType(Dao)` and prints the result; it registers nothing.
  - `ImportPeopleAction$1#run` calls `personDao.save`. The exception table of `#execute` catches only `DuplicateUserIdException`, the local `PeopleImportException` and `AuthorizationException`; a `catch any` handler only rethrows.
  - The line-format checks run before the save.
  - The wiring sweep confirms `personDao` as a needed property without a bean. The other injected properties of the bean (`transactionTemplate`, `eventBus`, `commonDao`, `historySupport`) resolve by name.
- **Changes:**
  - row 50 and row 51 move from `Yes` to `Partial`, with the expected outcome marked runtime unverified;
  - the dormant-code row's `DaoScanner` wording is corrected;
  - GAP-012, GAP-014 and a new Q2 fact row are updated.

<a id="read-f-002-aggregate-timesheet-hql"></a>

### F-002 Aggregate timesheet HQL

- **Source check:**
  - The listing of `AggregateTimesheetQuery#getTimesheet` appends each `personIds` element unchanged into `AND person.id IN (`…`)`. It replaces the placeholder `AND 1=1` with `String#replaceAll` and runs `Session.iterate` with only the two dates bound.
  - `ViewAggregateTimesheetAction` passes `AggregateTimesheetForm#getSelectedPeople` to `#setPersonIds`.
- **Added:** the query text is kept in a static field (`putstatic AggregateTimesheetQuery.query`) that each call re-initialises, so concurrent requests may share it (`Inferred`).
- **Changes:**
  - row 165 records the concatenation, without claiming exploitability;
  - GAP-007 and a Q3 fact row are updated.

<a id="read-f-003-reflected-values-error-echo-and-cookies"></a>

### F-003 Reflected values, error echo and cookies

- **Source check:**
  - **Task board:** `WAR:WEB-INF/jsp/view/dashboard.jsp:132` writes `${param.fkey}` into a script string without escaping.
  - **Error page:** `WAR:WEB-INF/jsp/common/unexpectedError.jsp:66` prints the exception message with `<%= message %>`. Lines `:100-121` list the referer, URL, URI, query string, all request parameters and all request attributes. The page is the container error page for every `Throwable` (`WAR:WEB-INF/web.xml:16-29`) and the forward of `/do/systemInfo` (`WAR:WEB-INF/struts-config.xml:160-161`).
  - **Cookies:** `CookieSupport#createCookie` sets max-age 2147483647 and sets neither Secure nor a path. `CredentialCookie#set` stores the user id and the Base64 of the clear password.
- **Narrowed:** `BoxedListTag` HTML-encodes every listed value. `#getStringValue` and `#renderRow` call `StringUtilities#htmlEncode`, including for `String[]` parameter values. The request listing therefore displays parameters, including a password field of the failing request, but does not reflect them unescaped. Only the message line is unescaped.
- **Extended:** the story-import settings cookies use the same helper (row 119).
- **Changes:**
  - rows 114, 55, 56, 15 and 119 carry the facts;
  - GAP-007 and the Q3 facts are updated.

<a id="read-f-004-wap-actions-without-injection"></a>

### F-004 WAP actions without injection

- **Source check:**
  - The seven mappings at `WAR:WEB-INF/mobile-struts-config.xml:20-49` have no bean in any action context, so Struts creates the instances from the `type` attribute. The Spring fallback is framework behavior (GAP-011); it was not re-disassembled here.
  - The wiring impact trace shows that `AuthenticationAction#execute` reads `authenticator` and `DispatchForward#execute` reads `authorizer` on the entry path. Neither has a default in the constructor.
  - The `DispatchForward` authorization flag has a constructor default of true, so row 234's not-authorized outcome without `projectId` stays.
- **Changes:**
  - rows 232 and 234;
  - the Mobile channel row and the Runnable Surfaces WAP row;
  - the Q2 fact row;
  - GAP-014.

<a id="read-f-005-directory-rows-on-first-use"></a>

### F-005 Directory rows on first use

- **Source check:**
  - `FileSystemImpl#getRootDirectory` saves, flushes and refreshes a new root `Directory` when none exists.
  - `FileSystemImpl#getDirectory(String)` calls it and `#createDirectory` for each missing segment.
  - `EditNoteAction#populateObject` calls `getDirectory("/attachments/project/<id>")`, and `/edit/note` receives the file system explicitly (`WAR:WEB-INF/action-servlet.xml:306-309`).
- **Narrowed:** the bean `/view/directory` (`:396`) has no properties. Its `fileSystem` property matches no bean name; the bean is `virtualFileSystem` (`WAR:WEB-INF/classes/spring-beans.xml:263`, P-05). `FileManagerAction#doExecute` reads the field for every action, so the default listing is expected to fail on a null reference before `getRootDirectory` is reached. The listing request therefore does not create a row; the first attachment does.
- **Changes:**
  - row 172 records directory creation on first use;
  - row 176 records that every file-manager operation is expected to fail;
  - the Data And Integrations file storage row and the Q2 fact row are updated.

<a id="read-same-mechanism-checks"></a>

## Same-Mechanism Checks

**(a) Wiring and injected properties.** Tools: `.migration-tmp/stage-01/tools/wiring-07.js` and `wiring-impact-07.js`, which write `out/wiring-07.txt` and `out/wiring-impact-07.txt`.

| Inventory | Count | Result |
|---|---|---|
| Handlers checked | 121: 80 action beans in `action-servlet.xml` and `test-action-servlet.xml`, 34 root beans with an autowire mode, 7 Struts mappings without a bean | complete |
| Injected properties (one-argument setters of the application classes) | 461: 294 by name, 81 explicit, 13 constructor default, 1 by type, 27 scalar or JDK types in by-type beans, 45 without a bean (43 application properties plus 2 `applicationContext`) | see below |
| Properties without a bean that the entry path needs | 9: `personDao` (`/import/people`), `fileSystem` (`/view/directory`), `authenticator` (`/mobile/login`), `authorizer` (six WAP views) | corrected: rows 50-51, 176, 232, 234 |
| Properties without a bean, with no effect | 34 plus 2: `type` of 12 actions (unused on the path, or the `/view/history` request fallback in `AbstractAction#getObjectType`); the `DispatchForward` authorization flag (constructor default true); runtime setters of prototype helpers (`Continuer#init` for session, user, link formatter and message resources; `IterationOptionsTag`; SOAP callers); `IntegrationAction` listeners (filled by `#init`) and `beanFactory` (`BeanFactoryAware`); `SystemInfo.servletContext` (`ServletContextAware`); `applicationContext` of `eventBus` and `loginModuleLoader` (Spring resolvable dependency); `dataSampler.hibernateOperations` (used only when auto-extend is on) | retained; row 205 records the disabled-flag case |
| Explicit references to undefined beans | 1 (`SpreadsheetStoryImporter`, resolved through the class-name alias Spring registers for the unnamed bean at `spring-beans.xml:233`) | no effect |

**(b) Request-value flow.** Tools: `query-sinks-07.js`, `request-echo-07.js` and the per-page list `reflections-07.txt`.

| Inventory | Count | Result |
|---|---|---|
| Methods that execute a query | 77; 47 build text at runtime; 16 append non-constant text | request-derived: `AggregateTimesheetQuery` (F-002). The other 15: ids and class names, logs, iCal output text, SOAP fragments with integers, or tools that no web path reaches (`TransformingSchemaExport`, `TomcatUserImporter`, `BootstrapSystemUser`) |
| JSP query text from request values | 2 useBeans where clauses | `task.jsp:101-103` (already a Q3 fact); `notes.jsp:13-15` (new, row 169) |
| Native SQL | 1 class (`PersonTimesheetQuery`, prepared statements) | parameters bound (retained from BA-001-05) |
| Request values in JSP output | 71 hits in 74 files | reflected unescaped: 17 edit and confirmation pages (hidden inputs and scriptlet output), `dashboard.jsp:132`, `generalError.jsp:26` (rows 35, 43, 50, 57, 78, 88, 98, 102, 114, 115, 121, 129, 134, 144, 149, 161, 169, 194, 196). No effect: values parsed as integers (`editRoles.jsp:30`, `editTimeEntries.jsp:15`, `editTaskEstimate.jsp:27`, WAP pages), values bound as query parameters (`integrations.jsp:26,32,160`), `jsp:param` constants of included fragments, the unreachable `wap/auth.jsp` (excluded since BA-001-01), and one comparison (`viewLayoutNew.jsp:15`, noted on row 192) |
| Error and diagnostic echo | 2 pages | `unexpectedError.jsp` (message unescaped; listing encoded; rows 55-56); `generalError.jsp` (raw `oid` in the not-found message, row 57) |
| Cookies | 3 writers | `CredentialCookie` and `ImportStoriesAction` through `CookieSupport#createCookie` (68 years, no Secure, no path; rows 15, 119). The functions in `toggle.js` have no caller in any JSP. The `wap/auth.jsp` test cookie is unreachable |
| Other request-value sinks | 1 | the `@type` request parameter selects the class loaded by `Class.forName` in `AbstractAction#getObjectType` (generic views). Recorded here only; no row claims otherwise |

**(c) Read-path side effects.** Tool: `persist-trace-07.js`, which writes `out/persist-trace-07.txt`.

| Inventory | Count | Result |
|---|---|---|
| Read entry points traced to persistence calls | 125: 41 web, 6 WAP, 20 SOAP `get*`, 3 REST, 1 iCal, 2 Spring MVC, 52 JSP tag handler methods | 1 reaches a write: `/do/view/directory`, which is expected to fail before it (F-005, row 176) |
| First-use writes outside read paths | 1: `EditNoteAction#populateObject` creates directory rows | row 172 |
| Filter-level writes | `HibernateSessionFilter#doFilter` sets the session and neither flushes nor commits | no effect on read paths |

<a id="read-retained-work"></a>

## Retained Work

Each retained area below was touched by a mechanism check. It is retained because the check shows that its inputs and dependencies are not affected by the corrected mechanism, not because an earlier pass matched it.

| Retained area | Mechanism | Absence-of-impact reason |
|---|---|---|
| The other 71 action beans and their rows | (a) | Every property their `execute` path reads resolves to a bean by name or explicitly, or has a constructor default or request fallback; the wiring inputs (bean names in the four context files) are the same ones read for the corrected rows. |
| Row 65 (double Spring context) and the Spring row | (a) | The corrected defects concern single beans' properties; both loaders see the same bean names, so the missing names are missing in both contexts and the double-load conclusion is unaffected. |
| Rows 28, 186 and the DispatchForward-based views | (a) | `authorizer` is injected by name into every `action-servlet.xml` DispatchForward bean; only the Struts-created WAP instances lack it. `/view/history` resolves `type` from `@type`. |
| Query rows and CHK-008 results of BA-001-05 (rows 11, 211, 213, 218, 219, 226) | (b) | Their defects are property paths; the request-value check found bound parameters or integers in those queries, so no request value reaches their text. |
| Row 143 (`task.jsp` time log) and its Q3 fact | (b) | Already records the same concatenation; nothing in its input changed. |
| Rows of pages that parse request values as integers, bind them, or read `jsp:param` constants | (b) | No raw request string reaches the output. |
| Unauthenticated-surface list of BA-001-06 (CHK-011) and rows 9, 18, 73 | (b) | Filter mappings and web-root files are unchanged. The error page can also render for unauthenticated failing requests, but it lists only that request's own values, which are already recorded on rows 55-56. |
| All view, SOAP `get*`, REST, iCal and tag rows | (c) | The trace reaches no persistence call from them. |
| Provenance notes P-01..P-07 and the 31 row notes | (a)-(c) | No finding changes a patched value; P-05 is cited for the `virtualFileSystem` bean name only. |
| Owner decisions Q1-Q4 and the pass 001-004 records | none | Not inputs of the corrected mechanisms; unchanged. |

<a id="read-scope-expansion"></a>

## Scope Expansion

None. The repeated reflection pattern falls under mechanism (b), which the assignment requires ("every JSP or script output of request-derived values"). It was recorded before editing, in Scope Validation, and bounded to one row note per page plus one Q3 fact.

<a id="read-credential-handling"></a>

## Credential Handling

- **Rule:** under [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence), A3 and CHK-009, no password, key, token or login pair is written in any record, row, script or scratch output. The cookie and error-page facts describe behavior and cite locations only.
- **Scan:** `.migration-tmp/stage-01/tools/chk009-scan-07.js` extracted, in memory, the credential values found in the permitted sources and searched for them in the changed records, this record, the workbook cells and every scratch file changed in BA-001-07. The script contains no values and prints categories, file names and counts only. As a positive control, each source must be hit by its own pattern.
- **Result:** reported as a hit count in RESULT BA-001-07.
- **Limitation:** a changed or encoded value would not be found.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff was generated by comparing `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-07.js` with the final row data. No rows were added or removed, so no row numbers changed.

| Change | Rows | Source |
|---|---|---|
| Status changed | 50, 51 (`Yes` to `Partial`) | F-001 |
| Findings | 15, 50, 51, 55, 56, 114, 119, 165, 172, 176, 232, 234 | F-001..F-005 |
| Mechanism occurrences | 35, 43, 57, 78, 88, 98, 102, 115, 121, 129, 134, 144, 149, 161, 169, 192, 194, 196, 205 | (a)-(c) |

- In total, 31 rows changed.
- The workbook has 210 rows: 111 `Yes`, 77 `Inferred`, 21 `Partial` and 1 `No`.
- The 31 provenance notes are unchanged.
- **Reconnaissance sections changed:**
  - reading block and Scope;
  - Source Inventory: dormant-code row, Spring row (injected-property inventory), Mobile channel row;
  - Runnable Surfaces: WAP row;
  - Data And Integrations: file storage row;
  - Build, Run, And Test Evidence: tool rows and the final-build figure;
  - GAP-007, GAP-012, GAP-014;
  - Q2 facts (file manager, people import, WAP) and Q3 facts (cookies, note-list HQL, aggregate HQL, reflected values, error page);
  - Parity-Map Boundary statuses, Return Correction rows, Exit Checklist, Error Prevention.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are in RESULT BA-001-07.

- **Run in BA-001-07:**
  - the source checks and inventories above;
  - the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`;
  - `sync:workbook-progress`, `audit:workbook`, `audit:project` and `audit:artifact-links`;
  - `artifact-reading.js` on the reconnaissance and on this record;
  - CHK-001 with `.migration-tmp/stage-01/tools/chk001-ba-001-07.js`, on new and changed citations and row references;
  - CHK-007 figure regeneration and a search for superseded figures;
  - the CHK-009 scan;
  - the legacy SHA-256;
  - `audit:workbook:excel`, once after the final write.
- **Retained, not rerun:**
  - the BA-001-06 inventories for CHK-010 (tag-added parameters) and CHK-011 (unauthenticated surfaces), whose inputs are unchanged;
  - the BA-001-05 CHK-005 validator sweep and the CHK-008 query-path sweep, whose inputs are unchanged;
  - the BA-001-04 CHK-002, CHK-004 and CHK-006 sweeps, which no changed row affects.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1: refine CHK-003 so that every injected property has a wiring bean, including mappings without a bean | Yes. Rows 50-51 (people import), 232 and 234 (WAP) described working behavior although a needed dependency is never injected. The same check found a third case, the file manager (row 176). | Mechanism (a) inventory |
| P-2: trace request-derived values to HQL/SQL, unescaped output, error pages and cookies | Yes. The aggregate timesheet HQL, the task-board script, the error-page echo and the cookie lifetime were unrecorded. The same check found the note-list HQL, 17 pages with reflected parameters and the not-found message. | Mechanism (b) inventory |

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-005 and the related occurrences within the static boundary.
- **Independent verification:** not yet performed. The next control is the fresh, full, blind Stage 2 pass 006 named in the assignment.
- **Open for Stage 3 (BA):**
  - a people import with one valid line;
  - a file-manager request;
  - a WAP login and a WAP view with a `projectId`;
  - the first attachment of a project;
  - the task board with a crafted `fkey`;
  - an error page for a failing request;
  - the cookie attributes the container sends.
- **Owner (deferred):**
  - Q2 now also covers the people import, the file manager and the WAP null dependencies.
  - Q3 now also covers the request-value facts.
  - Q4 is unchanged.
- **Questions for PM:** none.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check, BA-001-07:** checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `7a5683a8e0411f7d748ffc873fae2ec590ce0138a77a313fb92df4837553694d`. Applicable checks are CHK-001..CHK-011.
  - **CHK-001:** run by `chk001-ba-001-07.js`.
  - **CHK-002:** no permission condition changed.
  - **CHK-003:** applied through mechanisms (a) and (c), including injected properties.
  - **CHK-004:** no locale-dependent statement changed.
  - **CHK-005, CHK-006 and CHK-008:** unchanged inputs; their results are retained.
  - **CHK-007:** figures regenerated.
  - **CHK-009:** scanned; see Credential Handling.
  - **CHK-010:** no link-parameter claim changed.
  - **CHK-011:** retained, with the error-page note under Retained Work.
  - The pass-005 links (CHK-003 for F-001, F-004 and F-005) were rechecked over all handlers and all read entry points.
- **Learning update:** reviewer proposals P-1 and P-2 above. No project checklist edit is made by BA.

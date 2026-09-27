# Stage 2 Pass 006 Dispositions

**How was each Stage 2 pass 006 finding checked against the legacy source, which related occurrences were corrected, and what was deliberately retained?**

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
> **Impact-scoped correction recorded for pass 006 F-001..F-004 and the related occurrences; not yet independently verified**
>
> The Stage 1 author validated PM's boundary and corrected all 4 findings. F-001 and F-002 were extended within the findings. Four related-occurrence checks were run:
> - **(d) request-to-object binding:** 190 entry points; 10 web entry points bind request parameters onto an object with `merge=true`;
> - **(e) request-selected navigation:** 22 redirect sites and 2 view-name methods; 13 methods redirect to the unvalidated `returnto` value;
> - **(f) export content:** 9 channels; the XML, MPX and MSPDI exports contain every person;
> - **(g) `.properties` figures:** 114 entries and 106 distinct keys; 42 without a consumer; the other bundle figures confirmed.
>
> 26 rows changed, no status changed and no rows were added. No scope expansion was needed. Retained areas are justified by the absence of impact. Nothing here is independently verified.
>
> **Next:** PM checks RESULT BA-001-08 against the assignment; the correction PR, CI and owner merge follow, then Stage 2 `correction-validation` by a new independent BA.
>
> **Details:** [Correction Assignment (PM)](#read-correction-assignment-pm) / [Disposition Summary](#read-disposition-summary) / [Related-Occurrence Checks](#read-related-occurrence-checks) / [Changed Rows](#read-changed-rows).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Merge requests bind request parameters](#read-f-001-merge-requests-bind-request-parameters)
  - [F-002 Request-selected redirects and views](#read-f-002-request-selected-redirects-and-views)
  - [F-003 Exports contain every person](#read-f-003-exports-contain-every-person)
  - [F-004 Configuration-key figures](#read-f-004-configuration-key-figures)
- [Related-Occurrence Checks](#read-related-occurrence-checks)
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
- **Task:** BA-001-08, `ba` / `author`, Stage 1 re-entry. The branch is `stage-01/pass-006-corrections`, created from `main` at `832b5f43ad6302fdcbd00890efc5cef2eb5eebb1`, after PR #18 (process version Starter `c7d0188`).
- **Owner confirmation:** `ekzarov`, chat message on 2026-09-27.
  - The boundary is findings F-001..F-004 and justifiably related occurrences.
  - The task corrects existing reconnaissance results; it is not a new reconnaissance of the whole application.
  - Existing identifiers are kept; [`legacy/`](../../../legacy), sealed reviews, evidence and earlier disposition records are not changed.
  - The next control is Stage 2 `correction-validation` by a new independent BA session that did not author these corrections. That reviewer decides for itself whether pass 006 is admissible as a baseline.
  - Merging the correction PR does not authorize Stage 3.

| Boundary | Assignment |
|---|---|
| Trigger and baseline | [`analysis/reviews/stage-02-pass-006.md`](../../reviews/stage-02-pass-006.md) (SHA-256 `ee71a38f8fa27b46f7c50b2db7e8840e256a9da597d160d448546f576adcff67`), with its ledger [`analysis/reviews/evidence/S02-P006/comparison-results.json`](../../reviews/evidence/S02-P006/comparison-results.json) (`a205b9b5d697bb44a4322aad3a35f79e70bb825480f7dac69276d7a1e994702c`). Findings F-001 (medium), F-002, F-003, F-004 (low). The reviewer found CHK-012 failing for F-001 and F-002, and CHK-007 failing for F-004. Checklist proposals P-1 (refine CHK-012) and P-2 (refine CHK-007). Baseline: [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `0536f24379fabf00f8a47b53ae3089c7b0d0fbc68021c1de7140a76f95c7d332` and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `a87c838342b94e04cab72c9bd2144d86e40d24ef8da2836adf538ea036f56f99` (210 rows), unchanged at `832b5f4`. Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) `0115d8ca4422b2a3ae319734cf3dbc274f5e8ae57b05175384667a07e5b79183` (CHK-001..CHK-012). Legacy package [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`. Relevant earlier items: none open. The pass 006 reviewer found all 33 earlier findings resolved. |
| Correction scope | **F-001:** `merge=true` in `EditObjectAction#populateObject` binds every request parameter onto the loaded object and skips the form copy, the many-to-one resolution and the story/task validators. Rows 124, 129, 137, 140, GAP-007 and the Q3 facts. The generic editor rows 43, 46, 59, 78, 81, 88, 90, 121, 125, 134, 139, 169 and 173 share the mechanism: one note per main row, or one Q3 fact with a row list.<br>**F-002:** redirect targets built from the `returnto` request value, and the `CommonObjectHandler` view name taken from the `{objectType}` path variable. GAP-007, the Q3 facts, row 60 and the rows that describe a `returnto` redirect.<br>**F-003:** the XML, MPX and MSPDI exports contain every person of the system. Rows 209-210 and the Data And Integrations export row.<br>**F-004:** configuration-key figures. Reconnaissance line 171 (Source Inventory, Configuration) and line 291 (Build, Run, And Test Evidence, config consumers): expected 114 lines and 106 distinct keys; the "42 without a consumer" result is to be confirmed.<br>**Mandatory related-occurrence checks:**<br>(d) Request-to-object binding: every place where request data is copied onto domain or persistent objects by a framework or reflection helper (`RequestUtils.populate`, `BeanUtils.populate`/`copyProperties` from request-derived maps, Spring data binding, OGNL or similar). Record location, reachable entry points, whether the property set is restricted, and which validation is skipped.<br>(e) Request-selected navigation: every `ActionForward`, `sendRedirect`, `RedirectView` or view/template name built from a request value, header or path variable. Record whether the target is validated and its reach.<br>(f) Export content: for every export and report channel (rows 209-213 and any other download), which entity sets are written beyond the selected project or iteration, in particular person data. Record the included and hidden fields as far as statically determinable.<br>(g) Figures from configuration and resource files: regenerate every count in the reconnaissance that was derived from `.properties` files with a format-aware parser (continuation lines, bracketed and escaped keys), with a positive control for a known unusual key.<br>**Exclusions:** no re-reconnaissance of unaffected epics; no runtime; no edits to sealed reviews, evidence or earlier disposition records; no decisions on Q2-Q4 (Q3 stays deferred: record observed behavior only); no credential values (A3, CHK-009). |
| Retained work | Rows, sections, identifiers, provenance notes P-01..P-07, owner decisions and the pass 001-005 dispositions outside the correction scope stay at their existing identities. Retention must be justified by **absence of impact**: checks (d)-(g) show that the area's inputs and dependencies are not affected by the corrected mechanism. Record that reason for every retained area the checks touch. Match counts from earlier passes are not evidence of absence of impact. Any substantial expansion (a changed input, an unreliable baseline, a systemic omission, or impact that cannot be bounded) must have its trigger, scope and justification recorded here before the expanded work, and PM must be told at once: such a trigger may also require a full-blind Stage 2 instead of correction-validation. Owner approval is needed if the expansion changes approved scope. |
| Checks and outcome | For each finding: accepted, narrowed or rejected with source evidence, plus the changed items. For each check (d)-(g): an inventory with counts and results. Also run: `audit:workbook`, `audit:project` and `audit:artifact-links`; `artifact-reading.js` on the reconnaissance and on this record; CHK-001..CHK-012, including CHK-007 figure regeneration; the CHK-009 credential scan result (hit count only); the legacy SHA-256; `audit:workbook:excel` once. For proposals P-1 and P-2, state whether the underlying findings are confirmed, so that PM can decide their admission. Unchanged earlier checks are cited as retained evidence, not as newly run. List every changed row and reconnaissance section, so that the next reviewer can regenerate the complete change set. |
| Next control | Stage 2 `correction-validation` under [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation), by a new independent BA session that did not author these corrections, with pass 006 proposed as the candidate baseline. The reviewer validates eligibility itself and may require a full-blind pass. Before it: the correction PR, required CI and owner merge. The author self-check is not independent closure. PM checks the RESULT against this boundary before accepting it. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-08. The work was done by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`), who also wrote BA-001-01..07. The skill file `.agents/skills/migration-ba/SKILL.md` has git blob `d09ba8ced6616dc34fb30a9f2ecde6ab9c3a5398`, which matches the value PM gave.
- **Assignment section unchanged:** the section above was not edited. Its SHA-256, taken over the 7238 characters from the `read-correction-assignment-pm` anchor to its last line, is `6ffb8be6a8b8302cfe4a5e7d655da658119c37bd6f1a1045b524278477c5f783`. The value was the same at hand-off and after these sections were appended.
- **Process read before starting:** [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff), [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation) and [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence).
- **Trigger and baseline validated:**
  - The trigger is [`analysis/reviews/stage-02-pass-006.md`](../../reviews/stage-02-pass-006.md) `ee71a38f…` and its ledger `a205b9b5…`. Both hashes match.
  - The baseline is the reconnaissance `0536f243…` and the workbook `a87c8383…` (210 rows). Both match the assignment and equal the committed files at `832b5f4`.
  - The checklist is `0115d8ca…` (CHK-001..CHK-012).
  - The legacy SHA-256 values are unchanged.
  - Every row named in the correction scope has the stated content at these numbers: 43, 46, 59, 60, 62, 78, 81, 88, 90, 121, 124, 125, 129, 134, 137, 139, 140, 169, 173, 209 and 210.
- **Agreement with the boundary:** the boundary is accepted. The checks extend it in four places, and each extension is part of a finding or of a mandatory check:
  - F-001 also reaches row 141 (reopen) and `/do/edit/roles` (row 35).
  - F-002 covers 13 methods in 12 classes, against the reviewer's lower bound of 11 methods in 10 classes. `CloseIterationAction` is recorded separately: it has a fixed target and puts `returnto` into the query.
  - The Source Inventory Spring MVC row and the Runnable Surfaces settings row repeat the "views unknown" statement of row 60.
  - Check (g) found that the public-page key figure (41) did not match its cited tool output (39). The difference is the 2 scriptlet-selected keys; the figure is kept and its derivation is now stated.
  - No other epic was re-researched.
- **Baseline admissibility:** nothing found here makes the pass-006 baseline unreliable. The corrected items are local statements; no input file changed; and no check found a systemic omission outside the four sink kinds. The Stage 2 reviewer decides admissibility.
- **Tool limitation found and corrected before use:** the BA-001-07 call-graph tracer did not follow overrides that call their parent (`super`) method. `binding-trace-08.js` and the regression copy `persist-trace-08.js` now also follow a call on an ancestor class as a possible `super` call. This over-approximation adds one false positive, `/do/import/stories`: `ImportStoriesAction#populateObject` does not call the parent. It was removed by hand. The regression run repeats the BA-001-07 mechanism (c) result unchanged.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | medium | accepted, extended (row 141, `/do/edit/roles`) | `EditObjectAction#populateObject` (listing); `EditTaskAction#populateObject`, `EditNoteAction#populateObject`, `EditProjectAction#saveForm`, `MoveContinueStoryAction#saveForm`; `WAR:WEB-INF/jsp/view/task.jsp:76-83,87-94`; `WAR:WEB-INF/jsp/edit/moveContinueStory.jsp:20-28` | rows 35, 43, 46, 59, 78, 81, 88, 90, 121, 124, 125, 129, 134, 137, 139, 140, 141, 169, 173; GAP-007; Q3 facts | owner via PM (Q3); BA (Stage 3 reachability) | not yet |
| F-002 | low | accepted, extended (13 methods in 12 classes; the `CloseIterationAction` query) | listings of the 13 methods and `CloseIterationAction#doExecute`; `RequestProcessor#processForwardConfig` in `WAR:WEB-INF/lib/struts-1.2.9.jar`; `CommonObjectHandler#list`, `#edit`; `WAR:WEB-INF/classes/spring-web.xml:26-30` | rows 43, 46, 58, 60, 62, 78, 88, 101, 121, 134, 149; Source Inventory Spring MVC row; Runnable Surfaces settings row; GAP-007; Q3 facts | owner via PM (Q3) | not yet |
| F-003 | low | accepted | `XmlExporter#export`, `#configureBindings`; `MpxExporter#export`, `MspdiExporter#export`, `MpxExporter$ResourceRegistry#<init>` | rows 209, 210; Data And Integrations export row | owner and Architect at Stage 9 (personal data) | not yet |
| F-004 | low | accepted; "42 without a consumer" confirmed | `WAR:WEB-INF/classes/xplanner.properties:162-164`; `LoginModuleLoader` constants `xplanner.security.login[{0}].module`, `.name`, `.option.` | Source Inventory Configuration row; Build, Run, And Test Evidence config-consumers row and new tool rows | none | not yet |

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-merge-requests-bind-request-parameters"></a>

### F-001 Merge requests bind request parameters

- **Source check:** the bytecode listing of `EditObjectAction#populateObject` compares the `merge` request parameter with `"true"`.
  - If it matches, the method calls `org.apache.struts.util.RequestUtils.populate(domainObject, request)` and returns. `#copyProperties` (form to object) and `#populateManyToOneRelationships` are skipped.
  - Otherwise it copies the form and resolves the many-to-one references.
- **Who calls it:**
  - `EditObjectAction#createObject` and `#updateObject`;
  - `EditProjectAction#saveForm`;
  - `MoveContinueStoryAction#saveForm`;
  - the overrides `EditTaskAction#populateObject` and `EditNoteAction#populateObject`, which call the parent method.
- **Exception:** `ImportStoriesAction#populateObject` overrides the method without calling the parent, so `/do/import/stories` does not bind the request.
- **Reach:** 10 web entry points. The set of bound properties is not restricted.
  - The story and task validators skip their name, estimate and priority checks when `merge=true` (rows 124, 137).
  - For a person, the settable properties include the stored password digest (`Person#setPassword`); `EditPersonAction#beforeObjectCommit` still reads the new-password fields from the form. This effect is `Inferred`.
  - Nested property names are resolved by commons-beanutils (framework behavior, GAP-011).
- **Pages that post `merge=true`:** 4.
  - `task.jsp` (complete and reopen) and `moveContinueStory.jsp` reach the binding.
  - `moveContinueTask.jsp` and `continueUnfinishedStories.jsp` post it to actions that do not call `#populateObject`.
- **Correction:**
  - Rows 124, 129, 137, 140 and 141 describe the binding.
  - Row 43 (person), 59 (setting), 78 (project), 88 (iteration), 121 (story), 134 (task) and 169 (note) each carry one full binding note. Their edit rows 46, 81, 90, 125, 139 and 173 point to it.
  - Row 35 records `/do/edit/roles`, whose action type is `Project`.
  - GAP-007 and one Q3 fact list the entry points and rows.
- **Not changed:** row 194 (feature editor). The binding is on its static path, but the row already expects the editor to fail at runtime, because the type class `net.sf.xplanner.domain.Feature` is absent. The Q3 fact names it.

<a id="read-f-002-request-selected-redirects-and-views"></a>

### F-002 Request-selected redirects and views

- **Source check:** 19 `new ActionForward(String, true)` sites, 1 `ActionForward#setPath` site and 2 `sendRedirect` callers were classified (check (e)).
  - **Open redirects:** 13 methods in 12 classes redirect to the `returnto` value unchanged: `ChangeLocaleAction#execute`, `CommandExecutorAction#execute`, `ContinueUnfinishedStoriesAction#doExecute`, `DeleteNoteAction#doExecute`, `DeleteObjectAction#doExecute`, `EditObjectAction#doExecute`, `EditPropertiesAction#execute`, `MoveContinueStoryAction#doExecute`, `MoveContinueTaskAction#execute`, `PutTheClockForwardAction#execute`, `StartIterationAction#doExecute`, `UpdateTimeAction#doUpdateTimeAction` and `#doUpdateEstimateAction`.
  - **Validation:** none of them validates the value. Only a null value (in `ChangeLocaleAction`, an empty value) selects a mapping forward, and the two `UpdateTimeAction` methods have no fallback at all.
  - **Reach:** the bundled `RequestProcessor#processForwardConfig` adds the context path only to paths that start with `/`. Any other value is passed unchanged to `sendRedirect`, so an absolute URL leaves the application.
- **Correction of my own first inventory:** it had counted `CloseIterationAction#doExecute` as a 14th redirect method. Its full listing shows a fixed `onclose` target. `returnto` is only appended, unencoded, to that target's query string; the continue step then redirects to it.
- **View names:** `CommonObjectHandler#list` and `#edit` return the `{objectType}` path value as the view name. `InternalResourceViewResolver` (`spring-web.xml:26-30`) maps it to `/WEB-INF/jsp/<value>.jsp`. No file lies directly in `WEB-INF/jsp`, and a single path segment cannot reach its 7 subdirectories. The handlers therefore select no existing page (`Inferred`).
- **Correction:**
  - Row 60 now states the view-name behavior; its expected-result text changed and its status is unchanged.
  - Rows 43, 46, 58, 62, 78, 88, 121, 134 and 149, which describe a return to `returnto`, carry a redirect note. Row 101 records the query injection.
  - The Source Inventory and Runnable Surfaces statements "views unknown" were corrected.
  - GAP-007 and one Q3 fact list the methods and all 31 rows whose actions use them.

<a id="read-f-003-exports-contain-every-person"></a>

### F-003 Exports contain every person

- **Source check:**
  - **XML:** `XmlExporter#export` runs the unconditional query `from person in class net.sf.xplanner.domain.Person` and passes the result to `XmlExporter$XPlannerData#setPeople`, next to the selected objects. `#configureBindings` hides the person `password` and `lastUpdateTime`. The other readable person properties are expected in the file (`Inferred`, Betwixt); the `Person` getters are id, name, userId, email, phone, initials, hidden, description and attributes. For the other types it hides the project `currentIteration` and the role `personId`, `id` and Hibernate proxy field.
  - **MPX and MSPDI:** `MpxExporter#export` and `MspdiExporter#export` (a subclass of `MpxExporter`) load all persons into `MpxExporter$ResourceRegistry#<init>`. That constructor adds each person as a resource with `Person#getName`; `Person#getId` is used only as the map key.
  - **Permission:** the export actions have no server-side permission check (rows 29-30).
- **Correction:** rows 209 and 210 and the Data And Integrations export row now state the people content. No status changed.

<a id="read-f-004-configuration-key-figures"></a>

### F-004 Configuration-key figures

- **Source check:** `props-parse-08.js` is a `.properties` parser. It handles comment lines, continuation lines, the `=`, `:` and whitespace separators and escaped keys.
  - `xplanner.properties` has 317 physical lines and 105 entries, including 3 bracketed keys and 1 entry of 16 continuation lines.
  - `xplanner-custom.properties` has 9 entries.
  - Together they hold 114 entries and 106 distinct keys.
  - The BA-001-06 line pattern `^[A-Za-z][\w.\-]*\s*=` matched 111 entries (103 distinct). It missed exactly `xplanner.security.login[0].module`, `.name` and `.option.userIdCaseSensitive`.
- **Consumer rerun:** `config-consumers-08.js` uses the parser's key set and also matches `MessageFormat` patterns. The 3 keys are consumed by `LoginModuleLoader#loadLoginModules`, `#getLoginModuleNames` and `#getOptions`, through the constants `LOGIN_MODULE_CLASS_KEY`, `LOGIN_MODULE_NAME_KEY` and `LOGIN_OPTION_PREFIX`. The keys without a consumer by name are 42, the same list as BA-001-06.
- **Correction:** the Source Inventory Configuration row states the figures, and the BA-001-06 tool row carries the correction note. The new tool row records the rerun. Row 11 already records the login-module keys, so no row changed.

<a id="read-related-occurrence-checks"></a>

## Related-Occurrence Checks

**(d) Request-to-object binding.** Tool: `.migration-tmp/stage-01/tools/binding-trace-08.js`, which writes `out/binding-trace-08.txt`. It is a static call graph from all 190 entry points (web, WAP, SOAP, REST, iCal, Spring MVC and the tag handlers) to the sinks `RequestUtils.populate`, commons-beanutils `BeanUtils`/`PropertyUtils` `populate`, `copyProperties` and `setProperty`, Spring `BeanUtils.copyProperties`, `com.technoetic.xplanner.util.PropertyUtils.setProperty`, `DataBinder` and `web.bind`.

| Inventory | Count | Result |
|---|---|---|
| Entry points that reach `RequestUtils.populate` | 11 found, 10 real: `/do/edit/project`, `/do/edit/roles`, `/do/edit/iteration`, `/do/edit/feature`, `/do/edit/userstory`, `/do/move/continue/userstory`, `/do/edit/task`, `/do/edit/note`, `/do/edit/person`, `/do/edit/setting`; `/do/import/stories` is the `super` over-approximation's false positive | all through `EditObjectAction#populateObject` with `merge=true`; no property restriction; story and task checks skipped; corrected rows listed under F-001 |
| Web entry points that reach other copy sinks | 3: `/do/continue/unfinished/stories` and `/do/move/continue/userstory` (`#populateForm`, `PropertyUtils.copyProperties` from object to form), `/do/move/continue/task` (`RelationshipConvertor#populateDomainObject`, ids from the validated form) | no request map is copied onto an object; retained |
| SOAP operations that reach a copy sink | 31 (6 of them `update` overloads) | `get*` copy domain objects to data objects; `add*` and `update` copy a `*Data` object onto the domain object (`XPlanner#populateDomainObject`), so the property set is limited to the data class (for example `PersonData`: name, email, phone, initials, userId, plus id and lastUpdateTime) and each call is permission-checked (row 218); retained |
| Copies outside entry paths | `JNDIAuthenticatorImpl#setOptions` (configuration options), `Continuer#cloneObject` (object to object), `DomainMetaDataRepository#setObjectOrId` (ids) | no request value |
| Spring MVC handlers | 3 methods (`CommonObjectHandler#list`, `#edit`, `MePage`) | `@PathVariable` parameters only, no data binding |
| Pages that post `merge=true` | 4 | 2 reach the binding (`task.jsp`, `moveContinueStory.jsp`); 2 post to actions without `#populateObject` |

**(e) Request-selected navigation.** Tools: the call inventory over `out/classes.json` and `disasm.js` listings of every site.

| Inventory | Count | Result |
|---|---|---|
| `new ActionForward(String, boolean)` sites | 19 methods | 13 open redirects to `returnto` (F-002); 1 fixed target with `returnto` in the query (`CloseIterationAction#doExecute`, row 101); 3 internal targets built from request-derived parts: `AuthenticationAction#execute` (the saved original URL, built by `SecurityHelper#saveUrl` from the request URL and query of the user's own earlier GET, row 10), `IdSearchAction#doExecute` (`/do/view/<type>?oid=<id>` from the found object, row 182) and `IntegrationAction#addProjectId` (mapping forward plus `?projectId=`); 2 constant targets (`EditProjectAction#doExecute`, `UpdateTimeAction#doExecute`) |
| `ActionForward#setPath` sites | 1 (`ReorderStoriesAction#doExecute`) | input forward plus `?oid=`; internal |
| `sendRedirect` callers | 2 (`FormSecurityFilter#onAuthenticationFailure`, the dormant `NullSecurityFilter`) | constant login target |
| Spring `RedirectView` or `redirect:` view names | 0 | none |
| Spring view names from request values | 2 methods (`CommonObjectHandler#list`, `#edit`); `MePage` returns the constant `view/meStatus` | row 60: no existing page |
| JSP redirects | `index.jsp` `logic:redirect` | constant targets with ids (row 18) |
| Links built from `returnto` | `editNote.jsp:106`, `importPeople.jsp:78` (`html:link page`) | links, not redirects; already recorded as reflected values (rows 50, 169) |

**(f) Export content per channel.** Tools: class dumps and listings of the exporters and download actions.

| Channel | Entity sets written beyond the selection | Included / hidden fields | Result |
|---|---|---|---|
| XML export of a project or iteration (rows 209, 210) | every person | hidden: password, lastUpdateTime; the other readable properties written (`Inferred`) | corrected |
| MPX and MSPDI export (rows 209, 210) | every person as a resource | name only | corrected |
| PDF story and task listing (`PdfExporter`, rows 210, 212) | none; customer and acceptor names of the exported items | `Person#getName` | retained |
| jrpdf reports (rows 211, 213) | `PdfReportExporter$PersonDataSource` for the person report; templates missing (GAP-003) | not producible | retained |
| Attachment download (`DownloadAttachmentAction`, `FileManagerAction#writeFileToResponse`) | one stored file | file bytes | retained |
| iCal feed (rows 228-230) | the requested person's tasks and time entries; another person's calendar needs `admin.edit` | task and time data | retained |
| REST views (row 223) | none; project id and name, stories with tasks carrying tracker and acceptor ids | ids only | retained |
| SOAP `getPeople` and `getPerson` (row 218) | people, filtered by the caller's permission | `PersonData` properties | retained |
| `CsvExporter`; displaytag table export | not wired; enabled on no table | none | retained |

**(g) Figures from `.properties` files.** Tools: `props-parse-08.js`, `config-consumers-08.js` and `props-figures-08.js`. They write `out/props-parse-08.txt`, `out/config-consumers-08.txt` and `out/props-figures-08.txt`, with keys only and no values.

| Figure | Before | Regenerated | Result |
|---|---|---|---|
| Configuration entries / distinct keys | 111 / 103 | 114 / 106 (positive controls: the bracketed `xplanner.security.login[0].module` and the 16-line `error.filingInfo` are both counted) | corrected (F-004) |
| Keys without a consumer by name | 42 | 42, the same list; the 3 bracketed keys consumed by `LoginModuleLoader` | confirmed |
| Physical lines of `xplanner.properties` | 317 | 317 | confirmed |
| Public-page bundle keys | 41 (cited tool output lists 39) | 39 static keys plus 2 selected by the `titleKey` scriptlet of `unexpectedError.jsp:19,47`; 1 credential text (`login.instructions` in the default bundle), re-evaluated on whole logical values | derivation corrected; figure kept |
| Per-bundle presence of the bundle keys named in the reconnaissance or the rows | line test `^key=` / `^key =` | 78 keys (after the edits), 10 bundles: 0 differences | confirmed |
| Cited `.properties` line ranges | as cited | 68 ranges exist; 67 lie on entries; `xplanner.properties:167-190` is the commented optional login-module block, cited as disabled | confirmed |
| Credential values in the CHK-009 scan | line pattern for the database keys | the parser shows no continuation line on the credential keys, so the line pattern reads their whole values | confirmed |

<a id="read-retained-work"></a>

## Retained Work

Each retained area below was touched by a check. It is retained because the check shows that its inputs and dependencies are not affected, not because an earlier pass matched it.

| Retained area | Check | Absence-of-impact reason |
|---|---|---|
| Row 194 (features) | (d), (e) | The binding and the redirect are on its static path, but the row already expects the editor to fail at runtime because the type class is absent; the Q3 facts name it. |
| Rows 49, 81, 82, 90, 91, 98, 102, 125, 126, 139, 142, 144, 173, 174 (actions that use a `returnto` redirect but whose text does not describe the redirect) | (e) | Their descriptions state the effect of the action, not the navigation; the Q3 fact lists them with the method that redirects. |
| Rows 144-147 (move task), 102-104 (continue stories) | (d) | Their actions copy object to form or resolve ids from the validated form; no request map reaches an object. |
| SOAP rows 215-221 | (d) | The copy source is a typed `*Data` object, so the property set is the data class, and each operation checks the caller's permission (row 218). |
| Rows 8, 10, 16-18, 97, 182, 233 (other navigation) | (e) | Their targets are constant, the user's own earlier request, or built from a found object or an id. |
| Rows 211-213, 223, 228-230 and the attachment rows | (f) | These channels write no person set beyond the selection or the requested person. |
| Row 68 and the other configuration statements | (g) | The consumer list is unchanged (42); the added keys are consumed. |
| CHK-004 per-bundle notes (rows 8, 9, 12-14, 56, 69-71, 89, 98, 135, 152-160, 163, 166, 171, 228) | (g) | The parser gives the same per-bundle key presence for all 78 named keys. |
| CHK-005 validator sweep (47 keys) | (g) | Its keys come from bytecode constants, not from `.properties` counts; the pass-006 reviewer's own count of 41 validation keys uses a different extraction and reports 0 uncovered. |
| Q3 facts of BA-001-03..07, GAP-005 provenance notes P-01..P-07 and the 31 row notes | (d)-(g) | No finding changes a patched value or an earlier fact; the new facts are added beside them. |
| Owner decisions Q1-Q4 and the pass 001-005 records | none | Not inputs of the corrected mechanisms; unchanged. |

<a id="read-scope-expansion"></a>

## Scope Expansion

None. The extensions listed in Scope Validation stay inside the named findings or the mandatory checks (d)-(g). They were recorded there before the rows were edited. No input changed, the baseline stayed reliable, no systemic omission was found outside the four sink kinds, and every impact was bounded to named rows and sections.

<a id="read-credential-handling"></a>

## Credential Handling

- **Rule:** under [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence), A3 and CHK-009, no password, key, token or login pair is written in any record, row, script or scratch output.
  - The person-digest statement under F-001 names the setter only.
  - The parsers hold property values in memory and print keys only.
- **Scan:** `.migration-tmp/stage-01/tools/chk009-scan-08.js` is a copy of `chk009-scan-07.js` retargeted to this record and to the files touched in BA-001-08.
  - It extracts the credential values from the permitted sources in memory.
  - It searches the reconnaissance, this record, the workbook cells, the row data and every scratch file changed in BA-001-08.
  - It prints categories, file names and counts only.
- **Result:** reported as a hit count in RESULT BA-001-08.
- **Limitation:** a changed or encoded value would not be found.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff compares `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-08.js` with the final row data (`diff-rows-08.js`). The full before and after texts are in `out/changed-rows-08-full.txt`. No rows were added or removed, so no row numbers changed.

| Row | Scenario | Columns changed | Source |
|---|---|---|---|
| 35 | Edit project roles | evidence | F-001 (`/do/edit/roles`) |
| 43 | Create person | evidence | F-001, F-002 |
| 46 | Edit person and password | evidence | F-001, F-002 |
| 58 | Change display language | evidence | F-002 |
| 59 | Settings pages (list) | evidence | F-001 |
| 60 | Settings pages (Spring MVC handlers) | expected, evidence | F-002 |
| 62 | Administrative and test actions | evidence | F-002 |
| 78 | Create project | evidence | F-001, F-002 |
| 81 | Edit project | evidence | F-001 |
| 88 | Create iteration | evidence | F-001, F-002 |
| 90 | Edit iteration | evidence | F-001 |
| 101 | Close iteration | evidence | F-002 (query injection) |
| 121 | Create user story | evidence | F-001, F-002 |
| 124 | Story editor with `merge=true` | requirement, expected, evidence | F-001 |
| 125 | Edit user story | evidence | F-001 |
| 129 | Move or continue a story | evidence | F-001, F-002 |
| 134 | Create task | evidence | F-001, F-002 |
| 137 | Task validation | evidence | F-001 |
| 139 | Edit task | evidence | F-001 |
| 140 | Complete task | evidence | F-001 |
| 141 | Reopen task | evidence | F-001 |
| 149 | Record time on a task | evidence | F-002 |
| 169 | Add note | evidence | F-001 |
| 173 | Edit note | evidence | F-001 |
| 209 | Export project | evidence | F-003 |
| 210 | Export iteration | evidence | F-003 |

- In total, 26 rows changed. No status changed.
- The workbook has 210 rows: 111 `Yes`, 77 `Inferred`, 21 `Partial` and 1 `No`.
- The 31 provenance notes are unchanged.
- **Reconnaissance sections changed:**
  - reading block;
  - Scope And Provenance: snapshot date, analyst, loaded skill;
  - Source Inventory: Configuration row, Spring MVC pages row;
  - Runnable Surfaces: settings pages row, public-page texts;
  - Data And Integrations: export row;
  - Build, Run, And Test Evidence: legacy hash row, `unauth-06` row, `config-consumers-06` row, 3 new tool rows, final-build figure, `audit:project`, `audit:artifact-links`, `artifact-reading.js` and `audit:workbook:excel` rows;
  - GAP-007;
  - Q3 facts: 2 new rows (binding; redirects and view names);
  - Return Correction Evidence: 5 new rows and the record paragraph;
  - Stage 1 Exit Checklist;
  - Error Prevention: BA-001-08 learning update and self-check; BA-001-07 marked historical.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are in RESULT BA-001-08.

- **Run in BA-001-08:**
  - the source checks and inventories (d)-(g) above, with the regression run `persist-trace-08.js`;
  - the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`;
  - `sync:workbook-progress`, `audit:workbook`, `audit:project` and `audit:artifact-links`;
  - `artifact-reading.js` on the reconnaissance and on this record;
  - CHK-001 with `.migration-tmp/stage-01/tools/chk001-ba-001-08.js`: 18 line citations with content checks, every WAR line position in the BA-001-08 row, reconnaissance and record text (74 positions), 7 negative checks with positive controls, and 56 row references;
  - CHK-007 figure regeneration with the parser (check (g));
  - the CHK-009 scan;
  - the legacy SHA-256;
  - `audit:workbook:excel`, once after the final write.
- **Retained, not rerun:**
  - the BA-001-07 wiring and request-value inventories (mechanisms (a) and (b)), whose inputs are unchanged;
  - the BA-001-06 inventories for CHK-010 and CHK-011;
  - the BA-001-05 CHK-005 and CHK-008 sweeps;
  - the BA-001-04 CHK-002, CHK-004 and CHK-006 sweeps. No changed row alters a permission condition, a locale statement or a delete effect; the CHK-004 key presence was re-derived under (g).

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1: refine CHK-012 with request-to-object binding and request-selected navigation | Yes. Rows 124, 137 and 140 described `merge=true` only as a validation switch or as a form update, although the request is bound onto the object. Row 60 and 11 rows describing a `returnto` return did not state that the target is chosen by the request and can leave the application. The same checks found row 141, `/do/edit/roles`, 2 more redirect methods and the `CloseIterationAction` query. | Checks (d) and (e) |
| P-2: refine CHK-007 with a format-aware parser and a positive control for configuration counts | Yes. The line pattern of `config-consumers-06.js` missed the 3 bracketed keys, and the published figure (103 distinct) was wrong. The parser rerun with positive controls gives 106. The same check found a public-page key figure whose derivation did not match its cited output. | Check (g) |

**Checklist admission (PM / Coordinator, after RESULT BA-001-08):** both proposals are admitted as refinements of existing checks, not as new IDs.

- **P-1** refines CHK-012: two sink kinds are added, binding onto domain or persistent objects and request-selected navigation.
- **P-2** refines CHK-007: counts in structured files need a format-aware parser and a positive control.

No duplicate check exists. [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) keeps CHK-001..CHK-012.

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-004 and the related occurrences within the static boundary.
- **Independent verification:** not yet performed. The next control is Stage 2 `correction-validation` by a new independent BA from the pass-006 baseline, after the correction PR, CI and owner merge. That reviewer decides whether the baseline is admissible.
- **Open for Stage 3 (BA):**
  - a `merge=true` request to an editor with an extra property;
  - a `returnto` value with an absolute URL;
  - an XML export, to see the exact person fields;
  - a request to `/setting/<type>/list`.
- **Owner (deferred):** Q3 now also covers the binding and the redirects; the export people content is a Stage 9 personal-data fact. Q2 and Q4 are unchanged.
- **Questions for PM:** none.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check, BA-001-08:** checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `0115d8ca4422b2a3ae319734cf3dbc274f5e8ae57b05175384667a07e5b79183`. Applicable checks are CHK-001..CHK-012.
  - **CHK-001:** run by `chk001-ba-001-08.js`.
  - **CHK-002:** no permission condition changed; the new notes cite rows 29-30 for the absent server-side checks.
  - **CHK-003:** configuration consumers rerun with the parser; binding sinks, redirect targets and export contents inventoried.
  - **CHK-004:** the per-bundle key presence was re-derived with the parser, with no difference; no locale statement changed.
  - **CHK-005, CHK-006 and CHK-008:** their inputs are unchanged, so their results are retained.
  - **CHK-007:** figures regenerated with the parser and positive controls, and the records were searched for the superseded figures.
  - **CHK-009:** scanned; see Credential Handling.
  - **CHK-010 and CHK-011:** no link parameter or unauthenticated surface changed.
  - **CHK-012:** request values traced into object binding, redirects and view names; the earlier query, output, error and cookie sinks are retained.
  - **Pass-006 links:** CHK-012 (F-001, F-002) and CHK-007 (F-004) were rechecked over all entry points and all `.properties`-derived figures.
- **Self-detected errors, corrected before handoff:**
  - the `super`-call gap of the call-graph tracer;
  - `CloseIterationAction` first counted as an open redirect;
  - the row 149 note first claimed a fallback that `UpdateTimeAction` does not have. The row edits were reverted to the pre-edit copies and run again.
- **Learning update:** the reviewer proposals P-1 and P-2 above. No project checklist edit is made by BA.

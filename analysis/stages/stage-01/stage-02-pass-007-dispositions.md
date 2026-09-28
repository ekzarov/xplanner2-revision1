# Stage 2 Pass 007 Dispositions

**How was each Stage 2 pass 007 finding checked against the legacy source, which directly related occurrences were corrected, and what was deliberately retained?**

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
> **Bounded correction recorded for pass 007 F-001..F-003 and the directly related occurrences; not yet independently verified**
>
> The Stage 1 author validated PM's boundary and corrected all 3 findings. F-002 and F-003 were extended within the findings. Three directly related checks were run:
> - **(h) framework resolution of request-chosen navigation:** a Spring view name with `redirect:` or `forward:` becomes a redirect or forward, and a `returnto` value equal to one of the 4 Tiles definition names is rendered as that layout; 46 `findForward` calls have no request-chosen name;
> - **(i) script-context output:** 74 JSP and tag files, 103 script contexts, 77 dynamic outputs; 2 write request values unescaped;
> - **(j) page-text keys:** 45 keys on the public pages, not 41, compared in all 10 bundles.
>
> 5 rows changed, no status changed and no rows were added. No scope expansion was needed. Retained areas are justified by the absence of impact. Nothing here is independently verified.
>
> **Next:** PM checks RESULT BA-001-09 against the assignment; the correction PR, CI and owner merge follow, then Stage 2 `correction-validation` pass 008 by a new independent BA.
>
> **Details:** [Correction Assignment (PM)](#read-correction-assignment-pm) / [Disposition Summary](#read-disposition-summary) / [Related-Occurrence Checks](#read-related-occurrence-checks) / [Changed Rows](#read-changed-rows).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Framework resolution of request-chosen views](#read-f-001-framework-resolution-of-request-chosen-views)
  - [F-002 Returnto value in a button script](#read-f-002-returnto-in-a-button-script)
  - [F-003 Public-page keys](#read-f-003-public-page-keys)
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
- **Task:** BA-001-09, `ba` / `author`, Stage 1 re-entry. The branch is `stage-01/pass-007-corrections`, created from `main` at `3586c42d23e7a102fa4ea84929613f4a2fe84f62`, after PR #20.
- **Owner confirmation:** `ekzarov`, chat message on 2026-09-28.
  - The boundary is findings F-001..F-003 and the directly related occurrences.
  - Unaffected areas are not researched again. Existing identifiers are kept. [`legacy/`](../../../legacy), sealed reviews, evidence and earlier disposition records are not changed.
  - The next control is Stage 2 `correction-validation` pass 008 by a new independent BA session, with root baseline pass 006 and previous control pass 007.
  - A need for a full blind pass is shown to the owner first. Merging the correction PR does not authorize Stage 3.

| Boundary | Assignment |
|---|---|
| Trigger and baseline | [`analysis/reviews/stage-02-pass-007.md`](../../reviews/stage-02-pass-007.md) (SHA-256 `e2fd2da2a399b01e1c576b61e9c7697ef2aa63b0be2f6320208956d87bf2a53b`), with its ledger [`analysis/reviews/evidence/S02-P007/comparison-results.json`](../../reviews/evidence/S02-P007/comparison-results.json) (`7dda3cf4828fe9c4cf1dc920765e7b075ebb2a855d1800858ce28975c85e2c41`) and [`coverage-reconciliation.json`](../../reviews/evidence/S02-P007/coverage-reconciliation.json) (`dbbc987c036713f430bfae8ee0e2f748fb1a441fa720ee45daf5922a576a2f7d`). Findings F-001, F-002 and F-003, all low. The reviewer found CHK-012 failing for F-001 and F-002, and CHK-007 with CHK-004 failing for F-003. Checklist proposals P-1 (refine CHK-012) and P-2 (refine CHK-007 with CHK-004). Baseline: [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `c672ad6faf8a0567eb2fb36259c137c4f238cfe86ddbb57041c972720f3043a1` and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `2949146c30a9b5fb461f262ce047c7cf8c4c1008a974a68d08d7054b25342305` (210 rows), unchanged at `3586c42`. Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) `6e01c409fc6b6a595f1ff618a7a0e474dcde9b084e368171f1e37489fe74ff32` (CHK-001..CHK-012). Legacy package [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`. Relevant earlier items: the view-name part of pass-006 F-002, carried into pass-007 F-001. Pass 007 closed pass-006 F-001, F-003 and F-004 and found nothing open in passes 001-005. |
| Correction scope | **F-001:** a request-chosen Spring view name that starts with `redirect:` or `forward:` becomes a redirect or forward (`CommonObjectHandler`, `UrlBasedViewResolver#createView`). A `returnto` value equal to one of the 4 Tiles definition names is rendered as that layout instead of being redirected. Correct row 60, the Source Inventory Spring MVC row, the Runnable Surfaces settings row, the reading block, the Q3 navigation fact, the 13-method `returnto` fact (Tiles exception) and GAP-007. Record reach as `Inferred`, since runtime is unverified.<br>**F-002:** `editIterationStatus.jsp:70` writes `returnto` unescaped into the Cancel button's `onclick` script. Correct row 98 and the Q3 reflected-output fact so that it covers script contexts.<br>**F-003:** the public-page key figure is 44 (42 static + 2 scriptlet), not 41: `login.title` (`login.jsp:14`) and the layout footer keys `app.label.version` and `footer.message` (`footer.jsp:25,38`) were missing. Correct the Runnable Surfaces public-page bullet, the unauth-06 and props-parse-08 evidence rows, the self-check figure, and the per-bundle notes of rows 8 and 56.<br>**Directly related occurrence checks (bounded):**<br>(h) Framework resolution of request-chosen navigation: every view name, forward path or definition name that comes from a request value, resolved through the bundled framework (Spring view resolver prefixes, Struts/Tiles definition lookup). Reuse the check (e) inventory of BA-001-08 as the list of sites; do not re-inventory unrelated navigation.<br>(i) Script-context output of request values: event handlers, `document.location` and inline scripts that embed request-derived values, over all JSP and tag files.<br>(j) Page-text keys: for the public pages (and any other page whose key figure the records state), count keys over every key-taking attribute form and the layout and include chain, with positive controls for an attribute-form key and a layout-inserted key, and compare each key in all 10 bundles.<br>**Exclusions:** no re-research of unaffected areas, epics or mechanisms; no runtime; no edits to sealed reviews, evidence or earlier disposition records; no decisions on Q2-Q4 (Q3 stays deferred: record observed behavior only); no credential values (A3, CHK-009). |
| Retained work | Everything outside the scope above stays at its existing identity, including the BA-001-08 corrections that pass 007 verified. Retention must be justified by **absence of impact**: checks (h)-(j) show that the area's inputs and dependencies are not affected. Record that reason for every retained area the checks touch. Match counts are not evidence of absence of impact. If a check finds a changed input, an unreliable baseline, a systemic omission or impact that cannot be bounded, record the trigger and tell PM at once, before any expanded work: the owner must see it first, and it may require a full-blind Stage 2. |
| Checks and outcome | For each finding: accepted, narrowed or rejected with source evidence, plus the changed items. For each check (h)-(j): an inventory with counts and results. Also run: `audit:workbook`, `audit:project` and `audit:artifact-links`; `artifact-reading.js` on the reconnaissance and on this record; CHK-001..CHK-012, including CHK-007 figure regeneration; the CHK-009 credential scan result (hit count only); the legacy SHA-256; `audit:workbook:excel` once. For proposals P-1 and P-2, state whether the underlying findings are confirmed. Cite unchanged earlier checks as retained evidence, not as newly run. List every changed row, cell and reconnaissance section, so that the next reviewer can regenerate the complete change set. |
| Next control | Stage 2 `correction-validation` pass 008 under [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation), by a new independent BA session that did not author these corrections and is not an earlier reviewer. Root baseline pass 006, previous control pass 007. Before it: the correction PR, required CI and owner merge. The author self-check is not independent closure. PM checks the RESULT against this boundary before accepting it. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-09. The work was done by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`), who also wrote BA-001-01..08. The skill file `.agents/skills/migration-ba/SKILL.md` has git blob `d09ba8ced6616dc34fb30a9f2ecde6ab9c3a5398`.
- **Assignment section unchanged:** the section above was not edited. Its SHA-256, taken over the 6880 characters from the `read-correction-assignment-pm` anchor to its last line, is `b813db80806e81da2f4891317ea29c345421d841d702be9760245c6db9ad1b40`. The value was the same at hand-off and after these sections were appended.
- **Process read before starting:** [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) and [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence).
- **Trigger and baseline validated:**
  - The trigger is [`analysis/reviews/stage-02-pass-007.md`](../../reviews/stage-02-pass-007.md) `e2fd2da2…`, with its ledger `7dda3cf4…` and the coverage reconciliation `dbbc987c…`. All three hashes match.
  - The baseline is the reconnaissance `c672ad6f…` and the workbook `2949146c…` (210 rows). Both match the assignment and are unchanged at `3586c42`.
  - The checklist is `6e01c409…` (CHK-001..CHK-012, with CHK-007 and CHK-012 refined).
  - The legacy SHA-256 values are unchanged.
  - Rows 8, 56, 60 and 98 have the stated content at these numbers.
- **Agreement with the boundary:** the boundary is accepted. The checks extend it in two places; both are inside a finding and a named check:
  - **F-002:** row 101 (close iteration) uses the same confirmation page as row 98, so it gets a pointer note, and the Q3 fact lists it.
  - **F-003:** check (j) found one layout key more than the reviewer, the breadcrumb link text `navigation.top`, which a tag handler adds on every `tiles:default` page. The figure is 45, not 44.
- **No expansion trigger:** no input changed, the baseline is reliable, and every check result is bounded to named rows and sections. No systemic omission was found:
  - the only other tag-handler text in the public layout chain is the unreachable back link;
  - no other request value reaches a script context.
- **Stated scope of the checks:** check (h) reuses the BA-001-08 check (e) sites and adds the framework resolution for them. Check (i) covers all 74 JSP and tag files. Check (j) covers the 5 public pages, the only pages whose key figure the records state. No unaffected epic was re-researched.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | low | accepted | `UrlBasedViewResolver#createView`, `RedirectView#renderMergedOutputModel` (`WAR:WEB-INF/lib/spring-webmvc-3.0.5.RELEASE.jar`); `TilesRequestProcessor#processForwardConfig`, `#processTilesDefinition` (`WAR:WEB-INF/lib/struts-1.2.9.jar`); `WAR:WEB-INF/struts-config.xml:424-436`; `WAR:WEB-INF/tiles-definitions.xml:5,11,23,29`; `WAR:WEB-INF/web.xml:164-167,313-316` | row 60; Source Inventory Spring MVC row; Runnable Surfaces settings row; reading block; GAP-007; Q3 navigation fact | owner via PM (Q3); BA (Stage 3 reachability) | not yet |
| F-002 | low | accepted, extended (row 101) | `WAR:WEB-INF/jsp/edit/editIterationStatus.jsp:32,70`; `WAR:WEB-INF/struts-config.xml:119-120,245,251` | rows 98, 101; GAP-007; Q3 reflected-output fact | owner via PM (Q3) | not yet |
| F-003 | low | accepted, extended (`navigation.top`; 45 keys) | `WAR:WEB-INF/jsp/security/login.jsp:14`; `WAR:WEB-INF/jsp/common/footer.jsp:25,38`; `WAR:WEB-INF/jsp/layout/defaultLayout.jsp:44`; `WAR:WEB-INF/tags/breadcrumb.tag:10`; `NavigationBarTag#render`; `WAR:WEB-INF/jsp/common/unexpectedError.jsp:19,27,47` | rows 8, 56; Runnable Surfaces public-page texts; Build, Run, And Test Evidence unauth-06 and props rows; Error Prevention BA-001-08 figure | none | not yet |

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-framework-resolution-of-request-chosen-views"></a>

### F-001 Framework resolution of request-chosen views

- **Spring:** `InternalResourceViewResolver` extends `UrlBasedViewResolver`. The bytecode listing of `#createView` shows that the view name is checked before prefix and suffix are applied:
  - A name that starts with `redirect:` becomes `new RedirectView(rest, isRedirectContextRelative(), isRedirectHttp10Compatible())`. `RedirectView#renderMergedOutputModel` adds the context path only when the target starts with `/`. `spring-web.xml` sets neither option, so the defaults apply.
  - A name that starts with `forward:` becomes `new InternalResourceView(rest)`, a forward.
  - `CommonObjectHandler#list` and `#edit` return the `{objectType}` path value as the view name (BA-001-08 listing). `/setting/*` is mapped to the Spring servlet and to `WebSecurityFilter` (`web.xml:164-167,313-316`).
  - **Reach:** a signed-in user who follows `/setting/redirect:<target>/list` is redirected to `<target>`. A scheme-qualified value can name another host. This is `Inferred`: the container's encoded-slash handling and the browser behavior are unverified.
- **Struts:** the controller is `DelegatingTilesRequestProcessor` (`struts-config.xml:424-427`), which does not override `processForwardConfig`, so the `TilesRequestProcessor` method is used. It first calls `#processTilesDefinition` with the forward path, which looks the path up with `DefinitionsFactory#getDefinition` and, on a match, forwards or includes the definition's page.
  - The Tiles plug-in loads only `tiles-definitions.xml`, whose 4 names are `tiles:default`, `tiles:view`, `tiles:print` and `tiles:edit`.
  - So a `returnto` value equal to one of these names is rendered as that layout instead of being redirected. The set is fixed, and the host does not change.
- **Correction:**
  - Row 60: the expected-result text and the evidence now state both outcomes.
  - The Source Inventory Spring MVC row, the Runnable Surfaces settings row and the reading block are corrected.
  - The Q3 navigation fact names both the Spring prefixes and the Tiles exception, with the jar evidence. GAP-007 names the Spring redirect.
- **Not changed:** the 9 row notes that describe the `returnto` redirect (rows 43, 46, 58, 62, 78, 88, 121, 134, 149). See Retained Work.

<a id="read-f-002-returnto-in-a-button-script"></a>

### F-002 Returnto value in a button script

- **Source check:**
  - `editIterationStatus.jsp:32` binds `returnto` from the request (`bean:parameter`).
  - Line 70 writes it unescaped after the context path into the Cancel button's `onclick="document.location='…'"`. A crafted value can end the JavaScript string and add script; it also chooses the target of Cancel on the same host.
  - The page is the input and forward of both `/do/start/iteration` and `/do/close/iteration` (`struts-config.xml:119-120,245,251`).
- **Correction:**
  - Row 98 records the script sink.
  - Row 101 (close iteration) points to it, because the close confirmation is the same page.
  - The Q3 reflected-output fact now covers script contexts and lists row 101. GAP-007 names the button script.

<a id="read-f-003-public-page-keys"></a>

### F-003 Public-page keys

- **Source check:** `public-keys-09.js` builds the render chain of the 5 public pages.
  - `login.jsp` and `unexpectedError.jsp` use `xplanner:content`, which inserts `tiles:default` (`ContentTag#doStartTag`) unless the print parameter selects `tiles:print`.
  - `tiles:default` is `defaultLayout.jsp` with `header.jsp`, which includes `baseHeader.jsp`, and `footer.jsp` (`tiles-definitions.xml:5-10`).
  - `defaultLayout.jsp:44` calls `tags:breadcrumb`. Its `xplanner:navigation` (`NavigationBarTag#render`) always adds a link whose text is the bundle key `navigation.top`. It adds `navigation.back` only when `back=true`, and none of the 5 callers sets that.
  - The tool counts every key-taking attribute (`key`, `titleKey`, `formatKey`, `pageKey`, `altKey`, `srcKey`, `errorKey`) plus scriptlet `getMessage` calls. It resolves the 2 dynamic `titleKey` uses.
- **Result:** 45 keys are rendered without a session:
  - the 39 static `key` attributes of the page files;
  - `login.title` (`titleKey`);
  - `error.title` and `system.info.title` (selected in a scriptlet);
  - `app.label.version` and `footer.message` (layout footer);
  - `navigation.top` (breadcrumb tag handler).
  - In addition, 4 header keys render only for a signed-in user (`footer.label.user`, `navigation.me`, `logout`, `contentsearch.button.label`), and 1 key sits inside an HTML comment (`contentsearch.label`).
- **Positive controls:** all found.
  - `login.title`: attribute form.
  - `footer.message`, `app.label.version`: layout.
  - `navigation.top`: tag handler.
  - `login.instructions`: page key.
  - `system.info.title`: scriptlet.
- **Per bundle (10 bundles, `.properties` parser):**
  - `login.title`: missing only in fr.
  - `app.label.version` and `navigation.top`: in all 10.
  - `footer.message`: only in default, `--` and de.
  - `error.title`: missing in de and es.
  - `system.info.title`: only in default and `--`.
  - No key is absent from every bundle.
  - Credential-like text: 1, the known `login.instructions` text of the default bundle (row 9). The new keys add none.
- **Correction:**
  - Rows 8 and 56 state the added keys per bundle.
  - The Runnable Surfaces public-page bullet gives 45 with the derivation. The unauth-06 and props evidence rows carry the correction, and the BA-001-08 self-check figure is annotated.
  - The reviewer's 44 is confirmed plus `navigation.top`.

<a id="read-related-occurrence-checks"></a>

## Related-Occurrence Checks

**(h) Framework resolution of request-chosen navigation.** Tools: `.migration-tmp/stage-01/tools/forwards-09.js` (`out/forwards-09.txt`) and `disasm.js` listings of the bundled classes extracted to `out/jarcheck-09/`. The sites are the BA-001-08 check (e) inventory.

| Site (from check (e)) | Count | Framework resolution | Result |
|---|---|---|---|
| Spring view names from a request value | 2 methods (`CommonObjectHandler#list`, `#edit`) | `UrlBasedViewResolver#createView`: `redirect:` becomes a redirect, `forward:` becomes a forward; otherwise `/WEB-INF/jsp/<v>.jsp` | corrected (F-001) |
| `returnto` redirects | 13 methods | `TilesRequestProcessor#processForwardConfig`: definition lookup first (4 names), then the Struts redirect | Tiles exception added to the Q3 fact |
| Fixed targets with request-derived parts (`CloseIterationAction`, `IntegrationAction#addProjectId`, `ReorderStoriesAction`, `IdSearchAction`, saved login URL) | 5 | the path is a constant path or a full URL; it cannot equal a `tiles:` definition name | no change |
| `ActionMapping#findForward` names | 46 calls in 30 methods | 45 constant names; 1 from the mapping parameter (`DispatchForward#execute`), which is configuration | no request-chosen forward name |
| JSP navigation tags (`jsp:forward`, `jsp:include`, `tiles:insert`, `c:import`, `c:redirect`, `logic:redirect`, `logic:forward`, `bean:include`) | all in 74 files | none with a request-derived target; `index.jsp:29` redirects to an id | no change |
| Layout selected by a request value | `ContentTag#doStartTag` (`print` parameter: `tiles:print` or `tiles:default`) | fixed pair of definitions | already recorded (row 192); no change |
| Breadcrumb back link from `returnto` | `NavigationBarTag#render` with `back=true` | none of the 5 callers sets `back` | unreachable; no change |

**(i) Script-context output of request values.** Tool: `script-sinks-09.js` (`out/script-sinks-09.txt`). Script contexts are `<script>` bodies, `on*` handler values, `javascript:` URLs and `location` assignments. Quotes inside scriptlets are masked before attribute values are delimited.

| Inventory | Count | Result |
|---|---|---|
| JSP and tag files | 74 (73 JSP, 1 tag file) | complete |
| Script contexts | 103 | — |
| Dynamic outputs inside them | 77 | classified by hand, below |
| Request values, unescaped | 2: `editIterationStatus.jsp:70` (`returnto` in `onclick`), `dashboard.jsp:132` (`${param.fkey}` in the task-board script) | corrected (F-002; row 98, 101); already recorded (row 114, Q3 fact) |
| Host-derived application URL | 1: `${appPath}` (`dashboard.jsp:132`, set by `ServletRequestFilter#doFilter` with `RequestUtils.absoluteURL(request, "/")`) | the host is the one the user's browser requested; a crafted link cannot choose it; no change |
| Other outputs | 74: 32 `html:rewrite` of constant paths, 18 bundle messages, 9 action constants, 7 action-button `onclick` texts (`ActionRenderer#getOnclick`, bundle text), 3 delete confirmations with stored names (quotes replaced), 5 numbers or ids | no request value |
| Own client scripts (`*.js` outside the libraries) | 8 files | none reads `location.search`, `location.hash`, `document.URL`, `document.referrer` or `window.name` |
| Positive controls | `editIterationStatus.jsp:70`, `dashboard.jsp:132` | both found |

**(j) Page-text keys.** Tool: `public-keys-09.js` (`out/public-keys-09.txt`, keys only).

| Inventory | Count | Result |
|---|---|---|
| Public pages | 5 (`login.jsp`, `wap/login.jsp`, `unexpectedError.jsp`, `index.jsp`, `calendar/calendar-i18n.jsp`); 2 use the `tiles:default` layout (5 layout files plus the navigation tag) | — |
| Key-taking attribute forms counted | `key`, `titleKey`, `formatKey`, `pageKey`, `altKey`, `srcKey`, `errorKey`, scriptlet `getMessage` | — |
| Keys rendered without a session | 45 (earlier extraction 39 + 2 = 41) | corrected: 4 keys added (`login.title`, `app.label.version`, `footer.message`, `navigation.top`) |
| Keys rendered only for a signed-in user | 4 (layout header) | recorded in the figure note |
| Keys only in HTML comments | 1 | recorded in the figure note |
| Per-bundle comparison | 45 keys × 10 bundles | stated in rows 8 and 56 for the added keys; the 39 static keys are unchanged (BA-001-06 notes, re-derived in BA-001-08) |
| Credential-like logical values | 1 (`login.instructions`, default bundle) | unchanged (row 9) |
| Print-layout variant (`tiles:print`) | not counted: a request-selected alternate layout (row 192), whose chain (`viewLayout.jsp`, `notes.jsp`, `footer.jsp`) is not part of the stated public-page figure | runtime unverified |

<a id="read-retained-work"></a>

## Retained Work

Each retained area below was touched by a check. It is retained because the check shows that its inputs and dependencies are not affected, not because an earlier pass matched it.

| Retained area | Check | Absence-of-impact reason |
|---|---|---|
| Row notes on the `returnto` redirect (rows 43, 46, 58, 62, 78, 88, 121, 134, 149) | (h) | The notes describe the redirect of an arbitrary value. The Tiles exception only narrows the outcome, for 4 fixed layout names on the same host, and each note points to the Q3 fact that now states it. |
| Rows 10, 18, 97, 182 and the other fixed-target navigation | (h) | Their targets are constant paths, ids or full URLs, which the definition lookup cannot match. |
| Row 192 (print layout) | (h), (j) | The print parameter already selects one of two fixed definitions, as recorded. |
| Row 114 (task board `fkey` script) | (i) | Already records the same script sink; its input is unchanged. |
| The 17 reflected-value pages of BA-001-07 other than `editIterationStatus.jsp` | (i) | The scan finds no second write of their request values into a script context. |
| Rows 9, 12, 13 (public-page texts) | (j) | Their keys are among the 39 static keys, whose per-bundle presence is unchanged. |
| Row 55 (system information page) | (j) | It states no per-bundle text. The key `system.info.title` is recorded in row 56 and in the figure. |
| CHK-011 surfaces (servlet mappings, web root, log) | (j) | The public pages and filters are unchanged; only the text figure changed. |
| The BA-001-08 corrections that pass 007 verified (binding, exports, configuration figures, other redirects) | none | Not inputs of the corrected mechanisms; unchanged. |
| Owner decisions Q1-Q4, provenance notes P-01..P-07 and earlier disposition records | none | Unchanged. |

<a id="read-scope-expansion"></a>

## Scope Expansion

None. Row 101 and `navigation.top` lie inside F-002 and F-003 and inside checks (i) and (j). They were recorded in Scope Validation before the rows were edited. No trigger for a full-blind pass was found.

<a id="read-credential-handling"></a>

## Credential Handling

- **Rule:** no password, key, token or login pair is written in any record, row, script or scratch output (A3, CHK-009, [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence)). The key tools print keys, bundles and counts only; property values stay in memory.
- **Scan:** `.migration-tmp/stage-01/tools/chk009-scan-09.js` is a copy of `chk009-scan-08.js` retargeted to this record and to the files touched in BA-001-09. It searches the reconnaissance, this record, the workbook cells, the row data and every scratch file changed in BA-001-09, and it prints categories, file names and counts only.
- **Result:** reported as a hit count in RESULT BA-001-09.
- **Limitation:** a changed or encoded value would not be found.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff compares `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-09.js` with the final row data (`diff-rows-09.js`). The full before and after texts are in `out/changed-rows-09-full.txt`. No rows were added or removed, so no row numbers changed.

| Row | Scenario | Cells changed | Change | Source |
|---|---|---|---|---|
| 8 | Log in with valid credentials | evidence | note on `login.title`, the layout footer keys and `navigation.top`, per bundle | F-003 |
| 56 | Error pages | evidence | note on `error.title`, `system.info.title`, the layout footer keys and `navigation.top`, per bundle | F-003 |
| 60 | Settings pages (Spring MVC handlers) | expected, evidence | expected result states the `redirect:` and `forward:` outcomes; evidence: "so the path value selects no existing page (Inferred; …)" becomes "so a value without a view prefix selects no existing page", and the framework-resolution note is added | F-001 |
| 98 | Start iteration | evidence | script-context note (`editIterationStatus.jsp:32,70`) | F-002 |
| 101 | Close iteration | evidence | pointer to the same page's script sink | F-002 |

- In total, 5 rows changed. No status changed.
- The workbook has 210 rows: 111 `Yes`, 77 `Inferred`, 21 `Partial` and 1 `No`.
- The 31 provenance notes are unchanged.
- **Reconnaissance sections changed** (anchors in `out/recon-sections-09.txt`):
  - reading block;
  - Scope And Provenance: snapshot date, analyst, loaded skill;
  - Source Inventory: Spring MVC pages row;
  - Runnable Surfaces: settings pages row, public-page texts bullet;
  - Build, Run, And Test Evidence: legacy hash row, `unauth-06` row, props tool row, 3 new tool rows, final-build figure, `audit:project`, `audit:artifact-links`, `artifact-reading.js` and `audit:workbook:excel` rows;
  - GAP-007;
  - Q3 facts: the `returnto` and view-name fact (text and evidence) and the reflected-output fact (text, evidence and rows);
  - Return Correction Evidence: 4 new rows and the record paragraph;
  - Stage 1 Exit Checklist;
  - Error Prevention: BA-001-09 learning update and self-check, the BA-001-08 figure annotated, BA-001-08 marked historical.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are in RESULT BA-001-09.

- **Run in BA-001-09:**
  - the source checks and inventories (h)-(j) above;
  - the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`;
  - `sync:workbook-progress`, `audit:workbook`, `audit:project` and `audit:artifact-links`;
  - `artifact-reading.js` on the reconnaissance and on this record;
  - CHK-001 with `.migration-tmp/stage-01/tools/chk001-ba-001-09.js`: 24 line citations with content checks, every WAR line position in the BA-001-09 row, reconnaissance and record text, 6 negative checks with positive controls, and the row references;
  - CHK-007 and CHK-004 regeneration of the public-page figure and its per-bundle comparison;
  - the CHK-009 scan;
  - the legacy SHA-256;
  - `audit:workbook:excel`, once after the final write.
- **Retained, not rerun:** the BA-001-08 checks (d)-(g) and the earlier inventories. Their inputs are unchanged, and pass 007 verified them.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1: refine CHK-012 so that request-chosen view names and forward paths are resolved through the bundled framework (view-resolver prefixes, definition lookups), and include script-context navigation | Yes. The BA-001-08 check (e) counted only constant `redirect:` names and missed the prefix handling of the request-chosen Spring view name and the Tiles definition lookup. The BA-001-07 reflected-output inventory missed the second write of `returnto` into a button script. | Checks (h) and (i) |
| P-2: refine CHK-007 with CHK-004 so that page-text keys are counted over every key-taking attribute form and the layout and include chain, with positive controls, and compared in every bundle | Yes. The BA-001-08 figure (41) counted only `key` attributes on the page files. It missed a `titleKey` key, 2 layout footer keys and 1 key added by a tag handler in the layout. | Check (j) |

**Checklist admission (PM / Coordinator, after RESULT BA-001-09):** both proposals are admitted as refinements of existing checks, not as new IDs.

- **P-1** refines CHK-012: script contexts such as event handlers, and view names as the bundled framework resolves them.
- **P-2** refines CHK-007: page texts are counted over every key-taking attribute and the layout/include chain, with a positive control. CHK-004 already requires the per-variant comparison.

No duplicate check exists. [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) keeps CHK-001..CHK-012.


<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-003 and the directly related occurrences within the static boundary.
- **Independent verification:** not yet performed. The next control is Stage 2 `correction-validation` pass 008 by a new independent BA session, with root baseline pass 006 and previous control pass 007, after the correction PR, CI and owner merge.
- **Open for Stage 3 (BA):**
  - `/setting/redirect:<target>/list` and `/setting/forward:<path>/list` for a signed-in user;
  - a `returnto` value equal to a Tiles definition name;
  - the Cancel button of the iteration start and close page with a crafted `returnto`;
  - the login and error pages in a locale without `footer.message`.
- **Owner (deferred):** Q3 now also covers the Spring redirect, the Tiles case and the button script. Q2 and Q4 are unchanged.
- **Questions for PM:** none.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check, BA-001-09:** checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `6e01c409fc6b6a595f1ff618a7a0e474dcde9b084e368171f1e37489fe74ff32`. Applicable checks are CHK-001..CHK-012.
  - **CHK-001:** run by `chk001-ba-001-09.js`.
  - **CHK-002:** no permission condition changed.
  - **CHK-003:** the Tiles plug-in's definitions file and the Spring view resolver were confirmed as the consumers on the navigation path.
  - **CHK-004:** the 45 public-page keys were compared in all 10 bundles.
  - **CHK-005, CHK-006, CHK-008, CHK-010:** their inputs are unchanged, so their results are retained.
  - **CHK-007:** the public-page figure was regenerated with positive controls; the records were searched for the superseded 41.
  - **CHK-009:** scanned; see Credential Handling.
  - **CHK-011:** the surfaces are unchanged; only the text figure changed.
  - **CHK-012:** request-chosen navigation was resolved through the bundled framework (h), and script contexts were scanned (i).
- **Self-detected error, corrected before handoff:** row 60 first cited `RedirectView#createTargetUrl`, which this Spring version does not have. The logic is in `#renderMergedOutputModel`. The row edits were reverted to the pre-edit copies and run again.
- **Learning update:** reviewer proposals P-1 and P-2 above. The extra `navigation.top` key supports counting tag-handler texts in the layout chain under P-2. No project checklist edit is made by BA.

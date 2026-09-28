# Stage 2 Pass 008 Dispositions

**How was each source-backed observation of the invalid Stage 2 pass 008 checked against the legacy source, which directly related occurrences were corrected, and what was deliberately retained?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** PM writes the Correction Assignment section before authoring starts, as [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) and [Stage 2 Attempt Recovery](../../reviews/README.md#stage-2-attempt-recovery) require. The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) writes every other section.
- **Maintained / decided by:** The Stage 1 author records the actual result once per triggering attempt. PM checks that result against the assignment. The independent Stage 2 reviewer verifies it in a new pass and never edits it. The owner decides only owner-reserved questions.
- **Governing instructions:** Owner-approved Stage 1 remediation after a failed correction-validation attempt, under [Stage 2 Attempt Recovery](../../reviews/README.md#stage-2-attempt-recovery) and [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff).

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Remediation recorded for the pass-008 leads F-001..F-003 and the directly related occurrences; not yet independently verified**
>
> Pass 008 is invalid; its observations were used as leads and verified from the WAR. The Stage 1 author confirmed all three leads (F-003 narrowed for one figure) and ran three directly related checks:
> - **(k) shared framework registries:** the Tiles factory has 2 loaders and is filled by the Spring `TilesConfigurer`, so 5 definition names apply (`Inferred`: start-up order); 3 caches get entries keyed by request values;
> - **(l) public-page tag handlers:** 8 custom tag classes on the 5 public pages; only the breadcrumb performs a request-driven lookup, without sign-in, and prints names unescaped;
> - **(m) BA-001-09 figures:** 18 recounted with their rules; 4 corrected, 1 scope added.
>
> The stored-value output was assessed by impact: one bounded fact records the verified instance and the uninventoried scope, and no inventory was run. 3 rows changed, no status changed and no rows were added. No scope expansion was needed. Nothing here is independently verified.
>
> **Next:** PM checks RESULT BA-001-10 against the assignment; the correction PR, CI and owner merge follow, then one Stage 2 `correction-validation` pass 009 by a fresh independent BA with its own recovery assessment.
>
> **Details:** [Correction Assignment (PM)](#read-correction-assignment-pm) / [Disposition Summary](#read-disposition-summary) / [Related-Occurrence Checks](#read-related-occurrence-checks) / [EL Output Impact Assessment](#read-el-output-impact-assessment).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [Disposition Summary](#read-disposition-summary)
- [Lead Dispositions](#read-lead-dispositions)
  - [F-001 Shared Tiles factory and other navigation](#read-f-001-shared-tiles-factory-and-other-navigation)
  - [F-002 Public-page breadcrumb lookup](#read-f-002-public-page-breadcrumb-lookup)
  - [F-003 Figure reproducibility](#read-f-003-figure-reproducibility)
- [Related-Occurrence Checks](#read-related-occurrence-checks)
- [EL Output Impact Assessment](#read-el-output-impact-assessment)
- [Retained Work](#read-retained-work)
- [Scope Expansion](#read-scope-expansion)
- [Transport And Access Disclosure](#read-transport-and-access-disclosure)
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
- **Task:** BA-001-10, `ba` / `author`, Stage 1 remediation after the failed correction-validation attempt 008. The branch is `stage-01/pass-008-corrections`, created from `main` at `e5ec374b4d42fcac16e2e013aa49f25563b4d949` after PR #23 (process version Starter `b3fc045`).
- **Owner approval:** `ekzarov`, chat message on 2026-09-28, conditional on the merge of the process-maintenance PR #23. It became effective at that merge, 2026-09-28T11:17:50Z. The owner then confirmed "PR #23 слит, продолжай". It is recorded as `owner_approval` on the `stage-02 → stage-01` transition, with the exact pass 008 review scope.
  - The authorization covers bounded correction of the source-confirmed observations F-001..F-003 of pass 008 and their directly related mechanisms.
  - PM sets the boundary; BA verifies the observations against the source and corrects the affected records.
  - Unaffected reconnaissance is not redone.
  - The question of uncovered EL output is assessed separately by impact: it is not hidden, and the work is not widened automatically into a full reconnaissance.
  - This is remediation authority. It does not change the pass 008 verdict, which stays `invalid`, and it is not a `findings` verdict or an exit to Stage 3.

| Boundary | Assignment |
|---|---|
| Trigger and baseline | [`analysis/reviews/stage-02-pass-008.md`](../../reviews/stage-02-pass-008.md) (SHA-256 `0bfc7d9b6404aad91eab3797b9a641a6dce73bcb6891fd7ebd02a3c2bf4d8e3b`), result `invalid`, with evidence [`analysis/reviews/evidence/S02-P008/`](../../reviews/evidence/S02-P008/). Its observations F-001, F-002 and F-003 (all low) are **leads, not accepted evidence**: verify each against the source and do not cite the failed reviewer as having cleared anything. Baseline: [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `649870c13b4d4cc5a4c98b93c7608b8a16a57cc185586d1efcc165d50402d130` and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `df7437bed8e4c05074a3210ac74bda4ab30ebf9949860591a4a6a674261b5fdc` (210 rows), unchanged at `e5ec374`. Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) `599fbd661a9193a83d4d50cc62afad5d42de388d1bf16ef190a5a44386afcff2` (CHK-001..CHK-012). Legacy package [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`. Last valid control: pass 007 (`findings`); its F-001..F-003 were corrected in [`stage-02-pass-007-dispositions.md`](./stage-02-pass-007-dispositions.md). |
| Correction scope | **F-001 lead:** the shared Tiles definitions factory. Spring `TilesConfigurer` (`spring-web.xml:17-24`) loads `tiles-definitions.xml` and `tiles-pages.xml` and, by servlet start-up order, provides the factory that Struts reuses. So a `returnto` value can match 5 definition names (including `viewLayout`), not 4. Also: `ViewObjectAction#getForwardPath` is missing from the in-application navigation list. Correct the Q3 navigation fact, the reading block, the forwards-09 tool row and the self-check claims; mark the start-up dependency `Inferred`.<br>**F-002 lead:** the breadcrumb on the public `tiles:default` pages (`login.jsp`, `unexpectedError.jsp`). `NavigationBarTag` reads a request `oid`/`fkey`, loads the object through `IdSearchHelper#search` without sign-in or permission check, and prints its project, iteration, story, task or feature names through unescaped EL (`breadcrumb.tag:15,18`). Correct the Runnable Surfaces unauthenticated list and GAP-007, with pointers from rows 8, 56 and 185. State the scope of the 45-key figure, or add the failed-login message keys with a pointer to rows 12-13.<br>**F-003 lead:** two BA-001-09 figures that cannot be reproduced: `findForward` calls (the lead says 44 calls in 31 methods, 43 constant) and "77 dynamic outputs" in script contexts. Regenerate both from the WAR and state the counting rule next to each figure.<br>**Directly related checks (bounded):**<br>(k) Shared framework registries fed by request values: every loader and writer of the Tiles factory (and of any other registry a request value is resolved against) and the start-up order that decides which one the consumer holds.<br>(l) Tag handlers in the layout and include chain of every public page: request reads, data lookups and printed output with exposure. Only public pages; the same tag on signed-in pages adds no exposure.<br>(m) Every figure added or changed in BA-001-09: recount with the counting rule stated.<br>**EL output impact assessment (separate, by impact):** stored values printed through unescaped EL or other unescaped output are not covered by CHK-012 or by any current record claim. Assess the impact: which Stage 1 claims, if any, are affected, and whether a bounded fact (for example one GAP-007/Q3 fact with its evidence scope and the known instances) records it truthfully. Do **not** run a full inventory of all such outputs. If a truthful record needs a larger inventory, stop and send QUESTION to PM with the estimated scope: the owner decides.<br>**Exclusions:** no re-research of unaffected areas, epics or mechanisms; no runtime; no edits to sealed reviews, evidence or earlier disposition records; no decisions on Q2-Q4 (Q3 stays deferred: record observed behavior only); no credential values (A3, CHK-009). |
| Retained work | Everything outside the scope above stays at its existing identity, including the BA-001-08 and BA-001-09 corrections that pass 008 did not contradict. Pass 008 is invalid, so its matching checks and retention do not prove anything: justify retention by **absence of impact** from checks (k)-(m) against the source, not by pass 008 results. Record that reason for every retained area the checks touch. If a check finds a changed input, an unreliable baseline, a systemic omission or impact that cannot be bounded, record the trigger and tell PM at once before any expanded work. |
| Checks and outcome | For each lead: confirmed, narrowed or rejected with source evidence, plus the changed items. For each check (k)-(m) and the EL assessment: an inventory with counts and results. Also run: `audit:workbook`, `audit:project` and `audit:artifact-links`; `artifact-reading.js` on the reconnaissance and on this record; CHK-001..CHK-012, including CHK-007 figure regeneration; the CHK-009 credential scan result (hit count only); the legacy SHA-256; `audit:workbook:excel` once. For proposals P-1 (CHK-003), P-2 (CHK-011 with CHK-012) and P-3 (CHK-007), state whether the underlying errors are confirmed. List every changed row, cell and reconnaissance section, so that the next reviewer can regenerate the complete change set. |
| Next control | One Stage 2 `correction-validation` pass 009 by a fresh independent BA session: not an author, not a prior reviewer and not the failed reviewer of pass 008. It assesses recovery itself under [Stage 2 Attempt Recovery](../../reviews/README.md#stage-2-attempt-recovery). The proposed root is pass 006, the last valid coverage base is pass 007, and the last chronological attempt is pass 008. Before it: the correction PR, required CI and owner merge. The author self-check is not independent closure. PM checks the RESULT against this boundary before accepting it. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-10. The work was done by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`), who also wrote BA-001-01..09. The skill file `.agents/skills/migration-ba/SKILL.md` has git blob `fe88c4f8ed6385eba5e15dad3781dd2eff791de7`; it changed since BA-001-09.
- **Assignment section unchanged:** the section above was not edited. Its SHA-256, taken over the 7562 characters from the `read-correction-assignment-pm` anchor to its last line, is `3b627fa87f70c6d5dbf3e396d894727527ba4ef95729d6e785137939c0ca5d1a`. The value was the same at hand-off and after these sections were appended.
- **Process read before starting:**
  - [Stage 2 Attempt Recovery](../../reviews/README.md#stage-2-attempt-recovery);
  - [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff);
  - [Packet Transport Safety](../../agent_orchestration.md#packet-transport-safety);
  - [Credential-Safe Evidence](../../agent_orchestration.md#credential-safe-evidence).
- **Trigger and baseline validated:**
  - The trigger is [`analysis/reviews/stage-02-pass-008.md`](../../reviews/stage-02-pass-008.md) `0bfc7d9b…`, whose result is `invalid`. Its observations were used only as leads, and each one was verified from the WAR. No retention and no closure rests on that attempt.
  - The baseline is the reconnaissance `649870c1…` and the workbook `df7437be…` (210 rows). Both match the assignment and are unchanged at `e5ec374`.
  - The checklist is `599fbd66…` (CHK-001..CHK-012). The legacy SHA-256 values are unchanged.
- **Agreement with the boundary:** the boundary is accepted. The checks extend it in five places, each inside a lead or a named check:
  - **F-001:** the BA-001-08 site list of check (e) covered only `new ActionForward(String, boolean)`. The 11 single-argument forwards are now classified; only `ViewObjectAction#getForwardPath` carries a request value (see (k)).
  - **Check (k):** it found 3 shared caches that request-derived keys write to at runtime. One Q3 fact records them.
  - **F-002:** the failed-login messages add 10 keys named in code, not 4. The 45-key figure now states its scope; rows 12-13 are unchanged.
  - **Check (m):** the "8 own client scripts" of BA-001-09 are 9 under the stated filter. The 9th, the SWFObject v2.1 library, reads `location.search`, but no page loads it.
  - **EL assessment:** a bounded fact records it truthfully without an inventory (see EL Output Impact Assessment). No QUESTION was needed.
- **No expansion trigger:** no input changed, the baseline is reliable, and every result is bounded to named rows and sections. The stored-value output is a known uninventoried scope. It is recorded as such, not researched.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Lead (pass 008, invalid) | Severity | Disposition | Main source evidence | Changed records / rows | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | low | confirmed, extended (`ViewObjectAction`; the single-argument forwards; 3 caches) | `WAR:WEB-INF/classes/spring-web.xml:17-24`; `WAR:WEB-INF/web.xml:248,271`; `TilesConfigurer#afterPropertiesSet` (`spring-struts-3.0.5.RELEASE.jar`); `TilesUtilImpl#makeDefinitionsFactoryAccessible`, `TilesPlugin#initDefinitionsFactory`, `TilesRequestProcessor#initDefinitionsMapping`, `ActionServlet#getRequestProcessor` (`struts-1.2.9.jar`); `WAR:WEB-INF/tiles-pages.xml:6`; `ViewObjectAction#getForwardPath` | Q3 navigation fact and new cache fact; reading block; forwards-09 tool row; GAP-007; Error Prevention BA-001-09 claim annotated | owner via PM (Q3); BA (Stage 3) | not yet |
| F-002 | low | confirmed (`Inferred` for the EL coercion and runtime) | `NavigationBarTag#doEndTag`, `#setObject`, `#render`; `IdSearchHelper#search`; `WAR:WEB-INF/tags/breadcrumb.tag:10,15,18`; `WAR:WEB-INF/jsp/layout/defaultLayout.jsp:44`; `WAR:WEB-INF/security.xml:3`; `WAR:WEB-INF/classes/spring-dao.xml:61` | rows 8, 56, 185; Runnable Surfaces unauthenticated list and public-page scope; public-keys tool row; GAP-007; Q3 breadcrumb fact | owner via PM (Q3); BA (Stage 3) | not yet |
| F-003 | low | confirmed for `findForward`; narrowed for the 77 outputs | `navsites-10.js`, `script-sinks-10.js`, `recount-10.js` | forwards-09 and script-sinks-09 tool rows | none | not yet |

<a id="read-lead-dispositions"></a>

## Lead Dispositions

<a id="read-f-001-shared-tiles-factory-and-other-navigation"></a>

### F-001 Shared Tiles factory and other navigation

- **Source check:** the Tiles definitions factory is shared, and the Spring loader fills it.
  - **Spring loader:** `spring-web.xml:17-24` defines a `TilesConfigurer` (`spring-struts-3.0.5.RELEASE.jar`, factory class `I18nFactorySet`) with `tiles-definitions.xml` and `tiles-pages.xml`. `#afterPropertiesSet` calls `#createDefinitionsFactory`, then `TilesUtil#createDefinitionsFactory`. `TilesUtilImpl#makeDefinitionsFactoryAccessible` stores the factory under the servlet-context attribute `org.apache.struts.tiles.DEFINITIONS_FACTORY`, without any condition.
  - **Struts loader:** `TilesPlugin#initDefinitionsFactory` (`moduleAware` defaults to false, so `TilesUtilStrutsImpl` is used) reads the same attribute. If a factory exists, it logs "Factory already exists … No new creation"; otherwise it creates one from `tiles-definitions.xml` only.
  - **Consumer:** `TilesRequestProcessor#initDefinitionsMapping` reads the same attribute. The processor is created on the first request (`ActionServlet#getRequestProcessor`, called from `#process`), after all load-on-startup servlets.
  - **Start-up order:** the Spring servlet has load-on-startup 1 (`web.xml:271`) and the Struts servlet has 2 (`web.xml:248`). Even in the reverse order, the Spring loader overwrites the attribute. So the Struts processor is expected to hold the factory with 5 names: `tiles:default`, `tiles:view`, `tiles:print`, `tiles:edit` and `viewLayout` (`tiles-pages.xml:6`). This is `Inferred`: container behavior and runtime are unverified.
- **Other navigation:** `ViewObjectAction#getForwardPath` forwards, without a redirect, to the fixed `display` path with the URL-encoded `returnto` appended. It stays inside the application.
- **Correction:**
  - The Q3 navigation fact states the 5 names, the loader chain and the start-up dependency, and lists `ViewObjectAction`.
  - The reading block and the forwards-09 tool row are corrected.
  - The BA-001-09 CHK-012 self-check line and the pass-007 checks (h)-(j) row are annotated as incomplete.

<a id="read-f-002-public-page-breadcrumb-lookup"></a>

### F-002 Public-page breadcrumb lookup

- **Source check:** the breadcrumb looks up a request-named object on the public pages.
  - `breadcrumb.tag:10` passes `type="${objectType}"`. When the tag attribute is not set, the EL value is expected to be coerced to an empty string (`Inferred`).
  - `NavigationBarTag#doEndTag` reads the request `oid`, or else `fkey` (`NumberUtils.toInt`). With a positive id and a non-null type it calls `#setObject(int)`, which uses `IdSearchHelper#search` for a blank type.
  - That method runs `Session#get` over Project, Iteration, UserStory, Task, Person and Note, and contains no permission or security call. The bean is at `spring-dao.xml:61` in the root context; `RequestContextUtils#getWebApplicationContext` falls back to the root context outside the Spring MVC servlet.
  - `#render` adds links whose texts are the hierarchy names, and `breadcrumb.tag:15,18` prints them with unescaped EL.
  - `login.jsp` and `unexpectedError.jsp` use this layout, and `/do/login` is in the bypass list (`security.xml:3`).
- **Page-text scope:** `WAR:WEB-INF/jsp/security/login.jsp:50-59` prints messages queued in code. The bytecode names 10 such keys: `login.failed` and 9 `authentication.module.message.*` keys. Three of those are only in the disabled JNDI and NTLM modules. Rows 12-13 describe the 4 that the XPlanner module path produces. Per bundle, `authentication.module.message.storageError` exists only in the default bundle (`out/login-messages-10.txt`).
- **Correction:**
  - Rows 8, 56 and 185 record the lookup.
  - The Runnable Surfaces unauthenticated list gets a lookup bullet, and the public-page bullet states its scope.
  - The public-keys tool row states the scope.
  - GAP-007 and a new Q3 fact record the lookup.

<a id="read-f-003-figure-reproducibility"></a>

### F-003 Figure reproducibility

- **`findForward`: confirmed.** `navsites-10.js` counts one call site per invoke instruction and one method per class, name and descriptor, disassembling each class once. It finds 44 calls in 31 methods: 43 with a constant name and 1 with the mapping parameter. BA-001-09's `forwards-09.js` disassembled by method name for every method entry. It therefore listed overloaded methods twice and merged them into one method, which gave 46 in 30.
- **The 77 outputs: narrowed.** `script-sinks-10.js` reproduces 77 under a rule that is now stated in the reconnaissance: 32 outputs in `<script>` opening tags, 27 in event handlers and 18 in script bodies. The error was the missing rule, not the count.
- **Correction:** both tool rows now carry the rule.
- **Record not edited:** the pass-007 correction record, which is an earlier disposition record, keeps its figures. They are corrected here and in the reconnaissance.

<a id="read-related-occurrence-checks"></a>

## Related-Occurrence Checks

**(k) Shared framework registries fed by request values.** Tools: `navsites-10.js` and `disasm.js` listings in `out/tiles-listings-10*.txt`, `out/registry-listings-10*.txt` and `out/actionservlet-10.txt`.

| Registry | Loaders or writers | Consumer and start-up order | Request-derived key | Result |
|---|---|---|---|---|
| Tiles definitions factory (`org.apache.struts.tiles.DEFINITIONS_FACTORY`) | Spring `TilesConfigurer` (2 files, always stores); Struts `TilesPlugin` (1 file, only when none exists) | Struts request processor (created on the first request), Tiles JSP tags; Spring servlet load-on-startup 1, Struts servlet 2 | `returnto` of the 13 redirect methods | 5 names (F-001) |
| Tiles per-locale factories (`FactorySet#getFactory`, `I18nFactorySet#getDefinitionsFactoryKey`) | one entry per distinct session locale | every definition lookup | session locale from `ChangeLocaleAction` (`language`, unvalidated) or `RequestProcessor#processLocale` (`Accept-Language`) | cache fact (Q3) |
| Struts message resources (`PropertyMessageResources#getMessage`, `#loadLocale`) | one locale entry and its messages per distinct locale | every `bean:message` | same locale | cache fact (Q3) |
| Spring view cache (`AbstractCachingViewResolver#resolveViewName`, cache on by default) | one view per distinct view name | the Spring MVC servlet | `{objectType}` path value (`CommonObjectHandler`) | cache fact (Q3) |
| Struts forward configurations (`ActionMapping#findForward`, `ModuleConfig#findForwardConfig`) | descriptors only | actions, `LinkTag#hyperlink` | none: 43 constant names, 1 mapping parameter | no change |
| Struts forward paths | 11 `new ActionForward(String)` in 10 methods: 9 configured input paths, 1 id path (`MoveStoriesAction`), 1 fixed path with the URL-encoded `returnto` (`ViewObjectAction`); 20 `new ActionForward(String, boolean)` in 19 methods (BA-001-08 list); 1 `setPath` | Tiles lookup first, then redirect or forward | only the 13 `returnto` methods can equal a definition name | no change beyond F-001 |

**(l) Tag handlers in the layout and include chain of the public pages.** Tool: `public-tags-10.js` (`out/public-tags-10.txt`). The public pages are the 5 of the unauthenticated list. `notAuthorized.jsp` and `invalidateCache.jsp`, the pages of the other two bypass entries, are absent from the WAR.

| Page | Custom tag (class) | Request reads | Data lookups | Printed output | Exposure without sign-in |
|---|---|---|---|---|---|
| login, error | `xplanner:navigation` in `breadcrumb.tag` (`NavigationBarTag`) | `oid`, `fkey` | `IdSearchHelper#search`, `Session#load` | hierarchy names, unescaped EL | yes (F-002) |
| login, error | `xplanner:content` (`ContentTag`) | `print` switch via `PrintLinkTag#isInPrintMode` | none | layout choice | already recorded (row 192) |
| login, error | `xplanner:contentTitle` (`ContentTitleTag`) | none (page attribute) | message resources | page title | bundle text only |
| error | `xplanner:box`, `xplanner:boxedList` (`BoxTag`, `BoxedListTag`) | the failing request's own parameters and attributes | none | HTML-encoded listing | already recorded (rows 55-56) |
| login, error | `xplanner:authenticatedUser` (`AuthenticatedUserTag`) | session principal | query for the signed-in person | nothing without sign-in | none |
| login, error | `xplanner:link` (`LinkTag`) inside `<c:if test="${not empty person}">` | navigation parameters | none | link | none (signed-in only) |
| `wap/login.jsp` | `db:useBeans` (`UseBeansTag`) | none | visible projects (fixed query) | never printed | none |
| `index.jsp` | `db:useBeans` (`UseBeansTag`) | none | visible projects | redirect target id | already recorded (row 18) |
| `calendar-i18n.jsp` | none | — | — | bundle texts | none |

Framework tag libraries (Struts `html`, `bean`, `logic`, `tiles`; JSTL `c`) were named, not traced. Their request reads are the documented tag contracts (GAP-011).

**(m) Recount of every BA-001-09 figure.** Tools: `figures-09-10.js` lists the figures mechanically (41 entries from 44 changed reconnaissance lines and the 5 row notes); `recount-10.js` recounts them (`out/recount-10.txt`, with the rule for each figure).

| Figure (BA-001-09) | BA-001-09 | Recount | Counting rule (short) |
|---|---|---|---|
| Tiles names a `returnto` can match | 4 | **5** | `<definition name>` in the 2 files of the shared factory |
| `findForward` call sites / methods / constant | 46 / 30 / 45 | **44 / 31 / 43** | one per invoke instruction; methods by name and descriptor |
| `findForward` with another argument | 1 | 1 | `DispatchForward#execute` (mapping parameter) |
| JSP and tag files | 74 | 74 | `.jsp`, `.tag`, `.tagx`, `.jspf`, `.inc` |
| Script contexts | 103 | 103 | `<script>` elements once, `on*` values, `javascript:` URLs |
| Dynamic outputs in them | 77 | 77 | 32 opening tags, 27 handlers, 18 bodies |
| Request values unescaped / host-derived / other | 2 / 1 / 74 | 2 / 1 / 74 | categories as in the recount output |
| Own client scripts checked | 8 | **9** | `*.js` outside the named libraries; the 9th, SWFObject v2.1, is loaded by no page |
| Public-page keys rendered without a session | 45 | 45 | keys named by the page and layout chain, the 2 scriptlet keys and the tag-handler key |
| Static page keys / signed-in only / HTML comment | 39 / 4 / 1 | 39 / 4 / 1 | as stated in the tool |
| Failed-login keys queued in code | not stated | **10** (scope added) | `login.failed` and `authentication.module.message.*` constants |
| Bundles compared | 10 | 10 | `ResourceBundle*.properties` |

Other figures in BA-001-09 text are unchanged workbook counts (210, 111, 77, 21, 1), row numbers or process numbers, and were regenerated by the workbook build.

<a id="read-el-output-impact-assessment"></a>

## EL Output Impact Assessment

- **Question:** stored values printed through unescaped EL or other unescaped output are not covered by CHK-012, which covers request-derived values, nor by any record claim.
- **Claims affected:** none is made false.
  - No record states that stored values are escaped.
  - The escaping statements in the records concern request values (the Q3 reflected-output fact), the error-page listing (`BoxedListTag`, HTML-encoded) and framework tag contracts.
  - Row 189 (TWiki formatting) states formatted HTML output; it makes no escaping claim.
- **Facts established without an inventory:**
  - The descriptor is Servlet 2.4 with EL not ignored, so `<%= %>` and template-text EL are printed as they are. `bean:write` escapes by default: 85 uses, none with `filter="false"`.
  - One stored-value instance is verified: the breadcrumb names (`breadcrumb.tag:15,18`), on every layout page and before sign-in on the public pages.
  - Some pages escape explicitly, for example the delete confirmations with `StringEscapeUtils.escapeJavaScript` (`notes.jsp:58`).
  - A size estimate (`el-estimate-10.js`) counts expressions only: 790 `<%= %>` and 114 template-text EL expressions in 65 of 74 JSP and tag files. Their sources and escaping are not classified.
- **Bounded record:** one Q3 fact and one GAP-007 clause state the verified instance, the container rule and the uninventoried scope with its estimate. This is truthful without a larger inventory, so no QUESTION was sent.
- **Recommendation for PM and the owner:** do not inventory in Stage 1. If the owner wants the stored-value output classified, the scope is about 900 expressions in 65 files, each traced to its source (stored, request, constant, id) and its escaping. It fits a Stage 3 or Stage 9 security task better than Stage 1 parity work. Until then the fact states that the records do not inventory it.

<a id="read-retained-work"></a>

## Retained Work

Each retained area below was touched by a check. It is retained because the check shows, from the source, that its inputs are not affected. No pass-008 result is used.

| Retained area | Check | Absence-of-impact reason |
|---|---|---|
| Row notes on the `returnto` redirect (rows 43, 46, 58, 62, 78, 88, 121, 134, 149) | (k) | The fifth definition name only widens the fixed layout set, which the Q3 fact they point to now states. The redirect of any other value is unchanged. |
| Row 60 and the Spring view-name outcome | (k) | The Spring view resolver does not consult Tiles (its Tiles resolver is commented out at `spring-web.xml:31-35`). The only new fact, the view cache, is recorded in the cache fact. |
| Rows 10, 18, 97, 182 and the other fixed-target navigation | (k) | The 11 single-argument and 20 two-argument forward sites were classified; their paths are constants, ids, configured inputs or full URLs. |
| Rows 12, 13 | (l) | Their per-bundle statements for the 4 keys they describe are unchanged (recomputed in `out/login-messages-10.txt`). |
| Rows 55, 192 | (l) | `BoxedListTag` and `ContentTag` read only the failing request and the `print` switch, as recorded. |
| Row 18 (`index.jsp`) and `wap/login.jsp` | (l) | Their only custom tag is a fixed query; nothing request-driven is printed. |
| Rows 98, 101, 114 and the Q3 reflected-output fact | (m) | The script-context figures and the 2 request sinks reproduce. |
| The public-key per-bundle notes of rows 8 and 56 | (m) | The 45 keys and their per-bundle presence reproduce. |
| BA-001-08 corrections (binding, exports, configuration figures) | none | Not inputs of the corrected mechanisms. |
| Owner decisions Q1-Q4, provenance notes P-01..P-07, earlier disposition records | none | Unchanged. |

<a id="read-scope-expansion"></a>

## Scope Expansion

None. The extensions in Scope Validation lie inside the leads and checks (k)-(m). The stored-value output is recorded as an uninventoried scope, not researched.

<a id="read-transport-and-access-disclosure"></a>

## Transport And Access Disclosure

- **In BA-001-10:**
  - Large outputs were written to `.migration-tmp/stage-01/out/`: disassembler listings, the PM-section extract, the transport-rule extract and the tool outputs. They were read only in bounded excerpts.
  - Temp and cache paths were set to `.migration-tmp/temp` and `.migration-tmp/npm-cache`.
  - No file outside the allowed folders was opened.
- **Earlier in this author session (BA-001-08), disclosed now:** one Bash command waited on standard input and was moved to the background by the client. The client persisted its output under the user-profile temp folder. The command was stopped, and that output file was never opened or read. Nothing from it entered any record.

<a id="read-credential-handling"></a>

## Credential Handling

- **Rule:** no password, key, token or login pair is written in any record, row, script or scratch output (A3, CHK-009). The new facts name setters, classes and keys only.
- **Scan:** `.migration-tmp/stage-01/tools/chk009-scan-10.js`, a copy of `chk009-scan-09.js` retargeted to this record and to the files touched in BA-001-10. It prints categories, file names and counts only.
- **Result:** reported as a hit count in RESULT BA-001-10.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff compares `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-10.js` with the final row data (`diff-rows-10.js`). The full before and after texts are in `out/changed-rows-10-full.txt`. No rows were added or removed.

| Row | Scenario | Cells changed | Change | Source |
|---|---|---|---|---|
| 8 | Log in with valid credentials | evidence | appended: breadcrumb lookup note; page-text scope (failed-login keys, rows 12-13) | F-002 |
| 56 | Error pages | evidence | appended: breadcrumb lookup note | F-002 |
| 185 | Breadcrumb navigation | evidence | appended: request-driven lookup, no permission check, unescaped names | F-002 |

- In total, 3 rows changed. No status changed: 111 `Yes`, 77 `Inferred`, 21 `Partial`, 1 `No`. The 31 provenance notes are unchanged.
- **Reconnaissance sections changed** (anchors in `out/recon-sections-10.txt`):
  - reading block;
  - Scope And Provenance: snapshot date, analyst, loaded skill;
  - Runnable Surfaces: public-page scope and the new lookup bullet;
  - Build, Run, And Test Evidence: forwards-09, script-sinks-09 and public-keys rows, legacy hash row, 3 new tool rows, final-build figure, `audit:project`, `audit:artifact-links`, `artifact-reading.js` and `audit:workbook:excel` rows;
  - GAP-007;
  - Q3 facts: the `returnto` fact (5 names, loader chain), other navigation (`ViewObjectAction`), navigation evidence, and 3 new rows (breadcrumb lookup, caches, stored-value output);
  - Return Correction Evidence: pass-007 (h)-(j) row annotated, 4 new rows and the record paragraph;
  - Stage 1 Exit Checklist;
  - Error Prevention: BA-001-10 learning update and self-check, the BA-001-09 CHK-012 line annotated, BA-001-09 marked historical.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are in RESULT BA-001-10.

- **Run in BA-001-10:**
  - the source checks and inventories (k)-(m) and the EL impact assessment above;
  - the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`;
  - `sync:workbook-progress`, `audit:workbook`, `audit:project` and `audit:artifact-links`;
  - `artifact-reading.js` on the reconnaissance and on this record;
  - CHK-001 with `chk001-ba-001-10.js`: 16 line citations with content checks, every WAR line position in the BA-001-10 text, 7 negative checks with positive controls, and 12 row references;
  - CHK-007 recount of every BA-001-09 figure;
  - the CHK-009 scan;
  - the legacy SHA-256;
  - `audit:workbook:excel`, once after the final write.
- **Retained, not rerun:** the BA-001-08 checks (d)-(g) and the earlier inventories, whose inputs are unchanged. The BA-001-09 checks (h)-(j) were rerun only where (k)-(m) required it.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission. The attempt that proposed these is invalid, so this record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed? | Basis |
|---|---|---|
| P-1 (refine CHK-003): every writer of a shared framework registry, and the start-up order that decides which one the consumer holds | Yes. BA-001-09 stated 4 Tiles names from the Struts plug-in alone; the Spring `TilesConfigurer` fills the shared factory with a fifth. Check (k) also found three runtime cache writers keyed by request values. | Check (k) |
| P-2 (refine CHK-011 with CHK-012): every tag handler in a public page's layout and include chain, traced for request reads, data lookups and output | Yes. BA-001-09 traced `NavigationBarTag` for keys only and missed its request-driven lookup and unescaped output on the public pages. | Check (l) |
| P-3 (refine CHK-007): the counting rule next to each figure | Yes. The `findForward` figure was wrong because of its counting method, and the 77 outputs could not be reproduced without the rule. | Check (m) |

**Checklist admission (PM / Coordinator, after RESULT BA-001-10):** the author confirmed all three underlying errors from the source. PM admits them as refinements of existing checks, not new IDs. The confirmation rests on the source, not on the invalid pass 008.

- **P-1** refines CHK-003: every writer of a shared registry, and the start-up order.
- **P-2** refines CHK-011: the request reads, data lookups and output of tag handlers in each public page's layout chain. CHK-012 already covers the sinks.
- **P-3** refines CHK-007: each figure states its counting rule.

No duplicate check exists. [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) keeps CHK-001..CHK-012.


<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for the three leads and the directly related occurrences within the static boundary. The stored-value output is recorded as an uninventoried scope, for the owner to decide.
- **Independent verification:** not yet performed. The next control is one Stage 2 `correction-validation` pass 009 by a fresh independent BA session with its own recovery assessment (proposed root pass 006, last valid coverage base pass 007, last attempt pass 008), after the correction PR, CI and owner merge.
- **Open for Stage 3 (BA):**
  - `/do/login?oid=<id>` and the error page with an `oid`;
  - a `returnto` of `viewLayout`;
  - distinct `language` or `Accept-Language` values and `{objectType}` values against memory;
  - the effective Tiles factory after start-up.
- **Owner:** Q3 now also covers the breadcrumb lookup, the caches and the stored-value output. The owner decides whether stored-value output needs an inventory (EL assessment).
- **Questions for PM:** none.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check, BA-001-10:** checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `599fbd661a9193a83d4d50cc62afad5d42de388d1bf16ef190a5a44386afcff2`. Applicable checks are CHK-001..CHK-012.
  - **CHK-001:** run by `chk001-ba-001-10.js`.
  - **CHK-002:** the new notes state the absence of a permission check (`IdSearchHelper`) with a negative check.
  - **CHK-003:** all loaders and consumers of the Tiles factory and the start-up order were traced.
  - **CHK-004:** the per-bundle presence of the 10 failed-login keys was recomputed. No per-bundle row statement changed.
  - **CHK-005, CHK-006, CHK-008, CHK-010:** their inputs are unchanged, so their results are retained.
  - **CHK-007:** every BA-001-09 figure was recounted with its rule.
  - **CHK-009:** scanned; see Credential Handling.
  - **CHK-011 and CHK-012:** the public-page tag handlers were traced for request reads, lookups and output.
- **Self-detected errors, corrected before handoff:**
  - The BA-001-08 check (e) site list omitted the 11 single-argument forwards.
  - The BA-001-09 script count excluded the SWFObject library without saying so.
  - A first draft of the stored-value fact cited the delete confirmations as unescaped; they apply JavaScript escaping. The draft was changed before it was applied.
- **Learning update:** see the proposals above. No project checklist edit is made by BA.

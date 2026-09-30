# Stage 2 Pass 010 Dispositions

**How was each Stage 2 pass 010 finding checked against the source and the WAR, which directly affected statements were corrected, and what was retained?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** PM writes the Correction Assignment section before authoring starts, as [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) requires. The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) writes every other section.
- **Maintained / decided by:** The Stage 1 author records the actual result. PM checks it against the assignment. The independent Stage 2 reviewer verifies it in a new pass.
- **Governing instructions:** Stage 1 re-entry under the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol), constitution A4 and [`analysis/source-assessment-001.md`](../../source-assessment-001.md).

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Pass-010 F-001..F-005 and pass-009 F-003 corrected in Stage 1 (BA-001-12); not yet independently verified**
>
> All six findings were confirmed from the source and the WAR bytecode and corrected within the boundary:
> - **F-001:** correspondence figures kept under stated rules and regenerated; `LinkTag` and `AbstractFormat` recorded as divergent (WAR governs).
> - **F-002:** a note id lists or opens the note's parent object (rows 178-184); rows 180 and 182 stay `Yes` on a method-level reading.
> - **F-003:** the static editor converters use the server default locale's patterns, and the decimal parser the first request's locale (rows 69-71, 89, 186; `Inferred` for the runtime effect).
> - **F-004:** row 216 is back to `Inferred`.
> - **F-005:** the BA-001-11 change description is corrected here.
> - **Pass-009 F-003:** the script-context figure reproduces under its stated rule (78).
>
> 10 rows changed; statuses after: 168 `Yes`, 20 `Inferred`, 21 `Partial`, 1 `No`. No rows were added.
>
> **Next:** PM checks RESULT BA-001-12; then a correction PR and a new independent correction-validation by a fresh BA.
>
> **Details:** [Correction Assignment (PM)](#read-correction-assignment-pm) / [Disposition Summary](#read-disposition-summary) / [Changed Rows](#read-changed-rows) / [Record Corrections To BA-001-11](#read-record-corrections-to-ba-001-11).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Correspondence claims](#read-f-001-correspondence-claims)
  - [F-002 Note id resolution](#read-f-002-note-id-resolution)
  - [F-003 Static converters and number parser](#read-f-003-static-converters-and-number-parser)
  - [F-004 Row 216](#read-f-004-row-216)
  - [F-005 Record accuracy](#read-f-005-record-accuracy)
  - [Pass-009 F-003 Counting rule](#read-pass-009-f-003-counting-rule)
- [Record Corrections To BA-001-11](#read-record-corrections-to-ba-001-11)
- [Changed Rows](#read-changed-rows)
- [Live Questions](#read-live-questions)
- [Retained Work](#read-retained-work)
- [Scope Expansion](#read-scope-expansion)
- [Transport And Access Disclosure](#read-transport-and-access-disclosure)
- [Credential Handling](#read-credential-handling)
- [Checks Performed](#read-checks-performed)
- [Reviewer Checklist Proposals](#read-reviewer-checklist-proposals)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-correction-assignment-pm"></a>

## Correction Assignment (PM)

- **Written by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, before authoring started. The Stage 1 author does not rewrite this section.
- **Task:** BA-001-12, `ba` / `author`, Stage 1 finding-driven re-entry. The branch is `stage-01/pass-010-corrections`, created from `main` at `fda55e261bb4b1e0d7fed488a782c31a9ba77ab6` after PR #32.
- **Authority:**
  - Option A was chosen by Codex as the operator under the owner's relayed operational mandate until Stage 4 entry ([project departure](../../maintenance/process-departure-2026-09-30-operational-mandate.md)). Mandate text: «вообще я бы тебе отдал пока полный контроль до 4 шага чтобы ты меня не спрашивал больше и делал все сам».
  - No new personal owner approval is claimed.
  - The choice corrects the found inaccuracies. It accepts no new risk and carries no finding forward; waivers and the carryover of new findings stay reserved to the owner.

| Boundary | Assignment |
|---|---|
| Trigger and baseline | **Trigger:** [`analysis/reviews/stage-02-pass-010.md`](../../reviews/stage-02-pass-010.md) (SHA-256 `f567227da6872e947656dd47ceb0d5958bcf546234097a4f50c16be7aadd8f78`), with the ledger [`analysis/reviews/evidence/S02-P010/comparison-results.json`](../../reviews/evidence/S02-P010/comparison-results.json). Findings F-001..F-005 (all low) plus pass-009 F-003, which is still open.<br>**Baseline:** [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `7c57c86472a8431bbadbc79a3aec9ce04be6b939908b095ad25d5ea8938cad56`, [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `8eb58ab39bd9ca218b2b240f4555c76447b5a8dfbf2f0efa50930f02fd09da3c` (210 rows: 169 `Yes`, 19 `Inferred`, 21 `Partial`, 1 `No`) and [`source-reconciliation-001.md`](./source-reconciliation-001.md) `b3d65a92…965f`.<br>**Sources:** the upstream source in `sources/xplanner-plus-r426/` (A4) and the authoritative WAR [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) `46ff9dc0…4edc`. |
| Correction scope | **F-001 (correspondence claims):** narrow the global source-to-WAR correspondence statements to what is actually proven. Name all known divergent classes (`ViewPersonAction`, `LinkTag#addNavigationParameters`, `AbstractFormat#getFormat`). Either state a reproducible counting rule for each figure (4597 methods; 3386/155 constants) or remove the figure. Do not expand the comparison to obtain a better number.<br>**F-002 (note id resolution):** correct rows 178-184 where affected, the row 178 note and the Q3 read-check fact, so that a note id resolves to the note's parent. Status of rows 180 and 182: keep `Yes` only if a method-level reading supports the corrected claim; otherwise return them to `Inferred`.<br>**F-003 (static converters, number parser):** rows 69-71, 89 and the row 186 wording, plus the Q3 registry fact: record the static editor date converters in the server default locale and the number parser fixed by the first request's locale (`Inferred` for the runtime effect).<br>**F-004 (row 216):** return row 216 to `Inferred` unless a method-level basis is actually found and cited.<br>**F-005 (record accuracy):** in [`source-reconciliation-001.md`](./source-reconciliation-001.md) do not rewrite the author sections. Record the correction in this record: in 31 rows the note was inserted before the provenance sentence, and the `audit:artifact-links` row is an omitted changed section.<br>**Pass-009 F-003 (counting rule):** apply or narrow the script-context counting rule so that the figure is reproducible as written, or remove the figure.<br>**Directly affected only:** also correct any statement that repeats the same wrong claim. **Exclusions:** no new reconnaissance; no new inventories; no changes outside the findings and their directly affected statements; 210 rows, IDs and evidence prefixes preserved; WAR unchanged and authoritative; no runtime; no credential values (A3, CHK-009): the 39 withheld files are cited by path only. |
| Retained work | Everything else stays at its existing identity, including the 55 status changes that pass 010 confirmed. Retention is justified by absence of impact from the corrected findings. |
| Checks and outcome | For each finding: confirmed, narrowed or rejected with source and WAR evidence, plus the changed items. The exact changed rows, cells and sections, before and after. Status counts before and after. Run `audit:workbook`, `audit:project -- --require-source-ready`, `audit:artifact-links`, `artifact-reading.js` on the changed records, the CHK-001..CHK-012 self-check, the CHK-009 hit count and the legacy SHA-256; run `audit:workbook:excel` once only if the workbook changes. **Transport safety:** large output goes to `.migration-tmp/stage-01/**`; never open client-persisted output outside the allowed folders. |
| Next control | A new independent correction-validation by a fresh BA (not an author or earlier reviewer), with root 006, previous 010 and coverage base 010. It checks these corrections and their impact and keeps justified coverage. The author self-check is not independent closure. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-12. The work was done by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`), who also wrote BA-001-01..11. The skill file `.agents/skills/migration-ba/SKILL.md` has git blob `560391d617ed24f5269b9d594c65056348e9f021`, unchanged since BA-001-11.
- **Assignment section unchanged:** the section above was not edited. Its SHA-256, taken over the 5179 characters from the `read-correction-assignment-pm` anchor, is `f80ebce1a5ea7490b82f5bd15182c7e80764811656d627b58b1d7437f7b3b737`. The value was the same at hand-off and after these sections were appended.
- **Inputs validated (SHA-256):**
  - the trigger [`analysis/reviews/stage-02-pass-010.md`](../../reviews/stage-02-pass-010.md) `f567227da6872e947656dd47ceb0d5958bcf546234097a4f50c16be7aadd8f78` and its ledger [`comparison-results.json`](../../reviews/evidence/S02-P010/comparison-results.json) `bc7b42679b16f702195023e084e123c8da2670d2181c26a49139401c638ba6aa`;
  - the baseline: the reconnaissance `7c57c864…ad56`, the workbook `8eb58ab3…da3c` (210 rows: 169 `Yes`, 19 `Inferred`, 21 `Partial`, 1 `No`) and [`source-reconciliation-001.md`](./source-reconciliation-001.md) `b3d65a92…965f`, all as assigned;
  - the WAR `46ff9dc0…4edc` (unchanged), the checklist `8a15e08c…a90b` (CHK-001..CHK-012) and the pass-009 carryover record `14dc9dc3…f04f`.
- **Process read before starting:** the ASSIGN BA-001-12 block, the assignment above, the pass-010 findings and proposals, and the pass-009 F-003 finding with its carryover entry.
- **Agreement with the boundary:** accepted without challenge. The corrections stay inside the findings and the statements that repeat them. Two items were found inside the assigned checks and are recorded, not researched further:
  - the enumeration of static formatter fields for F-003 found 3 fields filled at class initialization, one of which formats the daily column headers of the personal timesheet (added to the Q3 registry fact; no row claims otherwise, so no row changed);
  - the `numberConverter` of `AbstractEditorForm` uses the server default locale (added to the same fact).
- **Not widened (F-001):** the correspondence figures were regenerated under the BA-001-11 rules. The method-body comparison of all classes that P-1 proposes was not run, because the assignment forbids widening the comparison. The records state the limitation instead.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding (severity) | Disposition | Main source and WAR evidence | Changed records and rows | Status change | Independent verification |
|---|---|---|---|---|---|
| Pass-010 F-001 (low): correspondence claims | confirmed; figures kept with stated counting rules and regenerated; 2 further divergent classes recorded | `corr-recount-12.js` (4739 - 84 - 23 - 35 = 4597; 3892 - 388 - 118 = 3386); listings of `LinkTag#addNavigationParameters` and `AbstractFormat#getFormat` against `SRC:src/com/technoetic/xplanner/tags/LinkTag.java` and `SRC:src/com/technoetic/xplanner/format/AbstractFormat.java` | reconnaissance reading block, Scope And Provenance correspondence bullets, method-corr tool row, BA-001-11 CHK-007 line; the Source Correspondence section of the BA-001-11 record is corrected here | none | not yet |
| Pass-010 F-002 (low): note id resolution | confirmed | `SRC:src/com/technoetic/xplanner/db/IdSearchHelper.java IdSearchHelper#search`; `SRC:src/net/sf/xplanner/domain/Note.java Note#getParent`; `SRC:src/com/technoetic/xplanner/tags/DomainContext.java DomainContext#getNoteTarget`; `SRC:src/com/technoetic/xplanner/db/OLDIdSearchHelper.java OLDIdSearchHelper#search`; `ContentSearchAction#doExecute`, `IdSearchAction#doExecute`, `HibernateSessionFilter#doFilter` listings; `WAR:WEB-INF/web.xml:147-152` | rows 178 (note), 180, 182, 184; Q3 read-check fact; reading block | none: rows 180 and 182 stay `Yes` on a method-level reading of the corrected claim | not yet |
| Pass-010 F-003 (low): static converters and number parser | confirmed; runtime effect `Inferred` | `SRC:src/com/technoetic/xplanner/forms/AbstractEditorForm.java AbstractEditorForm#initConverters`; `SRC:src/com/technoetic/xplanner/format/DecimalFormat.java DecimalFormat#DecimalFormat`; `IterationEditorForm#validate`, `#toString`, `#reset`; `TimeEditorForm#valideRow`; `TaskEditorForm#validate`; `UpdateTimeAction#getDateFormat`; Struts `MessageResources#getMessage` listings (`WAR:WEB-INF/lib/struts-1.2.9.jar`); `WAR:WEB-INF/jsp/edit/editIteration.jsp:52-57`; `static-formatters-12.js` | rows 69, 70, 71 (new live question), 89, 186; Q3 registry fact; Error Prevention learning line | none | not yet |
| Pass-010 F-004 (low): row 216 | confirmed; no method-level basis found | `WAR:WEB-INF/web.xml:168-176,299-302` (the descriptor fact already cited) | row 216; reconnaissance reading block and Parity-Map Boundary | row 216 `Yes` -> `Inferred` | not yet |
| Pass-010 F-005 (low): record accuracy | confirmed; corrected in this record, since the BA-001-11 author sections are not rewritten | `build-workbook.js` (the provenance sentence is appended after the row data); `edit-ba-001-11-recon-b.js` (the omitted `audit:artifact-links` edit) | this record, section [Record Corrections To BA-001-11](#read-record-corrections-to-ba-001-11) | none | not yet |
| Pass-009 F-003 (low, open): script-context counting rule | corrected: rule restated as the tool applies it, one tool defect fixed, figure regenerated | `script-sinks-12.js`: 103 contexts, 78 outputs (32 / 27 / 18 / 1); positive control `WAR:WEB-INF/jsp/view/iteration.jsp:39` | script-sinks-09 tool row; pass-008 lead row; pass-009 F-003 row; BA-001-10 CHK-007 line | none | not yet |

- **Status counts:** before 169 `Yes`, 19 `Inferred`, 21 `Partial`, 1 `No`; after 168 `Yes`, 20 `Inferred`, 21 `Partial`, 1 `No`. No rows were added or removed.

<a id="read-finding-dispositions"></a>

## Finding Dispositions


<a id="read-f-001-correspondence-claims"></a>

### F-001 Correspondence claims

- **Confirmed.** The figures had no stated counting rule, and the statement that the unmatched constants show no divergent code was unsupported: the constant check runs from the bytecode to the source only and cannot detect code that exists only in the source.
- **Figures kept, each with its rule, and regenerated.** `corr-recount-12.js` recounts both figures from the class dumps and the source with a step-by-step breakdown (`out/corr-recount-12.txt`). The reviewer's counts (4739, 4704, 4620, 4579) are steps of the same breakdown under other exclusions.
  - **Rule M (methods):** the 4739 method entries of the 594 class files, less 84 static initializers, 23 members named `access$N`, `values`, `valueOf`, `class$` or `lambda$*`, and 35 synthetic or bridge members, give 4597. A name counts as found when the top-level source file declares a method of that name, after comments and annotations are removed. A constructor counts as found when the source declares a constructor of that class or none at all; 347 of the 620 constructors pass this way. Result: 4595 found; the 2 missing names are in `ViewPersonAction`.
  - **Rule S (constants):** each `ldc` instruction that loads a String constant in a method body is one entry. The 3892 entries, less 388 class constants and 118 empty strings, give 3386. An entry counts as found in three cases: it occurs in a literal of the top-level source file after escape decoding; all its pieces longer than 3 characters occur there; or it occurs in any application source. Result: 155 not found: 50 framework-prefixed, 17 in withheld files, 88 other. The BA-001-11 description of the 88 as "numeric, enum or folded" came from no rule and is withdrawn.
- **Two further divergent classes recorded (WAR governs):**
  - `LinkTag#addNavigationParameters`: without a Struts mapping, the WAR sets `returnto` to the request URI of the Spring request attributes; the source throws a `JspTagException`.
  - `AbstractFormat#getFormat`: the WAR falls back to the servlet-context message resources; the source has no fallback.
  - No row relies on either divergent branch. Row 114 cites `LinkTag#addNavigationParameters` for the branch with a mapping, which the WAR listing and the source share.
- **Corrections to the BA-001-11 record (not rewritten):** its Source Correspondence table, in [`source-reconciliation-001.md`](./source-reconciliation-001.md#read-source-correspondence), is superseded by the rules and the three divergent classes above. Its row on the unmatched constants ("None contradicts a row") stays true but is not evidence of identical code.

<a id="read-f-002-note-id-resolution"></a>

### F-002 Note id resolution

- **Confirmed.** `IdSearchHelper#search` tries `Project`, `Iteration`, `UserStory`, `Task`, `Person` and `Note` in that order. When the object is a `Note`, it returns `Note#getParent`, which looks up the note's attached-to id through `DomainContext#getNoteTarget` and `OLDIdSearchHelper#search` on the thread session. A lookup that fails gives null. Then:
  - `ContentSearchAction#doExecute` puts the returned object first in the results;
  - `IdSearchAction#doExecute` redirects to the view of the returned object's type and id.
- **Session:** the thread session is bound by `HibernateSessionFilter#doFilter` before the filter chain, mapped at `/*` (`WAR:WEB-INF/web.xml:147-152`). The source and the bytecode agree at every step.
- **Status:** rows 180 and 182 stay `Yes`, because the corrected claim rests on this method-level reading. The missing read check (rows 180, 184) is unchanged.
- **Not changed:** the breadcrumb lookup of `NavigationBarTag` also uses `IdSearchHelper`. For a note id it shows the parent's hierarchy, which does not change the recorded exposure (pass 010 states the same).

<a id="read-f-003-static-converters-and-number-parser"></a>

### F-003 Static converters and number parser

- **Confirmed, with one precision about the call path.** `AbstractEditorForm#initConverters` fills three static converters on the first call:
  - `dateConverter` and `dateTimeConverter`, from `getResources(request).getMessage(key)`. Struts `MessageResources#getMessage(String)` calls `getMessage(Locale, String, Object[])` with a null locale, which becomes `defaultLocale`, taken from `Locale.getDefault()` when the resources were constructed. That locale reaches `XPlannerMessageResources#getMessage(Locale, String)` and the Spring message source. So the server default locale's bundle applies to every user.
  - `decimalConverter`, whose parser is `java.text.DecimalFormat.getInstance(request.getLocale())`, the locale of the first request that calls `initConverters`. The callers are `IterationEditorForm#validate`, `TimeEditorForm#validate` and `IdSearchAction#doExecute` (negative check: no other caller).
- **Also found:** `IterationEditorForm#reset` clears the shared date converter, and the next `initConverters` call rebuilds it from the same server-default pattern. `TaskEditorForm#validate` keeps its own static date converter, built the same way.
- **Consumers:**
  - server default locale: the iteration editor (start and end dates shown by `#toString` and parsed by `#validate`), `TimeEditorForm#valideRow` (dates, date-times, and durations through `decimalConverter`) and `TaskEditorForm#validate` (created date);
  - session locale: `UpdateTimeAction#getDateFormat` and `#getDateTimeFormat` (saving time entries, with a per-request decimal parser), the calendar buttons (`editIteration.jsp:52-57`) and the `formatKey` displays of `FormatDateTag`.
- **Row 186:** the formatter for the built-in history pattern is created by the first request that renders a history date. A negative check confirms that `history.jsp:61,106` are the only pattern-less `formatDate` uses.
- **Refined CHK-003 and CHK-004 (P-3):** `static-formatters-12.js` enumerated the static formatter fields of all 594 classes. It found 8, and its positive control was found. Besides the 5 converters above, 3 get fixed patterns at class initialization in the server default locale:
  - `DailyTimesheetEntry` (`EEE d-MMM-yy`): the daily column headers of the personal timesheet, `timesheet.jsp:85`;
  - `TaskVelocityData` (`yyyy.MM.dd`): chart keys;
  - `SpreadsheetStory` (`ddMMMyy`): used only by `#toString`.
  - They are added to the Q3 registry fact. No row states otherwise, so no row changed.
- **Runtime effect:** `Inferred`. Row 71 gets a new live question. The rows keep their statuses: 69, 70, 89 and 186 `Yes`; 71 `Inferred`.

<a id="read-f-004-row-216"></a>

### F-004 Row 216

- **Confirmed.** No method-level basis exists. The only evidence is the `web.xml` descriptor fact, which the row already cited while it was `Inferred`. No reading of the Axis servlet or of its handler chain was made, and no rule permits a descriptor-only status change.
- **Correction:** row 216 goes back to `Inferred`. The descriptor fact stands, and its note records the reason.
- **Effect on BA-001-11 statements:** of the 58 BA-001-11 status changes, pass 010 confirmed 55 without a finding. Rows 180 and 182 keep `Yes` on the corrected claim (F-002), and row 216 is returned (F-004). The BA-001-11 statement "58 on a method-level reading" therefore becomes 57: in the reconnaissance, and in this record for the BA-001-11 summary.

<a id="read-f-005-record-accuracy"></a>

### F-005 Record accuracy

See [Record Corrections To BA-001-11](#read-record-corrections-to-ba-001-11).

<a id="read-pass-009-f-003-counting-rule"></a>

### Pass-009 F-003 Counting rule

- **Corrected.** `script-sinks-10.js` differed from its written rule in two ways:
  - it blanked HTML comments, although the text said it did not;
  - it ended a `javascript:` URL at the first quote of either kind, so an output after a JavaScript string quote inside the URL was missed.
- **Fix:** `script-sinks-12.js` is a copy with one rule change. Quotes inside JSP custom tags are masked like quotes inside scriptlets, and a `javascript:` URL runs to its matching closing quote.
- **Rule as now written** (script-sinks-09 tool row): JSP and HTML comments are blanked; quotes inside scriptlets and JSP custom tags do not end an attribute value. A context is one of:
  - a `<script>` element (opening tag and body count as one context);
  - an `on*` attribute value;
  - an `href`, `src` or `action` value that starts with `javascript:`.
  - Each context runs up to its matching closing quote. An output is one match of `<%= %>`, `${...}` or an opening `bean:write`, `c:out`, `bean:message` or `html:rewrite` tag that starts inside a context, counted once.
- **Regenerated:**
  - 74 files, 103 contexts, 78 outputs: 32 in opening tags, 27 in handlers, 18 in bodies, 1 in a `javascript:` URL;
  - 2 request values, unchanged;
  - the 78th output is the `html:rewrite` at `WAR:WEB-INF/jsp/view/iteration.jsp:39`, which is also the required positive control;
  - this equals the reviewer's comment-blanked reading.
- **Directly affected statements corrected:** the pass-008 lead row and the BA-001-10 CHK-007 self-check line (annotated), and the pass-009 F-003 row of Return Correction Evidence.

<a id="read-record-corrections-to-ba-001-11"></a>

## Record Corrections To BA-001-11

The author sections of [`source-reconciliation-001.md`](./source-reconciliation-001.md) are not rewritten. The following corrections apply to them.

| Statement in the BA-001-11 record | Correction |
|---|---|
| Changed Rows: the evidence before text "is kept unchanged as a prefix (asserted for 210 rows)" | True for the row data (`rows-part*.js`), where the note was appended. `build-workbook.js` appends the provenance sentence after the row data, so in the 31 workbook evidence cells with a provenance note the BA-001-11 note sits **before** the unchanged provenance sentence. The before text is intact in all 210 cells but is a prefix in only 179 (pass-010 F-005). The BA-001-12 notes are placed the same way; of the 10 rows changed here, row 178 has a provenance note. |
| Retained Work: for confirmed rows "only the source note was appended" | The note was appended to the row data; in the 31 workbook cells described above it was inserted before the provenance sentence. |
| Changed Rows: the list of changed reconnaissance sections | It omits the `audit:artifact-links` row of Build, Run, And Test Evidence, which gained "in BA-001-11: 244" (`edit-ba-001-11-recon-b.js`). |
| Reconciliation Summary: the 58 `Inferred` -> `Yes` rows each rest "on a method-level reading" | 57 did; row 216 rested on a descriptor fact and is `Inferred` again (F-004). |
| Source Correspondence: the method and constant figures, and "88 numeric, enum or folded values" | Superseded by rules M and S and the three divergent classes (F-001). |
| Error Prevention: CHK-011, "the new facts touch no public page" | Imprecise, as pass 010 notes: rows 61, 216, 225 and 233 concern unauthenticated endpoints. Their records are correct. |
| Error Prevention: CHK-004 confirmed for "the pattern and locale source of each formatting tag" | Incomplete: the static form converters were missed (F-003). |

<a id="read-changed-rows"></a>

## Changed Rows

The row diff compares `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-12.js` with the final row data (`apply-12.js`, change list `out/apply-12.json`). In every changed row the existing evidence text is kept, and one correction note is appended to the row data. No scenario or description cell changed, and no row was added, removed or renumbered. Code spans mark URL templates and date patterns here; the cells hold the same text without backticks.

| Row | Flow | Finding | Cell | Before | After |
|---|---|---|---|---|---|
| 178 | Search content | F-002 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-002): the object added first for a numeric text is the one found by SRC:src/com/technoetic/xplanner/db/IdSearchHelper.java IdSearchHelper#search; IdSearchHelper#search tries Project, Iteration, UserStory, Task, Person and Note in that order and, when the object is a Note, returns Note#getParent instead: the object whose id is the note's attached-to id, looked up the same way (a failed lookup gives null). For a note's id the parent object is added, not the note (SRC:src/net/sf/xplanner/domain/Note.java Note#getParent; SRC:src/com/technoetic/xplanner/tags/DomainContext.java DomainContext#getNoteTarget; SRC:src/com/technoetic/xplanner/db/OLDIdSearchHelper.java OLDIdSearchHelper#search; bytecode listings agree: instanceof Note, getParent; the thread session is bound by SRC:src/com/technoetic/xplanner/db/hibernate/HibernateSessionFilter.java HibernateSessionFilter#doFilter before the filter chain, mapped at /* (WAR:WEB-INF/web.xml:147-152)). See row 180. |
| 180 | Search content | F-002 | requirement | Text matches are filtered to objects the searching user may read; a numeric search text also puts the object with that id at the top of the results, without a read check. | Text matches are filtered to objects the searching user may read; a numeric search text also puts the object with that id at the top of the results (for the id of a note, the note's parent object), without a read check. |
| 180 | Search content | F-002 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-002): method-level reading of the corrected claim: SRC:src/com/technoetic/xplanner/db/IdSearchHelper.java IdSearchHelper#search; SRC:src/com/technoetic/xplanner/actions/ContentSearchAction.java ContentSearchAction#doExecute (adds the returned object at position 0 when it is Nameable, with no authorizer call); SRC:src/net/sf/xplanner/domain/Note.java Note#getParent; SRC:src/com/technoetic/xplanner/tags/DomainContext.java DomainContext#getNoteTarget; SRC:src/com/technoetic/xplanner/db/OLDIdSearchHelper.java OLDIdSearchHelper#search. IdSearchHelper#search tries Project, Iteration, UserStory, Task, Person and Note in that order and, when the object is a Note, returns Note#getParent instead: the object whose id is the note's attached-to id, looked up the same way (a failed lookup gives null). Bytecode listings agree; the thread session is bound by SRC:src/com/technoetic/xplanner/db/hibernate/HibernateSessionFilter.java HibernateSessionFilter#doFilter before the filter chain, mapped at /* (WAR:WEB-INF/web.xml:147-152). Status stays Yes on this reading. |
| 182 | Jump to object by ID | F-002 | requirement | Searching by a numeric ID in the header search lists the matching project, iteration, story, task, person or note first among the results; the direct jump (/do/search/id) is reachable by URL only. | Searching by a numeric ID in the header search lists the matching project, iteration, story, task or person first among the results, and for the id of a note the note's parent object; the direct jump (/do/search/id) is reachable by URL only. |
| 182 | Jump to object by ID | F-002 | expected | Search results headed by the object with that id; a request to `/do/search/id?searchedId=<id>` redirects to `/do/view/<type>?oid=<id>`. | Search results headed by the object with that id (for a note's id, the note's parent); a request to `/do/search/id?searchedId=<id>` redirects to `/do/view/<type>?oid=<id>` of the found object, which for a note's id are the parent's type and id. |
| 182 | Jump to object by ID | F-002 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-002): method-level reading of the corrected claim: SRC:src/com/technoetic/xplanner/db/IdSearchHelper.java IdSearchHelper#search; SRC:src/com/technoetic/xplanner/actions/ContentSearchAction.java ContentSearchAction#doExecute; SRC:src/com/technoetic/xplanner/actions/IdSearchAction.java IdSearchAction#doExecute (builds the redirect from the class of the returned object through DomainMetaDataRepository#classToTypeName and from its getId); SRC:src/net/sf/xplanner/domain/Note.java Note#getParent; SRC:src/com/technoetic/xplanner/tags/DomainContext.java DomainContext#getNoteTarget; SRC:src/com/technoetic/xplanner/db/OLDIdSearchHelper.java OLDIdSearchHelper#search. IdSearchHelper#search tries Project, Iteration, UserStory, Task, Person and Note in that order and, when the object is a Note, returns Note#getParent instead: the object whose id is the note's attached-to id, looked up the same way (a failed lookup gives null). Bytecode listings agree; the thread session is bound by SRC:src/com/technoetic/xplanner/db/hibernate/HibernateSessionFilter.java HibernateSessionFilter#doFilter before the filter chain, mapped at /* (WAR:WEB-INF/web.xml:147-152). Status stays Yes on this reading. |
| 184 | Jump to object by ID | F-002 | expected | Any existing object ID opens its page for any signed-in user (runtime unverified). | Any existing object ID opens the page of that object, or for a note's ID the page of the note's parent, for any signed-in user (runtime unverified). |
| 184 | Jump to object by ID | F-002 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-002): the page opened is that of the object returned by SRC:src/com/technoetic/xplanner/db/IdSearchHelper.java IdSearchHelper#search; for a note's id this is the note's parent (SRC:src/net/sf/xplanner/domain/Note.java Note#getParent; SRC:src/com/technoetic/xplanner/tags/DomainContext.java DomainContext#getNoteTarget; SRC:src/com/technoetic/xplanner/db/OLDIdSearchHelper.java OLDIdSearchHelper#search). The missing read check is unchanged. |
| 216 | SOAP service access | F-004 | status | Yes | Inferred |
| 216 | SOAP service access | F-004 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-004): the BA-001-11 change to Yes had no evidence that was new since the Inferred status. Its only basis is the descriptor fact already cited (WAR:WEB-INF/web.xml:168-176,299-302); no method-level reading of the Axis servlet or of its handler chain was made, and no rule permits a descriptor-only status change. Status returned Yes -> Inferred; the descriptor fact stands. |
| 69 | Configuration layering and request encoding | F-003 | requirement | In the default, alternate (--), Danish, German, Japanese and Russian bundles, dates are displayed and entered as `yyyy-MM-dd` and date-times as `yyyy-MM-dd HH:mm`; the history view is an exception (row 186). | In the default, alternate (--), Danish, German, Japanese and Russian bundles, format.date is `yyyy-MM-dd` and format.datetime is `yyyy-MM-dd HH:mm`; they apply to the consumers that take the pattern from the session locale (the formatKey date displays, the calendar buttons and the saving of time entries). Exceptions: the history view (row 186), and the editor form converters, which validate and show dates with the patterns of the server default locale for every user (row 89). |
| 69 | Configuration layering and request encoding | F-003 | expected | Date fields and calendar pickers use `yyyy-MM-dd` for these locales. | Date displays with formatKey, the calendar buttons and saved time entries use `yyyy-MM-dd` in these session locales; editor validation and the iteration editor date fields use the server default locale's pattern (Inferred for the runtime effect). |
| 69 | Configuration layering and request encoding | F-003 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-003): narrowed to the session-locale consumers. The editor form converters are static: SRC:src/com/technoetic/xplanner/forms/AbstractEditorForm.java AbstractEditorForm#initConverters, #getResources, #convertToDate, #convertToDateTime fills dateConverter and dateTimeConverter once from format.date and format.datetime of the server default locale's bundle (Struts MessageResources#getMessage(String) passes no locale, so the default locale taken from Locale.getDefault() when the resources were constructed applies (struts-1.2.9.jar listing), and XPlannerMessageResources#getMessage hands that locale to the Spring message source; SRC:src/net/sf/xplanner/struts/XPlannerMessageResources.java XPlannerMessageResources#getMessage), and decimalConverter with SRC:src/com/technoetic/xplanner/format/DecimalFormat.java DecimalFormat#DecimalFormat, whose parser uses the Accept-Language locale of the first request that calls initConverters (IterationEditorForm#validate, TimeEditorForm#validate or IdSearchAction#doExecute). SRC:src/com/technoetic/xplanner/forms/TaskEditorForm.java TaskEditorForm#validate keeps its own static date converter built the same way. Consumers: SRC:src/com/technoetic/xplanner/forms/IterationEditorForm.java IterationEditorForm#validate, #toString, #reset (start and end dates are shown and parsed with the static converter; reset clears it and the next initConverters call rebuilds it from the same server-default pattern), SRC:src/com/technoetic/xplanner/forms/TimeEditorForm.java TimeEditorForm#valideRow (dates, date-times and durations), TaskEditorForm#validate (created date). Session-locale consumers: SRC:src/com/technoetic/xplanner/actions/UpdateTimeAction.java UpdateTimeAction#getDateFormat, #getDateTimeFormat (saving time entries), the calendar buttons (WAR:WEB-INF/jsp/edit/editIteration.jsp:52-57) and the formatKey displays of FormatDateTag. Bytecode listings agree. The runtime effect is Inferred. |
| 70 | Configuration layering and request encoding | F-003 | requirement | In the Spanish, French, Italian and Brazilian Portuguese bundles, dates use `dd-MM-yyyy`; the Spanish date-time pattern is `dd-MM-yyyy HH:MM`, which uses the month letters in the minutes position; the history view is an exception (row 186). | In the Spanish, French, Italian and Brazilian Portuguese bundles, format.date is `dd-MM-yyyy`; the Spanish format.datetime is `dd-MM-yyyy HH:MM`, which uses the month letters in the minutes position. They apply to the session-locale consumers (row 69); the history view (row 186) and the editor form converters (row 89) are exceptions. |
| 70 | Configuration layering and request encoding | F-003 | expected | `dd-MM-yyyy` dates for these locales; Spanish date-times show the month number in place of minutes (runtime unverified). | `dd-MM-yyyy` dates on the session-locale consumers for these locales; Spanish date-times show the month number in place of minutes (runtime unverified). |
| 70 | Configuration layering and request encoding | F-003 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-003): narrowed as row 69: the editor form converters use the server default locale's patterns, not these bundles, unless that is the server default locale. |
| 71 | Configuration layering and request encoding | F-003 | requirement | The jQuery date picker attached to date fields always inserts `yyyy-MM-dd`, while the iteration editor calendar button and date parsing use the locale pattern; with a `dd-MM-yyyy` locale a date picked this way is expected to be rejected as invalid. | The jQuery date picker attached to date fields always inserts `yyyy-MM-dd`, and the iteration editor calendar button inserts the session bundle's format.date, while the iteration editor parses both with the static converter built from the server default locale's format.date. Whether a picked date is accepted therefore depends on the server default locale, not the session locale; the converter is lenient, so a date in the other order is read as a different date rather than rejected (Inferred). |
| 71 | Configuration layering and request encoding | F-003 | expected | Possible "Start date is invalid." after using the jQuery picker in es/fr/it/pt_br (runtime unverified). | On a server whose default locale bundle uses `yyyy-MM-dd`, a date from the jQuery picker parses in every session, and a `dd-MM-yyyy` date from the calendar button of an es, fr, it or pt_br session is read with the server pattern as a different date; on a server with a `dd-MM-yyyy` default the reverse applies (runtime unverified). |
| 71 | Configuration layering and request encoding | F-003 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-003): the BA-001-11 note ("the locale pattern [is] as recorded") and its live question are superseded. The editor form converters are static: SRC:src/com/technoetic/xplanner/forms/AbstractEditorForm.java AbstractEditorForm#initConverters, #getResources, #convertToDate, #convertToDateTime fills dateConverter and dateTimeConverter once from format.date and format.datetime of the server default locale's bundle (Struts MessageResources#getMessage(String) passes no locale, so the default locale taken from Locale.getDefault() when the resources were constructed applies (struts-1.2.9.jar listing), and XPlannerMessageResources#getMessage hands that locale to the Spring message source; SRC:src/net/sf/xplanner/struts/XPlannerMessageResources.java XPlannerMessageResources#getMessage), and decimalConverter with SRC:src/com/technoetic/xplanner/format/DecimalFormat.java DecimalFormat#DecimalFormat, whose parser uses the Accept-Language locale of the first request that calls initConverters (IterationEditorForm#validate, TimeEditorForm#validate or IdSearchAction#doExecute). SRC:src/com/technoetic/xplanner/forms/TaskEditorForm.java TaskEditorForm#validate keeps its own static date converter built the same way. Consumers: SRC:src/com/technoetic/xplanner/forms/IterationEditorForm.java IterationEditorForm#validate, #toString, #reset (start and end dates are shown and parsed with the static converter; reset clears it and the next initConverters call rebuilds it from the same server-default pattern), SRC:src/com/technoetic/xplanner/forms/TimeEditorForm.java TimeEditorForm#valideRow (dates, date-times and durations), TaskEditorForm#validate (created date). Session-locale consumers: SRC:src/com/technoetic/xplanner/actions/UpdateTimeAction.java UpdateTimeAction#getDateFormat, #getDateTimeFormat (saving time entries), the calendar buttons (WAR:WEB-INF/jsp/edit/editIteration.jsp:52-57) and the formatKey displays of FormatDateTag. Bytecode listings agree. The runtime effect is Inferred. New live question: on a server with a known default locale, which start date does the iteration editor store for a date from the jQuery picker and for one from the calendar button in an es session? |
| 89 | Create iteration | F-003 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-003): the accepted date and date-time patterns are those of the server default locale's bundle, not of the active (session) bundle as stated above: IterationEditorForm#validate parses with the static converters. The editor form converters are static: SRC:src/com/technoetic/xplanner/forms/AbstractEditorForm.java AbstractEditorForm#initConverters, #getResources, #convertToDate, #convertToDateTime fills dateConverter and dateTimeConverter once from format.date and format.datetime of the server default locale's bundle (Struts MessageResources#getMessage(String) passes no locale, so the default locale taken from Locale.getDefault() when the resources were constructed applies (struts-1.2.9.jar listing), and XPlannerMessageResources#getMessage hands that locale to the Spring message source; SRC:src/net/sf/xplanner/struts/XPlannerMessageResources.java XPlannerMessageResources#getMessage), and decimalConverter with SRC:src/com/technoetic/xplanner/format/DecimalFormat.java DecimalFormat#DecimalFormat, whose parser uses the Accept-Language locale of the first request that calls initConverters (IterationEditorForm#validate, TimeEditorForm#validate or IdSearchAction#doExecute). SRC:src/com/technoetic/xplanner/forms/TaskEditorForm.java TaskEditorForm#validate keeps its own static date converter built the same way. Consumers: SRC:src/com/technoetic/xplanner/forms/IterationEditorForm.java IterationEditorForm#validate, #toString, #reset (start and end dates are shown and parsed with the static converter; reset clears it and the next initConverters call rebuilds it from the same server-default pattern), SRC:src/com/technoetic/xplanner/forms/TimeEditorForm.java TimeEditorForm#valideRow (dates, date-times and durations), TaskEditorForm#validate (created date). Session-locale consumers: SRC:src/com/technoetic/xplanner/actions/UpdateTimeAction.java UpdateTimeAction#getDateFormat, #getDateTimeFormat (saving time entries), the calendar buttons (WAR:WEB-INF/jsp/edit/editIteration.jsp:52-57) and the formatKey displays of FormatDateTag. Bytecode listings agree. The runtime effect is Inferred. |
| 186 | Object and project history | F-003 | expected | Sortable history table; the container view adds object type and name links. The "when" dates use the built-in pattern "`EEE MMM dd k:mm:ss z`" in the Accept-Language locale of the first request after start-up, for every later user (Inferred). | Sortable history table; the container view adds object type and name links. The "when" dates use the built-in pattern "`EEE MMM dd k:mm:ss z`" in the Accept-Language locale of the first request after start-up that renders a history date, for every later user (Inferred). |
| 186 | Object and project history | F-003 | evidence | unchanged text, kept in full | the same text followed by: Correction (BA-001-12, pass-010 F-003): the formatter for the built-in pattern is created by the first request that renders a history date (the only formatDate uses without format or formatKey are WAR:WEB-INF/jsp/view/history.jsp:61,106), not by the first request after start-up. SRC:src/com/technoetic/xplanner/tags/FormatDateTag.java FormatDateTag#doStartTag. |

- **Totals:** 10 rows; 11 requirement or expected cells; 1 status cell (row 216); 10 evidence notes.
- **Reconnaissance sections changed** (list in `out/recon-sections-12.txt`):
  - reading block;
  - Scope And Provenance: the correspondence bullets (F-001), snapshot date, analyst, skill;
  - Build, Run, And Test Evidence:
    - the legacy hash row;
    - the script-sinks-09 row: rule, figures and outputs (pass-009 F-003);
    - the method-corr row: result, outputs and limits (F-001);
    - a new BA-001-12 tool row;
    - the build-workbook, `audit:project`, `audit:artifact-links`, `artifact-reading.js` and `audit:workbook:excel` rows;
  - Q3 facts:
    - the registry fact, with the locale-fixed formatters (F-003) and the rows 71 and 89;
    - the read-check fact, with the note-to-parent substitution (F-002) and the rows 178 and 182;
  - Parity-Map Boundary: status counts, and the BA-001-11 and BA-001-12 lines;
  - Return Correction Evidence:
    - the pass-008 lead F-003 row and the BA-001-11 row, annotated;
    - the pass-009 F-003 row;
    - 5 new rows for pass-010 F-001..F-005;
    - the record paragraph;
  - Stage 1 Exit Checklist;
  - Error Prevention:
    - the BA-001-12 learning update and self-check;
    - BA-001-11 marked historical, with its CHK-004 and CHK-007 lines annotated;
    - the BA-001-10 CHK-007 line annotated.
- **Follow-up edits outside `edit-ba-001-12-recon.js`:**
  - the `numberConverter` clause in the registry fact, added with a direct edit;
  - the positive-control path in the pass-009 F-003 row, qualified to `WEB-INF/jsp/view/iteration.jsp:39` after CHK-001 flagged the ambiguous file name;
  - the check results, added by `edit-ba-001-12-recon-b.js`.

<a id="read-live-questions"></a>

## Live Questions

| Row | Question | Change |
|---|---|---|
| 71 | On a server with a known default locale, which start date does the iteration editor store for a date from the jQuery picker and for one from the calendar button, in an es session? | new; replaces the BA-001-11 question |
| 69, 186 | the history-date live check of the pass-009 carryover | unchanged; row 186 now names the first request that renders a history date |
| all others | as listed in [`source-reconciliation-001.md`](./source-reconciliation-001.md#read-live-questions) | unchanged |

<a id="read-retained-work"></a>

## Retained Work

| Retained area | Absence-of-impact reason |
|---|---|
| The 55 status changes that pass 010 confirmed | None of the corrected mechanisms is an input of their claims. |
| Rows 180 and 182 at `Yes` | The corrected claim is supported by a method-level reading (F-002). |
| Row 183 (missing, malformed or unknown ID) | Its claim holds. The integer parser is the server-default `numberConverter`, which is now recorded in the Q3 fact. |
| Row 163 and the personal timesheet period | Pass 010 found its instance-level converter in the request locale correct. The static header format is recorded in the Q3 fact, and no row claims otherwise. |
| Row 114 | It relies on the mapping branch of `LinkTag#addNavigationParameters`, which the WAR and the source share. |
| Breadcrumb record (`NavigationBarTag`) | For a note id the parent hierarchy is shown; the recorded exposure is unchanged. |
| All other rows, the BA-001-11 author sections, provenance notes P-01..P-07, owner decisions and sealed reviews | Unchanged. The BA-001-11 record corrections are listed above. |

<a id="read-scope-expansion"></a>

## Scope Expansion

None. The static-formatter enumeration is the recheck that F-003 requires. Its 3 extra fields are recorded in the existing Q3 fact without a new inventory or row.

<a id="read-transport-and-access-disclosure"></a>

## Transport And Access Disclosure

- **In BA-001-12:** large outputs (class listings, source views, recounts and the row change list) went to `.migration-tmp/stage-01/out/` and were read in bounded excerpts. Two Struts and Spring classes were extracted from the WAR libraries into `out/jarcheck-12/`. Temp and cache paths were set to `.migration-tmp/temp` and `.migration-tmp/npm-cache`. No file outside the allowed folders was opened, and no client-persisted output was opened. No violation occurred.
- **Earlier in this author session:** the BA-001-08 incident, disclosed in BA-001-10.

<a id="read-credential-handling"></a>

## Credential Handling

- **Rule:** no password, key, token or login pair is written in any record, row, script or scratch output (A3, CHK-009). Withheld files are cited by path only.
- **Scan:** `chk009-scan-12.js`, a copy of `chk009-scan-11.js` (with the whole-word pair refinement) retargeted to this record and to the files touched in BA-001-12. It prints categories, file names and counts only.
- **Result:** the hit count is in RESULT BA-001-12.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are in RESULT BA-001-12.

- `corr-recount-12.js`, `script-sinks-12.js` and `static-formatters-12.js` (regenerated figures, positive controls);
- `disasm.js` listings of every method whose control flow a correction relies on, and `srcview-11.js` views of the same methods;
- `apply-12.js --check` (anchors, SRC files and cited methods), then the single apply;
- the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`; `sync:workbook-progress`;
- `audit:workbook`, `audit:project -- --require-source-ready` and `audit:artifact-links`;
- `artifact-reading.js` on the reconnaissance and on this record, and the PM placeholder check on both;
- CHK-001 with `chk001-ba-001-12.js`: every SRC citation and cited method, WAR line position and row reference in the new text; 6 content checks; 3 negative checks with positive controls;
- the CHK-009 scan;
- the legacy SHA-256;
- `audit:workbook:excel`, once after the final workbook write.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission. This record states whether the source and the bytecode confirm the underlying error.

| Proposal | Underlying error confirmed? | Basis and what BA-001-12 applied |
|---|---|---|
| P-1 (refine CHK-007): a correspondence claim states its rule, keeps its output, and compares method bodies in both directions | Yes. No rule was stated, and two body differences were missed. | F-001. The rules are stated and the figures regenerated with retained output. The body comparison was not run (not widened); the limitation is stated. |
| P-2 (new): every status change cites evidence that is new since the previous status | Yes. Row 216 changed on no new evidence. | F-004. Row 216 was returned. |
| P-3 (refine CHK-003/CHK-004): enumerate static formatter and converter fields as shared registries, with their locale source and every display and parse consumer | Yes. The output-side check missed the form converters twice. | F-003. `static-formatters-12.js` enumerated them (8 fields). |
| P-4 (refine CHK-012): record the object actually loaded, listed or redirected to, including type substitutions | Yes. The note-to-parent substitution was missed. | F-002. |

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for pass-010 F-001..F-005 and pass-009 F-003, within the static boundary.
- **Independent verification:** not performed. Next come a correction PR, then a new independent correction-validation by a fresh BA (root pass 006, previous pass and coverage base 010).
- **Open for Stage 3 (BA):** the new row 71 question, the carried history-date and cache live checks, and the other live questions of the BA-001-11 record.
- **For PM or the owner:** whether the method-body comparison of P-1 is wanted. It was not run here.
- **Questions for PM:** none.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check, BA-001-12:** checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b`. Applicable checks are CHK-001..CHK-012.
  - **CHK-001:** run by `chk001-ba-001-12.js` over the new notes and cells, the new reconnaissance lines and this record.
  - **CHK-002:** the negative claims (no other pattern-less `formatDate` use, no security filter on `/servlet/AxisServlet`, no other `initConverters` caller) have negative checks with positive controls.
  - **CHK-003 and CHK-004:** the static formatter fields were enumerated, and each is recorded with its locale source and consumers.
  - **CHK-005, CHK-006, CHK-008, CHK-010:** inputs unchanged; results retained.
  - **CHK-007:** every figure here comes from a named script with its stated rule: 4597 / 4595, 3386 / 155 (50 / 17 / 88), 103 / 78 (32 / 27 / 18 / 1), 8 static formatter fields. Status counts: 168 `Yes`, 20 `Inferred`, 21 `Partial`, 1 `No`.
  - **CHK-009:** scanned; see Credential Handling.
  - **CHK-011:** the corrected rows concern signed-in pages, except row 216. Row 216 is unauthenticated, and its status was lowered.
  - **CHK-012:** the id lookups were followed to the object actually listed or redirected to.
- **Self-detected in BA-001-12:**
  - The first CHK-001 run flagged an ambiguous file name (`iteration.jsp` exists twice) in the positive-control citation; it was qualified with its path.
  - The `numberConverter` was missing from the first draft of the registry fact; it was added.
- **Learning update:** see the proposals above and the reconnaissance Error Prevention entry. No project checklist edit is made by BA.

# Stage 3 Walkthrough 001 Dispositions

**How was each item of the Stage 3 walkthrough's map-correction list applied to the parity map and reconnaissance, and what was rejected or kept?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** PM writes the Correction Assignment section before authoring starts, as [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) requires. The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) writes every other section.
- **Maintained / decided by:** The Stage 1 author records the actual result. PM checks it against the assignment. A fresh independent Stage 2 reviewer verifies it in a new pass.
- **Governing instructions:** Stage 1 re-entry under the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol) and the Stage 3 methodology rule that a map defect found live returns to Stage 1.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **W001 map corrections applied in Stage 1 (BA-001-13): 81 applied, 7 applied in part, 0 rejected; not yet independently verified**
>
> Each of the 88 items was applied from the cited W001 checks, without new research. The parts not applied are requests for new source study and generalizations beyond what was observed.
> - **Workbook:** 354 cells in 210 rows. 93 rows carry item edits, and all 210 rows end with `Runtime: live-observed`, the W001 row verdict and the row's check IDs.
> - **Status:** 37 changes. 27 `Yes` and 5 `Inferred` rows became `Partial`, because their kept claim fails or is contradicted live (rule R-G2); 5 `Inferred` rows became `Yes`, because the live observation shows the whole claim (R-G3).
> - **Counts:** before 168 `Yes`, 20 `Inferred`, 21 `Partial`, 1 `No`; after 146 `Yes`, 10 `Inferred`, 53 `Partial`, 1 `No`. No rows were added.
> - **Reconnaissance:** reading block, provenance, Runnable Surfaces, the outbound-HTTP row, GAP-002, GAP-003, GAP-004, GAP-007, GAP-008, GAP-012, GAP-014, the Q2 and Q3 facts, the Parity-Map Boundary, Return Correction Evidence, the exit checklist and Error Prevention.
>
> **Next:** PM checks RESULT BA-001-13; then a correction PR and a fresh independent correction-validation by a new BA (root 006, previous 012, coverage base 012).
>
> **Details:** [Disposition Summary](#read-disposition-summary) / [Item Dispositions](#read-item-dispositions) / [Changed Rows](#read-changed-rows) / [Status Counts](#read-status-counts).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [Disposition Summary](#read-disposition-summary)
- [Item Dispositions](#read-item-dispositions)
- [Changed Rows](#read-changed-rows)
- [Status Counts](#read-status-counts)
- [Retained Work](#read-retained-work)
- [Checks Performed](#read-checks-performed)
- [Transport And Access Disclosure](#read-transport-and-access-disclosure)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-correction-assignment-pm"></a>

## Correction Assignment (PM)

- **Written by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, before authoring started. The Stage 1 author does not rewrite this section.
- **Task:** BA-001-13, `ba` / `author`, Stage 1 finding-driven re-entry from Stage 3. The branch is `stage-01/w001-corrections`, created from `main` at `5da533362b6b9858e6e6ba988b1070c7a37d5936` after PR #36.
- **Authority:**
  - The finding-driven return Stage 3 → Stage 1 needs no owner approval.
  - The bounded scope was chosen by Codex, the coordinating operator, under the owner's delegation until Stage 4 ([project departure](../../maintenance/process-departure-2026-09-30-operational-mandate.md)).
  - No personal owner approval is claimed.
- **Owner direction (relayed):** keep the business capabilities and do not commit to reproducing every legacy technology or defect. Record observed facts; do not decide keep, change or drop.

| Boundary | Assignment |
|---|---|
| Trigger and baseline | **Trigger:** [`analysis/stages/stage-03/walkthrough-001.md`](../stage-03/walkthrough-001.md) `b061cd975efe37676bfa2b2a8425a5ce53fbe4793510bae06bef87ffac09239e`.<br>**Correction list:** [`map-corrections.md`](../stage-03/evidence/W001/consolidated/map-corrections.md) `33563f140fbc451388b75c657090d4bc8b58fa4741383f26dd2660ee97e904ee` and [`map-corrections.json`](../stage-03/evidence/W001/consolidated/map-corrections.json) `443123837756c56d085ddbcff55b27c712a7eb26b4d9cc21ef7a3af34c76623e`: 88 items (45 corrections, 9 missing behavior, 34 notes) from 54 findings.<br>**Row verdicts:** [`rows.json`](../stage-03/evidence/W001/consolidated/rows.json) `2f938abc5d1096792ceff056392af0b0573db9c147f98385c4952f2fe550f2a3`.<br>**Baseline:** [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `b8e9981fd260f4e4b6712cff087f0e8d59212de4379aaeefc1e38c584dee5b44` and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `4f26e8e7ee4e4fecb0db5764b39b1d085b256fff6d54c5696a061cee99bd097a` (210 business rows). |
| Correction scope | Apply each of the 88 items exactly as the live evidence supports it, in the named rows, cells and reconnaissance sections. Preserve row IDs.<br>**Corrections:** fix the wrong claim to the observed behavior.<br>**Missing behavior:** add the fact to the existing row; add a row only when no existing row can carry it, with a new ID.<br>**Notes:** record live-question answers and runtime caveats in the notes columns.<br>**Status (column G):** change only where the live evidence supports it, citing W001 check IDs. Live observation does not prove more than what was observed. Partially verified rows stay partial, and unexecuted checks stay unverified.<br>**Runtime caveat:** keep "may depend on this runtime (Tomcat 9 / MySQL 5.7)" and "environment adaptation" labels where the walkthrough uses them.<br>**Candidates outside the core** (test utilities and similar) are recorded as a note "candidate outside the core (owner decision at Stage 4)", never as dropped. |
| Excluded | No new inventory, live run, WAR or source study beyond reading the cited evidence, and no SOAP/WAP investigation beyond recording the observed facts. No target design, no keep/change/drop decision, no edit of sealed reviews or of the W001 evidence and record, no Q2-Q4 decisions. |
| Retained work | Every row and statement not named by an item keeps its identity. Retention is justified by the absence of impact. |
| Checks and outcome | For each item: applied, applied in part or rejected, with the reason and the exact changed cells or sections, before and after. Status counts before and after. Run `audit:workbook`, `audit:project -- --require-source-ready`, `audit:artifact-links`, `artifact-reading.js` on the changed records, the CHK-001..CHK-012 self-check and the CHK-009 hit count; run `audit:workbook:excel` once if the workbook changes. **Transport safety:** large output goes to `.migration-tmp/stage-01/**`; never open client-persisted output outside the project; never print a credential value (the factory pair is on [`legacy/README.md`](../../../legacy/README.md) line 38). |
| Next control | A fresh independent correction-validation by a new BA (not an author or earlier reviewer), with root 006, previous 012 and coverage base 012. It checks these corrections against the W001 evidence and keeps justified coverage. The author self-check is not independent closure. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-13. A subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`) did the work; its agent ID was not reported to it. It returns to PM in the same session. Written 2026-10-01T01:19:34Z.
- **Skill and contract read before work:** `.agents/skills/migration-ba/SKILL.md` (git blob `560391d617ed24f5269b9d594c65056348e9f021`, unchanged since BA-001-11), [`analysis/agent-roles.md`](../../agent-roles.md), and the sections Return and Correction Protocol, Correction Scope And Handoff and Stage 1 Re-entry of [`analysis/reviews/README.md`](../../reviews/README.md#return-and-correction-protocol). The format example was [`stage-02-pass-010-dispositions.md`](./stage-02-pass-010-dispositions.md), used for section structure only.
- **Assignment section unchanged:** the 4398 characters from the heading `## Correction Assignment (PM)` to the start of this section have SHA-256 `29f41f0dec1501d17c17c80643e8b0222959fd716052557bde714eb831a9a955`, the value in ASSIGN BA-001-13. It was verified before work and again after these sections were written. Only the top reading block and the contents list were rewritten.
- **Inputs validated (SHA-256, all equal to the assignment):** walkthrough `b061cd97…9e`, `map-corrections.md` `33563f14…04ee`, `map-corrections.json` `44312383…623e`, `rows.json` `2f938abc…a2f3`, reconnaissance `b8e9981f…5b44` and workbook `4f26e8e7…097a` (210 business rows: 168 `Yes`, 20 `Inferred`, 21 `Partial`, 1 `No`).
- **Evidence used:** the 88 items and the checks they cite, read from the part `checks.json` files, `rows.json` (lead checks, reclassified checks) and the walkthrough tables. 436 unique check IDs are indexed, and all 148 IDs that the items cite were found. The only file read beyond the evidence is `WAR:WEB-INF/jsp/view/history.jsp:52-63,97-111`, which MC-B-07 cites (CHK-001 check of the citation).
- **Agreement with the boundary:** accepted. No new live request, no SOAP or WAP investigation, no source study and no new row. The items' requests for a source check (MC-A-03, MC-A-06, MC-A-07, MC-A-13, MC-A-18) are not done and are stated as open in the rows; where such a request was the only basis of a proposed change (MC-A-18: `No`), that change is not made.
- **Related occurrences (Correction Scope And Handoff):** the status rule below was applied to every row that an item names, not only to the G cells that an item proposes. This changed 22 statuses that no item proposed; each is listed under [Changed Rows](#read-changed-rows). No row outside the items was edited, except row 41 (named in the MC-A-09 correction text).
- **Excluded, as assigned:** no target design and no keep, change or drop decision; no Q2-Q4 decision; no edit of sealed reviews or of the W001 record and evidence.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Kind | Items | Applied | Applied in part | Rejected |
|---|---|---|---|---|
| a (correction) | 45 | 40 | 5 | 0 |
| b (missing behavior) | 9 | 7 | 2 | 0 |
| c (note) | 34 | 34 | 0 | 0 |
| **Total** | **88** | **81** | **7** | **0** |

- **Applied in part (7):** MC-A-09, MC-A-13, MC-A-18, MC-A-21, MC-A-32, MC-B-02, MC-B-09. The reasons are in the table below. No item was rejected as a whole: every item had a part that its cited checks support.
- **How the cells were written:**
  - A wrong claim (kind a) is replaced in D or F by the observed behavior, with "(W001)" or "Live (W001):" marking what was observed. A business capability is kept and the observed failure is added after it ("(source)" marks the kept static claim).
  - A missing behavior (kind b) is added to the existing row; no row was needed.
  - A note (kind c) is appended to H as "Stage 3 W001 live answer (BA-001-13, MC-C-NN): …", with the answer text as the item gives it and its check IDs.
  - Every H note is appended after the existing text, which stays a full prefix of the cell. Every H cell then ends with the MC-C-01 label: `Runtime: live-observed (Stage 3 W001, analysis/stages/stage-03/walkthrough-001.md; W001 row verdict: …; checks …; open residual scope …)`. The residual part names only open class (d) and (e) items and their "candidate outside the core (owner decision at Stage 4)" mark (rows 61, 62, 63, 112).
  - Runtime caveats are kept where W001 gives them: "may depend on this runtime (Tomcat 9 / JRE 8, MySQL 5.7)" (rows 45, 52, 169, 170, 172), the deployment context path (row 138, GAP-008) and "adapted mail environment" (rows 138, 198, 200, 201, 202).

**Status rule (column G).** Column G states whether this fixed baseline implements the behavior stated in the row. A change cites the W001 checks, and live evidence does not count for more than what was observed.

- **R-G1, claim replaced:** where D and F now state the observed behavior, G is unchanged (for example rows 69, 83, 89, 106, 137, 181).
- **R-G2, claim kept and failing:** where D keeps the business capability or the source claim and the live baseline contradicts it or shows it failing, `Yes` or `Inferred` becomes `Partial`. This follows the earlier practice of setting rows with an expected runtime failure to `Partial` (rows 35, 50-51, 176, 228, 232).
- **R-G3, Inferred and whole claim observed:** `Inferred` becomes `Yes` only where the live observation shows the whole claim of the row.
- **Not changed:** rows that are only partly observed keep their status (rows 11, 49, 65, 71, 138, 189). A locale defect is recorded as a locale exception in the rows it affects, and G follows the observed default locales (rows 70, 149, 152).
- **Where this differs from an item:**
  - MC-A-21 asks to keep G102 and G130 "source-based"; they became `Partial` under R-G2, like G115 and G172, which the list itself proposes.
  - MC-A-18 proposes `No` or `Partial` for row 84; it stays `Partial`, because `No` needs the source decision.
  - MC-B-02 proposes "`Yes` for the rejected case"; row 49 stays `Inferred`, because a row has one status and the other cases were not observed.

<a id="read-item-dispositions"></a>

## Item Dispositions

One row per item of [map-corrections.md](../stage-03/evidence/W001/consolidated/map-corrections.md), in list order. "Before" is shortened from the item's current claim; "after" is shortened from the first changed D or F cell (or the H note); the full texts are in the workbook and in `.migration-tmp/stage-01/ba-scratch/w001/apply-13.json`.

| Item | Kind | Rows / cells or section | Before (shortened) | After (shortened) | Evidence | Outcome | Reason |
|---|---|---|---|---|---|---|---|
| MC-A-01 | correction | F8 | F8: Login form (User ID, Password, Remember me, Log In button); after success the browser is redirected to … | Login form (User ID, Password, "Remember me?" checkbox, Login button); after success the browser is redirected to /do/view/projects. | setup-C-013 | applied | Button label observed; the observed checkbox label "Remember me?" was aligned in the same cell. |
| MC-A-02 | correction | H8; reconnaissance: Runnable Surfaces, bullet "Request-driven lookup on public pages" | H8 (page-text scope): /do/login is in the security bypass list, so /do/login?oid=&lt;id&gt; is expected to show the names of … | without a session, GET /do/login?oid=220 (project S3 Shared) answered HTTP 200 and the page did not contain the name "S3 Shared" (L-C-001; PM presence flag only). The … | L-C-001 | applied | The negative observation is recorded for project 220; the claim stays Inferred for other types, fkey and stored markup. |
| MC-A-03 | correction | F18, H18 | F18: Browser is redirected to /do/view/iteration?oid=&lt;current&gt; or /do/view/projects. | Browser is redirected to /do/view/iteration?oid=&lt;current&gt; or /do/view/projects. Live (W001): the redirect to the current iteration was observed only while exactly one … | A-C-018 | applied | F18 states the observed condition. The item's request to confirm the counting rule from source is not done (no new research); H18 records it as open. |
| MC-A-04 | correction | D24, F24, H24, H43, H50 | D24: Negative permissions apply to the exact role only: editors may not create projects, create people or delete … | Negative permissions apply to the exact role only: editors may not create projects, create people or delete iterations; admins may not create projects. On the people … | setup-C-021, setup-C-022, setup-C-023 | applied | D24/F24 state that the people-list links ignore the create-people restriction; H43 and H50 record the live display. |
| MC-A-05 | correction | F33, H33 | F33: Per-project radio buttons in the person editor; saved roles change what the person can see and do. | Per-project role drop-down (None, Viewer, Editor, Admin) in the person editor; saved roles change what the person can see and do. | setup-C-006 | applied | Control type corrected to the observed drop-down. |
| MC-A-06 | correction | D35, F35, H35 | D35: A project role editor lists people with viewer/editor/admin radio choices for one project. / F35: Form posted to … | A project role editor is meant to list people with viewer/editor/admin radio choices for one project. It is reachable by URL only (no link on the project page), and in … | A-C-040 | applied | D35/F35 record the observed HTTP 500 for the parameter forms tried. The item's request to confirm the required parameters from source is not done (no new research). |
| MC-A-07 | correction | F38, H38, F48, H48, G38, G48 | F38: Admins see hidden people; others do not. / F48: Hidden select Yes/No; hidden people disappear from normal lists. | Admins see hidden people; others do not (source claim). Live (W001): a person whose hidden flag is stored is still listed on /do/view/people for the viewer, editor, … | A-C-042, A-C-050 | applied | F38/F48 record the observed listing; G38 and G48 Partial as proposed; the list filter was not re-read from source (no new research). |
| MC-A-08 | correction | F39, H39 | F39: Title "People in project &lt;name&gt;"; only project members listed. | Heading "People on project: &lt;name&gt;" (HTML title "People"); the project members are listed, including the system administrators through their project-0 role. | setup-C-030 | applied | Heading and member list corrected to the observed page. |
| MC-A-09 | correction | D40, F40, H40, H41, F162, H162, G40 | D40: A person page shows the person's active, planned and completed tasks, stories as customer and as tracker, and … | Live (W001): the page answers HTTP 500 for a person who tracks a story and accepts a completed task with a time entry. [G40 Yes -&gt; Partial] | setup-C-032, setup-C-058 | applied in part | The failure is recorded for the observed condition only (a person who tracks a story and accepts a completed task with a time entry); the item's wider "tracks a story or has tasks with time" is not observed and not recorded. G40 Partial, row 41 note and F162 applied. |
| MC-A-10 | correction | F45, H45, G45 | F45: Editor redisplayed with "User Id exists." | HTTP 500 error page (database constraint violation); "User Id exists." is not shown and no duplicate is stored (W001; the outcome rests on a database constraint and may … | A-C-047 | applied | F45 replaced by the observed error page; G45 Partial; runtime caveat kept. |
| MC-A-11 | correction | F50, F51, H51 | F50: Upload form and per-line checks work, but saving the first valid line is expected to fail with a null reference, … | The import page and form work. Uploading a synthetic 3-line text file (a malformed line, an empty user ID and one valid line) ends in HTTP 500 … | A-C-056, A-C-057 | applied | F50/F51 record the observed HTTP 500 before any per-line status; G stays Partial. |
| MC-A-12 | correction | F52, H52, G52 | F52: Import page redisplayed with "Please select a file to import." / G52: Yes | HTTP 500 error page (AbstractMethodError); "Please select a file to import." is not shown (W001; lead interpretation: probably the bundled Struts 1.2 multipart wrapper … | A-C-058 | applied | F52 replaced by the observed error page; G52 Partial; runtime caveat kept as the lead interpretation. |
| MC-A-13 | correction | F57, H57, G57 | F57: General error page with object-not-found message. | HTTP 500 with the generic error page "An error has occurred.", without the object id or a not-found text (W001, GET /do/view/project?oid=999999). [G57 Yes -&gt; Partial] | A-C-062 | applied in part | F57 corrected; the item's request to check which exception the view raises is not done (no new research). D57 keeps the source claim, so G57 Partial (R-G2). |
| MC-A-14 | correction | D59, F59, H59 | D59: A settings list shows Setting records and offers "add setting" to users with create.project. / F59: Page headed … | A settings list shows Setting records and offers "Add Setting"; its source condition is create.project, but live the link is shown to the viewer as well as to the … | A-C-065 | applied | Title, heading and link visibility corrected; G59 stays Partial. |
| MC-A-15 | correction | D69, F69, H69, D71, F71, H71 | D69: In the default, alternate (--), Danish, German, Japanese and Russian bundles, format.date is `yyyy-MM-dd` and … | In the default, alternate (--), Danish, German, Japanese and Russian bundles, format.date is `yyyy-MM-dd` and format.datetime is `yyyy-MM-dd HH:mm`; they apply to the … | E-C-028, E-C-030 | applied | D69/F69 and D71/F71/H71 state that the Calendar buttons insert nothing; the `dd-MM-yyyy` misreading is limited to typed dates. G69 Yes and G71 Inferred unchanged. |
| MC-A-16 | correction | D70, F70, H70, F149, H149, F152, H152; reconnaissance: Owner Decisions And Open Questions, Q3 request-keyed cache fact (time-editor sentence) | D70: In the Spanish, French, Italian and Brazilian Portuguese bundles, format.date is `dd-MM-yyyy`; the Spanish … | In the Spanish, French, Italian and Brazilian Portuguese bundles, format.date is `dd-MM-yyyy`; the Spanish format.datetime is "`dd-MM-yyyy HH:MM` " (with a trailing space), … | C-C-003, E-C-033 | applied | D70/F70, F149/H149, F152/H152 and the Q3 cache fact name the time editor display and Insert Time as session-locale consumers and record the es effects. G70, G149 and G152 unchanged: the defect lies in the es pattern (row 70); en and de were observed working (C-C-003, C-C-011, C-C-012). |
| MC-A-17 | correction | D83, F83, H83 | D83: The project page shows the description and a sortable, paged (10 per page) iteration table with ID, name, … | The project page shows the description and a sortable, paged (10 per page) iteration table with ID, name, start/end dates, days worked and story count. By default the … | B-C-013, B-C-014, B-C-015 | applied | Default order corrected to the observed per-page sort. |
| MC-A-18 | correction | F84, H84 | F84: Message iterations.none. | Message iterations.none is not shown: live, a project without iterations shows the heading, the description and the links (People, Export, History; Create Iteration and … | setup-C-037, B-C-016 | applied in part | F84 records that the message is not shown. The proposed No needs the source decision on the iterationCount condition, which is not made (no new research); G84 stays Partial. |
| MC-A-19 | correction | D89, F89, H89 | D89: Missing name, unparsable dates, or an end date that does not follow the start date are rejected. / F89: Messages … | A missing name, or an end date that does not follow the start date, is rejected. Dates are parsed leniently: out-of-range month and day values roll over and trailing … | B-C-023, B-C-024 | applied | D89/F89 replaced by the observed lenient parsing. |
| MC-A-20 | correction | F101, H101 | F101: Iteration set inactive; data sample taken; redirect to the continue-unfinished-stories page. / F102: Target … | Iteration set inactive; data sample taken; redirect to the continue-unfinished-stories page. The redirect Location carries iterationId but no projectId … | B-C-044, B-C-045 | applied | F101 records the redirect without projectId and its effect; the F102 part is written in F102 together with MC-A-21. |
| MC-A-21 | correction | D102, F102, H102, D130, F130, H130, G102, G130 | D102: On the continue page the user selects a future iteration and confirms; unfinished stories are continued there. / … | In this baseline the confirmation answers HTTP 500 and continues nothing (W001). [G102 Yes -&gt; Partial; G130 Yes -&gt; Partial] | B-C-046, B-C-078 | applied in part | The source claim is kept and the HTTP 500 is recorded in D/F/H as proposed. Column G is set to Partial instead of being kept: under this record's status rule R-G2, applied to every row whose kept claim fails live (as the item list proposes for rows 115 and 172). |
| MC-A-22 | correction | D106, F106, H106 | D106: The iteration task view lists all tasks grouped by story with order, story, task, ID, acceptor, status icon, … | The iteration task view lists all tasks with order, story, task, ID, acceptor, status icon, original estimate, estimate, actual, remaining, disposition and type, plus a … | B-C-050 | applied | "Grouped by story" replaced by the observed default sort. |
| MC-A-23 | correction | F115, H115, F116, H116, F117, H117, F118, H118, F119, H119, G115, G116, G117, G118, G119 | F115: Result "Imported &lt;n&gt; stories"; stories created. / F116: Messages for missing worksheet name, title, end date or … | Result "Imported &lt;n&gt; stories"; stories created (source). Live (W001): every Import Stories submission, multipart as the served form posts it, answers HTTP 500 … | B-C-059, B-C-060, B-C-061, B-C-062, B-C-063, B-C-064 | applied | F115-F119 record the HTTP 500 on every submission; G115 Partial as proposed, and G116-G119 Partial under the same rule (related occurrence: their kept claims cannot occur). |
| MC-A-24 | correction | D121, F121, H121, D125, F125, H125, G121, G125 | D121: An editor can create a story in an iteration with name, disposition (planned, carried over, added), customer, … | Live (W001): the disposition and status chosen in the editor are not persisted. [G121 Yes -&gt; Partial; G125 Yes -&gt; Partial] | setup-C-042, setup-C-047, B-C-065, B-C-072 | applied | Rows 121 and 125 record that disposition and status are not persisted and not pre-selected; the capability claim is kept, so G121 and G125 Partial (R-G2). |
| MC-A-25 | correction | D124, F124, H124, G124 | D124: A story editor request that carries merge=true skips the name, estimate and priority checks, is rejected only … | A story editor request that carries merge=true skips the name, estimate and priority checks and is rejected with the same-iteration message when its targetIterationId … | B-C-069, B-C-070 | applied | D124/F124 name targetIterationId and the observed outcomes; G124 Inferred -&gt; Yes on the live observation (with B-C-071 of MC-C-18). |
| MC-A-26 | correction | D134, F134, H134, D136, H136, G134 | F134: Task saved; user returned to the story. / D136: The default disposition of a new task is "discovered" when its … | Live (W001): the disposition chosen in the editor is not stored on create. [G134 Yes -&gt; Partial] | setup-C-049, B-C-081 | applied | F134 records the unstored disposition; D136 limited to the pre-selection (row 136 stays live-verified). G134 Partial (R-G2). |
| MC-A-27 | correction | D137, F137, H137 | D137: A missing name, a negative estimate or an invalid created date is rejected. / F137: Messages "Missing task … | A missing name, a negative estimate or an invalid created date is rejected. The task editor has no created-date field, so the created-date check applies only to a … | B-C-085 | applied | D137/F137 state that the created-date check applies only to a direct parameter. |
| MC-A-28 | correction | F140, H140, F141, H141 | F140: "Complete" button; task becomes completed; page reloads. / F141: "Reopen" button; task becomes open again. | "Complete Task" button; its form posts oid, action=Update, merge=true and completed=true to /do/edit/task (the generic-editor merge binding, Q3 facts; compare row 124); … | setup-C-053, setup-C-054, B-C-090, B-C-092 | applied | Button labels and the merge=true form recorded. |
| MC-A-29 | correction | D144, F144, H144, F145, H145, F146, H146, F147, H147, D187, F187, H187, G144, G145, G146, G147 | D144: An editor can move a task to another story. / F144: Move/Continue page with target story; history records "moved". | In this baseline every move/continue task submission answers HTTP 500 and nothing is moved (W001). [G144 Yes -&gt; Partial; G145 Yes -&gt; Partial; G146 Yes -&gt; Partial; G147 … | B-C-097, B-C-098, B-C-100, B-C-101, B-C-102, C-C-050 | applied | Rows 144-147 record the HTTP 500 before validation and the missing default-bundle text; row 187 records that these entry points write no history. The named G cells (no value proposed) are set to Partial under R-G2; G187 stays Yes (its writer inventory holds). |
| MC-A-30 | correction | F151, H151 | F151: Remaining hours shown (red when negative); task estimate updated. | Remaining hours recalculated when the start, end or duration of an entry changes or an entry is deleted (Insert Time alone does not trigger it); a negative result is … | E-C-034 | applied | F151 replaced by the observed script behavior. |
| MC-A-31 | correction | D161, F161, H161 | D161: A task re-estimate page exists that shows actual and estimated hours and submits a new estimate, recording … | A task re-estimate page is mapped at /do/edit/task/estimate, but its action is a plain Struts Action: a GET answers HTTP 200 with an empty body, so no page is shown … | C-C-021 | applied | D161/F161 record the empty response and the direct-POST path; G stays Partial. |
| MC-A-32 | correction | F163, H163, F166, H166 | F163: Message "Can't parse the supplied date value." / F166: Message "Can't parse the supplied date value." | No message is displayed: the page returns with the default period (W001: 2026-09-27 to 2026-10-03) and no error markup, so the unparsable-date key raised by validate() … | C-C-023, C-C-026 | applied in part | F163/F166 record that no message is shown and the default period returns; the validate() fact in H stays static. The item's explanation "the pages have no html:errors output" is not recorded as a fact, because it was not read (no new research); the observed "no error markup" is. |
| MC-A-33 | correction | D169, F169, H169, F171, H171, F172, H172, F175, H175, G169, G171, G172, G175 | F169: Note editor (multipart form); after save the note appears in the Notes section of the object page. / F171: … | In this baseline a note with a file attachment cannot be saved (W001). [G169 Yes -&gt; Partial; G171 Yes -&gt; Partial; G172 Yes -&gt; Partial; G175 Yes -&gt; Partial] | C-C-030, C-C-032, C-C-033, C-C-034, C-C-037 | applied | Rows 169-175 record that no attachment can be stored, with the runtime caveat; the row-170 sentence is in F170, written together with MC-A-34. G172 Partial as proposed, and G169, G171, G175 Partial under the same rule. C-C-033 and C-C-037 stay not-checked (not executed). |
| MC-A-34 | correction | F170, H170, G170 | F170: Messages "Missing subject.", "Missing author.", "Missing body." | Messages "Missing subject.", "Missing author.", "Missing body." (source). On this runtime they are never shown: a note editor submission that fails validation answers … | C-C-031 | applied | F170 records that the messages are never shown on this runtime, with the container caveat; G170 Partial (R-G2). |
| MC-A-35 | correction | D174, F174, H174, G174 | F174: Confirm prompt; note removed; its attachment file removed too unless another note references it. | In this baseline the note is not removed (W001). [G174 Yes -&gt; Partial] | C-C-036 | applied | F174 records the redirect without deletion; the file-cascade claim stays static; G174 Partial (R-G2). |
| MC-A-36 | correction | F181, H181 | F181: General error page "Invalid content specified for search.: missing content" (text in the Accept-Language locale; … | General error page "An error has occurred." without the contentsearch.invalid_id text ("Invalid content specified for search.: missing content" is not shown), in en and … | C-C-043 | applied | F181 replaced by the observed page without the message text. |
| MC-A-37 | correction | F196, H196; reconnaissance: Known Gaps And Blockers, GAP-004 | F196: Integration page with Start/Finished/Cancel buttons and a join form. / H196: … | HTTP 500 error page (JspTagException, IllegalArgumentException "No positional parameters in query: from com.technoetic.xplanner.domain.Integration where state = ? and … | D-C-002, D-C-003, D-C-004, D-C-005 | applied | F196 replaced by the observed HTTP 500; H196 and GAP-004 record the live confirmation; G196 stays Partial. |
| MC-A-38 | correction | F197, H197, G197 | F197: Messages integrations.error.noperson / integrations.error.alreadyactive. / G197: Yes | Messages integrations.error.noperson / integrations.error.alreadyactive (source keys). Live (W001): a join without a person answers HTTP 500, because the error forward … | D-C-006, D-C-007 | applied | F197 records the error forward to the failing page; G197 Partial as proposed. |
| MC-A-39 | correction | D198, F198, H198, G198 | D198: Integration events notify listeners; the configured listener sends e-mail (suppressed with a nonotify … | Integration events notify listeners: IntegrationAction fires only the ready event (on finish, cancel or leave when another integration is waiting), not on join or … | D-C-009, D-C-010 | applied | D198 limited to the ready event (part D source note, static); F198 and H198 record that no integration e-mail occurs. G198 Inferred -&gt; Partial (R-G2). |
| MC-A-40 | correction | D200, F200, H200, D201, F201, H201, G200, G201 | D200: Every day at 00:05 the system e-mails acceptors of tasks with no time entry after a cut-off, asking them to … | Every day at 00:05 the system is meant to e-mail acceptors of tasks with no time entry after a cut-off, asking them to enter time. In this baseline the job runs at … | L-C-006, L-C-007 | applied | D/F200 and D/F201 record that the job runs and every send fails; G200 and G201 Partial as proposed; the double run stays inferred. |
| MC-A-41 | correction | F208, H208 | F208: Overlib pop-up with format links such as XML, MPX, MSPDI, PDF, Report. | Overlib pop-up (link "Export", caption "Format:") with the format links per object type: project XML, MPX, MSPDI; iteration XML, MPX, MSPDI, PDF, JRPDF; story and task … | D-C-022 | applied | "Report" replaced by "JRPDF" and the observed per-object formats listed. |
| MC-A-42 | correction | F216, H216, D218, G216 | F216: SOAP reachable without the filter at the alternate path (runtime unverified). / D218: SOAP operations check the … | SOAP reachable without credentials at the alternate path (W001): a GET lists the XPlanner and Version services with all operations; with the service namespace and … | D-C-036 | applied | F216 and D218 record anonymous execution at /servlet/AxisServlet; the F218 part is written in F218 together with MC-A-43. G216 Inferred -&gt; Yes on D-C-036, which is new evidence since the BA-001-12 return (R-G3). |
| MC-A-43 | correction | F218, H218, G220 | F218: Messages such as "no permission to update object"; lists contain only accessible objects; attribute calls … | Messages such as "no permission to update object"; lists contain only accessible objects; attribute calls run for any caller, including unauthenticated calls through … | D-C-044, D-C-049 | applied | F218 and F220 record the getAttribute fault and the prefix removal. G220 Inferred -&gt; Partial (R-G2, with MC-B-08 and MC-C-30). |
| MC-A-44 | correction | D221, F221, H221, G221 | D221: Clients can add, update and remove projects, iterations, stories, tasks, time entries, notes and people, and … | Clients can add, update and remove projects, iterations, stories, tasks, time entries, notes and people, and set/delete object attributes, subject to permissions, with … | D-C-051, D-C-052, D-C-053, D-C-054 | applied | D221/F221 state the per-operation outcomes; G221 Partial as proposed. |
| MC-A-45 | correction | F232, H232 | F232: WML cards with links to the underlying objects (hard-coded /xplanner path). Submitting the WAP login is expected … | WML cards with links to the underlying objects (hard-coded /xplanner path), as the pages are written. In this baseline every WAP login request fails with HTTP 500 … | D-C-069 | applied | F232 records that every WAP login request fails; G232 stays Partial. |
| MC-B-01 | missing behavior | D14, F14, H14 | D14: A request to the login action without the submit field (for example a plain GET of /do/login) shows the login … | A request to the login action without the submit field (for example a plain GET of /do/login) shows the login form in a fresh session. After one failed sign-in that … | A-C-013 | applied | The session-dependent case added to D14/F14; no new row needed. |
| MC-B-02 | missing behavior | D49, F49, H49 | D49: A person can be deleted through /do/delete/person; nothing cascades. If the person is a story customer or a … | A person can be deleted through /do/delete/person, which no page links to (the people list and the person page offer no delete control; reachable by URL only, W001); … | A-C-052, A-C-053, A-C-054 | applied in part | The three observed outcomes, the HTTP 500 on pages that show a deleted acceptor and the URL-only reach are recorded. The proposed "G49 Yes for the rejected case" is not applied: the status is per row, and the notification-receiver, tracker, time-entry and role outcomes were not observed, so G49 stays Inferred. |
| MC-B-03 | missing behavior | F97, H97 | F97: Move page with target iteration select; selected stories moved; redirect to /do/view/iteration?oid=&lt;source&gt;. / … | The target select lists the iterations of all projects the user can see (14 options across five projects for an editor in W001), with the first option pre-selected; … | B-C-036, B-C-099 | applied | The cross-project target lists added to F97 and F144 (F144 together with MC-A-29); the untested no-role case is stated. |
| MC-B-04 | missing behavior | H138; reconnaissance: Data And Integrations, "Outbound HTTP to the application's own URL"; GAP-008 | F138: E-mail "Task was created." or "Task was updated." to the editor and, when the task has an acceptor, to the … | original deployment condition (before 20:03:44Z): each task notification failed while fetching http://localhost:8080/xplanner/css/email.css (FileNotFoundException, … | setup-C-059, B-C-086 | applied | F138/H138, the Data And Integrations row and GAP-008 record that sending depends on the stylesheet fetch; the context-path dependence of this deployment is kept as a caveat. |
| MC-B-05 | missing behavior | F138, H138 | F138: E-mail "Task was created." or "Task was updated." to the editor and, when the task has an acceptor, to the … | E-mail "Task was created." or "Task was updated.", one per recipient, to the saving user and, when the task has an acceptor, to the current acceptor (one mail when they … | B-C-087 | applied | Recipients, creator line and link base added to F138 (adapted mail environment). |
| MC-B-06 | missing behavior | D173, F173, H173 | D173: An authorized user can edit a note. / F173: Note editor pre-filled; changes saved. | An authorized user can edit a note. For an editor without the author select (a non-administrator), the editor posts the editing user as authorId in a hidden field, so … | C-C-035 | applied | The author reassignment added to D173/F173. |
| MC-B-07 | missing behavior | F186, H186 | F186: Sortable history table; the container view adds object type and name links. The "when" dates use the built-in … | The column headings (action, by, when, description; in the container view also type and name) are always in the server default locale: history.jsp takes them through … | C-C-049 | applied | The server-default column headings added to F186/H186; history.jsp:52-63,97-111 checked for the messages.getMessage calls (CHK-001). |
| MC-B-08 | missing behavior | F220, H220 | F220: Operations getProjects, getProject, getIterations, getIteration, getUserStories, getUserStory, getTasks, … | Operations getProjects, getProject, getIterations, getIteration, getUserStories, getUserStory, getTasks, getTask, getCurrentTasksForPerson, getPlannedTasksForPerson, … | D-C-046 | applied | The zero parent ids added to F220. |
| MC-B-09 | missing behavior | F226, H226 | F226: Result "Task updated", "Task not found", "Task status not changed" or "Moving Task to not started not … | Result "Task updated", "Task not found", "Task status not changed" or "Moving Task to not started not implemented"; an unrecognized status value is answered like … | D-C-063 | applied in part | The unknown-status answer and the JSON result form are recorded. The item's "JSON or XML" is not applied for XML, which was not observed for the status update. |
| MC-C-01 | note | H of all 210 rows; reconnaissance: Reading block, Parity-Map Boundary status counts, legend and Stage 1 Exit Checklist | No runtime evidence label in column H. | label "Runtime: live-observed (Stage 3 W001, …; W001 row verdict; checks; open residual scope)" appended to H | rows.json runtime_label (210 rows) | applied | The runtime label with the walkthrough path, the W001 row verdict, the row's check IDs and its open residual items (class d or e) is appended to H of all 210 business rows (rows.json runtime_label); the status counts are refreshed in the reconnaissance (CHK-007). |
| MC-C-02 | note | reconnaissance: Known Gaps And Blockers, GAP-002 | GAP-002: "Nothing was observed live (Stage 1 scope)", status open. | reconnaissance: Known Gaps And Blockers, GAP-002 | rows.json runtime_label (210 rows) | applied | GAP-002 status set to observed live in W001 except the residual scope, with the link. |
| MC-C-03 | note | reconnaissance: Known Gaps GAP-007; Owner Decisions And Open Questions, Q3 facts | GAP-007 / Q3 facts: security-relevant behavior observed statically. | reconnaissance: Known Gaps GAP-007; Owner Decisions And Open Questions, Q3 facts | A-C-014, A-C-015, A-C-070, D-C-059, D-C-062, D-C-042, L-C-003, E-C-020 | applied | Each listed item is marked "Runtime: live-observed (W001)" in GAP-007 and the Q3 facts; Q3 stays open and deferred. The item's "D-F-05" for the anonymous attribute operations is cited as D-C-036 (its check). |
| MC-C-04 | note | reconnaissance: Known Gaps And Blockers, GAP-003 | GAP-003 lists security/notAuthorized.jsp among the missing resources. | reconnaissance: Known Gaps And Blockers, GAP-003 | A-C-027, A-C-028, D-C-072 | applied | GAP-003 records the live 404 for notAuthorized.jsp. |
| MC-C-05 | note | reconnaissance: Known Gaps GAP-008 | GAP-008: context-path inconsistencies affect links in the "me" page, footer, WAP and help. | reconnaissance: Known Gaps GAP-008 | B-C-086, D-C-013, C-C-051, D-C-014 | applied | GAP-008 records that the context path also decides whether a notification is sent (rows 138, 202), with the live evidence. |
| MC-C-06 | note | H11 | Live question: Does a login with the seeded user ID in different letter case succeed against the MySQL database? (F11: … | Yes: an upper-case user ID signed in (302 to the projects list); the header then shows the stored lower-case ID. Depends on the database comparison; observed on MySQL … | A-C-007 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-07 | note | H49 | Live question: Deleting a person who is a story customer: is the delete rejected by the database, and do task, … | The delete of a story customer is rejected (HTTP 500, not removed). A deleted task acceptor leaves a dangling reference: the task and story pages then answer HTTP 500. … | A-C-052, A-C-053 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-08 | note | H50 | Live question: Does uploading a file with one valid line fail on save? (F50: Upload form and per-line checks work, but … | A 3-line file (malformed, empty user ID, one valid line) failed with HTTP 500 (IndexOutOfBoundsException) before any per-line status or save; a file with only one valid … | A-C-056 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-09 | note | H60 | Live question: What do /setting/&lt;value&gt;/list, /setting/redirect:&lt;target&gt;/list and /setting/forward:&lt;path&gt;/list return … | Plain value: 404. redirect: with a single-segment target: 302 with the rest of the value as Location; with a slash in the target: 404. forward: 404 for every value … | A-C-067, A-C-068, L-C-004 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-10 | note | H63 | Live question: What does /do/admin/reload-tiles return, and does it reload the shared Tiles factory? (F63: Struts … | HTTP 200, text/plain, body "OK". Whether the shared factory is reloaded is not observable over HTTP (A-C-072). Candidate outside the core (owner decision at Stage 4), … | A-C-072 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-11 | note | H65 | Live question: At startup, do the log and the database show two Liquibase runs, two schedulers and a doubled reminder … | Two Liquibase runs (the second applies nothing) and two "scheduler" executors are in the startup log. At 00:05 the job made two send attempts per recipient, consistent … | A-C-074, L-C-005 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-12 | note | H68 | Live question: Does the running web application show no second-level or query cache and the default pool limits? (F68: … | "Query cache: disabled" although the property file enables it; "Second-level cache: enabled" does not decide. The cache provider and pool limits are not in the log … | A-C-077 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-13 | note | H69 | Live question: Which date format does the history view show after a fresh start for two sessions with different … | Both sessions (de first, then en) and later es sessions show "Mi Sep 30 19:45:16 UTC": the built-in pattern in the locale of the first requester (de). No fresh restart … | C-C-001 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-14 | note | H71 | Live question: In an es, fr, it or pt_br session, is a date picked with the jQuery picker rejected as "Start date is … | es: no. The picker inserts `yyyy-MM-dd` and the date is stored as picked. A typed `dd-MM-yyyy` date is read as a different date (02-11-2026 stored as 0008-05-18), not … | C-C-005, E-C-029, E-C-030 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-15 | note | H84 | Live question: What does the project page show for a project without iterations? (F84: Message iterations.none.) | The heading, the description and the links (People, Export, History; Create Iteration and Edit by role); no "No iterations" message (setup-C-037, B-C-016). The D/F … | setup-C-037, B-C-016 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-16 | note | H107 | Live question: Does the iteration metrics page show zero totals and empty developer tables? (F107: Page layout with … | Yes: Total Person Hours Worked 0.0, paired percentage 0.0%, "Nothing found to display.", although time was recorded (B-C-051). | B-C-051 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-17 | note | H108 | Live question: Is the accepted-hours table empty? (F108: Accepted-hours table with bars; expected empty in this … | Yes: "Nothing found to display." (B-C-052). | B-C-052 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-18 | note | H124 | Live question: Does a direct story-editor request with merge=true and an extra property parameter change that … | Yes, when targetIterationId differs from the current iteration: priority 9, estimate -5.0 and the description were bound without validation; the story stayed in its … | B-C-069, B-C-070, B-C-071 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-19 | note | H135, G135 | Live question: Which type value is stored for a task created in a de session on a server whose default locale is … | The English label "Debt" is stored for the option shown as "Rückstand" (B-C-083). Status Inferred -&gt; Yes on this live observation (server default locale English). [G135 … | B-C-083 | applied | Live answer added; G135 Inferred -&gt; Yes as proposed: the observation shows the whole claim for a de session on an English server (R-G3). |
| MC-C-20 | note | H138 | Live question: Are the created and updated mails delivered to the editor and the acceptor, and which old assignee does … | Original deployment condition: no mail (email.css fetch fails). Adapted environment: one mail each to the saving user and the current acceptor; after a reassignment … | setup-C-059, B-C-086, B-C-087 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-21 | note | H176 | Live question: Does /do/view/directory fail on the default listing? (F176: Pages reachable by URL only; every … | Yes: HTTP 500, NullPointerException at FileManagerAction.doExecute(FileManagerAction.java:40) (C-C-038). | C-C-038 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-22 | note | H186 | Live question: After a fresh start, which language do the history dates show for a second session with a different … | The first requester's locale (German day names) for every later session; no fresh restart was done (see row 69) (C-C-001, C-C-002). The restart case stays residual … | C-C-001, C-C-002 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-23 | note | H189 | Live question: How are a description with TWiki markup, a WikiWord and an object link (story:&lt;id&gt;) rendered? (F189: … | Bold, italic and fixed text become HTML; the WikiWord gets a "?" link to the external wiki edit page (localhost:9090); story:&lt;id&gt; and task:&lt;id&gt; become links with the … | C-C-052 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-24 | note | H198 | Live question: Is an e-mail sent when an integration is joined and started, and suppressed with nonotify? (F198: … | No e-mail in this baseline: join and start fail with HTTP 500 before any event. Suppression by nonotify cannot be told apart because no event fires (D-C-008, D-C-009, … | D-C-008, D-C-009, D-C-010 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-25 | note | H204, H112 | F204: No nightly samples in the shipped configuration. | no nightly sample is taken: no data sample was written at 23:55 (datasample held 48 rows at 00:07Z; the same count before 23:55 is a PM statement) (L-C-008); the … | L-C-008, D-C-017 | applied | The live answer added to H204 and H112; the manual sampling action stays residual and is marked candidate outside the core (R-30) by the runtime label. |
| MC-C-26 | note | H200 | Live question: At 00:05, are reminders sent, and are they sent twice? (F200: E-mail "XPlanner time entry reminder." … | Not sent: the job fired at 00:05:00Z and attempted the reminder twice for the prepared acceptor (consistent with a doubled job, inferred), and each attempt failed with … | L-C-005, L-C-006 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-27 | note | H201 | Live question: Do the notification receivers of a project with the option on receive the report, and twice? (F201: … | No: the report was attempted twice for the recipient and each attempt failed the same way; 0 mails (L-C-005, L-C-007). The D/F correction is under W001-F-47. | L-C-005, L-C-007 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-28 | note | F202, H202, G202 | Live question: With the application URL unreachable from the server, is a notification sent without style, delayed or … | Styled e-mail when the URL is reachable (W001, adapted environment: the served stylesheet is embedded in a style element); when the stylesheet URL is not reachable the … | D-C-013, D-C-014 | applied | Live answer added and F202 refined to the observed outcomes; G202 Inferred -&gt; Yes as proposed (R-G3). |
| MC-C-29 | note | F203, H203 | F203: No e-mail without a reachable SMTP server. | No e-mail without a reachable SMTP server; the triggering change is still saved and the user sees no error, because the failure (javax.mail ConnectException "Connection … | L-C-009 | applied | Live answer added to H203; F203 states that the change is saved and the failure only logged. |
| MC-C-30 | note | H220 | Live question: Does getCurrentIteration return a SOAP fault, and does getNotesForObject return the notes of an object? … | getCurrentIteration faults (QuerySyntaxException near the undeclared alias "object"); getNotesForObject returns the notes of the story (D-C-047, D-C-048). | D-C-047, D-C-048 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-31 | note | H221 | Live question: Does SOAP removeProject leave the project notes, and does deleteAttribute fail? (F221: Operations … | Yes to both: the note of a removed project is still returned, and deleteAttribute faults (QueryException, targetId) (D-C-050, D-C-058). The D/F correction is under … | D-C-050, D-C-058 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-32 | note | H228 | Live question: Does GET /ical/&lt;userId&gt;.ics for the own user ID return an error instead of a calendar? (F228: Expected: … | Yes: HTTP 500 with the query exception message ("could not resolve property: story"), no VCALENDAR, for all four roles; without credentials 401 Basic (D-C-064, D-C-065). | D-C-064, D-C-065 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-33 | note | H232 | Live question: Does a WAP login submission fail with an error page? (F232: WML cards with links to the underlying … | Yes: HTTP 500, NullPointerException at AuthenticationAction.execute:47, for the submission and even for the login card display (D-C-069, D-C-070). The D/F correction is … | D-C-069, D-C-070 | applied | Live answer added to H as given; the D/F correction, where one exists, is under the named finding. |
| MC-C-34 | note | H234, G234 | Live question: Which page does /do/mobile/view/project?oid=&lt;id&gt; show after a mobile login? (F234: Not-authorized … | No mobile login is possible (row 232). In a web session the view answers 404 (notAuthorized.jsp missing); with projectId it answers HTTP 500 (NullPointerException in … | D-C-072, D-C-073 | applied | Live answer added; G234 Inferred -&gt; Yes as proposed (R-G3): the not-authorized forward without projectId was observed, in a web session because no mobile login is possible. |

<a id="read-changed-rows"></a>

## Changed Rows

The diff compares the pre-image copy `.migration-tmp/stage-01/ba-scratch/w001/legacy_user_flows.pre-ba-001-13.xlsx` with the written workbook (`apply-13.json`: 354 cells; 31 D, 76 F, 37 G, 210 H). No row was added, removed or renumbered, and columns A-C, E and I-N are unchanged. In every H cell the before text is a full prefix of the after text.

| Row | Flow | Items | Cells | Status before -> after |
|---|---|---|---|---|
| 8 | Log in with valid credentials | MC-A-01, MC-A-02 | F, H | Yes (unchanged) |
| 11 | Log in with valid credentials | MC-C-06 | H | Inferred (unchanged) |
| 14 | Login rejected | MC-B-01 | D, F, H | Yes (unchanged) |
| 18 | Access protected pages without a session | MC-A-03 | F, H | Yes (unchanged) |
| 24 | Role hierarchy and default permissions | MC-A-04 | D, F, H | Yes (unchanged) |
| 33 | Assign project roles to a person | MC-A-05 | F, H | Yes (unchanged) |
| 35 | Edit project roles (project role editor) | MC-A-06 | D, F, H | Partial (unchanged) |
| 38 | List people | MC-A-07 | F, G, H | Yes -> Partial |
| 39 | List people | MC-A-08 | F, H | Yes (unchanged) |
| 40 | View person page | MC-A-09 | D, F, G, H | Yes -> Partial |
| 41 | View person page | MC-A-09 | H | Yes (unchanged) |
| 43 | Create person | MC-A-04 | H | Yes (unchanged) |
| 45 | Create person | MC-A-10 | F, G, H | Yes -> Partial |
| 48 | Edit person and password | MC-A-07 | F, G, H | Yes -> Partial |
| 49 | Delete person | MC-B-02, MC-C-07 | D, F, H | Inferred (unchanged) |
| 50 | Import people from a file | MC-A-04, MC-A-11, MC-C-08 | F, H | Partial (unchanged) |
| 51 | Import people from a file | MC-A-11 | F, H | Partial (unchanged) |
| 52 | Import people from a file | MC-A-12 | F, G, H | Yes -> Partial |
| 57 | Error pages | MC-A-13 | F, G, H | Yes -> Partial |
| 59 | Settings pages (work in progress) | MC-A-14 | D, F, H | Partial (unchanged) |
| 60 | Settings pages (work in progress) | MC-C-09 | H | Inferred (unchanged) |
| 63 | Administrative and test actions | MC-C-10 | H | Inferred (unchanged) |
| 65 | Startup schema creation and seed data | MC-C-11 | H | Inferred (unchanged) |
| 68 | Configuration layering and request encoding | MC-C-12 | H | Inferred (unchanged) |
| 69 | Configuration layering and request encoding | MC-A-15, MC-C-13 | D, F, H | Yes (unchanged) |
| 70 | Configuration layering and request encoding | MC-A-16 | D, F, H | Yes (unchanged) |
| 71 | Configuration layering and request encoding | MC-A-15, MC-C-14 | D, F, H | Inferred (unchanged) |
| 83 | View project | MC-A-17 | D, F, H | Yes (unchanged) |
| 84 | View project | MC-A-18, MC-C-15 | F, H | Partial (unchanged) |
| 89 | Create iteration | MC-A-19 | D, F, H | Yes (unchanged) |
| 97 | Move multiple stories | MC-B-03 | F, H | Yes (unchanged) |
| 101 | Close iteration and continue unfinished stories | MC-A-20 | F, H | Yes (unchanged) |
| 102 | Close iteration and continue unfinished stories | MC-A-21 | D, F, G, H | Yes -> Partial |
| 106 | View all tasks of an iteration | MC-A-22 | D, F, H | Yes (unchanged) |
| 107 | Iteration metrics | MC-C-16 | H | Partial (unchanged) |
| 108 | Iteration metrics | MC-C-17 | H | Partial (unchanged) |
| 112 | Iteration statistics charts | MC-C-25 | H | Yes (unchanged) |
| 115 | Import stories from a spreadsheet | MC-A-23 | F, G, H | Yes -> Partial |
| 116 | Import stories from a spreadsheet | MC-A-23 | F, G, H | Yes -> Partial |
| 117 | Import stories from a spreadsheet | MC-A-23 | F, G, H | Yes -> Partial |
| 118 | Import stories from a spreadsheet | MC-A-23 | F, G, H | Yes -> Partial |
| 119 | Import stories from a spreadsheet | MC-A-23 | F, G, H | Yes -> Partial |
| 121 | Create user story | MC-A-24 | D, F, G, H | Yes -> Partial |
| 124 | Create user story | MC-A-25, MC-C-18 | D, F, G, H | Inferred -> Yes |
| 125 | Edit user story | MC-A-24 | D, F, G, H | Yes -> Partial |
| 130 | Move or continue a story | MC-A-21 | D, F, G, H | Yes -> Partial |
| 134 | Create task | MC-A-26 | D, F, G, H | Yes -> Partial |
| 135 | Create task | MC-C-19 | G, H | Inferred -> Yes |
| 136 | Create task | MC-A-26 | D, H | Yes (unchanged) |
| 137 | Create task | MC-A-27 | D, F, H | Yes (unchanged) |
| 138 | Task e-mail notification | MC-B-04, MC-B-05, MC-C-20 | F, H | Inferred (unchanged) |
| 140 | Complete or reopen task | MC-A-28 | F, H | Yes (unchanged) |
| 141 | Complete or reopen task | MC-A-28 | F, H | Yes (unchanged) |
| 144 | Move or continue a task | MC-A-29 | D, F, G, H | Yes -> Partial |
| 145 | Move or continue a task | MC-A-29 | F, G, H | Yes -> Partial |
| 146 | Move or continue a task | MC-A-29 | F, G, H | Yes -> Partial |
| 147 | Move or continue a task | MC-A-29 | F, G, H | Yes -> Partial |
| 149 | Record time on a task | MC-A-16 | F, H | Yes (unchanged) |
| 151 | Record time on a task | MC-A-30 | F, H | Yes (unchanged) |
| 152 | Record time on a task | MC-A-16 | F, H | Yes (unchanged) |
| 161 | Re-estimate task (legacy page) | MC-A-31 | D, F, H | Partial (unchanged) |
| 162 | Personal timesheet | MC-A-09 | F, H | Yes (unchanged) |
| 163 | Personal timesheet | MC-A-32 | F, H | Yes (unchanged) |
| 166 | Aggregate timesheet | MC-A-32 | F, H | Yes (unchanged) |
| 169 | Add note to an object | MC-A-33 | D, F, G, H | Yes -> Partial |
| 170 | Add note to an object | MC-A-34 | F, G, H | Yes -> Partial |
| 171 | Add note to an object | MC-A-33 | F, G, H | Yes -> Partial |
| 172 | Add note to an object | MC-A-33 | F, G, H | Yes -> Partial |
| 173 | Edit and delete note | MC-B-06 | D, F, H | Yes (unchanged) |
| 174 | Edit and delete note | MC-A-35 | D, F, G, H | Yes -> Partial |
| 175 | Download attachment | MC-A-33 | F, G, H | Yes -> Partial |
| 176 | File manager (directories) | MC-C-21 | H | Partial (unchanged) |
| 181 | Search content | MC-A-36 | F, H | Yes (unchanged) |
| 186 | Object and project history | MC-B-07, MC-C-22 | F, H | Yes (unchanged) |
| 187 | Object and project history | MC-A-29 | D, F, H | Yes (unchanged) |
| 189 | Wiki-style formatting of descriptions | MC-C-23 | H | Inferred (unchanged) |
| 196 | Integration queue | MC-A-37 | F, H | Partial (unchanged) |
| 197 | Integration queue | MC-A-38 | F, G, H | Yes -> Partial |
| 198 | Integration queue | MC-A-39, MC-C-24 | D, F, G, H | Inferred -> Partial |
| 200 | Daily missing time entry reminder | MC-A-40, MC-C-26 | D, F, G, H | Inferred -> Partial |
| 201 | Daily missing time entry reminder | MC-A-40, MC-C-27 | D, F, G, H | Inferred -> Partial |
| 202 | Daily missing time entry reminder | MC-C-28 | F, G, H | Inferred -> Yes |
| 203 | Daily missing time entry reminder | MC-C-29 | F, H | Yes (unchanged) |
| 204 | Data sampling for burn-down | MC-C-25 | H | Yes (unchanged) |
| 208 | Export menu | MC-A-41 | F, H | Yes (unchanged) |
| 216 | SOAP service access | MC-A-42 | F, G, H | Inferred -> Yes |
| 218 | SOAP service access | MC-A-42, MC-A-43 | D, F, H | Yes (unchanged) |
| 220 | SOAP read operations | MC-B-08, MC-C-30, MC-A-43 | F, G, H | Inferred -> Partial |
| 221 | SOAP write operations | MC-A-44, MC-C-31 | D, F, G, H | Inferred -> Partial |
| 226 | REST task status update | MC-B-09 | F, H | Yes (unchanged) |
| 228 | Personal iCal feed | MC-C-32 | H | Partial (unchanged) |
| 232 | WAP login and browsing | MC-A-45, MC-C-33 | F, H | Partial (unchanged) |
| 234 | WAP login and browsing | MC-C-34 | G, H | Inferred -> Yes |

- **Rows with item edits:** 93. **Status changes:** 37; 15 proposed by an item, and 22 set by the status rule on rows that an item names (rows 57, 102, 116-119, 121, 125, 130, 134, 144-147, 169-171, 174-175, 198, 216, 220).
- **Rows changed only by the MC-C-01 runtime label (column H):** 117 rows: 9-10, 12-13, 15-17, 19-21, 23, 25-32, 34, 37, 42, 44, 46-47, 53, 55-56, 58, 61-62, 64, 66-67, 72-73, 75-82, 85-86, 88, 90-96, 98-100, 103-105, 109-111, 113-114, 122-123, 126-129, 131-132, 139, 142-143, 150, 153-160, 164-165, 167, 178-180, 182-185, 188, 190-194, 205-206, 209-213, 215, 217, 219, 223-225, 229-230, 233.

<a id="read-status-counts"></a>

## Status Counts

Counted from the workbook column G over the 210 business rows (the 18 use-case summary rows have no status), before and after the write.

| Status | Before | After |
|---|---|---|
| `Yes` | 168 | 146 |
| `Inferred` | 20 | 10 |
| `Partial` | 21 | 53 |
| `No` | 1 | 1 |
| Total | 210 | 210 |

- **Moves:** `Yes` -> `Partial`: 27; `Inferred` -> `Yes`: 5; `Inferred` -> `Partial`: 5.
- **Reconnaissance:** the reading block and the Parity-Map Boundary state the new counts; the BA-001-12 counts are labelled as earlier values (CHK-007).

<a id="read-retained-work"></a>

## Retained Work

| Retained area | Absence-of-impact reason |
|---|---|
| The 117 rows changed only by the runtime label (listed under Changed Rows) | No item names them. Their W001 verdicts: live-verified 97, partially verified 20; 0 of them have a finding. Their D, F and G claims therefore hold; the label records the observation without changing a claim, and a partially verified row keeps its status. |
| Statuses of rows whose claim is now the observed behavior (R-G1) and of partly observed rows | Kept, see the status rule; live evidence does not count for more than what was observed. |
| The source and bytecode evidence in every H cell | Kept in full as a prefix. W001 observed the runtime; it did not re-read the source, and BA-001-13 made no source study. |
| Provenance notes P-01..P-07, GAP-005 and the 31 rows with provenance notes | No item concerns the baseline provenance. |
| The 18 use-case summary rows, the header rows 1-6 and the progress formulas and labels | Not edited; `audit:workbook-progress` reports the 18 banners in sync, so `sync:workbook-progress` was not run. |
| Reconnaissance sections not listed in the reading block | No item affects them. Historical figures in GAP-001 and Build, Run, And Test Evidence stay labelled with their task. |
| Owner decisions, sealed reviews, the W001 record and evidence, the earlier correction records | Not edited. |

<a id="read-checks-performed"></a>

## Checks Performed

| Check | Result |
|---|---|
| Pre-image, op-order and prefix guards (`apply-13.js --check`, then `--write`) | passed: the workbook equalled the snapshot before the write; no `set` followed another edit of the same cell; every H cell keeps its before text as a prefix |
| Structural comparison (`struct-diff.js`) | passed: 3276 cells compared; 2922 unchanged values equal; 0 differences in styles, row heights, outline levels, hidden flags, merges, columns, sheet views and package parts; `xl/styles.xml` identical |
| `npm --prefix analysis/tools run audit:workbook` | passed (exit 0): `WORKBOOK AUDIT OK` (Scenarios 210; open 210; epics 18; revision sheets 0) |
| `npm --prefix analysis/tools run audit:workbook-progress` | passed (exit 0): `FLOW COMPLETION OK: 18 flow banners`; so `sync:workbook-progress` was not run |
| `npm --prefix analysis/tools run audit:project -- --require-source-ready` | passed (exit 0): `PROJECT CONFIG AUDIT OK` at stage-01. A first run failed (exit 1, "recorded evidence is empty or template-only") while the reconnaissance still held this task's own unfilled result placeholders; it passed after they were filled |
| `npm --prefix analysis/tools run audit:artifact-links` | failed (exit 1) on one line only: line 69 of this record, inside the PM Correction Assignment section, writes the README path as a plain code span. The author may not edit that section, so the fix is PM's. Before linking, the author sections had two more such lines; they are now links. 270 Markdown documents are in scope |
| `node analysis/tools/artifact-reading.js` on the reconnaissance and on this record | passed (exit 0): no errors in either file |
| CHK-001 (`chk001-13.js` over the new workbook text, the reconnaissance and this record) | passed (exit 0): 0 errors; 906 check-ID, 97 finding-ID, 344 item-ID and 183 row references and 31 WAR line positions in the new text resolve; the 9 `messages.getMessage` lines of `history.jsp:52-63,97-111` were found |
| CHK-009 (`chk009-scan-13.js`) | 0 hits (14 patterns in 11 categories, including the factory pair of [`legacy/README.md`](../../../legacy/README.md) line 38 parsed in memory; 2 records, 31 scratch files and the workbook cells scanned; every positive control above 0) |
| Legacy SHA-256 (`sha256sum legacy/*`) | passed: the four hashes equal the recorded values (`README.md` `78b1a6b4…5460`, `demo-seed.sql` `2d32f7d5…387e`, `docker-compose.yml` `e15cd9db…e9ff`, `xplanner-plus.war` `46ff9dc0…4edc`) |
| `npm --prefix analysis/tools run audit:workbook:excel` (once, after the final workbook write) | passed (exit 0): `EXCEL DESKTOP OPEN AUDIT OK`; workbook SHA-256 `33f3349d…0156` before and after; output `.migration-tmp/stage-01/ba-scratch/w001/audit-excel-13.txt` |

**Self-check CHK-001..CHK-012** (checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b`):

- **CHK-001:** every check, finding and item ID, every row reference and the one new WAR line citation in the new text resolve (passed (exit 0): 0 errors; 906 check-ID, 97 finding-ID, 344 item-ID and 183 row references and 31 WAR line positions in the new text resolve; the 9 `messages.getMessage` lines of `history.jsp:52-63,97-111` were found). The cross-row check citations are intended; most come from the per-row check lists of `rows.json`.
- **CHK-002:** the permission statements changed (rows 24, 43, 50, 59, 216, 218) keep display-level and server-side facts apart. The W001 observation is display-level (links shown) or a direct request.
- **CHK-003:** each side effect now recorded as absent (history on task move, e-mail, cookies, attachments) cites the observed failure on its entry point.
- **CHK-004:** locale statements name the locales observed (en, de, es; fr only for the formatKey dates) and leave da, ja, ru, "--", fr, it and pt_br unobserved where W001 did (residual R-26).
- **CHK-005:** the validation rows changed (45, 52, 89, 116, 117, 137, 146, 147, 152, 163, 166, 170, 197) keep their message keys and add the observed outcome.
- **CHK-006:** the delete rows changed (49, 174) state the observed page-level effect; database rows stay unobserved (residual R-40).
- **CHK-007:** status counts recomputed from the workbook after the write; the outcome counts and cell counts come from `edits-13.js` and `apply-13.json`.
- **CHK-008:** query outcomes (SOAP getCurrentIteration, deleteAttribute, iCal, integration queue) are recorded as observed faults; no new query reading.
- **CHK-009:** 0 hits (14 patterns in 11 categories, including the factory pair of [`legacy/README.md`](../../../legacy/README.md) line 38 parsed in memory; 2 records, 31 scratch files and the workbook cells scanned; every positive control above 0). No credential value is written; the factory pair is cited only as [`legacy/README.md`](../../../legacy/README.md) line 38.
- **CHK-010:** the changed redirect statements (rows 18, 101, 124) quote the observed Location values.
- **CHK-011:** the unauthenticated surfaces changed (rows 8, 216; GAP-007 and Q3 marks) cite the anonymous observation.
- **CHK-012:** request-derived sinks recorded from W001 (returnto, the setting redirect, merge binding of row 124) cite the observed result; the scheme-qualified redirect case is recorded as not observed (A-C-068).

<a id="read-transport-and-access-disclosure"></a>

## Transport And Access Disclosure

- **Scratch and temp:** all scripts and outputs are in `.migration-tmp/stage-01/ba-scratch/w001/`; every Node run set `TEMP`, `TMP` and `TMPDIR` to `.migration-tmp/temp`. Large outputs (item dump, cited checks, row views, change list) were written there and read in bounded parts.
- **Not opened:** `.migration-tmp/stage-03/secrets/**`, any client-persisted output under the user profile (a background command's output file was not read), and the 39 withheld upstream files (no source was read).
- **Read outside the evidence:** `WAR:WEB-INF/jsp/view/history.jsp:52-63,97-111` in the Stage 1 WAR extract (cited by MC-B-07), and the BA-001-12 scanner `.migration-tmp/stage-01/tools/chk009-scan-12.js`, from which `chk009-scan-13.js` was derived.
- **Credentials:** no value was printed. To write the line-38 pattern, the shape of [`legacy/README.md`](../../../legacy/README.md) line 38 was printed once with every letter and digit masked.
- **Deviations from the assignment's transport rules (self-disclosed):**
  - One read-only `git hash-object` on the skill file, to report its blob (the assignment says Git is not needed).
  - One shell command started an interpreter (`python -`) that hung and was stopped without output.
  - One `node -` heredoc script tried to patch the scanner copy and stopped on its first anchor without writing. The scanner was then written with the file tool.
  - A few `node -e` one-liners were used for read-only inspection, and one to update the scratch file `checks-13.json` (all with the temp variables set). All other scripts were written with the file tool.
  - A first `audit:project` run failed because the reconnaissance still held this task's own unfilled result placeholders. It passed once they were filled.
- **Timestamps:** taken programmatically (`new Date().toISOString()`): this record 2026-10-01T01:19:34Z.

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for the 88 items within the boundary; 7 applied in part, with the reasons above.
- **Open, not researched here (no new research):** the counting rule behind row 18; the parameters of the role editor (row 35); the people-list filter (rows 38, 48); the exception of the not-found view (row 57); the iterationCount condition (row 84, `No` versus `Partial`); the fr, it and pt_br picker and time-editor cases (R-26). The W001 residual items keep their class: (d) R-24..R-28 and (e) R-29..R-47, three of them candidates outside the core (owner decision at Stage 4).
- **Independent verification:** not performed. Next come PM's check of RESULT BA-001-13, a correction PR, and a **fresh independent correction-validation** by a new BA, who is neither an author nor an earlier reviewer, with root pass 006, previous pass 012 and coverage base 012. It checks these corrections, including the status rule and the 22 status changes that no item proposed, against the W001 evidence and keeps justified coverage. Stage 3 re-entry follows that pass. This self-check is not independent closure.
- **For PM or the owner:** whether the status rule R-G2 (`Partial` for a kept claim that fails live) is the intended reading of column G, since MC-A-21 suggested keeping G "source-based".
- **Questions for PM:** none blocking.

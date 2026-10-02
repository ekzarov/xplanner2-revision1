# Stage 4 Map Hole MH-01 Dispositions

**How was the Stage 4 map hole MH-01 (row 220, SOAP `getAttribute`) corrected from existing evidence, and what was kept unchanged?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** PM writes the Correction Assignment section before authoring starts, as [Correction Scope And Handoff](../../reviews/README.md#correction-scope-and-handoff) requires. The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) writes every other section.
- **Maintained / decided by:** The Stage 1 author records the actual result. PM checks it against the assignment. A fresh independent Stage 2 reviewer verifies it in a new pass.
- **Governing instructions:** Stage 1 re-entry under the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol); the Stage 4 rule that a contradiction which is a mapping error loops back to Stage 1.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **MH-01 corrected in Stage 1 (BA-001-14): 2 cells changed in row 220; not yet independently verified**
>
> F220 no longer lists `getAttribute` among the SOAP operations that "return data". It now states that `getAttribute` does not return data and always returns a SOAP fault (`TypeMismatchException`). Every other operation and fact of the cell is kept.
> - **Directly tied wording:** H220 said "all read operations answered with data" next to the `getAttribute` fault. It now names the operations listed in F220 other than `getAttribute`, and it records this correction.
> - **No other change:** rows 218 and 219 and the SOAP facts of the reconnaissance do not repeat the contradiction and are unchanged. No status changed (G220 stays `Partial`).
>
> **Next:** PM checks RESULT BA-001-14; then a correction PR and a fresh independent correction-validation (root 006, previous and coverage base 013); then back to Stage 4.
>
> **Details:** [The Correction](#read-the-correction) / [Checks Performed](#read-checks-performed).

<details>
<summary><strong>Contents</strong></summary>

- [Correction Assignment (PM)](#read-correction-assignment-pm)
- [Scope Validation](#read-scope-validation)
- [The Correction](#read-the-correction)
- [Retained Work](#read-retained-work)
- [Checks Performed](#read-checks-performed)
- [Transport And Access Disclosure](#read-transport-and-access-disclosure)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-correction-assignment-pm"></a>

## Correction Assignment (PM)

- **Written by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, before authoring started. The Stage 1 author does not rewrite this section.
- **Task:** BA-001-14, `ba` / `author`, Stage 1 finding-driven re-entry from Stage 4. The branch is `stage-01/mh01-f220`, created from `main` at `ad10faffe5c9192031ead8444fc70220cf29f5a1` after PR #41.
- **Authority:** Codex, as coordinator under `operational-mandate-stage4-completion`, permitted exactly this narrow return. It is not a personal owner approval. A finding-driven return needs no owner approval.

| Boundary | Assignment |
|---|---|
| Trigger | Map hole MH-01 in [`stage-04-requirements-revision.md`](../stage-04/stage-04-requirements-revision.md). Cell F220 lists `getAttribute` among the SOAP read operations that "return data", and in the same cell states that `getAttribute` always returns a SOAP fault (`TypeMismatchException`). |
| Evidence (already recorded) | W001 checks D-C-044 and D-C-049 in [`evidence/W001/D/checks.json`](../stage-03/evidence/W001/D/checks.json), finding W001-F-50, and map-correction items MC-A-43, MC-B-08 and MC-C-30 in [`map-corrections.md`](../stage-03/evidence/W001/consolidated/map-corrections.md). |
| Correction scope | F220: state that `getAttribute` does not return data and always faults. Keep every other operation and fact of the cell as recorded. Correct only wording that states the same contradiction about `getAttribute`, in another cell of rows 218-220 or in the reconnaissance SOAP facts, and name each such place. |
| Excluded | Target decisions in columns I-N, including J and M, and the Rev 1 sheet. Any other row, any status change not forced by this fact, new research, live requests, and SOAP study beyond the cited evidence. The sealed reviews, the W001 records and the Stage 4 record. Do not close the 7 open pass-013 findings. |
| Checks and outcome | The exact changed cells or sections, before and after. `audit:workbook`, `audit:workbook-progress`, `audit:project -- --require-source-ready`, `audit:artifact-links`, `artifact-reading.js` on the changed records, and a structural comparison proving that only the named cells changed. `audit:workbook:excel` once. CHK-009 count. |
| Next control | One fresh independent correction-validation by a new BA (not an author or earlier reviewer): root 006, previous and coverage base 013. It checks this change and the obligations it directly affects, and keeps the rest of the coverage with reasons. No full-blind pass, no live rerun. |

<a id="read-scope-validation"></a>

## Scope Validation

- **Author:** Business Analyst, role `ba`, mode `author`, task BA-001-14. A subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (model `claude-opus-5-5`) did the work; its agent ID was not reported to it. It returns to PM in the same session. Written 2026-10-02T16:52:14Z.
- **Skill and principles read before work:** [`.agents/skills/migration-ba/SKILL.md`](../../../.agents/skills/migration-ba/SKILL.md) (git blob `7af7a36a5e845d499a87a262e10bd816c720a15f`) and [Keep Work Focused](../../../MIGRATION.md#keep-work-focused). The section structure follows [`stage-03-walkthrough-001-dispositions.md`](./stage-03-walkthrough-001-dispositions.md).
- **Assignment section unchanged:** the 2561 characters from the heading `## Correction Assignment (PM)` to the start of this section have SHA-256 `f586b02e4a4b84aaa43323451e785c5010cc0a660778e11136731d5e3a0ee76b`, the value in ASSIGN BA-001-14. It was verified before work and again after these sections were written. Only the top reading block and the contents list were rewritten.
- **Inputs (SHA-256):** workbook at `HEAD` `e7835bbb…5544` (equal to the working copy before the write); [`checks.json`](../stage-03/evidence/W001/D/checks.json) `462e38cf…6918`; [`map-corrections.md`](../stage-03/evidence/W001/consolidated/map-corrections.md) `33563f14…04ee` and `map-corrections.json` `44312383…623e` (both equal to the values in the BA-001-13 record); reconnaissance `a38989aa…5206`.
- **Evidence used, and only this:** checks D-C-044 and D-C-049 (`getAttribute` faults for every caller with `org.hibernate.TypeMismatchException`; `getAttributes` returns the map; `getAttributesWithPrefix` returns the keys with the prefix removed), finding W001-F-50, and items MC-A-43 (correction: "getAttribute always returns a SOAP fault (TypeMismatchException)"), MC-B-08 (parent ids 0) and MC-C-30 (`getCurrentIteration` faults). D-C-046, which H220 cites for the parent ids, was not opened.
- **Agreement with the boundary:** accepted. No live request, no network, no source study and no new SOAP research. Columns I-N, the Rev 1 sheet, every other row, the statuses, the sealed reviews, the W001 records, the Stage 4 record and the 7 open pass-013 findings were not edited.
- **Sweep of the same contradiction (rows 218-220, columns D-H, and the reconnaissance SOAP facts):** one further place, H220, stated it ("all read operations answered with data" next to the `getAttribute` fault). It is corrected. The places cleared are listed under [Retained Work](#read-retained-work).

<a id="read-the-correction"></a>

## The Correction

| Cell | Before | After | Evidence |
|---|---|---|---|
| F220 | Operations getProjects, getProject, getIterations, getIteration, getUserStories, getUserStory, getTasks, getTask, getCurrentTasksForPerson, getPlannedTasksForPerson, getTimeEntries, getTimeEntry, getNote, getNotesForObject, getPerson, getPeople, **getAttribute,** getAttributes, getAttributesWithPrefix return data, but the parent id fields of the returned beans (IterationData.projectId, UserStoryData.iterationId, TaskData.storyId, TimeEntryData.taskId) are 0; **getAttribute always returns a SOAP fault (TypeMismatchException);** getAttributesWithPrefix returns the keys without the prefix; getCurrentIteration returns a SOAP fault (W001). | Operations getProjects, getProject, getIterations, getIteration, getUserStories, getUserStory, getTasks, getTask, getCurrentTasksForPerson, getPlannedTasksForPerson, getTimeEntries, getTimeEntry, getNote, getNotesForObject, getPerson, getPeople, getAttributes, getAttributesWithPrefix return data, but the parent id fields of the returned beans (IterationData.projectId, UserStoryData.iterationId, TaskData.storyId, TimeEntryData.taskId) are 0; getAttributesWithPrefix returns the keys without the prefix; **getAttribute does not return data: it always returns a SOAP fault (TypeMismatchException);** getCurrentIteration returns a SOAP fault (W001). | D-C-044, D-C-049, W001-F-50, MC-A-43; kept facts: MC-B-08 (parent ids 0), MC-C-30 (`getCurrentIteration` fault) |
| H220, fragment 1 | Stage 3 W001 (BA-001-13, MC-A-43, MC-B-08, W001-F-50, W001-F-51): **all read operations** answered with data, parent references 0 (D-C-046); … | Stage 3 W001 (BA-001-13, MC-A-43, MC-B-08, W001-F-50, W001-F-51): **the read operations listed in F220 other than getAttribute** answered with data, parent references 0 (D-C-046); … | D-C-044, D-C-049, W001-F-50, MC-A-43 |
| H220, fragment 2 | … getNotesForObject returns the notes of the story (D-C-047, D-C-048). Runtime: live-observed (…) | … getNotesForObject returns the notes of the story (D-C-047, D-C-048). **Stage 4 MH-01 correction (BA-001-14): getAttribute is no longer listed among the operations that return data, because it always faults (D-C-044, D-C-049, W001-F-50, MC-A-43).** Runtime: live-observed (…) | provenance of this correction |

- **What changed in F220:** `getAttribute` left the list of operations that return data (19 operations, now 18), and the fault sentence now says that it does not return data. The fault sentence moved after the `getAttributesWithPrefix` fact, so that the remaining clauses read in order. No operation and no fact was removed.
- **Why H220 is directly tied:** its sentence "all read operations answered with data" sat next to "getAttribute TypeMismatchException", which is the same contradiction. The new wording narrows the claim to the operations F220 lists as returning data. It adds no fact beyond D-C-044 and D-C-049. The rest of H220 is kept as a prefix and a suffix; the runtime label stays last.
- **Status:** G220 stays `Partial`. Its recorded reason (R-G2: "getAttribute fails and the parent ids are lost") already rests on the fault, so this fact forces no status change.
- **Reconnaissance:** unchanged, because none of its SOAP facts repeat the contradiction (see [Retained Work](#read-retained-work)).
- **Workbook SHA-256:** before `e7835bbb7baea4d49218c00d0d211d3c46662170c697eed30a229d451c225544`, after `e1478eddada79b574268905cb5d2a7d2412336896cdd0f872398af7d37b264a6`.

<a id="read-retained-work"></a>

## Retained Work

| Retained place | Why it does not repeat the contradiction |
|---|---|
| D218 | It names `getAttribute` among the five attribute operations that have no permission check. That is about authorization, not about returning data. |
| F218 | It already states that `getAttribute` always returns a SOAP fault (MC-A-43, applied in BA-001-13). |
| H218 | It records the fault ("getAttribute faults for every caller (D-C-044)"). |
| D218-H218 other text, E218, G218 | No claim that `getAttribute` returns data. |
| Row 219 (D-H) | The inactive JAX-WS endpoint; it does not mention `getAttribute`. |
| D220 | "Clients can read … object attributes" describes the requirement. Reading attributes still works through `getAttributes` (D-C-049), so it does not repeat the contradiction. |
| E220, G220 | No operation-level claim; the status reason already names the fault. |
| Reconnaissance, inventory row "Web services" and Runnable Surfaces row "SOAP API clients" | Operation counts and the expected `getCurrentIteration`/`deleteAttribute` failures; no claim about `getAttribute`. |
| Reconnaissance, permission table row "SOAP" and the fact "SOAP attribute operations have no permission check" | About permission checks; the fact already says "getAttribute always faults (row 220)". |
| Reconnaissance, fact on `/servlet/AxisServlet` | "the attribute operations run anonymously" says that they run without authentication, not that `getAttribute` returns data. |
| Every other row, columns I-N, the Rev 1 sheet, the reconnaissance, the sealed reviews, the W001 records, the Stage 4 record, the 7 open pass-013 findings | Not edited. |

<a id="read-checks-performed"></a>

## Checks Performed

| Check | Result |
|---|---|
| Replacement guards (`apply-14.js --check`, then `--write`) | passed: each of the four replaced fragments matched exactly once; F220 and H220 were plain strings; after the write, `getAttribute` is not in the F220 list of operations that return data (18 operations), and the fault sentence is present |
| Structural comparison against `git show HEAD:analysis/legacy_user_flows.xlsx` (`struct-diff-14.js`, `sheet2-diff.js`, `skeleton-diff.js`) | passed: 3825 cells compared in both sheets; values differ only in `User Flows!F220` and `User Flows!H220`; 0 differences in styles, row and column properties, merges, views, page setup, data validations and conditional formatting; no formulas in either sheet; the same 17 package parts; every cell element of both sheet parts is byte-identical except the two shared strings. Writer-derived hints changed: `dimension` and row `spans` now end at the last used column (User Flows N, Rev 1 I), as at commit `e61825d`; `HEAD` had them at O. See the disclosure |
| `npm --prefix analysis/tools run -s audit:workbook` | passed (exit 0): `WORKBOOK AUDIT OK` (Scenarios 210; open 210; epics 18; revision sheets 1) |
| `npm --prefix analysis/tools run -s audit:workbook-progress` | passed (exit 0): `FLOW COMPLETION OK: 18 flow banners` |
| `npm --prefix analysis/tools run -s audit:project -- --require-source-ready` | passed (exit 0): `PROJECT CONFIG AUDIT OK` at stage-01, with the recorded source-fallback warning |
| `npm --prefix analysis/tools run -s audit:artifact-links` | passed (exit 0): `ARTIFACT REFERENCE LINK AUDIT OK: 280 Markdown document(s) checked.` |
| `node analysis/tools/artifact-reading.js --file` on this record | passed (exit 0): no errors. The reconnaissance did not change, so it was not rerun there |
| `npm --prefix analysis/tools run -s audit:workbook:excel` (once, after the write) | passed (exit 0): `EXCEL DESKTOP OPEN AUDIT OK`; workbook SHA-256 `e1478edd…64a6` before and after the run |
| CHK-009 (`chk009-scan-14.js`, counts only) | 0 hits: 14 patterns in 11 categories, including the factory pair of [`legacy/README.md`](../../../legacy/README.md) line 38 parsed in memory; 2 records (the reconnaissance and this record), 17 scratch files and the workbook cells scanned; every positive control above 0 |
| Assignment section hash, after writing | passed: 2561 characters, SHA-256 `f586b02e…e76b`, unchanged |

<a id="read-transport-and-access-disclosure"></a>

## Transport And Access Disclosure

- **Scratch and temp:** all scripts and outputs are in `.migration-tmp/stage-01/ba-scratch/mh01/`, including the `HEAD` copy of the workbook and one of commit `e61825d` (used only to compare the `dimension` hints). Every Node run set `TEMP`, `TMP` and `TMPDIR` to `.migration-tmp/temp`. Output was filtered or written to scratch and read in bounded parts.
- **Not opened:** `.migration-tmp/stage-03/secrets/**` and any client-persisted file under the user profile.
- **Read beyond the cited evidence:** the reconnaissance (search for the SOAP facts), [`legacy_user_flows_template_instructions.md`](../../legacy_user_flows_template_instructions.md) (column H and correction guidance), the BA-001-13 scratch scripts reused as templates, and the MH-01 row of the [Stage 4 record](../stage-04/stage-04-requirements-revision.md) (read only).
- **Credentials:** no value was printed. The scanner parses [`legacy/README.md`](../../../legacy/README.md) line 38 in memory and prints only categories and counts.
- **Writer hints in the workbook:** the governed writer (`writeWorkbookFile`) recomputed `dimension` and row `spans` in both sheet parts. No Rev 1 cell, style or property changed; its part differs only in these hints.
- **Deviations (self-disclosed):** one `sed -i` edit renamed two strings in the scratch copy `chk009-scan-14.js` (the other edits used the file tool); one read-only `git hash-object` on the skill file; `node -p` for the timestamp.
- **Timestamps:** taken programmatically (`new Date().toISOString()`): this record 2026-10-02T16:52:14Z.

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete within the boundary. F220 and the tied H220 wording are corrected; no other place repeats the contradiction.
- **Not done here:** no research; the 7 open pass-013 findings stay open.
- **Independent verification:** not performed. Next come PM's check of RESULT BA-001-14, a correction PR, and a **fresh independent correction-validation** by a new BA, who is neither an author nor an earlier reviewer, with root pass 006 and previous pass and coverage base 013. It checks this change and the obligations it directly affects, and keeps the rest of the coverage with reasons. After that pass, the work returns to Stage 4. This self-check is not independent closure.
- **Questions for PM:** none blocking.

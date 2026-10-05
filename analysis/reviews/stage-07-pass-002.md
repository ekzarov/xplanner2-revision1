# Stage 07 Review - Pass 002

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

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!CAUTION]
> **Result: `findings` (discrepancies require disposition) - returns to Stage 6**
>
> Export set `stage-06-draft-13-ux-006-13` at `8a610c3`: `audit:prototype` passes and all 118 pinned hashes match. The pass-001 corrections are real: F-001, F-003, F-004, F-005, F-008, F-011 and F-012 are resolved, and F-002, F-006, F-009, F-010 and F-013 are largely resolved. 65 checks: 42 matched, 22 mismatch, 0 not checked, 1 not applicable. There are 9 new findings: 2 Medium, 4 Low and not cosmetic, 3 Low and cosmetic. F-001: the progress chart that row 110 keeps is drawn as two static bars, not as a line chart over time. F-002: one role view gives admins the hide permission and another withholds it. The Low-cosmetic closing exception does not apply.
>
> **Waiver:** the content of `waiver:legacy_walkthrough_fallback:xplanner2-revision1` was verified (10 of 10 content checks match). This pass is not `clean`, so it cannot supply the clean waiver-verifying link that Stage 7 needs before it can close.
>
> **Checklist issues:** F-005 links to CHK-007 (stale claims again after a correction). F-002 links to CHK-002. F-004 links to CHK-005 (required marking of validated fields). The other findings link to no existing check.
>
> **Unchecked scope:** none required. The non-required limitations are listed in [Blocked Scope](#read-blocked-scope).
>
> **Next:** Stage 6 corrects F-001..F-009 under the return protocol. Then another eligible fresh reviewer runs a Stage 7 pass on the new export set version.
>
> **Details:** [Comparison Results](#read-comparison-results) / [Pass-001 Resolution](#read-pass-001-resolution) / [Findings](#read-findings) / [Waiver Verification](#read-waiver-verification) / [Open Visual Remainders](#read-open-visual-remainders) / [Conclusion and Next Gate](#read-conclusion-and-next-gate).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Independence Declaration](#read-independence-declaration)
- [Scope and Inputs](#read-scope-and-inputs)
- [Method and Coverage](#read-method-and-coverage)
- [Stage 2 Phase A - Blind Inventory](#read-stage-2-phase-a-blind-inventory)
- [Stage 2 Phase B - Two-Way Reconciliation](#read-stage-2-phase-b-two-way-reconciliation)
- [Stage 2 Correction Validation](#read-stage-2-correction-validation)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
- [Pass-001 Resolution](#read-pass-001-resolution)
- [Findings](#read-findings)
- [Cosmetic Findings](#read-cosmetic-findings)
- [Waiver Verification](#read-waiver-verification)
- [Open Visual Remainders](#read-open-visual-remainders)
- [Keep Work Focused](#read-keep-work-focused)
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

- Date: 2026-10-05 (review started `2026-10-05T11:08:11Z`; report written from `2026-10-05T11:26:39Z`; UTC from code)
- Stage: 07
- Pass: 002
- Scope: xplanner2-revision1
- Scope boundary: the complete Stage 6 prototype record. That is export set `stage-06-draft-13-ux-006-13`, [`analysis/prototyping/screen-manifest.json`](../prototyping/screen-manifest.json), `screen-normalization.json` (incl. `excluded_rows` and `deferred_rows`), `wireframes/**` (58 HTML + 58 PNG), `ui-design-system.md` and `ui-design-tokens.json`. They are compared with the parity map, the Stage 4 and Stage 5 decisions and the pass-001 findings. The waiver below is verified too.
- Reviewed revision: `8a610c307aa56461fcb9055fb1b8704cb90c1a88` (main after PR #52), detached worktree `C:/Work/Legacy/xp-qa7b`. `git status --porcelain` showed 0 lines before the review, after the audits and after the evidence was written.
- Base revision: `23e96ebb9bcceec7e99b6589c240d0eecd52a9cb` (the revision reviewed by pass 001, for the resolution table only)
- Reviewer product: Claude Code (Claude Opus model family), subagent
- Reviewer ID: `claude-code-qa-s07-p002`
- Session ID: a06532cea70b36b82
- Authored artifacts in reviewed scope: none
- Independence record: this report ([Independence Declaration](#read-independence-declaration))
- Waiver IDs reviewed: `waiver:legacy_walkthrough_fallback:xplanner2-revision1` (content verified; no clean closing link, because this pass is `findings`; see [Waiver Verification](#read-waiver-verification))
- Orchestration packet: `S07-P002` (direct role packet from PM; no packet digest supplied)
- Result: findings
- Artifact set version: `stage-06-draft-13-ux-006-13` (export set version)
- Artifact manifest SHA-256: `62d28c32d0c0145a4a92813477b5cf47c5c340bbe92f50bf849bc36b0a401852`
- Verification mode: full (every export, row and record in scope). A per-finding resolution of pass 001 is added.
- Control mode: not applicable (Stage 2 only)
- Verification baseline: `8a610c3`, the manifest hash above
- Expansion trigger: none

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] I followed the access boundary of my declared control mode. Stage 7 has no blind phase. I read only the inputs the packet permits.

Eligibility evidence:

- ACK of `.agents/skills/migration-qa/SKILL.md`. SHA-256 computed in the pinned tree: `bc79b222d5299300b542ad04b7ccc566500cc8a60a58ed9ae3b2dba48bfb82f3`. It equals the packet value.
- `git -C C:/Work/Legacy/xp-qa7b rev-parse HEAD` returned `8a610c307aa56461fcb9055fb1b8704cb90c1a88`. The status was clean before and after the review.
- This session started fresh with no prior context. It did not author any Stage 5 or Stage 6 artifact, and it did not perform pass 001. It wrote nothing in either repository except the files under `.migration-tmp/stage-07/p002/` of the main repository. Helper scripts are in the session scratchpad.
- **Disclosure for PM and owner judgement:** this subagent was launched by PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. The scratchpad path carries that ID. The Stage 5/6 records name the same PM session as the launcher of the UX authoring subagents (`ui-design-system.md` "Created by"). This context contains none of that authoring and no chat history from it. Pass 001 made the same disclosure.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

All inputs were read in the pinned tree `C:/Work/Legacy/xp-qa7b` at `8a610c3`.

| Input | Identity |
|---|---|
| [`analysis/prototyping/screen-manifest.json`](../prototyping/screen-manifest.json) | SHA-256 `62d28c32…1852` (= packet); `schema_version` 4; 25 screens; 29 non-visual rows; export set `stage-06-draft-13-ux-006-13` |
| [`analysis/prototyping/screen-normalization.json`](../prototyping/screen-normalization.json) | file `67e7590f…8d0f`; evidence hash (without `_schema_help`) recomputed `a38073ba…3938` = manifest `normalization_sha256`; 145 rows, 34 excluded, 31 deferred |
| `analysis/prototyping/wireframes/**` | 116 files (58 HTML, 58 PNG), all pinned; `evidence/hash-verification.json` |
| [`analysis/prototyping/ui-design-system.md`](../prototyping/ui-design-system.md) | `7109a1c8…8dc9` (pinned) |
| [`analysis/prototyping/ui-design-tokens.json`](../prototyping/ui-design-tokens.json) | `36f3b7a2…555e` (pinned); foundation digest `97e04be7…907b` = Stage 5 pin |
| [`analysis/prototyping/ui-ux-decision.md`](../prototyping/ui-ux-decision.md) | `89b3d88d…6931`; decision version 1 "Material Lean"; `UI foundation SHA-256: 97e04be7…907b` |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | `e1478edd…64a6`; sheet "User Flows", header row 6; read with `@excel.js/exceljs` via `createRequire`, not edited; governed-rows digest `87636a53…0b861` = manifest |
| [`analysis/stages/stage-04/stage-04-requirements-revision.md`](../stages/stage-04/stage-04-requirements-revision.md) | `d6636e86…dbfc`; D-001..D-025 and the Decision Reconciliation table |
| [`analysis/migration_status.yaml`](../migration_status.yaml) | `a78eccbc…33f5`; `current_stage: stage-07`; waiver and `legacy_walkthrough` blocks |
| [`analysis/stages/stage-03/walkthrough-001-fallback.md`](../stages/stage-03/walkthrough-001-fallback.md), `walkthrough-001.md` | `2d6f4bb1…ce4d`, `b061cd97…239e` |
| Previous pass | [`analysis/reviews/stage-07-pass-001.md`](./stage-07-pass-001.md) and [`analysis/reviews/evidence/S07-P001/`](./evidence/S07-P001) (5 files) |
| Governing procedure | `AGENTS.md`; `MIGRATION.md` (Keep Work Focused, Waiver Contract, transitions, Stage Gate Matrix, Conditional Cosmetic Follow-up); [`analysis/migration_methodology.md`](../migration_methodology.md) (Stop criterion and Stage 7 exception, Stage 7, Minor visual correction deadline contract, Exit criterion for Stage 7); [`analysis/reviews/README.md`](./README.md); the template; [`analysis/prototyping/README.md`](../prototyping/README.md) (incl. "Navigation And Identity Before Drawing"); `ui-design-system-guide.md`; [`analysis/agent-roles.md`](../agent-roles.md); [`analysis/tools/README.md`](../tools/README.md) (waiver registry); [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) (`8a15e08c…a90b`) |

Channels and roles: one responsive web application (desktop, and phone at about 390 CSS px, with 320 px reflow), plus the print output. Roles: unauthenticated visitor, viewer, editor, admin and system administrator.

Explicit exclusions:

- The live Google Stitch projects. The packet forbids them, and Stage 7 reviews the exported catalogue.
- The author's claim and provenance files outside the pinned tree (`.migration-tmp/stage-06/…`, `exports/ux-006-06/…`, and the hand-off `handoff-ux-006-13.md` that the normalization note 4 and the catalogue cite). They are not permitted inputs. Every determination here comes from the pinned exports and records.
- [`legacy/README.md`](../../legacy/README.md), `.migration-tmp/stage-03/secrets` and client spill files. None was opened (one spill is disclosed in the [Interaction Log](#read-interaction-log)).

<a id="read-method-and-coverage"></a>

## Method and Coverage

1. **Automated gates.** I ran `npm run audit:prototype` and `npm run audit:status` in [`analysis/tools`](../tools). I also ran `prototype-audit.js --governed-rows-digest` and `ui-design-system.js` on the tokens.
2. **Hashes.** A Node script recomputed the SHA-256 of all 118 manifest file entries (116 wireframe files plus the catalogue and the tokens). It compared the directory with the manifest both ways and recomputed the normalization evidence hash. Output: `evidence/hash-verification.json`.
3. **Row accounting.** I read all 210 business rows from the workbook. I classified them by column J: keep 65, change 80, do-not-port 34, defer 31. I compared that with `rows[]`, `excluded_rows[]` and `deferred_rows[]`, and with the do-not-port and defer lists in the Stage 4 Decision Reconciliation.
4. **Row-level coverage.** I read each of the 145 applicable rows (requirement, expected result, column J) and recorded one determination: D (drawn), P (a pattern of unchanged composition, only message text or values differ), N (navigation), NV (non-visual), M (mismatch). Output: `evidence/coverage-check.json`.
5. **Exports.** I viewed all 58 PNG exports with the Read tool. A cheerio scan read every HTML export: title, viewport, skip link, first focus stop, breadcrumb items and `aria-current`, `aria-sort`, header buttons, dialog roles, tab roles, menus, labels, required and invalid state, fonts, icon sets, non-token colours, fixed widths, overflow and text-transform. Output: `evidence/export-scan.json`. Targeted greps checked messages, invented data, excluded functions and CSS contexts.
6. **Journeys.** I walked every map-backed journey across the exports: entry, destination, next/back/cancel, retained context, breadcrumbs, roles, profile identity and the Save/Reset/Cancel semantics. Figures were cross-checked across the iteration pages, story and task pages, person pages, timesheets, statistics and the board.
7. **Viewport.** For the 11 phone exports I checked the PNG width (390 px, or 780 px at 2x) and the HTML viewport meta. I judged 320 px reflow from the CSS myself: fixed and min widths, nowrap items, scroll containers, breakpoints, `overflow-x` on the body.
8. **Catalogue, tokens and kit.** I compared the 22 catalogue variants with the 25 `ui-kit.html` sections, the screen `ui_variants`, the evidence in each screen's HTML, the catalogue states with the kit specimens, and the rendered values with the tokens.
9. **Pass-001 findings.** I checked F-001..F-014 one by one in the pinned exports (`evidence/pass001-resolution.json`).
10. **Waiver.** I checked the waiver fields, delegation, record, hash pin, scope, permitted stage, residual items and blocked scope, and its downstream treatment (`evidence/waiver-verification.json`).

No sampling: all 25 screens, 116 export files, 145 applicable rows, 34 excluded rows, 31 deferred rows and 29 non-visual rows were checked.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: Stage 7 pass.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: Stage 7 pass.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

Not applicable: Stage 7 pass. Attempt Recovery is not applicable either.

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `full`. It covers the whole export set `stage-06-draft-13-ux-006-13` with its manifest, normalization, catalogue, tokens and kit, against all 210 governed rows, plus the waiver.
- Previous report and pinned baseline: [`analysis/reviews/stage-07-pass-001.md`](./stage-07-pass-001.md) (export set `stage-06-draft-12-ux-006-12`, manifest `4c97c62e…6f9b`, revision `23e96eb`). It is used only for the per-finding resolution table.
- Changed items and direct dependencies rechecked: every item. No pass-001 result is counted as newly matched.
- Prior results relied on but not rerun: none.
- Expansion triggers examined: none needed (full pass).

<a id="read-comparison-results"></a>

## Comparison Results

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001 / `audit:prototype` | Prints `PROTOTYPE AUDIT OK` (methodology Stage 7) | `25 screens; 116 pinned exports`, `PROTOTYPE AUDIT OK`, exit 0; one WARN that `ui-ux-approval.md` is absent (expected before Stage 8) | matched | [Gates](#read-automated-and-manual-gates) | none |
| C-002 / export paths and SHA-256 | Every manifest path resolves with a matching hash; no unlisted export | 118 entries, 0 mismatches; 116 files on disk and 116 listed; no duplicates | matched | `evidence/hash-verification.json` | none |
| C-003 / normalization pin | `normalization_sha256` = evidence hash | `a38073ba…3938` = manifest | matched | same | none |
| C-004 / governed rows pin | `workbook_rows_sha256` = workbook digest | `87636a53…0b861`, 210 of 210 | matched | `--governed-rows-digest` | none |
| C-005 / foundation pin | Token foundation digest = Stage 5 pin | `97e04be7…907b` both | matched | `ui-design-system.js` | none |
| C-006 / row accounting | keep/change classified, do-not-port excluded, defer deferred (column J) | 145 + 34 + 31 = 210; 0 rows misplaced; every row's "Stage 4 keep/change" note agrees with column J | matched | `coverage-check.json` `row_accounting` | none |
| C-007 / excluded rows vs Stage 4 | Each cites its do-not-port decision | 34 of 34 cite a D-number present in column J; the set equals the Stage 4 reconciliation do-not-port set (34) | matched | normalization vs workbook vs Stage 4 | none |
| C-008 / deferred rows vs Stage 4 | Decision and resume condition | 31 of 31 match column J, have `resume_condition`, and equal the Stage 4 defer set (31). None is drawn (no import, attachment, receivers list, MPX/MSPDI, metrics tab, iCal or remember-me in any export) | matched | normalization `deferred_rows`; export greps | none |
| C-009 / non-visual rows | Only behaviour without a surface; initiating screen where one exists | 29 rows (24 and 26 moved to states); `initiating_screen` set for 19. The 10 null rows (23, 25, 28, 29, 30, 32, 64, 72, 73, 187) are server-wide rules with no single initiating screen | matched | manifest `non_visual_workbook_rows` | none |
| C-010 / row-level coverage | Every applicable UI row drawn or covered by a verified unchanged-composition pattern | D 76, P 37, N 2, NV 29, M 1 (row 110) | mismatch | `coverage-check.json` | F-001 |
| C-011 / iteration-page (15 rows) | Stories, roles, dialogs, menus, empty, print | admin, editor and viewer views; close, continue (incl. the phone version), no-future, start, move-selected dialogs; export menu XML/PDF; Notes with Edit/Delete; empty state on the phone; print. Figures reconcile (100/48/52) | matched | list-*, dialog-*, continue-*, iteration-* exports | none |
| C-012 / task-editor | Form, validation, Save/Reset/Cancel, breadcrumb to the task page (manifest) | Form and errors drawn. The breadcrumb ends at a non-link "Task 12" with `aria-current`. There is no link to the task page and no "Edit" item, unlike every other editor | mismatch | `form-desktop.html`, `form-phone.html` | F-003 |
| C-013 / sign-in | Form, rejection, landing navigation | Drawn; rejection alert on the phone. Required fields are not marked in text | mismatch | `signin-*.html` | F-004 |
| C-014 / projects-list | System-administrator and member views, Hidden column, empty, no root breadcrumb | Both views drawn; no breadcrumb. `ui_variants` still declares `nav.breadcrumb` | mismatch | `projects-list-*.html`; manifest | F-002, F-005 |
| C-015 / project-page | System-administrator and admin views, export menu, notes, iteration table | Delete only in the system-administrator view; admin: Edit/Create iteration and the XML menu; Notes; phone with priority columns | matched | `project-page-*` | none |
| C-016 / project-editor | Options, Hidden by hide permission (rows 80, 81) | Drawn for role `admin` with the Hidden checkbox. That contradicts the admin member view of projects-list (no Hidden column, row 76) | mismatch | `project-editor-desktop.png` | F-002 |
| C-017 / iteration-editor | Picker, strict dates, Save/Reset/Cancel, phone | Picker on desktop and phone; phone marks Start/End "(required)", desktop does not | mismatch | `iteration-editor-*.html` | F-004 |
| C-018 / iteration-tasks | Grouped tasks, consistent figures | Story 5 is 22.0 (5+5+6+6); all groups reconcile | matched | `iteration-tasks-desktop.png` | none |
| C-019 / iteration-statistics (rows 109-111) | Six pies; progress line chart of estimated and actual hours from samples (row 110); burn-down; weekends included (rows 110, 111) | Six pies consistent with the task data. "Progress" is two static `role=progressbar` bars, not a line chart. The burn-down is labelled "per working day" and skips 03-07/03-08 | mismatch | `iteration-statistics-*.html/png` | F-001 |
| C-020 / iteration-accuracy | Summary and per-story table | Totals 96/100/48/52; over-estimate 2.0 and under-estimate 6.0 reconcile with the task table | matched | `iteration-accuracy-desktop.png` | none |
| C-021 / iteration-board | Read-only board, three columns | Desktop and phone; 3/10/5 matches the task statuses | matched | `iteration-board-*` | none (cosmetic F-007) |
| C-022 / story-page | Detail, roles, move/continue with validation, export PDF, notes | Editor and viewer views; move/continue dialog with Move/Continue/Cancel and the same-iteration error; PDF menu; Notes | matched | `story-*` | none |
| C-023 / people-list | List, Create person for admin/system administrator | Drawn; the role variation is recorded as a state | matched | `people-list-desktop.png` | none |
| C-024 / person-timesheet | Period, summary, daily totals, pies | 31.0 reconciles with User A's actual hours; "By story" is a pie | matched | `person-timesheet-desktop.png` | none |
| C-025 / search-results | Typed results; note result opens its parent | Drawn; the note result links to Story 2 | matched | `search-results-desktop.png` | none |
| C-026 / history | Object view and project container view | Both drawn, with "Show events of the project itself" | matched | `history-*` | none (cosmetic F-007, F-009) |
| C-027 / story-editor | Form, disposition/status, Save/Reset/Cancel | Drawn | matched | `story-editor-desktop.png` | none |
| C-028 / task-page (rows 26, 140-147, 185) | Open, completed with Reopen, viewer, delete, move/continue with validation | All drawn | matched | `task-*` | none |
| C-029 / time-editor | Grid, delete, recalculation, validation, re-estimate, phone | Drawn; phone shows the row error with "Person (required)", desktop has no required marking | mismatch | `time-editor-*.html` | F-004 |
| C-030 / person-page | Sections, Time/Edit links, viewer, Me, initials avatar | Drawn; figures reconcile with the task table | matched | `person-page-*` | none (cosmetic F-007) |
| C-031 / person-editor | System-administrator and project-admin views, password, deactivation | Drawn | matched | `person-editor-*` | none |
| C-032 / aggregate-timesheet | People selection, period, tables, pies | 48.0 reconciles | matched | `aggregate-timesheet-desktop.png` | none |
| C-033 / note-editor (rows 169, 170, 173, 174) | Add, edit with the author kept, delete confirmation, validation | Drawn. Body is not marked required although, with attachments deferred, a note without body is always rejected (row 170) | mismatch | `note-*` | F-004 |
| C-034 / error-page and system-info | Generic error with reference; system information without connection details, reachable | Both drawn; system information is reached from the system-administrator top bar | matched | `error-page-desktop.png`, `system-info-desktop.png` | none |
| C-035 / roles across screens | Each role view correct and mutually consistent (rows 24, 26, 76, 81; D-001) | Pass-001 F-001/F-002 corrected. The admin hide permission contradicts itself (C-014/C-016) | mismatch | manifest `roles`, exports | F-002 |
| C-036 / journeys | Entry, destination, next/back/cancel, retained context | All journeys traverse, including system information, notes, export, move/continue, reopen and container history. One manifest path does not exist: the task-editor breadcrumb to task-page | mismatch | [Stage-Specific Evidence](#read-stage-specific-evidence) | F-003 |
| C-037 / breadcrumbs | Hierarchical pages: parent links, non-link current item; none at the root or in dialogs | 52 exports correct; none at the root, sign-in, error or print. The task editor lacks its parent link | mismatch | `export-scan.json` | F-003 (spacing: cosmetic F-007) |
| C-038 / profile identity | Initials avatar with missing-image fallback; no photo or upload | `avatar.initials` UA/UB, `aria-hidden`, next to the name; no photo or upload | matched | `person-page-*.html` | none (shape: cosmetic F-007) |
| C-039 / Save/Reset/Cancel | Save stores and returns; Reset restores and stays; Cancel leaves without saving | All 8 editor views draw Save, Reset, Cancel in that order; phones stack them | matched | editor exports | none |
| C-040 / phone viewport fit | Real ~390 CSS px captures | 11 phone PNGs: 10 at 390 px, signin-phone at 780 px (2x). `continue-dialog-phone.png` is cropped to the dialog (390×344), but its width is real | matched | PNG sizes | none |
| C-041 / 320 px reflow (static) | No page-level horizontal scroll at 320 CSS px; wide tables scroll in their own container | No fixed or min width above 320 px outside a scroll container. `list-phone` uses `min-width: 520px` inside `overflow-x: auto`; the statistics phone stacks pies below 360 px; the burn-down sits in its own scroller. Four phones set `overflow-x: hidden` on the body, which would mask overflow, but no overflowing element was found | matched | `export-scan.json`; CSS contexts | none |
| C-042 / phone pattern reliance | Surfaces without a phone export are covered by a verified phone pattern | Patterns now include the date picker, select in a dialog and empty state; the remaining surfaces map to list, form, detail, dialog, board, chart and grid patterns | matched | manifest `_notes[7]`; phone exports | none |
| C-043 / catalogue ↔ kit ↔ screens | Each variant previewed and used | 22 catalogue variants, 25 kit sections (22 plus danger hover, scrolled table, top-bar focus); every variant is used | matched | catalogue; `ui-kit.html` | none |
| C-044 / declared variants and catalogue truth | Declared variants evidenced; the catalogue describes the exports | `projects-list` declares `nav.breadcrumb` with none drawn. `chart.line` says "iteration progress and burn-down", and the kit's Actual/Estimated line chart is used by no screen | mismatch | variant evidence scan; kit | F-001, F-005 |
| C-045 / rendered colours vs tokens | Exports use token values | Non-token colours remain: `#FAFBFC` (6 exports), `#E4E6EB`, `#E2E5E9`, `#E2E4E8`, `#A5ADBA`, `#FEEBEA`. The desktop and phone disposition pies use different series colours | mismatch | `export-scan.json` `non_token_hex` | F-008 |
| C-046 / font family and icons | OS font stack, no font files; Lucide only | All 58 exports use the system stack; no Google Fonts, Inter or Material Symbols | matched | scan | none |
| C-047 / type sizes and units | `type.size-body` 1rem (16 px) for text, 0.875rem for tables; rem units (Stage 5) | No export uses rem. Body is 14 px in 33 exports and 16 px in others | mismatch | scan (body font-size) | F-008 |
| C-048 / focus visibility | 2 px primary focus outline; initial focus on the safe choice in dialogs | Every interactive export defines a 2 px focus outline. Close, delete, start and move dialogs show focus on Cancel | matched | grep; dialog PNGs | none |
| C-049 / labels | Visible labels, never placeholder-only | All form controls have a visible label or an accessible name (grid cells); no placeholders | matched | scan `inputs` | none |
| C-050 / status not by colour alone | States in text | Task, story and iteration states in text; progress with %; error icon plus text | matched | exports | none |
| C-051 / skip link | "Skip to main content" is the first focus stop of the signed-in frame | 55 of 55 signed-in exports; the target `#main`/`#main-content` exists | matched | scan `skip`, `first_focusable`, `main_id` | none |
| C-052 / zoom | No zoom blocking; no fixed viewport width | Every viewport is `width=device-width, initial-scale=1` | matched | scan `viewport` | none |
| C-053 / native controls and tab semantics | Native checkbox/select; tabs are links with `aria-current` (catalogue) | Native checkbox in the start dialog and selects in dialogs. `role="tab"` links without `aria-selected` in `iteration-start-dialog-desktop.html` (lines 449-454) and `iteration-statistics-phone.html` (443-448) | mismatch | scan `tabs`; grep | F-004 |
| C-054 / breadcrumb `aria-current` | The current item carries `aria-current="page"` | Present in every breadcrumb (52 exports and the kit) | matched | scan `breadcrumb.current` | none |
| C-055 / `aria-sort` | The sorted header exposes `aria-sort`; headers are buttons | All 16 exports with a sort indicator have `aria-sort` on that header, and the headers are buttons | matched | grep ▲/▼ vs `aria-sort` | none |
| C-056 / required marking in text | Required fields marked in text (Stage 5; `field.text`) | Missing on iteration-editor-desktop Start/End, time-editor-desktop Person, sign-in User ID/Password, note Body | mismatch | scan `inputs` | F-004 |
| C-057 / dialog semantics | `role=dialog`, `aria-modal`, labelled, consequences named | 11 dialogs with `role=dialog`, `aria-modal=true`, `aria-labelledby`. Delete dialogs name the effect (Task 8 "2 time entries (2.0 h)"; note subject) | matched | scan `dialogs` | none |
| C-058 / currency of author claims | Status statements match the pinned files (CHK-007) | 10 stale or false statements in the catalogue, manifest and normalization | mismatch | [F-005](#read-f-005) | F-005 |
| C-059 / unsupported invention (functions and data) | No function or data outside approved rows | No target baseline, issue keys, attachments, imports or deferred functions. Project options come from row 80 | matched | greps | none |
| C-060 / page titles | Titles name the page; no authoring artefacts | 48 of 58 `<title>`s carry prompt codes ("UX13-24 …"), and 17 carry capture notes ("(no shell)", "(Phone 390, tab row scroll)", "aria-sort") | mismatch | scan `title` | F-006 |
| C-061 / content fidelity | Figures consistent across exports | All checked totals reconcile, except the Story 2 history entry against its original estimate, and the "Entry 3" label | mismatch | history/list/tasks; time-editor-phone | F-009 |
| C-062 / additions and target-only | No unapproved addition | No `target_only` entries. Avatar, Reset/Cancel and the System information link are covered by rows or by the recorded owner direction | matched | manifest; rows | none |
| C-063 / manifest record completeness | Actions, navigation and variants truthful per screen | Actions and navigation complete. Two untrue entries: projects-list `nav.breadcrumb`, task-editor "breadcrumb to task-page" | mismatch | manifest | F-005, F-003 |
| C-064 / shared frame consistency | Sibling pages share frame, separators, labels and avatar | Several differences remain (pass-001 F-014) | mismatch | PNGs | F-007 |
| C-065 / wizard steps | Wizard steps drawn | No wizard exists in the agreed scope | not-applicable | rows; D-001..D-025 | E-001 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 65 | 42 | 22 | 0 | 1 |

Findings are counted separately: 9 findings (2 Medium, 4 Low not cosmetic, 3 Low cosmetic). One finding can affect several checks. The row-level coverage behind C-010 (145 rows) is in `evidence/coverage-check.json`. Those rows are not counted as separate check items. The waiver checks W-1..W-11 are reported in [Waiver Verification](#read-waiver-verification) and are not part of these counts.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Screen to rows, roles, states, files, hashes and verdict** (all hashes verified, C-002)

| Screen | Declared roles | Rows | Exports | Verdict |
|---|---|---|---|---|
| iteration-page | admin, editor, viewer | 24, 91-93, 95-99, 101-104, 192, 210 | list-desktop/phone, dialog-desktop/phone, continue-dialog-desktop/phone, continue-no-future, iteration-start-dialog, iteration-print, iteration-viewer, iteration-export-menu, iteration-move-stories-dialog, iteration-empty-phone | matched |
| task-editor | editor | 134, 136, 137, 139, 190 | form-desktop/phone | mismatch (F-003) |
| sign-in | unauthenticated | 8, 10, 12-14, 18 | signin-desktop/phone | mismatch (F-004) |
| projects-list | system administrator, viewer, editor, admin | 19, 75-77 | projects-list-desktop, projects-list-member-desktop | mismatch (F-002, F-005) |
| project-page | system administrator, admin | 82-84, 208, 209 | project-page-desktop/phone, project-page-admin-desktop | matched |
| project-editor | admin | 78-81 | project-editor-desktop | mismatch (F-002) |
| iteration-editor | editor | 71, 88-90 | iteration-editor-desktop/phone | mismatch (F-004) |
| iteration-tasks | viewer | 106 | iteration-tasks-desktop | matched |
| iteration-statistics | viewer | 109-111 | iteration-statistics-desktop/phone | mismatch (F-001) |
| iteration-accuracy | viewer | 113 | iteration-accuracy-desktop | matched |
| iteration-board | viewer | 114 | iteration-board-desktop/phone | matched (cosmetic F-007) |
| story-page | editor, viewer | 126-132, 212 | story-page, story-move-dialog, story-viewer-export | matched |
| people-list | admin, system administrator | 37, 39 | people-list-desktop | matched |
| person-timesheet | editor | 162, 163 | person-timesheet-desktop | matched |
| search-results | editor | 178, 179, 181-183 | search-results-desktop | matched |
| history | editor | 186 | history-desktop, history-project-desktop | matched (cosmetic F-007, F-009) |
| story-editor | editor | 121-123, 125 | story-editor-desktop | matched |
| task-page | editor, viewer | 26, 140-147, 185 | task-page, task-delete-dialog, task-move-dialog, task-completed, task-viewer | matched |
| time-editor | editor | 100, 149-161 | time-editor-desktop/phone | mismatch (F-004) |
| person-page | editor, viewer | 40-42, 188 | person-page-desktop, person-page-viewer-desktop | matched (cosmetic F-007) |
| person-editor | system administrator, admin | 33, 34, 43-48 | person-editor-desktop, person-editor-admin-desktop | matched |
| aggregate-timesheet | editor | 165, 166 | aggregate-timesheet-desktop | matched |
| note-editor | editor | 169, 170, 173, 174 | note-editor-desktop, note-editor-edit-desktop, note-delete-dialog-desktop | mismatch (F-004) |
| error-page | editor | 56, 57 | error-page-desktop | matched |
| system-info | system administrator | 55 | system-info-desktop | matched |
| (resource) ui-kit | - | - | ui-kit.html/png | 25 sections; `#chart-line` shows an unused progress line chart (F-001) |

**Row determinations** (`evidence/coverage-check.json`): of 145 applicable rows, D 76, P 37, N 2, NV 29, M 1. The M row is 110 (F-001). The P rule is the one pass 001 used: only the message text or a value differs, and the pattern is drawn in a real export. Examples: delete confirmations of project, iteration and story use the drawn task-delete pattern that names the effect. Validation messages use the drawn error-summary and field-error pattern. Empty messages use the drawn empty state.

**Journey walk (desktop and phone):**

- **Planning path.** Sign-in, projects list, project page, iteration Stories tab, story page, task page. From the task page: task editor (Save/Reset/Cancel to the origin; breadcrumb gap in F-003) and time editor (breadcrumb to Task 8). The context Project 1 / Iteration 3 / Story 2 / Task 8 is consistent throughout.
- **System administrator.** Top bar, then System information.
- **People.** People list, person page, then person editor (breadcrumb User A / Edit) and timesheet. Projects list to aggregate timesheet.
- **Search.** Results, then the object (a note opens its parent).
- **Iteration dialogs.** Close confirmation, then continue (with a future iteration) or no-future. Start confirmation with "Close started iterations". Move selected stories.
- **Story and task dialogs.** Move/continue with the same-object rejection. Completed task with Reopen.
- **Notes.** Notes section (Edit/Delete), note editor in edit mode, delete-note confirmation.
- **Export and history.** Export menus with only the kept formats. Project history to "Show events of the project itself".
- **Error page.** Go to projects.
- **Print.** Reachable by URL only (row 192).
- **Me.** Opens the person page.

**Figure reconciliation:** iteration 100/48/52 equals the stories, which equal the tasks. Board 3/10/5 matches the task statuses. Pies: types 13/3/2 and dispositions 15/3; hours 70/21/9 and 39/5/4. Accuracy 96/100 with over 2.0 and under 6.0. Timesheets 31.0 and 48.0. Person pages match the task acceptors, customers and trackers. Exceptions are in F-009.

<a id="read-pass-001-resolution"></a>

## Pass-001 Resolution

Each item was verified in the pinned exports. No item is accepted on the author's claim (`evidence/pass001-resolution.json`).

| Pass-001 finding | Status in this pass | Evidence |
|---|---|---|
| F-001 (high) role states | **resolved** | Rows 24 and 26 are now states; per-screen roles are declared. Role views: iteration-viewer, iteration-export-menu (editor), list-desktop/phone (admin), task-viewer, story-viewer-export, person-page-viewer, person-editor-admin, projects-list-member, project-page-admin. 29 non-visual rows remain |
| F-002 (medium) denied actions shown | **resolved as stated**. A new, different role contradiction is open as F-002 | Delete iteration only in the admin view. Create project and Hidden column only for system administrators. Delete project only for the system administrator. Create person for admin and system administrator (row 24) |
| F-003 (medium) dialogs, menus, states | **resolved** | Story and task move/continue with validation, move selected stories, export menus, Reopen, no-future, container history, and `field.select` in the dialogs. The progress chart (new F-001) was not in pass-001 F-003 |
| F-004 (medium) dead ends | **resolved** | System information link in the system-administrator top bar; Notes sections with Edit/Delete; edit mode and delete confirmation |
| F-005 (medium) phone coverage | **resolved** | list-phone keeps every action and the select-all checkbox; phone date picker, select in a phone dialog and empty state are drawn |
| F-006 (medium) accessibility baseline | **largely resolved; residual open as F-004 (low)** | Skip link (55/55), zoom, viewports, native checkbox, `aria-current` (all), `aria-sort` (all sorted headers), and "Person (required)" on the phone are corrected. The same tab mechanism recurs in 2 exports, and required marking is missing in 4 places |
| F-007 (low) stale claims | **partly resolved; open as F-005** | The ten pass-001 statements were rewritten. New statements are stale or false (CHK-007 repeated) |
| F-008 (low) invented data | **resolved** | No "Target baseline" series; no "PLN-" placeholder |
| F-009 (low) record gaps | **largely resolved; residual open as F-005** | `initiating_screen` filled for 19 rows; Reset declared; navigation complete; kit previews for danger hover, scrolled table and top-bar focus; `color.danger-hover` token. Residual: projects-list `nav.breadcrumb`, the task-editor navigation entry |
| F-010 (low cosmetic) values vs foundation | **largely resolved; residual open as F-008** | No Material 3 theme, Inter, Google Fonts or Material Symbols; no `#086D39`/`#004FB6`. Six non-token colours and the px/14 px body remain |
| F-011 (low cosmetic) Story 5 figure | **resolved** | 22.0 in every export |
| F-012 (low cosmetic) root breadcrumb | **resolved** | No breadcrumb on either projects-list export |
| F-013 (low cosmetic) chart rendering | **largely resolved; residual in F-008** | Filled pies everywhere; the timesheet "By story" chart is a pie. The disposition series colour differs between desktop and phone |
| F-014 (low cosmetic) shared frame | **open as F-007** | Insets, separators, avatar shape, upper-case labels and others remain |

<a id="read-findings"></a>

## Findings

<a id="read-f-001"></a>

### F-001 - The kept progress chart is drawn as static bars, and the burn-down drops weekends

- Severity: medium (never cosmetic: a required state of a kept function is misrepresented)
- Comparison check IDs: C-010, C-019, C-044
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: row 110 (Stage 4 keep): "A progress line chart plots the iteration's estimated and actual hours from the stored data samples … weekends included". Row 111: "weekends are included in charts". Row 109: the progress and burn-down line charts. Catalogue `chart.line`: "Flat line chart: iteration progress and burn-down … rows 109 and 110". The kit `#chart-line` shows an Actual and an Estimated hours line over dates.
- Observed difference: in `iteration-statistics-desktop.html` and `-phone.html`, the "Progress" section contains two `role=progressbar` bars ("Actual hours 48.0 h 48%" and "Estimated hours 100.0 h 100%"). It has no chart over time (0 SVG in that section). The kit's progress line chart is used by no screen. The burn-down is labelled "per working day" (aria-label in both exports). Its axis skips 2026-03-07/08, while the kept rows include weekends.
- Evidence: cheerio section scan of both statistics exports; `iteration-statistics-desktop.png`; `ui-kit.png` section chart.line.
- Requirement impact: rows 109, 110, 111; state `progress-chart-shown`.
- Required action: draw the progress chart as the estimated and actual hours line chart over the sample dates (as the kit specimen shows), and include weekends in both charts. Alternatively, record an owner decision that changes rows 110 and 111.
- Correction impact: both statistics exports; `chart.line` usage note; the manifest state.
- Return stage: 6

<a id="read-f-002"></a>

### F-002 - The hide permission is held and withheld by the admin role in different views

- Severity: medium (never cosmetic: incorrect role representation)
- Comparison check IDs: C-014, C-016, C-035
- **Checklist link:** CHK-002 (permission conditions; pinned checklist `8a15e08c…a90b`)
- **Checklist discrepancy:** the same permission (hide) is represented two ways for one role. No enforcement statement settles which view is right.
- **Required recheck:** CHK-002 over every view that depends on the hide permission (projects-list, project-editor, person-editor).
- Expected and source: row 76: the Hidden column is "visible only with hide permission". Row 81: "users with hide permission can hide" the project. D-001: no extension of rights by default; matrix at SDD.
- Observed difference: `project-editor-desktop` (declared role `admin`) shows the **Hidden** checkbox, so admins hold the hide permission. `projects-list-member-desktop` ("Viewer, Editor, Admin"; manifest state "no Hidden column … rows 24, 27, 76") omits the Hidden column, so admins do not.
- Evidence: `project-editor-desktop.png` (Hidden checkbox); `projects-list-member-desktop.png`; manifest `projects-list.states[2]`, `project-editor.roles`.
- Requirement impact: rows 76, 81 (and the role-state statements of rows 24, 26).
- Required action: choose one representation of the hide permission per role, consistent with D-001. Either show the Hidden column to the roles that may hide, or draw the project editor's Hidden checkbox only for roles that may hide. Record the role state in the manifest.
- Correction impact: projects-list, project-editor; check the person-editor "Deactivated" control by the same rule (row 48).
- Return stage: 6

<a id="read-f-003"></a>

### F-003 - Task-editor breadcrumb has no parent link to the task page

- Severity: low (not cosmetic: a navigation path recorded in the manifest does not exist)
- Comparison check IDs: C-012, C-036, C-037, C-063
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: prototyping README: "breadcrumbs on hierarchical pages with meaningful, accessible parent links and a non-link current item". The manifest `task-editor.navigation` says "breadcrumb to task-page". All other editors end with a link to their object plus "Edit", "Note" or "Time".
- Observed difference: `form-desktop.html` and `form-phone.html` end the breadcrumb with `<span aria-current="page">Task 12</span>`. The task page is not linked, and assistive technology announces the editor as "Task 12". Cancel still returns to the origin, so the journey is not broken.
- Evidence: `export-scan.json` `form-desktop.html.breadcrumb` (4 links, current "Task 12"); compare `story-editor-desktop` "… Story 2 / Edit".
- Requirement impact: rows 134, 185.
- Required action: make "Task 12" a link and add a current "Edit" item, as in the other editors.
- Correction impact: form-desktop, form-phone.
- Return stage: 6

<a id="read-f-004"></a>

### F-004 - Residual accessibility semantics: tab roles and required-field marking

- Severity: low (not cosmetic: programmatic state and form accessibility, a residual of pass-001 F-006)
- Comparison check IDs: C-013, C-017, C-029, C-033, C-053, C-056
- **Checklist link:** CHK-005 (form validation keys covered) for the required fields that are validated (rows 44, 89, 154, 170)
- **Checklist discrepancy:** the validation exists (the phone views mark it), but the desktop and sign-in forms do not mark it.
- **Required recheck:** CHK-005 on the four forms.
- Expected and source: Stage 5 accessibility: "labels always visible, required fields marked in text". Catalogue `nav.tabs`: "tabs are links to routes", with `aria-current` (as 55 exports do). ARIA tab semantics require `aria-selected` when `role="tab"` is used.
- Observed difference:
  - (a) `iteration-start-dialog-desktop.html` lines 449-454 and `iteration-statistics-phone.html` lines 443-448 use `role="tablist"`/`role="tab"` on links without `aria-selected`. This is the mechanism pass 001 reported for list-phone, now in two other exports.
  - (b) Required marking is missing in text: `iteration-editor-desktop` Start/End date (the phone marks them "(required)"); `time-editor-desktop` Person (the phone says "Person (required)", row 154); `signin-desktop/phone` User ID and Password (`required` attribute, no text); note Body in add and edit mode. With attachments deferred (D-018), row 170 "a note without body is rejected" always applies.
- Evidence: `export-scan.json` `tabs`, `inputs`.
- Requirement impact: Stage 5 baseline; rows 44, 89, 154, 170.
- Required action: remove `role="tab"` (keep links with `aria-current`) or add the full tab semantics; mark these required fields in text.
- Correction impact: the 2 tab exports; iteration-editor-desktop, time-editor-desktop, signin-*, note-editor*.
- Return stage: 6

<a id="read-f-005"></a>

### F-005 - Stale or false author claims in the pinned records

- Severity: low (not cosmetic: unsupported claims in the Stage 8 package)
- Comparison check IDs: C-014, C-044, C-058, C-063
- **Checklist link:** CHK-007 (figures match the current artifact after a correction). This repeats pass-001 F-007.
- **Checklist discrepancy:** the UX-006-13 correction rewrote the pass-001 statements but added new ones that the exports contradict.
- **Required recheck:** CHK-007 over `ui-design-system.md`, the manifest (`scope`, `_notes`, `ui_variants`, `navigation`) and the normalization notes.
- Expected and source: MIGRATION.md Keep Work Focused ("never invent … unsupported claims"); ui-design-system-guide ("The catalogue must describe what the exports actually show").
- Observed difference:
  1. `ui-design-system.md` line 84 (`table.data`): "older exports with sortable headers still lack it and are pending regeneration". All 16 exports with a sort indicator have `aria-sort` (C-055).
  2. Line 88 (`nav.top-bar`): skip link "missing in older exports pending regeneration". It is present in 55 of 55 (C-051).
  3. Line 89 (`nav.breadcrumb`): "13 older exports omit the attribute and are pending regeneration". Every current item has it (C-054).
  4. Manifest `_notes[2]`: "Open coverage items for QA: phone date picker, select inside a phone dialog and phone empty state are not verified (pending phone exports)". `_notes[7]` and the exports contradict it.
  5. Manifest `scope`: "Stage 6 UX-006-12 …", while the set is `stage-06-draft-13-ux-006-13`.
  6. Manifest `_notes[7]` cites superseded screen IDs as the verifying exports (list-phone a10e679d, form-phone 78b9b2d9, dialog-phone fdb44f71, project-page-phone f4a330e1, iteration-board-phone 58e255ee, iteration-statistics-phone 76be6213). `_notes[3]` names the replacing exports.
  7. Normalization `rows[97].note` "The target choice step is not drawn yet" and `rows[102].note` "second step, not drawn yet". Both are drawn.
  8. Normalization `rows[208].note`: the Export link is drawn "on … person pages". No person page has one, which is correct under D-021.
  9. Normalization `_notes[4]` and the catalogue Coverage table defer the open items and visual remainders to `handoff-ux-006-13.md`, outside the pinned record. The status says they are "listed in the manifest notes", but the manifest names one (form-phone separators). The owner cannot see the remainders in the Stage 8 package.
  10. Manifest `projects-list.ui_variants` declares `nav.breadcrumb`, and none is drawn. `task-editor.navigation` declares "breadcrumb to task-page" (F-003).
- Evidence: numbered reads of the pinned files; `export-scan.json`.
- Requirement impact: record integrity of the Stage 8 package.
- Required action: correct the statements to the actual state. List the open visual remainders in the pinned record (manifest or catalogue). Re-run CHK-007.
- Correction impact: catalogue lines 84, 88, 89; manifest `scope`, `_notes[2]`, `_notes[7]`, `projects-list.ui_variants`; normalization rows 97, 102, 208 and `_notes[4]` (the normalization hash changes).
- Return stage: 6

<a id="read-f-006"></a>

### F-006 - Authoring metadata in the page titles of the pinned exports

- Severity: low (not purely cosmetic: the page title is programmatically exposed, WCAG 2.4.2, and is binding source text for Stage 17 content fidelity; no flow is affected)
- Comparison check IDs: C-060
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: titles that name the page; no text without a requirement (Stage 5 "Not covered: any invented text"). The prototyping README Implementation parity provenance says Stage 17 derives label and content checks from these exact files.
- Observed difference: 48 of 58 `<title>`s start with a prompt code ("UX13-24 Aggregate timesheet - Planner", "UX13-P15f …"). Seventeen also carry capture notes, for example "(no shell)", "(Phone 390, tab row scroll)", "(Phone UI, Admin, aria-sort)", "(single dialog, no shell)", "(Editor, progress fill)". Titles also differ in form ("… - Planner" vs none).
- Evidence: `export-scan.json` `title` for each file.
- Requirement impact: content fidelity of every screen; page-title accessibility.
- Required action: give each export a plain page title in one pattern (for example "Edit task: Task 12 - Planner"), or record that titles are out of the binding scope.
- Correction impact: 48 exports (title element only).
- Return stage: 6

<a id="read-cosmetic-findings"></a>

## Cosmetic Findings

These three findings are Low and purely visual or sample data under the README rules. None is a missing flow, invented behaviour, a role or security issue, a missing state/action/dialog, broken navigation or unusable clipping. They do not close the stage by themselves, because F-001..F-006 are not cosmetic. This pass creates no backlog.

| ID | Severity | Observation and evidence | Required action | Return stage |
|---|---|---|---|---|
| F-007 | low, cosmetic | Shared-frame differences (pass-001 F-014 residual). **Insets:** 30 px (task-viewer, editors, project pages), 40 px (iteration tabs, story-page, task-page), 65 px (person-page), 80 px (task-move/delete dialogs, note-edit, projects lists). **Action-link separators:** "•" in task-page, project-page, export-menu and person pages; none in list-desktop, story-page, task-completed. **Breadcrumb spacing:** "Top /Project 1" in project-page-phone and form-phone; "Top/Project 1/" in dialog-phone, empty-phone and statistics-phone. **Doubled separators:** form-phone has a CSS `li+li::before "/"` and also an `aria-hidden` "/" span, which overlap the link text. **Upper-case labels:** CSS `text-transform: uppercase` (DOM text is sentence case) on board status headings, the board "STORY" header and the menu "FORMAT" caption, against the sentence-case rule. **Avatar:** a circle on person-page-viewer against the 6 px square of the catalogue and kit. **Layout:** note-editor-edit puts the actions outside the card; the iteration-empty-phone tab row is cut at "Bo" with a visible scrollbar, while list-phone fits; history "By" is a link in one view and plain in the other, and dates are monospace in one view; list-desktop (admin) clips the Status column inside its scroll container at 1600 px, while the viewer and export views fit; iteration-editor labels are bold, other editors are regular | Align with the shared frame and the catalogue `nav.*`, `avatar.initials` and `field.*` rules | 6 |
| F-008 | low, cosmetic | Rendered values against tokens (pass-001 F-010/F-013 residual). Non-token colours: `#FAFBFC` (6 exports), `#E4E6EB`, `#E2E5E9`, `#E2E4E8`, `#A5ADBA`, `#FEEBEA`. Every export uses px; the body is 14 px in 33 exports against `type.size-body` 1rem. Disposition pies use series-3 (grey) for "Discovered" on desktop and series-2 (green) on the phone. This is not approval of px units: the implementation must consume the rem tokens (Stage 5) | Bind to the tokens; add extension tokens where a new value is needed; use one series order | 6 |
| F-009 | low, cosmetic | Sample data. `history-desktop` Story 2: "Estimate changed from 20.0 to 24.0" on 2026-03-04, after the iteration started on 03-02. The original estimate of Story 2 is 24.0 in list, tasks, print and accuracy (it would be 20.0). `time-editor-phone`: the error summary says "Entry 3: Person", but the block is titled "New entry" | Make the sample figures and labels consistent | 6 |

<a id="read-waiver-verification"></a>

## Waiver Verification

`waiver:legacy_walkthrough_fallback:xplanner2-revision1`. The detailed ledger is `evidence/waiver-verification.json`.

| Check | Expected (MIGRATION.md Waiver Contract; methodology Stop criterion; tools README registry; fallback Conditions) | Observed | Result |
|---|---|---|---|
| W-1 schema and fields | decision, decided_by, decided_at, scope, rationale, record, residual_risk, permitted_next_stage | All present; `audit:status` passes | matched |
| W-2 gate and exact scope | `waiver:<gate>:<exact-scope>`, scope exactly `xplanner2-revision1` | Exact; `legacy_walkthrough.scope` and `decision_id` agree | matched |
| W-3 permitted next stage | registry `legacy_walkthrough_fallback` → `stage-04` | `stage-04`; the 3→4 transition at `2026-10-02T16:04:50Z` cites the waiver and the record | matched |
| W-4 decision authority | owner, or a recorded delegation covering this gate | Codex under `operational-mandate-stage4-completion:xplanner2-revision1` (decided by `ekzarov`; `delegation.waivers: [legacy_walkthrough_fallback]`; ends at Stage 5). The record states it is not a personal owner approval | matched |
| W-5 durable record | exists, pinned | `walkthrough-001-fallback.md` SHA-256 `2d6f4bb1…ce4d` = the Stage 4 pin | matched |
| W-6 waived scope exact; no applicable unwaived scope omitted | waived = residual (d)+(e) | R-24..R-47 = 5 (d) + 19 (e) = 24 items. R-01..R-17 are resolved (a) and R-18..R-23 are observed unavailability (c), so none is residual. All 25 partially verified rows map to a waived item | matched |
| W-7 residual risk and blocked scope visible | not claimed as observed | `outcome: blocked-waived`; `W001-residual-R24-R47` is blocked with the waiver id and both records | matched |
| W-8 Condition 1 carried to Stage 4 | requirements resting on waived sub-checks are marked | Stage 4 marks "Rests on unverified legacy behavior" per decision (for example D-011 on R-24, R-40). Line 383 says the waived items stay unverified | matched |
| W-9 prototype does not claim waived behaviour as verified | target behaviour only | No reference to R-24..R-47 or legacy observation in the prototype records. The affected rows (37, 47, 69-71, 76, 80, 82, 91, 101, 126, 149, 186, 189) are drawn as Stage 4 target behaviour | matched |
| W-10 record location | methodology Stop-criterion text: the canonical record "lives in `analysis/stages/waivers/`" | The record is beside the walkthrough in [`analysis/stages/stage-03/`](../stages/stage-03), and that directory does not exist. MIGRATION.md and the validator require only a durable record path | matched. Observation O-1 for PM: a wording difference between the methodology and the project layout; not a finding |
| W-11 closing link | the next independent control gives a **clean** pass that verifies the waiver and links the record | This pass verified W-1..W-10, but its result is `findings` | **not satisfied by this pass** |

**Result: the waiver content is verified. The waiver is not verified for Stage 7 closure.** The rules require a `clean` pass that verifies the waiver and links its record. This pass is `findings`, so Stage 7 cannot leave on this pass. The next eligible pass must repeat this verification and be `clean`. The unavailable legacy behaviour of R-24..R-47 stays unverified whatever the verdict.

<a id="read-open-visual-remainders"></a>

## Open Visual Remainders

The packet says the author lists 11 open visual remainders that the human has not accepted. The pinned record names one of them (form-phone doubled breadcrumb separators, manifest `_notes[3]`). The list itself is in an out-of-tree hand-off that is not a permitted input (see F-005 item 9). I therefore assess the categories the packet names and every comparable remainder I found in the exports. I do not accept any of them on the owner's behalf.

| Remainder | Classification under the README Low-cosmetic rules | Reason |
|---|---|---|
| Doubled breadcrumb separators (form-phone) | cosmetic (F-007) | Presentation only. The links, the order and `aria-current` are intact, and the extra separator span is `aria-hidden`. The overlap reduces legibility slightly but nothing is clipped or unreachable |
| Uneven separator spacing (breadcrumbs; "•" in action links) | cosmetic (F-007) | Spacing and decoration; no semantic change |
| Upper-case board labels and the "FORMAT" caption | cosmetic (F-007) | CSS `text-transform`; the DOM text is sentence case, so assistive technology reads it normally |
| Stale `<title>`s | **not purely cosmetic** (F-006) | The page title is exposed to assistive technology and is binding source text for Stage 17; it carries authoring codes and capture notes. Low, but not eligible for the cosmetic backlog |
| F-014 residuals: insets, tab colours, label weights, avatar shape, note-edit action placement, history link and monospace styling | cosmetic (F-007) | Visual consistency only |
| Status column clipped at 1600 px in list-desktop (admin) | cosmetic (F-007) | Contained, focusable scroll region; reachable; not unusable clipping |
| iteration-empty-phone tab row cut at "Bo" | cosmetic (F-007) | The catalogue allows a horizontally scrolling tab row; the scrollbar is visible and the tabs are reachable |
| Non-token colours, px units, body 14 px, pie series order | cosmetic (F-008) | Values only; the token binding is restored at Stage 17. The rem rule is noted |
| Story 2 history estimate, "Entry 3" label | cosmetic (F-009) | Sample data only |
| `continue-dialog-phone.png` cropped to 390×344 | not a defect | The width is real and the HTML is a full page; the dialog-phone export shows the full phone context |
| Progress chart drawn as bars; burn-down "per working day" | **not cosmetic** (F-001) | Misrepresents a kept function (row 110, 111) |
| Hide-permission contradiction for admin | **not cosmetic** (F-002) | Role representation |

<a id="read-keep-work-focused"></a>

## Keep Work Focused

These are concrete instances in the reviewed Stage 6 work, as MIGRATION.md requires:

- **Required correction (unsupported claims):** F-005. The records state pending regenerations and unverified phone items that the exports contradict, and they defer open items to a file outside the pinned package.
- **Required correction (invented text):** F-006. Authoring codes and capture notes are left in the binding exports.
- **No unjustified scope expansion found.** No target-only screen, no deferred or excluded function drawn, no extra component variant (22 catalogue variants, all used).
- **Optional improvement (not a defect):** the four phone exports with `overflow-x: hidden` on the body would mask a future overflow. Removing it would make 320 px regressions visible. No current overflow was found (C-041).

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Prototype audit | `npm run audit:prototype` in `C:/Work/Legacy/xp-qa7b/analysis/tools` (`2026-10-05T11:08:35Z`) | pass: "WARN: ui-ux-approval.md is not present; rerun with --require-approval before Stage 8 closes" / "25 screens; 116 pinned exports" / "PROTOTYPE AUDIT OK", exit 0 | console output in this session |
| Status audit | `npm run audit:status` | pass: "Validated migration_status.yaml at stage-07" / "STATUS VALIDATION OK" | console output |
| Governed rows digest | `node analysis/tools/prototype-audit.js --governed-rows-digest` | pass: `87636a53…0b861`, 210 of 210 rows | console output |
| Foundation digest | `node analysis/tools/ui-design-system.js analysis/prototyping/ui-design-tokens.json` | pass: `97e04be7…907b` | console output |
| Export hashes | Node SHA-256 over all manifest entries and a directory comparison | pass: 118/118; 116 files both ways | `evidence/hash-verification.json` |
| Row coverage | Manual per-row determination over 145 rows | 1 M row | `evidence/coverage-check.json` |
| Visual and structural review | 58 PNGs viewed; 58 HTML scanned | see Comparison Results | `evidence/export-scan.json` |
| Waiver verification | Manual ledger W-1..W-11 | content verified; closing link not satisfied | `evidence/waiver-verification.json` |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-065 | No wizard (multi-step flow) exists in any applicable row or decision | Scope evidence: the 145 applicable rows and D-001..D-025 | `evidence/coverage-check.json` |

- Blocker: none.
- Exact unchecked scope: none required.
- Non-required limitations, stated so that they are not mistaken for checks:
  - The HTML exports were not rendered in a live browser. Four exports load Tailwind from a CDN, and the packet allows no network access. Fit and 320 px reflow were judged from the PNG captures and a static reading of the CSS (C-041). The author's local 320 px renders were not used as evidence.
  - Interactive behaviour (hover, focus order, Escape, focus return, picker keyboard use) cannot be exercised on static exports. Stage 17 verifies it.
  - The full author list of the 11 open visual remainders is outside the pinned inputs. Every export was reviewed for such remainders instead (see [Open Visual Remainders](#read-open-visual-remainders)).
- Required prerequisite: none.
- Reassignment/closure reference: not applicable.

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-009 | this report and `evidence/` | pending | pending | pending (next fresh Stage 7 pass) |

Operational disclosures:

- One read command over a range of [`analysis/migration_status.yaml`](../migration_status.yaml) produced output above the console limit, and the client saved it to a spill file. I did not open the spill file. I re-read the needed lines in narrow ranges. Nothing was written to either repository.
- One shell heredoc failed to parse. The helper script was written to the scratchpad with the file tool instead. There was no effect on either repository.
- CHK-009 / constitution A3 credential check: this review read no credential source. The new evidence contains only field labels ("Password", "New password", "Confirm password") and synthetic `example.test` addresses from the exports. Hit count for credential values in the new evidence: 0. No credential value is known to this session, and the legacy factory pair's source is forbidden.

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-005 → CHK-007 (stale status statements after a correction, repeated from pass-001 F-007). F-002 → CHK-002 (one permission represented two ways for one role). F-004 → CHK-005 (validated required fields not marked). The required rechecks are listed in each finding.

Result `findings`. Coverage Summary: 65 checks, 42 matched, 22 mismatch, 0 not checked, 1 not applicable. Unresolved blocked scope is zero. Findings: F-001 and F-002 medium; F-003..F-006 low and not cosmetic; F-007..F-009 low and cosmetic. The Stage 7 Low-cosmetic closing exception does not apply: there are Medium findings, and F-001/F-002 belong to never-cosmetic classes (a misrepresented required state, incorrect roles). This pass creates no backlog.

The process returns to **Stage 6** for F-001..F-009 under the [return and correction protocol](README.md#return-and-correction-protocol). No finding needs a deliberate channel or design-system change (Stage 5). No finding exposes a parity-map defect (Stage 1): rows 76, 81, 110 and 111 are clear, and the defects are in the drawing. The waiver content is verified, but Stage 7 cannot close without a `clean` pass that verifies it. The next gate is a new Stage 7 pass by another eligible fresh reviewer on the corrected export set version. Stage 8 cannot close on this export set.

<a id="read-error-prevention"></a>

## Error Prevention

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b`. It is unchanged since pass 001; none of the pass-001 learning proposals was added.
- Author self-check record/version: no Stage 6 self-check record in the pinned artifacts. The normalization notes for rows 24 and 26 cite CHK-002. The status `prevention_self_check` holds only a Stage 2 carryover note. The packet and the status say "all exported views pass the author accessibility check", but no record of that check is in the pinned tree. Its absence is not proof that the checklist was not read.

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-002; role and permission representation | cited in normalization rows 24, 26 | partly failed: the pass-001 role views are corrected; the hide permission contradicts itself (C-016, C-035) | F-002; recheck the hide-dependent views |
| CHK-005; validation states of forms | not recorded | partly failed: validation drawn; required marking missing on 4 forms (C-056) | F-004 |
| CHK-006; delete confirmations | not recorded | passed: task and note delete dialogs name the effect; the project, iteration and story pattern is the same | none |
| CHK-007; figures and status after a correction | not recorded | failed again: 10 stale statements (C-058) | F-005 |
| CHK-009; evidence written by this review | not applicable to the author | passed for this report (Interaction Log) | none |
| CHK-001, CHK-003, CHK-004, CHK-008, CHK-010, CHK-011, CHK-012 | - | not applicable: no source-line, side-effect, locale, query, link-parameter, unauthenticated-surface or request-sink claim is made or reviewed at Stage 7 | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 7 pass 002, this report version; checklist `8a15e08c…a90b`. CHK-009 passed for my evidence. CHK-007 was applied to my own figures: 65/42/22/0/1 (recounted from the table by script); D 76, P 37, N 2, NV 29, M 1; 118 hashes; 22 variants and 25 kit sections; 48 titles; 55 skip links; and the row counts all come from script output in this session. Line numbers come from numbered reads of the cited file (CHK-001 practice).
- **Learning update (proposals for the coordinator; not edits to the table):**
  1. A refinement of CHK-007, repeated from pass 001 because it recurred: after any export regeneration, re-read each "pending/missing/not verified" statement and each cited screen ID in the catalogue, the manifest and the normalization notes, and compare them with the files on disk.
  2. A possible new check, "One permission, one representation per role": a role must not hold a permission in one view and lack it in another unless an owner decision records the difference (F-002).
  3. A possible new check, "The kit specimen equals the screen usage": every chart or component shape on the component sheet is the one the screens use for the same row (F-001).

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: dependency graph review belongs to Stages 10 and 16. This Stage 7 pass reviews the prototype record only.

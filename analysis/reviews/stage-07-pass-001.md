# Stage 07 Review - Pass 001

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
> Export set `stage-06-draft-12-ux-006-12` at `23e96eb`: the structural audit passes and all 80 pinned hashes match, but 26 of 57 comparison checks are mismatches. 14 findings: 1 High, 5 Medium, 3 Low non-cosmetic, 5 Low cosmetic. Role states are not represented and drawn role views show actions the map denies (F-001, F-002); move/continue, move-stories and export-menu dialogs, the reopen state and other states are not drawn (F-003); system information, note edit and note delete cannot be reached (F-004); phone coverage and the accessibility baseline are incomplete (F-005, F-006). The Low-cosmetic closing exception does not apply because non-cosmetic findings exist.
>
> **Checklist issues:** F-001 and F-002 link to CHK-002; F-007 links to CHK-007; F-003 links to CHK-005 for the undrawn move/continue validation states. The other findings link to no existing check.
>
> **Unchecked scope:** none required (non-required limitations are listed in [Blocked Scope](#read-blocked-scope)).
>
> **Next:** Stage 6 corrects F-001..F-014 under the return protocol; a new eligible fresh Stage 7 pass follows.
>
> **Details:** [Comparison Results](#read-comparison-results) / [Findings](#read-findings) / [Conclusion and Next Gate](#read-conclusion-and-next-gate) / [Coverage Summary](#read-coverage-summary).

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
- [Findings](#read-findings)
- [Cosmetic Findings](#read-cosmetic-findings)
- [Author Open Items And Deviations Assessed](#read-author-open-items-and-deviations-assessed)
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

- Date: 2026-10-03 (report drafted from `2026-10-03T14:42:14Z`, UTC from code)
- Stage: 07
- Pass: 001
- Scope: project `xplanner2-revision1`, the complete Stage 6 prototype record: export set `stage-06-draft-12-ux-006-12`, [`analysis/prototyping/screen-manifest.json`](../prototyping/screen-manifest.json), `screen-normalization.json`, `wireframes/**` (39 HTML + 39 PNG), `ui-design-system.md`, `ui-design-tokens.json`, against the parity map and the Stage 4 and Stage 5 decisions
- Reviewed revision: `23e96ebb9bcceec7e99b6589c240d0eecd52a9cb` (PR #49 head), detached worktree `C:/Work/Legacy/xp-qa7`, `git status` clean before and after review
- Base revision: not applicable (first Stage 7 pass)
- Reviewer product: Claude Code (Claude Opus model family), subagent
- Reviewer ID: `claude-code-qa-s07-p001`
- Session ID: ac6db45336bd6251f
- Authored artifacts in reviewed scope: none
- Independence record: this report ([Independence Declaration](#read-independence-declaration))
- Waiver IDs reviewed: none (no prototyping waiver exists in the reviewed scope)
- Orchestration packet: `S07-P001` (direct role packet from PM, plus one PM addendum on currency of author claims; no packet digest supplied)
- Result: findings
- Artifact set version: `stage-06-draft-12-ux-006-12` (export set version)
- Artifact manifest SHA-256: `4c97c62e4f8802e83469463de746be5a74c10641325808de63e6fe13959c6f9b`
- Verification mode: full
- Control mode: not applicable (Stage 2 only)
- Verification baseline: `23e96eb`, manifest hash above
- Expansion trigger: none

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] I followed the access boundary of my declared control mode. Stage 7 has no blind phase; I read the permitted inputs listed in the packet.

Eligibility evidence:

- ACK of `.agents/skills/migration-qa/SKILL.md`. SHA-256 computed in the pinned tree: `bc79b222d5299300b542ad04b7ccc566500cc8a60a58ed9ae3b2dba48bfb82f3`. It equals the packet value.
- `git -C C:/Work/Legacy/xp-qa7 rev-parse HEAD` returned `23e96ebb9bcceec7e99b6589c240d0eecd52a9cb`. `git status --porcelain` returned 0 lines before the review, after `audit:prototype` and after the evidence was written.
- This session started with no prior context. It wrote nothing in either repository except the files in `.migration-tmp/stage-07/p001/` of the main repository, as the packet requires. Scratch helper scripts are in the session scratchpad.
- **Disclosure for PM and owner judgement.** PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8` launched this subagent. Its scratchpad path carries that ID. The Stage 5 and Stage 6 records name the same PM session as the launcher of the UX authoring subagents (for example `ui-design-system.md` "Created by"). This reviewer's context contains none of that authoring and no chat history from it. Under the methodology definition (different agent, fresh context, no shared chat history), I consider myself eligible. The shared launching coordinator is disclosed so that PM and the owner can make their own judgement.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

Permitted inputs, all read in the pinned tree `C:/Work/Legacy/xp-qa7` at `23e96eb`:

| Input | Identity |
|---|---|
| [`analysis/prototyping/screen-manifest.json`](../prototyping/screen-manifest.json) | SHA-256 `4c97c62e4f8802e83469463de746be5a74c10641325808de63e6fe13959c6f9b`; `schema_version` 4; 25 screens; 31 non-visual rows; export set `stage-06-draft-12-ux-006-12` |
| [`analysis/prototyping/screen-normalization.json`](../prototyping/screen-normalization.json) | file SHA-256 `f7ce44fd281aab91122868323f157a0420bdd28c4f0872aee9bcfc72fa155250`; evidence hash (without `_schema_help`) recomputed `c28d7213437eeb7de36fb83a9ae548c58aae689894930e6bf9ccd1c64b851b28` = manifest |
| `analysis/prototyping/wireframes/**` | 78 files (39 HTML, 39 PNG), all pinned; see `evidence/hash-verification.json` |
| [`analysis/prototyping/ui-design-system.md`](../prototyping/ui-design-system.md) | `ff3439c101c09c5db3ad048d3d637e230bc696b68a8c0822e8f77110787c2c80` (pinned) |
| [`analysis/prototyping/ui-design-tokens.json`](../prototyping/ui-design-tokens.json) | `69bbd849ddb1ad507635b968e8eb1af4527ba124d305516fbccb0cb5a35f7507` (pinned); foundation digest printed by `ui-design-system.js` `97e04be7b42ba98abd8b7df2afde691c64b80029465d2f763e6ba768801c907b` = Stage 5 pin |
| [`analysis/prototyping/ui-ux-decision.md`](../prototyping/ui-ux-decision.md) | Stage 5 decision version 1 "Material Lean" |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | SHA-256 `e1478eddada79b574268905cb5d2a7d2412336896cdd0f872398af7d37b264a6`; sheet "User Flows", header row 6; read with exceljs, not edited; governed-rows digest `87636a53544db5769d6bc1190de7afe5004d5e23afd3fa21eb8eab302ba0b861` = manifest |
| [`analysis/stages/stage-04/stage-04-requirements-revision.md`](../stages/stage-04/stage-04-requirements-revision.md) | SHA-256 `d6636e86fdacc444435e4e6f108bafacb8ba6bd9ae7dab62c020ae463851dbfc`; D-001..D-025, M-01..M-07 |
| Governing procedure | `AGENTS.md`, `MIGRATION.md` (Keep Work Focused, Stage Gate Matrix, Conditional Cosmetic Follow-up), [`analysis/migration_methodology.md`](../migration_methodology.md) Stages 6-8, Review Report Numbering, Stop criterion, Stage 7 exit criterion, [`analysis/reviews/README.md`](./README.md), the template, [`analysis/prototyping/README.md`](../prototyping/README.md) (incl. "Navigation And Identity Before Drawing"), `ui-design-system-guide.md`, `ui-visual-parity-checklist.md`, [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) (SHA-256 `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b`) |

Channels and roles in scope: the responsive web application (desktop and phone at about 390 CSS px) and the print output. Roles: unauthenticated visitor, viewer, editor, admin and system administrator (UF-002, Stage 5 decision).

Explicit exclusions:

- The live Google Stitch project. The packet forbids it, and Stage 7 reviews the exported catalogue, not SaaS links.
- The author's per-row D/P claim file and the provenance files that the manifest notes cite (`.migration-tmp/stage-06/...`, `exports/ux-006-06/...`). They are not in the pinned tree. I made every row determination independently from the exports.
- [`legacy/README.md`](../../legacy/README.md), Stage 3 secrets and client spill files. Never opened.
- The mail and non-UI outputs. They are covered by non-visual rows; no wireframe is expected.

<a id="read-method-and-coverage"></a>

## Method and Coverage

1. **Automated gate.** I ran `npm run audit:prototype` in [`analysis/tools`](../tools) and recorded the output.
2. **Hashes.** A Node script recomputed the SHA-256 of all 80 manifest file entries (78 unique files plus catalogue and tokens) and compared the wireframes directory with the manifest in both directions. It also recomputed the normalization evidence hash, the governed-rows digest (`prototype-audit.js --governed-rows-digest`) and the foundation digest. Output: `evidence/hash-verification.json`.
3. **Row accounting.** I classified all 210 business rows from workbook column J (keep 65, change 80, do-not-port 34, defer 31). I compared that classification with `rows[]`, `excluded_rows[]` and `deferred_rows[]`, and checked each exclusion or deferral citation against the D-number in that row's column J.
4. **Row-level coverage.** I read the full text of every one of the 145 applicable rows (requirement, expected result and Stage 4 note). For each, I decided independently whether it is drawn in a named export (D), covered by a drawn pattern whose composition is unchanged (P), recorded navigation (N), valid non-visual coverage (NV), or missing or misclassified (M). My acceptance rule for P: only the message text or data differs, and the pattern is drawn in a real export. Overlays, menus and states that change controls or composition need their own drawing. Output: `evidence/coverage-check.json` (D 59, P 36, N 2, NV 29, M 19).
5. **Exports.** I viewed every one of the 39 PNG exports. For every HTML export I read a structural outline built with cheerio from the analysis tools: headings, landmarks, labels, controls, ARIA, breadcrumb items, table headers and data. A scan across all exports recorded breadcrumb current items, skip links, top-bar contents, sort semantics, ARIA invalid/describedby, dialogs, focus rules, viewport meta, fixed widths, fonts, icon sets and every colour value that is not a token (`evidence/export-scan.json`, `evidence/non-token-colors.json`).
6. **Journeys.** I walked the journeys from the map and the manifest `navigation` entries across the exports: sign-in, projects, project, iteration and its tabs, story, task, task editor, time editor, people, person, person editor, timesheets, search, history, notes, error, system information, print. At each step I checked the entry, the destination, next/back/cancel, retained context, breadcrumbs, roles, the profile identity and the Save/Reset/Cancel semantics.
7. **Viewport.** For the 8 phone exports I checked the PNG pixel width (780 px = 390 CSS px at 2x, or a proportional downscale) and the HTML viewport meta, width constraints and contained table scrolling. I listed every surface that has no phone export of its own and checked whether a verified pattern covers it.
8. **Catalogue and tokens.** I checked the 21 catalogue variants against the 21 `ui-kit.html` section IDs and against the `ui_variants` that screens declare. I checked the declared variants against the evidence in each screen's HTML, the catalogue states against the preview, and the rendered colours, fonts and icons against the tokens and the foundation.
9. **Currency of author claims (PM addendum).** I compared every status statement in the catalogue, the manifest `_notes` and the normalization `_notes` with the pinned files.

No sampling: all 25 screens, 78 files, 145 applicable rows, 34 excluded rows, 31 deferred rows and 31 non-visual rows were checked. Command output was kept bounded. Two outputs exceeded the console limit and were saved to client spill files. I did not open those spill files and re-read the same inputs in narrower ranges instead (disclosed in [Interaction Log](#read-interaction-log)).

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

- Review mode and exact checked boundary: `full`. The whole export set `stage-06-draft-12-ux-006-12` and its manifest, normalization, catalogue and tokens, against all 210 governed rows.
- Previous report and pinned baseline: none. This is the first Stage 7 pass.
- Changed items and direct dependencies rechecked: not applicable (full review).
- Prior results relied on but not rerun: none.
- Expansion triggers examined: none needed.

<a id="read-comparison-results"></a>

## Comparison Results

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001 / `audit:prototype` | Prints `PROTOTYPE AUDIT OK` (methodology Stage 7) | `25 screens; 78 pinned exports`, `PROTOTYPE AUDIT OK`, exit 0; one WARN that `ui-ux-approval.md` is not present (expected before Stage 8) | matched | [Automated and Manual Gates](#read-automated-and-manual-gates) | none |
| C-002 / export paths and SHA-256 | Every manifest path resolves and its hash matches; no unlisted export (README Stage 7) | 80 entries, 0 mismatches; 78 files on disk, 78 in the manifest | matched | `evidence/hash-verification.json` | none |
| C-003 / normalization pin | `normalization_sha256` equals the evidence hash | Recomputed `c28d7213…1b28` = manifest | matched | `evidence/hash-verification.json` | none |
| C-004 / governed rows pin | `workbook_rows_sha256` equals the digest of the workbook | `87636a53…0b861`, 210 of 210 governed rows | matched | `prototype-audit.js --governed-rows-digest` | none |
| C-005 / foundation pin | Token foundation digest = Stage 5 pin `97e04be7…907b` | Printed digest equals the pin | matched | `ui-design-system.js` output | none |
| C-006 / row accounting | Keep/change rows classified, do-not-port excluded, defer deferred (column J; Stage 4) | 145 + 34 + 31 = 210; 0 rows placed in the wrong list | matched | scratch script output; `evidence/coverage-check.json` `row_accounting` | none |
| C-007 / excluded rows | Each cites the Stage 4 do-not-port decision of its row | 34 of 34 cite a D-number present in that row's column J, with "do-not-port" | matched | normalization `excluded_rows` vs workbook J | none |
| C-008 / deferred rows | Each cites its decision and a resume condition | 31 of 31 match column J; resume condition present | matched | normalization `deferred_rows` | none |
| C-009 / non-visual rows | Only behaviour without a visual surface; initiating screen named where one exists (methodology Stage 6) | 29 accepted. Rows 24 and 26 describe UI-visible role gating ("Create project links and iteration delete buttons are hidden"; "Icons/links appear or disappear by permission") but are classified non-visual. `initiating_screen` is null for all 31, including rows with an obvious initiating screen (27, 138, 164, 167, 180, 184) | mismatch | `screen-manifest.json#/non_visual_workbook_rows` | F-001, F-009 |
| C-010 / iteration-page (rows 91-104, 192, 210) | Every declared state, action and overlay drawn or covered by a verified pattern; role correct | Stories list, close/continue/start dialogs, print and empty state drawn. Missing: move-selected-stories target dialog (row 97), no-future-iteration dialog state (row 103), export menu (row 210). Delete iteration is shown to declared role editor (rows 24, 91). Phone export lacks the page actions | mismatch | `list-desktop.png`, `dialog-*.png`, `continue-dialog-desktop.png`, `iteration-start-dialog-desktop.png`, `iteration-print-desktop.png`, `list-phone.png` | F-002, F-003, F-005 |
| C-011 / task-editor (rows 134, 136, 137, 139, 190) | Form, validation, Save/Reset/Cancel, formatting help | All drawn (`form-desktop.png`, `form-phone.png` with error summary and field errors) | matched | `form-*.html` | none |
| C-012 / sign-in (rows 8, 10, 12-14, 18) | Form, rejection messages, landing navigation | Form and rejection alert drawn; rows 13 and 14 use the same alert composition (accepted pattern); landing recorded as navigation | matched | `signin-*.png` | none |
| C-013 / projects-list (rows 19, 75-77) | List, hidden column by permission, empty state, sign out | Drawn. Declared roles `editor,admin` see Create project (row 24: editors and admins may not create projects). The Hidden column is shown to an editor. A breadcrumb is shown on the root page | mismatch | `projects-list-desktop.png` | F-002, F-012 |
| C-014 / project-page (rows 82-84, 208, 209) | Detail, iteration table, delete confirmation, export menu | Detail and table drawn (desktop and phone). Declared role admin sees Delete project (rows 26, 82: sysadmin). Export menu with permitted formats not drawn. No Notes section to reach the existing notes | mismatch | `project-page-*.png` | F-002, F-003, F-004 |
| C-015 / project-editor (rows 78-81) | Form, options, missing-name state, Save/Reset/Cancel | Drawn; missing-name covered by the error pattern | matched | `project-editor-desktop.png` | none |
| C-016 / iteration-editor (rows 71, 88-90) | Date picker, strict dates, Save/Reset/Cancel | Drawn on desktop, with the picker open and a format hint; invalid state on `ui-kit#field-date` (phone in C-041) | matched | `iteration-editor-desktop.png` | none |
| C-017 / iteration-tasks (row 106) | Tasks grouped by story, consistent figures | Grouping drawn. Story 5 group row shows original estimate 23.0; its tasks sum to 22.0 and every other export shows 22.0 | mismatch | `iteration-tasks-desktop.png` | F-011 |
| C-018 / iteration-statistics (rows 109-111) | Six pies, progress and burn-down; no invented data | Drawn. Burn-down adds an unsupported "Target baseline (100h → 0h)" series. Desktop pies vs phone rings | mismatch | `iteration-statistics-*.html/png` | F-008, F-013 |
| C-019 / iteration-accuracy (row 113) | Summary tables and per-story table | Drawn; totals reconcile (96/100/48/52) | matched | `iteration-accuracy-desktop.png` | none |
| C-020 / iteration-board (row 114) | Read-only board in three columns | Drawn on desktop and phone; counts 3/10/5 match the task view (phone viewport issues in C-049) | matched | `iteration-board-*.png` | none |
| C-021 / story-page (rows 126-132, 212) | Detail, delete confirmation, move/continue dialog, export | Detail drawn. Move/continue dialog (rows 129-132) and PDF export menu (row 212) not drawn; `field.select` is declared but absent | mismatch | `story-page-desktop.html/png` | F-003 |
| C-022 / people-list (rows 37, 39) | List, project-filtered state | Drawn; project filter accepted as a heading variant. Declared role editor sees Create person (row 24: editors may not create people) | mismatch | `people-list-desktop.png` | F-002 |
| C-023 / person-timesheet (rows 162, 163) | Period, summary, daily totals, three pies | Drawn; figures reconcile (31.0). The "By story" pie renders as a square | mismatch | `person-timesheet-desktop.png` | F-013 |
| C-024 / search-results (rows 178-183) | Typed results and message states | Results drawn; message states covered by the message pattern | matched | `search-results-desktop.png` | none |
| C-025 / history (row 186) | Object history; project container view of created/deleted inner objects | Story history drawn. The container view (extra type and name columns) is neither drawn nor declared | mismatch | `history-desktop.png` | F-003 |
| C-026 / story-editor (rows 121-125) | Form with disposition/status persisted, Save/Reset/Cancel | Drawn | matched | `story-editor-desktop.png` | none |
| C-027 / task-page (rows 140-147, 185) | Complete, reopen, delete, move/continue, breadcrumb | Complete and delete drawn. Completed state with Reopen not drawn. Move/continue dialog not drawn. Export menu not drawn | mismatch | `task-page-desktop.png`, `task-delete-dialog-desktop.png` | F-003 |
| C-028 / time-editor (rows 100, 149-161) | Grid, delete, remaining recalculation, validation, re-estimate, start-iteration prompt | Drawn on desktop and phone (row error on phone); re-estimate placed as the Remaining hours field; start prompt via the drawn start dialog pattern | matched | `time-editor-*.png` | none |
| C-029 / person-page (rows 40-42, 188) | Sections, row links, edit link, Me destination, initials avatar | Drawn; data reconcile with tasks and stories; Me uses the same composition (accepted) | matched | `person-page-desktop.png` | none |
| C-030 / person-editor (rows 33, 34, 43-48) | Fields, password, deactivation, project roles, system administrator | Drawn | matched | `person-editor-desktop.png` | none (record gap in C-055) |
| C-031 / aggregate-timesheet (rows 165, 166) | People selection, period, tables and pies | Drawn; figures reconcile (48.0) | matched | `aggregate-timesheet-desktop.png` | none |
| C-032 / note-editor (rows 169, 170, 173, 174) | Add/edit note, validation, delete with confirmation | Add mode drawn. No delete control, no edit mode, no entry to existing notes on any object page | mismatch | `note-editor-desktop.png`, all object pages | F-004 |
| C-033 / error-page (rows 56, 57) | Generic error with reference; not-found | Drawn; not-found uses the same message composition | matched | `error-page-desktop.png` | none |
| C-034 / system-info (row 55) | Diagnostics for system administrators, without connection details, reachable | Page drawn without connection details. No entry point in any export; `nav.top-bar` says "Nothing else" | mismatch | `system-info-desktop.png`; top bar of all exports | F-004 |
| C-035 / roles | Every screen for every role that can see it, as role states where the composition changes (methodology Stage 6/7) | Each screen declares one role (two on projects-list). No viewer state of iteration-page, story-page, task-page, project-page, projects-list, people-list or person-page, and no admin or system-administrator variant. Role gating is moved to non-visual rows | mismatch | manifest `roles`; all exports | F-001 |
| C-036 / journeys | Each map-backed journey traversable: entry, destination, next/back/cancel, context | Main planning journeys traverse. Dead ends: system information entry; notes list, edit and delete; Move selected stories; Move or continue (story, task); Export (four pages); Reopen | mismatch | [Stage-Specific Evidence](#read-stage-specific-evidence) | F-003, F-004 |
| C-037 / breadcrumbs | Hierarchical pages have parent links and a non-link current item; none at the root or in dialogs | 34 exports (incl. the ui-kit specimen) show parent links and a plain current item; dialogs carry none themselves; sign-in, error and print have none. Root projects-list shows "Top" (semantic gaps in F-006) | mismatch | `export-scan.json` | F-012 |
| C-038 / profile identity | Avatar with a missing-image fallback; no invented photo or upload | `avatar.initials` "UA" (`aria-hidden`) next to the name; no photo or upload | matched | `person-page-desktop.html` | none |
| C-039 / Save/Reset/Cancel | Every editor: Save stores and returns, Reset restores and stays, Cancel leaves without saving | All 7 editors (task, project, iteration, story, note, person, time) draw Save, Reset and Cancel in that order; phone stacks them; semantics recorded in the catalogue and notes | matched | editor exports | none (manifest omission in C-055) |
| C-040 / phone viewport fit | Phone exports at the actual phone width, not a column on a wide canvas | All 8 phone exports are 390 CSS px (PNG 780 px at 2x, or a proportional downscale); no page-level horizontal scroll; tables scroll in their own containers | matched | PNG sizes; HTML width rules | none |
| C-041 / phone pattern reliance | Surfaces without a phone export are covered by a verified pattern | 17 of 25 screens have no phone export. Date picker, select in a phone dialog and phone empty state are unverified (manifest note 7). The iteration-page phone export drops page actions and select-all | mismatch | manifest `_notes[7]`; `list-phone.html` | F-005 |
| C-042 / catalogue ↔ kit ↔ screens | 21 variants, each previewed and used | 21 catalogue variants = 21 `ui-kit.html` section IDs = 21 used variants | matched | catalogue table; `ui-kit.html` | none |
| C-043 / catalogue states and declared variants | Catalogue describes what the exports show; every declared variant is evidenced | Preview lacks danger hover, `table.data` scrolled and `nav.top-bar` focus. Declared but absent: iteration-page `message.error-summary`, story-page and task-page `field.select`, note-editor `button.danger`/`dialog.confirm` | mismatch | `ui-kit.png`; variant scan | F-009 |
| C-044 / rendered colours vs tokens | Exports use token values | Exports use colours that are not tokens (ZIP 7 editors use the Material 3 theme, Save `#004FB6`, completion `#086D39`, danger hover `#AE2A19`/`#B02A20`, others) | mismatch | `evidence/non-token-colors.json` | F-010 |
| C-045 / type and icons vs foundation | System font stack, no font files; Lucide | Three editors render Inter from Google Fonts; 18 exports load Material Symbols and 3 render its glyphs | mismatch | font/icon scan | F-010 |
| C-046 / focus visibility | 2px focus outline in primary on every interactive element | Every interactive export defines a 2px focus ring or outline in primary; dialogs show initial focus on the safe choice | matched | focus scan; dialog PNGs | none |
| C-047 / labels | Visible labels, never placeholder-only | All form controls are labelled (visible label or `aria-label` for grid cells). Exceptions are only the inert background inside the phone modal and the kit specimens | matched | `export-scan.json` `unlabeled` | none |
| C-048 / status not by colour alone | States in text; colour supports only | Task, story and iteration states in text; progress with %; selection by checkbox; errors with icon and text | matched | exports | none |
| C-049 / accessibility baseline | Skip link, zoom/reflow, keyboard-operable controls, programmatic state (Stage 5 mandatory; catalogue) | No skip link in any export; two phone exports disable zoom and two fix `width=390`; start-dialog checkbox is a `div`; phone tabs lack the selected state; 13 breadcrumbs lack `aria-current`; sort headers lack `aria-sort`/buttons | mismatch | `export-scan.json`; viewport meta | F-006 |
| C-050 / currency of author claims | Status statements match the pinned files (CHK-007; PM addendum) | 9 stale or false statements in the catalogue and normalization notes | mismatch | [F-007](#read-f-007) | F-007 |
| C-051 / unsupported invention | No function or data outside approved rows | Burn-down "Target baseline" series; "e.g. PLN-102" issue-key placeholder | mismatch | statistics, `list-desktop.html` | F-008 |
| C-052 / contrast usage rules | Selected rows keep main text; controls keep a white fill on the header or selected background | Selected story rows use `#1D2125` text; checkboxes and inputs keep a white fill on `#F1F2F4`/`#E9F2FF` | matched | `list-desktop.html` | none |
| C-053 / content fidelity | Figures consistent across exports | One inconsistency (Story 5 23.0); all other cross-checked totals reconcile | mismatch | C-017 | F-011 |
| C-054 / additions and target-only | No unapproved addition; target-only cites a decision | No `target_only` or `target_only_elements` entries. Avatar (process-required identity), Reset (legacy Update/Reset, rows 81, 90, 125, 139) and Cancel (journey rule) are supported | matched | manifest; rows | none |
| C-055 / manifest record completeness | Actions and navigation recorded per screen | Reset is not declared on person-editor and note-editor; `navigation` is empty for person-editor, note-editor, aggregate-timesheet, error-page and system-info | mismatch | manifest `screens[]` | F-009 |
| C-056 / shared frame consistency | Sibling pages share frame, tabs and labels | Page inset 30/40/80 px across the iteration tabs; different unselected-tab colours; bold labels only on story-editor; board-phone top-bar links in text colour | mismatch | iteration tab PNGs | F-014 |
| C-057 / wizard steps | Wizard steps drawn | No wizard exists in the agreed scope | not-applicable | map rows | E-001 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 57 | 30 | 26 | 0 | 1 |

Findings are counted separately: 14 findings (1 High, 5 Medium, 3 Low non-cosmetic, 5 Low cosmetic). Row-level coverage behind C-009..C-036 is in `evidence/coverage-check.json` and summarised below; those rows are not counted as separate check items.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Screen to rows, roles, states, files, hashes and verdict**

| Screen | Declared roles | Rows | Exports (all hashes verified) | Verdict |
|---|---|---|---|---|
| iteration-page | editor | 91-93, 95-99, 101-104, 192, 210 | list-desktop/phone, dialog-desktop/phone, continue-dialog, iteration-start-dialog, iteration-print | mismatch (F-002, F-003, F-005) |
| task-editor | editor | 134, 136, 137, 139, 190 | form-desktop/phone | matched |
| sign-in | unauthenticated | 8, 10, 12-14, 18 | signin-desktop/phone | matched |
| projects-list | editor, admin | 19, 75-77 | projects-list-desktop | mismatch (F-002, F-012) |
| project-page | admin | 82-84, 208, 209 | project-page-desktop/phone | mismatch (F-002, F-003, F-004) |
| project-editor | admin | 78-81 | project-editor-desktop | matched |
| iteration-editor | editor | 71, 88-90 | iteration-editor-desktop | matched (phone: F-005) |
| iteration-tasks | viewer | 106 | iteration-tasks-desktop | mismatch (F-011) |
| iteration-statistics | viewer | 109-111 | iteration-statistics-desktop/phone | mismatch (F-008, F-013) |
| iteration-accuracy | viewer | 113 | iteration-accuracy-desktop | matched |
| iteration-board | viewer | 114 | iteration-board-desktop/phone | matched (phone a11y: F-006) |
| story-page | editor | 126-132, 212 | story-page-desktop | mismatch (F-003) |
| people-list | editor | 37, 39 | people-list-desktop | mismatch (F-002) |
| person-timesheet | editor | 162, 163 | person-timesheet-desktop | mismatch (F-013) |
| search-results | editor | 178, 179, 181-183 | search-results-desktop | matched |
| history | editor | 186 | history-desktop | mismatch (F-003) |
| story-editor | editor | 121-123, 125 | story-editor-desktop | matched |
| task-page | editor | 140-147, 185 | task-page-desktop, task-delete-dialog-desktop | mismatch (F-003) |
| time-editor | editor | 100, 149-161 | time-editor-desktop/phone | matched |
| person-page | editor | 40-42, 188 | person-page-desktop | matched |
| person-editor | system administrator | 33, 34, 43-48 | person-editor-desktop | matched (record: F-009) |
| aggregate-timesheet | editor | 165, 166 | aggregate-timesheet-desktop | matched |
| note-editor | editor | 169, 170, 173, 174 | note-editor-desktop | mismatch (F-004) |
| error-page | editor | 56, 57 | error-page-desktop | matched |
| system-info | system administrator | 55 | system-info-desktop | mismatch (F-004) |
| (resource) ui-kit | - | - | ui-kit.html/png | 21 sections; F-009 (missing preview states) |

**Row determinations** (`evidence/coverage-check.json`): of 145 applicable rows, D 59, P 36, N 2, NV 29, M 19. The M rows are 24, 26 (F-001), 97, 103, 129-132, 141, 144-147, 208-210, 212 (F-003), and 173, 174 (F-004). Rows with a gap in their journey but a drawn surface (55, 169, 186) are D, with the gap recorded in F-003/F-004.

**Journey walk (desktop):** sign-in → projects list (Top) → project page → iteration Stories tab → story page → task page → task editor (Save/Reset/Cancel back to the task page) and time editor (back to the task page) traverse with consistent breadcrumbs and context (Project 1 / Iteration 3 / Story 2 / Task 8). People → person page → person editor and timesheet traverse. Projects list → aggregate timesheet traverses. Search → results → object page traverses. Close iteration → continue dialog traverses. Start iteration dialog traverses. Dead ends are listed in F-003 and F-004. Story/task data are consistent across exports, except F-011.

**Phone fit:** dialog-phone, signin-phone, project-page-phone and iteration-board-phone are 780 px PNGs (390 CSS px at 2x). form-phone (454×1600), list-phone (611×1600), iteration-statistics-phone (208×1600) and time-editor-phone (240×1600) are proportional downscales of 390 px captures; their HTML sets the 390 px width (`max-w-[390px]`, `w-[390px]`) or `width=device-width`. No phone export shows page-level horizontal scrolling. Wide tables scroll inside their own container (`list-phone.html` `aria-label="Stories data table" tabindex="0"`, `project-page-phone`).

<a id="read-findings"></a>

## Findings

<a id="read-f-001"></a>

### F-001 - Role states are not represented; UI-visible role gating moved to non-visual

- Severity: high (never cosmetic: incorrect roles / missing required state)
- Comparison check IDs: C-009, C-035
- **Checklist link:** CHK-002 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md), SHA-256 `8a15e08c…a90b`)
- **Checklist discrepancy:** CHK-002 requires UI-only gating to be recorded separately from server-side enforcement. The record merges both into non-visual rows 24 and 26 ("per-screen visibility of actions is a role variation decided with the SDD permission matrix"), so the visible role variation is recorded nowhere.
- **Required recheck:** CHK-002 over every screen whose actions depend on permission.
- Expected and source: methodology Stage 6 "every screen for every role that can see it, as role states unless the interface differs materially"; Stage 7 "declared roles … present … navigation respects roles"; rows 24 and 26 (actions and links are shown only with the permission); D-001 (no automatic hierarchy, "no extension of rights by default"); Stage 5 decision (UF-002: viewer, editor, admin, system administrator).
- Observed difference: every export shows one role view (manifest note 2, item 1, confirms it). The viewer role is declared only on four read-only iteration tabs. No viewer state exists for iteration-page, where removing the selection column, order inputs, Move/Save order/Close/Create and Edit/Delete changes the composition materially. The same holds for story-page, task-page (Complete/Edit/Enter time/Move/Delete), project-page, projects-list, people-list and person-page (Time/Edit links, row 41). No admin or system-administrator variant is shown where it adds actions (for example System administrator on person-editor versus project-role-only editing, row 33). Rows 24 and 26 are classified `non-visual`, yet their expected results are UI-visible ("Create project links and iteration delete buttons are hidden").
- Evidence: `screen-manifest.json` `screens[].roles`; `screen-normalization.json` rows 24 and 26; `screen-manifest.json#/non_visual_workbook_rows` rows 24 and 26; manifest `_notes[2]`.
- Requirement impact: rows 24, 26, 27, 33, 34, 41, 42, 76, 82, 91 and every permission-dependent action.
- Required action: declare the roles per screen. Represent role-dependent action sets as role states (drawn where the composition changes, at least for a read-only viewer of the iteration page and the task page). Reclassify the UI-visible part of rows 24 and 26 with their elements. Keep server enforcement non-visual.
- Correction impact: all screens with permission-dependent actions, the manifest roles/states, the normalization of rows 24 and 26, and the catalogue navigation-availability rule. F-002 is the same mechanism.
- Return stage: 6

<a id="read-f-002"></a>

### F-002 - Drawn role views show actions the map denies to that declared role

- Severity: medium (never cosmetic: incorrect roles / security representation)
- Comparison check IDs: C-010, C-013, C-014, C-022
- **Checklist link:** CHK-002
- **Checklist discrepancy:** the declared role is shown with UI gating that contradicts the recorded permission conditions.
- **Required recheck:** CHK-002 on each listed screen after the role states are defined.
- Expected and source: row 24 ("editors may not create projects, create people or delete iterations; admins may not create projects"); rows 26 and 82 (project delete requires `sysadmin.delete`); row 91 (iteration delete link not shown to editors); row 76 (Hidden column only with hide permission); D-001 "no extension of rights by default".
- Observed difference: `list-desktop.png` / `iteration-start-dialog-desktop.png` (iteration-page, role `editor`) show **Delete iteration**. `projects-list-desktop.png` (roles `editor,admin`) shows **Create project** and the **Hidden** column. `people-list-desktop.png` (role `editor`) shows **Create person**. `project-page-desktop.png` / `project-page-phone.png` (role `admin`) show **Delete project**.
- Evidence: manifest `roles` of iteration-page, projects-list, people-list and project-page; the cited PNG buttons.
- Requirement impact: rows 24, 26, 76, 82, 91.
- Required action: correct the declared role of each view, or show the actions only in the role states that hold the permission (system administrator for project create/delete and person create unless an owner decision changes the matrix). Do not extend rights in wireframes ahead of the SDD matrix.
- Correction impact: the same four screens and their phone variants; F-001.
- Return stage: 6

<a id="read-f-003"></a>

### F-003 - Required dialogs, menus and states are neither drawn nor covered by a verified pattern

- Severity: medium (never cosmetic: missing required dialog/state/action)
- Comparison check IDs: C-010, C-014, C-021, C-025, C-027, C-036
- **Checklist link:** CHK-005 for rows 131, 132, 146 and 147 (validation states of the move/continue forms); otherwise none (new finding)
- **Checklist discrepancy:** the validation states of the move/continue forms have no drawn form to sit on.
- **Required recheck:** CHK-005 on the move/continue forms once drawn.
- Expected and source: methodology Stage 6 ("dialogs, wizard steps, and the transitions"; separate state when the composition or available actions change); README Rules ("Coverage includes every … dialog"). Rows: 97 (move page with target iteration select), 129-132 (story Move/Continue page with target iteration, validation), 141 (Reopen Task on a completed task), 144-147 (task Move/Continue with target story, validation), 103 (continue page shows "No Future Iteration Available." with no select), 186 (project container history view with type and name), 208-210 and 212 (export menu with the permitted formats per object type).
- Observed difference: only the triggers exist. "Move selected stories" (`list-desktop.html`), "Move or continue" (`story-page-desktop.html`, `task-page-desktop.html`) and "Export" (`list-desktop`, `project-page-*`, `story-page`, `task-page`). No export draws the move/continue dialog (target select plus Move/Continue choice), the move-stories target dialog, the format menu, the completed-task state with Reopen, the no-future-iteration dialog state or the container history. A grep finds no "Reopen", "PDF", "XML", "same iteration" or "No future" text in any export. `story-page` and `task-page` declare `field.select`, but it is absent from their HTML. The drawn patterns (confirm dialog, select-in-dialog) do not show the two-command Move/Continue choice or a format list.
- Evidence: `evidence/coverage-check.json` rows marked M (97, 103, 129-132, 141, 144-147, 208-210, 212); C-043 variant scan.
- Requirement impact: rows listed above; D-012, D-015, D-016, D-019, D-021.
- Required action: draw (desktop at least, and phone where the pattern differs) the story and task move/continue dialog with its validation states, the move-selected-stories dialog, the export menu per object type with only the kept formats, the completed-task state with Reopen, the no-future-iteration continue state and the project container history (or record an owner decision that removes it). Update the manifest states and overlays.
- Correction impact: iteration-page, story-page, task-page, project-page, history; the catalogue (`field.select` in dialogs, a menu variant if needed).
- Return stage: 6

<a id="read-f-004"></a>

### F-004 - Journey dead ends: system information, note display/edit/delete

- Severity: medium (never cosmetic: broken navigation / missing flow)
- Comparison check IDs: C-014, C-032, C-034, C-036
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: row 55 (system information page reached from a link; D-005 limits it to system administrators). Row 169 (after save the note appears in the Notes section of the project, iteration, story or task page). Row 173 (an authorized user can edit a note). Row 174 (delete a note after confirming "Do you want to delete note <subject>"). Prototyping README "show permitted entry points, destinations".
- Observed difference: no export has a system-information link (author open item 3). The catalogue `nav.top-bar` says "Nothing else", so the drawn page is unreachable. No object page (`project-page`, `list-desktop`, `story-page`, `task-page`) shows a Notes section, so existing notes cannot be seen or opened for edit. `note-editor-desktop.png` shows only add mode, with Save/Reset/Cancel and no Delete. Its declared `button.danger` and `dialog.confirm` are absent from the HTML.
- Evidence: top bar of all 36 exports that carry it; `note-editor-desktop.html`; C-043 scan.
- Requirement impact: rows 55, 169, 173, 174.
- Required action: draw the system-administrator entry point (a role state of the shared frame) and record it in the manifest navigation. Draw the Notes section on object pages with edit and delete entries, the note editor in edit mode (author kept, row 173) and the delete-note confirmation.
- Correction impact: shared top bar or footer, all four object pages, note-editor, catalogue `nav.top-bar` rule.
- Return stage: 6

<a id="read-f-005"></a>

### F-005 - Phone channel coverage incomplete; phone iteration page drops actions

- Severity: medium (never cosmetic: missing required action/state in an agreed channel)
- Comparison check IDs: C-010, C-041
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: Stage 5 decision "Phones and narrow windows: the same application and URLs, reflowed"; methodology "desktop and mobile variants when the Stage 5 decision includes both"; prototyping README "Verify exports at actual agreed viewport widths … navigation, tables, actions".
- Observed difference: (a) `list-phone.html` (the only phone view of iteration-page) omits Edit iteration, Delete iteration, Start iteration, Export, History and Add note, which the desktop view has. Its select header has a screen-reader-only "Select All" and no control (the desktop has one; the catalogue `checkbox` says "the header checkbox selects all rows"). (b) Manifest note 7 marks the phone date picker, the select inside a phone dialog and the phone empty state as "NOT verified". No export shows them. (c) 17 of 25 screens have no phone export. Patterns cover simple forms, lists and detail pages. They do not cover the iteration-editor date fields, the continue dialog select, the grouped task table, the person-editor role table, the aggregate people checkbox group or the five-button task-page header. The partially visible "Rer…" column in `list-phone.png` is the intended contained scroll, not a defect.
- Evidence: `list-phone.png`; manifest `_notes[2]` item 4 and `_notes[7]`.
- Requirement impact: rows 71, 88, 89, 91, 92, 98, 102, 106, 210 and the phone channel generally.
- Required action: keep every action of the phone iteration page (stacked or in an overflow), draw a select-all or remove the misleading header text, and add phone evidence for the date field and picker, a select in a dialog and an empty state. State which remaining surfaces each verified pattern covers.
- Correction impact: list-phone; new phone exports for iteration-editor, continue dialog and an empty state.
- Return stage: 6

<a id="read-f-006"></a>

### F-006 - Mandatory accessibility baseline not represented in the exports

- Severity: medium (not cosmetic: keyboard/zoom operability and programmatic state)
- Comparison check IDs: C-049
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: Stage 5 decision Accessibility (mandatory WCAG 2.2 AA: "skip to content" link; 200% text and 400% zoom; 320 px reflow; full keyboard); catalogue `nav.top-bar` ("A 'skip to content' link is its first focus stop"), `nav.breadcrumb` (`aria-current`), `table.data` ("Column headers are buttons with `aria-sort`"), `nav.tabs`, `checkbox`; field rule "required marked in text".
- Observed difference: (1) no skip link in any of the 36 exports that carry the top bar (incl. the ui-kit specimen). (2) `form-phone.html` and `iteration-board-phone.html` set `maximum-scale=1.0, user-scalable=no` (zoom blocked). `iteration-board-phone.html` and `iteration-statistics-phone.html` fix `width=390`, so 320 px reflow is not represented. (3) `iteration-start-dialog-desktop.html` draws "Close started iterations" as a `div` with an `svg` tick and no checkbox semantics. (4) `list-phone.html` uses `role="tab"` links with no selected state (`aria-selected`/`aria-current`). (5) the breadcrumb current item lacks `aria-current` in 13 exports (aggregate-timesheet, form-desktop, iteration-accuracy/board/statistics/tasks desktop, iteration-editor, people-list, person-timesheet, story-page, and the three desktop dialog backgrounds). (6) sortable headers are plain text with no button or `aria-sort` in list-desktop, people-list and project-page. (7) `time-editor-phone.html` marks the required Person only with "*".
- Evidence: `evidence/export-scan.json`; the viewport meta of the cited files.
- Requirement impact: Stage 5 accessibility baseline; rows 99, 185, 37, 83, 92.
- Required action: add the skip link to the shared frame, remove zoom blocking and fixed viewport widths, use real checkbox and tab semantics, set `aria-current` on breadcrumb current items, make sortable headers operable with `aria-sort`, and mark required fields in text.
- Correction impact: shared frame and all exports using it; catalogue rules unchanged (exports must follow them).
- Return stage: 6

<a id="read-f-007"></a>

### F-007 - Stale and false author claims in the catalogue and normalization notes (PM addendum)

- Severity: low (not cosmetic: unsupported claims in pinned records)
- Comparison check IDs: C-050
- **Checklist link:** CHK-007 (figures match the current artifact after a correction)
- **Checklist discrepancy:** the author revised the exports (UX-006-06..12) without updating these figures and status statements.
- **Required recheck:** CHK-007 over `ui-design-system.md`, the manifest `_notes` and the normalization `_notes`.
- Expected and source: MIGRATION.md Keep Work Focused ("Never invent … unsupported claims"); ui-design-system-guide "The catalogue must describe what the exports actually show".
- Observed difference (pinned file and line in [`analysis/prototyping/`](../prototyping)):
  1. `ui-design-system.md` line 41: "Export set: none; no screen manifest, component sheet or wireframe export exists yet". In fact 78 pinned exports, `ui-kit.html` and a version-4 manifest exist.
  2. Line 70: "rows from `link.text` onwards are added only for the three representative screens … No date field is defined … `button.completion` and `button.danger` are not used by these three screens … no representative screen shows a disabled control". In fact `field.date` is catalogued, completion and danger buttons are drawn, and `people-list-desktop.html` draws disabled Previous/Next.
  3. Line 84 (`table.data`): "Column headers are buttons with `aria-sort`". No export does this (F-006).
  4. Line 88 (`nav.top-bar`): "A 'skip to content' link is its first focus stop". No export has one (F-006).
  5. Line 89 (`nav.breadcrumb`): "list-desktop and form-desktop render grey links (recorded deviation)". Both now render `#0C66E4` links (`list-desktop.html` breadcrumb `text-[#0C66E4]`; `form-desktop.html` `.breadcrumbs a { color: #0C66E4 }`).
  6. Line 114: "No rendered UI exists, so actual rendered values are not checked".
  7. Line 115: "No component sheet; `button.completion` and `button.danger` are not used …".
  8. Line 116: "no screen ID, screen export or HTML could be obtained … nothing is exported to `wireframes/`".
  9. Line 117: "Date field waits for the iteration editor (rows 71, 88, 89)" (`field.date` exists at line 82). Line 118: "12 Stage 6 draft extension tokens … Danger hover not added (no danger button is drawn)". `ui-design-tokens.json` has 13 extensions (incl. `size.avatar`), and danger buttons are drawn on 7 exports.
  10. `screen-normalization.json` `_notes[4]`: "Only the three representative screens of UX-006-01 are drawn … every other screen … is planned but not drawn". 25 screens are drawn.
- Evidence: line numbers from a numbered read of `ui-design-system.md` at `23e96eb` (`grep -n`); the exports cited.
- Requirement impact: record integrity of the Stage 8 package. The owner would approve a catalogue whose status text contradicts the exports.
- Required action: update these statements to the actual state. Re-run CHK-007.
- Correction impact: catalogue Coverage And Open Decisions, Components notes, normalization `_notes[4]`. The normalization evidence hash changes.
- Return stage: 6

<a id="read-f-008"></a>

### F-008 - Unsupported invented data: burn-down "Target baseline" and issue-key placeholder

- Severity: low (not cosmetic: invented behaviour/data)
- Comparison check IDs: C-018, C-051
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: rows 109, 110 and 112 define a burn-down and a progress chart from stored samples. No row defines an ideal or target line. Row 182: search by numeric ID. Stage 5 decision "Not covered: … any invented text … issue keys".
- Observed difference: `iteration-statistics-desktop.html` and `-phone.html` burn-down legend "Target baseline (100h → 0h)" with a dashed ideal series. The `list-desktop.html` search placeholder "e.g. PLN-102" suggests an issue-key format that does not exist (IDs are numeric: 101-105, 1-20).
- Evidence: `iteration-statistics-desktop.html` (outline line 208), `list-desktop.png` top bar.
- Requirement impact: rows 109, 112, 182.
- Required action: remove the target series (or obtain an owner decision and a target-only record), and use a numeric-ID example or no placeholder.
- Correction impact: both statistics exports; the `chart.line` catalogue entry if it mentions the series.
- Return stage: 6

<a id="read-f-009"></a>

### F-009 - Manifest and catalogue record gaps

- Severity: low (not cosmetic: record completeness)
- Comparison check IDs: C-009, C-043, C-055
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: methodology Stage 6 (non-visual `covered_by` names "the screen that sets it off where one exists"; manifest maps screen → actions → navigation); ui-design-system-guide ("No required control may be left to visual guessing"; each screen declares the variants it uses).
- Observed difference: (a) `initiating_screen` is null for all 31 non-visual rows, including 27 (projects-list), 138 (task-editor save), 164 (person-timesheet), 167 (aggregate-timesheet), 180 and 184 (search-results). (b) person-editor and note-editor `actions` omit `reset`, though both exports draw Reset (manifest note 5 says Reset is on every editor). (c) `navigation` is empty for person-editor, note-editor, aggregate-timesheet, error-page and system-info. (d) Declared variants without evidence: iteration-page `message.error-summary`, story-page and task-page `field.select`, note-editor `button.danger` and `dialog.confirm`. (e) Catalogue states without a preview in `ui-kit.html`: `button.danger` hover (no token, exports use two values), `table.data` scrolled, `nav.top-bar` focus.
- Evidence: `screen-manifest.json` `screens[]` and `non_visual_workbook_rows`; `ui-kit.png`.
- Requirement impact: traceability for Stages 15-17 (SDD control inventory, `audit:ui-parity`).
- Required action: complete these fields and previews, and add a danger-hover extension token.
- Correction impact: manifest, catalogue, `ui-kit.html`, tokens (extension only; foundation unchanged).
- Return stage: 6

<a id="read-cosmetic-findings"></a>

## Cosmetic Findings

These findings are Low and purely visual under the README rules: none is a missing flow, invented behaviour, role or security issue, missing state/action/dialog, broken navigation or unusable clipping. They do not close the stage by themselves, because F-001..F-009 are not cosmetic.

| ID | Severity | Observation and evidence | Required action | Return stage |
|---|---|---|---|---|
| F-010 | low, cosmetic | Rendered values differ from the foundation. `note-editor`, `person-editor` and `time-editor-desktop` (ZIP 7) render with the Stitch Material 3 theme: `body` `bg-background` `#F9F9FF`, `text-on-surface` `#0E1C2F`, `border-outline` `#727786`, Inter loaded from Google Fonts (foundation: OS font stack, no font files). `person-editor` Save uses `bg-primary` `#004FB6` instead of `#0C66E4`. Complete task uses `#086D39` (token `#1F7A45`) on task-page and task-delete-dialog. Danger hover has no token and appears as `#AE2A19` and `#B02A20`. List row hover `#DCE9FC`; form-phone hovers `#0052CC`/`#EBEEF2`; statistics-phone series `#1F883D`/`#5E6C84`/`#E1E4EA`; signin-phone alert tint `#FEEBEA`. Material Symbols is loaded by 18 exports and its glyphs render on projects-list, note-editor and time-editor-phone (foundation icon set: Lucide). | Bind these exports to the tokens and the foundation font and icon set; add extension tokens where a new value is needed | 6 |
| F-011 | low, cosmetic | `iteration-tasks-desktop.png` Story 5 group row original estimate 23.0. Its tasks (10, 11, 12, 20) sum to 22.0, and list-desktop, iteration-print and iteration-accuracy show 22.0 (author deviation "Story 5 23.0 vs 22.0") | Correct the sample figure | 6 |
| F-012 | low, cosmetic | `projects-list-desktop.png` shows a breadcrumb "Top" on the root page (README: "Do not … add a breadcrumb to the root") | Remove the root breadcrumb | 6 |
| F-013 | low, cosmetic | Chart rendering is inconsistent. Desktop statistics draw filled pies, while statistics-phone and `ui-kit#chart-pie` draw rings. The `person-timesheet-desktop.png` "By story" chart renders as a square, not a pie. Legends carry every value in text, so no information is lost | Render `chart.pie` one way everywhere and fix the square rendering | 6 |
| F-014 | low, cosmetic | Shared frame and styles differ between sibling pages. Left inset is 40 px (Stories), 30 px (Tasks, Statistics, Board) and 80 px (Accuracy). Unselected tab text is secondary on some tabs and main text on Accuracy/Board. Field labels are bold only on story-editor. iteration-board-phone renders the Me/Sign out links in text colour. statistics-phone uses an uppercase summary style not used elsewhere | Align with the shared frame and the catalogue `nav.tabs` and `field.*` rules | 6 |

<a id="read-author-open-items-and-deviations-assessed"></a>

## Author Open Items And Deviations Assessed

| Author item (manifest `_notes`) | Independent assessment | Classification |
|---|---|---|
| (1) Role-dependent differences not drawn | A real coverage defect; also, the drawn views contradict row 24 | F-001 (high), F-002 (medium), not cosmetic |
| (2) Me page of the signed-in person not drawn (row 188 claimed P) | Same surface and composition as the drawn person-page; the Me link is drawn in every top bar | Accepted; no finding |
| (3) System-info entry point not drawn | The drawn page cannot be reached | F-004 (medium), not cosmetic |
| (4) Phone controls not verified (date picker, select in dialog, empty state) | No phone evidence exists; the phone iteration page also drops actions | F-005 (medium), not cosmetic |
| list-phone has no operable select-all | The map does not require select-all (row 97 works with per-row boxes). However, the catalogue rule and the screen-reader header text announce one that does not exist | Part of F-005/F-006, not cosmetic |
| list-phone cut column | The intended contained horizontal scroll (focusable, labelled container) | Accepted; no finding |
| Start-dialog checkbox drawn as a div | The control has no checkbox semantics and is not keyboard-operable as drawn | F-006, not cosmetic |
| Story 5 23.0 vs 22.0 | Sample-data inconsistency only | F-011, Low cosmetic |
| Burn-down "Target baseline" | A data series that no approved row supports | F-008, Low non-cosmetic (invented data) |
| projects-list root breadcrumb | Extra presentation only; navigation works | F-012, Low cosmetic |
| Phone tab buttons | `role="tab"` links without a selected state; semantics, not appearance | F-006, not cosmetic |
| Dead in-page anchors (note 9) | Placeholder `href="#"` links in static wireframes; destinations are recorded in the manifest navigation. Not a prototype defect, beyond the gaps in F-004/F-009 | No separate finding |

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Prototype audit | `npm run audit:prototype` in `C:/Work/Legacy/xp-qa7/analysis/tools` | pass. Output: "WARN: ui-ux-approval.md is not present; rerun with --require-approval before Stage 8 closes" / "25 screens; 78 pinned exports" / "PROTOTYPE AUDIT OK", exit 0 | console output in this session |
| Governed rows digest | `node analysis/tools/prototype-audit.js --governed-rows-digest` | pass: `87636a53…0b861`, 210 of 210 rows | console output |
| Foundation digest | `node analysis/tools/ui-design-system.js analysis/prototyping/ui-design-tokens.json` | pass: `97e04be7…907b` | console output |
| Export hashes | Node SHA-256 over all manifest entries and a directory comparison | pass: 80/80, 78 files both ways | `evidence/hash-verification.json` |
| Row coverage | Manual per-row determination over 145 applicable rows | 19 M rows | `evidence/coverage-check.json` |
| Visual and structural review | All 39 PNG viewed; all 39 HTML outlined and scanned | see Comparison Results | `evidence/export-scan.json`, `evidence/non-token-colors.json` |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-057 | No wizard (multi-step flow) exists in any applicable row or decision | Scope evidence: the 145 applicable rows and D-001..D-025 | `evidence/coverage-check.json` |

- Blocker: none
- Exact unchecked scope: none required.
- Non-required limitations, stated so they are not mistaken for checks:
  - The HTML exports were not rendered live in a browser, because they load Tailwind and fonts from public CDNs and the packet allows no network calls. Visual fit was judged from the exported PNG captures together with the HTML width and viewport rules.
  - `iteration-statistics-phone.png` (208 px wide) and `time-editor-phone.png` (240 px wide) are downscaled, so fine detail was read from their HTML.
  - Interactive behaviour (hover, focus order, Escape, focus return) cannot be exercised on static exports; Stage 17 verifies it on the implementation.
  - The author's per-row D/P claim file and provenance files are outside the pinned tree. The screen IDs of the ZIP 7 time, note and person editors are declared "not verified" by the author (PM addendum). The ZIP hash and folder-name provenance is recorded in manifest note 3. No row determination depends on them.
- Required prerequisite: none.
- Reassignment/closure reference: not applicable.

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-014 | this report and `evidence/` | pending | pending | pending (next fresh Stage 7 pass) |

Operational disclosures:

- Two read commands (`cat` of the review template and of `ui-design-system.md`) produced output above the console limit, and the client saved it to spill files. I did not open the spill files and re-read the same files in bounded line ranges. Nothing was written to either repository by these commands.
- The PM addendum (currency of author claims; ZIP 7 provenance) arrived during the review and was applied within the same pinned scope (F-007, Blocked Scope limitations).
- CHK-009 / constitution A3 credential check: this review read no credential source, and my evidence contains no credential value. A search of the report and evidence for the legacy factory login pair is not possible without reading its source, which is forbidden. Credential-value hit count over the new evidence for known values: 0. The only password-related text is the field labels "Password", "New password" and "Confirm password" from the exports.

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-001 and F-002 → CHK-002 (UI gating and server enforcement merged; role views contradict permission conditions); F-007 → CHK-007 (stale figures and status after revisions); F-003 → CHK-005 (move/continue validation states without a drawn form). Required rechecks are listed in each finding.

Result `findings`. Coverage Summary: 57 checks, 30 matched, 26 mismatch, 0 not checked, 1 not applicable. Unresolved blocked scope is zero. Findings: F-001 high; F-002..F-006 medium; F-007..F-009 low and not cosmetic; F-010..F-014 low and cosmetic. The Stage 7 Low-cosmetic closing exception does not apply: findings above Low exist, and several belong to never-cosmetic classes (incorrect roles, missing dialog/state, broken navigation). No backlog is created by this pass.

The process returns to **Stage 6** for F-001..F-014 under the [return and correction protocol](README.md#return-and-correction-protocol). No finding needs a deliberate channel or design-system change (Stage 5): F-010 asks the exports to follow the unchanged foundation. No finding exposes a parity-map defect (Stage 1): rows 24 and 26 are correct in the map, and only their normalization is wrong. The next gate is a new Stage 7 pass by another eligible fresh reviewer on the corrected export set version. Stage 8 cannot close on this export set.

<a id="read-error-prevention"></a>

## Error Prevention

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) SHA-256 `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b` (last commit `ec5e065`)
- Author self-check record/version: no Stage 6 self-check found in the pinned artifacts. `migration_status.yaml` `control.prevention_self_check` holds only a Stage 2 carryover note; the catalogue, manifest and normalization contain no CHK record. The author may have recorded one outside the pinned tree, and absence here is not proof that the checklist was not read.

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-002; applies to role and permission claims in the prototype record | not recorded | failed: UI gating of rows 24 and 26 merged into server-side non-visual coverage; role views contradict row 24 (C-009, C-035, C-013, C-014, C-022) | F-001, F-002; recheck CHK-002 per screen |
| CHK-005; applies to the validation states represented by forms | not recorded | partly failed: field validation is covered by the drawn error pattern; the move/continue validations (rows 131, 132, 146, 147) have no drawn form (C-021, C-027) | F-003; recheck once drawn |
| CHK-006; applies to delete confirmations | not recorded | passed for the drawn pattern: `task-delete-dialog-desktop` names the time-entry effect. Other delete dialogs follow the same pattern and must name their cascades (D-011) | none |
| CHK-007; applies to revised status figures in the catalogue and notes | not recorded | failed: 10 stale or false statements (C-050) | F-007; recheck the three files |
| CHK-009; applies to evidence written by this review | not recorded (author) | passed for this report (Interaction Log) | none |
| CHK-001, CHK-003, CHK-004, CHK-008, CHK-010, CHK-011, CHK-012 | - | not applicable: no legacy-source line, side-effect, locale, query, link-parameter, unauthenticated-surface or request-sink claim is made or reviewed at Stage 7 | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 7 pass 001, this report version. Checklist `8a15e08c…a90b`. CHK-009 passed for my evidence. CHK-007 was applied to my own figures: counts (57/30/26/0/1; D 59, P 36, N 2, NV 29, M 19; 80 hashes; 21 variants) come from script output in this session. Cited line numbers of `ui-design-system.md` come from a numbered read of that file alone (CHK-001 practice). No other check applies to reviewer output.
- **Learning update (proposals for the coordinator; not edits to the table):**
  1. A new check: "Role-gated UI is drawn per role". For any screen whose actions depend on permission, the prototype record declares every role that can see it and represents the role-dependent action set as a role state. Rows describing hidden links or buttons are never classified non-visual. This generalizes F-001/F-002. Check for overlap with CHK-002 first; it may be a refinement of CHK-002 for UI artifacts.
  2. A refinement of CHK-007: after any export import or revision, re-read every status statement in the catalogue Coverage table and in the normalization and manifest notes, and compare it with the files on disk (F-007).
  3. A possible new check: "Every drawn trigger has a drawn destination". A button or link that opens a dialog, menu or page needs that dialog, menu or page in an export or a named, verified pattern with the same composition (F-003, F-004).

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: dependency graph review belongs to Stages 10 and 16. This Stage 7 pass reviews the prototype record only.

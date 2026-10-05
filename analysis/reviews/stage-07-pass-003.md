# Stage 07 Review - Pass 003

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
> Export set `stage-06-draft-14-ux-006-14` at `48ffd0e`: `audit:prototype` passes and all 120 pinned hashes match. 48 checks: 38 matched, 9 mismatch, 0 not checked, 1 not applicable. Pass-002 F-001, F-003, F-004 and F-005 are resolved. F-006 is largely resolved. F-002 is only partly resolved. There are 7 findings: 1 Medium, 3 Low and not cosmetic, 3 Low and cosmetic. F-001: the project-admin view of the person editor still draws the "Deactivated" control. Row 48 ties that control to the same hide permission that option C makes conditional, and the person editor records no condition for it. The Low-cosmetic closing exception does not apply.
>
> **Derived views:** all 52 derived views come from the bytes that pass 002 reviewed, and each one differs only by the edits it declares. 48 of them re-render offline to the same pixels as their pinned PNG; 2 of these differ only by timing or sub-pixel noise. 4 views load an unversioned script from a CDN, so their PNG cannot be reproduced from the pinned HTML (F-004).
>
> **F-002 option C:** it is an adequate mechanism and it resolves the contradiction between the projects list and the project editor without assigning rights. It was not applied to row 48, which uses the same permission. So F-002 stays open as pass-003 F-001.
>
> **Waiver:** the content of `waiver:legacy_walkthrough_fallback:xplanner2-revision1` was verified (10 of 10 content checks match). This pass is not `clean`, so it does not verify the waiver for Stage 7 closure.
>
> **Checklist issues:** F-001 links to CHK-002. F-002 links to CHK-007 (third occurrence). The other findings link to no existing check.
>
> **Unchecked scope:** none required. The non-required limitations are listed in [Blocked Scope](#read-blocked-scope).
>
> **Next:** Stage 6 corrects F-001..F-007 under the return protocol. Then another eligible fresh reviewer runs a Stage 7 pass on the new export set version.
>
> **Details:** [Comparison Results](#read-comparison-results) / [Pass-002 Resolution](#read-pass-002-resolution) / [Derived-View Verification](#read-derived-view-verification) / [F-002 Option C Verdict](#read-f-002-option-c-verdict) / [Findings](#read-findings) / [Waiver Verification](#read-waiver-verification) / [Open Visual Remainders](#read-open-visual-remainders) / [Conclusion and Next Gate](#read-conclusion-and-next-gate).

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
- [Pass-002 Resolution](#read-pass-002-resolution)
- [Derived-View Verification](#read-derived-view-verification)
- [F-002 Option C Verdict](#read-f-002-option-c-verdict)
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

- Date: 2026-10-05. The review started at `2026-10-05T12:30:23Z` and the report was written from `2026-10-05T12:50:38Z` (UTC, from code).
- Stage: 07
- Pass: 003
- Scope: xplanner2-revision1
- Scope boundary: export set `stage-06-draft-14-ux-006-14`. That is [`analysis/prototyping/screen-manifest.json`](../prototyping/screen-manifest.json) with its notes (provenance and open visual remainders), `screen-normalization.json` (including `excluded_rows` and `deferred_rows`), `wireframes/**` (59 HTML and 59 PNG), `ui-design-system.md`, `ui-design-tokens.json` and `ui-ux-decision.md`. They are compared with the parity map, the Stage 4 and Stage 5 decisions and the pass-002 findings. The waiver is verified too.
- Reviewed revision: `48ffd0e362daddd228ee8b5509da1fb012b3c4e6` (main after PR #54), detached worktree `C:/Work/Legacy/xp-qa7c`. `git status --porcelain` showed 0 lines before the review, after the audits and renders, and after the evidence was written.
- Base revision: `8a610c307aa56461fcb9055fb1b8704cb90c1a88`, the revision pass 002 reviewed. It is used for the delta and for the source identity of the derived views.
- Reviewer product: Claude Code (Claude Opus model family), subagent
- Reviewer ID: `claude-code-qa-s07-p003`
- Session ID: a2e662a41697e0e90
- Authored artifacts in reviewed scope: none
- Independence record: this report ([Independence Declaration](#read-independence-declaration))
- Waiver IDs reviewed: `waiver:legacy_walkthrough_fallback:xplanner2-revision1`. Its content is verified. It is not verified for Stage 7 closure, because this pass is `findings` ([Waiver Verification](#read-waiver-verification)).
- Orchestration packet: `S07-P003` (a direct role packet from PM; no packet digest was supplied)
- Result: findings
- Artifact set version: `stage-06-draft-14-ux-006-14` (export set version)
- Artifact manifest SHA-256: `e52d85f7707360a4a8e3db0b2ce4009c851a4079d2275f583a0684940aaabce0`
- Verification mode: expanded. Every changed view and its direct dependencies were checked, and every Stage 7 expectation was checked across the current set. Unchanged results from pass 002 that this pass relies on are listed in [Comparison Scope](#read-comparison-scope).
- Control mode: not applicable (Stage 2 only)
- Verification baseline: `48ffd0e`, the manifest hash above
- Expansion trigger: nearly every export changed. 52 HTML files were edited and every PNG was re-rendered. So the visual checks were applied to all 59 views, not only to the corrected ones.

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] I followed the access boundary of my declared control mode. Stage 7 has no blind phase. I read only the inputs the packet permits.

Eligibility evidence:

- ACK of `.agents/skills/migration-qa/SKILL.md`. SHA-256 computed in the pinned tree: `bc79b222d5299300b542ad04b7ccc566500cc8a60a58ed9ae3b2dba48bfb82f3`. It equals the packet value.
- `git -C C:/Work/Legacy/xp-qa7c rev-parse HEAD` returned `48ffd0e362daddd228ee8b5509da1fb012b3c4e6`. The status was clean before and after the review.
- This session started fresh with no prior context. It did not author any Stage 5 or Stage 6 artifact, and it did not perform pass 001 or pass 002. It wrote nothing in either repository except the files under `.migration-tmp/stage-07/p003/` of the main repository. Helper scripts, local renders and a temporary Chrome profile stay in the session scratchpad.
- **Disclosure for PM and owner judgement:** this subagent was launched by PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, and the scratchpad path carries that ID. The Stage 5/6 records name the same PM session as the launcher of the UX authoring subagents (`ui-design-system.md` "Created by"). This context contains none of that authoring and no chat history from it. Passes 001 and 002 made the same disclosure.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

All inputs were read in the pinned tree `C:/Work/Legacy/xp-qa7c` at `48ffd0e`.

| Input | Identity |
|---|---|
| [`analysis/prototyping/screen-manifest.json`](../prototyping/screen-manifest.json) | SHA-256 `e52d85f7…aaa0` (= packet); `schema_version` 4; 25 screens; 29 non-visual rows (identical to pass 002); 12 `_notes` |
| [`analysis/prototyping/screen-normalization.json`](../prototyping/screen-normalization.json) | file `593d689a…19b7`; evidence hash recomputed `81be7ba8…aa04` = manifest `normalization_sha256`; 145 rows, 34 excluded, 31 deferred. Since `8a610c3` only the notes of rows 76, 97, 102, 110 and 208 and `_notes[4]`/`[5]` changed |
| `analysis/prototyping/wireframes/**` | 118 files (59 HTML, 59 PNG), all pinned. 52 views are derived (edited locally) and 7 are unchanged Stitch API exports. One view is new: `projects-list-hide-desktop` |
| [`analysis/prototyping/ui-design-system.md`](../prototyping/ui-design-system.md) | `60343813…bf64` (pinned) |
| [`analysis/prototyping/ui-design-tokens.json`](../prototyping/ui-design-tokens.json) | `36f3b7a2…555e` (pinned; unchanged since pass 002); foundation digest `97e04be7…907b` |
| [`analysis/prototyping/ui-ux-decision.md`](../prototyping/ui-ux-decision.md) | file `89b3d88d…6931` (unchanged); `UI foundation SHA-256: 97e04be7…907b` = packet foundation value |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | `e1478edd…64a6` (unchanged); sheet "User Flows", header row 6; read with `@excel.js/exceljs` through `createRequire`, never edited; governed-rows digest `87636a53…b861` (210 of 210) = manifest |
| [`analysis/stages/stage-04/stage-04-requirements-revision.md`](../stages/stage-04/stage-04-requirements-revision.md) | `d6636e86…dbfc` (unchanged); D-001, D-005, D-007, D-011, T-01 and the reconciliation table |
| [`analysis/migration_status.yaml`](../migration_status.yaml) | `3a1639ac…fc4a`; `current_stage: stage-07`; latest entry into Stage 7 at `2026-10-05T12:22:35Z` (this review started after it) |
| [`analysis/stages/stage-03/walkthrough-001-fallback.md`](../stages/stage-03/walkthrough-001-fallback.md), `walkthrough-001.md` | `2d6f4bb1…ce4d`, `b061cd97…239e` (both unchanged) |
| Previous passes | [`stage-07-pass-001.md`](./stage-07-pass-001.md), [`stage-07-pass-002.md`](./stage-07-pass-002.md) and their evidence folders `evidence/S07-P001/`, `evidence/S07-P002/` |
| Governing procedure | `AGENTS.md`; `MIGRATION.md` (Keep Work Focused, Artifact Authorship Contract, Waiver Contract, Stage Gate Matrix); [`analysis/migration_methodology.md`](../migration_methodology.md) (Stop criterion and Stage 7 exception, Stage 7, Minor visual correction deadline contract, Exit criterion for Stage 7); [`analysis/reviews/README.md`](./README.md); the template; [`analysis/prototyping/README.md`](../prototyping/README.md) (including "Navigation And Identity Before Drawing"); [`ui-design-system-guide.md`](../prototyping/ui-design-system-guide.md); [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) (`8a15e08c…a90b`) |

Channels and roles: one responsive web application (desktop, and phone at about 390 CSS px with 320 px reflow), plus the print output. Roles: unauthenticated visitor, viewer, editor, admin and system administrator, and the permission conditions of option C (hide, admin.edit, System information).

Explicit exclusions:

- The live Google Stitch projects and the author's out-of-tree provenance (`exports/…`, `.migration-tmp/stage-06/…`). They are not permitted inputs. Every determination here comes from the pinned files and from Git history inside the pinned repository.
- [`legacy/README.md`](../../legacy/README.md), `.migration-tmp/stage-03/secrets` and client spill files. None was opened (one spill is disclosed in the [Interaction Log](#read-interaction-log)).

<a id="read-method-and-coverage"></a>

## Method and Coverage

1. **Automated gates.** In [`analysis/tools`](../tools) I ran `npm run audit:prototype` and `npm run audit:status`, plus `prototype-audit.js --governed-rows-digest` and `ui-design-system.js` on the tokens.
2. **Hashes.** A Node script recomputed the SHA-256 of all 120 manifest entries (118 wireframe files, the catalogue and the tokens). It compared the directory with the manifest both ways and recomputed the normalization evidence hash. Output: `evidence/hash-verification.json`.
3. **Delta.** `git diff 8a610c3 48ffd0e` over the prototype records gave the change set: 52 HTML files edited, 1 view added, all 52 PNGs of the edited views re-rendered, and 7 API views unchanged. A semantic diff of the manifest (scope, export set, normalization pin, projects-list and project-editor states, projects-list files and variants, time-editor and person-editor variants, task-editor navigation, notes) and of the normalization (the notes listed above) bounded the record changes.
4. **Derived-view provenance.** I parsed the 59 entries of manifest `_notes[3]`. For each of the 52 derived views, I searched the Git history of the pinned repository for the HTML blob whose SHA-256 begins with the declared 8-hex source prefix. Then I diffed that source against the current file and classified each edit. Output: `evidence/derived-view-verification.json`.
5. **Render faithfulness.** I re-rendered all 59 HTML exports locally with the same Chrome build the labels name (154.0.8037.95, headless), driven by Node over the DevTools protocol. Network was blocked (`--host-resolver-rules=MAP * ~NOTFOUND`). The same geometry was used: desktop 1280 CSS px at device scale 1.25, phone 390 CSS px at scale 1 with mobile emulation, full document height. Each render was compared pixel by pixel with the pinned PNG. The 11 phone exports were also measured at 320 CSS px (document scroll width, and elements that overflow outside a scroll container). Output: `evidence/render-comparison.json`. The renders themselves stay in the scratchpad.
6. **Exports.** I viewed every re-rendered PNG with the Read tool, except the 7 unchanged API PNGs (their bytes equal the ones pass 002 viewed; see Comparison Scope). A cheerio scan read every HTML export: title, viewport, skip link, breadcrumb items and `aria-current`, `role=tab`, dialogs, labels and required marking, `aria-sort`, non-token colours, body font size, units, `text-transform`, `min-width`, `overflow-x` on the body, fonts and icons, external resources and authoring markers. Output: `evidence/export-scan.json`.
7. **Catalogue and kit.** I checked declared `ui_variants` against heuristic evidence in each screen's HTML, the 22 catalogue variants against the 25 kit sections, and the `chart.line`/`chart.pie` specimens. Output: `evidence/variant-check.json`.
8. **Map and decisions.** I read workbook rows 24, 26, 27, 33, 34, 43-48, 55, 71, 75-81, 86-90, 109-111 and 113 (requirement, expected result, column J), and Stage 4 D-001, D-005, D-007, D-011 and T-01. I used them to judge option C and the corrected rows.
9. **Journeys and figures.** I walked the map-backed journeys across the current PNGs (planning path, system administrator, people, search, dialogs, notes, export, history, error, Me) and reconciled the figures across statistics, accuracy, tasks, board, story, task, person and timesheet pages.
10. **Pass-002 findings and remainders.** I checked F-001..F-009 and every item of manifest `_notes[10]` against the exports (`evidence/pass002-resolution.json`).
11. **Waiver.** I re-ran the eleven waiver checks of pass 002 against the current status, records and prototype (`evidence/waiver-verification.json`).

No sampling within the changed scope: 59 views, 118 export files, all changed records and all pass-002 findings were checked.

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

- Review mode and exact checked boundary: `expanded`. The delta `8a610c3..48ffd0e` is checked over all prototype records and exports, with all Stage 7 expectations applied across the current 59 views.
- Previous report and pinned baseline: [`stage-07-pass-002.md`](./stage-07-pass-002.md) (export set `stage-06-draft-13-ux-006-13`, manifest `62d28c32…1852`, revision `8a610c3`) and its evidence `evidence/S07-P002/`.
- Changed items and direct dependencies rechecked: all 52 derived views and their sources; the new `projects-list-hide-desktop`; the manifest (scope, notes, projects-list, project-editor, task-editor, time-editor and person-editor entries); the normalization notes; the catalogue; the dependent views of option C (projects-list ×3, project-editor, person-editor ×2, project-page ×3); and the figures that the new charts must agree with.
- Prior results relied on but not rerun (not counted as newly matched below):
  - Pass-002 C-006..C-009 (row accounting; the excluded and deferred rows against Stage 4 and the workbook; the non-visual rows). Their inputs are unchanged: the workbook, the Stage 4 record and `non_visual_workbook_rows` have identical bytes, and the normalization diff touches only notes. The governed-rows digest and the normalization pin were re-verified (C-003, C-004).
  - Pass-002 row-level determinations for the rows outside the changed scope (`evidence/S07-P002/coverage-check.json`: D 76, P 37, N 2, NV 29). The changed rows (76, 81, 109-111, 134/185, 44/89/154/170, 48) were rechecked here.
  - The visual content of the 7 unchanged API views (iteration-print, iteration-viewer, iteration-export-menu, story-move-dialog, task-move-dialog, task-completed, task-viewer), viewed by pass 002. Their HTML was rescanned in this pass (titles, semantics).
- Expansion triggers examined: the bulk re-render of every edited view's PNG, which triggered the full visual re-check. Not required: a new full row-by-row re-determination of unchanged rows, because no row, decision or classification input changed.

<a id="read-comparison-results"></a>

## Comparison Results

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001 / `audit:prototype` | Prints `PROTOTYPE AUDIT OK` (methodology Stage 7) | "25 screens; 118 pinned exports", `PROTOTYPE AUDIT OK`, exit 0. One WARN says `ui-ux-approval.md` is absent, which is expected before Stage 8 | matched | [Gates](#read-automated-and-manual-gates) | none |
| C-002 / export paths and SHA-256 | Every manifest path resolves with a matching hash; no unlisted export; manifest hash = packet | 120 of 120 match; 118 files on disk and 118 listed; no duplicates; manifest `e52d85f7…aaa0` | matched | `evidence/hash-verification.json` | none |
| C-003 / normalization pin | `normalization_sha256` = evidence hash | `81be7ba8…aa04` both | matched | same | none |
| C-004 / governed rows pin | `workbook_rows_sha256` = workbook digest | `87636a53…b861`, 210 of 210 | matched | `--governed-rows-digest` | none |
| C-005 / foundation pin | Token foundation digest = Stage 5 pin; decision unchanged | `97e04be7…907b` in the tokens, the decision and the packet; decision bytes unchanged since `8a610c3` | matched | `ui-design-system.js` | none |
| C-006 / changed normalization notes | Notes are truthful about the exports | Row 76 (permission-conditioned state), 97 and 102 (drawn by the named dialogs), 110 (weekends), 208 (Export on project, iteration, story and task pages; none on person pages), `_notes[4]`/`[5]`: all agree with the exports | matched | normalization diff; PNGs | none |
| C-007 / derived views: source identity | Each declared source exists and is a governed Stitch-export version | All 52 source prefixes resolve to a Git blob. Each equals the bytes pass 002 reviewed at `8a610c3` (`projects-list-hide` → the `projects-list-member` source `b578d208`) | matched | `evidence/derived-view-verification.json` | none |
| C-008 / derived views: narrow, declared edits | Only the edits stated in the manifest notes and catalogue history | 42 views: title only. Required marking: 5 views. Tab-role removal: 2. Breadcrumb: form ×2, statistics-phone separator spacing. Statistics charts and the pie colour: 2. Hidden column: 1 new view. No other change | matched | same; [Derived-View Verification](#read-derived-view-verification) | none |
| C-009 / derived views: PNG is a render of the derived HTML | A faithful browser render, not a retouched image | 48 of 52 re-render offline to the same pixels (46 identical; ui-kit differs only in the animated spinner phase, iteration-tasks only in 174 sub-pixel pixels). 4 views (`history-desktop`, `iteration-accuracy-desktop`, `iteration-editor-phone`, `person-page-desktop`) load `cdn.tailwindcss.com`. Offline they differ by 26-71 % of pixels and in height. A visual check shows their PNG content matches their HTML text, but the pinned HTML cannot reproduce the PNG | mismatch | `evidence/render-comparison.json` | F-004 |
| C-010 / provenance labels honest and complete | Every derived file is labelled; no locally edited HTML is presented as Stitch output (`ui-ux-decision.md` line 224) | The manifest `_notes[3]` labels all 52 derived and 7 API views correctly. But the catalogue line 44 calls the component sheet an "official Stitch UI export, screen ef9b614e…", while the manifest labels it edited locally from `d6702907` (screen `5033fb08`). The CDN dependency of 4 renders is not disclosed | mismatch | catalogue line 44; `_notes[3]` | F-002, F-004 |
| C-011 / unchanged API views | Bytes unchanged; labels say API export | 7 views (14 files) are byte-identical to `8a610c3` and labelled "API get_screen" | matched | git diff | none |
| C-012 / progress and burn-down (rows 109-111) | Line chart of estimated and actual hours from samples; weekends included | Progress: SVG line chart, Actual solid primary 0.0→48.0 and Estimated dashed secondary 100.0, over 9 calendar days 03-02..03-10 including 03-07/03-08. Burn-down: the same 9 days, labelled "per day, weekends included". Desktop and phone agree | matched | statistics PNG/HTML | none (figures: F-007) |
| C-013 / hide permission: projects-list and project-editor (rows 76, 81) | One permission, a consistent representation; mapping per D-001/D-011 | Hide present: Hidden column (projects-list-desktop, projects-list-hide-desktop) and Hidden checkbox (project-editor). Hide absent: no column (projects-list-member-desktop) and a recorded state without the checkbox. The mapping is deferred to the SDD matrix (D-001, D-011). No view now ties hide to a named role | matched | manifest states; PNGs | none |
| C-014 / hide permission: person editor (row 48) | Same mechanism (pass-002 F-002 correction impact; CHK-002) | `person-editor-admin-desktop` (role view project admin) draws "Deactivated". Row 48 says "Users with hide permission can mark a person hidden" (D-007: deactivation). No state records hide present/absent or defers the mapping | mismatch | person-editor PNGs; manifest `person-editor.states` | F-001 |
| C-015 / other role views (rows 24, 26, 55, 82, 91; D-001, D-005) | Each role view is consistent with the map | System information and Create project only in the system-administrator frame. Delete project only for the system administrator. The admin project page has Edit and Create iteration. The editor iteration view has no Delete iteration. The viewer views are read-only | matched | PNGs | none |
| C-016 / task-editor breadcrumb | Parent links; a non-link current item | Desktop and phone: Top / Project 1 / Iteration 3 / Story 5 / Task 12 (link) / Edit (`aria-current`). The manifest navigation matches | matched | form PNG/HTML | none |
| C-017 / breadcrumbs across the set | Hierarchical pages only; none at the root, sign-in, error or print | Every breadcrumb has one non-link current item with `aria-current`, and parents are links. There is none on the 3 projects-list views, sign-in, error or print | matched | `export-scan.json` | none (spacing: F-005) |
| C-018 / tab semantics | Links with `aria-current`, no `role=tab` (catalogue `nav.tabs`) | 0 `role=tab`/`tablist` in 59 HTML files; the selected tab carries `aria-current` | matched | scan | none |
| C-019 / required marking in text | Required fields marked in text (Stage 5; `field.text`) | Iteration editor Start/End, time editor Person (header and accessible names), sign-in User ID/Password (desktop and phone) and note Body (add and edit) are now marked. No field with `required` lacks the text | matched | scan `inputs` | none |
| C-020 / pass-002 F-005 statements | The ten listed statements are corrected | All ten were checked and corrected (see [Pass-002 Resolution](#read-pass-002-resolution)) | matched | catalogue, manifest, normalization | none |
| C-021 / currency of records after this correction (CHK-007) | Status statements match the pinned files | New stale or false statements: "58 exported views (116 files)" (catalogue lines 41, 117) for a 59-view, 118-file set; "under correction after Stage 7 pass 001 (findings F-001..F-014)" (line 41); the component-sheet provenance (line 44); remainder (6) says list-desktop clips Status, which the current PNG does not; remainder (3) says the board "STORY" header is upper case by CSS, but it is upper case in the DOM text | mismatch | numbered reads; PNGs | F-002 |
| C-022 / page titles | Plain titles that name the page, in one pattern (pass-002 F-006) | No prompt codes or capture markers remain (0 of 59). 3 titles keep role or state notes: "Iteration 3 - Stories (Viewer)", "Iteration 3 - Stories (Export format menu)", "Move or continue: Task 8 (Error State)". The forms still differ: "… - Planner" vs none; "Close Iteration 3 Confirmation Dialog" and "Delete Task 8 Confirmation Dialog" name the widget | mismatch | scan `title` | F-003 |
| C-023 / journeys | Entry, destination, next/back/cancel, retained context | Planning path sign-in → projects → project → iteration tabs → story → task → task editor / time editor. Also: system information; people → person → editor and timesheet; aggregate timesheet; search → object; close → continue/no-future; start; move stories; story/task move-continue with rejection; reopen; notes edit/delete; export menus; project history; error → projects; print by URL. Context Project 1 / Iteration 3 / Story 2 / Task 8 is consistent | matched | PNGs | none |
| C-024 / Save/Reset/Cancel | Save, Reset, Cancel on every editor, in that order | 12 editor views: task ×2, story, iteration ×2, project, person ×2, note ×2, time ×2. Phones stack them full width | matched | PNGs | none |
| C-025 / dialogs | `role=dialog`, `aria-modal`, labelled, consequences named, initial focus on the safe choice | 11 confirmation/choice dialogs plus the date-picker popover and the kit specimen. The delete dialogs name the effect. Focus is on Cancel in the close, start, move, delete and note-delete dialogs | matched | scan `dialogs`; PNGs | none |
| C-026 / phone viewport | Real ~390 CSS px captures | All 11 phone PNGs are 390 px wide, rendered at 390 CSS px with mobile emulation (re-render identical except `iteration-editor-phone`, see C-009) | matched | PNG sizes; render | none |
| C-027 / 320 px reflow | No page-level horizontal scroll at 320 CSS px | Measured: all 11 phone exports have `scrollWidth` = 320 at 320 CSS px. No element overflows outside a scroll container. Wide tables scroll in their own container | matched | `render-comparison.json` `reflow_320` | none |
| C-028 / desktop fit | No clipping at 1280 CSS px | No clipped control or text. The list-desktop Status column fits | matched | PNGs | none |
| C-029 / catalogue ↔ kit ↔ screens | Each variant is previewed, used and evidenced | 22 variants, 25 kit sections, all used. The changed `ui_variants` are evidenced: projects-list without `nav.breadcrumb`; time-editor `message.error-summary` (phone summary); person-editor `table.data` (project roles) | matched | `variant-check.json` | none |
| C-030 / chart.line consistency | The kit specimen equals the screen usage (pass-002 learning 3) | Kit and catalogue: Actual solid primary, Estimated dashed secondary; screens the same | matched | kit HTML; statistics | none |
| C-031 / rendered colours vs tokens | Exports use token values | Non-token colours remain: `#FAFBFC` (6 exports), `#E4E6EB`, `#E2E5E9`, `#E2E4E8`, `#A5ADBA`, `#FEEBEA`. The disposition series is now aligned (series-2 `#1F7A45` on desktop and phone) | mismatch | `export-scan.json` | F-006 |
| C-032 / font family and icons | OS font stack; Lucide; no font files | System stack everywhere; no Google Fonts, Inter or Material Symbols | matched | scan | none |
| C-033 / type sizes and units | `type.size-body` 1rem; rem tokens | No export uses rem. The body is 14 px in 31 exports by static rule, 16 px in 20, and the rest are set by utility classes | mismatch | scan | F-006 |
| C-034 / focus visibility | Visible focus on every interactive export | Every interactive export defines a focus style (print has no controls); focus rings are visible in the dialog and editor PNGs | matched | grep; PNGs | none |
| C-035 / labels | Visible labels, never placeholder-only | All controls have a visible label or an accessible name; no placeholder-only field | matched | scan `inputs` | none |
| C-036 / skip link | First focus stop of every signed-in export | 56 of 56 signed-in exports; the target exists | matched | scan | none |
| C-037 / zoom | No zoom blocking | All viewports are `width=device-width, initial-scale=1` (or `1.0`) | matched | scan | none |
| C-038 / `aria-sort` | Sorted headers expose `aria-sort`; headers are buttons | Every header with a sort indicator carries `aria-sort`, including the new Hidden column | matched | scan | none |
| C-039 / status not by colour alone | States in text | Task, story and iteration states in text; progress as %; errors with icon and text; chart lines are named in legends | matched | PNGs | none (phone legend dash: F-005) |
| C-040 / no invented functions | No function outside approved rows; no target-only addition | No deferred or excluded function; no `target_only`. The new hide view adds no function | matched | greps; manifest | none |
| C-041 / manifest records of changed screens | States, navigation and variants truthful | projects-list (3 states with exports), project-editor (hide and admin.edit states), task-editor navigation and the variant changes agree with the exports. The person-editor gap is counted in C-014 | matched | manifest | none |
| C-042 / profile identity | Initials avatar with fallback; no photo or upload | `avatar.initials` UA/UB next to the name; no photo or upload | matched | person-page PNGs | none (shape: F-005) |
| C-043 / phone pattern reliance | Unverified phone surfaces rely on drawn patterns | `_notes[7]` IDs now match `_notes[3]`. The patterns are drawn in the cited exports | matched | manifest; phone PNGs | none |
| C-044 / shared frame consistency | Sibling pages share frame, spacing and labels | Several differences remain (remainders 2, 3, 4, 6, 8, 9, 10) and the phone progress legend has an issue | mismatch | PNGs | F-005 |
| C-045 / content fidelity | Figures consistent across exports | The new chart series disagree with the timesheet, accuracy and history figures. Accuracy "Added 0.0" vs Story 4 "Added" (16.0 h, created 03-03). The pass-002 F-009 items are unchanged | mismatch | statistics, accuracy, timesheet, history PNGs | F-007 |
| C-046 / coverage of the changed rows | Changed rows drawn, or covered by a verified pattern | Rows 109-111 (D), 76 (D, two states), 81 (D; hide-absent state P), 134/185 (D), 44/89/154/170 (D), 48 (D, but see F-001) | matched | PNGs; manifest | none (F-001 for row 48 roles) |
| C-047 / correction scope (Keep Work Focused) | Corrections bounded to the findings; no unjustified additions | Edits are bounded to the declared items. The one new view serves F-002. No new variant or token | matched | diff | none |
| C-048 / wizard steps | Wizard steps drawn | No wizard exists in the agreed scope | not-applicable | rows; D-001..D-025 | E-001 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 48 | 38 | 9 | 0 | 1 |

Findings are counted separately: 7 findings (1 Medium, 3 Low not cosmetic, 3 Low cosmetic). One finding can affect several checks. The retained pass-002 results listed in Comparison Scope are not in these counts. The waiver checks W-1..W-11 are reported in [Waiver Verification](#read-waiver-verification) and are not part of these counts.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Screen to rows, roles, states, files, hashes and verdict** (all hashes verified, C-002)

| Screen | Declared roles | Rows | Exports | Verdict |
|---|---|---|---|---|
| iteration-page | admin, editor, viewer | 24, 91-93, 95-99, 101-104, 192, 210 | list-desktop/phone, dialog-desktop/phone, continue-dialog-desktop/phone, continue-no-future, iteration-start-dialog, iteration-print, iteration-viewer, iteration-export-menu, iteration-move-stories-dialog, iteration-empty-phone | matched (title: F-003) |
| task-editor | editor | 134, 136, 137, 139, 190 | form-desktop/phone | matched |
| sign-in | unauthenticated | 8, 10, 12-14, 18 | signin-desktop/phone | matched |
| projects-list | system administrator, viewer, editor, admin | 19, 75-77 | projects-list-desktop, -member-desktop, -hide-desktop | matched |
| project-page | system administrator, admin | 82-84, 208, 209 | project-page-desktop/phone, project-page-admin-desktop | matched |
| project-editor | admin | 78-81 | project-editor-desktop | matched |
| iteration-editor | editor | 71, 88-90 | iteration-editor-desktop/phone | matched (phone render: F-004) |
| iteration-tasks | viewer | 106 | iteration-tasks-desktop | matched |
| iteration-statistics | viewer | 109-111 | iteration-statistics-desktop/phone | matched (figures: F-007) |
| iteration-accuracy | viewer | 113 | iteration-accuracy-desktop | matched (render: F-004; figures: F-007) |
| iteration-board | viewer | 114 | iteration-board-desktop/phone | matched (cosmetic F-005) |
| story-page | editor, viewer | 126-132, 212 | story-page, story-move-dialog, story-viewer-export | matched |
| people-list | admin, system administrator | 37, 39 | people-list-desktop | matched |
| person-timesheet | editor | 162, 163 | person-timesheet-desktop | matched |
| search-results | editor | 178, 179, 181-183 | search-results-desktop | matched |
| history | editor | 186 | history-desktop, history-project-desktop | matched (render: F-004; cosmetic F-005, F-007) |
| story-editor | editor | 121-123, 125 | story-editor-desktop | matched |
| task-page | editor, viewer | 26, 140-147, 185 | task-page, task-delete-dialog, task-move-dialog, task-completed, task-viewer | matched (title: F-003) |
| time-editor | editor | 100, 149-161 | time-editor-desktop/phone | matched (cosmetic F-007) |
| person-page | editor, viewer | 40-42, 188 | person-page-desktop, person-page-viewer-desktop | matched (render: F-004; cosmetic F-005) |
| person-editor | system administrator, admin | 33, 34, 43-48 | person-editor-desktop, person-editor-admin-desktop | **mismatch (F-001)** |
| aggregate-timesheet | editor | 165, 166 | aggregate-timesheet-desktop | matched |
| note-editor | editor | 169, 170, 173, 174 | note-editor-desktop, note-editor-edit-desktop, note-delete-dialog-desktop | matched |
| error-page | editor | 56, 57 | error-page-desktop | matched |
| system-info | system administrator | 55 | system-info-desktop | matched (cosmetic F-005) |
| (resource) ui-kit | - | - | ui-kit.html/png | 25 sections; provenance claim in the catalogue: F-002 |

**Figure reconciliation:** iteration 100/48/52 equals the stories, which equal the tasks. The board 3/10/5 matches the task statuses. Pies 13/3/2, 15/3, 70/21/9, 83/17, 39/5/4 and 44/4. Accuracy 96/100/48/52, with over 2.0 and under 6.0. User A's timesheet 31.0 = Task 1+2 (9.0), Tasks 13/15/17 (6.0) and Tasks 10-12 (16.0). The aggregate is 48.0. Burn-down remaining = 100 − actual on each day. The exceptions are in F-007.

<a id="read-pass-002-resolution"></a>

## Pass-002 Resolution

Each item was verified in the pinned exports. None is accepted on the author's claim (`evidence/pass002-resolution.json`).

| Pass-002 finding | Status in this pass | Evidence |
|---|---|---|
| F-001 (medium) progress chart and weekends | **resolved** | Line chart of estimated and actual hours over 9 calendar days including the weekend, on desktop and phone. The burn-down includes the weekend. The `chart.line` record and the kit agree. Re-renders are pixel-identical. Sample-data coherence is a new cosmetic item (F-007) |
| F-002 (medium) hide permission | **partly resolved; the remainder is open as F-001** | The projects-list/project-editor contradiction is gone (C-013). The required recheck over person-editor (CHK-002) was not applied: row 48 "Deactivated" is drawn in the project-admin view without a condition (C-014) |
| F-003 (low) task-editor breadcrumb | **resolved** | Task 12 is a link and Edit is the current item, on desktop and phone; the manifest navigation is corrected |
| F-004 (low) tab roles, required marking | **resolved** | 0 `role=tab`; required marking in text on all four forms and both sign-in views; CHK-005 now passes |
| F-005 (low) stale claims (CHK-007) | **resolved for the ten listed statements; the mechanism recurs as F-002** | Catalogue lines 84/88/89; manifest `scope`, `_notes[2]`, `_notes[7]`, `projects-list.ui_variants`, task-editor navigation; normalization rows 97, 102, 208 and `_notes[4]`; the remainders are now in the pinned manifest `_notes[10]` |
| F-006 (low) authoring text in titles | **largely resolved; the residual is open as F-003** | 0 prompt codes and capture markers. 3 role or state notes and the mixed title pattern remain |
| F-007 (low cosmetic) shared frame | **partly resolved; open as F-005** | The form-phone doubled separator is fixed (one `aria-hidden` separator per item, no `::before`), and the statistics-phone separator spacing is aligned. The other items remain |
| F-008 (low cosmetic) values vs tokens | **partly resolved; open as F-006** | The disposition series is aligned on desktop and phone. The non-token colours, px units and 14 px body remain |
| F-009 (low cosmetic) sample data | **open as F-007** | Both items are unchanged |

Pass-001 leftovers carried into pass 002:

- F-006 → p002 F-004: resolved.
- F-007/F-009 → p002 F-005: resolved as listed, but CHK-007 recurs (F-002).
- F-010/F-013 → p002 F-008: open, cosmetic (F-006).
- F-014 → p002 F-007: open, cosmetic (F-005).
- F-001..F-005, F-008, F-011 and F-012 of pass 001 remain resolved. They were rechecked on the current re-renders through C-015, C-017, C-023 and C-045.

<a id="read-derived-view-verification"></a>

## Derived-View Verification

| Check | Result | Evidence |
|---|---|---|
| Every derived view is labelled "edited locally, derived from Stitch export HTML <hash>", with the render named | **matched** in the manifest `_notes[3]`: 52 derived views and 7 API views, 59 entries for 59 views | `hash-verification.json` `provenance` |
| The declared source exists | **matched**: 52 of 52 prefixes resolve to a blob in the pinned repository's history. Each equals the file reviewed at `8a610c3`. The new hide view's source is the member view's `b578d208`, as declared | `derived-view-verification.json` |
| The derived HTML differs only by the narrow edits stated | **matched**: 42 views differ in the title only. The others: iteration-start-dialog (title, tab roles), form-desktop/phone (title, breadcrumb, separator CSS), signin ×2, iteration-editor-desktop, time-editor-desktop and note-editor ×2 (title and required marking), iteration-statistics-desktop/phone (title, progress and burn-down charts, pie colour, phone separator spacing, tab roles), projects-list-hide (title, Hidden column with two "No" cells). All of these are stated in `_notes[0]`, `_notes[10]` and the catalogue history | same |
| The PNG is a render of the derived HTML, not a retouched image | **matched for 48; not reproducible for 4 (F-004)**. Offline re-renders with the same Chrome build and geometry are pixel-identical for 46. ui-kit differs only in the animated loading-spinner phase (435 pixels) and iteration-tasks only by sub-pixel anti-aliasing (174 pixels, no channel > 64), both checked by cropped comparison. The 4 CDN views (history-desktop, iteration-accuracy-desktop, iteration-editor-phone, person-page-desktop) render unstyled offline. Their PNG text, figures and structure match the HTML on visual inspection, but faithfulness cannot be reproduced from the pinned files | `render-comparison.json` |
| The labels are honest and complete | **mismatch**: the catalogue still calls the component sheet an official Stitch export (F-002), and the label does not disclose that 4 renders depended on a remote script (F-004) | catalogue line 44; `_notes[3]` |
| The 7 non-derived views are honestly labelled | **matched**: byte-identical to `8a610c3`, labelled "API get_screen" (Stitch asset PNGs, not browser renders; their offline renders differ, as expected) | git diff; render |

Limitation: whether the source bytes at `8a610c3` are themselves unmodified Stitch exports cannot be verified here. The Stitch projects and the out-of-tree provenance are not permitted inputs. Pass 002 recorded them as API/ZIP exports.

Observation O-1 for PM: the owner authorization of the derived-export method (2026-10-05) appears in the pinned tree only as relayed mentions (status transition reason line 427 and catalogue history line 136). There is no decision entry with the owner's words. No rule makes this a Stage 7 gate, and the labels satisfy the Stage 5 rule against presenting hand-made HTML as Stitch output. This pass does not accept the authorization on the owner's behalf.

<a id="read-f-002-option-c-verdict"></a>

## F-002 Option C Verdict

- **What option C does.** It models hide (rows 76, 81), admin.edit (rows 26, 81) and System information (row 55) as separate permission conditions. It draws hide present and absent in the same non-system-administrator frame (projects-list-hide vs projects-list-member). It records the project editor's hide-absent state as an unchanged composition without the checkbox, and it defers which roles hold each condition to the SDD matrix.
- **Authority.** D-001: "the exact permissions are a separate matrix at SDD, with no extension of rights by default". D-011: "the permission matrix and exact data at SDD", with R-24 (a hidden project seen by a reader) unverified. The prototyping README requires a destination to be absent when the role lacks permission, but it does not require a role mapping before SDD. Stage 4 itself leaves the mapping open, so option C is consistent with the contract and assigns no right.
- **Contradiction of pass 002.** It is resolved for projects-list and project-editor. No export or record now says that admins both hold and lack hide. The `project-editor.roles: [admin]` entry is qualified by its states (hide present drawn, hide absent recorded, mapping deferred). Bundling Create project with the system-administrator condition repeats the row-24 representation that pass 002 accepted.
- **Not complete.** Row 48 ("Users with hide permission can mark a person hidden", D-007 → deactivation) uses the same permission. Pass 002 named it in its correction impact and its CHK-002 recheck. Yet `person-editor-admin-desktop` (role view project admin) draws "Deactivated" unconditionally, and `person-editor.states` records no hide condition and no deferral. Deactivation stops sign-in system-wide, so the drawing implicitly grants project admins a security-relevant right that D-001 does not extend by default.
- **Verdict:** option C is adequate as a mechanism and closes the projects contradiction. Pass-002 F-002 is **not fully resolved**. Its remainder stays a finding (F-001, Medium, never cosmetic: incorrect role/permission representation).

<a id="read-findings"></a>

## Findings

<a id="read-f-001"></a>

### F-001 - Person-editor "Deactivated" is drawn for project admins without the hide-permission condition

- Severity: medium (never cosmetic: incorrect role and security representation)
- Comparison check IDs: C-014
- **Checklist link:** CHK-002 (permission conditions; pinned checklist `8a15e08c…a90b`)
- **Checklist discrepancy:** the pass-002 required recheck "CHK-002 over every view that depends on the hide permission (projects-list, project-editor, person-editor)" was applied to two of the three screens.
- **Required recheck:** CHK-002 over every control gated by hide or by its D-007 successor (person-editor desktop and admin views), with each state recorded as present or absent and the mapping deferred, as option C does.
- Expected and source: row 48 "Users with hide permission can mark a person hidden" (D-007: deactivation; T-01 "an administrator reactivates through the existing person management"). D-001: no extension of rights by default; matrix at SDD. Option C's own rule (manifest `projects-list.states[3]`, normalization `_notes[5]`).
- Observed difference: `person-editor-admin-desktop.png`/`.html` (declared "role view project admin") shows the "Deactivated" checkbox with "A deactivated person cannot sign in or take new assignments". The manifest `person-editor.states` lists only the two role views, validation and duplicate user ID. No state covers hide present or absent, and nothing defers the mapping.
- Evidence: `export-scan.json` (`person-editor-admin-desktop.html` inputs include "Deactivated"); manifest `person-editor`.
- Requirement impact: row 48; rows 33/34 role views; D-001, D-007.
- Required action: record the deactivation control as a permission-conditioned state (present/absent, mapping deferred to SDD), or draw the project-admin view without it. Keep the representation consistent with option C.
- Correction impact: person-editor (both views, manifest states, normalization row 48 note); a check of every other control that row-26-style permission gating governs.
- Return stage: 6

<a id="read-f-002"></a>

### F-002 - Stale or false statements after the correction, including the component-sheet provenance

- Severity: low (not cosmetic: unsupported claims in the Stage 8 package, and one provenance claim that conflicts with the Stage 5 rule)
- Comparison check IDs: C-010, C-021
- **Checklist link:** CHK-007 (figures and status after a correction). This is the third occurrence (pass-001 F-007, pass-002 F-005).
- **Checklist discrepancy:** the UX-006-14 correction added a view and relabelled the provenance without updating the counts and provenance statements that depend on them.
- **Required recheck:** CHK-007 over `ui-design-system.md` (lines 38, 41, 44, 70, 117) and the manifest `_notes[10]`, compared with the files on disk.
- Expected and source: MIGRATION.md Keep Work Focused (no unsupported claims); ui-design-system-guide ("The catalogue must describe what the exports actually show"); `ui-ux-decision.md` line 224 ("no hand-drawn HTML presented as Stitch output").
- Observed difference:
  1. Catalogue line 41 says "58 exported views (116 files…)" and line 117 says "58 exported views". The set has 59 views and 118 export files.
  2. Line 41 says the set is "under correction after Stage 7 pass 001 (findings F-001..F-014)". It is under correction after pass 002.
  3. Line 44 calls the component sheet an "official Stitch UI export, screen ef9b614e…". The manifest labels it "edited locally, derived from Stitch export HTML d6702907" (screen `5033fb08`).
  4. Lines 38 and 70 give the maintenance range as "UX-006-01..UX-006-13". UX-006-14 changed the set.
  5. Manifest `_notes[10]` (6) says list-desktop clips the Status column. The current 1280 px PNG shows no clipping.
  6. `_notes[10]` (3) says the board "STORY" header is upper case by CSS. It is upper case in the DOM text (`iteration-board-desktop.html` line 424).
- Evidence: numbered reads of the pinned files; `list-desktop.png`; `iteration-board-desktop.html`.
- Requirement impact: record integrity and provenance honesty of the Stage 8 package.
- Required action: correct the statements to the actual state; describe the component sheet with the same derived label as the manifest; re-run CHK-007.
- Correction impact: catalogue lines 38, 41, 44, 70, 117; manifest `_notes[10]` items 3 and 6.
- Return stage: 6

<a id="read-f-003"></a>

### F-003 - Residual role and state notes, and mixed patterns, in page titles

- Severity: low (not purely cosmetic: the page title is programmatically exposed, WCAG 2.4.2, and is binding source text for Stage 17 content fidelity; the same classification as pass-002 F-006)
- Comparison check IDs: C-022
- **Checklist link:** none: new finding (residual of pass-002 F-006)
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source: pass-002 F-006 required action ("a plain page title in one pattern"); Stage 5 "Not covered: any invented text".
- Observed difference:
  - `iteration-viewer-desktop.html` "Iteration 3 - Stories (Viewer)", `iteration-export-menu-desktop.html` "Iteration 3 - Stories (Export format menu)" and `task-move-dialog-desktop.html` "Move or continue: Task 8 (Error State)" keep role or state notes. Manifest `_notes[10]` (5) counts them among "normal" titles.
  - Titles still mix "… - Planner" with none (for example "Edit task: Task 12", "Iteration 3 - Board").
  - Two titles name the widget instead of the page: "Close Iteration 3 Confirmation Dialog" and "Delete Task 8 Confirmation Dialog".
- Evidence: `export-scan.json` `title`.
- Requirement impact: content fidelity and page-title accessibility.
- Required action: remove the notes and apply one title pattern to every export, or record that titles are outside the binding scope.
- Correction impact: the 3 annotated titles plus the titles outside the chosen pattern (title elements only).
- Return stage: 6

<a id="read-f-004"></a>

### F-004 - Four derived views depend on an unversioned remote script; their PNG is not reproducible from the pinned HTML

- Severity: low (not cosmetic: the appearance of four pinned exports is not fixed by repository files, and the provenance label is incomplete)
- Comparison check IDs: C-009, C-010
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  - Prototyping README Rules: exports are real repository files, and "a hash satisfied from an untracked target is not durable evidence".
  - Implementation parity provenance: "Stage 17 and Stage 18 checks consume the exact approved source files".
  - The UX-006-14 label: "their PNG is a fresh full-page render of that edited HTML".
- Observed difference: `history-desktop.html`, `iteration-accuracy-desktop.html`, `iteration-editor-phone.html` and `person-page-desktop.html` load `https://cdn.tailwindcss.com` (unversioned). Offline, the same Chrome build renders them unstyled: 26-71 % of the pixels differ, and two have a different height (accuracy 1405 → 2026 px, editor-phone 1556 → 1754 px). So the pinned PNGs reflect whatever the CDN served at render time. The label does not say that the render needed the network. This dependency was a non-required limitation in pass 002. It now also defeats the derived-render guarantee.
- Evidence: `render-comparison.json` (`external_requests`, `diff_ratio`); the HTML `<script src>`.
- Requirement impact: reproducibility and Stage 17 parity of four screens' styling.
- Required action: make the four exports self-contained (inline or repository-pinned styles), re-render, and update the labels. Alternatively, record the dependency and its version in the provenance with an owner-accepted rationale.
- Correction impact: the 4 views; `_notes[3]`.
- Return stage: 6

<a id="read-cosmetic-findings"></a>

## Cosmetic Findings

These three findings are Low and purely visual or sample data under the README rules. None is a missing flow, invented behaviour, a role or security issue, a missing state/action/dialog, broken navigation or unusable clipping. They do not close the stage, because F-001..F-004 are not cosmetic. This pass creates no backlog.

| ID | Severity | Observation and evidence | Required action | Return stage |
|---|---|---|---|---|
| F-005 | low, cosmetic | Shared frame and presentation (pass-002 F-007 residual; manifest remainders 2, 3, 4, 6, 8, 9, 10). **Breadcrumb spacing:** uneven in project-page-phone ("Top  / Project 1"), dialog-phone and iteration-empty-phone. **Action-link separators:** "•" on task-page, project-page and person pages, but none on list-desktop, story-page and task-completed. **Upper case:** board status headings (phone) and the "FORMAT" menu captions by CSS, and "STORY" in the DOM text of the board header. **Tab row:** cut at "Bo" in iteration-empty-phone, in a scrollable `.tabs-nav`. **Frame:** page insets of 30/40/65/80 px; avatar circle on person-page-viewer against the 6 px square of `avatar.initials`; note-editor-edit actions outside the card; history "By" a link in one view and monospace dates in one view; mixed editor label weights; person-editor accessible names "Project N Role" vs "Role for Project N"; system-info table without a section heading; ui-kit titles in monospace. **Phone progress chart (new):** the "Estimated hours" legend swatch renders as a short solid grey line (the 2 px dashed border does not show on the swatch), and the axis/value labels are 9-10 SVG units (about 8-9 CSS px). The plot itself distinguishes the lines by colour and dash, and the legend names them | Align with the shared frame and the `nav.*`, `avatar.initials`, `field.*` and `chart.line` rules | 6 |
| F-006 | low, cosmetic | Rendered values against tokens (pass-002 F-008 residual; remainder 11). Non-token colours: `#FAFBFC` (6 exports), `#E4E6EB`, `#E2E5E9`, `#E2E4E8`, `#A5ADBA`, `#FEEBEA`. Every export uses px, with a 14 px body in about 31-33 exports against `type.size-body` 1rem. The series order is now aligned. This is not approval of px units: the implementation must consume the rem tokens (Stage 5) | Bind to the tokens; add extension tokens where a new value is needed | 6 |
| F-007 | low, cosmetic | Sample data (pass-002 F-009 residual; remainders 7, 12; new chart figures). (a) `history-desktop` Story 2 "Estimate changed from 20.0 to 24.0" on 03-04, against an original estimate of 24.0 elsewhere. (b) `time-editor-phone` "Entry 3: Person" for the block "New entry". (c) **New:** the progress chart starts Actual at 0.0 on 03-02 and ends at 48.0 on 03-10. User A's timesheet logs 4.0 h on 03-02 and 4.0 h on 03-11 within the iteration's 48.0 h, so the series and the timesheet cannot both be right. (d) **New:** the Estimated line (and burn-down start) is flat at 100.0 from 03-02, while accuracy gives Original 96.0 / Current 100.0. (e) Accuracy "Added 0.0" while Story 4 has disposition "Added" (16.0 h) and project history shows it created on 03-03, after the start. (f) The time-editor-desktop Person/Pair lists include User D. User D is an active Project 1 acceptor, so this item is not a defect | Make the sample figures and labels consistent across statistics, accuracy, timesheets and history | 6 |

<a id="read-waiver-verification"></a>

## Waiver Verification

`waiver:legacy_walkthrough_fallback:xplanner2-revision1`, scope exactly `xplanner2-revision1`. The detailed ledger is `evidence/waiver-verification.json`.

| Check | Expected (MIGRATION.md Waiver Contract; methodology Stop criterion; fallback Conditions) | Observed | Result |
|---|---|---|---|
| W-1 schema and fields | decision, decided_by, decided_at, scope, rationale, record, residual_risk, permitted_next_stage | All present (status lines 975-985); `audit:status` passes | matched |
| W-2 gate and exact scope | `waiver:<gate>:<exact-scope>`; scope `xplanner2-revision1` | Exact; `legacy_walkthrough.scope` and `decision_id` agree | matched |
| W-3 permitted next stage | `legacy_walkthrough_fallback` → `stage-04` | `stage-04`; both 3→4 transitions (16:04:50Z, 17:38:12Z) cite the waiver and the record | matched |
| W-4 decision authority | Owner, or a recorded delegation covering this gate | `operational-mandate-stage4-completion` (decided by `ekzarov`; `delegation.waivers: [legacy_walkthrough_fallback]`; ends at Stage 5). The record says it is not a personal owner approval | matched |
| W-5 durable record | Exists and is pinned | `walkthrough-001-fallback.md` `2d6f4bb1…ce4d` = the Stage 4 pin; unchanged | matched |
| W-6 waived scope exact; no applicable unwaived scope omitted | Waived = residual (d)+(e) | Residual table: (a) 17, (c) 6, (d) 5, (e) 19. Waived R-24..R-47 = 24 = (d)+(e). Items (a) and (c) are resolved or observed, so they are not residual | matched |
| W-7 residual risk and blocked scope visible | Not claimed as observed | `outcome: blocked-waived`; `W001-residual-R24-R47` is blocked with the waiver ID and both records | matched |
| W-8 Condition 1 carried to Stage 4 | Requirements resting on waived sub-checks are marked | Stage 4 line 99 rule; per-decision flags rest on R-24..R-28, R-30, R-34, R-40, R-41 and R-46; lines 311 and 383 | matched |
| W-9 prototype claims no waived behaviour as verified | Target behaviour only | No reference to R-24..R-47, W001 or legacy observation in the prototype records. Option C defers hidden-project visibility (R-24) to the SDD matrix and does not draw it as observed behaviour | matched |
| W-10 record location | Methodology wording "`analysis/stages/waivers/`" | The record is under [`analysis/stages/stage-03/`](../stages/stage-03); MIGRATION.md requires only a durable path | matched (observation carried from pass 002, not a finding) |
| W-11 closing link | The next independent control gives a **clean** pass that verifies the waiver and links the record | W-1..W-10 matched, but this pass is `findings` | **not satisfied by this pass** |

**Result: the waiver content is verified, and no applicable unwaived scope was found omitted. The waiver is NOT verified for Stage 7 closure.** The rules require a `clean` pass that verifies the waiver and links its record, and this pass is `findings`. The next eligible pass must repeat this verification and be `clean`. The legacy behaviour of R-24..R-47 stays unverified whatever the verdict.

<a id="read-open-visual-remainders"></a>

## Open Visual Remainders

The pinned manifest `_notes[10]` lists 12 remainders that the human has not accepted. This pass does not accept any of them on the owner's behalf.

| # | Remainder (manifest wording, shortened) | Conclusion under the README Low-cosmetic rules | Reason |
|---|---|---|---|
| 1 | form-phone doubled breadcrumb separator, "corrected" | **corrected; no remainder** | One `aria-hidden` separator per item; no `::before`; the PNG shows single separators |
| 2 | Uneven breadcrumb spacing (project-page-phone, dialog-phone, iteration-empty-phone); "•" separators on some pages only | purely cosmetic (F-005) | Spacing and decoration; links, order and `aria-current` intact |
| 3 | Upper-case board headings, "STORY" header, "FORMAT" caption by CSS | purely cosmetic (F-005); the record is partly wrong (F-002) | Headings and the caption use CSS; "STORY" is upper case in the DOM text. A one-word column caption still reads as a word; no meaning is lost |
| 4 | iteration-empty-phone tab row cut at "Bo" | purely cosmetic (F-005) | `.tabs-nav` scrolls horizontally (`overflow-x: auto`), as the catalogue allows; all tabs are reachable; not unusable clipping |
| 5 | Page titles | prompt codes removed; **the residual is not purely cosmetic** (F-003) | Programmatically exposed, binding text, with role/state notes left in 3 titles |
| 6 | Shared frame (insets, tab weight, avatar circle, note-edit actions, history "By"/monospace, list-desktop Status clipping, label weights) | purely cosmetic (F-005), except the clipping item, which is **not present** in the current render (record: F-002) | Visual consistency only |
| 7 | time-editor-desktop lists User D | **not a defect** (F-007 f) | User D is an active Project 1 acceptor |
| 8 | person-editor accessible names "Project N Role" vs "Role for Project N" | purely cosmetic (F-005) | Both names identify the control; only the wording differs |
| 9 | system-info table without a section heading | purely cosmetic (F-005) | The h1 and the column headers give the structure |
| 10 | ui-kit titles in monospace | purely cosmetic (F-005) | Component sheet, not a business screen |
| 11 | Non-token colours, px units, 14 px body; series order aligned | purely cosmetic (F-006); the series order is verified aligned | Values only; the rem tokens bind at Stage 17 |
| 12 | Sample data (history estimate; "Entry 3") | purely cosmetic (F-007) | Synthetic data; no function affected |

**Governed Low-cosmetic rules.** They do not apply to this pass, because non-cosmetic findings exist (F-001 Medium; F-002..F-004 Low and not cosmetic). For a later pass whose only findings are Low and cosmetic, the README and the methodology Exit criterion require the following. Every finding must be dispositioned in `analysis/prototyping/ui-polish-backlog.md` (template `ui-polish-backlog-template.md`). That file must name that pass's `session_id`. Each finding needs the owner's explicit agreement, a responsible agent, a named implementation slice, a linked task and the deadline "before the affected slice first reaches production". The pass entry must record `findings_severity_max: low`, `never_cosmetic_check: confirmed` and `dispositioned_in: <existing path>`, and no scope may remain unchecked. Such a pass is a closing pass, not `clean`. For the waiver closure link in W-11, MIGRATION.md requires a `clean` pass.

<a id="read-keep-work-focused"></a>

## Keep Work Focused

These are concrete instances in the reviewed Stage 6 work, as MIGRATION.md requires:

- **Required correction (incomplete same-mechanism check):** F-001. Option C was applied to two of the three screens named in the pass-002 correction impact.
- **Required correction (unsupported claims):** F-002. Counts and the component-sheet provenance were not updated after the correction.
- **Required correction (reproducibility):** F-004.
- **Scope discipline confirmed:** the edits are bounded to the declared items, and the one new view serves F-002. No new variant or token, no target-only element and no deferred or excluded function.
- **Optional improvement (not a defect):** four phone exports still set `overflow-x: hidden` on the body. That would mask a future overflow. The 320 px measurement found no current overflow (C-027).

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Prototype audit | `npm run audit:prototype` in `C:/Work/Legacy/xp-qa7c/analysis/tools` (`2026-10-05T12:30:23Z`) | pass: "WARN: ui-ux-approval.md is not present; rerun with --require-approval before Stage 8 closes" / "25 screens; 118 pinned exports" / "PROTOTYPE AUDIT OK", exit 0 | console output |
| Status audit | `npm run audit:status` | pass: "Validated migration_status.yaml at stage-07" / "STATUS VALIDATION OK" | console output |
| Governed rows digest | `node prototype-audit.js --governed-rows-digest` | pass: `87636a53…b861`, 210 of 210 | console output |
| Foundation digest | `node ui-design-system.js ../prototyping/ui-design-tokens.json` | pass: `97e04be7…907b` | console output |
| Export hashes | Node SHA-256 over all manifest entries, directory comparison, normalization evidence hash | pass: 120/120; 118 both ways; `81be7ba8…aa04` | `evidence/hash-verification.json` |
| Derived-view source and diff | Git blob search by declared prefix; `git diff --no-index` per view | 52/52 sources found; edits as declared | `evidence/derived-view-verification.json` |
| Local re-render | Chrome 154.0.8037.95 headless over the DevTools protocol, network blocked, pixel comparison and 320 px measurement | 48/52 reproduced; 4 CDN views not reproducible (F-004); 11/11 phones reflow at 320 | `evidence/render-comparison.json` |
| Visual and structural review | 52 changed PNGs viewed; 59 HTML scanned | see Comparison Results | `evidence/export-scan.json`, `evidence/variant-check.json` |
| Waiver verification | Manual ledger W-1..W-11 | content verified; closing link not satisfied | `evidence/waiver-verification.json` |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-048 | No wizard (multi-step flow) exists in any applicable row or decision | Scope evidence: the 145 applicable rows and D-001..D-025 | pass-002 `coverage-check.json`; Stage 4 |

- Blocker: none.
- Exact unchecked scope: none required.
- Non-required limitations, stated so that they are not mistaken for checks:
  - Interactive behaviour (hover, focus order, Escape, focus return, picker keyboard use) cannot be exercised on static exports. Stage 17 verifies it.
  - Whether the `8a610c3` source bytes are unmodified Stitch exports cannot be verified without the Stitch projects or the out-of-tree provenance, which are not permitted inputs.
  - The 4 CDN views were verified for content by visual comparison only. Pixel reproduction is impossible offline, and that is reported as F-004, not left unchecked.
  - The owner authorization of the derived method is seen only as relayed mentions (O-1).
- Required prerequisite: none.
- Reassignment/closure reference: not applicable.

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-007 | this report and `evidence/` | pending | pending | pending (next fresh Stage 7 pass) |

Operational disclosures:

- One read command over several ranges of `MIGRATION.md` produced output above the console limit, and the client saved it to a spill file. I did not open the spill file. I re-read the needed sections with the file tool in narrow ranges. Nothing was written to either repository.
- The local re-render ran Chrome headless with a temporary profile in the session scratchpad and with all host names mapped to an unresolvable address. No network request left the machine: the four CDN requests failed by design. The worktree status stayed at 0 lines.
- One helper script first failed (a missing `zlib` import in a scratch file) and was corrected in the scratchpad. There was no effect on either repository.
- CHK-009 / constitution A3 credential check: this review read no credential source. The new evidence contains only field labels ("Password (required)", "New password", "Confirm password") and synthetic `example.test` addresses from the exports. Hit count for credential values in the new evidence: 0.

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-001 → CHK-002 (the recheck over the hide-dependent person editor was not applied). F-002 → CHK-007 (stale statements after a correction, third occurrence). The required rechecks are listed in each finding. CHK-005 (pass-002 F-004) now passes.

Result `findings`. Coverage Summary: 48 checks, 38 matched, 9 mismatch, 0 not checked, 1 not applicable. Unresolved blocked scope is zero. Findings: F-001 medium; F-002..F-004 low and not cosmetic; F-005..F-007 low and cosmetic. The Stage 7 Low-cosmetic closing exception does not apply. There is a Medium finding, and F-001 belongs to a never-cosmetic class (incorrect roles or security). This pass creates no backlog.

The process returns to **Stage 6** for F-001..F-007 under the [return and correction protocol](README.md#return-and-correction-protocol). No finding needs a deliberate channel or design-system change (Stage 5). No finding exposes a parity-map defect (Stage 1): rows 48, 76, 81 and 109-111 are clear, and the defects are in the drawings and records. The waiver content is verified, but Stage 7 cannot close without a `clean` pass that verifies it. The next gate is a new Stage 7 pass by another eligible fresh reviewer on the corrected export set version. Stage 8 cannot close on this export set.

<a id="read-error-prevention"></a>

## Error Prevention

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `8a15e08c98b63b86c881d172ba34ca55e7edeab00cc4d229a90be2664842a90b`. It is unchanged since passes 001 and 002, and none of their learning proposals was added.
- Author self-check record/version: no Stage 6 self-check record is in the pinned artifacts. The status says "all exported views pass the author accessibility check", but no record of that check is in the pinned tree. Its absence is not proof that the checklist was not read.

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-002; permission representation | option C cites D-001/D-011 (manifest, normalization) | partly failed: projects-list/project-editor pass (C-013); person-editor row 48 fails (C-014) | F-001; recheck all hide-gated controls |
| CHK-005; validation and required marking | not recorded | passed (C-019) | none |
| CHK-006; delete confirmations | not recorded | passed: task and note delete dialogs name the effect (C-025) | none |
| CHK-007; status after a correction | not recorded | failed again (C-021) | F-002 |
| CHK-009; evidence written by this review | not applicable to the author | passed (Interaction Log) | none |
| CHK-001, CHK-003, CHK-004, CHK-008, CHK-010, CHK-011, CHK-012 | - | not applicable: no source-line, side-effect, locale, query, link-parameter, unauthenticated-surface or request-sink claim is made or reviewed at Stage 7 | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 7 pass 003, this report version; checklist `8a15e08c…a90b`. CHK-009 passed for my evidence. I applied CHK-007 to my own figures, and every figure comes from script output in this session: 48/38/9/0/1 (recounted from the table); 120 hashes; 52 derived and 7 API views; 46 identical, 2 noise and 4 CDN renders; 11 phone reflows; 22 variants and 25 kit sections; 56 skip links; residual classes 17/6/5/19. Line numbers come from numbered reads of the cited files.
- **Learning update (proposals for the coordinator; not edits to the table):**
  1. A refinement of CHK-002: when a permission is made conditional on one screen, search the map for every row that names the same permission (here "hide" in rows 48, 76 and 81) and apply the same representation to each control (F-001).
  2. A refinement of CHK-007, recurring for the third time: after adding or relabelling exports, recount the views and files that the catalogue states, and compare each provenance phrase in the catalogue with the manifest labels (F-002).
  3. A possible new check, "Self-contained exports": a pinned export must not depend on a remote, unversioned resource for its rendering; a re-render with the network blocked must reproduce the pinned image (F-004).

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: dependency graph review belongs to Stages 10 and 16. This Stage 7 pass reviews the prototype record only.

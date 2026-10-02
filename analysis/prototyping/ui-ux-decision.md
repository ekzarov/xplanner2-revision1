# Stage 5 Decision - Application Form and Style (xplanner2-revision1)

**Which application form and visual baseline did the owner choose, and which choices remain open?**

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Recorded state, not a whole-project verdict**
>
> approved by the owner for the foundation "Material Lean" (one responsive web application, light minimalist Material with Jira-like compactness) and permission to prepare Stage 6 prototypes only; no screen, component variant or sample function is approved
>
> **Details:** [Decision Boundary](#read-decision-boundary) / [Decision](#read-decision).
>
> **Scope:** this record only. Formatting is not a new review or approval.

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Evidence Presented](#read-evidence-presented)
  - [Channels And Scenarios From The Map](#read-channels-and-scenarios-from-the-map)
- [Application Form](#read-application-form)
- [Shared UI Foundation](#read-shared-ui-foundation)
- [Style](#read-style)
- [Color Scheme](#read-color-scheme)
- [Accessibility Recommendations](#read-accessibility-recommendations)
- [Options Considered](#read-options-considered)
- [Decision Boundary](#read-decision-boundary)
- [Open Decisions And Changes](#read-open-decisions-and-changes)
- [Decision](#read-decision)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- **Created by:** UX Designer (responsible author), assignments UX-005-01 (proposal 1) and UX-005-03 (owner decision record), Claude Code subagents of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. Skill [`.agents/skills/migration-ux/SKILL.md`](../../.agents/skills/migration-ux/SKILL.md), blob `1e1bbbce0240158f5e8ab696934a1f6217f948f7`.
- **Maintained / decided by:** UX proposes and records; the owner `ekzarov` decides. UX grants no approval; this record writes down the owner's own choice.
- **Governing instructions:** [Stage 5 in the methodology](../migration_methodology.md#stage-05), [the shared UI procedure](ui-design-system-guide.md#stage-5-choose-the-foundation), [the template](templates/ui-ux-decision-template.md) and [MIGRATION.md Keep Work Focused](../../MIGRATION.md#keep-work-focused).

<a id="read-metadata"></a>

## Metadata

- Date: `2026-10-02`
- Approved by: `ekzarov` (owner), personal choice relayed by Codex, the coordinating operator. This is the owner's decision, not Codex's, and not a continuation of the expired Stage 4 mandate.
- Owner's exact words: «Поехали. Мне нравится»
- Recorded: `2026-10-02T20:21:59Z` (UTC from code at write time, UX-005-03). The exact time of the owner's chat message is unknown to PM; this is the relay recording time.
- Design baseline scope: the whole project, first design baseline (no earlier Stage 5 decision exists)
- Decision version: 1 (foundation "Material Lean"). Proposal 1 (UX-005-01: utilitarian style, palettes P1/P2/P3, Alternative C, dark theme, two densities; digest `c41526e0bfc4d3afc674f6f722968f35aedab8bcbe09a2a79ff9dda23d9c7c21`) was not selected and remains as history below.
- Request before the choice (relayed): «Выберите лучше типа материал дизайн но минималистично ... серо белый и голубой для праймари ... Зеленый ... для завершающих действий ... Может джира ... Решай. После твоего решения дай мне палитру и все остальное я гляну и скажу». Codex then showed one proposal, "Material Lean" with Jira-like work-screen density (no brand copying), and a large Google Stitch sample of it.
- Entry authorization (unchanged): «Отлично. Давай переходим к шагу 5», relayed by Codex on `2026-10-02`; entry only.
- Status: approved by the owner for the foundation "Material Lean" and permission to prepare Stage 6 prototypes only; no screen, component variant or sample function is approved (scope in [Decision](#read-decision))

<a id="read-evidence-presented"></a>

## Evidence Presented

- Applicable parity-map rows: all 210 business rows of UF-001..UF-018 in [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (header on row 6, sheet `User Flows`; SHA-256 `e1478eddada79b574268905cb5d2a7d2412336896cdd0f872398af7d37b264a6` at reading). Read with exceljs from the analysis tools dependencies; not edited. Decision notes in column J count keep 65, change 80, do-not-port 34, defer 31, which matches the Stage 4 record.
- Owner constraints: [Stage 4 decisions D-001..D-025](../stages/stage-04/stage-04-requirements-revision.md#read-decisions), [modernization suggestions M-01..M-07](../stages/stage-04/stage-04-requirements-revision.md#read-modernization-suggestions), [delivery-slice implications](../stages/stage-04/stage-04-requirements-revision.md#read-delivery-slice-implications) and the [Developer Technical Assessment](../stages/stage-04/stage-04-requirements-revision.md#read-developer-technical-assessment) (SHA-256 of the record `d6636e86…dbfc`). These are Codex's delegated decisions, not a personal owner approval; this record does not reopen them.
- Constraints that shape the form and style:
  - D-025 and M-01: WAP is not ported; mobile access is a responsive web capability.
  - D-010: English first; other languages deferred.
  - D-019 and M-07: print-friendly capability; the page-width toggle is not ported (superseded by M-01).
  - D-001..D-005: security fixes are server-side rules. The UI shows only what the user may do and plain error pages; it adds no security-themed visuals.
  - D-022, D-023, D-024, D-021: SOAP, external REST, iCal and MPX/MSPDI are deferred and are not UI channels now.
- Roles (UF-002): viewer, editor and admin per project, and the system administrator (a role on project 0 that applies to all projects); unauthenticated visitors see only sign-in. D-001 keeps the roles but rejects an automatic linear hierarchy; the exact permission matrix is an SDD item. The UI therefore must not encode a role ladder visually.
- Sample shown to the owner (evidence of what was shown, not an approved kit): Google Stitch project `projects/16830600762454043346` "Foundation sample - Material Lean (Stage 5)"; thumbnail SHA-256 `0dfefb80c36f67c0f1d6e44e7241b3d0c36c90b5a0a97b7878a813c3231c189a`; large version of the same Stitch asset (`=w1600`, no retouching, obtained by Codex) SHA-256 `587e2ed10836c5b159eac4f51699bc402658f32f4bb0fa6d3b4efad29ef19631`. Local copies are working files, not committed. The large version shows the chosen swatches, type scale, button matrix, input states and a 40px row reference. Not approved deviations in it: invented domain texts (for example a sprint heading, issue keys, story points with a Fibonacci rule, a sprint assignee with a sample address, "sprint sign-off"), a sample task table with invented rows and statuses, a "Theme Archetype" panel, "Create issue"/"Delete issue" icon variants, a 12px meta label style and a 1px focus offset.

<a id="read-channels-and-scenarios-from-the-map"></a>

### Channels And Scenarios From The Map

| Use case | Legacy channel | Target channel after Stage 4 | Main UI scenarios (keep or change) |
|---|---|---|---|
| UF-001 Authentication & Session | web | web | sign-in, rejection messages, return to requested page, sign-out, idle expiry; remember-me and directory login deferred |
| UF-002 Authorization & Roles | web | web | actions shown per permission, per-project role assignment in the person editor |
| UF-003 People Management | web, mail | web | people list, person page, create, edit, password change, deactivation; import deferred |
| UF-004 Platform, Administration & Errors | web | web (minimal) | generic error page with reference, real not-found, system information for system administrators only |
| UF-005 Projects | web | web | list, create, edit, view, hide, confirmed delete |
| UF-006 Iterations | web | web | iteration stories list, reorder, move, start, close and carry-over, all tasks grouped by story, statistics charts, accuracy, read-only task board |
| UF-007 User Stories | web | web | create, edit, view, delete, move, continue |
| UF-008 Tasks | web, mail | web, mail | create, edit, complete, reopen, delete, move, continue, re-estimate; task-change mail to the current assignee |
| UF-009 Time Tracking & Timesheets | web | web | multi-row time entry grid with validation, personal and aggregate timesheets |
| UF-010 Notes, Attachments & Files | web | web | notes on objects; attachments deferred |
| UF-011 Search, Navigation & History | web | web, print | header search, jump by ID, breadcrumb, history, my status page, description formatting, print-friendly view |
| UF-012 Continuous Integration Queue | web | none (do-not-port) | none |
| UF-013 Notifications & Scheduled Jobs | mail, jobs | mail, jobs (no UI) | daily burn-down data; reminders and leads report deferred |
| UF-014 Export & Reports | web, files | web, files | permitted project and iteration export, printable/PDF output |
| UF-015 SOAP Web Service API | SOAP | deferred | none now |
| UF-016 REST/JSON API | REST | internal API for the board only | external REST deferred |
| UF-017 iCalendar Feed | iCal | deferred | none now |
| UF-018 Mobile (WAP) Access | WAP | none; covered by responsive web (M-01) | none |

**Reading of the map:** every kept or changed scenario that a person performs lives in the web channel. Mail is an outbound notification, not an interactive channel. The remaining legacy channels are deferred or not ported. The core slice (sign-in, project, iteration, story, task, time entry, timesheet) is list-, table- and form-heavy.

<a id="read-application-form"></a>

## Application Form

- Channels (selected): one responsive web application for desktop and phone, plus two non-interactive outputs that follow the same visual rules: a print stylesheet (M-07) and plain task-change mail (D-017).
- Primary channel (selected): the responsive web application in current desktop and mobile browsers.
- Channel-specific responsibilities:
  - **Desktop and wide screens:** full planning and administration; dense tables and multi-row editing.
  - **Phones and narrow windows:** the same application and URLs, reflowed, with 44-48px touch targets; wide tables use priority columns and contained horizontal scrolling, not a separate mobile product.
  - **Print:** no navigation, black text on white, table headers repeated per page.
  - **Mail:** plain, readable text with a link back to the task.
- Not chosen: a native mobile app, a desktop app, a WAP or other mobile-specific channel, an offline mode.

<a id="read-shared-ui-foundation"></a>

## Shared UI Foundation

- UI foundation SHA-256: `97e04be7b42ba98abd8b7df2afde691c64b80029465d2f763e6ba768801c907b`
- The digest is printed by `node analysis/tools/ui-design-system.js analysis/prototyping/ui-design-tokens.json` for the chosen foundation; recording it is not an approval by itself. Any change to the foundation prints a new digest and returns to Stage 5.
- Catalogue: [`analysis/prototyping/ui-design-system.md`](ui-design-system.md)
- Tokens: [`analysis/prototyping/ui-design-tokens.json`](ui-design-tokens.json)
- Owner foundation decision: "Material Lean", chosen by `ekzarov` («Поехали. Мне нравится»), relayed by Codex, recorded `2026-10-02T20:21:59Z`; scope and exclusions in [Decision](#read-decision).
- Pending library/platform compatibility: the component source is a framework-neutral catalogue in a Material-inspired style; no Material library is selected. The implementation library is chosen at Stage 9 and must map these tokens exactly. Icons: Lucide; icon-only only for familiar tool actions (for example undo, redo, zoom) with an accessible name and a tooltip; business commands (for example Close iteration, Continue story, Move task) are labeled with text. Fonts are the operating system's own, so no font files are downloaded or hosted.

Stage 6 elaborates used variants within this foundation. Dates, autocomplete, selects, tables and dialogs are added only when agreed scenarios need them; this decision does not approve unwritten screens, future component variants or a finished kit.

<a id="read-style"></a>

## Style

- Direction (selected): **light minimalist Material ("Material Lean") with Jira-like compactness**, no brand copying. Flat layout with dividers and background steps; shadows only for overlays; one 6px radius; no decorative imagery, gradients or animated effects; no new functions.
- Navigation (selected): top bar, breadcrumbs below it (kept from UF-011) and local tabs within a project or iteration. No permanent side bar.
- Density (selected): one density. Desktop controls 36px, table rows 40px, phone touch targets 44-48px, a 4px spacing scale. No density switch.
- Type (selected): system font stack, body 16px, table text 14px.
- Action colors (selected): Save and Create blue (primary); Complete task green (completion); Cancel, Edit, Move and Reopen neutral; Delete danger with confirmation. Closing an iteration with consequences requires confirmation and is not shown as an unconditional success.
- References: Material Design (minimal reading), Atlassian/Jira work-screen density; described in words, nothing copied or downloaded. History: proposal 1 also cited GitHub Primer and IBM Carbon for the utilitarian direction (not selected).

<a id="read-color-scheme"></a>

## Color Scheme

- Palette (selected, light theme only): surface `#FFFFFF`, page background `#F7F8FA`, table header `#F1F2F4`, text `#1D2125`, secondary text `#626F86`, control border `#8590A2`, decorative divider `#DCDFE4`.
- Accent colors (selected): primary `#0C66E4` (hover `#0055CC`), selected `#E9F2FF`, completion `#1F7A45` (hover `#166038`, tint `#E3FCEF`), danger `#C9372C`. Labels on primary, completion and danger fills are white; the focus ring uses the primary color.
- Theme modes (selected): light only. No dark mode in the first demo; a dark theme is possible later but not approved and would return to Stage 5.

**Computed WCAG 2.2 contrast ratios** (relative luminance per WCAG 2.x, truncated to two decimals; one Node script over the exact values; a calculation of colors, not a claim about a finished UI):

| Pair | Minimum | Ratio | Result |
|---|---|---|---|
| text on surface / page / table header / selected / completion tint | 4.5 | 16.19 / 15.24 / 14.45 / 14.35 / 14.99 | pass |
| secondary text on surface / page / table header | 4.5 | 5.07 / 4.77 / 4.53 | pass |
| secondary text on selected | 4.5 | 4.49 | **fail**: not used there (rule below) |
| primary (link) on surface / page / table header / selected | 4.5 | 5.20 / 4.89 / 4.64 / 4.61 | pass |
| white on primary / primary hover | 4.5 | 5.20 / 6.62 | pass |
| white on completion / completion hover | 4.5 | 5.34 (5.346) / 7.59 | pass |
| white on danger | 4.5 | 5.16 | pass |
| danger text on surface / page | 4.5 | 5.16 / 4.85 | pass |
| completion text on surface / completion tint | 4.5 | 5.34 / 4.94 | pass |
| control border on surface / page | 3 | 3.22 / 3.03 | pass |
| control border on table header / selected | 3 | 2.88 / 2.85 | **fail**: controls keep a white fill there (rule below) |
| focus ring (primary) on surface / page / table header / selected | 3 | 5.20 / 4.89 / 4.64 / 4.61 | pass |
| invalid border (danger) on surface | 3 | 5.16 | pass |
| divider on surface | none (decorative) | 1.33 | not a control boundary; carries no meaning |
| selected / completion tint on surface | none (supporting only) | 1.12 / 1.08 | state also shown by text, checkbox or weight |

Usage rules that keep the two failing pairs out of the UI: text on a selected row uses the main text color, not secondary text; inputs, checkboxes and neutral buttons keep a white fill, so their border meets the white inside (3.22:1) and is never the only boundary drawn on the table header or a selected row. Stage 7 checks the rendered result.

History (not selected): proposal 1 offered P1 Slate Blue, P2 Warm Teal and P3 Civic Contrast with light and dark themes; their values and 102-pair contrast table are in this file at revision `bd73654`.

<a id="read-accessibility-recommendations"></a>

## Accessibility Recommendations

Target (selected, mandatory): WCAG 2.2 level AA for every screen, verified on the target, not inferred from the tokens.

- **Contrast:** the figures above; text at least 4.5:1, control boundaries, focus indicators and chart marks at least 3:1. Disabled controls stay legible and say why an action is unavailable where that helps.
- **Focus:** a visible 2px focus outline on every interactive element, never removed (SC 2.4.7). Sticky headers, the top bar and dialogs must not cover the focused element (SC 2.4.11). Focus returns to the triggering control after a dialog or menu closes.
- **Keyboard:** every action works by keyboard in a logical order, with a "skip to content" link and no keyboard traps (SC 2.1.1, 2.1.2). No single-character shortcuts (SC 2.1.4). Story reordering and moving (UF-006) need a non-drag alternative (SC 2.5.7).
- **Targets:** desktop controls 36px; on touch screens 44-48px; never below 24 by 24 CSS px (SC 2.5.8).
- **Text size:** body 16px and table text 14px, in rem so that browser text settings apply; layout survives 200% text (SC 1.4.4), 400% zoom and a 320 CSS px width without page-level horizontal scrolling (SC 1.4.10; wide tables scroll inside their own container), and text-spacing overrides (SC 1.4.12). Leave room for about 30% longer labels for the deferred languages.
- **Motion:** only short state transitions, none required to understand a change; `prefers-reduced-motion` turns them off.
- **Status:** task, story and iteration states are written in text, optionally with an icon, never by color alone (SC 1.4.1); completion green and the selected tint only support the text.
- **Form errors:** labels always visible, required fields marked in text, errors named per field in text with a fix suggestion (SC 3.3.1, 3.3.3), and an error summary after a failed save. Date and number fields state the expected format and reject impossible values with a message instead of changing them (D-010). Entered values are kept after an error (SC 3.3.7).
- **Sign-in:** the password field allows paste and password managers (SC 3.3.8); the kept rejection messages stay as decided in D-003.
- **Confirmation:** Delete, and closing an iteration with consequences, ask for confirmation that names what will happen, with focus on the safe choice (D-011, T-02).
- **Language and print:** the page language is declared (English first); the print view keeps the same content order and contrast.

<a id="read-options-considered"></a>

## Options Considered

| Option | Benefits | Costs or risks | Owner decision |
|---|---|---|---|
| **"Material Lean"** (Codex proposal shown with the Stitch sample): one responsive web application; light minimalist Material with Jira-like compactness; gray-white with a blue primary and green for completing actions | Matches the owner's request; one code base and URLs for desktop and phone (D-025/M-01, M-07); 40px rows keep tables dense; clear action colors | Light only and one density in the first demo; Material look must stay minimal to avoid card-and-shadow weight | **selected** |
| Proposal 1 main recommendation: same form, utilitarian productive style, palette P1, 32px compact rows | Densest tables | Not what the owner asked for | rejected (not selected; history) |
| Alternative C: spacious Material-like style (large targets, cards, elevation) | Familiar, phone-friendly | About 52px rows; heavy for list work | rejected (not selected; history) |
| Palettes P1 Slate Blue / P2 Warm Teal / P3 Civic Contrast | See revision `bd73654` | See revision `bd73654` | rejected (not selected; history) |
| Dark theme in the first demo | Preference-based comfort | Doubles the color set to check | rejected for the first demo (possible later; not approved) |
| Comfortable-density option | User choice of spacing | Second set of sizes to design and test | rejected for the first demo (possible later; not approved) |

Comparisons outside the approved scope, unchanged and not selectable: Alternative A (desktop-first web with separate mobile pages) and Alternative B (installable PWA with offline time entry). Each would need a separate requirement and decision (D-025, M-01; no offline requirement in Stage 4).

<a id="read-decision-boundary"></a>

## Decision Boundary

| Topic | Agent proposal / alternatives | Explicit owner choice | State | Owner / date / decision evidence |
|---|---|---|---|---|
| Stage 5 entry | Prepare decision material only | «Отлично. Давай переходим к шагу 5» (entry only) | entry authorized | owner `ekzarov`, relayed by Codex, `2026-10-02`; [`migration_status.yaml`](../migration_status.yaml) transition stage-04 to stage-05 |
| Channels and application form | Responsive web primary, print and mail as outputs (A and B out of scope) | one responsive web application for desktop and phone; print and mail are outputs | selected | `ekzarov`, «Поехали. Мне нравится», relayed by Codex, recorded `2026-10-02T20:21:59Z` |
| Style | Utilitarian productive / Alternative C (proposal 1); "Material Lean" (Codex) | "Material Lean": light minimalist Material, Jira-like compactness, flat, shadows only for overlays, top bar + breadcrumbs + local tabs | selected; utilitarian and Alternative C not selected | as above |
| Palette | P1 / P2 / P3 (proposal 1); "Material Lean" palette | "Material Lean" palette in [Color Scheme](#read-color-scheme), with the action color rules | selected; P1, P2, P3 not selected | as above |
| Theme modes | Light default plus dark (proposal 1) | light only for the first demo | selected; dark not selected (possible later) | as above |
| Density, type and icons | Compact plus comfortable (proposal 1); one compact density | one density: 36px controls, 40px rows, 44-48px touch, 4px scale, 6px radius; system fonts, body 16px, table 14px; Lucide under the icon rule | selected; comfortable option not selected | as above |
| Accessibility baseline | WCAG 2.2 AA with the recommendations | WCAG 2.2 AA, visible focus, full keyboard, 200% text, clear form errors, status not by color alone | selected (mandatory) | as above |
| Prototyping tool | Google Stitch | Google Stitch is the main prototyping tool (owner's earlier words «Используйте ститч от Гугла»); only an anonymized necessary design brief goes to Stitch | selected | owner `ekzarov`, relayed by Codex |
| Stage 6 | Prepare prototypes after the choice | permission to continue preparing prototypes | permitted | as above; the stage transition itself is recorded by PM |
| UI foundation | Proposal 1 digest `c41526e0…7c21` (not selected) | foundation digest `97e04be7…907b` | selected | as above; pin in [Shared UI Foundation](#read-shared-ui-foundation) |

<a id="read-open-decisions-and-changes"></a>

## Open Decisions And Changes

| Topic | Unresolved question or baseline change | Required decision maker | Next action | Blocks Stage 6 |
|---|---|---|---|---|
| Baseline change | Proposal 1 (digest `c41526e0…7c21`) to decision version 1 "Material Lean" (digest `97e04be7…907b`) | owner (done) | none | no |
| Supporting foundation values | Values not named in the relayed choice but needed to apply it: headings 24px and 20px, weights 400 and 600, body line height 1.5, white labels on fills, focus ring 2px in primary at 2px offset. All except the offset match the shown sample; the sample shows a 1px offset, kept at 2px for visibility | owner, at the Stage 8 review of the screens | PM shows them with the Stage 6 screens; a change returns to Stage 5 | no: they follow the chosen style and the mandatory focus rule |
| Further controls and extension tokens | Dates, autocomplete, selects, tables, dialogs, navigation variants, breakpoints, overlay shadow, neutral and danger hover | UX at Stage 6; owner at Stage 8 | add only when agreed scenarios need them, as extensions | no |
| Library and icons | Implementation library and Lucide compatibility | Architect, Stage 9 | Stage 9 check; a foundation change returns to Stage 5 | no |
| Stitch brief content | Only an anonymized necessary design brief goes to Stitch (no source, WAR, credentials, logs or personal data); no hand-drawn HTML presented as Stitch output | UX and PM | apply at Stage 6 | no |

<a id="read-decision"></a>

## Decision

The owner `ekzarov` chose the shown foundation "Material Lean" with the words «Поехали. Мне нравится», relayed by Codex; recorded `2026-10-02T20:21:59Z` (relay recording time; the chat time is unknown to PM). Reason, as relayed: the owner asked for a minimalist Material look, gray-white with a blue primary and green for completing actions, possibly Jira-like, and liked the proposal and Stitch sample shown.

**Covered:** one responsive web application for desktop and phone (print and mail are outputs); the style, palette, action color rules, type, metrics, icons and accessibility baseline above, as encoded in the foundation pinned by `UI foundation SHA-256` above; Google Stitch as the main prototyping tool; permission to continue preparing prototypes (Stage 6).

**Not covered:** the old P1/P2/P3 palettes and Alternative C (history, not selected); any invented text, role, task row, Fibonacci estimation, sprint sign-off or other function shown in the Stitch sample; future component variants; dates, autocomplete, selects, tables or dialogs beyond what agreed scenarios need; a dark theme or density switch. Stage 4 scope is unchanged.

This is a human decision. Stage 6 uses this foundation; screens and variants still need the Stage 7 review and the owner's Stage 8 approval.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). Record actual checking, not a copied claim from an earlier attempt.

- **Self-check:** Stage 5, UX-005-03, decision version 1; checklist [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) blob `dbc323ccbe4b05c70357c4a2ccef75063bf645e6`.
  - CHK-007 (figures match the current artifact): passed. The digest was printed by the tool from the current tokens; `validateTokens` reported no errors; `node --test analysis/tools/ui-design-system.test.js` passed 22 of 22; every contrast figure comes from one Node run over the exact values shown. The parity-map counts are unchanged from proposal 1 (map not edited since).
  - CHK-009 (credential values never reproduced): passed. No sign-in values were read or copied; the sample's fictional address is not reproduced.
  - CHK-001..CHK-006, CHK-008, CHK-010..CHK-012: not applicable; no new claim about legacy behavior, permissions, queries, locales or request handling.
- **Learning update:** no qualifying new check.

Independent reviewers propose changes here without editing the shared table. This note does not replace the required independent review, human decision or stage evidence.

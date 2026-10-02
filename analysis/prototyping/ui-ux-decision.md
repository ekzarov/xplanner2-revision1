# Stage 5 Decision - Application Form and Style (xplanner2-revision1)

**Which application form and visual baseline did the owner choose, and which choices remain open?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Recorded result: incomplete or conditional**
>
> pending owner decision
>
> **Details:** [Options Considered](#read-options-considered) / [Decision](#read-decision).
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

- **Created by:** UX Designer (responsible author), assignment UX-005-01, a Claude Code subagent of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. Skill [`.agents/skills/migration-ux/SKILL.md`](../../.agents/skills/migration-ux/SKILL.md), blob `1e1bbbce0240158f5e8ab696934a1f6217f948f7`.
- **Maintained / decided by:** UX proposes; the owner `ekzarov` chooses. Nothing in this record is selected: every choice below is an agent proposal until the owner gives a new, explicit Stage 5 decision.
- **Governing instructions:** [Stage 5 in the methodology](../migration_methodology.md#stage-05), [the shared UI procedure](ui-design-system-guide.md#stage-5-choose-the-foundation), [the template](templates/ui-ux-decision-template.md) and [MIGRATION.md Keep Work Focused](../../MIGRATION.md#keep-work-focused).

<a id="read-metadata"></a>

## Metadata

- Date: `2026-10-02` (prepared `2026-10-02T19:18:52Z`, UTC from code)
- Approved by: not approved; the owner decision is pending
- Design baseline scope: the whole project, first design baseline (no earlier Stage 5 decision exists)
- Decision version: proposal 1 (UX-005-01); no decision version yet
- Revision before handoff: `2026-10-02T19:22:34Z` (UTC from code), two clarifications from Codex relayed by PM: the icon rule, and Alternatives A and B shown only as comparisons outside the approved scope. Codex approves neither the style, nor P1, nor any other option.
- Entry authorization: the owner's words, relayed by Codex on `2026-10-02`: «Отлично. Давай переходим к шагу 5». This authorizes entering and preparing Stage 5 only. It approves no form, style, palette, UI foundation, wireframe or Stage 6.
- Status: pending owner decision
- Drafts prepared with this proposal: [`ui-design-system.md`](ui-design-system.md) and [`ui-design-tokens.json`](ui-design-tokens.json), both drafts awaiting the owner's selection.

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

**Reading of the map:** every kept or changed scenario that a person performs lives in the web channel. Mail is an outbound notification, not an interactive channel. The remaining legacy channels are deferred or not ported. The core slice (sign-in, project, iteration, story, task, time entry, timesheet) is list-, table- and form-heavy: the time entry grid, the iteration story table and the timesheets are the densest views.

<a id="read-application-form"></a>

## Application Form

- Channels (proposed): responsive web application, plus two non-interactive outputs that follow the same visual rules: a print stylesheet (M-07) and plain task-change mail (D-017).
- Primary channel (proposed): responsive web application in current desktop and mobile browsers.
- Channel-specific responsibilities (proposed):
  - **Desktop and wide screens:** full planning and administration; dense tables and multi-row editing (time entry grid, story ordering, aggregate timesheet).
  - **Phones and narrow windows:** the same application and URLs, reflowed: look up projects, iterations, stories and tasks; record and correct own time; view own timesheet; complete or reopen tasks. Wide administrative tables stay usable through priority columns and contained horizontal scrolling, not through a separate mobile product.
  - **Print:** a print stylesheet for lists, timesheets and story or task details: no navigation, black text on white, table headers repeated per page.
  - **Mail:** plain, readable text with a link back to the task; no application styling is required beyond the product name and clear structure.
- Not proposed: a native mobile app, a desktop app, a WAP or other mobile-specific channel, an offline mode.

<a id="read-shared-ui-foundation"></a>

## Shared UI Foundation

- UI foundation SHA-256: pending owner selection
- Proposed foundation digest (proposed; not selected): `c41526e0bfc4d3afc674f6f722968f35aedab8bcbe09a2a79ff9dda23d9c7c21`, printed by `node analysis/tools/ui-design-system.js analysis/prototyping/ui-design-tokens.json` for the draft tokens (main recommendation, palette P1). It becomes the pin only if the owner selects this exact foundation; a changed draft prints a new digest.
- Catalogue: [`analysis/prototyping/ui-design-system.md`](ui-design-system.md) (draft)
- Tokens: [`analysis/prototyping/ui-design-tokens.json`](ui-design-tokens.json) (draft)
- Owner foundation decision: pending
- Pending library/platform compatibility: the component source is a framework-neutral catalogue; the implementation library and its theming are chosen with the architecture at Stage 9 and must map these tokens exactly. Proposed icon set: Lucide (open-source), subject to the owner's choice and Stage 9 compatibility. Icon rule: familiar tool actions (for example undo, redo, save, zoom) may be icon-only buttons with an accessible name and a tooltip; unfamiliar or business commands (for example Close iteration, Continue story, Move task) use text, or an icon with text. Fonts are the operating system's own UI and monospace fonts, so no font files are downloaded or hosted.

The owner chooses semantic colors and themes, typography, spacing and geometry, responsive and accessibility rules, component source and icons. Stage 6 elaborates used variants within the chosen foundation; this decision does not approve unwritten screens or a finished component kit.

<a id="read-style"></a>

## Style

- Direction (proposed): **utilitarian, productive and calm.** Neutral surfaces, one blue action color, flat layout with 1px dividers instead of cards and shadows, small radius (4px controls), one overlay elevation for dialogs and menus. Content is the interface: dense but readable tables, short labels, left-aligned forms, numbers right-aligned in tabular figures. No decorative imagery, gradients or animated effects.
- Navigation (proposed): a slim top bar (product name, project switcher, search with jump by ID, user menu with sign-out), the breadcrumb below it (kept from UF-011), and local tabs or section links within a project or iteration. No permanent side bar, so wide tables keep the full width.
- Density (proposed): two densities from the same tokens: compact (32px rows and controls) as the default for tables on desktop, comfortable (40px) as a user option, and 44px touch targets automatically on coarse pointers.
- References considered (described in words; nothing downloaded):
  - **GitHub Primer:** neutral grays, blue links and actions, dense lists and issue tables; it shows that a calm developer tool reads well at 14px table text.
  - **IBM Carbon (productive mode):** data tables with selectable row heights, an 8px spacing scale, clear focus outlines and strict form validation patterns.
  - **Atlassian Design System (Jira lists and boards):** work-tracking views with status lozenges that combine text and color, close to XPlanner's stories, tasks and boards.

<a id="read-color-scheme"></a>

## Color Scheme

Three candidate palettes are proposed. Values are this proposal's own, chosen to meet WCAG 2.2 AA in both themes; the references describe the character only. The draft tokens use **P1**; selecting P2 or P3 changes only the color tokens and the digest.

| Palette | Character | Light theme | Dark theme | References |
|---|---|---|---|---|
| **P1 Slate Blue** (recommended, in the draft) | Neutral, cool and familiar; the least surprising look for a developer planning tool | surface `#FFFFFF`, subtle `#F3F5F7`, text `#1B232D`, muted `#55606C`, action `#0A5BC4`, focus = action | surface `#12161C`, subtle `#1A2029`, text `#E6EBF1`, muted `#A5B0BC`, action `#6EA8FF`, focus `#8EBBFF` | GitHub Primer, IBM Carbon |
| **P2 Warm Teal** | Warmer and softer; a teal action with an amber focus ring that stands apart from every action color | surface `#FFFFFF`, subtle `#F6F5F2`, text `#24211D`, muted `#5D5953`, action `#0B6A6E`, focus `#A9540A` | surface `#1A1917`, subtle `#23221F`, text `#EDEBE7`, muted `#B1ACA4`, action `#5CC6C0`, focus `#FFB26B` | Atlassian Design System, Microsoft Fluent 2 neutrals |
| **P3 Civic Contrast** | Maximum legibility: near-black text, black control borders, a yellow focus fill with a black outline | surface `#FFFFFF`, subtle `#F3F2F1`, text `#0B0C0C`, muted `#4B5357`, action `#1A65A6`, focus `#0B0C0C` outline on `#FFDD00` fill | surface `#0F1011`, subtle `#1C1E1F`, text `#F3F2F1`, muted `#B9BDBF`, action `#8CC2F0`, focus `#FFDD00` | GOV.UK Design System, U.S. Web Design System |

Status colors per palette (light / dark): P1 danger `#B3261E` / `#FF8A80`, success `#1A7034` / `#5FD38A`, warning `#8A5300` / `#E8B04B`; P2 danger `#B42318` / `#FF8B7E`, success `#2B6E2F` / `#7BD48D`, warning `#8A5500` / `#F0B65A`; P3 danger `#AA2A16` / `#FF9580`, success `#00703C` / `#62D69A`, warning `#7A4A00` / `#F2C14E`. Status is never shown by color alone.

Theme notes:

- **P1:** the dark theme lightens the action blue and gives buttons dark labels; the selected-row tint is visible against the surface in both themes, but selection is also marked by a checkbox and a 2px action-colored left bar, because the tint alone is below 3:1.
- **P2:** the amber focus ring is the most visible of the three, at the cost of a second accent; the warm grays look less technical.
- **P3:** the reference systems are light-only; this dark theme is our own derivation. The yellow fill alone is only 1.34:1 against white, so the light focus indicator relies on the black outline (14.54:1 against the yellow). Black control borders make dense forms look heavier.

**Computed WCAG 2.2 contrast ratios** (relative luminance per WCAG 2.x, truncated to two decimals; 4.5:1 for text, 3:1 for control boundaries and focus indicators under SC 1.4.11):

| Pair | Minimum | P1 light | P1 dark | P2 light | P2 dark | P3 light | P3 dark |
|---|---|---|---|---|---|---|---|
| text / surface | 4.5 | 15.85 | 15.13 | 16.02 | 14.75 | 19.58 | 17.03 |
| text / selected row | 4.5 | 13.54 | 11.77 | 13.76 | 10.35 | 18.00 | 11.18 |
| muted text / table header | 4.5 | 5.86 | 7.43 | 6.37 | 7.05 | 7.02 | 8.84 |
| link / surface | 4.5 | 6.35 | 7.52 | 6.36 | 8.61 | 6.07 | 10.05 |
| link / selected row | 4.5 | 5.42 | 5.85 | 5.46 | 6.04 | 5.58 | 6.60 |
| button label / action | 4.5 | 6.35 | 7.22 | 6.36 | 7.97 | 6.07 | 10.34 |
| control border / surface | 3 | 3.95 | 4.51 | 4.08 | 4.35 | 19.58 | 10.06 |
| focus / table header | 3 | 5.81 | 8.34 | 4.86 | 8.96 | 17.51 | 12.42 |
| error text / surface | 4.5 | 6.53 | 7.94 | 6.57 | 7.73 | 6.88 | 8.94 |
| warning text / surface | 4.5 | 6.32 | 9.28 | 6.21 | 9.65 | 7.48 | 11.34 |

All 17 checked pairs pass in all six palette-theme combinations (102 of 102). The full set also covers muted text and links on the surface, hover labels, success text and the destructive button label. Dividers (`#D6DCE2` in P1 light, 1.38:1) are decorative and carry no meaning, so SC 1.4.11 does not apply to them.

- Theme modes (proposed): light as the default, dark from the operating-system preference with a manual switch in the user menu. Owner question: is dark mode wanted in the first slice, or only prepared in the tokens?

<a id="read-accessibility-recommendations"></a>

## Accessibility Recommendations

Target: WCAG 2.2 level AA for every screen, verified on the target, not inferred from the tokens.

- **Contrast:** the figures above; text at least 4.5:1, control boundaries, focus indicators and chart marks at least 3:1. Disabled controls stay legible and say why an action is unavailable where that helps.
- **Focus:** a 2px focus outline with a 2px offset on every interactive element, never removed (SC 2.4.7). Sticky headers, the top bar and dialogs must not cover the focused element (SC 2.4.11, new in 2.2). Focus returns to the triggering control after a dialog or menu closes.
- **Keyboard:** every action works by keyboard in a logical order, with a "skip to content" link and no keyboard traps (SC 2.1.1, 2.1.2). No single-character shortcuts (SC 2.1.4). Story reordering and moving (UF-006) and any future board drag (M-02, deferred) need a non-drag alternative such as move up/down or a position field (SC 2.5.7, new in 2.2).
- **Density and targets:** compact, comfortable and touch densities; every target at least 24 by 24 CSS px (SC 2.5.8, new in 2.2), 44px on touch screens.
- **Text size:** body 16px and table text 14px, all in rem so that browser text settings apply; layout survives 200% text (SC 1.4.4), 400% zoom and a 320 CSS px width without page-level horizontal scrolling (SC 1.4.10; wide data tables scroll inside their own container, which the criterion allows), and user text-spacing overrides (SC 1.4.12). Layouts leave room for about 30% longer labels so that the deferred languages do not force a redesign.
- **Motion:** only short state transitions (120-180 ms), none required to understand a change; `prefers-reduced-motion` turns them off; nothing moves, blinks or auto-refreshes on its own.
- **Data tables:** real table markup with a caption, column and row headers, sort state announced (`aria-sort`) and sortable headers as buttons; numbers right-aligned with tabular figures; sorting applies to the whole list (D-011); empty, loading and error states are stated in text (W001-F-20 showed a missing empty state); on phones the key columns stay visible and the rest scroll or collapse into a details row. Charts (UF-006) use direct labels or patterns as well as color and offer the same figures as a table.
- **Status:** task, story and iteration states are shown as text, optionally with an icon, never by color alone (SC 1.4.1).
- **Form errors:** labels always visible (no placeholder-only fields), required fields marked in text, errors named per field in text with a fix suggestion (SC 3.3.1, 3.3.3), and an error summary at the top that links to each field after a failed save. Date and number fields state the expected format, for example an ISO 8601 date such as `2026-10-02`, and reject impossible values with a message instead of silently changing them (D-010; W001-F-21 and W001-F-37 were silent changes). The time entry grid names the row and column of each error. Entered values are kept after an error, so nothing is typed twice (SC 3.3.7).
- **Sign-in:** the password field allows paste and password managers, without a memory or puzzle test (SC 3.3.8, new in 2.2); the kept rejection messages stay as decided in D-003.
- **Confirmation:** destructive actions, especially the project delete that removes owned data including time (D-011, T-02), use a confirmation dialog that names what will be removed and puts focus on the safe choice.
- **Language and print:** the page language is declared (English first); the print view keeps the same content order and contrast and expands object links into readable references.

<a id="read-options-considered"></a>

## Options Considered

Selectable within the current Stage 4 scope: the main recommendation, Alternative C and the three palettes.

| Option | Benefits | Costs or risks | Owner decision |
|---|---|---|---|
| **Main recommendation:** one responsive web application (primary), with print stylesheet and plain mail as outputs; utilitarian productive style; palette P1 | One code base and one set of URLs for desktop and phone; satisfies D-025/M-01 and M-07 directly; dense tables suit planning and time work; lowest design and test cost | Phones get the same information architecture, so the widest admin tables need careful priority columns; no offline use | pending |
| Alternative C: same responsive form, but a spacious Material-like style (large touch targets, cards, elevation, rounded shapes) | Familiar modern look; friendly on phones | Roughly 35-40% fewer table rows per screen (rows of about 52px instead of 32px); cards and shadows add visual weight to list-heavy work; worse fit for the time entry grid | pending |
| Palette P1 Slate Blue | Most familiar for a developer tool; one accent; simplest token set | Least distinctive | pending |
| Palette P2 Warm Teal | Softer look; most visible focus ring | A second accent color to keep consistent | pending |
| Palette P3 Civic Contrast | Highest contrast and plainest look | Heavier black borders in dense forms; the dark theme is not from its references | pending |

**Comparisons outside the approved scope (not selectable at Stage 5).** They show what the main recommendation deliberately does not include. Either one would need a separate requirement and decision; a Stage 5 approval does not imply it.

| Comparison | What it would add | Why it is outside the current scope |
|---|---|---|
| Alternative A: desktop-first web with separate simplified mobile pages (adaptive, two layouts) | A purpose-built phone flow for time entry and task lookup | Stage 4 approved mobile access as a responsive web capability (D-025, M-01), not a second mobile layout; two layouts would also double Stage 6-8 design and test work |
| Alternative B: installable web app (PWA) with offline time entry | Home-screen launch and time entry without a connection | No Stage 4 requirement asks for offline use; offline entry would need its own decisions on synchronization, permission checks for queued changes and conflict handling, and platform work at Stage 9 |

<a id="read-decision-boundary"></a>

## Decision Boundary

The Application Form, Style, Color Scheme and Accessibility sections above are proposals. No owner decision exists yet.

| Topic | Agent proposal / alternatives | Explicit owner choice | State | Owner / date / decision evidence |
|---|---|---|---|---|
| Stage 5 entry | Prepare decision material only | «Отлично. Давай переходим к шагу 5» (entry only) | entry authorized; no design choice | owner `ekzarov`, relayed by Codex, `2026-10-02`; recorded in [`migration_status.yaml`](../migration_status.yaml) transition stage-04 to stage-05 |
| Channels and application form | Responsive web primary, print and mail as outputs (Alternatives A and B are out-of-scope comparisons only) | pending | pending | pending |
| Style | Utilitarian productive / Alternative C | pending | pending | pending |
| Palette | P1 / P2 / P3 | pending | pending | pending |
| Theme modes | Light default, dark by system preference with a switch | pending | pending | pending |
| Density, type and icons | Compact default with comfortable option; system fonts; Lucide under the icon rule (icon-only only for familiar tool actions) | pending | pending | pending |
| Accessibility baseline | WCAG 2.2 AA with the recommendations above | pending | pending | pending |
| UI foundation | Draft tokens, digest `c41526e0…7c21` (proposed; not selected) | pending | pending | pending |

<a id="read-open-decisions-and-changes"></a>

## Open Decisions And Changes

| Topic | Unresolved question or baseline change | Required decision maker | Next action | Blocks Stage 6 |
|---|---|---|---|---|
| Form | Confirm the responsive web application as the primary channel (Alternatives A and B would first need a separate requirement and decision) | owner | owner answers; UX records the decision | yes: a mandatory Stage 5 choice |
| Style | Utilitarian productive, or Alternative C | owner | as above | yes: mandatory |
| Palette | P1, P2 or P3 (the drafts use P1) | owner | if not P1, UX replaces the color tokens and reports the new digest | yes: mandatory |
| Dark mode | In the first slice, or prepared in tokens only | owner | as above | yes: decides which theme Stage 6 must show |
| Density default | Compact by default with a comfortable option, or comfortable by default | owner | as above | no: either fits the tokens; it changes the default only |
| Icons and fonts | Lucide under the icon rule plus system fonts, or text-only with no icon set | owner | as above; library compatibility stays a Stage 9 check | yes: the icon set is part of the foundation |
| Foundation pin | Record `UI foundation SHA-256` only after the owner selects the exact foundation | owner, then UX records | UX re-runs the digest on the selected tokens | yes |

<a id="read-decision"></a>

## Decision

Pending. The owner has authorized Stage 5 entry only. UX recommends the responsive web application with the utilitarian productive style and palette P1, and stops here for the owner's explicit choice of form, style, palette, theme, density and icons. No option is selected, and the drafts are not the approved foundation.

This is a human decision. Stage 6 does not begin until this record is complete and explicitly approved.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). Record actual checking, not a copied claim from an earlier attempt.

- **Self-check:** Stage 5, UX-005-01, proposal 1; checklist [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) blob `dbc323ccbe4b05c70357c4a2ccef75063bf645e6`.
  - CHK-007 (figures match the current artifact): passed. The decision counts (keep 65, change 80, do-not-port 34, defer 31; 210 rows) were recomputed by script from column J of the current map and match the Stage 4 record. All contrast figures come from one script run over the exact hex values shown.
  - CHK-009 (credential values never reproduced): passed. Sign-in is described by behavior only; the factory pair was not read or copied.
  - CHK-001: not applicable; no line numbers are cited as evidence. CHK-002..CHK-006, CHK-008, CHK-010..CHK-012: not applicable; this record makes no new claim about legacy behavior, permissions, queries, locales or request handling.
  - Process note: one scratch command started `python3` with a stdin heredoc. On this machine `python3` resolved to the Windows Store alias and the heredoc hung; PM confirmed that the process had already exited. The work continued with Node only.
- **Learning update:** no qualifying new check. The hang was a tool-invocation error, not an error in a stage result.

Independent reviewers propose changes here without editing the shared table. This note does not replace the required independent review, human decision or stage evidence.

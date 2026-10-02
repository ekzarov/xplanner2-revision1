# UI Design System - xplanner2-revision1 (DRAFT, awaiting the owner's selection)

**Which shared element and variant should each screen use, in which states, and with which approved visual rules?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Recorded result: incomplete or conditional**
>
> draft, proposed; not selected
>
> **Details:** [Components](#read-components) / [Coverage And Open Decisions](#read-coverage-and-open-decisions).
>
> **Scope:** this record only. Formatting is not a new review or approval.

<details>
<summary><strong>Contents</strong></summary>

- [Ownership And Baseline](#read-ownership-and-baseline)
- [Foundation](#read-foundation)
- [Components](#read-components)
- [Layout And Interaction Rules](#read-layout-and-interaction-rules)
- [Coverage And Open Decisions](#read-coverage-and-open-decisions)
- [Review And Change History](#read-review-and-change-history)

</details>
<!-- ARTIFACT_READING_END -->

- **Created by:** UX Designer, assignment UX-005-01, a Claude Code subagent of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, on `2026-10-02`. Skill [`.agents/skills/migration-ux/SKILL.md`](../../.agents/skills/migration-ux/SKILL.md), blob `1e1bbbce0240158f5e8ab696934a1f6217f948f7`.
- **Maintained / decided by:** the Stage 6 prototyping agent after the owner selects a foundation; the owner chooses the foundation at Stage 5 and approves the complete baseline at Stage 8.
- **Governing instructions:** [the shared UI procedure](ui-design-system-guide.md), [Stage 5](../migration_methodology.md#stage-05) and [the template](templates/ui-design-system-template.md).

<a id="read-ownership-and-baseline"></a>

## Ownership And Baseline

- Status: draft, proposed; not selected
- Created by: UX (UX-005-01), `2026-10-02`
- Maintained by: not yet assigned (Stage 6, after the owner's selection)
- Foundation decision: [`ui-ux-decision.md`](ui-ux-decision.md) proposal 1; owner decision pending
- Values: [`ui-design-tokens.json`](ui-design-tokens.json) (draft; main recommendation, palette P1 Slate Blue)
- Proposed foundation digest: `c41526e0bfc4d3afc674f6f722968f35aedab8bcbe09a2a79ff9dda23d9c7c21` (proposed; not selected), printed by `node analysis/tools/ui-design-system.js analysis/prototyping/ui-design-tokens.json`
- Export set: none; no screen manifest, component sheet or wireframe exists at Stage 5
- Approved by: not approved

At Stage 5 this is a proposed foundation with a minimal set of core components for the main flows. It is not a component library for every case. Preview paths name the Stage 6 component sheet that does not exist yet; `audit:prototype` checks them only once a manifest pins that sheet.

<a id="read-foundation"></a>

## Foundation

All values are named tokens in [`ui-design-tokens.json`](ui-design-tokens.json); this section explains their meaning without repeating raw values.

- **Component source and icons:** a framework-neutral catalogue (this file); the implementation library is chosen at Stage 9 and must map these tokens exactly. Icons: Lucide as proposed. Familiar tool actions (for example undo, redo, save, zoom) may be icon-only buttons with an accessible name and a tooltip; unfamiliar or business commands use text, or an icon with text.
- **Color and themes:** semantic roles `surface`, `surface-subtle` (table header, zebra rows, panels), `surface-selected`, `text`, `text-muted`, `border-control` (inputs and checkboxes, at least 3:1), `divider` (decorative only), `action`, `action-hover`, `on-action`, `focus`, `danger`, `success`, `warning`, `info` and `shadow`. The light theme uses `color.light.*`; the dark theme substitutes `color.dark.*` with the same suffix. Contrast figures for every pair are in [the decision record](ui-ux-decision.md#read-color-scheme).
- **Typography:** `font.body` is the operating-system UI font stack; `font.mono` is for IDs, durations and code-like values. Sizes: `type.size-body` for forms and text, `type.size-dense` for tables and compact lists, `type.size-h1`..`type.size-h3` for page, section and panel headings. Weights `type.weight-regular` and `type.weight-strong`; line heights `type.line-body`, `type.line-dense`, `type.line-heading`. Numeric table columns use tabular figures.
- **Spacing:** a 4px-based scale `space.1` to `space.8`; tables and forms use `space.2`..`space.4`, page sections `space.6`..`space.8`.
- **Density:** compact (`size.control-compact`, `size.row-compact`) is the proposed default for tables on desktop; comfortable (`size.control-comfortable`, `size.row-comfortable`) is a user option; on coarse pointers controls use `size.control-touch`. No target is smaller than `size.target-min` (SC 2.5.8).
- **Layout and breakpoints:** below `breakpoint.compact` the layout is a single column; from `breakpoint.compact` tables show all columns; from `breakpoint.wide` forms may sit beside a list. Form content is limited to `layout.form-max`.
- **Geometry and elevation:** `radius.control` for controls, `radius.container` for panels and dialogs; `border.width` everywhere, `border.width-strong` for the selected-row bar and invalid fields. One overlay level for menus and dialogs (`elevation.overlay-offset`, `elevation.overlay-blur`, `color.*.shadow`); pages themselves are flat.
- **Focus:** an outline of `focus.width` at `focus.offset` in `color.*.focus` on every interactive element; never removed.
- **Motion:** `motion.duration-fast-ms` for hover and press, `motion.duration-base-ms` for opening menus and dialogs; both drop to zero under `prefers-reduced-motion`.
- **Accessibility baseline:** WCAG 2.2 AA as recommended in [the decision record](ui-ux-decision.md#read-accessibility-recommendations).
- **Pending:** every item above is a proposal awaiting the owner's selection; library and platform compatibility stays open for Stage 9.

<a id="read-components"></a>

## Components

Draft core variants for the main flows (sign-in, projects, iterations, stories, tasks, time entry, timesheets, search). Bindings name the light tokens; the dark theme uses the `color.dark` token with the same suffix.

| Variant | Purpose | States | Tokens | Preview | Usage and accessibility |
|---|---|---|---|---|---|
| table.data | Dense lists and tables: iteration stories, tasks, people, search results, timesheets | default; hover; selected; sorted; empty; loading; error | background=color.light.surface; header-background=color.light.surface-subtle; text=color.light.text; secondary-text=color.light.text-muted; divider=color.light.divider; selected-background=color.light.surface-selected; selected-bar=color.light.action; row-height=size.row-compact; font-size=type.size-dense; line-height=type.line-dense; cell-padding=space.2 | wireframes/ui-kit.html#table-data (Stage 6; not yet exported) | Real table markup with caption and header cells; sortable headers are buttons with `aria-sort`; sorting covers the whole list; selection uses a checkbox plus the bar, not the tint alone; empty, loading and error states are stated in text; on phones key columns stay and the table scrolls inside its own container |
| field.text | Labelled single-line text or number input, including the cells of the time entry grid | default; hover; focus; invalid; disabled; read-only | background=color.light.surface; text=color.light.text; border=color.light.border-control; border-width=border.width; invalid-border=color.light.danger; invalid-border-width=border.width-strong; error-text=color.light.danger; focus=color.light.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control-compact; radius=radius.control; font-size=type.size-body | wireframes/ui-kit.html#field-text (Stage 6; not yet exported) | Visible label, never placeholder-only; required marked in text; the error names the field and the fix and is linked with `aria-describedby`; entered values stay after an error; in the grid the error names row and column |
| field.date | Date and date-time input (iterations, time entries, timesheet periods) | default; focus; invalid; disabled | border=color.light.border-control; invalid-border=color.light.danger; error-text=color.light.danger; hint-text=color.light.text-muted; focus=color.light.focus; height=size.control-compact; radius=radius.control | wireframes/ui-kit.html#field-date (Stage 6; not yet exported) | States the expected format as a hint (for example `2026-10-02`); impossible or unparsable values are rejected with a message, never rolled over or replaced by a default (D-010); typing is always possible, a picker is optional |
| field.select | Choice from a list: status, disposition, assignee, project | default; focus; invalid; disabled | border=color.light.border-control; text=color.light.text; invalid-border=color.light.danger; focus=color.light.focus; height=size.control-compact; radius=radius.control | wireframes/ui-kit.html#field-select (Stage 6; not yet exported) | Native select semantics or an equivalent listbox; the saved value is pre-selected on edit (W001-F-27 showed lost values); deactivated people are absent from active pick lists (T-01) |
| button.primary | The one main action of a form or dialog: Save, Sign in | default; hover; focus; disabled; loading | background=color.light.action; hover-background=color.light.action-hover; text=color.light.on-action; focus=color.light.focus; height=size.control-compact; radius=radius.control; font-weight=type.weight-strong | wireframes/ui-kit.html#button-primary (Stage 6; not yet exported) | One per view section; a loading state keeps the label and blocks double submission; disabled is used sparingly, with the reason shown |
| button.secondary | Other actions: Cancel, Edit, Move, Export | default; hover; focus; disabled | background=color.light.surface; text=color.light.action; border=color.light.border-control; focus=color.light.focus; height=size.control-compact; radius=radius.control | wireframes/ui-kit.html#button-secondary (Stage 6; not yet exported) | Business commands (Edit, Move, Export) carry a text label, optionally with an icon; a familiar tool action (undo, redo, save, zoom) may be icon-only with an accessible name and a tooltip that also appears on keyboard focus |
| button.danger | Destructive actions: delete project, story, task or note | default; hover; focus; disabled | background=color.light.danger; text=color.light.on-action; focus=color.light.focus; height=size.control-compact; radius=radius.control | wireframes/ui-kit.html#button-danger (Stage 6; not yet exported) | Always leads to dialog.confirm; never the default button of a form |
| dialog.confirm | Confirmation of destructive or far-reaching actions (D-011 project delete) | default; focus; loading | background=color.light.surface; text=color.light.text; shadow=color.light.shadow; shadow-offset=elevation.overlay-offset; shadow-blur=elevation.overlay-blur; radius=radius.container; padding=space.6 | wireframes/ui-kit.html#dialog-confirm (Stage 6; not yet exported) | Names what will be removed; initial focus on the safe choice; Escape cancels; focus is trapped inside while open and returns to the trigger on close |
| nav.header | Top bar: product name, project switcher, search with jump by ID, user menu with theme switch and sign-out | default; focus; expanded | background=color.light.surface-subtle; text=color.light.text; link=color.light.action; divider=color.light.divider; focus=color.light.focus; height=size.control-touch | wireframes/ui-kit.html#nav-header (Stage 6; not yet exported) | Landmark navigation with a skip link before it; menus open by keyboard and close with Escape; on phones the switcher and menu collapse into one menu button with a text label; it must not cover a focused element (SC 2.4.11) |
| nav.breadcrumb | Path from the top through project, iteration, story and task | default; focus | text=color.light.text-muted; link=color.light.action; font-size=type.size-dense; gap=space.2 | wireframes/ui-kit.html#nav-breadcrumb (Stage 6; not yet exported) | A `nav` with an accessible name; the current page is marked `aria-current` and is not a link; on phones it shortens to the parent link |
| status.badge | State of a task, story or iteration (for example not started, started, completed) | default | text=color.light.text; border=color.light.border-control; radius=radius.control; font-size=type.size-dense; padding=space.1 | wireframes/ui-kit.html#status-badge (Stage 6; not yet exported) | The state is always written in text; any color or icon only supports it (SC 1.4.1); the exact state list comes from the SDD, not from this draft |
| feedback.message | Page-level message: error summary after a failed save, success, information, warning | default; error; success; warning; info | background=color.light.surface-subtle; text=color.light.text; error-accent=color.light.danger; success-accent=color.light.success; warning-accent=color.light.warning; info-accent=color.light.info; accent-width=border.width-strong; padding=space.4 | wireframes/ui-kit.html#feedback-message (Stage 6; not yet exported) | Errors are announced (`role="alert"`) and the summary links to each invalid field; success messages are polite status messages; messages do not disappear by themselves; the generic error page and not-found page (D-005) use the error form with a reference |

<a id="read-layout-and-interaction-rules"></a>

## Layout And Interaction Rules

- Layout/responsive rules: single column below `breakpoint.compact`; content uses the full width for tables; forms stop at `layout.form-max`; no page-level horizontal scrolling at a 320 CSS px width.
- Typography/content: `type.size-body` for forms and text, `type.size-dense` for tables; labels and headings in sentence case; long names wrap in tables rather than being cut off, except IDs and dates.
- Navigation and overlays: nav.header plus nav.breadcrumb on every signed-in page; local tabs within project and iteration pages are a Stage 6 variant if the screens need them; overlays restore focus on close.
- Feedback: field errors in field.text, field.date and field.select; the page summary in feedback.message; loading as text plus an indicator; empty states explain what is missing and offer the next action if the user may take it.
- Themes/accessibility: light by default, dark by system preference and a switch (pending owner choice); focus visible in both themes; contrast evidence in [the decision record](ui-ux-decision.md#read-color-scheme); print uses black on white without navigation.

<a id="read-coverage-and-open-decisions"></a>

## Coverage And Open Decisions

| Scope or question | Established result | Gap / not checked | Next action and owner |
|---|---|---|---|
| Foundation (tokens) | Draft tokens validated by the repository validator (types, aliases); digest printed | Not selected by the owner | Owner selects; UX records the pin in `ui-ux-decision.md` |
| Palette choice | Draft uses P1; P2 and P3 are documented with contrast figures | Owner choice pending | Owner; UX swaps color tokens if P2 or P3 is chosen |
| Core variants | 12 draft variants for the main flows | No component sheet, no screen uses them yet; rendered values not checked | Stage 6 exports `wireframes/ui-kit.html` with the screens and keeps only the variants actually used |
| Task board, charts, time entry grid layout | Covered only by general rules (table, status, accessibility) | Board card, chart and grid-row variants are not drafted | Stage 6, only if the screens need them |
| Implementation library | Framework-neutral | Compatibility unknown | Stage 9 architecture |

<a id="read-review-and-change-history"></a>

## Review And Change History

| Version/date | Changed scope and reason | Foundation changed? | Review / owner decision |
|---|---|---|---|
| draft 1, `2026-10-02` | First draft for the Stage 5 owner decision (UX-005-01); before handoff the icon rule was revised per a Codex clarification relayed by PM, which changed `icon_set` and the proposed digest | yes: first foundation proposal (Stage 5) | no review; owner decision pending; Codex approved no option |

Do not overwrite approval history. A missing variant is a design task, not permission for a downstream agent to invent a new visual convention.

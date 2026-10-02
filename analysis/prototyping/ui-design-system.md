# UI Design System - xplanner2-revision1 (foundation chosen by the owner; variants not yet approved)

**Which shared element and variant should each screen use, in which states, and with which approved visual rules?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Recorded result: incomplete or conditional**
>
> draft catalogue on the owner-chosen foundation "Material Lean"; the foundation is chosen, the variants are not approved
>
> **Details:** [Foundation](#read-foundation) / [Components](#read-components) / [Coverage And Open Decisions](#read-coverage-and-open-decisions).
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

- **Created by:** UX Designer, assignment UX-005-01 (draft 1), updated in UX-005-03 to the owner-chosen foundation; Claude Code subagents of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. Skill [`.agents/skills/migration-ux/SKILL.md`](../../.agents/skills/migration-ux/SKILL.md), blob `1e1bbbce0240158f5e8ab696934a1f6217f948f7`.
- **Maintained / decided by:** the Stage 6 prototyping agent within the chosen foundation; the owner chose the foundation at Stage 5 and approves the complete baseline at Stage 8.
- **Governing instructions:** [the shared UI procedure](ui-design-system-guide.md), [Stage 5](../migration_methodology.md#stage-05) and [the template](templates/ui-design-system-template.md).

<a id="read-ownership-and-baseline"></a>

## Ownership And Baseline

- Status: draft catalogue on the owner-chosen foundation "Material Lean"; the foundation is chosen, the variants are not approved
- Created by: UX (UX-005-01), `2026-10-02`; foundation update UX-005-03, `2026-10-02T20:20:50Z` (UTC from code)
- Maintained by: UX Designer, Stage 6 assignment UX-006-01 (Stage 6 drafts added `2026-10-02T20:43:40Z`, UTC from code)
- Foundation decision: [`ui-ux-decision.md`](ui-ux-decision.md) decision version 1 ("Material Lean")
- Values: [`ui-design-tokens.json`](ui-design-tokens.json), foundation digest `97e04be7b42ba98abd8b7df2afde691c64b80029465d2f763e6ba768801c907b` (pinned in the decision record)
- Export set: none; no screen manifest, component sheet or wireframe export exists yet (Stage 6 UX-006-01 started the representative set; see [Coverage And Open Decisions](#read-coverage-and-open-decisions))
- Approved by: foundation only, by the owner `ekzarov` (relayed by Codex); no variant, screen or kit is approved

**Minimal set principle.** This catalogue holds only what the chosen foundation itself requires. Further controls and states (date fields, autocomplete, selects, tables, dialogs, navigation variants, status labels) are defined at Stage 6 only when an agreed scenario needs them, and are approved with the screens at Stage 8. Preview paths name the Stage 6 component sheet that does not exist yet.

<a id="read-foundation"></a>

## Foundation

All values are named tokens in [`ui-design-tokens.json`](ui-design-tokens.json); this section explains their meaning without repeating raw values.

- **Style:** light minimalist Material ("Material Lean") with Jira-like work-screen compactness, no brand copying. Flat layout: sections separated by `color.divider` lines and background steps, no cards with shadows. Shadows are used only for overlays (menus, dialogs) once Stage 6 needs one.
- **Component source and icons:** a framework-neutral catalogue (this file); no Material library is selected; the implementation library is chosen at Stage 9 and must map these tokens exactly. Icons: Lucide. Icon-only buttons only for familiar tool actions (for example undo, redo, zoom), always with an accessible name and a tooltip that also appears on keyboard focus; business commands are labeled with text, optionally with an icon.
- **Color (light theme only):** `color.surface` (content, controls), `color.page` (page background), `color.table-header`, `color.text`, `color.text-secondary`, `color.primary` / `color.primary-hover` (main actions, links), `color.selected` (selected row or active tab), `color.completion` / `color.completion-hover` / `color.completion-tint` (completing actions and completed state), `color.danger` (destructive actions, errors), `color.border-control` (input and checkbox boundaries), `color.divider` (decorative lines only, never a control boundary), `color.on-fill` (labels on primary, completion and danger fills) and `color.focus` (an alias of `color.primary`). Contrast figures are in [the decision record](ui-ux-decision.md#read-color-scheme).
- **Action colors:** Save and Create use primary; Complete task uses completion; Cancel, Edit, Move and Reopen are neutral; Delete uses danger and always asks for confirmation. Closing an iteration with consequences (for example carry-over of unfinished work) asks for confirmation that states the consequences, and is not shown as an unconditional success (neutral, not completion).
- **Typography:** `font.body` is the operating-system UI font stack (no font files). `type.size-body` for forms and text, `type.size-table` for tables and compact lists, `type.size-heading-1` and `type.size-heading-2` for page and section headings; `type.weight-regular` and `type.weight-strong`; `type.line-body`. Numeric table columns use tabular figures.
- **Spacing and geometry:** a 4px scale `space.1`..`space.8`; one corner radius `radius.standard`; `border.width` for controls and dividers.
- **Sizes:** desktop controls `size.control`; table rows `size.table-row`; on phones and coarse pointers targets are between `size.touch-target-min` and `size.touch-target-max` (the hit area may extend beyond the visible control). One density only.
- **Focus:** an outline of `focus.width` at `focus.offset` in `color.focus` on every interactive element; never removed.
- **Accessibility baseline:** WCAG 2.2 AA, visible focus, full keyboard operation, text zoom to 200%, clear form errors, status never by color alone; details in [the decision record](ui-ux-decision.md#read-accessibility-recommendations).
- **Not approved, possible later:** a dark theme and a comfortable-density option. Adding either changes the foundation and returns to Stage 5.
- **Pending:** library and platform compatibility (Stage 9); breakpoints, overlay shadow and any further hover tokens are Stage 6 extensions when agreed scenarios need them (the first Stage 6 drafts, UX-006-01, are listed under [Components](#read-components) and in the token `extensions`; not approved).

<a id="read-components"></a>

## Components

Starting variants implied by the owner's action color rules and the form-error requirement. They are drafts: Stage 6 keeps only those that its screens use and the owner approves them with the screens at Stage 8.

**Stage 6 drafts (UX-006-01).** The rows from `link.text` onwards are added only for the three representative screens: the iteration stories list (`iteration-page`, rows 92, 93, 95, 96, 97), the task edit form (`task-editor`, rows 134, 136, 137, 139, 190) and the close iteration confirmation (`iteration-page` overlay, row 101), with the shared frame (`app-shell`, rows 19, 185, 188). They are not approved, and they are not a full library. No date field is defined: the approved task editor has no date field (row 137 removes the orphan created-date check), so a date control waits for the iteration editor (rows 71, 88, 89). No autocomplete is defined: the acceptor choice is a plain select. `button.completion` and `button.danger` are not used by these three screens and stay from Stage 5 for the task page and delete confirmations (rows 140, 142). Hover values for these drafts are given only where a token exists. Disabled colors have no token yet; no representative screen shows a disabled control.

| Variant | Purpose | States | Tokens | Preview | Usage and accessibility |
|---|---|---|---|---|---|
| button.primary | The main action of a form or dialog: Save, Create | default; hover; focus; disabled; loading | background=color.primary; hover-background=color.primary-hover; text=color.on-fill; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control; radius=radius.standard; font-weight=type.weight-strong | wireframes/ui-kit.html#button-primary (Stage 6; not yet exported) | At most one per form or dialog; loading keeps the label and blocks double submission; disabled is used sparingly, with the reason shown |
| button.completion | Completing a task: Complete task | default; hover; focus; disabled; loading | background=color.completion; hover-background=color.completion-hover; text=color.on-fill; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control; radius=radius.standard; font-weight=type.weight-strong | wireframes/ui-kit.html#button-completion (Stage 6; not yet exported) | Only for completing actions; not for closing an iteration with consequences, which is neutral with confirmation; the label always names the action |
| button.neutral | Other actions: Cancel, Edit, Move, Reopen, Close iteration | default; hover; focus; disabled | background=color.surface; hover-background=color.neutral-hover; text=color.text; border=color.border-control; border-width=border.width; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control; radius=radius.standard | wireframes/ui-kit.html#button-neutral (Stage 6; not yet exported) | Business commands carry a text label; an icon-only tool action needs an accessible name and a tooltip. Stage 6 draft: hover uses `color.neutral-hover` (an alias of `color.page`, so the border keeps 3.03:1 against it); used for Move selected stories, Save order, Close iteration and Cancel. On phones the hit area is at least `size.touch-target-min` |
| button.danger | Destructive actions: Delete | default; hover; focus; disabled | background=color.danger; text=color.on-fill; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control; radius=radius.standard | wireframes/ui-kit.html#button-danger (Stage 6; not yet exported) | Always followed by a confirmation that names what will be removed, with focus on the safe choice; never the default button; the hover value is a Stage 6 extension |
| field.text | Labelled single-line text or number input | default; focus; invalid; disabled | background=color.surface; text=color.text; label=color.text; hint-text=color.text-secondary; border=color.border-control; border-width=border.width; invalid-border=color.danger; error-text=color.danger; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control; radius=radius.standard; font-size=type.size-body | wireframes/ui-kit.html#field-text (Stage 6; not yet exported) | Visible label, never placeholder-only; required marked in text; the error is text that names the field and the fix, linked with `aria-describedby`, plus an icon so it is not color alone; entered values stay after an error. Stage 6 uses: task Name and Estimated hours (messages of row 137), the order number in each story row (row 95; inside a table cell the visible label is the column header plus an accessible name with the story, error of row 96), and the top-bar "Search or ID" field (rows 178, 182) |
| link.text | Inline navigation: story name, breadcrumb steps, Me, Formatting help, error-summary links | default; hover; focus | text=color.primary; hover-text=color.primary-hover; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset | wireframes/ui-kit.html#link-text (Stage 6; not yet exported) | Stage 6 draft. Links navigate and never perform a business command (commands are buttons). Primary text meets 4.61:1 or more on every background in use; links inside running text are also underlined so they are not identified by color alone |
| field.select | Labelled choice from a short fixed or people list: Type, Disposition, Acceptor | default; focus; invalid; disabled | background=color.surface; text=color.text; label=color.text; border=color.border-control; border-width=border.width; invalid-border=color.danger; error-text=color.danger; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; height=size.control; radius=radius.standard; font-size=type.size-body | wireframes/ui-kit.html#field-select (Stage 6; not yet exported) | Stage 6 draft for the task editor (row 134). Native select semantics, keyboard-operable, visible label. Type values come from row 134 and are stored as stable codes (row 135). Disposition is pre-selected by the rule of row 136. Acceptor lists only active people (rows 38, 48). An autocomplete is not defined; it is added only if a scenario needs a long list |
| field.textarea | Labelled multi-line text: Description | default; focus; invalid; disabled | background=color.surface; text=color.text; label=color.text; border=color.border-control; border-width=border.width; invalid-border=color.danger; error-text=color.danger; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; radius=radius.standard; font-size=type.size-body; line-height=type.line-body | wireframes/ui-kit.html#field-textarea (Stage 6; not yet exported) | Stage 6 draft for the task description (row 134), with the Formatting help link (row 190) below it as `link.text`. No height token: it grows with content from about four lines; it never cuts text off |
| checkbox | Selecting table rows for a bulk action: stories to move | default; checked; focus; disabled | background=color.surface; border=color.border-control; border-width=border.width; checked-background=color.primary; check-mark=color.on-fill; focus=color.focus; focus-width=focus.width; focus-offset=focus.offset; size=size.checkbox; radius=radius.standard | wireframes/ui-kit.html#checkbox (Stage 6; not yet exported) | Stage 6 draft for row 97. Each checkbox has an accessible name with the story name; the header checkbox selects all rows. The visible box stays `size.checkbox`; on phones the hit area is at least `size.touch-target-min`. The row tint is supporting only; the tick shows the selection |
| table.data | Dense sortable list with optional row selection: the story table | default; sorted; row-selected; empty; scrolled | background=color.surface; header-background=color.table-header; header-text=color.text; header-weight=type.weight-strong; text=color.text; divider=color.divider; selected-background=color.selected; row-height=size.table-row; font-size=type.size-table | wireframes/ui-kit.html#table-data (Stage 6; not yet exported) | Stage 6 draft for row 92. Column headers are buttons with `aria-sort`; sorting covers the whole list. Numbers right aligned with tabular figures; status and disposition are text. Empty state shows the message of row 93 in place of rows. Narrower than `breakpoint.wide-min`, priority columns stay visible and the table scrolls inside its own container (scrolled), never the page. Selected rows keep `color.text`, not secondary text |
| progress.bar | Read-only progress of an iteration next to its figures | default | fill=color.primary; track=color.progress-track; height=size.progress-bar; radius=radius.standard | wireframes/ui-kit.html#progress-bar (Stage 6; not yet exported) | Stage 6 draft for row 92. Always paired with the text percentage and the estimated, actual and remaining figures, so it never carries meaning alone; fill to track 3.89:1, fill to surface 5.20:1. Exposed as `progressbar` with its value |
| message.error-summary | Summary of field errors after a failed save | default | background=color.surface; border=color.danger; border-width=border.width; icon=color.danger; text=color.text; link=color.primary; radius=radius.standard; padding=space.4 | wireframes/ui-kit.html#message-error-summary (Stage 6; not yet exported) | Stage 6 draft for the task editor (row 137) and page messages such as row 96. Appears at the top of the form after a failed save, receives focus, names how many fields need correction and links to each field; the field errors stay on the fields. Icon plus text, never color alone |
| dialog.confirm | Modal confirmation that states consequences: Close iteration | default; focus-initial | background=color.surface; scrim=color.scrim; shadow-color=overlay.shadow-color; shadow-offset-y=overlay.shadow-offset-y; shadow-blur=overlay.shadow-blur; width=size.dialog-width; radius=radius.standard; padding=space.6; title-size=type.size-heading-2; title-weight=type.weight-strong; text=color.text | wireframes/ui-kit.html#dialog-confirm (Stage 6; not yet exported) | Stage 6 draft for row 101. The only element with a shadow. Title names the action and object; body states what will happen; buttons are `button.neutral` for Close iteration (never completion) and Cancel. Initial focus on Cancel (the safe choice); focus stays inside while open; Escape cancels; focus returns to the triggering button on close. On phones it is full width minus `space.4` margins with stacked buttons |
| nav.top-bar | Shared header of every signed-in page | default; focus | background=color.surface; divider=color.divider; height=size.top-bar; text=color.text; link=color.primary | wireframes/ui-kit.html#nav-top-bar (Stage 6; not yet exported) | Stage 6 draft for the app frame: product name, the "Search or ID" field (rows 178, 182), Me (row 188) and Sign out (row 19). Nothing else. A "skip to content" link is its first focus stop |
| nav.breadcrumb | Path from Top through project, iteration, story and task | default; focus | link=color.primary; current-text=color.text; separator=color.text-secondary; font-size=type.size-body | wireframes/ui-kit.html#nav-breadcrumb (Stage 6; not yet exported) | Stage 6 draft for row 185. The current item is plain text with `aria-current`; items wrap on phones instead of being cut off; output is escaped |
| nav.tabs | Local tabs inside an iteration: Stories, Tasks, Statistics, Accuracy, Board | default; selected; focus | text=color.text; selected-text=color.text; selected-weight=type.weight-strong; indicator=color.primary; indicator-width=border.width-indicator; divider=color.divider; font-size=type.size-body | wireframes/ui-kit.html#nav-tabs (Stage 6; not yet exported) | Stage 6 draft; the tabs lead to the surfaces of rows 92, 106, 109, 113 and 114 (metrics, row 107, is deferred and has no tab). Selected tab shown by weight and the underline, not by tint alone; tabs are links to routes, so browser back works. On phones the row scrolls horizontally inside its container |

<a id="read-layout-and-interaction-rules"></a>

## Layout And Interaction Rules

- Layout/responsive rules: one responsive web application for desktop and phone with the same URLs; content on `color.surface` over `color.page`; tables use the full width and scroll inside their own container when needed; no page-level horizontal scrolling at 320 CSS px; breakpoint values are Stage 6 extensions.
- Typography/content: `type.size-body` for forms and text, `type.size-table` for tables; sentence case; long names wrap rather than being cut off.
- Navigation and overlays: top bar, breadcrumbs and local tabs (selected tab marked with `color.selected` plus text weight or an underline, not the tint alone); their variants are defined at Stage 6; overlays have the only shadow and restore focus on close.
- Feedback: field errors as in field.text; status of tasks, stories and iterations is written in text, color only supports it; selection is marked by a checkbox or text as well as `color.selected`.
- Contrast usage rules (from the computed figures): controls keep a `color.surface` fill, so their `color.border-control` boundary is never drawn directly on `color.table-header` or `color.selected` (2.88:1 and 2.85:1 there); text on a `color.selected` row uses `color.text`, not `color.text-secondary` (4.49:1 there).
- Themes/accessibility: light theme only; focus visible on every background in use; print uses black on white without navigation.

<a id="read-coverage-and-open-decisions"></a>

## Coverage And Open Decisions

| Scope or question | Established result | Gap / not checked | Next action and owner |
|---|---|---|---|
| Foundation (tokens) | Owner-chosen "Material Lean" foundation encoded; validated by `validateTokens` (no errors); digest pinned in the decision record | No rendered UI exists, so actual rendered values are not checked | Stage 6 renders; Stage 7 checks rendered values against tokens |
| Core variants | 5 starting variants from the action color rules and the form-error rule; `button.primary`, `button.neutral` and `field.text` are used by the representative set | No component sheet; `button.completion` and `button.danger` are not used by the three representative screens | Stage 6 exports `wireframes/ui-kit.html` with the screens and keeps only used variants |
| Representative set (UX-006-01) | 11 Stage 6 draft variants for the iteration stories list, the task edit form and the close iteration confirmation; one Stitch generation (stories list, desktop) completed in Stitch project `projects/2535085752995102337` | Only the Stitch project thumbnail of the desktop list is available; no screen ID, screen export or HTML could be obtained, and the other five generations were not made; nothing is exported to `wireframes/` | Resolve the Stitch screen-listing blocker, then generate the remaining screens, export and update these drafts to what the exports show |
| Further controls (dates, autocomplete, navigation beyond the frame, status labels) | Select, textarea, checkbox, table, dialog, error summary, progress bar, top bar, breadcrumb and tabs drafted for the representative scenarios only | Date field waits for the iteration editor (rows 71, 88, 89); autocomplete not needed by the acceptor select; disabled colors have no token | Stage 6 UX; owner approval at Stage 8 |
| Extensions | 12 Stage 6 draft extension tokens: neutral hover, progress track, scrim, overlay shadow (color, offset, blur), top bar height, dialog width, progress bar height, checkbox size, indicator width, one breakpoint (`breakpoint.wide-min`) | Danger hover not added (no danger button is drawn); values not rendered or reviewed | Stage 7 checks rendered values; owner approval at Stage 8 |
| Implementation library | Framework-neutral | Compatibility unknown | Stage 9 architecture |

<a id="read-review-and-change-history"></a>

## Review And Change History

| Version/date | Changed scope and reason | Foundation changed? | Review / owner decision |
|---|---|---|---|
| draft 1, `2026-10-02` | First draft for the Stage 5 owner decision (UX-005-01), palette P1, light and dark themes, compact and comfortable densities, 12 draft variants; digest `c41526e0…7c21` | yes: first foundation proposal (Stage 5) | no review; not selected by the owner (kept as history) |
| foundation 1, `2026-10-02T20:20:50Z` | Rewritten to the owner-chosen "Material Lean" foundation (UX-005-03): new light-only palette, single density, 6px radius, 36px controls, 40px rows; dark theme and comfortable density removed; variants reduced to the 5 the foundation requires | yes: owner-chosen Stage 5 foundation, digest `97e04be7…907b` | owner choice «Поехали. Мне нравится», `ekzarov`, relayed by Codex; see [the decision record](ui-ux-decision.md#read-decision) |
| Stage 6 drafts, `2026-10-02T20:43:40Z` | UX-006-01: 11 draft variants and 12 extension tokens for the three representative screens; `button.neutral` gains the hover binding; usage notes cite the parity-map rows. Not exported, reviewed or approved | no: foundation digest unchanged `97e04be7…907b` | no review; owner approval at Stage 8 |

Do not overwrite approval history. A missing variant is a design task, not permission for a downstream agent to invent a new visual convention.

# Prototyping Record - Stages 5-8

Read [Shared UI Design System](ui-design-system-guide.md) for the mandatory
Stage 5 foundation, Stage 6 screen/kit iteration, Stage 7 verification and
Stage 8 combined approval. New prototype sets use manifest version 4. The
catalogue and exact tokens remain read-only for SDD, code and delivery.

## UI/UX Filenames

| Current filename | Purpose | Former filename |
|---|---|---|
| `ui-ux-decision.md` | Stage 5 owner choice of user-facing channels, application form, style and accessibility baseline | `decision.md` |
| `ui-ux-approval.md` | Stage 8 owner decision on the exact prototype | `approval.md` |
| `ui-polish-backlog.md` | Eligible deferred minor visual corrections, not missing behavior or general UX defects | `prototype-polish-backlog.md` |
| `ui-visual-parity-checklist.md` | Guidance for comparing rendered UI with approved wireframes | `visual-parity-checklist.md` |

Use the correspondingly named templates for new decision and backlog records.
Do not create an empty backlog when no eligible cosmetic findings exist.
The checklist is reusable guidance, not a new Stage 7 or delivery report.
Screen manifests and wireframes already have explicit names; the parity map,
target-surface inventory and general review reports are not UI-only records.

For a previously approved manifest citing the old Stage 5 decision path, keep
that manifest and its pinned hash unchanged. Preserve the old decision as a
frozen snapshot and copy its exact bytes to `ui-ux-decision.md`. The prototype
audit requires the current file and accepts the historical pointer only while
the two files are byte-identical. New manifests cite the new path. A changed
decision requires a new manifest and the existing Stage 5-8 review/approval
cycle, not a silent hash refresh. The manifest's `decision` field name stays
unchanged; it is the record path that is renamed.

Existing backlog findings, session IDs, owner deferrals and deadlines retain
their meaning when transferred to `ui-polish-backlog.md`; current status
citations must point to the transferred record. Preserve issued historical
reports without rewriting their old filenames or claiming a new review.

The Stage 8 record is `analysis/prototyping/ui-ux-approval.md`, created from
[`ui-ux-approval-template.md`](templates/ui-ux-approval-template.md).
It records the owner's decision on the exact screens and user interactions
represented by the prototype, including roles, states, remarks and bounded
cosmetic deferrals. It does not approve architecture or working implementation.

This replaces the former `approval.md` name, not the owner's decision. New
records, instructions and gates use only the new name. When upgrading an
existing project, preserve the approved bytes and all pinned hashes. An old
file may remain as a frozen historical snapshot for immutable references;
never update it or accept it as a fallback for the current Stage 8 gate.
Future owner decisions update only `ui-ux-approval.md` under the existing
exact-baseline approval rules. A filename change is not a new approval.

**Reading technical statuses.** `pending` (unreviewed), `approved` (the owner approved the exact export scope), and `remarks` (corrections requested) are not interchangeable. `deferred` cosmetic work (authorized postponement to a named slice/deadline) is not a closed fix. Normalization and manifest hashes identify coverage and files, not approval. [Status meanings](../artifact-status-meanings.md).

New records follow [artifact result boundaries](../artifact-result-boundaries.md):
established results, open differences or decisions, unverified scope and next
action stay distinct. The record family determines what counts as evidence;
planned work, owner approval and independent verification are not interchangeable.

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>prototyping/ui-ux-decision.md</summary>



The approved product and visual baseline used before wireframes are drawn. It captures the chosen channels, application form, design direction, palette, theme and accessibility expectations, including alternatives or waivers the owner rejected. **Proposal, decision and remaining work:** Agent proposal or previous value; Explicit human decision tied to exact scope/version and evidence; Applied changes versus open questions and unapplied decisions; Authorized deferrals with responsible actor and deadline; Dated amendments retain prior decisions. A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

- **Created by:** The Stage 5 agent prepares options and writes the human owner choice into the decision record.
- **Maintained / decided by:** The agent records an explicit owner-approved baseline change after a return to Stage 5.
- **Instructions:** Stage 5

**When used:** At Stage 5 the agent presents options, waits for the owner's choice, then records the approved channels, application form and visual direction.

**Example:** The owner selects a responsive web application with the approved palette, so Stage 6 may design desktop and mobile screens.

</details>
<details>
<summary>ui-design-system.md</summary>

**Which shared element and variant should each screen use, and where can I see its states?**

The readable UI kit: stable variant IDs, purposes, applicable states, property-to-token bindings, visual examples and usage/accessibility rules. It is developed alongside representative screens, not guessed afterwards from screenshots. The owner-approved foundation and exact completed baseline remain separate decisions.

- **Created by:** The Stage 5 agent drafts the UI foundation and records the human owner choice.
- **Maintained / decided by:** The Stage 6 prototyping agent develops used variants and extensions within that foundation; the owner approves the exact combined baseline at Stage 8. Downstream agents read it without edits.
- **Instructions:** Stages 5-9 and 13-19; analysis/prototyping/ui-design-system-guide.md.

**When used:** Stage 5 drafts the foundation; Stage 6 updates the catalogue while drawing and declares used variants per screen. Stage 7 checks actual exports against it, Stage 8 approves the combined manifest. Stages 9 and 13-19 consume relevant pinned UI sources read-only; Stage 19 full sources are Phase B only. Required only for visual scope.

**Example:** Illustrative: task editing and story editing both use input.date with the same focus/error behavior. Stage 15 names that variant; Stage 17 implements one shared date control rather than two guessed versions.

</details>
<details>
<summary>ui-design-tokens.json</summary>

**Which exact colors, fonts, spacing and other visual values must every component reuse?**

The single dictionary of typed visual values and aliases. Its foundation records owner-selected choices; extensions serve new components without overriding that foundation. The catalogue refers to token names, and generated themes/styles derive from the approved values. It does not prove visual correctness by itself.

- **Created by:** The Stage 5 agent drafts the UI foundation and records the human owner choice.
- **Maintained / decided by:** The Stage 6 prototyping agent develops used variants and extensions within that foundation; the owner approves the exact combined baseline at Stage 8. Downstream agents read it without edits.
- **Instructions:** Stages 5-9 and 13-19; analysis/prototyping/ui-design-system-guide.md.

**When used:** The Stage 5 agent prepares values and records the owner-approved foundation hash in ui-ux-decision.md. Stage 6 may add within-foundation extensions. The manifest pins the entire file for Stages 7-8 and downstream UI work. audit:prototype checks types, aliases and pins; rendered checks verify actual use.

**Example:** Illustrative: button.primary-background aliases color.action. A changed global color cannot be hidden by refreshing the file hash: the Stage 5 foundation pin changes and requires a new owner decision.

</details>
<details>
<summary>screen-normalization.json</summary>

**Behavior → screen: What needs to be represented?**

The plan written before wireframes are drawn. It maps every applicable parity row to a surface, state, action, overlay, navigation item or non-visual behavior. The later screen-manifest.json references this record and pins its evidence hash.

- **Created by:** The Stage 6 prototyping agent classifies behavior rows and writes the normalization record.
- **Maintained / decided by:** The prototyping agent reconciles row mappings when behavior or the prototype changes.
- **Instructions:** Stage 6

**When used:** Stage 6 fills screen-normalization.json from the reusable .example.json structure before drawing. For each parity row, row links to the workbook; classification says what it became; screen and surface_key identify its visual home; element names the exact state, action, overlay or navigation item; note explains why. audit:prototype consumes this record and screen-manifest.json pins its evidence hash; the explanatory _schema_help is excluded from that hash.

**Example:** Row 42 can be classified as overlay on task-details with element "confirm deletion"; a nightly job is non-visual and therefore has no screen, surface_key or element. The opening _schema_help explains each field.

</details>
<details>
<summary>wireframes/*</summary>



The complete repository-owned set of visual prototypes. It shows the approved screens, role variations, meaningful states, forms, dialogs and transitions that reviewers inspect before implementation begins.

- **Created by:** The Stage 6 agent uses the selected design tool; the tool produces the exported wireframe files.
- **Maintained / decided by:** The prototyping agent corrects the design and regenerates exports under the approved form/style decision.
- **Instructions:** Stage 5 decision and Stage 6 export procedure

**When used:** Produced at Stage 6 and inspected at Stages 7, 8, 15, 17 and 18. Includes separate component-sheet resources, which must not be misrepresented as business screens. They define the approved visible behavior for each role and meaningful state.

**Example:** The task time-entry wireframe shows the duration field, description input, validation state and responsive layout used during implementation review.

</details>
<details>
<summary>screen-manifest.json</summary>

**Finished screen → behavior: What was drawn, and which parity-map rows does it cover?**

The evidence written after wireframes are drawn. Version 4 pins the common UI kit, token values and component previews as well as screen exports. It records what screens actually exist, which normalization rows and roles they cover, their states, actions, navigation and export hashes, and the evidence hash of screen-normalization.json.

- **Created by:** The Stage 6 agent creates the manifest using the actual export files and their computed hashes.
- **Maintained / decided by:** The agent or configured export script refreshes entries and hashes with each prototype export.
- **Instructions:** Stage 6

**When used:** Created after drawing from the normalization plan and updated with every export. Version 4 also pins the shared UI catalogue, tokens and component-sheet resources; screen ui_variants name the used catalogue entries. Its normalization path and normalization_sha256 bind it back to screen-normalization.json; its screen entries prove which planned rows, roles, states, actions and files actually exist.

**Example:** Normalization assigns row 42 to the task-details confirmation overlay. The manifest then lists row 42 under task-details, names the overlay and roles, hashes the exported HTML, and pins the normalization evidence hash.

</details>
<details>
<summary>stage-07-pass-NNN.md</summary>



An independent verdict on the prototype set. It checks that normalization is truthful, required roles and states are represented, navigation is coherent, map coverage is sufficient and the design has not invented unsupported behavior. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 19 preserves its blind first pass; reconciliation follows it. Stage 2 has its own mode-qualified record contract.

- **Created by:** A fresh independent agent assigned to Stage 7 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 7 independent control and reviewer eligibility

**When used:** At Stage 7, a fresh independent agent acting as the prototype reviewer creates it after checking coverage, navigation and unsupported invention against the map. A prototype defect returns to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer reports that the read-only role still sees an edit action, so Stage 6 must correct the wireframe.

</details>
<details>
<summary>ui-polish-backlog.md</summary>

**Which minor visual corrections may wait, who will fix them, and before which release?**

A list of deferred minor visual corrections, such as small spacing or alignment inconsistencies that do not impair use. Each has an owner-approved scope and a concrete implementation slice; corrections must be verified before that slice reaches production. Missing behavior, security defects, broken navigation and unusable clipping never belong here.

- **Created by:** The Stage 7 independent reviewer records eligible residual cosmetic findings in a backlog.
- **Maintained / decided by:** The owner approves the bounded deferral; the Stage 15 agent maps scope and tasks; the Stage 17 agent records corrections and independently verified closure; the Stage 18 agent records regressions and returns them to Stage 17, which reopens the backlog in a new candidate.
- **Instructions:** Stage 7 creation and Stage 8 approval; conditional backlog input at Stages 15-19, updated at Stages 15/17; production-release and acceptance closure checks

**When used:** Conditional input at Stages 8 and 15-19; updated at Stages 15 and 17. The Stage 15 agent matches open finding IDs to the slice screens, shared components and functions and links applicable tasks in tasks.md. Stage 16 checks completeness. Stage 17 records corrections and independent closure evidence. Stage 18 checks the whole release scope before production; Stage 18 records regressions in the delivery report and returns them to Stage 17 for backlog correction in a new candidate; Stage 19 reconciles the backlog after blind acceptance. An applicable finding cannot be postponed by assigning it to a later slice. Verified closure is required before production release and acceptance. A missing referenced backlog blocks; no file is required when no cosmetic findings exist.

**Example:** A small spacing inconsistency is assigned to the task-editing slice: its Stage 17 agent corrects it, and the reviewer checks the rendered result before production release. A missing permission state is not cosmetic and still blocks Stage 8.

</details>
<details>
<summary>prototyping/ui-ux-approval.md</summary>



The owner's signature under the exact prototype version reviewed at Stage 7. It pins the manifest, exported wireframes and closing review so later design and acceptance cannot silently switch to a different visual baseline. **Proposal, decision and remaining work:** Agent proposal or previous value; Explicit human decision tied to exact scope/version and evidence; Applied changes versus open questions and unapplied decisions; Authorized deferrals with responsible actor and deadline; Dated amendments retain prior decisions. A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

- **Created by:** The Stage 8 agent records the human owner explicit verdict against the exact prototype baseline.
- **Maintained / decided by:** The agent records a new owner verdict when the reviewed baseline changes; only the owner approves it.
- **Instructions:** Stage 8

**When used:** At Stage 8 the agent records the owner's explicit approval of the exact manifest, export hashes and closing review. Later UI work must use this pinned version.

**Example:** The owner approves export set v12, allowing Stage 15 to cite those screens and Stage 17 to compare the built UI against them.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

This directory holds the durable, reviewable prototype baseline.

## Contents

| File | Stage | Purpose |
|---|---:|---|
| `ui-ux-decision.md` | 5 | Owner decision on application form, channels, style, and color scheme |
| `screen-normalization.json` | 6 | Classification of every applicable row and the row-to-screen coverage table; written **before** any wireframe |
| `wireframes/` | 6 | Exported screen catalog; live design-tool links alone are insufficient |
| `screen-manifest.json` | 6 | Screen-to-row, role, state, and export-hash manifest |
| `ui-polish-backlog.md` | 7 | Conditional backlog for closing Low-cosmetic findings, bound to the review session that found them |
| `ui-ux-approval.md` | 8 | Owner approval of the exact exported screen set |
| `templates/` | - | Blank reusable starting points for these records, including normalization, approval, conditional polish-backlog, and carried-forward trace examples |

Create project records by copying the matching template without changing the
template itself.

### How to read screen normalization

`screen-normalization.example.json` documents the reusable shape and contains
placeholders; it is not project evidence. The project's
`screen-normalization.json` contains real parity-map row numbers and is the
Stage 6 record consumed by `audit:prototype`. Its evidence-bearing content is
later pinned through `screen-manifest.json#/normalization_sha256`;
`_schema_help` is documentation and is deliberately excluded from that hash.

| Field | Meaning |
|---|---|
| `row` | Physical row number in `legacy_user_flows.xlsx` |
| `classification` | Whether the behavior is a `surface`, `state`, `action`, `overlay`, `navigation` step or `non-visual` behavior |
| `screen` | Stable planned screen id; the manifest must use the same id |
| `surface_key` | Canonical screen identity: channel + route family + user task + layout |
| `element` | Exact state, action, overlay or navigation label on that screen |
| `note` | Evidence-based reason for the classification and placement |
| `excluded_rows` | Rows omitted only by an explicit Stage 4 do-not-port decision |
| `_schema_help` / `_notes` | Embedded field guide / provenance notes; neither is a behavior row |

**`screen-normalization.json`: behavior → screen. What needs to be represented?**

**`screen-manifest.json`: finished screen → behavior. What was drawn, and which
parity-map rows does it cover?**

Stage 7 normally closes on a clean independent pass. Its only exception is a
pass whose findings are all Low and cosmetic, whose prohibited classes and
unchecked scope are both empty, and whose findings are dispositioned in
`ui-polish-backlog.md` using the template above. Stage 8 approval must
pin the same `export_set_version` as that closing pass.

## Implementation parity provenance

Stage 17 and Stage 18 checks consume the exact approved source files, not
screenshots generated from the implementation. `ui-parity-audit.js` exports
`UI_APPROVED_SURFACE_CONTRACTS` with each affected surface's repository path
and manifest SHA-256; it also adds `app-shell` whenever that shared surface
exists. The project parity command derives checks for labels, exact icon ids,
computed typography, component geometry, palette, spacing, navigation order,
selected/disabled/error states, visible actions, composition and roles from
those pinned sources, then reruns them on the public deployment. Merely finding
the expected element or text is not style parity. Every UI-impacting SDD must
therefore contain `Binding Visual Style Checks` covering all seven style
categories for every approved screen; `ui-parity-audit.js` fails closed when a
category is absent.
The seventh category is `content fidelity`. Apply
[`analysis/prototyping/ui-visual-parity-checklist.md`](./ui-visual-parity-checklist.md) before Stage 17 and each UI
redeployment. It binds representative populated values, standalone missing-value
placeholders, booleans, badges, long/localized strings, wrapping and truncation.
A matching symbol with inherited wrong typography is a failure.
Interactive source markers are binding too. When an approved HTML export
declares `hover`, the SDD states row must explicitly name hover and require an
automated hover assertion; the audit rejects a generic states row. Browser
tests must activate the interaction and inspect the resulting computed style.
The same rule applies to focus, pressed, selected and other declared states as
their source extractors are enabled. A static screenshot cannot prove an
interactive state.
Every deployed UI slice is permanently listed in
[`analysis/migration_status.yaml#/delivery/delivered_ui_slices`](../migration_status.yaml#/delivery/delivered_ui_slices) as regression
inventory. It is not automatically rerun for every feature. The active SDD's
`Change Impact and Verification Scope` selects the run: `delta` checks its
screens and exact affected `slice#surface` corrections; `expanded` enumerates
all affected shared-shell/component surfaces in the SDD; `full` adds the whole
delivered inventory. A shared shell, token, typography, component, or layout
change cannot remain `delta` when evidence shows a wider dependency.
Every exact correction must also appear as a changed surface in the next Stage
18 delivery record and complete a real deployed browser journey. A local parity
pass cannot substitute for that post-deploy traversal.
Implementation snapshots remain useful as secondary regression evidence only.

## Screen normalization comes before generation

> **Anti-pattern: one workbook row or one user flow does not imply one wireframe
> screen.**

A workbook row, a requirement, a user flow, an action and a visual screen are
different things. Generating one screen per row or per flow produces a catalog
full of pages that do not exist, and the Stage 7 reviewer then spends the
control pass on artifacts nobody would build.

**Before any wireframe is generated**, classify every applicable row as exactly
one of `surface`, `state`, `action`, `overlay`, `navigation` or `non-visual`,
and record the result in `screen-normalization.json`.

A standalone screen exists only when there is a distinct user surface with its
own purpose, structure or route. The mapping is many-to-one:

```
many workbook rows → several actions and states → one logical screen
```

Group rows by the **canonical surface key**:
`channel + route family + primary user task + stable layout`.

**Do not create a new screen** when the only difference is:

- a success or an error result;
- an empty list;
- a validation message;
- session expiry;
- permission denial;
- loading;
- saving;
- a redirect;
- a button's action;
- the user's role, while the composition is unchanged.

Each of those is a state, an action or a role variation of one screen. A
separate **state** wireframe is justified only when the state materially changes
the visible composition, the available actions, or the information structure. A
separate **role** screen is justified only by a materially different interface.

For role-aware navigation, the prototype and SDD must distinguish authorization
from availability. A destination is absent when the current role lacks
permission. A destination may be disabled only when that role is authorized but
a required context or explicitly deferred implementation is unavailable. Record
the direct-route outcome separately; hiding navigation never replaces server-side
authorization.

`non-visual` rows get no artificial wireframe. Each carries
`non_visual_workbook_rows[].covered_by`: a `coverage` statement saying how the
behavior will be covered instead, and the screen that sets it off where there is
one.

That is what Stage 6 honestly knows. SDD requirement ids are written at Stage 15 and
test references at Stage 17; naming either here would mean inventing it, and an
invented name is the placeholder this audit refuses. It would also be unsafe:
Stage 8 pins this manifest by hash, so filling those fields in later would
invalidate the owner's approval with no path back.

Current requirement and verification links follow the
[Stage 15-19 traceability contract](../../specs/traceability-guide.md).
The shared index links SDD, plans and execution records; independent reviewers
still check semantic requirement-to-test coverage. Structural link validation
is not a test run. The older [gap note](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/GAP-row-requirement-test-traceability.md)
records the historical problem and uses earlier stage numbering; it is not the
current authoring instruction or evidence that all semantic checks are automated.

### Upgrading old screen manifests

**How do we preserve old requirement and test references without another artifact?**

This applies specifically to `analysis/prototyping/screen-manifest.json`
versions 1 and 2 that contain old `covered_by.requirement` or `covered_by.tests`
values. Before removing those fields, the schema-migration agent preserves them
directly in the `Imported Legacy References` section of `specs/traceability.md`.
Use [the existing traceability template](../../specs/traceability.template.md),
not a separate handoff file. If the shared index does not exist yet, create only
its title and this conditional section; Stage 15 completes the normal index.

Record the original repository commit or manifest digest, export-set version,
workbook revision and physical row, original identifiers, transfer date and
agent. Preserve raw values in a fenced block and record their disposition in
prose. Unverified imports must not enter authoritative requirement tables or
count as test coverage. No old identifiers means no import section is needed.

**Illustrative example, not project evidence:** old workbook row 21 names
`FR-021` and `rejects_empty_duration`. Preserve those strings with their source
revision and an explicit unverified disposition. Stage 15 checks the row and
requirement and links the real SDD; Stage 17 checks the actual test, its scope
and execution records. Missing or stale names stay gaps. Independent reviewers
check the reconciliation. The index's structural audit does not validate raw
imports or turn them into approved requirements or passed tests.

If a project already has a historical handoff file, transfer its contents and
source reference into this same section before retiring it. Preserve immutable
or hash-pinned historical files; do not delete their only evidence.

The file stays outside the Stage 8 pinned prototype directory so subsequent
traceability work does not mutate the approved prototype package. The schema
upgrade itself changes the manifest hash and still requires renewed prototype
approval if the original package was approved.

### Coverage does not shrink

Normalization changes the grouping, never the coverage. `screen-normalization.json`
carries the coverage table

```
workbook row → screen → state / action / non-visual coverage
```

and both directions are verified before generating: every applicable row is
covered, and every screen is justified by rows in the map.

A row the owner decided at Stage 4 not to port is not simply absent. It goes in
`excluded_rows` of the same record, citing the Stage 4 finding, so that "not
drawn" is a decision on the record rather than a gap.

Row numbers are the key joining three records, so the manifest also carries
`workbook_rows_sha256`. Without it, row 8 could stop meaning what it meant when
the catalogue was built while all three records still agreed on the number 8 —
and a Stage 8 approval pinning the manifest would still look valid. The digest
covers the governed rows — the ones the catalogue classifies and the ones it
excludes — rather than the file, so unrelated sheet formatting does not
invalidate a baseline.

The digest is defined, not opaque. Take every governed row — the ones classified **and** the ones excluded — in
ascending row order, and build

```json
[{ "row": 8, "epic_row": 7, "epic": [<ID>, <name>], "cells": [<8 source cells>] }]
```

where `cells` is the trimmed displayed text of immutable detail-row source
columns 1-8, while `epic` contains only the immutable ID and name from the
`UF-` header that scopes the row. Epic lifecycle status and delivery/SDD
columns are deliberately excluded because they evolve after approval. The
digest is the SHA-256 of that JSON.
JSON rather than joined text because a cell may itself contain a tab or a
newline, and the epic header is included because the same scenario means
different things under different epics. To read the value off a real record:

```bash
node analysis/tools/prototype-audit.js --governed-rows-digest
```

It reads only the workbook, so it works before the manifest and the
normalization record are correct - which is when you need it.

### What the audit enforces, and what it cannot

`audit:prototype` rejects: a manifest with no normalization record, or one whose
recorded SHA-256 no longer matches it; a screen with no `surface_key`; two
screens sharing one; a governed row that is neither classified nor excluded; a
row claimed by two screens; a `state`, `action`, `overlay` or `navigation` row
that does not name an element the screen actually lists; a `surface_key` in the
record that differs from the screen's own; a non-visual row that claims a screen
or omits `covered_by`, or names an initiating screen that does not exist; a row
number that is not a scenario row; a coverage workbook that is missing,
unreadable, or whose governed rows no longer match the digest the manifest pinned.

It also refuses a target-only screen that does not cite an approved owner
decision in `migration_status.yaml`, and refuses an empty catalogue whenever any
governed row is neither non-visual nor excluded — while allowing one when there
is genuinely nothing to draw. A scope with no screens has no `wireframes/`
directory either: Git does not preserve an empty one, so the audit does not
demand it.

It does not check coverage *depth*. The schema holds independent lists of roles,
states, actions, overlays and navigation; it does not tie a role to its states,
compare the channel against the Stage 5 decision, or require the standard
loading, empty, error, forbidden, success and validation states. A manifest with
one role and one state passes. Coverage depth is the reviewer's, and the rules
above say what to look for.

It does not enforce that a non-visual row eventually acquires a requirement and
tests, and it cannot tell a row-specific coverage statement from one sentence
repeated across every row: the same words may be honest for several rows that
share a mechanism, or boilerplate for rows that do not, and only a reader can
tell. What it checks is that the statement exists, is not the template's own
words, and is at least three words of three letters each — a statement, not a label. That
admits a concise real one, "Service contract tests.", and refuses filler like
"x x x x", which a plain word count would have taken. "Unit tests." is refused on
purpose: two words name a tool, they do not say how the behaviour is covered. It
is a shape check; nothing more is claimed.

Four more things it cannot judge: whether a surface key is *truthful*, since two
identical surfaces described in different words still pass; whether a cited Stage
4 finding is real, or whether a `coverage` statement is true; whether a
`target_requirement` describes the surface the owner actually approved; and
whether normalization really came **before** generation — the recorded hash
proves the record and the catalogue agree now, not which was written first. Those
are the Stage 7 reviewer's, and they are the half worth their time.

## Rules

- Credentials and design-tool configuration never enter the repository.
- `screen-normalization.json` exists and classifies every applicable row before
  the first wireframe is generated. A manifest without it is not reviewable.
- Every exported screen appears exactly once in `screen-manifest.json`, and
  every manifest file entry resolves to an exported file with a SHA-256. Export
  paths must differ by more than letter case: two names that are one file on
  Windows or macOS are refused, so the export set is portable.
- `screen-normalization.json` and every export are real files in the repository,
  not symbolic links to something outside it. A hash satisfied from an untracked
  target is not durable evidence.
- Every screen maps to applicable parity-map rows. A target-only screen instead
  cites an explicit owner-approved target requirement.
- An improvement that is one element of an otherwise faithful screen — a
  navigation component the legacy build never had, a confirmation it skipped —
  goes in that screen's `target_only_elements`: an entry per element, each naming
  an element the screen already declares and an owner decision that is approved
  and in scope. A screen cannot be both `target_only` and row-backed, so without
  this an approved addition has to be deleted or kept silently, and kept silently
  is indistinguishable from an invention nobody decided.
- Every applicable row is covered exactly once, as a screen, a state, an action,
  an overlay, navigation, or non-visual coverage. Coverage is bidirectional:
  no uncovered row, and no screen without rows behind it.
- Coverage includes every applicable role, channel, loading/empty/error/
  forbidden/success state, form validation state, dialog, wizard step, and
  transition.
- `export_set_version` identifies the complete immutable export set. Changing a
  screen, manifest entry, or export hash creates a new version.
- Stage 8 approval pins the exact `export_set_version` and its manifest
  SHA-256. A later material UI change returns to Stage 6 and repeats Stages
  7-8 for the changed scope.

## Verification

Use the repository's prototype audit when available. Otherwise record a manual
full-scope check of the same invariants in the Stage 7 report. Missing tooling
or missing required evidence does not count as passing.

The audit checks the structural half of parity-map coverage. The Stage 7 reviewer
remains responsible for the semantic half: that every applicable UI row really is
covered by the screen the record names, and that every screen has a reason a
reader would accept.

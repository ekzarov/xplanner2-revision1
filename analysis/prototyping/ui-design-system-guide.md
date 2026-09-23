# Shared UI Design System

**Which shared visual rules and reusable elements must every screen and implementation use?**

This is the mandatory procedure for UI work at Stages 5-9 and 13-19. It extends
the existing stages, not the stage count. The methodology owns transitions;
this guide owns the two source formats and their combined prototype baseline.

## Contents

- [Sources and ownership](#sources-and-ownership)
- [Stage 5: choose the foundation](#stage-5-choose-the-foundation)
- [Stage 6: evolve screens and components together](#stage-6-evolve-screens-and-components-together)
- [Stages 7 and 8: verify and approve](#stages-7-and-8-verify-and-approve)
- [Downstream consumption](#downstream-consumption)
- [Formats and validation](#formats-and-validation)
- [Changes and existing projects](#changes-and-existing-projects)

## Sources And Ownership

- `ui-design-system.md` answers **Which element/variant should I use, in which
  states, and where can I see it?** The Stage 5 agent drafts the foundation and
  the Stage 6 agent maintains the component catalogue. The human owner chooses
  the foundation at Stage 5 and approves the completed baseline at Stage 8.
- `ui-design-tokens.json` answers **What exact colors, fonts, spacing and other
  visual values must the implementation use?** The same agents author it. It
  is the sole source of these values; the catalogue refers to token names.
- `wireframes/*` contains both real screen exports and visual component sheets.
  A component sheet shows actual variants/states but is not a business screen
  and never creates a fake parity row. It is a shared resource in the manifest.
- `screen-manifest.json` pins all three together. There is no second UI manifest.
  `ui-ux-decision.md` records the foundation choice; `ui-ux-approval.md` records
  the owner's verdict on the exact complete set. Neither replaces the sources.

Use the supplied templates. Do not create a second token dictionary inside
SDD, OKF, CSS documentation or the catalogue. Generated CSS/framework themes
are derived outputs with a reproducible mapping to the approved tokens.

## Stage 5: Choose The Foundation

1. Read applicable parity rows, roles/channels and Stage 4 owner constraints.
2. Propose a small coherent foundation: semantic colors/themes; typography
   families, sizes, weights and line heights; spacing and layout scales;
   control sizes, borders/radii; responsive breakpoints; component library and
   icon set; focus, errors, disabled/loading/empty states and accessibility.
3. Draft the two files. Use explicit pending decisions; samples are not approval.
   The catalogue may have no finished components yet. Do not design a speculative
   library for every possible future screen or select the implementation stack
   prematurely. Record a framework-neutral component source when architecture
   has not selected a compatible library, and keep that compatibility open.
4. The owner chooses the foundation. Record its canonical `foundation` SHA-256
   in `ui-ux-decision.md` as `UI foundation SHA-256: <digest>`, with the existing
   explicit owner/date/scope decision. This pins the choices, not future screens.

The gate checks the pin mechanically later; it cannot decide whether the human
really approved the choices. A pending mandatory foundation choice blocks Stage 6.

## Stage 6: Evolve Screens And Components Together

1. Normalize behavior into screens/states/navigation as before.
2. Start with representative screens (for example list, edit form and dialog),
   using the approved foundation. Extract repeated elements into the catalogue
   while drawing; revise the representative screens and kit together.
3. Give each used variant a stable ID such as `button.primary` or `input.date`.
   Specify purpose, applicable states, property-to-token bindings, preview and
   usage/accessibility behavior. Resolve navigation, validation, keyboard focus,
   responsive behavior and empty/loading/error/disabled states where applicable.
   Explain non-applicable states; do not assume that every element has all states.
4. Reuse those variants on the remaining screens. Add a variant only when the
   actual scope needs it. Add named extension tokens for new needs within the
   approved foundation; do not change or override the frozen foundation.
5. Export real component sheets alongside screens. Each screen declares its
   used `ui_variants`; the manifest pins catalogue, tokens, component sheets and
   normal screen exports. No required control may be left to visual guessing.

Low-fidelity sketches may precede exact styling during drafting, but the Stage 6
handoff must specify the governed values and applicable component states.

## Stages 7 And 8: Verify And Approve

The independent Stage 7 reviewer compares behavior and screen coverage as before,
then checks screen-to-variant coverage, actual rendered values versus tokens,
consistent reuse, navigation, responsive layouts and applicable accessibility
states. Record expected/actual, findings and unverified scope in the existing
numbered review. The catalogue must describe what the exports actually show.
Green hashes or a list of variant IDs alone do not prove visual correctness.

Stage 8 presents the screens AND component sheets and their common rules to the
owner. The existing approval pins the full manifest hash/export version and
closing Stage 7 report, covering catalogue, tokens and preview resources too.
It is not approval of working code or architecture. Missing/unchecked required
variants block closure; only existing bounded Low-cosmetic rules permit deferral.

## Downstream Consumption

- **Stages 9 and 13-14:** read relevant approved prototype sources through the
  manifest. Architecture checks library/platform compatibility; OKF references
  the approved rules without copying a competing token catalogue. New platform
  constraints affecting the foundation return to Stage 5.
- **Stage 15:** read the pinned catalogue and tokens. In Used UI Control Inventory,
  map each control to its screen, stable `Governed variant`, approved element,
  token-based visual contract, applicable states and planned automated evidence.
  Plan shared theme/component work before dependent screens; do not invent values
  from screenshots. `sdd-record.md` reports the exact baseline and remaining gaps.
- **Stage 16:** independently verify these bindings and the planned tests. This
  checks design, not UI that has not been implemented yet. A missing/unsuitable
  approved variant returns to Stage 6, or Stage 5 for a foundation change.
- **Stage 17:** generate/map approved tokens into shared styles and reusable
  components in the selected stack. Screen code consumes them. Compare actual
  computed values, icons, responsive geometry and states with the pinned sources;
  record automated and peer-review evidence. No private per-screen replacement
  palette, guessed spacing or unapproved variant. Implementation defects stay at
  17; source-design changes return through Stage 15 to 6 (foundation to 5), then
  7-8 and affected SDD.
- **Stage 18:** check applicable deployed visual behavior using the same approved
  baseline, reusing valid exact-revision evidence without claiming local tests
  prove deployment. Regressions follow the existing return rules.
- **Stage 19:** include relevant kit/token expectations in the neutral Phase A
  extract, withholding prior results. Verify extracts against full sources only
  in Phase B. The independent reviewer checks actual deployed behavior.

## Formats And Validation

`ui-design-tokens.json` has `schema_version: 1`, a `foundation` object and an
`extensions` token dictionary. Foundation contains `component_library`, `icon_set`
and `tokens`. Both dictionaries use unique dotted names and `{ "type", "value" }`.
Types are `color` (six/eight-digit hex), `dimension` (non-negative px/rem/em),
`fontFamily` (non-empty family/fallback list), `fontWeight` (100-900), and `number`
(non-negative finite value, including unitless line height). An exact `{token.name}`
value aliases another token of the same type. Aliases must resolve without cycles;
foundation may not depend on extensions. Modes can use separate named tokens;
the catalogue defines which mode applies. This deliberately small format is not
a claim of full DTCG interoperability. `_schema_help` is explanatory.

The catalogue has one `## Components` table with these exact columns:
`Variant | Purpose | States | Tokens | Preview | Usage and accessibility`.
Variant IDs and token names use lowercase dotted/hyphenated identifiers.
States and token bindings are semicolon-separated; bindings are `property=token.name`.
Preview is a manifest resource path, optionally followed by a fragment. Every
catalogue variant is used by a screen; speculative unused variants are not required.

Manifest version 4 adds `ui_design_system` with `catalogue` and `tokens` pinned
`{path, sha256}` entries plus `resources` (the component preview files under
`wireframes/`). Visual screens each carry non-empty unique `ui_variants`. For an
entirely non-visual scope, use `ui_design_system: null`, no screens/variants or kit
files; the existing non-visual coverage and owner-decision rules still apply.

`audit:prototype` validates schemas, safe paths, hashes, foundation pin, token
types/aliases and variant/preview references. `audit:prototype:approved` additionally
checks the existing owner approval and closing review. `audit:sdd` resolves each
governed control variant against this pinned set. These are mechanical checks,
not a substitute for human choice, independent semantic review or rendered UI tests.

`audit:ui-parity` also validates these pins before running the configured visual
checks. It supplies `UI_APPROVED_DESIGN_SYSTEM` (the pinned source entries, or
JSON null for the explicit historical/non-visual boundary) and
`UI_DESIGN_SYSTEM_ROOT` (their absolute base directory). The project runner must
read applicable variant/token expectations and assert actual rendered values and
states. Passing those source references alone does not prove that the runner's
assertions are complete; Stage 17 peer review checks that coverage.

## Changes And Existing Projects

Foundation changes return to Stage 5. Within-foundation variant/screen changes
return to Stage 6. Both repeat affected Stage 7-8 controls and downstream impact
checks before use. A manifest or token hash refresh is never a new approval.

New projects and every new/reopened prototype export set use version 4. An existing
approved version-3 set may remain byte-identical under an explicit maintenance
pin in [`config/project.yaml`](../../config/project.yaml) at `prototype_compatibility`: exact manifest, approval
and decision SHA-256, source revision, recorder and reason. This is a narrow
historical compatibility record, not a waiver or evidence that a UI kit exists.
It cannot be refreshed to cover a changed prototype. A changed set must adopt
version 4 and complete the affected design/review/owner cycle. Keep old reports,
approvals, hashes and project status unchanged. Never silently manufacture a
retrospective owner choice or call newly extracted values approved.

The XPlanner historical example remains usable on this explicit boundary; its
next changed UI baseline must supply the new kit. Reusable examples/templates
show the new format without claiming that historical project evidence already
passed these new checks.

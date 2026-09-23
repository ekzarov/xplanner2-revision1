# Visual Parity Preflight Checklist

Use this checklist before every UI correction, Stage 17 pass and Stage 18
deployment. The approved wireframe export and, for manifest version 4, the pinned
`ui-design-system.md` and `ui-design-tokens.json` are the sources; memory, a generated
screenshot and a generic statement such as "looks similar" are not evidence.

## What Visual Parity Is For

Visual parity proves that the implemented screen still expresses the exact
owner-approved UI contract. It is separate from a functional test: a button may
submit correctly and still be wrong because its label, icon, position, wrapping,
role visibility, empty state, hover behavior or mobile composition differs from
the approved wireframe and manifest.

The checklist is used while correcting UI, by the Stage 17
`commands.visual_parity` run, and again against the public Stage 18 deployment.
The command receives the approved export-set and manifest hashes plus the exact
affected surfaces. It must fail when any required surface or state is absent;
the configured percentage is only a numeric image-similarity floor and never
reduces semantic coverage below 100%.

**Example:** the XPlanner `Insert time` action works, but its text wraps onto two
lines although the approved screen keeps it on one line. Functional tests pass;
visual parity fails until the width, typography or approved design is reconciled.

## Structure and Content

- page shell, regions, table columns and control order match the approved source;
- representative populated values preserve copy, case, punctuation and hierarchy;
- missing values preserve the exact glyph or text (`—`, `N/A`, `Not set`, etc.);
- links, plain text, booleans, badges, status labels and icon actions keep their
  distinct visual treatment;
- long names, translated text, wrapping, truncation and overflow are exercised;
- loading, empty, error, validation, forbidden and success variants are covered
  when declared by the manifest or source.

## Computed Appearance

- font family, size, weight and line height;
- foreground, background, border and state colors;
- width, height, radius, padding, gap and alignment;
- exact icon library, icon id, size, weight, order and selected treatment;
- row density, separators, header treatment and responsive composition.

## Page Frame Ownership

- name the component that owns the outer top and left page inset;
- sibling destinations in one navigation group must compare breadcrumb,
  navigation and primary-heading coordinates at the same viewport;
- feature pages may space internal content but must not add a second outer
  padding or margin on top of the shared shell;
- add a source ownership gate and a browser coordinate assertion when the same
  frame is composed by multiple independently implemented screens.

## Shared UI Sources

Follow [the shared UI procedure](ui-design-system-guide.md). Read the approved
catalogue/tokens and component previews through screen-manifest.json. Verify
all used variant IDs, property-to-token mappings, applicable states, themes,
responsive geometry and accessibility. Generated shared styles derive from
these values; local overrides cannot redefine them. A missing approved variant
is returned through design, not invented during coding. Preserve the explicit
compatibility boundary of unchanged historical version-3 sets.

## Governed Control Inventory

- enumerate every control actually rendered by the affected slice; do not rely
  on a sample button or one representative screen;
- map each rendered control to its approved wireframe element and governed
  shared variant (`primary-action`, text link, icon action, input, select,
  checkbox, dialog action, table control, or another explicitly documented
  project variant);
- assert the exact shared contract for every instance: font family, size,
  weight and line height; icon library, id, size and order; geometry, palette
  and applicable states;
- fail when a control has no inventory entry, when a feature-local rule changes
  a governed shared variant, or when two instances of one variant compute
  different styles;
- add a new variant only when an approved wireframe genuinely requires one.
  The checklist grows from controls the product uses, not a speculative list of
  every control HTML can provide.

## Interaction

- activate hover, focus, pressed, selected, disabled and expanded states rather
  than inferring them from static HTML;
- verify the source-derived computed style before activation and the computed
  style or behavior after activation;
- execute useful navigation and actions, including keyboard focus where relevant;
- confirm button-like links remain buttons visually while text links retain their
  approved feedback;
- classify icon-only anchors separately from text links: assert their exact icon
  id and source-derived color/fill hover treatment, never require text-link
  underlining merely because the icon glyph has textual DOM content.

## Navigation Availability

- enumerate every role-aware destination for each applicable role;
- render no destination or empty placeholder when permission is absent;
- use a disabled item only when permission exists but required context or an
  explicitly deferred implementation is unavailable, with a localized reason;
- verify the active link when both permission and context exist;
- exercise the direct URL separately and prove server-side refusal for an
  unauthorized role;
- fail when two destinations communicate the same authorization outcome through
  different hidden/disabled treatments without an explicit owner decision.

## Evidence Rule

Every approved screen has a `content fidelity` row in its SDD style table and
browser assertions based on representative source examples. Any standalone
placeholder detected in the approved HTML must appear literally in both the
approved-value contract and its automated assertion. A reviewer points to the
missed checklist item and returns the slice to Stage 15 or 17; the checklist is
not merely historical review commentary.

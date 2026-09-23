# Feature Dependency View

**Which slices supply a prerequisite, what depends on them, and what remains unassessed?**

This view follows the [feature dependency graph contract](../feature-dependencies-guide.md).
A new Starter without a project graph shows an explicitly illustrative example.
The canonical rules remain [English Markdown](../feature-dependencies-guide.md).

## Contents

- [Generate](#generate)
- [Read](#read)
- [Libraries](#libraries)

## Generate

Run `node analysis/feature-canvas/build-data.js` after a governed graph change;
`--check` fails if the committed projection is stale. The build validates the
project graph before rendering. It never edits source artifacts or approvals.
Serve the repository with an HTTP server and open this directory's index.html.
Source links are repository-relative; a publishing adapter may set sourceBase.

## Read

Choose a slice in the keyboard-accessible list. The default view shows its direct
providers and consumers; filters distinguish design-contract and completion
relations. The visible legend defines both relations with a shared report/time-entry
example: a design contract agrees data and behavior before provider implementation;
a completion dependency includes the provider in verified completion scope.
"Both relation types" shows both, including two relations between the same nodes.
The legend is identical in 3D and plan view; colors describe dependency conditions,
not readiness. Solid lines are explicit source statements; dashed lines are
reconstruction/proposal candidates. Neither proves independent approval.
Search indexes feature IDs/titles/groups, linked parity-scenario text, recorded
dependency conditions, open questions and quoted source text. The parity text is
derived from the graph's hash-checked workbook, not a separate editable index.
It does not crawl arbitrary repository files or translate English project evidence.
Numeric input matches exact feature numbers or exact parity rows; `#260`,
`row 260` restrict it to a parity row; legacy localized query aliases still work. Multiple text terms may
occur in any order. Dropdown suggestions identify the matching field/row and show
a short excerpt; arrows and Enter select, Escape dismisses, and pointer/touch
selection works too. Choosing a result focuses that node in 3D/plan view or its
card in Work order without changing graph filters or dependency computations.
Fullscreen keeps search available. Clickable blocks/links show a pointer cursor;
empty canvas stays a pan cursor and dragging uses the grabbing cursor.
**Slice links** follows the selected slice. **Whole graph** keeps every slice
(including nodes without recorded links) and every relation allowed by the filters
on one canvas. Selecting a node opens its details without collapsing the graph or
resetting the camera. The selected node, its direct providers and consumers, and
its incident arrows stay opaque; unrelated nodes and arrows fade but remain
clickable. Active relation and candidate filters also apply to this emphasis.
The close button (or Escape) clears selection, closes the panel and restores full
opacity in Whole graph. Closing Slice links returns to Whole graph. A bare
`?view=all` opens without selection; a valid `slice` link opens its details and
emphasis. Switch back to Slice links to explore the last selected neighborhood.
Use `?view=all` to open the whole graph directly; `slice` remains valid.
The viewer is English-only; legacy `lang=ru` links normalize to `lang=en` without
changing the selected slice, view or other filters.
The whole-graph layout uses stepped display planes in 3D. Plan view flattens the
planes but retains the same obstacle-avoiding orthogonal routes and separate ports
for parallel relations. Layout is stable when selecting nodes or filtering edges.
The level-spacing slider changes only visual depth, not dependency order. Compact
routing corridors leave each relation and endpoint distinct. The graph stays in
the viewport with a collapsible legend; the overview map moves the camera without
changing selection, filters or evidence. Dragging pans by default, with an explicit
orbit toggle. Zoom follows the pointer. Fit-all, focus-selected-slice and
fullscreen controls avoid repeated scrolling. The overview map also accepts arrow
keys. On narrow screens the details panel overlays the graph and closes normally.
Unselected whole-graph arrows use reduced contrast; selecting a slice highlights
its incident arrows and fades unrelated links. Closing details restores overview
contrast. Neither camera movement nor highlighting changes dependency meaning.
Slices without recorded links stay visible beside the routed component; their
placement does not establish independence. Visual bands use all recorded relations
for legibility, including candidates, and are not a delivery schedule or approval.
Changing the camera can still cause perspective occlusion; use plan view to inspect
the routed node footprints without depth.
The details show conditions, sources, row mappings, unknowns and the confirmed
transitive completion scope. A node without review is unassessed even with no edges.
**About this feature** leads the selected panel with the canonical node's English
`metadata.description`, before review status and dependencies. It describes
purpose and scope, not delivery status. The SDD and source basis remain linked.
The same description is searchable and available in both Graph JSON and Order JSON.
Older nodes without it show an explicit missing-summary message, never a guess
from the title. Authors follow the [description contract](../feature-dependencies-guide.md#file-format).
3D and plan view use the same English source and labels. **Graph JSON** links to
the canonical dependency facts; **Order JSON** opens the generated `data.json`,
including the computed iteration groups and their limitations for agent use.

**Work order** (`?view=order&order=completion` or `order=contract`) shows the
[dependency-iteration projection](../feature-dependencies-guide.md#work-order-projection).
It keeps design-contract order separate from completion order. Iterations are relative
to recorded dependencies, not slice IDs or current delivery progress. Draft scope,
unknown order, hidden candidate blockers and cycles remain explicit. The
candidate filter is preserved by `candidates=0` links; hiding candidates never
turns their consumers into first-iteration choices. A selected
slice shows its exact prerequisites and dependents; other cards fade. Closing
details clears emphasis without leaving Work order. Search filters the catalogue
and navigates to the result; it never changes iteration computation. Iterations
are dependency groups, not time-boxed sprints or a promise of readiness.
Projection schema version 2 emits `rows[].iteration` and `iterationCount` under
each `workOrder` axis/filter, with `language: "en"` and English `workOrderMeaning`.
Read `draft`, `reason` and prerequisite fields before interpreting a number.
Generate and check this JSON instead of editing it by hand.

## Libraries

Graph algorithms use pinned @dagrejs/graphlib in the audit toolkit.
Build-time layout and orthogonal edge routing use pinned [ELK.js 0.12.0](https://github.com/kieler/elkjs)
(EPL-2.0 OR GPL-3.0-or-later); no extra layout runtime is downloaded by the browser.
The build rejects missing routes, overlapping node rectangles, detached endpoints
and routes crossing node interiors. Node tests cover cycles, parallel edges,
high fan-in, isolated slices, reproducibility and 3D/plan coordinate agreement.
Rendering reuses the repository's Three.js r185 and OrbitControls distribution;
its MIT license is in vendor/THREE-LICENSE.
Button icons use pinned lucide 1.46.0; its license is in vendor/LUCIDE-LICENSE.
See [JSON Graph Format](https://github.com/jsongraph/json-graph-specification),
[Graphlib](https://github.com/dagrejs/graphlib) and
[Three.js](https://github.com/mrdoob/three).

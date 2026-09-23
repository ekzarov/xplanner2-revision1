# Feature Dependencies

**What must be agreed or available before this feature can be designed or completed, and what may a change affect?**

> [!IMPORTANT]
> **Planning and review evidence, not permission to implement or release.**
> A structurally valid graph is not a complete dependency analysis. Unknown scope,
> candidate edges and historical reconstructions never mean ready.

## Contents

- [Sources and ownership](#sources-and-ownership)
- [Meaning of a dependency](#meaning-of-a-dependency)
- [Required stage actions](#required-stage-actions)
- [File format](#file-format)
- [SDD and completion](#sdd-and-completion)
- [Validation and viewing](#validation-and-viewing)
- [Work order projection](#work-order-projection)
- [Existing projects](#existing-projects)

## Sources And Ownership

The single project source is `analysis/feature-dependencies.json`, created from
`feature-dependencies.example.json`. Use the supplied schema. This is a small
JSON Graph Format-compatible profile: directed nodes/edges plus domain metadata,
not a second requirements document or a second migration-status ledger.

The Stage 9 agent proposes the first bounded delivery graph. The coordinator
records checked changes proposed by the responsible Stage 9 or Stage 15 agent.
Independent reviewers at Stages 10 and 16 check scope, conditions and omissions;
they write existing numbered review reports, not the author's graph. The
coordinator links the exact reviewed node scope afterwards. This metadata-only
update makes the graph U at Stages 10/16; the independent reviewer does not edit
its dependencies. Stage 9 creates it; Stage 15 refines it. The human owner
decides scope, priorities, deferrals and required approvals. Neither reviewer
agreement nor a graph color replaces those decisions.

A node is a useful delivery slice, not a whole business epic or each Excel row.
Reserve a stable `NNN-slug` ID before creating its SDD; sequence numbers are
identifiers, not scheduling priorities. Group related nodes by business area.
Split an oversized prerequisite if only one useful part is required; do not
force completion of an entire module to obtain one read contract.

The parity map owns behavior and its dispositions. Traceability owns delivery
and deferred row contracts. The graph owns dependencies between planned slices.
Graph row references describe planned scope and must match existing traceability
contracts once an SDD exists; they never overwrite those contracts. Progress and
acceptance come from the existing governed records, not editable graph statuses.
Architecture/OKF remain authoritative for technical contracts.

## Meaning Of A Dependency

Arrows go **provider -> consumer**. Two relations are allowed:

- `contract`: the consumer's design needs the named agreed contract. Provider
  implementation need not be finished; parallel implementation can be valid.
- `completion`: the consumer's completion scope also includes the provider.
  The condition explains the exact capability required, not merely "do A first".
  This relation does not prove actual deployment, acceptance or owner authority.

Each edge names a concrete condition and source basis. `confirmed` means that
the cited material explicitly establishes the dependency; it does not mean a
new independent review passed. `candidate` is an inference to investigate.
Never infer dependencies solely from numeric order, shared words, imports,
screen links or proximity in a roadmap. Code references are investigation leads,
not proof of a business prerequisite.

A node with no review is **unassessed**, even with no incoming arrows.
A reviewed node with zero incoming edges is an explicit bounded finding of no
known prerequisite, not proof about the whole system. Candidate incoming edges
and unresolved questions block a reviewed-ready scope.

Confirmed completion edges must be acyclic. Fix cycles by correcting a false
edge, splitting a contract/provider or planning a genuinely joint slice; never
delete an inconvenient edge just to pass the audit. Contract cycles indicate
joint contract design and must be explained; they are not automatically release
cycles. Delivery order is a partial order: the owner can prioritize among
eligible independent slices. The graph is not a calendar or a full regression
oracle; shared technical changes may require checks beyond its known edges.

## Required Stage Actions

| Stage | Required action |
|---|---|
| 1-4 | Record source-backed prerequisites and owner constraints in existing discovery/revision records. Do not invent target dependencies. Stage 2 retains its blind Phase A boundary. |
| 9 | Create/update the graph, enumerate planned slices and their map scope, explain every dependency and unknown, and run the structural audit before handoff. |
| 10 | Independently challenge graph completeness, direction, conditions, cycles and the proposed architecture contracts; cite node/edge IDs and scope digests in the existing review. |
| 11-12 | Owner decisions and closure checks include relevant planning constraints. An owner preference never silently removes a technical prerequisite. Read the graph; corrections return to 9. |
| 13-14 | Reference node/edge IDs and the approved contract sources in knowledge; do not copy the edge list or treat the whole mutable planning graph as an immutable architecture approval. Recheck meaning when affected dependencies change. |
| 15 | Read providers and consumers before designing the slice. Refine only the affected graph scope, record unknowns, bind SDD to the node digest and plan shared contracts before dependent work. Architecture changes return to 9. |
| 16 | Verify the exact node scope, all dependency conditions, completion closure and the SDD impact analysis. Record findings and the reviewed scope digest. The coordinator links the report only after that review. |
| 17 | Consume reviewed bindings; do not remove edges to unblock coding. New dependency/design findings return to 15 or 9. Verify actual providers/consumers and applicable shared-code impact. |
| 18-19 | Completion follows confirmed completion edges transitively. Verify actual delivery/evidence for that scope. Graph metadata does not prove that a prerequisite is live. Stage 19 receives neutral dependency expectations in Phase A and full graph/review records only in Phase B. |

Before every graph edit the coordinator checks the affected providers/consumers,
source revisions and semantic duplicates. After edits, recompute affected node
digests, invalidate obsolete review bindings, revisit impacted SDD and repeat
the relevant control/owner cycle. Unaffected node reviews remain usable.
For returns, use the exact triggering report and preserve old evidence.

## File Format

`graph.metadata` records `schema_version: 1`, `mode` (`governed` or
`historical-reconstruction`), author/date/scope and a map of named source pins.
A source contains repository-relative `path` and SHA-256. Every basis ID
resolves to a source. No absolute paths, path escapes, remote fetches or symlinks.
Use exact source snapshots; changed bytes require re-analysis, not a blind hash refresh.

Each node has a label and metadata: business `group`, `scope`
(`legacy-backed` or `target-only`), sorted unique `rows`, nullable SDD path,
non-empty `basis`, `unresolved` questions and nullable `review`.
For every new or reopened node, the Stage 9/15 author also writes an English
`metadata.description`: one to three short sentences (at most 800 characters)
answering **What does this slice do, for whom, and what important limit applies?**
Use the node's pinned basis and SDD, not its title or dependency arrows alone.
Say explicitly when the slice records evidence, a deferral or a removal decision
rather than delivering runtime behavior. Do not turn planned scope into a claim
of implementation or approval. The coordinator maintains this summary together
with the node; Stage 10/16 reviewers compare it with the cited scope.

Descriptions are plain text, not Markdown. They appear first in the selected
feature panel in every viewer mode and participate in full-text search.
They are copied into the generated JSON for agents; do not edit a second copy
in the viewer. The SDD remains the detailed requirement source. Older nodes
without a description remain readable and show an explicit missing-summary
message; the audit warns, and the author adds the summary on reopening.
Description edits participate in the existing node-scope digest and therefore
require rechecking affected review bindings; they never silently reapprove them.

Legacy-backed rows use a pinned source named `workbook`, sheet User Flows.
Target-only nodes have no legacy rows and cite the actual owner decision.
For existing SDD, rows must equal the union of its delivered/deferred rows in
the pinned traceability source. This union is planned scope, not completion.

Each edge has source, target, relation and metadata:
stable `id`, `condition`, `assessment` (`confirmed` or `candidate`) and
non-empty `basis`. Multiple distinct conditions are allowed but duplicate
source/target/relation/condition tuples and self-links are rejected.

A review is `{source, scope_sha256}`: an exact review-record source pin and
the node digest that the reviewer actually checked. The digest covers the node
definition, its incoming edges, directly referenced provider definitions and
the relevant evidence pins; it excludes review pointers to avoid circular hashes.
Workbook row facts (not progress cells) and the exact slice parity contract also
participate. After checking a workbook/traceability change, refresh its source pin;
unchanged logical row/contract content keeps unaffected node digests stable.
A new/changed dependency invalidates the consumer binding. Review meaning and
independence must still be checked by the coordinator; file presence is not proof.
The review source must be a numbered analysis/reviews/stage-10-pass-NNN.md or
stage-16-pass-NNN.md. Its Dependency Review table has exactly these columns:
Node / Scope SHA-256 / Compared sources / Result / Findings or unchecked scope.
The referenced node must have one matching row with result `pass` and a bounded
conclusion. The audit verifies that recorded binding, not the truth of the review.

Do not use a graph-bound SDD or its graph review as its own dependency basis.
Requirements/architecture/owner decisions supply that basis. Historical imports
may cite old SDD because they are explicitly not newly bound or approved.

## SDD And Completion

For new governed SDD, put these exact fields in Change Impact and Verification Scope:

```text
- Completion dependencies: graph
- Dependency scope SHA-256: <digest printed by the dependency tool>
```

There is no hand-maintained second list. The slice ID selects its graph node.
Stage 15 binds the current digest; Stage 16 reviews it; Stage 17 handoff and
completion require a matching recorded review. The two markers do not authorize
implementation. Required architecture/knowledge/owner gates remain separate.

Run `node analysis/tools/feature-dependencies.js --scope NNN-slug` to inspect
providers, direct completion prerequisites, transitive completion scope, candidate
edges, unknowns and the digest. Structural validity permits drafting but is not
reviewed readiness. `--require-reviewed --scope NNN-slug` checks reviewed scope
including transitive completion providers. It does not run product tests.

The first required sequence is recorded in specs/README.md as
`Feature dependency checks required from feature sequence: 001` in new projects.
Existing projects may explicitly retain older exact records below a maintenance
threshold. Any reopened slice follows the new rule regardless of its number.
Missing policy is an error, not an exemption. Old explicit completion lists keep
their prior meaning below the threshold; graph-based SDD never falls back to them.

## Validation And Viewing

`audit:dependencies` checks the schema, source pins, references, workbook rows,
traceability agreement, review digests, duplicates and confirmed completion cycles.
The audit cannot discover an omitted real dependency or judge owner authority.
At Stage 9 the graph may be draft; later named closing conditions require reviewed
affected scope. No automatic green color claims independent or owner approval.

The separate Feature Dependencies 3D view is generated from this file, never
edited as an independent model. It shows provider/consumer direction, both edge
types, candidate edges, unknown nodes, conditions and source links. Confirmed
completion levels and closure remain separate from display coordinates. The
whole-graph view arranges all recorded links, including candidates, into stepped
display planes and routes arrows around node footprints; plan view removes depth
without changing those routes. Visual positions are not a promised schedule,
a new dependency, readiness or approval.
Scope filters show prerequisites and dependents; absence of an edge is not proof
of no impact. A table/list remains available for scanning and keyboard access.
The dependency viewer and its JSON projections are English-only. Legacy `lang=ru`
links open the same English view. The separate process diagram retains its own
presentation languages. Source evidence and governing instructions stay English.

### Work Order Projection

The derived **Work order** view groups slices into dependency iterations, not a
calendar, time-boxed sprint, implementation priority or permission to start.
Iteration numbers are computed dependency groups, not the application's own
business iteration IDs. It has separate axes:
contract iterations describe the order of agreeing provider contracts for design;
completion iterations describe the order of satisfying provider completion obligations.
Contract iterations never require finishing all provider code before consumer design.
Independent slices in an iteration have no recorded ordering constraint on the selected
axis; this alone does not establish resource availability or permission to work.

The viewer computes longest prerequisite-path levels for the selected relation.
Candidate edges are included only in an explicitly draft projection. Unreviewed
or unresolved nodes with recorded links may appear in draft iterations; this keeps the
partial proposed order visible without claiming that prerequisites are complete.
A draft qualification propagates to downstream iterations. Historical and illustrative
projections are always draft, even when an individual link is source-explicit.

Unassessed isolated nodes stay in **Order unknown**, not Iteration 1. Hiding candidates
must not turn their consumers into independent starting points: those consumers
and affected descendants stay unordered. Cycles and their affected descendants
also remain unordered; contract cycles require joint contract clarification,
while completion cycles require correction. The panel names the reason and the
recorded prerequisites. A reviewed, question-free isolated node can appear in
Iteration 1 only as a bounded recorded finding, never as automatic authorization.

Selection, search and display filters do not create dependencies or approvals.
Actual permission and provider availability must be checked in the existing
stage, review, delivery and owner records. No readiness or progress state is
written back by this view.

Agents read the source graph for dependency facts and may read the generated
[view JSON](feature-canvas/data.json) for the same computed iteration groups shown
on screen. Regenerate it with `node analysis/feature-canvas/build-data.js` and
verify it with `--check` before use. Projection schema version 2 uses
`workOrder.<contract|completion>.<proposed|explicit>.rows[].iteration` (one-based,
or `null` when order is unknown) and `iterationCount`; the old `wave` and
`waveCount` fields are no longer emitted. `proposed` includes candidate links;
`explicit` hides them but keeps their blocked consumers unordered. Read `draft`,
`reason`, `prerequisites` and `hiddenPrerequisites` as well as the number. Neither
the projection nor the source graph replaces governing Markdown instructions,
independent review, delivery evidence or owner authorization.

## Existing Projects

A reconstruction uses mode `historical-reconstruction`, the actual reconstruction
date/author, pinned source records, explicit candidates and unreviewed nodes.
It is never backdated. Every review pointer stays null. It cannot satisfy
`--require-reviewed`, authorize implementation or fill missing historical SDD
declarations. Preserve old approvals, manifests, migration status and product code.

To adopt the reconstructed graph for new/reopened work, the responsible agents
reconcile the affected scope against current sources and perform the normal
independent/owner controls. Change to governed mode is not itself approval.

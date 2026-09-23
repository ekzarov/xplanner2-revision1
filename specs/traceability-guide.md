# Traceability and Verification Links

**Which slice owns this behavior, where is its design, and where can I inspect what was actually checked?**

This is a process contract, not evidence that any feature passed. The Stage 15
agent creates the index; implementation and delivery agents maintain evidence
links; independent reviewers verify their meaning. Owner decisions authorize
scope, not successful test outcomes.

## Contents

- [Two Levels](#two-levels)
- [Stage Duties](#stage-duties)
- [Completion Scope And Post-Deployment Updates](#completion-scope-and-post-deployment-updates)
- [Evidence States](#evidence-states)
- [What a Verification Record Contains](#what-a-verification-record-contains)
- [Automated and Independent Checks](#automated-and-independent-checks)
- [Existing Projects](#existing-projects)

## Two Levels

The shared traceability index contains one `Slice Verification Index` row per
numbered feature: feature ID, links to its spec/plan/tasks, verification plan,
recorded results and evidence-link state. It does not duplicate every test.
Paths are relative to the shared index. Link to exact sections where useful.

`Parity Map Delivery Contracts` maps workbook rows to feature IDs and scope
authority. The owner-decision column may cite one or several applicable owner
records; it is not restricted to one Stage 16 filename. The decision must
actually cover these rows, conditions and deferrals. Requirements mappings
then connect individual behavior to the feature's requirement IDs.

Within the slice, the verification plan and execution records connect each
in-scope requirement and applicable NFR to concrete automated tests or manual
procedures. The chain is behavior -> requirement -> planned check -> recorded
observation at a specific revision. A feature name alone is not a design link;
a test name alone is not a result.

## Stage Duties

| Stage | Required work |
|---|---|
| 15 | The design agent adds links to spec, plan and tasks, and to the test-plan file or testing section of plan/spec. Map requirements and applicable NFRs to planned checks. Results may be `planned`; do not invent execution evidence. |
| 16 | The independent agent checks behavior-to-requirement-to-check coverage in both directions, including negative cases and permissions. Missing planned coverage returns to Stage 15. This verifies testability, not implementation success. |
| 17 | The implementation agent links actual tests/procedures and execution records with revision, environment, expected/observed outcome and gaps. The independent implementation reviewer checks the mapping and results before completion. |
| 18 | The delivery agent adds exact deployed-revision, smoke and public-journey evidence. Candidate tests cannot substitute for deployed evidence. Live observations, regressions and unverified scope are recorded in the same delivery report. Missing required evidence blocks delivery closure. |
| 19 | After the required blind inspection, the independent acceptance agent reconciles behavior, index and actual evidence. Missing/unverified required scope prevents a clean acceptance; the owner decides remaining scope, never retrospectively converts a failed test into a pass. |

Every changed or reopened slice follows this contract. Keep historical reports
immutable; add a dated follow-up rather than overwriting their observations.
Changing this index does not advance migration status or refresh an approval.

## Completion Scope And Post-Deployment Updates

`audit:sdd:slice` reads `delivery.active_slice` and the reviewed `Completion dependencies` field in each selected spec, following dependencies transitively. Missing or unknown scope blocks closure. Unrelated future slices may keep open tasks and planned evidence; their structural integrity is still checked. `audit:sdd:complete` checks every slice and remains mandatory for final completion. Dependencies are proposed at Stage 15 and challenged at Stage 16; `none` is an explicit reviewed claim, not the default for a missing field.

After deployment, only the existing Slice Verification Index row's `Recorded evidence` and `Evidence state` cells may change: append a link to an immutable Stage 18 report whose `Slice` matches that row, preserve previous links, and use `recorded` (not passed). No new/reordered rows or changes to behavior, scope, SDD links, plans or requirements are allowed in this records-only window. The history check examines every commit, including changes later reverted. SDD, inventory or cosmetic corrections return to their owning stage and require a newly reviewed candidate.

## Evidence States

- `planned`: checks are designed; no run is claimed.
- `missing`: no execution record is linked yet. This is an indexing gap, not
  proof that tests never ran.
- `recorded`: linked records contain execution observations. Their results may
  be pass, fail, blocked or mixed. This state does not mean passed or accepted.

Put explanations outside the exact machine-readable state cell. For old reports
with incomplete requirement mappings or revision metadata, name those limits
next to the index and in the follow-up record. Do not infer missing details.

## What a Verification Record Contains

Reuse the slice's existing verification/execution record family. If none exists,
the Stage 17 agent uses [verification-record.template.md](verification-record.template.md).
Existing immutable reports may be linked through a new follow-up with the same
fields; there is no mandatory renaming of historical files.

- Exact feature and checked commit or immutable build ID, execution date,
  environment, producer and commands/manual procedures.
- Requirement/behavior IDs and applicable NFRs, concrete check identifiers,
  expected result, observed result, outcome and durable evidence links.
- Separate passed, failed, blocked, not-run and excluded scope. Explain
  exclusions and cite any owner authority; waived is not passed.
- Independent review reference and remaining work. A self-review is not an
  independent verdict. Local/candidate and deployed evidence remain separate.

## Automated and Independent Checks

`audit:sdd` requires an index row for every numbered feature, validates local
SDD/plan/evidence links and exact state values, and rejects a plan presented as
an execution record. Planning can be green with explicitly missing results.
`audit:sdd:complete` additionally requires recorded evidence links; existing
task and workbook closure checks still apply. Neither mode executes linked
tests, validates their semantic coverage, nor certifies the contents of a
report. A `recorded` row containing failures cannot satisfy independent closure.

Delivery and acceptance agents must use both the existing delivery gates and
the independent checks above. Do not describe this new index check as an
automatic inspection of every test result by `audit:delivery`.

## Existing Projects

For an older `screen-manifest.json`, preserve removed requirement/test values
directly in the shared index's `Imported Legacy References` section, with
source commit/digest and an unverified disposition. Do not create a separate
handoff artifact. Keep raw imports fenced, outside authoritative requirement
tables, until the Stage 15/17 agents and independent reviewers reconcile them.
See the [upgrade procedure](../analysis/prototyping/README.md#upgrading-old-screen-manifests).

Backfill links from actual files, mark unresolved links `missing`, and describe
historical report limits without upgrading approvals or rerunning tests merely
to improve documentation. A completion audit may now expose indexing gaps in
old slices. Those gaps must be reconciled before a new closure claim; they do
not erase previous evidence or authorize changing the workbook's history.

## Feature Dependency Contract

analysis/feature-dependencies.json owns inter-slice prerequisites; this index owns behavior-to-SDD and evidence links. A graph node with an SDD must match its delivered/deferred row union here. Changing rows requires affected dependency review, not merely a new workbook pin. Keep dependency order out of the parity-delivery table.

See [the normative dependency procedure](../analysis/feature-dependencies-guide.md).

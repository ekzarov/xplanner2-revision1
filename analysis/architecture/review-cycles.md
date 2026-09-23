# Architecture Review Cycles

**Which exact owner decision and closure check govern this architecture, and what happens after a failed check?**

## Contents

- [Records and authority](#records-and-authority)
- [Selecting records](#selecting-records)
- [Repeated work](#repeated-work)
- [Record contract](#record-contract)
- [Gates and history](#gates-and-history)
- [Existing projects](#existing-projects)

## Records And Authority

Stage 11 produces `analysis/stages/stage-11/architecture-owner-verdict-NNN.md`.
The agent writes the human owner's actual decision, not an agent approval.
Stage 12 produces `analysis/stages/stage-12/architecture-closure-NNN.md`.
The responsible agent writes its own verification; a fresh independent agent is
not required at Stage 12. Stage 10 remains the independent architecture control.

These are separate numbered record families. Their numbers need not match:
an owner verdict with remarks returns work without entering Stage 12. Every
completed approved, remarks, passed, findings or blocked attempt is immutable.
Corrections to a completed record use a new record that cites the previous one;
never overwrite an earlier verdict, finding, result, date or attribution.

Stage 12 reads architecture but never edits its files or approved hashes. A
closure result is evidence, not another owner decision or an automatic transition.

## Selecting Records

The coordinator records a persistent `architecture_review.adopted_at` timestamp
when the new cycle contract is adopted. Clearing a current pointer never cancels
adoption. `architecture_review.records` is an append-only chronological register
of every completed attempt, each with exact `path` and `sha256`, including
attempts that did not cause a transition. Each new owner record cites the last
registered owner record and closure; each closure cites the last registered
closure and current owner verdict. No predecessor can be reset to `none` after
such a record exists. Preserve this boundary and register across future cycles.

The coordinator records exact project-relative paths in
`migration_status.yaml.architecture_review.owner_verdict` and
`migration_status.yaml.architecture_review.closure_report`. A missing current
closure is `null`, not an older passed report. Opening a new owner-review cycle
clears the current closure pointer but preserves all prior records and links.
Never choose records by directory order, filename maximum, modification time or
the word "approved". Each record identifies its exact scope, architecture set,
manifest digest and stage-entry timestamp.

Stage 11 forward-transition approval cites the selected owner verdict. A Stage
12 forward transition or return cites the selected closure report in
`gate_evidence`; findings also retain that path in the blocker evidence. Report
links in history remain valid even when the current pointers change.

Before and after Stage 12 verification, the responsible agent applies
[applicable error-prevention checks](../error-prevention.md). Record the concise
self-check and any proposed generalized lesson in the new closure report;
the coordinator validates and updates the shared checklist separately. Never
add later lessons by rewriting an immutable owner verdict or closure report.

## Repeated Work

1. A failed Stage 12 check records each original item ID, expected criterion,
   actual observation, evidence, result and classified return stage. New agent
   findings have new IDs and identify the agent as origin; do not attribute them
   to the human owner. Missing evidence is blocked, never verified-closed.
2. For an architecture defect, return to Stage 9 with that exact closure report.
   Stage 9 reads it, the linked owner decision and earlier unresolved items for
   the affected scope. It verifies findings, fixes affected architecture and
   records per-finding dispositions and evidence. The general
   [return protocol](../reviews/README.md#return-and-correction-protocol) applies.
3. A fresh Stage 10 agent checks the corrected set, dispositions and outstanding
   return findings. A prior clean pass cannot approve the changed set.
4. On re-entry to Stage 11, the preparing agent MUST read the triggering closure
   report, correction dispositions and fresh Stage 10 report. It presents what
   failed, what changed, exact evidence and remaining questions to the owner.
   The owner makes a new decision; the agent writes a new owner-verdict record.
5. Stage 12 reads the selected new owner verdict and exact approved architecture,
   carries forward applicable prior items under the same IDs, and writes a new
   closure report. It does not amend the Stage 11 report. Only passed closure of
   the exact currently approved set permits the Stage 13 handoff.

Parity-map defects return to Stage 1, screen/navigation defects to Stage 6, and
deliberate channel/design-system changes to Stage 5. The exact negative report
accompanies those returns too; repeat affected controls and owner decisions.
Unrelated scope is not silently folded into this review. A scope change or
withdrawal needs explicit attributable owner evidence, not a disappearing row.

With no remarks, Stage 12 still writes a short report: zero applicable items,
unchanged approved set checked, no fixes required. This is not proof of runtime
behavior. Every blocked or failed attempt remains history, including when the
next attempt passes.

## Record Contract

Both families use their named templates. Readable result tables are followed by one YAML `Record Binding` block, using
the exact field keys shown in the templates. `Record status: complete` is permitted only for a genuinely performed
decision/check; `historical-reconstruction` is an explanatory example that
cannot authorize a transition. `Recorded at` and `Stage entry` are ISO timestamps.
The numbered filename and `Record ID` must agree (`AOV-NNN` or `AC-NNN`).

The owner record pins the exact manifest, Draw.io and Stage 10 report, names the
human decision evidence, previous owner verdict and triggering previous closure
(or `none` on first entry). `Items For Closure` lists IDs, origin records,
observable criteria and affected scope. It retains applicable earlier items;
the human's new decision does not erase the agent's earlier negative finding.

The closure record pins its owner-verdict path and digest, architecture scope,
set version and manifest digest. It names the previous closure (or `none`),
records criteria versus actual evidence, and reconciles the counts of
`verified-closed`, `owner-dispositioned`, `open`, `failed` and `blocked` rows.
Explicit owner withdrawal or scope exclusion retains its ID/criterion and an
entry in the owner binding `dispositions` (id, decision and human evidence).
Closure records it as `owner-dispositioned`, never verified-closed. Passed
closure allows verified fixes plus these attributable dispositions, with zero
open, failed or blocked items. `Result` is `passed`,
`findings` or `blocked`. `Return stage` is `none` only for passed closure.
New findings use `AC-NNN-FNNN`; owner items use stable `AOV-NNN-RNNN` IDs.

Archived reports bind historical bytes. A new report must not require every
old manifest digest to match today's mutable manifest. Validate the current
set against the current records; follow immutable report links for history.

## Gates And History

`audit:architecture:approved` checks the selected actual owner verdict and its
exact architecture/Stage 10 bindings. It does NOT require a future Stage 12
report. `audit:architecture:closure` additionally checks the selected current
closure, report linkage, item coverage, counts, result and absence of unresolved
scope. Stage 13 consumes both records. A report from an earlier Stage 12 entry
cannot close the new entry, even when architecture bytes did not change.

Automated checks validate record integrity and completeness, not the semantic
truth of a claimed fix. The responsible agent performs the meaning/evidence
comparison. The review-history audit rejects edits, deletion or renaming of completed numbered records;
new records are allowed. Protection starts at the first completed revision,
including records first created and then changed within one PR or push. Adoption
and registered completed-attempt history cannot be removed or rewritten. Drafts and explanatory reconstructions never count as
approval or successful closure.

## Existing Projects

This is a prospective upgrade for the next new or reopened architecture-review
cycle. Initialize the two current pointers when adopting it; do not invent a
completed cycle, change the active stage, refresh old approval hashes or rename
historical evidence. The former fixed `architecture-review-verdict.md` and its
template are legacy records, not the output format for a new cycle.

Existing decisions may be cited as historical evidence. A reconstructed example
must retain its original dates, limits and links, clearly state which checks
were not performed, and remain `historical-reconstruction` outside the current
status pointers. A real future handoff requires actual new-cycle records.

# Process Revision 1.5: Combined Delivery

**What changed, and how do we keep earlier evidence honest?**

The owner-approved process change combines delivery and live reconciliation
in Stage 18. Independent slice/final acceptance moves from Stage 20 to Stage 19.
Bootstrap plus nineteen governed stages remain. This changes the workflow,
not the quality or approval requirements.

## Current Records

- The Stage 18 agent uses the delivery template and completes its required
  Live Reconciliation section. No separate live-revision record is created.
- The same report distinguishes executed delivery checks, additional live
  observations, uncovered scope, governed record updates and outstanding findings.
- Stage 18 owns environment, delivery, workbook, target and SDD completion gates.
  Required gaps prevent closure; passing automation does not supply approval.
- A fresh independent Stage 19 reviewer follows the blind acceptance procedure.
  New reports use `analysis/reviews/stage-19-pass-NNN.md`. The owner decides.
- `audit:stage19` is the scoped acceptance aggregate; `audit:all` still requires
  explicit final completion. Status schema 1.5.0 defines the new stage numbering.

## Historical Evidence

Do not rename, rewrite, rehash or reinterpret old reports to claim new checks.
An old Stage 19 live revision is not a new Stage 19 independent acceptance.
An old Stage 20 report keeps its name, source revision and historical meaning.
Old delivery reports may lack the new required section; they remain evidence
of what was actually checked, not proof of combined Stage 18 completion.

The current delivery audit deliberately fails closed on a missing reconciliation
section. To resume delivery, the agent must obtain current evidence and create
a new report for the exact revision, citing applicable earlier observations
without presenting them as freshly executed. The owner authorizes transitions.

## Existing Checkpoints

The migration agent checks the checkpoint against its original schema before
adopting 1.5.0. Preserve the old checkpoint in Git and record the upgrade commit.
For projects with no Stage 19/20 transitions or reviews, keep the current stage,
history, decisions and evidence unchanged; update only the schema version and
derived progress if the nineteen-stage denominator changes its rounded value.
This is a governance-format update, not a stage transition or new approval.

If a checkpoint contains old Stage 19/20 history or reviews, do not perform a
blind text substitution. Stop the upgrade, retain schema 1.4 with that historical
snapshot and require an explicit owner-authorized re-entry/migration plan.
Determine the applicable new stage from the actual obligations; no old live
revision may satisfy independent acceptance. Do not mark fresh checks passed
or discard historical records merely to satisfy the new schema.

# Process Departure 2026-09-30: Stage 2 Live-Check Carryover

**What does this project do differently from the Starter at the Stage 2 → Stage 3 gate, under whose authority, and what still stays blocking?**

- **Created by:** PM / Coordinator (process maintenance), Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** The owner `ekzarov` decides; PM maintains this record and the project-local implementation.
- **Governing instructions:** constitution governance, which lets a project record a decision to use a different process if it identifies the departure and does not claim full conformance; [Bootstrap Maintenance](../../MIGRATION.md#bootstrap-maintenance).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Project departure from the Starter: a Stage 2 exit may rest on owner-carried low findings instead of `clean`**
>
> The Starter requires a `clean` Stage 2 result before Stage 3. The owner authorized a narrow project exception. A usable, low-only Stage 2 `findings` pass may exit to Stage 3 when every finding is carried into a Stage 3 live check or an explicitly owner-accepted residual risk, under an exact owner decision. Findings stay findings. The project no longer claims full conformance with the Starter for this gate.
>
> **Next:** the owner merges this change. The Stage 2 → Stage 3 transition still needs the owner's Stage 3 grant.
>
> **Details:** [Rule](#read-rule) / [Blocking Classes](#read-blocking-classes) / [Implementation](#read-implementation).

<details>
<summary><strong>Contents</strong></summary>

- [Authority](#read-authority)
- [Rule](#read-rule)
- [Blocking Classes](#read-blocking-classes)
- [Implementation](#read-implementation)
- [Constitution Check](#read-constitution-check)
- [Limitations](#read-limitations)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-authority"></a>

## Authority

- **Owner decision:** `ekzarov`, chat message on 2026-09-30. It approves the project exception "to carry the three low findings into live checks or explicitly accepted residual risks without pass 010, without calling the result clean". The owner's stated priority is to move to live legacy verification (Stage 3) with less static depth and explicitly recorded residual risks.
- **Status:** it is recorded as owner decision `process-departure-stage2-live-carryover:xplanner2-revision1` in [`analysis/migration_status.yaml`](../migration_status.yaml). The first application is `stage-02-live-carryover:xplanner2-revision1`, which covers pass 009 in [`analysis/stages/stage-02/live-check-carryover-pass-009.md`](../stages/stage-02/live-check-carryover-pass-009.md).
- **Starter:** unchanged. The Starter's own rule and its CI are not affected.

<a id="read-rule"></a>

## Rule

A Stage 2 → Stage 3 forward transition may rest on the latest Stage 2 pass with `result: findings` only when all of the following hold:
1. **The pass is usable.** Its chain is valid and its reviewer eligible. It is not `blocked` or `invalid` and has no `unchecked_scopes`. Any disclosed incident has an approved non-material assessment.
2. **The findings are low and not blocking.** `findings_severity_max` is `low`, and PM attests that no finding falls into a [blocking class](#read-blocking-classes).
3. **Every finding is carried.** A carryover record lists each finding with either a concrete Stage 3 live check or an explicitly owner-accepted residual risk. It binds the pass session and the exact report SHA-256, which is also stored as `live_carryover.report_sha256`.
4. **The owner approved this exact carryover.** An approved owner decision has scope `liveCarryoverScope(pass)` (stage, pass, session, report path, report SHA-256, record), the same record and a nonempty residual risk, and is dated no earlier than the review.

Under Principle XII, a pass counts only for the Stage 2 entry in which it ran. The carried pass must therefore still be the latest pass of the current Stage 2 entry: no return to Stage 1 and no re-entry in between. Record corrections of carried findings happen later, at Stage 3 from live results or in a later correction. They are not claimed as independently verified.

<a id="read-blocking-classes"></a>

## Blocking Classes

These are never carried, and they keep the gate closed:
- lost reviewer independence or eligibility;
- an unreliable or changed baseline, source identity or provenance;
- missing or unchecked coverage, and `blocked` or `invalid` results;
- credential or secret exposure;
- anything that affects safe or isolated launch;
- systemic or unbounded impact;
- any finding above low.

<a id="read-implementation"></a>

## Implementation

The implementation is project-local. It is not part of `$staticFiles` except where noted.

- New module [`analysis/tools/stage2-live-carryover.js`](../tools/stage2-live-carryover.js) with tests [`analysis/tools/stage2-live-carryover.test.js`](../tools/stage2-live-carryover.test.js).
- [`analysis/tools/status-validator.js`](../tools/status-validator.js), a static file, gets four marked hooks:
  - structural validation;
  - evidence binding;
  - the carryover record as durable evidence;
  - the stage-02 forward exit, which accepts `clean` or a valid carryover.
  
  Every other gate is unchanged.
- [`analysis/migration_status.schema.json`](../migration_status.schema.json), a static file, gets the optional `live_carryover` review-pass field.
- Project-addition paragraphs in [`MIGRATION.md`](../../MIGRATION.md) and [`analysis/reviews/README.md`](../reviews/README.md).
- Later Starter syncs merge these marked hunks three-way. A conflict there is resolved in favour of keeping this rule while it is authorized.

<a id="read-constitution-check"></a>

## Constitution Check

- **Principle XII.** Every attempt keeps its immutable report and ledger entry. PM does not rewrite `findings` as `clean`: the ledger keeps `findings`. Carried scope is explicit, and nothing is claimed as verified.
- **Governance invariants.** Independent passes, immutable reports and fail-closed gates remain. The gate still fails closed on every blocking class and on any missing binding. The rule applies no global waiver. Unverified behavior is not reported as complete: the carried items are open.
- **Conformance.** The project identifies this departure and does not claim full conformance with the Starter methodology for the Stage 2 exit.

<a id="read-limitations"></a>

## Limitations

- The validator checks structure and bindings. It does not check the truth of the blocking-class attestation or the adequacy of the live checks; PM and the owner check those.
- This change authorizes no Stage 3 work. Stage 3 access, isolation, operations and data need the owner's separate grant.

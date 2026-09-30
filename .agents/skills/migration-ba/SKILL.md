---
name: migration-ba
description: Discover source-backed legacy behavior and prepare requirements or review that work in a separately assigned BA session.
---

# Business Analyst

Before source analysis, read [Source Readiness](../../../MIGRATION.md#source-readiness).
Missing, partial or unmatched implementation source requires an explicit scoped owner
fallback decision, not an assumed bytecode workaround. Report that boundary in RESULT.
When accepted source arrives later, reconcile existing row IDs and claims against it;
do not equate static support with live verification or restart authoring automatically.

In review mode, disclose diagnostic/output mistakes and follow
[Operational Incident Assessment](../../../analysis/agent_orchestration.md#operational-incident-assessment).
Assess impact from permitted evidence without opening forbidden context or
rewriting sealed output. Non-material assessment is not owner approval;
unknown/material safeguards block. Use only packet-authorized diagnostics.

Read [MIGRATION.md](../../../MIGRATION.md), the assigned stage and
[role contract](../../../analysis/agent-roles.md); ACK the task and skill version.

In correction mode, follow [Correction Scope And Handoff](../../../analysis/reviews/README.md#correction-scope-and-handoff):
amend findings and affected mechanisms, retaining valid unrelated records rather
than repeating Stage 1 discovery. Independent Stage 2 control remains separate.

1. Establish behavior from attributable source and permitted live observations.
   Separate confirmed facts, inference, unavailable scope and owner choices.
2. Follow the [reconnaissance guidance](../../../analysis/legacy_reconnaissance.template.md)
   and [parity-map instructions](../../../analysis/legacy_user_flows_template_instructions.md)
   only when those records are permitted inputs/outputs in the assignment.
3. Prepare requirement dispositions, criteria and SDD contributions without
   silently dropping behavior or approving a proposed target change.
4. In Stage 2 review mode, validate [the control mode](../../../analysis/reviews/README.md#stage-2-correction-validation).
   Full-blind saves its inventory before filled records or learned checks.
   Eligible correction-validation reads prior evidence immediately, checks the
   complete actual diff/affected mechanisms and justifies retained coverage.
   Neither changes the author's files nor reuses authoring or earlier review
   context. An unreliable baseline or unbounded impact requires fresh full-blind control.
   After a failed attempt, follow [Stage 2 recovery](../../../analysis/reviews/README.md#stage-2-attempt-recovery):
   distinguish the chronological predecessor from the last valid coverage base,
   independently resolve excluded observations and never inherit failed coverage.
   A blocked/invalid correction-validation return to bounded Stage 1 work needs
   the procedure's explicit owner authorization; observations alone do not grant it.
5. Self-check the allowed result and return evidence, gaps and questions to PM
   in the role contract's RESULT format; shared ledgers are PM's write scope.

At Stage 3, receive the PM deployment/access handoff before live checks. Record
the actual deployment operator separately from your behavior verification in the
walkthrough. Missing role accounts or unsafe test data go back to PM/owner;
deployment or reachability alone is not parity evidence. Follow
[the environment procedure](../../../config/REMOTE_SERVER.md#configure-before-remote-work).

Use [packet transport safety](../../../analysis/agent_orchestration.md#packet-transport-safety):
pre-filter or redirect large output to explicitly authorized project-local
scratch. Never open client spill files outside the allowed folders; disclose violations.

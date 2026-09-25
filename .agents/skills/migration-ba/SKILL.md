---
name: migration-ba
description: Discover source-backed legacy behavior and prepare requirements or review that work in a separately assigned BA session.
---

# Business Analyst

Read [MIGRATION.md](../../../MIGRATION.md), the assigned stage and
[role contract](../../../analysis/agent-roles.md); ACK the task and skill version.

In correction mode, follow [Correction Scope And Handoff](../../../analysis/reviews/README.md#correction-scope-and-handoff):
amend findings and affected mechanisms, retaining valid unrelated records rather
than repeating Stage 1 discovery. The next full blind Stage 2 remains separate.

1. Establish behavior from attributable source and permitted live observations.
   Separate confirmed facts, inference, unavailable scope and owner choices.
2. Follow the [reconnaissance guidance](../../../analysis/legacy_reconnaissance.template.md)
   and [parity-map instructions](../../../analysis/legacy_user_flows_template_instructions.md)
   only when those records are permitted inputs/outputs in the assignment.
3. Prepare requirement dispositions, criteria and SDD contributions without
   silently dropping behavior or approving a proposed target change.
4. In Stage 2 review mode, save the blind source inventory before opening filled
   records or learned checks; follow the [review protocol](../../../analysis/agent_orchestration.md).
   Do not correct the author's artifacts or reuse authoring context.
5. Self-check the allowed result and return evidence, gaps and questions to PM
   in the role contract's RESULT format; shared ledgers are PM's write scope.

At Stage 3, receive the PM deployment/access handoff before live checks. Record
the actual deployment operator separately from your behavior verification in the
walkthrough. Missing role accounts or unsafe test data go back to PM/owner;
deployment or reachability alone is not parity evidence. Follow
[the environment procedure](../../../config/REMOTE_SERVER.md#configure-before-remote-work).

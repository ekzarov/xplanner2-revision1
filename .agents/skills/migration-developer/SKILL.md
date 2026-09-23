---
name: migration-developer
description: Implement and deliver an approved vertical slice, contribute technical SDD feasibility, or independently peer-review code in a separate session.
---

# Developer

Read [MIGRATION.md](../../../MIGRATION.md), the assigned stage and
[role contract](../../../analysis/agent-roles.md); ACK the task and skill version.

1. At design time contribute implementation/test feasibility, not unapproved
   runtime code. At Stage 17 implement only the approved slice and dependencies.
2. Use configured project commands and the approved architecture/UI baseline.
   Cover both frontend and backend boundaries where the vertical slice needs them.
   Link requirements, tasks, tests and actual evidence under the
   [traceability contract](../../../specs/traceability-guide.md).
3. Run scoped tests and applicable learned checks. Escalate new assumptions or
   missing design through PM; do not rewrite approvals to match implementation.
4. In peer-review mode use a fresh eligible read-only session under the
   [review protocol](../../../analysis/agent_orchestration.md); return findings, not fixes.
5. Prepare the reviewed deployment/recovery procedure before Stage 18. PM obtains
   owner approval, coordinates access and runs the configured deployment (or explicitly assigns its
   bounded execution). Consume the actual operator's evidence, verify the deployed
   revision and own delivery checks/reconciliation and the report. Follow
   [the environment procedure](../../../config/REMOTE_SERVER.md#configure-before-remote-work).
   Local success is not live proof or acceptance. Stop and classify failures;
   use the methodology's return rules, not an automatic return to Stage 17.
6. Return files, versions, checks, gaps and next action to PM; no self-authorized
   merge, deployment, scope expansion or shared-status update.

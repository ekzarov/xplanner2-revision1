# Migration Entry Bridge

Read [AGENTS.md](AGENTS.md), then follow [MIGRATION.md](MIGRATION.md).
They govern this repository; this file is only a client entry bridge.

Use [the portable role contract](analysis/agent-roles.md). An assigned specialist
reads the exact repository-local `SKILL.md` named in its packet and returns ACK;
an unassigned process session coordinates as PM after the mandatory reading order.
Do not depend on native skill discovery or vendor-specific agent personas.
Preserve the Stage 2/19 blind-input restrictions. No role grants owner approval.

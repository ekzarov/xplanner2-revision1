# Agent Instructions

Read [`MIGRATION.md`](MIGRATION.md) before taking any action in this repository.
Follow its mandatory reading order and treat
[`.specify/memory/constitution.md`](.specify/memory/constitution.md) as the highest project authority.

Use [the portable role contract](analysis/agent-roles.md). An unassigned session
coordinates as PM; an assigned session follows its task role instead. PM delegates
specialist work with the exact repository skill path. Read that `SKILL.md` and
return ACK before work; do not depend on native skill discovery or simulate a
fresh reviewer by changing personas. Blind-review access restrictions still apply.

[`analysis/migration_status.yaml`](./analysis/migration_status.yaml) is the only current-stage checkpoint. If it is
missing, invalid, contradictory, or still at `bootstrap`, perform only the
bootstrap actions permitted by `MIGRATION.md`. Never infer owner ratification,
approval, review success, a command, or a stage transition.

Commands are defined in [`config/project.yaml`](./config/project.yaml). A missing file always fails
closed. A missing or `null` command fails when the active stage requires that
command: build and test from Stage 17, deploy, smoke, user journey, and rollback
from Stage 18. For web targets the user journey must submit the real deployed
form in a browser; API and health smoke cannot replace it. Do not substitute a
stack-specific command from experience. Never advance
migration status merely because a command or review passes; record required
evidence and wait for the explicit transition authority defined by the
constitution and methodology.

Before any remote operation, read [`config/environments.yaml`](./config/environments.yaml) and
[`config/REMOTE_SERVER.md`](./config/REMOTE_SERVER.md), then run
`npm --prefix analysis/tools run audit:environment -- --require-configured`.
An empty bootstrap environment is not remote readiness. Do not infer or substitute
a server, identity, host key, deployment root, or public endpoint.

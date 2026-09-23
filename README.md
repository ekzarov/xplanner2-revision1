# Legacy Modernization Starter

**Portable agent team:** PM delegates to BA, UX, Architect, Developer and QA.
Each assignment names a short repository skill, requires an acknowledgement,
and returns evidence through a common handoff protocol. [Roles and skills](analysis/agent-roles.md).
The instructions work across approved clients; actual session launch and
permissions depend on the runtime. Markdown does not install an agent service.

**Learned error prevention:** agents read applicable project checks before work,
self-check before handoff and generalize confirmed mistakes after control.
The coordinator maintains one concise table; the owner may prune it.
[Required procedure](analysis/error-prevention.md).
Blind Stages 2/19 read learned checks only in Phase B.


Reusable, evidence-driven scaffolding for modernizing legacy systems with
coding agents and explicit owner approval gates.

[Process cheat sheet](analysis/process-cheatsheet.md): each step's purpose,
inputs, produced results and updates to shared artifacts.

[`ARTIFACTS.md`](ARTIFACTS.md) is the canonical repository artifact map: what
every governed file is, why it exists, who updates it, whether it is
source-only, copied, generated, or created during migration, and what it
gates. Read it first when orienting in this repository or in an initialized
project.

The starter is intentionally independent of the legacy technology and the
target stack. Project-specific source code, requirements, decisions, review
history, and implementation evidence do not belong in this repository. New
projects receive an empty environment contract, never the starter's actual
credentials or server configuration. Public repositories can bootstrap without
remote access. Historical embedded keys still require rotation and history
remediation before the affected source repository can be made public; see
[`config/REMOTE_SERVER.md`](./config/REMOTE_SERVER.md).

## Prerequisites

- PowerShell 7 (`pwsh`) for the initializer, self-tests, and CI parity;
- Node.js 22 LTS and npm for deterministic audit tooling;
- Git;
- OpenSSH client tools (`ssh` and `ssh-keygen`) for governed remote
  connectivity and key verification;
- a spreadsheet application capable of opening `.xlsx` for the required
  visual workbook check (native Microsoft Excel is recommended but not
  required by headless CI).

## Status

The starter includes the repository entry point, universal unratified
constitution, governed migration methodology, blank parity workbook, reusable
stage/SDD/review/prototype/architecture templates, status schema, stack-neutral
command manifest, deterministic audit suite, CI workflow, and fail-closed
initializer. It contains no project-specific evidence or completed migration
history.

## Initialize a Project

Run the initializer with project identity supplied explicitly:

Use the approved fresh Starter source, not an initialized project's copied
script. The initializer rejects sources containing project control files so it
cannot inherit another project's constitution, decisions or evidence.

```powershell
./init-migration.ps1 `
  -TargetPath C:/work/my-modernization `
  -ProjectName 'My Modernization' `
  -ProjectOwner 'Owner Name' `
  -ProjectId 'my-modernization'
```

`ProjectId` is optional and is derived from `ProjectName` when omitted. The
initializer refuses a non-empty target by default. To overlay an existing
repository after reviewing it, add `-AllowNonEmptyTarget`:

```powershell
./init-migration.ps1 `
  -TargetPath C:/work/existing-project `
  -ProjectName 'Existing Project' `
  -ProjectOwner 'Owner Name' `
  -AllowNonEmptyTarget
```

The source starter is read-only, including when its dependencies are absent.
The initializer validates using target-local tooling; dependency installation
and cache writes stay in the target. It generates [`config/environments.yaml`](./config/environments.yaml)
from [`config/environments.template.yaml`](./config/environments.template.yaml), with no configured remote environment.
The obsolete `-ApproveSharedDemoCredential` switch is rejected: initialization
never copies a key, records credential approval or extends an expiry.

The safe flag permits an overlay; it does not permit overwrites. Before writing
anything, the initializer rejects collisions with initializer-owned paths. A
successful initialization creates `.migration-starter.json`. Matching reruns
with `-AllowNonEmptyTarget` preserve all existing project files and restore
only missing starter files. Metadata drift is rejected.

On first initialization, copied guidance and links are rendered for the new
project. Only newly created documents may change; existing files, machine
state and binary templates are excluded from this normalization.

Preservation is not an audit pass: findings in pre-existing editable owner
documents require an explicitly scoped correction, not a blanket rewrite.
Record failures in the report and status before waiting for correction approval.
`audit:status` also compares the project constitution's version with status,
including before ratification. To adopt a newer Starter in an existing project,
follow [Bootstrap Maintenance](MIGRATION.md#bootstrap-maintenance); do not rerun
the initializer as an upgrade or replace project records with empty templates.

The generated status remains `bootstrap`, the constitution remains
`unratified`, all history ledgers remain empty, and the commands in
[`config/project.yaml`](./config/project.yaml) remain `null`. The owner must ratify the constitution,
the project must record its legacy-source path, and the owner must explicitly
approve the first transition. Commands are configured before their first
governed use: `build` and `test` before Stage 17; `deploy`, `smoke`, and
`rollback` before Stage 18. Initialization never advances the stage.

An empty [`config/environments.yaml`](./config/environments.yaml) can pass
bootstrap structural validation, but cannot pass remote readiness. Before any
remote operation, configure owner-approved access following
[`config/REMOTE_SERVER.md`](./config/REMOTE_SERVER.md) and run
`npm --prefix analysis/tools run audit:environment -- --require-configured`.
Existing configured project files are preserved on a matching initializer rerun.

Run the initializer self-test from the approved, read-only Starter source:

```powershell
./tests/init-migration.Tests.ps1
```

Run the installed audit suite from the initialized project, not the source:

```powershell
npm --prefix analysis/tools ci --ignore-scripts
npm --prefix analysis/tools test
```

The initializer self-test is source-only and is not copied to new projects.
When writes are restricted to the project, create a project-local test temporary
directory and set `TEMP`, `TMP` and `TMPDIR` to it for both test commands. Also
set `npm_config_cache` to a project-local cache for dependency installation and
tests; restore all previous values afterwards. Tests use disposable fixtures, not project
approval or real remote credentials. Record the exact source path and revision.

## Agent Entry Point

Every agent starts with [`MIGRATION.md`](MIGRATION.md).

`MIGRATION.md` is the session router: it determines what the agent may do now,
which authority and current-state records it must read, and where it must stop.
After [`analysis/migration_status.yaml`](./analysis/migration_status.yaml) identifies the active stage, the agent
uses [`analysis/migration_methodology.md`](analysis/migration_methodology.md) as
the detailed procedure for that stage: inputs, work, actors, outputs, exit gate,
and return path. The two files are intentionally layered, not duplicates.

The entry point also routes the agent to the
[constitution](.specify/memory/constitution.md). A new project cannot advance
beyond bootstrap work until its owner ratifies that constitution and the
ratification is represented in the project status file.

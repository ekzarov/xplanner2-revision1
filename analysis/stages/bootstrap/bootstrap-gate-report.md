# Bootstrap Gate Report

**What was actually checked, what failed, and is the workspace ready for Stage 1?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **What exactly was executed, and why is Bootstrap green?**
- **Created by:** The initializer creates a pending report; the Bootstrap agent fills it from actual audit output.
- **Maintained / decided by:** The Bootstrap agent records reruns and corrections; the human owner authorizes entry to Stage 1.
- **Governing instructions:** Bootstrap audit and transition procedure
- **When used:** The active Bootstrap agent fills this fixed report after running the audit-toolkit regression tests, initializer self-test and every required readiness audit. It records exact commands, runtime versions, outcomes and remediations; migration_status.yaml keeps only the compact gate state and cites this report as gate_evidence.
- **How used:** The detailed project-specific evidence record for the Bootstrap readiness gate. It records the exact audit commands, runtime versions, results, failures and corrections that justify the gate outcome. migration_status.yaml remains the state authority and references this report rather than duplicating its command-level proof.
- **Example:** XPlanner recorded the Node and PowerShell versions, every Bootstrap command and result, and the failed methodology-link check plus its correction before the owner-authorized transition to Stage 1.

**What was actually verified:**

- Exact revision, environment, roles and scoped checks
- Expected condition versus actual observation, with evidence
- Passed or matching checks, differences and unexecuted scope kept separate
- Outstanding IDs, responsible actor, retry condition and next gate

Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `pending` (not yet run); `pass` (this check succeeded); `fail` (this check failed); `blocked` (this check could not complete). A green audit report does not ratify the constitution or authorize Stage 1 for the owner. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** [`analysis/stages/bootstrap/bootstrap-gate-report.md`](./bootstrap-gate-report.md)
> The initializer creates one project report at this fixed path. The active
> Bootstrap agent completes that report; do not number, rename, or duplicate it.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Bootstrap audits: pass (12 of 12 required checks); constitution ratified; Bootstrap not closed**
>
> After the owner-approved Starter synchronization to `ae3cca618cb4510345963710f1fd0c54d8a52373` and the authorized corrections, all 12 required checks passed. The first-run `audit:artifact-links` failure is resolved and preserved as history. Constitution `1.0.0` is ratified and the integration branch is `main`. Stage 1 authorization is still pending.
>
> **Next:** The owner confirms the exact Stage 1 authorization; commit and push of the ratification change remain a separate decision.
>
> **Details:** [Required Gate Evidence](#read-required-gate-evidence) / [Verification Boundary](#read-verification-boundary).

<details>
<summary><strong>Contents</strong></summary>

- [Project And Run](#read-project-and-run)
  - [Pre-Existing Input And Limitations](#read-pre-existing-input-and-limitations)
- [Purpose And Authority Boundary](#read-purpose-and-authority-boundary)
- [Runtime And Environment](#read-runtime-and-environment)
- [Required Gate Evidence](#read-required-gate-evidence)
  - [First Recorded Run (History)](#read-first-recorded-run)
- [Deviations And Remediation](#read-deviations-and-remediation)
  - [Starter Synchronization](#read-starter-synchronization)
- [Verification Boundary](#read-verification-boundary)
- [Final Assessment](#read-final-assessment)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-project-and-run"></a>

## Project And Run

- Project ID: `xplanner2-revision1`
- Project name: `XPlanner 2 Revision 1`
- Project owner: `ekzarov`
- Initialized at: `2026-09-23T10:22:40.9170855+00:00`
- Recorded by: `PM / Coordinator, Claude Code session d0ec1166-ffc9-446a-ba86-d768242e6de8 (model claude-opus-5-5)`
- Evidence captured at: first run `2026-09-23T10:23:23Z` to `2026-09-23T10:25:18Z`; post-synchronization run `2026-09-23T13:22:39Z` to `2026-09-23T13:24:29Z`; current run after ratification `2026-09-23T14:18:33Z` to `2026-09-23T14:20:23Z`
- Starter source revision (initialization and first run): `2ad915812d25853d1f4c857c0346978e4913c0b8` (owner-confirmed; local clean `main` of `C:/Work/Legacy/legacy-modernization-starter`, used read-only)
- Owner-approved Starter baseline (current): `ae3cca618cb4510345963710f1fd0c54d8a52373`, approved by owner `ekzarov` in chat on 2026-09-23 as a bounded Bootstrap Maintenance synchronization (see [Starter Synchronization](#read-starter-synchronization))
- Starter source revision actually used for the current run: `ae3cca618cb4510345963710f1fd0c54d8a52373` (HEAD verified, clean working tree; matches the approved baseline)
- Owner bootstrap authorization: owner `ekzarov` in chat on 2026-09-23 confirmed the starter revision, project name, owner, project ID and start of Bootstrap. This is not constitution ratification or Stage 1 authorization.
- Initializer command: `pwsh -NoProfile -NonInteractive -File C:/Work/Legacy/legacy-modernization-starter/init-migration.ps1 -TargetPath C:/Work/Legacy/xplanner2-revision1 -ProjectName 'XPlanner 2 Revision 1' -ProjectOwner 'ekzarov' -ProjectId 'xplanner2-revision1' -AllowNonEmptyTarget` (exit 0; created 251, preserved 0; `-ApproveSharedDemoCredential` not used)
- Post-initialization project edit: [`config/project.yaml`](../../../config/project.yaml) `paths.legacy_source` set from `null` to `legacy`.
- Constitution ratification: owner `ekzarov` ratified [`.specify/memory/constitution.md`](../../../.specify/memory/constitution.md) as version `1.0.0` with amendments A1-A3 (chat decision recorded `2026-09-23T14:14:26Z`). The document-level `Version` metadata and `constitution.version` in the status are both `1.0.0`. Stage 1 authorization is recorded separately and is still pending.
- Repository layout (owner decision `repository-layout:xplanner2-revision1`): [`config/project.yaml`](../../../config/project.yaml) `paths.target_source` changed from `'.'` to `target`. Only the directory [`target/`](../../../target) was created, with an empty `.gitkeep` so that Git keeps it. No stack was selected and nothing was generated.
- Integration branch: `main`, owner decision `integration-branch:xplanner2-revision1` (owner `ekzarov`, chat, 2026-09-23). The owner also authorized commit and push. The unchanged input ([`legacy/`](../../../legacy) plus the original bytes of `PREPARATION.md`) is committed to `main` first, and the Bootstrap changes are committed to the branch `bootstrap/init` for review.

<a id="read-pre-existing-input-and-limitations"></a>

### Pre-Existing Input And Limitations

- The target was non-empty before initialization: `PREPARATION.md` and [`legacy/`](../../../legacy). Neither was overwritten or normalized by the initializer.
- [`legacy/`](../../../legacy) is the XPlanner+ v1.1a4 WAR distribution with local run helpers, not a complete upstream Java source checkout. The WAR already contains a MySQL configuration patch from an earlier experiment and `demo-seed.sql` is a prepared demo fixture, as stated in `PREPARATION.md`. Provenance: `git archive` of source commit `c8fd12cefd4f5519622f9c86b8fcb2a1dfce4360`, source Git tree for the legacy directory `3bd350fa5559ce56d2ea6f5136a62197754d4dca` (provenance only; that repository was not opened).
- SHA-256 of the immutable baseline, verified before and after initialization and gate runs (all match `PREPARATION.md`):

| File | Bytes | SHA-256 |
|---|---:|---|
| [`legacy/README.md`](../../../legacy/README.md) | 2336 | `78b1a6b4c0e9fda7ec173f279a20d7b90645eb457c325483e6f1c876ac6e5460` |
| [`legacy/demo-seed.sql`](../../../legacy/demo-seed.sql) | 9387 | `2d32f7d5c6086c21f0df00f7e110a9a10bd259e8c2a9333cc1eb946033c3387e` |
| [`legacy/docker-compose.yml`](../../../legacy/docker-compose.yml) | 2124 | `e15cd9db799e6d20b199021fae832b7a9a450695395361dbc1bdab9d0969e9ff` |
| [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) | 29727650 | `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc` |

- Git provenance check: the Git tree built from the four files with the project's normal Git attributes is `3bd350fa5559ce56d2ea6f5136a62197754d4dca`, exactly the provenance tree stated in `PREPARATION.md`. Built from raw bytes it would be `51eaa5c4b97c31334ac0890a6a12420b8559a13e`. The reason: the exported [`legacy/demo-seed.sql`](../../../legacy/demo-seed.sql) has 108 CRLF line endings, while its Git blob stores LF. Its file SHA-256 above therefore holds for this Windows working copy (`core.autocrlf=true`); an LF checkout, for example on Linux CI, yields different file bytes from the same Git tree. No Git attribute was changed.
- [`legacy/docker-compose.yml`](../../../legacy/docker-compose.yml) must not be run unchanged (fixed project/container/volume names and port 8080); a separate reviewed launcher outside the baseline is required before any runtime work.
- **Independence limitation (owner-acknowledged 2026-09-23):** the starter payload contains illustrative examples and GitHub links from an earlier migration of this same legacy system (`olsys-ltd/xplanner2`), for example in [`analysis/tools/README.md`](../../tools/README.md), [`ARTIFACTS.md`](../../../ARTIFACTS.md), the methodology and the process/agent-system views. They are format examples only, not facts, requirements or approvals for this project. The PM does not follow those links, and blind Phase A packets at Stages 2 and 19 receive only a neutral routing extract that excludes these files.

<a id="read-purpose-and-authority-boundary"></a>

## Purpose And Authority Boundary

This report is the command-level evidence for the Bootstrap readiness gate. It
shows what the active Bootstrap agent executed, in which runtime, what passed or
failed, and how failures were corrected. It does not select the current stage.
[`analysis/migration_status.yaml`](../../migration_status.yaml) remains the state authority and must cite this
file in the Bootstrap transition's `gate_evidence`.

<a id="read-runtime-and-environment"></a>

## Runtime And Environment

| Item | Exact value | Evidence command or source |
|---|---|---|
| Operating system | `Microsoft Windows NT 10.0.26200.0` (Windows 11 Pro) | `[Environment]::OSVersion` |
| PowerShell | `7.6.6` | `$PSVersionTable.PSVersion` |
| Node.js | `v22.20.0` | `node --version` |
| npm | `10.9.3` | `npm --version` |
| Git | `2.50.1.windows.1` | `git --version` |
| Working repository | `C:/Work/Legacy/xplanner2-revision1` | working directory |
| Audited revision | uncommitted working tree on unborn branch `master` (no commit yet) | `git status --short --branch` |
| Remote environment state | `unconfigured` (`default_environment: null`, no environments) | [`config/environments.yaml`](../../../config/environments.yaml) and environment audit output |
| Write boundary | `TEMP`, `TMP`, `TMPDIR` = `C:/Work/Legacy/xplanner2-revision1/.migration-tmp/temp`; `npm_config_cache` = `.migration-tmp/npm-cache`; prior values restored after each run | runner `.migration-tmp/run-bootstrap-gates.ps1` (git-ignored) |
| Starter integrity after runs | first run: `2ad915812d25853d1f4c857c0346978e4913c0b8`; current run: `ae3cca618cb4510345963710f1fd0c54d8a52373`; both `## main...origin/main` with no tracked or untracked changes before and after | `git -C <starter> rev-parse HEAD`; `git -C <starter> status --short --branch` |

An unconfigured environment can pass Bootstrap structural validation. It does
not prove remote readiness or authorize access. Before the first remote action,
configure owner-approved access and pass `audit:environment -- --require-configured`.
Record credential approval only when the owner actually gave it; initialization
does not supply a key or renew an existing exception.

<a id="read-required-gate-evidence"></a>

## Required Gate Evidence

The Bootstrap agent replaces a pending result with `pass`, `fail`, or `blocked`
only after the recorded attempt. It links the concise durable output, including
exit code and observed result; a command name alone is not evidence. The expected
condition is successful completion of every required check and its own asserted
contract. A not-run check stays pending. A failed or blocked row
keeps Bootstrap open until it is rerun successfully or governed otherwise.

**Current results.** Starter `ae3cca618cb4510345963710f1fd0c54d8a52373`. The
current run `2026-09-23T14:18:33Z` to `2026-09-23T14:20:23Z` checked the
ratified-constitution working tree on branch `bootstrap/init` (commit `3c2d9c2`
plus uncommitted ratification changes), with the same write boundary as below. It
produced the same outputs and counts as the post-synchronization run
`13:22:39Z` to `13:24:29Z`, whose details are listed in the rows. Each check is
counted once at the current result.

| Check | Exact command | Result | Durable output or note |
|---|---|---|---|
| Install audit dependencies | `npm ci --prefix analysis/tools --ignore-scripts --no-audit --no-fund` | `pass` | Exit 0; `added 61 packages`; [`analysis/tools/package-lock.json`](../../tools/package-lock.json) SHA-256 `1b35fbd0bae7699ca01de202fac861fdae569b38d977da62a4c3a5857ee4b3c2` unchanged before/after. |
| Audit-toolkit regression tests | `npm --prefix analysis/tools test` | `pass` | Exit 0; 753 tests: 752 pass, 0 fail, 0 cancelled, 1 skipped (test 497, symlink normalization record: `this platform does not allow creating symlinks here: EPERM`). Includes the new [`constitution-version.test.js`](../../tools/constitution-version.test.js). |
| Initializer self-test | `pwsh -NoProfile -NonInteractive -File "C:/Work/Legacy/legacy-modernization-starter/tests/init-migration.Tests.ps1"` | `pass` | Exit 0; approved baseline matched: starter HEAD `ae3cca618cb4510345963710f1fd0c54d8a52373`, clean; temporary root under `.migration-tmp/temp`; `PASS: 1503 bootstrap initializer assertions`. Starter unchanged afterwards. |
| Status audit | `npm --prefix analysis/tools run audit:status` | `pass` | Exit 0; `STATUS VALIDATION OK` (includes the new constitution-version equality check, `0.2.2-draft` = `0.2.2-draft`). |
| Project audit | `npm --prefix analysis/tools run audit:project` | `pass` | Exit 0; `PROJECT CONFIG AUDIT OK`. |
| Environment audit | `npm --prefix analysis/tools run audit:environment` | `pass` | Exit 0; `Unconfigured environment contract is structurally valid; NOT remote-ready`. |
| Methodology audit | `npm --prefix analysis/tools run audit:methodology` | `pass` | Exit 0; `METHODOLOGY/LINK AUDIT OK`. |
| Error-prevention table audit | `npm --prefix analysis/tools run audit:prevention` | `pass` | Exit 0; `0 project checks; structure only`. |
| Process-view audit | `npm --prefix analysis/tools run audit:views` | `pass` | Exit 0; `PROCESS VIEW SYNC AUDIT OK`. |
| Responsibility audit | `npm --prefix analysis/tools run audit:responsibilities` | `pass` | Exit 0; 55 artifact families checked. |
| Artifact-link audit | `npm --prefix analysis/tools run audit:artifact-links` | `pass` | Exit 0; `ARTIFACT REFERENCE LINK AUDIT OK: 191 Markdown document(s) checked.` |
| Role-contract audit | `npm --prefix analysis/tools run audit:roles` | `pass` | Exit 0; `AGENT ROLE CONTRACT AUDIT OK`. |

<a id="read-first-recorded-run"></a>

### First Recorded Run (History)

Preserved unchanged as history, not counted in the totals. Starter
`2ad915812d25853d1f4c857c0346978e4913c0b8`, run `2026-09-23T10:23:23Z` to
`2026-09-23T10:25:18Z`.

| Check | Exact command | Result | Durable output or note |
|---|---|---|---|
| Install audit dependencies | `npm ci --prefix analysis/tools --ignore-scripts --no-audit --no-fund` | `pass` | Exit 0; `added 61 packages`; one upstream deprecation warning (`whatwg-encoding@3.1.1`). [`analysis/tools/package-lock.json`](../../tools/package-lock.json) SHA-256 `1b35fbd0bae7699ca01de202fac861fdae569b38d977da62a4c3a5857ee4b3c2` unchanged before/after. The initializer had already run the same `npm ci --ignore-scripts` into the target. |
| Audit-toolkit regression tests | `npm --prefix analysis/tools test` | `pass` | Exit 0; 747 tests: 746 pass, 0 fail, 0 cancelled, 1 skipped (test 491, symlink normalization record: `this platform does not allow creating symlinks here: EPERM`). |
| Initializer self-test | `pwsh -NoProfile -NonInteractive -File "C:/Work/Legacy/legacy-modernization-starter/tests/init-migration.Tests.ps1"` | `pass` | Exit 0; starter revision `2ad915812d25853d1f4c857c0346978e4913c0b8`; temporary root under `.migration-tmp/temp`; `PASS: 1490 bootstrap initializer assertions`; generated-target gates and toolkit tests passed inside the disposable fixture. Starter unchanged afterwards. |
| Status audit | `npm --prefix analysis/tools run audit:status` | `pass` | Exit 0; `Validated migration_status.yaml at bootstrap`, `STATUS VALIDATION OK`. |
| Project audit | `npm --prefix analysis/tools run audit:project` | `pass` | Exit 0 with `paths.legacy_source: legacy`; `bootstrap command contract remains fail-closed`, `PROJECT CONFIG AUDIT OK`. |
| Environment audit | `npm --prefix analysis/tools run audit:environment` | `pass` | Exit 0; `Unconfigured environment contract is structurally valid; NOT remote-ready`. |
| Methodology audit | `npm --prefix analysis/tools run audit:methodology` | `pass` | Exit 0; `91 documents checked; 19 current stages required`, `METHODOLOGY/LINK AUDIT OK`. |
| Error-prevention table audit | `npm --prefix analysis/tools run audit:prevention` | `pass` | Exit 0; `0 project checks; structure only`. |
| Process-view audit | `npm --prefix analysis/tools run audit:views` | `pass` | Exit 0; `PROCESS VIEW SYNC AUDIT OK`. |
| Responsibility audit | `npm --prefix analysis/tools run audit:responsibilities` | `pass` | Exit 0; 55 artifact families checked. |
| Artifact-link audit | `npm --prefix analysis/tools run audit:artifact-links` | `fail` | Exit 1; 8 findings, all in pre-existing `PREPARATION.md` (lines 20, 30, 39, 40, 41, 42, 58, 80): `repository path is not clickable` for `legacy/...` paths. See Deviations. |
| Role-contract audit | `npm --prefix analysis/tools run audit:roles` | `pass` | Exit 0; 6 roles and 20 stage assignments; `AGENT ROLE CONTRACT AUDIT OK`. |

<a id="read-deviations-and-remediation"></a>

## Deviations And Remediation

Record every failed or blocked attempt, including a link to the changed file or
commit that corrected it. Write `None` only when every required command passed
on its first recorded run.

| Check | Failure or blocker | Correction | Rerun evidence | Final result |
|---|---|---|---|---|
| `audit:artifact-links` (first run) | Eight plain-text `legacy/...` paths in pre-existing owner file `PREPARATION.md` (lines 20, 30, 39, 40, 41, 42, 58, 80) are not clickable links. The initializer rules forbid normalizing pre-existing files, while the Bootstrap gate matrix requires this audit over the whole repository. | Owner `ekzarov` authorized (chat, 2026-09-23) linkifying exactly those eight references in [`PREPARATION.md`](../../../PREPARATION.md) without changing meaning. Only the eight backticked labels became links to the same repository paths; reviewed word-diff: 8 lines changed, no other text. [`legacy/`](../../../legacy) unchanged. | First run `2026-09-23T10:25:17Z` exit 1; rerun 1 `2026-09-23T13:22:09Z`: no `PREPARATION.md` findings | `pass` (current run) |
| `audit:status` (after synchronization, before version correction) | The synchronized `status-validator.js` reported `FAIL: /constitution/version 0.1.0-draft does not match project constitution Version 0.2.2-draft` (exit 1; one ad-hoc run, exact time not captured). The initializer had rendered the stale `0.1.0-draft` default from the old status template. | Owner separately authorized correcting only [`analysis/migration_status.yaml`](../../migration_status.yaml) `constitution.version` from `0.1.0-draft` to the constitution's actual document metadata `0.2.2-draft`. This is a record correction, not ratification; the constitution was not modified. | Rerun 1 and current run: `STATUS VALIDATION OK` | `pass` (current run) |
| `audit:artifact-links` (rerun 1) | Four plain-text paths in new Starter text merged into [`MIGRATION.md`](../../../MIGRATION.md) (`Bootstrap In Practice` step 7 and `Bootstrap Evidence And Blockers`): [`analysis/stages/bootstrap/bootstrap-gate-report.md`](bootstrap-gate-report.md) (3) and [`analysis/migration_status.yaml`](../../migration_status.yaml) (1). These paths do not exist in the Starter itself, so the Starter's own audit does not flag them. | Applied the project copy's existing clickable-link convention to exactly those four synchronized references, within the approved synchronization scope. | Rerun 1 `2026-09-23T13:22:09Z` exit 1; current run exit 0 | `pass` (current run) |
| `audit:views` and toolkit tests (run 3, after ratification) | Run `2026-09-23T14:16:05Z` to `14:17:56Z`: `audit:views` exit 1 with 4 errors, and `npm --prefix analysis/tools test` exit 1 with 4 failures (tests 180, 210, 363, 378) from the same project-file checks. Causes: (a) the new amendments section sat between `## Core Principles` and `## Required Repository Contracts`, so the principle-boundary check read its words `Phase A` as a core-principle dependency on a packet phase; (b) subsections A1-A3 were missing from Contents; (c) a Cyrillic quotation in the Decision Record would violate the constitution's English-only boundary rule. | Moved the amendments section, unchanged in meaning, to after Required Repository Contracts; added A1-A3 to Contents; replaced the quotation with an English paraphrase. No principle text was changed. | Current run `2026-09-23T14:18:33Z` to `14:20:23Z`: all 12 exit 0; toolkit 752 pass / 0 fail / 1 skipped | `pass` (current run) |

<a id="read-starter-synchronization"></a>

### Starter Synchronization

- **Old / new baseline:** `2ad915812d25853d1f4c857c0346978e4913c0b8` →
  `ae3cca618cb4510345963710f1fd0c54d8a52373` (single commit "Fix bootstrap
  version drift and bounded maintenance guidance").
- **Owner authorization:** owner `ekzarov`, chat message on 2026-09-23. Scope:
  that commit's changes in portable files listed in the initializer's
  `$staticFiles`, merged selectively while preserving project constraints and
  earlier changes. The initializer was not rerun, `.migration-starter.json` was
  not changed, and filled reports, configuration, constitution and status were
  not replaced from templates. Procedure: [Bootstrap Maintenance](../../../MIGRATION.md#bootstrap-maintenance).
- **Method:** the `$staticFiles` list was parsed from the new initializer without
  executing it. Each changed file's project copy was compared, using Starter Git
  attributes, with the old-baseline blob. Unchanged copies were replaced with the
  new blob. Locally changed copies (bootstrap guidance had turned their references
  into links) were merged three-way (`git merge-file`: project / old / new).
- **Replaced (identical to old baseline), 16:** [`analysis/gate-review-contracts.js`](../../gate-review-contracts.js),
  [`analysis/gate-review-guide.md`](../../gate-review-guide.md), [`analysis/migration_artifact_flow.drawio`](../../migration_artifact_flow.drawio),
  [`analysis/migration_methodology.html`](../../migration_methodology.html), [`analysis/migration_status.template.yaml`](../../migration_status.template.yaml),
  [`analysis/process-canvas/build-data.js`](../../process-canvas/build-data.js), [`analysis/process-canvas/data.json`](../../process-canvas/data.json),
  [`analysis/process-canvas/sync-practical-guidance.js`](../../process-canvas/sync-practical-guidance.js),
  [`analysis/process-canvas/translation-review.json`](../../process-canvas/translation-review.json),
  [`analysis/process-canvas/translations.ru.json`](../../process-canvas/translations.ru.json), [`analysis/process-contract.md`](../../process-contract.md),
  [`analysis/tools/bootstrap-guidance.test.js`](../../tools/bootstrap-guidance.test.js), [`analysis/tools/helpers.js`](../../tools/helpers.js),
  [`analysis/tools/process-sync-regressions.test.js`](../../tools/process-sync-regressions.test.js),
  [`analysis/tools/status-validator.js`](../../tools/status-validator.js), `init-migration.ps1`.
- **Added (new in `$staticFiles`), 2:** [`analysis/tools/constitution-version.js`](../../tools/constitution-version.js),
  [`analysis/tools/constitution-version.test.js`](../../tools/constitution-version.test.js).
- **Merged without conflict, 4:** `README.md`, [`analysis/process-cheatsheet.md`](../../process-cheatsheet.md),
  [`analysis/stages/README.md`](../README.md), [`analysis/tools/README.md`](../../tools/README.md).
- **Merged with conflicts, 4 files / 6 hunks:** `ARTIFACTS.md` (1),
  `MIGRATION.md` (2), [`analysis/migration_methodology.md`](../../migration_methodology.md) (1),
  [`analysis/stages/templates/bootstrap-gate-report-template.md`](../templates/bootstrap-gate-report-template.md) (2). Disposition
  for every hunk: the new Starter text was adopted, then the project's existing
  clickable-link form was reapplied to the same repository paths (ARTIFACTS: 3
  first-column links; MIGRATION: 3 links plus the 4 links recorded above;
  template: 2 links; methodology: the new text had no bare path). No project
  constraint was removed.
- **Excluded:** `tests/init-migration.Tests.ps1` (source-only; not in
  `$staticFiles`; run from the Starter by absolute path).
- **Total files synchronized:** 26 (16 replaced + 2 added + 8 merged).
- **Not changed by synchronization:** [`.specify/memory/constitution.md`](../../../.specify/memory/constitution.md),
  [`config/project.yaml`](../../../config/project.yaml), [`config/environments.yaml`](../../../config/environments.yaml),
  `.migration-starter.json`, this report's recorded first-run history,
  [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md),
  [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx), [`legacy/`](../../../legacy).
  Status was changed only as recorded in Deviations and Final Assessment.

<a id="read-verification-boundary"></a>

## Verification Boundary

- Required check rows: 12; pass: 12; fail: 0; blocked: 0; pending/not run: 0.
  Derived from the current Required Gate Evidence rows; the first-run history
  table is not counted. Matches the top summary.
- Corrected failures: `audit:views` and toolkit tests after ratification (run 3
  exit 1 → current exit 0), `audit:artifact-links` (first run exit 1 → current exit 0),
  `audit:status` after synchronization (exit 1 → current exit 0),
  `audit:artifact-links` rerun 1 (exit 1 → current exit 0); see Deviations.
- Post-record structural recheck (not counted as extra rows): after this report
  and the status were updated, `audit:status`, `audit:project`, `audit:environment`,
  `audit:methodology`, `audit:prevention`, `audit:views`, `audit:responsibilities`
  and `audit:roles` exited 0 (`2026-09-23T13:26:13Z` to `13:26:38Z`). The first
  `audit:artifact-links` recheck exited 1 on 25 plain paths in this report's new
  text; those references were made clickable and the recheck exited 0 with
  `artifact-reading.js` reporting no errors.
- Remaining unavailable or unexecuted checks: none. One regression test is
  skipped by the toolkit on this platform (symlink creation EPERM); the suite
  reports it as skipped, not passed.
- Actual scope proved: the installed audit toolkit, initializer self-test and the
  structural validity of status, project, environment, methodology, views,
  responsibilities, roles and the empty error-prevention table. No legacy
  behavior, application runtime or remote access was examined.

The agent records every earlier failure in Deviations And Remediation. A later
pass supplies new evidence without erasing the failed attempt. Successful audit
execution is separate from the human owner's transition authorization.

<a id="read-final-assessment"></a>

## Final Assessment

- Overall Bootstrap audit result: `pass` (first run: `fail`, preserved above)
- Unresolved failures or blockers: none technical. Constitution `1.0.0`
  ratified and integration branch `main` decided. Pending owner decisions:
  confirmation of the exact Stage 1 authorization, then commit and push of the
  ratification change.
- Report path recorded in [`analysis/migration_status.yaml`](../../migration_status.yaml): in `blockers[].evidence` of the
  now-resolved blocker `bootstrap-artifact-links-preparation`; not yet in `gate_evidence`
  (no transition has been recorded).
- Owner-authorized `bootstrap -> stage-01` transition recorded: `no`
- Assessed by: `PM / Coordinator, Claude Code session d0ec1166-ffc9-446a-ba86-d768242e6de8`
- Assessed at: `2026-09-23T14:20:23Z` (first assessment `2026-09-23T10:25:18Z`: `fail`; post-synchronization `2026-09-23T13:24:29Z`: `pass`; post-ratification run 3 `2026-09-23T14:17:56Z`: `fail`, corrected)

Bootstrap may be marked green only when every required row passes, no unresolved
failure remains, and the status transition cites this exact report path.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

- **Self-check:** Bootstrap; uncommitted working tree; project checklist
  [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md)
  contains no learned checks yet. Performed checks: [`legacy/`](../../../legacy) hashes re-verified,
  starter status re-verified, `package-lock.json` unchanged, no secrets or actual
  environment copied.
  After synchronization: [`legacy/`](../../../legacy/) hashes and starter HEAD/cleanliness re-verified,
  `PREPARATION.md` word-diff reviewed (8 link-only changes), conflict hunks
  reviewed, no conflict markers left.
- **Learning update:** no new row admitted to the project checklist. The
  pre-existing-document link failure and the status-version drift are now covered
  by Starter rules at `ae3cca61` ([Bootstrap Evidence And Blockers](../../../MIGRATION.md#bootstrap-evidence-and-blockers)
  and the automated equality check in `audit:status`), so a duplicate manual check
  is not distinct. Observation for the process maintainer: new Starter text can
  introduce plain paths that exist only in initialized projects, so they fail
  `audit:artifact-links` after synchronization although the Starter's own audit
  is green.

Independent reviewers propose changes here without editing the shared table.
The coordinator records actual admission/deduplication in the current correction
or work record. The owner need not write this section. This note does not replace
the required independent review, human decision or stage evidence.

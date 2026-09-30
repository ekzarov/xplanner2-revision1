# Starter Synchronization 2026-09-30 (a1d5fa8)

**Which reusable process changes were adopted from the Starter, do they conflict with the ratified constitution, and what was verified?**

- **Created by:** PM / Coordinator (process maintenance), Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM maintains this record. The owner `ekzarov` authorized the synchronization and merges it.
- **Governing instructions:** [Bootstrap Maintenance](../../MIGRATION.md#bootstrap-maintenance) and [Source Readiness](../../MIGRATION.md#source-readiness).

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Adopted Starter `a1d5fa8` (source-readiness gate); no conflict with the ratified constitution found**
>
> This change synchronizes Starter commits `44ae6f3`, `d9e16cb`, `8f15b3f` and merge `a1d5fa8` after the documented base `40be1fa`. 26 files are merged three-way, 2 of them with resolved conflicts. It makes no stage, status, record, review or constitution change. The source-readiness gate is adopted as a process rule; the project's own source intake is a separate admission change. All project audits, the toolkit tests and the source-only initializer self-test pass. GitHub Actions did not run.
>
> **Next:** independent review of this change, then the owner's merge. After that comes the A4 source admission and the bounded return to Stage 1.
>
> **Details:** [Changed Files](#read-changed-files) / [Constitution Check](#read-constitution-check) / [Verification](#read-verification).

<details>
<summary><strong>Contents</strong></summary>

- [Authorization And Baselines](#read-authorization-and-baselines)
- [Changed Files](#read-changed-files)
- [Constitution Check](#read-constitution-check)
- [Adoption And Preserved Project State](#read-adoption-and-preserved-project-state)
- [Verification](#read-verification)
- [Limitations](#read-limitations)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-authorization-and-baselines"></a>

## Authorization And Baselines

- **Target:** `a1d5fa8a2f4c8ef3e70123af4878232be337b23b`, the merge of Starter PR #1 (`codex/source-readiness-gate`). The delta from the base consists of `44ae6f3` (require source readiness before analysis), `d9e16cb` (strict source readiness and assessment ownership), `8f15b3f` (align the Bootstrap gate definition) and the merge commit.
- **Owner authorization:** `ekzarov`, chat message on 2026-09-30. It covers the whole delta from the current base, without rerunning the initializer, and it preserves project records and `legacy/`. While GitHub Actions is unavailable because of billing, the missing CI does not block the merge. CI is recorded as not run, not as passed. Local checks and an independent review are mandatory.
- **Documented sync base:** `40be1fac4402b0d18d64385faadf0a46a7e98e06`, per [`starter-sync-2026-09-29-40be1fa.md`](./starter-sync-2026-09-29-40be1fa.md).
- **Project base:** `main` at `eb7720f` (after PR #28). Branch: `process/starter-sync-a1d5fa8`.
- **Starter:** HEAD `a1d5fa8`, clean working tree, used read-only.

<a id="read-changed-files"></a>

## Changed Files

**Method.** Each changed file was merged three-way with `git merge-file` (project, `40be1fa` blob, `a1d5fa8` blob) after LF normalization. `$staticFiles` was parsed from the `a1d5fa8` initializer without executing it; the list is unchanged. The generated guidance blocks were regenerated with [`analysis/process-canvas/sync-practical-guidance.js`](../process-canvas/sync-practical-guidance.js).

| Treatment | Files |
|---|---|
| Merged without conflict, 24 | [`.agents/skills/migration-ba/SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), [`.agents/skills/migration-pm/SKILL.md`](../../.agents/skills/migration-pm/SKILL.md), [`MIGRATION.md`](../../MIGRATION.md), [`analysis/agent-system-overview.md`](../agent-system-overview.md), [`analysis/agent-system/roles.html`](../agent-system/roles.html), [`analysis/artifact-naming.md`](../artifact-naming.md), [`analysis/artifact-responsibilities.json`](../artifact-responsibilities.json), [`analysis/gate-review-guide.md`](../gate-review-guide.md), [`analysis/migration_artifact_flow.drawio`](../migration_artifact_flow.drawio), [`analysis/migration_methodology.html`](../migration_methodology.html), [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/process-canvas/`](../process-canvas/) (`artifact-responsibilities.json`, `build-data.js`, `data.json`, `translation-review.json`, `translations.ru.json`), [`analysis/process-contract.md`](../process-contract.md), [`analysis/stages/templates/bootstrap-gate-report-template.md`](../stages/templates/bootstrap-gate-report-template.md), [`analysis/tools/README.md`](../tools/README.md), [`analysis/tools/`](../tools/) (`process-sync-regressions.test.js`, `project-config-audit.js`, `project-config-audit.test.js`), [`config/project.schema.json`](../../config/project.schema.json), [`config/project.template.yaml`](../../config/project.template.yaml) |
| Merged with resolved conflicts, 2 | [`ARTIFACTS.md`](../../ARTIFACTS.md) (generated guidance rows; Starter text taken, block regenerated) and [`analysis/artifact-responsibilities.md`](../artifact-responsibilities.md) (Starter text taken) |
| Regenerated guidance only | [`config/project.yaml`](../../config/project.yaml): only its generated `ARTIFACT RESPONSIBILITY` header comment changed. No project value changed. |

**Result against Starter HEAD `a1d5fa8`.** 19 of the 26 files are byte-equal after LF normalization. Six differ only by project clickable links: `ARTIFACTS.md`, `analysis/artifact-naming.md`, `analysis/artifact-responsibilities.md`, `analysis/migration_methodology.md`, the Bootstrap gate report template and `analysis/tools/README.md`. [`MIGRATION.md`](../../MIGRATION.md) also keeps the project addition for the Stage 2 live-check carryover.

<a id="read-constitution-check"></a>

## Constitution Check

PM compared the source-readiness gate with [the constitution](../../.specify/memory/constitution.md) 1.0.0 and its amendments. **No conflict was found.**

- **Principles II and III and amendment A1.** The gate requires an honest assessment of the delivered materials. It forbids treating a WAR, bytecode listings or decompiled text as original source, and it makes any fallback an explicit owner decision. This is consistent with A1 and makes it stricter.
- **Historical work.** The rule states that adoption neither resets the project nor invalidates old evidence, and that completed Bootstrap reports are not rewritten. The project's earlier static analysis used its own read-only class-file readers, disclosed from the first pass in the reconnaissance record. Under this rule that historical evidence stays as recorded. Any new or reopened source analysis needs the source assessment first.
- **No change needed.** The rule requires no constitution change. Using the upstream source as evidence is covered by the separate owner-approved amendment A4 in the next change.

<a id="read-adoption-and-preserved-project-state"></a>

## Adoption And Preserved Project State

- **Audit behaviour now.** At Stage 3 without `source_intake`, `audit:project` passes with the warning that pre-policy source readiness is unassessed. Before the planned return to Stage 1 the project must fill `source_intake` with a pinned assessment record, and an owner fallback decision is required where correspondence is not `matched`. That is done in the separate admission change.
- **Not touched:**
  - status and the transition history;
  - the constitution and `.migration-starter.json`;
  - `legacy/`, the Stage 1 records and all reviews and evidence;
  - the checklist;
  - the environment contract.
- **Initializer.** It was not rerun.

<a id="read-verification"></a>

## Verification

| Check | Command | Result |
|---|---|---|
| Project audits | `npm --prefix analysis/tools run` `audit:status`, `audit:project`, `audit:workbook`, `audit:environment`, `audit:methodology`, `audit:prevention`, `audit:views`, `audit:responsibilities`, `audit:artifact-links`, `audit:roles` | all exit 0. `audit:project` warns that pre-policy source readiness is unassessed. |
| Toolkit regression tests | `npm --prefix analysis/tools test` | exit 0; 882 tests: 881 pass, 0 fail, 1 skipped (symlink EPERM on Windows) |
| Initializer self-test (source-only, Starter `a1d5fa8`) | `pwsh -NoProfile -NonInteractive -File C:/Work/Legacy/legacy-modernization-starter/tests/init-migration.Tests.ps1`, output in `.migration-tmp/` | exit 0; `PASS: 1537 bootstrap initializer assertions`; the Starter working tree was clean afterwards |
| Byte comparison with Starter HEAD | the 26 synchronized files against `a1d5fa8` blobs | 19 equal; 7 differ only as listed in [Changed Files](#read-changed-files) |
| Independent review | a fresh reviewer session, read-only | recorded in the pull request |
| GitHub Actions | project CI | **not run** (organization billing). Recorded as not executed, per owner instruction. |

<a id="read-limitations"></a>

## Limitations

- CI of both the Starter and the project did not run because of billing. That is not a passed check.
- No stage transition or source admission is made by this change.

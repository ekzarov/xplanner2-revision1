# Starter Synchronization 2026-09-29 (40be1fa)

**Which reusable process changes were adopted from the Starter, do they conflict with the ratified constitution, and what was verified?**

- **Created by:** PM / Coordinator (process maintenance), Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM maintains this record. The owner `ekzarov` authorized the synchronization. The merge stays with the owner.
- **Governing instructions:** [Bootstrap Maintenance](../../MIGRATION.md#bootstrap-maintenance), [Operational Incident Assessment](../agent_orchestration.md#operational-incident-assessment) and [Review Incident Evidence](../tools/README.md#review-incident-evidence).

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Adopted Starter `40be1fa` (Operational Incident Assessment); no conflict with the ratified constitution found**
>
> This change synchronizes the single Starter commit `40be1fa` after the documented base `b3fc045`. It merges 21 files three-way without conflict and adds 4 new tool modules and tests. It makes no stage, status, review or record change. It does not approve the pass 009 incidents or accept pass 009. All project audits, the toolkit tests and the source-only initializer self-test pass.
>
> **Next:** CI on the pull request and the owner's merge. After that, PM prepares the incident assessment for pass 009 as a separate companion record for the owner's decision.
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

- **Commit adopted:** `40be1fac4402b0d18d64385faadf0a46a7e98e06`, "Assess review incidents without waiving evidence safeguards". It is the only commit in `b3fc045..40be1fa`.
- **Owner authorization:** `ekzarov`, chat message on 2026-09-29.
  - Transfer the applicable diff from the documented base, including new helper modules. Keep project constraints.
  - Do not rerun the initializer or change `.migration-starter.json`.
  - Do not overwrite the constitution, configuration, status history, [`legacy/`](../../legacy), the parity workbook, or filled and frozen reports.
  - Commit, push and open a separate process-sync PR from the current `main`.
  - The owner merges. The sync does not approve the pass 009 incidents or accept pass 009.
- **Documented sync base:** `b3fc045ddf1b50676c396c73b35e806241e5cf62`, per [`starter-sync-2026-09-28-b3fc045.md`](./starter-sync-2026-09-28-b3fc045.md).
- **Project base:** `main` at `026fd97`, after PR #24. Branch: `process/starter-sync-40be1fa`. PR #25 (pass 009 records) is open and not merged. This branch does not touch it.
- **Starter:** HEAD `40be1fac4402b0d18d64385faadf0a46a7e98e06`, clean working tree, used read-only.
- **In-flight work:** none. No specialist was running.

<a id="read-changed-files"></a>

## Changed Files

**Method.**
- Each file changed in `b3fc045` → `40be1fa` was merged three-way with `git merge-file` (project, `b3fc045` blob, `40be1fa` blob), after LF normalization.
- `$staticFiles` was parsed from the `40be1fa` initializer without executing it. The list adds the 4 new modules below.

| Treatment | Files |
|---|---|
| Merged without conflict, 21 | [`.agents/skills/migration-ba/SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), [`.agents/skills/migration-pm/SKILL.md`](../../.agents/skills/migration-pm/SKILL.md), [`MIGRATION.md`](../../MIGRATION.md), [`analysis/agent_orchestration.md`](../agent_orchestration.md), [`analysis/migration_artifact_flow.drawio`](../migration_artifact_flow.drawio), [`analysis/migration_methodology.html`](../migration_methodology.html), [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/migration_status.schema.json`](../migration_status.schema.json), [`analysis/process-canvas/`](../process-canvas/) (`app.js`, `sync-practical-guidance.js`, `translation-review.json`, `translations.ru.json`), [`analysis/process-cheatsheet.md`](../process-cheatsheet.md), [`analysis/process-contract.md`](../process-contract.md), [`analysis/reviews/README.md`](../reviews/README.md), [`analysis/reviews/stage-NN-pass-NNN-template.md`](../reviews/stage-NN-pass-NNN-template.md), [`analysis/tools/README.md`](../tools/README.md), [`analysis/tools/`](../tools/) (`process-sync-regressions.test.js`, `status-validator.js`, `status-validator.test.js`), [`init-migration.ps1`](../../init-migration.ps1) |
| Added, 4 | [`analysis/tools/evidence-placeholders.js`](../tools/evidence-placeholders.js), [`analysis/tools/evidence-placeholders.test.js`](../tools/evidence-placeholders.test.js), [`analysis/tools/review-incidents.js`](../tools/review-incidents.js), [`analysis/tools/review-incidents.test.js`](../tools/review-incidents.test.js) |

**Result against Starter HEAD `40be1fa`.** 20 of the 25 files equal the Starter blob byte for byte after LF normalization. The other 5 differ only as follows:
- 4 files differ only by project clickable links: [`MIGRATION.md`](../../MIGRATION.md), [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/process-cheatsheet.md`](../process-cheatsheet.md) and [`analysis/tools/README.md`](../tools/README.md).
- [`analysis/reviews/README.md`](../reviews/README.md) additionally keeps the project credential addition (amendment A3, CHK-009).

The generated guidance block in [`ARTIFACTS.md`](../../ARTIFACTS.md) was checked and is current.

<a id="read-constitution-check"></a>

## Constitution Check

PM compared the new procedure with [the constitution](../../.specify/memory/constitution.md) 1.0.0, its amendments and the recorded owner decisions. **No conflict was found.**

| Ratified rule | New rule | Assessment |
|---|---|---|
| Principle XII: the reviewer owns the conclusion; PM must not rewrite `findings`/`blocked` as `clean`; every attempt leaves an immutable report; incomplete work fails closed. | The procedure lets neither PM nor the owner change a verdict. The assessment and the owner decision go into a companion record; the sealed report and hashes stay unchanged. Material or unresolved impact fails closed as `invalid`/`blocked`. | Consistent. |
| Amendment A3 and owner decision `legacy-default-credential-classification` (limited to the snapshots of passes 001-004). | A public factory value printed into tool output is a masking incident. A historical snapshot exception does not authorize new output. Absence from files does not prove no disclosure. | Consistent. The rule makes the project's limit on the classification explicit. |
| Owner access boundaries and packet transport safety. | Do not open forbidden locations to investigate; unknowns stay explicit. | Consistent; it strengthens the boundaries. |
| Governance invariants (fresh independent agents, immutable reports, fail-closed gates, owner-only approvals). | Approval accepts only a supported non-material disposition; an `invalid` attempt cannot be promoted. | Not weakened. |

**Note for the owner.** The pass 009 packet stated its git command list under "hard access boundaries; a violation invalidates the pass". The new procedure says that stricter project rules stay binding. PM therefore applies the procedure to pass 009 only under the owner's explicit instruction of 2026-09-29. That instruction is recorded in the pass 009 companion, not here.

<a id="read-adoption-and-preserved-project-state"></a>

## Adoption And Preserved Project State

- **Adoption.** The rule is adopted by this sync under the owner authorization above. It is applied to pass 009 only after the owner merges this PR, under the owner's separate instruction.
- **Status.** [`analysis/migration_status.yaml`](../migration_status.yaml) is not changed by this sync: no owner decision, stage, transition or review entry. That avoids implying approval and avoids touching the open PR #25.
- **Not touched:**
  - the constitution;
  - [`config/`](../../config/) and `.migration-starter.json`;
  - [`legacy/`](../../legacy) and `target/`;
  - the Stage 1 records and correction records;
  - all review reports, evidence, snapshots and hashes, including pass 008 (`invalid`) and the unmerged pass 009;
  - [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md);
  - the transition history.
- **Initializer.** It was not rerun. Its project copy [`init-migration.ps1`](../../init-migration.ps1) was merged as a static file and lists the new modules.

<a id="read-verification"></a>

## Verification

| Check | Command | Result |
|---|---|---|
| Project audits | `npm --prefix analysis/tools run` `audit:status`, `audit:project`, `audit:workbook`, `audit:environment`, `audit:methodology`, `audit:prevention`, `audit:views`, `audit:responsibilities`, `audit:artifact-links`, `audit:roles` | all exit 0 |
| Toolkit regression tests | `npm --prefix analysis/tools test` | exit 0; 855 tests: 854 pass, 0 fail, 1 skipped (symlink EPERM on Windows) |
| Initializer self-test (source-only, Starter `40be1fa`) | `pwsh -NoProfile -NonInteractive -File C:/Work/Legacy/legacy-modernization-starter/tests/init-migration.Tests.ps1`, with TEMP/TMP/TMPDIR/npm cache and output under `.migration-tmp/` | exit 0; `PASS: 1537 bootstrap initializer assertions`; Starter working tree clean afterwards |
| Byte comparison with Starter HEAD | the 25 synchronized files, LF-normalized, against `40be1fa` blobs | 20 equal; 5 differ only as listed in [Changed Files](#read-changed-files) |
| Remote CI | `Starter audit` on the pull request head | recorded in the PR metadata |

<a id="read-limitations"></a>

## Limitations

- The Starter's own CI did not run for `40be1fa` because of the GitHub organization billing/spending limit. That is a source limitation, not a passed check, and it does not replace this project's CI.
- The status audit checks the structure and bindings of incident records. It does not check the truth of their safeguard claims.
- No stage transition or approval is made by this change.

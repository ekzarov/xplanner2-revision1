# Starter Synchronization 2026-09-28 (b3fc045)

**Which reusable process changes were adopted from the Starter, how was the conflict resolved, do the new rules conflict with the ratified constitution, and what was verified?**

- **Created by:** PM / Coordinator (process maintenance), Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM maintains this record. The owner `ekzarov` authorized the synchronization and the adoption of the new rules. The merge stays with the owner.
- **Governing instructions:** [Bootstrap Maintenance](../../MIGRATION.md#bootstrap-maintenance), [Stage 2 Attempt Recovery](../reviews/README.md#stage-2-attempt-recovery) and [Packet Transport Safety](../agent_orchestration.md#packet-transport-safety).

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Adopted Starter `b3fc045` (Stage 2 Attempt Recovery, Packet Transport Safety); no conflict with the ratified constitution found**
>
> This change synchronizes the single Starter commit `b3fc045` after the documented base `c7d0188`:
> - 31 files were merged three-way, 1 of them with a resolved conflict in a generated block;
> - 1 file was added;
> - 1 source-only file was excluded.
>
> The project adopts the rules explicitly through a new owner decision. Stage, stage status, review history and pass 008's `invalid` result are unchanged. Recovery eligibility is not asserted. All project audits, the toolkit tests and the source-only initializer self-test pass.
>
> **Next:** CI on the pull request and the owner's merge. After that comes the owner-approved bounded Stage 1 return for the pass-008 observations.
>
> **Details:** [Changed Files](#read-changed-files) / [Constitution Check](#read-constitution-check) / [Verification](#read-verification).

<details>
<summary><strong>Contents</strong></summary>

- [Authorization And Baselines](#read-authorization-and-baselines)
- [Changed Files](#read-changed-files)
- [Conflicts](#read-conflicts)
- [Constitution Check](#read-constitution-check)
- [Adoption And Preserved Project State](#read-adoption-and-preserved-project-state)
- [Verification](#read-verification)
- [Limitations](#read-limitations)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-authorization-and-baselines"></a>

## Authorization And Baselines

- **Commit adopted:** `b3fc045ddf1b50676c396c73b35e806241e5cf62`, "Allow verified Stage 2 recovery after failed attempts". It is the only commit in `c7d0188..b3fc045`.
- **Owner authorization:** `ekzarov`, chat message on 2026-09-28. The owner allowed these steps:
  - adopt this revision in a separate process-maintenance PR, from the documented base through `b3fc045`, including any intermediate commits;
  - use Bootstrap Maintenance, the current `$staticFiles` and a three-way merge, without running the initializer;
  - keep [`legacy/`](../../legacy), `target/`, the constitution, configuration, `.migration-starter.json`, the project checklist, old reports, snapshots, hashes and transition history;
  - record the adoption decision;
  - update stale `next_action`/`summary` text;
  - leave the stage unchanged and pass 008 `invalid`, and assert no baseline eligibility;
  - commit, push and open the PR. The merge stays with the owner.
- **Documented sync base:** `c7d0188595bbcca9d5380ae74dbaf359ec6860fa`, per [`starter-sync-2026-09-25-c7d0188.md`](./starter-sync-2026-09-25-c7d0188.md).
- **Project base:** `main` at `4f3a5a8`, after PR #22 (pass 008 records). Branch: `process/starter-sync-b3fc045`.
- **Starter:** HEAD `b3fc045ddf1b50676c396c73b35e806241e5cf62`, clean working tree, used read-only.
- **In-flight work:** none. No specialist or other session was running; the working tree was clean.

<a id="read-changed-files"></a>

## Changed Files

**Method.**
- For each file changed in `c7d0188` → `b3fc045`, the project copy was merged three-way with `git merge-file` (project, `c7d0188` blob, `b3fc045` blob), after LF normalization.
- `$staticFiles` was parsed from the `b3fc045` initializer without executing it; compared with `c7d0188`, the list adds [`analysis/tools/stage2-recovery-docs.test.js`](../tools/stage2-recovery-docs.test.js).
- The derived practical-guidance block in [`ARTIFACTS.md`](../../ARTIFACTS.md) was then regenerated with [`analysis/process-canvas/sync-practical-guidance.js`](../process-canvas/sync-practical-guidance.js).

| Treatment | Files |
|---|---|
| Merged without conflict, 31 | [`.agents/skills/migration-ba/SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), [`.agents/skills/migration-pm/SKILL.md`](../../.agents/skills/migration-pm/SKILL.md), [`MIGRATION.md`](../../MIGRATION.md), [`analysis/agent-roles.md`](../agent-roles.md), [`analysis/agent-system-overview.md`](../agent-system-overview.md), [`analysis/agent-system/`](../agent-system/) (`en.html`, `example-view.js`, `index.html`, `roles.html`), [`analysis/agent_orchestration.md`](../agent_orchestration.md), [`analysis/error-prevention.md`](../error-prevention.md), [`analysis/migration_artifact_flow.drawio`](../migration_artifact_flow.drawio), [`analysis/migration_methodology.html`](../migration_methodology.html), [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/migration_status.schema.json`](../migration_status.schema.json), [`analysis/process-canvas/`](../process-canvas/) (`app.js`, `build-data.js`, `data.json`, `sync-practical-guidance.js`, `translation-review.json`, `translations.ru.json`), [`analysis/process-cheatsheet.md`](../process-cheatsheet.md), [`analysis/process-contract.md`](../process-contract.md), [`analysis/record-contracts.json`](../record-contracts.json), [`analysis/reviews/README.md`](../reviews/README.md), [`analysis/reviews/stage-NN-pass-NNN-template.md`](../reviews/stage-NN-pass-NNN-template.md), [`analysis/tools/README.md`](../tools/README.md), [`analysis/tools/`](../tools/) (`review-comparison-template.test.js`, `status-validator.js`, `status-validator.test.js`), [`init-migration.ps1`](../../init-migration.ps1) |
| Merged with a resolved conflict, 1 | [`ARTIFACTS.md`](../../ARTIFACTS.md) |
| Added, 1 | [`analysis/tools/stage2-recovery-docs.test.js`](../tools/stage2-recovery-docs.test.js) |
| Excluded, 1 | `tests/process-canvas.browser.cjs`: source-only, not in `$staticFiles` |

**Result against Starter HEAD `b3fc045`.** 27 of the 33 synchronized files equal the Starter blob byte for byte after LF normalization. The other 6 differ only as follows:
- 5 files differ only by project clickable links: [`ARTIFACTS.md`](../../ARTIFACTS.md), [`MIGRATION.md`](../../MIGRATION.md), [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/process-cheatsheet.md`](../process-cheatsheet.md) and [`analysis/tools/README.md`](../tools/README.md);
- [`analysis/reviews/README.md`](../reviews/README.md) also keeps the project credential addition (amendment A3, CHK-009).

<a id="read-conflicts"></a>

## Conflicts

| File | Resolution |
|---|---|
| [`ARTIFACTS.md`](../../ARTIFACTS.md): generated practical-guidance table rows (project links vs. new Starter text) | Took the Starter text, then regenerated the block. The generator restored the project links for existing paths. |

<a id="read-constitution-check"></a>

## Constitution Check

PM compared both new rules with [the constitution](../../.specify/memory/constitution.md) 1.0.0, its amendments and the recorded owner decisions. **No conflict was found.**

| Ratified rule | New rule | Assessment |
|---|---|---|
| Principle XII: every clean, findings, invalid or blocked attempt leaves an immutable report and ledger entry; the primary agent must not rewrite `findings` or `blocked` as `clean`. | Failed attempts stay immutable and in history; `previous_pass` names the latest chronological attempt; failed coverage is never inherited. | Preserved. Pass 008 stays `invalid`. |
| Principle XII: context overflow, timeout, lost scope, reviewer mutation or incomplete coverage fails closed; exact uncovered scope goes to a later eligible fresh-agent pass. | Recovery needs a new independent reviewer who is not an author, not a prior reviewer and not the failed reviewer. That reviewer rechecks everything left unverified and every lead from the failed attempt. Uncertain containment blocks recovery. | Consistent: the failure still fails closed, and the uncovered scope goes to a fresh pass. |
| Principle I (blind observations first) and the full-blind Stage 2 binding in [`analysis/process-contract.md`](../process-contract.md) | Recovery applies only to `correction-validation`; full-blind and Stage 19 are unchanged. | Not affected. |
| Governance invariants: fresh eligible agents, immutable reports, fail-closed gates, owner-only merge and approvals. | A Stage 1 return after a failed attempt needs explicit `owner_approval` on the transition; recovery is not a waiver or acceptance. | Not weakened, so no amendment is needed. |
| Owner access boundaries (initial run constraints). | Packet Transport Safety forbids opening client-persisted output outside the allowed folders and requires project-local scratch. | Strengthens the owner boundaries. |

<a id="read-adoption-and-preserved-project-state"></a>

## Adoption And Preserved Project State

**Explicit adoption.** [`analysis/migration_status.yaml`](../migration_status.yaml) gains owner decision `stage-02-attempt-recovery-adoption:xplanner2-revision1`, which references this record. The decision records:
- recovery eligibility is not asserted in advance;
- only a fresh independent BA may establish recovery, and the `recovery` fields are written only after a confirmed recovery with a new `clean`/`findings` result;
- a bounded Stage 1 return needs its own transition `owner_approval`;
- packets authorize project-local scratch and forbid opening client spill files.

**Updated in status.** Only `next_action`, `progress.summary` and `updated_at`. They previously stated that a full-blind pass was mandatory after the invalid pass 008, which was the `c7d0188` chain rule. No stage field, transition, review pass or counter changed. The project stays at `stage-02`, `awaiting_owner`.

**Superseded statement in sealed evidence.** [`analysis/reviews/evidence/S02-P008/pm-report-transcription.json`](../reviews/evidence/S02-P008/pm-report-transcription.json) (`chain_consequence`) records that the next eligible control needs a full-blind root. That was correct under `c7d0188`, and the sealed file is not edited. Under `b3fc045`, that consequence applies only if the new reviewer cannot establish recovery or finds a full-blind trigger.

**Not touched by this change:**
- the constitution;
- [`config/`](../../config/) and `.migration-starter.json`;
- [`legacy/`](../../legacy) and `target/`;
- the Stage 1 records and correction records;
- all review reports, evidence, snapshots and hashes;
- [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md);
- the transition history.

The initializer was not rerun. Its project copy [`init-migration.ps1`](../../init-migration.ps1) was merged as a static file and now lists the new test.

<a id="read-verification"></a>

## Verification

| Check | Command | Result |
|---|---|---|
| Project audits | `npm --prefix analysis/tools run` `audit:status`, `audit:project`, `audit:workbook`, `audit:environment`, `audit:methodology`, `audit:prevention`, `audit:views`, `audit:responsibilities`, `audit:artifact-links`, `audit:roles` | all exit 0, including `audit:status` with pass 008 `invalid` and no `recovery` fields |
| Toolkit regression tests | `npm --prefix analysis/tools test` | exit 0; 826 tests: 825 pass, 0 fail, 1 skipped (symlink EPERM on Windows) |
| Initializer self-test (source-only, Starter `b3fc045`) | `pwsh -NoProfile -NonInteractive -File C:/Work/Legacy/legacy-modernization-starter/tests/init-migration.Tests.ps1`, with TEMP/TMP/TMPDIR/npm cache under `.migration-tmp/` and output in `.migration-tmp/init-selftest-b3f.log` | exit 0; `PASS: 1517 bootstrap initializer assertions`; Starter working tree clean afterwards |
| Byte comparison with Starter HEAD | the 33 synchronized files, LF-normalized, against `b3fc045` blobs | 27 equal; 6 differ only as listed in [Changed Files](#read-changed-files) |
| Remote CI | `Starter audit` on the pull request head | recorded in the PR metadata |

<a id="read-limitations"></a>

## Limitations

- The Starter's own CI did not run for `b3fc045` because of GitHub organization billing. It is not a passed check, and it does not replace this project's CI.
- `tests/process-canvas.browser.cjs` is source-only and was not run in the project.
- The status audit checks recovery structure and chain, not containment or semantic coverage.
- No stage transition is authorized by this change.

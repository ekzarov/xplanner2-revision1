# Starter Synchronization 2026-09-25 (46a1b6a, partial)

**Which reusable process changes were adopted from the Starter, which were not, how were conflicts resolved, and what was verified?**

- **Created by:** PM / Coordinator (process maintenance), Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM maintains this record. The owner `ekzarov` authorized the exact Starter commit and scope and is the only person who merges the change.
- **Governing instructions:** [Bootstrap Maintenance](../../MIGRATION.md#bootstrap-maintenance) and [Review And Correction PRs](../migration_methodology.md#review-and-correction-prs).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Partial synchronization: only commit 46a1b6a adopted; two intermediate Starter commits not adopted; merge pending**
>
> This change adopts the correction-scope rules for stage returns from Starter commit `46a1b6a`. The project's previous baseline is `f0aefe2`. The two commits in between, `a604050` and `b734a46`, were not authorized and are not included, so the project is **not** fully synchronized to Starter HEAD `46a1b6a`. All project audits and tests pass. The Starter's own CI did not run for this revision (GitHub billing), which is a source limitation and not a passed check.
>
> **Next:** CI on the pull request, then owner merge. The owner decides separately whether to adopt `a604050` and `b734a46`.
>
> **Details:** [Changed Files](#read-changed-files) / [Not Adopted](#read-not-adopted) / [Verification](#read-verification).

<details>
<summary><strong>Contents</strong></summary>

- [Authorization And Baselines](#read-authorization-and-baselines)
- [Changed Files](#read-changed-files)
- [Conflict Dispositions](#read-conflict-dispositions)
- [Not Adopted](#read-not-adopted)
- [Preserved Project State](#read-preserved-project-state)
- [Verification](#read-verification)
- [Limitations And Remaining Work](#read-limitations-and-remaining-work)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-authorization-and-baselines"></a>

## Authorization And Baselines

- **Previous project Starter baseline:** `f0aefe2ac91ed40b282e806a9fed22b901236eeb`. See [`analysis/maintenance/starter-sync-2026-09-24-f0aefe2.md`](./starter-sync-2026-09-24-f0aefe2.md).
- **Authorized target:** commit `46a1b6a654f9e99a4247814a423e376aa6691ae0`, "Process maintenance: scope corrections on stage returns" (2026-09-25 12:59:43 +0200).
  - Local Starter HEAD was verified at this commit with a clean working tree. The Starter was used read-only.
- **Owner authorization:** `ekzarov`, chat message on 2026-09-25. It allowed:
  - transferring **this commit's** changes into the corresponding portable `$staticFiles`;
  - preserving project changes;
  - raising additional scope and ambiguous conflicts for agreement;
  - recording partial synchronization honestly;
  - a separate process PR.
- **Additional scope found:** Starter HEAD is three commits ahead of the project baseline: `a604050` → `b734a46` → `46a1b6a`. Only `46a1b6a` was authorized, so only its own delta (`b734a46` → `46a1b6a`) was transferred. See [Not Adopted](#read-not-adopted).
- **Project base:** `main` at `7c2f5619` (after PR #12). Branch: `process/starter-sync-46a1b6a`.
- **In-flight work:** none.
  - No specialist was running.
  - The Stage 2 pass 005 records PR (#13) is open on its own branch and is not touched by this change.
  - The Stage 1 corrections for pass 005 have not started.

<a id="read-changed-files"></a>

## Changed Files

**Method.** The `$staticFiles` list comes from the Starter initializer at `46a1b6a` and was parsed, not executed. For each file changed by `46a1b6a`:
- the project copy (normalized to LF) was merged three-way with `git merge-file`: project / `b734a46` blob / `46a1b6a` blob;
- because the base is the parent `b734a46`, only this commit's delta is applied;
- content introduced by `a604050` or `b734a46` is not carried in by clean hunks.

| Treatment | Files |
|---|---|
| Merged without conflict, 31 | [`.agents/skills/migration-architect/SKILL.md`](../../.agents/skills/migration-architect/SKILL.md), [`.agents/skills/migration-ba/SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), [`.agents/skills/migration-developer/SKILL.md`](../../.agents/skills/migration-developer/SKILL.md), [`.agents/skills/migration-ux/SKILL.md`](../../.agents/skills/migration-ux/SKILL.md), [`MIGRATION.md`](../../MIGRATION.md), [`analysis/agent-roles.md`](../agent-roles.md), [`analysis/agent-system-overview.md`](../agent-system-overview.md), [`analysis/agent-system/build-view.js`](../agent-system/build-view.js), [`analysis/agent-system/diagram.svg`](../agent-system/diagram.svg), [`analysis/agent-system/en.html`](../agent-system/en.html), [`analysis/agent-system/example-view.js`](../agent-system/example-view.js), [`analysis/agent-system/index.html`](../agent-system/index.html), [`analysis/agent-system/roles.html`](../agent-system/roles.html), [`analysis/agent_orchestration.md`](../agent_orchestration.md), [`analysis/error-prevention.md`](../error-prevention.md), [`analysis/migration_methodology.html`](../migration_methodology.html), [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/process-canvas/app.js`](../process-canvas/app.js), [`analysis/process-canvas/build-data.js`](../process-canvas/build-data.js), [`analysis/process-canvas/data.json`](../process-canvas/data.json), [`analysis/process-canvas/sync-practical-guidance.js`](../process-canvas/sync-practical-guidance.js), [`analysis/process-canvas/translation-review.json`](../process-canvas/translation-review.json), [`analysis/process-canvas/translations.ru.json`](../process-canvas/translations.ru.json), [`analysis/process-cheatsheet.md`](../process-cheatsheet.md), [`analysis/process-contract.md`](../process-contract.md), [`analysis/reviews/README.md`](../reviews/README.md), [`analysis/reviews/stage-NN-pass-NNN-template.md`](../reviews/stage-NN-pass-NNN-template.md), [`analysis/stages/templates/stage-19-pass-NNN-template.md`](../stages/templates/stage-19-pass-NNN-template.md), [`analysis/tools/process-view-audit.js`](../tools/process-view-audit.js), [`analysis/tools/process-view-audit.test.js`](../tools/process-view-audit.test.js), [`analysis/tools/review-comparison-template.test.js`](../tools/review-comparison-template.test.js) |
| Merged with one resolved conflict each, 2 | [`.agents/skills/migration-pm/SKILL.md`](../../.agents/skills/migration-pm/SKILL.md), [`analysis/tools/process-sync-regressions.test.js`](../tools/process-sync-regressions.test.js) |
| Not changed by `46a1b6a` | all other `$staticFiles`; `init-migration.ps1` and `tests/init-migration.Tests.ps1` are unchanged by this commit |

Total: 33 files, exactly the files changed by `46a1b6a`, all in `$staticFiles`. The project-local rules kept intact include:
- the credential rule in [`analysis/reviews/README.md`](../reviews/README.md);
- the clickable links from earlier normalization.

<a id="read-conflict-dispositions"></a>

## Conflict Dispositions

| File / hunk | Cause | Resolution |
|---|---|---|
| [`.agents/skills/migration-pm/SKILL.md`](../../.agents/skills/migration-pm/SKILL.md), end of file | The new "On any corrective return" paragraph from `46a1b6a` sits next to a PR-communication paragraph that `b734a46` added. | Kept the project text and added only the `46a1b6a` paragraph verbatim. The `b734a46` paragraph was not adopted. |
| [`analysis/tools/process-sync-regressions.test.js`](../tools/process-sync-regressions.test.js), appended tests | The five tests added by `46a1b6a` sit among tests added by `b734a46` (three PR-communication tests) and `a604050` (three credential-safety tests). | Kept the project tests and added only the five `46a1b6a` tests. A first resolution also carried in the three `a604050` tests; they failed because the matching `a604050` text is absent, and were removed. The final file holds the 7 sync-base tests plus exactly the 5 `46a1b6a` tests. |

<a id="read-not-adopted"></a>

## Not Adopted

These Starter changes stay out of the project until the owner decides:

- **`a6040502439112de5e3313bc5c1ad6e3b50616bb`, "Clarify credential-safe evidence and frozen review handling".** It touches 11 files, including `MIGRATION.md`, the orchestration, methodology, error prevention, reviews and templates, [`config/REMOTE_SERVER.md`](../../config/REMOTE_SERVER.md), and three regression tests. It overlaps in topic with the project-local credential rule and CHK-009.
- **`b734a468480c36aa46afd30dfc82b6c5ec4e1bb7`, "Standardize PR communication".** It touches 14 files, including a new `.github/pull_request_template.md` and a matching `$staticFiles` entry in `init-migration.ps1`, plus the PM skill, `ARTIFACTS.md`, the methodology section "PR Descriptions, Comments And Commits", and three regression tests.

The project is therefore at "`f0aefe2` plus the `46a1b6a` delta". It is not at Starter HEAD.

<a id="read-preserved-project-state"></a>

## Preserved Project State

This change leaves the following untouched:
- [`analysis/migration_status.yaml`](../migration_status.yaml): the stage, transitions, reviews and decisions;
- the constitution;
- [`config/project.yaml`](../../config/project.yaml) and [`config/environments.yaml`](../../config/environments.yaml);
- `.migration-starter.json`;
- [`legacy/`](../../legacy);
- the Stage 1 records;
- all review reports and evidence;
- the error-prevention checklist.

The initializer was not rerun.

<a id="read-verification"></a>

## Verification

| Check | Command | Result |
|---|---|---|
| Project audits | `npm --prefix analysis/tools run` `audit:status`, `audit:project`, `audit:workbook`, `audit:environment`, `audit:methodology`, `audit:prevention`, `audit:views`, `audit:responsibilities`, `audit:artifact-links`, `audit:roles` | all exit 0 |
| Toolkit regression tests | `npm --prefix analysis/tools test` | exit 0; 760 tests: 759 pass, 0 fail, 1 skipped (symlink EPERM on Windows), including the five new `46a1b6a` tests. The first attempt failed 3 tests (the `a604050` tests described above) and was corrected. |
| Intermediate-content check | search the added lines for `pull_request_template`, the PR-communication anchor and the credential/frozen-review anchors | no matches |
| Initializer self-test | not rerun | not applicable: `46a1b6a` does not change `init-migration.ps1` or its test |
| Remote CI | `Starter audit` on the pull request head | recorded in PR metadata, not here |

<a id="read-limitations-and-remaining-work"></a>

## Limitations And Remaining Work

- The owner reports that the Starter's own CI did not run for this revision because of GitHub billing. That is a limitation of the source, not a passed check.
- **Open owner decision:** whether to adopt `a604050` and `b734a46`, in one later bounded synchronization or separately.
- No blocker for the current stage. After the pass 005 records PR is merged, Stage 1 corrections for F-001..F-005 follow the adopted [Correction Scope And Handoff](../reviews/README.md#correction-scope-and-handoff) rule. This change authorizes no stage transition.

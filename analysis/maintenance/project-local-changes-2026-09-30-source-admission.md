# Project-Local Changes 2026-09-30: Source Admission

**Which Starter-owned files does the project change for the A4 source admission, why, and what must a later Starter sync preserve?**

- **Created by:** PM / Coordinator (process maintenance), Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM maintains these hunks. The owner decides whether they stay.
- **Governing instructions:** [Bootstrap Maintenance](../../MIGRATION.md#bootstrap-maintenance), [Source Readiness](../../MIGRATION.md#source-readiness) and constitution amendment A4.

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Marked project hunks in Starter files (`.gitignore`, the workflow, `project-config-audit.js`), a `.gitattributes` line and project-only tools; a later sync must keep them**
>
> The source admission needs a defect fix in [`analysis/tools/project-config-audit.js`](../tools/project-config-audit.js) and a CI restore step in [`.github/workflows/starter-audit.yml`](../../.github/workflows/starter-audit.yml). The restore tool and its tests are project-only files.
>
> **Next:** report the placeholder-probe defect to the Starter maintainers. Keep the hunks during three-way syncs until the Starter fixes the defect.
>
> **Details:** [Changes](#read-changes).

<details>
<summary><strong>Contents</strong></summary>

- [Changes](#read-changes)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-changes"></a>

## Changes

| File | Kind | Change | Reason |
|---|---|---|---|
| [`analysis/tools/project-config-audit.js`](../tools/project-config-audit.js) | Starter file, marked hunk | `proseOnly()` strips HTML comments and code before `hasEvidencePlaceholders`, like `status-validator` `withoutCodeSpans` | **Starter defect** (a1d5fa8). The function is documented to probe prose only, but the raw record was passed to it. Every source-intake record with the standard reading block therefore failed as "placeholder". Prose placeholders still fail. |
| [`.github/workflows/starter-audit.yml`](../../.github/workflows/starter-audit.yml) | Starter file, marked step | "Restore allowlisted upstream sources (project A4)", run before the audits | The raw source stays outside Git (A4). CI restores only the pinned allowlist so that `source_intake` can be verified. |
| [`.gitignore`](../../.gitignore) | Starter file, marked line | `/sources/xplanner-plus-r426/` | **Must be preserved by every sync.** It keeps the local raw source, including the 39 withheld password-bearing files, out of the public repository (A3, A4). |
| [`.gitattributes`](../../.gitattributes) | project file, marked line | `sources/provenance/** -text` | keeps the pinned provenance bytes exact, so the `source_intake` hashes hold on every checkout |
| [`analysis/tools/restore-upstream-sources.js`](../tools/restore-upstream-sources.js) with tests | project-only | pinned-allowlist check, pinned SVN r426 origin, SHA-256 per file, withheld files never fetched, no execution, counts-only output | the CI restore |
| [`analysis/tools/project-config-audit-prose.test.js`](../tools/project-config-audit-prose.test.js) | project-only | tests for the prose probe | regression guard for the defect fix |

**Residual risk.** One allowlisted file, `src/xplanner-custom-before-standalone-install-backup.properties`, contains a commented-out two-character password-like value. The withholding pattern skipped comments. The file is not committed and never printed. Removing it from the allowlist would change the owner-approved `source_intake` scope, so any such change needs a new assessment and a new owner decision.

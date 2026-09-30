# Source Assessment 001: XPlanner+ SVN r426

**What implementation source is available for the legacy baseline, how does it correspond to the delivered WAR, and what may the analysis rely on?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, under [Source Readiness](../MIGRATION.md#source-readiness). The source was acquired and compared by Codex; PM verified the package independently.
- **Maintained / decided by:** PM keeps this record stable while its decision is in use. The owner decides the fallback; the decision is the `owner_decisions` entry named by `source_intake.fallback_decision_id` in [`config/project.yaml`](../config/project.yaml). A later assessment is a new record.
- **Governing instructions:** [Source Readiness](../MIGRATION.md#source-readiness) and constitution amendment A4.

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Matching implementation source is missing or incomplete; the proposed analysis would rely on these substitutes and leave these gaps**
>
> **Substitute:** the official XPlanner+ SVN revision 426 source tree. All 594 application classes of the baseline WAR are byte-identical to the official v1.1a4 release, which declares build revision 426.
>
> **Gaps:**
> - No reproducible build, so source-to-bytecode identity is not proven.
> - The SVN copy of `xplanner.properties` carries older stamps: 1.1a2 / r293.
> - Three configuration entries of the baseline WAR are patched.
> - No source is present for the 102 bundled libraries.
> - 39 source files are withheld from Git and CI.
>
> **Classification:** `partial`. **Baseline match:** `unverified`. The baseline WAR stays authoritative.
>
> **Next:** the owner decides this exact fallback. Then the BA reconciles the existing parity map against the source and the WAR.
>
> **Details:** [Inspected Materials](#read-inspected-materials) / [Correspondence](#read-correspondence) / [Method And Scope](#read-method-and-scope).

<details>
<summary><strong>Contents</strong></summary>

- [Inspected Materials](#read-inspected-materials)
- [Correspondence](#read-correspondence)
- [Missing Parts And Limits](#read-missing-parts-and-limits)
- [Placement And Publication](#read-placement-and-publication)
- [Method And Scope](#read-method-and-scope)
- [Later Verification](#read-later-verification)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-inspected-materials"></a>

## Inspected Materials

| Material | Identity | Status |
|---|---|---|
| Baseline WAR [`legacy/xplanner-plus.war`](../legacy/xplanner-plus.war) | SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`; 964 files; 594 application classes | immutable baseline; authoritative |
| Official release WAR v1.1a4 (SourceForge) | SHA-256 `b4f109896acc2eea0101a1244f1741448beceb3c31435b8bf3a7b0eaa545655c`; 964 files | kept outside Git, for binary comparison only |
| Official SVN tree `trunk/xplanner-plus` at revision 426 | archive SHA-256 `31f8f0fe9dd673d420113de016095e66993031b0cfd709fd428bdee36341e258`; 1117 files, 803 Java (524 in `src/`, 279 in `test/`); license LGPL v3 retained | source root `sources/xplanner-plus-r426` (outside Git) |
| Provenance in Git, under `sources/provenance/` | acquisition manifest (every file: path, bytes, SHA-256, origin URL), class-to-source links, WAR comparison, package summary, allowlist | pinned inputs of `source_intake` |

Nothing downloaded was executed, built or tested.

<a id="read-correspondence"></a>

## Correspondence

- **WAR to WAR.** PM compared the baseline WAR with the official release WAR entry by entry. Both have 964 entries; 961 are byte-identical, including all 594 application classes. Exactly three entries differ: `WEB-INF/classes/spring-beans.xml`, `WEB-INF/classes/xplanner-custom.properties` and `WEB-INF/classes/xplanner.properties`. No entry is added or missing.
- **Release to source.** The release declares build revision 426, and the acquired tree is exactly SVN revision 426. All 594 class paths map mechanically to an existing Java path in `src/` after nested-class suffixes are removed. This is a name mapping. It is not verification of methods or control flow.
- **Source tree integrity.** PM rehashed all 1117 files against the acquisition manifest: 0 mismatches, 0 missing.

<a id="read-missing-parts-and-limits"></a>

## Missing Parts And Limits

- **No reproducible build.** Source-to-bytecode identity is not proven. Where a source statement and the bytecode listing disagree, the bytecode of the baseline WAR governs.
- **Version stamps.** The SVN `src/xplanner.properties` carries stamps 1.1a2 / r293, while the release declares 1.1a4 / r426. The reason is not established.
- **Patched configuration.** For the three patched configuration entries, the baseline WAR is authoritative and the SVN configuration is not the runtime configuration.
- **Libraries.** No source is available for the 102 bundled library JARs. Framework behavior stays as recorded (GAP-011).
- **Withheld files.** 39 files contain a non-empty password-like assignment: 31 in `src/`, 6 in `test/`, 1 in `conf/`, 1 in `webapp/`. This is a pattern match only, not proof of a real secret. The files are withheld from Git and CI and listed by path and SHA-256 in the allowlist. They may be cited by path only. No credential value is reproduced.
- **What the source cannot do.** The source does not prove live behavior. It does not remove `Inferred` by itself and does not replace the WAR.

<a id="read-placement-and-publication"></a>

## Placement And Publication

- **Local copy.** The raw source stays in the project workspace outside Git, at `sources/xplanner-plus-r426` (ignored by Git), as amendment A4 requires.
- **In Git.** Git holds only the provenance files under `sources/provenance/`, stored byte-exact.
- **CI.** Only the allowlisted 1078 files are restored, from the pinned revision 426 of the official SVN. Each file is verified against its SHA-256 before the audit. Downloaded code is never executed, and no value is printed. A missing file, a hash mismatch or an unavailable origin fails the check.

<a id="read-method-and-scope"></a>

## Method And Scope

- **Task.** The BA reconciles all 210 existing parity-map rows against this source and the baseline WAR, starting with the 77 `Inferred` and 21 `Partial` rows. Identifiers and confirmed work are preserved.
- **Per row.** The BA records:
  - the prior claim;
  - the Java checked;
  - the WAR correspondence;
  - an outcome: confirmed, correction needed, still unsupported, or runtime-only;
  - the reason;
  - a concrete correction or live question.
- **Not included.** This is not a new map, not a full security inventory and not a review pass.
- **Cost and uncertainty.** Where source and WAR agree by name only, behavior stays `Inferred` until a method-level reading or a live observation supports it.

<a id="read-later-verification"></a>

## Later Verification

- Stage 3 live observation confirms or refutes runtime behavior.
- A later independent Stage 2 control checks the reconciled rows under the separately decided control mode.

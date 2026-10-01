# PM Edit Note: BA-001-13 Record

**Which edits did PM make to the BA-001-13 correction record after its author attested it, and do they change any content?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, in answer to Stage 2 pass 013 finding F-007.
- **Maintained / decided by:** PM. The BA author's attestation and the pass-013 report are not rewritten.
- **Governing instructions:** the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol); [pass 013](../../reviews/stage-02-pass-013.md) F-007.

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Two formatting-only PM edits; neither changes any word, figure or disposition**
>
> PM made two edits to [`stage-03-walkthrough-001-dispositions.md`](stage-03-walkthrough-001-dispositions.md) after the BA-001-13 author attested it:
> - a link in the PM assignment section;
> - code spans around nine date patterns in the author sections.
>
> Both were needed for the repository audits. They were not disclosed in the record itself; this note discloses them.
>
> **Next:** none. This note is the disclosure of record for F-007.
>
> **Details:** [Edits](#read-edits) / [Verification](#read-verification).

<details>
<summary><strong>Contents</strong></summary>

- [Edits](#read-edits)
- [Verification](#read-verification)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-edits"></a>

## Edits

| # | When and where | What changed | Why | Whole file SHA-256 | PM section SHA-256 |
|---|---|---|---|---|---|
| 0 | BA-001-13 author attestation, working tree before the first commit | none (the author's bytes) | none | `3c00505ee072b64c1007e0a706dd5bba7093ce96120485f1f6f7915b715b381d` | `29f41f0dec1501d17c17c80643e8b0222959fd716052557bde714eb831a9a955` (attested by the author) |
| 1 | PM, before the first commit of PR #37; first in revision `e61825d90fa26cd946c8f151efb74b3ef903025a` (merged as `15122bfbedccd6d8121026d57abb5f3dc4b0f5b8`) | line 69 of the PM section: the plain code span for [`legacy/README.md`](../../../legacy/README.md) became a clickable link to the same path | `audit:artifact-links` requires repository paths to be clickable | `9ab01c40a31fa849…` | `2d08a299f219f1012f6d267c3625fc6fb9fd22b19e0a24ccb03d7c50d37587d5` |
| 2 | PM, in revision `6138f37be52504cf6a14f041ef828d46f1bd8944` (Stage 2 entry for pass 013) | backticks added around nine bare date/format patterns in the author sections | the status validator rejects bare `yyyy-MM-dd` patterns as placeholders in gate evidence | `361f7e3333f876aa71e10c62f9032349705a28d9cf8d2b28a7b5db9b775f1772` | unchanged, `2d08a299…` |

The PM section hash `29f41f0d…` attested in the author's sections refers to state 0. The record's current PM section hash is `2d08a299…`, solely because of edit 1.

<a id="read-verification"></a>

## Verification

- **Edit 1.** Reverting edit 1 in the revision `e61825d` bytes (link back to the plain code span) reproduces the author's attested file hash `3c00505e…` and PM section hash `29f41f0d…` exactly. No other byte differs.
- **Edit 2.** Between `9ab01c40…` and `361f7e33…`, removing every backtick from both versions yields identical text. Only backticks were added.
- **Content.** No disposition, figure, row reference or status in the record changed. The workbook and the reconnaissance were not touched by either edit.

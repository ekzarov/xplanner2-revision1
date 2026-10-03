# Process Backlog 2026-10-01

**Which process lessons from Stages 2-3 should be decided later, without blocking the migration?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** the owner decides; Codex coordinates. Nothing here changes the current process.
- **Governing instructions:** the owner's direction of 2026-10-01: reduce scope, keep business capabilities, and limit agents so they head for the result.

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Eleven short items for the owner's next review; none blocks the current Stage 1 correction**
>
> The Stage 2 control loop took twelve passes. The Stage 3 walkthrough used six part sessions plus a lead. The items below would cut that cost next time. They are proposals only.
>
> **Next:** the owner picks which items, if any, become process changes.
>
> **Details:** [Items](#read-items).

<details>
<summary><strong>Contents</strong></summary>

- [Items](#read-items)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-items"></a>

## Items

| # | Observation | Proposal |
|---|---|---|
| 1 | Stage 2 needed 12 passes. Several were invalid only because of one stray tool command, such as `git log`. | Give reviewers a pinned runner and allowlist that make forbidden commands harder to run by mistake. Without real enforced isolation a wrapper cannot make them impossible. Judge an incident by its actual impact. |
| 2 | Every operational slip in a review, such as a missing temp variable, needed a separate incident assessment and an owner decision. | Treat harmless diagnostic slips as a disclosure-only class with a fixed checklist; owner decisions only for real exposure. |
| 3 | Rules interacted badly: blocking an unapproved attempt retroactively invalidated an earlier finding-driven return. | Simplify attempt recovery: a pending assessment pauses use, without rewriting history. |
| 4 | The Stage 3 parity scope is "every page, link and form", including obsolete channels (SOAP, WAP) and test utilities. | Agree a business-core scope before Stage 3; obsolete channels get one consumer check, not a full walkthrough. |
| 5 | The agent safety classifier stopped some legitimate checks on the owner's own isolated app (role and permission probes). | A stopped scenario stays unverified. It is never retried through another agent, tool or harness. Where the check matters, the owner may be offered it as a manual step. |
| 6 | PM tooling took the factory pair from the first matching README line, not line 38; masking silently missed it. | Configure each secret explicitly by location, and give every masking self-test a positive control on the real value. |
| 7 | Timestamps were estimated once. | Always generate them programmatically (already in practice). |
| 8 | Long Russian and English status reports. | One short story per milestone: result, scope, what is left, and the decision needed. |
| 9 | A delegated Stage 3 fallback needed a project tool change. The waiver and the transition approval were hard-wired to the owner in person, and the delegation could not name a waiver gate. | Let a delegation record state which gates and approvals it covers, from the start, so that a new delegation needs no tool change. |
| 10 | A narrow return to Stage 1 for one cell (F220) reset the displayed formal progress almost to zero (Stage 1 = 0%), although all earlier work was kept. | Show progress from closed work and open loops, not only from the current stage number, so that a narrow loop does not look like a restart. |
| 11 | The Stage 4 decision packet forbade edits in columns A-H, but the derived UF-017 banner (C227) had to change with the D-024 deferral and needed a separate exception. | Name derived summary cells (epic banners) as allowed values in decision packets from the start. |
| 12 | The Stage 6 screen-normalization schema has no field for rows deferred by Stage 4; deferred and pending rows had to sit in `_notes`, so a later audit would report them as unclassified. | Give the normalization record explicit deferred and pending row lists that keep the Stage 4 decision ID, so honest partial coverage does not look like missing coverage. |
| 13 | At Stage 6 a UX hand-off said four views were not generated, although the same UX session had already generated them through the Stitch API under a later clarification. The coordinator then generated the two dialogs again in the Stitch UI, which produced duplicate versions. | Before a hand-off to another operator, the author re-reads its own call log and lists every screen ID it created; a hand-off names the exact screens that still need to be made. |

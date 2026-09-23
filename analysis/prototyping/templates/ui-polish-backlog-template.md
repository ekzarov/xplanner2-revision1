# Deferred Minor Visual Corrections

**Which minor visual corrections may wait, who will fix them, and before which release?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Which minor visual corrections may wait, who will fix them, and before which release?**
- **Created by:** The Stage 7 independent reviewer records eligible residual cosmetic findings in a backlog.
- **Maintained / decided by:** The owner approves the bounded deferral; the Stage 15 agent maps scope and tasks; the Stage 17 agent records corrections and independently verified closure; the Stage 18 agent records regressions and returns them to Stage 17, which reopens the backlog in a new candidate.
- **Governing instructions:** Stage 7 creation and Stage 8 approval; conditional backlog input at Stages 15-19, updated at Stages 15/17; production-release and acceptance closure checks
- **When used:** Conditional input at Stages 8 and 15-19; updated at Stages 15 and 17. The Stage 15 agent matches open finding IDs to the slice screens, shared components and functions and links applicable tasks in tasks.md. Stage 16 checks completeness. Stage 17 records corrections and independent closure evidence. Stage 18 checks the whole release scope before production; Stage 18 records regressions in the delivery report and returns them to Stage 17 for backlog correction in a new candidate; Stage 19 reconciles the backlog after blind acceptance. An applicable finding cannot be postponed by assigning it to a later slice. Verified closure is required before production release and acceptance. A missing referenced backlog blocks; no file is required when no cosmetic findings exist.
- **How used:** A list of deferred minor visual corrections, such as small spacing or alignment inconsistencies that do not impair use. Each has an owner-approved scope and a concrete implementation slice; corrections must be verified before that slice reaches production. Missing behavior, security defects, broken navigation and unusable clipping never belong here.
- **Example:** A small spacing inconsistency is assigned to the task-editing slice: its Stage 17 agent corrects it, and the reviewer checks the rendered result before production release. A missing permission state is not cosmetic and still blocks Stage 8.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `deferred` (the owner postponed eligible cosmetic work to a named slice and deadline); `open` (not verified closed); `verified-closed` (the correction has independent verification evidence). A deferral is not a completed fix. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/prototyping/ui-polish-backlog.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> This conditional template is not an approved deferral or proof that corrections are complete.
>
> **Next:** The agent records only eligible, owner-authorized cosmetic deferrals and their verified closure deadlines.
>
> **Details:** [Findings And Dispositions](#read-findings-and-dispositions) / [Correction And Verification](#read-correction-and-verification).

<details>
<summary><strong>Contents</strong></summary>

- [Review Pass](#read-review-pass)
- [Findings And Dispositions](#read-findings-and-dispositions)
- [Scope Matching](#read-scope-matching)
- [Correction And Verification](#read-correction-and-verification)

</details>
<!-- ARTIFACT_READING_END -->

Use this file only when a Stage 7 pass closes with Low cosmetic findings under
the recorded owner exit criterion. Copy it to
`analysis/prototyping/ui-polish-backlog.md`.

<a id="read-review-pass"></a>

## Review Pass

- Stage: stage-07
- Review report: analysis/reviews/stage-07-pass-NNN.md
- Session ID: <exact review_passes[].session_id>
- Export set version: <exact screen-manifest.json export_set_version>
- Recorded by: <agent>
- Recorded on: <YYYY-MM-DD>

<a id="read-findings-and-dispositions"></a>

## Findings And Dispositions

| Finding | Why it is Low and cosmetic | Responsible agent | Target slice / linked task | Owner deferral decision | Due before | Status |
|---|---|---|---|---|---|---|
| <finding id and summary> | <why no never-cosmetic class applies> | <assigned implementation agent> | <named slice and task link> | <decision link> | <first production release of this slice or its Stage 19 acceptance, whichever comes first> | open |

<a id="read-scope-matching"></a>

## Scope Matching

The Stage 7 agent records stable finding IDs and the affected screen IDs,
shared components, functions, roles and parity-map rows, with links to evidence.
Before each slice, the Stage 15 agent compares every open finding with actual
scope and records the match below. A shared-component correction can apply
to more than one slice; an assigned future slice does not exempt an earlier
release of the affected functionality. Unknown scope blocks classification.

| Finding ID | Affected screens / shared components / functions / roles / rows | Evaluated slice or release | Applicable? | Linked task or non-applicability reason |
|---|---|---|---|---|
| <stable ID> | <IDs and source links; explicit n/a where appropriate> | <scope link> | <yes/no/unknown> | <task link or evidence-backed reason> |

For each release the agent records the backlog revision and evaluated finding
IDs in the delivery/review record. Closed findings retain their evidence;
a reproduced defect or regression is reopened on the same ID with a dated
reason and new evidence. States are open, ready for verification, verified
closed, or reopened. Implementation alone never means verified closed.

<a id="read-correction-and-verification"></a>

## Correction And Verification

| Finding | Correction commit / files | Rendered evidence / tests | Independent verifier and date | Result |
|---|---|---|---|---|
| <same finding id> | <links> | <links> | <agent and YYYY-MM-DD> | <open or verified closed> |

The Stage 7 reviewer records the finding. Before Stage 8 approval, the agent
records the responsible implementation agent, named slice, linked task and
owner-approved deferral. The Stage 15 agent carries the task into the plan;
the Stage 17 agent implements it. An independent agent verifies the result.
Stage 18 production release and Stage 19 acceptance require verified closure;
demo/test delivery may occur earlier for verification. "Later" is not a deadline.
See the [correction deadline contract](../../migration_methodology.md#minor-visual-correction-deadline-contract).

Example (illustrative, not project evidence): a small task-form spacing
inconsistency is assigned to the task-editing slice. Its Stage 17 agent fixes
the spacing, links the correction and rendered comparison, and an independent
agent verifies closure before that slice's first production release.

Every finding in the closing pass appears exactly once. Missing flows, invented
behavior, incorrect roles or security, missing required states/actions/dialogs,
broken navigation, unusable clipping, and unapproved target-only behavior never
belong in this backlog.

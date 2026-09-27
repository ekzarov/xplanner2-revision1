# Stage 8 UI/UX Approval - Prototype

**Did the owner approve these exact wireframes, and which remarks or unreviewed screens remain?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 8 agent records the human owner explicit verdict against the exact prototype baseline.
- **Maintained / decided by:** The agent records a new owner verdict when the reviewed baseline changes; only the owner approves it.
- **Governing instructions:** Stage 8
- **When used:** At Stage 8 the agent records the owner's explicit approval of the exact manifest, export hashes and closing review. Later UI work must use this pinned version.
- **How used:** The owner's signature under the exact prototype version reviewed at Stage 7. It pins the manifest, exported wireframes and closing review so later design and acceptance cannot silently switch to a different visual baseline.
- **Example:** The owner approves export set v12, allowing Stage 15 to cite those screens and Stage 17 to compare the built UI against them.

**Proposal, decision and remaining work:**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `pending` (not reviewed); `approved` (the owner approved this exact screen/export scope); `remarks` (corrections requested); `rejected` (not approved). Later changed exports require a new exact-set decision. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/prototyping/ui-ux-approval.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> The exact prototype set has not yet received a recorded owner verdict.
>
> **Next:** The Stage 8 agent records the owner verdict for the exact export set and remaining remarks.
>
> **Details:** [Reviewed Set](#read-reviewed-set) / [Approval Boundary](#read-approval-boundary).

<details>
<summary><strong>Contents</strong></summary>

- [Shared UI Baseline](#read-shared-ui-baseline)
- [Reviewed Set](#read-reviewed-set)
- [Remarks and Resolution](#read-remarks-and-resolution)
- [Approval Boundary](#read-approval-boundary)
- [Owner Statement](#read-owner-statement)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- Date: YYYY-MM-DD
- Approved by: <project owner>
- Scope: <project or feature identifier>
- Approved export set version: <value from screen-manifest.json>
- Screen manifest SHA-256: <hex SHA-256 of screen-manifest.json>
- Stage 7 closing report: analysis/reviews/stage-07-pass-NNN.md
- Stage 7 result: <clean | low-cosmetic findings dispositioned in ui-polish-backlog.md>

<a id="read-shared-ui-baseline"></a>

## Shared UI Baseline

The manifest hash above includes `ui-design-system.md`, `ui-design-tokens.json`
and component preview resources, as well as screen exports. The owner reviews
this combined set. The Stage 7 report must explicitly reconcile screens, used
variants, token values and applicable states; pending required scope blocks approval.
For an explicitly non-visual scope record why no UI kit is applicable.

- Shared kit and tokens reviewed: [exact manifest source pins, or non-visual reason]
- Component sheets inspected: [manifest resource paths]
- Remaining decisions / unverified scope: [none, or explicit blocker]

<a id="read-reviewed-set"></a>

## Reviewed Set

| Screen ID | Channel | Roles | States | Export files | Verdict |
|---|---|---|---|---|---|
| <screen-id> | <channel> | <roles> | <states> | <linked exact exports> | pending/approved/remarks/rejected |

<a id="read-remarks-and-resolution"></a>

## Remarks and Resolution

| ID | Owner remark / expected correction | Actual resolution and evidence | State | Return stage or authorized backlog disposition |
|---|---|---|---|---|
| R-NNN | <remark or none> | <linked correction or not resolved> | open/verified-closed/deferred | <stage and reason or exact authorized cosmetic finding> |

<a id="read-approval-boundary"></a>

## Approval Boundary

The Stage 8 agent records the owner's decision; it cannot infer approval from
a clean Stage 7 report, a filled Reviewed Set or a planned correction.

- Approved scope: <exact screen/role/state IDs or none; owner decision evidence>
- Scope with remarks or rejection: <IDs and unresolved remark links or none>
- Not reviewed: <IDs and reason or none; not counted as approved>
- Explicit cosmetic deferrals: <backlog finding IDs, tasks, responsible actor,
  owner decision and deadline, or none>
- Decision recorded by / owner / date: <identities and durable evidence>

Every item in the reviewed baseline is accounted for once in the first three
scope groups; cosmetic deferrals annotate the relevant approved scope rather
than pretending that the correction was completed. Open blocking remarks or
required unreviewed scope prevent approval of the whole baseline.

<a id="read-owner-statement"></a>

## Owner Statement

The recording agent links any Stage 7 minor visual correction backlog here,
including the owner's explicit agreement to each responsible agent, named
slice and task. Every item is due before that slice's first production release
or Stage 19 acceptance, whichever comes first. If no backlog is needed, the
agent records "none". This approval does not authorize unresolved production
release.

<Record the owner's explicit approval of the identified export set as the
visual baseline for Stage 15 SDD.>

Approval is valid only for the exact export-set version and manifest hash
recorded above and a closing Stage 7 pass registered for that same version. A
later material UI change returns to Stage 6 and repeats Stages 7-8 for the
changed scope.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At Stage 2 full-blind and Stage 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

- **Self-check:** <stage/scope; result version; checklist revision or SHA-256;
  applicable CHK IDs and passed/failed/blocked outcomes; exclusions with reasons;
  or no learned checks yet>
- **Learning update:** <confirmed generalized proposals and basis; covered by
  existing CHK IDs; or no qualifying new check and why>

Independent reviewers propose changes here without editing the shared table.
The coordinator records actual admission/deduplication in the current correction
or work record. The owner need not write this section. This note does not replace
the required independent review, human decision or stage evidence.

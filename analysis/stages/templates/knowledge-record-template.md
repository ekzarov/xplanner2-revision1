# Stage 13 Target Knowledge Record - <scope>

**What knowledge was produced, what is missing, and is the package ready for independent control?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **What knowledge did the agent produce, from which exact sources, and what remains before independent control?**
- **Created by:** The Stage 13 synthesis agent writes the execution and coverage record from the actual work and audit results.
- **Maintained / decided by:** The same responsible agent records corrections and limitations until that synthesis is handed to independent control.
- **Governing instructions:** Stage 13
- **When used:** Written after synthesis to record the source set, generated concepts, exclusions and the result of the knowledge audit.
- **How used:** The execution record for the Google Cloud-published, vendor-neutral OKF v0.2 synthesis. It identifies the exact architecture source set, lists the concepts produced, documents limitations or exclusions and records whether the Stage 13 knowledge gate passed.
- **Example:** XPlanner synthesis 001 records eight draft concepts, sixteen pinned sources, passing integrity checks and a blocked global gate because the current Stage 11 owner verdict is missing.

**Produced coverage and handoff boundary:**

- Exact approved inputs and declared source/requirement scope
- Source item mapped to the produced concept or SDD section
- Represented / missing / contradictory / explicitly deferred or excluded
- Remaining gaps, responsible actor and blocking prerequisites
- Readiness for the next independent review, not its verdict

A file hash proves identity, not correctness. Planned tests are not executed tests, and authored coverage is not implemented behavior.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `ready for control` (the authored package is ready for Stage 14 review, not already approved); `changes required` (source/coverage corrections remain); `blocked` (a required source approval or other prerequisite is missing). [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/stages/stage-13/knowledge-record.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Source approval, semantic coverage and handoff readiness are not yet established.
>
> **Next:** The Stage 13 agent reconciles sources and concepts, then hands the eligible package to Stage 14.
>
> **Details:** [Source-To-Output Reconciliation](#read-source-to-output-reconciliation) / [Remaining Work](#read-remaining-work) / [Gate Result](#read-gate-result).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Knowledge Bundle](#read-knowledge-bundle)
- [Coverage](#read-coverage)
- [Source-To-Output Reconciliation](#read-source-to-output-reconciliation)
- [Remaining Work](#read-remaining-work)
- [Verification](#read-verification)
- [Gate Result](#read-gate-result)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

**What knowledge did the agent produce, from which exact sources, and what remains before independent control?**

<a id="read-metadata"></a>

## Metadata

- Date: YYYY-MM-DD
- Author: <agent or person>
- Scope: <project or slice identifier>
- Architecture document set: <approved version and hash>
- Knowledge manifest: `analysis/knowledge/knowledge-manifest.json`
- Result: ready for control | changes required | blocked

<a id="read-knowledge-bundle"></a>

## Knowledge Bundle

| Concept ID | File | Architecture sources | Parity sources | Status |
|---|---|---|---|---|
| <stable id> | <linked bundle file> | <ADR/NFR/diagram refs> | <row or decision refs> | draft/current/stale |

<a id="read-coverage"></a>

## Coverage

- System boundary and actors: <references>
- Components and responsibilities: <references>
- Data, integrations, and background work: <references>
- Security, deployment, operations, and localization: <references>
- Approved target-only decisions and deferred items: <references>

<a id="read-source-to-output-reconciliation"></a>

## Source-To-Output Reconciliation

The Stage 13 agent accounts for the declared source scope. A concept file that
exists or has a current hash is not thereby independently verified at Stage 14.

| Source item and exact version | Expected knowledge coverage | Produced concept / section | Authoring result | Gap or exclusion evidence |
|---|---|---|---|---|
| <linked source item> | <fact, boundary or rule> | <linked output or missing> | represented/missing/contradictory/excluded | <gap ID or authorized scope reason> |

<a id="read-remaining-work"></a>

## Remaining Work

| Gap ID | Missing source approval, omitted coverage or contradiction | Affected concepts | Responsible actor / next action / return stage | Blocks handoff |
|---|---|---|---|---|
| K-NNN | <gap or none> | <IDs> | <actor, action and stage> | yes/no with governing reason |

- Source items in scope: <count>; represented: <count>; missing: <count>;
  contradictory: <count>; excluded: <count>. The four outcomes sum to the scope.
- Required unchecked source or approval: <links or none>.
- Stage 14 independent verdict: <not yet performed, or separate exact report>.

<a id="read-verification"></a>

## Verification

- `npm --prefix analysis/tools run audit:knowledge`: <result>
- Missing or contradictory concepts: <none or references>

<a id="read-gate-result"></a>

## Gate Result

<State whether the OKF bundle is complete, source-linked, pinned to the exact
approved architecture, and ready for an eligible Stage 14 reviewer.>

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

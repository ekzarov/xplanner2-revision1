# Stage 4 Requirements Revision - <scope>

**What did the owner decide to keep, change, defer or exclude, and what remains unapplied?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 4 agent prepares findings and records explicit decisions by the human owner.
- **Maintained / decided by:** The Stage 4 agent appends corrections and decisions; the owner decides keep, change, defer or do-not-port.
- **Governing instructions:** Stage 4
- **When used:** Used when discovery exposes contradictory, obsolete or unwanted behavior. The agent records the business owner's explicit keep, change or defer decisions before prototyping.
- **How used:** The durable decision log for challenged legacy behavior. For every contradiction, obsolete rule or questionable workflow it records whether to keep, change or not port it, together with rationale, participants and owner confirmation.
- **Example:** The owner defers the legacy wiki workflow because that logic should not move into the replacement.

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

> **Reading statuses:** `approved` (the recorded owner decisions cover this scope); `changes required` (reconciliation is unfinished); `blocked` (required decisions or evidence are missing). Row choices such as `keep` (preserve behavior) and `do-not-port` (exclude the named legacy behavior under its recorded conditions) are not owner approval without decision evidence. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/stages/stage-04/stage-04-requirements-revision.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Owner decisions and applied map changes are not yet established.
>
> **Next:** The Stage 4 agent records explicit owner decisions and reconciles them with the parity map.
>
> **Details:** [Decisions](#read-decisions) / [Decision Reconciliation](#read-decision-reconciliation) / [Gate Result](#read-gate-result).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Review Scope](#read-review-scope)
- [Decisions](#read-decisions)
- [Map Corrections](#read-map-corrections)
- [Decision Reconciliation](#read-decision-reconciliation)
- [Delivery-Slice Implications](#read-delivery-slice-implications)
- [Owner Confirmation](#read-owner-confirmation)
- [Gate Result](#read-gate-result)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Date: YYYY-MM-DD
- Participants: <project owner, business representatives, developer>
- Inputs: <parity-map revision and Stage 3 record>
- Outcome: approved | changes required | blocked

<a id="read-review-scope"></a>

## Review Scope

<Rows, flows, channels, contradictions, obsolete behavior, and unusual
requirements reviewed.>

<a id="read-decisions"></a>

## Decisions

The Stage 4 agent records proposals separately from the human owner's decision.
A populated target description is not evidence of approval.

| ID | Source rows and observed legacy behavior | Question / proposed target behavior | Explicit owner decision | Rationale | Decision evidence / owner / date |
|---|---|---|---|---|---|
| D-NNN | <links and behavior> | <issue and proposal> | pending/keep/change/defer/do-not-port | <reason> | <durable link or pending> |

<a id="read-map-corrections"></a>

## Map Corrections

If a contradiction is a discovery/mapping error, the Stage 4 agent records its
finding ID, affected rows, expected versus recorded legacy behavior and source
evidence, then cites this exact revision record and those IDs in the status
return to Stage 1. The primary Stage 1 agent follows the
[return and correction protocol](../../reviews/README.md#stage-1-re-entry)
and records dispositions, corrected paths/rows, checks and remaining work.
Correction does not replace the fresh Stage 2 review or the required forward
stages before Stage 4 is resumed.

An owner-approved change to correctly recorded legacy behavior stays at Stage 4:
retain the legacy fact and record the intended target deviation separately.
Do not send an ordinary keep/change/do-not-port decision back as a map error.

| Finding | Correction | Returned to Stage 1 | Evidence |
|---|---|---|---|
| <finding or none> | <change> | yes/no | <reference> |

<a id="read-decision-reconciliation"></a>

## Decision Reconciliation

| Decision ID | Required map / target change | Applied change and evidence | State | Remaining action / responsible actor / due condition |
|---|---|---|---|---|
| D-NNN | <expected change or keep> | <actual linked change or not applied> | applied/verified-unchanged/open/deferred | <action or none> |

The agent accounts for every question in scope. Pending questions, approved but
unapplied changes, map defects returned to Stage 1, and explicit deferrals stay
visible here. A deferral cites its exact scope, owner authority and re-entry
condition; it is not an implemented or verified change.

<a id="read-delivery-slice-implications"></a>

## Delivery-Slice Implications

<Dependency, sequencing, target-only requirement, security, data, channel, or
architecture implications for later stages.>

<a id="read-owner-confirmation"></a>

## Owner Confirmation

<Record the owner's explicit confirmation of every decision in scope.>

<a id="read-gate-result"></a>

## Gate Result

<State whether all identified questions have decisions, all map errors have
returned to Stage 1, and Stage 5 may begin.>

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
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

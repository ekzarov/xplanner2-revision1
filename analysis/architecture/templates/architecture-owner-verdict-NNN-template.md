# Architecture Owner Verdict

**What did the owner decide about this exact architecture, and which items must Stage 12 verify?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **What did the owner decide, and which exact architecture and items does that decision cover?**
- **Created by:** The Stage 11 agent records the explicit human owner decision against the exact reviewed architecture.
- **Maintained / decided by:** Completed decisions are immutable; each new owner review creates a new numbered record and preserves earlier finding IDs.
- **Governing instructions:** Stage 11 and architecture/review-cycles.md
- **When used:** Stage 11 records the human decision in a new numbered immutable file. Stage 12 reads the exact record selected in status. Re-entry requires the previous negative closure and correction evidence; the owner decides again.
- **How used:** The recorded human decision on an exact architecture set, with scope, evidence, predecessors and stable items for closure. It is produced at 11 and read at 12 and 13; closure is a separate report.
- **Example:** The owner approves the corrected Foundation set; its verdict retains the earlier engineering-quality item ID and links the fresh Stage 10 report.

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

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No actual human approval is established by a draft.
>
> **Next:** The agent records the human decision. An approved verdict is read-only input to Stage 12; remarks follow the classified return.
>
> **Details:** [Decision](#read-decision) / [Return And Next Action](#read-return-and-next-action).

<details>
<summary><strong>Contents</strong></summary>

- [Contents](#read-contents)
- [Decision](#read-decision)
- [Items For Closure](#read-items-for-closure)
- [Return And Next Action](#read-return-and-next-action)
- [Record Binding](#read-record-binding)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

**Reading statuses:** `complete` means an actual decision or check was recorded; it is not automatically approved or passed. `historical-reconstruction` is an explanatory example, never transition evidence. `blocked` means required evidence is missing. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

Template output: `analysis/stages/stage-11/architecture-owner-verdict-NNN.md`.

**What did the human owner decide about this exact architecture, and which items must the closure check verify?**

The Stage 11 agent records the owner's actual decision. It cannot approve on the
owner's behalf. Each completed attempt gets a new number and remains immutable.
This is input to Stage 12, not its closure result. Follow
[Architecture Review Cycles](../review-cycles.md).

> [!WARNING]
> Draft: no owner decision or Stage 12 closure is established by this template.

<a id="read-contents"></a>

## Contents

- [Decision](#decision)
- [Items for closure](#items-for-closure)
- [Return and next action](#return-and-next-action)
- [Record binding](#record-binding)

<a id="read-decision"></a>

## Decision

Describe the approved scope, trade-offs and explicit exclusions in plain language.
Quote or link the actual human decision evidence. Distinguish approval from a
request for changes. No response, agent agreement or green audit is approval.

<a id="read-items-for-closure"></a>

## Items For Closure

Retain applicable IDs from the triggering closure and earlier owner verdict.
New owner items use AOV-NNN-RNNN. A zero-item set is an explicit empty table,
not a placeholder row. Do not silently drop an earlier finding. If the owner explicitly withdraws an
item or excludes its scope, retain its original row and record an entry in
`dispositions` with `id`, `decision` (withdrawn or out-of-scope), and actual human
`evidence`. This is an owner disposition, not verified closure.

| ID | Origin | Criterion | Affected scope |
|---|---|---|---|

<a id="read-return-and-next-action"></a>

## Return And Next Action

Explain what failed previously, what changed, correction evidence and what is
still unresolved. On approval the next check is Stage 12; remarks follow the
classified return. Record any scope disposition with attributable owner evidence.

<a id="read-record-binding"></a>

## Record Binding

The agent fills the YAML block from actual evidence. `draft` cannot pass a gate.
Use `none` only for a genuinely absent predecessor. Stage entry is the exact
entry timestamp from status; record time is when this decision was recorded.

```yaml
record_id: AOV-NNN
record_status: draft
recorded_at: null
stage_entry: null
scope: null
document_set_version: null
manifest_sha256: null
drawio_sha256: null
stage10_report: null
stage10_sha256: null
decided_by: null
decision_evidence: null
decision: pending
previous_owner_verdict: none
previous_closure: none
dispositions: []
```

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

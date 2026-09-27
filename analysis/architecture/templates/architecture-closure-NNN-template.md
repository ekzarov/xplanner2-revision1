# Architecture Remark Closure

**Which remarks are demonstrably closed, what remains unverified, and where must work return?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Which remarks are demonstrably closed, what remains unverified, and where must work return?**
- **Created by:** The responsible Stage 12 agent authors the actual closure check, including failed or blocked attempts.
- **Maintained / decided by:** Completed checks are immutable; each attempt creates a new numbered report. Return-stage agents read the exact negative report and record dispositions.
- **Governing instructions:** Stage 12 and architecture/review-cycles.md
- **When used:** The responsible Stage 12 agent creates a numbered report for every attempt. The closure gate checks current bindings, item coverage, counts and passed result. A negative report follows the classified return; Stages 9-11 read it before the next owner decision.
- **How used:** A separate immutable result of Stage 12: criteria versus observed evidence, unchanged-set check, reconciled item counts and classified return. It never changes the human verdict or approved architecture. Stage 13 reads it with the owner verdict.
- **Example:** A required retry policy is still absent: mark the item failed, cite the exact section, return to 9, then repeat fresh 10, owner review 11 and closure 12. The next report keeps the same item ID.

**How each owner remark is closed:**

- Original remark ID and observable closure criterion
- Applied fix and exact changed files
- Actual closure check and evidence
- Verified-closed / owner-dispositioned / open / failed / blocked with reconciled totals
- Unintended changes checked; final owner verdict pins the corrected set

Every attempt creates a separate immutable closure report. It verifies the selected owner verdict without changing it. A failed report accompanies the return and is read on re-entry at Stages 9-11.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Closure evidence and unchanged-set checks are not yet established.
>
> **Next:** The responsible agent records a separate immutable check. A negative report follows the return and must be read at the next owner review.
>
> **Details:** [Result And Remaining Work](#read-result-and-remaining-work) / [Return And Next Action](#read-return-and-next-action).

<details>
<summary><strong>Contents</strong></summary>

- [Contents](#read-contents)
- [Result And Remaining Work](#read-result-and-remaining-work)
- [Item Checks](#read-item-checks)
- [Unintended Changes](#read-unintended-changes)
- [Return And Next Action](#read-return-and-next-action)
- [Record Binding](#read-record-binding)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

**Reading statuses:** `complete` means an actual decision or check was recorded; it is not automatically approved or passed. `historical-reconstruction` is an explanatory example, never transition evidence. `blocked` means required evidence is missing. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

Template output: `analysis/stages/stage-12/architecture-closure-NNN.md`.

**Which owner remarks and earlier findings are demonstrably closed, what remains unverified, and where must work return?**

The responsible Stage 12 agent compares the selected owner verdict with the
exact approved architecture. It creates this separate immutable report and
does not edit architecture, approved hashes or the owner's decision. This is
not a fresh independent Stage 10 review. Follow
[Architecture Review Cycles](../review-cycles.md).

> [!WARNING]
> Draft: closure has not been checked. Missing evidence is blocked, not passed.

<a id="read-contents"></a>

## Contents

- [Result and remaining work](#result-and-remaining-work)
- [Item checks](#item-checks)
- [Unintended changes](#unintended-changes)
- [Return and next action](#return-and-next-action)
- [Record binding](#record-binding)

<a id="read-result-and-remaining-work"></a>

## Result And Remaining Work

State the result in plain language and summarize verified-closed, open, failed
and blocked counts. Explain the main gap and responsible next actor. With zero
items, explicitly record the unchanged approved set and no fixes required.

<a id="read-item-checks"></a>

## Item Checks

One row per applicable owner/prior item, preserving IDs. Compare the criterion
with an actual observation at an exact file/section and provide evidence.
New agent findings use AC-NNN-FNNN and must not be attributed to the owner.
States: verified-closed, owner-dispositioned, open, failed, blocked.
Use owner-dispositioned only for an explicit disposition in the selected owner
verdict; cite its human evidence. It is counted separately, never as a passed fix. Missing evidence is blocked.

| ID | Criterion | Observation | Evidence | State |
|---|---|---|---|---|

<a id="read-unintended-changes"></a>

## Unintended Changes

Record the exact approved set comparison, NFR/ADR/Draw.io consistency and whether
corrections changed other decisions. Hash equality is identity, not proof that a
criterion was met. Link the actual semantic checks and note unchecked scope.

<a id="read-return-and-next-action"></a>

## Return And Next Action

A failed architecture check returns to 9, then fresh 10, new owner verdict at
11 and a new report at 12. Parity defects return to 1, UI structure to 6 and a
deliberate baseline change to 5. The exact negative report follows the return.
Step 11 must read it and correction dispositions on re-entry. Passed closure
permits the governed handoff to 13; a report alone is not transition authority.

<a id="read-record-binding"></a>

## Record Binding

The agent fills actual paths, hashes, timestamps and table totals. The owner
record is read-only. `historical-reconstruction` may illustrate old evidence
but never counts as a performed check. `none` is the return only when passed.

```yaml
record_id: AC-NNN
record_status: draft
recorded_at: null
stage_entry: null
scope: null
document_set_version: null
manifest_sha256: null
owner_verdict: null
owner_verdict_sha256: null
previous_closure: none
checked_by: null
unchanged_approved_set: false
unchanged_set_evidence: null
result: blocked
return_stage: stage-09
counts:
  verified-closed: 0
  owner-dispositioned: 0
  open: 0
  failed: 0
  blocked: 0
```

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

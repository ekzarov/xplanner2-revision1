# Stage 19 Acceptance - <slice>

**Did independent acceptance verify this scope, and what remains before the owner can accept it?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** A fresh independent agent assigned to Stage 19 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Governing instructions:** Stage 19 independent control and reviewer eligibility
- **When used:** At Stage 19, a fresh independent third-party agent exercises the scope using expectation-only extracts without implementation status, destination notes, prior test results or findings. The agent saves observations before Phase B opens full originals, verifies extract completeness and reconciles evidence. A clean report is required before owner acceptance. An implementation defect returns to Stage 17, an SDD defect to Stage 15, an architecture defect to Stage 9, and a parity-map defect to Stage 1.
- **How used:** The independent acceptance report for the deployed slice or final system. A reviewer from outside the implementation team verifies useful role-based journeys, required evidence and remaining findings before the owner signs acceptance.
- **Example:** The reviewer repeats the task-time journey for member and read-only roles and records a clean verdict against the deployed SHA.

**What the review records:**

- Exact scope and authoritative expected result
- Actual observation and evidence for each check
- Matched / mismatch / not-checked / not-applicable
- Linked findings, blocked scope and reconciled totals
- Verdict and next action; prior results are not newly verified

Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

**Conditional cosmetic backlog check:**

- Stage 19: The independent acceptance agent consumes the conditional backlog after the blind acceptance pass, during evidence reconciliation, so prior findings do not bias the first inspection. The agent checks applicable finding IDs and verified closure against the running system; final acceptance checks the whole backlog. Open applicable findings block acceptance and return to Stage 17; the immutable acceptance report records the outcome.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `clean` (the declared scope meets independent acceptance rules); `findings` (discrepancies remain); `blocked` (required checks could not finish); `invalid` (the attempt is unusable). Final owner acceptance remains a separate decision. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/reviews/stage-19-pass-NNN.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

> **Credential safety:** Before saving/hashing Phase A observations or handing
> off this report, check new evidence under [credential-safe evidence](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/agent_orchestration.md#credential-safe-evidence)
> in the project's orchestration protocol.
> Cite source locations, not credential values. Record check scope and limitations
> in Evidence; do not silently rewrite previously frozen snapshots.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No independent acceptance result or final owner decision is recorded.
>
> **Next:** The independent reviewer records acceptance evidence; the human owner separately decides final acceptance.
>
> **Details:** [Comparison Results](#read-comparison-results) / [Owner Decision](#read-owner-decision) / [Coverage Summary](#read-coverage-summary).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Accepted Scope](#read-accepted-scope)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Evidence](#read-evidence)
- [Findings And Reopened Work](#read-findings-and-reopened-work)
  - [F-NNN -](#read-f-nnn-)
- [Blocked Scope](#read-blocked-scope)
- [Conclusion and Next Gate](#read-conclusion-and-next-gate)
- [Owner Decision](#read-owner-decision)
- [Error Prevention](#read-error-prevention)
  - [Checklist Review](#read-checklist-review)
  - [Reviewer Self-Check And Learning](#read-reviewer-self-check-and-learning)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Slice:
- Target revision:
- Environment:
- Independent acceptance report:
- Acceptance date:
- Verification mode: delta | expanded | full
- Expansion trigger: <none or exact trigger>
- Result: clean | findings | blocked | invalid
- Reviewer and fresh session: <identity and session ID>
- Independence evidence: <read-only, no authored artifacts, fresh context; link>

<a id="read-accepted-scope"></a>

## Accepted Scope

- SDD requirements:
- Parity-map rows:
- Target surfaces and roles:
- Explicit exclusions or deferred scope:
- Direct dependencies accepted:

<a id="read-comparison-scope"></a>

## Comparison Scope

The independent reviewer defines the check items before assigning results.
Each item identifies a requirement, behavior, screen/role/state, NFR/ADR,
knowledge concept, dependency or acceptance action and its exact source.
Stage 2 preserves its blind inventory before comparison; Stage 19 preserves
the blind live pass before reconciling prior findings and backlog evidence.

- Review mode and exact checked boundary: `<full | expanded | delta; scope>`
- Previous report and pinned baseline: `<links and hashes, or none>`
- Changed items and direct dependencies rechecked: `<IDs and links>`
- Prior results relied on but not rerun: `<prior report/check IDs and reason>`
- Expansion triggers examined: `<triggers and decisions>`

A delta pass checks every item in its declared delta and direct dependencies.
Previously checked, unchanged items are disclosed separately; they are not
counted as newly matched or silently described as a fresh full review.

<a id="read-comparison-results"></a>

## Comparison Results

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-NNN / `<exact item>` | `<expected behavior and source link>` | `<actual observation, or explicitly not observed>` | matched / mismatch / not-checked / not-applicable | `<file/row/command/rendered evidence link>` | `<F-NNN / B-NNN / E-NNN / none>` |

The reviewer uses exactly one result per item:
- **matched**: inspected against the expected result, with supporting evidence.
- **mismatch**: inspected and different; linked to a detailed F-NNN below.
- **not-checked**: no sufficient check could be completed; linked to B-NNN.
- **not-applicable**: outside the justified applicability of this check;
  linked to E-NNN with scope evidence and decision authority where required.

The absence of findings is not proof of a match. A green tool run is evidence for the
specific property it tests, not proof of semantic correctness of the whole item.
Unknown or inaccessible is not not-applicable. Each independently required
obligation is accounted for; grouped items need a linked exhaustive breakdown.
Rows are partitioned rather than counted twice. Stage-specific evidence below
may extend this table or link detailed ledgers using the same check IDs.

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| `<total>` | `<count>` | `<count>` | `<count>` | `<count>` |

The total equals the four result counts. Counts refer to the comparison items,
not automatically to workbook rows, screens or entire requirements.
Prior results relied on without rerunning are listed separately in Comparison
Scope and are not included in these counts. Record finding totals separately:
one finding may affect multiple checks.

<a id="read-evidence"></a>

## Evidence

| Gate | Durable evidence | Result |
|---|---|---|
| Build and automated tests | <reference> | pass/fail |
| Deployment and smoke | <reference> | pass/fail |
| Live revision | <reference> | pass/fail |
| Independent Stage 19 pass | <reference> | clean/findings/blocked/invalid |
| Prototype parity, when applicable | <reference or waiver> | pass/waived |
| Architecture and SDD traceability | <reference> | pass/fail |
| Complete NFR evidence chain | <reference or architecture waiver> | pass/waived |
| Acceptance readiness `audit:stage19` | <command output or report for the declared scope> | pass/fail |
| Owner walkthrough or exact decline decision | <reference> | completed/declined |

Final completion is a separate checkpoint: after full-system acceptance and
explicit final owner authorization, the agent records `complete` and runs
`audit:all`. Link its result from the completion evidence. It is not a prerequisite
for this independent report or for accepting a slice with unrelated work still open.

<a id="read-findings-and-reopened-work"></a>

## Findings And Reopened Work

List every finding, its return stage, and the immutable reopened-slice record.
Use `None` only when the independent pass is clean.

<a id="read-f-nnn-"></a>

### F-NNN - <short title>

- Comparison check IDs: <C-NNN IDs>
- **Checklist link:** <CHK-NNN IDs and pinned checklist/row; or none: new finding>
- **Checklist discrepancy:** <author claim/source versus observed issue/evidence;
  failed result, unjustified exclusion, missing required self-check record,
  unsupported claimed pass; or not applicable>
- **Required recheck:** <CHK IDs, affected scope, correction and expected result;
  or not applicable>
- Severity: critical | high | medium | low
- Expected and source: <required result and authoritative link>
- Observed difference and evidence: <actual result and link>
- Requirement impact: <affected obligation>
- Required action: <correction or check>
- Correction impact: <affected items, dependencies and same-mechanism occurrences;
  evidence for any proposed broader investigation, not an automatic stage restart>
- Return stage and reopened work: <17 | 15 | 9 | 1, classified by cause; link>

The author follows [Correction Scope And Handoff](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/README.md#correction-scope-and-handoff)
on return; this does not narrow independent acceptance or permit editing its
sealed evidence.

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| B-NNN / E-NNN | <C-NNN> | <why not checked or not applicable> | <unblocking action or exact scope basis> | <link> |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** <F-NNN/B-NNN linked to CHK-NNN and required rechecks;
  or no checklist-related issues, without implying the whole review passed>

Include this concise checklist issue summary in the first-screen result block
as well. The receiving author retains finding and CHK IDs in its correction
record; a later independent pass verifies closure without editing this report.

The reviewer reconciles the verdict with Coverage Summary. Required
not-checked scope blocks acceptance; mismatches require correction and a new
pass; invalid eligibility or protocol prevents reliance. Not-applicable items
need scope evidence and are not counted as passed. A clean independent report
does not supply the owner's decision. Later corrections or owner findings
create new linked records, not edits to this immutable report.

<a id="read-owner-decision"></a>

## Owner Decision

- Decision: accepted | rejected | changes-required
- Decided by:
- Decided at:
- Scope:
- Rationale:
- Durable approval record:

Acceptance is not valid until this record, the status delivery ledger, the
consolidated backlog, SDD tasks, and parity map agree.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: <exact version; at 2/19 first opened in Phase B>
- Author self-check record/version: <linked report or status note; or not recorded>

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| <CHK-NNN; scope and applicability reason> | <claimed result and exact source, or not recorded> | <passed / failed / blocked / not applicable; actual evidence and C-NNN> | <F-NNN or B-NNN; correction and repeated check, or none> |

Account for applicable checks and exclusions; if none exist, write "no learned
checks yet", not passed. Link existing comparison evidence without double-counting.
A missing required record is not proof that the author did not read the checklist.
Historical records are not retroactively assigned this reporting duty.

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

The self-check below concerns this reviewer's work; the author's claims and
the independent comparison belong in Checklist Review above.

- **Self-check:** <stage/scope; result version; checklist revision or SHA-256;
  applicable CHK IDs and passed/failed/blocked outcomes; exclusions with reasons;
  or no learned checks yet>
- **Learning update:** <confirmed generalized proposals and basis; covered by
  existing CHK IDs; or no qualifying new check and why>

Independent reviewers propose changes here without editing the shared table.
The coordinator records actual admission/deduplication in the current correction
or work record. The owner need not write this section. This note does not replace
the required independent review, human decision or stage evidence.

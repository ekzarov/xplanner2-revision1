# Slice Verification Record

**What was actually checked, on which version, and what remains unverified?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **What was actually checked, on which version, and what remains unverified?**
- **Created by:** The Stage 17 implementation agent records actual requirement-level checks from executed tests or procedures.
- **Maintained / decided by:** Stage 18-19 agents add separate delivery and acceptance evidence; independent agents review without rewriting historical runs.
- **Governing instructions:** Stage 15-19 traceability and verification-link contract in specs/traceability-guide.md
- **When used:** The Stage 17 agent records actual runs; Stage 18-19 agents add separate delivery/acceptance records. Earlier evidence remains immutable.
- **How used:** Links each in-scope requirement and applicable NFR to a concrete test or procedure, expected and observed outcome, checked revision, environment and evidence. Independent reviewers inspect the meaning; recorded is not a pass.
- **Example:** A no-stories requirement links to a named empty-state test and its run log; missing revision information remains an explicit gap.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Template output:** `specs/NNN-feature/verification-record.md`.
> The Stage 17 agent uses the actual slice directory. Later immutable runs use
> separate dated record paths and preserve previous observations.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No execution evidence or independent acceptance is established by this template.
>
> **Next:** The independent reviewer reconciles the actual checks and gaps; a plan or linked record is not a pass.
>
> **Details:** [Requirement Checks](#read-requirement-checks) / [Review and Next Action](#read-review-and-next-action).

<details>
<summary><strong>Contents</strong></summary>

- [Execution Scope](#read-execution-scope)
- [Requirement Checks](#read-requirement-checks)
- [Gaps and Exclusions](#read-gaps-and-exclusions)
- [Review and Next Action](#read-review-and-next-action)

</details>
<!-- ARTIFACT_READING_END -->

Follow [the traceability contract](traceability-guide.md) when recording and
independently reviewing these results.

<a id="read-execution-scope"></a>

## Execution Scope

- Feature: <exact feature ID>
- Checked revision/build: <immutable identifier; never just main or latest>
- Date and producer: <actual execution date and agent/tool identity>
- Environment: <local/candidate/deployed; identify the actual environment>
- Commands or manual procedure: <exact commands and durable logs>
- Scope summary: <passed, failed, blocked, not-run and excluded totals>

<a id="read-requirement-checks"></a>

## Requirement Checks

| Requirement / behavior / NFR | Check ID and test/procedure link | Expected | Observed | Result | Evidence |
|---|---|---|---|---|---|
| <exact IDs> | <test selector or manual procedure> | <required outcome> | <actual observation, or not run> | pass/fail/blocked/not-run | <durable log, assertion or observation> |

Every in-scope requirement is mapped or listed as a gap. Group checks only
where their scope and evidence genuinely coincide. A suite's aggregate count
does not prove that each requirement was exercised. Reused results cite their
original checked revision and why they still apply; they are not new runs.

<a id="read-gaps-and-exclusions"></a>

## Gaps and Exclusions

| Scope | Missing or failed check | Reason / authority | Next action and responsible role |
|---|---|---|---|
| <scope> | <gap> | <reason; exact owner decision for a waiver> | <action and actor> |

<a id="read-review-and-next-action"></a>

## Review and Next Action

- Independent review: <exact immutable report or pending; self-review is not independent>
- Remaining obligations: <including deployed checks not performed locally>
- Permitted next action: <recorded authority; no inferred transition>

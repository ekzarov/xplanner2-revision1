# Bootstrap Gate Report

**What was actually checked, what failed, and is the workspace ready for Stage 1?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **What exactly was executed, and why is Bootstrap green?**
- **Created by:** The initializer creates a pending report; the Bootstrap agent fills it from actual audit output.
- **Maintained / decided by:** The Bootstrap agent records reruns and corrections; the human owner authorizes entry to Stage 1.
- **Governing instructions:** Bootstrap audit and transition procedure
- **When used:** The active Bootstrap agent fills this fixed report with exact commands, runtime versions, outcomes and corrections. Summary counts must match the evidence rows. Record failures immediately in status with the report in blockers[].evidence; do not wait for correction approval. A real authorized transition later cites it as gate_evidence.
- **How used:** The detailed project-specific evidence record for the Bootstrap readiness gate. It records the exact audit commands, runtime versions, results, failures and corrections that justify the gate outcome. migration_status.yaml remains the state authority and references this report rather than duplicating its command-level proof.
- **Example:** XPlanner recorded the Node and PowerShell versions, every Bootstrap command and result, and the failed methodology-link check plus its correction before the owner-authorized transition to Stage 1.

**What was actually verified:**

- Exact revision, environment, roles and scoped checks
- Expected condition versus actual observation, with evidence
- Passed or matching checks, differences and unexecuted scope kept separate
- Outstanding IDs, responsible actor, retry condition and next gate

Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `pending` (not yet run); `pass` (this check succeeded); `fail` (this check failed); `blocked` (this check could not complete). A green audit report does not ratify the constitution or authorize Stage 1 for the owner. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** [`analysis/stages/bootstrap/bootstrap-gate-report.md`](../bootstrap/bootstrap-gate-report.md)
> The initializer creates one project report at this fixed path. The active
> Bootstrap agent completes that report; do not number, rename, or duplicate it.
> Derive the top summary and Verification Boundary totals from the actual
> Required Gate Evidence rows using the [governing counting rule](../../../MIGRATION.md#bootstrap-evidence-and-blockers).
> Replace count placeholders from observed rows, never an assumed fixed total.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Audit runs and owner authorization are not yet recorded.
>
> **Next:** The Bootstrap agent records executed checks; the owner separately authorizes Stage 1.
>
> **Details:** [Required Gate Evidence](#read-required-gate-evidence) / [Verification Boundary](#read-verification-boundary).

<details>
<summary><strong>Contents</strong></summary>

- [Project And Run](#read-project-and-run)
- [Purpose And Authority Boundary](#read-purpose-and-authority-boundary)
- [Runtime And Environment](#read-runtime-and-environment)
- [Required Gate Evidence](#read-required-gate-evidence)
- [Deviations And Remediation](#read-deviations-and-remediation)
- [Verification Boundary](#read-verification-boundary)
- [Final Assessment](#read-final-assessment)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-project-and-run"></a>

## Project And Run

- Project ID: `{{PROJECT_ID}}`
- Project name: `{{PROJECT_NAME}}`
- Project owner: `{{PROJECT_OWNER}}`
- Initialized at: `{{INITIALIZED_AT}}`
- Recorded by: `<active Bootstrap agent identity>`
- Evidence captured at: `<ISO-8601 UTC>`
- Owner-approved Starter baseline: `<exact revision and durable owner decision>`
- Starter source revision actually used: `<resolved commit; matches approved baseline or blocker>`

<a id="read-purpose-and-authority-boundary"></a>

## Purpose And Authority Boundary

This report is the command-level evidence for the Bootstrap readiness gate. It
shows what the active Bootstrap agent executed, in which runtime, what passed or
failed, and how failures were corrected. It does not select the current stage.
[`analysis/migration_status.yaml`](../../migration_status.yaml) remains the state authority and must cite this
fixed report through blocker evidence while blocked and through `gate_evidence`
at the real authorized transition, as governed by
[Bootstrap Evidence And Blockers](../../../MIGRATION.md#bootstrap-evidence-and-blockers).
Do not invent a successful transition to attach this report.

<a id="read-runtime-and-environment"></a>

## Runtime And Environment

| Item | Exact value | Evidence command or source |
|---|---|---|
| Operating system | `<value>` | `<command or source>` |
| PowerShell | `<version>` | `pwsh --version` |
| Node.js | `<version>` | `node --version` |
| npm | `<version>` | `npm --version` |
| Working repository | `<absolute path>` | `<command or source>` |
| Audited revision | `<commit SHA>` | `git rev-parse HEAD` |
| Remote environment state | `<unconfigured or configured; selected ID if configured>` | [`config/environments.yaml`](../../../config/environments.yaml) and environment audit output |

An unconfigured environment can pass Bootstrap structural validation. It does
not prove remote readiness or authorize access. Before the first remote action,
configure owner-approved access and pass `audit:environment -- --require-configured`.
Record credential approval only when the owner actually gave it; initialization
does not supply a key or renew an existing exception.

<a id="read-required-gate-evidence"></a>

## Required Gate Evidence

The Bootstrap agent replaces a pending result with `pass`, `fail`, or `blocked`
only after the recorded attempt. It links the concise durable output, including
exit code and observed result; a command name alone is not evidence. The expected
condition is successful completion of every required check and its own asserted
contract. A not-run check stays pending. A failed or blocked row
keeps Bootstrap open until it is rerun successfully or governed otherwise.

| Check | Exact command | Result | Durable output or note |
|---|---|---|---|
| Install audit dependencies | `npm ci --prefix analysis/tools --ignore-scripts` | `pending` | `<result>` |
| Audit-toolkit regression tests | `npm --prefix analysis/tools test` | `pending` | `<result>` |
| Initializer self-test | `pwsh -NoProfile -File "<approved-starter>/tests/init-migration.Tests.ps1"` | `pending` | `<approved baseline match, actual source revision, resolved path, temporary root and result>` |
| Status audit | `npm --prefix analysis/tools run audit:status` | `pending` | `<result>` |
| Project audit | `npm --prefix analysis/tools run audit:project` | `pending` | `<result>` |
| Environment audit | `npm --prefix analysis/tools run audit:environment` | `pending` | `<result>` |
| Methodology audit | `npm --prefix analysis/tools run audit:methodology` | `pending` | `<result>` |
| Error-prevention table audit | `npm --prefix analysis/tools run audit:prevention` | `pending` | `<result>` |
| Process-view audit | `npm --prefix analysis/tools run audit:views` | `pending` | `<result>` |
| Artifact responsibility audit | `npm --prefix analysis/tools run audit:responsibilities` | `pending` | `<result>` |
| Artifact links audit | `npm --prefix analysis/tools run audit:artifact-links` | `pending` | `<result>` |

<a id="read-deviations-and-remediation"></a>

## Deviations And Remediation

Record every failed or blocked attempt, including a link to the changed file or
commit that corrected it. Write `None` only when every required command passed
on its first recorded run.
For link corrections or an approved Starter synchronization, include the exact
owner authorization, affected files and baseline revisions required by
[the governing procedure](../../../MIGRATION.md#bootstrap-evidence-and-blockers)
and [Bootstrap Maintenance](../../../MIGRATION.md#bootstrap-maintenance).

| Check | Failure or blocker | Correction | Rerun evidence | Final result |
|---|---|---|---|---|
| `<check or None>` | `<observed failure>` | `<change made>` | `<command/output/link>` | `<pass/fail/blocked>` |

<a id="read-verification-boundary"></a>

## Verification Boundary

- Required check rows: <count>; pass: <count>; fail: <count>; blocked: <count>;
  pending/not run: <count>. Derived from the actual Required Gate Evidence rows;
  the four outcomes sum to those rows and exactly match the top summary.
- Corrected failures: <check IDs and original-to-rerun evidence or none>.
- Remaining unavailable or unexecuted checks: <check IDs, reason, responsible
  actor and retry condition or none>.
- Actual scope proved: <starter/workspace readiness checks, not legacy behavior>.

The agent records every earlier failure in Deviations And Remediation. A later
pass supplies new evidence without erasing the failed attempt. Successful audit
execution is separate from the human owner's transition authorization.

<a id="read-final-assessment"></a>

## Final Assessment

- Overall Bootstrap audit result: `pending`
- Unresolved failures or blockers: `<list or None>`
- Report path recorded in [`analysis/migration_status.yaml`](../../migration_status.yaml): `<blockers[].evidence while blocked; gate_evidence at real transition; or not yet referenced>`
- Owner-authorized `bootstrap -> stage-01` transition recorded: `no`
- Assessed by: `<active Bootstrap agent identity>`
- Assessed at: `<ISO-8601 UTC>`

An audit pass is not Bootstrap closure or owner approval. Assess the actual rows
and separate transition authority under
[the governing procedure](../../../MIGRATION.md#bootstrap-in-practice); no pass is
inferred from formatting, a planned rerun or another check's result.

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

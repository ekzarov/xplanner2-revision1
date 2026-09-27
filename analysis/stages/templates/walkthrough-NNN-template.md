# Stage 3 Walkthrough - <scope>

**What behavior was observed live, what differed, and what could not be verified?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 3 agent records observations from exercising the legacy application with applicable roles.
- **Maintained / decided by:** The walkthrough agent records new evidence; the owner decides any required simulation or waiver.
- **Governing instructions:** Stage 3
- **When used:** Created while exercising the running legacy system with real roles. It records what was observed live and what remained inaccessible.
- **How used:** Evidence from running and walking through the legacy application as a real user. It identifies the environment and roles used, actions performed, observed results, map corrections and any behavior that could not be verified live.
- **Example:** The agent signs in as a project member, performs task editing and records that the observed permission state matches two parity rows.

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

> **Reading statuses:** `live-verified` (the declared scope was verified on live legacy); `partial-simulated` (some scope used authorized simulation); `blocked-waived` (an authorized exception covers unverified blocked scope, not a successful live check). [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/stages/stage-03/walkthrough-NNN.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Live observations, discrepancies and unverified scope are not yet recorded.
>
> **Next:** The Stage 3 agent records actual observations and keeps simulated or inaccessible scope separate.
>
> **Details:** [Executed Walkthrough](#read-executed-walkthrough) / [Walkthrough Outcome Summary](#read-walkthrough-outcome-summary) / [Findings](#read-findings).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Scope](#read-scope)
- [Environment and Preconditions](#read-environment-and-preconditions)
- [Executed Walkthrough](#read-executed-walkthrough)
- [Findings](#read-findings)
- [Commands and Results](#read-commands-and-results)
- [Residual Unverified Scope](#read-residual-unverified-scope)
- [Walkthrough Outcome Summary](#read-walkthrough-outcome-summary)
- [Gate Result](#read-gate-result)
  - [Return to Stage 1 (When the Map Is Wrong or Incomplete)](#read-return-to-stage-1-when-the-map-is-wrong-or-incomplete)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Date: YYYY-MM-DD
- Performed by: <person or agent>
- Legacy revision: <immutable reference>
- Environment: <runtime and location>
- Outcome: live-verified | partial-simulated | blocked-waived
- Status scope: `<exact migration_status.yaml legacy_walkthrough.scope>`
- Owner decision ID: `<null for live-verified or exact decision/waiver id>`

<a id="read-scope"></a>

## Scope

- Parity-map rows: <ranges or references>
- Channels: <web, desktop, terminal, API, messaging, batch, or other>
- Roles or actors: <list>
- Explicit exclusions: <none or exact scope>

<a id="read-environment-and-preconditions"></a>

## Environment and Preconditions

<Deployment steps, data set, configuration class, access prerequisites, and
known limitations. Do not record credentials.>

Follow [the PM access/deployment handoff](../../../config/REMOTE_SERVER.md#configure-before-remote-work).
The fallback decision in Metadata is separate from deployment/access permission.

- Access and operation authorization: <owner decision/reference, date, exact scope and validity; or missing>
- PM / deployment operator: <actual identities; bounded delegation reference if any>
- Baseline action: <deploy immutable legacy / verify existing baseline / blocked>
- Approved procedure and revision: <exact references; not the future application's deploy command>
- Environment and connection checks: <environment ID, configured audit and host-identity evidence>
- Application URLs and role accounts: <URLs and account/secret references only; no values>
- Data/actions and isolation: <permitted test data/actions; separate roots, ports, services and volumes>
- Deployment handoff: <actual sanitized output, timestamp, reachable baseline revision; no inferred behavior verification>
- Missing access / next action: <blocked scope, owner request and retry condition; or none>

<a id="read-executed-walkthrough"></a>

## Executed Walkthrough

The Stage 3 agent records one check per scoped behavior/role/channel. Expected
behavior cites the current map or source claim being challenged; an observed
difference can correct that claim, not automatically condemn the legacy system.

| Check ID / flow or row | Role/channel | Expected behavior and source | Action performed | Observation mode | Observed result | Evidence | Verdict / finding ID |
|---|---|---|---|---|---|---|---|
| C-NNN / <reference> | <role/channel> | <claim and source link> | <action> | live/simulated/not-run | <actual or not observed> | <durable link> | match/finding/blocked/not-checked; <ID or none> |

A simulated match is not live verification. The agent keeps live and simulated
results separate below; an unexecuted planned check remains not-checked.

<a id="read-findings"></a>

## Findings

| ID | Type | Evidence | Required update | Return stage |
|---|---|---|---|---|
| <id> | map gap/behavior difference/blocker | <reference> | <action> | 1 or 3 |

<a id="read-commands-and-results"></a>

## Commands and Results

| Command or procedure | Result | Evidence |
|---|---|---|
| <exact command or steps> | pass/fail/blocked | <output reference> |

<a id="read-residual-unverified-scope"></a>

## Residual Unverified Scope

<Exact behavior not observed and why. Use `None` only after complete coverage.>

For each blocked scope, record its stable id, summary, status, waiver id when
applicable, and durable evidence path exactly as represented under
`legacy_walkthrough.unresolved_blocked_scopes`.

When the outcome is `partial-simulated` or `blocked-waived`, attach the exact
owner decision. It must record rationale, residual risk, and
`permitted_next_stage: stage-04`. The Stage 3 to Stage 4 transition also carries
the owner's approval record. The waiver is then linked from the next
applicable clean independent control pass.

<a id="read-walkthrough-outcome-summary"></a>

## Walkthrough Outcome Summary

| Observation mode | Scoped checks | Match | Finding | Blocked | Not checked |
|---|---|---|---|---|---|
| Live | <count> | <count> | <count> | <count> | <count> |
| Simulated | <count> | <count> | <count> | <count> | <count> |
| Not run | <count> | 0 | 0 | <count> | <count> |

Each check appears once; each row total equals its four outcomes. Findings link
to check IDs. Exclusions and their authority are listed separately, not counted
as matches. Residual Unverified Scope includes simulated-only, blocked and
not-checked behaviors, with the next responsible actor and retry condition.

<a id="read-gate-result"></a>

## Gate Result

<a id="read-return-to-stage-1-when-the-map-is-wrong-or-incomplete"></a>

### Return to Stage 1 (When the Map Is Wrong or Incomplete)

The Stage 3 agent records the finding ID, expected map claim or missing row,
actual observation, exact revision/environment/role and linked runtime evidence.
It cites this walkthrough and those IDs in the status return to Stage 1; it does
not silently fix the map while remaining at Stage 3.

The Stage 1 agent follows the
[return and correction protocol](../../reviews/README.md#stage-1-re-entry),
checks source/configuration and the observation evidence, corrects the current
reconnaissance/map and links per-finding dispositions. The original observation
record remains evidence; correction and later verification are linked separately.
After Stage 1, a fresh Stage 2 pass is required before Stage 3 is re-entered.
Unavailable live evidence alone stays blocked/unverified under the walkthrough
rules; it is not automatically proof of a map defect.

<State what was proven, what remains unverified, which map changes were made,
and the exact next action.>

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

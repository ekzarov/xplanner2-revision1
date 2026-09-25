# Legacy Reconnaissance Record

**What did we discover in the legacy source, what is proven, and what remains unknown?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The initializer creates an empty record; the Stage 1 reconnaissance agent writes the findings.
- **Maintained / decided by:** The reconnaissance agent updates the inventory when discovery or an authorized return changes its scope.
- **Governing instructions:** Bootstrap and Stage 1
- **When used:** The primary agent fills it at Stage 1 while inspecting the legacy source and runtime boundary. Stages 2 and 3 use it to detect missed territory.
- **How used:** A structured inventory of the legacy territory: components, channels, technologies, entry points, data stores, integrations, runtime clues and inspection gaps. It explains what was examined and where evidence came from; detailed user behavior belongs in the parity map instead.
- **Example:** The record lists the login module, LDAP dependency, nightly job and the environment needed to run each one.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** Unknown or unverified (not established by source evidence) must stay separate from observed or confirmed scope. An inventory entry is not proof that the corresponding behavior was exercised live. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** [`analysis/legacy_reconnaissance.md`](./legacy_reconnaissance.md). Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Source coverage, evidence and gaps are not yet recorded.
>
> **Next:** The Stage 1 agent fills the source inventory, evidence and unresolved boundaries.
>
> **Details:** [Source Inventory](#read-source-inventory) / [Known Gaps And Blockers](#read-known-gaps-and-blockers).

<details>
<summary><strong>Contents</strong></summary>

- [Scope And Provenance](#read-scope-and-provenance)
- [Source Inventory](#read-source-inventory)
- [Runnable Surfaces](#read-runnable-surfaces)
- [Data And Integrations](#read-data-and-integrations)
- [Build, Run, And Test Evidence](#read-build-run-and-test-evidence)
- [Known Gaps And Blockers](#read-known-gaps-and-blockers)
- [Parity-Map Boundary](#read-parity-map-boundary)
- [Return Correction Evidence (Conditional)](#read-return-correction-evidence-conditional)
- [Stage 1 Exit Checklist](#read-stage-1-exit-checklist)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

> Project artifact: replace every placeholder before Stage 1 can be considered
> complete. Record observations and evidence; do not turn assumptions into
> requirements.

<a id="read-scope-and-provenance"></a>

## Scope And Provenance

- Project:
- Legacy source location:
- Upstream repository or delivery:
- Upstream revision, tag, or checksum:
- Snapshot date:
- Analyst:
- Explicit exclusions:

<a id="read-source-inventory"></a>

## Source Inventory

Describe the languages, frameworks, runtime descriptors, data definitions,
screens, APIs, jobs, messaging surfaces, reports, tests, build scripts, and
deployment assets found in the legacy source. Cite repository-relative paths.

| Area / component | Source evidence | What was established | Inspection boundary |
|---|---|---|---|
| <module, channel, job or descriptor> | <linked file and symbol> | <observed source fact> | <inspected / partial / not inspected, with reason> |

<a id="read-runnable-surfaces"></a>

## Runnable Surfaces

For every user, operator, batch, integration, and administration surface,
record:

- entry point;
- role or actor;
- how it is started;
- required runtime and external dependencies;
- whether it was observed live, simulated, inferred, or blocked;
- durable evidence reference.

| Surface / actor | Entry point and startup | Runtime / dependencies | Observation status | Evidence / limitation |
|---|---|---|---|---|
| <user, operator, job or integration> | <linked entry and command> | <required services> | <live / simulated / inferred / blocked> | <linked result or exact limitation> |

<a id="read-data-and-integrations"></a>

## Data And Integrations

Record databases, files, queues, APIs, identity providers, schedulers, external
programs, and operational dependencies. Distinguish source evidence from live
confirmation.

| Dependency | Purpose / calling component | Source evidence | Live confirmation | Unresolved boundary |
|---|---|---|---|---|
| <database, API, queue or provider> | <what depends on it> | <linked contract or call site> | <linked observation or not checked> | <unknowns, or none with evidence> |

<a id="read-build-run-and-test-evidence"></a>

## Build, Run, And Test Evidence

Record exact commands that were actually executed, their environment, result,
and evidence location. A plausible command that was not run is not evidence.

| Command actually run | Environment / revision | Observed result | Evidence | What this does not prove |
|---|---|---|---|---|
| <exact command, no secrets> | <runtime and immutable source> | <passed / failed / blocked + observation> | <linked log> | <unexecuted behavior or excluded scope> |

<a id="read-known-gaps-and-blockers"></a>

## Known Gaps And Blockers

List inaccessible runtimes, missing credentials, unavailable infrastructure,
unresolved source areas, partial evidence, and owner decisions still required.
Each blocker must have an owner or an explicit escalation path.

| Gap ID | Unknown / blocked scope | Why it matters | Next investigation / decision | Responsible actor | Status / evidence |
|---|---|---|---|---|---|
| GAP-001 | <specific missing evidence> | <affected surface or map rows> | <concrete next action> | <agent role or owner> | <open / resolved, with linked evidence> |

An empty table does not mean there are no gaps. The Stage 1 agent explicitly
records either the known gaps or the evidence supporting no known gaps in the
declared inspection boundary.

<a id="read-parity-map-boundary"></a>

## Parity-Map Boundary

Summarize which code and runtime surfaces are in scope for
`legacy_user_flows.xlsx`, which are excluded, and why. Confirm that the workbook
was derived from source evidence rather than documentation or prior agent
memory.

<a id="read-return-correction-evidence-conditional"></a>

## Return Correction Evidence (Conditional)

On return, the primary agent follows the
[Stage 1 re-entry procedure](reviews/README.md#stage-1-re-entry).
Record links to the exact triggering report and per-finding dispositions here
or in a linked Stage 1 correction record. Preserve valid discovery evidence;
review findings guide source checks, not an automatic restart or blind edits.
On first entry, record "not applicable: first entry" instead of inventing a review.

| Triggering report / finding ID | Source check and disposition | Changed section / map row | Check evidence / remaining work | Independent verification |
|---|---|---|---|---|
| <linked record or first entry> | <accepted / narrowed / rejected / blocked + evidence> | <links / stable row references> | <actual result, open work and responsible actor> | <pending or later report; not self-approved> |

<a id="read-stage-1-exit-checklist"></a>

## Stage 1 Exit Checklist

- [ ] Source provenance is pinned.
- [ ] Legacy surfaces and actors are inventoried.
- [ ] Runtime status is explicit for every surface.
- [ ] Data and integration dependencies are recorded.
- [ ] Evidence and uncertainty are distinguished.
- [ ] The parity workbook is populated and linked to concrete evidence.
- [ ] Known exclusions and blockers are visible.
- [ ] Required deterministic audits pass.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](error-prevention.md). Record actual checking, not a copied
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

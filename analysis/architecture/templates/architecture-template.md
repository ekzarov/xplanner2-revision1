# <project name> Target Architecture

**What does the target system look like as a whole right now?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **What does the target system look like as a whole right now?**
- **Created by:** The Stage 9 architecture agent authors the main target architecture from governed inputs.
- **Maintained / decided by:** The architecture agent updates the affected scope on authorized returns; the owner approves decisions at Stage 11.
- **Governing instructions:** Stage 9, with Stage 10-12 control and approval
- **When used:** Written at Stage 9 as the main target-system record and navigation point. SDD authors use it after owner approval to constrain implementation.
- **How used:** The main normative description of the target architecture and its navigation hub. It summarizes system boundaries, components, data and integration direction, deployment shape and important constraints, while linking to detailed sections and ADRs.
- **Example:** The record explains the modular monolith boundary and links readers to identity, data and deployment chapters plus their ADRs.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `draft` (agent proposal); `controlled` (a recorded control state, requiring its review reference); `owner-approved` (the owner approved the exact architecture scope/version). None proves that implementation is complete. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/architecture/architecture.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Architecture scope and approval are not yet established.
>
> **Next:** The Stage 9 agent records the architecture, approved boundaries and unresolved decisions.
>
> **Details:** [Architecture Decomposition](#read-architecture-decomposition) / [Open Architecture Backlog](#read-open-architecture-backlog).

<details>
<summary><strong>Contents</strong></summary>

- [Document Control](#read-document-control)
- [Living Architecture Contract](#read-living-architecture-contract)
- [Foundation Baseline](#read-foundation-baseline)
- [Foundation Code-Start Gate](#read-foundation-code-start-gate)
- [High-Level System Design](#read-high-level-system-design)
- [Architecture Decomposition](#read-architecture-decomposition)
- [Foundation Versus Evolutionary Decisions](#read-foundation-versus-evolutionary-decisions)
- [First Implementable Slices](#read-first-implementable-slices)
- [Open Architecture Backlog](#read-open-architecture-backlog)
- [ADR Index](#read-adr-index)
- [Traceability and Change Rule](#read-traceability-and-change-rule)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-document-control"></a>

## Document Control

- Status: <draft / controlled / owner-approved>
- Date: YYYY-MM-DD
- Scope: <foundation or affected slices>
- Document set version: <must match architecture-nfr-manifest.json>
- Decision register: analysis/architecture/architecture-nfr-decision-register.xlsx
- Collaborative diagram: analysis/architecture/architecture.drawio
- Normative manifest: analysis/architecture/architecture-nfr-manifest.json

This file is the main architecture ADR and navigation document. Detailed
architecture areas live under `analysis/architecture/sections/`; material
option decisions live under `adr/`. Delivery specifications consume this
architecture baseline; this document set never links back to them.

<a id="read-living-architecture-contract"></a>

## Living Architecture Contract

Describe the scoped return loop:

```text
approved architecture -> downstream delivery specification -> build/deploy -> runtime evidence
runtime evidence -> implementation correction | affected architecture area | parity map
```

Architecture is not completed once up front. After each accepted slice, compare
code, tests, and runtime evidence with the approved architecture and reopen only
affected decisions.

<a id="read-foundation-baseline"></a>

## Foundation Baseline

Summarize only the stable decisions required to create, test, migrate, deploy,
smoke, and roll back the first operational skeleton. Link the detailed
`sections/00-foundation.md` and applicable ADRs.

<a id="read-foundation-code-start-gate"></a>

## Foundation Code-Start Gate

- [ ] stable runtime, persistence, transaction, and deployment boundaries;
- [ ] executable engineering-quality baseline;
- [ ] governed-string policy naming its categories, analyzer/test, normal CI command,
      failing single-use contract fixture, and passing local-literal fixture;
- [ ] first skeleton and deployment boundaries;
- [ ] scoped independent architecture control;
- [ ] owner approval of the exact document set;
- [ ] downstream delivery control consumes the approved architecture hashes.

<a id="read-high-level-system-design"></a>

## High-Level System Design

Include the same system/process boundaries as the first Draw.io page. Keep
feature internals in drill-down sections.

<a id="read-architecture-decomposition"></a>

## Architecture Decomposition

| Layer or concern | Detailed record | First dependent slice |
|---|---|---|
| Foundation | `sections/00-foundation.md` | solution skeleton |
| System context and runtime | `sections/01-system-context-and-runtime.md` | solution skeleton |
| Application and modules | `sections/02-application-and-modules.md` | solution skeleton |
| Data and persistence | `sections/03-data-and-persistence.md` | deployment/data baseline |
| Identity and access | `sections/04-identity-and-access.md` | first protected feature |
| Integrations and background work | `sections/05-integrations-and-background-work.md` | first integration/job |
| Deployment and operations | `sections/06-deployment-and-operations.md` | demo deployment |
| UI, localization, and quality | `sections/07-ui-localization-and-quality.md` | first UI/localized slice |
| Delivery roadmap | `sections/08-delivery-roadmap.md` | every slice |

<a id="read-foundation-versus-evolutionary-decisions"></a>

## Foundation Versus Evolutionary Decisions

Classify decisions as Foundation, increment-enabling, feature design, or future
trigger. Only Foundation blocks the first code-start gate; an increment-enabling
decision blocks the first slice that depends on it.

<a id="read-first-implementable-slices"></a>

## First Implementable Slices

1. solution foundation;
2. demo deployment baseline;
3. first owner-selected thin vertical feature.

<a id="read-open-architecture-backlog"></a>

## Open Architecture Backlog

Name unresolved concerns, their owner, first dependent slice, and trigger. Do
not hide them and do not block unrelated Foundation work.

| Unresolved concern | Current limit / missing decision | Responsible actor | First dependent work | Closure trigger |
|---|---|---|---|---|
| <specific concern> | <what is not approved or known> | <agent role or owner> | <bounded increment> | <evidence / decision required before use> |

<a id="read-adr-index"></a>

## ADR Index

| ADR | Decision | Class | Status |
|---|---|---|---|
| <ADR> | <decision> | Foundation/increment/future | proposed/accepted/superseded |

<a id="read-traceability-and-change-rule"></a>

## Traceability and Change Rule

```text
owner decision/evidence -> NFR -> architecture area/ADR -> acceptance criterion

Downstream delivery records reference the relevant architecture, ADR, and NFR
identifiers. Architecture records never reference downstream delivery records.
```

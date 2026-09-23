# Implementation Plan: [FEATURE NAME]

**How will this slice be implemented and verified within the approved architecture?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 15 design agent writes the implementation plan from the feature specification and approved architecture.
- **Maintained / decided by:** The design agent updates the plan after review or an authorized source change.
- **Governing instructions:** Stage 15
- **When used:** Created after the spec to explain how the slice fits the approved architecture, data model, interfaces, tests and rollout constraints.
- **How used:** The technical implementation plan for the approved slice. It translates requirements and architecture constraints into component, data, interface, testing and rollout decisions while keeping work inside the agreed scope.
- **Example:** The plan assigns time-entry validation to the application layer and cites the accepted identity and persistence ADRs.

**Verification links:** The Stage 15 agent maps each requirement and applicable NFR to planned checks and links this SDD in Slice Verification Index. Stage 16 checks coverage; Stage 17 records concrete tests/procedures, expected and observed results, exact version and evidence separately from the plan. Follow [the verification-link contract](../../specs/traceability-guide.md); missing results are explicit, never passed by inference.

**Conditional cosmetic backlog check:**

- Stage 15: If a cosmetic backlog exists, the design agent compares every open finding with the slice screens, components and functions, not only its assigned slice. Matching finding IDs become linked tasks in tasks.md; the agent updates the same backlog with scope matches and reasons for exclusions. Missing referenced backlog or unmapped scope blocks planning.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** Planned verification (a check to perform later) is not executed evidence. Any readiness or approval label must name the exact scope, outstanding prerequisites and deciding authority. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `specs/NNN-SLUG/plan.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> A plan is not executed work or permission to implement.
>
> **Next:** The design agent links implementation choices, risks and planned checks to approved inputs.
>
> **Details:** [Design](#read-design) / [Verification Strategy](#read-verification-strategy) / [Summary](#read-summary).

<details>
<summary><strong>Contents</strong></summary>

- [Summary](#read-summary)
- [Technical Context](#read-technical-context)
- [Constitution Check](#read-constitution-check)
- [Owner-Reviewed Assumption Binding](#read-owner-reviewed-assumption-binding)
- [Approved Baseline Alignment](#read-approved-baseline-alignment)
- [Impact-Scoped Verification Plan](#read-impact-scoped-verification-plan)
  - [Architecture](#read-architecture)
  - [Prototype](#read-prototype)
  - [Parity and Owner Decisions](#read-parity-and-owner-decisions)
- [Design](#read-design)
  - [Components and Boundaries](#read-components-and-boundaries)
  - [Data Model and Changes](#read-data-model-and-changes)
  - [Interfaces and Contracts](#read-interfaces-and-contracts)
  - [Security and Failure Behavior](#read-security-and-failure-behavior)
- [Project Structure](#read-project-structure)
- [Verification Strategy](#read-verification-strategy)
- [Delivery and Recovery](#read-delivery-and-recovery)
- [Complexity and Risks](#read-complexity-and-risks)
- [Post-Design Constitution Re-check](#read-post-design-constitution-re-check)
- [Feature Dependency Contract](#read-feature-dependency-contract)

</details>
<!-- ARTIFACT_READING_END -->

**Feature ID**: `[NNN-feature-slug]`
**Date**: [YYYY-MM-DD]
**Spec**: `specs/[NNN-feature-slug]/spec.md`
**Delivery Slice**: [identifier]
**Architecture Set**: [document-set version]
**Knowledge Set**: [knowledge-set version]
**Prototype Set**: [export-set version or not applicable]

<a id="read-summary"></a>

## Summary

[Summarize the capability, user value, and technical approach. State the
smallest independently deliverable slice.]

<a id="read-technical-context"></a>

## Technical Context

| Concern | Selected approach | Source |
|---|---|---|
| Language and version | [value] | [approved ADR/constraint] |
| Primary dependencies | [value] | [approved ADR] |
| Storage and data change | [value or not applicable] | [approved ADR] |
| Target platform | [value] | [approved architecture] |
| Test tooling | [value] | [constitution/ADR] |
| Deployment target | [value] | [approved architecture] |
| Performance or scale | [measurable values] | [NFR ids] |
| Security and privacy | [controls] | [NFR/ADR ids] |
| Operational constraints | [values] | [NFR/ADR ids] |

Unknown architecture choices return to Stage 9. The plan does not establish a
new architecture baseline.

<a id="read-constitution-check"></a>

## Constitution Check

Complete before detailed design and re-check after contracts and data design.

- [ ] Legacy evidence remains attributable and unchanged.
- [ ] Scope is a small delivery slice, not an unreviewed full backlog.
- [ ] Parity-map, SDD, implementation, and test updates are planned together.
- [ ] Applicable owner and independent-agent gates remain explicit.
- [ ] Data changes are versioned or explicitly invoked; normal startup does
      not create, migrate, seed, repair, or mutate persistent data.
- [ ] Security improves on unsafe legacy behavior and secrets stay outside the
      repository.
- [ ] Automated verification covers behavior at the lowest useful level.
- [ ] Stable runtime identifiers and configuration values follow the governed
      string-ownership policy and executable gate; UI prose follows localization.
      A local one-use non-contract implementation literal may remain inline.
- [ ] Every shipped surface has a useful action or observable contract.
- [ ] Applicable NFR acceptance criteria have planned evidence.
- [ ] Deployment, rollback or recovery, live revision, and acceptance are
      included in the slice.

Record any failed item as a blocker and return to the governing earlier stage.

<a id="read-owner-reviewed-assumption-binding"></a>

## Owner-Reviewed Assumption Binding

List the `ASM-NNN` decisions from `spec.md` that shape this plan. The plan may
not introduce an implementation assumption absent from the owner-reviewed
table. If planning exposes a new assumption, return to `spec.md` and repeat the
owner review before Stage 16 can close.

When the approved spec outcome is `no-assumptions`, replace the table with the
exact line `- No implementation assumptions apply.`

| Assumption ID | Plan consequence |
|---|---|
| ASM-001 | [component, contract, data, UI, security, operational, or test consequence] |

<a id="read-approved-baseline-alignment"></a>

## Approved Baseline Alignment

<a id="read-impact-scoped-verification-plan"></a>

## Impact-Scoped Verification Plan

Bind this plan to the exact verification mode approved in `spec.md`. The test
list follows dependencies, not repository size. Discovery of an undeclared
shared dependency returns to the spec before implementation continues.

- **Verification mode**: [delta | expanded | full; exactly as in spec.md]
- **Selected checks**: [commands and exact affected scope]
- **Excluded checks**: [scope and evidence of non-impact]
- **Expansion conditions**: [shared/unknown changes that require expanded or full control]

<a id="read-architecture"></a>

### Architecture

The Stage 15 agent reads the approved NFR manifest without modifying it.
Record source version/hash, criterion, owning requirement/task and planned test
in downstream [specs/traceability.md](../../specs/traceability.template.md) and the slice plan. Stage 17 adds executed evidence
there; architecture changes require Stage 9 and renewed Stages 10-12 approval.

| ADR or NFR | Plan impact | Requirement/task owner | Evidence |
|---|---|---|---|
| [id] | [constraint or decision] | [FR/task] | [test or measurement] |

<a id="read-prototype"></a>

### Prototype

| Screen/state | Requirement | Planned component or surface | Verification |
|---|---|---|---|
| [id/state] | [FR id] | [path/surface id] | [test or visual check] |

<a id="read-parity-and-owner-decisions"></a>

### Parity and Owner Decisions

| Rows or decision | Planned behavior | Spec requirements | Notes |
|---|---|---|---|
| [reference] | [behavior] | [FR ids] | [difference or constraint] |

<a id="read-design"></a>

## Design

<a id="read-components-and-boundaries"></a>

### Components and Boundaries

[Describe components, responsibilities, and dependency direction. Reference
ADRs for every material decision.]

<a id="read-data-model-and-changes"></a>

### Data Model and Changes

[Describe entities, ownership, schemas, migrations, validation, consistency,
retention, rollback, and explicit operator commands. Use not applicable when
the slice has no data impact.]

<a id="read-interfaces-and-contracts"></a>

### Interfaces and Contracts

[Describe APIs, messages, commands, jobs, UI boundaries, error contracts, and
compatibility.]

<a id="read-security-and-failure-behavior"></a>

### Security and Failure Behavior

[Describe authentication, authorization, validation, secret handling, audit,
failure modes, retries, idempotency, recovery, and safe diagnostics.]

<a id="read-project-structure"></a>

## Project Structure

Replace this placeholder with real repository-relative paths.

```text
specs/[NNN-feature-slug]/
|-- spec.md
|-- plan.md
|-- tasks.md
|-- research.md          # when needed
|-- data-model.md        # when needed
|-- quickstart.md        # when needed
`-- contracts/           # when needed

[source paths]
[test paths]
[deployment paths]
```

**Structure decision**: [Explain how this layout follows the repository and
approved architecture.]

<a id="read-verification-strategy"></a>

## Verification Strategy

| Level | Behavior or boundary | Tool/command | Evidence destination |
|---|---|---|---|
| Unit | [pure behavior] | [command] | [path] |
| Integration/contract | [boundary] | [command] | [path] |
| UI/end-to-end | [critical journey] | [command] | [path] |
| NFR measurement | [criterion] | [command] | [path] |
| Deployment smoke | [useful action] | [procedure] | [Stage 18 record] |
| Live revision | [side-by-side scope] | [procedure] | [Stage 18 record] |

Unavailable required tooling or environments are blockers, not passing checks.

<a id="read-delivery-and-recovery"></a>

## Delivery and Recovery

- Deployment command: [single command]
- Data change command: [explicit command or not applicable]
- Smoke scope: [changed surfaces and meaningful actions]
- Rollback or recovery: [procedure]
- Legacy coexistence: [how side-by-side comparison remains available]

<a id="read-complexity-and-risks"></a>

## Complexity and Risks

| Item | Why needed | Simpler option considered | Mitigation |
|---|---|---|---|
| [complexity/risk] | [reason] | [alternative] | [mitigation] |

<a id="read-post-design-constitution-re-check"></a>

## Post-Design Constitution Re-check

- [ ] Contracts, data design, and source layout still satisfy every check.
- [ ] No new ADR or prototype change is hidden in this plan.
- [ ] Traceability is ready for `tasks.md` and `specs/traceability.md`.

<a id="read-feature-dependency-contract"></a>

## Feature Dependency Contract

Read the SDD-bound node in analysis/feature-dependencies.json. Plan provider contracts before their consumers, name integration/regression checks justified by incoming and outgoing links, and preserve parallel work where only a contract is required. Unknowns return to Stage 15/9.

See [the normative dependency procedure](../../analysis/feature-dependencies-guide.md).

# Feature Specification: [FEATURE NAME]

**What behavior must this slice deliver, and which assumptions still need the owner decision?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 15 design agent authors the feature specification from parity, prototype, architecture and verified knowledge.
- **Maintained / decided by:** The design agent revises requirements after findings; the human owner decides disclosed assumptions and scope at Stage 16.
- **Governing instructions:** Stage 15 and Stage 16 owner assumption review
- **When used:** Stage 15 writes one spec for a bounded slice. It defines behavior, acceptance criteria, edge cases and approved assumptions without prescribing code.
- **How used:** The requirements contract for one bounded implementation slice. It states user scenarios, functional requirements, acceptance criteria, edge cases and governed source links without prescribing code-level implementation.
- **Example:** The task-time spec requires decimal durations, a description and role-based access, each linked to its parity rows and NFRs.

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

> **Reading statuses:** `Draft` (a proposal awaiting review); `assumptions-recorded` (assumptions were documented, not necessarily owner-approved); `approved` (only the explicitly approved specification scope/version). Code, deployment and acceptance remain separate. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `specs/NNN-SLUG/spec.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Requirements, assumptions and implementation permission have not yet been established.
>
> **Next:** The design agent records testable requirements and discloses assumptions for owner review.
>
> **Details:** [Requirements](#read-requirements) / [Owner-Reviewed Implementation Assumptions](#read-owner-reviewed-implementation-assumptions).

<details>
<summary><strong>Contents</strong></summary>

- [Governed Inputs](#read-governed-inputs)
- [Scope](#read-scope)
  - [Included](#read-included)
  - [Excluded](#read-excluded)
  - [Dependencies](#read-dependencies)
- [User Scenarios and Testing](#read-user-scenarios-and-testing)
  - [User Story 1 - \[Brief Title\] (Priority: P1)](#read-user-story-1-brief-title-priority-p1)
  - [User Story 2 - \[Brief Title\] (Priority: P2)](#read-user-story-2-brief-title-priority-p2)
  - [Edge Cases](#read-edge-cases)
- [Requirements](#read-requirements)
  - [Functional Requirements](#read-functional-requirements)
  - [Surface Requirements](#read-surface-requirements)
  - [Used UI Control Inventory](#read-used-ui-control-inventory)
  - [Navigation Availability](#read-navigation-availability)
  - [Data and Domain Rules](#read-data-and-domain-rules)
  - [Non-Functional Requirements](#read-non-functional-requirements)
  - [Localization Impact](#read-localization-impact)
- [Exceptions and Deferred Scope](#read-exceptions-and-deferred-scope)
- [Success Criteria](#read-success-criteria)
- [Change Impact and Verification Scope](#read-change-impact-and-verification-scope)
- [Owner-Reviewed Implementation Assumptions](#read-owner-reviewed-implementation-assumptions)
- [Open Questions](#read-open-questions)
- [Traceability Checklist](#read-traceability-checklist)

</details>
<!-- ARTIFACT_READING_END -->

**Feature ID**: `[NNN-feature-slug]`
**Created**: [YYYY-MM-DD]
**Status**: Draft
**Input**: [Owner request, parity-map rows, and Stage 4 decisions]
**Delivery Slice**: [Slice identifier and boundaries]

<a id="read-governed-inputs"></a>

## Governed Inputs

| Input | Approved reference | Scope used |
|---|---|---|
| Parity map | [`analysis/legacy_user_flows.xlsx`](../../analysis/legacy_user_flows.xlsx) revision [REVISION] | [rows] |
| Requirements decisions | `analysis/stages/stage-04/[FILE]` | [decision ids] |
| Prototype baseline | export set [VERSION], approval [PATH] | [screens or not applicable] |
| Architecture baseline | document set [VERSION], verdict [PATH] | [ADR and NFR ids] |
| Knowledge baseline | knowledge set [VERSION], Stage 14 pass [PATH] | [OKF concept ids] |

Do not invent legacy behavior from narrative documentation. Every ported
behavior cites parity-map evidence; every target-only behavior cites an
explicit owner-approved target requirement.

<a id="read-scope"></a>

## Scope

<a id="read-included"></a>

### Included

- [Capability, flow, role, or target-only requirement]

<a id="read-excluded"></a>

### Excluded

- [Explicitly excluded item and governed reason]

<a id="read-dependencies"></a>

### Dependencies

- [Other feature, system, data, environment, or owner decision]

<a id="read-user-scenarios-and-testing"></a>

## User Scenarios and Testing

Order stories by value and delivery priority. Each story must be independently
testable and must complete a useful action or observable contract.

<a id="read-user-story-1-brief-title-priority-p1"></a>

### User Story 1 - [Brief Title] (Priority: P1)

[Describe the user or integration journey in plain language.]

**Why this priority**: [Value and ordering rationale.]

**Independent test**: [Exact behavior that proves this story independently.]

**Traceability**:

- Parity-map rows or target requirement: [references]
- Target knowledge: [OKF concept ids]
- Prototype screens/states: [screen ids or not applicable]
- Target surfaces: [planned inventory ids]
- Architecture: [ADR ids and NFR ids]

**Acceptance scenarios**:

1. **Given** [initial state], **When** [action], **Then** [observable result].
2. **Given** [failure or boundary state], **When** [action], **Then**
   [observable safe result].

<a id="read-user-story-2-brief-title-priority-p2"></a>

### User Story 2 - [Brief Title] (Priority: P2)

[Repeat the complete story structure as needed.]

<a id="read-edge-cases"></a>

### Edge Cases

- [Boundary, invalid state, concurrency, recovery, or authorization case]

<a id="read-requirements"></a>

## Requirements

<a id="read-functional-requirements"></a>

### Functional Requirements

- **FR-001**: The system MUST [specific, testable behavior].
- **FR-002**: The system MUST [specific failure or validation behavior].

Each requirement is atomic, unambiguous, testable, and traceable to a parity
row, approved decision, or target-only requirement.

<a id="read-surface-requirements"></a>

### Surface Requirements

| Surface ID | Roles or actors | Useful action or contract | States | Requirements |
|---|---|---|---|---|
| [stable-id] | [roles] | [meaningful behavior] | [states] | [FR ids] |

<a id="read-used-ui-control-inventory"></a>

### Used UI Control Inventory

For a version-4 prototype, `Governed variant` is the exact stable ID in the
pinned `ui-design-system.md`, also declared by that screen in screen-manifest.json.
Read `ui-design-tokens.json`; reference its names in the visual contract instead
of inventing or duplicating values. Plan shared component/theme work before its
consumers. Missing approved variants return to Stage 6 (foundation changes to 5)
and repeat 7-8; SDD cannot extend the approved kit. An unchanged historically
pinned version-3 set retains its existing element contracts, not invented kit coverage.

Complete this table for every UI-affecting slice. List every control actually
rendered by the slice; use `Not applicable` with a governed reason for a non-UI
slice. A generic statement such as "buttons match the design" is not evidence.

| Screen | Control | Governed variant | Approved source element | Exact visual and icon contract | Applicable states | Automated evidence |
|---|---|---|---|---|---|---|
| [screen-id] | [label or stable selector] | [primary-action/input/etc.] | [pinned export element] | [font/icon/geometry/palette] | [default/hover/focus/disabled/etc.] | [test and assertion] |

<a id="read-navigation-availability"></a>

### Navigation Availability

Complete this table when the slice renders or changes role-aware navigation.
Use `absent` for missing permission and `disabled` only for an authorized role
missing context or an explicitly deferred implementation. Direct-route behavior
is a separate security assertion.

| Destination | Role or capability | Required context | Rendered state | Direct-route outcome | Evidence |
|---|---|---|---|---|---|
| [destination] | [role/capability] | [context or none] | [absent/disabled/link] | [allowed/forbidden/not-found] | [unit/browser/API assertion] |

<a id="read-data-and-domain-rules"></a>

### Data and Domain Rules

| Rule or entity | Definition | Source | Verification |
|---|---|---|---|
| [item] | [meaning and invariants] | [row/decision/ADR] | [scenario or test] |

<a id="read-non-functional-requirements"></a>

### Non-Functional Requirements

Do not create architecture decisions here. Reference the approved baseline.

| NFR | Applicable criterion | Owning requirement | Planned evidence |
|---|---|---|---|
| [NFR-id] | [measurable criterion] | [FR-id] | [test or measurement] |

<a id="read-localization-impact"></a>

### Localization Impact

Complete this section for every UI-affecting feature. Copy the approved architecture
contract; do not choose languages inside the feature.

- Supported locales: [exact locale codes and count, or not applicable with reason]
- Default and fallback locale: [values from approved ADR]
- New or changed message keys: [catalog keys]
- Locale-sensitive values: [dates, times, numbers, durations, validation arguments]
- Required evidence: [catalog parity, locale switch, fallback, Russian/long-text or
  pseudo-localized layout checks, affected E2E scenarios]
- Prototype impact: [none; representative state check; or return to Stage 6]

<a id="read-exceptions-and-deferred-scope"></a>

## Exceptions and Deferred Scope

| Item | Reason | Owner decision | Re-entry condition |
|---|---|---|---|
| [item or none] | [reason] | [reference] | [condition] |

<a id="read-success-criteria"></a>

## Success Criteria

Define measurable, technology-neutral outcomes.

- **SC-001**: [Observable success metric.]
- **SC-002**: [Reliability, performance, security, or operational outcome.]

<a id="read-change-impact-and-verification-scope"></a>

## Change Impact and Verification Scope

- Completion dependencies: graph
- Dependency scope SHA-256: <current node scope digest from the dependency audit>

The Stage 15 agent refines the canonical graph and binds this node digest; Stage 16 challenges missing providers, exact conditions and completion scope. Do not maintain another dependency list here. Candidate edges and unanswered questions block reviewed readiness. Regression scope may be wider than completion scope. Follow [the graph contract](../../analysis/feature-dependencies-guide.md).

Do not create a second global dependency catalogue. Derive this slice from the
parity map, approved architecture/knowledge, target-surface inventory, existing
contracts and code dependencies. `delta` is the default. Use `expanded` when a
shared subsystem changes and `full` only for a new baseline, unknown blast
radius, broad map/architecture change, scheduled checkpoint, or final
acceptance.

- **Verification mode**: delta
- **Baseline**: [last accepted slice/review and governed artifact revisions]
- **Trigger assessment**: none; [why no expansion trigger is active]
- **Selected checks**: [exact test suites, surfaces, roles, contracts and data paths]
- **Excluded checks**: [explicitly excluded scope and evidence that no dependency path exists]
- **Re-entry triggers**: [conditions that expand this scope before merge]

| Dimension | Direct change | Dependents / regression scope | Evidence |
|---|---|---|---|
| Parity map and decisions | [rows/decisions] | [dependent rows or none with reason] | [references] |
| Architecture and knowledge | [ADRs/concepts] | [affected layers or none with reason] | [references] |
| Backend and contracts | [components/APIs/messages] | [consumers/providers] | [references] |
| Data and background work | [schema/transactions/jobs] | [readers/workers/recovery] | [references] |
| Security and permissions | [auth/session/roles] | [roles/policies/surfaces] | [references] |
| UI and shared design system | [screens/controls/tokens] | [shared shell/components] | [references] |
| Deployment and operations | [runtime/config/observability] | [smoke/rollback/operations] | [references] |

<a id="read-owner-reviewed-implementation-assumptions"></a>

## Owner-Reviewed Implementation Assumptions

The agent writes every implementation-shaping assumption before coding and
shows this section to the owner. The owner either approves the proposal as
written or corrects it. Preserve both the original proposal and the final
decision so the implementation remains explainable.

- **Review status**: Pending
- **Reviewed by**: [owner identity after explicit review]
- **Review date**: [YYYY-MM-DD after explicit review]
- **Assumption outcome**: assumptions-recorded

| Assumption ID | Agent proposal | Basis and uncertainty | Implementation impact | Owner disposition | Final decision |
|---|---|---|---|---|---|
| ASM-001 | [what the agent proposes to assume] | [evidence, inference, and what remains unknown] | [behavior, data, API, UI, security, operations, or testing consequence] | [approved-as-proposed or corrected-by-owner] | [the exact rule implementation must follow] |

If the agent identifies no implementation assumptions, remove the table rows,
set `Assumption outcome` to `no-assumptions`, and still obtain the owner's
explicit review. `Pending`, blank cells, unresolved placeholders, or any other
disposition block Stage 16 and implementation.

<a id="read-open-questions"></a>

## Open Questions

- [Question, owner, and blocking impact]

No `[NEEDS CLARIFICATION]` marker or unresolved question may remain when the
specification enters Stage 16 review. An assumption that changes approved
architecture returns to Stage 9; one that changes the approved prototype
returns to Stage 6; one that corrects legacy parity returns to Stage 1; and a
knowledge gap returns to Stage 13.

<a id="read-traceability-checklist"></a>

## Traceability Checklist

- [ ] Every included parity-map row maps to one or more requirements.
- [ ] Every requirement maps to a parity row, owner decision, or approved
      target-only requirement.
- [ ] Every UI requirement maps to an approved screen and state.
- [ ] Every rendered UI control maps to an approved source element, one
      governed shared variant, applicable states and exact automated evidence.
- [ ] Every sibling UI route names the owner of its outer page inset and has a
      same-viewport coordinate check for shared breadcrumbs/navigation/headings.
- [ ] Every target surface has a useful action or observable contract.
- [ ] Every applicable ADR and NFR is referenced without contradiction.
- [ ] Every applicable OKF concept is named and agrees with its verified source.
- [ ] Every UI-affecting requirement inherits the approved locale list and owns
      translation, formatting, fallback, and text-expansion evidence.
- [ ] Every acceptance scenario is independently testable.
- [ ] Verification scope covers the slice and every evidenced dependent; all
      exclusions have a reason and an expansion trigger.

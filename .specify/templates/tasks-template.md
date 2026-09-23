---
description: "Dependency-ordered task template for one migration delivery slice"
---

# Tasks: [FEATURE NAME]

**Which tasks are finished, which are still open, and what blocks delivery or acceptance?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 15 design agent decomposes the specification and plan into ordered implementation tasks.
- **Maintained / decided by:** The Stage 17 implementation agent records execution and evidence; design changes return to the responsible design stage.
- **Governing instructions:** Stage 15 task generation and Stage 17 execution
- **When used:** Generated from the approved spec and plan as the ordered implementation checklist. Stage 17 closes tasks only with verifiable evidence.
- **How used:** The dependency-ordered checklist used to implement the slice. Each task is concrete and verifiable, links back to the plan or requirement it closes, and makes unfinished or blocked work visible before coding is declared complete.
- **Example:** Separate tasks add decimal parsing, persistence, browser coverage and documentation, with dependencies stated in execution order.

**Verification links:** The Stage 15 agent maps each requirement and applicable NFR to planned checks and links this SDD in Slice Verification Index. Stage 16 checks coverage; Stage 17 records concrete tests/procedures, expected and observed results, exact version and evidence separately from the plan. Follow [the verification-link contract](../../specs/traceability-guide.md); missing results are explicit, never passed by inference.

**Conditional cosmetic backlog check:**

- Stage 15: If a cosmetic backlog exists, the design agent compares every open finding with the slice screens, components and functions, not only its assigned slice. Matching finding IDs become linked tasks in tasks.md; the agent updates the same backlog with scope matches and reasons for exclusions. Missing referenced backlog or unmapped scope blocks planning.
- Stage 17: The implementation agent reads the conditional cosmetic backlog and rechecks the actual changed screens, components and functions. The agent fixes applicable findings, links tasks, commits and rendered evidence, and marks them ready for independent verification. Only recorded independent verification makes a finding verified closed. Scope changes return through the affected planning controls.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** An unchecked task (work remains) differs from a checked task (the required work and evidence are recorded). Closed implementation tasks do not automatically close delivery, independent review or owner acceptance. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `specs/NNN-SLUG/tasks.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No completed work or executed verification is established by this task template.
>
> **Next:** The responsible agent keeps implementation, verification and post-merge delivery tasks distinct.
>
> **Details:** [Phase 1 - Traceability and Preconditions](#read-phase-1-traceability-and-preconditions) / [Final Checklist](#read-final-checklist).

<details>
<summary><strong>Contents</strong></summary>

- [Task Format](#read-task-format)
- [Phase 1 - Traceability and Preconditions](#read-phase-1-traceability-and-preconditions)
- [Phase 2 - Foundational Work](#read-phase-2-foundational-work)
- [Phase 3 - User Story 1: \[TITLE\] (P1)](#read-phase-3-user-story-1-title-p1)
  - [Tests](#read-tests)
  - [Implementation](#read-implementation)
- [Phase 4 - Additional User Stories](#read-phase-4-additional-user-stories)
- [Phase 5 - NFR and Cross-Cutting Verification](#read-phase-5-nfr-and-cross-cutting-verification)
- [Phase 6 - Governed Artifact Synchronization](#read-phase-6-governed-artifact-synchronization)
- [Phase 7 - Stage 17 Candidate Review Gate](#read-phase-7-stage-17-candidate-review-gate)
- [Phase 8 - Post-Merge Delivery Reconciliation](#read-phase-8-post-merge-delivery-reconciliation)
- [Final Checklist](#read-final-checklist)
- [Feature Dependency Contract](#read-feature-dependency-contract)

</details>
<!-- ARTIFACT_READING_END -->

**Feature ID**: `[NNN-feature-slug]`
**Inputs**: `spec.md`, `plan.md`, approved prototype and architecture records,
verified target knowledge
**Traceability**: `specs/traceability.md`
**Delivery Rule**: Complete one approved slice through Stages 15-19 before
starting the next slice.

<a id="read-task-format"></a>

## Task Format

Use:

```text
- [ ] TNNN [P?] [USN] Description with exact repository-relative path
```

- `[P]` means the task can run in parallel because it changes different files
  and has no unfinished dependency.
- `[USN]` links implementation work to a user story from `spec.md`.
- Every task names exact paths, requirements, and dependencies when applicable.
- Tests and governed-document updates are first-class tasks, not cleanup.

Replace all examples with slice-specific work.

<a id="read-phase-1-traceability-and-preconditions"></a>

## Phase 1 - Traceability and Preconditions

- [ ] T001 Confirm the owner-reviewed implementation-assumption section is
      Approved, every ASM-NNN has a final decision, and the Stage 16 clean
      report plus owner SDD approval references are recorded
- [ ] T002 Map parity rows and Stage 4 decisions to all feature requirements in
      `specs/traceability.md`
- [ ] T003 Map applicable ADRs and NFR criteria to requirements and planned
      evidence in [specs/traceability.md](../../specs/traceability.template.md), citing
      the exact approved NFR manifest version/hash without modifying it
- [ ] T004 Map every applicable OKF concept to the consuming spec requirement
      and confirm the exact knowledge-manifest version
- [ ] T005 Add planned useful surfaces and role actions to
      `analysis/inventories/target-surface-inventory.json`
- [ ] T006 Confirm approved prototype screen/state coverage for UI work
- [ ] T007 Confirm the spec impact table and plan verification mode cover every
      direct dependency, selected check, justified exclusion, and expansion trigger

**Checkpoint**: Governed inputs are complete and implementation is authorized.

<a id="read-phase-2-foundational-work"></a>

## Phase 2 - Foundational Work

- [ ] T008 [P] [Describe shared contract, model, configuration, or test fixture]
- [ ] T009 [P] [Describe explicit data migration or operator command, if needed]
- [ ] T010 [Describe shared security, error, or integration boundary]
- [ ] T011 Add foundational unit and integration tests

**Checkpoint**: Story work can proceed without bypassing shared constraints.

<a id="read-phase-3-user-story-1-title-p1"></a>

## Phase 3 - User Story 1: [TITLE] (P1)

**Goal**: [Useful outcome]
**Independent test**: [Exact user or integration action and observable result]

<a id="read-tests"></a>

### Tests

- [ ] T012 [P] [US1] Add failing unit tests for [behavior] in [path]
- [ ] T013 [P] [US1] Add failing integration or contract tests in [path]
- [ ] T014 [P] [US1] Add failing UI/end-to-end test for surface [id] in [path]

<a id="read-implementation"></a>

### Implementation

- [ ] T015 [P] [US1] Implement [component or model] in [path]
- [ ] T016 [US1] Implement [service, operation, or workflow] in [path]
- [ ] T017 [US1] Implement [surface and states] in [path]
- [ ] T018 [US1] Add validation, authorization, failure, and recovery behavior
- [ ] T019 [US1] Complete test and surface-inventory evidence references

**Checkpoint**: User Story 1 works and is independently verifiable.

<a id="read-phase-4-additional-user-stories"></a>

## Phase 4 - Additional User Stories

Repeat the complete tests-first and implementation structure for each story.
Keep story phases independently testable.

<a id="read-phase-5-nfr-and-cross-cutting-verification"></a>

## Phase 5 - NFR and Cross-Cutting Verification

- [ ] TNNN [P] Run the selected delta/expanded/full verification scope and
      record every automatic expansion trigger encountered
- [ ] TNNN [P] Run or add the measurement for each applicable NFR criterion
- [ ] TNNN [P] Verify security, privacy, accessibility, and observability
- [ ] TNNN Verify error, retry, idempotency, concurrency, and recovery paths
- [ ] TNNN Record executed NFR test/measurement results and exact evidence in
      [specs/traceability.md](../../specs/traceability.template.md) and slice records;
      keep the approved architecture manifest unchanged

<a id="read-phase-6-governed-artifact-synchronization"></a>

## Phase 6 - Governed Artifact Synchronization

- [ ] TNNN Update `spec.md`, `plan.md`, and this task list to match delivery
- [ ] TNNN Update parity-map target evidence while preserving its honest
      pre-deployment status; do not turn delivered rows green at Stage 17
- [ ] TNNN Update `specs/traceability.md`
- [ ] TNNN Update `analysis/inventories/target-surface-inventory.json`
- [ ] TNNN Run all applicable workbook, specification, architecture,
      prototype, and target-surface audits

<a id="read-phase-7-stage-17-candidate-review-gate"></a>

## Phase 7 - Stage 17 Candidate Review Gate

- [ ] TNNN Verify that the implementation introduces no assumption absent from
      the owner-reviewed `spec.md` table and clean Stage 16 report
- [ ] TNNN Run the complete affected automated test suite
- [ ] TNNN Prepare the deterministic read-only slice peer-review packet
- [ ] TNNN Resolve accepted findings and rerun affected checks
- [ ] TNNN Record final review dispositions and exact results
- [ ] TNNN Present the reviewed candidate PR and exact revision for owner merge
      approval

<a id="read-phase-8-post-merge-delivery-reconciliation"></a>

## Phase 8 - Post-Merge Delivery Reconciliation

- [ ] TNNN Reconcile the parity workbook and migration status from the immutable
      delivery record for the exact merged revision
- [ ] TNNN Add final delivery evidence links to traceability and affected NFRs
      without changing runtime, build, deployment, requirements, or plans

Only these exact post-merge deployment/reconciliation tasks may remain open at
the Stage 17 candidate boundary. The live journey, Stage 18-19 reports and
acceptance verdict are separate governed records, not feature tasks.

<a id="read-final-checklist"></a>

## Final Checklist

- [ ] Every implementation and candidate-review task is complete; only the
      exact Phase 8 post-merge reconciliation tasks may remain open.
- [ ] Every requirement has implementation and automated evidence.
- [ ] Every applicable NFR has a recorded test or measurement result.
- [ ] Every shipped surface has a tested useful action.
- [ ] No visible placeholder or unexplained exposed deferred surface remains.
- [ ] Parity map, SDD, architecture manifest, inventory, and code agree.
- [ ] The reviewed candidate PR and exact revision are ready for the owner's
      merge decision; post-merge tasks are identified but no live-proof claim
      is recorded yet.

<a id="read-feature-dependency-contract"></a>

## Feature Dependency Contract

Use the SDD-bound dependency graph to order shared/provider tasks and dependent work. Do not infer inter-slice priority from numeric IDs or create another global dependency list. Contract-only links can permit parallel implementation; completion links remain delivery obligations.

See [the normative dependency procedure](../../analysis/feature-dependencies-guide.md).

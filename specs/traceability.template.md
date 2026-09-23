# Parity-Map-to-SDD Traceability

**Which requirements are covered by design, implementation and tests, and where are the gaps?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Which requirements are covered by design, implementation and tests, and where are the gaps?**
- **Created by:** The Stage 15 design agent creates links from behavior and approved sources to specifications and tests.
- **Maintained / decided by:** Agents in design, implementation and acceptance maintain their evidence links without changing source decisions implicitly.
- **Governing instructions:** Stage 15-19 traceability contract
- **When used:** Stage 15 links each slice to spec, plan, tasks and planned checks in Slice Verification Index; Stage 16 independently checks requirement-to-check coverage. Stages 17-19 link actual execution and deployed/acceptance records with checked versions, observations and gaps. audit:sdd validates the index file links and planned/missing/recorded states; completion mode requires recorded evidence links. recorded means observations exist, not passed. Independent reviewers inspect test outcomes and coverage; existing delivery gates still apply.
- **How used:** One shared index for the entire migration: which slice covers each behavior or approved target requirement, which design and prototype apply, and where implementation and verification evidence can be found. It grows with the number of slices; read the relevant slice instead of the whole file. It is not another specification or a standalone verdict that everything works.
- **Example:** For XPlanner 029, the delivery contract assigns rows 260-263; prototype coverage names iteration-accuracy and inherited screens; legacy coverage maps the rows to FR-2901 through FR-2915. Follow those references to the actual spec and evidence; the index alone does not certify the report.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** Covered in SDD (represented in the design) is not implemented or tested. Deferred (postponed under an explicit decision) is not complete; each status cites its scope and evidence. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `specs/traceability.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Coverage and executed verification have not yet been reconciled.
>
> **Next:** The active agent links requirements to actual design, code and evidence without treating plans as execution.
>
> **Details:** [Coverage Summary](#read-coverage-summary) / [Verification](#read-verification).

<details>
<summary><strong>Contents</strong></summary>

- [Document Control](#read-document-control)
- [Start With One Slice](#read-start-with-one-slice)
- [Imported Legacy References](#read-imported-legacy-references)
- [Parity Map Delivery Contracts](#read-parity-map-delivery-contracts)
- [Slice Verification Index](#read-slice-verification-index)
- [Approved Prototype Coverage](#read-approved-prototype-coverage)
- [Legacy and Approved-Change Coverage](#read-legacy-and-approved-change-coverage)
- [Target-Only Requirements](#read-target-only-requirements)
- [NFR Evidence Ownership](#read-nfr-evidence-ownership)
- [Coverage Summary](#read-coverage-summary)
- [Verification](#read-verification)

</details>
<!-- ARTIFACT_READING_END -->

This is one shared index for the entire migration, not a new specification
for each feature. Start with one slice: find its delivery scope, design and
prototype links, then inspect the underlying evidence. A reference explains
where to look; it does not prove that implementation, tests or delivery passed.

<a id="read-document-control"></a>

## Document Control

- Project: <project name>
- Parity-map revision: <revision or digest>
- Architecture document set version: <approved version>
- Approved NFR manifest SHA-256: <exact approved hash>
- Knowledge set version: <verified version>
- Prototype export set version: <approved version or not applicable>
- Updated: YYYY-MM-DD

For an old screen-manifest upgrade only, the schema-migration agent preserves
raw references in `Imported Legacy References` as described below. This is not
a separate Stage 15 output and not established SDD or test evidence.

The Stage 15 agent creates `specs/traceability.md` from this template for the
first slice, or completes the index if a schema-migration agent has already
created its imported-reference section. Preserve those original values.
The agent maintains that same project-wide file for subsequent slices.
The agent fills only evidenced links or explicit gaps and keeps them aligned
with the governed parity map, SDD, approved architecture, prototype and target
inventory. Requirements and decisions remain in their authoritative sources.

<a id="read-start-with-one-slice"></a>

## Start With One Slice

1. **Scope:** find the feature in [Parity Map Delivery Contracts](#read-parity-map-delivery-contracts). Read intended delivery rows, explicit deferrals and the owner decision. Intended delivery is not recorded completion.
2. **Design:** inspect [Approved Prototype Coverage](#read-approved-prototype-coverage) and [Legacy and Approved-Change Coverage](#read-legacy-and-approved-change-coverage). New behavior without a legacy row belongs under [Target-Only Requirements](#read-target-only-requirements).
3. **Quality constraints:** follow [NFR Evidence Ownership](#read-nfr-evidence-ownership) to criteria, planned checks and actual evidence. Planned and executed checks are different.
4. **Remaining work:** read [Coverage Summary](#read-coverage-summary) and [Verification](#read-verification), then open the referenced spec, plan, tasks and exact test/delivery records.

The Stage 16 reviewer checks completeness and meaning; implementation,
delivery and acceptance agents update the relevant evidence at Stages 17-19.
`audit:sdd` reads requirement references and delivery contracts.
`audit:sdd:complete` and `audit:delivery` compare the contracts with the
relevant workbook and delivery evidence. None of these turns a link into a
fresh execution of the linked test.

The agent must preserve the machine-read section names and table columns.
Reading aids must not add fictional feature/requirement mappings to the
evidence tables. Unrelated slices are not rewritten to prepare a new slice.

<a id="read-imported-legacy-references"></a>

## Imported Legacy References

Conditional: omit this section when no old references need preservation.
The schema-migration agent records source commit/digest, export-set version,
workbook revision, physical row, original values, transfer date and producer.
Preserve the original identifiers in a fenced block, not a requirement table.

```json
{
  "source_revision_or_digest": "<immutable source>",
  "export_set_version": "<original version>",
  "workbook_revision": "<original workbook revision>",
  "transferred_on": "<date>",
  "producer": "<agent>",
  "original_rows": [{"row": "<physical row>", "requirement": "<original ID>", "tests": ["<original test name>"]}]
}
```

**Disposition:** unverified (not checked), matched (confirmed against the cited
source), stale (outdated reference), or missing (referenced item not found).
The Stage 15 agent
records requirement reconciliation and real SDD links; Stage 17 records test
reconciliation and actual execution-record links. Cite exact reviewed sources,
explain mismatches and preserve raw imports. Independent reviewers verify the
mapping; `audit:sdd` does not inspect this raw section. Only established
requirements enter the coverage tables. Follow the
[screen-manifest upgrade procedure](../analysis/prototyping/README.md#upgrading-old-screen-manifests).

<a id="read-parity-map-delivery-contracts"></a>

## Parity Map Delivery Contracts

This table is the machine-readable hand-off between SDD, implementation and the
parity workbook. Every numbered feature appears exactly once. At the Stage 17
candidate boundary, `Deliver rows` must have exact planned target evidence but
remain in an honest pre-deployment state. They turn green only after Stage 18
deploys and exercises the exact merged revision; `audit:sdd:complete` then
checks their closure. `Deferred rows` must carry an explicit deferred state and
evidence. Target-only features use no workbook rows and require an owner decision.

| Feature | Scope | Deliver rows | Deferred rows | Owner decision |
|---|---|---|---|---|
| `<NNN-feature>` | `legacy-backed` | `42,45-47` | `48` | `-` |
| `<NNN-target-only>` | `target-only` | `-` | `-` | `analysis/stages/<owner-decision>.md` |

<a id="read-slice-verification-index"></a>

## Slice Verification Index

The Stage 15 agent adds one row per numbered feature and links the actual SDD
and planned checks. Stages 17-19 add separate execution records, not test-plan
links in the evidence column. Use `planned` (no run claimed), `missing` (record
not linked) or `recorded` (observations linked, not necessarily passed).
Independent reviewers inspect requirement-to-check mappings and actual results.
See [stage duties and evidence rules](traceability-guide.md).

| Feature | SDD | Verification plan | Recorded evidence | Evidence state |
|---|---|---|---|---|
| `<NNN-feature>` | [spec](<NNN-feature>/spec.md), [plan](<NNN-feature>/plan.md), [tasks](<NNN-feature>/tasks.md) | [checks](<NNN-feature>/plan.md#testing) | - | planned |

The owner-decision reference above may cite multiple applicable decisions; it
is not restricted to one Stage 16 approval filename. This index never grants
scope or treats approval as a successful test.

<a id="read-approved-prototype-coverage"></a>

## Approved Prototype Coverage

| Feature | Approved screens |
|---|---|
| `<NNN-feature>` | `<screen-id, screen-id; or Non-UI slice>` |

<a id="read-legacy-and-approved-change-coverage"></a>

## Legacy and Approved-Change Coverage

A grouped row range is valid only when every row has the same target
requirement, decision, and disposition.

| Parity-map rows | Source evidence | Stage 4 decisions | Feature/spec requirements | OKF concepts | ADRs/NFRs | Prototype screens | Surface IDs | Disposition |
|---|---|---|---|---|---|---|---|---|
| <rows> | <references> | <decision ids> | <spec path and FR ids> | <concept ids> | <ids> | <screen ids> | <surface ids> | port/defer/do-not-port |

<a id="read-target-only-requirements"></a>

## Target-Only Requirements

Use this table for governed target behavior with no legacy parity-map row.
Do not attach target-only behavior to unrelated source evidence.

| Target requirement | Owner decision | Feature/spec requirements | OKF concepts | ADRs/NFRs | Prototype screens | Surface IDs |
|---|---|---|---|---|---|---|
| <requirement> | <reference> | <spec path and FR ids> | <concept ids> | <ids> | <screen ids or not applicable> | <ids> |

<a id="read-nfr-evidence-ownership"></a>

## NFR Evidence Ownership

The Stage 15 agent records NFR-to-requirement/task/test ownership here, citing
the approved architecture document-set version and manifest SHA-256. The
manifest is read-only; Stage 17 adds actual test/measurement results here,
and Stages 18-19 add delivered/acceptance evidence. An architecture change
returns to Stage 9 for correction and renewed Stages 10-12 approval.

| NFR | Acceptance criterion | SDD requirements/tasks | Planned test or measurement | Recorded evidence |
|---|---|---|---|---|
| <NFR-id> | <criterion> | <references> | <reference> | <filled during Stage 17-19> |

<a id="read-coverage-summary"></a>

## Coverage Summary

- In-scope parity-map rows: <count>
- Rows covered by SDD: <count>
- Rows explicitly deferred: <count>
- Rows decided do-not-port: <count>
- Target-only requirements: <count>
- Requirements without a source row or owner decision: <count; must be zero>
- Applicable NFRs without SDD ownership: <count; must be zero>
- Surfaces without a useful action: <count; must be zero>

<a id="read-verification"></a>

## Verification

| Check | Exact command or procedure | Result | Date |
|---|---|---|---|
| Bidirectional row-to-SDD coverage | <check> | pass/fail/blocked | YYYY-MM-DD |
| Architecture-to-SDD coverage | <check> | pass/fail/blocked | YYYY-MM-DD |
| Prototype-to-SDD coverage | <check> | pass/fail/blocked | YYYY-MM-DD |
| Surface-to-SDD coverage | <check> | pass/fail/blocked | YYYY-MM-DD |

# Open Knowledge Format Baseline

**Approved UI sources.** At Stages 13-14, read applicable catalogue/token sources through the approved prototype manifest and follow [the shared UI procedure](../prototyping/ui-design-system-guide.md). Knowledge references the approved rules; it must not create a competing dictionary of colors, fonts or component variants.

**Reading technical statuses.** `draft` (authored concepts, not an approved baseline) and `ready for control` (ready for independent Stage 14 review) do not mean that review passed. `passed` in an integrity result (file hashes match) can coexist with `blocked` at the knowledge gate (approval or coverage prerequisites remain). [Status meanings](../artifact-status-meanings.md).

New records follow [artifact result boundaries](../artifact-result-boundaries.md):
established results, open differences or decisions, unverified scope and next
action stay distinct. The record family determines what counts as evidence;
planned work, owner approval and independent verification are not interchangeable.

**What must the next agent know about the target system, and which sources support it?**

The bundle is a directory of linked concepts, not one document. Its companion manifest answers **which exact versions of the knowledge files and their sources belong to this package?** The Stage 13 execution record answers **what knowledge did the agent produce, from which exact sources, and what remains before independent control?**

The strict JSON manifest keeps its schema unchanged; its fields are explained here. `schema_version` and `okf_version` identify formats; `project` and `scope` identify the project and covered work; `knowledge_set_version` identifies the package; `architecture_document_set_version` identifies the source set; `generated_at` records generation time. `source_artifacts` uses repository-relative paths, source roles and SHA-256 hashes. `files` uses bundle-relative paths, roles, concept IDs where applicable, and SHA-256 hashes. A source version label or matching hash does not establish approval.

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>knowledge/bundle/**</summary>

**What must the next agent know about the target system, and which sources support it?**

A compact, agent-friendly Open Knowledge Format (OKF) v0.2 explanation of how the approved target system is arranged and operates. OKF is an open, vendor-neutral format published by Google Cloud: Markdown concepts with YAML frontmatter. Each concept keeps a stable id and links back to an authoritative source instead of inventing new design.

- **Created by:** The Stage 13 synthesis agent writes linked OKF concepts and their navigation indexes from the governed sources.
- **Maintained / decided by:** The synthesis agent updates affected concepts and provenance after source changes or Stage 14 findings.
- **Instructions:** Stage 13 and OKF template contract

**When used:** Stage 13 converts approved architecture into Google Cloud-published, vendor-neutral OKF v0.2: small Markdown concepts with YAML frontmatter that design agents can retrieve without rereading the entire package.

**Example:** A session-management concept states the approved rule, cites the identity chapter and lists the acceptance condition used by an SDD.

</details>
<details>
<summary>knowledge-manifest.json</summary>

**Which exact versions of the knowledge files and their sources belong to this package?**

The provenance index for the OKF v0.2 bundle. It lists every synthesized concept, its source document and SHA-256 hash, allowing audits to detect missing, duplicated, stale or unsupported knowledge before SDD work uses it.

- **Created by:** The Stage 13 agent runs hash generation and records the exact source and concept set in the manifest.
- **Maintained / decided by:** The synthesis agent regenerates the manifest after a source or concept changes; prior exact-set review then needs renewal.
- **Instructions:** Stage 13 provenance and Stage 14 exact-set review

**When used:** Created with the bundle and updated whenever a concept or source changes. The knowledge audit verifies completeness, provenance and hashes.

**Example:** The manifest binds the session concept to the exact architecture revision, so a later source edit makes the concept visibly stale.

</details>
<details>
<summary>stage-13/knowledge-record.md</summary>

**What knowledge did the agent produce, from which exact sources, and what remains before independent control?**

The execution record for the Google Cloud-published, vendor-neutral OKF v0.2 synthesis. It identifies the exact architecture source set, lists the concepts produced, documents limitations or exclusions and records whether the Stage 13 knowledge gate passed. **Produced coverage and handoff boundary:** Exact approved inputs and declared source/requirement scope; Source item mapped to the produced concept or SDD section; Represented / missing / contradictory / explicitly deferred or excluded; Remaining gaps, responsible actor and blocking prerequisites; Readiness for the next independent review, not its verdict. A file hash proves identity, not correctness. Planned tests are not executed tests, and authored coverage is not implemented behavior.

- **Created by:** The Stage 13 synthesis agent writes the execution and coverage record from the actual work and audit results.
- **Maintained / decided by:** The same responsible agent records corrections and limitations until that synthesis is handed to independent control.
- **Instructions:** Stage 13

**When used:** Written after synthesis to record the source set, generated concepts, exclusions and the result of the knowledge audit.

**Example:** XPlanner synthesis 001 records eight draft concepts, sixteen pinned sources, passing integrity checks and a blocked global gate because the current Stage 11 owner verdict is missing.

</details>
<details>
<summary>stage-14-pass-NNN.md</summary>



An independent comparison of the OKF v0.2 bundle with the approved architecture. It verifies concept coverage and source hashes, and reports omissions, duplicates, stale links or rules that were introduced without authority. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 14 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 14 independent control and reviewer eligibility

**When used:** At Stage 14, a fresh independent agent acting as the knowledge reviewer compares the bundle with the approved architecture and writes an immutable verdict before SDD begins. A knowledge defect returns to Stage 13, an architecture defect to Stage 9, a prototype defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer finds a concept that claims an unsupported retry limit and returns the bundle to Stage 13.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

This directory is the governed bridge between approved architecture and SDD.
It uses **Open Knowledge Format (OKF) v0.2**, an open, vendor-neutral format
published by Google Cloud: Markdown concepts with YAML frontmatter, normal
Markdown links, and progressive-disclosure `index.md` files.

## Purpose

The OKF bundle explains how the target system works before feature
specifications prescribe how to build it. It does not replace the parity map,
approved Draw.io architecture, ADRs, NFR manifest, or SDD. It connects them.

The project instantiates:

```text
analysis/knowledge/
  bundle/
    index.md
    capabilities/
    workflows/
    architecture/
    data/
    integrations/
    nfr/
    decisions/
  knowledge-manifest.json
```

Each concept has a stable project extension `id`, an OKF `type`, title,
description, lifecycle status, producer, and explicit sources. Sources point to
the parity workbook, approved architecture snapshot/ADR/NFR and exact Stage 11
owner verdict, approved
prototype, or durable owner decision that supports the concept. Normal Markdown
links connect related concepts.

## Stage Contract

- Stage 13 creates or updates the bundle from the exact approved architecture
  set and current parity map. It runs `npm --prefix analysis/tools run
  audit:knowledge`.
- Stage 14 gives the exact manifest hash to an eligible independent agent. The
  agent checks map, architecture, prototype and owner decisions against every
  concept. Knowledge findings return to Stage 13. A source defect returns to
  Stage 9 for architecture, Stage 6 for the prototype, Stage 5 for a deliberate
  channel/design-system change, or Stage 1 for the parity map.
- Stage 15 SDD references stable OKF concept ids and links. It does not copy
  knowledge into an untraceable second narrative.

`knowledge-manifest.json` pins the source artifacts and every bundle file by
SHA-256. Any change invalidates a previous Stage 14 pass.

## Conformance

The bundle follows OKF v0.2 and adds stricter migration-specific rules:

- every non-reserved Markdown file has valid YAML frontmatter;
- `type`, `id`, `title`, `description`, `status`, `generated`, and `sources`
  are mandatory;
- concept ids and source ids are unique;
- all repository-relative sources exist and are pinned by the manifest;
- every bundle Markdown file is pinned, and no unmanifested concept is allowed;
- placeholders and silent source-free claims fail the audit.

The upstream format is vendor-neutral. The canonical specification is:
<https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md>.

## Numbered Architecture Review Cycles

New and reopened cycles follow [Architecture Review Cycles](../architecture/review-cycles.md). Stage 11 records the human decision in `analysis/stages/stage-11/architecture-owner-verdict-NNN.md`; Stage 12 creates a separate immutable `analysis/stages/stage-12/architecture-closure-NNN.md`. Status selects exact paths. A negative closure accompanies the classified return and is mandatory reading on re-entry at Stages 9-11. Stage 13 reads and pins both records. Preserve old decisions, hashes and stage history; adopting this format is not a new approval.

## Feature Dependency Contract

Reference relevant reviewed feature-dependencies.json conditions and contract sources when synthesizing knowledge. Do not duplicate its edge list in OKF. A dependency change requires affected source/knowledge review; unrelated concepts need not be rewritten.

See [the normative dependency procedure](../feature-dependencies-guide.md).

# ADR NNN - <decision title>

**Why was this decision made, which alternatives were rejected, and what follows from it?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Why was this decision made, which alternatives were rejected, and what follows from it?**
- **Created by:** The Stage 9 architecture agent writes one ADR for each consequential decision.
- **Maintained / decided by:** The architecture agent records supersession and preserves history; the owner approves the decision through architecture review.
- **Governing instructions:** Stage 9 decision recording and Stage 11 approval
- **When used:** At Stage 9, the architecture agent writes a new ADR whenever a consequential choice has alternatives or lasting trade-offs; the owner confirms the decision. Plans cite the applicable accepted ADRs.
- **How used:** A separate Architecture Decision Record for each consequential choice. It preserves the problem context, selected option, rejected alternatives, trade-offs and affected NFRs so future changes do not have to rediscover why the decision was made.
- **Example:** ADR-001 records why the team chose a modular monolith, which alternatives were rejected and which NFRs the choice satisfies.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `proposed` (not yet adopted); `accepted` (the decision was adopted under the governing architecture review); `superseded by ADR-NNN` (a newer linked decision replaces it). Acceptance of an ADR is not completion of its implementation. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/architecture/adr/NNN-SLUG.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> A drafted decision is not an adopted or implemented decision.
>
> **Next:** The architecture agent records the decision, rejected alternatives, consequences and required approval.
>
> **Details:** [Decision](#read-decision) / [Consequences](#read-consequences).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Context](#read-context)
- [Decision](#read-decision)
- [Rationale](#read-rationale)
- [Options Considered](#read-options-considered)
- [Consequences](#read-consequences)
- [Verification](#read-verification)
- [Publication Requirements](#read-publication-requirements)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Date: YYYY-MM-DD
- Status: proposed | accepted | superseded by ADR-NNN
- Decision owners: <roles or names>
- Closes NFRs: <NFR ids; must match architecture-nfr-manifest.json>
- Requirement or constraint sources: <references>
- Architecture document set version: <must match architecture-nfr-manifest.json>
- Architecture Draw.io snapshot: `architecture.drawio` at the same document-set
  version; its SHA-256 must be pinned by `architecture-nfr-manifest.json`

<a id="read-context"></a>

## Context

The architecture agent states the specific problem and links the requirement,
constraint or NFR that makes a decision necessary.

<a id="read-decision"></a>

## Decision

The architecture agent states the selected option, its scope and approval state.
A proposed option must not be described as already accepted.

<a id="read-rationale"></a>

## Rationale

The architecture agent explains why the selected option satisfies the cited
requirements and NFRs; the comparison below retains rejected alternatives.

<a id="read-options-considered"></a>

## Options Considered

| Option | Benefits | Costs or risks | Reason rejected |
|---|---|---|---|
| <option> | <benefits> | <costs or risks> | <reason> |

<a id="read-consequences"></a>

## Consequences

| Consequence | Benefit / cost / risk | Affected area | Required follow-up |
|---|---|---|---|
| <specific effect> | <trade-off, including operations, security or lock-in> | <linked architecture section> | <responsible actor and trigger, or none with reason> |

<a id="read-verification"></a>

## Verification

| NFR | Acceptance criterion | Verification owner | Test or measurement |
|---|---|---|---|
| <NFR-id> | <measurable criterion> | <responsible role> | <planned evidence> |

<a id="read-publication-requirements"></a>

## Publication Requirements

- The ADR path and SHA-256 are listed in `architecture-nfr-manifest.json`.
- The ADR id and NFR links agree with the manifest.
- The decision and trade-offs are represented consistently in
  `architecture.md` and `architecture.drawio`.
- Any material ADR change creates a new document-set version, requires a
  refreshed Draw.io snapshot, and updates its SHA-256 before review. Optional
  PDF/SVG/PNG presentation exports are regenerated from that snapshot.

# <Architecture Area>

**How does this part of the architecture work, and which decisions are still deferred?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **How does a specific part of the architecture work in detail?**
- **Created by:** The Stage 9 architecture agent writes a focused chapter when a concern needs its own detail.
- **Maintained / decided by:** The architecture agent keeps affected chapters aligned with the main record, ADRs and reviewed source set.
- **Governing instructions:** Stage 9, with Stage 10-12 control and approval
- **When used:** Created when a concern needs more detail than architecture.md can carry. Each chapter stays linked to the applicable NFRs and decisions.
- **How used:** Focused chapters that explain individual architecture concerns in enough detail to design and build against them. Typical sections cover identity, data, integrations, operations, deployment and UI, and stay synchronized with the main architecture record.
- **Example:** The identity chapter describes session boundaries, CSRF protection and the external SSO integration point used by later specifications.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** A current decision (the recorded architecture choice) is separate from deferred detail (a decision still due at its named trigger) and planned verification (not yet executed). Cite the approval boundary instead of inferring global readiness. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/architecture/sections/NN-SLUG.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Area decisions, contracts and verification triggers are not yet established.
>
> **Next:** The architecture agent records the area contracts, dependencies and unresolved decisions.
>
> **Details:** [Current Decision](#read-current-decision) / [Deferred Feature Detail](#read-deferred-feature-detail).

<details>
<summary><strong>Contents</strong></summary>

- [Scope](#read-scope)
- [Current Decision](#read-current-decision)
- [Boundaries and Contracts](#read-boundaries-and-contracts)
- [Deferred Feature Detail](#read-deferred-feature-detail)
- [Verification and Reopen Triggers](#read-verification-and-reopen-triggers)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-scope"></a>

## Scope

The architecture agent names one architectural concern and the classes of
downstream work that depend on it. Unrelated architecture belongs in another section.

<a id="read-current-decision"></a>

## Current Decision

| Decision | State / approved scope | Requirement or NFR | ADR / owner evidence |
|---|---|---|---|
| <precise current rule> | <proposed / approved for named scope> | <stable identifier> | <linked source; no inferred approval> |

<a id="read-boundaries-and-contracts"></a>

## Boundaries and Contracts

| Component / boundary | Responsibility / data owner | Interface / contract | Trust / transaction rule | Failure behavior |
|---|---|---|---|---|
| <named component> | <explicit owner> | <linked contract> | <enforced boundary> | <timeout, retry, recovery or error rule> |

<a id="read-deferred-feature-detail"></a>

## Deferred Feature Detail

| Deferred concern | Why not decided here | First dependent work / trigger | Responsible actor |
|---|---|---|---|
| <specific unresolved behavior> | <boundary or missing input> | <condition that requires a decision> | <agent role / human owner> |

Downstream delivery specifications reference this section when they close the
detail; this architecture section does not gain reverse delivery links.

<a id="read-verification-and-reopen-triggers"></a>

## Verification and Reopen Triggers

| Decision / boundary | Required proof | Current evidence / not checked | Reopen trigger |
|---|---|---|---|
| <rule above> | <measurable check> | <linked result or explicit pending state> | <change that requires architecture review> |

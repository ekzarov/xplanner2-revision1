# Foundation Baseline - <project name>

**Which foundation decisions must be settled before implementation can safely start?**

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

> **Reading statuses:** A foundation approval (permission for its explicitly bounded baseline) is not approval of all feature architecture. Deferred details remain unresolved until their recorded trigger and governing review. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/architecture/sections/00-foundation.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> The foundation code-start conditions have not yet been demonstrated.
>
> **Next:** The architecture agent records stable foundations, code-start prerequisites and reopen triggers.
>
> **Details:** [Stable Boundaries](#read-stable-boundaries) / [Code-Start Gate](#read-code-start-gate).

<details>
<summary><strong>Contents</strong></summary>

- [Purpose](#read-purpose)
- [Stable Boundaries](#read-stable-boundaries)
- [Code-Start Gate](#read-code-start-gate)
- [Governed String Gate](#read-governed-string-gate)
- [Reopen Triggers](#read-reopen-triggers)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-purpose"></a>

## Purpose

The architecture agent defines the smallest stable architecture required to
create, test and deploy the first operational skeleton. Future feature design
is outside this foundation record.

<a id="read-stable-boundaries"></a>

## Stable Boundaries

| Boundary | Decision | ADR | Why replacement would be expensive |
|---|---|---|---|
| application shape | <decision> | <ADR> | <impact> |
| primary persistence | <decision> | <ADR> | <impact> |
| transaction ownership | <decision> | <ADR> | <impact> |
| packaging/deployment | <decision> | <ADR> | <impact> |
| API/channel contract | <decision> | <ADR> | <impact> |
| engineering gates | <decision> | <ADR> | <impact> |

<a id="read-code-start-gate"></a>

## Code-Start Gate

- [ ] Runtime, persistence, transaction, and deployment boundaries are approved.
- [ ] The first skeleton and deployment boundaries are explicit and controlled.
- [ ] The foundation can build, test, migrate, deploy, smoke, and roll back.
- [ ] Deferred concerns name the slice that must close them before use.
- [ ] Independent architecture control and owner approval pin this exact set.

<a id="read-governed-string-gate"></a>

## Governed String Gate

| Evidence | Recorded value |
|---|---|
| governed runtime categories | <cookies, headers, policies, configuration keys, and project-specific categories> |
| analyzer or architecture test | <test/analyzer name and backticked repository path> |
| normal CI command | <backticked command using a committed script or package.json entrypoint> |
| failing fixture | <backticked fixture id present in the test: a single-use governed identifier at a governed sink> |
| passing fixture | <different backticked fixture id present in the test: local non-contract text left inline> |

This record governs runtime contracts. User-facing prose follows the localization
contract; incidental local implementation text is not moved into a global constants
bag merely to satisfy this gate. The architecture audit resolves the recorded test
and CI entrypoint and verifies that both fixture identifiers exist in the test.

<a id="read-reopen-triggers"></a>

## Reopen Triggers

| Changed boundary | Why the existing decision no longer holds | Required architecture re-entry |
|---|---|---|
| <solution, persistence, deployment or engineering workflow> | <specific trigger> | <affected area / ADR and independent control> |

# Owner Waiver - <waiver id>

**Did the owner authorize this specific exception, for what scope and under which conditions?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Did the owner authorize this specific exception, for what scope and under which conditions?**
- **Created by:** The active-stage agent prepares the waiver record; the named human authority explicitly grants or refuses the exception.
- **Maintained / decided by:** The agent records scope, evidence and expiry; only the authorized decision maker may extend or replace the decision.
- **Governing instructions:** The exact waiver provision in MIGRATION.md and the applicable stage procedure; no blanket waiver is inferred.
- **When used:** Created only when a named process rule explicitly permits an exceptional path and ordinary completion is impossible or deliberately deferred.
- **How used:** Use separate Decision and Authority, Scope, Blocked Activity, Rationale, Residual Risk, Permitted Next Stage, Exception Boundary And Follow-up, and Independent Review sections. The agent fills each from evidence or explicitly records what is unknown. Preserve the original decision and timestamp; a waiver never silently weakens unrelated gates or supplies independent approval.
- **Example:** A pre-SDD knowledge waiver permits one exact slice to proceed while the full knowledge bundle is unavailable, then expires when that slice closes.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `pending` (no exception has been granted); an approved waiver (the human authority permits only the named exception until its deadline/trigger) does not mean the waived check passed. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/stages/waivers/GATE-SCOPE.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No exception has been granted by this unfilled template.
>
> **Next:** The active-stage agent records the permitted exception, human authority and remaining obligations.
>
> **Details:** [Decision and Authority](#read-decision-and-authority) / [Permitted Next Stage](#read-permitted-next-stage).

<details>
<summary><strong>Contents</strong></summary>

- [Decision and Authority](#read-decision-and-authority)
- [Scope](#read-scope)
- [Blocked Activity](#read-blocked-activity)
- [Rationale](#read-rationale)
- [Residual Risk](#read-residual-risk)
- [Permitted Next Stage](#read-permitted-next-stage)
- [Exception Boundary And Follow-up](#read-exception-boundary-and-follow-up)
- [Independent Review](#read-independent-review)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-decision-and-authority"></a>

## Decision and Authority

**Was the exception explicitly granted, by whom, and where is that decision recorded?**

- Decision ID: `waiver:<gate>:<exact-scope>`
- Decision: approved | rejected
- Decided by: `<owner identity>`
- Decided at: `YYYY-MM-DDTHH:MM:SSZ`
- Owner decision evidence: <exact record or unresolved; never infer approval>.

The agent preserves the human decision and its timestamp. Formatting this
record is not a new decision. An unresolved draft authorizes no progression.

<a id="read-scope"></a>

## Scope

**Which condition and exact project or slice does this exception cover?**

- Gate: `legacy_walkthrough_fallback | application_form_style | prototyping_retroactive | architecture_retroactive | pre_sdd_knowledge`
- Exact scope: `<project or slice scope>`
- Record: `analysis/stages/waivers/<gate>-<scope>.md`
- Applicable approved inputs: <exact decisions and source records>.
- Scope not covered: <neighboring slices, changes or global decisions not authorized>.

<a id="read-blocked-activity"></a>

## Blocked Activity

Describe the activity that cannot be completed and the evidence showing why it
is unavailable. A waiver does not mark that activity complete.

<a id="read-rationale"></a>

## Rationale

**Why is continuing acceptable despite the blocked condition?**

- Rationale: `<why controlled progression is acceptable>`.

The agent records the owner's actual grounds and applicable constraints,
not a justification invented after the work was performed.

<a id="read-residual-risk"></a>

## Residual Risk

**What remains unverified, and what is still forbidden?**

- Residual risk: `<what remains unverified>`.
- Prohibited work: <explicit exclusions from the owner's decision>.

The agent lists the unverified behavior, roles, environments or invariants
separately from scope exclusions. Both remain visible in later records.

<a id="read-permitted-next-stage"></a>

## Permitted Next Stage

**What next step does this exception permit, and what checks remain mandatory?**

- Permitted next stage: `stage-NN`.
- Still-required controls and owner decisions: <exact applicable obligations>.

Permission to begin a stage is not evidence that it or its independent
control has passed. The agent records the same decision ID, scope and
permitted next stage in migration_status.yaml without silently advancing it.

<a id="read-exception-boundary-and-follow-up"></a>

## Exception Boundary And Follow-up

The active-stage agent separates an authorized exception from a passed check.
The owner can approve only the exception allowed by the named process provision;
a drafted waiver or pending decision authorizes no transition.

| Unverified item | Evidence of blocker | Exact permitted exception / authority | Required actor and next action | Expiry or re-entry condition | Closure evidence |
|---|---|---|---|---|---|
| <behavior, role or invariant> | <durable link> | <rule and human decision link or pending> | <actor and action> | <date, slice or event> | <later record or not verified> |

- Checks actually completed: <separate evidence links or none>.
- Checks still unverified: <exhaustive IDs matching Residual Risk>.
- Gates and scope not waived: <explicit limits>.
- Human decision evidence: <identity, date and link or pending>.

The agent retains the original exception and records later closure through a
linked result; approving a waiver never turns the skipped check into a match.

<a id="read-independent-review"></a>

## Independent Review

Reference the later clean independent pass that verified this waiver, its exact
scope, evidence, permitted transition, and residual-risk treatment. Until that
pass exists, the waiver cannot close the transition gate.

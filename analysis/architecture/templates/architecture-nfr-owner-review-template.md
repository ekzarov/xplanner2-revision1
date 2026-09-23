# Stage 9 NFR Owner Review

**What did the owner approve in this exact workbook, what remains open, and what work is permitted next?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Did the owner review and approve, defer or return this exact workbook version?**
- **Created by:** The Stage 9 agent writes the record of the human owner review of an exact NFR workbook version.
- **Maintained / decided by:** The agent preserves decision history and records subsequent explicit owner reviews; the owner decides approval or return.
- **Governing instructions:** Stage 9 NFR owner review
- **When used:** After the Stage 9 walkthrough, the architecture agent records the owner's explicit decisions in this review and refreshes it after every material workbook change. Agents and audits use it to distinguish content merely present in Excel from content confirmed by the owner; a hash mismatch blocks downstream reliance.
- **How used:** The durable receipt for the owner's walkthrough of one exact NFR workbook version. It turns only the reviewed workbook hash into decisions that architecture may rely on. Any later Excel edit creates a new hash and makes this review stale, so changed rows remain proposals until the owner walks them again. The project keeps one current review file: dated Owner amendment entries provide readable change history, while Git preserves every prior version. After reapproval, update the workbook hash and verdict, then repin architecture-nfr-manifest.json without erasing earlier decisions.
- **Example:** The owner approves local login plus SSO readiness. A later security discussion changes the SSO row, so the new Excel hash fails the audit until a dated Owner amendment records the owner's decision, updates the review hash and verdict, and repins architecture-nfr-manifest.json. Git retains the previous reviewed snapshot.

**Proposal, decision and remaining work:**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `pending` (the owner has not decided this exact workbook version); `approved` (only the stated scope is approved); `returned` (corrections required); `deferred` (postponed with authority and a deadline/trigger). Keep the standalone verdict value unchanged and put its scoped explanation in the next paragraph. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/architecture/architecture-nfr-owner-review.md`.
> The Stage 9 agent creates this file from the template and records the human
> owner's actual decisions; this
> template and an agent-filled draft grant no permission.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> No owner decision on this exact workbook version is recorded in this template.
>
> **Next:** The Stage 9 agent records explicit owner decisions, remaining questions and the precise permission boundary.
>
> **Details:** [Decision Summary](#read-decision-summary) / [Open And Deferred Items](#read-open-and-deferred-items) / [Verdict](#read-verdict).

<details>
<summary><strong>Contents</strong></summary>

- [Decision Summary](#read-decision-summary)
- [Permitted Next Work](#read-permitted-next-work)
- [Recorded Owner Decisions](#read-recorded-owner-decisions)
- [Open And Deferred Items](#read-open-and-deferred-items)
- [Required Owner Actions](#read-required-owner-actions)
- [Walkthrough](#read-walkthrough)
- [Verdict](#read-verdict)
- [Reviewed Workbook And Counts](#read-reviewed-workbook-and-counts)
- [Owner Amendments](#read-owner-amendments)
- [Error Prevention](#read-error-prevention)
- [Editorial Changes](#read-editorial-changes)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-decision-summary"></a>

## Decision Summary

**Overall outcome: pending owner review.**

| Question | Recorded answer |
|---|---|
| What was reviewed? | <workbook version, exact scope and review date; or not yet reviewed> |
| What did the owner approve? | <specific decisions / row IDs linked below; or none> |
| What remains open or deferred? | <blocking items and authorized deferrals linked below; or none> |
| Is Stage 9 closed for the declared scope? | <no / yes with exact gate evidence; never inferred from one approved subset> |
| What work is permitted next? | <exact scope and owner authority; or none> |
| What must the owner decide next? | <specific pending questions; or none> |

The summary agrees with the detailed decisions and verdict below. Counts do
not substitute for decisions, and a partial approval never approves the whole
architecture.

<a id="read-permitted-next-work"></a>

## Permitted Next Work

| Exact slice / architecture scope | Permission and durable owner record | Required controls still outstanding | Work not authorized |
|---|---|---|---|
| <scope or none> | <owner/date/decision link or pending> | <named gates and blockers> | <explicit boundary> |

<a id="read-recorded-owner-decisions"></a>

## Recorded Owner Decisions

The Stage 9 agent uses stable worksheet/row IDs from the exact workbook.
This is the decision receipt, not a second NFR register. Unchanged reviewed
rows may be grouped only with an exhaustive linked list; rows not discussed
are not silently counted as owner-confirmed.

| Worksheet / row IDs | Previous value or agent proposal | Explicit owner decision / resulting value | Decision state | Owner / date / evidence | Applied workbook and architecture change |
|---|---|---|---|---|---|
| <stable IDs> | <before or proposal> | <decision or pending> | approved/returned/deferred/pending | <durable link or pending> | <linked change or not applied> |

<a id="read-open-and-deferred-items"></a>

## Open And Deferred Items

| Row IDs | Unresolved question, unapplied decision or skipped evidence lane | Required actor / next action | Owner disposition and retry / deadline | Gate impact |
|---|---|---|---|---|
| <IDs or none> | <exact gap> | <responsible actor and action> | <decision link and condition or pending> | <blocking rule or authorized exception> |

<a id="read-required-owner-actions"></a>

## Required Owner Actions

| Decision required | Evidence-backed options presented by the agent | Owner response / remaining action | Affected scope |
|---|---|---|---|
| <specific question or none> | <options and consequences> | <decision link or pending> | <scope blocked or permitted by this answer> |

<a id="read-walkthrough"></a>

## Walkthrough

| Reviewed worksheet / exact row IDs | Discussion result | Decision / open-item reference |
|---|---|---|
| <scope actually discussed, not merely present in Excel> | <confirmed / changed / returned / deferred / not reviewed> | <link> |

The agent records whether mandatory discovery lanes and the client
questionnaire were reconciled, whether required Grade A and technology
decisions were closed, and whether the real team's capability gaps have an
agreed plan. Unverified and skipped work stays explicit.

<a id="read-verdict"></a>

## Verdict

`pending`

(The owner has not yet recorded a decision on this exact workbook version.
The Stage 9 agent replaces this explanation with the actual scope, remaining
conditions and permitted next work when recording an explicit owner decision.)

This is the overall verdict for the exact declared scope. Any narrower
permission is named under Permitted Next Work and does not override this
verdict or waive an independent control.

<a id="read-reviewed-workbook-and-counts"></a>

## Reviewed Workbook And Counts

<details>
<summary><strong>Exact workbook identity and reconciled counts</strong></summary>

- Project: `{{PROJECT_NAME}}`
- Scope: `{{SCOPE}}`
- Reviewed by: `{{OWNER}}`
- Date: `YYYY-MM-DD`
- Decision register SHA-256: `{{SHA256}}`
- Legacy discovery total: `0`
- Legacy discovery completed: `0`
- Legacy discovery open: `0`
- Legacy discovery live skipped by owner: `0`
- Client questionnaire total: `0`
- Client questionnaire answered: `0`
- Client questionnaire deferred: `0`
- Client questionnaire open: `0`
- Grade A total: `0`
- Grade A approved: `0`
- Grade A closed: `0`
- Technology decisions total: `0`
- Technology decisions resolved: `0`
- Technology Grade A open: `0`
- Team capabilities total: `0`
- Team capabilities assessed: `0`
- Team capabilities open: `0`

The agent reconciles these totals with the workbook's own definitions.
`Grade A closed` is the computed Closed gate, not just a Status label.
A skipped live lane is not verified live; an approved target is not an
implemented result. Pending owner decisions remain pending even if audits pass.

</details>

<a id="read-owner-amendments"></a>

## Owner Amendments

<details>
<summary><strong>Later owner decisions, preserving earlier approvals and conditions</strong></summary>

| Date / owner | Previous reviewed workbook hash | Changed row IDs and before-to-after decision | New reviewed workbook hash | Evidence / verdict |
|---|---|---|---|---|
| <date and human identity> | <hash> | <IDs and explicit decision> | <hash after review or pending> | <durable decision link and verdict> |

The agent appends actual repeated owner reviews here and retains earlier
decisions. A changed workbook remains unapproved by the previous review until
the new review records the exact hash and verdict. A translation, layout edit,
or instruction update is an editorial change, not an Owner amendment.

</details>

<a id="read-error-prevention"></a>

## Error Prevention

The preparing agent applies [the shared checks](../../error-prevention.md)
before the owner review and after corrections. The human supplies decisions,
not self-check prose. Keep the existing owner decision and hash boundaries.

- **Self-check:** <scope/version; checklist revision or SHA-256; applicable CHK
  IDs and outcomes; exclusions and reasons, or no learned checks yet>
- **Learning update:** <confirmed reusable proposal, existing CHK coverage, or
  no qualifying new check and why; coordinator validates and deduplicates>

<a id="read-editorial-changes"></a>

## Editorial Changes

<details>
<summary><strong>Presentation changes only, not owner decisions</strong></summary>

| Date / editor | Presentation change | Decision or evidence impact |
|---|---|---|
| <date and agent/editor, or none> | <layout/wording only> | <unchanged values; exact-set revalidation required if pinned bytes changed> |

Editing this file changes its file hash even if the workbook is unchanged.
The agent does not silently repin the architecture manifest, rewrite old
reviews, or label an editorial revision as newly approved.

</details>

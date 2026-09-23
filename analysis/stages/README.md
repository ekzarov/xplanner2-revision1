# Migration Stage Records

**Reading technical statuses.** `live-verified` (declared scope verified on live legacy), `partial-simulated` (some scope used authorized simulation), and `blocked-waived` (an exception covers missing live checks) have different evidence strength. `deployed` (released to the stated environment) is not `accepted` (the named slice has acceptance evidence and its required owner decision). [Status meanings](../artifact-status-meanings.md).

New records follow [artifact result boundaries](../artifact-result-boundaries.md):
established results, open differences or decisions, unverified scope and next
action stay distinct. The record family determines what counts as evidence;
planned work, owner approval and independent verification are not interchangeable.

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>bootstrap-gate-report.md</summary>

**What exactly was executed, and why is Bootstrap green?**

The detailed project-specific evidence record for the Bootstrap readiness gate. It records the exact audit commands, runtime versions, results, failures and corrections that justify the gate outcome. migration_status.yaml remains the state authority and references this report rather than duplicating its command-level proof. **What was actually verified:** Exact revision, environment, roles and scoped checks; Expected condition versus actual observation, with evidence; Passed or matching checks, differences and unexecuted scope kept separate; Outstanding IDs, responsible actor, retry condition and next gate. Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

- **Created by:** The initializer creates a pending report; the Bootstrap agent fills it from actual audit output.
- **Maintained / decided by:** The Bootstrap agent records reruns and corrections; the human owner authorizes entry to Stage 1.
- **Instructions:** Bootstrap audit and transition procedure

**When used:** The active Bootstrap agent fills this fixed report with exact commands, runtime versions, outcomes and corrections. Summary counts must match the evidence rows. Record failures immediately in status with the report in blockers[].evidence; do not wait for correction approval. A real authorized transition later cites it as gate_evidence.

**Example:** XPlanner recorded the Node and PowerShell versions, every Bootstrap command and result, and the failed methodology-link check plus its correction before the owner-authorized transition to Stage 1.

**Project file:** [`bootstrap-gate-report.md`](bootstrap/bootstrap-gate-report.md)

</details>
<details>
<summary>stage-03/walkthrough-NNN.md</summary>



Evidence from running and walking through the legacy application as a real user. It identifies the environment and roles used, actions performed, observed results, map corrections and any behavior that could not be verified live. **What was actually verified:** Exact revision, environment, roles and scoped checks; Expected condition versus actual observation, with evidence; Passed or matching checks, differences and unexecuted scope kept separate; Outstanding IDs, responsible actor, retry condition and next gate. Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

- **Created by:** The Stage 3 agent records observations from exercising the legacy application with applicable roles.
- **Maintained / decided by:** The walkthrough agent records new evidence; the owner decides any required simulation or waiver.
- **Instructions:** Stage 3

**When used:** Created while exercising the running legacy system with real roles. It records what was observed live and what remained inaccessible.

**Example:** The agent signs in as a project member, performs task editing and records that the observed permission state matches two parity rows.

</details>
<details>
<summary>stage-04-requirements-revision.md</summary>



The durable decision log for challenged legacy behavior. For every contradiction, obsolete rule or questionable workflow it records whether to keep, change or not port it, together with rationale, participants and owner confirmation. **Proposal, decision and remaining work:** Agent proposal or previous value; Explicit human decision tied to exact scope/version and evidence; Applied changes versus open questions and unapplied decisions; Authorized deferrals with responsible actor and deadline; Dated amendments retain prior decisions. A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

- **Created by:** The Stage 4 agent prepares findings and records explicit decisions by the human owner.
- **Maintained / decided by:** The Stage 4 agent appends corrections and decisions; the owner decides keep, change, defer or do-not-port.
- **Instructions:** Stage 4

**When used:** Used when discovery exposes contradictory, obsolete or unwanted behavior. The agent records the business owner's explicit keep, change or defer decisions before prototyping.

**Example:** The owner defers the legacy wiki workflow because that logic should not move into the replacement.

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
<summary>stage-15/sdd-record.md</summary>

**Here is what I designed, which approved sources I used, which requirements I covered, where gaps remain, and what I am handing over for your review.**

The Stage 15 design agent records the actual source approvals or bounded exceptions, links the specification, plan and tasks, and declares coverage, gaps and readiness for Stage 16. This is not an implementation self-review, an independent verdict or delivery evidence. The Stage 16 agent must verify this handoff against its sources; audit:sdd checks the SDD package but does not read this report. **Produced coverage and handoff boundary:** Exact approved inputs and declared source/requirement scope; Source item mapped to the produced concept or SDD section; Represented / missing / contradictory / explicitly deferred or excluded; Remaining gaps, responsible actor and blocking prerequisites; Readiness for the next independent review, not its verdict. A file hash proves identity, not correctness. Planned tests are not executed tests, and authored coverage is not implemented behavior.

- **Created by:** The Stage 15 design agent records the produced SDD package, assumptions, scope and self-checks.
- **Maintained / decided by:** The design agent records corrections before independent Stage 16 control.
- **Instructions:** Stage 15

**When used:** The Stage 15 design agent prepares this handoff from the named template as the SDD is assembled, including blocked or incomplete packages. The Stage 16 reviewer checks its source bindings, coverage, assumptions and gaps against the actual spec, plan and tasks. audit:sdd checks the package, not this report; only independent review and the required owner decision can authorize implementation.

**Example:** The reconstructed XPlanner 029 record links rows 260-263 to requirements and tasks, cites the owner decision and bounded waivers, and exposes conflicting prototype versions and delta/expanded wording before a fresh review. Historical delivery is not re-approved.

</details>
<details>
<summary>stage-18/delivery-NNN.md</summary>

**Did this release deploy safely, cover the required live behavior and agree with its governed records?**

One immutable report for the exact deployed revision: deployment, recovery readiness and useful live checks, followed by coverage reconciliation against the map, SDD, prototype and inventory. The report records discrepancies and required return-stage corrections; it does not silently rewrite approved files. Prepared tests are not assumed to cover every behavior. Required unverified scope prevents clean delivery; independent acceptance remains separate. **What was actually verified:** Exact revision, environment, roles and scoped checks; Expected condition versus actual observation, with evidence; Passed or matching checks, differences and unexecuted scope kept separate; Outstanding IDs, responsible actor, retry condition and next gate. Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

- **Created by:** The Stage 18 deployment agent records the exact release and evidence emitted by the deployment and verification tools.
- **Maintained / decided by:** Each deployment gets a separate immutable record; a correction is new evidence, not an invented successful rerun.
- **Instructions:** Stage 18

**When used:** The Stage 18 delivery agent records deployment, recovery readiness, smoke, raw journey and visual results, then completes Live Reconciliation in this same report. The agent discovers actual scope, compares it with the parity map, SDD, approved prototype and inventory, reuses applicable observations and investigates uncovered behavior. Missing required coverage blocks closure. audit:delivery validates the required reconciliation structure and bindings; the agent and independent acceptance reviewer check the meaning of evidence. No separate live-revision report is created.

**Example:** Illustrative: the browser journey proves an editor can save hours. During reconciliation the delivery agent cites that case without rerunning it, investigates an uncovered read-only action and records the discovered Edit-button defect. Delivery remains open until the defect and affected records are corrected. Historical XPlanner reports below retain their original scope and do not claim the new combined checks.

</details>
<details>
<summary>raw journey + summary</summary>



The raw browser-run output plus a human-readable summary of the tested journey. The summary pins the raw report hash and deployed revision, and identifies the role, actions and surfaces exercised so evidence cannot be silently rewritten.

- **Created by:** The browser journey runner emits raw evidence; the Stage 18 agent writes its summary and pins the raw result hash.
- **Maintained / decided by:** The agent performs another journey for changed delivery; previous exact-revision evidence remains history.
- **Instructions:** Stage 18 deployed user journey

**When used:** The configured browser journey produces raw output and a hash-linked summary during Stage 18. Audits verify the raw report itself.

**Example:** The journey signs in as Daniel, records 2.5 hours on a task, checks the daily total and signs out.

</details>
<details>
<summary>stage-19-pass-NNN.md</summary>



The independent acceptance report for the deployed slice or final system. A reviewer from outside the implementation team verifies useful role-based journeys, required evidence and remaining findings before the owner signs acceptance. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 19 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 19 independent control and reviewer eligibility

**When used:** At Stage 19, a fresh independent third-party agent exercises the scope using expectation-only extracts without implementation status, destination notes, prior test results or findings. The agent saves observations before Phase B opens full originals, verifies extract completeness and reconciles evidence. A clean report is required before owner acceptance. An implementation defect returns to Stage 17, an SDD defect to Stage 15, an architecture defect to Stage 9, and a parity-map defect to Stage 1.

**Example:** The reviewer repeats the task-time journey for member and read-only roles and records a clean verdict against the deployed SHA.

</details>
<details>
<summary>owner-walkthrough-NNN.md</summary>



An optional record of the owner's own hands-on walkthrough of the delivered system. It captures roles, journeys, observations and findings; if the owner declines the walkthrough, that choice is recorded separately rather than silently assumed. **What was actually verified:** Exact revision, environment, roles and scoped checks; Expected condition versus actual observation, with evidence; Passed or matching checks, differences and unexecuted scope kept separate; Outstanding IDs, responsible actor, retry condition and next gate. Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

- **Created by:** PM writes observations and the explicit decision from the human owner hands-on walkthrough at Stage 19.
- **Maintained / decided by:** The owner performs or declines the walkthrough; PM records the exact outcome or a separate explicit decline. QA supplies independent evidence, not owner decisions.
- **Instructions:** Stage 19 optional owner walkthrough

**When used:** When the owner performs a hands-on final walkthrough, PM records the observed journeys and findings. If the owner declines, PM creates the explicit decline record and links that actual decision from status. QA supplies its independent report without editing shared status or recording human approval.

**Example:** The owner verifies task editing and reporting on the demo stand, then signs the walkthrough and final slice acceptance.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

This directory holds durable execution records that are not independent review
reports and do not belong to the prototype or architecture record.

[`analysis/migration_status.yaml`](../migration_status.yaml) is the standing input and updated output of
every Stage 1-19. The active-stage agent reads it before using these records and
updates the same checkpoint before handoff after a durable transition, return,
gate result, blocker or owner decision. Do not create a stage-specific copy.

Use only the current canonical stage numbering. Create records under
`analysis/stages/stage-NN/` and start from the matching file in
[`templates/`](templates/).

## Record Locations

Use [the template-to-output naming table](../artifact-naming.md) for exact
paths. Remove the template marker and fill only its declared placeholders.
For example, `walkthrough-NNN-template.md` creates
`analysis/stages/stage-03/walkthrough-001.md`.

| Stage | Record | Template |
|---:|---|---|
| Bootstrap | Combined audit commands, runtime versions, results, failures, and corrections | `bootstrap-gate-report-template.md` |
| Any governed fallback | Exact-scope owner waiver and residual-risk record | `GATE-SCOPE-template.md` |
| 3 | Live, partial, or alternative walkthrough evidence | `walkthrough-NNN-template.md` |
| 4 | Owner-approved requirements revisions | `stage-04-requirements-revision-template.md` |
| 13 | Open Knowledge Format (OKF) v0.2 synthesis and coverage record | `knowledge-record-template.md` |
| 15 | SDD authoring, owner-reviewed assumptions, impact scope, and traceability gate record | `sdd-record-template.md` |
| 18 | Per-slice delivery and smoke evidence | `delivery-NNN-template.md` |
| 19 | Required slice acceptance and owner sign-off | `stage-19-pass-NNN-template.md` |
| 19 | Optional additional owner walkthrough evidence | `owner-walkthrough-NNN-template.md` |
| 19 | Exact owner decision declining the optional walkthrough | `owner-walkthrough-decline-template.md` |

Independent reports for Stages 2, 7, 10, 14, 16, and 19 belong under
[`../reviews/`](../reviews/README.md). Stage 5-8 prototype decisions and
approvals belong under [`analysis/prototyping/`](../prototyping); Stage 9-12 architecture records
belong under [`analysis/architecture/`](../architecture); the controlled target knowledge bundle
belongs under [`analysis/knowledge/`](../knowledge); feature SDD artifacts belong under
`specs/NNN-<slug>/`.

## Rules

- On return, the active-stage agent follows the
  [return and correction protocol](../reviews/README.md#return-and-correction-protocol).
  A correction record links the exact triggering report, finding IDs, source
  checks, dispositions, changed paths/rows and remaining work. It preserves
  history and cannot stand in for the next independent verdict.

- Name records with the current stage and a stable scope identifier.
- Record exact dates, revisions, environments, commands, and results.
- For Stages 15-19, preserve the SDD's `delta`, `expanded`, or `full`
  verification mode, evidenced exclusions, direct dependencies, and any scope
  expansion trigger in every downstream record.
- Link evidence rather than relying on chat summaries.
- Preserve uncertainty: unavailable checks are blocked, not passing.
- Record every owner decision explicitly with decision maker, date, scope, and
  rationale.
- A waiver uses `waiver:<gate>:<exact-scope>` and records decision, owner,
  timestamp, exact scope, rationale, durable `record`, residual risk, and the
  single registered permitted next stage. Canonical records live only in
  `analysis/stages/waivers/`. It leaves the unavailable activity unverified
  until later evidence closes it and must be verified by an eligible clean
  independent pass.
- Never overwrite immutable independent-review reports from this directory.
- Do not carry another project's completed results, approvals, exceptions, or
  numbering into a new record.

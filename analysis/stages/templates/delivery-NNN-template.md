# Stage 18 Delivery - <slice>

**Did this release deploy safely, cover the required live behavior and agree with its governed records?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 18 deployment agent records the exact release and evidence emitted by the deployment and verification tools.
- **Maintained / decided by:** Each deployment gets a separate immutable record; a correction is new evidence, not an invented successful rerun.
- **Governing instructions:** Stage 18
- **When used:** The Stage 18 agent records the exact merged candidate during delivery and completes Live Reconciliation before handing it to independent Stage 19 acceptance.
- **How used:** It binds deployment, smoke, browser journey, recovery and live coverage reconciliation to one revision and environment. The delivery audit validates required structure and bindings; the agent and independent reviewer assess coverage and evidence meaning.
- **Example:** The agent deploys revision abc123, records required checks, reuses an applicable save-hours journey observation and investigates an uncovered read-only action in the same delivery report.

**Conditional cosmetic backlog check:**

- Stage 18: Before production release, the delivery agent matches the conditional backlog against all screens, components and functions in the release, including shared components. An applicable finding assigned to a later slice still blocks release until verified closed. The delivery record cites the backlog revision and checked finding IDs. Demo/test deployment may precede closure to obtain evidence. During live reconciliation the delivery agent records reproduced cosmetic findings in the immutable delivery report and blocks closure. Stage 17 reopens the same backlog, preserves history and produces a newly reviewed candidate.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `passed` (this executed delivery check succeeded); `failed` (its expected condition was not met); `blocked` (it could not complete). Deployment to a named environment does not itself establish live parity or final acceptance. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/stages/stage-18/delivery-NNN.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Deployment and required verification outcomes are not yet recorded.
>
> **Next:** The delivery agent records the exact release, recovery, executed checks and live reconciliation before independent acceptance.
>
> **Details:** [Delivery Verification Boundary](#read-delivery-verification-boundary) / [Gate Result](#read-gate-result).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Deployment](#read-deployment)
- [Rollback Readiness](#read-rollback-readiness)
- [Changed And Directly Affected Surfaces](#read-changed-and-directly-affected-surfaces)
- [Smoke Results](#read-smoke-results)
- [Parity Map Closure](#read-parity-map-closure)
- [Deployed User Journey](#read-deployed-user-journey)
- [Deployed Visual Parity](#read-deployed-visual-parity)
- [Live Reconciliation](#read-live-reconciliation)
  - [Coverage And Observations](#read-coverage-and-observations)
  - [Findings, Record Updates And Remaining Scope](#read-findings-record-updates-and-remaining-scope)
- [Environment Health](#read-environment-health)
- [Findings and Corrections](#read-findings-and-corrections)
- [Delivery Verification Boundary](#read-delivery-verification-boundary)
- [Gate Result](#read-gate-result)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Date: YYYY-MM-DD
- Slice: <identifier>
- Deployed revision: <immutable revision>
- Environment ID: <exact key from config/environments.yaml>
- Environment contract: [`config/environments.yaml`](../../../config/environments.yaml)
- Target environment: <name and location>
- Legacy comparison environment: <name and location>
- Performed by: <person or agent>
- Result: passed | failed | blocked
- Parity workbook SHA-256: <SHA-256 of analysis/legacy_user_flows.xlsx from the deployed revision>
- Verification mode: delta | expanded | full
- Verification baseline: <exact SDD baseline>
- Expansion trigger: <none or named trigger>

<a id="read-deployment"></a>

## Deployment

Follow [the PM access/deployment handoff](../../../config/REMOTE_SERVER.md#configure-before-remote-work).
PM runs the approved deployment; Developer records and verifies the actual
operator's result without changing producer identity or claiming acceptance.

- Release authorization: <owner reference, exact candidate/environment/operation/data scope and validity>
- Access recheck: <current server access and application role accounts; changed/expired scope resolved or blocked>
- PM / deployment operator: <actual identities; bounded delegation reference if any>
- Data and isolation: <authorized migrations/test data, recovery constraints; legacy resources preserved>
- PM handoff evidence: <timestamp and sanitized command output for this exact revision>

- Command: `<single deployment command>`
- Configuration source: <reference; no credentials>
- Connection verification: `npm --prefix analysis/tools run remote:check`
- Observed hostname: <exact hostname printed by the governed check>
- Observed kernel: <exact kernel printed by the governed check>
- Data change commands: <explicit commands or none>
- Rollback command or procedure: <reference>

<a id="read-rollback-readiness"></a>

## Rollback Readiness

**Can this exact release be recovered safely, what was checked, and what remains unproven?**

The Stage 18 agent fills this section in the delivery record; it is not a
separate artifact. A tool or authorized operator performs the declared check.
The agent records its actual output and verifies its scope. Do not run a
destructive production rehearsal merely to fill this record.

- Recovery strategy: rollback | forward-recovery
- Governed command or procedure: <exact reference>
- Checked revision: <exact same value as Deployed revision>
- Environment ID: <exact same value as delivery metadata>
- Verified at: <ISO timestamp with timezone>
- Performed by: <actual tool/operator and recording agent>
- Recovery target: <immutable prior release or exact recovery point>
- Preconditions and data compatibility: <schema/data compatibility, backup availability, required access and safety constraints>
- Validation mode: controlled-rehearsal | readiness-check
- Validation performed for this revision: <check or controlled rehearsal>
- Expected outcome: <observable recovery condition>
- Observed outcome: <what actually happened, including failed attempts>
- Result: passed | failed | blocked | not-run
- Limitations: <unverified scope, residual risk, invalidation triggers, or explicitly assessed none>
- Evidence: inline

```text
<actual command/check output, including the checked release and observations>
```

`controlled-rehearsal` means a recovery was exercised in the declared scope;
`readiness-check` means prerequisites were checked without claiming an actual
restore. `rollback` restores a prior compatible release; `forward-recovery`
uses the declared recovery procedure when rollback is unsafe. `passed` means
the stated check succeeded; `failed`, `blocked` and `not-run` prevent closure.
A readiness check must not be described as a successfully exercised rollback.

For a separate raw log, replace `inline` with one local Markdown file link
relative to this report and add `Evidence SHA-256` with its digest. Keep logs
only where useful; inline recorded output needs no extra file or self-hash.
`audit:delivery` checks fields, release/environment binding, result and evidence
presence (and file digest for an attachment). The reviewing agent must verify
that observations support the declared outcome and scope; the audit neither
executes recovery nor proves the truth of the recorded output.

Historical reports keep their original evidence. Before an old record can
support a new gate closure, the agent creates a new dated record with actual
missing verification; a historical example cannot certify a later release.

<a id="read-changed-and-directly-affected-surfaces"></a>

## Changed And Directly Affected Surfaces

| Surface ID | Roles | Useful action or contract | Deployment location |
|---|---|---|---|
| <id> | <roles> | <action> | <route, operation, command, or job> |

<a id="read-smoke-results"></a>

## Smoke Results

| Surface ID | Check | Action performed | Expected | Actual | Result | Evidence |
|---|---|---|---|---|---|---|
| <exact ID from Changed Surfaces> | <check> | <meaningful action> | <expected> | <actual> | pass/fail/blocked | <reference> |

<a id="read-parity-map-closure"></a>

## Parity Map Closure

Copy the exact contract for this slice from `specs/traceability.md`. After the
exact deployed proof is captured, a records-only descendant updates legacy-backed
rows in [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx), migration status, Stage 17/18 records,
and the active slice's delivery/reconciliation checkboxes in `tasks.md`. It must
not change runtime, build, deployment, configuration, requirements or plans.
A target-only slice records its exact owner decision instead of inventing rows.

| Workbook row or scope | Owner decision (target-only only) | State | SDD evidence | Target evidence |
|---|---|---|---|---|
| <row number or target-only> | <decision or -> | delivered/deferred/not-applicable | <spec/requirement> | <test/code/report> |

<a id="read-deployed-user-journey"></a>

## Deployed User Journey

The configured `commands.user_journey` must run against the public deployed
revision. For a web target it must use a real browser and complete: anonymous
entry, form submission, authenticated landing, one useful changed or directly
affected surface action for every applicable role, and sign-out. Direct HTTP/API calls, mocked
browser routes, route existence, and health checks are supplemental evidence
and cannot satisfy this section.

The command must honor `DELIVERY_EVIDENCE_MODE`: `persist` creates an untouched
raw Playwright JSON report and a sibling summary only after the exact-revision
parity chain is known. Both filenames are content-addressed. The summary names
the raw report and pins its SHA-256, exact deployed revision, passed tests,
changed surfaces, local parity revision and deployed asset-manifest hash.
`verify-only` reruns the journey without creating or overwriting evidence.
[`analysis/tools/verify-user-journey.js`](../../tools/verify-user-journey.js) must validate the raw report itself; a
summary without its matching raw report is not sufficient evidence.
Deployment fixtures must bind every role and browser action to one stable
entity identity. If they discover that identity independently, their query,
filter and ordering must exactly match the production path and a regression
test must prove that alignment.

- Command: [`config/project.yaml#/commands/user_journey`](../../../config/project.yaml#/commands/user_journey)
- Target revision: <same immutable revision as Metadata>
- Result: passed | failed | blocked
- Raw Playwright evidence: <content-addressed *-playwright.json>
- Evidence summary: <content-addressed *-live.json that pins the raw SHA-256>

<a id="read-deployed-visual-parity"></a>

## Deployed Visual Parity

The configured `commands.visual_parity` must rerun against the public deployed
revision. The gate reads the active SDD itself and requires every screen in its
Approved Prototype Contract. Record the exact approved export set and manifest
hash; desktop/mobile screenshots, required states, icons, typography, palette
and spacing are binding. Representative populated, missing, boolean, badge and
long values must preserve exact copy, case, punctuation, placeholder glyphs,
wrapping and truncation. A functional E2E pass or a newly accepted screenshot
of the current implementation is not visual-parity evidence.
Every source-declared interactive state must be activated in the deployed
browser: hover requires a real hover and computed-style assertion; focus,
pressed, selected, disabled, validation and error states require their matching
interaction or setup. The browser must assert the source-derived computed
appearance immediately before the interaction and again after activation;
checking only the final state cannot prove that the resting state was correct.
Static screenshots cannot prove these states.

- Command: [`config/project.yaml#/commands/visual_parity`](../../../config/project.yaml#/commands/visual_parity)
- Approved export set: <exact approved version>
- Approved manifest SHA-256: <exact approved hash>
- Verified screens: <all active SDD screen ids>
- Source provenance: <screen id -> wireframe path -> verified SHA-256>
- Source-derived checks: <labels, exact icon ids, computed typography, component geometry, palette, spacing, content variants/placeholders, activated hover/focus/selected/disabled/error states, actions, composition, roles>
- Implementation snapshots: secondary regression evidence only
- Result: passed | failed | blocked
- Evidence: <trace/report/screenshots produced by the configured command>

<a id="read-live-reconciliation"></a>

## Live Reconciliation

**Did we overlook any required behavior, and do the delivered system and its records agree?**

The delivery agent completes this section before Stage 18 closes. It replaces
the former separate live-revision report. The agent discovers actual surfaces
in both systems across the slice and direct dependents (or the SDD's explicit
expanded/full scope), compares them with the parity map, SDD, approved prototype
and target inventory, and investigates missing or uncertain coverage live.

Use observations from this delivery's smoke, raw journey and visual checks when
the exact revision, environment, roles, data/preconditions, approved baseline
and checked action agree and no contrary observation exists. Cite the original
case/run and producer/time; do not execute or count the same check twice merely
to fill this section. Additional checks require a stated gap or repeat trigger.
Successful prepared tests do not replace discovery of unlisted routes, roles,
actions, APIs, jobs, placeholder destinations or regressions in cosmetic work.

- Reconciled revision: <exact Deployed revision>
- Reconciled environment: <exact Environment ID>
- Reconciled scope: <map rows, surfaces, roles, channels, direct dependents and expansion trigger>
- Reconciled by: <delivery agent session identity>
- Reconciled at: <ISO timestamp with timezone>
- Live discovery evidence: <enumerated live inventory with observations and source links>
- Reconciliation result: clean | findings | blocked

<a id="read-coverage-and-observations"></a>

### Coverage And Observations

| Check ID | Surface / role / action | Approved expectation and source | Actual observation and evidence | Evidence origin | Applicability or repeat reason | Outcome | Finding or decision |
|---|---|---|---|---|---|---|---|
| C-NNN | <concrete action and role> | <behavior and exact governed source> | <legacy/target observations; raw case/run or new evidence; original producer/time> | delivery-check / additional-live-check / mixed | <checked applicability, missing coverage or repeat trigger> | match / finding / blocked / not-checked / authorized-exclusion | <finding ID or exact permitted owner decision; none only for a match> |

Evidence origin is not a verdict: `delivery-check` cites an existing check in
this delivery; `additional-live-check` records new exploration; `mixed` identifies
both portions. Every required scoped action must be accounted for, not only
the actions existing tests happened to cover. Authorized target differences
are compared with the approved expectation, not treated as defects merely
because legacy differs. An unavailable legacy comparison remains explicit.

<a id="read-findings-record-updates-and-remaining-scope"></a>

### Findings, Record Updates And Remaining Scope

| Finding ID | Gap / decision / deferred | Evidence and affected scope | Map, SDD, inventory or cosmetic backlog update | Responsible actor / return stage / closure evidence |
|---|---|---|---|---|
| <ID or explicit none> | <classification> | <expected versus actual or unverified scope> | <exact record changes> | <Stage 17 implementation, 15 SDD, 9 architecture or 1 parity; next action and evidence> |

Required failed, blocked or unchecked scope prevents a clean result. A permitted
owner exclusion is not a passed test and records its exact scope and authority.
**Post-deployment boundary.** The delivery agent records observations in the immutable delivery report. In the records-only descendant, it may append slice-bound delivery links and set `recorded` in the existing Slice Verification Index evidence cells; it cannot change requirements, scope, SDD links, inventory or cosmetic decisions. Findings requiring those changes return to their owning stage, followed by review and a new candidate/deployment. `verify-attestation-history.js` checks every intermediate commit, not only the final diff. The report records a reproduced cosmetic finding immediately; Stage 17 reopens the backlog in the correction candidate. A failing live check never becomes a pass through an index update.
Run workbook and target audits against the reconciled records; their green
result validates only their automated checks, not the meaning of observations.
A changed runtime/configuration/design needs the appropriate return and new
delivery evidence. Never relabel the old release's results as a new verification.

<a id="read-environment-health"></a>

## Environment Health

| Component or dependency | Check / expected condition | Actual result | Verdict | Evidence |
|---|---|---|---|---|
| <component> | <health check and criterion> | <observation or not run> | pass/fail/blocked/not-checked | <durable link> |

<a id="read-findings-and-corrections"></a>

## Findings and Corrections

| Finding ID | Expected versus actual / original evidence | Applied correction or planned action | Recheck result and evidence | State |
|---|---|---|---|---|
| D-NNN | <criterion, observation and link> | <linked change or not applied> | <actual check or not run> | open/failed/blocked/verified-closed |

A corrected release receives a new immutable delivery record. The deployment
agent does not insert a later revision's success into this record's results;
prior failed attempts remain linked evidence.

<a id="read-delivery-verification-boundary"></a>

## Delivery Verification Boundary

| Required check group | Exact scoped checks / evidence report | Passed | Failed | Blocked | Not checked |
|---|---|---|---|---|---|
| <deployment, rollback, smoke, journey, visual parity or environment> | <enumerated checks and link> | <count> | <count> | <count> | <count> |

The agent counts distinct checks once within each group and identifies overlaps
between reports instead of adding duplicate test totals. Counts reconcile to
the linked evidence; a green health check does not prove user journeys or UI
parity. Required checks without execution evidence remain not-checked.

- Residual findings and unchecked scope: <IDs, affected roles/surfaces, next
  responsible actor and retry condition, or none>.
- Exclusions: <exact scope, governing reason and authority, or none; not passed>.
- Evidence revision/environment agreement: <comparison result and links>.
- Production-blocking cosmetic findings: <applicable backlog IDs or none>.

No required failed, blocked or unchecked verification is hidden by an overall
successful deployment command.

<a id="read-gate-result"></a>

## Gate Result

<State whether deployment and rollback are reproducible, the legacy baseline
remains available, every changed visible destination completed a useful smoke
action, live reconciliation has no unresolved required scope, and independent
acceptance may begin.>

Run the deterministic gates before independent acceptance:

1. Verify that every commit after the deployed candidate is records-only:
   `node analysis/tools/verify-attestation-history.js <repo> <deployed-revision>`.
2. Write this record's repository-relative path to
   `analysis/stages/stage-18/current-delivery-record.txt`.
3. Run `npm --prefix analysis/tools run audit:delivery`. The audit itself runs
   the governed connection check, configured deployed user journey, and
   deployed visual-parity gate.
4. Set `delivery.slice_status` to `deployed`; governed CI then
   requires `audit:sdd:slice` through `sdd-completion-policy.js`. Only Stage 19
   may record `accepted`, after independent review and the owner decision.
5. Run `audit:workbook` and `audit:target` against the reconciled records. An
   automated pass does not authorize acceptance or conceal unresolved scope.

The pointer is mutable; delivery records are immutable. A corrected delivery
creates a new record and updates only the pointer.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At Stage 2 full-blind and Stage 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

- **Self-check:** <stage/scope; result version; checklist revision or SHA-256;
  applicable CHK IDs and passed/failed/blocked outcomes; exclusions with reasons;
  or no learned checks yet>
- **Learning update:** <confirmed generalized proposals and basis; covered by
  existing CHK IDs; or no qualifying new check and why>

Independent reviewers propose changes here without editing the shared table.
The coordinator records actual admission/deduplication in the current correction
or work record. The owner need not write this section. This note does not replace
the required independent review, human decision or stage evidence.

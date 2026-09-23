# Artifact Status Meanings

**What does this technical label establish, what remains unresolved, and what is allowed next?**

The process-maintenance agent maintains this reading reference under
[artifact result boundaries](artifact-result-boundaries.md). It explains labels,
not current project readiness. The record's scope, evidence, human authority and
governing stage remain decisive. This guide is English-only; Russian is an optional
3D presentation translation, not a second rule source or machine vocabulary.
Historical uppercase spellings keep their original meaning and bytes; newly
written records use the exact spelling required by their schema.

## Authoring Rule

The authoring agent explains each technical status at its first meaningful use:
`pending` (the owner's decision has not yet been recorded for this version).
A short legend beside a table may explain repeated values once. The explanation
names the affected scope, missing condition and next responsible actor when these
are needed to understand the consequence; it must not invent a decision.

Keep parser-consumed fields, standalone verdict lines, enum values, hashes and
identifiers unchanged. If a parser requires an exact line, put the parenthetical
explanation in the next paragraph, not inside that value. JSON/YAML, workbooks,
generated evidence and other strict formats use their companion guide or an
existing schema-approved help field. Do not add arbitrary properties or alter
dropdown/formula values. Do not add a status to an artifact that has none.

Immutable or hash-pinned historical evidence is explained in a linked family
guide without rewriting its bytes. An authorized editorial revision of a mutable
record is not a new approval and must disclose any resulting stale evidence pin.
Never refresh approval hashes solely to hide an editorial change.

## Review And Check Results

| Literal | Plain meaning and boundary |
|---|---|
| `clean` | (The entire declared review scope was checked, with no new or unresolved findings and no required unchecked or blocked scope; separate owner approval is still required where specified.) |
| `findings` / historical `NOT CLEAN` | (The reviewer recorded discrepancies; read finding IDs, severity and the required correction route.) |
| `blocked` | (Required work or verification cannot finish; the blocker and responsible next actor must be named.) |
| `invalid` | (The review attempt is unusable, for example because independence failed; it is neither a clean pass nor proof of a product defect.) |
| `pending` | (The named check or decision is still outstanding; no success or permission is implied.) |
| `pass` / `passed` | (This executed check met its stated condition; not proof that the whole stage or product passed.) |
| `fail` / `failed` | (This executed check did not meet its stated condition.) |
| `matched` | (Observed behavior agrees with the cited authoritative expectation for this check.) |
| `mismatch` | (Observed behavior differs from that expectation; record evidence and a finding.) |
| `not-checked` / `not-run` | (No verification result was obtained for this item; absence of a failure is not success.) |
| `not-applicable` | (The item is outside this check's applicability, with an explicit reason; it was not verified.) |
| `open` | (The issue or decision remains unresolved.) |
| `resolved` | (The named issue is recorded as resolved; inspect closure evidence, not just the label.) |
| `verified-closed` | (A recorded check demonstrated the remark's closure criterion; final owner approval remains separate.) |

The governed Stage 7 Low-cosmetic exception is a findings-based closing pass,
not `clean`, even when the owner approves deferral. Preserve historical verdicts;
this definition does not relabel or newly approve old reports.

## Decisions And Architecture

| Literal | Plain meaning and boundary |
|---|---|
| `draft` / `Draft` / `Architect draft` | (An authored proposal, not an approved baseline.) |
| `proposed` / `provisional` | (A proposal awaiting the required decision; the agent has not supplied human approval.) |
| `controlled` | (The architecture's control state is recorded; cite the actual review. The label alone is not owner approval.) |
| `approved` / `Approved` / `owner-approved` | (The named authority approved the exact stated scope/version, not every later edit or the whole migration.) |
| `accepted` in an ADR | (The decision was adopted through the governing review; not evidence that implementation is complete.) |
| `superseded by ADR-NNN` | (A newer linked decision replaces this one; the old ADR remains history.) |
| `remarks` / `returned` / `changes required` | (Corrections or decisions are required before the affected scope can proceed.) |
| `rejected` | (The option or scope was not approved; this does not silently choose a replacement.) |
| `selected` | (The recorded option was chosen by the named decision maker for the stated baseline.) |
| `deferred` / `defer` | (Work or a decision was postponed with authority, responsibility and a deadline/trigger; it is not completed.) |
| `keep` | (Preserve the identified behavior, subject to the recorded owner's authority and conditions.) |
| `change` | (Use the explicitly approved target change, not an invented replacement.) |
| `do-not-port` | (Do not migrate the named legacy behavior/channel under the recorded decision; related user needs may still remain.) |
| `Not discussed` / `Unknown` | (No discussion or sufficient knowledge is recorded; the agent must not infer approval or capability.) |
| `Closed = Yes` | (The workbook's computed closure conditions are met; a Status label alone cannot establish this.) |
| `Closed = No` | (At least one required closure condition remains unmet.) |
| `architecture-current-roadmap-pending` | (XPlanner's historical review does not record the roadmap/current-slice decision and required team assessment as complete; it is not full Stage 9 closure.) |
| `approved-for-delivery` | (Read the explicit permission boundary. In XPlanner's NFR review this permits only foundation slices 001 and 002, not feature implementation or full Stage 9 closure.) |

The last two labels describe that particular historical record, not newly
introduced generic verdict values. They must not be copied as default approvals.

## Stage And Slice State

| Literal | Plain meaning and boundary |
|---|---|
| `not_started` | (The stage or slice has not started.) |
| `in_progress` | (The named work is underway, not complete.) |
| `awaiting_review` | (The stage is waiting for its required review.) |
| `awaiting_owner` | (The stage is waiting for an explicit human owner decision.) |
| `complete` | (The named stage has its required completion evidence; not automatically the whole migration.) |
| `unratified` | (The owner has not ratified the project constitution.) |
| `ratified` | (The owner ratified the constitution; Stage 1 authorization is a separate decision.) |
| `planning` | (The slice is being specified and planned.) |
| `approved` in slice status | (The slice has its required approval to proceed; it is not yet deployed or accepted.) |
| `deployed` / historical `Delivered` | (The named release reached the stated environment; live verification and acceptance are separate.) |
| `accepted` in slice status | (The named slice was accepted under its required evidence and owner decision; not unrelated slices.) |

## Observation, Planning And Coverage

| Literal | Plain meaning and boundary |
|---|---|
| `live-verified` | (The declared legacy walkthrough scope was verified live; inspect roles, channels and evidence.) |
| `partial-simulated` | (Some declared scope uses simulation rather than live legacy evidence; required owner authorization and limits remain explicit.) |
| `blocked-waived` | (Live verification is blocked and an authorized exception covers the exact scope; the missing check did not pass.) |
| `reached` | (The surface responded; behavior matching was not established by reachability alone.) |
| `observed` | (The record contains an actual observation for the named behavior, not an exhaustive claim about all rows.) |
| `unverified` | (The behavior has not been established by sufficient evidence.) |
| `ready for control` | (The authored knowledge package is offered for Stage 14 review; Stage 14 has not thereby passed.) |
| `authored` | (The design record was written; implementation, execution and independent approval are not implied.) |
| `assumptions-recorded` | (Assumptions were documented for review; the owner has not necessarily approved them.) |
| `implemented` | (The artifact records code or surface implementation; inspect its evidence and separate verification/acceptance.) |
| `gap` | (The inventory identifies missing required coverage or evidence.) |
| `planned-before-implementation` | (A proposed surface inventory, not evidence of implemented routes.) |
| `transferred-to-target-inventory` | (Planning entries were moved into the target inventory; the transfer alone proves no behavior.) |
| `Passed` in parity epic summary | (The workbook's aggregate completion conditions are met; this is not one executed test's result.) |
| `Not Passed - Open` | (The workbook's aggregate still has required unfinished work.) |
| `Not Passed - Deferred` | (The workbook's aggregate contains explicitly deferred work, not completed work.) |

## Raw Evidence And Historical Vocabulary

Raw observation labels describe responses, not approval:
`redirect-to-login` (redirected to sign-in), `login-form` (sign-in form returned),
`redirect` (HTTP redirect), `rendered` (a page rendered),
`not-found` / `http-404` (resource not found), `http-401` (authentication required),
`http-400` (request rejected as bad), `http-500` / `server-error` (server failure),
`application-error-page` (application error page returned),
`non-html-body` (response was not HTML), `text-body` (text response),
`not-an-image` (response was not the expected image), `soap-result` (SOAP response).
An expected denial may be a successful authorization check; a rendered page can
still contain incorrect behavior. Read each observation against its expectation.

Generated test `expected` means the runner classified the outcome as expected;
it is not a process approval and may include tests intended to fail. Environment
identity `identical` means the recorded comparison matched its declared identity
fields, not that all behavior was tested.

Historical `clean-after-disposition` (the reviewer reported cleanliness after
addressing findings) and `ready-with-minor-fixes` (the reviewer still named minor
corrections) are record-specific narratives, not extra canonical clean-pass enum
values. Read the linked dispositions and later governing review before proceeding.

## Where To Read The Explanation

- Markdown reports and templates: beside the first verdict or as a nearby table legend.
- NFR and parity workbooks: in their instructions and the associated owner/review record.
- Manifests and inventories: in the domain README and linked record; a hash proves identity, not correctness.
- YAML process state: this guide and the exact evidence referenced by the status record.
- ADRs, architecture sections, OKF concepts and SDD: distinguish a proposal, accepted decision, authored coverage and executed verification.
- Wireframes, diagrams and exported evidence: use the companion manifest, review and domain guide; do not change export bytes for a label explanation.

The author preserves dates, attribution and original findings. The reader must
not infer today's project state from a historical example.

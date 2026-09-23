# Legacy Architecture Discovery Instructions

`Legacy Discovery` is the first gate inside Stage 9. It records architecture-
significant facts about the current system before an agent proposes target NFRs,
technologies, ADRs, or diagrams.

Use the `Legacy Discovery` worksheet in
[`templates/architecture-nfr-decision-register-template.xlsx`](templates/architecture-nfr-decision-register-template.xlsx).
The initialized project copy is
`analysis/architecture/architecture-nfr-decision-register.xlsx`. Do not create a second
legacy-NFR workbook or replace the worksheet with chat notes.

## What Belongs Here

Include only legacy concerns that can change a target architecture decision. The
starter rows cover transactions, session state, authentication, authorization,
tenancy, sensitive data, integrations and their consumers, jobs/workers,
operations, security operations, backup/restore, files, provider failures,
customizations, localization, time semantics, and messaging.

Do not force target-only questions such as future capacity, cloud region,
accessibility, browser support, target CI, or target framework selection into
legacy discovery when the old system cannot answer them. Those questions belong
in `NFR Register` and remain owner decisions.

Stop discovery at the architecture boundary. Record enough evidence to decide
system boundaries, data ownership, trust, integrations, background execution,
deployment and scale. Do not block the high-level system diagram on exact feature
mechanics that can be recovered safely while preparing that downstream feature specification. For
example, discover that files require durable object storage now; defer exact size,
type, malware-scanning and retention rules to the downstream file-management specification unless one
of them changes the selected storage or security boundary.

## Evidence Lanes

Each row declares which lanes are mandatory, desirable, or not required:

1. **Code review** - legacy source, configuration, schemas, scripts and packaged
   runtime assets. Cite paths and line ranges or stable artifact identifiers.
2. **Live walkthrough** - observed screens, actions, role behavior, jobs,
   operational endpoints and failure states. Cite the walkthrough record and
   exact route/action.
3. **Client interview** - production use, external consumers, operational
   ownership, infrastructure outside the repository, compliance and business
   expectations. Cite a durable meeting or owner-decision record.

The lanes are executed in that order, not merely displayed as three parallel
columns. Before asking the owner or client a discovery question, the agent must:

1. exhaust the relevant source, configuration, schema, scripts and packaged
   runtime evidence;
2. exercise the behavior on the governed legacy demo when a live observation is
   relevant and available, or record why the lane is not applicable/unavailable;
3. consolidate what those two lanes prove and formulate only the remaining
   business or production unknown as a narrow question with evidence-backed
   options and impact.

The owner or client confirms business usage and external facts; they are not
asked to discover facts that the repository or runnable system can answer. An
owner answer also cannot silently replace a mandatory code or live lane.

Absence in one lane is not proof of absence. Consolidate the lanes in `Current
legacy behavior`, retain contradictions and unknowns explicitly, and link each
completed row to durable evidence.

## Residual Client Questionnaire

After code/config and the relevant governed live check are exhausted, project
every row whose remaining mandatory lane is client-dependent into the `Client
Questionnaire` worksheet of the same workbook. Do not create a separate survey
document and do not send the client the full technical register as an unstructured
question list.

One questionnaire row maps to exactly one stable `LD-NNN` row and records:

1. the code/live facts already proved;
2. one narrow residual production or business question;
3. why the answer can change target scope or architecture;
4. a conservative proposed fallback when no answer is available;
5. the canonical client answer, respondent and accountable role, answer date and
   durable evidence;
6. the resulting NFR, ADR, migration, security or functional-scope disposition,
   including whether it shapes the system diagram, only the architecture record,
   or a later downstream feature specification;
7. one controlled status: `Open`, `Answered`, `Owner-deferred` or
   `Not applicable`.

The answer fields in `Client Questionnaire` are the canonical client lane. A chat
message, meeting impression or agent paraphrase does not close a row. After an
answer, the orchestrator copies the exact supported conclusion into `Legacy
Discovery`, updates its unknowns/status, and then performs a legacy-to-target impact
pass. Each resolved answer must either update a linked target NFR/ADR/migration or
security obligation, explicitly change functional scope, or record why no target
change is required. `Owner-deferred` requires the owner, reason, residual risk
and re-review trigger; it is not equivalent to `Answered`.

## Live-Walkthrough Fallback

When a required live check is unavailable, stop and ask the owner to choose one
of the governed Stage 3 fallback modes:

- simulate the relevant behavior and label it simulated;
- skip the live lane through an exact owner waiver with scope, reason, residual
  risk and re-review trigger.

Set `Verification status` to `Skipped by owner` only when that decision exists.
A waiver permits progress but never turns unobserved behavior into verified live
evidence. Record the waiver path in `Evidence links` and the limitation in
`Unknowns / risks`.

## Row Completion

A discovery row is `Completed` only when:

- every mandatory evidence lane has evidence or an exact owner-approved fallback;
- code, live and client findings are consolidated without hiding conflicts;
- `Current legacy behavior` describes the factual current state, not a target
  proposal;
- unknowns and residual risks are explicit;
- evidence links are durable and reviewable;
- `Linked NFR` identifies the target question that consumes the finding;
- an independent reviewer has checked the evidence and consolidation.

The sheet is complete only when every required row is complete or has an exact
owner disposition. The agent then uses these facts as inputs to `NFR Register`.
It must not copy a legacy mechanism into the target automatically: parity defines
the behavior to preserve, while the owner and architect decide the target
mechanism.

## Required Order

The workbook order is normative:

1. `Overview`;
2. `Legacy Discovery`;
3. `NFR Register`;
4. `Reference Data`;
5. `Team Capability`;
6. `Technology Stack`;
7. `Integration Contracts` when integrations are in scope;
8. `Client Questionnaire`;
9. `System Diagram Gate`.

This makes the reasoning sequence visible: discover legacy facts, decide target
NFRs, inventory available capability, select technologies, and finally confirm
that the high-level system can be drawn while named feature details remain in the
downstream delivery backlog.

## Handoff

Before target NFR questioning begins:

1. reconcile the discovery summary with its rows;
2. preserve all open unknowns as explicit NFR questions, risks, or owner
   decisions;
3. reconcile every client-dependent discovery row with exactly one questionnaire
   row and disposition every required answer or deferral;
4. run the legacy-to-target impact pass and link relevant `NFR Register` rows,
   ADRs and scope decisions back to discovery IDs/evidence;
5. populate `System Diagram Gate`; move non-shaping feature mechanics to its
   named downstream delivery backlog rather than keeping the system diagram blocked;
6. run `npm --prefix analysis/tools run audit:architecture`;
7. include the exact workbook hash in `architecture-nfr-owner-review.md` and later in the
   architecture manifest.

Any later discovery finding that changes an accepted architecture driver reopens
Stage 9 and invalidates downstream architecture control for the affected scope.

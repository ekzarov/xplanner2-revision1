# NFR Decision Register Instructions

**Reading technical statuses.** `Architect draft` (agent proposal), `Not discussed` (no owner discussion recorded), and `Approved` (the stated decision was approved) do not replace `Closed = Yes` (the computed closure conditions are met). Keep workbook dropdowns and formulas unchanged; explain labels in these instructions and the owner-review record. [Status meanings](../artifact-status-meanings.md).

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>architecture-nfr-decision-register.xlsx</summary>

**What did we learn and decide?**

The working workbook that turns legacy facts and client answers into architecture requirements. Its sheets connect discovery evidence, unanswered questions, measurable NFRs, integrations, team capability, technology choices and the decisions required before the system diagram is accepted.

- **Created by:** The Stage 9 architecture agent instantiates the workbook and records evidence, questions and proposed NFR decisions.
- **Maintained / decided by:** The architecture agent maintains rows and traceability; the human owner supplies or approves business targets and decisions.
- **Instructions:** Stage 9 and NFR workbook instructions

**When used:** Stage 9 uses the workbook to turn legacy facts and client answers into measurable NFRs, integration contracts and technology decisions.

**Example:** The client confirms 50 concurrent users, which becomes a measurable capacity requirement and informs the deployment decision.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

The workbook has two distinct horizons. `System Diagram Gate` closes only the
questions that determine the high-level system shape. The full Stage 9 gate then
closes the architecture record, technology, capability and traceability needed
for independent control.

Dependency direction is one-way: downstream delivery specifications cite the
approved architecture section, ADR and NFR identifiers they implement. The
architecture record never cites a delivery-specification identifier, [`specs/`](../../specs)
path, Stage 15 record, or implementation chronology.

Classify each unresolved concern as one of:

- **System-diagram shaping** — changes an application/container boundary, trust
  boundary, data store, external integration, worker, deployment node, scaling
  model, or material technology.
- **Architecture-record detail** — an important cross-cutting rule or measurable
  NFR that belongs in `architecture.md`/ADR but need not clutter the system view.
- **Downstream feature detail** — endpoint and field rules, role-action details, exact
  schedules/retries, file constraints, UI states, and operational steps owned by
  the feature that will implement them.

Example: the diagram must show a durable file-storage boundary. Exact file size,
allowed formats, malware scanning, retention and download behavior belong to the
downstream file-management specification unless they change that boundary.

The NFR decision register is the mandatory workbook of Stage 9. Its `Legacy
Discovery` worksheet first establishes architecture-significant facts about the
old system; only then does `NFR Register` turn target questions into explicit,
measurable, attributable owner decisions before diagrams, ADRs, or downstream specifications are
treated as an approved baseline.

Start from
[`templates/architecture-nfr-decision-register-template.xlsx`](templates/architecture-nfr-decision-register-template.xlsx)
and save the project copy as `analysis/architecture/architecture-nfr-decision-register.xlsx`.
Do not replace the workbook with chat notes or a prose summary. Do not create a
parallel Stage 9 technology-input document such as `owner-inputs.md`: the
workbook is the single owner-editable source for both NFR decisions and the
selected technology baseline.

Complete `Legacy Discovery` according to
[`architecture-legacy-discovery-instructions.md`](architecture-legacy-discovery-instructions.md) before
answering target NFR rows. Required code, live, and client evidence must remain
distinguishable. A required live lane may be skipped only through an exact owner
fallback; the row remains explicitly unverified live.

Use `Client Questionnaire` for the narrow production/business facts that remain
after code and live evidence are exhausted. It is keyed by `LD-NNN` and is the
canonical client-answer lane, not a second discovery register. An answer closes
nothing until respondent/authority, date, durable evidence, controlled status and
target impact are recorded and the corresponding `Legacy Discovery` row is
synchronized. The questionnaire summary on `Overview` must reconcile with its detail.

The `Reference Data` worksheet is the normative human-readable legend for every
controlled dropdown value used by the NFR and technology sheets. It explains
grades, decision bases, accountable roles, statuses, proposer provenance, and
the exact closure rules. Do not add an ad-hoc value to a governed column: update
the legend, its description, and the corresponding data-validation range first.
In particular, a row status is an input state, while closure is the computed
result of satisfying the required decision, authority, approval, evidence, ADR,
and trigger fields.

## Workbook Map And Construction Order

The `Overview` worksheet is the front door to the workbook. In addition to the
formula-driven progress summaries, it contains a **worksheet navigator** with
one row for every actual worksheet, its purpose, and when the owner or agent
uses it. Adding, renaming, reordering, or removing a worksheet requires updating
this navigator in the same change. A new project must not depend on chat history
to discover what a worksheet means.

Build and use the workbook in this logical order:

1. `Overview` — progress, current gate, and workbook navigation;
2. `Legacy Discovery` — current-state facts and separated evidence lanes;
3. `NFR Register` — target NFR and architecture decisions;
4. `System Diagram Gate` — the minimum decisions needed for the high-level view;
5. `Team Capability` — factual delivery capability before stack selection;
6. `Technology Stack` — selected, rejected, or deferred material technologies;
7. `Integration Contracts` — known inbound/outbound contracts and consumers;
8. `Client Questionnaire` — residual client facts that evidence cannot prove;
9. `Reference Data` — controlled values and closure rules.

Physical worksheet order **must match the navigator exactly**. The navigator's
first column is `Priority` and contains the uninterrupted sequence `1..N` in
that same order. Adding, renaming, reordering, or removing a worksheet updates
both the physical tab order and the navigator in the same change. The navigator
must list every real worksheet exactly once; a mismatched order, duplicate
priority, stale, missing, or invented worksheet name fails the architecture
audit.

## Inputs

Build the target register from the completed `Legacy Discovery` sheet, governed parity map, Stage 4 owner decisions, the
approved application form and wireframes, legacy runtime observations or
waivers, deployment constraints, integration evidence, and direct owner
answers. The agent may propose a value, but it must label assumptions honestly
and must not invent a client decision.

## One Row, One Architecture Driver

Use one row for one decision-driving concern. Merge duplicates, but do not
merge concerns that can produce different architecture choices. Every row must
state:

1. grade and stable ID;
2. category and criterion;
3. the question to be answered;
4. what the answer affects;
5. a measurable value or explicit decision;
6. decision basis and rationale;
7. one accountable decision authority, required consultees, and the person who
   approved it;
8. approval date and status;
9. expiry for a temporary assumption;
10. durable evidence and a separate decision-record/ADR reference;
11. closure condition and re-review trigger;
12. criterion source, the human or agent that proposed it, and the exact review,
    meeting record, or report where the proposal originated.

Decision basis explains why the decision exists, for example: legacy parity,
target-only business requirement, owner-approved target baseline, architecture
decision, external-architect input, regulatory or operational constraint,
evidence-backed inference, temporary assumption, platform constraint, or deferred
trigger. `Joint decision` is not an authority. Collaboration is recorded through
required consultees, while one role remains accountable for the final decision.

`Proposed by` records authorship, not authority. For an agent proposal, record the
agent family (`Codex`, `Claude`, `Gemini`, or another named reviewer) and link the
durable report or pass. An agent name without a report is insufficient provenance.
`Evidence` contains facts that support the answer (legacy code, database query,
runtime observation, standard, workbook row, or review report). `Decision record /
ADR` points to the governed place where the accepted choice and consequences are
specified. Do not mix these three concepts in one free-form cell.

## Mandatory Architecture Drivers

The register must explicitly decide every concern that can change the application
shape. At minimum, inspect and either record or explicitly mark not applicable:

- workload, latency, availability, recovery, data volume and retention;
- identity, exact legacy role/permission parity, tenancy and data isolation;
- browser/server session ownership, stateless/stateful boundaries, shared keys,
  sticky-session policy and horizontal scale-out;
- every active scheduled job, worker, queue consumer and external side effect,
  including evidence-backed `do-not-port` decisions;
- client distribution model: one build for all clients, tenant configuration,
  entitlements, feature flags, or separately versioned variants;
- deployment environments, runtime configuration, migration, rollback and
  operational ownership;
- localization, accessibility, observability, engineering quality, tests and
  production-readiness triggers.

## Team Capability Worksheet

Complete the current-company inventory in the dedicated `Team Capability`
worksheet **before** selecting the technology baseline. Record named people or
teams, technologies used in production, evidence, proficiency, available FTE and
bus factor. Unknown capability must stay `Unknown`; an agent must not infer
competence from a job title or from the desired stack.

After the NFR constraints are understood and candidate technologies are selected,
map every material technology to a required capability and target level. For each
gap, record one delivery response: use the current team, training, hiring, partner,
managed service, reassignment, or scoped deferral with a trigger. A familiar stack
is a delivery-risk and cost input, not a hidden architectural requirement: the
capability inventory may influence the trade-off, but it must not override parity,
security, compliance, or measurable NFRs without an explicit owner decision.

The worksheet is physically immediately before `Technology Stack`. This makes the
Stage 9 order visible in the workbook itself: capability inventory first,
technology selection second, gap plan third.

## Technology Stack Worksheet

Use the dedicated `Technology Stack` worksheet for every material technology
or platform choice. One row represents one independently reviewable choice,
not a shopping list. Record:

1. stable `TECH-NNN` ID and A/B/C priority;
2. category and architecture decision being made;
3. selected technology or approach and its supported version/baseline;
4. purpose and explicit boundary of use;
5. status, decision type, rationale, and rejected/deferred alternatives;
6. deciding role, human approver, and approval date;
7. ADR or other evidence, re-review trigger, and operational notes.

Technology rows use the same separation as NFR rows: evidence, ADR/architecture
reference, accountable decision authority, consultees, approver, proposer and exact
proposal/review reference are distinct fields. Every `TECH-NNN` row must link to the
`architecture.md` section and ADR that consume it, or to an explicit deferral.

Grade A technology rows are mandatory. They may close only as `Approved` or as
an explicitly owner-approved deferral with residual risk and trigger. The
worksheet summary must show zero open Grade A technology decisions. Generic
labels such as "cloud", "database", or "modern framework" are not decisions;
the row must name the actual baseline or state exactly what remains deferred.
Changes to a technology row follow the same staleness rules as NFR changes.

## Grades

- **Grade A — mandatory:** architecture cannot leave Stage 9 until every row is
  discussed with the owner and approved, or replaced by an explicit scoped
  owner decision that records the residual risk.
  Only concerns capable of changing the high-level system shape block `System
  Diagram Gate`; feature mechanics remain Grade A for their downstream specification when required,
  not for the diagram.
- **Grade B — desirable:** a temporary assumption may unblock Stage 9 only when
  its owner, expiry, evidence, closure condition, and re-review trigger are
  recorded. It must be resolved before production when its trigger applies.
- **Grade C — optional/future:** record the trigger and reason for deferral. Do
  not implement it prematurely and do not silently treat it as approved scope.

## Grade-Driven Iterative Architecture

Grade expresses decision criticality; architecture area expresses decomposition.
Do not confuse them. Grade A contains decisions that must be resolved before the
first checkpoint or slice that depends on them. Grade B and C remain visible
backlog with assumptions and reopening triggers.

Every `NFR Register` row must fill `Architecture Area`, `First Dependent Slice`,
and `Where to refine and verify again`. Architecture area maps the row
to the main ADR and one file under `analysis/architecture/sections/`. First
dependent slice states when an unresolved decision becomes blocking. The recheck
point names the next evidence. These fields decompose and route work; they do not
create a parallel approval hierarchy.

The `Foundation` area is reserved for application shape, primary persistence,
transaction ownership, packaging/deployment, channel boundary, and executable
engineering gates whose replacement would substantially rewrite delivered code.
Other areas close incrementally before their first dependent slice.

Stages 9-12 establish the smallest architecture baseline needed for the next
implementation slice. After each implemented slice, compare code, tests and the
running system with the architecture. If evidence changes a decision, update the
affected Grade row, ADR and Draw.io page, then repeat Stages 9-12 for that bounded
change. The owner then selects the next slice. A feature may enter downstream delivery design only when
all Grade A decisions required by that slice are closed for the exact hashes.

The cycle remains active after implementation begins. Any Stage 15-19 finding
must be classified before files are changed: implementation-only, delivery specification,
architecture, or parity-map. An architecture finding reopens the affected Grade
rows, records the trigger, and returns that bounded scope to Stage 9. It then repeats independent Stage 10,
owner Stage 11, remark closure Stage 12, and knowledge refresh/control Stages
13-14. The affected feature then updates its downstream delivery specification at Stage 15, receives a fresh
Stage 16 control, resumes implementation at Stage 17, and repeats delivery and
acceptance at Stages 18-19. An implementation-only defect returns directly to
Stage 17; a delivery-specification-only defect repeats Stages 15-19; a parity-map defect returns
to Stage 1 and repeats every downstream gate invalidated by the correction. Do
not patch an architecture contradiction only in code or in one feature
specification. Refreshed hashes pin the synchronized artifact versions but do
not replace any required review or owner gate.

## Integration Contracts Worksheet

Use `Integration Contracts` for every architecture-significant inbound or
outbound contract found in code, configuration, live behavior, or client
confirmation. One row represents one independently versioned contract and
records channel, direction, format, authentication, evidence lanes, known
consumer, owners, version, volume/criticality, compatibility constraint and
confirmation status. Do not merge SMTP, calendar, SOAP, REST, file exchange, or
queue contracts merely because one module invokes them.

Code and live evidence prove that a contract exists; only an authoritative
client answer proves which production consumer depends on it. Unknown consumers
remain visible and are linked to `Client Questionnaire`. A contract may be
deferred to a downstream integration specification only when its system boundary, trust boundary,
delivery guarantee and compatibility obligation are already sufficient for the
current slice. Otherwise it blocks that slice's Grade A gate.

## Human Walkthrough Gate

The owner and agent walk Grade A row by row. The agent explains the options and
impact; the owner confirms or changes the decision. A bulk statement such as
"looks fine" is not enough.

The walkthrough also confirms that `System Diagram Gate` is green and that every
deferred feature mechanic has a named downstream delivery backlog destination. Once that gate is
ready, the high-level Draw.io system diagram may be drafted; formal Stage 9 exit
still requires the complete architecture register and audits.

## System Diagram Gate

The sheet is a compact go/no-go view, not a second source of truth. Each row links
back to governed NFR, technology, discovery, questionnaire or owner-decision IDs.
It covers system boundaries, identity/trust, tenant isolation, data stores,
integrations, background work, deployment, scale/state, localization boundary,
and material technology. A green gate means the system can be drawn honestly; it
does not claim every later delivery question has been answered.

Before the walkthrough closes:

- every required `Legacy Discovery` row is complete or carries an exact
  owner disposition, evidence path, residual risk and linked target NFR;
- every client-dependent legacy row has exactly one `Client Questionnaire` row;
  no required question remains `Open`, and every answer or owner deferral has a
  respondent, date, evidence and explicit NFR/ADR/migration/security/scope impact;
- all Grade A rows have a measurable decision, decision basis, rationale,
  accountable authority, consultees, approver, date, evidence, decision record,
  proposer provenance, closure condition, and re-review trigger;
- no Grade A row remains `Architect draft`, `Not discussed`, blank, or hidden
  behind an unlabeled assumption;
- every Grade A row has `Closed = Yes`; status text alone does not close a row
  when authority, approver, date, evidence, ADR, or a deferral trigger is missing;
- the `Technology Stack` worksheet contains every material stack/platform
  choice, has zero open Grade A rows, and has no duplicate source in prose;
- the `Team Capability` worksheet records the current inventory before stack
  selection, maps every material selected technology to a required capability,
  and gives every confirmed gap an owner, response and due date;
- every row has explicit provenance and no agent is presented as the human
  decision authority;
- role parity has an evidence-backed role/permission matrix and Draw.io view when
  authorization affects the target;
- jobs/workers have an evidence-backed inventory and one target mechanism per
  behavior;
- session state/scale-out and client distribution/customization are explicit owner
  decisions rather than assumptions embedded only in prose;
- the `Overview` totals reconcile with the detailed rows;
- the `Overview` worksheet lists every workbook worksheet with a current purpose,
  its `Priority` values are the uninterrupted sequence `1..N`, and navigator
  order exactly matches the physical worksheet-tab order;
- every NFR row names its architecture area, first dependent slice, and the
  point where it will be reconsidered using implementation or runtime evidence;
- approved rows are visibly distinguishable from work in progress;
- the workbook opens without repair warnings and its filters, frozen panes,
  formulas, data validation, and progress presentation remain usable.

### Mandatory post-edit workbook reconciliation

Every change to the workbook, whether made by an agent, script, or person, must
end with a separate consistency pass before the file is pinned, reviewed, or
committed. The editor must not assume that changing a cell value also updated
its formatting, formula, chart, validation, or derived summary.

For every affected worksheet:

1. compare the displayed value with its semantic formatting and legend;
2. verify that `Closed = Yes` is green (`#C6E0B4`) and `Closed = No` is red
   (`#F4CCCC`), with no contradictory value/color pair;
3. recalculate and reconcile formulas, totals, progress bars, charts, mirrors,
   and cross-sheet summaries against the detailed rows;
4. confirm that filters, frozen panes, data validation, column widths, wrapping,
   and conditional formatting still cover the intended range;
5. open the saved workbook in Microsoft Excel without a repair warning and
   visually inspect each affected sheet at a readable zoom;
6. run `npm --prefix analysis/tools run audit:architecture` and resolve every
   workbook-related failure before recording a new SHA-256.

The automated audit enforces the unambiguous `Closed` color contract. The
editor remains responsible for the broader visual inspection because charts,
layout, and other semantic colors cannot all be inferred safely from cell text.

Record the walkthrough in `analysis/architecture/architecture-nfr-owner-review.md` using
[`templates/architecture-nfr-owner-review-template.md`](templates/architecture-nfr-owner-review-template.md).
It pins the exact workbook SHA-256, Grade A totals, the computed Grade A closed
count, and technology decision totals. The review is stale as soon as the
workbook changes. Values changed in Excel remain proposals until the owner walks
those changes and the review pins the new hash; agents must not treat presence in
the workbook as approval. Keep one current review file. Append a dated `Owner
amendment` for each repeated walkthrough so a reader can see the delta and owner
decision without opening Git; Git remains the complete version history. After
reapproval, update the review hash and verdict and repin `architecture-nfr-manifest.json`
without deleting earlier decisions.

## Owner Review Reading Order

The Stage 9 agent writes the owner review as a decision receipt, not a second
workbook or a wall of counters. The first visible section is Decision Summary:
what exact scope was reviewed, what the owner approved, what remains open,
whether Stage 9 is closed, which work is permitted next, and what the owner
must decide next.

Permitted Next Work separates a narrowly authorized slice from overall
readiness. Recorded Owner Decisions links stable workbook IDs and durable
owner records; Open And Deferred Items separates pending decisions, accepted
deferrals, unverified facts and unapplied decisions. Required Owner Actions
names concrete questions, not a vague request to review everything.

The overall Verdict and any limited Foundation Verdict must explain their
different scopes in plain language. Detailed workbook identity, counts and
history may be collapsed after the decision sections, but their canonical
field labels and values remain available to audits.

Only an actual subsequent owner decision belongs in Owner Amendments.
Translation, formatting and instruction updates belong in Editorial Changes.
A readability edit does not supply new owner approval or justify refreshing
dates, counts or workbook hashes. If the report is already manifest-pinned,
the agent preserves the original evidence reference and clearly marks the
revised bytes as requiring exact-set revalidation; old review verdicts and
manifests are not silently rewritten to make the new file look approved.

## Exit Rule

Stage 9 may hand work to Stage 10 only when:

1. the exact workbook and owner review are pinned in `architecture-nfr-manifest.json`;
2. all Grade A NFR and technology rows required by the exact current slice are
   approved or explicitly deferred by the owner with a trigger; unrelated future
   decisions remain visible and cannot be consumed early;
3. every required team capability is assessed and every gap has an agreed delivery plan;
4. every NFR row names its architecture area, first dependent slice, and
   recheck point; the current slice's Grade A gate is closed, while open Grade
   B/C items remain visible backlog;
5. every architecture-driving register or technology row is represented by an NFR, ADR,
   constraint, risk, or explicit deferral in the architecture record;
6. `architecture.drawio` visualizes the same accepted decisions and links its role,
   worker/job, deployment and scale-out views back to the normative record; a diagram
   must not create a decision absent from the workbook/ADR set;
7. `npm --prefix analysis/tools run audit:architecture` reports
   `ARCHITECTURE AUDIT OK`.

Changes to a Grade A answer reopen Stage 9 and invalidate downstream
architecture approval until the register, architecture set, independent Stage
10 control, and owner gates are repeated for the affected decision scope. The
blast radius follows actual dependencies, not a parallel layer label.

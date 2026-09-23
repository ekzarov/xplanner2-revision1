<!-- Sync impact: 0.2.1-draft -> 0.2.2-draft (editorial clarification, no changed
obligations). Principles express domain safeguards without stage numbers, packet
phase names, artifact filenames or a tool vendor. I, V and VI have clearer titles;
their legacy anchors and all fourteen identities remain. Process bindings live
outside Core Principles and in the shared implementation map. Existing templates
and checks remain applicable. Identity and ratification slots intentionally remain
unfilled in this unratified starter template. -->
# Legacy Modernization Project Constitution

**Which rules must every agent and stage obey, and which decisions belong only to the owner?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Neither project ratification nor separate authorization to begin governed work has been recorded in this template.
>
> **Next:** The initializer creates the draft; the Bootstrap agent records the owner decisions without inferring approval.
>
> **Details:** [Bootstrap Decision Record](#read-bootstrap-decision-record) / [Ratification Checklist](#read-ratification-checklist).

<details>
<summary><strong>Contents</strong></summary>

- [Core Principles](#read-core-principles)
  - [I. Authority Before Action](#read-i-authority-before-action)
  - [II. Preserve an Honest Legacy Baseline](#read-ii-preserve-an-honest-legacy-baseline)
  - [III. Evidence Before Requirements](#read-iii-evidence-before-requirements)
  - [IV. Explicit Parity and Modernization Decisions](#read-iv-explicit-parity-and-modernization-decisions)
  - [V. Approved Experience, Architecture And Knowledge](#read-v-approved-experience-architecture-and-knowledge)
  - [VI. Requirements, Design And Evidence Stay In Lockstep](#read-vi-requirements-design-and-evidence-stay-in-lockstep)
  - [VII. Incremental, Vertically Verifiable Delivery](#read-vii-incremental-vertically-verifiable-delivery)
  - [VIII. Main-Stable, Reviewable Change Control](#read-viii-main-stable-reviewable-change-control)
  - [IX. Explicit Data Change Control](#read-ix-explicit-data-change-control)
  - [X. Automated Verification at the Lowest Useful Level](#read-x-automated-verification-at-the-lowest-useful-level)
  - [XI. Security Improves on Legacy](#read-xi-security-improves-on-legacy)
  - [XII. Auditable Independent Reviews](#read-xii-auditable-independent-reviews)
  - [XIII. Every Shipped Surface Must Be Useful](#read-xiii-every-shipped-surface-must-be-useful)
  - [XIV. Durable Handoffs and Honest Completion](#read-xiv-durable-handoffs-and-honest-completion)
- [Required Repository Contracts](#read-required-repository-contracts)
- [Ratification Checklist](#read-ratification-checklist)
- [Bootstrap Decision Record](#read-bootstrap-decision-record)
- [Governance](#read-governance)

</details>
<!-- ARTIFACT_READING_END -->

> **Starter state:** TEMPLATE - NOT RATIFIED
> **Project:** `XPlanner 2 Revision 1`
> **Owner:** `ekzarov`
> **Version:** `0.2.2-draft`
> **Ratified:** pending owner decision
> **Last amended:** not applicable

This constitution governs the whole modernization project. Its principles remain
applicable if the workflow is reorganized or renumbered. They define obligations
and authority, not an execution sequence. The process entry point determines
when agents read it; no agent may act without the applicable governing rules.

The initializer creates this project-specific draft. The Bootstrap agent records
the human owner's actual ratification and initial work authorization as separate
decisions. The agent updates the first-screen summary from those decisions, using
the [artifact reading contract](../../analysis/artifact-reading-contract.md);
an unfilled template never displays an approved result.

This starter copy is an unratified template. Its principles are minimum
bootstrap safeguards, but no agent may infer project approval from their
presence. Before any governed migration stage begins, the Bootstrap agent fills
the identity values and records the owner's explicit decisions on amendments,
stable version and ratification in this file and [`analysis/migration_status.yaml`](../../analysis/migration_status.yaml).
The owner reviews and decides; the agent writes the record, never the approval.

When a ratified constitution conflicts with another repository document, the
constitution has precedence. Before ratification, ambiguity or conflict is
resolved by stopping and asking the owner.

**Boundary:** this constitution owns project invariants, decision authority,
ratification and amendments. It is not a second execution manual. The
[document ownership contract](../../analysis/process-contract.md#document-ownership)
separates these rules from session routing, shared stage boundaries and detailed
procedures. Reading a document first does not give it higher authority. References
and project-record fields below the principles bind these rules to the current
process; they do not make its numbering part of a constitutional principle.

<a id="read-core-principles"></a>

## Core Principles

<a id="read-i-constitution-first-stage-controlled-approval-gated" data-legacy-anchor="true"></a>

<a id="read-i-authority-before-action"></a>

### I. Authority Before Action

Every agent MUST establish the applicable authority, current authorized scope
and governing instructions before acting. Reading an input never authorizes
changing it or advancing the process. Procedure determines how this context is
loaded; the constitutional obligation does not depend on a reading-list position.

Blind reviewers MUST save independent observations before receiving prior
conclusions. They initially receive only permitted scope and expectation context,
not prior outcomes. The coordinator validates full status first; full records are
released to the reviewer only after initial observations are saved. The reviewer
cannot authorize a transition from an extract. Other agents read full status.

Without status or ratification, only explicitly permitted project setup may run.
Empty setup records are not evidence of completed work.

Governed work may begin only after the constitution is ratified, the initial
status exists, every automated gate required for initial work is installed and
passes its own self-test, and the owner separately authorizes the start. Until
all four conditions hold, the project remains in setup.

Before ratification and status initialization, the agent MUST NOT analyze legacy
behavior, populate requirements evidence, create prototype or architecture decisions,
write detailed feature designs, modify or create target implementation code, or claim that any
migration stage has started or completed.

Agents perform only work permitted by the active stage. Automated checks and
agreement between agents never imply owner approval. Required owner decisions,
including requirements revision, application form and style, wireframes,
architecture, design approval for implementation, waivers, merge, and acceptance,
must be recorded explicitly in durable project artifacts.

No production implementation begins before the relevant detailed design exists, its
independent verification is clean, and the owner has explicitly approved the
implementation scope.

Before that approval, the producing agent MUST expose every
implementation-shaping assumption in the feature specification, including its
evidence or uncertainty and its effect on behavior, data, API, UI, security,
operations, or tests. The owner MUST explicitly approve each proposal as
written or replace it with a corrected final decision. "Implement as proposed"
is a valid explicit approval; silence, agent agreement, merge, or a passing
test is not. The original proposal and final owner decision remain durable in
design record. Hidden, pending, blank, or newly introduced plan/task assumptions
block design approval and implementation. Completed pre-policy slices are not
retroactively blocked, but every new or reopened design follows this rule.

<a id="read-ii-preserve-an-honest-legacy-baseline"></a>

### II. Preserve an Honest Legacy Baseline

The exact upstream legacy source MUST remain attributable to its origin and MUST
NOT be changed to simplify parity. Local adapters, emulators, extracted assets,
and deployment helpers live outside the immutable snapshot and are labeled.

If the real legacy runtime cannot be executed, agents MUST NOT claim that it
was observed. The owner chooses a traceable simulation or an explicit waiver.
Neither option verifies the unavailable runtime; affected behavior remains
marked unverified until a real walkthrough is completed.

<a id="read-iii-evidence-before-requirements"></a>

### III. Evidence Before Requirements

Legacy behavior is established from source code, screens, APIs, messages,
batch jobs, data definitions, configuration, deployment descriptors, tests,
and live observation when available. Documentation and agent memory are useful
context but are not sufficient proof by themselves.

Every recorded legacy behavior cites concrete evidence and distinguishes confirmed,
inferred, partial, simulated, and unverified behavior. Missing evidence is
visible; uncertainty is never silently promoted to a business requirement.

<a id="read-iv-explicit-parity-and-modernization-decisions"></a>

### IV. Explicit Parity and Modernization Decisions

Observable behavior parity is the default for every in-scope legacy behavior.
Dead code, insecure behavior, unavailable integrations, intentionally improved
UX, and target-only capabilities may differ only through an owner-approved,
traceable decision recorded in the requirements, design, and relevant architecture
decision.

No legacy feature is silently dropped. No target-only screen, role, endpoint,
job, or integration derives business meaning merely from its name.

<a id="read-v-prototyping-and-architecture-before-sdd" data-legacy-anchor="true"></a>

<a id="read-v-approved-experience-architecture-and-knowledge"></a>

### V. Approved Experience, Architecture And Knowledge

For user-visible work, the approved prototype record defines application form,
design baseline, screens, roles, states, navigation, and validation behavior.
Prototype exports are versioned, hash-pinned, independently checked against the
governed requirements, and explicitly approved by the owner. A recorded scope-specific
waiver is required when prototyping is not applicable.

Architecture MUST be based on attributable discovery, measurable requirements
and explicit human decisions. Source, live observation and client statements
remain distinguishable; unavailable facts and team competence are never invented.
The owner decides residual business questions, not facts the agent can investigate.
Team capability informs risk but cannot silently override parity, security,
compliance or NFRs. Required capability gaps need approved plans.

The approved baseline MUST bind exact versions of its requirement and decision
records, owner approvals, architecture, detailed concerns and editable diagrams.
Independent control verifies semantic consistency, readability and exact scope;
exports or a cloud URL never replace the durable editable source. Artifact
formats and collaboration mechanics belong to the implementation procedure.

Approved architecture MUST NOT be silently rewritten or re-hashed by downstream
agents to fit implementation or runtime observations. New evidence triggers a
governed return, affected-scope correction, independent review and owner
re-approval before dependent work resumes. Unaffected approvals remain valid.
The first baseline covers the minimum operational foundation; later work reopens
only the decisions it depends on. Procedure determines the correction route and
revalidation checkpoints, without granting permission to bypass these controls.

Before detailed feature design, the approved architecture is synthesized into a
source-linked knowledge baseline. Every concept has a stable identity,
provenance to architecture and requirements evidence, and an integrity binding.
A fresh independent agent checks that baseline before design may consume it.
Design must trace through approved architecture and controlled knowledge. A
scope-specific owner waiver is required when architecture or knowledge stages
are intentionally skipped.

A waiver does not erase required work or transform unobserved behavior into
verified behavior. The exception remains in the transition history and receives an
independent clean control pass at the next applicable control stage over the
exact waiver, residual risk, applicable scope, and absence of uncovered
unwaived work.

<a id="read-vi-sdd-and-the-parity-map-stay-in-lockstep" data-legacy-anchor="true"></a>

<a id="read-vi-requirements-design-and-evidence-stay-in-lockstep"></a>

### VI. Requirements, Design And Evidence Stay In Lockstep

Governed requirements are the starting point for detailed design. Each delivery
scope maintains its feature specification, implementation plan and work items,
with traceability from legacy behavior to requirement, architecture decision,
task, code, test, deployed evidence, and acceptance. The procedure assigns exact
artifact names; changing a filename cannot remove the traceability obligation.

Completed tasks are checked in the same change that delivers and verifies them.
A completed task without delivered behavior, code that contradicts its spec, or
a requirements status unsupported by the required evidence is a defect.

<a id="read-vii-incremental-vertically-verifiable-delivery"></a>

### VII. Incremental, Vertically Verifiable Delivery

Implementation proceeds in small dependency-ordered delivery slices, never as
one unreviewed migration of the full backlog. Each slice includes its behavior,
data changes, user or integration surface, automated tests, design and
requirements updates, deployment, live reconciliation, and independent acceptance.

Findings return the current slice to the appropriate earlier stage. The next
slice does not begin until the current slice has completed the required
delivery loop or the owner has recorded a scoped exception with residual risk.
After all slices pass, the complete system receives consolidated acceptance.

<a id="read-viii-main-stable-reviewable-change-control"></a>

### VIII. Main-Stable, Reviewable Change Control

Scoped work happens on branches and reaches the integration branch through a
coherent reviewable change. Unrelated refactors, generated churn, credentials,
runtime scratch data, and another project's evidence or history are excluded.

Merge authority belongs only to the owner. It cannot be delegated to an agent
or inferred from a successful test run, review, approval recommendation, or
agent statement.

Ordinary governed changes MUST use a branch and pull request. Before requesting
merge, the orchestrator runs the repository's local deterministic gates and
waits for every required remote CI workflow on the exact pushed commit to
finish successfully. A queued, running, failed, cancelled, or missing required
workflow means the change is not complete. Local success is never a substitute
for required remote CI, and the orchestrator must inspect, fix, rerun, and recheck a
failed remote workflow before reporting completion or asking the owner to merge.

<a id="read-ix-explicit-data-change-control"></a>

### IX. Explicit Data Change Control

Normal application startup MUST NOT create, migrate, seed, repair, or otherwise
mutate persistent data. Schema and reference/demo data changes use versioned
migration artifacts or documented, explicitly invoked operator commands
selected by the approved architecture.

Every data change ships with verification and rollback or recovery guidance
appropriate to its risk. Applying changes to shared environments is deliberate
and auditable.

<a id="read-x-automated-verification-at-the-lowest-useful-level"></a>

### X. Automated Verification at the Lowest Useful Level

New or materially changed behavior MUST have automated tests appropriate to the
selected stack: unit tests for isolated business behavior, integration or
contract tests for boundaries, and UI or end-to-end tests for critical
user-visible flows.

Tests needing real databases, browsers, legacy runtimes, queues, or external
services are categorized and document their prerequisites. Deterministic gates
fail closed: absent tooling, incomplete coverage, stale artifacts, or an
unavailable required environment cannot be reported as passing.

Before detailed feature design, the approved architecture MUST define an executable, stack-specific
**engineering-quality profile**. Vague quality claims are not verification.
The profile governs test levels, infrastructure, coverage, code and dependency
rules, data changes, string ownership and CI. Runtime contracts, configuration,
secrets and user-facing prose require explicit ownership; genuinely local
non-contract strings need not become global constants. The procedure defines
tools, identifier categories and positive/negative fixtures. Implementation
must execute these approved rules without weakening them.

A build agent MUST NOT disable or weaken analyzers, tests, coverage, migration
checks, architecture rules or CI commands to make a change pass. Skipped/disabled
tests, warning suppressions, placeholders and coverage exclusions require a narrow
documented justification and independent review. Coverage is a floor and never
substitutes for requirement-linked semantic assertions.

Every durable approval, waiver, review, transition, blocker, walkthrough, and
acceptance reference MUST resolve to a non-empty, non-template,
repository-local record. Final completion additionally reconciles accepted
slice identifiers with design, requirements, deployment, and acceptance records.

<a id="read-xi-security-improves-on-legacy"></a>

### XI. Security Improves on Legacy

The target MUST not preserve insecure legacy behavior merely for parity.
Intentional security changes are documented and tested. At minimum: production
secrets stay outside source control; production credentials and endpoints are
not hard coded; transport security is verified; authorization is
least-privilege; passwords use approved one-way storage; persistence is
parameterized; sensitive logs and audit data are protected.

A dedicated, revocable non-production demo credential MAY be committed only
when the repository is private, the owner explicitly approves the temporary
exception, the environment contract records its scope and remediation, and an
automated audit verifies the credential and host-key references. It MUST grant
no production or regulated-data access. Before the starter is shared more
broadly, the credential is moved to approved secret storage, rotated at the
remote environment, and removed from Git history.

Security, privacy, regulatory, and data-classification constraints apply to
cross-agent review packets. Material not approved for an external service is
not transmitted to it.

<a id="read-xii-auditable-independent-reviews"></a>

### XII. Auditable Independent Reviews

Independent control stages use an eligible different agent with fresh context.
An agent whose current context includes creating or editing an artifact in
scope MUST self-disqualify. Every clean, findings, invalid, or blocked attempt
leaves an immutable report and status-ledger entry; chat history is not
completion evidence.

Review session identifiers MUST be unique. A control-stage pass applies only
to the exact stage entry during which it ran; re-entry requires a new pass and
makes an earlier clean result stale for the new exit. A reviewer with authored
artifacts in scope MUST record the attempt as invalid rather than findings or
clean.

The primary agent may orchestrate an approved external agent directly, but the
reviewer remains read-only and owns its conclusion. The primary agent validates
each finding and records accepted or rejected disposition with evidence. It
must not rewrite `findings` or `blocked` as `clean`.

Context overflow, timeout, lost scope acknowledgement, reviewer mutation, or
incomplete batch coverage fails closed. Exact uncovered scope is carried into
a later eligible fresh-agent pass. A gate cannot close while unresolved blocked
scope remains.

<a id="read-xiii-every-shipped-surface-must-be-useful"></a>

### XIII. Every Shipped Surface Must Be Useful

A route, menu item, role workspace, screen, API operation, message handler, or
job is not complete merely because it exists, returns success, enforces access,
or displays a heading. Every shipped surface has an owner-approved useful
action or observable contract, with traceable design, code, automated-test,
deployed, and acceptance evidence.

Visible placeholders, generic empty workspaces, and actionless roles are
release-blocking gaps. An approved deferred surface is hidden from production
navigation or exposure until implemented.

<a id="read-xiv-durable-handoffs-and-honest-completion"></a>

### XIV. Durable Handoffs and Honest Completion

Before stopping, an agent records the required stage artifact, verification
results, blockers, owner decisions, current progress, and exact next action in
the governed status file without erasing history.

Unverified means not done. A migration is complete only when the requirements,
design, architecture, implementation, tests, deployed behavior, inventories, and
independent acceptance agree, all remaining deferrals have explicit owner
decisions, and final owner sign-off is recorded.

<a id="read-required-repository-contracts"></a>

## Required Repository Contracts

**Process binding, not an execution procedure.** The principles above describe
what must remain true. The links below locate their implementation in the current
methodology; renumbering its steps does not change a principle or grant approval.

An initialized project MUST maintain attributable legacy source, governed
instructions and status, parity evidence, applicable prototype/architecture/
knowledge and SDD records, immutable reviews, inventories, stage outputs and
deterministic tooling for every required gate. Applicability follows the process,
not an agent's preference. Missing required records block the affected action.

[ARTIFACTS.md](../../ARTIFACTS.md) owns the readable file catalog; the
[process contract](../../analysis/process-contract.md) owns stage roles and flow.
Exact file paths and stage procedures are not duplicated in this constitution.

The [constitution implementation map](../../analysis/process-contract.md#constitution-implementation-map)
identifies the concrete checkpoints and records. In particular:

- [Reading order](../../MIGRATION.md#mandatory-reading-order) and
  [project setup](../../analysis/migration_methodology.md#bootstrap-execution) implement authority before action.
- [Blind review packets](../../analysis/agent_orchestration.md#blind-review-packets)
  implement independence and controlled evidence access.
- [Architecture preparation](../../analysis/migration_methodology.md#stage-09),
  [register instructions](../../analysis/architecture/architecture-nfr-decision-register-instructions.md),
  [knowledge preparation](../../analysis/knowledge/README.md) and the
  [living architecture loop](../../analysis/migration_methodology.md#living-architecture-loop)
  implement controlled baseline preparation and correction.
- [Engineering-quality requirements](../../analysis/migration_methodology.md#engineering-quality-profile)
  implement executable verification and string ownership.

Project-specific source and target locations, selected technologies,
environments, and deployment topology are recorded during initialization and
architecture work. They are not hard-coded by this starter constitution.

<a id="read-ratification-checklist"></a>

## Ratification Checklist

The following project-record fields retain the current process vocabulary.
They record actual decisions; they are not additional principles or a substitute
for the setup procedure. In this process, initial governed work starts at Stage 1.

The owner reviews and decides; the Bootstrap agent records each confirmation
below before changing the status to `RATIFIED`. An unchecked item is not approval:

- [ ] Confirm the initializer replaced the project name and owner placeholders.
- [ ] Review every core principle and record any project-specific amendment.
- [ ] Confirm source and target repository layout.
- [ ] Confirm data classification and permitted external review services.
- [ ] Confirm owner-only decisions and the operational roles that prepare
      evidence without receiving owner-gate authority.
- [ ] Confirm the initial migration stage and next action in
      [`analysis/migration_status.yaml`](../../analysis/migration_status.yaml).
- [ ] Set constitution version to `1.0.0` or another approved stable version.
- [ ] Complete the Bootstrap Decision Record below and reference this file from
      [`analysis/migration_status.yaml`](../../analysis/migration_status.yaml) as the constitution ratification record
      and the owner evidence for the initial Stage 1 transition.
- [ ] Record ratification date and owner identity here and in the status file.
- [ ] Commit ratification as a dedicated, reviewable change.

<a id="read-bootstrap-decision-record"></a>

## Bootstrap Decision Record

This section is the durable owner record for two separate Bootstrap decisions.
Its existing field names bind the project to the current process and are retained
for record compatibility; numbered transitions belong to the methodology, not
the principles above. Existing completed decisions must never be relabelled.
When completed, both `constitution.ratification_record` and the owner-approval
record for the `bootstrap -> stage-01` transition in
[`analysis/migration_status.yaml`](../../analysis/migration_status.yaml) may reference
[`.specify/memory/constitution.md`](./constitution.md). Ratification does not imply Stage 1
authorization, and Stage 1 authorization is invalid without ratification.

The Bootstrap agent fills each pending value from the owner's explicit decision
before leaving Bootstrap; it does not decide ratification on the owner's behalf:

- **Constitution decision:** pending (`ratified` or `rejected`)
- **Approved constitution version:** `0.2.2-draft`
- **Ratified by:** pending owner identity
- **Ratified at:** pending ISO 8601 timestamp
- **Project-specific amendments:** pending (`none` or exact section links)
- **Stage 1 authorization:** pending (`approved` or `rejected`)
- **Stage 1 authorized by:** pending owner identity
- **Stage 1 authorized at:** pending ISO 8601 timestamp
- **Decision rationale:** pending

<a id="read-governance"></a>

## Governance

This document uses semantic versioning:

- **MAJOR** for removing or redefining a governing principle;
- **MINOR** for adding an enforceable principle or section;
- **PATCH** for clarification that does not change obligations.

Every amendment records rationale, affected stages and artifacts, migration
impact, owner decision, version, and date. Ratification or amendment approval
cannot be inferred from an agent action, merge, or elapsed time.

The following governance invariants cannot be removed, waived globally, or
weakened by a project amendment while the project claims conformance with this
starter:

- legacy evidence and uncertainty are represented honestly;
- the legacy baseline remains attributable and unmodified;
- owner gates, owner-only merge authority, and final acceptance remain human
  decisions and cannot be delegated to agents;
- every methodology-designated independent pass uses an eligible fresh agent
  that did not create or edit the artifacts in scope;
- final acceptance includes the methodology-required independent third-party
  review; an owner walkthrough may supplement but never replace it;
- independent reports and blocked-scope history remain immutable and auditable;
- required deterministic gates fail closed;
- production secrets and unauthorized sensitive data are not committed or sent
  to review services; any temporary non-production demo-key exception satisfies
  Principle XI and remains explicitly auditable;
- unverified behavior is never reported as complete.

A proposed change to one of these invariants requires a synchronized change to
the starter methodology, an independent review of the process change, and
explicit owner approval. A project may record a decision to use a different
process, but it must then identify the departure and MUST NOT claim full
conformance with this starter methodology.

**Status:** TEMPLATE - NOT RATIFIED
**Version:** `0.2.2-draft`
**Ratified:** pending owner decision

# Migration Agent Entry Point

## Portable Roles And Delegation

After the mandatory reading order, use [analysis/agent-roles.md](analysis/agent-roles.md)
to route this session. With no assignment, coordinate as **PM** and explicitly
delegate the active stage to BA, UX, Architect, Developer or QA. A delegated
session takes its assigned role/mode, not another PM. Read the named repository
`SKILL.md` before work and acknowledge its version and the task boundary.

The role contract owns assignments, ACK, QUESTION/BLOCKED/RESULT, write ownership
and provider-change checks. Read the active stage in
[analysis/migration_methodology.md](analysis/migration_methodology.md) for its
inputs, actions, outputs, checks and return paths. Skills are short execution
aids, not substitutes for that procedure. PM integrates shared status, graph and checklist
changes from specialist evidence; the lead writes stage-owned artifacts. Human
decisions and fresh independent reviews remain mandatory. If separate sessions
cannot be launched, prepare the packet for an owner-launched session and wait;
do not silently perform specialist work under a different name in PM's context.
For Stage 2 `full-blind` and Stage 19, read only permitted Phase A inputs until
observations are saved. Stage 2 `correction-validation` is not blind and reads
its prior evidence immediately under the mode-specific procedure.

For UI work at Stages 5-9 and 13-19, also read
[analysis/prototyping/ui-design-system-guide.md](analysis/prototyping/ui-design-system-guide.md): foundation before drawing,
screens and shared components developed together, exact combined approval,
and read-only token/variant consumption downstream. Existing approved history
is preserved by an explicit compatibility pin, not silently reapproved.

## Error Prevention

Before new or reopened work, follow [the cross-stage error-prevention instruction](analysis/error-prevention.md).
Read applicable project checklist rows before work, self-check the actual result
before handoff and repeat affected checks after corrections. After each control
pass or confirmed error, generalize qualifying lessons and check for duplicates
before the coordinator updates the single four-column table. The owner may prune
it; a fixed finding does not automatically retire a useful check. Independent
reviewers propose changes but never edit the project table. At Stage 2 full-blind and Stage 19,
withhold learned checks and self-check notes until Phase A has been saved.
Record the concise self-check and learning update as instructed; neither is
approval. Run `audit:prevention` for table integrity, not semantic verification.

Before drafting, freezing or publishing evidence, follow
[credential-safe evidence](analysis/agent_orchestration.md#credential-safe-evidence).
Cite credential source locations without copying values, including factory
defaults. Authors/reviewers check before freezing; PM checks before publication.
Public-data classification is not an exception for working secrets, and sealed
evidence is not silently rewritten. This generic rule is allowed in blind
Phase A; project-specific decisions and learned checks remain withheld.

## Process Maintenance Authority

The English [process contract](analysis/process-contract.md) defines the shared
stage roles, artifact flow, closing evidence and maintenance rules. Read it with
the applicable methodology before changing process instructions. JSON and code
are projections or implementations, not competing rule sources. Russian is
presentation-only in optional 3D translations. The agent-system example,
instructions and evidence stay English.

**Reading technical statuses.** The authoring agent must explain technical statuses in plain language at first use, in parentheses or a nearby table legend. Preserve exact machine values; when the parser needs an exact line, place the explanation in the next paragraph. Strict formats and immutable evidence use companion guides. An explanation must not create approval or silently refresh evidence hashes. [Status meanings](analysis/artifact-status-meanings.md).

## Combined Delivery And Reconciliation

Stage 18 proves delivery of the exact deployed revision and reconciles coverage
and living behavior with approved records in the same delivery report:
read the completed delivery checks and linked raw results, validate applicability,
then discover live surfaces and investigate uncovered or uncertain behavior.
Cite valid earlier observations rather than repeat the whole delivery suite;
record a reason for each repeated check and keep unverified scope explicit.
A changed deployed revision first needs its own Stage 18 evidence. Required
Stage 18 audits and independent Stage 19 acceptance are not waived. Follow
[the Stage 18 procedure](analysis/migration_methodology.md) and its named template.

Process revision 1.5 combines the former live-revision Stage 19 into Stage 18;
independent acceptance is now Stage 19. Old reports keep their original names
and meaning. Follow [the upgrade boundary](analysis/process-upgrade-1.5.md)
before interpreting old checkpoints under the new numbering.

## Artifact Authorship Contract

For Stages 15-19, the active agent follows the
[traceability and verification-link contract](specs/traceability-guide.md).
The shared index links each slice to SDD, planned checks and actual records;
the slice records requirement-to-check observations and exact checked versions.
Independent reviewers verify meaning. Missing evidence is not a passed test,
and updating links alone does not change the current stage or an approval.

Every new or reopened Markdown artifact follows the
[human-readable artifact contract](analysis/artifact-reading-contract.md):
use its named template, keep reusable guidance collapsed, lead the result with
a scoped color-coded summary, and maintain an anchored Contents section.
The summary must agree with the detailed evidence and canonical verdict.
Do not infer approval from color or silently rewrite immutable evidence.

On every return, the active-stage agent follows the
[return and correction protocol](analysis/reviews/README.md#return-and-correction-protocol):
read the exact triggering record cited by status, verify each finding against
the destination stage's authoritative inputs, correct affected scope and record
per-finding dispositions with evidence. Earlier unresolved findings remain in
scope. Do not restart blindly, assume a review is infallible, or treat a primary
agent's fix as independent acceptance. Stage 1 has a
[separate re-entry procedure](analysis/reviews/README.md#stage-1-re-entry);
the next Stage 2 uses the independently validated control mode below.

Every corrective return uses [Correction Scope And Handoff](analysis/reviews/README.md#correction-scope-and-handoff).
PM assigns findings and their affected dependencies/mechanisms, preserves valid
unaffected work and verifies the actual correction boundary at handoff. Returning
to a stage is not permission to restart it from scratch. Wider authoring requires
recorded impact evidence; required control scope and owner gates stay unchanged.

For Stage 2, follow the [control-mode procedure](analysis/reviews/README.md#stage-2-control-reconnaissance).
Initial/new scope uses `full-blind`: save Phase A before opening filled records,
then reconcile both directions in Phase B. Bounded corrections use
[correction-validation](analysis/reviews/README.md#stage-2-correction-validation)
only after the fresh independent reviewer verifies an eligible complete full
baseline. That mode reads earlier reports/checklist immediately, checks the
whole actual change and affected mechanisms, and justifies retained check IDs.
Record `control_mode` and the required baseline/predecessor/coverage references
in the existing report and status. No new artifact or new Phase A is required.
Missing/unreliable evidence, changed source/scope or systemic/unbounded impact
requires full-blind control in another fresh session. A closing `clean` still
needs complete reconciled coverage, no unresolved findings (including low) and
no required unchecked scope. Stage 19 is unchanged; source evidence resolves
disagreements, not either agent's authority.

Every new stage, decision or execution record follows the
[artifact result boundaries](analysis/artifact-result-boundaries.md): established
results, unresolved differences or decisions, unverified scope and next action
remain separate. The agent uses the record family's structure, not a generic
review table for every artifact. Planned work is not evidence or human approval.

All new independent review reports must follow the
[comparison record contract](analysis/reviews/README.md#comparison-record-contract).
The reviewing agent separates expected-versus-observed results, discrepancies,
blocked/excluded scope and reconciled totals. Prior unchanged results in a
delta review are cited, not represented as newly verified. A clean label or
green audit does not replace the comparison evidence.

### Conditional Cosmetic Follow-up

At Stages 15-19 the active agent must read the
[minor visual correction contract](analysis/migration_methodology.md#minor-visual-correction-deadline-contract).
When a Stage 7 review or Stage 8 approval declares cosmetic debt, its backlog
is a required input, not an optional reminder. A missing referenced file blocks;
when no debt exists, record that fact without creating an empty backlog.
Match all open findings to actual screens, shared components and functions,
not only the assigned slice number. Stage 15 links tasks; Stage 16 verifies
coverage; Stage 17 fixes and records independently verified closure; Stage 18
blocks production release of affected scope with open findings; Stage 18
reopens regressions; Stage 19 reconciles findings after its blind inspection.
Backlog updates at Stages 15 and 17 retain the finding IDs and history.
Stage 18 records regressions in its immutable delivery report and returns
backlog changes to Stage 17 for a newly reviewed candidate.
Automated green checks do not replace this semantic scope/visual review.

Every new or revised artifact description must explicitly name **who creates it**, **who maintains it or makes the recorded decision**, and **which stage instruction governs that work**. Use the [artifact responsibility reference](analysis/artifact-responsibilities.md). Do not substitute the stage actor for the document author: an agent may write a record of a human owner decision, and a tool may emit evidence that the agent verifies.

Preserve the actual author/producer metadata. Reusable guidance describes roles and does not retrospectively attribute work. Strict-format files use their companion descriptions; immutable reviews and hash-pinned evidence retain their bytes and use the family reference. Templates must carry this guidance so future artifacts inherit it. Run `npm --prefix analysis/tools run audit:responsibilities` together with the applicable view checks after changing descriptions.

This file is the single entry point for an agent working in a repository
initialized from this starter.

## `MIGRATION.md` Versus `migration_methodology.md`

These files are complementary, not duplicate copies of the process. The
[document ownership contract](analysis/process-contract.md#document-ownership)
also distinguishes the constitution, shared flow contract and domain guides.
The constitution is the highest project authority; this file is read first.
Its principles express obligations without stage numbers. The
[constitution implementation map](analysis/process-contract.md#constitution-implementation-map)
binds those obligations to this workflow; reference links and historical approval
fields do not turn the constitution into an execution manual.

| Document | Question it answers | When the agent uses it | What it does not do |
|---|---|---|---|
| `MIGRATION.md` (this file) | **What may I do in this session, and what must I read next?** | First, on every session. It establishes the authority and reading order, the governing Bootstrap and maintenance procedure, current-stage routing, legal transitions, waiver rules, and the command contract. | It does not provide the full execution procedure for Stages 1-19. |
| [`analysis/migration_methodology.md`](./analysis/migration_methodology.md) | **How do I execute the selected stage and prove that it is complete?** | After `migration_status.yaml` identifies the active stage. The agent reads the applicable stage before planning or changing status. | It does not decide the project's current stage and is not the first-session router. |

In practical terms, `MIGRATION.md` gets the agent to the correct piece of work
without allowing premature action. The methodology then defines that work's
inputs, activities, actors, outputs, exit gate, and return path. They must agree;
if they conflict, the agent stops and records a governance defect instead of
choosing whichever instruction is more convenient.

## Bootstrap State

The canonical methodology is available at
[`analysis/migration_methodology.md`](analysis/migration_methodology.md), with
its human-facing presentation at
[`analysis/migration_methodology.html`](analysis/migration_methodology.html).
The universal constitution template is available at
[`.specify/memory/constitution.md`](.specify/memory/constitution.md). It is
deliberately unratified in the starter and must be reviewed and ratified for
each initialized project.

The constitution is the project's **non-negotiable governance contract**. It
defines the rules that every stage and every agent must obey, including:

- who may approve decisions and why agent agreement or passing checks never
  substitutes for explicit owner approval;
- how the immutable legacy baseline, source evidence, uncertainty, parity
  decisions, and intentional differences must be recorded;
- when prototypes, architecture, knowledge artifacts, and SDD are required
  before implementation can begin;
- how implementation assumptions, traceability, incremental delivery, testing,
  security, data changes, deployment, independent review, and acceptance are
  controlled;
- what repository records must remain durable so another agent can reconstruct
  what was decided, by whom, on what evidence, and why.

The constitution states the enduring rules and decision authority; the
methodology defines the ordered stages that execute those rules; the status
file records where the project currently is. A project may add stricter
project-specific amendments during ratification, but may not silently weaken
the starter safeguards. The Bootstrap agent fills the identity and records the
owner's explicit amendment, version and ratification decisions in both the
constitution and [`analysis/migration_status.yaml`](./analysis/migration_status.yaml). The owner decides; the agent
records. After ratification, the
constitution overrides conflicting repository guidance. Before ratification,
the project remains in bootstrap and conflicts or ambiguity require an owner
decision.

The reusable status template is
[`analysis/migration_status.template.yaml`](analysis/migration_status.template.yaml)
and its governing schema is
[`analysis/migration_status.schema.json`](analysis/migration_status.schema.json).
The template is not a project checkpoint. Only an initialized, valid
[`analysis/migration_status.yaml`](./analysis/migration_status.yaml) can serve as one.

## Bootstrap In Practice

Bootstrap is a one-time project setup. It creates an empty governed migration
workspace; it does not perform legacy analysis or start Stage 1 automatically.
This section is the single detailed governing Bootstrap procedure, including
[evidence and blockers](#bootstrap-evidence-and-blockers) and
[maintenance of initialized projects](#bootstrap-maintenance). The methodology,
process contract and report template link here rather than maintain another recipe.

1. The owner supplies the target repository path, project name, project ID,
   and project owner. Record the exact approved starter revision; if HEAD has
   changed, request a baseline decision before initialization. Agree the
   integration branch rather than inferring it from an empty repository.
   Use the approved fresh Starter source, not an initialized project: the
   initializer refuses project control files in its source to prevent inherited
   constitution decisions or evidence.
2. Run `init-migration.ps1`. It copies the process, schemas, templates, audits,
   CI workflow; generates an empty environment contract from
   [`config/environments.template.yaml`](./config/environments.template.yaml); renders the project identity into
   [`config/project.yaml`](./config/project.yaml), [`analysis/migration_status.yaml`](./analysis/migration_status.yaml), and the project
   constitution; creates a pending
   [`analysis/stages/bootstrap/bootstrap-gate-report.md`](./analysis/stages/bootstrap/bootstrap-gate-report.md) from its starter
   template, empty [`analysis/legacy_reconnaissance.md`](./analysis/legacy_reconnaissance.md) and
   [`analysis/legacy_user_flows.xlsx`](./analysis/legacy_user_flows.xlsx); and writes `.migration-starter.json` as
   initializer-only ownership and safe-rerun metadata. The source starter is
   read-only: tooling and dependency-cache writes stay in the target. Never copy
   the source's actual environment, credentials or known-hosts file. The obsolete
   credential-copy flag is rejected; no approval or expiry is created or renewed.
   An approved non-empty target needs `-AllowNonEmptyTarget`; existing files are
   not overwritten. Matching reruns preserve configured project environments.
   On first initialization, regenerate target-aware guidance and clickable
   references only in newly created documents. The initializer MUST NOT
   automatically normalize any pre-existing file. Machine state, credentials,
   binaries and immutable legacy or historical evidence remain unchanged.
   Read the rendered project's explicit document-level `Version` metadata in
   [`.specify/memory/constitution.md`](.specify/memory/constitution.md) and set
   `constitution.version` in [`analysis/migration_status.yaml`](./analysis/migration_status.yaml) to that exact value,
   including while the constitution is unratified. Quoted examples are not
   document metadata. Never substitute a stale
   status-template default or an assumed ratified version. The initializer and
   `audit:status` MUST check this equality against the actual project constitution;
   missing, ambiguous or mismatched version metadata blocks readiness. Matching
   the version does not ratify the constitution or authorize Stage 1.
3. Set [`config/project.yaml`](./config/project.yaml) `paths.legacy_source` to the attributable legacy
   source inside the initialized repository and confirm the target path and
   command working directories. Later-stage command values remain `null` until
   their declared stages require them; Bootstrap never guesses commands.
4. The owner reviews the rendered constitution and explicitly decides any
   project-specific amendments and stable version. The agent records those
   exact decisions, keeps its explicit `Version` metadata and
   `constitution.version` equal, and completes the `Bootstrap Decision Record`. That section
   is the durable evidence referenced by
   `constitution.ratification_record` in [`analysis/migration_status.yaml`](./analysis/migration_status.yaml).
5. The owner gives two distinct decisions: ratification of the governing
   constitution and explicit authorization to enter Stage 1. The agent records
   both exactly. One decision record may hold both decisions, but neither may
   be inferred from the other.
6. The active Bootstrap agent installs the audit dependencies in the project, runs the audit
   toolkit regression tests (the starter's audit machinery, not the legacy or
   target application tests) and initializer self-test, then runs
   `audit:status`, `audit:project`, `audit:environment`, `audit:methodology`, and
   `audit:views`, plus `audit:responsibilities`, `audit:artifact-links` and
   `audit:prevention`. The agent fills
   [`analysis/stages/bootstrap/bootstrap-gate-report.md`](./analysis/stages/bootstrap/bootstrap-gate-report.md) with exact commands,
   runtime versions, results, failures and corrections as they occur. Follow
   [Bootstrap Evidence And Blockers](#bootstrap-evidence-and-blockers) immediately
   on each durable result, before waiting for remediation approval; status does
   not duplicate the command-level proof. Record
   whether the environment is unconfigured or configured. An empty environment
   can pass structural validation here; this does not authorize remote work.
   The initializer self-test is source-only: invoke [tests/init-migration.Tests.ps1](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/tests/init-migration.Tests.ps1)
   through its absolute path in the approved, read-only Starter, not a nonexistent
   copy in the project. Verify that the source-only tests and the Starter files
   they exercise match the exact owner-approved baseline revision, with no
   unapproved working-tree changes. Record the resolved path and revision; a
   different checkout or changed HEAD is not interchangeable with that baseline.
   If it is unavailable or mismatched, record a blocker and obtain the correct
   baseline or an explicit revised owner decision before rerunning. Run the
   installed toolkit tests in the target. For a
   project-only write boundary, create a project-local test temporary directory,
   set `TEMP`, `TMP` and `TMPDIR` to it for both runs, and set `npm_config_cache`
   to a project-local cache for dependency installation and tests. Restore their
   prior values afterwards. Record that boundary and the exact Starter revision.
7. Only after all required checks pass without unresolved blockers, constitution
   ratification is recorded and the owner explicitly authorizes Stage 1, record
   the real `bootstrap -> stage-01` transition. Put
   [`analysis/stages/bootstrap/bootstrap-gate-report.md`](./analysis/stages/bootstrap/bootstrap-gate-report.md) in that transition's
   `gate_evidence` and rerun the status and project audits, recording their actual
   results. Never fabricate a successful transition merely to attach the report.
   Stage 1 opens with empty reconnaissance and parity
   records ready to be filled from legacy evidence; Bootstrap itself contains
   no discovered behavior or implementation decisions.

The practical Bootstrap outputs are the project constitution, current status,
project and environment contracts, completed Bootstrap gate report, empty
reconnaissance and parity records, and the installed process/audit toolkit. The
`.migration-starter.json` marker supports initializer safety only and is not
migration evidence.

### Bootstrap Evidence And Blockers

The active Bootstrap agent maintains the fixed
[`analysis/stages/bootstrap/bootstrap-gate-report.md`](./analysis/stages/bootstrap/bootstrap-gate-report.md); PM maintains
[`analysis/migration_status.yaml`](./analysis/migration_status.yaml) from its evidence. Record completed checks and
the actual blocker **now, before asking for or waiting on remediation approval**.
Saving a failed or incomplete report does not require approval to fix the cause.

- In **Required Gate Evidence**, record each required check's actual command,
  revision, exit code and durable output. `pending` means not run, `pass` means
  that check succeeded, `fail` means it failed, and `blocked` means it could not
  complete. Preserve failed attempts and subsequent reruns in **Deviations And
  Remediation**; neither a planned correction nor another green check is a pass.
- Derive both the top summary and **Verification Boundary** totals from the
  actual **Required Gate Evidence** rows, not a fixed expected row count or a
  prior report. Both must agree: required rows = pass + fail + blocked + pending.
  Count each check once at its current evidenced result; retain earlier attempts
  as history, not extra required rows. Reconcile after every result or rerun.
  An overall audit pass requires all required rows to pass with no unresolved
  failure; an audit pass still does not establish ratification or start authority.
- Keep `control.current_stage` and `control.state` at `bootstrap`. Record the
  actual condition in existing `control.stage_status` and `control.next_action`:
  use `blocked` for an unresolved technical blocker, even when its remediation
  awaits owner authorization; use `awaiting_owner` when only an owner decision
  remains. Preserve completed `bootstrap_gates` results: `initializer_self_test`,
  `status_schema_validation` and `command_contract_configured` use `pending`,
  `passed`, `failed` or `blocked` for their own checks; `owner_stage_1_approval`
  uses `pending`, `approved` or `rejected` only from the actual owner decision.
  Report `pass`/`fail` map to status `passed`/`failed`, not invented vocabulary.
  Do not reset successful unrelated gates to pending or add fields for other
  checks; their command-level results remain in the report.
- Add the actual unresolved finding to `blockers` with its required identity,
  responsible owner, opening time and `open` status. Its `blockers[].evidence`
  array MUST include [`analysis/stages/bootstrap/bootstrap-gate-report.md`](./analysis/stages/bootstrap/bootstrap-gate-report.md).
  Use only the existing [status schema](analysis/migration_status.schema.json);
  add no schema fields and invent no blocker solely to link successful evidence.
  Leave transition history unchanged until a real authorized transition. After
  authorized remediation, rerun affected checks, retain original failures and
  record resolution only from actual evidence.

If `audit:artifact-links` flags pre-existing editable owner preparation documents,
record the exact findings, affected files and blocked result first. Request and
record explicit bounded owner authorization to linkify **only those exact files**.
After authorization, the agent changes only the cited path references, preserves
their meaning, reviews the bounded diff and reruns `audit:artifact-links` plus any
affected checks. This is an authorized document correction, never automatic
initializer normalization. Do not blanket-rewrite or blanket-exclude all existing
documents. Immutable legacy source and historical evidence remain unchanged;
escalate findings that cannot be corrected within authority to the owner/process
maintainer, leaving the blocker visible rather than weakening a gate.

## Bootstrap Maintenance

An existing project's adoption of a newer Starter is a reviewed, bounded
synchronization, not another initialization. PM/process maintenance performs
only the owner-authorized scope; the owner decides the exact new Starter revision.

1. Establish the project's current Starter baseline and exact proposed new
   revision, inspect their differences against local changes, and obtain explicit
   owner approval for the new revision and exact synchronization file scope.
   A moving branch name or a newly available Starter is not approval. Uncertain
   baseline provenance or conflicting instructions blocks the affected update.
2. Merge only reviewed reusable instructions, templates and affected tooling
   into the approved files, retaining project-local constraints and stricter
   rules. Resolve conflicts explicitly; do not replace local instructions with
   a wholesale fresh payload. Do not rerun the initializer to upgrade, delete
   or hand-edit `.migration-starter.json` to bypass its safety checks, or reset
   the project to Bootstrap. Matching safe reruns are not an upgrade mechanism.
3. Preserve the project constitution, its version and ratification/amendment
   decisions; current status and transition/review/owner history; project and
   environment configuration; filled reports and the parity map; attributable
   legacy source and immutable historical evidence. Do not regenerate these
   from empty templates, refresh historical hashes or infer new ratification.
   Any necessary project governance/configuration change requires its own
   explicit authority; synchronization approval alone does not grant it.
4. Record old and new Starter revisions, owner authorization, exact changed
   files, local merges/conflict dispositions and remaining blockers in the
   existing work/correction record. During unfinished Bootstrap use the fixed
   gate report's **Deviations And Remediation** section; after Bootstrap preserve
   the completed report and use the current authorized maintenance record.
   Do not repurpose the initializer marker as update evidence.
5. Review the bounded diff and rerun affected regression tests and gates against
   the synchronized project, using source-only tests from the newly approved
   matching baseline when applicable. Record actual results, affected evidence
   and the next action using existing status fields. Preserve the active stage;
   maintenance approval and passing checks imply neither Stage 1 authorization
   nor any later transition. Unresolved failures remain blockers.

## Mandatory Reading Order

**Blind-review reading order (Stage 2 full-blind and Stage 19):** The coordinating agent reads
the complete status and governs routing. Before Phase A, the delegated reviewer
reads only a neutral routing extract instead of the full status: active stage,
immutable revision, authorized scope, permitted operations and instruction paths.
Gate outcomes, blockers, progress counts and prior findings remain withheld until
Phase B. This is delayed access, not permission to skip the full record forever
or to authorize a transition. Follow the [blind packet protocol](analysis/agent_orchestration.md#blind-review-packets).

Every agent reads these sources in order (subject to the blind-review boundary above):

1. `MIGRATION.md` - session routing: permitted work, Bootstrap state,
   immediate stop conditions, and what to read next.
2. [`.specify/memory/constitution.md`](.specify/memory/constitution.md) - the project's highest authority: its
   non-negotiable governance principles, owner and agent decision boundaries,
   evidence and traceability rules, required approval gates, implementation,
   testing, security, data-change, review, deployment, and acceptance controls.
   It also records the project identity, constitution version, amendments, and
   owner ratification. A ratified constitution overrides conflicting repository
   guidance; an unratified constitution keeps the project in bootstrap.
3. [`analysis/migration_status.yaml`](./analysis/migration_status.yaml), when present - active stage, gates,
   blockers, and exact next action. Its absence or invalidity keeps the agent
   in bootstrap mode, but the agent continues to step 4 for process context.
   Bootstrap creates this file once. It is then a standing input and updated
   output of every Stage 1-19: PM reads it before work and coordinates updates
   from the lead's evidence after a durable transition, return, gate result,
   blocker, or owner decision. Do not rewrite it for polling or every internal
   action.
4. [`analysis/migration_methodology.md`](./analysis/migration_methodology.md) - detailed stage-by-stage process
   specification: inputs, activities, actors, outputs, gates, and return loops
   for the active stage. Unlike this entry point, it explains how the selected
   stage is executed; it does not select the current stage.
5. [`config/project.yaml`](./config/project.yaml), when present - the initialized project's execution
   contract, generated by `init-migration.ps1` from
   [`config/project.template.yaml`](./config/project.template.yaml); it records the exact project paths, approved
   target platforms, and operational commands.
6. [`config/environments.yaml`](./config/environments.yaml), before any remote operation - canonical
   connection, deployment-root, endpoint, and credential references.
7. [`analysis/tools/README.md`](./analysis/tools/README.md) - canonical automated gate commands and waiver
   execution rules, plus why, when and how each gate is used and a concrete
   pass/failure example.
8. [`ARTIFACTS.md`](ARTIFACTS.md) - the canonical repository artifact map:
   purpose, lifecycle, owner, stage, dependencies, practical use, and a
   concrete example for every governed artifact. Use it to locate the
   active-stage artifacts and understand what action each one supports; it
   never overrides the sources above.
9. Instructions and artifacts for the active stage.

For new records instantiated from templates, follow
[`analysis/artifact-naming.md`](analysis/artifact-naming.md). Preserve the
filename stem, remove the template marker and fill only the declared
placeholders. Use the mapped output directory. Existing project records
retain their exact status and manifest references.

Repository paths mentioned in artifact prose must be clickable Markdown links,
with the path retained as the code-styled label. Inline code without a link is
reserved for commands, identifiers, placeholders and paths that do not yet
exist. Run [`audit:artifact-links`](analysis/tools/artifact-reference-links.js)
before recording or approving an artifact.

For workbook work, read
[`analysis/legacy_user_flows_template_instructions.md`](analysis/legacy_user_flows_template_instructions.md).
For independent or cross-agent control, read
[`analysis/agent_orchestration.md`](analysis/agent_orchestration.md) and the
[`analysis/reviews/`](analysis/reviews/README.md) contract.

If the constitution is not ratified or the status file is absent, an agent may
only instantiate empty templates, configure repository metadata, verify
prerequisite tools, collect owner ratification inputs, and create the initial
status file. It must not analyze legacy behavior, populate the parity map,
create project decisions or SDD, infer approval, select a migration stage, or
write project implementation code.

Bootstrap closes only when the constitution is ratified, the initial status
file exists, every automated gate required for Stage 1 is installed and passes
its self-test, the completed Bootstrap gate report contains no unresolved
failure and is cited by the status transition, and the owner explicitly
approves transition to Stage 1.

## Stage 1 Discovery Records

Initialization creates two empty project records from starter templates, and
Stage 1 fills both from legacy source evidence:

- [`analysis/legacy_reconnaissance.md`](./analysis/legacy_reconnaissance.md) is the **map of the legacy territory**.
  It records which repositories, modules, screens, APIs, jobs, data stores,
  integrations, build/run paths, and runtime dependencies were inspected; how
  they are reached or started; what was excluded, blocked, or remains unknown;
  and where the boundary of the investigation lies.
- [`analysis/legacy_user_flows.xlsx`](./analysis/legacy_user_flows.xlsx) is the **behavior checklist**. It turns the
  user-visible behavior found in that territory into atomic, checkable scenario
  rows and tracks whether each scenario is evidenced, decided, implemented,
  deferred, and ultimately verified in the target system.

For example, reconnaissance records that the legacy contains a login module, a
REST controller, LDAP integration, and a nightly job, together with their
locations and runtime prerequisites. The parity map records the separate
behaviors: successful login, rejected password, expired session, each API
outcome, and the result of the nightly job. Reconnaissance prevents source
areas and dependencies from disappearing from the investigation; the parity
map prevents individual behaviors from disappearing from the migration.
Neither file replaces the other, and neither is an SDD or implementation plan.

## Stage 2 Independent Control

Stage 2 `full-blind` checks the Stage 1 baseline in two deliberately separated phases. A
fresh eligible agent with no authoring context works read-only from the exact
immutable legacy revision. First it inventories executable legacy behavior
without reading the filled parity map, `legacy_reconnaissance.md`, or the first
agent's conclusions. Only after that blind inventory is complete does it open
those records and compare them for omissions, unsupported claims, incorrect
statuses, and broken evidence references.

After bounded corrections, eligible `correction-validation` instead reads the
prior evidence immediately and creates no new Phase A. Follow the
[baseline and complete-coverage requirements](analysis/reviews/README.md#stage-2-correction-validation);
do not repeat unaffected discovery or treat retained checks as newly executed.

The reviewer does not correct the map. It writes the next immutable
`analysis/reviews/stage-02-pass-NNN.md` report with one result: `clean`,
`findings`, `blocked`, or `invalid`. Findings return the primary work to Stage
1; blocked or invalid attempts cannot close the stage. Every re-entry requires
a new report and another eligible fresh session. A clean report registered in
[`analysis/migration_status.yaml`](./analysis/migration_status.yaml), together with a successful workbook audit,
permits Stage 3. Stage 2 has no owner approval gate and does not claim that the
legacy behavior has been observed live; that live check belongs to Stage 3.

## Status And Transition Contract

The project status starts at `bootstrap` with no owner decisions, transition
history, or review history. Constitution ratification must name the owner,
timestamp, stable constitution version, and durable ratification record.
Presence of owner metadata is not ratification.

The schema permits only sequential forward transitions and the explicit return
paths defined by the methodology. Review results use exactly `clean`,
`findings`, `blocked`, or `invalid`. Missing evidence, malformed status,
unknown vocabulary, contradictory state, an unavailable required command, or
an unrecorded approval fails closed.

Return paths are classified by the lowest governed source that must change:
Stage 17 for implementation, Stage 15 for SDD, Stage 13 for synthesized
knowledge, Stage 9 for architecture, Stage 6 for prototype structure, Stage 5
for a deliberate channel/design-system change, and Stage 1 for the parity map.
A correction owned by the current stage remains there; it is not recorded as a
self-transition. The exact allowed pairs live in
[`analysis/migration_status.schema.json`](./analysis/migration_status.schema.json) and the full trigger table lives in the
methodology's `Loops (return arrows)` section.
Transition timestamps must increase strictly. Equal timestamps are invalid
because every independent review must belong to exactly one stage occurrence
and cannot be reused after a return loop.

`control.automatic_advancement` is always `false`. A successful build, test,
audit, deployment, smoke test, or review may provide gate evidence but never
changes `control.current_stage`. A transition is a separate durable status
update using an allowed pair.

The owner must explicitly approve and durably record these forward decisions:

- bootstrap to Stage 1;
- Stage 3 to Stage 4 when live verification is incomplete and the owner
  selects simulation or waiver;
- Stage 4 to Stage 5 after requirements revision;
- Stage 5 to Stage 6 after application form/style selection;
- Stage 8 to Stage 9 after wireframe approval;
- Stage 11 to Stage 12 after architecture review;
- Stage 16 to Stage 17 only after the owner approves or corrects every disclosed
  implementation assumption, approves the SDD scope, and independent review is clean;
- Stage 17 to Stage 18 after `audit:sdd` passes, the exact candidate is clean,
  and the owner approves and merges the slice PR. Completion-mode SDD remains
  deferred while the slice is not yet deployed;
- Stage 19 to the next implementation slice or final `complete`.

A finding-driven return never requires an additional owner approval merely to
record the finding. A map error discovered at any later stage may return the
process to Stage 1. At Stage 9, a decision changing prototype structure returns
only affected scope to Stage 6 (or Stage 5 for a deliberate channel/design-system
baseline change), with an exact triggering record in status; repeat Stages 7-8
before resuming architecture. Channel/design-system changes may return Stages 6-8 to
Stage 5. Build, deployment, and smoke failures normally keep the process in
their current stage while corrections or rollback run; Stage 18 may return to
Stage 17 when implementation must change.

Architecture remains a living, versioned baseline during delivery. A material
architecture finding at Stages 15-19 returns the exact affected layer to Stage
9, repeats Stages 10-14 for that scope, then returns through Stage 15 before the
affected slice resumes. An implementation-only defect remains at Stage 17, an
SDD defect returns to Stage 15, and a parity-map defect returns to Stage 1.

A forward exit from an independent control stage requires a `clean` pass
created during that exact stage entry, except the explicit Stage 7 Low-cosmetic
closing-pass rule. That owner-dispositioned findings pass is not labelled clean.
A finding-driven backward exit requires
the latest pass to be `findings`, never relabelled as `clean`. Re-entering Stage
2, 7, 10, 14, 16, or 19 makes earlier passes stale; review session ids are unique,
and an agent that authored anything in scope may record only an `invalid`
attempt.

## Waiver Contract

A waiver never silently skips a numbered stage. It is one schema-valid,
owner-approved, durable decision for one exact gate and scope, identified as
`waiver:<gate>:<exact-scope>`. The registered gates are
`legacy_walkthrough_fallback` (Stage 3 to 4), `application_form_style` (Stage 5
to 6), `prototyping_retroactive` (to Stage 6), and
`architecture_retroactive` (to Stage 9), and `pre_sdd_knowledge` (to Stage 15
for one exact bounded slice). The latter does not approve or complete the
repository-wide architecture or knowledge chain; `audit:knowledge` derives its
scope from `delivery.active_slice` and fails closed on a missing or mismatched
waiver. Each waiver records `decision`, `decided_by`,
`decided_at`, exact `scope`, `rationale`, durable `record`, `residual_risk`, and
the registered `permitted_next_stage`.
The next applicable independent control stage receives a `clean` pass that
verifies the waiver itself, confirms that no applicable unwaived scope was
omitted, and links the pass to the waiver record. The process cannot leave that
control stage without this link. The unavailable behavior remains unverified;
`clean` means the scoped process decision is internally consistent, not that
the unavailable legacy behavior was observed.

The scope used by CI and completion audits comes from the governed status and
project configuration. CLI or environment overrides are rejected unless the
process explicitly runs with `AUDIT_TEST_MODE=1`; governed CI rejects that mode.

## Command Contract

The starter ships [`config/project.template.yaml`](./config/project.template.yaml); `init-migration.ps1` renders
it with the project identity into the initialized project's
[`config/project.yaml`](./config/project.yaml). That generated file, governed by
[`config/project.schema.json`](./config/project.schema.json), defines project identity, source paths, approved
target platforms, and seven stack-neutral operator commands: `build`,
`test`, `visual_parity`, `deploy`, `smoke`, `user_journey`, and `rollback`. Each command records the exact
command line, working directory, and required environment-variable names.
Initializer output leaves every command `null`. Agents and workflows must stop
when a command required by the active stage is absent or null; they must not
infer commands from source files, a detected stack, or prior experience.
`build` and `test` become mandatory before Stage 17; `deploy`, `smoke`,
`user_journey`, and `rollback` become mandatory before Stage 18. `visual_parity` is mandatory from Stage 17 and is rerun against the deployed revision at Stage 18. Bootstrap validates the command
contract's `minimum_similarity_percent` floor of 95 for visual parity; this is
not permission to omit approved UI elements, whose semantic coverage remains
100%. Exact deterministic comparison may use 100. The remaining command
contract shape and the legacy-source path, but does not require commands whose
target architecture has not yet been designed.
After owner architecture approval at Stage 11,
`config/project.yaml.runtime.target_platforms` must list every supported target
runtime/OS combination.

The source repository alone contains `.migration-starter-source`, a structured
marker pinned to `olsys-ltd/legacy-modernization-starter`. The initializer never
copies it. CI accepts starter-source mode only when both the marker identity and
the actual GitHub repository identity match; copying the marker cannot bypass
project audits.

[`config/environments.yaml`](./config/environments.yaml), governed by
[`config/environments.schema.json`](./config/environments.schema.json), is the canonical remote-environment
contract. It records the default environment, SSH identity and host-key pins,
deployment roots, public endpoints, and a deterministic connection check.
`audit:environment` is required from bootstrap. The exact empty state from
[`config/environments.template.yaml`](./config/environments.template.yaml) is valid before remote access is needed;
partial configuration is not. Before every remote operation, including an early
legacy walkthrough, configure owner-approved access and run
`npm --prefix analysis/tools run audit:environment -- --require-configured`.
The remote helper fails closed while unconfigured. Delivery, deployed/accepted
slice status and completion require configured environments; an earlier green
bootstrap audit cannot replace that readiness. A Stage 18 record names the exact
environment ID it used. Public projects do not need an embedded key to bootstrap.

At Stage 3 and before each Stage 18 deployment, PM must obtain or verify a valid
owner grant for the exact environment, operation and data scope, request missing
server access and application role accounts, and run the authorized procedure.
Follow [the PM access/deployment handoff](config/REMOTE_SERVER.md#configure-before-remote-work).
BA verifies legacy behavior; Developer verifies the new release and owns its
delivery record. PM execution is not independent acceptance or permission to
reuse another project's access, and a legacy grant does not authorize new releases.

An existing embedded-credential exception is valid only while its repository
remains private and the conditions in the constitution are met. The owner, approval
evidence, covered environment IDs, and expiry are recorded in
`temporary_secret_policy`; an expired exception fails the environment audit.
This policy is mandatory for embedded keys, not for an empty environment or
external key references. Prefer credentials outside Git. Initialization never
copies or renews an exception. Removing current key bytes does not remove Git
history or rotate the server key; historical exposure remains separate work.

The bootstrap field `command_contract_configured: passed` means the project
identity, legacy path, command slots, working directories, environment-name
lists, and required-stage metadata are structurally valid. It does not claim
that later-stage command values are already known.

Command success is evidence only. Deployment does not imply a passing smoke
test, a passing smoke test does not imply acceptance, and rollback is never
invoked speculatively.

## Remote CI Closure

PM uses [the PR communication contract](analysis/migration_methodology.md#pr-descriptions-comments-and-commits)
and explicitly loads [the PR template](.github/pull_request_template.md), even
when a CLI does not. Refresh and read back the body after pushes and before
owner handoff; comments record significant events, commits explain intent and
evidence. Neither a well-formed summary nor old-head CI authorizes merge.

Use [Review And Correction PRs](analysis/migration_methodology.md#review-and-correction-prs)
for publication boundaries: a completed control record and its later fixes use
separate PRs. PM publishes truthful negative results without waiting for fixes;
required CI and owner merge still apply. Planning controls consume integrated
candidates; Stage 17 code peer review remains before merge. Never combine these
rules into a general permission to merge unreviewed code.

Local gates are necessary but do not close a repository change. Ordinary work
uses a branch and pull request. After each push, the orchestrator waits for all
required GitHub Actions workflows attached to the exact commit SHA and records
their final results. A queued, running, failed, cancelled, unexpectedly skipped,
or missing required run keeps the change open. The orchestrator investigates
and corrects remote-only failures, pushes the correction, and waits again; it
must not report completion or request owner merge while remote CI is non-green.
An owner-authorized direct push follows the same mandatory post-push check.

## Stage Gate Matrix

These commands are minimum deterministic gates. Stage reports may add
project-specific commands from [`config/project.yaml`](./config/project.yaml).

<!-- STAGE_GATE_MATRIX_START -->
| Close before leaving | Required automated evidence |
|---|---|
| Bootstrap | `audit:status`; `audit:project`; `audit:environment`; `audit:methodology`; `audit:views`; `audit:responsibilities`; `audit:artifact-links`; `audit:prevention`; Install tooling, run toolkit regression tests and initializer self-test. The agent fills bootstrap-gate-report.md with exact results; migration_status.yaml cites it. Owner authorization is separate. |
| Stage 1 | `audit:project`; `audit:workbook`; Source-derived reconnaissance and parity rows with evidence; unavailable scope stays explicit. |
| Stage 2 | `audit:workbook`; Fresh independent BA; full-blind A/B for initial/new scope or unreliable coverage; eligible correction-validation checks changes and affected mechanisms with exact retained evidence. New clean report reconciles complete coverage with no open findings or required unchecked scope; prior reports remain immutable. |
| Stage 3 | Exact walkthrough scope, live/simulated/unverified lanes and valid outcome; any fallback requires the exact permitted owner waiver. |
| Stage 4 | `audit:workbook`; Every challenged row has an explicit owner disposition in stage-04-requirements-revision.md; applied changes and pending questions are separate. |
| Stage 5 | Explicit owner choice of form, channels, style, palette and accessibility in ui-ux-decision.md, or an exact permitted waiver; proposals are not approval. Draft ui-design-system.md and ui-design-tokens.json; the owner selects the foundation and pins its canonical hash in ui-ux-decision.md. This does not approve future component variants. |
| Stage 6 | `audit:prototype`; Row normalization and complete versioned screen manifest/export set, aligned with Stage 4 decisions and the Stage 5 baseline. Develop representative screens and the shared component catalogue together, then reuse them. Pin catalogue, tokens and component previews in manifest version 4; each screen declares used ui_variants. Foundation changes return to 5. |
| Stage 7 | `audit:prototype`; Immutable independent closing review: clean, or only explicitly owner-dispositioned Low-cosmetic findings with backlog, responsible actor, linked scope/tasks and deadline. Independently compare screens with the shared catalogue, token values and previews, including required states, navigation, responsive behavior and accessibility. Record mismatches and unchecked scope; hashes alone do not prove visual consistency. |
| Stage 8 | `audit:prototype:approved`; Owner approval pins the exact exports, manifest hash and Stage 7 closing report. Unreviewed scope and remarks remain explicit. The owner reviews screens and component sheets together and approves the exact manifest-pinned catalogue, tokens and exports. Pending required variants or states block approval. |
| Stage 9 | `audit:architecture`; `audit:dependencies`; Ordered Legacy Discovery (code, relevant live evidence, residual client questions), synchronized questionnaire, system-diagram gate, exact NFR workbook owner review, current-slice Grade A closure, assessed team gaps, architecture/ADR/Draw.io and architecture-nfr-manifest.json pins. Authoring may remain open; the gate is required at handoff. Return changed prototype structure to Stage 6, deliberate channel/design-system baseline changes to Stage 5, and parity-map defects to Stage 1; record the exact decision and repeat Stages 7-8 before resuming architecture. Create the source-backed feature dependency graph: reserve bounded slice IDs, map parity rows, separate contract and completion prerequisites, and record unknowns. Run audit:dependencies before handoff. The coordinator owns the file; do not infer delivery order from slice numbers. |
| Stage 10 | `audit:architecture`; `audit:dependencies`; Eligible independent clean architecture review against the exact manifest, with comparison results, findings and unverified scope. Independently review feature-dependencies.json for missing providers, false links, direction, conditions and completion cycles. Record each checked node ID and scope digest, supporting sources, findings and unchecked scope in this pass. The coordinator records the review binding only after a clean bounded result. |
| Stage 11 | `audit:architecture:approved`; `audit:dependencies`; Explicit owner verdict on exact architecture hashes; runtime.target_platforms is populated. Remarks require the classified return. Approval permits Stage 12 without requiring its future report. Include the reviewed dependency constraints in the owner discussion. Priority is not permission to remove a prerequisite. Record scope/deferral decisions in the owner verdict; dependency corrections return to Stage 9. |
| Stage 12 | `audit:architecture:closure`; `audit:dependencies`; Separate immutable architecture-closure-NNN.md selected in status: every applicable owner/prior item has exact checks, evidence and reconciled counts; the unchanged currently approved set passes. Failure records the classified return and exact report. No edits to architecture or the Stage 11 verdict. Check that owner dependency remarks are resolved in the exact source-backed graph and architecture. Record evidence in the numbered closure report. Do not edit the graph or refresh its pins during closure; return unresolved design to Stage 9. |
| Stage 13 | `audit:knowledge`; `audit:dependencies`; Source-linked OKF v0.2 bundle and manifest pin the exact approved architecture. knowledge-record.md separates produced coverage, gaps and readiness for Stage 14. Read the reviewed dependency graph alongside the architecture. Preserve relevant contract/prerequisite reasoning and source links in knowledge, without copying a competing dependency list. |
| Stage 14 | `audit:knowledge`; `audit:dependencies`; Immutable eligible independent clean review of the exact bundle/manifest: source-to-concept comparison, omissions, contradictions and coverage totals. Check knowledge references against the reviewed graph. Omitted or distorted prerequisites are findings; the graph does not replace the approved architecture or independent knowledge review. |
| Stage 15 | `audit:sdd`; `audit:knowledge`; `audit:workbook`; `audit:dependencies`; Consume approved architecture-nfr-manifest.json without redefining architecture-owned decisions; trace affected NFRs into SDD, disclose owner-reviewed assumptions, impact scope and applicable cosmetic tasks. sdd-record.md records authoring readiness, not implementation permission. The entire approved manifest is read-only: requirements/tasks/tests and later execution evidence belong in specs/traceability.md and slice records. For UI work, read the pinned catalogue and tokens. Bind each Used UI Control Inventory row to its screen and stable governed variant; plan shared styles/components before consumers. Missing approved variants return to 6, foundation changes to 5. Read providers and consumers in feature-dependencies.json before designing this slice. Propose affected updates through the coordinator, reconcile its parity contract, bind the current node scope SHA-256 in spec.md, and plan agreed contracts and provider-dependent checks. Architecture changes return to Stage 9. Record remaining dependency questions in sdd-record.md. |
| Stage 16 | `audit:sdd`; `audit:knowledge`; `audit:workbook`; `audit:dependencies`; Applicable approved prototype/architecture gates, clean independent comparison and explicit owner decisions on assumptions and scope; required cosmetic work is mapped to tasks. The independent Stage 16 agent must read sdd-record.md and reconcile source versions, coverage and gaps against the actual SDD and approved inputs, recording findings in a separate Stage 16 pass. audit:sdd does not parse that author handoff and cannot approve it. Compare pinned prototype exports with SDD and planned visual checks, not unimplemented UI; candidate UI is checked at Stage 17 and deployed UI at Stage 18. Verify the SDD control-to-variant/token bindings and planned visual checks against the approved shared UI baseline, without claiming that unbuilt UI has been tested. Independently compare the SDD with its exact graph node digest. Verify prerequisite conditions, completion closure, exclusions and downstream impact; record node/edge IDs, digests, findings and unchecked scope in this pass. After a clean bounded review the coordinator links the report. Candidate relations or unresolved questions cannot be marked reviewed-ready. |
| Stage 17 | `audit:sdd`; `audit:target`; `audit:ui-parity`; `audit:dependencies`; Configured build, impact-scoped tests and visual_parity; exact approved export hash and required viewport/state/icon evidence; clean peer review and owner-approved merge revision. Only exact post-merge delivery tasks may remain; no premature live-proof claims. Implement shared token-derived styles and reusable components; verify actual computed values, icons and states. Do not invent private screen styles. Missing design returns through Stage 15 to 6 or 5, then affected review/approval. Require the selected SDD-bound dependency scope to pass audit:dependencies --require-reviewed --scope NNN-slug before implementation handoff. Implement against the agreed contracts and verify relevant consumers/providers. New dependencies return to Stage 15 or 9; do not delete an edge to unblock work. |
| Stage 18 | `audit:environment`; `audit:delivery`; `audit:sdd:slice`; `audit:workbook`; `audit:target`; `audit:dependencies`; Configured deploy, smoke, real deployed user_journey with raw evidence/hash-linked summary, deployed visual_parity, validated rollback and records-only history. Completion checks follow exact delivery evidence; applicable open cosmetics block production. The same delivery record must include Live Reconciliation: discovered scope, applicable reused delivery observations, additional live checks, expected/actual coverage, findings and governed record updates. Required unverified scope blocks closure; no separate live-revision record is created. Compare applicable deployed UI with the same pinned shared catalogue/tokens and screen exports. Reuse valid exact-revision evidence, but do not equate local checks with deployment verification. Read the SDD-bound graph and verify actual delivery/evidence for all transitive confirmed completion providers. audit:sdd:slice expands that scope. Contract dependencies alone do not require the entire provider implementation. Do not edit graph expectations to fit deployed behavior. |
| Stage 19 - slice acceptance | `audit:stage19`; Exact delivered scope plus reviewed mandatory Completion dependencies, followed transitively; eligible blind independent acceptance followed by evidence reconciliation and explicit owner slice acceptance. All applicable findings must close. Unrelated slices may remain open; this does not set global complete. Phase A receives relevant shared UI expectations without prior outcomes. Phase B verifies the extract against the full pinned catalogue/tokens and reconciles actual deployed findings. |
| Final completion | `audit:all`; Full-system Stage 19 acceptance and explicit final owner sign-off precede complete. Require 100% global progress, no open blockers/reopened slices, evidence for every completed slice, and owner walkthrough or exact decline. audit:all validates that recorded completion; it cannot authorize the transition. |
<!-- STAGE_GATE_MATRIX_END -->

When the owner declines the optional hands-on walkthrough, record a normal
owner decision with ID `owner-walkthrough-declined:<project-id>`, decision
`approved`, `decided_by` equal to `project.owner`, exact project-id `scope`,
rationale, timestamp, and durable record. Set
`delivery.owner_walkthrough_decision_id` to that ID. A chat message or an empty
report does not satisfy completion.

Plain `audit:prototype` and `audit:architecture` are design/control gates.
Their `:approved` variants are mandatory after the corresponding owner gate.
`audit:stage19` validates the delivered acceptance scope before owner sign-off;
it does not demand global completion or replace independent acceptance. The
current scope and its direct dependencies must be explicit in the Stage 19 report.
`audit:all` includes the strict completion audit and runs only after the owner
has authorized final completion and the agent has recorded `complete`. It does
not authorize that transition. A failed completion audit reopens the affected
gate; the agent never uses a pending owner decision as approval.

The English [process contract](analysis/process-contract.md) defines shared gate
scope and closing conditions. Change the governing English Markdown first, then
regenerate [stage-gates.json](analysis/stage-gates.json) and its matrices in this
entry point, the methodology, HTML and Draw.io. JSON is a derived projection,
not a parallel authority; do not edit its generated rules independently.

## Stable Rules

1. Legacy behavior must be established from evidence, not memory or names.
2. Project requirements, architecture, SDD, implementation, and acceptance
   remain traceable.
3. Human approval gates cannot be inferred from agent agreement.
4. Independent review does not replace deterministic tests or owner decisions.
5. Project-specific evidence and completed-project history are never copied
   from another migration.

## Current Repository Layout

- [`analysis/`](./analysis) contains reusable process and analysis artifacts.
- [`analysis/migration_status.template.yaml`](./analysis/migration_status.template.yaml) defines empty bootstrap state.
- [`analysis/migration_status.schema.json`](./analysis/migration_status.schema.json) defines status vocabulary and legal
  transitions.
- [`analysis/migration_methodology.md`](./analysis/migration_methodology.md) defines how the status-selected stage is
  executed: its inputs, activities, actors, outputs, gate, return loops, and
  place in iterative delivery.
- [`analysis/architecture/`](./analysis/architecture) defines the architecture record and its presentation
  contract.
- [`analysis/knowledge/`](./analysis/knowledge) defines the source-linked OKF bundle that makes the
  approved architecture usable as stable input to SDD.
- [`analysis/legacy_user_flows_template.xlsx`](./analysis/legacy_user_flows_template.xlsx) is the immutable blank workbook;
  initialization creates [`analysis/legacy_user_flows.xlsx`](./analysis/legacy_user_flows.xlsx) as the governed
  project copy.
- [`analysis/legacy_reconnaissance.template.md`](./analysis/legacy_reconnaissance.template.md) is the reusable source-inventory
  record; initialization creates [`analysis/legacy_reconnaissance.md`](./analysis/legacy_reconnaissance.md).
- [`analysis/prototyping/`](./analysis/prototyping), [`analysis/reviews/`](./analysis/reviews), [`analysis/stages/`](./analysis/stages), and
  [`analysis/inventories/`](./analysis/inventories) contain reusable, empty governance templates.
- [`analysis/tools/`](./analysis/tools) contains deterministic audits and regression tests.
- [`config/project.template.yaml`](./config/project.template.yaml) defines the stack-neutral command contract.
- [`config/environments.yaml`](./config/environments.yaml) and [`config/environments.schema.json`](./config/environments.schema.json) define the
  governed remote connection and deployment environment contract.
- [`config/REMOTE_SERVER.md`](./config/REMOTE_SERVER.md) gives the human connection
  procedure. New projects have no credentials directory; create project-specific
  verified host-pin files only during owner-approved environment setup. Keep
  secret key material outside Git.
- [`.specify/memory/constitution.md`](.specify/memory/constitution.md) contains the unratified universal
  constitution template.
- [`.specify/templates/`](.specify/templates) contains generic SDD templates.
- [`specs/`](./specs) contains only project-generated feature specifications plus the
  reusable traceability template.

## Numbered Architecture Review Cycles

New and reopened cycles follow [Architecture Review Cycles](analysis/architecture/review-cycles.md). Stage 11 records the human decision in `analysis/stages/stage-11/architecture-owner-verdict-NNN.md`; Stage 12 creates a separate immutable `analysis/stages/stage-12/architecture-closure-NNN.md`. Status selects exact paths. A negative closure accompanies the classified return and is mandatory reading on re-entry at Stages 9-11. Stage 13 reads and pins both records. Preserve old decisions, hashes and stage history; adopting this format is not a new approval.

## Dependency Graph Routing

For Stages 9-19, follow [feature-dependencies-guide.md](analysis/feature-dependencies-guide.md) and the stage contract. Read it before authoring or reviewing SDD; only Stages 9/15 propose graph changes. At Stage 19 the coordinator withholds the full graph/reviews until Phase B, providing neutral expectations first. A new/reopened slice cannot enter implementation or claim completion with unassessed dependencies. Structural checks never replace independent review or owner authority.

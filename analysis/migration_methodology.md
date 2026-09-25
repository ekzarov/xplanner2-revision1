# Legacy Migration Methodology

**How do I execute the selected stage and prove that it is complete?**

The constitution sets mandatory limits and human decision authority; this
methodology describes execution within those limits. MIGRATION.md owns session
reading and routing, while the process contract owns shared stage boundaries.
Exact artifact formats live in their domain instructions and templates. See
[document ownership](process-contract.md#document-ownership), including what to
do when documents conflict. A short reminder here is not a second governing rule.
The [constitution implementation map](process-contract.md#constitution-implementation-map)
owns the binding from principles to current stages and filenames. Procedure may
be renumbered without changing a principle; no required control is thereby waived.

The English [process contract](process-contract.md) owns repeated stage roles,
artifact access, return paths and minimum closing evidence. The detailed
procedures below explain their execution; JSON, templates and visualizations
must preserve these MD rules. Russian is only an optional 3D translation.

**Reading an artifact at a glance.** Every authored Markdown record follows the
[reading contract](artifact-reading-contract.md): purpose and responsible actor,
a scoped result summary, contents with anchors, then detailed evidence.
Red means recorded blocking findings; amber means pending or conditional work;
green refers only to explicitly approved or verified scope. Neutral notes identify
reference material or records without a single verdict. The agent updates the
summary from evidence, never from a successful formatting operation.

**Reading technical statuses.** Technical labels need a short explanation at first use: `awaiting_owner` (waiting for the human owner decision), `passed` (this check succeeded, not the whole migration). The agent retains canonical values and states the exact scope and remaining action. [Status meanings](artifact-status-meanings.md).

**Stage records distinguish established results from remaining work.** The agent
follows [artifact result boundaries](artifact-result-boundaries.md) for execution,
decision, closure and authoring records. Observations, proposals, human decisions,
unverified scope and next actions must not be presented as interchangeable.

**Independent review must show its comparison, not just its verdict.**
For Stages 2, 7, 10, 14, 16 and 19 the reviewing agent follows the
[comparison record contract](reviews/README.md#comparison-record-contract):
expected result and source, actual observation, matched/mismatch/not-checked/
not-applicable status, evidence, linked findings and reconciled totals.
Delta reviews explicitly separate rechecked items from prior unchanged
results relied on. Required unchecked scope prevents a clean result;
historical reports are never rewritten as new verification.

**Every artifact has an explicit authoring role.** The [artifact responsibility reference](artifact-responsibilities.md) names the agent, human or process that creates each family, who updates it or makes the recorded decision, and the governing stage instruction. The agent must include these roles in new artifact descriptions and retain template guidance. Raw tool output, the agent record and human approval are distinct responsibilities. Historical author metadata and immutable evidence remain authoritative for actual authorship.

For new artifact filenames, use [Artifact Naming](artifact-naming.md).
Remove the template marker and fill only declared placeholders; keep the
remaining filename stem. For example, `walkthrough-NNN-template.md` creates
`analysis/stages/stage-03/walkthrough-001.md`, and
`delivery-NNN-template.md` creates `analysis/stages/stage-18/delivery-001.md`.
Existing XPlanner examples retain their recorded names and are not naming
templates for new projects.

Agents enter the process through [`../MIGRATION.md`](../MIGRATION.md), then use
[`migration_status.yaml`](migration_status.yaml) to select the active stage.
`MIGRATION.md` is the session router: it is read first and tells the agent what
authority and current-state records to load, what work is currently permitted,
and where it must stop. **This document has a different job:** it is the detailed
process specification used after the active stage is known. For each stage it
defines the required inputs, work, actors, output artifacts, exit gate, and
return path when review fails. It does not determine the current stage; only
`migration_status.yaml` does that.

The two documents are therefore complementary rather than redundant:
`MIGRATION.md` answers **"what may I do now and where do I go next?"**; this
methodology answers **"how do I perform that stage and prove it is complete?"**
If their instructions conflict, the agent must stop and record a governance
defect. This methodology is stack-agnostic and applies to any legacy source
(web, terminal, desktop, API, messaging, or batch). The visual presentation of
the same flow lives in
[`migration_methodology.html`](migration_methodology.html). The Markdown file
is canonical; the HTML is a human-oriented view and must not introduce rules
that are absent here.

Core principle: **every legacy behavior is a row in the parity map
([`legacy_user_flows.xlsx`](legacy_user_flows.xlsx)); every row is driven to green with
evidence. A migration is proven, not claimed.**

Workbook mechanics (columns, colors, finding types, audit tooling) are defined
in [`legacy_user_flows_template_instructions.md`](legacy_user_flows_template_instructions.md)
and are mandatory. The reusable blank workbook is
[`legacy_user_flows_template.xlsx`](legacy_user_flows_template.xlsx); it is not
the governed project record and must never replace the filled map. The
[project constitution](../.specify/memory/constitution.md) must be read before
any action and overrides convenience.

## Artifact system

Every artifact this methodology names belongs to one catalog:
[`../ARTIFACTS.md`](../ARTIFACTS.md). It records, for every governed file,
its purpose, authority, lifecycle (source-only, copied, generated by the
initializer, or created during migration), owner, stages, and the audits that
consume it. Its practical guide also answers two operational questions for each
artifact family: **when and how is it used**, and **what does one concrete use
look like**. Examples illustrate the contract; they never count as project
evidence. The layers, in dependency order, are: the entry and authority
documents (`MIGRATION.md`, the constitution, the status checkpoint); the
project and environment contracts under [`config/`](../config); this process definition;
the evidence and design records (parity map, reconnaissance, prototyping,
architecture, OKF knowledge baseline, inventories); the SDD under [`specs/`](../specs); the stage and review
evidence under [`analysis/stages/`](./stages) and [`analysis/reviews/`](./reviews); and the
deterministic audit runtime under [`analysis/tools/`](./tools). Consult the catalog for
where an artifact lives and who updates it; the rules for producing it stay
in this document.

**Artifact authorship is assigned by the active stage.** The actor named in the
stage procedure creates or updates that stage's repository outputs. The linked
template defines the record structure, and only the approved input artifacts
listed for the stage may supply project content. At an owner point, the owner
answers, decides or signs; unless the artifact explicitly requires owner
authorship, the agent writes the repository file and records that decision. An
agent must never infer an owner decision or ask the owner to manufacture the
technical record manually.

**Repository navigation is part of artifact quality.** In explanatory prose,
every reference to an existing repository file or directory is a relative
Markdown link whose visible label keeps the path in code style. Commands,
identifiers, placeholders and paths that do not exist yet remain inline code.
[`audit:artifact-links`](tools/artifact-reference-links.js) enforces this rule
before an artifact is reviewed or approved.

The practical chain is:

- **Bootstrap and control:** routing documents select the rules, while
  `migration_status.yaml`, [`config/project.yaml`](../config/project.yaml), and [`config/environments.yaml`](../config/environments.yaml)
  select the current stage, exact commands, and approved stand. For example,
  Stage 17 runs the recorded test command rather than inferring one.
- **Requirements:** reconnaissance defines the territory and the parity map
  defines each behavior. For example, a failed-login row carries legacy
  evidence, its product decision, specification, test, and live result.
- **Prototyping:** normalization decides which rows need visible treatment; the
  manifest pins the resulting wireframes and owner approval. For example, a
  task-delete row maps to a confirmation state while a batch job is documented
  as non-visual.
- **Architecture and knowledge:** the workbook turns facts and client answers
  into measurable NFRs; architecture records and ADRs explain the approved
  solution; OKF packages those facts for later agents. For example, an agreed
  concurrency figure becomes a capacity NFR and a deployment decision.
- **Design:** `spec.md`, `plan.md`, `tasks.md`, traceability, and the target
  inventory define one bounded slice and its observable proof. For example, a
  time-entry row links to its requirement, implementation task, test, and route.
- **Coding:** code, tests, migrations, and the candidate PR form one reviewable
  revision. For example, the owner merges the exact SHA that passed the slice
  checks and Stage 18 deploys that SHA unchanged.
- **Delivery and acceptance:** delivery (including rollback and live reconciliation), raw journey, and
  independent acceptance records prove what happened on the stand. For example,
  a browser journey signs in, performs the changed action, checks the result,
  and signs out against the deployed revision.

## Review And Correction PRs

**One completed control pass is one records PR; its corrections are a separate PR.**
PM follows this sequence by default, without asking whether to combine the
report with its fixes. Commit/push permissions and owner-only merge authority
still apply. This is a publication boundary, not a new stage or approval.

1. **Publish the candidate.** At Stages 1-16, publish the completed authoring
   artifact set through a scoped PR before launching its next formal control.
   Run applicable local gates and required remote CI on the exact PR head; the
   owner merges. Pin the actual integrated revision in the next review packet.
   Merging a draft makes it available for control, not approved by that control.
2. **Publish the control result.** For each Stage 2, 7, 10, 14, 16 or 19 attempt,
   PM archives the unchanged reviewer report and evidence in a separate records
   PR, with only directly related, stage-permitted status/checklist/graph updates.
   The same separation applies to pre-implementation verification or owner-decision
   records that cause a return, including Stages 3 and 12. Record the actual result
   and classified return promptly; do not wait
   for fixes or pretend that the PR has already merged. Do not include changes
   to the reviewed artifacts or unrelated process maintenance in this PR.
3. **Preserve negative results.** A report with `findings`, `blocked` or `invalid`
   can be published as an honest record. Its PR must still pass the checks
   applicable to the recorded state; a negative verdict is not a failed CI run.
   Never change the verdict, erase blockers, claim a stage closed, weaken CI or
   run a success-only gate under false state to make the records PR green.
   If required CI cannot accept a truthful record, keep the PR blocked and
   escalate the gate/process conflict. Owner merge records the outcome, not
   agreement with every finding, closure of findings or permission to advance.
4. **Correct separately.** After the owner merges the control-record PR, PM
   assigns correction work on a new branch from that integrated revision.
   The author verifies each finding, fixes its owning artifacts and records
   per-finding dispositions. Corrections and dispositions form their own PR,
   linked to the triggering report and finding IDs. The old report and evidence
   remain immutable; disagreement is recorded in dispositions, not edited into
   the reviewer's conclusion. Required gates/CI and owner merge apply again.
5. **Review the corrected candidate.** Only after the correction PR is merged,
   pin its actual integrated revision and launch the next required control with
   a new numbered report. Independent controls use a fresh eligible session.
   Stage 2/19 Phase A still withholds prior findings and correction outcomes;
   Phase B reconciles them. Saving Phase A does not require its own PR.

**Example:** Stage 1 draft PR -> owner merge -> Stage 2 pass 001 records PR
(`findings`, return to Stage 1) -> owner merge -> Stage 1 correction PR -> owner
merge -> fresh Stage 2 pass 002. Each merge waits for required CI; none supplies
a separate stage-specific owner approval. Preserve the source SHA reviewed even
if merge creates another SHA; never relabel old evidence as review of the merge.

**In-flight work:** if correction work already exists when applying this rule,
PM coordinates with its writer before switching branches or moving files. Freeze
the records-only PR scope and preserve all unfinished corrections in a separate
branch/worktree or attributable snapshot, then base the correction PR on the
merged records revision. Do not reset, discard, overwrite or accidentally stage
another agent's work. Pause affected writers if safe separation is unavailable.

**Implementation and delivery boundary:** this is not a universal "merge first,
review later" rule. Stage 16 approval still precedes implementation. Stage 17
code, tests and SDD stay in one candidate PR, with clean code peer review and
required CI **before owner merge**. Stage 18 deploys that reviewed candidate;
delivery records keep the existing records-only descendant restrictions.
Stage 19 publishes acceptance evidence separately, never fixes the deployed
candidate in its review PR and never substitutes merge for owner acceptance.

PM records publication PRs, exact CI head/results and actual merge revisions in
existing PR metadata and the next mutable work/handoff record. Do not amend a
sealed review to append later CI/merge facts, add a second status file, invent
future transitions or create an extra PR merely to record its own merge SHA.
Use the [remote CI closure rule](../MIGRATION.md#remote-ci-closure) and
[return procedure](reviews/README.md#return-and-correction-protocol).

### PR Descriptions, Comments And Commits

**A PR explains the result and the owner's next decision; linked records retain
the detailed evidence.** This applies to every stage, Bootstrap and process
maintenance. PM owns the publication summary, not the reviewer's conclusion.
Use the repository [PR template](../.github/pull_request_template.md) explicitly,
including with CLI/API clients that do not load it automatically. Keep published
PR text and commit messages in English. The template is a writing aid, not a
new gate, approval record or substitute for the current-stage checkpoint.

**Title and first screen:** name the stage number AND stage name, or Bootstrap /
Process maintenance, followed by the concrete outcome. Say what changed and
whether independent verification remains pending before listing technical IDs.
Use the same six sections for every PR:

| Section | Required content |
|---|---|
| Purpose | Stage/slice or maintenance scope, kind of PR, why it exists and its actual outcome in one or two sentences. |
| Changes | A short list of meaningful changes and their practical effect; normally three to five bullets, fewer for small changes. |
| Verification | Separate local checks, required remote CI and independent review. Give actual outcomes, checked revisions and links; explain pending, unavailable or not-required checks. |
| Open Items | Remaining findings, unverified scope, exclusions and blockers. None only when established. |
| Owner Action / Next | The exact decision needed now, what merge means and does not mean, then the next responsible role/action and prerequisites. No action yet is valid while blocked. |
| Evidence | Link the triggering/previous PR, review and correction/follow-up PR when they exist. Give two to four key record links; put detailed trace in a collapsed block or linked report. |

Use descriptive clickable links in the PR body. Evidence links point to the
actual repository and immutable commit/path (plus anchor/line where useful),
not a moving default branch. Related PR/run links retain their native URLs.
Do not fabricate future PR links. Preserve useful task/pass, F-NNN/B-NNN and
CHK-NNN IDs with a short meaning; explain counts and their units. Distinguish
"author accepted the finding", "correction prepared", "independent recheck
passed" and "owner approved". Bare "accepted" is not a closure claim. A green
local audit or merged records PR is not a clean independent verdict.

**Keep one current PR summary.** Refresh the body after each push, material
scope/result change and before asking for a decision. Before handoff, PM reads
the actual PR body back and reconciles it with the latest diff, records and
GitHub checks. Record the current full PR head separately from the reviewed
source revision; a records-only PR can legitimately publish a review of an
earlier source. Local checks identify their actual revision or working snapshot.
After a new push, previous-head CI is historical, not current success: mark
current-head verification pending until its required runs finish. List required
workflow results and run links, with failed/skipped/unavailable checks explicit.
Independent review may be pending/not required for this PR only under the
existing stage/publication rules; do not invent a new pre-merge control.

Retain earlier failures in linked evidence or run history. Once merged, the
summary describes that PR's historical outcome and actual integrated revision,
not today's project state. If a stale merged summary needs correction, add a
dated clarification grounded in the original commits; do not silently rewrite
old claims or fabricate approval. Do not bulk-rewrite old PRs on adoption.
Keep later publication facts outside sealed reports and retain the existing
rule against an extra PR merely to record its own merge SHA.

**Comments are an event log, not duplicate reports.** Comment for a new blocker,
material scope/result change, a specific owner question, or readiness for the
owner after required checks pass. State what changed, its effect, the requested
action and a link to the relevant section/evidence in a few lines. Do not post
polling updates, copy full tables after every push or maintain a second
"current status" comment alongside the body. Reviewer discussion keeps finding
IDs; PM summarizes it without changing the reviewer's verdict. Human decisions
still need the stage's durable repository record with actual attribution.

**Commits remain understandable offline.** Use an intent-bearing title with the
stage name/scope and concrete change. In a short body record why the change was
needed, what changed, relevant boundaries or pending verification, and links
through repository-relative paths plus finding/pass IDs and source revisions
where applicable. Do not copy the PR essay, predict future CI/merge results or
try to put a commit's own hash in its message. Never rewrite existing commit
history just to adopt this format. If squash is selected, PM prepares the same
self-contained summary for the owner without losing the evidence references;
the merge decision remains the owner's.

All publication text follows [credential-safe evidence](agent_orchestration.md#credential-safe-evidence).
PRs/comments are not permitted blind Phase A inputs merely because they are
easy to browse. The existing phase isolation, separate control/correction PRs,
owner-only merge and exact-head CI rules are unchanged. Structural template
tests cannot prove that a real PR is current, readable or factually correct;
PM must perform the read-back above. No extra JSON manifest or status file is
required for this communication contract.

## Stage Control

- [`analysis/migration_status.yaml`](./migration_status.yaml) is the only current-stage checkpoint.
  Bootstrap creates it once; it is then a standing input and updated output of
  every Stage 1-19. PM reads it before work and updates the same file from
  specialist evidence before handoff after a durable transition, return, gate result,
  blocker, or owner decision. Do not rewrite it for polling or every internal
  action.
- Its `progress.summary` is orientation text, but `completed_percent` is a
  machine-checked formal value: the percentage of the contiguous Stage 1-19
  prefix closed before `control.current_stage`. Parallel or provisional slices
  are reported under `delivery` and never increase formal progress. Update the
  summary at durable checkpoints (completed batch, correction, slice,
  deployment, or acceptance), not on polling noise. External-review counters distinguish
  started sessions, usable reports, historical failures, active sessions, and
  unresolved blocked scope.
- A stage starts only when its prerequisites and actor requirements are met.
- Automated checks prove technical invariants but never imply owner approval.
- Owner approval is recorded explicitly; it cannot be inferred from a merge,
  a successful test run, or an agent statement.
- If a stage cannot be executed, record the blocker and leave affected rows
  unverified. Skipping a stage does not count as completing it.
- Advancing beyond a blocked stage requires an explicit owner decision in
  [`analysis/migration_status.yaml`](./migration_status.yaml), including approver, date, rationale, scope,
  residual risk, and permitted next stage. For an unavailable Stage 3, the
  owner chooses `simulate` or `waive`; neither completes the unobserved real
  scope or verifies affected rows.
- Stages 2, 7, 10, 14, 16, and 19 produce immutable reports under
  [`analysis/reviews/`](./reviews) and append their result to `review_passes` in the status
  file. A clean result in chat is not a completed gate.

<a id="stage-00"></a>
## Bootstrap Execution

### Bootstrap Gate Report (`bootstrap-gate-report.md`)

<!-- AGENT_ROLE_B_START -->
**Role and skill.** PM / Coordinator (coordination). PM coordinates; the assigned session reads .agents/skills/migration-pm/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_B_END -->

<!-- ERROR_PREVENTION_B_START -->
**Error prevention.** The initializer creates one empty error-prevention-checklist.md. The Bootstrap agent validates it; confirmed setup errors may supply reusable checks after admission and deduplication. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_B_END -->

Follow [Bootstrap In Practice](../MIGRATION.md#bootstrap-in-practice), the single
detailed Bootstrap procedure. It governs constitution-version equality even
before ratification, approved source-only test baselines and setup boundaries.
The initializer creates the pending fixed report from
[`bootstrap-gate-report-template.md`](./stages/templates/bootstrap-gate-report-template.md);
the Bootstrap agent maintains it from actual results, while PM records status
and the owner separately decides ratification and Stage 1 authorization.

Public-safe initialization creates an `unconfigured` environment without
inherited credentials or server settings. This permits structural Bootstrap
validation, not remote access. Before any remote action, configure owner-approved
access and pass `audit:environment -- --require-configured` under
[the remote-operation contract](../MIGRATION.md#command-contract).

[Bootstrap Evidence And Blockers](../MIGRATION.md#bootstrap-evidence-and-blockers)
governs immediate recording before remediation approval, row-derived report
totals, bounded owner-authorized link corrections and unchanged immutable
evidence. A report reference never justifies inventing a transition.
For initialized projects, follow
[Bootstrap Maintenance](../MIGRATION.md#bootstrap-maintenance), not another
initializer run. Synchronization preserves project state and grants no approval.

## Project Execution Contract

[`config/project.yaml`](../config/project.yaml) is the machine-readable execution contract of one
initialized migration project. It is not authored from scratch: the starter
ships [`../config/project.template.yaml`](../config/project.template.yaml), and
`init-migration.ps1` renders that template into [`config/project.yaml`](../config/project.yaml) with the
project identity. The generated file then records:

- the project id, name, owner, and initialization timestamp;
- the exact legacy-source, target-source, and environment-contract paths;
- the target runtime/OS platforms approved with the architecture;
- the exact `build`, `test`, `visual_parity`, `deploy`, `smoke`, `user_journey`,
  and `rollback` commands, their working directories, and required environment
  variable names.

Commands intentionally start as `null` and become mandatory only at their
declared stages. A required null command is a hard stop: agents and CI must not
guess a command from the detected technology. [`config/project.yaml`](../config/project.yaml) says what
to execute and from where; [`config/environments.yaml`](../config/environments.yaml) separately says which
governed environment, endpoint, host identity, and deployment root to use.

## Legacy Reconnaissance Record

The starter ships
[`legacy_reconnaissance.template.md`](legacy_reconnaissance.template.md), and
`init-migration.ps1` instantiates it as [`analysis/legacy_reconnaissance.md`](./legacy_reconnaissance.md) for
the project. Stage 1 fills this record from legacy source evidence. It is the
system-level inventory and provenance boundary for discovery, recording:

- the pinned legacy source revision and explicit exclusions;
- languages, frameworks, modules, entry points, screens, APIs, jobs, tests,
  build descriptors, deployment assets, and operator surfaces;
- runtime prerequisites plus data stores, files, queues, identity providers,
  schedulers, and external integrations;
- commands actually executed and their evidence, separately from plausible but
  unexecuted commands;
- unknowns, inaccessible areas, blockers, and the exact boundary of what must
  be represented in the parity map.

`legacy_reconnaissance.md` is not a requirements document, an implementation
plan, or a replacement for `legacy_user_flows.xlsx`. The reconnaissance record
describes **what was inspected, where it lives, how it runs, and what remains
unknown**; the parity map turns the discovered user-visible behavior into one
atomic, checkable scenario per row and tracks each scenario through migration.
In plain language, reconnaissance is the **map of the legacy territory**;
the parity map is the **behavior checklist for the migration**.
Stage 2 reads the reconnaissance record only after completing its independent
blind inventory, then checks both records for omissions and unsupported claims.

## Review Report Numbering

Every independent stage owns its own immutable pass series. A new project
starts each series at `001`:

- Stage 2: [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md);
- Stage 7: `analysis/reviews/stage-07-pass-001.md`;
- Stage 10: `analysis/reviews/stage-10-pass-001.md`;
- Stage 14: `analysis/reviews/stage-14-pass-001.md`;
- Stage 16: `analysis/reviews/stage-16-pass-001.md`;
- Stage 19: `analysis/reviews/stage-19-pass-001.md`.

Never reuse or rewrite an existing report. The `review_passes` ledger in
[`analysis/migration_status.yaml`](./migration_status.yaml) is the authoritative stage-to-report mapping.

Each review session id is unique. A closing pass applies only to the exact entry
into its control stage: if the process returns and re-enters Stage 2, 7, 10, 14,
16, or 20, the earlier pass is stale and a new eligible session must run before
the stage can be left again. All control stages require a clean pass except the
explicitly governed Stage 7 Low-cosmetic exception defined below. A reviewer that
authored anything in scope records an `invalid` attempt and does not continue
substantive review.

## Actors

For the high-level interaction model, see the
[agent system overview](agent-system-overview.md). The normative
[role contract](agent-roles.md) assigns PM, BA, UX, Architect, Developer and QA
to all stages and defines explicit skill loading, delegation and durable handoffs.
Six specializations do not mean six permanent sessions. PM delegates specialist
work; support is on demand. Native client personas or skill discovery are not required.

**How the instructions connect:** [MIGRATION.md](../MIGRATION.md) routes the
session to authorized work; this methodology defines how to perform that stage.
The [role contract](agent-roles.md) identifies the lead, skill and communication
rules. The specialist reads the stage procedure and its assigned skill; neither
the role name nor the skill replaces the procedure.

**Three distinct messages:** PM sends the assignment and instruction paths.
The specialist first returns ACK (acknowledgement: instructions read and task
boundaries understood), then performs the work and returns RESULT with exact
files, checks and gaps. ACK travels back to PM; it is not task completion or
approval. A reviewer receives a phase-appropriate review packet and returns its
report with evidence. PM verifies the handoff; required reviews and human
decisions still govern continuation. The role contract owns the detailed fields.

- **Owner** — the human project owner. Only the owner approves SDD, merges
  PRs, and signs acceptance.
- **Human-in-the-loop gates** require the owner to approve bootstrap to Stage
  1; an incomplete Stage 3 fallback; revised requirements at Stage 4;
  application form/style at Stage 5; wireframes at Stage 8; architecture at
  Stage 11; the Stage 16 SDD scope before implementation; every merge; and
  Stage 19 continuation or final acceptance. The agent **stops and asks the
  owner for explicit confirmation**; it must not proceed on its own and must
  not assume, infer, or simulate the human decision.
- **PM / Coordinator** — routes authorized work, delegates with an exact skill
  path, checks ACK/results and integrates shared records. It requests human
  decisions; it does not grant them or substitute itself for specialist sessions.
- **Primary / responsible agent** — the stage lead named by the role contract,
  not automatically PM. BA owns requirements, UX owns the UI baseline,
  Architect owns architecture/knowledge/SDD, Developer owns implementation and
  delivery, and QA leads assigned behavioral controls.
- **Repository recording rule** — unless a step explicitly assigns creation to
  the initializer, the active-stage agent creates or updates repository
  artifacts. The owner, client, business participant, or developer supplies
  answers, decisions, approval, and domain evidence; the agent records them
  exactly and links them to the governed source. An independent control report
  is created only by the eligible fresh independent agent performing that
  review. Role names such as "architecture reviewer" describe the agent's role,
  not an additional human author.
- **Independent agent** — a *different* agent (fresh context, no shared chat
  history) used for control and re-verification stages. An agent never
  verifies its own work. Before every Stage 2, 7, 10, 14, 16, or 19 pass, it
  checks its eligibility: if its current context contains creation or editing
  of an artifact in scope, it self-disqualifies and requests a fresh agent.
  Every iteration uses an eligible fresh agent.
- **Orchestrator** — PM transporting deterministic assignments, review
  packets and challenge responses using the available approved runtime. Orchestration
  removes owner message relay but does not transfer the independent reviewer's
  conclusion to the primary agent and does not grant approval authority.
- **Automated gate** — a check that must pass before the flow may continue
  (tests, workbook audit script, smoke test).

For every new/reopened assignment: PM records scope, permitted inputs, exact
skill/procedure revisions, write ownership and the required result. The receiver
reads the skill and returns ACK, reports uncertainties as QUESTION or BLOCKED,
then returns RESULT with artifacts, checks, CHK self-check and remaining gaps.
Use the existing stage work/evidence record; preserve the transcript rather than
create another status artifact. PM routes findings to the responsible author and
requests the next required fresh review. [Full protocol](agent-roles.md).

### How to read a gate

<!-- GATE_REVIEW_BOUNDARIES_START -->
**Read the question first, then check who does the verification.** Each gate names its files and distinguishes automatic checks, agent review, owner decisions and result records. See [all gate inputs and limits](gate-review-guide.md).

**SDD handoff and its gate.** The Stage 15 agent creates sdd-record.md as a source-bound design handoff, not a machine gate receipt. The independent Stage 16 agent must read it and verify its source versions, coverage, assumptions and gaps against the actual SDD and approved inputs. audit:sdd checks the SDD package, but does not parse this report. Its green result is not approval of the report; the Stage 16 gate also requires applicable audits, a clean independent report and explicit owner decisions before implementation.
<!-- GATE_REVIEW_BOUNDARIES_END -->

Every gate has four practical parts: **why it exists**, **when and how it is
used**, **one concrete pass or failure example**, and **the implementation or
durable evidence to inspect**. For example, `audit:ui-parity` is run for a
UI-impacting Stage 17 candidate and again after Stage 18 deployment; it compares
the exact approved wireframes and manifest with the implementation, and fails
when a changed screen, role, state, icon, style or interaction is missing even
if functional tests pass. The complete gate-by-gate reference is maintained in
[`analysis/tools/README.md`](tools/README.md) and projected into the 3D canvas.

## Working principle: depth over speed

At every stage, agents investigate the complete required scope instead of
claiming coverage from sampling. **Depth does not mean restarting a stage on
return.** Authoring corrections follow
[Correction Scope And Handoff](reviews/README.md#correction-scope-and-handoff):
findings, affected dependencies and related occurrences are checked thoroughly;
valid unaffected work is retained. Wider authoring needs recorded impact evidence.
Required full independent passes, automated gates and owner decisions keep their
own scope. Never substitute a narrow author self-check for a required control.

## Stop criterion for re-checks: the dry pass and the Stage 7 exception

Every executable return loop — Stages 2, 3, 4 → Stage 1; Stages 7, 8 →
Stage 6; Stages 10, 11, 12 → Stage 9; Stage 14 → Stage 13; and Stages 16, 18,
19 → Stage 15 —
closes not after a fixed number of repetitions but on a **dry pass**: a full
pass that yields not a single new finding. No fixed number of iterations is
promised. This is a control exit criterion, not an instruction to redo all
authoring on each return. Stage 7
has the only explicit exception: a closing pass may carry Low cosmetic findings
only under the owner criterion below, with every finding dispositioned in the
pass-linked polish backlog and no unchecked scope.
The same dry-pass rule governs deeper returns. A finding goes back to the
lowest artifact authority that can correct it: Stage 17 for implementation,
Stage 15 for SDD, Stage 13 for synthesized knowledge, Stage 9 for architecture,
Stage 6 for prototype structure, Stage 5 for a deliberate channel or
design-system change, and Stage 1 for a parity-map defect. A local correction
remains inside its current stage and is not recorded as a synthetic self-loop.
The exact legal pairs are listed in [Loops](#loops-return-arrows) and enforced
by `migration_status.schema.json`.
Stages 2, 7, 10, 14, 16, and 19 require a fresh independent agent for every pass.
Working iterations in Stages 3, 4, 12, 13, and 18
may use the responsible primary agent unless a stage-specific decision
requires otherwise. When Stage 3 cannot be executed, its recorded `simulate`
or `waive` owner decision replaces the dry-pass gate only for progression; the
unobserved real scope remains incomplete.

A waiver does not remove a numbered stage from the governed history. The stage
is verified by an eligible independent pass at the next applicable control
stage. That pass checks the exact scope-specific waiver, its durable record,
residual risk, permitted next stage, and the absence of applicable unwaived
work; the process cannot leave that control stage without the link. Such a pass
may be `clean` about process consistency while the waived runtime behavior
remains explicitly unverified.

**Did the owner authorize this specific exception, for what scope and under which conditions?**

Each waiver is a separate owner decision for one exact gate and scope with ID
`waiver:<gate>:<exact-scope>`. The fixed registry is:
`legacy_walkthrough_fallback` -> Stage 4, `application_form_style` -> Stage 6,
`prototyping_retroactive` -> Stage 6, `architecture_retroactive` -> Stage 9,
and `pre_sdd_knowledge` -> Stage 15. The last gate is valid only for one bounded
slice whose applicable architecture decisions and owner record are already
explicit; it never waives the full architecture/knowledge chain or another slice.
Its canonical record lives in `analysis/stages/waivers/` and contains decision,
owner, timestamp, scope, rationale, record path, residual risk, and permitted
next stage.

## Phase groups

For presentation and planning, the numbered stages are grouped into phases:
**Requirements** (Stages 1–4), **Prototyping** (Stages 5–8: application form
and style, wireframes, their control and approval), **Architecture and knowledge**
(Stages 9–14: legacy architecture discovery, target architecture requirements/document, control, owner review,
remark verification, OKF synthesis, and independent OKF control), **Design**
(Stages 15–16: SDD and its re-verification), **Coding**
(Stage 17), **Deployment & QA** (Stages 18-19). Grouping
changes no rules: loops, gates, and actors stay per-stage; the cross-phase
return QA → Design is the Stages 18-19 → Stage 15 loop.

## Maturity and open research

Two phases are normative but deliberately young. The presentation marks
Prototyping as "in progress, ~70%" and Architecture and knowledge as
"in progress, ~50%":

- **Prototyping (Stages 5–8)**: its rules are expected to be extended and
  refined as projects run through it. Open question of the phase: whether
  wireframes should become part of the SDD or remain a separately approved
  artifact, as they are today.
- **Architecture and knowledge (Stages 9–14)**: being exercised on a live project right
  now; its rules will grow from that experience. Open question of the phase:
  how Draw.io collaboration and OKF consumption can be made increasingly
  automatic without weakening manifest-pinned checkpoints.

## Error Prevention Across Stages

**Which confirmed mistakes must the next agent avoid repeating?**

Use one [error-prevention-checklist.md](error-prevention-checklist.template.md)
per project: **Check / When applicable / Basis / How to check**. Before work,
read applicable rows; before handoff and after fixes, check the actual result.
After each control pass or confirmed error, generalize only reusable checks,
validate their basis and search for an equivalent row before inserting.
Independent reviewers propose; the coordinator maintains; the owner may prune.

Record short self-check and learning outcomes in the current work/review record
or `migration_status.yaml.control.prevention_self_check`, not in the table.
Stages 2 and 19 withhold learned checks and prior notes until Phase B.
No self-check replaces full review or owner approval.
[Mandatory admission, timing and recording rules](error-prevention.md).
This is implemented process guidance, not a guarantee of error-free revisions.

**Real XPlanner example:** [open the filled error-prevention checklist](https://github.com/olsys-ltd/xplanner2/blob/2c76d4e081d2fa852bb48e29d74d943b22902c94/analysis/error-prevention-checklist.md).
Ten source-linked checks cover discovery, UI, architecture and implementation.
Read a row from **Check** to **How to check**; **Basis** opens the confirmed
correction and governing rule. The historical import applies to new/reopened
work; it is not an exhaustive history audit or evidence that past agents used
the checklist. This learned example is also withheld during blind Phase A.

**Under active research (cross-stage).** How to scale reconnaissance for a
large repository. The working hypothesis is a required navigational source
inventory covering modules, entry points, dependencies, external integrations,
and already-examined coverage, so agents can work in slices, return to known
areas, and avoid rescanning the entire codebase on every pass.

**Feature dependencies are governed.** Use one source-backed graph of bounded delivery slices, separate contract and completion prerequisites, and bind the reviewed scope into SDD. [Mandatory procedure](feature-dependencies-guide.md). The [separate dependency view](feature-canvas/index.html) is derived from that file, not a second editable model.

**Under active research: baseline / as-is architecture (proposed, not yet a
separate stage).** Consider adding a step to the architecture phase, before
target architecture design, that answers **How is the existing application
structured today?** The agent would synthesize source-backed discovery and
runtime evidence into a view of components, their responsibilities and
dependencies, data stores and flows, integrations and deployment topology,
with unknowns kept explicit. Define its boundary with reconnaissance, required
artifacts and verification, so it reuses discovered facts rather than duplicating
the inventory or confusing the current architecture with the target design.

Until these are settled the stages apply as written — maturity is a statement
about future additions, never a permission to skip or improvise.

## Iterative delivery loop from Stage 17

Stages 17-19 are not one big-bang pass over the whole approved backlog. Select
one approved feature or a small, tightly related group as a **delivery slice**
and repeat this loop:

1. **Stage 17 — Build:** implement and test only the selected slice;
   synchronize its SDD, tasks, and workbook rows in the same PR. After tests
   pass, run a read-only external-agent peer review of the requirements and
   diff; verify every finding and use at most two evidence-based discussion
   rounds.
2. **Stage 18 — Delivery and live reconciliation:** deploy and run required
   checks, discover live scope and reconcile it with the map, SDD, prototype
   and inventory. Cite applicable observations, explore missing coverage and
   record findings in the same delivery report. A login, HTTP status or heading
   alone is not proof of a useful action. Unverified required scope blocks closure.
3. **Stage 19 — Slice acceptance:** an eligible independent agent checks the
   delivered slice. Findings return to Stage 17, Stage 15, Stage 9, or Stage 1
   according to whether the defect is in implementation, SDD, architecture, or
   the parity map. The corrected slice then repeats the affected controls. A
   clean accepted slice releases selection of the next slice.

The whole approved backlog MUST NOT be implemented before this feedback is
collected. When every slice is accepted, Stage 19 runs once more as the final
consolidated acceptance of the complete migrated system.

## Living Architecture Loop

The first architecture outcome is a **Foundation checkpoint**, not a complete
design of the future system. It closes only the stable decisions required to
create, test, migrate, deploy, smoke, and roll back the first operational
skeleton. The main `analysis/architecture/architecture.md` is the architecture
hub and code-start gate; concern-specific records live under
`analysis/architecture/sections/` and link to material ADRs. Foundation changes
receive explicit impact analysis because they can rewrite many delivered slices.
Identity, localization, integrations, operations, and feature mechanics close
incrementally before the first slice that depends on them.

Architecture is not frozen after the first owner-approved checkpoint. During SDD,
build, delivery/live reconciliation, or acceptance, every material finding is first
classified by the lowest authority that can correct it:

1. **implementation-only defect** — remain in or return to Stage 17;
2. **SDD defect with valid architecture** — return to Stage 15;
3. **architecture defect, missing decision, or new system boundary** — reopen
   the affected Grade decisions and return to Stage 9;
4. **parity-map defect** — return to Stage 1.

The return route and the point at which delivery resumes are explicit:

| Finding class | Return route | Resume route |
|---|---|---|
| Implementation only | Stage 17 | repeat Stages 18-19 for the corrected slice |
| SDD defect, architecture remains valid | Stage 15, then fresh Stage 16 control | Stage 17 and repeat Stages 18-19 |
| Architecture defect or missing system-shaping decision | affected Grade decisions through Stages 9-12, then refresh and control knowledge at Stages 13-14 | update the affected feature SDD at Stage 15, repeat Stage 16, then resume at Stage 17 |
| Parity-map defect | Stage 1 and repeat only the downstream gates invalidated by the corrected map | Stage 15-19 for every affected slice |

An architecture return is a scoped evolution cycle, not a reset of the whole
project. The affected decision scope repeats Stages 9-12, dependent decisions
are marked stale, and target knowledge repeats Stages 13-14. The affected
feature specification is updated at Stage 15 against the newly approved
architecture, receives a fresh Stage 16 control, and resumes implementation at
Stage 17. Unaffected
approved decisions remain valid. A change reopens only the decisions and slices
that actually depend on it. Code or one feature SDD
must never silently override the approved architecture record. Updated hashes
pin the new artifact versions internally; they are evidence of synchronization,
not a separate business step or a substitute for the repeated gates.

The first two SDDs after Foundation are normally:

1. **solution foundation** — repository/solution skeleton, application and
   module boundaries, executable quality gates, health and local tests;
2. **demo deployment baseline** — database dependency, explicit migrations,
   packaging, configuration, reverse proxy, deploy, smoke, persistence proof,
   and rollback.

Before those two SDDs may enter implementation, the exact workbook and
architecture set must carry an `approved-for-delivery` Foundation verdict and
`npm --prefix analysis/tools run audit:architecture:foundation` must be green.
This limited gate does not close Stage 9, Stage 10, or Stage 11 for the whole
system; it authorizes only the named code-start slices.

They prove the architecture can run before business-feature volume grows. The
owner selects the first thin vertical business slice only after these two slices
are accepted.

## Cross-agent execution and context safety

The primary agent invokes Claude Code, Antigravity, Codex, or an equivalent
approved external CLI directly for the mandatory slice peer review, so the
owner does not relay review messages. Every such
invocation follows
[`agent_orchestration.md`](agent_orchestration.md): deterministic review packet,
new session, read-only isolated revision, structured findings, independent
validation by the primary agent, and no more than two discussion rounds.

Large scopes are divided into explicit batches with persisted checkpoints.
After `/compact` or a fresh-session continuation, the reviewer must acknowledge
the packet identifier, revision, completed scope, and remaining scope before
continuing. Context overflow, timeout, lost acknowledgement, repository
mutation, or incomplete batch coverage makes the review `blocked`. A formal
Stage 2, 7, 10, 14, 16, or 19 conclusion still belongs to the eligible external
reviewer;
model agreement never replaces automated evidence or owner approval.
No packet may send sensitive credentials, personal data, regulated data, or repository
content not approved for the selected service. If complete safe evidence cannot
be sent, the review is blocked until the owner selects an authorized reviewer
or environment.

Every stage follows [credential-safe evidence](agent_orchestration.md#credential-safe-evidence):
new records cite source locations instead of copying credential values, including
factory defaults. Authors and reviewers check before handoff or freezing Phase A;
PM checks before transmission/publication. Record scoped results and limitations
in existing records. Public-data classification, live access risk and remediation
of sealed evidence are separate decisions; neither prior exposure nor a pinned
hash permits disclosure of a secret. Generic guidance does not release learned
checks or project decisions into blind Phase A.

Review worktrees and scratch directories are disposable execution state.
Durable reports and the minimum auditable prompt/response/checkpoint packet are
consolidated under [`analysis/reviews/`](./reviews); duplicate checkouts, rendered copies,
dependency folders, and external `*-review`/`*-evidence` directories are
removed before the review is considered operationally complete.

## Stages

<a id="stage-01"></a>
### Stage 1 — Reconnaissance (legacy code → parity map)

<!-- AGENT_ROLE_1_START -->
**Role and skill.** Business Analyst (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Support on demand: Architect. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_1_END -->

<!-- ERROR_PREVENTION_1_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_1_END -->

<!-- STAGE_QUESTION_1_START -->
**What does the legacy system actually do, and what evidence supports it?**
<!-- STAGE_QUESTION_1_END -->

<!-- STAGE_REENTRY_1_START -->
**On return to Stage 1.** Conditional input on any return: the exact record cited by migration_status.yaml, its finding IDs and linked evidence. The examples below cover Stages 2-4; a later stage supplies its own triggering record. These records are not required on the first entry. File links open the starter templates.

- [reviews/stage-02-pass-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/reviews/stage-NN-pass-NNN-template.md): Stage 2: independent review findings about missed or misinterpreted legacy behavior.
- [stages/stage-03/walkthrough-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/walkthrough-NNN-template.md): Stage 3: walkthrough findings, observed behavior and runtime evidence that contradict or extend the map.
- [stages/stage-04/stage-04-requirements-revision.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/stages/templates/stage-04-requirements-revision-template.md): Stage 4: mapping errors found during requirements revision. An owner decision to change correctly recorded legacy behavior stays at Stage 4.

1. After the owner merges the triggering record PR, PM assigns a separate correction branch with the exact trigger, baseline and impact boundary. Preserve in-flight work. The primary agent verifies the findings and relevant unresolved items against source, configuration and runtime evidence.
2. Correct affected map rows and reconnaissance sections, dependent claims and all occurrences of the same failure mechanism across affected roles and channels, not just reported lines. Preserve valid artifacts, decisions and evidence at their existing identities; explain why their inputs and dependencies remain valid. This is not a restart of Stage 1.
3. Widen authoring only with recorded evidence of an unreliable baseline, changed inputs, systemic omissions or impact that cannot be bounded. Investigate uncertainty first; record why retained evidence is insufficient. PM revises the boundary within existing authority; changed approved scope or reserved decisions require the owner.
4. Record finding IDs, dispositions, changed rows/files, related-occurrence coverage, retained work, actual checks/results, unknowns and the separate next control. PM validates the bounded diff and handoff before accepting RESULT or requesting control, and updates shared status. Publish the correction PR; mandatory gates, including repository-wide gates, CI and owner merge remain required. Original reviews stay immutable; retained checks are not new runs.
5. After the correction PR is merged, a fresh eligible Stage 2 agent performs a new full in-scope blind Phase A on the integrated revision, saves it, then performs two-way Phase B reconciliation. Previous findings, correction plans and outcomes remain withheld until Phase B. Impact-scoped author corrections do not narrow control scope or replace independent acceptance.

[Return instructions](reviews/README.md#stage-1-re-entry) · [Real XPlanner correction record](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-01/stage-02-pass-001-dispositions.md)
<!-- STAGE_REENTRY_1_END -->

- Extract behavior **from legacy code only** — not from documentation, not
  from memory. Narrative docs may hint where to look but are never evidence.
- Every user-visible scenario becomes one workbook row with concrete evidence
  (file/class/page/route), following the workbook instructions.
- Real systems hide secondary flows; treat the first pass as a draft.

<a id="stage-02"></a>
### Stage 2 — Control reconnaissance (second agent)

<!-- AGENT_ROLE_2_START -->
**Role and skill.** Business Analyst (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_2_END -->

<!-- ERROR_PREVENTION_2_START -->
**Error prevention.** Phase A: do not open the learned checklist, its extracts or prior self-check/learning notes. Save independent observations first. Phase B: read the pinned checklist, check applicable rows and reconcile with those observations. In Checklist Review, link each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_2_END -->

<!-- STAGE_QUESTION_2_START -->
**Did we miss or misinterpret any legacy behavior?**
<!-- STAGE_QUESTION_2_END -->

<!-- RECORD_BOUNDARY_2_START -->
**Phase A: independent discovery. Phase B: reconciliation**

- Phase A: inspect the immutable legacy source without reading the filled map, reconnaissance or prior conclusions
- Save an A-NNN inventory with source evidence, a durable snapshot reference and access sequence before Phase B; no duplicate Excel or reconnaissance is required
- Phase B: open the pinned Stage 1 records and check both directions: discovered behavior to recorded coverage, and recorded claims back to source
- Resolve disagreements from the legacy source. Preserve Phase A; record reviewer corrections separately instead of rewriting the first inventory
- Report matched, mismatch, not-checked and not-applicable checks with evidence, linked findings/blockers and reconciled totals

The fresh independent reviewer writes one final immutable report. Temporary notes alone are insufficient. Early exposure invalidates the blind pass; findings return to Stage 1. Live verification belongs to Stage 3.
<!-- RECORD_BOUNDARY_2_END -->

- A **fresh eligible independent agent**, with no shared authoring context,
  works read-only from the exact immutable legacy revision. It must not create
  or edit the reconnaissance record or parity map under review.
- The pass has two ordered phases. **Phase A — blind source inventory:** the
  reviewer inventories executable legacy behavior before reading the filled
  map, `legacy_reconnaissance.md`, or prior conclusions. **Phase B — diff:**
  only after persisting that independent inventory does it compare the two
  Stage 1 records for missed flows and scenarios, broken evidence references,
  wrong statuses, and unsupported claims.
- Every attempt is written to the next immutable
  `analysis/reviews/stage-02-pass-NNN.md` declared by the status file, with one
  result: `clean`, `findings`, `blocked`, or `invalid`. The reviewer records
  findings but never corrects the map itself.
- **Every finding loops back to Stage 1**: the primary work corrects and
  extends the map, reruns its audit, and a new eligible fresh session performs
  another complete Stage 2 pass. Earlier reports are neither edited nor reused.
- The stage is closed only when the current stage entry has a **clean** report,
  the pass is appended to status history, no blocked scope remains, and the
  workbook audit succeeds. Stage 2 has no owner approval gate and does not
  provide live evidence; Stage 3 performs the runtime walkthrough.

The agent follows the [Stage 2 blind inventory and reconciliation procedure](reviews/README.md#stage-2-control-reconnaissance)
and the two explicit Phase A / Phase B sections in the review template.
The saved first inventory is review evidence, not a second canonical workbook
or reconnaissance. Filled Stage 1 inputs stay unread until that snapshot exists.

<a id="stage-03"></a>
### Stage 3 — Live legacy walkthrough (deploy and walk everything)

<!-- AGENT_ROLE_3_START -->
**Role and skill.** Business Analyst (responsible-agent verification). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. PM obtains owner-approved access and runs the legacy deployment; BA verifies behavior and records the actual deployment handoff. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_3_END -->

<!-- ERROR_PREVENTION_3_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_3_END -->

<!-- STAGE_QUESTION_3_START -->
**Does the running legacy system behave as our analysis predicts?**
<!-- STAGE_QUESTION_3_END -->

<!-- RECORD_BOUNDARY_3_START -->
**What was actually verified**

- Exact revision, environment, roles and scoped checks
- Expected condition versus actual observation, with evidence
- Passed or matching checks, differences and unexecuted scope kept separate
- Outstanding IDs, responsible actor, retry condition and next gate

Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

**Exception without invented verification**

- Exact allowed rule, scope, human authority and decision
- Blocked activity and still-unverified items
- Permitted next stage and gates not waived
- Responsible actor, expiry/re-entry condition and later closure evidence

Only an explicitly permitted exception can authorize progression. An approved waiver never means that the skipped check passed.
<!-- RECORD_BOUNDARY_3_END -->

For a map defect, the Stage 3 agent cites the exact `stage-03/walkthrough-NNN.md`,
finding IDs and linked runtime evidence in the status return. The Stage 1 agent
checks that evidence alongside code/configuration and records corrections using
the [re-entry procedure](reviews/README.md#stage-1-re-entry). After correction,
a fresh Stage 2 pass precedes re-entry to Stage 3; an observation is not silently
discarded just because the earlier source analysis disagrees.

- The map built from code is a hypothesis. Deploy the legacy system and walk
  it as a real user would, whatever the technology:
  - web UI — click through **every page, link, and form**;
  - terminal or desktop client — execute **every screen and transaction**;
  - API — call **every route**;
  - batch — run the jobs.
- Before deployment or live checks, PM requests missing owner-approved server
  access, application URLs and role accounts, test data and action permissions.
  Follow [the PM access/deployment handoff](../config/REMOTE_SERVER.md#configure-before-remote-work).
  PM validates the configured environment and host identity, runs the approved
  legacy procedure (or verifies an existing baseline), and hands BA exact revision
  and sanitized execution evidence. BA owns the walkthrough and comparison, not
  deployment approval. The report records the grant, actual operator and checks.
  Missing permission or access blocks the affected action; never silently choose
  simulation or borrow another project's credentials.
- Compare everything observed against the map. Behavior with no row → add the
  row (**loop back to Stage 1**). A row that cannot be observed or deployed
  stays explicitly *unverified* in the map — never "assumed working".
- If a complete live walkthrough is unavailable, too costly, or impractical,
  the agent MUST stop and ask the owner to choose one of two fallback modes. It
  must not select a mode or build mocks on its own:
  - **simulate** — build the smallest useful emulator, stub, contract harness,
    or mock from traceable legacy code/contracts, then execute the observable
    flows against it;
  - **waive** — perform no substitute run and continue based on static evidence
    after the owner explicitly accepts the additional migration risk.
- Record one of three outcomes in the status and workbook evidence:
  - `live-verified` — real legacy behavior was observed for the declared scope;
  - `partial-simulated` — some behavior was exercised through mocks or
    emulation; simulated evidence is labeled and real runtime behavior remains
    unverified;
  - `blocked-waived` — the owner authorized progression without a run; the
    skipped scope remains blocked and unverified.
- A simulation proves the consistency of the team's interpretation, not the
  behavior of the real legacy runtime. Its fixtures and responses must cite the
  code, contracts, traces, or owner decisions from which they were derived.
- `partial-simulated` and `blocked-waived` allow progression to Stage 4 only
  through the recorded owner decision. Stage 3 remains incomplete for the
  unobserved real scope and must be resumed if access later becomes available;
  any difference found then loops back to Stage 1.

<a id="stage-04"></a>
### Stage 4 — Requirements revision (consistency check, with the business)

<!-- AGENT_ROLE_4_START -->
**Role and skill.** Business Analyst (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_4_END -->

<!-- ERROR_PREVENTION_4_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_4_END -->

<!-- STAGE_QUESTION_4_START -->
**Which legacy behavior do we keep, change or deliberately leave behind?**
<!-- STAGE_QUESTION_4_END -->

<!-- RECORD_BOUNDARY_4_START -->
**Proposal, decision and remaining work**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

**Execution record:** `analysis/stages/stage-04/stage-04-requirements-revision.md`. [analysis/stages/templates/stage-04-requirements-revision-template.md](../analysis/stages/templates/stage-04-requirements-revision-template.md). The active-stage agent records actual work; this is not independent approval.
<!-- RECORD_BOUNDARY_4_END -->

- Before any design, the agent audits the map itself as a set of requirements
  — **actively hunting for contradictions**, not just re-reading:
  - **contradictions / inconsistencies** between flows and channels (e.g. a
    login exists in one channel and is absent in another; validation or
    business rules differ between channels for the same operation);
  - **obsolete requirements** — behavior kept only for historical reasons;
    cross-check the legacy documentation for signs a rule is outdated
    (documentation is a signal here, still never parity evidence);
  - **unreasonable or strange requirements** — behavior that makes no
    business sense today.
- Every flagged row is reviewed **together with the business (owner) and a
  developer**: keep as-is / change / do not port. The decision is recorded in
  the map (decision status, deviation notes) **before SDD starts**.
- This is a **human-in-the-loop checkpoint**: the agent stops here and
  requests the owner's explicit confirmation of every keep / change /
  do-not-port decision. It must not proceed to Stage 5, and must not assume
  or simulate the business decision, until the owner has confirmed.
- If a "contradiction" turns out to be a mapping error, that is a map hole —
  **loop back to Stage 1**.

For that return, the Stage 4 agent cites the exact requirements-revision record,
finding IDs, affected rows and evidence in status. The Stage 1 agent follows
the [re-entry procedure](reviews/README.md#stage-1-re-entry). An owner decision
to change correctly recorded legacy behavior stays at Stage 4; it does not
rewrite the legacy fact or automatically restart discovery.

<a id="stage-05"></a>
### Stage 5 — Application form and style (human decision)

<!-- AGENT_ROLE_5_START -->
**Role and skill.** UX Designer (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ux/SKILL.md and returns ACK before work. Support on demand: Business Analyst, Developer. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_5_END -->

**Shared UI duty:** Draft ui-design-system.md and ui-design-tokens.json; the owner selects the foundation and pins its canonical hash in ui-ux-decision.md. This does not approve future component variants. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_5_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_5_END -->

<!-- STAGE_QUESTION_5_START -->
**In what form and visual style should the new application work?**
<!-- STAGE_QUESTION_5_END -->

**Why both inputs?** The parity map identifies scenarios, roles and channels. stage-04-requirements-revision.md supplies the owner decisions, rationale and conditions that constrain the application form. The agent reconciles both; a disagreement must be resolved, not silently interpreted.

**Example.** Illustrative: Stage 4 rejects a separate mobile product but retains phone access. The agent checks that the map preserves this condition, then proposes responsive web as an option, not removal of phone support. The owner-approved form and style are recorded in ui-ux-decision.md, the Stage 5 output.
This is not another requirements revision: Stage 5 chooses the form and style
within the approved scope, rather than reopening the owner's Stage 4 decisions.

<!-- RECORD_BOUNDARY_5_START -->
**Proposal, decision and remaining work**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

**Exception without invented verification**

- Exact allowed rule, scope, human authority and decision
- Blocked activity and still-unverified items
- Permitted next stage and gates not waived
- Responsible actor, expiry/re-entry condition and later closure evidence

Only an explicitly permitted exception can authorize progression. An approved waiver never means that the skipped check passed.
<!-- RECORD_BOUNDARY_5_END -->

- Before a single screen is drawn, decide **what the application will be as a
  whole**:
  - **form** — web, mobile, desktop, terminal/console, several channels
    (multi-channel), or **no interactive UI at all** (a pure API/batch
    system), and which channel is primary. The methodology is stack-agnostic;
    the option list is open, not limited to web/mobile.
  - **style** — e.g. minimalism, classic corporate, Material-like, or another
    direction;
  - **color scheme** — palette, accent colors, light/dark theme.
- The agent prepares the decision material: channels and scenarios from the
  parity map (which channels the legacy has, who uses them, where each flow
  lives), style options with references, and 2–3 candidate palettes.
- This is a **human-in-the-loop checkpoint**: the agent stops and asks the
  owner for an explicit decision. The chosen form, style, and palette are
  recorded in `analysis/prototyping/ui-ux-decision.md` (approver, date, options
  considered) before wireframing starts; the agent must not pick them itself.
- If the owner selects **no interactive UI**, Stages 6–8 shrink to the
  owner-approved minimum (e.g. wireframes only for an ops/admin console, or an
  explicit recorded owner waiver of the remaining prototyping scope).
- **Once per design baseline, not once per feature.** Stage 5 runs once for a
  project and establishes the design baseline (form, style, palette). New
  feature work **reuses the recorded baseline** and does not re-ask the owner;
  Stage 5 is repeated only on a deliberate change of channel or design system,
  recorded as a new decision. Stages 6–8, by contrast, run **for the new or
  changed screens of every feature**.
- A parity-map defect discovered while selecting the baseline returns to
  **Stage 1**; it is not hidden as a style decision.
- **A re-run is triggered per feature; the record it produces is one baseline.**
  A feature's new or changed screens are what sends the process back to Stage 6,
  and the wireframe work is confined to them. The record it leaves is not a
  feature-sized fragment: `screen-normalization.json` and `screen-manifest.json`
  describe the whole parity map as it stands, at a new `export_set_version`, and
  Stage 7 controls that record while Stage 8 approves it. Unchanged screens carry
  their existing exports forward with unchanged hashes, so the diff between two
  versions is exactly the feature's work.

  This is what `audit:prototype` enforces, and the reason it does: a record that
  covered only one feature would have to say something about the rows it omits,
  and "another feature owns this" is a claim no artifact in the repository can
  confirm. One baseline over the whole map is checkable; a partition is not.
  Splitting the record itself would need row ownership to become evidence in the
  parity map rather than a claim in the prototype record. The starter records that
  reasoning under [`analysis/reviews/`](./reviews); a project copying this methodology does not
  inherit the note, which is why the rule is stated here in full.

<a id="stage-06"></a>
### Stage 6 — Wireframes (agent-assisted)

<!-- AGENT_ROLE_6_START -->
**Role and skill.** UX Designer (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ux/SKILL.md and returns ACK before work. Support on demand: Business Analyst, Developer. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_6_END -->

**Shared UI duty:** Develop representative screens and the shared component catalogue together, then reuse them. Pin catalogue, tokens and component previews in manifest version 4; each screen declares used ui_variants. Foundation changes return to 5. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_6_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_6_END -->

<!-- STAGE_QUESTION_6_START -->
**Which screens, states and transitions will represent the agreed behavior?**
<!-- STAGE_QUESTION_6_END -->

<!-- RECORD_BOUNDARY_6_START -->
**Exception without invented verification**

- Exact allowed rule, scope, human authority and decision
- Blocked activity and still-unverified items
- Permitted next stage and gates not waived
- Responsible actor, expiry/re-entry condition and later closure evidence

Only an explicitly permitted exception can authorize progression. An approved waiver never means that the skipped check passed.
<!-- RECORD_BOUNDARY_6_END -->

- The agent builds wireframes for the future application in the form chosen at
  Stage 5, driven by the parity-map rows.

#### Screen normalization comes first, and is mandatory

> **Anti-pattern: one workbook row or one user flow does not imply one wireframe
> screen.**

A workbook row, a requirement, a user flow, an action and a visual screen are
different things. Deriving one screen per row or per flow inflates the catalog
with pages that do not exist, and a reviewer then spends the control stage on
artifacts nobody would ever build.

**Before generating anything**, classify every applicable row as exactly one of:

| Classification | Meaning |
|---|---|
| `surface` | A standalone UI surface with its own purpose, structure or route |
| `state` | A state of an existing surface |
| `action` | An action performed within an existing surface |
| `overlay` | A dialog, drawer or overlay on an existing surface |
| `navigation` | Navigation behavior between surfaces |
| `non-visual` | Backend or system behavior with no visual surface |

A standalone screen exists **only** when there is a distinct user surface with
its own purpose, structure or route. The mapping is many-to-one:

```
many workbook rows → several actions and states → one logical screen
```

**Do not create a new screen** when the only difference is a success or error
result, an empty list, a validation message, session expiry, permission denial,
a loading state, a save, a redirect, a button's action, or the user's role while
the composition is unchanged. Record each of those as a state, an action or a
role variation of one screen.

Create a separate **state** wireframe only when the state materially changes the
visible composition, the available actions, or the information structure.

Roles share one screen with role-specific states when the structure is common. A
separate role screen is justified only by a materially different interface.

`non-visual` behavior gets no artificial wireframe. It carries
`non_visual_workbook_rows[].covered_by` instead: a `coverage` statement saying how
the behavior will be covered without one, and the screen that sets it off where
one exists. Requirement ids and test references are Stage 15's and Stage 17's work — a Stage 6
record cannot cite what does not exist yet, and this manifest is pinned by the
Stage 8 approval. No audit yet joins row → requirement → tests; until one does,
those stages' reviewers carry the chain.

**Worked examples.**

- Login, invalid credentials, expired session and the authentication redirect →
  **one** `Sign in` screen with `default`, `invalid-credentials` and
  `expired-session` states; the access filter is `non-visual`.
- Viewing projects, the empty list and no access → **one** `Projects list`
  screen with `populated`, `empty` and `forbidden` states.
- Opening a task, validation, saving and computing `returnto` → **one**
  `Task editor`; validation and save are states and actions; computing the
  return target is covered by logic and tests, not by a wireframe.

**The canonical surface key** groups rows into surfaces:
`channel + route family + primary user task + stable layout`. Two rows sharing
that key belong to the same screen.

#### Coverage is unchanged; only the grouping changes

Normalization must not reduce coverage. Every applicable row is still covered,
and the record now says *how*: as a screen, a state, an action, an overlay,
navigation, or non-visual coverage. Produce a coverage table

```
workbook row → screen → state / action / non-visual coverage
```

and verify both directions before generating: **every applicable row is
covered**, and **every screen is justified by rows in the map**.

#### What the wireframe set then covers

- every screen for every role that can see it, as role states unless the
  interface differs materially;
- screen states that change composition: loading, empty, error,
  forbidden/no-access, success;
- forms with their validation states (pristine, invalid with messages,
  submitted);
- dialogs, wizard steps, and the transitions between screens;
- desktop and mobile variants when the Stage 5 decision includes both;
- target-only screens (owner-approved surfaces with no legacy predecessor).

#### Tooling and secrets

Tooling is replaceable; examples include **Google Stitch or Figma**. The owner
performs a one-time setup of access — an API key or a locally configured MCP
server for the chosen tool — before this stage can run. **Secrets never enter
the repository**: keys and MCP configuration live only in the owner's local
environment; Git, review reports, and manifests record only the fact that access
is configured, never the credential itself.

#### The durable record

**Read the pair in opposite directions:**

- **`screen-normalization.json`: behavior → screen. What needs to be represented?**
- **`screen-manifest.json`: finished screen → behavior. What was drawn, and which parity-map rows does it cover?**

- `wireframes/` — the exported wireframe catalog (images/exports, not only
  links into the SaaS tool), including shared component sheets listed as resources,
  never as business screens or fake parity rows;
- `screen-normalization.json` — the classification of every applicable row, the
  coverage table above, and an `excluded_rows` list for rows the owner decided
  at Stage 4 not to port, each citing its finding;
- `ui-design-system.md` — the shared catalogue of used variants, states, token
  bindings, visual previews and usage/accessibility rules, refined from the Stage 5 draft;
- `ui-design-tokens.json` — the owner-chosen foundation and permitted extensions;
  exact values are not duplicated in screen-specific rules;
- `screen-manifest.json` — a machine-readable manifest (`schema_version: 4`)
  mapping **screen → workbook rows → roles → states → actions → overlays →
  navigation**, plus the used `ui_variants` per screen and the `ui_design_system`
  pins for catalogue, tokens and separate component-preview resources. It includes
  the export version and hash of each screen, a digest of the governed workbook
  rows the row numbers point into — every row this record classifies or excludes —
  and a `non_visual_workbook_rows`
  block whose every entry carries a `covered_by` record: a `coverage` statement
  saying how the behavior will be covered instead of by a wireframe, and the
  initiating screen where one exists. Requirement ids and test references are not
  recorded here: Stage 8 pins this manifest by hash, and they are Stage 15 and
  Stage 17 work.

The reusable `screen-normalization.example.json` explains the format; it is
never evidence for a project. The project's `screen-normalization.json`
replaces its placeholders with real workbook rows. In each `rows[]` entry,
`row` points back to the parity map, `classification` says what the behavior
became, `screen` and `surface_key` identify its visual home, `element` names
the exact state/action/overlay/navigation item, and `note` explains the
decision. The embedded `_schema_help` at the top defines every field.

Every wireframe screen is linked to the workbook rows it covers: a screen
without rows is as impossible as a ported row without coverage. The two
exceptions are explicit — a **target-only** screen with no legacy predecessor,
which must cite the owner decision that approved it, and a row **excluded** at
Stage 4, recorded as excluded rather than quietly left out. A scope with nothing
to draw — every row non-visual or excluded — may declare no screens at all,
because the alternative is inventing the surface this rule exists to prevent.

`audit:prototype` enforces the mechanical half and fails closed: a missing
coverage workbook is an error, not an empty check. A classification must also
name *which* state, action, overlay or navigation step it became, and the screen
must list it — naming the screen alone leaves the substance unchecked. The
manifest carries the record's SHA-256, so a Stage 8 approval that pins the
manifest pins the classifications with it.

What the audit cannot judge: whether a surface key is truthful, since two
identical surfaces described in different words still pass; whether a cited Stage
4 finding or test really says what the record claims; whether a
`target_requirement` describes the surface the owner actually approved; and
whether normalization really came **before** generation, since the recorded hash
proves the record and the catalogue agree now, not which was written first.
Catching those is Stage 7's job.

The normalization hash covers all evidence-bearing fields but omits
`_schema_help`: changing an explanation must not invalidate approval, while
changing any row, classification, placement, note or exclusion still does.

If wireframing proves that the approved form or design baseline itself must
change, return to **Stage 5**. If it exposes a parity-map defect, return to
**Stage 1**. Ordinary wireframe corrections remain inside Stage 6.

#### An improvement the agent found is neither deleted nor accepted on its own

A prototyping tool driven by an agent produces things the legacy application never
had. Some are noise. Some are genuinely better than what shipped, and the owner may
well want them.

Both default answers are wrong. Deleting them silently discards work the owner might
have chosen, and the deletion leaves no trace: nothing in the record says a choice was
ever available. Keeping them silently is worse — an unapproved addition is
indistinguishable from an invention nobody noticed, which is how a whole navigation
component can end up on every screen, with a different item set each time, and no line
anywhere saying it was decided.

So when the orchestrator finds one it **stops and asks the owner**, presenting the
addition, what the legacy build does instead, and what keeping it would change. The
owner answers one of three ways:

- **reject** — removed, and the removal recorded against the decision that caused it;
- **approve as target-only** — it becomes a governed requirement from that moment,
  recorded as an owner decision and cited by the artifact that carries it: a whole
  screen through `target_only` and `target_decision`, one element of an otherwise
  faithful screen through `target_only_elements`. From there it is subject to the same
  gates as everything else — traceability, roles, prototype audit, SDD, tests — with
  what each gate actually establishes stated below;
- **defer** — recorded as open, and kept out of the catalogue until it is decided.

Approving a component is not approving its contents. An owner who keeps a navigation
sidebar has not thereby approved whatever items the tool put in it: each item, action,
role and route still has to name a surface the catalogue carries, respect that
surface's roles, and lead somewhere real. Record the two halves separately, or a broad
approval will later be read as having covered details it never examined.

And say plainly what the addition changes. If a new menu item makes a surface reachable
that the legacy build reaches only by a typed URL, that is a behavioural change and
belongs in the record — especially where the parity map already notes the
unreachability as a finding, and most of all where the newly reachable route is one the
legacy build leaves unprotected. A discoverable unprotected endpoint is not the same
risk as an obscure one.

**What the element-level record establishes, and what it does not.** `audit:prototype`
checks that the element is one the screen declares under the kind the entry names, that
it is declared once, that it does not contradict a workbook row claiming the same
element as legacy behavior, that the screen is not itself wholly target-only, that the
requirement text is filled in, and that the decision exists, is approved, and is in
scope. That is the whole of the mechanical guarantee.

It does **not** establish that the owner approved *this* element. `target_requirement`
is prose, so the record can state what was approved but no check can confirm the
statement matches the decision, and a decision broad enough to cover several additions
can be cited by each of them. It does not check roles, routes, destinations, or that
anything was drawn. And it cannot separate an approved addition from an unapproved one
that was simply never declared: element labels are written for a human reader, not as
identifiers, so nothing mechanical distinguishes an invented navigation item from a
real one — both are a sentence.

Those are the independent review's job at Stage 7, and a review is a control, not a
guarantee. What the record adds is that once an improvement has been decided, the
decision is named, checkable, and re-checked on every audit afterwards — instead of
living in a conversation nobody can audit.

<a id="stage-07"></a>
### Stage 7 — Wireframe control (second agent against the map)

<!-- AGENT_ROLE_7_START -->
**Role and skill.** QA (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-qa/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_7_END -->

**Shared UI duty:** Independently compare screens with the shared catalogue, token values and previews, including required states, navigation, responsive behavior and accessibility. Record mismatches and unchecked scope; hashes alone do not prove visual consistency. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_7_START -->
**Error prevention.** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_7_END -->

<!-- STAGE_QUESTION_7_START -->
**Does the prototype cover the agreed behavior without omissions or unsupported additions?**
<!-- STAGE_QUESTION_7_END -->

<!-- RECORD_BOUNDARY_7_START -->
**What the review records**

- Exact scope and authoritative expected result
- Actual observation and evidence for each check
- Matched / mismatch / not-checked / not-applicable
- Linked findings, blocked scope and reconciled totals
- Verdict and next action; prior results are not newly verified

Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.
<!-- RECORD_BOUNDARY_7_END -->

- When the wireframes are ready, a **second, independent agent** walks them
  screen by screen against the parity map: is every ported flow covered, is
  anything missed, and did anything appear on the screens that no requirement
  asks for.
- The pass verifies, over the exported catalog and `screen-manifest.json`
  (never over live SaaS links alone):
  - every ported UI-facing workbook row is covered by at least one screen;
  - no screen exists without a backing requirement or owner-approved
    target-only decision;
  - the declared roles, states, forms/validation, dialogs/wizard steps, and
    channel variants from the Stage 6 definition are all present;
  - every manifest link (screen → rows → roles → states) resolves and the
    export hashes match the delivered files.
- The manifest invariants are checked by the **automated prototype audit**:
  `npm --prefix analysis/tools run audit:prototype` must print
  `PROTOTYPE AUDIT OK` before the stage can close. The audit now enforces the
  structural half of parity-map coverage — every governed row classified,
  excluded; no row owned by two screens; each classification
  agreeing with where the row landed; and the governed rows themselves pinned.
  What remains the reviewer's is the half a script cannot reach: whether a
  surface key is truthful, whether a cited finding or test says what the record
  claims, and whether the coverage is deep enough in roles, states and
  validation. The reusable scaffold and templates live in
  [`analysis/prototyping/`](./prototyping) (see its README).
- Every blocking or non-cosmetic finding loops back to **Stage 6**: the
  wireframes are corrected, then the control pass is repeated. A clean pass
  closes the stage. The only exception is the recorded owner criterion below:
  every finding is Low and cosmetic, no never-cosmetic class is present, every
  finding is dispositioned in the pass-linked `ui-polish-backlog.md`,
  and no scope remains unchecked. Such a pass is a **closing pass**, not a
  clean pass. Critical, High, Medium, non-cosmetic, or unchecked findings block.
- Every pass is recorded as `analysis/reviews/stage-07-pass-NNN.md` and
  appended to `review_passes` in the status file; each pass requires an
  eligible fresh agent.
- If a wireframe finding turns out to be a hole in the map itself, that is a
  Stage 1 return, handled like any other map error.
- A deliberate channel or design-system change returns to **Stage 5** before
  the revised wireframes receive another Stage 7 pass.

<a id="stage-08"></a>
### Stage 8 — Wireframe approval (human decision)

<!-- AGENT_ROLE_8_START -->
**Role and skill.** UX Designer (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ux/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_8_END -->

**Shared UI duty:** The owner reviews screens and component sheets together and approves the exact manifest-pinned catalogue, tokens and exports. Pending required variants or states block approval. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_8_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_8_END -->

<!-- STAGE_QUESTION_8_START -->
**Does the owner approve this exact prototype as the visual baseline?**
<!-- STAGE_QUESTION_8_END -->

<!-- RECORD_BOUNDARY_8_START -->
**Proposal, decision and remaining work**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.
<!-- RECORD_BOUNDARY_8_END -->

- Before approving deferred minor visual corrections, the owner reviews the
  named target slice, responsible agent and linked correction task for every
  item. The agent records this bounded agreement in the approval and backlog.
  An unspecified "later" is not a valid disposition. See
  [the correction deadline contract](#minor-visual-correction-deadline-contract).

- The verified wireframes are shown to the **owner**: is this how the
  application should look, is the set of screens and transitions right.
- Prototype remarks return the work to Stage 6; a deliberate channel or
  design-system change returns to Stage 5; a parity-map defect returns to
  Stage 1. Stage 7 is repeated after the affected correction.
- This is a **human-in-the-loop checkpoint**: the agent stops and waits for
  the owner's explicit approval. Design (SDD) does not start until the
  wireframes are approved; the approved wireframes then serve as the visual
  companion to the specifications.
- Approval closes Stage 8 only when a closing Stage 7 pass is registered for
  the same `export_set_version`: either a clean pass or the governed
  Low-cosmetic exception above.
- The approval is recorded in `analysis/prototyping/ui-ux-approval.md`: approver,
  date, and the **version/hash of the approved wireframe export set** (from
  `screen-manifest.json`), so later stages can prove exactly which prototype
  was approved. An unrecorded approval does not exist.

### Architecture and knowledge — how to read Stages 9–14

This phase turns approved requirements into a controlled explanation of the
target system, then into verified knowledge that the SDD can consume. It has
three layers with different authority:

1. **The decision register answers _what did we learn and decide?_**
   Stage 9 starts from legacy evidence, asks the owner/client only the residual
   production or business questions, and records the resulting NFR, capability,
   technology and system-shaping decisions in
   `analysis/architecture/architecture-nfr-decision-register.xlsx`.
2. **The architecture record answers _how the target satisfies those decisions
   and why_.** `architecture.md`, its sections and ADRs are normative;
   `architecture.drawio` is their editable visual projection; manifests pin the
   exact synchronized set. Stage 10 controls it, Stage 11 obtains the owner's
   verdict, and Stage 12 closes every remark.
3. **The OKF bundle answers _how the approved target system is arranged and
   works_.** Stage 13 extracts source-linked concepts without inventing new
   requirements; Stage 14 independently checks every concept before SDD starts.

The owner therefore participates twice in the architecture half: first inside
Stage 9 to answer evidenced residual questions and decide the governed rows,
then at Stage 11 to approve the understandable architecture assembled from
those decisions. The phase creates only the minimum baseline needed by the
current slice; later evidence reopens the smallest affected architecture area.

<a id="stage-09"></a>
### Stage 9 — Architecture requirements (NFR → architecture document)

<!-- AGENT_ROLE_9_START -->
**Role and skill.** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Support on demand: Business Analyst, UX Designer, Developer. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_9_END -->

**Feature dependencies:** Create the source-backed feature dependency graph: reserve bounded slice IDs, map parity rows, separate contract and completion prerequisites, and record unknowns. Run audit:dependencies before handoff. The coordinator owns the file; do not infer delivery order from slice numbers. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Read the approved UI catalogue/tokens through the prototype manifest and verify component-library/platform compatibility. Necessary visual source changes repeat the affected Stage 5-8 controls. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_9_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_9_END -->

**Approval scope:** Name the current architecture layer and the slices it enables. All applicable Grade A decisions in that declared scope must close; a foundation approval is not approval of the entire future system. Later dependent slices must reopen unresolved or changed decisions before relying on them.

<!-- STAGE_QUESTION_9_START -->
**How should the target system be structured to meet its requirements and constraints?**
<!-- STAGE_QUESTION_9_END -->

**On return after Stage 12:** read the exact negative closure report from the
transition, its owner verdict and correction dispositions. Preserve item IDs;
verify findings and correct affected architecture.
Follow the [review-cycle return protocol](architecture/review-cycles.md#repeated-work).


<!-- STAGE_REENTRY_9_START -->
**After a failed closure check.** Conditional input: the exact triggering closure report, linked owner verdict and correction dispositions. Not required on first entry.

- [stages/stage-12/architecture-closure-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-closure-NNN-template.md): Exact negative Stage 12 report selected by the return, not the largest filename.

1. Keep original finding IDs and verify the evidence; record each correction or unresolved item.
2. Repeat affected independent controls. Stage 11 presents what failed and changed before a new human decision.
3. Create new immutable decision/check records; never erase earlier failed attempts.

[Return instructions](architecture/review-cycles.md#repeated-work) · [Real XPlanner correction record](https://github.com/olsys-ltd/xplanner2/blob/1ef0436c6753b08dbf7fc82b07650361b27706eb/analysis/stages/stage-12/architecture-closure-001.md)
<!-- STAGE_REENTRY_9_END -->

<!-- RECORD_BOUNDARY_9_START -->
**Proposal, decision and remaining work**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

**Exception without invented verification**

- Exact allowed rule, scope, human authority and decision
- Blocked activity and still-unverified items
- Permitted next stage and gates not waived
- Responsible actor, expiry/re-entry condition and later closure evidence

Only an explicitly permitted exception can authorize progression. An approved waiver never means that the skipped check passed.
<!-- RECORD_BOUNDARY_9_END -->

- **`architecture-nfr-decision-register.xlsx` answers: _What did we learn and decide?_**
- **`architecture-nfr-owner-review.md` answers: _Did the owner review and approve, defer or
  return this exact workbook version?_**
- Stage 9 begins with the governed Excel workbook
  `analysis/architecture/architecture-nfr-decision-register.xlsx`, created from the reusable
  template and instructions in [`analysis/architecture/`](./architecture).
- Its first mandatory gate is the **`Legacy Discovery` worksheet**. Before target
  NFRs or technologies are proposed, the agent records only architecture-significant
  facts about the old system and keeps three evidence lanes distinct: legacy
  code/configuration, live walkthrough, and client interview. Each relevant row
  consolidates the current behavior, unknowns/risks, durable evidence, independent
  review, and the target NFR that must consume the finding. A required live lane
  may be simulated or skipped only through the governed owner fallback; skipping
  never becomes verified-live evidence. The sheet is physically immediately before
  `NFR Register`. For each row the agent must exhaust code/config evidence first,
  then run the relevant behavior on the governed demo when possible, and only then
  ask the owner/client a narrow question limited to the remaining business or
  production unknown. The question includes the evidence-backed options and their
  impact; it must not delegate source/runtime investigation to the client. Target questioning starts only after every required discovery row
  is complete or carries an exact owner disposition.
- Every client-dependent residual is projected into the same workbook's
  **`Client Questionnaire` worksheet**, keyed one-to-one by `LD-NNN`. It shows
  what code/live evidence already proved, asks one narrow client question, states
  the architectural impact and conservative fallback, and records the canonical
  answer, respondent/role, date, durable evidence, disposition and controlled
  status. A chat answer does not close the row. After every answer or exact owner
  deferral, the agent synchronizes `Legacy Discovery` and runs a legacy-to-target
  impact pass: update the linked NFR/ADR/migration/security/functional scope, or
  record explicitly why no target change is required. Stage 9 cannot close while
  a required questionnaire row is `Open` or lacks authority, evidence and target
  disposition.
- Before drawing the system, every remaining concern is classified as
  **system-diagram shaping**, **architecture-record detail**, or
  **SDD/feature detail**. The owner and agent close the compact `System Diagram
  Gate`: boundaries, trust/identity, tenant isolation, data stores, external
  integrations, background workers, deployment, scale/state, localization
  boundary and material technology. Once this gate is 100% ready, the agent may
  draft the high-level Draw.io system view. Endpoint and field rules, exact
  role-action matrices, schedules/retries, UI states, file size/type/scanning/
  retention rules and runbooks move to the named SDD backlog unless they change
  one of those system-shaping decisions. Deferral to SDD is a recorded destination,
  not omission. For example, the diagram shows durable file storage; the file SDD
  later defines its exact behavioral contract.
- The `NFR Register` worksheet then grades target architecture
  drivers as **A (mandatory), B (desirable), or C (optional/future)** and records
  the measurable decision, decision basis, rationale, one accountable authority,
  required consultees, approver, evidence, decision-record/ADR reference, closure
  condition, assumption expiry, re-review trigger, criterion source, proposer, and
  exact proposal/review reference. Agent authorship is never decision authority.
- Grade is the decision criticality. Each NFR row also names an
  **architecture area** (Foundation, Identity & Access, Data, Integrations,
  Operations & Scale, UI/Localization, or another governed area), its
  **first dependent slice**, and the evidence point where it will be checked
  again. Grade A blocks the first checkpoint or slice that actually depends on
  the decision; Grade B/C remains visible backlog. Architecture area is not a
  second approval hierarchy: it decomposes the main ADR and prevents unrelated
  decisions from blocking the first code-start gate. `Overview` lists every
  worksheet, its purpose, and when it is used so a fresh agent can navigate
  without chat history.
- Stages 9-12 establish the smallest architecture baseline required by the
  **Current Slice**. After each implementation slice, code, tests and runtime
  evidence are compared with that baseline. Changed evidence reopens affected
  Grade rows, ADRs and Draw.io pages; unaffected decisions remain valid.
- `Integration Contracts` is the governed inventory of every material inbound
  and outbound contract. Code/live evidence proves existence; client authority
  proves production consumers and compatibility. Unknown consumers remain linked
  to `Client Questionnaire` and block the affected layer when trust, delivery or
  compatibility cannot yet be drawn honestly.
- The workbook also contains a physically separate **`Team Capability`
  worksheet immediately before `Technology Stack`**. The owner and agent inventory current people/teams, proven
  production experience, proficiency, available capacity and bus factor **before
  technology selection**. After candidate technologies are selected, each
  material choice is mapped back to a required capability and every gap receives
  an owner-approved response: current team, training, hiring, partner, managed
  service, reassignment, or explicit deferral. Familiarity is a delivery-risk and
  cost input, not authority to override parity, security, compliance or NFRs.
- The same workbook contains the dedicated **`Technology Stack` worksheet**.
  Every material runtime, framework, database, identity, deployment,
  integration, testing, localization, and observability choice is recorded there
  with a stable `TECH-NNN` ID, version/baseline, boundary, rationale,
  alternatives, human approver, evidence, and re-review trigger. It is the
  single Stage 9 source for technology selection; `owner-inputs.md`, chat notes,
  or a second stack list are not allowed as parallel truth.
- Before architecture control, the register explicitly covers session-state
  ownership and horizontal scaling, exact legacy role/permission parity, every
  active job/worker/queue path, and the client distribution/customization model.
  The current competency inventory precedes technology selection; the resulting
  target gap plan follows it. Neither may be used as an unrecorded reason to choose
  familiar technology.
- This is a mandatory **human-in-the-loop gate**. The owner and agent walk every
  Grade A row together; the agent explains options and impact, while the owner
  confirms or changes the decision. Stage 9 cannot close while a Grade A NFR or
  technology row is
  blank, an architect draft, not discussed, or supported only by an unlabeled
  assumption. Status text alone does not close a row: the computed `Closed`
  gate also requires the accountable role, approver, date, evidence and
  decision-record/ADR fields (or a complete owner-approved deferral). The exact
  workbook SHA-256, Grade A totals and computed closed count are recorded in
  `analysis/architecture/architecture-nfr-owner-review.md`; changing the workbook makes that
  review stale. Until the owner walks the changed rows again, their new values
  are proposals even though they are already present in Excel, and downstream
  architecture must continue to rely only on the last reviewed hash. The project
  keeps one current owner-review file rather than numbered copies: each repeated
  walkthrough appends a dated `Owner amendment` explaining the delta, decision
  and authority, while Git preserves every prior file version. Reapproval updates
  the workbook hash and verdict and repins `architecture-nfr-manifest.json`; earlier decisions
  must never be erased. The owner review also records technology and team-capability
  totals, proves that the `Technology Stack` worksheet has zero open Grade A
  decisions, and proves that every required capability is assessed with an agreed
  plan for each gap.
- Using that approved register, the agent gathers and structures the
  **non-functional requirements
  (NFR)** — performance, reliability, security, scalability, observability,
  cost — and the constraints (stack, infrastructure, integrations, team),
  drawing on the parity map, the decided application form (Stage 5), and
  questions to the owner.
- Stage 9 distinguishes a **business queue**, an in-process domain event, a
  scheduler, a durable outbox and an infrastructure message broker. Each
  asynchronous or scheduled legacy behavior is mapped to one target mechanism;
  choosing no broker must prove complete current delivery semantics (atomicity,
  idempotency, retry, failure inspection and replay) and name measurable triggers
  for adding one later. "No broker" is not allowed to hide deferred behavior.
- The baseline includes an explicit **operating and capacity model**: workload
  assumptions per environment, measurable performance/availability objectives,
  hosting region and data-residency status, deployment and support ownership,
  current topology, horizontal scale-out path, and measurable scale triggers.
  Provider-specific services are decisions only when actually required; a future
  cloud option is not a substitute for an operable current deployment.
<a id="engineering-quality-profile"></a>

- Stage 9 also defines a stack-specific **engineering-quality profile**. It turns
  code style, SOLID/DRY, persistence conventions and testing into exact repository
  structure and executable gates: formatter/linter, strict compiler/type settings,
  analyzers, dependency-boundary tests, mapping/migration rules, unit/integration/
  contract/UI/E2E tools, real-infrastructure prerequisites, coverage policy and CI
  commands. Generic "clean code" prose is not sufficient.
- The profile classifies strings by ownership: stable runtime and protocol
  identifiers use typed constants/value objects/options; environment values use
  validated configuration; user-facing prose uses localization resources. It names
  the analyzer or architecture test that rejects a governed identifier introduced
  once at a governed sink as well as any repeated governed literal, while permitting
  genuinely local, one-use, non-contract implementation text. The architecture
  records the gate name, its normal CI command, and fixtures proving both outcomes.
- Governed identifiers include stable protocol tokens, shared routes, claim/policy/
  role names, cookie/header names, configuration keys, error codes, persistence
  identifiers and product identifiers used by runtime contracts. They belong in
  typed constants, value objects or validated options, not inline at their use
  sites. Environment values and secrets belong in validated configuration;
  user-facing prose and branding follow the approved localization contract.
  The analyzer must reject both a first inline governed identifier at a governed
  API/sink and an already governed identifier repeated in any raw production
  literal. Fixtures must prove these failures and allow a genuinely local,
  single-use string that is neither a contract, configuration, secret nor user
  text. Moving every incidental string into unrelated constants is not compliance.
- The result is an **architecture document**: the target architecture and its
  key decisions with rationale (**ADR — architecture decision records**),
  each decision traced to the requirement it closes. A decision without a
  requirement is as much a defect as a requirement without a decision.
- **Every NFR is measurable.** Each one carries an acceptance criterion that
  a test or measurement can pass or fail ("p95 login < 300 ms at 100 rps",
  not "the system is fast"). The traceability chain
  **NFR-ID → ADR → SDD requirement/task → test/measurement → acceptance
  evidence** starts here and is maintained through Stages 13-19.
- For every user-facing channel, Stage 9 records a mandatory **localization
  contract**: the exact number and locale codes of supported languages, default
  and fallback locale, formatting/time-zone rules, translation ownership, API
  error-message contract, treatment of user-authored content, and explicitly
  deferred legacy locales. "Multilingual" without this list is not a decision.
  A locale is normally a governed state of a surface, not a duplicated screen.
  If the decision changes navigation, interaction, or screen structure, return
  the affected prototype scope to Stage 6, record the reason and exact decision
  in migration status, and repeat Stages 7-8 before resuming Stage 9. Only the
  affected scope is reopened; a changed application/channel/design baseline
  must also pass Stage 5 before new wireframes. Otherwise record representative
  long-text/pseudo-localized layout checks for SDD and acceptance.
- Stage 9 creates the architecture record under [`analysis/architecture/`](./architecture):
  `architecture-nfr-decision-register.xlsx` plus its `architecture-nfr-owner-review.md`,
  `architecture.md` (target architecture, constraints),
  `adr/NNN-<slug>.md` per decision, and
  **`architecture-nfr-manifest.json`** — a Stage 9 output generated from the governed
  decisions and architecture record. It is the machine-readable NFR list with
  acceptance criteria, NFR ↔ ADR links, and the SHA-256 of every document
  (reusable scaffold and templates live there; see its README).
- The phase also produces `architecture.drawio`: the editable, multi-page
  collaborative architecture source. It presents the executive summary,
  context, containers, boundaries, integrations, data and event flows,
  security, deployment, scaling, localization, key NFRs, ADR trade-offs,
  risks, and delivery sequence. The owner and agent MUST collaborate in the
  live editable Draw.io workspace; the agent records their decisions in the
  governed architecture records. Hosting is optional: they may use one
  shared Google Drive file through the Draw.io editor; Draw.io MCP may create
  or open it. The durable checkpoint is the editable `.drawio` snapshot in Git,
  never the cloud URL or an unrecorded browser state.
- The decision direction is one-way until synchronization is complete:
  **workbook owner decision → architecture.md/ADR → Draw.io view**. An owner may
  edit the shared diagram during collaboration, but an accepted diagram change is
  first written back to the workbook and textual record; the diagram alone cannot
  create a requirement, authority decision, role, worker, feature flag or deployment
  assumption.
- `architecture-nfr-manifest.json` pins the SHA-256 of `architecture.drawio` together with
  the normative architecture documents. Any architecture-set change requires
  the snapshot to be refreshed. SVG, PNG, or PDF exports are optional views
  and never independent requirement sources.
- Stage 9 hands work to Stage 10 only when all required legacy-discovery rows are complete or exactly owner-dispositioned, every client-dependent row is reconciled with `Client Questionnaire` and its target impact, `System Diagram Gate` is green with every deferred feature mechanic named in its SDD backlog, all Grade A NFR and technology rows assigned to the exact current layer are approved or owner-deferred with a trigger, the
  workbook summary reconciles with the detail, every register row is represented
  by an NFR, ADR, constraint, risk, or explicit deferral, the workbook and owner
  review are pinned in `architecture-nfr-manifest.json`, and `audit:architecture` is green.

<a id="stage-10"></a>
### Stage 10 — Architecture control (second agent against the requirements)

<!-- AGENT_ROLE_10_START -->
**Role and skill.** Architect (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_10_END -->

**Feature dependencies:** Independently review feature-dependencies.json for missing providers, false links, direction, conditions and completion cycles. Record each checked node ID and scope digest, supporting sources, findings and unchecked scope in this pass. The coordinator records the review binding only after a clean bounded result. Follow [the graph contract](feature-dependencies-guide.md).

<!-- ERROR_PREVENTION_10_START -->
**Error prevention.** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_10_END -->

<!-- STAGE_QUESTION_10_START -->
**Is the architecture consistent, justified and able to meet the requirements?**
<!-- STAGE_QUESTION_10_END -->

**On return after Stage 12:** read the exact negative closure report from the
transition, its owner verdict and correction dispositions. Preserve item IDs;
independently verify the corrected set and outstanding findings.
Follow the [review-cycle return protocol](architecture/review-cycles.md#repeated-work).


<!-- STAGE_REENTRY_10_START -->
**After a failed closure check.** Conditional input: the exact triggering closure report, linked owner verdict and correction dispositions. Not required on first entry.

- [stages/stage-12/architecture-closure-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-closure-NNN-template.md): Exact negative Stage 12 report selected by the return, not the largest filename.

1. Keep original finding IDs and verify the evidence; record each correction or unresolved item.
2. Repeat affected independent controls. Stage 11 presents what failed and changed before a new human decision.
3. Create new immutable decision/check records; never erase earlier failed attempts.

[Return instructions](architecture/review-cycles.md#repeated-work) · [Real XPlanner correction record](https://github.com/olsys-ltd/xplanner2/blob/1ef0436c6753b08dbf7fc82b07650361b27706eb/analysis/stages/stage-12/architecture-closure-001.md)
<!-- STAGE_REENTRY_10_END -->

<!-- RECORD_BOUNDARY_10_START -->
**What the review records**

- Exact scope and authoritative expected result
- Actual observation and evidence for each check
- Matched / mismatch / not-checked / not-applicable
- Linked findings, blocked scope and reconciled totals
- Verdict and next action; prior results are not newly verified

Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.
<!-- RECORD_BOUNDARY_10_END -->

- A **second, independent agent** checks the architecture document against
  the requirements: every NFR is closed by a concrete decision, every
  decision is justified, and nothing contradicts the parity map or the
  Stage 5 form decision.
- The reviewer verifies that every user-facing channel has a concrete
  localization contract and that its language count, locale codes, fallback,
  formatting, prototype impact, and measurable acceptance evidence agree.
- The reviewer verifies that scheduled/async behavior is traced from parity
  evidence to a complete mechanism, that business queues are not confused with
  brokers, and that the current operating profile has capacity, geography,
  ownership, availability and scale-out criteria rather than vague "cloud-ready"
  language.
- The manifest invariants are checked by the **automated architecture
  audit**: `npm --prefix analysis/tools run audit:architecture` must print
  `ARCHITECTURE AUDIT OK` before the stage can close (fail-closed and
  scope-aware, like the prototype audit).
- The reviewer compares every page of `architecture.drawio` with the normative
  record and opens or renders every page for visual inspection. Clipped or overlapping text,
  broken diagrams, unreadable labels, inconsistent hierarchy, or a semantic
  mismatch is a finding even when the source Markdown is correct.
- Findings return the document to **Stage 9**; the pass repeats until a
  **dry pass**. Every pass is recorded as
  `analysis/reviews/stage-10-pass-NNN.md` by an eligible fresh agent and
  appended to `review_passes`.
- If a finding turns out to be a hole in the parity map, that is a **Stage 1
  return**, handled like any other map error. If an architecture decision
  changes channels, screens, or states, the **wireframes return to Stage 6**
  (a deliberate channel or design-system change re-runs Stage 5) and
  Stages 7–8 repeat for the changed scope.

<a id="stage-11"></a>
### Stage 11 — Owner architecture review (human decision)

<!-- AGENT_ROLE_11_START -->
**Role and skill.** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_11_END -->

**Feature dependencies:** Include the reviewed dependency constraints in the owner discussion. Priority is not permission to remove a prerequisite. Record scope/deferral decisions in the owner verdict; dependency corrections return to Stage 9. Follow [the graph contract](feature-dependencies-guide.md).

<!-- ERROR_PREVENTION_11_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_11_END -->

<!-- STAGE_QUESTION_11_START -->
**Does the owner accept the architecture and its trade-offs, or require changes?**
<!-- STAGE_QUESTION_11_END -->

<!-- STAGE_REENTRY_11_START -->
**After a failed closure check.** Conditional input: the exact triggering closure report, linked owner verdict and correction dispositions. Not required on first entry.

- [stages/stage-12/architecture-closure-NNN.md](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/architecture/templates/architecture-closure-NNN-template.md): Exact negative Stage 12 report selected by the return, not the largest filename.

1. Keep original finding IDs and verify the evidence; record each correction or unresolved item.
2. Repeat affected independent controls. Stage 11 presents what failed and changed before a new human decision.
3. Create new immutable decision/check records; never erase earlier failed attempts.

[Return instructions](architecture/review-cycles.md#repeated-work) · [Real XPlanner correction record](https://github.com/olsys-ltd/xplanner2/blob/1ef0436c6753b08dbf7fc82b07650361b27706eb/analysis/stages/stage-12/architecture-closure-001.md)
<!-- STAGE_REENTRY_11_END -->

<!-- RECORD_BOUNDARY_11_START -->
**Proposal, decision and remaining work**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.
<!-- RECORD_BOUNDARY_11_END -->

- Present the exact independently checked architecture, editable Draw.io,
  NFR/ADR choices, cost, risks and delivery sequence to the human owner.
- **On re-entry:** read the exact negative Stage 12 report cited by the return,
  its owner verdict, correction dispositions and a fresh Stage 10 pass.
  Explain what failed, what changed and what remains. Keep stable item IDs.
- Stop for the owner's explicit decision. The agent creates a new immutable
  `analysis/stages/stage-11/architecture-owner-verdict-NNN.md` from its
  [template](architecture/templates/architecture-owner-verdict-NNN-template.md).
  Pin the scope, set version, manifest/Draw.io and Stage 10 report hashes,
  actual human evidence, predecessors and items for closure. An agent cannot
  supply human approval. A new verdict never overwrites a previous decision.
- Select the exact path in `migration_status.yaml.architecture_review.owner_verdict`;
  clear `closure_report` for the new cycle. Never select a file by the largest number.
- Approval passes `audit:architecture:approved` and hands the verdict to 12.
  **This gate does not require the future Stage 12 report.** On approval,
  `config/project.yaml.runtime.target_platforms` must name supported platforms.
- Architecture remarks return to **9**, screen/navigation defects to **6**,
  deliberate channel/design-system changes to **5**, parity-map defects to **1**.
  The exact negative decision/report follows the return; repeat affected controls.

The [review-cycle contract](architecture/review-cycles.md) owns the detailed
selection, predecessor, immutable-history and adoption rules.

<a id="read-stage-12-remark-verification-agent-closes-the-loop"></a>

<a id="stage-12"></a>
### Stage 12 — Remark verification (agent closes the loop)

<!-- AGENT_ROLE_12_START -->
**Role and skill.** Architect (responsible-agent verification). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_12_END -->

**Feature dependencies:** Check that owner dependency remarks are resolved in the exact source-backed graph and architecture. Record evidence in the numbered closure report. Do not edit the graph or refresh its pins during closure; return unresolved design to Stage 9. Follow [the graph contract](feature-dependencies-guide.md).

<!-- ERROR_PREVENTION_12_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_12_END -->

**Are all owner remarks from Stage 11 provably closed in the exact architecture
files, without silently changing other decisions?**

<!-- RECORD_BOUNDARY_12_START -->
**How each owner remark is closed**

- Original remark ID and observable closure criterion
- Applied fix and exact changed files
- Actual closure check and evidence
- Verified-closed / owner-dispositioned / open / failed / blocked with reconciled totals
- Unintended changes checked; final owner verdict pins the corrected set

Every attempt creates a separate immutable closure report. It verifies the selected owner verdict without changing it. A failed report accompanies the return and is read on re-entry at Stages 9-11.
<!-- RECORD_BOUNDARY_12_END -->

**Result:** a new immutable
`analysis/stages/stage-12/architecture-closure-NNN.md`, not an update of the
owner verdict. The responsible agent follows the
[closure template](architecture/templates/architecture-closure-NNN-template.md).
A fresh independent reviewer is not required here; Stage 10 supplies that control.

1. Read the exact owner verdict selected in status, linked prior findings and
   the complete unchanged approved architecture. Verify the applicable item IDs
   and observable criteria, not just an "approved" label.
2. For every item, record the expected criterion, actual observation, exact
   file/section, evidence and state: **verified-closed, owner-dispositioned, open, failed or blocked**.
   Owner withdrawal or scope exclusion needs explicit evidence in the owner
   verdict and is counted separately, never as a verified fix.
   Reconcile totals and check for unintended changes to other decisions and NFRs.
   New agent findings have distinct IDs and attribution; never invent owner remarks.
3. Save this attempt under a new number and select it in
   `migration_status.yaml.architecture_review.closure_report`.
   Completed reports are immutable, including failed attempts. Numbers of the
   owner verdict and closure report are independent.
4. With no remarks, still record the checked unchanged set and zero required fixes.
   A missing check is **blocked**, not proof of closure.
5. A failed architecture check returns to **9**, then fresh **10**, new human
   decision **11**, and a new **12** report. UI structure returns to **6**,
   deliberate baseline changes to **5**, parity defects to **1**.
   Cite the exact negative report in transition/blocker evidence. On re-entry,
   Stage 11 must read it and the recorded correction dispositions.
6. Only passed `audit:architecture:closure` for the current owner-approved set
   permits the governed Stage 13 handoff. Stage 13 reads **both** records.

Stage 12 does not edit architecture, refresh approved hashes or amend the
human decision. The [review-cycle contract](architecture/review-cycles.md)
defines exact record bindings and history preservation.

**Real XPlanner example:** historical owner remark 003 led to ADR-007, fresh
Stage 10 control and Foundation acceptance. The local numbered example
reconstructs that evidence trail; it marks unperformed closure checks as
blocked and is not a new approval or a passed Stage 12 cycle.

<a id="read-stage-13-target-knowledge-synthesis-approved-architecture-okf"></a>

<a id="stage-13"></a>
### Stage 13 — Target knowledge synthesis (approved architecture → OKF)

<!-- AGENT_ROLE_13_START -->
**Role and skill.** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_13_END -->

**Feature dependencies:** Read the reviewed dependency graph alongside the architecture. Preserve relevant contract/prerequisite reasoning and source links in knowledge, without copying a competing dependency list. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Link relevant approved UI catalogue/token sources into knowledge without creating another dictionary of visual values. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_13_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_13_END -->

<!-- STAGE_QUESTION_13_START -->
**What knowledge from the approved architecture must we pass to the next agent?**
<!-- STAGE_QUESTION_13_END -->

<!-- RECORD_BOUNDARY_13_START -->
**Produced coverage and handoff boundary**

- Exact approved inputs and declared source/requirement scope
- Source item mapped to the produced concept or SDD section
- Represented / missing / contradictory / explicitly deferred or excluded
- Remaining gaps, responsible actor and blocking prerequisites
- Readiness for the next independent review, not its verdict

A file hash proves identity, not correctness. Planned tests are not executed tests, and authored coverage is not implemented behavior.

**Exception without invented verification**

- Exact allowed rule, scope, human authority and decision
- Blocked activity and still-unverified items
- Permitted next stage and gates not waived
- Responsible actor, expiry/re-entry condition and later closure evidence

Only an explicitly permitted exception can authorize progression. An approved waiver never means that the skipped check passed.

**Execution record:** `analysis/stages/stage-13/knowledge-record.md`. [analysis/stages/templates/knowledge-record-template.md](../analysis/stages/templates/knowledge-record-template.md). The active-stage agent records actual work; this is not independent approval.
<!-- RECORD_BOUNDARY_13_END -->

The three outputs answer distinct questions:

- **Knowledge bundle: What must the next agent know about the target system, and which sources support it?**
- **Knowledge manifest: Which exact versions of the knowledge files and their sources belong to this package?**
- **Stage 13 record: What knowledge did the agent produce, from which exact sources, and what remains before independent control?**

XPlanner synthesis 001 contains eight populated draft concepts, their source hashes and an execution record. Its global gate remains blocked by missing current source approval and incomplete coverage; it is a concrete example of recorded work, not an example of a passed Stage 13. See the knowledge artifacts in the 3D view for exact pinned project links.

- The primary agent translates the approved architecture, parity map, approved
  prototype, ADRs, NFRs, and owner decisions into an **Open Knowledge Format
  (OKF) v0.2 bundle** under `analysis/knowledge/bundle/`.
- OKF v0.2 is an **open, vendor-neutral format published by Google Cloud**. Its
  canonical form is a directory of Markdown concepts with YAML frontmatter;
  the [official OKF specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
  defines the portable base, while this starter adds stricter migration
  provenance and hash gates.
- The bundle explains how the target system works before feature SDD prescribes
  implementation. It covers capabilities, workflows, architecture, data,
  integrations, NFRs, and decisions as small linked concepts rather than one
  monolithic narrative.
- Every concept has a stable project `id`, type, title, description, lifecycle
  status, producer, and explicit provenance. Sources point to exact governed
  artifacts. Unsupported inference is marked draft or recorded as an open
  decision; it is never presented as established knowledge.
- `analysis/knowledge/knowledge-manifest.json` pins the exact parity workbook,
  approved architecture manifest, applicable prototype/owner decisions, and
  every OKF file by SHA-256. It names both the knowledge-set version and the
  architecture document-set version from which it was derived.
- Run `npm --prefix analysis/tools run audit:knowledge`. The audit is
  fail-closed: missing manifest, placeholders, duplicate concept ids, missing
  provenance, unpinned files, stale source hashes, or malformed OKF prevent
  progression.
- OKF is a knowledge baseline, not a replacement source of business truth.
  Conflicts return to the governing source: Stage 1 for a parity-map error,
  Stage 6 for a prototype contradiction, or Stage 9 for architecture.

<a id="stage-14"></a>
### Stage 14 — Target knowledge control (independent agent)

<!-- AGENT_ROLE_14_START -->
**Role and skill.** Architect (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_14_END -->

**Feature dependencies:** Check knowledge references against the reviewed graph. Omitted or distorted prerequisites are findings; the graph does not replace the approved architecture or independent knowledge review. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Check knowledge references to the approved UI catalogue/tokens for omissions or competing visual rules; source corrections return through the existing prototype path. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_14_START -->
**Error prevention.** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_14_END -->

<!-- STAGE_QUESTION_14_START -->
**Does the knowledge package preserve the approved architecture without omissions or distortion?**
<!-- STAGE_QUESTION_14_END -->

<!-- RECORD_BOUNDARY_14_START -->
**What the review records**

- Exact scope and authoritative expected result
- Actual observation and evidence for each check
- Matched / mismatch / not-checked / not-applicable
- Linked findings, blocked scope and reconciled totals
- Verdict and next action; prior results are not newly verified

Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.
<!-- RECORD_BOUNDARY_14_END -->

- An eligible fresh independent agent receives the exact
  `knowledge-manifest.json` hash and checks **every concept**, without sampling,
  against its cited parity, architecture, prototype, and owner-decision sources.
- The reviewer checks completeness as well as correctness: every approved
  capability, workflow, data ownership rule, integration, security boundary,
  asynchronous mechanism, localization contract, NFR, and material ADR must be
  discoverable through the root index and connected to related concepts.
- The reviewer verifies that Draw.io pages and objects were not reduced to
  unsupported prose, that visual decisions are backed by textual decisions,
  and that no architecture promise disappeared during knowledge extraction.
- Knowledge findings return to **Stage 13**. A source defect returns to Stage 9
  for architecture, Stage 6 for prototype structure, Stage 5 for a deliberate
  channel/design-system change, or Stage 1 for the parity map. Each attempt is immutable
  `analysis/reviews/stage-14-pass-NNN.md`; only a clean pass on the exact current
  knowledge manifest opens SDD.
- Blocked or invalid sessions remain history and their unchecked scope is
  reassigned to a fresh eligible reviewer. A chat summary is not a gate.

### Design — how to read Stages 15–16

Design does not start from the parity map alone. It combines four approved
inputs: the parity rows and Stage 4 decisions define **what behavior is in
scope**; the prototype defines **what the applicable UI must present**; the
architecture set and its ADRs/NFRs constrain **how the target may implement
it**; and the verified OKF bundle supplies **the connected target-system
knowledge the feature depends on**.

Stage 15 turns those inputs into `spec.md`, `plan.md`, `tasks.md`, traceability,
and the target-surface inventory. The spec cites applicable OKF concepts and
exposes every implementation-shaping assumption; the plan cites the approved
ADRs and NFRs and may not invent a new architecture decision. Stage 16 gives
the exact affected chain to an independent agent, who challenges the declared
`delta` / `expanded` / `full` verification scope and checks that no upstream
decision was lost or contradicted. The owner approves or corrects the complete
assumption set and SDD scope before Stage 17 opens.

`architecture-nfr-manifest.json` is therefore not created by Design. Stage 15 consumes the
approved Stage 9 manifest read-only. The agent records affected NFR-to-SDD
links in [specs/traceability.md](../specs/traceability.template.md), the slice plan and
its tasks. The whole manifest, including evidence and hashes, remains unchanged
unless architecture is reopened and reapproved through Stages 9-12.

<a id="stage-15"></a>
### Stage 15 — Design: SDD (map + approved prototype + architecture/OKF → spec / plan / tasks)

<!-- AGENT_ROLE_15_START -->
**Role and skill.** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Support on demand: Business Analyst, UX Designer, Developer, QA. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_15_END -->

**Feature dependencies:** Read providers and consumers in feature-dependencies.json before designing this slice. Propose affected updates through the coordinator, reconcile its parity contract, bind the current node scope SHA-256 in spec.md, and plan agreed contracts and provider-dependent checks. Architecture changes return to Stage 9. Record remaining dependency questions in sdd-record.md. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** For UI work, read the pinned catalogue and tokens. Bind each Used UI Control Inventory row to its screen and stable governed variant; plan shared styles/components before consumers. Missing approved variants return to 6, foundation changes to 5. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_15_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_15_END -->

<!-- STAGE_QUESTION_15_START -->
**What exactly will we implement in the next slice, how, and how will we verify it?**
<!-- STAGE_QUESTION_15_END -->

<!-- RECORD_BOUNDARY_15_START -->
**Produced coverage and handoff boundary**

- Exact approved inputs and declared source/requirement scope
- Source item mapped to the produced concept or SDD section
- Represented / missing / contradictory / explicitly deferred or excluded
- Remaining gaps, responsible actor and blocking prerequisites
- Readiness for the next independent review, not its verdict

A file hash proves identity, not correctness. Planned tests are not executed tests, and authored coverage is not implemented behavior.

**Exception without invented verification**

- Exact allowed rule, scope, human authority and decision
- Blocked activity and still-unverified items
- Permitted next stage and gates not waived
- Responsible actor, expiry/re-entry condition and later closure evidence

Only an explicitly permitted exception can authorize progression. An approved waiver never means that the skipped check passed.

**Execution record:** `analysis/stages/stage-15/sdd-record.md`. [analysis/stages/templates/sdd-record-template.md](../analysis/stages/templates/sdd-record-template.md). The active-stage agent records actual work; this is not independent approval.

**Here is what I designed, which approved sources I used, which requirements I covered, where gaps remain, and what I am handing over for your review.**

The Stage 15 design agent records the actual source approvals or bounded exceptions, links the specification, plan and tasks, and declares coverage, gaps and readiness for Stage 16. This is not an implementation self-review, an independent verdict or delivery evidence. The Stage 16 agent must verify this handoff against its sources; audit:sdd checks the SDD package but does not read this report.

The Stage 15 agent uses the named template even for an incomplete package. An implementation self-review is not a substitute. A retrospective record names its reconstruction date, source revision and missing evidence; it never backdates approval.
<!-- TARGET_INVENTORY_READING_START -->

**Which target screens, APIs and jobs must exist, for which roles, and what useful actions must they support?**

A shared catalogue of entry points into the new system: screens, routes, API operations and jobs, their roles and useful actions. It connects each implemented action to SDD requirements, code and tests, so a reachable but empty page cannot stand in for migrated functionality. It complements the behavior-oriented parity map; it does not replace requirements or live acceptance.

The Stage 15 agent declares planned destinations and roles; the independent Stage 16 agent checks their coverage against SDD. Stage 17 adds real code and test references. Stages 18-19 reconcile delivery and live behavior, with Stage 18 recording discrepancies in its delivery report; inventory corrections return to Stage 15/17 and a new candidate. audit:target reads this JSON; audit:sdd does not. Declared implemented status is not independent acceptance.

Start with `surfaces`, then read each destination, role and useful action before the technical adapter configuration. [Field guide and worked example](inventories/README.md).

<!-- TARGET_INVENTORY_READING_END -->
<!-- TRACEABILITY_READING_START -->

**Which requirements are covered by design, implementation and tests, and where are the gaps?**

One shared index for the entire migration: which slice covers each behavior or approved target requirement, which design and prototype apply, and where implementation and verification evidence can be found. It grows with the number of slices; read the relevant slice instead of the whole file. It is not another specification or a standalone verdict that everything works.

Read one feature in Parity Map Delivery Contracts, then its prototype and requirement mappings, then follow the actual evidence. Intended delivery rows are not proof of completion. [Reading route and template](../specs/traceability.template.md).

<!-- TRACEABILITY_READING_END -->
<!-- TRACEABILITY_DUTY_15_START -->

**Traceability and verification:** The design agent adds one Slice Verification Index row with SDD links and planned checks; no execution is claimed. Requirement-to-check details stay in the slice. The index separates planned, missing and recorded evidence; recorded does not mean passed. [Required contract](../specs/traceability-guide.md).

<!-- TRACEABILITY_DUTY_15_END -->
<!-- RECORD_BOUNDARY_15_END -->

<!-- COSMETIC_FLOW_15_START -->
**Conditional Updated artifact (U): ui-polish-backlog.md.** If a cosmetic backlog exists, the design agent compares every open finding with the slice screens, components and functions, not only its assigned slice. Matching finding IDs become linked tasks in tasks.md; the agent updates the same backlog with scope matches and reasons for exclusions. Missing referenced backlog or unmapped scope blocks planning.
<!-- COSMETIC_FLOW_15_END -->

- **This is where SDD (Spec-Driven Development) happens.** All further
  development is driven by the specifications written here.
- Entry point is always the workbook: first the rows themselves are brought up
  to date (wording, SDD columns: covered / deferred with reason), only then is
  each flow turned into SDD artifacts: `spec.md` → `plan.md` → `tasks.md`
  under `specs/NNN-*`.
- The map and SDD are linked through the coverage columns and must never
  disagree.
- **Every SDD contains an `Approved Prototype Contract`.** It declares whether
  the slice affects UI. A UI slice pins the exact approved export-set version,
  every applicable screen id and SHA-256 from `screen-manifest.json`, and an
  explicit disposition of implemented versus deferred elements and visual
  divergence. A non-UI slice records why no approved screen applies.
  `audit:sdd` validates these references against `ui-ux-approval.md` and the
  manifest; a remembered screen name, an unpinned image, or a general claim
  that the design was followed is not evidence.
- **Every UI-affecting SDD also contains a used-control inventory.** It lists
  every control planned for the slice (for example primary action,
  text link, icon action, input, select, checkbox, dialog action or table
  control), maps it to an approved wireframe element and a governed shared
  variant, and records typography, icon, geometry and applicable interaction
  states plus the planned automated checks. The process does not maintain a
  speculative catalogue of controls the product does not use. A planned
  control missing from the plan, or contradictory planned styles for the same
  shared variant, blocks Stage 16. Stages 17-18 reconcile actually rendered
  controls and computed styles with this inventory and record executed evidence.
- **SDD is bound to the approved architecture and verified OKF baseline**:
  every spec names the stable OKF concept ids it implements or changes, and
  every plan names
  the ADR ids it relies on; an SDD decision with no backing ADR, or one that
  contradicts an ADR, is a defect. The Stage 15 agent records the affected
  NFR IDs, approved source version/hash, acceptance criteria, owning SDD
  requirements/tasks and planned tests in downstream
  [specs/traceability.md](../specs/traceability.template.md) and the slice plan.
  Every affected criterion needs an owner; the approved NFR manifest is
  consumed read-only, with no added `sdd` fields or changed evidence. (Skipped when the owner waived the architecture
  stages for the scope.)
- Every UI-affecting SDD copies the approved locale list instead of inventing
  or silently dropping languages. It identifies new translation keys and owns
  success, validation, error, empty, dialog, navigation, date/number formatting,
  locale-switch, fallback, and text-expansion evidence for each applicable
  locale. A locale does not duplicate every screen, but representative risky
  surfaces must be checked with the longest governed translations.
- Build or update `analysis/inventories/target-surface-inventory.json`. Every target route,
  menu item, role workspace, screen, API operation, and job in the slice maps
  to a concrete user-visible action or observable contract plus its SDD
  requirement. A target-only role or screen with no legacy predecessor needs
  an explicit owner-approved target requirement; it cannot inherit completion
  from a similarly named legacy file or page. Automated evidence names the
  concrete test case after `#` and binds the test title to the surface and role
  with `@surface:<id>` and `@role:<role>`. The binding is structurally audited;
  Stages 18/19 must still execute the action because metadata cannot prove test
  semantics.
- Decompose bundled workbook outcomes before claiming coverage. If one row says
  that a control panel exposes seven actions, navigation-shell evidence does
  not cover the row: each action must be traceable to SDD and planned
  verification, or the row must be split/deferred explicitly.
- **Expose implementation assumptions before asking for approval.** Every new
  or reopened SDD contains `Owner-Reviewed Implementation Assumptions` in
  `spec.md`. For each `ASM-NNN`, the agent preserves its proposal, evidence and
  uncertainty, implementation impact, the owner's disposition
  (`approved-as-proposed` or `corrected-by-owner`), and the exact final
  decision. The owner may say "implement as proposed" for the complete list;
  that is recorded as explicit approval, not inferred from silence. A genuine
  zero-assumption slice records `no-assumptions` and still receives owner
  review. A new assumption discovered in `plan.md` or `tasks.md` returns to the
  spec table before review.
- Assumptions do not bypass upstream governance. An assumption that changes
  architecture returns to Stage 9; prototype/UI intent to Stage 6; legacy
  parity to Stage 1; and structured knowledge to Stage 13.
- **Declare the verification blast radius before implementation.** Every new
  or reopened SDD contains `Change Impact and Verification Scope`. It selects
  exactly one mode: `delta` for the current slice plus evidenced direct
  dependents, `expanded` for a named shared subsystem, or `full` for a new
  baseline, broad map/architecture change, unknown blast radius, scheduled
  checkpoint, or final acceptance. The table covers parity and decisions,
  architecture and knowledge, backend contracts, data/background work,
  security, UI/design system, and deployment/operations. It records selected
  and excluded checks with evidence plus triggers that immediately expand the
  scope. This is the dependency map for the slice; a separate speculative
  project-wide graph is not required before SDD.
- **Not a single line of implementation code before the owner approves the
  SDD.**

<a id="stage-16"></a>
### Stage 16 — Design re-verification

<!-- AGENT_ROLE_16_START -->
**Role and skill.** Architect (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_16_END -->

**Feature dependencies:** Independently compare the SDD with its exact graph node digest. Verify prerequisite conditions, completion closure, exclusions and downstream impact; record node/edge IDs, digests, findings and unchecked scope in this pass. After a clean bounded review the coordinator links the report. Candidate relations or unresolved questions cannot be marked reviewed-ready. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Verify the SDD control-to-variant/token bindings and planned visual checks against the approved shared UI baseline, without claiming that unbuilt UI has been tested. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_16_START -->
**Error prevention.** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_16_END -->

<!-- STAGE_QUESTION_16_START -->
**Is the implementation plan sound, and has the owner approved its assumptions and scope?**
<!-- STAGE_QUESTION_16_END -->

<!-- RECORD_BOUNDARY_16_START -->
**What the review records**

- Exact scope and authoritative expected result
- Actual observation and evidence for each check
- Matched / mismatch / not-checked / not-applicable
- Linked findings, blocked scope and reconciled totals
- Verdict and next action; prior results are not newly verified

Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.
<!-- TRACEABILITY_DUTY_16_START -->

**Traceability and verification:** The independent reviewer checks index links and behavior-to-requirement-to-planned-check coverage in both directions. Missing coverage returns to Stage 15; testability is not a passed test. The index separates planned, missing and recorded evidence; recorded does not mean passed. [Required contract](../specs/traceability-guide.md).

<!-- TRACEABILITY_DUTY_16_END -->
<!-- RECORD_BOUNDARY_16_END -->

<!-- COSMETIC_FLOW_16_START -->
**Conditional Input artifact (I): ui-polish-backlog.md.** The independent agent reads the conditional cosmetic backlog and checks scope matching and task coverage in the Stage 15 plan. An applicable finding without a task blocks the pass and returns to Stage 15. The reviewer records the result in the immutable Stage 16 report, not by silently changing the backlog.
<!-- COSMETIC_FLOW_16_END -->

- Before any build starts, a **different agent** first challenges the SDD's
  declared blast radius, then cross-checks the applicable chain from Stages
  1–15. The reviewer follows real dependencies through the parity map,
  architecture/knowledge records, contracts, inventories, and code. It may
  expand an under-declared scope from `delta` to `expanded` or `full`; it may
  not shrink the producer's scope without evidence.
- Within the declared scope, the reviewer checks every applicable item without
  sampling:
  - map ↔ legacy: is every legacy flow captured (nothing lost in
    reconnaissance or the live walkthrough)?
  - map ↔ decisions: are the requirements-revision decisions reflected?
  - map ↔ SDD: is every row covered by the specs or explicitly deferred with
    a written reason?
  - target surface ↔ SDD: does every declared role and destination have a
    concrete useful action and acceptance evidence, rather than a placeholder
    heading or access probe?
  - wireframes ↔ SDD: does every screen of the approved prototype (per the
    approved version/hash in `analysis/prototyping/ui-ux-approval.md`) trace to the
    specs, and does the SDD's UI scope still match the approved prototype? If
    SDD work after Stage 8 changed the UI, the change **returns to Stage 6**:
    the wireframes are updated, Stage 7 control and Stage 8 approval are
    repeated for the changed scope. (Skipped when the owner waived
    prototyping for the reviewed scope.)
    The reviewer opens the pinned exports and compares composition,
    navigation, roles, states, text hierarchy, responsive behavior and design
    tokens with the SDD requirements, control inventory and planned visual
    checks. New UI does not need to exist before Stage 17. Existing UI may
    inform impact analysis, but is not proof of the unimplemented change.
    Stage 17 compares the implemented candidate visually with the exports;
    Stage 18 repeats that comparison on the deployed UI. Functional tests or
    matching HTML labels never substitute for those visual checks.
  - architecture ↔ SDD: does every spec rely only on approved ADRs (per the
    verdict-pinned `document_set_version`), is no ADR contradicted, and is
    every NFR acceptance criterion owned by an SDD requirement or task via
    [specs/traceability.md](../specs/traceability.template.md), with the exact approved
    architecture version/hash and planned test? The manifest stays unchanged.
    A divergence returns to Stage 15 to conform
    the SDD — or, when the architecture itself must change, to Stage 9 with
    Stages 10–12 repeated for the changed scope. (Skipped when the owner
    waived the architecture stages for the reviewed scope.)
  - OKF ↔ SDD: does each SDD cite the verified knowledge concepts it consumes,
    does it avoid contradicting them, and does every changed concept return to
    Stage 13 for regeneration and another Stage 14 control pass? A knowledge
    gap is not silently repaired only inside one feature specification.
- The check is not paper-only: following the **source code evidence** columns,
  the agent reopens the cited legacy sources for every parity row in scope and
  verifies that the requirement and SDD match the code and observed behavior.
- Discrepancies return to Stage 15. Implementation does not start until this
  re-verification is clean. Unrelated rows are not reread on a `delta` pass;
  their exclusion must be evidenced. A map or shared-contract change, an
  unexplained dependency, or uncertainty about blast radius forces
  `expanded` or `full` review.
- Every pass is recorded as `analysis/reviews/stage-16-pass-NNN.md`. Findings
  require a Stage 15 correction and another eligible fresh-agent pass. The gate
  to build opens only after a clean report, recorded pass history, a successful
  workbook audit, and explicit owner approval of the relevant SDD.
- Stage 16 also verifies that every implementation-shaping inference in the
  spec, plan, and tasks is present in the owner-reviewed assumption table, has
  a final decision, and remains consistent with approved upstream artifacts.
  Pending, hidden, incomplete, or newly introduced assumptions make the pass
  findings and block Stage 17.
- A blocked or invalid session remains immutable history. Its exact unchecked
  scope MUST be assigned to later eligible fresh sessions and covered in full.
  The pass cannot close until `unresolved_blocked_scopes` is zero and a fresh
  consolidator verifies the closure mapping. The final report records each
  external finding, the primary agent's accepted/rejected disposition, the
  correction, and the repeat-review outcome.

### Coding — how to read Stage 17

Stage 17 consumes the owner-approved SDD and its traceability/impact scope, the
approved prototype set for UI work, the affected NFR criteria, the target-surface
inventory, and the exact commands in [`config/project.yaml`](../config/project.yaml). It produces one
synchronized candidate: code, tests, migrations when needed, updated SDD and
traceability, NFR evidence, and a reviewed PR at an exact revision.

The boundary is deliberately pre-deployment. `build`, impact-scoped `test`,
applicable `visual_parity`, `audit:sdd`, `audit:target`, and slice peer review
must pass before the owner merges. `audit:sdd:slice`, green parity-map rows,
and claims of live behavior belong to Stage 18, after the merged revision is
deployed and exercised on the governed environment. Only exact post-merge
deployment/reconciliation tasks may remain open at the Stage 17 boundary; live
journey, revision, and acceptance reports remain separate stage records.

Implementation defects found before merge remain inside Stage 17. If the work
instead proves that the approved SDD is wrong, return to Stage 15; an
architecture defect returns to Stage 9; and a parity-map defect returns to
Stage 1. The corrected upstream chain must be re-approved before Build resumes.

<a id="stage-17"></a>
### Stage 17 — Build (code, tests, and documents in one PR)

<!-- AGENT_ROLE_17_START -->
**Role and skill.** Developer (responsible author); separate Developer peer. PM coordinates; the assigned session reads .agents/skills/migration-developer/SKILL.md and returns ACK before work. Support on demand: UX Designer, QA. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_17_END -->

**Feature dependencies:** Require the selected SDD-bound dependency scope to pass audit:dependencies --require-reviewed --scope NNN-slug before implementation handoff. Implement against the agreed contracts and verify relevant consumers/providers. New dependencies return to Stage 15 or 9; do not delete an edge to unblock work. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Implement shared token-derived styles and reusable components; verify actual computed values, icons and states. Do not invent private screen styles. Missing design returns through Stage 15 to 6 or 5, then affected review/approval. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_17_START -->
**Error prevention.** The implementation agent reads applicable checks before work and self-checks the candidate before handoff and after fixes. A separate peer independently checks it; Checklist Review links each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The reviewer also proposes reusable lessons. The coordinator validates and deduplicates updates; a self-check is not peer approval. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_17_END -->

<!-- STAGE_QUESTION_17_START -->
**Is the agreed slice implemented and verified in code and tests?**
<!-- STAGE_QUESTION_17_END -->

<!-- RECORD_BOUNDARY_17_START -->

<!-- TRACEABILITY_DUTY_17_START -->

**Traceability and verification:** The implementation agent links actual tests and execution records with checked revision, environment, expected/observed outcomes and gaps. The independent reviewer checks their meaning; a plan cannot be execution evidence. The index separates planned, missing and recorded evidence; recorded does not mean passed. [Required contract](../specs/traceability-guide.md).

<!-- TRACEABILITY_DUTY_17_END -->
<!-- RECORD_BOUNDARY_17_END -->

<!-- COSMETIC_FLOW_17_START -->
**Conditional Updated artifact (U): ui-polish-backlog.md.** The implementation agent reads the conditional cosmetic backlog and rechecks the actual changed screens, components and functions. The agent fixes applicable findings, links tasks, commits and rendered evidence, and marks them ready for independent verification. Only recorded independent verification makes a finding verified closed. Scope changes return through the affected planning controls.
<!-- COSMETIC_FLOW_17_END -->

- The implementation agent includes the target slice's deferred minor visual
  corrections in its tasks, fixes them and links rendered evidence and the
  independent verification result from the backlog. When approved prototype
  files change, repeat the affected Stage 6-8 controls and repin the baseline;
  do not silently edit an approved export.

- Select one approved feature or a small, tightly related feature group. Do not
  pull the entire approved backlog into one implementation batch.
- Branch first (`main` stays stable) → implement on the target stack. After
  the PR merges, delete the source branch: the merge commit, the PR and the
  recorded evidence are the durable history, and stale branches are not.
  Prefer enabling the host's automatic head-branch deletion on merge.
- **Automated tests are a hard gate**: no PR ships on red.
- **Approved visual parity is a separate fail-closed gate.** Every UI-impacting
  slice runs the configured `commands.visual_parity` at desktop and mobile
  viewports against the exact export-set version, manifest hash, screens,
  states, icons, typography, palette, spacing, and composition cited by its
  SDD. Functional E2E, a route, a heading, or a screenshot made from the
  current implementation cannot replace the approved wireframe baseline.
  Presence of the right text or control is not sufficient. The active SDD must
  include a `Binding Visual Style Checks` table for every approved screen with
  source-derived computed checks for typography, component geometry, palette,
  spacing, states, iconography and content fidelity. Content fidelity binds
  representative populated, missing, boolean, badge and long/localized values,
  including exact copy, case, punctuation, placeholder glyphs, wrapping and
  truncation. A missing category blocks Stage 17 and 18. Apply
  [`analysis/prototyping/ui-visual-parity-checklist.md`](./prototyping/ui-visual-parity-checklist.md) before every UI correction
  and delivery; a matching symbol with inherited wrong typography still fails.
  Interactive states are not implied by that category name: every hover,
  focus, active/pressed, selected, disabled, validation or error state declared
  by the approved source must be named in the SDD and activated by a browser
  assertion that checks the source-derived computed style immediately before
  the interaction and the resulting computed style or behavior after it. A
  test that checks only the activated state can preserve an incorrect resting
  style and fails the gate. A static screenshot and a generic `browser state
  assertion` cannot prove interaction.
  Shared page geometry has an explicit owner. When several sibling routes use
  one shell or navigation group, the active SDD names the component that owns
  the outer top/left inset and the browser compares breadcrumb, navigation and
  primary-heading coordinates at one viewport. Feature-local spacing may
  separate internal content, but may not silently add a second page-frame
  inset. A source ownership audit prevents the duplicate rule from returning.
  Before the screen assertions run, the browser enumerates every rendered
  control from the SDD used-control inventory. Each must identify a governed
  shared variant and match that variant's exact computed typography, icon,
  geometry and applicable default/hover/focus/pressed/selected/disabled/error
  contract. Feature-local CSS may not silently redefine a shared variant. This
  is how buttons, links, inputs, selects, checkboxes and later control types are
  covered without hard-coding every possible HTML element into the flow.
  Every deployed UI slice remains registered in
  `delivery.delivered_ui_slices` as the permanent regression inventory, but it
  is not rerun automatically for every feature. A `delta` pass checks the
  active SDD's screens plus exact directly affected `slice#surface` entries in
  `delivery.ui_parity_corrections`; an `expanded` pass enumerates every affected
  shared-shell/component surface in the active SDD; a `full` pass adds the
  complete delivered inventory. Omitting a known dependent surface or falsely
  declaring `delta` is a protocol failure.
  Role-aware navigation has an additional semantic contract: missing permission
  renders no destination; a disabled destination is allowed only when the role
  has permission but required context or an explicitly deferred implementation
  is unavailable. The active SDD records a role/destination matrix and tests the
  direct URL separately, because hidden navigation is not authorization. An
  inconsistent hidden/disabled treatment blocks the slice unless an explicit
  owner decision approves the difference.
  `commands.visual_parity.minimum_similarity_percent` MUST be from 95 through
  100 and the configured command MUST fail below it. This percentage is the
  minimum visual-similarity score, not a coverage allowance: approved screens,
  states, roles, actions, content, and icons require 100% coverage. Exact-pixel
  comparison may set 100 and is stronger than the minimum contract.
  Missing coverage, an unchecked viewport/state, a changed snapshot, or any
  unapproved divergence blocks Stage 17. Only a scope-specific owner decision
  may authorize a deliberate divergence; an agent cannot update baselines to
  make its own implementation pass.
- **Baseline provenance is executable evidence.** The gate resolves every
  affected surface (plus `app-shell` when present) through
  `screen-manifest.json`, re-hashes its file under
  `analysis/prototyping/wireframes/`, and passes that exact path/hash contract
  to the visual test. Source-derived checks cover labels, icon identifiers,
  navigation order and selected state, representative content variants,
  placeholder glyphs, actions, composition, roles and
  explicitly activated interactive states.
  An implementation-generated screenshot is secondary regression evidence
  only; passing against it alone proves merely that the UI resembles itself.
- The slice MUST pass the approved engineering-quality profile. Agents may not
  suppress warnings, skip/disable tests, add coverage exclusions, weaken strict
  settings or edit CI gates merely to make their change pass. Any justified
  exception is narrow, recorded and independently reviewed.
- Before review, inspect every added or changed string literal. A stable identifier,
  configuration key, external contract, error code, role/policy/claim, cookie/header,
  route shared across callers, or persistence identifier is centralized and covered
  by the stack-specific literal gate; UI prose is moved to the approved localization
  mechanism. A genuinely local, one-use, non-contract implementation literal stays
  local instead of entering a global constants bag. The gate must run in the normal
  CI entrypoint and contain regression fixtures for both the rejected and permitted
  cases.
- Every NFR acceptance criterion the slice affects ships with a test or a
  scripted measurement proving it. The Stage 17 agent records the executed
  test/measurement and result in downstream
  [specs/traceability.md](../specs/traceability.template.md) and the slice evidence in
  the same PR, without changing the approved architecture manifest. A failed
  architecture assumption returns to Stage 9 for correction and reapproval.
  (Skipped when the owner waived the architecture stages for the scope.)
- A new visible route or role destination ships only with a completed
  target-surface inventory entry and an automated test that performs or
  observes its useful action. Route existence, `200 OK`, authorization success,
  and heading-only assertions are necessary checks but never sufficient
  acceptance evidence.
- After tests pass, the primary agent sends the slice requirements and diff to
  a fresh read-only external reviewer. It validates every response rather than
  accepting it automatically. Confirmed findings are fixed and tests rerun;
  material unresolved disagreement blocks the slice and goes to the owner.
- The candidate PR synchronizes code and SDD artifacts. The workbook rows stay
  truthful about their pre-deployment state until Stage 18 proves the exact
  revision on the target environment. A code-only PR that leaves its SDD stale
  is incomplete. `specs/traceability.md` contains the mandatory machine-readable
  `Parity Map Delivery Contracts` table: every slice is exactly one of
  `legacy-backed` (exact delivered/deferred workbook rows) or `target-only`
  (no invented legacy rows and an exact owner decision). Before Stage 17 can
  authorize deployment, `audit:sdd` verifies design/implementation traceability;
  narrative traceability elsewhere cannot substitute for the table. Exactly
  identified deployment and reconciliation tasks may remain open at this
  boundary; implementation tasks may not. After Stage 18 records the immutable
  deployed revision and live journey, a records-only descendant may add Stage
  18 evidence, update the workbook and status, and check those delivery tasks.
  It must not change runtime, build, deployment, configuration, requirements or
  plans. [`analysis/tools/verify-attestation-history.js`](./tools/verify-attestation-history.js) checks the complete Git
  history from the deployed candidate, not only the final diff; the only
  permitted paths include append-only admitted rows in the existing error-prevention checklist,
  the parity workbook, migration status, Stage 17/18
  records, the active slice's `specs/<slice>/tasks.md` checklist, and only
  the existing Slice Verification Index evidence cells in `specs/traceability.md`.
  Preserve prior links and append only immutable slice-bound delivery links;
  do not change scope, requirements, SDD links or planned checks.
  `audit:sdd:slice` then verifies every delivered row is green with both SDD
  and target evidence and every deferred row is explicitly orange with
  evidence. Any contradictory live result returns the slice to Stage 17 instead
  of allowing reconciliation.
- **Merge is the owner's decision only.**

### Deployment and QA — how to read Stages 18-19

Delivery and reconciliation are one Stage 18: deploy, execute required checks, discover uncovered behavior and reconcile the governed records in the same delivery report. Independent acceptance follows as a separate stage with a fresh reviewer and explicit owner decision.

<a id="stage-18"></a>
### Stage 18 — Delivery and live reconciliation (one-command deploy)

<!-- AGENT_ROLE_18_START -->
**Role and skill.** Developer (responsible-agent verification). PM coordinates; the assigned session reads .agents/skills/migration-developer/SKILL.md and returns ACK before work. Support on demand: QA. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. PM rechecks access and release authorization and runs the approved deployment; Developer owns verification/reconciliation and the delivery report. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_18_END -->

**Feature dependencies:** Read the SDD-bound graph and verify actual delivery/evidence for all transitive confirmed completion providers. audit:sdd:slice expands that scope. Contract dependencies alone do not require the entire provider implementation. Do not edit graph expectations to fit deployed behavior. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Compare applicable deployed UI with the same pinned shared catalogue/tokens and screen exports. Reuse valid exact-revision evidence, but do not equate local checks with deployment verification. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_18_START -->
**Error prevention.** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. Records-only attestation may append new admitted rows, but cannot alter or remove existing checks. Refinement proposals stay in the report until an authorized later revision; required checks cannot be deferred. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_18_END -->

<!-- STAGE_QUESTION_18_START -->
**Does the delivered version work, have we missed any behavior, and do its records agree?**
<!-- STAGE_QUESTION_18_END -->

<!-- RECORD_BOUNDARY_18_START -->
**What was actually verified**

- Exact revision, environment, roles and scoped checks
- Expected condition versus actual observation, with evidence
- Passed or matching checks, differences and unexecuted scope kept separate
- Outstanding IDs, responsible actor, retry condition and next gate

Reachability, live behavior, simulation and planned work are not interchangeable. A corrected delivery gets new immutable evidence; approval remains separate.

**Execution record:** `analysis/stages/stage-18/delivery-NNN.md`. [analysis/stages/templates/delivery-NNN-template.md](../analysis/stages/templates/delivery-NNN-template.md). The active-stage agent records actual work; this is not independent approval.
<!-- LIVE_RECONCILIATION_START -->

**Did this release deploy safely, cover the required live behavior and agree with its governed records?**

One immutable report for the exact deployed revision: deployment, recovery readiness and useful live checks, followed by coverage reconciliation against the map, SDD, prototype and inventory. The report records discrepancies and required return-stage corrections; it does not silently rewrite approved files. Prepared tests are not assumed to cover every behavior. Required unverified scope prevents clean delivery; independent acceptance remains separate.

The Stage 18 delivery agent records deployment, recovery readiness, smoke, raw journey and visual results, then completes Live Reconciliation in this same report. The agent discovers actual scope, compares it with the parity map, SDD, approved prototype and inventory, reuses applicable observations and investigates uncovered behavior. Missing required coverage blocks closure. audit:delivery validates the required reconciliation structure and bindings; the agent and independent acceptance reviewer check the meaning of evidence. No separate live-revision report is created.

**Example:** Illustrative: the browser journey proves an editor can save hours. During reconciliation the delivery agent cites that case without rerunning it, investigates an uncovered read-only action and records the discovered Edit-button defect. Delivery remains open until the defect and affected records are corrected. Historical XPlanner reports below retain their original scope and do not claim the new combined checks.

<!-- LIVE_RECONCILIATION_END -->
<!-- TRACEABILITY_DUTY_18_START -->

**Traceability and verification:** The delivery agent links exact deployed-revision, smoke and public-journey records. Missing required evidence blocks closure; local candidate results do not prove deployed behavior. The index separates planned, missing and recorded evidence; recorded does not mean passed. [Required contract](../specs/traceability-guide.md).

<!-- TRACEABILITY_DUTY_18_END -->
<!-- ROLLBACK_READINESS_START -->

**Can this exact release be recovered safely, what was checked, and what remains unproven?**

Rollback Readiness is a required section of the delivery record, not a separate artifact. The Stage 18 agent records the exact release/environment, recovery strategy and target, prerequisites and data compatibility, actual check, producer/time, expected and observed outcome, result, limitations and evidence. Inline recorded output needs no extra file; an optional local attachment has a SHA-256 digest. The audit validates fields, bindings, passed result and evidence presence/digest; an agent verifies evidence meaning and scope. It never executes rollback. Distinguish a controlled recovery rehearsal from a readiness-only check and never claim one proves the other. Missing, failed, blocked or not-run checks prevent new closure; preserve old reports and create new evidence instead of backdating verification.

[Required section and field meanings](stages/templates/delivery-NNN-template.md). [Historical Foundation rehearsal](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/stages/stage-18/foundation-delivery.md#operational-rehearsal) proves only that older release.

<!-- ROLLBACK_READINESS_END -->
<!-- RECORD_BOUNDARY_18_END -->

<!-- COSMETIC_FLOW_18_START -->
**Conditional Input artifact (I): ui-polish-backlog.md.** Before production release, the delivery agent matches the conditional backlog against all screens, components and functions in the release, including shared components. An applicable finding assigned to a later slice still blocks release until verified closed. The delivery record cites the backlog revision and checked finding IDs. Demo/test deployment may precede closure to obtain evidence. During live reconciliation the delivery agent records reproduced cosmetic findings in the immutable delivery report and blocks closure. Stage 17 reopens the same backlog, preserves history and produces a newly reviewed candidate.
<!-- COSMETIC_FLOW_18_END -->

- Before the affected slice's first production deployment, the delivery agent
  checks that every assigned minor visual correction has verified closure
  evidence. An open item blocks production release. Demo/test deployment may
  provide verification evidence but does not waive this deadline.
  This is an explicit release review obligation; a green automated audit alone
  does not prove visual closure.

- Deliver the current slice before implementation starts on the next slice.
- Before each release, PM rechecks the owner grant for the exact environment,
  candidate and operation/data scope under [the deployment handoff](../config/REMOTE_SERVER.md#configure-before-remote-work).
  PM requests missing or changed access and role accounts; an existing valid grant
  may be reused only within its recorded scope. Legacy/demo permission does not
  authorize new-application/production deployment. Developer prepares the reviewed
  procedure in Stage 17; PM runs its configured deploy command and hands back the
  actual execution evidence. Developer owns verification/reconciliation and the
  delivery report. QA assistance does not replace independent Stage 19 acceptance.
- Read and validate the canonical [`config/environments.yaml`](../config/environments.yaml) contract before
  any remote operation. Record the exact environment ID, connection
  verification, deployed revision, and deployment root in the Stage 18 report.
  A missing or invalid environment contract blocks delivery.
- Deploy with a single command to a demo stand where **legacy and the new
  system run side by side**: the same flow can be shown in both worlds.
- The two systems have different delivery rhythms: **legacy is deployed to the
  stand once** and then simply lives there as the comparison baseline, while
  **the new system is redeployed after every delivered feature**.
- A smoke test closes every delivery.
- Classify a failure before returning: implementation or deployment defects go
  to **Stage 17**, an SDD defect to **Stage 15**, an architecture defect to
  **Stage 9**, and a parity-map defect to **Stage 1**.
- Every changed Excel workbook passes three fail-closed checks before delivery:
  the structural workbook audit, a rendered visual inspection, and a clean
  read-only open in Microsoft Excel Desktop. Any recovery prompt, removed-record
  notice, repair log, or failed Desktop open returns the slice to Stage 17. A
  parser or library successfully reading the file does not satisfy this gate.
- The immutable delivery record pins the SHA-256 of the parity workbook and
  repeats the slice's exact row closure (or target-only owner decision).
  `audit:delivery` reopens Stage 17 when the hash, row set, status or evidence
  differs; a separately green code/test result cannot hide a stale map.
- The smoke must fail on visible placeholders and must execute one meaningful
  action for each changed or directly affected role-visible destination.
- Stage 18 also runs the configured `commands.user_journey` as a separate,
  fail-closed gate against the public deployed revision. For every web slice,
  even when authentication code did not change, the journey opens the anonymous
  entry route in a real browser, fills and submits the sign-in form, proves the
  authenticated landing, completes a useful action on every changed or
  directly affected surface for each applicable role, and signs out. Direct
  API calls, mocked browser routes,
  route existence, `200 OK`, and health checks are supplemental and cannot
  satisfy this gate. A non-zero journey exit blocks Stage 18.
- The journey command honors `DELIVERY_EVIDENCE_MODE`: `persist` writes the
  untouched raw Playwright JSON and its summary as two immutable,
  content-addressed sibling files, while `verify-only` reruns the gate without
  attempting a duplicate write. The summary names the raw report and pins its
  SHA-256, exact deployed revision, passed tests, changed surfaces, local parity
  revision, and deployed asset-manifest hash. Stage 18 validates the raw report
  itself with [`analysis/tools/verify-user-journey.js`](./tools/verify-user-journey.js); a self-reported summary
  alone cannot close delivery. Test fixtures for different roles
  and browser steps bind one stable entity id; independently selecting "the
  first" entity is allowed only when the fixture exactly reproduces the
  production filter and ordering and a regression test proves the match.
- Stage 18 reruns `commands.visual_parity` against the public deployed
  revision. Passing locally is insufficient: missing icons/assets, production
  CSS drift, responsive divergence, or a mismatch with the approved screen
  hash returns the slice to Stage 17.
- Record rollback readiness in the Stage 18 report: the exact governed command
  or procedure, how it was validated for this revision, its result, and durable
  evidence. Merely naming a rollback command without checking readiness does
  not close delivery.

#### Live Reconciliation Within Delivery

**Post-deployment boundary.** The delivery agent records observations in the immutable delivery report. In the records-only descendant, it may append slice-bound delivery links and set `recorded` in the existing Slice Verification Index evidence cells; it cannot change requirements, scope, SDD links, inventory or cosmetic decisions. Findings requiring those changes return to their owning stage, followed by review and a new candidate/deployment. `verify-attestation-history.js` checks every intermediate commit, not only the final diff. The report records a reproduced cosmetic finding immediately; Stage 17 reopens the backlog in the correction candidate. A failing live check never becomes a pass through an index update.

- Revise the current delivered slice and its declared direct dependents before
  selecting the next one. An `expanded` or `full` trigger widens this walk to
  the exact scope recorded in the SDD.
- The delivery agent starts reconciliation from this delivery's checks and linked
  raw journey, smoke and visual evidence. It validates applicability before
  reusing observations; a green summary alone is insufficient. This is not a
  second full deployment, smoke, journey or visual-parity run.
- The agent discovers live surfaces and reconciles coverage in **both systems,
  across every in-scope channel**: web, terminal or desktop, API, messaging
  and batch jobs. Existing test cases are not assumed to exhaust behavior.
  Uncovered or uncertain behavior is explored live against the approved
  target expectations, including authorized changes from legacy.
- Before walking, enumerate routes, navigation items, roles, screens, API
  operations, and jobs from the deployed target and reconcile that inventory
  with `analysis/inventories/target-surface-inventory.json`. For every applicable role,
  account for every in-scope navigation item and its useful action: cite
  applicable Stage 18 observations or execute a new live check. Reuse needs
  the same deployed revision/environment, relevant roles, data/preconditions,
  approved baseline and exact scope, with no contradictory observation.
  Record source case/run and original producer/time, not a fictional new run.
  Repeat affected checks only for a recorded trigger: changed conditions,
  missing/insufficient evidence, discrepancies, suspected regressions or
  expanded/full scope. A new deployed revision first needs Stage 18 evidence.
  A page that only authenticates, loads, returns `200`, or displays its title is
  recorded as a gap when the inventory or SDD promises functionality.
- Scan the deployed and source UI for placeholder destinations (for example
  "next migration slice", "coming soon", "not implemented", or an empty generic
  workspace). A deferred surface may remain only when it is explicitly
  owner-approved and hidden from production navigation.
- The walked UI is also compared against the **approved prototype** (the
  export set pinned by version/hash in `analysis/prototyping/ui-ux-approval.md`):
  screen composition, navigation, and declared states must match the approved
  wireframes. A visual divergence is a finding — a gap to fix or a
  gray-status decision for the owner; it never passes silently. (Skipped when
  the owner waived prototyping for the walked scope.)
- Every finding is recorded in the immutable delivery report and reflected in the map/status. Required SDD, inventory or cosmetic-backlog corrections are made at the classified return stage, then reviewed in a new candidate; they are not rewritten inside a records-only attestation.
- **Unverified = not done (red).** Every gap records its provenance:
  confirmed by observation, or not-checked (the check is then the first step
  of closing it).
- Exactly three finding types (per the workbook instructions):
  - **gap** (red) — claimed/expected but absent → back into the cycle:
    map → SDD → code;
  - **decision** (gray) — differs from legacy with a recommendation → owner
    approves the deviation or orders the work;
  - **deferred** (orange) — consciously postponed, reason recorded → final
    acceptance backlog.
- The workbook audit script (`node analysis/tools/workbook-audit.js`) must
  pass before any workbook commit.
- After any Destination or SDD status change, run
  `npm --prefix analysis/tools run sync:workbook-progress`. Each flow banner
  must display the rounded percentage of fully closed child rows; the workbook
  audit fails when that visible percentage is missing or stale.
- The target-surface audit
  (`npm --prefix analysis/tools run audit:target`) must pass before Stage 18
  can close.
- Complete coverage accounting is mandatory; repeating all old checks is
  not. Missing evidence stays unverified and prevents a clean result. Live
  surface discovery and reconciliation are not replaced by reading reports.
  Required Stage 18 audits still run against current records and target;
  Stage 19 retains its independent acceptance procedure.

<a id="stage-19"></a>
### Stage 19 — Slice and final acceptance (someone else's hands)

<!-- AGENT_ROLE_19_START -->
**Role and skill.** QA (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-qa/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. QA returns independent evidence only; PM records the owner walkthrough/decline, sign-off and authorized status changes. [Delegation contract](agent-roles.md).
<!-- AGENT_ROLE_19_END -->

**Feature dependencies:** Phase A receives neutral dependency expectations without graph review outcomes. In Phase B open the full graph and exact reviewed SDD binding; reconcile provider coverage, actual delivered evidence and the transitive completion scope. Missing edges in unassessed scope are not evidence of independence. Follow [the graph contract](feature-dependencies-guide.md).

**Shared UI duty:** Phase A receives relevant shared UI expectations without prior outcomes. Phase B verifies the extract against the full pinned catalogue/tokens and reconciles actual deployed findings. Follow the [shared UI procedure](prototyping/ui-design-system-guide.md); historical compatibility is not new approval.

<!-- ERROR_PREVENTION_19_START -->
**Error prevention.** Phase A: do not open the learned checklist, its extracts or prior self-check/learning notes. Save independent observations first. Phase B: read the pinned checklist, check applicable rows and reconcile with those observations. In Checklist Review, link each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. [Required procedure](error-prevention.md).
<!-- ERROR_PREVENTION_19_END -->

<!-- STAGE_QUESTION_19_START -->
**Has independent acceptance confirmed the result, and has the owner accepted it?**
<!-- STAGE_QUESTION_19_END -->

<!-- RECORD_BOUNDARY_19_START -->
**What the review records**

- Exact scope and authoritative expected result
- Actual observation and evidence for each check
- Matched / mismatch / not-checked / not-applicable
- Linked findings, blocked scope and reconciled totals
- Verdict and next action; prior results are not newly verified

Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.
<!-- TRACEABILITY_DUTY_19_START -->

**Traceability and verification:** After the blind inspection, the independent acceptance reviewer reconciles index, behavior and actual results. Required unverified scope prevents clean acceptance; an owner waiver is not a passed test. The index separates planned, missing and recorded evidence; recorded does not mean passed. [Required contract](../specs/traceability-guide.md).

<!-- TRACEABILITY_DUTY_19_END -->
<!-- RECORD_BOUNDARY_19_END -->

<!-- COSMETIC_FLOW_19_START -->
**Conditional Input artifact (I): ui-polish-backlog.md.** The independent acceptance agent consumes the conditional backlog after the blind acceptance pass, during evidence reconciliation, so prior findings do not bias the first inspection. The agent checks applicable finding IDs and verified closure against the running system; final acceptance checks the whole backlog. Open applicable findings block acceptance and return to Stage 17; the immutable acceptance report records the outcome.
<!-- COSMETIC_FLOW_19_END -->

- The independent acceptance agent checks the slice's minor visual correction
  backlog against the rendered result and linked closure evidence. Assigned
  open items block slice acceptance; final migration acceptance checks all
  remaining items. A Stage 7 deferral is not proof of completion.

- Every delivery slice receives an independent acceptance pass over its
  declared impact scope. A clean slice releases the next slice. A finding is
  classified before return: implementation-only goes to Stage 17, an SDD defect
  to Stage 15, an architecture defect to Stage 9, and a map defect to Stage 1;
  the affected downstream gates then repeat.
- One **consolidated backlog** of everything still open; the automated audit
  proves completeness — an open row outside the backlog is impossible.
- The final checklist run (across all channels) and audit are given to **third-party agents of
  other vendors** (e.g. Google Antigravity, OpenAI Codex or equivalent): the
  agent that wrote the code never signs off on itself.
- In Phase A, the third-party agent receives instructions, the stand URL and
  exact deployed revision, neutral routing metadata and expectation-only extracts
  of the workbook and target-surface inventory. Prior results, status and findings
  are withheld. The coordinator pins each extract and its source; the reviewer
  saves observations before Phase B opens the originals and checks completeness
  under the [blind packet protocol](agent_orchestration.md#expectation-only-extracts).
  The expectation packet also includes — when prototyping was not
  waived for the scope — approved prototype assets and expectation-only approval metadata
  ([`analysis/prototyping/`](./prototyping), pinned by the approval version/hash). The reviewer
  independently
  enumerates deployed navigation/routes and compares them with that inventory.
  It must exercise useful actions for every role-visible destination; title,
  route, access-probe, and HTTP-status-only checks cannot close a surface. The
  delivered UI must also match the approved wireframes (composition,
  navigation, states); an unapproved visual divergence fails acceptance the
  same way a missing action does. When
  its results match the map, surface inventory, and approved prototype, the
  acceptance is signed by the owner.
- **Optionally the owner walks the delivered system too** — a live,
  hands-on role walkthrough of the stand. Owner findings are treated exactly
  like third-party findings and are classified to Stage 17, 15, 9, or 1 by
  their cause; they reset the dry-pass count. This walkthrough
  supplements the mandatory third-party pass and never replaces it or the
  recorded sign-off.
- PM records the owner's walkthrough, explicit decline and sign-off; the
  read-only QA reviewer supplies its independent report and never edits status.
  If the owner declines this optional walkthrough, PM records the decision as
  `owner-walkthrough-declined:<project-id>` with `decision: approved`, the
  project owner identity, exact project-id scope, timestamp, rationale, and a
  durable record. Reference it from
  `delivery.owner_walkthrough_decision_id`; an informal chat message is not a
  completion record.
- An executed owner walkthrough leaves a **durable record** —
  `analysis/stages/stage-19/owner-walkthrough-NNN.md` — naming the roles
  walked, the actions performed, and every finding (or the explicit absence
  of findings); [`analysis/migration_status.yaml`](./migration_status.yaml) references it (for a
  finding, via the reopened slice entry). A chat impression is not a record.
  Because acceptance reports are immutable, an owner finding after a clean
  pass triggers a **new independent Stage 19 pass by a fresh eligible
  agent** — the earlier report is never edited.
- This is a **human-in-the-loop checkpoint**: the agent stops and requests
  the owner's explicit sign-off. Acceptance cannot be inferred from a clean
  report, a merge, or an agent statement; without the owner's recorded
  confirmation the slice (or the final system) remains unaccepted.
- Every acceptance attempt is recorded as
  `analysis/reviews/stage-19-pass-NNN.md`. A finding returns to Stage 17, 15, 9,
  or 1 according to its classified cause, and the
  next attempt requires another eligible fresh agent. Final acceptance requires
  a clean report, a complete consolidated backlog, passing workbook, SDD, and
  target-surface audits, a complete NFR evidence chain for the accepted
  scope (every NFR acceptance criterion → test/measurement → recorded
  result; skipped when the architecture stages were waived), and the
  owner's recorded signature. No visible
  placeholder or role without a useful accepted action may remain. After all
  slices are accepted, repeat this stage once across the complete system for
  final consolidated acceptance.

## Automated gate matrix

The exact reusable commands and their minimum closing points are:

<!-- STAGE_GATE_MATRIX_START -->
| Close before leaving | Required automated evidence |
|---|---|
| Bootstrap | `audit:status`; `audit:project`; `audit:environment`; `audit:methodology`; `audit:views`; `audit:responsibilities`; `audit:artifact-links`; `audit:prevention`; Install tooling, run toolkit regression tests and initializer self-test. The agent fills bootstrap-gate-report.md with exact results; migration_status.yaml cites it. Owner authorization is separate. |
| Stage 1 | `audit:project`; `audit:workbook`; Source-derived reconnaissance and parity rows with evidence; unavailable scope stays explicit. |
| Stage 2 | `audit:workbook`; Eligible fresh reviewer; Phase A inventory saved before filled Stage 1 inputs are opened; Phase B reconciles both directions against the immutable legacy source. Clean immutable report includes snapshot/access evidence, comparisons, gaps and reconciled coverage; no blocked scope or contaminated blind pass. |
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

The canonical command spellings are maintained in
[`analysis/tools/README.md`](./tools/README.md). Plain prototype/architecture audits are
design/control gates; their strict approved variants apply after the owner
gate. The aggregate completion gate is intentionally invalid during bootstrap.

## Loops (return arrows)

| From | Back to | Trigger |
|---|---|---|
| Stage 2 (control reconnaissance) | Stage 1 | any hole or error found in the map |
| Stage 3 (live walkthrough) | Stage 1 | observed behavior missing from the map |
| Stage 4 (requirements revision) | Stage 1 | a flagged contradiction turns out to be a mapping error |
| Stage 5 | Stage 1 | baseline work exposes a parity-map defect |
| Stages 6–8 | Stage 6 / Stage 5 / Stage 1 | prototype correction / deliberate baseline change / parity-map defect |
| Stage 9 | Stage 6 / Stage 5 / Stage 1 | architecture decision changes prototype structure / deliberate baseline change / parity-map defect; repeat affected controls |
| Stages 10–12 | Stage 9 / Stage 6 / Stage 5 / Stage 1 | architecture finding / screen or navigation change / deliberate baseline change / parity-map defect |
| Stage 13 | Stage 9 / Stage 6 / Stage 1 | architecture contradiction / prototype contradiction / parity-map defect |
| Stage 14 | Stage 13 / Stage 9 / Stage 6 / Stage 5 / Stage 1 | knowledge finding, or the corresponding source defect |
| Stage 15 | Stage 13 / Stage 9 / Stage 6 / Stage 5 / Stage 1 | knowledge, architecture, prototype, baseline, or parity source must change before SDD continues |
| Stage 16 | Stage 15 / Stage 13 / Stage 9 / Stage 6 / Stage 5 / Stage 1 | SDD finding, or the corresponding upstream source defect |
| Stage 17 | Stage 15 / Stage 9 / Stage 1 | SDD, architecture, or parity source defect; implementation-only corrections remain inside Stage 17 |
| Stage 18 | Stage 17 / Stage 15 / Stage 9 / Stage 1 | deployment/implementation, SDD, architecture, or parity defect |
| Stages 18-19 | Stage 17 / Stage 15 / Stage 9 / Stage 1 | implementation, SDD, architecture, or parity defect |

Cycles repeat until every loop ends in a dry pass, except for the governed
Stage 7 Low-cosmetic closing-pass rule, and the final acceptance is clean.

## Exit criterion

The migration is done when the parity map contains **no red and no gray**,
every orange row has an owner-approved reason, and an independent third-party
acceptance run matches the map. **Proven, not claimed.**

### Minor visual correction deadline contract

**Which minor visual corrections may wait, who will fix them, and before which release?**

The [prototype polish backlog template](prototyping/templates/ui-polish-backlog-template.md)
is a list of scheduled minor visual corrections, not an indefinite wish list.
Only owner-accepted Low-cosmetic findings qualify; all prohibited classes in
the Stage 7 exit criterion below still block.

**Conditional artifact flow:** Stage 7 creates the backlog; Stage 8 reads it;
Stages 15 and 17 read and update the same file (U); Stages 16, 18 and 19
read it as input (I). Stage 19 receives it only during evidence reconciliation
after the blind pass. The filename is
`analysis/prototyping/ui-polish-backlog.md`.

Every finding has a stable ID and an explicit affected scope: screen IDs,
shared components, functions, roles and parity rows where applicable.
For each slice the agent reads every open finding and compares that scope
with the planned or actual changed functionality. A match creates a linked
implementation task; an exclusion needs an evidence-backed reason.
An unknown scope blocks the decision. The original assigned slice alone
cannot exclude a finding from an earlier release of affected functionality.

The work/review/delivery record cites the backlog revision and evaluated
finding IDs, scope matches, tasks, exclusions and closure evidence. Stage 15
and Stage 17 maintain assignments and correction evidence; independent
verification is required for verified closure. Stage 18 records reproduced
findings/regressions in its immutable delivery report and returns them to Stage 17.
Stage 17 reopens the same ID with a dated reason, preserving history, and produces
a newly reviewed candidate before another deployment.
The states are open, ready for verification, verified closed, and reopened.

If the file is absent, the agent checks the closing Stage 7 report and Stage 8
approval. No recorded cosmetic debt means the input is not applicable and no
empty backlog is created. A reference to missing debt evidence blocks.
These semantic scope and visual checks are agent/reviewer obligations; a
green automated audit does not establish their completion.

- The independent Stage 7 reviewer records each finding and its review session.
  Before Stage 8 approval, the coordinating agent records a responsible agent,
  a named implementation slice, a linked task and the owner's explicit agreement.
  The Stage 15 agent incorporates the task into that slice's implementation plan.
- The Stage 17 implementation agent fixes it in the named slice. The hard
  deadline is **before that affected slice first reaches production**, and
  before its Stage 19 acceptance, whichever comes first. Demo/test delivery
  may happen earlier so the independent agent can inspect the rendered result.
- Each item retains its status, correction commit/files, visual or test
  evidence, verifier and verification date. A task marked done without verified
  evidence is not a closed finding. Changed approved prototype files repeat
  the affected Stage 6-8 controls.
- The Stage 18 agent stops production release if assigned items remain open;
  the Stage 19 independent agent checks closure for slice/final acceptance.
  Owner acceptance of cosmetic debt at Stage 7 permits this bounded deferral,
  not unresolved production release. Historical deferrals are not retroactively
  marked fixed: missing schedules or evidence must be resolved before the next
  affected release or acceptance.

### Exit criterion for Stage 7 (owner decision, 2026-08-05)

A Stage 7 pass closes the stage when it is clean, or when every finding is Low
AND cosmetic, recorded and dispositioned in a polish backlog the pass entry
names (`findings_severity_max: low`, `never_cosmetic_check: confirmed`,
`dispositioned_in: <path that exists>`). Critical, High and Medium findings
block. A pass carrying any unchecked scope (`unchecked_scopes` non-empty) must
be registered `blocked` and closes nothing: an unchecked dimension is not a
passed one.

The following can never be classified cosmetic Low: missing flow, invented
behavior, incorrect roles or security, missing required state/action/dialog,
broken navigation, unusable clipping, unapproved target-only behavior. The
`never_cosmetic_check: confirmed` field is the recorded attestation of exactly
that judgement, and a reviewer of the ledger reads it against the backlog.

Low findings do not by themselves demand another Stage 6/7 loop. The Stage 8
approved gate shares these semantics: approval closes only alongside a closing
pass registered for the same export set version.

The polish backlog is mechanically bound: the entry names
`ui-polish-backlog.md` (that exact file, canonically inside the
project, non-empty), and the file must record the pass - the pass entry's
`session_id` appears in it, marking the section holding its findings and
dispositions. What the dispositions say remains reviewer judgement; a backlog
that never mentions the pass closes nothing.

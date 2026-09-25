# Cross-Agent Orchestration Protocol

[Agent system overview](agent-system-overview.md): PM delegation to BA, UX,
Architect, Developer and QA, fresh reviewers, tools and durable handoffs.

The [portable role contract](agent-roles.md) governs all specialist assignments,
mandatory skill reading, ACK and QUESTION/BLOCKED/RESULT. PM routes questions
and maintains shared records; stage leads own their assigned outputs. Use the
same packet with any approved runtime, including owner-launched separate
sessions when automatic delegation is unavailable. No persona switch creates
an independent agent.

The stricter review protocol below governs delegated review by an external agent. It applies to
implementation-slice peer review and to the formal independent passes at
Stages 2, 7, 10, 14, 16, and 19.

The responsible specialist remains accountable for its work; PM coordinates
the handoff and required controls. Agreement between agents
is not evidence, does not replace automated checks, and never grants owner
approval.

Before Stage 16 review, the authoring agent presents the feature spec's complete
`Owner-Reviewed Implementation Assumptions` table to the owner. The owner either
approves proposals as written or corrects them; the agent records the explicit
disposition and final decision without erasing its original proposal. The
independent reviewer checks that plan and tasks introduce no hidden assumption.
An external agent must never fill, infer, or simulate the owner's disposition.

## Shared UI In Review Packets

Follow [the shared UI procedure](prototyping/ui-design-system-guide.md). Stage 7
receives screens, component previews, catalogue, tokens and the foundation
choice; compare rendered content and coverage, not only hashes. Stage 16 checks
SDD control/variant bindings and planned evidence; Stage 17 peers check actual
shared implementation and visual results. For Stage 19 Phase A supply relevant
expectations only, including token/variant contracts without earlier findings
or approval-review conclusions. Save observations before opening full records
and reconciling extraction completeness in Phase B. Report discrepancies using
the existing comparison/finding format. Never edit approved design inputs.

## Error Prevention In Review Packets

Follow [the error-prevention instruction](error-prevention.md). The author
self-checks applicable CHK items before requesting review. The independent
reviewer challenges those claims against the actual scope and proposes
confirmed generalized checks in the report; only the coordinator edits the
project checklist after validating the proposal and checking for duplicates.
At Stage 2 full-blind and Stage 19, the learned checklist, extracted rows, self-check summaries
and learning notes are withheld until Phase A observations are saved. Release
and reconcile them in Phase B. Generic process instructions remain allowed;
renaming learned findings as "instructions" does not permit early access.
A passing checklist never narrows the complete required independent scope.
On corrective returns, PM and the author follow
[Correction Scope And Handoff](reviews/README.md#correction-scope-and-handoff):
bound the correction and preserve valid unaffected work, without narrowing the
separate review packet below its stage requirements. Stage 2 full-blind requires
a fresh full blind Phase A; correction findings are released only in Phase B.
Eligible Stage 2 correction-validation instead receives prior evidence at launch
under [its own procedure](reviews/README.md#stage-2-correction-validation).
The review packet requires **Checklist Review** plus **Checklist link**,
**Checklist discrepancy** and **Required recheck** in each related finding,
following [the report format](error-prevention.md#reviewer-findings-and-correction-handoff).
This also applies to Stage 17 peer reports using a slice-specific format.
The coordinator returns exact F-NNN/B-NNN and CHK-NNN links to the original
agent, who preserves them in correction dispositions and records repeat checks.
Do not infer an unread checklist from a missing self-check record.

## Credential-Safe Evidence

This rule applies to every agent and stage, including drafts, inventories,
reports, packets, PR text, screenshots and captured tool output. Describe
authentication behavior and cite the source revision plus file/line or symbol;
do not reproduce passwords, tokens, private keys or login pairs in newly
authored records, including public factory defaults. Use role/account labels
and approved secret references for access. Mask values without hiding the
behavior, source provenance or uncertainty needed for review.

Before handing off or freezing evidence (including Phase A), its author or
reviewer checks the new material for copied credential values. PM repeats the
publication check before sending packets to another service or publishing
records. Use contextual inspection and scoped exact-value searches of permitted
material; do not print matches or put values into command arguments, committed
scan scripts, fixtures or logs. Record checked scope, outcome and limitations
in the existing work/report record, not another mandatory artifact. Common-word
matches need contextual classification; zero matches alone is not proof that
all secrets were detected. Do not broaden repository, network or blind-phase
access to investigate a match.

Keep these three cases distinct:

- **Working or potentially sensitive credentials:** prior publication does not
  make them safe. Stop the affected transmission/publication, notify the owner
  without the value and request scoped containment or remediation. Unknown
  sensitivity is not clearance. Rotation or shutdown requires authorization.
- **Documented public factory/demo data:** the owner may record a source-backed
  classification of the exact data in an existing decision/work record, only
  where the governing constitution permits it. This is not a blanket secret
  exception, proof of safe deployment or authorization to publish other values.
  Do not require proof that no installation anywhere uses a public default.
  Distinguish its public provenance from whether approved project environments
  use it; unknown environment use stays explicit. An empty environment contract
  is not evidence that no deployment exists. New records still use references.
- **Already frozen evidence:** do not silently edit snapshots, reports or their
  hashes. An explicit permitted public-data classification may retain the exact
  historical snapshot; cite the decision outside it. If sensitive data requires
  removal, block publication and ask for a bounded remediation decision. Any
  approved sanitized derivative has a new identity/hash and cannot masquerade
  as the original. Restrict originals as authorized; do not rewrite Git history
  or introduce quarantine/manifests/reconstruction tools by default. Hash
  preservation never justifies exposing an actual secret.

PM includes this generic rule in review assignments before observation begins.
Project-specific classifications, learned checks and previous incidents remain
phase-restricted; a rule link does not expose them to blind Phase A. Missing
authority to transmit source material blocks that transmission, not its safety
requirements. Confirmed repeatable omissions follow the existing
[checklist admission and deduplication rules](error-prevention.md#admission-and-generalization);
do not seed new projects with another project's CHK IDs or decisions.

## Review Modes

### Slice peer review

After a Stage 17 delivery slice passes its automated checks, PM delegates a
fresh Developer peer session to review the requirements and current
change. The reviewer is read-only and looks for defects, regressions, security
or performance risks, missing tests, and divergence from the approved SDD or
architecture.

PM returns findings to the responsible Developer, who validates them against governed requirements, source,
and tests. It records accepted and rejected findings with evidence. No more
than two challenge-and-response rounds are allowed. An unresolved material
finding blocks the slice and is escalated to the owner.

For UI-impacting slices, the reviewer must distinguish static composition from
interactive states. Source-declared hover, focus, pressed, selected, disabled,
validation and error behavior is reviewed through an activated browser state
and computed result; a static screenshot or generic `states checked` statement
is not evidence.
The reviewer also applies [`analysis/prototyping/ui-visual-parity-checklist.md`](./prototyping/ui-visual-parity-checklist.md) to
representative populated, missing, boolean, badge and long/localized values.
Exact placeholder glyphs, copy, case and punctuation are checked together with
their computed typography, color, wrapping and truncation.
For role-aware navigation, the reviewer checks the SDD destination matrix before
functional assertions: unauthorized items are absent, context-blocked authorized
items are disabled with a reason, available items are links, and direct routes
remain server-authorized. A missing or contradictory matrix is a finding.

A slice peer review is not a formal Stage 2, 7, 10, 14, 16, or 19 pass unless all
formal-pass requirements below are satisfied.

### Formal independent pass

The external reviewer owns the conclusion.

This external delegation workflow requires a separate independence record in
addition to the report. The general self-contained declaration allowed by the
[review contract](reviews/README.md) remains valid outside this workflow; it
does not waive this stricter packet requirement.

The reviewer must:

- use a fresh session with no authoring context for the reviewed artifacts;
- complete the independence declaration;
- record stable `reviewer_id`, unique `session_id`, complete
  `authored_artifacts`, and a separate durable `independence_record` that is
  not the review report itself;
- work read-only from an isolated worktree or immutable revision;
- independently enumerate and review the complete declared scope;
- return one result: `clean`, `findings`, `blocked`, or `invalid`.

The packet supplies immutable base and head revisions. The reviewer regenerates
the authoritative diff and scope from those revisions; a diff supplied by the
orchestrator is convenience context only.

The primary agent may challenge a factual finding with concrete evidence, but
the reviewer issues the final classification. The primary agent must not
rewrite `findings` or `blocked` as `clean`.

Use `invalid` when the attempt violates eligibility, isolation, revision,
scope, or result-schema rules and therefore cannot provide a substantive
review conclusion. Use `blocked` when an eligible attempt cannot complete
because a required tool, environment, permission, dependency, or scope item is
unavailable.

## Deterministic Review Packet

Before invocation, create a packet containing the items below, subject to the
mandatory phased-access boundary for Stage 2 full-blind and Stage 19. A full packet is never
permission to expose Phase B material early.

### Blind Review Packets

For Stage 2 full-blind, Phase A contains instructions, neutral scope boundaries and the
immutable legacy source only. Do not include the filled parity map,
reconnaissance, summaries, counts, prior findings or automated conclusions.
The orchestrator extracts neutral routing metadata from status without sharing
the full status record. Save the reviewer's independent inventory and its
retrievable checkpoint before releasing filled records in Phase B.

For Stage 19, Phase A contains instructions, exact deployed revision and address,
roles, declared scope and expectation-only extracts of approved behavior,
prototype and inventory (see below). It does
not contain prior delivery reports, journey results, cosmetic findings or status
conclusions. Save the reviewer's live observations before releasing those Phase B
records. Requirements are expectations, not prior reviewers' answers.

Record the access sequence. Reconcile both directions in Phase B and preserve the
first snapshot; later corrections to the reviewer's interpretation are explicit.
Premature exposure invalidates the blind pass. Other independent stages do not
gain an invented blind phase. The active-stage instructions define their inputs.

### Correction-Validation Packets

Stage 2 correction-validation has no new Phase A or delayed Phase B. Its packet
contains the exact complete full-blind baseline, checkpoint and source digests;
all intervening review/correction records; current candidate and applicable
checklist; and proposed rechecked/retained coverage. The fresh independent BA
validates that chain and actual complete diff, not just a supplied patch.
Follow [the eligibility, expansion and clean-closure rules](reviews/README.md#stage-2-correction-validation).
Missing evidence blocks; contaminated or systemic/unbounded coverage requires
another fresh full-blind session. Do not call correction-validation blind or
claim its retained checks were newly executed.

### Expectation-Only Extracts

Stage 19 Phase A uses expectation-only extracts, not unrestricted copies of the
parity workbook, target-surface inventory or approval records. The coordinating
agent includes agreed behavior, roles, channels, acceptance criteria, surface
contracts and applicable approved prototype assets. Exclude implementation
status, destination notes, previous test/journey outcomes, finding lists,
closure claims and reviewer conclusions. Stage 2 full-blind receives no behavior inventory
derived from the filled Stage 1 records, even as an extract.

For each extract, retain the source path and immutable revision/hash, selected
rows/fields or sections, exclusion rule, and the extract SHA-256 in the packet.
The routing extract follows the same provenance rule. Save the reviewer's Phase A
observations and their retrievable checkpoint before releasing the full originals
in Phase B. Then independently verify extract completeness against the declared
scope and reconcile observations with prior evidence in both directions. Omitted
requirements, unexplained filtering or premature exposure invalidate the pass;
start a fresh eligible review rather than repairing its initial observations.
Extracts are packet evidence, not additional canonical project requirements.

### Packet Contents

Include only the following material permitted in the current phase:

1. packet identifier, review mode, and expected result schema;
2. repository identifier and immutable revision or base/head revisions;
3. complete scope, explicit exclusions, and commands to enumerate both;
4. applicable constitution, methodology, parity map, architecture, SDD, tasks,
   prototype, inventory, and owner-decision references;
5. automated check commands and their latest exact results;
6. independence, isolation, and read-only constraints;
7. required runtimes, dependencies, environment assumptions, and safe
   read-only test permissions;
8. expected output location outside the reviewed worktree.

Classify packet contents before sending them to an external service, following
[credential-safe evidence](#credential-safe-evidence). Secrets, sensitive
credentials, personal data, regulated data, and repository content not
approved for that service must not leave the authorized environment. If a
complete safe packet cannot be formed, the result is `blocked`.

The reviewer starts by echoing the packet identifier, revision, scope,
exclusions, and eligibility. An eligibility or packet-identity mismatch makes
the attempt `invalid` before substantive review.

## Read-Only Execution

- Never resume an authoring session or an earlier review session.
- Disable hooks, memory, and write-capable tools where the reviewer supports
  those controls. Grant only the minimum read, search, and test capabilities.
- A pre-commit slice review may inspect the expected dirty delta. Record the
  initial `git status --short`, diff digest, and untracked-file manifest, then
  require the exact same state after review.
- A formal pass uses a committed immutable ref in a separate worktree. Record
  `git status --short` before and after; both states must be clean.
- The reviewer does not edit files, update project ledgers, commit, push, open
  pull requests, deploy, or exercise owner gates.
- Run authentication and read-tool smoke checks before a long invocation.
  Authentication, model, tool, environment, or timeout failures are
  `blocked`, never `clean`.

Any reviewer-created repository change makes the attempt `invalid`.

## Remote CI Closure

Use [the PR communication contract](migration_methodology.md#pr-descriptions-comments-and-commits)
for the shared summary, significant-event comments and recoverable commit
messages. PM reads back the actual PR before handoff, refreshing current-head
CI separately from reviewed-source evidence. A template alone is not enforcement.

Follow [Review And Correction PRs](migration_methodology.md#review-and-correction-prs):
PM publishes a completed control attempt separately from author corrections,
preserving its actual verdict and safe ownership of in-flight changes. The next
planning control waits for its candidate's owner-approved merge; Stage 17 code
peer review still happens before merge. Do not ask the owner to choose between
combining or separating these PRs on each return; the default is separation.

PM owns coordination of remote verification after every authorized push. For
ordinary governed work it creates a branch and pull request, runs the local
repository gates, and then waits for every required GitHub Actions workflow on
the exact pushed commit SHA. It records the workflow names, run URLs, commit
SHA, and final conclusions in existing PR metadata and the next mutable work or
handoff record. Never reopen an immutable delivery or review record to append
later publication facts.

The work remains incomplete while any required run is queued, in progress,
failed, cancelled, skipped unexpectedly, or absent. Local green checks do not
replace remote CI. On a non-green result, inspect the failing job, reproduce it
at the closest available platform boundary, fix the cause, push a new commit,
and wait again. Do not ask the owner to merge and do not report the task as
complete until the current SHA is green. Direct pushes to the integration
branch are reserved for an explicit owner exception and still require this
post-push wait.

## Batches and Checkpoints

Partition a large review into deterministic batches before invocation. Every
batch names exact files, rows, requirements, surfaces, or diff paths and writes
a checkpoint containing:

- packet, revision, and batch identifiers;
- completed scope and remaining scope;
- findings and unresolved questions;
- checks already run and exact results;
- context reset count and next expected batch.

Persist the canonical packet, expected repository state, each checkpoint, and
each raw response before starting another batch. After compaction, restart, or
session replacement, resend the packet and latest checkpoint. The reviewer
must acknowledge the completed and remaining scope before continuing.

A missing acknowledgement, unverifiable checkpoint, timeout, context overflow,
repository mutation, incomplete batch, or missing raw response makes the pass
`blocked`. Record the exact unchecked scope and assign it to a later eligible
fresh session. A final consolidation may be `clean` only when:

- every planned batch has an eligible response;
- unresolved blocked scope is zero;
- a fresh consolidator verifies full-scope coverage;
- the reviewed repository state remains unchanged.

## Durable Evidence

Store formal-review evidence under
`analysis/reviews/evidence/<packet-id>/`. Retain only what is needed to audit
the pass:

- canonical request and scope manifest;
- checkpoints and context-reset acknowledgements;
- raw reviewer responses;
- challenge and response rounds;
- repository-state and content digests;
- concise interaction summary.

The immutable report under [`analysis/reviews/`](./reviews) references this packet and its
digests. Disposable worktrees, caches, dependency directories, renders, and
duplicate repository copies are not durable evidence.

## Discussion and Completion

1. The reviewer returns structured findings with severity, exact evidence,
   requirement impact, and a proposed verification or correction.
2. The primary agent independently validates each finding.
3. Accepted findings are corrected and affected checks are rerun.
4. Rejected findings receive an evidence-based challenge.
5. The reviewer may respond once more; stop after two total rounds.
6. A material correction receives a fresh review.
7. The durable report records findings, dispositions, corrections, repeated
   checks, remaining blockers, and the reviewer's final result.

For a formal pass, also follow
[`reviews/README.md`](reviews/README.md), create the next immutable stage
report, update the governed review ledger, and stop at any required owner gate.

## Feature Dependency Contract

The coordinator maintains feature-dependencies.json from Stage 9/15 proposals, checks semantic duplicates and links exact independent Stage 10/16 node-scope reviews. Authors do not approve their own graph. At Stage 19, supply neutral dependency expectations in Phase A, then the complete graph and prior reviews only after observations are saved. Never use a reconstruction as approval.

See [the normative dependency procedure](feature-dependencies-guide.md).

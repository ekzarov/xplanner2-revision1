# Artifact Result Boundaries

**Reading technical statuses.** Every authoring agent explains a technical label at first meaningful use: `pending` (the named check or decision is outstanding), not a bare code without consequence. Repeated table values may share one nearby legend. Preserve machine fields, historical evidence and exact verdict lines; explain those in the next paragraph or a companion guide. [Status meanings](artifact-status-meanings.md).

**What is established, what differs or remains undecided, and what is allowed next?**

The active-stage agent uses the appropriate record family below. It does not
turn every artifact into an independent review. This contract supplements the
[methodology](migration_methodology.md), [authoring responsibilities](artifact-responsibilities.md)
and [independent comparison contract](reviews/README.md#comparison-record-contract);
it does not introduce new approval authority or change stage exit rules.

## Reading A Record

Apply the [first-screen and Contents contract](artifact-reading-contract.md).
The summary highlights the actual scoped result, remaining work and next action;
it neither replaces the detailed ledger nor supplies a new approval.

The project result starts after the collapsed reusable artifact guidance.
Within the result, the agent keeps four boundaries visible:

1. **Scope and authority:** exact sources, revision, roles and checks or decisions.
2. **Established result:** actual observations, authored coverage or explicit owner
   decisions, each with evidence appropriate to that record.
3. **Differences and remaining work:** failed checks, missing coverage, pending
   decisions, inaccessible scope and authorized deferrals, with stable IDs.
4. **Conclusion and next action:** responsible actor, return or retry condition,
   exact blocking items and required separate approval.

The agent uses links for existing files and evidence. A proposed filename, future
test or intended correction is identified as planned, not linked as if it exists.
"None" is an explicit scoped conclusion, not the default when a table is empty.
Template example rows and counts are placeholders, not completed project evidence.

## Observation And Execution Records

Bootstrap, Stage 3, Stage 18, Stage 18 and the optional Stage 19 owner walkthrough
separate expected conditions, actual outcomes, evidence and remaining checks.
Their existing outcome vocabularies remain specific to their purpose.

- Successful commands prove only their asserted properties, not all behavior.
- Live, simulated, inferred and not-run evidence are distinct. A simulation or
  an unavailable legacy baseline does not become live confirmation.
- Stage 18 compares the target to approved expectations, not blindly to legacy:
  an owner-approved behavior change is different from an unexplained mismatch.
- Stage 18 reconciles coverage instead of repeating the whole Stage 18 suite.
  Reused observations cite the exact delivery evidence and original producer/time
  after checking revision, environment, roles, data/preconditions, approved
  baseline and scope. Live discovery and investigation of uncovered behavior
  remain required. Each repeated check names its trigger; missing evidence
  remains unverified. Reuse never waives Stage 18 audits or Stage 19 acceptance.
- Scope totals reconcile to mutually exclusive outcomes. Check totals are not
  automatically counts of workbook rows, screens or findings. Reused results
  are cited separately; grouped checks need a complete linked breakdown.
- Required failed, blocked or unchecked scope prevents a clean result unless
  an exact permitted exception applies. A waiver never means the check passed.

**Illustrative only:** legacy exposes an Edit action; the approved target decision
requires it absent for a read-only role. Observing it absent in the target is a
match to the approved target, despite the legacy difference. If that role could
not log in, the check is blocked, not a match. This is not an XPlanner test result.

## Decisions And Remark Closure

Stages 4, 5, 8 and 9 separate the agent's proposal from the human owner's decision.
A filled workbook or a green audit is not approval.

- Each decision identifies its scope, owner, date and durable evidence.
- Pending questions and approved but unapplied changes remain visible.
- Deferrals name authority, residual work, responsible actor and deadline or
  re-entry condition; they are not completed corrections.
- Stage 11 records the owner's remarks and closure criteria. Stage 12 links
  each original remark to the applied fix, observed closure check and exact
  changed files. Open, failed, blocked and verified-closed remarks stay distinct.
- Verified remark closure is separate from the final owner verdict on the
  corrected document set. Earlier decisions and evidence remain discoverable.

## Authoring And Planning Records

Stage 13 records source-to-concept coverage, omissions and contradictions.
A current file hash proves identity, not independent semantic correctness.
Readiness for Stage 14 is not a Stage 14 pass.

Stage 15 records requirement-to-SDD coverage and remaining design gaps.
A planned test is not execution evidence; covered means represented in the
design, not implemented. Readiness for Stage 16 is not permission to implement.

Architecture descriptions, ADRs, OKF concepts and SDD source files keep their
domain structure: current decisions, rationale, assumptions, boundaries,
deferred scope, reopen triggers and planned verification. Review outcomes belong
in the linked control records, not duplicated into every source file.

## Exceptions And History

A waiver records what remains unverified, its exact permitted scope, human
authority and expiry or closure condition. The optional owner-walkthrough
decline records a decision not to perform that additional activity; it neither
claims observations nor replaces independent acceptance or final owner sign-off.

Historical immutable reports retain their bytes. Agents do not fabricate
missing positive checks or update an old report as if a new review occurred.
A later check produces a new record. Mutable decision records retain dated
amendments and links to previous versions. Reading guides may clarify old
evidence but cannot supply missing observations or approvals.

## Template Coverage

The [naming guide](artifact-naming.md) maps these families to their templates and
outputs; XPlanner retains its historical template filenames. The inventory below
covers all 28 governed Markdown template entries. Shared review and acceptance
templates already carry the independent comparison contract.

| Template family | Result boundary |
|---|---|
| Bootstrap gate report | Executed checks, failed attempts, pending checks and separate owner transition |
| Legacy reconnaissance | Existing source inventory, evidence type, gaps/blockers and exit checklist retained |
| Independent stage review | Expected/observed comparison, findings, blocked scope, reconciled counts and verdict |
| Stage 3 walkthrough | Live versus simulated observations, differences and unverified remainder |
| Stage 4 requirements revision | Proposed behavior, explicit decision and applied-versus-outstanding change |
| Stage 5 form/style decision | Agent options, owner selection and open mandatory choices |
| Prototype polish backlog | Existing finding IDs, deferral authority, deadlines and verified closure retained |
| Stage 8 prototype approval | Approved, remarked/rejected and unreviewed scope; correction disposition |
| NFR owner review | Workbook proposals, actual owner decisions, open lanes and dated amendments |
| Architecture overview | Existing current architecture, foundation gate and open backlog retained |
| Foundation section | Existing stable boundaries, code-start gate and reopen triggers retained |
| Architecture area section | Existing current decision, deferred detail and verification triggers retained |
| ADR | Existing proposed/accepted/superseded status, alternatives and planned verification retained |
| Architecture owner verdict and remark closure | Original owner criteria, checked corrections, open remarks and final exact-set decision |
| OKF concept | Existing draft status, source provenance and boundaries retained |
| OKF index | Navigation of concepts retained; not a review verdict |
| Stage 13 knowledge record | Produced coverage versus omissions, contradictions and pending source approval |
| Stage 15 SDD record | Authored coverage versus design gaps; plans are not executed tests |
| Stage 18 delivery | Exact-release observations, failed checks, unchecked scope and immutable reruns |
| Stage 18 live revision | Approved target expectation versus live result and unresolved reconciliation |
| Stage 19 independent acceptance | Independent comparison contract, followed by separate owner decision |
| Stage 19 owner walkthrough | Actual owner observations versus previous evidence and scope not walked |
| Stage 19 owner walkthrough decline | Existing explicit optional-activity decision retained; not acceptance |
| Owner waiver | Still-unverified items, exact exception, follow-up and expiry |
| Feature specification | Existing included/excluded scope, assumptions and open questions retained |
| Implementation plan | Existing baseline alignment, verification plan, risks and re-check retained |
| Tasks | Existing unchecked work, tests, review and delivery prerequisites retained |
| Traceability | Existing requirement mapping, coverage summary and verification retained |

Structured workbooks, JSON manifests/inventories, YAML status, Draw.io diagrams,
wireframe exports and raw test output keep their schemas. Their companion
records explain decisions and gaps. No Markdown ledger is injected into a strict
format, and a manifest hash or status flag is never a substitute for evidence.

# Portable Agent Roles And Skills

**Who does the next piece of work, which skill must they read, and how does PM receive a verifiable result?**

This is the normative role and delegation contract for new/reopened migration
work. [MIGRATION.md](../MIGRATION.md) selects permitted work; the
[methodology](migration_methodology.md) still defines its procedure and gates.
Roles do not change stage numbering, approvals or the meaning of old records.
The same English instructions are read explicitly in any approved agent runtime.

## Contents

- [Roles](#roles)
- [Stage assignments](#stage-assignments)
- [Session routing](#session-routing)
- [Assignment and acknowledgement](#assignment-and-acknowledgement)
- [Communication and results](#communication-and-results)
- [Independence and blind access](#independence-and-blind-access)
- [Runtime portability](#runtime-portability)
- [Adoption and verification](#adoption-and-verification)

## Roles

| ID | Name | Skill | Responsibility |
|---|---|---|---|
| pm | PM / Coordinator | .agents/skills/migration-pm/SKILL.md | Route authorized work, delegate to specialists, reconcile handoffs and request human decisions. |
| ba | Business Analyst | .agents/skills/migration-ba/SKILL.md | Establish source-backed behavior, requirements, scope and acceptance criteria. |
| ux | UX Designer | .agents/skills/migration-ux/SKILL.md | Design journeys, navigation, the shared UI foundation, components, states and wireframes. |
| architect | Architect | .agents/skills/migration-architect/SKILL.md | Own architecture, NFR reasoning, knowledge synthesis and the coherent SDD design package. |
| developer | Developer | .agents/skills/migration-developer/SKILL.md | Implement the approved vertical slice, tests and permitted delivery; perform code peer review in a separate session. |
| qa | QA | .agents/skills/migration-qa/SKILL.md | Verify UI and deployed behavior against governed expectations, preserving gaps and exact evidence. |

These are six specializations, not six permanent sessions or model identities.
PM is an agent, not the human product owner. The owner alone makes the decisions
reserved by the constitution. Automated gates remain tools, not team members.

## Stage Assignments

PM coordinates every row. **Lead** identifies the responsible executing role,
including the reviewer at a control stage. **Support** is available on demand
through separately bounded tasks, not mandatory parallel sessions. A stage has
one lead and one writer for each file. **Peer** is a separate fresh session.
Human subdecisions remain exactly those in the process contract and methodology.

| Stage | Lead | Mode | Support | Peer |
|---|---|---|---|---|
| stage-00 | pm | coordinate | none | none |
| stage-01 | ba | author | architect | none |
| stage-02 | ba | independent-review | none | none |
| stage-03 | ba | responsible-check | none | none |
| stage-04 | ba | author | none | none |
| stage-05 | ux | author | ba; developer | none |
| stage-06 | ux | author | ba; developer | none |
| stage-07 | qa | independent-review | none | none |
| stage-08 | ux | author | none | none |
| stage-09 | architect | author | ba; ux; developer | none |
| stage-10 | architect | independent-review | none | none |
| stage-11 | architect | author | none | none |
| stage-12 | architect | responsible-check | none | none |
| stage-13 | architect | author | none | none |
| stage-14 | architect | independent-review | none | none |
| stage-15 | architect | author | ba; ux; developer; qa | none |
| stage-16 | architect | independent-review | none | none |
| stage-17 | developer | author | ux; qa | developer |
| stage-18 | developer | responsible-check | qa | none |
| stage-19 | qa | independent-review | none | none |

For Stage 15, Architect owns the integrated spec/plan/tasks and sdd-record.
BA contributes requirements, UX contributes approved UI interpretation,
Developer contributes implementation/test feasibility, and QA contributes
verification design when needed. Contributions go to the lead for integration
or use disjoint, explicitly assigned files. These contributors cannot review
their own work in Stage 16 or reuse authoring context in independent acceptance.

At owner-facing stages the lead prepares and records the owner's actual
decision; it never makes that decision. Stage 12 is the responsible Architect's
closure check, not fresh independent architecture approval. Developer owns
Stage 18 delivery/reconciliation; QA assistance there is not Stage 19 acceptance.

**Deployment handoff at Stages 3 and 18:** PM obtains the owner's access and
operation permissions, checks their scope/validity and runs the approved
deployment tooling, or explicitly assigns a bounded operator task. This is a
permitted operational tool call, not PM taking over specialist authorship.
BA still owns Stage 3 live verification and its walkthrough; Developer still
owns Stage 18 verification/reconciliation and its delivery report. They record
PM's or the delegated operator's actual execution evidence without relabeling
its producer. Follow [the access request and deployment procedure](../config/REMOTE_SERVER.md#configure-before-remote-work).

At Stage 19, QA produces only its independent review and evidence. PM records
the owner's walkthrough or explicit decline, final sign-off and authorized status
change; QA never writes those shared decisions. At Stage 7, QA returns its report
and any proposed cosmetic record outside the reviewed tree. PM archives the
unaltered review and integrates the owner-dispositioned backlog under Stage 7/8
rules; this does not let PM change QA's verdict or approve a deferral.

## Session Routing

1. An unassigned process session takes **PM** coordination after the mandatory
   reading order. A session with a valid delegated assignment takes its assigned
   role/mode instead; it must not restart as another PM.
2. PM reads current status and existing authorization. It uses the stage table
   to name the lead and explicitly delegates specialist work. It may execute
   Bootstrap coordination, shared-record integration and permitted tool calls;
   it does not silently replace a specialist by changing its own persona.
3. PM names the exact skill path in each assignment. The receiver MUST open that
   `SKILL.md`, this contract and the assigned procedure before substantive work,
   even when the client did not automatically discover a skill. Skill discovery
   or a role label is not evidence that the instructions were read.
4. PM checks the acknowledgement before accepting work. Missing skills, unsafe
   access, unsupported delegation or unavailable required tools block that task.
   Record the missing capability and next action; do not invent a successful run.
5. Author sessions may continue a bounded correction in their own scope, or a
   replacement may resume from durable records. Every independent pass uses a
   fresh eligible session. A new display name or model choice is not independence.

Process maintenance can be coordinated and authored by PM within its explicit
maintenance scope. This is not an exception allowing PM to author specialist
migration work or independently review its own process changes.

## Assignment And Acknowledgement

Use these compact fields in the existing stage work/evidence record. A chat
message transports the assignment; preserve the same assignment and result
durably. Do not create a second requirements or status document. Formal review
packets use the existing [review evidence location](agent_orchestration.md#durable-evidence).

| Assignment field | Required content |
|---|---|
| Identity | Unique task ID, role, mode, stage, PM/session identity and return destination. |
| Objective and boundary | Exact slice/rows/files, expected outcome, exclusions and stop conditions. |
| Inputs and skills | Exact instruction and skill paths/revisions; source revision or identified working snapshot; permitted inputs and explicitly withheld material. |
| Ownership and operations | Explicit write allowlist, command/environment permissions and decision authority already granted. Reviewers are read-only; their output is outside the reviewed tree. |
| Handoff | Required existing output records, checks, result location and the next owner/reviewer dependency. |

For a corrective return, PM uses [Correction Scope And Handoff](reviews/README.md#correction-scope-and-handoff)
in this same assignment: exact triggering IDs and baseline, affected scope and
related mechanisms, retained work, checks and the separately required next
control. A new session resumes these records; it does not restart the stage.

Before work the receiver returns **ACK**: task ID, actual session identity,
role/mode, stage/scope, input revision, loaded skill paths/revisions, accepted
write boundary and any eligibility/tool limitation. PM checks these against the
assignment. No acknowledgement or mismatched scope means no accepted handoff.
Use a Git commit or content hash to identify skill instructions; do not confuse
their version with the candidate source revision.

ACK means acknowledgement: "I read the instructions and understand the task and
its boundaries." It travels from the specialist back to PM, separately from
PM's assignment. It is not a completion result, evidence of correct execution
or owner approval. RESULT is the later handoff of work and supporting evidence.

The protocol is independent of the message transport. The runtime may use its
available delegation tool, an approved CLI, or owner-launched separate sessions.
Never send credentials, unapproved repository data or learned answers in a
packet merely to make another provider usable.

**Illustrative exchange, not an approval or a project record:**

```text
ASSIGN UX-006-01 | ux / author | Stage 6 | return to PM task PM-01
Objective: wireframes for the authorized task-editing scope.
Read: migration-ux/SKILL.md (full repository path and exact digest supplied),
the Stage 6 procedure and the exact approved input revisions.
Write: only the named prototype output files; no shared status or code edits.
Stop: a missing owner decision, incompatible baseline or overlapping write.
Return: existing Stage 6 records, checks and unresolved questions.

ACK UX-006-01 | session <actual ID> | skill <path + digest> | scope accepted
QUESTION UX-006-01 | Which approved role may edit the task? <source conflict>
PM ANSWER UX-006-01 | <recorded authority and exact source, or blocked>
RESULT UX-006-01 | <snapshot> | <files> | <checks + CHK outcomes> | <gaps>
```

PM first supplies concrete values for every placeholder. The example does not
authorize Stage 6 or supply missing scope. Equivalent structured messages are
allowed; retaining the required fields and durable references is mandatory.

## Communication And Results

- Specialists send **QUESTION**, **BLOCKED**, or **RESULT** with the task ID and
  exact source references. Questions name the uncertainty, affected scope and
  decision needed; they are not permission to invent a missing requirement.
- PM routes a question to the responsible specialist or human. Direct specialist
  discussion is allowed only within the assigned scope and retained in the
  working record; it cannot alter approved inputs, delegate further tasks, expand
  write ownership or replace a human decision. No hidden shared chat is required.
- PM records the selected answer, its authority and affected tasks, then sends
  the same decision to every affected participant. Conflicting answers or
  overlapping writes pause the affected tasks until resolved. Use the existing
  governed return when a baseline must change.
- A **RESULT** names the task/session, role/mode, loaded skills, exact result
  revision or snapshot, changed/output files, executed checks and outcomes,
  applicable CHK self-check, unresolved scope and proposed next action. A result
  may be ready, blocked or need a decision; readiness never authorizes a stage.
  Reviewers additionally use the canonical clean/findings/blocked/invalid verdict.
- PM verifies output existence, input/result versions, write boundaries and
  evidence before integration. It does not rerun an entire specialist task by
  default, rewrite a review verdict or accept a chat-only completion claim.
- PM applies [Review And Correction PRs](migration_methodology.md#review-and-correction-prs):
  publish each completed control attempt separately, then assign corrections
  after owner merge. Preserve in-flight work and single-writer ownership when
  separating branches. A records PR merge is not a clean verdict; Stage 17 peer
  review remains before merge. Commit/push permission is not merge authority.
- PM owns [PR communication](migration_methodology.md#pr-descriptions-comments-and-commits):
  explicitly load the template, refresh and read back the PR summary before
  handoff, distinguish local/CI/independent results and keep comments event-based.
  Specialists provide attributable evidence; PM cannot invent their conclusions.
- PM is the single coordinating writer of migration status and shared graph/
  checklist updates. Specialists supply proposals and exact evidence. Existing
  stage permissions still decide when each shared record may change. Lead
  specialists author their stage artifacts; actual producer metadata is retained.
- Findings return to the responsible author with F/B and applicable CHK IDs.
  The author verifies and fixes affected scope; the next required fresh reviewer
  checks it. Apply the existing two-round challenge limit, not an endless debate.
  PM checks the correction diff, retained baseline and related-occurrence results
  before accepting the handoff. Scope expansion needs recorded impact evidence;
  owner authority and the next stage's full/delta review rules remain unchanged.

No specialist launches more workers by default. PM controls delegation, file
ownership and session budget. Parallel work is optional and needs disjoint writes
and satisfied dependencies; a single feature may progress entirely sequentially.

## Independence And Blind Access

An author and reviewer can use the same role skill in different sessions.
Stage 2 uses a fresh BA; 7 a fresh QA; 10/14/16 fresh Architects; 17 a fresh
Developer peer; 19 a fresh QA. Their eligibility, isolation and reports follow
[agent_orchestration.md](agent_orchestration.md), not a lighter role-specific check.
Final consolidated acceptance still requires the specified other-vendor agents.

At Stages 2 and 19, PM supplies only permitted neutral/expectation context in
Phase A. Role skills and generic instructions contain no project findings.
Their links are not a read allowlist: no full status, prior conclusions, learned
checklist, filled examples or author handoffs before saved Phase A observations.
PM releases Phase B only after the durable checkpoint; the reviewer then opens
the full records and reconciles them. Automatic memory or startup imports that
expose withheld content invalidate the blind attempt. Verify actual isolation
and permissions when launching; Markdown instructions cannot enforce a sandbox.

## Runtime Portability

`AGENTS.md` and the thin `CLAUDE.md` entry bridge both direct sessions to
`MIGRATION.md`. Other clients must explicitly receive that entry path. The role
table and the six repository-local skill files are the common source, not
vendor-specific personas or duplicated `.claude`/`.codex` role definitions.
Native skill discovery is a convenience; explicit reading and ACK are required.

On a provider/client change, PM checks that the new runtime can read the assigned
files, start an appropriately isolated session, retain task/result evidence and
run authorized tools. Do a bounded read-only acknowledgement probe first. If
automatic delegation is unavailable, prepare the same packet for the owner to
launch in a separate approved session, and wait for its result. Do not claim that
copying Markdown configures credentials, starts a service or guarantees parity
between runtime permission models.

## Adoption And Verification

Apply this contract to new/reopened work after explicit process adoption. The
initializer installs the role contract, six short skills and both entry bridges.
Existing projects receive those reusable files without retroactively assigning
role sessions to historical work, changing active stages or re-hashing approvals.
No project-specific learned lesson belongs in a generic role skill.

`audit:roles` checks the role/stage map, skill metadata and links, entry bridges
and agreement with existing independent/peer/responsible-control boundaries.
It also runs inside `audit:views`. It does not launch agents, prove that a skill
was read, validate runtime isolation or approve a task. PM verifies ACK/results;
independent reviewers examine actual evidence under the unchanged gates.

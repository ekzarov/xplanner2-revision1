# Error Prevention Across Stages

**Which checks should an agent learn from confirmed mistakes and apply before handing over its next result?**

## Contents

- [One project checklist](#one-project-checklist)
- [Admission and generalization](#admission-and-generalization)
- [Required timing and responsibilities](#required-timing-and-responsibilities)
- [Self-check and learning note](#self-check-and-learning-note)
- [Reviewer findings and correction handoff](#reviewer-findings-and-correction-handoff)
- [Maintenance and automation](#maintenance-and-automation)
- [After deployment](#after-deployment)
- [Existing projects](#existing-projects)

## One Project Checklist

The initializer creates the project checklist at the path declared in the
[empty template](error-prevention-checklist.template.md). The project keeps one
short table, not a file per stage or a second findings backlog. All listed checks
are active. Its four columns are **Check**, **When applicable**, **Basis**, and
**How to check**. Keep a stable `CHK-NNN` ID in the Check cell. Do not add risk,
evidence, status or per-run result columns. Instructions belong here, not in
long checklist rows. The owner may review and prune the table.

A finding describes a defect in one version. A correction record explains its
resolution. A prevention check generalizes the repeatable mistake without
replacing either record. Fixing a finding does not retire its prevention check.
The checklist cannot create requirements, change approvals, override an
instruction or reduce review scope. Follow [MIGRATION.md](../MIGRATION.md) first.

## Admission And Generalization

After each control pass and every confirmed self-detected error, the responsible
agent MUST evaluate all four admission conditions. No new row is required when
none qualifies:

1. **Confirmed:** source evidence and an applicable requirement, instruction or
   explicit owner decision establish the error. A disputed review claim, a new
   preference or an unapproved requirement is not a confirmed mistake.
2. **Reusable:** the same failure can recur in another revision, artifact,
   screen, integration or slice. One confirmed occurrence is enough; do not
   wait for a second serious failure. A one-off repair task is not a check.
3. **Actionable:** an agent can identify applicability, perform a concrete
   comparison or action and tell whether the expected result holds. Avoid
   "be careful", "check everything" and abstract quality advice.
4. **Distinct:** search the entire existing table for the same check meaning,
   applicability and method, not just matching words. Reuse an existing ID;
   refine that row when the same check needs wider applicability. Add a new
   ID only for a genuinely different check.

Generalize the missing check, not the individual repair. State an observable
property to verify, the governed scope where it applies and a method with an
expected result. Extend applicability only where the same omission can recur;
do not invent requirements for other artifacts or stages.

This common procedure deliberately contains no concrete learned checks.
Project examples, reviewer suggestions and filled self-check notes are learned
material, even when embedded in another document or presentation; coordinators
must withhold them from blind Phase A along with the project checklist.

The Basis cell links the exact confirmed finding or correction/owner record and
the governing rule. Keep historical observations attributable. Do not copy full
reports, stack traces or duplicate instructions into the row. A complete existing
automatic check normally needs no duplicate manual item; a failure to invoke it
is a different process error. Existing domain checklists remain authoritative
for their detailed procedures; link them rather than cloning them.

## Required Timing And Responsibilities

The following duties apply to Bootstrap and every Stage 1-19, including re-entry:

| Participant / time | Required action |
|---|---|
| Active author or responsible checking agent, before work | Read the table index and applicable rows. Select by stage AND affected concern, artifact, role and dependency; a filename filter alone is insufficient. Include relevant checks in the work. |
| Same agent, after work and before handoff | Apply the selected checks to the actual result and record the concise self-check below. Explain non-applicability; unknown applicability or unavailable checking is blocked, not passed. |
| Same agent, after corrections | Repeat affected checks and examine related occurrences and regressions. Re-evaluate applicability when scope, relevant checklist rows or checked files change. |
| Independent reviewers at 2, 7, 10, 14, 16, 19 and Stage 17 peer review | Independently inspect the full required scope and challenge self-check claims. Name missed existing CHK IDs and propose generalized new checks in the review report. Do not edit the project checklist. |
| Responsible agents at 3, 12 and 18 | Apply the same self-check and learning duties to live observations, closure verification and delivery. These are not fresh independent passes merely because a checklist was used. |
| Owner-facing work at 4, 5, 8, 9, 11 and acceptance | The preparing agent applies checks and records actual owner decisions. The owner is not required to fill the table; a changed preference is not automatically a prior error. |
| Coordinator, after each control pass or confirmed error | Validate proposed lessons and search for duplicates; add, refine, reuse or reject with a reason in the existing work/correction record. Preserve disagreements for the required review/owner decision. |

**Blind access exception:** at Stages 2 and 19 the reviewer MUST NOT read the
project checklist, extracts of its learned checks, prior self-checks or learning
notes before saving Phase A observations. Paths and the general procedure are
not the learned answers. The coordinator withholds those materials; Phase B
opens the pinned checklist, selects applicable checks and reconciles them with
the independent observations. Do not backfill Phase A. Other independent stages
do not acquire an invented blind phase. Follow the
[packet protocol](agent_orchestration.md#blind-review-packets).

## Self-Check And Learning Note

Use a short **Error prevention** section in the current working report or
correction record, not another checklist file. Record:

- **Self-check:** checked stage/scope and result version, checklist revision or
  SHA-256, applicable CHK IDs and outcomes: passed, failed, blocked, or not
  applicable with a reason. An empty table means "no learned checks yet", not
  "the stage passed". Keep ordinary stage evidence in its existing location.
- **Learning update:** added/refined CHK IDs, covered by existing IDs, or no
  qualifying new check with a brief reason. A formal reviewer proposes updates;
  the coordinator records the actual table update separately after the report.

Where the stage has no writable narrative record, put these two short summaries
in `migration_status.yaml.control.prevention_self_check`. Include stage/scope
and checked version in the text. This optional schema field is a current
handoff note, not a new approval or immutable report. On a new attempt it must
be replaced after new checking, never reused as proof for another result.
Historical notes remain in Git. New/reopened work MUST use one of these two
recording locations; an old project is not retrospectively assigned a result.

An applicable failed/blocked required check prevents a readiness claim or
forward handoff until resolved under existing stage/waiver rules. It does not
prevent saving a failed report or recording a legal return. The checklist itself
grants no waiver. Author self-check is never independent approval. New reviewer
findings remain possible even when all learned checks pass.

## Reviewer Findings And Correction Handoff

Every new independent control report and Stage 17 peer report MUST distinguish
the author's recorded self-check from the reviewer's own observations. Under
**Error Prevention**, include a **Checklist Review** table:

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| <CHK-NNN; scope and why applicable or excluded> | <claimed result and exact report/version, or not recorded> | <passed / failed / blocked / not applicable; observation and evidence> | <F-NNN or B-NNN; required correction and repeat check, or none> |

Pin the checklist revision or SHA-256 and the version used by the author if
different. A newly added check requires current re-evaluation, not a claim of
past noncompliance before that check existed. Account for all applicable checks
and exclusions considered; an empty table is explicitly "no learned checks yet",
not a passed review. This table indexes existing comparison evidence: link its
C-NNN/F-NNN/B-NNN IDs instead of counting the same obligation twice.

For every checklist-related finding, the reviewer MUST write these fields in
the finding itself, not only mention the checklist in a general conclusion:

- **Checklist link:** exact CHK IDs and the pinned checklist/row reference.
  A finding with no existing check says "none: new finding"; proposals remain
  proposals until the coordinator admits them.
- **Checklist discrepancy:** the author's recorded claim versus the observed
  problem and its evidence. Distinguish a failed result, unjustified exclusion,
  missing required self-check record, and a claimed pass lacking evidence.
- **Required recheck:** exact CHK IDs, affected scope, correction and observable
  expected result. An unclear check goes to the coordinator for clarification;
  do not invent the missing rule or declare unverified scope passed.

Missing documentation proves no recorded self-check, not that the author
"did not read the checklist". Apply new duties prospectively; old records are
not retroactively defective. Use existing finding/blocker and severity rules,
not an automatic severity or verdict solely because a CHK ID is involved.
Explain checklist-related issues briefly in the first-screen summary and
conclusion, with links to the F-NNN/B-NNN and CHK IDs; zero such issues does not
mean the rest of the review passed. Stages 2 and 19 do this only in Phase B.

On return, the original author reads these links, verifies each finding against
the governing inputs and retains both F-NNN and CHK-NNN in its disposition.
Record accepted/narrowed/rejected/blocked with evidence, the actual repeated
check and remaining scope in the correction record. A fix alone is not an
independent clean pass. The next eligible reviewer follows the linked findings
and checks, subject to the blind Phase A boundary. Never edit an issued report
to add later corrections.

## Maintenance And Automation

The coordinator owns project table updates; the owner may directly curate it.
Remove obsolete/redundant rows with a reason in the change or correction record;
do not leave status columns or archive rows inside the table. Preserve removed
IDs and past reports in Git and never reuse an ID for another meaning. Removing
a row cannot close an unresolved finding or waive its governing requirement.

If a mistake recurs, link it to the existing CHK ID and investigate whether the
row was missed, wrongly excluded, unclear or incorrectly marked passed. Refine
the check or automate it where useful; do not add a duplicate row or declare
that a checklist guarantees convergence. Reconcile concurrent table edits by
meaning and ID before handoff. A relevant change invalidates the affected
self-check, not every unrelated past stage result.

Run `npm --prefix analysis/tools run audit:prevention` after checklist edits and
with the process checks before handoff. It validates the four-column structure,
IDs, nonempty cells, local basis links and exact textual duplicates. It does NOT
judge whether an error is confirmed, discover semantic duplicates, execute row
instructions, establish applicability or prove self-check truth. Those remain
mandatory author/coordinator and independent-review duties. No new numbered
stage, hook or skill is required.

### After Deployment

In a records-only Stage 18 descendant, the coordinator may append admitted
new rows to an existing checklist, preserving all previous rows and prose.
Run the structural audit, record the basis/disposition in the delivery record,
and perform any newly applicable checks before claiming readiness.
`verify-attestation-history.js` verifies every intermediate commit: no deletion,
reordering, narrowing or rewritten check is allowed in this window.

An equivalent existing row needs no edit: cite its CHK ID in the report.
A proposal that requires refinement, merging or pruning stays explicit in that
report until the next permitted process-maintenance or reviewed candidate
revision. This exception to immediate table maintenance does not defer a required
check, suppress a finding or permit handoff with unchecked scope. Install a
missing checklist before the candidate, not inside records-only attestation.

## Existing Projects

Install the template, this instruction and audit explicitly; instantiate a
missing project checklist without replacing an existing one. Seed it only from
attributable, confirmed project findings and label the import date. Do not copy
XPlanner-specific lessons into the starter or other projects. Apply the duties
prospectively to new/reopened work, including process maintenance. Do not rewrite
completed reports, approved manifests, stage history or owner decisions.

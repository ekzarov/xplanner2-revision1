# Process Contract

**Which rules must every instruction, template, gate and process view preserve?**

English Markdown is the normative source for agents. The ratified constitution
sets authority and safeguards; MIGRATION.md routes sessions; the methodology
and domain instructions define execution. This contract owns the repeated
flow and closing-evidence facts below. JSON and JavaScript implement or present
these rules; they do not silently add or override them. A conflict blocks the
affected action until the process maintainer resolves it.

## Contents

- [Authority and maintenance](#authority-and-maintenance)
- [Document ownership](#document-ownership)
- [Public-safe bootstrap](#public-safe-bootstrap)
- [Constitution implementation map](#constitution-implementation-map)
- [Error prevention](#error-prevention)
- [Shared UI baseline](#shared-ui-baseline)
- [Feature dependencies](#feature-dependencies)
- [Stage boundaries](#stage-boundaries)
- [Stage flow](#stage-flow)
- [Closing evidence](#closing-evidence)
- [Artifact responsibilities](#artifact-responsibilities)

## Authority And Maintenance

1. Change the English MD rule first, including this contract when repeated facts change.
2. Update the affected templates and executable checks, then regenerate projections.
3. Update English HTML, Draw.io and 3D together, including overview captions.
4. Russian is presentation-only in optional 3D translations. The agent-system
   example, instructions, templates and project evidence remain English.
   Keep machine IDs and paths unchanged.
5. A changed English or Russian presentation field invalidates its translation-review
   binding. A reviewer checks actors, obligations, prohibitions, timing, owner approval
   and historical-evidence qualifications before recording the new binding.
   A matching hash proves which wording was reviewed, not that its meaning is correct.
6. Synchronize reusable guidance and templates into initialized projects explicitly.
   Preserve project-specific constraints and all immutable historical evidence,
   recorded approvals, hashes and actual migration status. Synchronization is not acceptance.
   Follow the bounded, owner-approved revision update in
   [Bootstrap Maintenance](../MIGRATION.md#bootstrap-maintenance), never reinitialization.
7. Run contract, view, translation and template checks, then independent semantic review.
   The maintainer validates every reported finding; green structural tests alone are insufficient.

Generated JSON, role tables and gate matrices must not be edited independently.
Explanatory examples may be shorter than the procedure but must preserve its limits.
The maintenance change remains incomplete while any known active instruction contradicts it.

## Public-Safe Bootstrap

The single detailed setup, evidence and remediation procedure is
[Bootstrap In Practice](../MIGRATION.md#bootstrap-in-practice). It requires actual
constitution-version equality even while unratified, immediate gate/blocker
recording before remediation approval, row-derived totals and source-only tests
matching the approved baseline. Pre-existing owner preparation documents need
exact bounded authorization for link corrections; immutable evidence is not
rewritten. Existing-project updates follow
[Bootstrap Maintenance](../MIGRATION.md#bootstrap-maintenance), preserving project
state without inferring Stage 1 approval. These pointers do not define another
Bootstrap procedure or extend the status schema.

Initialization is local preparation, not a credential approval or deployment.
The starter source remains read-only; tools and dependency caches are installed
only in the target. New projects generate an exact empty environment contract
from [`config/environments.template.yaml`](../config/environments.template.yaml), never from another project's actual
connection settings. Matching reruns preserve existing project configuration.
No credential approval or expiry is created or extended by initialization.

`audit:environment` may validate the unconfigured state before remote work is
needed. Before every remote action, including an early walkthrough, the agent
must configure owner-approved access and run `audit:environment -- --require-configured`.
The remote helper, delivery-stage readiness and completion reject unconfigured
environments. Embedded credentials in existing projects still require the
explicit unexpired exception and private-repository rule; public-safe bootstrap
does not erase historical key exposure. Detailed setup remains in
[MIGRATION.md](../MIGRATION.md#bootstrap-in-practice) and
[REMOTE_SERVER.md](../config/REMOTE_SERVER.md).

PM owns the access/authorization handoff and approved deployment tool execution
before the Stage 3 walkthrough and each Stage 18 release. BA retains Stage 3
behavior verification; Developer retains Stage 18 verification/reconciliation
and report authorship; Stage 19 remains independent. Existing grants are reused
only within their scope and validity; missing access blocks the affected action.
Use [the common deployment procedure](../config/REMOTE_SERVER.md#configure-before-remote-work)
and record actual operator evidence in the existing stage report, not a new
approval inferred from credentials.

## Document Ownership

**The constitution sets the limits; the methodology explains how to work within them.**
Constitutional principles do not depend on numbered stages, named packet phases,
artifact filenames or vendors. They are project/domain rules, not a universal
constitution for every possible project. Reference links and actual ratification
records may bind them to a specific workflow; those bindings are not principles.
Reading order is not authority order: MIGRATION.md is read first, while the
ratified constitution has the highest project authority.

| Document | Question it answers | Owns | Does not own |
|---|---|---|---|
| [Constitution](../.specify/memory/constitution.md) | Which rules must every agent and stage obey, and which decisions belong only to the owner? | Project invariants, decision authority, ratification and controlled amendments. | Stage numbers, packet phase names, reading lists, worksheet layout, command recipes or a second stage procedure. |
| [MIGRATION.md](../MIGRATION.md) | What may I do in this session, and what must I read next? | Mandatory reading order, session routing, detailed Bootstrap and maintenance procedure, restrictions and stops. | Project state or the full execution procedure for Stages 1-19. |
| [Process contract](process-contract.md) | Which roles, boundaries and closing conditions must every view preserve? | Shared stage responsibilities, artifact access, returns and minimum closing evidence. | Detailed execution, project decisions or permission to weaken the constitution. |
| [Methodology](migration_methodology.md) | How do I execute the selected stage and prove that it is complete? | Stage 1-19 procedures: inputs, actions, outputs, checks and application of shared transition rules; links to the governing Bootstrap procedure. | Selecting the current stage, duplicating Bootstrap execution or overriding owner authority. |
| [Portable role contract and skills](agent-roles.md) | Who executes the stage, which skill do they read, and how is work handed back? | Six role assignments, explicit skill loading, delegation, ACK/results and single-writer coordination. | A runtime service, independent approval by an author, or replacement stage procedures. |
| [Domain instructions and templates](../ARTIFACTS.md) | How do I prepare and check this particular artifact? | Exact file structure, workbook fields and artifact-specific operations delegated by the methodology. | Independent authority to change stage scope, approve decisions or bypass gates. |
| `migration_status.yaml` | Where are we, what is blocked and what was authorized? | Durable project state and links to actual evidence. | Instructions or approval inferred from a status label. |

A rule has one detailed governing location. Other documents may repeat a short
guard or example with a link; they MUST NOT maintain a parallel procedure or
restate a changing schema. HTML, Draw.io and 3D are explanatory projections, not
additional authority. English MD remains normative even when a view is translated.

**Example:** passing tests do not authorize a change that requires the owner's
decision. The constitution reserves that authority; the process specifies when
approval is requested, who records it and which evidence must accompany it.
Renumbering a step does not change that rule.

**When documents conflict:** stop the affected action, record both sources and
the disputed obligation, and ask the process maintainer to reconcile them.
The constitution is not waived by lower-level wording. The maintainer may correct
an editorial duplicate; changing an obligation requires the constitution's
amendment procedure and explicit owner decision. Unaffected work may continue
only within its existing authority. Ratification history and approved evidence
are not rewritten as part of synchronization.

## Constitution Implementation Map

This map belongs to the process, not to the constitutional principles. It binds
the current stage names and files to unchanged obligations. A changed workflow
updates this map and its procedures; an actual changed obligation also requires
a constitutional amendment. Moving wording here never waives required work.

| Principle | Concrete implementation in this process |
|---|---|
| I: authority before action | [MIGRATION reading order](../MIGRATION.md#mandatory-reading-order) and [Bootstrap execution](migration_methodology.md#bootstrap-execution). Stage 1 needs ratification, initial status, required installed/self-tested gates and separate owner authorization. Existing Bootstrap Decision Record fields remain compatible; ratification is not start authorization. |
| I / XII: blind independent observation | [Blind packet protocol](agent_orchestration.md#blind-review-packets) and [review procedures](reviews/README.md). Stages 2 and 19 save Phase A before Phase B. The coordinator reads full status first; neutral routing and expectation-only extracts withhold prior outcomes until then. Other agents read full status. |
| I / VI: approved design before implementation | [Stage 15](migration_methodology.md#stage-15) prepares spec.md, plan.md and tasks.md; [Stage 16](migration_methodology.md#stage-16) independently checks design and every explicit owner-reviewed assumption. Hidden/pending/blank/new assumptions block approval and implementation; pre-policy completed slices retain their historical boundary. |
| III / IV / VI: evidence, parity and traceability | [Parity-map instructions](legacy_user_flows_template_instructions.md) own the workbook format; [traceability guide](../specs/traceability-guide.md) binds rows, requirements, architecture, tasks, code, tests, deployment and acceptance. |
| V: approved experience and architecture | [Prototyping](prototyping/README.md), [Stage 9](migration_methodology.md#stage-09) and [register instructions](architecture/architecture-nfr-decision-register-instructions.md). Exact register/owner-review, architecture hub, sections, NFR manifest, ADRs and editable Draw.io remain required. Independent checking, owner approval, scoped waivers and live collaboration are unchanged. |
| V: operational foundation and correction | [Living architecture loop](migration_methodology.md#living-architecture-loop). Architecture defects return to 9, fresh control at 10, owner re-approval at 11, closure at 12, then affected knowledge/design controls. Unaffected approvals remain valid; downstream agents cannot silently edit or re-hash the baseline. |
| V: controlled knowledge before design | [Knowledge guide](knowledge/README.md). Stage 13 produces the source-linked OKF bundle with stable IDs, provenance and manifest hashes; Stage 14 independently checks it before SDD consumes it. Permitted scope exceptions retain residual risk and the next applicable independent control. |
| VIII: integration and remote verification | [Remote CI closure](../MIGRATION.md#remote-ci-closure) and configured repository workflows. Owner-only merge authority and exact-commit success for every required remote workflow remain mandatory; local tests are not a substitute. |
| X: executable engineering-quality rules | [Quality-profile procedure](migration_methodology.md#engineering-quality-profile) at Stage 9 specifies tools, strings, fixtures and commands; Stage 17 implements the approved rules without weakening them. |

## Error Prevention

[Error prevention](error-prevention.md) governs one project checklist across
Bootstrap and Stages 1-19. Generalize confirmed, repeatable mistakes into short,
actionable checks, searching for semantic duplicates before adding a row.
Keep exactly Check / When applicable / Basis / How to check; no status or
per-run evidence columns. The active agent reads applicable checks before work,
self-checks before handoff and repeats affected checks after corrections.
Every control pass evaluates lessons; no qualifying new check is a valid outcome.
Reviewers propose; the coordinator updates; the owner may curate. Stage 2/19
reviewers receive learned checks and self-check notes only in Phase B.
The shared checklist is shown in every stage's instructions, not as twenty
extra graph edges. Bootstrap creates it empty. Historical evidence, approvals
and immutable reports are preserved; self-check does not replace review.

During post-deployment records-only attestation, new confirmed checklist rows
may be appended; existing rows cannot be deleted, reordered or weakened.
Refinement/pruning proposals remain in the report until an authorized maintenance
or newly reviewed candidate revision. Applicable checks still block readiness.
See [the bounded update rule](error-prevention.md#after-deployment).

## Shared UI Baseline

[Shared UI design system](prototyping/ui-design-system-guide.md) is mandatory
for new and reopened UI prototype sets. Stage 5 chooses and pins the foundation;
Stage 6 develops representative screens and reusable variants together; Stage 7
checks consistency and coverage; Stage 8 approves the exact combined manifest.
`ui-design-system.md` and `ui-design-tokens.json` are conditional on visual scope.
They are O at Stage 5, U at Stage 6, and read-only in subsequent controls and SDD,
implementation and delivery. Stage 19 receives expectation-only extracts in Phase A
and full sources in Phase B. Existing exact historical approvals are not rehashed
or retrospectively claimed to contain a kit; follow the explicit compatibility rule.

## Feature Dependencies

[Feature dependency instructions](feature-dependencies-guide.md) govern one
`analysis/feature-dependencies.json`. Stage 9 creates bounded slices and
source-backed provider-to-consumer relations; Stage 15 refines and binds its SDD
to the relevant node digest. Separate contract prerequisites from transitive
completion obligations. Stage 10/16 independent reports record checked scope;
the coordinator binds those records, while the owner decides scope and priority.
Read the graph at Stages 10-19; Stage 19 full graph and prior conclusions are
Phase B only. Stages 11-14 and 17-19 do not silently edit dependencies.
At 10/16 only the coordinator appends exact clean review bindings to the graph
(U); the independent reviewer reads it and writes their separate immutable pass.
Unknowns, candidate relations and historical reconstruction never imply readiness.
The graph complements parity and traceability, not a second source of requirements.
The separate 3D dependency view is derived and never edited independently.
New/reopened SDD uses the graph policy; old exact approvals remain history.

## Stage Boundaries

- **Stages 11-12:** follow the [architecture review-cycle contract](architecture/review-cycles.md).
  Stage 11 writes a numbered immutable owner verdict; Stage 12 writes a separate
  numbered immutable closure report against the unchanged approved architecture.
  Status selects exact records, not the largest filename. A negative closure
  follows the classified return and is a conditional re-entry input at Stages
  9-11. Preserve item IDs and every attempt; do not refresh architecture hashes
  at Stage 12. With no remarks, record the unchanged set and zero required fixes.
- **Stage 18:** record observations in the immutable delivery report. Update workbook
  dispositions and status only from evidence. Append slice-bound delivery links only
  in the existing traceability index evidence cells, preserving requirements and prior links.
  Code/cosmetic corrections return to Stage 17; SDD/inventory design corrections to 15;
  architecture to 9; missing or changed legacy behavior to 1. Repeat affected controls
  and deploy a newly reviewed candidate. Never change expectations to fit an observation.
- **Blind review:** Stages 2 and 19 have separate Phase A and Phase B packets. Stage 2
  independently discovers immutable legacy behavior before opening filled reconnaissance,
  parity-map records or prior conclusions. Stage 19 exercises the deployed system against
  approved expectations, but withholds prior delivery results and cosmetic findings.
  Stage 19 uses expectation-only extracts: agreed behavior and contracts without
  implementation status, destination notes or prior results. The coordinator pins
  source/extract digests; Phase B verifies completeness against the originals.
  The reviewer receives neutral status routing only before Phase B.
  Save the first observations before releasing Phase B. Reconcile both directions afterwards;
  corrections to the reviewer's initial interpretation remain explicit rather than rewriting it.
- **Stage 7:** a clean pass normally closes control. The sole governed Low-cosmetic
  exception is a findings-based closing pass with no blocking or unchecked scope,
  explicit owner-approved deferral, affected screen/component/state, responsible actor,
  named implementation slice/task and deadline before affected production release or
  acceptance, whichever is earlier. It must never be relabelled clean.
- **Slice completion:** Stage 15 binds mandatory completion dependencies from the graph; Stage 16
  challenges their completeness. Delivery/acceptance checks the active slice and those
  dependencies transitively. Unrelated future slices may remain planned. Whole-system
  completion separately requires all obligations in the owner-approved final scope.

## Stage Flow

I = read; U = read and update; O = create. An artifact in both Inputs and Outputs is U. Phase B only postpones access even when the artifact is later updated. IDs identify the corresponding descriptions in the artifact catalog. Conditional inputs apply only when the stage procedure requires them. At Stage 19, Phase A uses expectation-only extracts of the map, inventory and prototype; the full originals are Phase B inputs.

| Stage | Check role | Owner decision | Inputs | Outputs | Phase B only | Returns | Gates |
|---|---|---|---|---|---|---|---|
| stage-00 | none | yes | agent-instructions; migration-entry; methodology | constitution; status; project-contract; environment-contract; bootstrap-gate-report; recon-record; parity-map; error-prevention | none | none | bootstrap-audits |
| stage-01 | none | no | status; project-contract | recon-record; parity-map; status | none | none | project-audit; workbook-audit |
| stage-02 | independent | no | status; recon-record; parity-map | stage-02-review; status | recon-record; parity-map; status | stage-01 | workbook-audit |
| stage-03 | primary | no | status; parity-map; stage-02-review | stage-03-walkthrough; owner-waiver; status | none | stage-01 | walkthrough-outcome |
| stage-04 | none | yes | status; parity-map; stage-03-walkthrough | stage-04-revision; parity-map; status | none | stage-01 | workbook-audit |
| stage-05 | none | yes | status; parity-map; stage-04-revision | prototype-decision; ui-design-system; ui-design-tokens; owner-waiver; status | none | stage-01 | stage-05-owner-gate |
| stage-06 | none | no | status; parity-map; prototype-decision; ui-design-system; ui-design-tokens | screen-normalization; wireframes; screen-manifest; owner-waiver; status; ui-design-system; ui-design-tokens | none | stage-05; stage-01 | prototype-audit |
| stage-07 | independent | no | status; parity-map; screen-normalization; wireframes; screen-manifest; ui-design-system; ui-design-tokens | stage-07-review; polish-backlog; status | none | stage-06; stage-05; stage-01 | prototype-audit |
| stage-08 | none | yes | status; stage-07-review; screen-manifest; wireframes; polish-backlog; ui-design-system; ui-design-tokens | prototype-approval; status | none | stage-06; stage-05; stage-01 | prototype-approved-audit |
| stage-09 | none | yes | status; prototype-approval; parity-map; recon-record; stage-03-walkthrough; ui-design-system; ui-design-tokens | nfr-workbook; nfr-owner-review; architecture-record; architecture-sections; architecture-drawio; adrs; nfr-manifest; owner-waiver; status; feature-dependencies | none | stage-06; stage-05; stage-01 | architecture-audit; dependency-audit |
| stage-10 | independent | no | status; nfr-workbook; nfr-owner-review; architecture-record; architecture-sections; architecture-drawio; adrs; nfr-manifest; feature-dependencies | stage-10-review; status; feature-dependencies | none | stage-09; stage-06; stage-05; stage-01 | architecture-audit; dependency-audit |
| stage-11 | none | yes | status; stage-10-review; nfr-workbook; architecture-record; architecture-drawio; adrs; nfr-manifest; feature-dependencies | architecture-verdict; status | none | stage-09; stage-06; stage-05; stage-01 | architecture-approved-audit; dependency-audit |
| stage-12 | primary | no | status; architecture-verdict; architecture-record; architecture-sections; architecture-drawio; adrs; nfr-manifest; feature-dependencies | architecture-closure; status | none | stage-09; stage-06; stage-05; stage-01 | architecture-closure-audit; dependency-audit |
| stage-13 | none | no | status; architecture-verdict; architecture-closure; architecture-record; architecture-sections; architecture-drawio; adrs; nfr-manifest; parity-map; prototype-approval; screen-manifest; stage-04-revision; ui-design-system; ui-design-tokens; feature-dependencies | knowledge-bundle; knowledge-manifest; stage-13-record; owner-waiver; status | none | stage-09; stage-06; stage-01 | knowledge-audit; dependency-audit |
| stage-14 | independent | no | status; architecture-record; architecture-sections; adrs; nfr-manifest; knowledge-bundle; knowledge-manifest; stage-13-record; ui-design-system; ui-design-tokens; feature-dependencies | stage-14-review; status | none | stage-13; stage-09; stage-06; stage-05; stage-01 | knowledge-audit; dependency-audit |
| stage-15 | none | no | status; parity-map; prototype-approval; screen-manifest; nfr-manifest; knowledge-bundle; knowledge-manifest; polish-backlog; ui-design-system; ui-design-tokens; feature-dependencies | parity-map; sdd-spec; sdd-plan; sdd-tasks; traceability; target-inventory; stage-15-record; polish-backlog; owner-waiver; status; feature-dependencies | none | stage-13; stage-09; stage-06; stage-05; stage-01 | sdd-audit; dependency-audit |
| stage-16 | independent | yes | status; sdd-spec; sdd-plan; sdd-tasks; traceability; target-inventory; stage-15-record; polish-backlog; ui-design-system; ui-design-tokens; feature-dependencies | stage-16-review; status; feature-dependencies | none | stage-15; stage-13; stage-09; stage-06; stage-05; stage-01 | sdd-audit; stage-16-owner-gate; dependency-audit |
| stage-17 | peer | yes | status; stage-16-review; sdd-spec; sdd-plan; sdd-tasks; traceability; target-inventory; polish-backlog; ui-design-system; ui-design-tokens; feature-dependencies | implementation; tests; migrations; candidate-pr; traceability; target-inventory; polish-backlog; status | none | stage-15; stage-09; stage-01 | ci-gate; target-audit; ui-parity-audit; sdd-audit; dependency-audit |
| stage-18 | primary | no | status; candidate-pr; environment-contract; target-inventory; traceability; prototype-approval; parity-map; screen-manifest; sdd-spec; polish-backlog; ui-design-system; ui-design-tokens; feature-dependencies | delivery-record; journey-evidence; parity-map; traceability; status | none | stage-17; stage-15; stage-09; stage-01 | environment-audit; delivery-audit; sdd-complete-audit; workbook-audit; target-audit; dependency-audit |
| stage-19 | independent | yes | status; delivery-record; journey-evidence; parity-map; target-inventory; prototype-approval; polish-backlog; ui-design-system; ui-design-tokens; feature-dependencies | stage-19-review; owner-walkthrough; status; owner-walkthrough-decline | delivery-record; journey-evidence; polish-backlog; status; parity-map; target-inventory; prototype-approval; ui-design-system; ui-design-tokens; feature-dependencies | stage-17; stage-15; stage-09; stage-01 | all-audits; stage-19-owner-gate; dependency-audit |

## Closing Evidence

These are minimum conditions, not automatic owner approval. Commands come from the project contract.

| Stage | Label | Checks | Requirement |
|---|---|---|---|
| stage-00 | Bootstrap | audit:status; audit:project; audit:environment; audit:methodology; audit:views; audit:responsibilities; audit:artifact-links; audit:prevention | Install tooling, run toolkit regression tests and initializer self-test. The agent fills bootstrap-gate-report.md with exact results; migration_status.yaml cites it. Owner authorization is separate. |
| stage-01 | Stage 1 | audit:project; audit:workbook | Source-derived reconnaissance and parity rows with evidence; unavailable scope stays explicit. |
| stage-02 | Stage 2 | audit:workbook | Eligible fresh reviewer; Phase A inventory saved before filled Stage 1 inputs are opened; Phase B reconciles both directions against the immutable legacy source. Clean immutable report includes snapshot/access evidence, comparisons, gaps and reconciled coverage; no blocked scope or contaminated blind pass. |
| stage-03 | Stage 3 | none | Exact walkthrough scope, live/simulated/unverified lanes and valid outcome; any fallback requires the exact permitted owner waiver. |
| stage-04 | Stage 4 | audit:workbook | Every challenged row has an explicit owner disposition in stage-04-requirements-revision.md; applied changes and pending questions are separate. |
| stage-05 | Stage 5 | none | Explicit owner choice of form, channels, style, palette and accessibility in ui-ux-decision.md, or an exact permitted waiver; proposals are not approval. Draft ui-design-system.md and ui-design-tokens.json; the owner selects the foundation and pins its canonical hash in ui-ux-decision.md. This does not approve future component variants. |
| stage-06 | Stage 6 | audit:prototype | Row normalization and complete versioned screen manifest/export set, aligned with Stage 4 decisions and the Stage 5 baseline. Develop representative screens and the shared component catalogue together, then reuse them. Pin catalogue, tokens and component previews in manifest version 4; each screen declares used ui_variants. Foundation changes return to 5. |
| stage-07 | Stage 7 | audit:prototype | Immutable independent closing review: clean, or only explicitly owner-dispositioned Low-cosmetic findings with backlog, responsible actor, linked scope/tasks and deadline. Independently compare screens with the shared catalogue, token values and previews, including required states, navigation, responsive behavior and accessibility. Record mismatches and unchecked scope; hashes alone do not prove visual consistency. |
| stage-08 | Stage 8 | audit:prototype:approved | Owner approval pins the exact exports, manifest hash and Stage 7 closing report. Unreviewed scope and remarks remain explicit. The owner reviews screens and component sheets together and approves the exact manifest-pinned catalogue, tokens and exports. Pending required variants or states block approval. |
| stage-09 | Stage 9 | audit:architecture; audit:dependencies | Ordered Legacy Discovery (code, relevant live evidence, residual client questions), synchronized questionnaire, system-diagram gate, exact NFR workbook owner review, current-slice Grade A closure, assessed team gaps, architecture/ADR/Draw.io and architecture-nfr-manifest.json pins. Authoring may remain open; the gate is required at handoff. Return changed prototype structure to Stage 6, deliberate channel/design-system baseline changes to Stage 5, and parity-map defects to Stage 1; record the exact decision and repeat Stages 7-8 before resuming architecture. Create the source-backed feature dependency graph: reserve bounded slice IDs, map parity rows, separate contract and completion prerequisites, and record unknowns. Run audit:dependencies before handoff. The coordinator owns the file; do not infer delivery order from slice numbers. |
| stage-10 | Stage 10 | audit:architecture; audit:dependencies | Eligible independent clean architecture review against the exact manifest, with comparison results, findings and unverified scope. Independently review feature-dependencies.json for missing providers, false links, direction, conditions and completion cycles. Record each checked node ID and scope digest, supporting sources, findings and unchecked scope in this pass. The coordinator records the review binding only after a clean bounded result. |
| stage-11 | Stage 11 | audit:architecture:approved; audit:dependencies | Explicit owner verdict on exact architecture hashes; runtime.target_platforms is populated. Remarks require the classified return. Approval permits Stage 12 without requiring its future report. Include the reviewed dependency constraints in the owner discussion. Priority is not permission to remove a prerequisite. Record scope/deferral decisions in the owner verdict; dependency corrections return to Stage 9. |
| stage-12 | Stage 12 | audit:architecture:closure; audit:dependencies | Separate immutable architecture-closure-NNN.md selected in status: every applicable owner/prior item has exact checks, evidence and reconciled counts; the unchanged currently approved set passes. Failure records the classified return and exact report. No edits to architecture or the Stage 11 verdict. Check that owner dependency remarks are resolved in the exact source-backed graph and architecture. Record evidence in the numbered closure report. Do not edit the graph or refresh its pins during closure; return unresolved design to Stage 9. |
| stage-13 | Stage 13 | audit:knowledge; audit:dependencies | Source-linked OKF v0.2 bundle and manifest pin the exact approved architecture. knowledge-record.md separates produced coverage, gaps and readiness for Stage 14. Read the reviewed dependency graph alongside the architecture. Preserve relevant contract/prerequisite reasoning and source links in knowledge, without copying a competing dependency list. |
| stage-14 | Stage 14 | audit:knowledge; audit:dependencies | Immutable eligible independent clean review of the exact bundle/manifest: source-to-concept comparison, omissions, contradictions and coverage totals. Check knowledge references against the reviewed graph. Omitted or distorted prerequisites are findings; the graph does not replace the approved architecture or independent knowledge review. |
| stage-15 | Stage 15 | audit:sdd; audit:knowledge; audit:workbook; audit:dependencies | Consume approved architecture-nfr-manifest.json without redefining architecture-owned decisions; trace affected NFRs into SDD, disclose owner-reviewed assumptions, impact scope and applicable cosmetic tasks. sdd-record.md records authoring readiness, not implementation permission. The entire approved manifest is read-only: requirements/tasks/tests and later execution evidence belong in specs/traceability.md and slice records. For UI work, read the pinned catalogue and tokens. Bind each Used UI Control Inventory row to its screen and stable governed variant; plan shared styles/components before consumers. Missing approved variants return to 6, foundation changes to 5. Read providers and consumers in feature-dependencies.json before designing this slice. Propose affected updates through the coordinator, reconcile its parity contract, bind the current node scope SHA-256 in spec.md, and plan agreed contracts and provider-dependent checks. Architecture changes return to Stage 9. Record remaining dependency questions in sdd-record.md. |
| stage-16 | Stage 16 | audit:sdd; audit:knowledge; audit:workbook; audit:dependencies | Applicable approved prototype/architecture gates, clean independent comparison and explicit owner decisions on assumptions and scope; required cosmetic work is mapped to tasks. The independent Stage 16 agent must read sdd-record.md and reconcile source versions, coverage and gaps against the actual SDD and approved inputs, recording findings in a separate Stage 16 pass. audit:sdd does not parse that author handoff and cannot approve it. Compare pinned prototype exports with SDD and planned visual checks, not unimplemented UI; candidate UI is checked at Stage 17 and deployed UI at Stage 18. Verify the SDD control-to-variant/token bindings and planned visual checks against the approved shared UI baseline, without claiming that unbuilt UI has been tested. Independently compare the SDD with its exact graph node digest. Verify prerequisite conditions, completion closure, exclusions and downstream impact; record node/edge IDs, digests, findings and unchecked scope in this pass. After a clean bounded review the coordinator links the report. Candidate relations or unresolved questions cannot be marked reviewed-ready. |
| stage-17 | Stage 17 | audit:sdd; audit:target; audit:ui-parity; audit:dependencies | Configured build, impact-scoped tests and visual_parity; exact approved export hash and required viewport/state/icon evidence; clean peer review and owner-approved merge revision. Only exact post-merge delivery tasks may remain; no premature live-proof claims. Implement shared token-derived styles and reusable components; verify actual computed values, icons and states. Do not invent private screen styles. Missing design returns through Stage 15 to 6 or 5, then affected review/approval. Require the selected SDD-bound dependency scope to pass audit:dependencies --require-reviewed --scope NNN-slug before implementation handoff. Implement against the agreed contracts and verify relevant consumers/providers. New dependencies return to Stage 15 or 9; do not delete an edge to unblock work. |
| stage-18 | Stage 18 | audit:environment; audit:delivery; audit:sdd:slice; audit:workbook; audit:target; audit:dependencies | Configured deploy, smoke, real deployed user_journey with raw evidence/hash-linked summary, deployed visual_parity, validated rollback and records-only history. Completion checks follow exact delivery evidence; applicable open cosmetics block production. The same delivery record must include Live Reconciliation: discovered scope, applicable reused delivery observations, additional live checks, expected/actual coverage, findings and governed record updates. Required unverified scope blocks closure; no separate live-revision record is created. Compare applicable deployed UI with the same pinned shared catalogue/tokens and screen exports. Reuse valid exact-revision evidence, but do not equate local checks with deployment verification. Read the SDD-bound graph and verify actual delivery/evidence for all transitive confirmed completion providers. audit:sdd:slice expands that scope. Contract dependencies alone do not require the entire provider implementation. Do not edit graph expectations to fit deployed behavior. |
| stage-19 | Stage 19 - slice acceptance | audit:stage19 | Exact delivered scope plus reviewed mandatory Completion dependencies, followed transitively; eligible blind independent acceptance followed by evidence reconciliation and explicit owner slice acceptance. All applicable findings must close. Unrelated slices may remain open; this does not set global complete. Phase A receives relevant shared UI expectations without prior outcomes. Phase B verifies the extract against the full pinned catalogue/tokens and reconciles actual deployed findings. |
| complete | Final completion | audit:all | Full-system Stage 19 acceptance and explicit final owner sign-off precede complete. Require 100% global progress, no open blockers/reopened slices, evidence for every completed slice, and owner walkthrough or exact decline. audit:all validates that recorded completion; it cannot authorize the transition. |

## Artifact Responsibilities

These roles do not retrospectively change actual author metadata.

| Artifact | Creator | Maintainer | Instructions |
|---|---|---|---|
| owner-waiver | The active-stage agent prepares the exception record; the authorized human grants or refuses it. | The agent preserves the decision and tracks residual obligations; only the human authority extends the exception. | The named waiver provision in MIGRATION.md and the active stage procedure. |
| owner-walkthrough-decline | PM records the human owner explicit decision to decline the optional Stage 19 walkthrough. | The owner decides; PM preserves evidence and its exact status reference. QA does not write shared decisions. | Stage 19 optional owner walkthrough and final completion decision contract. |
| agent-instructions | Starter maintainer (human or authorized agent); the initializer copies the file into a project. | The authorized process maintainer updates routing rules. | MIGRATION.md |
| migration-entry | Starter maintainer (human or authorized agent); the initializer copies the session entry point. | The process maintainer keeps routing consistent with the constitution and methodology. | MIGRATION.md |
| methodology | Starter process maintainer (human or authorized agent); the initializer supplies the project copy. | The process maintainer updates procedures and synchronizes their presentations. | MIGRATION.md |
| constitution | The Bootstrap initializer renders the template; the Bootstrap agent records the human owner ratification. | The agent records explicit owner-approved amendments; the owner decides the governing rules. | Bootstrap constitution ratification |
| status | The Bootstrap initializer creates the checkpoint from its template. | PM records durable outcomes, blockers and authorized transitions from specialist evidence; reviewers never edit shared status. | Bootstrap and Stage 1-19 status contract; analysis/agent-roles.md |
| project-contract | The Bootstrap initializer renders project identity and command slots; the Bootstrap agent fills verified project values. | The responsible project agent records explicit command/configuration changes and validates the contract. | Bootstrap project contract |
| environment-contract | The initializer generates an unconfigured contract from the public-safe template; an authorized agent records owner-approved environments before remote work. | The deployment agent or authorized operator maintains verified connection and deployment settings; initialization never renews credential approval. | Bootstrap and remote-operation environment contract |
| bootstrap-gate-report | The initializer creates a pending report; the Bootstrap agent fills it from actual audit output. | The Bootstrap agent records reruns and corrections; the human owner authorizes entry to Stage 1. | Bootstrap audit and transition procedure |
| recon-record | The initializer creates an empty record; the Stage 1 reconnaissance agent writes the findings. | The reconnaissance agent updates the inventory when discovery or an authorized return changes its scope. | Bootstrap and Stage 1 |
| parity-map | The initializer creates the workbook; the Stage 1 reconnaissance agent populates evidence-backed behavior rows. | The active-stage agent updates its owned columns; the human owner decides scope changes and deferrals. | Bootstrap and Stage 1-19 workbook instructions |
| stage-02-review | A fresh independent agent assigned to Stage 2 authors a report for the exact reviewed scope. | The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work. | Stage 2 independent control and reviewer eligibility |
| stage-03-walkthrough | The Stage 3 agent records observations from exercising the legacy application with applicable roles. | The walkthrough agent records new evidence; the owner decides any required simulation or waiver. | Stage 3 |
| stage-04-revision | The Stage 4 agent prepares findings and records explicit decisions by the human owner. | The Stage 4 agent appends corrections and decisions; the owner decides keep, change, defer or do-not-port. | Stage 4 |
| prototype-decision | The Stage 5 agent prepares options and writes the human owner choice into the decision record. | The agent records an explicit owner-approved baseline change after a return to Stage 5. | Stage 5 |
| ui-design-system | The Stage 5 agent drafts the UI foundation and records the human owner choice. | The Stage 6 prototyping agent develops used variants and extensions within that foundation; the owner approves the exact combined baseline at Stage 8. Downstream agents read it without edits. | Stages 5-9 and 13-19; analysis/prototyping/ui-design-system-guide.md. |
| ui-design-tokens | The Stage 5 agent drafts the UI foundation and records the human owner choice. | The Stage 6 prototyping agent develops used variants and extensions within that foundation; the owner approves the exact combined baseline at Stage 8. Downstream agents read it without edits. | Stages 5-9 and 13-19; analysis/prototyping/ui-design-system-guide.md. |
| screen-normalization | The Stage 6 prototyping agent classifies behavior rows and writes the normalization record. | The prototyping agent reconciles row mappings when behavior or the prototype changes. | Stage 6 |
| wireframes | The Stage 6 agent uses the selected design tool; the tool produces the exported wireframe files. | The prototyping agent corrects the design and regenerates exports under the approved form/style decision. | Stage 5 decision and Stage 6 export procedure |
| screen-manifest | The Stage 6 agent creates the manifest using the actual export files and their computed hashes. | The agent or configured export script refreshes entries and hashes with each prototype export. | Stage 6 |
| stage-07-review | A fresh independent agent assigned to Stage 7 authors a report for the exact reviewed scope. | The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work. | Stage 7 independent control and reviewer eligibility |
| polish-backlog | The Stage 7 independent reviewer records eligible residual cosmetic findings in a backlog. | The owner approves the bounded deferral; the Stage 15 agent maps scope and tasks; the Stage 17 agent records corrections and independently verified closure; the Stage 18 agent records regressions and returns them to Stage 17, which reopens the backlog in a new candidate. | Stage 7 creation and Stage 8 approval; conditional backlog input at Stages 15-19, updated at Stages 15/17; production-release and acceptance closure checks |
| prototype-approval | The Stage 8 agent records the human owner explicit verdict against the exact prototype baseline. | The agent records a new owner verdict when the reviewed baseline changes; only the owner approves it. | Stage 8 |
| nfr-workbook | The Stage 9 architecture agent instantiates the workbook and records evidence, questions and proposed NFR decisions. | The architecture agent maintains rows and traceability; the human owner supplies or approves business targets and decisions. | Stage 9 and NFR workbook instructions |
| nfr-owner-review | The Stage 9 agent writes the record of the human owner review of an exact NFR workbook version. | The agent preserves decision history and records subsequent explicit owner reviews; the owner decides approval or return. | Stage 9 NFR owner review |
| architecture-record | The Stage 9 architecture agent authors the main target architecture from governed inputs. | The architecture agent updates the affected scope on authorized returns; the owner approves decisions at Stage 11. | Stage 9, with Stage 10-12 control and approval |
| architecture-sections | The Stage 9 architecture agent writes a focused chapter when a concern needs its own detail. | The architecture agent keeps affected chapters aligned with the main record, ADRs and reviewed source set. | Stage 9, with Stage 10-12 control and approval |
| architecture-drawio | The Stage 9 architecture agent creates the editable diagram using Draw.io-compatible tooling. | The architecture agent updates affected pages; the human owner reviews the represented decisions. | Stage 9 diagram and text synchronization |
| adrs | The Stage 9 architecture agent writes one ADR for each consequential decision. | The architecture agent records supersession and preserves history; the owner approves the decision through architecture review. | Stage 9 decision recording and Stage 11 approval |
| nfr-manifest | The Stage 9 architecture agent generates the manifest from NFR traceability and exact architecture files. | The architecture agent refreshes hashes only during governed architecture changes and reapproval; the Stage 15/17 agents maintain NFR-to-SDD/test links in downstream traceability without changing this manifest. | Stage 9 manifest contract and Stage 15 traceability |
| stage-10-review | A fresh independent agent assigned to Stage 10 authors a report for the exact reviewed scope. | The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work. | Stage 10 independent control and reviewer eligibility |
| architecture-verdict | The Stage 11 agent records the explicit human owner decision against the exact reviewed architecture. | Completed decisions are immutable; each new owner review creates a new numbered record and preserves earlier finding IDs. | Stage 11 and architecture/review-cycles.md |
| architecture-closure | The responsible Stage 12 agent authors the actual closure check, including failed or blocked attempts. | Completed checks are immutable; each attempt creates a new numbered report. Return-stage agents read the exact negative report and record dispositions. | Stage 12 and architecture/review-cycles.md |
| knowledge-bundle | The Stage 13 synthesis agent writes linked OKF concepts and their navigation indexes from the governed sources. | The synthesis agent updates affected concepts and provenance after source changes or Stage 14 findings. | Stage 13 and OKF template contract |
| knowledge-manifest | The Stage 13 agent runs hash generation and records the exact source and concept set in the manifest. | The synthesis agent regenerates the manifest after a source or concept changes; prior exact-set review then needs renewal. | Stage 13 provenance and Stage 14 exact-set review |
| stage-13-record | The Stage 13 synthesis agent writes the execution and coverage record from the actual work and audit results. | The same responsible agent records corrections and limitations until that synthesis is handed to independent control. | Stage 13 |
| stage-14-review | A fresh independent agent assigned to Stage 14 authors a report for the exact reviewed scope. | The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work. | Stage 14 independent control and reviewer eligibility |
| sdd-spec | The Stage 15 design agent authors the feature specification from parity, prototype, architecture and verified knowledge. | The design agent revises requirements after findings; the human owner decides disclosed assumptions and scope at Stage 16. | Stage 15 and Stage 16 owner assumption review |
| sdd-plan | The Stage 15 design agent writes the implementation plan from the feature specification and approved architecture. | The design agent updates the plan after review or an authorized source change. | Stage 15 |
| sdd-tasks | The Stage 15 design agent decomposes the specification and plan into ordered implementation tasks. | The Stage 17 implementation agent records execution and evidence; design changes return to the responsible design stage. | Stage 15 task generation and Stage 17 execution |
| traceability | The Stage 15 design agent creates links from behavior and approved sources to specifications and tests. | Agents in design, implementation and acceptance maintain their evidence links without changing source decisions implicitly. | Stage 15-19 traceability contract |
| target-inventory | The Stage 15 agent creates the initial target surface inventory for the declared SDD scope. | Stage 17 updates implementation and test links before candidate review. Stage 18 compares live routes, roles, APIs and jobs against this read-only inventory; corrections return to Stage 15/17 and require a new candidate. | Stage 15 creates; Stage 17 updates; Stages 18-19 verify without changing the deployed candidate |
| stage-15-record | The Stage 15 design agent records the produced SDD package, assumptions, scope and self-checks. | The design agent records corrections before independent Stage 16 control. | Stage 15 |
| stage-16-review | A fresh independent agent assigned to Stage 16 authors a report for the exact reviewed scope. | The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work. | Stage 16 independent control and reviewer eligibility |
| implementation | The Stage 17 implementation agent writes the source code from the controlled SDD tasks. | The implementation agent fixes reviewed defects; the human owner authorizes merging the reviewed candidate. | Stage 17 |
| tests | The implementation agent writes tests and measurement definitions; configured runners generate execution results. | The responsible agent maintains test coverage and reruns the tools; reviewers examine the exact results. | Stage 17 and downstream verification |
| migrations | The Stage 17 agent uses the configured migration tool to generate a migration and reviews the resulting code. | The implementation agent prepares a new reviewed correction; the deployment agent or authorized operator runs approved migrations. | Stage 17 data change and Stage 18 operator execution |
| candidate-pr | The Stage 17 agent creates the pull request and pins the reviewed candidate revision. | The agent responds to findings; the human owner approves and merges the exact candidate. | Stage 17 candidate and owner merge contract |
| delivery-record | The Stage 18 deployment agent records the exact release and evidence emitted by the deployment and verification tools. | Each deployment gets a separate immutable record; a correction is new evidence, not an invented successful rerun. | Stage 18 |
| journey-evidence | The browser journey runner emits raw evidence; the Stage 18 agent writes its summary and pins the raw result hash. | The agent performs another journey for changed delivery; previous exact-revision evidence remains history. | Stage 18 deployed user journey |
| stage-19-review | A fresh independent agent assigned to Stage 19 authors a report for the exact reviewed scope. | The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work. | Stage 19 independent control and reviewer eligibility |
| owner-walkthrough | PM writes observations and the explicit decision from the human owner hands-on walkthrough at Stage 19. | The owner performs or declines the walkthrough; PM records the exact outcome or a separate explicit decline. QA supplies independent evidence, not owner decisions. | Stage 19 optional owner walkthrough |
| error-prevention | The initializer creates an empty checklist; the coordinator records confirmed generalized checks. | The coordinator merges duplicates and maintains the table; the owner may prune obsolete checks. Reviewers propose without editing it. | Bootstrap and Stages 1-19; analysis/error-prevention.md; learned checks are Phase B only at Stages 2 and 19. |
| feature-dependencies | The Stage 9 agent proposes source-backed bounded slices; the coordinator creates the graph. | The coordinator records Stage 9/15 changes and exact independent review bindings. Reviewers challenge scope; the human owner decides priorities and scope changes. | Stages 9-19; analysis/feature-dependencies-guide.md. Stage 19 full graph is Phase B only. |

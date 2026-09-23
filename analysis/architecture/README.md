# Architecture Record

For applicable UI, consume the exact shared catalogue/tokens via the approved
prototype manifest and [UI procedure](../prototyping/ui-design-system-guide.md).
Stage 9 verifies component-library/platform compatibility. Architecture does
not redefine visual tokens: a necessary foundation change returns to Stage 5,
or a within-foundation variant/screen change to 6, then affected 7-8 controls.

## Architecture Filenames

Use the `architecture-` prefix for architecture-owned records with otherwise
ambiguous names. This does not turn architecture approval into product or
release acceptance.

| Current filename | Purpose | Former filename |
|---|---|---|
| `stage-11/architecture-owner-verdict-NNN.md` | Immutable human owner decision at Stage 11 | Legacy fixed verdicts remain historical only |
| `stage-12/architecture-closure-NNN.md` | Separate immutable responsible-agent check at Stage 12 | No combined mutable verdict for new cycles |
| `architecture-nfr-owner-review.md` | Stage 9 owner review of the exact NFR workbook | `nfr-owner-review.md` |
| `architecture-nfr-decision-register.xlsx` | Architecture discovery, NFRs and technology decisions | `nfr-decision-register.xlsx` |
| `architecture-nfr-manifest.json` | Exact architecture document set and hashes | `nfr-manifest.json` |
| `architecture-decision-backlog.md` | Project-specific deferred architecture decisions, when used | `decision-backlog.md` |
| `architecture-file-recovery-protocol.md` | Project-specific recovery architecture contract, when used | `file-recovery-protocol.md` |

Templates and architecture-specific instruction filenames use the same prefix.
Keep `architecture.md`, `architecture.drawio`, `sections/` and `adr/`:
their existing names and directory paths already identify the architecture.
Keep the numbered review-report naming shared by all independent control stages.

### Existing Approved Evidence

A rename is not a new review, approval or transition. For an existing project,
copy each present record to the new name without changing its bytes, decisions,
dates or hashes; retain its old path only as frozen historical evidence. Never
fabricate a missing verdict from a narrower Foundation acceptance record.
New or reopened records use the canonical filenames and the matching templates.

Do not rewrite an approved architecture or knowledge manifest just to rename
its source paths. Audits recognize only the six exact historical names above,
resolve them to the canonical files and verify the originally recorded hashes.
Changed, missing or unsafe canonical files still fail; the old copy is not a
fallback. Old and new names cannot count as two different pinned sources.
New manifests use canonical paths. Genuine content changes still follow the
Stage 9-12 approval cycle and any affected knowledge review; never silently
refresh hashes or erase earlier findings.

**Reading technical statuses.** `proposed` (an agent proposal), `accepted` in an ADR (the decision was adopted), and `owner-approved` (the exact scope/version was approved) are different from implementation or release acceptance. `approved-for-delivery` in the historical XPlanner NFR review covers only its two named foundation slices, not full Stage 9 closure. [Status meanings](../artifact-status-meanings.md).

New records follow [artifact result boundaries](../artifact-result-boundaries.md):
established results, open differences or decisions, unverified scope and next
action stay distinct. The record family determines what counts as evidence;
planned work, owner approval and independent verification are not interchangeable.

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>feature-dependencies.json</summary>

**What must be agreed or delivered before this slice, and what depends on it?**

One source-backed graph of bounded delivery slices, linked to parity rows and SDD. Arrows point from provider to consumer. Contract links constrain design; completion links expand delivery scope. It records conditions, evidence and unknowns, not a second requirements list or editable completion status.

- **Created by:** The Stage 9 agent proposes source-backed bounded slices; the coordinator creates the graph.
- **Maintained / decided by:** The coordinator records Stage 9/15 changes and exact independent review bindings. Reviewers challenge scope; the human owner decides priorities and scope changes.
- **Instructions:** Stages 9-19; analysis/feature-dependencies-guide.md. Stage 19 full graph is Phase B only.

**When used:** Created at Stage 9 and refined at Stage 15; independently checked at Stages 10/16. Stages 11-14 and 17-19 read it. Stage 19 full graph is Phase B only. SDD binds its node digest; completion follows confirmed completion edges transitively.

**Example:** Illustrative: an effort report needs an agreed time-entry read contract for design, then working time-entry delivery for completion. These are distinct links. Missing review or candidate links do not mean ready.

</details>
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
<details>
<summary>architecture-nfr-owner-review.md</summary>

**Did the owner review and approve, defer or return this exact workbook version?**

The durable receipt for the owner's walkthrough of one exact NFR workbook version. It turns only the reviewed workbook hash into decisions that architecture may rely on. Any later Excel edit creates a new hash and makes this review stale, so changed rows remain proposals until the owner walks them again. The project keeps one current review file: dated Owner amendment entries provide readable change history, while Git preserves every prior version. After reapproval, update the workbook hash and verdict, then repin architecture-nfr-manifest.json without erasing earlier decisions. **Proposal, decision and remaining work:** Agent proposal or previous value; Explicit human decision tied to exact scope/version and evidence; Applied changes versus open questions and unapplied decisions; Authorized deferrals with responsible actor and deadline; Dated amendments retain prior decisions. A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

- **Created by:** The Stage 9 agent writes the record of the human owner review of an exact NFR workbook version.
- **Maintained / decided by:** The agent preserves decision history and records subsequent explicit owner reviews; the owner decides approval or return.
- **Instructions:** Stage 9 NFR owner review

**When used:** After the Stage 9 walkthrough, the architecture agent records the owner's explicit decisions in this review and refreshes it after every material workbook change. Agents and audits use it to distinguish content merely present in Excel from content confirmed by the owner; a hash mismatch blocks downstream reliance.

**Example:** The owner approves local login plus SSO readiness. A later security discussion changes the SSO row, so the new Excel hash fails the audit until a dated Owner amendment records the owner's decision, updates the review hash and verdict, and repins architecture-nfr-manifest.json. Git retains the previous reviewed snapshot.

</details>
<details>
<summary>architecture.md</summary>

**What does the target system look like as a whole right now?**

The main normative description of the target architecture and its navigation hub. It summarizes system boundaries, components, data and integration direction, deployment shape and important constraints, while linking to detailed sections and ADRs.

- **Created by:** The Stage 9 architecture agent authors the main target architecture from governed inputs.
- **Maintained / decided by:** The architecture agent updates the affected scope on authorized returns; the owner approves decisions at Stage 11.
- **Instructions:** Stage 9, with Stage 10-12 control and approval

**When used:** Written at Stage 9 as the main target-system record and navigation point. SDD authors use it after owner approval to constrain implementation.

**Example:** The record explains the modular monolith boundary and links readers to identity, data and deployment chapters plus their ADRs.

</details>
<details>
<summary>architecture/sections/*.md</summary>

**How does a specific part of the architecture work in detail?**

Focused chapters that explain individual architecture concerns in enough detail to design and build against them. Typical sections cover identity, data, integrations, operations, deployment and UI, and stay synchronized with the main architecture record.

- **Created by:** The Stage 9 architecture agent writes a focused chapter when a concern needs its own detail.
- **Maintained / decided by:** The architecture agent keeps affected chapters aligned with the main record, ADRs and reviewed source set.
- **Instructions:** Stage 9, with Stage 10-12 control and approval

**When used:** Created when a concern needs more detail than architecture.md can carry. Each chapter stays linked to the applicable NFRs and decisions.

**Example:** The identity chapter describes session boundaries, CSRF protection and the external SSO integration point used by later specifications.

</details>
<details>
<summary>architecture.drawio</summary>



The editable system diagram used to review the target architecture visually. It presents boundaries, components, dependencies, data movement and deployment context, while the Markdown records remain the normative source of detail.

- **Created by:** The Stage 9 architecture agent creates the editable diagram using Draw.io-compatible tooling.
- **Maintained / decided by:** The architecture agent updates affected pages; the human owner reviews the represented decisions.
- **Instructions:** Stage 9 diagram and text synchronization

**When used:** Used during Stage 9 collaboration and the Stage 11 owner walkthrough to inspect boundaries, dependencies and deployment visually.

**Example:** The architecture agent traces a browser request through the web application, database and integration adapter, then presents that boundary to the owner for a decision.

</details>
<details>
<summary>architecture/adr/NNN-*.md</summary>

**Why was this decision made, which alternatives were rejected, and what follows from it?**

A separate Architecture Decision Record for each consequential choice. It preserves the problem context, selected option, rejected alternatives, trade-offs and affected NFRs so future changes do not have to rediscover why the decision was made.

- **Created by:** The Stage 9 architecture agent writes one ADR for each consequential decision.
- **Maintained / decided by:** The architecture agent records supersession and preserves history; the owner approves the decision through architecture review.
- **Instructions:** Stage 9 decision recording and Stage 11 approval

**When used:** At Stage 9, the architecture agent writes a new ADR whenever a consequential choice has alternatives or lasting trade-offs; the owner confirms the decision. Plans cite the applicable accepted ADRs.

**Example:** ADR-001 records why the team chose a modular monolith, which alternatives were rejected and which NFRs the choice satisfies.

</details>
<details>
<summary>architecture-nfr-manifest.json</summary>



The machine-checkable index of the approved architecture set. It links each NFR to its requirement or ADR and pins the exact workbook, records and diagram by SHA-256 so unnoticed document drift fails the audit.

- **Created by:** The Stage 9 architecture agent generates the manifest from NFR traceability and exact architecture files.
- **Maintained / decided by:** The architecture agent refreshes hashes only during governed architecture changes and reapproval; the Stage 15/17 agents maintain NFR-to-SDD/test links in downstream traceability without changing this manifest.
- **Instructions:** Stage 9 manifest contract and Stage 15 traceability

**When used:** The architecture agent creates it at Stage 9; changes require governed architecture review and approval. Stages 15-17 consume it read-only, recording NFR-to-SDD/test links and executed evidence in specs/traceability.md and slice records.

**Example:** The availability NFR points to its architecture section and ADR; Stage 15 links the implementing requirement and planned test in specs/traceability.md, leaving the approved manifest unchanged.

</details>
<details>
<summary>stage-10-pass-NNN.md</summary>



An immutable independent verdict on the architecture package. It challenges NFR coverage, evidence, system boundaries, contracts and decision reasoning, and verifies that all reviewed files and hashes describe the same version. **What the review records:** Exact scope and authoritative expected result; Actual observation and evidence for each check; Matched / mismatch / not-checked / not-applicable; Linked findings, blocked scope and reconciled totals; Verdict and next action; prior results are not newly verified. Required unchecked scope prevents a clean pass. Stage 2 and Stage 19 preserve their blind first pass; reconciliation follows it.

- **Created by:** A fresh independent agent assigned to Stage 10 authors a report for the exact reviewed scope.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the author of the reviewed work cannot approve their own work.
- **Instructions:** Stage 10 independent control and reviewer eligibility

**When used:** At Stage 10, a fresh independent agent acting as the architecture reviewer writes it after challenging the exact Stage 9 package. An architecture defect returns to Stage 9, a UI-structure defect to Stage 6, a deliberate channel or design-system change to Stage 5, and a parity-map defect to Stage 1.

**Example:** The reviewer detects an integration with no timeout or failure policy and returns that concern to Stage 9.

</details>
<details>
<summary>architecture-owner-verdict-NNN.md</summary>

**What did the owner decide, and which exact architecture and items does that decision cover?**

The recorded human decision on an exact architecture set, with scope, evidence, predecessors and stable items for closure. It is produced at 11 and read at 12 and 13; closure is a separate report. **Proposal, decision and remaining work:** Agent proposal or previous value; Explicit human decision tied to exact scope/version and evidence; Applied changes versus open questions and unapplied decisions; Authorized deferrals with responsible actor and deadline; Dated amendments retain prior decisions. A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

- **Created by:** The Stage 11 agent records the explicit human owner decision against the exact reviewed architecture.
- **Maintained / decided by:** Completed decisions are immutable; each new owner review creates a new numbered record and preserves earlier finding IDs.
- **Instructions:** Stage 11 and architecture/review-cycles.md

**When used:** Stage 11 records the human decision in a new numbered immutable file. Stage 12 reads the exact record selected in status. Re-entry requires the previous negative closure and correction evidence; the owner decides again.

**Example:** The owner approves the corrected Foundation set; its verdict retains the earlier engineering-quality item ID and links the fresh Stage 10 report.

</details>
<details>
<summary>architecture-closure-NNN.md</summary>

**Which remarks are demonstrably closed, what remains unverified, and where must work return?**

A separate immutable result of Stage 12: criteria versus observed evidence, unchanged-set check, reconciled item counts and classified return. It never changes the human verdict or approved architecture. Stage 13 reads it with the owner verdict. **How each owner remark is closed:** Original remark ID and observable closure criterion; Applied fix and exact changed files; Actual closure check and evidence; Verified-closed / owner-dispositioned / open / failed / blocked with reconciled totals; Unintended changes checked; final owner verdict pins the corrected set. Every attempt creates a separate immutable closure report. It verifies the selected owner verdict without changing it. A failed report accompanies the return and is read on re-entry at Stages 9-11.

- **Created by:** The responsible Stage 12 agent authors the actual closure check, including failed or blocked attempts.
- **Maintained / decided by:** Completed checks are immutable; each attempt creates a new numbered report. Return-stage agents read the exact negative report and record dispositions.
- **Instructions:** Stage 12 and architecture/review-cycles.md

**When used:** The responsible Stage 12 agent creates a numbered report for every attempt. The closure gate checks current bindings, item coverage, counts and passed result. A negative report follows the classified return; Stages 9-11 read it before the next owner decision.

**Example:** A required retry policy is still absent: mark the item failed, cite the exact section, return to 9, then repeat fresh 10, owner review 11 and closure 12. The next report keeps the same item ID.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

The Architecture phase produces an owner-reviewed, versioned architecture
baseline before delivery specification and implementation begin.

The governing stage sequence is defined by
[`../migration_methodology.md`](../migration_methodology.md), especially
Stages 9-12. This file defines the required shape and presentation quality of
their output.

## Required Record

The project architecture directory will contain:

| Artifact | Purpose |
|---|---|
| `architecture-nfr-decision-register.xlsx` | Human-reviewed workbook containing legacy architecture discovery, the linked residual `Client Questionnaire`, the `System Diagram Gate`, integration contracts, graded target drivers, architecture areas, first dependent slices and recheck points, current team capabilities, delivery gaps, the selected technology stack, and an `Overview` navigator |
| `architecture-nfr-owner-review.md` | Single current Stage 9 owner-walkthrough verdict pinned to the exact decision-register hash; changed Excel rows stay proposals until a dated amendment records reapproval, while Git preserves prior versions |
| `architecture.md` | Main architecture ADR and navigation source: high-level system design, Foundation baseline, code-start gate, decomposition, risks, and roadmap |
| `sections/NN-<area>.md` | One evolving architecture concern linked from the main ADR; Foundation is `sections/00-foundation.md` |
| `architecture-nfr-manifest.json` | Machine-readable non-functional requirements, measurable acceptance criteria, traceability, document versions, and hashes |
| `adr/NNN-<slug>.md` | One architecture decision record per material decision |
| `architecture.drawio` | Editable, multi-page collaborative architecture source used by the owner and agents |
| `exports/` | Optional SVG/PNG/PDF snapshots for convenient viewing or management presentations |
| `stage-11/architecture-owner-verdict-NNN.md` and `stage-12/architecture-closure-NNN.md` | Separate owner decision and closure check |

Reusable templates live in [`templates/`](templates/). From the repository
root, deterministic validation is provided by
`npm --prefix analysis/tools run audit:architecture` and
`npm --prefix analysis/tools run audit:architecture:approved`.
For the deliberately limited code-start checkpoint, use
`npm --prefix analysis/tools run audit:architecture:foundation`. It requires
an exact `approved-for-delivery` Foundation verdict but does not pretend that team
capability or the complete Stage 10/11 architecture gate is closed.

## Plain-Language Workflow

1. **Stage 9 decides the architecture basis.** The agent records legacy facts,
   turns only the remaining production or business unknowns into narrow client
   questions, and walks the resulting Grade A, capability and technology
   decisions with the owner in the workbook.
2. **Stage 9 turns the governed decisions into one synchronized architecture
   set.** The
   workbook says what must be true and who decided it; `architecture.md`, its
   sections and ADRs say how and why; `architecture.drawio` shows the same set
   visually; Stage 9 creates `architecture-nfr-manifest.json` to record the machine-readable
   NFR criteria and NFR-to-ADR links and pin the set by version and hash.
3. **Stage 10 independently controls that set.** A fresh agent compares it with
   the requirements and inspects every Draw.io page semantically and visually.
4. **Stages 11-12 obtain and close the owner's verdict.** The owner reviews the
   understandable diagram with the normative record available for detail; every
   remark is corrected, traced and rechecked.
5. **Stages 13-14 publish verified project knowledge.** The approved set is
   translated into source-linked OKF concepts under `analysis/knowledge/bundle/`
   and independently checked before an SDD may consume it.

These are not five competing descriptions of the system. They are successive
views of the same governed decisions, each optimized for a different job.

Create and close the decision register before treating the architecture record
as ready for independent Stage 10 control. Begin with the `Legacy Discovery`
worksheet and follow
[`architecture-legacy-discovery-instructions.md`](architecture-legacy-discovery-instructions.md); target
NFR decisions do not begin until its mandatory evidence lanes are complete or
explicitly dispositioned by the owner. The remaining construction rules and the
mandatory human walkthrough are defined in
[`architecture-nfr-decision-register-instructions.md`](architecture-nfr-decision-register-instructions.md).
Client-dependent residuals are answered in the same workbook's `Client
Questionnaire`; answers are keyed by discovery ID and must be synchronized through
the legacy-to-target impact pass before they can affect architecture.
The workbook's `Team Capability` worksheet appears immediately before
`Technology Stack`; it records the factual company inventory before technology
selection and the resulting gap plan afterward.
The `Technology Stack` worksheet is the only Stage 9 source for technology
selection; do not maintain a parallel `owner-inputs.md`.

The `System Diagram Gate` separates decisions that shape the system from details
that belong to feature design. The high-level diagram may be drafted when every
gate row is ready and no Grade A system-shaping question remains open. Detailed
endpoint contracts, field validation, role-action matrices, exact schedules,
file size/type/malware/retention rules, and runbooks remain named delivery backlog
items unless they change a system boundary, trust boundary, storage class,
integration, worker, deployment topology, or scaling model.

Grade expresses decision criticality. Architecture area and first dependent
slice decompose and route the decision without becoming another approval gate.
The first checkpoint closes Foundation only: application shape, primary
persistence, transaction ownership, packaging/deployment, channel boundary and
executable engineering gates. Other areas close before their first dependent
slice. The `Overview` worksheet lists every workbook sheet and its purpose so a
fresh agent can navigate without chat history.

Stages 9-12 establish the smallest architecture baseline needed for the next
slice. After each implemented slice, code, tests and the running system are
checked against the architecture. Changed evidence reopens the affected Grade
rows and refreshes the corresponding ADRs, Draw.io pages and hashes before the
owner selects the next slice.

`Integration Contracts` is the governed inventory of architecture-significant
inbound and outbound contracts. Code/live evidence proves existence, while an
authoritative client answer proves production consumers and compatibility. Any
unknown consumer is linked to `Client Questionnaire`; it is not silently treated
as unused.

The **Living Architecture Loop** remains active throughout specification and delivery.
Implementation-only findings stay in Build, specification findings return to their design gate,
architecture findings reopen the affected Grade decisions at Stage 9 and repeat
Stages 10-14, and parity-map findings return to Stage 1. An architecture return
then requires the affected downstream delivery record to consume the refreshed
architecture hashes before implementation resumes. Approved
unaffected decisions remain valid. Artifact hashes pin the new synchronized
version; they do not replace these review and owner gates.

The workbook answers **what must be true and who approved it**. `architecture.md`
and ADRs answer **how the target satisfies it and why that mechanism was chosen**.
Draw.io is the editable visual projection of that governed set. Moving or adding a
Draw.io block does not create a decision until the workbook and textual record are
synchronized.

## Architecture Document Shape

`architecture.md` is intentionally compact enough to review. It contains the
Living Architecture Contract, Foundation baseline, code-start gate, high-level
system design, decomposition table, first implementable slices, open backlog,
ADR index, and traceability rule. Detailed concern text belongs under
`sections/`; feature mechanics belong in downstream delivery specifications. Do not rebuild one comprehensive
document that mixes every concern back together.

`architecture.md` must cover at least:

1. Executive summary and scope.
2. Business and technical context.
3. Evidence sources, assumptions, and constraints.
4. Current-state architecture.
5. Target-state architecture.
6. Components, boundaries, and responsibilities.
7. Integrations and data flows.
8. Data ownership, storage, migration, and retention.
9. Security, identities, roles, and trust boundaries.
10. Deployment topology and environments.
11. Observability, operations, recovery, and support.
12. Measurable non-functional requirements.
13. Risks, trade-offs, and unresolved questions.
14. Delivery sequence and migration roadmap.
15. ADR index and the traceability chain from NFR to acceptance evidence.

When applicable, the record also includes an evidence-backed role/permission matrix,
a job/worker inventory with one target mechanism per legacy behavior, the explicit
session-state and horizontal-scale contract, and the selected client-distribution /
customization model.

The required traceability chain is:

```text
NFR -> ADR -> measurable architecture acceptance criterion
```

Downstream delivery traceability is owned outside the architecture set:

```text
delivery specification -> architecture section / ADR / NFR -> test -> acceptance evidence
```

At Stage 15, the design agent consumes the entire approved manifest read-only.
NFR-to-SDD requirements, tasks and planned tests belong in downstream
[specs/traceability.md](../../specs/traceability.template.md) and slice plans; Stage 17
adds executed test evidence there. No `sdd` property or downstream evidence is
added to the manifest. Any architecture-owned change requires reopening
Stage 9 and repeating Stages 10-12 approval for the affected set.

## Draw.io Collaboration Contract

`architecture.drawio` is the required human-facing architecture source. Its
first system view stays deliberately high level: applications, containers,
data stores, external systems, trust boundaries, important background workers,
deployment nodes, and material technology choices. Feature mechanics stay in
downstream delivery specifications instead of being expanded into the system view. During
collaboration it may live as one shared file in Google Drive and be edited in
the browser by the owner and agents. The approved checkpoint is always an
editable `.drawio` snapshot committed to the repository and pinned by the NFR
manifest.

The multi-page diagram must present:

1. Executive summary.
2. Current and target architecture diagrams.
3. Component responsibilities and system boundaries.
4. Integrations and important data flows.
5. Data storage and migration approach.
6. Security model and roles.
7. Deployment topology.
8. Key measurable NFRs.
9. Important ADRs and trade-offs.
10. Risks, assumptions, and delivery sequence.

The first page is the architecture hub. Its drill-down cards link to stable Draw.io
page IDs, and every detail page links back to the hub. The page ID is the durable
reference; its display number may change when a new concern is inserted.

`architecture-nfr-manifest.json.diagram_pages` declares each Draw.io page and the concerns
it covers. `audit:architecture` requires every page to be declared and every
concern above to be covered, so a syntactically valid but incomplete board
cannot close Stage 10.

`architecture.md`, the NFR manifest, ADRs, and the approved Draw.io snapshot
form one governed architecture set. The diagram must not introduce requirements
or decisions absent from the textual record. Optional exports are views only.
The governed set contains no delivery-specification identifiers, [`specs/`](../../specs) paths,
downstream delivery-stage records, or implementation chronology. Downstream specifications cite
architecture sections, ADRs, and NFRs; architecture never links back to them.

## Versioning And Approval

- The shared cloud file is a collaborative workspace, not durable approval
  evidence by itself.
- The editable Draw.io snapshot is refreshed whenever the approved
  architecture set changes.
- The architecture manifest pins the SHA-256 of `architecture.md`, every ADR,
  and `architecture.drawio`.
- Independent architecture control verifies semantic agreement between the
  textual record and every Draw.io page.
- Owner review records the exact architecture-set version and hashes in
  the selected `stage-11/architecture-owner-verdict-NNN.md`; Stage 12 produces its own `architecture-closure-NNN.md`.
- Any later architecture change invalidates the previous snapshot and verdict until
  the architecture control and owner-review gates repeat for the changed scope.

## Visual Quality Gate

Before owner review:

1. Open every Draw.io page at a normal review zoom and optionally export SVG.
2. Confirm that text, tables, and diagrams are not clipped or overlapping.
3. Confirm that fonts, colors, spacing, and page hierarchy are readable and
   consistent.
4. Confirm that diagrams remain legible at normal viewing size.
5. Confirm that links, version labels, and document metadata are correct.

A semantically correct but unreadable or visually broken diagram does not pass the
architecture gate.

The official Draw.io MCP may create and open diagrams for an agent. Google
Drive provides the shared browser-editing workspace. Neither service-side state
nor a chat statement replaces the committed, manifest-pinned snapshot.

## Numbered Architecture Review Cycles

New and reopened cycles follow [Architecture Review Cycles](review-cycles.md). Stage 11 records the human decision in `analysis/stages/stage-11/architecture-owner-verdict-NNN.md`; Stage 12 creates a separate immutable `analysis/stages/stage-12/architecture-closure-NNN.md`. Status selects exact paths. A negative closure accompanies the classified return and is mandatory reading on re-entry at Stages 9-11. Stage 13 reads and pins both records. Preserve old decisions, hashes and stage history; adopting this format is not a new approval.

## Feature Dependency Contract

Stage 9 creates analysis/feature-dependencies.json as bounded delivery planning linked to parity rows and architecture contracts. Stage 10 independently reviews its evidence, omissions and cycles. It does not replace architecture sections or the owner roadmap decision.

See [the normative dependency procedure](../feature-dependencies-guide.md).

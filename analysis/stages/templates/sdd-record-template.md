# Stage 15 SDD Record - <scope>

**Here is what I designed, which approved sources I used, which requirements I covered, where gaps remain, and what I am handing over for your review.**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Here is what I designed, which approved sources I used, which requirements I covered, where gaps remain, and what I am handing over for your review.**
- **Created by:** The Stage 15 design agent records the produced SDD package, assumptions, scope and self-checks.
- **Maintained / decided by:** The design agent records corrections before independent Stage 16 control.
- **Governing instructions:** Stage 15
- **When used:** The Stage 15 design agent prepares this handoff from the named template as the SDD is assembled, including blocked or incomplete packages. The Stage 16 reviewer checks its source bindings, coverage, assumptions and gaps against the actual spec, plan and tasks. audit:sdd checks the package, not this report; only independent review and the required owner decision can authorize implementation.
- **How used:** The Stage 15 design agent records the actual source approvals or bounded exceptions, links the specification, plan and tasks, and declares coverage, gaps and readiness for Stage 16. This is not an implementation self-review, an independent verdict or delivery evidence. The Stage 16 agent must verify this handoff against its sources; audit:sdd checks the SDD package but does not read this report.
- **Example:** The reconstructed XPlanner 029 record links rows 260-263 to requirements and tasks, cites the owner decision and bounded waivers, and exposes conflicting prototype versions and delta/expanded wording before a fresh review. Historical delivery is not re-approved.

**Produced coverage and handoff boundary:**

- Exact approved inputs and declared source/requirement scope
- Source item mapped to the produced concept or SDD section
- Represented / missing / contradictory / explicitly deferred or excluded
- Remaining gaps, responsible actor and blocking prerequisites
- Readiness for the next independent review, not its verdict

A file hash proves identity, not correctness. Planned tests are not executed tests, and authored coverage is not implemented behavior.

**Conditional cosmetic backlog check:**

- Stage 15: If a cosmetic backlog exists, the design agent compares every open finding with the slice screens, components and functions, not only its assigned slice. Matching finding IDs become linked tasks in tasks.md; the agent updates the same backlog with scope matches and reasons for exclusions. Missing referenced backlog or unmapped scope blocks planning.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `authored` (the SDD was written, not implemented or independently approved); `changes required` (design corrections remain); `blocked` (a required input or decision is missing). [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/stages/stage-15/sdd-record.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Written design coverage and handoff prerequisites are not yet established.
>
> **Next:** The Stage 15 agent completes the bounded design and records gaps before independent Stage 16 review.
>
> **Details:** [Traceability Coverage](#read-traceability-coverage) / [Design Gaps And Handoff Boundary](#read-design-gaps-and-handoff-boundary) / [Gate Result](#read-gate-result).

<details>
<summary><strong>Contents</strong></summary>

- [Shared UI Handoff](#read-shared-ui-handoff)
- [Metadata](#read-metadata)
- [Approved Prototype Contract](#read-approved-prototype-contract)
- [Binding Visual Style Checks](#read-binding-visual-style-checks)
- [Navigation Availability](#read-navigation-availability)
- [Inputs](#read-inputs)
- [SDD Artifacts](#read-sdd-artifacts)
- [Traceability Coverage](#read-traceability-coverage)
- [Design Gaps And Handoff Boundary](#read-design-gaps-and-handoff-boundary)
- [NFR Ownership](#read-nfr-ownership)
- [Change Impact and Verification Scope](#read-change-impact-and-verification-scope)
- [Deferred Scope](#read-deferred-scope)
- [Verification](#read-verification)
- [Gate Result](#read-gate-result)
- [Error Prevention](#read-error-prevention)
- [Feature Dependency Contract](#read-feature-dependency-contract)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-shared-ui-handoff"></a>

## Shared UI Handoff

For a UI slice, name the exact approved export set and manifest hash, catalogue
and token source pins, and the spec's Used UI Control Inventory. Separate
covered controls/variants from missing variants, unverified states and required
returns. `audit:sdd` checks variant bindings; the Stage 16 reviewer must still
read this handoff and verify its claims. An unchanged historical prototype may
have an explicit compatibility pin; do not claim a UI kit was approved when absent.

- Baseline and source pins: [exact references or non-visual reason]
- Controls/variants covered: [spec links and established coverage]
- Gaps and return decisions: [remaining work, responsible actor, next gate]

<a id="read-metadata"></a>

## Metadata

The Stage 15 design agent creates this record from this template while preparing
the package, including incomplete or blocked work. The Stage 16 reviewer uses
it as a handoff index, then independently checks the linked sources and SDD.
An implementation self-review or remediation summary is not a substitute.
For retrospective reconstruction, the agent records today's author/date, the
exact historical source revision, and missing evidence; it never backdates
approval or treats a later delivery result as a pre-implementation pass.

- Date: YYYY-MM-DD
- Author: <agent or person>
- Scope: <feature or slice identifier>
- Parity-map revision: <reference>
- Prototype export set version: <approved version>
- Architecture document set version: <approved version>
- Outcome: authored | changes required | blocked

<a id="read-approved-prototype-contract"></a>

## Approved Prototype Contract

- UI impact: <yes|no>
- Approved export set: `<exact version; omit only for no>`
- Minimum visual similarity: `<95..100 percent; project command contract>`
- Reason: <required for no or not applicable>
- Visual divergence: <implemented and deferred prototype elements>

| Screen | Export SHA-256 | Slice responsibility |
|---|---|---|
| `<screen-id>` | `<64-character SHA-256>` | `<binding composition/states>` |

<a id="read-binding-visual-style-checks"></a>

## Binding Visual Style Checks

Every approved screen needs all seven categories below. Values must be derived
from the pinned wireframe, not guessed from the implementation. Use computed
browser styles for typography, geometry, palette and spacing. `Not applicable`
is allowed only with a concrete reason in the Approved value cell.
The states row must name every interaction declared by the approved source,
including `hover`, `focus`, `active/pressed`, and `selected` when present, and
must bind an automated browser assertion that actually activates that state.
A state transition requires two source-derived assertions: the computed
pre-interaction appearance and the computed appearance or behavior after the
interaction. Checking only the activated state can preserve an incorrect
resting style and is not evidence.
A generic `browser state assertion` or a static screenshot is not evidence for
an interaction state.

| Screen | Category | Element/state | Approved value | Automated assertion |
|---|---|---|---|---|
| `<screen-id>` | typography | `<label/control>` | `<font family, size, weight, line-height>` | `<browser assertion>` |
| `<screen-id>` | component geometry | `<control/container>` | `<width/height/radius>` | `<browser assertion>` |
| `<screen-id>` | palette | `<element/state>` | `<foreground/background/border>` | `<browser assertion>` |
| `<screen-id>` | spacing | `<element/container>` | `<padding/gap/margin>` | `<browser assertion>` |
| `<screen-id>` | states | `<pre-interaction plus selected/disabled/error/hover>` | `<binding appearance before and after interaction>` | `<pre-interaction and activated-state computed browser assertions>` |
| `<screen-id>` | iconography | `<icon location>` | `<approved library and exact icon id>` | `<DOM/browser assertion>` |
| `<screen-id>` | content fidelity | `<representative populated, missing, boolean, badge and long values>` | `<exact copy, case, punctuation, placeholder glyphs and variants>` | `<browser assertions using source-derived examples>` |

For sibling screens under one shell or navigation group, the spacing contract
also names the owner of the outer page inset and compares breadcrumb,
navigation and primary-heading coordinates at the same viewport. Feature-local
content spacing must be distinguished from shell-owned frame spacing.

<a id="read-navigation-availability"></a>

## Navigation Availability

Complete this matrix for every role-aware destination affected by the slice.
Missing permission means `absent`; `disabled` is reserved for an authorized role
missing context or an explicitly deferred implementation. Hiding a destination
does not replace direct-route authorization.

| Destination | Role or capability | Required context | Rendered state | Direct-route outcome | Evidence |
|---|---|---|---|---|---|
| `<destination>` | `<role/capability>` | `<context or none>` | `<absent/disabled/link>` | `<allowed/forbidden/not-found>` | `<unit/browser/API assertion>` |

<a id="read-inputs"></a>

## Inputs

- Parity-map rows and Stage 4 decisions: <references>
- Approved prototype: <decision, manifest, and approval references>
- Approved architecture: <manifest, ADRs, Draw.io snapshot, and verdict references>
- Controlled target knowledge: <OKF manifest and Stage 14 clean pass>
- Existing specifications and inventories: <references>

<a id="read-sdd-artifacts"></a>

## SDD Artifacts

| Artifact | Purpose | Status |
|---|---|---|
| specs/NNN-<slug>/spec.md | requirements and acceptance scenarios | <status> |
| specs/NNN-<slug>/plan.md | architecture-aligned implementation plan | <status> |
| specs/NNN-<slug>/tasks.md | dependency-ordered executable tasks | <status> |
| specs/traceability.md | parity-map-to-SDD index | <status> |
| analysis/inventories/target-surface-inventory.json | useful target surfaces | <status> |

<a id="read-traceability-coverage"></a>

## Traceability Coverage

| Parity rows or target requirement | Spec requirements | ADRs/NFRs | Tasks | Surface IDs | Status |
|---|---|---|---|---|---|
| <reference> | <FR ids> | <ADR/NFR ids> | <task ids> | <surface ids> | covered/missing/contradictory/deferred |

Here covered means represented consistently in the authored SDD, not implemented
or tested in the running target. Planned tests and browser assertions throughout
this record remain verification plans until a later execution record supplies
actual observations. The Stage 15 agent does not issue the Stage 16 verdict.

<a id="read-design-gaps-and-handoff-boundary"></a>

## Design Gaps And Handoff Boundary

| Gap ID / requirement | Expected input or SDD coverage | Actual authored state and evidence | Required actor / correction | Gate impact or owner deferral |
|---|---|---|---|---|
| S-NNN / <ID> | <requirement and source link> | <missing/contradictory/unapproved item> | <actor and action> | <blocking reason or exact decision and re-entry condition> |

- Scoped requirement items: <count>; covered: <count>; missing: <count>;
  contradictory: <count>; deferred: <count>. The four outcomes sum to the scope.
- Pending input approvals or assumptions: <IDs and evidence or none>.
- Ready for independent review: <yes/no with unresolved blocking IDs>.
- Independent Stage 16 decision: <not yet performed, or separate exact report>.

<a id="read-nfr-ownership"></a>

## NFR Ownership

The Stage 15 agent reads the approved NFR manifest without modifying it.
Record source version/hash, criterion, owning requirement/task and planned test
in downstream [specs/traceability.md](../../../specs/traceability.template.md) and the slice plan. Stage 17 adds executed evidence
there; architecture changes require Stage 9 and renewed Stages 10-12 approval.

| NFR | Acceptance criterion | SDD requirement or task | Planned test or measurement |
|---|---|---|---|
| <NFR-id> | <criterion> | <reference> | <evidence plan> |

<a id="read-change-impact-and-verification-scope"></a>

## Change Impact and Verification Scope

- Verification mode: <delta | expanded | full>
- Baseline: <last accepted scope/revision>
- Trigger assessment: <none with reason, or exact expansion trigger>
- Selected checks: <exact suites/surfaces/contracts/data paths>
- Excluded checks: <scope plus evidence of non-impact>
- Re-entry triggers: <conditions that expand scope>

| Dimension | Direct change | Dependents / regression scope | Evidence |
|---|---|---|---|
| Parity map and decisions | <scope> | <scope> | <reference> |
| Architecture and knowledge | <scope> | <scope> | <reference> |
| Backend and contracts | <scope> | <scope> | <reference> |
| Data and background work | <scope> | <scope> | <reference> |
| Security and permissions | <scope> | <scope> | <reference> |
| UI and shared design system | <scope> | <scope> | <reference> |
| Deployment and operations | <scope> | <scope> | <reference> |

<a id="read-deferred-scope"></a>

## Deferred Scope

| Item | Reason | Owner decision | Re-entry condition |
|---|---|---|---|
| <item or none> | <reason> | <reference> | <condition> |

<a id="read-verification"></a>

## Verification

**Who checks this handoff?** The independent Stage 16 agent reads this record
and reconciles its source versions, coverage and gaps with the actual design.
`audit:sdd` checks the SDD package, not `sdd-record.md`; a green command does not
validate the author's account or authorize implementation. The Stage 16 gate
also requires the applicable audits, a clean independent report and explicit
owner decisions. See [gate inputs and limits](../../gate-review-guide.md#sdd-audit).

The author records only checks actually performed below, with exact scope and
evidence. The reviewer records independent results in a separate Stage 16 pass,
not by converting this author record into an approval.

| Gate | Command or procedure | Result |
|---|---|---|
| <traceability, spec, inventory, or workbook check> | <exact check> | pass/fail/blocked |

<a id="read-gate-result"></a>

## Gate Result

<State whether every row or target-only requirement is covered or explicitly
deferred, every NFR has SDD ownership, and the artifacts are ready for Stage
16 independent review. Implementation remains closed until that review and
owner approval are complete at Stage 16.>

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

- **Self-check:** <stage/scope; result version; checklist revision or SHA-256;
  applicable CHK IDs and passed/failed/blocked outcomes; exclusions with reasons;
  or no learned checks yet>
- **Learning update:** <confirmed generalized proposals and basis; covered by
  existing CHK IDs; or no qualifying new check and why>

Independent reviewers propose changes here without editing the shared table.
The coordinator records actual admission/deduplication in the current correction
or work record. The owner need not write this section. This note does not replace
the required independent review, human decision or stage evidence.

<a id="read-feature-dependency-contract"></a>

## Feature Dependency Contract

Name the slice node ID and current dependency scope digest. Summarize confirmed prerequisites, candidate links, unknowns and impacted consumers. Link the graph and audit result; this author self-check is not independent graph approval.

See [the normative dependency procedure](../../feature-dependencies-guide.md).

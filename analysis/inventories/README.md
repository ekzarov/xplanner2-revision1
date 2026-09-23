# Migration Inventories

**Which target screens, APIs and jobs must exist, for which roles, and what useful actions must they support?**

The target inventory is the catalogue of the new system's entry points. Read
it to distinguish an actual useful capability from an empty page, exposed
endpoint or menu link. This README is the human-readable companion to the
strict JSON format; it is not a new approval or runtime observation.

## Contents

- [Target Surface Inventory](#target-surface-inventory)
- [Where It Participates](#where-it-participates)
- [How To Read The JSON](#how-to-read-the-json)
- [Worked XPlanner Example](#worked-xplanner-example)
- [From Design To Implementation](#from-design-to-implementation)
- [Record Rules](#record-rules)

**Reading technical statuses.** `gap` (missing required coverage/evidence), `planned-before-implementation` (proposed inventory), `transferred-to-target-inventory` (entries moved into the target inventory), and `implemented` (recorded implementation) are distinct. None alone supplies independent acceptance. JSON values stay unchanged. [Status meanings](../artifact-status-meanings.md).

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>target-surface-inventory.json</summary>

**Which target screens, APIs and jobs must exist, for which roles, and what useful actions must they support?**

A shared catalogue of entry points into the new system: screens, routes, API operations and jobs, their roles and useful actions. It connects each implemented action to SDD requirements, code and tests, so a reachable but empty page cannot stand in for migrated functionality. It complements the behavior-oriented parity map; it does not replace requirements or live acceptance.

- **Created by:** The Stage 15 agent creates the initial target surface inventory for the declared SDD scope.
- **Maintained / decided by:** Stage 17 updates implementation and test links before candidate review. Stage 18 compares live routes, roles, APIs and jobs against this read-only inventory; corrections return to Stage 15/17 and require a new candidate.
- **Instructions:** Stage 15 creates; Stage 17 updates; Stages 18-19 verify without changing the deployed candidate

**When used:** The Stage 15 agent declares planned destinations and roles; the independent Stage 16 agent checks their coverage against SDD. Stage 17 adds real code and test references. Stages 18-19 reconcile delivery and live behavior, with Stage 18 recording discrepancies in its delivery report; inventory corrections return to Stage 15/17 and a new candidate. audit:target reads this JSON; audit:sdd does not. Declared implemented status is not independent acceptance.

**Example:** XPlanner person-view declares /people/:id for AuthenticatedUser. Its useful action shows the selected person dashboard; actions.sdd names the requirements, actions.code points to the implementation and actions.tests identifies the exact browser test. Merely opening a page titled Person would not satisfy the action.

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

This directory contains machine-readable inventories used by design,
implementation, live revision, and acceptance gates.

## Target Surface Inventory

The Stage 15 design agent creates the project file from
[`target-surface-inventory.example.json`](target-surface-inventory.example.json)
as `target-surface-inventory.json` when Stage 15 begins, then extends the same
project-wide inventory for subsequent slices. The owner decides any new
target-only scope; the agent records it rather than inventing authorization.

Inventory every target surface that a user, operator, or integration can
reach:

- routes and navigation destinations;
- role workspaces and screens;
- API operations and message handlers;
- commands, scheduled work, and batch jobs;
- error, recovery, and operational surfaces.

Each implemented surface has at least one useful action or observable contract. Each
action traces to:

- applicable roles;
- SDD requirements;
- implementation files;
- exact automated test references;

Deployment and acceptance results are kept in the linked process records,
not in invented JSON fields. The current schema has no per-action field for
a deployment verdict, test-run result or acceptance signature.

A path, heading, successful status code, or authorization check alone is not a
useful action.

## Where It Participates

| Stage / check | Who uses it and why |
|---|---|
| 15: design | The design agent declares destinations and roles in the current SDD scope and records gaps honestly. |
| 16: independent design control | The reviewer checks that SDD covers the promised useful actions and applicable roles. The inventory is not proof that code already exists. |
| 17: implementation | The implementation agent adds real code and exact test references and reconciles observed routes/API operations with the inventory. |
| 18: delivery | The delivery agent uses the affected surfaces to define and reconcile deployed checks; successful local checks alone are not deployed evidence. |
| 19: live revision | The live-revision agent compares actual behavior with the inventory and updates recorded discrepancies. |
| 20: independent acceptance | The acceptance reviewer checks useful behavior for the declared roles and the exact delivered scope before owner acceptance. |
| `audit:target` | The script reads this JSON, configured adapter observations and referenced SDD/code/test files, checks role coverage and selected unfinished-content markers. It does not execute every linked test or exercise every screen. |

`audit:sdd` does not read this inventory directly. See
[gate inputs and limits](../gate-review-guide.md#target-audit).

**Different viewpoints, not competing requirements:** the parity map tracks
behavior to preserve, change or exclude; SDD specifies its design; this
inventory enumerates where the resulting capabilities can be reached.
A wireframe manifest inventories approved prototype exports, not running API
operations or jobs. One user scenario can involve several target surfaces.

## How To Read The JSON

Start with `surfaces`, even though `adapters` appears first in the file.

| Field | Read it as |
|---|---|
| `surfaces[].id` | Stable name for one target entry point. This is not necessarily a parity-row or feature ID. |
| `kind` and `destination` | What kind of entry point is it, and where is it reached? Examples: a screen URL or `GET /api/...`. |
| `roles` | Which roles are declared for this surface? A declaration does not enforce access control. |
| `actions[].description` | What useful result must the actor obtain? A heading, HTTP 200 or access check alone is insufficient. |
| `actions[].roles` | Which surface roles can perform this action? Roles must stay within the surface's declared roles. |
| `actions[].sdd` | Which exact SDD requirements justify the action? References identify a file and requirement anchor. |
| `actions[].code` | Where is its implementation? An existing source file alone does not prove behavior. |
| `actions[].tests` | Which exact test is associated with the action, and for which roles? A test reference is not a successful execution result. |
| `status` | `gap`: capability/evidence is missing; `implemented`: implementation is recorded; `deferred`: intentionally postponed under a governed decision. None is owner acceptance. |
| `visibility` | `visible` or `hidden`: declared exposure in the target, not CSS visibility. Gaps and deferred surfaces must stay hidden. |
| `target_only` | Whether this is a new target-only requirement rather than migrated behavior. If true, `target_requirement` must reference its exact governed requirement. |
| `adapter_required` | For an implemented, visible surface, true or omission requires an adapter observation. False disables only the missing-observation check; it does not prove presence or disable the other checks. |

The remaining top-level fields support the automatic comparison:

- **`schema_version`:** the inventory format version, not the application's release.
- **`adapters`:** how the audit reads observations. `file` selects the JSON input,
  `collection` selects its array, and `mapping` translates its field names.
  Observations are only as complete and fresh as their producer.
- **`marker_scans`:** selected source roots, extensions and text markers for
  unfinished content. This is a configured text search, not a universal
  semantic detector of incomplete functionality.

## Worked XPlanner Example

The existing `person-view` entry can be read as one sentence:

> An authenticated user can open `/people/:id` and review the selected person's
> dashboard with six work sections, subject to the viewer's project scope.

Its `review-selected-person-dashboard` action connects that promise to:

1. **Requirements:** [`specs/028-person-dashboard/spec.md`](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/specs/028-person-dashboard/spec.md), including
   `FR-2801`, `FR-2802`, `FR-2804` and `FR-2807`.
2. **Implementation:** `person-view.ts` and the application's `app.routes.ts`.
3. **Test:** `person-dashboard.spec.ts#selected person dashboard preserves the governed six-section contract`,
   declared for `AuthenticatedUser`.

The file says `status: "implemented"` and `visibility: "visible"`. Read this
as the recorded implementation claim, not a new verification performed while
writing this guide. This entry also has `adapter_required: false`: its absence
from adapter observations alone will not fail the audit.

[Open the exact existing XPlanner inventory](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/inventories/target-surface-inventory.json).
In XPlanner, `target-surface-observations.json` is produced from
`@target-surface` source markers by
[`build-target-surface-observations.js`](https://github.com/olsys-ltd/xplanner2/blob/62a21930d8d7c19017ac9ed9e4a474a614e30842/analysis/tools/build-target-surface-observations.js).
It is not a live browser crawl. Live evidence still comes from the delivery
and independent acceptance work.

## From Design To Implementation

At Stage 15 the target may not exist yet. The agent records a planned surface
as `gap` / `hidden`; the starter JSON deliberately has `actions: []`.
This is a declared gap, not a finished useful action. Planned behavior and
verification belong in spec/plan/tasks, with missing evidence disclosed in
the SDD handoff. The reviewer must still check the proposed coverage.

The current schema requires every populated action to have SDD, code and test
references; the audit checks those references even for a gap. The agent must
not invent implementation paths or pretend tests exist just to fill the JSON.
At implementation, the agent adds real references and recorded action/role
coverage before declaring `implemented`. Independent checks and live
acceptance then validate the claim; they are not replaced by editing this flag.

The inventory is not a test-run ledger or a historical review report.
Git retains changes to this catalogue; exact review, deployment and acceptance
records retain the evidence for a particular revision.

## Record Rules

- Keep identifiers stable and unique.
- Use repository-relative paths and exact requirement anchors.
- Use `status: "gap"` with `visibility: "hidden"` while Stage 15 work is only
  planned. Change it to `implemented` only when code and tests provide the
  required evidence; use `deferred` only with a governed decision.
- Record target-only surfaces only when an explicit owner-approved target
  requirement exists.
- List a test as `<path>#<exact test name>` so the behavior can be located.
- Enumerate role-specific behavior explicitly unless the action is genuinely
  invariant across roles.
- Keep deferred surfaces out of production exposure until their governed
  decision permits otherwise.
- Reconcile the inventory with deployed routes, navigation, operations, and
  jobs at Stages 17 and 18.

Use the repository's target-surface audit when available. Otherwise perform
and record a full manual bidirectional check: every deployed surface is in the
inventory and every inventory entry exists with its promised useful action.

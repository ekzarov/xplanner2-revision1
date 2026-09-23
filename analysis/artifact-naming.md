# Artifact Naming

This is the naming contract for new records created from this starter.
The machine-readable mapping is [artifact-naming.json](artifact-naming.json).

## From Template To Record

Remove the template marker immediately before the extension (`-template`,
`.template`, or `_template`). For a JSON example remove `.example`.
Keep the remaining filename stem and use the output directory in the table.
Fill only the named uppercase placeholders:

- `NN`: two-digit stage or chapter number, such as `07`.
- `NNN`: three-digit pass, record, decision or slice number, such as `001`.
- `SLUG`: a short stable lowercase hyphenated name, such as `session-security`.
- `CATEGORY`: the knowledge category, such as `architecture` or `workflows`.
- `GATE` and `SCOPE`: the governed gate name and stable waiver scope.

The output path in the table is authoritative. When it contains no uppercase
filename token, it is a fixed path: create that exact file and do not add a
number or rename it. For example, `architecture-template.md` always produces
`analysis/architecture/architecture.md`, not `architecture-001.md`. When the
output path does contain `NN`, `NNN`, `SLUG`, `CATEGORY`, `GATE`, or `SCOPE`,
replace only those visible tokens and keep every other path segment unchanged.

For example, `walkthrough-NNN-template.md` produces
`analysis/stages/stage-03/walkthrough-001.md`.
Do not rename that record to `stage-03-outcome.md`, `report.md` or
`result.md` in a new project. Outcomes belong inside the record.
Likewise, `delivery-NNN-template.md` produces `delivery-001.md`, and
`stage-NN-pass-NNN-template.md` produces `stage-07-pass-001.md`.

Use the next unused number for a new immutable pass or delivery record.
Update fixed-name living records in place under their existing governance rules.
A slice-specific fixed-name record can live in a scope subdirectory, for example
`analysis/stages/stage-15/001-login/sdd-record.md`; keep its basename.

## Guidance Versus Project Evidence

Every Markdown template starts with a collapsed **Artifact guidance (not project
evidence)** block. It explains when and how the artifact is used and gives an
example; it is reusable process help, not a statement about the current project.
The horizontal rule after that block marks where the project record begins.
Keep this separation when instantiating the template and write actual findings,
decisions, approvals and evidence only below the rule.

Structured formats use an equally explicit boundary. YAML files label their
comment-only `ARTIFACT GUIDANCE` and the start of `PROJECT RECORD`; JSON uses
schema-approved fields such as `_schema_help` or `_notes`. Guidance fields never
replace working values and are excluded from evidence hashes only where the
artifact's audit contract explicitly says so.

When prose names an existing repository file or directory, keep the path as a
code-styled clickable link, for example
[`analysis/prototyping/templates/ui-ux-approval-template.md`](prototyping/templates/ui-ux-approval-template.md). Plain inline code
is appropriate only when the text is not a navigation reference, such as a
command, identifier, glob, placeholder or future output path.

## Template And Output Paths

| Starter template or example | New project output |
|---|---|
| [config/project.template.yaml](../config/project.template.yaml) | [`config/project.yaml`](../config/project.yaml) |
| [analysis/migration_status.template.yaml](migration_status.template.yaml) | [`analysis/migration_status.yaml`](./migration_status.yaml) |
| [analysis/stages/templates/bootstrap-gate-report-template.md](stages/templates/bootstrap-gate-report-template.md) | [`analysis/stages/bootstrap/bootstrap-gate-report.md`](./stages/bootstrap/bootstrap-gate-report.md) |
| [analysis/legacy_reconnaissance.template.md](legacy_reconnaissance.template.md) | [`analysis/legacy_reconnaissance.md`](./legacy_reconnaissance.md) |
| [analysis/legacy_user_flows_template.xlsx](legacy_user_flows_template.xlsx) | [`analysis/legacy_user_flows.xlsx`](./legacy_user_flows.xlsx) |
| [specs/traceability.template.md](../specs/traceability.template.md) | `specs/traceability.md` |
| [specs/verification-record.template.md](../specs/verification-record.template.md) | `specs/NNN-feature/verification-record.md` |
| [.specify/templates/spec-template.md](../.specify/templates/spec-template.md) | `specs/NNN-SLUG/spec.md` |
| [.specify/templates/plan-template.md](../.specify/templates/plan-template.md) | `specs/NNN-SLUG/plan.md` |
| [.specify/templates/tasks-template.md](../.specify/templates/tasks-template.md) | `specs/NNN-SLUG/tasks.md` |
| [analysis/prototyping/templates/ui-ux-decision-template.md](prototyping/templates/ui-ux-decision-template.md) | `analysis/prototyping/ui-ux-decision.md` |
| [analysis/prototyping/templates/ui-ux-approval-template.md](prototyping/templates/ui-ux-approval-template.md) | `analysis/prototyping/ui-ux-approval.md` |
| [analysis/prototyping/templates/ui-polish-backlog-template.md](prototyping/templates/ui-polish-backlog-template.md) | `analysis/prototyping/ui-polish-backlog.md` |
| [analysis/architecture/templates/architecture-template.md](architecture/templates/architecture-template.md) | `analysis/architecture/architecture.md` |
| [analysis/architecture/templates/architecture-nfr-owner-review-template.md](architecture/templates/architecture-nfr-owner-review-template.md) | `analysis/architecture/architecture-nfr-owner-review.md` |
| [analysis/architecture/templates/architecture-nfr-decision-register-template.xlsx](architecture/templates/architecture-nfr-decision-register-template.xlsx) | `analysis/architecture/architecture-nfr-decision-register.xlsx` |
| [`analysis/architecture/templates/architecture-owner-verdict-NNN-template.md`](./architecture/templates/architecture-owner-verdict-NNN-template.md) | `analysis/stages/stage-11/architecture-owner-verdict-NNN.md` |
| [`analysis/architecture/templates/architecture-closure-NNN-template.md`](./architecture/templates/architecture-closure-NNN-template.md) | `analysis/stages/stage-12/architecture-closure-NNN.md` |
| [analysis/architecture/templates/NNN-SLUG-template.md](architecture/templates/NNN-SLUG-template.md) | `analysis/architecture/adr/NNN-SLUG.md` |
| [analysis/architecture/templates/sections/00-foundation-template.md](architecture/templates/sections/00-foundation-template.md) | `analysis/architecture/sections/00-foundation.md` |
| [analysis/architecture/templates/sections/NN-SLUG-template.md](architecture/templates/sections/NN-SLUG-template.md) | `analysis/architecture/sections/NN-SLUG.md` |
| [analysis/knowledge/templates/index-template.md](knowledge/templates/index-template.md) | `analysis/knowledge/bundle/index.md` |
| [analysis/knowledge/templates/SLUG-template.md](knowledge/templates/SLUG-template.md) | `analysis/knowledge/bundle/CATEGORY/SLUG.md` |
| [analysis/reviews/stage-NN-pass-NNN-template.md](reviews/stage-NN-pass-NNN-template.md) | `analysis/reviews/stage-NN-pass-NNN.md` |
| [analysis/stages/templates/walkthrough-NNN-template.md](stages/templates/walkthrough-NNN-template.md) | `analysis/stages/stage-03/walkthrough-NNN.md` |
| [analysis/stages/templates/stage-04-requirements-revision-template.md](stages/templates/stage-04-requirements-revision-template.md) | `analysis/stages/stage-04/stage-04-requirements-revision.md` |
| [analysis/stages/templates/knowledge-record-template.md](stages/templates/knowledge-record-template.md) | `analysis/stages/stage-13/knowledge-record.md` |
| [analysis/stages/templates/sdd-record-template.md](stages/templates/sdd-record-template.md) | `analysis/stages/stage-15/sdd-record.md` |
| [analysis/stages/templates/delivery-NNN-template.md](stages/templates/delivery-NNN-template.md) | `analysis/stages/stage-18/delivery-NNN.md` |
| [analysis/stages/templates/stage-19-pass-NNN-template.md](stages/templates/stage-19-pass-NNN-template.md) | `analysis/reviews/stage-19-pass-NNN.md` |
| [analysis/stages/templates/owner-walkthrough-NNN-template.md](stages/templates/owner-walkthrough-NNN-template.md) | `analysis/stages/stage-19/owner-walkthrough-NNN.md` |
| [analysis/stages/templates/owner-walkthrough-decline-template.md](stages/templates/owner-walkthrough-decline-template.md) | `analysis/stages/stage-19/owner-walkthrough-decline.md` |
| [analysis/stages/templates/GATE-SCOPE-template.md](stages/templates/GATE-SCOPE-template.md) | `analysis/stages/waivers/GATE-SCOPE.md` |
| [analysis/prototyping/templates/screen-normalization.example.json](prototyping/templates/screen-normalization.example.json) | `analysis/prototyping/screen-normalization.json` |
| [analysis/prototyping/templates/screen-manifest.example.json](prototyping/templates/screen-manifest.example.json) | `analysis/prototyping/screen-manifest.json` |
| [analysis/architecture/templates/architecture-nfr-manifest.example.json](architecture/templates/architecture-nfr-manifest.example.json) | `analysis/architecture/architecture-nfr-manifest.json` |
| [analysis/knowledge/templates/knowledge-manifest.example.json](knowledge/templates/knowledge-manifest.example.json) | `analysis/knowledge/knowledge-manifest.json` |
| [analysis/inventories/target-surface-inventory.example.json](inventories/target-surface-inventory.example.json) | `analysis/inventories/target-surface-inventory.json` |

## Existing Projects And Other Artifacts

Existing projects retain their recorded names and evidence links. XPlanner's
`analysis/stages/stage-03/stage-03-outcome.md` is an existing instance of the
walkthrough artifact; it is not the naming model for a new project.
Status and manifests continue to reference exact recorded paths. Renaming a
historical file solely for consistency can invalidate evidence links or hashes.

Copied files such as `AGENTS.md`, `MIGRATION.md`,
[`config/environments.yaml`](../config/environments.yaml) and [`.specify/memory/constitution.md`](../.specify/memory/constitution.md) retain their
paths. The initializer renders the constitution in place; it has no separate
template filename. Generated wireframes, code, tests, raw browser evidence and
diagrams follow their domain contracts because they are not copies of a
single file template.

The initializer creates only its documented Bootstrap outputs. Listing a later
record here does not authorize creating or approving it before its stage.

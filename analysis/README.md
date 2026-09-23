# Analysis Workspace

This directory contains the reusable migration methodology, blank parity map,
artifact templates, review protocol, status schema, and deterministic audit
tooling.

It must not contain evidence, decisions, credentials, or review history copied
from a completed migration. The temporary shared-demo deploy identity is a
separately governed starter credential under [`config/`](../config), not analysis evidence.

Current bootstrap content:

- [Agent system overview](agent-system-overview.md) - one picture of agent roles,
  invocation, durable handoffs, independent checks and human decisions.

- [`migration_methodology.md`](migration_methodology.md) - detailed canonical
  stage procedure: inputs, work, actors, outputs, gates, and return loops after
  `MIGRATION.md` and status have routed the agent to the active stage.
- [`migration_methodology.html`](migration_methodology.html) - human-facing
  visual presentation; it must not introduce rules absent from the Markdown.
- [`migration_status.template.yaml`](migration_status.template.yaml) - empty,
  unratified bootstrap checkpoint instantiated by `init-migration.ps1`.
- [`migration_status.schema.json`](migration_status.schema.json) - status,
  review-result, ratification, and allowed-transition contract.
- [`legacy_user_flows_template.xlsx`](legacy_user_flows_template.xlsx) - blank
  parity-map workbook copied to `legacy_user_flows.xlsx` during initialization.
- [`legacy_reconnaissance.template.md`](legacy_reconnaissance.template.md) -
  source inventory and evidence-boundary record copied to
  `legacy_reconnaissance.md` during initialization.
- [`legacy_user_flows_template_instructions.md`](legacy_user_flows_template_instructions.md)
  - workbook lifecycle, evidence rules, and the audited flow-completion
  percentage shown beside every collapsed hierarchy control.
- [`agent_orchestration.md`](agent_orchestration.md) - bounded cross-agent
  review protocol and durable review-log rules.
- [`prototyping/`](prototyping/README.md) - design decision, row normalization,
  wireframe exports, manifest, independent-control disposition, approval and
  audit contract, plus the reusable
  [`ui-visual-parity-checklist.md`](prototyping/ui-visual-parity-checklist.md) for
  structure, content variants, computed styles and interactions.
- [`architecture/`](architecture/README.md) - legacy architecture discovery,
  graded target NFR decision register, mandatory owner walkthrough,
  architecture record, ADRs, and collaborative Draw.io contract.
- [`reviews/`](reviews/README.md), [`stages/`](stages/README.md), and
  [`inventories/`](inventories/README.md) - reusable records and inventories.
- [`tools/`](tools/README.md) - deterministic, fail-closed audits and their
  regression tests.

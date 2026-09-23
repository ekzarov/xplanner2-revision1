# Artifact Relationship Graph

This map has two levels:

1. **Operational path** - the small set an agent follows during normal work.
2. **Grouped artifact catalogue** - where every governed artifact or artifact
   family belongs. Repeated evidence files are shown as a filename pattern.

`ARTIFACTS.md` remains the authoritative row-by-row catalogue. This document is
the visual navigation layer over that catalogue.

## 1. Operational Path

```mermaid
flowchart LR
    ENTRY["MIGRATION.md<br/>session router: what is allowed now"]
    STATUS["analysis/migration_status.yaml<br/>current stage and next action"]
    METHOD["analysis/migration_methodology.md<br/>how to execute the selected stage"]
    MAP["analysis/legacy_user_flows.xlsx<br/>parity map"]
    ARCH["analysis/architecture/<br/>architecture checkpoint"]
    SDD["specs/NNN-feature/<br/>slice specification"]
    BUILD["application code<br/>tests and deployment"]
    ACCEPT["independent review<br/>owner acceptance"]
    SYNC["architecture sync<br/>record only affected decisions"]

    ENTRY --> STATUS --> METHOD --> MAP --> ARCH --> SDD --> BUILD --> ACCEPT --> SYNC
    SYNC -->|"architecture changed"| ARCH
    SYNC -->|"slice accepted"| STATUS
```

## 2. Complete Grouped Artifact Map

```mermaid
flowchart TB
    subgraph G1["1. Entry, governance and current control"]
        direction LR
        ROOT["README.md<br/>AGENTS.md<br/>MIGRATION.md<br/>ARTIFACTS.md<br/>init.ps1 and .migration-starter*.json"]
        GOV[".specify/memory/constitution.md<br/>analysis/README.md<br/>analysis/agent_orchestration.md<br/>analysis/migration_methodology.md<br/>analysis/migration_methodology.html"]
        STATE["analysis/migration_status.yaml<br/>analysis/stages/bootstrap/bootstrap-gate-report.md<br/>config/project.yaml<br/>config/environments.yaml<br/>config/REMOTE_SERVER.md"]
    end

    subgraph G2["2. Legacy discovery and parity contract"]
        direction LR
        RECON["analysis/legacy_reconnaissance.md<br/>analysis/architecture/architecture-legacy-discovery-instructions.md"]
        PARITY["analysis/legacy_user_flows.xlsx<br/>analysis/legacy_user_flows_template_instructions.md"]
        DISCOVERY["analysis/stages/stage-03/**<br/>analysis/stages/stage-04/**<br/>additional discovery evidence and integration contracts<br/>exact project paths are linked from the stage record"]
    end

    subgraph G3["3. UI prototyping and owner approval"]
        direction LR
        PROTORULES["analysis/prototyping/README.md<br/>analysis/prototyping/templates/**"]
        PROTOSET["analysis/prototyping/ui-ux-decision.md<br/>screen-normalization.json<br/>screen-manifest.json<br/>wireframes/** + catalogue"]
        PROTOAPP["analysis/prototyping/ui-ux-approval.md<br/>approval-*-stale.md<br/>ui-polish-backlog.md when required"]
    end

    subgraph G4["4. Architecture decisions and collaborative design"]
        direction LR
        NFR["analysis/architecture/architecture-nfr-decision-register.xlsx<br/><b>owner questions, grades, decisions and technology stack</b>"]
        ARCHDOC["analysis/architecture/architecture.md<br/>architecture.drawio<br/>sections/*.md<br/>adr/*.md"]
        NFRMAN["analysis/architecture/architecture-nfr-manifest.json<br/><b>created at Stage 9: NFR criteria, ADR links, versions and hashes</b>"]
        ARCHAPP["analysis/architecture/architecture-nfr-owner-review.md<br/>stage-11/architecture-owner-verdict-NNN.md<br/>stage-12/architecture-closure-NNN.md"]
        ARCHRULES["analysis/architecture/README.md<br/>architecture-legacy-discovery-instructions.md<br/>architecture-nfr-decision-register-instructions.md<br/>templates/**"]
    end

    subgraph G5["5. Structured knowledge handoff"]
        direction LR
        KNOW["analysis/knowledge/knowledge-manifest.json<br/>bundle/index.md<br/>bundle/{category}/*.md"]
        KNOWRULES["analysis/knowledge/README.md<br/>analysis/knowledge/templates/**"]
    end

    subgraph G6["6. Feature specification and traceability"]
        direction LR
        SPECRULES[".specify/README.md<br/>.specify/templates/*.md<br/>specs/README.md"]
        SPEC["specs/NNN-feature/spec.md<br/><b>owner-reviewed assumptions</b><br/><b>impact scope: delta / expanded / full</b><br/>plan.md<br/>tasks.md<br/>traceability.md"]
        INVENTORY["analysis/inventories/target-surface-inventory.json<br/>analysis/inventories/README.md"]
    end

    subgraph G7["7. Implementation, deployment and acceptance"]
        direction LR
        CODE["project source code<br/>unit, integration and UI tests<br/>database migrations"]
        DEPLOY["deployment manifests<br/>Docker Compose / proxy config<br/>health, rollback and smoke commands"]
        DELIVERY["analysis/stages/stage-18/delivery-NNN.md (includes live reconciliation)<br/>analysis/reviews/stage-19-pass-NNN.md<br/>owner walkthrough report or exact decline decision"]
    end

    subgraph G8["8. Independent review, evidence and immutable history"]
        direction LR
        REVIEWS["analysis/reviews/stage-NN-pass-NNN.md<br/>*-dispositions.md<br/>*-independence.md<br/>owner-run/*.md"]
        STAGELOG["analysis/stages/stage-NN/**<br/>decision, outcome and evidence records<br/>analysis/stages/templates/**"]
        ARCHIVE["superseded architecture records and approvals<br/>retain original links and revision history<br/>analysis/waivers/GATE-SCOPE.md"]
    end

    subgraph G9["9. Templates, schemas and machine validation"]
        direction LR
        SCHEMAS["config/*.schema.json<br/>analysis/**/templates/**<br/>specs/*.template.md"]
        AUDITS["analysis/tools/*-audit.js<br/>analysis/tools/status-validator.js<br/>analysis/tools/*-audit.test.js<br/>analysis/tools/package.json"]
        CI[".github/workflows/starter-audit.yml<br/>.migration-starter.json"]
    end

    ROOT --> STATE
    GOV -. "governs" .-> STATE
    STATE --> RECON --> PARITY
    DISCOVERY --> PARITY
    PARITY --> PROTOSET --> PROTOAPP
    PARITY --> NFR
    PROTOAPP --> NFR
    NFR --> ARCHDOC --> NFRMAN --> ARCHAPP --> KNOW
    NFRMAN -->|"read-only; SDD owns NFR/task/test links"| SPEC
    KNOW --> SPEC
    PARITY --> SPEC
    PROTOSET --> INVENTORY --> SPEC
    SPEC --> CODE --> DEPLOY --> DELIVERY
    DELIVERY --> REVIEWS
    REVIEWS -->|"finding"| PARITY
    REVIEWS -->|"architecture finding"| NFR
    DELIVERY -->|"runtime evidence"| NFR
    ARCHDOC -->|"constraints"| SPEC
    ADR -->|"decisions"| SPEC

    PROTORULES -.-> PROTOSET
    ARCHRULES -.-> NFR
    KNOWRULES -.-> KNOW
    SPECRULES -.-> SPEC
    SCHEMAS -.-> STATE
    SCHEMAS -.-> PROTOSET
    SCHEMAS -.-> NFR
    AUDITS -. "validates" .-> STATE
    AUDITS -. "validates" .-> PROTOSET
    AUDITS -. "validates" .-> NFR
    AUDITS -. "validates" .-> KNOW
    AUDITS -. "validates" .-> SPEC
    AUDITS -. "validates" .-> DELIVERY
    CI -. "runs" .-> AUDITS
    STAGELOG -. "proves transitions" .-> STATE
    ARCHIVE -. "preserves superseded truth" .-> NFR

    classDef control fill:#dbeafe,stroke:#2563eb,color:#172554;
    classDef work fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef owner fill:#fef3c7,stroke:#d97706,color:#78350f;
    classDef history fill:#f3e8ff,stroke:#9333ea,color:#581c87;
    classDef support fill:#f3f4f6,stroke:#6b7280,color:#1f2937;

    class ROOT,GOV,STATE control;
    class RECON,PARITY,DISCOVERY,PROTOSET,ARCHDOC,NFRMAN,KNOW,SPEC,INVENTORY,CODE,DEPLOY,DELIVERY work;
    class NFR,PROTOAPP,ARCHAPP owner;
    class REVIEWS,STAGELOG,ARCHIVE history;
    class PROTORULES,ARCHRULES,KNOWRULES,SPECRULES,SCHEMAS,AUDITS,CI support;
```

## 3. Group Directory

| Group | Primary files | Purpose | Normal reader |
|---|---|---|---|
| Entry and control | `MIGRATION.md`, `migration_status.yaml`, `bootstrap-gate-report.md`, `ARTIFACTS.md` | Start work, find the current state, and inspect the command-level proof behind Bootstrap readiness | Every agent |
| Governance | constitution, methodology MD/HTML, project/environment config | Non-negotiable rules and operating contract | Orchestrator and reviewers |
| Legacy and parity | reconnaissance, `legacy_user_flows.xlsx`, stage evidence, integration contracts | Prove what the old system does and define the parity boundary | Analyst, architect, SDD author |
| Prototyping | decision, normalization, manifest, `wireframes/**`, independent pass, conditional polish backlog, approval | Define, independently control, and approve the visible target behavior | Designer, owner, UI reviewer |
| Architecture | **`architecture-nfr-decision-register.xlsx`**, Draw.io, architecture MD, ADRs, NFR manifest | Record owner decisions and constrain only the architecture needed for the current slice | Owner, architect, implementer |
| Knowledge | index, concepts, knowledge manifest | Translate approved architecture into structured system knowledge | SDD author and future agents |
| Specification | feature `spec.md` with owner-reviewed assumptions and impact scope, `plan.md`, `tasks.md`, traceability | Make one delivery slice explainable, approved, implementable and testable without rerunning unrelated scope | Owner, implementer and feature reviewer |
| Delivery | code, tests, deployment, delivery/live/acceptance records | Build, deploy and prove the slice | Implementer, operator, acceptance reviewer |
| Review and history | review passes, dispositions, stage records, archive, waivers | Preserve independent findings and superseded truth | Reviewers and auditors; not daily reading |
| Automation | templates, schemas, audit scripts, CI workflow | Prevent malformed or contradictory artifacts | Orchestrator and CI |

## 4. Reading Rules

1. Start with `MIGRATION.md`, then read [`analysis/migration_status.yaml`](./migration_status.yaml).
2. Read only the current slice and the groups it touches.
3. Use `ARTIFACTS.md` when an exact template, schema, tool, or generated-file
   rule is needed.
4. Treat `analysis/reviews/**`, archived architecture, stale approvals, and old
   stage outcomes as evidence, not as the current instruction set.
5. `analysis/architecture/architecture-nfr-decision-register.xlsx` is the owner-facing
   architecture decision register. Its Grade A rows do not form a separate
   up-front phase: open and amend only the decisions required by the current
   slice or contradicted by implementation evidence.

## 5. Starter Source Versus Project Instance

The starter stores instructions, templates, schemas, audits, and example files.
An initialized project creates the corresponding live artifacts, such as
[`analysis/migration_status.yaml`](./migration_status.yaml), [`analysis/legacy_user_flows.xlsx`](./legacy_user_flows.xlsx),
`analysis/prototyping/screen-manifest.json`,
`analysis/architecture/architecture-nfr-decision-register.xlsx`, architecture records,
feature specifications, review reports, and delivery evidence.

## 6. Consolidation Candidates

1. Create one compact modernization roadmap as the owner-facing list of ordered
   slices, dependencies, outcome, and current status.
2. Keep `migration_status.yaml` machine-readable and link it to the same current
   slice instead of duplicating narrative status across reports.
3. Keep the Excel decision register, ADRs, and Draw.io, but open only the rows
   and views affected by the current slice.
4. Keep immutable reports and archives searchable, but outside the normal
   reading path.
5. Consider folding `architecture-nfr-owner-review.md` into a future architecture-checkpoint
   record only after the replacement is designed, validated, and migrated.

<!-- STAGE_ARTIFACT_ROLES_START -->

## Stage Artifact Roles

Shared across stages: error-prevention-checklist.md is read before work and self-checked before handoff; the coordinator updates it only for confirmed generalized lessons. At Stages 2/19 learned checks and prior self-check notes are Phase B only. This standing duty is shown in every stage detail, not repeated as scene arrows. I = read; U = read and update; O = create. Conditional artifacts apply only when required by the stage. A manifest links the full approved source package; its links are not permission to skip those sources. Stages 2 and 19 open restricted records only in Phase B; status conclusions are also withheld. Stage 19 Phase A uses expectation-only extracts of the map, inventory and prototype; full originals follow saved observations. Frames indicate responsibility, not a successful verdict: solid = independent review (including Stage 17 peer review); dashed = responsible-agent verification.

| Stage | I | U | O | Phase B only |
|---|---|---|---|---|
| B: Bootstrap | AGENTS.md; MIGRATION.md; migration_methodology.md | None | constitution.md; migration_status.yaml; project.yaml; environments.yaml; bootstrap-gate-report.md; legacy_reconnaissance.md; legacy_user_flows.xlsx; error-prevention-checklist.md | None |
| 1: Reconnaissance | project.yaml | migration_status.yaml | legacy_reconnaissance.md; legacy_user_flows.xlsx | None |
| 2: Control reconnaissance | None | None | stage-02-pass-NNN.md | legacy_reconnaissance.md (I); legacy_user_flows.xlsx (I); migration_status.yaml (U) |
| 3: Live legacy walkthrough | legacy_user_flows.xlsx; stage-02-pass-NNN.md | migration_status.yaml | stage-03/walkthrough-NNN.md; waivers/GATE-SCOPE.md | None |
| 4: Requirements revision | stage-03/walkthrough-NNN.md | migration_status.yaml; legacy_user_flows.xlsx | stage-04-requirements-revision.md | None |
| 5: Application form and style | legacy_user_flows.xlsx; stage-04-requirements-revision.md | migration_status.yaml | prototyping/ui-ux-decision.md; ui-design-system.md; ui-design-tokens.json; waivers/GATE-SCOPE.md | None |
| 6: Wireframes | legacy_user_flows.xlsx; prototyping/ui-ux-decision.md | migration_status.yaml; ui-design-system.md; ui-design-tokens.json | screen-normalization.json; wireframes/*; screen-manifest.json; waivers/GATE-SCOPE.md | None |
| 7: Wireframe control | legacy_user_flows.xlsx; screen-normalization.json; wireframes/*; screen-manifest.json; ui-design-system.md; ui-design-tokens.json | migration_status.yaml | stage-07-pass-NNN.md; ui-polish-backlog.md | None |
| 8: Wireframe approval | stage-07-pass-NNN.md; screen-manifest.json; wireframes/*; ui-polish-backlog.md; ui-design-system.md; ui-design-tokens.json | migration_status.yaml | prototyping/ui-ux-approval.md | None |
| 9: Architecture requirements | prototyping/ui-ux-approval.md; legacy_user_flows.xlsx; legacy_reconnaissance.md; stage-03/walkthrough-NNN.md; ui-design-system.md; ui-design-tokens.json | migration_status.yaml | architecture-nfr-decision-register.xlsx; architecture-nfr-owner-review.md; architecture.md; architecture/sections/*.md; architecture.drawio; architecture/adr/NNN-*.md; architecture-nfr-manifest.json; waivers/GATE-SCOPE.md; feature-dependencies.json | None |
| 10: Architecture control | architecture-nfr-decision-register.xlsx; architecture-nfr-owner-review.md; architecture.md; architecture/sections/*.md; architecture.drawio; architecture/adr/NNN-*.md; architecture-nfr-manifest.json | migration_status.yaml; feature-dependencies.json | stage-10-pass-NNN.md | None |
| 11: Owner architecture review | stage-10-pass-NNN.md; architecture-nfr-decision-register.xlsx; architecture.md; architecture.drawio; architecture/adr/NNN-*.md; architecture-nfr-manifest.json; feature-dependencies.json | migration_status.yaml | architecture-owner-verdict-NNN.md | None |
| 12: Remark verification | architecture-owner-verdict-NNN.md; architecture.md; architecture/sections/*.md; architecture.drawio; architecture/adr/NNN-*.md; architecture-nfr-manifest.json; feature-dependencies.json | migration_status.yaml | architecture-closure-NNN.md | None |
| 13: Target knowledge synthesis | architecture-owner-verdict-NNN.md; architecture-closure-NNN.md; architecture.md; architecture/sections/*.md; architecture.drawio; architecture/adr/NNN-*.md; architecture-nfr-manifest.json; legacy_user_flows.xlsx; prototyping/ui-ux-approval.md; screen-manifest.json; stage-04-requirements-revision.md; ui-design-system.md; ui-design-tokens.json; feature-dependencies.json | migration_status.yaml | knowledge/bundle/**; knowledge-manifest.json; stage-13/knowledge-record.md; waivers/GATE-SCOPE.md | None |
| 14: Target knowledge control | architecture.md; architecture/sections/*.md; architecture/adr/NNN-*.md; architecture-nfr-manifest.json; knowledge/bundle/**; knowledge-manifest.json; stage-13/knowledge-record.md; ui-design-system.md; ui-design-tokens.json; feature-dependencies.json | migration_status.yaml | stage-14-pass-NNN.md | None |
| 15: Design: SDD | prototyping/ui-ux-approval.md; screen-manifest.json; architecture-nfr-manifest.json; knowledge/bundle/**; knowledge-manifest.json; ui-design-system.md; ui-design-tokens.json | migration_status.yaml; legacy_user_flows.xlsx; ui-polish-backlog.md; feature-dependencies.json | specs/NNN-*/spec.md; specs/NNN-*/plan.md; specs/NNN-*/tasks.md; specs/traceability.md; target-surface-inventory.json; stage-15/sdd-record.md; waivers/GATE-SCOPE.md | None |
| 16: Design re-verification | specs/NNN-*/spec.md; specs/NNN-*/plan.md; specs/NNN-*/tasks.md; specs/traceability.md; target-surface-inventory.json; stage-15/sdd-record.md; ui-polish-backlog.md; ui-design-system.md; ui-design-tokens.json | migration_status.yaml; feature-dependencies.json | stage-16-pass-NNN.md | None |
| 17: Build | stage-16-pass-NNN.md; specs/NNN-*/spec.md; specs/NNN-*/plan.md; specs/NNN-*/tasks.md; ui-design-system.md; ui-design-tokens.json; feature-dependencies.json | migration_status.yaml; specs/traceability.md; target-surface-inventory.json; ui-polish-backlog.md | source code; tests and measurements; data migrations; PR + pinned revision | None |
| 18: Delivery and live reconciliation | PR + pinned revision; environments.yaml; target-surface-inventory.json; prototyping/ui-ux-approval.md; screen-manifest.json; specs/NNN-*/spec.md; ui-polish-backlog.md; ui-design-system.md; ui-design-tokens.json; feature-dependencies.json | migration_status.yaml; specs/traceability.md; legacy_user_flows.xlsx | stage-18/delivery-NNN.md; raw journey + summary | None |
| 19: Slice and final acceptance | None | None | stage-19-pass-NNN.md; owner-walkthrough-NNN.md; owner-walkthrough-decline.md | stage-18/delivery-NNN.md (I); raw journey + summary (I); ui-polish-backlog.md (I); migration_status.yaml (U); legacy_user_flows.xlsx (I); target-surface-inventory.json (I); prototyping/ui-ux-approval.md (I); ui-design-system.md (I); ui-design-tokens.json (I); feature-dependencies.json (I) |
<!-- STAGE_ARTIFACT_ROLES_END -->

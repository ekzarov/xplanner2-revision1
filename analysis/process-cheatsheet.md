# Process Cheat Sheet

## How Does The Agent Know What To Do?

**Short answer: start with [MIGRATION.md](../MIGRATION.md), identify the current step from [`analysis/migration_status.yaml`](migration_status.yaml), then follow [analysis/migration_methodology.md](migration_methodology.md) to execute that step.**

- **MIGRATION.md is the main process entry point:** mandatory reading, permitted actions and routing to the active-stage procedure. AGENTS.md directs the agent there.
- **analysis/migration_status.yaml is the checkpoint:** current stage, recorded outcomes, blockers and decisions; it is state, not an instruction.
- **analysis/migration_methodology.md is the execution manual:** inputs, actions, result templates, checks and conditions for transition or return.

- **The constitution answers which rules cannot be bypassed and who may decide:** project invariants, authority, ratification and amendments. Principles do not depend on stage numbers or filenames. References and historical decision fields are process bindings, not a second stage manual.
- **The process contract defines shared roles and boundaries:** artifact access, returns and minimum closing evidence. Its [implementation map](process-contract.md#constitution-implementation-map) binds principles to the actual stages; domain guides explain exact artifact formats. [Document ownership](process-contract.md#document-ownership).

Reading first is not higher authority: the ratified constitution governs the entry point too. The agent does not choose or authorize the next stage on its own. For blind independent review, the coordinator first supplies only the permitted Phase A packet.

**What happens at each step, what does the agent read, and which artifacts change?**

A quick reading aid, not a new gate or project verdict. The process-maintenance agent regenerates it from the same flow used by the 3D view. [Full procedure](migration_methodology.md) | [File paths and descriptions](../ARTIFACTS.md) | [Governing contract](process-contract.md).

## Shared Rules

- **Portable team:** PM delegates each specialist task with the exact skill path. The receiver reads it, returns ACK, routes questions through PM and returns RESULT with evidence. BA, UX, Architect, Developer and QA are specializations, not permanent sessions. Fresh review is separate from authorship. [Required handoff protocol](agent-roles.md).

- **Reads** = inputs, not permission to change them. **Writes result** = create or populate the stage-owned result; on return, revise mutable results but create a new numbered immutable review/delivery report. **Updates shared** = read and update an existing shared artifact, only within the stage's authority.

- **Shared status:** Bootstrap creates `migration_status.yaml`; at every Stage 1-19 the coordinating agent reads it and records durable outcomes, blockers and authorized transitions. It is omitted from the lists below. Blind reviewers at 2/19 receive neutral routing first, full status only in Phase B.

- **Always:** follow MIGRATION.md and the constitution; use configured project commands and approved environment settings. Short artifact names below match 3D labels; the artifact catalog gives exact paths. Linked approved sources are part of the input, not optional background.

- **Conditional** means required when its trigger applies, not freely optional. The agent records human decisions; it never supplies owner approval. Walkthrough and explicit decline are alternatives, not two mandatory outputs.

- **On return:** correct findings, affected dependencies and all occurrences of the same mechanism; preserve valid work, not restart the stage. Widen only with recorded evidence and authority. [Correction scope](reviews/README.md#correction-scope-and-handoff).

- **Correction handoff:** record the boundary, retained work, actual checks/results and separate next control in the existing record. PM validates before accepting RESULT or requesting control. [Required handoff](reviews/README.md#correction-scope-and-handoff).

- **Control scope stays separate:** mandatory gates, including repository-wide gates, and required full/fresh/blind reviews and owner decisions remain unchanged. Stage 2 still requires full blind Phase A, saved before two-way Phase B. [Control boundary](reviews/README.md#correction-scope-and-handoff).

- **PR boundaries:** publish each completed control attempt separately from its later corrections. Required CI and owner merge precede the correction PR and the next planning control; a merged negative report is not acceptance. Preserve in-flight work. Stage 17 code peer review remains before merge. [Review And Correction PRs](migration_methodology.md#review-and-correction-prs).

- **Learned checks:** one [`error-prevention-checklist.md`](error-prevention-checklist.md), not another findings backlog. Read applicable rows before work; self-check before handoff and after fixes. Generalize confirmed repeatable mistakes, deduplicate by meaning, and record short results in the existing work record or `control.prevention_self_check`. Independent reviewers propose; the coordinator maintains; the owner may prune. Stages 2/19 open learned checks only in Phase B. [Admission and timing](error-prevention.md).

## Contents

- [Bootstrap](#cheat-bootstrap)
- [Requirements](#cheat-requirements)
- [Prototyping](#cheat-prototyping)
- [Architecture & knowledge](#cheat-architecture)
- [Design](#cheat-design)
- [Coding](#cheat-coding)
- [Deployment & QA](#cheat-delivery)

<a id="cheat-bootstrap"></a>

## Bootstrap

### [B - Bootstrap](migration_methodology.md#stage-00)

**Install the reusable process, identify the project, and authorize the first reconnaissance.** *PM / Coordinator (coordination).*

- **Role and skill:** PM / Coordinator (coordination). PM coordinates; the assigned session reads .agents/skills/migration-pm/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `AGENTS.md`; `MIGRATION.md`; `migration_methodology.md`
- **Writes result:** `constitution.md`; [`project.yaml`](../config/project.yaml); `environments.yaml`; [`bootstrap-gate-report.md`](stages/bootstrap/bootstrap-gate-report.md); [`legacy_reconnaissance.md`](legacy_reconnaissance.md); [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); [`error-prevention-checklist.md`](error-prevention-checklist.md)
- **Updates shared:** None.
- **Error prevention:** The initializer creates one empty error-prevention-checklist.md. The Bootstrap agent validates it; confirmed setup errors may supply reusable checks after admission and deduplication. [Checklist procedure](error-prevention.md).

The initializer creates empty files; the Bootstrap agent fills verified setup data. The owner ratifies the constitution and separately authorizes Stage 1.

`environments.yaml` starts unconfigured, from the safe template: no copied keys
or demo server. This can pass Bootstrap, but remote work requires owner-approved
settings and `audit:environment -- --require-configured`. Initialization leaves
the source starter read-only and never renews credential approval.

The status version must match the project constitution even before ratification.
Record failed checks and report links in `blockers[].evidence` immediately.
Summary counts come from actual evidence rows. Existing files need scoped
correction authority; upgrading a project is not reinitialization. Follow
[Bootstrap maintenance](../MIGRATION.md#bootstrap-maintenance).

<a id="cheat-requirements"></a>

## Requirements

### [1 - Reconnaissance](migration_methodology.md#stage-01)

**What does the legacy system actually do, and what evidence supports it?** *Business Analyst (responsible author).*

- **Role and skill:** Business Analyst (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Support on demand: Architect. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** [`project.yaml`](../config/project.yaml)
- **Writes result:** [`legacy_reconnaissance.md`](legacy_reconnaissance.md); [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx)
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

Read the immutable legacy source named by project.yaml. On first entry, populate the Bootstrap blanks. On return, preserve valid map/reconnaissance evidence and correct findings, affected dependencies and all occurrences of the same mechanism within the recorded impact boundary; do not restart discovery. The next Stage 2 still requires a new full in-scope blind Phase A followed by two-way Phase B.

### [2 - Control reconnaissance](migration_methodology.md#stage-02)

**Did we miss or misinterpret any legacy behavior?** *Business Analyst (fresh independent reviewer).*

- **Role and skill:** Business Analyst (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** None.
- **Phase B only:** [`legacy_reconnaissance.md`](legacy_reconnaissance.md); [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx)
- **Writes result:** `stage-02-pass-NNN.md`
- **Updates shared:** None.
- **Error prevention:** Phase A: do not open the learned checklist, its extracts or prior self-check/learning notes. Save independent observations first. Phase B: read the pinned checklist, check applicable rows and reconcile with those observations. In Checklist Review, link each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. [Checklist procedure](error-prevention.md).

Phase A: immutable legacy source and neutral scope only. Save the independent inventory before opening the filled records in Phase B.

### [3 - Live legacy walkthrough](migration_methodology.md#stage-03)

**Does the running legacy system behave as our analysis predicts?** *Business Analyst (responsible-agent verification).*

- **Role and skill:** Business Analyst (responsible-agent verification). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. PM obtains owner-approved access and runs the legacy deployment; BA verifies behavior and records the actual deployment handoff. [Delegation contract](agent-roles.md).
- **Reads:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `stage-02-pass-NNN.md`
- **Writes result:** `stage-03/walkthrough-NNN.md`; `waivers/GATE-SCOPE.md` (conditional)
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

PM requests owner-approved environment access, role accounts and permitted data/actions, then deploys or verifies the exact legacy baseline. BA records the actual operator handoff and compares live behavior with the map. Missing access blocks; fallback requires the owner. Follow [the deployment handoff](../config/REMOTE_SERVER.md#configure-before-remote-work).

### [4 - Requirements revision](migration_methodology.md#stage-04)

**Which legacy behavior do we keep, change or deliberately leave behind?** *Business Analyst (responsible author).*

- **Role and skill:** Business Analyst (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ba/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `stage-03/walkthrough-NNN.md`
- **Writes result:** `stage-04-requirements-revision.md`
- **Updates shared:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx)
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

<a id="cheat-prototyping"></a>

## Prototyping

### [5 - Application form and style](migration_methodology.md#stage-05)

**In what form and visual style should the new application work?** *UX Designer (responsible author).*

- **Role and skill:** UX Designer (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ux/SKILL.md and returns ACK before work. Support on demand: Business Analyst, Developer. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `stage-04-requirements-revision.md`
- **Writes result:** `prototyping/ui-ux-decision.md`; `ui-design-system.md`; `ui-design-tokens.json`; `waivers/GATE-SCOPE.md` (conditional)
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

### [6 - Wireframes](migration_methodology.md#stage-06)

**Which screens, states and transitions will represent the agreed behavior?** *UX Designer (responsible author).*

- **Role and skill:** UX Designer (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ux/SKILL.md and returns ACK before work. Support on demand: Business Analyst, Developer. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `prototyping/ui-ux-decision.md`; `ui-design-system.md`; `ui-design-tokens.json`
- **Writes result:** `screen-normalization.json`; `wireframes/*`; `screen-manifest.json`; `waivers/GATE-SCOPE.md` (conditional)
- **Updates shared:** `ui-design-system.md`; `ui-design-tokens.json`
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

### [7 - Wireframe control](migration_methodology.md#stage-07)

**Does the prototype cover the agreed behavior without omissions or unsupported additions?** *QA (fresh independent reviewer).*

- **Role and skill:** QA (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-qa/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `screen-normalization.json`; `wireframes/*`; `screen-manifest.json`; `ui-design-system.md`; `ui-design-tokens.json`
- **Writes result:** `stage-07-pass-NNN.md`; `ui-polish-backlog.md` (conditional)
- **Updates shared:** None.
- **Error prevention:** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Checklist procedure](error-prevention.md).

Only owner-authorized Low-cosmetic debt may remain in a closing findings pass. This exception is not clean; fixes must be verified before affected production release or acceptance.

### [8 - Wireframe approval](migration_methodology.md#stage-08)

**Does the owner approve this exact prototype as the visual baseline?** *UX Designer (responsible author).*

- **Role and skill:** UX Designer (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-ux/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `stage-07-pass-NNN.md`; `screen-manifest.json`; `wireframes/*`; `ui-polish-backlog.md` (conditional); `ui-design-system.md`; `ui-design-tokens.json`
- **Writes result:** `prototyping/ui-ux-approval.md`
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

<a id="cheat-architecture"></a>

## Architecture & knowledge

### [9 - Architecture requirements](migration_methodology.md#stage-09)

**How should the target system be structured to meet its requirements and constraints?** *Architect (responsible author).*

- **Role and skill:** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Support on demand: Business Analyst, UX Designer, Developer. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `prototyping/ui-ux-approval.md`; [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); [`legacy_reconnaissance.md`](legacy_reconnaissance.md); `stage-03/walkthrough-NNN.md`; `ui-design-system.md`; `ui-design-tokens.json`
- **Writes result:** `architecture-nfr-decision-register.xlsx`; `architecture-nfr-owner-review.md`; `architecture.md`; `architecture/sections/*.md`; `architecture.drawio`; `architecture/adr/NNN-*.md`; `architecture-nfr-manifest.json`; `waivers/GATE-SCOPE.md` (conditional); `feature-dependencies.json`
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

### [10 - Architecture control](migration_methodology.md#stage-10)

**Is the architecture consistent, justified and able to meet the requirements?** *Architect (fresh independent reviewer).*

- **Role and skill:** Architect (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `architecture-nfr-decision-register.xlsx`; `architecture-nfr-owner-review.md`; `architecture.md`; `architecture/sections/*.md`; `architecture.drawio`; `architecture/adr/NNN-*.md`; `architecture-nfr-manifest.json`; `feature-dependencies.json`
- **Writes result:** `stage-10-pass-NNN.md`
- **Updates shared:** `feature-dependencies.json`
- **Error prevention:** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Checklist procedure](error-prevention.md).

### [11 - Owner architecture review](migration_methodology.md#stage-11)

**Does the owner accept the architecture and its trade-offs, or require changes?** *Architect (responsible author).*

- **Role and skill:** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `stage-10-pass-NNN.md`; `architecture-nfr-decision-register.xlsx`; `architecture.md`; `architecture.drawio`; `architecture/adr/NNN-*.md`; `architecture-nfr-manifest.json`; `feature-dependencies.json`
- **Writes result:** `architecture-owner-verdict-NNN.md`
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

### [12 - Remark verification](migration_methodology.md#stage-12)

**Are all owner remarks from Stage 11 provably closed in the exact architecture files, without silently changing other decisions?** *Architect (responsible-agent verification).*

- **Role and skill:** Architect (responsible-agent verification). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `architecture-owner-verdict-NNN.md`; `architecture.md`; `architecture/sections/*.md`; `architecture.drawio`; `architecture/adr/NNN-*.md`; `architecture-nfr-manifest.json`; `feature-dependencies.json`
- **Writes result:** `architecture-closure-NNN.md`
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

Create a new immutable closure report; never update the owner verdict. Corrections belong to the classified return stage. The negative report is mandatory on re-entry at 9-11. With no remarks, record the unchanged set and zero required fixes.

### [13 - Target knowledge synthesis](migration_methodology.md#stage-13)

**What knowledge from the approved architecture must we pass to the next agent?** *Architect (responsible author).*

- **Role and skill:** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `architecture-owner-verdict-NNN.md`; `architecture-closure-NNN.md`; `architecture.md`; `architecture/sections/*.md`; `architecture.drawio`; `architecture/adr/NNN-*.md`; `architecture-nfr-manifest.json`; [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `prototyping/ui-ux-approval.md`; `screen-manifest.json`; `stage-04-requirements-revision.md`; `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `knowledge/bundle/**`; `knowledge-manifest.json`; `stage-13/knowledge-record.md`; `waivers/GATE-SCOPE.md` (conditional)
- **Updates shared:** None.
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

### [14 - Target knowledge control](migration_methodology.md#stage-14)

**Does the knowledge package preserve the approved architecture without omissions or distortion?** *Architect (fresh independent reviewer).*

- **Role and skill:** Architect (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `architecture.md`; `architecture/sections/*.md`; `architecture/adr/NNN-*.md`; `architecture-nfr-manifest.json`; `knowledge/bundle/**`; `knowledge-manifest.json`; `stage-13/knowledge-record.md`; `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `stage-14-pass-NNN.md`
- **Updates shared:** None.
- **Error prevention:** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Checklist procedure](error-prevention.md).

<a id="cheat-design"></a>

## Design

### [15 - Design: SDD](migration_methodology.md#stage-15)

**What exactly will we implement in the next slice, how, and how will we verify it?** *Architect (responsible author).*

- **Role and skill:** Architect (responsible author). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Support on demand: Business Analyst, UX Designer, Developer, QA. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `prototyping/ui-ux-approval.md`; `screen-manifest.json`; `architecture-nfr-manifest.json`; `knowledge/bundle/**`; `knowledge-manifest.json`; `ui-polish-backlog.md` (conditional); `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `specs/NNN-*/spec.md`; `specs/NNN-*/plan.md`; `specs/NNN-*/tasks.md`; `specs/traceability.md`; `target-surface-inventory.json`; `stage-15/sdd-record.md`; `waivers/GATE-SCOPE.md` (conditional)
- **Updates shared:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `ui-polish-backlog.md` (conditional); `feature-dependencies.json`
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. [Checklist procedure](error-prevention.md).

Read the approved sources linked by manifests. Bind the canonical dependency graph, inspect providers/consumers and declare its exact node digest and map applicable cosmetic findings to tasks; architecture/NFR manifest stays read-only.

### [16 - Design re-verification](migration_methodology.md#stage-16)

**Is the implementation plan sound, and has the owner approved its assumptions and scope?** *Architect (fresh independent reviewer).*

- **Role and skill:** Architect (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-architect/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `specs/NNN-*/spec.md`; `specs/NNN-*/plan.md`; `specs/NNN-*/tasks.md`; `specs/traceability.md`; `target-surface-inventory.json`; `stage-15/sdd-record.md`; `ui-polish-backlog.md` (conditional); `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `stage-16-pass-NNN.md`
- **Updates shared:** `feature-dependencies.json`
- **Error prevention:** Read applicable checks and independently verify the full required scope, including the author self-check. In Checklist Review, compare the author claim with actual observations. Each issue links F-NNN/B-NNN to CHK-NNN, names the discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. The reviewer does not edit the shared table. [Checklist procedure](error-prevention.md).

<a id="cheat-coding"></a>

## Coding

### [17 - Build](migration_methodology.md#stage-17)

**Is the agreed slice implemented and verified in code and tests?** *Developer (responsible author); separate Developer peer.*

- **Role and skill:** Developer (responsible author); separate Developer peer. PM coordinates; the assigned session reads .agents/skills/migration-developer/SKILL.md and returns ACK before work. Support on demand: UX Designer, QA. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. [Delegation contract](agent-roles.md).
- **Reads:** `stage-16-pass-NNN.md`; `specs/NNN-*/spec.md`; `specs/NNN-*/plan.md`; `specs/NNN-*/tasks.md`; `specs/traceability.md`; `target-surface-inventory.json`; `ui-polish-backlog.md` (conditional); `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `source code`; `tests and measurements`; `data migrations`; `PR + pinned revision`
- **Updates shared:** `specs/traceability.md`; `target-surface-inventory.json`; `ui-polish-backlog.md` (conditional)
- **Error prevention:** The implementation agent reads applicable checks before work and self-checks the candidate before handoff and after fixes. A separate peer independently checks it; Checklist Review links each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The reviewer also proposes reusable lessons. The coordinator validates and deduplicates updates; a self-check is not peer approval. [Checklist procedure](error-prevention.md).

Update task execution checkboxes and evidence as work is performed. A design change returns upstream; an owner-approved merge is not deployed proof.

<a id="cheat-delivery"></a>

## Deployment & QA

### [18 - Delivery and live reconciliation](migration_methodology.md#stage-18)

**Does the delivered version work, have we missed any behavior, and do its records agree?** *Developer (responsible-agent verification).*

- **Role and skill:** Developer (responsible-agent verification). PM coordinates; the assigned session reads .agents/skills/migration-developer/SKILL.md and returns ACK before work. Support on demand: QA. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. PM rechecks access and release authorization and runs the approved deployment; Developer owns verification/reconciliation and the delivery report. [Delegation contract](agent-roles.md).
- **Reads:** `PR + pinned revision`; `environments.yaml`; `target-surface-inventory.json`; `specs/traceability.md`; `prototyping/ui-ux-approval.md`; [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `screen-manifest.json`; `specs/NNN-*/spec.md`; `ui-polish-backlog.md` (conditional); `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `stage-18/delivery-NNN.md`; `raw journey + summary`
- **Updates shared:** `specs/traceability.md`; [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx)
- **Error prevention:** Before work, read applicable checks by stage and affected scope. Before handoff and after corrections, check the actual result and record outcomes in the working report or control.prevention_self_check. Generalize confirmed errors; the coordinator admits and deduplicates updates. Records-only attestation may append new admitted rows, but cannot alter or remove existing checks. Refinement proposals stay in the report until an authorized later revision; required checks cannot be deferred. [Checklist procedure](error-prevention.md).

PM rechecks current access and exact release/data authorization, then runs the reviewed configured deploy command. Developer owns verification/reconciliation and records the actual operator evidence. Legacy permission is not permission for new releases. Follow [the deployment handoff](../config/REMOTE_SERVER.md#configure-before-remote-work). Read-only candidate and target inventory. Include Rollback Readiness and Live Reconciliation in the delivery report. Update only governed records/checklist and bounded traceability evidence; fixes require an upstream return and a newly reviewed candidate.

### [19 - Slice and final acceptance](migration_methodology.md#stage-19)

**Has independent acceptance confirmed the result, and has the owner accepted it?** *QA (fresh independent reviewer).*

- **Role and skill:** QA (fresh independent reviewer). PM coordinates; the assigned session reads .agents/skills/migration-qa/SKILL.md and returns ACK before work. Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner. QA returns independent evidence only; PM records the owner walkthrough/decline, sign-off and authorized status changes. [Delegation contract](agent-roles.md).
- **Reads:** None.
- **Phase B only:** `stage-18/delivery-NNN.md`; `raw journey + summary`; `ui-polish-backlog.md` (conditional); [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx); `target-surface-inventory.json`; `prototyping/ui-ux-approval.md`; `ui-design-system.md`; `ui-design-tokens.json`; `feature-dependencies.json`
- **Writes result:** `stage-19-pass-NNN.md`; `owner-walkthrough-NNN.md` (conditional); `owner-walkthrough-decline.md` (conditional)
- **Updates shared:** None.
- **Error prevention:** Phase A: do not open the learned checklist, its extracts or prior self-check/learning notes. Save independent observations first. Phase B: read the pinned checklist, check applicable rows and reconcile with those observations. In Checklist Review, link each F-NNN/B-NNN issue to CHK-NNN with the author claim, observed discrepancy and required recheck. The coordinator validates and deduplicates lesson proposals. [Checklist procedure](error-prevention.md).

Phase A: deployed URL/revision, neutral routing and expectation-only extracts of map, inventory and prototype. Save observations before Phase B opens originals and checks extract completeness. Accept the slice plus all mandatory transitive dependencies; final completion separately covers the whole agreed scope.

## Before Moving On

Check the stage's [closing conditions](process-contract.md#closing-evidence): exact evidence, no required unchecked scope, the required independent review and explicit owner decision where applicable. Slice acceptance is not whole-project completion.

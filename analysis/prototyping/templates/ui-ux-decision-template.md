# Stage 5 Decision - Application Form and Style

**Which application form and visual baseline did the owner choose, and which choices remain open?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The Stage 5 agent prepares options and writes the human owner choice into the decision record.
- **Maintained / decided by:** The agent records an explicit owner-approved baseline change after a return to Stage 5.
- **Governing instructions:** Stage 5
- **When used:** At Stage 5 the agent presents options, waits for the owner's choice, then records the approved channels, application form and visual direction.
- **How used:** The approved product and visual baseline used before wireframes are drawn. It captures the chosen channels, application form, design direction, palette, theme and accessibility expectations, including alternatives or waivers the owner rejected.
- **Example:** The owner selects a responsive web application with the approved palette, so Stage 6 may design desktop and mobile screens.

**Proposal, decision and remaining work:**

- Agent proposal or previous value
- Explicit human decision tied to exact scope/version and evidence
- Applied changes versus open questions and unapplied decisions
- Authorized deferrals with responsible actor and deadline
- Dated amendments retain prior decisions

A populated document or green audit is not owner approval. Limited approval does not approve the whole system.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `pending` (the owner has not chosen); `selected` (the owner chose this option for the stated baseline); `rejected` (the option was not chosen). An agent recommendation is not a selection. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/prototyping/ui-ux-decision.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Required baseline choices have not yet been approved.
>
> **Next:** The Stage 5 agent presents options and records the owner choice for the exact baseline.
>
> **Details:** [Options Considered](#read-options-considered) / [Decision](#read-decision).

<details>
<summary><strong>Contents</strong></summary>

- [Evidence Presented](#read-evidence-presented)
- [Application Form](#read-application-form)
- [Shared UI Foundation](#read-shared-ui-foundation)
- [Style](#read-style)
- [Color Scheme](#read-color-scheme)
- [Options Considered](#read-options-considered)
- [Decision Boundary](#read-decision-boundary)
- [Open Decisions And Changes](#read-open-decisions-and-changes)
- [Decision](#read-decision)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- Date: YYYY-MM-DD
- Approved by: <project owner>
- Design baseline scope: <project or deliberately replaced channel/design-system baseline>
- Decision version: <version>

<a id="read-evidence-presented"></a>

## Evidence Presented

- Applicable parity-map rows: <ranges or references>
- User roles and channels: <references>
- Constraints and accessibility needs: <references>

<a id="read-application-form"></a>

## Application Form

- Channels: <web | mobile | desktop | terminal | multi-channel | other>
- Primary channel: <channel>
- Channel-specific responsibilities: <summary>

<a id="read-shared-ui-foundation"></a>

## Shared UI Foundation

- UI foundation SHA-256: [canonical foundation digest from ui-design-tokens.json]
- Catalogue: `analysis/prototyping/ui-design-system.md`
- Tokens: `analysis/prototyping/ui-design-tokens.json`
- Owner foundation decision: [approved choices, scope, date and actor; or pending]
- Pending library/platform compatibility: [explicit constraints for architecture]

Read [the shared UI procedure](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/ui-design-system-guide.md). The owner chooses semantic
colors/themes, typography, spacing/geometry, responsive and accessibility rules,
component source and icons. Stage 6 elaborates used variants within this foundation;
this decision does not approve unwritten screens or a finished component kit.
Run `node analysis/tools/ui-design-system.js analysis/prototyping/ui-design-tokens.json`
to obtain the digest; recording it does not constitute approval.

<a id="read-style"></a>

## Style

- Direction: <selected direction>
- References considered: <two or three references>
- Accessibility baseline: <contrast, motion, input, and assistive-technology requirements>

<a id="read-color-scheme"></a>

## Color Scheme

- Palette: <named colors and values>
- Accent colors: <values>
- Theme modes: <light | dark | both | other>

<a id="read-options-considered"></a>

## Options Considered

| Option | Benefits | Costs or risks | Owner decision |
|---|---|---|---|
| <option> | <benefits> | <costs or risks> | pending/selected/rejected |

<a id="read-decision-boundary"></a>

## Decision Boundary

The Stage 5 agent distinguishes what it proposed from what the human owner
actually selected. The populated Application Form, Style and Color Scheme
sections are proposals until the corresponding decision evidence exists.

| Topic | Agent proposal / alternatives | Explicit owner choice | State | Owner / date / decision evidence |
|---|---|---|---|---|
| <channels, form, style, palette, theme or accessibility> | <options> | <choice or pending> | pending/selected/rejected | <durable link or pending> |

<a id="read-open-decisions-and-changes"></a>

## Open Decisions And Changes

| Topic | Unresolved question or baseline change | Required decision maker | Next action | Blocks Stage 6 |
|---|---|---|---|---|
| <topic or none> | <question or exact previous-to-new baseline> | <authority> | <action and condition> | yes/no with governing reason |

The agent records the previous decision version and changed topics on a return
to Stage 5; a new draft does not overwrite the historical approval evidence.
All mandatory choices must be explicitly approved before Stage 6.

<a id="read-decision"></a>

## Decision

<State the owner's explicit decision and rationale.>

This is a human decision. Stage 6 does not begin until this record is complete
and explicitly approved.

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

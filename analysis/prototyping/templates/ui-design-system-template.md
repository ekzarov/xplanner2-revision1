# UI Design System

**Which shared element and variant should each screen use, in which states, and with which approved visual rules?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Question answered:** **Which shared element and variant should each screen use, and where can I see its states?**
- **Created by:** The Stage 5 agent drafts the UI foundation and records the human owner choice.
- **Maintained / decided by:** The Stage 6 prototyping agent develops used variants and extensions within that foundation; the owner approves the exact combined baseline at Stage 8. Downstream agents read it without edits.
- **Governing instructions:** Stages 5-9 and 13-19; analysis/prototyping/ui-design-system-guide.md.
- **When used:** Stage 5 drafts the foundation; Stage 6 updates the catalogue while drawing and declares used variants per screen. Stage 7 checks actual exports against it, Stage 8 approves the combined manifest. Stages 9 and 13-19 consume relevant pinned UI sources read-only; Stage 19 full sources are Phase B only. Required only for visual scope.
- **How used:** The readable UI kit: stable variant IDs, purposes, applicable states, property-to-token bindings, visual examples and usage/accessibility rules. It is developed alongside representative screens, not guessed afterwards from screenshots. The owner-approved foundation and exact completed baseline remain separate decisions.
- **Example:** Illustrative: task editing and story editing both use input.date with the same focus/error behavior. Stage 15 names that variant; Stage 17 implements one shared date control rather than two guessed versions.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Template: not yet assessed**
>
> Foundation approval, actual component coverage and independent verification are not yet recorded.
>
> **Next:** The Stage 5 agent records the chosen foundation; Stage 6 develops the kit with screens, Stage 7 verifies it and Stage 8 records exact owner approval.
>
> **Details:** [Components](#read-components) / [Coverage And Open Decisions](#read-coverage-and-open-decisions).

<details>
<summary><strong>Contents</strong></summary>

- [Ownership And Baseline](#read-ownership-and-baseline)
- [Foundation](#read-foundation)
- [Components](#read-components)
- [Layout And Interaction Rules](#read-layout-and-interaction-rules)
- [Coverage And Open Decisions](#read-coverage-and-open-decisions)
- [Review And Change History](#read-review-and-change-history)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-ownership-and-baseline"></a>

## Ownership And Baseline

Template output: `analysis/prototyping/ui-design-system.md`.

- Created by: [Stage 5 agent; identity/date]
- Maintained by: [Stage 6 prototyping agent; identity/date]
- Foundation decision: `ui-ux-decision.md` [exact version]
- Values: `analysis/prototyping/ui-design-tokens.json`
- Export set: [version; full source hashes in screen-manifest.json]
- Approved by: [owner/date and ui-ux-approval.md, or explicitly not yet approved]

Follow [the shared UI procedure](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/prototyping/ui-design-system-guide.md). At Stage 5 this
is a proposed foundation; at Stage 6 it describes the actual exported kit.
`audit:prototype` checks pins/references; Stage 7 checks the rendered meaning;
Stage 8 approves the exact set. Stages 15-19 consume it without editing it.

<a id="read-foundation"></a>

## Foundation

Explain the selected library/icon set, color meanings and themes, typography
hierarchy, spacing/control geometry, breakpoints and accessibility expectations.
Refer to named tokens instead of repeating raw values. Identify approved choices
separately from pending library/platform compatibility or other decisions.

<a id="read-components"></a>

## Components

| Variant | Purpose | States | Tokens | Preview | Usage and accessibility |
|---|---|---|---|---|---|
| [stable variant ID] | [actual use] | [default; focus; other applicable states] | [property=token.name; property=token.name] | [wireframes/component-sheet.html#variant] | [behavior, keyboard/label rules and reasons for non-applicable states] |

<a id="read-layout-and-interaction-rules"></a>

## Layout And Interaction Rules

- Layout/responsive rules: [shared grids, alignment, breakpoint token references]
- Typography/content: [heading/body/label token names, wrapping/truncation rules]
- Navigation and overlays: [shared patterns, keyboard/focus restoration]
- Feedback: [validation, errors, loading, empty, success and disabled behavior]
- Themes/accessibility: [mode mapping, contrast evidence, focus visibility]

<a id="read-coverage-and-open-decisions"></a>

## Coverage And Open Decisions

| Scope or question | Established result | Gap / not checked | Next action and owner |
|---|---|---|---|
| [screen/variant/state] | [what exports demonstrate] | [remaining obligation or none] | [responsible actor and return stage when needed] |

<a id="read-review-and-change-history"></a>

## Review And Change History

| Version/date | Changed scope and reason | Foundation changed? | Review / owner decision |
|---|---|---|---|
| [version] | [actual change] | [yes: return 5; no: within 6] | [exact records or pending] |

Do not overwrite approval history. A missing variant is a design task, not
permission for a downstream agent to invent a new visual convention.

**Reading statuses:** draft means not approved; checked means only the recorded scope was examined; approved requires the exact Stage 8 owner decision. A hash match is not visual correctness. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

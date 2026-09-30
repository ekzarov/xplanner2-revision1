# Source Intake Decision 001

**Which owner decisions admit the upstream XPlanner+ source, exactly as given, and how were they received?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** the owner `ekzarov` decides. PM records the decisions verbatim and does not change them.
- **Governing instructions:** [Source Readiness](../MIGRATION.md#source-readiness), constitution amendment A4 and [`analysis/source-assessment-001.md`](source-assessment-001.md).

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **The owner approved amendment A4 and the exact fallback assessment `source-assessment-001`**
>
> - **Amendment A4 and the bounded return:** approved by the owner directly in the PM chat.
> - **The exact fallback and the placement of the sources outside Git:** approved by the owner in the Codex chat and relayed by Codex with a verbatim quote. The owner is asked to confirm the relayed decision in the PM chat.
>
> **Next:** the BA reconciles the 210 existing rows. No live run and no new control pass.
>
> **Details:** [Decisions](#read-decisions) / [Binding](#read-binding).

<details>
<summary><strong>Contents</strong></summary>

- [Decisions](#read-decisions)
- [Binding](#read-binding)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-decisions"></a>

## Decisions

| Decision | Exact owner words | Channel and time |
|---|---|---|
| Amendment A4 and the bounded return to Stage 1 | «Одобряю предложенную тобой поправку A4 и ограниченный возврат для сверки всех 210 существующих строк по исходникам и WAR. Ограничения соответствия сохраняются, при расхождениях WAR остаётся главным.» | PM chat, 2026-09-30, direct from the owner |
| Fallback approval and source placement | «Одобряю слияние PR #29 и подготовленный пакет source-assessment-001. Исходники остаются вне Git, CI восстанавливает разрешённые файлы с проверкой хешей. Разрешаю BA сверить существующие 210 строк по исходникам и WAR. После отчёта и PR остановиться, живой прогон и новый контроль не запускать.» | Codex chat, relayed verbatim by Codex to the PM chat. Codex recorded it at 2026-09-30T11:01:28Z. The same decision appears in PR #29 comment 5909863061, created at 2026-09-30T11:02:15Z from the account `ekzarov`. |

The relayed decision is PM-verified against the exact package that was shown: assessment SHA-256 `cd68565d649826770d8a94d6d0a594ddd003ab1ce9d74c15742104cbeb1a95fa` and scope `source-intake:b1c6f67d93e46477d0b2b5ff942ce88b4cf9189810c1fef3aae3c804a62622bd`. The owner is asked to confirm it in the PM chat before this change is merged.

<a id="read-binding"></a>

## Binding

- **Fallback decision ID:** `source-intake-fallback-001:xplanner2-revision1`.
- **Scope:** the value printed by `sourceIntakeScope(source_intake)` for [`config/project.yaml`](../config/project.yaml).
- **What the fallback approves:** `classification: partial`, `baseline_match: unverified`, with the baseline WAR authoritative.
- **Sources in CI:** only the 1078 allowlisted files, restored with SHA-256 verification. The 39 withheld files are never fetched.
- **What it does not authorize:** a live Stage 3 run, a new Stage 2 control, or any merge of a future pull request.

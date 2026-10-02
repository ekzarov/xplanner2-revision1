# Stage 3 Fallback Decision: Walkthrough 001

**Which unexecuted Stage 3 sub-checks are waived for entry into Stage 4, who decided it, and what stays unverified?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** Codex decided, as the coordinating operator, under the owner's delegation until the completion of Stage 4 (`operational-mandate-stage4-completion:xplanner2-revision1`). This is not a personal owner approval.
- **Governing instructions:** the Stage 3 fallback rule in [the methodology](../../migration_methodology.md#stage-03) and [MIGRATION.md](../../../MIGRATION.md); [the walkthrough](./walkthrough-001.md); [the project departure](../../maintenance/process-departure-2026-09-30-operational-mandate.md).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Stage 3 outcome `blocked-waived`: 24 residual sub-check items stay unverified; Stage 4 may start, Stage 5 may not**
>
> The live walkthrough W001 accounts for all 210 business rows: 110 live-verified, 75 difference, 25 partially verified. In the partially verified rows, the remaining sub-checks were not executed. Some were stopped by the agent safety filter. Others need a global state change, access outside the grant, or a database-level fact. Codex chose `blocked-waived`, not simulation and not a claim of full live verification. The waived sub-checks stay unverified. No stopped action is retried, and no finding is called fixed.
>
> **Next:** Stage 4 requirements revision. Before the target behavior for any waived sub-check is accepted, it must be verified on the target system. The next applicable independent control receives a `clean` pass that verifies this waiver.
>
> **Details:** [Decision](#read-decision) / [Waived Scope](#read-waived-scope) / [Conditions](#read-conditions).

<details>
<summary><strong>Contents</strong></summary>

- [Decision](#read-decision)
- [Waived Scope](#read-waived-scope)
- [Not Waived](#read-not-waived)
- [Conditions](#read-conditions)
- [Residual Risk](#read-residual-risk)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-decision"></a>

## Decision

- **Gate:** `waiver:legacy_walkthrough_fallback:xplanner2-revision1`.
- **Outcome:** `blocked-waived`.
- **Permitted next stage:** `stage-04` only.
- **Decided by:** Codex, citing the owner's delegation `operational-mandate-stage4-completion:xplanner2-revision1`. The owner's words, relayed by Codex: «пока сделаем паузу по изменению процесса. вернись к клоду и продолжайте процесс вместе меня. бери управление. ошибки в процессе записывай и потом к ним вернемся. сейчас самое главнео пройти 4 шаг. я так понимаю тертий уже закончен. если нет - закнчивай. даю тебе полные права по общению с ним и на утверждение. просто потом выдашь мне отчет что было сделано короткой. не заюбудь попросить его стартер обновить себе. начинай вы оба открыты».
- **Codex's choice** (relayed): admit Stage 4 with the exact remainder of unverified W001 sub-checks. Do not retry actions that the safety filter stopped. Choose `blocked-waived`, not simulate, and not `live-verified` for the whole scope. Do not declare unverified items or found errors fixed. Keep every observation, and verify the target behavior before it is accepted.

<a id="read-waived-scope"></a>

## Waived Scope

These are exactly the residual items of class (d) and (e) in the [walkthrough's Residual Unverified Scope](./walkthrough-001.md#read-residual-unverified-scope), R-24 to R-47. Each item names its rows, the sub-check left unexecuted, and the reason.

| Items | Rows | Why the sub-check was not executed |
|---|---|---|
| R-24..R-28 (class d) | 76, 101, 69/70/71/149, 189, 37 | Ordinary actions on synthetic data. The agent safety filter stopped the session, and the actions were not retried by any route. |
| R-29..R-32 | 62, 112, 94, 205 | Global test utilities and two global properties. Rows 62 and 112 are also "candidate outside the core". |
| R-33 | 69, 186 | A fresh application restart, needed for the first-requester locale. |
| R-34 | 34 | Access outside the agreed bounds; stopped by the safety filter. |
| R-35..R-47 | 31, 193, 47, 64, 80, 82/91/126, 32, 60, 61/63, 66/73, 67/68, 21, 189 | Database-level, log-level or server-file facts, or global or administrative state, as each item states. |

In most of these rows the main steps were observed live. Only the named sub-checks are waived; the observed parts of the rows keep their live evidence.

<a id="read-not-waived"></a>

## Not Waived

- **Items R-01..R-23** of the residual table: they were resolved by the follow-up checks, or the behavior was observed live as unavailable (class c). Neither is part of the waiver.
- **The 54 W001 findings and the 7 open pass-013 findings:** they stay findings, not fixed.
- **Untouched by this decision:** independent review verdicts, secrets, access beyond the existing Stage 3 grant, and any bypass of a safety-filter stop.
- **Stage 5:** not permitted.

<a id="read-conditions"></a>

## Conditions

1. **Verify on the target before acceptance.** The target behavior for every waived sub-check is verified on the target system before it is accepted. A Stage 4 requirement that rests on a waived sub-check is marked as resting on unverified legacy behavior.
2. **Clean control of the waiver.** The next applicable independent control receives a `clean` pass that verifies this waiver and links to this record. That pass confirms that no applicable unwaived scope was omitted.
3. **Resume if access returns.** If the live environment becomes usable for these sub-checks without the stopped actions, Stage 3 may be resumed for them. Any difference found then loops back to Stage 1.

<a id="read-residual-risk"></a>

## Residual Risk

- **Unverified legacy behavior.** For 24 residual items, a legacy behavior stays unverified live, for example a hidden project seen by a reader with a role, other session locales, global test utilities and some database-level effects. If a target requirement copies a mapped claim that was wrong in one of these sub-cases, the error surfaces only in target verification.
- **Delegated decision.** The waiver was decided by a delegated operator, not by the owner in person.

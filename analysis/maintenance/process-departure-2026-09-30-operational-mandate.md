# Process Departure 2026-09-30: Operational Mandate Until Stage 4 Entry

**What authority did the owner hand to the coordinating agent, where does it end, and what stays with the owner?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** The owner `ekzarov` decides and may revoke at any time. PM records the mandate. The actual operator of merges under it is Codex, the coordinating agent.
- **Governing instructions:** constitution Governance, which lets a project record a decision to use a different process if it identifies the departure and does not claim full conformance.

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Project departure: until Stage 4 entry the owner has delegated operations and the decisions needed to reach Stage 4 to the coordinating operator Codex**
>
> The constitution says that owner gates and owner-only merge authority "cannot be delegated to agents". The owner instructed otherwise for a bounded period, first for technical merges and routine operations, then (expansion, 2026-09-30T19:16:33Z) for the decisions needed to reach Stage 4. For that period the project does not claim conformance with this invariant. A decision taken under the delegation names Codex as the decider and cites the delegation; it is never recorded as the owner's personal approval. Independent verdicts, secrets, infrastructure access beyond the existing grant, other stacks, waivers, Stage 4 business decisions and Stage 5 are **not** delegated.
>
> **Next:** the delegation ends at entry to Stage 4, or earlier if the owner revokes it.
>
> **Details:** [Owner Words](#read-owner-words) / [Bounds](#read-bounds) / [Attribution](#read-attribution).

<details>
<summary><strong>Contents</strong></summary>

- [Owner Words](#read-owner-words)
- [Bounds](#read-bounds)
- [Attribution](#read-attribution)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-owner-words"></a>

## Owner Words

- **Relay 1:** approval of PR #31 at `35d871f`, and of one independent correction-validation pass assessing root 006 / previous 009 after A4. The pass stops on an unsuitable baseline or on blocking findings; after `clean`, Stage 3 resumes in the authorized isolated environment. The owner's answer: «разрешаю».
- **Relay 2:** «вообще я бы тебе отдал пока полный контроль до 4 шага чтобы ты меня не спрашивал больше и делал все сам».
- **Relay 3 (expansion):** «передаю тебе упралдвение и иду спать. сделай что можешь с клодом. и не надо меня спрашивать про пождтвержление до 4 фазі. принмай на свой расчет и я тее доверяю до 4 стейджа». Relayed by Codex, recorded at 2026-09-30T19:16:33Z and posted as [PR #35 comment 5918018266](https://github.com/ekzarov/xplanner2-revision1/pull/35#issuecomment-5918018266) from the account `ekzarov` at 2026-09-30T19:17:14Z. The exact owner-chat time is not known to PM. The owner did not personally review the decisions Codex then took.
- **Provenance of relays 1 and 2:** both statements were relayed by Codex from the Codex chat, with a verbatim handoff recorded at 2026-09-30T13:31:30Z. The same text is in PR #31 comment 5912342979, created at 2026-09-30T13:32:12Z from the account `ekzarov`. PR #31 was merged by Codex on relay 1 (merge `90977b1055c17ee4e0aebd629cf3abbe360950d4`, 2026-09-30T13:30:57Z).

<a id="read-bounds"></a>

## Bounds

| Delegated, until Stage 4 entry | Not delegated |
|---|---|
| Since the expansion: the decisions needed to reach Stage 4, taken by Codex on its own responsibility, for example incident-assessment acceptance and the low-only Stage 2 carryover under the existing project rule and its safeguards | Waivers, Stage 4 business and product decisions, Stage 5, and any decision presented as the owner's personal approval |
| Coordination, routine checks and technical PRs, and their merge by the operator Codex once the required local checks, CI and any required independent review have passed on the exact HEAD | Independent review verdicts: only an eligible fresh reviewer decides them, and a failed or unexecuted check is never reported as passed |
| Stage 3 tests already authorized, in the isolated `xplanner2-revision1` environment, within the existing Stage 3 grant | New infrastructure access, publication of secrets, or any change to other stacks |
| Recording evidence and status for these steps | New material risks, waivers or owner-reserved decisions: the Stage 2 carryover of new findings, a Stage 3 fallback waiver, Stage 4 requirements and product decisions, Stage 5 |

Every PR merged under this mandate states in its description that it was merged under this departure. Historical decisions and the constitution text are unchanged.

<a id="read-attribution"></a>

## Attribution

A decision taken under the delegation is recorded in `owner_decisions` like this:
- `decided_by: 'Codex'` names the real decider;
- `delegated_authority.authority_decision_id` cites the owner's delegation `operational-mandate-expansion-until-stage-04:xplanner2-revision1`, whose `delegation` names the delegate and `ends_at_stage: stage-04`.

The project tool [`delegated-authority.js`](../tools/delegated-authority.js) accepts such a decision only when all of these hold:
- the delegation was decided by the owner in person and approved;
- the delegate matches;
- the decision is at or after the delegation and before any transition into Stage 4 or later;
- the decision is not a waiver.

The status, incident and carryover validators use this rule instead of requiring `decided_by` to equal the owner. All other checks, including the blocking-class and coverage safeguards of the carryover rule, are unchanged. This is a project hook, not a Starter change; tests are in [`delegated-authority.test.js`](../tools/delegated-authority.test.js).

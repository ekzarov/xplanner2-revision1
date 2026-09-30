# Process Departure 2026-09-30: Operational Mandate Until Stage 4 Entry

**What operational authority did the owner hand to the coordinating agent, where does it end, and what stays with the owner?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** The owner `ekzarov` decides and may revoke at any time. PM records the mandate. The actual operator of merges under it is Codex, the coordinating agent.
- **Governing instructions:** constitution Governance, which lets a project record a decision to use a different process if it identifies the departure and does not claim full conformance.

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Project departure: technical PR merges and routine operations run under a relayed owner mandate until Stage 4 entry**
>
> The constitution says that owner gates and owner-only merge authority "cannot be delegated to agents". The owner instructed otherwise for a bounded period. That instruction was relayed by Codex; the owner's account posted it as a comment on PR #31. For that period the project does not claim conformance with this invariant. Independent verdicts, new material risks, secrets, infrastructure access and Stage 4 business decisions are **not** delegated.
>
> **Next:** the mandate ends at entry to Stage 4, or earlier if the owner revokes it.
>
> **Details:** [Owner Words](#read-owner-words) / [Bounds](#read-bounds).

<details>
<summary><strong>Contents</strong></summary>

- [Owner Words](#read-owner-words)
- [Bounds](#read-bounds)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-owner-words"></a>

## Owner Words

- **Relay 1:** approval of PR #31 at `35d871f`, and of one independent correction-validation pass assessing root 006 / previous 009 after A4. The pass stops on an unsuitable baseline or on blocking findings; after `clean`, Stage 3 resumes in the authorized isolated environment. The owner's answer: «разрешаю».
- **Relay 2:** «вообще я бы тебе отдал пока полный контроль до 4 шага чтобы ты меня не спрашивал больше и делал все сам».
- **Provenance:** both statements were relayed by Codex from the Codex chat, with a verbatim handoff recorded at 2026-09-30T13:31:30Z. The same text is in PR #31 comment 5912342979, created at 2026-09-30T13:32:12Z from the account `ekzarov`. PR #31 was merged by Codex on relay 1 (merge `90977b1055c17ee4e0aebd629cf3abbe360950d4`, 2026-09-30T13:30:57Z).

<a id="read-bounds"></a>

## Bounds

| Delegated, until Stage 4 entry | Not delegated |
|---|---|
| Coordination, routine checks and technical PRs, and their merge by the operator Codex once the required local checks, CI and any required independent review have passed on the exact HEAD | Independent review verdicts: only an eligible fresh reviewer decides them, and a failed or unexecuted check is never reported as passed |
| Stage 3 tests already authorized, in the isolated `xplanner2-revision1` environment, within the existing Stage 3 grant | New infrastructure access, publication of secrets, or any change to other stacks |
| Recording evidence and status for these steps | New material risks, waivers or owner-reserved decisions: the Stage 2 carryover of new findings, a Stage 3 fallback waiver, Stage 4 requirements and product decisions, Stage 5 |

Every PR merged under this mandate states in its description that it was merged under this departure. Historical decisions and the constitution text are unchanged.

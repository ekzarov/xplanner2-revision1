# Process Departure 2026-09-30: Operational Mandate Until Stage 4 Entry

**What authority did the owner hand to the coordinating agent, where does it end, and what stays with the owner?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** The owner `ekzarov` decides and may revoke at any time. PM records the mandate. The actual operator of merges under it is Codex, the coordinating agent.
- **Governing instructions:** constitution Governance, which lets a project record a decision to use a different process if it identifies the departure and does not claim full conformance.

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Project departure: until the completion of Stage 4 the owner has delegated operations, the decisions needed to reach and pass Stage 4, the Stage 3 fallback and Stage 4 product decisions to the coordinating operator Codex**
>
> The constitution says that owner gates and owner-only merge authority "cannot be delegated to agents". The owner instructed otherwise for a bounded period, first for technical merges and routine operations, then (expansion, 2026-09-30T19:16:33Z) for the decisions needed to reach Stage 4. For that period the project does not claim conformance with this invariant. A decision taken under the delegation names Codex as the decider and cites the delegation; it is never recorded as the owner's personal approval. Under the earlier mandates (until Stage 4 entry), independent verdicts, secrets, infrastructure access beyond the existing grant, other stacks, waivers, Stage 4 business decisions and Stage 5 are **not** delegated. Since the extension of 2026-10-02, until the completion of Stage 4, the Stage 3 `legacy_walkthrough_fallback` waiver and Stage 4 product decisions are delegated; independent verdicts, secrets, access beyond the existing grant, other stacks, safety-filter bypasses, any other waiver and Stage 5 stay **not** delegated.
>
> **Next:** the 2026-10-02 delegation ends at the completion of Stage 4 (entry into Stage 5, which it does not permit), or earlier if the owner revokes it. The earlier delegations keep their own end (entry into Stage 4) and are not extended.
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
- **Relay 4 (2026-10-02, until the completion of Stage 4):** «пока сделаем паузу по изменению процесса. вернись к клоду и продолжайте процесс вместе меня. бери управление. ошибки в процессе записывай и потом к ним вернемся. сейчас самое главнео пройти 4 шаг. я так понимаю тертий уже закончен. если нет - закнчивай. даю тебе полные права по общению с ним и на утверждение. просто потом выдашь мне отчет что было сделано короткой. не заюбудь попросить его стартер обновить себе. начинай вы оба открыты». Relayed by Codex in the Claude Code session on 2026-10-02; Codex stated that it covers exactly the Stage 3 `legacy_walkthrough_fallback` and the Stage 4 product decisions, ending at the completion of Stage 4. The exact owner-chat time is not known to PM; the decision records the relay recording time.
- **Relay 5 (2026-10-03, PR merge pre-authorization):** «Даю добро на слитие пиаров ближайших 10 и бери снова управление с Клодом и работайте». Relayed by Codex from the owner's direct message; recorded by PM at `2026-10-03T13:34:59Z`. A human pre-authorization to merge the next 10 relevant XPlanner PRs, each only after the required local checks, CI on the exact HEAD and any required independent review have passed. It does not delegate owner gates or final acceptance and is not a Stage 8 approval. **Merges counted:** 1/10: PR #46 by Codex at exact HEAD `e50304365b160d377de848da187d6eddc774c1cc` (Ubuntu and Windows CI success), merge commit `1fdf554818549abf9479f9373f303261712ceddc`, `2026-10-03T13:32:42Z`. 2/10: PR #47 (narrow project fix of the methodology link audit scope) by Codex at exact HEAD `2a56238d1c5f1c02f6e116cedac76c87a7b28cc0` (Ubuntu and Windows CI success, run 37126979009), merge commit `bd3e2a8c1c15ad7b1ddba8f11725a8da4dce38ea`, `2026-10-03T13:43:21Z`. 3/10: PR #48 (prototype audit: verified Stage 4 deferred_rows) by Codex at exact HEAD `640d694e1a08babc0bdb5d4a26d6dadf6ff915fd` (Ubuntu and Windows CI success, run 37128455824), merge commit `8429420fd3e3c9e098b872a3f741f26cecbbac18`, `2026-10-03T14:09:30Z`. 4/10: PR #49 (Stage 6 wireframe package) by Codex at exact HEAD `23e96ebb9bcceec7e99b6589c240d0eecd52a9cb` (Ubuntu and Windows CI success, run 37129587231), merge commit `c0819271dc332b1b47c233d7872bd1c85f177f6d`, `2026-10-03T14:29:21Z`; not a clean Stage 7 result and not Stage 8 approval. 5/10: PR #50 (Stage 7 pass 001 records) by Codex after exact-head CI success, merge commit `981583af62106044449ed42c4c135630718fc21b`, `2026-10-03T14:58:27Z`. 6/10: PR #51 (status-validator waiver-window fix, independent tool review T51 clean) by Codex at exact HEAD `73866be41b458ea9d3643cd1fea54de2193e3cbb` (Ubuntu and Windows CI success, run 37131611408), merge commit `acb5a0fe44f6306395d32686d2925ed83aaec735`, `2026-10-03T15:04:53Z`. 7/10: PR #52 (Stage 6 correction of Stage 7 pass 001 findings) by Codex at exact HEAD `8f41105203c48b400607547b0b1804da9d9e5720` (Ubuntu and Windows CI success, run 37300438564; post-merge main run 37300697838 success), merge commit `8a610c307aa56461fcb9055fb1b8704cb90c1a88`, `2026-10-05T11:05:28Z`; not a clean Stage 7 result and not Stage 8 approval. Each later merge under this relay is appended here with its PR, exact HEAD, CI and merge commit.
- **Provenance of relays 1 and 2:** both statements were relayed by Codex from the Codex chat, with a verbatim handoff recorded at 2026-09-30T13:31:30Z. The same text is in PR #31 comment 5912342979, created at 2026-09-30T13:32:12Z from the account `ekzarov`. PR #31 was merged by Codex on relay 1 (merge `90977b1055c17ee4e0aebd629cf3abbe360950d4`, 2026-09-30T13:30:57Z).

<a id="read-bounds"></a>

## Bounds

| Delegated | Not delegated |
|---|---|
| Earlier mandate, since the expansion of 2026-09-30, until Stage 4 entry: the decisions needed to reach Stage 4, taken by Codex on its own responsibility, for example incident-assessment acceptance and the low-only Stage 2 carryover under the existing project rule and its safeguards | Under this earlier mandate: waivers, Stage 4 business and product decisions, Stage 5, and any decision presented as the owner's personal approval (bounds before the 2026-10-02 extension) |
| Since 2026-10-02, until the completion of Stage 4: the Stage 3 fallback waiver `legacy_walkthrough_fallback` with the Stage 3 to Stage 4 transition approval, and Stage 4 product decisions (keep, change, do not port), taken by Codex | Stage 5; any other waiver; independent review verdicts; secrets; access beyond the existing Stage 3 grant; any bypass of a safety-filter stop |
| Earlier mandate (and continued): coordination, routine checks and technical PRs, and their merge by the operator Codex once the required local checks, CI and any required independent review have passed on the exact HEAD | Independent review verdicts: only an eligible fresh reviewer decides them, and a failed or unexecuted check is never reported as passed |
| Stage 3 tests already authorized, in the isolated `xplanner2-revision1` environment, within the existing Stage 3 grant | New infrastructure access, publication of secrets, or any change to other stacks |
| Recording evidence and status for these steps | Under the first mandate (before the expansions): new material risks, waivers or owner-reserved decisions such as the Stage 2 carryover of new findings, a Stage 3 fallback waiver, Stage 4 requirements and product decisions, and Stage 5. Since 2026-10-02 the Stage 3 fallback waiver and Stage 4 product decisions are delegated (row above); Stage 5 is still not |

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

**Extension 2026-10-02.**
- **Delegation record.** The new delegation `operational-mandate-stage4-completion:xplanner2-revision1` names the one waiver gate it covers, `delegation.waivers: [legacy_walkthrough_fallback]`, with `ends_at_stage: stage-05`.
- **What the checker accepts.** [`delegated-authority.js`](../tools/delegated-authority.js) now accepts a delegate's `waiver:` decision only when the cited delegation names that gate; the schema allows only `legacy_walkthrough_fallback`. It accepts a delegate's transition `owner_approval`, with `delegated_authority`, only for the Stage 3 to Stage 4 fallback transition under that named gate.
- **Unchanged.** Every other waiver stays owner-only, every other transition approval stays with the owner in person, and the earlier delegations are unchanged.

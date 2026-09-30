# Stage 2 Live-Check Carryover: Pass 012

**Which open Stage 2 pass 012 findings are carried into a Stage 3 live check or accepted as residual risks, and why is none of them blocking?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, under the project rule `stage-02-live-carryover`.
- **Maintained / decided by:** PM maintains this record. The carryover was decided by Codex, the coordinating operator, under the owner's delegation until Stage 4 (`operational-mandate-expansion-until-stage-04`). It is not a personal owner approval of this record. The Stage 3 BA records the live outcome.
- **Governing instructions:** [the carryover departure record](../../maintenance/process-departure-2026-09-30-stage2-live-carryover.md), [the operational mandate and its expansion](../../maintenance/process-departure-2026-09-30-operational-mandate.md) and [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Three low Stage 2 findings stay open: one becomes a Stage 3 live check, two are accepted documentation risks, and nothing is renamed `clean`**
>
> Pass 012 returned `findings` F-001..F-003, all low. F-003 is carried into a concrete live check of the time editor's date display and Insert Time under different session locales. F-001 and F-002 are accepted as bounded residual risks on the accuracy of documented counts. No Stage 1 correction or pass 013 precedes Stage 3.
>
> **Next:** the Stage 3 BA runs the F-003 live check in the existing isolated environment and records expected versus observed behavior and the affected rows. A plan is not a pass; an unresolved item stays open into Stage 4.
>
> **Details:** [Binding](#read-binding) / [Carried Findings](#read-carried-findings) / [Blocking-Class Check](#read-blocking-class-check).

<details>
<summary><strong>Contents</strong></summary>

- [Binding](#read-binding)
- [Carried Findings](#read-carried-findings)
- [Blocking-Class Check](#read-blocking-class-check)
- [Residual Risk](#read-residual-risk)
- [Checklist Proposals](#read-checklist-proposals)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-binding"></a>

## Binding

- Carryover session: a1d8c39bcc8758c6c
- Carryover report SHA-256: 389f18dbde908896ab9e12dc200c301fdd07c1176d9f54d59d8ab4594d2c53fe

These lines bind the carryover to:
- **The pass:** pass 012, report [`analysis/reviews/stage-02-pass-012.md`](../../reviews/stage-02-pass-012.md), `result: findings`, `findings_severity_max: low`.
- **Its incident assessment:** [`incident-assessment.md`](../../reviews/evidence/S02-P012/incident-assessment.md), `543b0e0e…`. It was accepted as non-material by Codex under the delegation; PM's support check is in [`pm-incident-verification.json`](../../reviews/evidence/S02-P012/pm-incident-verification.json).
- **Its recovery chain:** root 006, previous 011, coverage base 010 (incident assessment owner-approved), excluded 011.

The Stage 1 records carried are those reviewed by pass 012 at `2c176d4`: [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) (210 rows).

<a id="read-carried-findings"></a>

## Carried Findings

| Finding | What is inaccurate in the records | Carried as | Stage 3 check or accepted risk |
|---|---|---|---|
| F-003 (low): time-editor dates | The Q3 registry sentence and the reading block say the time and task editors "show" dates with the static converters. The session-locale consumer lists omit the time editor's display and Insert Time. E69 generalizes; the H89 note names date-time patterns. Per the review, `UpdateTimeAction#populateForm` shows the dates in the session locale, Insert Time uses the session bundle's `format.datetime`, and only `TimeEditorForm#valideRow` validates with the server-default converters. | **Live check** | In the isolated environment, sign in as a demo user and open the time editor of a task. Do this once per session locale, in two separate sessions with different locales (`language` parameter or `Accept-Language`, for example `en` and `de`). In each session, record: the displayed format of existing start, end and report dates; the value Insert Time fills in; and whether saving an entry typed in the displayed format keeps the same date and duration. Expected per the review: display and Insert Time follow the session locale, while validation follows the server default. A date whose day and month swap between the patterns may be misread or rejected. Record expected versus observed behavior per locale, and the affected rows 69, 70, 71 (note), 89 (note) and 149-160. |
| F-001 (low): counting rules M and S | Rule M's exclusion sets overlap, so applied as written it leaves 4607 methods (4605 found), not 4597. Rule S excludes Class loads from String-load entries; the String loads number 3482, or 3364 without empty strings, not 3386. | **Accepted risk** | None; a static count cannot be checked live. The documented figures stay inaccurate until a later record correction. The correct figures and their limits are in the sealed review. |
| F-002 (low): script-context rule | The restated rule gives 81 outputs, not 78; the 3 extra outputs are in the `exportLinks.jsp:34-39` handler. The substantive result, 2 request values in script contexts, is unaffected. | **Accepted risk** | None; a static count cannot be checked live. |

The parity map is not silently corrected. A record correction for F-001..F-003 may follow from the live results or from a later bounded correction under the process. It is not claimed as done.

<a id="read-blocking-class-check"></a>

## Blocking-Class Check

PM attests `blocking_class_check: confirmed` on this basis. None of the findings falls into a class the project rule never carries:

- **Reviewer independence or eligibility:** not affected. Pass 012 is a fresh reviewer's attempt with recovery verified. Its incidents were accepted as non-material, with all five safeguards verified.
- **Baseline source identity or provenance:** not affected. The legacy source set is identical across root, base and candidate, and all three findings concern record wording or counts.
- **Missing or unchecked coverage:** none. The reconciliation is 602 = 76 rechecked + 526 retained + 0 uncovered, with no `unchecked_scopes`.
- **Credential or secret exposure:** none. The CHK-009 scan counts 0 credential values in the change set and the new evidence.
- **Safe or isolated launch:** none of the findings changes how the legacy baseline starts or is isolated.
- **Systemic or unbounded impact:** none. The reviewer bounded F-003 by a call-site scan over all 594 classes, and F-001 and F-002 to named figures.
- **Severity above low:** none.

<a id="read-residual-risk"></a>

## Residual Risk

- The reconnaissance keeps two known low inaccuracies in documented counts until they are corrected: F-001 (method and string counts) and F-002 (script outputs).
- Until the live check runs, F-003 remains a static finding. After it runs, the time-editor round trip is known only for the locales tested.
- These carried items are not re-verified by another Stage 2 pass. Stage 3 results and later controls must not treat them as verified until evidence exists.
- The carryover was decided by a delegated operator, not by the owner in person.

<a id="read-checklist-proposals"></a>

## Checklist Proposals

The pass-012 reviewer proposed the following, pending author confirmation:
- **CHK-007:** a figure counts as reproducible only when an independent implementation of the rule's text gives it. Excluded sets must be disjoint or ordered, and every count-changing clause needs a positive control.
- **CHK-004:** trace each editor field's whole round trip (display, input aid, validation, save) with its locale source.
- **Review practice:** route every node call through the runner. No new CHK is needed.

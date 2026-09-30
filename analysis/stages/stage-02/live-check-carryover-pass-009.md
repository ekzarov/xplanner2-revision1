# Stage 2 Live-Check Carryover: Pass 009

**Which open Stage 2 pass 009 findings are carried into Stage 3 live checks or owner-accepted residual risks, and why is none of them blocking?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, under the project rule `stage-02-live-carryover`.
- **Maintained / decided by:** PM maintains this record. The owner `ekzarov` approves the carryover. The Stage 3 BA records each live outcome.
- **Governing instructions:** [the project departure record](../../maintenance/process-departure-2026-09-30-stage2-live-carryover.md) and [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Three low Stage 2 findings stay open. They are carried into Stage 3; none is closed, and nothing is renamed `clean`**
>
> Pass 009 returned `findings` F-001..F-003. All are low, and all are inaccuracies in the Stage 1 records. The owner authorized carrying them without pass 010: F-002 and part of F-001 become live checks, while the rest of F-001 and all of F-003 are owner-accepted residual risks. The Stage 1 correction BA-001-11 was not performed before Stage 3.
>
> **Next:** after the owner's Stage 3 grant, the Stage 3 BA runs the live checks below and records each outcome. An item that stays unresolved remains open into Stage 4.
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

- Carryover session: a81963deb7fe2b1fd
- Carryover report SHA-256: 8847eda3f48bf1e273a18e848ddcc5e6a43eff1d134ed31eea15dabf1459cb08

These lines bind the carryover to:
- pass 009, report [`analysis/reviews/stage-02-pass-009.md`](../../reviews/stage-02-pass-009.md), `result: findings`, `findings_severity_max: low`;
- its approved non-material incident assessment [`incident-assessment.md`](../../reviews/evidence/S02-P009/incident-assessment.md);
- its recovery chain: root 006, coverage base 007, excluded 008.

The Stage 1 records carried are those reviewed by pass 009: [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) `c6a269ab…` and [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) `fafa8fcd…` (210 rows). They have not changed since.

<a id="read-carried-findings"></a>

## Carried Findings

| Finding | What is inaccurate in the records | Carried as | Stage 3 check or accepted risk |
|---|---|---|---|
| F-002 (low): history dates | Rows 69-70 say every date follows the bundle pattern. `history.jsp:61,106` use `formatDate` without a format, so they get the built-in pattern `EEE MMM dd k:mm:ss z` in the locale of the first requester. Row 186 does not say this. | **Live check** | Open the history view of a task after creating history. Use two browsers or sessions with different `Accept-Language` values, one after the other, after a fresh start. Expected: textual date in the first requester's locale for both. Record the observed format per locale and the rows affected. |
| F-001 (low): request-keyed caches | The Q3 cache fact names `PropertyMessageResources`; the actual writers are `XPlannerMessageResources` and `ReloadableResourceBundleMessageSource`. The fact omits the displaytag `TableProperties.prototypes` and `FormatDateTag.dateFormatters` locale registries. The Spring view-cache key is view name plus locale. | **Limited live check** plus **accepted risk** | Live: switch locale (`language` parameter and `Accept-Language`) on a list page with a `dt:table` and on the history view. Record the texts and formats per locale. No load or growth test. Accepted risk: the writer-class identity and the unbounded growth stay static, `Inferred` facts. |
| F-003 (low): script-context counting rule | The written rule does not reproduce 103 contexts and 77 outputs. It gives 109/85 as written, or 103/78 with HTML comments blanked. The substantive result, 2 request values in script contexts, holds. | **Accepted risk** | None; a static figure cannot be checked live. The figure and its rule stay inaccurate until a later record correction. |

The fixes named in pass 009 are the record corrections recorded in the draft BA-001-11. They may be applied by the Stage 3 BA from the live results, or in a later correction under the process. They are not claimed as done.

<a id="read-blocking-class-check"></a>

## Blocking-Class Check

PM attests `blocking_class_check: confirmed` on this basis. None of the findings falls into a class the project rule never carries:

- **Reviewer independence or eligibility:** not affected. The pass-009 incidents were approved as non-material, with all five safeguards verified.
- **Baseline source identity or provenance:** not affected. The legacy source set is identical across the chain, and all three findings are about record wording.
- **Missing or unchecked coverage:** none. The reconciliation is 568 = 68 + 500 + 0 uncovered, with no `unchecked_scopes`.
- **Credential or secret exposure:** none of the findings concerns credentials. The masking incident is handled by the approved incident assessment.
- **Safe or isolated launch:** none of the findings changes how the legacy baseline starts or is isolated.
- **Systemic or unbounded impact:** none. The reviewer bounded each finding to named rows and facts and found no further registry.

<a id="read-residual-risk"></a>

## Residual Risk

- The reconnaissance keeps three known low inaccuracies until they are corrected: F-001 (writer classes and missing registries), F-002 (history dates) and F-003 (counting rule).
- The request-keyed caches are unbounded, and their growth is not tested live.
- These carried items are not independently re-verified by a Stage 2 pass. Stage 3 live results and later controls must not treat them as verified until evidence exists.

<a id="read-checklist-proposals"></a>

## Checklist Proposals

The pass-009 reviewer proposed refinements of three checks. They remain pending author confirmation:
- **CHK-003:** registry writers, including application copies of framework code.
- **CHK-004:** the pattern and locale source of each formatting tag.
- **CHK-007:** a stated rule counts as verified only when an independent implementation reproduces the figure.

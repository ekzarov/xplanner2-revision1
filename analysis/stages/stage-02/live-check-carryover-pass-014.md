# Stage 2 Live-Check Carryover: Pass 014

**Which open Stage 2 pass 014 findings are carried forward as explicitly accepted, bounded documentation risks, and why is none of them blocking?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, under the project rule `stage-02-live-carryover`.
- **Maintained / decided by:** PM maintains this record. Codex, the coordinating operator, decides the carryover under the owner's delegation until the completion of Stage 4 (`operational-mandate-stage4-completion`). It is not a personal owner approval.
- **Governing instructions:** [the carryover departure record](../../maintenance/process-departure-2026-09-30-stage2-live-carryover.md), [the operational mandate and its extension](../../maintenance/process-departure-2026-09-30-operational-mandate.md), [the pass-013 carryover](./live-check-carryover-pass-013.md) and [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Six low documentation findings stay open as accepted bounded risks; F-007 is closed by independent control; nothing is renamed `clean`**
>
> Pass 014 returned `findings` with no new finding. It confirmed the F220/H220 correction (MH-01) and closed pass-013 F-007. The pass-013 findings F-001..F-006 remain open, unchanged, with the same IDs. They are carried with the same treatment as in the approved pass-013 carryover: no new map correction, no live rerun, no pass 015.
>
> **Next:** after the exact delegated decision on this record and on the pass-014 incident assessment, Stage 3 re-entry and Stage 4 completion. Stage 5 is not permitted.
>
> **Details:** [Binding](#read-binding) / [Carried Findings](#read-carried-findings) / [Blocking-Class Check](#read-blocking-class-check).

<details>
<summary><strong>Contents</strong></summary>

- [Binding](#read-binding)
- [Carried Findings](#read-carried-findings)
- [Closed Since Pass 013](#read-closed-since-pass-013)
- [Blocking-Class Check](#read-blocking-class-check)
- [Residual Risk](#read-residual-risk)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-binding"></a>

## Binding

- Carryover session: aeac87124971a209c
- Carryover report SHA-256: be869fec1e50fbd4c8b227b9331fe3288c1ca17333cf5ecf45a368de3d033853

These lines bind the carryover to:
- **The pass:** [`analysis/reviews/stage-02-pass-014.md`](../../reviews/stage-02-pass-014.md), `result: findings`, `findings_severity_max: low`.
- **Its incident assessment:** [`incident-assessment.md`](../../reviews/evidence/S02-P014/incident-assessment.md), which must be accepted before this carryover is decided.
- **Its chain:** root 006, previous and coverage base 013, no recovery.

The Stage 1 records carried are the ones pass 014 reviewed at revision `b860ccd`: [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx) and [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md).

<a id="read-carried-findings"></a>

## Carried Findings

Pass 014 keeps the pass-013 IDs F-001..F-006 for the same open findings. The table below repeats their treatment verbatim from the approved [pass-013 carryover](./live-check-carryover-pass-013.md#read-carried-findings). Each is carried as an **accepted documentation risk**, with no live check.

| Finding | What is inaccurate | Consequence if left uncorrected | Treatment |
|---|---|---|---|
| F-001 | Column G is decided unevenly. Rows 18, 41, 138, 149, 152 and 162 keep their status, while rows with the same kind of live evidence (38/48, 40, 52, 202) became `Partial`. | Status counts (146/10/53/1) and the per-row status can mislead a reader about which conditional failures (data state, session locale, deployment condition) count as `Partial`. The behavior itself is recorded correctly in the row notes and in W001. | Accepted risk. Readers use the W001 row verdict in column H, not column G alone, for these rows. |
| F-002 | Some live-labelled statements say more than the checks observed. F216, D218, F218, GAP-007 and the Q3 SOAP fact say all attribute operations run anonymously, but only an anonymous `setAttribute` was observed. Row 151's start, end and delete triggers come from the served script, not a live action. | The records overstate the observed anonymous SOAP exposure (a conservative error). One expected result in row 151 is presented as observed when it was read from script. | Accepted risk. The SOAP observation stays security-relevant input for Stage 4 requirements (no anonymous writes). No SOAP study is extended. |
| F-003 | Nine rows (11, 29, 30, 135, 164, 176, 225, 228, 234) still carry "(runtime unverified)" for claims their own W001 checks now observe. Rows 132, 142 and 184 need the author's check. | A reader may think a behavior is unobserved when W001 observed it. No status is wrong because of this. | Accepted risk. The W001 runtime label in column H is authoritative for these rows. |
| F-004 | The static remainder of pass-012 F-003: the Q3 fact still says the task editor shows dates with the static converters; E69 and H89 are unchanged. | The editor-date mechanism stays inaccurately described in one reconnaissance fact and two cells. The live time-editor behavior is recorded correctly (W001, MC-A-16). | Accepted risk. Stage 4 requirements must take date display and input from the live observation, not from the Q3 fact. |
| F-005 | Pass-012 F-001: the counting rules M and S do not reproduce their figures. | The method and string counts in the A4 correspondence record are not reproducible. No row and no behavior depend on them. | Accepted risk (as in the pass-012 carryover). |
| F-006 | Pass-012 F-002: the script-context rule gives 81 outputs, not 78. | One documented figure is inexact; the result "2 request values in script contexts" is unaffected. | Accepted risk (as in the pass-012 carryover). |

As in the pass-013 decision: the detailed table, the W001 observations, the column-H runtime labels and the exact untested sub-cases take precedence over broad prose. Unobserved SOAP calls and script triggers do not become observed.

<a id="read-closed-since-pass-013"></a>

## Closed Since Pass 013

- **F-007** (undisclosed PM edits) is closed by pass 014. The reviewer reproduced the author's attested bytes from the pinned revision by reverting exactly the two disclosed formatting edits.
- **MH-01** (F220 `getAttribute`) was corrected by BA-001-14 and confirmed by pass 014.

<a id="read-blocking-class-check"></a>

## Blocking-Class Check

PM proposes `blocking_class_check: confirmed` on this basis. None of the findings falls into a class the project rule never carries:

- **Reviewer independence or eligibility.** Pass 014 is a fresh reviewer's admissible correction-validation. Its incident assessment must be accepted as non-material before this carryover is decided.
- **Baseline source identity or provenance.** Not affected. The legacy files are unchanged since the root. Columns A-H differ from the base only in F220, H220 and the authorized C227 banner.
- **Missing or unchecked coverage.** None. Coverage is 764 = 120 rechecked + 644 retained + 0 uncovered, with no `unchecked_scopes`.
- **Credential or secret exposure.** None. The CHK-009 count is 0 credential values.
- **Safe or isolated launch.** Not affected. No live run took place.
- **Systemic or unbounded impact.** None. Each finding names its rows, cells or facts.
- **Severity above low.** None. All six are low, and there is no new finding.

<a id="read-residual-risk"></a>

## Residual Risk

- The Stage 1 records keep the six documentation inaccuracies above until a later correction.
- These items are not re-verified by another Stage 2 pass.
- The carryover is decided by a delegated operator, not by the owner in person.
- This record does not change the Stage 3 waiver (residual items R-24..R-47 stay unverified) or the Stage 4 decisions, and it does not permit Stage 5.

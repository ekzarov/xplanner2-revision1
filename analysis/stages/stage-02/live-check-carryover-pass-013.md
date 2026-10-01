# Stage 2 Live-Check Carryover: Pass 013

**Which open Stage 2 pass 013 findings are carried forward as explicitly accepted, bounded documentation risks, and why is none of them blocking?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, under the project rule `stage-02-live-carryover`.
- **Maintained / decided by:** PM maintains this record. The carryover is decided by Codex, the coordinating operator, under the owner's delegation until Stage 4 (`operational-mandate-expansion-until-stage-04`). It is not a personal owner approval.
- **Governing instructions:** [the carryover departure record](../../maintenance/process-departure-2026-09-30-stage2-live-carryover.md), [the operational mandate and its expansion](../../maintenance/process-departure-2026-09-30-operational-mandate.md) and [Stage 2 Correction Validation](../../reviews/README.md#stage-2-correction-validation).

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Seven low documentation findings stay open as accepted bounded risks; nothing is closed, re-checked live or renamed `clean`**
>
> Pass 013 returned `findings` F-001..F-007, all low. Every one is an inaccuracy in the wording, status labels or provenance notes of the Stage 1 records. None is a behavior that was not observed. All seven are carried as accepted documentation risks without new live checks, without a Stage 1 correction and without pass 014. The records keep the inaccuracies until a later correction.
>
> **Next:** after the exact delegated decision on this record, Stage 3 re-entry. Stage 3 completion, any waiver and Stage 4 product choices are not decided here.
>
> **Details:** [Binding](#read-binding) / [Carried Findings](#read-carried-findings) / [Blocking-Class Check](#read-blocking-class-check).

<details>
<summary><strong>Contents</strong></summary>

- [Binding](#read-binding)
- [Carried Findings](#read-carried-findings)
- [Blocking-Class Check](#read-blocking-class-check)
- [Residual Risk](#read-residual-risk)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-binding"></a>

## Binding

- Carryover session: a7738da7d84992f93
- Carryover report SHA-256: d02131d35584a6629117b2519e30095f22c4e52a3d7872a3a32743458c51f2db

These lines bind the carryover to:
- **The pass:** [`analysis/reviews/stage-02-pass-013.md`](../../reviews/stage-02-pass-013.md), `result: findings`, `findings_severity_max: low`.
- **Its incident assessment:** [`incident-assessment.md`](../../reviews/evidence/S02-P013/incident-assessment.md), accepted as non-material by Codex under the delegation (PR #38 comment 5923385417).
- **Its chain:** root 006, previous and coverage base 012, no recovery.

The Stage 1 records carried are the ones pass 013 reviewed at revision `6138f37`: [`analysis/legacy_user_flows.xlsx`](../../legacy_user_flows.xlsx), [`analysis/legacy_reconnaissance.md`](../../legacy_reconnaissance.md) and [`stage-03-walkthrough-001-dispositions.md`](../stage-01/stage-03-walkthrough-001-dispositions.md).

<a id="read-carried-findings"></a>

## Carried Findings

Every finding is carried as an **accepted documentation risk**, with no live check. This is right for a documentation finding: the behaviors were already observed live in W001, and the inaccuracy lies in how the records describe them.

| Finding | What is inaccurate | Consequence if left uncorrected | Treatment |
|---|---|---|---|
| F-001 | Column G is decided unevenly. Rows 18, 41, 138, 149, 152 and 162 keep their status, while rows with the same kind of live evidence (38/48, 40, 52, 202) became `Partial`. | Status counts (146/10/53/1) and the per-row status can mislead a reader about which conditional failures (data state, session locale, deployment condition) count as `Partial`. The behavior itself is recorded correctly in the row notes and in W001. | Accepted risk. Readers use the W001 row verdict in column H, not column G alone, for these rows. |
| F-002 | Some live-labelled statements say more than the checks observed. F216, D218, F218, GAP-007 and the Q3 SOAP fact say all attribute operations run anonymously, but only an anonymous `setAttribute` was observed. Row 151's start, end and delete triggers come from the served script, not a live action. | The records overstate the observed anonymous SOAP exposure (a conservative error). One expected result in row 151 is presented as observed when it was read from script. | Accepted risk. The SOAP observation stays security-relevant input for Stage 4 requirements (no anonymous writes). No SOAP study is extended. |
| F-003 | Nine rows (11, 29, 30, 135, 164, 176, 225, 228, 234) still carry "(runtime unverified)" for claims their own W001 checks now observe. Rows 132, 142 and 184 need the author's check. | A reader may think a behavior is unobserved when W001 observed it. No status is wrong because of this. | Accepted risk. The W001 runtime label in column H is authoritative for these rows. |
| F-004 | The static remainder of pass-012 F-003: the Q3 fact still says the task editor shows dates with the static converters; E69 and H89 are unchanged. | The editor-date mechanism stays inaccurately described in one reconnaissance fact and two cells. The live time-editor behavior is recorded correctly (W001, MC-A-16). | Accepted risk. Stage 4 requirements must take date display and input from the live observation, not from the Q3 fact. |
| F-005 | Pass-012 F-001: the counting rules M and S do not reproduce their figures. | The method and string counts in the A4 correspondence record are not reproducible. No row and no behavior depend on them. | Accepted risk (as in the pass-012 carryover). |
| F-006 | Pass-012 F-002: the script-context rule gives 81 outputs, not 78. | One documented figure is inexact; the result "2 request values in script contexts" is unaffected. | Accepted risk (as in the pass-012 carryover). |
| F-007 | The BA-001-13 record does not itself disclose the two PM edits made after the author's attestation. | A reader comparing the attested PM-section hash with the file would see a mismatch. | Disclosed in the PM note [`stage-03-walkthrough-001-pm-edit-note.md`](../stage-01/stage-03-walkthrough-001-pm-edit-note.md), which proves both edits formatting-only. The record itself stays as it is, so the finding stays open. |

<a id="read-blocking-class-check"></a>

## Blocking-Class Check

PM proposes `blocking_class_check: confirmed` on this basis. None of the findings falls into a class the project rule never carries:

- **Reviewer independence or eligibility.** Not affected. Pass 013 is a fresh reviewer's admissible correction-validation. Its incidents were accepted as non-material, with all five safeguards verified.
- **Baseline source identity or provenance.** Not affected. The legacy files are unchanged since the root. F-007 concerns record provenance; it is disclosed and proven formatting-only, and it concerns neither the source set nor a reviewed baseline.
- **Missing or unchecked coverage.** None. Coverage is 748 = 429 rechecked + 319 retained + 0 uncovered, with no `unchecked_scopes`.
- **Credential or secret exposure.** None. The CHK-009 count is 0 credential values. F-002 concerns how an observed SOAP exposure is worded, not a disclosure of any secret.
- **Safe or isolated launch.** Not affected. No finding changes how the legacy baseline starts or is isolated.
- **Systemic or unbounded impact.** None. Each finding names its rows, cells or facts.
- **Severity above low.** None. All seven are low.

<a id="read-residual-risk"></a>

## Residual Risk

- The Stage 1 records keep the seven documentation inaccuracies above until a later correction. Their treatments say which source is authoritative meanwhile.
- These items are not re-verified by another Stage 2 pass.
- The carryover is decided by a delegated operator, not by the owner in person.
- This record does not complete Stage 3. It does not decide the 25 partially verified rows. Several of those rows had most steps observed live and only one or more sub-cases unexecuted, so they are not purely static. It does not waive anything and does not decide any Stage 4 product question.

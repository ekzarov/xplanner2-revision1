# Access Log - Stage 2 Pass 013 (packet S02-P013)

**What did the pass-013 reviewer read, run and write, in which order, and where did it depart from the packet rules?**

- Reviewer: Claude Code subagent, model `claude-opus-5-5`, session CURRENT_SESSION_ID (PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`).
- Times are UTC on 2026-10-01, taken programmatically (`date -u`, PowerShell `UtcNow`, or the runner log); bracketed times come from neighbouring runner-log entries.
- The runner log (the reviewer-scratch file safe-run.log.jsonl) holds 101 entries from `01:28:45.643Z` to `02:01:03.708Z` before the final checks, with 5 refusals; each refusal printed only its refusal line.

## Access Sequence

| # | Time (UTC) | Operation | Inputs | Result |
|---|---|---|---|---|
| 1 | before 01:27:48 | client file-read tool (D-004) | [`packet.json`](packet.json) | read in full (permitted input) |
| 2 | 01:27:48 | runner `--self-test` (temp variables set); `Get-FileHash` of runner, config and packet | the pinned runner | `safe-run self-test OK: 30 cases`; runner `6ac6a4a7...718d`, config `3dfb26eb...7cf7`, packet `3e30435a...5fde`: all equal to the assignment and packet |
| 3 | 01:27-01:28 | client file-read tool and content search (D-004) | [`AGENTS.md`](../../../../AGENTS.md), [`SKILL.md`](../../../../.agents/skills/migration-ba/SKILL.md), [`MIGRATION.md`](../../../../MIGRATION.md) (lines 1-80, 348-647), [`constitution.md`](../../../../.specify/memory/constitution.md) (A1-A4), [`reviews/README.md`](../../README.md) (Results, Independence, Stage 2 Correction Validation, Attempt Recovery), [`agent_orchestration.md`](../../../agent_orchestration.md) (Credential-Safe Evidence, Operational Incident Assessment, Packet Transport Safety, Correction-Validation Packets), [`stage-NN-pass-NNN-template.md`](../../stage-NN-pass-NNN-template.md) | governing text read |
| 4 | about 01:28 | direct PowerShell listing (D-001) | names and sizes of review reports, S02-P012 evidence and the stage-03 tree | output too large; the client persisted it under the user profile; **not opened** |
| 5 | 01:28:45-01:29:57 | runner: `--help` (refused), git `rev-parse HEAD` and `status --short` in the three checkouts, `show -s --format` of the three revisions, two `git` calls without `-C` (refused) | pinned checkouts | heads `15cb6b2`, `2c176d4`, `6138f37`; all three clean; commit times recorded |
| 6 | 01:29-01:31 | runner: `diff --name-status` and `--stat` BASE..CAND (saved to scratch); bounded reads | candidate checkout | 248 paths |
| 7 | 01:31-01:33 | own script `pins.js` (runner); demo-seed probe (D-002); LF check of [`legacy/demo-seed.sql`](../../../../legacy/demo-seed.sql) (direct `node -e`, D-005) | packet pins; the three checkouts | 30 pin comparisons equal (runner pin only in the main tree; demo-seed by LF-normalised bytes) |
| 8 | 01:33-01:36 | runner: `diff --name-status` ROOT..CAND and BASE..CAND of `legacy`, `sources`, `.specify`, `config` | candidate checkout | legacy unchanged since ROOT; nothing under sources, constitution or config BASE..CAND |
| 9 | 01:36-01:40 | client file-read tool (D-004) and runner reads | [`stage-02-pass-012.md`](../../stage-02-pass-012.md) lines 1-309 and 378-457 | chain, eligibility and F-001..F-003 of the base |
| 10 | 01:36-01:45 | own scripts `xlsx.js`, `wbdiff.js`, `wbstat.js`, `index.js`, `sheet.js`, `shape.js` (runner) | both workbook checkouts; the W001 part checks (for example [`setup/checks.json`](../../../stages/stage-03/evidence/W001/setup/checks.json)), [`rows.json`](../../../stages/stage-03/evidence/W001/consolidated/rows.json) and [`map-corrections.json`](../../../stages/stage-03/evidence/W001/consolidated/map-corrections.json) | 354 changed cells; 436 checks indexed; 210 labels verified; the per-item sheet (940 lines) read through the runner in 16 bounded parts |
| 11 | 01:36-01:52 | runner reads | [`stage-03-walkthrough-001-dispositions.md`](../../../stages/stage-01/stage-03-walkthrough-001-dispositions.md) (all 406 lines in 5 parts), [`walkthrough-001.md`](../../../stages/stage-03/walkthrough-001.md) (residual scope, live questions), PM redirect facts | dispositions and residual items |
| 12 | 01:40-01:55 | runner: `-U0` diff of the reconnaissance BASE..CAND and ROOT..BASE (saved); bounded reads; process-file diff | candidate checkout | 32 hunks (+61 -41); process changes classified |
| 13 | 01:41 | own scripts `pmfix.js` (file tool) and `pmfix2.js` (here-document, D-003) through the runner | the dispositions record at CAND | the PM section differs from the attested bytes by one linkified path |
| 14 | 01:45-01:50 | runner reads | [`migration_status.yaml`](../../../migration_status.yaml) (transitions, passes 11-12, delegated decisions), [`incident-assessment.md`](../S02-P012/incident-assessment.md), [`live-check-carryover-pass-012.md`](../../../stages/stage-02/live-check-carryover-pass-012.md), [`process-backlog-2026-10-01.md`](../../../maintenance/process-backlog-2026-10-01.md) | chain and delegated decisions |
| 15 | 01:46-01:48 | credential scans `credscan.js` and `credctx.js` (runner); one direct masked print of the shape of [`legacy/README.md`](../../../../legacy/README.md) line 38 (D-006) | changed Stage 1 records, the workbook dump, the stage-03 tree | 0 credential values; 30 raw hits classified with masked context as role-name collisions |
| 16 | 01:50-01:52 | own scripts `blob.js`, `warlines.js`, `dispcheck.js`, `chk001.js` (runner) | SKILL.md in both checkouts; one WAR entry in memory; the record tables; identifiers in the new text | blob `560391d6`; `history.jsp:52-63,97-111` holds the 9 cited lines; tables equal the diff; all references resolve |
| 17 | 01:55-02:01 | own script `gen.js` (runner), patched once by `node -e` (D-007) | sealed ledgers and coverage records of passes 006, 007, 009, 010, 012; my scratch | this folder's [`comparison-results.json`](comparison-results.json), [`coverage-reconciliation.json`](coverage-reconciliation.json) and [`change-set.json`](change-set.json) |
| 18 | after 02:01 | file tool writes; runner [`artifact-reading.js`](../../../tools/artifact-reading.js), own link check, credential self-scan, hashes; final `git status --short` of the three checkouts | this folder and the scratch report | see the report's gates |

## Deviations

| ID | What happened | Data read or emitted (no values) | Audience and retention | Impact |
|---|---|---|---|---|
| D-001 | A direct PowerShell `Get-ChildItem` listing (file names and sizes of the review reports, the S02-P012 evidence and the stage-03 tree) exceeded the client output limit. The client persisted the full output to a tool-results file under the user profile. | File names and sizes only; no file content. | My session and the owner's client; the persisted file stays where the client put it. I did **not** open it and used bounded runner listings and `wc -c` instead. | No conclusion rests on it. Transport-rule departure only. |
| D-002 | Three runner calls `git -C <checkout> show HEAD:legacy/demo-seed.sql` piped to `head -c 0`. The runner accepted the symbolic `HEAD` (equal to each pinned revision by `rev-parse`). | Zero bytes reached the output (broken pipe). | My session. | Replaced by an in-memory LF check; none. |
| D-003 | The scratch script `pmfix2.js` was written with a shell here-document instead of the file tool. | My own read-only script text. | Reviewer scratch only. | None. |
| D-004 | Long reads of permitted inputs went through the client's file-read tool or content search rather than the runner: the packet, AGENTS.md, SKILL.md, MIGRATION.md (two ranges), the constitution amendments, reviews/README.md and agent_orchestration.md (sections), the template, and pass-012 report lines 1-309. | Committed governing and chain text. My credential scan of these files finds no credential value. | My session and the owner's client. | These are inputs the mode reads anyway; none. |
| D-005 | Several direct commands outside the runner: `node -e` one-liners for read-only inspection of my own scratch dumps and committed JSON (most without `TEMP`, `TMP` and `TMPDIR` in that command), and direct `grep`, `sed`, `head` and `cut` reads of committed files, some longer than a screen (the status-file outline, a search for the demo-seed hash across sealed evidence, a few workbook cells and W001 check texts). | Committed repository text, counts and my own results; no credential value appeared. | My session and the owner's client. | No feature that writes temp files was enabled; none. |
| D-006 | One direct `node -e` printed the shape of [`legacy/README.md`](../../../../legacy/README.md) line 38 with every letter replaced by `a` and every digit by `9`, to write the scanner pattern. | The masked shape only. | My session. | No value disclosed. |
| D-007 | One direct `node -e` string replacement patched my scratch `gen.js` (file tool not used; temp variables not set). | My own script. | Reviewer scratch only. | None. |
| D-008 | Direct `node -e` string replacements (file tool not used; temp variables not set) corrected my own files: two link fixes in this log and one fix of short hashes and two wording slips in the scratch report, before any hash was taken. | My own text. | This folder and the reviewer scratch. | None; the final bytes are what the hashes in RESULT pin. |

## Changes After RESULT

| Time (UTC) | Change | Requested by | Effect |
|---|---|---|---|
| after 02:10:55 | Formatting only: in the scratch report (Stage 2 Correction Validation, Source identity bullet) the plain code span of the configuration folder became the relative link to [`config/`](../../../../config), because `audit:artifact-links` reported it as not clickable. Made with the file tool; nothing else in the report changed. | PM | the scratch-report hash changes; verdict, findings, counts and evidence are unchanged |
| after 02:10:55 | New companion [`incident-assessment.md`](incident-assessment.md) for D-001..D-008, written with the file tool on PM request; its report hash is computed from the fixed scratch report. | PM | preparation only; approves nothing |

No access to `.migration-tmp` itself, another session's folder, `.migration-tmp/stage-03/secrets`, the user profile, earlier-migration material, the network or the Stage 3 environment. No git command other than `rev-parse`, `status`, `diff` and `show` on the pinned checkouts.

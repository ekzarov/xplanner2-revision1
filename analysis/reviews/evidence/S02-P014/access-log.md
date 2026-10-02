# Access Log - Stage 2 Pass 014 (packet S02-P014)

**What did the pass-014 reviewer read, run and write, in which order, and where did it depart from the packet rules?**

- Reviewer: Claude Code subagent, model `claude-opus-5-5`, session CURRENT_SESSION_ID (PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`).
- Times are UTC on 2026-10-02 from the runner log (the reviewer-scratch file `safe-run.log.jsonl`, written by the runner at each call). Client-tool steps outside the runner are bracketed by the neighbouring runner entries.
- Every PowerShell command set `TEMP`, `TMP` and `TMPDIR` to the pinned temp folder in the same command. Every scratch script was written with the file tool and run through the runner. No here-document, no `node -e`, no `sed -i`.
- JSON evidence files hold repository paths as data strings; the clickable-link rule applies to the Markdown files.

## Access Sequence

| # | Time (UTC) | Operation | Inputs | Result |
|---|---|---|---|---|
| 1 | before 16:59:29 | runner `--self-test` (direct `node`, temp variables set, as instructed) | the pinned runner | `safe-run self-test OK: 30 cases` |
| 2 | 16:59:29-16:59:37 | runner `read` of the runner source (refused: outside the read roots); then client file-read tool on the runner source and its configuration (D-001) | `.migration-tmp/stage-02-p014/tools/` (two files) | command forms understood; no project data |
| 3 | 16:59:37-16:59:41 | runner reads | [`packet.json`](packet.json) (all 349 lines in two parts) | pins, chain, scope |
| 4 | 16:59:51-16:59:52 | runner git: `rev-parse HEAD` and `status --short` in the three checkouts; `show -s --format` of the three revisions; `list` of my scratch | pinned checkouts | heads `15cb6b2`, `6138f37`, `b860ccd`; all clean |
| 5 | 17:00:13-17:00:26 | own scripts `verify-pins.js`, `seed-eol.js` | packet pins in the candidate checkout and the main tree; the legacy files in all checkouts | packet `7fe3aa6b...ac90`, runner `6ac6a4a7...718d`, configuration `133d3f97...f254`, 26 file pins equal; demo-seed equal by its committed LF bytes |
| 6 | 17:00:37-17:01:20 | runner reads; client content search for headings (D-002) | [`reviews/README.md`](../../README.md) (Comparison Record Contract, Results, Independence, Correction Validation, Attempt Recovery), [`agent_orchestration.md`](../../../agent_orchestration.md) (Credential-Safe Evidence, Incident Assessment, Transport Safety, Formal pass, Correction-Validation Packets), [`MIGRATION.md`](../../../../MIGRATION.md) (via the candidate checkout; the main-tree path was refused), [`constitution.md`](../../../../.specify/memory/constitution.md) A1-A4, [`SKILL.md`](../../../../.agents/skills/migration-ba/SKILL.md), [`stage-NN-pass-NNN-template.md`](../../stage-NN-pass-NNN-template.md) | governing text read |
| 7 | 17:01:27 | runner git `diff --name-status` (saved) and `--stat` BASE..CAND | candidate checkout | 42 paths |
| 8 | 17:01:36-17:02:08 | runner reads | [`stage-02-pass-013.md`](../../stage-02-pass-013.md) (all 593 lines), [`stage-04-mh01-dispositions.md`](../../../stages/stage-01/stage-04-mh01-dispositions.md) (all), [`stage-04-requirements-revision.md`](../../../stages/stage-04/stage-04-requirements-revision.md) (lines 1-120) | base findings; the correction; Stage 4 decisions |
| 9 | 17:02-17:03 | client content search (D-002) | the Stage 4 record (C227, banner, MH-01 lines) | the C227 exception and MH-01 rows located |
| 10 | 17:03:21-17:05:02 | own scripts `xlsx-lib.js`, `xlsx-diff.js`, `show-220.js`, `w001-extract.js`, `recon-attr.js`, `scan-getattr.js` | both workbook checkouts; [`D/checks.json`](../../../stages/stage-03/evidence/W001/D/checks.json), [`map-corrections.md`](../../../stages/stage-03/evidence/W001/consolidated/map-corrections.md), [`rows.json`](../../../stages/stage-03/evidence/W001/consolidated/rows.json), [`walkthrough-001.md`](../../../stages/stage-03/walkthrough-001.md); the reconnaissance at CAND | cell diff; F220/H220 before and after; cited checks; sweeps. One line withheld by the runner mask (M-001) |
| 11 | 17:03-17:05 | client content search (D-002) | the reconnaissance at CAND (`getAttribute`, SOAP and attribute lines, epics) | SOAP facts located |
| 12 | 17:05:09-17:06:07 | runner reads; own script `pmnote-verify.js` (twice) | [`stage-03-walkthrough-001-pm-edit-note.md`](../../../stages/stage-01/stage-03-walkthrough-001-pm-edit-note.md); [`stage-03-walkthrough-001-dispositions.md`](../../../stages/stage-01/stage-03-walkthrough-001-dispositions.md) lines 66-70 | both PM edits reproduced from the bytes |
| 13 | 17:06:29-17:07:12 | runner reads and git `diff --numstat`, `diff -U0` of the process files and `-U1` of the status file (saved) | candidate checkout; the Stage 4 record lines 160-175 and 395-406 | process changes classified; chain and decisions |
| 14 | 17:07:29-17:09:25 | runner reads; own scripts `cov013-inspect.js`, `ledgers-inspect.js`, `classify.js` (twice) | the sealed ledgers and coverage records of passes [006](../S02-P006/comparison-results.json), [007](../S02-P007/comparison-results.json), [009](../S02-P009/comparison-results.json), [010](../S02-P010/comparison-results.json), [012](../S02-P012/comparison-results.json), [013](../S02-P013/comparison-results.json) | 748 obligations classified |
| 15 | 17:10:07-17:13:11 | runner reads; own scripts `dc047.js` (twice; M-002), `checks014.js`, `soap-sweep.js`, `recon-epic.js`; client content search of the template instructions and the pass-013 coverage record (D-002) | [`error-prevention-checklist.md`](../../../error-prevention-checklist.md); [incident assessment](../S02-P013/incident-assessment.md) and [carryover](../../../stages/stage-02/live-check-carryover-pass-013.md); the mandate record diff; [`starter-sync-2026-10-02-38b6560.md`](../../../maintenance/starter-sync-2026-10-02-38b6560.md); [`legacy_user_flows_template_instructions.md`](../../../legacy_user_flows_template_instructions.md); [`legacy_reconnaissance.template.md`](../../../legacy_reconnaissance.template.md); [Return and Correction Protocol](../../README.md#return-and-correction-protocol) | labels, counts, banners, open-finding text, record hashes |
| 16 | 17:15:04-17:20:57 | runner reads; own scripts `gen014.js` (three runs), `find-41-136.js`, `rows41-136.js`, `rows41-136-checks.js`, `cov-tally.js`, `runlog.js` | pass-013 [`change-set.json`](../S02-P013/change-set.json) and [`access-log.md`](../S02-P013/access-log.md) (format only); the W001 `setup`, `A` and `B` checks of rows 41, 134 and 136 | this folder's [`change-set.json`](change-set.json), [`comparison-results.json`](comparison-results.json), [`coverage-reconciliation.json`](coverage-reconciliation.json) |
| 17 | after 17:20:57 | file tool writes; runner `artifact-reading.js`; own `credscan.js`; the instructed `audit:artifact-links` on a temporary report copy (removed); hashes; final `git status --short` | this folder and the scratch report | see the report's gates |

## Deviations

| ID | What happened | Data read or emitted (no values) | Audience and retention | Impact |
|---|---|---|---|---|
| D-001 | After the runner refused to read its own folder, I read the runner source (335 lines) and its configuration (36 lines) with the client file-read tool, outside the runner. | Tool code and the configured roots, revisions and credential-source path. The code builds credential matchers in memory and contains no credential value. | This session's transcript; nothing saved. | None: no project fact, finding or retained item rests on it; it only explained the runner's command forms. |
| D-002 | Short targeted content searches with the client search tool, outside the runner: headings of the governing documents; lines of the Stage 4 record, the reconnaissance, the template instructions, the BA-001-13 dispositions record, the pass-013 coverage record and ledger, and my own scratch outputs. | Matching lines were printed without runner masking. I checked each printed line: SOAP, permission, fill and heading text; none holds a credential value or a credential-bearing line. Long lines were omitted by the tool. | This session's transcript; nothing saved. | None: every fact used in the conclusion was re-established by a runner read or a runner-run script (C-011, C-017, C-021, C-043); the searches only located lines. |

No other departure: no git command outside the runner, no `git log`, no unpinned revision, no listing of `.migration-tmp` or other sessions' folders, no client-persisted spill file, nothing under the user profile, no web, network, browser, MCP, agent, install or live request, nothing under `.migration-tmp/stage-03/secrets`.

## Masking Events

| ID | Command | What the runner did | Classification |
|---|---|---|---|
| M-001 | runner read of my scratch file `w001-extract.txt` (17:04:00) | withheld 1 line (the JSON of check D-C-047) | generic pattern hit: the observed text holds a parser exception message in which the word for a parser token is followed by a colon; my script `dc047.js` then printed only property tests (QuerySyntaxException, fault, no password words) |
| M-002 | runner run of `dc047.js` (17:10:26) | withheld 1 line (the observed field of D-C-047) | the same false positive; the second run printed booleans only |

I did not bypass the mask: no masked text was printed by any other path.

## Credential Self-Scan

`credscan.js` (scratch, through the runner) parses the factory pair of [`legacy/README.md`](../../../../legacy/README.md) line 38 in memory and searches this folder, the scratch report, the two new Stage 1 notes and both workbook sheets at CAND. The counts are in the report's Reviewer Self-Check; no value is printed or written.

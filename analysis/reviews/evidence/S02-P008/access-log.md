# Access Log - Stage 2 pass 008 (packet S02-P008)

Times are UTC, taken from the reviewer scratch file times and command order (approximate to the minute).
WT-B, WT-P and WT-C are the detached checkouts `.migration-tmp/stage-02-p008/baseline`, `previous` and
`candidate`. S is `.migration-tmp/stage-02-p008/reviewer-scratch`. Mode: correction-validation (not
blind); prior reports, evidence, dispositions and the checklist were permitted from the start.

## Launch context injected by the client

| Item | Content class | Effect |
|---|---|---|
| Project CLAUDE.md | entry bridge (read AGENTS.md, MIGRATION.md, role contract) | followed |
| User auto-memory index | two one-line notes (status-summary format; process version frozen) from the user profile | not read by the reviewer; no findings content |
| userEmail, gitStatus, attribution reminder, catalogues, MCP notes, auto-mode note | environment metadata | no findings content |
| WT-C CLAUDE.md | identical entry bridge, injected at the first read in WT-C | none |

## Sequence

| Time | Action | Object | Result |
|---|---|---|---|
| 08:49 | sha256 | [`packet.json`](packet.json) | 3401f782...93e3, matches the assignment |
| 08:50 | sha256; git rev-parse, status | every packet pin; WT-B, WT-P, WT-C | all pins match; HEADs 15cb6b2, 4c1ada2, 605f94d; all three clean |
| 08:50 | git show, ls-files --eol | [`legacy/demo-seed.sql`](../../../../legacy/demo-seed.sql) at BASE, PREV, CAND | committed bytes 41b2f6a3...66e1 at all three (working copy CRLF by core.autocrlf) |
| 08:51 | git rev-parse; read | SKILL.md (blob d09ba8ce...), AGENTS.md, MIGRATION.md | ACK |
| 08:51 | read | reviews README.md 1-580; agent_orchestration.md 41-370; report template | procedure |
| 08:52 | read; git diff | checklist at WT-C; PREV..CAND checklist diff and stat | CHK-007, CHK-012 refined |
| 08:52 | read | [`stage-02-pass-007.md`](../../stage-02-pass-007.md) | predecessor |
| 08:52 | read | WT-C stage-02-pass-007-dispositions.md | author record BA-001-09 (client injected WT-C CLAUDE.md) |
| 08:52 | git diff | PREV..CAND name-status, log, recon hunk count | 13 files, 4 commits, 13 hunks |
| 08:52 | git diff (word diff) | reconnaissance PREV..CAND | output 31.5 KB; the client persisted it to its tool-results folder under the user profile |
| 08:53 | **read (boundary deviation)** | **the client-persisted file of the previous command, under the user profile** | **own command output only; regenerated later as S/recon-worddiff-prev-cand.txt (32,261 bytes). Invalidates the pass under the packet rule** |
| 08:53 | node (exceljs) | workbook dumps BASE, PREV, CAND; cell diffs | PREV..CAND 6 cells in 5 rows; BASE..PREV 29 cells in 26 rows |
| 08:54 | tar.exe; sha256 | workbook package parts | only xl/sharedStrings.xml differs in both steps |
| 08:54 | read; node | pass-007 change-set.json vs regenerated BASE..PREV | files, hunks, cells identical |
| 08:55 | read | pass-006 report header and metadata; S02-P006 pm-phase-b-release.json, comparison ledger, inventory, access log (grep) | root eligibility |
| 08:56 | read | status review ledger (WT-C and main tree, read only) | passes 1-7, session ids distinct |
| 08:56 | read | S02-P007 independence record, coverage reconciliation, packet | predecessor eligibility |
| 08:56 | tar.exe | [`legacy/xplanner-plus.war`](../../../../legacy/xplanner-plus.war) into S/war | 964 files |
| 08:57 | tar.exe | spring-webmvc, spring-web, spring-struts, struts-1.2.9 jars into S/jars | framework classes |
| 08:57-09:10 | node disasm.js; read | framework and application classes; descriptors; JSPs, tags | F-001, F-002 evidence |
| 09:00-09:04 | node reqsinks.js, scriptctx.js | 74 JSP and tag files | 103 contexts; 2 request values in script contexts |
| 09:05 | read (understanding only) | `.migration-tmp/stage-01/tools/script-sinks-09.js` (matched lines) | counting definition of "77"; not evidence |
| 09:10 | node pubkeys.js, keypresence.js | public pages, layout chain, 10 bundles | 45 keys; per-bundle claims match |
| 09:10 | node navsites.js | 594 classes | navigation sites; findForward 44 in 31 methods |
| 09:12 | npm run audit:workbook, audit:artifact-links, audit:project; artifact-reading.js on WT-C records | main tree and WT-C (temp redirected) | all pass; 226 Markdown documents |
| 09:13 | node citecheck.js | delta and whole records | 60/60 and 572/572 |
| 09:15 | node credscan.js, credctx.js | delta, records, correction record | 0 credential values (contextual) |
| 09:19 | node impactmap.js | 550 chain obligations | impact flags |
| 09:27 | node gen-evidence.js | this folder: comparison-results.json, coverage-reconciliation.json, change-set.json | 27 checks; 556 = 66 + 490 + 0 |
| 09:30 | write | this folder: independence-record.md, access-log.md | evidence |
| 09:35 | write; node artifact-reading.js | S/stage-02-pass-008.md | report |
| 09:36 | node credscan.js | new evidence and report | self-scan hit count in RESULT |
| 09:37 | git status | WT-B, WT-P, WT-C, main tree | checkouts clean; main tree shows only the PM status edit and this folder |

## Not accessed

The parent `C:/Work/Legacy`, other projects, earlier reviewer scratch, the Stage 1 author scratch as
evidence, the Starter repository, earlier-migration links (A2), the web, any runtime. The only read
outside the two allowed folders is the deviation marked above.

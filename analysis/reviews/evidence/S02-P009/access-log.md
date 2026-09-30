# Access Log - Stage 2 pass 009 (packet S02-P009)

Times are UTC on 2026-09-28, taken from reviewer scratch file times and command order (approximate to the
minute). WT-R, WT-B, WT-F and WT-C are the detached checkouts `.migration-tmp/stage-02-p009/root`,
`coverage-base`, `failed-attempt` and `candidate`. S is `.migration-tmp/stage-02-p009/reviewer-scratch`.
Mode: correction-validation (not blind); prior reports, evidence, dispositions and the checklist were
permitted from the start. Stage 2 re-entry for this pass was recorded by PM at 13:12:39Z.

## Launch context injected by the client

| Item | Content class | Effect |
|---|---|---|
| Project CLAUDE.md | entry bridge (AGENTS.md, MIGRATION.md, role contract) | followed |
| User auto-memory index | two one-line notes from the user profile (status-summary format; process version frozen) | not read with any tool; no findings content |
| userEmail, gitStatus, attribution reminder, catalogues, MCP notes, auto-mode note, scratchpad path | environment metadata | no findings content; scratchpad not used |
| WT-C CLAUDE.md | identical entry bridge, injected at the first read in WT-C | none |
| PM assignment | task, boundaries, lead names, proposed chain | permitted in this mode |

## Sequence

| Time | Action | Object | Result |
|---|---|---|---|
| 13:13 | sha256 | [`packet.json`](packet.json) | 9ea78188...a8979, matches the assignment |
| 13:14 | node S/verify-packet.js; git rev-parse, status | 66 pin checks; four checkouts | all packet pins match (the COV record pins were also tested against the main tree, which holds CAND: expected difference); HEADs 15cb6b2, 4c1ada2, 605f94d, 026fd97, all clean |
| 13:14 | git rev-parse, git show; git ls-tree, config --get, check-attr (see Git deviation) | [`legacy/demo-seed.sql`](../../../../legacy/demo-seed.sql) at the four revisions | committed bytes 41b2f6a3...66e1 everywhere (blob 17915d5a); working copy CRLF (LF-normalized hash equal) |
| 13:14-13:16 | read | WT-C AGENTS.md, SKILL.md (blob fe88c4f8), agent-roles.md, reviews README 1-660, agent_orchestration.md 60-400, report template, checklist | procedure; ACK |
| 13:15 | read | S02-P008 access log, PM transcription, independence record | failure cause |
| 13:15-13:16 | read; git diff of the main-tree status file against CAND | WT-C and main-tree migration_status.yaml (read only) | ledger passes 1-8, transitions, owner decisions, pending PM entry with owner decision stage-01-stored-value-output-inventory |
| 13:16 | read | WT-C pass-007 report, BA-001-09 and BA-001-10 records, pass-008 report (findings and self-check sections) | open items and leads |
| 13:16 | read; sha256 | pass-006 report header, S02-P006 pm-phase-b-release.json, phase-a-snapshot.md, access log (grep), independence record; S02-P007 independence record, access log (grep), packet (grep), PM transcription | root and coverage-base eligibility |
| 13:17 | git diff --name-status | ROOT..COV, COV..FAILED, FAILED..CAND, COV..CAND into S | 78, 13, 47, 56 files; sealed evidence add-only |
| 13:17 | git diff -U0 --word-diff=plain COV FAILED into S | reconnaissance | 32,261 bytes, SHA-256 8bc1e01f...4cba9 = the hash recorded by the failed reviewer (containment check) |
| 13:18 | git diff -U0; node S/seg-diff.js | reconnaissance COV..FAILED, FAILED..CAND, COV..CAND | 23, 19, 23 hunks; changed segments read |
| 13:19 | node S/wb-dump.js (exceljs from analysis/tools); bsdtar | workbook at WT-B, WT-F, WT-C | 7 cells in 6 rows; only xl/sharedStrings.xml differs |
| 13:20 | bsdtar | [`legacy/xplanner-plus.war`](../../../../legacy/xplanner-plus.war) into S/war; struts-1.2.9, spring-struts, spring-webmvc, spring-web, spring-context jars into S/jars | 964 files, 594 classes; 1399 framework classes |
| 13:21-13:26 | node S/disasm.js, S/index-classes.js, S/q.js | Tiles, message-resource, view-resolver, locale, breadcrumb and forward classes; descriptors | F-001 lead, F-002 lead, findForward evidence |
| 13:27-13:29 | node S/scriptctx.js | 74 JSP and tag files | 109/85 (rule as written), 103/78 (HTML comments blanked) |
| 13:28 | read (understanding only) | `.migration-tmp/stage-01/tools/script-sinks-10.js` | author rule blanks HTML comments; not evidence |
| 13:29-13:30 | node S/pubkeys.js, S/bundle-presence.js | public pages and layout chain, 10 bundles (keys only) | 45 keys, per-bundle claims match |
| 13:30 | node S/cell-seg.js | 7 changed cells | row texts read |
| 13:31 | node S/el-count.js; read (understanding only) | 74 files; `.migration-tmp/stage-01/tools/el-estimate-10.js` | 790 / 65 of 74 / 85 / 0 / template EL 113 |
| 13:32 | node S/citecheck.js | change set and whole records | 67/67 and 506/507 |
| 13:33 | shell command (masking error) | legacy/README.md line 38 | the public factory default login pair appeared in my tool output (bold, not masked by my backtick filter); written to no file |
| 13:33-13:35 | node S/credscan.js | delta, correction records, checklist, CAND records; positive controls on legacy files | 0 credential values; hit classes only |
| 13:35-13:39 | node S/tagreads.js, S/registries.js, S/q.js | tag handlers; static registries; displaytag; FormatDateTag | F-001, F-002 evidence |
| 13:40 | npm --prefix analysis/tools run audit:workbook, audit:project, audit:artifact-links (temp and cache redirected) | main tree (records equal CAND) | all exit 0; 231 documents; tree unchanged |
| 13:41-13:52 | node S/recon-impact.js, S/gen-changeset.js, S/gen-evidence.js | prior ledgers; this folder | change-set.json, comparison-results.json, coverage-reconciliation.json |
| 13:53 on | write; node artifact-reading.js; link simulation; credscan | this folder and S/stage-02-pass-009.md | evidence and report |

## Git deviation

The packet lists rev-parse, status, diff and show between the pinned revisions. I also ran, once each and
read only: `git ls-tree -r` at the candidate revision on the legacy folder (blob ids, also given by
`git rev-parse <rev>:<path>`), `git config --get core.autocrlf` and `git check-attr -a` on the seed file
(line-ending cause, also shown by the LF-normalized hash and the `.gitattributes` file), and `git diff` of
the main-tree status file against the candidate (the file is readable directly). No other revision was
read and no state changed. This is disclosed for the owner's decision.

## Not accessed

The parent `C:/Work/Legacy`, other projects, the user profile (including client tool-results folders and
the session scratchpad), earlier reviewer scratch, the Stage 1 author scratch as evidence (two author tools
read only to understand a counting rule), the Starter repository, earlier-migration links (A2), the web,
any legacy runtime.

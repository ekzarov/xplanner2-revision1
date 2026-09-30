# Access Log - Stage 2 Pass 012 (packet S02-P012)

**What did the pass-012 reviewer read and run, in which order, and where did it deviate?**

All times are UTC on `2026-09-30`, taken programmatically. Only the stamps below are exact; every other step is placed between two stamps and is not given a time of its own. Revisions: ROOT `15cb6b2`, BASE `9667b69` (coverage base, pass 010), PREV `8d137ed` (excluded pass 011), CAND `2c176d4`. "Scratch" is `.migration-tmp/stage-02-p012/reviewer-scratch/`; "runner" is `.migration-tmp/stage-02-p012/tools/safe-run.js`.

## Sequence

| Stamp or interval | Action | Inputs | Output |
|---|---|---|---|
| before `18:06:50Z` | Runner self-test; SHA-256 of the runner and the packet; listing of this evidence folder | runner, [`packet.json`](packet.json) | self-test OK (30 cases); runner `06b6170a...` and packet `7073b2b7...` match; the folder held only `packet.json` |
| before `18:06:50Z` | Packet read in full with the client's file-read tool (Deviation D-2) | [`packet.json`](packet.json) | none |
| `18:06:50Z` | First UTC stamp (Deviation D-1); runner config hash; line counts of the governing texts | runner config | config `209b1134...` matches |
| `18:06:50Z`..`18:10:28Z` | Governing texts through the runner, read from the candidate checkout (the runner refuses repository-root files outside its read roots): [`AGENTS.md`](../../../../AGENTS.md), [`SKILL.md`](../../../../.agents/skills/migration-ba/SKILL.md), [`MIGRATION.md`](../../../../MIGRATION.md) (roles, Source Readiness, Mandatory Reading Order, Stage 2), [`agent-roles.md`](../../../agent-roles.md), [constitution](../../../../.specify/memory/constitution.md) (header, XII, A1-A4), [reviews README](../../README.md) (Comparison Record Contract, Results, Independence, Correction Validation, Attempt Recovery), [`agent_orchestration.md`](../../../agent_orchestration.md) (Credential-Safe Evidence, Operational Incident Assessment, Packet Transport Safety, Diagnostic Command Permissions, Correction-Validation Packets), [`migration_status.yaml`](../../../migration_status.yaml) (bounded ranges) | pinned CAND files | none |
| same interval | Chain records: [pass-011 report](../../stage-02-pass-011.md) and [access log](../S02-P011/access-log.md), [pass-010 incident assessment](../S02-P010/incident-assessment.md) and [PM verification](../S02-P010/pm-incident-verification.json), [pass-010 report](../../stage-02-pass-010.md), [pass-009 F-003](../../stage-02-pass-009.md), [dispositions record](../../../stages/stage-01/stage-02-pass-010-dispositions.md) | CAND checkout | none |
| `18:10:28Z` | Name-status diffs BASE..CAND, BASE..PREV, PREV..CAND, ROOT..CAND (legacy, constitution) and BASE..CAND (legacy, sources, constitution, checklist, skill) | pinned revisions | 22, 12 and 11 files; no legacy, source, checklist or skill change |
| `18:10:28Z`..`18:11:41Z` | `verify-pins.js` (43 comparisons); `git show CAND:legacy/demo-seed.sql` and `git show CAND:.agents/skills/migration-ba/SKILL.md` into scratch; blob hash of the skill file (Deviation D-3) | pins | 43 of 43 match; seed committed bytes `41b2f6a3...`; skill blob `560391d6...` |
| `18:11:41Z` | UTC stamp (temp variables set) | none | none |
| `18:11:41Z`..`18:40:04Z` | Root and base checks: sealed-review diff ROOT..CAND, pass-006 checkpoint times, ledger counts (one inline count ran without temp variables, Deviation D-4), `chain-check.js` | CAND checkout, pinned diffs | as in C-003, C-004 |
| same interval | A4 source against its manifest (`src-manifest.js`); WAR extraction with `unzip` into scratch | [`source-manifest.json`](../../../../sources/provenance/source-manifest.json), [`xplanner-plus.war`](../../../../legacy/xplanner-plus.war) | 1117 of 1117 files match, 803 Java, 39 withheld; 964 files, 594 classes, 102 JARs |
| same interval | Change set: reconnaissance `-U0` diff BASE..CAND into scratch, bounded reads; workbook unzip of the base and candidate checkouts, own cell dumper and diff | pinned checkouts | 24 hunks (+57/-34); 22 cells in 10 rows |
| same interval | Own class-file disassembler `cls.js`; listings for F-002 (`IdSearchHelper`, `OLDIdSearchHelper`, `Note`, `DomainContext`, `ContentSearchAction`, `IdSearchAction`, `HibernateSessionFilter`, `ContentSearchHelper`) and F-003 (`AbstractEditorForm`, `IterationEditorForm`, `TaskEditorForm`, `TimeEditorForm` call sites, `UpdateTimeAction`, `DecimalFormat`, `AbstractFormat`, `XPlannerMessageResources`, `FormatDateTag`, and Struts `MessageResources` extracted from `WEB-INF/lib/struts-1.2.9.jar` into scratch); `callers.js`, `static-fmt.js`; bounded reads of `web.xml`, `editIteration.jsp`, `editTimeEntries.jsp`, `exportLinks.jsp`, `history.jsp` in the extraction | extracted WAR | as in C-012..C-016 |
| same interval | Source cross-checks with bounded `grep` on the cited A4 files (not withheld); `LinkTag` and `AbstractFormat` listings against the source | `sources/xplanner-plus-r426/src` | as in C-009, C-012, C-013 |
| same interval | Rules M and S (`corr.js`, `corr-check.js`; withheld sources read in memory, counts only); script-context rule (`scriptctx.js` with variants) | extracted WAR, A4 source | as in C-010, C-011, C-018 |
| same interval | `provcheck.js`, `wbgrep.js`, `rowcells.js`, `citecheck.js`; the checklist; ROOT..CAND and ROOT..BASE reconnaissance diffs and the root workbook dump; coverage generator and its verifiers (`gen-coverage.js`, `verify-krec.js`, `verify-six.js`, `cov-review.js`) | pinned records, pass-006/007/009/010 ledgers and the pass-010 coverage record | coverage 602 = 76 + 526 + 0 |
| same interval | Two further inline node calls without temp variables (Deviations D-5, D-6) | none | no output |
| `18:40:04Z` | UTC stamp; candidate commit time through the prepared command | CAND | `2026-09-30T20:04:14+02:00` |
| `18:40:04Z`..`18:44:12Z` | Timeline notes appended with a here-document (Deviation D-7); ledger and change-set generators; recount of the removed diff lines; `bash --version` | scratch | ledger 41 checks; change set 24 hunks, +57/-34 |
| `18:44:12Z` | UTC stamp | none | none |
| `18:44:12Z`..`18:52:57Z` | This log, the independence record and the report written; checks of the retained ID lists, `LinkTag#doEndTag` and line numbers, with corrections; `artifact-reading.js` on the report and own `linkcheck.js` | new evidence | no reading errors; 142 links, 0 bad, 0 unlinked paths |
| same interval | Credential scanner `credscan.js`: positive control on the legacy files; change set (C-035); a structure-only print of the README credential line (length and separator counts, no content) to fix the extractor; tightening to secret-bearing contexts; classifiers `credclass.js`, `credclass2.js` (shape, code use, process-document word counts; no value printed); one runner call `node -e 0` and one direct `node -e 0` without temp variables (Deviation D-8) | candidate values in memory | change set: 0 credential values; own evidence: 0 credential values |
| `18:52:57Z` | UTC stamp | none | none |
| after `18:52:57Z` | Final `git status --short` and `rev-parse` of the three checkouts; final credential self-scan, reading-structure and link checks; SHA-256 of the report and the five evidence files | new evidence | see RESULT |

## Deviations And Incidents

1. **D-1: first UTC stamp without temp variables.** At `18:06:50Z` one `node -e` printed the time without TEMP, TMP and TMPDIR set. It wrote nothing and read nothing.
2. **D-2: packet read with the client's file-read tool.** The packet (334 lines) was read once with the client's read tool instead of the runner. Its content is the assignment itself; no credential-pattern line is in it; nothing was persisted outside the project to my knowledge.
3. **D-3: skill blob hash computed with an inline node call without temp variables.** It read my scratch copy of the skill file and printed one hash.
4. **D-4: one inline ledger count without temp variables.** It read the pass-006 ledger in the candidate checkout and printed the four result counts.
5. **D-5, D-6: two no-op inline node calls without temp variables** (`node -e "1"`, `node -e 0`). They produced no output.
6. **D-7: one here-document without TMPDIR.** About 700 bytes of my own notes were appended to a scratch file. Bash `5.2.37` writes a here-document that fits the pipe buffer to a pipe, so a temp file is unlikely; I did not look in the user temp folder to confirm.
7. **D-8: two more no-op `node -e 0` calls**, one through the runner and one directly without temp variables. Neither produced output.
8. **Runner refusals (not deviations):** an unknown `--help` option; reads of repository-root files (read instead from the candidate checkout); `git rev-parse` and `git status` without `-C` on the main tree; one `rev-parse REV:path` form. Each refusal printed only the refusal line.
9. **A failed runner call:** one `node now.js` before the script existed ended with a module-not-found error; nothing else ran.

**Safeguards (my assessment; they do not change the verdict):**
- **Independence:** no deviation exposed authoring context, earlier reviewer scratch, other sessions' files or a Stage 1 conclusion beyond the permitted prior records.
- **Source and scope:** every read was inside the project, of pinned revisions or permitted files. No listing of `.migration-tmp` itself or of another session's folder.
- **Evidence integrity:** no reviewed file changed; the three checkouts were clean at start and at end.
- **Permitted support:** no check result rests on D-1..D-8; each was a timestamp, a hash, a count or a no-op.
- **Disclosure:** no credential value or credential-bearing line was printed. The 39 withheld files and the credential line of the legacy README were read only by my scripts in memory; only counts were printed.

No other deviation occurred: no web, browser, MCP, agents, runtime, network or installs; no git command outside `rev-parse`, `status`, `diff` and `show`; no write outside the allowlist; no client-persisted file opened.

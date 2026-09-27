# Access Log - packet S02-P007 / review pass 007 (correction-validation)

Reviewer: independent BA reviewer (Claude Code subagent launched by PM session
d0ec1166-ffc9-446a-ba86-d768242e6de8, model claude-opus-5-5). Times are ISO-8601
UTC from date -u in the same or nearest shell call; Read-tool calls are bracketed
by neighbouring shell times. Mode: correction-validation (not blind), so prior
reports, evidence, dispositions and the checklist were permitted from the start.
WT-B = .migration-tmp/stage-02-p007/baseline (15cb6b2), WT-C =
.migration-tmp/stage-02-p007/candidate (4c1ada2), S = .migration-tmp/stage-02-p007/reviewer-scratch.

## Injected launch context (not requested)

- I-1 CLAUDE.md of the main tree (entry bridge: read AGENTS.md, follow MIGRATION.md,
  role contract, blind-input restrictions). No project results.
- I-2 userEmail line (personal data, not repeated; not a credential, not evidence).
- I-3 gitStatus snapshot: branch stage-02/pass-007; status "M analysis/migration_status.yaml"
  and "?? analysis/reviews/evidence/S02-P007/"; recent commits 4c1ada2 (Merge PR #19),
  6ff451d (Stage 1 re-entry: correct F-001..F-004 from Stage 2 pass 006), 832b5f4,
  1377f1e (adopt Starter c7d0188 Stage 2 correction validation), e995be1.
- I-4 commit/PR attribution reminder; I-5 environment, tool, deferred-tool, skill,
  agent-type catalogues, MCP server notes (claude-in-chrome, miro) and an auto-mode
  note. None used.
- I-6 CLAUDE.md of WT-C auto-injected on first read of a WT-C file; identical to I-1.
- Client note: two Bash outputs above 30 KB (reviews README, reconnaissance diff)
  were persisted by the client to its tool-results folder under the user profile.
  Not opened; the same content was regenerated in S.

## File access and actions

| Time (UTC) | Action | Path | Note |
|---|---|---|---|
| ~19:30 | read + sha256 | analysis/reviews/evidence/S02-P007/packet.json | 0e70fd7e...403a, matches |
| ~19:30 | git | WT-B, WT-C rev-parse and status | 15cb6b2..., 4c1ada2...; both clean |
| ~19:30 | sha256 | WT-B/WT-C pass-006 report, S02-P006 evidence, records, checklist, dispositions, maintenance record, legacy/* | all packet pins match (see report gates); legacy/demo-seed.sql working copy has CRLF (autocrlf); committed blob identical at BASE and CAND and its bytes match the packet hash |
| ~19:30 | read | WT-C AGENTS.md, SKILL.md (migration-ba), checklist, reviews README (Comparison Record Contract to Stage 2 Correction Validation), report template, agent_orchestration (Error Prevention, Credential-Safe Evidence, Formal pass, Correction-Validation Packets, Read-Only Execution, Batches, Durable Evidence), agent-roles (Assignment to Independence) | instructions |
| ~19:30 | read | WT-C analysis/reviews/stage-02-pass-006.md; analysis/stages/stage-01/stage-02-pass-006-dispositions.md | full |
| ~19:30 | read | WT-C S02-P006 independence-record, phase-a-snapshot, pm-phase-b-release, pm-report-transcription, packet, routing-extract, access-log | full |
| ~19:30 | git | log and diff --stat BASE..CAND | 6 commits, 78 files |
| 19:31:04 | extract | legacy/xplanner-plus.war -> S/war | GNU tar refused; Windows tar.exe: 964 files, 1090 entries |
| 19:31 | git diff | analysis/legacy_reconnaissance.md BASE..CAND | S/recon-diff-u0.txt, 22 hunks |
| 19:31-19:34 | node | S/wb-diff.js (exceljs from analysis/tools) | 29 cells in 26 rows; xlsx parts: only xl/sharedStrings.xml differs |
| 19:34-19:40 | node | S/jcls.js, S/index.js | own class-file reader; 594 classes parsed, version 50 |
| 19:40 | extract | WAR:WEB-INF/lib/struts-1.2.9.jar, spring-webmvc-3.0.5.RELEASE.jar -> S/lib | framework listings |
| 19:40-19:50 | read | WAR descriptors (struts-config, mobile/test configs, action-servlet, test-action-servlet, web.xml, spring-web.xml, tiles-definitions, security.xml, mobile-security.xml) and JSPs cited in the change set | full or cited ranges |
| 19:40-19:50 | node | S/scan-sinks.js, S/ctx.js | binding, navigation and output sink call sites |
| 19:47 | read | legacy/docker-compose.yml | full; contains configured credential values (not reproduced) |
| 19:50 | read | .migration-tmp/stage-01/out/unauth-06.txt lines 31-70 | author scratch, read only to understand the "39 static keys" page set; values masked in display; not used as evidence |
| 19:50-19:58 | node | S/props.js, S/config-consumers.js, S/key-anywhere.js, S/public-keys.js, S/figures.js, S/cite-check.js, S/reflect-scan.js | own parsers and counts |
| 19:55 | node | S/cred-scan.js, S/cred-pair.js, S/cred-mask.js | values from cited source locations in memory, including legacy/demo-seed.sql and the changelog; only counts and masked contexts printed |
| 19:59:12 | npm | audit:workbook in the main tree (xlsx equals CAND) | exit 0, WORKBOOK AUDIT OK, 210 scenarios, 18 epics |
| 20:00 | npm | audit:artifact-links in the main tree before any Markdown evidence was added | exit 0, 222 documents |
| 20:00 | read | WT-C analysis/migration_status.yaml (review_passes, transition_history, blockers), main-tree status | read-only chain check |
| 20:01 | write | analysis/reviews/evidence/S02-P007/change-set.json | S/gen-changeset.js |
| 20:03 | write | analysis/reviews/evidence/S02-P007/comparison-results.json, coverage-reconciliation.json | S/gen-ledger.js |
| 20:05 | write | analysis/reviews/evidence/S02-P007/independence-record.md, access-log.md | this file |
| 20:05-20:11 | write | S/stage-02-pass-007.md | report; artifact-reading.js exit 0, no errors; S/link-sim.js (link audit simulated at analysis/reviews/): 0 unlinked paths, 43 relative links resolve |
| 20:11 | node | S/cred-pair.js, S/cred-mask.js, S/cred-distinct-mask.js over this folder and the report | one pair-like role-name phrase found in comparison-results.json and removed; S/gen-ledger.js rerun (counts unchanged) |
| 20:12:29 | node | final CHK-009 self-scan of this folder and the report | 0 credential values (0 pair form, 0 assignment form; 9 raw matches of one short value that is an ordinary role word, reviewed masked) |

Temp redirection for node/npm: TEMP, TMP, TMPDIR = .migration-tmp/temp;
npm_config_cache = .migration-tmp/npm-cache.

## Not accessed

Any folder outside the project; the Starter folder; earlier reviewer scratch
directories; author scratch except the one output named above; git history outside
BASE..CAND; earlier-migration links (A2); web, browser, MCP tools, other agents;
any runtime, install or download.

## Repository state

git status --short of the main tree at 19:30, 19:59, 20:05 and 20:13: " M analysis/migration_status.yaml"
and "?? analysis/reviews/evidence/S02-P007/" (PM files plus this pass's evidence only).
WT-B and WT-C: empty at start and at 20:13 (HEADs unchanged). No Stage 1 record, checklist, status,
report or earlier evidence was edited.

## Reviewer scratch (supporting, not durable evidence; SHA-256)

| File | SHA-256 |
|---|---|
| jcls.js | becb803b5020fe2526c3e16c3ea6793e66f77c629926f394111117239100f180 |
| index.js | a166097f8dbd1b8ad5cb9535e933cc4220bcc5ffcb168a8fc6eec98ceab1ca2f |
| scan-sinks.js | d72ead63d37ef38a0d09e3d80b14d289c5e7cd3a16c45b5e685d36310292c288 |
| ctx.js | e596f97f529dd28b3cb0cf780aaf22f73da081919750270fd43f0fb0f0ed5ee2 |
| wb-diff.js | 923c252597f4573e1c93f99cb0123ad9820197f53e522627c19566aa1d7c96ce |
| reflect-scan.js | d5d4ba7c6a920d7b5e54580d12408687c043af50744a8f27bd8d45d9d65a2cc7 |
| props.js | 501b4bf4d41831ebd9b308ecedb99573a3ed691a1885e2354d3ab882705d5e05 |
| config-consumers.js | a901c584d46ac874385a783650a617e20949795b89ccbcd8d45b78f0e5cb4e57 |
| key-anywhere.js | 692ed05d416e6e7ac1b0b28d95aa7b21e7409722c8947dfaaf73586fb4ea84b7 |
| public-keys.js | d6c3495f2af641b7afb47eb90a03c76cb04617b05e4b014d29bd607929bb3803 |
| figures.js | 23ce653a36ccb20d795dd8ee6442e27392adbeaf0705286f6b1acf6da3d5142e |
| cite-check.js | d531317a9e67546a134801d13a66d7184f88b12187f07cd0f5dce46fe28711e2 |
| cred-scan.js | 0a67391870c12e47869d129487910035cf52da69aeb642711ca2b7d5089ddbb7 |
| cred-pair.js | b832cc84816b4e5de05a8acf7807c04050d836b076ad1e52da55aa0269611d4e |
| cred-mask.js | 7b472242e010afc3e4fd3a814201cd884d7e9427c9a51f7026bc55921921b4ba |
| gen-changeset.js | 54df10be3f9577c8e9187cc12d3c52cb57fe9410604255a18891eb6bc723ec80 |
| gen-ledger.js | 7d7f19a0761058ed347e26953fad9f0f32420e7567c912f115a02d42cc7bf856 |
| cred-distinct-mask.js | 7ce23da95761d38feae742d61bd3fdd66dcc1fd10493e67a80e931d555045802 |
| link-sim.js | 2182afdb74addfb9bc6d14c6a0ffaa107a2e46cd968824eb6387a117138efc5d |
| class-index.json | d3cf97de4044483d7a6c8a1421cf303a1775b17c7656d937728484f06bdad548 |
| sinks.json | 73cc37441aab29dea9efa5c678729ad65bb5f16d1bf5792a9a99741b894a9dd5 |
| wb-diff.json | cf9f9f80dcd8b8158c02f6fb455a0a8f066738c5f2ffee15f5a6f76771c83f5c |
| wb-changed-delta.txt | 829377d19310aaae3047f52667693effe6b232e7aaf55b815f3c904d401848fe |
| reflect-scan.json | 3cba2553b18b08798b1e2a900deab15d0fa7e1fa352e5130001a128d204c93b8 |
| config-consumers.json | 9a62bf55f83d8136d6900fcff5c81a4393e9c86c7ae2bc07d9ddc1e8c4306532 |
| public-keys.json | 33146c464b3a6ef2a429ee1fda5cb7cfb10fe08d23f95737f63be671a16b9a6a |
| figures.json | 472d3e57e5f0037216fb269528a7c47d9128d32eb6d98b4e42336c0691fe65ff |
| cite-check.json | 83005b321322740fa693df67d7476e0efb158ad23283cd636b16231af9c6fea1 |
| cite-check-changed.json | c15e305e6a64dc3a08e21b12cd5330ddce7619df9fd16ba55bd9788d963c3bbb |
| nav-redirect-ctx.txt | 69eec81d439f8c3a66acd6e1fc17012895dcfb08255e95933353d7179bebd2f7 |
| listing-EditObjectAction.txt | 8eabac0e152f636eca82d9cf7a3b87ae29dd8719716296de5a209d497db97362 |
| recon-diff-u0.txt | 8c7870d2b8cf950e09d8b5a544fcf54a6e3d776f49f6b2aa4ef63f645787e0a4 |

All scratch outputs are reproducible from the WAR, the two pinned worktrees and the
scripts above.

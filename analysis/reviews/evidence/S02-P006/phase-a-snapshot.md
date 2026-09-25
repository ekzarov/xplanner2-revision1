# Phase A Snapshot - Stage 2 pass 006 (packet S02-P006, task BA-002-06)

- Saved at: 2026-09-25T13:23:33Z (before any Phase B input was opened)
- Reviewer: claude-opus-5-5-ba-reviewer-p006, session a700bf31602b78dd0
- Reviewed revision: 15cb6b26946f73596177eba8cead333383d9f728 (sparse worktree
  .migration-tmp/stage-02-p006/phase-a; `git status --short` empty at
  2026-09-25T12:54:46Z, 12:56:56Z and 13:23:33Z)
- Legacy source: legacy/xplanner-plus.war sha256
  46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc

## Frozen Phase A evidence

| File | SHA-256 | Role |
|---|---|---|
| analysis/reviews/evidence/S02-P006/phase-a-inventory.json | 8f734d0d25c532c1663dcd85f0f3d9ccf9ce820a49db23ed3c765efc04e64cbe | Phase A inventory: 138 A-NNN items (A-001..A-138) and 15 exhaustive breakdowns (BD-*) |
| analysis/reviews/evidence/S02-P006/independence-record.md | d41d5de31f87fec9a249b7b079a4c5482bd889f24e55f81a1c6e716a71829975 | Eligibility and disclosed exposure |

The access log (analysis/reviews/evidence/S02-P006/access-log.md) keeps growing
in Phase B; its checkpoint hash is given in the CHECKPOINT message.

## Supporting reviewer-scratch artifacts (not durable evidence)

Reproducible from the WAR with the scripts below; hashes identify the state
that fed the inventory.

| File | SHA-256 |
|---|---|
| reviewer-scratch/war-cd.tsv | 97305cbf64c6ce9440a1e6a72d46c377a5daa5d885ca2edaa47d0f1ae97df325 |
| reviewer-scratch/war-entries.txt | 2867053cea9abb2e7915af340a19446067b616efc2722c71f6285b39a4ec6e8e |
| reviewer-scratch/class-index.json | 923619794b054bdfa8638b6f5f16ca0603005eba06ea54ce87a035ac0066bd4f |
| reviewer-scratch/jsp-scan.json | 0d92fae45b90053a433929e21377256b59db87d78fa69831be2417659eb4b329 |
| reviewer-scratch/desc-check.json | dca48b3e727313b5537c8cc8c4431f958e8e1584e0dcff104fb770cab5f6bac1 |
| reviewer-scratch/prop-consumers.json | 29dbbc17704a6960bd4c3e683dc2c7a61e31a8638b4132b2c352390f6fbf36a2 |
| reviewer-scratch/wiring-check.json | 1d226c0731a0e3b3aaf088634e94ee9713ed79b6f089b679404e7a81f6f860c3 |
| reviewer-scratch/zipdir.js | 2fc57585e56c458fec662212251087248dcd409291cfcde5d143c956c8b88f6f |
| reviewer-scratch/cls.js | 742395b93ac2fab7ae482a0c5aaab3adc44d03ae988cc3047edc3b5a2130bce7 |
| reviewer-scratch/sum.js | f04b4543935faf06f3d540918ef61db2bdccf8b868d8422e84d9316a338ed626 |
| reviewer-scratch/index-classes.js | f93739fbcfedd42f5acf77870783c351fdf6855754f041b3393473a0cb85da85 |
| reviewer-scratch/jsp-scan.js | a51e2caf6985b87c695463c246f53d4f45a0d29f51bbf8521b42da34553554d5 |
| reviewer-scratch/desc-check.js | c97a4088107688ed0da70eaa976f04526ec7c80f3b4148ac4188f16074af2235 |
| reviewer-scratch/prop-consumers.js | 56ea4b1de995d85dc20c336e9950f710ca7f7e76819ceb4c069135d716097e74 |
| reviewer-scratch/wiring-check.js | 401f2736e6e9c63eca1e4886f8f416605f997ad8165b5a200796fa07c502e4f8 |
| reviewer-scratch/cred-scan.js | e7520ca652636a2744b48f0c0fb4f95b81703e54fa2ff0d7a68c94d56d476457 |
| reviewer-scratch/gen-inventory.js | 1cdf77c43e567a3b527f24287dc6a84c2d21f29036c5441db80c2912124ed851 |

## Coverage and limits

- Covered: every WAR entry by kind; all web.xml servlets, mappings, filters,
  listeners, error pages; all 87 Struts actions (BD-ACTION-COVERAGE, no
  uncovered action); all 74 JSP/tag files (BD-JSP-COVERAGE, none uncovered);
  Spring XML contexts and autowiring of 80 action beans; 46 SOAP operations;
  REST, Spring MVC, iCal and Cewolf endpoints; 21 JPA entities and cascades;
  29 named queries; 106 property keys with consumers; Liquibase changelog;
  background jobs; integrations; credential locations (no values).
- Limits: bytecode read without a decompiler (behavior from call references and
  constants, strength static-inferred); no runtime observation;
  legacy/demo-seed.sql not opened (prepared fixture); resource bundle texts and
  static assets enumerated but not analysed line by line.
- Credential scan (reviewer-scratch/cred-scan.js, 15 candidate values from
  cited source locations, positive control on source files: 12 contextual
  hits): 0 credential values disclosed in the Phase A evidence. All raw
  matches are common words that coincide with short values (product name,
  role/account name "sysadmin", role name "admin", the words "root",
  "username", "password"); no hash or long literal matched.

## Checkpoint statements

- The inventory was saved before any filled Stage 1 input was opened.
- Later discoveries will be recorded in Phase B, not backfilled into Phase A.

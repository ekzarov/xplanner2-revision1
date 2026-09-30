# Access Log - Stage 2 Pass 010 (packet S02-P010)

**What did the pass-010 reviewer read and run, in which order, and where did it deviate?**

Times are UTC on 2026-09-30 and approximate to a few minutes unless marked exact. Revisions: ROOT `15cb6b2`, PREV `026fd97`, CAND `9667b69`. "Scratch" is `.migration-tmp/stage-02-p010/reviewer-scratch/`.

## Sequence

| Time | Action | Inputs | Output |
|---|---|---|---|
| 13:3x | `sha256sum` of the packet; `ls` of this evidence folder; `git rev-parse HEAD`; `git status --short` (main tree) | [`packet.json`](packet.json) | hash `d92c1bbb...0cb3` matches; folder held only `packet.json` |
| 13:3x | Revision and state of the three checkouts (`git -C <checkout> rev-parse HEAD`, `git status --short`) | `.migration-tmp/stage-02-p010/{root,previous,candidate}` | ROOT, PREV, CAND as pinned; all clean |
| 13:3x | SHA-256 of every packet pin in the candidate checkout and in the main tree | 26 pinned files | all match; [`legacy/demo-seed.sql`](../../../../legacy/demo-seed.sql) checkout reads `2d32f7d5...` in both trees |
| 13:3x | `git show <rev>:legacy/demo-seed.sql` at ROOT, PREV, CAND; CR-stripped hash of the checkout; `git diff --stat ROOT CAND -- legacy/` | seed blob | blob `41b2f6a3...66e1` at all three; CRLF checkout only; no legacy diff |
| 13:3x | Read governing texts in the candidate checkout | `AGENTS.md`, the BA `SKILL.md` (blob `560391d6...`), reviews README (Comparison Record Contract, Results, Independence, Stage 2 Correction Validation, Attempt Recovery), `agent_orchestration.md` (Credential-Safe Evidence, Operational Incident Assessment, Packet Transport Safety, Formal Independent Pass, Correction-Validation Packets), constitution A1-A4, `MIGRATION.md#source-readiness`, `source-assessment-001.md`, `source-intake-decision-001.md` | none |
| 13:3x | Regenerated file lists PREV..CAND and ROOT..PREV (`git diff --name-status`) into scratch | pinned revisions | 83 and 100 files |
| 13:4x | Read prior control evidence | pass-009 report, incident companion, status ledger review entries and owner decisions (CAND) | none |
| 13:4x | `which`/version checks; **listing of `.migration-tmp/`** (see Deviation 1); listing of [`analysis/tools/node_modules`](../../../tools/node_modules) and `sources/` | tool presence | names only |
| 13:42 (exact) | WAR extraction with `unzip` into scratch | [`legacy/xplanner-plus.war`](../../../../legacy/xplanner-plus.war) (hash re-verified) | 964 files, 594 classes, 102 JARs |
| 13:4x | Workbook blobs of ROOT, PREV, CAND via `git show` into scratch; package parts hashed; own cell dumper `wbdump.js` | [`analysis/legacy_user_flows.xlsx`](../../../legacy_user_flows.xlsx) | 2 parts differ; 291 cells |
| 13:4x | Reconnaissance diff PREV..CAND (`-U0` and full) into scratch; read in bounded chunks | [`analysis/legacy_reconnaissance.md`](../../../legacy_reconnaissance.md) | 26 hunks; see Deviation 2 |
| 13:5x | Own disassembler `disasm.js`; parse of all 594 classes (positive control) | WAR classes | 4739 methods, 0 parse errors |
| 13:5x | Correction record read | [`analysis/stages/stage-01/source-reconciliation-001.md`](../../../stages/stage-01/source-reconciliation-001.md) (CAND) | none |
| 14:0x-15:5x | Per-row bundles (`bundle.js`) with credential-safe source views (`srcview.js`: literals of the 39 withheld files masked, credential-like lines replaced) and WAR bytecode; own call graph `callgraph.js`; body comparison `bodycheck.js`, `bodyall.js`; registry scan `regscan.js`; correspondence scripts `methodcorr.js`, `strcorr.js`, `warsrc.js`; citation checks `citecheck.js`, `warcite.js`; figure re-execution `figures.js` | extracted WAR, `sources/xplanner-plus-r426` (read-only), the bundled Struts and Spring JARs extracted into scratch | scratch files only |
| 15:3x | Pass-007 ledger read to identify the obligations pass 009 had retained through pass-007 check IDs | [`analysis/reviews/evidence/S02-P007/comparison-results.json`](../S02-P007/comparison-results.json) (CAND) | none |
| 15:5x | Credential scan `credscan.js`, `credclass.js`, `credctx.js` (values in memory only; ids, lengths, counts and masked contexts printed) | credential-bearing sources; the change set | 0 values |
| 16:3x | Evidence generation (`gen.js`, `genchange.js`) and this record | scratch results | files in this folder |
| end | Report written to scratch; `artifact-reading.js` on the report; self-scan of new evidence; final `git status --short` of the checkouts | report | see RESULT |

## Deviations And Incidents

1. **Listing of the parent scratch folder.** One `ls .migration-tmp/` (inside the project folder) displayed the names of PM, author and earlier reviewer scratch files and folders. I opened none of them, used no name as evidence and derived no conclusion from them. Independence, source scope and evidence integrity are unaffected: the names carry no Stage 1 conclusion, and every claim here rests on my own reads of the WAR, the source and the pinned records.
2. **Client spill file.** The client persisted the output of one `awk` line-range read of my own scratch diff (reconnaissance PREV..CAND, about 30 KB) to a file under the user profile (`.../tool-results/b8kiio7l3.txt`). I did not open it; I re-read the same scratch file in smaller chunks. The file holds repository content that this mode permits; its client retention is outside my control.
3. **Temporary-directory variables.** The packet asks to set TEMP, TMP and TMPDIR to `.migration-tmp/temp` before running node. I set them for part of the node runs only. My scripts write only to scratch and to this folder and create no temporary files; whether node itself wrote anything to the default temp location is not known to me. No result depends on it.
4. **Credential masking.** No credential value was printed. Source lines matching a credential pattern were replaced by placeholders, withheld-file literals were masked, masked bytecode constants were compared by hash only, and [`legacy/README.md`](../../../../legacy/README.md) line 38 was read in memory by the scanner only and never displayed.

No other deviation: no git command outside rev-parse, status, diff and show on the three pinned revisions; no web, browser, MCP, agents, runtime, network or installs; no write outside the allowlist.

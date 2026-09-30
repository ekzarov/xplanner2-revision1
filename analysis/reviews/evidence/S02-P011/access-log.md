# Access Log - Stage 2 Pass 011 (packet S02-P011)

**What did the pass-011 reviewer read and run, in which order, and where did it deviate?**

Times are UTC on 2026-09-30 and approximate to a few minutes unless marked exact. Revisions: ROOT `15cb6b2`, PREV `9667b69`, CAND `8d137ed`. "Scratch" is `.migration-tmp/stage-02-p011/reviewer-scratch/`.

## Sequence

| Time | Action | Inputs | Output |
|---|---|---|---|
| 15:0x | SHA-256 of the packet; `git rev-parse HEAD` and `git status --short` (main tree); listing of this evidence folder | [`packet.json`](packet.json) | hash `ababa75e...2205` matches; folder held only `packet.json` |
| 15:0x | Revision and state of the three checkouts; listing of `.migration-tmp/stage-02-p011/` | `.migration-tmp/stage-02-p011/{root,previous,candidate}` | as pinned; all clean; see Incident 3 |
| 15:0x | Pin verification with own `verify-pins.js` into scratch | 57 comparisons over the packet pins | 53 direct matches; [`legacy/demo-seed.sql`](../../../../legacy/demo-seed.sql) matches by committed blob at ROOT, PREV and CAND (checkout CRLF) |
| 15:0x | Read governing texts | [`AGENTS.md`](../../../../AGENTS.md), [`SKILL.md`](../../../../.agents/skills/migration-ba/SKILL.md) (blob `560391d6...`), [`MIGRATION.md`](../../../../MIGRATION.md) (Source Readiness, Mandatory Reading Order, Stage 2 Independent Control), [reviews README](../../README.md) (Comparison Record Contract, Results, Independence, Stage 2 Correction Validation, Attempt Recovery), [`agent_orchestration.md`](../../../agent_orchestration.md) (Credential-Safe Evidence, Operational Incident Assessment, Packet Transport Safety, Formal independent pass, Correction-Validation Packets, Packet Contents), constitution A1-A4, [`source-assessment-001.md`](../../../source-assessment-001.md), [`agent-roles.md`](../../../agent-roles.md) (assignment and results), the report template | none |
| 15:1x | Read prior evidence | [pass-010 report](../../stage-02-pass-010.md), [`stage-02-pass-010-dispositions.md`](../../../stages/stage-01/stage-02-pass-010-dispositions.md) | none |
| 15:1x | `git diff --name-status PREV CAND` into scratch; `which` for tools (see Incident 1) | pinned revisions | 12 files; no `javap` or `java` |
| 15:1x | `git diff PREV CAND -- analysis/migration_status.yaml` into scratch, read in a bounded excerpt | status file | pass-10 entry and two transitions added |
| 15:1x | Pass-010 access log and independence record; the pass-010 packet boundaries; the operational-mandate departure record; status review ledger and owner decisions | CAND checkout | pass 010 disclosures without incident disposition (B-001) |
| 15:2x | Check that the incident rule is in force at PREV and CAND | reviews README, `agent_orchestration.md` in both checkouts | present at both |
| 15:2x | Root 006 checks: sealed-evidence add-only diff ROOT..CAND; Phase B release record; own count of the pass-006 ledger | S02-P006 evidence (CAND) | as in C-003 |
| 15:2x | Workbook blobs of PREV and CAND via `git show` into scratch; unzip; own cell dumper `wbdiff.js`, `wbrows.js` | [`analysis/legacy_user_flows.xlsx`](../../../legacy_user_flows.xlsx) | 2 parts differ; 22 cells in 10 rows |
| 15:2x | Reconnaissance `-U0` diff PREV..CAND into scratch; hunk headers mapped to section headings | [`analysis/legacy_reconnaissance.md`](../../../legacy_reconnaissance.md) | 24 hunks, +57/-27 |
| 15:2x | Structure of the pass-010 coverage record (keys and counts only) | [`coverage-reconciliation.json`](../S02-P010/coverage-reconciliation.json) | 568 items, 20 new, 588 |
| 15:3x (15:32:09 exact) | `date -u`, then Incident 2 | candidate checkout | one commit timestamp |
| 15:3x | WAR re-hash and extraction with `unzip -q` into scratch; count of the withheld-file list in the allowlist | [`legacy/xplanner-plus.war`](../../../../legacy/xplanner-plus.war); [`xplanner-plus-r426-allowlist.json`](../../../../sources/provenance/xplanner-plus-r426-allowlist.json) | 964 files, 594 classes, 102 JARs; 39 withheld paths |
| 15:3x | Evidence generation (`gen-changeset.js`) and this folder; report written to scratch | scratch results | files in this folder |
| end | Credential self-scan `credscan.js` (values in memory only; counts printed) and `credclass.js` (masked contexts of the hits); `artifact-reading.js` on the report; own `linkcheck.js`; final `git status --short` | new evidence and report | 0 credential values (7 word-collision hits); no reading errors; 0 link problems |

**Stop point.** After C-008, I stopped substantive work as the assignment requires for an inadmissible chain. I did not validate the claims of the change set, open the upstream source for review or compare bytecode.

## Deviations And Incidents

1. **`PATH` printed.** A `which javap java unzip node` call printed the full `PATH` variable for the two missing tools, including directory names under the user profile. No file was opened or listed there. The output held no repository content, no credential and no Stage 1 conclusion, and no result depends on it.
2. **Git command outside the packet list.** At about 15:32 I ran `git -C .migration-tmp/stage-02-p011/candidate log -1 --format=%cI` to obtain a timestamp. The packet permits only `rev-parse`, `status`, `diff` and `show`; `git show -s --format=%cI` would have been permitted. The command read the candidate commit object of the pinned revision and printed one commit timestamp (`2026-09-30T17:24:08+02:00`). It changed nothing, showed no message, author or content, supplied no evidence and supports no conclusion in this pass.
3. **Listing of this pass's folder.** One `Get-ChildItem .migration-tmp/stage-02-p011` showed the PM file name `build-packet.js` next to the checkouts. I did not open it and used nothing from the name.
4. **Credential masking.** No credential value was printed. [`legacy/README.md`](../../../../legacy/README.md) line 38 and the 39 withheld files were read by the scanner in memory only; only counts were printed.

**Consequence of Incident 2.** The S02-P011 assignment states that a violation of its hard boundaries invalidates the pass, and its git boundary names the four permitted commands only. I therefore record this attempt as `invalid`. The stricter assignment rule applies before [Operational Incident Assessment](../../../agent_orchestration.md#operational-incident-assessment); an invalid attempt cannot be promoted by approval.

**Safeguards (reviewer assessment, for PM verification; they do not change the verdict):**
- **Independence:** kept. No item exposed authoring context, earlier reviewer scratch or a Stage 1 conclusion.
- **Source and scope:** only pinned revisions and permitted files were read. Incident 2 read one object of the pinned CAND revision.
- **Evidence integrity:** no reviewed file changed. The three checkouts are clean at the end.
- **Permitted support:** no check result rests on Incidents 1-3.
- **Disclosure:** no credential or sensitive value was emitted.

This pass supplies no coverage, so these incidents cannot affect retained evidence. The eligibility blocker B-001, found before Incident 2 and independent of it, is preserved in the report as a lead that PM can verify from the status file alone.

No other deviation occurred: no web, browser, MCP, agents, runtime, network or installs, and no write outside the allowlist.

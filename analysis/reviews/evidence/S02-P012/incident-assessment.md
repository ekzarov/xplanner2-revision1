# Operational Incident Assessment - Stage 2 pass 012 (packet S02-P012)

**Were the operational deviations of pass 012 material to the review, and what is still unknown?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Assessment: `non-material` - deviations D-1..D-8 of Stage 2 pass 012, and D-9 and D-10 found during this preparation; owner decision on the assessment pending**
>
> - **D-1, D-3..D-6, D-8:** direct inline `node -e` calls without TEMP, TMP and TMPDIR. They printed a timestamp, a hash, four counts or nothing. The runner call in D-8 was refused.
> - **D-2:** the packet was read once with the client's file-read tool instead of the runner.
> - **D-7:** one here-document of my own notes (989 bytes) was written without TMPDIR.
> - **D-9 (new):** two direct reads longer than a screen (a status-file grep and a template outline) did not go through the runner.
> - **D-10 (new):** one command used process substitution and `sort` without TMPDIR.
>
> All five safeguards are verified from permitted evidence. The runner log, the environment flags, the unchanged compile cache and a regeneration of the outputs support them. Bounded unknowns remain: whether the client keeps its transcript, and whether D-7 or D-10 used a temp file (both are expected to use pipes). No finding, retained item or reported fact rests on a deviation. This is an assessment for the owner, not an approval.
>
> **Details:** [Safeguards](#read-safeguards) / [Classification](#read-classification) / [Owner decision on the assessment: pending](#read-owner-decision-on-the-assessment-pending).

<details>
<summary><strong>Contents</strong></summary>

- [Declarations](#read-declarations)
- [Assessor Identity And Limits](#read-assessor-identity-and-limits)
- [Common Facts](#read-common-facts)
- [Incidents](#read-incidents)
- [Safeguards](#read-safeguards)
- [Classification](#read-classification)
- [Unknowns](#read-unknowns)
- [Residual Risks](#read-residual-risks)
- [Prevention](#read-prevention)
- [Owner decision on the assessment: pending](#read-owner-decision-on-the-assessment-pending)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-declarations"></a>

## Declarations

- Incident session: a1d8c39bcc8758c6c
- Incident report SHA-256: 389f18dbde908896ab9e12dc200c301fdd07c1176d9f54d59d8ab4594d2c53fe
- Incident classification: non-material
- Incident independence: verified
- Incident source scope: verified
- Incident evidence integrity: verified
- Incident permitted support: verified
- Incident disclosure: verified

The report is [`analysis/reviews/stage-02-pass-012.md`](../../stage-02-pass-012.md). The hash above is that of my scratch report (`0389168d...86be`) with its 2 session tokens replaced by `a1d8c39bcc8758c6c`, as PM stated; the copied report hashes to the same value. This companion does not change the report, its verdict, its findings or any evidence hash.

<a id="read-assessor-identity-and-limits"></a>

## Assessor Identity And Limits

- **Assessor:** the pass-012 reviewer itself, a Claude Code subagent (model `claude-opus-5-5`) of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. This is a self-assessment under step 2 of [Operational Incident Assessment](../../../agent_orchestration.md#operational-incident-assessment); PM verifies the support, and the owner decides.
- **Procedure authority:** PM request of this session; it is preparation only.
- **Sources of fact:**
  - my session record of the exact commands;
  - the runner's own log `.migration-tmp/stage-02-p012/reviewer-scratch/safe-run.log.jsonl`, with 212 entries from `18:06:40.864Z` to `18:53:51.742Z`, which brackets the direct calls;
  - my scratch files;
  - a regeneration of the long reads into the scratch.
- **Limits:**
  - Direct calls are not in the runner log, so their times are bracketed, not exact.
  - I cannot see the client's transcripts, spill files or retention, or the user temp folder. I opened nothing under the user profile or temp folders.

<a id="read-common-facts"></a>

## Common Facts

**Allowed inputs:**
- read-only, the project folder, the three pinned checkouts, [`legacy/`](../../../../legacy) and `sources/`;
- write, this evidence folder (except `packet.json` and `pm-*.json`), `.migration-tmp/stage-02-p012/reviewer-scratch/` and `.migration-tmp/stage-02-p012/temp/`;
- git, only `rev-parse`, `status`, `diff` and `show` through the runner.

The packet required the runner for every node run, every git call and every read longer than a screen, and the temp variables for any direct node run.

**What unset temp variables could cause, and the evidence:**
- **Node.** Node writes temporary files only when a feature asks for it.
  - The compile cache writes only when `NODE_COMPILE_CACHE` is set or code calls `module.enableCompileCache()`.
  - Diagnostic reports need `--report-*` flags, `NODE_OPTIONS` or `process.report` settings.
  - V8 coverage needs `NODE_V8_COVERAGE`.
  - `node -e` keeps no REPL history.
- **Evidence for my environment**, inherited by every command; set/unset only, printed by `incident-facts.js` through the runner:
  - `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `NODE_REPORT_DIRECTORY`, `NODE_REPORT_FILENAME`, `NODE_V8_COVERAGE` and `NODE_REPL_HISTORY` are unset.
  - `process.report.reportOnFatalError`, `reportOnUncaughtException` and `reportOnSignal` are `false`.
  - No `-e` code of mine calls a compile-cache or report API, and no direct call failed with a fatal error.
  - Neither the runner nor [`artifact-reading.js`](../../../tools/artifact-reading.js) contains `enableCompileCache` or `NODE_COMPILE_CACHE`.
  - The only compile cache in reach is the one in our allowlisted temp folder. It was created before this pass (`15:57:08Z`), and none of its 99 entries changed after `18:06Z`.
  - No scratch script of mine uses `os.tmpdir`, `mkdtemp` or a temp variable.
- **Bash here-documents and process substitution.** Bash `5.2.37` writes a here-document smaller than the pipe buffer to a pipe, and otherwise to a temp file in TMPDIR. Process substitution uses `/dev/fd` when it exists; `/dev/fd` is present here.
- **Other tools.** GNU `sort` spills to TMPDIR only for inputs larger than its memory buffer; my inputs were under 200 lines. GNU `sed -i` writes its temporary copy beside the target in the scratch. `unzip -d` extracts directly into its target.

<a id="read-incidents"></a>

## Incidents

| ID | Exact command or event | When (UTC `2026-09-30`) | Read or emitted (no values) | Audience | Retained output | Unknowns | Temp-variable effect and evidence |
|---|---|---|---|---|---|---|---|
| D-1 | `node -e "console.log(new Date().toISOString())"`, in one command with `sha256sum` of the runner config and `wc -l` of ten governing files | printed `18:06:50.305Z`, between runner entries `18:06:40.864Z` and `18:06:53.806Z` | one timestamp; one config hash; line counts | my session context and the owner's client display and transcript | the timestamp in the [access log](access-log.md); none otherwise | client retention | none: no cache, report or history feature enabled (Common Facts) |
| D-2 | the client's file-read tool on [`packet.json`](packet.json), 334 lines, instead of the runner | before `18:06:50Z`, in parallel with the refused runner call `18:06:40.864Z` | the whole packet, which is permitted input; the scan finds no credential value in it (only the collisions listed under Disclosure) | as D-1 | none in any file; the result was shown inline, with no spill notice in my session record | whether the client persisted the tool result outside the project (no notice was given) | none: no temp variable involved; the client tool is outside my control |
| D-3 | `node -e` computing the git blob id of my scratch copy `skill-cand.md` | right after runner entry `18:11:23.964Z` (`git show` of the skill file), before the stamp `18:11:41Z` | one SHA-1 | as D-1 | the blob id in the report and RESULT | none | none (Common Facts). The id was recomputed through the runner with `blob.js` in this preparation: `560391d617ed24f5269b9d594c65056348e9f021`, equal |
| D-4 | `node -e` counting the result values of the pass-006 ledger in the candidate checkout, after a bounded `grep` of the pass-006 snapshot and access log | between runner entries `18:11:52.809Z` and `18:12:16.757Z` | four counts (519/17/3, total 539) | as D-1 | none; the counts in the report come from `chain-check.js` (runner, `18:12:16.757Z`), which gives the same figures | none | none (Common Facts) |
| D-5 | `node -e "1"` before a `grep` of my scratch `withheld.json` | between runner entries `18:14:33.446Z` and `18:15:40.502Z` | nothing | as D-1 | none | none | none: no code ran beyond a literal |
| D-6 | `node -e 0` in a no-op command | between runner entries `18:26:13.547Z` and `18:26:42.057Z` | nothing | as D-1 | none | none | none |
| D-7 | `cat >> notes-timeline.txt <<'EOF' ... EOF` without TMPDIR | between runner entries `18:40:04.939Z` and `18:42:48.740Z` | 989 bytes of my own notes (file names, stamps, no repository content, no credential), written into my scratch | as D-1 | the scratch notes file (2069 bytes) | whether Bash used a temp file | 989 bytes is below any pipe buffer size, so a pipe is expected. I did not look in the user temp folder to confirm |
| D-8 | `node -e 0` once through the runner and once directly | runner call refused at `18:50:56.550Z` ("script outside the allowed roots"); direct call between runner entries `18:51:22.415Z` and `18:51:31.712Z` | nothing | as D-1 | the refusal line in the runner log | none | none |
| D-9 (new) | two direct reads longer than a screen: a `grep ... migration_status.yaml` of Stage 2 ledger fields (lines containing a credential keyword filtered out, `head -150`), and a `grep` outline of the report template (`head -120`) | status grep between runner entries `18:07:50.238Z` and `18:08:20.114Z`; template outline between runner entries `18:38:16.565Z` and `18:38:55.943Z` | about 139 and 118 lines of committed CAND text (status fields and ledger scopes; template headings) | as D-1 | none; regenerated into scratch (`regen-d9-status.txt`, `regen-d9-template.txt`) | client retention | none: `grep`, `head` and `cut` do not use temp files. The runner rule serves masking and bounding. The regenerated outputs hold no credential value (Disclosure) |
| D-10 (new) | `diff <(tail -n +2 sc-a.txt \| sort) <(tail -n +2 sc-b.txt \| sort)` without TMPDIR, after two runner runs of `scriptctx.js` | right after runner entry `18:43:15.116Z` | two lists of about 80 lines of my own output (file:line and output kind, no content) compared; 7 differing lines printed | as D-1 | none; the lists are in scratch | whether a temp file was used | `/dev/fd` is present, so process substitution uses pipes; `sort` inputs under 100 lines stay in memory |

Other direct commands of this pass were bounded (screen-size or shorter) `grep`, `sed -n`, `cut`, `ls`, `find`, `sha256sum`, `wc` and `unzip` calls on permitted paths. The `unzip` calls wrote directly into the scratch. The `sed -i` edits changed only scratch scripts and the scratch report. Runner refusals are recorded in the access log; each printed only its refusal line.

<a id="read-safeguards"></a>

## Safeguards

| Safeguard | Value | Evidence and exact limits |
|---|---|---|
| independence | verified | No deviation exposed authoring context, earlier reviewer scratch or another session's file. D-2 and D-9 read permitted chain records that this non-blind mode reads anyway. D-1, D-3..D-8 and D-10 touched only my own scratch, committed CAND files or nothing. See the [independence record](independence-record.md). |
| source_scope | verified | Every read was inside the project: the packet, committed CAND files, my scratch. No listing of `.migration-tmp` or of another session's folder. No user-profile or temp-folder access. Git ran only through the runner (runner log: 212 entries, 8 refusals). |
| evidence_integrity | verified | No deviation wrote to a reviewed record. The three checkouts were at `15cb6b2`, `9667b69` and `2c176d4`, with an empty `git status --short`, at the start and at the end. The packet hash is unchanged (`7073b2b7...759d`). The report and evidence hashes are as given in RESULT. Writes went only to the scratch and this evidence folder. |
| permitted_support | verified | No check result rests on a deviation. D-3's blob id was recomputed through the runner (equal). D-4's counts are reproduced by `chain-check.js` through the runner. D-1's timestamp is bracketed by runner-log entries. D-9's reads are regenerated identically from the committed files. D-2 is the assignment itself. |
| disclosure | verified | No credential value was emitted. `credscan.js` found 0 credential values in the packet (D-2), in the regenerated D-9 outputs and in my evidence. The 48 raw hits in these three files are 4 distinct strings, all word collisions (the product name, a four-letter common word and two ordinary English words). Everything reached only my session and the owner's approved client on the owner's machine. Limit: client retention is unknown (residual risk). |

<a id="read-classification"></a>

## Classification

**`non-material`**, as an assessment for the owner.

- All five safeguards are verified from evidence PM can check: the runner log, the environment flags, the unchanged compile cache, the recomputed values and the regenerated outputs.
- The unknowns are bounded:
  - possible temp files from D-7 and D-10, which hold only my own notes or my own output lists;
  - client retention of permitted repository text and of my own output.
- None of them touches a finding, a retained item, the reviewed revisions or a credential.
- The verdict `findings`, F-001..F-003 and the coverage 602 = 76 + 526 + 0 are unchanged.
- This classification approves nothing. Until the owner decides, pass 012 supplies no usable coverage and closes no gate.

<a id="read-unknowns"></a>

## Unknowns

1. Whether the D-7 here-document (989 bytes) or the D-10 process substitution used a temp file in the user temp folder. Pipes are expected (Common Facts), but I did not look.
2. Whether the client persisted the D-2 read or the D-9 outputs outside the project. No spill notice appears in my session record.
3. How long the client keeps the transcript of D-1..D-10.
4. The exact times of the direct calls; they are bracketed by runner-log entries only.

<a id="read-residual-risks"></a>

## Residual Risks

- The client transcript on the owner's machine keeps:
  - the packet text (D-2);
  - about 257 lines of committed status and template text (D-9);
  - one timestamp, one hash and four counts (D-1, D-3, D-4).
  None of it is a credential value.
- At most, two small temp files of my own notes or output lists may exist in the user temp folder (D-7, D-10), with unknown retention.

<a id="read-prevention"></a>

## Prevention

- **Timestamps and hashes:** use small scripts in the scratch through the runner (`now.js`, `blob.js`), never inline `node -e`. Never add placeholder `node -e` calls to commands.
- **Temp variables:** export TEMP, TMP and TMPDIR at the start of every shell command, including commands without node. Write notes with the file tool instead of here-documents.
- **Long reads:** check the expected size before any direct `grep` or `head` of a repository file. Route anything that may exceed a screen through the runner (`read`, or `--save` and bounded reads).
- **Comparisons:** save both sides to scratch and compare files, instead of process substitution.
- **Packet reading:** read it with the runner `read` in bounded ranges, not with the client's file-read tool.

<a id="read-owner-decision-on-the-assessment-pending"></a>

## Owner decision on the assessment: pending

No owner decision on this assessment is recorded. This companion is preparation only; it neither approves the assessment nor implies approval. The owner decides whether to approve or reject it for pass 012, the session and the report hash given in Declarations.

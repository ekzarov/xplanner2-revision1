# Operational Incident Assessment - Stage 2 pass 010 (packet S02-P010)

**Were the operational deviations of pass 010 material to the review, and what is still unknown?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Assessment: `non-material` - deviations D1-D3 of Stage 2 pass 010 and D4 of this preparation; owner decision on the assessment pending**
>
> - **D1:** a listing of `.migration-tmp/` showed the names of other sessions' scratch files; the same command echoed the PATH value. No file was opened.
> - **D2:** the client persisted one oversized output (a 30.4 KiB reconnaissance diff excerpt) under the user profile. It was not opened.
> - **D3:** TEMP, TMP and TMPDIR were set for only part of the node runs.
> - **D4 (new, during this preparation):** one command ran `git status` although only `show` and `rev-parse` were permitted. The checkouts were gone, so it only produced errors.
>
> All five safeguards are verified from permitted evidence. Three bounded unknowns remain: whether one here-document used a temp file, how long the client keeps its spill and transcript, and the exact names D1 displayed. Neither D1-D4 nor any unknown supports a finding or a retained item. This is an assessment for the owner, not an approval.
>
> **Details:** [Safeguards](#read-safeguards) / [Classification](#read-classification) / [Owner decision on the assessment: pending](#read-owner-decision-on-the-assessment-pending).

<details>
<summary><strong>Contents</strong></summary>

- [Declarations](#read-declarations)
- [Assessor Identity And Limits](#read-assessor-identity-and-limits)
- [Incidents](#read-incidents)
  - [D1 - Listing of the parent scratch folder](#read-d1-listing-of-the-parent-scratch-folder)
  - [D2 - Client spill of one output](#read-d2-client-spill-of-one-output)
  - [D3 - Temp variables not set for every node run](#read-d3-temp-variables-not-set-for-every-node-run)
  - [D4 - Git status run during this preparation](#read-d4-git-status-run-during-this-preparation)
- [Correction To My Access Log](#read-correction-to-my-access-log)
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

- Incident session: a81d0356af46a1dd1
- Incident report SHA-256: f567227da6872e947656dd47ceb0d5958bcf546234097a4f50c16be7aadd8f78
- Incident classification: non-material
- Incident independence: verified
- Incident source scope: verified
- Incident evidence integrity: verified
- Incident permitted support: verified
- Incident disclosure: verified

The report is [`stage-02-pass-010.md`](../../stage-02-pass-010.md). Its bytes equal my scratch copy with the single token `CURRENT_SESSION_ID` replaced by the session id above: `cmp` reports them identical, and both hash to the value above. This companion does not change the report, its verdict, its findings or any evidence hash.

<a id="read-assessor-identity-and-limits"></a>

## Assessor Identity And Limits

- **Assessor:** the pass-010 reviewer itself, a Claude Code subagent (model `claude-opus-5-5`) of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. The session id `a81d0356af46a1dd1` is taken as PM recorded it; it is not visible inside my session.
- **Role:** step 2 of [Operational Incident Assessment](../../../agent_orchestration.md#operational-incident-assessment) has the reviewer assess its own incidents. This is a self-assessment; PM verifies the support, and the owner decides.
- **Procedure authority:** PM requested this preparation. I did not find an owner procedure decision for pass 010 in the material I read (pass 009 had one).
- **Limits:**
  - I cannot see the client's transcripts, spill files or retention, which sit outside the allowed folders. I opened nothing under the user profile.
  - Some facts rest only on my own session record: the exact commands, which runs lacked the variables, and what was displayed. They are marked as such.
  - The three review checkouts no longer exist, so their final state rests on my end-of-pass record (empty `git status` at `9667b69`, `026fd97`, `15cb6b2`).

<a id="read-incidents"></a>

## Incidents

Allowed inputs for pass 010 were the project folder (read-only except the write allowlist) and the Starter folder (not used). The permitted git operations were `rev-parse`, `status`, `diff` and `show` on ROOT `15cb6b2`, PREV `026fd97` and CAND `9667b69`. The write allowlist was this evidence folder (except `packet.json` and `pm-*.json`), `.migration-tmp/stage-02-p010/reviewer-scratch/` and `.migration-tmp/temp/`. The pass sequence is in [`access-log.md`](access-log.md).

<a id="read-d1-listing-of-the-parent-scratch-folder"></a>

### D1 - Listing of the parent scratch folder

- **When:** `2026-09-30` at about `13:4x` UTC, early in the pass, before any Stage 1 claim was assessed.
- **Exact command:** `cd /c/Work/Legacy/xplanner2-revision1 && which node tar unzip javap java python 2>&1 | head; node --version; ls .migration-tmp/stage-02-p010/reviewer-scratch/ | head; ls .migration-tmp/ ; ls analysis/tools/node_modules 2>/dev/null | head -30; ls sources/ ; ls sources/xplanner-plus-r426 | head`
- **Allowed inputs:** all paths are inside the project folder, which the packet permits read-only.
- **Data actually read or emitted (no values):**
  - Top-level entry names of `.migration-tmp/`, about 190, not recursive. They included PM script and log names, PR-text drafts, earlier pass scratch folders, an author `stage-01` folder, and files named after pass-009 packet and report copies.
  - No file content. No file there was opened, then or later.
  - The same command's `which` errors for `javap` and `java` echoed the process PATH value twice. That value holds directory names, some under the user profile. It is environment metadata; no file there was accessed.
  - Also emitted: about 30 module folder names, the `sources/` and source-tree folder names, and the node version.
- **Audience:** my session context, and the client display and transcript of the owner's Claude Code session.
- **Retained output:** none in any file.
- **Unknowns:** the exact list of names (not retained, and not re-listed now, because that would repeat the exposure); how long the client retains its transcript.
- **Impact:** none. No name is cited as evidence, and every conclusion rests on my own reads of the WAR, the source and the pinned records.

<a id="read-d2-client-spill-of-one-output"></a>

### D2 - Client spill of one output

- **When:** `2026-09-30` at about `13:5x` UTC.
- **Exact command:** `cd /c/Work/Legacy/xplanner2-revision1/.migration-tmp/stage-02-p010/reviewer-scratch && sed -n '60,140p' recon-u0.diff | cut -c1-2500`.
  - The output was bounded to 81 lines and 2500 characters per line, but not pre-filtered below the client's inline limit.
  - The client stored it as `…/tool-results/b8kiio7l3.txt` under the user profile and returned a 2 KB preview.
- **Allowed inputs:** my own scratch file `recon-u0.diff`, which is `git diff -U0 PREV CAND -- analysis/legacy_reconnaissance.md`.
- **Data actually read or emitted (no values):**
  - Lines 60-140 of that diff: the PREV and CAND text of the changed Build rows, GAP-003, the Q3 facts, the Boundary, Return Correction Evidence, Exit Checklist and Error Prevention lines.
  - All of it is repository content present at both revisions in Git.
  - I regenerated the excerpt today from the pinned revisions:
    - the regenerated diff is byte-identical to the scratch copy (`be87fb7f...d4344`);
    - the excerpt is 31,090 bytes (30.4 KiB, the size the client reported), SHA-256 `8188cb06...b904aed`, stored at `.migration-tmp/stage-02-p010/reviewer-scratch/incident/d2-spilled-excerpt.txt`.
  - My credential scan finds 0 credential values in it. All 20 raw hits are standalone or embedded word collisions (product name, role word, a log word), and none is near a credential keyword.
- **Audience:** the 2 KB preview reached my session context. The whole excerpt reached the client's spill file on the owner's machine.
- **Retained output:** the client spill file (not opened by me; its lifetime is unknown to me) and my regenerated copy in scratch.
- **Unknowns:** whether and how long the client keeps the spill file and its transcript.
- **Impact:** none on the review. I re-read the scratch file in smaller chunks. The spill holds only already-published repository text with no credential values.

<a id="read-d3-temp-variables-not-set-for-every-node-run"></a>

### D3 - Temp variables not set for every node run

- **Event:** the packet asked to set TEMP, TMP and TMPDIR to `.migration-tmp/temp` before running node. I exported them in some commands only. Examples: the WAR extraction, the cell dumps, the full-class parse, the first call-graph run, the evidence generators and the credential scans. Most other node runs used the inherited defaults. The exact per-run list was not retained (it rests on my session record).
- **Allowed inputs:** unaffected; the variables govern where programs may write temporary files, not what they read.
- **What the unset variables could have caused, and what the evidence shows:**
  - **My node scripts.** None of my 27 scripts in the scratch folder calls `os.tmpdir`, `mkdtemp` or reads a temp variable (search result: 0 files). Each writes only to explicit paths in the scratch or in this evidence folder.
  - **The node runtime.** Node writes temporary files only when a feature asks for it, such as diagnostic reports, profilers or the compile cache. `NODE_OPTIONS`, `NODE_COMPILE_CACHE` and `NODE_REPORT_DIRECTORY` are unset in the shell environment (checked today; the session environment is inherited), and no command passed such a flag. Uncaught script errors (several scripts failed) print to the console; they write no report without those settings.
  - **`sed -i`** (used on scratch files, the report and the evidence files): GNU sed writes its temporary copy in the directory of the target file and renames it. That stays inside the allowlist, and TMPDIR does not govern it.
  - **`unzip`** extracts directly into its `-d` target in the scratch. **git** `show`, `diff` and `rev-parse` write to stdout or to a redirect in the scratch.
  - **One bash here-document** (`cat > citecheck.js <<'EOF' … EOF`, run without the variables) is the only command that may have used a temp file outside the project.
    - Bash 5.2 (`5.2.37`) writes a here-document to a pipe when it fits the pipe buffer, and otherwise to a temp file in TMPDIR, which defaults to `/tmp`, the user temp folder in Git Bash.
    - The content was about 1.9 KB of my own script text, with no repository data and no credential value, so a pipe is likely.
    - I cannot confirm without looking in the user temp folder, which I do not do.
  - **The client's own tooling** may create temp files independently of these variables. That is outside the reviewer's control and not caused by this deviation.
- **Data emitted:** none beyond the possible here-document temp file of my own script text.
- **Audience and retained output:** none known. At most, one small temp file of my own script text on the owner's machine.
- **Unknowns:** whether that one here-document used a temp file; the exact list of node runs without the variables.

<a id="read-d4-git-status-run-during-this-preparation"></a>

### D4 - Git status run during this preparation

- **When:** `2026-09-30`, while preparing this companion. It is not part of the sealed report.
- **Exact command:** a loop over `root`, `previous` and `candidate` that ran `git -C .migration-tmp/stage-02-p010/<name> rev-parse HEAD` and `git -C .migration-tmp/stage-02-p010/<name> status --short | wc -l`.
  - This task's constraint permits only `git show` and `git rev-parse`, so the `status` part was outside it.
  - The same command also ran `sed`, `sha256sum` and `cmp` on my scratch copy and on the sealed report, which are not git operations.
- **Allowed inputs:** the checkout paths are inside the project folder.
- **Data actually read or emitted:** nothing from any repository. The three checkout folders no longer exist, and each git call ended with "fatal: cannot change to …". The count printed 0.
- **Audience:** my session context and the client transcript. **Retained output:** none.
- **Unknowns:** none.
- **Impact:** none. No fact in this companion rests on it; the reviewed revision is re-verified with `git show` (below).

<a id="read-correction-to-my-access-log"></a>

## Correction To My Access Log

At PM's request for a formatting fix, I edited Deviation 2 of [`access-log.md`](access-log.md) to name the command as `awk`. That edit was wrong: the spilled command was `sed -n '60,140p' recon-u0.diff | cut -c1-2500` (see D2), and my later bounded reads used `awk`. The error changes no fact that a finding or check relies on. This task permits writing only this companion, so I have not changed the access log. PM decides whether to correct it; the current log hashes to `171af92b...7ccd2`.

<a id="read-safeguards"></a>

## Safeguards

| Safeguard | Value | Evidence and exact limits |
|---|---|---|
| independence | verified | D1 displayed file names only, and no file of another session was opened. D2-D4 involved only my own scratch content, a local environment value and failed git calls. No authoring context or earlier conclusion entered through them. Every check in [`comparison-results.json`](comparison-results.json) names its own evidence, and none cites a D1-D4 output. See [`independence-record.md`](independence-record.md). Limit: the D1 name list was not retained. |
| source_scope | verified | Every read in D1-D4 was inside the project folder. The D2 spill file and the user temp folder were not opened. D4 read nothing. The facts used here come from permitted means: the pinned-revision `git show`, my scratch files and the environment value. Limit: the command facts rest on my session record. |
| evidence_integrity | verified | The reviewed revision is intact: `git show 9667b69:<path>` reproduces the pinned hashes of the reconnaissance (`7c57c864...`), workbook (`8eb58ab3...`), checklist (`8a15e08c...`), correction record (`b3d65a92...`) and WAR (`46ff9dc0...`). The three checkouts were clean at the end of the pass (my record; they have since been removed). No command wrote to any record under review. The main tree has since moved to branch `stage-02/pass-011` at `8d137ed`, and its record files equal that HEAD's committed blobs, so they are not modified by me. The sealed report equals my scratch copy with one token replaced. The evidence files keep the hashes I reported: `comparison-results.json` `bc7b4267...`, `coverage-reconciliation.json` `b7b29dae...`, `change-set.json` `c9559f04...`, `independence-record.md` `af2ec868...`. Limit: the access log contains the wrong command name described above. |
| permitted_support | verified | F-001..F-005, the carried pass-009 F-003 and the 364 retained items rest on the WAR, the A4 source, the pinned records and exact pass-006/pass-009 IDs. None rests on the D1 names, the D2 spill, a temp file or D4. |
| disclosure | verified | No credential value was emitted in D1-D4. D1: file and directory names and the PATH value, with no file content and no credential. D2: I reconstructed the excerpt exactly (size equals the client's figure), and it holds 0 credential values; it is already-published repository text on the owner's own machine inside the approved client. D3: at most one temp file of my own script text. D4: error lines only. Everything reached only the approved Claude session and the owner's client, and no third party or file outside the owner's machine. Limit: client retention is unknown (residual risk). |

<a id="read-classification"></a>

## Classification

**`non-material`**, as an assessment for the owner.

- All five safeguards are verified from evidence PM can check. The parts that rest on my session record are stated.
- The unknowns are bounded:
  - a possible temp file of my own script text;
  - client retention of already-published text;
  - a name list with no content.
- None of them touches a finding, a retained item, the reviewed revision or a credential.
- The findings F-001..F-005, the carried pass-009 F-003 and the sealed verdict `findings` are unchanged.
- This classification approves nothing. Until the owner decides on this assessment, pass 010 supplies no usable coverage and closes no gate.

<a id="read-unknowns"></a>

## Unknowns

1. Whether the one here-document without TMPDIR (D3) used a temp file in the user temp folder; if so, it holds about 1.9 KB of my own script text.
2. The exact list of node runs that lacked the variables (D3), and the exact entry names D1 displayed. Neither was retained.
3. How long the client keeps the D2 spill file and the transcripts of D1, D2 and D4.
4. Any temp files the client's own tooling creates independently of these variables.

<a id="read-residual-risks"></a>

## Residual Risks

- A copy of already-published reconnaissance diff text (D2), and possibly one small file of my own script text (D3), may stay in client or user temp storage on the owner's machine until removed.
- The client transcript keeps other sessions' scratch names and the PATH value (D1).
- The access log names the D2 command wrongly (`awk` instead of `sed`) until PM corrects it.

<a id="read-prevention"></a>

## Prevention

- Export TEMP, TMP and TMPDIR once at the start of every shell command, not per run. Also write scripts with the file tool instead of here-documents.
- Pre-filter or split any output that may exceed the client's inline limit, for example with a `wc -c` check first. Never list a parent scratch folder; list only the reviewer's own scratch.
- Recheck packet-specific git limits before every git command in a follow-up task, especially when the allowed operations change between requests.
- When a formatting fix touches a factual line, recheck the fact against the session record before editing.

<a id="read-owner-decision-on-the-assessment-pending"></a>

## Owner decision on the assessment: pending

No owner decision on this assessment is recorded. This companion is preparation only; it neither approves the assessment nor implies approval. The owner decides whether to approve or reject it for pass 010, session `a81d0356af46a1dd1` and report `f567227d...8f78`.

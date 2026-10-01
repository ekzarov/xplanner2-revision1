# Operational Incident Assessment - Stage 2 pass 013 (packet S02-P013)

**Were the operational deviations of pass 013 material to the review, and what is still unknown?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Assessment: `non-material` - deviations D-001..D-008 of Stage 2 pass 013; owner decision on the assessment pending**
>
> - **D-001:** one direct listing (file names, full paths and sizes of committed files only) was larger than the client limit; the client saved it under the user profile. I did not open that file.
> - **D-002:** three runner `git show HEAD:<legacy file>` calls piped to `head -c 0`; zero bytes were printed.
> - **D-003, D-007, D-008:** my own scratch script and my own text written with a here-document or `node -e` instead of the file tool.
> - **D-004, D-005:** reads of permitted inputs outside the runner (client file-read tool; direct `grep`, `sed`, `node -e`), several `node -e` calls without TEMP, TMP and TMPDIR.
> - **D-006:** one print of the shape of the credential line with every letter and digit masked.
>
> All five safeguards are verified from permitted evidence: the runner log, the environment flags, the empty allowlisted temp folder, a regeneration of the D-001 listing and the credential scans. Bounded unknowns remain: client retention of the transcript and of the D-001 spill file, and whether the D-003 here-document used a temp file (a pipe is expected). No finding, retained item or reported figure rests on a deviation. This is an assessment for the owner, not an approval.
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

- Incident session: a7738da7d84992f93
- Incident report SHA-256: d02131d35584a6629117b2519e30095f22c4e52a3d7872a3a32743458c51f2db
- Incident classification: non-material
- Incident independence: verified
- Incident source scope: verified
- Incident evidence integrity: verified
- Incident permitted support: verified
- Incident disclosure: verified

The report is the pass-013 report, delivered in the reviewer scratch for PM to copy to [`analysis/reviews/stage-02-pass-013.md`](../../stage-02-pass-013.md). The hash above is that of my scratch report (`73ef74ef...1ffa`, after PM's formatting-only link fix of [`config/`](../../../../config) recorded in the [access log](access-log.md)) with its one session token replaced by `a7738da7d84992f93`, as PM stated. This companion does not change the report, its verdict, its findings or any evidence hash.

<a id="read-assessor-identity-and-limits"></a>

## Assessor Identity And Limits

- **Assessor:** the pass-013 reviewer itself, a Claude Code subagent (model `claude-opus-5-5`) of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. This is a self-assessment under step 2 of [Operational Incident Assessment](../../../agent_orchestration.md#operational-incident-assessment); PM verifies the support, and the owner decides.
- **Procedure authority:** PM request of this session; preparation only.
- **Sources of fact:**
  - my session record of the exact commands and their outputs;
  - the runner's own log in the reviewer scratch, with 113 entries from `01:28:45.643Z` to `02:10:25.196Z` (5 refusals, 5 withheld lines), which brackets the direct calls;
  - my scratch files, including my running deviation notes (written at the time of D-001..D-003, D-007 and D-008);
  - `incident-facts.js` in the scratch, run through the runner at `2026-10-01T02:10:55Z`, and its regeneration of the D-001 listing into the scratch.
- **Limits:**
  - Direct calls are not in the runner log, so their times are bracketed, not exact.
  - I cannot see the client's transcripts, spill files or retention, or the user temp folder. I opened nothing under the user profile or temp folders, including the D-001 spill file.

<a id="read-common-facts"></a>

## Common Facts

**Allowed inputs:**
- read-only, the project folder, the three pinned checkouts, [`legacy/`](../../../../legacy) and `sources/`;
- write, this evidence folder (except [`packet.json`](packet.json) and `pm-*.json`), the pass-013 reviewer scratch and temp folders;
- git, only `rev-parse`, `status`, `diff` and `show` on the pinned checkouts and revisions, through the runner.

The packet required the runner for every node run, every git call and every read longer than a screen, the temp variables for any direct node run, the file tool for scripts, and bounded output.

**What unset temp variables could cause, and the evidence:**
- **Node.** Node writes temporary files only when a feature asks for it: the compile cache (`NODE_COMPILE_CACHE` or `module.enableCompileCache()`), diagnostic reports (`--report-*`, `NODE_OPTIONS`, `process.report`), V8 coverage (`NODE_V8_COVERAGE`). `node -e` keeps no REPL history.
- **Evidence for my environment** (set/unset only, printed by `incident-facts.js` through the runner):
  - `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `NODE_REPORT_DIRECTORY`, `NODE_REPORT_FILENAME`, `NODE_V8_COVERAGE` and `NODE_REPL_HISTORY` are unset;
  - `process.report.reportOnFatalError`, `reportOnUncaughtException` and `reportOnSignal` are `false`;
  - none of my 18 scratch scripts uses `os.tmpdir`, `mkdtemp`, a temp variable or the compile-cache API (the only textual match is the detection pattern inside `incident-facts.js` itself); no `node -e` code of mine calls such an API;
  - the allowlisted temp folder holds 0 files, so no tool wrote a cache or temp file there either.
- **Bash.** Bash `5.2.37` writes a here-document smaller than the pipe buffer to a pipe; `/dev/fd` exists. The D-003 here-document was 1241 bytes.
- **Client output persistence.** When a tool result exceeds the client limit, the client writes the full result to a tool-results file under the user's Claude project folder and shows a 2 KB preview with a notice. This happened once (D-001). No other result in my session carried such a notice.

<a id="read-incidents"></a>

## Incidents

| ID | Exact command or event | When (UTC `2026-10-01`) | Read or emitted (no values) | Audience | Retained output | Unknowns | Temp-variable effect and evidence |
|---|---|---|---|---|---|---|---|
| D-001 | Direct PowerShell: `Get-ChildItem analysis/reviews/stage-02-pass-0*.md` (Name, Length); `Get-ChildItem -Recurse analysis/reviews/evidence/S02-P012` and `Get-ChildItem -Recurse analysis/stages/stage-03` (FullName, Length, formatted as tables) | between `01:27:48Z` (programmatic stamp of the previous command) and runner entry `01:28:45.643Z` | **names, full paths and sizes only** of committed files and folders: the 12 Stage 2 reports, the 9 S02-P012 evidence files and the stage-03 tree (deploy folder, walkthrough record, W001 evidence); no file content. The client reported 31.8 KB; my regeneration of the same listings from the committed tree has 266 entries and 27.5 KB without table padding | my session context (2 KB preview) and the owner's client display and transcript | the client wrote the full output to a tool-results file (`b37e9b5mq.txt`) under the user's Claude project folder in the user profile. **I did not open it**, and I used bounded runner reads and `wc -c` afterwards | client retention of that file and of the transcript | none: PowerShell table output involves no temp file |
| D-002 | Runner `git -C <root/base/candidate checkout> show HEAD:legacy/demo-seed.sql`, each piped to `head -c 0` | after runner entry `01:29:57Z`, before the LF check | nothing: the pipe closed at 0 bytes; the runner then failed with EPIPE (error trace of the runner only) | as D-001 | none | none | none: the runner sets the temp variables; `HEAD` equals each pinned revision (`rev-parse`, step 5 of the access log) |
| D-003 | `cat > pmfix2.js <<'EOF' ... EOF` in the reviewer scratch | `01:41:29Z` (deviation note) | 1241 bytes of my own read-only script | as D-001 | the scratch script | whether Bash used a temp file | below any pipe buffer, so a pipe is expected; I did not look in the user temp folder |
| D-004 | The client's file-read tool and content search on permitted inputs: [`packet.json`](packet.json) (331 lines), [`AGENTS.md`](../../../../AGENTS.md), [`SKILL.md`](../../../../.agents/skills/migration-ba/SKILL.md), [`MIGRATION.md`](../../../../MIGRATION.md) (two ranges), [`constitution.md`](../../../../.specify/memory/constitution.md) (A1-A4), [`reviews/README.md`](../../README.md) and [`agent_orchestration.md`](../../../agent_orchestration.md) (sections), [`stage-NN-pass-NNN-template.md`](../../stage-NN-pass-NNN-template.md), [`stage-02-pass-012.md`](../../stage-02-pass-012.md) lines 1-309, part of [`artifact-reading.js`](../../../tools/artifact-reading.js) | before `01:27:48Z` (packet) and between runner entries up to about `02:05Z` | committed governing and chain text that this mode reads anyway; my scan of these files finds 0 credential values (k1..k4 all 0, strict pair formatting 0) | as D-001 | none in any file; no spill notice | client retention | none: no temp variable involved |
| D-005 | Direct commands outside the runner: about 20 `node -e` one-liners (inspection of my scratch dumps and committed JSON, such as the workbook cell views, rows.json fields, coverage samples, the LF check of `demo-seed.sql`), most without TEMP, TMP and TMPDIR; direct `grep`, `sed`, `head`, `cut`, `wc`, `sha256sum` reads of committed files, a few longer than a screen (status-file outline about 120 lines, a search for the demo-seed hash across sealed evidence, W001 check texts for rows 41, 162 and 18, the walkthrough live-question rows) | spread between `01:30Z` and `02:09Z`, bracketed by runner entries | committed repository text, counts and my own results; none of these outputs showed a credential value (the runner withheld 5 credential-pattern lines in its own outputs, which I never saw) | as D-001 | none in files; the inspected values are reproduced by runner-run scripts (`index.js`, `dispcheck.js`, `gen.js`) | client retention | none: environment flags unset; 0 files in the allowlisted temp folder (Common Facts) |
| D-006 | One direct `node -e` printing line 38 of [`legacy/README.md`](../../../../legacy/README.md) with every Latin letter replaced by `a` and every digit by `9` | about `01:46Z` | the masked shape only (a label, two masked tokens of 8 and 5 letters); no value | my session and the owner's client | none in files | client retention of the masked shape | none (Common Facts) |
| D-007 | One direct `node -e` string replacement in my scratch `gen.js` | `02:00:42Z` (deviation note) | my own script text | as D-001 | the scratch script | none | none (Common Facts) |
| D-008 | Direct `node -e` string replacements: two link fixes in [`access-log.md`](access-log.md) and one fix of short hashes and two wording slips in my scratch report | between `02:02Z` and `02:08Z`; the scratch report fix is noted at its time | my own text | as D-001 | the corrected files; all hashes in RESULT were taken after these edits | none | none (Common Facts) |

Other direct commands were bounded PowerShell or Bash calls (`Get-FileHash`, `Get-Item`, `date`, `ls`, `wc -c`, `grep -c`) on permitted paths. Runner refusals (5) printed only their refusal lines.

<a id="read-safeguards"></a>

## Safeguards

| Safeguard | Value | Evidence and exact limits |
|---|---|---|
| independence | verified | No deviation exposed authoring context, earlier reviewer scratch or another session's file. D-001 listed only names and sizes of committed files; D-004 and D-005 read committed inputs that this non-blind mode reads anyway; D-002 printed nothing; D-003, D-006, D-007 and D-008 touched only my own text or a masked shape. See the [independence record](independence-record.md). |
| source_scope | verified | Every read was inside the project: committed files, the pinned checkouts, my scratch. No listing of `.migration-tmp` itself or of another session's folder; no access to `.migration-tmp/stage-03/secrets`, the user profile, the user temp folder or the D-001 spill file. Git ran only through the runner on the pinned checkouts (D-002 used `HEAD`, equal to the pinned revision). |
| evidence_integrity | verified | No deviation wrote to a reviewed record or a sealed file. The three checkouts kept their pinned heads with an empty `git status --short` at start and end. The packet hash is unchanged (`3e30435a...5fde`). Writes went only to the scratch and this evidence folder; D-008 edited my own files before their hashes were taken. |
| permitted_support | verified | No check result, finding or retained item rests on a deviation. Every figure in the report and evidence comes from scripts run through the runner (`pins.js`, `wbdiff.js`, `index.js`, `dispcheck.js`, `chk001.js`, `gen.js`); the D-005 one-liners only inspected values that these scripts reproduce. D-004 reads are the assigned inputs. |
| disclosure | verified | No credential value was emitted. D-006 printed a fully masked shape; D-001 holds names and sizes only; the runner withheld credential-pattern lines from its outputs. The self-scan of the report and this evidence folder finds 0 credential values (6 patterns with positive controls), and so does the scan of the D-004 inputs. Everything reached only my session and the owner's approved client on the owner's machine. Limit: client retention is unknown (residual risk). |

<a id="read-classification"></a>

## Classification

**`non-material`**, as an assessment for the owner.

- All five safeguards are verified from evidence PM can check: the runner log, the environment flags, the empty allowlisted temp folder, the regenerated D-001 listing, and the credential scans.
- The unknowns are bounded:
  - client retention of the transcript and of the D-001 spill file, which holds names and sizes of committed files only;
  - a possible temp file from the D-003 here-document, which would hold only my own 1241-byte script.
- None of them touches a finding, a retained item, the reviewed revisions or a credential.
- The verdict `findings`, F-001..F-007 and the coverage 748 = 429 + 319 + 0 are unchanged.
- This classification approves nothing. Until the owner decides, pass 013 supplies no usable coverage and closes no gate.

<a id="read-unknowns"></a>

## Unknowns

1. How long the client keeps the D-001 spill file and the transcript of D-001..D-008.
2. Whether the D-003 here-document (1241 bytes) used a temp file in the user temp folder. A pipe is expected, but I did not look.
3. The exact times of the direct calls; they are bracketed by runner-log entries or my notes only.

<a id="read-residual-risks"></a>

## Residual Risks

- The client keeps, on the owner's machine:
  - the D-001 spill file: about 32 KB of names, full paths and sizes of committed files;
  - in the transcript, committed governing and chain text (D-004, D-005), my own outputs and one masked shape (D-006).
  None of it is a credential value or non-public content beyond the repository.
- At most one small temp file of my own script may exist in the user temp folder (D-003), with unknown retention.

<a id="read-prevention"></a>

## Prevention

- **Listings:** never list folders directly; use the runner `list` for the scratch and scratch scripts that write listings into the scratch, then read them in bounded parts.
- **Long reads:** read packets and governing documents with the runner `read` in bounded ranges, not with the client's file-read tool.
- **Inspection and edits:** use small scratch scripts through the runner instead of `node -e`; edit files only with the file tool, never with `node -e` or here-documents.
- **Temp variables:** export TEMP, TMP and TMPDIR at the start of every shell command, including commands without node.
- **Git:** pass the literal pinned revision, never `HEAD`, even when the runner accepts it.
- **Credential patterns:** build the scanner pattern from the explicit location in memory, without printing even a masked shape.

<a id="read-owner-decision-on-the-assessment-pending"></a>

## Owner decision on the assessment: pending

No owner decision on this assessment is recorded. This companion is preparation only; it neither approves the assessment nor implies approval. The owner decides whether to approve or reject it for pass 013, the session and the report hash given in Declarations.

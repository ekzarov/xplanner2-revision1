# Operational Incident Assessment - Stage 2 pass 014 (packet S02-P014)

**Were the operational deviations of pass 014 material to the review, and what is still unknown?**

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Assessment: `non-material` - deviations D-001 and D-002 of Stage 2 pass 014; owner decision on the assessment pending**
>
> - **D-001:** I read the runner source and its configuration with the client file-read tool, outside the runner. The runner refuses its own folder.
> - **D-002:** I ran 21 short content searches with the client search tool, outside the runner, on permitted committed files, my scratch and my own evidence.
>
> All five safeguards are verified from permitted evidence: the runner log, a regeneration of every D-002 search with a credential scan of what it printed, the environment flags and the temp folder, and the clean checkouts.
>
> Three facts correct or complete the sealed access log:
> - the configuration part of D-001 happened later than the log says;
> - three statements the log called re-established through the runner rested on D-002 alone until I re-read them through the runner at `17:29:20Z`;
> - there was a third masking event, on my own scan output (M-003).
>
> No finding, retained item or figure changes. Bounded unknowns remain: client retention of the transcript. This is an assessment for the owner, not an approval.
>
> **Details:** [Safeguards](#read-safeguards) / [Classification](#read-classification) / [Owner decision on the assessment: pending](#read-owner-decision-on-the-assessment-pending).

<details>
<summary><strong>Contents</strong></summary>

- [Declarations](#read-declarations)
- [Assessor Identity And Limits](#read-assessor-identity-and-limits)
- [Common Facts](#read-common-facts)
- [Incidents](#read-incidents)
- [Corrections To The Access Log](#read-corrections-to-the-access-log)
- [Runner Masking](#read-runner-masking)
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

- Incident session: aeac87124971a209c
- Incident report SHA-256: be869fec1e50fbd4c8b227b9331fe3288c1ca17333cf5ecf45a368de3d033853
- Incident classification: non-material
- Incident independence: verified
- Incident source scope: verified
- Incident evidence integrity: verified
- Incident permitted support: verified
- Incident disclosure: verified

The report is the pass-014 report, delivered in the reviewer scratch for PM to copy to its publication path in the reviews folder. The hash above is that of my scratch report (`3a23c0ce...a315`, unchanged since I returned it) with its single session token replaced by `aeac87124971a209c`, as PM stated. This companion changes neither the report, its verdict and findings, nor any other evidence file or hash. PM's later replacement of the session token in [`independence-record.md`](independence-record.md) is PM's change, recorded in [`pm-report-transcription.json`](pm-report-transcription.json).

<a id="read-assessor-identity-and-limits"></a>

## Assessor Identity And Limits

- **Assessor:** the pass-014 reviewer itself, a Claude Code subagent (model `claude-opus-5-5`) of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`. This is a self-assessment under step 2 of [Operational Incident Assessment](../../../agent_orchestration.md#operational-incident-assessment). PM verifies the support, and the owner decides.
- **Procedure authority:** a PM request to this session, for preparation only.
- **Sources of fact:**
  - my session record of each command and its output;
  - the runner log in my scratch: 103 entries from `16:59:29.556Z` to `17:29:20Z`, with 2 refusals and 3 withheld lines;
  - my scratch scripts `incident-facts.js` (run through the runner at `2026-10-02T17:28:29Z`) and `temp-facts.js` (`17:28:51Z`);
  - five bounded runner reads at `17:29:20Z`.
- **Limits:**
  - Client-tool calls are not in the runner log, so their times are bracketed by the neighbouring entries.
  - I cannot see the client's transcript storage or retention. I opened nothing under the user profile or the user temp folder.

<a id="read-common-facts"></a>

## Common Facts

**Allowed inputs:**
- **Read-only:** the project folder, the three pinned checkouts, [`legacy/`](../../../../legacy) and `sources/`.
- **Write:** this evidence folder (except [`packet.json`](packet.json) and `pm-*.json`), and my scratch and temp folders under `.migration-tmp/stage-02-p014/`.
- **Git:** only `rev-parse`, `status`, `diff` and `show`, on the pinned checkouts and revisions, through the runner.

The packet required the runner for every node run, every git call and every read longer than a screen. It also required the temp variables for any direct node run, the file tool for scripts, and bounded output.

**Environment and temp evidence** (`incident-facts.js`, `temp-facts.js`, through the runner):
- The variables `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `NODE_REPORT_DIRECTORY`, `NODE_REPORT_FILENAME`, `NODE_V8_COVERAGE` and `NODE_REPL_HISTORY` are unset. `TEMP`, `TMP` and `TMPDIR` equal the pinned temp folder.
- The pinned temp folder holds 95 files (277260 bytes), all under one `node-compile-cache/` version folder. All were written between `17:26:10.301Z` and `17:26:10.360Z`, during the instructed direct `npm --prefix analysis/tools run -s audit:artifact-links` run, which had the temp variables set.
  - These are Node's compiled-code cache of tool modules.
  - The folder is inside my write allowlist, and its existence shows that the direct run honoured the temp variables.
  - I did not open these files.
- Neither D-001 nor D-002 involves a temp variable. The client's file-read and search tools ran no node code of mine.

**Client output persistence:** no tool result in my session carried the client's notice that a large output was saved to a file. No spill file exists to my knowledge, and I opened none.

<a id="read-incidents"></a>

## Incidents

| ID | Exact event | When (UTC `2026-10-02`) | Read or emitted (no values) | Audience | Retained output | Unknowns |
|---|---|---|---|---|---|---|
| D-001 | **Client file-read tool, outside the runner**, on two files:<br>- the runner source `safe-run.js`, read in full (335 lines, 19535 bytes, SHA-256 `6ac6a4a7...718d`, equal to the packet pin), after the runner refused to read its own folder;<br>- its configuration `safe-run.config.json` (36 lines, 1106 bytes, `133d3f97...f254`, equal to the pin). | Source: between runner entries `16:59:29.556Z` (the refusal) and `16:59:37Z`.<br>Configuration: between `17:00:53Z` and `17:00:59Z`. | **Tool code and configuration of this session's packet:**<br>- the configuration holds project-relative roots, the three pinned revisions and the credential-source path, and no value;<br>- the source builds the credential matchers in memory and holds no value from the sources;<br>- the source contains synthetic self-test fixture strings (an invented password assignment and an invented pair); the scan finds 0 real pair forms and 0 password tokens in both files, and its 1 generic hit is that fixture line. | my session context and the owner's client display and transcript | none in any file | client retention of the transcript |
| D-002 | **21 client content searches, outside the runner**, all on permitted inputs:<br>- headings of [`reviews/README.md`](../../README.md), [`agent_orchestration.md`](../../../agent_orchestration.md), [`constitution.md`](../../../../.specify/memory/constitution.md), [`SKILL.md`](../../../../.agents/skills/migration-ba/SKILL.md) and [`agent-roles.md`](../../../agent-roles.md), plus a heading search over the Markdown files at the repository root, in the analysis folder and under the agent skills;<br>- lines of [`stage-04-requirements-revision.md`](../../../stages/stage-04/stage-04-requirements-revision.md) (C227, banner, MH-01), [`legacy_reconnaissance.md`](../../../legacy_reconnaissance.md) (six searches: `getAttribute`, SOAP and AxisServlet lines, `attribute` words, one count, epic words, Return Correction fragments), [`legacy_user_flows_template_instructions.md`](../../../legacy_user_flows_template_instructions.md) (fill rules), [`stage-03-walkthrough-001-dispositions.md`](../../../stages/stage-01/stage-03-walkthrough-001-dispositions.md) (headings and the attestation line), [`legacy_reconnaissance.template.md`](../../../legacy_reconnaissance.template.md) (Return Correction Evidence), the pass-013 [coverage record](../S02-P013/coverage-reconciliation.json) (two searches) and [ledger](../S02-P013/comparison-results.json) (one search), my scratch `classify-flagged.txt` and my own [`coverage-reconciliation.json`](coverage-reconciliation.json). | Between `17:00:26Z` and `17:20:18Z`, each bracketed by runner entries:<br>- headings before `17:01:13Z`;<br>- Stage 4 record before `17:03:21Z`;<br>- reconnaissance between `17:04:00Z` and `17:13:11Z`;<br>- template instructions before `17:06:56Z`;<br>- record headings between `17:05:09Z` and `17:05:31Z`;<br>- pass-013 coverage after `17:07:42Z` and after `17:18:15Z`;<br>- my coverage and the ledger after `17:18:15Z`. | **Committed text that this non-blind mode reads anyway, plus my own outputs.** My regeneration of all 21 searches (`incident-facts.js`) counts 488 printed lines and 36101 bytes; 1 long line was omitted by the tool.<br>The credential scan of exactly the printed text finds:<br>- 0 pair forms, 0 generic assignments and 0 private keys;<br>- 1 bare password token, on reconnaissance line 276: a permission name before `.edit` (role-word collision, classified by masked context). | as D-001 | none in any file | client retention of the transcript |

**Other direct commands, all instructed or bounded:**
- the runner self-test (temp variables set);
- the copy of the report to its publication path, the `npm` link audit (temp variables set) and the removal of the copy, as the assignment instructed;
- PowerShell `Select-Object` and `Select-String` filtering of runner output.

The two runner refusals printed only their refusal lines.

<a id="read-corrections-to-the-access-log"></a>

## Corrections To The Access Log

The sealed [access log](access-log.md) stays unchanged. These facts complete it:

1. **D-001 timing.** The log places both D-001 reads between `16:59:29Z` and `16:59:37Z`. In fact only the runner source was read then; the configuration was read between `17:00:53Z` and `17:00:59Z`. The event and its content are otherwise as logged.
2. **Support claim of D-002.** The log says that every fact used was re-established through the runner. Three supporting statements had been read only through D-002:
   - the template rule that deferred rows are orange on D-N and the banner fill rule (support for C-012);
   - the reconnaissance template sentence that allows a linked Stage 1 correction record (PO-5, C-021);
   - the Stage 4 record's D-024 row and Gate Result exception (C-011).

   I re-read each through the runner at `17:29:20Z` (template instructions lines 212-233 and 452-455; reconnaissance template lines 158-166; Stage 4 record lines 205 and 369-372). The text is as the report uses it.
3. **A third masking event (M-003).** It is listed below. The report's self-check counts two.

<a id="read-runner-masking"></a>

## Runner Masking

These are masking events by the runner, not incidents. In each, the safeguard worked and nothing was disclosed.

| ID | Runner entry | Withheld | Classification |
|---|---|---|---|
| M-001 | `17:04:00Z`, read of my scratch file `w001-extract.txt` | 1 line: the JSON of check D-C-047 | Generic-pattern false positive: a parser exception message has a colon after the word for a parser token. |
| M-002 | `17:10:26Z`, my script `dc047.js` | 1 line: the observed field of D-C-047 | The same false positive. The rerun printed property tests only. |
| M-003 | `17:25:27Z`, my script `credscan.js` | 1 line: the keyword label that the scan printed for one sentence of my access log (the M-001 explanation) | False positive on my own wording. I reworded that sentence before sealing the log, and the rescan finds 0 hits in the evidence. |

I did not bypass the mask: no withheld text reached me through any other path.

<a id="read-safeguards"></a>

## Safeguards

| Safeguard | Value | Evidence and exact limits |
|---|---|---|
| independence | verified | Neither deviation exposed authoring context, earlier reviewer scratch or another session's file. D-001 read PM's tool for this packet. D-002 read committed governing, chain and Stage 1-4 text that correction-validation reads from the start, plus my own scratch and evidence. See the [independence record](independence-record.md). |
| source_scope | verified | Every read was inside the project: committed files, the pinned candidate checkout, this session's packet tool folder and my scratch. There was no listing of `.migration-tmp` itself and no other session's folder. Nothing was opened under `.migration-tmp/stage-03/secrets`, the user profile or the user temp folder. No git command ran outside the runner. |
| evidence_integrity | verified | Neither deviation wrote anything. The three checkouts kept their pinned heads, and `git status --short` was empty at start and at `17:26:35Z`. The packet hash is unchanged (`7fe3aa6b...ac90`). The only temp files are the compile cache inside my allowlisted temp folder. |
| permitted_support | verified | Every input behind the report is a permitted input. Every figure comes from runner-run scripts. The three statements first read only through D-002 are now confirmed by runner reads (`17:29:20Z`), and their text is unchanged. No check result, finding or retained item rests on D-001. |
| disclosure | verified | No credential value was emitted. Both D-001 files scan to 0 real pair forms and 0 password tokens; the one generic hit is a synthetic self-test fixture. The regenerated D-002 output scans to 0 pair forms, 0 generic assignments and 0 private keys; its one bare token is a permission name. The runner withheld the three generic-pattern lines. Everything reached only my session and the owner's approved client. Limit: client retention is unknown (residual risk). |

<a id="read-classification"></a>

## Classification

**`non-material`**, as an assessment for the owner.

- All five safeguards are verified from evidence PM can check:
  - the runner log;
  - `incident-facts.js` (report hash, the 21 regenerated searches and their scan, the D-001 file scan, environment flags);
  - `temp-facts.js` (temp folder);
  - the runner reads at `17:29:20Z`;
  - the clean checkouts.
- The unknowns are bounded to client retention of the transcript. They touch no finding, retained item, reviewed revision or credential.
- The verdict `findings`, F-001..F-006, the closure of pass-013 F-007, the 43 checks and the coverage 764 = 120 + 644 + 0 are unchanged.
- This classification approves nothing. Until the owner decides, pass 014 supplies no usable coverage and closes no gate.

<a id="read-unknowns"></a>

## Unknowns

1. How long the client keeps the transcript holding the D-001 tool code and the D-002 search output.
2. The exact times of the client-tool calls; they are bracketed by runner-log entries only.

<a id="read-residual-risks"></a>

## Residual Risks

- The owner's client keeps the following in its transcript, on the owner's machine:
  - the runner source with its synthetic self-test fixtures, and its configuration;
  - about 36 KB of committed governing, chain and Stage 1-4 text and my own outputs.

  None of it is a credential value or content beyond the repository and this session's packet.
- The sealed access log keeps an inexact time for half of D-001 and an over-broad support sentence. This companion records the corrected facts.
- The 95 compile-cache files stay in my allowlisted temp folder until PM cleans it up.

<a id="read-prevention"></a>

## Prevention

- **Runner files:** ask PM before reading the runner's own folder, or read it only through a PM-provided runner kind. Do not fall back to the client file-read tool.
- **Searches:** run searches as small scratch scripts through the runner, which masks output and logs the time, and never with the client search tool, even for short lookups.
- **Support claims:** before sealing an access log, list each fact that rests on a client-tool read and re-read it through the runner. Only then write that every fact is runner-backed.
- **Access-log times:** record the time of every client-tool step programmatically at the moment it happens, not bracketed afterwards.
- **Masking:** word evidence about generic-pattern false positives without the keyword-colon form, and count every withheld line from the runner log before sealing.
- **Temp:** expect Node's compile cache in the pinned temp folder for direct `npm` runs, and mention it in the access log.

<a id="read-owner-decision-on-the-assessment-pending"></a>

## Owner decision on the assessment: pending

No owner decision on this assessment is recorded. This companion is preparation only; it neither approves the assessment nor implies approval. The owner decides whether to approve or reject it for pass 014, the session and the report hash given in Declarations.

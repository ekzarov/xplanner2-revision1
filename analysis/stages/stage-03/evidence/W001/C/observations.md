# Stage 3 Walkthrough W001 - Part C Time, Notes, Search And History

**What did part C (time tracking, notes and files, search, navigation and history, and the three carried Stage 2 checks) observe on the live legacy application, what differed from the map, and what could not be verified?**

<!-- ARTIFACT_READING_START -->
> [!CAUTION]
> **Recorded result: action required**
>
> findings (10 map findings; 6 rows unverified)
>
> **Numbers recorded:** 57 checks on 49 workbook rows (47 in scope plus live-question rows 69 and 71): 38 match, 12 finding, 3 blocked, 4 not checked.
>
> **Details:** [Coverage Summary](#read-coverage-summary) / [Findings](#read-findings) / [Carried Checks](#read-carried-checks).
>
> **Scope:** this record only. Formatting is not a new review or approval.

<details>
<summary><strong>Contents</strong></summary>

- [Coverage Summary](#read-coverage-summary)
- [Scope And Setup](#read-scope-and-setup)
- [Carried Checks](#read-carried-checks)
- [Executed Walkthrough](#read-executed-walkthrough)
- [Row Verdicts](#read-row-verdicts)
- [Findings](#read-findings)
- [Residual Unverified Scope](#read-residual-unverified-scope)
- [Notes For Other Parts](#read-notes-for-other-parts)
- [Commands And Results](#read-commands-and-results)
- [Disclosures](#read-disclosures)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- Outcome: findings (10 map findings; 6 rows unverified)
- Date: `2026-09-30` (`2026-09-30T20:08:58Z` to `2026-09-30T20:32Z`)
- Performed by: BA (responsible-agent verification) for PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, task W001-C; deployment operator: Codex
- Legacy revision: unchanged WAR SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`, procedure [deploy.sh](../../../deploy/deploy.sh)
- Environment: Tomcat 9 / JRE 8, MySQL 5.7, Mailpit sink, through the tunnel at `http://127.0.0.1:18080/xplanner-legacy/`; running since about `09:21Z`, no restart or redeploy
- Records: [checks.json](checks.json), sanitized traces and results under [traces](traces/), map rows in [legacy_user_flows.xlsx](../../../../../legacy_user_flows.xlsx), reconnaissance in [legacy_reconnaissance.md](../../../../../legacy_reconnaissance.md)

<a id="read-coverage-summary"></a>

## Coverage Summary

57 checks on 49 workbook rows: 38 match, 12 finding, 3 blocked, 4 not checked. Rows 148-194: 22 live-verified, 13 difference, 6 partially verified, 6 unverified; rows 69 and 71 (live questions): partially verified.

| Observation mode | Scoped checks | Match | Finding | Blocked | Not checked |
|---|---|---|---|---|---|
| Live | 51 | 38 | 12 | 1 | 0 |
| Not run | 6 | 0 | 0 | 2 | 4 |

Each check appears once. The three carried checks are counted among the live checks. The setup checks `setup-C-055` to `setup-C-058` (rows 149, 151, 162) are cited, not repeated.

<a id="read-scope-and-setup"></a>

## Scope And Setup

- Rows: 148-194 (Time Tracking & Timesheets, Notes, Attachments & Files, Search, Navigation & History); live questions on rows 69, 71, 176, 186 and 189; carried checks pass-009 F-002, pass-009 F-001 (limited) and pass-012 F-003.
- Accounts: editor and viewer role accounts (admin only chosen as a pair person). The factory account and sysadmin were not used. Credentials were loaded in memory only.
- Own data in project `S3-C Time` (223), all prefixed `S3-C`: iterations 232 (started), 314, 316, 317; stories 254, 255; tasks 265 (EN), 266 (DE), 267 (ES), 268 (V), 269 (H); note 499. No shared or other parts' objects were changed; iteration 231 was read.
- Channel: web pages over HTTP, forms read from the page and replayed; no page script ran and the built-in browser was not used. Multipart note forms were sent in browser shape (file part always present).
- Mail: no part C action is expected to send mail; the mail adaptation of `20:03:44Z` does not affect these checks, and Mailpit was not read.

<a id="read-carried-checks"></a>

## Carried Checks

| Check | Carried item | Per locale: expected / observed | Affected rows | Verdict |
|---|---|---|---|---|
| C-C-001 | pass-009 F-002, history dates ([carryover](../../../../stage-02/live-check-carryover-pass-009.md)) | de first, en second: first-requester locale for both / both `Mi Sep 30 19:45:16 UTC`; later en, de and es views the same German form | 69, 70, 186 | match (no fresh restart) |
| C-C-002 | pass-009 F-001, limited locale switch | language parameter and Accept-Language (en, de, es, fr) on dt:table lists and history / session texts and formatKey dates switch; decimals follow Accept-Language; dt:table titles and the displaytag banner stay English; history date pinned | 69, 70, 186 | match |
| C-C-003 | pass-012 F-003, time editor ([carryover](../../../../stage-02/live-check-carryover-pass-012.md)) | en, de: session display and Insert Time, round trip kept / as expected. es: day/month swap misread or rejected / display `dd-MM-yyyy HH:MM ` (month in minutes), hint-shaped input passes validation then HTTP 500 at save, Insert-Time-shaped input loses its minutes | 69, 70, 71, 89, 149-160 | finding C-F-01 |

- **F-002 honesty note:** the application had been running since about `09:21Z`; no fresh restart was done. The German result shows that the first history render was a de request (this part's, as far as known).
- **F-003 mode:** the saves are live. The Insert Time JavaScript was not run; the served `/time.js` was evaluated offline with the served patterns (en/de `2026-09-30 20:14`, es `30-09-2026 20:09 `).

<a id="read-executed-walkthrough"></a>

## Executed Walkthrough

- **Time editor (149-160):** grid, pair person, edit and delete in the grid and every validation message match in en. The viewer has no Edit Time link, but a direct POST adds an entry (display-level only, as recorded). Remaining hours update the estimate on save.
- **Re-estimate (161):** the URL returns an empty 200 page; the page's own form, posted directly to `/do/edit/time`, changes the estimate and writes "reestimated".
- **Timesheets (162-166):** personal and aggregate timesheets, charts and the missing permission filter match. An unparsable period date shows no message and falls back to the default week. Neutral note: the editor's summary total 8.0 differs from its daily total 8.2 (cause not determined).
- **Notes (169-175):** add-note links appear on all four page types for the editor and not for the viewer; the viewer's direct note POST succeeds. Every attachment upload fails with a foreign key violation; validation failures answer HTTP 500; editing reassigns the author; the delete link does not remove the note.
- **File manager (176):** the listing fails with a NullPointerException, as predicted.
- **Search (178-184):** typed results, global scope, note results linking to the parent, numeric id first, the id jump and its three error messages match. The empty search shows the error page without its message.
- **Navigation and history (185-194):** breadcrumb, history tables and the container view, the me page, TWiki rendering, the help link, print mode, social links and the failing feature pages match the map. History column headings stay in the server default locale. Task move and continue fail with HTTP 500 and write no history.
- **Row 71:** in an es session the iteration editor stores a picker-shaped date correctly and a calendar-button date (`02-11-2026`) as `0008-05-18`, without a message.

<a id="read-row-verdicts"></a>

## Row Verdicts

| Verdict | Rows |
|---|---|
| live-verified | 150, 153-160, 162, 164, 165, 176, 178, 179, 182, 183, 185, 188, 190, 192, 194 |
| difference | 149, 152, 161, 163, 166, 169, 170, 172, 173, 174, 181, 186, 187 |
| partially verified | 151 (browser recalculation), 180 and 184 (no unreadable object), 189 (wiki lookup, bracket escaping), 191 (JavaScript), 193 (external sites not opened); 69 and 71 (live questions) |
| unverified | 148, 168, 177 (epic headings), 167 (no unreadable project), 171 and 175 (no stored attachment) |

<a id="read-findings"></a>

## Findings

| ID | Rows and cells | Observed | Minimal correction | Severity |
|---|---|---|---|---|
| C-F-01 | 70, 149, 152 (D70, F70, F149, H149, F152, H152; Q3 time-editor sentence) | es time editor saves with `dd-MM-yyyy HH:MM `: hint-shaped input passes validation then HTTP 500 (ParseException, UpdateTimeAction.java:145); Insert-Time-shaped input loses minutes | Record the es save failure and minute loss; name the display and Insert Time as session-locale consumers | medium |
| C-F-02 | 161 (D161, F161) | GET of the re-estimate URL returns an empty 200 page | State the empty response; the update works only by a direct POST to `/do/edit/time` | low |
| C-F-03 | 163, 166 (F163, F166) | No message for an unparsable period date; default week shown | Replace the message with "no message; default period" | low |
| C-F-04 | 169, 170, 171, 172, 175 (F169, F172, G172) | Attachment upload fails: foreign key noteAttachments violated, HTTP 500 | Record the failure in the reference deployment; keep 170 (file case), 171 and 175 unverified | medium |
| C-F-05 | 170 (F170) | Validation failure of the multipart note editor answers HTTP 500 AbstractMethodError | Record that the messages are never shown on this deployment | medium |
| C-F-06 | 173 (D173, F173) | Editing a note reassigns the author to the editing user | Add the author reassignment | low |
| C-F-07 | 174 (F174) | Delete link redirects but the note remains | Record that the note is not deleted (runtime observed) | medium |
| C-F-08 | 181 (F181) | Empty search error page has no message text | Record the message-less error page | low |
| C-F-09 | 186 (F186, H186) | Column headings in the server default locale; titles in the session locale | Add the heading-locale fact | low |
| C-F-10 | 187 (D187, F187) | Task move/continue HTTP 500, no history | Note that these entry points fail before saving; cross-reference rows 144-145 | low |

C-F-04 and C-F-05 may depend on this runtime (Tomcat 9, MySQL 5.7); whether the original installation behaves the same is not established. The workbook and reconnaissance were not edited.

<a id="read-residual-unverified-scope"></a>

## Residual Unverified Scope

| Row | Not observed | Retry condition |
|---|---|---|
| 167, 180, 184 | Read filtering and missing read checks: every role account reads every S3 project | PM provides or authorizes an S3-C object unreadable for one role account |
| 170, 171, 172, 175 | Attachment behavior (C-F-04); database rows not inspected | Attachment storage works; PM database extract |
| 149, 151, 191 | Insert Time, remaining-hours recalculation and width toggle JavaScript | A browser session signed in without Claude typing a password |
| 187 | SOAP history writers | Part D evidence |
| 189 | Server-side wiki request; per-project bracket escaping | PM log extract; authorized project-setting change |
| 69 | Fresh-restart condition; da, ja, ru and "--" bundles | Authorized restart; further locale sessions |

<a id="read-notes-for-other-parts"></a>

## Notes For Other Parts

- Row 100 (part B): a time save on a task of an unstarted iteration showed the Start Iteration page, and the next editor GET in that session showed it again ([results](traces/results-f003-time-editor-en.json)).
- Rows 144-145 (part B): task Move and Continue answer HTTP 500 "No Hibernate Session bound to thread" ([results](traces/results-task-move.json)).
- Locale checks in any part: decimal numbers follow Accept-Language while formatKey dates follow the session locale set by `/do/changeLocale` ([results](traces/results-f001b-project-list.json)).

<a id="read-commands-and-results"></a>

## Commands And Results

| Command or procedure | Result | Evidence |
|---|---|---|
| Runner `--self-test` (SHA-256 `fc91d350bc30a78dbd5e52d44e579064312e24cec1f1e6335f63c5ff42bdb5e7`) | pass, 30 cases | runner log |
| Part C scripts under `.migration-tmp/stage-03/ba-scratch/C/`, all through the runner | pass (recorded runs listed in [traces](traces/)) | [traces](traces/) |
| Credential self-scan of this folder (passwords, session ids, remember-me values, generic assignments, keys, account ids) | 0 hits in 44 files before this summary | self-scan script in scratch |
| `node analysis/tools/artifact-reading.js --file` on this file | pass | this file |

<a id="read-disclosures"></a>

## Disclosures

- Three runs failed before writing evidence and were rerun and recorded: the first F-003 run (one time save on task 265, forwarded to the Start Iteration page, nothing saved), the first history follow-up (task Move and Continue on task 269, both HTTP 500, rerecorded in [results-task-move.json](traces/results-task-move.json)) and the first notes run (six note POSTs with a non-browser multipart shape, all HTTP 500, nothing stored; overwritten by the recorded rerun).
- One exploratory GET went to a mangled path on the same host (shell path conversion) and answered 404. Exploratory GETs are logged in scratch, not here.
- The runner self-test runs `git rev-parse` internally; no git command was run otherwise. WAR text entries (JSPs, scripts, descriptors, bundles) were extracted into the part C scratch folder for reading.
- Probe data remains in the own project: the viewer's direct note 499 and time entry, and the moved story 255.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 3 part C; [checklist](../../../../../error-prevention-checklist.md) CHK-002 (display-level versus direct requests: time editor, note editor, note delete; passed), CHK-004 (every locale variant exercised where the claim depends on it: en, de, es, fr; da, ja, ru and "--" excluded with reason; passed), CHK-005 (every time-entry and note validation key exercised; note keys blocked by C-F-05), CHK-006 (note delete effect checked; file cascade blocked), CHK-009 (self-scan 0 hits; passed), CHK-010 (links resolved with their returnto parameters; passed), CHK-012 (request values followed to the search result and redirect; passed).
- **Learning update:** proposal for PM: a live check of an editor round trip must also type the value exactly as the on-screen hint reads, not only as the input aid produces it (C-F-01 was visible only that way). Not admitted by this part.

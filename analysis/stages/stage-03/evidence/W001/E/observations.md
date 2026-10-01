# Stage 3 Walkthrough W001 - Part E Gap Checks

**What did part E observe live for the gaps left by parts A-D (read filter, JavaScript behavior, test-support actions, sampling, delete cascades and orphan notes), what differed from the map, and what could not be verified?**

<!-- ARTIFACT_READING_START -->
> [!CAUTION]
> **Recorded result: action required**
>
> findings (2 new map findings; carried C-F-01 confirmed in a browser; 1 row unverified)
>
> **Numbers recorded:** 35 checks on 14 workbook rows: 26 match, 4 finding, 0 blocked, 5 not checked. Rows: 5 live-verified, 3 difference, 5 partially verified, 1 unverified.
>
> **Details:** [Coverage Summary](#read-coverage-summary) / [Findings](#read-findings) / [Residual Unverified Scope](#read-residual-unverified-scope).
>
> **Scope:** this record only. Formatting is not a new review or approval.

<details>
<summary><strong>Contents</strong></summary>

- [Coverage Summary](#read-coverage-summary)
- [Scope And Setup](#read-scope-and-setup)
- [Executed Walkthrough](#read-executed-walkthrough)
- [Row Verdicts](#read-row-verdicts)
- [Findings](#read-findings)
- [Neutral Observations](#read-neutral-observations)
- [Residual Unverified Scope](#read-residual-unverified-scope)
- [Commands And Results](#read-commands-and-results)
- [Disclosures](#read-disclosures)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- Outcome: findings (E-F-01 medium, E-F-02 low; C-F-01 confirmed in a browser); row 112 unverified
- Date: `2026-09-30` (live requests `2026-09-30T20:58:27Z` to `2026-09-30T21:16:05Z`)
- Performed by: BA (responsible-agent verification) for PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, task W001-E; deployment operator: Codex
- Legacy revision: unchanged WAR SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`, procedure [deploy.sh](../../../deploy/deploy.sh)
- Environment: Tomcat 9 / JRE 8, MySQL 5.7, Mailpit sink, through the tunnel at `http://127.0.0.1:18080/xplanner-legacy/`; no restart, redeploy or configuration change
- Records: [checks.json](checks.json), sanitized traces and results under [traces](traces/), browser record [browser-observations.json](traces/browser-observations.json), map rows in [legacy_user_flows.xlsx](../../../../../legacy_user_flows.xlsx), reconnaissance in [legacy_reconnaissance.md](../../../../../legacy_reconnaissance.md)

<a id="read-coverage-summary"></a>

## Coverage Summary

| Observation mode | Scoped checks | Match | Finding | Blocked | Not checked |
|---|---|---|---|---|---|
| Live (HTTP) | 20 | 20 | 0 | 0 | 0 |
| Live (browser, JavaScript executed) | 10 | 6 | 4 | 0 | 0 |
| Not run | 5 | 0 | 0 | 0 | 5 |

Each check appears once. No simulation was used. The PM redirect facts for rows 8, 9, 58 and 60 were not repeated.

<a id="read-scope-and-setup"></a>

## Scope And Setup

- Rows: 62, 71, 76, 82, 91, 112, 114, 126, 149, 151, 167, 180, 184, 191 (assignment W001-E only).
- Accounts: s3sysadmin (data owner, controls, deletes), s3viewer, s3editor and s3admin (read-filter checks; none had a role on the part E project), s3editor in two browser sessions (en and es). The factory account was not used. Credentials were loaded in memory only. No person editor was opened.
- Own data, all prefixed `S3-E`: project `S3-E Private` (228), created by s3sysadmin with no roles assigned and later hidden. Iterations 541 "S3-E Iteration D" and 542 "S3-E Iteration D2" (delete targets, row 91), 543 "S3-E Iteration 1", and 544 and 545 (created in the browser). Stories 328, 329, 561 and 562; tasks 533-536. Time entries for s3sysadmin, the only role person offered in this project's time editor. Notes 500-505 and 572-574, created through the multipart note editor with an empty file part. Project 228 was deleted at the end (row 82).
- The four role accounts, S3 Shared, the setup objects and the other parts' projects were only read (part C's data was not used).
- Browser: the built-in browser pane on `http://127.0.0.1:18080` only. Each session was signed in by a node script (no remember) and opened with the URL session form `;jsessionid=<id>`. No password was typed and the login page was never opened in the browser. Both sessions were signed out with `GET /do/logout` at `21:15:17Z` and `21:15:18Z`; later requests with them were redirected to login.

<a id="read-executed-walkthrough"></a>

## Executed Walkthrough

| Check ID / row | Role/channel | Expected behavior and source | Action performed | Mode | Observed result | Evidence | Verdict / finding |
|---|---|---|---|---|---|---|---|
| E-C-001..003 / 167 | viewer, editor, admin / HTTP | Aggregate timesheet lists readable projects only (row 167) | Aggregate for s3sysadmin (1.5 h on 228), before and after hiding | live | No S3-E Private row | [results-s5-visible.json](traces/results-s5-visible.json) | match |
| E-C-004 / 167 | sysadmin control / HTTP | Readable project listed | Same | live | S3-E Private row 1.5 h | [results-s5-hide.json](traces/results-s5-hide.json) | match |
| E-C-005..007 / 180 | viewer, editor, admin / HTTP | Text search filtered; numeric id added without read check; note id gives parent (row 180) | Text, project-scoped and numeric searches | live | Text: none; "561" lists story 561; "572" lists task 535, not the note | [results-s5-visible.json](traces/results-s5-visible.json) | match |
| E-C-008 / 180 | sysadmin control / HTTP | Readable objects found | Same searches | live | Story 561 and note 572 found by text | same | match |
| E-C-009..011 / 184 | viewer, editor, admin / HTTP | ID jump and view pages without read check (row 184) | ID jump on 228, 543, 561, 535, note 505; direct view URLs | live | All 302 to the view page (note 505 to story 561); pages 200 with content; same after hiding | [s5-readfilter-hide.trace.json](traces/s5-readfilter-hide.trace.json) | match |
| E-C-012 / 76 | sysadmin / HTTP | Hidden column with yes/no; hidden last (row 76) | Project editor Hidden, Update | live | Hidden? column; `228 \| S3-E Private \| ... \| Y` last (also last by name) | [results-s5-hide.json](traces/results-s5-hide.json) | match |
| E-C-013..015 / 76 | viewer, editor, admin / HTTP | No Hidden column without hide permission | Projects list before and after hiding | live | No Hidden? column; project not listed (no read permission) | same | match |
| E-C-016 / 91 | sysadmin / HTTP | Iteration delete cascades to time entries (row 91) | Delete iteration 541 with story, task, 1.0 h | live | Pages 500; timesheet 1.0 to 0.0; notes of this attempt were not created | [s2b-iteration-delete.trace.json](traces/s2b-iteration-delete.trace.json) | match |
| E-C-017 / 91 | sysadmin / HTTP | Attached notes not deleted | Delete iteration 542 with 0.5 h and notes 501-503 | live | Pages 500; hours gone; notes still open in the note editor | [s4-note-orphan.trace.json](traces/s4-note-orphan.trace.json) | match |
| E-C-018 / 126 | sysadmin / HTTP | Story delete cascades; notes remain (row 126) | Delete story 562 (task 536, 0.5 h, notes 573, 574) | live | Story and task 500; timesheet 2.0 to 1.5; notes still stored | [s3-build.trace.json](traces/s3-build.trace.json) | match |
| E-C-019 / 82 | sysadmin / HTTP | Project delete cascades; orphan notes remain (row 82) | Delete project 228 from the list | live | Confirm text as mapped; all child pages 500; hours gone; six notes still stored | [results-s6.json](traces/results-s6.json) | match |
| E-C-020 / 62 | editor / HTTP | Test-support action redirects to returnto or projects (row 62) | `/do/edit/properties` without a property name (sets nothing) | live | returnto: 302 to it; none: projects page; absolute: 302 `http://example.invalid/s3e-probe` (not followed) | [s6-final.trace.json](traces/s6-final.trace.json) | match |
| E-C-021..024 / 62 | not run | dataSample, notifier, clock, property set | Not run | not-run | Not observed | none | not-checked |
| E-C-025 / 112 | not run | Manual sampling action and unscheduled trigger (row 112) | Not run | not-run | Not observed | none | not-checked |
| E-C-026 / 191 | editor en / browser | Footer toggles wide layout; persists via localStorage (row 191) | Real clicks, page change, reload | live | 1020 px to 1584 px, `widescreen` true; kept on next page; back to 1020 px | [browser-observations.json](traces/browser-observations.json) | match |
| E-C-027 / 71 | editor en / browser | jQuery picker inserts yyyy-MM-dd (row 71) | Picked dates, created iteration 544 | live | `2026-10-05` / `2026-10-16` stored as picked | same | match |
| E-C-028 / 71 | editor en / browser | Calendar button inserts format.date (row 71) | Clicked Calendar, name empty | live | ReferenceError `showCalendar`; form submitted; nothing inserted | same | finding E-F-01 |
| E-C-029 / 71 | editor es / browser | jQuery picker yyyy-MM-dd in every session | Picked dates, created iteration 545 | live | `2026-10-07` / `2026-10-21` stored as picked | same | match |
| E-C-030 / 71 | editor es / browser | es calendar button inserts dd-MM-yyyy, misread | Clicked Calendario, name empty | live | Same ReferenceError and submit; no value inserted | same | finding E-F-01 |
| E-C-031 / 114 | editor en / browser | Board with three columns from REST; drag saves nothing (row 114) | Opened board of 543; mouse drag to done; reload | live | REST 200; card moved; no request; back under not started after reload | same | match |
| E-C-032 / 149 | editor en / browser | Insert Time fills current time; Update saves, redirect (row 149) | Insert Time twice; saved 1.0 h | live | Start then end filled from the browser clock; redirect to task page | same | match |
| E-C-033 / 149 | editor es / browser | Insert Time in session format (carried C-F-01) | Insertar fecha twice, not saved | live | `30-09-2026 23:09 ` at 23:14 (month in the minutes place) | same | finding C-F-01 (confirmed) |
| E-C-034 / 151 | editor en / browser | Remaining hours recalculate, red when negative (row 151) | Durations 1, 3, 1 | live | 1.5 to 0.5; with 3 the field shows 0 and the label turns red | same | finding E-F-02 |
| E-C-035 / 151 | editor en / browser | Estimate updated on save | Saved with remaining 0.5 | live | Estimate 3.0 = 2.5 + 0.5 | same | match |

<a id="read-row-verdicts"></a>

## Row Verdicts

| Row | Verdict | Basis |
|---|---|---|
| 62 | partially verified | Only the no-op redirect of the property action was run; the four state-changing actions act globally (not run). |
| 71 | difference | E-F-01; the jQuery-picker part matches in en and es. |
| 76 | partially verified | Hidden column and Y for sysadmin only. Visibility of a hidden project for a reader with a role was not observed: no role was assigned, as the assignment required. |
| 82 | partially verified | Cascade (page level) and orphan notes observed; history, person-role and attachment rows not observed. |
| 91 | partially verified | As row 82; history rows not observed. |
| 112 | unverified | The manual sampling action is global; not run. |
| 114 | live-verified | E-C-031. |
| 126 | partially verified | As row 91. |
| 149 | difference | C-F-01 confirmed in a browser; the en behavior matches. |
| 151 | difference | E-F-02; the save behavior matches. |
| 167, 180, 184 | live-verified | E-C-001 to E-C-011. |
| 191 | live-verified | E-C-026. |

<a id="read-findings"></a>

## Findings

| ID | Type | Evidence | Required update | Return stage |
|---|---|---|---|---|
| E-F-01 (medium) | behavior difference (map wrong) | E-C-028, E-C-030; [browser-observations.json](traces/browser-observations.json) | Rows 71 and 69 (column E), and row 71 (columns G and I): the iteration editor calendar buttons (`input type=image`, `onclick showCalendar(...)`) call a function the page never defines. Only `timesheet.jsp` and `aggregateTimesheet.jsp` load `/calendar/calendar.js` and `calendarHelper.js`. A click throws a ReferenceError and submits the editor form, and no date is inserted. Only the jQuery picker inserts dates (yyyy-MM-dd, stored as picked in en and es), so the dd-MM-yyyy misreading applies to typed dates only. Not observed: a click on a filled, valid form presumably saves it. | 1 |
| E-F-02 (low) | map imprecise | E-C-034 | Row 151 column G: the value is recalculated on change of start, end, duration or delete. A negative result is shown as 0 with the label in red. Insert Time alone does not trigger it. | 1 |
| C-F-01 (carried, part C) | confirmation | E-C-033 | No new record: the es Insert Time output `dd-MM-yyyy HH:MM ` was observed in a real browser. | 1 (with C-F-01) |

<a id="read-neutral-observations"></a>

## Neutral Observations

- Starting an iteration with no other started iteration in the project: the Start link (GET) started it at once and redirected to the iteration page, without a confirmation page (iterations 541-543).
- The time-editor person selects on project 228 listed only S3 Sysadmin and the factory account, because the role accounts had no role there.
- The note editor opened with only `oid` and `returnto` answers 500 "JspException: No parameter"; with the page link's full parameters (`fkey`, `projectId`, `attachedToId`) it opens.
- For a note whose parent was deleted, the ID jump answers 200 "ID n not found", and content search no longer lists it, but the note is still stored (its editor opens).
- The personal timesheet of s3sysadmin, read by s3viewer and s3editor, lists the hours on the unreadable project. This is consistent with the recorded missing read check on the personal timesheet (row 164, not in this scope).
- The task board for iteration 543 (project 228) shows the breadcrumb `Top > S3-B Planning`, linking to project 222.
- `/do/edit/properties` is reachable by the editor (no admin check), consistent with CHK-002.
- Insert Time uses the browser's local clock (UTC+2 in this browser), not the server time.

<a id="read-residual-unverified-scope"></a>

## Residual Unverified Scope

- Row 62 (`dataSample`): samples every active iteration of every project (`Metrics.xml` IterationToSample), so it would change other parts' data. Retry: an owner/PM-approved window or an isolated environment. Actor: PM.
- Row 62 (`missingTimeEntryNotification`): mails all persons with missing time entries into the shared sink and would disturb the row 65 reminder observation. Retry: after row 65, with PM approval. Actor: PM.
- Row 62 (`putTheClockForward`): any request moves or resets the global clock. Retry: as for `dataSample`.
- Row 62 (`properties` with a name): sets a global property. Retry: an isolated environment or an owner decision.
- Row 112: the manual sampling action is the global command above; the nightly trigger cannot be observed; start/close samples are not visible without charts or database access. Retry: as for `dataSample`, or a PM read-only database query.
- Row 76: visibility of a hidden project for a reader who has a role but no hide permission. Retry: PM assigns a role on a hideable probe project.
- Rows 82, 91 and 126: history rows, person-role rows and attachment files were not observed (attachments cannot be stored, C-F-04). Time-entry removal was observed at page level only. Retry: a PM read-only database query after a repeated delete.

<a id="read-commands-and-results"></a>

## Commands And Results

| Command or procedure | Result | Evidence |
|---|---|---|
| `node .migration-tmp/stage-03/tools/safe-run.js --self-test` | pass (30 cases); runner SHA-256 `fc91d350…b5e7` | runner output |
| Part E node scripts `s1`-`s6` through the runner (sequential, 250 ms pause per request) | pass | [traces](traces/) |
| `bsession.js login/logout` (browser sessions; ids passed only as the environment variable `E_SID`) | pass; both sessions invalidated | [browser-session-logout-en.trace.json](traces/browser-session-logout-en.trace.json) |
| Built-in browser steps | pass | [browser-observations.json](traces/browser-observations.json) |
| Evidence self-scan (`selfscan.js`) | 0 password, 0 factory pair, 0 session-id, 0 cookie-value hits in 26 files (11 plain account user IDs, not secrets) | runner output |

<a id="read-disclosures"></a>

## Disclosures

- One read-only `git hash-object` was run on the BA skill before the runner rules were fully applied, although the common rules say not to run git. No other git command was run.
- The folder `.migration-tmp/stage-03/ba-scratch/` was listed once, which showed the other parts' folder names (none was opened). The runner source and configuration under `tools/` were read.
- In the first creation attempt the script took the page's first form, the header search form. Two harmless posts therefore went to `/do/search/content`, followed by one `GET /do/view/iteration?oid=null` (500). Nothing was created. Trace: [s1-attempt1.trace.json](traces/s1-attempt1.trace.json).
- Four note posts answered 500 (ClassCastException), because the client sent the empty file field without `filename=""`. This was a client encoding problem, not a legacy finding. The retry was sent as a browser sends it. Traces: [s2b-iteration-delete.trace.json](traces/s2b-iteration-delete.trace.json), [s2c-note-probe-1.trace.json](traces/s2c-note-probe-1.trace.json).
- The browser session ids appeared in tool inputs (navigation URLs and the `E_SID` environment value). They were not written to evidence, the runner log or scratch: 0 hits in each. Both sessions were signed out.
- The browser made 3 viewport screenshots of application pages, with no secret visible; none is stored. The viewport was emulated at 1600x900 and then reset. `localStorage.widescreen` = `false` stays in the pane for origin 127.0.0.1:18080.
- One request carried an absolute `returnto` (`http://example.invalid/s3e-probe`). Only its Location header was recorded; it was not followed.
- Remaining data: nine orphan notes (500-505, 572-574, subjects starting "S3-E note") stay in the database. The legacy note delete does not remove notes (C-F-07), and their parents are gone. Nothing else of part E remains. Mail and the Mailpit sink were not read.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 3 part E; [checklist](../../../../../error-prevention-checklist.md) SHA-256 `8a15e08c…90be` (the first 8 and last 4 hex digits). CHK-002 (display-level versus direct requests: the ID jump, view pages, the dashboard and the property action requested directly by roles without permission; passed). CHK-004 (the date picker and Insert Time exercised in en and es; other locales excluded, covered by part C; passed). CHK-006 (the full data effect of the project, iteration and story deletes checked for time entries and notes; history, person-role and attachment rows excluded with reason). CHK-009 (self-scan 0 hits; passed). CHK-010 (links followed with their returnto and fkey parameters; passed). CHK-012 (the returnto value followed to the Location header; passed).
- **Learning update:** proposal for PM, not admitted by this part. A live check of a date input aid must execute the control in a browser and confirm that its script is loaded: the calendar-button claim in rows 69 and 71 rested on the JSP onclick text alone.

# Stage 3 Walkthrough W001 - Setup Part

**What did the setup part (role accounts, shared project and the first business chain) observe on the live legacy application, what differed from the map, and what could not be verified?**

<!-- ARTIFACT_READING_START -->
> [!CAUTION]
> **Recorded result: action required**
>
> findings (9 map findings; 2 rows unverified)
>
> **Numbers recorded:** 63 checks on 45 workbook rows: 47 match, 14 finding, 2 blocked. Rows: 14 difference, 17 partially verified, 12 live-verified, 2 unverified.
>
> **Details:** [Coverage Summary](#read-coverage-summary) / [Findings](#read-findings).
>
> **Scope:** this record only. Formatting is not a new review or approval.

<details>
<summary><strong>Contents</strong></summary>

- [Coverage Summary](#read-coverage-summary)
- [Scope And Setup](#read-scope-and-setup)
- [Executed Walkthrough](#read-executed-walkthrough)
- [Row Verdicts](#read-row-verdicts)
- [Findings](#read-findings)
- [Residual Unverified Scope](#read-residual-unverified-scope)
- [Handoff For Other Parts](#read-handoff-for-other-parts)
- [Addendum: Role Projects](#read-addendum-role-projects)
- [Commands And Results](#read-commands-and-results)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- Outcome: findings (9 map findings; 2 rows unverified)
- Date: `2026-09-30` (`2026-09-30T19:40:50.620Z` to `2026-09-30T19:49:39.208Z`)
- Performed by: BA for PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (responsible-agent verification); deployment operator: Codex
- Legacy revision: unchanged WAR SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`, deployed from commit `eb7720f` with [deploy.sh](../../../deploy/deploy.sh)
- Environment: Tomcat 9 / JRE 8, MySQL 5.7, Mailpit sink, reached through the tunnel at `http://127.0.0.1:18080/xplanner-legacy/` and `http://127.0.0.1:18025/`
- Records: [checks.json](checks.json), sanitized traces and results under [traces](traces/), map rows in [legacy_user_flows.xlsx](../../../../../legacy_user_flows.xlsx), reconnaissance in [legacy_reconnaissance.md](../../../../../legacy_reconnaissance.md)

<a id="read-coverage-summary"></a>

## Coverage Summary

63 checks on 45 workbook rows: 47 match, 14 finding, 2 blocked. Rows: 14 difference, 17 partially verified, 12 live-verified, 2 unverified.

| Observation mode | Scoped checks | Match | Finding | Blocked | Not checked |
|---|---|---|---|---|---|
| Live | 62 | 47 | 14 | 1 | 0 |
| Not run | 1 | 0 | 0 | 1 | 0 |

<a id="read-scope-and-setup"></a>

## Scope And Setup

- Roles: the factory default account (setup only), s3viewer, s3editor, s3admin and s3sysadmin. The factory account created the four people with the application's Add Person editor, created the project `S3 Shared` (id 220) and set the project roles with the person editor. It was not used after that.
- Data: iteration `S3-setup Iteration 1` (231), story `S3-setup Story 1` (253), task `S3-setup Task 1` (264) with one 1.5 h time entry. All created by s3editor; no step needed s3admin or s3sysadmin.
- Channel: web pages over HTTP. Each form was read from the page and submitted with the values the page carries; where a button sets a hidden value by onclick (project editor), that value was sent. No page script ran, and the built-in browser was not used.
- Access boundary: only the two tunnel ports; redirects were not followed off the host; remember-me was left unchecked; sequential requests with a pause.

<a id="read-executed-walkthrough"></a>

## Executed Walkthrough

| Check | Row | Role | Expected | Observed | Evidence | Verdict |
|---|---|---|---|---|---|---|
| setup-C-001 | 77 | factory default account (seeded system administrator) | With no readable project the projects page shows the projects.none message. | Page "XPlanner Projects" shows "No projects defined yet." and an "Add Project" link. | [results-phaseA1.json](traces/results-phaseA1.json) | match |
| setup-C-002 | 43 | factory default account (seeded system administrator) | A user with create.person adds a person with name, user ID, initials, e-mail, phone and password; the person is saved and the user is returned to the people list. | Each POST /do/edit/person answered 302 to /do/view/people; the four people are listed with oids 209-212. | [results-phaseA1.json](traces/results-phaseA1.json) | match |
| setup-C-003 | 34 | factory default account (seeded system administrator) | The System administrator checkbox is shown to sysadmins; posting systemAdmin=true grants the system administrator role. | The checkbox is on the editor for the factory account; the saved editor shows it checked for oid 212; s3sysadmin sees Add Project, the Hidden? column and project Delete without any role on S3 Shared. Revocation on a later save and visibility to non-sysadmins were not exercised. | [results-phaseA2.json](traces/results-phaseA2.json), [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-004 | 37 | factory default account (seeded system administrator) | People list with user ID, name, initials, phone and e-mail, sortable, paged at the bottom, mailto links, default sort by name. | Columns Actions, User Id, Name, Initials, Phone, Email; sort links on User Id, Name, Initials and Email; 5 mailto links; rows in name order. Paging not observable with 5 people. | [results-phaseA1.json](traces/results-phaseA1.json) | match |
| setup-C-005 | 78 | factory default account (seeded system administrator) | A user with create.project creates a project with name, description, escape-brackets, missing-time reminder and wiki URL; returned to the projects list. | Editor shows Name, Description, Hidden, Escape brackets, reminder checkbox and Project Wiki link; POST answered 302 to /do/view/projects; project listed with ID 220. | [results-phaseA1.json](traces/results-phaseA1.json), [phaseA1-factory.trace.json](traces/phaseA1-factory.trace.json) | match |
| setup-C-006 | 33 | factory default account (seeded system administrator) | Per-project radio buttons in the person editor set none/viewer/editor/admin; saved roles change what the person can see and do. | The editor offers a drop-down select projectRole[0] (hidden projectId[0]=220) with None, Viewer, Editor, Admin, not radio buttons. Each POST answered 302 to /do/view/people; re-opened editors show viewer, editor and admin selected; the roles changed the visible controls (checks on rows 24-26). | [results-phaseA2.json](traces/results-phaseA2.json) | finding (setup-F-02) |
| setup-C-007 | 46 | factory default account (seeded system administrator) | An authorized user updates a person; changes saved; returnto page shown. | POST answered 302 to the returnto page /do/view/people; the change is shown on re-opening. | [results-phaseA2.json](traces/results-phaseA2.json) | match |
| setup-C-008 | 47 | s3viewer, s3editor, s3admin, s3sysadmin | Password fields are shown when the login module can change passwords; a new password is stored and replaces the old one. | New password / Confirm New Password fields are present; all four accounts sign in with the password set in the editor. The stored digest form and a change of an existing password were not observed. | [results-phaseA1.json](traces/results-phaseA1.json), [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-009 | 8 | s3viewer (viewer on S3 Shared) | Sign-in with user ID and password redirects to /do/view/projects. | POST answered 302 to /do/view/projects; page "XPlanner Projects" with "user <userId>" in the header. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-010 | 8 | s3editor (editor on S3 Shared) | Same as above. | POST answered 302 to /do/view/projects (landing page "XPlanner Projects"). | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-011 | 8 | s3admin (admin on S3 Shared) | Same as above. | POST answered 302 to /do/view/projects (landing page "XPlanner Projects"). | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-012 | 8 | s3sysadmin (system administrator) | Same as above. | POST answered 302 to /do/view/projects (landing page "XPlanner Projects"). | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-013 | 8 | no session | Login form with User ID, Password, Remember me and a "Log In" button. | Form loginForm posts to /do/login with fields userId, password, remember (value Y, checked by default) and submit action with the label "Login" (label "Remember me?"). | [results-phaseB.json](traces/results-phaseB.json) | finding (setup-F-01) |
| setup-C-014 | 19 | s3viewer (viewer on S3 Shared) | Log out invalidates the session, removes the remember-me cookies and shows the login page. | /do/logout answered 200 with the login form and Set-Cookie userid and password with Max-Age=0 plus a new session cookie; the next protected request answered 302 to /do/login. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-015 | 19 | s3editor (editor on S3 Shared) | Same as above. | Same observation both times. | [results-phaseB.json](traces/results-phaseB.json), [results-chain6.json](traces/results-chain6.json) | match |
| setup-C-016 | 19 | s3admin (admin on S3 Shared) | Same as above. | Same observation. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-017 | 19 | s3sysadmin (system administrator) | Same as above. | Same observation. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-018 | 17 | no session | A /do/* request without a session is redirected to /do/login. | Every request answered 302 to /do/login. /setting/* was not requested. | [results-phaseB.json](traces/results-phaseB.json), [results-chain6.json](traces/results-chain6.json) | match |
| setup-C-019 | 76 | s3viewer, s3editor, s3admin, s3sysadmin | The Hidden column is shown only to users who may hide projects. | Only s3sysadmin sees "Hidden?" (value N); s3viewer, s3editor and s3admin do not. Ordering of hidden projects was not tested (no hidden project). | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-020 | 24 | s3viewer, s3editor, s3admin, s3sysadmin | Editors and admins may not create projects: the "Create project" link is hidden. | Add Project is shown only to s3sysadmin; not to s3viewer, s3editor or s3admin. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-021 | 24 | s3viewer, s3editor, s3admin, s3sysadmin | Editors may not create people: the "Add person" link is hidden for them (and shown only with create.person, rows 43 and 50). | Add Person and Import People are shown to all four accounts, including s3viewer and s3editor. | [results-phaseB.json](traces/results-phaseB.json) | finding (setup-F-03) |
| setup-C-022 | 43 | s3viewer (viewer on S3 Shared) | The Add Person link is shown under create.person only. | Add Person (/do/edit/person) is shown to both. | [results-phaseB.json](traces/results-phaseB.json) | finding (setup-F-03) |
| setup-C-023 | 50 | s3viewer (viewer on S3 Shared) | The Import People link is shown under create.person only. | Import People (/do/import/people) is shown to both. The import itself was not exercised. | [results-phaseB.json](traces/results-phaseB.json) | finding (setup-F-03) |
| setup-C-024 | 24 | s3editor (editor on S3 Shared) | Editors may not delete iterations: the iteration delete control is hidden for them. | s3editor sees the iteration edit icon but no delete icon or Delete link; s3admin and s3sysadmin see both. | [results-phaseD.json](traces/results-phaseD.json) | match |
| setup-C-025 | 91 | s3viewer, s3editor, s3admin, s3sysadmin | The iteration delete link is shown to users with delete permission on the iteration, not to editors. | Delete shown to s3admin and s3sysadmin, hidden for s3editor and s3viewer. | [results-phaseD.json](traces/results-phaseD.json) | match |
| setup-C-026 | 25 | s3sysadmin (system administrator) | A role assigned for project 0 applies to all projects. | S3 Shared is listed and its page offers Edit, Delete and Create Iteration. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-027 | 26 | s3viewer, s3editor, s3admin, s3sysadmin | Edit, delete, move/continue and time actions appear only with permission (project delete needs sysadmin.delete, project edit admin.edit). | s3viewer sees no action control on any of the four pages; s3editor sees story and task edit/delete/move-continue/time controls and Create Iteration but no project Edit; s3admin adds project Edit; only s3sysadmin sees project Delete. | [results-phaseD.json](traces/results-phaseD.json), [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-028 | 23 | s3viewer, s3editor, s3admin, s3sysadmin | viewer < editor < admin < sysadmin: a viewer reads, an editor creates and edits, an admin adds admin rights, a sysadmin does everything. | The controls grow in that order (checks on rows 24-26); the server-side effect of each permission was not tested in this part. | [results-phaseD.json](traces/results-phaseD.json) | match |
| setup-C-029 | 42 | s3viewer, s3editor, s3admin, s3sysadmin | The person-page edit link is shown to that person or to a user with admin.edit on system.person for some project; links to people, timesheet and exports. | Own page: Edit, People, Timesheet and Export for all four; another person page: Edit only for s3admin and s3sysadmin. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-030 | 39 | s3viewer, s3editor, s3admin, s3sysadmin | With projectId the list shows only people with a role on the project, titled "People in project <name>". | Heading "People on project: S3 Shared" (HTML title "People"; bundle key people.project.title); listed: the three project members plus s3sysadmin and the factory account, which hold only the project-0 system administrator role. | [results-phaseB.json](traces/results-phaseB.json) | finding (setup-F-04) |
| setup-C-031 | 40 | s3viewer (viewer on S3 Shared) | A person page shows active, planned and completed tasks, stories as customer and tracker, and future tasks, with "none" messages. | HTTP 200 with the six "No ..." messages. | [results-phaseB.json](traces/results-phaseB.json) | match |
| setup-C-032 | 40 | s3editor (editor on S3 Shared) | Same page for a person with work. | HTTP 500 "An error has occurred": javax.el.ELException reading cachedActualHours on net.sf.xplanner.domain.UserStory, caused by org.hibernate.LazyInitializationException for UserStory.tasks and Task.timeEntries (no session). The person page of s3viewer (oid 209) still renders. | [results-chain6.json](traces/results-chain6.json), [results-chain7.json](traces/results-chain7.json) | finding (setup-F-05) |
| setup-C-033 | 41 | s3editor (editor on S3 Shared) | Clock and edit icons per active task on the person page. | not observed | [results-chain7.json](traces/results-chain7.json) | blocked |
| setup-C-034 | 75 | s3editor (editor on S3 Shared) | Projects list with ID, name and the iteration in progress; people and aggregate timesheet links. | Columns ID, Project Name, Iteration; after the start the row shows "S3-setup Iteration 1"; People and Team Timesheet links. Sorting not observable with one project. | [results-phaseB.json](traces/results-phaseB.json), [results-chain2.json](traces/results-chain2.json) | match |
| setup-C-035 | 18 | s3editor (editor on S3 Shared) | With exactly one visible project that has a current iteration the root URL redirects to that iteration. | 302 to /do/view/iteration?oid=231. The other branch (redirect to the projects list) was not requested. | [results-chain2.json](traces/results-chain2.json) | match |
| setup-C-036 | 83 | s3editor (editor on S3 Shared) | Project page with description and an iteration table (ID, name, start/end, days worked, stories), icons by permission, create iteration, people, export and history links. | Table headers Actions, ID, Iteration, Start Date, End Date, Days Wrk., Stories; row 231 2026-09-30 to 2026-10-13, 0.0, 0; links People, Export, History, Create Iteration. Paging and sorting not observable with one iteration. | [results-chain1.json](traces/results-chain1.json) | match |
| setup-C-037 | 84 | s3viewer, s3editor, s3admin, s3sysadmin | A project without iterations shows iterations.none ("No iterations for this project."). | The page shows the description and actions only; no "No iterations for this project." message. | [results-phaseB.json](traces/results-phaseB.json) | finding (setup-F-06) |
| setup-C-038 | 88 | s3editor (editor on S3 Shared) | A user with create permission creates an iteration with name, start and end date (calendar pickers) and description; returned. | Editor has calendar image buttons; POST answered 302 to /do/view/project?oid=220 and the iteration is listed (oid 231). | [results-chain1.json](traces/results-chain1.json) | match |
| setup-C-039 | 93 | s3editor (editor on S3 Shared) | An iteration without stories shows stories.none. | "No stories have been defined." is shown. | [results-chain1.json](traces/results-chain1.json) | match |
| setup-C-040 | 98 | s3editor (editor on S3 Shared) | An editor starts an iteration; without another active iteration it starts at once, no confirmation page. | 302 back to /do/view/iteration?oid=231, no confirmation page; Start is replaced by Close and a Dashboard link appears; the projects list shows it as current. Opening data samples are not observable in the UI. | [results-chain2.json](traces/results-chain2.json) | match |
| setup-C-041 | 121 | s3editor (editor on S3 Shared) | An editor creates a story with name, disposition, customer, tracker, status, priority, order, estimate and description; saved; returned to the iteration. | POST answered 302 to /do/view/iteration?oid=231; story 253 listed. | [results-chain3.json](traces/results-chain3.json) | match |
| setup-C-042 | 121 | s3editor (editor on S3 Shared) | The disposition and status chosen in the editor are stored with the story. | The story page and the iteration table show Disposition "Planned" and Status "Draft". | [results-chain3.json](traces/results-chain3.json) | finding (setup-F-07) |
| setup-C-043 | 122 | s3editor (editor on S3 Shared) | A new story defaults to priority 4. | Priority field pre-filled with 4 (order 1, estimate 0.0). | [results-chain2.json](traces/results-chain2.json) | match |
| setup-C-044 | 92 | s3viewer (viewer on S3 Shared) | Iteration page with date range, progress bar, estimated/actual/remaining hours and the story table columns. | Date range, "Hours: Estimate 4.0, Actual 1.5, Remaining 0.0" and headers Sel., Actions, ID, Order, User Story, !, Cust., Progress, Act., Rem., Cur. Est., Orig. Est., Tasks, Tracker, Disp., Status; icons only for s3editor and above. The progress-bar markup was not inspected. | [results-phaseD.json](traces/results-phaseD.json), [results-chain3.json](traces/results-chain3.json) | match |
| setup-C-045 | 127 | s3editor (editor on S3 Shared) | Story page with estimated/actual/remaining hours, customer, tracker, last update, disposition, status, description and a task table; create task, export and history links. | Priority, Estimated Hours, Actual Hours, Tracker, Remaining Hours, Last Update, Disposition, Status, description; Create Task, Export, History. No customer line (none assigned); a story with a customer was not viewed. | [results-chain3.json](traces/results-chain3.json) | match |
| setup-C-046 | 128 | s3editor (editor on S3 Shared) | A story without tasks shows story.no_tasks. | "No tasks have been defined." is shown. | [results-chain3.json](traces/results-chain3.json) | match |
| setup-C-047 | 125 | s3editor (editor on S3 Shared) | An editor updates a story; changes saved. | POST answered 302 to the story; Disposition stays "Planned" and Status "Draft". The edit form pre-selects neither the stored disposition nor the stored status. | [results-chain4.json](traces/results-chain4.json) | finding (setup-F-07) |
| setup-C-048 | 134 | s3editor (editor on S3 Shared) | An editor creates a task with name, type, disposition, acceptor, estimate and description; returned to the story. | POST answered 302 to /do/view/userstory?oid=253; task 264 listed with type Feature, acceptor S3E, estimate 2.0. | [results-chain4.json](traces/results-chain4.json) | match |
| setup-C-049 | 134 | s3editor (editor on S3 Shared) | The disposition chosen in the task editor is stored. | The story task table shows Disp. "Planned". | [results-chain4.json](traces/results-chain4.json) | finding (setup-F-08) |
| setup-C-050 | 135 | s3editor (editor on S3 Shared) | Task type options carry label text as values. | Option values equal the English labels (Feature, Debt, Defect, FTest, ATest, Overhead); stored and shown "Feature". The server-default-locale branch was not tested with another locale. | [results-chain3.json](traces/results-chain3.json) | match |
| setup-C-051 | 136 | s3editor (editor on S3 Shared) | The default disposition of a new task is "discovered" when the iteration is active. | "Discovered" is pre-selected. The "planned" branch (inactive iteration) was not observed. | [results-chain3.json](traces/results-chain3.json) | match |
| setup-C-052 | 143 | s3editor (editor on S3 Shared) | Task page with acceptor, estimated hours, created date, actual hours, description and the time log (start, end, report date, duration, pair, description); action links by permission; export and history. | Acceptor, Estimated Hours, Created 2026-09-30, Actual Hours, description; time-log headers Start Time, End Time, Reported Date, Dur., Pair, Description; Edit, Delete, Move/Continue, Edit Time, Export, History. | [results-chain4.json](traces/results-chain4.json), [results-chain6.json](traces/results-chain6.json) | match |
| setup-C-053 | 140 | s3editor (editor on S3 Shared) | A "Complete" button on the task page completes the task; page reloads. | The button reads "Complete Task"; the form posts oid, action=Update, merge=true, completed=true to /do/edit/task; 302 back to the task page, which then offers "Reopen Task". | [results-chain5.json](traces/results-chain5.json) | finding (setup-F-09) |
| setup-C-054 | 141 | s3editor (editor on S3 Shared) | A "Reopen" button reopens a completed task. | The button reads "Reopen Task" (completed=false in its form); shown to s3editor, s3admin and s3sysadmin, not to s3viewer. | [results-chain5.json](traces/results-chain5.json), [results-phaseD.json](traces/results-phaseD.json) | finding (setup-F-09) |
| setup-C-055 | 149 | s3editor (editor on S3 Shared) | The time editor shows a grid with an empty new row; Update saves; redirect to the task page. | Grid with one new row, Insert Time button, format hint "YYYY-MM-DD HH:MM"; POST answered 302 to /do/view/task?oid=264; the time log shows 2026-09-30, 1.5 and the s3editor person as pair member 1. The Insert Time script was not run. | [results-chain6.json](traces/results-chain6.json) | match |
| setup-C-056 | 151 | s3editor (editor on S3 Shared) | The remaining-hours value updates the task estimate on save. | Estimated Hours changed from 2.0 to "1.5 (2.0)", Actual Hours 1.5. The client-side recalculation itself was not run. | [results-chain6.json](traces/results-chain6.json) | match |
| setup-C-057 | 162 | s3editor (editor on S3 Shared) | A personal timesheet for a period summarises hours by project, iteration and story with daily totals and pie charts. | Default period 2026-09-27 to 2026-10-03; summary S3 Shared / S3-setup Iteration 1 / S3-setup Story 1 1.5, Total 1.5; daily table (Wed 30-Sep-26 1.5); three chart images. The period form re-rendered for one day. | [results-chain7.json](traces/results-chain7.json) | match |
| setup-C-058 | 162 | s3editor (editor on S3 Shared) | The timesheet is reached from the person page. | The person page answers HTTP 500 (row 40), so the Timesheet link is not reachable from it for this account. | [results-chain6.json](traces/results-chain6.json) | finding (setup-F-05) |
| setup-C-059 | 138 | s3editor (editor on S3 Shared) | Creating or updating a task sends "Task was created." / "Task was updated." to the editor and acceptor. | The sink held 0 messages at 19:48Z and 19:49Z. Whether the application sent nothing or delivery failed cannot be told without the application log, which BA cannot read. | [results-chain6.json](traces/results-chain6.json), [results-chain7.json](traces/results-chain7.json) | blocked |
| setup-C-060 | 78 | s3sysadmin (system administrator) | A user with create.project creates a project; returned to the projects list. | Each POST answered 302 to /do/view/projects; the projects are listed with ids 221, 222, 223, 224. No factory account was needed. The first script run created the projects and then stopped: it read the relative project links ("project?...") wrongly, so no role was changed. The second run found all four and skipped creating them. No duplicate project exists. | [results-addendum1.json](traces/results-addendum1.json), [addendum1-sysadmin.trace.json](traces/addendum1-sysadmin.trace.json) | match |
| setup-C-061 | 33 | s3sysadmin (system administrator) | A user with admin.edit.role on a project sets a person's role for it; saved roles change what the person can see and do. | Each POST answered 302 to /do/view/people. Re-read editors show S3 Shared unchanged plus the new role on 221-224; the systemAdmin box is unchecked for all three, as before. The control is still the drop-down (setup-F-02). | [results-addendum1.json](traces/results-addendum1.json) | match |
| setup-C-062 | 25 | s3sysadmin (system administrator) | A system administrator (project-0 role) sees and administers every project. | Add Project and the Hidden? column are present; all five projects are listed with Edit and Delete. s3sysadmin is still a system administrator. | [results-addendum2.json](traces/results-addendum2.json) | match |
| setup-C-063 | 26 | s3viewer, s3editor, s3admin, s3sysadmin | Controls follow the role on each project (viewer read only; editor Create Iteration; admin also project Edit; sysadmin also project Delete). | All five projects are listed for every account. s3viewer sees no control, s3editor sees Create Iteration without Edit, s3admin sees Edit without Delete and s3sysadmin sees Edit and Delete, on all five projects. | [results-addendum2.json](traces/results-addendum2.json), [addendum2-viewer.trace.json](traces/addendum2-viewer.trace.json), [addendum2-editor.trace.json](traces/addendum2-editor.trace.json), [addendum2-admin.trace.json](traces/addendum2-admin.trace.json), [addendum2-sysadmin.trace.json](traces/addendum2-sysadmin.trace.json) | match |

<a id="read-row-verdicts"></a>

## Row Verdicts

| Row | Use case | Verdict | Note |
|---|---|---|---|
| 8 | Log in with valid credentials | difference | setup-F-01 |
| 17 | Access protected pages without a session | partially verified | not observed: /setting/* requests were not made. |
| 18 | Access protected pages without a session | partially verified | not observed: the branch that redirects to the projects list was not requested. |
| 19 | Log out | live-verified |  |
| 23 | Role hierarchy and default permissions | partially verified | not observed: display level only; server-side effects not tested here. |
| 24 | Role hierarchy and default permissions | difference | setup-F-03 |
| 25 | Role hierarchy and default permissions | live-verified |  |
| 26 | Permission-driven UI actions | live-verified |  |
| 33 | Assign project roles to a person | difference | setup-F-02 |
| 34 | Assign project roles to a person | partially verified | not observed: grant on create observed; revocation on a later save and checkbox visibility for non-sysadmins not exercised. |
| 37 | List people | partially verified | not observed: paging not observable with 5 people. |
| 39 | List people | difference | setup-F-04 |
| 40 | View person page | difference | setup-F-05 |
| 41 | View person page | unverified | blocked by setup-F-05: the only person page with tasks fails. |
| 42 | View person page | live-verified |  |
| 43 | Create person | difference | setup-F-03 |
| 46 | Edit person and password | live-verified |  |
| 47 | Edit person and password | partially verified | not observed: stored digest form and change of an existing password not observed. |
| 50 | Import people from a file | difference | setup-F-03 |
| 75 | List projects | partially verified | not observed: sorting not observable with one project. |
| 76 | List projects | partially verified | not observed: ordering of hidden projects not tested. |
| 77 | List projects | live-verified |  |
| 78 | Create project | live-verified |  |
| 83 | View project | partially verified | not observed: paging and sorting not observable with one iteration. |
| 84 | View project | difference | setup-F-06 |
| 88 | Create iteration | live-verified |  |
| 91 | Delete iteration | partially verified | not observed: only the link visibility; the delete and its cascade were not run. |
| 92 | View iteration stories | partially verified | not observed: progress-bar markup not inspected. |
| 93 | View iteration stories | live-verified |  |
| 98 | Start iteration | partially verified | not observed: opening data samples not observable in the UI. |
| 121 | Create user story | difference | setup-F-07 |
| 122 | Create user story | live-verified |  |
| 125 | Edit user story | difference | setup-F-07 |
| 127 | View user story | partially verified | not observed: customer display not observed (no customer assigned). |
| 128 | View user story | live-verified |  |
| 134 | Create task | difference | setup-F-08 |
| 135 | Create task | partially verified | not observed: server-default-locale branch not tested. |
| 136 | Create task | partially verified | not observed: the planned branch (inactive iteration) not observed. |
| 138 | Task e-mail notification | unverified | no message reached the mail sink; cause not isolable without the application log. |
| 140 | Complete or reopen task | difference | setup-F-09 |
| 141 | Complete or reopen task | difference | setup-F-09 |
| 143 | View task | live-verified |  |
| 149 | Record time on a task | partially verified | not observed: the Insert Time script was not run. |
| 151 | Record time on a task | partially verified | not observed: the client-side recalculation was not run. |
| 162 | Personal timesheet | difference | setup-F-05 |

<a id="read-findings"></a>

## Findings

| ID | Rows / cells | Observed | Minimal correction | Severity |
|---|---|---|---|---|
| setup-F-01 | 8 / F8 | The submit button of the login form reads "Login" (bundle login.label); the checkbox label reads "Remember me?". | Row 8, column F: replace "Log In button" with "Login button". | low |
| setup-F-02 | 33 / F33 | The person editor offers one drop-down select per project (projectRole[i], hidden projectId[i]) with None, Viewer, Editor, Admin. | Row 33, column F: "Per-project role drop-down (None, Viewer, Editor, Admin) in the person editor". | low |
| setup-F-03 | 24, 43, 50 / D24, F24, H43, H50 | Add Person and Import People on /do/view/people are shown to s3viewer, s3editor, s3admin and s3sysadmin. | Row 24: remove "create people" from the display-level list, or state that the Add Person and Import People links are shown to every signed-in role observed (viewer included); rows 43 and 50: record that the create.person condition on the people page does not hide the links from viewers or editors live. | medium |
| setup-F-04 | 39 / F39 | Heading "People on project: S3 Shared" (people.project.title = "People on project: {0}"); HTML title "People"; the list includes the two system administrators, who hold only the project-0 role. | Row 39, column F: "Heading 'People on project: <name>'; project members, including system administrators through their project-0 role". | low |
| setup-F-05 | 40, 162 / D40, F40, G40, F162 | For s3editor (tracker of story 253, acceptor of completed task 264 with a 1.5 h entry) /do/view/person?oid=210 answers HTTP 500: javax.el.ELException reading cachedActualHours on UserStory, root org.hibernate.LazyInitializationException for UserStory.tasks and Task.timeEntries. Repeated three times; the page of a person without work renders. The timesheet itself works by its own URL. | Row 40: add an alternative path "person page fails with HTTP 500 (lazy loading outside the session) when the person tracks a story or has tasks with time" and set column G to Partial; row 41: note that it depends on row 40; row 162: note that the entry point fails in that state while /do/view/timesheet?oid=<id> works. | high |
| setup-F-06 | 84 / F84 | A project with no iterations shows no "No iterations for this project." message (all four roles). | Row 84: record that the message is not shown live (column G Partial or No), pending a source check of the iterationCount condition in project.jsp. | low |
| setup-F-07 | 121, 125 / D121, F121, F125 | Disposition and status chosen in the story editor are not stored: created with added/defined and updated to defined/added, the story stays Planned/Draft; the edit form pre-selects neither value. | Rows 121 and 125: state that disposition and status from the editor are not persisted (the story keeps Planned and Draft) and that the edit form does not pre-select them. | medium |
| setup-F-08 | 134 / F134 | A task created with the pre-selected disposition "discovered" is shown with Disp. "Planned". | Row 134: state that the disposition from the task editor is not stored on create (shown Planned); row 136: limit the claim to the pre-selection. | medium |
| setup-F-09 | 140, 141 / F140, F141 | Buttons read "Complete Task" and "Reopen Task"; the completion form posts oid, action=Update, merge=true and completed=true/false to /do/edit/task. | Rows 140 and 141, column F: use "Complete Task" and "Reopen Task" and note that the form uses merge=true (link to rows 124 and the task merge binding). | low |

These are observations of the legacy reference. They do not change the workbook or the reconnaissance; Stage 1 decides the corrections.

<a id="read-residual-unverified-scope"></a>

## Residual Unverified Scope

- Row 41: Person page of the only account with tasks answers HTTP 500 (setup-F-05). Retry: After the Stage 1 disposition of setup-F-05, or with a person whose page renders and who has an active task.
- Row 138: No message in the mail sink after task create, complete and update; the application log is not accessible to BA. Retry: PM checks the application log for mail errors and confirms the SMTP path to the sink; then repeat the task create and read the sink.
- Row 149: Insert Time is a client-side script; the built-in browser was not needed for the chain. Retry: A part that uses the built-in browser on 127.0.0.1:18080.
- Row 151: Remaining-hours recalculation is a client-side script. Retry: Same as row 149.
- Row 38, 44, 45, 48, 49, 51-53: People Management rows outside the setup steps (hidden people, validation, duplicate user ID, hide, delete, import). Retry: Assigned to the People Management part.

<a id="read-handoff-for-other-parts"></a>

## Handoff For Other Parts

The handoff file [handoff.json](../../../../../../.migration-tmp/stage-03/ba-scratch/setup/handoff.json) lists the account user IDs with verified roles and person ids (no passwords), the project and chain ids, the key page URLs, how sign-in works and the traps below.

- Sign-in: `GET /do/login`, then POST `userId`, `password` and `action=Login` to the form action; success answers 302 to `/do/view/projects`. Logout is `GET /do/logout` (200, login page).
- No CSRF token on any form used. The project editor needs `action=Create` or `action=Update` set explicitly.
- Saving a person editor as s3sysadmin without `systemAdmin=true` revokes the target's system administrator role (row 34).
- The person page of s3editor answers HTTP 500 after the chain (setup-F-05); use the timesheet URL directly.
- Keep `returnto` on editor links; an iteration editor request without it answered HTTP 500.

<a id="read-addendum-role-projects"></a>

## Addendum: Role Projects

PM asked for this follow-up so that parallel parts do not each save the role-account person editors. s3sysadmin created four projects, in order: `S3-A Access` (221), `S3-B Planning` (222), `S3-C Time` (223), `S3-D Integrations` (224). It then set the roles through the person editor of s3viewer, s3editor and s3admin, keeping S3 Shared (220). The s3sysadmin editor was never opened, and the factory account was not needed. Checks setup-C-060 to setup-C-063.

| Account | S3 Shared (220) | S3-A Access (221) | S3-B Planning (222) | S3-C Time (223) | S3-D Integrations (224) |
|---|---|---|---|---|---|
| s3viewer | viewer; listed, viewer (read only) | viewer; listed, viewer (read only) | viewer; listed, viewer (read only) | viewer; listed, viewer (read only) | viewer; listed, viewer (read only) |
| s3editor | editor; listed, editor (Create Iteration, no Edit) | editor; listed, editor (Create Iteration, no Edit) | editor; listed, editor (Create Iteration, no Edit) | editor; listed, editor (Create Iteration, no Edit) | editor; listed, editor (Create Iteration, no Edit) |
| s3admin | admin; listed, admin (Edit, no Delete) | admin; listed, admin (Edit, no Delete) | admin; listed, admin (Edit, no Delete) | admin; listed, admin (Edit, no Delete) | admin; listed, admin (Edit, no Delete) |
| s3sysadmin | system administrator; listed, sysadmin-level (Edit+Delete) | system administrator; listed, sysadmin-level (Edit+Delete) | system administrator; listed, sysadmin-level (Edit+Delete) | system administrator; listed, sysadmin-level (Edit+Delete) | system administrator; listed, sysadmin-level (Edit+Delete) |

The first script run created the four projects and then stopped before any role change: its project-link parser missed the relative links. That run wrote no HTTP trace; its console output showed four POSTs answered 302. The second run found the projects and did not create them again.

<a id="read-commands-and-results"></a>

## Commands And Results

| Procedure | Result | Evidence |
|---|---|---|
| Runner self-test (`safe-run.js --self-test`) | pass, 30 cases | runner SHA-256 in the RESULT |
| Phase A1/A2 (factory): people, project, roles | pass | [phaseA1 trace](traces/phaseA1-factory.trace.json), [phaseA2 trace](traces/phaseA2-factory.trace.json) |
| Phase B (four accounts): sign-in, pages, sign-out | pass | [phaseB results](traces/results-phaseB.json) |
| Chain 1-7 (s3editor) | pass with findings | [chain traces](traces/) |
| Phase D (four accounts): controls after the chain | pass | [phaseD results](traces/results-phaseD.json) |
| Credential self-scan of this evidence folder | 0 hits | see the RESULT |

<a id="read-error-prevention"></a>

## Error Prevention

- Self-check: evidence scanned for account passwords, their Base64 forms, the factory pair patterns, session and token values; traces keep method, path, status, Location, Content-Type and cookie names only.
- Learning update: a redaction marker that replaces a short secret inside visible text reveals part of it; scrub only long values by substring and mask short identifiers by whole word. Proposed to PM, not admitted here.

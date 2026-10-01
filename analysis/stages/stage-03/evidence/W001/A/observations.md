# Stage 3 Walkthrough W001 - Part A Access

**What did Part A (authentication, authorization, people, platform, administration and errors; workbook rows 7-73) observe on the live legacy application, what differed from the map, and what could not be verified?**

<!-- ARTIFACT_READING_START -->
> [!CAUTION]
> **Recorded result: action required**
>
> findings (9 map findings; 7 rows unverified)
>
> **Numbers recorded:** 82 checks: 61 match, 13 finding, 1 blocked, 7 not-checked. Rows 7-73: 67 rows, 21 live-verified, 17 difference, 22 partially verified, 7 unverified.
>
> **Details:** [Coverage Summary](#read-coverage-summary) / [Findings](#read-findings) / [Residual Unverified Scope](#read-residual-unverified-scope).
>
> **Scope:** this record only. Formatting is not a new review or approval.

<details>
<summary><strong>Contents</strong></summary>

- [Coverage Summary](#read-coverage-summary)
- [Scope And Setup](#read-scope-and-setup)
- [Row Verdicts](#read-row-verdicts)
- [Executed Walkthrough](#read-executed-walkthrough)
- [Findings](#read-findings)
- [Live Question Answers](#read-live-question-answers)
- [Residual Unverified Scope](#read-residual-unverified-scope)
- [Disclosures](#read-disclosures)
- [Commands And Results](#read-commands-and-results)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

- Outcome: findings (9 map findings; 7 rows unverified)
- Date: `2026-09-30` (`2026-09-30T20:11:11.120Z` to `2026-09-30T20:43:08.005Z`)
- Performed by: BA W001-A for PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8` (responsible-agent verification); deployment operator: Codex (PM-verified)
- Legacy revision: unchanged WAR SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`, deployed from commit `eb7720f` with [deploy.sh](../../../deploy/deploy.sh)
- Environment: Tomcat 9 / JRE 8, MySQL 5.7, Mailpit sink, through the tunnel at `http://127.0.0.1:18080/xplanner-legacy/`; mail was not used in Part A
- Records: [checks.json](checks.json), sanitized traces and results under [traces](traces/), setup evidence [setup checks.json](../setup/checks.json), map [legacy_user_flows.xlsx](../../../../../legacy_user_flows.xlsx), reconnaissance [legacy_reconnaissance.md](../../../../../legacy_reconnaissance.md)

<a id="read-coverage-summary"></a>

## Coverage Summary

82 checks: 61 match, 13 finding, 1 blocked, 7 not-checked. Rows 7-73: 67 rows, 21 live-verified, 17 difference, 22 partially verified, 7 unverified.

| Observation mode | Scoped checks | Match | Finding | Blocked | Not checked |
|---|---|---|---|---|---|
| live | 72 | 58 | 13 | 1 | 0 |
| live (PM-collected fact) | 6 | 3 | 0 | 0 | 3 |
| not-run | 4 | 0 | 0 | 0 | 4 |

Rows already covered by setup cite the setup check IDs in `covered_by_setup`; those checks are not repeated. Epic header rows 7, 22, 36 and 54 carry no own behavior claim and are recorded as unverified with that reason.

<a id="read-scope-and-setup"></a>

## Scope And Setup

- Assignment: W001-A, BA / responsible-check, Stage 3; skill [SKILL.md](../../../../../../.agents/skills/migration-ba/SKILL.md); method [migration_methodology.md](../../../../../migration_methodology.md#stage-03).
- Accounts: the four role accounts (viewer, editor, admin, system administrator) by label; passwords loaded only in memory. The factory account was not used.
- Own data: project `S3-A Access` (221); iterations 308 and 309; stories 257 and 258; tasks 272 and 273; persons s3a-member, s3a-hide, s3a-nopw, s3a-del1, s3a-del2, s3a-del3, s3a-sys (213-219) and s3a-byviewer (288, created by the viewer). No shared or other-part object was changed.
- Channel: web pages over HTTP without JavaScript; forms read from the page and resubmitted; redirects recorded, never followed; one ordinary request per authorization rule on own objects; locale changed only in the own session.
- PM-collected facts cited: startup and database facts, redirect facts (files under `.migration-tmp/stage-03/ba-scratch/pm-facts/`).

<a id="read-row-verdicts"></a>

## Row Verdicts

| Row | Use case | Verdict | Checks | Setup | Note |
|---|---|---|---|---|---|
| 7 | UF-001 Authentication & Session (epic row) | unverified | - | - | Epic summary row without its own behavior claim; its child rows 8-21 carry the verdicts. |
| 8 | Log in with valid credentials | difference | A-C-001, A-C-002 | setup-C-009, setup-C-010, setup-C-011, setup-C-012, setup-C-013 | Covered by setup (setup-F-01). The /do/login?oid= probe is a PM fact without the name-exposure detail. |
| 9 | Login instructions help text | partially verified | A-C-003, A-C-004 | - | Credential part not checked (the factory pair may not be used or displayed in Part A). |
| 10 | Return to the saved URL | live-verified | A-C-005, A-C-006 | - |  |
| 11 | Login module and user ID letter case | live-verified | A-C-007 | - | Live answer: an upper-case user ID authenticates in this deployment (MySQL 5.7). |
| 12 | Login rejected | live-verified | A-C-008 | - |  |
| 13 | Unknown user / no password | live-verified | A-C-009, A-C-010 | - |  |
| 14 | Login without submit field / blank credentials | difference | A-C-011, A-C-012, A-C-013 | - |  |
| 15 | Remember me | live-verified | A-C-014 | - |  |
| 16 | Cookie re-login | live-verified | A-C-015, A-C-016 | - |  |
| 17 | Protected pages without a session | live-verified | A-C-017 | setup-C-018 | /do/* covered by setup; bypass of /do/invalidateHibernateCache in A-C on row 61. |
| 18 | Root URL routing | difference | A-C-018, A-C-019, A-C-020 | setup-C-035 |  |
| 19 | Log out | live-verified | A-C-021 | setup-C-014, setup-C-015, setup-C-016, setup-C-017 | Covered by setup; remember-me cookie removal added. |
| 20 | Session expiry | live-verified | A-C-022 | - |  |
| 21 | Alternative login modules | partially verified | A-C-023 | - | Absence of LDAP/NTLM/JAAS login is not observable over HTTP. |
| 22 | UF-002 Authorization & Roles (epic row) | unverified | - | - | Epic summary row; child rows 23-35 carry the verdicts. |
| 23 | Role hierarchy | partially verified | - | setup-C-028 | Covered by setup (display level); server-side effects per role are rows 29-30. |
| 24 | Negative permissions | difference | A-C-024, A-C-025 | setup-C-020, setup-C-021, setup-C-022, setup-C-024 | setup-F-03 stands; direct requests are not refused. |
| 25 | Project-0 roles | live-verified | - | setup-C-026, setup-C-062 | Covered by setup. |
| 26 | Permission-driven UI actions | live-verified | - | setup-C-027, setup-C-063 | Covered by setup. |
| 27 | Projects list filtered by read permission | live-verified | A-C-026 | - |  |
| 28 | DispatchForward not-authorized path | partially verified | A-C-027, A-C-028, A-C-029 | - | The WAP views (same mechanism) are Part D scope. |
| 29 | Server-side permission enforcement (generic actions) | live-verified | A-C-030, A-C-031, A-C-032 | - |  |
| 30 | Server-side permission enforcement (other actions) | partially verified | A-C-033 | - | One representative action (iteration close) exercised; the other listed action types were not. |
| 31 | Person editor role changes | partially verified | A-C-034 | - | The "other projects ignored" branch was not tested: s3admin administers every S3 project, and posting project ids the editor does not offer is outside the bounds. |
| 32 | Descriptor role constraints | partially verified | A-C-035 | - | Live observation cannot separate "not evaluated" from role "*". |
| 33 | Assign project roles | difference | - | setup-C-006, setup-C-061 | Covered by setup (setup-F-02). |
| 34 | System administrator checkbox and project-0 rule | partially verified | A-C-036, A-C-037, A-C-038, A-C-039 | setup-C-003 | Direct-request grant not checked (bounds). |
| 35 | Project role editor | unverified | A-C-040 | - | Blocked: no entry link found and the editor answers 500 with the parameter forms tried. |
| 36 | UF-003 People Management (epic row) | unverified | - | - | Epic summary row; child rows 37-53 carry the verdicts. |
| 37 | List people | partially verified | - | setup-C-004 | Covered by setup; paging not observable without growth data. |
| 38 | Hidden people in the list | difference | A-C-041, A-C-042 | - |  |
| 39 | People of one project | difference | - | setup-C-030 | Covered by setup (setup-F-04). |
| 40 | View person page | difference | - | setup-C-031, setup-C-032 | Covered by setup (setup-F-05). The page of s3a-member (no time entries) answered 200 (row 41 check). |
| 41 | Task actions on the person page | live-verified | A-C-043 | setup-C-033 | Observed for a person without time entries; setup-F-05 still applies to persons with time. |
| 42 | Person-page edit link | live-verified | - | setup-C-029 | Covered by setup. |
| 43 | Create person | difference | A-C-044, A-C-025 | setup-C-002, setup-C-022 | setup-F-03 stands (link shown to every role; a viewer can create a person). |
| 44 | Person validation | live-verified | A-C-045, A-C-046 | - |  |
| 45 | Duplicate user ID | difference | A-C-047 | - |  |
| 46 | Edit person | live-verified | A-C-048 | setup-C-007 |  |
| 47 | Password change | partially verified | A-C-049 | setup-C-008 | The stored digest form is not observable over HTTP. |
| 48 | Hide person | difference | A-C-050 | - |  |
| 49 | Delete person | difference | A-C-051, A-C-052, A-C-053, A-C-054 | - |  |
| 50 | Import people | difference | A-C-055, A-C-056 | setup-C-023 |  |
| 51 | Import per-line statuses | difference | A-C-057 | - |  |
| 52 | Import without a file | difference | A-C-058 | - |  |
| 53 | Import template link | live-verified | A-C-059 | - |  |
| 54 | UF-004 Platform, Administration & Errors (epic row) | unverified | - | - | Epic summary row; child rows 55-73 carry the verdicts. |
| 55 | System information page | live-verified | A-C-060 | - |  |
| 56 | Error pages | live-verified | A-C-061 | - |  |
| 57 | Object not found | difference | A-C-062 | - |  |
| 58 | Change display language | partially verified | A-C-063, A-C-064 | - | The external-returnto redirect of changeLocale was not observed. |
| 59 | Settings pages | difference | A-C-065, A-C-066 | - |  |
| 60 | Generic /setting handlers | partially verified | A-C-067, A-C-068 | - | Single-segment redirect:/forward: values and the standard-output print not observed. |
| 61 | Cache utilities | partially verified | A-C-069, A-C-070 | - | Responses observed; cache effects and log lines are not observable. |
| 62 | Test-support URLs | unverified | A-C-071 | - | Not run: shared global state. |
| 63 | Tiles reload | partially verified | A-C-072 | - | The response is observed; the reload effect is not observable. |
| 64 | Startup schema creation and seed | partially verified | A-C-073 | - | Table rename to "roles" not observed. |
| 65 | Double Spring loading | partially verified | A-C-074 | - | The doubled 00:05 reminder job is not yet observable. |
| 66 | No HSQLDB server | partially verified | A-C-075 | - | No log line about the HSQLDB listener in the PM extract. |
| 67 | Configuration layering | partially verified | A-C-076 | - | Non-loading of the other variant files is not observable. |
| 68 | Hibernate settings not applied | partially verified | A-C-077 | - | Cache provider and pool limits not in the PM extract. |
| 69 | Date formats (ISO locales) | partially verified | A-C-078 | - | Calendar buttons, time-entry saving and editor converters not observed here (Part C live question). |
| 70 | Date formats (dd-MM-yyyy locales) | partially verified | A-C-079 | - | fr, it, pt_br and the Spanish date-time pattern not observed. |
| 71 | Date picker conflict | unverified | A-C-080 | - | JavaScript; Part C scope. |
| 72 | UTF-8 request decoding | live-verified | A-C-081 | - |  |
| 73 | Activity logging | partially verified | A-C-082 | - | Public serving observed; the START/END line format was not examined. |

<a id="read-executed-walkthrough"></a>

## Executed Walkthrough

| Check | Row | Role | Expected | Action | Mode | Observed | Evidence | Verdict |
|---|---|---|---|---|---|---|---|---|
| A-C-001 | 8 | s3a-member (editor on 221) | Sign-in redirects to /do/view/projects. | POST /do/login with userId, password, action=Login (no remember). | live | 302 Location /xplanner-legacy/do/view/projects. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r47_new` | match |
| A-C-002 | 8 | no session | Recorded probe: /do/login?oid=<id> before login (row 8 evidence, breadcrumb lookup). | PM request GET /do/login?oid=220 without session (not run by BA). | live (PM-collected fact) | HTTP 200, no Location. Whether object names are shown was not recorded. | `.migration-tmp/stage-03/ba-scratch/pm-facts/redirect-facts.txt line 2` | not-checked |
| A-C-003 | 9 | no session | The login page shows the login-instructions help text with a link to the documentation site. | GET /do/login; only link hosts extracted in memory. | live | HTTP 200; link hosts xplanner-plus.sourceforge.net, sourceforge.net, localhost:8080. The footer links to the same site, so the help-text link is not told apart by host alone. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r9` | match |
| A-C-004 | 9 | no session | The default-bundle help text ends with the factory administrator login pair. | Not run. | not-run | not observed | none | not-checked |
| A-C-005 | 10 | s3a-member | After login the browser lands on the saved GET URL. | GET /do/view/project?oid=221 without session, then sign-in in the same session. | live | Before: 302 /xplanner-legacy/do/login; after sign-in: 302 Location http://127.0.0.1:18080/xplanner-legacy/do/view/project?oid=221 (absolute). | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r10_query` | match |
| A-C-006 | 10 | s3a-member | A URL without query string is restored with "?null". | GET /do/view/projects without session, then sign-in. | live | After sign-in: 302 Location http://127.0.0.1:18080/xplanner-legacy/do/view/projects?null. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r10_noquery` | match |
| A-C-007 | 11 | s3a-member | Whether a user ID in different letter case authenticates depends on the database comparison (live question). | Sign-in with user ID "S3A-MEMBER" and the correct password. | live | 302 Location /xplanner-legacy/do/view/projects: accepted. The page header then shows the stored lower-case user ID. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r11` | match |
| A-C-008 | 12 | s3a-member | A wrong password redisplays the login page with "Could not authenticate user." and "Wrong userid or password". | Sign-in with a wrong password. | live | HTTP 200, login form shown, both texts present. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r12` | match |
| A-C-009 | 13 | unregistered user ID | Unknown user ID: "User has not been registered with XPlanner". | Sign-in as s3a-unknown. | live | HTTP 200; "Could not authenticate user." and the not-registered text present. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r13_unknown` | match |
| A-C-010 | 13 | s3a-nopw (no password) | A person without a password gets "Password has not been set". | Sign-in as s3a-nopw with some password. | live | HTTP 200; "Could not authenticate user." and the password-not-set text present. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r13_nopw` | match |
| A-C-011 | 14 | s3a-member | A login POST without the submit field shows the login form. | Fresh session: GET /do/login, then POST userId and password without action. | live | HTTP 200, login form shown, not signed in. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r14_fresh` | match |
| A-C-012 | 14 | blank credentials | Blank credentials fail with the module message. | Sign-in with empty userId and password and action=Login. | live | HTTP 200; "Could not authenticate user." and the not-registered text present. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r14_blank` | match |
| A-C-013 | 14 | s3a-member | Same claim, in a session that already posted action=Login. | Failed sign-in (action=Login, wrong password), then POST userId and correct password without action in the same session. | live | 302 Location /xplanner-legacy/do/view/projects: signed in. The same in phase 1 (POST without action after earlier failed logins in that session). | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r14_after_failed_login`; [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r14_noaction` | finding A-F-01 |
| A-C-014 | 15 | s3a-member | Remember me sets cookies "userid" and "password" (about 68 years, no Secure, no path). | Sign-in with remember=Y; Set-Cookie names and attributes recorded, values not. | live | userid (Max-Age=2147483647; Expires=Mon, 18 Oct 2094 23:28:17 GMT); password (Max-Age=2147483647; Expires=Mon, 18 Oct 2094 23:28:17 GMT). No Path, Secure or HttpOnly attribute. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r15` | match |
| A-C-015 | 16 | cookie-only client | A request with only the credential cookies is authenticated. | New client with only userid and password cookies: GET /do/view/project?oid=221. | live | HTTP 200, page "XPlanner Project: S3-A Access". | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r16_ok` | match |
| A-C-016 | 16 | cookie-only client | A failed cookie login falls back to the login redirect. | Password of s3a-member changed, then the old cookies reused by a new client. | live | 302 Location /xplanner-legacy/do/login; Set-Cookie userid and password Max-Age=0 (removed). | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r16_fail` | match |
| A-C-017 | 17 | no session | /setting/* requires a session (the /do/* part is setup-C-018). | GET /setting/project/list without session. | live | 302 Location /xplanner-legacy/do/login. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r17` | match |
| A-C-018 | 18 | s3a-member (one readable project, with current iteration 308) | With exactly one visible project that has a current iteration, the root URL redirects to that iteration. | Iteration 308 started; GET / as s3a-member. | live | 302 Location /xplanner-legacy/do/view/projects. Five projects exist in the system; setup-C-035 saw the iteration redirect when one project existed. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r18` | finding A-F-02 |
| A-C-019 | 18 | s3admin (five readable projects) | Otherwise the root URL redirects to the projects list. | GET / as s3admin. | live | 302 Location /xplanner-legacy/do/view/projects. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r18` | match |
| A-C-020 | 18 | no session | Root URL without session (index.jsp is not filtered). | GET / without session. | live | 302 Location /xplanner-legacy/do/view/projects;jsessionid=[REDACTED]. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r18` | match |
| A-C-021 | 19 | s3a-member (remember-me) | Logout removes the remember-me cookies and shows the login page. | GET /do/logout after a remember-me sign-in. | live | HTTP 200; Set-Cookie userid and password Max-Age=0, new session cookie. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r19_remember_logout` | match |
| A-C-022 | 20 | s3admin (no remember-me) | After 30 idle minutes the next request is unauthenticated. | Sign-in, one request, 31 min idle, then GET /do/view/project?oid=221. | live | Before idle: 200; after idle: 302 Location /xplanner-legacy/do/login. | [idle.trace.json](traces/idle.trace.json); [results-idle.json](traces/results-idle.json) | match |
| A-C-023 | 21 | all accounts | Only the XPlanner database module is active. | Sign-ins of role and s3a- accounts (setup-C-009..012, this part). | live | Database accounts authenticate. The absence of LDAP, NTLM or JAAS modules is not observable over HTTP. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r47_new` | match |
| A-C-024 | 24 | editor account | Nothing refuses a direct request for a hidden action (editor iteration delete). | Editor sees no iteration delete link; GET the delete URL of own iteration 309 directly. | live | Delete links shown to editor: 0; request 302 Location /xplanner-legacy/do/view/project?oid=221; iteration 309 removed. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r24_editor_delete` | match |
| A-C-025 | 24 | viewer account | Person creation by a role without create.person (link shown, setup-F-03). | Viewer submits the Add Person form it is offered (s3a-byviewer). | live | 302 Location /xplanner-legacy/do/view/people; person created (oid 288). | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r43_viewer_create` | match |
| A-C-026 | 27 | s3a-member; s3admin | The projects list shows only readable projects. | GET /do/view/projects as each. | live | s3a-member: [221]; s3admin: [220,221,222,223,224]. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r27` | match |
| A-C-027 | 28 | viewer | DispatchForward view without projectId: not-authorized forward, page missing. | GET /do/view/integrations. | live | HTTP 404 (container page). | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r28` | match |
| A-C-028 | 28 | s3a-member (no role on 220) | Without read permission on the project: not-authorized forward, page missing. | GET /do/view/integrations?projectId=220. | live | HTTP 404 (container page). | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r28` | match |
| A-C-029 | 28 | viewer | With projectId and read permission the view is rendered (integration queue itself is rows 195+, Part D). | GET /do/view/integrations?projectId=221. | live | HTTP 500; error page with javax.servlet.jsp.JspTagException, java.lang.IllegalArgumentException, javax.servlet.ServletException. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r28` | match |
| A-C-030 | 29 | viewer | Generic edit performs no server-side check. | Viewer opens the iteration editor of own iteration 308 by URL and posts a new name. | live | Editor 200; POST 302 Location /xplanner-legacy/do/view/iteration?oid=308; name now "S3-A Iteration 1 (viewer edit)". | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r29_viewer_edit` | match |
| A-C-031 | 29 | viewer | Generic delete performs no server-side check. | Viewer requests the delete URL of own story 258. | live | 302 Location /xplanner-legacy/do/view/iteration?oid=308; story 258 removed. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r29_viewer_delete` | match |
| A-C-032 | 29 | s3a-member (no role on 220) | Generic view performs no server-side check. | GET /do/view/project?oid=220. | live | HTTP 200, page "XPlanner Project: S3 Shared". | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r29_member_view` | match |
| A-C-033 | 30 | viewer | Other actions (here iteration close) have no server-side check. | Viewer requests the Close URL of own iteration 308. | live | 302; Location /xplanner-legacy/do/continue/unfinished/stories?iterationId=308&/do/view/iteration?oid=308?oid=308&fkey=308; iteration 308 then offers Start again (closed). | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r30_viewer_close` | match |
| A-C-034 | 31 | s3admin (no project-0 role) | Role changes apply on projects where the user holds admin.edit.role; no sysadmin change without project-0 admin.edit.role. | s3admin saves own s3a-sys (a system administrator at that moment) with phone changed and role viewer on 221. | live | Save 302; afterwards role on 221 "viewer", phone saved, system administrator kept: true. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r31_34` | match |
| A-C-035 | 32 | viewer | Descriptor role constraints are not evaluated; any authenticated user passes. | Viewer requests under /do/edit/* and /do/delete/* (A-C checks on row 29). | live | Both passed the filters. The descriptors list role "*" for these URLs, so passing them does not separate "not evaluated" from "role * matches". | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r29_viewer_edit` | match |
| A-C-036 | 34 | system administrator account | The checkbox is shown to sysadmins; posting systemAdmin=true grants the role. | Sysadmin saves own s3a-sys with the checkbox checked. | live | Save 302; re-opened editor shows the box checked: true. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r31_34` | match |
| A-C-037 | 34 | s3admin | The checkbox is not shown to non-sysadmins. | s3admin opens the editor of own s3a-sys. | live | Checkbox present: false. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r31_34` | match |
| A-C-038 | 34 | sysadmin | A project-0 administrator saving without systemAdmin=true revokes the role. | Sysadmin saves own s3a-sys with the checkbox unchecked. | live | Save 302; re-opened editor shows the box checked: false (revoked). | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r31_34` | match |
| A-C-039 | 34 | non-sysadmin | System-administrator status can be granted by a direct request. | Not run (outside the PM bounds: no escalation attempt). | not-run | not observed | none | not-checked |
| A-C-040 | 35 | s3admin | The project role editor lists people with role choices for one project. | No link to /do/edit/roles found on the project page; opened by URL with projectId/fkey and with oid. | live | Both answered HTTP 500 (with oid: java.lang.NullPointerException); no form. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r35_open`; [p2-recon.trace.json](traces/p2-recon.trace.json) | blocked |
| A-C-041 | 38 | sysadmin | The hide of s3a-hide is stored. | Sysadmin re-opens the editor of own s3a-hide. | live | Hidden select value "true". | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r38_hidden_stored` | match |
| A-C-042 | 38 | viewer, editor, admin, sysadmin, s3a-member | Hidden people are listed only for users with admin.hide on system.person. | GET /do/view/people as each; count rows of s3a-hide. | live | Rows: {"viewer":1,"editor":1,"admin":1,"sysadmin":1,"member":1}: listed for every account, including viewer and editor. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r38` | finding A-F-03 |
| A-C-043 | 41 | s3a-member (own); s3admin; viewer | Clock and edit icons per active task on the person page when the user may edit it. | GET /do/view/person?oid=213 (acceptor of task 273, no time entries) as each. | live | Own: HTTP 200, 1 time and 1 edit link; s3admin: 1 and 1; viewer: 0 and 0. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r41` | match |
| A-C-044 | 43 | sysadmin | A user with create.person adds a person; returned to the people list. | Create 7 s3a- persons. | live | Each POST 302 Location /xplanner-legacy/do/view/people; persons listed (oids 213-219). | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#persons` | match |
| A-C-045 | 44 | sysadmin | Missing name, user ID, e-mail and initials are reported. | POST the add-person form with all fields empty. | live | HTTP 200; messages: Missing name. Missing user Id. Missing email. Missing initials. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r44_empty` | match |
| A-C-046 | 44 | sysadmin | Password and confirmation must match. | POST with different new password and confirmation. | live | HTTP 200; "Passwords do not match" shown; person not created. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r44_mismatch` | match |
| A-C-047 | 45 | sysadmin | A duplicate user ID: editor redisplayed with "User Id exists." | POST the add-person form with user ID s3a-member (twice, phases 1 and 2). | live | HTTP 500 error page (org.hibernate.exception.ConstraintViolationException, java.sql.BatchUpdateException); "User Id exists." not shown; no duplicate created. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r45`; [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r45` | finding A-F-04 |
| A-C-048 | 46 | s3admin | An authorized user updates a person; returnto page shown. | s3admin saves own s3a-sys (phone). | live | Save 302; phone now 555-0101. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r31_34` | match |
| A-C-049 | 47 | sysadmin; s3a-member | A new password replaces the old one. | Sysadmin sets a new password for s3a-member; sign-in with old and with new password. | live | Save 302; sign-in with the old password answered HTTP 200 (login page), with the new one 302 Location /xplanner-legacy/do/view/projects. | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r47_change` | match |
| A-C-050 | 48 | sysadmin | Hidden select Yes/No; hidden people disappear from normal lists. | Sysadmin saves own s3a-hide with hidden=true. | live | Save 302; stored (A-C on row 38) but still listed for every account. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r48` | finding A-F-03 |
| A-C-051 | 49 | sysadmin | Delete of a person without references removes the person. | GET /do/delete/person for own s3a-del1. | live | 302 Location /xplanner-legacy/do/view/people; person removed. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r49` | match |
| A-C-052 | 49 | sysadmin | Delete of a story customer is rejected by a foreign key. | GET /do/delete/person for own s3a-del2 (customer of story 257). | live | HTTP 500 error page; person not removed. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r49` | finding A-F-05 |
| A-C-053 | 49 | sysadmin; s3admin | Delete of a task acceptor leaves a dangling reference. | GET /do/delete/person for own s3a-del3 (acceptor of task 272), then view story 257 and task 272. | live | Delete 302, person removed; then task 272 page HTTP 500 and story 257 page HTTP 500. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r49_after` | finding A-F-05 |
| A-C-054 | 49 | sysadmin | Where the delete is offered. | Looked for delete links on the people list and the person page. | live | No delete link on either page; the delete was requested by URL. | [p2b-roles.trace.json](traces/p2b-roles.trace.json); [results-p2b-roles.json](traces/results-p2b-roles.json) `#obs.r49_pre`; [p2-recon.trace.json](traces/p2-recon.trace.json) | finding A-F-05 |
| A-C-055 | 50 | sysadmin | The import page offers an upload form. | Open Import People by the link the people list offers (with returnto). | live | HTTP 200 "XPlanner - Import People", file input present. | [p3c-locale.trace.json](traces/p3c-locale.trace.json); [results-p3c-locale.json](traces/results-p3c-locale.json) `#obs.import_link` | match |
| A-C-056 | 50 | sysadmin | Per-line checks run; the save of the first valid line fails with a null reference; no "Success" table. | Upload one 3-line synthetic text file (malformed line, empty user ID, valid s3a-imp1). | live | HTTP 500 error page (java.lang.IndexOutOfBoundsException); no results table; s3a-imp1 not created. | [p3b-import.trace.json](traces/p3b-import.trace.json); [results-p3b-import.json](traces/results-p3b-import.json) `#obs.r50_51` | finding A-F-06 |
| A-C-057 | 51 | sysadmin | Malformed lines and empty user IDs are reported per line before any save. | Same upload as the row 50 check. | live | No per-line status shown: the request ended in the error page. | [p3b-import.trace.json](traces/p3b-import.trace.json); [results-p3b-import.json](traces/results-p3b-import.json) `#obs.r50_51` | finding A-F-06 |
| A-C-058 | 52 | sysadmin | Import without a file: "Please select a file to import." | Submit the import form without a file. | live | HTTP 500 error page (java.lang.AbstractMethodError); message not shown. | [p3b-import.trace.json](traces/p3b-import.trace.json); [results-p3b-import.json](traces/results-p3b-import.json) `#obs.r52` | finding A-F-07 |
| A-C-059 | 53 | sysadmin | Template link to files/peopleImportTemplate.xls (an Excel file). | Follow the template link on the import page. | live | HTTP 200, application/vnd.ms-excel, 13824 bytes, OLE2 file signature. | [p3b-import.trace.json](traces/p3b-import.trace.json); [results-p3b-import.json](traces/results-p3b-import.json) `#obs.r53` | match |
| A-C-060 | 55 | sysadmin | System information page with version, build, database, server, JVM and memory; password masked. | GET /do/systemInfo (the footer link is absolute localhost:8080/xplanner and was not followed). | live | HTTP 200 "System Information"; version 1.1a4, MySQL driver, database URL, masked password, memory and servlet information present. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r55` | match |
| A-C-061 | 56 | s3admin | Unhandled exceptions show an error page with message, filing link, Cause and Stack Trace. | Known error: iteration editor link without returnto. | live | HTTP 500 "An error has occurred."; Cause, Stack Trace and support-tracker link present. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r56` | match |
| A-C-062 | 57 | s3admin | A non-existent object shows "Object <id> not found". | GET /do/view/project?oid=999999 (twice). | live | HTTP 500 "An error has occurred."; neither the id nor a not-found text is shown; no Cause or Stack Trace section. | [p3c-locale.trace.json](traces/p3c-locale.trace.json); [results-p3c-locale.json](traces/results-p3c-locale.json) `#obs.r57`; [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r57` | finding A-F-08 |
| A-C-063 | 58 | s3admin (own session) | A language parameter switches the session locale; user returned to returnto. | GET /do/changeLocale?language=de\|es\|en&returnto=/do/view/project?oid=221, then the project page. | live | Each 302 to the returnto page; titles "XPlanner Projekt: S3-A Access", "XPlanner Proyecto: S3-A Access", "XPlanner Project: S3-A Access". The html lang attribute stays "en". | [p3c-locale.trace.json](traces/p3c-locale.trace.json); [results-p3c-locale.json](traces/results-p3c-locale.json) `#obs.locale` | match |
| A-C-064 | 58 | any | An absolute URL in returnto sends the browser to another host (row 58 evidence). | Dropped from Part A by PM; PM fact covers returnto on an editor page only. | live (PM-collected fact) | PM fact: GET /do/edit/project?oid=221&returnto=<external> answered 200 without Location; changeLocale with an external returnto was not requested. | `.migration-tmp/stage-03/ba-scratch/pm-facts/redirect-facts.txt line 9` | not-checked |
| A-C-065 | 59 | viewer; sysadmin | Settings list headed "Settings"; "Add Setting" for users with create.project. | GET /do/view/settings as each. | live | Both HTTP 200, title "XPlanner Projects", heading "Settings XPlanner Projects"; "Add Setting" shown to viewer and to sysadmin. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r59` | finding A-F-09 |
| A-C-066 | 59 | sysadmin | The add/edit editor JSP is missing. | GET /do/edit/setting?returnto=/do/view/settings. | live | HTTP 404 (container page). | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r59` | match |
| A-C-067 | 60 | sysadmin | A plain objectType value selects no existing page. | GET /setting/project/list signed in. | live | HTTP 404. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r60_plain` | match |
| A-C-068 | 60 | PM | Values starting with redirect: or forward: redirect or forward. | PM requests of /setting/redirect:... and /setting/forward:... with slash-containing targets (not run by BA). | live (PM-collected fact) | All answered 404. The targets contain "/", so they span more than one path segment; the single-segment case was not requested. | `.migration-tmp/stage-03/ba-scratch/pm-facts/redirect-facts-2.txt lines 3-6`; `redirect-facts.txt lines 5-8` | not-checked |
| A-C-069 | 61 | sysadmin | /do/invalidateCache clears the permission cache; no page. | GET /do/invalidateCache. | live | HTTP 200, 0 bytes. The cache effect and log line are not observable. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r61` | match |
| A-C-070 | 61 | no session | /do/invalidateHibernateCache bypasses authentication; no page. | GET /do/invalidateHibernateCache without session. | live | HTTP 200, 0 bytes, no login redirect. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r61` | match |
| A-C-071 | 62 | none | Test-support URLs run data sampling, the missing-time-entry notifier, the clock shift and property set. | Not run: each changes state shared by all parts (application clock, a property value, mail to every person, data samples of all iterations). | not-run | not observed | none | not-checked |
| A-C-072 | 63 | sysadmin | What /do/admin/reload-tiles returns (live question). | GET /do/admin/reload-tiles. | live | HTTP 200, text/plain;charset=ISO-8859-1, body "OK". Whether the shared factory was reloaded is not observable. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r63` | match |
| A-C-073 | 64 | PM | Liquibase creates 21 tables and seeds a system administrator on first start. | PM read-only log and database facts. | live (PM-collected fact) | Liquibase ran change sets 1-1..2-5 at 09:21; 23 tables in schema xplanner including DATABASECHANGELOG and DATABASECHANGELOGLOCK (21 application tables); 8 change-log rows. The seeded administrator was used by setup (setup phase A). The table name "roles" was not observed. | `.migration-tmp/stage-03/ba-scratch/pm-facts/startup-facts.txt lines 4-25, 59-65` | match |
| A-C-074 | 65 | PM | Two Spring contexts: Liquibase twice, two schedulers, two session factories (live question). | PM read-only log facts. | live (PM-collected fact) | Two bean factories pre-instantiate singletons; Liquibase runs twice (the second run applies nothing); two "scheduler" executors initialise; two Hibernate settings blocks. The reminder job running twice at 00:05 is not yet observable. | `.migration-tmp/stage-03/ba-scratch/pm-facts/startup-facts.txt lines 4-58` | match |
| A-C-075 | 66 | sysadmin; PM | No HSQLDB server with the shipped properties. | System information page; PM log facts. | live | The system information page shows the MySQL driver; the PM extract contains no HSQLDB line either way. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r55`; `.migration-tmp/stage-03/ba-scratch/pm-facts/startup-facts.txt` | match |
| A-C-076 | 67 | sysadmin; s3admin | Effective values (MySQL connection, application URL http://localhost:8080/xplanner, login instructions URL) come from xplanner-custom.properties. | System information page; header and footer links; login page link hosts. | live | Database URL jdbc:mysql://db/xplanner shown; "Me" and system-information links point to http://localhost:8080/xplanner; the login page links to xplanner-plus.sourceforge.net. Whether other variant files are loaded is not observable. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r55`; [p0-recon.trace.json](traces/p0-recon.trace.json); [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r9` | match |
| A-C-077 | 68 | PM | Hibernate settings of the property files do not reach the web session factory (live question). | PM log facts compared with WAR xplanner.properties:58,202-203,207-218. | live (PM-collected fact) | The log shows "Query cache: disabled" although the property file sets hibernate.cache.use_query_cache=true (consistent with the claim). "Second-level cache: enabled" equals both the Hibernate default and the file value, so it does not decide. The cache provider line and pool limits are not in the extract. | `.migration-tmp/stage-03/ba-scratch/pm-facts/startup-facts.txt lines 40-52` | match |
| A-C-078 | 69 | s3admin (own session en, de) | formatKey date displays use yyyy-MM-dd in the default and de locales. | Project 221 page in en and de sessions; iteration 308 dates. | live | en 2026-09-30 / 2026-10-13; de 2026-09-30 / 2026-10-13. | [p3c-locale.trace.json](traces/p3c-locale.trace.json); [results-p3c-locale.json](traces/results-p3c-locale.json) `#obs.locale` | match |
| A-C-079 | 70 | s3admin (own session es) | formatKey date displays use dd-MM-yyyy in the es locale. | Project 221 page in an es session. | live | es 30-09-2026 / 13-10-2026. | [p3c-locale.trace.json](traces/p3c-locale.trace.json); [results-p3c-locale.json](traces/results-p3c-locale.json) `#obs.locale` | match |
| A-C-080 | 71 | none | jQuery date picker and calendar button patterns versus the server-default converter. | Not run: needs JavaScript; the related time-editor check (F-003) is Part C scope. | not-run | not observed | none | not-checked |
| A-C-081 | 72 | sysadmin | Non-ASCII input round-trips. | Create person named with é, Ž, Ü, ï; read the people list. | live | Name shown unchanged (text/html;charset=UTF-8). | [p1-auth.trace.json](traces/p1-auth.trace.json); [results-p1-auth.json](traces/results-p1-auth.json) `#obs.r72` | match |
| A-C-082 | 73 | no session | The activity log is written into the web root and served without a security filter. | GET /xplanner-legacy/xplanner-plus-activity.log without session, twice; content not recorded. | live | HTTP 200 text/plain, 315265 bytes, then 350720 bytes about a minute later (the file grows). A simple search for the path of an own recent request did not match; the line format was not examined. | [p3a-platform.trace.json](traces/p3a-platform.trace.json); [results-p3a-platform.json](traces/results-p3a-platform.json) `#obs.r73`; [p3c-locale.trace.json](traces/p3c-locale.trace.json); [results-p3c-locale.json](traces/results-p3c-locale.json) `#obs.r73` | match |

<a id="read-findings"></a>

## Findings

| ID | Rows | Cells | Observed | Expected | Minimal correction | Severity |
|---|---|---|---|---|---|---|
| A-F-01 | 14 | F14, G14 | After a failed sign-in (action=Login) in a session, a later login POST without the action field in the same session signs the user in (302 to the projects list). In a fresh session the same POST only shows the form. | A request without the submit field shows the login form. | Row 14: add that the check applies to a fresh session; once action=Login was posted in the session, a POST without the field authenticates (session-scoped form value, runtime observation). | medium |
| A-F-02 | 18 | F18 | With five projects in the system, a person who can read only project 221 (current iteration 308 started) is redirected to /do/view/projects, not to the iteration. | Exactly one visible project with a current iteration redirects to that iteration. | Row 18: state that the one-project condition did not follow the user's read permission in this observation (redirect to the projects list with five projects in the system); the one-project redirect was seen only when one project existed (setup-C-035). Stage 1 to confirm the counting rule from source. | low |
| A-F-03 | 38, 48 | F38, F48 | The hidden flag of s3a-hide is stored ("true" in the editor), but the person is still listed on /do/view/people for viewer, editor, admin, system administrator and an s3a- editor. | Hidden people are listed only for users with admin.hide; they disappear from normal lists. | Rows 38 and 48: record that hidden people remain listed for every observed role (Source implemented? Partial), pending a Stage 1 source check of the list filter. | medium |
| A-F-04 | 45 | F45 | Creating a person with an existing user ID answers HTTP 500 (generic error page, database constraint violation); "User Id exists." is not shown; no duplicate is stored. | Editor redisplayed with "User Id exists." | Row 45, column F: "HTTP 500 error page (database constraint); no duplicate stored"; column G Partial. | medium |
| A-F-05 | 49 | D49, F49, G49 | Deleting a person with no references: 302, removed. Deleting a story customer: HTTP 500, not removed. Deleting a task acceptor: 302, removed; then that story page and that task page answer HTTP 500. No delete control on the people list or the person page. | Person removed, or a database error when foreign keys refer to the person; other references left dangling (runtime unverified). | Row 49: record the three observed outcomes, that pages showing a deleted acceptor then answer HTTP 500, and that the delete is reachable only by URL; column G Yes for the reject case. | medium |
| A-F-06 | 50, 51 | F50, F51 | The import page and form work. Uploading a 3-line text file (malformed line, empty user ID, one valid line) answers HTTP 500 (IndexOutOfBoundsException) with no results table and no person created. | Per-line statuses for malformed and empty lines, then a null-reference failure on the first save. | Rows 50-51: record that the upload ends in HTTP 500 before any per-line status is shown (IndexOutOfBoundsException for this file); which line triggers it was not isolated. | medium |
| A-F-07 | 52 | F52, G52 | Submitting the import form without a file answers HTTP 500 (AbstractMethodError); "Please select a file to import." is not shown. | Import page redisplayed with "Please select a file to import." | Row 52, column F: "HTTP 500 error page"; column G Partial. | low |
| A-F-08 | 57 | F57 | GET /do/view/project?oid=999999 answers HTTP 500 with the generic "An error has occurred." page; neither the id nor a not-found text is shown. | General error page with "Object <id> not found". | Row 57, column F: "HTTP 500, generic error page without the object id"; Stage 1 to check which exception the view raises. | low |
| A-F-09 | 59 | D59, F59 | The settings list (title "XPlanner Projects", heading "Settings XPlanner Projects") shows "Add Setting" to the viewer as well as to the system administrator. | "Add Setting" offered to users with create.project. | Row 59: record that "Add Setting" is shown to every observed role including viewer, and that the page title is "XPlanner Projects". | low |

The workbook and reconnaissance were not edited. Each finding returns to Stage 1 through PM.

<a id="read-live-question-answers"></a>

## Live Question Answers

- **Row 11:** an upper-case user ID signs in with the correct password; the header then shows the stored lower-case ID (A-C on row 11).
- **Row 49:** see A-F-05 (no references: removed; story customer: HTTP 500, kept; task acceptor: removed, then the story and task pages answer HTTP 500).
- **Row 50:** see A-F-06 (upload ends in HTTP 500 before any per-line result; nobody created).
- **Row 60:** a plain value answers 404; the redirect/forward variants PM requested contain "/" and answered 404; the single-segment case remains open.
- **Row 63:** `/do/admin/reload-tiles` answers 200 text/plain "OK".
- **Rows 65 and 68 (PM facts):** two Liquibase runs, two schedulers and two session factories at startup; the query cache is disabled although the property file enables it.

<a id="read-residual-unverified-scope"></a>

## Residual Unverified Scope

| Row | Reason | Retry condition |
|---|---|---|
| 8 | /do/login?oid= name exposure: PM fact records status only. | PM redirect facts with a name-presence flag |
| 9 | Factory pair in the help text may not be used or displayed in Part A. | Owner/PM-assigned in-memory presence check |
| 34 | Direct-request grant of the system-administrator role is outside the PM bounds (no escalation). | Owner decision to test it on an isolated person |
| 35 | Role editor answers HTTP 500; no entry link found. | Stage 1 supplies the entry link or required parameters |
| 58 | External returnto of changeLocale not requested (dropped from Part A by PM). | PM redirect facts for /do/changeLocale |
| 60 | Single-segment redirect:/forward: values not requested; slash-containing variants answered 404 (PM fact). | PM redirect facts |
| 62 | All four test-support actions change state shared by the other parts. | Owner/PM-approved window with no other part running |
| 65 | Doubled reminder job at 00:05 not yet observable. | after 00:05 server time, read Mailpit |
| 71 | JavaScript date picker; Part C scope. | Part C browser check |

Rows with verdict partially verified name their unobserved part in the Row Verdicts note.

<a id="read-disclosures"></a>

## Disclosures

- One direct `ls` of the PM facts folder before the runner was used for listing (PM-noted, low impact).
- The first phase 1 run stopped on a script error after creating the seven s3a- persons; its traces were not saved. The rerun reset the s3a-member password in memory and repeated the checks.
- A lookup bug in phase 2a created four duplicate empty S3-A iterations (310-313) over three runs; they were deleted with the admin account ([p2-dedupe.trace.json](traces/p2-dedupe.trace.json)). The traces of the failed runs were overwritten.
- The first people-import run opened the import page without its returnto parameter (HTTP 500) and posted without the real form; nobody was created. The rerun used the offered link; its trace replaced the first.
- Two assistant responses were stopped by a safety filter; PM then narrowed the scope (redirect probes collected by PM).

<a id="read-commands-and-results"></a>

## Commands And Results

| Command or procedure | Result | Evidence |
|---|---|---|
| `node .migration-tmp/stage-03/tools/safe-run.js --self-test` | pass (30 cases) | runner log |
| runner: phase script `idle` | completed | [idle.trace.json](traces/idle.trace.json) |
| runner: phase script `p0-iter` | completed | [p0-iter.trace.json](traces/p0-iter.trace.json) |
| runner: phase script `p0-recon` | completed | [p0-recon.trace.json](traces/p0-recon.trace.json) |
| runner: phase script `p0-row` | completed | [p0-row.trace.json](traces/p0-row.trace.json) |
| runner: phase script `p1-auth` | completed | [p1-auth.trace.json](traces/p1-auth.trace.json) |
| runner: phase script `p2-dedupe` | completed | [p2-dedupe.trace.json](traces/p2-dedupe.trace.json) |
| runner: phase script `p2-recon` | completed | [p2-recon.trace.json](traces/p2-recon.trace.json) |
| runner: phase script `p2a-objects` | completed | [p2a-objects.trace.json](traces/p2a-objects.trace.json) |
| runner: phase script `p2b-roles` | completed | [p2b-roles.trace.json](traces/p2b-roles.trace.json) |
| runner: phase script `p3a-platform` | completed | [p3a-platform.trace.json](traces/p3a-platform.trace.json) |
| runner: phase script `p3b-import` | completed | [p3b-import.trace.json](traces/p3b-import.trace.json) |
| runner: phase script `p3c-locale` | completed | [p3c-locale.trace.json](traces/p3c-locale.trace.json) |
| `node analysis/tools/artifact-reading.js --file <this file>` | see RESULT | this file |

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 3, Part A; checklist [error-prevention-checklist.md](../../../../../error-prevention-checklist.md). CHK-002 passed (every authorization row records the observed server-side outcome of a direct request, rows 24, 29-32, 34). CHK-004 partially applied (en, de and es sessions observed; other bundles not, rows 58, 69-70). CHK-005 passed for the observed person validation (row 44). CHK-006 passed (row 49 records the data effect and the failing pages). CHK-007 passed (figures generated from checks.json). CHK-009 passed (no credential, cookie value or session id recorded; self-scan in RESULT). CHK-010 applied (import page and editor links opened with their returnto parameter; the missing-returnto 500 is attributed to the request, not the feature).
- **Learning update:** proposal for PM: scripts that create objects must look them up by exact markup before retrying (the duplicate-iteration disclosure); no new check admitted by BA.

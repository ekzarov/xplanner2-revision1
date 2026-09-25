# Stage 02 Review - Pass 005

**What matched, what did not, and what must be corrected before this scope can proceed?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** A fresh independent agent assigned to the reviewed stage writes the report.
- **Maintained / decided by:** The reviewer creates a new immutable report for each attempt; the reviewed author does not self-approve.
- **Governing instructions:** Independent control at Stages 2, 7, 10, 14 and 16, plus reviewer eligibility rules.
- **When used:** A fresh independent agent creates one report for every Stage 2, 7, 10, 14 or 16 control attempt; Stage 19 uses its dedicated acceptance template.
- **How used:** The report proves reviewer independence, pins the reviewed scope and revision, records checks and findings, and gives the exact verdict used by migration_status.yaml. Once referenced as evidence it is immutable; corrections require a new pass file.
- **Example:** A Stage 7 reviewer finds an edit action on a read-only wireframe, records findings in stage-07-pass-018.md and returns the scope to Stage 6.

**Conditional cosmetic backlog check:**

- Stage 16 only (other review stages keep their own inputs): The independent agent reads the conditional cosmetic backlog and checks scope matching and task coverage in the Stage 15 plan. An applicable finding without a task blocks the pass and returns to Stage 15. The reviewer records the result in the immutable Stage 16 report, not by silently changing the backlog.
- Record the backlog path and revision, relevant finding IDs, affected screens/components/functions, linked tasks, non-applicability reasons and verification evidence in the work or review record. If no file exists, check the Stage 7 closing review and Stage 8 approval: record none only when no cosmetic debt was declared; a missing referenced file blocks. Never create an empty backlog just to satisfy this check.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** `clean` (this exact scope meets the clean-pass rules); `findings` (discrepancies require disposition); `blocked` (required verification could not finish); `invalid` (the review attempt is unusable). None of these supplies a separate human approval. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** `analysis/reviews/stage-NN-pass-NNN.md`. Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

> **Publication:** PM archives this unchanged report and evidence in a separate
> records PR, even for a negative verdict. Author corrections use a later PR.
> Required CI and owner merge apply; merge is not acceptance. Keep later PR/CI
> facts outside the sealed report. Follow
> [Review And Correction PRs](../migration_methodology.md#review-and-correction-prs).

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Result: `findings` - Stage 2 pass 005 (full blind review of the Stage 1 baseline after BA-001-06)**
>
> The Stage 1 records at revision `7c2f5619fd25fed0a09ba108eb886b5e2b1a012c` are accurate for almost every row and claim: 438 of 468 comparison checks matched, 29 are mismatches and 1 is justified not-applicable; none is unchecked. All six pass-004 findings and all 22 earlier findings of passes 001-003 are resolved. Five new findings return the work to Stage 1:
> - **F-001 (medium):** people import cannot save anyone, because `ImportPeopleAction` depends on a `personDao` bean that no Spring file defines (rows 50-51 say `Yes`).
> - **F-002 (medium):** the aggregate timesheet concatenates the posted `selectedPeople` values into its HQL without numeric checks; the security facts do not list it.
> - **F-003 (low):** three insecure behaviors are unrecorded: the task board writes `fkey` unescaped into a script; the error and system-information pages print every request parameter; the remember-me cookies never expire.
> - **F-004 (low):** the seven WAP actions are created by Struts, not Spring, so their authenticator and authorizer are never injected.
> - **F-005 (low):** opening the file manager or saving an attachment creates directory rows, which rows 172 and 176 do not state.
>
> **Checklist issues:** F-001, F-004 and F-005 are failed [`CHK-003`](../error-prevention-checklist.md#active-checks) results (a non-null injected dependency, and persistence effects per entry point). F-002 and F-003 are new findings; proposal P-2 suggests a new check. No other checklist row failed.
>
> **Next:** Stage 1 re-entry on F-001..F-005, then a new fresh blind Stage 2 pass. No Stage 3 transition is possible from this pass.
>
> **Details:** [Comparison Results](#read-comparison-results) / [Conclusion and Next Gate](#read-conclusion-and-next-gate) / [Coverage Summary](#read-coverage-summary).

<details>
<summary><strong>Contents</strong></summary>

- [Metadata](#read-metadata)
- [Independence Declaration](#read-independence-declaration)
- [Scope and Inputs](#read-scope-and-inputs)
- [Method and Coverage](#read-method-and-coverage)
- [Stage 2 Phase A - Blind Inventory](#read-stage-2-phase-a-blind-inventory)
  - [Phase A Saved Checkpoint](#read-phase-a-saved-checkpoint)
- [Stage 2 Phase B - Two-Way Reconciliation](#read-stage-2-phase-b-two-way-reconciliation)
  - [Reviewer Corrections To Phase A](#read-reviewer-corrections-to-phase-a)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
  - [Earlier Findings Resolution](#read-earlier-findings-resolution)
- [Findings](#read-findings)
  - [F-001 - People import cannot save: the personDao bean is undefined](#read-f-001-people-import-cannot-save-the-persondao-bean-is-undefined)
  - [F-002 - Aggregate timesheet builds HQL from posted person ids](#read-f-002-aggregate-timesheet-builds-hql-from-posted-person-ids)
  - [F-003 - Three insecure behaviors are missing from rows and security facts](#read-f-003-three-insecure-behaviors-are-missing-from-rows-and-security-facts)
  - [F-004 - WAP actions run without their injected dependencies](#read-f-004-wap-actions-run-without-their-injected-dependencies)
  - [F-005 - Directory rows are created on read and first use](#read-f-005-directory-rows-are-created-on-read-and-first-use)
- [Automated and Manual Gates](#read-automated-and-manual-gates)
- [Blocked Scope](#read-blocked-scope)
- [Interaction Log](#read-interaction-log)
- [Conclusion and Next Gate](#read-conclusion-and-next-gate)
- [Error Prevention](#read-error-prevention)
  - [Checklist Review](#read-checklist-review)
  - [Reviewer Self-Check And Learning](#read-reviewer-self-check-and-learning)
- [Dependency Review](#read-dependency-review)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-metadata"></a>

## Metadata

- Date: 2026-09-25
- Stage: 02
- Pass: 005
- Scope: project `xplanner2-revision1`; full Stage 1 baseline: [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) (210 scenario rows) against the immutable [`legacy/`](../../legacy) package
- Reviewed revision: `7c2f5619fd25fed0a09ba108eb886b5e2b1a012c` (legacy Git tree `3bd350fa5559ce56d2ea6f5136a62197754d4dca`)
- Base revision: not applicable (full pass)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p005`
- Session ID: `ae6fd13a44df6456a`
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P005/independence-record.md`](evidence/S02-P005/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P005`, [`packet.json`](evidence/S02-P005/packet.json) SHA-256 `90d73bfe1207b744cc77b60f23b5e07f6bb0ed1f1c935be97e3a006ea93cb3ca`; [`routing-extract.json`](evidence/S02-P005/routing-extract.json) SHA-256 `369cf2e5e0c956fa7596835358780c6c9a39fbe48670df9b700b98c048076d26`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: full
- Verification baseline: revision `7c2f5619fd25fed0a09ba108eb886b5e2b1a012c`; WAR SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`
- Expansion trigger: none (full pass)

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] For Stage 2, I inventoried source behavior before reading prior
      conclusions, the filled parity map or reconnaissance, and saved Phase A
      before first Phase B access.

The client injected a `gitStatus` snapshot into the launch context. Its commit subjects name the pass-004 finding ID range and a process rule, with no finding content. PM accepted this as a disclosed, non-substantive exposure before Phase A. The verbatim text, the PM decision and the full access sequence are in the independence record and [`access-log.md`](evidence/S02-P005/access-log.md).

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

**Phase A inputs (allowed before the checkpoint).**
- The sparse worktree `.migration-tmp/stage-02-p005/phase-a` at the reviewed revision: the instruction paths of the routing extract ([`MIGRATION.md`](../../MIGRATION.md), [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md), [`analysis/agent-roles.md`](../agent-roles.md), [`.agents/skills/migration-ba/SKILL.md`](../../.agents/skills/migration-ba/SKILL.md) git blob `b97db7a6881a199d9c981e375c2518b248877f78`, the Stage 2 and Review And Correction PRs sections of [`analysis/migration_methodology.md`](../migration_methodology.md), the listed sections of [`analysis/reviews/README.md`](README.md) and [`analysis/agent_orchestration.md`](../agent_orchestration.md), [`analysis/reviews/stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md), [`analysis/error-prevention.md`](../error-prevention.md) and [`analysis/legacy_user_flows_template_instructions.md`](../legacy_user_flows_template_instructions.md)).
- The legacy package [`legacy/`](../../legacy): `xplanner-plus.war` (extracted read-only into reviewer scratch), `README.md`, `docker-compose.yml`. `demo-seed.sql` was excluded by scope and not opened.

**Withheld until Phase B and opened only after the release at `2026-09-25T09:52:22Z`.** Pinned hashes were verified before use (see the access log):

| Input | SHA-256 |
|---|---|
| [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) | `09183d1142dee6cbc2eafc8ce57858164dc3892379092dccfd3c7d115696cfe4` |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | `fa0ea118857f541fe7e556d12bd84a379ea32930cf666bdfc288d9ad897e4d76` |
| [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) (CHK-001..CHK-011) | `7a5683a8e0411f7d748ffc873fae2ec590ce0138a77a313fb92df4837553694d` |
| [`analysis/stages/stage-01/stage-02-pass-004-dispositions.md`](../stages/stage-01/stage-02-pass-004-dispositions.md) | `2ba8dc1ff39e133b4b82b5dfcd95c1dbaabce810e5c13d6978b455b1b8473d84` |
| [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](../stages/stage-01/stage-02-pass-001-dispositions.md), [`stage-02-pass-002-dispositions.md`](../stages/stage-01/stage-02-pass-002-dispositions.md), [`stage-02-pass-003-dispositions.md`](../stages/stage-01/stage-02-pass-003-dispositions.md) | `5d823882...`, `549a5cf2...`, `668a8b6c...` (equal to the revision) |
| [`analysis/reviews/stage-02-pass-004.md`](stage-02-pass-004.md) | `671b9bc9cb727bc806efbf6ef8cd508ac4ebf128b25f131f87bf763db3dd9240` |
| [`analysis/reviews/stage-02-pass-001.md`](stage-02-pass-001.md), [`stage-02-pass-002.md`](stage-02-pass-002.md), [`stage-02-pass-003.md`](stage-02-pass-003.md) | `73e8fb00...`, `545ad428...`, `0246765a...` (equal to the revision) |
| [`analysis/stages/bootstrap/bootstrap-gate-report.md`](../stages/bootstrap/bootstrap-gate-report.md) | `1432e4a4...` (hash only; not needed) |
| [`analysis/migration_status.yaml`](../migration_status.yaml) (working tree, read-only) | `703e678ef3797bc5d0f9afecd98b5c808b69a4ec9e537ae853d0671c3b87704b` (owner decision IDs only) |

**Explicit exclusions.** Legacy runtime, network and remote access (Stage 3); earlier reviewer and author scratch (`.migration-tmp/stage-01/**`, `.migration-tmp/stage-02*/**`) and PM scripts (packet boundary; see E-001); earlier-migration examples (constitution A2); third-party library internals, except one Spring-Struts class disassembled to confirm the action fallback (A-094).

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **One batch, no context reset.** Phase A ran from `2026-09-25T09:25:23Z` to the checkpoint at `09:51:12Z`; Phase B started at the release `09:52:22Z`. Worktree `git status --short` was empty at the ACK, at the checkpoint and at the start and end of Phase B.
- **Phase A.** The WAR was extracted with `tar.exe`. All 594 classes were disassembled by the reviewer's own read-only Node class-file disassembler (constant pool, members, annotations, full bytecode and exception tables). Descriptors, Spring files, properties, the Liquibase changelog, JSPs and TLDs were read per file. The 87 Struts routes and 77 page files were enumerated mechanically, and each negative search was paired with a positive control. See [`phase-a-inventory.json`](evidence/S02-P005/phase-a-inventory.json).
- **Phase B, inventory to records.** Each of the 113 A-items was located in the rows and reconnaissance sections, or recorded as missing (C-001..C-113).
- **Phase B, records to source.** All 210 rows were read in full (C-114..C-323).
  - A mechanical citation check resolved 410 file:line citations and 235 class#member citations in the rows and the reconnaissance ([`citecheck-results.json`](evidence/S02-P005/citecheck-results.json)). The checker flagged 4 items, which were then read by hand. All 4 are checker attribution artifacts (a continuation `:NN` assigned to the wrong earlier file) or the literal word "empty"; none is a Stage 1 citation error.
  - All 21 rows with per-bundle notes were recomputed against the 10 bundles ([`bundlecheck-results.txt`](evidence/S02-P005/bundlecheck-results.txt)), and date formats were compared in all bundles.
  - The rest were checked semantically against the Phase A inventory and targeted source reads: bytecode of `EditPersonHelper#modifyRoles`, `ViewIterationMetricsAction#getRepository`, `ContentTag`/`PrintLinkTag`, `XPlanner#toArray`, `TwikiFormat`, `FileSystemImpl`, `AggregateTimesheetQuery#getTimesheet`, and the relevant JSP and descriptor lines.
  - 117 reconnaissance claims were checked the same way (C-324..C-440). They include the ZIP rewrite signs (a reviewer parse of the central directory), bean counts, class counts, figures, gaps, P-codes, owner decision IDs and Q2/Q3/Q4 facts.
- **Earlier findings.** All 28 findings of passes 001-004 were re-verified against the source (C-441..C-468).
- **Counts** are check items, not rows; one finding may cover several checks. The full ledger is [`comparison-results.json`](evidence/S02-P005/comparison-results.json).

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

- Allowed Phase A inputs and exact legacy revision: see [Scope and Inputs](#read-scope-and-inputs); revision `7c2f5619fd25fed0a09ba108eb886b5e2b1a012c`.
- Filled Stage 1 records and prior results withheld: reconnaissance, workbook, learned checklist, full status, Stage 1 dispositions, passes 001-004 with their evidence, maintenance records, earlier scratch.
- Input-access sequence: [`access-log.md`](evidence/S02-P005/access-log.md) (every file with UTC time; injected context recorded verbatim).
- Phase A snapshot: durable attachment [`phase-a-snapshot.txt`](evidence/S02-P005/phase-a-snapshot.txt), which pins [`phase-a-inventory.json`](evidence/S02-P005/phase-a-inventory.json), [`war-manifest.tsv`](evidence/S02-P005/war-manifest.tsv), [`routes.json`](evidence/S02-P005/routes.json), [`jsps.json`](evidence/S02-P005/jsps.json) and six reviewer tools.
- Snapshot saved at: `2026-09-25T09:51:12Z` (before the first Phase B access at `09:53:05Z`)
- Snapshot revision or SHA-256: snapshot file `3efaed49a3b9cbe0843fb4d254dfe017bafdbe5372357ef036d29a8012a30a3a`; inventory `fcac1fd21281ca4f898889b65c6f5980d810141c4c861b81b02ce88395f49f9b`
- Inventory coverage, exclusions and unresolved source access: 113 items (A-001..A-162). Exhaustive breakdowns cover all 964 WAR files, all 87 Struts routes, all 80 Spring action beans, 46 distinct global-forward names (47 declarations), 24 form beans and all 77 page files. Not inspected: `demo-seed.sql` (scope), message bundle bodies, third-party jar internals, detailed hour-metric getters and scriptlet logic beyond the scanned call patterns. No runtime.

The table below is the frozen Phase A list, reproduced from the pinned inventory. Details and evidence are in the attachment. Later corrections are recorded in Phase B as RC-NNN, not here.

| Inventory ID | Independently discovered surface / behavior / claim | Role, conditions and outcome | Legacy source evidence | Uncertainty / coverage limit |
|---|---|---|---|---|
| A-001 | Legacy package composition | legacy/ contains exactly 4 files: XPlanner+ WAR, Russian-language README run notes, docker-compose run helper and a demo SQL fixture. The WAR has 1090 tar entries / 964 files: 594 classes under WEB-INF/classes (no Java ... | `legacy/ listing`; `war-manifest.tsv` | confirmed-static; No Java source: behavior inside method bodies is derived from bytecode disassembly (symbols, constants, branches). |
| A-002 | Version and build identity | xplanner.version=1.1a4, build date 04/12/2011, revision 426; Maven artifact net.sf:xplanner-plus; built with JDK 1.6.0_29. | `WEB-INF/classes/xplanner.properties:155-157`; `META-INF/MANIFEST.MF:1-5` | confirmed-static |
| A-003 | Local MySQL configuration patch in the WAR | Both xplanner.properties and the loaded override xplanner-custom.properties point Hibernate/DBCP at MySQL host 'db' database 'xplanner' with XPlannerMySQLDialect and a DB user/password (values not recorded). ... | `WEB-INF/classes/xplanner.properties:10-17`; `WEB-INF/classes/xplanner-custom.properties:19-24` | confirmed-static; Which of the two files was edited cannot be determined without the upstream original; effective value is identical. |
| A-004 | Local run helper (docker-compose) and context path | Two services: MySQL 5.7 (utf8) with a named volume and healthcheck, and Tomcat 9 / JRE 8 on port 8080 with -Xverify:none and 256-768 MB heap. The WAR is mounted as xplanner-legacy.war, so the Tomcat context is ... | `legacy/docker-compose.yml:9-53`; `legacy/README.md:29-45` | confirmed-static; Run helper, not application behavior; the /xplanner-plus vs /xplanner-legacy conflict is a documentation discrepancy. |
| A-005 | Competing context-root and application URL declarations | META-INF/context.xml path=/xplanner-plus (ignored by Tomcat for webapps/ deployments), sun-web.xml /xplanner-plus (GlassFish only), geronimo-web.xml /xplanner (Geronimo only). Effective xplanner.application.url is ... | `META-INF/context.xml:2`; `WEB-INF/sun-web.xml:4` | confirmed-static; Effective URL mismatch with the deployed context (/xplanner-legacy) affects links in e-mails; runtime not observed. |
| A-006 | Demo fixture excluded | legacy/demo-seed.sql is a prepared demo fixture (authorized scope) and was deliberately not opened; it is not used as evidence of behavior. | `routing-extract.json authorized_scope` | confirmed-static; Contents not inspected by design. |
| A-007 | Runtime library stack (103 jars) | Struts 1.2.9 + Tiles, Spring 3.0.5 (core/web/webmvc/orm/tx/aop/struts), Hibernate 3.6.5 + JPA 2.0 API, javassist/cglib, commons-dbcp/pool, c3p0 0.9.0, Liquibase 2.0.1, tk-autopatch 0.7.3, Axis 1.4 (+jaxrpc, saaj, ... | `WEB-INF/lib/* (war-manifest.tsv)` | confirmed-static; Which jars are actually exercised is partly inferred (e.g. sitemesh, jetty, c3p0 have no configured consumer found). |
| A-010 | Servlet inventory and URL mappings | 6 live servlets / 7 mappings: XPlannerServlet (Struts, net.sf.xplanner.struts.XPlannerActionServlet) /do/*; Jersey SpringServlet /rest/* (POJO JSON on); CewolfRenderer /cewolf/* (load-on-startup 1); AxisServlet ... | `WEB-INF/web.xml:206-316`; `WEB-INF/web.xml:273-282 (commented)` | confirmed-static |
| A-011 | Filter chain and ordering | 8 filters / 10 mappings in declaration order: ActivityLogFilter /do/*; ServletRequestFilter /*; OpenSessionInViewFilter /* (REQUEST, ERROR); HibernateSessionFilter /* (REQUEST, ERROR); MobileSecurityFilter /do/mobile/*; ... | `WEB-INF/web.xml:54-181`; `WEB-INF/web.xml:76-83 (commented NullSecurityFilter)` | confirmed-static; Encoding filter placed after security filters may not affect parameters already parsed by the security filter ... |
| A-012 | Context listeners (startup work) | 5 live listeners in order: Spring Log4jConfigListener (log4j-war.xml, exposes webapp root as xplanner-plus.root); HsqldbServerContextListener (starts in-process HSQLDB only when xplanner.migration.databasetype=hsqldb; ... | `WEB-INF/web.xml:31-52,183-204`; `class com.technoetic.xplanner.filters.HsqldbServerContextListener#contextInitialized` | confirmed-static |
| A-013 | Schema creation and data seeding at application startup (Liquibase) | Spring bean 'liquibase' (SpringLiquibase, contexts 'test, production') runs db-changelog.xml before the sessionFactory is built. 8 changesets: 1-1 create 19 tables (precondition: attribute absent); 1-2 keys, unique ... | `WEB-INF/classes/spring-beans.xml:71-81`; `WEB-INF/classes/db-changelog.xml:5-498 (seed person at 396-411; password column at 404 not recorded)` | confirmed-static; Preconditions of 1-2/1-3 test object_type absence; behavior against an existing older schema not verified. |
| A-014 | Duplicate Spring contexts (root and Struts plug-in) | The root context loads spring-beans.xml (which imports caching, dao, security). The Struts ContextLoaderPlugIn separately loads action-servlet.xml, spring-beans.xml again and test-action-servlet.xml, so singletons such ... | `WEB-INF/web.xml:32-38`; `WEB-INF/struts-config.xml:438-441` | inferred; Consequences (double scheduled job, second Liquibase run, two caches) need runtime confirmation. |
| A-015 | Other startup side effects | DaoScanner.init prints every DAO bean to stdout; XPlannerProperties loads xplanner.properties then the override file named by -Dxplanner.overrides (default xplanner-custom.properties); CewolfRenderer and SpringServlet ... | `WEB-INF/classes/spring-beans.xml:408-409`; `class net.sf.xplanner.util.DaoScanner#init` | confirmed-static |
| A-016 | Session, welcome and error-page configuration | Session timeout 30 minutes; <distributable/>; welcome file index.jsp; JspException, ServletException and any Throwable map to /WEB-INF/jsp/common/unexpectedError.jsp; Struts global exceptions map ... | `WEB-INF/web.xml:14-29,318-323`; `WEB-INF/struts-config.xml:81-90` | confirmed-static |
| A-020 | Form security filter semantics (bypass-only) | AbstractSecurityFilter.doFilter treats every request NOT matching the configured security-bypass list as secure and requires an authenticated subject; the security-constraint/auth-constraint role lists in security.xml ... | `class com.technoetic.xplanner.security.filter.AbstractSecurityFilter#doFilter`; `class com.technoetic.xplanner.security.config.SecurityConfiguration#isSecureRequest/#isAuthorized` | confirmed-static |
| A-021 | Web bypass list | /do/login, /do/notAuthorized and /do/invalidateHibernateCache pass the web filter without authentication. /do/invalidateHibernateCache evicts all Hibernate query caches (SessionFactory.evictQueries) for anyone. | `WEB-INF/security.xml:2-6`; `WEB-INF/test-struts-config.xml:23` | confirmed-static; Response body after eviction not determined (execute returns without a mapped JSP; input JSP ... |
| A-022 | Mobile channel login is shadowed by the web filter | /do/mobile/* passes MobileSecurityFilter (bypass /do/mobile/login and /do/mobile/notAuthorized) and then WebSecurityFilter (/do/*), whose bypass list does not contain /do/mobile/login. An unauthenticated mobile login ... | `WEB-INF/web.xml:155-163`; `WEB-INF/mobile-security.xml:2-5` | inferred; Filter order per declaration order of filter-mappings; runtime not observed. |
| A-023 | HTTP Basic authentication for SOAP and iCal | BasicSecurityFilter on /soap/* and /ical/*; soap-security.xml has no bypass so every request is secure. Accepted: session subject, or 'Authorization: Basic' header decoded (Base64 user:password) and authenticated ... | `WEB-INF/web.xml:111-119,168-176`; `WEB-INF/soap-security.xml:1-45` | confirmed-static; Exact status code constant not decoded (setStatus argument). |
| A-024 | Paths with no security filter | No security filter covers /rest/* (Jersey API, see A-103), /servlet/AxisServlet (SOAP via the second mapping, see A-104), /cewolf/* (chart images), /index.jsp and /calendar/calendar-i18n.jsp (public JSPs), static files ... | `WEB-INF/web.xml:130-181,283-316`; `war-manifest.tsv (non-WEB-INF entries)` | confirmed-static |
| A-025 | Login flow | GET/POST /do/login (DynaActionForm userId, password, action, loginModuleNames). Empty 'action' shows /WEB-INF/jsp/security/login.jsp. Otherwise Authenticator.authenticate (logs out a previous subject first), stores ... | `WEB-INF/struts-config.xml:66-72,164-167`; `WEB-INF/action-servlet.xml:10` | confirmed-static; Session is not renewed on login (no invalidate/new session call found) - session fixation inferred. |
| A-026 | Configured login modules | Only login[0] XPlannerLoginModule named 'XPlanner' with userIdCaseSensitive=true is configured. JAAS, NTLM (jcifs) and JNDI/LDAP (com.sabre.security.jndi) module beans exist but are not referenced by any ... | `WEB-INF/classes/xplanner.properties:162-164`; `WEB-INF/classes/spring-security.xml:26-44` | confirmed-static; Other modules inert unless properties are added. |
| A-027 | Password verification and storage | Person looked up by userid; missing password -> passwordNotSet; stored value is Base64(12-byte random salt + MD5(salt + UTF-8 password)); mismatch -> authenticationFailed; unknown user -> userNotFound; DB error -> ... | `class com.technoetic.xplanner.security.module.XPlannerLoginModule#authenticate/#isPasswordMatched/#digestPassword/#encodePassword/#changePassword`; `class com.technoetic.xplanner.security.module.LoginSupportImpl#populateSubjectPrincipalFromDatabase` | confirmed-static |
| A-028 | Remember-me credential cookie | remember=Y creates cookies 'userid' (plain) and 'password' (Base64 of the clear password) with max-age Integer.MAX_VALUE, no path/HttpOnly/Secure set. FormSecurityFilter re-authenticates from these cookies when no ... | `class com.technoetic.xplanner.security.CredentialCookie#set/#getPassword`; `class com.technoetic.xplanner.util.CookieSupport#createCookie` | confirmed-static |
| A-029 | Logout | /do/logout calls the login module logout (session invalidate), removes the credential cookies and forwards to security/login (-> /do/login). An AOP advisor on 'logout' invalidates the cached permissions of that ... | `WEB-INF/struts-config.xml:171`; `class com.technoetic.xplanner.actions.LogoutAction#execute` | confirmed-static |
| A-030 | Credentials present in shipped files (locations only) | Password-bearing locations: DB password in xplanner.properties:15 and xplanner-custom.properties:24 (also in other unused custom variants); xplanner.test.user/xplanner.test.password at xplanner.properties:139-140; Axis ... | `locations as listed` | confirmed-static; Whether the seeded hash matches the README login pair was not tested (no runtime; no hashing performed). |
| A-040 | Role model | Four hierarchical roles stored as a nested set in table roles: viewer(lft1,rgt8) > editor(2,7) > admin(3,6) > sysadmin(4,5). person_role links person, role and project; project_id 0 is the wildcard 'all projects' ... | `WEB-INF/classes/db-changelog.xml:363-386,407-411,497`; `WEB-INF/classes/mappings/Metrics.xml:117-128` | confirmed-static |
| A-041 | Seeded permission rules | sysadmin: '%' on '%'. admin: 'admin%' on '%'; denied create.project. editor: create%, edit%, integrate%, delete% on '%'; denied create.project, create.person and delete on system.project.iteration. viewer: read%. ... | `WEB-INF/classes/db-changelog.xml:275-362`; `WEB-INF/classes/mappings/Metrics.xml:130-171` | confirmed-static; Per-role outcome of combined positive/negative rules at runtime not observed. |
| A-042 | Permission evaluation engine | AuthorizerImpl.hasPermission(principal, project, resourceType, resourceId, permission) resolves the resource type from the domain class (system.project, .iteration, .story, .task, .feature, .time_entry, .integration, ... | `class com.technoetic.xplanner.security.auth.AuthorizerImpl#hasPermission/#permissionMatches/#isMatching/#getTypeOfResource`; `WEB-INF/classes/spring-caching.xml:7-73` | confirmed-static |
| A-043 | No server-side authorization in generic view/edit/delete/export actions | ViewObjectAction, EditObjectAction (and subclasses), DeleteObjectAction, ExportAction and DownloadAttachmentAction load/save/delete through CommonDao/Session directly; the secure repository chain ... | `class com.technoetic.xplanner.actions.ViewObjectAction#doExecute`; `class com.technoetic.xplanner.actions.EditObjectAction#updateObject/#createObject` | inferred; Strong bytecode evidence; must be confirmed live at Stage 3 with a viewer-role account. |
| A-044 | Authorization checks that do exist | DispatchForward (secure unless authorizationRequired=false or @secure forward false): requires projectId and read on system.project, else forward security/notAuthorized - applies to /do/view/integrations and the mobile ... | `class com.technoetic.xplanner.actions.DispatchForward#execute/#isSecure`; `class com.technoetic.xplanner.actions.EditRoleAction#isAuthorizedRoleAdministratorForProject` | confirmed-static |
| A-045 | UI-level authorization (rendering) | Tags xplanner:isUserAuthorized, isUserAuthorizedForAny, isUserInRole, outline, personOptions, writableTable and link/action tags consult the Authorizer to show/hide actions; action button permissions are configured as ... | `WEB-INF/xplanner.tld`; `class com.technoetic.xplanner.tags.IsUserAuthorizedTag` | confirmed-static; Consumer of actionbuttons.* keys not traced to a class (property keys found only in properties). |
| A-046 | Not-authorized target page missing | Global forward security/notAuthorized points to /WEB-INF/jsp/security/notAuthorized.jsp which is not in the WAR; /do/notAuthorized (bypassed) dispatches to the same missing page. Any DispatchForward denial therefore ... | `WEB-INF/struts-config.xml:139,169`; `WEB-INF/action-servlet.xml:12-14` | broken-inferred; Runtime response (404 or error page) not observed. |
| A-050 | Projects list | /do/view/projects (DispatchForward, authorizationRequired=false) renders projects.jsp: visible projects with current iteration, links to edit project, people and aggregate timesheet. | `WEB-INF/struts-config.xml:179`; `WEB-INF/action-servlet.xml:29-31` | confirmed-static; Filtering of hidden projects / per-user visibility inside the JSP not fully traced. |
| A-051 | Project view | /do/view/project?oid (ViewObjectAction type Project) sets domain context and renders project.jsp: iterations list, create/edit iteration links, people, history, export links. | `WEB-INF/struts-config.xml:181-183`; `WEB-INF/action-servlet.xml:33-37` | confirmed-static |
| A-052 | Project create/update | /do/edit/project (EditProjectAction, form ProjectEditorForm; validation project.editor.missing_name). Create/Update via action=Create/Update; stores project attributes twiki.scheme.wiki (wiki URL), ... | `WEB-INF/struts-config.xml:195`; `WEB-INF/action-servlet.xml:72-76` | confirmed-static |
| A-053 | Project time-notification receivers | /do/edit/project/notification (UpdateTimeNotificationReceivers): addTimeNotification adds personToAddId to project.notificationReceivers (join table notification_receivers); delTimeNotification removes personToDelete; ... | `WEB-INF/struts-config.xml:368-372`; `class com.technoetic.xplanner.actions.UpdateTimeNotificationReceivers#doAction` | confirmed-static |
| A-054 | Project delete and cascade | /do/delete/project?oid (DeleteObjectAction): publishes a delete event (no listener) and Session.delete. JPA cascades: Project.iterations ALL -> Iteration.userStories REMOVE -> UserStory.tasks REMOVE -> Task.timeEntries ... | `WEB-INF/struts-config.xml:197`; `class com.technoetic.xplanner.actions.DeleteObjectAction#doExecute` | inferred; Orphan behavior and FK outcomes need runtime/DB confirmation. |
| A-055 | Iteration views (tabs) | ViewObjectAction type Iteration: /do/view/iteration (stories table, reorder, move multiple), /iteration/tasks, /iteration/features, /iteration/metrics (ViewIterationMetricsAction: IterationMetrics.analyze -> developer ... | `WEB-INF/struts-config.xml:203-229`; `WEB-INF/action-servlet.xml:90-130` | confirmed-static |
| A-056 | Iteration create/edit | /do/edit/iteration (EditIterationAction, IterationEditorForm; validation missing_name, bad_start_date, bad_end_date). On Create: sets project from projectId, status INACTIVE, daysWorked. | `WEB-INF/struts-config.xml:241-243`; `class com.technoetic.xplanner.actions.EditIterationAction#beforeObjectCommit` | confirmed-static; Value assigned to daysWorked not decoded. |
| A-057 | Start iteration (wizard) | /do/start/iteration (StartIterationAction): without confirmation shows editIterationStatus.jsp with the number of already started iterations; with closeIterations closes other active iterations of the project; sets ... | `WEB-INF/struts-config.xml:245-248`; `class com.technoetic.xplanner.actions.StartIterationAction#doExecute/#beforeObjectCommit/#closeStartedIterations` | confirmed-static |
| A-058 | Close iteration | /do/close/iteration (CloseIterationAction): if active -> INACTIVE, closing data samples, history 'closed'; redirects (onclose) to /do/continue/unfinished/stories?iterationId=... unless returnto given. | `WEB-INF/struts-config.xml:251-255`; `class com.technoetic.xplanner.actions.CloseIterationAction#doExecute/#closeIteration` | confirmed-static |
| A-059 | Continue unfinished stories | /do/continue/unfinished/stories (ContinueUnfinishedStoriesAction): action Ok continues every incomplete story of the closed iteration into the target iteration via StoryContinuer (clone story and incomplete tasks, ... | `WEB-INF/struts-config.xml:277-279`; `class com.technoetic.xplanner.actions.ContinueUnfinishedStoriesAction#saveForm/#continueIteration` | confirmed-static |
| A-060 | Iteration delete and cascade | /do/delete/iteration (DeleteObjectAction type Iteration; form name iterationEditorForm is undefined): cascades to stories, tasks and time entries; attached notes, attributes and data samples remain; editor role has a ... | `WEB-INF/struts-config.xml:257`; `WEB-INF/action-servlet.xml:196-200` | inferred; Struts behavior with an undefined form-bean name not verified. |
| A-061 | Reorder stories and move multiple stories | /do/edit/reorderstories (ReorderStoriesAction; validation story.editor.invalid.order.number) applies orderNo values to Iteration.modifyStoryOrder and redirects to the iteration; client-side jQuery UI drag-and-drop ... | `WEB-INF/struts-config.xml:357-366`; `class com.technoetic.xplanner.actions.ReorderStoriesAction#doExecute` | confirmed-static |
| A-062 | User story view/create/edit | /do/view/userstory; /do/edit/userstory (EditStoryAction, UserStoryEditorForm; validation missing_name, negative_estimated_hours, invalid_priority, same_iteration). New story gets disposition from the iteration (ADDED if ... | `WEB-INF/struts-config.xml:265-271`; `class com.technoetic.xplanner.actions.EditStoryAction#beforeObjectCommit/#populateForm` | confirmed-static; Consumer of xplanner.story.defaultpriority not traced. |
| A-063 | Move or continue a story | /do/move/continue/userstory (MoveContinueStoryAction): Move -> story moved to target iteration, order adjusted, history 'moved'/'moved out'/'moved in'; Continue -> StoryContinuer clone into target; validation ... | `WEB-INF/struts-config.xml:273-275`; `class com.technoetic.xplanner.actions.MoveContinueStoryAction#saveForm` | confirmed-static |
| A-064 | Story delete and cascade | /do/delete/userstory (DeleteObjectAction type UserStory; form userStoryEditorForm undefined): cascades to tasks and time entries; notes by attachedToId remain; no history. | `WEB-INF/struts-config.xml:285`; `class net.sf.xplanner.domain.UserStory#getTasks (@OneToMany cascade REMOVE)` | inferred; Runtime not observed. |
| A-065 | Task view/create/edit with e-mail notification | /do/view/task; /do/edit/task (EditTaskAction, TaskEditorForm; validation bad_created_date, missing_name, negative_estimated_hours). New task disposition from iteration; saving sets userStory from userStoryId. After a ... | `WEB-INF/struts-config.xml:287-291`; `class com.technoetic.xplanner.actions.EditTaskAction#doExecute/#sendNotification/#setTaskDisposition` | confirmed-static; Exact conditions for the update mail (acceptor change vs any change) partially decoded. |
| A-066 | Move or continue a task | /do/move/continue/task (MoveContinueTaskAction, session-scoped form; validation missing_name, same_story): Continue clones the task into the target story (TaskContinuer: postpone, remaining hours as estimate, no time ... | `WEB-INF/struts-config.xml:293-295`; `class com.technoetic.xplanner.actions.MoveContinueTaskAction#saveForm` | confirmed-static |
| A-067 | Task delete and cascade | /do/delete/task (DeleteObjectAction type Task): cascades to time entries; notes remain; no history. | `WEB-INF/struts-config.xml:304`; `class net.sf.xplanner.domain.Task#getTimeEntries (@OneToMany cascade REMOVE)` | inferred; Runtime not observed. |
| A-068 | Time entry editing and re-estimation | /do/edit/time (UpdateTimeAction, TimeEditorForm; validation unparsable_time, unparsable_number, missing_time, missing_person, same_people, negative_interval). UPDATE_TIME: per row delete/update/create time entries ... | `WEB-INF/struts-config.xml:301-302,350-355`; `WEB-INF/action-servlet.xml:298,376-378` | confirmed-static; Form bean 'edit/task/estimate' is undefined (routes.json). |
| A-069 | Notes with attachments | /do/edit/note (EditNoteAction, NoteEditorForm; validation missing_subject, missing_author, missing_body): optional multipart file stored as a BLOB xfile in virtual directory /attachments/project/{projectId}; note linked ... | `WEB-INF/struts-config.xml:306-309`; `WEB-INF/action-servlet.xml:306-319` | confirmed-static; Upload size limits not configured in struts controller (defaults). |
| A-070 | Attachment download | /do/download/attachment?oid (DownloadAttachmentAction): loads the note by id (HQL with the parsed integer), streams the BLOB with the stored content type and Content-disposition 'note;filename="..."'; bad oid logged. No ... | `WEB-INF/struts-config.xml:311`; `class com.technoetic.xplanner.actions.DownloadAttachmentAction#doExecute/#locateNote/#writeAttachment` | confirmed-static |
| A-071 | People list and person view | /do/view/people (DispatchForward, authorizationRequired=false) lists people (hidden last) with edit/import links. /do/view/person?oid (ViewPersonAction, authorizationRequired=false) shows current ... | `WEB-INF/struts-config.xml:313-319`; `WEB-INF/action-servlet.xml:327-350` | confirmed-static |
| A-072 | Person create/edit, roles and password | /do/edit/person (EditPersonAction, PersonEditorForm; validation missing_name, missing_user_id, missing_email, missing_initials, password_mismatch; DuplicateUserIdException -> person.editor.userid_exist). Per-project ... | `WEB-INF/struts-config.xml:321-326`; `class com.technoetic.xplanner.actions.EditPersonAction#beforeObjectCommit/#afterObjectCommit` | confirmed-static; Whether the sysadmin flag change is itself permission-checked was not fully decoded. |
| A-073 | Person delete | /do/delete/person (DeleteObjectAction type Person): plain Session.delete; person_role rows, time entries (person1_id/person2_id without FK), notification_receivers FK and story.customer_id FK (NO ACTION) are not ... | `WEB-INF/struts-config.xml:348`; `WEB-INF/classes/db-changelog.xml:258-267` | inferred; Runtime/DB behavior not observed. |
| A-074 | Import people from CSV | /do/import/people (ImportPeopleAction overrides execute): uploaded text file, one person per line 'userId,name,email,initials,phone'; statuses success, wrong_entry_format, empty_userId, userId_exists; ... | `WEB-INF/struts-config.xml:329-330`; `WEB-INF/action-servlet.xml:359` | broken-inferred; Runtime failure mode not observed. |
| A-075 | Import stories from spreadsheet | /do/import/stories (ImportStoriesAction, ImportStoriesForm; validation worksheet_name, no_title_column, no_end_date_column, no_priority_column, no_completed_story_status): Excel (POI HSSF) worksheet 'Features' with ... | `WEB-INF/struts-config.xml:332-346`; `WEB-INF/classes/xplanner.properties:278-284` | confirmed-static |
| A-076 | Personal timesheet | /do/view/timesheet (ViewTimesheetAction, PersonTimesheetForm; validation unparsable_date): parameterized JDBC queries summarize time by project/iteration/story and per day for one person and date range; charts via ... | `WEB-INF/struts-config.xml:374-378`; `class com.technoetic.xplanner.actions.ViewTimesheetAction#doExecute` | confirmed-static |
| A-077 | Aggregate timesheet (HQL built from request values) | /do/view/aggregateTimesheet (ViewAggregateTimesheetAction, AggregateTimesheetForm; validation unparsable_date): lists non-hidden people; for selected people and date range sums time per project/iteration/story; rows are ... | `WEB-INF/struts-config.xml:380-384`; `class com.technoetic.xplanner.actions.ViewAggregateTimesheetAction#doExecute` | inferred; Exploitability not tested (no runtime). |
| A-078 | Iteration dashboard (client-side) | /do/view/dashboard?fkey=iterationId (DispatchForward, authorizationRequired=false) renders dashboard.jsp, whose jQuery code calls GET {appPath}rest/view/iteration/{fkey}/userstories and renders story/task cards with ... | `WEB-INF/struts-config.xml:386`; `WEB-INF/action-servlet.xml:416-418` | confirmed-static; Reflected-script impact not tested. |
| A-079 | Integration queue | /do/view/integrations?projectId (DispatchForward, secure: needs projectId and read) and /do/edit/integrations (IntegrationAction): join (personId, comment; integrations.error.noperson), leave (action.leave<oid>), start ... | `WEB-INF/struts-config.xml:388-394`; `WEB-INF/action-servlet.xml:390-392` | broken-inferred; Hibernate behavior for the unmapped class not observed. |
| A-080 | History view | /do/view/history?oid&@type (ViewObjectAction without fixed type: class from request parameter @type via Class.forName) renders history.jsp with object events and container create/delete events (HistorySupport). | `WEB-INF/struts-config.xml:396-399`; `WEB-INF/action-servlet.xml:394` | confirmed-static |
| A-081 | Virtual file manager | /do/view/directory (FileManagerAction, form view/file): list (root directory auto-created on first access), upload, download, delete file, mkdir, rmdir on DB-stored xdir/xfile; commit/rollback manually; ObjectNotFound ... | `WEB-INF/struts-config.xml:401-403`; `class com.technoetic.xplanner.actions.FileManagerAction#doExecute` | confirmed-static |
| A-082 | Settings | /do/view/settings (DispatchForward, authorizationRequired=false) lists Setting rows (settings.jsp); /do/edit/setting (EditObjectAction type Setting) has input /WEB-INF/jsp/edit/editSetting.jsp which is absent, so ... | `WEB-INF/struts-config.xml:405,419-421`; `WEB-INF/action-servlet.xml:412-424` | broken-inferred; Runtime not observed. |
| A-083 | Project role editor | /do/edit/roles (EditRoleAction, session-scoped RoleEditorForm, type Project): for each listed person, if the current user has admin.edit.role on the project, delete that person's associations on the project and insert ... | `WEB-INF/struts-config.xml:409-411`; `class com.technoetic.xplanner.actions.EditRoleAction#beforeObjectCommit` | confirmed-static |
| A-084 | Search by id and content search | /do/search/id (IdSearchAction): searchedId required/integer (idsearch.error.missingId, badId, idNotFound) and redirects to /do/view/{type}?oid. /do/search/content (ContentSearchAction): searchedContent required ... | `WEB-INF/struts-config.xml:413-417`; `class com.technoetic.xplanner.actions.IdSearchAction#doExecute` | confirmed-static |
| A-085 | Exports | ExportAction routes: project xml/mpx/mspdi; iteration xml/mpx/mspdi/pdf/jrpdf; story pdf/jrpdf; task pdf/jrpdf; person jrpdf. XML (Betwixt, hides password and lastUpdateTime; text/xml export.xml), MPX (application/mpx ... | `WEB-INF/struts-config.xml:189-193,231-239,281-283,297-299,315`; `WEB-INF/action-servlet.xml:45-70,132-175,238-254,280-296,333-340` | confirmed-static; jrpdf failure is broken-inferred. |
| A-086 | Wiki format help and locale change | /do/view/twikiformat (DispatchForward, no authorization) shows formatting help. /do/changeLocale?language&returnto sets the Struts locale in session (default JVM locale when empty) and redirects. Bundles: default, da, ... | `WEB-INF/struts-config.xml:158,177`; `class com.technoetic.xplanner.actions.ChangeLocaleAction#execute` | confirmed-static; Purpose of ResourceBundle--.properties unknown (no locale suffix). |
| A-087 | System information page | /do/systemInfo (SystemInfoAction) forwards to unexpectedError.jsp in system-info mode for any authenticated user: build info, database dialect/driver/vendor/URL/user (password shown as ******), app server, JVM memory, ... | `WEB-INF/struts-config.xml:160-162`; `class com.technoetic.xplanner.actions.SystemInfoAction#execute` | confirmed-static |
| A-088 | Unexpected error page content | unexpectedError.jsp shows the first 3 words-lines of the exception message unescaped, filing instructions with support URL, exception toString and full stack trace, system environment and request parameters/attributes, ... | `WEB-INF/jsp/common/unexpectedError.jsp:49-135`; `WEB-INF/classes/xplanner.properties:289-309` | confirmed-static |
| A-089 | General error page | generalError.jsp renders Struts errors for mapped exceptions and 'error' forwards (object not found, not authorized) using request parameter oid. | `WEB-INF/jsp/common/generalError.jsp`; `WEB-INF/struts-config.xml:81-90,134-135` | confirmed-static; Escaping of oid not verified. |
| A-090 | Tiles definitions reload | /do/admin/reload-tiles (Struts ReloadDefinitionsAction) reloads tile definitions for any authenticated user. | `WEB-INF/struts-config.xml:407`; `WEB-INF/action-servlet.xml:398` | confirmed-static |
| A-091 | Test/support actions live in production configuration | test-struts-config.xml is loaded by the Struts servlet and test-action-servlet.xml by the plug-in, exposing to any authenticated user: /do/edit/dataSample (runs data sampling for iterations to sample), ... | `WEB-INF/web.xml:232-234`; `WEB-INF/struts-config.xml:438-441` | confirmed-static; Response pages after execution not determined (input JSP /WEB-INF/jsp/admin/invalidateCache.jsp absent). |
| A-092 | Feature management routes (broken) | /do/view/feature, /do/edit/feature, /do/delete/feature and the feature links in project/iteration feature pages use type net.sf.xplanner.domain.Feature, which does not exist; com.technoetic.xplanner.domain.Feature ... | `WEB-INF/struts-config.xml:207-209,259-263`; `WEB-INF/action-servlet.xml:96-100,202-212` | broken-inferred; Runtime error type not observed. |
| A-093 | Missing forward targets and undefined form beans | Missing pages: /WEB-INF/jsp/security/notAuthorized.jsp, /WEB-INF/jsp/view/iterationTabs.jsp (/do/view/iterationTabs), global forwards view/iteration/statistics -> iterationIterations.jsp, view/taskhistory -> ... | `routes.json (MISSING / formDefined=false entries)`; `WEB-INF/struts-config.xml:94-146` | confirmed-static; Runtime impact per route not observed. |
| A-094 | Mobile/WAP channel | 7 routes /do/mobile/login, /do/mobile/view/{projects,project,iteration,story,task,person} rendering WML pages in WEB-INF/jsp/wap. No Spring beans exist for these paths, so Struts instantiates ... | `WEB-INF/mobile-struts-config.xml:18-51`; `routes.json (bean none)` | broken-inferred; Runtime not observed. |
| A-095 | Unreachable WAP auth page echoing credentials | WEB-INF/jsp/wap/auth.jsp prints request parameters userId and password and sets a test cookie; no action or forward references it, and WEB-INF content is not directly addressable. | `WEB-INF/jsp/wap/auth.jsp:10-12`; `routes.json (no forward to wap/auth.jsp)` | inert |
| A-096 | Spring MVC channel /setting/* | DispatcherServlet with annotation mapping scans net.sf.xplanner.web: MePage GET /setting/me/status/{id} -> view view/meStatus (/WEB-INF/jsp/view/meStatus.jsp) with the person's current/pending/completed/future tasks and ... | `WEB-INF/web.xml:264-272,313-316`; `WEB-INF/classes/spring-web.xml:12-30` | confirmed-static; View resolution for CommonObjectHandler return values not traced (likely missing JSPs). |
| A-097 | REST API (Jersey) without authentication | Component-scanned net.sf.xplanner.rest resources under /rest/*: GET /rest/view (text 'Hi there!'); GET /rest/view/project/{projectId} (ProjectView XML/JSON); GET /rest/view/iteration/{iterationId}/userstories ... | `WEB-INF/web.xml:256-263,288-291`; `WEB-INF/classes/spring-beans.xml:50` | confirmed-static; Form parameter names of POST not decoded (annotations on parameters not parsed by the reviewer tool). |
| A-098 | SOAP API (Axis 1.4) | server-config.wsdd deploys service 'XPlanner' (RPC, allowedMethods '*', class com.technoetic.xplanner.soap.XPlanner) and 'Version' (getVersion); bean mappings for ProjectData, IterationData, UserStoryData, TaskData, ... | `WEB-INF/server-config.wsdd:1-51`; `class com.technoetic.xplanner.soap.XPlanner (#getObject/#updateObject/#removeObject/#addObject/#hasPermission/#setAttribute/#getCurrentTasksForPerson)` | confirmed-static |
| A-099 | SOAP reachable without the Basic filter | AxisServlet is also mapped to /servlet/AxisServlet, which no security filter covers. Methods that call getRemoteUserId fail without a session subject, but attribute get/set/delete and person task queries do not require ... | `WEB-INF/web.xml:298-306`; `class com.technoetic.xplanner.soap.XPlanner#setAttribute/#deleteAttribute/#getAttributes/#getCurrentTasksForPerson/#getPlannedTasksForPerson` | inferred; Runtime not observed. |
| A-100 | iCalendar feed | GET /ical/{userId}.ics (Basic/session auth): requires path and .ics suffix ('No iCal file requested.', 'No .ics suffix ...'); another user's calendar requires admin.edit on system.person for some project ('No ... | `WEB-INF/web.xml:251-254,308-311`; `class com.technoetic.xplanner.ical.iCalServlet#doGet/#generateTaskData/#generateTimeEntryData` | confirmed-static; The 'task.story' property path may fail at runtime (inferred). |
| A-101 | Chart image servlet | /cewolf/* (CewolfRenderer, overlib at ../../../overlib.js, debug false) serves chart images produced by cewolf tags in aggregateTimesheet.jsp, timesheet.jsp and iterationStatistics.jsp; not behind a security filter. | `WEB-INF/web.xml:211-225,293-296`; `WEB-INF/cewolf-1.1.tld` | confirmed-static; Whether images are bound to the producing session not verified. |
| A-102 | Welcome page executes a query before login | /index.jsp (welcome file, no filter) queries non-hidden projects via db:useBeans; 0 or >1 projects -> redirect /do/view/projects; exactly one project -> redirect to its current iteration (/do/view/iteration?oid=) or ... | `index.jsp:1-31`; `WEB-INF/web.xml:321-323` | confirmed-static |
| A-103 | Shipped and live activity log served as a static file | log4j ACTIVITY_FILE writes ${xplanner-plus.root}/xplanner-plus-activity.log (webapp root, 5 MB x 50) from ActivityLogFilter START/END records (time, user id, remote IP, action, duration) for every /do/* request. The WAR ... | `WEB-INF/classes/log4j-war.xml:34-47`; `WEB-INF/web.xml:45-52,130-133` | confirmed-static; Static serving of .log by Tomcat default servlet is standard behavior, not observed. |
| A-110 | JSP pages load entities directly | db:useBean (Session.load by oid attribute/parameter) and db:useBeans (HQL from type/where/order attributes, all literal in JSPs) run during rendering without authorization, e.g. editRoles.jsp, person.jsp, people.jsp, ... | `WEB-INF/xplanner-db.tld`; `class com.technoetic.xplanner.tags.db.UseBeanTag#doEndTag/#getObjectId` | confirmed-static |
| A-111 | Wiki/TWiki formatting of descriptions | xplanner:twiki renders descriptions/notes through TwikiFormat: HTML is escaped only when property xplanner.escape.brackets is 'true' (per project attribute; not set in xplanner.properties), otherwise raw HTML passes ... | `class com.technoetic.xplanner.tags.TwikiTag`; `class com.technoetic.xplanner.wiki.TwikiFormat#format` | inferred; Stored-script behavior not tested; default of the escape flag inferred from absence of the key. |
| A-112 | Outbound HTTP during page rendering | twiki.wikiadapter=GenericWikiAdapter formats WikiWords as links to twiki.wikiadapter.topic.url.existing/new (http://localhost:9090/vqw/...) and checks topic existence with HttpClient.getPage, i.e. a server-side HTTP GET ... | `WEB-INF/classes/xplanner.properties:113-116`; `class com.technoetic.xplanner.wiki.GenericWikiAdapter#isTopicExisting/#formatWikiWord` | inferred; Call path from TwikiFormat to GenericWikiAdapter not fully decoded. |
| A-113 | Request context attributes | ServletRequestFilter binds the request to a thread-local and sets request attributes currentPageUrl (URL + query) and appPath (absolute context URL) used by layouts and the dashboard script. | `class com.technoetic.xplanner.filters.ServletRequestFilter#doFilter`; `WEB-INF/web.xml:135-138` | confirmed-static |
| A-114 | Rendering-path writes | Reads that write: FileSystemImpl.getRootDirectory saves a root directory when none exists (file manager, note attachment); UseBeans/Outline tags only read. Page layouts (viewLayout, defaultLayout, defaultEditLayout, ... | `class com.technoetic.xplanner.file.FileSystemImpl#getRootDirectory`; `WEB-INF/tiles-definitions.xml` | confirmed-static |
| A-120 | Datasource and transactions | Commons DBCP BasicDataSource from hibernate.connection.* properties with defaultAutoCommit=false; HibernateTransactionManager; tx:annotation-driven for DAOs (@Transactional); AbstractAction runs doExecute and ... | `WEB-INF/classes/spring-beans.xml:60-93`; `WEB-INF/classes/spring-dao.xml:15` | confirmed-static |
| A-121 | Entity model | 21 annotated entities scanned from net.sf.xplanner.domain: Attribute(attribute), DataSample(datasample), Directory(xdir), File(xfile), History(history), Identifier(identifier), Integration(integration), ... | `reviewer-scratch/dis/domain-annotations.txt`; `WEB-INF/classes/spring-beans.xml:77-81` | confirmed-static |
| A-122 | Loaded and unloaded mapping files | Only classpath:/mappings/Metrics.xml (named HQL queries) is loaded. The other 16 hbm files in WEB-INF/classes/mappings and hibernate.reveng.xml are not referenced by any configuration (inert). | `WEB-INF/classes/spring-beans.xml:80`; `consumer search for 'mappings/' in all XML/properties and disassembly (only spring-beans.xml:80)` | inert |
| A-123 | Named queries and their consumers | Metrics.xml queries: iterationHoursWorkedQuery, namesQuery, IterationToSample (DataSamplingCommand), Iteration/Note/Project/Task/UserStory search and restricted search (SearchContentQuery), GetCurrentIterationQuery, ... | `WEB-INF/classes/mappings/Metrics.xml:8-346` | confirmed-static; Consumer mapping for each query partially inferred from class names. |
| A-124 | Hibernate cache and dialect properties not passed to Hibernate | xplanner.properties declares hibernate.cache.* (EhCache provider, query and second-level cache on), hibernate.dbcp.* pool settings, hibernate.dialect and hibernate.show_sql, but the AnnotationSessionFactoryBean receives ... | `WEB-INF/classes/xplanner.properties:10-17,57-58,202-218`; `WEB-INF/classes/spring-beans.xml:60-81` | inferred; Hibernate could read a hibernate.properties resource (none in the WAR); dialect auto-detection behavior not observed. |
| A-125 | History records | History rows are written only by start/close iteration, continue (story/task), move story/task, re-estimate and SOAP create/update/delete; updated events are throttled. Web create/update/delete publish Spring events ... | `class com.technoetic.xplanner.history.HistorySupport#saveEvent/#isEventThrottled`; `call-site search for HistorySupport.saveEvent (8 classes)` | inferred; none beyond runtime confirmation. |
| A-126 | Data samples for burn-down charts | DataSamplerImpl saves estimatedHours, actualHours and remainingHours samples per iteration and day (update if exists); optional end-date auto-extension disabled (iteration.automatically.extend.endDate=false). Triggered ... | `class com.technoetic.xplanner.charts.DataSamplerImpl#saveSamples/#saveSample/#extendIterationEndDateIfNeeded`; `WEB-INF/classes/xplanner.properties:314` | confirmed-static |
| A-127 | Object attributes (domain-specific properties) | attribute(targetId,name,value) stores per-object settings; DomainSpecificPropertiesFactory overlays project attributes on global properties (wiki URL, send notification, escape brackets); SOAP exposes generic attribute ... | `class com.technoetic.xplanner.DomainSpecificPropertiesFactory`; `class com.technoetic.xplanner.actions.EditProjectAction#saveOrUpdateAttribute/#populateForm` | confirmed-static |
| A-130 | Property loading and override variants | XPlannerProperties loads classpath xplanner.properties and overlays the file named by system property xplanner.overrides (default xplanner-custom.properties). Seven other variants (apdbuild3, apdbuild6, ... | `class com.technoetic.xplanner.XPlannerProperties$PropertyInitializer#setCustomPropertyOverrides`; `WEB-INF/classes/xplanner-custom-*.properties` | confirmed-static; A -Dxplanner.overrides value in the run helper was not found (CATALINA_OPTS lacks it). |
| A-131 | Mail configuration | xplanner.mail.smtp.host=localhost, port 25, from xplanner@xplannerplus.org; optional xplanner.mail.smtp.user/password (absent) switch on SMTP auth and STARTTLS; project send-notification default true; integration CC ... | `WEB-INF/classes/xplanner.properties:78-87`; `class com.technoetic.xplanner.mail.EmailMessageImpl#<init>` | confirmed-static |
| A-132 | Charts, statistics and UI properties | Burndown and progress charts displayed, velocity not; chart 800x400 including weekends; progress bar html; statistics on; export banner labels; login.instructions.url (override points to project documentation). | `WEB-INF/classes/xplanner.properties:66-73,133,197,271-275`; `WEB-INF/classes/xplanner-custom.properties:49` | confirmed-static; Consumers of several keys not traced individually. |
| A-133 | Other configuration files | log4j-war.xml (console + activity appenders; FILE appender unreferenced); ehcache.xml (no consumer, A-124); spy.properties (p6spy; driver not configured as P6Spy, inert); TableTag.properties (displaytag export types ... | `WEB-INF/classes/log4j-war.xml`; `WEB-INF/classes/spy.properties` | confirmed-static |
| A-140 | Daily missing-time-entry notification job | Spring task:scheduled runs missingTimeEntryNotifier.execute at cron '0 5 0 * * *' (00:05 daily, scheduler pool 10): e-mails acceptors of incomplete tasks in active iterations with no time entry since the shifted date ... | `WEB-INF/classes/spring-beans.xml:295-298,362-367`; `class com.technoetic.xplanner.mail.MissingTimeEntryNotifier#execute/#sendMissingTimeEntryReminderToAcceptors/#sendMissingTimeEntryReportToLeads` | inferred; Runs outside a request; EmailMessageImpl uses ThreadSession.get(), which may be unbound; with duplicate contexts ... |
| A-141 | Quartz data-sampling job defined but not scheduled | JobDetailBean datasamplingJob and CronTriggerBean '0 55 23 ? 1-12 *' are defined, but the SchedulerFactoryBean that would register the trigger is commented out; no other scheduler references the trigger, so nightly ... | `WEB-INF/classes/spring-beans.xml:343-402`; `WEB-INF/classes/xplanner.properties:231-246 (quartz properties, consumer only in the commented bean)` | inert |
| A-142 | Task executor and HSQLDB server | task:executor 'executor' (pool 10) has no consumer found; in-process HSQLDB server starts only for databasetype hsqldb (not the shipped value). | `WEB-INF/classes/spring-beans.xml:363`; `class com.technoetic.xplanner.filters.HsqldbServerContextListener#contextInitialized` | inert |
| A-150 | SMTP e-mail sending | javax.mail MimeMessage with HTML body part and optional file attachments, Transport.send; recipients resolved from Person.email via ObjectRepository (error when missing). Used by task create/update notifications, ... | `class com.technoetic.xplanner.mail.EmailMessageImpl#send/#setRecipient`; `class com.technoetic.xplanner.mail.EmailMessageFactory` | confirmed-static |
| A-151 | Outbound HTTP client | com.technoetic.xplanner.util.HttpClient (java.net.URL) is used by GenericWikiAdapter (topic existence) and EmailFormatterImpl (email stylesheet). | `class com.technoetic.xplanner.util.HttpClient#getPage`; `call-site search: EmailFormatterImpl, GenericWikiAdapter` | confirmed-static |
| A-152 | Optional directory/SSO authentication integrations | JNDI/LDAP authenticator (com.sabre.security.jndi), JAAS adapter and NTLM (jcifs) login modules are packaged and defined as prototype beans but not configured (A-026). | `WEB-INF/classes/spring-security.xml:38-43`; `WEB-INF/classes/com/sabre/security/jndi/*` | inert |
| A-153 | Office/project file formats | MS Project MPX/MSPDI via mpxj, PDF via iText and JasperReports, Excel import via POI HSSF, CSV people import; downloadable import templates files/peopleImportTemplate.xls and files/storiesImportTemplate.xls. | `WEB-INF/lib (mpxj, itext, jasperreports, poi)`; `class com.technoetic.xplanner.export.*` | confirmed-static |
| A-160 | Standalone utilities and commented wiring | Classes with main() not wired into the web app: TomcatUserImporter, BootstrapSystemUser (autopatch task), HsqlServer, tacitknowledge ... | `main() search in disassembly`; `WEB-INF/classes/xplanner.properties:17` | inert |
| A-161 | Client-side scripts and assets | jQuery 1.5.1 + jQuery UI 1.8.11 (sortable reorder), jqote2 templates (dashboard), dojo xd + dojox charting theme, swfobject + flash/Dashboard.swf and expressInstall.swf (no JSP reference found), jscalendar with ... | `war-manifest.tsv (js/, calendar/, flash/, css/, ui/)`; `js/iteration.js` | confirmed-static; Flash dashboard consumer not found (grep for Dashboard.swf/swfobject in JSPs returned none). |
| A-162 | Page inventory | 77 page files: 73 JSP (WEB-INF/jsp common 7, edit 16, import 1, layout 7, security 1, view 28 + view/iteration 3, wap 8; index.jsp; calendar-i18n.jsp), 1 tag file, 3 HTML (dragdrop.html, calendar/cal.html, ... | `jsps.json`; `reviewer-scratch/jsp-index.txt` | confirmed-static; Scenario-level behavior of every JSP fragment is not individually itemized beyond A-050..A-103. |

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [x] The inventory was saved before any filled Stage 1 input was opened.
- [x] The snapshot is retrievable from this report or its durable linked evidence.
- [x] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

PM verified the checkpoint (hashes, clean worktree, writes inside the allowlist, credential scan) before the release; see `pm-phase-b-release.json` in the evidence folder.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- First Phase B access at: `2026-09-25T09:53:05Z` (hash verification only). The reconnaissance was first read at `09:53:32Z`. The workbook was first dumped read-only at `09:54:48Z`, after a failed first attempt at `09:54:32Z` that read nothing. See the access log.
- Filled parity-map revision/hash: `fa0ea118857f541fe7e556d12bd84a379ea32930cf666bdfc288d9ad897e4d76` (read-only dump with the project `exceljs`; hash unchanged afterwards)
- Filled reconnaissance revision/hash: `09183d1142dee6cbc2eafc8ce57858164dc3892379092dccfd3c7d115696cfe4`
- Other Phase B inputs and access order: checklist at `09:57:22Z`, then the pass 001-004 reports and dispositions and the owner decision IDs in the status file; see the access log.

| Comparison ID | Direction | Phase A inventory IDs | Stage 1 row / reconnaissance section | Source-based resolution | Result / finding / blocker |
|---|---|---|---|---|---|
| C-001..C-113 | inventory-to-records | A-001..A-162 (113 items) | rows and sections per item (ledger) | 103 agreements (6 after reviewer correction RC-001..RC-006, 3 with wording differences); 10 Stage 1 omissions | 103 matched; 10 mismatch (F-001..F-005) |
| C-114..C-323 | records-to-source | rows 8-234 (210 rows) | each workbook row | 200 agreements; 10 rows with an unsupported status or an omitted effect | 200 matched; 10 mismatch (F-001..F-005) |
| C-324..C-440 | records-to-source | claims not in Phase A were inspected at source (for example ZIP signs, print layout, social links, date formats, task type labels, AF-01/AF-02) | 117 reconnaissance claims | 107 agreements; 9 incomplete sections; 1 justified exclusion | 107 matched; 9 mismatch; 1 not-applicable (E-001) |
| C-441..C-468 | records-to-source | earlier findings | pass 001-004 F-items and their corrections | all corrections present and supported | 28 matched |

<a id="read-reviewer-corrections-to-phase-a"></a>

### Reviewer Corrections To Phase A

The frozen Phase A snapshot is unchanged. In each case below the source supports the Stage 1 record, and my Phase A statement was wrong or incomplete:

| ID | Phase A item | Correction | Source |
|---|---|---|---|
| RC-001 | A-001, A-007, mechanical counts | `WEB-INF/lib` holds 102 jars, not 103; my count included the directory entry | `ls WEB-INF/lib/*.jar` |
| RC-002 | A-054 | Project attributes are removed with the project: `net.sf.xplanner.domain.Project` maps them as `@ElementCollection` on table `attribute` (row 82 is correct) | class `Project` getter annotations |
| RC-003 | A-044, A-083 | The project role editor saves nothing: `EditRoleAction#beforeObjectCommit(Object, Session, ...)` overrides no `AbstractAction` hook, so its `admin.edit.role` check and role update never run (row 35, AF-02, are correct) | method signatures of `EditRoleAction` and `AbstractAction` |
| RC-004 | A-103, A-133 | `log4j-war.xml` lines are 44-47 (`ACTIVITY_FILE`) and 54-58 (category), not 34-47. I took the numbers from a listing renumbered after comment stripping, which is a CHK-001 error of my own | `WAR:WEB-INF/classes/log4j-war.xml:44-58` |
| RC-005 | A-098, A-099 | SOAP `getCurrentTasksForPerson`/`getPlannedTasksForPerson` filter by read through `#toArray` -> `#selectAccessibleObjects`; only the 5 attribute operations are unchecked (row 218 is correct) | class `com.technoetic.xplanner.soap.XPlanner#toArray` |
| RC-006 | A-111 | `TwikiFormat` escapes HTML by default: it reads `getProperty("xplanner.escape.brackets", "true")`. Raw HTML passes only when a project stores `false` | class `com.technoetic.xplanner.wiki.TwikiFormat#format` |

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `full`: all 210 scenario rows, every reconnaissance section, all earlier findings and their dispositions, and the complete WAR at the reviewed revision
- Previous report and pinned baseline: [`analysis/reviews/stage-02-pass-004.md`](stage-02-pass-004.md) (`671b9bc9...9240`), used only in Phase B
- Changed items and direct dependencies rechecked: the whole baseline (full pass); the BA-001-06 changes (rows 9, 11, 18, 64, 68, 73, 114, 189, 192; reconnaissance sections) are included
- Prior results relied on but not rerun: pass-004 F-001 salted-digest match of the login-page pair against the seed. This reviewer confirmed the text location and the per-bundle distribution but did not recompute the digest, so as not to handle the value (CHK-009)
- Expansion triggers examined: not applicable (full)

<a id="read-comparison-results"></a>

## Comparison Results

The full ledger with expected result, observation, evidence and link for every check is [`comparison-results.json`](evidence/S02-P005/comparison-results.json). Ranges C-001..C-113 (inventory to records), C-114..C-323 (rows 8-234 in order), C-324..C-440 (reconnaissance claims), C-441..C-468 (earlier findings). Every check not listed below is `matched`, with the evidence recorded in the ledger. The non-matched checks are:

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-013 / A-015 Other startup side effects | Stage 1 covers the independently found behavior with correct source support (Recon Spring row; recon Dormant code row ("DAOs found by DaoScanner")) | DaoScanner only prints beans; it registers nothing (F-001) | mismatch | WEB-INF/classes/spring-beans.xml:408-409; class net.sf.xplanner.util.DaoScanner#init; class com.technoetic.xplanner.XPlannerProperties$PropertyInitializer#loadProperties/#setCustomPropertyOverrides | F-001 |
| C-023 / A-028 Remember-me credential cookie | Stage 1 covers the independently found behavior with correct source support (Rows 15, 16; Q3 facts) | cookie lifetime and flags not recorded | mismatch | class com.technoetic.xplanner.security.CredentialCookie#set/#getPassword; class com.technoetic.xplanner.util.CookieSupport#createCookie; class com.technoetic.xplanner.security.filter.FormSecurityFilter#isAuthenticated | F-003 |
| C-057 / A-074 Import people from CSV | Stage 1 covers the independently found behavior with correct source support (Rows 50-53; GAP-012; Q2 facts) | save path dereferences an undefined personDao bean | mismatch | WEB-INF/struts-config.xml:329-330; WEB-INF/action-servlet.xml:359; class com.technoetic.xplanner.actions.ImportPeopleAction#execute | F-001 |
| C-060 / A-077 Aggregate timesheet (HQL built from request values) | Stage 1 covers the independently found behavior with correct source support (Rows 165-167; GAP-007; Q3 facts) | HQL built from selectedPeople not recorded | mismatch | WEB-INF/struts-config.xml:380-384; class com.technoetic.xplanner.actions.ViewAggregateTimesheetAction#doExecute; class com.technoetic.xplanner.db.AggregateTimesheetQuery#getTimesheet | F-002 |
| C-061 / A-078 Iteration dashboard (client-side) | Stage 1 covers the independently found behavior with correct source support (Row 114; Q3 facts) | unescaped ${param.fkey} in script not recorded | mismatch | WEB-INF/struts-config.xml:386; WEB-INF/action-servlet.xml:416-418; WEB-INF/jsp/view/dashboard.jsp:18,131-147 | F-003 |
| C-064 / A-081 Virtual file manager | Stage 1 covers the independently found behavior with correct source support (Row 176) | first listing creates the root directory row | mismatch | WEB-INF/struts-config.xml:401-403; class com.technoetic.xplanner.actions.FileManagerAction#doExecute; class com.technoetic.xplanner.file.FileSystemImpl#getRootDirectory/#createFile/#deleteFile/#createDirectory/#deleteDirectory | F-005 |
| C-070 / A-087 System information page | Stage 1 covers the independently found behavior with correct source support (Row 55) | request parameters and attributes shown on the page are not recorded | mismatch | WEB-INF/struts-config.xml:160-162; class com.technoetic.xplanner.actions.SystemInfoAction#execute; class com.technoetic.xplanner.SystemInfo#getDatabaseInfo/#getSystemProperties | F-003 |
| C-071 / A-088 Unexpected error page content | Stage 1 covers the independently found behavior with correct source support (Row 56) | request parameters, attributes and unescaped message not recorded | mismatch | WEB-INF/jsp/common/unexpectedError.jsp:49-135; WEB-INF/classes/xplanner.properties:289-309 | F-003 |
| C-077 / A-094 Mobile/WAP channel | Stage 1 covers the independently found behavior with correct source support (Rows 232-234; Q2 facts; GAP-014) | Struts-instantiated WAP actions lack their injected authenticator/authorizer | mismatch | WEB-INF/mobile-struts-config.xml:18-51; routes.json (bean none); library class org.springframework.web.struts.DelegatingTilesRequestProcessor#getDelegateAction/#processActionCreate | F-004 |
| C-091 / A-114 Rendering-path writes | Stage 1 covers the independently found behavior with correct source support (Rows 172, 176) | directory rows created on read/first use not recorded | mismatch | class com.technoetic.xplanner.file.FileSystemImpl#getRootDirectory; WEB-INF/tiles-definitions.xml; WEB-INF/tiles-pages.xml | F-005 |
| C-121 / Row 15 (Remember me / Happy path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 15) | cookies are persistent (max-age Integer.MAX_VALUE) without Secure flag; not stated | mismatch | ledger; findings section | F-003 |
| C-154 / Row 50 (Import people from a file / Happy path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 50) | status Yes and "Success" result are unsupported: ImportPeopleAction.personDao is never injected (no personDao bean) | mismatch | ledger; findings section | F-001 |
| C-155 / Row 51 (Import people from a file / Alternative path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 51) | the userId_exists outcome depends on PersonDao.save, which is unreachable for the same reason | mismatch | ledger; findings section | F-001 |
| C-158 / Row 55 (System information page / Happy path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 55) | system-info mode also lists all request parameters and attributes | mismatch | ledger; findings section | F-003 |
| C-159 / Row 56 (Error pages / Alternative path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 56) | error page lists all request parameters and attributes and prints the exception message unescaped | mismatch | ledger; findings section | F-003 |
| C-215 / Row 114 (Iteration task board (dashboard) / Happy path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 114) | ${param.fkey} is written unescaped into the script URL (reflected script injection) | mismatch | ledger; findings section | F-003 |
| C-263 / Row 165 (Aggregate timesheet / Happy path, Yes) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 165) | selectedPeople values are concatenated into the HQL without numeric validation | mismatch | ledger; findings section | F-002 |
| C-273 / Row 176 (File manager (directories) / Alternative path, Partial) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 176) | the first listing creates the root directory row (read request that writes) | mismatch | ledger; findings section | F-005 |
| C-321 / Row 232 (WAP login and browsing / Happy path, Partial) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 232) | WAP login submit dereferences a null authenticator (Struts-created AuthenticationAction) | mismatch | ledger; findings section | F-004 |
| C-323 / Row 234 (WAP login and browsing / Alternative path, Inferred) | row text, status and evidence agree with the WAR (legacy_user_flows.xlsx row 234) | with a projectId the Struts-created DispatchForward dereferences a null authorizer | mismatch | ledger; findings section | F-004 |
| C-341 / Reconnaissance: Source Inventory: dormant and unreferenced code row | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | "DAOs found by DaoScanner" implies discovery; DaoScanner only prints beans; PersonDaoImpl is never a bean | mismatch | ledger; findings section | F-001 |
| C-347 / Reconnaissance: Source Inventory: mobile channel row | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | missing the non-injected dependencies of the Struts-created WAP actions | mismatch | ledger; findings section | F-004 |
| C-359 / Reconnaissance: Runnable Surfaces: mobile WAP users | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | blocked reason omits the null dependencies | mismatch | ledger; findings section | F-004 |
| C-387 / Reconnaissance: Build, Run, And Test Evidence: author tool runs and scratch outputs | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | process record of the author; outputs under .migration-tmp/stage-01 are withheld from this reviewer by the packet | not-applicable | ledger; findings section | E-001 |
| C-394 / Reconnaissance: GAP-007 (security facts) | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | omits the aggregate-timesheet HQL concatenation and the behaviors of F-003 | mismatch | ledger; findings section | F-002, F-003 |
| C-399 / Reconnaissance: GAP-012 (people import format) | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | the import cannot save any person at all (F-001), beyond the format question | mismatch | ledger; findings section | F-001 |
| C-401 / Reconnaissance: GAP-014 | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | WAP effects omit the non-injected dependencies | mismatch | ledger; findings section | F-004 |
| C-419 / Reconnaissance: Q2 facts: mobile WAP pages | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | omits the non-injected authenticator/authorizer | mismatch | ledger; findings section | F-004 |
| C-432 / Reconnaissance: Q2 facts: completeness for broken surfaces | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | the broken people import is not listed | mismatch | ledger; findings section | F-001 |
| C-434 / Reconnaissance: Q3 facts: completeness | claim is supported by the WAR (analysis/legacy_reconnaissance.md) | missing: aggregate-timesheet HQL concatenation (F-002); reflected fkey, error-page parameter echo, persistent credential cookies (F-003) | mismatch | ledger; findings section | F-002, F-003 |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 468 | 438 | 29 | 0 | 1 |

Findings: 5 (F-001..F-005: 2 medium, 3 low). Blockers: 0. Justified exclusions: 1 (E-001). Phase A inventory items: 113; that is a separate count from the 468 comparison checks.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Independently discovered behavior to parity-map verdict (Stage 2).**

| Discovered behavior (A-ID) | Workbook rows / sections | Verdict |
|---|---|---|
| Channels, filters, listeners, startup work (A-010..A-016) | recon Source Inventory; rows 17, 20, 56-57, 64-67, 72 | matched; DaoScanner wording under F-001 |
| Authentication and credential locations (A-020..A-030) | rows 8-21; Q3 facts | matched; cookie lifetime missing (F-003) |
| Roles, permission engine, enforcement (A-040..A-046) | rows 23-35; enforcement table | matched (RC-003) |
| Projects, iterations, stories, tasks, time (A-050..A-068) | rows 75-161 | matched; dashboard escaping missing (F-003) |
| Notes, files, people, imports, timesheets (A-069..A-081) | rows 37-53, 115-119, 162-176 | F-001 (people import), F-002 (aggregate timesheet), F-005 (file manager); others matched |
| Integration, history, settings, roles, search, export (A-079..A-085) | rows 35, 59-60, 178-187, 196-198, 208-213 | matched |
| Platform, admin/test, error pages (A-086..A-093) | rows 55-63; GAP-003 | error-page parameter echo missing (F-003); others matched |
| WAP, Spring MVC, REST, SOAP, iCal, charts, public files (A-094..A-103) | rows 18, 60, 73, 188, 215-234 | WAP dependencies missing (F-004); others matched (RC-004, RC-005) |
| Rendering, persistence, configuration, jobs, integrations, dormant code, assets (A-110..A-162) | rows 21, 47, 66-68, 80, 94, 109-112, 138, 172, 186-189, 200-206; recon sections | matched (RC-002, RC-006); read-path writes missing (F-005) |

For all five findings the return stage is **1** (map defects).

<a id="read-earlier-findings-resolution"></a>

### Earlier Findings Resolution

Each correction was checked against the source, not against the disposition text.

| Pass / finding | Correction location | Source re-check in this pass | Classification |
|---|---|---|---|
| 001 F-001 server-side enforcement missing | rows 29-30, enforcement table, GAP-007 | generic actions use `CommonDao` only; secure repository consumed only by `IntegrationEmailNotifier` | resolved (C-441) |
| 001 F-002 history overstated | row 187 | 8 `HistorySupport#saveEvent` call sites; no event listener registered | resolved (C-442) |
| 001 F-003 date formats per locale | rows 69-71 | `format.date`/`format.datetime` in all 10 bundles; es date-time `dd-MM-yyyy HH:MM` | resolved (C-443) |
| 001 F-004 mobile role constraints | rows 32, 233 | `SecurityConfiguration#isAuthorized` has no caller | resolved (C-444) |
| 001 F-005 dormant code | recon dormant-code row | `NullSecurityFilter` commented; launchers with `main` only | resolved (C-445); the DaoScanner wording in the same row belongs to F-001 |
| 001 F-006 e-mail stylesheet fetch | row 202 | `EmailFormatterImpl` fetches `/css/email.css` through `HttpClient` | resolved (C-446) |
| 001 F-007 search/aggregate filtering | rows 167, 180 | read filters in `SearchResultAuthorizationPredicate`, `AggregateTimesheetQuery` | resolved (C-447) |
| 001 F-008 attachment storage | row 172 | BLOB via `Hibernate.createBlob`; `db-changelog.xml:234` LONGBLOB | resolved (C-448) |
| 002 F-001 validation rules | rows 89, 152-160 | all `TimeEditorForm` keys; bundle presence per key recomputed | resolved (C-449) |
| 002 F-002 delete cascades | rows 49, 82, 91, 126, 142, 174 | cascade annotations incl. `@ElementCollection`; FKs `db-changelog.xml:258-267` | resolved (C-450) |
| 002 F-003 Facebook widget | row 193 | `viewLayout.jsp:92-95` inside an HTML comment | resolved (C-451) |
| 002 F-004 attachment count | row 171 | `Note#getAttachmentCount`; label per bundle | resolved (C-452) |
| 002 F-005 login/start branches | rows 14, 98 | `AuthenticationAction#execute` first branch on `action` | resolved (C-453) |
| 002 F-006 hidden-project decorator | row 76 | decorator not passed to the table | resolved (C-454) |
| 002 F-007 sysadmin grant rule | rows 31, 34 | `modifyRoles` bytecode: project-0 check, delete, then `setSysadmin` on flag | resolved (C-455) |
| 002 F-008 story import errors/cookies | rows 117, 119 | exception table of `ImportStoriesAction#execute`; `#setCookies` | resolved (C-456) |
| 002 F-009 task type labels | row 135 | `task.type.overhead` present in default, `--`, de, it, ja, ru | resolved (C-457) |
| 002 F-010 superseded figures | recon figures | 210/113/77/19/1, 87 routes, 73 JSPs, 102 jars, 47 forwards recomputed | resolved (C-458) |
| 003 F-001 unmapped query paths | rows 211, 213, 220, 221, 228 | `task.story` in iCal and report data sources; `object.` alias; `a.targetId` | resolved (C-459) |
| 003 F-002 second Spring context | row 65 | `struts-config.xml:438-441` loads `spring-beans.xml` again | resolved (C-460) |
| 003 F-003 validation keys | rows 52, 124, 132, 147 | merge branches of the three forms; `ImportForm#validate` | resolved (C-461) |
| 003 F-004 progress chart | row 110 | `iterationStatistics.jsp:155-191`; flag `xplanner.properties:67` | resolved (C-462) |
| 004 F-001 login-page credential | rows 9, 11, 64; GAP-007; Q3 | `login.jsp:34-39`; key only in default, `--`, de; default text line 784 carries the credential sentence (value not reproduced) | resolved (C-463); digest match relied on, not recomputed |
| 004 F-002 task-board parameter | row 114 | `LinkTag` adds `fkey`; `dashboard.jsp:101-103,131-132` | resolved (C-464); the escaping gap is new (F-003) |
| 004 F-003 Hibernate settings | row 68; configuration row; P-01 | `spring-beans.xml:77-81` has no hibernateProperties | resolved (C-465) |
| 004 F-004 print layout | row 192; Tiles row | `ContentTag` -> `PrintLinkTag#isInPrintMode` -> `tiles:print` | resolved (C-466) |
| 004 F-005 unauthenticated exposure | rows 18, 73; GAP-007/013 | `log4j-war.xml:44-58`; `index.jsp:7-31`; no filter on web root | resolved (C-467) |
| 004 F-006 outbound wiki request | row 189 | `GenericWikiAdapter#isTopicExisting` via `HttpClient`/URL | resolved (C-468) |

None of the 28 earlier findings is partially resolved or unresolved.

<a id="read-findings"></a>

## Findings

<a id="read-f-001-people-import-cannot-save-the-persondao-bean-is-undefined"></a>

### F-001 - People import cannot save: the personDao bean is undefined

- Severity: medium
- Comparison check IDs: C-013, C-057, C-154, C-155, C-341, C-399, C-432
- **Checklist link:** CHK-003 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-003: an injected dependency must be non-null on the entry path)
- **Checklist discrepancy:** the BA-001-04 and BA-001-06 self-checks record CHK-003 as applied to every row that attributes an effect or injected dependency. Row 50 attributes the save to `PersonDao.save` without checking that the dependency is injected. This is a claimed pass that lacks evidence.
- **Required recheck:** CHK-003 on rows 50-53 and on every action property wired by name. Expected: each injected property of every action bean has a bean of that name (or type) in a context that wires the action. Otherwise the row states the expected failure.
- Expected and source:
  - `WAR:WEB-INF/action-servlet.xml:2` sets `default-autowire="byName"`. The bean `/import/people` (`:359`) has no properties.
  - `ImportPeopleAction#setPersonDao(PersonDao)` carries no annotation.
  - No Spring file defines a bean named `personDao`: `spring-dao.xml` defines `commonDao`, `taskDao`, `userStoryDao`, `projectDao`, `viewDao`, `dataSampleDao`, `settingDao`, `objectTypeDao`, `attributeDao` (positive control: `taskDao` at `spring-dao.xml:21`). `PersonDaoImpl` has no stereotype annotation, and no component scan covers `net.sf.xplanner.dao`.
  - `ImportPeopleAction#execute` runs `ImportPeopleAction$1#run`, which calls `personDao.save` for each accepted line. The field is null, so the first valid line is expected to fail with a null reference that the handlers do not catch (they catch `DuplicateUserIdException`, the local import exception and `AuthorizationException`).
  - `DaoScanner#init` only prints the DAO beans that exist (`System.out.println`); it registers none.
- Observed difference:
  - Row 50 (`Yes`) promises a results table with status "Success".
  - Row 51 (`Yes`) lists the `userId_exists` outcome, which only `PersonDao.save` can raise.
  - The reconnaissance calls DAOs "found by `DaoScanner`" (dormant-code row). GAP-012 and the Q2 facts treat only the template format as uncertain.
  - The line-format checks (`wrong_entry_format`, `empty_userId`) run before the save and remain reachable.
- Evidence: the descriptor lines and class symbols above; reviewer grep of all WAR XML for `personDao`/`PersonDaoImpl` (0 hits, control found `taskDao`).
- Requirement impact: UF-003 people management. A `Yes` row describes a result the baseline is expected not to produce, so the Stage 3 walkthrough plan and the Q2 parity decision need the fact.
- Required action:
  - Correct rows 50-51 (status and expected result, runtime unverified).
  - Add the fact to the Q2 facts and GAP-012.
  - Correct the DaoScanner wording in the dormant-code row.
  - Sweep all name-wired action properties for missing beans (CHK-003).
- Return stage: 1

<a id="read-f-002-aggregate-timesheet-builds-hql-from-posted-person-ids"></a>

### F-002 - Aggregate timesheet builds HQL from posted person ids

- Severity: medium
- Comparison check IDs: C-060, C-263, C-394, C-434
- **Checklist link:** none: new finding (P-2 below proposes a check)
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  - `AggregateTimesheetForm#setSelectedPeople(String[])` receives the posted person ids. `AggregateTimesheetForm#validate` checks only the dates.
  - `AggregateTimesheetQuery#getTimesheet` appends every `personIds` element unchanged into `"AND person.id IN (" ... ")"` and substitutes it for the placeholder `AND 1=1` of the HQL. It then runs `Session.iterate`, with parameters bound only for the two dates (bytecode listing).
  - The read-permission filter applies to the resulting rows only.
  - The mapping is `/do/view/aggregateTimesheet` (`WAR:WEB-INF/struts-config.xml:380-384`) for any signed-in user.
- Observed difference:
  - Rows 165 and 167 describe the selection and the read filter but not that the ids are concatenated into the query.
  - GAP-007 and the Q3 facts list the similar `task.jsp` concatenation (`WAR:WEB-INF/jsp/view/task.jsp:101-103`, verified) but not this one.
- Evidence: the class symbols above; `aggregateTimesheet.jsp` form.
- Requirement impact: Q3 security facts under Principle XI; Stage 3 and Stage 9 security discovery. Exploitability is not established (static only, `Inferred`).
- Required action: record the concatenation in row 165 (or a new alternative-path row) and add it to GAP-007 and the Q3 facts, without claiming exploitability.
- Return stage: 1

<a id="read-f-003-three-insecure-behaviors-are-missing-from-rows-and-security-facts"></a>

### F-003 - Three insecure behaviors are missing from rows and security facts

- Severity: low
- Comparison check IDs: C-023, C-061, C-070, C-071, C-121, C-158, C-159, C-215, C-394, C-434
- **Checklist link:** none: new finding (P-2 below)
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  1. **Task board.** `WAR:WEB-INF/jsp/view/dashboard.jsp:132` writes `${param.fkey}` into a JavaScript string with EL, which is enabled under the Servlet 2.4 descriptor, and nothing escapes it. The request value is therefore reflected into the script.
  2. **Error and system-information pages.** `WAR:WEB-INF/jsp/common/unexpectedError.jsp:66` prints the exception message with `<%= message %>`, unescaped. Lines 100-121 then list the request URL and query string, all request parameters (`request.getParameterMap()`) and all request attributes. These sections are rendered in system-information mode too (`/do/systemInfo`), and for every error on any path, because the page is the container error page for every `Throwable` (`WAR:WEB-INF/web.xml:16-29`). Any parameter of the failing request, such as a password field, is displayed.
  3. **Remember-me cookies.** `CookieSupport#createCookie` sets max-age `2147483647` (about 68 years) and neither `setSecure` nor a path. The `password` cookie holds the Base64 of the clear password (`CredentialCookie#set`).
- Observed difference:
  - Row 114 describes the board without the reflected parameter.
  - Rows 55-56 list build, database and stack information but not the request parameters, attributes or the unescaped message.
  - Row 15 says only that the cookies are set with Base64 values.
  - None of the three is in GAP-007 or the Q3 facts.
- Evidence: the lines and symbols above.
- Requirement impact: Q3 security facts; Stage 3 checks; Stage 9 NFRs (session and credential handling, error handling).
- Required action: add each fact to its row (114, 55-56, 15) and to GAP-007 and the Q3 facts, as observed legacy behavior (Q3 deferred).
- Return stage: 1

<a id="read-f-004-wap-actions-run-without-their-injected-dependencies"></a>

### F-004 - WAP actions run without their injected dependencies

- Severity: low
- Comparison check IDs: C-077, C-321, C-323, C-347, C-359, C-401, C-419
- **Checklist link:** CHK-003 (row CHK-003: hook or injected dependency must be non-null)
- **Checklist discrepancy:** row 234 already depends on the Spring fallback to the Struts `type` (and cites it as framework behavior). It does not follow the consequence that Spring then injects nothing, so the CHK-003 dependency check is incomplete.
- **Required recheck:** CHK-003 on rows 232-234 and on every mapping that has no Spring bean. Expected: each such action states which dependencies stay null and the resulting outcome.
- Expected and source:
  - The seven mappings in `WAR:WEB-INF/mobile-struts-config.xml:20-49` have no bean in `action-servlet.xml`.
  - `org.springframework.web.struts.DelegatingTilesRequestProcessor#processActionCreate` falls back to the Struts-created instance when `getDelegateAction` finds no bean (`containsBean` false; reviewer disassembly of `spring-struts-3.0.5.RELEASE.jar`).
  - `AuthenticationAction` receives its `Authenticator` only through `#setAuthenticator`, and `DispatchForward` receives its `Authorizer` only through `#setAuthorizer`. Both stay null.
  - Submitting `/do/mobile/login` (non-empty `action`) is therefore expected to fail on `authenticator.authenticate`. A WAP view that carries a non-zero `projectId` is expected to fail on `authorizer.hasPermission`. The not-authorized forward of row 234 remains the outcome without `projectId`.
- Observed difference: row 232 describes WAP login and browsing as working, apart from the hard-coded `/xplanner` links. Row 234, GAP-014, the Q2 facts, the mobile channel row and the Runnable Surfaces row do not record the null dependencies.
- Evidence: the descriptor lines and class symbols above.
- Requirement impact: UF-018 WAP; the Q2 parity decision for a surface that is broken in more ways than recorded.
- Required action: correct rows 232 and 234 and the listed sections (runtime unverified, `Inferred`).
- Return stage: 1

<a id="read-f-005-directory-rows-are-created-on-read-and-first-use"></a>

### F-005 - Directory rows are created on read and first use

- Severity: low
- Comparison check IDs: C-064, C-091, C-273
- **Checklist link:** CHK-003 (row CHK-003: persistence side effects attributed to an entry point)
- **Checklist discrepancy:** the author's CHK-003 sweeps (BA-001-06) covered outbound calls and rendering parameters, not persistence writes on read paths. This is a failed result for the persistence part of the check.
- **Required recheck:** CHK-003 over read entry points that call repository or file-system methods that save.
- Expected and source:
  - `FileSystemImpl#getRootDirectory` saves, flushes and refreshes a new root `Directory` when none exists.
  - `FileSystemImpl#getDirectory(String)` calls `#createDirectory` for each missing path segment (bytecode listing).
  - `FileManagerAction#doExecute` calls `getRootDirectory` for the default `list` action, so the first `GET /do/view/directory` writes a row.
  - `EditNoteAction#populateObject` calls `getDirectory("/attachments/project/<id>")`, which creates the directories on the first attachment for a project.
- Observed difference: rows 172 and 176 describe storage and the operations, but not these writes on a listing request or on first use.
- Evidence: the class symbols above.
- Requirement impact: UF-010 data effects (Constitution Principle IX concerns data mutation on read; recorded as legacy fact only).
- Required action: add the effect to row 176 (and row 172 for attachment directories), marked `Inferred`.
- Return stage: 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | `sha256sum` of `packet.json` and `routing-extract.json` | pass (exit 0; both match) | access log |
| Worktree revision and state | `git rev-parse HEAD`; `git status --short` in the worktree (ACK, checkpoint, Phase B start and end) | pass: `7c2f5619...` and empty output each time | access log |
| Legacy hashes | `sha256sum` of the four [`legacy/`](../../legacy) files before and after | pass: unchanged | access log |
| Phase B input hashes | `sha256sum`, and `git show 7c2f561:<path>` piped to `sha256sum` in the worktree for passes 001-003 and the bootstrap report | pass: all pinned values match | access log |
| Workbook audit | `npm --prefix analysis/tools run audit:workbook` (temp redirected) | pass (exit 0): `WORKBOOK AUDIT OK`, 210 scenarios, 18 epics | scratch output `audit-workbook.txt` |
| Link audit | `npm --prefix analysis/tools run audit:artifact-links` | pass (exit 0): 211 documents | scratch output `audit-links.txt` |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <this report>` | pass (exit 0): no errors | scratch output |
| Citation check (CHK-001) | [`tools/citecheck.js`](evidence/S02-P005/tools/citecheck.js) over rows and reconnaissance | pass: 410 line and 235 symbol citations; 4 heuristic flags reviewed by hand as correct | [`citecheck-results.json`](evidence/S02-P005/citecheck-results.json) |
| Bundle check (CHK-004) | [`tools/bundlecheck.js`](evidence/S02-P005/tools/bundlecheck.js) and per-bundle greps | pass: 21 rows agree | [`bundlecheck-results.txt`](evidence/S02-P005/bundlecheck-results.txt) |
| Credential scan (CHK-009) | [`tools/credscan-b.js`](evidence/S02-P005/tools/credscan-b.js), [`tools/credper.js`](evidence/S02-P005/tools/credper.js) and [`tools/credctx.js`](evidence/S02-P005/tools/credctx.js) over all new evidence and this report | pass: 0 disclosures (see Reviewer Self-Check) | access log |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-387 | The author's tool runs and scratch outputs under `.migration-tmp/stage-01/**` are process records, not legacy behavior. The packet forbids the reviewer to read them. Every legacy fact they support was checked from the source in its own C-item. | PM packet `S02-P005` boundary ("resolve from the legacy source") | [`packet.json`](evidence/S02-P005/packet.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-005 | this report; [`comparison-results.json`](evidence/S02-P005/comparison-results.json) | pending | pending (Stage 1 re-entry) | pending (next fresh pass) |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-001, F-004 and F-005 are failed CHK-003 results (non-null injected dependency; persistence effect of an entry point). The required rechecks are stated in each finding. F-002 and F-003 are new findings without a checklist link. CHK-001, CHK-002 and CHK-004..CHK-011 passed in this pass.

The result is **`findings`**:
- The complete declared scope was checked: 0 not-checked items and 0 blockers.
- 29 checks are mismatches, linked to five actionable findings, of which two are medium.
- The single not-applicable item is justified by the packet boundary.

All findings are defects of the Stage 1 map, so the process returns to **Stage 1** (return and correction protocol; F-001..F-005). Unresolved blocked scope is zero. The next gate is a Stage 1 re-entry with per-finding dispositions, followed by a new fresh blind Stage 2 pass with a new number. This pass cannot close Stage 2 and does not permit Stage 3.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). This section is Phase B only. The checklist was first opened at `2026-09-25T09:57:22Z`, after the Phase A snapshot.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `7a5683a8e0411f7d748ffc873fae2ec590ce0138a77a313fb92df4837553694d` (CHK-001..CHK-011)
- Author self-check record/version: reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention), BA-001-06 (checklist `0c2350b2...`, CHK-001..CHK-009 applicable at that time) and [`stage-02-pass-004-dispositions.md`](../stages/stage-01/stage-02-pass-004-dispositions.md)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; all cited lines in rows and reconnaissance | 0 failures (BA-001-06 `chk001` script) | passed: 410 line and 235 symbol citations resolve; flagged items correct (C-114..C-440) | none |
| CHK-002; every permission condition | rows state server-side status (BA-001-04 sweep) | passed: rows 17-35, 38, 41-50, 59, 76-97, 115-176, 196, 218-234 agree with the source traces | none |
| CHK-003; effects, hooks, injected dependencies, rendering and configuration | consumers, link parameters, rendering effects swept (BA-001-06) | failed: null `personDao` (F-001); null WAP authenticator/authorizer (F-004); read-path directory writes (F-005) | F-001, F-004, F-005; rechecks stated there |
| CHK-004; locale-dependent rows | public-page texts in all bundles (BA-001-06) | passed: 21 rows recomputed; date formats in 10 bundles | none |
| CHK-005; form validation keys | 17 validators, 47 keys, 0 uncovered (BA-001-05) | passed: keys of 16 validating forms matched to rows 44, 52, 79, 89, 96, 104, 116, 123-124, 131-132, 137, 146-147, 152-160, 163, 166, 170, 194 | none |
| CHK-006; delete scenarios | cascades recorded (BA-001-04) | passed: rows 49, 82, 91, 126, 142, 174, 176, 221 agree with annotations and FKs (RC-002 confirms row 82) | none |
| CHK-007; figures after correction | figures regenerated (BA-001-06) | passed: 210/113/77/19/1, 18 epics, 87 routes, 68 of 73 JSPs, 102 jars, 47 forwards, 521 top-level classes, 58/5/13/14/3 beans | none |
| CHK-008; query property paths | 105 sources, 387 paths (BA-001-05) | passed: flagged defects confirmed; no further unmapped path found in the queries this reviewer read | none |
| CHK-009; no credential values | 0 hits (BA-001-06 `chk009` script) | passed: the reviewer scan of the reconnaissance and all 210 row texts shows no distinctive value and no login-pair form; only common words that equal configured values (product name, role name, `root`) occur as ordinary words | none |
| CHK-010; link targets with added parameters | `LinkTag` parameters traced (BA-001-06) | passed: row 114 fkey path and row 234 plain WAP links confirmed | none |
| CHK-011; unauthenticated surfaces | mechanical list (BA-001-06) | passed: `/rest/*`, `/servlet/AxisServlet`, `/cewolf/*`, `index.jsp`, web-root files and log match Phase A A-024 | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 005, full scope; the result version is this report and the evidence files hashed in RESULT; checklist `7a5683a8...694d`.
  - **CHK-001: failed once in my own Phase A, then corrected here.** A-103 and A-133 cite `log4j-war.xml:34-47`, taken from a comment-stripped, renumbered listing (RC-004). All line citations in this report were checked against per-file numbered reads before handoff.
  - **CHK-009: passed.** The scan extracts candidate values from the source locations at run time and prints only counts. It found 0 distinctive values and 0 login-pair forms in the new evidence and this report. Three configured values are common words (the product and database name, a role name and `root`); they occur only as ordinary words, and each credential-context match was reviewed with the value masked.
  - **CHK-003 and CHK-008:** applied to my own claims through RC-003, RC-005 and RC-006.
  - **CHK-002, CHK-004..CHK-007, CHK-010, CHK-011:** applied as listed in the Checklist Review.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-003, from F-001 and F-004):** for every framework-wired handler, list each injected property. Confirm that a bean of that name or type exists in a context that wires the handler. For mappings without a bean, record that the framework creates the instance without injection. Expected: every dependency the behavior needs is proven present, otherwise the row states the failure. This refines the existing "non-null dependency" clause; it is not a new ID.
  - **P-2 (new check, from F-002 and F-003):** trace request-derived values to their sinks. For each request parameter read by an action, JSP, tag or query helper, record whether it is concatenated into HQL/SQL, written unescaped into HTML or script, echoed on error or diagnostic pages, or stored in a cookie, and with which lifetime and flags. Expected: every such sink is in the row and in the security facts. CHK-011 (unauthenticated surfaces) and CHK-002 (permissions) do not cover it.
  - **F-005:** covered by CHK-003 (persistence side effects per entry point); no new check. The self-detected CHK-001 error is covered by CHK-001.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| none | not applicable | not applicable | not applicable | Stage 2 has no graph scope |

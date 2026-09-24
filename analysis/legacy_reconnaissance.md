# Legacy Reconnaissance Record

**What did we discover in the legacy source, what is proven, and what remains unknown?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable process guidance from the starter. It explains how to use this artifact; it is not part of the project result recorded below.

- **Created by:** The initializer creates an empty record; the Stage 1 reconnaissance agent writes the findings.
- **Maintained / decided by:** The reconnaissance agent updates the inventory when discovery or an authorized return changes its scope.
- **Governing instructions:** Bootstrap and Stage 1
- **When used:** The primary agent fills it at Stage 1 while inspecting the legacy source and runtime boundary. Stages 2 and 3 use it to detect missed territory.
- **How used:** A structured inventory of the legacy territory: components, channels, technologies, entry points, data stores, integrations, runtime clues and inspection gaps. It explains what was examined and where evidence came from; detailed user behavior belongs in the parity map instead.
- **Example:** The record lists the login module, LDAP dependency, nightly job and the environment needed to run each one.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_AUTHORING_NOTES_START -->
<details>
<summary><strong>Template and status notes</strong></summary>

> **Reading statuses:** Unknown or unverified (not established by source evidence) must stay separate from observed or confirmed scope. An inventory entry is not proof that the corresponding behavior was exercised live. [Status meanings](https://github.com/olsys-ltd/legacy-modernization-starter/blob/main/analysis/artifact-status-meanings.md).

> **Template output:** [`analysis/legacy_reconnaissance.md`](./legacy_reconnaissance.md). Preserve this filename stem;
> replace only the uppercase placeholders. See the artifact naming guide.

</details>
<!-- ARTIFACT_AUTHORING_NOTES_END -->

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Stage 1 re-entry draft (BA-001-05, after Stage 2 pass 003 `findings`): corrected static analysis of the fixed baseline package, not yet independently re-verified**
>
> The whole WAR was enumerated (964 files). Stage 2 pass 003 returned 4 findings. All 4 were confirmed against the source and accepted, and F-001 and F-002 were extended by the sweeps. The main corrections are these:
> - The iCal feed (row 226) and SOAP `getCurrentIteration` query property paths that the mapped entities do not have. The query sweep found two more such defects: SOAP `deleteAttribute` and the jrpdf report data sources.
> - `spring-beans.xml` is loaded by two Spring contexts. The daily reminder job and Liquibase are therefore expected to run twice (row 65, `Inferred`).
> - Three form validation keys are now covered.
> - The default-on progress chart is recorded.
>
> The parity map now holds 208 scenario rows in 18 epics: 112 `Yes`, 75 `Inferred`, 20 `Partial` and 1 `No`. BA-001-05 added 6 rows, changed the content of 16 and renumbered references in 8. Dispositions are in [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](./stages/stage-01/stage-02-pass-003-dispositions.md); the pass-001 and pass-002 records stay unchanged as history. All rows are static-only. The package is the project's fixed baseline, not an unmodified original; 31 rows carry per-conclusion provenance notes (GAP-005, Q1 decided). Fourteen gaps are recorded (GAP-001..GAP-014). Q2-Q4 are deferred to Stages 4 and 9. Insecure or broken legacy behavior (GAP-007, Q2 facts) is not permission to carry it into the new application.
>
> **Next:** PM verifies RESULT BA-001-05, integrates status and launches a new fresh blind Stage 2 pass. The corrections are not yet independently verified. Decisions and open questions are in [Owner Decisions And Open Questions](#read-owner-decisions-and-open-questions).
>
> **Details:** [Source Inventory](#read-source-inventory) / [Known Gaps And Blockers](#read-known-gaps-and-blockers).

<details>
<summary><strong>Contents</strong></summary>

- [Scope And Provenance](#read-scope-and-provenance)
- [Source Inventory](#read-source-inventory)
- [Runnable Surfaces](#read-runnable-surfaces)
- [Data And Integrations](#read-data-and-integrations)
- [Build, Run, And Test Evidence](#read-build-run-and-test-evidence)
- [Known Gaps And Blockers](#read-known-gaps-and-blockers)
- [Owner Decisions And Open Questions](#read-owner-decisions-and-open-questions)
- [Parity-Map Boundary](#read-parity-map-boundary)
- [Return Correction Evidence (Conditional)](#read-return-correction-evidence-conditional)
- [Stage 1 Exit Checklist](#read-stage-1-exit-checklist)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

> Project artifact: replace every placeholder before Stage 1 can be considered
> complete. Record observations and evidence; do not turn assumptions into
> requirements.

<a id="read-scope-and-provenance"></a>

## Scope And Provenance

- Project: XPlanner 2 Revision 1 (`xplanner2-revision1`), owner `ekzarov`.
- Legacy source location: [`legacy/`](../legacy). It holds [`legacy/xplanner-plus.war`](../legacy/xplanner-plus.war) (the analysed package), [`legacy/README.md`](../legacy/README.md), [`legacy/docker-compose.yml`](../legacy/docker-compose.yml) and [`legacy/demo-seed.sql`](../legacy/demo-seed.sql).
- Upstream repository or delivery: **this project's fixed baseline version, not an unmodified original delivery.** It is derived from the XPlanner+ v1.1a4 WAR distribution (SourceForge project `xplanner-plus`) and carries an earlier experiment's MySQL patch.
  - The owner decided on 2026-09-24 that no original unpatched WAR will be supplied (decision `legacy-baseline-provenance:xplanner2-revision1`; see [Owner Decisions And Open Questions](#read-owner-decisions-and-open-questions)).
  - Every conclusion in this record and in the parity map describes the behavior of this baseline package. None of them is a claim about upstream XPlanner+.
  - **Known patch:** the MySQL database configuration. It is documented in [`legacy/README.md`](../legacy/README.md) lines 10-12 and [`legacy/docker-compose.yml`](../legacy/docker-compose.yml) line 36, which are hints only. It is visible in `WAR:WEB-INF/classes/xplanner.properties:9-17`, `WAR:WEB-INF/classes/xplanner-custom.properties:18-24` and `WAR:WEB-INF/classes/spring-beans.xml:65-68`.
  - **Physical sign of rewriting:** exactly 3 of 1090 ZIP entries (`spring-beans.xml`, `xplanner-custom.properties`, `xplanner.properties`) have "version needed to extract" 2.0. All other entries have 1.0, and their timestamps were preserved (`.migration-tmp/stage-01/tools/zipmeta.js`, output `out/zipmeta.json`).
  - **Other content is not guaranteed unmodified.** The absence of a metadata sign on the other 1087 entries is not proof of originality. Per-conclusion impacts are listed under GAP-005.
  - The package was exported by the owner's preparation as recorded in `PREPARATION.md`, which is a navigation hint only. No upstream Java source was supplied; constitution amendment A1 applies.
- Upstream revision, tag, or checksum:
  - `WEB-INF/classes/xplanner.properties` reports `xplanner.version=1.1a4`, `xplanner.build.date=04/12/2011` and `xplanner.build.revision=426`.
  - `META-INF/maven/net.sf/xplanner-plus/pom.properties` reports version `1.1`, generated 2011-12-04.
  - `META-INF/MANIFEST.MF` records Build-Jdk 1.6.0_29.
  - All 594 class files are class-file version 50.0 (Java 6).
  - Project source revision: `main` at `1e12347bb84f1f87a21005d340e0f75353d80b52`. Legacy Git tree: `3bd350fa5559ce56d2ea6f5136a62197754d4dca`.
  - SHA-256 of the legacy files, verified before and after the work:

    | File | SHA-256 |
    |---|---|
    | `README.md` | `78b1a6b4c0e9fda7ec173f279a20d7b90645eb457c325483e6f1c876ac6e5460` |
    | `demo-seed.sql` | `2d32f7d5c6086c21f0df00f7e110a9a10bd259e8c2a9333cc1eb946033c3387e` |
    | `docker-compose.yml` | `e15cd9db799e6d20b199021fae832b7a9a450695395361dbc1bdab9d0969e9ff` |
    | `xplanner-plus.war` | `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc` |

- Snapshot date: WAR entry timestamps run from 2011-11-20 to 2011-12-04. The analysis was performed on 2026-09-23. The bounded correction BA-001-02 and the re-entry corrections BA-001-03, BA-001-04 and BA-001-05 were made on 2026-09-24.
- Analyst: Business Analyst (role `ba`, mode `author`), tasks **BA-001-01** (first pass), **BA-001-02** (bounded correction applying the owner's Q1 decision), **BA-001-03** (Stage 1 re-entry after [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md)) **BA-001-04** (Stage 1 re-entry after [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md)) and **BA-001-05** (Stage 1 re-entry after [`analysis/reviews/stage-02-pass-003.md`](./reviews/stage-02-pass-003.md)), all assigned by PM (task PM-001, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`).
  - Actual identity: subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, model `claude-opus-5-5`.
  - Loaded skill: `.agents/skills/migration-ba/SKILL.md`, git blob `b97db7a6881a199d9c981e375c2518b248877f78`.
  - Governing inputs: the constitution 1.0.0 with amendments A1-A3, the Stage 1 methodology section, and [`analysis/legacy_user_flows_template_instructions.md`](./legacy_user_flows_template_instructions.md).
  - This context authored Stage 1 records and is therefore not eligible for Stage 2 review.
- Explicit exclusions:
  - No legacy runtime, container, database or network access (the Stage 1 grant excludes them; Stage 3 has a separate grant).
  - No stack selection and no target code.
  - Documentation is navigation only, never evidence of behavior: [`legacy/README.md`](../legacy/README.md), `PREPARATION.md` and the WAR's `META-INF/releaseNotes.txt`.
  - Under amendment A2, examples of an earlier migration in the process documents were not opened or used.
  - [`legacy/demo-seed.sql`](../legacy/demo-seed.sql) was read only far enough to classify it. It is a prepared demo fixture, and its SQL comments narrate an earlier migration's Stage 2/3 events, so it is excluded as evidence (GAP-006).
  - The runtime log `xplanner-plus-activity.log` at the WAR root comes from the original build environment. It is excluded as evidence (GAP-013).

**Evidence notation and status legend.**

- `WAR:<path>` means a path inside [`legacy/xplanner-plus.war`](../legacy/xplanner-plus.war). The WAR was extracted read-only into `.migration-tmp/stage-01/war/`, which is scratch space and not evidence by itself.
- Line numbers are cited only for shipped text files.
- Compiled classes are cited by `class#method` and constant-pool strings, never by derived line numbers.
- The parity-map column `Source implemented?` uses four values:
  - `Yes`: descriptor, JSP and class symbols agree that the behavior is implemented.
  - `Partial`: the behavior is implemented but the package shows a missing or broken piece.
  - `Inferred`: the behavior is deduced mainly from class names and strings, with control flow not visible.
  - `No`: declared but not implemented in the package.
- "Static-only" means read from package files. None of it was exercised live.
- UI texts quoted in the parity map come from the default bundle `ResourceBundle.properties`. Where a row's text or behavior depends on a locale, a `Locale variants (CHK-004, ...)` note in its evidence cell gives the per-bundle state (BA-001-04).
- Workbook row numbers in this record refer to the current workbook, which uses BA-001-04 numbering. The historical pass-001 correction record keeps its own numbering.

<a id="read-source-inventory"></a>

## Source Inventory

Every figure below was generated mechanically from the extracted WAR by the scratch scripts `.migration-tmp/stage-01/tools/enumerate.js`, `classdump.js` and `linkgraph.js`. The outputs are in `.migration-tmp/stage-01/out/`.

**WAR composition (964 files, 1090 archive entries including 126 directories).**

| File type | Count |
|---|---|
| class | 594 |
| JAR | 102 |
| PNG | 55 |
| XML | 43 |
| JSP | 73 |
| properties | 24 |
| JS | 21 |
| GIF | 13 |
| CSS | 12 |
| TLD | 10 |
| HTML | 3 |
| Velocity templates (vm) | 3 |
| XLS | 2 |
| SWF | 2 |
| tag, wsdd, dtd, ico, txt, mf, log | 1 each |

| Area / component | Source evidence | What was established | Inspection boundary |
|---|---|---|---|
| Web application descriptor | `WAR:WEB-INF/web.xml` (Servlet 2.4) | 8 filters; 10 filter mappings (security filters on `/do/*`, `/setting/*`, `/do/mobile/*`, `/soap/*`, `/ical/*`, none on `/rest/*`); 5 live listeners (1 commented); 6 live servlets (Struts `XPlannerActionServlet` `/do/*`, Axis `/soap/*` and `/servlet/AxisServlet`, Cewolf `/cewolf/*`, iCal `/ical/*`, Jersey `/rest/*`, Spring `DispatcherServlet` `/setting/*`; JAX-WS servlet commented out); 3 error pages; 30-minute session timeout; welcome file `index.jsp`. | Inspected fully, with commented blocks distinguished. |
| Struts 1.2.9 controller | `WAR:WEB-INF/struts-config.xml`, `mobile-struts-config.xml`, `test-struts-config.xml`; Spring-delegated action beans in `WAR:WEB-INF/action-servlet.xml` and `test-action-servlet.xml` | 87 action mappings (74 main + 7 mobile + 6 test); 24 form beans; 47 global forwards; 3 global exceptions; `DelegatingTilesRequestProcessor`. The test configuration is loaded in production (web.xml:233, struts-config.xml:440). | Inspected fully. The action-to-class map was generated mechanically (`out/action-lines.txt`, `out/bean-lines.txt`). |
| Screens (JSP) | 73 JSPs: `WAR:WEB-INF/jsp/{view 31, edit 16, wap 8, common 7, layout 7, import 1, security 1}`, `WAR:index.jsp`, `WAR:calendar/calendar-i18n.jsp`; tag file `WAR:WEB-INF/tags/breadcrumb.tag` | Page content, fields, permission checks and links. The link graph (`out/linkgraph.txt`) shows which actions are reachable from live markup. JSP and HTML comments were blanked before scanning. | All 73 opened. About 60 were read in detail. The layout fragments, `twikiformat.jsp` help text and `calendar-i18n.jsp` were skimmed. |
| Referenced but absent resources | descriptor references versus the file list | 7 JSPs are referenced but absent: `security/notAuthorized.jsp`, `edit/editSetting.jsp`, `admin/invalidateCache.jsp`, `view/iterationIterations.jsp`, `view/iterationTabs.jsp`, `view/taskhistory.jsp`, `view/viewtext.jsp`. 3 live class references are absent: `net.sf.xplanner.domain.Feature`, `com.technoetic.xplanner.importer.MissingWorksheetException`, `net.sf.xplanner.soap.XPlanner`. 4 JasperReports templates (`JR*.jrxml`) are absent. The absent `MissingWorksheetException` is named only by a redundant Struts exception mapping: `ImportStoriesAction#execute` catches the present class `com.technoetic.xplanner.importer.spreadsheet.MissingWorksheetException` itself, as its exception table shows (BA-001-04, F-008). | Checked mechanically against the extracted file list and the entry names of all 102 JARs. |
| Tiles | `WAR:WEB-INF/tiles-definitions.xml`, `tiles-pages.xml` | 5 definitions (`tiles:default`, `tiles:view`, `tiles:print`, `tiles:edit`, `viewLayout`). `tiles:print` has no user. | Inspected fully. |
| Spring 3.0.5 context | `WAR:WEB-INF/classes/spring-beans.xml` (imports `spring-caching.xml`, `spring-dao.xml`, `spring-security.xml`), `spring-web.xml` | 58 + 5 + 13 + 14 + 3 top-level beans. Liquibase runs before the session factory. Annotation session factory scans `net.sf.xplanner.domain` and loads only `mappings/Metrics.xml`. One active scheduled task (`missingTimeEntryNotifier`, cron `0 5 0 * * *`). The Quartz data-sampling trigger is defined but its scheduler is commented out. Component scans: `net.sf.xplanner.rest` and `net.sf.xplanner.web`. **Loaders (BA-001-05, F-002):** `spring-beans.xml` is loaded twice. The root `ContextLoaderListener` loads it (`WAR:WEB-INF/web.xml:32-38,194-196`), and so does the Struts `ContextLoaderPlugIn`, together with `action-servlet.xml` and `test-action-servlet.xml` (`WAR:WEB-INF/struts-config.xml:438-441`). Every singleton is therefore expected twice: the Liquibase run, the scheduler with the reminder job, the connection pool, the session factory and the authorizer initializer. The action beans are wired from the plug-in context (`Inferred`, row 65). A third loader, `MainBeanFactory` (an `XmlBeanFactory` of `/spring-beans.xml`), has no caller. `spring-web.xml` is loaded only by the Spring `DispatcherServlet` (`web.xml:264-272`). Both the Struts Tiles plug-in and `spring-web.xml` read `tiles-definitions.xml`, each for its own container. The loader list for all 55 configuration files is `.migration-tmp/stage-01/out/loaders-05.txt`. | Inspected fully. Provenance: `spring-beans.xml` is one of the 3 rewritten ZIP entries and carries the P-02 patch; its other wiring is not guaranteed upstream (GAP-005 P-02, P-05). |
| Compiled application classes | `WAR:WEB-INF/classes/**` (594 classes) | Main packages: `com.technoetic.xplanner` (domain 71, tags 68, actions 57, db 49, security 48, forms 27, charts 21, util 18, export 18, importer 17, soap 13, wiki 11, mail 9 and others) and `net.sf.xplanner` (domain 44, dao 25, events 6, rest 5, email 4, web 3 and others). Vendor packages bundled in classes: `com.sabre.security.jndi`, `com.tacitknowledge.util.migration`, `com.thoughtworks.proxy.toys`. | All parsed by the scratch class reader (constant pool, members, annotations, ldc strings, invoked symbols). About 90 classes were examined specifically. No control-flow decompilation (GAP-001). |
| Persistence model | 21 `@Entity` classes in `net.sf.xplanner.domain` (Attribute, DataSample, Directory, File, History, Identifier, Integration, Iteration, Note, NotificationReceivers, ObjectType, Patches, Permission, Person, PersonRole, Project, Role, Setting, Task, TimeEntry, UserStory); `WAR:WEB-INF/classes/mappings/*.xml` (16 files); `mappings/Metrics.xml` named queries | Tables come from `@Table` annotations and match the Liquibase tables. Of the mapping XMLs only `Metrics.xml` has a consumer. It holds named HQL queries: security roles and permissions, metrics, search, time-entry notifications, person and customer queries. `com.technoetic.xplanner.domain.Integration` and `Feature` are not mapped (GAP-004). **Query sweep (BA-001-05, F-001):** 105 HQL sources were checked against the entity model, covering 387 dotted property paths. The sources are the class strings, the JSP `useBeans` tags and the `Metrics.xml` named queries. `.migration-tmp/stage-01/tools/hql-sweep-05.js` built the model from getters and annotations, including the special `id` property and embedded ids.
<br>- Unmapped paths: `task.story` in the two iCal queries (row 226) and in two jrpdf data sources (rows 209, 211); the undeclared alias `object` and the missing `projectId` in SOAP `getCurrentIteration` (row 218); `a.targetId`/`a.name` in SOAP `deleteAttribute` (row 219).
<br>- Queries on the unmapped `Integration` and `Feature` classes, already covered by GAP-004.
<br>- The only native SQL, `PersonTimesheetQuery` (56 table.column references), matches the Liquibase schema.
<br>- Unqualified column names (`userid`, `is_hidden`, `attachedTo_id`, `project_id`, `targetId`) are listed under GAP-011. | Entity and table names were extracted. Column-level mapping was not reconciled field by field. Provenance: the "only `Metrics.xml` is loaded" conclusion rests on `spring-beans.xml:80` (rewritten entry, P-05) and is corroborated by the compiled `HibernateHelper` class list. |
| Schema and seed data | `WAR:WEB-INF/classes/db-changelog.xml` (Liquibase 2.0.1) | 8 changeSets (1-1..2-5): 21 `createTable`, 4 `addPrimaryKey`, 2 `createIndex`, 10 `addForeignKeyConstraint`, 26 `insert`, 3 `addColumn`, 1 `renameTable` (role to roles), 3 `preConditions`. Seeds 11 permissions, 4 roles (nested set), 7 object types, a patch-level row and one sysadmin person on project 0. The seeded credential value is not reproduced here (A3). | Inspected fully. Provenance: no rewrite sign on this entry, but it is not guaranteed unmodified (P-06). The DDL Liquibase emits depends on the configured database (P-01). |
| Dormant and unreferenced code (BA-001-03, F-005) | `WAR:WEB-INF/web.xml:76-83` (commented `NullSecurityFilter`); classes `com.technoetic.xplanner.security.filter.NullSecurityFilter`, `net.sf.xplanner.dwr.Project`, `com.technoetic.xplanner.webservers.JettyServer`, `com.technoetic.xplanner.mail.MissingTimeEntryEmailJob`; mechanical list `.migration-tmp/stage-01/out/orphans.txt` | The commented `NullSecurityFilter` would log every request in as a default user (strings `defaultUserId`, `sysadmin`). `dwr.Project` has no DWR servlet and no DWR JAR. `JettyServer#main` is an embedded-server launcher (`jetty-5.1.10.jar` is bundled). `MissingTimeEntryEmailJob` has no trigger. A mechanical scan found 70 of 521 top-level classes with no static reference from other classes or from descriptor, JSP, TLD or properties text. That list includes classes that are reached by discovery rather than by name (component-scanned REST and web classes, JPA entities, DAOs found by `DaoScanner`, JSP wildcard imports), so it is a candidate list, not proof of dormancy. Other dormant candidates include the `*2` domain classes, `CsvExporter`, `TomcatUserImporter`, `BootstrapSystemUser`, `DefaultFileSystem`, `ExceptionHandler` and `EmailPerChangeListener`. | Inventoried as inactive territory. No parity rows; the commented auto-login is also listed under Q3 facts. |
| Legacy migration toolkit | `tk-autopatch-0.7.3.jar`; `com.tacitknowledge.util.migration.*`; `com.technoetic.xplanner.security.install.BootstrapSystemUser`; properties `xplanner.migration.*` | Autopatch support classes are present. No consumer launching them was found: `xplanner.migration.*` is read only by `XPlannerProperties` and `HsqldbServerContextListener`. Schema creation is done by Liquibase. | Inferred. A launcher inside a JAR cannot be excluded without decompilation. |
| Configuration | `WAR:WEB-INF/classes/xplanner.properties` (317 lines) overridden by `xplanner-custom.properties` (load order per `XPlannerProperties$PropertyInitializer`); 7 unused variants `xplanner-custom-*.properties`; `log4j-war.xml`; `ehcache.xml`; `spy.properties` | Effective settings: MySQL `jdbc:mysql://db/xplanner` with the XPlannerMySQLDialect; the application URL is `http://localhost:8080/xplanner`; SMTP localhost:25; export formats `xml,mpx,mspdi,pdf,jrpdf`; statistics on; velocity chart hidden; progress bar html; default story priority 4; content search global. The database user and password values are present but not reproduced. p6spy is not wired. | Both effective files were read fully. The unused variants, `ehcache.xml` and `spy.properties` were not read in detail. Provenance: both effective properties files are rewritten entries; database values are the known patch (P-01); the other values cannot be separated (P-03, P-04). |
| Security configuration | `WAR:WEB-INF/security.xml`, `mobile-security.xml`, `soap-security.xml`; `spring-security.xml`; login module properties | Custom form, Basic and mobile filters. Only the bypass list decides whether a request is secure (`SecurityConfiguration#isSecureRequest`). The role constraints in `security.xml` and `soap-security.xml` are `*`; `mobile-security.xml:11-15` lists `viewer`, `editor` and `admin`. No descriptor role constraint is ever evaluated, because `SecurityConfiguration#isAuthorized` has no caller (corrected in BA-001-03, F-004). Permissions come from the database and are checked server-side only on the paths listed under [Runnable Surfaces](#read-runnable-surfaces). The active login module is XPlannerLoginModule. JNDI/LDAP, NTLM and JAAS modules are wired but disabled. | Inspected fully. |
| Web services | `WAR:WEB-INF/server-config.wsdd` (Axis 1.4); `WAR:WEB-INF/sun-jaxws.xml`; `net.sf.xplanner.rest.*` (Jersey 1.1.5); `com.technoetic.xplanner.ical.iCalServlet` | SOAP service `XPlanner` has 43 public operations and 8 bean mappings, plus an Axis `Version` service. There are 4 REST resource methods (`/view`, `/view/project/{id}`, `/view/iteration/{id}/userstories`, `/update/task/{id}/status`). The iCal feed is `/ical/<user>.ics`. JAX-WS is inactive. | Inspected (descriptors plus class symbols). |
| Spring MVC pages | `net.sf.xplanner.web.MePage`, `CommonObjectHandler`; `spring-web.xml` | `/setting/me/status/{id}` (personal status page), `/setting/{type}/list` and `/setting/{type}/edit/{id}` (generic, views unknown). | Class annotations only. |
| Mobile channel | `mobile-struts-config.xml`, `WAR:WEB-INF/jsp/wap/*.jsp` | 7 WML read-only pages. Links are hard-coded to `/xplanner/...`. `wap/auth.jsp` is unreferenced debug markup that echoes credentials; it is excluded as unreachable. | Inspected fully. |
| Jobs and e-mail | `spring-beans.xml:343-406`; `com.technoetic.xplanner.mail.*`; `net.sf.xplanner.email.*`, `net.sf.xplanner.events.*`; Velocity templates `WAR:WEB-INF/classes/com/technoetic/xplanner/mail/velocity/*.vm`; `EmailResourceBundle.properties` | Daily missing-time-entry e-mails. Task created/updated e-mails come from `EditTaskAction`. Integration e-mail comes from a listener. Per-change e-mail listener is not registered. Data sampling runs at iteration start/close and through a manual action. | Class symbols and descriptors only. Templates were not rendered. |
| Export and reports | `com.technoetic.xplanner.export.*`; `mpxj`, `itext`, `jasperreports` JARs | XML, MPX, MSPDI and PDF exporters. The JasperReports exporter's `.jrxml` templates are missing. A CSV exporter class exists but is not wired to any action. Displaytag table export is configured but not enabled on any table. | Class symbols only. |
| Charts | `WAR:WEB-INF/web.xml` (Cewolf servlet), `com.technoetic.xplanner.charts.*`, `jfreechart`, `cewolf` JARs | Iteration statistics: 6 pie charts and 3 line charts, each line chart behind an `xplanner.effort.chart.*` flag. The velocity chart is off (`notDisplayed`); the progress chart (`velocityChart2`, estimated and actual hours from data samples) and the burn-down chart are on (`WAR:WEB-INF/jsp/view/iterationStatistics.jsp:123-228`, `xplanner.properties:66-68`; the progress chart was added in BA-001-05, F-004). 3 pies on each timesheet page. Chart and include sweep: 15 live charts and 42 static include targets (`.migration-tmp/stage-01/out/jsp-charts-includes-05.txt`). | JSP and descriptors inspected. Rendering not observed. |
| Internationalisation | `WAR:WEB-INF/classes/ResourceBundle*.properties` (10 files); `ChangeLocaleAction` | English default plus da, de, es, fr, it, ja, pt_br, ru and an alternate `ResourceBundle--.properties`. There is no UI link to change the language. | English bundle used for message lookups. The others were sampled for specific keys only. |
| Static assets | `WAR:js/*`, `WAR:css/*`, `WAR:calendar/*`, `WAR:images/*`, `WAR:ui/*`, `WAR:flash/*`, `WAR:files/*.xls` | jQuery 1.5.1 and jQuery UI 1.8.11; dojo, used only by the statistics page; overlib for export pop-ups; calendar picker; wide-layout toggle (`js/global.js`); import templates `files/peopleImportTemplate.xls` and `files/storiesImportTemplate.xls`. `flash/Dashboard.swf` and `js/chart.html` have no JSP reference. | Listed. `global.js` and `editTimeEntries.js` were read. Other scripts were not reviewed. |
| Third-party libraries | `WAR:WEB-INF/lib/*.jar` (102) | Struts 1.2.9, Spring 3.0.5, Hibernate 3.6.5, Liquibase 2.0.1, HSQLDB 2.2.4, MySQL Connector 5.1.13, Axis 1.4, Jersey 1.1.5 and Jackson 1.7.4, Quartz 1.5.2, JasperReports 1.0.2, JFreeChart 1.0.11 and Cewolf 1.0, iText 1.01, POI 3.5, MPXJ 3.0.1, Velocity 1.5, SiteMesh 2.2.1, Radeox, displaytag 1.0, JavaMail 1.4.3, jcifs 1.0.1, commons-*, and others. | Entry names were used only to resolve references. Library code was not analysed (GAP-011). |
| Container and build metadata | `WAR:META-INF/context.xml` (path `/xplanner-plus`), `WAR:WEB-INF/sun-web.xml` (`/xplanner-plus`), `WAR:WEB-INF/geronimo-web.xml` (`/xplanner`), `WAR:META-INF/maven/.../pom.xml` | Deployment descriptors for Tomcat, GlassFish and Geronimo. The context paths disagree (GAP-008). The Maven POM is packaging `war`, version `1.1`. | Descriptors read. The POM was read for coordinates only. Provenance: these descriptors show no rewrite sign (P-06). The `/xplanner-legacy` deploy name belongs to the helper outside the WAR. |
| Local run helpers (not in the WAR) | [`legacy/docker-compose.yml`](../legacy/docker-compose.yml), [`legacy/README.md`](../legacy/README.md) | Compose defines MySQL 5.7 and Tomcat 9 on JRE 8, mounts the WAR as `xplanner-legacy.war` (context `/xplanner-legacy`) and sets `-Xverify:none`. It comes from the earlier experiment and was not run. | Read as run hints only. Not executed. |

<a id="read-runnable-surfaces"></a>

## Runnable Surfaces

No surface was started or observed in Stage 1. The **observation status** of every row is therefore `inferred`: it is derived from static package contents. A surface is `blocked` when the package lacks a piece that it needs.

| Surface / actor | Entry point and startup | Runtime / dependencies | Observation status | Evidence / limitation |
|---|---|---|---|---|
| Web UI: viewer, editor, admin and sysadmin users | `/do/*` Struts actions and `/index.jsp` in a Servlet 2.4 container. The context path depends on deployment (GAP-008). | Java 6-era JVM, a Servlet 2.4/JSP 2.0 container, MySQL (effective configuration) or HSQLDB, and SMTP for e-mail | inferred | `WAR:WEB-INF/web.xml`, `struts-config.xml`, 73 JSPs; parity epics UF-001..UF-014 |
| Personal status page (signed-in user) | `/setting/me/status/{id}` via Spring `DispatcherServlet` | same as the web UI | inferred | `net.sf.xplanner.web.MePage`. The link base comes from `xplanner.application.url`. |
| Settings pages (admin) | `/do/view/settings`, `/do/edit/setting`, `/setting/{type}/...` | same | blocked (partial) | `editSetting.jsp` absent; the generic views are unknown |
| Mobile WAP users | `/do/mobile/*` (WML) | same, plus a WML browser | blocked (partial) | Links are hard-coded to `/xplanner`. The web filter may intercept mobile login (UF-018). |
| SOAP API clients | `/soap/XPlanner` with HTTP Basic, and `/servlet/AxisServlet` (unfiltered) | Axis 1.4 in the web app | inferred | `WAR:WEB-INF/server-config.wsdd`, `com.technoetic.xplanner.soap.XPlanner`. `getCurrentIteration` and `deleteAttribute` are expected to fail on unmapped query paths (BA-001-05, F-001; rows 218-219). |
| REST API clients and the task board | `/rest/view/...`, `/rest/update/task/{id}/status` | Jersey 1.1.5 and Jackson | inferred | `net.sf.xplanner.rest.*`. No security filter on `/rest/*`. |
| Calendar clients | `/ical/<userId>.ics` with HTTP Basic | web app | blocked (partial) | `com.technoetic.xplanner.ical.iCalServlet`. Both queries use `task.story`, which `Task` does not map, so an error response is expected instead of a calendar (BA-001-05, F-001; row 226). |
| Chart images | `/cewolf/*` rendered on demand from JSP chart tags | JFreeChart. A headless or X environment is needed per the `xplanner.statistics` comment. | inferred | `WAR:WEB-INF/web.xml:211-225`, `iterationStatistics.jsp`, `timesheet.jsp` |
| Daily missing-time-entry job (operator/batch) | Spring `task:scheduled`, cron `0 5 0 * * *`, inside the web app; registered in both Spring contexts that load `spring-beans.xml`, so it is expected to run twice (BA-001-05, F-002) | SMTP, database | inferred | `spring-beans.xml:362-367`, `web.xml:32-38`, `struts-config.xml:438-441`; rows 65, 198-199 |
| Data sampling (batch) | at iteration start/close and through `/do/edit/dataSample`. The nightly Quartz trigger is not scheduled. | database | inferred | `spring-beans.xml:343-402`, `test-action-servlet.xml:4-7` |
| Schema bootstrap (operator) | Liquibase on application start (`SpringLiquibase` bean); expected to run once per Spring context, so twice (BA-001-05, F-002) | empty or matching database | inferred | `spring-beans.xml:71-81`, `db-changelog.xml`; rows 64-65 |
| Admin and test utilities (operator) | `/do/invalidateCache`, `/do/invalidateHibernateCache` (unauthenticated), `/do/edit/{dataSample,missingTimeEntryNotification,putTheClockForward,properties}`, `/do/admin/reload-tiles`, `/do/systemInfo` | web app | inferred | `test-struts-config.xml`, `test-action-servlet.xml`, `security.xml:5` |
| Activity log (operator) | `ActivityLogFilter` on `/do/*` writes `${xplanner-plus.root}/xplanner-plus-activity.log` | writable web-app root | inferred | `WAR:WEB-INF/classes/log4j-war.xml:44-55` |

**Server-side permission enforcement by entry point (BA-001-03, F-001 impact sweep).** `.migration-tmp/stage-01/tools/authtrace.js` traced a static call graph from every entry point to the authorization classes (`Authorizer`, `SystemAuthorizer`, `AuthorizationHelper`, `PermissionHelper`, `RepositorySecurityAdapter`). The entry points are 80 web action beans, 7 WAP actions, 43 SOAP operations, 4 REST methods, the iCal servlet and 3 Spring MVC handlers, and the output is `out/authtrace.json`. Control flow and framework callbacks are not followed, so results are `Inferred` until Stage 3. Recording this behavior is not permission to carry it into the new application (Q3 deferred).

| Channel / entry points | Server-side check found | Evidence | Workbook rows |
|---|---|---|---|
| Web generic view (`ViewObjectAction` family), create/edit (`EditObjectAction` family), delete (`DeleteObjectAction`, `DeleteNoteAction`) | none; the permission model is applied only by hiding links in JSP tags | `ViewObjectAction#doExecute`, `EditObjectAction#updateObject/#createObject`, `DeleteObjectAction#doExecute` | 26, 28-30 |
| Other web actions (export, import, move/continue, reorder, time, notes, attachments, file manager, integration queue, iteration start/close/continue, notification receivers, role editor, timesheet, ID search, test/admin utilities, "me" page) | none as a gate | `out/authtrace.json` | 30, 35, 163, 183 |
| Person editor role changes | Project roles change only on projects where the user holds `admin.edit.role`. If the user holds `admin.edit.role` on project 0, every save first removes the person's sysadmin role and re-adds it only when `systemAdmin=true` is posted. `sysadmin.promote` only hides the checkbox (BA-001-04, F-007). | `EditPersonHelper#modifyRoles/#isCurrentUserAdminOfProject/#setSysadmin` | 31, 33-34 |
| DispatchForward views with authorization required (default true): `/do/view/integrations` and the 7 WAP actions | projectId parameter and `system.project` read, else not-authorized forward | `DispatchForward#<init>/#isSecure/#execute` | 28, 232 |
| Content search, aggregate timesheet | result filtering by read permission | `SearchResultAuthorizationPredicate#isResultReadableByUser`, `AggregateTimesheetQuery#getTimesheet` | 166, 179 |
| SOAP | per-object read, create, edit and delete checks; the 5 attribute operations are unchecked | `XPlanner#hasPermission` via `#getObject`, `#selectAccessibleObjects`, `#addObject`, `#updateObject`, `#removeObject` | 216 |
| REST | none, and no filter | `ViewService`, `UpdateService` | 223 |
| iCal | another person's calendar needs `admin.edit` on `system.person` | `iCalServlet#doGet` | 228 |
| Descriptor URL role constraints | never evaluated | `SecurityConfiguration#isAuthorized` has no caller | 32, 231 |

**Additional defects found by the sweep (not reviewer findings):**

- **AF-01:** `ViewIterationMetricsAction#getRepository` returns null, so the iteration metrics are expected to be empty (rows 106-107, now `Partial`).
- **AF-02:** `EditRoleAction#beforeObjectCommit` has a signature that overrides no hook and is never called, so the project role editor is expected not to save roles (row 35).

Both are recorded in [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stages/stage-01/stage-02-pass-001-dispositions.md).

**Row-level CHK-002 sweep (BA-001-04, F-007).** Every workbook row that states a permission, role or access condition now says in its evidence cell whether the condition is enforced on the server.

- **The row cites the server-side check:** rows 17, 28, 31, 33, 166, 179, 216, 219, 226, 228 and 232.
- **Display-level condition with a different server-side rule:** row 34. `sysadmin.promote` only hides the checkbox; the server applies `admin.edit.role` on project 0.
- **Filtered while the server renders a list:** rows 27 and 38. The list is filtered, but the object pages behind it have no check.
- **Display-level only, no server-side check:** rows 24, 26, 41-43, 46, 48-50, 59, 75, 77, 80, 81, 84, 87, 89, 90, 94, 96, 97, 100, 114, 120, 124, 125, 128, 133, 138-141, 143, 148, 168, 172, 173 and 194.
- **No check is reached at all:** row 35, where the only check is in an unreachable hook, and row 61, the cache utilities.
- **Model rows:** rows 23 and 25 state where the role model is evaluated.

The row lists and their outcomes are in [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](./stages/stage-01/stage-02-pass-002-dispositions.md).

<a id="read-data-and-integrations"></a>

## Data And Integrations

| Dependency | Purpose / calling component | Source evidence | Live confirmation | Unresolved boundary |
|---|---|---|---|---|
| Relational database, MySQL in this baseline's effective configuration | All persistence through Hibernate 3.6 and a DBCP pool (`defaultAutoCommit=false`) | `xplanner-custom.properties:18-24`, `xplanner.properties:9-17`, `spring-beans.xml:60-81` | not checked | The MySQL settings and `defaultAutoCommit=false` are the known patch (GAP-005 P-01, P-02). The compiled `XPlannerMySQLDialect` class shows that the package itself supports MySQL. Which engine upstream v1.1a4 defaulted to cannot be settled from this package; the release notes (a hint) say file-based HSQLDB. |
| Embedded or in-process HSQLDB (optional mode) | Demo database. Only when `xplanner.migration.databasetype=hsqldb`. | `HsqldbServerContextListener`, `hsqldb-2.2.4.jar`, commented HSQLDB settings | not checked | Not active with the shipped properties. |
| Liquibase schema changelog | Creates and seeds the schema at startup | `spring-beans.xml:71-75`, `db-changelog.xml` | not checked | Behavior against an existing older XPlanner schema (preConditions `MARK_RAN`) is unverified. |
| SMTP mail server | Task and integration notifications, daily reminders | `xplanner.properties:78-80`, `com.technoetic.xplanner.mail.*`, `SmtpAuthenticator` | not checked | Recipients and message bodies were not decompiled. Daily reminders are expected to be sent twice, because the job is registered in two Spring contexts (row 65). |
| Outbound HTTP to the application's own URL (BA-001-03, F-006) | E-mail formatting fetches `xplanner.application.url` + `/css/email.css` to embed the stylesheet | `EmailFormatterImpl#formatEmailEntry` (strings `xplanner.application.url`, `/css/email.css`; `util.HttpClient#getPage`), caller `EmailNotificationSupport`; `WAR:css/email.css` | not checked | Depends on the configured URL (`http://localhost:8080/xplanner`, P-04) being reachable from the server; see GAP-008. Row 200. |
| File storage for attachments | Note attachments and the file manager through the virtual file system: directories in table `xdir`, file bytes as a BLOB in `xfile.data` | `spring-beans.xml:263`, `EditNoteAction#populateObject` (`FileSystem.createFile`), `FileSystemImpl#createFile` (`Hibernate.createBlob`, `File.setData`), `net.sf.xplanner.domain.File` field `data` (`@Lob`, `@Column(name="data")`), `WAR:WEB-INF/classes/db-changelog.xml:234` (`LONGBLOB`) | not checked | Settled from source in BA-001-03 (F-008): the bytes are stored in the database, not on disk. Row 171. |
| LDAP/JNDI, NTLM (jcifs) and JAAS identity providers | Optional login modules | `spring-security.xml:38-43`, `xplanner.properties:167-190` | not checked | Disabled in the shipped configuration. |
| External wiki | TWiki-style links through `GenericWikiAdapter` (example URL `localhost:9090/vqw`) | `xplanner.properties:92-127` | not checked | Example endpoints only. |
| Twitter and Facebook | Share links on view pages: a Twitter status link and a Facebook feed-dialog link. The LinkedIn link, the `connect.facebook.net` script and the Facebook like widget sit inside an HTML comment and are not rendered (corrected in BA-001-04, F-003). | `WAR:WEB-INF/jsp/layout/viewLayout.jsp:73-88` (live links), `:92-95` (commented block); the same commented block is in `WAR:WEB-INF/jsp/layout/viewLayoutNew.jsp:114-117` | not checked | The links go to external services and are opened by the browser. No external script is loaded. Row 191. |
| SourceForge links | Footer version link, issue tracker, login instructions URL | `footer.jsp`, `xplanner.properties:290`, `xplanner-custom.properties:49` | not checked | External links only. |
| SOAP, REST and iCal clients | Inbound integrations | see [Runnable Surfaces](#read-runnable-surfaces) | not checked | Authentication gaps on `/rest/*` and `/servlet/AxisServlet` (GAP-007). |
| Microsoft Project, PDF and XML consumers | Export files | `com.technoetic.xplanner.export.*` | not checked | JasperReports templates are missing (GAP-003). |
| Excel spreadsheets and comma-separated text | Story import (POI) and people import (text lines). The story-import settings (worksheet name, column headers, only-incomplete choice, completed status) are kept in browser cookies and pre-fill the next import (BA-001-04, F-008). | `SpreadsheetStoryImporter`, `ImportStoriesAction#setCookies/#populateForm/#getValueFromCookieOrProperties`, `ImportPeopleAction` | not checked | The people template is `.xls` but the parser reads comma-separated lines (GAP-012). Rows 114-118. |

<a id="read-build-run-and-test-evidence"></a>

## Build, Run, And Test Evidence

Every command below was executed from the project root in Git Bash on Windows 11, with Node v22.20.0, with `TEMP`/`TMP`/`TMPDIR` pointing into the project and without network access. The legacy application itself was never built, started or tested.

| Command actually run | Environment / revision | Observed result | Evidence | What this does not prove |
|---|---|---|---|---|
| `sha256sum legacy/*` (before the work and again at the end) | revision `1e12347`, legacy tree `3bd350fa`; re-run in BA-001-04 on branch `stage-01/pass-002-corrections` from `main` `25b25c4` and in BA-001-05 on branch `stage-01/pass-003-corrections` from `main` `9a9f432`, same legacy tree | passed: all four hashes equal the values in [Scope And Provenance](#read-scope-and-provenance) | command output in the task transcript; re-check command recorded here | Nothing about behavior. |
| `unzip -Z1 legacy/xplanner-plus.war`, `unzip -l legacy/xplanner-plus.war` | same | passed: 1090 entries, 34,862,846 bytes uncompressed | entry list | Package composition only. |
| `unzip -q -o legacy/xplanner-plus.war` into `.migration-tmp/stage-01/war/` | same | passed: 964 files | scratch copy (git-ignored) | Extraction does not modify [`legacy/`](../legacy), which the hash re-check confirms. |
| `node .migration-tmp/stage-01/tools/classdump.js war/WEB-INF/classes out` | scratch read-only class reader | passed: 594 of 594 classes parsed, 0 errors, all version 50.0 | `out/classes.json`, `out/classdump/*.txt` | Control flow is not decompiled. Branch conditions stay inferred. |
| `node .migration-tmp/stage-01/tools/authtrace.js` (BA-001-03) with `out/entrypoints.json` | read-only static call graph over `out/classes.json` | passed: 138 entry points traced (80 web, 7 WAP, 43 SOAP, 4 REST, 1 iCal, 3 Spring MVC); authorization, history and event sinks listed per entry point | `out/authtrace.json`, `out/authtrace.txt` | Control flow, reflection and framework callbacks are not followed. A missing sink means no static path, not a runtime proof. |
| `node .migration-tmp/stage-01/tools/disasm.js <class> <method>` (BA-001-03) | read-only bytecode listing of selected methods (`DispatchForward`, `ViewObjectAction`, `EditRoleAction`, `ViewIterationMetricsAction`, `IterationMetrics`, `AbstractSecurityFilter`, `AbstractAction`) | passed: branch structure of these methods read directly. In BA-001-04 the tool was extended to print exception tables and was applied to `AuthenticationAction#execute`, `ImportStoriesAction#execute`, `EditPersonHelper#modifyRoles`, `NoteHelper#deleteNote` and `Note#getAttachmentCount`. | transcript | Only the listed methods were read. Branch conditions are read from the instruction order, not decompiled source. |
| orphan-hook and orphan-class scans (BA-001-03, Node one-offs over `out/classes.json`) | same | passed: 1 orphan action hook (`EditRoleAction#beforeObjectCommit`); 70 of 521 top-level classes without static reference | `out/orphans.txt` | Discovery-based wiring (component scan, entity scan, `DaoScanner`) makes the class list a candidate list only. |
| `node .migration-tmp/stage-01/tools/zipmeta.js` (BA-001-02) | read-only parse of the WAR's ZIP central directory and local headers | passed: 1090 entries; 3 entries with version-needed 2.0 (`spring-beans.xml`, `xplanner-custom.properties`, `xplanner.properties`); no extra fields; monotonic local headers | `out/zipmeta.json` | A rewrite sign, not proof. Its absence does not prove originality (GAP-005 P-06). |
| `node .migration-tmp/stage-01/tools/build-workbook.js` with `tools/provenance-notes.js` (BA-001-02) | same governed helpers; each note asserts the expected requirement prefix of its row | passed: 31 provenance notes; a before/after cell diff showed only column H of those 31 rows changed | [`analysis/legacy_user_flows.xlsx`](./legacy_user_flows.xlsx) | Notes add provenance context only; statuses are unchanged. |
| `node .migration-tmp/stage-01/tools/edit-ba-001-04-rows.js`, then `edit-ba-001-04-rows-b.js`, `-c.js` and `-d.js` (BA-001-04, each run once) | row data `.migration-tmp/stage-01/tools/rows-part*.js`; pre-edit copies in `out/rows-part*.pre-ba-001-04.js` | passed: each edit locates its row by requirement prefix and asserts exactly one match; 9 rows added, 59 changed | `out/row-map.txt` (regenerated by `tools/rowmap.js`) | Mechanical placement only; content is checked by CHK-001 and by the sweeps. |
| `node .migration-tmp/stage-01/tools/remap-rows-04.js` (BA-001-04) | this record | passed: row numbers after 114 shifted by 1, after 144 by 9; 35 lines changed | this record | Workbook row references outside the patterns it handles were checked by CHK-001 (see Error Prevention). |
| `node .migration-tmp/stage-01/tools/hql-sweep-05.js` (BA-001-05) | read-only; entity model from `out/classdump` (getters not `@Transient`, `@MappedSuperclass` parents, embedded ids, the special `id` property); query strings from `out/classes.json`, JSP `useBeans` tags and `mappings/Metrics.xml` | passed: 105 query sources, 387 dotted paths, 24 flagged. By hand, 3 flagged items are false positives: a string literal in `Metrics.xml`, an unqualified `id.sampleTime` and scriptlet code in `task.jsp`. The real defects are listed in the Persistence model row. 56 native-SQL references match the schema. | `out/hql-sweep-05.txt` | Whether Hibernate rejects a path, or passes an unqualified name into SQL, is framework behavior (GAP-011). |
| `node .migration-tmp/stage-01/tools/loaders-05.js` (BA-001-05) | read-only; every configuration file under `WEB-INF` is searched by name in comment-blanked descriptors and in class strings | passed: 55 files; `spring-beans.xml` has 3 loaders (2 live, 1 without caller); `tiles-definitions.xml` has 2 | `out/loaders-05.txt` | Framework default locations (for example `server-config.wsdd`, `ehcache.xml`) are loaded by name inside the libraries and show no reference. |
| `node .migration-tmp/stage-01/tools/chk005-validators-05.js` (BA-001-05) | read-only; the keys of each form validator, own or inherited, are matched against alternative-path rows that cite the validator | passed: 17 validators, 47 keys, 0 uncovered. Positive control: on the pre-correction rows it reports exactly the 3 keys of pass-003 F-003. | `out/chk005-05.txt` | Branch conditions come from bytecode listings of selected methods. |
| `node .migration-tmp/stage-01/tools/jsp-charts-includes-05.js` (BA-001-05) | read-only; comment-blanked JSPs | passed: 15 live charts, each named in a row by id or by description; 42 static include targets, of which only the 2 layout fragments listed in the Parity-Map Boundary are uncited | `out/jsp-charts-includes-05.txt` | Chart content is not rendered. |
| `node .migration-tmp/stage-01/tools/edit-ba-001-05-rows.js` and `remap-rows-05.js` (BA-001-05, each run once) | row data and this record | passed: 6 rows inserted after rows 51, 63, 106, 119, 126 and 140; existing row references in 10 cells and 68 lines of this record remapped | `out/row-map.txt` | Mechanical placement only; content is checked by CHK-001 and by the sweeps. |
| `node .migration-tmp/stage-01/tools/enumerate.js` | XML parsed with htmlparser2 (comments excluded) | passed: category counts as in [Source Inventory](#read-source-inventory) | `out/enumeration.json` | Descriptors can still be overridden at runtime by container settings. |
| `node .migration-tmp/stage-01/tools/linkgraph.js` | JSP comment blanking plus regex | passed: 87 action paths classified as linked or unlinked; 7 missing JSP targets found by a separate descriptor check | `out/linkgraph.txt`, `out/jsp-refs.txt` | Links built dynamically (for example export URLs) were resolved manually. Positive control: known links such as `/do/logout` were found. |
| Descriptor class-reference check (Node one-off: all `com.technoetic`/`net.sf`/`com.sabre`/`com.tacitknowledge` names in WAR XML versus the class dumps, comment-aware) | same | passed: 295 references and 183 distinct names checked; 5 live and 1 commented reference unresolved | shown in transcript, summarised in GAP-003 | Classes inside JARs were checked separately by entry-name search, with no XPlanner classes found in any JAR. |
| `grep`/`sed`/`awk` inspections of descriptors, JSPs and class dumps | same | used for reading; every negative search was paired with a positive control (for example the `*.jrxml` search matched `JRXml*` classes in `jasperreports-1.0.2.jar`) | transcript | Regex searches can miss split constructs. Parsers were used for the XML counts. |
| `node .migration-tmp/stage-01/tools/build-workbook.js` | exceljs from the project-local analysis tool dependencies; governed `setFill`, `reconcileWorksheetOutlineHierarchy`, `writeWorkbookFile` | passed (BA-001-05 final build): 18 epics, 208 scenario rows, last row 232, outline reconciled, header rows 1-6 unchanged, 31 provenance notes applied | [`analysis/legacy_user_flows.xlsx`](./legacy_user_flows.xlsx) | Writing the rows does not prove them correct. Stage 2 must verify them independently. |
| `npm --prefix analysis/tools run sync:workbook-progress` | same | passed: 18 epic banners updated to `(0%)`; overall 0 / 208 | workbook row 3 and banners | Progress is 0% by definition at Stage 1. |
| `npm --prefix analysis/tools run audit:workbook` | same | passed: `WORKBOOK AUDIT OK` (Scenarios 208; open 208; epics 18; revision sheets 0) | audit output | Structure and colour rules only, not semantic correctness. |
| `npm --prefix analysis/tools run audit:project` | same | passed (exit 0; re-run in BA-001-04 and BA-001-05: `PROJECT CONFIG AUDIT OK` at stage-01) | audit output | Project configuration structure only. |
| `npm --prefix analysis/tools run audit:artifact-links` | same | passed (exit 0; re-run in BA-001-04 and BA-001-05: 205 Markdown documents checked) | audit output | Link form only. |
| `node analysis/tools/artifact-reading.js --file analysis/legacy_reconnaissance.md` (and on the correction records [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](./stages/stage-01/stage-02-pass-002-dispositions.md) in BA-001-04 and [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](./stages/stage-01/stage-02-pass-003-dispositions.md) in BA-001-05) | same | passed: no errors in either file | tool output | Reading structure only. |
| `npm --prefix analysis/tools run audit:workbook:excel` | Excel Desktop (Office16) through COM, read-only open, run once | passed (exit 0): `EXCEL DESKTOP OPEN AUDIT OK`; workbook hash unchanged. Re-run once in BA-001-04 after the final workbook write: exit 0, hash `73a8e05b…0e11` before and after. Re-run once in BA-001-05 after the final workbook write: exit 0, hash `24630a19…670a` before and after | `.migration-tmp/stage-01/out/audit-excel.txt`, `out/audit-excel-4.txt`, `out/audit-excel-5.txt` | A clean open does not prove content or visual layout. |
| Visual render pass of the `User Flows` sheet | no approved renderer | blocked: no renderer available (PM decision) | GAP-010 | Visual layout was not inspected. |

**Plausible but unexecuted commands (not evidence).**

- `docker compose -f legacy/docker-compose.yml up -d` is prohibited in Stage 1, and `PREPARATION.md` warns that it collides with an earlier installation.
- Deploying the WAR to Tomcat 9 on JRE 8 against MySQL 5.7, then opening `/<context>/do/login`, is the Stage 3 path under a separate owner grant.
- `mvn package` is impossible because no source is present.

<a id="read-known-gaps-and-blockers"></a>

## Known Gaps And Blockers

| Gap ID | Unknown / blocked scope | Why it matters | Next investigation / decision | Responsible actor | Status / evidence |
|---|---|---|---|---|---|
| GAP-001 | No JDK, javap or decompiler: method bodies, branch conditions, default values and error paths in 594 classes are unread. | 75 of the 208 parity rows are `Inferred` (counted from the workbook after BA-001-05), and parts of many `Yes` rows rest on class symbols or on bytecode listings of selected methods. | Stage 3 live walkthrough, or an owner decision to permit a decompiler inside the project boundary. | PM, then the owner | open. Scratch class reader limits are stated in [Build, Run, And Test Evidence](#read-build-run-and-test-evidence). |
| GAP-002 | Nothing was observed live (Stage 1 scope). | Every row is static-only. Runtime failures such as the Javassist or verifier issue named in the compose comments cannot be assessed. | Stage 3 walkthrough under a separate grant. | PM, then the owner | open |
| GAP-003 | Referenced resources are missing from the WAR: 7 JSPs (`security/notAuthorized.jsp`, `edit/editSetting.jsp`, `admin/invalidateCache.jsp`, `view/iterationIterations.jsp`, `view/iterationTabs.jsp`, `view/taskhistory.jsp`, `view/viewtext.jsp`), 3 classes (`net.sf.xplanner.domain.Feature`, `...importer.MissingWorksheetException`, `net.sf.xplanner.soap.XPlanner`), 4 JasperReports templates (`JRIteration`, `JRStory`, `JRTask`, `JRPerson` `.jrxml`). | The affected flows are marked `Partial`: not-authorized page, settings editor, admin cache page, tabbed iteration view, features and jrpdf reports. The absent `...importer.MissingWorksheetException` has no effect on behavior, because `ImportStoriesAction#execute` handles the present `...importer.spreadsheet.MissingWorksheetException` itself (corrected in BA-001-04, F-008; row 116 is `Yes`). | Confirm at Stage 3. Stage 4 owner decides parity for broken legacy features. | BA (Stage 3), owner (Stage 4) | open. `out/jsp-refs.txt`, descriptor reference check, JAR entry search. |
| GAP-004 | `com.technoetic.xplanner.domain.Integration` and `Feature` have no `@Entity`, and their mapping XMLs are not loaded (the session factory loads only `Metrics.xml`). | The integration queue (UF-012) and features (UF-011) are probably non-functional. | Stage 3 confirmation, then Stage 4 disposition. | BA, owner | open. `spring-beans.xml:77-81`; the class dumps show no annotations. Provenance: rests partly on `spring-beans.xml:80` (rewritten entry, GAP-005 P-05); independently corroborated by compiled `HibernateHelper`. |
| GAP-005 | Provenance of the fixed baseline. The package carries an earlier experiment's MySQL patch; 3 ZIP entries show a rewrite sign; the other entries are not guaranteed unmodified. No original WAR will be supplied (owner decision 2026-09-24). | Conclusions that depend on rewritten or unverifiable content describe this baseline only. They cannot be attributed to upstream XPlanner+. | Per-conclusion impacts, blocked checks and their requirements are listed in [GAP-005 per-conclusion impact](#read-gap-005-per-conclusion-impact). All other reconnaissance continued. | BA (record), owner (decided Q1) | Q1 decided (`legacy-baseline-provenance:xplanner2-revision1`). The impact remains recorded as residual risk. |
| GAP-006 | [`legacy/demo-seed.sql`](../legacy/demo-seed.sql) is a prepared fixture whose comments describe an earlier migration's Stage 2/3 events. | Under A2 it must not act as evidence or as hints. It is relevant only to later demo data. | None for Stage 1. Treat it as a fixture at Stage 3 under owner control. | PM | recorded (excluded) |
| GAP-007 | Security-relevant legacy behavior observed statically: remember-me stores user ID and password as Base64 cookies; `/rest/*` (including task status update) has no security filter; `/servlet/AxisServlet` bypasses the SOAP Basic filter; `/do/invalidateHibernateCache` bypasses login; `task.jsp` builds an HQL `where` clause from the `oid` request parameter; `server-config.wsdd` has a default Axis admin password parameter; test and admin actions ship in production; the system info page exposes database URL and user (password masked); MD5-based password digests; **no server-side permission check on generic web view, edit and delete actions and on most other web actions, so any signed-in user can act by direct URL (BA-001-03, F-001)**; **system-administrator status is granted or revoked on the server by `admin.edit.role` on project 0, not by `sysadmin.promote`: saving a person editor as such a user without the checkbox revokes the person's sysadmin role, and posting `systemAdmin=true` grants it (BA-001-04, F-007)**; descriptor role constraints are never evaluated; the commented `NullSecurityFilter` would auto-login as a default user if re-enabled. | Principle XI: the target must not preserve insecure behavior. These are legacy facts to disposition, not parity requirements. | Owner and Architect disposition at Stages 4 and 9. Stage 3 may confirm reachability. | owner via PM | open. Parity rows UF-001, UF-004, UF-015, UF-016 cite the evidence. **Owner decision:** Q3 is deferred to Stages 4 and 9 (`legacy-open-questions-q2-q4:xplanner2-revision1`). The presence of insecure behavior in the legacy package is **not** owner permission to carry it into the new application. Facts and rows are in [Owner Decisions And Open Questions](#read-owner-decisions-and-open-questions). |
| GAP-008 | Context-path inconsistencies: `META-INF/context.xml` and `sun-web.xml` use `/xplanner-plus`, `geronimo-web.xml` uses `/xplanner`, compose deploys `/xplanner-legacy`, the effective `xplanner.application.url` is `http://localhost:8080/xplanner`, and the WAP pages and formatting-help link hard-code `/xplanner`. | Links in the "me" page, footer, WAP and help depend on deployment. This affects Stage 3 planning and rows in UF-004, UF-011 and UF-018. | Stage 3 launcher must choose and record the context path. The owner decides parity at Stage 4. | PM, owner | open. Provenance: the application URL value is in a rewritten entry (GAP-005 P-04). The same URL is fetched by the e-mail formatter for its stylesheet (BA-001-03, F-006; row 200). |
| GAP-009 | Data- and permission-dependent rules cannot be settled statically: permission evaluation order, default task disposition, e-mail recipients, chart content, iteration option lists, search scope details, and the conditions inside `TimeEditorForm#valideRow` (keys are known, but the branch conditions are inferred from the key and message; rows 151-159). | The affected rows stay `Inferred`. | Stage 3 walkthrough with role accounts. | BA (Stage 3) | open |
| GAP-010 | Workbook visual render pass is blocked: no approved renderer is available (PM decision). The Excel Desktop open check passed (see below). | The workbook instructions require a rendered visual inspection before delivery. | PM or owner obtains render evidence, or accepts the blocked state. | PM | open (render blocked) |
| GAP-011 | The 102 library JARs were not analysed beyond entry names. Framework behavior (Struts, Spring, Hibernate, Axis, Jersey, displaytag) is assumed standard for the bundled versions. | Framework defaults such as validation, paging, error handling and message fallback are inferred. Examples: which locale a message lookup without a locale uses (the stored task type label, row 134), and the fallback to the default bundle for keys that a bundle lacks (CHK-004 notes). Further examples (BA-001-05):
<br>- whether Hibernate passes unqualified column names in HQL (`userid` in the login query, row 11; `attachedTo_Id` in SOAP `getNotesForObject`, row 218) to SQL unchanged;
<br>- that an unresolvable dotted property path fails the query (rows 209, 211, 218, 219, 226);
<br>- how a child Spring context that redefines the parent's beans behaves (row 65). | Stage 3 observation. | BA | open |
| GAP-012 | The people import page offers `files/peopleImportTemplate.xls`, while `ImportPeopleAction` parses comma-separated text lines. | Behavior with the offered template is unclear. | Stage 3 test, then Stage 4 disposition. | BA, owner | open (QUESTION) Q4 is deferred to Stage 4 (`legacy-open-questions-q2-q4:xplanner2-revision1`). |
| GAP-014 | Effects found only statically during the BA-001-03 and BA-001-05 sweeps. BA-001-03: AF-01 (iteration metrics repository is null), AF-02 (role editor save hook never called), the WAP DispatchForward projectId requirement and the jQuery/locale date-picker conflict. BA-001-05: queries on property paths that the entities do not map (iCal feed, SOAP `getCurrentIteration` and `deleteAttribute`, jrpdf data sources; pass-003 F-001), and the double loading of `spring-beans.xml` (duplicate reminder job and Liquibase run; pass-003 F-002). They rest on bytecode listings, call graphs and descriptor reads, not on runtime. | Rows 35, 65, 70, 106-107, 198-199, 209, 211, 218, 219, 226 and 232 carry these conclusions as `Partial` or `Inferred`. | Stage 3 confirmation with the affected roles and locales; for BA-001-05, an iCal request, the two SOAP calls and a count of reminder e-mails and Liquibase runs per startup. | BA (Stage 3) | open. [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stages/stage-01/stage-02-pass-001-dispositions.md); [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](./stages/stage-01/stage-02-pass-003-dispositions.md) |
| GAP-013 | `xplanner-plus-activity.log` at the WAR root is a runtime artifact from the original build machine. It contains user IDs and IP addresses from 2011-12-03. | Excluded as evidence. The file ships in the package and is served statically if the container allows it. | Owner or Architect note for the target (do not ship runtime logs). | owner via PM | recorded |

**Excel Desktop open check (GAP-010 detail).** `npm --prefix analysis/tools run audit:workbook:excel` was run once, after the final workbook write, with project-local temp directories. It exited 0 and printed `EXCEL DESKTOP OPEN AUDIT OK`: a read-only COM open in the installed Excel Desktop (Office16). The workbook's SHA-256 was identical before and after the check. Only the visual render pass remains blocked.

<a id="read-gap-005-per-conclusion-impact"></a>

**GAP-005 per-conclusion impact (fixed baseline provenance).**

- **Method:** a read-only ZIP metadata inspection (`.migration-tmp/stage-01/tools/zipmeta.js`, output `out/zipmeta.json`) plus per-file reads of the affected entries.
- **Findings:**
  - All 1090 entries share the same host OS and "made by" version, and none has an extra field.
  - Local headers are in order.
  - Exactly 3 entries have "version needed to extract" 2.0 instead of 1.0. They are entries 864, 877 and 878: `WEB-INF/classes/spring-beans.xml`, `WEB-INF/classes/xplanner-custom.properties` and `WEB-INF/classes/xplanner.properties`.
  - The timestamps of those 3 entries look like those of their neighbours. Timestamps therefore cannot identify patched entries.
- **How to read the results:** this is a sign that the three entries were rewritten after packaging, not proof. Its absence on other entries does not prove they are original.
- **The rows still describe this baseline:** workbook `Source implemented?` values are unchanged, because they describe this baseline's behavior. Affected rows carry a `Provenance (fixed baseline...)` note in their evidence cell with the codes below.

| Code | Affected conclusion | Evidence of patch or uncertainty | Affected rows / findings | Check blocked by the missing original | What that check would require |
|---|---|---|---|---|---|
| P-01 | Database engine MySQL, `XPlannerMySQLDialect`, driver `com.mysql.jdbc.Driver`, URL host `db`, database user and password, `xplanner.migration.databasetype=mysql`, and therefore no in-process HSQLDB server. | The known patch. `WAR:WEB-INF/classes/xplanner.properties:9-17` and `WAR:WEB-INF/classes/xplanner-custom.properties:18-24` are rewritten entries. In the custom file, MySQL values sit under the comment "Hibernate HSQLDB Configuration - embedded persistent HSQLDB". The compiled class `com.technoetic.xplanner.db.hibernate.XPlannerMySQLDialect` exists, so MySQL support is part of the package code. | Rows 55, 64, 66, 67; the Data And Integrations relational-database row; Source Inventory configuration row | Which database engine and connection values upstream v1.1a4 shipped. Whether the HSQLDB startup listener would start a server in upstream. | The unpatched upstream v1.1a4 WAR, or an attributable copy of the upstream `xplanner.properties` and `xplanner-custom.properties`. Stage 3 can observe this baseline's behavior but cannot settle what upstream shipped. |
| P-02 | Connection pool `defaultAutoCommit=false` and its effect on password change and transaction behavior. | `WAR:WEB-INF/classes/spring-beans.xml:65-68`. Its comment states that the setting fixes a MySQL autocommit error in `changePassword`, so the setting is treated as patch-introduced. | Row 47 (password change); Data And Integrations relational-database row | Whether upstream used autocommit pool connections and how password change behaved there. | The upstream `spring-beans.xml`. The baseline behavior itself can be observed at Stage 3. |
| P-03 | All non-database values read from `xplanner.properties`: login modules, error filing text, progress bar, chart display, story import headers, default priority, twiki schemes, integration listeners, SMTP defaults, search scope, auto-extend, export formats. | A rewritten entry with no content sign of change for these keys. It is not guaranteed upstream. | Rows 9, 11, 21, 56, 67, 93, 108, 109 (progress chart flag, BA-001-05), 110, 114, 117, 121, 177, 188, 196, 201, 203, 206 | Whether each of these values is the upstream default. | The upstream `xplanner.properties`. Baseline behavior is not blocked. |
| P-04 | Values read from `xplanner-custom.properties` other than database: `xplanner.application.url=http://localhost:8080/xplanner` (the link base for the "me" page and system info), `login.instructions.url`, `hibernate.show_sql=false`. | A rewritten entry and the named patch target in the README. The entry timestamp (2011-12-03 13:26) differs from the build time; whether that reflects upstream packaging or the patch cannot be determined. | Rows 9, 67, 187, 201; GAP-008 | Whether upstream shipped these override values or an empty template. | The upstream `xplanner-custom.properties`. |
| P-05 | Bean wiring in `spring-beans.xml` other than P-02: Liquibase bean and contexts, session factory scanning `net.sf.xplanner.domain` with only `mappings/Metrics.xml`, the scheduled missing-time-entry job, the commented Quartz scheduler, event bus, REST component scan, search, file system, export, e-mail and the person-edit cache advisor. | A rewritten entry. No other line shows a patch sign. For the "Integration/Feature not mapped" conclusion, the compiled `HibernateHelper` class list independently omits both classes. | Rows 33, 64, 65 (double loading, BA-001-05), 67, 111, 171, 177, 192, 194, 198, 202, 204, 221; GAP-004; Source Inventory Spring and persistence rows | Whether upstream wired the same beans. In particular, whether upstream loaded additional mapping files, scheduled data sampling or registered the per-change e-mail listener. | The upstream `spring-beans.xml`. |
| P-06 | Everything else: 1087 entries without a rewrite sign, including `web.xml`, `struts-config.xml`, `action-servlet.xml`, `db-changelog.xml` (schema and seed), `META-INF/context.xml` (context path `/xplanner-plus`), JSPs, classes and JARs. | No metadata or content sign of modification was found. Under the owner decision they are not assumed unmodified. | All other rows; GAP-003, GAP-004, GAP-008 | A byte-level originality check of any entry. | The upstream WAR, or published upstream checksums per entry. Not required for describing this baseline. |
| P-07 | Documentation contradiction (hints only): [`legacy/README.md`](../legacy/README.md) lines 10-12 say only `xplanner-custom.properties` was patched. [`legacy/docker-compose.yml`](../legacy/docker-compose.yml) line 6 calls the MySQL configuration in `xplanner.properties` "stock", while line 36 says the WAR was patched. | The metadata shows three rewritten entries, so neither hint is complete. | Scope And Provenance; P-01, P-02 | Which of the three entries was changed by the documented patch, and by how much. | The upstream WAR, or the patch record of the earlier experiment. The earlier project may not be consulted under the task boundaries and A2. |

- **Result:** the reconnaissance of all remaining scope continued. None of the blocked checks prevents describing this baseline's behavior.

No blocker prevents a Stage 2 review of this draft. The gaps above bound what Stage 2 can verify statically.

<a id="read-owner-decisions-and-open-questions"></a>

## Owner Decisions And Open Questions

The owner, `ekzarov`, decided the following on 2026-09-24 in chat. PM recorded the decisions in [`analysis/migration_status.yaml`](./migration_status.yaml) `owner_decisions`. BA records them here and applies them; BA does not make them. Workbook row numbers refer to the `User Flows` sheet of [`analysis/legacy_user_flows.xlsx`](./legacy_user_flows.xlsx).

| Question | Decision / state | Decision ID | Scope applied in this record |
|---|---|---|---|
| Q1: supply an unpatched upstream WAR? (GAP-005) | **Decided.** No original will be supplied. [`legacy/`](../legacy) is investigated as this project's fixed baseline and is never described as an unmodified original. The known patch and provenance limits stay explicit, and impacts are recorded per conclusion. | `legacy-baseline-provenance:xplanner2-revision1` | [Scope And Provenance](#read-scope-and-provenance); [GAP-005 per-conclusion impact](#read-gap-005-per-conclusion-impact); provenance notes in 31 workbook rows |
| Q2: parity scope for broken or dormant surfaces | **Open, deferred to Stage 4.** Observed behavior only; BA does not choose what to carry over, fix or exclude. | `legacy-open-questions-q2-q4:xplanner2-revision1` | Facts below |
| Q3: disposition of insecure legacy behavior (GAP-007) | **Open, deferred to Stages 4 and 9.** The presence of insecure behavior in the legacy package is **not** owner permission to carry it into the new application. | `legacy-open-questions-q2-q4:xplanner2-revision1` | Facts below |
| Q4: people-import file format (GAP-012) | **Open, deferred to Stage 4.** | `legacy-open-questions-q2-q4:xplanner2-revision1` | Facts below |

**Q2 facts: surfaces that the package shows as broken, dormant or reachable only by URL.** These are observations, not dispositions.

| Surface | Observed fact and evidence | Workbook rows | Related gap |
|---|---|---|---|
| Story features (view, edit, delete; project and iteration lists) | Action type `net.sf.xplanner.domain.Feature` is absent; `com.technoetic.xplanner.domain.Feature` is unmapped; links are commented out (`WAR:WEB-INF/action-servlet.xml:96-100,202-212`; `WAR:WEB-INF/jsp/view/iteration/links.jsp:32-35`) | 192 | GAP-003, GAP-004 |
| Continuous integration queue | Entity class unmapped; no live link (`WAR:WEB-INF/struts-config.xml:388-394`) | 194-196 | GAP-004 |
| Settings pages | Editor JSP absent; list page unlinked (`WAR:WEB-INF/struts-config.xml:405,419-421`) | 59-60 | GAP-003 |
| JasperReports (jrpdf) exports | Templates `JR*.jrxml` absent (class `PdfReportExporter`) | 209, 211 | GAP-003 |
| Tabbed iteration view | `view/iterationTabs.jsp` absent (`WAR:WEB-INF/struts-config.xml:199-201`) | 104 | GAP-003 |
| Not-authorized page | `security/notAuthorized.jsp` absent (`WAR:WEB-INF/struts-config.xml:139`) | 28 | GAP-003 |
| Mobile WAP pages | Links hard-code `/xplanner`; web filter may intercept mobile login; DispatchForward requires a projectId the links do not pass (`WAR:WEB-INF/mobile-struts-config.xml:20-49`) | 230-232 | GAP-008, GAP-014 |
| JAX-WS endpoint | Servlet commented out, class absent (`WAR:WEB-INF/sun-jaxws.xml:3`) | 217 | GAP-003 |
| File manager | Reachable only by URL (`WAR:WEB-INF/struts-config.xml:401-403`) | 175 | none |
| Project role editor | Reachable only by URL (`WAR:WEB-INF/struts-config.xml:409-411`); the role-saving hook is never called (AF-02) | 35 | GAP-014 |
| Iteration metrics | The metrics repository is null, so the developer figures are expected to be empty (AF-01; class `ViewIterationMetricsAction#getRepository`) | 106-107 | GAP-014 |
| Task re-estimate page | Mapped to a plain Struts `Action` (`WAR:WEB-INF/action-servlet.xml:298`) | 160 | none |
| Iteration task board | Parameter mismatch between link and REST call (`WAR:WEB-INF/jsp/view/dashboard.jsp:132`) | 113 | none |
| iCal feed | Both queries use `task.story`, which `Task` does not map; an error response is expected (class `iCalServlet#generateTimeEntryData`, `#generateTaskData`, `#doGet`) | 226 | GAP-014 |
| SOAP `getCurrentIteration` and `deleteAttribute` | Undeclared alias `object` and missing `projectId` (`XPlanner#getCurrentIteration`); `a.targetId`/`a.name` on an entity with an embedded id (`AttributeRepositoryImpl#delete`) | 218-219 | GAP-014 |
| jrpdf report data sources | `task.story` in `PdfReportExporter$UserStoryDataSource` and `$PersonDataSource`, in addition to the missing templates | 209, 211 | GAP-003, GAP-014 |
| Duplicate Spring context | `spring-beans.xml` is loaded by the root context and by the Struts plug-in context (`WAR:WEB-INF/web.xml:32-38`, `WAR:WEB-INF/struts-config.xml:438-441`); duplicate reminder e-mails and Liquibase run expected | 65, 198-199 | GAP-014 |
| Delete person, change locale, formatting help | Unlinked route, or a hard-coded `/xplanner` link | 49, 58, 189 | GAP-008 |
| Admin and test utilities in the production configuration | `WAR:WEB-INF/web.xml:233` loads `test-struts-config.xml` | 61-63 | GAP-007 |

**Q3 facts: insecure legacy behavior observed statically.**

The presence of this behavior is **not** owner permission to carry it into the new application. The disposition belongs to Stages 4 and 9. Constitution Principle XI applies.

| Observation | Evidence | Workbook rows |
|---|---|---|
| Remember-me stores user ID and password in Base64 cookies; the box is checked by default | `WAR:WEB-INF/jsp/security/login.jsp:29`; class `com.technoetic.xplanner.security.CredentialCookie#set` | 15-16 |
| Passwords are stored as salted MD5 digests | class `XPlannerLoginModule#digestPassword` (string "MD5") | 11 |
| No security filter on `/rest/*`, including task status update | `WAR:WEB-INF/web.xml:130-181` (no mapping for `/rest/*`) | 221-224 |
| The SOAP servlet is also mapped at `/servlet/AxisServlet`, outside the Basic filter | `WAR:WEB-INF/web.xml:298-301` | 214 |
| The Axis global configuration contains a default `adminPassword` parameter | `WAR:WEB-INF/server-config.wsdd:4` | 213 |
| `/do/invalidateHibernateCache` bypasses login | `WAR:WEB-INF/security.xml:5` | 61 |
| Test and admin actions are loaded in production (clock shift, property edit, data sampling, notifier) | `WAR:WEB-INF/web.xml:233`; `WAR:WEB-INF/test-action-servlet.xml:4-20` | 61-63 |
| The task time-log query is built by concatenating the `oid` request parameter into an HQL `where` clause | `WAR:WEB-INF/jsp/view/task.jsp:102` | 142 |
| The system information page shows the database URL and user (password masked) | class `com.technoetic.xplanner.SystemInfo#getDatabaseInfo` | 55 |
| Database credentials are present in the shipped properties (values not reproduced, A3) | `WAR:WEB-INF/classes/xplanner.properties:14-15`, `xplanner-custom.properties:23-24` (P-01) | 67 |
| An unreferenced debug page echoes request credentials (unreachable, no row) | `WAR:WEB-INF/jsp/wap/auth.jsp` | none |
| **No server-side permission check on generic web view, create/edit and delete actions or on most other web actions; any signed-in user can act by direct URL** (BA-001-03, F-001) | `ViewObjectAction#doExecute`, `EditObjectAction#updateObject`, `DeleteObjectAction#doExecute`; `.migration-tmp/stage-01/out/authtrace.json` | 26, 28-30 |
| System-administrator status is governed on the server by `admin.edit.role` on project 0. The `sysadmin.promote` checkbox only controls display: a direct request can grant the role, and saving the person editor without the checkbox revokes it (BA-001-04, F-007) | `WAR:WEB-INF/jsp/edit/editPerson.jsp:144-151`; class `EditPersonHelper#modifyRoles` (`deleteForPersonOnProject("sysadmin", ...)`, `#setSysadmin`) | 31, 34 |
| Descriptor URL role constraints are never evaluated (F-001, F-004) | `SecurityConfiguration#isAuthorized` has no caller; `WAR:WEB-INF/mobile-security.xml:11-15` | 32, 231 |
| Personal timesheet and ID jump apply no read check | `ViewTimesheetAction`, `IdSearchAction` (no authorization call reachable) | 163, 183 |
| SOAP attribute operations have no permission check | `XPlanner#setAttribute`, `#getAttribute`, `#deleteAttribute`, `#getAttributes`, `#getAttributesWithPrefix` | 216 |
| The commented `NullSecurityFilter` would log every request in as a default user if re-enabled (dormant) | `WAR:WEB-INF/web.xml:76-83`; class `NullSecurityFilter` (strings `defaultUserId`, `sysadmin`) | none |

**Q4 facts: people import.**

- The import page links an Excel template `WAR:files/peopleImportTemplate.xls` (`WAR:WEB-INF/classes/ResourceBundle.properties:574`).
- The importer reads text lines split by commas (class `ImportPeopleAction`: `BufferedReader.readLine`, `String.split`).
- The page's own help text describes the comma-separated format (`ResourceBundle.properties:572`).
- Workbook rows 50-53 are affected (GAP-012).

<a id="read-parity-map-boundary"></a>

## Parity-Map Boundary

**In scope for [`analysis/legacy_user_flows.xlsx`](./legacy_user_flows.xlsx)** (208 atomic rows in 18 epics, ordered entry capabilities, then core domain, then supporting features, then interop):

| Epics | Content |
|---|---|
| UF-001..UF-004 | Authentication and session, authorization and roles, people management, platform/administration/errors |
| UF-005..UF-009 | Projects, iterations, user stories, tasks, time tracking and timesheets |
| UF-010..UF-014 | Notes, attachments and files; search, navigation and history; continuous integration queue; notifications and scheduled jobs; export and reports |
| UF-015..UF-018 | SOAP API, REST/JSON API, iCalendar feed, mobile WAP |

- Row statuses, counted from the workbook after BA-001-05: 112 `Yes`, 75 `Inferred`, 20 `Partial`, 1 `No` (208 in total).
- BA-001-05 added 6 rows, changed the content of 16 and renumbered references in 8; see [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](./stages/stage-01/stage-02-pass-003-dispositions.md).
- BA-001-04 added 9 and changed 59; see [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](./stages/stage-01/stage-02-pass-002-dispositions.md). BA-001-03 added 14 and changed 10; see [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stages/stage-01/stage-02-pass-001-dispositions.md).
- Every detail row is red (open). Destination and SDD columns I:N are blank, as the Stage 1 instructions require.
- Surfaces that are dormant, unreachable or broken are kept as rows with `Partial`, `Inferred` or `No` rather than dropped. Examples: features, integration queue, settings, jrpdf reports, file manager, project role editor, tabbed iteration view, JAX-WS endpoint.

**Mechanical coverage cross-check** (the row data is compared with `out/action-lines.txt` and `out/jsp-list.txt`, with line ranges expanded).

- All 87 distinct Struts action paths are cited in row evidence, either by path or by descriptor line.
- 68 of the 73 JSPs are cited by name (recounted in BA-001-04 and again in BA-001-05; `layout/viewLayoutNew.jsp` is cited by row 191).
- The 5 JSPs not cited are:
  - four layout fragments with no behavior of their own: `common/header.jsp`, `common/formattingHelpJS.jsp`, `layout/viewHeader.jsp`, `layout/viewFooter.jsp`;
  - `wap/auth.jsp`, which is unreferenced debug markup and excluded.

**Excluded, and why.**

- Pure presentation assets: CSS, images, jQuery/dojo libraries, tooltips.
- Unused libraries and assets: p6spy, `flash/Dashboard.swf`, `js/chart.html`, the `tiles:print` definition and `PrintLinkTag` (no user).
- Unwired classes: `CsvExporter`, `TomcatUserImporter`, the autopatch launchers, and the dormant items listed in the Source Inventory row "Dormant and unreferenced code" (F-005).
- The unused `xplanner-custom-*.properties` variants.
- Displaytag table export, which is configured but enabled on no table.
- Third-party library internals.
- These exclusions are recorded here so that Stage 2 can challenge them.

**Derivation statement.** The workbook was derived only from the WAR contents listed above. [`legacy/README.md`](../legacy/README.md), `PREPARATION.md` and `META-INF/releaseNotes.txt` served only as navigation hints. No prior migration record, example or memory was used (amendment A2). The rows describe the behavior of this fixed baseline package, not of an unmodified upstream XPlanner+. The 31 rows whose conclusions depend on rewritten entries carry provenance notes (GAP-005).

**First-pass status.** An adversarial second pass was performed. It compared rows against the enumerated action, JSP, servlet, filter, listener, job and endpoint lists and added rows for:

- login instructions;
- configuration layering and UTF-8 request encoding;
- date formats;
- the tabbed iteration view;
- task type labels;
- the attachment reference count (described as a download counter until BA-001-04, F-004);
- the page-width toggle.

Stage 1 remains a draft until the independent Stage 2 review.

<a id="read-return-correction-evidence-conditional"></a>

## Return Correction Evidence (Conditional)

On return, the primary agent follows the
[Stage 1 re-entry procedure](reviews/README.md#stage-1-re-entry).
Record links to the exact triggering report and per-finding dispositions here
or in a linked Stage 1 correction record. Preserve valid discovery evidence;
review findings guide source checks, not an automatic restart or blind edits.
On first entry, record "not applicable: first entry" instead of inventing a review.

| Triggering report / finding ID | Source check and disposition | Changed section / map row | Check evidence / remaining work | Independent verification |
|---|---|---|---|---|
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-001 (high) | accepted, mechanism narrowed: no server-side check on web view/edit/delete and most actions; DispatchForward does check when its default flag is on | Runnable Surfaces enforcement table; GAP-007; Q3 facts; rows 26, 28-32, 163, 183, 216, 223, 231-232 | `authtrace.js`, `disasm.js`; Stage 3 confirmation open | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-002 (medium) | accepted | row 185 rewritten, row 186 added | `authtrace.json` history sinks | pending |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-003 (low) | accepted | rows 68-70 (old row 63 split) | all 10 bundles compared | pending |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-004 (low) | accepted | Source Inventory security configuration row; rows 32, 231 | caller search with positive control | pending |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-005 (low) | accepted, extended by a mechanical orphan scan | Source Inventory dormant-code row; Q3 facts; Parity-Map Boundary exclusions | `out/orphans.txt` | pending |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-006 (low) | accepted | Data And Integrations; GAP-008; row 200 | class symbols | pending |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-007 (medium) | accepted | rows 166, 179 added; related rows 163, 183 added | `authtrace.json`; class symbols | pending |
| [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md) F-008 (low) | accepted | Data And Integrations file storage; row 171 (`Inferred` to `Yes`) | class symbols; `db-changelog.xml:234` | pending |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-001 (medium) | accepted | rows 88, 151 corrected; rows 152-159 added (8 time-entry validation conditions); GAP-009 | `TimeEditorForm#valideRow` constants; bundle keys at `ResourceBundle.properties:265,675-684`; form-key sweep of all 27 form classes | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-002 (low) | accepted, extended (person delete, note delete) | rows 81, 90, 125, 141 (cascades); rows 49, 173 | `@OneToMany`/`@OneToOne` cascade annotations; `db-changelog.xml:258-267` foreign keys; `NoteHelper#deleteNote` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-003 (low) | accepted | row 191; Data And Integrations social row | `viewLayout.jsp:73-88,92-95`; `viewLayoutNew.jsp:114-117` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-004 (low) | accepted | row 170; Parity-Map Boundary first-pass list | `Note#getAttachmentCount`; `notes.jsp:80-92`; bundle label per variant | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-005 (low) | accepted | rows 14, 97 | `AuthenticationAction#execute` bytecode listing; `editIterationStatus.jsp:43-47,58-60` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-006 (low) | accepted | row 75 | `projects.jsp:65-75,82-84` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-007 (medium) | accepted, extended (row 31 authorizer use, full CHK-002 row sweep) | rows 23-27, 31, 33-35, 38 and all display-gated rows; Runnable Surfaces enforcement table; GAP-007; Q3 facts | `EditPersonHelper#modifyRoles`; `out/authtrace.json` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-008 (low) | accepted | row 116 (`Partial` to `Yes`); row 118 added; Source Inventory absent-resources row; GAP-003; Data And Integrations | `ImportStoriesAction#execute` exception table; `#setCookies`, `#populateForm` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-009 (low) | accepted, mechanism narrowed (stored label follows the server default locale) | row 134 (`Yes` to `Inferred`), row 226; GAP-011 | `out/task-type-labels.json` (all 10 bundles); `editTask.jsp:52-69`; `iCalServlet#generateTaskData` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md) F-010 (low) | accepted | Build, Run, And Test Evidence figures; GAP-001; Parity-Map Boundary; Stage 1 Exit Checklist; reading block | figures regenerated from the workbook and a search for superseded numbers | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-003.md`](./reviews/stage-02-pass-003.md) F-001 (medium) | accepted, extended (SOAP `deleteAttribute`, jrpdf data sources, undeclared alias in `getCurrentIteration`) | rows 11, 194, 209, 211, 218, 219, 226 (`Yes` to `Partial`); Source Inventory persistence row; Runnable Surfaces; GAP-011, GAP-014; Q2 facts | `hql-sweep-05.js` over 105 query sources; `iCalServlet` and `XPlanner` bytecode listings | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-003.md`](./reviews/stage-02-pass-003.md) F-002 (low) | accepted, extended (third loader without caller; Tiles read by two containers) | row 65 added; rows 64, 198, 199; Source Inventory Spring row; Runnable Surfaces job and bootstrap rows; Data And Integrations SMTP row; GAP-014; Q2 facts | `loaders-05.js` over 55 configuration files; `web.xml:32-38,194-196,227-249`, `struts-config.xml:438-441` | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-003.md`](./reviews/stage-02-pass-003.md) F-003 (low) | accepted, extended (merge branch of `MoveContinueTaskForm`, merge path of `TaskEditorForm`) | rows 52, 123, 131, 146 added; rows 130, 136, 145 | `chk005-validators-05.js` (17 validators, 47 keys, positive control) | pending: next fresh Stage 2 pass |
| [`analysis/reviews/stage-02-pass-003.md`](./reviews/stage-02-pass-003.md) F-004 (low) | accepted | row 109 added; rows 108, 110, 111; Source Inventory Charts row | `iterationStatistics.jsp:155-191`, `xplanner.properties:66-68`; `jsp-charts-includes-05.js` | pending: next fresh Stage 2 pass |

The pass-003 per-finding details are in [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](./stages/stage-01/stage-02-pass-003-dispositions.md). They include the query, loader, validator and chart sweeps and the source checks for the reviewer proposals P-1 and P-2. The pass-002 per-finding details are in [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](./stages/stage-01/stage-02-pass-002-dispositions.md). They include the CHK-002, CHK-003 and CHK-004 sweep row lists and the source checks for the reviewer proposals P-1 to P-3. The pass-001 details are in [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stages/stage-01/stage-02-pass-001-dispositions.md). They include the source evidence, checks performed, remaining work, the sweep findings AF-01 and AF-02, and the reviewer checklist proposals.

BA-001-02 is a bounded correction within the first entry. It applies an owner decision; it is not a review return. Its changes are recorded in [Owner Decisions And Open Questions](#read-owner-decisions-and-open-questions) and in [GAP-005 per-conclusion impact](#read-gap-005-per-conclusion-impact). No review finding exists yet.

<a id="read-stage-1-exit-checklist"></a>

## Stage 1 Exit Checklist

- [x] Source provenance is pinned (hashes, revision, build metadata, ZIP rewrite signs). The package is the project's fixed baseline (Q1 decided). The residual patch impact is recorded per conclusion in GAP-005.
- [x] Legacy surfaces and actors are inventoried (web UI roles, WAP, SOAP, REST, iCal, jobs, operator utilities).
- [x] Runtime status is explicit for every surface (all `inferred` or `blocked`; none live).
- [x] Data and integration dependencies are recorded.
- [x] Evidence and uncertainty are distinguished (the `Yes`/`Partial`/`Inferred`/`No` legend; GAP-001, GAP-009).
- [x] The parity workbook is populated and linked to concrete evidence (208 rows after BA-001-05).
- [x] Known exclusions and blockers are visible.
- [ ] Required deterministic audits pass. `audit:workbook`, `audit:project`, `audit:artifact-links` and `artifact-reading.js` pass (BA-001-04). The visual render pass is blocked (GAP-010), so this box stays unticked. This checklist is the author's draft self-assessment, not stage closure; closure needs a clean Stage 2 pass.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

- **Self-check, BA-001-05 (current):** Stage 1 re-entry after [`analysis/reviews/stage-02-pass-003.md`](./reviews/stage-02-pass-003.md). The scope is both Stage 1 records and the correction record [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](./stages/stage-01/stage-02-pass-003-dispositions.md), at the versions given in RESULT BA-001-05.
  - Checklist [`analysis/error-prevention-checklist.md`](./error-prevention-checklist.md) SHA-256 `ea8f330956ff82b5bf05a2f62439225c337cb8a7c43d81b2486074bac8e14138`. Applicable checks: **CHK-001..CHK-007**. Pass 003 linked F-003 to CHK-005 and F-002 to CHK-003.
  - **CHK-001:** `.migration-tmp/stage-01/tools/chk001-ba-001-05.js` checked every new or changed line citation in the workbook rows, this record and the correction record, and the row references used by BA-001-05 text. The final run has 0 failures; the counts are in RESULT BA-001-05.
  - **CHK-002:** the changed rows state no new permission condition. Row 219 keeps its server-side statement.
  - **CHK-003:** the configuration loaders were swept for every configuration file (F-002). Every query an effect depends on was checked against the entity mappings (F-001).
  - **CHK-004:** no locale-dependent statement changed. The CHK-004 notes that point to the date rows now cite rows 68-70.
  - **CHK-005:** all 17 validators and 47 keys are covered, with a positive control.
  - **CHK-006:** the delete rows are unchanged. SOAP `deleteAttribute` (row 219) is recorded as a failing query, not as a delete effect.
  - **CHK-007:** all figures in this record were regenerated from the rebuilt workbook and the sweep outputs, and the record was searched for superseded numbers.
- **Learning update, BA-001-05:** the reviewer proposals P-1 (query property paths against the mapped entities) and P-2 (every loader of a cited wiring file, and the effects of duplicate loading) each match an error confirmed by source verification. BA supports both; PM decides admission, and P-2 may be folded into CHK-003.
- **Self-check, BA-001-04 (historical):** Stage 1 re-entry after [`analysis/reviews/stage-02-pass-002.md`](./reviews/stage-02-pass-002.md). The scope is both Stage 1 records and the correction record [`analysis/stages/stage-01/stage-02-pass-002-dispositions.md`](./stages/stage-01/stage-02-pass-002-dispositions.md), at the versions given in RESULT BA-001-04.
  - Checklist [`analysis/error-prevention-checklist.md`](./error-prevention-checklist.md) SHA-256 `c4d1f2a73e246393546cbdf02c05ec9f9fe4ae045e97b31923a1ebaff9f6ed11`. Applicable checks: **CHK-001..CHK-004**. Pass 002 linked F-006 and F-008 to CHK-003, F-007 to CHK-002 and F-009 to CHK-004.
  - **CHK-001:** `.migration-tmp/stage-01/tools/chk001-ba-001-04.js` checked every new or changed line citation in the workbook rows, this record and the correction record. It also checked the existence of every line position in BA-001-04 row evidence, negative claims with positive controls, and the row references used by BA-001-04 text. One self-detected error was corrected before handoff: `editPerson.jsp:142-149` had been read off a `sed -n` listing whose leading blank lines were not visible, and is now `:144-151`. The final run has 0 failures; the counts are in RESULT BA-001-04.
  - **CHK-002:** applied to every row with a permission or role condition. The outcome per row is in [Runnable Surfaces](#read-runnable-surfaces) and in the correction record; no permission row is left without an enforcement statement.
  - **CHK-003:** applied to every row that attributes an effect, hook, helper, decorator or cascade. Rows 14, 75 and 116 were corrected, and cascade and cookie paths were added. The row list is in the correction record.
  - **CHK-004:** applied to every locale-dependent row. Rows 134 and 170 were corrected, and per-bundle notes were added to rows 14, 88, 97, 151-159, 162, 165 and 226.
  - All figures in this record were regenerated from the rebuilt workbook, and the record was searched for superseded numbers (F-010, proposal P-3).
  - Workbook row references were remapped mechanically after the 9 insertions (`.migration-tmp/stage-01/tools/remap-rows-04.js`) and checked against the rebuilt workbook.
- **Learning update, BA-001-04 (historical):** the reviewer proposals P-1 (form validation keys), P-2 (delete cascades) and P-3 (regenerate figures) each match an error confirmed by source verification. BA supports them; PM decides admission and deduplication. The self-detected CHK-001 error is already covered by CHK-001, so no new check is proposed.
- **Self-check, BA-001-03 (historical):** Stage 1 re-entry after [`analysis/reviews/stage-02-pass-001.md`](./reviews/stage-02-pass-001.md). The scope is both Stage 1 records and the correction record [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stages/stage-01/stage-02-pass-001-dispositions.md), at the versions given in RESULT BA-001-03.
  - Checklist [`analysis/error-prevention-checklist.md`](./error-prevention-checklist.md) SHA-256 `92ccefd8b635ad0563da76acb5363fce46609c5a9a9ace7b0a7d856e69ae591a`. Applicable check: **CHK-001**. The pass-001 findings carry no CHK link, so no CHK recheck is required by the review.
  - **CHK-001 passed** for every new or changed line citation in the workbook rows, this record and the correction record (`.migration-tmp/stage-01/tools/chk001-ba-001-03.js`; count and result in RESULT BA-001-03).
  - Workbook row references in this record were remapped mechanically after 14 insertions (`.migration-tmp/stage-01/tools/remap-rows.js`) and checked against the rebuilt workbook.
- **Learning update, BA-001-03 (historical):** the reviewer proposals P-1 (F-001), P-2 (F-002) and P-3 (F-003) each match an error confirmed by source verification. BA supports them; PM decides admission and deduplication. The sweep findings AF-01 and AF-02 suggest one related proposal: "Before recording a hook or injected dependency as effective, confirm that the hook overrides a called superclass method and that the injected value is non-null on the entry path." Details are in the correction record.
- **Self-check, BA-001-02 (historical):** Stage 1 first entry, bounded correction. The scope is both Stage 1 records at the result version given in RESULT BA-001-02.
  - [`analysis/error-prevention-checklist.md`](./error-prevention-checklist.md) has SHA-256 `92ccefd8b635ad0563da76acb5363fce46609c5a9a9ace7b0a7d856e69ae591a`. Applicable check: **CHK-001** (cited line numbers resolve to the cited file).
  - **CHK-001 passed.** Every new or changed line citation was taken from a per-file read and checked mechanically by `.migration-tmp/stage-01/tools/chk001-ba-001-02.js`:
    - 35 citations: each cited line or range exists and contains the cited element;
    - 1 negative claim (no `/rest/*` filter mapping in `web.xml:130-181`), with a positive control;
    - 62 workbook row references in this record, each matched to its flow in the current workbook;
    - result: 0 failures.
  - The two line citations inside the 31 workbook provenance notes (`spring-beans.xml:65-68` and `:80`) are included in that check.
  - Unchanged citations from BA-001-01 were checked then for existence of all 234 positions and review of each first line. They were not re-run under CHK-001's stricter content rule, because CHK-001 was applied to new and changed citations as PM instructed.
- **Self-check, BA-001-01 (historical, superseded for the current version):** Stage 1 first entry. The scope was both Stage 1 records at the result version given in RESULT BA-001-01.
  - [`analysis/error-prevention-checklist.md`](./error-prevention-checklist.md) has SHA-256 `26cdaa338c2a5ea091d027071cbf8cd3a750763fe3b06f5a1d77a1f1ecec20cf` and contains **no learned checks yet**. There are therefore no CHK IDs to apply, and an empty table does not mean Stage 1 passed.
  - In place of learned checks, the author applied the workbook instructions' quality rules, recorded as ordinary stage evidence:
    - read enclosing context and exclude commented code (comment-aware parsers and link scan);
    - enumerate categories mechanically before counting;
    - cite derived artifacts by symbol and shipped files by line (all 234 distinct cited line positions were machine-checked to exist, and the first cited line of each reference was reviewed);
    - pair every negative search with a positive control;
    - confirm the consumer of each configuration value (for example the mapping XMLs have no consumer and the Quartz trigger has no scheduler).
  - One self-detected error was corrected before handoff. Line references for `project.jsp`, `task.jsp` and `spring-security.xml` had been derived from concatenated listings. They were corrected, and all cited lines were re-verified mechanically.
- **Learning update, BA-001-02:** no new qualifying check. The provenance work surfaced no confirmed error. The earlier candidate is now covered by the admitted CHK-001.
- **Learning update, BA-001-01 (historical):** one candidate check was proposed to the coordinator (later admitted by PM as CHK-001): "When citing line numbers from a listing, derive them from a per-file numbered read, never from a multi-file concatenated listing; verify cited lines mechanically before handoff."
  - **Basis:** the self-detected error above, and the workbook rule "Cite derived artifacts by symbol, never by line number."
  - The coordinator decides admission and deduplication.

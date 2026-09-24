# Stage 2 Pass 004 Dispositions

**How was each Stage 2 pass 004 finding checked against the legacy source, and what changed in the Stage 1 records?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) creates this correction record on re-entry after a Stage 2 `findings` result.
- **Maintained / decided by:** The Stage 1 author writes it once per triggering pass. The independent Stage 2 reviewer verifies it in a new pass and never edits it. The owner decides only owner-reserved questions (here Q2-Q4, which remain deferred). PM integrates status.
- **Governing instructions:** Stage 1 re-entry ([`analysis/reviews/README.md`](../../reviews/README.md#stage-1-re-entry)) and the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol); Stage 1 in [`analysis/migration_methodology.md`](../../migration_methodology.md#stage-01).
- **When used:** Written after the triggering review and before the next fresh Stage 2 pass. The next reviewer reads it only in Phase B.
- **How used:** One disposition per finding, with source evidence, changed records and rows, checks actually performed, remaining work and responsible actor. The correction status is kept separate from independent verification.
- **Example:** A finding that a public page shows a secret is accepted, the source location is cited and the behavior is described, and the value itself is never copied (CHK-009).

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Corrections recorded for all 6 findings; not yet independently verified**
>
> The triggering record is [`analysis/reviews/stage-02-pass-004.md`](../../reviews/stage-02-pass-004.md) (result `findings`). All 6 findings were confirmed against the legacy source and accepted. The sweeps extended F-003 (the pool settings are not delivered either) and F-005 (the chart servlet is also unfiltered).
>
> The main correction is F-001. The login page's default-bundle help text states the factory default administrator login pair, and that pair matches the seeded account. This is recorded as observed insecure behavior. The value is not reproduced in any record or scratch output (owner decision `legacy-default-credential-classification:xplanner2-revision1`, CHK-009).
>
> The parity map moved from 208 to 210 rows: 2 added, 11 changed in content and 13 changed only by renumbered row references. Everything here is the author's correction, and a new fresh blind Stage 2 pass must verify it.
>
> **Next:** PM verifies RESULT BA-001-06 and launches a new fresh Stage 2 pass. Details: [Disposition Summary](#read-disposition-summary) / [Remaining Work And Next Gate](#read-remaining-work-and-next-gate).

<details>
<summary><strong>Contents</strong></summary>

- [Scope And Inputs](#read-scope-and-inputs)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Default credential on the login page](#read-f-001-default-credential-on-the-login-page)
  - [F-002 Task-board link parameter](#read-f-002-task-board-link-parameter)
  - [F-003 Hibernate and pool settings not delivered](#read-f-003-hibernate-and-pool-settings-not-delivered)
  - [F-004 Print layout by URL](#read-f-004-print-layout-by-url)
  - [F-005 Unauthenticated exposures](#read-f-005-unauthenticated-exposures)
  - [F-006 Outbound wiki request](#read-f-006-outbound-wiki-request)
- [Sweeps](#read-sweeps)
- [Credential Handling](#read-credential-handling)
- [Changed Rows](#read-changed-rows)
- [Checks Performed](#read-checks-performed)
- [Reviewer Checklist Proposals](#read-reviewer-checklist-proposals)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-scope-and-inputs"></a>

## Scope And Inputs

- **Task:** BA-001-06 (Stage 1 re-entry), role `ba`, mode `author`. It was performed by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, model `claude-opus-5-5`, who also wrote BA-001-01..05. PM assigned it on branch `stage-01/pass-004-corrections`, created from `main` `c43363d`.
- **Triggering record:** [`analysis/reviews/stage-02-pass-004.md`](../../reviews/stage-02-pass-004.md), SHA-256 `671b9bc9cb727bc806efbf6ef8cd508ac4ebf128b25f131f87bf763db3dd9240`, result `findings`. The ledger is [`analysis/reviews/evidence/S02-P004/comparison-results.json`](../../reviews/evidence/S02-P004/comparison-results.json), SHA-256 `dd91b8bec435abeebee5659ba69709a1dec0dbb3cca02494ed46ec8896773138`. Both were read and not modified.
- **Reviewed versions:** reconnaissance `a35a09ac…` and workbook `24630a19…` (208 rows), which is the BA-001-05 result.
- **Earlier correction records:** the [pass-001](./stage-02-pass-001-dispositions.md), [pass-002](./stage-02-pass-002-dispositions.md) and [pass-003](./stage-02-pass-003-dispositions.md) records. All three are historical, were not edited, and keep their own row numbering.
- **Authority for resolution:** the immutable [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) (SHA-256 `46ff9dc0…4edc`), the project's fixed baseline (owner decision `legacy-baseline-provenance:xplanner2-revision1`; P-01..P-07 in the [reconnaissance](../../legacy_reconnaissance.md#read-gap-005-per-conclusion-impact)).
  - `spring-beans.xml`, `xplanner.properties` and `xplanner-custom.properties` are the three rewritten entries (F-003, P-01, P-03, P-05).
  - `ResourceBundle.properties`, `login.jsp`, `db-changelog.xml`, `web.xml` and `log4j-war.xml` show no rewrite sign (P-06).
- **Credential rule:** owner decision `legacy-default-credential-classification:xplanner2-revision1`, constitution amendment A3 and CHK-009. See [Credential Handling](#read-credential-handling).
- **Not read:** the reviewer scratch areas `.migration-tmp/stage-02*/`, and earlier-migration examples (amendment A2). Every finding was resolved from the legacy source.
- **Method limits:**
  - There was no JDK, decompiler or runtime.
  - The author's own read-only Node tools under `.migration-tmp/stage-01/tools/` were used: the class dump, `disasm.js` (with exception tables), four new sweep scripts, a credential scan, and per-file numbered reads.
  - Framework behavior is recorded under GAP-011: container static serving, message fallback, and which dialect Hibernate picks.
- **Checklist:** [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md), SHA-256 `0c2350b24a1610a3b6eae768aad6b70a8eaabc7fd19d04ca83c7455d39f9df84` (CHK-001..CHK-009).
- **Owner constraints applied:**
  - Q2, Q3 and Q4 stay deferred.
  - Insecure behavior is recorded as observed risk. It is not permission to carry that behavior into the new application.
- **Workbook row numbers:** below they use the corrected workbook (BA-001-06 numbering). One row was inserted after each of the old rows 67 and 190. Old rows 68-190 therefore moved down by 1 and old rows 191-232 by 2.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows (new numbering) | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | medium | accepted | `WAR:WEB-INF/jsp/security/login.jsp:34-39`; `WAR:WEB-INF/classes/xplanner-custom.properties:49`; `WAR:WEB-INF/classes/ResourceBundle.properties:784`; `WAR:WEB-INF/classes/db-changelog.xml:403-404`; `XPlannerLoginModule#isPasswordMatched`, `#digestPassword` | rows 9, 11, 64; per-bundle notes on rows 8, 12, 13, 56; GAP-007; Q3 facts | owner via PM (Q3); BA (Stage 3 account preparation) | not yet |
| F-002 | low | accepted | `LinkTag#addNavigationParameters` (listing); `WAR:WEB-INF/jsp/view/iteration/globalLinks.jsp:14-18`; `WAR:WEB-INF/jsp/view/dashboard.jsp:101-103,131-132` | row 114 (`Partial` to `Yes`); Q2 fact removed | BA (Stage 3) | not yet |
| F-003 | low | accepted, extended | `WAR:WEB-INF/classes/spring-beans.xml:60-69,77-81`; no `hibernate.properties`; consumer sweep | row 68 added (`Inferred`); Configuration row; P-01 | BA (Stage 3) | not yet |
| F-004 | low | accepted | `ContentTag#doStartTag`, `PrintLinkTag#isInPrintMode` (listings); `WAR:WEB-INF/tiles-definitions.xml:23-28` | row 192 added (`Inferred`); Tiles row; Q2 facts; Parity-Map Boundary exclusions | owner via PM (Q2) | not yet |
| F-005 | low | accepted, extended | `WAR:WEB-INF/classes/log4j-war.xml:44-58`; `WAR:WEB-INF/web.xml:45-52,155-176,321-323`; `WAR:index.jsp:7-31`; `ActivityLogFilterHelper` | rows 18, 73; GAP-007, GAP-013; Q3 facts; Runnable Surfaces | owner via PM (Q3) | not yet |
| F-006 | low | accepted | `GenericWikiAdapter#isTopicExisting`, `#formatWikiWord` (listings); `WAR:WEB-INF/classes/xplanner.properties:113-116` | row 189; Data And Integrations wiki row | BA (Stage 3) | not yet |

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-default-credential-on-the-login-page"></a>

### F-001 Default credential on the login page

- **Reviewer claim (C-031, C-123, C-175, C-366, C-373):**
  - The login page shows `login.instructions` whenever the instructions URL is set, and the default-bundle text states the working default administrator credential.
  - Row 64 wrongly says the credential is documented only in [`legacy/README.md`](../../../legacy/README.md).
  - Row 9 lacks a per-bundle statement.
- **Source check:**
  - **Where the text appears:** `WAR:WEB-INF/jsp/security/login.jsp:34-39` renders `bean:message key="login.instructions"` with `arg0` set to `login.instructions.url` when that URL is not empty. The effective override sets the URL (`WAR:WEB-INF/classes/xplanner-custom.properties:49`). The default-bundle text at `WAR:WEB-INF/classes/ResourceBundle.properties:784` ends with a sentence that names a login name and a password.
  - **Match with the seeded account:** a script extracted both values and compared them, in memory only, with the seed:
    - the name equals the `userId` seeded at `WAR:WEB-INF/classes/db-changelog.xml:403`;
    - MD5 over the salt and then the UTF-8 password equals the digest seeded at `:404`.
    - The listing of `XPlannerLoginModule#isPasswordMatched` gives the digest layout: Base64 of a 12-byte salt followed by the MD5 digest; `#digestPassword` hashes salt first, then password.
    - Only the booleans were printed. No value was written to any file.
  - **Per bundle (CHK-004):** `login.instructions` exists in the default bundle (`:784`, with the credential sentence), in `ResourceBundle--.properties:780` and in `ResourceBundle_de.properties:753`. The last two have no credential sentence. The da, es, fr, it, ja, pt_br and ru bundles have no key and are expected to fall back to the default text (framework behavior, GAP-011).
  - **Earlier use of the pair:** whether earlier installations still accepted the pair is not established.
- **Changes:**
  - **Row 9:** requirement, description, expected result and evidence now record the disclosure without the value, plus the per-bundle note.
  - **Row 64:** the wrong sentence is replaced; the row cites `db-changelog.xml:403-404`.
  - **Row 11:** records the digest layout.
  - **Rows 8, 12, 13, 56:** per-bundle notes for the other public-page texts (the CHK-004 recheck the reviewer required).
  - **Reconnaissance:** GAP-007 and a new Q3 fact row.

<a id="read-f-002-task-board-link-parameter"></a>

### F-002 Task-board link parameter

- **Reviewer claim (C-064, C-222, C-372):**
  - `LinkTag#addNavigationParameters` adds `fkey` = the current `oid`, so the task board receives the iteration ID.
  - The first column is titled "not started", not "not-estimated".
- **Source check:**
  - The listing of `LinkTag#addNavigationParameters` reads the request's `oid` and puts `fkey`: the tag attribute `fkey` when it is non-zero, otherwise the `oid` value. It adds `returnto` and `projectId` when those options are on.
  - The dashboard link is rendered only on iteration pages for active iterations (`globalLinks.jsp:14-18`). On those pages `oid` is the iteration ID, so `dashboard.jsp:131-132` calls `rest/view/iteration/${param.fkey}/userstories` with that ID.
  - The column titles are "not started", "in progress" and "done" (`dashboard.jsp:101-103`).
  - `dashboard.jsp` makes no update call.
- **Changes:**
  - row 114 is rewritten and moves from `Partial` to `Yes`; the drag remains client-only;
  - the Q2 fact "Parameter mismatch between link and REST call" is removed.
- **Link-parameter sweep (proposal P-1):** every row that depends on a parameter being absent from a link was checked, and the tags that add parameters were listed (`out/render-side-effects-06.txt`):
  - `LinkTag` adds `fkey`, `returnto` and `projectId`;
  - `NavigationBarTag` reads `oid` and `fkey`.
  - Row 234 (the WAP `projectId` requirement) stays: the WAP pages use plain `<a href>` and `<go href>` links, which no tag rewrites (`WAR:WEB-INF/jsp/wap/project.jsp:13`).
  - Row 28 (`/do/view/integrations`) has no live link, so nothing changes.

<a id="read-f-003-hibernate-and-pool-settings-not-delivered"></a>

### F-003 Hibernate and pool settings not delivered

- **Reviewer claim (C-023, C-343, C-368):** the web `sessionFactory` receives no Hibernate properties, and no `hibernate.properties` ships. Dialect, `show_sql`, cache and query substitutions are therefore not applied.
- **Source check:**
  - `WAR:WEB-INF/classes/spring-beans.xml:77-81` configures the `sessionFactory` with only `dataSource`, `packagesToScan` and `mappingLocations`.
  - The pool at `:60-69` receives only the driver, URL, user and password placeholders, plus `defaultAutoCommit`.
  - There is no `hibernate.properties` or `hibernate.cfg.xml` in the WAR or at any JAR root. As a positive control, the same search found `ehcache-failsafe.xml` in `ehcache-1.2.3.jar`.
  - `HibernateHelper#initializeConfiguration` does add all properties, but only to a separate factory built by `#initializeHibernate`. Its only outside caller is `TomcatUserImporter#main`. Web requests get their session through `HibernateSessionFilter` and `HibernateHelper#getSession`, which reads the request attribute.
- **Extended by the consumer sweep (proposal P-3):** `config-consumers-06.js` looked up the 103 distinct keys of both effective property files by name. It searched class strings, string constants, JSP text and Spring placeholders.
  - 42 keys have no consumer: `hibernate.cache.*`, all `hibernate.dbcp.*` pool settings, the Quartz keys (the scheduler is commented out), 14 `actionbuttons.*` keys, `xplanner.scr.scheme.url` and three `xplanner.test.*` keys.
  - `hibernate.dialect` is read only for display (`SystemInfo`) and by the tool-only factory.
  - `hibernate.show_sql` is read only by `HsqlServer#isTraceOn`.
  - `hibernate.query.substitutions` is read only by `UseBeansTag`, which applies it to its own queries.
- **Changes:**
  - new row 68 (`Inferred`);
  - Source Inventory Configuration row;
  - GAP-005 P-01: the pool values are separated from the undelivered dialect.
  - The effect is framework-dependent (GAP-011).
  - Provenance: all three files are rewritten entries (P-01, P-03, P-05).

<a id="read-f-004-print-layout-by-url"></a>

### F-004 Print layout by URL

- **Reviewer claim (C-026, C-336, C-376):** `ContentTag#doStartTag` selects `tiles:print` when a `print` parameter is present.
- **Source check:**
  - The listing shows `ContentTag#doStartTag` calling `PrintLinkTag#isInPrintMode`, which returns true when `getParameter("print")` is not null, and then inserting `tiles:print`.
  - That definition extends `tiles:view` with `displayMode` `print` and empty header and footer (`WAR:WEB-INF/tiles-definitions.xml:23-28`).
- **Narrowed count:** after blanking comments, `xplanner:content` has 43 live opening tags in 43 JSPs. The reviewer's 76 appears to count other occurrences. The conclusion is unchanged. The `printLink` tag (`WAR:WEB-INF/xplanner.tld:707-708`) is used by no JSP, so the print view is reachable by URL only.
- **Rendering-path sweep (proposal P-4):** of all request parameters read by tag classes, `print` is the only one that switches the layout.
- **Changes:**
  - new row 192 (`Inferred`);
  - Tiles row;
  - a Q2 fact row;
  - the Parity-Map Boundary exclusion now names only the unused `printLink` tag.

<a id="read-f-005-unauthenticated-exposures"></a>

### F-005 Unauthenticated exposures

- **Reviewer claim (C-007, C-043, C-367):** the live activity log is written into the public web root, and `index.jsp` runs without a security filter.
- **Source check:**
  - **Activity log:** the `ACTIVITY_FILE` appender writes `${xplanner-plus.root}/xplanner-plus-activity.log` (`WAR:WEB-INF/classes/log4j-war.xml:44-58`). `webAppRootKey` sets `xplanner-plus.root` to the web application root (`WAR:WEB-INF/web.xml:45-52`). `ActivityLogFilterHelper` reads `getUserId`, `getRemoteAddr`, `getRequestURI` and `getQueryString`.
  - **Security filter coverage:** the filters cover `/do/mobile/*`, `/do/*`, `/setting/*`, `/soap/*` and `/ical/*` only (`web.xml:155-176`).
  - **`index.jsp`:** it is the welcome file (`:321-323`) and falls under none of these patterns. Its entry in `WAR:WEB-INF/security.xml:16` is never evaluated (row 32). Without a session it runs the `hidden = false` query and redirects to the current iteration's ID (`WAR:index.jsp:7-31`).
- **Unauthenticated-surface sweep (proposal P-2):** `unauth-06.js` checked servlet mappings and the welcome file against the filter url-patterns, and listed the web-root files, the runtime writers and the public-page bundle texts.
  - Unfiltered entry points are `/rest/*`, `/servlet/AxisServlet`, `/cewolf/*` (not recorded before) and `index.jsp`.
  - The web root ships 111 files, including 2 JSPs, the 2011 log and 2 import templates.
  - One appender writes into the web root. The `FILE` appender is referenced by no logger.
  - Of 41 public-page keys, one carries a credential (F-001).
- **Changes:**
  - rows 18 and 73 state their access condition;
  - GAP-007, GAP-013, three new Q3 fact rows;
  - the Runnable Surfaces activity-log and chart rows, and the new unauthenticated-surfaces list.
  - Static serving is container behavior (GAP-011).

<a id="read-f-006-outbound-wiki-request"></a>

### F-006 Outbound wiki request

- **Reviewer claim (C-094, C-113, C-292, C-361):** wiki-word rendering opens the configured wiki URL from the server.
- **Source check:**
  - `TwikiFormat` instantiates the class named by `twiki.wikiadapter`, which is `GenericWikiAdapter` (`WAR:WEB-INF/classes/xplanner.properties:113`), and calls `ExternalWikiAdapter#formatWikiWord`.
  - `GenericWikiAdapter#formatWikiWord` calls `#isTopicExisting`, which opens `new URL(...).openStream()` on the `topic.url.existing` pattern (`:114`). The class sets no timeout.
  - The exception table shows that an `IOException` returns false, so the word is rendered as a new topic. Only existing topics are added to the cache, so an unreachable wiki is contacted again on every rendering.
  - The outbound-call sweep found only this request and the known e-mail stylesheet fetch (`out/render-side-effects-06.txt`).
- **Changes:** row 189; the Data And Integrations wiki row (P-03 provenance of the URL).

<a id="read-sweeps"></a>

## Sweeps

| Sweep | Scope | Outcome | Rows |
|---|---|---|---|
| Tag-added link parameters (P-1) | tag classes reading request parameters; rows that depend on a missing parameter | `LinkTag` adds `fkey`, `returnto` and `projectId`; row 114 corrected; row 234 confirmed (plain WAP links); row 28 has no live link | 28, 114, 234 |
| Unauthenticated surfaces (P-2) | servlet mappings, welcome file, 111 web-root files, log appenders, 41 public-page keys in 10 bundles | `/cewolf/*` newly listed; live log and `index.jsp` recorded; one credential text (F-001) | 9, 18, 73; reconnaissance list |
| Configuration consumers (P-3) | 111 keys (103 distinct) of the two effective property files | 42 without a consumer; Hibernate and pool settings not delivered | 68 |
| Rendering side effects (P-4) | outbound calls in all classes; request parameters read by tag classes | wiki request and stylesheet fetch only; `print` is the only layout switch | 189, 192 |
| CHK-004 public-page texts | login, WAP login and error page keys | per-bundle notes added | 8, 9, 12, 13, 56 |

**Checklist re-application to all changed rows:**
- **CHK-001:** see Checks Performed.
- **CHK-002:** rows 18 and 73 now state their unauthenticated access condition.
- **CHK-003:** rows 68, 114, 189 and 192 each cite their consumer or call path.
- **CHK-004:** see the table above.
- **CHK-005, CHK-006 and CHK-008:** no validator, delete or query statement changed.
- **CHK-007:** the figures were regenerated: 210 rows, 113 `Yes`, 77 `Inferred`, 19 `Partial`, 1 `No`, 0 / 210 progress, 68 of 73 JSPs and all 87 action paths. The reconnaissance was then searched for `208`, `0 / 208`, `75 ` and `112 `, with no hit.
- **CHK-009:** see Credential Handling.

<a id="read-credential-handling"></a>

## Credential Handling

- **Owner rule:** only the factory default login pair shipped in the WAR and described in [`legacy/README.md`](../../../legacy/README.md) line 38 is classified as public legacy data. Even that value is not repeated in new material.
- **What the records do:** they cite the locations of the pair and describe the behavior. They do not state that the pair is unused anywhere.
- **Tool output:** the sweep outputs print keys, line numbers and flags only. The comparison of the pair with the seed printed booleans only.
- **Scan:** before handoff, `.migration-tmp/stage-01/tools/chk009-scan-06.js` extracted in memory the credential values found in the sources:
  - the default pair (`ResourceBundle.properties:784`);
  - the seeded digest (`db-changelog.xml:404`);
  - the database account in both effective property files;
  - the Axis admin password parameter (`server-config.wsdd:4`);
  - the MySQL credentials in [`legacy/docker-compose.yml`](../../../legacy/docker-compose.yml);
  - password and hash values in [`legacy/demo-seed.sql`](../../../legacy/demo-seed.sql). Its only person row has no password value (the column is NULL), so there was nothing to search for.
- **Scan coverage:** it then searched the two changed records, this record and every new or changed scratch file of BA-001-06. It also searched the workbook cells. The result was 0 hits. As a positive control, every source the values came from is hit by at least one pattern. The output `out/chk009-06.txt` contains categories, file names and counts only.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff was generated by comparing `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-06.js` with the final row data.

| Change | Rows (new numbering) | Source |
|---|---|---|
| Added (2) | 68 (Hibernate and pool settings not delivered), 192 (print layout by URL) | F-003, F-004 |
| Status changed | 114 (`Partial` to `Yes`) | F-002 |
| Content changed | 8, 9, 11, 12, 13, 18, 56, 64, 73, 114, 189 | F-001, F-002, F-005, F-006, CHK-004 recheck |
| Renumbered references only | 23, 25, 89, 98, 110, 119, 131, 146, 152, 163, 166, 221, 228 | row insertions |

- The workbook now has 210 rows: 113 `Yes`, 77 `Inferred`, 19 `Partial` and 1 `No`.
- The 31 provenance notes are unchanged.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are reported in RESULT BA-001-06. This record lists which checks were run:

- source checks per finding, as described above, using the class dump, `disasm.js` and per-file numbered reads;
- the sweeps `unauth-06.js`, `config-consumers-06.js` and `render-side-effects-06.js`, and the recounts of JSP, action and chart coverage;
- the row edits `edit-ba-001-06-rows.js` and `-rows-b.js`, which remap row references first and assert a unique requirement prefix for each edit;
- the workbook rebuild with `build-workbook.js` (31 provenance notes) and `rowmap.js`;
- the reconnaissance remap `remap-rows-06.js` and the text edits `edit-ba-001-06-recon.js` and `-recon-b.js`;
- `npm --prefix analysis/tools run sync:workbook-progress`, then `audit:workbook`, `audit:project` and `audit:artifact-links`;
- `node analysis/tools/artifact-reading.js --file` on the reconnaissance and on this record;
- CHK-001 on all new or changed line citations and row references (`chk001-ba-001-06.js`);
- the CHK-009 credential scan (`chk009-scan-06.js`);
- a before/after SHA-256 check of [`legacy/`](../../../legacy);
- `audit:workbook:excel`, once after the final workbook write.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1 (from F-002): resolve the parameters that the rendering tag adds before recording that a link lacks one | Yes. Row 114 recorded a mismatch that `LinkTag#addNavigationParameters` removes. | F-002 disposition |
| P-2 (from F-001, F-005): enumerate unauthenticated surfaces mechanically, including files in the web root, unfiltered pages and public-page texts in all bundles | Yes. The records missed the credential text, the live log in the web root, the unfiltered `index.jsp`, and also `/cewolf/*`. | F-001 and F-005 dispositions; `out/unauth-06.txt` |
| P-3 (from F-003, refines CHK-003): a configuration value is effective only when its consuming factory or bean receives it | Yes. The records called the dialect effective, and the sweep found 42 keys with no consumer. | F-003 disposition; `out/config-consumers-06.txt` |
| P-4 (from F-004, F-006, refines CHK-003): record rendering-path side effects such as outbound requests and parameter-driven layout switches | Yes. The print switch and the wiki request were unrecorded; the sweep found no further ones. | F-004 and F-006 dispositions; `out/render-side-effects-06.txt` |

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-006 within the Stage 1 static boundary.
- **Independent verification:** **not yet performed.** A new fresh eligible Stage 2 session must run a full blind Phase A. This record and the pass-004 findings are withheld until Phase B.
- **Open for Stage 3 (BA):**
  - the login-page text in several browser locales;
  - whether the container serves the activity log and `index.jsp` without login;
  - the task board;
  - the effective Hibernate dialect and cache;
  - the print view;
  - the behavior of wiki rendering when the wiki host is unreachable;
  - the items carried over from passes 001-003.
- **Owner (deferred):**
  - Q3 (Stages 4 and 9) now also covers the advertised default administrator login pair, the live log in the web root and the unfiltered `index.jsp` and `/cewolf/*`.
  - Q2 (Stage 4) now covers the print view and no longer lists the task-board mismatch.
  - Q4 is unchanged.
- **PM:** verify RESULT BA-001-06, integrate status, decide on the reviewer proposals P-1..P-4, and launch the next Stage 2 pass.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 1 re-entry, BA-001-06.
  - Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `0c2350b24a1610a3b6eae768aad6b70a8eaabc7fd19d04ca83c7455d39f9df84`. Applicable checks: CHK-001..CHK-009.
  - **CHK-001** was run mechanically by `.migration-tmp/stage-01/tools/chk001-ba-001-06.js`. The count and result are in RESULT BA-001-06.
  - **CHK-002..CHK-008** were applied as described in [Sweeps](#read-sweeps).
  - **CHK-009** was applied as described in [Credential Handling](#read-credential-handling).
  - Pass 004 linked F-001 to CHK-004 and F-002 and F-003 to CHK-003. Each recheck was run over all affected rows: every public-page text, every tag-added parameter and every configuration key.
- **Learning update:** the four reviewer proposals above. No project checklist edit is made by BA.

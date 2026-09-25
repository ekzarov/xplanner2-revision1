# Stage 02 Review - Pass 006

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

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Result: `findings` - Stage 2 pass 006 (full blind review of the Stage 1 baseline after BA-001-07)**
>
> 539 comparison checks: 519 matched, 17 mismatch, 0 not-checked, 3 not-applicable. Four new findings: F-001 (medium), F-002, F-003 and F-004 (low). All 33 earlier findings (passes 001-005) and the pass-005 mechanism corrections (a)-(c) are resolved in the source.
>
> - **F-001:** a `merge=true` request binds every request parameter onto the persistent object in all generic editors; the records describe `merge` only as a validation switch.
> - **F-002:** the `returnto` parameter becomes a redirect target without validation, and the Spring MVC generic handlers take their view name from the URL; neither is recorded.
> - **F-003:** project and iteration exports contain every person of the system; the export rows do not say so.
> - **F-004:** the configuration-key figures (111 keys, 103 distinct) omit the three `xplanner.security.login[0].*` keys (114 and 106).
>
> **Checklist issues:** F-001 and F-002 are CHK-012 gaps (redirect and entity-binding sinks). F-004 is a CHK-007 figure mismatch. F-003 has no checklist link.
>
> **Next:** the process returns to **Stage 1** for F-001..F-004 (return and correction protocol), then a new fresh blind Stage 2 pass. This pass does not close Stage 2.
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
  - [F-001 - Merge requests bind all request parameters onto the entity](#read-f-001-merge-requests-bind-all-request-parameters-onto-the-entity)
  - [F-002 - Request values choose redirect and view targets](#read-f-002-request-values-choose-redirect-and-view-targets)
  - [F-003 - Exports contain every person of the system](#read-f-003-exports-contain-every-person-of-the-system)
  - [F-004 - Configuration-key figures omit the login-module keys](#read-f-004-configuration-key-figures-omit-the-login-module-keys)
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
- Pass: 006
- Scope: project; the Stage 1 baseline after BA-001-07 ([`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx), 210 rows) against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war)
- Reviewed revision: `15cb6b26946f73596177eba8cead333383d9f728`
- Base revision: not applicable (full pass)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p006`
- Session ID: `a700bf31602b78dd0` (subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P006/independence-record.md`](evidence/S02-P006/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P006`, [`packet.json`](evidence/S02-P006/packet.json) SHA-256 `dfcd1ea1977c168c8f4ae5e8ccc3a626ee901dbaf704ab2f5fddb00ac308ff1a`; [`routing-extract.json`](evidence/S02-P006/routing-extract.json) SHA-256 `ac40a3256797458307cd9a5d0692497ed78a777cd9cd91f86db4010469cbe2bc`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: full
- Verification baseline: revision `15cb6b2`; reconnaissance `0536f243...d332`; workbook `a87c8383...6f99`
- Expansion trigger: none

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] For Stage 2, I inventoried source behavior before reading prior
      conclusions, the filled parity map or reconnaissance, and saved Phase A
      before first Phase B access.

Launch-context exposure is disclosed in the independence record: the injected git status showed commit subjects naming the pass-005 finding range and a Stage 1 re-entry, and the permitted [`README.md`](README.md) names the credential classification decision. PM accepted both as non-substantive before Phase A (recorded verbatim in the [access log](evidence/S02-P006/access-log.md)). No finding content was exposed.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy), SHA-256 unchanged before and after the pass: `README.md` `78b1a6b4...5460`, `demo-seed.sql` `2d32f7d5...387e`, `docker-compose.yml` `e15cd9db...e9ff`, `xplanner-plus.war` `46ff9dc0...4edc`. `demo-seed.sql` was not opened (prepared fixture, excluded as behavior evidence by the routing extract).
- **Phase A inputs:** the instruction paths of the routing extract in the sparse worktree `.migration-tmp/stage-02-p006/phase-a` at `15cb6b2`; the packet and routing extract.
- **Withheld until Phase B (paths only):** the filled reconnaissance and workbook, the project checklist, the full status file, Stage 1 stage records, earlier pass reports and evidence, and the maintenance records.
- **Phase B inputs** (hashes verified against [`pm-phase-b-release.json`](evidence/S02-P006/pm-phase-b-release.json)):
  - [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) `0536f24379fabf00f8a47b53ae3089c7b0d0fbc68021c1de7140a76f95c7d332`
  - [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) `a87c838342b94e04cab72c9bd2144d86e40d24ef8da2836adf538ea036f56f99` (210 scenario rows, 18 epics, last row 234)
  - [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `0115d8ca4422b2a3ae319734cf3dbc274f5e8ae57b05175384667a07e5b79183` (CHK-001..CHK-012)
  - [`analysis/stages/stage-01/stage-02-pass-005-dispositions.md`](../stages/stage-01/stage-02-pass-005-dispositions.md) `7ac86f1573f1cb2b4c0c37f0b79f3d0722ca4c86433adbcd2064dba07e7535c5` and the dispositions of passes 001-004
  - [`analysis/reviews/stage-02-pass-005.md`](stage-02-pass-005.md) `682b996f88d1964018fcd3020a192494a21507a683e45e6abe457e979a10f37f` and the finding headings of passes 001-004
  - [`analysis/migration_status.yaml`](../migration_status.yaml) `952358b2...1410` (owner decisions and review-pass format only, read-only)
- **Explicit exclusions:** the author's scratch tools and outputs under `.migration-tmp/stage-01/**` (forbidden by the packet; E-002), earlier reviewer scratch, git history, any runtime, and the earlier-migration links (amendment A2).

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Phase A:** the WAR was extracted into reviewer scratch; the ZIP central directory was parsed; every descriptor was read in full; all 594 classes were parsed with a dependency-free class-file reader and summarized per method; all 74 JSP and tag files were scanned mechanically; descriptor targets were checked for existence; configuration keys were mapped to consumers; Spring by-name wiring of all 80 action beans was checked. Negative claims carry positive controls.
- **Phase B, records to source:** all 210 rows were read in full (requirement, expected result, evidence) and compared with the Phase A items and targeted source checks. All 571 line citations in the rows and the reconnaissance were resolved mechanically (CHK-001); the 14 tool flags were parser limits and were resolved by hand as correct. Every table row of the reconnaissance claim sections (155 items) was checked; figures were recomputed.
- **Phase B, inventory to records:** each of the 138 Phase A items was located in the rows and sections.
- **Independent re-derivations:** validation keys (41 keys, 0 uncovered), HQL property paths (58 query sources; only `task.story` flagged, matching the records), global forwards (47), Spring bean counts (58/5/13/14/3), Liquibase element counts, ZIP version-needed flags (3 entries at 2.0), class versions (594 at 50.0), SOAP public operations (43), action-path and JSP citation coverage, and the Struts redirect semantics in the bundled `struts-1.2.9.jar`.
- **Batches:** one batch; no context reset; no sampling inside the declared scope.
- **Worktree state:** `git status --short` was empty at ACK (12:54:46Z), Phase A start (12:56:56Z), checkpoint (13:23:33Z), Phase B start (13:25:49Z) and end of review.
- **Credential safety:** evidence cites locations only; see the Reviewer Self-Check.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

- Allowed Phase A inputs and exact legacy revision: routing-extract instruction paths and [`legacy/`](../../legacy) in the sparse worktree at `15cb6b26946f73596177eba8cead333383d9f728`.
- Filled Stage 1 records and prior results withheld: reconnaissance, workbook, checklist, full status, [`analysis/stages/stage-01/`](../stages/stage-01/), passes 001-005 and their evidence, maintenance records, earlier scratch.
- Input-access sequence: [`access-log.md`](evidence/S02-P006/access-log.md) (instruction files 12:54-12:55Z, WAR from 12:57Z, inventory written 13:19-13:23Z).
- Phase A snapshot: [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json), pinned by [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md).
- Snapshot saved at: `2026-09-25T13:23:33Z`.
- Snapshot revision or SHA-256: inventory `8f734d0d25c532c1663dcd85f0f3d9ccf9ce820a49db23ed3c765efc04e64cbe`; snapshot pin `c8d4f7807a452121c850419e212107781fb704ead38669adf0ec1c7bf5b774d9`.
- Inventory coverage, exclusions and unresolved source access: 138 items (A-001..A-138) and 15 exhaustive breakdowns (WAR entries, packages, 102 libraries, 87 actions, 24 form beans, missing targets, 74 JSP files, SOAP methods, 21 entities, mapping files, named queries, 106 configuration keys, credential locations, and action and JSP coverage maps). `demo-seed.sql` was not opened.

| Inventory ID | Independently discovered surface / behavior / claim | Role, conditions and outcome | Legacy source evidence | Uncertainty / coverage limit |
|---|---|---|---|---|
| A-001..A-008 | package, build, classes, libraries, inert components, run helpers, container descriptors | operator; baseline facts | `WAR:META-INF/*`, `WAR:WEB-INF/lib/*`, [`legacy/`](../../legacy) | helpers are hints |
| A-009..A-017 | channels: Struts, REST, SOAP, iCal, Spring MVC, Cewolf, static web root, session settings, error pages | all actors | `WAR:WEB-INF/web.xml` | runtime not observed |
| A-018..A-038 | filters, listeners, Liquibase startup, AutoPatch, Hibernate wiring, pool, transactions, configuration loading and consumers, credential locations, i18n, logging, caching | operator, startup | Spring XML, property files, log4j | consumers by exact-string scan |
| A-039..A-053 | login, login module, remember-me, security filters, mobile login, Basic auth, logout, password change, external modules, bootstrap account, role model, authorization call sites, DispatchForward, error mapping, render tags | anonymous and signed-in users | security classes, `security.xml` family | bytecode references |
| A-054..A-103 | Struts scenarios per feature (projects, iterations, stories, tasks, time, notes, files, people, roles, timesheets, integrations, history, search, dashboard, settings, admin and test actions, generic editor and delete mechanics, events, history, navigation, layouts, missing targets) | per role; validation and error branches | action classes, forms, JSPs | several outcomes `Inferred` |
| A-104..A-114 | WAP, REST, Spring MVC, SOAP, iCal, charts | clients | descriptors and classes | runtime not observed |
| A-115..A-126 | background jobs, database, entities and cascades, queries, mail, outbound HTTP, assets, rendering side effects | system | Spring XML, entities, JSPs | |
| A-127..A-138 | request-value sinks, unauthenticated surfaces, actors, Spring wiring | any user | classes, descriptors | exploitability not established |

The full rows with evidence are in the frozen attachment; this table indexes it only.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [x] The inventory was saved before any filled Stage 1 input was opened.
- [x] The snapshot is retrievable from this report or its durable linked evidence.
- [x] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

PM verified the checkpoint and released Phase B at `2026-09-25T13:25:05Z` ([`pm-phase-b-release.json`](evidence/S02-P006/pm-phase-b-release.json)).

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- First Phase B access at: `2026-09-25T13:25:49Z` (PM release file); first Stage 1 input opened at `2026-09-25T13:26:11Z` (checklist), reconnaissance from 13:26:20Z, workbook at 13:27:09Z.
- Filled parity-map revision/hash: `a87c838342b94e04cab72c9bd2144d86e40d24ef8da2836adf538ea036f56f99`
- Filled reconnaissance revision/hash: `0536f24379fabf00f8a47b53ae3089c7b0d0fbc68021c1de7140a76f95c7d332`
- Other Phase B inputs and access order: checklist, pass-005 report and dispositions, status (read-only excerpts), finding headings of passes 001-004; see the access log.

| Comparison ID | Direction | Phase A inventory IDs | Stage 1 row / reconnaissance section | Source-based resolution | Result / finding / blocker |
|---|---|---|---|---|---|
| C-001..C-138 | inventory-to-records | A-001..A-138 (one each) | mapped rows and sections, listed per item in the ledger | 130 agreements (15 of them reviewer corrections to Phase A, RC-001..RC-015); 6 Stage 1 defects | 130 matched, 6 mismatch (F-001..F-004), 2 not-applicable (E-001) |
| C-139..C-348 | records-to-source | by epic | workbook rows 8-234 (210 scenario rows, one each) | row text read; citations resolved; targeted source checks | 203 matched, 7 mismatch (F-001, F-002, F-003) |
| C-349..C-503 | records-to-source | as linked | reconnaissance claim rows and sections (155) | figures recomputed; claims re-read in source | 150 matched, 4 mismatch (F-001..F-004), 1 not-applicable (E-002) |
| C-504..C-539 | earlier findings | as linked | passes 001-005 corrections and pass-005 mechanisms (a)-(c) | source re-check of each correction | 36 matched (resolved) |

<a id="read-reviewer-corrections-to-phase-a"></a>

### Reviewer Corrections To Phase A

The frozen Phase A inventory is not changed. Where the Stage 1 records were right and Phase A was wrong or incomplete, the correction is recorded here and the C-item is `matched`.

| RC | Phase A item | Correction (source) |
|---|---|---|
| RC-001 | A-043, A-051, A-104 | The seven WAP mappings have no Spring bean, so the Struts-created `AuthenticationAction` and `DispatchForward` have no `authenticator` or `authorizer` (fields set only by setters). WAP login and WAP views with a `projectId` fail; rows 232, 234 are right. |
| RC-002 | A-021, A-022, A-115 | `WAR:WEB-INF/struts-config.xml:438-441` loads `spring-beans.xml` a second time in the Struts plug-in context; Liquibase, the scheduler and the reminder job are expected twice (row 65). |
| RC-003 | A-084 | `EditRoleAction#beforeObjectCommit` has a six-argument signature and overrides no hook; the role editor does not save roles (row 35). |
| RC-004 | A-059, A-113 | The iCal queries and two jrpdf data sources use `task.story`, which `Task` does not map (reviewer `hql-check.js` flags the same paths); rows 211, 213, 228 are right. |
| RC-005 | A-111 | The SOAP class has 43 public operations; Phase A breakdown `BD-SOAP-OPS` wrongly listed 46 (it included private and protected helpers). `getCurrentIteration` and `deleteAttribute` fail on unmapped paths (rows 220-221). |
| RC-006 | A-060 | `ViewIterationMetricsAction#getRepository` returns null; the developer metrics are expected empty (rows 107-108). |
| RC-007 | A-091 | The dashboard is the REST-fed task board of an active iteration (row 114), not an integration page. |
| RC-008 | A-058 | `Project#getAttributes` is an `@ElementCollection` on table `attribute`, removed with the project; other objects' attributes are not. |
| RC-009 | A-120, A-124 | `WAR:WEB-INF/jsp/view/task.jsp:101-103` and `WAR:WEB-INF/jsp/view/notes.jsp:13-15` build `useBeans` where clauses from the `oid` request parameter (rows 143, 169). |
| RC-010 | A-039 | The first branch of `AuthenticationAction#execute` tests the submit field `action`, not the user id (row 14). |
| RC-011 | A-035, A-048 | The default-bundle login help text `WAR:WEB-INF/classes/ResourceBundle.properties:784` states the factory default login pair (checked in memory; value not reproduced). |
| RC-012 | A-103 | struts-config has 47 global forwards; the Phase A figure 53 counted action-local forward names. |
| RC-013 | A-126 | Phase A found 18 unescaped lines with a narrow pattern; the records' inventory (17 edit and confirmation pages, the task board script, the not-found message) is more complete and correct. |
| RC-014 | A-017 | The error page also lists the request parameters and attributes (HTML-encoded by `BoxedListTag`) and prints the exception message unescaped (rows 55-56). |
| RC-015 | A-082 | `story.customer_id` and `notification_receivers.person_id` are foreign keys to person (`WAR:WEB-INF/classes/db-changelog.xml:260,262`), so a person delete can be rejected (row 49). |

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `full`; all 210 rows, every reconnaissance claim section, all 138 Phase A items, and every earlier finding.
- Previous report and pinned baseline: [`stage-02-pass-005.md`](stage-02-pass-005.md) `682b996f...f37f`; correction record [`stage-02-pass-005-dispositions.md`](../stages/stage-01/stage-02-pass-005-dispositions.md) `7ac86f15...35c5`.
- Changed items and direct dependencies rechecked: the 31 rows changed by BA-001-07 and the changed sections are inside the full scope and were checked like every other row.
- Prior results relied on but not rerun: none. Earlier findings were re-verified in the source (C-504..C-539). The author's tool outputs were not read (E-002).
- Expansion triggers examined: none needed; this is a full pass.

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger with one entry per check is [`comparison-results.json`](evidence/S02-P006/comparison-results.json) (SHA-256 in RESULT). The table below lists every non-matched item individually and the matched items by exhaustive ID range.

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001..C-138 except those below / Phase A items to records | each item recorded with the same interpretation | recorded (RC-001..RC-015 where Phase A was wrong) | matched | ledger entries | none |
| C-020 / A-020 request thread-local | record needed only for behavior | infrastructure only | not-applicable | `ServletRequestFilter#doFilter` | E-001 |
| C-117 / A-117 thread pools | record needed only for behavior | unused executor | not-applicable | `WAR:WEB-INF/classes/spring-beans.xml:362-363` | E-001 |
| C-034 / A-034 configuration keys | 106 distinct keys (114 lines) | records say 103 (111) | mismatch | reviewer key count | F-004 |
| C-059 / A-059 exports | export content scope recorded | people content missing | mismatch | `XmlExporter#export` | F-003 |
| C-110 / A-110 Spring MVC generic handlers | view name = path variable | "views not determinable" (row 60) | mismatch | `CommonObjectHandler#list/#edit` | F-002 |
| C-127 / A-127 returnto redirects | redirect sink recorded | not recorded | mismatch | `EditObjectAction#doExecute`; Struts `RequestProcessor#processForwardConfig` | F-002 |
| C-129 / A-129 merge binding | entity-binding sink recorded | not recorded | mismatch | `EditObjectAction#populateObject` | F-001 |
| C-134 / A-134 path variable to view | request-value sink recorded | not recorded | mismatch | `CommonObjectHandler#list` | F-002 |
| C-139..C-348 except those below / workbook rows | status, interpretation, evidence supported | supported | matched | row cells; `chk001-out.json` | none |
| C-188 / row 60 | handler returns the path variable as the view | "views not determinable statically" | mismatch | `CommonObjectHandler` bytecode | F-002 |
| C-249 / row 124 | merge=true path binds request parameters onto the story | only the validation switch described | mismatch | `EditObjectAction#populateObject` | F-001 |
| C-254 / row 129 | the move/continue page posts merge=true, so the story is populated from the request before the move | not described | mismatch | `MoveContinueStoryAction#saveForm`; `WAR:WEB-INF/jsp/edit/moveContinueStory.jsp:20,24` | F-001 |
| C-261 / row 137 | merge branch of the task editor binds request parameters | only the validation skip described | mismatch | `EditTaskAction#populateObject` | F-001 |
| C-264 / row 140 | completion works through the request binding of `completed` | attributed to a form post | mismatch | `WAR:WEB-INF/jsp/view/task.jsp:86-95` | F-001 |
| C-327 / row 209 | project export content includes every person | formats only | mismatch | `XmlExporter#export`, `MpxExporter$ResourceRegistry` | F-003 |
| C-328 / row 210 | iteration export content includes every person | formats only | mismatch | same | F-003 |
| C-349..C-503 except those below / reconnaissance claims | claims supported and complete | supported; figures recomputed | matched | ledger entries | none |
| C-375 / Source Inventory Configuration row | 106 distinct keys | 103 | mismatch | reviewer key count | F-004 |
| C-421 / Data And Integrations export row | export content scope | missing | mismatch | as C-327 | F-003 |
| C-429 / GAP-007 | all insecure request-value behavior listed | redirect and entity binding missing | mismatch | as C-127, C-129 | F-001, F-002 |
| C-492 / Q3 facts completeness | every request-derived sink listed | redirect and entity binding missing | mismatch | as C-127, C-129 | F-001, F-002 |
| C-503 / Build, Run, And Test Evidence | tool runs reproducible | author scratch forbidden | not-applicable | packet boundary | E-002 |
| C-504..C-539 / earlier findings and mechanisms | corrections present and correct | present | matched | see Earlier Findings Resolution | none |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 539 | 519 | 17 | 0 | 3 |

Findings: 4 (F-001 medium; F-002, F-003, F-004 low). Blockers: 0. Justified exclusions: 2 (E-001, E-002). Phase A inventory items: 138; that is a separate count from the 539 comparison checks.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Independently discovered behavior to parity-map verdict (Stage 2).**

| Discovered behavior (A-ID) | Workbook rows / sections | Verdict |
|---|---|---|
| Package, baseline, provenance (A-001..A-008) | Scope And Provenance; Source Inventory; GAP-005, GAP-008 | matched |
| Channels and startup (A-009..A-026) | Source Inventory; Runnable Surfaces; rows 17-20, 55-56, 64-68, 72-73 | matched (RC-002, RC-014) |
| Configuration and credentials (A-027..A-038) | rows 9, 11, 21, 55, 66-68, 94, 109-111, 188-189, 202-203; Configuration row | matched except the key figure (F-004); RC-011 |
| Authentication and authorization (A-039..A-053) | rows 8-35; enforcement table; Q3 facts | matched (RC-001, RC-003, RC-010) |
| Struts scenarios (A-054..A-096) | rows 37-213 | matched except exports (F-003); RC-004, RC-006..RC-009, RC-015 |
| Generic mechanics and events (A-097..A-103) | rows 29, 49, 82, 185-187, 191-194, 206; GAP-003 | matched for outcomes; request binding missing (F-001); RC-012 |
| Other channels and jobs (A-104..A-117) | rows 60, 109-112, 188, 200-205, 215-234 | row 60 (F-002); others matched (RC-001, RC-004, RC-005) |
| Persistence, integrations, rendering (A-118..A-126) | rows 49, 82, 143, 165, 169, 172, 189, 202; persistence row | matched (RC-009, RC-013) |
| Request-value sinks, public surfaces, wiring (A-127..A-138) | Q3 facts; GAP-007; rows 50-51, 60, 62, 73, 124-140, 165, 176, 232-234 | redirect, view and binding sinks missing (F-001, F-002); others matched |

For all four findings the return stage is **1** (map defects).

<a id="read-earlier-findings-resolution"></a>

### Earlier Findings Resolution

Each correction was checked against the source, not against the disposition text.

| Pass / finding | Correction location | Source re-check in this pass | Classification |
|---|---|---|---|
| 001 F-001 server-side enforcement | rows 29-30; enforcement table | reviewer call-site scan: generic actions call `CommonDao` only | resolved (C-504) |
| 001 F-002 history overstated | rows 186-187 | `HistorySupport#saveEvent` callers; listener unregistered | resolved (C-505) |
| 001 F-003 date formats per locale | rows 69-71 | all 10 bundles: `yyyy-MM-dd` in six, `dd-MM-yyyy` in four, es date-time `dd-MM-yyyy HH:MM` | resolved (C-506) |
| 001 F-004 mobile role constraints | rows 32, 233 | `SecurityConfiguration#isAuthorized` has no caller | resolved (C-507) |
| 001 F-005 dormant code | dormant-code row | commented `NullSecurityFilter`; DWR, Jetty, job unwired | resolved (C-508) |
| 001 F-006 e-mail stylesheet fetch | row 202 | `EmailFormatterImpl` -> `HttpClient#getPage` | resolved (C-509) |
| 001 F-007 search/aggregate filtering | rows 167, 180 | `SearchResultAuthorizationPredicate`; `AggregateTimesheetQuery` | resolved (C-510) |
| 001 F-008 attachment storage | row 172 | `WAR:WEB-INF/classes/db-changelog.xml:234` LONGBLOB | resolved (C-511) |
| 002 F-001 validation rules | rows 89, 152-160 | 41 validator keys, 0 uncovered | resolved (C-512) |
| 002 F-002 delete cascades | rows 49, 82, 91, 126, 142, 174 | annotations, element collection, 10 foreign keys | resolved (C-513) |
| 002 F-003 Facebook widget | row 193 | `WAR:WEB-INF/jsp/layout/viewLayout.jsp:92-95` inside an HTML comment | resolved (C-514) |
| 002 F-004 attachment count | row 171 | `notes.jsp` count label | resolved (C-515) |
| 002 F-005 login/start branches | rows 14, 98 | first branch on `action` | resolved (C-516) |
| 002 F-006 hidden-project decorator | row 76 | decorator named once; no `rowDecorator` | resolved (C-517) |
| 002 F-007 sysadmin grant rule | rows 31, 34 | `EditPersonHelper#modifyRoles` bytecode | resolved (C-518) |
| 002 F-008 story import errors/cookies | rows 117, 119 | exception table; `#setCookies` | resolved (C-519) |
| 002 F-009 task type labels | row 135 | `task.type.overhead` in default, `--`, de, it, ja, ru only | resolved (C-520) |
| 002 F-010 superseded figures | reconnaissance figures | recomputed; the new key-figure defect is F-004, not a superseded value | resolved (C-521) |
| 003 F-001 unmapped query paths | rows 211, 213, 220, 221, 228 | `hql-check.js`; alias and embedded-id checks | resolved (C-522) |
| 003 F-002 second Spring context | row 65 | `WAR:WEB-INF/struts-config.xml:440` | resolved (C-523) |
| 003 F-003 validation keys | rows 52, 124, 132, 147 | validator key check | resolved (C-524) |
| 003 F-004 progress chart | row 110 | `WAR:WEB-INF/jsp/view/iterationStatistics.jsp:155`; `WAR:WEB-INF/classes/xplanner.properties:67` | resolved (C-525) |
| 004 F-001 login-page credential | rows 9, 11, 64; GAP-007; Q3 | in-memory booleans: both parts of the pair on line 784; seeded digest matches (value not reproduced) | resolved (C-526) |
| 004 F-002 task-board parameter | row 114 | `LinkTag#addNavigationParameters` adds `fkey` from `oid` | resolved (C-527) |
| 004 F-003 Hibernate settings | row 68 | no `hibernateProperties` | resolved (C-528) |
| 004 F-004 print layout | row 192 | `ContentTag` -> `PrintLinkTag#isInPrintMode` | resolved (C-529) |
| 004 F-005 unauthenticated exposure | rows 18, 73; GAP-007, GAP-013 | filter mappings; web-root appender | resolved (C-530) |
| 004 F-006 outbound wiki request | row 189 | `GenericWikiAdapter#isTopicExisting` | resolved (C-531) |
| 005 F-001 people import wiring | rows 50-51 | no `personDao` bean (reviewer wiring check, control `taskDao`) | resolved (C-532) |
| 005 F-002 aggregate timesheet HQL | row 165; Q3 | `AggregateTimesheetQuery#getTimesheet` listing | resolved (C-533) |
| 005 F-003 reflected values, error echo, cookies | rows 15, 55, 56, 114, 119; Q3 | `WAR:WEB-INF/jsp/view/dashboard.jsp:132`; `WAR:WEB-INF/jsp/common/unexpectedError.jsp:66`; `BoxedListTag` encoding; cookie max-age | resolved (C-534) |
| 005 F-004 WAP dependencies | rows 232, 234 | fields set only by setters; no beans | resolved (C-535) |
| 005 F-005 directory rows on first use | rows 172, 176 | `FileSystemImpl#getRootDirectory` save/flush/refresh | resolved (C-536) |
| 005 mechanism (a) wiring | rows 50-51, 176, 232, 234 | reviewer wiring check agrees | resolved (C-537) |
| 005 mechanism (b) request-value flow | rows in the disposition record; Q3 | resolved for the assigned sink kinds; redirect, view-name and entity-binding sinks are new findings F-001, F-002 under CHK-012, which was admitted after the assignment | resolved (C-538) |
| 005 mechanism (c) read-path writes | rows 172, 176 | only `getRootDirectory` writes; the file manager fails first | resolved (C-539) |

None of the 33 earlier findings is partially resolved or unresolved.

<a id="read-findings"></a>

## Findings

<a id="read-f-001-merge-requests-bind-all-request-parameters-onto-the-entity"></a>

### F-001 - Merge requests bind all request parameters onto the entity

- Severity: medium
- Comparison check IDs: C-129, C-249, C-254, C-261, C-264, C-429, C-492
- **Checklist link:** CHK-012 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-012: request-derived values traced to every sink)
- **Checklist discrepancy:** the BA-001-07 mechanism (b) inventory lists only one further request-value sink (`@type` in `AbstractAction#getObjectType`). It does not list the binding of request parameters onto persistent objects. CHK-012 was admitted after that correction, so this is a newly applicable check, not a claimed pass.
- **Required recheck:** CHK-012 over every handler that copies request data onto domain objects (`RequestUtils.populate`, `BeanUtils.populate` and similar). Expected: each such sink is recorded with its location, reach and exposure.
- Expected and source:
  - `EditObjectAction#populateObject` compares request parameter `merge` with `"true"`. When it matches, it calls `org.apache.struts.util.RequestUtils.populate(domainObject, request)` and skips the form copy (`#copyProperties`) and the many-to-one resolution; otherwise it copies the form (bytecode listing).
  - Every editor on this path inherits the behavior: `/do/edit/project`, `/do/edit/iteration`, `/do/edit/userstory`, `/do/edit/task` (`EditTaskAction#populateObject` calls the parent), `/do/edit/note` (`EditNoteAction#populateObject` calls the parent), `/do/edit/person`, `/do/edit/setting`, and `/do/move/continue/userstory` (`MoveContinueStoryAction#saveForm` calls `#populateObject`; the page posts `merge=true`, `WAR:WEB-INF/jsp/edit/moveContinueStory.jsp:20,24`).
  - With `merge=true` the story and task validators skip their name, estimate and priority checks (rows 124, 137), so any bean property of the loaded object that has a setter can be set by request, including properties that no form shows (for example identifiers, flags or the stored password digest of a person). No server-side permission check gates these actions (rows 29-30).
- Observed difference:
  - Rows 124 and 137 describe `merge=true` only as a validation switch.
  - Row 140 (complete task) attributes the change to form fields; it actually works through this binding (`WAR:WEB-INF/jsp/view/task.jsp:86-95` posts `merge`, `completed`).
  - Row 129 does not state that the move/continue page populates the story from the request before the move.
  - GAP-007 and the Q3 facts do not list the sink.
- Evidence: the class symbols above; the bundled `WAR:WEB-INF/lib/struts-1.2.9.jar` provides `RequestUtils#populate` (framework behavior, GAP-011).
- Requirement impact: Q3 security facts (Principle XI); Stage 3 checks; Stage 9 input-handling NFRs. Exploitability is not established (static only, `Inferred`).
- Required action: record the binding in rows 124, 129, 137 and 140 and in GAP-007 and the Q3 facts, as observed legacy behavior (Q3 deferred).
- Correction impact: all generic editor rows (43, 46, 59, 78, 81, 88, 90, 121, 125, 134, 139, 169, 173) share the mechanism; a one-line note per main row, or one Q3 fact with a row list, bounds it.
- Return stage: 1

<a id="read-f-002-request-values-choose-redirect-and-view-targets"></a>

### F-002 - Request values choose redirect and view targets

- Severity: low
- Comparison check IDs: C-110, C-127, C-134, C-188, C-429, C-492
- **Checklist link:** CHK-012 (row CHK-012 names redirects explicitly among the sinks)
- **Checklist discrepancy:** the BA-001-07 mechanism (b) inventory covered query text, page output, error echo and cookies; it did not trace request values into redirects or view selection. The check is newly applicable, not a claimed pass.
- **Required recheck:** CHK-012 for every `ActionForward` built from a request value and every framework view name derived from the request. Expected: each redirect states whether the target is validated, and each view selection states its reach.
- Expected and source:
  - At least 11 methods in 10 action classes build `new ActionForward(request.getParameter("returnto"), true)`: `EditObjectAction#doExecute`, `DeleteObjectAction#doExecute`, `DeleteNoteAction#doExecute`, `ContinueUnfinishedStoriesAction#doExecute`, `MoveContinueStoryAction#doExecute`, `MoveContinueTaskAction#execute`, `StartIterationAction#doExecute`, `UpdateTimeAction#doUpdateTimeAction` and `#doUpdateEstimateAction`, `CommandExecutorAction#execute`, `PutTheClockForwardAction#execute` (bytecode scan, positive control `EditObjectAction`).
  - The bundled Struts `RequestProcessor#processForwardConfig` prefixes the context path only when the path starts with `/`; any other value goes unchanged to `HttpServletResponse#sendRedirect` (disassembly of `struts-1.2.9.jar`). A crafted link therefore redirects a signed-in user to an arbitrary external address after the action completes.
  - `CommonObjectHandler#list` and `#edit` print the `{objectType}` path variable to standard output and return it as the view name; `InternalResourceViewResolver` resolves it to `/WEB-INF/jsp/{objectType}.jsp` (`WAR:WEB-INF/classes/spring-web.xml:26-30`). No JSP exists at that level, so the handlers have no useful page.
- Observed difference: rows only say the user is "returned to returnto" (for example rows 43, 62); row 60 says the views are not determinable statically; GAP-007 and the Q3 facts list no redirect sink.
- Evidence: the class symbols and jar method above.
- Requirement impact: Q3 security facts; Stage 3 checks; the Spring MVC scenario of UF-004.
- Required action: add the unvalidated redirect to GAP-007 and the Q3 facts with the action list; correct row 60 to state the view-name behavior (`Inferred`, runtime unverified).
- Correction impact: the rows that mention `returnto` redirects; no status change is implied.
- Return stage: 1

<a id="read-f-003-exports-contain-every-person-of-the-system"></a>

### F-003 - Exports contain every person of the system

- Severity: low
- Comparison check IDs: C-059, C-327, C-328, C-421
- **Checklist link:** none: new finding
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  - `XmlExporter#export` runs `from person in class net.sf.xplanner.domain.Person` without a condition and writes the list as the `people` of the exported document, next to the exported project or iteration. `XmlExporter#configureBindings` hides `password`, `lastUpdateTime`, `personId`, `id`, `currentIteration` and the Hibernate proxy field; the other person properties are written (Betwixt, `Inferred` for the exact set).
  - `MpxExporter#export` (also used by `MspdiExporter`) loads every person into `MpxExporter$ResourceRegistry#<init>`, which adds each one as a resource with its name.
  - The export actions have no server-side permission check (rows 29-30).
- Observed difference: rows 209 and 210 and the Data And Integrations export row describe formats and file names only.
- Evidence: the class symbols above.
- Requirement impact: UF-014 export content (parity of the file contents) and a personal-data fact for Stage 9.
- Required action: state the people content of the XML, MPX and MSPDI exports in rows 209-210 and the export row (`Inferred`).
- Correction impact: rows 209-210 only; the PDF and jrpdf rows (211-213) do not export people.
- Return stage: 1

<a id="read-f-004-configuration-key-figures-omit-the-login-module-keys"></a>

### F-004 - Configuration-key figures omit the login-module keys

- Severity: low
- Comparison check IDs: C-034, C-375
- **Checklist link:** CHK-007 (row CHK-007: figures regenerated from the current artifact)
- **Checklist discrepancy:** the reconnaissance states that the consumer sweep covered "all 103 distinct keys" (111 lines). A properties-aware count of the two effective files gives 105 base keys and 9 custom keys: 114 lines and 106 distinct keys. The difference is exactly the three bracketed keys `xplanner.security.login[0].module`, `.name` and `.option.userIdCaseSensitive` (Inferred: the sweep pattern did not match brackets). This is a claimed complete sweep with an incorrect figure.
- **Required recheck:** CHK-007 and CHK-003 for the configuration sweep: regenerate the key counts with a properties parser and confirm the three keys' consumer (`LoginModuleLoader` through its `xplanner.security.login[{0}]` patterns). Expected: 114 lines, 106 distinct keys; the "42 without a consumer" result is unchanged.
- Expected and source: `WAR:WEB-INF/classes/xplanner.properties:162-164`; `WAR:WEB-INF/classes/xplanner-custom.properties:15-49`; reviewer count script `keycount.js`.
- Observed difference: the reconnaissance Source Inventory Configuration row (line 171) and the Build, Run, And Test Evidence config-consumers row (line 291) state 111 keys and 103 distinct keys.
- Evidence: the files above; row 11 already records the login[0] keys, so no behavior is missing.
- Requirement impact: figure accuracy only.
- Required action: correct both figures.
- Correction impact: the two reconnaissance lines.
- Return stage: 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | `sha256sum` of `packet.json` and `routing-extract.json` | pass (exit 0; both match) | access log |
| Worktree revision and state | `git rev-parse HEAD`; `git status --short` in the worktree at ACK, Phase A start, checkpoint, Phase B start and end | pass: `15cb6b26...f728`, empty output each time | access log |
| Legacy hashes | `sha256sum` of the four [`legacy/`](../../legacy) files before and after | pass: unchanged | access log |
| Phase B input hashes | `sha256sum` against `pm-phase-b-release.json` | pass: all pinned values match | access log |
| Workbook audit | `npm --prefix analysis/tools run audit:workbook` (temp redirected) | pass (exit 0): `WORKBOOK AUDIT OK`, 210 scenarios, 18 epics | scratch `audit-workbook.txt` |
| Link audit | `npm --prefix analysis/tools run audit:artifact-links` | pass (exit 0): 219 documents | scratch `audit-links.txt` |
| Report reading structure | `node analysis/tools/artifact-reading.js --file <this report>` | see RESULT (run on the scratch copy) | scratch output |
| Citation check (CHK-001) | reviewer `chk001.js` over rows and reconnaissance | pass: 571 line citations; 14 parser flags resolved by hand as correct | scratch `chk001-out.json` |
| Query paths (CHK-008) | reviewer `hql-check.js` | pass: 58 sources; only the known `task.story` paths flagged | scratch `hql-check.json` |
| Validation keys (CHK-005) | reviewer key extraction over all form validators | pass: 41 keys, 0 uncovered | scratch output |
| Credential scan (CHK-009) | reviewer `cred-scan.js` over all new evidence and this report | pass: 0 credential values (see Reviewer Self-Check) | access log |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-020, C-117 | Infrastructure items (request thread-local holder, unused Spring executor) carry no user-visible behavior; no row is expected. | Parity-map rule: rows describe observable behavior ([`legacy_user_flows_template_instructions.md`](../legacy_user_flows_template_instructions.md)) | Phase A items A-020, A-117 |
| E-002 | C-503 | The author's tool runs and scratch outputs under `.migration-tmp/stage-01/**` are process records; the packet forbids the reviewer to read them. Every legacy fact they support was checked from the source in its own C-item. | PM packet `S02-P006` boundary | [`packet.json`](evidence/S02-P006/packet.json) |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-004 | this report; [`comparison-results.json`](evidence/S02-P006/comparison-results.json) | pending | pending (Stage 1 re-entry) | pending (next fresh pass) |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-001 and F-002 are newly applicable CHK-012 gaps (entity-binding, redirect and view-name sinks); F-004 is a CHK-007 figure mismatch. F-003 is a new finding without a checklist link. The required rechecks are stated in each finding. CHK-001..CHK-006 and CHK-008..CHK-011 passed.

The result is **`findings`**:
- The complete declared scope was checked: 0 not-checked items and 0 blockers.
- 17 checks are mismatches, linked to four actionable findings, one of them medium.
- The three not-applicable items are justified (E-001, E-002).

All findings are defects of the Stage 1 map, so the process returns to **Stage 1** (return and correction protocol; F-001..F-004). Unresolved blocked scope is zero. All 33 earlier findings stay resolved. The next gate is a Stage 1 re-entry with per-finding dispositions, followed by a new fresh blind Stage 2 pass with a new number. This pass cannot close Stage 2 and does not permit Stage 3.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). This section is Phase B only. The checklist was first opened at `2026-09-25T13:26:11Z`, after the Phase A snapshot.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `0115d8ca4422b2a3ae319734cf3dbc274f5e8ae57b05175384667a07e5b79183` (CHK-001..CHK-012)
- Author self-check record/version: reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention), BA-001-07 (checklist `7a5683a8...`, CHK-001..CHK-011 applicable then), and [`stage-02-pass-005-dispositions.md`](../stages/stage-01/stage-02-pass-005-dispositions.md)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; every cited line | new and changed citations checked (BA-001-07) | passed: 571 line citations resolve; 14 parser flags correct (C-139..C-503) | none |
| CHK-002; permission conditions | row sweep (BA-001-04), unchanged | passed: rows 17-35, 38-50, 59, 76-176, 196, 218-234 agree with the reviewer call-site scan | none |
| CHK-003; effects, hooks, dependencies, configuration consumers | mechanisms (a) and (c) rerun (BA-001-07) | passed for wiring and read-path writes (C-537, C-539); the configuration-consumer count issue is F-004 | F-004 (with CHK-007) |
| CHK-004; locale-dependent rows | retained from BA-001-06 | passed: date formats and `task.type.overhead` recomputed in 10 bundles | none |
| CHK-005; validation keys | retained from BA-001-05 | passed: 41 keys, 0 uncovered | none |
| CHK-006; deletes | retained from BA-001-04 | passed: rows 49, 82, 91, 126, 142, 174, 176, 221 match annotations and 10 foreign keys | none |
| CHK-007; figures | regenerated (BA-001-07) | failed for the configuration-key figure (106 distinct, not 103); other figures recomputed and correct | F-004 |
| CHK-008; query paths | retained from BA-001-05 | passed: reviewer `hql-check.js` finds only the recorded `task.story` defects | none |
| CHK-009; no credential values | scan result in RESULT BA-001-07 | passed: no distinctive value and no login-pair form in the rows or the reconnaissance; only common words that equal configured values | none |
| CHK-010; link parameters | retained from BA-001-06 | passed: `LinkTag` adds `fkey` from `oid` (row 114) | none |
| CHK-011; unauthenticated surfaces | retained from BA-001-06 | passed: `/rest/*`, `/servlet/AxisServlet`, `/cewolf/*`, `index.jsp`, web-root files and log agree with Phase A A-135 | none |
| CHK-012; request values to sinks | not applicable at BA-001-07 (admitted later); mechanism (b) covered its sink kinds | failed for entity binding (F-001), redirects and view names (F-002); the recorded query, output, error and cookie sinks are correct | F-001, F-002 |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 006, full scope; the result version is this report and the evidence files hashed in RESULT; checklist `0115d8ca...9183`.
  - **CHK-001:** the line citations in this report were taken from per-file numbered reads and checked against the extracted WAR before handoff.
  - **CHK-009: passed.** `cred-scan.js` extracts 15 candidate values from the cited source locations at run time and prints counts only; a positive control on the source files found 12 contextual hits. In the new evidence and this report it found 0 credential values: no hash or long literal, and the short values occur only as ordinary words (the product and database name, the role and account name `sysadmin`, the role name `admin`, and the words `root`, `username`, `password`). Each contextual match was reviewed with the value masked.
  - **CHK-003, CHK-008, CHK-012:** applied to my own Phase A claims through RC-001..RC-015.
  - **Other checks:** applied as listed in the Checklist Review.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-012, from F-001 and F-002):** add two sink kinds to the check: request-to-object binding (framework population of request parameters onto persistent or domain objects) and request-selected navigation (redirect targets and view or template names). Expected: each is recorded with its location, whether the target or property set is restricted, and its reach. This refines CHK-012; it is not a new ID.
  - **P-2 (refine CHK-007, from F-004):** regenerate counts of configuration keys and similar elements with a format-aware parser (for properties files: continuation lines and bracketed keys), and pair the count with a positive control that a known unusual element is counted. This refines CHK-007.
  - **F-003:** no new check proposed: the content scope of an export is part of the ordinary row description; one occurrence does not show a reusable omission pattern beyond CHK-003.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| not applicable | not applicable | not applicable | not applicable | Stage 2 |

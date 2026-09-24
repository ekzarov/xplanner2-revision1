# Stage 02 Review - Pass 004

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

> **Reading statuses:** `clean` (this exact scope meets the clean-pass rules); `findings` (discrepancies require disposition); `blocked` (required verification could not finish); `invalid` (the review attempt is unusable). None of these supplies a separate human approval. [Status meanings](../artifact-status-meanings.md).

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
> **Result `findings`: 6 findings (1 medium, 5 low); return to Stage 1**
>
> A blind Phase A inventory of 119 items was saved and pinned before any Stage 1 record was opened. In Phase B, 405 comparison items were checked in both directions: 381 matched, 21 mismatched, 0 not checked and 3 were not applicable. All 22 findings from passes 001-003 remain resolved. The Stage 1 records are largely accurate; the remaining defects are these:
> - **F-001 (medium):** the login page itself shows the working default sysadmin credential, and row 64 wrongly says that the credential is documented only in [`legacy/README.md`](../../legacy/README.md).
> - **F-002:** the task-board "parameter mismatch" (row 113) does not exist, because the link tag adds `fkey` automatically.
> - **F-003:** the Hibernate dialect, cache and query-substitution settings never reach the web session factory, although the reconnaissance calls the dialect effective.
> - **F-004:** content pages switch to a print layout when a `print` parameter is present; the reconnaissance excludes `tiles:print` as unused.
> - **F-005:** the live activity log is written into the public web root, and `index.jsp` runs without a security filter; neither is in the security facts.
> - **F-006:** wiki-word rendering makes a server-side HTTP request to the configured wiki, and this is not recorded.
>
> **Checklist issues:** F-001 links to CHK-004; F-002 and F-003 link to CHK-003. CHK-001, CHK-002, CHK-005, CHK-006, CHK-007 and CHK-008 were re-applied and passed.
>
> **Next:** Stage 1 corrects the rows and sections named in the findings, records dispositions, and a new fresh blind Stage 2 pass follows.
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
  - [Resolution Of Earlier Findings](#read-resolution-of-earlier-findings)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
- [Findings](#read-findings)
  - [F-001 - The login page discloses the default sysadmin credential](#read-f-001-the-login-page-discloses-the-default-sysadmin-credential)
  - [F-002 - The task-board parameter mismatch does not exist](#read-f-002-the-task-board-parameter-mismatch-does-not-exist)
  - [F-003 - Hibernate settings from the properties files are not applied](#read-f-003-hibernate-settings-from-the-properties-files-are-not-applied)
  - [F-004 - The print layout is reachable by URL](#read-f-004-the-print-layout-is-reachable-by-url)
  - [F-005 - Unauthenticated exposure facts are incomplete](#read-f-005-unauthenticated-exposure-facts-are-incomplete)
  - [F-006 - Wiki-word rendering calls the external wiki from the server](#read-f-006-wiki-word-rendering-calls-the-external-wiki-from-the-server)
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

- Date: 2026-09-24
- Stage: 02
- Pass: 004
- Scope: project; the complete fixed baseline package in [`legacy/`](../../legacy) and both Stage 1 records ([`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md), [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx), 208 scenario rows), plus the resolution of all earlier Stage 2 findings
- Reviewed revision: `18dc6b73c8305971a8d6f2879b8fab6206ba5f04`
- Base revision: not applicable (full pass)
- Reviewer product: Claude Code subagent, model family Claude (`claude-opus-5-5`)
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p004`
- Session ID: `a28e538a37766e909` (subagent of PM session `d0ec1166-ffc9-446a-ba86-d768242e6de8`)
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P004/independence-record.md`](./evidence/S02-P004/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: S02-P004, [`packet.json`](./evidence/S02-P004/packet.json) SHA-256 `a5a1f86efa5fcfedf94ebd70706fa412c5e8fe90fada8b6167f8fecfdb437226`; [`routing-extract.json`](./evidence/S02-P004/routing-extract.json) SHA-256 `f0e5137a112e5c9d1708342044a67e69cc8c574811a27aa0814a231edc312d90`
- Result: findings
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: full
- Verification baseline: revision `18dc6b73c8305971a8d6f2879b8fab6206ba5f04`, WAR SHA-256 `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc`
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

Disclosed, non-substantive exposure before Phase A, accepted by PM on 2026-09-24T13:46:40Z: the client-injected Git status listed commit subjects, including the ID range F-001..F-004 of pass 003 but no finding content, and a worktree `CLAUDE.md` entry bridge. The Stage 1 author identity recorded in the reconnaissance (subagent `a5bb18013a4f4d2f8`) differs from this reviewer's session. Full details and the verbatim PM decision are in [`access-log.md`](./evidence/S02-P004/access-log.md) and the independence record.

The matching `migration_status.yaml` review entry records `reviewer_id`,
`session_id`, `authored_artifacts`, `independence_record`, and `waiver_ids`
as structured fields. Free-form prose alone is not reviewer identity or
independence evidence.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

**Allowed Phase A inputs:**

- The sparse worktree `.migration-tmp/stage-02-p004/phase-a` at the reviewed revision: [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war); [`legacy/README.md`](../../legacy/README.md) and [`legacy/docker-compose.yml`](../../legacy/docker-compose.yml) as run context only; [`legacy/demo-seed.sql`](../../legacy/demo-seed.sql), whose first 25 lines were read only to classify it as a fixture.
- The instruction paths named in the routing extract: [`MIGRATION.md`](../../MIGRATION.md), [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md), [`analysis/agent-roles.md`](../agent-roles.md), [`.agents/skills/migration-ba/SKILL.md`](../../.agents/skills/migration-ba/SKILL.md) (git blob `b97db7a6881a199d9c981e375c2518b248877f78`), the listed sections of [`analysis/migration_methodology.md`](../migration_methodology.md), [`analysis/reviews/README.md`](./README.md) and [`analysis/agent_orchestration.md`](../agent_orchestration.md), the template [`analysis/reviews/stage-NN-pass-NNN-template.md`](./stage-NN-pass-NNN-template.md), [`analysis/error-prevention.md`](../error-prevention.md) and [`analysis/legacy_user_flows_template_instructions.md`](../legacy_user_flows_template_instructions.md).
- The packet and routing extract.

**Phase B inputs** (released 2026-09-24T14:08:46Z; each SHA-256 was verified before opening):

| Input | SHA-256 | First opened (UTC) |
|---|---|---|
| [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) | `a35a09acfb6345681b292424649f2988e3c24575614681842fa5b1252bc1260b` | 2026-09-24T14:09:51Z |
| [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) | `24630a194e79ba9051b37355148aba52b6dda7fbeee6b43c9290ebb58528670a` | 2026-09-24T14:10:30Z |
| [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) | `2abe6fa4fbd89c227574317fc422618ad7748584b3996c5b1febb1ec902d5165` | 2026-09-24T14:13:19Z |
| [`analysis/reviews/stage-02-pass-001.md`](./stage-02-pass-001.md), [`-002`](./stage-02-pass-002.md), [`-003`](./stage-02-pass-003.md) | `73e8fb00…`, `545ad428…`, `0246765a595775d62e7d10067cc265356c08b8cc2317ae30c5a868ece2bfcc02` | 2026-09-24T14:13:37Z |
| [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](../stages/stage-01/stage-02-pass-001-dispositions.md), [`-002`](../stages/stage-01/stage-02-pass-002-dispositions.md), [`-003`](../stages/stage-01/stage-02-pass-003-dispositions.md) | `5d823882…`, `549a5cf2…`, `668a8b6c7dcc98015b8914ace78b2e65e4148470389c4b6d69af640801e1e79a` | 2026-09-24T14:13:37Z |
| [`analysis/migration_status.yaml`](../migration_status.yaml), [`analysis/stages/bootstrap/bootstrap-gate-report.md`](../stages/bootstrap/bootstrap-gate-report.md) | `ab2c9678…`, `1432e4a4…` | hashes verified; not needed for the comparison |

**Explicit exclusions:**

- Any runtime. Stage 2 is static; live verification belongs to Stage 3.
- Earlier scratch under `.migration-tmp/stage-01/**`, `.migration-tmp/stage-02*/**` (forbidden by the packet; see E-003).
- Git history.
- Examples of an earlier migration (constitution amendment A2).
- Library internals in the 102 JARs beyond entry names, unless a claim depended on them.

<a id="read-method-and-coverage"></a>

## Method and Coverage

Tools and read-only reviewer scripts. They run in the reviewer scratch folder. The Phase A tools are copied into [`phase-a-breakdown/tools/`](./evidence/S02-P004/phase-a-breakdown/tools), and the Phase B tools with their check outputs into [`phase-b-tools/`](./evidence/S02-P004/phase-b-tools).

- **Extraction:** the WAR was extracted with `tar.exe`.
- **Classes:** `classparse.js` parsed all 594 classes (constant pool, annotations, per-method strings and calls).
- **Phase B bytecode listings:** `disasm.js` listed exact instruction sequences for the methods whose behavior was disputed or decisive. These were `DispatchForward#<init>/#isSecure`, `ViewIterationMetricsAction#getRepository`, `EditPersonHelper#modifyRoles`, `AuthenticationAction#execute`, `ImportStoriesAction#execute` (with its exception table), `EditRoleAction` and `AbstractAction` hooks, `TimeEntry#getEffort`, `UpdateManager#updateTaskStatus`, `TaskStatus#fromName`, `PrintLinkTag#isInPrintMode`, `ContentTag#doStartTag`, `LinkTag#addNavigationParameters`, `GenericWikiAdapter#isTopicExisting`, `XPlannerLoginModule#digestPassword` and `EmailMessageImpl#<init>`.
- **Configuration and markup:** `xref.js` checked class and path references in the active XML. `jspscan.js` and `jspdetail.js` scanned the JSPs, and `breakdowns.js` produced the exhaustive breakdowns.
- **Phase B record checks:**
  - `xlsx2json.js` parsed the pinned workbook copy.
  - `citecheck.js` implements CHK-001: every `file:line` and class/method citation in the 208 rows and in the reconnaissance.
  - `quotecheck.js` checked quoted UI texts against the bundles and class strings.
  - `figures.js` implements CHK-007 and regenerates every inventory figure.
  - A validator key sweep implements CHK-005.
  - `ledger.js` generated the comparison ledger.
- **Direct reads:** targeted per-file reads confirmed individual rows (projects, project, people, person, editPerson, editIterationStatus, baseHeader, globalLinks, exportLinks, viewLayout and notes JSPs, `global.js`, the bundles). The WAR ZIP central directory was re-read to verify the provenance sign.

**Coverage:**

- **Direction 1:** all 119 Phase A items, plus 2 sub-claims.
- **Direction 2:**
  - all 208 workbook rows;
  - every table row or claim group of the reconnaissance (51 items);
  - all 22 earlier findings;
  - 3 mechanical checklist sweeps.
- **Not sampled:** no part of the declared scope was sampled.
- **Rows without a separate source re-read:** a row counts as matched when all of the following hold:
  - its citations resolved mechanically;
  - its statement agreed with the independent Phase A item that covers the same behavior;
  - no Phase A or Phase B evidence contradicted it.
- **Rows with a direct re-read:** rows whose claims went beyond Phase A were read again in source. Examples are UI texts, page-width toggle, social links, hidden-project column, date picker and progress bar.
- **Orchestration:** a single session with no context reset. Worktree `git status --short` was empty at 13:44:26Z, 14:07:39Z, 14:09:44Z and at the end of the work (see [Interaction Log](#read-interaction-log)).

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

- **Allowed Phase A inputs and exact legacy revision:** as listed under [Scope and Inputs](#read-scope-and-inputs), at revision `18dc6b73c8305971a8d6f2879b8fab6206ba5f04`.
- **Filled Stage 1 records and prior results withheld:**
  - the reconnaissance, the workbook, the learned checklist and the status file;
  - `analysis/stages/**`, the pass 001-003 reports and evidence, and `analysis/maintenance/**`;
  - earlier scratch.
- **Input-access sequence:** logged per entry in [`access-log.md`](./evidence/S02-P004/access-log.md). There was no exposure to withheld content before the checkpoint.
- **Phase A snapshot:** [`analysis/reviews/evidence/S02-P004/phase-a-inventory.json`](./evidence/S02-P004/phase-a-inventory.json) with its breakdowns in [`phase-a-breakdown/`](./evidence/S02-P004/phase-a-breakdown), all pinned in [`phase-a-snapshot.sha256`](./evidence/S02-P004/phase-a-snapshot.sha256) (18 files).
- **Snapshot saved at:** 2026-09-24T14:07:39Z. That is before the first Phase B access at 14:09:51Z; PM verified the checkpoint and released Phase B at 14:08:46Z.
- **Snapshot SHA-256:** inventory `63ab82d15c0e290e2c9dbf7abc37cc81b39560477afe426972c8b2f01bde3932`; pin file `28be3b9a02e2e21e26876b3b8b9c4fdc8d0661dd11935315ad2944c160e32105`.
- **Inventory coverage, exclusions and unresolved source access:**
  - 119 items: baseline 7, channel 9, wiring 6, configuration 5, persistence 3, security 14, error 3, admin 1, scenario 52, background 4, data 6, integration 4, dependency 2, broken-wiring 3.
  - Exhaustive breakdowns: 87 Struts mappings, 964 WAR files, 27 persistence classes, 43 SOAP operations, the changelog, 29 named queries, 102 JARs, the JSP index and the configuration cross-reference.
  - Limits: static only, and no decompiler (instruction-level listings were used in Phase B).

The inventory is a durable attachment, so it is pinned by hash and not reproduced here. Each item has the fields ID, category, title, detail, status and evidence; limits are recorded in the item detail and in the inventory `unresolved` list. Phase A counts are separate from the comparison totals.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

- [x] The inventory was saved before any filled Stage 1 input was opened.
- [x] The snapshot is retrievable from this report or its durable linked evidence.
- [x] Subsequent discoveries will be recorded in Phase B, not backfilled into Phase A.

Freeze the snapshot at this handoff. Once issued, the completed report is
immutable. A self-declaration or hash alone does not establish independence;
record actual access order and invalidate a contaminated pass.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

- First Phase B access at: 2026-09-24T14:09:51Z
- Filled parity-map revision/hash: `24630a194e79ba9051b37355148aba52b6dda7fbeee6b43c9290ebb58528670a` (208 scenario rows, 18 epics; `audit:workbook` OK)
- Filled reconnaissance revision/hash: `a35a09acfb6345681b292424649f2988e3c24575614681842fa5b1252bc1260b`
- Other Phase B inputs and access order: checklist (14:13:19Z), earlier reports and dispositions (14:13:37Z); the status file and bootstrap report were only hash-verified

Both directions were reconciled against the immutable WAR. The index below groups the 405 C-items; every item, with its direction, target, result and note, is in [`comparison-results.json`](./evidence/S02-P004/comparison-results.json).

| Comparison ID | Direction | Phase A inventory IDs | Stage 1 row / reconnaissance section | Source-based resolution | Result / finding / blocker |
|---|---|---|---|---|---|
| C-001..C-119 (except the 8 listed below) | inventory-to-records | A-001..A-152 | rows and sections as mapped in the ledger | agreement. Where Phase A was wrong, the source settles it for Stage 1 (RC-001..RC-013) | 111 matched |
| C-007, C-043 | inventory-to-records | A-007, A-052 | GAP-013, row 72, Q3 facts | Stage 1 defect (omission) | mismatch, F-005 |
| C-023 | inventory-to-records | A-026 | Source Inventory Configuration, P-01 | Stage 1 defect | mismatch, F-003 |
| C-026 | inventory-to-records | A-029 | Tiles row, Parity-Map Boundary exclusions | Stage 1 defect | mismatch, F-004 |
| C-031 | inventory-to-records | A-040 | rows 8, 9, 64 | Stage 1 defect | mismatch, F-001 |
| C-064 | inventory-to-records | A-078 | row 113, Q2 facts | Stage 1 defect. Phase A was right about `fkey`; RC-005 corrects the metrics part in favour of Stage 1 | mismatch, F-002 |
| C-094, C-113 | inventory-to-records | A-108, A-142 | rows 188-189, Data And Integrations wiki row | Stage 1 defect (omission) | mismatch, F-006 |
| C-120, C-121 | inventory-to-records | A-021 sub-claim, A-132 sub-claim | not recorded | justified non-applicability | not-applicable, E-001, E-002 |
| C-122..C-329 (except 4) | records-to-source | rows 8..232 | 204 rows | agreement | 204 matched |
| C-123, C-175 | records-to-source | A-040 | rows 9, 64 | Stage 1 defect | mismatch, F-001 |
| C-222 | records-to-source | A-078 | row 113 | Stage 1 defect | mismatch, F-002 |
| C-292 | records-to-source | A-108 | row 188 | Stage 1 defect (omission) | mismatch, F-006 |
| C-330..C-380 | records-to-source | various | 51 reconnaissance items | agreement except 9 mismatches (C-336, C-343, C-361, C-366, C-367, C-368, C-372, C-373, C-376) and E-003 (C-364) | 41 matched, 9 mismatch, 1 not-applicable |
| C-381..C-402 | records-to-source | - | resolution of the 22 earlier findings | resolved (see [Resolution Of Earlier Findings](#read-resolution-of-earlier-findings)) | 22 matched |
| C-403..C-405 | records-to-source | - | CHK-001, CHK-005, CHK-007 mechanical sweeps | passed | 3 matched |

<a id="read-reviewer-corrections-to-phase-a"></a>

### Reviewer Corrections To Phase A

The Phase A snapshot remains frozen. In the cases below my Phase A interpretation was wrong or incomplete, and the Stage 1 statement was verified correct against the source. None of them is a Stage 1 defect.

| ID | Phase A item | Corrected interpretation | Evidence |
|---|---|---|---|
| RC-001 | A-027 | 10 `ResourceBundle*.properties` files. I had counted `EmailResourceBundle.properties` as an eleventh UI bundle. | file list (figures.js) |
| RC-002 | A-050, A-056 | `DispatchForward#<init>` sets `isAuthorizationRequired=true`, and `#isSecure` falls back to that field when no `@secure` forward exists. DispatchForward therefore checks `projectId` plus `system.project` read unless a bean switches the flag off (row 28 is correct). | listings `DispatchForward#<init>`, `#isSecure` |
| RC-003 | A-064 | Project delete does not fail on the `notification_receivers` foreign key, because Hibernate removes the owned `@ManyToMany` join rows and the `@ElementCollection` rows first (row 81 is correct). | `Project#getNotificationReceivers`, `#getAttributes` annotations |
| RC-004 | A-025, A-066 | `xplanner.export.formats` does have a consumer (`WAR:WEB-INF/jsp/view/exportLinks.jsp:23`). The jrpdf person and story data sources also query `task.story`. | exportLinks.jsp; `PdfReportExporter$UserStoryDataSource`, `$PersonDataSource` strings |
| RC-005 | A-078 | The iteration metrics are expected to be empty, because `ViewIterationMetricsAction#getRepository` returns null (`aconst_null`, `areturn`; rows 106-107 are correct). | listing |
| RC-006 | A-092 | The iCal queries join on `task.story`, which `Task` does not map, so the feed is expected to fail (row 226 is correct). | `iCalServlet` strings; `Task#getUserStory` |
| RC-007 | A-098 | `EditRoleAction#beforeObjectCommit(Object, Session, ...)` overrides no hook of `AbstractAction`, so the role editor saves nothing and reaches no check (row 35 is correct). | listings of `EditRoleAction` and `AbstractAction` method signatures |
| RC-008 | A-112 | The five SOAP attribute operations have no permission check, and `deleteAttribute` uses unmapped paths (rows 216, 219 are correct). | `XPlanner`, `AttributeRepositoryImpl#delete` strings |
| RC-009 | A-122 | changeSet 1-1 creates 19 tables and changeSet 2-1 two more, 21 in total (row 64 is correct on the count). | figures.js over `db-changelog.xml` |
| RC-011 | A-094 | The open point is resolved. `EditPersonHelper#modifyRoles` gates project roles with `isCurrentUserAdminOfProject(projectId)` and the sysadmin role with `isCurrentUserAdminOfProject(0)`: delete, then re-add only when the flag is set (rows 31, 34 are correct). | listing |
| RC-012 | A-114 | `TaskStatus#fromName` returns `NON_STARTED` for an unknown value, so an unknown status yields "Moving Task to not started not implemented" (row 224 is consistent). | listing |
| RC-013 | A-120 | My Phase A doubt about `EmailMessageImpl` in the scheduler thread is withdrawn. Its thread session is used only by a wrapper that is not on the recipient path, which uses the injected repository. | listing `EmailMessageImpl#<init>` |

RC-010 is not assigned. The IDs above are the ones used in the ledger notes and are kept unchanged.

<a id="read-resolution-of-earlier-findings"></a>

### Resolution Of Earlier Findings

All 22 earlier findings were re-verified against the source at this revision and against the current records. **Resolved** means the current rows and sections state the source-correct behavior.

| Finding | Current evidence in the records | Source re-check | Resolution |
|---|---|---|---|
| pass-001 F-001 permission enforcement | rows 26, 28-32; enforcement table | ViewObjectAction/EditObjectAction/DeleteObjectAction have no authorizer call; DispatchForward default true (listing) | resolved |
| pass-001 F-002 history | rows 185-186 | HistorySupport#saveEvent callers; no listener bean for events | resolved |
| pass-001 F-003 date formats | rows 68-70 | `global.js:39`; per-bundle `format.date` | resolved |
| pass-001 F-004 mobile roles | rows 32, 231 | `SecurityConfiguration#isAuthorized` has no caller | resolved |
| pass-001 F-005 dormant code | Source Inventory dormant row | commented NullSecurityFilter, DWR, JettyServer | resolved |
| pass-001 F-006 e-mail CSS fetch | row 200 | `EmailFormatterImpl#formatEmailEntry` | resolved |
| pass-001 F-007 search/aggregate filtering | rows 166, 179 | `SearchResultAuthorizationPredicate`, `AggregateTimesheetQuery` | resolved |
| pass-001 F-008 attachment storage | row 171 | `FileSystemImpl#createFile`, `File#getData` `@Lob` | resolved |
| pass-002 F-001 validation rules | rows 88, 151-159 | 17 validators, 47 keys, 0 uncovered | resolved |
| pass-002 F-002 delete cascades | rows 49, 81, 90, 125, 141, 173, 175 | cascade annotations; changelog foreign keys | resolved |
| pass-002 F-003 Facebook like | row 191 | `viewLayout.jsp:73-88` live, `:92-95` commented | resolved |
| pass-002 F-004 attachment count | row 170 | `notes.jsp:90`, `Note#getAttachmentCount` | resolved |
| pass-002 F-005 login/start branches | rows 14, 97 | `AuthenticationAction#execute` listing; `editIterationStatus.jsp:43-60` | resolved |
| pass-002 F-006 hidden decorator | row 75 | `projects.jsp:65-84` (decorator declared, not passed) | resolved |
| pass-002 F-007 sysadmin grant | rows 31, 34 | `EditPersonHelper#modifyRoles` listing | resolved |
| pass-002 F-008 import errors, cookies | rows 116, 118 | exception table of `ImportStoriesAction#execute` | resolved |
| pass-002 F-009 task type labels | row 134 | `editTask.jsp:52-68` | resolved |
| pass-002 F-010 superseded figures | reconnaissance figures | figures.js | resolved |
| pass-003 F-001 unmapped query paths | rows 11, 194, 209, 211, 218, 219, 226 | `task.story`, `object.projectId`, `a.targetId`; `Task`/`Iteration`/`Attribute` getters | resolved |
| pass-003 F-002 second Spring context | rows 64, 65, 198, 199 | `web.xml:32-38`, `struts-config.xml:438-441` | resolved |
| pass-003 F-003 validation keys | rows 52, 123, 130, 131, 136, 145, 146 | validator sweep | resolved |
| pass-003 F-004 progress chart | rows 108-111 | `iterationStatistics.jsp:155-191`, `xplanner.properties:67` | resolved |

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `full`. The scope is the complete WAR and both Stage 1 records at revision `18dc6b73c8305971a8d6f2879b8fab6206ba5f04`, plus the resolution of earlier findings.
- Previous report and pinned baseline: [`analysis/reviews/stage-02-pass-003.md`](./stage-02-pass-003.md) (`0246765a…`) and its dispositions [`analysis/stages/stage-01/stage-02-pass-003-dispositions.md`](../stages/stage-01/stage-02-pass-003-dispositions.md). They were used only for the finding-resolution check.
- Changed items and direct dependencies rechecked: all rows. Because this is a full pass, the rows changed by BA-001-05 (6 added, 16 changed, 8 renumbered) are included.
- Prior results relied on but not rerun: none. Every earlier finding was re-verified in source.
- Expansion triggers examined: none needed (full pass).

<a id="read-comparison-results"></a>

## Comparison Results

The complete item table (405 items) is [`comparison-results.json`](./evidence/S02-P004/comparison-results.json), SHA-256 in the RESULT. The mismatched and not-applicable items, and the grouped matched items, are these:

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-031, C-123 / row 9 login instructions | the login page shows `login.instructions` whenever `login.instructions.url` is set; in the default bundle the text includes the default sysadmin credential (`WAR:WEB-INF/classes/ResourceBundle.properties:784`) | row 9 describes only a help link; it has no per-bundle statement | mismatch | `login.jsp:34-39`; `xplanner-custom.properties:49`; bundle keys per variant | F-001 |
| C-175 / row 64 seed account | the seeded digest (`db-changelog.xml:404`) verifies against the credential the login page advertises (`XPlannerLoginModule#digestPassword`, salt-first MD5) | row 64 says "credentials documented only in [`legacy/README.md`](../../legacy/README.md), not evidence" | mismatch | listing plus digest recomputation (value not reproduced, A3) | F-001 |
| C-366, C-373 / GAP-007, Q3 facts | security-relevant disclosures of the package | the credential disclosure is absent | mismatch | as above | F-001 |
| C-064, C-222, C-372 / row 113, Q2 facts task board | `LinkTag#addNavigationParameters` adds `fkey` equal to the current `oid`; `globalLinks.jsp:15` renders the dashboard link on `/do/view/iteration*?oid=...` | row 113 (`Partial`) and the Q2 facts say the REST call's `${param.fkey}` does not match the link parameter | mismatch | listing; `globalLinks.jsp:14-18`; `dashboard.jsp:132` | F-002 |
| C-023, C-343, C-368 / effective Hibernate settings | a property is effective only when its consumer receives it; `sessionFactory` (`spring-beans.xml:77-81`) receives no `hibernateProperties`, and no `hibernate.properties` ships in the WAR or JARs | the reconnaissance says "Effective settings: MySQL ... with the XPlannerMySQLDialect", and P-01 treats the dialect as effective | mismatch | spring XML; JAR search with positive control; consumers `SystemInfo`, `UseBeansTag`, tools only | F-003 |
| C-026, C-336, C-376 / print layout | `ContentTag#doStartTag` selects `tiles:print` when `PrintLinkTag#isInPrintMode` sees a `print` parameter | Tiles row and boundary exclusions say `tiles:print` has "no user" | mismatch | listings | F-004 |
| C-007, C-043, C-367 / public exposures | web-root files and pages without a filter are reachable without login | GAP-013 covers only the shipped log; row 72 gives the location only; `index.jsp` is not listed | mismatch | `log4j-war.xml:44-58`; `web.xml:45-52,130-181,321-323`; `index.jsp:7-31` | F-005 |
| C-094, C-113, C-292, C-361 / wiki rendering | `TwikiFormat` uses `GenericWikiAdapter#isTopicExisting`, which opens the configured topic URL | row 188 and the External wiki row record links only, with "Example endpoints only" | mismatch | listing; `xplanner.properties:113-116` | F-006 |
| C-120 / SystemInfo startup log (A-021 sub-claim) | - | not recorded | not-applicable | `SystemInfo#setServletContext` | E-001 |
| C-121 / pair-programming effort option (A-132 sub-claim) | - | not recorded | not-applicable | `TimeEntry#getEffort` listing | E-002 |
| C-364 / author scratch tool outputs | - | not reviewed | not-applicable | packet `withheld_until_phase_b` and forbidden scratch | E-003 |
| C-001..C-119 (111 items) | each Phase A item as mapped in the ledger | a covering row or section with consistent content | matched | ledger `records` field; RC table | none |
| C-122..C-329 (204 rows) | each row's statement and citations | citations resolved; statement consistent with Phase A and targeted re-reads | matched | citecheck, quotecheck, targeted reads | none |
| C-330..C-380 (41 items) | reconnaissance claims | consistent with the source and regenerated figures | matched | figures.js, ZIP re-read, listings | none |
| C-381..C-405 (25 items) | earlier findings resolved; mechanical sweeps | resolved; sweeps passed | matched | resolution table; sweep outputs | none |

The reviewer uses exactly one result per item:
- **matched**: inspected against the expected result, with supporting evidence.
- **mismatch**: inspected and different; linked to a detailed F-NNN below.
- **not-checked**: no sufficient check could be completed; linked to B-NNN.
- **not-applicable**: outside the justified applicability of this check;
  linked to E-NNN with scope evidence and decision authority where required.

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 405 | 381 | 21 | 0 | 3 |

- By direction: inventory-to-records 121 (C-001..C-121); records-to-source 284 (C-122..C-405: 208 rows, 51 reconnaissance items, 22 earlier-finding items, 3 sweep items).
- Findings: 6 (F-001 medium; F-002..F-006 low). Blockers: 0. Exclusions: 3 (E-001..E-003).
- The Phase A inventory has 119 items. That count is separate from the comparison total.
- Wording and grouping differences that are not defects:
  - 10 quoted UI texts that are templated or paraphrased (rows 39, 81, 98, 109, 160, 173, 175, 177, 190, 213), checked by hand;
  - 0-based ZIP entry numbers in the reconnaissance (864/877/878, which are 865/878/879 1-based);
  - JSP citations by basename (row 37 `projects.jsp:161`, `project.jsp:96`; reconnaissance line 501 `projects.jsp:65-75,82-84`), which resolve to `WEB-INF/jsp/view/` from context;
  - 4 citations whose parenthetical wording is not literally in the cited line (row 9 `xplanner.properties:311`, row 114 `xplanner.properties:277-284`, rows 192 and 194 `spring-beans.xml:80`), each confirmed by hand.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

Independently discovered behavior to parity-map verdict:

Independently discovered behavior by Phase A category (inventory-to-records items C-001..C-121; the per-item mapping to rows and sections is in the ledger `records` field):

| Phase A category | Phase A items | C-items | Matched | Mismatch | Not applicable | Findings / exclusions |
|---|---|---|---|---|---|---|
| baseline | A-001..A-007 | 7 | 6 | 1 | 0 | F-005 |
| channel | A-010..A-018 | 9 | 9 | 0 | 0 | none |
| wiring | A-020..A-023, A-029, A-030 (plus 1 sub-claim) | 7 | 5 | 1 | 1 | F-004, E-001 |
| configuration | A-024..A-028 | 5 | 4 | 1 | 0 | F-003 |
| persistence | A-031..A-033 | 3 | 3 | 0 | 0 | none |
| security | A-040..A-053 | 14 | 12 | 2 | 0 | F-001, F-005 |
| error | A-054..A-056 | 3 | 3 | 0 | 0 | none |
| admin | A-057 | 1 | 1 | 0 | 0 | none |
| scenario | A-060..A-114 | 52 | 50 | 2 | 0 | F-002, F-006 |
| background | A-120..A-123 | 4 | 4 | 0 | 0 | none |
| data | A-130..A-135 (plus 1 sub-claim) | 7 | 6 | 0 | 1 | E-002 |
| integration | A-140..A-143 | 4 | 3 | 1 | 0 | F-006 |
| dependency | A-144..A-145 | 2 | 2 | 0 | 0 | none |
| broken-wiring | A-150..A-152 | 3 | 3 | 0 | 0 | none |

Return stage for all findings: **1** (parity map and reconnaissance).

<a id="read-findings"></a>

## Findings

<a id="read-f-001-the-login-page-discloses-the-default-sysadmin-credential"></a>

### F-001 - The login page discloses the default sysadmin credential

- Severity: medium
- Comparison check IDs: C-031, C-123, C-175, C-366, C-373
- **Checklist link:** CHK-004 ([`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks), row CHK-004); otherwise a new finding.
- **Checklist discrepancy:** CHK-004 requires the per-variant value of a displayed bundle text. The BA-001-05 self-check records "no locale-dependent statement changed", and row 9 carries no per-bundle note for `login.instructions`. This is a failed per-variant statement, not a claim of past noncompliance.
- **Required recheck:** CHK-004 on row 9 and every other row that quotes or describes a login-page or public-page text. Expected: the value per bundle is stated.
- Expected and source:
  - `WAR:WEB-INF/jsp/security/login.jsp:34-39` renders `login.instructions` with `{0}` = `login.instructions.url` whenever that URL is set.
  - The effective override sets it (`WAR:WEB-INF/classes/xplanner-custom.properties:49`).
  - The default bundle text (`WAR:WEB-INF/classes/ResourceBundle.properties:784`) ends with a sentence that states the default login name and password.
  - That credential verifies against the seeded sysadmin digest in `WAR:WEB-INF/classes/db-changelog.xml:404`: `XPlannerLoginModule#digestPassword` is MD5 over salt then password, and the recomputation matched. The value is not reproduced here (constitution A3).
  - `login.instructions` is defined only in the default, `--` and `de` bundles. `--` and `de` omit the credential sentence. The da, es, fr, it, ja, pt_br and ru bundles have no key and fall back to the default text (framework behavior, GAP-011).
- Observed difference:
  - Row 9 describes only "a help link with login instructions".
  - Row 64 states that the seeded credentials are "documented only in [`legacy/README.md`](../../legacy/README.md), not evidence", which is incorrect.
  - GAP-007 and the Q3 facts do not list that the application advertises a working administrator credential on its unauthenticated login page.
- Evidence: the citations above; the listing of `XPlannerLoginModule#digestPassword`; the per-bundle key search.
- Requirement impact: UF-001 login and UF-004 startup. This is a security fact under Principle XI and Q3, and it bears on Stage 3 account preparation.
- Required action:
  - Correct row 64.
  - Extend row 9 with the disclosed content and a per-bundle note.
  - Add the fact to GAP-007 and the Q3 facts without reproducing the credential value.
- Return stage: 1

<a id="read-f-002-the-task-board-parameter-mismatch-does-not-exist"></a>

### F-002 - The task-board parameter mismatch does not exist

- Severity: low
- Comparison check IDs: C-064, C-222, C-372
- **Checklist link:** CHK-003 (row CHK-003): claimed behavior must be traced along the actual call path.
- **Checklist discrepancy:** the author claims a broken parameter path. Tracing it through the link tag shows that the path works. The claim is unsupported.
- **Required recheck:** CHK-003 on row 113, and on every row or fact that relies on a request parameter being absent from a link rendered by `xplanner:link`. Expected: the parameters added by the tag are taken into account.
- Expected and source:
  - `WAR:WEB-INF/jsp/view/iteration/globalLinks.jsp:14-18` renders the dashboard link through `xplanner:link`, only for active iterations.
  - `com.technoetic.xplanner.tags.LinkTag#addNavigationParameters` (listing) always puts `fkey`: the tag's `fkey` attribute when it is non-zero, otherwise the current request's `oid` parameter. It also adds `returnto` and `projectId` when those options are on.
  - On every iteration page (`/do/view/iteration*?oid=<id>`) the link therefore carries `iterationId=<id>` and `fkey=<id>`.
  - `WAR:WEB-INF/jsp/view/dashboard.jsp:132` calls `rest/view/iteration/${param.fkey}/userstories` with the iteration ID.
- Observed difference:
  - Row 113 is `Partial` because the "request parameter name differs from the link parameter (iterationId)".
  - The Q2 facts list "Parameter mismatch between link and REST call".
  - Also: the left column is titled "not started" in the page (`dashboard.jsp:101`); row 113 calls it "not-estimated".
- Evidence: listing of `LinkTag#addNavigationParameters`; the JSP lines above.
- Requirement impact: UF-006 task board. A working surface is recorded as broken, which would mislead the Stage 4 parity decision.
- Required action:
  - Correct row 113. It should show the board loading from the REST API with the iteration ID; keep the client-only drag.
  - Set its status from the evidence.
  - Remove or correct the Q2 fact.
- Return stage: 1

<a id="read-f-003-hibernate-settings-from-the-properties-files-are-not-applied"></a>

### F-003 - Hibernate settings from the properties files are not applied

- Severity: low
- Comparison check IDs: C-023, C-343, C-368
- **Checklist link:** CHK-003 (row CHK-003): configuration wiring, consumer receives the value.
- **Checklist discrepancy:** the author's CHK-003 self-check covers loaders of wiring files. The reconnaissance still treats the `hibernate.*` values in `xplanner.properties` as effective for the web application without a consumer that passes them on. This is a failed consumer check.
- **Required recheck:** CHK-003 over every configuration key the reconnaissance or rows call effective. Expected: each names its consumer on the runtime path.
- Expected and source:
  - The web `sessionFactory` is `AnnotationSessionFactoryBean` with only `dataSource`, `packagesToScan` and `mappingLocations` (`WAR:WEB-INF/classes/spring-beans.xml:77-81`).
  - The placeholder configurer is used only for the four `${hibernate.connection.*}` values of the pool (`:61-64`).
  - No `hibernate.properties` or `hibernate.cfg.xml` exists in the WAR or in any JAR root. The search matched `ehcache-failsafe.xml` as a positive control.
  - The only consumers of `hibernate.dialect` are `SystemInfo` (display) and `HibernateHelper`, which builds a separate session factory used only by standalone tools (`TomcatUserImporter`, `BootstrapSystemUser`, `IdGenerator`, `HsqlServer`). `hibernate.query.substitutions` is read only by the JSP tag `UseBeansTag`.
  - Therefore `hibernate.dialect=XPlannerMySQLDialect` and `hibernate.show_sql` (`WAR:WEB-INF/classes/xplanner-custom.properties:15,19`, also `xplanner.properties:10`), and `hibernate.cache.provider_class`, `use_query_cache`, `use_second_level_cache` and `query.substitutions` (`WAR:WEB-INF/classes/xplanner.properties:57-58,202-203`) are expected not to reach the web session factory. The dialect would be resolved from the connection metadata, and no second-level or query cache would be active (`Inferred`).
- Observed difference:
  - The Source Inventory Configuration row states "Effective settings: MySQL `jdbc:mysql://db/xplanner` with the XPlannerMySQLDialect".
  - GAP-005 P-01 lists `XPlannerMySQLDialect` among the effective patched conclusions.
  - Nothing records that the cache and substitution settings are inert for the web application.
- Evidence: the citations above; the class-string consumer search with positive matches in `SystemInfo` and `UseBeansTag`.
- Requirement impact: the Stage 3 expectations and Stage 9 NFR discovery (caching, SQL dialect) of the baseline.
- Required action:
  - Correct the Configuration row and P-01 to separate the pool settings, which are effective, from the Hibernate settings, which are not delivered.
  - Mark the effect `Inferred`.
- Return stage: 1

<a id="read-f-004-the-print-layout-is-reachable-by-url"></a>

### F-004 - The print layout is reachable by URL

- Severity: low
- Comparison check IDs: C-026, C-336, C-376
- **Checklist link:** none: new finding. It relates to the workbook rule "read the enclosing context before citing a line as live".
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  - `com.technoetic.xplanner.tags.ContentTag#doStartTag` calls `PrintLinkTag#isInPrintMode(pageContext)`, which is true when the request has a `print` parameter (listing), and then uses the Tiles definition `tiles:print`.
  - That definition extends `tiles:view` with `displayMode` `print` and empty header and footer (`WAR:WEB-INF/tiles-definitions.xml:23-28`).
  - `xplanner:content` is used 76 times in 43 JSP pages. Any of these pages requested with a `print` parameter (for example `?print=true`) is therefore rendered with the print definition, whose header and footer are empty.
- Observed difference: the Tiles row says "`tiles:print` has no user". The Parity-Map Boundary excludes "the `tiles:print` definition and `PrintLinkTag` (no user)". No row records the print view.
- Evidence: the listings of `ContentTag#doStartTag` and `PrintLinkTag#isInPrintMode`; `tiles-definitions.xml:23-28`.
- Requirement impact: UF-004 platform (print-friendly view reachable by URL). The Q2 parity decision needs the fact.
- Required action: correct the Tiles row and the exclusion, and add a row (reachable by URL only) or a justified exclusion.
- Return stage: 1

<a id="read-f-005-unauthenticated-exposure-facts-are-incomplete"></a>

### F-005 - Unauthenticated exposure facts are incomplete

- Severity: low
- Comparison check IDs: C-007, C-043, C-367 (and C-373)
- **Checklist link:** none: new finding. It relates to CHK-002: access conditions per channel.
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  - Log4j writes `ACTIVITY_FILE` to `${xplanner-plus.root}/xplanner-plus-activity.log`, and `webAppRootKey` sets `xplanner-plus.root` to the webapp root (`WAR:WEB-INF/classes/log4j-war.xml:44-58`, `WAR:WEB-INF/web.xml:45-52`; the filter that writes it is mapped at `web.xml:130-133`). The live log, with the user ID, client IP address and query string of every `/do/*` request (`ActivityLogFilterHelper` calls `getUserId`, `getRemoteAddr` and `getQueryString`), is therefore written into the publicly served web root. No filter or constraint covers that path (`web.xml:130-181`).
  - The welcome file `index.jsp` is not mapped to any security filter (`web.xml:160-167,321-323`), although `security.xml:16` lists it in a constraint. Without a session it runs the `hidden = false` project query and redirects to `/do/view/iteration?oid=<id>` when exactly one non-hidden project exists and it has a current iteration (`index.jsp:7-31`), which reveals that ID before login.
- Observed difference:
  - Row 72 records the log content and file name, but not that the file is written into the public web root.
  - GAP-013 addresses only the shipped 2011 log file ("served statically if the container allows it").
  - The Q3 facts and GAP-007 list neither the live log exposure nor the unfiltered `index.jsp`.
  - Row 18 describes the redirect without its access condition.
- Evidence: the citations above.
- Requirement impact: Q3 security facts and Stage 3 checks. The container's static serving of web-root files is framework behavior (`Inferred`, runtime unverified).
- Required action: add both facts to GAP-007 and the Q3 facts, and state the access condition in rows 18 and 72.
- Return stage: 1

<a id="read-f-006-wiki-word-rendering-calls-the-external-wiki-from-the-server"></a>

### F-006 - Wiki-word rendering calls the external wiki from the server

- Severity: low
- Comparison check IDs: C-094, C-113, C-292, C-361
- **Checklist link:** none: new finding. It is closely related to CHK-003 (side effects on the call path) and repeats the pattern of pass-001 F-006, the e-mail stylesheet fetch.
- **Checklist discrepancy:** not applicable
- **Required recheck:** not applicable
- Expected and source:
  - `TwikiTag` builds `TwikiFormat` from the properties. `TwikiFormat` instantiates the class named by `twiki.wikiadapter`, which is `GenericWikiAdapter` in `WAR:WEB-INF/classes/xplanner.properties:113`, and calls `ExternalWikiAdapter#formatWikiWord` in `#format`.
  - `GenericWikiAdapter#isTopicExisting` (listing) opens `new URL(<topic.url.existing with the word>).openStream()` and reads the page to decide between an existing and a new topic. The URL is `http://localhost:9090/vqw/jsp/Wiki?topic=${word}` (`:114-116`), and existing topics are cached.
  - Rendering any description that contains a WikiWord therefore makes a server-side outbound HTTP request (`Inferred` for the exact branch; runtime unverified).
- Observed difference: row 188 records only markup and links. The Data And Integrations External wiki row says "Example endpoints only". The server-side request, and its failure or latency behavior when the host is unreachable, are unrecorded.
- Evidence: the listings and strings above.
- Requirement impact: UF-011 formatting; integration and NFR discovery.
- Required action:
  - Record the outbound request in row 188, or in a new row, and in the Data And Integrations wiki row.
  - Note its dependency on the configured URL (GAP-005 P-03).
- Return stage: 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| workbook audit | `npm --prefix analysis/tools run audit:workbook` | pass (exit 0, `WORKBOOK AUDIT OK`, 208 scenarios, 18 epics); workbook hash unchanged | [`phase-b-tools/audit-workbook.txt`](./evidence/S02-P004/phase-b-tools/audit-workbook.txt) |
| artifact links | `npm --prefix analysis/tools run audit:artifact-links` | first run exit 1, failing on this reviewer's own evidence file (`access-log.md:128`, a backticked repository path without link); corrected in that file; rerun as `node analysis/tools/artifact-reference-links.js --check`: exit 0; final run of the npm script after all evidence writes: exit 0, `ARTIFACT REFERENCE LINK AUDIT OK: 207 Markdown document(s) checked` | [`phase-b-tools/audit-links.txt`](./evidence/S02-P004/phase-b-tools/audit-links.txt) (first run); access log |
| artifact reading (this report) | `node analysis/tools/artifact-reading.js --file .migration-tmp/stage-02-p004/reviewer-scratch/stage-02-pass-004.md` | exit 0, `errors: []` (run on the final text) | access log |
| CHK-001 citations | reviewer `citecheck.js` | pass: 436 file citations (432 automatic, 4 heuristic misses verified by hand), 3 basename-ambiguous resolved, 174 class/method citations (1 intentionally absent class) | [`phase-b-tools/citecheck.txt`](./evidence/S02-P004/phase-b-tools/citecheck.txt) |
| CHK-005 validator keys | reviewer sweep over form `validate`/`valideRow` constants | pass: 41 distinct keys (47 with inherited), 0 uncovered | report text |
| CHK-007 figures | reviewer `figures.js`, `xlsx2json.js` | pass: all reconnaissance counts reproduce | report text |
| UI text check | reviewer `quotecheck.js` | 118 of 128 quoted texts literal; 10 paraphrased or templated, checked by hand, none misleading | [`phase-b-tools/quotecheck.txt`](./evidence/S02-P004/phase-b-tools/quotecheck.txt) |
| worktree unchanged | `git status --short` in `.migration-tmp/stage-02-p004/phase-a` | clean before and after | access log |

<a id="read-blocked-scope"></a>

## Blocked Scope

Every not-checked item has a B-NNN entry and remains visible in the summary.
Every not-applicable item has an E-NNN entry with a reason and scope evidence.

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-120 | the startup "XPLANNER INFO" log block of `SystemInfo` is internal diagnostic output with no user, operator or integration contract; the same data is covered by row 55 | reviewer judgment under the workbook rule "prefer behavior visible to a user, operator, or external system" | `SystemInfo#setServletContext` |
| E-002 | C-121 | the pair-programming effort option (`xplanner.pairprogramming=double` doubles paired effort) is not set in any loaded file; shipped behavior (effort = duration) is what rows 106 and 142 describe | configuration evidence | `TimeEntry#getEffort` listing (default `single`) |
| E-003 | C-364 | the author's scratch tool outputs under `.migration-tmp/stage-01/**` are forbidden inputs for this pass | PM packet ("earlier scratch" forbidden); the figures they produced were regenerated independently (CHK-007) | packet, release message |

- Blocker: none
- Exact unchecked scope: none
- Required prerequisite: none
- Reassignment/closure reference: not applicable

<a id="read-interaction-log"></a>

## Interaction Log

Record only dispositions and repeat-check results known at this pass.
Later corrections belong to a new disposition record or review linked to this
immutable report; never fill future results into an already pinned report.

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-006 | this report; [`comparison-results.json`](./evidence/S02-P004/comparison-results.json) | pending | pending | pending |

Process interactions:

| Time (UTC) | Event |
|---|---|
| 13:44-13:46 | ACK |
| 13:46:40 | PM accepted the ACK and the disclosed exposure |
| 14:07:39 | Phase A checkpoint |
| 14:08:46 | PM released Phase B |

There were no context resets and no challenge rounds.

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:** F-001 links to CHK-004 (per-bundle login text). F-002 and F-003 link to CHK-003 (the parameter path; the consumer of configuration). F-004, F-005 and F-006 are new findings. All other checks were re-applied and passed.

The result is `findings`:

- Six actionable mismatches exist in the Stage 1 records: 1 medium and 5 low.
- All 405 comparison items were checked. None is not-checked, so unresolved blocked scope is zero.
- Independence and protocol were maintained.

The process returns to **Stage 1** for F-001..F-006. Stage 1 follows the [return and correction protocol](README.md#return-and-correction-protocol), records dispositions outside this report, and reruns `audit:workbook`. A new fresh eligible Stage 2 pass with its own blind Phase A must follow. This pass cannot close Stage 2.

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). Record actual checking, not a copied
claim from an earlier attempt. At blind Stages 2 and 19 this section is Phase B
only: learned checks and prior self-check/learning notes are withheld until the
independent Phase A snapshot is saved.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `2abe6fa4fbd89c227574317fc422618ad7748584b3996c5b1febb1ec902d5165` (CHK-001..CHK-008), first opened in Phase B at 14:13:19Z
- Author self-check record/version: [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md#read-error-prevention), BA-001-05, against checklist `ea8f3309…` (CHK-001..CHK-007; CHK-008 was admitted after BA-001-05)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; all line citations in rows and reconnaissance | new and changed citations checked, 0 failures (BA-001-05) | passed for all citations, not only changed ones: C-403, citecheck | none |
| CHK-002; rows stating permission or access conditions | changed rows state no new permission condition (BA-001-05); applied to every permission row in BA-001-04 | passed for the stated conditions; rows 28, 31, 34, 35 re-verified by listings (RC-002, RC-007, RC-011). Two unauthenticated access facts are missing (F-005, recorded as a new finding) | F-005 (no CHK link) |
| CHK-003; effects and configuration wiring per entry point | configuration loaders swept; effect queries checked against the mappings (BA-001-05) | failed for the consumer of the `hibernate.*` values (F-003) and for the traced parameter path of the task board (F-002) | F-002, F-003: recheck row 113 and all "effective" configuration claims |
| CHK-004; locale-dependent texts and formats | "no locale-dependent statement changed" (BA-001-05) | failed for `login.instructions` (row 9 has no per-variant statement) | F-001: recheck row 9 and public-page texts |
| CHK-005; form validation keys | 17 validators and 47 keys covered, with a positive control | passed: C-404 | none |
| CHK-006; delete scenarios | delete rows unchanged; row 219 `deleteAttribute` recorded as a failing query | passed: rows 49, 81, 90, 125, 141, 173, 175 state cascades and foreign keys (RC-003 confirms row 81); row 219 consistent with RC-008 | none |
| CHK-007; figures after correction | all figures regenerated and superseded numbers searched | passed: C-405 | none |
| CHK-008; query property paths | not listed by BA-001-05, which applied CHK-001..CHK-007; its CHK-003 note states that every effect query was checked against the entity mappings | passed: the unmapped paths `task.story`, `object.projectId` and `a.targetId` are all recorded (C-399, RC-004, RC-006, RC-008); the reviewer's string search of the classes and JSPs that rows cite found no further unmapped path | none |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

The self-check below concerns this reviewer's work; the author's claims and
the independent comparison belong in Checklist Review above.

- **Self-check:**
  - Scope: Stage 2 pass 004, this report and the evidence in [`analysis/reviews/evidence/S02-P004/`](./evidence/S02-P004), against checklist `2abe6fa4…`.
  - CHK-001 passed: every line citation in this report was taken from a per-file numbered read.
  - CHK-002 passed: F-005 cites the filter mappings.
  - CHK-003 passed: every effect in F-003 and F-006 cites its consumer path.
  - CHK-004 passed: per-bundle values are stated in F-001.
  - CHK-007 passed: the totals were regenerated by `ledger.js`.
  - CHK-005, CHK-006 and CHK-008 are not applicable to the reviewer's own claims beyond the checks above.
- **Learning update:**
  - P-1, new: "Before recording that a link lacks a request parameter, resolve the parameters that the rendering tag or framework adds (for example `LinkTag#addNavigationParameters` adds `fkey`, `projectId`, `returnto`)." Basis: F-002.
  - P-2, new: "Enumerate unauthenticated surfaces mechanically: every file written under or shipped in the web root, every page not covered by a security filter mapping, and every text on public pages across all bundle variants, including default credentials." Basis: F-001, F-005.
  - P-3, refines CHK-003: "A configuration value is effective only when the consuming factory or bean actually receives it; property sets for libraries (for example `hibernate.*`) need the bean that passes them on." Basis: F-003.
  - P-4, refines CHK-003: "For every rendering path, record server-side side effects that are not visible in the page, such as outbound network requests (wiki topic lookups, stylesheet fetches) and layout switches driven by request parameters (`print`)." Basis: F-004, F-006, and the earlier pass-001 F-006.
  - The coordinator decides admission and deduplication.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable. Stage 2 does not review the feature dependency graph, which does not yet exist; the Stage 10/16 dependency review does not apply.

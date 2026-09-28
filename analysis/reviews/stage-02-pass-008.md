# Stage 02 Review - Pass 008

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
> [!CAUTION]
> **Result: `invalid` - Stage 2 pass 008 (correction validation of BA-001-09; root pass 006, previous pass 007)**
>
> **Why invalid:** the reviewer broke the owner-imposed access boundary once. The client saved the 31.5 KB output of the reviewer's own `git diff` to its tool-results folder under the user profile, and the reviewer opened that file. It held only that command output, now regenerated in the reviewer scratch. The packet says any read outside the allowed folders invalidates the pass, so this attempt cannot close anything or serve as a chain predecessor. The owner decides, through PM, whether that consequence stands.
>
> The observations are kept. On their own they would give `findings`, not `clean`:
> - **Chain:** eligible. Pass 006 is a valid root and pass 007 a valid predecessor. BASE..PREV equals the change set pass 007 recorded. The legacy source is identical.
> - **Change set PREV..CAND:** 13 reconnaissance hunks and 6 cells in 5 rows (8, 56, 60, 98, 101). No status changed and no row was added.
> - **Closed:** pass-007 F-002 (button script), pass-007 F-003 (45 public-page keys), the Spring part of pass-007 F-001 and with it the view-name remainder of pass-006 F-002.
> - **F-001 (low):** the Tiles part of pass-007 F-001 is still incomplete. Struts resolves `returnto` against the definitions factory that the Spring `TilesConfigurer` creates first, and that factory also loads `tiles-pages.xml`. So 5 names apply, including `viewLayout`, not 4.
> - **F-002 (low):** on the login and error pages the breadcrumb loads the object named by a request `oid` or `fkey`, with no sign-in and no permission check, and prints the names of its project, iteration, story and task. The records do not state this.
> - **F-003 (low):** two new check figures cannot be reproduced: "46 findForward calls in 30 methods" (own count: 44 in 31) and "77 dynamic outputs" (no counting rule stated).
>
> 27 new checks: 15 matched, 11 mismatch, 0 not-checked, 1 not-applicable. Coverage: 556 obligations = 66 newly checked + 490 retained + 0 uncovered.
>
> **Checklist issues:** F-001 fails CHK-012 and CHK-003. F-002 fails CHK-011 and CHK-012. F-003 fails CHK-007.
>
> **Next:** PM puts the boundary deviation to the owner. Under the stated rule, a new fresh correction-validation session is needed (pass 009, root pass 006, previous pass 007). Stage 3 is not authorized.
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
- [Stage 2 Correction Validation](#read-stage-2-correction-validation)
- [Comparison Scope](#read-comparison-scope)
- [Comparison Results](#read-comparison-results)
- [Coverage Summary](#read-coverage-summary)
- [Stage-Specific Evidence](#read-stage-specific-evidence)
  - [Open-Item Closure](#read-open-item-closure)
  - [Retained Coverage](#read-retained-coverage)
- [Findings](#read-findings)
  - [F-001 - Struts resolves returnto against five Tiles definitions, not four](#read-f-001-struts-resolves-returnto-against-five-tiles-definitions-not-four)
  - [F-002 - Public-page breadcrumb loads a request-named object and shows its names](#read-f-002-public-page-breadcrumb-loads-a-request-named-object-and-shows-its-names)
  - [F-003 - Two new check figures cannot be reproduced](#read-f-003-two-new-check-figures-cannot-be-reproduced)
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

- Date: 2026-09-28
- Stage: 02
- Pass: 008
- Scope: project; the Stage 1 records after BA-001-09 ([`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) and [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx), 210 rows) against [`legacy/xplanner-plus.war`](../../legacy/xplanner-plus.war); the complete change set PREV..CAND, the open items of the chain, the related mechanisms and the refined checks over the whole governed scope
- Reviewed revision: `605f94df9a52004945f4ad991d0018c57d1bb49b` (CAND)
- Base revision: `4c1ada255ef8b662b7d51f45eaaed17b8547e3e6` (PREV, reviewed by pass 007); root baseline `15cb6b26946f73596177eba8cead333383d9f728` (BASE, reviewed by pass 006)
- Reviewer product: Claude Code subagent, model `claude-opus-5-5`
- Reviewer ID: `claude-opus-5-5-ba-reviewer-p008`
- Session ID: the client-assigned subagent ID of this session (not exposed inside the session; PM records it), subagent of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`
- Authored artifacts in reviewed scope: none
- Independence record: [`analysis/reviews/evidence/S02-P008/independence-record.md`](evidence/S02-P008/independence-record.md)
- Waiver IDs reviewed: none
- Orchestration packet: `S02-P008`, [`packet.json`](evidence/S02-P008/packet.json) SHA-256 `3401f782b3dcfbcf8067830088ce359055e6d93c499556c2515a4c89ee7093e3`
- Result: invalid
- Artifact set version: not applicable (Stage 2)
- Artifact manifest SHA-256: not applicable (Stage 2)
- Verification mode: expanded (the complete change set, its dependencies and the refined checks over the whole governed scope)
- Control mode: correction-validation
- Verification baseline: pass 006 at BASE (reconnaissance `0536f243...d332`, workbook `a87c8383...6f99`); pass 007 at PREV (reconnaissance `c672ad6f...43a1`, workbook `2949146c...2305`)
- Expansion trigger: none for a full-blind pass; bounded expansion to the Tiles loader chain and the public-page tag handlers

<a id="read-independence-declaration"></a>

## Independence Declaration

- [x] I did not create or edit any artifact in this review scope.
- [x] My current context does not include the authoring session.
- [x] I am working read-only from the declared immutable revision.
- [x] I independently enumerated the complete scope.
- [x] I followed the access boundary of my declared control mode: for Stage 2
      full-blind, I saved the complete source inventory before opening prior
      conclusions or filled records; for correction-validation, I used the
      permitted prior evidence without claiming a new blind Phase A. Other
      stages follow their own access rules.

The last box covers the mode's rules for reading prior evidence, and those were followed. The project packet adds a stricter folder boundary. I broke that boundary once:

- **What happened:** I opened the client's persisted copy of my own command output in the client tool-results folder under the user profile.
- **Consequence:** the packet makes this attempt invalid. The details are in the [independence record](evidence/S02-P008/independence-record.md) and the [access log](evidence/S02-P008/access-log.md).
- **What it did not affect:** the reviewer's independence from the author. Nothing outside the project entered the review through that file.

<a id="read-scope-and-inputs"></a>

## Scope and Inputs

- **Legacy source:** the four files of [`legacy/`](../../legacy). The committed blobs are identical at BASE, PREV and CAND (`git show` hashes). The WAR is `46ff9dc0...4edc`, and the committed `demo-seed.sql` is `41b2f6a3...66e1`. The working copy reads `2d32f7d5...387e` because of CRLF conversion (`core.autocrlf`, `text=auto`). The WAR was extracted into reviewer scratch with Windows `tar.exe`: 964 files.
- **Root baseline:**
  - Report: [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`.
  - Blind checkpoint: [`phase-a-snapshot.md`](evidence/S02-P006/phase-a-snapshot.md) `c8d4f780...74d9` and [`phase-a-inventory.json`](evidence/S02-P006/phase-a-inventory.json) `8f734d0d...4cbe`.
  - Ledger: [`comparison-results.json`](evidence/S02-P006/comparison-results.json) `a205b9b5...702c`.
  - The other S02-P006 files also match the packet.
- **Previous control:**
  - Report: [`stage-02-pass-007.md`](stage-02-pass-007.md) `e2fd2da2...bf53b`.
  - Ledger: [`comparison-results.json`](evidence/S02-P007/comparison-results.json) `7dda3cf4...2c41`.
  - Coverage record: [`coverage-reconciliation.json`](evidence/S02-P007/coverage-reconciliation.json) `dbbc987c...2f7d`.
  - Change set: [`change-set.json`](evidence/S02-P007/change-set.json) `d7285533...e36e`.
  - The other S02-P007 files also match the packet.
- **Intervening records:**
  - [`stage-02-pass-006-dispositions.md`](../stages/stage-01/stage-02-pass-006-dispositions.md) `5f11d1f6...504e` (BA-001-08).
  - [`stage-02-pass-007-dispositions.md`](../stages/stage-01/stage-02-pass-007-dispositions.md) `d6328521...1638` (BA-001-09).
  - [`starter-sync-2026-09-25-c7d0188.md`](../maintenance/starter-sync-2026-09-25-c7d0188.md) `3e125dc7...f83d` (process only).
  - Passes 001-005 through the pass-006 and pass-007 open-item tables.
- **Candidate:**
  - [`analysis/legacy_reconnaissance.md`](../legacy_reconnaissance.md) `649870c1...d130`.
  - [`analysis/legacy_user_flows.xlsx`](../legacy_user_flows.xlsx) `df7437be...5fdc`.
  - Checklist [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md) `599fbd66...cff2`.
  - The main working tree carries the same record bytes.
- **Instructions:**
  - [Stage 2 Correction Validation](README.md#stage-2-correction-validation), plus the Stage 2, Comparison Record Contract, Results and Independence sections of [`README.md`](README.md) and its credential rule with the project addition.
  - [Correction-Validation Packets](../agent_orchestration.md#correction-validation-packets).
  - [`SKILL.md`](../../.agents/skills/migration-ba/SKILL.md), blob `d09ba8ced6616dc34fb30a9f2ecde6ab9c3a5398`.
  - [`stage-NN-pass-NNN-template.md`](stage-NN-pass-NNN-template.md) and [`error-prevention.md`](../error-prevention.md).
- **Explicit exclusions:**
  - Author tool-execution facts (E-001).
  - The Stage 1 author scratch as evidence. One author tool was read only to understand a figure's definition.
  - Earlier reviewer scratch, earlier-migration links (A2), any runtime, network, and git history outside BASE, PREV and CAND.

<a id="read-method-and-coverage"></a>

## Method and Coverage

- **Change set, regenerated:** `git diff` PREV..CAND gives 13 files and 4 commits, classified in [`change-set.json`](evidence/S02-P008/change-set.json).
  - The reconnaissance diff has 13 hunks (`-U0`).
  - The workbook was dumped cell by cell with exceljs (value, note, fill, font, hyperlink, outline), and its package parts were hashed. Only `xl/sharedStrings.xml` differs, and 6 cells in 5 rows changed.
  - BASE..PREV was regenerated the same way and compared with the pass-007 change set. File lists, hunk headers and cell lists are identical.
- **Source analysis:** an own dependency-free class-file reader and disassembler covered the 594 application classes and the classes of `spring-webmvc-3.0.5`, `spring-struts-3.0.5` and `struts-1.2.9` where framework behavior matters.
  - A tokenizer found the script contexts in all 74 JSP and tag files. It treats scriptlets, EL and nested custom tags as opaque.
  - A public-page key counter walked the render chain.
  - Bundles were parsed with a `java.util.Properties`-compatible key parser. A navigation-site inventory covered all classes.
  - Every negative claim has a positive control.
- **Impact mapping:** each of the 550 chain obligations was mapped through BASE..PREV and PREV..CAND (`impactmap.js`): baseline line to previous line to changed-or-not, plus row and section references. The generator refuses a double mapping, a retained mismatch and a retained item on a changed row or line.
- **Line citations (CHK-001):** 60 of 60 in the change set, each checked against the cited element; 572 of 572 in the whole records.
- **Batches:** one batch, no context reset, no sampling within the declared scope.
- **Worktree state:** WT-B, WT-P and WT-C had an empty `git status --short` at start and end. The main tree showed only the PM status edit and this pass's evidence folder.
- **Credential safety:** values are held in memory only. The self-scan result is in the Reviewer Self-Check.

<a id="read-stage-2-phase-a-blind-inventory"></a>

## Stage 2 Phase A - Blind Inventory

Not applicable: control mode correction-validation. No blind inventory was created, claimed or recreated. The frozen Phase A of the root pass (pass 006) serves only as provenance.

<a id="read-phase-a-saved-checkpoint"></a>

### Phase A Saved Checkpoint

Not applicable (correction-validation). The eligibility of the pass-006 checkpoint is assessed in the correction-validation section below.

<a id="read-stage-2-phase-b-two-way-reconciliation"></a>

## Stage 2 Phase B - Two-Way Reconciliation

Not applicable: correction-validation has no delayed Phase B. Prior evidence was permitted at launch.

<a id="read-stage-2-correction-validation"></a>

## Stage 2 Correction Validation

- **Root full baseline:** pass 006, [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...cff67`, a historical full-blind pass without mode metadata. I re-validated its eligibility myself:
  - *Independence:* reviewer session `a700bf31602b78dd0`, not the author (`a5bb18013a4f4d2f8`). Its launch exposure (commit subjects, a generic README note) was disclosed and accepted before Phase A. It is non-substantive.
  - *Blind checkpoint:* the inventory has 138 items. Its hash and the snapshot pin equal [`pm-phase-b-release.json`](evidence/S02-P006/pm-phase-b-release.json). The access log shows the checkpoint at 13:24:11Z, the release at 13:25:05Z and the first Phase B input at 13:26:11Z.
  - *Completeness:* 539 contiguous items: 519 matched, 17 mismatch, 3 not-applicable, 0 not-checked. All 138 A-items are compared (inventory-to-records 138) and all 210 rows are compared (records-to-source 365). There is no blocker, and the exclusions are justified.
- **Latest preceding control:** pass 007, [`stage-02-pass-007.md`](stage-02-pass-007.md) `e2fd2da2...bf53b`, correction-validation, `findings`. Its eligibility as predecessor:
  - *Independence:* session `a6795def1ddcf5e91`, distinct from the author and from pass 006. It read one author output only to understand a claim and disclosed it.
  - *Coverage:* 550 = 93 + 457 + 0. I checked that all 539 pass-006 items are mapped exactly once, that no mismatch is retained, and that all 17 pass-006 mismatches were rechecked. 0 not-checked, 0 blockers.
  - *Evidence:* all files are retrievable and match the packet.
  - *Change set:* BASE..PREV regenerated by me equals its [`change-set.json`](evidence/S02-P007/change-set.json): 78 files, 6 commits, 22 hunks, 29 cells in 26 rows.
- **Chain:** the review ledger in [`migration_status.yaml`](../migration_status.yaml) holds Stage 2 passes 1-7, all `findings`, with distinct session IDs. No attempt is skipped, invalid or superseded.
- **Source identity:** the legacy blobs are identical at BASE, PREV and CAND. The governed scope is unchanged: the two Stage 1 records, 210 rows, the same channels.
- **Baseline and candidate:**
  - reconnaissance `0536f243...` (BASE), `c672ad6f...` (PREV), `649870c1...` (CAND);
  - workbook `a87c8383...`, `2949146c...`, `df7437be...`.
- **Eligibility decision: eligible.** No full-blind trigger exists:
  - no source or scope change;
  - no new channel or subsystem (F-001 and F-002 lie on the Struts/Tiles navigation and the public login and error pages, which pass 006 inventoried);
  - both predecessors are reliable;
  - the impact is bounded to named facts.
- **Complete change set PREV..CAND:**
  - *Reconnaissance, 13 hunks:*
    - reading block; Scope And Provenance (date, analyst, skill);
    - Source Inventory Spring MVC row; Runnable Surfaces settings row and public-page texts bullet;
    - Build, Run, And Test Evidence: legacy hash, unauth-06, props-parse-08, 3 new tool rows, build-workbook and 4 audit rows;
    - GAP-007; the Q3 reflected-output and navigation facts;
    - Return Correction Evidence (4 rows and the paragraph); Stage 1 Exit Checklist; Error Prevention.
  - *Workbook:* H8, H56 and H98 appended; F60 and H60 rewritten; H101 appended. No status change, no row added.
  - *Checklist:* CHK-007 and CHK-012 refined (pass-007 P-2 and P-1). These are newly applicable checks.
  - *Other files:* PM status, the pass-007 report and evidence, and the BA-001-09 record. None of them is a Stage 1 claim; the record's legacy statements are checked where they matter.
- **Open-finding reconciliation:** see [Open-Item Closure](#read-open-item-closure).
- **Expansion decision:** bounded expansion within the governed scope.
  - I followed the Tiles lookup to every loader of the definition files and to the servlet start-up order (F-001).
  - I followed the public layout's tag handlers to their request reads and data lookups (F-002).
  - Both results are bounded, so there is no full-blind trigger.
  - **Scope question for PM, not a trigger:** stored values written through unescaped EL (for example the breadcrumb's object names) fall outside CHK-012, which covers request-derived values. No Stage 1 record claims coverage of them. Only the public-page instance is part of F-002.

| Required coverage item | Prior report / check IDs | Source and current claim identity | Handling in this pass | New check IDs or retention evidence |
|---|---|---|---|---|
| Spring view-name prefix claims (pass-007 F-001 Spring part; pass-006 F-002 remainder) | pass-007 C-003, C-015, C-040, C-042 (pass-006 C-013, C-110, C-134, C-188, C-378, C-390) | row 60, three reconnaissance statements; changed | rechecked | C-001 |
| Q3 `returnto` and view-name fact | pass-007 C-002 (pass-006 C-127), C-047 | changed (Tiles exception) | rechecked | C-002 |
| Script sink (pass-007 F-002) and dependents | pass-007 C-021, C-036; pass-006 C-478, C-516 | rows 98, 101, Q3 reflected-output fact; changed | rechecked | C-003 |
| Public-page keys (pass-007 F-003) and dependents | pass-007 C-063, C-064, new C-009; pass-006 C-017, C-039 | rows 8, 56, bullet, tool rows; changed | rechecked | C-004 |
| Author checks (h), (i), (j) and refined CHK-012 | pass-007 new C-007, C-057; pass-006 C-126, C-379, C-492, C-534, C-538 | new checks; whole scope | rechecked | C-005, C-006, C-007 |
| New figures and new tool rows | new obligations | added text | rechecked | C-008, C-009, C-013, C-014 |
| Other changed reconnaissance sections | pass-007 C-037, C-038, C-045, C-049, C-053, C-054, C-055 (pass-006 C-429, C-493, C-494, C-500..C-503) | changed | rechecked | C-010..C-012, C-015..C-019 |
| Rows that describe the `returnto` redirect | pass-007 C-011..C-013, C-016, C-017, C-019, C-022, C-025, C-026, C-029, C-031 (11 pass-006 row items) | cells unchanged; dependency touched | rechecked | C-020 |
| Unauthenticated public-page outputs (CHK-011) | pass-007 C-043 (pass-006 C-015, C-135, C-496) | bullet changed; new check applied | rechecked | C-021 |
| Rows and sections cited as sources by the changed claims | pass-006 C-102, C-143, C-144, C-183, C-240, C-306, C-313, C-368 | unchanged; dependency touched | rechecked | C-022 |
| CHK-001, CHK-009, CHK-007 figures, change-set completeness, chain | pass-007 new C-059..C-062, C-065; pass-006 C-521; new | whole records | rechecked | C-023..C-027 |
| All other chain obligations (490) | pass-006 and pass-007 IDs listed in the reconciliation file | byte-identical cells and lines; source identical; mechanism unaffected | retained | groups R8-P7ROW, R8-P7REC, R8-P7NEW, R8-P6ROW, R8-P6REC, R8-P6INV, R8-P6EARLY, R8-P6EXCL in [`coverage-reconciliation.json`](evidence/S02-P008/coverage-reconciliation.json) |

| Reconciled required coverage items | Newly rechecked items | Valid retained items | Uncovered items |
|---|---|---|---|
| 556 | 66 | 490 | 0 |

How the totals are built:

- The 556 items are the 550 chain obligations (539 pass-006 items plus 11 pass-007 new obligations) and 6 new obligations: check (j), two added figures, two added tool rows and chain eligibility.
- The 66 newly rechecked items are 60 prior obligations plus the 6 new ones.
- Each prior obligation appears exactly once, either with its new check or with its retention group and its current evidence (pass-007 or pass-006 check ID).
- The 27 comparison checks below count only newly executed checks.
- Because the attempt is invalid, this coverage cannot be retained by a later pass.

<a id="read-comparison-scope"></a>

## Comparison Scope

- Review mode and exact checked boundary: `expanded correction-validation`, covering:
  - the complete PREV..CAND change set of the two Stage 1 records and its source dependencies;
  - the open items of passes 001-007;
  - checks (h)-(j);
  - the refined CHK-012 and CHK-007 over the whole governed scope;
  - CHK-001, CHK-009 and CHK-011 over the change set and the public pages.
- Previous report and pinned baseline: [`stage-02-pass-007.md`](stage-02-pass-007.md) `e2fd2da2...` (ledger `7dda3cf4...`); root [`stage-02-pass-006.md`](stage-02-pass-006.md) `ee71a38f...` (ledger `a205b9b5...`).
- Changed items and direct dependencies rechecked: the correction-validation table above; the item-by-item list is in [`comparison-results.json`](evidence/S02-P008/comparison-results.json) (`covers`).
- Prior results relied on but not rerun: 490 obligations, grouped with their rationale in [`coverage-reconciliation.json`](evidence/S02-P008/coverage-reconciliation.json). They are not counted as newly matched.
- Expansion triggers examined, none present:
  - source change (legacy blobs identical);
  - scope change (same records and channels);
  - new channel or subsystem (none);
  - unreliable baseline or predecessor (both eligible);
  - systemic or unbounded impact (three bounded facts).

<a id="read-comparison-results"></a>

## Comparison Results

The complete ledger is [`comparison-results.json`](evidence/S02-P008/comparison-results.json).

| Check ID / item | Expected and authoritative source | Observed in this pass | Result | Evidence | Finding / blocker / exclusion |
|---|---|---|---|---|---|
| C-001 / Spring prefix claims: row 60 F and H, Spring MVC row, settings row, GAP-007 and reading-block Spring clauses | `redirect:` and `forward:` outcomes recorded with reach | `UrlBasedViewResolver#createView` tests both prefixes before the normal resolution; `RedirectView#renderMergedOutputModel` prepends the context path only for a leading `/`; `CommonObjectHandler#list`, `#edit` return the path value | matched | bytecode listings | none |
| C-002 / Q3 `returnto` and view-name fact | complete Tiles definition set, complete in-application list | 13 methods reproduce. The fact names 4 definitions; the shared factory has 5 (`viewLayout`). `ViewObjectAction#getForwardPath` is missing from the list | mismatch | Tiles and servlet listings; `web.xml:248,271` | F-001 |
| C-003 / rows 98, 101, Q3 reflected-output fact, GAP-007 button clause | script sink recorded | `editIterationStatus.jsp:32,70` and `struts-config.xml:119-120,245,251` confirmed; the row 101 extension is correct | matched | cell diff; sink scan | none |
| C-004 / public-page key figure and rows 8, 56 | 45 keys with derivation, per bundle | 45 = 39 + `login.title` + 2 scriptlet + 2 footer + `navigation.top`; 4 signed-in, 1 comment; 7 positive controls; per-bundle statements equal in all 10 files; the `navigation.top` extension is correct | matched | `pubkeys.json` | none |
| C-005 / check (h), refined CHK-012 navigation | every request-chosen navigation resolved | sites complete except the safe `ViewObjectAction` append; Tiles set incomplete (C-002) | mismatch | `navsites.json` | F-001 |
| C-006 / check (i), refined CHK-012 output | every request value in script or HTML output listed | 103 contexts reproduce; only `editIterationStatus.jsp:70` and `dashboard.jsp:132`; the HTML outputs are all recorded or justified | matched | `scriptctx.json`, `reqsinks.json` | none |
| C-007 / check (j) and its tag-handler claim | every text of the public layout identified | keys complete; the claim that the back link is the only other tag-handler text is false: `NavigationBarTag` loads the request-named object and prints its names | mismatch | listings | F-002 |
| C-008 / figure "46 findForward calls in 30 methods, 45 constant" | reproducible | 44 in 31, 43 constant + 1 mapping parameter | mismatch | `navsites.js` | F-003 |
| C-009 / figure "77 dynamic outputs" | reproducible, definition stated | not reproducible without the author scratch (54 + 31, or 82) | mismatch | `scriptctx.json` | F-003 |
| C-010 / Scope And Provenance | supported | supported (skill blob `d09ba8ce...`) | matched | git | none |
| C-011 / reading block | agrees with records and source | repeats "4 Tiles definition names" | mismatch | reconnaissance 37-46 | F-001 |
| C-012 / GAP-007 appended clause | supported | supported | matched | hunk 334 | none |
| C-013 / new forwards-09 tool row | reproducible legacy facts | 4 definitions named; figure as C-008 | mismatch | reconnaissance 302 | F-001, F-003 |
| C-014 / new script-sinks-09 and public-keys-09 tool row | reproducible legacy facts | all reproduce except 77 | mismatch | reconnaissance 303 | F-003 |
| C-015 / legacy-hash, unauth-06, props, edit-tools, build-workbook and link-audit rows | reproducible | reproduce (5 rows, 18 epics, 210 rows, last row 234, 31 notes, 226 documents) | matched | cell diff; audit | none |
| C-016 / author tool-execution facts | process records | outside permitted evidence | not-applicable | packet | E-001 |
| C-017 / Return Correction Evidence rows and paragraph | match the actual correction | "no further row affected" is contradicted by F-001 and F-002 | mismatch | reconnaissance 560-565 | F-001, F-002 |
| C-018 / Stage 1 Exit Checklist | supported | 210 rows | matched | workbook dump | none |
| C-019 / Error Prevention BA-001-09 | self-check supported | the CHK-012 navigation claim is incomplete | mismatch | reconnaissance 591-605 | F-001 |
| C-020 / 11 rows that describe the `returnto` redirect | consistent with the refined outcome | unchanged; each points to the Q3 facts | matched | workbook dump | none |
| C-021 / unauthenticated public-page outputs | each output recorded with exposure | breadcrumb object lookup and names not recorded; the 45-key figure omits the `html:messages` keys | mismatch | listings; `login.jsp:50-59` | F-002 |
| C-022 / rows 12, 13, 55, 114, 185, 192; Tiles source row and inventory item | supported | supported; the Tiles source row says 5 definitions | matched | `keypresence.js`; listings | none |
| C-023 / CHK-001 | citations resolve | 60/60 and 572/572 | matched | `citecheck-*.json` | none |
| C-024 / CHK-009 | 0 values | 0 values, 0 pair forms | matched | `credscan.js` | none |
| C-025 / refined CHK-007 over the change-set figures | regenerated; stale values labelled | reproduce; every remaining 41 is labelled historical | matched | dumps | none |
| C-026 / change-set completeness and chain continuity | complete; BASE..PREV equals pass-007 set | complete; equal | matched | [`change-set.json`](evidence/S02-P008/change-set.json) | none |
| C-027 / chain eligibility | root and predecessor eligible | eligible | matched | this section | none |

<a id="read-coverage-summary"></a>

## Coverage Summary

| Total check items | Matched | Mismatch | Not checked | Not applicable |
|---|---|---|---|---|
| 27 | 15 | 11 | 0 | 1 |

Findings: 3 (F-001, F-002, F-003, all low). Blockers: 0. Justified exclusions: 1 (E-001). These counts cover only the newly executed checks. Retained evidence (490 obligations) is reported separately in the reconciliation. Because the attempt is invalid, these counts are observations and support no verdict.

<a id="read-stage-specific-evidence"></a>

## Stage-Specific Evidence

**Actual corrections and independent closure (BA-001-09):**

| Correction | Independent source check | Verdict |
|---|---|---|
| Row 60, Spring MVC row, settings row, reading block, GAP-007 (pass-007 F-001, Spring part) | `UrlBasedViewResolver#createView` and `RedirectView#renderMergedOutputModel` confirm the prefix outcomes; the saved-URL return after login is confirmed in `FormSecurityFilter#onAuthenticationFailure` (GET only) and `AuthenticationAction#execute` | closed |
| Q3 fact, Tiles exception (pass-007 F-001, Tiles part) | `TilesRequestProcessor#initDefinitionsMapping` reads the shared servlet-context factory. `TilesPlugin#initDefinitionsFactory` reuses an existing one. The Spring `TilesConfigurer` (started earlier) builds that factory from both definition files, so 5 names apply, not 4 | open, new F-001 |
| Rows 98, 101, Q3 reflected-output fact (pass-007 F-002) | `editIterationStatus.jsp:32,70`; the page serves both actions | closed |
| 45 keys, rows 8 and 56 (pass-007 F-003) | own counter and parser | closed |
| Check (h) | sites complete except `ViewObjectAction` (safe); Tiles set incomplete; findForward figure wrong | F-001, F-003 |
| Check (i) | complete; the 77 figure cannot be reproduced | F-003 |
| Check (j) | keys complete; tag-handler claim false | F-002 |

**Retained check applicability** and **reconciled whole-scope coverage:** see [Retained Coverage](#read-retained-coverage) and the tables above. For all findings the return stage is **1** (map defects).

<a id="read-open-item-closure"></a>

### Open-Item Closure

| Item (chain) | Author disposition | Independent result in this pass | Status |
|---|---|---|---|
| pass-007 F-001 (low), view resolution | accepted | Spring prefixes closed (C-001). The Tiles exception names 4 of the 5 definitions that apply (C-002) | partially closed; the rest is F-001 of this pass |
| pass-006 F-002 (low), view-name remainder | carried into pass-007 F-001 | Spring prefix outcomes now recorded in every named place (C-001) | closed |
| pass-007 F-002 (low), button script | accepted, extended (row 101) | C-003; the extension is correct | closed |
| pass-007 F-003 (low), public-page keys | accepted, extended (`navigation.top`, 45) | C-004; the extension is correct. Check (j)'s tag-handler conclusion is wrong (F-002) | closed; related new F-002 |
| pass-007 CHK-012 failure (F-001, F-002) | rechecked by the author ((h), (i)) | Spring prefixes and script contexts pass. The Tiles definition set fails (F-001), and a public-page request lookup is found (F-002) | open, as F-001 and F-002 |
| pass-007 CHK-007 with CHK-004 failure (F-003) | rechecked ((j)) | the 45-key figure and the per-bundle notes pass. New CHK-007 failure on two figures of checks (h) and (i) | closed; new F-003 |
| pass-006 F-001, F-003, F-004; passes 001-005 (33 findings); pass-006 and pass-007 E-items | closed or justified by pass 006 and pass 007 | Their rows and sentences are byte-identical at CAND and their mechanisms are not inputs of BA-001-09 (retention groups). The pass-004 F-005 corrections stay in place; F-002 is a new omission under the same CHK-011 | no open item |

<a id="read-retained-coverage"></a>

### Retained Coverage

Every retained obligation appears in [`coverage-reconciliation.json`](evidence/S02-P008/coverage-reconciliation.json) with its current evidence ID and one group:

| Group | Items | Applicability rationale against the complete change set PREV..CAND |
|---|---|---|
| R8-P7ROW | 13 | Rows that pass 007 rechecked after BA-001-08 (35, 59, 81, 90, 124, 125, 137, 139, 141, 169, 173, 209, 210). Their cells are byte-identical at CAND. Their claims concern binding, validation, export or configuration, and none of these is an input of BA-001-09. None of them states the `returnto` redirect outcome. |
| R8-P7REC | 30 | Pass-006 items whose current evidence is a pass-007 check of binding, export content or configuration figures, or of rows 43-149 in aspects other than the redirect. Their text is byte-identical. The keyword-flagged items C-011, C-129, C-375, C-421 are unaffected: binding, the Configuration row and the export row did not change. |
| R8-P7NEW | 3 | Pass-007 C-006 (binding), C-008 (export content), C-058 (XML figures): mechanisms and files unchanged. |
| R8-P6ROW | 175 | Rows outside the 5 changed rows and outside the rows rechecked in C-020 and C-022. Cells byte-identical; source identical. |
| R8-P6REC | 138 | Reconnaissance lines that map unchanged through both diffs. The only line changed in PREV..CAND that a retained pass-006 item referenced (the Q3 reflected-output row, C-478) was moved to C-003. |
| R8-P6INV | 100 | Inventory items mapping to unchanged rows and to byte-identical sentences. Items naming rows 8 or 56, the Tiles row or the unauthenticated list were moved to C-004, C-022 and C-021. Items that name GAP-007 or "Q3 facts" for other facts (credential locations, cookies, HQL, charts) keep their sentences byte-identical. |
| R8-P6EARLY | 29 | Earlier-finding resolutions with unchanged rows and sentences. C-526 and C-530 rely on GAP-007 sentences that are byte-identical, because GAP-007 was only appended to. C-516 (row 98) was moved to C-003. |
| R8-P6EXCL | 2 | Pass-006 E-001 infrastructure items; unchanged. |

<a id="read-findings"></a>

## Findings

These findings are preserved observations of an invalid attempt. The next valid pass must verify them independently.

<a id="read-f-001-struts-resolves-returnto-against-five-tiles-definitions-not-four"></a>

### F-001 - Struts resolves returnto against five Tiles definitions, not four

- Severity: low
- Comparison check IDs: C-002, C-005, C-011, C-013, C-017, C-019
- **Checklist link:** CHK-012 (refined: view names as the bundled framework resolves them) and CHK-003 (list every loader of cited wiring files), both in [`analysis/error-prevention-checklist.md`](../error-prevention-checklist.md#active-checks)
- **Checklist discrepancy:**
  - The BA-001-09 self-check says request-chosen navigation "was resolved through the bundled Spring and Struts Tiles code". The correction record adds that the Tiles plug-in "loads only `tiles-definitions.xml`".
  - The loader search covered only the Struts plug-in. It missed the Spring `TilesConfigurer`, which loads the same file and one more, into the same factory that Struts uses.
  - This fails the refined CHK-012 and repeats a CHK-003 failure (a missed loader of a cited wiring file).
- **Required recheck:**
  - CHK-003 and CHK-012 for every framework registry that a request value is resolved against.
  - List every component that fills the registry, and the start-up order that decides which one the consumer holds.
  - Expected: the complete name set and the reach are recorded.
- Expected and source:
  - `WAR:WEB-INF/classes/spring-web.xml:17-24`: `org.springframework.web.servlet.view.tiles.TilesConfigurer` (from `spring-struts-3.0.5.RELEASE.jar`) with `tiles-definitions.xml` and `tiles-pages.xml`. `#afterPropertiesSet` calls `#createDefinitionsFactory`, then `TilesUtil#createDefinitionsFactory`. `TilesUtilImpl#makeDefinitionsFactoryAccessible` stores the factory under the servlet-context attribute `org.apache.struts.tiles.DEFINITIONS_FACTORY`.
  - `WAR:WEB-INF/web.xml:271` (`SpringServlet`, load-on-startup 1) and `:248` (`XPlannerServlet`, load-on-startup 2). The Spring context therefore starts first.
  - In `struts-1.2.9.jar`, `TilesPlugin#initDefinitionsFactory` finds that attribute and logs "Factory already exists ... No new creation". `TilesRequestProcessor#initDefinitionsMapping` takes its `definitionsFactory` from the same attribute. `DelegatingTilesRequestProcessor` overrides neither method.
  - The definition set is expected to be `tiles:default`, `tiles:view`, `tiles:print`, `tiles:edit` and `viewLayout` (`WAR:WEB-INF/tiles-pages.xml:6`, page `viewLayoutNew.jsp`). `WAR:WEB-INF/jsp/view/meStatus.jsp:10` itself inserts `viewLayout` through `xplanner:content`, and `ContentTag#doStartTag` keeps a caller-given definition. The Source Inventory Tiles row of the reconnaissance already states 5 definitions.
  - A `returnto` of `viewLayout` is therefore also rendered as a layout instead of redirected. This is `Inferred`: container start-up order and runtime are unverified.
  - The list of other in-application navigation also omits `ViewObjectAction#getForwardPath`. It appends the URL-encoded `returnto` to the fixed `display` forward, which is safe but absent from the list.
- Observed difference:
  - The Q3 navigation fact, the reading block and the forwards-09 tool row say "4 Tiles definition names".
  - The Error Prevention self-check and the Return Correction Evidence row for checks (h)-(j) claim complete resolution.
- Evidence: listings in reviewer scratch (`disasm.js`); `navsites.json`; descriptor lines above.
- Requirement impact: Q3 navigation facts (Principle XI); Stage 3 check of a `returnto` equal to a definition name.
- Required action:
  - State the 5 names, the loader chain and the start-up dependency (`Inferred`) in the Q3 fact, the reading block and the tool row.
  - Add `ViewObjectAction` to the list of in-application navigation.
  - Add `viewLayout` to the Stage 3 checks.
- Correction impact:
  - The same mechanism applies to any request value resolved against the shared Tiles factory. My inventory finds only the 13 `returnto` methods.
  - Forward names from `findForward` are constants, apart from the mapping parameter.
  - The Spring view resolver does not consult Tiles: its Tiles resolver is commented out.
- Return stage: 1

<a id="read-f-002-public-page-breadcrumb-loads-a-request-named-object-and-shows-its-names"></a>

### F-002 - Public-page breadcrumb loads a request-named object and shows its names

- Severity: low
- Comparison check IDs: C-007, C-017, C-021
- **Checklist link:** CHK-011 (every public-page text recorded with its exposure) and CHK-012 (request values traced to queries and page output)
- **Checklist discrepancy:**
  - The BA-001-09 self-check says the CHK-011 surfaces are unchanged. Its scope validation says "the only other tag-handler text in the public layout chain is the unreachable back link".
  - Check (j) traced `NavigationBarTag#render` for keys only, not for its request reads and data loads.
  - This is a repeated CHK-011 failure (pass-004 F-005) and a failed refined CHK-012.
- **Required recheck:**
  - CHK-011 and CHK-012 for every tag handler in the layout and include chain of each public page.
  - Record its request reads, its data lookups and what it prints.
  - Expected: each output is recorded with its exposure.
- Expected and source:
  - `WAR:WEB-INF/jsp/layout/defaultLayout.jsp:44` calls `tags:breadcrumb`. `WAR:WEB-INF/tags/breadcrumb.tag:10` passes `type="${objectType}"`, which the JSP EL turns into `""` when the attribute is unset.
  - `NavigationBarTag#doEndTag` reads the request `oid`, or else `fkey`. Because `type` is not null, it calls `#setObject(int)`.
  - That method calls `IdSearchHelper#search`, which runs `Session#get` over Project, Iteration, UserStory, Task, Person and Note with no permission check. The `idSearchHelper` bean is in `spring-dao.xml:61`. `JspAwareRequestContext` falls back to the root context, and `OpenSessionInViewFilter` covers `/*`.
  - `#render` then adds links whose text is the name of the object's project, iteration, story, task or feature (`#createLinkToContent`). `breadcrumb.tag:15,18` writes that text with unescaped EL.
  - `login.jsp` and `unexpectedError.jsp` use this layout, and `/do/login` is in the bypass list (`WAR:WEB-INF/security.xml:3`). So `/do/login?oid=<id>` is expected to show those names to a visitor who has not signed in, including any markup stored in them. This is `Inferred`: the EL coercion and runtime are unverified.
  - A related omission: the figure "45 bundle keys are rendered without a session" leaves out the keys that the login page renders through `html:messages` after a failed login (`login.jsp:50-59`; `login.failed` and the login-module keys). Rows 12-13 record those keys per bundle.
- Observed difference: the Runnable Surfaces unauthenticated list, GAP-007 and rows 8, 56 and 185 do not state the lookup or the names. The public-page bullet presents 45 as the complete set of keys.
- Evidence: listings of `NavigationBarTag`, `IdSearchHelper`, `DatabaseTagSupport`, `RequestContextAwareTag`, `JspAwareRequestContext`, `RequestContextUtils`, `Link`; the JSP and descriptor lines above.
- Requirement impact: CHK-011 unauthenticated exposure; GAP-007 security facts (Principle XI); Stage 3 check of `/do/login?oid=` and of the error page.
- Required action:
  - Record the request-driven breadcrumb lookup and the names it prints on the public pages (`Inferred`) in the unauthenticated list and in GAP-007, with pointers from rows 8, 56 and 185.
  - State the scope of the 45-key figure, or add the failure-message keys with a pointer to rows 12-13.
- Correction impact:
  - The same tag runs on every `tiles:default` page. Only the public ones add exposure.
  - The other public pages (`wap/login.jsp`, `index.jsp`, `calendar-i18n.jsp`) do not use this layout.
- Return stage: 1

<a id="read-f-003-two-new-check-figures-cannot-be-reproduced"></a>

### F-003 - Two new check figures cannot be reproduced

- Severity: low
- Comparison check IDs: C-008, C-009, C-013, C-014
- **Checklist link:** CHK-007 (every count reproducible from its cited output)
- **Checklist discrepancy:** the BA-001-09 self-check claims regenerated figures. The two figures below come from untracked author scratch outputs, and the records do not state how they were counted.
- **Required recheck:** CHK-007 for every figure added in BA-001-09. State what is counted and regenerate it. Expected: an independent recount from the WAR gives the same number.
- Expected and source:
  - The bytecode of the 594 classes has 44 `ActionMapping#findForward` calls in 31 methods: 43 with a constant name and 1 with the mapping parameter (`DispatchForward#execute`). There are also 1 `ModuleConfig#findForwardConfig` call in `LinkTag#hyperlink` and 4 `getInputForward` calls. Pass 007 counted 44 as well.
  - The 103 script contexts reproduce. The number of dynamic outputs depends on the counting rule: 54 in bodies, handlers and URLs plus 31 in `script src` attributes, or 82 under a regex replica of the author's context patterns.
- Observed difference: the forwards-09 row and the correction record state "46 `findForward` calls in 30 methods, 45 with a constant name". The script-sinks-09 row states "77 dynamic outputs". Neither can be reproduced.
- Evidence: `navsites.js`, `scriptctx.js`, `scriptctx.json` (reviewer scratch).
- Requirement impact: figure accuracy only. The conclusions "no request-chosen forward name" and "2 request values in script contexts" reproduce.
- Required action: correct the `findForward` figure, and give the counting rule for the dynamic-output figure or regenerate it under a stated rule.
- Correction impact: the two tool rows and the correction record's inventories. The other figures reproduce (C-025).
- Return stage: 1

<a id="read-automated-and-manual-gates"></a>

## Automated and Manual Gates

| Check | Exact command or procedure | Result | Evidence |
|---|---|---|---|
| Packet integrity | `sha256sum` of `packet.json` | pass: `3401f782...93e3` | access log |
| Pinned hashes | `sha256sum` of the pass-006 and pass-007 reports and evidence, the dispositions, the maintenance record, the records and checklist in the three checkouts; `git show` of [`legacy/`](../../legacy) at BASE, PREV, CAND | pass: all packet pins match; legacy blobs identical (`demo-seed.sql` working copy CRLF) | access log |
| Checkout revision and state | `git rev-parse HEAD`, `git status --short` in WT-B, WT-P, WT-C at start and end | pass: `15cb6b2`, `4c1ada2`, `605f94d`; empty | access log |
| Workbook audit | `npm --prefix analysis/tools run audit:workbook` (main tree, workbook equals CAND; temp redirected) | pass: `WORKBOOK AUDIT OK`, 210 scenarios, 18 epics | access log |
| Link audit | `npm --prefix analysis/tools run audit:artifact-links` before the Markdown evidence was added | pass: 226 documents | access log |
| Project audit | `npm --prefix analysis/tools run audit:project` | pass: `PROJECT CONFIG AUDIT OK` at stage-02 | access log |
| Reading structure | `node analysis/tools/artifact-reading.js --file` on the CAND reconnaissance, the BA-001-09 record and this report | pass: no errors | scratch output |
| Citations (CHK-001) | reviewer `citecheck.js` | pass: 60/60 change set, 572/572 whole scope | `citecheck-*.json` |
| Credential scan (CHK-009) | reviewer `credscan.js` and `credctx.js` | pass: 0 credential values | Reviewer Self-Check |
| Access boundary | packet rule: allowed folders only | fail: one read in the client tool-results folder under the user profile | independence record |
| Live verification | not in Stage 2 scope | not applicable (Stage 3) | none |

<a id="read-blocked-scope"></a>

## Blocked Scope

| ID | Comparison check IDs | Reason | Required prerequisite or exclusion authority | Evidence |
|---|---|---|---|---|
| E-001 | C-016 | Author tool-execution facts (exit codes, scratch outputs) are process records, and the packet forbids using the author scratch as evidence. Every legacy fact they support is checked in its own item (C-013..C-015). | PM packet `S02-P008` boundary | [`packet.json`](evidence/S02-P008/packet.json) |

- Blocker: none for the checks. The attempt as a whole is invalid (access boundary).
- Exact unchecked scope: none
- Required prerequisite: a new fresh eligible correction-validation session
- Reassignment/closure reference: pending (PM)

<a id="read-interaction-log"></a>

## Interaction Log

| Finding | Reviewer evidence | Primary disposition | Correction | Repeat-review result |
|---|---|---|---|---|
| F-001..F-003 (preserved observations) | this report; [`comparison-results.json`](evidence/S02-P008/comparison-results.json) | pending | pending (PM and owner decide the route) | pending (next valid correction-validation pass) |
| pass-007 F-001 (Tiles part) | C-002 | accepted by BA-001-09 | incomplete | carried as F-001 |
| Access-boundary deviation | [`independence-record.md`](evidence/S02-P008/independence-record.md) | disclosed to PM in RESULT | none possible within this attempt | owner decision |

<a id="read-conclusion-and-next-gate"></a>

## Conclusion and Next Gate

- **Checklist issues:**
  - F-001 fails the refined CHK-012 and repeats a CHK-003 failure.
  - F-002 fails CHK-011 (a repeat of the pass-004 F-005 check) and the refined CHK-012.
  - F-003 fails CHK-007.
  - The pass-007 CHK-012 failure stays open through F-001 and F-002. The pass-007 CHK-007 with CHK-004 failure is closed for the public-page figure.
  - CHK-001, CHK-002, CHK-004, CHK-009 and CHK-010 passed where applicable.

The result is **`invalid`**:
- The owner-imposed access boundary was broken once (one read of the client-persisted output of the reviewer's own command, outside the allowed folders). The packet makes that fatal to the pass.
- The substantive review was completed:
  - the chain is eligible;
  - the coverage union is 556 = 66 + 490 + 0, with 0 not-checked items and 0 blockers;
  - 11 checks are mismatches, linked to three low findings;
  - one prior finding (the Tiles part of pass-007 F-001) is not closed.
- Had the attempt been valid, the result would have been `findings`, not `clean`.
- None of the findings is a runtime limitation moved to Stage 3.

This attempt cannot close Stage 2, cannot be retained or skipped in the closure chain, and does not permit Stage 3.

Next action:
- PM presents the boundary deviation to the owner.
- Under the stated rule, PM launches another fresh eligible correction-validation session (pass 009): root baseline pass 006, previous control pass 007, candidate `605f94d` or a later integrated revision.
- That session may read this report as a prior record but must verify F-001..F-003 itself.
- If the owner routes F-001..F-003 to Stage 1 first, the correction follows [Correction Scope And Handoff](README.md#correction-scope-and-handoff).

<a id="read-error-prevention"></a>

## Error Prevention

Follow [the shared procedure](../error-prevention.md). In correction-validation the checklist and prior notes are read immediately. CHK rows do not bound the coverage.

<a id="read-checklist-review"></a>

### Checklist Review

- Checklist revision or SHA-256: `599fbd661a9193a83d4d50cc62afad5d42de388d1bf16ef190a5a44386afcff2` (CHK-001..CHK-012; CHK-007 and CHK-012 refined after pass 007)
- Author self-check record/version: reconnaissance [Error Prevention](../legacy_reconnaissance.md#read-error-prevention) (BA-001-09, checklist `6e01c409...` at the time) and [`stage-02-pass-007-dispositions.md`](../stages/stage-01/stage-02-pass-007-dispositions.md#read-error-prevention)

| Check / applicability | Author self-check / source | Independent result / evidence | Finding / required recheck |
|---|---|---|---|
| CHK-001; new and changed citations | `chk001-ba-001-09.js` | passed: 60/60 with content, 572/572 whole scope (C-023) | none |
| CHK-002; permission statements | no permission condition changed | passed for the changed claims; the new public-page lookup has no permission check (F-002) | F-002 records it |
| CHK-003; loaders and consumers | "the Tiles plug-in's definitions file and the Spring view resolver were confirmed as the consumers" | failed: the Spring `TilesConfigurer` is a second loader of `tiles-definitions.xml` and fills the factory that Struts reuses (C-002) | F-001 |
| CHK-004; per-variant texts | 45 keys compared in 10 bundles | passed (C-004, C-022) | none |
| CHK-005, CHK-006, CHK-008 | inputs unchanged | not applicable to the change set; retained | none |
| CHK-007; figures | public-page figure regenerated | passed for 45 and the workbook figures (C-004, C-025). Failed for two figures of checks (h) and (i) (C-008, C-009) | F-003 |
| CHK-009; credentials | scan, count in RESULT BA-001-09 | passed: 0 values (C-024) | none |
| CHK-010; link parameters | inputs unchanged | passed for the new Cancel-button target (context path first) | none |
| CHK-011; unauthenticated surfaces | "the surfaces are unchanged; only the text figure changed" | failed: the breadcrumb on the login and error pages performs a request-driven lookup and prints names (C-021) | F-002 |
| CHK-012; request values to sinks | checks (h), (i) | passed for Spring prefixes and script contexts (C-001, C-006). Failed for the Tiles definition set (C-002, C-005) and the public-page lookup (C-007) | F-001, F-002 |

<a id="read-reviewer-self-check-and-learning"></a>

### Reviewer Self-Check And Learning

- **Self-check:** Stage 2 pass 008, correction-validation; the result version is this report and the evidence hashed in RESULT; checklist `599fbd66...cff2`.
  - **CHK-001:** every line cited here comes from a per-file numbered read of the extracted WAR or the checkouts, or from a disassembler listing cited by symbol.
  - **CHK-009:** passed, 0 credential values in the new evidence and this report. The scan used the source values (property, XML, compose and seed assignments) and the factory login-pair form, with positive controls on the source files. Plain-word matches were classified in context with the values masked: product, package and role names, and the word "password" in prose.
  - **CHK-007 and CHK-012:** applied to my own figures and sink claims. Every figure in this report is produced by a named reviewer script.
  - **Boundary:** my own access failed once, as recorded above. A read of a client-persisted output is still a read outside the boundary. It should have been avoided by regenerating the output inside the scratch.
- **Learning update (proposals for the coordinator; the reviewer does not edit the table):**
  - **P-1 (refine CHK-003, from F-001; repeated failure):** when a request value or view name is resolved against a framework registry, search every descriptor and bean definition for the registry's source files. Identify every component that writes the shared registry (for example a servlet-context attribute), and the start-up order that decides which instance the consumer holds. Expected: the complete resolved set is recorded. Why the check failed: the loader search stopped at the Struts plug-in and did not search the Spring bean files for the same file name.
  - **P-2 (refine CHK-011, with CHK-012, from F-002; repeated failure):** for each public page, trace every tag handler in the layout and include chain for its request reads and data lookups, not only its texts. Expected: every request-driven lookup or output on a public page is recorded with its exposure.
  - **P-3 (refine CHK-007, from F-003):** state the counting rule next to each figure, so that it can be regenerated without the author's untracked scratch output.
  - **Scope question, not a CHK proposal:** CHK-012 covers request-derived values. Stored values printed through unescaped EL (for example breadcrumb names) are not covered by any check or record. PM and the owner decide whether Stage 1 must inventory them.
  - **Process note for PM:** oversized command output that the client persists outside the project should be regenerated inside the reviewer scratch, never opened at its persisted location. Consider adding this to the packet boundary text.

<a id="read-dependency-review"></a>

## Dependency Review

Not applicable: Stage 2 does not review the feature dependency graph (required only at Stages 10 and 16).

| Node | Scope SHA-256 | Compared sources | Result | Findings or unchecked scope |
|---|---|---|---|---|
| not applicable | not applicable | not applicable | not applicable | Stage 2 |

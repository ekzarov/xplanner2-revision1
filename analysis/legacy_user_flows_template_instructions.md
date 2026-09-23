# Legacy User Flows Workbook Instructions

**Reading technical statuses.** `Passed` (the epic meets the workbook aggregate conditions), `Not Passed - Open` (required work remains), and `Not Passed - Deferred` (explicitly postponed work remains) are summary states, not individual test results. Keep these cell values and formulas unchanged; explain them in the existing meaning/notes fields and these instructions. [Status meanings](artifact-status-meanings.md).

<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_START -->
<a id="read-artifact-use-in-practice"></a>
## Artifact Use In Practice

Open an artifact below for its purpose, author, governing instructions and example. Structured JSON may carry a schema-approved help field such as _schema_help; for spreadsheets, Draw.io, exports and immutable records, this guide is the companion explanation.

<details>
<summary>legacy_user_flows.xlsx</summary>



The central behavior checklist for the migration, with one observable legacy scenario per row. Each row links its source evidence to the keep/change/defer decision, prototype and SDD coverage, implementation proof and final acceptance status.

- **Created by:** The initializer creates the workbook; the Stage 1 reconnaissance agent populates evidence-backed behavior rows.
- **Maintained / decided by:** The active-stage agent updates its owned columns; the human owner decides scope changes and deferrals.
- **Instructions:** Bootstrap and Stage 1-19 workbook instructions

**When used:** Created empty at Bootstrap, populated at Stage 1 and updated through acceptance. Each observable behavior keeps its decision and evidence chain in one row.

**Example:** A failed-login row links legacy evidence to its keep decision, wireframe state, SDD requirement, automated test and live result.

**Project file:** [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx)

</details>
<!-- PRACTICAL_DOMAIN_ARTIFACT_GUIDE_END -->

Start with [`../MIGRATION.md`](../MIGRATION.md). This document governs workbook
mechanics within the stages defined by
[`migration_methodology.md`](migration_methodology.md); it does not define a
second migration lifecycle.

Use [`legacy_user_flows_template.xlsx`](legacy_user_flows_template.xlsx) only
to start a parity map for a new project. Project work continues in the governed
copy [`legacy_user_flows.xlsx`](legacy_user_flows.xlsx), which the initializer
creates from the template. Never overwrite the filled map with the empty
template.

This workbook is not an implementation task list. It is an evidence and parity
matrix. Agents must not start coding from this workbook alone. Implementation
starts only after the owner approves the relevant SDD/spec/plan/tasks.

## Constitution first (MUST — read before any action)

Before doing **anything** in this project — any workflow step, any flow, any
spec/plan/task, any code or workbook edit — the agent MUST first read and comply
with the project constitution at **[`.specify/memory/constitution.md`](../.specify/memory/constitution.md)**. The
constitution is authoritative and overrides convenience or local conventions; it
applies to every action from the very start, not just at implementation time.

- Treat its principles as hard constraints (e.g. no database mutation or
  seeding at startup, branch-first with `main` stable, evidence before
  replacement, automated tests, security hardening, and documented
  deviations).
- If a requested action would conflict with the constitution, do not silently
  proceed: either revise the approach to comply, or surface the conflict and
  propose a constitution amendment (with rationale) for the owner to ratify.
- If the constitution file is missing or unratified, flag that and get it
  ratified before treating specs/plans/tasks as final.

## Workbook Lifecycle Within the Methodology

The numbered operations below are workbook operations, not methodology stage
numbers. The active methodology stage and next action come only from
[`migration_status.yaml`](migration_status.yaml).

1. **Collect legacy evidence from code first**
   - Inspect only the legacy source, deployable descriptors, configuration,
     database scripts, UI pages, request handlers, services, jobs, messaging
     handlers, reports, and tests.
   - Record concrete file/class/page evidence in the workbook.
   - Prefer behavior that is visible to a user, operator, or external system.
   - Do not invent business requirements from names alone. If behavior is
     inferred, mark it as inferred in the notes/evidence.

2. **Re-analyze the completed workbook (mandatory once the sheet looks done)**
   - Treat the first evidence pass as a draft, not the finished product. Once
     the workbook is built, run a second, adversarial completeness audit: for
     each area, diff the captured rows against the legacy code and list
     user-visible behaviors still missing (whole new flows OR extra scenarios of
     an existing flow), then add the gaps you find. Real systems hide secondary
     flows (e.g. API/Basic-auth, mobile/WAP screens, file managers, admin/job
     endpoints, export variants) that a first pass misses.
   - Confirm grouping: each logical flow is exactly one collapsible group, and
     flows of the same feature live under one epic (no duplicate same-named
     banners, no flow split across IDs).
   - Confirm ordering: epics are ordered top-to-bottom in the intended
     implementation/dependency order — entry capabilities first (people, roles,
     authentication, access control, platform/admin), then core domain, then
     supporting features, then interop last (import/export, external APIs,
     mobile) — so the sheet reads as the build order.
   - Do not consider the evidence step finished until this re-analysis surfaces
     no new gaps and the grouping/order checks pass.
   - During this initial code-only discovery stage, leave destination and SDD
     columns I:N blank and keep every detail row red. Revision-sheet coverage
     becomes mandatory once target/SDD lifecycle tracking starts; forcing a
     revision worklist before any target or SDD exists only duplicates the map.

3. **Write or update SDD before implementation**
   - Convert the discovered user-visible behavior into feature specs,
     clarifications, plans, and tasks.
   - Mark whether each workbook row is covered, deferred, or missed by SDD.
   - Coverage is outcome-level, not page-level. When one row lists several
     observable actions, every action needs an SDD requirement and planned
     verification; a shell, route, heading, or navigation link does not cover
     the bundled business outcomes.
   - Keep a target-surface inventory of all proposed routes, menu items, roles,
     screens, API operations, and jobs. Every visible surface needs a concrete
     useful action or observable contract. A target-only role requires an
     explicit owner-approved requirement and must not be inferred from a
     similarly named legacy page. Acceptance-test titles bind evidence to the
     exact destination and role with `@surface:<id>` and `@role:<role>`;
     reviewers still execute the action because tags alone do not prove it.
   - Do not implement code until the owner explicitly approves the next
     implementation step.

3a. **SDD sync after ANY code change (MUST)**
   - Whenever target code changes — feature work, a gap fix, a revision
     closure, a refactor that alters user-visible behavior — bring the
     affected `specs/NNN-*` artifacts (spec / plan / tasks) in line **in the
     same PR**. This holds regardless of whether the change came from a
     revision sheet or anywhere else.
   - Concretely: new/changed behavior gets its FR added or amended in the
     spec; an approved deviation gets a written deviation note; delivered
     tasks get ticked `[x]` in tasks.md; the workbook SDD columns (Covered /
     Deferred / evidence, L–N) are updated to match.
   - A code-only PR that leaves SDD stale is incomplete: the workbook, the
     specs and the code must never disagree (constitution Principle VI,
     Artifact Lockstep).
   - Maintain the exact `Parity Map Delivery Contracts` table in
     `specs/traceability.md`. Every numbered feature is `legacy-backed` with
     concrete delivered/deferred workbook row numbers, or `target-only` with
     an owner-decision reference. Narrative labels are not an auditable row
     contract.
   - `audit:sdd:complete` is fail-closed: delivered rows require Destination
     implemented = Yes, Covered in SDD = Yes, no deferred flag, and non-empty
     destination notes, code evidence, and SDD evidence. Deferred rows require
     an explicit deferred flag and SDD evidence.
   - Stage 17 closes implementation tasks and records the exact committed
     candidate, tests and independent review. Workbook delivery fields remain
     truthful about the pre-deployment state. Exactly identified deployment
     and reconciliation tasks may remain open in `tasks.md`; implementation
     tasks may not. Stage 18 records the deployed revision and live evidence,
     then closes those delivery tasks and reconciles the workbook in a
     records-only descendant. Only then does `audit:sdd:complete` prove delivered
     and deferred rows. Contradictory live evidence returns to Stage 17.

4. **Implement only after owner approval**
   - Work from approved SDD artifacts, not directly from the workbook.
   - Starting at methodology Stage 15, select one approved feature or a small,
     tightly related group as the delivery slice. Keep changes scoped to it;
     never implement the whole approved backlog in one batch.
   - Add tests required by the project constitution and the feature plan.
   - Data model or reference-data changes use the versioned, explicitly invoked
     mechanism approved by the feature plan and constitution. Normal application
     startup must not create, migrate, seed, or repair storage.

5. **Verify target parity after implementation**
   - Take every delivery slice through build, deploy, live revision, and
     independent slice acceptance before selecting the next slice. Findings
     return to SDD and the same slice repeats the loop.
   - Revisit the workbook after the new code exists.
   - Fill destination columns with implemented status, notes, and code evidence.
   - Use the workbook to identify gaps between legacy behavior, SDD, and the
     target implementation.
   - The Stage 18 delivery record pins the current workbook SHA-256 and repeats
     the exact closure rows (or target-only owner decision). Editing the map
     later invalidates that record until the affected slice is rechecked.
   - If the deployed journey contradicts the Stage 17 target evidence or planned
     disposition, return the slice to Stage 17 and correct the same rows; do not
     turn them green or silently rewrite immutable delivery evidence.
   - For every role, open every visible target destination and complete its
     useful action. Login success, `200 OK`, route access, and the expected
     heading prove reachability only; they do not prove implementation.
   - Visible placeholder text or generic empty workspaces are red gaps. A
     deferred surface must be owner-approved, documented, and hidden from
     production navigation.

6. **Reconcile SDD ↔ workbook and plan the next gaps (end of each milestone, and before "done")**
   - Sweep every `specs/NNN-*/tasks.md` and list the tasks still unchecked
     (`[ ]`). For each, decide: already delivered (so it should be ticked + its
     workbook row greened) or genuinely pending.
   - Keep tasks.md and the workbook in lockstep (constitution Principle VI,
     Artifact Lockstep):
     every delivered+tested flow is green / `[x]`; every red or orange row maps
     to an open, unchecked task or an explicitly approved permanent deviation —
     no half-states where one says done and the other doesn't.
   - **Epic roll-up colour:** make the whole epic/flow summary row green
     (all columns A–N, for example UF-001) **only when every child scenario is green in
     both the Destination block (Destination implemented? = Yes) and the SDD block
     (Covered in SDD? = Yes and Deferred in SDD? = No)** — i.e. nothing inside is
     missed, deferred, or unimplemented. If any child is red, the epic row is
     red; otherwise, if at least one child is orange, the epic row is orange.
   - **Epic completion percentage:** append ` (N%)` to every visible epic name
     in column B, beside the collapsed `+`/expanded `-` hierarchy control.
     Calculate it as fully done child rows divided by all child rows, rounded
     to the nearest whole percent. A child is done only when Destination
     implemented = Yes, Covered in SDD = Yes, and Deferred in SDD is not Yes;
     deferred rows stay in the denominator and do not count as completed.
     Run `npm --prefix analysis/tools run sync:workbook-progress` after every
     parity-map status edit. `audit:workbook` rejects a missing or stale label.
   - **Overall progress indicator:** keep the single merged cell `A3:N3` at the
     top of `User Flows`. It shows the audited count and percentage of fully
     done scenario rows across the whole map. Its left-to-right background bar
     uses red below 35%, amber from 35% to below 75%, and green from 75%.
     `sync:workbook-progress` recalculates the text and bar; `audit:workbook`
     rejects a missing, split, or stale indicator. Do not type this value by hand.
   - **Done rows go fully green (D–N).** Whenever a child scenario reaches
     done (Destination implemented + SDD covered, not deferred), green its
     whole data range D–N — including the source/requirement cells — so a
     completed flow has no leftover orange cells. Only the fill changes; the
     values stay. (See the detail-row colour rule under Workbook Structure.)
   - **Deferred rows go orange; other open rows go red (D–N).** The moment a
     scenario is explicitly deferred, set its D–N fill to orange. If it is
     simply not implemented or not classified, set D–N to red. A green fill
     with an empty `Destination implemented?` cell is forbidden: colour must
     always equal status, so scanning the sheet by colour alone tells the
     truth. Whenever `Destination implemented?` is cleared or a row is
     re-opened, re-orange it in the same edit.
   - **Three-state model (colour must be derivable from the cells).**
     | State | Destination implemented? (I) | Deferred in SDD? (M) | Fill D–N |
     |---|---|---|---|
     | Done | Yes | No | green |
     | Deferred by decision | empty | **Yes** + reason in Destination notes | orange |
     | Not done / unclassified | empty | No | **red** |
     An orange row without `Deferred in SDD? = Yes` and a written reason is
     forbidden — that is what makes deferral distinguishable from a forgotten
     row. Red rows are the actionable work list: either implement them or get
     an explicit deferral decision (then flip them orange with the reason).
   - **Revision-sheet completeness.** The final worklist sheet (the highest
     numbered `Rev N`) must reference EVERY open row (`Destination
     implemented?` is not `Yes`) via its main-sheet reference column. A
     deferral that lives only on the main sheet is invisible in the closure
     workflow.
   - **Audit before commit (MUST).** After any workbook edit run
     `node analysis/tools/workbook-audit.js` (see [`analysis/tools/README.md`](./tools/README.md))
     and commit only on `WORKBOOK AUDIT OK`. It enforces colour=status, epic roll-ups,
     revision completeness, Rev-sheet closure columns, the
     `Source implemented?` vocabulary, visible epic banners, and the stored
     `<sheetPr>` element order.
   - **Render after every workbook edit (MUST).** After finalization and audit,
     render `User Flows` and every `Rev N` sheet and inspect them at normal zoom.
     Confirm that epic banners use the canonical typography, status fills are
     uniform across D:N and A:N, revision-row fills are uniform, detail groups
     open collapsed, headers remain intact, and no text is clipped or style is
     visibly corrupted. A passing data audit without this visual pass is not a
     complete workbook check.
   - **Open in Excel Desktop without recovery (MUST).** On the final file run
     `npm --prefix analysis/tools run audit:workbook:excel`. A recovery prompt,
     removed-record notice, or failed COM open blocks delivery even when the
     renderer and `audit:workbook` pass. If Excel Desktop is unavailable, record
     the check as blocked and obtain the same clean-open evidence from the owner
     or an independent Windows reviewer before delivery.
   - **Preserve the Excel hierarchy controls (MUST).** Epic banner rows stay
     visible, every scenario row is collapsed at outline level 1, and Excel
     displays the `+ / -` controls for expanding and collapsing each epic.
     Plainly hiding rows without outline metadata is a failing workbook, not an
     equivalent collapsed view.
   - **Mutation-script safety.** Scripts that edit the workbook must use the
     helpers in [`analysis/tools/lib.js`](./tools/lib.js): change fills only via the
     style-cloning `setFill` (ExcelJS shares style objects — direct `.fill`
     assignment repaints unrelated cells), and snapshot values AND fills of
     all sheets before mutating, asserting afterwards that only the intended
     cells changed.
   - **Save through `writeWorkbookFile` (MUST).** Persist the workbook with
     `writeWorkbookFile(workbook, file)` from
     [`analysis/tools/xlsx-package.js`](tools/xlsx-package.js), never with
     `workbook.xlsx.writeFile` directly. The pinned library emits the worksheet
     `<sheetPr>` children as `pageSetUpPr` before `outlinePr`, violating the
     ECMA-376 `CT_SheetPr` sequence; Excel then refuses to open the file even
     though the library reads it back happily. This workbook requires both
     outline grouping and fit-to-page, so every raw write triggers it.
     `audit:workbook` inspects the stored parts and fails closed on the wrong
     order.
   - **Finalize external spreadsheet exports (MUST).** If an editor such as
     `@oai/artifact-tool` writes the workbook, restore worksheet print settings
     and governed row grouping from the pre-edit workbook with
     `copyWorksheetPrintSettings(...)` and
     `copyWorksheetOutlineSettings(...)`, then run
     `normalizeWorkbookFile(...)` before `audit:workbook`. This prevents Excel
     repair prompts and preserves both the print layout and the `+ / -` epic
     hierarchy. The outline copy must restore worksheet-level
     `summaryBelow = false` as well as row levels, so expanding a group keeps
     its visible epic/root banner above the revealed scenarios. The source and
     destination passed to `copyWorksheetOutlineSettings(...)` MUST have the
     same populated row layout; never copy row positions from the blank
     template into a populated map. If row counts or positions may differ,
     load the populated workbook, call
     `reconcileWorksheetOutlineHierarchy(workbook)`, and save through
     `writeWorkbookFile(...)` instead.
   - For the remaining unchecked tasks / red or orange rows, **re-run the analysis**
     (workbook rows + legacy evidence + the feature spec) to understand what each
     leftover actually requires and whether a dependency now exists, then turn
     those into the next small delivery slice.
   - Repeat until no unchecked task remains without a clear reason (deferred /
     N/A with rationale), so nothing silently stays half-implemented.

## Revision sheets (why they exist and how they work)

The main sheet is the **parity map**: what legacy does and its status in the
target. Revision sheets are **quality passes over that map plus the closure
worklist**. They catch over-claimed implementation, details lost between
features, stale evidence, and rows that were never classified, then turn those
findings into closable items.

**Lifecycle — exactly two kinds of sheets:**

1. **Audit revision (e.g. «Rev 2»)** — a verification pass with an independent
   source of truth (walking the legacy AND target UI page by page, comparing
   against the map). Every discrepancy becomes a row: Before / After / Type.
   When all its rows are closed the sheet is a historical record — do not
   reopen it; run a NEW audit revision next time.
2. **Final revision (the last «Rev N»)** — THE single consolidated worklist.
   It must reference **every** open row of the main sheet (gaps, pending
   decisions, deferrals) — nothing open may live only on the main sheet.
   The audit tool enforces this (invariant C). New findings from any later
   audit pass get consolidated here after their own sheet closes.

**Canonical revision columns:**

| Column | Content |
|---|---|
| A | Stable finding ID |
| B | Related flow or feature |
| C | Main-sheet scenario row reference(s) |
| D | Finding type |
| E | Legacy/map state |
| F | Target decision or required outcome |
| G | Covered in SDD? |
| H | Implemented? |
| I | Evidence / comment |

**Finding types — exactly three (use only these):**

| Type | Meaning | Closes by | Fill |
|---|---|---|---|
| gap | confirmed: claimed/expected but absent in the target | code fix | red |
| decision | differs from legacy with a recommendation not to port | owner approves the deviation OR orders the work | gray |
| deferred | consciously postponed; reason/dependency recorded | implement when unblocked, or owner approves a permanent deviation | orange |

**Unverified = not done (MUST).** A suspicion («verify») is a working state in
the session, never a committed type: check it before the revision sheet is
committed — it then either becomes a red gap or closes with evidence. If for
any reason it could not be checked, commit it as a **red gap** — we assume a
thing is broken until verified working, never the other way around. The audit
tool rejects any row typed outside the three canonical types (invariant E).
A gap row must state its **provenance** in Comment: `Confirmed: <how it was
observed>` for an observed failure, or `Unverified: <required preparation,
role, configuration, or data>` for a precautionary red committed
under the unverified rule. Closing an unverified gap starts with performing
that check.

«Deviation» is an **outcome**, not a type: a decision/deferred row closed as
«accepted deviation» goes green with the approval noted in Comment, and the
main-sheet row gets a Deviation: note in Destination notes.

**Propagation rules (MUST):**

- **The main sheet changes in the same edit as the finding.** A revision row is
  never the only record: recolor the referenced main-sheet rows (red/orange per
  the three-state model), set/clear Deferred-in-SDD (M) and the notes there too.
- **SDD follows the findings.** Closing a finding updates the affected feature
  spec/plan/tasks: a fixed gap gets its FR/task reflected as done; an approved
  deviation gets documented in the spec (deviation note) — and the main-sheet
  SDD columns (L/M/N) are updated to match. The workbook must never say one
  thing and specs/NNN another.
- Closing a finding = green row on the revision sheet (Implemented?/SDD? = Yes,
  evidence) **plus** the matching main-sheet rows greened/annotated in the same
  change set.

## Workbook Structure

The blank workbook ships with one sheet: `User Flows`. Governed project work
adds `Rev N` sheets as the revision lifecycle requires.

Rows 1-4 are title, notes, and color legend. Rows 5-6 are section headers and
column headers. Data entry starts at row 7.

Keep one row per atomic functional step. A broad use case can span multiple
rows, but each row should describe one checkable behavior.

### Row layout, grouping, and color

Use a three-level hierarchy — **Epic → Flow → Scenario** — laid out so that
expanding one epic reveals its whole picture at once. There are two physical
row types and a single Excel outline level:

- **Epic banner row** (outline level 0, one per epic): an epic is a coarse
  feature area that groups related flows (e.g. `Authentication & Login` groups
  valid/invalid login, remember-me, logout, login modules). Fill `Use Case ID`
  (A) with the epic id (`UF-001`...), the **epic name plus calculated completion
  percentage** in `Use Case` (B, for example `Authentication & Login (42%)`), the
  epic **status** in the `Scenario` column (C: `Passed`, `Not Passed - Open`,
  or `Not Passed - Deferred`), and a short meaning of that status in
  column D. Leave the other columns blank. Color the whole banner row by status:
     red `FFFFC7CE` (Open), orange `FFFCE4D6` (Deferred), green
  `FFE2F0D9` (Passed).
- **Detail rows** (outline level 1) — one per atomic, checkable behavior, listed
  directly under their epic so a single expand shows every flow and scenario:
  - `Use Case ID` (A) stays blank.
  - `Use Case` (B) holds the **flow name** (the lower-level use case, e.g.
    `Login with invalid credentials`). Write it once on the flow's first
    scenario row and leave B blank on that flow's remaining scenario rows, so
    each flow reads as a sub-block. Bold the flow name on its first row.
  - `Scenario` (C) holds `Happy path` / `Alternative path` / `Operational path`.
    Order the rows within each flow Happy → Alternative → Operational.
  - D–H carry requirement/description/expected/source; I–N stay blank until
    target/SDD review.
  - A, B and the Scenario cell sit on a light spine (`FFF8FAFC`); the data
    cells (D–N) take a status color. Initially the whole D–N range is the
    epic's status color (orange/red). As review progresses, the Destination
    block (I–K) and SDD block (L–N) are recolored per their own status.
  - **A fully-done scenario row is green across its entire data range D–N**
    (requirement/description/expected + source + destination + SDD), not just
    the I–K/L–N blocks — when it is implemented in the target (`Destination
    implemented? = Yes`) **and** covered in SDD (`Covered in SDD? = Yes`,
    `Deferred in SDD? = No`). Don't leave the source/requirement cells (D–H)
    orange under a done row; that reads as "half done" and is misleading. The
    cell *values* (e.g. `Source implemented?`) are unchanged — only the fill
    follows the row's done status. A/B/C stay on the light spine regardless.
- Use Excel **row outline grouping** so each epic collapses/expands on its own:
  detail rows at outline level 1, banner at level 0, with `summaryBelow = false`
  so the banner (the `+`/`-` control) sits **above** its detail rows. Open the
  workbook with every group collapsed (only the epic banners visible).

Never scatter the same flow across the sheet or across multiple IDs; all
scenarios of a flow are contiguous, and all flows of an epic sit in that epic's
one collapsible block. Until an epic has been reviewed against the target/SDD,
set its status to `Not Passed - Open` (red). After SDD is complete, red means
the source behavior is evidenced and SDD-covered but destination implementation
is still open; it does not mean that the requirement was missed. Turn banners
orange/green as approved deferrals or implementations land and remove red as
items are completed.

### Cell formatting (reproduce exactly)

Keep title/notes/legend/section/column-header rows (1–6) exactly as the template
ships them. For the data area (row 7 down), apply these styles so every agent
produces the same look:

- **Font:** preserve the template font. `Carlito` is preferred when available;
  use a metrically compatible fallback such as `Arial` when the environment
  cannot install it, without changing row heights or print layout.
  - Epic banner cells: **bold, size 11**. Font color `FF7F0000` (dark red) on a
    red/Open banner; use `FF1F2937` (dark slate) on orange/green/neutral
    banners.
  - Flow-name cell (column B, first scenario row of a flow): **bold, size 10**,
    color `FF000000`.
  - All other detail cells: regular, **size 10**, color `FF000000`.
- **Fills (solid):**
  - Whole banner row (A–N) = the status color: red `FFFFC7CE`, orange
    `FFFCE4D6`, green `FFE2F0D9`, or neutral white `FFFFFFFF`.
  - Detail rows: columns A, B and the `Scenario` cell (C) use the light spine
    `FFF8FAFC`; columns D–N use the epic's status color.
- **Borders:** thin `FFE7C8BD` on all four sides of every data cell.
- **Alignment:** `wrap_text = true`, vertical `top`; horizontal may be omitted
  so Excel uses its default left alignment for text, or explicitly set to
  `left`. Other horizontal alignments are not allowed.
- **Row height:** leave detail rows automatic so wrapped text is not clipped.
  Set the legend row to 54 points, epic banners to 40 points, and repeating
  revision headers to 40 points so collapsed/printed views remain readable.
- **Outline:** banner rows `outlineLevel 0`, detail rows `outlineLevel 1`,
  `summaryBelow = false`; ship with detail rows hidden / banners collapsed.

## Columns

### Source / Legacy Code

`Use Case ID`
: Stable identifier for the **epic**, for example `UF-001`. One ID per epic;
it appears only on the epic banner row and is blank on the detail rows. Do NOT
mint a new ID per flow or per scenario.

`Use Case`
: Dual purpose by row type. On an **epic banner** it holds the epic name
(e.g. `Authentication & Login`). On a **detail row** it holds the **flow** name
— the lower-level use case (e.g. `Login with invalid credentials`) — written
once on the flow's first scenario row and left blank on the flow's remaining
rows. Group every scenario of a flow contiguously, and every flow of an epic
inside that epic's block.

`Scenario`
: Row classification inside the use case. Use this fixed vocabulary on the
detail rows (do NOT invent finer-grained labels):
  - `Happy path` — the primary successful flow a user/system follows.
  - `Alternative path` — any non-primary branch: input validation, authorization
    checks, error handling, and edge cases all go here (do not split them into
    separate `Validation`/`Authorization`/`Error handling`/`Edge case` labels).
  - `Operational path` — operator/admin/background behavior (scheduled jobs,
    notifications, cache/admin operations, batch flows).
: On a use-case **banner row** (see Workbook Structure) the Scenario column
instead holds the use-case status: `Passed`, `Not Passed - Open`, or
`Not Passed - Deferred`.

`Functional requirement / step`
: A precise, testable behavior. Write it as a requirement, not as code.
Example: `Returning customer can sign in with valid credentials.`

`Business-readable description`
: Plain-language explanation of why the behavior exists and what it means for
the business/user flow.

`Expected user-visible result`
: What a user, admin, supplier, operator, or external caller can observe.
Examples: page shown, status changed, validation message displayed, order
queued, inventory updated, report refreshed.

`Source implemented?`
: Whether the legacy code implements this behavior. Use `Yes`, `No`,
`Partial`, or `Inferred`.

`Source code evidence`
: Concrete references to legacy evidence. Include file names, classes, pages,
routes, descriptors, database tables, queues/topics, or config keys. Use enough
detail that another agent can find the evidence without chat history.

`Runtime evidence label`
: When Stage 3 affects the row, append one controlled label to the source
evidence: `Runtime: live-observed`, `Runtime: simulated`,
`Runtime: static-only`, or `Runtime: waived`. A simulated label also cites the
mock/emulator fixture and the legacy code, contract, trace, or owner decision
from which it was derived. Simulated, static-only, and waived evidence must not
be described as real legacy verification; runtime-dependent uncertainty remains
`Inferred`, `Partial`, or explicitly unverified.

### Destination / Target Implementation

`Destination implemented?`
: Whether the migrated/target system implements this behavior. Use `Yes`,
`No`, `Partial`, or `N/A`.

`Destination notes`
: Short explanation of the implementation state, intentional behavior changes,
known gaps, or test observations.

`Destination code evidence`
: Concrete target references: controller/component/service/test file names,
routes, migrations, database tables, UI paths, or test names.

### SDD Coverage

`Covered in SDD?`
: Whether the behavior is covered by an SDD artifact. Use `Yes`, `No`,
`Partial`, or `N/A`.

`Deferred in SDD?`
: Whether SDD explicitly defers the behavior. Use `Yes` only when a spec/plan
clearly marks it as out of scope, future work, or an intentional decision.

`SDD evidence`
: Reference the spec/plan/tasks file and, when useful, the requirement,
decision, user story, or task ID.

## Color Legend

Use row coloring to make review fast.

`Green`
: Fully covered. Legacy behavior exists, SDD covers it, target implementation
exists, and no unresolved parity gap remains.

`Red`
: Open. During code-only discovery every populated detail row is red. Later it
means the target is not complete and the row has no approved deferral. Red is
the actionable work list.

`Orange`
: Deferred by explicit decision. `Deferred in SDD?` is `Yes`, and the reason is
written in the destination/SDD evidence. Partial, merely planned, blocked, or
unclassified work remains red until completed or explicitly deferred.

`White`
: Neutral formatting for headers, instructions, separators, and unused template
space. A populated detail row must not use white as a lifecycle state.

## Quality Rules

- Do not claim `Yes` without concrete evidence.
- Do not claim `Yes` for a bundled row until every observable outcome in the
  row has target code and test evidence, or is split/deferred explicitly.
- Do not treat documentation as source truth when code contradicts it.
- **Read the enclosing context before citing a line as live.** A search hit
  proves the text exists, not that it executes. Before citing a line of markup,
  configuration or code, read enough of the surrounding lines to confirm it is
  not inside a comment block, a disabled branch, an unreferenced file, or a
  section that ships commented out. This applies with equal force when writing
  a *correction*: a row rewritten from a review finding must be verified against
  the artifact, not against the finding text, because a correction round can
  introduce a defect just as a first pass can.
- **Sweep the root cause, not the reported instance.** When a finding turns out
  to have a cause that could affect other rows — an evidence source that is not
  actually loaded, a class that is not actually mapped, a naming pattern that
  misleads — search every row sharing that cause and re-verify each before
  closing the finding. Fixing only the row that was reported leaves the same
  defect in place elsewhere and guarantees another round. Record in the
  disposition which rows the sweep covered and which it cleared, so a later
  pass neither repeats the sweep nor assumes it happened.
- **A shipped configuration value beats an assumption about the default.** When
  a row's claim depends on whether an option is enabled, open the file that is
  actually loaded and read the effective value, including whether an override
  file changes it. "Off by default" is a statement about the artifact, not
  about the software in general, and it must be evidenced like any other.
- **Then confirm the consumer receives it.** A setting present in a loaded file
  still proves nothing until you find the component that reads it and check
  that the value reaches that component. Wiring that was commented out, a bean
  configured without the property block, a file no loader is pointed at, or a
  key no code references all produce configuration that looks authoritative and
  does nothing. State the consumer in the evidence, not just the setting.
- **Enumerate the category; never count from recollection.** Most gaps found
  late are not a carrier missed inside a category, but a whole category nobody
  listed exhaustively — one element type in a deployment descriptor, one kind of
  descriptor, one directory the scope statement forgot to name. Before writing
  any figure or any "every X is covered" claim, generate the list mechanically
  from the artifact and count what you generated. A figure produced by memory,
  by reading a previous document, or by counting what happened to come up during
  analysis is not evidence, whatever its provenance in the chat. When a review
  finds one missing member of a category, the correction is to enumerate the
  entire category, not to add the member reported.
- **Cite derived artifacts by symbol, never by line number.** A line number in a
  decompiled, generated, formatted or extracted file is a property of the
  derivation, not of the shipped artifact: another tool, version or flag set
  renumbers the same code, and a reviewer who re-derives it reads something
  else at that number. Cite the class, method, field or element instead. Line
  numbers in *shipped* files — descriptors, templates, configuration, scripts —
  are stable and should be used.
- **A pattern that found nothing has proved nothing until it has found
  something.** Enumerating mechanically creates its own failure mode: a search
  whose expression cannot match the real text reports absence, and absence reads
  as a result. Before recording any negative — "no such element", "no consumer",
  "nothing references it" — run the same expression against a case you know is
  present, and say in the evidence that you did. An element carrying an
  attribute, a tag split across lines, a different quoting style or an encoding
  difference will each defeat a pattern written from the shape you expected.
  Prefer a real parser to a regular expression whenever the artifact has one.
- Prefer small rows over giant bundled requirements.
- Preserve legacy vocabulary where it matters, but explain it in modern
business language.
- If the legacy behavior is unclear, write `Inferred` or `Partial` and explain
  the uncertainty.
- If a live legacy walkthrough is unavailable, record the owner's Stage 3
  `simulate` or `waive` decision and use the runtime evidence labels above.
  Mocks may support design and tests but do not close a real-runtime
  verification gap.
- If SDD intentionally changes behavior, mark the destination as implemented
only when the target implements the approved SDD behavior, and document the
legacy difference in notes.
- If a row is red, do not fix it directly in code. First create or update SDD
and ask the owner for approval.

## Review Checklist

Before handing the workbook back:

- Every legacy behavior row has source evidence.
- Every destination `Yes` or `Partial` has target evidence.
- Every shipped route and role-visible destination has a useful action in the
  target-surface inventory and automated evidence beyond a heading/status
  assertion.
- No visible target destination contains placeholder or future-slice text.
- Every `Deferred in SDD? = Yes` has SDD evidence.
- Red rows are actionable and not vague.
- Orange rows contain an explicit deferral and its reason.
- Every sheet was rendered after the final edit and visually checked for stable
  colours, typography, grouping, headers, and clipping.
- Every visible epic name includes the audited completion percentage, and it
  equals completed child rows divided by all child rows.
- The workbook can be understood without reading the chat history.

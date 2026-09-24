# Stage 2 Pass 002 Dispositions

**How was each Stage 2 pass 002 finding checked against the legacy source, and what changed in the Stage 1 records?**

[//]: # (ARTIFACT_USE_START)
<details>
<summary><strong>Artifact guidance (not project evidence)</strong></summary>

> Reusable guidance for this correction record. It explains how to use the record; it is not part of the result recorded below.

- **Created by:** The Stage 1 primary agent (Business Analyst, role `ba`, mode `author`) creates this correction record on re-entry after a Stage 2 `findings` result.
- **Maintained / decided by:** The Stage 1 author writes it once per triggering pass. The independent Stage 2 reviewer verifies it in a new pass and never edits it. The owner decides only owner-reserved questions (here Q2-Q4, which remain deferred). PM integrates status.
- **Governing instructions:** Stage 1 re-entry ([`analysis/reviews/README.md`](../../reviews/README.md#stage-1-re-entry)) and the [return and correction protocol](../../reviews/README.md#return-and-correction-protocol); Stage 1 in [`analysis/migration_methodology.md`](../../migration_methodology.md#stage-01).
- **When used:** Written after the triggering review and before the next fresh Stage 2 pass. The next reviewer reads it only in Phase B.
- **How used:** One disposition per finding, with source evidence, changed records and rows, checks actually performed, remaining work and responsible actor. The correction status is kept separate from independent verification.
- **Example:** A finding about a missing validation rule is accepted, the form's message keys are enumerated from the bytecode, and one alternative-path row per key is added.

</details>

---
[//]: # (ARTIFACT_USE_END)

<!-- ARTIFACT_READING_START -->
> [!WARNING]
> **Corrections recorded for all 10 findings; not yet independently verified**
>
> The triggering record is [`analysis/reviews/stage-02-pass-002.md`](../../reviews/stage-02-pass-002.md) (result `findings`). All 10 findings were confirmed against the legacy source and accepted. F-002 and F-007 were extended by the sweeps, and F-009 was narrowed: the stored task type label follows the server's default locale, not the user's. The largest corrections are F-001, where the time editor validates 10 conditions that are now separate rows, and F-007. For F-007, on the server, system-administrator status is granted and revoked by `admin.edit.role` on project 0, not by `sysadmin.promote`. This is recorded as observed behavior and risk, not as permission to carry it into the new application.
>
> The parity map moved from 193 to 202 rows (9 added, 59 changed). CHK-002, CHK-003 and CHK-004 were applied to every affected row, not only to the rows the reviewer cited. Everything here is the author's correction, and a new fresh blind Stage 2 pass must verify it.
>
> **Next:** PM verifies RESULT BA-001-04 and launches a new fresh Stage 2 pass. Details: [Disposition Summary](#read-disposition-summary) / [Remaining Work And Next Gate](#read-remaining-work-and-next-gate).

<details>
<summary><strong>Contents</strong></summary>

- [Scope And Inputs](#read-scope-and-inputs)
- [Disposition Summary](#read-disposition-summary)
- [Finding Dispositions](#read-finding-dispositions)
  - [F-001 Time-entry and iteration validation](#read-f-001-time-entry-and-iteration-validation)
  - [F-002 Delete cascades](#read-f-002-delete-cascades)
  - [F-003 Facebook like widget](#read-f-003-facebook-like-widget)
  - [F-004 Note attachment count](#read-f-004-note-attachment-count)
  - [F-005 Login and start-iteration branches](#read-f-005-login-and-start-iteration-branches)
  - [F-006 Hidden-project decorator](#read-f-006-hidden-project-decorator)
  - [F-007 System-administrator rule and refusal claims](#read-f-007-system-administrator-rule-and-refusal-claims)
  - [F-008 Story import errors and remembered settings](#read-f-008-story-import-errors-and-remembered-settings)
  - [F-009 Task type labels per bundle](#read-f-009-task-type-labels-per-bundle)
  - [F-010 Superseded figures](#read-f-010-superseded-figures)
- [Checklist Sweeps](#read-checklist-sweeps)
- [Changed Rows](#read-changed-rows)
- [Checks Performed](#read-checks-performed)
- [Reviewer Checklist Proposals](#read-reviewer-checklist-proposals)
- [Remaining Work And Next Gate](#read-remaining-work-and-next-gate)
- [Error Prevention](#read-error-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-scope-and-inputs"></a>

## Scope And Inputs

- **Task:** BA-001-04 (Stage 1 re-entry), role `ba`, mode `author`. It was performed by subagent `a5bb18013a4f4d2f8` of Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`, model `claude-opus-5-5`, who also wrote BA-001-01..03. PM assigned it on branch `stage-01/pass-002-corrections`, created from `main` `25b25c4`.
- **Triggering record:** [`analysis/reviews/stage-02-pass-002.md`](../../reviews/stage-02-pass-002.md), SHA-256 `545ad428ab41a516e5bf936592b6815617aaa661d47b0d33b09ee6f07fe81b52`, result `findings`. The ledger is [`analysis/reviews/evidence/S02-P002/comparison-results.json`](../../reviews/evidence/S02-P002/comparison-results.json), SHA-256 `e5a9badf3b12e364c8d34d8a05e151f8e12c58ac9609f7883b566f3d2714792e`. Both were read and not modified.
- **Reviewed versions:** the BA-001-03 result. That is reconnaissance `faecd7ab…` and workbook `1d8863d0…`, with 193 rows.
- **Earlier correction record:** [`analysis/stages/stage-01/stage-02-pass-001-dispositions.md`](./stage-02-pass-001-dispositions.md). It is historical and was not edited. Its row numbers use the BA-001-03 numbering.
- **Authority for resolution:** the immutable [`legacy/xplanner-plus.war`](../../../legacy/xplanner-plus.war) (SHA-256 `46ff9dc0…4edc`). It is the project's fixed baseline with a known MySQL patch (owner decision `legacy-baseline-provenance:xplanner2-revision1`; P-01..P-07 in the [reconnaissance](../../legacy_reconnaissance.md#read-gap-005-per-conclusion-impact)).
- **Not read:** the reviewer scratch areas `.migration-tmp/stage-02/` and `.migration-tmp/stage-02-p002/`, and earlier-migration examples (amendment A2). Every finding was resolved from the legacy source.
- **Method limits:**
  - There was no JDK, decompiler or runtime.
  - The author's own read-only Node tools under `.migration-tmp/stage-01/tools/` were used:
    - the class dump (`classdump.js`);
    - `authtrace.js`, a static call graph from 138 entry points;
    - `disasm.js`, a bytecode listing that now also prints exception tables;
    - per-file numbered reads.
  - Conclusions drawn from bytecode stay `Inferred` until Stage 3.
- **Checklist:** [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md), SHA-256 `c4d1f2a73e246393546cbdf02c05ec9f9fe4ae045e97b31923a1ebaff9f6ed11` (CHK-001..CHK-004).
- **Owner constraints applied:**
  - Q2, Q3 and Q4 stay deferred. Nothing is decided about carry-over, fixing or exclusion.
  - Insecure legacy behavior, including the F-007 rule, is recorded as observed behavior and risk. It is not permission to carry it into the new application.
- **Workbook row numbers:** below they refer to the corrected workbook (BA-001-04 numbering) unless a row is marked "old". Old rows up to 114 keep their number. Old rows 115-144 moved down by 1 and old rows from 145 by 9.

<a id="read-disposition-summary"></a>

## Disposition Summary

| Finding | Severity | Disposition | Main source evidence | Changed records / rows (new numbering) | Responsible actor for remaining work | Independent verification |
|---|---|---|---|---|---|---|
| F-001 | medium | accepted | `TimeEditorForm#valideRow` (10 `edittime.error.*` keys), `IterationEditorForm#requirePositiveInterval`; `ResourceBundle.properties:265,675-684` | rows 86, 145 rewritten; rows 146-153 added; GAP-009 | BA (Stage 3, input checks) | not yet |
| F-002 | low | accepted, extended | cascade annotations on `Project`, `Iteration`, `UserStory`, `Task`; `db-changelog.xml:258-267`; `NoteHelper#deleteNote` | rows 79, 88, 121, 136; extended to rows 49, 167, 169, 213 | BA (Stage 3, delete checks) | not yet |
| F-003 | low | accepted | `viewLayout.jsp:73-88` (live), `:92-95` (commented); `viewLayoutNew.jsp:114-117` | row 185; Data And Integrations | none | not yet |
| F-004 | low | accepted | `Note#getAttachmentCount`; `notes.jsp:80-92`; `ResourceBundle.properties:545` | row 164; Parity-Map Boundary | none | not yet |
| F-005 | low | accepted | `AuthenticationAction#execute` bytecode listing; `editIterationStatus.jsp:43-47,58-60`; `ResourceBundle.properties:272,275` | rows 14, 95 | BA (Stage 3) | not yet |
| F-006 | low | accepted | `projects.jsp:65-75` (declaration), `:82-84` (table without decorator) | row 73 | none | not yet |
| F-007 | medium | accepted, extended | `EditPersonHelper#modifyRoles`, `#isCurrentUserAdminOfProject`, `#setSysadmin`; `editPerson.jsp:144-151`; `out/authtrace.json` | rows 24, 31, 34 (`Yes` to `Inferred`), 88; CHK-002 sweep over every permission row; Runnable Surfaces enforcement table; GAP-007; Q3 facts | BA (Stage 3); owner via PM (Q3) | not yet |
| F-008 | low | accepted | `ImportStoriesAction#execute` exception table; `#setCookies`, `#populateForm`, `#getValueFromCookieOrProperties` | row 113 (`Partial` to `Yes`); row 115 added; Source Inventory; GAP-003; Data And Integrations | BA (Stage 3) | not yet |
| F-009 | low | accepted, mechanism narrowed | `task.type.*` in all 10 bundles (`out/task-type-labels.json`); `editTask.jsp:52-69`; `iCalServlet#generateTaskData` | row 129 (`Yes` to `Inferred`); row 220; GAP-011 | BA (Stage 3, locale checks) | not yet |
| F-010 | low | accepted | the workbook and the audit output | reconnaissance reading block, Build, Run, And Test Evidence, GAP-001, Parity-Map Boundary, Stage 1 Exit Checklist | none | not yet |

<a id="read-finding-dispositions"></a>

## Finding Dispositions

<a id="read-f-001-time-entry-and-iteration-validation"></a>

### F-001 Time-entry and iteration validation

- **Reviewer claim (C-118, C-204, C-259):**
  - old row 144 records only unparsable date/time input and cites `UpdateTimeAction`;
  - `TimeEditorForm#valideRow` raises nine more keys;
  - row 86 omits the positive-interval rule.
- **Source check:**
  - The constant pool of `TimeEditorForm#valideRow` holds exactly 10 keys. They are `edittime.error.unparsable_time`, `unparsable_number`, `missing_time`, `missing_person`, `same_people`, `negative_interval`, `overlapping_interval`, `both_interval_and_duration`, `missing_report_date` and `long_description`. The class also declares the field `MAX_DESCRIPTION_LENGTH`.
  - The messages are at `WAR:WEB-INF/classes/ResourceBundle.properties:675-684`.
  - The description input is limited by `TimeEditorForm.MAX_DESCRIPTION_LENGTH` in `WAR:WEB-INF/jsp/edit/editTimeEntries.jsp`.
  - `IterationEditorForm#requirePositiveInterval` holds `iteration.editor.bad_start_date`, `bad_end_date` and `nonpositive_interval` (`ResourceBundle.properties:265`).
  - The branch conditions are inferred from each key and its message, because control flow is not decompiled (GAP-009).
- **Form-key sweep beyond the cited rows (proposal P-1):**
  - `.migration-tmp/stage-01/tools/form-keys-sweep-04.js` checked 60 validation and error keys against the current rows. They come from the 17 form classes with a `validate` or `valideRow` method (of 27 form classes) and from the actions that save their own error messages. Output: `out/form-keys-sweep-04.txt`.
  - 59 keys are matched mechanically.
  - `people.import.status.success` is the per-line success status, and row 50 quotes its text "Success". It was confirmed by hand.
  - Before the correction, the only uncovered keys were the 9 time-editor keys and the iteration interval key.
- **Changes:**
  - row 86 now includes the positive-interval rule;
  - row 145 (old 144) cites the form validator and both parse keys;
  - rows 146-153 are added, one per remaining key, all `Inferred`;
  - GAP-009 now names the inferred conditions;
  - every changed row carries a CHK-004 note with the per-bundle key state.
- **Remaining work:** Stage 3 input tests of the time editor and the iteration editor. Responsible: BA.

<a id="read-f-002-delete-cascades"></a>

### F-002 Delete cascades

- **Reviewer claim (C-020, C-198, C-206, C-237, C-251):** the delete rows omit the mapping cascades, and notes are not cascaded.
- **Source check:**
  - The class dumps show these annotations:
    - `Project#getIterations`: `@OneToMany(cascade=ALL)`;
    - `Project#getBacklog`: `@OneToOne(cascade=REMOVE)`;
    - `Iteration#getUserStories`, `UserStory#getTasks` and `Task#getTimeEntries`: `@OneToMany(cascade=REMOVE)`.
  - `Project#getNotificationReceivers` (`@ManyToMany`, join table `notification_receivers`) and the project attributes (`@ElementCollection`, table `attribute`) are removed with the project row.
  - `Note` refers to its object only by `attachedToId`.
  - `NoteHelper#deleteNotesFor` is called only from `HibernateObjectRepository#delete`. The web delete path does not reach it: `DeleteObjectAction#doExecute` calls `CommonDao.delete`. Neither does SOAP: `XPlanner#removeObject` calls `Session.delete`.
- **Extended by the delete sweep (proposal P-2), covering every delete scenario:**
  - **Person, row 49.** `Person` has no relationship annotations. The only foreign keys to `person` are `WAR:WEB-INF/classes/db-changelog.xml:260` (`notification_receivers.person_id`) and `:262` (`story.customer_id`). The database is therefore expected to reject the delete when the person is a customer or a receiver. Other person references are plain columns and are left dangling.
  - **Note, row 167.** `DeleteNoteAction#doExecute` calls `NoteHelper#deleteNote`. That method counts the notes that reference the same file (`select note from Note note where note.file.id= ?`) and deletes the file only when this note is the last reference.
  - **File manager, row 169.** `FileSystemImpl#deleteFile` and `#deleteDirectory` delete by id without cascading. The foreign keys at `db-changelog.xml:259`, `:266` and `:267` are expected to make the database reject deleting a referenced file or a non-empty directory.
  - **SOAP removals, row 213.** The same mapping cascades apply, and notes are not deleted.
  - **Other deletes.** A notification receiver (row 83) removes only a join entry. A time entry marked for deletion (row 143) is a leaf with no children.
- **Changes:** rows 79, 88, 121 and 136 now state the cascade and the notes that are left behind. Rows 49, 167, 169 and 213 also carry sweep notes. Status stays unchanged, because the web delete and the confirm prompts are wired; the cascade statements rest on mappings, and the expected results say "runtime unverified".
- **Remaining work:** Stage 3 delete tests with dependent data. Responsible: BA.

<a id="read-f-003-facebook-like-widget"></a>

### F-003 Facebook like widget

- **Reviewer claim (C-289, C-390):** the like widget and its script are commented out.
- **Source check:**
  - An HTML comment opens at `WAR:WEB-INF/jsp/layout/viewLayout.jsp:92` (`<!-- a class="in"`) and closes at `:95` (`</span -->`). It encloses the LinkedIn link, the `connect.facebook.net` script and `fb:like`.
  - Only the Twitter status link and the Facebook feed-dialog link at `:73-88` are live.
  - `viewLayoutNew.jsp:114-117` has the same commented block. This file was found by searching every layout for the same markup.
- **Changes:** row 185 (old 176); Data And Integrations. `layout/viewLayoutNew.jsp` is now cited, so the JSP coverage count in the reconnaissance moved from 67 to 68 of 73.

<a id="read-f-004-note-attachment-count"></a>

### F-004 Note attachment count

- **Reviewer claim (C-269, C-477):** the value is a reference count, not a download counter.
- **Source check:**
  - `Note#getAttachmentCount` runs the query `select note from Note note where note.file.id=` for the file id and returns the list size.
  - The label is "References:" (`ResourceBundle.properties:545`).
  - `DownloadAttachmentAction` counts nothing.
  - Per bundle (CHK-004): "References:" in the default, `--` and `ja` bundles, "Referenzen:" in `de`. The other bundles have no key and fall back to the default.
- **Changes:** row 164 (old 155); the Parity-Map Boundary first-pass list.

<a id="read-f-005-login-and-start-iteration-branches"></a>

### F-005 Login and start-iteration branches

- **Reviewer claim (C-137, C-213):** the empty check applies to the submit field, and the "baselines" text appears only on arrival from time entry.
- **Source check:**
  - The string constants of `AuthenticationAction#execute` are `action`, `userId`, `password` and `remember`.
  - The bytecode listing shows that the first branch tests `StringUtils.isEmpty` on `action` and forwards to `notAuthenticated`. The credentials are then passed to `Authenticator.authenticate` without an emptiness check.
  - Failures show `login.failed` ("Could not authenticate user.") with a module message.
  - `WAR:WEB-INF/jsp/edit/editIterationStatus.jsp:43-47` shows `iteration.status.editor.message_1` only when `UpdateTimeAction.isFromUpdateTime`. Lines `:58-60` always show `message_4`, "Do you want to start the iteration?" (`ResourceBundle.properties:272,275`).
- **Changes:**
  - row 14 is rewritten, including the "no submit field shows the form" branch;
  - row 95 cites both messages and the start action's data sampling (`StartIterationAction#beforeObjectCommit`, `DataSampler.generateOpeningDataSamples`).

<a id="read-f-006-hidden-project-decorator"></a>

### F-006 Hidden-project decorator

- **Reviewer claim (C-192):** `HiddenRowDecorator` is declared but never passed to the table.
- **Source check:**
  - `WAR:WEB-INF/jsp/view/projects.jsp:65-75` declares the class.
  - The name occurs only at `:66`. This negative search has a positive control: the `writableTable` tag at `:82-84` was found, and it has no decorator attribute.
  - The sort order `is_hidden,name asc` at `:33` puts hidden projects last.
- **Changes:** row 73 now says hidden projects are listed last and are not styled differently. The row also carries a CHK-002 note.

<a id="read-f-007-system-administrator-rule-and-refusal-claims"></a>

### F-007 System-administrator rule and refusal claims

- **Reviewer claim (C-146, C-153, C-156, C-206, C-479):**
  - row 34 states the wrong rule;
  - row 31 omits it;
  - rows 24 and 88 state restrictions without their enforcement status.
- **Source check:**
  - `EditPersonHelper#modifyRoles` gates each submitted project role with `#isCurrentUserAdminOfProject(projectId, user)`, which calls `Authorizer.hasPermission` with `system.project` and `admin.edit.role`.
  - It then calls `#isCurrentUserAdminOfProject(0, user)`. If that passes, it calls `RoleAssociationRepository.deleteForPersonOnProject("sysadmin", …, 0)`, followed by `#setSysadmin` only when the `systemAdmin` flag is true.
  - `EditPersonAction#beforeObjectCommit` passes `PersonEditorForm#isSystemAdmin`.
  - The checkbox is rendered only inside `isUserAuthorized permission="sysadmin.promote"` (`WAR:WEB-INF/jsp/edit/editPerson.jsp:144-151`).
  - Who holds `admin.edit.role` on project 0 follows the seeded model. The sysadmin role matches `%` and the admin role matches `admin%` (seeded permissions 6 and 10). It is therefore an admin or a sysadmin assigned on project 0 (`Inferred`).
- **Extended:** `PersonEditorForm` uses the authorizer only to preselect the displayed roles (`#getRoles`, `#isRoleSelected`); it does not gate anything. `ImportPeopleAction` has an `AuthorizationException` handler that cannot be reached, because nothing on its path raises that exception.
- **Changes:**
  - row 34 is rewritten and moves from `Yes` to `Inferred`;
  - row 31 states the project-0 rule;
  - row 24 says nothing refuses a direct request;
  - row 88 says that no handler checks the restriction;
  - every other permission row was swept (see [Checklist Sweeps](#read-checklist-sweeps));
  - reconnaissance: the enforcement table under Runnable Surfaces, GAP-007 and a new Q3 fact row.
- **Owner boundary:** this is observed legacy behavior and risk. It is not a parity requirement and not permission to carry it into the new application (Q3, Stages 4 and 9).
- **Remaining work:** Stage 3 confirmation with a project-0 admin account and a sysadmin account. Responsible: BA, with PM access handoff.

<a id="read-f-008-story-import-errors-and-remembered-settings"></a>

### F-008 Story import errors and remembered settings

- **Reviewer claim (C-078, C-130, C-231, C-418):**
  - the action catches the worksheet exception itself;
  - the import settings are remembered in cookies.
- **Source check:**
  - The exception table of `ImportStoriesAction#execute`, decoded by the extended `disasm.js`, has four handlers over one code range, the range that holds the call to `EditObjectAction.execute`. They catch `importer.WrongImportFileSpreadsheetImporterException`, `MissingFieldSpreadsheetImporterException`, `MissingColumnHeaderSpreadsheetImporterException` and `importer.spreadsheet.MissingWorksheetException` (present in the WAR). They save `import.status.corrupted_file`, `missing_required_field`, `wrong_header` and `worksheet_not_found`.
  - The mapping at `WAR:WEB-INF/struts-config.xml:343-345` names the absent `com.technoetic.xplanner.importer.MissingWorksheetException` and is redundant.
  - `#setCookies` writes the 8 `import.spreadsheet.*` cookie names. It is called from `EditObjectAction#doExecute` after `#saveForm`, and `ImportStoriesAction#execute` delegates to `EditObjectAction.execute`.
  - `#populateForm` pre-fills the form through `#getValueFromCookieOrProperties`, with defaults at `WAR:WEB-INF/classes/xplanner.properties:278-284`.
- **Changes:**
  - row 113 moves from `Partial` to `Yes`;
  - row 115 is added (`Inferred`, with a provenance remark for the P-03 defaults);
  - reconnaissance: the Source Inventory absent-resources row, GAP-003 and the Data And Integrations spreadsheet row.

<a id="read-f-009-task-type-labels-per-bundle"></a>

### F-009 Task type labels per bundle

- **Reviewer claim (C-244):**
  - most bundles use different labels, and 4 bundles have no overhead key;
  - the iCal filter depends on the locale used when saving.
- **Source check, per bundle** (mechanical extraction into `out/task-type-labels.json`):
  - The default and `--` bundles use Feature, Defect, Debt, FTest, ATest and Overhead.
  - da, de, es, fr, it, ja and ru differ from the default in at least one type.
  - pt_br matches the default except that it has no overhead key.
  - da, es, fr and pt_br have no `task.type.overhead` key.
- **Narrowed:**
  - The option values in `WAR:WEB-INF/jsp/edit/editTask.jsp:52-69` come from `messages.getMessage("task.type.…")`, which passes no locale.
  - `XPlannerMessageResources#getMessage` passes the locale on to the Spring `MessageSource`. With no locale, the lookup is expected to use the JVM default locale (framework behavior, GAP-011).
  - The stored label therefore follows the server's default locale, not the locale of the user who saves.
  - `iCalServlet#generateTaskData` reads `task.type.overhead` from `java.util.ResourceBundle.getBundle("ResourceBundle")`, which also uses the JVM default locale.
  - The filter therefore diverges when the default locale changes between saving and reading, or when a task is saved through another path.
- **Changes:** row 129 moves from `Yes` to `Inferred` and holds the per-bundle facts. Row 220 carries a CHK-004 note, and GAP-011 is updated.
- **Remaining work:** Stage 3 check of the stored type under two server locales. Responsible: BA.

<a id="read-f-010-superseded-figures"></a>

### F-010 Superseded figures

- **Reviewer claim (C-408, C-409, C-410, C-416):** the build, sync and audit rows and GAP-001 keep old counts.
- **Source check:** confirmed. The rows said 179 and 0 / 179, and GAP-001 said 48 `Inferred`, while the BA-001-03 workbook held 193 rows with 60 `Inferred`.
- **Correction method (proposal P-3):**
  - All figures were regenerated from the rebuilt workbook: 202 rows, and 111 `Yes`, 71 `Inferred`, 19 `Partial`, 1 `No`, counted from the row data that `build-workbook.js` writes and confirmed by `audit:workbook`.
  - The JSP coverage (68 of 73) and the action-path coverage (all 87) were recounted mechanically.
  - The reconnaissance was then searched for `179`, `193`, `48`, `60`, `112`, `0 / 1`, `14 rows` and `10 changed`. The remaining hits are unrelated inventory figures (for example 48 security classes, about 60 JSPs read in detail) and a remapped workbook row reference (row 179 in the pass-001 table). The BA-001-03 change count stays as a labelled historical statement.
- **Changes:** reconnaissance reading block, Build, Run, And Test Evidence, GAP-001, Parity-Map Boundary and Stage 1 Exit Checklist.

<a id="read-checklist-sweeps"></a>

## Checklist Sweeps

The assignment required the checks to be applied to every affected row, beyond the rows cited in the findings. The row lists below use the new numbering.

**CHK-002, permission and role conditions.** Candidates were all rows whose requirement or expected result names a permission, a role, "authorized", "editor can", "sysadmin", "admin", "may" or "signed-in". Each handler was traced through `out/authtrace.json`. Each row now carries a `Server-side enforcement (CHK-002, BA-001-04)` note, or it already cited the server-side check.

| Outcome | Rows |
|---|---|
| The row cites the server-side check (already compliant or corrected) | 17, 28, 31, 33, 160, 173, 210, 213, 220, 222, 226 |
| Display-level condition with a different server-side rule | 34 |
| List filtered while the server renders it; the object pages behind the list are unchecked | 27, 38 |
| Display-level only; the note says "no server-side check" | 24, 26, 41, 42, 43, 46, 48, 49, 50, 58, 73, 75, 78, 79, 82, 85, 87, 88, 92, 94, 95, 98, 111, 117, 120, 121, 124, 128, 133, 134, 135, 136, 138, 142, 162, 166, 167, 188 |
| No check is reached (unreachable hook; unchecked utilities) | 35, 60 |
| Model rows; the note says where the model is evaluated | 23, 25 |
| Not a permission condition, or already a no-check row (sign-in, general statements, unconditional pages) | 19, 29, 30, 32, 37, 39, 62, 63, 80, 89, 108, 137, 157, 177, 181, 193, 207, 225 |

- For `EditTaskAction` and `IntegrationAction`, the only authorization calls on the path are recipient lookups inside the e-mail notification. They do not gate the change, and the notes say so.
- Outcome: 0 permission rows remain without an enforcement statement.

**CHK-003, effects, hooks, helpers and decorators.** Candidates were rows that attribute a side effect, a stored value, a cookie, a cascade, a notification, a helper, a hook or a decorator.

| Outcome | Rows |
|---|---|
| Corrected: the effect is not on the path or was misattributed | 73 (unused decorator), 113 (handler not traced), 14 (branch misattributed) |
| Corrected or added: the effect is now cited from its path | 49, 79, 88, 121, 136, 167, 169, 213 (cascades, from the mappings and delete paths), 115 (`EditObjectAction#doExecute` to `#setCookies`), 95 (`StartIterationAction#beforeObjectCommit` to `DataSampler`) |
| Verified; the path is already cited | 15-16 (`CredentialCookie#set` from `AuthenticationAction`, read in `FormSecurityFilter`), 35 and 104-105 (AF-02, AF-01), 70 (`ActivityLogFilter` on `/do/*`), 77 (`Project` `@ElementCollection` attributes), 98 (`CloseIterationAction#beforeObjectCommit`), 132 (`EditTaskAction#sendNotification`), 144 (`UpdateTimeAction#doUpdateEstimateAction`), 165 (BA-001-03, F-008), 179-180 (BA-001-03, F-002), 190 (`IntegrationAction#fireIntegrationEvent` to `IntegrationEmailNotifier#onEvent`), 194 (BA-001-03, F-006), 196-198 (unscheduled or unregistered, already `Inferred`), 213 (`XPlanner#saveHistory`) |
| Declared helper passed to its consumer | the only declared JSP helper class found in a view is `HiddenRowDecorator`; no other row cites a declared helper |

**CHK-004, locale- and variant-dependent rows.** All 10 bundles were compared mechanically for each key concerned.

| Outcome | Rows |
|---|---|
| Corrected: generalized from the default or from two bundles | 129 (task type labels), 164 (References label) |
| Per-variant note added | 14 (`userNotFound` in default, `--`, de, ja), 86 (`nonpositive_interval` in all 10), 95 (`message_4` only in default and `--`), 145-153 (each `edittime.error.*` key; `both_interval_and_duration` missing in es, `missing_report_date` only in default, `--`, de, it, ja, ru, `unparsable_number` missing in es, fr), 156 and 159 (date patterns per bundle), 220 (JVM default locale for the iCal filter) |
| Already per variant | 57 (bundle list), 66-68 (date formats, BA-001-03) |
| Legend | quoted texts are from the default bundle; stated in the reconnaissance status legend |

- Bundles without a key fall back to the default text. That is framework behavior and is recorded under GAP-011.

<a id="read-changed-rows"></a>

## Changed Rows

The row diff was generated by comparing `.migration-tmp/stage-01/out/rows-part*.pre-ba-001-04.js` with the final row data.

| Change | Rows (new numbering) | Source |
|---|---|---|
| Added (9) | 115 (import settings in cookies); 146, 147, 148, 149, 150, 151, 152, 153 (time-entry validation) | F-008, F-001 |
| Status changed | 34 (`Yes` to `Inferred`), 113 (`Partial` to `Yes`), 129 (`Yes` to `Inferred`) | F-007, F-008, F-009 |
| Rewritten or corrected in place | 14, 24, 31, 34, 73, 79, 86, 88, 95, 113, 121, 129, 136, 145, 164, 185 | F-001..F-009 |
| Sweep notes only (CHK-002, CHK-003, CHK-004 or cascade) | 23, 25, 26, 27, 33, 35, 38, 41, 42, 43, 46, 48, 49, 50, 58, 60, 75, 78, 82, 85, 87, 92, 94, 98, 111, 117, 120, 124, 128, 133, 134, 135, 138, 142, 156, 159, 162, 166, 167, 169, 188, 213, 220 | sweeps |

- In total, 59 existing rows changed and 9 rows were added. The workbook now has 202 rows: 111 `Yes`, 71 `Inferred`, 19 `Partial` and 1 `No`.
- The 31 provenance notes are unchanged and are still applied by requirement prefix.

<a id="read-checks-performed"></a>

## Checks Performed

Exit codes and file hashes of the final versions are reported in RESULT BA-001-04. This record lists which checks were run:

- source checks per finding, as described above, using `classdump.js` output, `authtrace.js`, `disasm.js` (now with exception tables) and per-file numbered reads;
- the form-key sweep `.migration-tmp/stage-01/tools/form-keys-sweep-04.js` (60 keys);
- the CHK-002, CHK-003 and CHK-004 sweeps above;
- the row edits `.migration-tmp/stage-01/tools/edit-ba-001-04-rows.js` and its add-ons `-b`, `-c` and `-d`, each asserting a unique requirement prefix; the workbook rebuild with `build-workbook.js` (31 provenance notes); and `tools/rowmap.js`;
- the reconnaissance row-number remap `.migration-tmp/stage-01/tools/remap-rows-04.js`;
- `npm --prefix analysis/tools run sync:workbook-progress`, then `audit:workbook`, `audit:project` and `audit:artifact-links`;
- `node analysis/tools/artifact-reading.js --file` on the reconnaissance and on this record;
- CHK-001 on all new or changed line citations and row references (`.migration-tmp/stage-01/tools/chk001-ba-001-04.js`);
- a before/after SHA-256 check of [`legacy/`](../../../legacy);
- `audit:workbook:excel`, once after the final workbook write.

<a id="read-reviewer-checklist-proposals"></a>

## Reviewer Checklist Proposals

PM decides admission and deduplication. This record states only whether source verification confirms the underlying error.

| Proposal | Underlying error confirmed by source verification? | Basis |
|---|---|---|
| P-1 (from F-001): list the message keys each editor form's validate method raises and account for each in a row | Yes. The time editor covered 1 of its 10 keys and the iteration editor lacked 1 key. The sweep of all 60 form and action keys found no further gaps. | F-001 disposition; `out/form-keys-sweep-04.txt` |
| P-2 (from F-002): state each delete scenario's persistence cascade from the mappings, including uncascaded children | Yes. The four web deletes omitted their cascades. The sweep also found the uncascaded person delete (foreign-key rejection or dangling references), the note-file rule and the file-manager foreign keys. | F-002 disposition |
| P-3 (from F-010): after a correction changes counts or statuses, regenerate every figure and search for superseded numbers | Yes. BA-001-03 updated the reading block and boundary but left three command rows and GAP-001 stale. | F-010 disposition |

The reviewer states that F-003, F-006, F-007, F-008 and F-009 are covered by existing rules or checks. The author agrees and proposes no new check for them. One author note for PM: this pass's self-detected CHK-001 failure (see Error Prevention) came from reading line numbers off a `sed -n` range whose leading blank lines were not visible. CHK-001 already covers that case, so no new check is proposed.

<a id="read-remaining-work-and-next-gate"></a>

## Remaining Work And Next Gate

- **Correction status:** complete for F-001..F-010 within the Stage 1 static boundary.
- **Independent verification:** **not yet performed.** A new fresh eligible Stage 2 session must run a full blind Phase A. This record and the pass-002 findings are withheld until Phase B. The author's corrections are not a clean verdict.
- **Open for Stage 3 (BA):** runtime confirmation of:
  - the time-editor and iteration validation conditions (F-001);
  - delete cascades and foreign-key rejections (F-002);
  - the empty-login branch (F-005);
  - the project-0 system-administrator rule (F-007);
  - import cookies (F-008);
  - the stored task type under two server locales (F-009);
  - the items carried over from pass 001.
- **Owner (deferred):**
  - Q3 (Stages 4 and 9) now also covers the system-administrator grant and revoke rule.
  - Q2 and Q4 are unchanged.
- **Link audit:** the plain path at [`analysis/reviews/README.md`](../../reviews/README.md) line 315, reported in BA-001-03, no longer fails. `audit:artifact-links` passed in BA-001-04 (200 Markdown documents).
- **PM:** verify RESULT BA-001-04, integrate status, decide on the reviewer proposals P-1..P-3, and launch the next Stage 2 pass.

<a id="read-error-prevention"></a>

## Error Prevention

- **Self-check:** Stage 1 re-entry, BA-001-04.
  - Checklist [`analysis/error-prevention-checklist.md`](../../error-prevention-checklist.md) SHA-256 `c4d1f2a73e246393546cbdf02c05ec9f9fe4ae045e97b31923a1ebaff9f6ed11`. Applicable checks: CHK-001..CHK-004.
  - **CHK-001** was run mechanically by `.migration-tmp/stage-01/tools/chk001-ba-001-04.js`. It covers every new or changed line citation in the workbook rows, the reconnaissance and this record, and the row references used in the BA-001-04 text. It found one self-detected error before handoff: a range for `editPerson.jsp` had been written as `142-149` from a misread listing. It was corrected to `144-151`, and the final run has 0 failures (count in RESULT BA-001-04).
  - **CHK-002**, **CHK-003** and **CHK-004** were applied as sweeps. The row lists and outcomes are in [Checklist Sweeps](#read-checklist-sweeps).
  - Pass 002 linked F-006 and F-008 to CHK-003, F-007 to CHK-002 and F-009 to CHK-004. Each required recheck was run over all affected rows, not only the cited ones.
- **Learning update:** the three reviewer proposals above. No project checklist edit is made by BA.

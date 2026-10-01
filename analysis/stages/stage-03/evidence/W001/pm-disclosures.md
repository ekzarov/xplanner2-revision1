# Stage 3 W001: PM Assessment of Operational Disclosures

**What did the Stage 3 walkthrough sessions disclose operationally, what was its impact, and how is it prevented?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM records the assessment. Codex, the coordinating operator under the delegated mandate, decides any consequence. This is not an owner decision.
- **Governing instructions:** the Stage 3 common assignment rules (PM scratch `.migration-tmp/stage-03/assign-common.md`, not in Git; summarized here) and [the deployment procedure](../../deploy/README.md#read-data-and-accounts).

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **The setup session disclosed no generated account password; the factory pair appeared once in the client transcript from page text**
>
> Stage 3 is a responsible-agent walkthrough, not an independent review verdict, so these disclosures do not invalidate a pass. They are assessed by their actual impact. The four new private role accounts never appeared in any evidence or scratch file. That was checked by exact-value scan (plain, Base64 and `userId:password` Base64) over 87 files, with 0 hits. The factory default pair differs: it is printed on the legacy login page itself, and one unredacted page-text excerpt showed it in the setup session transcript.
>
> **Next:** keep the preventions below in every later Stage 3 session; add later sessions' disclosures to this record.
>
> **Details:** [Setup Session](#read-setup-session) / [Prevention](#read-prevention).

<details>
<summary><strong>Contents</strong></summary>

- [Setup Session](#read-setup-session)
- [Prevention](#read-prevention)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-setup-session"></a>

## Setup Session

| # | Disclosure (W001-setup RESULT) | Impact | Assessment |
|---|---|---|---|
| 1 | One direct node run without TEMP/TMP/TMPDIR, reading only the key names and value lengths of the accounts file | No value printed; at most a node temp artefact in the user temp folder (not observed; not opened) | Low; no disclosure |
| 2 | A `find` from the repository root listed two file paths in other `.migration-tmp` folders | Names only, none opened; no conclusion rests on them | Low; no disclosure |
| 3 | An early redaction step showed the factory password as a substring of login-page text in the session transcript. The factory user id also appeared in console output from page text. | The factory pair is public legacy default content on the login page (row 9) and in [`legacy/README.md`](../../../../../legacy/README.md). It reached only the owner's local client transcript, not evidence or Git. The pair only works inside the tunnel-only environment, where the factory account was used for setup. | Masking breach in the transcript; contained; no generated secret involved |
| 4 | The runner self-test runs git internally, and the runner log sits outside the part allowlist | Tool behavior by design; no data exposure | None |
| 5 | One GET without `returnto` produced an HTTP 500 on the isolated app | Nothing changed; the app keeps running | None |
| 6 | Extra checks beyond the assigned steps (one story update, one read-only role pass) | Synthetic data inside `S3 Shared` only | None |

**Generated private accounts compared with the factory pair.**
- **Generated accounts:** the passwords of s3viewer, s3editor, s3admin and s3sysadmin are generated secrets. They are stored only in the ACL-restricted local file. Exact-value scans found them in no evidence or scratch file, and the session reported none in its transcript.
- **Factory pair:** it is a published legacy default. Its appearance is a masking lapse, not a new secret exposure.

<a id="read-prevention"></a>

## Prevention

- Never print or quote the login page text. Parse only the needed fields in memory. This rule is in the binding addendum for parts A-D.
- Redact before any output: the runner masks the factory pair, generic credential lines and every generated account value.
- Keep TEMP/TMP/TMPDIR set for every node run; write scripts with the file tool.
- List only the session's own scratch.
- The exact-value scan is repeated over all W001 evidence before the walkthrough record is published.

**Correction (PM error, found by the W001-lead session).** My first scan and the Stage 3 runner built the "factory pair" from the FIRST bold `a / b` text in [`legacy/README.md`](../../../../../legacy/README.md). That text is line 36, a host and product path, not the account pair on line 38. As a result:
- my earlier statement "10 token hits, the factory password is the product name" described the wrong string and is withdrawn;
- the runner (SHA-256 `fc91d350…`, used by parts setup and A-E and by the lead) did NOT mask the real line-38 pair. Its generic credential patterns and the generated-password masks were unaffected.
- The same first-match logic is in the Stage 2 review runner (`.migration-tmp/stage-02-p012/tools/safe-run.js`); its factory-pair self-test passed against the wrong text. The pass-012 reviewer's own CHK-009 scan is separate evidence and is not changed by this.

**Rescan with the real line-38 pair (647 files: all Stage 3 records, evidence and part scratch, before 2026-09-30T22:00:12Z):**
- 0 hits for any generated account password, plain or Base64.
- 0 pair-form hits (`user / pass`, or a login...password phrase) in any Stage 3 record or evidence file. The single pair-form hit is inside part C's scratch copy of the WAR's own `ResourceBundle.properties` (the login help text of the legacy system itself, not in Git).
- 0 hits for the factory password in Base64.
- 1018 hits for the factory password as a standalone word. The factory password is a common five-letter word that is also a role name used throughout the evidence. These are word collisions, not credential disclosures.

**Fix.** The Stage 3 runner now reads the pair from line 38 (`credential_line: 38`), new SHA-256 `6ac6a4a7…`. Its self-test passes, and it withholds the two credential lines of the WAR's login bundle. The fix was verified at 2026-09-30T22:00:12Z; every later Stage 3 run uses the fixed runner.

<!--
PM: read analysis/migration_methodology.md#pr-descriptions-comments-and-commits.
Use this structure even when the CLI does not load templates automatically.
Fill every section in English; replace placeholders and remove drafting notes.
Title: stage number AND name (or Bootstrap / Process maintenance), then outcome.
Do not request merge until required current-head CI and pre-merge reviews pass.
-->

## Purpose

**Stage / scope:** [stage number and name, slice or maintenance scope]
**Kind:** [authoring / control record / correction / process maintenance / delivery or decision record]

[One or two sentences: why this PR exists and the actual outcome, including any pending review.]

## Changes

- [Most important change and its practical effect; keep this list short.]

## Verification

| Check | Result and checked revision | Evidence |
|---|---|---|
| Local checks | [actual result, revision or snapshot; skipped checks separately] | [report link] |
| Required remote CI | [current PR head SHA; pending / passed / failed / blocked] | [run links, or why no run exists] |
| Independent review | [verdict and reviewed source SHA; pending or not required here with reason] | [report link and applicable stage rule] |

## Open Items

[Remaining findings, unverified scope, blockers and exclusions. State none only when established.]

## Owner Action / Next

- **Owner action:** [exact decision requested, or no action yet and why; no premature merge request]
- **Meaning of merge:** [what is recorded/integrated and what is NOT approved by merging]
- **Next:** [responsible role, next action and its prerequisites; label planned work]

## Evidence

- **Related work:** [triggering/previous PR and report; correction/follow-up PR if it exists]
- **Key records:** [two to four descriptive links pinned to the evidence revision]

<details>
<summary>Technical trace</summary>

- PR head: [full SHA; refreshed after each push]
- Reviewed source: [exact SHA or snapshot identified in the review; not automatically the PR head]
- Integrated revision: [actual merge SHA after merge, otherwise not yet merged]
- Trace: [relevant task, pass, finding or CHK IDs and repository-relative record paths]

</details>

# Error Prevention Checklist

**Which recurring mistakes must we check for before handing over this work?**

> [!NOTE]
> **Active checks, not a completion verdict.** All listed checks apply when their
> conditions hold. An empty table contains no learned checks and proves no stage complete.

[Active checks](#active-checks) | [Instructions](error-prevention.md)

Created empty by the initializer. The coordinator adds confirmed, generalized
checks and merges duplicates; the owner may prune obsolete rows. Agents apply
relevant rows before work and before handoff. Reviewers at Stages 2 and 19 read
the learned checks only in Phase B. Follow [the instruction](error-prevention.md).

<!-- Template output: analysis/error-prevention-checklist.md -->
<!-- Keep exactly four columns. Example rows belong in the instruction, not here. -->

## Active Checks

| Check | When applicable | Basis | How to check |
|---|---|---|---|
| CHK-001 Cited line numbers resolve to the cited file | Any stage record or review that cites a line number in a source, descriptor, JSP or other file as evidence | Self-detected Stage 1 error corrected before handoff: [`analysis/legacy_reconnaissance.md`](./legacy_reconnaissance.md#read-error-prevention); rule: [`analysis/legacy_user_flows_template_instructions.md`](./legacy_user_flows_template_instructions.md) (cite derived artifacts by symbol) | Take line numbers only from a per-file numbered read, never from a concatenated multi-file listing. Before handoff, check mechanically that every cited `file:line` exists in that file and that the line contains the cited element; any mismatch fails. |

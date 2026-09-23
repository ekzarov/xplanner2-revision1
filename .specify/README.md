# Specification Governance

The reusable constitution template lives at
[`memory/constitution.md`](memory/constitution.md). It is intentionally marked
`TEMPLATE - NOT RATIFIED`.

An initialized project must replace its project and owner placeholders, review
any project-specific amendments, and record explicit owner ratification in both
the constitution and [`analysis/migration_status.yaml`](../analysis/migration_status.yaml). Approval from another
migration is never inherited, and copying the file does not count as
ratification.

Generic SDD artifact templates are available in [`templates/`](templates/).
Project agents instantiate them only when the active stage and owner gates
permit SDD work.

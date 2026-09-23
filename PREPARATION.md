# XPlanner 2 Revision 1: Prepared Input

**This repository contains a legacy input package, not a started migration.**

## Current State

- Remote: https://github.com/ekzarov/xplanner2-revision1
- Local workspace: `C:/Work/Legacy/xplanner2-revision1`
- The remote was empty and public when preparation was performed.
- No commit, push, deployment, application startup, starter initialization,
  constitution ratification or stage transition has been performed here.
- No previous parity map, architecture, SDD, dependency graph, learned checklist,
  review, migration status, target implementation or database volume was copied.
- The owner will start the experiment in a separate session. That session must
  first report readiness and request explicit permission before initialization
  or any migration work. Permission to prepare these files is not that permission.

## Legacy Package

`legacy/` contains the XPlanner+ v1.1a4 WAR distribution and its existing local
run helpers. It is not a complete upstream Java source checkout. The WAR
already includes the MySQL configuration patch used by the earlier experiment;
the SQL seed is a prepared demo fixture, not production data or untouched upstream
content. Preserve the supplied baseline and record its limitations during bootstrap.

The four files were exported with `git archive` from the existing local delivery:

- Source repository: `C:/Work/Legacy/xplanner2`
- Source commit: `c8fd12cefd4f5519622f9c86b8fcb2a1dfce4360`
- Source `legacy/` Git tree: `3bd350fa5559ce56d2ea6f5136a62197754d4dca`
- The source path is provenance only. Do not inspect that project's migration
  results to fill this fresh project's artifacts.

These SHA-256 values identify the actual exported files, including their line
endings; they are not Git object IDs.

| File | Bytes | SHA-256 |
|---|---:|---|
| `legacy/README.md` | 2336 | `78b1a6b4c0e9fda7ec173f279a20d7b90645eb457c325483e6f1c876ac6e5460` |
| `legacy/demo-seed.sql` | 9387 | `2d32f7d5c6086c21f0df00f7e110a9a10bd259e8c2a9333cc1eb946033c3387e` |
| `legacy/docker-compose.yml` | 2124 | `e15cd9db799e6d20b199021fae832b7a9a450695395361dbc1bdab9d0969e9ff` |
| `legacy/xplanner-plus.war` | 29727650 | `46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc` |

## Starter And Start Boundary

Use the local starter at `C:/Work/Legacy/legacy-modernization-starter`.
Its prepared reference revision is
`2ad915812d25853d1f4c857c0346978e4913c0b8`.
This reference was refreshed after the public-safe bootstrap fixes on 2026-09-23;
it is a prepared baseline for the owner's confirmation, not a bootstrap approval.
Read its `AGENTS.md` and `MIGRATION.md` and follow the mandatory reading order.
If the starter has changed, report the difference before choosing the experiment's
baseline. Do not reset another workspace or copy completed project records.

The initializer has deliberately not been run. After owner authorization and
resolution of its security prerequisites, use the supported initialization path.
The target is already non-empty; inspect it and follow the initializer's overlay
rules without overwriting `legacy/` or fabricating a matching initializer marker.
This preparation note is not a replacement for the starter's project instructions.

## Security And Runtime Isolation

The referenced starter now generates an empty environment contract from its
public-safe template. It does not copy an SSH key, an actual server, host pins,
credential approval or expiry. A public destination is no longer a bootstrap
blocker. Do not use the obsolete `-ApproveSharedDemoCredential` switch or copy
the starter's actual environment configuration. Remote work still needs separately
approved settings and `audit:environment -- --require-configured`; a structurally
valid empty contract is not permission or readiness to access a server.

Before initialization, obtain explicit owner decisions on the Starter revision,
project name, project owner, a unique project ID and integration branch. The
initializer remains read-only toward the Starter, uses target-local dependencies
and cache, and preserves existing files. First-time document normalization is
limited to the newly created payload. For the strict project-only write boundary,
set and restore `TEMP`, `TMP`, `TMPDIR` and `npm_config_cache` to directories under
this project before running the source-only initializer self-test or project tests.
The installed runtime may execute, but it is not an additional context source.

Do not run the supplied `legacy/docker-compose.yml` unchanged. It uses project
name `xplanner`, fixed container names, port 8080 and an existing-style database
volume name, which can collide with an earlier local installation. Before any
runtime work, prepare a separate reviewed launcher outside the immutable legacy
baseline, with unique project/container/volume identities and an available
localhost-only port. Do not reuse, reset, reseed or stop old containers or volumes.
Resolve the actual deployed context path from that launcher; the legacy README
and Compose mount use different context names.

No application or runtime verification is claimed by this preparation.

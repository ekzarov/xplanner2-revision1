# Remote Environment Setup

**Which environment may this project connect to, and what must be verified first?**

The machine-readable contract is [environments.yaml](environments.yaml), governed
by [environments.schema.json](environments.schema.json). New projects start from
[environments.template.yaml](environments.template.yaml): no default environment,
no endpoints and no credentials. This is a valid **unconfigured** state, not
permission to connect or evidence of deployment readiness.

## Configure Before Remote Work

**PM owns access preparation and the authorized deployment run at Stages 3 and
18.** Before either deployment, PM asks the owner for the following, unless an
existing explicit authorization already covers the exact operation:

- The approved environment and application URLs, distinguishing legacy from
  the new application, and the permitted deployment or observation scope.
- Server/operator access through an approved secret channel, verified host-key
  pins and identity, and application test accounts for the required roles.
  Record secret references, never secret values in Git, reports or agent packets.
- Isolated deployment roots, service/container names, ports and databases/volumes;
  permitted test data and actions, especially writes, imports, jobs and deletion.
- The exact baseline/candidate revision, approved command or procedure, deployment
  window if applicable, data-change permission and recovery/stop conditions.

An existing grant may be reused only while it remains valid and covers the same
environment, operation, revision policy and data scope. Access, permission to
deploy, permission to change data and acceptance are separate. Legacy deployment
permission does not authorize new-application releases; demo permission does not
authorize production. Reconfirm changed scope or expired access before acting.

Before exposing an application, establish approved access and isolation; a public
factory password cannot protect a publicly reachable deployment. Keep baseline
bytes unchanged and use an authorized external runtime configuration or deployment
procedure. Public-data classification is not deployment clearance; follow
[credential-safe evidence](../analysis/agent_orchestration.md#credential-safe-evidence).

At **Stage 3**, PM deploys the immutable legacy baseline through the approved
procedure, or verifies an already-running baseline without redeploying it. PM
hands BA the exact revision, URLs, permitted accounts/actions and sanitized run
evidence. BA then compares observed behavior with the parity map. Stage 3 uses a
legacy-specific procedure; do not fill the future application's `commands.deploy`
slot with that procedure. Keep legacy running as the comparison baseline; do not
overwrite its data or rebuild it with every new-application release.

At **Stage 18**, Developer prepares the reviewed delivery procedure and recovery
plan in the Stage 17 candidate. PM rechecks current access and the exact release
authorization, then runs that unchanged candidate's configured `commands.deploy`.
Developer owns delivery verification/reconciliation and the report; QA may assist,
but independent Stage 19 acceptance remains separate. On failure, stop and
classify the cause. An authorized operational retry or rollback may remain at
Stage 18 without modifying the reviewed candidate. Implementation or deployment
code changes return through Stage 17; SDD, architecture or parity defects follow
the [classified return rules](../analysis/migration_methodology.md#living-architecture-loop).
Never patch the server ad hoc or rewrite the candidate to fit the result.

PM records the owner authorization reference, environment, actual operator,
command/procedure, revision, sanitized output and unresolved access in the
existing Stage 3 walkthrough or Stage 18 delivery record via its responsible
author. A bounded operator delegation is explicit and retains the actual executor;
PM remains accountable for the handoff. No new standalone access artifact is needed.
If required access, accounts or permission is missing, PM asks the owner and blocks
the affected action. Stage 3 fallback requires its recorded owner decision;
Stage 18 cannot report delivery passed without deployment and verification.

The owner must approve the environment and access separately from bootstrap.
Record the host, user, externally verified host-key pins and known-hosts file,
expected remote identity, project-specific deployment root and public endpoints.
Use a unique project ID and root; never inherit another project's containers,
volumes, endpoints or data. Follow the schema for all required fields.

Prefer `connection.authentication.mode: environment_variable` and an approved
`connection.authentication.private_key_environment_variable`; provide the
base64-encoded OpenSSH key outside Git. Record `public_key_fingerprint` in the
same authentication object.
Do not invent access, use another project's key, accept an unknown host key or
assume that configuring an environment authorizes a particular remote action.

## Validate And Connect

Structural validation is allowed during bootstrap:

```powershell
npm --prefix analysis/tools run audit:environment
```

Before **every remote operation**, including an early legacy walkthrough, require
a configured, valid environment and the applicable owner permission:

```powershell
npm --prefix analysis/tools run audit:environment -- --require-configured
npm --prefix analysis/tools run remote:check
```

`remote:check` verifies the configured host identity through pinned SSH. It fails
before connecting if the environment is unconfigured. Compare its output with
`verification` in this project's contract; there is no universal demo hostname.
For an authorized interactive session use `npm --prefix analysis/tools run remote:shell`.
Remote readiness is mandatory for delivery and completion, even if an earlier
bootstrap structural check passed.

## Existing Embedded Credential Exceptions

An existing project may retain an explicitly approved embedded key only under
its recorded, unexpired `temporary_secret_policy` and private-repository rule.
Initialization never copies such a key and never renews approval or expiry.
Remove the exception by moving access outside Git, rotating the server key and
handling historical exposure. Removing a value from the current checkout does
not remove it from Git history. Repositories with previously committed keys must
not be made public solely because their current configuration is empty.

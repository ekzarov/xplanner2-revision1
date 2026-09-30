# Stage 3 Legacy Deployment (xplanner2-revision1)

**How is the unchanged legacy WAR deployed in isolation for the Stage 3 live walkthrough, and when does the procedure stop?**

- **Created by:** PM / Coordinator, Claude Code session `d0ec1166-ffc9-446a-ba86-d768242e6de8`.
- **Maintained / decided by:** PM runs the procedure under the owner's Stage 3 grant (owner decision `stage-03-legacy-grant:xplanner2-revision1`). BA verifies behavior; the owner decides changes to scope.
- **Governing instructions:** [Remote Environment Setup](../../../../config/REMOTE_SERVER.md#configure-before-remote-work) and the published non-secret environment contract [`environments.xplanner2-revision1.yaml`](environments.xplanner2-revision1.yaml) (`tunnel-only`).

<!-- ARTIFACT_READING_START -->
> [!NOTE]
> **Reproducible, isolated deployment of the unchanged WAR on the demo server; nothing else on the server is touched**
>
> [`deploy.sh`](deploy.sh) creates only `/opt/xplanner2-revision1` and the Compose project `xplanner2-revision1` from [`compose.yaml`](compose.yaml) at a pinned commit. It verifies the WAR SHA-256 before start.
>
> **Next:** after the owner merges this PR, PM runs the pinned `remote:check` and then `deploy.sh`; BA starts the first business scenario through the tunnel.
>
> **Details:** [Isolation](#read-isolation) / [Stop Conditions](#read-stop-conditions) / [Access](#read-access).

<details>
<summary><strong>Contents</strong></summary>

- [Isolation](#read-isolation)
- [Stop Conditions](#read-stop-conditions)
- [Access](#read-access)
- [Data And Accounts](#read-data-and-accounts)

</details>
<!-- ARTIFACT_READING_END -->

<a id="read-isolation"></a>

## Isolation

- **Baseline:** [`legacy/xplanner-plus.war`](../../../../legacy/xplanner-plus.war), SHA-256 `46ff9dc0…4edc`. It is downloaded from this repository at a pinned commit, verified against the hash, and mounted read-only as `xplanner-legacy.war`. The context path is `/xplanner-legacy`.
- **Containers and names:** the stack is MySQL 5.7, Tomcat 9 / JRE 8 and a Mailpit sink. Every name uses the project prefix `xplanner2-revision1`, including the volume and the network. No fixed container names are used.
- **Network:** a single Docker `internal` network (`172.31.250.0/24`) with no egress. There are no published ports, no host network and no Docker socket.
- **Mail:** the WAR sends to `localhost:25`. The sink shares the app's network namespace, so mail stays in the project.
- **Memory limits:** app 1024 MB, database 768 MB, mail sink 128 MB.
- **Nothing else changes:** no existing container, network, volume, port, proxy, data or access is modified.

<a id="read-stop-conditions"></a>

## Stop Conditions

PM stops before or during the procedure, without changing anything, if any of these occurs:
- the host-key pin or the hostname/kernel identity (`remote:check`) does not match;
- `/opt/xplanner2-revision1` already exists;
- containers, volumes or networks of the project already exist;
- the subnet is in use;
- less than 2200 MB of RAM or 5 GB of disk is available;
- there is any risk of affecting other resources;
- the work would need an operation outside the grant.

The environment is left running for the owner. There is no automatic teardown.

<a id="read-access"></a>

## Access

- **Contract in use:** [`config/environments.yaml`](../../../../config/environments.yaml) stays unconfigured in Git because CI has no key. Before remote work the operator copies the published contract over it in the local working tree only, never committing it. Then `audit:environment -- --require-configured` and `remote:check` validate the key, the fingerprints and the host identity.
- **SSH to the server:** the pinned [`config/known_hosts.xplanner2-revision1`](../../../../config/known_hosts.xplanner2-revision1), `StrictHostKeyChecking=yes`. The key comes from the environment variable named in the contract. No key value is ever stored in Git or output.
- **Application:** reached only through a tunnel, `ssh -L 127.0.0.1:18080:172.31.250.10:8080 -L 127.0.0.1:18025:172.31.250.10:8025`. The login page is then `http://127.0.0.1:18080/xplanner-legacy/do/login` and the mail sink is `http://127.0.0.1:18025`.

<a id="read-data-and-accounts"></a>

## Data And Accounts

- **Database:** a new, empty database. Liquibase runs on the first application start, as the legacy installation does, and the log line count is recorded. No real data is used.
- **Synthetic data:** created in the running application.
- **Test accounts:** role accounts (viewer, editor, admin, sysadmin) with generated passwords. They are stored only in protected storage: the server `.env`/secrets with mode 600, or local ACL-restricted scratch. They are never written to Git, reports or chat.
- **Factory account:** the factory default account is used only inside this tunnel-only environment, to create those accounts.

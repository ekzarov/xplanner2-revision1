#!/usr/bin/env bash
# Stage 3 isolated legacy deployment for xplanner2-revision1.
# Run on the demo server as the authorized operator: bash deploy.sh <source-commit>
# It creates ONLY /opt/xplanner2-revision1 and the Compose project "xplanner2-revision1".
# It stops before any change if the root, project, names or subnet already exist, or if
# capacity is short. It never prints credentials, .env or docker inspect/config output.
set -euo pipefail
COMMIT="${1:?usage: deploy.sh <source-commit>}"
PROJECT=xplanner2-revision1
ROOT=/opt/xplanner2-revision1
WAR_SHA=46ff9dc090c1a5cf4cebba0d813f1c9a75204528a782acfcff864928ee3d4edc
RAW="https://raw.githubusercontent.com/ekzarov/xplanner2-revision1/${COMMIT}"
SUBNET=172.31.250.0/24; APP_IP=172.31.250.10; DB_IP=172.31.250.11
stop() { echo "STOP: $*" >&2; exit 3; }

echo "== preflight (read-only)"
[ "$(hostname)" = legacy-transformation-demo ] || stop "unexpected hostname"
[ ! -e "$ROOT" ] || stop "$ROOT already exists; not reusing it"
docker compose version >/dev/null 2>&1 || stop "docker compose plugin missing"
[ -z "$(docker ps -aq --filter label=com.docker.compose.project=$PROJECT)" ] || stop "compose project $PROJECT already has containers"
! docker volume ls --format '{{.Name}}' | grep -q "^${PROJECT}_" || stop "volumes of $PROJECT already exist"
! docker network ls --format '{{.Name}}' | grep -q "^${PROJECT}_" || stop "networks of $PROJECT already exist"
DOCKER_NETS=$(docker network inspect $(docker network ls -q) --format '{{range .IPAM.Config}}{{.Subnet}} {{end}}') || stop "cannot list docker subnets"
HOST_ROUTES=$(ip -4 route show) || stop "cannot list host routes"
# CIDR overlap (not prefix match) against every docker subnet and every non-default host route.
python3 - "$SUBNET" "$DOCKER_NETS" "$HOST_ROUTES" <<'PY' || stop "subnet $SUBNET overlaps an existing network or route"
import ipaddress, sys
mine = ipaddress.ip_network(sys.argv[1])
cands = sys.argv[2].split()
for line in sys.argv[3].splitlines():
    dest = line.split()[0] if line.strip() else ''
    if dest and dest != 'default':
        cands.append(dest if '/' in dest else dest + '/32')
for c in cands:
    try:
        net = ipaddress.ip_network(c, strict=False)
    except ValueError:
        continue
    if net.version == 4 and net.prefixlen > 0 and net.overlaps(mine):
        print(f"overlap with {net}"); sys.exit(1)
print(f"subnet {mine} free ({len(cands)} networks/routes checked)")
PY
AVAIL_MB=$(free -m | awk '/^Mem:/{print $7}'); DISK_GB=$(df -BG --output=avail /opt | tail -1 | tr -dc 0-9)
echo "available RAM ${AVAIL_MB} MB, free disk on /opt ${DISK_GB} GB"
[ "$AVAIL_MB" -ge 2200 ] || stop "less than 2200 MB RAM available"
[ "$DISK_GB" -ge 5 ] || stop "less than 5 GB free on /opt"

echo "== install"
umask 077
mkdir -p "$ROOT/baseline"
curl -fsSL "$RAW/legacy/xplanner-plus.war" -o "$ROOT/baseline/xplanner-plus.war"
echo "$WAR_SHA  $ROOT/baseline/xplanner-plus.war" | sha256sum -c - || stop "WAR hash mismatch"
chmod 444 "$ROOT/baseline/xplanner-plus.war"
curl -fsSL "$RAW/analysis/stages/stage-03/deploy/compose.yaml" -o "$ROOT/compose.yaml"
# Database account: the values the WAR itself uses (no change to the WAR); root password random.
python3 - "$ROOT/baseline/xplanner-plus.war" "$ROOT/.env" <<'PY'
import sys, zipfile, secrets
war, env = sys.argv[1], sys.argv[2]
props = zipfile.ZipFile(war).read('WEB-INF/classes/xplanner-custom.properties').decode('latin-1')
vals = {}
for line in props.splitlines():
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1); vals[k.strip()] = v.strip()
user, pwd = vals['hibernate.connection.username'], vals['hibernate.connection.password']
with open(env, 'w') as f:
    f.write(f"MYSQL_DATABASE=xplanner\nMYSQL_USER={user}\nMYSQL_PASSWORD={pwd}\n")
    f.write(f"MYSQL_ROOT_PASSWORD={secrets.token_urlsafe(24)}\n")
print("wrote .env (values not shown)")
PY
cat >> "$ROOT/.env" <<ENV
XP2R1_SUBNET=$SUBNET
XP2R1_APP_IP=$APP_IP
XP2R1_DB_IP=$DB_IP
XP2R1_APP_MEM=1024m
XP2R1_DB_MEM=768m
ENV
chmod 600 "$ROOT/.env"
cd "$ROOT"
docker compose -p "$PROJECT" up -d
echo "== wait for the login page"
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://$APP_IP:8080/xplanner-legacy/do/login" || true)
  [ "$code" = 200 ] && break; sleep 5
done
echo "login page HTTP ${code:-none}"
docker compose -p "$PROJECT" ps --format '{{.Service}} {{.State}} {{.Health}}'
if [ "${code:-}" != 200 ]; then
  # Short diagnosis without secrets: only exception/error lines of the application log.
  docker compose -p "$PROJECT" logs --tail 400 xplanner 2>/dev/null | grep -iE 'exception|error|severe' | grep -viE 'password|passwd|secret' | tail -15 || true
  echo "NOT READY: login page did not return 200 within the timeout" >&2
  exit 4
fi
echo "liquibase log lines: $(docker compose -p "$PROJECT" logs xplanner 2>/dev/null | grep -ci liquibase || true)"
echo "tunnel: ssh -L 127.0.0.1:18080:$APP_IP:8080 -L 127.0.0.1:18025:$APP_IP:8025 root@<host>"

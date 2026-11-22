#!/usr/bin/env bash
#
# Runs on the deploy host, not on a runner: the workflows send it over ssh's
# stdin, the same way deploy.sh is sent, because neither the compose files nor the
# credentials live in a runner's checkout.
#
#   ./preview.sh up <pr> <web-sha> [api-sha]   start or refresh the stack
#   ./preview.sh down <pr>                     stop it and drop its database
#   ./preview.sh list                          what exists, on which port, since when
#
# A preview is a pair of published images, a database of its own on the shared
# cluster, and one published port behind basic auth. It is not a second staging:
# no branch is checked out for it, nothing about it is durable, and `down` is
# meant to be run without a second thought.

set -euo pipefail

STATE="${PREVIEW_STATE:-$HOME/Projects/preview}"
STAGING_ENV="$HOME/Projects/massage-backend-staging/deploy/staging/.env"
COMPOSE_SRC="$HOME/Projects/massage-backend/deploy/preview"
DOMAIN_DEFAULT="asystastomatologiczna.site"
PORT_FIRST=9440
PORT_LAST=9499
MAX_STACKS=6
MAX_AGE_HOURS=24

die() {
    echo "$*" >&2
    exit 1
}

usage() {
    die "usage: preview.sh <up|down|list> [...]"
}

# The staging environment is the base of every preview: same cluster, same bucket,
# same secrets. Only the database name, the tags and the port differ.
staging_value() {
    grep -m1 "^$1=" "$STAGING_ENV" | cut -d= -f2-
}

preview_dir() {
    printf '%s/pr-%s' "$STATE" "$1"
}

compose() {
    local pr="$1"
    shift
    docker compose \
        --project-directory "$(preview_dir "$pr")" \
        -f "$(preview_dir "$pr")/docker-compose.yml" \
        --env-file "$(preview_dir "$pr")/.env" \
        "$@"
}

# Ports are allocated by asking the kernel, then checking the state directory:
# a container that is starting has not bound its port yet, so a free port alone
# is not proof that a preview does not own it.
allocate_port() {
    local pr="$1" port
    for port in $(seq "$PORT_FIRST" "$PORT_LAST"); do
        [ -d "$STATE/pr-$pr" ] && { echo "$port"; return; }
        grep -qs "^PREVIEW_PORT=$port$" "$STATE"/*/.env 2>/dev/null && continue
        ss -ltn "sport = :$port" | grep -q LISTEN && continue
        echo "$port"
        return
    done
    die "no free preview port in $PORT_FIRST-$PORT_LAST"
}

# One credential pair for all previews, generated once and kept next to the
# stacks. It never goes near GitHub: the repository is public, and a secret in a
# workflow log is a published secret.
auth_line() {
    local creds="$STATE/credentials" user pass hash
    if [ ! -f "$creds" ]; then
        mkdir -p "$STATE"
        user="preview"
        pass="$(head -c 18 /dev/urandom | base64 | tr -d '/+=' | cut -c1-24)"
        printf 'PREVIEW_USER=%s\nPREVIEW_PASSWORD=%s\n' "$user" "$pass" > "$creds"
        chmod 600 "$creds"
    fi
    # shellcheck disable=SC1090
    . "$creds"
    hash="$(docker run --rm --entrypoint caddy \
        "$(staging_value REGISTRY || echo ghcr.io/richardpickman)/massage-web:$(staging_value WEB_TAG)" \
        hash-password --plaintext "$PREVIEW_PASSWORD")"
    printf '%s %s' "$PREVIEW_USER" "$hash"
}

# A preview may not read production's accounts by accident, so it gets its own
# database. Users are copied from staging, which is what makes signing in on a
# preview possible without inventing a second credential story.
copy_users() {
    local target="$1"
    PREVIEW_DB="$target" python3 - <<'PY'
import os
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import dotenv_values
from pymongo import MongoClient

env = dotenv_values(Path.home() / "Projects/massage-backend-staging/deploy/staging/.env")
uri = (
    f"mongodb+srv://{quote_plus(env['DB_USER'])}:{quote_plus(env['DB_PASSWORD'])}"
    f"@{env['DB_HOST']}/?retryWrites=true&w=majority"
)
client = MongoClient(uri)
source = client[env["DB"]]
target = client[os.environ["PREVIEW_DB"]]

users = list(source.users.find({}))
if users:
    target.users.delete_many({})
    target.users.insert_many(users)
print(f"users copied: {len(users)}")
PY
}

drop_database() {
    PREVIEW_DB="$1" python3 - <<'PY'
import os
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import dotenv_values
from pymongo import MongoClient

env = dotenv_values(Path.home() / "Projects/massage-backend-staging/deploy/staging/.env")
uri = (
    f"mongodb+srv://{quote_plus(env['DB_USER'])}:{quote_plus(env['DB_PASSWORD'])}"
    f"@{env['DB_HOST']}/?retryWrites=true&w=majority"
)
MongoClient(uri).drop_database(os.environ["PREVIEW_DB"])
print(f"database dropped: {os.environ['PREVIEW_DB']}")
PY
}

# A preview nobody has touched in a day is dead weight on a box with no swap.
reap() {
    local dir pr age
    [ -d "$STATE" ] || return 0
    for dir in "$STATE"/pr-*; do
        [ -d "$dir" ] || continue
        pr="${dir##*/pr-}"
        if [ -f "$dir/touched" ]; then
            age=$(( ( $(date +%s) - $(stat -c %Y "$dir/touched") ) / 3600 ))
            if [ "$age" -ge "$MAX_AGE_HOURS" ]; then
                echo "reaping pr-$pr (idle ${age}h)"
                down "$pr" || true
            fi
        fi
    done
    # The count cap: oldest first, and only beyond the limit.
    local count
    # No matches is not an error: `set -e` would otherwise end the run here.
    count=$(ls -1d "$STATE"/pr-* 2>/dev/null | wc -l || true)
    if [ "$count" -gt "$MAX_STACKS" ]; then
        for dir in $(ls -1dt "$STATE"/pr-* | tail -n +"$((MAX_STACKS + 1))"); do
            pr="${dir##*/pr-}"
            echo "reaping pr-$pr (over the $MAX_STACKS cap)"
            down "$pr" || true
        done
    fi
}

up() {
    local pr="${1:?up needs a pull request number}"
    local web_sha="${2:?up needs the web commit}"
    local api_sha="${3:-}"
    local dir port api_tag db
    local -a flags=()

    dir="$(preview_dir "$pr")"
    mkdir -p "$dir"

    port="$(allocate_port "$pr")"
    api_tag="sha-$(printf '%s' "${api_sha:-$(staging_value API_TAG | sed 's/^sha-//')}" | cut -c1-7)"

    # An isolated database needs an Atlas user allowed to open it, and the current
    # one is scoped to data/testing - so a preview writes into staging's database
    # unless PREVIEW_DB_ISOLATED is set. Shared means preview attempts and test
    # lectures land in staging data; isolated needs a cluster user with
    # readWriteAnyDatabase first.
    if [ "${PREVIEW_DB_ISOLATED:-0}" = "1" ]; then
        db="preview_$pr"
        [ -d "$dir" ] && grep -q "^DB=$db$" "$dir/.env" 2>/dev/null || copy_users "$db"
    else
        db="$(staging_value DB)"
    fi

    {
        printf 'PREVIEW_ID=%s\n' "$pr"
        printf 'PREVIEW_PORT=%s\n' "$port"
        printf 'DOMAIN=%s\n' "$(staging_value DOMAIN || echo "$DOMAIN_DEFAULT")"
        printf 'REGISTRY=%s\n' "$(staging_value REGISTRY || echo ghcr.io/richardpickman)"
        printf 'WEB_TAG=sha-%s\n' "$(printf '%s' "$web_sha" | cut -c1-7)"
        printf 'API_TAG=%s\n' "$api_tag"
        # Everything else comes from staging untouched, with the database swapped.
        grep -vE '^(DOMAIN|REGISTRY|WEB_TAG|API_TAG|DB|PREVIEW_)=' "$STAGING_ENV"
        printf 'DB=%s\n' "$db"
    } > "$dir/.env"
    chmod 600 "$dir/.env"

    cp "$COMPOSE_SRC/docker-compose.yml" "$dir/"
    AUTH_LINE="$(auth_line)" python3 - "$COMPOSE_SRC/Caddyfile" "$dir/Caddyfile" <<'PYSUB'
import os
import sys
from pathlib import Path

template = Path(sys.argv[1]).read_text()
Path(sys.argv[2]).write_text(
    template.replace("{$PREVIEW_AUTH}", os.environ["AUTH_LINE"])
)
PYSUB
    chmod 600 "$dir/Caddyfile"
    touch "$dir/touched"

    # A locally loaded image (the way a preview is rehearsed by hand) makes the
    # pull fail; the container tags are what matter, not the registry lookup.
    compose "$pr" pull --quiet 2>/dev/null || true
    # The Caddyfile is a bind mount, and a container keeps the inode it opened: a
    # rewritten file is invisible until the container is recreated.
    compose "$pr" up -d --remove-orphans --force-recreate

    # Wait for the edge to answer, so a failed preview fails here and not in a
    # browser a minute later. Basic auth means 401 is the healthy answer.
    # Caddy serves the site by name, so a probe by IP gets no virtual host at all.
    # --resolve sends the right SNI without touching DNS.
    local code domain
    domain="$(staging_value DOMAIN || echo "$DOMAIN_DEFAULT")"
    for _ in $(seq 1 40); do
        code="$(curl -sk -o /dev/null -w '%{http_code}' --max-time 2 \
            --resolve "$domain:$port:127.0.0.1" "https://$domain:$port/" || true)"
        [ "$code" = "401" ] && break
        sleep 3
    done
    [ "$code" = "401" ] || die "preview did not come up on port $port (last answer: ${code:-none})"

    echo "preview pr-$pr up: https://$(staging_value DOMAIN || echo "$DOMAIN_DEFAULT"):$port (basic auth)"
}

down() {
    local pr="${1:?down needs a pull request number}"
    local dir db
    dir="$(preview_dir "$pr")"

    if [ -f "$dir/.env" ]; then
        compose "$pr" down -v --remove-orphans || true
        # Only a preview-owned database is dropped; the shared staging one is
        # never touched by teardown.
        db="$(grep -m1 '^DB=' "$dir/.env" | cut -d= -f2- || true)"
        if [ -n "${db:-}" ] && [ "${db#preview_}" != "$db" ]; then
            drop_database "$db" || true
        fi
    fi
    rm -rf "$dir"
    echo "preview pr-$pr down"
}

list() {
    local dir
    for dir in "$STATE"/pr-*; do
        [ -d "$dir" ] || continue
        printf 'pr-%-5s port %-5s web %-12s api %-12s touched %s\n' \
            "${dir##*/pr-}" \
            "$(grep -m1 '^PREVIEW_PORT=' "$dir/.env" | cut -d= -f2-)" \
            "$(grep -m1 '^WEB_TAG=' "$dir/.env" | cut -d= -f2-)" \
            "$(grep -m1 '^API_TAG=' "$dir/.env" | cut -d= -f2-)" \
            "$(date -r "$dir/touched" '+%Y-%m-%d %H:%M' 2>/dev/null || echo -)"
    done
}

[ $# -ge 1 ] || usage
command="$1"
shift

case "$command" in
    up)
        reap
        up "$@"
        ;;
    down) down "$@" ;;
    list) list ;;
    *) usage ;;
esac

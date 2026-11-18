#!/usr/bin/env bash
#
# Runs on the deploy host, not on the runner: the workflows send it over ssh's
# stdin, because the compose files live in massage-backend and no runner has a
# checkout of them.
#
#   ./deploy.sh <staging|production> <web|api> <full sha>
#
# This copy deploys the web container and refuses to do anything else. The API has
# its own copy in massage-backend, and the pair is what keeps a frontend commit
# from restarting the API: whichever repository is deploying, the other container
# is not touched.

set -euo pipefail

stack="${1:?usage: deploy.sh <staging|production> <web|api> <sha>}"
service="${2:?usage: deploy.sh <staging|production> <web|api> <sha>}"
sha="${3:?usage: deploy.sh <staging|production> <web|api> <sha>}"

if [ "$service" != web ]; then
    echo "this repository owns the web container, not $service" >&2
    exit 2
fi

case "$stack" in
    staging)
        # A second clone, tracking the integration branch. Production's checkout
        # stays on master, so the two never read each other's compose files.
        checkout="$HOME/Projects/massage-backend-staging"
        branch=testing
        stack_dir="$checkout/deploy/staging"
        port=8443
        ;;
    production)
        checkout="$HOME/Projects/massage-backend"
        branch=master
        stack_dir="$checkout/deploy"
        port=443
        ;;
    *)
        echo "unknown stack: $stack (expected staging or production)" >&2
        exit 2
        ;;
esac

tag="sha-$(printf '%s' "$sha" | cut -c1-7)"

# The compose definition comes from the branch this stack runs, so the host gets
# what was reviewed. --hard is safe here: the only untracked file that matters is
# .env, and a reset does not touch untracked files.
git -C "$checkout" fetch --quiet origin "$branch"
git -C "$checkout" reset --hard --quiet "origin/$branch"
cd "$stack_dir"

if [ ! -f .env ]; then
    echo "no .env in $stack_dir - copy the example beside it and fill it in" >&2
    exit 1
fi

# .env is the state of record: it names the commit each image is running, so a
# rollback is editing this line and letting the same script restart the container.
awk -v tag="$tag" '
    index($0, "WEB_TAG=") == 1 { print "WEB_TAG=" tag; found = 1; next }
    { print }
    END { if (!found) print "WEB_TAG=" tag }
' .env > .env.new
mv .env.new .env

# --no-deps is the point of the split: restart this container and nothing else.
docker compose pull --quiet "$service"
docker compose up -d --no-deps "$service"

# A container that starts is not an image that works, so probe the origin a
# browser would use. -k only for staging: its certificate comes from Caddy's own
# CA, while production's is real and a certificate problem there must fail.
domain="$(sed -n 's/^DOMAIN=//p' .env | head -1)"
probe=(-s -f -o /dev/null --max-time 30)
if [ "$stack" = staging ]; then
    probe+=(-k)
fi

curl "${probe[@]}" --resolve "$domain:$port:127.0.0.1" "https://$domain:$port/" || {
    echo "web did not answer on $domain:$port" >&2
    docker compose logs --tail 40 web >&2
    exit 1
}

echo "$stack: web is running $tag (https://$domain:$port/)"

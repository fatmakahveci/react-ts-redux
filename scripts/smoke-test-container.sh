#!/usr/bin/env bash
set -euo pipefail

image="${1:?Usage: bash scripts/smoke-test-container.sh <image> [port]}"
port="${2:-3000}"
if [[ ! "$port" =~ ^[0-9]{1,5}$ ]] || (( 10#$port < 1 || 10#$port > 65535 )); then
  echo "Port must be between 1 and 65535." >&2
  exit 1
fi
port="$((10#$port))"

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
work_dir="$(mktemp -d)"
cleanup() {
  # A cidfile identifies only the container created by this invocation.
  if [[ -s "$work_dir/container.id" ]]; then
    container_id="$(cat "$work_dir/container.id")"
    docker logs "$container_id" || true
    docker rm --force "$container_id" >/dev/null || true
  fi
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

docker run --detach --cidfile "$work_dir/container.id" \
  --read-only --tmpfs /tmp:rw,nosuid,nodev,noexec,size=64m \
  --cap-drop ALL --security-opt no-new-privileges \
  --publish "127.0.0.1:${port}:3000" "$image"

container_id="$(cat "$work_dir/container.id")"
if [[ "$(docker exec "$container_id" id -u)" == "0" ]]; then
  echo "The application must run as a non-root user." >&2
  exit 1
fi

curl --fail --silent --show-error \
  --retry 15 --retry-delay 1 --retry-all-errors \
  --max-time 5 --retry-max-time 60 \
  "http://127.0.0.1:${port}/" --output "$work_dir/home.html"
grep -q 'Redux State Demo' "$work_dir/home.html"
grep -q 'Demo login' "$work_dir/home.html"
node "$script_dir/check-security-headers.mjs" "http://127.0.0.1:${port}"

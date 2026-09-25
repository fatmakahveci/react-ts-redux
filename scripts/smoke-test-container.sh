#!/usr/bin/env bash
set -euo pipefail

image="${1:?Usage: bash scripts/smoke-test-container.sh <image> [port]}"
port="${2:-3000}"
if [[ ! "$port" =~ ^[0-9]+$ ]] || (( port < 1 || port > 65535 )); then
  echo "Port must be between 1 and 65535." >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
work_dir="$(mktemp -d)"
container_name="redux-state-demo-smoke-${RANDOM}-${RANDOM}"
cleanup() {
  docker logs "$container_name" || true
  docker rm --force "$container_name" >/dev/null || true
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

docker run --detach --name "$container_name" \
  --publish "127.0.0.1:${port}:3000" "$image"

curl --fail --silent --show-error \
  --retry 15 --retry-delay 1 --retry-all-errors \
  --max-time 5 --retry-max-time 60 \
  "http://127.0.0.1:${port}/" --output "$work_dir/home.html"
grep -q 'Redux State Demo' "$work_dir/home.html"
grep -q 'Demo login' "$work_dir/home.html"
node "$script_dir/check-security-headers.mjs" "http://127.0.0.1:${port}"

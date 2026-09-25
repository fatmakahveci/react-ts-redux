import assert from "node:assert/strict";

const baseUrl = process.argv[2];
assert.ok(baseUrl, "Usage: node scripts/check-security-headers.mjs <server-url>");

// Check real HTTP responses, including error pages, rather than the config alone.
for (const [path, status] of [["/", 200], ["/security-check-not-found", 404]]) {
  const response = await fetch(new URL(path, baseUrl), {
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  await response.arrayBuffer();
  assert.equal(response.status, status, `${path}: unexpected status`);

  const headers = response.headers;
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.equal(headers.get("referrer-policy"), "no-referrer");
  assert.equal(headers.has("x-powered-by"), false);

  const directives = new Map(
    (headers.get("content-security-policy") ?? "").split(";").map((value) => {
      const [name, ...sources] = value.trim().split(/\s+/);
      return [name, sources];
    }),
  );
  for (const name of ["form-action", "frame-ancestors", "object-src", "base-uri"]) {
    assert.deepEqual(directives.get(name), ["'none'"], `${path}: unsafe ${name}`);
  }
  const permissions = (headers.get("permissions-policy") ?? "")
    .split(",").map((value) => value.trim());
  for (const feature of ["camera", "microphone", "geolocation"]) {
    assert.ok(permissions.includes(`${feature}=()`), `${path}: ${feature} allowed`);
  }
}

console.log("Security headers passed for the homepage and 404 response.");

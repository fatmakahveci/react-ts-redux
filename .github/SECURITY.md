# Security Policy

## Project Scope

React Redux State Demo is an educational Next.js application demonstrating
client-side state management. Its login form is a simulation:

- Email and password fields use browser validation only. No account or
  credentials are verified.
- Submitting the form changes an in-memory Redux flag. The application does
  not send the form values to a backend or persist them.
- Authentication state controls which components are displayed. It does not
  provide access control or protect server resources.
- Reloading the page resets authentication and counter state.

Prefer the credential-free demo button, or use fictitious credentials when
trying the form. Applications built from this
example must implement authentication and authorization on the server before
using the interface to access protected data.

## Built-in Protections

The demo inputs are excluded from native form serialization, and the response
policy blocks native form submissions even before JavaScript loads. The browser
is asked not to autofill an existing password; use fictitious values regardless
of your password manager's behavior.

HTTP responses prohibit framing, embedded objects, and base URL changes, disable
MIME sniffing, and suppress referrer information. The CSP is scoped to these
controls; it does not impose a script allowlist or replace safe rendering and
server-side authorization. See the [Next.js header documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
and [CSP form-action reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action).

CI runs `npm run audit:security` against the lockfile, including development
dependencies, and fails when a known vulnerability is reported. The container
smoke test checks security headers on both successful and not-found responses.
Chromium tests verify that no-JavaScript form submission is blocked and entered
credentials do not appear in requests. Container validation uses a non-root
user, a read-only root filesystem, dropped capabilities, and no new privileges.
GitHub secret scanning with push protection, CodeQL scanning, and Dependabot
security updates are enabled in the upstream repository; forks must configure
these repository settings separately.

Environment files and private key files are excluded from Git and Docker build
contexts. Ignore rules do not remove previously committed secrets: revoke any
exposed credential. Configure HTTPS and an appropriate HSTS policy at the
production host; the local demo also supports HTTP for development.

## Supported Versions

Security fixes target the latest code on `main`. Older releases, forks, and
other branches do not have a guaranteed backport policy. Include the affected
commit or release in your report so the issue can be reproduced.

## Reporting a Vulnerability

Keep vulnerability details out of public issues, discussions, and pull requests.

Use the repository's
[private vulnerability reporting form](https://github.com/fatmakahveci/react-ts-redux/security/advisories/new)
when available. If it is unavailable, check the
[maintainer's GitHub profile](https://github.com/fatmakahveci) for a private
contact method. If no private channel is listed, open an issue requesting one
without including vulnerability details or exploit code.

Include the following in the private report:

- A short description and the affected component, commit, or release.
- Reproduction steps and a minimal proof of concept using fictitious data.
- Relevant Node.js, browser, and dependency versions.
- Expected and observed behavior, potential impact, and any prerequisites.
- Suggested mitigations, if known.

Remove passwords, tokens, personal data, and other secrets from logs and
screenshots before sharing them.

## What to Report

Report security issues in the application, dependency usage, or repository
workflows. For a dependency advisory, include the affected version and how the
vulnerable behavior can be reached in this project.

Changing the demo's client-side authentication flag or signing in with
fictitious credentials is expected behavior. Ordinary functional bugs can be
reported through public issues when they contain no sensitive information.

## Review and Disclosure

The maintainer will assess reports, investigate reproducible issues, and
coordinate fixes and disclosure with the reporter. Response and remediation
timelines depend on severity, reproducibility, and maintainer availability.

Please coordinate public disclosure through the private reporting channel so
that affected users can receive a fix or mitigation first.

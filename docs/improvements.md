# Twenty Project Improvements

This set keeps the application focused on a small Redux state-management demo.

| # | Improvement | Result |
| --- | --- | --- |
| 1 | Counter reset | Return to zero without changing whether the value is hidden. |
| 2 | Custom adjustments | Apply positive or negative whole-number amounts, including with Enter. |
| 3 | Exact arithmetic | Reject fractions, non-numeric payloads, infinities, and unsafe totals in the reducer; explain UI overflow and disable unavailable quick actions. |
| 4 | Credential-free entry | Explore the demo without entering an email or password. |
| 5 | Session focus management | Move keyboard focus to the new view after login or logout, without stealing focus on initial load. |
| 6 | Accessible form guidance | Associate the demo-only explanation with the form and inputs; disable email capitalization and spelling corrections. |
| 7 | Working skip navigation | The skip link moves focus to the main landmark. |
| 8 | Mobile layout | Stack panels and controls on narrow screens, use 44px touch targets, and wrap long counter values. |
| 9 | System color themes | Follow light/dark preferences with shared colors and visible focus states. |
| 10 | Consistent application identity | Use the project name in the header and title, with an SVG tab icon and theme metadata. |
| 11 | Helpful 404 page | Explain missing pages and provide a link back to the demo. |
| 12 | Error recovery | Offer a focused retry screen without exposing error details. |
| 13 | Developer verification and startup | Add independent type checks and a combined quality command; make npm start serve the actual standalone production bundle. |
| 14 | Browser regression coverage | Run Chromium scenarios in CI and retain failure reports for seven days. |
| 15 | Restricted container runtime | Test non-root execution with a read-only filesystem, temporary scratch space, dropped capabilities, and no privilege escalation. |
| 16 | Reliable smoke-test cleanup | Validate decimal ports and clean up only the container identified by this test's cidfile, including startup failures. |
| 17 | Compatible dependency automation | Keep routine Node, Node types, TypeScript, and ESLint major upgrades out of automatic version-update PRs. |
| 18 | Structured issue reporting | Collect reproducible bugs and feature requests; route security reports to private channels. |
| 19 | Pull request guidance | Provide a checklist for tests, UI evidence, documentation, and secret handling. |
| 20 | Current project documentation | Refresh the demo GIF, README, changelog, architecture notes, and contribution instructions. |

Validation includes reducer and DOM tests, production-browser scenarios, lint,
type checks, production builds, dependency auditing, workflow validation, and
the Docker smoke test used by CI and image delivery.

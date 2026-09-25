# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Added

- Counter reset, custom signed adjustments, safe-integer guards, and actionable overflow feedback.
- Credential-free demo entry, accessible input guidance, and focus management after session changes.
- System light/dark themes, mobile layouts, touch targets, and an SVG application icon.
- Custom missing-page and error-recovery screens.
- Reducer, rendering, interaction, and Chromium regression tests, including form-data protection.
- Independent type checks, a combined quality command, issue forms, and a pull request template.
- CI auditing, required checks, CodeQL, and automatic delivery of tested images to GHCR.

### Changed

- Organized components and typed store slices by responsibility and upgraded compatible dependencies.
- Serve the standalone production bundle with `npm start`, matching the container runtime.
- Share the restricted container smoke test between validation and delivery, with safe cleanup.
- Keep automated compiler, linter, and Node major upgrades aligned with the supported toolchain.
- Refresh the README demo, architecture notes, security policy, and contributor documentation.

### Fixed

- Corrected login/profile rendering and retained counter state through session transitions.
- Prevented invalid arithmetic, lost keyboard focus, and unsafe native form serialization.

### Security

- Apply response policies and exclude environment/private-key files from repository and image contexts.
- Require dependency auditing and browser security regressions in CI.

<!--
When preparing a release, move relevant entries from Unreleased into a dated
version section. Use Added, Changed, Deprecated, Removed, Fixed, and Security
headings as appropriate.
-->

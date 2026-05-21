# ADR-0005: release-please + npm provenance via OIDC

**Status:** Accepted
**Date:** 2026-05-21

## Context

The project needs automated, reviewable, provenance-attested npm releases from day one. Manual `npm version` + `npm publish` workflows are error-prone and leave no audit trail. Supply-chain security expectations for npm packages have risen; provenance attestation is now a baseline expectation for new packages.

## Decision

release-please consumes Conventional Commits to open a release PR when releasable commits accumulate. Merging the release PR triggers an npm publish via GitHub Actions using OIDC trusted publisher with `--provenance`. Configuration sets `initial-version: 0.1.0`; `bootstrap-sha` is set after the bootstrap commit lands on main. No tokens are stored as secrets; OIDC eliminates long-lived credentials.

## Consequences

**Positive:** Structured changelog auto-generated from commit history. Tags and GitHub releases created automatically. Supply-chain provenance attached from v0.1.0. The release PR pattern enables review before publish, which matters for an early-stage package.

**Negative:** release-please requires a correctly configured `bootstrap-sha`; misconfiguration causes it to replay all history. OIDC trusted publisher setup requires one-time npm registry configuration.

## Alternatives

- **semantic-release**: Publishes autonomously on merge without a review PR. Rejected for early-stage repo where human review before publish matters.
- **changesets**: Better fit for monorepos with independent versioning. Overkill for a single-package repo.
- **Manual `npm version` + publish**: Rejected. Violates the infra-as-code goal and introduces human error in the release path.

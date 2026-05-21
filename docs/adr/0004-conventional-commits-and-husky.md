# ADR-0004: Conventional Commits enforced via commitlint + husky

**Status:** Accepted
**Date:** 2026-05-21

## Context

release-please (see ADR-0005) consumes Conventional Commits to generate changelogs and determine version bumps. Structured changelog output requires structured input. Without enforcement, commit discipline degrades over time, especially with multiple contributors or AI-assisted commits.

## Decision

Adopt Conventional Commits 1.0.0 enforced by `@commitlint/config-conventional` defaults. A husky `commit-msg` hook gates commits locally. CI runs commitlint on every PR commit via GitHub Actions, so the gate holds even when hooks are bypassed locally.

## Consequences

**Positive:** Machine-readable history enables release-please to work correctly. Changelog entries are meaningful and categorized. Commit messages become a lightweight communication channel for reviewers.

**Negative:** Commit-message discipline adds friction, particularly for quick fixups. Contributors unfamiliar with Conventional Commits need onboarding. AI-generated commits must be validated before use.

## Alternatives

- **gitlint**: Smaller ecosystem, less tooling integration, and fewer preset configurations. Would require custom rules to match Conventional Commits semantics.
- **No enforcement**: Rejected. Discipline-only approaches fail at scale and with AI-assisted workflows where commit messages are generated rather than typed. release-please would produce malformed changelogs.
- **Custom commit format**: Rejected. Conventional Commits is an established standard with broad tooling support; inventing a format adds maintenance burden with no benefit.

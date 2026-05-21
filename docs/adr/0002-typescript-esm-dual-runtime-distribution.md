# ADR-0002: TypeScript with build step + ESM dist + dual-runtime npm distribution

**Status:** Accepted
**Date:** 2026-05-21

## Context

The OpenCode plugin API is TypeScript-typed via the oh-my-openagent SDK. The plugin must work on both Node.js ≥22 and Bun ≥1.3.14, as confirmed by primary-source investigation (`.omo/research/oh-my-openagent-and-claude-code-investigation.md`, `.omo/research/ts-npm-package-setup-2026.md`). The npm ecosystem in 2026 has largely converged on ESM-first; CJS interop carries ongoing maintenance cost. The package name `plan-driven-agents` is unscoped to keep install ergonomics simple.

## Decision

TypeScript source compiled by `tsc` to ESM JavaScript in `dist/`. Package manifest sets `"type": "module"`, pins `engines` to Node ≥22 and Bun ≥1.3.14, and uses an `exports` field map for clean entry-point resolution. No CJS shim is produced.

## Consequences

**Positive:** Full type safety on the `Plugin` API surface. Dual-runtime support from day one. ESM-only output avoids CJS shim debt and dual-format build complexity.

**Negative:** Consumers on Node <22 or Bun <1.3.14 are blocked. ESM-only means no `require()` interop for legacy toolchains.

## Alternatives

- **Plain JavaScript**: Rejected. Loses type safety on the `Plugin` API, which is the primary integration surface.
- **Bun-only distribution**: Rejected. Shrinks the user base without meaningful benefit; Node ≥22 supports the same ESM features.
- **CJS output (dual format)**: Rejected. The ecosystem is moving away from CJS; maintaining dual output adds build complexity and conditional exports surface area with no current consumer need.

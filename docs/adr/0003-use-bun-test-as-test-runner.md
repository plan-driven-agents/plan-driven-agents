# ADR-0003: Bun test as test runner

**Status:** Accepted
**Date:** 2026-05-21

## Context

The project uses Bun ≥1.3.14 as its primary runtime (see ADR-0002). A test runner is needed for both unit tests (SDK integration, config hook behavior) and integration tests (plugin load, agent registration). The runner must work without a separate transpilation step since the source is TypeScript.

## Decision

Use `bun test` for all unit and integration tests. Tests run in CI on the same Bun version pinned in `engines`. No separate test framework is installed.

## Consequences

**Positive:** Zero configuration required. Native TypeScript execution without a transpilation step. Fast cold start compared to Node-based runners. One fewer dependency subtree to audit and update.

**Negative:** Bun's test API is a Jest-compatible subset; any test that needs advanced Jest features (e.g., complex module mocking) may require workarounds. Switching runners later would require rewriting test files.

## Alternatives

- **Vitest**: Brings extra dependencies and is philosophically Node-first. Adds a transpilation layer on top of Bun, which is redundant given native TS support.
- **`node --test`**: Available in Node ≥22 but has weaker mocking primitives and snapshot support compared to `bun test` as of v22. Contradicts the Bun-primary runtime decision.
- **Jest**: Heaviest option; requires Babel or ts-jest for TypeScript. Rejected on dependency footprint alone.

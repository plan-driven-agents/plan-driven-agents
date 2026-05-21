# ADR-0006: Dual-target distribution (OpenCode + Claude Code)

**Status:** Accepted
**Date:** 2026-05-21

## Context

The package supports both OpenCode and Claude Code as delivery targets. Primary-source investigation (`.omo/research/oh-my-openagent-and-claude-code-investigation.md`, `.omo/research/PORTABILITY-ANALYSIS.md`) confirmed the two have incompatible loading mechanisms. OpenCode plugins are JavaScript modules that mutate a config object via a hook; Claude Code plugins are file-based and discovered by directory scan.

## Decision

Ship a single npm package serving both targets via different mechanisms:

- OpenCode: the published JavaScript module (`dist/index.js`) exports a `Plugin` async function. The function returns a `config` hook that sets `config.agent.architect` to a TypeScript object literal. No `.md` agent files are read at runtime.
- Claude Code: the published package contains `.claude-plugin/plugin.json` (manifest) and `.claude-plugin/agents/architect.md` (file-based agent definition). Claude Code's plugin loader scans the manifest's `agents` path and reads the markdown frontmatter directly.

The two definitions describe the same agent identity (description, name) but use the format each target requires.

## Consequences

**Positive:** A single `npm install` serves both runtimes. Each target gets the format it expects natively. The OpenCode path is fully programmatic, matching the established pattern from `oh-my-openagent`.

**Negative:** Two agent definitions must be kept in sync (the description string is duplicated in `src/index.ts` and `.claude-plugin/agents/architect.md`). The Claude Code path is structurally validated only — no Claude Code SDK runs in CI to verify end-to-end discovery.

## Alternatives

- **OpenCode reads `.md` files at runtime**: Rejected. Adds a runtime dependency on the markdown parser and ships agent definitions outside `dist/`. The proven `oh-my-openagent` pattern keeps definitions inside `dist/`.
- **Separate npm packages per target**: Rejected. Doubles the distribution surface for a single agent.
- **OpenCode-only or Claude-Code-only**: Rejected. Dual-target support is an explicit project requirement.

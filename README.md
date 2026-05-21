# plan-driven-agents

Plan-driven agents — explicit, verifiable work plans for AI coding agents.

[![npm version](https://img.shields.io/npm/v/plan-driven-agents)](https://www.npmjs.com/package/plan-driven-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/plan-driven-agents/plan-driven-agents/ci.yml?branch=main)](https://github.com/plan-driven-agents/plan-driven-agents/actions/workflows/ci.yml)

## Install

```bash
npm install plan-driven-agents
# or
bun add plan-driven-agents
```

### OpenCode

Add the package to your OpenCode `plugin` configuration:

```json
{
  "plugin": ["plan-driven-agents"]
}
```

OpenCode will load the plugin and register the bundled agent under `config.agent.architect`.

### Claude Code

Copy the bundled Claude Code plugin into your Claude Code plugins directory:

```bash
cp -r node_modules/plan-driven-agents/.claude-plugin <your-plugins-dir>/plan-driven-agents
```

The Claude Code distribution path may evolve as Claude Code's plugin loader matures.

## Use

After installation, the `architect` agent is registered and visible in the agent picker UI of your AI coding agent target. In OpenCode, switch to it via the agent picker (default keybinding: Tab). In Claude Code, invoke it from the agent menu.

The agent is registered with this description:

> Plan-first software architect specializing in iterative delivery and ADR-driven design

## Caveat

The published agent has no system prompt — invoking it shows the description and nothing else. The agent identity is fixed in v0.1.0 so subsequent versions can add behavior without renaming or redescribing the agent. See [`docs/testing-locally.md`](./docs/testing-locally.md) for verifying the registration end to end.

## License

MIT — see [LICENSE](./LICENSE).

# Testing locally

Manual verification that the plugin registers in OpenCode and Claude Code. Run these before publishing a new version.

## Prerequisites

- Bun >= 1.3.14 (for the test scripts)
- Node >= 22 (for the npm-installed scenario)
- A working OpenCode installation (TUI + SDK)
- A working Claude Code installation

## Pack a tarball locally

From the repo root:

```bash
bun run build
bun pm pack
# Produces: plan-driven-agents-0.1.0.tgz
```

This is the same tarball CI tests use. Anything that works against this tarball will work for npm consumers.

## Test in OpenCode

1. Pick a tmpdir that is NOT inside this repo. The tarball must be installed into a fresh consumer.
   ```bash
   mkdir /tmp/pda-opencode-test && cd /tmp/pda-opencode-test
   ```
2. Initialize a minimal OpenCode workspace:
   ```bash
   bun init -y
   bun add /path/to/plan-driven-agents-0.1.0.tgz
   ```
3. Create an OpenCode config that loads the plugin:
   ```bash
   mkdir -p .opencode
   cat > .opencode/opencode.jsonc << 'EOF'
   {
     "plugin": ["plan-driven-agents"]
   }
   EOF
   ```
4. Launch OpenCode in this directory.
5. Verify: open the agent picker (Tab in TUI). The `architect` agent should be visible with the description "Plan-first software architect specializing in iterative delivery and ADR-driven design".
6. Switch to the agent. The agent has no system prompt — invoking it shows the description and nothing else. This is expected.

## Test in Claude Code

1. Pick a tmpdir that is NOT inside this repo:
   ```bash
   mkdir /tmp/pda-claude-test && cd /tmp/pda-claude-test
   ```
2. Initialize a minimal consumer and install the tarball:
   ```bash
   bun init -y
   bun add /path/to/plan-driven-agents-0.1.0.tgz
   ```
3. Copy the Claude Code plugin into your Claude Code plugins directory. Path varies by installation; the typical location is `~/.claude/plugins/plan-driven-agents`:
   ```bash
   mkdir -p ~/.claude/plugins/plan-driven-agents
   cp -r node_modules/plan-driven-agents/.claude-plugin/* ~/.claude/plugins/plan-driven-agents/
   ```
4. Restart Claude Code or run `/plugin reload`.
5. Verify: open the agent menu. The `architect` agent should be listed with the description.
6. Cleanup when done:
   ```bash
   rm -rf ~/.claude/plugins/plan-driven-agents
   ```

## Cleanup

```bash
rm -rf /tmp/pda-opencode-test /tmp/pda-claude-test
rm /path/to/plan-driven-agents-0.1.0.tgz
```

## Failure modes

- **OpenCode does not show the agent**: check `config.agent.architect` in OpenCode's runtime config dump. The plugin's `config` hook should have set it. If the hook never ran, the plugin entry is broken.
- **Claude Code does not show the agent**: verify `~/.claude/plugins/plan-driven-agents/.claude-plugin/plugin.json` exists. Verify the manifest's `agents` path resolves to the file-based agent definition. Run `claude code /plugin` to see plugin load errors.
- **Tarball install fails**: check `package.json` `files` array — it must include `dist`, `.claude-plugin`, `README.md`, `LICENSE`. Anything outside that list is not in the tarball.

## Modifying agents

Agent definitions live in `definitions/agents/`. Each agent is a TypeScript module exporting metadata and, optionally, a system prompt body. After editing:

```bash
bun run generate
```

This regenerates `.claude-plugin/` to match. Commit both the source change and the regenerated files. CI verifies the two stay in sync.

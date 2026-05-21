import type { Plugin } from "@opencode-ai/plugin";

const ARCHITECT_AGENT = {
  description: "Plan-first software architect specializing in iterative delivery and ADR-driven design",
  mode: "primary",
} as const;

const plugin: Plugin = async () => ({
  config: async (config) => {
    config.agent ??= {};
    if (config.agent.architect !== undefined) {
      console.debug("[plan-driven-agents] overwriting existing config.agent.architect");
    }
    config.agent.architect = ARCHITECT_AGENT as (typeof config.agent)[string];
  },
});

export default plugin;

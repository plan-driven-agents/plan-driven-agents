import type { Plugin } from "@opencode-ai/plugin";
import { architect } from "../definitions/agents/architect.js";

const plugin: Plugin = async () => ({
  config: async (config) => {
    config.agent ??= {};
    if (config.agent.architect !== undefined) {
      console.debug("[plan-driven-agents] overwriting existing config.agent.architect");
    }
    config.agent.architect = {
      description: architect.description,
      mode: architect.mode,
    } as (typeof config.agent)[string];
  },
});

export default plugin;

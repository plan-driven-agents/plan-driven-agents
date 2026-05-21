export const architect = {
  name: "architect",
  description: "Plan-first software architect specializing in iterative delivery and ADR-driven design",
  mode: "primary",
  systemPrompt: undefined,
} as const;

export type AgentDefinition = typeof architect;

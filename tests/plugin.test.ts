// @ts-nocheck
import { describe, expect, test } from "bun:test";
import Plugin from "../src/index.ts";

describe("plugin config hook", () => {
  test("registers architect agent in config", async () => {
    const input = {
      client: null as never,
      project: null as never,
      directory: process.cwd(),
      worktree: process.cwd(),
      serverUrl: new URL("http://localhost"),
      $: undefined as never,
    };

    const hooks = await Plugin(input as never);
    const config: { agent?: Record<string, { description?: string; mode?: string }> } = {};
    await hooks.config?.(config as never);

    expect(config.agent).toBeDefined();
    expect(config.agent?.architect).toBeDefined();
    expect(config.agent?.architect?.description).toBe(
      "Plan-first software architect specializing in iterative delivery and ADR-driven design",
    );
    expect(config.agent?.architect?.mode).toBe("primary");
  });
});

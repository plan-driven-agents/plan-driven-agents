// @ts-nocheck
import { describe, expect, test } from "bun:test";
import Plugin from "../src/index.ts";

describe("plugin config hook idempotency", () => {
  test("invoking the hook twice on the same config produces the same result", async () => {
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
    const firstSnapshot = JSON.stringify(config);

    await hooks.config?.(config as never);
    const secondSnapshot = JSON.stringify(config);

    expect(secondSnapshot).toBe(firstSnapshot);
  });
});

// @ts-nocheck
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateClaudePlugin } from "../src/generators/claude-plugin";

describe("claude-plugin generator", () => {
  test("running the generator produces the committed .claude-plugin output", () => {
    const repoRoot = resolve(import.meta.dirname, "..");
    const manifestPath = resolve(repoRoot, ".claude-plugin", "plugin.json");
    const agentPath = resolve(repoRoot, ".claude-plugin", "agents", "architect.md");

    const manifestBefore = readFileSync(manifestPath, "utf8");
    const agentBefore = readFileSync(agentPath, "utf8");

    generateClaudePlugin();

    const manifestAfter = readFileSync(manifestPath, "utf8");
    const agentAfter = readFileSync(agentPath, "utf8");

    expect(manifestAfter).toBe(manifestBefore);
    expect(agentAfter).toBe(agentBefore);
  });
});

// @ts-nocheck
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";

describe("claude code agent file", () => {
  test(".claude-plugin/agents/architect.md frontmatter has Claude Code shape", () => {
    const filePath = resolve(import.meta.dirname, "..", ".claude-plugin", "agents", "architect.md");
    const raw = readFileSync(filePath, "utf8");
    const parsed = matter(raw);

    expect(parsed.data.name).toBe("architect");
    expect(parsed.data.description).toBe(
      "Plan-first software architect specializing in iterative delivery and ADR-driven design",
    );
    expect("tools" in parsed.data).toBe(false);
    expect("mode" in parsed.data).toBe(false);
  });

  test(".claude-plugin/plugin.json has minimal manifest shape", () => {
    const manifestPath = resolve(import.meta.dirname, "..", ".claude-plugin", "plugin.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

    expect(manifest.name).toBe("plan-driven-agents");
    expect(manifest.version).toBe("0.1.0");
    expect(manifest.agents).toBe("./agents/");
    expect(manifest.license).toBe("MIT");
  });
});

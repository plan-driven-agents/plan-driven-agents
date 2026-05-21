// @ts-nocheck
import { beforeAll, describe, expect, test } from "bun:test";
import { execSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..", "..");

const createFakeInput = (directory: string) => ({
  client: null as never,
  project: null as never,
  directory,
  worktree: directory,
  serverUrl: new URL("http://localhost"),
  $: undefined as never,
});

beforeAll(() => {
  execSync("bun run build", { cwd: repoRoot, stdio: "inherit" });
});

describe("e2e in-process plugin invocation", () => {
  test("dist/index.js exports a Plugin function that registers architect", async () => {
    const distPath = resolve(repoRoot, "dist", "src", "index.js");
    const mod = await import(distPath);
    const Plugin = mod.default;

    expect(typeof Plugin).toBe("function");

    const hooks = await Plugin(createFakeInput(repoRoot) as never);
    expect(typeof hooks.config).toBe("function");

    const config: { agent?: Record<string, { description?: string; mode?: string }> } = {};
    await hooks.config(config as never);

    expect(config.agent).toBeDefined();
    expect(config.agent?.architect).toBeDefined();
    expect((config.agent?.architect?.description ?? "").length).toBeGreaterThan(0);
    expect(config.agent?.architect?.mode).toBe("primary");
  });
});

describe("e2e tarball-installed plugin invocation", () => {
  test("plugin loads from node_modules after bun add of packed tarball", async () => {
    const consumerDir = mkdtempSync(resolve(tmpdir(), "pda-e2e-"));
    let tarballPath: string | undefined;

    try {
      execSync("bun pm pack", { cwd: repoRoot, stdio: "inherit" });
      tarballPath = resolve(
        repoRoot,
        readdirSync(repoRoot)
          .filter((entry) => entry.startsWith("plan-driven-agents-") && entry.endsWith(".tgz"))
          .sort()
          .at(-1) ?? "plan-driven-agents-0.1.0.tgz",
      );

      writeFileSync(
        resolve(consumerDir, "package.json"),
        JSON.stringify({ name: "consumer", version: "0.0.0", type: "module", private: true }, null, 2),
      );
      execSync(`bun add ${JSON.stringify(tarballPath)}`, { cwd: consumerDir, stdio: "inherit" });

      const installedDist = resolve(consumerDir, "node_modules", "plan-driven-agents", "dist", "src", "index.js");
      const mod = await import(installedDist);
      const Plugin = mod.default;

      expect(typeof Plugin).toBe("function");

      const hooks = await Plugin(createFakeInput(consumerDir) as never);
      const config: { agent?: Record<string, { description?: string; mode?: string }> } = {};
      await hooks.config(config as never);

      expect(config.agent?.architect?.description?.length ?? 0).toBeGreaterThan(0);
      expect(config.agent?.architect?.mode).toBe("primary");
    } finally {
      if (tarballPath !== undefined) {
        rmSync(tarballPath, { force: true });
      }
      rmSync(consumerDir, { recursive: true, force: true });
    }
  }, 60_000);
});

describe("e2e claude code tarball-installed package shape", () => {
  test("Claude Code manifest and agent file are present at expected paths after npm install", async () => {
    const consumerDir = mkdtempSync(resolve(tmpdir(), "pda-cc-e2e-"));
    let tarballPath: string | undefined;

    try {
      execSync("bun pm pack", { cwd: repoRoot, stdio: "inherit" });
      tarballPath = resolve(
        repoRoot,
        readdirSync(repoRoot)
          .filter((entry) => entry.startsWith("plan-driven-agents-") && entry.endsWith(".tgz"))
          .sort()
          .at(-1) ?? "plan-driven-agents-0.1.0.tgz",
      );

      writeFileSync(
        resolve(consumerDir, "package.json"),
        JSON.stringify({ name: "consumer", version: "0.0.0", type: "module", private: true }, null, 2),
      );
      execSync(`bun add ${JSON.stringify(tarballPath)}`, { cwd: consumerDir, stdio: "inherit" });

      const manifestPath = resolve(consumerDir, "node_modules", "plan-driven-agents", ".claude-plugin", "plugin.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      expect(manifest.name).toBe("plan-driven-agents");
      expect(manifest.version).toBe("0.1.0");

      const agentPath = resolve(
        consumerDir,
        "node_modules",
        "plan-driven-agents",
        ".claude-plugin",
        "agents",
        "architect.md",
      );
      const raw = readFileSync(agentPath, "utf8");
      const matter = (await import("gray-matter")).default;
      const parsed = matter(raw);
      expect(parsed.data.name).toBe("architect");
      expect((parsed.data.description ?? "").length).toBeGreaterThan(0);
      expect("tools" in parsed.data).toBe(false);
      expect("mode" in parsed.data).toBe(false);
    } finally {
      if (tarballPath !== undefined) {
        rmSync(tarballPath, { force: true });
      }
      rmSync(consumerDir, { recursive: true, force: true });
    }
  }, 60_000);
});

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type AgentDefinition, architect } from "../../definitions/agents/architect.js";

type PackageJson = {
  name: string;
  version: string;
  description: string;
  homepage?: string;
  repository?: string | { url?: string };
  license: string;
};

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(moduleDir, "..", "..");
const AGENTS: AgentDefinition[] = [architect];

function renderAgent(agent: AgentDefinition): string {
  const frontmatter = ["---", `name: ${agent.name}`, `description: ${agent.description}`, "---"].join("\n");
  const body = agent.systemPrompt ?? "";

  return body.length > 0 ? `${frontmatter}\n\n${body}\n` : `${frontmatter}\n`;
}

function normalizeUrl(value: string | undefined, suffix: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value.replace(/^git\+/, "").replace(new RegExp(`${suffix}$`), "");
}

function readPackageJson(): PackageJson {
  const pkgPath = resolve(repoRoot, "package.json");

  return JSON.parse(readFileSync(pkgPath, "utf8")) as PackageJson;
}

function renderManifest(): string {
  const pkg = readPackageJson();
  const repositoryValue = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  const homepage = normalizeUrl(pkg.homepage, "#readme");
  const repository = normalizeUrl(repositoryValue, "\\.git");

  const lines = [
    "{",
    `  "name": "${pkg.name}",`,
    `  "version": "${pkg.version}",`,
    `  "description": ${JSON.stringify(pkg.description)},`,
    `  "author": { "name": "${pkg.name}" },`,
    `  "homepage": "${homepage ?? ""}",`,
    `  "repository": "${repository ?? ""}",`,
    `  "license": "${pkg.license}",`,
    '  "agents": "./agents/"',
    "}",
    "",
  ];

  return lines.join("\n");
}

export function generateClaudePlugin(): void {
  const outDir = resolve(repoRoot, ".claude-plugin");
  const agentsDir = resolve(outDir, "agents");
  mkdirSync(agentsDir, { recursive: true });

  for (const agent of AGENTS) {
    const filePath = resolve(agentsDir, `${agent.name}.md`);
    writeFileSync(filePath, renderAgent(agent), "utf8");
  }

  writeFileSync(resolve(outDir, "plugin.json"), renderManifest(), "utf8");
}

const isMainModule = (import.meta as ImportMeta & { main?: boolean }).main === true;

if (isMainModule) {
  generateClaudePlugin();
}

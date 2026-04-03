import type { PluginName } from "./types";

/** Taxonomy categories for config modules. */
type ModuleCategory =
  | "architecture"
  | "core"
  | "documentation"
  | "domain"
  | "infrastructure"
  | "repository-architecture"
  | "style"
  | "testing";

/** Entry describing a documented config module. */
interface ModuleTaxonomyEntry {
  /** Category owning the module. */
  category: ModuleCategory;

  /** Public module name used in config options and diagnostics. */
  pluginName: PluginName;
}

/** Ordered module taxonomy matching RFC-0003. */
const moduleTaxonomy = [
  { category: "core", pluginName: "codeperfect" },
  { category: "core", pluginName: "eslint" },
  { category: "core", pluginName: "resolver" },
  { category: "core", pluginName: "typescript" },
  { category: "architecture", pluginName: "import-x" },
  { category: "documentation", pluginName: "comments" },
  { category: "documentation", pluginName: "jsdoc" },
  { category: "testing", pluginName: "jasmine" },
  { category: "testing", pluginName: "jest" },
  { category: "testing", pluginName: "playwright" },
  { category: "testing", pluginName: "vitest" },
  { category: "infrastructure", pluginName: "rxjs-x" },
  { category: "style", pluginName: "stylistic" },
  { category: "style", pluginName: "perfectionist" },
  { category: "style", pluginName: "unicorn" },
  { category: "style", pluginName: "prettier" },
  { category: "repository-architecture", pluginName: "boundaries" },
] as const satisfies readonly ModuleTaxonomyEntry[];

export { moduleTaxonomy };
export type { ModuleCategory, ModuleTaxonomyEntry };

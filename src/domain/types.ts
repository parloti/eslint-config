import type { Linter } from "eslint";
import type { DependenciesRuleOptions } from "eslint-plugin-boundaries";

/** Type definition for rule data. */
type ArchitecturePluginName = "boundaries" | "import-x";

/** Dependency rule options object used by the boundaries plugin. */
type BoundariesElementTypesOptions = DependenciesRuleOptions;

/** Rule entry shape used for repository-owned boundaries dependency rules. */
type BoundariesElementTypesRuleEntry = [
  Linter.RuleSeverity,
  BoundariesElementTypesOptions,
];

/** Type definition for rule data. */
interface ConfigOptions {
  /** Explicit plugin state overrides keyed by public plugin name. */
  plugins?: PluginStateOverrides;

  /**
   * Rules to disable or override.
   * Use 'off' to disable, or provide custom configuration.
   */
  rules?: Linter.RulesRecord;
}

/** Type definition for rule data. */
type CorePluginName = "codeperfect" | "eslint" | "resolver" | "typescript";

/** Type definition for rule data. */
type DocumentationPluginName = "comments" | "jsdoc";

/** Type definition for rule data. */
type DomainPluginName = "rxjs-x";

/** Type definition for rule data. */
type PluginName =
  | ArchitecturePluginName
  | CorePluginName
  | DocumentationPluginName
  | DomainPluginName
  | RuntimePluginName
  | StylePluginName
  | TestingPluginName;

/** Type definition for explicit plugin state overrides. */
type PluginStateOverrides = Partial<Record<PluginName, boolean>>;

/** Type definition for rule data. */
type RuntimePluginName = "angular-eslint";
/** Type definition for rule data. */
type StylePluginName = "perfectionist" | "prettier" | "stylistic" | "unicorn";

/** Type definition for rule data. */
type TestingPluginName =
  | "jasmine"
  | "jest"
  | "playwright"
  | "vitest"
  | "vitest-e2e";

export type {
  BoundariesElementTypesOptions,
  BoundariesElementTypesRuleEntry,
  ConfigOptions,
  PluginName,
  PluginStateOverrides,
};

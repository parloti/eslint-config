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
}

/** Type definition for rule data. */
type CorePluginName = "codeperfect" | "eslint" | "resolver" | "typescript";

/** Plugins that are disabled by default and can only be explicitly enabled. */
type DefaultDisabledPluginName =
  | "angular-eslint"
  | "jasmine"
  | "jest"
  | "vitest-e2e";

/** Plugins that are enabled by default and can only be explicitly disabled. */
type DefaultEnabledPluginName = Exclude<PluginName, DefaultDisabledPluginName>;

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
type PluginStateOverrides = Partial<
  Record<DefaultDisabledPluginName, true> &
    Record<DefaultEnabledPluginName, false>
>;

/** Type definition for rule data. */
type RuntimePluginName = "angular-eslint";
/** Type definition for rule data. */
type StylePluginName =
  | "package-json"
  | "perfectionist"
  | "prettier"
  | "stylistic"
  | "unicorn";

/** Type definition for rule data. */
type TestingPluginName =
  | "jasmine"
  | "jest"
  | "playwright"
  | "vitest"
  | "vitest-e2e";

export type {
  BoundariesElementTypesRuleEntry,
  ConfigOptions,
  DefaultDisabledPluginName,
  PluginName,
  PluginStateOverrides,
};

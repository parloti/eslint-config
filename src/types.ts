import type { Linter } from "eslint";
import type {
  DependenciesRuleOptions,
  ElementDescriptors,
} from "eslint-plugin-boundaries";

/** Type definition for rule data. */
type ArchitecturePluginName = "boundaries" | "import-x";

/** Type definition for rule data. */
interface BoundariesConfig {
  /** Repository-owned element descriptors for boundaries analysis. */
  elements: ElementDescriptors;

  /** Repository-owned dependency direction rules for boundaries analysis. */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments --- This is necessary to ensure correct typing of the rule options.
  elementTypes: Linter.RuleEntry<DependenciesRuleOptions[]>;

  /** Files included in repository-specific boundaries analysis. */
  files: readonly string[];

  /** Optional ignore globs excluded from repository-specific boundaries analysis. */
  ignores?: readonly string[];
}

/** Type definition for rule data. */
interface ConfigOptions {
  /** Repository-owned architecture input for the optional `boundaries` module. */
  boundaries?: BoundariesConfig;

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
  | StylePluginName
  | TestingPluginName;

/** Type definition for explicit plugin state overrides. */
type PluginStateOverrides = Partial<Record<PluginName, boolean>>;

/** Type definition for rule data. */
type StylePluginName = "perfectionist" | "prettier" | "stylistic" | "unicorn";

/** Type definition for rule data. */
type TestingPluginName = "jasmine" | "jest" | "playwright" | "vitest";

export type {
  BoundariesConfig,
  ConfigOptions,
  PluginName,
  PluginStateOverrides,
};

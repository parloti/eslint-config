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
  elements?: ElementDescriptors;

  /** Repository-owned dependency direction rules for boundaries analysis. */
  elementTypes?: BoundariesElementTypesRuleEntry;

  /** Optional additive extensions applied after the repository defaults. */
  extend?: BoundariesConfigExtension;

  /** Files included in repository-specific boundaries analysis. */
  files?: readonly string[];

  /** Optional ignore globs excluded from repository-specific boundaries analysis. */
  ignores?: readonly string[];
}

/** Type definition for additive boundaries extension fields. */
interface BoundariesConfigExtension {
  /** Additional repository-owned element descriptors appended to the defaults. */
  elements?: ElementDescriptors;

  /**
   * Additional dependency direction rules appended to the default rule set.
   * Only additive dependency rules are supported here.
   */
  elementTypes?: Pick<BoundariesElementTypesOptions, "rules">;

  /** Additional files appended to the default file globs. */
  files?: readonly string[];

  /** Additional ignore globs appended to the default ignore list. */
  ignores?: readonly string[];
}

/** Dependency rule options object used by the boundaries plugin. */
type BoundariesElementTypesOptions = DependenciesRuleOptions;

/** Rule entry shape used for repository-owned boundaries dependency rules. */
type BoundariesElementTypesRuleEntry = [
  Linter.RuleSeverity,
  BoundariesElementTypesOptions,
];

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
  BoundariesConfigExtension,
  BoundariesElementTypesOptions,
  BoundariesElementTypesRuleEntry,
  ConfigOptions,
  PluginName,
  PluginStateOverrides,
};

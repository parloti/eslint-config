import type { ConfigObject } from "@eslint/core";
import type { Linter } from "eslint";
import type {
  ElementDescriptors,
  Rules,
  Settings,
} from "eslint-plugin-boundaries";

import { createConfig, strict } from "eslint-plugin-boundaries/config";
import { defineConfig } from "eslint/config";

import type {
  BoundariesConfig,
  BoundariesConfigExtension,
  BoundariesElementTypesRuleEntry,
} from "../../domain";

/** Resolved boundaries config used internally after defaults are applied. */
type ResolvedBoundariesConfig = Omit<Required<BoundariesConfig>, "extend">;

/** Internal element-types tuple with a normalized rules array. */
type ResolvedBoundariesElementTypesRuleEntry = [
  BoundariesElementTypesRuleEntry[0],
  Omit<BoundariesElementTypesRuleEntry[1], "rules"> & {
    /** Normalized dependency rules array with no undefined branch remaining. */
    rules: NonNullable<BoundariesElementTypesRuleEntry[1]["rules"]>;
  },
];

/** Default repository element descriptors used by the boundaries plugin. */
const defaultElements: ElementDescriptors = [
  { mode: "full", pattern: "src/index.ts", type: "entrypoint" },
  { basePattern: "src", pattern: "application", type: "application" },
  {
    basePattern: "src",
    pattern: "infrastructure",
    type: "infrastructure",
  },
  { basePattern: "src", pattern: "domain", type: "domain" },
];

/** Default repository dependency rules used by the boundaries plugin. */
const defaultElementTypes: BoundariesElementTypesRuleEntry = [
  "error",
  {
    default: "disallow",
    rules: [
      {
        allow: { to: { type: ["application", "infrastructure"] } },
        from: { type: "entrypoint" },
      },
      {
        allow: { to: { type: "domain" } },
        from: { type: "application" },
      },
      {
        allow: { to: { type: ["application", "domain"] } },
        from: { type: "infrastructure" },
      },
    ],
  },
];

/** Default source file globs included in repository boundaries checks. */
const defaultFiles = ["src/**/*.ts"];

/** Default source file globs excluded from repository boundaries checks. */
const defaultIgnores = ["src/**/*.spec.ts"];

/** Repository default boundaries topology aligned with Clean Architecture. */
const defaultBoundariesConfig: ResolvedBoundariesConfig = {
  elements: defaultElements,
  elementTypes: defaultElementTypes,
  files: defaultFiles,
  ignores: defaultIgnores,
};

/**
 * Load boundaries plugin configuration using the default Clean Architecture
 * topology, with optional per-field overrides and additive extensions.
 * @param config Input config value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const configs = boundaries({
 *   extend: { ignores: ["fixtures/example.ts"] },
 *   files: ["packages/example/src/index.ts"],
 * });
 * ```
 */
function boundaries(config: BoundariesConfig = {}): Linter.Config[] {
  const { elements, elementTypes, files, ignores } =
    resolveBoundariesConfig(config);

  const settings: Settings = {
    ...strict.settings,
    "boundaries/elements": elements,
  };

  const rules: Rules = {
    ...strict.rules,
    "boundaries/dependencies": elementTypes,
  };

  const configObject = createConfig({
    files: [...files],
    ignores: [...ignores],
    rules,
    settings,
  }) as ConfigObject;

  return defineConfig(configObject);
}

/**
 * Clone the element-types rule entry so callers do not mutate shared defaults.
 * @param value Rule entry to clone.
 * @returns The cloned rule entry.
 * @example
 * ```typescript
 * cloneElementTypes(defaultBoundariesConfig.elementTypes);
 * ```
 */
function cloneElementTypes(
  value: BoundariesElementTypesRuleEntry,
): ResolvedBoundariesElementTypesRuleEntry {
  const [severity, options] = value;

  return [severity, { ...options, rules: [...(options.rules ?? [])] }];
}

/**
 * Merge the normalized base dependency rules with any additive extension rules.
 * @param baseRules The normalized base dependency rules.
 * @param extensionRules Additional extension rules.
 * @returns The merged dependency rules.
 * @example
 * ```typescript
 * mergeDependencyRules([], []);
 * ```
 */
function mergeDependencyRules(
  baseRules: NonNullable<BoundariesElementTypesRuleEntry[1]["rules"]>,
  extensionRules: NonNullable<BoundariesElementTypesRuleEntry[1]["rules"]>,
): NonNullable<BoundariesElementTypesRuleEntry[1]["rules"]> {
  const mergedRules: NonNullable<BoundariesElementTypesRuleEntry[1]["rules"]> =
    [];

  for (const rule of baseRules) {
    mergedRules.push(rule);
  }

  for (const rule of extensionRules) {
    mergedRules.push(rule);
  }

  return mergedRules;
}

/**
 * Resolve one array field by applying an override first, then appending any
 * additive extensions.
 * @template T Array item type.
 * @param defaults Repository defaults.
 * @param override Optional override that replaces the defaults.
 * @param extension Optional additive extension appended to the base value.
 * @returns The resolved array field.
 * @example
 * ```typescript
 * resolveArrayField(["src/index.ts"], ["packages/example.ts"], ["fixtures/example.ts"]);
 * ```
 */
function resolveArrayField<T>(
  defaults: readonly T[],
  override: readonly T[] | undefined,
  extension: readonly T[] | undefined,
): T[] {
  const baseValue = override ?? defaults;

  return extension === void 0 ? [...baseValue] : [...baseValue, ...extension];
}

/**
 * Resolve the repo default boundaries topology with optional overrides and
 * additive extensions.
 * @param config Input config value.
 * @returns Return value output.
 * @example
 * ```typescript
 * resolveBoundariesConfig({ extend: { ignores: ["fixtures/example.ts"] } });
 * ```
 */
function resolveBoundariesConfig(
  config: BoundariesConfig,
): ResolvedBoundariesConfig {
  const { extend, ...overrides } = config;

  return {
    ...defaultBoundariesConfig,
    elements: resolveArrayField(
      defaultBoundariesConfig.elements,
      overrides.elements,
      extend?.elements,
    ),
    elementTypes: resolveElementTypes(
      defaultBoundariesConfig.elementTypes,
      overrides.elementTypes,
      extend?.elementTypes,
    ),
    files: resolveArrayField(
      defaultBoundariesConfig.files,
      overrides.files,
      extend?.files,
    ),
    ignores: resolveArrayField(
      defaultBoundariesConfig.ignores,
      overrides.ignores,
      extend?.ignores,
    ),
  };
}

/**
 * Resolve the boundaries element-types rule entry with optional replacement and
 * additive rule extensions.
 * @param defaults Repository default element-types rule entry.
 * @param override Optional full replacement rule entry.
 * @param extension Optional additional rules appended to the base rule set.
 * @returns The resolved element-types rule entry.
 * @example
 * ```typescript
 * resolveElementTypes(defaultBoundariesConfig.elementTypes, undefined, { rules: [] });
 * ```
 */
function resolveElementTypes(
  defaults: BoundariesElementTypesRuleEntry,
  override: BoundariesConfig["elementTypes"],
  extension: BoundariesConfigExtension["elementTypes"],
): BoundariesElementTypesRuleEntry {
  const baseValue = override ?? defaults;

  if (extension === void 0) {
    return cloneElementTypes(baseValue);
  }

  const [severity, options] = cloneElementTypes(baseValue);
  const extensionRules: NonNullable<
    BoundariesElementTypesRuleEntry[1]["rules"]
  > = extension.rules ?? [];

  return [
    severity,
    {
      ...options,
      rules: mergeDependencyRules(options.rules, extensionRules),
    },
  ];
}

export { boundaries, defaultBoundariesConfig };

import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import { createJsdocConfigs } from "./jsdoc-config";

/** Summary of repo-owned JSDoc configs used by the assertions. */
interface IJsdocConfigSummary {
  /** Produced config names. */
  configNames: string[];
  /** Repo-owned custom config. */
  customConfig: Linter.Config | undefined;
  /** Context selectors used by require-description. */
  requireDescriptionContexts: string[];
  /** Context selectors used by require-jsdoc. */
  requireJsdocContexts: string[];
  /** Repo-owned spec override config. */
  specConfig: Linter.Config | undefined;
}

/** Rule options with an optional contexts selector list. */
interface IRuleWithContexts {
  /** AST selectors configured for the rule. */
  contexts?: string[];
}

/** Named upstream preset configs used by the docs tests. */
const typeScriptPresetNames = [
  "flat/contents-typescript-error",
  "flat/logical-typescript-error",
  "flat/recommended-typescript-error",
  "flat/requirements-typescript-error",
  "flat/stylistic-typescript-error",
] as const;

/**
 * Create a named preset config map for the mocked jsdoc plugin.
 * @returns The named preset config map.
 * @example
 * ```typescript
 * console.log(createNamedTypeScriptPresetConfigs());
 * ```
 */
function createNamedTypeScriptPresetConfigs(): Record<string, Linter.Config> {
  return Object.fromEntries(
    typeScriptPresetNames.map((name) => [name, { name }] as const),
  );
}

/**
 * Find one config by name.
 * @param configs The produced config array.
 * @param configName The config name to look up.
 * @returns The matching config if found.
 * @example
 * ```typescript
 * console.log(findConfig([], "jsdoc/custom"));
 * ```
 */
function findConfig(
  configs: Linter.Config[],
  configName: string,
): Linter.Config | undefined {
  return configs.find((config) => config.name === configName);
}

/**
 * Read the configured AST selectors for one repo-owned docs rule.
 * @param config Repo-owned config to inspect.
 * @param ruleName Rule name to inspect.
 * @returns The configured selector list.
 * @example
 * ```typescript
 * console.log(readRuleContexts(undefined, "jsdoc/require-jsdoc"));
 * ```
 */
function readRuleContexts(
  config: Linter.Config | undefined,
  ruleName: string,
): string[] {
  const rule = config?.rules?.[ruleName];

  if (!Array.isArray(rule)) {
    return [];
  }

  const [, options] = rule;

  if (
    options === void 0 ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    return [];
  }

  const { contexts } = options as IRuleWithContexts;

  return Array.isArray(contexts) ? contexts : [];
}

/**
 * Summarize the produced JSDoc configs for assertions.
 * @param configs The produced config array.
 * @returns The config summary used by the tests.
 * @example
 * ```typescript
 * console.log(summarizeJsdocConfigs([]).configNames);
 * ```
 */
function summarizeJsdocConfigs(configs: Linter.Config[]): IJsdocConfigSummary {
  const aliasConfig = findConfig(configs, "jsdoc/require-jsdoc-alias");
  const customConfig = findConfig(configs, "jsdoc/custom");
  const specConfig = findConfig(configs, "jsdoc/custom-spec");

  return {
    configNames: configs.map((config) => config.name ?? ""),
    customConfig,
    requireDescriptionContexts: readRuleContexts(
      aliasConfig,
      "jsdoc/require-description",
    ),
    requireJsdocContexts: readRuleContexts(aliasConfig, "jsdoc/require-jsdoc"),
    specConfig,
  };
}

describe("jsdoc config composition", () => {
  it("combines valid presets with repo-owned rules", () => {
    // Arrange
    const jsdocConfigs = createNamedTypeScriptPresetConfigs();
    const jsdocRules = {
      "convert-to-jsdoc-comments": {},
      "require-description": {},
      "require-throws": {},
      "sort-tags": {},
    };

    // Act
    const configSummary = summarizeJsdocConfigs(
      createJsdocConfigs(jsdocConfigs, jsdocRules),
    );

    // Assert
    expect(configSummary.configNames).toStrictEqual(
      expect.arrayContaining([
        ...typeScriptPresetNames,
        "jsdoc/custom",
        "jsdoc/require-jsdoc-alias",
        "jsdoc/custom-spec",
      ]),
    );

    expect(configSummary.customConfig?.rules).toMatchObject({
      "jsdoc/convert-to-jsdoc-comments": [
        "error",
        { enforceJsdocLineStyle: "single" },
      ],
      "jsdoc/require-description": "error",
      "jsdoc/require-throws": "error",
      "jsdoc/sort-tags": "error",
      "jsdoc/text-escaping": "off",
    });
    expect(configSummary.requireDescriptionContexts).toStrictEqual(
      expect.arrayContaining([
        "Program > FunctionDeclaration",
        'Program > ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
      ]),
    );
    expect(configSummary.requireJsdocContexts).toStrictEqual(
      expect.arrayContaining([
        "Program > FunctionDeclaration",
        'Program > ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
      ]),
    );
    expect(configSummary.specConfig).toMatchObject({
      files: ["**/*.spec.ts", "**/*.e2e.ts"],
      name: "jsdoc/custom-spec",
      rules: {
        "jsdoc/convert-to-jsdoc-comments": [
          "error",
          { allowedPrefixes: ["Arrange", "Act", "Assert"] },
        ],
      },
    });
  });

  it("ignores missing and invalid upstream presets", () => {
    // Arrange
    const jsdocConfigs: Record<string, unknown> = {
      "flat/contents-typescript-error": [] as unknown[],
      "flat/logical-typescript-error": "invalid",
      "flat/recommended-typescript-error": {
        name: "flat/recommended-typescript-error",
      } satisfies Linter.Config,
    };

    // Act
    const configSummary = summarizeJsdocConfigs(
      createJsdocConfigs(jsdocConfigs, void 0),
    );

    // Assert
    expect(configSummary.configNames).toStrictEqual(
      expect.arrayContaining([
        "flat/recommended-typescript-error",
        "jsdoc/custom",
        "jsdoc/require-jsdoc-alias",
        "jsdoc/custom-spec",
      ]),
    );

    expect(configSummary.configNames).not.toContain(
      "flat/contents-typescript-error",
    );
    expect(configSummary.configNames).not.toContain(
      "flat/logical-typescript-error",
    );
    expect(configSummary.customConfig?.rules).toMatchObject({
      "jsdoc/convert-to-jsdoc-comments": [
        "error",
        { enforceJsdocLineStyle: "single" },
      ],
      "jsdoc/text-escaping": "off",
    });
    expect(configSummary.customConfig?.rules).not.toHaveProperty(
      "jsdoc/require-throws",
    );
  });
});

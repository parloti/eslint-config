import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** Upstream JSDoc flat preset names consumed by this config. */
const jsdocPresetNames = [
  "flat/recommended-typescript-error",
  "flat/contents-typescript-error",
  "flat/logical-typescript-error",
  "flat/requirements-typescript-error",
  "flat/stylistic-typescript-error",
] as const;

/** Repo-owned JSDoc rules enabled when the plugin exposes them. */
const jsdocErrorRuleNames = [
  "check-indentation",
  "convert-to-jsdoc-comments",
  "require-description",
  "require-description-complete-sentence",
  "require-template",
  "require-throws",
  "sort-tags",
];

/** AST contexts that must include JSDoc. */
const requireJsdocContexts = [
  "Program > FunctionDeclaration",
  "Program > ExportDefaultDeclaration > FunctionDeclaration",
  "Program > ExportNamedDeclaration > FunctionDeclaration",
  "Program > VariableDeclaration",
  'Program > ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration",
  "TSPropertySignature",
  "TSMethodSignature",
  "TSCallSignatureDeclaration",
  "TSConstructSignatureDeclaration",
  "TSIndexSignature",
];

/**
 * Build the custom jsdoc error rules based on available plugin rules.
 * @param availableRules Set of available jsdoc rule names.
 * @returns The rules record for ESLint.
 * @example
 * ```typescript
 *  console.log(buildCustomErrorRules(new Set(["require-throws"])));
 * ```
 */
function buildCustomErrorRules(
  availableRules: Set<string>,
): Linter.RulesRecord {
  return Object.fromEntries(
    jsdocErrorRuleNames
      .filter((rule) => availableRules.has(rule))
      .map((rule) => [`jsdoc/${rule}`, "error"] as const),
  );
}

/**
 * Select only the upstream flat presets that are available in the current plugin version.
 * @param configs Upstream JSDoc config map.
 * @returns The available flat presets.
 * @example
 * ```typescript
 *  console.log(buildPresetConfigs({ "flat/recommended-typescript-error": {} as Linter.Config }).length);
 * ```
 */
function buildPresetConfigs(configs: Record<string, unknown>): Linter.Config[] {
  return jsdocPresetNames.flatMap((configName) => {
    const config = configs[configName];

    if (
      config === void 0 ||
      Array.isArray(config) ||
      typeof config !== "object"
    ) {
      return [];
    }

    return [config as Linter.Config];
  });
}

/**
 * Build the final repo-owned JSDoc configs on top of the upstream presets.
 * @param customError Repo-owned JSDoc rule overrides.
 * @returns The final ESLint config array.
 * @example
 * ```typescript
 *  console.log(buildRepoJsdocConfigs({}).length);
 * ```
 */
function buildRepoJsdocConfigs(
  customError: Linter.RulesRecord,
): Linter.Config[] {
  return defineConfig(
    {
      name: "jsdoc/custom",
      rules: {
        ...customError,
        "jsdoc/convert-to-jsdoc-comments": [
          "error",
          { enforceJsdocLineStyle: "single" },
        ],
        "jsdoc/text-escaping": "off",
      },
    },
    {
      name: "jsdoc/require-jsdoc-alias",
      rules: {
        "jsdoc/require-description": [
          "error",
          { contexts: requireJsdocContexts },
        ],
        "jsdoc/require-jsdoc": ["error", { contexts: requireJsdocContexts }],
      },
    },
    {
      files: ["**/*.spec.ts", "**/*.e2e.ts"],
      name: "jsdoc/custom-spec",
      rules: {
        "jsdoc/convert-to-jsdoc-comments": [
          "error",
          { allowedPrefixes: ["Arrange", "Act", "Assert"] },
        ],
      },
    },
  );
}

/**
 * Build the repo's final JSDoc configs from an upstream plugin shape.
 * @param configs Upstream JSDoc config map.
 * @param rules Upstream JSDoc rules map.
 * @returns The final ESLint config array.
 * @example
 * ```typescript
 *  console.log(createJsdocConfigs({}, {}).length);
 * ```
 */
function createJsdocConfigs(
  configs: Record<string, unknown>,
  rules: Record<string, unknown> | undefined,
): Linter.Config[] {
  const availableRules = new Set(Object.keys(rules ?? {}));
  const customError = buildCustomErrorRules(availableRules);
  const presetConfigs = buildPresetConfigs(configs);

  return defineConfig(...presetConfigs, ...buildRepoJsdocConfigs(customError));
}

export { createJsdocConfigs };

import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

import {
  buildTypeScriptExampleConfigs,
  resolveDisableTypeCheckedRules,
  resolveJsdocProcessorPlugin,
} from "./jsdoc-examples.js";

/** Upstream JSDoc flat preset names consumed by this config. */
const jsdocPresetNames = [
  "flat/recommended-typescript-error",
  "flat/contents-typescript-error",
  "flat/logical-typescript-error",
  "flat/requirements-typescript-error",
  "flat/stylistic-typescript-error",
] as const;

/**
 * Build the custom jsdoc error rules based on available plugin rules.
 * @param availableRules Set of available jsdoc rule names.
 * @returns The rules record for ESLint.
 * @example
 * console.log(buildCustomErrorRules(new Set(["require-throws"])));
 */
const buildCustomErrorRules = (
  availableRules: Set<string>,
): Linter.RulesRecord => {
  const ruleNames = [
    "check-indentation",
    "convert-to-jsdoc-comments",
    "require-description",
    "require-description-complete-sentence",
    "require-template",
    "require-throws",
    "sort-tags",
  ];

  return Object.fromEntries(
    ruleNames
      .filter((rule) => availableRules.has(rule))
      .map((rule) => [`jsdoc/${rule}`, "error"] as const),
  );
};

/** AST contexts that must include JSDoc. */
const requireJsdocContexts = [
  "Program > FunctionDeclaration",
  "Program > ExportDefaultDeclaration > FunctionDeclaration",
  "Program > ExportNamedDeclaration > FunctionDeclaration",
  "Program > VariableDeclaration",
  "Program > ExportNamedDeclaration > VariableDeclaration",
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration",
  "TSPropertySignature",
  "TSMethodSignature",
  "TSCallSignatureDeclaration",
  "TSConstructSignatureDeclaration",
  "TSIndexSignature",
];

/**
 * Select only the upstream flat presets that are available in the current plugin version.
 * @param configs Upstream JSDoc config map.
 * @returns The available flat presets.
 * @example
 * console.log(buildPresetConfigs({ "flat/recommended-typescript-error": {} as Linter.Config }).length);
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
 * @param typeScriptExampleConfigs Processor-backed TypeScript example configs.
 * @returns The final ESLint config array.
 * @example
 * console.log(buildRepoJsdocConfigs({}, []).length);
 */
function buildRepoJsdocConfigs(
  customError: Linter.RulesRecord,
  typeScriptExampleConfigs: Linter.Config[],
): Linter.Config[] {
  return defineConfig(
    ...typeScriptExampleConfigs,
    {
      name: "jsdoc/custom",
      rules: {
        ...customError,
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
      files: ["**/*.spec.ts"],
      name: "jsdoc/custom-spec",
      rules: {
        "jsdoc/convert-to-jsdoc-comments": [
          "error",
          { allowedPrefixes: ["Arrange", "Act"] },
        ],
      },
    },
  );
}

/**
 * Build the jsdoc plugin configuration and any overrides needed by this project.
 * @returns Return value output.
 * @example
 * console.log(await jsdoc());
 */
async function jsdoc(): Promise<Linter.Config[]> {
  const jsdocModule = await import("eslint-plugin-jsdoc");
  const typeScriptModule = await import("typescript-eslint");
  const { default: jsdocPlugin } = jsdocModule;
  const { configs, rules } = jsdocPlugin;
  const getJsdocProcessorPlugin = resolveJsdocProcessorPlugin(jsdocModule);
  const {
    configs: typeScriptConfigs,
    parser,
    plugin: typeScriptPlugin,
  } = typeScriptModule;

  const availableRules = new Set(Object.keys(rules ?? {})),
    customError = buildCustomErrorRules(availableRules),
    disableTypeCheckedRules = resolveDisableTypeCheckedRules(typeScriptConfigs),
    presetConfigs = buildPresetConfigs(configs),
    typeScriptExampleConfigs = buildTypeScriptExampleConfigs({
      disableTypeCheckedRules,
      getJsdocProcessorPlugin,
      parser,
      typeScriptPlugin,
    });

  return defineConfig(
    ...presetConfigs,
    ...buildRepoJsdocConfigs(customError, typeScriptExampleConfigs),
  );
}

export { jsdoc };

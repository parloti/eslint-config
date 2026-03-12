import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build the custom jsdoc error rules based on available plugin rules.
 * @param availableRules Set of available jsdoc rule names.
 * @returns The rules record for ESLint.
 * @example
 * ```typescript
 * const rules = buildCustomErrorRules(new Set(["require-throws"]));
 * ```
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
 * Build the jsdoc plugin configuration and any overrides needed by this project.
 * @returns Return value output.
 * @example
 * ```typescript
 * await jsdoc();
 * ```
 */
const jsdoc = async (): Promise<Linter.Config[]> => {
  const jsdocModule = await import("eslint-plugin-jsdoc");
  const { configs, rules } = jsdocModule.default;

  const availableRules = new Set(Object.keys(rules ?? {}));
  const customError = buildCustomErrorRules(availableRules);

  return defineConfig(
    configs["flat/recommended-typescript-error"],
    configs["flat/contents-typescript-error"],
    configs["flat/logical-typescript-error"],
    configs["flat/requirements-typescript-error"],
    configs["flat/stylistic-typescript-error"],
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
        "jsdoc/require-description": ["error", { contexts: requireJsdocContexts }],
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
};

export { jsdoc };

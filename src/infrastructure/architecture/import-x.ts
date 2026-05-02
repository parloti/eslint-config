import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build custom error rules for import-x plugin by excluding certain rules
 * and ensuring no overlap with existing configurations.
 * @returns Return value output.
 * @example
 * ```typescript
 * await buildCustomErrorRules();
 * ```
 */
async function buildCustomErrorRules(): Promise<Linter.Config[]> {
  const { flatConfigs, rules } = await import("eslint-plugin-import-x");
  const { recommended, typescript, warnings } = flatConfigs;

  const customIgnore = new Set([
    "dynamic-import-chunkname",
    "no-deprecated",
    "no-named-export",
    "no-namespace",
    "no-unused-modules",
    "order",
    "prefer-default-export",
  ]);

  const allConfigs = new Set(
    [warnings, recommended, typescript].flatMap((config) =>
      Object.keys(config.rules ?? {}),
    ),
  );

  const customError = Object.fromEntries(
    Object.keys(rules)
      .filter((rule) => !customIgnore.has(rule))
      .map((rule) => `import-x/${rule}`)
      .filter((rule) => !allConfigs.has(rule))
      .map((rule) => [rule, "error"] as const),
  );

  return [
    warnings,
    recommended,
    typescript,
    {
      name: "import-x/custom-error",
      rules: customError,
    },
  ];
}

/**
 * Loads the import-x plugin configuration.
 * @returns Return value output.
 * @example
 * ```typescript
 * await importX();
 * ```
 */
async function importX(): Promise<Linter.Config[]> {
  return defineConfig(
    ...(await buildCustomErrorRules()),
    {
      name: "import-x/custom-typescript",
      rules: {
        "import-x/no-relative-parent-imports": "off",
        "import-x/unambiguous": "off",
      },
    },
    {
      name: "import-x/custom-node_modules",
      rules: {
        "import-x/no-internal-modules": [
          "error",
          {
            allow: [
              "eslint/config",
              "eslint-plugin-boundaries/config",
              "eslint-plugin-prettier/recommended",
              "vitest/config",
              "@eslint-community/eslint-plugin-eslint-comments/configs",
            ],
          },
        ],
      },
    },
    {
      files: ["*", "packages/*/*"],
      name: "import-x/custom-root-config-files",
      rules: {
        "import-x/no-default-export": "off",
      },
    },
    {
      files: ["**/*.{spec,test,e2e}.ts"],
      rules: {
        "import-x/no-nodejs-modules": "off",
      },
    },
  );
}

export { importX };

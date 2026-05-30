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
  const { flatConfigs } = await import("eslint-plugin-import-x");
  const { recommended, typescript, warnings } = flatConfigs;

  return [
    warnings,
    recommended,
    typescript,
    {
      rules: {
        "import-x/no-internal-modules": [
          "error",
          { allow: ["**/node_modules/**"] },
        ],
      },
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
      files: ["*", "packages/*/*"],
      name: "import-x/custom-root-config-files",
      rules: {
        "import-x/no-default-export": "off",
      },
    },
    {
      files: ["**/*.{spec,test,e2e}.ts"],
      name: "import-x/custom-test-files",
      rules: {
        "import-x/no-nodejs-modules": "off",
      },
    },
  );
}

export { importX };

import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** TypeScript rule names to disable. */
const off = [
  "no-magic-numbers",
  "naming-convention",
  "no-use-before-define",
  "member-ordering",
  "prefer-readonly-parameter-types",
];

/** TypeScript rules disabled as a map. */
const customOff = Object.fromEntries(
  off.map((rule) => [`@typescript-eslint/${rule}`, "off"] as const),
);

/**
 * Build and return TypeScript-specific ESLint configs and rule adjustments.
 * @returns The TypeScript ESLint config array.
 * @example
 * ```typescript
 * const typescriptConfigs = await typescript();
 * ```
 */
export async function typescript(): Promise<Linter.Config[]> {
  const { configs } = await import("typescript-eslint");
  const { all } = configs;

  return defineConfig(
    all,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      name: "@typescript-eslint/deprecated",
      rules: {
        "@typescript-eslint/no-type-alias": "off",
        "@typescript-eslint/sort-type-constituents": "off",
      },
    },
    {
      name: "@typescript-eslint/custom",
      rules: {
        ...customOff,
        "@typescript-eslint/no-unsafe-type-assertion": "off",
        "@typescript-eslint/strict-boolean-expressions": [
          "error",
          {
            allowNullableEnum: false,
            allowNullableObject: false,
            allowNumber: false,
            allowString: false,
          },
        ],
        "@typescript-eslint/unified-signatures": [
          "error",
          { ignoreDifferentlyNamedParameters: true },
        ],
      },
    },
    {
      files: ["**/*.spec.ts", "**/*.e2e.ts"],
      name: "@typescript-eslint/custom-spec",
      rules: {
        "@typescript-eslint/init-declarations": "off",
        "@typescript-eslint/unbound-method": "off",
      },
    },
  );
}

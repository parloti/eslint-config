import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** File globs that TypeScript-specific linting applies to. */
const typescriptFileGlobs = ["**/*.ts"];

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
  const { strictTypeChecked, stylisticTypeChecked } = configs;

  return defineConfig(
    ...[strictTypeChecked, stylisticTypeChecked]
      .flat()
      .map((config) => ({ ...config, files: typescriptFileGlobs })),
    {
      files: typescriptFileGlobs,
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      files: ["**/*.{spec,test,e2e}.ts"],
      name: "Test files should allow unbound methods for better assertion flexibility",
      rules: { "@typescript-eslint/unbound-method": "off" },
    },
  );
}

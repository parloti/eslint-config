import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** File globs that Prettier linting applies to. */
const prettierFileGlobs = ["**/*.ts"];

/**
 * Return Prettier compatibility rules for ESLint when the config is available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await prettier();
 * ```
 */
export async function prettier(): Promise<Linter.Config[]> {
  const { default: eslintConfigPrettier } =
    await import("eslint-config-prettier/flat");

  return defineConfig({ ...eslintConfigPrettier, files: prettierFileGlobs });
}

import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** File globs that Prettier linting applies to. */
const prettierFileGlobs = ["**/*.ts"];

/**
 * Return Prettier integration configuration for ESLint when the plugin is available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await prettier();
 * ```
 */
export async function prettier(): Promise<Linter.Config[]> {
  const { default: recommended } =
    await import("eslint-plugin-prettier/recommended");

  return defineConfig({ ...recommended, files: prettierFileGlobs });
}

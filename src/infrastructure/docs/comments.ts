import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** File globs that eslint-comments linting applies to. */
const commentsFileGlobs = ["**/*.ts"];

/**
 * Resolve and return plugin configuration for eslint-comments when available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await comments();
 * ```
 */
export async function comments(): Promise<Linter.Config[]> {
  const { recommended } =
    await import("@eslint-community/eslint-plugin-eslint-comments/configs");

  return defineConfig({ ...recommended, files: commentsFileGlobs });
}

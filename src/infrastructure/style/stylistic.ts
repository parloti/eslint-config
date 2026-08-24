import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** File globs that Stylistic linting applies to. */
const stylisticFileGlobs = ["**/*.ts"];

/**
 * Return the stylistic plugin configuration and its recommended settings.
 * @returns Return value output.
 * @example
 * ```typescript
 * await stylistic();
 * ```
 */
export async function stylistic(): Promise<Linter.Config[]> {
  const stylisticModule = await import("@stylistic/eslint-plugin");
  const { default: plugin } = stylisticModule;

  return defineConfig(
    { ...plugin.configs.all, files: stylisticFileGlobs },
    {
      files: stylisticFileGlobs,
      rules: { "@stylistic/multiline-comment-style": "off" },
    },
  );
}

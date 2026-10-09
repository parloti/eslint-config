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
  const { default: plugin } = await import("@stylistic/eslint-plugin");

  return defineConfig(
    { ...plugin.configs.recommended, files: stylisticFileGlobs },
    {
      files: stylisticFileGlobs,
      name: "stylistic/custom",
      rules: { "@stylistic/multiline-comment-style": "off" },
    },
  );
}

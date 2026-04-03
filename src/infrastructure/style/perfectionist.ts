import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** Generated example and default-expression snippets emitted by the JSDoc processor. */
const generatedSnippetFiles = [
  "**/*.md/*.js",
  "**/*.jsdoc-defaults",
  "**/*.jsdoc-params",
  "**/*.jsdoc-properties",
];

/**
 * Build and return the Perfectionist plugin configuration and any overrides.
 * @returns Return value output.
 * @example
 * ```typescript
 * await perfectionist();
 * ```
 */
export async function perfectionist(): Promise<Linter.Config[]> {
  const { configs } = await import("eslint-plugin-perfectionist");
  const generatedSnippetRules = Object.fromEntries(
    Object.keys(configs["recommended-natural"].rules ?? {})
      .filter((ruleName) => ruleName.startsWith("perfectionist/"))
      .map((ruleName) => [ruleName, "off"] as const),
  );

  return defineConfig(
    configs["recommended-natural"],
    {
      name: "To avoid conflicts",
      rules: { "sort-keys": "off" },
    },
    {
      files: generatedSnippetFiles,
      name: "perfectionist/generated-snippets",
      rules: generatedSnippetRules,
    },
  );
}

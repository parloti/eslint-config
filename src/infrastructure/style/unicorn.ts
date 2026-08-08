import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build and return the Unicorn plugin configuration.
 * @returns Return value output.
 * @example
 * ```typescript
 * await unicorn();
 * ```
 */
export async function unicorn(): Promise<Linter.Config[]> {
  const unicornModule = await import("eslint-plugin-unicorn");
  const { configs } = unicornModule.default;

  return defineConfig(
    {
      extends: [configs.all],
      rules: {
        "unicorn/name-replacements": ["error", { ignore: [/dev/iu, /e2e/iu] }],
        "unicorn/no-asterisk-prefix-in-documentation-comments": "off",
      },
    },
    {
      files: ["**/explicit-null.ts"],
      name: "Allow explicit null",
      rules: { "unicorn/no-null": "off" },
    },
  );
}

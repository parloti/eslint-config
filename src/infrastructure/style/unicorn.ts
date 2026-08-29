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
      extends: [configs.recommended],
      files: ["**/*.ts"],
      rules: {
        "unicorn/comment-content": "off",
        "unicorn/consistent-arrow-return-style": "off",
        "unicorn/consistent-boolean-name": "off",
        "unicorn/consistent-class-member-order": "off",
        "unicorn/filename-case": [
          "error",
          { case: "kebabCase", ignore: ["^__tests__$"] },
        ],
        "unicorn/name-replacements": ["error", { ignore: [/dev/iu, /e2e/iu] }],
        "unicorn/no-non-function-verb-prefix": "off",
        "unicorn/prefer-iterator-concat": "off",
        "unicorn/single-line-block-comment-style": ["error", "single-line"],
      },
    },
    {
      files: ["**/*.spec.ts"],
      name: "codeperfect/assert-actual-expected-names precedence",
      rules: {
        "unicorn/consistent-boolean-name": ["error", { ignore: ["^actual"] }],
      },
    },
    {
      files: ["**/explicit-null.ts"],
      name: "Allow explicit null",
      rules: { "unicorn/no-null": "off" },
    },
  );
}

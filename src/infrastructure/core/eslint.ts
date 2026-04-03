import type { Linter } from "eslint";

import { configs } from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

/** Rules excluded from custom errors. */
const customIgnore = new Set([
  "capitalized-comments",
  "func-style",
  "no-magic-numbers",
  "no-ternary",
  "no-unused-vars",
  "no-use-before-define",
  "no-void",
  "no-warning-comments",
  "one-var",
  "sort-imports",
]);

/** Rules included in eslint:recommended. */
const recommended = new Set(Object.keys(configs.recommended.rules));

/** Error rules excluding ignored or recommended. */
const customError = Object.fromEntries(
  Object.keys(configs.all.rules)
    .filter((rule) => !customIgnore.has(rule))
    .filter((rule) => !recommended.has(rule))
    .map((rule) => [rule, "error"] as const),
);

/**
 * Assemble base configuration combining the official eslint-js recommendations with
 * project-specific overrides and linter options.
 * @returns Base ESLint config array.
 * @example
 * ```typescript
 * const base = eslint();
 * ```
 */
export function eslint(): Linter.Config[] {
  return defineConfig(
    configs.recommended,
    globalIgnores(
      ["**/dist/**", "docs/", "**/coverage"],
      "@eslint/js/custom-ignore-directory",
    ),
    {
      linterOptions: {
        reportUnusedDisableDirectives: "error",
        reportUnusedInlineConfigs: "error",
      },
    },
    {
      name: "@eslint/js/custom",
      rules: {
        ...customError,
        "new-cap": ["error", { capIsNewExceptionPattern: "^@" }],
        "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
      },
    },
    {
      files: ["**/*.spec.ts"],
      name: "@eslint/js/custom-spec",
      rules: {
        "init-declarations": "off",
        "max-lines-per-function": "off",
      },
    },
    {
      files: ["scripts/*.ts"],
      name: "@eslint/js/custom-scripts",
      rules: { "no-console": "off" },
    },
  );
}

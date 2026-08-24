import type { Linter } from "eslint";

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

/** File globs that core JavaScript linting applies to. */
const javascriptFileGlobs = ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"];

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
    { ...js.configs.recommended, files: javascriptFileGlobs },
    globalIgnores(
      [
        "**/dist",
        "**/temp",
        "**/tmp",
        "**/logs",
        "docs/",
        "packages/*/docs/",
        "apps/*/docs/",
        "**/coverage",
        "**/.stryker-tmp",
        "**/playwright-reports",
      ],
      "@eslint/js/custom-ignore-directory",
    ),
    {
      linterOptions: {
        reportUnusedDisableDirectives: "error",
        reportUnusedInlineConfigs: "error",
      },
    },
    {
      files: javascriptFileGlobs,
      name: "custom-eslint",
      rules: {
        "max-lines": ["error", { max: 300 }],
      },
    },
  );
}

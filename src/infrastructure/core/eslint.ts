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
    {
      linterOptions: {
        reportUnusedDisableDirectives: "error",
        reportUnusedInlineConfigs: "error",
      },
      name: "linter-options",
    },
    { ...js.configs.recommended, files: javascriptFileGlobs },
    {
      files: javascriptFileGlobs,
      name: "custom-eslint",
      rules: { "max-lines": ["error", { max: 300 }] },
    },
    globalIgnores(
      [
        "**/.angular/",
        "**/.stryker-tmp/",
        "**/coverage/",
        "**/dist/",
        "**/logs/",
        "**/playwright-reports/",
        "**/reports/",
        "**/temp/",
        "**/test-results/",
        "**/tmp/",
        "apps/*/docs/",
        "docs/",
        "packages/*/docs/",
      ],
      "@eslint/js/custom-ignore-directory",
    ),
  );
}

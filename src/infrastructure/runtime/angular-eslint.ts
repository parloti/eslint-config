import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load Angular ESLint plugin configuration when available.
 * Enables both ts-recommended and template-recommended presets.
 * @returns Return value output.
 * @example
 * ```typescript
 * const configs = await angularEslint();
 * ```
 */
export async function angularEslint(): Promise<Linter.Config[]> {
  const { configs, processInlineTemplates } = await import("angular-eslint");

  return defineConfig(
    {
      extends: [configs.tsRecommended],
      files: ["**/*.ts"],
      name: "angular-eslint/ts-recommended",
      processor: processInlineTemplates ?? {},
    },
    {
      extends: [configs.templateRecommended, configs.templateAccessibility],
      files: ["**/*.html"],
      name: "angular-eslint/template-recommended",
    },
  );
}

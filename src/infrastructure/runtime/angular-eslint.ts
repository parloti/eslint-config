import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/** Angular ESLint plugin surface consumed by the config loader. */
interface AngularEslintPluginSurface {
  /** Upstream flat presets keyed by preset name. */
  configs: Record<string, Linter.Config>;
}

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
  const tsPluginModule = await import("@angular-eslint/eslint-plugin");
  const templatePluginModule =
    await import("@angular-eslint/eslint-plugin-template");

  const tsPlugin =
    tsPluginModule.default as unknown as AngularEslintPluginSurface;
  const templatePlugin =
    templatePluginModule.default as unknown as AngularEslintPluginSurface;

  const tsRecommended = tsPlugin.configs[
    "recommended"
  ] as unknown as Linter.Config;
  const templateRecommended = templatePlugin.configs[
    "recommended"
  ] as unknown as Linter.Config;

  return defineConfig(
    {
      extends: [tsRecommended],
      files: ["**/*.ts"],
      ignores: ["**/*.spec.ts"],
      name: "angular-eslint/ts-recommended",
    },
    {
      extends: [templateRecommended],
      files: ["**/*.component.html"],
      name: "angular-eslint/template-recommended",
    },
  );
}

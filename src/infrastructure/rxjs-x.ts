import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build and return rxjs-x plugin configurations with package-level adjustments.
 * @returns Return value output.
 * @example
 * ```typescript
 * await rxjsX();
 * ```
 */
export async function rxjsX(): Promise<Linter.Config[]> {
  const pluginModule = await import("eslint-plugin-rxjs-x");

  return defineConfig(
    pluginModule.default.configs.strict as Linter.Config,
    {
      name: "rxjs-x/custom",
      rules: {
        "rxjs-x/no-ignored-default-value": "off",
        "rxjs-x/no-subclass": "off",
        "rxjs-x/no-unbound-methods": "off",
      },
    },
    {
      files: ["**/*.spec.ts"],
      name: "rxjs-x/custom-spec",
      rules: {
        "rxjs-x/no-ignored-error": "off",
      },
    },
  );
}

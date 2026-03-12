import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Return Jasmine-specific ESLint configurations when the plugin is installed.
 * @returns Return value output.
 * @example
 * ```typescript
 * await jasmine();
 * ```
 */
export async function jasmine(): Promise<Linter.Config[]> {
  const jasmineModule = await import("eslint-plugin-jasmine");
  const globalsModule = await import("globals");
  const { configs, rules } = jasmineModule;
  const { jasmine: globals } = globalsModule;

  const customError = Object.fromEntries(
    Object.keys(rules).map((rule) => [`jasmine/${rule}`, "error"] as const),
  );

  return defineConfig({
    extends: [configs.recommended],
    files: ["**/*.spec.ts"],
    languageOptions: { globals },
    name: "jasmine/custom",
    plugins: { jasmine: { rules } },
    rules: customError,
  });
}

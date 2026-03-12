import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build and return Playwright-specific ESLint configs and rule adjustments.
 * @returns Return value output.
 * @example
 * ```typescript
 * await playwright();
 * ```
 */
async function playwright(): Promise<Linter.Config[]> {
  const playwrightModule = await import("eslint-plugin-playwright");
  const { configs, rules } = playwrightModule.default;

  const customIgnore = new Set([""]);

  const { rules: recommendedRules = {} } = configs["flat/recommended"];
  const allConfigs = new Set(Object.keys({ ...recommendedRules }));

  const customError = Object.fromEntries(
    Object.keys(rules)
      .filter((rule) => !customIgnore.has(rule))
      .map((rule) => `playwright/${rule}`)
      .filter((rule) => !allConfigs.has(rule))
      .map((rule) => [rule, "error"] as const),
  );

  return defineConfig({
    extends: [configs["flat/recommended"]],
    files: ["e2e/**/*.{spec,test}.{ts,js}"],
    name: "playwright/custom-error",
    rules: customError,
  });
}

export { playwright };

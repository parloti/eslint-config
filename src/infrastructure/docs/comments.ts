import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Resolve and return plugin configuration for eslint-comments when available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await comments();
 * ```
 */
export async function comments(): Promise<Linter.Config[]> {
  const eslintCommentsModule =
    await import("@eslint-community/eslint-plugin-eslint-comments");
  const eslintCommentsConfigs =
    await import("@eslint-community/eslint-plugin-eslint-comments/configs");
  const { rules } = eslintCommentsModule;
  const { recommended } = eslintCommentsConfigs;

  const customIgnore = new Set(["no-use"]);
  const recommendedRules = new Set(Object.keys(recommended.rules ?? {}));

  const customError = Object.fromEntries(
    Object.keys(rules)
      .filter((rule) => !customIgnore.has(rule))
      .map((rule) => `@eslint-community/eslint-comments/${rule}`)
      .filter((rule) => !recommendedRules.has(rule))
      .map((rule) => [rule, "error"] as const),
  );

  return defineConfig(recommended, {
    name: "@eslint-community/eslint-comments/custom",
    rules: {
      ...customError,
      "@eslint-community/eslint-comments/disable-enable-pair": "off",
    },
  });
}

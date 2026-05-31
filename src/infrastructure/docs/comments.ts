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
  const eslintCommentsConfigs =
    await import("@eslint-community/eslint-plugin-eslint-comments/configs");
  const { recommended } = eslintCommentsConfigs;

  return defineConfig(recommended);
}

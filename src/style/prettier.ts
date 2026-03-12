import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Return Prettier integration configuration for ESLint when the plugin is available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await prettier();
 * ```
 */
export async function prettier(): Promise<Linter.Config[]> {
  const recommendedModule = await import("eslint-plugin-prettier/recommended");
  const { default: recommended } = recommendedModule;

  return defineConfig(recommended);
}

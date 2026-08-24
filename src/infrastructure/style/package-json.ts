import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load eslint-package-json configuration when available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await packageJson();
 * ```
 */
export async function packageJson(): Promise<Linter.Config[]> {
  const { default: pluginModule } = await import("eslint-package-json");

  return defineConfig(pluginModule.configs.recommended);
}

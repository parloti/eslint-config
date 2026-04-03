import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load the upstream CodePerfect ESLint configuration.
 * @returns The upstream CodePerfect config array.
 * @example
 * ```typescript
 * const configs = await codeperfect();
 * ```
 */
export async function codeperfect(): Promise<Linter.Config[]> {
  const pluginModule = await import("@codeperfect/eslint-plugin");

  return defineConfig(pluginModule.all);
}

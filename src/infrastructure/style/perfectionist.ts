import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build and return the Perfectionist plugin configuration and any overrides.
 * @returns Return value output.
 * @example
 * ```typescript
 * await perfectionist();
 * ```
 */
export async function perfectionist(): Promise<Linter.Config[]> {
  const { configs } = await import("eslint-plugin-perfectionist");

  return defineConfig(configs["recommended-natural"], {
    name: "perfectionist/avoid-conflict-with-eslint",
    rules: { "sort-keys": "off" },
  });
}

import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load Jest plugin configuration when available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await jest();
 * ```
 */
export async function jest(): Promise<Linter.Config[]> {
  const { configs } = await import("eslint-plugin-jest");

  return defineConfig({
    extends: [configs["flat/all"]],
    name: "jest/custom",
    rules: {
      "jest/prefer-expect-assertions": "off",
    },
  });
}

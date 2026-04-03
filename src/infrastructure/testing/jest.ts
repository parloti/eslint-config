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

  return defineConfig(
    {
      extends: [configs["flat/all"]],
      files: ["**/integration/jest/**/*.spec.ts"],
      name: "jest/custom",
      rules: {
        "jest/prefer-expect-assertions": "off",
      },
    },
    {
      files: ["**/integration/jest-global/**/*.spec.ts"],
      name: "jest/custom-global-overrides",
      rules: {
        "jest/prefer-importing-jest-globals": "off",
      },
    },
  );
}

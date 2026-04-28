import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load Vitest plugin configuration for end-to-end tests.
 * @returns Return value output.
 * @example
 * ```typescript
 * await vitestE2e();
 * ```
 */
export async function vitestE2e(): Promise<Linter.Config[]> {
  const vitestModule = await import("@vitest/eslint-plugin");
  const plugin = vitestModule.default;
  const allConfig = plugin.configs.all;

  return defineConfig(
    { settings: { vitest: { typecheck: true } } },
    {
      extends: [allConfig],
      files: ["tests/e2e/**/*.ts"],
      name: "vitest-e2e/custom",
      rules: {
        "vitest/consistent-test-filename": [
          "error",
          { pattern: String.raw`.*\.e2e\.ts$` },
        ],
        "vitest/no-hooks": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/require-mock-type-parameters": "off",
        "vitest/unbound-method": "off",
      },
    },
  );
}

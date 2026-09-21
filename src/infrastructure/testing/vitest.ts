import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load Vitest plugin configuration when available.
 * @returns Return value output.
 * @example
 * ```typescript
 * await vitest();
 * ```
 */
export async function vitest(): Promise<Linter.Config[]> {
  const vitestModule = await import("@vitest/eslint-plugin");
  const plugin = vitestModule.default;

  return defineConfig(
    {
      ...plugin.configs.recommended,
      files: ["**/*.{spec,test,e2e}.ts"],
      ignores: ["**/tests/e2e/**/*.ts"],
    },
    {
      files: ["**/*.{spec,test,e2e}.ts"],
      ignores: ["**/tests/e2e/**/*.ts"],
      name: "vitest/custom",
      rules: {
        "vitest/consistent-test-filename": [
          "error",
          { pattern: String.raw`.*\.spec\.ts$` },
        ],
        "vitest/no-hooks": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/require-mock-type-parameters": "off",
        "vitest/unbound-method": "off",
      },
      settings: { vitest: { typecheck: true } },
    },
  );
}

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
  const plugin = (
    vitestModule as {
      /** Default helper value. */
      default?: {
        /** Configs helper value. */
        configs?: {
          /** All helper value. */
          all?: Linter.Config;
        };
      };
    }
  ).default;
  const allConfig = plugin?.configs?.all;

  if (allConfig === void 0) {
    return [];
  }

  return defineConfig(
    { settings: { vitest: { typecheck: true } } },
    {
      extends: [allConfig],
      files: ["**/*.{spec,test}.ts"],
      name: "vitest/custom",
      rules: {
        "vitest/consistent-test-filename": [
          "error",
          { pattern: String.raw`.*\.spec\.[tj]sx?$` },
        ],
        "vitest/no-hooks": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/require-mock-type-parameters": "off",
      },
    },
  );
}

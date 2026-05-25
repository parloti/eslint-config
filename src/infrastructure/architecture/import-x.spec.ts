import type { Linter } from "eslint";
import type * as importXModuleType from "eslint-plugin-import-x";

import { describe, expect, it, vi } from "vitest";

/** Module namespace type for eslint-plugin-import-x mocks. */
type ImportXModule = typeof importXModuleType;

/**
 * Load the import-x config under test after module mocking.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * await loadImportXConfigs();
 * ```
 */
async function loadImportXConfigs(): Promise<Linter.Config[]> {
  const { importX } = await import(".");

  return importX();
}

describe("import-x branch coverage", () => {
  it("exposes the custom node_modules allowlist", async () => {
    // Arrange
    vi.doMock(
      import("eslint-plugin-import-x"),
      () =>
        ({
          flatConfigs: {
            recommended: { rules: { "import-x/no-duplicates": "warn" } },
            typescript: { rules: {} },
            warnings: { rules: void 0 },
          },
          rules: {
            "no-default-export": {},
            "no-duplicates": {},
            "some-extra": {},
          },
        }) as unknown as Partial<ImportXModule>,
    );

    // Act
    const actualCustomNodeModulesConfig = await loadImportXConfigs().then(
      (configs) =>
        configs.find(
          (config) => config.name === "import-x/custom-node_modules",
        ),
    );

    // Assert
    expect(actualCustomNodeModulesConfig).toMatchObject({
      name: "import-x/custom-node_modules",
      rules: {
        "import-x/no-internal-modules": [
          "error",
          {
            allow: [
              "eslint/config",
              "eslint-plugin-boundaries/config",
              "eslint-plugin-prettier/recommended",
              "vitest/config",
              "@eslint-community/eslint-plugin-eslint-comments/configs",
            ],
          },
        ],
      },
    });
  });
});

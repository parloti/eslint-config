import type { Linter } from "eslint";
import type * as importXModuleType from "eslint-plugin-import-x";

import { describe, expect, it, vi } from "vitest";

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
      createMockProxy<typeof importXModuleType>({
        flatConfigs: {
          recommended: { rules: { "import-x/no-duplicates": "warn" } },
          typescript: { rules: {} },
          warnings: { rules: {} },
        },
        rules: {
          "no-default-export": {},
          "no-duplicates": {},
        },
      }),
    );

    // Act
    const { actualCustomNodeModulesConfig } = await (async () => {
      const configs = await loadImportXConfigs();

      return {
        actualCustomNodeModulesConfig: configs.find(
          (config) => config.name === "import-x/custom-test-files",
        ),
      };
    })();

    // Assert
    expect(actualCustomNodeModulesConfig).toMatchObject({
      files: ["**/*.{spec,test,e2e}.ts"],
      name: "import-x/custom-test-files",
      rules: {
        "import-x/no-nodejs-modules": "off",
      },
    });
  });
});

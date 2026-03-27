import type { Linter } from "eslint";
import type * as importXModuleType from "eslint-plugin-import-x";

import { afterEach, describe, expect, it, vi } from "vitest";

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
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("eslint-plugin-import-x");
  });

  it("handles configs without rules", async () => {
    // Arrange
    vi.resetModules();
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
    const configs = await loadImportXConfigs();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "import-x/custom-error"),
    ).toBe(true);
  });
});

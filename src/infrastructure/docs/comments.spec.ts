import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

/** Mock inputs used for the eslint-comments module tests. */
interface ICommentsModuleMockOptions {
  /** Mocked recommended config returned by the upstream package. */
  recommended: Linter.Config;
}

/**
 * Load the docs module and return its comments config output.
 * @returns The comments config array.
 * @example
 * ```typescript
 *  console.log("loadCommentsConfigs");
 * ```
 */
async function loadCommentsConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import("./comments");

  return documentationModule.comments();
}

/**
 * Mock the eslint-comments modules for one test.
 * @param options The mocked module inputs.
 * @example
 * ```typescript
 *  mockCommentsModules({ recommended: {}, rules: {} });
 * ```
 */
function mockCommentsModules(options: ICommentsModuleMockOptions): void {
  vi.doMock(
    import("@eslint-community/eslint-plugin-eslint-comments/configs"),
    () => {
      return {
        recommended: options.recommended,
      };
    },
  );
}

describe("comments config", () => {
  it("returns the recommended preset", async () => {
    // Arrange
    const recommended: Linter.Config = {
      name: "@eslint-community/eslint-comments/recommended",
      rules: {
        "@eslint-community/eslint-comments/no-unused-disable": "error",
      },
    };

    mockCommentsModules({
      recommended,
    });

    // Act
    const actualLoadedConfigs = await loadCommentsConfigs();

    // Assert
    expect(actualLoadedConfigs).toStrictEqual([recommended]);
  });

  it("handles eslint-comments config without rules", async () => {
    // Arrange
    mockCommentsModules({
      recommended: {},
    });

    // Act
    const actualLoadedConfigs = await loadCommentsConfigs();

    // Assert
    expect(actualLoadedConfigs).toStrictEqual([{}]);
  });
});

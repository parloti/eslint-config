import type * as eslintCommentsModuleType from "@eslint-community/eslint-plugin-eslint-comments";
import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

/** Mock inputs used for the eslint-comments module tests. */
interface ICommentsModuleMockOptions {
  /** Mocked recommended config returned by the upstream package. */
  recommended: Linter.Config;
  /** Mocked rule registry returned by the upstream plugin. */
  rules: Record<string, unknown>;
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
  vi.doMock(import("@eslint-community/eslint-plugin-eslint-comments"), () => {
    return {
      rules: options.rules,
    } as unknown as Partial<typeof eslintCommentsModuleType>;
  });
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
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments");
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments/configs");
  });

  it("adds repo-owned rules on top of the recommended preset", async () => {
    // Arrange
    mockCommentsModules({
      recommended: {
        rules: {
          "@eslint-community/eslint-comments/no-unused-disable": "error",
        },
      },
      rules: {
        "no-inline-disable": {},
        "no-unused-disable": {},
        "no-use": {},
      },
    });

    // Act
    const { customConfig, recommendedConfig } =
      await loadCommentsConfigs().then((loadedConfigs) => ({
        customConfig: loadedConfigs.at(1),
        recommendedConfig: loadedConfigs.at(0),
      }));

    // Assert
    expect(recommendedConfig?.rules).toMatchObject({
      "@eslint-community/eslint-comments/no-unused-disable": "error",
    });

    expect(customConfig).toMatchObject({
      name: "@eslint-community/eslint-comments/custom",
      rules: {
        "@eslint-community/eslint-comments/disable-enable-pair": "off",
        "@eslint-community/eslint-comments/no-inline-disable": "error",
      },
    });
    expect(customConfig?.rules).not.toHaveProperty(
      "@eslint-community/eslint-comments/no-unused-disable",
    );
    expect(customConfig?.rules).not.toHaveProperty(
      "@eslint-community/eslint-comments/no-use",
    );
  });

  it("handles eslint-comments config without rules", async () => {
    // Arrange
    mockCommentsModules({
      recommended: {},
      rules: {},
    });

    // Act
    const { configsLength, customConfig } = await loadCommentsConfigs().then(
      (loadedConfigs) => ({
        configsLength: loadedConfigs.length,
        customConfig: loadedConfigs.at(1),
      }),
    );

    // Assert
    expect(configsLength).toBe(2);
    expect(customConfig).toMatchObject({
      name: "@eslint-community/eslint-comments/custom",
      rules: {
        "@eslint-community/eslint-comments/disable-enable-pair": "off",
      },
    });
  });
});

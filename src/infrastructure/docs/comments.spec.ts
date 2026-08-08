import type * as eslintCommentsModuleType from "@eslint-community/eslint-plugin-eslint-comments";
import type { RuleDefinition } from "@eslint/core";
import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

/**
 * Load the docs module and return its comments config output.
 * @returns The comments config array.
 * @example
 * ```typescript
 * console.log("loadCommentsConfigs");
 * ```
 */
async function loadCommentsConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import("./comments");

  return documentationModule.comments();
}

/**
 * Mock the eslint-comments modules for one test.
 * @param recommended The recommended ESLint comments configuration.
 * @param rules The custom ESLint comments rules.
 * @example
 * ```typescript
 * mockCommentsModules({ recommended: {}, rules: {} });
 * ```
 */
function mockCommentsModules(
  recommended: Linter.Config,
  rules: Record<string, RuleDefinition>,
): void {
  vi.doMock(
    import("@eslint-community/eslint-plugin-eslint-comments"),
    createMockProxy<typeof eslintCommentsModuleType>({
      rules,
    }),
  );
  vi.doMock(
    import("@eslint-community/eslint-plugin-eslint-comments/configs"),
    () => {
      return {
        recommended,
      };
    },
  );
}

describe("comments config", () => {
  it("adds repo-owned rules on top of the recommended preset", async () => {
    // Arrange
    mockCommentsModules(
      {
        rules: {
          "@eslint-community/eslint-comments/no-unused-disable": "error",
        },
      },
      {
        "no-inline-disable": {} as RuleDefinition,
        "no-unused-disable": {} as RuleDefinition,
        "no-use": {} as RuleDefinition,
      },
    );

    // Act
    const { customConfig, recommendedConfig } = await (async () => {
      const configs = await loadCommentsConfigs();

      return {
        customConfig: configs.at(1),
        recommendedConfig: configs.at(0),
      };
    })();

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
    mockCommentsModules({}, {});

    // Act
    const { configsLength, customConfig } = await (async () => {
      const configs = await loadCommentsConfigs();

      return {
        configsLength: configs.length,
        customConfig: configs.at(1),
      };
    })();

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

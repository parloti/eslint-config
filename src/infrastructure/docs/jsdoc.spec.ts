import type { RuleDefinition } from "@eslint/core";
import type { Linter } from "eslint";
import type * as jsdocModuleType from "eslint-plugin-jsdoc";

import { describe, expect, it, vi } from "vitest";

/**
 * Load the docs module and return its JSDoc config output.
 * @returns The JSDoc config array.
 * @example
 * ```typescript
 * console.log("loadJsdocConfigs");
 * ```
 */
async function loadJsdocConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import("./jsdoc");

  return documentationModule.jsdoc();
}

/**
 * Mock the JSDoc plugin module for one loader test.
 * @param configs The mocked configs for the JSDoc plugin.
 * @param rules The mocked rules for the JSDoc plugin.
 * @example
 * ```typescript
 * mockJsdocModule({ configs: {}, rules: {} });
 * ```
 */
function mockJsdocModule(
  configs: (typeof jsdocModuleType)["default"]["configs"],

  rules: Record<string, RuleDefinition>,
): void {
  vi.doMock(
    import("eslint-plugin-jsdoc"),
    createMockProxy<typeof jsdocModuleType>({ default: { configs, rules } }),
  );
}

describe("jsdoc loader", () => {
  it("loads repo-owned configs from the upstream plugin shape", async () => {
    // Arrange
    mockJsdocModule(
      {
        "flat/recommended-typescript-error": {
          name: "flat/recommended-typescript-error",
        },
      } as (typeof jsdocModuleType)["default"]["configs"],
      {
        "require-throws": {} as RuleDefinition,
        "sort-tags": {} as RuleDefinition,
      },
    );

    // Act
    const { customRulesConfig, hasRecommendedPreset } = await (async () => {
      const configs = await loadJsdocConfigs();

      return {
        customRulesConfig: configs.find(
          (config) => config.name === "jsdoc/custom",
        ),
        hasRecommendedPreset: configs.some(
          (config) => config.name === "flat/recommended-typescript-error",
        ),
      };
    })();

    // Assert
    expect(hasRecommendedPreset).toBe(true);
    expect(customRulesConfig?.rules).toMatchObject({
      "jsdoc/require-throws": "error",
      "jsdoc/sort-tags": "error",
    });
  });
});

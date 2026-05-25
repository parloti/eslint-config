import type { Linter } from "eslint";
import type * as jsdocModuleType from "eslint-plugin-jsdoc";

import { describe, expect, it, vi } from "vitest";

/** Options for mocking the JSDoc plugin module. */
interface IJsdocModuleMockOptions {
  /** Mocked upstream JSDoc preset config map. */
  jsdocConfigs: Record<string, unknown>;
  /** Mocked upstream JSDoc rules map. */
  jsdocRules: Record<string, unknown> | undefined;
}

/**
 * Load the docs module and return its JSDoc config output.
 * @returns The JSDoc config array.
 * @example
 * ```typescript
 *  console.log("loadJsdocConfigs");
 * ```
 */
async function loadJsdocConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import("./jsdoc");

  return documentationModule.jsdoc();
}

/**
 * Mock the JSDoc plugin module for one loader test.
 * @param options The mocked module inputs.
 * @example
 * ```typescript
 *  mockJsdocModule({ jsdocConfigs: {}, jsdocRules: {} });
 * ```
 */
function mockJsdocModule(options: IJsdocModuleMockOptions): void {
  vi.doMock(import("eslint-plugin-jsdoc"), () => {
    return {
      default: {
        configs: options.jsdocConfigs,
        rules: options.jsdocRules,
      },
    } as unknown as Partial<typeof jsdocModuleType>;
  });
}

describe("jsdoc loader", () => {
  it("loads repo-owned configs from the upstream plugin shape", async () => {
    // Arrange
    mockJsdocModule({
      jsdocConfigs: {
        "flat/recommended-typescript-error": {
          name: "flat/recommended-typescript-error",
        },
      },
      jsdocRules: {
        "require-throws": {},
        "sort-tags": {},
      },
    });

    // Act
    const { customRulesConfig, hasRecommendedPreset } =
      await loadJsdocConfigs().then((configs) => ({
        customRulesConfig: configs.find(
          (config) => config.name === "jsdoc/custom",
        ),
        hasRecommendedPreset: configs.some(
          (config) => config.name === "flat/recommended-typescript-error",
        ),
      }));

    // Assert
    expect(hasRecommendedPreset).toBe(true);

    expect(customRulesConfig?.rules).toMatchObject({
      "jsdoc/require-throws": "error",
      "jsdoc/sort-tags": "error",
    });
  });
});

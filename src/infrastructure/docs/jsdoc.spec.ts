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
 * @example
 * ```typescript
 * mockJsdocModule({});
 * ```
 */
function mockJsdocModule(configs: Record<string, Linter.Config>): void {
  vi.doMock(
    import("eslint-plugin-jsdoc"),
    createMockProxy<typeof jsdocModuleType>({
      default: { configs },
    }),
  );
}

describe("jsdoc loader", () => {
  it("loads the upstream flat preset configs", async () => {
    // Arrange
    mockJsdocModule({
      "flat/contents-typescript-error": {
        name: "jsdoc/contents-typescript-error",
        rules: {
          "jsdoc/check-indentation": "error",
        },
      },
      "flat/logical-typescript-error": {
        name: "jsdoc/logical-typescript-error",
        rules: {
          "jsdoc/require-returns": "error",
        },
      },
      "flat/requirements-typescript-error": {
        name: "jsdoc/requirements-typescript-error",
        rules: {
          "jsdoc/require-param": "error",
        },
      },
      "flat/stylistic-typescript-error": {
        name: "jsdoc/stylistic-typescript-error",
        rules: {
          "jsdoc/check-alignment": "error",
        },
      },
    });

    // Act
    const { customConfig, presetNames } = await (async () => {
      const configs = await loadJsdocConfigs();

      return {
        customConfig: configs.find((config) => config.name === "jsdoc/custom"),
        presetNames: configs.map((config) => config.name),
      };
    })();

    // Assert
    expect(presetNames).toStrictEqual([
      "jsdoc/custom > jsdoc/contents-typescript-error",
      "jsdoc/custom > jsdoc/logical-typescript-error",
      "jsdoc/custom > jsdoc/requirements-typescript-error",
      "jsdoc/custom > jsdoc/stylistic-typescript-error",
      "jsdoc/custom",
    ]);
    expect(customConfig).toMatchObject({
      files: ["**/*.ts"],
      name: "jsdoc/custom",
    });
  });
});

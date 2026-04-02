import { describe, expect, it } from "vitest";

import type { BoundariesConfig, ConfigOptions } from "./types";

/**
 * Read the explicit plugin states from the public config options.
 * @param configOptions The config options under test.
 * @returns The plugin state overrides.
 * @example
 * ```typescript
 * readPluginStates({ plugins: { jest: true } });
 * ```
 */
function readPluginStates(
  configOptions: ConfigOptions,
): ConfigOptions["plugins"] {
  return configOptions.plugins;
}

describe("types", () => {
  it("exports the public config option types", () => {
    // Arrange
    const configOptions: ConfigOptions = {
      plugins: { jest: true, vitest: false },
    };
    const boundariesConfig: BoundariesConfig = {
      elements: [],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    };

    // Act
    const actualPluginStates = readPluginStates(configOptions);

    // Assert
    expect({
      elementCount: boundariesConfig.elements.length,
      elementTypeCount: Array.isArray(boundariesConfig.elementTypes)
        ? boundariesConfig.elementTypes.length
        : 0,
      fileCount: boundariesConfig.files.length,
      pluginStates: actualPluginStates,
    }).toStrictEqual({
      elementCount: 0,
      elementTypeCount: 2,
      fileCount: 1,
      pluginStates: { jest: true, vitest: false },
    });
  });
});

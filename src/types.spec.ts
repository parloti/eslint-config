import { describe, expect, it } from "vitest";

import type { BoundariesConfig, ConfigOptions } from "./types";

/**
 * Read the first disabled plugin name from the public config options.
 * @param configOptions The config options under test.
 * @returns The first disabled plugin name.
 * @example
 * ```typescript
 * readDisabledPluginName({ disabledPlugins: ["jest"] });
 * ```
 */
function readDisabledPluginName(
  configOptions: ConfigOptions,
): string | undefined {
  return configOptions.disabledPlugins?.[0];
}

describe("types", () => {
  it("exports the public config option types", () => {
    // Arrange
    const configOptions: ConfigOptions = {
      disabledPlugins: ["jest"],
    };
    const boundariesConfig: BoundariesConfig = {
      elements: [],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    };

    // Act
    const actualPluginName = readDisabledPluginName(configOptions);

    // Assert
    expect({
      elementCount: boundariesConfig.elements.length,
      elementTypeCount: Array.isArray(boundariesConfig.elementTypes)
        ? boundariesConfig.elementTypes.length
        : 0,
      fileCount: boundariesConfig.files.length,
      pluginName: actualPluginName,
      plugins: configOptions.disabledPlugins,
    }).toStrictEqual({
      elementCount: 0,
      elementTypeCount: 2,
      fileCount: 1,
      pluginName: "jest",
      plugins: ["jest"],
    });
  });
});

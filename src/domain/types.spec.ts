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
      extend: { ignores: ["fixtures/**/*.ts"] },
      ignores: ["src/**/*.spec.ts"],
    };

    // Act
    const actualPluginStates = readPluginStates(configOptions);

    // Assert
    expect({
      elementCount: boundariesConfig.elements?.length ?? 0,
      elementTypeCount: Array.isArray(boundariesConfig.elementTypes)
        ? boundariesConfig.elementTypes.length
        : 0,
      extensionIgnoreCount: boundariesConfig.extend?.ignores?.length ?? 0,
      fileCount: boundariesConfig.files?.length ?? 0,
      ignoreCount: boundariesConfig.ignores?.length ?? 0,
      pluginStates: actualPluginStates,
    }).toStrictEqual({
      elementCount: 0,
      elementTypeCount: 0,
      extensionIgnoreCount: 1,
      fileCount: 0,
      ignoreCount: 1,
      pluginStates: { jest: true, vitest: false },
    });
  });
});

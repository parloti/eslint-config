import { describe, expect, it } from "vitest";

import type { ConfigOptions } from "./types";

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

/**
 * Read package-scoped plugin profiles from the public config options.
 * @param configOptions The config options under test.
 * @returns The scoped plugin profiles.
 * @example
 * ```typescript
 * readScopedPlugins({
 *   scopedPlugins: [{ basePath: "packages/api", plugins: ["eslint"] }],
 * });
 * ```
 */
function readScopedPlugins(
  configOptions: ConfigOptions,
): ConfigOptions["scopedPlugins"] {
  return configOptions.scopedPlugins;
}

describe("types", () => {
  it("exports the public config option types", () => {
    // Arrange
    const configOptions: ConfigOptions = {
      plugins: { jest: true, vitest: false },
    };

    // Act
    const actualPluginStates = readPluginStates(configOptions);

    // Assert
    expect(actualPluginStates).toStrictEqual({ jest: true, vitest: false });
  });

  it("exports package-scoped plugin profile types", () => {
    // Arrange
    const configOptions: ConfigOptions = {
      scopedPlugins: [
        { basePath: "packages/api", plugins: ["eslint", "jest", "typescript"] },
      ],
    };

    // Act
    const actualScopedPlugins = readScopedPlugins(configOptions);

    // Assert
    expect(actualScopedPlugins).toStrictEqual([
      { basePath: "packages/api", plugins: ["eslint", "jest", "typescript"] },
    ]);
  });
});

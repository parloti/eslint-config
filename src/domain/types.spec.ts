import { describe, expect, it } from "vitest";

import type { ConfigOptions } from "./types";

/**
 * Read the explicit plugin states from the public config options.
 * @param configOptions The config options under test.
 * @returns The plugin state overrides.
 * @example
 * ```typescript
 * readPluginStates({ plugins: { "vitest-e2e": true } });
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
      plugins: { vitest: false, "vitest-e2e": true },
    };

    // Act
    const actualPluginStates = readPluginStates(configOptions);

    // Assert
    expect(actualPluginStates).toStrictEqual({
      vitest: false,
      "vitest-e2e": true,
    });
  });

  it("exports package-scoped plugin profile types", () => {
    // Arrange
    const configOptions: ConfigOptions = {
      scopedPlugins: [
        {
          basePath: "packages/api",
          plugins: ["eslint", "vitest-e2e", "typescript"],
        },
      ],
    };

    // Act
    const actualScopedPlugins = readScopedPlugins(configOptions);

    // Assert
    expect(actualScopedPlugins).toStrictEqual([
      {
        basePath: "packages/api",
        plugins: ["eslint", "vitest-e2e", "typescript"],
      },
    ]);
  });
});

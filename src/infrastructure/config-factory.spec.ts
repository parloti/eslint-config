import { afterEach, describe, expect, it, vi } from "vitest";

import type { PluginName } from "../domain";

import { moduleTaxonomy } from "../domain";
import { config } from "./config-factory";
import { isPluginDisabledByDefault } from "./plugin-state";

/** All plugin names from the taxonomy, used to disable every plugin. */
const allPlugins: PluginName[] = moduleTaxonomy.map(
  (entry) => entry.pluginName,
);

/** Explicitly disable every plugin through the public plugin-state API. */
const allPluginsDisabled = Object.fromEntries(
  allPlugins.map((pluginName) => [pluginName, false]),
);

/** All default-enabled plugins from the taxonomy. */
const defaultEnabledPlugins = allPlugins.filter(
  (pluginName) => !isPluginDisabledByDefault(pluginName),
);

describe("config-factory", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe(config, () => {
    it("returns an empty array when all plugins are disabled", async () => {
      // Arrange
      const expectedConfigs: [] = [];

      // Act
      const actualConfigs = await config({ plugins: allPluginsDisabled });

      // Assert
      expect(actualConfigs).toStrictEqual(expectedConfigs);
    });

    it("returns an empty array when every default-enabled plugin is explicitly set to false", async () => {
      // Arrange
      const expectedConfigs: [] = [];

      // Act
      const actualConfigs = await config({
        plugins: Object.fromEntries(
          defaultEnabledPlugins.map((pluginName) => [pluginName, false]),
        ),
      });

      // Assert
      expect(actualConfigs).toStrictEqual(expectedConfigs);
    });

    it("reports deprecated boundaries option input when present at runtime", async () => {
      // Arrange
      const stderrSpy = vi
        .spyOn(process.stderr, "write")
        .mockImplementation(() => true);

      const legacyOptions = {
        boundaries: {
          files: ["packages/*/src/**/*.ts"],
        },
        plugins: Object.fromEntries(
          defaultEnabledPlugins.map((pluginName) => [pluginName, false]),
        ),
      } as unknown as Parameters<typeof config>[0];

      // Act
      const actualConfigs = await config(legacyOptions);

      // Assert
      expect(actualConfigs).toStrictEqual([]);
      expect(stderrSpy).toHaveBeenCalledTimes(1);
      expect(stderrSpy.mock.calls[0]?.[0]).toContain(
        "Deprecated config option ignored: boundaries",
      );
    });
  });
});

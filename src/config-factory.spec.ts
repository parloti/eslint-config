import { afterEach, describe, expect, it, vi } from "vitest";

import type { PluginName } from "./types";

import { config } from "./config-factory";
import { moduleTaxonomy } from "./module-taxonomy";
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
  });
});

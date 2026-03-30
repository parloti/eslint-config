import { describe, expect, it } from "vitest";

import type { PluginName } from "./types";

import { config } from "./config-factory";
import { moduleTaxonomy } from "./module-taxonomy";

/** All plugin names from the taxonomy, used to disable every plugin. */
const allPlugins: PluginName[] = moduleTaxonomy.map(
  (entry) => entry.pluginName,
);

describe("config-factory", () => {
  describe(config, () => {
    it("returns an empty array when all plugins are disabled", async () => {
      // Arrange
      const expectedConfigs: [] = [];

      // Act
      const actualConfigs = await config({ disabledPlugins: allPlugins });

      // Assert
      expect(actualConfigs).toStrictEqual(expectedConfigs);
    });
  });
});

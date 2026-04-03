import { describe, expect, it } from "vitest";

import { moduleTaxonomy } from "../domain";
import { pluginLoaders } from "./plugin-loaders";

/** Documented plugin names derived from the taxonomy source. */
const documentedPluginNames = moduleTaxonomy
  .map((entry) => entry.pluginName)
  .toSorted();

describe("pluginLoaders", () => {
  it("covers every documented module in the taxonomy", () => {
    // Arrange
    const expectedPluginNames = documentedPluginNames;

    // Act
    const actualPluginNames = Object.keys(pluginLoaders).toSorted();

    // Assert
    expect(actualPluginNames).toStrictEqual(expectedPluginNames);
  });

  it("uses the documented load mode for every module", () => {
    // Arrange
    const expectedModes = {
      boundaries: "optional",
      codeperfect: "required",
      comments: "optional",
      eslint: "required",
      "import-x": "optional",
      jasmine: "optional",
      jest: "optional",
      jsdoc: "optional",
      perfectionist: "optional",
      playwright: "optional",
      prettier: "optional",
      resolver: "optional",
      "rxjs-x": "optional",
      stylistic: "optional",
      typescript: "required",
      unicorn: "optional",
      vitest: "optional",
    };

    // Act
    const actualModes = Object.fromEntries(
      Object.entries(pluginLoaders).map(([pluginName, entry]) => [
        pluginName,
        entry.mode,
      ]),
    );

    // Assert
    expect(actualModes).toStrictEqual(expectedModes);
  });
});

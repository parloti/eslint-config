import { describe, expect, it } from "vitest";

import { moduleTaxonomy } from "./module-taxonomy";

describe("moduleTaxonomy", () => {
  it("matches the documented composition order", () => {
    // Arrange
    const expectedPluginNames = [
      "codeperfect",
      "eslint",
      "resolver",
      "typescript",
      "import-x",
      "comments",
      "jsdoc",
      "jasmine",
      "jest",
      "playwright",
      "vitest",
      "vitest-e2e",
      "rxjs-x",
      "angular-eslint",
      "stylistic",
      "perfectionist",
      "package-json",
      "unicorn",
      "prettier",
      "boundaries",
    ];

    // Act
    const actualPluginNames = moduleTaxonomy.map((entry) => entry.pluginName);

    // Assert
    expect(actualPluginNames).toStrictEqual(expectedPluginNames);
  });
});

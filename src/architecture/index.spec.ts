import { describe, expect, it } from "vitest";

import type { BoundariesConfig } from "../types";

import { boundaries, importX } from ".";

describe("architecture configs", () => {
  it("returns boundaries configs when repository input is provided", () => {
    // Arrange
    const config: BoundariesConfig = {
      elements: [{ pattern: "src/app/**/*", type: "app" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    };

    // Act
    const actualHasElementTypesRule = boundaries(config).some((entry) =>
      Object.hasOwn(entry.rules ?? {}, "boundaries/element-types"),
    );

    // Assert
    expect(actualHasElementTypesRule).toBe(true);
  });

  it("returns import-x configs with custom entries", async () => {
    // Arrange
    const expectedNames = [
      "import-x/custom-error",
      "import-x/custom-typescript",
      "import-x/custom-node_modules",
      "import-x/custom-root-config-files",
    ];

    // Act
    const actualConfigNames = await importX().then((configs) =>
      configs.map((config) => config.name),
    );

    // Assert
    expect(actualConfigNames).toStrictEqual(
      expect.arrayContaining(expectedNames),
    );
  });
});

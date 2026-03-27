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
    const configs = boundaries(config);

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((entry) =>
        Object.hasOwn(entry.rules ?? {}, "boundaries/element-types"),
      ),
    ).toBe(true);
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
    const configs = await importX();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(
      expectedNames.every((name) =>
        configs.some((config) => config.name === name),
      ),
    ).toBe(true);
  });
});

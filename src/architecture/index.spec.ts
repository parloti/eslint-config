import { describe, expect, it } from "vitest";

import { boundaries, importX } from ".";

describe("architecture configs", () => {
  it("returns boundaries configs when repository input is provided", () => {
    const configs = boundaries({
      elements: [{ pattern: "src/app/**/*", type: "app" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    });

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) =>
        Object.hasOwn(config.rules ?? {}, "boundaries/element-types"),
      ),
    ).toBe(true);
  });

  it("returns import-x configs with custom entries", async () => {
    const configs = await importX();

    const expectedNames = [
      "import-x/custom-error",
      "import-x/custom-typescript",
      "import-x/custom-node_modules",
      "import-x/custom-root-config-files",
    ];

    expect(configs.length).toBeGreaterThan(0);
    expect(
      expectedNames.every((name) =>
        configs.some((config) => config.name === name),
      ),
    ).toBe(true);
  });
});

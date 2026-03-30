import { describe, expect, it } from "vitest";

import { jasmine } from "./jasmine";

describe("jasmine config", () => {
  it("returns configs", async () => {
    // Arrange
    const expectedConfigName = "jasmine/custom";

    // Act
    const actualHasExpectedConfig = await jasmine().then((configs) =>
      configs.some((config) => config.name === expectedConfigName),
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });
});

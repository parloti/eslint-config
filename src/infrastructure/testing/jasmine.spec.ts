import { describe, expect, it } from "vitest";

import { jasmine } from "./jasmine";

describe("jasmine config", () => {
  it("returns configs", async () => {
    // Arrange
    const expectedConfigName = "jasmine/custom";

    // Act
    const { hasExpectedConfig } = await (async () => {
      const configs = await jasmine();

      return {
        hasExpectedConfig: configs.some(
          (config) => config.name === expectedConfigName,
        ),
      };
    })();

    // Assert
    expect(hasExpectedConfig).toBe(true);
  });
});

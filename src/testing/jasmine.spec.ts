import { describe, expect, it } from "vitest";

import { jasmine } from "./jasmine";

describe("jasmine config", () => {
  it("returns configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await jasmine();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jasmine/custom")).toBe(
      true,
    );
  });
});

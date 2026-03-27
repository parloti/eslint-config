import { describe, expect, it } from "vitest";

import { comments } from "./comments";

describe("comments config", () => {
  it("returns custom configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await comments();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some(
        (config) => config.name === "@eslint-community/eslint-comments/custom",
      ),
    ).toBe(true);
  });
});

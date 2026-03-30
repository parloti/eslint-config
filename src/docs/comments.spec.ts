import { describe, expect, it } from "vitest";

import { comments } from "./comments";

describe("comments config", () => {
  it("returns custom configs", async () => {
    // Arrange
    const expectedConfigName = "@eslint-community/eslint-comments/custom";

    // Act
    const actualHasExpectedConfig = await comments().then((configs) =>
      configs.some((config) => config.name === expectedConfigName),
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });
});

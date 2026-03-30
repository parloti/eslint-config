import { describe, expect, it } from "vitest";

import { eslint } from "./eslint";

describe("eslint config", () => {
  it("returns custom configs", () => {
    // Arrange
    const expectedConfigName = "@eslint/js/custom";

    // Act
    const actualHasExpectedConfig = eslint().some(
      (config) => config.name === expectedConfigName,
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });
});

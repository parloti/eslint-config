import { describe, expect, it } from "vitest";

import { eslint } from "./eslint";

describe("eslint config", () => {
  it("returns custom configs", () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = eslint();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "@eslint/js/custom")).toBe(
      true,
    );
  });
});

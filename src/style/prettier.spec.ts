import { describe, expect, it } from "vitest";

import { prettier } from "./prettier";

describe("prettier config", () => {
  it("returns configs", async () => {
    // Arrange
    const minimumConfigCount = 1;

    // Act
    const configs = await prettier();

    // Assert
    expect(configs.length).toBeGreaterThanOrEqual(minimumConfigCount);
  });
});

import { describe, expect, it } from "vitest";

import { stylistic } from "./stylistic";

describe("stylistic config", () => {
  it("returns configs", async () => {
    // Arrange
    const minimumConfigCount = 1;

    // Act
    const configs = await stylistic();

    // Assert
    expect(configs.length).toBeGreaterThanOrEqual(minimumConfigCount);
  });
});

import { describe, expect, it } from "vitest";

import { stylistic } from "./stylistic";

describe("stylistic config", () => {
  it("returns configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await stylistic();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });
});

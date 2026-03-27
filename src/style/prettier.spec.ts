import { describe, expect, it } from "vitest";

import { prettier } from "./prettier";

describe("prettier config", () => {
  it("returns configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await prettier();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });
});

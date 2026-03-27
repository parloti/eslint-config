import { describe, expect, it } from "vitest";

import { resolver } from "./resolver";

describe("resolver config", () => {
  it("returns resolver settings", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await resolver();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs[0]?.settings).toBeDefined();
  });
});

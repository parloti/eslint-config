import { describe, expect, it } from "vitest";

import { resolver } from "./resolver";

describe("resolver config", () => {
  it("returns resolver settings", async () => {
    // Arrange
    const minimumConfigCount = 1;

    // Act
    const configs = await resolver();

    // Assert
    expect(configs.length).toBeGreaterThanOrEqual(minimumConfigCount);
    expect(configs[0]?.settings).toBeDefined();
  });
});

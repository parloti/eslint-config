import { describe, expect, it, vi } from "vitest";

import { rxjsX as getRxjsXConfig } from "./rxjs-x";

vi.mock(
  import("eslint-plugin-rxjs-x"),
  () =>
    ({
      default: {
        configs: { strict: {} },
      },
    }) as never,
);

describe("rxjs-x config", () => {
  it("returns custom configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await getRxjsXConfig();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "rxjs-x/custom")).toBe(
      true,
    );
  });
});

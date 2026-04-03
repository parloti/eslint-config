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
    const expectedConfigName = "rxjs-x/custom";

    // Act
    const actualHasExpectedConfig = await getRxjsXConfig().then((configs) =>
      configs.some((config) => config.name === expectedConfigName),
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });
});

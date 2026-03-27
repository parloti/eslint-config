import { describe, expect, it, vi } from "vitest";

import { rxjsX } from "./rxjs-x";

vi.mock(
  import("eslint-plugin-rxjs-x"),
  () =>
    ({
      default: {
        configs: {
          strict: { name: "rxjs-x/strict" },
        },
      },
    }) as unknown as Record<string, unknown>,
);

describe("domain configs", () => {
  it("returns rxjs-x configs with custom entries", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await rxjsX();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "rxjs-x/custom")).toBe(
      true,
    );
    expect(configs.some((config) => config.name === "rxjs-x/custom-spec")).toBe(
      true,
    );
  });
});

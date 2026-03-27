import { describe, expect, it } from "vitest";

/**
 * Check whether the playwright module exports a function builder.
 * @returns Whether the module exports a function builder.
 * @example
 * ```typescript
 * await hasPlaywrightBuilder();
 * ```
 */
async function hasPlaywrightBuilder(): Promise<boolean> {
  const moduleExports = await import("./playwright");

  return typeof moduleExports.playwright === "function";
}

describe("playwright config", () => {
  it("exports a config builder", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const isBuilderFunction = await hasPlaywrightBuilder();

    // Assert
    expect(isBuilderFunction).toBe(true);
  });
});

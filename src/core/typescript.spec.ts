import type _default from "typescript-eslint";

import { describe, expect, it, vi } from "vitest";

import { typescript } from "./typescript";

/** Type definition for rule data. */
type CompatibleConfigArray = TypescriptEslintModule["configs"]["all"];

/** Type definition for rule data. */
type TypescriptEslintModule = typeof _default;

/** Mocked typescript-eslint config namespace used by the module mock. */
const mockedTypescriptEslintConfigs = {
  all: [] as CompatibleConfigArray,
} as TypescriptEslintModule["configs"];

vi.mock(import("typescript-eslint"), () => ({
  configs: mockedTypescriptEslintConfigs,
}));

describe("typescript config", () => {
  it("returns custom configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await typescript();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "@typescript-eslint/custom"),
    ).toBe(true);
  });
});

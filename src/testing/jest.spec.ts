import type * as jestPluginModuleType from "eslint-plugin-jest";

import { describe, expect, it, vi } from "vitest";

import { jest } from "./jest";

/** Module namespace type for mocked Jest exports. */
type JestPluginModule = typeof jestPluginModuleType;

/** Mocked Jest config namespace used by the module mock. */
const mockedJestConfigs = {
  "flat/all": {},
} as JestPluginModule["configs"];

vi.mock(import("eslint-plugin-jest"), () => ({
  configs: mockedJestConfigs,
}));

describe("jest config", () => {
  it("returns configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await jest();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jest/custom")).toBe(true);
  });
});

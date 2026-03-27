import type _default from "typescript-eslint";

import { describe, expect, it, vi } from "vitest";

import { codeperfect } from "./codeperfect";
import { eslint } from "./eslint";
import * as core from "./index";
import { resolver } from "./resolver";
import { typescript } from "./typescript";

/** Type definition for mocked config array data. */
type CompatibleConfigArray = unknown[];

/** Module namespace type for mocked typescript-eslint exports. */
type TypescriptEslintModule = typeof _default;

/** Mocked typescript-eslint config namespace used by the module mock. */
const mockedTypescriptEslintConfigs = {
  all: [] as CompatibleConfigArray,
} as TypescriptEslintModule["configs"];

/**
 * Load whether the core builders are re-exported from the barrel.
 * @returns Equality results for the core builders.
 * @example
 * ```typescript
 * loadCoreExportMatches();
 * ```
 */
function loadCoreExportMatches(): boolean[] {
  return [
    core.codeperfect === codeperfect,
    core.codeperfect === codeperfect,
    core.eslint === eslint,
    core.eslint === eslint,
    core.resolver === resolver,
    core.resolver === resolver,
    core.typescript === typescript,
    core.typescript === typescript,
  ];
}

vi.mock(import("typescript-eslint"), () => ({
  configs: mockedTypescriptEslintConfigs,
}));

describe("core configs", () => {
  it("returns eslint configs with custom entries", () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = eslint();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "@eslint/js/custom")).toBe(
      true,
    );
    expect(
      configs.some((config) => config.name === "@eslint/js/custom-spec"),
    ).toBe(true);
  });

  it("returns resolver settings", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await resolver();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(configs[0]?.settings).toBeDefined();
  });

  it("returns typescript configs with custom entries", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await typescript();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "@typescript-eslint/custom"),
    ).toBe(true);
    expect(
      configs.some(
        (config) => config.name === "@typescript-eslint/custom-spec",
      ),
    ).toBe(true);
  });

  it("re-exports the core config builders", () => {
    // Arrange
    // (no setup needed)

    // Act
    const actualMatches = loadCoreExportMatches();

    // Assert
    expect(actualMatches).toStrictEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});

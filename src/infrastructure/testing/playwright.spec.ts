import type { Linter } from "eslint";
import type * as playwrightPluginModuleType from "eslint-plugin-playwright";

import { describe, expect, it, vi } from "vitest";

/** Mocked Playwright plugin shape used by the tests. */
interface IPlaywrightPluginMock {
  /** Mocked flat config registry. */
  configs: {
    /** Mocked recommended config entry. */
    "flat/recommended": Linter.Config;
  };
  /** Mocked rule registry. */
  rules: Record<string, unknown>;
}

/**
 * Load the Playwright config after module mocking.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * await loadPlaywrightConfigs();
 * ```
 */
async function loadPlaywrightConfigs(): Promise<Linter.Config[]> {
  const testingModule = await import("./playwright");

  return testingModule.playwright();
}

/**
 * Mock the Playwright plugin module for a single test.
 * @param plugin The mocked plugin shape.
 * @example
 * ```typescript
 * mockPlaywrightModule({ configs: { "flat/recommended": {} }, rules: {} });
 * ```
 */
function mockPlaywrightModule(plugin: IPlaywrightPluginMock): void {
  vi.doMock(
    import("eslint-plugin-playwright"),
    createMockProxy<typeof playwrightPluginModuleType>({
      default: plugin,
    } as typeof playwrightPluginModuleType),
  );
}

describe("playwright config", () => {
  it("returns the recommended preset scoped to e2e files", async () => {
    // Arrange
    const recommendedConfig: Linter.Config = {
      name: "playwright/flat-recommended",
      rules: { "playwright/expect-expect": "error" },
    };
    mockPlaywrightModule({
      configs: { "flat/recommended": recommendedConfig },
      rules: {},
    });

    // Act
    const { recommendedPreset } = await (async () => {
      const configs = await loadPlaywrightConfigs();

      return {
        recommendedPreset: configs.find(
          (config) => config.name === recommendedConfig.name,
        ),
      };
    })();

    // Assert
    expect(recommendedPreset).toMatchObject({
      files: ["tests/e2e/**/*.ts"],
      name: recommendedConfig.name,
      rules: { "playwright/expect-expect": "error" },
    });
  });

  it("does not emit extra custom-error configs", async () => {
    // Arrange
    mockPlaywrightModule({
      configs: { "flat/recommended": { rules: {} } },
      rules: {},
    });

    // Act
    const actualConfigs = await loadPlaywrightConfigs();

    // Assert
    expect(actualConfigs).toHaveLength(1);
    expect(
      actualConfigs.some((config) => config.name === "playwright/custom-error"),
    ).toBe(false);
  });
});

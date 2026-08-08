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
  it("returns repo-owned errors that are not already in the recommended preset", async () => {
    // Arrange
    const recommendedConfig: Linter.Config = {
      rules: {
        "playwright/no-focused-test": "error",
      },
    };
    mockPlaywrightModule({
      configs: {
        "flat/recommended": recommendedConfig,
      },
      rules: {
        "": {},
        "expect-expect": {},
        "no-focused-test": {},
      },
    });

    // Act
    const { customConfig } = await (async () => {
      const configs = await loadPlaywrightConfigs();

      return {
        customConfig: configs.find(
          (config) => config.name === "playwright/custom-error",
        ),
      };
    })();

    // Assert
    expect(customConfig).toMatchObject({
      files: ["tests/e2e/**/*.ts"],
      name: "playwright/custom-error",
      rules: {
        "playwright/expect-expect": "error",
      },
    });
    expect(customConfig?.rules).not.toHaveProperty(
      "playwright/no-focused-test",
    );
  });

  it("treats missing recommended rules as an empty rule set", async () => {
    // Arrange
    const recommendedConfig: Linter.Config = {};
    mockPlaywrightModule({
      configs: {
        "flat/recommended": recommendedConfig,
      },
      rules: {
        "expect-expect": {},
        "no-focused-test": {},
      },
    });

    // Act
    const { customConfig } = await (async () => {
      const configs = await loadPlaywrightConfigs();

      return {
        customConfig: configs.find(
          (config) => config.name === "playwright/custom-error",
        ),
      };
    })();

    // Assert
    expect(customConfig?.rules).toMatchObject({
      "playwright/expect-expect": "error",
      "playwright/no-focused-test": "error",
    });
  });
});

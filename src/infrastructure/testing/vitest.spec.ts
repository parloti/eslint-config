import type * as vitestPluginModuleType from "@vitest/eslint-plugin";
import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

/** Mocked Vitest plugin module shape used by import mocks. */
interface IVitestPluginMock {
  /** Default export used by the mocked module. */
  default:
    | undefined
    | {
        /** Mocked config registry. */
        configs?: {
          /** Mocked all preset. */
          all?: Linter.Config;
        };
      };
}

/**
 * Load the Vitest config under test after module mocking.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * await loadVitestConfigs();
 * ```
 */
async function loadVitestConfigs(): Promise<Linter.Config[]> {
  const { vitest } = await import("./vitest");

  return vitest();
}

/**
 * Mock the Vitest plugin module for a single test.
 * @param pluginModule The mocked Vitest plugin module.
 * @example
 * ```typescript
 * mockVitestPlugin({ default: { configs: { all: { name: "vitest/all" } } } });
 * ```
 */
function mockVitestPlugin(pluginModule: IVitestPluginMock): void {
  vi.doMock(import("@vitest/eslint-plugin"), () => {
    return pluginModule as unknown as Partial<typeof vitestPluginModuleType>;
  });
}

describe("vitest plugin branches", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("@vitest/eslint-plugin");
  });

  it("returns empty when plugin is undefined", async () => {
    // Arrange
    vi.resetModules();
    mockVitestPlugin({
      default: void 0,
    });

    // Act
    const configs = await loadVitestConfigs();

    // Assert
    expect(configs).toStrictEqual([]);
  });

  it("returns empty when plugin configs are undefined", async () => {
    // Arrange
    vi.resetModules();
    mockVitestPlugin({
      default: {},
    });

    // Act
    const configs = await loadVitestConfigs();

    // Assert
    expect(configs).toStrictEqual([]);
  });

  it("returns repo-owned configs when the all preset is available", async () => {
    // Arrange
    vi.resetModules();
    const allConfig: Linter.Config = {
      name: "vitest/all",
    };
    mockVitestPlugin({
      default: {
        configs: {
          all: allConfig,
        },
      },
    });

    // Act
    const { customConfig, presetConfig, settingsConfig } =
      await loadVitestConfigs().then((configs) => ({
        customConfig: configs.find((config) => config.name === "vitest/custom"),
        presetConfig: configs.find(
          (config) => config.name?.includes("vitest/all") === true,
        ),
        settingsConfig: configs.find((config) => config.settings !== void 0),
      }));

    // Assert
    expect(settingsConfig).toMatchObject({
      settings: {
        vitest: {
          typecheck: true,
        },
      },
    });
    expect(presetConfig?.name).toContain(String(allConfig.name));
    expect(customConfig).toMatchObject({
      files: ["**/*.{spec,test}.ts"],
      name: "vitest/custom",
      rules: {
        "vitest/consistent-test-filename": [
          "error",
          { pattern: String.raw`.*\.spec\.[tj]sx?$` },
        ],
        "vitest/no-hooks": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/require-mock-type-parameters": "off",
        "vitest/unbound-method": "off",
      },
    });
  });
});

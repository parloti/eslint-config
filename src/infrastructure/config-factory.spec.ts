import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as domainModuleType from "../domain";
import type { ConfigOptions, moduleTaxonomy } from "../domain";
import type * as pluginLoadersModuleType from "./plugin-loaders";

/** Plugin taxonomy fixture used by config-factory branch tests. */
const mockedModuleTaxonomy = [
  { pluginName: "eslint" },
  { pluginName: "typescript" },
] as unknown as typeof moduleTaxonomy;

/**
 * Creates a deterministic core config entry for a mocked plugin.
 * @param pluginName Plugin key used in the generated config name.
 * @returns Single-item config array for mocked loader output.
 * @example
 * ```typescript
 * loadCoreConfig("eslint");
 * ```
 */
function loadCoreConfig(pluginName: "eslint" | "typescript"): Linter.Config[] {
  return [{ name: `${pluginName}/core` }];
}

/** Plugin loader registry fixture consumed by config-factory. */
const mockedPluginLoaders = {
  eslint: {
    loader: () => loadCoreConfig.bind(void 0, "eslint"),
    mode: "required",
    pluginName: "eslint",
  },
  typescript: {
    loader: () => loadCoreConfig.bind(void 0, "typescript"),
    mode: "required",
    pluginName: "typescript",
  },
} as const;

/**
 * Deterministic plugin-config loader result used by tests.
 * @param pluginName Plugin name passed through config-factory orchestration.
 * @returns Loaded plugin config array.
 * @example
 * ```typescript
 * await loadEnabledPluginConfig("eslint");
 * ```
 */
function loadEnabledPluginConfig(pluginName: string): Promise<Linter.Config[]> {
  return Promise.resolve([{ name: `${pluginName}/loaded` }]);
}

describe("config-factory", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns an empty array when plugin state disables every module", async () => {
    // Arrange
    vi.doMock(
      import("../domain"),
      createMockProxy<typeof domainModuleType>({
        moduleTaxonomy: mockedModuleTaxonomy,
      }),
    );

    vi.doMock(
      import("./plugin-loaders"),
      createMockProxy<typeof pluginLoadersModuleType>({
        pluginLoaders: mockedPluginLoaders,
      }),
    );

    vi.doMock(import("./plugin-state"), () => ({
      isPluginEnabled: () => false,
    }));

    const loadPluginConfigMock = vi.fn();

    vi.doMock(import("./utilities"), () => ({
      loadPluginConfig: loadPluginConfigMock,
    }));

    vi.doMock(import("./diagnostics"), () => ({
      reportDeprecatedBoundariesOption: vi.fn(),
    }));

    // Act
    const actualConfigs = await (async () => {
      const { config } = await import("./config-factory");

      return config();
    })();

    // Assert
    expect(actualConfigs).toStrictEqual([]);
    expect(loadPluginConfigMock).not.toHaveBeenCalled();
  });

  it("builds configs for enabled plugins and reports deprecated boundaries", async () => {
    // Arrange
    const reportDeprecatedBoundariesOptionMock = vi.fn();

    vi.doMock(
      import("../domain"),
      createMockProxy<typeof domainModuleType>({
        moduleTaxonomy: mockedModuleTaxonomy,
      }),
    );

    vi.doMock(
      import("./plugin-loaders"),
      createMockProxy<typeof pluginLoadersModuleType>({
        pluginLoaders: mockedPluginLoaders,
      }),
    );

    vi.doMock(import("./plugin-state"), () => ({
      isPluginEnabled: (pluginName: string) => pluginName === "eslint",
    }));

    vi.doMock(import("./utilities"), () => ({
      loadPluginConfig: vi.fn(loadEnabledPluginConfig),
    }));

    vi.doMock(import("./diagnostics"), () => ({
      reportDeprecatedBoundariesOption: reportDeprecatedBoundariesOptionMock,
    }));

    // Act
    const actualConfigs = await (async () => {
      const { config } = await import("./config-factory");

      return config({
        boundaries: {},
      } as unknown as ConfigOptions);
    })();

    // Assert
    expect(reportDeprecatedBoundariesOptionMock).toHaveBeenCalledTimes(1);
    expect(actualConfigs).toStrictEqual([{ name: "eslint/loaded" }]);
  });
});

import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as domainModuleType from "../domain";
import type { ConfigOptions } from "../domain";
import type * as pluginLoadersModuleType from "./plugin-loaders";

/** Domain module namespace type used for typed module mocks. */
type DomainModule = typeof domainModuleType;
/** Plugin-loaders module namespace type used for typed module mocks. */
type PluginLoadersModule = typeof pluginLoadersModuleType;

/** Plugin taxonomy fixture used by config-factory branch tests. */
const mockedModuleTaxonomy = [
  { pluginName: "eslint" },
  { pluginName: "typescript" },
] as const;

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
    loader() {
      return loadCoreConfig.bind(void 0, "eslint");
    },
    mode: "required",
    pluginName: "eslint",
  },
  typescript: {
    loader() {
      return loadCoreConfig.bind(void 0, "typescript");
    },
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
      () =>
        ({
          moduleTaxonomy: mockedModuleTaxonomy,
        }) as unknown as Partial<DomainModule>,
    );

    vi.doMock(
      import("./plugin-loaders"),
      () =>
        ({
          pluginLoaders: mockedPluginLoaders,
        }) as unknown as Partial<PluginLoadersModule>,
    );

    vi.doMock(import("./plugin-state"), () => ({
      resolvePluginState: () => false,
    }));

    const loadPluginConfigMock = vi.fn();

    vi.doMock(import("./utilities"), () => ({
      loadPluginConfig: loadPluginConfigMock,
    }));

    vi.doMock(import("./diagnostics"), () => ({
      reportDeprecatedBoundariesOption: vi.fn(),
    }));

    // Act
    const actualConfigs = await import("./config-factory").then(({ config }) =>
      config(),
    );

    // Assert
    expect(actualConfigs).toStrictEqual([]);
    expect(loadPluginConfigMock).not.toHaveBeenCalled();
  });

  it("builds configs for enabled plugins and reports deprecated boundaries", async () => {
    // Arrange
    const reportDeprecatedBoundariesOptionMock = vi.fn();

    vi.doMock(
      import("../domain"),
      () =>
        ({
          moduleTaxonomy: mockedModuleTaxonomy,
        }) as unknown as Partial<DomainModule>,
    );

    vi.doMock(
      import("./plugin-loaders"),
      () =>
        ({
          pluginLoaders: mockedPluginLoaders,
        }) as unknown as Partial<PluginLoadersModule>,
    );

    vi.doMock(import("./plugin-state"), () => ({
      resolvePluginState: (pluginName: string) => pluginName === "eslint",
    }));

    vi.doMock(import("./utilities"), () => ({
      loadPluginConfig: vi.fn(loadEnabledPluginConfig),
    }));

    vi.doMock(import("./diagnostics"), () => ({
      reportDeprecatedBoundariesOption: reportDeprecatedBoundariesOptionMock,
    }));

    // Act
    const actualConfigs = await import("./config-factory").then(({ config }) =>
      config({
        boundaries: {},
      } as unknown as ConfigOptions),
    );

    // Assert
    expect(reportDeprecatedBoundariesOptionMock).toHaveBeenCalledTimes(1);
    expect(actualConfigs).toStrictEqual([{ name: "eslint/loaded" }]);
  });
});

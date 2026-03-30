import type { Linter } from "eslint";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PluginName } from "./types";

import {
  applyRuleOverrides,
  collectAvailablePlugins,
  isPluginDisabled,
  loadPluginConfig,
} from "./utilities";

/**
 * Captured SUT result paired with the first stderr message.
 * @template T The return type of the SUT.
 */
interface ISutOutcome<T> {
  /** First stderr message emitted during the SUT call. */
  firstMessage: string | undefined;
  /** Value returned by the SUT call. */
  result: T;
}

/**
 * Run a SUT action while capturing the first stderr message.
 * @template T The SUT return type.
 * @param action The SUT action to execute.
 * @returns The SUT result paired with the first stderr message.
 * @example
 * ```typescript
 * await captureSutWithStderr(() => applyRuleOverrides([], {}));
 * ```
 */
async function captureSutWithStderr<T>(
  action: () => Promise<T> | T,
): Promise<ISutOutcome<T>> {
  let firstMessage: string | undefined;
  vi.spyOn(process.stderr, "write").mockImplementation(
    (chunk: string | Uint8Array) => {
      firstMessage ??= String(chunk);

      return true;
    },
  );
  const result = await action();

  return { firstMessage, result };
}

/** Missing optional plugin error fixture. */
const missingPluginError = new Error("Missing plugin");
/** Missing required peer error fixture. */
const requiredPeerError = new Error("Missing required peer");
/** Missing optional Jest plugin error fixture. */
const missingJestPluginError = new Error(
  "Cannot find module 'eslint-plugin-jest'",
);
/** Mocked loader that rejects for an optional missing plugin. */
const loadMissingPluginConfig = vi.fn<() => Promise<Linter.Config[]>>();
/** Mocked loader that rejects for a required missing peer. */
const loadRequiredPeerConfig = vi.fn<() => Promise<Linter.Config[]>>();
/** Mocked loader that rejects when the optional Jest plugin is absent. */
const loadMissingJestPluginConfig = vi.fn<() => Promise<Linter.Config[]>>();

describe("utilities", () => {
  beforeEach(() => {
    loadMissingJestPluginConfig.mockRejectedValue(missingJestPluginError);
    loadMissingPluginConfig.mockRejectedValue(missingPluginError);
    loadRequiredPeerConfig.mockRejectedValue(requiredPeerError);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe(applyRuleOverrides, () => {
    it("returns the original config when overrides are undefined", () => {
      // Arrange
      const config = [{ name: "base" }];

      // Act
      const result = applyRuleOverrides(config);

      // Assert
      expect(result).toBe(config);
    });

    it("returns the original config when overrides are empty", () => {
      // Arrange
      const config = [{ name: "base" }];

      // Act
      const result = applyRuleOverrides(config, {});

      // Assert
      expect(result).toBe(config);
    });

    it("appends rule overrides when they are provided", () => {
      // Arrange
      const config = [{ name: "base" }];

      // Act
      const result = applyRuleOverrides(config, { "no-console": "off" });

      // Assert
      expect(result).toStrictEqual([
        { name: "base" },
        {
          name: "custom/rule-overrides",
          rules: { "no-console": "off" },
        },
      ]);
    });

    it("skips overrides for missing plugins and reports the skip", async () => {
      // Arrange
      const config = [{ name: "base" }];

      // Act
      const { firstMessage, result } = await captureSutWithStderr(() =>
        applyRuleOverrides(
          config,
          { "vitest/expect-expect": "error" },
          new Set(["jest"]),
        ),
      );

      // Assert
      expect(result).toStrictEqual(config);
      expect(firstMessage).toContain(
        "Skipped rule override: vitest/expect-expect",
      );
    });

    it("keeps overrides for available plugins", () => {
      // Arrange
      const config = [{ name: "base" }];

      // Act
      const result = applyRuleOverrides(
        config,
        { "vitest/expect-expect": "error" },
        new Set(["vitest"]),
      );

      // Assert
      expect(result).toStrictEqual([
        { name: "base" },
        {
          name: "custom/rule-overrides",
          rules: { "vitest/expect-expect": "error" },
        },
      ]);
    });
  });

  describe(isPluginDisabled, () => {
    it("returns false when the disabled list is undefined", () => {
      // Arrange
      const pluginName = "jest";

      // Act
      const isDisabled = isPluginDisabled(pluginName, void 0);

      // Assert
      expect(isDisabled).toBe(false);
    });

    it("returns false when the plugin is not disabled", () => {
      // Arrange
      const disabledList: readonly PluginName[] = ["jasmine"];

      // Act
      const isDisabled = isPluginDisabled("jest", disabledList);

      // Assert
      expect(isDisabled).toBe(false);
    });

    it("returns true when the plugin is disabled", () => {
      // Arrange
      const disabledList: readonly PluginName[] = ["jasmine", "jest"];

      // Act
      const isDisabled = isPluginDisabled("jest", disabledList);

      // Assert
      expect(isDisabled).toBe(true);
    });
  });

  describe(collectAvailablePlugins, () => {
    it("collects plugin names from config entries", () => {
      // Arrange
      const configs: Linter.Config[] = [
        { name: "one", plugins: { vitest: {} } },
        { name: "two", plugins: { jest: {} } },
      ];

      // Act
      const pluginNames = [...collectAvailablePlugins(configs)].toSorted();

      // Assert
      expect(pluginNames).toStrictEqual(["jest", "vitest"]);
    });

    it("returns an empty set when no plugins are present", () => {
      // Arrange
      const configs: Linter.Config[] = [{ name: "one" }];

      // Act
      const pluginNames = collectAvailablePlugins(configs);

      // Assert
      expect([...pluginNames]).toStrictEqual([]);
    });
  });

  describe(loadPluginConfig, () => {
    it("returns loaded configs", async () => {
      // Arrange
      const loader = vi
        .fn<() => Promise<Linter.Config[]>>()
        .mockResolvedValue([{ name: "test" }]);

      // Act
      const actualConfigs = await loadPluginConfig("jest", loader);

      // Assert
      expect(actualConfigs).toStrictEqual([{ name: "test" }]);
      expect(loader).toHaveBeenCalledTimes(1);
    });

    it("returns empty configs and reports optional failures", async () => {
      // Arrange
      const expectedMessage = "Failed to load ESLint plugin config: jest";

      // Act
      const { firstMessage, result } = await captureSutWithStderr(async () =>
        loadPluginConfig("jest", loadMissingPluginConfig),
      );

      // Assert
      expect(result).toStrictEqual([]);
      expect(firstMessage).toContain(expectedMessage);
      expect(firstMessage).toContain("Install the plugin or disable it");
    });

    it("rethrows required loader failures after reporting them", async () => {
      // Arrange
      const expectedMessage =
        'Install the required peer dependency backing "typescript"';

      // Act
      const { firstMessage, result: actualError } = await captureSutWithStderr(
        async () => {
          try {
            await loadPluginConfig(
              "typescript",
              loadRequiredPeerConfig,
              "required",
            );
          } catch (caughtError: unknown) {
            return caughtError;
          }

          return void 0;
        },
      );

      // Assert
      expect(actualError).toBe(requiredPeerError);
      expect(firstMessage).toContain(expectedMessage);
    });

    it("classifies missing optional integrations as skips", async () => {
      // Arrange
      const expectedMessage = "Skipped optional ESLint plugin config: jest";

      // Act
      const { firstMessage, result } = await captureSutWithStderr(async () =>
        loadPluginConfig("jest", loadMissingJestPluginConfig),
      );

      // Assert
      expect(result).toStrictEqual([]);
      expect(firstMessage).toContain(expectedMessage);
    });
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  defaultDisabledPlugins,
  isPluginDisabledByDefault,
  resolvePluginState,
} from "./plugin-state";

/**
 * Captured plugin-state result paired with the first stderr message.
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
 * await captureSutWithStderr(() => resolvePluginState("jest"));
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

describe("plugin-state", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe(isPluginDisabledByDefault, () => {
    it("returns true for default-disabled testing plugins", () => {
      // Arrange
      const pluginName = "jest";

      // Act
      const isDisabled = isPluginDisabledByDefault(pluginName);

      // Assert
      expect(isDisabled).toBe(true);
      expect(defaultDisabledPlugins).toStrictEqual(["jasmine", "jest"]);
    });

    it("returns false for default-enabled plugins", () => {
      // Arrange
      const pluginName = "vitest";

      // Act
      const isDisabled = isPluginDisabledByDefault(pluginName);

      // Assert
      expect(isDisabled).toBe(false);
    });
  });

  describe(resolvePluginState, () => {
    it("returns the default state when no override is supplied", () => {
      // Arrange
      const pluginName = "vitest";

      // Act
      const actualState = resolvePluginState(pluginName);

      // Assert
      expect(actualState).toBe(true);
    });

    it("enables a default-disabled plugin through explicit overrides", () => {
      // Arrange
      const pluginName = "jest";

      // Act
      const actualState = resolvePluginState(pluginName, { jest: true });

      // Assert
      expect(actualState).toBe(true);
    });

    it("warns when a default-enabled plugin is redundantly enabled", async () => {
      // Arrange
      const pluginName = "vitest";

      // Act
      const { firstMessage, result } = await captureSutWithStderr(() =>
        resolvePluginState(pluginName, { vitest: true }),
      );

      // Assert
      expect(result).toBe(true);
      expect(firstMessage).toContain(
        'Plugin "vitest" is already enabled by default.',
      );
    });

    it("warns when a default-disabled plugin is redundantly disabled", async () => {
      // Arrange
      const pluginName = "jest";

      // Act
      const { firstMessage, result } = await captureSutWithStderr(() =>
        resolvePluginState(pluginName, { jest: false }),
      );

      // Assert
      expect(result).toBe(false);
      expect(firstMessage).toContain(
        'Plugin "jest" is already disabled by default.',
      );
    });
  });
});

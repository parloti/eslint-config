import { describe, expect, it, vi } from "vitest";

import { isPluginEnabled } from "./plugin-state";

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
 * await captureSutWithStderr(() => isPluginEnabled("jest"));
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
  describe(isPluginEnabled, () => {
    it("returns the default state when no override is supplied", () => {
      // Arrange
      const pluginName = "vitest";

      // Act
      const actualState = { isEnabled: isPluginEnabled(pluginName) };

      // Assert
      expect(actualState.isEnabled).toBe(true);
    });

    it("enables a default-disabled plugin through explicit overrides", () => {
      // Arrange
      const pluginName = "jest";

      // Act
      const actualState = {
        isEnabled: isPluginEnabled(pluginName, { jest: true }),
      };

      // Assert
      expect(actualState.isEnabled).toBe(true);
    });

    it("warns when a default-enabled plugin is redundantly enabled", async () => {
      // Arrange
      const pluginName = "vitest";
      const untypedOverrides = {
        vitest: true,
      } as unknown as Parameters<typeof isPluginEnabled>[1];

      // Act
      const { firstMessage, result } = await captureSutWithStderr(() =>
        isPluginEnabled(pluginName, untypedOverrides),
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
      const untypedOverrides = {
        jest: false,
      } as unknown as Parameters<typeof isPluginEnabled>[1];

      // Act
      const { firstMessage, result } = await captureSutWithStderr(() =>
        isPluginEnabled(pluginName, untypedOverrides),
      );

      // Assert
      expect(result).toBe(false);
      expect(firstMessage).toContain(
        'Plugin "jest" is already disabled by default.',
      );
    });
  });
});

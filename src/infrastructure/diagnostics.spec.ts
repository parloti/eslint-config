import { describe, expect, it, vi } from "vitest";

import {
  reportDeprecatedBoundariesOption,
  reportPluginLoadIssue,
  reportRedundantPluginState,
} from "./diagnostics";

/** Captured stderr spy state for one test. */
interface IStderrCapture {
  /** Read the number of emitted stderr writes. */
  getCallCount: () => number;

  /** Read the first emitted stderr message. */
  getFirstMessage: () => string | undefined;
}

/** Captured stderr outcome for one reporting action. */
interface IStderrOutcome {
  /** First stderr message emitted by the action. */
  message: string | undefined;

  /** Number of stderr writes triggered by the action. */
  writeCallCount: number;
}

/**
 * Run one reporting action and capture its stderr outcome.
 * @param action The reporting action under test.
 * @returns The first emitted message and write count.
 * @example
 * ```typescript
 * captureStderrOutcome(() => reportRedundantPluginState("vitest", true));
 * ```
 */
function captureStderrOutcome(action: () => void): IStderrOutcome {
  const stderrCapture = createStderrCapture();
  action();

  return {
    message: stderrCapture.getFirstMessage(),
    writeCallCount: stderrCapture.getCallCount(),
  };
}

/**
 * Create a stderr spy that records the first emitted message.
 * @returns The captured stderr spy state.
 * @example
 * ```typescript
 * createStderrCapture();
 * ```
 */
function createStderrCapture(): IStderrCapture {
  let firstMessage: string | undefined;
  const stderrSpy = vi
    .spyOn(process.stderr, "write")
    .mockImplementation((chunk: string | Uint8Array) => {
      firstMessage ??= String(chunk);

      return true;
    });

  return {
    getCallCount: () => stderrSpy.mock.calls.length,
    getFirstMessage: () => firstMessage,
  };
}

describe("diagnostics", () => {
  describe(reportPluginLoadIssue, () => {
    it("reports skipped optional integrations distinctly", () => {
      // Arrange
      const expectedMessage = "Skipped optional ESLint plugin config: vitest";

      // Act
      const outcome = captureStderrOutcome(() => {
        reportPluginLoadIssue(
          "vitest",
          new Error("Cannot find module 'vitest'"),
          "optional",
        );
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(expectedMessage);
      expect(outcome.message).toContain('plugins: { "vitest": false }');
    });

    it("reports required loader failures distinctly", () => {
      // Arrange
      const expectedMessage =
        'Install the required peer dependency backing "typescript"';

      // Act
      const outcome = captureStderrOutcome(() => {
        reportPluginLoadIssue("typescript", new Error("boom"), "required");
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(expectedMessage);
    });
  });

  describe(reportRedundantPluginState, () => {
    it("reports redundant disable requests distinctly", () => {
      // Arrange
      const expectedMessage = 'Plugin "jest" is already disabled by default.';

      // Act
      const outcome = captureStderrOutcome(() => {
        reportRedundantPluginState("jest", false);
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(expectedMessage);
    });

    it("reports redundant enable requests distinctly", () => {
      // Arrange
      const expectedMessage = 'Plugin "vitest" is already enabled by default.';

      // Act
      const outcome = captureStderrOutcome(() => {
        reportRedundantPluginState("vitest", true);
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(expectedMessage);
    });
  });

  describe(reportDeprecatedBoundariesOption, () => {
    it("reports removed boundaries config input guidance", () => {
      // Arrange
      const expectedMessage = "Deprecated config option ignored: boundaries";

      // Act
      const outcome = captureStderrOutcome(() => {
        reportDeprecatedBoundariesOption();
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(expectedMessage);
      expect(outcome.message).toContain('plugins: { "boundaries": false }');
    });
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isMissingModuleError,
  reportMissingBoundariesConfig,
  reportPluginLoadIssue,
  reportRuleOverrideSkip,
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
 * captureStderrOutcome(() => reportMissingBoundariesConfig());
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe(isMissingModuleError, () => {
    it("returns true for common missing module messages", () => {
      // Arrange
      // (no setup needed)

      // Act
      const actualResults = [
        new Error("Cannot find module 'vitest'"),
        "ERR_MODULE_NOT_FOUND",
      ].map((errorLike) => isMissingModuleError(errorLike));

      // Assert
      expect(actualResults).toStrictEqual([true, true]);
    });

    it("returns false for non-missing module messages", () => {
      // Arrange
      // (no setup needed)

      // Act
      const actualResult = isMissingModuleError(
        new Error("Unexpected parse error"),
      );

      // Assert
      expect(actualResult).toBe(false);
    });
  });

  describe(reportPluginLoadIssue, () => {
    it("reports skipped optional integrations distinctly", () => {
      // Arrange
      // (no setup needed)

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
      expect(outcome.message).toContain(
        "Skipped optional ESLint plugin config: vitest",
      );
    });

    it("reports required loader failures distinctly", () => {
      // Arrange
      // (no setup needed)

      // Act
      const outcome = captureStderrOutcome(() => {
        reportPluginLoadIssue("typescript", new Error("boom"), "required");
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(
        'Install the required peer dependency backing "typescript"',
      );
    });
  });

  describe(reportRuleOverrideSkip, () => {
    it("reports missing plugin overrides", () => {
      // Arrange
      // (no setup needed)

      // Act
      const outcome = captureStderrOutcome(() => {
        reportRuleOverrideSkip("vitest/no-focused-tests", "vitest");
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(
        "Skipped rule override: vitest/no-focused-tests",
      );
    });
  });

  describe(reportMissingBoundariesConfig, () => {
    it("reports repository-owned boundaries input guidance", () => {
      // Arrange
      // (no setup needed)

      // Act
      const outcome = captureStderrOutcome(() => {
        reportMissingBoundariesConfig();
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(
        "Provide repository-owned boundaries files, elements, and element-types.",
      );
    });
  });
});

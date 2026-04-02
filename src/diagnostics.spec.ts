import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isMissingModuleError,
  reportMissingBoundariesConfig,
  reportPluginLoadIssue,
  reportRedundantPluginState,
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
    it("returns true for a Cannot-find-module error", () => {
      // Arrange
      const missingModuleMessage = "Cannot find module 'vitest'";

      // Act
      const actualResult = isMissingModuleError(
        new Error(missingModuleMessage),
      );

      // Assert
      expect(actualResult).toBe(true);
    });

    it("returns true for an ERR_MODULE_NOT_FOUND string", () => {
      // Arrange
      const moduleNotFoundSignal = "ERR_MODULE_NOT_FOUND";

      // Act
      const actualResult = isMissingModuleError(moduleNotFoundSignal);

      // Assert
      expect(actualResult).toBe(true);
    });

    it("returns false for non-missing module messages", () => {
      // Arrange
      const errorMessage = "Unexpected parse error";

      // Act
      const actualResult = isMissingModuleError(new Error(errorMessage));

      // Assert
      expect(actualResult).toBe(false);
    });
  });

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

  describe(reportRuleOverrideSkip, () => {
    it("reports missing plugin overrides", () => {
      // Arrange
      const expectedMessage = "Skipped rule override: vitest/no-focused-tests";

      // Act
      const outcome = captureStderrOutcome(() => {
        reportRuleOverrideSkip("vitest/no-focused-tests", "vitest");
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

  describe(reportMissingBoundariesConfig, () => {
    it("reports repository-owned boundaries input guidance", () => {
      // Arrange
      const expectedMessage =
        "Provide repository-owned boundaries files, elements, and element-types.";

      // Act
      const outcome = captureStderrOutcome(() => {
        reportMissingBoundariesConfig();
      });

      // Assert
      expect(outcome.writeCallCount).toBe(1);
      expect(outcome.message).toContain(expectedMessage);
    });
  });
});

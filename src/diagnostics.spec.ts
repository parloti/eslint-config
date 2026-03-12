import { describe, expect, it, vi } from "vitest";

import {
  isMissingModuleError,
  reportMissingBoundariesConfig,
  reportPluginLoadIssue,
  reportRuleOverrideSkip,
} from "./diagnostics";

describe(isMissingModuleError, () => {
  it("returns true for common missing module messages", () => {
    expect(isMissingModuleError(new Error("Cannot find module 'vitest'"))).toBe(
      true,
    );
    expect(isMissingModuleError("ERR_MODULE_NOT_FOUND")).toBe(true);
  });

  it("returns false for non-missing module messages", () => {
    expect(isMissingModuleError(new Error("Unexpected parse error"))).toBe(
      false,
    );
  });
});

describe(reportPluginLoadIssue, () => {
  it("reports skipped optional integrations distinctly", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    reportPluginLoadIssue(
      "vitest",
      new Error("Cannot find module 'vitest'"),
      "optional",
    );

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      "Skipped optional ESLint plugin config: vitest",
    );

    stderrSpy.mockRestore();
  });

  it("reports required loader failures distinctly", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    reportPluginLoadIssue("typescript", new Error("boom"), "required");

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      'Install the required peer dependency backing "typescript"',
    );

    stderrSpy.mockRestore();
  });
});

describe(reportRuleOverrideSkip, () => {
  it("reports missing plugin overrides", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    reportRuleOverrideSkip("vitest/no-focused-tests", "vitest");

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      "Skipped rule override: vitest/no-focused-tests",
    );

    stderrSpy.mockRestore();
  });
});

describe(reportMissingBoundariesConfig, () => {
  it("reports repository-owned boundaries input guidance", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    reportMissingBoundariesConfig();

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      "Provide repository-owned boundaries files, elements, and element-types.",
    );

    stderrSpy.mockRestore();
  });
});

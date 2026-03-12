import { describe, expect, it, vi } from "vitest";

import type { BoundariesConfig } from "../types";

import { boundaries } from "./boundaries";

describe("boundaries config", () => {
  it("returns empty configs without setup", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    const configs = boundaries();

    expect(configs).toStrictEqual([]);
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skipped boundaries config"),
    );
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Provide repository-owned boundaries files, elements, and element-types.",
      ),
    );

    stderrSpy.mockRestore();
  });

  it("builds configs when configured", () => {
    const config: BoundariesConfig = {
      elements: [{ pattern: "src/shared", type: "shared" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    };

    const configs = boundaries(config);

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((entry) =>
        Object.hasOwn(entry.rules ?? {}, "boundaries/element-types"),
      ),
    ).toBe(true);
  });

  it("passes through files and ignores options", () => {
    const config: BoundariesConfig = {
      elements: [{ pattern: "src/shared", type: "shared" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
      ignores: ["**/*.spec.ts"],
    };

    const configs = boundaries(config);

    expect(
      configs.some((entry) => entry.files?.includes("src/**/*.ts") === true),
    ).toBe(true);
    expect(
      configs.some((entry) => entry.ignores?.includes("**/*.spec.ts") === true),
    ).toBe(true);
  });

  it("does not infer a default topology when files are missing", () => {
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);
    const config = {
      elements: [{ pattern: "src/shared", type: "shared" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
    } as unknown as BoundariesConfig;

    const configs = boundaries(config);

    expect(configs).toStrictEqual([]);
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skipped boundaries config"),
    );

    stderrSpy.mockRestore();
  });
});

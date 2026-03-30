import { afterEach, describe, expect, it, vi } from "vitest";

import type { BoundariesConfig } from "../types";

import { boundaries } from "./boundaries";

describe("boundaries config", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty configs without setup", () => {
    // Arrange
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    // Act
    const configs = boundaries();

    // Assert
    expect(configs).toStrictEqual([]);
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skipped boundaries config"),
    );
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Provide repository-owned boundaries files, elements, and element-types.",
      ),
    );
  });

  it("builds configs when configured", () => {
    // Arrange
    const config: BoundariesConfig = {
      elements: [{ pattern: "src/shared", type: "shared" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    };

    // Act
    const actualHasElementTypesRule = boundaries(config).some((entry) =>
      Object.hasOwn(entry.rules ?? {}, "boundaries/element-types"),
    );

    // Assert
    expect(actualHasElementTypesRule).toBe(true);
  });

  it("passes through files and ignores options", () => {
    // Arrange
    const config: BoundariesConfig = {
      elements: [{ pattern: "src/shared", type: "shared" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
      ignores: ["**/*.spec.ts"],
    };

    // Act
    const configs = boundaries(config);

    // Assert
    expect(configs).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ files: ["src/**/*.ts"] }),
        expect.objectContaining({ ignores: ["**/*.spec.ts"] }),
      ]),
    );
  });

  it("does not infer a default topology when files are missing", () => {
    // Arrange
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);
    const config = {
      elements: [{ pattern: "src/shared", type: "shared" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
    } as unknown as BoundariesConfig;

    // Act
    const configs = boundaries(config);

    // Assert
    expect(configs).toStrictEqual([]);
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skipped boundaries config"),
    );
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  defaultCompositionNames,
  moduleTaxonomy,
  reducedCompositionNames,
} from ".";

/**
 * Load whether the domain barrel re-exports its runtime metadata.
 * @returns Equality results for the runtime metadata exports.
 * @example
 * ```typescript
 * await loadDomainExportMatches();
 * ```
 */
async function loadDomainExportMatches(): Promise<boolean[]> {
  const actualDomain = await import(".");

  return [
    actualDomain.defaultCompositionNames === defaultCompositionNames,
    actualDomain.moduleTaxonomy === moduleTaxonomy,
    actualDomain.reducedCompositionNames === reducedCompositionNames,
  ];
}

describe("domain configs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("re-exports runtime taxonomy and composition metadata", async () => {
    // Arrange
    const expectedFirstPlugin = "codeperfect";
    const expectedMatches = [true, true, true];

    // Act
    const actualMatches = await loadDomainExportMatches();

    // Assert
    expect(actualMatches).toStrictEqual(expectedMatches);
    expect(defaultCompositionNames.at(0)).toBe("core-codeperfect");
    expect(reducedCompositionNames).toContain("architecture-import-x");
    expect(moduleTaxonomy.at(0)?.pluginName).toBe(expectedFirstPlugin);
  });
});

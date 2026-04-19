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
    const expectedFirstConfig = "core-codeperfect";
    const expectedMatches = [true, true, true];
    const expectedReducedCompositionName = "architecture-import-x";

    // Act
    const result = {
      actualFirstConfig: defaultCompositionNames.at(0),
      actualFirstPlugin: moduleTaxonomy.at(0)?.pluginName,
      actualHasReducedCompositionName: reducedCompositionNames.includes(
        expectedReducedCompositionName,
      ),
      actualMatches: await loadDomainExportMatches(),
    };

    // Assert
    expect(result.actualMatches).toStrictEqual(expectedMatches);
    expect(result.actualFirstConfig).toBe(expectedFirstConfig);
    expect(result.actualHasReducedCompositionName).toBe(true);
    expect(result.actualFirstPlugin).toBe(expectedFirstPlugin);
  });
});

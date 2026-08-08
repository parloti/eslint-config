import { describe, expect, it } from "vitest";

import type { ConfigOptions } from "../../src";

import { config } from "../../src";
import { collectConfigNames, runWithStderrCapture } from "./helpers";

describe("config factory end-to-end", () => {
  it("builds a non-empty flat config with default-enabled modules", async () => {
    // Arrange
    const expectedNames = [
      "custom-eslint",
      "jsdoc/custom",
      "import-x/custom-typescript",
      "vitest/custom",
      "perfectionist/avoid-conflict-with-eslint",
    ];
    const excludedNames = [
      "jest/custom",
      "jasmine/custom",
      "vitest-e2e/custom",
      "angular-eslint/ts-recommended",
    ];

    // Act
    const actualNames = collectConfigNames(await config());

    // Assert
    expect(actualNames).toStrictEqual(expect.arrayContaining(expectedNames));
    expect(actualNames).not.toStrictEqual(
      expect.arrayContaining(excludedNames),
    );
  });

  it("enables opt-in plugins when explicitly requested", async () => {
    // Arrange
    const expectedNames = [
      "jest/custom",
      "jasmine/custom",
      "vitest-e2e/custom",
    ];

    // Act
    const actualNames = collectConfigNames(
      await config({
        plugins: {
          jasmine: true,
          jest: true,
          "vitest-e2e": true,
        },
      }),
    );

    // Assert
    expect(actualNames).toStrictEqual(expect.arrayContaining(expectedNames));
  });

  it("swallows optional plugin load failures with guidance", async () => {
    // Act
    const { result: actualFlatConfigs, stderrOutput: actualStderrOutput } =
      await runWithStderrCapture(() =>
        config({
          plugins: { "angular-eslint": true },
        }),
      );

    // Assert
    expect(actualFlatConfigs.length).toBeGreaterThan(0);
    expect(actualStderrOutput).toContain(
      "Failed to load ESLint plugin config: angular-eslint",
    );
    expect(actualStderrOutput).toContain(
      'plugins: { "angular-eslint": false }',
    );
  });

  it("disables default-enabled plugins when explicitly requested", async () => {
    // Arrange
    const excludedNames = [
      "custom-eslint",
      "jsdoc/custom",
      "Allow explicit null",
      "vitest/custom",
    ];

    // Act
    const actualNames = collectConfigNames(
      await config({
        plugins: {
          eslint: false,
          jsdoc: false,
          unicorn: false,
          vitest: false,
        },
      }),
    );

    // Assert
    expect(actualNames).not.toStrictEqual(
      expect.arrayContaining(excludedNames),
    );
  });

  it("returns an empty config when every module is disabled", async () => {
    // Arrange
    const disabledPlugins: NonNullable<ConfigOptions["plugins"]> = {
      boundaries: false,
      codeperfect: false,
      comments: false,
      eslint: false,
      "import-x": false,
      jsdoc: false,
      perfectionist: false,
      playwright: false,
      prettier: false,
      resolver: false,
      "rxjs-x": false,
      stylistic: false,
      typescript: false,
      unicorn: false,
      vitest: false,
    };

    // Act
    const actualFlatConfigs = await config({ plugins: disabledPlugins });

    // Assert
    expect(actualFlatConfigs).toStrictEqual([]);
  });

  it("reports the deprecated boundaries option on stderr", async () => {
    // Act
    const { result: actualFlatConfigs, stderrOutput: actualStderrOutput } =
      await runWithStderrCapture(() =>
        config({
          boundaries: {},
        } as unknown as ConfigOptions),
      );

    // Assert
    expect(actualFlatConfigs.length).toBeGreaterThan(0);
    expect(actualStderrOutput).toContain(
      "Deprecated config option ignored: boundaries",
    );
    expect(actualStderrOutput).toContain('plugins: { "boundaries": false }');
  });

  it("reports redundant plugin-state overrides on stderr", async () => {
    // Act
    const { result: actualFlatConfigs, stderrOutput: actualStderrOutput } =
      await runWithStderrCapture(() =>
        config({
          plugins: {
            jest: false,
            vitest: true,
          } as unknown as NonNullable<ConfigOptions["plugins"]>,
        }),
      );

    // Assert
    expect(actualFlatConfigs.length).toBeGreaterThan(0);
    expect(actualStderrOutput).toContain(
      'Plugin "jest" is already disabled by default.',
    );
    expect(actualStderrOutput).toContain(
      'Plugin "vitest" is already enabled by default.',
    );
  });
});

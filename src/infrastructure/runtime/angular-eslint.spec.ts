import type * as AngularTsPluginModule from "@angular-eslint/eslint-plugin";
import type * as AngularTemplatePluginModule from "@angular-eslint/eslint-plugin-template";
import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Load the Angular ESLint config under test after module mocking.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * const configs = await loadAngularEslintConfigs();
 * ```
 */
async function loadAngularEslintConfigs(): Promise<Linter.Config[]> {
  const { angularEslint } = await import("./angular-eslint");

  return angularEslint();
}

describe("angular-eslint plugin branches", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("@angular-eslint/eslint-plugin");
    vi.doUnmock("@angular-eslint/eslint-plugin-template");
  });

  it("returns repo-owned configs when both presets are available", async () => {
    // Arrange
    vi.resetModules();
    const tsRecommendedConfig: Linter.Config = {
      name: "angular-eslint/ts-recommended",
    };
    const templateRecommendedConfig: Linter.Config = {
      name: "angular-eslint/template-recommended",
    };

    vi.doMock(import("@angular-eslint/eslint-plugin"), () => {
      return {
        default: {
          configs: {
            recommended: tsRecommendedConfig,
          },
        },
      } as unknown as typeof AngularTsPluginModule;
    });

    vi.doMock(import("@angular-eslint/eslint-plugin-template"), () => {
      return {
        default: {
          configs: {
            recommended: templateRecommendedConfig,
          },
        },
      } as unknown as typeof AngularTemplatePluginModule;
    });

    // Act
    const { templateConfig, tsConfig } = await loadAngularEslintConfigs().then(
      (configs) => ({
        templateConfig: configs.find(
          (config) => config.name === "angular-eslint/template-recommended",
        ),
        tsConfig: configs.find(
          (config) => config.name === "angular-eslint/ts-recommended",
        ),
      }),
    );

    // Assert
    expect(tsConfig).toMatchObject({
      files: ["**/*.ts"],
      ignores: ["**/*.spec.ts"],
      name: "angular-eslint/ts-recommended",
    });
    expect(templateConfig).toMatchObject({
      files: ["**/*.component.html"],
      name: "angular-eslint/template-recommended",
    });
  });
});

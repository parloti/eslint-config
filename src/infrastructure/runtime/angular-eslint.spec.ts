import type * as AngularTsPluginModule from "angular-eslint";
import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

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

describe("angular-eslint configuration", () => {
  it("applies the TypeScript, template, and accessibility presets", async () => {
    // Arrange
    const tsRecommended = [{ rules: { "angular/ts-rule": "error" } }];
    const templateRecommended = [
      { rules: { "angular/template-rule": "error" } },
    ];
    const templateAccessibility = [
      { rules: { "angular/accessibility-rule": "error" } },
    ];
    const processInlineTemplates = {
      postprocess: (messages: unknown[][]) => messages.flat(),
      preprocess: (text: string) => [text],
    };

    vi.doMock(
      import("angular-eslint"),
      createMockProxy<typeof AngularTsPluginModule>({
        configs: {
          templateAccessibility,
          templateRecommended,
          tsRecommended,
        },
        processInlineTemplates,
      } as unknown as typeof AngularTsPluginModule),
    );

    // Act
    const actual = await loadAngularEslintConfigs();

    // Assert
    expect(actual[1]).toMatchObject({
      files: ["**/*.ts"],
      name: "angular-eslint/ts-recommended",
      processor: processInlineTemplates,
    });
    expect(actual[4]).toMatchObject({
      files: ["**/*.html"],
      name: "angular-eslint/template-recommended",
    });
    expect(actual).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ rules: { "angular/ts-rule": "error" } }),
        expect.objectContaining({
          rules: { "angular/template-rule": "error" },
        }),
        expect.objectContaining({
          rules: { "angular/accessibility-rule": "error" },
        }),
      ]),
    );
  });

  it("uses an empty processor when inline template processing is unavailable", async () => {
    // Arrange
    vi.doMock(
      import("angular-eslint"),
      createMockProxy<typeof AngularTsPluginModule>({
        configs: {
          templateAccessibility: [],
          templateRecommended: [],
          tsRecommended: [],
        },
        processInlineTemplates: undefined,
      }),
    );

    // Act
    const actual = await loadAngularEslintConfigs();

    // Assert
    expect(actual[0]?.processor).toMatchObject({});
  });
});

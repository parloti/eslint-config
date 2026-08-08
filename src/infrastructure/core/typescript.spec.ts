import type * as TypescriptEslintModule from "typescript-eslint";

import { describe, expect, it, vi } from "vitest";

import { typescript } from "./typescript";

vi.mock(
  import("typescript-eslint"),
  createMockProxy<typeof TypescriptEslintModule>({
    configs: {
      strictTypeChecked: [
        {
          name: "@typescript-eslint/strict-type-checked",
        },
      ],
      stylisticTypeChecked: [
        {
          name: "@typescript-eslint/stylistic-type-checked",
        },
      ],
    },
  }),
);

describe("typescript config", () => {
  it("returns custom configs", async () => {
    // Arrange
    const strictConfig = {
      name: "@typescript-eslint/strict-type-checked",
    };
    const stylisticConfig = {
      name: "@typescript-eslint/stylistic-type-checked",
    };
    const parserOptionsConfig = {
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    };

    // Act
    const actualConfigs = await typescript();

    // Assert
    expect(actualConfigs).toContainEqual(strictConfig);
    expect(actualConfigs).toContainEqual(stylisticConfig);
    expect(actualConfigs).toContainEqual(parserOptionsConfig);
  });
});

import type { RuleDefinition } from "@eslint/core";
import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

/**
 * Load the docs module and return its comments config output.
 * @returns The comments config array.
 * @example
 * ```typescript
 * console.log("loadCommentsConfigs");
 * ```
 */
async function loadCommentsConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import("./comments");

  return documentationModule.comments();
}

/**
 * Mock the eslint-comments modules for one test.
 * @param recommended The recommended ESLint comments configuration.
 * @param rules The custom ESLint comments rules.
 * @example
 * ```typescript
 * mockCommentsModules({ recommended: {}, rules: {} });
 * ```
 */
function mockCommentsModules(
  recommended: Linter.Config,
  rules: Record<string, RuleDefinition>,
): void {
  vi.doMock(import("@eslint-community/eslint-plugin-eslint-comments"), () => ({
    rules,
  }));
  vi.doMock(
    import("@eslint-community/eslint-plugin-eslint-comments/configs"),
    () => {
      return { recommended };
    },
  );
}

describe("comments config", () => {
  it("adds repo-owned rules on top of the recommended preset", async () => {
    // Arrange
    mockCommentsModules(
      {
        rules: {
          "@eslint-community/eslint-comments/no-unused-disable": "error",
        },
      },
      {
        "no-inline-disable": {} as RuleDefinition,
        "no-unused-disable": {} as RuleDefinition,
        "no-use": {} as RuleDefinition,
      },
    );

    // Act
    const actualCommentsConfig = await (async () => {
      const configs = await loadCommentsConfigs();

      return configs.at(0);
    })();

    // Assert
    expect(actualCommentsConfig).toMatchObject({
      files: ["**/*.ts"],
      rules: { "@eslint-community/eslint-comments/no-unused-disable": "error" },
    });
    expect(actualCommentsConfig?.rules).not.toHaveProperty(
      "@eslint-community/eslint-comments/no-inline-disable",
    );
    expect(actualCommentsConfig?.rules).not.toHaveProperty(
      "@eslint-community/eslint-comments/no-use",
    );
  });

  it("handles eslint-comments config without rules", async () => {
    // Arrange
    mockCommentsModules({}, {});

    // Act
    const actualCommentsConfig = await (async () => {
      const configs = await loadCommentsConfigs();

      return configs.at(0);
    })();

    // Assert
    expect(actualCommentsConfig).toMatchObject({ files: ["**/*.ts"] });
    expect(actualCommentsConfig).not.toHaveProperty("rules");
  });
});

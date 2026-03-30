import type { Linter, Rule } from "eslint";
import type index from "eslint-plugin-jsdoc";

import { describe, expect, it, vi } from "vitest";

import { comments, jsdoc } from ".";

/** Repo-owned rules keyed by config name. */
type RulesByConfigName = Record<string, Linter.RulesRecord | undefined>;

/**
 * Load the docs jsdoc rules keyed by config name.
 * @returns The repo-owned rules keyed by config name.
 * @example
 * ```typescript
 * await loadJsdocRulesByConfigName();
 * ```
 */
async function loadJsdocRulesByConfigName(): Promise<RulesByConfigName> {
  const configs = await jsdoc();

  return Object.fromEntries(
    configs.map((config) => [config.name ?? "", config.rules] as const),
  ) as RulesByConfigName;
}

vi.mock(import("eslint-plugin-jsdoc"), () => ({
  default: {
    configs: {
      "flat/contents-typescript-error": {},
      "flat/logical-typescript-error": {},
      "flat/recommended-typescript-error": {},
      "flat/requirements-typescript-error": {},
      "flat/stylistic-typescript-error": {},
    } as (typeof index)["configs"],
    rules: {
      "require-description": {
        create: (): Rule.RuleListener => ({}),
      },
    },
  },
}));

describe("docs configs", () => {
  it("returns eslint-comments configs with custom entries", async () => {
    // Arrange
    const expectedConfigName = "@eslint-community/eslint-comments/custom";

    // Act
    const actualHasExpectedConfig = await comments().then((configs) =>
      configs.some((config) => config.name === expectedConfigName),
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });

  it("returns jsdoc configs with custom entries", async () => {
    // Arrange
    const expectedNames = [
      "jsdoc/custom",
      "jsdoc/require-jsdoc-alias",
      "jsdoc/custom-spec",
    ];

    // Act
    const actualConfigNames = await jsdoc().then((configs) =>
      configs.map((config) => config.name),
    );

    // Assert
    expect(actualConfigNames).toStrictEqual(
      expect.arrayContaining(expectedNames),
    );
  });

  it("exposes custom jsdoc rules", async () => {
    // Arrange
    const expectedCustomRule = { "jsdoc/text-escaping": "off" };

    // Act
    const rulesByConfigName = await loadJsdocRulesByConfigName();

    // Assert
    expect(rulesByConfigName["jsdoc/custom"]).toMatchObject(expectedCustomRule);
    expect(rulesByConfigName["jsdoc/require-jsdoc-alias"]).toMatchObject({
      "jsdoc/require-jsdoc": ["error", expect.any(Object)],
    });
  });
});

import type { Linter, Rule } from "eslint";
import type index from "eslint-plugin-jsdoc";

import { describe, expect, it, vi } from "vitest";

import { comments, jsdoc } from ".";

/** Repo-owned rules keyed by config name. */
type RulesByConfigName = Record<string, Linter.RulesRecord | undefined>;

/** Rule options with an optional contexts selector list. */
interface RuleWithContexts {
  /** AST selectors configured for the rule. */
  contexts?: string[];
}

/**
 * Ensure repo-owned configs apply to TypeScript snippets during integration tests.
 * @param configs The produced config array.
 * @returns The config array with fallback TypeScript file globs.
 * @example
 * ```typescript
 * applyJsdocConfigsToTypeScriptFiles([]);
 * ```
 */
function applyJsdocConfigsToTypeScriptFiles(
  configs: Linter.Config[],
): Linter.Config[] {
  return configs.map((config) =>
    config.files === void 0 ? { ...config, files: ["**/*.ts"] } : config,
  );
}

/**
 * Lint a TypeScript snippet against the real JSDoc config and return its rule IDs.
 * @param code TypeScript source text.
 * @param filePath Virtual file path used for ESLint matching.
 * @returns The linted rule IDs.
 * @example
 * ```typescript
 * await lintTypeScriptSnippetRuleIds("export const value = undefined;", "src/value.ts");
 * ```
 */
async function lintTypeScriptSnippetRuleIds(
  code: string,
  filePath: string,
): Promise<(null | string)[]> {
  vi.doUnmock("eslint-plugin-jsdoc");
  vi.resetModules();
  const { ESLint } = await import("eslint");
  const { jsdoc: loadActualJsdoc } = await import(".");
  const eslint = new ESLint({
    cwd: process.cwd(),
    ignore: false,
    overrideConfig: applyJsdocConfigsToTypeScriptFiles(await loadActualJsdoc()),
    overrideConfigFile: true,
  });
  const [result] = await eslint.lintText(code, { filePath });

  if (result === void 0) {
    throw new Error("Expected ESLint to return a lint result.");
  }

  return result.messages.map((message) => message.ruleId);
}

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

/**
 * Read the configured AST selectors for one repo-owned docs rule.
 * @param rulesByConfigName Repo-owned rules keyed by config name.
 * @param configName Repo-owned config name.
 * @param ruleName Rule name to inspect.
 * @returns The configured selector list.
 * @example
 * ```typescript
 * readRuleContexts({}, "jsdoc/require-jsdoc-alias", "jsdoc/require-jsdoc");
 * ```
 */
function readRuleContexts(
  rulesByConfigName: RulesByConfigName,
  configName: string,
  ruleName: string,
): string[] {
  const rule = rulesByConfigName[configName]?.[ruleName];

  if (!Array.isArray(rule)) {
    return [];
  }

  const [, options] = rule;

  if (
    options === void 0 ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    return [];
  }

  const { contexts } = options as RuleWithContexts;

  return Array.isArray(contexts) ? contexts : [];
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

  it("targets exported variables at the export wrapper node", async () => {
    // Arrange
    const expectedSelector =
      'Program > ExportNamedDeclaration[declaration.type="VariableDeclaration"]';
    const deprecatedSelector =
      "Program > ExportNamedDeclaration > VariableDeclaration";

    // Act
    const actualContexts = readRuleContexts(
      await loadJsdocRulesByConfigName(),
      "jsdoc/require-jsdoc-alias",
      "jsdoc/require-jsdoc",
    );

    // Assert
    expect(actualContexts).toContain(expectedSelector);
    expect(actualContexts).not.toContain(deprecatedSelector);
  });

  it("accepts JSDoc on exported top-level variables", async () => {
    // Arrange
    const code = [
      "/** Describes the exported sentinel value. */",
      "export const EXPLICITLY_NULL = undefined;",
    ].join("\n");

    // Act
    const actualRuleIds = await lintTypeScriptSnippetRuleIds(
      code,
      "src/exported-variable.ts",
    );

    // Assert
    expect(actualRuleIds).not.toContain("jsdoc/require-jsdoc");
  }, 10_000);
});

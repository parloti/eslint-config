import type { Linter } from "eslint";
import type { Mock } from "vitest";

import { afterEach, describe, expect, it, vi } from "vitest";

/** Mocked parser shape used by the docs tests. */
interface IMockedParser {
  /** Mocked parser entry point. */
  parseForESLint: Mock;
}

/** Mocked processor plugin shape used by the docs tests. */
interface IMockedProcessorPlugin {
  /** Mocked processor registry. */
  processors: {
    /** Mocked example processor entry. */
    examples: object;
  };
}

/** Options for mocking the docs dependencies. */
interface IMockJsdocModulesOptions {
  /** Mocked TypeScript disable-type-checked config. */
  disableTypeChecked: object;

  /** Optional mocked JSDoc processor factory. */
  getJsdocProcessorPlugin?: Mock<() => IMockedProcessorPlugin>;

  /** Mocked jsdoc preset config map. */
  jsdocConfigs: Record<string, unknown>;

  /** Mocked jsdoc rules map. */
  jsdocRules: Record<string, unknown> | undefined;

  /** Mocked parser object. */
  parser: IMockedParser;

  /** Mocked plugin object. */
  plugin: Record<string, never>;
}

/** Named preset config shape used by the docs tests. */
interface INamedPresetConfig {
  /** Mocked preset name. */
  name: string;
}

/** Typed test doubles used by the TypeScript example-config test. */
interface ITypeScriptExampleMocks {
  /** Mocked JSDoc processor factory. */
  getJsdocProcessorPlugin: Mock<() => IMockedProcessorPlugin>;

  /** Mocked parser object exposed by typescript-eslint. */
  parser: IMockedParser;

  /** Mocked plugin object exposed by typescript-eslint. */
  plugin: Record<string, never>;
}

/** Named upstream preset configs used by the docs tests. */
const typeScriptPresetNames = [
  "flat/contents-typescript-error",
  "flat/logical-typescript-error",
  "flat/recommended-typescript-error",
  "flat/requirements-typescript-error",
  "flat/stylistic-typescript-error",
] as const;

/**
 * Create a named preset config map for the mocked jsdoc plugin.
 * @returns The named preset config map.
 * @example
 * console.log(createNamedTypeScriptPresetConfigs());
 */
function createNamedTypeScriptPresetConfigs(): Record<
  string,
  INamedPresetConfig
> {
  return Object.fromEntries(
    typeScriptPresetNames.map((name) => [name, { name }] as const),
  );
}

/**
 * Create typed test doubles for the TypeScript example-config test.
 * @returns Mocked parser, plugin, and processor factory values.
 * @example
 * console.log(createTypeScriptExampleMocks());
 */
function createTypeScriptExampleMocks(): ITypeScriptExampleMocks {
  const getJsdocProcessorPlugin: ITypeScriptExampleMocks["getJsdocProcessorPlugin"] =
    vi.fn(() => ({
      processors: {
        examples: {},
      },
    }));

  return {
    getJsdocProcessorPlugin,
    parser: {
      parseForESLint: vi.fn(),
    },
    plugin: {},
  };
}

/**
 * Assert that the TypeScript example configs were created as expected.
 * @param configs The produced config array.
 * @param mocks The mocked parser, plugin, and processor factory.
 * @example
 * console.log("expectTypeScriptExampleConfigs");
 */
function expectTypeScriptExampleConfigs(
  configs: Linter.Config[],
  mocks: ITypeScriptExampleMocks,
): void {
  const { getJsdocProcessorPlugin, parser, plugin } = mocks;
  const customRulesConfig = configs.find(
    (config) => config.name === "jsdoc/custom",
  );
  const defaultExpressionRulesConfig = configs.find(
    (config) => config.name === "jsdoc/typescript-default-expressions/rules",
  );
  const exampleRulesConfig = configs.find(
    (config) => config.name === "jsdoc/typescript-examples/rules",
  );
  const processorConfig = configs.find(
    (config) =>
      config.name ===
      "jsdoc/typescript-examples-and-default-expressions/processor",
  );

  expect(getJsdocProcessorPlugin).toHaveBeenCalledWith({
    checkDefaults: true,
    checkParams: true,
    checkProperties: true,
    parser,
    sourceType: "module",
  });
  expect(processorConfig).toMatchObject({
    files: ["**/*.cts", "**/*.mts", "**/*.ts", "**/*.tsx"],
    processor: "examples/examples",
  });
  expect(exampleRulesConfig).toMatchObject({
    files: ["**/*.md/*.js"],
    languageOptions: {
      parser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": plugin,
    },
    rules: {
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "jsdoc/require-jsdoc": "off",
      "no-unused-expressions": "off",
    },
  });
  expect(customRulesConfig?.rules).toMatchObject({
    "jsdoc/require-throws": "error",
  });
  expect(defaultExpressionRulesConfig).toMatchObject({
    files: [
      "**/*.jsdoc-defaults",
      "**/*.jsdoc-params",
      "**/*.jsdoc-properties",
    ],
    languageOptions: {
      parser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": plugin,
    },
    rules: {
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      strict: "off",
    },
  });
}

/**
 * Load the docs module and return its JSDoc config output.
 * @returns The JSDoc config array.
 * @example
 * console.log("loadJsdocConfigs");
 */
async function loadJsdocConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import(".");

  return documentationModule.jsdoc();
}

/**
 * Mock the optional modules needed by the docs tests.
 * @param options The mocked module inputs.
 * @example
 * console.log("mockJsdocModules");
 */
function mockJsdocModules(options: IMockJsdocModulesOptions): void {
  const {
    disableTypeChecked,
    getJsdocProcessorPlugin,
    jsdocConfigs,
    jsdocRules,
    parser,
    plugin,
  } = options;

  vi.doMock("eslint-plugin-jsdoc", () => ({
    default: {
      configs: jsdocConfigs,
      rules: jsdocRules,
    },
    getJsdocProcessorPlugin,
  }));
  vi.doMock("typescript-eslint", () => ({
    configs: {
      disableTypeChecked,
    },
    parser,
    plugin,
  }));
}

describe("docs branch coverage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments");
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments/configs");
    vi.doUnmock("eslint-plugin-jsdoc");
    vi.doUnmock("typescript-eslint");
  });

  it("handles eslint-comments config without rules", async () => {
    vi.resetModules();
    vi.doMock("@eslint-community/eslint-plugin-eslint-comments", () => ({
      rules: {},
    }));
    vi.doMock(
      "@eslint-community/eslint-plugin-eslint-comments/configs",
      () => ({
        recommended: {},
      }),
    );

    const documentationModule = await import(".");
    const configs = await documentationModule.comments();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("handles jsdoc plugin without rules", async () => {
    const mocks = createTypeScriptExampleMocks();

    vi.resetModules();
    mockJsdocModules({
      disableTypeChecked: { rules: {} },
      jsdocConfigs: createNamedTypeScriptPresetConfigs(),
      jsdocRules: void 0,
      parser: mocks.parser,
      plugin: mocks.plugin,
    });

    const configs = await loadJsdocConfigs();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("adds TypeScript example processor configs when available", async () => {
    const mocks = createTypeScriptExampleMocks();

    vi.resetModules();
    mockJsdocModules({
      disableTypeChecked: {
        rules: {
          "@typescript-eslint/await-thenable": "off",
        },
      },
      getJsdocProcessorPlugin: mocks.getJsdocProcessorPlugin,
      jsdocConfigs: createNamedTypeScriptPresetConfigs(),
      jsdocRules: {
        "require-throws": {},
      },
      parser: mocks.parser,
      plugin: mocks.plugin,
    });

    expect.hasAssertions();

    expectTypeScriptExampleConfigs(await loadJsdocConfigs(), mocks);
  });
});

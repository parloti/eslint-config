import type { Linter } from "eslint";
import type * as jsdocModuleType from "eslint-plugin-jsdoc";
import type { Mock } from "vitest";

import { afterEach, describe, expect, it, vi } from "vitest";

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
  /** Optional mocked JSDoc processor factory. */
  getJsdocProcessorPlugin?: Mock<() => IMockedProcessorPlugin>;
  /** Mocked jsdoc preset config map. */
  jsdocConfigs: Record<string, unknown>;
  /** Mocked jsdoc rules map. */
  jsdocRules: Record<string, unknown> | undefined;
}
/** Named preset config shape used by the docs tests. */
interface INamedPresetConfig {
  /** Mocked preset name. */
  name: string;
}

/** Typed test doubles used by the processor-availability test. */
interface IProcessorMocks {
  /** Mocked JSDoc processor factory. */
  getJsdocProcessorPlugin: Mock<() => IMockedProcessorPlugin>;
}

/** Module namespace type for eslint-plugin-jsdoc mocks. */
type JsdocModule = typeof jsdocModuleType;

/** Mutable jsdoc plugin default export used by module mocks. */
let jsdocPluginMock: JsdocModule["default"] | undefined;

/** Mutable jsdoc processor factory used by module mocks. */
let jsdocProcessorPluginMock:
  | IProcessorMocks["getJsdocProcessorPlugin"]
  | undefined;

/** Named upstream preset configs used by the docs tests. */
const typeScriptPresetNames = [
  "flat/contents-typescript-error",
  "flat/logical-typescript-error",
  "flat/recommended-typescript-error",
  "flat/requirements-typescript-error",
  "flat/stylistic-typescript-error",
] as const;

vi.mock(import("eslint-plugin-jsdoc"), () => {
  if (jsdocPluginMock === void 0) {
    throw new Error("JSDoc plugin mock not defined");
  }

  return {
    default: jsdocPluginMock,
    ...(jsdocProcessorPluginMock === void 0
      ? {}
      : { getJsdocProcessorPlugin: jsdocProcessorPluginMock }),
  } as unknown as Partial<JsdocModule>;
});

/**
 * Create a named preset config map for the mocked jsdoc plugin.
 * @returns The named preset config map.
 * @example
 * ```typescript
 *  console.log(createNamedTypeScriptPresetConfigs());
 * ```
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
 * Create typed test doubles for the processor-availability test.
 * @returns Mocked processor factory values.
 * @example
 * ```typescript
 *  console.log(createProcessorMocks());
 * ```
 */
function createProcessorMocks(): IProcessorMocks {
  const getJsdocProcessorPlugin: IProcessorMocks["getJsdocProcessorPlugin"] =
    vi.fn(() => ({
      processors: {
        examples: {},
      },
    }));

  return {
    getJsdocProcessorPlugin,
  };
}

/**
 * Assert that jsdoc example configs are not emitted by the package.
 * @param configs The produced config array.
 * @param mocks The mocked processor factory.
 * @example
 * ```typescript
 *  console.log("expectNoTypeScriptExampleConfigs");
 * ```
 */
function expectNoTypeScriptExampleConfigs(
  configs: Linter.Config[],
  mocks: IProcessorMocks,
): void {
  const customRulesConfig: Linter.Config | undefined = configs.find(
    (config) => config.name === "jsdoc/custom",
  );
  const defaultExpressionRulesConfig: Linter.Config | undefined = configs.find(
    (config) => config.name === "jsdoc/typescript-default-expressions/rules",
  );
  const exampleRulesConfig: Linter.Config | undefined = configs.find(
    (config) => config.name === "jsdoc/typescript-examples/rules",
  );
  const processorConfig: Linter.Config | undefined = configs.find(
    (config) =>
      config.name ===
      "jsdoc/typescript-examples-and-default-expressions/processor",
  );

  expect(mocks.getJsdocProcessorPlugin).not.toHaveBeenCalled();
  expect(customRulesConfig?.rules).toMatchObject({
    "jsdoc/convert-to-jsdoc-comments": [
      "error",
      { enforceJsdocLineStyle: "single" },
    ],
    "jsdoc/text-escaping": "off",
  });
  expect(defaultExpressionRulesConfig).toBeUndefined();
  expect(exampleRulesConfig).toBeUndefined();
  expect(processorConfig).toBeUndefined();
}

/**
 * Load the docs module and return its comments config output.
 * @returns The comments config array.
 * @example
 * ```typescript
 *  console.log("loadCommentsConfigs");
 * ```
 */
async function loadCommentsConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import(".");

  return documentationModule.comments();
}

/**
 * Load the docs module and return its JSDoc config output.
 * @returns The JSDoc config array.
 * @example
 * ```typescript
 *  console.log("loadJsdocConfigs");
 * ```
 */
async function loadJsdocConfigs(): Promise<Linter.Config[]> {
  const documentationModule = await import(".");

  return documentationModule.jsdoc();
}

/**
 * Mock the optional modules needed by the docs tests.
 * @param options The mocked module inputs.
 * @example
 * ```typescript
 *  console.log("mockJsdocModules");
 * ```
 */
function mockJsdocModules(options: IMockJsdocModulesOptions): void {
  const { getJsdocProcessorPlugin, jsdocConfigs, jsdocRules } = options;

  jsdocPluginMock = {
    configs: jsdocConfigs,
    rules: jsdocRules,
  } as unknown as JsdocModule["default"];
  jsdocProcessorPluginMock = getJsdocProcessorPlugin;
}

describe("docs branch coverage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments");
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments/configs");
    jsdocPluginMock = void 0;
    jsdocProcessorPluginMock = void 0;
  });

  it("handles eslint-comments config without rules", async () => {
    // Arrange
    vi.resetModules();
    vi.doMock(
      import("@eslint-community/eslint-plugin-eslint-comments"),
      () => ({
        rules: {},
      }),
    );
    vi.doMock(
      import("@eslint-community/eslint-plugin-eslint-comments/configs"),
      () => ({
        recommended: {},
      }),
    );

    // Act
    const configs = await loadCommentsConfigs();

    // Assert
    expect(configs).toHaveLength(2);
  });

  it("handles jsdoc plugin without rules", async () => {
    // Arrange
    vi.resetModules();
    mockJsdocModules({
      jsdocConfigs: createNamedTypeScriptPresetConfigs(),
      jsdocRules: void 0,
    });

    // Act
    const configs = await loadJsdocConfigs();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  }, 10_000);

  it("keeps loading the remaining presets when one upstream entry is an array", async () => {
    // Arrange
    vi.resetModules();
    mockJsdocModules({
      jsdocConfigs: {
        ...createNamedTypeScriptPresetConfigs(),
        "flat/contents-typescript-error": [],
      },
      jsdocRules: {},
    });

    // Act
    const configs = await loadJsdocConfigs();

    // Assert
    expect(
      configs.some(
        (config) => config.name === "flat/recommended-typescript-error",
      ),
    ).toBe(true);
  }, 10_000);

  it("returns repo-owned configs when upstream presets are missing", async () => {
    // Arrange
    vi.resetModules();
    vi.doMock(import("eslint-plugin-jsdoc"), () => {
      return {
        default: {
          configs: {},
          rules: {},
        } as unknown as JsdocModule["default"],
      } as unknown as Partial<JsdocModule>;
    });
    // Act
    const configs = await loadJsdocConfigs();

    // Assert
    expect(configs.some((config) => config.name === "jsdoc/custom")).toBe(true);
  }, 10_000);

  it("does not emit processor-backed example configs when available", async () => {
    // Arrange
    const mocks = createProcessorMocks();
    vi.resetModules();
    mockJsdocModules({
      getJsdocProcessorPlugin: mocks.getJsdocProcessorPlugin,
      jsdocConfigs: createNamedTypeScriptPresetConfigs(),
      jsdocRules: { "require-throws": {} },
    });

    // Act
    const configs = await loadJsdocConfigs();

    // Assert
    expect(configs.length).toBeGreaterThan(0);

    expectNoTypeScriptExampleConfigs(configs, mocks);
  }, 10_000);
});

import type { Linter } from "eslint";
import type { Mock } from "vitest";

import { afterEach, describe, expect, it, vi } from "vitest";

/** Mocked parser shape used by the fallback docs test. */
interface IMockedParser {
  /** Mocked parser entry point. */
  parseForESLint: Mock;
}

/** Mocked processor plugin shape used by the fallback docs test. */
interface IMockedProcessorPlugin {
  /** Mocked processor registry. */
  processors: {
    /** Mocked example processor entry. */
    examples: object;
  };
}

/** Named preset config shape used by the fallback docs test. */
interface INamedPresetConfig {
  /** Mocked preset name. */
  name: string;
}

/** Named upstream preset configs used by the fallback docs test. */
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
 * Mock the fallback jsdoc and typescript-eslint module state.
 * @param invalidPresetConfigs The mocked preset config map with invalid entries.
 * @param parser The mocked parser object.
 * @example
 * console.log("mockFallbackModules");
 */
function mockFallbackModules(
  invalidPresetConfigs: Record<string, unknown>,
  parser: IMockedParser,
): void {
  vi.resetModules();
  vi.doMock("eslint-plugin-jsdoc", () => ({
    default: {
      configs: {
        ...invalidPresetConfigs,
        "flat/contents-typescript-error": "invalid",
        "flat/recommended-typescript-error": [],
      },
      rules: {},
    },
    getJsdocProcessorPlugin: vi.fn<() => IMockedProcessorPlugin>(() => ({
      processors: {
        examples: {},
      },
    })),
  }));
  vi.doMock("typescript-eslint", () => ({
    configs: {
      disableTypeChecked: {},
    },
    parser,
    plugin: {},
  }));
}

describe("docs fallback coverage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("eslint-plugin-jsdoc");
    vi.doUnmock("typescript-eslint");
  });

  it("skips invalid preset entries and falls back when disableTypeChecked rules are missing", async () => {
    const invalidPresetConfigs = createNamedTypeScriptPresetConfigs();
    const parser: IMockedParser = { parseForESLint: vi.fn() };

    delete invalidPresetConfigs["flat/stylistic-typescript-error"];
    mockFallbackModules(invalidPresetConfigs, parser);

    const configs = await loadJsdocConfigs();
    const exampleRulesConfig = configs.find(
      (config) => config.name === "jsdoc/typescript-examples/rules",
    );

    expect(
      configs.some((config) => config.name === "flat/logical-typescript-error"),
    ).toBe(true);
    expect(
      configs.some(
        (config) => config.name === "flat/recommended-typescript-error",
      ),
    ).toBe(false);
    expect(
      configs.some(
        (config) => config.name === "flat/stylistic-typescript-error",
      ),
    ).toBe(false);
    expect(exampleRulesConfig?.rules).toMatchObject({
      "@typescript-eslint/no-unused-expressions": "off",
      "no-unused-expressions": "off",
    });
  });
});

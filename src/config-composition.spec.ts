import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

import type * as configsModuleType from "./configs";
import type { ConfigOptions } from "./types";

import {
  fullCompositionNames,
  reducedCompositionNames,
} from "./config-composition";

/** Minimal config-composition options used in these tests. */
type CompositionOptions = Pick<ConfigOptions, "disabledPlugins" | "rules">;

/** Module namespace type for mocked config loader exports. */
type ConfigsModule = typeof configsModuleType;

/** Mutable configs module used by import mocks. */
let configsModuleMock: Partial<ConfigsModule> | undefined;

vi.mock(import("./configs"), () => {
  if (configsModuleMock === void 0) {
    throw new Error("Configs module mock not defined");
  }

  return configsModuleMock;
});

/**
 * Load and execute the composed config builder under test.
 * @param options Config options passed to the composed builder.
 * @returns The composed ESLint config array.
 * @example
 * ```typescript
 * await loadComposedConfig({});
 * ```
 */
async function loadComposedConfig(
  options: CompositionOptions,
): Promise<Linter.Config[]> {
  const { config } = await import("./index");

  return config(options);
}

/**
 * Mock all plugin loaders to return small sample configurations.
 * @example
 * ```typescript
 * mockAllEnabled();
 * ```
 */
function mockAllEnabled(): void {
  configsModuleMock = {
    boundaries: (): Linter.Config[] => [{ name: "architecture-boundaries" }],
    codeperfect: (): Linter.Config[] => [{ name: "core-codeperfect" }],
    comments: (): Linter.Config[] => [{ name: "docs-comments" }],
    eslint: (): Linter.Config[] => [{ name: "core-eslint" }],
    importX: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("architecture-import-x");

      return configs;
    },
    jasmine: (): Linter.Config[] => [{ name: "testing-jasmine" }],
    jest: (): Linter.Config[] => [{ name: "testing-jest" }],
    jsdoc: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("docs-jsdoc");

      return configs;
    },
    perfectionist: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("style-perfectionist");

      return configs;
    },
    playwright: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("testing-playwright");

      return configs;
    },
    prettier: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("style-prettier");

      return configs;
    },
    resolver: (): Linter.Config[] => [{ name: "core-resolver" }],
    rxjsX: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("domain-rxjs");

      return configs;
    },
    stylistic: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("style-stylistic");

      return configs;
    },
    typescript: (): Linter.Config[] => [{ name: "core-typescript" }],
    unicorn: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("style-unicorn");

      return configs;
    },
    vitest: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("testing-vitest");

      return configs;
    },
  } as unknown as Partial<ConfigsModule>;
}

/**
 * Resolve one async config loader result while satisfying mock-loader lint rules.
 * @param name The mock config name to return.
 * @returns A promise that resolves to one named config.
 * @example
 * ```typescript
 * await resolveAsyncConfig("docs-jsdoc");
 * ```
 */
async function resolveAsyncConfig(name: string): Promise<Linter.Config[]> {
  const configs = await Promise.resolve([{ name }]);

  return configs;
}

describe("config composition", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    configsModuleMock = void 0;
  });

  it("preserves the documented composition order", async () => {
    // Arrange
    vi.resetModules();
    mockAllEnabled();

    // Act
    const actualResultNames = await loadComposedConfig({}).then((configs) =>
      configs.map((entry) => entry.name),
    );

    // Assert
    expect(actualResultNames).toStrictEqual(fullCompositionNames);
  });

  it("removes disabled modules without disturbing remaining order", async () => {
    // Arrange
    vi.resetModules();
    mockAllEnabled();

    // Act
    const actualResultNames = await loadComposedConfig({
      disabledPlugins: ["boundaries", "prettier", "vitest"],
    }).then((configs) => configs.map((entry) => entry.name));

    // Assert
    expect(actualResultNames).toStrictEqual(reducedCompositionNames);
  });

  it("applies rule overrides after all enabled modules", async () => {
    // Arrange
    vi.resetModules();
    mockAllEnabled();

    // Act
    const actualLastEntry = await loadComposedConfig({
      rules: { "no-console": "off" },
    }).then((configs) => configs.at(-1));

    // Assert
    expect(actualLastEntry).toMatchObject({
      name: "custom/rule-overrides",
      rules: { "no-console": "off" },
    });
  });
});

import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

import type * as InfrastructureModule from "../infrastructure";
import type { ConfigOptions } from "./types";

import {
  defaultCompositionNames,
  fullCompositionNames,
  reducedCompositionNames,
} from "./config-composition";

/** Minimal config-composition options used in these tests. */
type CompositionOptions = Pick<ConfigOptions, "plugins">;

/** Module namespace type for mocked config loader exports. */
type ConfigsModule = typeof InfrastructureModule;

/** Mutable configs module used by import mocks. */
let configsModuleMock: Partial<ConfigsModule> | undefined;

/** Captured config result paired with the first stderr message. */
interface IConfigOutcome {
  /** First stderr message emitted while composing config. */
  firstMessage: string | undefined;

  /** Names of composed config entries. */
  names: (string | undefined)[];
}

vi.mock(import("../infrastructure/configs"), () => {
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
  const { config } = await import("../index");

  return config(options);
}

/**
 * Load config names while capturing the first stderr message.
 * @param options Config options passed to the composed builder.
 * @returns Composed config names and the first stderr message.
 * @example
 * ```typescript
 * await loadCompositionOutcome({});
 * ```
 */
async function loadCompositionOutcome(
  options: CompositionOptions,
): Promise<IConfigOutcome> {
  let firstMessage: string | undefined;
  vi.spyOn(process.stderr, "write").mockImplementation(
    (chunk: string | Uint8Array) => {
      firstMessage ??= String(chunk);

      return true;
    },
  );
  const names = await loadComposedConfig(options).then((configs) =>
    configs.map((entry) => entry.name),
  );

  return { firstMessage, names };
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
    angularEslint: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("runtime-angular-eslint");

      return configs;
    },
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
    vitestE2e: async (): Promise<Linter.Config[]> => {
      const configs = await resolveAsyncConfig("testing-vitest-e2e");

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
    configsModuleMock = void 0;
  });

  it("preserves the documented default composition order", async () => {
    // Arrange
    mockAllEnabled();

    // Act
    const actualResultNames = await loadComposedConfig({}).then((configs) =>
      configs.map((entry) => entry.name),
    );

    // Assert
    expect(actualResultNames).toStrictEqual(defaultCompositionNames);
  });

  it("removes explicitly disabled modules without disturbing remaining order", async () => {
    // Arrange
    mockAllEnabled();

    // Act
    const actualResultNames = await loadComposedConfig({
      plugins: { boundaries: false, prettier: false, vitest: false },
    }).then((configs) => configs.map((entry) => entry.name));

    // Assert
    expect(actualResultNames).toStrictEqual(reducedCompositionNames);
  });

  it("allows explicitly enabling default-disabled testing plugins", async () => {
    // Arrange
    mockAllEnabled();

    // Act
    const outcome = await loadCompositionOutcome({
      plugins: {
        "angular-eslint": true,
        jasmine: true,
        jest: true,
        "vitest-e2e": true,
      },
    });

    // Assert
    expect(outcome.names).toStrictEqual(fullCompositionNames);
    expect(outcome.firstMessage).toBeUndefined();
  });

  it("warns when a default-disabled plugin is redundantly disabled", async () => {
    // Arrange
    mockAllEnabled();
    const untypedOptions = {
      plugins: { jest: false },
    } as unknown as CompositionOptions;

    // Act
    const outcome = await loadCompositionOutcome(untypedOptions);

    // Assert
    expect(outcome.names).toStrictEqual(defaultCompositionNames);
    expect(outcome.firstMessage).toContain(
      "Redundant plugin state override: jest",
    );
  });

  it("warns when a default-enabled plugin is redundantly enabled", async () => {
    // Arrange
    mockAllEnabled();
    const untypedOptions = {
      plugins: { vitest: true },
    } as unknown as CompositionOptions;

    // Act
    const outcome = await loadCompositionOutcome(untypedOptions);

    // Assert
    expect(outcome.names).toStrictEqual(defaultCompositionNames);
    expect(outcome.firstMessage).toContain(
      "Redundant plugin state override: vitest",
    );
  });
});

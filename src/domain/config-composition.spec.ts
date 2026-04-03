import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

// eslint-disable-next-line import-x/no-internal-modules -- The test must mock the exact module consumed by plugin-loaders.
import type * as configsModuleType from "../infrastructure/configs";
import type { ConfigOptions } from "./types";

import {
  defaultCompositionNames,
  fullCompositionNames,
  reducedCompositionNames,
} from "./config-composition";

/** Minimal config-composition options used in these tests. */
type CompositionOptions = Pick<ConfigOptions, "plugins" | "rules">;

/** Module namespace type for mocked config loader exports. */
type ConfigsModule = typeof configsModuleType;

/** Mutable configs module used by import mocks. */
let configsModuleMock: Partial<ConfigsModule> | undefined;

/** Captured config result paired with the first stderr message. */
interface IConfigOutcome {
  /** First stderr message emitted while composing config. */
  firstMessage: string | undefined;

  /** Names of composed config entries. */
  names: (string | undefined)[];
}

vi.mock(
  // eslint-disable-next-line import-x/no-internal-modules -- The mock path must match the implementation import exactly.
  import("../infrastructure/configs"),
  () => {
    if (configsModuleMock === void 0) {
      throw new Error("Configs module mock not defined");
    }

    return configsModuleMock;
  },
);

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
    vi.restoreAllMocks();
    configsModuleMock = void 0;
  });

  it("preserves the documented default composition order", async () => {
    // Arrange
    vi.resetModules();
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
    vi.resetModules();
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
    vi.resetModules();
    mockAllEnabled();

    // Act
    const outcome = await loadCompositionOutcome({
      plugins: { jasmine: true, jest: true },
    });

    // Assert
    expect(outcome.names).toStrictEqual(fullCompositionNames);
    expect(outcome.firstMessage).toBeUndefined();
  });

  it("warns when a default-disabled plugin is redundantly disabled", async () => {
    // Arrange
    vi.resetModules();
    mockAllEnabled();

    // Act
    const outcome = await loadCompositionOutcome({
      plugins: { jest: false },
    });

    // Assert
    expect(outcome.names).toStrictEqual(defaultCompositionNames);
    expect(outcome.firstMessage).toContain(
      "Redundant plugin state override: jest",
    );
  });

  it("warns when a default-enabled plugin is redundantly enabled", async () => {
    // Arrange
    vi.resetModules();
    mockAllEnabled();

    // Act
    const outcome = await loadCompositionOutcome({
      plugins: { vitest: true },
    });

    // Assert
    expect(outcome.names).toStrictEqual(defaultCompositionNames);
    expect(outcome.firstMessage).toContain(
      "Redundant plugin state override: vitest",
    );
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

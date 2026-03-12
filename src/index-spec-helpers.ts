import type { Linter } from "eslint";

import { vi } from "vitest";

import type * as ConfigsModule from "./configs";
import type { PluginName } from "./types";

/** List of supported plugin names used in config tests. */
const allPlugins = [
  "eslint",
  "resolver",
  "typescript",
  "boundaries",
  "import-x",
  "comments",
  "jsdoc",
  "jasmine",
  "jest",
  "playwright",
  "vitest",
  "rxjs-x",
  "perfectionist",
  "prettier",
  "stylistic",
  "unicorn",
] as const satisfies PluginName[];

/**
 * Mock all plugin loaders to return empty configurations.
 * @example
 * ```typescript
 * mockAllEmpty();
 * ```
 */
function mockAllEmpty(): void {
  vi.doMock("./configs", () => ({
    boundaries: (): Linter.Config[] => [],
    comments: (): Linter.Config[] => [],
    eslint: (): Linter.Config[] => [],
    importX: (): Linter.Config[] => [],
    jasmine: (): Linter.Config[] => [],
    jest: (): Linter.Config[] => [],
    jsdoc: (): Linter.Config[] => [],
    perfectionist: (): Linter.Config[] => [],
    playwright: (): Linter.Config[] => [],
    prettier: (): Linter.Config[] => [],
    resolver: (): Linter.Config[] => [],
    rxjsX: (): Linter.Config[] => [],
    stylistic: (): Linter.Config[] => [],
    typescript: (): Linter.Config[] => [],
    unicorn: async (): Promise<Linter.Config[]> => {
      const configs = await Promise.resolve([] as Linter.Config[]);

      return configs;
    },
    vitest: (): Linter.Config[] => [],
  }));
}

/**
 * Mock all plugin loaders to return small sample configurations.
 * @example
 * ```typescript
 * mockAllEnabled();
 * ```
 */
function mockAllEnabled(): void {
  vi.doMock("./configs", () => ({
    boundaries: (): Linter.Config[] => [{ name: "architecture-boundaries" }],
    comments: (): Linter.Config[] => [{ name: "docs-comments" }],
    eslint: (): Linter.Config[] => [{ name: "core-eslint" }],
    importX: (): Linter.Config[] => [{ name: "architecture-import-x" }],
    jasmine: (): Linter.Config[] => [{ name: "testing-jasmine" }],
    jest: (): Linter.Config[] => [{ name: "testing-jest" }],
    jsdoc: (): Linter.Config[] => [{ name: "docs-jsdoc" }],
    perfectionist: (): Linter.Config[] => [{ name: "style-perfectionist" }],
    playwright: (): Linter.Config[] => [{ name: "testing-playwright" }],
    prettier: (): Linter.Config[] => [{ name: "style-prettier" }],
    resolver: (): Linter.Config[] => [{ name: "core-resolver" }],
    rxjsX: (): Linter.Config[] => [{ name: "domain-rxjs" }],
    stylistic: (): Linter.Config[] => [{ name: "style-stylistic" }],
    typescript: (): Linter.Config[] => [{ name: "core-typescript" }],
    unicorn: async (): Promise<Linter.Config[]> => {
      const configs = await Promise.resolve([{ name: "style-unicorn" }]);

      return configs;
    },
    vitest: (): Linter.Config[] => [{ name: "testing-vitest" }],
  }));
}

/**
 * Mock architecture loaders so `boundaries` only activates with repository input.
 * @example
 * ```typescript
 * mockBoundariesAware();
 * ```
 */
function mockBoundariesAware(): void {
  vi.doMock("./configs", () => ({
    boundaries: (boundaries: unknown): Linter.Config[] =>
      boundaries === void 0 ? [] : [{ name: "architecture-boundaries" }],
    comments: (): Linter.Config[] => [{ name: "docs-comments" }],
    eslint: (): Linter.Config[] => [{ name: "core-eslint" }],
    importX: (): Linter.Config[] => [{ name: "architecture-import-x" }],
    jasmine: (): Linter.Config[] => [{ name: "testing-jasmine" }],
    jest: (): Linter.Config[] => [{ name: "testing-jest" }],
    jsdoc: (): Linter.Config[] => [{ name: "docs-jsdoc" }],
    perfectionist: (): Linter.Config[] => [{ name: "style-perfectionist" }],
    playwright: (): Linter.Config[] => [{ name: "testing-playwright" }],
    prettier: (): Linter.Config[] => [{ name: "style-prettier" }],
    resolver: (): Linter.Config[] => [{ name: "core-resolver" }],
    rxjsX: (): Linter.Config[] => [{ name: "domain-rxjs" }],
    stylistic: (): Linter.Config[] => [{ name: "style-stylistic" }],
    typescript: (): Linter.Config[] => [{ name: "core-typescript" }],
    unicorn: async (): Promise<Linter.Config[]> => {
      const configs = await Promise.resolve([{ name: "style-unicorn" }]);

      return configs;
    },
    vitest: (): Linter.Config[] => [{ name: "testing-vitest" }],
  }));
}

/**
 * Mock non-core plugin loaders to return empty configs.
 * @example
 * ```typescript
 * mockNonCoreEmpty();
 * ```
 */
function mockNonCoreEmpty(): void {
  vi.doMock("./configs", async () => {
    const actual = await vi.importActual<typeof ConfigsModule>("./configs");

    return {
      ...actual,
      boundaries: (): Linter.Config[] => [],
      comments: (): Linter.Config[] => [],
      importX: (): Linter.Config[] => [],
      jasmine: (): Linter.Config[] => [],
      jest: (): Linter.Config[] => [],
      jsdoc: (): Linter.Config[] => [],
      perfectionist: (): Linter.Config[] => [],
      playwright: (): Linter.Config[] => [],
      prettier: (): Linter.Config[] => [],
      rxjsX: (): Linter.Config[] => [],
      stylistic: (): Linter.Config[] => [],
      unicorn: async (): Promise<Linter.Config[]> => {
        const configs = await Promise.resolve([] as Linter.Config[]);

        return configs;
      },
      vitest: (): Linter.Config[] => [],
    };
  });
}

/**
 * Mock a config composition where required loaders succeed and one optional loader fails.
 * @example
 * ```typescript
 * mockOptionalResolverFailure();
 * ```
 */
function mockOptionalResolverFailure(): void {
  vi.doMock("./configs", () => {
    return {
      boundaries: (): Linter.Config[] => [],
      comments: (): Linter.Config[] => [],
      eslint: (): Linter.Config[] => [{ name: "core-eslint" }],
      importX: (): Linter.Config[] => [],
      jasmine: (): Linter.Config[] => [],
      jest: (): Linter.Config[] => [],
      jsdoc: (): Linter.Config[] => [],
      perfectionist: (): Linter.Config[] => [],
      playwright: (): Linter.Config[] => [],
      prettier: (): Linter.Config[] => [],
      resolver: async (): Promise<Linter.Config[]> => {
        await Promise.resolve();

        throw new Error(
          "Cannot find module 'eslint-import-resolver-typescript'",
        );
      },
      rxjsX: (): Linter.Config[] => [],
      stylistic: (): Linter.Config[] => [],
      typescript: (): Linter.Config[] => [{ name: "core-typescript" }],
      unicorn: (): Linter.Config[] => [],
      vitest: (): Linter.Config[] => [],
    };
  });
}

export {
  allPlugins,
  mockAllEmpty,
  mockAllEnabled,
  mockBoundariesAware,
  mockNonCoreEmpty,
  mockOptionalResolverFailure,
};

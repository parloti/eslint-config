import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  fullCompositionNames,
  reducedCompositionNames,
} from "./config-composition";

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
    unicorn: (): Linter.Config[] => [{ name: "style-unicorn" }],
    vitest: (): Linter.Config[] => [{ name: "testing-vitest" }],
  }));
}

describe("config composition", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("./configs");
  });

  it("preserves the documented composition order", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const result = await config({});

    expect(result.map((entry) => entry.name)).toStrictEqual(
      fullCompositionNames,
    );
  });

  it("removes disabled modules without disturbing remaining order", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const result = await config({
      disabledPlugins: ["boundaries", "prettier", "vitest"],
    });

    expect(result.map((entry) => entry.name)).toStrictEqual(
      reducedCompositionNames,
    );
  });

  it("applies rule overrides after all enabled modules", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const result = await config({ rules: { "no-console": "off" } });

    expect(result.at(-1)).toMatchObject({
      name: "custom/rule-overrides",
      rules: { "no-console": "off" },
    });
  });
});

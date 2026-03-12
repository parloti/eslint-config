import type _default from "typescript-eslint";

import { describe, expect, it, vi } from "vitest";

import { typescript } from "./typescript";

/** Type definition for rule data. */
type CompatibleConfigArray = TypescriptEslintModule["configs"]["all"];

/** Type definition for rule data. */
type TypescriptEslintModule = typeof _default;

vi.mock(
  import("typescript-eslint"),
  () =>
    ({
      configs: { all: [] as CompatibleConfigArray },
    }) as TypescriptEslintModule,
);

describe("typescript config", () => {
  it("returns custom configs", async () => {
    const configs = await typescript();

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "@typescript-eslint/custom"),
    ).toBe(true);
  });
});

import type _default from "typescript-eslint";

import { describe, expect, it, vi } from "vitest";

import { eslint } from "./eslint";
import * as core from "./index";
import { resolver } from "./resolver";
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

describe("core configs", () => {
  it("returns eslint configs with custom entries", () => {
    const configs = eslint();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "@eslint/js/custom")).toBe(
      true,
    );
    expect(
      configs.some((config) => config.name === "@eslint/js/custom-spec"),
    ).toBe(true);
  });

  it("returns resolver settings", async () => {
    const configs = await resolver();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs[0]?.settings).toBeDefined();
  });

  it("returns typescript configs with custom entries", async () => {
    const configs = await typescript();

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "@typescript-eslint/custom"),
    ).toBe(true);
    expect(
      configs.some(
        (config) => config.name === "@typescript-eslint/custom-spec",
      ),
    ).toBe(true);
  });

  it("re-exports the core config builders", () => {
    expect(core.eslint).toBe(eslint);
    expect(core.resolver).toBe(resolver);
    expect(core.typescript).toBe(typescript);
  });
});

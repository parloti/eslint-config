import { afterEach, describe, expect, it, vi } from "vitest";

import type { BoundariesConfig } from "./types";

import {
  allPlugins,
  mockAllEmpty,
  mockAllEnabled,
  mockBoundariesAware,
  mockNonCoreEmpty,
  mockOptionalResolverFailure,
} from "./index-spec-helpers";

describe("index spec helpers", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("./configs");
  });

  it("tracks every documented plugin name", () => {
    expect(allPlugins).toStrictEqual([
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
    ]);
  });

  it("mocks every loader as empty", async () => {
    vi.resetModules();
    mockAllEmpty();

    const configs = await import("./configs");

    expect([
      configs.boundaries(),
      configs.rxjsX(),
      configs.jasmine(),
      configs.jest(),
      configs.playwright(),
      configs.vitest(),
    ]).toStrictEqual([[], [], [], [], [], []]);
  });

  it("mocks every loader with sample configs", async () => {
    vi.resetModules();
    mockAllEnabled();

    const configs = await import("./configs");
    const importXConfigs = await configs.importX();
    const commentConfigs = await configs.comments();
    const vitestConfigs = await configs.vitest();

    expect(importXConfigs[0]?.name).toBe("architecture-import-x");
    expect(commentConfigs[0]?.name).toBe("docs-comments");
    expect(vitestConfigs[0]?.name).toBe("testing-vitest");
  });

  it("mocks non-core loaders as empty", async () => {
    vi.resetModules();
    mockNonCoreEmpty();

    const configs = await import("./configs");

    await expect(
      Promise.all([
        Promise.resolve(configs.importX()),
        Promise.resolve(configs.boundaries()),
        Promise.resolve(configs.rxjsX()),
        configs.unicorn(),
      ]),
    ).resolves.toStrictEqual([[], [], [], []]);
  });

  it("makes boundaries depend on repository input", async () => {
    vi.resetModules();
    mockBoundariesAware();

    const { boundaries } = await import("./configs");
    const input: BoundariesConfig = {
      elements: [{ pattern: "src/app/**/*", type: "app" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["src/**/*.ts"],
    };

    expect(boundaries()).toStrictEqual([]);
    expect(boundaries(input)[0]?.name).toBe("architecture-boundaries");
  });

  it("makes the optional resolver fail on demand", async () => {
    vi.resetModules();
    mockOptionalResolverFailure();

    const { resolver } = await import("./configs");

    await expect(resolver()).rejects.toThrowError(
      "Cannot find module 'eslint-import-resolver-typescript'",
    );
  });
});

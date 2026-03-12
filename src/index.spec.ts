import { afterEach, describe, expect, it, vi } from "vitest";

import {
  allPlugins,
  mockAllEmpty,
  mockAllEnabled,
  mockBoundariesAware,
  mockOptionalResolverFailure,
} from "./index-spec-helpers";

describe("config", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("./configs");
  });

  it("supports a pilot-style config with explicit disables and overrides", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const result = await config({
      disabledPlugins: [
        "boundaries",
        "jasmine",
        "jest",
        "playwright",
        "rxjs-x",
      ],
      rules: {
        "import-x/no-nodejs-modules": "off",
        "sort-keys": "off",
      },
    });

    expect(result.length).toBeGreaterThan(0);
    expect(
      result.some((entry) => entry.name === "architecture-boundaries"),
    ).toBe(false);
    expect(result.some((entry) => entry.name === "custom/rule-overrides")).toBe(
      true,
    );
    expect(result.some((entry) => entry.name === "testing-vitest")).toBe(true);
  });

  it("returns empty when all configs are empty", async () => {
    vi.resetModules();
    mockAllEmpty();

    const { config } = await import("./index");
    const result = await config({
      disabledPlugins: [...allPlugins],
    });

    expect(result).toStrictEqual([]);
  });

  it("includes plugin configs when enabled", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const result = await config({});

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((entry) => entry.name === "testing-vitest")).toBe(true);
  });

  it("returns deterministic output for the same options", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const firstResult = await config({ disabledPlugins: ["boundaries"] });
    const secondResult = await config({ disabledPlugins: ["boundaries"] });

    expect(firstResult.map((entry) => entry.name)).toStrictEqual(
      secondResult.map((entry) => entry.name),
    );
  });

  it("omits disabled plugin configs from the final output", async () => {
    vi.resetModules();
    mockAllEnabled();

    const { config } = await import("./index");
    const result = await config({
      disabledPlugins: ["boundaries", "vitest"],
    });

    expect(
      result.some((entry) => entry.name === "architecture-boundaries"),
    ).toBe(false);
    expect(result.some((entry) => entry.name === "testing-vitest")).toBe(false);
  });

  it("only includes boundaries when repository input is provided", async () => {
    vi.resetModules();
    mockAllEnabled();
    mockBoundariesAware();

    const { config } = await import("./index");
    const withoutBoundaries = await config({});
    const withBoundaries = await config({
      boundaries: {
        elements: [{ pattern: "src/app/**/*", type: "app" }],
        elementTypes: ["error", { default: "disallow", rules: [] }],
        files: ["src/**/*.ts"],
      },
    });

    expect(
      withoutBoundaries.some(
        (entry) => entry.name === "architecture-boundaries",
      ),
    ).toBe(false);
    expect(
      withBoundaries.some((entry) => entry.name === "architecture-boundaries"),
    ).toBe(true);
  });

  it("keeps required configs when optional loaders fail", async () => {
    vi.resetModules();
    mockOptionalResolverFailure();

    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    const { config } = await import("./index");
    const result = await config({ disabledPlugins: ["boundaries"] });

    expect(result.some((entry) => entry.name === "core-eslint")).toBe(true);
    expect(result.some((entry) => entry.name === "core-typescript")).toBe(true);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      "Skipped optional ESLint plugin config: resolver",
    );

    stderrSpy.mockRestore();
  });

  it("exposes only the supported runtime exports", async () => {
    vi.resetModules();
    mockAllEmpty();

    const moduleExports = await import("./index");

    expect(Object.keys(moduleExports).toSorted()).toStrictEqual(["config"]);
    expect("tsConfig" in moduleExports).toBe(false);
    expect("createConfig" in moduleExports).toBe(false);
    expect("all" in moduleExports).toBe(false);
    expect("strict" in moduleExports).toBe(false);
  });
});

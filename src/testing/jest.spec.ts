import type EslintPluginJestModule from "eslint-plugin-jest";

import { describe, expect, it, vi } from "vitest";

import { jest } from "./jest";

vi.mock(
  import("eslint-plugin-jest"),
  () => ({ configs: { "flat/all": {} } }) as typeof EslintPluginJestModule,
);

describe("jest config", () => {
  it("returns configs", async () => {
    const configs = await jest();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jest/custom")).toBe(true);
  });
});

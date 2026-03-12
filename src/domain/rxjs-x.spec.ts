import type rxjsX from "eslint-plugin-rxjs-x";

import { describe, expect, it, vi } from "vitest";

import { rxjsX as getRxjsXConfig } from "./rxjs-x";

vi.mock(import("eslint-plugin-rxjs-x"), () => ({
  default: {
    configs: { strict: {} },
  } as typeof rxjsX,
}));

describe("rxjs-x config", () => {
  it("returns custom configs", async () => {
    const configs = await getRxjsXConfig();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "rxjs-x/custom")).toBe(
      true,
    );
  });
});

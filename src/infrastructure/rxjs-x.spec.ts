import type * as EslintPluginRxjsXModule from "eslint-plugin-rxjs-x";

import { describe, expect, it, vi } from "vitest";

import { rxjsX } from "./rxjs-x";

vi.mock(
  import("eslint-plugin-rxjs-x"),
  createMockProxy<typeof EslintPluginRxjsXModule>({
    default: {
      configs: { strict: {} },
    },
  }),
);

describe("rxjs-x config", () => {
  it("returns custom configs", async () => {
    // Arrange
    const expectedConfigName = "rxjs-x/custom";

    // Act
    const { hasExpectedConfig } = await (async () => {
      const configs = await rxjsX();

      return {
        hasExpectedConfig: configs.some(
          (config) => config.name === expectedConfigName,
        ),
      };
    })();

    // Assert
    expect(hasExpectedConfig).toBe(true);
  });
});

import type * as codeperfectPluginModuleType from "@codeperfect/eslint-plugin";
import type { CodeperfectPreset } from "@codeperfect/eslint-plugin";

import { describe, expect, it, vi } from "vitest";

import { codeperfect } from "./codeperfect";

vi.mock(
  import("@codeperfect/eslint-plugin"),
  createMockProxy<typeof codeperfectPluginModuleType>({
    all: { name: "codeperfect/all" } as CodeperfectPreset,
  }),
);

describe("codeperfect config", () => {
  it("returns the upstream all config", async () => {
    // Arrange
    const expectedConfigName = "codeperfect/all";

    // Act
    const { hasExpectedConfig } = await (async () => {
      const configs = await codeperfect();

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

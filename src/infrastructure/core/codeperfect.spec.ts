import type * as codeperfectPluginModuleType from "@codeperfect/eslint-plugin";

import { describe, expect, it, vi } from "vitest";

import { codeperfect } from "./codeperfect";

vi.mock(
  import("@codeperfect/eslint-plugin"),
  () =>
    ({
      all: {
        name: "codeperfect/all",
        rules: { "codeperfect/example": "error" },
      },
    }) as unknown as typeof codeperfectPluginModuleType,
);

describe("codeperfect config", () => {
  it("returns the scoped upstream all config", async () => {
    // Arrange
    const expectedConfigNames = ["codeperfect/all"];

    // Act
    const { configNames, upstreamConfig } = await (async () => {
      const configs = await codeperfect();

      return {
        configNames: configs.map((config) => config.name),
        upstreamConfig: configs.find(
          (config) => config.name === "codeperfect/all",
        ),
      };
    })();

    // Assert
    expect(configNames).toStrictEqual(expectedConfigNames);
    expect(upstreamConfig).toMatchObject({
      rules: { "codeperfect/example": "error" },
    });
  });
});

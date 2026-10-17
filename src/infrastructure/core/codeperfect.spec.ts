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
  it("returns the scoped upstream all config and custom rule overrides", async () => {
    // Arrange
    const expectedConfigNames = ["codeperfect/all", "codeperfect/custom"];

    // Act
    const { configNames, customConfig, upstreamConfig } = await (async () => {
      const configs = await codeperfect();

      return {
        configNames: configs.map((config) => config.name),
        customConfig: configs.find(
          (config) => config.name === "codeperfect/custom",
        ),
        upstreamConfig: configs.find(
          (config) => config.name === "codeperfect/all",
        ),
      };
    })();

    // Assert
    expect(configNames).toStrictEqual(expectedConfigNames);
    expect(upstreamConfig).toMatchObject({
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      rules: { "codeperfect/example": "error" },
    });
    expect(customConfig).toMatchObject({
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      name: "codeperfect/custom",
      rules: {
        "codeperfect/assert-actual-expected-names": "off",
        "codeperfect/enforce-aaa-structure": "off",
        "codeperfect/require-act-result-capture": "off",
        "codeperfect/require-example-language": "off",
        "codeperfect/single-act-statement": "off",
      },
    });
  });
});

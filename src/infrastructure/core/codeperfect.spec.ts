import type * as codeperfectPluginModuleType from "@codeperfect/eslint-plugin";

import { describe, expect, it, vi } from "vitest";

import { codeperfect } from "./codeperfect";

/** Module namespace type for `@codeperfect/eslint-plugin` mocks. */
type CodeperfectPluginModule = typeof codeperfectPluginModuleType;

vi.mock(
  import("@codeperfect/eslint-plugin"),
  () =>
    ({
      all: [{ name: "codeperfect/all" }],
    }) as unknown as Partial<CodeperfectPluginModule>,
);

describe("codeperfect config", () => {
  it("returns the upstream all config", async () => {
    // Arrange
    const expectedConfigName = "codeperfect/all";

    // Act
    const actualHasExpectedConfig = await codeperfect().then((configs) =>
      configs.some((config) => config.name === expectedConfigName),
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });
});

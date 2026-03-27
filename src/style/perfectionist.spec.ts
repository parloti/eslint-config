import type { Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { perfectionist } from "./perfectionist";

/** Type definition for rule data. */
interface PerfectionistConfigs extends Record<
  string,
  Linter.Config | Linter.LegacyConfig
> {
  /** Recommended alphabetical config. */
  "recommended-alphabetical": Linter.Config;

  /** Recommended alphabetical legacy config. */
  "recommended-alphabetical-legacy": Linter.LegacyConfig;

  /** Recommended custom config. */
  "recommended-custom": Linter.Config;

  /** Recommended custom legacy config. */
  "recommended-custom-legacy": Linter.LegacyConfig;

  /** Recommended line length config. */
  "recommended-line-length": Linter.Config;

  /** Recommended line length legacy config. */
  "recommended-line-length-legacy": Linter.LegacyConfig;

  /** Recommended natural sort config. */
  "recommended-natural": Linter.Config;

  /** Recommended natural legacy config. */
  "recommended-natural-legacy": Linter.LegacyConfig;
}

/** Type definition for rule data. */
interface PerfectionistModule {
  /** Configs field value. */
  configs: PerfectionistConfigs;
}

/** Mock config map returned by eslint-plugin-perfectionist. */
const perfectionistConfigs: PerfectionistConfigs = {
  "recommended-alphabetical": {} as Linter.Config,
  "recommended-alphabetical-legacy": {} as Linter.LegacyConfig,
  "recommended-custom": {} as Linter.Config,
  "recommended-custom-legacy": {} as Linter.LegacyConfig,
  "recommended-line-length": {} as Linter.Config,
  "recommended-line-length-legacy": {} as Linter.LegacyConfig,
  "recommended-natural": {} as Linter.Config,
  "recommended-natural-legacy": {} as Linter.LegacyConfig,
};

vi.mock(
  import("eslint-plugin-perfectionist"),
  (): PerfectionistModule => ({
    configs: perfectionistConfigs,
  }),
);

describe("perfectionist config", () => {
  beforeEach(() => {
    perfectionistConfigs["recommended-natural"] = {} as Linter.Config;
  });

  it("returns configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await perfectionist();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });

  it("disables perfectionist rules for generated snippet files", async () => {
    // Arrange
    perfectionistConfigs["recommended-natural"] = {
      rules: {
        "perfectionist/sort-objects": "error",
        "sort-keys": "error",
      },
    } as Linter.Config;

    // Act
    const configs = await perfectionist();

    // Assert
    expect(
      configs.find(
        (config) => config.name === "perfectionist/generated-snippets",
      )?.rules,
    ).toMatchObject({
      "perfectionist/sort-objects": "off",
    });
    expect(
      configs.find(
        (config) => config.name === "perfectionist/generated-snippets",
      )?.rules,
    ).not.toHaveProperty("sort-keys");
  });
});

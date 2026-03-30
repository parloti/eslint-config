import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

import { unicorn } from "./unicorn";

/** Type definition for rule data. */
interface UnicornConfigs extends Record<string, Linter.Config> {
  /** All rules config entry. */
  all: Linter.Config;

  /** Flat all config entry. */
  "flat/all": Linter.Config;

  /** Flat recommended config entry. */
  "flat/recommended": Linter.Config;

  /** Recommended config entry. */
  recommended: Linter.Config;

  /** Unopinionated config entry. */
  unopinionated: Linter.Config;
}

/** Type definition for rule data. */
interface UnicornDefaultExport {
  /** Plugin configs map. */
  configs: UnicornConfigs;
}

/** Type definition for rule data. */
interface UnicornModule {
  /** Default module export. */
  default: UnicornDefaultExport;
}

/** Mock config map returned by eslint-plugin-unicorn. */
const unicornConfigs: UnicornConfigs = {
  all: {} as Linter.Config,
  "flat/all": {} as Linter.Config,
  "flat/recommended": {} as Linter.Config,
  recommended: {} as Linter.Config,
  unopinionated: {} as Linter.Config,
};

vi.mock(
  import("eslint-plugin-unicorn"),
  (): UnicornModule => ({
    default: {
      configs: unicornConfigs,
    },
  }),
);

describe("unicorn config", () => {
  it("returns configs", async () => {
    // Arrange
    const minimumConfigCount = 1;

    // Act
    const configs = await unicorn();

    // Assert
    expect(configs.length).toBeGreaterThanOrEqual(minimumConfigCount);
  });
});

import { describe, expect, it, vi } from "vitest";

import { unicorn } from "./unicorn";

type UnicornConfigs =
  (typeof import("eslint-plugin-unicorn"))["default"]["configs"];

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
  all: {},
  "flat/all": {},
  "flat/recommended": {},
  recommended: {},
  "recommended-css": {},
  "recommended-html": {},
  "recommended-json": {},
  "recommended-markdown": {},
  "recommended-toml": {},
  "recommended-yaml": {},
  unopinionated: {},
};

vi.mock(import("eslint-plugin-unicorn"), (): UnicornModule => {
  return { default: { configs: unicornConfigs } };
});

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

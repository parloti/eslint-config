import type { Rule } from "eslint";
import type EslintPluginJestModule from "eslint-plugin-jest";
import type config from "eslint-plugin-playwright";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { jasmine } from "./jasmine";
import { jest } from "./jest";
import { vitest as vitestConfig } from "./vitest";

/** Type definition for rule data. */
interface PlaywrightModule {
  /** Default field value. */
  default: typeof config;
}

/**
 * Creates createPlaywrightMock.
 * @returns Return value output.
 * @example
 * ```typescript
 * createPlaywrightMock();
 * ```
 */
const createPlaywrightMock = (): typeof config => ({
  configs: {
    "flat/recommended": { rules: {} },
    "playwright-test": {},
    recommended: {},
  },
  rules: {},
});

/** Mutable playwright mock used by module import mocks. */
let playwrightMock: typeof config | undefined;

vi.mock(import("eslint-plugin-playwright"), (): PlaywrightModule => {
  if (playwrightMock === void 0) {
    throw new Error("Playwright mock not defined");
  }
  return { default: playwrightMock };
});

vi.mock(
  import("eslint-plugin-jest"),
  () => ({ configs: { "flat/all": {} } }) as typeof EslintPluginJestModule,
);

/** Placeholder rule module used in test fixtures. */
const dumbRuleModule = {
  create(): Rule.RuleListener {
    throw new Error("Function not implemented.");
  },
};

describe("testing configs", () => {
  beforeEach(() => {
    playwrightMock = createPlaywrightMock();
  });

  it("returns jasmine config with custom entry", async () => {
    const configs = await jasmine();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jasmine/custom")).toBe(
      true,
    );
  });

  it("returns jest config with custom entries", async () => {
    const configs = await jest();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jest/custom")).toBe(true);
    expect(
      configs.some((config) => config.name === "jest/custom-global-overrides"),
    ).toBe(true);
  });

  it("returns vitest config with custom entry", async () => {
    const configs = await vitestConfig();
    const customConfig = configs.find(
      (config) => config.name === "vitest/custom",
    );

    expect(configs.length).toBeGreaterThan(0);
    expect(customConfig?.rules).toMatchObject({
      "vitest/consistent-test-filename": [
        "error",
        { pattern: String.raw`.*\.spec\.[tj]sx?$` },
      ],
    });
  });

  it("returns playwright config with custom entry", async () => {
    playwrightMock = {
      configs: {
        "flat/recommended": {
          rules: {
            "playwright/no-foo": "error",
          },
        },
        "playwright-test": {},
        recommended: {},
      },
      rules: {
        "no-bar": dumbRuleModule,
        "no-foo": dumbRuleModule,
      } satisfies Record<string, Rule.RuleModule>,
    };

    vi.resetModules();
    const { playwright } = await import("./playwright");

    const configs = await playwright();

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "playwright/custom-error"),
    ).toBe(true);
    expect(configs[0]?.rules).toMatchObject({ "playwright/no-foo": "error" });
  });

  it("handles missing playwright recommended rules", async () => {
    playwrightMock = {
      configs: {
        "flat/recommended": {},
        "playwright-test": {},
        recommended: {},
      },
      rules: {
        "no-foo": dumbRuleModule,
      },
    };

    vi.resetModules();
    const { playwright } = await import("./playwright");
    const configs = await playwright();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("ignores rules listed in the custom ignore list", async () => {
    playwrightMock = {
      configs: {
        "flat/recommended": { rules: {} },
        "playwright-test": {},
        recommended: {},
      },
      rules: {
        "": dumbRuleModule,
        "no-foo": dumbRuleModule,
      },
    };

    vi.resetModules();
    const { playwright } = await import("./playwright");
    const configs = await playwright();

    expect(configs.length).toBeGreaterThan(0);
    expect(Object.keys(configs[0]?.rules ?? {})).toContain("playwright/no-foo");
    expect(Object.keys(configs[0]?.rules ?? {})).not.toContain("playwright/");
  });
});

import type * as vitestPluginModuleType from "@vitest/eslint-plugin";
import type { Linter, Rule } from "eslint";
import type * as jestPluginModuleType from "eslint-plugin-jest";
import type config from "eslint-plugin-playwright";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { jasmine } from "./jasmine";
import { jest } from "./jest";
import { vitest as vitestConfig } from "./vitest";

/** Module namespace type for mocked Jest exports. */
type JestPluginModule = typeof jestPluginModuleType;

/** Module namespace type for mocked Vitest exports. */
type VitestPluginModule = typeof vitestPluginModuleType;

/** Mocked Jest config namespace used by the module mock. */
const mockedJestConfigs = {
  "flat/all": {},
} as JestPluginModule["configs"];

/** Mocked Vitest default export used by the module mock. */
const mockedVitestPlugin = {
  configs: {
    all: {},
  },
} as unknown as VitestPluginModule["default"];

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

/**
 * Load the playwright config under test after resetting the module graph.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * await loadPlaywrightConfigs();
 * ```
 */
async function loadPlaywrightConfigs(): Promise<Linter.Config[]> {
  vi.resetModules();
  const { playwright } = await import("./playwright");

  return playwright();
}

vi.mock(import("eslint-plugin-playwright"), (): PlaywrightModule => {
  if (playwrightMock === void 0) {
    throw new Error("Playwright mock not defined");
  }
  return { default: playwrightMock };
});

vi.mock(import("eslint-plugin-jest"), () => ({
  configs: mockedJestConfigs,
}));

vi.mock(import("@vitest/eslint-plugin"), () => ({
  default: mockedVitestPlugin,
}));

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
    // Arrange
    const expectedConfigName = "jasmine/custom";

    // Act
    const actualHasExpectedConfig = await jasmine().then((configs) =>
      configs.some((config) => config.name === expectedConfigName),
    );

    // Assert
    expect(actualHasExpectedConfig).toBe(true);
  });

  it("returns jest config with custom entries", async () => {
    // Arrange
    const expectedConfigNames = ["jest/custom", "jest/custom-global-overrides"];

    // Act
    const actualConfigNames = await jest().then((configs) =>
      configs.map((config) => config.name),
    );

    // Assert
    expect(actualConfigNames).toStrictEqual(
      expect.arrayContaining(expectedConfigNames),
    );
  });

  it("returns vitest config with custom entry", async () => {
    // Arrange
    const expectedConfigName = "vitest/custom";

    // Act
    const actualVitestCustomRules = await vitestConfig().then(
      (configs) =>
        configs.find((config) => config.name === expectedConfigName)?.rules,
    );

    // Assert
    expect(actualVitestCustomRules).toMatchObject({
      "vitest/consistent-test-filename": [
        "error",
        { pattern: String.raw`.*\.spec\.[tj]sx?$` },
      ],
    });
  });

  it("returns playwright config with custom entry", async () => {
    // Arrange
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

    // Act
    const configs = await loadPlaywrightConfigs();

    // Assert
    expect(configs).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "playwright/custom-error" }),
      ]),
    );
    expect(configs[0]?.rules).toMatchObject({ "playwright/no-foo": "error" });
  });

  it("handles missing playwright recommended rules", async () => {
    // Arrange
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

    // Act
    const configs = await loadPlaywrightConfigs();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });

  it("ignores rules listed in the custom ignore list", async () => {
    // Arrange
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

    // Act
    const actualRuleKeys = await loadPlaywrightConfigs().then((configs) =>
      Object.keys(configs[0]?.rules ?? {}),
    );

    // Assert
    expect(actualRuleKeys).toContain("playwright/no-foo");
    expect(actualRuleKeys).not.toContain("playwright/");
  });
});

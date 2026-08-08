import type * as VitestPluginModule from "@vitest/eslint-plugin";
import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

/**
 * Load the Vitest config under test after module mocking.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * await loadVitestConfigs();
 * ```
 */
async function loadVitestConfigs(): Promise<Linter.Config[]> {
  const { vitest } = await import("./vitest");

  return vitest();
}

describe("vitest plugin branches", () => {
  it("returns repo-owned configs when the all preset is available", async () => {
    // Arrange
    const allConfig = {
      name: "vitest/all",
    } as (typeof VitestPluginModule)["default"]["configs"]["all"];

    vi.doMock(
      import("@vitest/eslint-plugin"),
      createMockProxy<typeof VitestPluginModule>({
        default: {
          configs: {
            all: allConfig,
          },
        },
      }),
    );

    // Act
    const { customConfig, presetConfig, settingsConfig } = await (async () => {
      const configs = await loadVitestConfigs();

      return {
        customConfig: configs.find((config) => config.name === "vitest/custom"),
        presetConfig: configs.find(
          (config) => config.name?.includes("vitest/all") === true,
        ),
        settingsConfig: configs.find((config) => config.settings !== void 0),
      };
    })();

    // Assert
    expect(settingsConfig).toMatchObject({
      settings: {
        vitest: {
          typecheck: true,
        },
      },
    });
    expect(presetConfig?.name).toContain(allConfig.name);
    expect(customConfig).toMatchObject({
      files: ["**/*.{spec,test,e2e}.ts"],
      name: "vitest/custom",
      rules: {
        "vitest/consistent-test-filename": [
          "error",
          { pattern: String.raw`.*\.spec\.ts$` },
        ],
        "vitest/no-hooks": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/require-mock-type-parameters": "off",
        "vitest/unbound-method": "off",
      },
    });
  });
});

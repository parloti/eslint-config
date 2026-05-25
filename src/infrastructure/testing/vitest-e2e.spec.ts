import type * as VitestPluginModule from "@vitest/eslint-plugin";
import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

/**
 * Load the Vitest e2e config under test after module mocking.
 * @returns The produced ESLint config array.
 * @example
 * ```typescript
 * await loadVitestE2eConfigs();
 * ```
 */
async function loadVitestE2eConfigs(): Promise<Linter.Config[]> {
  const { vitestE2e } = await import("./vitest-e2e");

  return vitestE2e();
}

describe("vitest-e2e plugin branches", () => {
  it("returns repo-owned configs when the all preset is available", async () => {
    // Arrange
    const allConfig: Linter.Config = {
      name: "vitest/all",
    };

    vi.doMock(import("@vitest/eslint-plugin"), () => {
      return {
        default: {
          configs: {
            all: allConfig,
          },
        },
      } as typeof VitestPluginModule;
    });

    // Act
    const { customConfig, presetConfig, settingsConfig } =
      await loadVitestE2eConfigs().then((configs) => ({
        customConfig: configs.find(
          (config) => config.name === "vitest-e2e/custom",
        ),
        presetConfig: configs.find(
          (config) => config.name?.includes("vitest/all") === true,
        ),
        settingsConfig: configs.find((config) => config.settings !== void 0),
      }));

    // Assert
    expect(settingsConfig).toMatchObject({
      settings: {
        vitest: {
          typecheck: true,
        },
      },
    });
    expect(presetConfig?.name).toContain(String(allConfig.name));
    expect(customConfig).toMatchObject({
      files: ["tests/e2e/**/*.ts"],
      name: "vitest-e2e/custom",
      rules: {
        "vitest/consistent-test-filename": [
          "error",
          { pattern: String.raw`.*\.e2e\.ts$` },
        ],
        "vitest/no-hooks": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/require-mock-type-parameters": "off",
        "vitest/unbound-method": "off",
      },
    });
  });
});

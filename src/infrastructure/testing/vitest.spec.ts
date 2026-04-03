import type * as vitestPluginModuleType from "@vitest/eslint-plugin";
import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

/** Mutable Vitest plugin module shape used by import mocks. */
interface IVitestPluginMock {
  /** Default export used by the mocked module. */
  default: (typeof vitestPluginModuleType)["default"] | undefined;
}

/** Mutable Vitest plugin module used by import mocks. */
let vitestPluginMock: IVitestPluginMock | undefined;

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

vi.mock(import("@vitest/eslint-plugin"), () => {
  if (vitestPluginMock === void 0) {
    throw new Error("Vitest plugin mock not defined");
  }

  const defaultExport = vitestPluginMock.default;

  return {
    default: defaultExport,
  } as unknown as Partial<typeof vitestPluginModuleType>;
});

describe("vitest plugin branches", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vitestPluginMock = void 0;
  });

  it("returns empty when plugin is undefined", async () => {
    // Arrange
    vi.resetModules();
    const missingDefault:
      | (typeof vitestPluginModuleType)["default"]
      | undefined = void 0;
    vitestPluginMock = {
      default: missingDefault,
    };

    // Act
    const configs = await loadVitestConfigs();

    // Assert
    expect(configs).toStrictEqual([]);
  });

  it("returns empty when plugin configs are undefined", async () => {
    // Arrange
    vi.resetModules();
    const pluginWithoutConfigs = {
      configs: void 0,
    } as unknown as Partial<(typeof vitestPluginModuleType)["default"]>;
    vitestPluginMock = {
      default:
        pluginWithoutConfigs as (typeof vitestPluginModuleType)["default"],
    };

    // Act
    const configs = await loadVitestConfigs();

    // Assert
    expect(configs).toStrictEqual([]);
  });
});

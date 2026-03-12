import type { ConfigObject } from "@eslint/core";
import type { Linter } from "eslint";
import type { Rules, Settings } from "eslint-plugin-boundaries";

import { createConfig, strict } from "eslint-plugin-boundaries/config";
import { defineConfig } from "eslint/config";

import type { BoundariesConfig } from "../types";

import { reportMissingBoundariesConfig } from "../diagnostics";

/**
 * Load boundaries plugin configuration when explicitly configured.
 * @param config Input config value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const configs = boundaries({
 * elements: [{ type: "shared", pattern: "src/shared" }],
 * elementTypes: ["error", { default: "disallow", rules: [] }],
 * });
 * ```
 */
function boundaries(config?: BoundariesConfig): Linter.Config[] {
  if (!hasBoundariesConfig(config)) {
    warnMissingConfig();
    return [];
  }

  const { elements, elementTypes, files, ignores } = config;

  const settings: Settings = {
    ...strict.settings,
    "boundaries/elements": elements,
  };

  const rules: Rules = {
    ...strict.rules,
    "boundaries/element-types": elementTypes,
  };

  const configObject = createConfig({
    files: [...files],
    ...(ignores === void 0 ? {} : { ignores: [...ignores] }),
    rules,
    settings,
  }) as ConfigObject;

  return defineConfig(configObject);
}

/**
 * Checks if the boundaries configuration is present.
 * @param config Input config value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const ok = hasBoundariesConfig({
 *   files: ["src"],
 *   elements: [],
 *   elementTypes: ["error", { default: "disallow", rules: [] }],
 * });
 * ```
 */
function hasBoundariesConfig(
  config: BoundariesConfig | undefined,
): config is BoundariesConfig {
  if (config === void 0) {
    return false;
  }

  const { elements, elementTypes, files } = config as {
    /** Elements helper value. */
    elements?: unknown;

    /** ElementTypes helper value. */
    elementTypes?: unknown;

    /** Files helper value. */
    files?: unknown;
  };

  return files !== void 0 && elements !== void 0 && elementTypes !== void 0;
}

/**
 * Warns when boundaries configuration is missing.
 * @example
 * ```typescript
 * warnMissingConfig();
 * ```
 */
function warnMissingConfig(): void {
  reportMissingBoundariesConfig();
}

export { boundaries };

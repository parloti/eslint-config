import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

import type { PluginLoaderEntry } from "./plugin-loaders";
import type { ConfigOptions } from "./types";

import { moduleTaxonomy } from "./module-taxonomy";
import { pluginLoaders } from "./plugin-loaders";
import { resolvePluginState } from "./plugin-state";
import {
  applyRuleOverrides,
  collectAvailablePlugins,
  loadPluginConfig,
} from "./utilities";

/**
 * Builds the list of plugin config loaders.
 * @param options Input options value.
 * @returns Return value output.
 * @example
 * ```typescript
 * buildPluginConfigLoaders({});
 * ```
 */
function buildPluginConfigLoaders(
  options: ConfigOptions,
): Promise<Linter.Config[]>[] {
  const loaders: Promise<Linter.Config[]>[] = [];

  for (const { pluginName } of moduleTaxonomy) {
    const loaderEntry: PluginLoaderEntry = pluginLoaders[pluginName];
    const loadConfig = loaderEntry.loader(options);
    const isEnabled = resolvePluginState(pluginName, options.plugins);

    if (isEnabled) {
      loaders.push(loadPluginConfig(pluginName, loadConfig, loaderEntry.mode));
    }
  }

  return loaders;
}

/**
 * Creates the ESLint configuration with optional plugin and rule customization.
 * @param options Input options value.
 * @returns Return value output.
 * @example
 * ```typescript
 * config();
 * ```
 */
async function config(options: ConfigOptions = {}): Promise<Linter.Config[]> {
  const { rules: ruleOverrides } = options;

  const pluginConfigResults = await Promise.all(
    buildPluginConfigLoaders(options),
  );
  const pluginConfigs = pluginConfigResults.flat();
  const finalConfig = applyRuleOverrides(
    pluginConfigs,
    ruleOverrides,
    collectAvailablePlugins(pluginConfigs),
  );

  return finalConfig.length === 0 ? [] : defineConfig(...finalConfig);
}

export { config };

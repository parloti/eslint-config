import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

import type { ConfigOptions } from "../domain";

import { moduleTaxonomy } from "../domain";
import { reportDeprecatedBoundariesOption } from "./diagnostics";
import { pluginLoaders } from "./plugin-loaders";
import { resolvePluginState } from "./plugin-state";
import { loadPluginConfig } from "./utilities";

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
    const loaderEntry = pluginLoaders[pluginName];
    const loadConfig = loaderEntry.loader(options);
    const isEnabled = resolvePluginState(pluginName, options.plugins);

    if (isEnabled) {
      loaders.push(loadPluginConfig(pluginName, loadConfig, loaderEntry.mode));
    }
  }

  return loaders;
}

/**
 * Creates the ESLint configuration with optional plugin customization.
 * @param options Input options value.
 * @returns Return value output.
 * @example
 * ```typescript
 * config();
 * ```
 */
async function config(options: ConfigOptions = {}): Promise<Linter.Config[]> {
  if (Object.hasOwn(options, "boundaries")) {
    reportDeprecatedBoundariesOption();
  }

  const pluginConfigResults = await Promise.all(
    buildPluginConfigLoaders(options),
  );
  const pluginConfigs = pluginConfigResults.flat();

  return pluginConfigs.length === 0 ? [] : defineConfig(...pluginConfigs);
}

export { config };

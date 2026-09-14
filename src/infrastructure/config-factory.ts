import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

import type { ConfigOptions, ScopedPluginConfig } from "../domain";

import { moduleTaxonomy } from "../domain";
import { pluginLoaders } from "./plugin-loaders";
import { isPluginEnabled } from "./plugin-state";
import { loadPluginConfig } from "./utilities";

/**
 * Scopes config entries to a package base directory.
 * @param configs Config entries to scope.
 * @param basePath Package base directory.
 * @returns Config entries scoped to the package.
 * @example
 * ```typescript
 * applyBasePath([{ name: "custom-eslint" }], "packages/api");
 * ```
 */
function applyBasePath(
  configs: Linter.Config[],
  basePath: string,
): Linter.Config[] {
  return configs.map((config) => ({ ...config, basePath }));
}

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
    const isEnabled = isPluginEnabled(pluginName, options.plugins);

    if (isEnabled) {
      loaders.push(loadPluginConfig(pluginName, loadConfig, loaderEntry.mode));
    }
  }

  return loaders;
}

/**
 * Builds plugin config loaders selected for one package-scoped profile.
 * @param options Input options value.
 * @param scopedPluginConfig Package-scoped plugin profile.
 * @returns Config loaders for the profile's explicitly selected plugins.
 * @example
 * ```typescript
 * buildScopedPluginConfigLoaders({}, {
 *   basePath: "packages/api",
 *   plugins: ["eslint"],
 * });
 * ```
 */
function buildScopedPluginConfigLoaders(
  options: ConfigOptions,
  scopedPluginConfig: ScopedPluginConfig,
): Promise<Linter.Config[]>[] {
  const loaders: Promise<Linter.Config[]>[] = [];

  for (const { pluginName } of moduleTaxonomy) {
    if (!scopedPluginConfig.plugins.includes(pluginName)) {
      continue;
    }

    const loaderEntry = pluginLoaders[pluginName];
    const loadConfig = loaderEntry.loader(options);

    loaders.push(loadPluginConfig(pluginName, loadConfig, loaderEntry.mode));
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
  const pluginConfigs =
    options.scopedPlugins === void 0
      ? await loadGlobalPluginConfigs(options)
      : [];
  const scopedPluginConfigs = await Promise.all(
    options.scopedPlugins?.map((scopedPluginConfig) =>
      loadScopedPluginConfigs(options, scopedPluginConfig),
    ) ?? [],
  );
  const configs = [...pluginConfigs, ...scopedPluginConfigs.flat()];

  return configs.length === 0 ? [] : defineConfig(...configs);
}

/**
 * Loads configuration selected through global plugin state overrides.
 * @param options Input options value.
 * @returns Config entries selected for global composition.
 * @example
 * ```typescript
 * await loadGlobalPluginConfigs({ plugins: { jest: true } });
 * ```
 */
async function loadGlobalPluginConfigs(
  options: ConfigOptions,
): Promise<Linter.Config[]> {
  const pluginConfigResults = await Promise.all(
    buildPluginConfigLoaders(options),
  );

  return pluginConfigResults.flat();
}

/**
 * Loads and scopes configuration for one package plugin profile.
 * @param options Input options value.
 * @param scopedPluginConfig Package-scoped plugin profile.
 * @returns Return value output.
 * @example
 * ```typescript
 * await loadScopedPluginConfigs({}, {
 *   basePath: "packages/api",
 *   plugins: ["eslint"],
 * });
 * ```
 */
async function loadScopedPluginConfigs(
  options: ConfigOptions,
  scopedPluginConfig: ScopedPluginConfig,
): Promise<Linter.Config[]> {
  const pluginConfigResults = await Promise.all(
    buildScopedPluginConfigLoaders(options, scopedPluginConfig),
  );

  return applyBasePath(pluginConfigResults.flat(), scopedPluginConfig.basePath);
}

export { config };

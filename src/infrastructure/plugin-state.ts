import type { PluginName, PluginStateOverrides } from "../domain";

import { reportRedundantPluginState } from "./diagnostics";

/** Plugins that are opt-in rather than enabled by default. */
const defaultDisabledPlugins = [
  "jasmine",
  "jest",
] as const satisfies readonly PluginName[];

/**
 * Checks whether a plugin is disabled by default.
 * @param pluginName Input pluginName value.
 * @returns Return value output.
 * @example
 * ```typescript
 * isPluginDisabledByDefault("jest");
 * ```
 */
function isPluginDisabledByDefault(pluginName: PluginName): boolean {
  return (defaultDisabledPlugins as readonly PluginName[]).includes(pluginName);
}

/**
 * Reports redundant plugin-state overrides that match the default state.
 * @param pluginName Input pluginName value.
 * @param pluginState Input pluginState value.
 * @param defaultEnabled Input defaultEnabled value.
 * @example
 * ```typescript
 * reportRedundantPluginStateIfNeeded("jest", false, false);
 * ```
 */
function reportRedundantPluginStateIfNeeded(
  pluginName: PluginName,
  pluginState: boolean,
  defaultEnabled: boolean,
): void {
  if (pluginState === defaultEnabled) {
    reportRedundantPluginState(pluginName, pluginState);
  }
}

/**
 * Resolves whether a plugin should be enabled in the final config.
 * @param pluginName Input pluginName value.
 * @param pluginStates Explicit plugin state overrides.
 * @returns Return value output.
 * @example
 * ```typescript
 * resolvePluginState("jest", { jest: true });
 * ```
 */
function resolvePluginState(
  pluginName: PluginName,
  pluginStates?: PluginStateOverrides,
): boolean {
  const defaultEnabled = !isPluginDisabledByDefault(pluginName);
  const explicitState = pluginStates?.[pluginName];

  if (explicitState !== void 0) {
    reportRedundantPluginStateIfNeeded(
      pluginName,
      explicitState,
      defaultEnabled,
    );

    return explicitState;
  }

  return defaultEnabled;
}

export {
  defaultDisabledPlugins,
  isPluginDisabledByDefault,
  resolvePluginState,
};

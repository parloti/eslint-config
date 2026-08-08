import type {
  DefaultDisabledPluginName,
  PluginName,
  PluginStateOverrides,
} from "../domain";

import { reportRedundantPluginState } from "./diagnostics";

/** Plugins that are opt-in rather than enabled by default. */
const defaultDisabledPlugins = [
  "angular-eslint",
  "jasmine",
  "jest",
  "vitest-e2e",
] as const satisfies readonly DefaultDisabledPluginName[];

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
 * Resolves whether a plugin should be enabled in the final config.
 * @param pluginName Input pluginName value.
 * @param pluginStates Explicit plugin state overrides.
 * @returns Return value output.
 * @example
 * ```typescript
 * isPluginEnabled("jest", { jest: true });
 * ```
 */
function isPluginEnabled(
  pluginName: PluginName,
  pluginStates?: PluginStateOverrides,
): boolean {
  const isDefaultEnabled = !isPluginDisabledByDefault(pluginName);
  const explicitState = pluginStates?.[pluginName];

  if (explicitState !== void 0) {
    reportRedundantPluginStateIfNeeded(
      pluginName,
      explicitState,
      isDefaultEnabled,
    );

    return explicitState;
  }

  return isDefaultEnabled;
}

/**
 * Reports redundant plugin-state overrides that match the default state.
 * @param pluginName Input pluginName value.
 * @param isPluginStateEnabled Input plugin state enabled value.
 * @param isDefaultEnabled Input default enabled value.
 * @example
 * ```typescript
 * reportRedundantPluginStateIfNeeded("jest", false, false);
 * ```
 */
function reportRedundantPluginStateIfNeeded(
  pluginName: PluginName,
  isPluginStateEnabled: boolean,
  isDefaultEnabled: boolean,
): void {
  if (isPluginStateEnabled === isDefaultEnabled) {
    reportRedundantPluginState(pluginName, isPluginStateEnabled);
  }
}

export { isPluginEnabled };

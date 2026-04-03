import type { Linter } from "eslint";

import type { PluginName } from "../domain";

import { reportPluginLoadIssue, reportRuleOverrideSkip } from "./diagnostics";

/** Runtime loading modes for plugin config loaders. */
type LoadMode = "optional" | "required";

/**
 * Applies rule overrides to a configuration array.
 * @param config Input config value.
 * @param ruleOverrides Input ruleOverrides value.
 * @param availablePlugins Input availablePlugins value.
 * @returns Return value output.
 * @example
 * ```typescript
 * applyRuleOverrides([], { "no-console": "off" });
 * ```
 */
function applyRuleOverrides(
  config: Linter.Config[],
  ruleOverrides?: Linter.RulesRecord,
  availablePlugins: ReadonlySet<string> = new Set(),
): Linter.Config[] {
  const filteredRules = filterRuleOverrides(ruleOverrides, availablePlugins);

  if (filteredRules === void 0) {
    return config;
  }

  return [
    ...config,
    {
      name: "custom/rule-overrides",
      rules: filteredRules,
    } as Linter.Config,
  ];
}

/**
 * Collects plugin names from config entries.
 * @param configs Input configs value.
 * @returns Return value output.
 * @example
 * ```typescript
 * collectAvailablePlugins();
 * ```
 */
function collectAvailablePlugins(
  configs: Linter.Config[],
): ReadonlySet<string> {
  const plugins = new Set<string>();

  for (const config of configs) {
    if (config.plugins !== void 0) {
      for (const pluginName of Object.keys(config.plugins)) {
        plugins.add(pluginName);
      }
    }
  }

  return plugins;
}

/**
 * Filters rule overrides to those that can be applied.
 * @param ruleOverrides Input ruleOverrides value.
 * @param availablePlugins Input availablePlugins value.
 * @returns Return value output.
 * @example
 * ```typescript
 * filterRuleOverrides();
 * ```
 */
function filterRuleOverrides(
  ruleOverrides: Linter.RulesRecord | undefined,
  availablePlugins: ReadonlySet<string>,
): Linter.RulesRecord | undefined {
  if (ruleOverrides === void 0 || Object.keys(ruleOverrides).length === 0) {
    return void 0;
  }

  const filteredRules: Linter.RulesRecord = {};

  for (const [ruleName, ruleValue] of Object.entries(ruleOverrides)) {
    if (!shouldSkipRuleOverride(ruleName, availablePlugins)) {
      filteredRules[ruleName] = ruleValue;
    }
  }

  return Object.keys(filteredRules).length === 0 ? void 0 : filteredRules;
}

/**
 * Loads a plugin config with a helpful, colorful error message on failure.
 * @param pluginName Input pluginName value.
 * @param loader Input loader value.
 * @param mode Specifies whether loader failures are fatal or skippable.
 * @returns Return value output.
 * @example
 * ```typescript
 * loadPluginConfig();
 * ```
 */
async function loadPluginConfig(
  pluginName: PluginName,
  loader: () => Linter.Config[] | Promise<Linter.Config[]>,
  mode: LoadMode = "optional",
): Promise<Linter.Config[]> {
  try {
    return await loader();
  } catch (error) {
    reportPluginLoadIssue(pluginName, error, mode);

    if (mode === "required") {
      throw error;
    }

    return [];
  }
}

/**
 * Determines whether a rule override should be skipped.
 * @param ruleName Input ruleName value.
 * @param availablePlugins Input availablePlugins value.
 * @returns Return value output.
 * @example
 * ```typescript
 * shouldSkipRuleOverride();
 * ```
 */
function shouldSkipRuleOverride(
  ruleName: string,
  availablePlugins: ReadonlySet<string>,
): boolean {
  const [pluginName = ""] = ruleName.split("/");
  const isPluginRule = ruleName.includes("/");
  const hasPlugin = availablePlugins.has(pluginName);

  if (isPluginRule && !hasPlugin) {
    reportRuleOverrideSkip(ruleName, pluginName);
    return true;
  }

  return false;
}

export { applyRuleOverrides, collectAvailablePlugins, loadPluginConfig };

export type { LoadMode };

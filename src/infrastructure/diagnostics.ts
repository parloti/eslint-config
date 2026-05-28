import type { PluginName } from "../domain";
import type { LoadMode } from "./utilities";

/** ANSI escape sequences for colored console output. */
const ansi = {
  bold: "\u001B[1m",
  cyan: "\u001B[36m",
  red: "\u001B[31m",
  reset: "\u001B[0m",
  yellow: "\u001B[33m",
} as const;

/** Matches common missing-module error text across package managers and runtimes. */
const missingModulePattern =
  /Cannot find module|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND/u;

/**
 * Checks whether an error represents a missing runtime module.
 * @param error Input error value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const missing = isMissingModuleError(new Error("Cannot find module 'x'"));
 * ```
 */
function isMissingModuleError(error: unknown): boolean {
  return missingModulePattern.test(String(error));
}

/**
 * Reports use of the removed `config({ boundaries: ... })` input.
 * @example
 * ```typescript
 * reportDeprecatedBoundariesOption();
 * ```
 */
function reportDeprecatedBoundariesOption(): void {
  const header = `${ansi.bold}${ansi.yellow}Deprecated config option ignored: boundaries${ansi.reset}`;
  const detail = `${ansi.yellow}The boundaries topology is package-owned and no longer configurable through config options.${ansi.reset}`;
  const hint = `${ansi.cyan}Hint:${ansi.reset} Remove \`boundaries\` from config({...}) and rely on the built-in src entrypoint/bootstrap/presentation/infrastructure/application/domain/shared model, or disable the module with plugins: { "boundaries": false }.`;
  process.stderr.write(`${[header, detail, hint].join("\n")}\n`);
}

/**
 * Reports a plugin loading issue using runtime-aware messaging.
 * @param pluginName Input pluginName value.
 * @param error Input error value.
 * @param mode Specifies whether loader failures are fatal or skippable.
 * @example
 * ```typescript
 * reportPluginLoadIssue("vitest", new Error("Cannot find module"), "optional");
 * ```
 */
function reportPluginLoadIssue(
  pluginName: PluginName,
  error: unknown,
  mode: LoadMode,
): void {
  const message = String(error);
  const isMissingOptionalDependency =
    mode === "optional" && isMissingModuleError(error);
  const header = isMissingOptionalDependency
    ? `${ansi.bold}${ansi.yellow}Skipped optional ESLint plugin config: ${pluginName}${ansi.reset}`
    : `${ansi.bold}${ansi.red}Failed to load ESLint plugin config: ${pluginName}${ansi.reset}`;
  const detail = `${ansi.yellow}${message}${ansi.reset}`;
  const hint =
    mode === "required"
      ? `${ansi.cyan}Hint:${ansi.reset} Install the required peer dependency backing "${pluginName}" before using config().`
      : `${ansi.cyan}Hint:${ansi.reset} Install the plugin or disable it via config({ plugins: { "${pluginName}": false } }).`;
  process.stderr.write(`${[header, detail, hint].join("\n")}\n`);
}

/**
 * Reports that a plugin-state override is redundant with the default state.
 * @param pluginName Input pluginName value.
 * @param enabled Input enabled value.
 * @example
 * ```typescript
 * reportRedundantPluginState("jest", false);
 * ```
 */
function reportRedundantPluginState(
  pluginName: PluginName,
  enabled: boolean,
): void {
  const stateLabel = enabled ? "enabled" : "disabled";
  const header = `${ansi.bold}${ansi.yellow}Redundant plugin state override: ${pluginName}${ansi.reset}`;
  const detail = `${ansi.yellow}Plugin "${pluginName}" is already ${stateLabel} by default.${ansi.reset}`;
  const hint = `${ansi.cyan}Hint:${ansi.reset} Remove the redundant override from config({ plugins: { "${pluginName}": ${String(enabled)} } }).`;
  process.stderr.write(`${[header, detail, hint].join("\n")}\n`);
}

export {
  reportDeprecatedBoundariesOption,
  reportPluginLoadIssue,
  reportRedundantPluginState,
};

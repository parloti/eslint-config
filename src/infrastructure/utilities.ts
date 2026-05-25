import type { Linter } from "eslint";

import type { PluginName } from "../domain";

import { reportPluginLoadIssue } from "./diagnostics";

/** Runtime loading modes for plugin config loaders. */
type LoadMode = "optional" | "required";

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

export { loadPluginConfig };

export type { LoadMode };

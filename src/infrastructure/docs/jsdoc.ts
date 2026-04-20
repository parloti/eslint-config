import type { Linter } from "eslint";

import { createJsdocConfigs } from "./jsdoc-config";

/**
 * Build the jsdoc plugin configuration and any overrides needed by this project.
 * @returns Return value output.
 * @example
 * ```typescript
 *  console.log(await jsdoc());
 * ```
 */
async function jsdoc(): Promise<Linter.Config[]> {
  const { default: jsdocPlugin } = await import("eslint-plugin-jsdoc");

  return createJsdocConfigs(jsdocPlugin.configs, jsdocPlugin.rules);
}

export { jsdoc };

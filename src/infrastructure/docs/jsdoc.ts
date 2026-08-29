import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

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

  return defineConfig({
    extends: [
      jsdocPlugin.configs["flat/contents-typescript-error"],
      jsdocPlugin.configs["flat/logical-typescript-error"],
      jsdocPlugin.configs["flat/requirements-typescript-error"],
      jsdocPlugin.configs["flat/stylistic-typescript-error"],
    ],
    files: ["**/*.ts"],
    name: "jsdoc/custom",
  });
}

export { jsdoc };

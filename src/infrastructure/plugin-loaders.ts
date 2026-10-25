import type { Linter } from "eslint";

import type { ConfigOptions, PluginName } from "../domain";

import { boundaries, importX } from "./architecture";
import { codeperfect, eslint, json, resolver, typescript } from "./core";
import { comments, jsdoc, markdown } from "./docs";
import { angularEslint } from "./runtime";
import { rxjsX } from "./rxjs-x";
import {
  packageJson,
  perfectionist,
  prettier,
  stylistic,
  unicorn,
} from "./style";
import { playwright, vitest, vitestE2e } from "./testing";

/** Loader function for a single config module. */
type ConfigLoader = () => Linter.Config[] | Promise<Linter.Config[]>;

/** Factory for a config loader that may depend on user options. */
type PluginLoaderFactory = (options: ConfigOptions) => ConfigLoader;

/**
 * Creates a loader factory for modules that do not depend on config options.
 * @param loader Input loader value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const factory = createStaticLoaderFactory(eslint);
 * ```
 */
function createStaticLoaderFactory(loader: ConfigLoader): PluginLoaderFactory {
  return (): ConfigLoader => loader;
}

/** Documented config loader registry keyed by public module name. */
const pluginLoaders = {
  "angular-eslint": {
    loader: createStaticLoaderFactory(angularEslint),
    mode: "optional",
  },
  boundaries: { loader: () => boundaries, mode: "optional" },
  codeperfect: {
    loader: createStaticLoaderFactory(codeperfect),
    mode: "required",
  },
  comments: { loader: createStaticLoaderFactory(comments), mode: "optional" },
  eslint: { loader: createStaticLoaderFactory(eslint), mode: "required" },
  "import-x": { loader: createStaticLoaderFactory(importX), mode: "optional" },
  jsdoc: { loader: createStaticLoaderFactory(jsdoc), mode: "optional" },
  json: { loader: createStaticLoaderFactory(json), mode: "required" },
  markdown: { loader: createStaticLoaderFactory(markdown), mode: "required" },
  "package-json": {
    loader: createStaticLoaderFactory(packageJson),
    mode: "optional",
  },
  perfectionist: {
    loader: createStaticLoaderFactory(perfectionist),
    mode: "optional",
  },
  playwright: {
    loader: createStaticLoaderFactory(playwright),
    mode: "optional",
  },
  prettier: { loader: createStaticLoaderFactory(prettier), mode: "optional" },
  resolver: { loader: createStaticLoaderFactory(resolver), mode: "optional" },
  "rxjs-x": { loader: createStaticLoaderFactory(rxjsX), mode: "optional" },
  stylistic: { loader: createStaticLoaderFactory(stylistic), mode: "optional" },
  typescript: {
    loader: createStaticLoaderFactory(typescript),
    mode: "required",
  },
  unicorn: { loader: createStaticLoaderFactory(unicorn), mode: "optional" },
  vitest: { loader: createStaticLoaderFactory(vitest), mode: "optional" },
  "vitest-e2e": {
    loader: createStaticLoaderFactory(vitestE2e),
    mode: "optional",
  },
} as const satisfies Record<PluginName, unknown>;

export { pluginLoaders };

import type { Linter } from "eslint";

import type { ConfigOptions, PluginName } from "./types";
import type { LoadMode } from "./utilities";

import {
  boundaries,
  codeperfect,
  comments,
  eslint,
  importX,
  jasmine,
  jest,
  jsdoc,
  perfectionist,
  playwright,
  prettier,
  resolver,
  rxjsX,
  stylistic,
  typescript,
  unicorn,
  vitest,
} from "./configs";

/** Loader function for a single config module. */
type ConfigLoader = () => Linter.Config[] | Promise<Linter.Config[]>;

/** Entry describing a single config loader in the final composition order. */
interface PluginLoaderEntry {
  /** Loader factory for the module. */
  loader: (options: ConfigOptions) => ConfigLoader;

  /** Runtime loading mode for the module. */
  mode: LoadMode;

  /** Public module name used in config options and diagnostics. */
  pluginName: PluginName;
}

/**
 * Creates the boundaries loader factory for repository-owned architecture input.
 * @param options Input options value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const factory = createBoundariesLoaderFactory({});
 * ```
 */
function createBoundariesLoaderFactory(options: ConfigOptions): ConfigLoader {
  return (): Linter.Config[] => boundaries(options.boundaries);
}

/**
 * Creates a loader factory for modules that do not depend on config options.
 * @param loader Input loader value.
 * @returns Return value output.
 * @example
 * ```typescript
 * const factory = createStaticLoaderFactory(eslint);
 * ```
 */
function createStaticLoaderFactory(
  loader: ConfigLoader,
): PluginLoaderEntry["loader"] {
  return (): ConfigLoader => loader;
}

/** Documented config loader registry keyed by public module name. */
const pluginLoaders = {
  boundaries: {
    loader: createBoundariesLoaderFactory,
    mode: "optional",
    pluginName: "boundaries",
  },
  codeperfect: {
    loader: createStaticLoaderFactory(codeperfect),
    mode: "required",
    pluginName: "codeperfect",
  },
  comments: {
    loader: createStaticLoaderFactory(comments),
    mode: "optional",
    pluginName: "comments",
  },
  eslint: {
    loader: createStaticLoaderFactory(eslint),
    mode: "required",
    pluginName: "eslint",
  },
  "import-x": {
    loader: createStaticLoaderFactory(importX),
    mode: "optional",
    pluginName: "import-x",
  },
  jasmine: {
    loader: createStaticLoaderFactory(jasmine),
    mode: "optional",
    pluginName: "jasmine",
  },
  jest: {
    loader: createStaticLoaderFactory(jest),
    mode: "optional",
    pluginName: "jest",
  },
  jsdoc: {
    loader: createStaticLoaderFactory(jsdoc),
    mode: "optional",
    pluginName: "jsdoc",
  },
  perfectionist: {
    loader: createStaticLoaderFactory(perfectionist),
    mode: "optional",
    pluginName: "perfectionist",
  },
  playwright: {
    loader: createStaticLoaderFactory(playwright),
    mode: "optional",
    pluginName: "playwright",
  },
  prettier: {
    loader: createStaticLoaderFactory(prettier),
    mode: "optional",
    pluginName: "prettier",
  },
  resolver: {
    loader: createStaticLoaderFactory(resolver),
    mode: "optional",
    pluginName: "resolver",
  },
  "rxjs-x": {
    loader: createStaticLoaderFactory(rxjsX),
    mode: "optional",
    pluginName: "rxjs-x",
  },
  stylistic: {
    loader: createStaticLoaderFactory(stylistic),
    mode: "optional",
    pluginName: "stylistic",
  },
  typescript: {
    loader: createStaticLoaderFactory(typescript),
    mode: "required",
    pluginName: "typescript",
  },
  unicorn: {
    loader: createStaticLoaderFactory(unicorn),
    mode: "optional",
    pluginName: "unicorn",
  },
  vitest: {
    loader: createStaticLoaderFactory(vitest),
    mode: "optional",
    pluginName: "vitest",
  },
} satisfies Record<PluginName, PluginLoaderEntry>;

export { pluginLoaders };
export type { ConfigLoader, PluginLoaderEntry };

import type { ConfigObject } from "@eslint/core";
import type { Linter } from "eslint";
import type {
  ElementDescriptors,
  Rules,
  Settings,
} from "eslint-plugin-boundaries";

import { createConfig, strict } from "eslint-plugin-boundaries/config";
import { defineConfig } from "eslint/config";

import type { BoundariesElementTypesRuleEntry } from "../../domain";

/** Fixed boundaries topology used by this package. */
interface BoundariesConfig {
  /** Layer descriptors consumed by eslint-plugin-boundaries. */
  elements: ElementDescriptors;

  /** Rule entry used by boundaries/dependencies. */
  elementTypes: BoundariesElementTypesRuleEntry;

  /** Source globs included in boundaries checks. */
  files: readonly string[];

  /** Source globs excluded from boundaries checks. */
  ignores: readonly string[];
}

/** Default repository element descriptors used by the boundaries plugin. */
const defaultElements: ElementDescriptors = [
  { partialMatch: false, pattern: "**/src", type: "entrypoint" },
  { basePattern: "**/src", pattern: "bootstrap", type: "bootstrap" },
  { basePattern: "**/src", pattern: "presentation", type: "presentation" },
  {
    basePattern: "**/src",
    pattern: "infrastructure",
    type: "infrastructure",
  },
  { basePattern: "**/src", pattern: "application", type: "application" },
  { basePattern: "**/src", pattern: "domain", type: "domain" },
  { basePattern: "**/src", pattern: "shared", type: "shared" },
];

/** Default repository dependency rules used by the boundaries plugin. */
const defaultElementTypes: BoundariesElementTypesRuleEntry = [
  "error",
  {
    default: "disallow",
    policies: [
      {
        allow: { to: { element: { type: ["bootstrap"] } } },
        from: { element: { type: "entrypoint" } },
      },
      {
        allow: {
          to: {
            element: {
              type: [
                "presentation",
                "infrastructure",
                "application",
                "domain",
                "shared",
              ],
            },
          },
        },
        from: { element: { type: "bootstrap" } },
      },
      {
        allow: {
          to: { element: { type: ["application", "domain", "shared"] } },
        },
        from: { element: { type: "presentation" } },
      },
      {
        allow: {
          to: { element: { type: ["application", "domain", "shared"] } },
        },
        from: { element: { type: "infrastructure" } },
      },
      {
        allow: { to: { element: { type: ["domain", "shared"] } } },
        from: { element: { type: "application" } },
      },
      {
        allow: { to: { element: { type: ["shared"] } } },
        from: { element: { type: "domain" } },
      },
      {
        allow: { to: { element: { type: ["shared"] } } },
        from: { element: { type: "shared" } },
      },
    ],
  },
];

/** Default source file globs included in repository boundaries checks. */
const defaultFiles = ["**/src/**/*.ts"];

/** Default source file globs excluded from repository boundaries checks. */
const defaultIgnores = ["**/*.{spec,test,e2e}.ts", "**/__tests__/**"];

/** Repository default boundaries topology aligned with Clean Architecture. */
const defaultBoundariesConfig: BoundariesConfig = {
  elements: defaultElements,
  elementTypes: defaultElementTypes,
  files: defaultFiles,
  ignores: defaultIgnores,
};

/**
 * Load boundaries plugin configuration using the package-owned fixed topology.
 * @returns Return value output.
 * @example
 * ```typescript
 * const configs = boundaries();
 * ```
 */
function boundaries(): Linter.Config[] {
  const settings: Settings = {
    ...strict.settings,
    "boundaries/elements": defaultBoundariesConfig.elements,
  };

  const rules: Rules = {
    ...strict.rules,
    "boundaries/dependencies": defaultBoundariesConfig.elementTypes,
  };

  const configObject = createConfig({
    files: [...defaultBoundariesConfig.files],
    ignores: [...defaultBoundariesConfig.ignores],
    rules,
    settings,
  }) as ConfigObject;

  return defineConfig(configObject);
}

export { boundaries, defaultBoundariesConfig };

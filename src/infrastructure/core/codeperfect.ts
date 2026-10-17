import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Load the upstream CodePerfect ESLint configuration.
 * @returns The upstream CodePerfect config array.
 * @example
 * ```typescript
 * const configs = await codeperfect();
 * ```
 */
export async function codeperfect(): Promise<Linter.Config[]> {
  const pluginModule = await import("@codeperfect/eslint-plugin");
  const files = ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"];

  return defineConfig(
    { ...pluginModule.all, files },
    {
      files,
      name: "codeperfect/custom",
      rules: {
        "codeperfect/assert-actual-expected-names": "off",
        "codeperfect/enforce-aaa-structure": "off",
        "codeperfect/require-act-result-capture": "off",
        "codeperfect/require-example-language": "off",
        "codeperfect/single-act-statement": "off",
      },
    },
  );
}

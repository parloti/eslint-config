import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Builds the recommended \@eslint/json configuration for JSON files.
 * @returns Recommended JSON configuration.
 * @example
 * ```typescript
 * await json();
 * ```
 */
async function json(): Promise<Linter.Config[]> {
  const { default: jsonPlugin } = await import("@eslint/json");

  return defineConfig(
    {
      extends: [jsonPlugin.configs.recommended],
      files: ["**/*.json"],
      ignores: ["package-lock.json"],
      language: "json/jsonc",
    },
    ["jsonc", "json5"].map((extension) => ({
      extends: [jsonPlugin.configs.recommended],
      files: [`**/*.${extension}`],
      ignores: ["package-lock.json"],
      language: `json/${extension}`,
    })),
  );
}

export { json };

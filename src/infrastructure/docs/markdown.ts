import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Builds the recommended \@eslint/markdown configuration.
 * @returns Recommended Markdown configuration.
 * @example
 * ```typescript
 * await markdown();
 * ```
 */
async function markdown(): Promise<Linter.Config[]> {
  const { default: markdownPlugin } = await import("@eslint/markdown");
  const recommendedConfig = markdownPlugin.configs.recommended[0];
  return defineConfig({ ...recommendedConfig, language: "markdown/gfm" });
}

export { markdown };

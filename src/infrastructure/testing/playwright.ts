import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Build and return Playwright-specific ESLint configs and rule adjustments.
 * @returns Return value output.
 * @example
 * ```typescript
 * await playwright();
 * ```
 */
async function playwright(): Promise<Linter.Config[]> {
  const playwrightModule = await import("eslint-plugin-playwright");
  const { configs } = playwrightModule.default;

  return defineConfig({
    ...configs["flat/recommended"],
    files: ["tests/e2e/**/*.ts"],
  });
}

export { playwright };

import plugin from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";

import { config } from "./src";

/**
 * Base ESLint configuration for the project, with specific adjustments for testing files.
 * @returns The base ESLint configuration array.
 * @example
 * ```typescript
 * const baseConfig = await config();
 * ```
 */
const base = await config({
  plugins: { playwright: false, "rxjs-x": false },
  rules: {
    "@typescript-eslint/unified-signatures": "error",
    "import-x/no-nodejs-modules": "off",
  },
});

/**
 * ESLint configuration adjustments specific to Vitest test files, with custom rule settings.
 * @returns The Vitest-specific ESLint configuration array.
 * @example
 * ```typescript
 * const vitestConfig = await vitest();
 * ```
 */
const e2eVitest = defineConfig(
  { settings: { vitest: { typecheck: true } } },
  {
    extends: [plugin.configs.all],
    files: ["tests/e2e/**/*.ts"],
    name: "vitest/custom",
    rules: {
      "vitest/consistent-test-filename": [
        "error",
        { pattern: String.raw`.*\.e2e\.ts$` },
      ],
      "vitest/no-hooks": "off",
      "vitest/prefer-expect-assertions": "off",
      "vitest/require-mock-type-parameters": "off",
      "vitest/unbound-method": "off",
    },
  },
);

export default defineConfig(base, e2eVitest);

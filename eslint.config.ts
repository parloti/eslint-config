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
  plugins: { playwright: false, "rxjs-x": false, "vitest-e2e": true },
  rules: { "import-x/no-nodejs-modules": "off" },
});
export default base;

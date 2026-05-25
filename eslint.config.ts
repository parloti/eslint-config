import { defineConfig } from "eslint/config";

import { config } from "./src";

/** CodePerfect ESLint configuration with custom rules and boundaries. */
const codePerfect = await config({
  plugins: {
    playwright: false,
    "rxjs-x": false,
    "vitest-e2e": true,
  },
});

/** Combined ESLint configuration for the workspace manager project. */
const eslintConfig = defineConfig(codePerfect);
export default eslintConfig;

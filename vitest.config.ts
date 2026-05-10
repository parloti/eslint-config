import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: ["**/index.ts", "**/*.types.ts"],
      include: ["src/**/*.ts", "tests/support/**/*.ts"],
      thresholds: { "100": true },
    },
    include: ["src/**/*.spec.ts", "tests/support/**/*.spec.ts"],
  },
});

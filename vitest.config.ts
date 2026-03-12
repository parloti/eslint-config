import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: [
        "src/architecture/consistent-barrel-files/index.ts",
        "src/architecture/consistent-barrel-files/types.ts",
        "src/architecture/index.ts",
        "src/core/index.ts",
        "src/core/prefer-interface-types/index.ts",
        "src/docs/index.ts",
        "src/docs/no-interface-member-docs/index.ts",
        "src/docs/no-interface-member-docs/types.ts",
        "src/docs/require-example-language/index.ts",
        "src/docs/require-example-language/types.ts",
        "src/docs/single-line-jsdoc/index.ts",
        "src/domain/index.ts",
        "src/index-spec-helpers.ts",
        "src/style/index.ts",
        "src/testing/index.ts",
        "src/testing/prefer-vi-mocked-import/index.ts",
        "src/testing/prefer-vi-mocked-import/types.ts",
        "src/testing/require-test-companion/index.ts",
        "src/testing/require-test-companion/types.ts",
        "src/types.ts",
      ],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    environment: "node",
  },
});

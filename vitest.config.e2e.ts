import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/**/*.e2e.ts"], name: "e2e", testTimeout: 30_000 },
});

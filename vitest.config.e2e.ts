import _default from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [_default()],
  test: { include: ["tests/**/*.e2e.ts"], name: "e2e", testTimeout: 30_000 },
});

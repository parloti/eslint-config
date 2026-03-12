import { afterEach, describe, expect, it, vi } from "vitest";

describe("import-x branch coverage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("eslint-plugin-import-x");
  });

  it("handles configs without rules", async () => {
    vi.resetModules();
    vi.doMock("eslint-plugin-import-x", () => ({
      flatConfigs: {
        recommended: { rules: { "import-x/no-duplicates": "warn" } },
        typescript: { rules: {} },
        warnings: { rules: void 0 },
      },
      rules: {
        "no-default-export": {},
        "no-duplicates": {},
        "some-extra": {},
      },
    }));

    const { importX } = await import(".");
    const configs = await importX();

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some((config) => config.name === "import-x/custom-error"),
    ).toBe(true);
  });
});

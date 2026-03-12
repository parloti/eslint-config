import { afterEach, describe, expect, it, vi } from "vitest";

describe("docs branch coverage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments");
    vi.doUnmock("@eslint-community/eslint-plugin-eslint-comments/configs");
    vi.doUnmock("eslint-plugin-jsdoc");
  });

  it("handles eslint-comments config without rules", async () => {
    vi.resetModules();
    vi.doMock("@eslint-community/eslint-plugin-eslint-comments", () => ({
      rules: {},
    }));
    vi.doMock(
      "@eslint-community/eslint-plugin-eslint-comments/configs",
      () => ({
        recommended: {},
      }),
    );

    const { comments } = await import(".");
    const configs = await comments();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("handles jsdoc plugin without rules", async () => {
    vi.resetModules();
    vi.doMock("eslint-plugin-jsdoc", () => ({
      default: {
        configs: {
          "flat/contents-typescript-error": {},
          "flat/logical-typescript-error": {},
          "flat/recommended-typescript-error": {},
          "flat/requirements-typescript-error": {},
          "flat/stylistic-typescript-error": {},
        },
        rules: void 0,
      },
    }));

    const { jsdoc } = await import(".");
    const configs = await jsdoc();

    expect(configs.length).toBeGreaterThan(0);
  });
});

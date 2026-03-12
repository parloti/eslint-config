import type { Rule } from "eslint";
import type index from "eslint-plugin-jsdoc";

import { describe, expect, it, vi } from "vitest";

import { comments, jsdoc } from ".";

vi.mock(import("eslint-plugin-jsdoc"), () => ({
  default: {
    configs: {
      "flat/contents-typescript-error": {},
      "flat/logical-typescript-error": {},
      "flat/recommended-typescript-error": {},
      "flat/requirements-typescript-error": {},
      "flat/stylistic-typescript-error": {},
    } as (typeof index)["configs"],
    rules: {
      "require-description": {
        create: (): Rule.RuleListener => ({}),
      },
    },
  } as typeof index,
}));

describe("docs configs", () => {
  it("returns eslint-comments configs with custom entries", async () => {
    const configs = await comments();

    expect(configs.length).toBeGreaterThan(0);
    expect(
      configs.some(
        (config) => config.name === "@eslint-community/eslint-comments/custom",
      ),
    ).toBe(true);
  });

  it("returns jsdoc configs with custom entries", async () => {
    const configs = await jsdoc();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jsdoc/custom")).toBe(true);
    expect(
      configs.some((config) => config.name === "jsdoc/require-jsdoc-alias"),
    ).toBe(true);
    expect(configs.some((config) => config.name === "jsdoc/custom-spec")).toBe(
      true,
    );
  });

  it("exposes custom jsdoc rules", async () => {
    const configs = await jsdoc();
    const customConfig = configs.find(
      (config) => config.name === "jsdoc/custom",
    );
    const requireJsdocConfig = configs.find(
      (config) => config.name === "jsdoc/require-jsdoc-alias",
    );

    expect(customConfig?.rules).toMatchObject({
      "jsdoc/text-escaping": "off",
    });
    expect(requireJsdocConfig?.rules).toMatchObject({
      "jsdoc/require-jsdoc": ["error", expect.any(Object)],
    });
  });
});

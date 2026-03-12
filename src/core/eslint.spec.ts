import { describe, expect, it } from "vitest";

import { eslint } from "./eslint";

describe("eslint config", () => {
  it("returns custom configs", () => {
    const configs = eslint();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "@eslint/js/custom")).toBe(
      true,
    );
  });
});

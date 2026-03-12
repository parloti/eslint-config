import { describe, expect, it } from "vitest";

import { prettier } from "./prettier";

describe("prettier config", () => {
  it("returns configs", async () => {
    const configs = await prettier();

    expect(configs.length).toBeGreaterThan(0);
  });
});

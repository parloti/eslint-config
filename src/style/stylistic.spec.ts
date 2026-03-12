import { describe, expect, it } from "vitest";

import { stylistic } from "./stylistic";

describe("stylistic config", () => {
  it("returns configs", async () => {
    const configs = await stylistic();

    expect(configs.length).toBeGreaterThan(0);
  });
});

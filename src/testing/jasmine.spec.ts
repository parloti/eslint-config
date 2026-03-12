import { describe, expect, it } from "vitest";

import { jasmine } from "./jasmine";

describe("jasmine config", () => {
  it("returns configs", async () => {
    const configs = await jasmine();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some((config) => config.name === "jasmine/custom")).toBe(
      true,
    );
  });
});

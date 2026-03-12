import { describe, expect, it } from "vitest";

import { resolver } from "./resolver";

describe("resolver config", () => {
  it("returns resolver settings", async () => {
    const configs = await resolver();

    expect(configs.length).toBeGreaterThan(0);
    expect(configs[0]?.settings).toBeDefined();
  });
});

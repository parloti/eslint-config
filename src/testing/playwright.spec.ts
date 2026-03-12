import { describe, expectTypeOf, it } from "vitest";

import { playwright } from "./playwright";

describe("playwright config", () => {
  it("exports a config builder", () => {
    expectTypeOf(playwright).toBeFunction();
  });
});

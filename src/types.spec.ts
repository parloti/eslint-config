import { describe, expect, it } from "vitest";

import * as types from "./types";

describe("shared types", () => {
  it("loads the module", () => {
    expect(types).toBeDefined();
  });
});

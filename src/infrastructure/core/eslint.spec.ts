import { describe, expect, it } from "vitest";

import { eslint } from "./eslint";

describe("eslint config", () => {
  it("returns custom configs", () => {
    // Act
    const actual = eslint();

    // Assert
    expect(actual).toHaveLength(3);
  });
});

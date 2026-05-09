import { describe, expect, it } from "vitest";

import { eslint } from "./eslint";

describe("eslint config", () => {
  // eslint-disable-next-line codeperfect/require-aaa-sections -- false positive
  it("returns custom configs", () => {
    // Act
    const config = eslint();

    // Assert
    expect(config).toHaveLength(3);
  });
});

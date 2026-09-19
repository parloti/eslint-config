import { describe, expect, it } from "vitest";

import { markdown } from "./markdown";

describe("markdown config", () => {
  it("loads the upstream recommended configuration", async () => {
    // Act
    const [actualConfig] = await markdown();

    // Assert
    expect(actualConfig).toMatchObject({
      files: ["**/*.md"],
      language: "markdown/gfm",
      name: "markdown/recommended",
      rules: { "markdown/heading-increment": "error" },
    });
  });
});

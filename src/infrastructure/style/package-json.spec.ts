import { describe, expect, it } from "vitest";

import { packageJson } from "./package-json";

describe("style/package-json", () => {
  it("should return the recommended config with error severity for package.json files", async () => {
    // Arrange
    const expectedRuleId = "package-json/valid-fields";

    // Act
    const [recommendedConfig] = await packageJson();

    // Assert
    const rules = recommendedConfig?.rules ?? {};

    expect(rules[expectedRuleId]).toBe("error");
  });
});

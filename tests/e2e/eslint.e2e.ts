import { describe, expect, it } from "vitest";

import { lintFixtureCode, lintFixtureFiles } from "./helpers";

describe("eslint end-to-end", () => {
  it("flags explicit any usage in fixture code", async () => {
    // Arrange
    const fixtureCode = `
      function format(value: any): string {
        return String(value);
      }
    `;

    // Act
    const [actualResult] = await lintFixtureCode(
      fixtureCode,
      "tests/e2e/fixtures/src/domain/user.ts",
    );

    // Assert
    expect(actualResult?.messages).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "@typescript-eslint/no-explicit-any",
        }),
      ]),
    );
  });

  it("accepts a compliant fixture without findings", async () => {
    // Act
    const [actualResult] = await lintFixtureFiles([
      "tests/e2e/fixtures/src/domain/user.ts",
    ]);

    // Assert
    expect(actualResult?.messages).toStrictEqual([]);
  });
});

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import { config } from "#root";

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

  it("enforces layer direction in a scoped boundaries profile", async () => {
    // Arrange
    const eslint = new ESLint({
      overrideConfig: await config({
        plugins: { boundaries: false },
        scopedPlugins: [
          { basePath: "tests/e2e/fixtures", plugins: ["boundaries"] },
        ],
      }),
      overrideConfigFile: true,
    });

    // Act
    const [result] = await eslint.lintText(
      'export type { Bootstrap } from "../bootstrap";',
      { filePath: "tests/e2e/fixtures/src/domain/user.ts" },
    );

    // Assert
    expect(result?.messages).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "boundaries/dependencies" }),
      ]),
    );
  });
});

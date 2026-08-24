import js from "@eslint/js";
import { describe, expect, it } from "vitest";

import { eslint } from "./eslint";

describe("eslint config", () => {
  it("returns custom configs", () => {
    // Act
    const actual = eslint();

    // Assert
    expect(actual).toHaveLength(4);
  });

  it("scopes the recommended config to JavaScript and TypeScript files only", () => {
    // Act
    const [recommended] = eslint();

    // Assert
    expect(recommended?.files).toStrictEqual([
      "**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ]);
    expect(recommended?.rules).toStrictEqual(js.configs.recommended.rules);
  });
});

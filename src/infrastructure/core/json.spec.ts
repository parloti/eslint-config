import { describe, expect, it } from "vitest";

import { json } from "./json";

describe("json config", () => {
  it("scopes the recommended configuration to JSON files", async () => {
    // Act
    const actualConfigs = await json();

    // Assert
    expect(actualConfigs).toHaveLength(6);

    for (const extension of ["json", "jsonc", "json5"]) {
      const scopedConfigs = actualConfigs.filter((config) =>
        (config.files ?? []).includes(`**/*.${extension}`),
      );

      expect(Object.assign({}, ...scopedConfigs)).toMatchObject({
        files: [`**/*.${extension}`],
        ignores: ["package-lock.json"],
        language: extension === "json" ? "json/jsonc" : `json/${extension}`,
        rules: { "json/no-duplicate-keys": "error" },
      });
    }
  });
});

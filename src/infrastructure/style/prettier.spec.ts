import { describe, expect, it } from "vitest";

import { prettier } from "./prettier";

describe("prettier config", () => {
  it("applies eslint-config-prettier rules to TypeScript files", async () => {
    // Act
    const configs = await prettier();
    const config = configs[0];

    // Assert
    expect(configs).toHaveLength(1);
    expect(config?.files).toStrictEqual(["**/*.ts"]);
    expect(config?.name).toBe("config-prettier");
    expect(config?.rules?.["@stylistic/indent"]).toBe("off");
    expect(config?.rules).not.toHaveProperty("prettier/prettier");
  });
});

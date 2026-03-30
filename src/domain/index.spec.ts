import { describe, expect, it, vi } from "vitest";

import { rxjsX } from "./rxjs-x";

vi.mock(
  import("eslint-plugin-rxjs-x"),
  () =>
    ({
      default: {
        configs: {
          strict: { name: "rxjs-x/strict" },
        },
      },
    }) as unknown as Record<string, unknown>,
);

describe("domain configs", () => {
  it("returns rxjs-x configs with custom entries", async () => {
    // Arrange
    const expectedConfigNames = ["rxjs-x/custom", "rxjs-x/custom-spec"];

    // Act
    const actualConfigNames = await rxjsX().then((configs) =>
      configs.map((config) => config.name),
    );

    // Assert
    expect(actualConfigNames).toStrictEqual(
      expect.arrayContaining(expectedConfigNames),
    );
  });
});

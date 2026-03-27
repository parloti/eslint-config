import { describe, expect, it, vi } from "vitest";

import { perfectionist } from "./perfectionist";
import { prettier } from "./prettier";
import { stylistic } from "./stylistic";
import { unicorn } from "./unicorn";

vi.mock(
  import("eslint-plugin-perfectionist"),
  () =>
    ({
      configs: {
        "recommended-natural": { name: "perfectionist/recommended-natural" },
      },
    }) as unknown as Record<string, unknown>,
);

vi.mock(
  import("eslint-plugin-unicorn"),
  () =>
    ({
      default: {
        configs: {
          all: { name: "unicorn/all" },
        },
      },
    }) as unknown as Record<string, unknown>,
);

describe("style configs", () => {
  it("returns perfectionist configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await perfectionist();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });

  it("returns prettier configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await prettier();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });

  it("returns stylistic configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await stylistic();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });

  it("returns unicorn configs", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const configs = await unicorn();

    // Assert
    expect(configs.length).toBeGreaterThan(0);
  });
});

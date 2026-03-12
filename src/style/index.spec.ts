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
    const configs = await perfectionist();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("returns prettier configs", async () => {
    const configs = await prettier();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("returns stylistic configs", async () => {
    const configs = await stylistic();

    expect(configs.length).toBeGreaterThan(0);
  });

  it("returns unicorn configs", async () => {
    const configs = await unicorn();

    expect(configs.length).toBeGreaterThan(0);
  });
});

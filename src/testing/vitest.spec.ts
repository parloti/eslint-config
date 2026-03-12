import { afterEach, describe, expect, it, vi } from "vitest";

vi.unmock("@vitest/eslint-plugin");

describe("vitest plugin branches", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("returns empty when plugin is undefined", async () => {
    vi.resetModules();
    vi.doMock("@vitest/eslint-plugin", () => ({ default: void 0 }));

    const { vitest } = await import("./vitest");
    const configs = await vitest();

    expect(configs).toStrictEqual([]);
  });

  it("returns empty when plugin configs are undefined", async () => {
    vi.resetModules();
    vi.doMock("@vitest/eslint-plugin", () => ({
      default: { configs: void 0 },
    }));

    const { vitest } = await import("./vitest");
    const configs = await vitest();

    expect(configs).toStrictEqual([]);
  });
});

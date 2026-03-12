import type { Linter } from "eslint";

import { describe, expect, it, vi } from "vitest";

import {
  applyRuleOverrides,
  collectAvailablePlugins,
  isPluginDisabled,
  loadPluginConfig,
} from "./utilities";

describe(applyRuleOverrides, () => {
  it("returns original config when overrides are undefined", () => {
    const config = [{ name: "base" }];

    expect(applyRuleOverrides(config)).toBe(config);
  });

  it("returns original config when overrides are empty", () => {
    const config = [{ name: "base" }];

    expect(applyRuleOverrides(config, {})).toBe(config);
  });

  it("appends rule overrides when provided", () => {
    const config = [{ name: "base" }];
    const result = applyRuleOverrides(config, { "no-console": "off" });

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(config[0]);
    expect(result[1]).toStrictEqual({
      name: "custom/rule-overrides",
      rules: { "no-console": "off" },
    });
  });

  it("skips overrides for missing plugins", () => {
    const config = [{ name: "base" }];
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    const result = applyRuleOverrides(
      config,
      { "vitest/expect-expect": "error" },
      new Set(["jest"]),
    );

    expect(result).toStrictEqual(config);
    expect(stderrSpy).toHaveBeenCalledTimes(1);

    const [firstCall] = stderrSpy.mock.calls;

    expect(firstCall).toBeDefined();
    expect(firstCall?.[0]).toContain(
      "Skipped rule override: vitest/expect-expect",
    );

    stderrSpy.mockRestore();
  });

  it("keeps overrides for available plugins", () => {
    const config = [{ name: "base" }];
    const result = applyRuleOverrides(
      config,
      { "vitest/expect-expect": "error" },
      new Set(["vitest"]),
    );

    expect(result).toHaveLength(2);
    expect(result[1]).toStrictEqual({
      name: "custom/rule-overrides",
      rules: { "vitest/expect-expect": "error" },
    });
  });
});

describe(isPluginDisabled, () => {
  it("returns false when list is undefined", () => {
    expect(isPluginDisabled("jest", void 0)).toBe(false);
  });

  it("returns false when plugin is not disabled", () => {
    expect(isPluginDisabled("jest", ["jasmine"])).toBe(false);
  });

  it("returns true when plugin is disabled", () => {
    expect(isPluginDisabled("jest", ["jasmine", "jest"])).toBe(true);
  });
});

describe(collectAvailablePlugins, () => {
  it("returns plugin names from config entries", () => {
    const configs: Linter.Config[] = [
      { name: "one", plugins: { vitest: {} } },
      { name: "two", plugins: { jest: {} } },
    ];
    const plugins = collectAvailablePlugins(configs);

    expect(plugins.has("vitest")).toBe(true);
    expect(plugins.has("jest")).toBe(true);
  });

  it("returns empty set when no plugins provided", () => {
    const plugins = collectAvailablePlugins([{ name: "one" }]);

    expect(plugins.size).toBe(0);
  });
});

describe(loadPluginConfig, () => {
  it("returns loaded configs", async () => {
    const loader = vi.fn(async () => {
      await Promise.resolve();
      return [{ name: "test" }];
    });

    await expect(loadPluginConfig("jest", loader)).resolves.toStrictEqual([
      { name: "test" },
    ]);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("prints a helpful error and returns empty configs", async () => {
    const error = new Error("Missing plugin");
    const loader = vi.fn(async () => {
      await Promise.resolve();
      throw error;
    });
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    await expect(loadPluginConfig("jest", loader)).resolves.toStrictEqual([]);
    expect(stderrSpy).toHaveBeenCalledTimes(1);

    const [firstCall] = stderrSpy.mock.calls;

    expect(firstCall).toBeDefined();
    expect(firstCall?.[0]).toContain(
      "Failed to load ESLint plugin config: jest",
    );
    expect(firstCall?.[0]).toContain("Install the plugin or disable it");

    stderrSpy.mockRestore();
  });

  it("rethrows required loader failures after reporting them", async () => {
    const error = new Error("Missing required peer");
    const loader = vi.fn(async () => {
      await Promise.resolve();
      throw error;
    });
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    await expect(
      loadPluginConfig("typescript", loader, "required"),
    ).rejects.toBe(error);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      'Install the required peer dependency backing "typescript"',
    );

    stderrSpy.mockRestore();
  });

  it("classifies missing optional integrations as skips", async () => {
    const loader = vi.fn(async () => {
      await Promise.resolve();
      throw new Error("Cannot find module 'eslint-plugin-jest'");
    });
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    await expect(loadPluginConfig("jest", loader)).resolves.toStrictEqual([]);
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    expect(stderrSpy.mock.calls[0]?.[0]).toContain(
      "Skipped optional ESLint plugin config: jest",
    );

    stderrSpy.mockRestore();
  });
});

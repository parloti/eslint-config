import { afterEach, describe, expect, it, vi } from "vitest";

import type {
  BoundariesConfig,
  BoundariesElementTypesRuleEntry,
} from "../../domain";

import { boundaries, defaultBoundariesConfig } from "./boundaries";

/** Assertion facts derived from the resolved dependencies rule. */
interface DependenciesRuleFacts {
  /** The resolved dependencies rule entry. */
  actualDependenciesRule: BoundariesElementTypesRuleEntry | undefined;

  /** Whether an application source rule is present. */
  hasApplicationFromRule: boolean | undefined;

  /** Whether an entrypoint source rule is present. */
  hasDependenciesRule: boolean | undefined;
}

/**
 * Check whether one dependencies rule entry targets a specific source type.
 * @param rule One boundaries dependency rule.
 * @param expectedType The expected source type.
 * @returns Whether the rule matches the expected source type.
 * @example
 * ```typescript
 * hasFromType(actualRule, "application");
 * ```
 */
function hasFromType(
  rule: NonNullable<BoundariesElementTypesRuleEntry[1]["rules"]>[number],
  expectedType: string,
): boolean {
  const { from } = rule;

  return (
    from !== void 0 &&
    typeof from !== "string" &&
    "type" in from &&
    from.type === expectedType
  );
}

/**
 * Read the resolved dependencies rule from a generated config array.
 * @param configs Generated ESLint config array.
 * @returns The typed dependencies rule when present.
 * @example
 * ```typescript
 * readDependenciesRule(boundaries());
 * ```
 */
function readDependenciesRule(
  configs: ReturnType<typeof boundaries>,
): BoundariesElementTypesRuleEntry | undefined {
  for (const entry of configs) {
    const candidate = entry.rules?.["boundaries/dependencies"] as unknown;

    if (Array.isArray(candidate)) {
      return candidate as BoundariesElementTypesRuleEntry;
    }
  }

  return void 0;
}

/**
 * Read the assertion facts derived from the resolved dependencies rule.
 * @param configs Generated ESLint config array.
 * @returns The resolved rule and derived assertion booleans.
 * @example
 * ```typescript
 * readDependenciesRuleFacts(boundaries());
 * ```
 */
function readDependenciesRuleFacts(
  configs: ReturnType<typeof boundaries>,
): DependenciesRuleFacts {
  const actualDependenciesRule = readDependenciesRule(configs);

  return {
    actualDependenciesRule,
    hasApplicationFromRule: actualDependenciesRule?.[1].rules?.some((rule) =>
      hasFromType(rule, "application"),
    ),
    hasDependenciesRule: actualDependenciesRule?.[1].rules?.some((rule) =>
      hasFromType(rule, "entrypoint"),
    ),
  };
}

describe("boundaries config", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds configs from the default topology without setup", () => {
    // Arrange
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    // Act
    const hasDependenciesRule = boundaries().some((entry) =>
      Object.hasOwn(entry.rules ?? {}, "boundaries/dependencies"),
    );

    // Assert
    expect(hasDependenciesRule).toBe(true);
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("allows overriding the default topology", () => {
    // Arrange
    const config: BoundariesConfig = {
      elements: [{ pattern: "packages/*/src", type: "package" }],
      elementTypes: ["error", { default: "disallow", rules: [] }],
      files: ["packages/*/src/**/*.ts"],
    };

    // Act
    const configs = boundaries(config);

    // Assert
    expect(configs).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ files: ["packages/*/src/**/*.ts"] }),
        expect.objectContaining({ ignores: ["src/**/*.spec.ts"] }),
      ]),
    );
  });

  it("exports the default repository topology for consumer extension", () => {
    // Arrange
    const expectedFiles = ["src/**/*.ts"];

    // Act
    const configs = boundaries({ files: defaultBoundariesConfig.files });

    // Assert
    expect(defaultBoundariesConfig.files).toStrictEqual(expectedFiles);
    expect(defaultBoundariesConfig.ignores).toStrictEqual(["src/**/*.spec.ts"]);
    expect(configs).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ files: expectedFiles }),
      ]),
    );
  });

  it("merges partial overrides with the default topology", () => {
    // Arrange
    const config: BoundariesConfig = {
      extend: {
        ignores: ["fixtures/**/*.ts"],
      },
    };

    // Act
    const configs = boundaries(config);

    // Assert
    expect(configs).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ files: ["src/**/*.ts"] }),
        expect.objectContaining({
          ignores: ["src/**/*.spec.ts", "fixtures/**/*.ts"],
        }),
      ]),
    );
  });

  it("extends element rules without discarding the defaults", () => {
    // Arrange
    const config: BoundariesConfig = {
      extend: {
        elementTypes: {
          rules: [
            {
              allow: { to: { type: "infrastructure" } },
              from: { type: "application" },
            },
          ],
        },
      },
    };

    // Act
    const result = readDependenciesRuleFacts(boundaries(config));

    // Assert
    expect(result.actualDependenciesRule?.[0]).toBe("error");
    expect(result.hasDependenciesRule).toBe(true);
    expect(result.hasApplicationFromRule).toBe(true);
  });

  it("normalizes missing element rule arrays when overrides or extensions omit them", () => {
    // Arrange
    const config: BoundariesConfig = {
      elementTypes: ["error", { default: "allow" }],
      extend: { elementTypes: {} },
    };

    // Act
    const actualDependenciesRule = readDependenciesRule(boundaries(config));

    // Assert
    expect(actualDependenciesRule?.[0]).toBe("error");
    expect(actualDependenciesRule?.[1].default).toBe("allow");
    expect(actualDependenciesRule?.[1].rules ?? []).toStrictEqual([]);
  });
});

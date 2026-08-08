import { describe, expect, it, vi } from "vitest";

import type { BoundariesElementTypesRuleEntry } from "../../domain";

import { boundaries, defaultBoundariesConfig } from "./boundaries";

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

/** Expected directional graph for repository boundaries. */
const expectedElementTypesRule: BoundariesElementTypesRuleEntry = [
  "error",
  {
    default: "disallow",
    rules: [
      {
        allow: { to: { type: ["bootstrap"] } },
        from: { type: "entrypoint" },
      },
      {
        allow: {
          to: {
            type: [
              "presentation",
              "infrastructure",
              "application",
              "domain",
              "shared",
            ],
          },
        },
        from: { type: "bootstrap" },
      },
      {
        allow: { to: { type: ["application", "domain", "shared"] } },
        from: { type: "presentation" },
      },
      {
        allow: { to: { type: ["application", "domain", "shared"] } },
        from: { type: "infrastructure" },
      },
      {
        allow: { to: { type: ["domain", "shared"] } },
        from: { type: "application" },
      },
      {
        allow: { to: { type: ["shared"] } },
        from: { type: "domain" },
      },
      {
        allow: { to: { type: ["shared"] } },
        from: { type: "shared" },
      },
    ],
  },
];

describe("boundaries config", () => {
  it("builds configs from the default topology without setup", () => {
    // Arrange
    const stderrSpy = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    // Act
    const actualHasDependenciesRule = {
      isPresent: boundaries().some((entry) =>
        Object.hasOwn(entry.rules ?? {}, "boundaries/dependencies"),
      ),
    };

    // Assert
    expect(actualHasDependenciesRule.isPresent).toBe(true);
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it("exposes fixed files, ignores, and seven-layer descriptors", () => {
    // Arrange
    const expectedTypes = [
      "entrypoint",
      "bootstrap",
      "presentation",
      "infrastructure",
      "application",
      "domain",
      "shared",
    ];

    // Act
    const actualTypes = defaultBoundariesConfig.elements.map(
      (element) => element.type,
    );

    // Assert
    expect(defaultBoundariesConfig.files).toStrictEqual(["**/src/**/*.ts"]);
    expect(defaultBoundariesConfig.ignores).toStrictEqual([
      "**/*.{spec,test,e2e}.ts",
      "**/__tests__/**",
    ]);
    expect(actualTypes).toStrictEqual(expectedTypes);
  });

  it("enforces the package-owned dependency direction graph", () => {
    // Arrange
    const expectedDependenciesRule = expectedElementTypesRule;

    // Act
    const actualDependenciesRule = readDependenciesRule(boundaries());

    // Assert
    expect(actualDependenciesRule).toStrictEqual(expectedDependenciesRule);
  });
});

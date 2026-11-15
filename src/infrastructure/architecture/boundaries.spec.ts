import type { Settings } from "eslint-plugin-boundaries";

import { ESLint } from "eslint";
import { describe, expect, it, vi } from "vitest";

import type { BoundariesElementTypesRuleEntry } from "../../domain";

import { boundaries } from "./boundaries";

/** Resolved boundary topology fields read from a generated config array. */
interface BoundaryTopology {
  /** Resolved element type names in descriptor order. */
  elementTypes: string[];
  /** Source globs included in boundaries checks. */
  files: string[];
  /** Source globs excluded from boundaries checks. */
  ignores: string[];
}

/**
 * Read the resolved boundary topology from a generated config array.
 * @param configs Generated ESLint config array.
 * @returns The default topology fields.
 * @example
 * ```typescript
 * readBoundaryTopology(boundaries());
 * ```
 */
function readBoundaryTopology(
  configs: ReturnType<typeof boundaries>,
): BoundaryTopology {
  const boundaryConfig = configs.find((entry) => entry.settings !== void 0);
  const settings = boundaryConfig?.settings as Settings | undefined;
  const elements = settings?.["boundaries/elements"];

  return {
    elementTypes:
      elements
        ?.map((element) => element.type)
        .filter((type): type is string => type !== void 0) ?? [],
    files: toPatterns(boundaryConfig?.files),
    ignores: toPatterns(boundaryConfig?.ignores),
  };
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
 * Normalize a flat config glob field to a string array.
 * @param raw Files or ignores patterns from a flat config entry.
 * @returns The flattened pattern array.
 * @example
 * ```typescript
 * toPatterns(["src/index.ts"]);
 * ```
 */
function toPatterns(raw: (string | string[])[] | undefined): string[] {
  return raw?.flat() ?? [];
}

/** Expected directional graph for repository boundaries. */
const expectedElementTypesRule: BoundariesElementTypesRuleEntry = [
  "error",
  {
    default: "disallow",
    policies: [
      {
        allow: {
          to: {
            element: {
              type: [
                "bootstrap",
                "presentation",
                "infrastructure",
                "application",
                "domain",
                "shared",
              ],
            },
          },
        },
        from: { file: { categories: "entrypoint" } },
      },
      {
        allow: {
          to: {
            element: {
              type: [
                "presentation",
                "infrastructure",
                "application",
                "domain",
                "shared",
              ],
            },
          },
        },
        from: { element: { type: "bootstrap" } },
      },
      {
        allow: {
          to: { element: { type: ["application", "domain", "shared"] } },
        },
        from: { element: { type: "presentation" } },
      },
      {
        allow: {
          to: { element: { type: ["application", "domain", "shared"] } },
        },
        from: { element: { type: "infrastructure" } },
      },
      {
        allow: { to: { element: { type: ["domain", "shared"] } } },
        from: { element: { type: "application" } },
      },
      {
        allow: { to: { element: { type: ["shared"] } } },
        from: { element: { type: "domain" } },
      },
      {
        allow: { to: { element: { type: ["shared"] } } },
        from: { element: { type: "shared" } },
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

  it("exposes fixed files, ignores, and layer descriptors", () => {
    // Arrange
    const expectedTypes = [
      "bootstrap",
      "presentation",
      "infrastructure",
      "application",
      "domain",
      "shared",
    ];

    // Act
    const actualBoundaryTopology = readBoundaryTopology(boundaries());

    // Assert
    expect(actualBoundaryTopology.files).toStrictEqual(["**/src/**/*.ts"]);
    expect(actualBoundaryTopology.ignores).toStrictEqual([
      "**/*.{spec,test,e2e}.ts",
      "**/__tests__/**",
    ]);
    expect(actualBoundaryTopology.elementTypes).toStrictEqual(expectedTypes);
  });

  it("enforces the package-owned dependency direction graph", () => {
    // Arrange
    const expectedDependenciesRule = expectedElementTypesRule;

    // Act
    const actualDependenciesRule = readDependenciesRule(boundaries());

    // Assert
    expect(actualDependenciesRule).toStrictEqual(expectedDependenciesRule);
  });

  it.each([
    {
      code: 'export * from "./bootstrap/index.ts";',
      filePath: "tests/e2e/fixtures/src/index.ts",
      ruleId: undefined,
    },
    {
      code: 'export * from "./domain/index.ts";',
      filePath: "tests/e2e/fixtures/src/index.ts",
      ruleId: undefined,
    },
    {
      code: 'export * from "../shared/index.ts";',
      filePath: "tests/e2e/fixtures/src/domain/user.ts",
      ruleId: undefined,
    },
    {
      code: 'export * from "../domain/index.ts";',
      filePath: "tests/e2e/fixtures/src/application/user-service.ts",
      ruleId: undefined,
    },
    {
      code: 'export * from "./user.ts";',
      filePath: "tests/e2e/fixtures/src/domain/index.ts",
      ruleId: undefined,
    },
    {
      code: 'export * from "../bootstrap/index.ts";',
      filePath: "tests/e2e/fixtures/src/domain/user.ts",
      ruleId: "boundaries/dependencies",
    },
    {
      code: 'export * from "../application/index.ts";',
      filePath: "tests/e2e/fixtures/src/domain/index.ts",
      ruleId: "boundaries/dependencies",
    },
    {
      code: "export const component = 1;",
      filePath: "tests/e2e/fixtures/src/app/pages/component.ts",
      ruleId: "boundaries/no-unknown-files",
    },
    {
      code: "export const app = 1;",
      filePath: "tests/e2e/fixtures/src/app/index.ts",
      ruleId: "boundaries/no-unknown-files",
    },
    {
      code: "export const main = 1;",
      filePath: "tests/e2e/fixtures/src/main.ts",
      ruleId: "boundaries/no-unknown-files",
    },
  ])("checks $filePath importing $code", async ({ code, filePath, ruleId }) => {
    // Arrange
    const eslint = new ESLint({
      overrideConfig: boundaries(),
      overrideConfigFile: true,
    });

    // Act
    const [result] = await eslint.lintText(code, { filePath });
    const ruleIds = result?.messages.map((message) => message.ruleId);

    // Assert
    expect(ruleIds).toStrictEqual(ruleId === undefined ? [] : [ruleId]);
  });
});

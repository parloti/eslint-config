import { describe, expect, it, vi } from "vitest";

import { resolver } from "./resolver";

const { createTypeScriptImportResolverMock, defaultConditionNames } =
  vi.hoisted(() => ({
    createTypeScriptImportResolverMock: vi.fn(() => ({})),
    defaultConditionNames: ["import", "types", "node"],
  }));

vi.mock("eslint-import-resolver-typescript", () => ({
  createTypeScriptImportResolver: createTypeScriptImportResolverMock,
  defaultConditionNames,
}));

describe("resolver config", () => {
  it("returns resolver settings", async () => {
    // Arrange
    const minimumConfigCount = 1;
    const sourceConditionNames = ["source", ...defaultConditionNames];

    // Act
    const configs = await resolver();

    // Assert
    expect(configs.length).toBeGreaterThanOrEqual(minimumConfigCount);
    expect(configs[0]?.settings).toBeDefined();
    expect(createTypeScriptImportResolverMock).toHaveBeenNthCalledWith(1, {
      alwaysTryTypes: true,
      conditionNames: sourceConditionNames,
    });
    expect(createTypeScriptImportResolverMock).toHaveBeenNthCalledWith(2, {
      alwaysTryTypes: true,
      conditionNames: defaultConditionNames,
    });
    expect(configs[0]?.settings?.["import-x/resolver-next"]).toHaveLength(2);
    expect(configs[0]?.settings?.["import/resolver"]).toStrictEqual({
      typescript: {
        alwaysTryTypes: true,
        conditionNames: sourceConditionNames,
      },
    });
  });
});

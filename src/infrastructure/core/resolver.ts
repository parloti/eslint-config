import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";

/**
 * Return resolver settings configured for TypeScript imports.
 * @returns Return value output.
 * @example
 * ```typescript
 * await resolver();
 * ```
 */
export async function resolver(): Promise<Linter.Config[]> {
  const { createTypeScriptImportResolver, defaultConditionNames } =
    await import("eslint-import-resolver-typescript");
  const sourceConditionNames = ["source", ...defaultConditionNames];
  const sourceResolver = createTypeScriptImportResolver({
    alwaysTryTypes: true,
    conditionNames: sourceConditionNames,
  });
  const typesResolver = createTypeScriptImportResolver({
    alwaysTryTypes: true,
    conditionNames: defaultConditionNames,
  });

  return defineConfig({
    name: "resolver",
    settings: {
      "import-x/resolver-next": [sourceResolver, typesResolver],
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          conditionNames: sourceConditionNames,
        },
      },
    },
  });
}

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
  const conditionNames = ["source", ...defaultConditionNames];

  return defineConfig({
    name: "resolver",
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          conditionNames,
        }),
      ],
      "import/resolver": {
        typescript: { alwaysTryTypes: true, conditionNames },
      },
    },
  });
}

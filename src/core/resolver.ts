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
  const { createTypeScriptImportResolver } =
    await import("eslint-import-resolver-typescript");

  return defineConfig({
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  });
}

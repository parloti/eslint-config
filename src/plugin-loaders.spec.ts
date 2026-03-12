import { describe, expect, it } from "vitest";

import { moduleTaxonomy } from "./module-taxonomy";
import { pluginLoaders } from "./plugin-loaders";

describe("pluginLoaders", () => {
  it("covers every documented module in the taxonomy", () => {
    expect(Object.keys(pluginLoaders).toSorted()).toStrictEqual(
      moduleTaxonomy.map((entry) => entry.pluginName).toSorted(),
    );
  });

  it("uses the documented load mode for every module", () => {
    expect(
      Object.fromEntries(
        Object.entries(pluginLoaders).map(([pluginName, entry]) => [
          pluginName,
          entry.mode,
        ]),
      ),
    ).toStrictEqual({
      boundaries: "optional",
      comments: "optional",
      eslint: "required",
      "import-x": "optional",
      jasmine: "optional",
      jest: "optional",
      jsdoc: "optional",
      perfectionist: "optional",
      playwright: "optional",
      prettier: "optional",
      resolver: "optional",
      "rxjs-x": "optional",
      stylistic: "optional",
      typescript: "required",
      unicorn: "optional",
      vitest: "optional",
    });
  });
});

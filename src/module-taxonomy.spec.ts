import { describe, expect, it } from "vitest";

import { moduleTaxonomy } from "./module-taxonomy";

describe("moduleTaxonomy", () => {
  it("matches the documented composition order", () => {
    expect(moduleTaxonomy.map((entry) => entry.pluginName)).toStrictEqual([
      "eslint",
      "resolver",
      "typescript",
      "import-x",
      "comments",
      "jsdoc",
      "jasmine",
      "jest",
      "playwright",
      "vitest",
      "rxjs-x",
      "stylistic",
      "perfectionist",
      "unicorn",
      "prettier",
      "boundaries",
    ]);
  });
});

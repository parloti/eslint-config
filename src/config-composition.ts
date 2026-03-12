/** Expected config names when all documented modules are enabled in order. */
const fullCompositionNames = [
  "core-eslint",
  "core-resolver",
  "core-typescript",
  "architecture-import-x",
  "docs-comments",
  "docs-jsdoc",
  "testing-jasmine",
  "testing-jest",
  "testing-playwright",
  "testing-vitest",
  "domain-rxjs",
  "style-stylistic",
  "style-perfectionist",
  "style-unicorn",
  "style-prettier",
  "architecture-boundaries",
] as const;

/** Expected config names when selected optional modules are disabled. */
const reducedCompositionNames = [
  "core-eslint",
  "core-resolver",
  "core-typescript",
  "architecture-import-x",
  "docs-comments",
  "docs-jsdoc",
  "testing-jasmine",
  "testing-jest",
  "testing-playwright",
  "domain-rxjs",
  "style-stylistic",
  "style-perfectionist",
  "style-unicorn",
] as const;

export { fullCompositionNames, reducedCompositionNames };

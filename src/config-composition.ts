/** Expected config names when default-enabled modules are composed in order. */
const defaultCompositionNames = [
  "core-codeperfect",
  "core-eslint",
  "core-resolver",
  "core-typescript",
  "architecture-import-x",
  "docs-comments",
  "docs-jsdoc",
  "testing-playwright",
  "testing-vitest",
  "domain-rxjs",
  "style-stylistic",
  "style-perfectionist",
  "style-unicorn",
  "style-prettier",
  "architecture-boundaries",
] as const;

/** Expected config names when all documented modules are enabled in order. */
const fullCompositionNames = [
  "core-codeperfect",
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
  "core-codeperfect",
  "core-eslint",
  "core-resolver",
  "core-typescript",
  "architecture-import-x",
  "docs-comments",
  "docs-jsdoc",
  "testing-playwright",
  "domain-rxjs",
  "style-stylistic",
  "style-perfectionist",
  "style-unicorn",
] as const;

export {
  defaultCompositionNames,
  fullCompositionNames,
  reducedCompositionNames,
};

import { describe, expect, it } from "vitest";

import {
  codeperfect,
  comments,
  eslint,
  jasmine,
  jest,
  jsdoc,
  perfectionist,
  playwright,
  prettier,
  resolver,
  rxjsX,
  stylistic,
  typescript,
  unicorn,
  vitest,
} from ".";
import * as architecture from "../architecture";
import * as core from "../core";
import * as documentation from "../docs";
import * as domain from "../domain";
import * as style from "../style";
import * as testing from "../testing";

/**
 * Load whether the architecture builders are re-exported from the barrel.
 * @returns Equality results for the architecture builders.
 * @example
 * ```typescript
 * await loadArchitectureExportMatches();
 * ```
 */
async function loadArchitectureExportMatches(): Promise<boolean[]> {
  const actualBuilders = await import(".");

  return [
    actualBuilders.boundaries === architecture.boundaries,
    actualBuilders.importX === architecture.importX,
  ];
}

/**
 * Load whether the core builders are re-exported from the barrel.
 * @returns Equality results for the core builders.
 * @example
 * ```typescript
 * await loadCoreExportMatches();
 * ```
 */
async function loadCoreExportMatches(): Promise<boolean[]> {
  const actualBuilders = await import(".");

  return [
    actualBuilders.codeperfect === codeperfect,
    actualBuilders.codeperfect === core.codeperfect,
    actualBuilders.eslint === eslint,
    actualBuilders.eslint === core.eslint,
    actualBuilders.resolver === resolver,
    actualBuilders.resolver === core.resolver,
    actualBuilders.typescript === typescript,
    actualBuilders.typescript === core.typescript,
  ];
}

/**
 * Load whether the docs and domain builders are re-exported from the barrel.
 * @returns Equality results for the docs and domain builders.
 * @example
 * ```typescript
 * await loadDocumentationExportMatches();
 * ```
 */
async function loadDocumentationExportMatches(): Promise<boolean[]> {
  const actualBuilders = await import(".");

  return [
    actualBuilders.comments === comments,
    actualBuilders.comments === documentation.comments,
    actualBuilders.jsdoc === jsdoc,
    actualBuilders.jsdoc === documentation.jsdoc,
    actualBuilders.rxjsX === rxjsX,
    actualBuilders.rxjsX === domain.rxjsX,
  ];
}

/**
 * Load whether the style builders are re-exported from the barrel.
 * @returns Equality results for the style builders.
 * @example
 * ```typescript
 * await loadStyleExportMatches();
 * ```
 */
async function loadStyleExportMatches(): Promise<boolean[]> {
  const actualBuilders = await import(".");

  return [
    actualBuilders.perfectionist === perfectionist,
    actualBuilders.perfectionist === style.perfectionist,
    actualBuilders.prettier === prettier,
    actualBuilders.prettier === style.prettier,
    actualBuilders.stylistic === stylistic,
    actualBuilders.stylistic === style.stylistic,
    actualBuilders.unicorn === unicorn,
    actualBuilders.unicorn === style.unicorn,
  ];
}

/**
 * Load whether the testing builders are re-exported from the barrel.
 * @returns Equality results for the testing builders.
 * @example
 * ```typescript
 * await loadTestingExportMatches();
 * ```
 */
async function loadTestingExportMatches(): Promise<boolean[]> {
  const actualBuilders = await import(".");

  return [
    actualBuilders.jasmine === jasmine,
    actualBuilders.jasmine === testing.jasmine,
    actualBuilders.jest === jest,
    actualBuilders.jest === testing.jest,
    actualBuilders.playwright === playwright,
    actualBuilders.playwright === testing.playwright,
    actualBuilders.vitest === vitest,
    actualBuilders.vitest === testing.vitest,
  ];
}

describe("configs barrel", () => {
  it("re-exports architecture config builders", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const matches = await loadArchitectureExportMatches();

    // Assert
    expect(matches).toStrictEqual([true, true]);
  });

  it("re-exports core config builders", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const matches = await loadCoreExportMatches();

    // Assert
    expect(matches).toStrictEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it("re-exports documentation and domain config builders", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const matches = await loadDocumentationExportMatches();

    // Assert
    expect(matches).toStrictEqual([true, true, true, true, true, true]);
  });

  it("re-exports style config builders", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const matches = await loadStyleExportMatches();

    // Assert
    expect(matches).toStrictEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it("re-exports testing config builders", async () => {
    // Arrange
    // (no setup needed)

    // Act
    const matches = await loadTestingExportMatches();

    // Assert
    expect(matches).toStrictEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });
});

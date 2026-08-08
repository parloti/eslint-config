import type { Linter } from "eslint";
import type { MockInstance } from "vitest";

import { ESLint } from "eslint";
import { vi } from "vitest";

import type { ConfigOptions } from "../../src";

import { config } from "../../src";

/** Lint options shared by every end-to-end lint run. */
const lintOptions = {
  cwd: process.cwd(),
} as const;

/**
 * The outcome of an async action run under stderr capture.
 * @template T The action result type.
 */
interface StderrCaptureOutcome<T> {
  /** The result returned by the captured action. */
  result: T;
  /** The stderr output produced while running the action. */
  stderrOutput: string;
}

/**
 * Reads the names of every config entry inside a flat config array.
 * @param flatConfigs The generated flat config array.
 * @returns The ordered list of config entry names.
 * @example
 * ```typescript
 * const names = collectConfigNames(await config());
 * ```
 */
function collectConfigNames(flatConfigs: Linter.Config[]): string[] {
  return flatConfigs.flatMap((entry) => entry.name ?? []);
}

/**
 * Builds an ESLint instance backed by the generated flat config.
 * @param options Config options forwarded to the config factory.
 * @returns A ready-to-use ESLint instance.
 * @example
 * ```typescript
 * const linter = await createLinter({ plugins: { jest: true } });
 * ```
 */
async function createLinter(options: ConfigOptions = {}): Promise<ESLint> {
  const flatConfigs = await config(options);

  return new ESLint({
    ...lintOptions,
    overrideConfig: flatConfigs,
    overrideConfigFile: true,
  });
}

/**
 * Lints a fixture code string through the generated flat config.
 * @param fixtureCode The fixture code under test.
 * @param filePath The fixture file path used for project resolution.
 * @returns The lint results for the fixture code.
 * @example
 * ```typescript
 * const results = await lintFixtureCode("const x = 1;", "src/fixture.ts");
 * ```
 */
async function lintFixtureCode(
  fixtureCode: string,
  filePath: string,
): Promise<ESLint.LintResult[]> {
  const linter = await createLinter();

  return linter.lintText(fixtureCode, { filePath });
}

/**
 * Lints fixture files on disk through the generated flat config.
 * @param filePaths The fixture file paths to lint.
 * @returns The lint results for the fixture files.
 * @example
 * ```typescript
 * const results = await lintFixtureFiles(["src/fixture.ts"]);
 * ```
 */
async function lintFixtureFiles(
  filePaths: string[],
): Promise<ESLint.LintResult[]> {
  const linter = await createLinter();

  return linter.lintFiles(filePaths);
}

/**
 * Reads the combined stderr output captured by a stderr spy.
 * @param stderrSpy The active stderr write spy.
 * @returns The combined captured stderr messages.
 * @example
 * ```typescript
 * const output = readStderrOutput(vi.spyOn(process.stderr, "write"));
 * ```
 */
function readStderrOutput(
  stderrSpy: MockInstance<typeof process.stderr.write>,
): string {
  return stderrSpy.mock.calls.map(([chunk]) => String(chunk)).join("");
}

/**
 * Runs an async action while capturing its stderr output.
 * @template T The action result type.
 * @param action The async action under capture.
 * @returns The action result and captured stderr output.
 * @example
 * ```typescript
 * const outcome = await runWithStderrCapture(() => config({ boundaries: {} }));
 * ```
 */
async function runWithStderrCapture<T>(
  action: () => Promise<T>,
): Promise<StderrCaptureOutcome<T>> {
  const stderrSpy = vi
    .spyOn(process.stderr, "write")
    .mockImplementation(() => true);
  const result = await action();

  return { result, stderrOutput: readStderrOutput(stderrSpy) };
}

export {
  collectConfigNames,
  lintFixtureCode,
  lintFixtureFiles,
  runWithStderrCapture,
};

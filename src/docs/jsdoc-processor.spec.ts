import type { Linter } from "eslint";

import { getJsdocProcessorPlugin } from "eslint-plugin-jsdoc";
import { parser } from "typescript-eslint";
import { describe, expect, it } from "vitest";

import { createWrappedJsdocProcessorPlugin } from "./jsdoc-processor.js";

/** Minimal processor lifecycle contract used by the wrapper tests. */
interface IExampleProcessorLifecycle {
  /** Remap messages for one processor instance. */
  postprocess: (
    messages: Linter.LintMessage[][],
    filename: string,
  ) => Linter.LintMessage[];

  /** Extract virtual files for one processor instance. */
  preprocess: (text: string, filename: string) => ProcessorFile[];
}

/** Virtual files emitted by a processor preprocess step. */
type ProcessorFile = Linter.ProcessorFile | string;

/**
 * Create a fatal example parse error message for processor remapping tests.
 * @returns A fatal lint message for a virtual snippet file.
 * @example
 * console.log(createFatalExampleMessage().fatal);
 */
function createFatalExampleMessage(): Linter.LintMessage {
  return {
    column: 1,
    fatal: true,
    line: 1,
    message: "Parsing error: Expression expected",
    severity: 2,
  } as Linter.LintMessage;
}

/**
 * Create a source file with an invalid JSDoc example at a controlled offset.
 * @param prefixLineCount The number of unrelated lines before the JSDoc block.
 * @returns The host file source text.
 * @example
 * console.log(createInvalidExampleSource(0).includes("@example"));
 */
function createInvalidExampleSource(prefixLineCount: number): string {
  const prefix = Array.from(
    { length: prefixLineCount },
    (_ignoredIndex, currentIndex) => `// prefix ${currentIndex}`,
  ).join("\n");

  return `${prefix}${prefixLineCount > 0 ? "\n\n" : ""}/**\n * Example\n * @example\n * ****\n */\nexport const value = 1;\n`;
}

/**
 * Assert that the wrapped processor matches the fresh upstream mapping.
 * @param wrappedProcessor The wrapped processor under test.
 * @param firstSource A source file processed before the regression case.
 * @param secondSource The source file used for the regression assertion.
 * @example
 * console.log("expectStableSecondMapping");
 */
function expectStableSecondMapping(
  wrappedProcessor: IExampleProcessorLifecycle,
  firstSource: string,
  secondSource: string,
): void {
  const processorOptions = {
    checkDefaults: true,
    checkParams: true,
    checkProperties: true,
    parser,
    sourceType: "module" as const,
  };
  const sharedProcessor = getUpstreamProcessor(processorOptions);
  const firstSharedMessage = runProcessorCycle(
    sharedProcessor,
    firstSource,
    "first.ts",
  );
  const secondSharedMessage = runProcessorCycle(
    sharedProcessor,
    secondSource,
    "second.ts",
  );
  const secondFreshMessage = runProcessorCycle(
    getUpstreamProcessor(processorOptions),
    secondSource,
    "second.ts",
  );

  expect(firstSharedMessage.line).not.toBe(secondFreshMessage.line);
  expect(secondSharedMessage.line).not.toBe(secondFreshMessage.line);
  expect(
    runProcessorCycle(wrappedProcessor, firstSource, "first.ts").line,
  ).toBe(firstSharedMessage.line);
  expect(
    runProcessorCycle(wrappedProcessor, secondSource, "second.ts"),
  ).toMatchObject({
    column: secondFreshMessage.column,
    line: secondFreshMessage.line,
  });
}

/**
 * Create the shared upstream lifecycle used to reproduce remapping drift.
 * @param processorOptions Parser and extraction settings forwarded to the upstream factory.
 * @returns A reusable lifecycle whose retained state demonstrates the upstream remapping bug.
 * @throws {Error} Thrown when the upstream plugin does not expose an examples processor.
 * @example
 * void 0;
 */
function getUpstreamProcessor(
  processorOptions: Parameters<typeof getJsdocProcessorPlugin>[0],
): IExampleProcessorLifecycle {
  const { processors } = getJsdocProcessorPlugin(processorOptions);

  if (processors === void 0) {
    throw new Error("Upstream JSDoc processor did not expose any processors");
  }

  const processor = processors["examples"];

  if (processor === void 0) {
    throw new Error("Upstream JSDoc processor did not expose examples");
  }

  if (processor.preprocess === void 0 || processor.postprocess === void 0) {
    throw new Error(
      "Upstream JSDoc processor examples lifecycle is incomplete",
    );
  }

  return {
    postprocess: processor.postprocess,
    preprocess: processor.preprocess,
  };
}

/**
 * Resolve the wrapped examples processor for tests.
 * @param getWrappedJsdocProcessorPlugin The wrapper factory under test.
 * @returns The wrapped examples processor.
 * @throws {Error} Thrown when the wrapper does not expose the examples processor.
 * @example
 * console.log("getWrappedProcessor");
 */
function getWrappedProcessor(
  getWrappedJsdocProcessorPlugin: typeof createWrappedJsdocProcessorPlugin,
): IExampleProcessorLifecycle {
  const wrappedProcessor = getWrappedJsdocProcessorPlugin({
    checkDefaults: true,
    checkParams: true,
    checkProperties: true,
    getJsdocProcessorPlugin,
    parser,
    sourceType: "module",
  }).processors?.examples;

  if (wrappedProcessor === void 0) {
    throw new Error("Wrapped JSDoc processor did not expose examples");
  }

  if (
    wrappedProcessor.preprocess === void 0 ||
    wrappedProcessor.postprocess === void 0
  ) {
    throw new Error("Wrapped JSDoc processor examples lifecycle is incomplete");
  }

  return {
    postprocess: wrappedProcessor.postprocess,
    preprocess: wrappedProcessor.preprocess,
  };
}

/**
 * Run a processor through one preprocess/postprocess cycle.
 * @param exampleProcessor The processor lifecycle under test.
 * @param source The host file source text.
 * @param filename The host filename.
 * @returns The first remapped lint message.
 * @throws {Error} Thrown when the processor does not remap any lint messages.
 * @example
 * console.log("runProcessorCycle");
 */
function runProcessorCycle(
  exampleProcessor: IExampleProcessorLifecycle,
  source: string,
  filename: string,
): Linter.LintMessage {
  exampleProcessor.preprocess(source, filename);
  const [message] = exampleProcessor.postprocess(
    [[], [createFatalExampleMessage()]],
    filename,
  );

  if (message === void 0) {
    throw new Error("Processor did not return a remapped lint message");
  }

  return message;
}

describe("wrapped jsdoc processor", () => {
  it("isolates upstream remapping state across files", () => {
    expect.hasAssertions();

    const wrappedProcessor = getWrappedProcessor(
      createWrappedJsdocProcessorPlugin,
    );

    expectStableSecondMapping(
      wrappedProcessor,
      createInvalidExampleSource(0),
      createInvalidExampleSource(20),
    );
  });
});

import type { Linter } from "eslint";
import type { parser as parserType } from "typescript-eslint";
import type { Mock } from "vitest";

import { describe, expect, it, vi } from "vitest";

import { createWrappedJsdocProcessorPlugin } from "./jsdoc-processor.js";

/** Minimal processor lifecycle contract used by the wrapper fallback tests. */
interface IExampleProcessorLifecycle {
  /** Remap messages for one processor instance. */
  postprocess: (
    messages: Linter.LintMessage[][],
    filename: string,
  ) => Linter.LintMessage[];

  /** Extract virtual files for one processor instance. */
  preprocess: (text: string, filename: string) => ProcessorFile[];
}

/** Mocked processor shape used by the queueing test. */
interface IMockedExampleProcessor extends IExampleProcessorLifecycle {
  /** Whether the mocked processor supports autofix. */
  supportsAutofix?: boolean;
}

/** Parser type accepted by the wrapped processor. */
type Parser = typeof parserType;

/** Virtual files emitted by a processor preprocess step. */
type ProcessorFile = Linter.ProcessorFile | string;

/**
 * Create an upstream processor factory that omits processors.examples.
 * @returns A mocked upstream processor factory.
 * @example
 * console.log(typeof createMissingExamplesProcessorFactory());
 */
function createMissingExamplesProcessorFactory(): Mock {
  return vi.fn(() => ({
    processors: {},
  }));
}

/**
 * Create an upstream processor factory whose examples processor lacks lifecycle methods.
 * @returns A mocked upstream processor factory.
 * @example
 * console.log(typeof createMissingLifecycleProcessorFactory());
 */
function createMissingLifecycleProcessorFactory(): Mock {
  return vi.fn(() => ({
    processors: {
      examples: {},
    },
  }));
}

/**
 * Create a mocked upstream processor factory with per-instance identity.
 * @returns A mocked upstream processor factory.
 * @example
 * console.log(typeof createMockProcessorFactory());
 */
function createMockProcessorFactory(): Mock {
  let instanceId = 0;

  return vi.fn(() => {
    instanceId += 1;
    const currentInstanceId = instanceId;
    const postprocessResult: Linter.LintMessage[] = [
      {
        column: 1,
        line: currentInstanceId,
        message: `instance-${currentInstanceId}`,
        severity: 2,
      } as Linter.LintMessage,
    ];
    const preprocessResult: ProcessorFile[] = [
      "example-source",
      {
        filename: `same.ts/${currentInstanceId}.md`,
        text: "example()",
      },
    ];
    const postprocess: IMockedExampleProcessor["postprocess"] = vi.fn(
      () => postprocessResult,
    );
    const exampleProcessor: IMockedExampleProcessor = {
      postprocess,
      preprocess: vi.fn(() => preprocessResult),
      supportsAutofix: true,
    };

    return {
      processors: {
        examples: exampleProcessor,
      },
    };
  });
}

/**
 * Create a parser stub for wrapped processor tests.
 * @returns A parser-shaped stub.
 * @example
 * console.log(typeof createParserStub().parseForESLint);
 */
function createParserStub(): Parser {
  return { parseForESLint: vi.fn() } as unknown as Parser;
}

/**
 * Resolve the wrapped examples processor for fallback tests.
 * @param getJsdocProcessorPlugin The upstream processor factory under test.
 * @returns The wrapped examples processor.
 * @throws {Error} Thrown when the wrapper does not expose the examples processor.
 * @example
 * console.log("getWrappedProcessor");
 */
function getWrappedProcessor(
  getJsdocProcessorPlugin: Mock,
): IExampleProcessorLifecycle {
  const wrappedProcessor = createWrappedJsdocProcessorPlugin({
    checkDefaults: true,
    checkParams: true,
    checkProperties: true,
    getJsdocProcessorPlugin,
    parser: createParserStub(),
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

describe("wrapped jsdoc processor fallbacks", () => {
  it("throws when postprocess runs without a queued preprocess", () => {
    const wrappedProcessor = getWrappedProcessor(createMockProcessorFactory());

    expect(() =>
      wrappedProcessor.postprocess([[], []], "missing.ts"),
    ).toThrowError(
      "Wrapped JSDoc processor lost lifecycle state for missing.ts",
    );
  });

  it("queues repeated preprocess calls for the same filename", () => {
    const wrappedProcessor = getWrappedProcessor(createMockProcessorFactory());

    wrappedProcessor.preprocess("first", "same.ts");
    wrappedProcessor.preprocess("second", "same.ts");

    expect(wrappedProcessor.postprocess([[], []], "same.ts")[0]).toMatchObject({
      line: 2,
      message: "instance-2",
    });
    expect(wrappedProcessor.postprocess([[], []], "same.ts")[0]).toMatchObject({
      line: 3,
      message: "instance-3",
    });
  });

  it("throws when the upstream plugin omits processors.examples", () => {
    expect(() =>
      createWrappedJsdocProcessorPlugin({
        checkDefaults: true,
        checkParams: true,
        checkProperties: true,
        getJsdocProcessorPlugin: createMissingExamplesProcessorFactory(),
        parser: createParserStub(),
        sourceType: "module",
      }),
    ).toThrowError("eslint-plugin-jsdoc did not provide processors.examples");
  });

  it("throws when the upstream processor lacks lifecycle methods", () => {
    const wrappedProcessor = getWrappedProcessor(
      createMissingLifecycleProcessorFactory(),
    );

    expect(() =>
      wrappedProcessor.preprocess("source", "missing.ts"),
    ).toThrowError(
      "eslint-plugin-jsdoc processors.examples must provide preprocess and postprocess",
    );
  });
});

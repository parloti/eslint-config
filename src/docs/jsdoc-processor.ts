import type { Linter } from "eslint";
import type { getJsdocProcessorPlugin as getJsdocProcessorPluginType } from "eslint-plugin-jsdoc";
import type { parser as parserType } from "typescript-eslint";

/** Options for creating the wrapped JSDoc processor plugin. */
interface CreateWrappedJsdocProcessorPluginOptions {
  /** Whether to lint default value snippets. */
  checkDefaults: boolean;

  /** Whether to lint parameter default snippets. */
  checkParams: boolean;

  /** Whether to lint property default snippets. */
  checkProperties: boolean;

  /** Upstream JSDoc processor factory. */
  getJsdocProcessorPlugin: JsdocProcessorPluginFactory;

  /** Parser passed through to the upstream processor. */
  parser: Parser;

  /** Source type for extracted snippets. */
  sourceType: "module" | "script";
}

/** Minimal upstream example processor contract used by the wrapper. */
interface IExampleProcessor {
  /** Optional processor metadata. */
  meta?: IProcessorMeta;

  /** Remap virtual-file lint messages back onto the host file. */
  postprocess: (
    messages: Linter.LintMessage[][],
    filename: string,
  ) => Linter.LintMessage[];

  /** Extract virtual snippet files from a host file. */
  preprocess: (text: string, filename: string) => ProcessorFile[];

  /** Whether the upstream processor supports autofix. */
  supportsAutofix?: boolean;
}

/** Minimal meta shape used by the wrapped processor. */
interface IProcessorMeta {
  /** Processor name shown to ESLint. */
  name?: string;

  /** Processor version shown to ESLint. */
  version?: string;
}

/** Minimal upstream plugin contract used by the wrapper. */
interface IProcessorPlugin {
  /** Optional plugin metadata. */
  meta?: IProcessorMeta;

  /** Available processors exported by the plugin. */
  processors?: {
    /** JSDoc example/default-expression processor. */
    examples?: Partial<IExampleProcessor>;
  };
}

/** Function signature for the upstream JSDoc processor factory. */
type JsdocProcessorPluginFactory = typeof getJsdocProcessorPluginType;

/** Parser accepted by the upstream JSDoc processor. */
type Parser = typeof parserType;

/** Virtual files emitted by a processor preprocess step. */
type ProcessorFile = Linter.ProcessorFile | string;

/** Non-empty queue of processor instances for one filename. */
type ProcessorQueue = [IExampleProcessor, ...IExampleProcessor[]];

/**
 * Build the options object forwarded to the upstream processor factory.
 * @param options The wrapper options.
 * @returns A shallow options object for the upstream processor.
 * @example
 * console.log(buildUpstreamProcessorOptions({ checkDefaults: true, checkParams: true, checkProperties: true, getJsdocProcessorPlugin: (() => ({ processors: { examples: {} } })) as JsdocProcessorPluginFactory, parser: {} as Parser, sourceType: "module" }).sourceType);
 */
function buildUpstreamProcessorOptions(
  options: CreateWrappedJsdocProcessorPluginOptions,
): Parameters<JsdocProcessorPluginFactory>[0] {
  return {
    checkDefaults: options.checkDefaults,
    checkParams: options.checkParams,
    checkProperties: options.checkProperties,
    parser: options.parser,
    sourceType: options.sourceType,
  };
}

/**
 * Create a wrapped JSDoc processor plugin with per-file upstream isolation.
 * @param options The wrapper options.
 * @returns A plugin whose examples processor uses fresh upstream state per file.
 * @example
 * console.log(createWrappedJsdocProcessorPlugin({ checkDefaults: true, checkParams: true, checkProperties: true, getJsdocProcessorPlugin: (() => ({ processors: { examples: {} } })) as JsdocProcessorPluginFactory, parser: {} as Parser, sourceType: "module" }).processors?.examples !== void 0);
 */
function createWrappedJsdocProcessorPlugin(
  options: CreateWrappedJsdocProcessorPluginOptions,
): IProcessorPlugin {
  const upstreamOptions = buildUpstreamProcessorOptions(options);
  const basePlugin = options.getJsdocProcessorPlugin(
    upstreamOptions,
  ) as IProcessorPlugin;
  const baseProcessor = resolveExamplesProcessor(basePlugin, false);
  const processorsByFilename = new Map<string, ProcessorQueue>();

  return {
    ...(basePlugin.meta === void 0 ? {} : { meta: basePlugin.meta }),
    processors: {
      examples: {
        ...(baseProcessor.meta === void 0 ? {} : { meta: baseProcessor.meta }),
        postprocess(
          messages: Linter.LintMessage[][],
          filename: string,
        ): Linter.LintMessage[] {
          return dequeueProcessor(processorsByFilename, filename).postprocess(
            messages,
            filename,
          );
        },
        preprocess(text: string, filename: string): ProcessorFile[] {
          const plugin = options.getJsdocProcessorPlugin(
            upstreamOptions,
          ) as IProcessorPlugin;
          const processor = resolveExamplesProcessor(
            plugin,
            true,
          ) as IExampleProcessor;
          const processedFiles = processor.preprocess(text, filename);

          queueProcessor(processorsByFilename, filename, processor);

          return processedFiles;
        },
        ...(baseProcessor.supportsAutofix === void 0
          ? {}
          : { supportsAutofix: baseProcessor.supportsAutofix }),
      },
    },
  };
}

/**
 * Dequeue the next processor instance for a filename.
 * @param processorsByFilename Queued processors keyed by source filename.
 * @param filename The host filename for the processor instance.
 * @returns The next upstream processor instance.
 * @throws {Error} Thrown when postprocess is called without a queued processor.
 * @example
 * console.log("dequeueProcessor");
 */
function dequeueProcessor(
  processorsByFilename: Map<string, ProcessorQueue>,
  filename: string,
): IExampleProcessor {
  const queuedProcessors = processorsByFilename.get(filename);

  if (queuedProcessors === void 0) {
    throw new Error(
      `Wrapped JSDoc processor lost lifecycle state for ${filename}`,
    );
  }

  const [processor] = queuedProcessors;

  if (queuedProcessors.length === 1) {
    processorsByFilename.delete(filename);
  } else {
    queuedProcessors.shift();
  }

  return processor;
}

/**
 * Queue a processor instance for a later postprocess call.
 * @param processorsByFilename Queued processors keyed by source filename.
 * @param filename The host filename for the processor instance.
 * @param processor The upstream processor instance.
 * @example
 * console.log("queueProcessor");
 */
function queueProcessor(
  processorsByFilename: Map<string, ProcessorQueue>,
  filename: string,
  processor: IExampleProcessor,
): void {
  const queuedProcessors = processorsByFilename.get(filename);

  if (queuedProcessors === void 0) {
    processorsByFilename.set(filename, [processor]);
    return;
  }

  queuedProcessors.push(processor);
}

/**
 * Resolve the upstream examples processor from a plugin instance.
 * @param plugin The upstream plugin instance.
 * @param shouldRequireLifecycleMethods Whether preprocess/postprocess must be present.
 * @returns The upstream examples processor.
 * @throws {TypeError} Thrown when the upstream plugin omits the examples processor or its lifecycle methods.
 * @example
 * console.log(resolveExamplesProcessor({ processors: { examples: {} } }, false) !== void 0);
 */
function resolveExamplesProcessor(
  plugin: IProcessorPlugin,
  shouldRequireLifecycleMethods: boolean,
): Partial<IExampleProcessor> {
  const processor = plugin.processors?.examples;

  if (processor === void 0) {
    throw new TypeError(
      "eslint-plugin-jsdoc did not provide processors.examples",
    );
  }

  if (
    shouldRequireLifecycleMethods &&
    (typeof processor.preprocess !== "function" ||
      typeof processor.postprocess !== "function")
  ) {
    throw new TypeError(
      "eslint-plugin-jsdoc processors.examples must provide preprocess and postprocess",
    );
  }

  return processor;
}

export { createWrappedJsdocProcessorPlugin };
export type { JsdocProcessorPluginFactory, Parser };

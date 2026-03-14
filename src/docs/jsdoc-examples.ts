import type { Linter } from "eslint";
import type { getJsdocProcessorPlugin as getJsdocProcessorPluginType } from "eslint-plugin-jsdoc";
import type {
  parser as parserType,
  configs as typeScriptConfigsType,
  plugin as typeScriptPluginType,
} from "typescript-eslint";

import { createWrappedJsdocProcessorPlugin } from "./jsdoc-processor.js";

/** Options for building TypeScript example configs. */
interface BuildTypeScriptExampleConfigOptions {
  /** Rule overrides that disable typed-only checks for snippets. */
  disableTypeCheckedRules: Linter.RulesRecord;

  /** Upstream processor factory when the plugin exports it. */
  getJsdocProcessorPlugin: JsdocProcessorPluginFactory | undefined;

  /** Parser used for host files and snippet files. */
  parser: Parser;

  /** TypeScript ESLint plugin used by the virtual snippet configs. */
  typeScriptPlugin: TypeScriptPlugin;
}

/** Function signature for the JSDoc processor factory. */
type JsdocProcessorPluginFactory = typeof getJsdocProcessorPluginType;

/** Parser accepted by the JSDoc example processor. */
type Parser = typeof parserType;

/** TypeScript ESLint config map. */
type TypeScriptConfigs = typeof typeScriptConfigsType;

/** TypeScript ESLint plugin instance used for snippet-only rule configs. */
type TypeScriptPlugin = typeof typeScriptPluginType;

/** Options for a TypeScript virtual snippet rule config. */
interface TypeScriptSnippetRuleConfigOptions {
  /** Virtual file globs targeted by the config. */
  files: string[];

  /** Config name shown in ESLint diagnostics. */
  name: string;

  /** Parser used for the extracted snippet content. */
  parser: Parser;

  /** Rule overrides applied to the extracted snippet files. */
  rules: Linter.RulesRecord;

  /** TypeScript ESLint plugin instance. */
  typeScriptPlugin: TypeScriptPlugin;
}

/** TypeScript source files that should run through the JSDoc snippet processor. */
const typeScriptSourceFiles = ["**/*.cts", "**/*.mts", "**/*.ts", "**/*.tsx"];

/** Virtual example files emitted by the upstream JSDoc processor. */
const typeScriptExampleFiles = ["**/*.md/*.js"];

/** Virtual files emitted for JSDoc default-expression checks. */
const typeScriptDefaultExpressionFiles = [
  "**/*.jsdoc-defaults",
  "**/*.jsdoc-params",
  "**/*.jsdoc-properties",
];

/**
 * Build relaxed rules for extracted default-expression snippets.
 * @returns The snippet rule overrides.
 * @example
 * console.log(buildDefaultExpressionSnippetRules());
 */
function buildDefaultExpressionSnippetRules(): Linter.RulesRecord {
  return {
    ...buildExampleSnippetRules(),
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/semi": ["error", "never"],
    "@typescript-eslint/no-unused-expressions": "off",
    "chai-friendly/no-unused-expressions": "off",
    "no-empty-function": "off",
    "no-new": "off",
    "no-unused-expressions": "off",
    strict: "off",
  };
}

/**
 * Build relaxed rules for extracted example snippets.
 * @returns The snippet rule overrides.
 * @example
 * console.log(buildExampleSnippetRules());
 */
function buildExampleSnippetRules(): Linter.RulesRecord {
  return {
    "@stylistic/eol-last": "off",
    "@stylistic/no-multiple-empty-lines": "off",
    "@stylistic/padded-blocks": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "chai-friendly/no-unused-expressions": "off",
    "import/no-unresolved": "off",
    "import/unambiguous": "off",
    "jsdoc/require-file-overview": "off",
    "jsdoc/require-jsdoc": "off",
    "n/no-missing-import": "off",
    "n/no-missing-require": "off",
    "no-console": "off",
    "no-undef": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "node/no-missing-import": "off",
    "node/no-missing-require": "off",
  };
}

/**
 * Build TypeScript-aware processor configs for JSDoc examples and default expressions.
 * @param options Config input for the TypeScript snippet support.
 * @param options.disableTypeCheckedRules Rule overrides that disable typed-only checks.
 * @param options.getJsdocProcessorPlugin Upstream processor factory when present.
 * @param options.parser Parser used for host files and snippets.
 * @param options.typeScriptPlugin TypeScript ESLint plugin instance.
 * @returns The processor and virtual-file configs.
 * @example
 * console.log(buildTypeScriptExampleConfigs({ disableTypeCheckedRules: {}, getJsdocProcessorPlugin: void 0, parser: {} as Parser, typeScriptPlugin: {} as TypeScriptPlugin }).length);
 */
function buildTypeScriptExampleConfigs({
  disableTypeCheckedRules,
  getJsdocProcessorPlugin,
  parser,
  typeScriptPlugin,
}: BuildTypeScriptExampleConfigOptions): Linter.Config[] {
  if (getJsdocProcessorPlugin === void 0) {
    return [];
  }

  return [
    buildTypeScriptProcessorConfig(getJsdocProcessorPlugin, parser),
    buildTypeScriptSnippetRuleConfig({
      files: typeScriptExampleFiles,
      name: "jsdoc/typescript-examples/rules",
      parser,
      rules: {
        ...disableTypeCheckedRules,
        ...buildExampleSnippetRules(),
      },
      typeScriptPlugin,
    }),
    buildTypeScriptSnippetRuleConfig({
      files: typeScriptDefaultExpressionFiles,
      name: "jsdoc/typescript-default-expressions/rules",
      parser,
      rules: {
        ...disableTypeCheckedRules,
        ...buildDefaultExpressionSnippetRules(),
      },
      typeScriptPlugin,
    }),
  ];
}

/**
 * Build the processor config for TypeScript source files.
 * @param getJsdocProcessorPlugin Upstream JSDoc processor factory.
 * @param parser Parser used for host TypeScript files.
 * @returns The processor-backed ESLint config entry.
 * @example
 * console.log(buildTypeScriptProcessorConfig(((_config) => ({ processors: { examples: {} } })) as JsdocProcessorPluginFactory, {} as Parser).processor);
 */
function buildTypeScriptProcessorConfig(
  getJsdocProcessorPlugin: JsdocProcessorPluginFactory,
  parser: Parser,
): Linter.Config {
  return {
    files: typeScriptSourceFiles,
    name: "jsdoc/typescript-examples-and-default-expressions/processor",
    plugins: {
      examples: createWrappedJsdocProcessorPlugin({
        checkDefaults: true,
        checkParams: true,
        checkProperties: true,
        getJsdocProcessorPlugin,
        parser,
        sourceType: "module",
      }),
    },
    processor: "examples/examples",
  };
}

/**
 * Build language options for extracted TypeScript snippets.
 * @param parser Parser used for snippet files.
 * @returns The language options for virtual snippet files.
 * @example
 * console.log(buildTypeScriptSnippetLanguageOptions({} as Parser).sourceType);
 */
function buildTypeScriptSnippetLanguageOptions(
  parser: Parser,
): NonNullable<Linter.Config["languageOptions"]> {
  return {
    parser,
    parserOptions: {
      projectService: false,
    },
    sourceType: "module",
  };
}

/**
 * Build a TypeScript snippet rule config for virtual files.
 * @param options Config input for the snippet rule block.
 * @param options.files Virtual file globs targeted by the config.
 * @param options.name Config name shown in ESLint diagnostics.
 * @param options.parser Parser used for extracted snippet content.
 * @param options.rules Rule overrides applied to the virtual snippet files.
 * @param options.typeScriptPlugin TypeScript ESLint plugin instance.
 * @returns The ESLint config for the virtual snippet files.
 * @example
 * console.log(buildTypeScriptSnippetRuleConfig({ files: ["virtual-example-file"], name: "example", parser: {} as Parser, rules: {}, typeScriptPlugin: {} as TypeScriptPlugin }).name);
 */
function buildTypeScriptSnippetRuleConfig({
  files,
  name,
  parser,
  rules,
  typeScriptPlugin,
}: TypeScriptSnippetRuleConfigOptions): Linter.Config {
  return {
    files,
    languageOptions: buildTypeScriptSnippetLanguageOptions(parser),
    name,
    plugins: {
      "@typescript-eslint": typeScriptPlugin,
    },
    rules,
  };
}

/**
 * Resolve the TypeScript rule overrides that disable typed-only linting for snippets.
 * @param typeScriptConfigs The exported TypeScript ESLint config map.
 * @returns The disable-type-checked rule overrides.
 * @example
 * console.log(resolveDisableTypeCheckedRules({ disableTypeChecked: { rules: { example: "off" } } } as TypeScriptConfigs).example);
 */
function resolveDisableTypeCheckedRules(
  typeScriptConfigs: TypeScriptConfigs,
): Linter.RulesRecord {
  return (typeScriptConfigs.disableTypeChecked.rules ??
    {}) as Linter.RulesRecord;
}

/**
 * Resolve the optional processor factory from the JSDoc plugin module.
 * @param jsdocModule The loaded JSDoc plugin module.
 * @returns The processor factory when the module exports it.
 * @example
 * console.log(resolveJsdocProcessorPlugin({}) === void 0);
 */
function resolveJsdocProcessorPlugin(
  jsdocModule: Readonly<{
    /** Optional exported JSDoc processor factory. */
    getJsdocProcessorPlugin?: JsdocProcessorPluginFactory;
  }>,
): JsdocProcessorPluginFactory | undefined {
  return "getJsdocProcessorPlugin" in jsdocModule
    ? jsdocModule.getJsdocProcessorPlugin
    : void 0;
}

export {
  buildTypeScriptExampleConfigs,
  resolveDisableTypeCheckedRules,
  resolveJsdocProcessorPlugin,
};
export type { Parser, TypeScriptConfigs, TypeScriptPlugin };

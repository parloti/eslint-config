export type {
  BoundariesConfig,
  BoundariesConfigExtension,
  BoundariesElementTypesOptions,
  BoundariesElementTypesRuleEntry,
  ConfigOptions,
  PluginName,
  PluginStateOverrides,
} from "../domain";
export { boundaries, defaultBoundariesConfig, importX } from "./architecture";
export { config } from "./config-factory";
export {
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
} from "./configs";

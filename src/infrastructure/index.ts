export type {
  BoundariesElementTypesRuleEntry,
  ConfigOptions,
  PluginName,
  PluginStateOverrides,
  ScopedPluginConfig,
} from "../domain";
export { boundaries, importX } from "./architecture";
export { config } from "./config-factory";
export { codeperfect, eslint, resolver, typescript } from "./core";
export { comments, jsdoc } from "./docs";
export { rxjsX } from "./rxjs-x";
export { perfectionist, prettier, stylistic, unicorn } from "./style";
export { jasmine, jest, playwright, vitest, vitestE2e } from "./testing";

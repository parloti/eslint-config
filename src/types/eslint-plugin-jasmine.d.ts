declare module "eslint-plugin-jasmine" {
  import type { Linter, Rule } from "eslint";

  /** Represents the structure of the eslint-plugin-jasmine plugin. */
  interface Plugin {
    /** Field value. */
    configs: {
      /** Field value. */
      recommended: {
        /** Field value. */
        rules: Linter.RulesRecord;
      };
    };

    /** Field value. */
    rules: Record<string, Rule.RuleModule>;
  }

  declare const plugin: Plugin;

  export = plugin;
}

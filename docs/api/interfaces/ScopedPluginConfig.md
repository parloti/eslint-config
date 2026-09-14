[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ScopedPluginConfig

# Interface: ScopedPluginConfig

Defined in: [domain/types.ts:58](https://github.com/parloti/eslint-config/blob/4fada46641488a257bfaf827e49b1b2a54585fa6/src/domain/types.ts#L58)

Explicit plugin selection scoped to one package root.

## Properties

### basePath

> **basePath**: `string`

Defined in: [domain/types.ts:60](https://github.com/parloti/eslint-config/blob/4fada46641488a257bfaf827e49b1b2a54585fa6/src/domain/types.ts#L60)

Base directory to which the selected flat configs apply.

***

### plugins

> **plugins**: readonly `PluginName`[]

Defined in: [domain/types.ts:63](https://github.com/parloti/eslint-config/blob/4fada46641488a257bfaf827e49b1b2a54585fa6/src/domain/types.ts#L63)

Plugins explicitly included for the package.

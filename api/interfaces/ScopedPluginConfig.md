[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ScopedPluginConfig

# Interface: ScopedPluginConfig

Defined in: [domain/types.ts:60](https://github.com/parloti/eslint-config/blob/9f63e10e0ae340e996afb8a6032647aa8004798d/src/domain/types.ts#L60)

Explicit plugin selection scoped to one package root.

## Properties

### basePath

> **basePath**: `string`

Defined in: [domain/types.ts:62](https://github.com/parloti/eslint-config/blob/9f63e10e0ae340e996afb8a6032647aa8004798d/src/domain/types.ts#L62)

Base directory to which the selected flat configs apply.

***

### plugins

> **plugins**: readonly `PluginName`[]

Defined in: [domain/types.ts:65](https://github.com/parloti/eslint-config/blob/9f63e10e0ae340e996afb8a6032647aa8004798d/src/domain/types.ts#L65)

Plugins explicitly included for the package.

[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ScopedPluginConfig

# Interface: ScopedPluginConfig

Defined in: [domain/types.ts:60](https://github.com/parloti/eslint-config/blob/d947facccee8b8ecd635e913e7b9dad1f98993a8/src/domain/types.ts#L60)

Explicit plugin selection scoped to one package root.

## Properties

### basePath

> **basePath**: `string`

Defined in: [domain/types.ts:62](https://github.com/parloti/eslint-config/blob/d947facccee8b8ecd635e913e7b9dad1f98993a8/src/domain/types.ts#L62)

Base directory to which the selected flat configs apply.

***

### plugins

> **plugins**: readonly `PluginName`[]

Defined in: [domain/types.ts:65](https://github.com/parloti/eslint-config/blob/d947facccee8b8ecd635e913e7b9dad1f98993a8/src/domain/types.ts#L65)

Plugins explicitly included for the package.

[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ScopedPluginConfig

# Interface: ScopedPluginConfig

Defined in: [domain/types.ts:61](https://github.com/parloti/eslint-config/blob/31a8fbc7f11c11049e47613b98aff632f30f3b1d/src/domain/types.ts#L61)

Explicit plugin selection scoped to one package root.

## Properties

### basePath

> **basePath**: `string`

Defined in: [domain/types.ts:63](https://github.com/parloti/eslint-config/blob/31a8fbc7f11c11049e47613b98aff632f30f3b1d/src/domain/types.ts#L63)

Base directory to which the selected flat configs apply.

***

### plugins

> **plugins**: readonly `PluginName`[]

Defined in: [domain/types.ts:66](https://github.com/parloti/eslint-config/blob/31a8fbc7f11c11049e47613b98aff632f30f3b1d/src/domain/types.ts#L66)

Plugins explicitly included for the package.

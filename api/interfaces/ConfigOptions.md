[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ConfigOptions

# Interface: ConfigOptions

Defined in: [domain/types.ts:17](https://github.com/parloti/eslint-config/blob/31a8fbc7f11c11049e47613b98aff632f30f3b1d/src/domain/types.ts#L17)

Type definition for rule data.

## Properties

### plugins?

> `optional` **plugins?**: `Partial`\<`Record`\<`DefaultDisabledPluginName`, `true`\> & `Record`\<`DefaultEnabledPluginName`, `false`\>\>

Defined in: [domain/types.ts:19](https://github.com/parloti/eslint-config/blob/31a8fbc7f11c11049e47613b98aff632f30f3b1d/src/domain/types.ts#L19)

Explicit plugin state overrides keyed by public plugin name.

***

### scopedPlugins?

> `optional` **scopedPlugins?**: readonly [`ScopedPluginConfig`](ScopedPluginConfig.md)[]

Defined in: [domain/types.ts:22](https://github.com/parloti/eslint-config/blob/31a8fbc7f11c11049e47613b98aff632f30f3b1d/src/domain/types.ts#L22)

Package-scoped plugin profiles for monorepo configuration.

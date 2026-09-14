[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ConfigOptions

# Interface: ConfigOptions

Defined in: [domain/types.ts:17](https://github.com/parloti/eslint-config/blob/d947facccee8b8ecd635e913e7b9dad1f98993a8/src/domain/types.ts#L17)

Type definition for rule data.

## Properties

### plugins?

> `optional` **plugins?**: `Partial`\<`Record`\<`DefaultDisabledPluginName`, `true`\> & `Record`\<`DefaultEnabledPluginName`, `false`\>\>

Defined in: [domain/types.ts:19](https://github.com/parloti/eslint-config/blob/d947facccee8b8ecd635e913e7b9dad1f98993a8/src/domain/types.ts#L19)

Explicit plugin state overrides keyed by public plugin name.

***

### scopedPlugins?

> `optional` **scopedPlugins?**: readonly [`ScopedPluginConfig`](ScopedPluginConfig.md)[]

Defined in: [domain/types.ts:22](https://github.com/parloti/eslint-config/blob/d947facccee8b8ecd635e913e7b9dad1f98993a8/src/domain/types.ts#L22)

Package-scoped plugin profiles for monorepo configuration.

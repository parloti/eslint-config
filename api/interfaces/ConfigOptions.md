[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ConfigOptions

# Interface: ConfigOptions

Defined in: [config.ts:15](https://github.com/parloti/eslint-config/blob/aeeddedfb0b8911f35d0136cc9f96f2223c928af/src/bootstrap/config.ts#L15)

Configuration options accepted by the public config factory.

## Properties

### plugins?

> `optional` **plugins?**: `Partial`\<`Record`\<`DefaultDisabledPluginName`, `true`\> & `Record`\<`DefaultEnabledPluginName`, `false`\>\>

Defined in: [config.ts:17](https://github.com/parloti/eslint-config/blob/aeeddedfb0b8911f35d0136cc9f96f2223c928af/src/bootstrap/config.ts#L17)

Explicit plugin state overrides keyed by public plugin name.

***

### scopedPlugins?

> `optional` **scopedPlugins?**: readonly `ScopedPluginConfig`[]

Defined in: [config.ts:20](https://github.com/parloti/eslint-config/blob/aeeddedfb0b8911f35d0136cc9f96f2223c928af/src/bootstrap/config.ts#L20)

Package-scoped plugin profiles for monorepo configuration.

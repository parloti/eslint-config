[**@codeperfect/eslint-config**](../README.md)

***

[@codeperfect/eslint-config](../README.md) / ConfigOptions

# Interface: ConfigOptions

Defined in: [domain/types.ts:17](https://github.com/parloti/eslint-config/blob/a246eca04f4b219616cdb474b5df8af1b1160e50/src/domain/types.ts#L17)

Type definition for rule data.

## Properties

### plugins?

> `optional` **plugins?**: `Partial`\<`Record`\<`DefaultDisabledPluginName`, `true`\> & `Record`\<`DefaultEnabledPluginName`, `false`\>\>

Defined in: [domain/types.ts:19](https://github.com/parloti/eslint-config/blob/a246eca04f4b219616cdb474b5df8af1b1160e50/src/domain/types.ts#L19)

Explicit plugin state overrides keyed by public plugin name.

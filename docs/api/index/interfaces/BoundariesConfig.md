[**@codeperfect/eslint-config**](../../README.md)

***

[@codeperfect/eslint-config](../../README.md) / [index](../README.md) / BoundariesConfig

# Interface: BoundariesConfig

Defined in: types.ts:11

Type definition for rule data.

## Properties

### elements

> **elements**: `ElementDescriptors`

Defined in: types.ts:13

Repository-owned element descriptors for boundaries analysis.

***

### elementTypes

> **elementTypes**: `RuleEntry`\<`ElementTypesRuleOptions`[]\>

Defined in: types.ts:16

Repository-owned dependency direction rules for boundaries analysis.

***

### files

> **files**: readonly `string`[]

Defined in: types.ts:19

Files included in repository-specific boundaries analysis.

***

### ignores?

> `optional` **ignores**: readonly `string`[]

Defined in: types.ts:22

Optional ignore globs excluded from repository-specific boundaries analysis.

[**@codeperfect/eslint-config**](../../README.md)

***

[@codeperfect/eslint-config](../../README.md) / [configs](../README.md) / boundaries

# Function: boundaries()

> **boundaries**(`config?`): `Config`\<`RulesConfig`\>[]

Defined in: architecture/boundaries.ts:24

Load boundaries plugin configuration when explicitly configured.

## Parameters

### config?

[`BoundariesConfig`](../../index/interfaces/BoundariesConfig.md)

Input config value.

## Returns

`Config`\<`RulesConfig`\>[]

Return value output.

## Example

```typescript
const configs = boundaries({
elements: [{ type: "shared", pattern: "src/shared" }],
elementTypes: ["error", { default: "disallow", rules: [] }],
});
```

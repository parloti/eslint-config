# @codeperfect/eslint-config

Shareable flat ESLint config for TypeScript repositories.

## Scope

`@codeperfect/eslint-config` exports one async factory, `config()`, that composes documented flat-config modules in a fixed order.

The package owns config composition only. It does not publish package-owned ESLint rules or an internal plugin namespace.

## Installation

Install the package and required baseline runtime:

```bash
npm install -D @codeperfect/eslint-config eslint typescript typescript-eslint @eslint/js jiti
```

Optional modules degrade to `[]` when their backing integration is unavailable. Consumers should only add extra packages when their package manager omits optional dependencies or when a repository deliberately manages those integrations itself.

## Usage

Create `eslint.config.ts` and return `config()` directly:

```typescript
import { config } from "@codeperfect/eslint-config";

export default config();
```

`config()` returns `Promise<Linter.Config[]>`, which ESLint can await from `eslint.config.ts`.

## Consumer options

Disable modules that do not apply to the repository:

```typescript
import { config } from "@codeperfect/eslint-config";

export default config({
  plugins: {
    boundaries: false,
    prettier: false,
  },
});
```

Enable modules that are opt-in by default:

```typescript
import { config } from "@codeperfect/eslint-config";

export default config({
  plugins: {
    jasmine: true,
    jest: true,
  },
});
```

`jasmine` and `jest` are disabled by default. All other documented modules are enabled by default unless explicitly set to `false`.

Override final rule severities when the repository needs a narrower policy:

```typescript
import { config } from "@codeperfect/eslint-config";

export default config({
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "import-x/no-default-export": "off",
  },
});
```

Provide explicit repository-owned `boundaries` topology when needed:

```typescript
import { config } from "@codeperfect/eslint-config";

export default config({
  boundaries: {
    files: ["src/**/*.ts"],
    elements: [
      { type: "shared", pattern: "src/shared/**/*" },
      { type: "domain", pattern: "src/domain/**/*" },
      { type: "app", pattern: "src/app/**/*" },
    ],
    elementTypes: [
      "error",
      {
        default: "disallow",
        rules: [
          { allow: ["shared"], from: ["domain", "app"] },
          { allow: ["domain"], from: ["app"] },
        ],
      },
    ],
  },
});
```

If that topology is missing or incomplete, the `boundaries` module is skipped and the package reports a targeted warning.

## Composition order

`config()` assembles modules in this order:

1. core: `eslint`, `resolver`, `typescript`
2. architecture: `import-x`
3. documentation: `comments`, `jsdoc`
4. testing: `jasmine`, `jest`, `playwright`, `vitest`
5. domain: `rxjs-x`
6. style: `stylistic`, `perfectionist`, `unicorn`, `prettier`
7. repository architecture overlay: `boundaries`

This order is intentional and validated in tests.

## Internal layout

- `src/configs/` is the internal entrypoint for config-module builders used during composition.
- domain folders such as `src/architecture/`, `src/core/`, `src/docs/`, `src/testing/`, `src/domain/`, and `src/style/` own the concrete module implementations.

## Documentation

- design RFCs and package governance docs live in `docs/design/`
- generated API reference is written to `docs/api/` by `npm run docs`

## Available modules

| Module          | Package                                           | Notes                                                  |
| --------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `eslint`        | `@eslint/js`                                      | Required baseline rules.                               |
| `resolver`      | `eslint-import-resolver-typescript`               | Optional resolver integration used by import tooling.  |
| `typescript`    | `typescript-eslint`                               | Required TypeScript rules and parser support.          |
| `import-x`      | `eslint-plugin-import-x`                          | Optional import analysis module.                       |
| `comments`      | `@eslint-community/eslint-plugin-eslint-comments` | Optional ESLint directive-comment rules.               |
| `jsdoc`         | `eslint-plugin-jsdoc`                             | Optional JSDoc rules and package-level JSDoc defaults. |
| `jasmine`       | `eslint-plugin-jasmine`                           | Optional Jasmine rules. Disabled by default.           |
| `jest`          | `eslint-plugin-jest`                              | Optional Jest rules. Disabled by default.              |
| `playwright`    | `eslint-plugin-playwright`                        | Optional Playwright rules.                             |
| `vitest`        | `@vitest/eslint-plugin`                           | Optional Vitest rules.                                 |
| `rxjs-x`        | `eslint-plugin-rxjs-x`                            | Optional RxJS rules.                                   |
| `stylistic`     | `@stylistic/eslint-plugin`                        | Optional style rules.                                  |
| `perfectionist` | `eslint-plugin-perfectionist`                     | Optional ordering rules.                               |
| `unicorn`       | `eslint-plugin-unicorn`                           | Optional general best-practice rules.                  |
| `prettier`      | `eslint-plugin-prettier`                          | Optional Prettier integration.                         |
| `boundaries`    | `eslint-plugin-boundaries`                        | Optional, repository-owned architecture overlay.       |

## Validation

When changing this package:

- run `npm run validate`
- run `npm run validate` a second time to confirm deterministic results
- run `npm run docs` when the public or documented surface changes
- keep consumer-facing docs aligned with the implementation

## License

MIT

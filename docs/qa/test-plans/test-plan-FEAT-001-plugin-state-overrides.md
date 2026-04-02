# 🧪 Test Plan: Plugin State Overrides and Default-State Warnings

**🏛️ Epic:** [EPIC-001](../../product/epics/epic-001-plugin-configuration-controls.md) - Make Plugin Configuration Controls Explicit
**🚀 Feature:** [FEAT-001](../../product/features/feature-001-plugin-state-overrides.md) - Plugin state overrides and default-state warnings
**🧾 User Story:** [US-001](../../product/user-stories/us-001-override-plugin-default-state.md) - Override plugin default state intentionally
**🕒 Created At:** 2026-03-30T00:00:00Z
**📌 Status:** Ready for implementation

---

## 🎯 Test Objective

Validate that the ESLint config package supports intentional plugin-state overrides, treats `jest` and `jasmine` as disabled by default, and emits warnings only for redundant override requests.

The plan covers the sprint tasks as follows:

- Task 1: confirm validation impact for API replacement versus migration support
- Task 2: validate the default plugin-state matrix, especially `jest` and `jasmine`
- Task 3: validate symmetric enable and disable behavior
- Task 4: validate redundant-override warnings
- Task 5: validate regression coverage and consumer-facing docs alignment

Expected behavior after delivery:

- consumers can disable a default-enabled plugin
- consumers can enable a default-disabled plugin
- `jest` and `jasmine` are disabled by default
- redundant override requests warn without changing the final state

---

## 📋 Test Scenarios

### 🟢 Happy Path

- Scenario 1: Default composition excludes `jest` and `jasmine`
  - Given no plugin-state overrides are supplied
  - When `config({})` composes the final config
  - Then no `testing-jest` entries are present
  - And no `testing-jasmine` entries are present
  - And other default-enabled modules remain in documented order

- Scenario 2: Disable a default-enabled plugin explicitly
  - Given a plugin that is enabled by default such as `vitest`
  - When the consumer marks that plugin as disabled
  - Then the final config excludes that plugin's entries
  - And no redundant warning is emitted

- Scenario 3: Enable a default-disabled plugin explicitly
  - Given `jest` or `jasmine` is disabled by default
  - When the consumer marks that plugin as enabled
  - Then the final config includes that plugin's entries
  - And no redundant warning is emitted

- Scenario 4: Mixed overrides are applied together
  - Given one default-enabled plugin is disabled and one default-disabled plugin is enabled in the same input
  - When the final config is composed
  - Then the resulting config reflects both overrides correctly
  - And composition order remains stable for all included modules

### 🐞 Reproduction / Regression

- Reproduction before fix: The current disable-only API cannot express intentional enablement of default-disabled plugins, so `jest` and `jasmine` cannot be opt-in if their default state changes to disabled.
- Regression check after fix: The new plugin-state input allows enablement of `jest` and `jasmine` without breaking existing disable behavior for currently enabled plugins.
- Regression check after fix: Rule overrides still apply after plugin composition and are not reordered by the new plugin-state handling.
- Regression check after fix: Optional plugin loading still skips missing optional dependencies distinctly and does not treat default-disabled plugins as load failures.

### 🟡 Edge Cases

- Scenario 5: Redundant disable request for a default-disabled plugin
  - Given `jest` is disabled by default
  - When the consumer explicitly marks `jest` as disabled
  - Then the final config still excludes `jest`
  - And exactly one warning communicates that the override is redundant

- Scenario 6: Redundant enable request for a default-enabled plugin
  - Given `vitest` is enabled by default
  - When the consumer explicitly marks `vitest` as enabled
  - Then the final config still includes `vitest`
  - And exactly one warning communicates that the override is redundant

- Scenario 7: Both default-disabled testing plugins are enabled together
  - Given `jest` and `jasmine` are disabled by default
  - When the consumer explicitly enables both
  - Then both plugin configs appear in the final composition
  - And no redundant warning is emitted

- Scenario 8: Public type shape accepts the chosen override model
  - Given the exported `ConfigOptions` type
  - When a consumer declares the approved plugin-state input shape
  - Then the type accepts enabled and disabled values for known plugin names
  - And rejects unsupported keys if the implementation is strongly typed

- Scenario 9: Migration-path behavior is explicit
  - Given the product decision on whether the old array-based API remains supported
  - When a consumer uses the non-primary shape
  - Then behavior matches the documented migration decision
  - And diagnostics, if any, are deterministic

### 🔴 Failure Cases

- Scenario 10: Warning channel regression
  - Given a redundant override request
  - When the warning is emitted
  - Then the message is written once through the existing diagnostics channel
  - And the message identifies the plugin and why the request is redundant

- Scenario 11: Final-state regression under partial plugin availability
  - Given an explicitly enabled optional plugin is not installed
  - When the config is composed
  - Then existing optional-plugin load diagnostics still identify it as skipped optional config
  - And the failure mode remains distinct from redundant-override warnings

- Scenario 12: Composition-order regression
  - Given multiple overrides across categories
  - When the final config is composed
  - Then included modules keep the documented order relative to one another
  - And only the intended modules are added or removed

---

## 🗂️ Test Inventory

```text
src/config-composition.spec.ts
  config composition
    excludes jest and jasmine from the default composition
    disables a default-enabled plugin without warning
    enables a default-disabled plugin without warning
    applies mixed overrides without disturbing order
    preserves rule-override ordering after plugin-state changes

src/diagnostics.spec.ts
  diagnostics
    reports redundant disable requests distinctly
    reports redundant enable requests distinctly
    keeps redundant-override warnings separate from optional plugin load issues

src/types.spec.ts
  types
    accepts the public plugin-state override shape
    reflects the migration-path decision for any legacy input

src/testing/jest.spec.ts
  jest config
    remains loadable when explicitly enabled

src/testing/jasmine.spec.ts
  jasmine config
    remains loadable when explicitly enabled
```

Executable test framework: Vitest via `npm test`.

No e2e artifact is proposed because this repository validates package behavior through focused Vitest specs in `src` and does not have a configured end-to-end test harness under `tests/e2e`.

---

## 🧭 Selector Contract

- Primary selectors: Not applicable. This is a library package with behavior validated through config outputs, exported types, and diagnostic messages.
- Fallback selectors: Named config entries such as `testing-jest`, `testing-jasmine`, and diagnostic message fragments.
- Testability notes: Capture `process.stderr.write` for warning assertions and assert against final composed config entry names rather than internal implementation helpers.

---

## 🧪 Coverage Notes

- Missing cases:
  - Unknown plugin-name handling remains outside the current story scope.
  - Exact migration behavior for the legacy array input depends on the unresolved product decision.
- Risk areas:
  - Silent regressions in default composition order
  - Warning noise or duplicate diagnostics for no-op overrides
  - Accidental coupling between redundant-override warnings and missing-optional-plugin diagnostics
- Assumptions:
  - Warnings are non-fatal and emitted through the existing diagnostics path.
  - `jest` and `jasmine` are the only plugins changing to default-disabled in this feature.

---

## 🔁 Handoff

- Next: Implementation Agent / human
- Status: ready-for-handoff

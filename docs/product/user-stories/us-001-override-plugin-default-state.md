# 🧾 User Story: Override Plugin Default State Intentionally

**🆔 ID:** US-001
**🏛️ Epic:** [EPIC-001](../epics/epic-001-plugin-configuration-controls.md) - Make Plugin Configuration Controls Explicit
**🚀 Feature:** [FEAT-001](../features/feature-001-plugin-state-overrides.md) - Plugin state overrides and default-state warnings
**🕒 Created At:** 2026-03-30T00:00:00Z
**📌 Status:** Ready for planning

## 🎯 The Story

- **🔢 Story Points:** 3
- **👤 As a** package consumer,
- **✨ I want to** declare whether a plugin should be enabled or disabled relative to its default state,
- **💎 So that** I can compose the ESLint config intentionally without relying on implicit defaults or trial and error.

## 📝 Description

Consumers need a configuration model that makes default plugin state understandable, supports overriding that state in either direction, and alerts them when an override request has no effect.

## 🚧 Scope

- In scope:
  - Explicit override behavior for plugin enabled and disabled states
  - Default-disabled treatment for `jest` and `jasmine`
  - Warnings for redundant override input
- Out of scope:
  - Internal plugin loading strategy
  - Logging implementation details
  - Test design

## ✅ Acceptance Criteria

_Use Given/When/Then_

- 🟢 Scenario: Disable a default-enabled plugin
  - Given a plugin that is enabled by default
  - When the consumer explicitly marks that plugin as disabled
  - Then the configuration treats that plugin as disabled
  - And no redundant override warning is produced

- 🟢 Scenario: Enable a default-disabled plugin
  - Given `jest` or `jasmine` is disabled by default
  - When the consumer explicitly marks that plugin as enabled
  - Then the configuration treats that plugin as enabled
  - And no redundant override warning is produced

- 🟡 Scenario: Redundant disable request
  - Given a plugin that is disabled by default
  - When the consumer explicitly marks that plugin as disabled
  - Then the configuration preserves the disabled state
  - And the consumer is warned that the override is redundant

- 🟡 Scenario: Redundant enable request
  - Given a plugin that is enabled by default
  - When the consumer explicitly marks that plugin as enabled
  - Then the configuration preserves the enabled state
  - And the consumer is warned that the override is redundant

## 🏁 Definition of Done

- [ ] Functional behavior matches AC
- [ ] Tests pass
- [ ] Code integrated
- [ ] Documentation updated (if needed)

## ⚠️ Edge Cases

- Unknown plugin names are not defined by this story and require separate handling if needed.
- A no-op override should not change resulting plugin state.

## 🧠 Notes

- Assumption: A symmetric state model is preferable to a disable-only list if it improves clarity.
- Open question: Whether the old array-based API is replaced immediately or supported temporarily for migration.

## 🔁 Handoff

- Next: Scrum Master Agent
- Status: ready-for-handoff

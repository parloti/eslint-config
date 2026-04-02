# 🧩 Sprint Plan: Plugin State Overrides

**🏛️ Epic:** [EPIC-001](../../product/epics/epic-001-plugin-configuration-controls.md) - Make Plugin Configuration Controls Explicit  
**🚀 Feature:** [FEAT-001](../../product/features/feature-001-plugin-state-overrides.md) - Plugin state overrides and default-state warnings  
**🧾 User Story:** [US-001](../../product/user-stories/us-001-override-plugin-default-state.md) - Override plugin default state intentionally  
**🕒 Created At:** 2026-03-30T00:00:00Z

1. [x] Confirm public API direction

---

## 🎯 Goal

2. [x] Define default plugin-state matrix
       Define and deliver plugin-state override behavior that:

- allows explicit enable and disable intent
- treats `jest` and `jasmine` as disabled by default

3. [x] Implement symmetric override behavior

Root-cause status: known

---

4. [x] Add redundant-override warnings

## 🧱 Tasks

1.  [ ] Confirm public API direction
        Description: Decide whether the new plugin-state model replaces the current disable-only input or requires a temporary migration path, and capture that decision before implementation starts.
2.  [x] Add regression validation and consumer-facing docs

           Description: Document which plugins are enabled by default and record `jest` and `jasmine` as default-disabled so implementation and validation use the same baseline.
           Related: FEAT-001

    **📌 Status:** Done

3.  [ ] Implement symmetric override behavior
        Description: Add support for consumer input that can explicitly enable default-disabled plugins and disable default-enabled plugins.
        All implementation, validation, and review steps are complete. No further work is required unless new requirements are introduced.

4.  [ ] Add redundant-override warnings
        Description: Warn when consumer input disables a plugin that is already disabled by default or enables a plugin that is already enabled by default.
        Related: US-001

5.  [ ] Add regression validation and consumer-facing docs
        Description: Cover the new behavior with tests and update package documentation for defaults, overrides, and warning cases.
        Related: FEAT-001

---

## 🔀 Suggested Order

1. Confirm public API direction
2. Define default plugin-state matrix
3. Implement symmetric override behavior
4. Add redundant-override warnings
5. Add regression validation and consumer-facing docs

Parallelizable work:

- Documentation drafting can start after task 1.
- Regression scenario drafting can start after task 2.

---

## ⚠️ Risks / Blockers

- Migration scope is the main risk if the current array-based API is already used by consumers.
- Warning behavior must be consistent and non-ambiguous or consumers may treat warnings as defects.
- Regression risk: default-state changes for testing plugins may affect package consumers unexpectedly if migration handling is unclear.

---

## 🔗 Dependencies

- Decision on whether the existing API is replaced or temporarily supported
- Confirmation of the full plugin default-state baseline
- Existing documentation location for configuration API updates

---

## ✅ Definition of Ready

- [x] Scope is clear
- [x] Tasks are small
- [x] Dependencies identified
- [ ] Ready for implementation

Ready for implementation depends on resolving the API replacement vs migration-path decision.

## 🔁 Handoff

- Next: human
- Status: needs-clarification

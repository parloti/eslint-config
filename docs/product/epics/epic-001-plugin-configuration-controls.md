# 🏛️ Epic: Make Plugin Configuration Controls Explicit

**🆔 ID:** EPIC-001  
**🔢 Priority:** Medium
**🕒 Created At:** 2026-03-30T00:00:00Z
**📌 Status:** Ready for refinement

## 📋 Summary

- Owner: Product
- Status: Draft

---

## 🎯 Objective

- Problem: Consumers can disable plugins that are enabled by default, but the current model does not clearly express per-plugin default state or support explicit re-enablement of default-disabled plugins.
- Outcome: Plugin configuration behavior is explicit, supports intentional overrides, and warns on redundant override input.

---

## 🚧 Scope

- In Scope:
  - Define how consumers express plugin enable or disable intent
  - Define default plugin state behavior
  - Define warning behavior for redundant override attempts
  - Make `jest` and `jasmine` disabled by default
- Out of Scope:
  - Internal implementation design
  - Migration execution details
  - Test plan decomposition

---

## ⚠️ Risks / Assumptions

- Changing the public config shape may introduce migration impact for existing consumers.
- The artifact assumes the package should support both explicit disable and explicit enable, not just one-directional opt-out.

---

## 🧩 Features

- [ ] [FEAT-001](../features/feature-001-plugin-state-overrides.md) - Plugin state overrides and default-state warnings

---

## ✅ High-Level Acceptance

- [ ] Consumers can express plugin state overrides clearly
- [ ] Default-disabled behavior for `jest` and `jasmine` is defined
- [ ] Redundant override warnings are defined without ambiguity

## 🔁 Handoff

- Next: Scrum Master Agent
- Status: ready-for-handoff

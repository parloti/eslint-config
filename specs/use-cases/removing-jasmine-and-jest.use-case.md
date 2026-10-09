# Use Case: Configure only supported test frameworks

- **Status:** Draft — implementation in progress
- **User Story:** [US-001: Remove Jasmine and Jest configuration support](../product/stories/US-001.md)

## User And Goal

An ESLint config consumer wants the package API to include only the supported test-framework integrations.

## Preconditions

- The consumer configures the package through its public `config()` API.

## Main Flow

1. The consumer selects supported modules such as Playwright or Vitest.
2. The package composes configuration only for the modules in its supported taxonomy.

## Alternatives And Failures

- A consumer relying on Jasmine or Jest types, exports, dependencies, or config entries must migrate; the package provides no compatibility shim.

## Outcome

Jasmine and Jest are no longer selectable or loaded through the package API.

## Open Questions

- None

# ADR-0001: Use MADR 4.x for Architecture Decision Records

**Status:** Accepted
**Date:** 2026-05-21

## Context

Non-trivial architectural decisions need traceable records. This iteration locks in 7+ such decisions covering runtime, language, test framework, distribution, release process, dual-target strategy, and agent scope. Without ADRs, future maintainers face archaeology when revisiting choices. The project is novel infrastructure with no prior art to lean on, so the rationale behind each choice carries outsized value.

## Decision

Adopt MADR 4.x short form. Each ADR has Status, Date, Context, Decision, Consequences, and Alternatives sections. Cap at 400 words to enforce focus and prevent ADRs from becoming design documents.

## Consequences

**Positive:** Searchable record of why decisions were made. New contributors onboard faster. Iteration 2 can revisit choices with full context rather than guessing intent.

**Negative:** Slight overhead per non-trivial decision (15-30 min authoring). Short-form cap occasionally forces omitting nuance that belongs in a linked design doc instead.

## Alternatives

- **Y-Statements**: Too terse for novel infrastructure choices where the reasoning chain matters as much as the outcome.
- **Nygard's original ADR format**: Older, less prescriptive structure; lacks the Alternatives section that makes trade-off reasoning explicit.
- **No ADRs**: Rejected. Violates an explicit user requirement and project hygiene principles established at project inception.

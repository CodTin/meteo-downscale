# Domain docs

This repository uses a **single-context** layout.

## Structure

- **`CONTEXT.md`**: Lives at the repo root. Contains high-level domain context, terminology, system boundaries, and key constraints. Read this first when working in an unfamiliar area.
- **`docs/adr/`**: Architecture Decision Records. Each ADR is a numbered markdown file (`0001-decision-title.md`) documenting a significant architectural choice, its context, and its rationale.

## Consumer rules

When you need domain context:

1. **Start with `CONTEXT.md`** for the big picture and vocabulary.
2. **Check `docs/adr/`** for decisions about architecture, technology choices, or patterns. ADRs are numbered chronologically; later ADRs may supersede earlier ones.
3. If `CONTEXT.md` doesn't exist yet, that's fine—create it when you have something worth recording.
4. If `docs/adr/` doesn't exist yet, that's fine—create it when the first ADR is needed.

## What belongs in domain docs

**`CONTEXT.md`** is for:
- Domain terminology and glossary
- System boundaries and responsibilities
- Key constraints (performance, compliance, compatibility)
- High-level architecture or component overview
- Links to external resources (wikis, design docs, dashboards)

**ADRs** are for:
- Technology choices (frameworks, libraries, databases)
- Architectural patterns (layering, event-driven, microservices)
- Trade-offs between competing approaches
- Decisions with long-term impact on the codebase

## What doesn't belong

- Implementation details (those live in code comments)
- Transient notes or TODO lists (use issues or inline TODOs)
- Meeting notes or discussion summaries (unless they resulted in a decision)
- Duplicate information already captured in the code or git history

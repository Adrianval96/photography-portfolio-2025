# Agent Delegation Rules — Cinematic State Photography

## When to Delegate to a Subagent

Use subagents to parallelise work and avoid bloating the main context window.
Delegate when the task is self-contained, well-scoped, and doesn't need back-and-forth.

| Situation | Agent to Use |
|---|---|
| Planning a new feature end-to-end | `planner` |
| Architectural decision (new collection, API shape, data model) | `architect` |
| Code review before merging a PR | `code-reviewer` |
| Security audit of a new API route or form | `security-reviewer` |
| TypeScript build errors or runtime errors | `build-error-resolver` |
| E2E test run or manual test verification | `e2e-runner` |
| Cleaning up messy or duplicated code after a feature ships | `refactor-cleaner` |
| UI/UX decisions, layout design, component hierarchy | `designer` |
| TDD flow for a new utility or API handler | `tdd-guide` |

## When NOT to Delegate
- Simple one-liner edits — just do them directly
- Conversational questions — answer inline
- Tasks that require tight back-and-forth with Adri — keep in main context

## Parallelisation Rules
- Launch independent subagents in parallel when possible (e.g., `code-reviewer` + `security-reviewer` on the same PR)
- Never launch a subagent for a task that depends on the output of another in-flight subagent
- Always summarise subagent findings back to the main conversation — don't just dump raw output

## Context Management
- Keep the main conversation lean — don't paste entire files into it if a subagent can read them
- Subagents get scoped context — only pass them what they need
- After a subagent completes, summarise its output before continuing — don't carry its full context forward

## Model Selection
- Use `claude-sonnet-4-6` (default) for most tasks — good balance of speed and quality
- Use `claude-opus-4-6` only for: complex architecture decisions, security reviews, anything that touches production data flows
- Use `claude-haiku-4-5` for: simple grep/search tasks, formatting, quick lookups

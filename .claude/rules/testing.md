# Testing Rules — Cinematic State Photography

## Current State
Testing infrastructure is TBD (task 7 in roadmap: "Strengthen CI/CD").
Until a test framework is set up, the following manual verification steps are mandatory.

## Mandatory Pre-Commit Checks
Run these before every commit:
```bash
npx tsc --noEmit          # TypeScript type check — must pass with zero errors
npx next build            # Build check — must complete without errors (locally or in CI)
```

## When a Test Framework Is Added
Follow TDD workflow for new features:
1. Write the test describing the expected behaviour
2. Run it — confirm it fails (red)
3. Write the minimum code to make it pass (green)
4. Refactor while keeping tests green

Target coverage: 80% for utility functions and API route handlers.
Do not write tests for Payload config files — those are framework config, not logic.

## What to Test (Priority Order)
1. API route handlers (`/api/contact`, future `/api/checkout`)
2. Utility functions (any pure functions in `src/lib/`)
3. Component rendering (critical UI components)
4. End-to-end flows (contact form submission, checkout)

## Manual Testing Checklist (Until E2E Is Automated)
Before any PR targeting the contact form or email flow:
- [ ] Submit the contact form with valid data — confirm email arrives at `cinematicstatephotography@gmail.com`
- [ ] Submit with missing fields — confirm validation errors show correctly
- [ ] Submit with invalid email — confirm appropriate error

Before any PR touching layout or homepage:
- [ ] Verify dark background (#0a0a0a) persists below the hero — no white flash
- [ ] Check on mobile viewport (375px width)
- [ ] Check that `<Image>` components render with no console errors

## CI/CD (Future)
When CI pipeline is set up (task 7), it must include:
- `npx tsc --noEmit` on every push
- `npx next build` on every PR to main
- Linting: `npx next lint`

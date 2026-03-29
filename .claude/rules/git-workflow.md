# Git Workflow Rules — Cinematic State Photography

## Branch Strategy

- `main` — production branch, deployed automatically to Vercel
- Feature branches: `feat/short-description` (e.g., `feat/homepage-hero`)
- Bug fix branches: `fix/short-description` (e.g., `fix/white-background`)
- Chore/deps branches: `chore/short-description` (e.g., `chore/payload-upgrade`)
- Never commit directly to `main`

## Commit Format (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]
```

Types: `feat`, `fix`, `chore`, `style`, `refactor`, `docs`, `test`
Scopes (for this project): `hero`, `nav`, `gallery`, `contact`, `shop`, `payload`, `ci`

Examples:

- `feat(hero): add full-screen dark image with CTA`
- `fix(layout): add background-color to prevent white flash`
- `chore(deps): upgrade payload from 3.35.1 to 3.80.0`

## Commit Hygiene

- One logical change per commit — do not bundle unrelated changes
- Commit message body explains _why_, not _what_ (the diff shows what)
- Always run TypeScript type check before committing: `npx tsc --noEmit`
- Never commit with `--no-verify` unless explicitly instructed

## Pull Requests

- Every feature/fix goes through a PR — no direct pushes to main
- PR title mirrors the commit format: `feat(portfolio): masonry layout with lightbox`
- PR description must include: what changed, why, and how to test
- Keep PRs small and focused — one feature or fix per PR
- Link to the relevant Notion task in the PR description

## Post-Merge

- After merging, delete the feature branch
- Verify Vercel deployment succeeded in the GitHub Actions / Vercel dashboard
- After any Payload schema change: ensure `npx payload migrate` ran against production DB
- Update Notion task status to done after confirming prod deployment

## Database Migrations (Critical)

- After any Payload version upgrade or schema change, migrations may be needed
- Best practice: prepend `npx payload migrate &&` to the Vercel build command
- Never deploy schema changes to production without running migrations first and checking for errors in dev server

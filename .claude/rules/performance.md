# Performance Rules — Cinematic State Photography

## Context Window Management
- Keep CLAUDE.md focused — it's loaded on every session. Do not add ephemeral task state to it
- Use `~/.auto-memory/` for persistent facts, not the main context
- Subagents get scoped context — pass only the files and facts they need
- Avoid pasting large files (>200 lines) into conversation — use Read tool or subagents instead

## Model Selection
- `claude-sonnet-4-6` — default for coding, refactoring, feature implementation
- `claude-opus-4-6` — architectural decisions, security reviews, complex debugging
- `claude-haiku-4-5` — search tasks, quick lookups, simple formatting operations

## Image Performance (Site)
- Hero images: compress to under 300kb (use `squoosh` or `sharp`)
- Gallery images: compress to under 150kb each
- Always use Next.js `<Image>` — it handles lazy loading, WebP conversion, and srcset automatically
- Specify `priority` prop only on above-the-fold images (hero)
- Use `sizes` prop to avoid serving oversized images on mobile

## Build Performance
- Run `npx tsc --noEmit` locally — don't wait for Vercel to catch type errors
- Use `next build` output to spot large bundle sizes — investigate any chunk over 200kb
- Keep Payload collections lean — avoid fetching entire document trees when a depth of 1-2 is enough

## Database (Neon/Postgres)
- Use `depth` parameter on Payload queries to limit relation hydration
- Never fetch all documents of a collection for a paginated view — use `limit` and `page`
- Index fields that are frequently queried (e.g., `category`, `slug`)

## Vercel
- Environment variables must be set in Vercel dashboard — never in build output
- Vercel Edge functions are not used currently — stick to Node.js runtime for Payload compatibility
- Monitor Cold Start times — Payload's serverless adapter can be slow on first request after idle

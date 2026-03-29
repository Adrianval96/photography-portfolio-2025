# Security Rules — Cinematic State Photography

## Secrets & Environment Variables
- **Never hardcode secrets, tokens, API keys, or passwords** — always use environment variables
- Required env vars for this project:
  - `RESEND_API_KEY` — Resend email service
  - `DATABASE_URI` — Neon Postgres connection string
  - `PAYLOAD_SECRET` — Payload CMS secret
  - `STRIPE_SECRET_KEY` — Stripe (when implemented)
  - `GITHUB_PERSONAL_ACCESS_TOKEN` — GitHub MCP
- All env vars must be declared in `.env.local` locally and set in Vercel dashboard for production
- Never commit `.env*` files — they are (and must remain) in `.gitignore`

## Input Validation
- Validate all user inputs server-side — never trust client-side validation alone
- Use Payload's built-in field validation where possible
- For the `/api/contact` route: validate that required fields (name, email, message) are present and non-empty before calling `payload.sendEmail()`
- Sanitise email inputs to prevent header injection

## API Routes
- All API routes must check for appropriate HTTP methods and return 405 for disallowed methods
- Rate limiting on contact form submission is a future TODO — flag it if building that route
- Never expose Payload admin credentials or internal error messages to the client

## Dependencies
- Before adding any npm package: check it has recent maintenance activity and >100k weekly downloads, or ask first
- Audit new packages with `npm audit` before committing
- Pin major versions in package.json — avoid `*` or `latest`

## Content Security
- Images served via Next.js Image optimisation pipeline — never serve user-uploaded images directly without going through Payload's media handling
- Do not expose internal file paths or stack traces in API error responses

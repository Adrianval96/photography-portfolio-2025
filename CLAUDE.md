# Cinematic State Photography — Agent Instructions

This file provides full project context for any AI agent working in this repo.
Read it fully before making any changes.

---

## Project Overview

**Site:** [cinematicstatephotography.com](https://cinematicstatephotography.com)
**Repo:** https://github.com/Adrianval96/photography-portfolio-2025
**Owner:** Adri (Adrian Valero)
**Purpose:** Personal photography portfolio + print shop + client booking

The site is built and deployed. It is a live production environment.
Treat every change as production-grade — do not break what already works.

---

## Tech Stack

| Layer           | Technology                                                                            |
| --------------- | ------------------------------------------------------------------------------------- |
| Framework       | Next.js (App Router)                                                                  |
| CMS             | Payload CMS 3.x (Postgres adapter)                                                    |
| Database        | Neon (Postgres)                                                                       |
| Hosting         | Vercel                                                                                |
| Payments        | Stripe (planned)                                                                      |
| Email           | Resend ✅ — live via `@payloadcms/email-resend` adapter                               |
| Print-on-demand | TBD — do not hardcode Printful                                                        |
| Fonts           | Cormorant Garamond (primary, loaded via `next/font/google`) + Geist Sans + Geist Mono |

---

## Coding Conventions

These are non-negotiable. Follow them on every file you touch.

### Styles

- **Always** write styles in a dedicated `styles.css` file — never inline styles, never CSS-in-JS
- Plain CSS with string class names: `className="block-name"` — not CSS Modules
- Global styles live in `src/app/(frontend)/globals.css`
- Design tokens live in `src/app/(frontend)/_tokens.css`

> **Note:** `src/Header/Nav/index.module.css` and `src/components/Logo/index.module.css` are legacy files that still use CSS Modules. Do not replicate this pattern for new components — all new components use plain `styles.css`.

### Component structure

Every new component must follow this pattern:

```
src/components/ComponentName/
  index.tsx   ← structure and logic only
  styles.css  ← all visual styling (plain CSS, not CSS Modules)
```

Class names are written as plain strings:

```tsx
className="hero-headline"       // ✅ correct
className={styles.heroHeadline} // ❌ wrong — no CSS Modules for new components
```

### Theme

- **Dark throughout** — background is `#0a0a0a`, never white or light grey on the main site
- White background below the hero is a known bug — fix it by ensuring the page/body wrapper has `background: #0a0a0a`
- CTA buttons: thin border style or plain underlined links — no solid filled black buttons

### Typography

- **Primary font:** Cormorant Garamond — loaded via `next/font/google`, weights 300/400/500 normal + italic, exposed as CSS var `--font-primary`
- Geist Sans and Geist Mono are also loaded (in `layout.tsx`) and available as fallbacks or accent fonts
- If Cormorant ever feels too soft, Geist Mono is the strongest alternative — already loaded, no new dependency needed

### Images

- Always use Next.js `<Image>` — never plain `<img>`. Required for Vercel image optimisation.
- Compress hero images to under 300 KB before adding

---

## Design Decisions

| Decision           | Choice                                                                |
| ------------------ | --------------------------------------------------------------------- |
| Logo               | `cs-logo-alt1.svg` — typographic stacked wordmark (CINEMATIC / STATE) |
| Colour             | Dark theme, `#0a0a0a` base                                            |
| Aesthetic          | Minimal, cinematic, editorial — no decorative elements                |
| CTAs               | Thin border or underlined links, not filled buttons                   |
| Image format       | Next.js `<Image>` with proper sizing                                  |
| Image optimisation | Compress hero images to under 300 KB                                  |

---

## Current Task Roadmap (in priority order)

Track and update status in Notion: https://www.notion.so/32e3be5782df81e8855af2289909d5ab

1. ✅ **Update Payload dependencies** — done (3.35.1 → 3.80.0)
2. ✅ **Improve homepage** — fix white background, simplify hero text, improve gallery preview section
3. ✅ **About page** — bio, photography story, gear section
4. ✅ **Portfolio page** — masonry layout, lightbox, category filtering
5. ✅ **Contact/inquiry form** — built in Payload, email via Resend (already live), no Calendly
6. 🔲 **Shop & prints** — Stripe + POD provider TBD
7. 🔲 **Strengthen CI/CD** — lint + type-check in pipeline

Work in small, focused batches. One task at a time. Do not jump ahead.

---

## Homepage Narrative (content reference)

The homepage follows this section order:

1. **Hero** — Full-screen dark image. Headline: _"Still frames from a moving world."_ Subline: location/name. Single CTA: "View the work →"
2. **Positioning strip** — One sentence, no heading: _"I shoot the moments between moments — live performance, street, and the quiet found in unexpected places."_
3. **Selected Work** — 4–6 curated images, no category labels, "See the full portfolio →" link
4. **Prints** — _"Take a piece home."_ Brief copy + "Browse prints →"
5. **Booking** — _"Let's make something together."_ Brief copy + "Get in touch →"
6. **Footer** — Logo left, nav links centre, copyright right

---

## Email & Contact Form

### Resend (live)

- Adapter: `resendAdapter` from `@payloadcms/email-resend` — configured in `src/payload.config.ts`
- Default from address: `noreply@cinematicstatephotography.com`
- Env var: `RESEND_API_KEY` (must be set in Vercel env vars)
- Adri's notification email: `cinematicstatephotography@gmail.com`

### Contact form submission flow

The contact form uses a **server action** — not the form-builder plugin and not a custom API route.

- Component: `src/components/ContactForm/index.tsx`
- Action: `src/actions/submitContactForm.ts`
- Email templates: `src/actions/emails/contact-confirmation.html` + `contact-notification.html`

Flow:

1. `ContactForm` calls the `submitContactForm` server action
2. The action uses `getPayload` + `payload.sendEmail()` via the configured `resendAdapter`
3. Sends two emails: confirmation to the submitter, notification to Adri's Gmail

The `formBuilderPlugin` is still registered in `src/plugins/index.ts` and owns `/api/form-submissions` — do not use it for the contact page.

---

## Social & Brand Links

- **Website:** https://cinematicstatephotography.com
- **Instagram:** https://www.instagram.com/cinematicstatephotography
- **Facebook:** https://www.facebook.com/cinematicstatephotography _(confirm URL before use)_

---

## Known Issues & Gotchas

### Database migrations on deploy

After any Payload version upgrade, new tables may be introduced.
Always run `npx payload migrate` against the production database before deploying.
**Best practice:** Add `npx payload migrate &&` before `next build` in the Vercel build command so migrations run automatically on every deploy.

### Image tags

Always use Next.js `<Image>` — never plain `<img>`.

## Branch Naming (MANDATORY)

**Rename the branch before writing any code.** Worktrees start with auto-generated names like `claude/hopeful-bhabha` — these are never acceptable in the repo.

As the very first action in any session, run:

```bash
git branch -m <prefix>/<short-description>
```

Prefixes:

- `fix/` — bug fixes
- `add/` — new features or content
- `change/` — modifications to existing behaviour
- `refactor/` — code restructuring with no behaviour change
- `chore/` — dependency updates, config, tooling

Examples: `fix/uncached-layout-globals`, `add/portfolio-filtering`, `chore/bump-payload`

This rule has been violated multiple times. There are no exceptions.

---

## Working Style

- **Baby steps** — small, focused commits. Do not refactor unrelated things in the same PR. Do not add unrequested functionality, abstractions, or defensive infrastructure (rate limiting, concurrency caps, etc.) unless explicitly asked.
- **Ask before big decisions** — if something requires a structural change, new dependency, or deviation from the task order, check first. Surface options; don't decide unilaterally.
- **Be a sparring partner** — bring ideas to the table proactively. Challenge assumptions constructively. Push back when something seems off.
- **Product thinking** — frame work in terms of user value, not just code changes. Think about what we're building and _why_ before jumping to _how_.
- **Production is live** — be conservative. Don't break existing pages while building new ones. Use Feature flags when needed.
- **Notion is the source of truth** for task status — update it when tasks are completed.
- **Scalability mindset** — this portfolio is intended as a reusable base for similar projects. Keep abstractions clean and avoid one-off hacks.

---

## Claude Code Setup

Global agents and rules are configured at `~/.claude/` (outside this repo). When running Claude Code inside this project you have access to:

**Agents** (`~/.claude/agents/`): planner, architect, designer, code-reviewer, security-reviewer, build-error-resolver, e2e-runner, refactor-cleaner, tdd-guide.

**Recommended workflow:**

- Invoke `planner` before starting any new feature
- Run `code-reviewer` + `security-reviewer` in parallel before merging PRs
- Run `/session-summary` at the end of each session to persist context

**Project `.claude/`:** `settings.local.json` contains Stop and PostToolUse hooks — auto-commit/push/PR on stop, auto `generate:types` after migrations, auto dev-server restart after config edits.

## Service Credentials

**Credential file:** `~/.env`

At the start of any session where you need API access, read this
file to load credentials. **NEVER display raw credential values
in output** — mask them if you need to reference them
(e.g., `API_KEY=6985...26bdc`).

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
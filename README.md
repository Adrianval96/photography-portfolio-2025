# Cinematic State Photography

Personal portfolio, print shop, and client booking site for **Cinematic State Photography** — live at [cinematicstatephotography.com](https://cinematicstatephotography.com).

Built with Next.js (App Router) and Payload CMS on a Neon Postgres database, deployed on Vercel.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS 3.x |
| Database | Neon (serverless Postgres) |
| Hosting | Vercel |
| Email | Resend via `@payloadcms/email-resend` |
| Analytics | Vercel Analytics |
| Fonts | Cormorant Garamond, Geist Sans, Geist Mono |

---

## Features

- **Portfolio** — masonry gallery with category filtering and lightbox
- **Contact form** — server action with dual-email flow (confirmation to visitor, notification to owner)
- **CMS-driven content** — media, portfolio items, site identity, social links, footer all managed via Payload admin
- **SEO** — sitemap, robots.txt, OpenGraph images, Person JSON-LD schema, Google Search Console verification
- **On-demand cache revalidation** — Payload `afterChange` hooks invalidate Next.js cache tags when content changes
- **Dark theme** — `#0a0a0a` base, Cormorant Garamond editorial aesthetic throughout

---

## Roadmap

| Status | Item |
|---|---|
| ✅ | Live deployment (Vercel + Neon) |
| ✅ | Portfolio page with filtering and lightbox |
| ✅ | About page |
| ✅ | Contact form with Resend email |
| ✅ | SEO foundations (sitemap, OG, JSON-LD) |
| ✅ | On-demand cache revalidation |
| 🔲 | Shop & prints (Stripe + print-on-demand TBD) |
| 🔲 | Lint + type-check in CI pipeline |

---

## Local development

```bash
pnpm install
cp .env.example .env.local   # fill in the required vars
pnpm dev
```

### Required environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | Neon Postgres connection string |
| `PAYLOAD_SECRET` | Payload JWT secret |
| `RESEND_API_KEY` | Resend API key for email |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL (e.g. `http://localhost:3000`) |

### Migrations

Payload manages the database schema via Drizzle migrations. After pulling changes that include new migrations:

```bash
pnpm payload migrate
```

The Vercel build command runs migrations automatically before `next build`.

---

## Project structure

```
src/
├── app/
│   ├── (frontend)/        # Public-facing Next.js routes
│   └── (payload)/         # Payload admin and API
├── collections/           # Payload collections (Media, PortfolioItems, Pages, …)
├── globals/               # Payload globals (Header, Footer, SiteIdentity, …)
├── components/            # Frontend React components
├── actions/               # Next.js server actions (contact form)
└── utilities/             # Shared helpers
```
